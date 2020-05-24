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
        return doQ.doQ(o);
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

it('should be able to run doq using q extension',function(done){

    function add(o,cb){
        try {
            o.result = o.a + o.b;
            cb(null,o);
        }catch(e){
            cb(e);
        }
    }

    var o={
        a:2,
        b:3
    };

    add=doQ.extendQ(add) // this allows doQ to be used as add.q(o)

    add.q(o).then(function(o){   // now add.q is also q_add
        console.log(JSON.stringify(o));
        assert(o.result== o.a+ o.b);
        assert(!o.error);
    }).done(done);// notice you can done(done) in mocha

})

it('should be able to run mapLimit',function(done){
    var o={a:1,b:2,c:3};
    o.mapLimit(3,function(item,cb){
    	cb(null,item);
    },function(e,r){
    	var result=JSON.stringify(r);
    	console.log(result);
    	assert.equal(result,"[1,2,3]");
    	done(e);
    });
})

it('should be able to run mapValuesLimit',function(done){
    var o={a:1,b:2,c:3};
    o.mapValuesLimit(3,function(item,key,cb){
    	cb(null,"key:"+key+";value:"+item);
    },function(e,r){
    	var test={"a":"key:a;value:1","b":"key:b;value:2","c":"key:c;value:3"};
    	test=JSON.stringify(test);
    	var result=JSON.stringify(r);
    	console.log(result);
    	assert.equal(result,test);
    	done(e);
    })
})

it('should be able to run mapSeries',function(done){
  var o={a:1,b:2,c:3};
  o.mapSeries(function(item,cb){
    cb(null,"value:"+item);
  },function(e,r){
    var test=["value:1","value:2","value:3"];
    test=JSON.stringify(test);
    var result=JSON.stringify(r);
    console.log(result);
    assert.equal(result,test);
    done(e);
  })
})

it('should be able to run mapValuesSeries',function(done){
  var o={a:1,b:2,c:3};
  o.mapValuesSeries(function(item,key,cb){
    cb(null,"key:"+key+";value:"+item);
  },function(e,r){
    var test={"a":"key:a;value:1","b":"key:b;value:2","c":"key:c;value:3"};
    test=JSON.stringify(test);
    var result=JSON.stringify(r);
    console.log(result);
    assert.equal(result,test);
    done(e);
  })
})

it('should be able to run waterfall',function(done){
  var data=[1,2,3];
    var o=[
      function(cb){   // notice first function must have no data
        data.mapLimit(16,function(item,cb){cb(null,item*2)},function(e,r){cb(e,r)});
      },
      function(data,cb){  // subsequent data come from previous cb(e,r) r value
        data.mapLimit(16,function(item,cb){cb(null,item*2)},function(e,r){cb(e,r,r)});
      },
      function(data,data2,cb){  // if you return 2 r, please add 2 data
        data.mapLimit(16,function(item,cb){cb(null,item*2)},function(e,r){cb(e,r)});
      }
    ]
    o.waterfall(function(e,r){
      var test=[8,16,24];
      test=JSON.stringify(test);
      var result=JSON.stringify(r);
      console.log(result)
      assert.equal(result,test);
      done(e);
    })
})

it('should be able to run deepExtend',function(done){
  var o1={a:1,b:2,c:3,k:{a:1,m:7,n:null}};
  var o2={d:4,a:7,b:-1,k:{l:3,m:4,n:5}};
  o1.deepExtend(o2);
  var test={"a":7,"b":-1,"c":3,"k":{"a":1,"m":4,"n":5,"l":3},"d":4};
  test=JSON.stringify(test);
  var result=JSON.stringify(o1);
  console.log(result)
  assert.equal(result,test);
  done();
})

it('should be able to run global.Q',function(done){
  function eventually(value) {
    return Q.delay(value, 10);
  }

  Q.all([1, 2, 3].map(eventually))
  .done(function (result) {
      console.log(result);
      result=JSON.stringify(result);
      var test=[ 1, 2, 3 ];
      test=JSON.stringify(test);
      assert.equal(test,result);
      done();
  });
})

it('should be able to run global.async',function(done){
  var o=[1,2,3];
  async.mapLimit(o,3,function(item,cb){
    cb(null,item*2);
  },function(e,r){
    var test=[2,4,6];
    test=JSON.stringify(test);
    var result=JSON.stringify(r);
    console.log(result)
    assert.equal(result,test);
    done();
  })
})
