

// hack hack hack
var DOMPatch = exports.DOM = function DOMPatch(elem, rules) {
    var that = this;
    rules = rules || {};
    this.__children = [];
    for(var key in elem) {
        if (rules.hasOwnProperty(key)) {
            rules[key](this, key, elem);

        } else if (key === "childNodes") {
            this.__defineGetter__(key, function () {
                return that.__children;
            });
            var children = elem.childNodes;
            for(var n=0,l=children.length;n<l;n++) {
                this.__children.push(new DOMPatch(children[n], rules));
            }

        } else if (key && key[0] !== "_") {
            if (typeof elem[key] === 'function')
                this[key] = (function (k) {
                    return function () {
                        return elem[k].apply(elem, arguments);
                    };
                })(key);
            else
                this.__defineSetter__(key, (function (k) {
                    return function (val) {
                        return elem[k] = val;
                    };
                })(key));
                this.__defineGetter__(key, (function (k) {
                    return function () {
                        return elem[k];
                    };
                })(key));
        }
    }
};


exports.nodeName = function (elem) {
    return new DOMPatch(elem, {
        nodeName : function (that, k, e) {
            that.__defineGetter__(k, function () {
                return e.nodeName.toLowerCase(); // thats the reason
            });
        },
    });
};

