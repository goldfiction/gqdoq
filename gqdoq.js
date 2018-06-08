var Q = require('q');

function doQ(o) {
    // doQ(o)
    // in: o.query
    // out: o.result
    // promise return: doQ({query:query,...other parameter query needs})
    o = o || {};
    var deferred = Q.defer();
    try {
        o.query(o, function (e, o2) {
            o2 = o2 || {};
            o2.error = e || null;
            deferred.resolve(o2);
        });
    } catch (e) {
        o.error = e;
        deferred.resolve(o);
    }
    return deferred.promise;
}

module.exports=doQ;

//Object.prototype.q=function(o){
//    o=o||{};
//    o.query=this;
//    return doQ(o);
//};