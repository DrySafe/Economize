const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Serve os arquivos estáticos

let produtos = [];
let productCount = 0;

app.post('/addProduct', (req, res) => {
    const { codigo, produto, quantidade, motivo, dataVencimento } = req.body;
    productCount++;
    produtos.push({ numero: productCount, codigo, produto, quantidade, motivo, dataVencimento });
    res.json({ message: 'Produto adicionado com sucesso!', produtos });
});

app.get('/getProducts', (req, res) => {
    res.json(produtos);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
