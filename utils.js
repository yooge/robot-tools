function log(msg, color) {
    if (color == undefined || color == 'green') {
        console.log("\u001b[32m" + msg + "\u001b[0m ");
    }
    if (color == 'red') {
        console.log('\u001b[31m' + msg + '\u001b[0m\n');
    }
}

module.exports = {log};