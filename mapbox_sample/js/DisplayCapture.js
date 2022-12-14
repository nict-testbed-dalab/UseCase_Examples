var out_name = "";

var $DisplayCapture = {
  Stream : null,
};

function startDisplayCapture(pCallback) {
  console.log("startDisplayCapture");
  out_name = "";
  
  if ($DisplayCapture.Stream) {
    if ($DisplayCapture.Stream.active) {
      if (typeof pCallback == "function") {
        pCallback({ status : true });
      }
      return;
    } else {
      stopDisplayCapture();
    }
  }

  let objMediaDevices = navigator.mediaDevices;

  objMediaDevices.getDisplayMedia({
    video : {
      displaySurface : "browser",
      cursor         : { exact : "none" }
    },
    audio : false
  }).then(function(pStream) {
    console.log("getDisplayMedia")

    pStream.addEventListener("inactive", function() { stopDisplayCapture(); }, false);

    let $video = $("<video class='displayCapture'></video>");
 
    $video   .css   ({ position : "absolute", left : "100vw", top : "100vh" });
    $("body").append($video);
    $video[0].srcObject = pStream;
    $video[0].play  ();

    $DisplayCapture.Stream = pStream;

    if (typeof pCallback == "function") {
      setTimeout(function() { pCallback({ status : true }); }, 1000);
    }

  }).catch(function(pError) {
    if (typeof pCallback == "function") {
      pCallback({ status : false, error : pError });
    }
  });
}

// キャプチャしたストリームデータをcanvasのimageにする
function getDisplayCapture(pCallback) {
  console.log("getDisplayCapture ")
  //console.log($DisplayCapture.Stream);
  if (!$DisplayCapture.Stream) {
    return;
  }

  let $video     = $("video.displayCapture");
  let $canvas    = $("<canvas class='displayCapture'></canvas>");
  let objContext = $canvas[0].getContext("2d");

  $canvas  .css   ("display", "none");
  $("body").append($canvas);
  $canvas  .attr  ("width"  , $video[0].offsetWidth );
  $canvas  .attr  ("height" , $video[0].offsetHeight);

  objContext.drawImage($video[0], 0, 0, $video[0].offsetWidth, $video[0].offsetHeight);

  if ($canvas[0].toBlob){
    $canvas[0].toBlob(function(pBlob){
      pCallback(window.URL.createObjectURL(pBlob));
      $canvas.remove();
    }, "image/jpeg", 1);
  } else if ($canvas[0].msToBlob) {
    pCallback(window.URL.createObjectURL($canvas[0].msToBlob()));
    $canvas.remove();
  } else {
    pCallback(null);
    $canvas.remove();
  }
}

// キャプチャしたストリームデータをcanvasのimageにしてダウンロードする
function getDisplayCapture2(pFileName) {
  //console.log($DisplayCapture.Stream);
  if (!$DisplayCapture.Stream) {
    return;
  }

  if (out_name == ""){
    out_name = pFileName
  }

  const $video     = $("video.displayCapture");
  const $canvas    = $("<canvas class='displayCapture'></canvas>");
  const objContext = $canvas[0].getContext("2d");

  $canvas  .css   ("display", "none");
  $("body").append($canvas);
  $canvas  .attr  ("width"  , $video[0].offsetWidth );
  $canvas  .attr  ("height" , $video[0].offsetHeight);

  objContext.drawImage($video[0], 0, 0, $video[0].offsetWidth, $video[0].offsetHeight);

  const loc_name = out_name;
  if ($canvas[0].toBlob){

    $canvas[0].toBlob(function(pBlob){
      console.log("getDisplayCapture2 pBlob", pBlob)
      console.log("getDisplayCapture2 loc_name", loc_name)

      download(window.URL.createObjectURL(pBlob), loc_name);

      $canvas.remove();

    }, "image/jpeg", 1);
  
  } else if ($canvas[0].msToBlob) {
    download(window.URL.createObjectURL($canvas[0].msToBlob()), pFileName);
    $canvas.remove();
  } else {
    // pCallback(null);
    $canvas.remove();
  }

  // ファイル名を入れ替える
  out_name = pFileName;

  console.log("getDisplayCapture2 end")

}

function stopDisplayCapture() {
  console.log("stopDisplayCapture")
  if ($DisplayCapture.Stream) {
    $DisplayCapture.Stream.getTracks()[0].stop();
    delete $DisplayCapture.Stream;
  }

  $("canvas.displayCapture").remove();
  $( "video.displayCapture").remove();
}

function download (pUrl, pFileName, pCallback) {
  console.log("download", pFileName)
  // console.log(pUrl);
  // console.log(pFileName);
  let strFileName       = typeof pFileName == "string" ? pFileName : pUrl.match(".+/(.+?)([\?#;].*)?$")[1];
  let objXMLHttpRequest = new XMLHttpRequest();

  objXMLHttpRequest.open("GET", pUrl, true);
  objXMLHttpRequest.responseType = "blob";

  objXMLHttpRequest.onload = function() {
    if (objXMLHttpRequest.status !== 200) {
      alert("download error. return code = " + objXMLHttpRequest.status);
    } else {
      if (window.navigator.msSaveBlob){
        window.navigator.msSaveBlob(objXMLHttpRequest.response, strFileName);
      } else {
        let $download = $("<a css='display:none;' href='" + window.URL.createObjectURL(objXMLHttpRequest.response) + "' download='" + strFileName + "'></a>");

        $("body").append($download);

        $download[0].click ();
        $download   .remove();
      }
    }

    if (typeof pCallback == "function") {
      pCallback();
    }
  };

  objXMLHttpRequest.send();
}

function singleCapture(pFileName) {
  console.log("singleCapture start")
  startDisplayCapture(function(pResult) {
    if (!pResult.status) {
      alert((pResult.error.name ? pResult.error.name + ": " : "") + (pResult.error.message ? pResult.error.message : ""));
      return;
    }
    getDisplayCapture(function(pUrl) {
      if (pUrl) {
        download(pUrl, pFileName, stopDisplayCapture());
      }
    });
  });
}

function multiCapture(currentTime, startTime, endTime, stepTime, pIsContinueCallback, pPreCaptureCallback, pNameFormatCallback) {
  if(pIsContinueCallback() && startTime.getTime() <= currentTime.getTime() && currentTime.getTime() <= endTime.getTime()){
    startDisplayCapture(function(pResult) {
      if (!pResult.status) {
        alert((pResult.error.name ? pResult.error.name + ": " : "") + (pResult.error.message ? pResult.error.message : ""));
        return;
      }
      getDisplayCapture(function(pUrl) {
        if (pUrl) {
          pPreCaptureCallback(currentTime, startTime, endTime);
          setTimeout(function() {
            download(pUrl, pNameFormatCallback(currentTime), 
                     multiCapture(new Date(currentTime.getTime() + stepTime), startTime, endTime, stepTime, pIsContinueCallback, pPreCaptureCallback, pNameFormatCallback));
          }, 2000);
        }
      });
    });
  } else {
    stopDisplayCapture();
  }
}
