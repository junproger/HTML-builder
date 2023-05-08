const path = require('node:path');
const fs = require('node:fs/promises');

const DIR = path.join(__dirname, 'secret-folder');

(async function() {
  try {
    const dirents = await fs.readdir(DIR, {withFileTypes: true});
    dirents.forEach(dirent => {
      if (dirent.isFile()) {
        const PATH = path.join(DIR, dirent.name);
        const [ FN, FE ] = (dirent.name).split('.');
        listFiles(PATH, FN, FE);
      }
    });
  } catch (error) {
    console.error(error);
  }
}());

async function listFiles(PATH, FN, FE) {
  try {
    const STATS = await fs.stat(PATH);
    if (STATS.isFile()) {
      console.log(`${FN} - ${FE} - ${STATS.size/1000}kb`);
    }
  } catch (error) {
    console.log(error);
  }
}
