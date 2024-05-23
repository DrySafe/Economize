//Contém a lógica relacionada ao formulário, incluindo a submissão e a edição de produtos.

import { addProductToTable, updateProductInTable } from './table-handler.js';

let productCount = 0;
let editingRow = null;

export const productCodes = [];
export const productNames = [];
export const userNames = [];

export function handleFormSubmit(event) {
    event.preventDefault();

    const codigo = document.getElementById('codigo').value;
    const produto = document.getElementById('produto').value;
    const quantidade = document.getElementById('quantidade').value;
    const motivo = document.getElementById('motivo').value;
    const dataVencimento = document.getElementById('dataVencimento').value;
    const usuario = document.getElementById('usuario').value;

    const produtoData = {
        codigo,
        produto,
        quantidade,
        motivo,
        dataVencimento: motivo === 'VENCIDO' ? dataVencimento : '',
        usuario
    };

    if (editingRow !== null) {
        updateProductInTable(editingRow, produtoData);
        editingRow = null;
        document.getElementById('productForm').reset();
        document.getElementById('dataVencimentoGroup').style.display = 'none';
    } else {
        fetch('/addProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produtoData)
        })
        .then(response => response.json())
        .then(data => {
            alert('Produto adicionado com sucesso!');
            addProductToTable(produtoData);
            document.getElementById('productForm').reset();
            document.getElementById('dataVencimentoGroup').style.display = 'none';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}
