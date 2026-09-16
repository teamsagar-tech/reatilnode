const fs = require('fs');

function rewriteFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace old contacts columns with dynamic_contacts
  const oldColsRegex = /`contact_person` VARCHAR\(100\) NULL,\s+`email` VARCHAR\(255\) NULL,\s+`mobile_number1` VARCHAR\(20\) NULL,\s+`mobile_number2` VARCHAR\(20\) NULL,\s+`mobile_number3` VARCHAR\(20\) NULL,\s+`contact_number2` VARCHAR\(20\) NULL,\s+`contact_number3` VARCHAR\(20\) NULL,/;
  
  content = content.replace(
    oldColsRegex,
    `\`email\` VARCHAR(255) NULL,\n  \`dynamic_contacts\` JSON NULL,`
  );

  fs.writeFileSync(filePath, content);
  console.log('Processed ' + filePath);
}

rewriteFile('backend/database/008_parties_schema.sql');
