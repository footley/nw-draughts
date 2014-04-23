#!/usr/bin/env node
var program = require('commander');
var fs = require('fs');
var exec = require('child_process').exec;

function rmdirrec(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                rmdirrec(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

function copyfiles(inputs, destinations, callback)
{
    var r = fs.createReadStream(inputs.pop());
    r.pipe(fs.createWriteStream(destinations.pop()));
    r.on('close', function(){
        if(inputs.length > 0) {
            copyfiles(inputs, destinations, callback)
        }
        else {
            callback();
        }
    });
}

function cat(inputs, destination, callback) {
    var output = fs.createWriteStream(destination);
    (function __inner(output, inputs) {
        debugger
        var input = fs.createReadStream( inputs.shift() );
        input.pipe(output);
        input.on('end', function () {
            if(inputs.length > 0) {
                __inner(output, inputs);
            }
        });
    })(output, inputs);

    output.on('close', callback)
}

program
    .version('0.0.1')
    .option('-r, --run', 'Run after build')
    .option('-l, --linux', 'Package for linux')
    .option('-w, --windows', 'Package for windows')
    .option('-m, --mac', 'Package for max osx')
    .parse(process.argv);

rmdirrec("output");
fs.mkdirSync("output");
exec("zip -j output/draughts.nw html/* js/* stylesheets/* package.json",
    create_packages);

function create_packages() {
    if (program.linux) {
        fs.mkdirSync("output/linux");
        copyfiles(
            ['resources/node-webkit-v0.9.2-linux-x64/nw',
             'resources/node-webkit-v0.9.2-linux-x64/libffmpegsumo.so',
             'resources/node-webkit-v0.9.2-linux-x64/nw.pak',
             'output/draughts.nw'],
            ['output/linux/nw',
             'output/linux/libffmpegsumo.so',
             'output/linux/nw.pak',
             'output/linux/draughts.nw'],
            function(){
                console.log("linux package created at output/linux/");
                fs.chmodSync('output/linux/nw', 0755)
                if(program.run) {
                    console.log("running linux package");
                    exec("./output/linux/nw output/linux/draughts.nw");
                }
            });
    }

    if (program.windows) {
        fs.mkdirSync("output/windows");
        copyfiles(
            ['resources/node-webkit-v0.9.2-win-ia32/ffmpegsumo.dll',
             'resources/node-webkit-v0.9.2-win-ia32/icudt.dll',
             'resources/node-webkit-v0.9.2-win-ia32/libEGL.dll',
             'resources/node-webkit-v0.9.2-win-ia32/libGLESv2.dll',
             'resources/node-webkit-v0.9.2-win-ia32/nw.pak'],
            ['output/windows/ffmpegsumo.dll',
             'output/windows/icudt.dll',
             'output/windows/libEGL.dll',
             'output/windows/libGLESv2.dll',
             'output/windows/nw.pak'],
            function(){
                exec("cat resources/node-webkit-v0.9.2-win-ia32/nw.exe output/draughts.nw > output/windows/draughts.exe", function(){
                    exec("zip -j output/windows/nw-draughts.zip output/windows/*", function(){
                        console.log("windows package created at output/windows/nw-draughts.zip");
                        if(program.run) {
                            console.log("running windows package");
                            exec("./output/windows/draughts.exe");
                        }
                    });
                });
            });
    }

    if (program.mac) {
        fs.mkdirSync("output/macosx");
        exec("cp -R resources/node-webkit-v0.9.2-osx-ia32/node-webkit.app/ output/macosx/nw-draughts.app/", function(){
            exec("cp output/draughts.nw output/macosx/nw-draughts.app/Contents/Resources/app.nw", function() {
                console.log("mac-osx package created at output/macosx/nw-draughts.app");
                if(program.run) {
                    console.log("running windows package");
                    exec("./output/macosx/nw-draughts.app");
                }
            });
        });
    }
}


