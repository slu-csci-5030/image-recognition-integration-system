const fs = require('fs');
const plist = require('plist');
const path = require('path');
// Get version from package.json
const { version } = require(path.resolve(__dirname, '../../package.json'));



// ------------- Update Android build.gradle -------------
const androidBuildGradlePath = './android/app/build.gradle';
let buildGradle = fs.readFileSync(androidBuildGradlePath, 'utf8');

// Update versionName and versionCode (increment versionCode each time)
const versionCode = version.split('.').reduce((acc, num, idx) => acc + parseInt(num) * Math.pow(100, 2 - idx), 0);

buildGradle = buildGradle.replace(/versionName ".*"/, `versionName "${version}"`);
buildGradle = buildGradle.replace(/versionCode \d+/, `versionCode ${versionCode}`);

fs.writeFileSync(androidBuildGradlePath, buildGradle);
console.log(`✅ Updated Android versionName to ${version} and versionCode to ${versionCode}`);

// ------------- Update iOS Info.plist -------------
const iosPlistPath = './ios/App/App/Info.plist'; // Adjust if necessary
const plistContent = fs.readFileSync(iosPlistPath, 'utf8');
const plistData = plist.parse(plistContent);

plistData.CFBundleShortVersionString = version;
plistData.CFBundleVersion = version; // Or versionCode if you want an incrementing build number

const updatedPlist = plist.build(plistData);
fs.writeFileSync(iosPlistPath, updatedPlist);
console.log(`✅ Updated iOS CFBundleShortVersionString and CFBundleVersion to ${version}`);
