require('../style/main.styl')
import $ from "jquery"
import { setTimeout } from 'timers';
$(document).ready(function() {
  var dragBox = new DragControl()   
})


var DragControl = function() {
  var $dragBar = $('#drag-bar');
  var $box = $('#box');
  var html = '';
  var screenWidth = $(window).width();
  var isTouch = false;
  var startTime = 0;
  var touchTime = 0;
  var endFinger = 0;
  var fingerDistance = 0;
  var speed = 0;
  var initTranslateX = $box.width() / 2;
  var theLastScaleTranslateX = 0;
  var springBackTime = 200
  var guanXingTime = 1000
  var cancelTransitionTime = 0
  var draging = {
    pointer: '',
    initX: 0,
    moveX: 0,
    positionX: 0,
    prevPositionX: initTranslateX,
  };
  var self = this;
  var timer = {};


  //刻度模板
  var getScaleHtml = {
    beforeOne: function() {
      return '<div class="short-line"></div><div class="short-line"></div><div class="short-line"></div><div class="short-line"></div><div class="long-line"><p>1</p></div>'
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
  $dragBar.css('transform', 'translateX('+ initTranslateX +'px)');

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
  //最大拖动位移
  theLastScaleTranslateX = 0 - ($dragBar.width() - ($box.width() / 2))

  //拖拽
  var count_touchstart = 0
  var count_touchmove = 0

  //手指触摸开始
  $box.bind('touchstart', touchstartCallBack)
  //手指触摸移动
  $box.bind('touchmove', touchMoveCallBack)
  //手指离开屏幕
  $box.bind('touchend', touchEndCallBack)

  function touchstartCallBack(e) {
    startTime = Date.now()
    if(e.targetTouches.length > 1 || isTouch) return;
    $dragBar[0].style.WebkitTransition = $dragBar[0].style.transition = '';
    console.log($dragBar[0].style.transform)
    draging.initX = e.targetTouches[0].pageX //手指落屏点X轴记录
    e.preventDefault()
  }

  function touchMoveCallBack(e) {
    if(e.targetTouches.length > 1) return;
    isTouch = true;
    draging.pointer = e.targetTouches[0];
    draging.moveX = draging.pointer.pageX - draging.initX; //拖动位移
    
    if(draging.positionX > initTranslateX) {
      draging.moveX *= 0.2;
      draging.positionX = draging.prevPositionX + draging.moveX;
    } else {
      draging.positionX = draging.prevPositionX + draging.moveX; //叠加上一次的位置
    }
    
    moveTo(draging.positionX)
    e.preventDefault()
  }

  function touchEndCallBack(e) {
    isTouch = false

    fingerDistance = e.changedTouches[0].pageX - draging.initX
    touchTime = Date.now() - startTime;
    speed = ( fingerDistance / touchTime ) * 300

    if( draging.positionX > initTranslateX ) {
      draging.positionX = initTranslateX
      draging.prevPositionX = initTranslateX
      cancelTransitionTime = springBackTime
      $dragBar[0].style.WebkitTransition = $dragBar[0].style.transition = 'transform ' + springBackTime + 'ms cubic-bezier(0.1, 0.57, 0.1, 1)';
      moveTo(initTranslateX)
    } else if( draging.positionX < theLastScaleTranslateX ) {
      draging.positionX = theLastScaleTranslateX
      draging.prevPositionX = theLastScaleTranslateX
      moveTo(theLastScaleTranslateX)
    } else {
      //正常拖动
      draging.prevPositionX = draging.positionX + speed
      cancelTransitionTime = guanXingTime
      $dragBar[0].style.WebkitTransition = $dragBar[0].style.transition = 'transform ' + guanXingTime + 'ms cubic-bezier(0.1, 0.57, 0.1, 1)';
      moveTo(draging.positionX += speed)
    }
    if(timer) clearTimeout(timer)
    timer = setTimeout(function() {
      $dragBar[0].style.WebkitTransition = $dragBar[0].style.transition = '';
    }, cancelTransitionTime + 300 )
  }

  function moveTo(pos) {
    // $dragBar.css('transform', 'translateX('+ pos +'px)');
    $dragBar[0].style.WebkitTransform = $dragBar[0].style.transform = 'translateX('+pos+'px)';
  }



//end
}


