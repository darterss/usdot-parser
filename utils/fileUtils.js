const fs = require('fs');

function readProxies(filename) {
    if (fs.existsSync(filename)) {
        return fs.readFileSync(filename, 'utf-8')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line !== "" && !line.startsWith('//'));
    }
    return [];
}

function readFileIfExists(filename) {
    if (fs.existsSync(filename)) {
        return new Set(
            fs.readFileSync(filename, 'utf-8')
                .split('\n')
                .map(line => line.trim())
                .filter(line => line)
        );
    }
    return new Set();
}

function clearResults() {
    if (!fs.existsSync('results')) fs.mkdirSync('results', { recursive: true });
    fs.writeFileSync('./results/output.txt', '');
    fs.writeFileSync('./logs/app.log', '');
}

module.exports = { readFileIfExists, readProxies, clearResults };
