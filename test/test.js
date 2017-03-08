/**
 * Created by happy on 3/4/17.
 */
var assert=require('assert');
var doQ=require('./../gqdoq.js');

it("should be able to run doq",function(done){

    // add is an o-tree compatible function, o.is the input and cb will callback o once done where result is saved in o.result
    function add(o,cb){
        try {
            o.result = o.a + o.b;
            cb(null,o);
        }catch(e){
            cb(e);
        }
    }

    // q_add is a q-tree compatible function for add, doQ does precisely this
    function q_add(o){
        o=o||{};
        o.query=add;
        return doQ(o);
    }

    // data o needed by add
    var o={
        a:2,
        b:3
    };

    // q_add is actually a Q() object with then function available
    q_add(o).then(function(o){
        console.log(JSON.stringify(o));
        assert(o.result== o.a+ o.b);
        assert(!o.error);
    }).done(done);// notice you can done(done) in mocha

});


