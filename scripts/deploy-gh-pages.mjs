import { execSync } from 'node:child_process';
import fs from 'node:fs';

console.log('Compilando versión de producción...');
execSync('npm run build', { stdio: 'inherit' });

console.log('Creando 404.html para rutas SPA en GitHub Pages...');
fs.copyFileSync('dist/index.html', 'dist/404.html');

console.log('Sincronizando con rama gh-pages en GitHub...');
const worktreeDir = '/tmp/gh-pages-sync';
try {
  execSync(`rm -rf ${worktreeDir}`);
  execSync(`git worktree add ${worktreeDir} -B gh-pages`, { stdio: 'inherit' });
  execSync(`cp -r dist/* ${worktreeDir}/`, { stdio: 'inherit' });
  execSync(`cd ${worktreeDir} && git add . && git commit -m "deploy: update GitHub Pages build" && git push -u origin gh-pages -f`, { stdio: 'inherit' });
  console.log('✓ ¡Publicado exitosamente en https://rodrigo1234321.github.io/indec/ !');
} finally {
  try {
    execSync(`git worktree remove ${worktreeDir} --force`);
  } catch (e) {
    // ignore
  }
}
