

module.exports = function (overload) {

    var result = {};

    // hack hack hack
    var patch = result.nodeName = function (elem) {
        return overload.Watchable(function get(info) {
            var key = info.property;
            if (key === "nodeName") {
                return elem.nodeName.toLowerCase(); // thats the reason

            } else if (key === "childNodes") {
                var res = [];
                for(var i=0,l=elem.childNodes.length;i<l;i++)
                    res.push(patch(elem.childNodes[i]));
                return res;

            } else return elem[key];
        });
    };

    return result;
};


