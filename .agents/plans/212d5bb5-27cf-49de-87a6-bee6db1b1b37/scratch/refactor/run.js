const { Project, SyntaxKind } = require("ts-morph");
const path = require("path");

const project = new Project({
  tsConfigFilePath: "/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/tsconfig.app.json",
});

const srcDir = "/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src";
const toastStorePath = path.join(srcDir, "store", "useToastStore.ts");
const confirmStorePath = path.join(srcDir, "store", "useConfirmStore.ts");

const sourceFiles = project.getSourceFiles();

function getRelativeImportPath(fromFile, toFile) {
  let rel = path.relative(path.dirname(fromFile), toFile);
  if (!rel.startsWith(".")) rel = "./" + rel;
  return rel.replace(/\.tsx?$/, "");
}

for (const sourceFile of sourceFiles) {
  let modified = false;
  let needsToast = false;
  let needsConfirm = false;

  const filePath = sourceFile.getFilePath();
  if (filePath === toastStorePath || filePath === confirmStorePath) continue;

  try {
    sourceFile.forEachDescendant((node) => {
      if (node.getKind() === SyntaxKind.CallExpression) {
        const expr = node.getExpression();
        const text = expr.getText();

        if (text === "alert" || text === "window.alert") {
          const args = node.getArguments();
          if (args.length > 0) {
            const argText = args[0].getText();
            let toastType = "warning";
            const lowerArg = argText.toLowerCase();
            if (lowerArg.includes("success") || lowerArg.includes("saved") || lowerArg.includes("generated")) {
              toastType = "success";
            } else if (lowerArg.includes("error") || lowerArg.includes("fail") || lowerArg.includes("cannot") || lowerArg.includes("required") || lowerArg.includes("empty") || lowerArg.includes("not found")) {
              toastType = "error";
            }
            expr.replaceWithText(`toast.${toastType}`);
            needsToast = true;
            modified = true;
          }
        }

        if (text === "confirm" || text === "window.confirm") {
          expr.replaceWithText("await confirmDialog");
          needsConfirm = true;
          modified = true;

          let current = node;
          while (current) {
            if (
              current.getKind() === SyntaxKind.FunctionDeclaration ||
              current.getKind() === SyntaxKind.ArrowFunction ||
              current.getKind() === SyntaxKind.FunctionExpression ||
              current.getKind() === SyntaxKind.MethodDeclaration
            ) {
              if (current.setIsAsync) {
                current.setIsAsync(true);
              }
              break;
            }
            current = current.getParent();
          }
        }
      }
    });

    if (modified) {
      if (needsToast) {
        const existingToast = sourceFile.getImportDeclaration(dec => dec.getNamedImports().some(n => n.getName() === 'toast'));
        if (!existingToast) {
          const relPath = getRelativeImportPath(filePath, toastStorePath);
          sourceFile.addImportDeclaration({ namedImports: ["toast"], moduleSpecifier: relPath });
        }
      }
      if (needsConfirm) {
        const existingConfirm = sourceFile.getImportDeclaration(dec => dec.getNamedImports().some(n => n.getName() === 'confirmDialog'));
        if (!existingConfirm) {
          const relPath = getRelativeImportPath(filePath, confirmStorePath);
          sourceFile.addImportDeclaration({ namedImports: ["confirmDialog"], moduleSpecifier: relPath });
        }
      }
      sourceFile.saveSync();
      console.log(`Refactored: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error on file ${filePath}:`, err.message);
  }
}
console.log("Done.");
