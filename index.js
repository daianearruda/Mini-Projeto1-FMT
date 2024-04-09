
const express = require("express");

const app = express();
const yup = require('yup');

app.use(express.json());

const PORT = 3000;

let produtos =[];

// Middleware global para logar todas as chamadas
app.use(logRequest);

// Middleware para logar informações de cada chamada
function logRequest(req, res, next) {
    const date = new Date().toISOString();
    console.log(`[${date}] ${req.method} ${req.url}`);
    next();
};

// Definindo um esquema de validação usando Yup
const schemaCriarProduto = yup.object().shape({
    descricao: yup.string(),
    preco: yup.number().positive().integer(),
    quantidade: yup.number().positive().integer(),
  });

// middleware para validação dos dados
const validarDadosProduto = async (req, res, next) => {
    const { body } = req;
  
    try {
      // Validar os dados recebidos no corpo da solicitação
      await schemaCriarProduto.validate(body, { abortEarly: false });
      next(); // Se os dados forem válidos, chame o próximo middleware
    } catch (erro) {
      // Se houver erros de validação, retorne uma resposta com status 400 (Bad Request)
      res.status(400).json({ erro: erro.errors });
    }
  };
  


// Middleware de validação rotas POST e PUT
app.post("/produtos", validarDadosProduto, (req,res) => {
    const produto = req.body
    produto.id = produtos.length > 0 ? produtos[produtos.length - 1].id + 1 : 1

    produtos.push(produto)

    res.status(201).send('Produto adicionado com sucesso ')
});

// Rota para atualizações parciais com PATCH
app.patch("/produtos/:id", validarDadosProduto, (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    const index = produtos.findIndex(produto => produto.id === parseInt(id));
    if (index === -1) {
        return res.status(404).send("Produto não encontrado.");
    }
    // Mesclar os novos dados com os dados existentes do produto
    Object.keys(newData).forEach(key => {
        if (newData[key] !== undefined) {
            produtos[index][key] = newData[key];
        }
    });
    res.status(200).send("Produto atualizado com sucesso.");
});

// Rota para obter informações sobre as rotas disponíveis com OPTIONS
app.options("/produtos", (req, res) => {
    res.setHeader('Allow', 'GET, POST, PUT, DELETE, PATCH');
    res.status(200).send();
});


// Rota para listar todos os produtos
app.get("/produtos", (req, res) => {
    res.json(produtos)
});

// Rota para listar produto com ID
app.get("/produtos/:id", (req, res) => {
    const {id} = req.params
    const produto = produtos.find(produto => produto.id === parseInt(id))
    if (!produto){
        res.status(404).send("Produto não encontrado.")
    }
    res.json(produto)
});

// Rota para atualizar dados do produto através do ID
app.put("/produtos/:id", validarDadosProduto, (req, res) => {
    const {id} = req.params
    const newData = req.body
    const index = produtos.findIndex(produto => produto.id === parseInt(id))
    if (index === -1) {
        res.status(404).send("Produto não encontrado.")
    }
    produtos[index] = {...produtos[index],  ...newData }    
    res.status(200).send("Produto atualizado com sucesso.")
    
});


// Rota para deletar um produto
app.delete("/produtos/:id", (req, res) => {
    const {id} = req.params
    const index = produtos.findIndex(produto => produto.id === parseInt(id))
    if (index === -1) {
        res.status(404).send('Produto não encontrado.');
        return
    }
    produtos.splice(index, 1)
    res.status(200).send("Produto deletado com sucesso")
});


app.listen(PORT,()=>{
    console.log(`Servidor rodando em http://localhost:${PORT}`)
});