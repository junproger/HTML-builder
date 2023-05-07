const path = require('path');
const fs = require('node:fs/promises');
const DIR = path.join(__dirname, 'secret-folder');

(async function dirFiles() {
  try {
    const dirents = await fs.readdir(DIR, {withFileTypes: true});
    dirents.forEach(dirent => {
      if (dirent.isFile()) {
        const [ FN, FE ] = (dirent.name).split('.');
        const PATH = path.join(DIR, dirent.name);
        fs.stat(PATH)
          .then(STATS => {
            if (STATS.isFile()) {
              console.log(`${FN} - ${FE} - ${STATS.size/1000}kb`);
            }
          })
          .catch(error => console.log(error));
      }
    });
  } catch (error) {
    console.error(error);
  }
}());
