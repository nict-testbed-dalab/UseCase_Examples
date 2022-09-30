;(function($){
/******************************************************************************/
/** NICT STARS View URL for JQuery Plugin                                     */
/** nictSTARSViewURL                                                          */
/******************************************************************************/
$.nictSTARSViewURL = {
/******************************************************************************/
/** nictSTARSViewURL.createURL                                                */
/******************************************************************************/
createURL : function(baseURL, param) {
  var strViewURL  = "";
  var aryUrlParam = [];

  // URL設定
  if (baseURL == null || baseURL == "") {
    throw new Error("base_url is not defined.");
  } else if (typeof(baseURL) == 'string') {
    strViewURL = baseURL;
  } else {
    throw new Error("base_url type is not string.");
  }

  for(key in param) {
    var urlKey = key;

    // 日時情報
    switch (key) {
      // 日時情報
      case "current_time":
        urlKey = "cT" ;
        break;
      case "bar_left_time":
        urlKey = "bLT" ;
        break;
      case "bar_right_time":
        urlKey = "bRT" ;
        break;
      case "autorun_start":
        urlKey = "aS" ;
        break;
      case "autorun_end":
        urlKey = "aE" ;
        break;

      //地図情報
      case "map_latitude":
        urlKey = "mLT" ;
        break;
      case "map_longitude":
        urlKey = "mLN" ;
        break;
      case "map_direction":
        urlKey = "mD" ;
        break;
      case "map_pitch":
        urlKey = "mP" ;
        break;
      case "map_zoom":
        urlKey = "mZ" ;
        break;

      //ウィンドウ情報
      case "window_top":
        urlKey = "wT" ;
        break;
      case "window_left":
        urlKey = "wL" ;
        break;
      case "window_width":
        urlKey = "wW" ;
        break;
      case "window_height":
        urlKey = "wH" ;
        break;

      default :
        urlKey = encodeURIComponent(key);
        break;
    }

    aryUrlParam.push(urlKey + "=" + encodeURIComponent(param[key]));
  }

  strViewURL = strViewURL + "?" + aryUrlParam.join("&");
  if (strViewURL.length > 2083) {
    throw new Error("URL length is overflow.");
  }
  return strViewURL;
},
/******************************************************************************/
/** nictSTARSViewURL.parseURL                                                 */
/******************************************************************************/
parseURL : function(url) {
  var viewURLParam = {}

  if (url.indexOf('?') != -1) {
    var hsParamList = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < hsParamList.length; i++) {
      hsParam = hsParamList[i].split('=');
      switch (hsParam[0]) {
        // 日時情報
        case "cT" :
          viewURLParam["current_time"] = decodeURIComponent(hsParam[1]);
          break;
        case "bLT" :
          viewURLParam["bar_left_time"] = decodeURIComponent(hsParam[1]);
          break;
        case "bRT" :
          viewURLParam["bar_right_time"] = decodeURIComponent(hsParam[1]);
          break;
        case "aS" :
          viewURLParam["autorun_start"] = decodeURIComponent(hsParam[1]);
          break;
        case "aE" :
          viewURLParam["autorun_end"] = decodeURIComponent(hsParam[1]);
          break;

        //地図情報
        case "mLT" :
          viewURLParam["map_latitude"] = decodeURIComponent(hsParam[1]);
          break;
        case "mLN" :
          viewURLParam["map_longitude"] = decodeURIComponent(hsParam[1]);
          break;
        case "mD" :
          viewURLParam["map_direction"] = decodeURIComponent(hsParam[1]);
          break;
        case "mP" :
          viewURLParam["map_pitch"] = decodeURIComponent(hsParam[1]);
          break;
        case "mZ" :
          viewURLParam["map_zoom"] = decodeURIComponent(hsParam[1]);
          break;

        //ウィンドウ情報
        case "wT" :
          viewURLParam["window_top"] = decodeURIComponent(hsParam[1]);
          break;
        case "wL" :
          viewURLParam["window_left"] = decodeURIComponent(hsParam[1]);
          break;
        case "wW" :
          viewURLParam["window_width"] = decodeURIComponent(hsParam[1]);
          break;
        case "wH" :
          viewURLParam["window_height"] = decodeURIComponent(hsParam[1]);
          break;

        default :
          viewURLParam[decodeURIComponent(hsParam[0])] = decodeURIComponent(hsParam[1]);
          break;
      }
    }
  }

  return viewURLParam;
}
};})(jQuery);

