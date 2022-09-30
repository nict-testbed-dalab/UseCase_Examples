;(function($){ $.k2goSTARScontroller = {
/******************************************************************************/
/* k2go STARScontroller                                                       */
/* author    : Inoue Computer Service.                                        */
/* copyright : k2go                                                           */
/* version   : 1.1.0                                                          */
/******************************************************************************/
/******************************************************************************/
/* k2goSTARScontroller.isAlive                                                */
/******************************************************************************/
isAlive : function(pApp) {
  try {
    var objApp = $Env.apps[pApp];

    if (pApp == $Env.mainApp) {
      return objApp.window;
    } else {
      return objApp.window && !objApp.window.closed;
    }
  } catch(e) {
    $.k2goSTARScontroller.putLog("[STARScontroller] isAlive Error " + e.toString());
    return false;
  }
},
/******************************************************************************/
/* k2goSTARScontroller.isReady                                                */
/******************************************************************************/
isReady : function(pApp) {
  try {
    var objApp = $Env.apps[pApp];
    if (typeof objApp.window.STARScontroller_isReady == "function") {
      return objApp.window.STARScontroller_isReady();
    } else {
      return false;
    }
  } catch(e) {
    $.k2goSTARScontroller.putLog("[STARScontroller] isReady Error " + e.toString());
    return false;
  }
},
/******************************************************************************/
/* k2goSTARScontroller.getDateInfo                                            */
/******************************************************************************/
getDateInfo : function(pApp) {
  try {
    var objApp    = $Env.apps[pApp];
    var objResult = { currentDate : 0, startDate : 0, endDate : 0 };

    if (typeof objApp.window.STARScontroller_getDate == "function") {
      var objDateInfo = objApp.window.STARScontroller_getDate();

      objResult.currentDate = objDateInfo.currentDate.getTime();
      objResult.startDate   = objDateInfo.startDate  .getTime();
      objResult.endDate     = objDateInfo.endDate    .getTime();

      return objResult;
    } else {
      return null;
    }
  } catch(e) {
    $.k2goSTARScontroller.putLog("[STARScontroller] getDateInfo Error " + e.toString());
    return null;
  }
},
/******************************************************************************/
/* k2goSTARScontroller.isChangeDateInfo                                       */
/******************************************************************************/
isChangeDateInfo : function(pApp, pActiveApp) {
  try {
    var objApp       = $Env.apps[pApp];
    var objActiveApp = $Env.apps[pActiveApp];

    if (objActiveApp.dateInfo == null) {
      return false;
    } else if (objApp      .dateInfo == null) {
      return true;
    } else {
      return objActiveApp.dateInfo.currentDate != objApp.dateInfo.currentDate
          || objActiveApp.dateInfo.startDate   != objApp.dateInfo.startDate
          || objActiveApp.dateInfo.endDate     != objApp.dateInfo.endDate;
    }
  } catch(e) {
    $.k2goSTARScontroller.putLog("[STARScontroller] isChangeDateInfo Error " + e.toString());
    return false;
  }
},
/******************************************************************************/
/* k2goSTARScontroller.setDateInfo                                            */
/******************************************************************************/
setDateInfo : function(pApp, pActiveApp) {
  try {
    var objApp       = $Env.apps[pApp];
    var objActiveApp = $Env.apps[pActiveApp];
    if (typeof objApp.window.STARScontroller_setDate == "function") {
      var objDataInfo = {
        currentDate : new Date(objApp.dateInfo.currentDate),
        startDate   : new Date(objApp.dateInfo.  startDate),
        endDate     : new Date(objApp.dateInfo.    endDate)
      };

      objApp.window.STARScontroller_setDate(objDataInfo);
    }
  } catch(e) {
    $.k2goSTARScontroller.putLog("[STARScontroller] setDateInfo Error " + e.toString());
  }
},
/******************************************************************************/
/* k2goSTARScontroller.getPosition                                            */
/******************************************************************************/
getPosition : function(pApp)
{
  try {
    var objApp    = $Env.apps[pApp];
    var objResult = { center : { lat : 0, lng : 0 }, north : 0, east : 0, south : 0, west : 0, zoom : 0, direction : 0 };
    if (typeof objApp.window.STARScontroller_getPosition == "function") {
      var objPosition = objApp.window.STARScontroller_getPosition();

      if ("center"    in objPosition && "lat" in objPosition.center) objResult.center.lat = objPosition.center.lat;
      if ("center"    in objPosition && "lng" in objPosition.center) objResult.center.lng = objPosition.center.lng;
      if ("north"     in objPosition                               ) objResult.north      = objPosition.north;
      if ("east"      in objPosition                               ) objResult.east       = objPosition.east;
      if ("south"     in objPosition                               ) objResult.south      = objPosition.south;
      if ("west"      in objPosition                               ) objResult.west       = objPosition.west;
      if ("zoom"      in objPosition                               ) objResult.zoom       = objPosition.zoom;
      if ("direction" in objPosition                               ) objResult.direction  = objPosition.direction;
      if ("pitch"     in objPosition                               ) objResult.pitch      = objPosition.pitch;

      return objResult;
    } else {
      return null;
    }
  } catch(e) {
    $.k2goSTARScontroller.putLog("[STARScontroller] getPosition Error " + e.toString());
    return null;
  }
},
/******************************************************************************/
/* k2goSTARScontroller.isChangePosition                                       */
/******************************************************************************/
isChangePosition : function(pApp, pActiveApp) {
  try {
    var objApp       = $Env.apps[pApp];
    var objActiveApp = $Env.apps[pActiveApp];

    if (objActiveApp.position == null) {
      return false;
    } else if (objApp.position == null) {
      return true;
    } else {
      return objActiveApp.position.center.lat != objApp.position.center.lat
          || objActiveApp.position.center.lng != objApp.position.center.lng
          || objActiveApp.position.north      != objApp.position.north
          || objActiveApp.position.east       != objApp.position.east
          || objActiveApp.position.south      != objApp.position.south
          || objActiveApp.position.west       != objApp.position.west
          || objActiveApp.position.zoom       != objApp.position.zoom
          || objActiveApp.position.pitch      != objApp.position.pitch
          || objActiveApp.position.direction  != objApp.position.direction;
    }
  } catch(e) {
    $.k2goSTARScontroller.putLog("[STARScontroller] isChangePosition Error " + e.toString());
    return false;
  }
},
/******************************************************************************/
/* k2goSTARScontroller.setPosition                                            */
/******************************************************************************/
setPosition : function(pApp) {
  try {
    var objApp = $Env.apps[pApp];
    if (typeof objApp.window.STARScontroller_setPosition == "function") {
      objApp.window.STARScontroller_setPosition(Object.assign({}, objApp.position));
    }
  } catch(e) {
    $.k2goSTARScontroller.putLog("[STARScontroller] setPosition Error " + e.toString());
  }
},
/******************************************************************************/
/* k2goSTARScontroller.getEvents                                              */
/******************************************************************************/
getEvents : function(pType, pJQuery, pElement, pSelector) {
  var objEvents = pJQuery._data(pJQuery(pElement).get(0), "events");

  for (var strKey in objEvents) {
    if (strKey == pType) {
      if (typeof pSelector == "string") {
        return $.grep(objEvents[strKey], function(pObject, pIndex) {
          return (pObject.selector == pSelector);
        });
      } else {
        return objEvents[strKey].slice();
      }
    }
  }

  return [];
},
/******************************************************************************/
/* k2goSTARScontroller.setEvents                                              */
/******************************************************************************/
setEvents : function(pType, pEvents, pJQuery, pElement, pSelector) {
  setTimeout(function() {
    pEvents.forEach(function(pEvent) {
      if (typeof pSelector == "string") {
        pJQuery(pElement).on(pType, pSelector, pEvent);
      } else {
        pJQuery(pElement).on(pType,            pEvent);
      }
    });
  }, 5000);
},
/******************************************************************************/
/* k2goSTARScontroller.formatDate                                             */
/******************************************************************************/
formatDate : function(pDate, pFormatString, pTimeZone) {
  var objDate   = new Date(pDate.getTime());
  var strResult = pFormatString;

  if (typeof pTimeZone == "string") {
    if (pTimeZone.indexOf("+") != -1) {
      objDate = new Date(objDate.toISOString().replace(/\-/g, "/").replace("T", " ").replace(/\.\d+/, "").replace("Z", " " + pTimeZone.replace("+", "-")));
    } else {
      objDate = new Date(objDate.toISOString().replace(/\-/g, "/").replace("T", " ").replace(/\.\d+/, "").replace("Z", " " + pTimeZone.replace("-", "+")));
    }
  }

  strResult = strResult.replace(/%y/g ,          objDate.getFullYear    ()      .toString(  ));
  strResult = strResult.replace(/%mm/g, ("0"  + (objDate.getMonth       () + 1)).slice   (-2));
  strResult = strResult.replace(/%m/g ,         (objDate.getMonth       () + 1) .toString(  ));
  strResult = strResult.replace(/%dd/g, ("0"  + (objDate.getDate        ()    )).slice   (-2));
  strResult = strResult.replace(/%d/g ,          objDate.getDate        ()      .toString(  ));
  strResult = strResult.replace(/%H/g , ("0"  +  objDate.getHours       ()     ).slice   (-2));
  strResult = strResult.replace(/%M/g , ("0"  +  objDate.getMinutes     ()     ).slice   (-2));
  strResult = strResult.replace(/%S/g , ("0"  +  objDate.getSeconds     ()     ).slice   (-2));
  strResult = strResult.replace(/%N/g , ("00" +  objDate.getMilliseconds()     ).slice   (-3));

  return strResult;
},
/******************************************************************************/
/* k2goSTARScontroller.putLog                                                 */
/******************************************************************************/
putLog : function(pMessage)
{
  if ($Env.showLogConsole) console.log($.k2goSTARScontroller.formatDate(new Date(), "%y/%mm/%dd %H:%M:%S.%N") + " " + pMessage);
}
};})(jQuery);
