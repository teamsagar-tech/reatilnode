const fs = require('fs');

function rewriteFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Extract contacts from req.body
  content = content.replace(
    /contactPerson, email, mobileNumber, mobileNumber2, mobileNumber3, contactNumber2, contactNumber3,/g,
    `email, contacts,`
  );

  // Update INSERT query
  content = content.replace(
    /contact_person, email, mobile_number1, mobile_number2, mobile_number3, contact_number2, contact_number3,/,
    `email, dynamic_contacts,`
  );
  content = content.replace(
    /contactPerson \|\| null,\n\s*email \|\| null,\n\s*mobileNumber \|\| null,\n\s*mobileNumber2 \|\| null,\n\s*mobileNumber3 \|\| null,\n\s*contactNumber2 \|\| null,\n\s*contactNumber3 \|\| null,/,
    `email || null,\n        contacts ? JSON.stringify(contacts) : null,`
  );
  // Remove 5 extra question marks in VALUES. Originally there were 31 values. 
  // We removed 7 columns and added 2 (email, dynamic_contacts), so net -5 columns.
  // Wait, no. Old: contact_person, email, mobile_number1, mobile_number2, mobile_number3, contact_number2, contact_number3 (7 columns)
  // New: email, dynamic_contacts (2 columns)
  // We need to replace 7 `?,` with 2 `?,` in VALUES
  // Let's just use string replace for the exact VALUES clause in createParty
  content = content.replace(
    /VALUES \(\?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?\)/,
    `VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  // Update UPDATE query
  content = content.replace(
    /contact_person = \?, email = \?, mobile_number1 = \?, mobile_number2 = \?, mobile_number3 = \?, contact_number2 = \?, contact_number3 = \?,/,
    `email = ?, dynamic_contacts = ?,`
  );
  // In UPDATE parameters:
  content = content.replace(
    /contactPerson \|\| null,\n\s*email \|\| null,\n\s*mobileNumber \|\| null,\n\s*mobileNumber2 \|\| null,\n\s*mobileNumber3 \|\| null,\n\s*contactNumber2 \|\| null,\n\s*contactNumber3 \|\| null,/,
    `email || null,\n        contacts ? JSON.stringify(contacts) : null,`
  );

  fs.writeFileSync(filePath, content);
  console.log('Processed ' + filePath);
}

rewriteFile('backend/controllers/partyController.js');
