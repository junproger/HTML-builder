const path = require('node:path');
const fs = require('node:fs/promises');

const DIR = path.join(__dirname, 'files');
const COPY = path.join(__dirname, 'files-copy');

(async function() {
  try {
    await fs.access(COPY, fs.constants.F_OK);
    await fs.rm(COPY, { recursive: true, force: true });
    await initialize();
  } catch (error) {
    await initialize();
  }
}());

async function initialize() {
  try {
    await fs.mkdir(COPY, { recursive: true });
    await readDir();
  } catch (error) {
    console.log(error);
  }
}

async function readDir() {
  try {
    const dirents = await fs.readdir(DIR, {withFileTypes: true});
    dirents.forEach(dirent => {
      if (dirent.isFile) {
        const ORIGIN = path.join(DIR, dirent.name);
        const DOUBLE = path.join(COPY, dirent.name);
        copyDir(ORIGIN, DOUBLE);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

async function copyDir(ORIGIN, DOUBLE) {
  try {
    await fs.copyFile(ORIGIN, DOUBLE);
  } catch (error) {
    console.log(error);
  }
}
