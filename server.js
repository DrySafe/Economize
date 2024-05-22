const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');
const app = express();
const PORT = 3000;

// Configurar middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secreta123',
    resave: false,
    saveUninitialized: true
}));

const users = [{ username: 'admin', password: 'admin123' }];
const products = [];

// Middleware de autenticação
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login.html');
    }
}

// Rotas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/index.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.user = user;
        res.json({ message: 'Login bem-sucedido!' });
    } else {
        res.json({ message: 'Nome de usuário ou senha incorretos.' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logout bem-sucedido!' });
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        res.json({ message: 'Usuário já existe.' });
    } else {
        users.push({ username, password });
        res.json({ message: 'Usuário cadastrado com sucesso!' });
    }
});

app.post('/addProduct', (req, res) => {
    const product = req.body;
    product.userId = req.session.user.username;
    products.push(product);
    res.json({ message: 'Produto adicionado com sucesso!' });
});

app.get('/getProducts', (req, res) => {
    res.json(products);
});

app.get('/currentUser', (req, res) => {
    res.json({ user: req.session.user });
});

app.get('/exportExcel', async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Produtos');

    // Definir as colunas
    worksheet.columns = [
        { header: 'Nº', key: 'number', width: 10 },
        { header: 'Código', key: 'codigo', width: 20 },
        { header: 'Produto', key: 'produto', width: 30 },
        { header: 'Quantidade', key: 'quantidade', width: 15 },
        { header: 'Motivo', key: 'motivo', width: 20 },
        { header: 'Data de Vencimento', key: 'dataVencimento', width: 20 },
        { header: 'Usuário', key: 'userId', width: 20 }
    ];

    // Adicionar dados
    products.forEach((product, index) => {
        worksheet.addRow({
            number: index + 1,
            codigo: product.codigo,
            produto: product.produto,
            quantidade: product.quantidade,
            motivo: product.motivo,
            dataVencimento: product.dataVencimento || '',
            userId: product.userId
        });
    });

    // Estilo para linhas de tabela
    worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
        row.eachCell({ includeEmpty: false }, function (cell, colNumber) {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            if (rowNumber === 1) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFA500' } // Laranja (cabeçalho)
                };
                cell.font = { bold: true };
            } else {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: rowNumber % 2 === 0 ? { argb: 'FFD9B3' } : { argb: 'F0F0F0' } // Laranja claro e Cinza claro
                };
            }
        });
    });

    // Congelar a primeira linha
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];

    // Escrever o arquivo
    const exportFilePath = path.join(__dirname, 'public', 'produtos.xlsx');
    await workbook.xlsx.writeFile(exportFilePath);
    res.download(exportFilePath, 'produtos.xlsx', (err) => {
        if (err) {
            console.error('Erro ao fazer download do arquivo:', err);
        }
        fs.unlinkSync(exportFilePath); // Delete the file after download
    });
});

// Roteamento estático
app.use(express.static('public', {
    index: false,
}));

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

const mongoose = require('mongoose');
