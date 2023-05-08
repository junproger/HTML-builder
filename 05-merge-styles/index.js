const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs/promises');

const SOURCE = path.join(__dirname, 'styles');
const BUNDLE = path.join(__dirname, 'project-dist', 'bundle.css');

(async function() {
  try {
    await fs.access(BUNDLE, fs.constants.F_OK);
    await fs.rm(BUNDLE, { recursive: true, force: true });
    await fs.writeFile(BUNDLE, os.EOL);
    readDir();
  } catch (error) {
    await fs.writeFile(BUNDLE, os.EOL);
    readDir();
  }
}());

async function readDir() {
  try {
    const dirents = await fs.readdir(SOURCE, {withFileTypes: true});
    dirents.forEach(dirent => {
      const PATH = path.join(SOURCE, dirent.name);
      if (dirent.isFile() && path.extname(PATH) === '.css') {
        const EXT= (dirent.name).split('.')[1];
        if (EXT === 'css') readCSS(PATH, EXT);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

async function readCSS(PATH, EXT) {
  try {
    const STATS = await fs.stat(PATH);
    const STYLE = await fs.readFile(PATH, { encoding: 'utf8' });
    if (STATS.isFile() && EXT === 'css') addStyles(STYLE);
  } catch (error) {
    console.log(error);
  }
}

async function addStyles(STYLE) {
  try {
    await fs.appendFile(BUNDLE, (STYLE + os.EOL));
  } catch (error) {
    console.log(error);
  }
}
