import { pool } from '../helper/db.js'
import { auth } from '../helper/auth.js'
import { Router } from 'express'
import { getTasks } from '../controllers/TaskController.js'
import { ApiError } from '../helper/apierror.js'

const router = Router()

router.get('/', getTasks)

/*router.get('/', (req, res, next) => {
    pool.query('SELECT * FROM task',(err, result) => {
        if(err) {
            return next (err)
        }
        res.status(200).json(result.rows)
    })
}) */

router.post('/create', auth,(req, res, next) => {
    const { task } = req.body

    if (!task || !task.description) {
        return next(new ApiError('Task description is required',400))
    }

    pool.query('insert into task (description) values ($1) returning *', [task.description],
        (err, result) => {
            if (err) {
                return next(err)
            }
            res.status(201).json({id: result.rows[0].id, description: task.description})
        })
})

router.delete('/delete/:id', (req, res, next) => {
    const { id } = req.params

    console.log(`Deleting task with id: ${id}`)
    pool.query('delete from task WHERE id = $1',
        [id], (err, result) => {
            if (err) {
                return next (err)
            }
            if (result.rowCount === 0) {
                return next (ApiError('Task not found'),404)
            }
            return res.status(200).json({id:id})
        })
})

export default router