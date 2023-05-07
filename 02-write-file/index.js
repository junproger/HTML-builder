const os = require('os');
const fs = require('fs');
const path = require('path');
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
