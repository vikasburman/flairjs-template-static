const utils = require('./utils.js');
const buildSettings = require('./.build.json');
const fs = require('fs-extra');
const downloader = require('download-github-repo');
const packageJson = require('../package.json');
const prompt = require('prompt');

// update appgears files
const updateFile = (src, dest, tempFolder, fileName, onDone) => {
    let tempFileName = tempFolder + '/' + fileName,
        tempFile = fs.createWriteStream(tempFileName);

    // download file in temp folder    
    https.get(src + fileName, (res) => {
        res.pipe(tempFile);

        // update
        try {
            let targetFileName = dest + fileName;
            console.log('updating: ' + tempFileName + ' --> ' + targetFileName);
            fs.createReadStream(tempFileName).pipe(fs.createWriteStream(targetFileName));
            onDone(true);
        } catch (e) {
            console.log(e);
            onDone(false);
        }
    }).on('error', (e) => {
        console.log(e);
        onDone(false);
    });
};
const updateFolder = (src, dest, tempFolder, folderName, onDone) => {
    let tempFolderName = tempFolder + '/' + folderName;


};
const updateBP = (cb) => {
    let repo = 'vikasburman/appgears#master',
        tempFolder = './temp.download',
        folders = [
            'app/sample',
            'web/sample',
            'build',
            'sys',
        ],
        files = [
            'gulpfile.js'
        ];

    let onDone = () => {
        // delete temp folder
        fs.removeSync(tempFolder);

        // done
        cb(); 
    };
    
    // create temp folder
    fs.ensureDirSync(tempFolder);

    // download repo
    downloader(repo, tempFolder, (e) => {
        if (e) {
            console.log(e);
        } else {
            // copy all folders as is from downloaded to here
            let tempName = '';
            for(let folder of folders) {
                tempName = tempFolder + '/' + folder;
                console.log('updating: ' + tempName + ' --> ' + folder);
                fs.copySync(tempName, folder);
            };

            // copy all files as is from downloaded to here
            for(let file of files) {
                tempName = tempFolder + '/' + file;
                console.log('updating: ' + tempName + ' --> ' + file);
                fs.createReadStream(tempName).pipe(fs.createWriteStream(file));
            };

            // update package json
            let repoPackageJson = require(tempFolder + '/package.json'),
                added = 0;
            for(let dep in repoPackageJson.devDependencies) {
                if (repoPackageJson.devDependencies.hasOwnProperty(dep)) {
                    if (typeof packageJson.devDependencies[dep] === 'undefined') {
                        packageJson.devDependencies[dep] = repoPackageJson.devDependencies[dep];
                        added++;
                    }
                }
            }
            for(let dep in repoPackageJson.dependencies) {
                if (repoPackageJson.dependencies.hasOwnProperty(dep)) {
                    if (typeof packageJson.dependencies[dep] === 'undefined') {
                        packageJson.dependencies[dep] = repoPackageJson.dependencies[dep];
                        added++;
                    }
                }
            }
            if (added > 0) {
                fs.writeJSONSync('./package.json', packageJson);
                console.log(added + ' packages added in package.json. Run yarn install to install these new dependencies.');
            } else {
                console.log('No new dependency is found.');
            }

            // done
            onDone();
        }
    });
};
exports.updater = function(isDev, isProd, isTest, cb) {
    if (packageJson.name === 'appgears') {
        console.log('IMPORTANT: This update cannot be executed in appgears development environment. Aborted!');
        cb();
    } else {
        console.log('This will update only following from appgears repository. Are you sure you want to do it? Type "yes" to continue.');
        console.log('app/sample/**');
        console.log('web/sample/**');
        console.log('sys/**');
        console.log('build/**');
        console.log('gulpfile.js');
        console.log('package.json - to add any missing packages (it does not remove any package)');
        prompt.start();
        prompt.get(['response'], function (err, result) {
            if (result.response === 'yes') {
                updateBP(cb);
            } else {
                console.log('Aborted!');
                cb();
            }
        });
    }
};