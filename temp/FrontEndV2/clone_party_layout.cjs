const fs = require('fs');

const masterPath = './src/pages/masters/accounting/PartyMaster.tsx';
const modalPath = './src/components/inventory/PartyModal.tsx';

let masterContent = fs.readFileSync(masterPath, 'utf-8');
let modalContent = fs.readFileSync(modalPath, 'utf-8');

// 1. Extract the form layout block from PartyMaster.tsx
const blockStartStr = `                  <div className='flex flex-col flex-1 gap-4 overflow-y-auto pb-4 custom-scrollbar pr-2'>`;
const blockEndStr = `                  {/* Action Buttons */}`;
const blockStartIndex = masterContent.indexOf(blockStartStr);
const blockEndIndex = masterContent.indexOf(blockEndStr, blockStartIndex);

if (blockStartIndex === -1 || blockEndIndex === -1) {
  console.error("Could not find block in PartyMaster.tsx");
  process.exit(1);
}

// In PartyModal.tsx, we want the block to start with `        <div className='flex flex-col flex-1 gap-4 overflow-y-auto p-4 custom-scrollbar pr-2'>`
// so we'll replace the outer div class to match the modal's padding
let masterBlock = masterContent.substring(blockStartIndex, blockEndIndex);
masterBlock = masterBlock.replace(
  `<div className='flex flex-col flex-1 gap-4 overflow-y-auto pb-4 custom-scrollbar pr-2'>`,
  `<div className='flex flex-col flex-1 gap-4 overflow-y-auto p-4 custom-scrollbar pr-2'>`
);
// Remove the leading whitespace so it aligns
masterBlock = masterBlock.split('\n').map(line => line.substring(8)).join('\n');

// 2. Find the target block in PartyModal.tsx
const modalBlockStartStr = `        <div className='flex flex-col flex-1 gap-4 overflow-y-auto p-4 custom-scrollbar pr-2'>`;
const modalBlockEndStr = `        {/* Footer */}`;
const modalBlockStartIndex = modalContent.indexOf(modalBlockStartStr);
const modalBlockEndIndex = modalContent.indexOf(modalBlockEndStr, modalBlockStartIndex);

if (modalBlockStartIndex === -1 || modalBlockEndIndex === -1) {
  console.error("Could not find block in PartyModal.tsx");
  process.exit(1);
}

// Replace the block
modalContent = modalContent.substring(0, modalBlockStartIndex) + masterBlock + "        " + modalContent.substring(modalBlockEndIndex);

// 3. Fix the state object in PartyModal.tsx to match PartyMaster.tsx
const stateOldStr = `  const [formData, setFormData] = useState({
    // Basic Party Info
    partyName: initialPartyName,
    shortName: '',
    type: 'Sundry Creditor (Vendor)',
    openingBalance: 0,
    // Legal Info
    gstin: '',
    panNumber: '',
    state: '',
    stateCode: '',
    // Address Info
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    pincode: '',
    city: '',
    taluka: '',
    district: '',
    // Contact Info
    contacts: [{ type: 'Office', name: '', mobile: '' }],
    email: '',
    // Bank Info
    accountName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branch: '',
    accountType: 'Savings',
    gstRawData: null as any
  });`;

const stateNewStr = `  const [formData, setFormData] = useState({
    gstin: '', panNumber: '', state: '', stateCode: '',
    partyName: initialPartyName || '', shortName: '', type: 'Sundry Creditor (Vendor)',
    line1: '', line2: '', line3: '', pincode: '', city: '', taluka: '', district: '',
    contactPerson: '', mobileNumber: '', email: '',
    contacts: [{ type: 'Office', name: '', mobile: '' }],
    accountName: '', bankName: '', accountNumber: '', ifsc: '', branch: '', bankAccountType: 'Savings',
    gstRawData: null as any,
    openingBalance: 0
  });`;

modalContent = modalContent.replace(stateOldStr, stateNewStr);

// Fix the useEffect resetting form data
const effectOldStr = `        partyName: initialPartyName || '',
        shortName: '',
        type: 'Single Brand',
        openingBalance: 0,
        gstin: '',
        panNumber: '',
        state: '',
        stateCode: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        taluka: '',
        pincode: '',
        mobileNumber: '',
        email: '',
        contactPerson: '',
        designation: '',
        bankName: '',
        branch: '',
        accountNumber: '',
        ifscCode: '',
        swiftCode: '',
        gstRawData: null`;

const effectNewStr = `        gstin: '', panNumber: '', state: '', stateCode: '',
        partyName: initialPartyName || '', shortName: '', type: 'Sundry Creditor (Vendor)',
        line1: '', line2: '', line3: '', pincode: '', city: '', taluka: '', district: '',
        contactPerson: '', mobileNumber: '', email: '',
        contacts: [{ type: 'Office', name: '', mobile: '' }],
        accountName: '', bankName: '', accountNumber: '', ifsc: '', branch: '', bankAccountType: 'Savings',
        gstRawData: null as any,
        openingBalance: 0`;

modalContent = modalContent.replace(effectOldStr, effectNewStr);

// Fix the payload in handleSaveParty
const payloadOldStr = `      const payload = {
        gstin: formData.gstin,
        panNumber: formData.panNumber,
        state: formData.state,
        stateCode: formData.stateCode,
        partyName: formData.partyName,
        shortName: formData.shortName,
        type: formData.type,
        line1: formData.addressLine1,
        line2: formData.addressLine2,
        line3: formData.addressLine3,
        pincode: formData.pincode,
        city: formData.city,
        taluka: formData.taluka,
        district: formData.district,
        email: formData.email,
        contacts: formData.contacts,
        accountName: formData.accountName,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        ifsc: formData.ifscCode,
        branch: formData.branch,
        bankAccountType: formData.accountType,
        gstRawData: formData.gstRawData,
        openingBalance: Number(formData.openingBalance) || 0,
        categories: categories,
        brands: brands
      };`;

const payloadNewStr = `      const payload = {
        ...formData,
        openingBalance: Number(formData.openingBalance) || 0,
        categories: categories,
        brands: brands
      };`;

modalContent = modalContent.replace(payloadOldStr, payloadNewStr);

// Fix the reset after save
const resetOldStr = `        setFormData({
          partyName: '', shortName: '', type: 'Single Brand', openingBalance: 0,
          gstin: '', panNumber: '', state: '', stateCode: '',
          addressLine1: '', addressLine2: '', addressLine3: '', pincode: '', city: '', taluka: '', district: '',
          contactPerson: '', mobileNumber: '', email: '', contactPerson2: '', mobileNumber2: '', contactPerson3: '', mobileNumber3: '',
          accountName: '', bankName: '', accountNumber: '', ifscCode: '', branch: '', accountType: 'Savings',
          gstRawData: null
        });`;

const resetNewStr = `        setFormData({
          gstin: '', panNumber: '', state: '', stateCode: '',
          partyName: '', shortName: '', type: 'Sundry Creditor (Vendor)',
          line1: '', line2: '', line3: '', pincode: '', city: '', taluka: '', district: '',
          contactPerson: '', mobileNumber: '', email: '',
          contacts: [{ type: 'Office', name: '', mobile: '' }],
          accountName: '', bankName: '', accountNumber: '', ifsc: '', branch: '', bankAccountType: 'Savings',
          gstRawData: null as any,
          openingBalance: 0
        });`;

modalContent = modalContent.replace(resetOldStr, resetNewStr);

fs.writeFileSync(modalPath, modalContent);
console.log('Successfully cloned PartyMaster layout into PartyModal');
