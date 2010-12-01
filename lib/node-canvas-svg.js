// FIXME htmlparser

var depdir = __dirname + "/../deps",
    _require = require('./canvas-svg/require')(depdir),

   patch = require('./canvas-svg/patch');

var jsdom = _require('jsdom', 'jsdom/lib/jsdom'),
    vargs = _require('vargs', 'vargs/lib/vargs'),
    Canvas = _require('node-canvas', 'canvas', 'node-canvas/lib/canvas',
                      'canvas/lib/canvas'),
    Vargs = vargs.Constructor;


var svg = exports.svg = {};


var check_canvg = function () {
    if (svg.canvg) return true;
    throw new Error("You have to load Canvg first."+
        "\nIt should be already in the repo. If not get it from:"+
        " http://code.google.com/p/canvg/");
};


exports.svg.render = function (svgdata/*, options, callback*/) {
    check_canvg();
    var args = new Vargs(arguments);
    if (!svgdata)
        return args.callback(new Error("no svg given"), new Canvas(42, 42));

    var doc = jsdom.jsdom(),
        win = doc.createWindow(),
        DOMParser = function () {
            this.parseFromString = function (str, type) {
                var doc = jsdom.jsdom("<html><body>" + str +
                    "</body></html>", null, {contentType:type});
                return {documentElement:patch.nodeName(doc.body.firstChild)};
            };};
    win.DOMParser = true;

    var obj = jsdom.jsdom("<html><body>" + svgdata + "</body></html>"); // FIXME meh :(
    obj = obj.body.firstChild;
    var canvas = new Canvas(
        parseInt(obj.getAttribute('width')),
        parseInt(obj.getAttribute('height')));

    var options = {};
    if (args.length > 1)
        options = args.last;

    var defaults = {
        renderCallback : function () { args.callback(null, canvas) },
        ignoreMouse: true,
        ignoreAnimation: true,
        ignoreDimensions: true,
        ignoreClear: true,
        offsetX: 0,
        offsetY: 0
    };

    var keys = Object.keys(defaults);
    for(var key,i=0,l=keys.length;i<l&&((key=keys[i])||true);i++) {
        if(!(key in options))
            options[key] = defaults[key];
    }

    try {
        svg.canvg(win, doc, DOMParser)(canvas, svgdata, options);
    } catch(e) {
        args.callback(e, canvas);
    }
};

exports.load = require('./canvas-svg/loader')(depdir, vargs, svg);

