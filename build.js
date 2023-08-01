const { exec } = require('child_process');

console.log('Building application...');

exec("node index.js build", (error, stdout, stderr) => {
    if (error) {
        console.error(`Build failed: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Build error: ${stderr}`);
        return;
    }
    console.log("Build successful!");
});