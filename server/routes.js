const express = require("express");
const router = express.Router();
const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");

const getCollection = () => {
    const client = getConnectedClient();
    const collection = client.db("todosdb").collection("todos");
    return collection;
}

// GET /todos
router.get("/todos/get", async (req, res) => {
    const collection = getCollection();
    const todos = await collection.find({}).toArray();

    res.status(200).json(todos);
});

// POST /todos
router.post("/todos/add", async (req, res) => {
    const collection = getCollection();
    let { todo } = req.body;

    if (!todo) {
        return res.status(400).json({ mssg: "error no todo found"});
    }

    todo = (typeof todo === "string") ? todo : JSON.stringify(todo);

    const newTodo = await collection.insertOne({ todo, status: false });

    res.status(201).json({ todo, status: false, _id: newTodo.insertedId });
});

// DELETE /todos/:id
router.delete("/todos/delete/:id", async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);

    const deletedTodo = await collection.deleteOne({ _id });

    res.status(200).json(deletedTodo);
});

// PUT /todos/:id
router.put("/todos/update/:id", async (req, res) => {
    console.log("update too");
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    const { status, todo } = req.body;

   
    const updateFields = {};
    if (typeof status !== "undefined") {
        if (typeof status !== "boolean") {
            return res.status(400).json({ mssg: "Invalid status" });
        }
        updateFields.status = status;
    }
    if (typeof todo !== "undefined") {
        if (typeof todo !== "string" || todo.trim().length === 0) {
            return res.status(400).json({ mssg: "Invalid todo content" });
        }
        updateFields.todo = todo.trim();
    }

  
    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ mssg: "No valid fields to update" });
    }

    const updatedTodo = await collection.updateOne({ _id }, { $set: updateFields });

    if (updatedTodo.matchedCount === 0) {
        return res.status(404).json({ mssg: "Todo not found" });
    }

    res.status(200).json({ acknowledged: updatedTodo.acknowledged, modifiedCount: updatedTodo.modifiedCount });
});


module.exports = router;