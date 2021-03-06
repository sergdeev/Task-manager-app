const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Task = require('../models/task')


router.delete('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }

})


router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
   

})

// Get /tasks?completed=false
// Get /tasks?limit=100&skip=20
// Get /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.comleted) {
        match.comleted = re.query.comleted === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        // const task = await Task.findOne({ owner: req.user._id})
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }

})

router.get('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, owner: req.user._id})

        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }

})

router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if(isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'})
    }
    try {
        const task = await Task.findOne({ _id, owner: req.user._id})
        updates.forEach(update => task[update] = req.body[update])
        await task.save()
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }

})

module.exports = router