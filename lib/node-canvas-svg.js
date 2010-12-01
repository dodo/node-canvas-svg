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


exports.svg.render = function (svg, /*options, callback*/) {
    var args = new Vargs(argmuents);
    if (!svg)
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

    var obj = jsdom.jsdom("<html><body>" + svg + "</body></html>"); // FIXME meh :(
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

    svg.canvg(win, doc, DOMParser)(canvas, svg, options);
};



