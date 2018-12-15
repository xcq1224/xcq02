<template>
    <div style="width:700px;height:500px;">
      <canvas id="areaCanvas" style="border:1px solid red;width:100%;height:90%;"> 
      </canvas>
    </div>
</template>
 
<script>
  var inside = require('point-in-polygon');
  export default {
    data () {
      return {
        pointsArr:[[0,20],[30,20],[10,0]],
        collectionArr:[],
 
      }
    },
    mounted() {
      this.collectionArr.push(this.pointsArr);
      this.collectionArr.push([[20,30],[50,30],[50,50],[20,50]]);
      this.collectionArr.push([[60,3],[50,20],[70,40],[80,30],[70,20],[80,0]]);
      this.drawPolygons();
 
 
    },
 
    methods: {
      drawPolygons: function(){
        var canvas = document.getElementById('areaCanvas');
        if (null == canvas || !canvas.getContext) return;
        var ctx = canvas.getContext("2d");
        // 清除画布，准备绘制
       // ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawPolygonByPoint(ctx,null);
        var _this = this;
        canvas.onmousemove = function (e) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          var location = _this.getLocation(canvas, e.clientX, e.clientY);
          _this.drawPolygonByPoint(ctx, location);
        };
      },
      drawPolygonByPoint: function(ctx,location){
        this.collectionArr.map(pointsArr =>{
          if(location != null && inside(location, pointsArr) == true){
            //绘制高亮图形
            this.drawHighLightPolygon(ctx,pointsArr);
          }else{
            //绘制一般图形
            this.drawGeneralPolygon(ctx,pointsArr);
          }
        });
      },
      drawGeneralPolygon: function(ctx,pointsArr){
        ctx.beginPath();
        for(let i = 0; i < pointsArr.length; i++){
          if(i == 0){
            ctx.moveTo(pointsArr[i][0], pointsArr[i][1]);
          }else if(i < pointsArr.length - 1){
            ctx.lineTo(pointsArr[i][0], pointsArr[i][1]);
          }else{
            ctx.lineTo(pointsArr[i][0], pointsArr[i][1]);
            ctx.closePath();
            ctx.stroke();
          }
        }
      },
      drawHighLightPolygon: function(ctx,pointsArr){
        ctx.beginPath();
        for(let i = 0; i < pointsArr.length; i++){
          if(i == 0){
            ctx.moveTo(pointsArr[i][0], pointsArr[i][1]);
          }else if(i < pointsArr.length - 1){
            ctx.lineTo(pointsArr[i][0], pointsArr[i][1]);
          }else{
            ctx.lineTo(pointsArr[i][0], pointsArr[i][1]);
            ctx.fillStyle="#FF7F00";
            ctx.fill();
            ctx.closePath();
            ctx.stroke();
          }
        }
      },
      getLocation: function(canvas,x,y){
        var bbox = canvas.getBoundingClientRect();
        return [(x - bbox.left) * (canvas.width / bbox.width),(y - bbox.top) * (canvas.height / bbox.height)];
          /*
           * 此处不用下面两行是为了防止使用CSS和JS改变了canvas的高宽之后是表面积拉大而实际
           * 显示像素不变而造成的坐标获取不准的情况
          x: (x - bbox.left),
          y: (y - bbox.top)
          */
      },
 
    }
  }
</script>
 
<style>
    canvas{
        background: url(../assets/1.jpg) no-repeat;
    }
</style>
