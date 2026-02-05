const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all todos for user
// @route   GET /api/todos
router.get('/', protect, async (req, res) => {
    try {
        const todos = await Todo.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Create a todo
// @route   POST /api/todos
router.post('/', protect, async (req, res) => {
    try {
        const { text } = req.body;
        const todo = await Todo.create({
            userId: req.user.id,
            task: text
        });
        res.status(201).json(todo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Toggle todo completion
// @route   PUT /api/todos/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const todo = await Todo.findByPk(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        if (todo.userId !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        todo.completed = !todo.completed;
        await todo.save();
        res.json(todo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const todo = await Todo.findByPk(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        if (todo.userId !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await todo.destroy();
        res.json({ message: 'Todo removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
