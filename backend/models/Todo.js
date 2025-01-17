const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {
    require: true,
    type: String,
  },
  description: String,
  isCompleted: {
    type: Boolean,
    default: false,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
});

const Todo = mongoose.model("Todo", todoSchema);
module.exports = { Todo };
