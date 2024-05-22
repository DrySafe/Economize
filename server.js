const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

const app = express();
const port = 3000;
const productsFilePath = path.join(__dirname, 'products.json');

let products = [];

// Verificar se o arquivo JSON de produtos existe e carregá-lo
if (fs.existsSync(productsFilePath)) {
    const productsData = fs.readFileSync(productsFilePath);
    products = JSON.parse(productsData);
}

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/addProduct', (req, res) => {
    const product = req.body;
    products.push(product);
    saveProductsToFile();
    res.json({ message: 'Produto adicionado com sucesso!' });
});

app.get('/getProducts', (req, res) => {
    res.json(products);
});

app.get('/exportToExcel', (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Produtos');

    worksheet.columns = [
        { header: '#', key: 'id', width: 5 },
        { header: 'Código', key: 'codigo', width: 20 },
        { header: 'Produto', key: 'produto', width: 40 },
        { header: 'Quantidade', key: 'quantidade', width: 15 },
        { header: 'Motivo', key: 'motivo', width: 20 },
        { header: 'Data de Vencimento', key: 'dataVencimento', width: 20 },
        { header: 'Usuário', key: 'usuario', width: 20 }
    ];

    products.forEach((product, index) => {
        const { codigo, produto, quantidade, motivo, dataVencimento, usuario } = product;
        worksheet.addRow({ id: index + 1, codigo, produto, quantidade, motivo, dataVencimento, usuario });
    });

    worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
        row.eachCell({ includeEmpty: false }, function (cell, colNumber) {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            if (rowNumber === 1) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'ff9800' } // Laranja (cabeçalho)
                };
                cell.font = { bold: true };
            } else {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: rowNumber % 2 === 0 ? { argb: 'FFF6E7' } : { argb: 'F5F5F5' } // Laranja claro e Cinza claro
                };
            }
        });
    });

    worksheet.views = [{ state: 'frozen', ySplit: 1 }];

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=produtos.xlsx');

    workbook.xlsx.write(res)
        .then(() => {
            res.end();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Erro ao exportar para Excel');
        });
});

// Função para salvar os produtos em um arquivo JSON
function saveProductsToFile() {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 4));
}

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
