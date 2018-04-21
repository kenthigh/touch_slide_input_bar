require('../style/v.styl')
import $ from "jquery"
import { setTimeout } from 'timers';
$(document).ready(function() {
  var dragBox = new DragControl()

  $('#btn').click(function() {
    //取到数据
    alert($('#data').html())
  })

})


var DragControl = function() {
  var value = 0; //输出值
  var $dragBar = $('#drag-bar'); //刻度容器
  var $dragBarBelow = $('#drag-bar-below'); //下面的刻度容器
  var $box = $('#box'); //刻度容器外层BOX
  var $boxBelow = $('#box-below'); //下面的刻度容器外层BOX
  var $outPutData = $('#data') //输出数据
  var $outPutDataBelow = $('#data-below') //下面的输出数据
  var html = '';
  var screenWidth = $(window).width();
  var isTouch = false;
  var initTranslateX = $box.width() / 2 + 1;
  var initPaddingRight = $box.width() / 2 - 11;
  var self = this;
  var timer = {};
  var timer = null;
  var isTouching = false;
  var test = 0
  var test1 = 0

  //刻度模板
  var getScaleHtml = {
    beforeOne: function() {
      return '<div class="short-line"></div><div class="short-line"></div><div class="short-line"></div><div class="short-line"></div><div class="short-line"></div><div class="long-line"><p>1</p></div>'
    },
    shortLine: function() {
      return '<div class="short-line"></div>'
    },
    longLine: function(num) {
      return '<div class="long-line"><p>' + num + '</p></div>'
    },
    theLast: function() {
      return '<div class="short-line"></div><div class="short-line"></div><div class="short-line">'
    },
  };

  //刻度模板注入
  html += getScaleHtml.longLine(70)
  for(var i = 0; i < 19; i++) {
    for(var j = 0; j < 9; j++) {
      html += getScaleHtml.shortLine()
      if(j == 8) {
        j = 0;
        html += getScaleHtml.longLine((i+8)*10)
        break;
      }
    }
  }
  $dragBar.html(html)
  $box.bind('touchstart', touchstartCallBack($box, $outPutData, 70, 260))
  $box.bind('touchmove', touchMoveCallBack)
  $box.bind('touchend', touchEndCallBack)

   //刻度模板注入
   html = ''
   html += getScaleHtml.longLine(20)
   for(var i = 0; i < 16; i++) {
     for(var j = 0; j < 9; j++) {
       html += getScaleHtml.shortLine()
       if(j == 8) {
         j = 0;
         html += getScaleHtml.longLine((i+1)*10)
         break;
       }
     }
   }
  $dragBarBelow.html(html)
  $boxBelow.bind('touchstart', touchstartCallBack($boxBelow, $outPutDataBelow, 20, 160))
  $boxBelow.bind('touchmove', touchMoveCallBack)
  $boxBelow.bind('touchend', touchEndCallBack)
  
  
  function touchstartCallBack( target, valueTarget, min, max ) {
    return function() {
        target.unbind( "scroll" ).bind('scroll', scrollCallBack( target, valueTarget, min, max))
      }
  }

  function touchMoveCallBack() {
    isTouching = true
  }

  function touchEndCallBack() {
    isTouching = false
  }

  function scrollCallBack( target, valueTarget, minValue, maxValue ) {
    return function() {
      var _scrollTop, 
          _mo, //模值
          oldValue = 0;
      value =  (target.scrollTop() / 110) * 10 + minValue //位移转换为刻度的算法，每1个单位是110像素位移.
      value = value.toFixed(0) //保留0位小数
      if( value <= minValue) { value = minValue.toFixed(0) } //最小值限制
      if( value >= maxValue) { value = maxValue.toFixed(0) } //最大值限制
      valueTarget.html( value ) //最终输出刻度值
      console.log('sd-->', value)

      if( timer == null ) {
        timer = setInterval(function() {
          if(oldValue != target.scrollTop()) { //判断滚动是否停止
            oldValue = target.scrollTop()
          } else {
            //当滚动停止时，则让刻度回归最近的一个刻度。
            if( isTouching ){ return } //如果手指没放开，则不执行回归刻度
            _scrollTop = target.scrollTop()
            _mo = _scrollTop % 11 //滚动一个刻度的像素是11px，用滚动距离模11，就能判断是否在刻度上。
            if( _mo != 0) { //判断是否停在刻度上
              for(var i = 0; i < 10; i++) {
                if(_scrollTop % 11 == 0) {
                  target.animate({ scrollTop: _scrollTop }, 100);
                  break;
                }
                //四舍五入
                if(_mo > 5) {
                  _scrollTop++
                } else {
                  _scrollTop--
                }
              }
            }
            clearInterval(timer)
            timer = null
          }
        }, 100)
      }
    }
}

//end
}


