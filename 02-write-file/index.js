const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');
const { stdout, stdin } = process;

const FILE = path.join(__dirname, 'text.txt');
const OUTPUT = fs.createWriteStream(FILE);

stdout.write('Welcome! Enter text:' + os.EOL);

const ending = () => {
  stdout.write('Ending. Good Luck!' + os.EOL);
  process.exit();
};

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    ending();
  } else {
    OUTPUT.write(data);
  }
});

process.on('SIGINT', ending);
