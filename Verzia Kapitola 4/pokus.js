var f = function(){
    console.log(this);
}

var obj={};
obj.f = f;
obj.f();
