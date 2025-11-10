import { pool } from "../helper/db.js"
import { Router } from 'express'
import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { ApiError } from "../helper/apierror.js"

const { sign } = jwt

const router = Router()

router.post('/signup', (req, res, next) => {
    const { user } = req.body

    if (!user || !user.email || !user.password) {
        return next(ApiError('Email and password are required'),400)
    }
    hash(user.password, 10, (err, hashedPassword) => {
        if (err) return next(err)

        pool.query('INSERT INTO account (email, password) VALUES ($1, $2) RETURNING *',
            [user.email, hashedPassword],
            (err, result) => {
                if (err) {
                    return next(err)
                }
                res.status(201).json({id: result.rows[0].id, email: user.email})
            })
    })
})

router.post('/signin', (req, res, next) => {
    const {user} = req.body
    if(!user || !user.email || !user.password) {
        return next(ApiError('Email and password are required'), 400)
    }
    pool.query('SELECT * FROM account WHERE email = $1', [user.email], (err, result) => {
        if(err) return next(err)

        if(result.rows.length === 0) {
            return next(ApiError('User not found',404))
        }

        const dbUser = result.rows[0]

        compare(user.password, dbUser.password, (err, isMatch) => {
            if(err) return next(err)

            if(!isMatch) {
                return next(ApiError('Invalid password',401))
            }
        })
        const token = sign({ user: dbUser.email}, process.env.JWT_SECRET_KEY)
        res.status(200).json({
            id: dbUser.id,
            email: dbUser.email,
            token
        })
    })
})

export default router