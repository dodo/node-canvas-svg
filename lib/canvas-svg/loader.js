
module.exports = function(depdir, vargs, svg) {

var fs = require('fs'),
    path = require('path'),
    Vargs = vargs.Constructor;

// helper

var capsle = function (code, args) {
    code = code || "";
    args = args || ["window", "document","navigator"];
    return "exports="+(function (__args__){__code__}).toString()
        .replace("__args__", args.join(",")).replace("__code__", code);
};


var checkAndReadFile = function (filename, callback) {
    path.exists(filename, function (exists) {
        if (exists) return fs.readFile(filename, callback);
        throw new Error("Cannot find file '" + filename +
        "' but it is hardly required.\n"+
        "It should be already in the repo. If not get it from:"+
        " http://code.google.com/p/canvg/");
    });
};


// main


var result = function () {
    var args = new Vargs(arguments);
    if (result.debug) console.log("* loading canvg rgbcolor …");
    checkAndReadFile(depdir+'/canvg/rgbcolor.js', function (err, rcode) {
        if (err)
            return args.callback(err);

        var code = ["var CanvasRenderingContext2D"];
        if(rcode)
            code.push(rcode);

        if (result.debug) console.log("* loading canvg …");
        checkAndReadFile(depdir+'/canvg/canvg.js', function (err, ccode) {
            if (err)
                return args.callback(err);
            if (ccode)
                code.push(ccode);
            code.push("return canvg");

            code = capsle(code.join(";"), ["window", "document", "DOMParser"]);
            var module = svg.canvg = process.compile(code, "patched-canvg");

            args.callback(null, module);
        });
    });
};


result.debug = false;

return result;
};