const path = require('node:path');
const { createReadStream } = require('node:fs');

const FILE = path.join(__dirname, 'text.txt');
const ReadStream = createReadStream(FILE, 'utf8');

ReadStream.on('error', error => console.log(error.message));
ReadStream.on('data', chunk => console.log(chunk));
ReadStream.on('end', () => ReadStream.close());
