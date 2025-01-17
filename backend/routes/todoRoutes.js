const { Todo } = require('../models/Todo');
const router = require('express').Router();

// Get all todos
router.get('/', async (req, res) => {
    try {
        const todos  = await Todo.find({}).sort({isPinned: -1, createdAt: -1 });
        if(todos) res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({
            error: 'Something went wrong. Please try again later.',
            details: error.message
        });
        
    }
});

// Create a new todo
router.post('/', async (req, res) => {
    let { title = '', description = '' } = req.body;

    // Trim inputs
    title = title?.trim();
    description = description?.trim();

    // Validation
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required.' });
    }

    try {
        // Create and save todo
        const newTodo = new Todo({ title, description });
        const savedTodo = await newTodo.save();

        // Success response
        res.status(201).json(savedTodo);
    } catch (error) {
        console.error(`Error saving todo: ${error.message}`); // Log error for debugging
        res.status(500).json({
            msg: 'Failed to add Todo to the list.',
            error: error.message,
        });
    }
});


router.put('/:id', async (req, res) => {
    const { id } = req.params; 
    const updates = req.body; 

    try {
        // Find the todo by ID and update only the provided fields
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            updates, // Update only the provided fields
            {
                new: true, // Return the updated document
                runValidators: true, // Ensure validation rules are applied
            }
        );

        // If the todo with the given ID was not found
        if (!updatedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        // Respond with the updated todo
        res.json(updatedTodo);
    } catch (error) {
        // Handle errors (e.g., invalid ID format or database issues)
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});




// DELETE q todo
router.delete('/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;