require('../style/weight.styl')
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
  var $dragBarT = $('#drag-bar-t'); //体重的刻度容器
  var $box = $('#box'); //刻度容器外层BOX
  var $boxT = $('#box-t'); //体重的刻度容器外层BOX
  var $outPutData = $('#data') //输出数据
  var $outPutDataT = $('#data-t') //体重的输出数据
  var html = '';
  var screenWidth = $(window).width();
  var isTouch = false;
  var initTranslateX = $boxT.width() / 2 + 1;
  var initPaddingRight = $boxT.width() / 2 - 11;
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
  //居中刻度模块
  $dragBarT.css({'transform': 'translateX('+ initTranslateX + 'px)',
                'padding-right':  initPaddingRight + 'px'})
  //体重刻度模板注入
  html = ''
  html += getScaleHtml.longLine(30)
  for(var i = 0; i < 27; i++) {
    for(var j = 0; j < 9; j++) {
      html += getScaleHtml.shortLine()
      if(j == 8) {
        j = 0;
        html += getScaleHtml.longLine((i+4)*10)
        break;
      }
    }
  }
  $dragBarT.html(html)
  $boxT.bind('touchstart', touchstartCallBack($boxT, $outPutDataT, 30, 300, true))
  $boxT.bind('touchmove', touchMoveCallBack)
  $boxT.bind('touchend', touchEndCallBack)

  //身高刻度模板注入
  html = ''
  html += getScaleHtml.longLine(50)
  for(var i = 0; i < 18; i++) {
    for(var j = 0; j < 9; j++) {
      html += getScaleHtml.shortLine()
      if(j == 8) {
        j = 0;
        html += getScaleHtml.longLine((i+6)*10)
        break;
      }
    }
  }
  $dragBar.html(html)
  $box.bind('touchstart', touchstartCallBack($box, $outPutData, 50, 280, false))
  $box.bind('touchmove', touchMoveCallBack)
  $box.bind('touchend', touchEndCallBack)

  setDefaultValue($box, $outPutData, 170, 1320, false)
  setDefaultValue($boxT, $outPutDataT, 50, 220, true)
  
  function setDefaultValue(target, valueTarget, value, px, isHoriz) {
    if(isHoriz) {
      target.scrollLeft(px)
    } else {
      target.scrollTop(px)
    }
    valueTarget.html( value )
  }
  function touchstartCallBack( target, valueTarget, min, max, isHoriz ) {
    return function() {
        target.unbind( "scroll" ).bind('scroll', scrollCallBack( target, valueTarget, min, max, isHoriz))
      }
  }

  function touchMoveCallBack() {
    isTouching = true
  }

  function touchEndCallBack() {
    isTouching = false
  }

  function scrollCallBack( target, valueTarget, minValue, maxValue, isHoriz ) {
    return function() {
      var _scrollDistance, 
          _mo, //模值
          oldValue = 0,
          intervalScroll = null;
      value =  ((isHoriz ? target.scrollLeft() : target.scrollTop()) / 110) * 10 + minValue //位移转换为刻度的算法，每1个单位是110像素位移.
      value = value.toFixed(0) //保留0位小数
      if( value <= minValue) { value = minValue.toFixed(0) } //最小值限制
      if( value >= maxValue) { value = maxValue.toFixed(0) } //最大值限制
      valueTarget.html( value ) //最终输出刻度值
      if( timer == null ) {
        timer = setInterval(function() {
          intervalScroll = isHoriz ? target.scrollLeft() : target.scrollTop()
          if(oldValue != intervalScroll) { //判断滚动是否停止
            oldValue = intervalScroll
          } else {
            //当滚动停止时，则让刻度回归最近的一个刻度。
            if( isTouching ){ return } //如果手指没放开，则不执行回归刻度
            _scrollDistance = intervalScroll
            _mo = _scrollDistance % 11 //滚动一个刻度的像素是11px，用滚动距离模11，就能判断是否在刻度上。
            if( _mo != 0) { //判断是否停在刻度上
              for(var i = 0; i < 10; i++) {
                if(_scrollDistance % 11 == 0) {
                  isHoriz ? target.animate({ scrollLeft: _scrollDistance }, 100) : target.animate({ scrollTop: _scrollDistance }, 100)
                  // target.animate({ scrollTop: _scrollDistance }, 100);
                  break;
                }
                //四舍五入
                if(_mo > 5) {
                  _scrollDistance++
                } else {
                  _scrollDistance--
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


