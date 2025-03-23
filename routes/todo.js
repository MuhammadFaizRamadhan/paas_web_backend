const express = require("express");
const router = express.Router();

const db = require("../config/db.js");
const todo = db.todo;

// mendapatkan semua data
router.get("/", async (req,res,next)=>{
    const allTodo =  await todo.findAll()
    res.json({
    result: allTodo
    })
})

// membuat data baru
router.post("/", async (req,res,next)=>{
    const newtodo = {
        nama : req.body.nama,
        kegiatan : req.body.kegiatan
    }

    const result = await todo.create(newtodo)
    res.json(result)
})

// Mengupdate data
router.patch("/:id_todo", async (req, res, next) => {
    const result = await todo.update(req.body, {where: {id_todo: req.params.id_todo}})
    res.json(result)
})

// menghapus data
router.delete("/:id_todo", async (req, res, next) => {
    const result = await todo.destroy({where: {id_todo: req.params.id_todo}})
    res.json(result)
})

module.exports=router