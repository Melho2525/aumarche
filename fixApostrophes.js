#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const EXTENSIONS = ['.tsx', '.jsx', '.ts', '.js'];
const ROOT_DIR = process.cwd();

function walkDir(dir, callback) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
    const fullPath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (EXTENSIONS.includes(path.extname(fullPath))) {
      callback(fullPath);
    }
  });
}

function fixUnescapedApostrophes(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex simple pour matcher les apostrophes dans JSX (entre quotes, backticks, ou texte brut)
  // Ce regex vise les apostrophes seules non échappées dans le JSX ou dans les strings JSX.
  // Attention, il ne corrige pas dans les commentaires ou strings JS normaux (ce qui est OK).
  // On remplace uniquement dans les portions JSX (texte entre > ... <) et dans les attributs JSX.

  // Variante simple : remplacer ' par &apos; sauf dans les strings JS (entre " ou ')
  // mais en pratique c’est dur, on fait une correction globale ciblée :
  // -> On remplace les apostrophes seules dans les chaînes JSX (pas dans le code JS)

  // Pour éviter les faux positifs, on remplace uniquement les apostrophes qui ne sont pas précédées par un backslash (non échappées).
  // On remplace aussi les apostrophes dans les chaînes JSX (contenu entre balises).

  // Comme c’est complexe, on se limite ici à une correction large : on remplace les apostrophes simples dans les chaînes JSX.

  // Pour cela, on cible les apostrophes dans les blocs JSX par une regex simplifiée :

  // Cette regex remplace les apostrophes seules non échappées dans le contenu JSX (entre > ... <) ou dans le contenu des strings JSX, à éviter si c’est dans du code JS.

  // Plus pragmatique : on remplace toutes les apostrophes seules qui ne sont pas dans du code, c’est à dire on remplace dans tout le fichier, sauf dans les imports ou exports.
  // Mais c’est trop risqué.

  // Donc, on va juste remplacer toutes les apostrophes dans le fichier par &apos; sauf dans les imports ou exports.  
  // Vu que c’est trop dangereux, on se limite à la règle du linter : remplacer uniquement dans JSX le caractère `'`.

  // Solution simple : remplacer les apostrophes qui apparaissent entre les guillemets doubles (attribut JSX) et dans le texte JSX.

  // Donc on remplace tout ' qui est dans une chaîne JSX (entre balises) ou dans attribut JSX.

  // Pour être sûr, on remplace juste dans les chaînes JSX (entre >...<) :

  const regexJSXText = />[^<]*'/g; // apostrophes dans le texte entre balises
  content = content.replace(regexJSXText, match => match.replace(/'/g, '&apos;'));

  // On remplace aussi dans les attributs JSX (entre double quotes)
  const regexJSXAttr = /="\s*[^"]*'/g;
  content = content.replace(regexJSXAttr, match => match.replace(/'/g, '&apos;'));

  // On remplace aussi dans les templates literals dans JSX (entre backticks) si besoin (optionnel)

  // On peut aussi faire une correction globale moins risquée : remplacer les apostrophes seules dans les strings JSX uniquement.

  // Pour rappel, dans le problème typique on remplace le message d'erreur dans JSX : 'Erreur inconnue lors de l&apos;inscription'

  // Si tu veux un truc sûr et simple, tu peux chercher le pattern `'` dans le fichier et remplacer directement par `&apos;` dans tout le fichier.

  // WARNING : ça peut casser les strings JS normales, donc attention.

  // Ici, on remplace les apostrophes qui apparaissent dans les chaînes JSX (texte entre balises) uniquement.

  // Si besoin, tu peux faire une sauvegarde avant modification.

  if (content.includes("'")) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fichier corrigé : ${filePath}`);
  }
}

console.log('Correction automatique des apostrophes non échappées dans JSX...');

walkDir(ROOT_DIR, fixUnescapedApostrophes);

console.log('Correction terminée.');
