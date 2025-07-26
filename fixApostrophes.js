const fs = require('fs');
const path = require('path');

const foldersToScan = ['app', 'components'];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Remplacer apostrophes dans texte JSX (entre balises <>)
  // C'est une heuristique simple : remplacer ' qui sont dans les contenus textuels (hors code)
  // Pour ça, on remplace ' uniquement si entouré de lettres ou espaces (approximation)
  // Exemple : c'est -> c'est
  // Attention : cette regex peut produire des faux positifs, donc vérifie les changements

  content = content.replace(/(['’])(?=[a-zà-ÿ])/gi, '''); // apostrophe avant une lettre (minuscule ou accentuée)
  content = content.replace(/(?<=[a-zà-ÿ])(['’])/gi, '''); // apostrophe après une lettre

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed apostrophes in ${filePath}`);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  });
}

foldersToScan.forEach(folder => {
  if (fs.existsSync(folder)) {
    walkDir(folder);
  } else {
    console.warn(`Folder "${folder}" does not exist.`);
  }
});
