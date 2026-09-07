const fs = require('fs');

let content = fs.readFileSync('FrontEndV2/src/components/inventory/PartyModal.tsx', 'utf8');

const searchStr = `  const [gstStatusError, setGstStatusError] = useState<string | null>(null);`;
const startIdx = content.indexOf(searchStr);

if (startIdx !== -1) {
    const replacement = `  const [gstStatusError, setGstStatusError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        partyName: initialPartyName || '',
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
        gstRawData: null
      });
      setGstStatus('');
      setGstStatusError(null);
    }
  }, [isOpen, initialPartyName]);`;

    content = content.substring(0, startIdx) + replacement + content.substring(startIdx + searchStr.length);
    fs.writeFileSync('FrontEndV2/src/components/inventory/PartyModal.tsx', content);
    console.log("Successfully patched PartyModal.tsx");
} else {
    console.log("Could not find insertion point in PartyModal.tsx");
}
