const bcrypt = require('bcrypt');

async function run() {
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
}

run();