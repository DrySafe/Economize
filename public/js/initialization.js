//Configura inicializações e carrega produtos no carregamento da página.

import { addProductToTable } from './table-handler.js';
import { autocomplete } from './autocomplete.js';

const productCodes = [];
const productNames = [];
const userNames = [];

window.onload = function () {
    fetch('/getProducts')
        .then(response => response.json())
        .then(data => {
            data.forEach(produto => addProductToTable(produto));
        });

    autocomplete(document.getElementById('codigo'), productCodes);
    autocomplete(document.getElementById('produto'), productNames);
    autocomplete(document.getElementById('usuario'), userNames);
};
