const fs = require('fs');

const files = [
  'index.html', 'menu.html', 'admin.html',
  'es/index.html', 'es/menu.html',
  'en/index.html', 'en/menu.html',
  'fr/index.html', 'fr/menu.html',
  'pt/index.html', 'pt/menu.html',
];

// Imágenes críticas que NO deben tener decoding="async"
const criticalClasses = ['home-banner-img', 'logo'];

function esc(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

let totalAdded = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let fileAdded = 0;

  // Buscar todas las imágenes que no tengan decoding y no sean críticas
  const imgRegex = /<img\b([^>]*?)>/g;

  content = content.replace(imgRegex, (match) => {
    // Si ya tiene decoding, skip
    if (/\bdecoding\s*=/.test(match)) return match;

    // Si es una imagen crítica, skip
    if (criticalClasses.some(cls => match.includes(`class="${cls}"`) || match.includes(`class='${cls}'`) || match.includes(`class="${cls} `) || match.includes(` ${cls}"`))) {
      return match;
    }

    // Añadir decoding="async"
    const updated = match.replace(/^<img\b/, '<img decoding="async"');
    fileAdded++;
    return updated;
  });

  fs.writeFileSync(file, content);
  console.log(file + ': ' + fileAdded + ' images updated');
  totalAdded += fileAdded;
}

console.log('---');
console.log('Total: ' + totalAdded + ' images updated');
