var width = 500;
var height = 500;
var canvas = document.getElementById("canvas");
canvas.width = width;
canvas.height = height;
var ctx = canvas.getImageData("2d");


var generateNormalDist = function(){
    
    var distArr = [];
    var displayWidth = width;//500 px 500 different slots
    var displayHeight = height;
    for(var i = 0; i < displayWidth; i++){
        distArr[i] = 0;
    }
    var addToDistArr = function(val){
        //maximum value is 2
        val += 1;
        val /= 2;
        var idx = Math.floor(val*displayWidth);//this will produce the index
        distArr[idx]++;
    };
    
    var n = 100000;
    for(var i = 0; i < n; i++){
        var d = Math.random()-Math.random();
        //now try to plot all of this in a graph
    };
    var putDataOnCanvas = function(dist){
        ctx.clearRect(0,0,width,height);
        var imgdata = ctx.getImageData(0,0,width,height);
        var data = imgdata.data;
        for(var i = 0; i < displayWidth; i++){
            var level = distArr[i];
            if(level > displayHeight-1){
                level = displayHeight-1;//trim the upper end so we dont go into the undefined rterritory
            }
            for(var j = 0; j < level){
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
};


generateNormalDist();




