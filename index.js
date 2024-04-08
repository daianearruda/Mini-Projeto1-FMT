
const express = require("express")

const app = express()

app.use(express.json())

let produtos =[]

app.post("/produtos", (req,res) => {
    const produto = req.body
    produto.id = produtos.length > 0 ? produtos[produtos.length - 1].id + 1 : 1

    produtos.push(produto)

    res.status(201).send('Produto adicionado com sucesso ')
})

app.get("/produtos", (req, res) => {
    res.json(produtos)
})

app.get("/produtos/:id", (req, res) => {
    const {id} = req.params
    const produto = produtos.find(produto => produto.id === parseInt(id))
    if (!produto){
        res.status(404).send("Produto não encontrado.")
    }
    res.json(produto)
})

app.put("/produtos/:id", (req, res) => {
    const {id} = req.params
    const newData = req.body
    const index = produtos.findIndex(produto => produto.id === parseInt(id))
    if (index === -1) {
        res.status(404).send("Produto não encontrado.")
    }
    produtos[index] = {...produtos[index],  ...newData }    
    res.status(200).send("Produto atualizado com sucesso.")
    
})

app.delete("/produtos/:id", (req, res) => {
    const {id} = req.params
    const index = produtos.findIndex(produto => produto.id === parseInt(id))
    if (index === -1) {
        res.status(404).send('Produto não encontrado.');
        return
    }
    produtos.splice(index, 1)
    res.status(200).send("Produto deletado com sucesso")
})

app.listen(3000,()=>{
    console.log("Servidor Rodando!")
})