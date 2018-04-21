require('../style/main.styl')

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
  var $box = $('#box'); //刻度容器外层BOX
  var $outPutData = $('#data') //输出数据
  var html = '';
  var screenWidth = $(window).width();
  var isTouch = false;
  var initTranslateX = $box.width() / 2 + 1;
  var initPaddingRight = $box.width() / 2 - 11;
  var self = this;
  var timer = {};
  var minValue = 0.50;
  var maxValue = 33.30;
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

  //居中刻度模块
  $dragBar.css({'transform': 'translateX('+ initTranslateX + 'px)',
                'padding-right':  initPaddingRight + 'px'})

  //刻度模板注入
  html += getScaleHtml.beforeOne();
  for(var i = 0; i < 32; i++) {
    for(var j = 0; j < 9; j++) {
      html += getScaleHtml.shortLine()
      if(j == 8) {
        html += getScaleHtml.longLine(i + 2)
        j = 0;
        break;
      }
    }
  }
  html += getScaleHtml.theLast()
  $dragBar.html(html)

  //手指触摸开始
  $box.bind('touchstart', touchstartCallBack)
  //手指触摸移动
  $box.bind('touchmove', touchMoveCallBack)
  //手指离开屏幕
  $box.bind('touchend', touchEndCallBack)

  function touchstartCallBack() {
    $box.unbind( "scroll" ).bind('scroll', scrollCallBack)
  }

  function touchMoveCallBack() {
    isTouching = true
  }

  function touchEndCallBack() {
    isTouching = false
  }

  function scrollCallBack() {
    var _scrollLeft, 
        _mo, //模值
        oldValue = 0;
    
    value =  $box.scrollLeft() / 110 + 0.5 //位移转换为刻度的算法，每1个单位是110像素位移.
    value = value.toFixed(2) //保留2位小数
    if( value <= minValue) { value = minValue.toFixed(2) } //最小值限制
    if( value >= maxValue) { value = maxValue.toFixed(2) } //最大值限制
    $outPutData.html( value ) //最终输出刻度值

    if( timer == null ) {
      timer = setInterval(function() {
        if(oldValue != $box.scrollLeft()) { //判断滚动是否停止
          oldValue = $box.scrollLeft()
        } else {
          //当滚动停止时，则让刻度回归最近的一个刻度。
          if( isTouching ){ return } //如果手指没放开，则不执行回归刻度
          _scrollLeft = $box.scrollLeft()
          _mo = _scrollLeft % 11 //滚动一个刻度的像素是11px，用滚动距离模11，就能判断是否在刻度上。
          if( _mo != 0) { //判断是否停在刻度上
            for(var i = 0; i < 10; i++) {
              if(_scrollLeft % 11 == 0) {
                $box.animate({ scrollLeft: _scrollLeft }, 100);
                break;
              }
              //四舍五入
              if(_mo > 5) {
                _scrollLeft++
              } else {
                _scrollLeft--
              }
            }
          }
          clearInterval(timer)
          timer = null
        }
      }, 100)
    }

  }


//end
}


