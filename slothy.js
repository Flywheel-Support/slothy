#!/usr/bin/env node

//Lets us use colors in the terminal output
const chalk = require('chalk');
var pkg = require('./package.json');

//Make sure we were supplied a file to work with; exit if not
if (!process.argv[2]) {
    console.log(chalk.yellow(`${pkg.name} "slothy" v${pkg.version}`));
    console.log(chalk.red.bold.inverse('ERROR:') + ' I need a WordPress slow log file to work with.\nTry it like this: ' + chalk.hex('#999999').inverse('slothy path/to/log'));
    return;
}

//Set up the reader
var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(process.argv[2])
});

//Set up the arguments we'll need
let totalErrors = 0;
let allErrorSources = {};
let thisError = [];

//Greetings and warnings
console.log(chalk.bold.yellow(`Welcome to Slothy v${pkg.version}, the faster WordPress slowlog analyzer!`));
console.log(`(Only use this tool on valid WP slowlog files, or weird stuff will happen.)`);

//Runs for each line in the supplied file
lineReader.on('line', function (line) {
    if (line.match(/^\s*$/)){
        let errorsToPush = [...new Set(thisError)];
        if(errorsToPush.length == 0){ //This means the slow_error we're logging is from wp-core; handle accordingly
            errorsToPush = ['**no_plugin_or_theme**'];
        }
        errorsToPush.forEach(error => {
            if (allErrorSources.hasOwnProperty(error)) {
                allErrorSources[error]++;
            } else {
                allErrorSources[error] = 1;
            }
        })
        thisError = [];
        totalErrors++;
    } else if(line.match(/.+\/(plugins|themes)\/[^\/]*/i)){
        thisError.push(line.match(/\/(plugins|themes)\/[^\/]*/i)[0]);
    }
});

//Runs when the file is done
lineReader.on('close', () => {
    //Sort the errors by descending number of occurrences
    let sortedErrors = Object.entries(allErrorSources).sort((a, b) => {
        return a[1] - b[1]
    })
    .map(error => error.join(' '))
    .reverse();

    //Set up a final string and push formatted stuff into it for the console
    let finalPresentation = '';

    sortedErrors.forEach(errString => {
        const source = errString.match(/^[^\s]+/).toString().padEnd(60);
        const sourceTotal = errString.match(/[0-9]+$/);

        finalPresentation += source + chalk.bold(sourceTotal.toString().padEnd(8)) + `${(sourceTotal / totalErrors * 100).toFixed(2)}%\n`;
    });

    //Final output
    console.log('---');
    console.log(chalk.bold.yellow('TOTAL ERRORS: ') + chalk.bold(totalErrors));
    console.log(chalk.bold.yellow(`SOURCES:`));
    console.log(finalPresentation);
});
