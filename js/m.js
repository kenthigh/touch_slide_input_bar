require('../style/main.styl')
import $ from "jquery"
import { setTimeout } from 'timers';
$(document).ready(function() {
  var dragBox = new DragControl()   
})


var DragControl = function() {
  var $dragBar = $('#drag-bar');
  var $box = $('#box');
  var $outPutData = $('#data')
  var html = '';
  var screenWidth = $(window).width();
  var isTouch = false;
  var initTranslateX = $box.width() / 2 + 1;
  var initPaddingRight = $box.width() / 2 - 11;
  var self = this;
  var timer = {};
  var value = 0;
  var minValue = 0.50;
  var maxValue = 33.30;
  var oldValue = 0;
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

  //拖拽
  var count_touchstart = 0
  var count_touchmove = 0

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

  function watchScrollValueChange() {
    if(oldValue != $box.scrollLeft()) {
      oldValue = $box.scrollLeft()
    } else {
      clearInterval(timer)
    }
  }

  function scrollCallBack() {
    var _scrollLeft, _mo
    value =  $box.scrollLeft() / 110 + 0.5
    value = value.toFixed(2)
    if( value <= 0.5) { value = minValue.toFixed(2) }
    if( value >= 33.3) { value = maxValue.toFixed(2) }
    $outPutData.html( value )

    if( timer == null ) {
      timer = setInterval(function() {
        if(oldValue != $box.scrollLeft() ) {
          oldValue = $box.scrollLeft()
        } else {
          if(isTouching){ return }
          _scrollLeft = $box.scrollLeft()
          _mo = _scrollLeft % 11
          if( _mo != 0) {
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


