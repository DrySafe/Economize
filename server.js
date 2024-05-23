const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

const app = express();
const port = 3500;
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
    
    // Planilha para os produtos existentes
    const worksheet = workbook.addWorksheet('Produtos');
    worksheet.columns = [
        { header: '#', key: 'id', width: 5 },
        { header: 'Código', key: 'codigo', width: 8 },
        { header: 'Produto', key: 'produto', width: 32 },
        { header: 'Quantidade', key: 'quantidade', width: 12 },
        { header: 'Motivo', key: 'motivo', width: 13 },
        { header: 'Data de Vencimento', key: 'dataVencimento', width: 19 },
        { header: 'Usuário', key: 'usuario', width: 12 },
        { width: 3 }, // Coluna 'h'
        { width: 3 }, // Coluna 'I'
        { width: 18 }, // Coluna 'J'
    ];

    // Adicionar os dados para a primeira tabela
    products.forEach((product, index) => {
        const { codigo, produto, quantidade, motivo, dataVencimento, usuario } = product;
        worksheet.addRow({ id: index + 1, codigo, produto, quantidade, motivo, dataVencimento, usuario });
    });

    // Adicionar a nova tabela abaixo dos dados existentes
    const newData = [
        {descricao: 'ROTINA', preco: 1322 },
        {descricao: 'Filial', preco: 3 },
        {descricao: 'Cód Fiscal', preco: 5927 },
        {descricao: 'Conta Avaria', preco: 402020 },
        {descricao: 'Conta Consumidor', preco: 300018 },
        {descricao: 'TOTAL BAIXA', preco: 'R$' },
    ];

    // Definir estilos para a nova tabela
    const boldBorder = { top: { style: 'thick' }, left: { style: 'thick' }, bottom: { style: 'thick' }, right: { style: 'thick' } };

    // Adicionar os dados à nova tabela
    newData.forEach((data, index) => {
        // Adiciona os dados a partir da nona coluna (coluna 'I')
        const row = worksheet.getRow(index + 1);
        row.getCell(9).value = data.id; // Coluna 'I'
        row.getCell(10).value = data.descricao; // Coluna 'J'
        row.getCell(11).value = data.preco; // Coluna 'K'
        // Aplicar negrito para as células da nova tabela
        if (index < 5) {
            row.eachCell({ includeEmpty: false }, (cell) => {
                cell.font = { bold: true };
            });
        }
        // Aplicar bordas grossas para todas as células da nova tabela
        row.eachCell({ includeEmpty: false }, (cell) => {
            cell.border = boldBorder;
        });
    });

    worksheet.getCell('I1').alignment = { horizontal: 'center', vertical: 'middle' };

    // Estilizar a planilha (opcional)
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

            // Adicionar estilos, se necessário

    // Escrever o arquivo Excel e enviar a resposta
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
