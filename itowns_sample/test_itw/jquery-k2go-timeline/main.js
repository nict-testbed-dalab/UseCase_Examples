/******************************************************************************/
/* Sample for k2goTimeline                                                    */
/* halloweenjack inc.                                                         */
/******************************************************************************/
/******************************************************************************/
/* window.load                                                                */
// move app.js
/******************************************************************************/
$(function() {
/******************************************************************************/
/* window.resize                                                              */
/******************************************************************************/
$(window).on("resize", function()
{
  if (typeof $(window).data("resize") == "number")
  {
    clearTimeout($(window).data("resize"));
    $(window).removeData("resize");
  }

  $(window).data("resize", setTimeout(function()
  {
    adjustRangeBar();

    $("#timeline").k2goTimeline("setOptions", { maxScale : $Env.zoomTable[0].value / $("#timeline").width(), minScale : $Env.zoomTable[$Env.zoomTable.length - 1].value / $("#timeline").width() });

    putEventInfo("resize");
    $(window).removeData("resize");
  }, 300));
});
/******************************************************************************/
/* document.mousemove                                                         */
/******************************************************************************/
$(document).on("mousemove", function(pEvent)
{
  var $rangeBar = $(".k2go-timeline-range-show");

  if ($rangeBar.length > 0)
  {
    var intLeft  = $rangeBar.offset().left;
    var intRight = $rangeBar.width () + intLeft;

    $("#timeline").k2goTimeline("setOptions", { disableZoom : !(intLeft <= pEvent.pageX && pEvent.pageX <= intRight) });
  }
});
/******************************************************************************/
/* current_time.click                                                         */
/******************************************************************************/
$("#current_time").on("click", function()
{
  var $this = $(this);
/*-----* time current *-------------------------------------------------------*/
  if($this.hasClass("timeCurrent"))
  {
    var objOptions  = $("timeline").k2goTimeline("getOptions");
    var objTimeInfo = {};

    objTimeInfo.minTime     = new Date(objOptions.minTime    .getTime());
    objTimeInfo.maxTime     = new Date(objOptions.maxTime    .getTime());
    objTimeInfo.startTime   = new Date(objOptions.minTime    .getTime() > objOptions.startTime.getTime() ? objOptions.minTime.getTime() : objOptions.startTime.getTime());
    objTimeInfo.endTime     = new Date(objOptions.maxTime    .getTime() < objOptions.endTime  .getTime() ? objOptions.maxTime.getTime() : objOptions.endTime  .getTime());
    objTimeInfo.currentTime = new Date(objOptions.currentTime.getTime());

    var intDiff1 = objTimeInfo.currentTime.getTime() - objTimeInfo.startTime  .getTime();
    var intDiff2 = objTimeInfo.endTime    .getTime() - objTimeInfo.currentTime.getTime();

    objTimeInfo.currentTime.setTime(Date.now());
    objTimeInfo.startTime  .setTime(objTimeInfo.currentTime.getTime() - intDiff1);
    objTimeInfo.endTime    .setTime(objTimeInfo.currentTime.getTime() + intDiff2);

    if (objOptions.minTime.getTime() > objTimeInfo.startTime.getTime()) objTimeInfo.startTime.setTime(objOptions.minTime.getTime());
    if (objOptions.maxTime.getTime() < objTimeInfo.endTime  .getTime()) objTimeInfo.endTime  .setTime(objOptions.maxTime.getTime());

    $Env.creating = true;
    $("#lockWindow").addClass("show");

    $("#timeline").k2goTimeline("create",
    {
      timeInfo : objTimeInfo,
      callback : function(pTimeInfo)
      {
        $this.data("removeTimeNow", setTimeout(function()
        {
           $this.removeClass("timeNow"    );
           $this.addClass   ("timeCurrent");
        }, 5000));
        
        $this.addClass   ("timeNow"    );
        $this.removeClass("timeCurrent");

        $Env.creating = false;
        adjustRangeBar();
        putEventInfo("change time now");
        $("#lockWindow").removeClass("show");
      }
    });
  }
/*-----* time now *-----------------------------------------------------------*/
  else if ($this.hasClass("timeNow"))
  {
    clearTimeout($("#current_time").data("removeTimeNow"));
    
    $this.addClass   ("timeNowPlay");
    $this.removeClass("timeNow"    );

    $("#cal"         ).addClass("disable2");
    $("#play_box"    ).addClass("disable2");
    $("#slider"      ).addClass("disable2");
    $("#button_range").addClass("disable2");
    
    $Env.starting = true;

    $("#timeline").k2goTimeline("start",
    {
      fps      : 10,
      realTime : true,
      stop     : function()
      {
        $("#cal"         ).removeClass("disable2"   );
        $("#play_box"    ).removeClass("disable2"   );
        $("#slider"      ).removeClass("disable2"   );
        $("#button_range").removeClass("disable2"   );
        $("#lockWindow"  ).removeClass("show"       );
        $this             .addClass   ("timeCurrent");
        $this             .removeClass("timeNowPlay");
        $this             .trigger    ("click"      );
        adjustRangeBar();
        $Env.starting = false;
      }
    });
  }
/*-----* time now play *------------------------------------------------------*/
  else
  {
    $("#lockWindow").addClass    ("show");
    $("#timeline"  ).k2goTimeline("stop");
  }
});
/******************************************************************************/
/* view_url event                                                             */
/******************************************************************************/
/*-----* button_view_url.click *----------------------------------------------*/
$("#button_view_url").on("click", function()
{
  var strUurl = window.location.origin + window.location.pathname + "?" + "st=" + $Env.startTime.getTime() + "&et=" + $Env.endTime.getTime() + "&ct=" + $Env.currentTime.getTime();
  $("#view_url_input"    ).val    (strUurl);
  $("#view_url_input"    ).attr   ("aria-label" , strUurl );
  $("#view_url"          ).css    ("display" , "block");
  $(".input_group_button").trigger("click");
});
/*-----* input_group_button.click *--------------------------------------------*/
$(".input_group_button").on("click", function()
{
  $("#view_url_input").select();
  document.execCommand("Copy");
});
/*-----* view_url_box_close.click *-------------------------------------------*/
$(".view_url_box_close").on("click", function()
{
  $("#view_url").css("display" , "none");
});
/******************************************************************************/
/* play_box.click                                                             */
/******************************************************************************/
$("#play_box").on("click", "a", function()
{
  var $this       = $(this);
  var flgStarting = $Env.starting;
  var intSpeed    = $Env.speed;

  $("#lockWindow").addClass    ("show");
  $("#timeline"  ).k2goTimeline("stop");

  setTimeout(function _sleep()
  {
    if ($Env.starting)
    {
      setTimeout(_sleep, 10);
      return;
    }

    $Env.speed = intSpeed;
/*-----* play *-----------------------------------------------------*/
    if ($this.attr("id") == "button_play")
    { 
      //変更しました
      if($('#play-mode-normal').hasClass('active')) {
        // if ($this.attr("id") == "button_play")
        // {
          // $Env.speed = 1;
          // if ($Env.speed <  1 || $Env.speed >  5) $Env.speed = 1;
        // }
        // else
        // {
        //   $Env.speed--;
        //   if ($Env.speed > -1 || $Env.speed < -5) $Env.speed = -1;
        //   console.log('逆再生');
        // }
        
        $Env.speed = $Env.playTable[ $('#play-speed2').val() - 1 ];

        startTimeline();
        $("#lockWindow").removeClass("show");
        console.log('通常再生中');
      } else {
        $("#button_play_reverse").removeClass("play_frame_rev");
        clearTimeout($Env.timeoutIdBack);
        $('#button_play').addClass('play_frame');
        framePlayFwd();
        console.log('コマ再生中');
      }
    }
/*-----* reverse *-----------------------------------------------------*/
    else if ($this.attr("id") == "button_play_reverse") {
      if($('#play-mode-span').hasClass('active')) {
        clearTimeout($Env.timeoutIdFwd);
        $("#button_play").removeClass("play_frame");
        $("#button_play_reverse").addClass("play_frame_rev");
        framePlayBack();
        console.log('逆コマ再生中');
      }
    }
/*-----* stop *---------------------------------------------------------------*/
    else if ($this.attr("id") == "button_stop")
    {
      $Env.speed = 0;
      $("#lockWindow").removeClass("show");
    }
/*-----* loop *---------------------------------------------------------------*/
    else if ($this.attr("id") == "button_loop")
    {
      $this.toggleClass("active");
      $Env.loop = $this.hasClass("active");
      if (flgStarting) startTimeline();
      $("#lockWindow").removeClass("show");
    }
/*-----* fwd or back *--------------------------------------------------------*/
    else
    {
      $Env.creating = true;

      var objOptions  = $("#timeline").k2goTimeline("getOptions");
      var objTimeInfo = {};
      var objEdgeStartTime;
      var objEdgeEndTime;
      var intDiff;

      objTimeInfo.minTime     = new Date(objOptions.minTime    .getTime());
      objTimeInfo.maxTime     = new Date(objOptions.maxTime    .getTime());
      objTimeInfo.startTime   = new Date(objOptions.minTime    .getTime() > objOptions.startTime.getTime() ? objOptions.minTime.getTime() : objOptions.startTime.getTime());
      objTimeInfo.endTime     = new Date(objOptions.maxTime    .getTime() < objOptions.endTime  .getTime() ? objOptions.maxTime.getTime() : objOptions.endTime  .getTime());
      objTimeInfo.currentTime = new Date(objOptions.currentTime.getTime());

      if ($("#button_range").hasClass("active"))
      {
        objEdgeStartTime = new Date(objOptions.rangeStartTime.getTime());
        objEdgeEndTime   = new Date(objOptions.rangeEndTime  .getTime());
      }
      else
      {
        objEdgeStartTime = new Date(objTimeInfo.startTime.getTime());
        objEdgeEndTime   = new Date(objTimeInfo.endTime  .getTime());
      }

      intDiff = (objEdgeEndTime.getTime() - objEdgeStartTime.getTime()) * 0.01;

      if ($this.attr("id") == "button_back_edge")
      {
        objTimeInfo.currentTime.setTime(objEdgeStartTime.getTime());
      }
      else if ($this.attr("id") == "button_fwd_edge")
      {
        objTimeInfo.currentTime.setTime(objEdgeEndTime.getTime());
      }
      else if ($this.attr("id") == "button_back")
      {
                                                                            objTimeInfo.currentTime.setTime(objTimeInfo.currentTime.getTime() - intDiff);
        if (objTimeInfo.currentTime.getTime() < objEdgeStartTime.getTime()) objTimeInfo.currentTime.setTime(objEdgeStartTime       .getTime()          );
      }
      else if ($this.attr("id") == "button_fwd")
      {
                                                                          objTimeInfo.currentTime.setTime(objTimeInfo.currentTime.getTime() + intDiff);
        if (objTimeInfo.currentTime.getTime() > objEdgeEndTime.getTime()) objTimeInfo.currentTime.setTime(objEdgeEndTime         .getTime()          );
      }

      $("#timeline").k2goTimeline("create",
      {
        timeInfo : objTimeInfo,
        callback : function(pTimeInfo)
        {
          if (flgStarting) startTimeline();
          $Env.creating = false;
          $("#lockWindow").removeClass("show");
        }
      });
    }
  }, 1);
});
/******************************************************************************/
/* zoom-range event                                                           */
/******************************************************************************/
/*-----* zoom-range.input *---------------------------------------------------*/
$("#zoom-range").on("input", function()
{
  changeZoomLevel()
  
  if (!$Env.creating)
  {
    
    var intValue = parseInt($(this).val(), 10);

    if (intValue != getZoomLevel())
    {
      $Env.creating = true;

      var objOptions         = $("#timeline").k2goTimeline("getOptions");
      var objZoomInfo        = $Env.zoomTable[intValue];
      var objOffsetPixelInfo = {}; // ピクセルサイズを格納
      var objTimeInfo        = {}; // Date オブジェクト格納
      var intPixelSize;
      
      objOffsetPixelInfo.startTime   = $("#timeline").k2goTimeline("getOffsetFromTime", objOptions.minTime.getTime() > objOptions.startTime.getTime() ? objOptions.minTime : objOptions.startTime);
      objOffsetPixelInfo.endTime     = $("#timeline").k2goTimeline("getOffsetFromTime", objOptions.maxTime.getTime() < objOptions.endTime  .getTime() ? objOptions.maxTime : objOptions.endTime  );
      objOffsetPixelInfo.currentTime = $("#timeline").k2goTimeline("getOffsetFromTime", objOptions.currentTime);
      
      intPixelSize = objZoomInfo.value / (objOffsetPixelInfo.endTime - objOffsetPixelInfo.startTime);

      objTimeInfo.minTime      = new Date(objOptions.minTime    .getTime());
      objTimeInfo.maxTime      = new Date(objOptions.maxTime    .getTime());
      objTimeInfo.currentTime  = new Date(objOptions.currentTime.getTime());
      objTimeInfo.startTime    = new Date(objOptions.currentTime.getTime() - intPixelSize * (objOffsetPixelInfo.currentTime - objOffsetPixelInfo.startTime  ));
      objTimeInfo.endTime      = new Date(objOptions.currentTime.getTime() + intPixelSize * (objOffsetPixelInfo.endTime     - objOffsetPixelInfo.currentTime));
      
      if( objTimeInfo.startTime.getTime() < objTimeInfo.minTime.getTime() ) objTimeInfo.startTime.setTime(objTimeInfo.minTime.getTime()) ;
      if( objTimeInfo.endTime  .getTime() > objTimeInfo.maxTime.getTime() ) objTimeInfo.endTime  .setTime(objTimeInfo.maxTime.getTime()) ;

      $("#timeline").k2goTimeline("create",
      {
        timeInfo : objTimeInfo,
        callback : function(pTimeInfo)
        {
          $Env.creating = false;
          $("#zoom-range").trigger("input");
        }
      });
    }
  }
});
/*-----* zoom-range.change *--------------------------------------------------*/
$("#zoom-range").on("change", function()
{
  adjustRangeBar();
});
/*-----* plus or minus.click *------------------------------------------------*/
$("#slider").on("click", "> a", function()
{
  var intValue = parseInt($("#zoom-range").val(), 10);

  if ($(this).attr("id") == "button_minus") intValue --; 
  else                                      intValue ++;                  

  $("#zoom-range").val(intValue)
  $("#zoom-range").trigger("input" );
  $("#zoom-range").trigger("change");
});
/******************************************************************************/
/* button_range.click                                                         */
/******************************************************************************/
$("#button_range").on("click", function()
{
  $(this).toggleClass("active");
  
  if ($(this).hasClass("active"))
  {
    $(".k2go-timeline-rail"    ).css     ({ pointerEvents : "none"   });
    $(".k2go-timeline-rail > *").css     ({ pointerEvents : "auto"   });
    $("#button_loop"           ).css     ({ visibility    : "visible"}); 
    $("#cal"                   ).addClass("disable1");
    $("#current_time"          ).addClass("disable1");

    if (checkRangeBar())
    {
      $("#timeline").k2goTimeline("showRangeBar");
    }
    else
    {
      var objOptions        = $("#timeline").k2goTimeline("getOptions");
      var objStartTime      = new Date(objOptions .minTime   .getTime() > objOptions.startTime.getTime() ? objOptions.minTime.getTime() : objOptions.startTime.getTime());
      var objEndTime        = new Date(objOptions .maxTime   .getTime() < objOptions.endTime  .getTime() ? objOptions.maxTime.getTime() : objOptions.endTime  .getTime());
      var objRangeStartTime = new Date(objOptions.currentTime.getTime() - $("#timeline").width() / 16 * objOptions.scale);
      var objRangeEndTime   = new Date(objOptions.currentTime.getTime() + $("#timeline").width() / 16 * objOptions.scale);

      if (objRangeStartTime.getTime() < objStartTime.getTime())
      {
        objRangeStartTime = new Date(objStartTime.getTime());
        objRangeEndTime   = new Date(objStartTime.getTime() + $("#timeline").width() / 8 * objOptions.scale);
      }

      if (objRangeEndTime.getTime() > objEndTime.getTime())
      {
        objRangeEndTime   = new Date(objEndTime.getTime());
        objRangeStartTime = new Date(objEndTime.getTime() - $("#timeline").width() / 8 * objOptions.scale);
      }

      $("#timeline").k2goTimeline("showRangeBar", { rangeStartTime : objRangeStartTime, rangeEndTime : objRangeEndTime });
      objOptions    .rangeChange (                { rangeStartTime : objRangeStartTime, rangeEndTime : objRangeEndTime });
    }
  }
  else
  {
    $("#timeline"              ).k2goTimeline("hiddenRangeBar");
    $("#timeline"              ).k2goTimeline("setOptions", { disableZoom : false });
    $(".k2go-timeline-rail"    ).css         ({ pointerEvents  : "" });
    $(".k2go-timeline-rail > *").css         ({ pointerEvents  : "" });
    $("#button_loop"           ).css         ({ visibility: "hidden"}); 
    $("#button_loop"           ).removeClass ("active"); 
    $("#cal"                   ).removeClass ("disable1");
    $("#current_time"          ).removeClass ("disable1");

    $Env.loop = false;
  }
});

$("#button_single_capture").on("click", function(){
  var fileName = $("#timeline").k2goTimeline("formatDate", $("#timeline").k2goTimeline("getOptions").currentTime, "%y%mm%dd%H%M%S.jpg")
  singleCapture(fileName);
});

$("#button_multi_capture").on("click", function() {
  $(this).toggleClass("active");
  let timeOpt = $("#timeline").k2goTimeline("getOptions");
  multiCapture(timeOpt.currentTime, timeOpt.currentTime, new Date(timeOpt.currentTime.getTime() + 300 * 60 * 1000), 10 * 60 * 1000,
      function(){
        return $("#button_multi_capture").hasClass("active");
      },
      function(cTime){
        let timelineObj = $("#timeline").k2goTimeline("getOptions");
        $("#timeline").k2goTimeline("create", {
          timeInfo : {
            currentTime : cTime,
            startTime : timelineObj.startTime,
            endTime : timelineObj.endTime,
            minTime : timelineObj.minTime,
            maxTime : timelineObj.maxTime,
          }
        });
      },
      function(cTime){
        return $("#timeline").k2goTimeline("formatDate", cTime, "%y%mm%dd%H%M%S.jpg");
      }
  );
});

});
function formatDate (date, format) {
        var weekday = ["日", "月", "火", "水", "木", "金", "土"];
        if (!format) {
            format = 'YYYY/MM/DD(WW) hh:mm:ss'
        }
        format = format.replace(/YYYY/g, date.getFullYear());
        format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
        format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
        format = format.replace(/WW/g, weekday[date.getDay()]);
        format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
        format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
        format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
        return format;
}
