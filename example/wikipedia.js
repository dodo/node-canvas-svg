
require.paths.unshift(__dirname+'/../deps/node-canvas/lib');
require.paths.unshift(__dirname+'/../deps/node-htmlparser/lib');

var fs = require('fs'),
    sys = require('sys'),
    http = require('http'),
    CanvasSvg = require('../lib/canvas-svg');

CanvasSvg.load.debug = true;

CanvasSvg.load(function (err) {
    if (err) throw err;

    var svg = "";
    var wikimedia = http.createClient(80, 'upload.wikimedia.org');
    var request = wikimedia.request("/wikipedia/commons/a/a2/ECGbasic.svg",
                                    {'host':'upload.wikimedia.org'});
    request.end();
    request.on('response', function (response) {
        console.log('STATUS: ' + response.statusCode);
        console.log('HEADERS: ' + JSON.stringify(response.headers));
        response.setEncoding('utf8');
        response.on('data', function (chunk) {svg += chunk;});
        response.on('end', function () {
            console.log("data fetched");
            CanvasSvg.svg.render(svg, function (err, canvas) {
                console.log("image rendered");
                if (err) throw err;
                var out = fs.createWriteStream('wikipedia.png'),
                    png = canvas.createPNGStream();
                sys.pump(png, out);
                png.on('end', function () {
                    out.end();
                });
                out.on('close', function () {
                    console.log("png saved");
                    process.exit();
                });
            });
        });
    });
});


