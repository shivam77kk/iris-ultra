const { spawn, execSync } = require('child_process');

console.log('Starting Flutter App...');

// 1. Run the flutter app
const flutter = spawn('flutter', ['run'], { 
    cwd: './mobile',
    stdio: 'inherit',
    shell: true
});

let reversed = false;

// 2. Continually apply the reverse tunnels. 
// flutter run tends to delete adb rules, so we enforce them every 10 seconds.
setInterval(() => {
    try {
        const adbPath = process.env.LOCALAPPDATA + '\\Android\\Sdk\\platform-tools\\adb.exe';
        execSync(`"${adbPath}" reverse tcp:5001 tcp:5001`, { stdio: 'ignore' });
        execSync(`"${adbPath}" reverse tcp:5000 tcp:5000`, { stdio: 'ignore' });
        execSync(`"${adbPath}" reverse tcp:3000 tcp:3000`, { stdio: 'ignore' });
        
        if (!reversed) {
            console.log('\n=========================================');
            console.log('✅ USB NETWORK BRIDGE ESTABLISHED!');
            console.log('You can now log in without network errors.');
            console.log('=========================================\n');
            reversed = true;
        }
    } catch (e) {
        // Ignore silently
    }
}, 10000); // Check every 10 seconds

flutter.on('close', (code) => {
    console.log(`Flutter run exited with code ${code}`);
    process.exit(code);
});
