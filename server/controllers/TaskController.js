import { insertTask, selectAllTasks } from "../models/task.js"
import { ApiError } from "../helper/apierror.js"

const getTasks = async (req, res,next) => {
    try {
        const result = await selectAllTasks()
        return res.status(200).json(result.rows || [])
    } catch (error) {
        return next(error)
    }
}

const postTask = async (req, res, next) => {
    const { task } = req.body
    try {
        if(!task || !task.description.trim().length === 0) {
            return next(ApiError('Task description is required',400))
        }
        const result = await insertTask(task.description)
        return res.status(201).json({id: result.rows[0].id, description: result.rows[0].description})
    } catch (error) {
        return next(error)
    }
}

export { getTasks, postTask }