var width = 500;
var height = 300;
var canvas = document.getElementById("canvas");
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext("2d");

var Pascal = function(){
    var ta = [1];
    var odd = true;
    var n = 1;
    this.step = function(){
        if(odd){
            for(var i = 0; i < ta.length-1; i++){
                ta[i] = ta[i]+ta[i+1];
            }
        }else{
            var pv = ta[0];
            ta[0] += ta[0];
            for(var i = 1; i < ta.length; i++){
                var pv0 = pv;
                pv = ta[i];
                ta[i] = pv0+ta[i];
            }
            ta[ta.length] = 1/(2**(ta.length*2));
        }
        odd = !odd;
        //counting n
        var n0 = n;
        n = 0;
        if(odd){
            n += ta[0];
            for(var i = 1; i < ta.length; i++){
                n += ta[i]*2;
            }
        }else{
            for(var i = 0; i < ta.length; i++){
                n += ta[i]*2;
            }
        }
        for(var i = 0; i < ta.length; i++){
            ta[i] = ta[i]*n0/n;
        }
        n = n0;
        return ta;
    }
    this.t = ta;
    this.getAvg = function(){
        return 0;//yes, it's that simple
    }
    this.getStandardDeviation = function(){
        //look at this page https://en.wikipedia.org/wiki/Standard_deviation
        var sumSquaredDeviation = 0;
        if(odd){
            sumSquaredDeviation += 0*0*ta[0];
            for(var i = 1; i < ta.length; i++){
                sumSquaredDeviation += i*i*ta[i]*2;
            }
        }else{
            for(var i = 0; i < ta.length; i++){
                sumSquaredDeviation += (i+0.5)*(i+0.5)*ta[i]*2;
            }
        }
        return Math.sqrt(sumSquaredDeviation/n)
    };
    this.getCenterProbabilityDensity = function(){
        return ta[0]/n;
    };
    this.getPI = function(sd,pd){
        return 1/(sd*sd*2*pd*pd);
    };
    this.getDistributionArray = function(width,avg,sd){
        //3 sigmas
        var arr = [];
        for(var i = 0; i < width; i++){
            arr[i] = 0;
        }
        var addToArr = function(pos,len,content){
            var avg = (len-1)/2;
            var val = (pos-avg+sd*3);
            var idx = Math.floor(val/(sd*6)*width);
            if(idx < 0 || idx >= width)return false;
            arr[idx] += content;
        };
        
        if(odd){
            var len = 1+(ta.length-1)*2;
            addToArr((ta.length-1),len,ta[0]);
            for(var i = 1; i < ta.length; i++){
                addToArr((ta.length-1)+i,len,ta[i]);
                addToArr((ta.length-1)-i,len,ta[i]);
            }
        }else{
            var len = ta.length*2;
            for(var i = 0; i < ta.length; i++){
                addToArr((ta.length-1)-i,len,ta[i]);
                addToArr((ta.length)+i,len,ta[i]);
            }
        }
        return arr;
    }
};

var pa = new Pascal();

var start = 0;
var animate = function(t){
    if(start === 0)start = t;
    var dt = t - start;
    start = t;
    pa.step();
    console.log("step");
    var avg = pa.getAvg();
    var sd = pa.getStandardDeviation(avg);
    console.log(sd);
    var pd = pa.getCenterProbabilityDensity();
    console.log(pd);
    var pi = pa.getPI(sd,pd);
    console.log(pi);
    document.getElementById("display").innerHTML = "π = "+pi;
    var w = 500;
    var arr = pa.getDistributionArray(w,avg,sd);
    drawDistributionArray(arr,w);
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);



var drawDistributionArray = function(arr,w){
    var maxVal = 0;
    for(var i = 0; i < arr.length; i++){
        if(maxVal < arr[i]){
            maxVal = arr[i];
        }
    }
    
    ctx.clearRect(0,0,width,height);
    var imgdata = ctx.getImageData(0,0,width,height);
    var data = imgdata.data;
    for(var i = 0; i < w; i++){
        var level = arr[i]/maxVal*300;
        if(level > canvas.height-1){
            level = canvas.height-1;//trim the upper end so we dont go into the undefined rterritory
        }
        for(var j = 0; j < level; j++){
            var y = (canvas.height-1)-j;
            var x = i;
            var idx = (y*width+x)*4;
            data[idx+0] = 0;
            data[idx+1] = 0;
            data[idx+2] = 0;
            data[idx+3] = 255;
        }
    }
    ctx.putImageData(imgdata,0,0);
};

/*
var generateNormalDist = function(){
    
    var distArr = [];
    var displayWidth = width;//500 px 500 different slots
    var displayHeight = height;
    for(var i = 0; i < displayWidth; i++){
        distArr[i] = 0;
    }
    var addToDistArr = function(val){
        //val from 0 to one
        var idx = Math.floor(val*displayWidth);//this will produce the index
        distArr[idx]++;
    };
    
    var n = 100000;
    for(var i = 0; i < n; i++){
        var d = (0.5/Math.random());
        if(0 <= d && d < 1)addToDistArr(d);
        //now try to plot all of this in a graph
    };
    console.log(distArr);
    var putDataOnCanvas = function(dist){
        ctx.clearRect(0,0,width,height);
        var imgdata = ctx.getImageData(0,0,width,height);
        var data = imgdata.data;
        for(var i = 0; i < displayWidth; i++){
            var level = distArr[i];
            if(level > displayHeight-1){
                level = displayHeight-1;//trim the upper end so we dont go into the undefined rterritory
            }
            for(var j = 0; j < level; j++){
                var y = (displayHeight-1)-j;
                var x = i;
                var idx = (y*width+x)*4;
                data[idx+0] = 0;
                data[idx+1] = 0;
                data[idx+2] = 0;
                data[idx+3] = 255;
            }
        }
        ctx.putImageData(imgdata,0,0);
    };
    putDataOnCanvas();
};


generateNormalDist();

*/


