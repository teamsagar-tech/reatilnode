const fs = require('fs');

// Patch SizeAllocationModal.tsx
const modalFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/SizeAllocationModal.tsx';
let modalContent = fs.readFileSync(modalFile, 'utf8');

// 1. Add to Props
modalContent = modalContent.replace(
    /expectedTotalQty\?: number \| null;\n}/,
    'expectedTotalQty?: number | null;\n  initialMatrixData?: any[];\n}'
);

// 2. Destructure prop
modalContent = modalContent.replace(
    /expectedTotalQty }: SizeAllocationModalProps/,
    'expectedTotalQty, initialMatrixData }: SizeAllocationModalProps'
);

// 3. Update useEffect
modalContent = modalContent.replace(
    /setMatrixData\(\[\]\);/g,
    'if (initialMatrixData && initialMatrixData.length > 0) { setMatrixData(initialMatrixData); } else { setMatrixData([]); }'
);

// 4. Update fetchSizeGroups timeout
const targetFetchTimeout = `setTimeout(() => {
              generateGrid(match, '', '', '', '', 'base-rate');
            }, 0);`;
const replaceFetchTimeout = `setTimeout(() => {
              if (initialMatrixData && initialMatrixData.length > 0) {
                // do nothing, matrix is already set
              } else {
                generateGrid(match, '', '', '', '', 'base-rate');
              }
            }, 0);`;
if(modalContent.includes(targetFetchTimeout)) {
    modalContent = modalContent.replace(targetFetchTimeout, replaceFetchTimeout);
}

fs.writeFileSync(modalFile, modalContent);
console.log("Patched SizeAllocationModal");

// Patch PurchaseInvoice.tsx
const invoiceFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let invoiceContent = fs.readFileSync(invoiceFile, 'utf8');

const targetProps = `expectedTotalQty={activeSizeMatrixRow !== null ? (parseFloat(String(products[activeSizeMatrixRow].qty)) || null) : null}`;
const replaceProps = `expectedTotalQty={activeSizeMatrixRow !== null ? (parseFloat(String(products[activeSizeMatrixRow].qty)) || null) : null}
        initialMatrixData={activeSizeMatrixRow !== null ? products[activeSizeMatrixRow].matrixData : undefined}`;

if (invoiceContent.includes(targetProps)) {
    invoiceContent = invoiceContent.replace(targetProps, replaceProps);
    console.log("Patched PurchaseInvoice props");
}

fs.writeFileSync(invoiceFile, invoiceContent);
