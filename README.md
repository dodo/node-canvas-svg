# node-canvas-svg

drawing svg on a [canvas](https://github.com/LearnBoost/node-canvas) in [node.js](http://nodejs.org/).

## Features

* drawing svg data on canvas

## Installation with git

    git clone https://github.com/dodo/node-canvas-svg.git
    cd node-canvas-svg
    git submodules update --init
    cd deps/node-canvas
    make
    cd ../node-overload
    make

## Motivation

NIH - not invented here ...
srsly .. i want to generate some good looking charts without using javascript on client side (because this is lame for none-interactive images)

## Dependencies

* [canvg](http://code.google.com/p/canvg/)
* [jsdom](https://github.com/tmpvar/jsdom)
* [node-canvas](https://github.com/LearnBoost/node-canvas)
* [node-htmlparser](https://github.com/tautologistics/node-htmlparser)
* [node-overload](https://github.com/bmeck/node-overload)
* [vargs](https://github.com/cloudhead/vargs)

## Usage

    var canvassvg = require('node-canvas-svg');

First you need to load the canvg modules:

    canvassvg.load(function (err, canvg_module) { … });

you can use as well the shorter from:

    canvassvg.load(function (err) { … }); // the module is saved in canvassvg.svg.canvg

# Drawing SVG

    canvassvg.svg.render(svg, function (err, canvas) { … });

or

    canvassvg.svg.render(canvas, svg, function (err, canvas) { … });

width and height can be applied as well:

    canvassvg.svg.render(svg, width, height function (err, canvas) { … });

or

    canvassvg.svg.render(canvas, svg, width, height function (err, canvas) { … });

## Example

Fetching a svg file from wikipedia and return it as png:

 * https://github.com/dodo/node-canvas-svg/example/wikipedia.js

## TODO

* More documentation
* tests
