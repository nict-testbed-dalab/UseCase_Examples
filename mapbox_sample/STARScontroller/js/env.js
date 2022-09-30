/******************************************************************************/
/* k2go STARScontroller                                                       */
/* author    : Inoue Computer Service.                                        */
/* copyright : k2go                                                           */
/* version   : 1.1.0                                                          */
/******************************************************************************/
var $Env =
{
  showLogConsole : true,
  interval       : 100,
  mainApp        : "dummy",
  activeApp      : "amaterass",
  apps           :
  {
    dummy :
    {
      type           : "dummy",
      url            : "about:blank",
      windowFeatures : ""
    },
    amaterass :
    {
      type           : "harps",
      url            : "../index.html",
      windowFeatures : "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes"
    //windowFeatures : "toolbar=yes,location=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes"
    },
    amaterass2 :
    {
      type           : "harps",
      url            : "../index.html",
      windowFeatures : "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes"
    //windowFeatures : "toolbar=yes,location=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes"
    }
  }
};
