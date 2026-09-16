const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/PartyModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const newHandleSave = `const handleSave = async () => {
    if (gstStatusError) {
      return alert(\`Cannot save this Party. The GSTIN status is: \${gstStatusError}\`);
    }
    if (!formData.partyName) return alert('Party Name is required');

    setLoading(true);
    try {
      const payload = {
        partyName: formData.partyName,
        shortName: formData.shortName,
        type: formData.type,
        openingBalance: formData.openingBalance,
        gstin: formData.gstin,
        panNumber: formData.panNumber,
        state: formData.state,
        stateCode: formData.stateCode,
        line1: formData.addressLine1,
        line2: formData.addressLine2,
        line3: formData.addressLine3,
        pincode: formData.pincode,
        city: formData.city,
        taluka: formData.taluka,
        district: formData.district,
        contactPerson: formData.contactPerson,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        contactNumber2: formData.contactPerson2, 
        mobileNumber2: formData.mobileNumber2,
        contactNumber3: formData.contactPerson3,
        mobileNumber3: formData.mobileNumber3,
        accountName: formData.accountName,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        ifsc: formData.ifscCode,
        branch: formData.branch,
        bankAccountType: formData.accountType,
        gstRawData: formData.gstRawData,
        categories: categories.length > 0 ? categories : null,
        brands: brands.length > 0 ? brands : null,
        brandType: brandType
      };

      const url = \`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/party\`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${localStorage.getItem('token')}\`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok) {
        onSave({ id: data.partyId, ...payload, name: payload.partyName, brand_type: payload.brandType });
        setFormData({
          partyName: '', shortName: '', type: 'Single Brand', openingBalance: 0,
          gstin: '', panNumber: '', state: '', stateCode: '',
          addressLine1: '', addressLine2: '', addressLine3: '', pincode: '', city: '', taluka: '', district: '',
          contactPerson: '', mobileNumber: '', email: '', contactPerson2: '', mobileNumber2: '', contactPerson3: '', mobileNumber3: '',
          accountName: '', bankName: '', accountNumber: '', ifscCode: '', branch: '', accountType: 'Savings',
          gstRawData: null
        });
        setGstStatusError(null);
        setCategories([]);
        setBrands([]);
        setBrandType('Multi');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to create party');
    } finally {
      setLoading(false);
    }
  };`;

const oldRegex = /const handleSave = async \(\) => \{[\s\S]*?body: JSON\.stringify\(payload\)[\s\S]*?\}\n\s*\};/;
content = content.replace(oldRegex, newHandleSave);
fs.writeFileSync(file, content);
