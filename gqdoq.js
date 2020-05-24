var Q = require('q');
var deepExtend=require('deep-extend');
var async=require('async');

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
};

exports.doQ=doQ;

function extendQ(func){
    // extendQ(func)
    // in:func
    // out:func
    // extends func with q method
    // q(o)
    // in:o.query
    // return:o.result

    func.q=function(o){
        o=o||{};
        o.query=func;
        return doQ(o);
    };
    return func;
}

exports.extendQ=extendQ;


Object.prototype.Q=function(o){
    // attach doQ method to object
    doQ(o||this);
}

Object.prototype.deepExtend=function(obj2){
    // attach deepExtend method to object
    deepExtend(this,obj2);
}

// attach Q to global
global.Q=Q;

var defaultCB=function(e,r){
    // default callback when it is not defined
    if(e){
        console.error(e);
    }
    try{
        this.result=r;
    }catch(e){}
}

Object.prototype.mapLimit=function(limit,iteratee,cb){
    // attach mapLimit to object. This method intends map from any array. It does not yield key in iteratee
    // in:
    // [limit]  maplimit limit concurrent execution, default 16
    // iteratee   i.e. function(item,cb){}
    // [cb]     callback, default defaultCB
    async.mapLimit(this,limit||16,iteratee,cb||defaultCB);
}

Object.prototype.mapValuesLimit=function(limit,iteratee,cb){
    // attach mapValuesLimit to object.  This method intends map from any object. It yields key in iteratee
    // in:
    // [limit] limit concurrent execution, default 16
    // iteratee  i.e. function(item,key,cb)
    // [cb]     callback, default defaultCB
    async.mapValuesLimit(this,limit||16,iteratee,cb||defaultCB);
}

Object.prototype.mapSeries=function(iteratee,cb){
    // attach mapSeries to object. This method intends map from any array. It does not yield key in iteratee
    // in:
    // iteratee  i.e. function(item,cb){}
    // [cb]     callback, default defaultCB
    async.mapSeries(this,iteratee,cb||defaultCB);
}

Object.prototype.mapValuesSeries=function(iteratee,cb){
    // attach mapValuesSeries to object.  This method intends map from any object. It does yield key in iteratee
    // in:
    // iteratee  i.e. function(item,key,cb){}
    // [cb]     callback, default defaultCB
    async.mapValuesSeries(this,iteratee,cb||defaultCB);
}

Object.prototype.waterfall=function(cb){
    // attach waterfall to object.  This method runs a series of functions in an array in waterfall style.
    // in:
    // [cb]    callback, default defaultCB
    async.waterfall(this,cb||defaultCB);
}

// attach async to global
global.async=async;
