var width = 500;
var height = 300;
var canvas = document.getElementById("canvas");
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext("2d");

var RandomWalk = function(n){
    var points = [];
    for(var i = 0; i < n; i++){
        points.push(0);
    };
    this.step = function(){
        for(var i = 0; i < n; i++){
            points[i] += Math.random()*2-1;
        }
    };
    this.getAvg = function(){
        var sum = 0;
        for(var i = 0; i < n; i++){
            sum += points[i];
        }
        return sum/n;
    };
    var that = this;
    this.getStandardDeviation = function(avg){
        //look at this page https://en.wikipedia.org/wiki/Standard_deviation
        var sumSquaredDeviation = 0;
        for(var i = 0; i < n; i++){
            sumSquaredDeviation += (points[i]-avg)*(points[i]-avg);
        }
        return Math.sqrt(sumSquaredDeviation/n)
    };
    this.getCenterProbabilityDensity = function(avg,sd){
        //area with 0.1 standard deviation
        var cntCenterStrip = 0;
        for(var i = 0; i < n; i++){
            if(Math.abs(points[i]-avg) < 0.1*sd){
                cntCenterStrip++;
            }
        }
        var centerDencity = cntCenterStrip/n/(0.1*sd*2);
        return centerDencity;
    }
    this.getPI = function(avg,sd,pd){
        return 1/(sd*sd*2*pd*pd);
    };
    this.getDistributionArray = function(width,avg,sd){//n is the width
        //3 sigmas
        var arr = [];
        for(var i = 0; i < width; i++){
            arr[i] = 0;
        }
        for(var i = 0; i < n; i++){
            var val = (points[i]-avg+sd*3);
            var idx = Math.floor(val/(sd*6)*width);
            if(idx < 0 || idx >= width)continue;
            arr[idx]++;
        }
        return arr;
    }
};

var N = 1000000;
var rw = new RandomWalk(N);

var start = 0;
var animate = function(t){
    if(start === 0)start = t;
    var dt = t - start;
    start = t;
    rw.step();
    var avg = rw.getAvg();
    var sd = rw.getStandardDeviation(avg);
    var pd = rw.getCenterProbabilityDensity(avg,sd);
    var pi = rw.getPI(avg,sd,pd);
    console.log(pi);
    document.getElementById("display").innerHTML = "π = "+pi;
    var w = 500;
    var arr = rw.getDistributionArray(w,avg,sd);
    drawDistributionArray(arr,w,N);
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);



var drawDistributionArray = function(arr,w,N){
    ctx.clearRect(0,0,width,height);
    var imgdata = ctx.getImageData(0,0,width,height);
    var data = imgdata.data;
    for(var i = 0; i < w; i++){
        var level = arr[i]/(N/w/100);
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


