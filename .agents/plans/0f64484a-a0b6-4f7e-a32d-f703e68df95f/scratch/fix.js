const fs = require('fs');
const path = require('path');

const MASTERS_DIR = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // If it has 5 closing divs before < />, we remove one
  const target = `</div>
          </div>
          </div>
        </div>
      </div>
    </>
  
  );
}`;
  
  const replacement = `</div>
          </div>
        </div>
      </div>
    </>
  );
}`;

  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed:', filePath);
  } else {
    // Also try checking for variations of spaces
    const regex = /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/>\s*\);\s*}/;
    if (regex.test(content)) {
        content = content.replace(regex, `</div>\n          </div>\n        </div>\n      </div>\n    </>\n  );\n}`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed (regex):', filePath);
    }
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

walkDir(MASTERS_DIR);
console.log('Done!');
