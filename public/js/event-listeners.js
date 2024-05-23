// Adiciona os manipuladores de eventos para elementos específicos da página.

import { handleFormSubmit } from './form-handler.js';
import { addProductToTable } from './table-handler.js';
import { autocomplete } from './autocomplete.js';
import { productCodes, productNames, userNames } from './form-handler.js';
import { exportToExcel } from './export-handler.js';

document.getElementById('exportExcelButton').addEventListener('click', exportToExcel);

document.getElementById('motivo').addEventListener('change', function () {
    if (this.value === 'VENCIDO') {
        document.getElementById('dataVencimentoGroup').style.display = 'block';
    } else {
        document.getElementById('dataVencimentoGroup').style.display = 'none';
    }
});

document.getElementById('productForm').addEventListener('submit', handleFormSubmit);

document.getElementById('exportExcelButton').addEventListener('click', exportToExcel);
