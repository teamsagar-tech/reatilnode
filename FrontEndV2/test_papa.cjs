const fs = require('fs');
const Papa = require('papaparse');
const file = fs.readFileSync('/Users/ratan/Downloads/RetailNodeV2/sample/Sales Invoice (1).csv', 'utf8');
Papa.parse(file, {
  header: true,
  complete: function(results) {
    console.log("Papa Parse Rows:", results.data.length);
    if (results.data.length > 0) {
      console.log("First row:", results.data[0]);
    }
  }
});
