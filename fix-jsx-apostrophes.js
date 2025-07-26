#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

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

// Fonction qui remplace les apostrophes non échappées par &apos; dans un texte JSX
function fixApostrophes(text) {
  // On remplace uniquement les apostrophes qui ne sont pas déjà échappées.
  // On évite de toucher aux entités déjà présentes (comme &apos;)
  // Regex simple : remplacer ' par &apos; sauf si précédé par &
  // Exemple : "Erreur d'inscription" => "Erreur d&apos;inscription"
  return text.replace(/([^&])'/g, '$1&apos;');
}

function processFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');

  // Parser le code avec Babel (support JSX + TSX)
  let ast;
  try {
    ast = babelParser.parse(code, {
      sourceType: 'module',
      plugins: [
        'jsx',
        'typescript',
        'classProperties',
        'optionalChaining',
        'nullishCoalescingOperator',
        'decorators-legacy',
      ],
    });
  } catch (parseError) {
    console.error(`Erreur de parsing pour ${filePath}: ${parseError.message}`);
    return;
  }

  let modified = false;

  traverse(ast, {
    // Texte dans JSX (contenu entre balises)
    JSXText(path) {
      const original = path.node.value;
      const fixed = fixApostrophes(original);
      if (fixed !== original) {
        path.node.value = fixed;
        modified = true;
      }
    },

    // Attribut JSX avec string literal, exemple: title="Erreur d'inscription"
    JSXAttribute(path) {
      const val = path.node.value;
      if (val && val.type === 'StringLiteral') {
        const original = val.value;
        const fixed = fixApostrophes(original);
        if (fixed !== original) {
          val.value = fixed;
          modified = true;
        }
      }
      // Parfois, l'attribut peut être JSXExpressionContainer, mais généralement ce sont des expressions JS, on ne touche pas.
    },

    // Texte dans JSXExpressionContainer contenant template literals (rare dans ce contexte)
    JSXExpressionContainer(path) {
      const expression = path.node.expression;
      if (expression && expression.type === 'TemplateLiteral') {
        let changed = false;
        expression.quasis.forEach(quasi => {
          const original = quasi.value.raw;
          const fixed = fixApostrophes(original);
          if (fixed !== original) {
            quasi.value.raw = fixed;
            quasi.value.cooked = fixed;
            changed = true;
          }
        });
        if (changed) modified = true;
      }
    },
  });

  if (modified) {
    const output = generate(ast, {}, code);
    fs.writeFileSync(filePath, output.code, 'utf8');
    console.log(`✅ Fichier corrigé : ${filePath}`);
  }
}

console.log('🚀 Démarrage de la correction des apostrophes non échappées dans JSX...');

walkDir(ROOT_DIR, processFile);

console.log('✅ Correction terminée.');
