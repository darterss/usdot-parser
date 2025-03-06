const client = require("../client/client");
const fs = require("fs");

async function workerTask(workerData) {
    const { path, proxy } = workerData;
    const clientInstance = new client(path, proxy);

    const email =  await clientInstance.getEmail();
    fs.appendFileSync('./results/output.txt', `${clientInstance.path}:${email}\n`);
}

module.exports = workerTask;