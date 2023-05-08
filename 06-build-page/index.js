const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs/promises');

const ASSETS = path.join(__dirname, 'assets');
const COMPONENTS = path.join(__dirname, 'components');
const STYLES = path.join(__dirname, 'styles');
const TEMPLATE = path.join(__dirname, 'template.html');

const DIST_PROJECT = path.join(__dirname, 'project-dist');
const DIST_ASSETS = path.join(__dirname, 'project-dist', 'assets');
const HTML_INDEX = path.join(__dirname, 'project-dist', 'index.html');
const CSS_STYLE = path.join(__dirname, 'project-dist', 'style.css');

(async function() {
  try {
    await fs.access(DIST_PROJECT, fs.constants.F_OK);
    await fs.rm(DIST_PROJECT, { recursive: true, force: true });
    await initialize();
  } catch (error) {
    await initialize();
  }
}());

async function initialize() {
  try {
    await fs.mkdir(DIST_PROJECT, { recursive: true });
    await readAssets(ASSETS, DIST_ASSETS);
    await saveTemplate();
    await readCSSDir();
  } catch (error) {
    console.log(error);
  }
}

async function saveTemplate() {
  try {
    const TEMP_CONTENT = await fs.readFile(TEMPLATE, { encoding: 'utf8' });
    await readCompDir(TEMP_CONTENT);
  } catch (err) {
    console.error(err.message);
  }
}

async function readCompDir(TEMP_CONTENT) {
  try {
    const BUNDLE = [];
    BUNDLE.push(TEMP_CONTENT);
    const dirents = await fs.readdir(COMPONENTS, {withFileTypes: true});
    dirents.forEach(dirent => {
      const PATH = path.join(COMPONENTS, dirent.name);
      if (dirent.isFile() && path.extname(PATH) === '.html') {
        const [ NAME, EXT ] = (dirent.name).split('.');
        if (EXT === 'html') {
          readAndReplace(BUNDLE, PATH, NAME, EXT);
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
}

async function readAndReplace(BUNDLE, PATH, NAME, EXT) {
  try {
    const STAT = await fs.stat(PATH);
    const DATA = await fs.readFile(PATH, { encoding: 'utf8' });
    if (STAT.isFile() && EXT === 'html') {
      if (BUNDLE[0].includes(`{{${NAME}}}`)) {
        BUNDLE[0] = BUNDLE[0].replace(`{{${NAME}}}`, DATA);
        writeIndexHtml(BUNDLE[0]);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function writeIndexHtml(BUNDLE) {
  try {
    await fs.writeFile(HTML_INDEX, (BUNDLE));
  } catch (error) {
    console.log(error);
  }
}

async function readCSSDir() {
  try {
    const dirents = await fs.readdir(STYLES, {withFileTypes: true});
    dirents.forEach(dirent => {
      const PATH = path.join(STYLES, dirent.name);
      if (dirent.isFile() && path.extname(PATH) === '.css') {
        const EXT = (dirent.name).split('.')[1];
        if (EXT === 'css') readStyles(PATH, EXT);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

async function readStyles(PATH, EXT) {
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
    await fs.appendFile(CSS_STYLE, (STYLE + os.EOL));
  } catch (error) {
    console.log(error);
  }
}

async function readAssets(ASSETS, DIST_ASSETS) {
  try {
    await fs.mkdir(DIST_ASSETS, { recursive: true });
    const dirents = await fs.readdir(ASSETS, {withFileTypes: true});
    dirents.forEach(dirent => {
      const SRC = path.join(ASSETS, dirent.name);
      const DIST = path.join(DIST_ASSETS, dirent.name);
      if (dirent.isDirectory()) {
        readAssets(SRC, DIST);
      } else if (dirent.isFile()) {
        copyAssets(SRC, DIST);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

async function copyAssets(SRC, DIST) {
  try {
    await fs.copyFile(SRC, DIST);
  } catch (error) {
    console.log(error);
  }
}
