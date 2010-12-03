// FIXME htmlparser

var depdir = __dirname + "/../deps",
    _require = require('./canvas-svg/require')(depdir);


var jsdom = _require('jsdom', 'jsdom/lib/jsdom'),
    vargs = _require('vargs', 'vargs/lib/vargs'),
    overload = _require('node-overload', 'overload', 'lib/overload',
                        'node-overload/lib/overload'),
    Canvas = _require('node-canvas', 'canvas', 'node-canvas/lib/canvas',
                      'canvas/lib/canvas'),

    patch = require('./canvas-svg/patch')(overload),
    Vargs = vargs.Constructor;


var svg = exports.svg = {};


var check_canvg = function () {
    if (svg.canvg) return true;
    throw new Error("You have to load Canvg first."+
        "\nIt should be already in the repo. If not get it from:"+
        " http://code.google.com/p/canvg/");
};


var parse_data = function (data, type) {
    if (type)
        type = {contentType:type};

    var elem = jsdom.jsdom("<html><body>"+data+"</body></html>",null,type).body;

    for(var i=0,l=elem.childNodes.length;i<l;i++) {
        if (elem.childNodes[i].nodeName[0] !== "#")// i hope this isn't dumb
            return [null, elem.childNodes[i]];
    }
    return [new Error("cannot find a proper element in data"), elem];
};


exports.svg.render = function (/*canvas, svgdata, width, height, options, callback*/) {
    check_canvg();
    var args = new Vargs(arguments),
        arglist = args.all.slice(0);

    var svgdata = "", canvas = null;
    if (typeof args.first === 'string') {
        svgdata = arglist.shift();
    } else {
        canvas = arglist.shift();
        svgdata = arglist.shift();
    }

    if (!svgdata)
        return args.callback(new Error("no svg given"), new Canvas(42, 42));

    if (!canvas) {
        var doc = jsdom.jsdom(),
            win = doc.createWindow(),
            DOMParser = function () {
                this.parseFromString = function (data, type) {
                    var res = parse_data(data, type);
                    //if (/*err*/res[0]) ### /*ignored*/ ###
                    //    throw res[0];
                    return { documentElement : patch.nodeName(res[1]) };
                };
            };
        win.DOMParser = true;

        var width, height;
        if (arglist.length > 1) {
            width = arglist.shift();
            height = arglist.shift();

        } else {
            var res = parse_data(svgdata);
            if (/*err*/res[0])
                return args.callback(res[0], new Canvas(42, 42));
            var elem = res[1];
            svgdata = elem.outerHTML; // maybe cleaner

            width = elem.hasAttribute('width') ?
                parseInt(elem.getAttribute('width')) : 42;
            height = elem.hasAttribute('height') ?
                parseInt(elem.getAttribute('height')) : 42;
        }
        canvas = new Canvas(width, height);
    }

    var options = arglist.length ? args.last : {},
        defaults = {
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


exports.Canvas = Canvas;

exports.load = require('./canvas-svg/loader')(depdir, vargs, svg);

