const fs = require('fs');
const path = require('path');

const saveButtonSnippet = `
                <div className="flex items-center mt-6 mb-4">
                  <div className="w-[180px]"></div>
                  <div className="flex-1 flex gap-4">
                    <button 
                      onClick={() => setMode('list')}
                      className='bg-[#1b5e58] border border-black text-white px-4 py-1 font-bold text-[12px] hover:bg-[#12423d] shadow-[2px_2px_0_rgba(0,0,0,1)]'
                    >
                      Save (Ctrl+A)
                    </button>
                    <button 
                      onClick={() => setMode('list')}
                      className='bg-[#e0efeb] border border-black text-black px-4 py-1 font-bold text-[12px] hover:bg-[#c9e1dd] shadow-[2px_2px_0_rgba(0,0,0,1)]'
                    >
                      Cancel (Esc)
                    </button>
                  </div>
                </div>
`;

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('Master.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const strToReplace = `                </div>\n              )}`;
      if (content.includes(strToReplace) && !content.includes('Save (Ctrl+A)')) {
        content = content.replace(strToReplace, saveButtonSnippet + strToReplace);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Added save button to:', fullPath);
      }
    }
  }
}

processDir('/Users/ratan/Downloads/frost-pivot/RetailNode/FrontEndV2/src/pages/masters');
