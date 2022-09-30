//import demUrl from "./urlConfig.js"

// parameter追加
itowns.proj4.defs(
    'EPSG:6670',
    '+proj=tmerc +lat_0=33 +lon_0=131 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs'
);
itowns.proj4('EPSG:6670');


// 日本四角
//var point_1 = "160.14536976630336,52.628079019464934";
//var point_2 = "160.14536976630336,19.596703876014004";
//var point_3 = "121.8140330357005,19.596703876014004";
//var point_4 = "121.8140330357005,52.628079019464934";

//初期一周辺
//var point_1 = "138.732,36.368";
//var point_2 = "138.732,34.360";
//var point_3 = "137.520,34.360";
//var point_4 = "137.520,36.368";

//初期一周辺
var point_1 = "140.4567,36.6443";
var point_2 = "140.4567,34.360";
var point_3 = "137.4291,34.360";
var point_4 = "137.4291,36.6443";

//137.4291,36.6443
//140.4567,35.2868
//https://tb-gis-web.jgn-x.jp/storage/data/temp/itowns_template/?dt=201803201143&st=201803191630&et=201803222122&ct=201803201143&mLT=36.322387165259926&mLN=137.9406032779369&map_height=12618.730223360471&zoom=35&tilt=-25&heading=-39.69&layerIds=atmosphere%3A1%2C%E5%9C%B0%E7%90%86%E9%99%A2%E3%82%BF%E3%82%A4%E3%83%AB(%E8%88%AA%E7%A9%BA%E5%86%99%E7%9C%9F)%3A1%2C%E4%BA%BA%E6%B5%81%EF%BC%88GPS%EF%BC%89%3A1

/* 動画 */
var recordFlag = false;
var recorder;


// 初期表示位置（経度 緯度 高度）
//var positionOnGlobe = new itowns.Coordinates('EPSG:4326', 139.257125, 35.681236, 0)
//var positionOnGlobe = new itowns.Coordinates('EPSG:4326', 138.0977637, 36.5360014, 0)//稲荷山公園

//var positionOnGlobe = new itowns.Coordinates('EPSG:4326', 138.1414092, 36.5246307, 0)//森将軍塚古墳
//var positionOnGlobe = new itowns.Coordinates('EPSG:4326', 138.0923764, 36.5043649, 0)//碑姨捨公園
//var positionOnGlobe = new itowns.Coordinates('EPSG:4326', 138.13772, 36.4791626, 0)//千曲市城山史跡公園
//var positionOnGlobe = new itowns.Coordinates('EPSG:4326', 138.1358457, 36.4797055, 0);//千曲市城山史跡公園
var positionOnGlobe = new itowns.Coordinates('EPSG:4326', 138.06380970700545, 35.66818132677256, 0);

var ext = new itowns.Extent('EPSG:4326', 138.1358457, 36.4797055, 0);//千曲市城山史跡公園

//var ext = new itowns.Extent('EPSG:4326', 137.9,36.4 , 138.4,36.6);//千曲市

//history.replaceState('','','aiueo');
//history.pushState(null,null,"/hoge2");

// URLパラメータがあるときの表示
let inurl = new URL(location).toString();
let inparam = $.nictSTARSViewURL.parseURL(inurl);
let st;
let et;
let ct;
if(inparam["st"] != null && inparam["st"] != ""){
  st = inparam["st"];
}
if(inparam["et"] != null && inparam["et"] != ""){
  et = inparam["et"];
}
if(inparam["ct"] != null && inparam["ct"] != ""){
  ct = inparam["ct"];
}

if(inparam["map_latitude"] != null && inparam["map_latitude"] != "" && inparam["map_longitude"] != null && inparam["map_longitude"] != ""){
  positionOnGlobe = new itowns.Coordinates('EPSG:4326', parseFloat(inparam["map_longitude"]), parseFloat(inparam["map_latitude"]), 0)
}
let map_height = 20000;
if(inparam["map_height"] != null && inparam["map_height"] != ""){
  map_height = parseFloat(inparam["map_height"]);
}
let heading = 0.00;
if(inparam["heading"] != null && inparam["heading"] != ""){
  heading = parseFloat(inparam["heading"]);
}
let layerIds;
let layerIdsNames = [];
if(inparam["layerIds"] != null && inparam["layerIds"] != ""){
  // decodeURI
  // atmosphereが配列の最初に入ってくる
  layerIds = decodeURI(inparam["layerIds"]).split(',');
  console.log(layerIds);
  layerIds.shift();
//  for (const value of layerIds) {
//    layerIdsNames.push(value.split(":")[0])
//  }
  layerIds.filter( function( value ) {
    layerIdsNames.push(value.split(":")[0]);
  })
  console.log(layerIdsNames);
}

var view = new itowns.GlobeView(viewerDiv, positionOnGlobe, {
//var view = new itowns.PlanarView (viewerDiv, ext, {
	diffuse: new itowns.THREE.Color(0xEEEEEE),
});
// setupLoadingScreen(viewerDiv, view);

// テクスチャー用のview？
//var miniView = new itowns.GlobeView(miniDiv, positionOnGlobe, {
//    maxSubdivisionLevel: 2,
//    noControls: true,
//});

var menuGlobe = new GuiTools('menuDiv', view);


//カメラ位置・角度設定
var camera_v = view.camera.camera3D;
var options = {
    coord: positionOnGlobe, //lon,lat,altのObjectではなくitowns.Coordinate型
    tilt: 89, //地球表面とカメラのなす角 デフォルトは垂直で90
    // 描画後にset_camera_tilt_resetで再設定する
    heading: -heading, //回転
    range: map_height, //カメラと地球の距離
//  range: 20000.00000001701 //カメラと地球の距離
    time: 6500, //アニメーションの長さ（ミリ秒）
//    easing:0, //インとアウトのイージングアニメーション
    stopPlaceOnGroundAtEnd:0 //アニメーション終了時にターゲットを地面に配置するのを停止
};

itowns.CameraUtils.transformCameraToLookAtTarget(view, camera_v, options);//すぐ移動
//itowns.CameraUtils.animateCameraToLookAtTarget(view, camera_v, options);//アニメーション移動

// テクスチャーの底面を透明にする？
//miniView.mainLoop.gfxEngine.renderer.setClearColor(0x900000, 0);


DragNDrop.setView(view);
DragNDrop.register('geojson', DragNDrop.JSON, itowns.GeoJsonParser.parse, DragNDrop.COLOR);
DragNDrop.register('gpx', DragNDrop.XML, itowns.GpxParser.parse, DragNDrop.GEOMETRY);


//var atk = document.getElementById("atk").value;


let Folder;
//let Folder2;

Folder = menuGlobe.gui.addFolder("レイヤー追加");
//Folder2 = Folder.addFolder("レイヤSDS");


/*
■レイヤ追加リスト
*/

var LayN = '';
var k_lay = {};
var k_lay_list = {};


//LayN = '地理院Vタイル';
//var k_lay = [];
//k_lay[LayN] = false;
//k_lay['name'] = LayN;
//k_lay['folder'] = 'ベクトルタイル背景地図';
//k_lay['style'] = './test_itw/std.json';
//k_lay['url']   = '/api/std/experimental_bvmap/latest/${z}/${x}/${y}.pbf';
//k_lay['visible']   = '';
//k_lay['type'] = 'vectortile';
//k_lay_list[LayN] = k_lay
//
//
//LayN = 'OSM_MVT';
//var k_lay = [];
//k_lay[LayN] = false;
//k_lay['name'] = LayN;
//k_lay['folder'] = 'ベクトルタイル背景地図';
//k_lay['style'] = './test_itw/base_osm_vector.json';
//k_lay['url']   = '';
//k_lay['type'] = 'vectortile';
//k_lay_list[LayN] = k_lay


LayN = '海岸線';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 水域';
k_lay['style'] = '/storage/data/vectortile/1_a_1_1_kaigansen/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_1_1_kaigansen/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay

LayN = '海岸保全施設';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 水域';
k_lay['style'] = '/storage/data/vectortile/1_a_1_2_kaigan_hoan/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_1_2_kaigan_hoan/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay

LayN = '湖沼';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 水域';
k_lay['style'] = '/storage/data/vectortile/1_a_1_3_kosyou/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_1_3_kosyou/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay

LayN = 'ダム';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 水域';
k_lay['style'] = '/storage/data/vectortile/1_a_1_5_damu/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_1_5_damu/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay


LayN = '河川';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 水域';
k_lay['style'] = '/storage/data/vectortile/1_a_1_6_kasen/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_1_6_kasen/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay


LayN = '土地利用3次メッシュ';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 土地利用';
k_lay['style'] = '/storage/data/vectortile/1_a_3_1_totiriyou3zi/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_3_1_totiriyou3zi/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay

LayN = '土地利用細分メッシュ';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 土地利用';
k_lay['style'] = '/storage/data/vectortile/1_a_3_2_totiriyousaibun/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_3_2_totiriyousaibun/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay

LayN = '都市地域土地利用細分メッシュ';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 土地利用';
k_lay['style'] = '/storage/data/vectortile/1_a_3_3_tositiikitotiriyou/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_3_3_tositiikitotiriyou/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay

LayN = '土地利用詳細メッシュ';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 土地利用';
k_lay['style'] = '/storage/data/vectortile/1_a_3_4_totiriyousyousai/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_3_4_totiriyousyousai/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay



LayN = '避難施設';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 災害防災';
k_lay['style'] = '/storage/data/vectortile/1_a_4_1_hinan_sisetsu/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_4_1_hinan_sisetsu/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay



LayN = '土砂災害危険個所';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 災害防災';
k_lay['style'] = '/storage/data/vectortile/1_a_4_2_dosyakiken/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_4_2_dosyakiken/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay

LayN = '洪水浸水想定区域';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 災害防災';
k_lay['style'] = '/storage/data/vectortile/1_a_4_3_kouzui/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_4_3_kouzui/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay

LayN = '平年値（気候）';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 災害防災';
k_lay['style'] = '/storage/data/vectortile/1_a_4_4_heinenti/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_4_4_heinenti/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay

LayN = '土砂災害・雪崩';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 災害防災';
k_lay['style'] = '/storage/data/vectortile/1_a_4_5_dosyanadare/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_4_5_dosyanadare/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay

LayN = '土砂災害警戒区域';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 災害防災';
k_lay['style'] = '/storage/data/vectortile/1_a_4_6_dosyakuiki/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_4_6_dosyakuiki/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay

LayN = '津波浸水想定';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 災害防災';
k_lay['style'] = '/storage/data/vectortile/1_a_4_7_tunami/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_4_7_tunami/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay


LayN = '国・都道府県の機関';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 施設';
k_lay['style'] = '/storage/data/vectortile/1_a_5_1_kunikikan/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_5_1_kunikikan/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay

LayN = '市町村役場等及び公的集会施設';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 施設';
k_lay['style'] = '/storage/data/vectortile/1_a_5_2_syuukaisisetu/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_5_2_syuukaisisetu/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay

LayN = '市区町村役場';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 施設';
k_lay['style'] = '/storage/data/vectortile/1_a_5_3_yakuba/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_5_3_yakuba/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay

LayN = '公共施設';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 施設';
k_lay['style'] = '/storage/data/vectortile/1_a_5_4_koukyousisetu/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_5_4_koukyousisetu/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay

LayN = '警察署';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 施設';
k_lay['style'] = '/storage/data/vectortile/1_a_5_5_keisatusyo/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_5_5_keisatusyo/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay

LayN = '消防署';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 施設';
k_lay['style'] = '/storage/data/vectortile/1_a_5_6_syoubousyo/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_5_6_syoubousyo/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay

LayN = '医療機関';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 施設';
k_lay['style'] = '/storage/data/vectortile/1_a_5_8_iryoukikan/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_5_8_iryoukikan/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay

LayN = '学校';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 施設';
k_lay['style'] = '/storage/data/vectortile/1_a_5_11_gakkou/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_5_11_gakkou/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay




LayN = '緊急輸送道路';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 交通';
k_lay['style'] = '/storage/data/vectortile/1_a_6_2_kinkyuuyusou/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_6_2_kinkyuuyusou/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay

LayN = '道路密度・道路延長メッシュ';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 交通';
k_lay['style'] = '/storage/data/vectortile/1_a_6_3_mitudoentyou/latest/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_6_3_mitudoentyou/latest/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay

LayN = '鉄道';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '地理空間情報データ 交通';
k_lay['style'] = '/storage/data/vectortile/1_a_6_6_tetsudo/2020/style.json';
k_lay['url']   = '/api/data/vectortile/1_a_6_6_tetsudo/2020/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay


LayN = '降水 【時系列】';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '気象情報データベース';
k_lay['url']   = '/api/wni/{YYYY}{MM}{DD}/{hh}{mm}/${z}/${x}/${y}.png';
k_lay['type'] = 'rastertile';
k_lay_list[LayN] = k_lay

LayN = '日射 【時系列】';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '気象情報データベース';
k_lay['url']   = '/api/weather/amjp/{YYYY}/{MM}/{DD}/{hh}/{mm}/${z}/${x}/${y}.png';
k_lay['type'] = 'rastertile';
k_lay_list[LayN] = k_lay

LayN = '風向 【時系列】';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '気象情報データベース';
k_lay['url']   = '/api/weather_amjp_veda02_sshfs/wnd/{YYYY}/{MM}/{DD}/{hh}/{mm}/${z}/${x}/${y}.png';
k_lay['type'] = 'rastertile';
k_lay_list[LayN] = k_lay

LayN = '温度 【時系列】';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '気象情報データベース';
k_lay['url']   = '/api/weather_amjp_veda02_sshfs/tsfc/{YYYY}/{MM}/{DD}/{hh}/{mm}/${z}/${x}/${y}.png';
k_lay['type'] = 'rastertile';
k_lay_list[LayN] = k_lay

LayN = '湿度 【時系列】';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '気象情報データベース';
k_lay['url']   = '/api/weather_amjp_veda02_sshfs/rh.sfc/{YYYY}/{MM}/{DD}/{hh}/{mm}/${z}/${x}/${y}.png';
k_lay['type'] = 'rastertile';
k_lay_list[LayN] = k_lay


LayN = '水位';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '気象情報データベース';
k_lay['url']   = '/api/weatherrmap/${z}/${x}/${y}.png';
k_lay['type'] = 'rastertile';
k_lay_list[LayN] = k_lay


LayN = 'ひまわり 【時系列】';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '気象情報データベース';
k_lay['url']   = '/api/weather/h8jp/2020/08/21/06/25/${z}/${x}/${y}.png';
k_lay['type'] = 'rastertile';
k_lay_list[LayN] = k_lay



LayN = 'アメダス 【時系列】';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '3Dデータ';
k_lay['url']   = 'https://tb-gis-web.jgn-x.jp/api/t_people_flow_data?point_1=139.4,35.7&point_2=139.5,35.603&point_3=139.6,35.80&point_4=139.4,35.80&currentDate=2018040412';
k_lay['type'] = 'demographics';
k_lay_list[LayN] = k_lay







LayN = '市区町村境界 【時系列】';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '行政境界';
k_lay['style'] = 'https://tb-gis-web.jgn-x.jp/mapbox_sample/Mapbox_map/json/layer_city_boundary.json';
k_lay['url']   = '/api/jp_city/20200101/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay



LayN = '町丁目境界';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '行政境界';
k_lay['style'] = '/mapbox_template/Mapbox_map/json/layer_town.json';
//k_lay['style'] = '/mapbox_template/Mapbox_map/json/layer_city_boundary.json';
//k_lay['url']   = '/api/vector-adm/tile/town/${z}/${x}/${y}.pbf';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay
//https://tb-gis-web.jgn-x.jp/api/vector-adm/tile/town/13/7274/3226.pbf
//https://tb-gis-web.jgn-x.jp/api/vector-adm/tile/town/8/227/101.pbf
//https://tb-gis-web.jgn-x.jp/api/jp_city/{yyyymmdd}/{z}/{x}/{y}.pbf
//https://tb-gis-web.jgn-x.jp/api/vector-adm/tile/town/13/7273/3225.pbf

LayN = '人口(町丁目)';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '行政境界';
k_lay['style'] = '/mapbox_template/Mapbox_map/json/layer_town_color.json';
k_lay['type'] = 'vectortile';
k_lay_list[LayN] = k_lay



//LayN = '東京';
//var k_lay = [];
//k_lay[LayN] = false;
//k_lay['name'] = LayN;
//k_lay['folder'] = '東京';
//k_lay['style'] = 'https://tb-gis-web.jgn-x.jp/mapbox_sample/Mapbox_map/json/layer_plateau_tokyo.json';
//k_lay['url']   = '/storage/data/PLATEAU/tokyo/mvt2/${z}/${x}/${y}.pbf';
//k_lay['type'] = 'vectortile';
//k_lay_list[LayN] = k_lay


LayN = '橋梁オブジェクト';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '3Dデータ';
k_lay['type'] = 'tokyo23ku_bridge';
k_lay_list[LayN] = k_lay


//LayN = 'グラフ';
//var k_lay = [];
//k_lay[LayN] = false;
//k_lay['name'] = LayN;
//k_lay['folder'] = '3Dデータ';
//k_lay['type'] = 'test_bargraph';
//k_lay_list[LayN] = k_lay


LayN = '人口グラフ【時系列】';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = '3Dデータ';
k_lay['type'] = 'demographics';
k_lay_list[LayN] = k_lay



LayN = '面群データ';//
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = 'センサーデータ【時系列】';
k_lay['url']   = './data/202202012200.json';
k_lay['type'] = 'FileSource';
k_lay_list[LayN] = k_lay

LayN = '点群データ';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = 'センサーデータ【時系列】';
k_lay['url']   = 'https://tb-gis-web.jgn-x.jp/api/t_people_flow_data?point_1=' + point_1 + '&point_2=' + point_2 + '&point_3=' + point_3 + '&point_4=' + point_4 + '&currentDate=201804041228';
k_lay['type'] = 'FileSource';
k_lay_list[LayN] = k_lay



LayN = '人流（GPS）';
var k_lay = [];
k_lay[LayN] = false;
k_lay['name'] = LayN;
k_lay['folder'] = 'センサーデータ【時系列】';
k_lay['url']   = 'https://tb-gis-web.jgn-x.jp/api/t_people_flow_data?point_1=' + point_1 + '&point_2=' + point_2 + '&point_3=' + point_3 + '&point_4=' + point_4 + '&currentDate=201804041228';
k_lay['type'] = 'jinryu';
k_lay_list[LayN] = k_lay





//地理空間情報データ 地形
//地理空間情報データ 土地利用
//地理空間情報データ 災害防災
//地理空間情報データ 施設
//地理空間情報データ 交通
//気象情報データベース
//3次元建物データ

/////////////
/*
■レイヤ追加
*/

for (let i in k_lay_list) {
	//var PROPERTY = k_lay_list[step];
	var FolN = k_lay_list[i]["folder"];//'湖沼';
	if (Folder.__folders[FolN] === undefined) {
		var fol = Folder.addFolder(FolN);
	}else{
		var fol = Folder.__folders[FolN];
	}
	LayN = k_lay_list[i]['name'];

	var list1 = fol.add(k_lay_list[i], LayN).onChange(function(){
		LayN = this.property;
	//	alert(this.property,(this));
		if(this.object['type'] == 'vectortile'){
			if(this.object[LayN]==true){

				var myHeaders = new Headers();
				myHeaders.append('Authorization', 'Bearer '+document.getElementById("atk").value);

			    var mvtSource = new itowns.VectorTilesSource({
			        style: this.object['style'],
			        url: this.object['url'],
			        networkOptions: { 
						headers: myHeaders,
					},
///					networkOptions: { crossOrigin: 'anonymous' },
			        attribution: {
			            name: '地理院',
			            url: '#',
			        },
			        zoom: { min: 5, max: 13 },
			    });
			    var mvtLayer = new itowns.ColorLayer(LayN, {
			        isValidData: isValidData,
			        addLabelLayer: true,
			        source: mvtSource,
			        fx: 2.5,
			        labelEnabled: true,
			    });

				view.addLayer(mvtLayer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
				view.getLayerById(LayN).visible = true;
				view.getLayerById(LayN).opacity = 0.8;
				
				view.notifyChange();
			//	menuGlobe.gui.__folders["レイヤー"].__folders["湖沼"].open();
	        } else {
				view.removeLayer(LayN);//削除
				menuGlobe.removeLayersGUI(LayN);//削除
				view.notifyChange();
			}
		}else if(this.object['type'] == 'rastertile'){

			if(this.object[LayN]==true){
  				var objOptions = $("#timeline").k2goTimeline("getOptions").currentTime;//.getTime();
				//var current = { date : $("#current_time2 input[type='date']"), time : $("#current_time2 input[type='time']") };

//				k_lay['url']   = '/api/weather_amjp_veda02_sshfs/rh.sfc/{YYYY}/{MM}/{DD}/{hh}/{mm}/${z}/${x}/${y}.png';
				var $current_p = objOptions;
				var TMS_url = this.object['url'];
				TMS_url = TMS_url.replace('{YYYYMMDD}',formatDateUTC($current_p, 'YYYYMMDD'));
				TMS_url = TMS_url.replace('{hhmm}',formatDateUTC($current_p, 'hhmm').slice(0,-1)+'0');
				TMS_url = TMS_url.replace('{YYYY}',formatDateUTC($current_p, 'YYYY'));
				TMS_url = TMS_url.replace('{MM}',formatDateUTC($current_p, 'MM'));
				TMS_url = TMS_url.replace('{DD}',formatDateUTC($current_p, 'DD'));
				TMS_url = TMS_url.replace('{hh}',formatDateUTC($current_p, 'hh'));
				TMS_url = TMS_url.replace('{mm}',formatDateUTC($current_p, 'mm').slice(0,-1)+'0');


				const tmsSource = new itowns.TMSSource({
				    format: 'image/png',
				    crs: "EPSG:3857",
				    url: TMS_url,
				    attribution: {
				        name: 'wni',//
				        url: 'https://amaterass.nict.go.jp/',
				    }
				});
				const colorLayer = new itowns.ColorLayer(LayN, {
				    source: tmsSource,
				});
				view.addLayer(colorLayer).then(menuGlobe.addLayerGUI.bind(menuGlobe));

				view.getLayerById(LayN).visible = true;
				view.getLayerById(LayN).opacity = 0.7;
				view.notifyChange();
	        } else {
				view.removeLayer(LayN);//削除
				menuGlobe.removeLayersGUI(LayN);//削除
				view.notifyChange();
			}
/* 
■橋梁表示*/
		}else if(this.object['type'] == 'tokyo23ku_bridge'){
			LayN = this.property;
			if(this.object[LayN]==true){
			    const extensions = new itowns.C3DTExtensions();
			    extensions.registerExtension("3DTILES_batch_table_hierarchy",
			        { [itowns.C3DTilesTypes.batchtable]:
			            itowns.C3DTBatchTableHierarchyExtension });

			    // Create the 3D Tiles layer
			    var $3dTilesLayerBTHierarchy = new itowns.C3DTilesLayer(
			        LayN, {
			            name: LayN,
			            source: new itowns.C3DTilesSource({
			                url: '/storage/data/PLATEAU/tokyo/3DTiles/tokyo23ku_bridge/tileset.json',
//							url: '/storage/data/PLATEAU/kitakyusyu/3DTiles/01_building/bldg_notexture/tileset.json',
			            }),
			            registeredExtensions: extensions,
			        },
			    view);

			    // add an event for picking the 3D Tiles layer and displaying
			    // information about the picked feature in an html div
			    var pickingArgs = {};
			    pickingArgs.htmlDiv = document.getElementById('featureInfo');
			    pickingArgs.view = view;
			    pickingArgs.layer = $3dTilesLayerBTHierarchy;
			    itowns.View.prototype.addLayer.call(view, $3dTilesLayerBTHierarchy).then(menuGlobe.addLayerGUI.bind(menuGlobe));
//			    itowns.View.prototype.addLayer.call(view, $3dTilesLayerBTHierarchy).then(function _() {
			// コメントアウト
			//        window.addEventListener('mousemove',
			//            (event) => fillHTMLWithPickingInfo(event, pickingArgs),false);
//					var a = '';
//			    });

			    // Add a debug UI
//			    var d = new debug.Debug(view, menuGlobe.gui);
//			    debug.createTileDebugUI(menuGlobe.gui, view, view.tileLayer, d);
//			    debug.create3dTilesDebugUI(menuGlobe.gui, view,
//			        $3dTilesLayerBTHierarchy,
//			        d);



	        } else {
				view.getLayerById(LayN).visible = false;
				view.removeLayer(LayN);//削除
				menuGlobe.removeLayersGUI(LayN);//削除
				view.notifyChange();
			}

		}else if(this.object['type'] == 'test_bargraph'){
/*
			LayN = this.property;
			if(this.object[LayN]==true){
				//グラフ
				var config = {
				  "id":LayN,
				  "crs": "EPSG:3857",
				  "isUserData": true,
				  "opacity": 1.0,
				  "jsonurl": "./data/test.json",
				  "url": "./data/test.csv",
				  "scale":  0.1,
				  "zoom":{"min":1, "max":20}
				};

				var bargraphLayer = CreateBargraphLayer(view, config);

				//itowns.View.prototype.addLayer.call(view, bargraphLayer);

			    var mvtLayer = new itowns.ColorLayer(LayN, {
			        source: bargraphLayer,
			    });
				itowns.View.prototype.addLayer.call(view, bargraphLayer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
				//view.addLayer(mvtLayer).then(menuGlobe.addLayerGUI.bind(menuGlobe));


				bargraphLayer.whenReady.then(() => {
				  bargraphLayer.updateBarGraph();
				});

				// 拡縮
				view.controls.addEventListener(itowns.CONTROL_EVENTS.RANGE_CHANGED, () => {
				  bargraphLayer.whenReady.then(() => {
				    bargraphLayer.updateBarGraph();
				  });
				});

				function updateBargraphLayer(view, currentTime, config){
				  let bargraphLayerConfig = config;
				  bargraphLayerConfig.url = "./data/" + currentTime + ".csv";
				  console.log(JSON.stringify(config));
				  view.removeLayer(config.id);

				  bargraphLayer = CreateBargraphLayer(view, bargraphLayerConfig);

			    var mvtLayer = new itowns.ColorLayer(LayN, {
			        source: bargraphLayer,
			    });

				  view.addLayer(mvtLayer).then(menuGlobe.addLayerGUI.bind(menuGlobe));

				  mvtLayer.whenReady.then(() => {
				    mvtLayer.updateBarGraph();
				  });
				}

	        } else {
				view.getLayerById(LayN).visible = false;
				view.removeLayer(LayN);//削除
				menuGlobe.removeLayersGUI(LayN);//削除
				view.notifyChange();
			}
*/
		}else if(this.object['type'] == 'demographics'){
			LayN = this.property;
			if(this.object[LayN]==true){

				if(LayN=='アメダス 【時系列】'){
					amedas_graph = true
					var bargraphAmedasLayer = CreateBargraphLayer(view, amedas_graph_config, 5);

					view.addLayer(bargraphAmedasLayer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
					view.getLayerById('アメダス 【時系列】').visible = true;

					bargraphAmedasLayer.whenReady.then(() => {
					  bargraphAmedasLayer.updateBarGraph();
					});

					// 拡縮
					view.controls.addEventListener(itowns.CONTROL_EVENTS.RANGE_CHANGED, () => {
					  bargraphAmedasLayer.whenReady.then(() => {
					    bargraphAmedasLayer.updateBarGraph();
					  });
					});
				
				}else{
					graph_config = true;
					var bargraphLayer_b = CreateBargraphLayer(view, graph_config_b, 2);
					var bargraphLayer_r = CreateBargraphLayer(view, graph_config_r, 3);
					var bargraphLayer_y = CreateBargraphLayer(view, graph_config_y, 4);

					view.addLayer(bargraphLayer_b).then(menuGlobe.addLayerGUI.bind(menuGlobe));
					view.getLayerById('人口').visible = true;
					view.addLayer(bargraphLayer_r).then(menuGlobe.addLayerGUI.bind(menuGlobe));
					view.getLayerById('世帯').visible = true;
					view.addLayer(bargraphLayer_y).then(menuGlobe.addLayerGUI.bind(menuGlobe));
					view.getLayerById('住宅数').visible = true;

					bargraphLayer_b.whenReady.then(() => {
					  bargraphLayer_b.updateBarGraph();
					});
					bargraphLayer_r.whenReady.then(() => {
					  bargraphLayer_r.updateBarGraph();
					});
					bargraphLayer_y.whenReady.then(() => {
					  bargraphLayer_y.updateBarGraph();
					});
					// 拡縮
					view.controls.addEventListener(itowns.CONTROL_EVENTS.RANGE_CHANGED, () => {
					  bargraphLayer_b.whenReady.then(() => {
					    bargraphLayer_b.updateBarGraph();
					  });
					  bargraphLayer_r.whenReady.then(() => {
					    bargraphLayer_r.updateBarGraph();
					  });
					  bargraphLayer_y.whenReady.then(() => {
					    bargraphLayer_y.updateBarGraph();
					  });
					});
				}


	        } else {
				if(LayN=='アメダス 【時系列】'){
					amedas_graph = false;
					view.getLayerById('アメダス 【時系列】').visible = false;
					view.removeLayer('アメダス 【時系列】');//削除
					menuGlobe.removeLayersGUI('アメダス 【時系列】');//削除
				}else{
					graph_config = false;
					view.getLayerById('人口').visible = false;
					view.removeLayer('人口');//削除
					menuGlobe.removeLayersGUI('人口');//削除
					view.getLayerById('世帯').visible = false;
					view.removeLayer('世帯');//削除
					menuGlobe.removeLayersGUI('世帯');//削除
					view.getLayerById('住宅数').visible = false;
					view.removeLayer('住宅数');//削除
					menuGlobe.removeLayersGUI('住宅数');//削除
					view.notifyChange();
				}
			}

		}else if(this.object['type'] == 'jinryu'){
			LayN = this.property;
			if(this.object[LayN]==true){
				// 人流
				// 初期表示用なのでurlをcurrentDate=201804041228で仮で設定している
				// データがある時間帯を表示したらvisibleのON/OFFが効かなくなる現象があるので気にしておく
				var jinryuSource = new itowns.FileSource({
				//    url: 'https://tb-gis-web.jgn-x.jp/api/t_people_flow_data?point_1=139.76963703061347,35.78353046399056&point_2=139.76963703061347,35.60914042270298&point_3=139.0965282258951,35.60914042270298&point_4=139.0965282258951,35.78353046399056&currentDate=201804041228',
				    url: 'https://tb-gis-web.jgn-x.jp/api/t_people_flow_data?point_1=' + point_1 + '&point_2=' + point_2 + '&point_3=' + point_3 + '&point_4=' + point_4 + '&currentDate=201804041228',
				    crs: 'EPSG:4326',
				    format: 'application/json',
				});
				// Create a ColorLayer for the Ariege area
				var jinryuLayer = new itowns.ColorLayer('人流（GPS）', {
				    name: '人流（GPS）',
				    transparent: true,
				    source: jinryuSource,
				    style: new itowns.Style({
				      point: { color: 'red', line: 'red', radius: '6' }
				    }),
				});
				view.addLayer(jinryuLayer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
	        } else {
				view.getLayerById(LayN).visible = false;
				view.removeLayer(LayN);//削除
				menuGlobe.removeLayersGUI(LayN);//削除
				view.notifyChange();
			}



		}else if(this.object['type'] == 'FileSource'){
			LayN = this.property;
			if(this.object[LayN]==true){

				//alert('2022年2月1日午後に設定');

				//面群
				const sourceFromParsedData = new itowns.FileSource({
			        url: this.object['url'],
//				    url: './data/202202012200.json',
				    format: 'application/json',
				    crs: "EPSG:4326",
				    attribution: {
							//	name: 'wni',//
							//	url: 'https://amaterass.nict.go.jp/',
				    }
				});
				const menColorLayer = new itowns.ColorLayer( LayN, {
				    source: sourceFromParsedData,
				});
				view.addLayer(menColorLayer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
	        } else {
				view.getLayerById(LayN).visible = false;
				view.removeLayer(LayN);//削除
				menuGlobe.removeLayersGUI(LayN);//削除
				view.notifyChange();
			}
		}
		layerGuide(LayN, this.object[LayN]);


	})
	//list1.__checkbox.checked = true;
	//list1.object[LayN] = true;
	//list1.__onChange();
//*
//	const LayONlist = ['地理院Vタイル', 'OSM_MVT', '消防署'];
	for (const elem of layerIdsNames) {
		if(elem == LayN){
			//list1.object[elem] = true;
			//list1.__onChange();
		}
	}
//*/
}


/* 
■初期表示
*/


/////////////////////////////////
    // Add a vector tile layer
    function inter(z) {
        return z - (z % 5);
    }

    function isValidData(data, extentDestination) {
        const isValid = inter(extentDestination.zoom) == inter(data.extent.zoom);
        return isValid;
    }




//地理院航空写真
const tmsSource = new itowns.TMSSource({
    format: 'image/png',
//    projection: "EPSG:3857",
    crs: "EPSG:3857",
//    url: 'https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/${z}/${x}/${y}.jpg',
    url: '/api/photo/${z}/${x}/${y}.jpg',
    zoom: {
        min: 2,
        max: 16,
    },
    attribution: {
        name: 'cyberjapandata',//
        url: '#',
    }
});
const colorLayer = new itowns.ColorLayer('地理院タイル(航空写真)', {
    source: tmsSource,
});
view.addLayer(colorLayer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
view.getLayerById('地理院タイル(航空写真)').visible = true;

/*
//Google院航空写真
const tmsSource0 = new itowns.TMSSource({

    format: 'image/png',
//    projection: "EPSG:3857",
    crs: "EPSG:3857",
//    url: 'https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/${z}/${x}/${y}.jpg',
    url: 'https://mt1.google.com/vt/lyrs=s&x=${x}&y=${y}&z=${z}',
//    zoom: { min: 2, max: 13},
    attribution: {
        name: 'cyberjapandata',//
        url: 'http://www.openstreetmap.org/',
    }
});
const colorLayer0 = new itowns.ColorLayer('航空写真(google)', {
    source: tmsSource0,
});
view.addLayer(colorLayer0).then(menuGlobe.addLayerGUI.bind(menuGlobe));
view.getLayerById('航空写真(google)').visible = false;



//Google院航空写真
const tmsSourceX = new itowns.TMSSource({

    format: 'image/png',
//    projection: "EPSG:3857",
    crs: "EPSG:3857",
    url: 'https://mt1.google.com/vt/lyrs=y&x=${x}&y=${y}&z=${z}',
//    zoom: { min: 2, max: 13},
    attribution: {
        name: 'cyberjapandata',//
        url: 'http://www.openstreetmap.org/',
    }
});
const colorLayerX = new itowns.ColorLayer('航空写真(googleHybrid)', {
    source: tmsSourceX,
});
view.addLayer(colorLayerX).then(menuGlobe.addLayerGUI.bind(menuGlobe));
view.getLayerById('航空写真(googleHybrid)').visible = false;

*/

//地理院地図
const tmsSource_std = new itowns.TMSSource({
    format: 'image/png',
//    projection: "EPSG:3857",
    crs: "EPSG:3857",
    url: '/api/std/${z}/${x}/${y}.png',
    zoom: {
        min: 2,
        max: 16,
    },
    attribution: {
        name: 'std',//
        url: '#',
    }
});
const colorLayer_std = new itowns.ColorLayer('地理院タイル(標準)', {
    source: tmsSource_std,
});
view.addLayer(colorLayer_std).then(menuGlobe.addLayerGUI.bind(menuGlobe));
view.getLayerById('地理院タイル(標準)').visible = false;

////面群
//const sourceFromParsedData = new itowns.FileSource({
//    url: './data/202202012200.json',
//    format: 'application/json',
//    crs: "EPSG:4326",
//    attribution: {
////			        name: 'wni',//
////			        url: 'https://amaterass.nict.go.jp/',
//    }
//});
//const menColorLayer = new itowns.ColorLayer('面群', {
//    source: sourceFromParsedData,
//});
//view.addLayer(menColorLayer).then(menuGlobe.addLayerGUI.bind(menuGlobe));


//地理院地図
const tmsSource_pale = new itowns.TMSSource({
    format: 'image/png',
//    projection: "EPSG:3857",
    crs: "EPSG:3857",
    url: '/api/pale/${z}/${x}/${y}.png',
    zoom: {
        min: 2,
        max: 16,
    },
    attribution: {
        name: 'pale',//
        url: '#',
    }
});
const colorLayer_pale = new itowns.ColorLayer('地理院タイル(淡色)', {
    source: tmsSource_pale,
});
view.addLayer(colorLayer_pale).then(menuGlobe.addLayerGUI.bind(menuGlobe));
view.getLayerById('地理院タイル(淡色)').visible = false;


//OSM
const tmsSource_osm = new itowns.TMSSource({
    format: 'image/png',
//    projection: "EPSG:3857",
    crs: "EPSG:3857",
    url: '/api/osmr/styles/osm-bright-ja/${z}/${x}/${y}.png',
    zoom: {
        min: 2,
        max: 16,
    },
    attribution: {
        name: 'osm',//
        url: '#',
    }
});
const colorLayer_osm = new itowns.ColorLayer('OSM(ラスター)', {
    source: tmsSource_osm,
});
view.addLayer(colorLayer_osm).then(menuGlobe.addLayerGUI.bind(menuGlobe));
view.getLayerById('OSM(ラスター)').visible = false;



////////////////地理院Vタイル/////////////////
    var mvtSource = new itowns.VectorTilesSource({
//        style: 'https://raw.githubusercontent.com/Oslandia/postile-openmaptiles/master/style.json',
//        style: './test_itw/osm_mvt_style.json',
//        style: './test_itw/std.json',
        style: './test_itw/std_n.json',
//        style: './test_itw/std.json',
        // eslint-disable-next-line no-template-curly-in-string
//        url: 'https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/${z}/${x}/${y}.pbf',
        attribution: {
            name: 'OpenStreetMap',
            url: 'http://www.openstreetmap.org/',
        },
        zoom: {
            min: 2,
            max: 14,
        },
    });

    var mvtLayer = new itowns.ColorLayer('地理院Vタイル', {
        isValidData: isValidData,
        addLabelLayer: true,
        source: mvtSource,
        fx: 2.5,
        labelEnabled: true,
    });

//            view.addLayer(mvtLayer);

	view.addLayer(mvtLayer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
	view.getLayerById('地理院Vタイル').visible = false;

/////////////////OSM_MVT//////////////////////


//setTimeout(function(){ 

//	var myHeaders = new Headers();
//	myHeaders.append('Authorization', 'Bearer '+document.getElementById("atk").value);

    var mvtSource3 = new itowns.VectorTilesSource({
//        style: './test_itw/osm_mvt_style.json',
//        style: './test_itw/base_osm_vector.json',
        style: './test_itw/maptiler-basic-ja_style.json',
        // eslint-disable-next-line no-template-curly-in-string
//        url: 'https://tb-gis-web.jgn-x.jp/api/osmv/data/japan/${z}/${x}/${y}.pbf',
//		networkOptions: { 
//			headers: myHeaders,
//		},
        attribution: {
            name: 'OpenStreetMap',
            url: 'http://www.openstreetmap.org/',
        },
        zoom: {
            min: 2,
            max: 14,
        },
    });

    var mvtLayer2 = new itowns.ColorLayer('OSM_MVT', {
        isValidData: isValidData,
        addLabelLayer: true,
        source: mvtSource3,
        fx: 2.5,
        labelEnabled: true,
    });

//            view.addLayer(mvtLayer);

	view.addLayer(mvtLayer2).then(menuGlobe.addLayerGUI.bind(menuGlobe));
	view.getLayerById('OSM_MVT').visible = false;



//}, 20000);





// 選択しているレイヤのidと透明度のリストを取得
function getLayerIdsWithOpacity(){
  const ret_ids = [];
//  ret_ids = menuGlobe;
  view.tileLayer.attachedLayers.forEach(function(l_info) {
    var source_id = l_info.id;
    var source_op;
    var source_vi;
    if(source_id){
      source_op = l_info.opacity;
      source_vi = l_info.visible;
      if(source_vi){
		// 半角スペースを%20に置換しておいてdecodeの際に＋に変換させない
		//ret_ids.push(source_id + ":" + String(source_op));
		ret_ids.push(source_id.replace(' ', '%20') + ":" + String(source_op));
      }
    }
  });
  return ret_ids
}

// GeoJSONファイルを解析して読み込む
var amedass_flg = 0;
var geojson_data = {};
async function readGeoJSON(){
  console.log("readGeoJSON start")
  var currentTime = formatDate(new Date($("#timeline").k2goTimeline("getOptions").currentTime.getTime()), 'YYYYMMDDhhmm');
  var geojson_data = [];

//  console.log(layerIdsNames);
//  console.log(formatDate(currentTime, 'YYYYMMDDhhmm'));
//  console.log(objOptions);
//
//  let selected_yyyymmdd = formatDate(g_current_p, 'YYYYMMDD');
//  let selected_hhmi = formatDate(g_current_p, 'hhmm');
//
////  bound = wgapp.map.getBounds();
//
//  let selectedLayerIds = getLayerIds();
//
//  // URLから選択された場合を考慮
//  if(layerIdsNames == null){
//    if(url_select_layerids == undefined || url_select_layerids == null){
//      return null;
//    }
//    selectedLayerIds = Object.keys(url_select_layerids);
//  }
//
//  // console.log("selectedLayerIds", selectedLayerIds)
//
//  if (layerIdsNames.includes("人流（GPS）") || view.getLayerById('人流（GPS）')) {
  if ( view.getLayerById('人流（GPS）')) {

//  console.log(layerIdsNames);
//  console.log(point_1 + point_2 + point_3 + point_4);
    var path = "https://tb-gis-web.jgn-x.jp/api/t_people_flow_data?point_1=" 
             + point_1 + "&point_2=" + point_2 + "&point_3=" + point_3 + "&point_4=" + point_4 + "&currentDate=" + currentTime;
    try{
      const response = await fetch(path);
      if (response.ok) {

        const jinryuSource = new itowns.FileSource({
          url: path,
          crs: 'EPSG:4326',
          format: 'application/json',
        });
        setGeojsonLayerSource("人流（GPS）", jinryuSource);
      } else {
        console.log("HTTP-Error: " + response.status);
        return null;
      }
    } catch(err) {
      console.log(err);
      return null;
    }
  }


////  if (layerIdsNames.includes("アメダス") || view.getLayerById('アメダス')) {
//  if (view.getLayerById('アメダス 【時系列】')) {
//   if (amedass_flg == 1) {
//     return null;
//   }
//   path = "https://tb-gis-web.jgn-x.jp/api/t_amedas_data?point_1=" 
//        + point_1 + "&point_2=" + point_2 + "&point_3=" + point_3 + "&point_4=" + point_4 + "&currentDate=" + currentTime;
//   try{
//      amedass_flg = 1;
//      const response = await fetch(path);
//      if (response.ok) {
//        const amedasSource = new itowns.FileSource({
//          url: path,
//          crs: 'EPSG:4326',
//          format: 'application/json',
//        });
//        setGeojsonLayerSource("アメダス 【時系列】", amedasSource);
//        amedass_flg = 0;
//    } else {
//        console.log("HTTP-Error: " + response.status);
//        amedass_flg = 0;
//        return null;
//      }
//    } catch(err) {
//      console.log(err);
//      amedass_flg = 0;
//      return null;
//    }
//  }


//  if (selectedLayerIds.includes("layer_amedas")) {
//   if (amedass_flg == 1) {
//     return null;
//   }
//   path = "https://tb-gis-web.jgn-x.jp/api/t_amedas_data?point_1=" 
//		+ point_1 + "&point_2=" + point_2 + "&point_3=" + point_3 + "&point_4=" + point_4 + "&currentDate=" + selected_yyyymmdd + selected_hhmi;
//   try{
//      amedass_flg = 1;
//      const response = await fetch(path);
//      if (response.ok) {
//        geojson_data["layer_amedas"] =  await response.json();
//        setBargraphLayerSource("layer_amedas_L1","layer_amedas");
//        setGeojsonLayerSource("layer_amedas_L1","layer_amedas");
//        amedass_flg = 0;
//    } else {
//        console.log("HTTP-Error: " + response.status);
//        amedass_flg = 0;
//        return null;
//      }
//    } catch(err) {
//      console.log(err);
//      amedass_flg = 0;
//      return null;
//    }
//  }
//
  console.log("readGeoJSON end")
}

// geojsonのセット
function setGeojsonLayerSource (layerId,source) {
//    const oldLayers = view.tileLayer.attachedLayers;
//    const layerIndex = oldLayers.findIndex(l => l.id === layerId);
//    const layerDef = oldLayers[layerIndex];
//    const before = oldLayers[layerIndex + 1] && oldLayers[layerIndex + 1].id;
  if (view.getLayerById('人流（GPS）')) {

    try{
      var vis = view.getLayerById('人流（GPS）').visible;
      var opa = view.getLayerById('人流（GPS）').opacity;
      view.removeLayer(layerId);
      menuGlobe.removeLayersGUI(layerId);
      view.tileLayer.attachedLayers = view.tileLayer.attachedLayers.filter(attached => attached.id != layerId);
      const jinryuLayer = new itowns.ColorLayer('人流（GPS）', {
        name: '人流（GPS）',
//        transparent: true,
        source: source,
        style: new itowns.Style({
          point: { color: 'red', line: 'red', radius: '6' }
        }),
      });
      view.addLayer(jinryuLayer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
      view.getLayerById('人流（GPS）').visible = vis;
      view.getLayerById('人流（GPS）').opacity = opa;
    } catch(err) {
      console.log(err);
    }
  }

//  if (view.getLayerById('アメダス 【時系列】')) {
//    try{
//      var vis = view.getLayerById('アメダス 【時系列】').visible;
//      var opa = view.getLayerById('アメダス 【時系列】').opacity;
//      view.removeLayer(layerId);
//      menuGlobe.removeLayersGUI(layerId);
//      view.tileLayer.attachedLayers = view.tileLayer.attachedLayers.filter(attached => attached.id != layerId);
//      const amedasLayer = new itowns.ColorLayer('アメダス 【時系列】', {
//        name: 'アメダス 【時系列】',
////        transparent: true,
//        source: source,
//        style: new itowns.Style({
//          point: { color: 'gray', line: 'gray', radius: '6' }
//        }),
//      });
//      view.addLayer(amedasLayer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
//      view.getLayerById('アメダス 【時系列】').visible = vis;
//      view.getLayerById('アメダス 【時系列】').opacity = opa;
//    } catch(err) {
//      console.log(err);
//    }
//  }



}



var amedas_graph = false;

// アメダス
var amedas_graph_config = {
  "id":"アメダス 【時系列】",
  "crs": "EPSG:3857",
  "opacity": 1.0,
  "bool_geojson": true,
//  "jsonurl": "./demographics/test2.json",
  "url": 'https://tb-gis-web.jgn-x.jp/api/t_amedas_data?point_1=' + point_1 + '&point_2=' + point_2 + '&point_3=' + point_3 + '&point_4=' + point_4 + '&currentDate=202203161240',
  "format": 'application/json',
  "zoom":{"min":1, "max":20}
};

var graph_config = false;

var graph_config_b = {
  "id":"人口",
  "crs": "EPSG:3857",
  "isUserData": true,
  "opacity": 1.0,
  "jsonurl": "./layers/demographics/population.json",
  "url": "/storage/data/download/demographics/demographics_2018.csv",
  "zoom":{"min":1, "max":20}
};
var graph_config_r = {
  "id":"世帯",
  "crs": "EPSG:3857",
  "isUserData": true,
  "opacity": 1.0,
  "jsonurl": "./layers/demographics/households.json",
  "url": "/storage/data/download/demographics/demographics_2018.csv",
  "zoom":{"min":1, "max":20}
};
var graph_config_y = {
  "id":"住宅数",
  "crs": "EPSG:3857",
  "isUserData": true,
  "opacity": 1.0,
  "jsonurl": "./layers/demographics/housing.json",
  "url": "/storage/data/download/demographics/demographics_2018.csv",
  "zoom":{"min":1, "max":20}
};

function updateAmedasBargraphLayer(view, currentTime, config){
  if (view.getLayerById(config.id) != undefined){
	  let bargraphLayerConfig = config;
	  bargraphLayerConfig.url = 'https://tb-gis-web.jgn-x.jp/api/t_amedas_data?point_1=' + point_1 + '&point_2=' + point_2 + '&point_3=' + point_3 + '&point_4=' + point_4 + '&currentDate=' + currentTime;

	//  console.log(JSON.stringify(config));
		view.removeLayer(config.id);

	  var bargraphAmedasLayer = CreateBargraphLayer(view, bargraphLayerConfig, 5);
	  view.addLayer(bargraphAmedasLayer).then(menuGlobe.addLayerGUI.bind(menuGlobe));

	  bargraphAmedasLayer.whenReady.then(() => {
	    bargraphAmedasLayer.updateBarGraph();
	  });
  }
}

function updateBargraphLayer(view, currentYear, config, layername, num){
  if (view.getLayerById(config.id) != undefined){

  let selected_yyyy = currentYear;
  if (selected_yyyy >= 2022) {selected_yyyy = 2022;} 
  else if (selected_yyyy < 2022 && selected_yyyy >= 2018) {selected_yyyy = 2018;} 
  else if (selected_yyyy < 2018 && selected_yyyy >= 2013) {selected_yyyy = 2013;} 
  else if (selected_yyyy < 2013 && selected_yyyy >= 2008) {selected_yyyy = 2008;} 
  else if (selected_yyyy < 2008 && selected_yyyy >= 2003) {selected_yyyy = 2003;} 
  else if (selected_yyyy < 2003 ) {selected_yyyy = 1998;}
  else {selected_yyyy = currentYear;}

  let bargraphLayerConfig = config;
  bargraphLayerConfig.url = "/storage/data/download/demographics/demographics_" + selected_yyyy + ".csv";
  console.log(JSON.stringify(config));
  layername.whenReady.then(() => {
    //なにもしない
  });
  if (view.getLayerById(config.id) != undefined){
	view.removeLayer(config.id);
  }
//  view.removeLayer(config.id);

  layername = null;
  layername = CreateBargraphLayer(view, bargraphLayerConfig, num);
  view.addLayer(layername);

  layername.whenReady.then(() => {
    layername.updateBarGraph();
  });
  }
}





/*

//降水
const tmsSource2 = new itowns.TMSSource({
    format: 'image/png',
//    projection: "EPSG:3857",
    crs: "EPSG:3857",
//      url: 'https://amaterass.nict.go.jp/tiles/wni/20200703/2015/${z}_${x}_${y}.png',//降水
      url: 'https://veda02.cr.chiba-u.ac.jp/amaterass/tiles/wni/20200703/2015/${z}_${x}_${y}.png',//降水

    attribution: {
        name: 'wni',//
        url: 'https://amaterass.nict.go.jp/',
    }
});
const colorLayer2 = new itowns.ColorLayer('降水', {
    source: tmsSource2,
});
view.addLayer(colorLayer2).then(menuGlobe.addLayerGUI.bind(menuGlobe));

view.getLayerById('降水').visible = false;
view.getLayerById('降水').opacity = 0.7;
//view.getLayerById('降水').url = 'https://amaterass.nict.go.jp/tiles/amjp/2020/05/21/03/02/${z}/${x}/${y}.png';


//日射
const tmsSource3 = new itowns.TMSSource({
    format: 'image/png',
//    projection: "EPSG:3857",
    crs: "EPSG:3857",
//    url: 'https://amaterass.nict.go.jp/tiles/amjp/2020/05/21/03/02/${z}/${x}/${y}.png',//日射
    url: 'https://amaterass.nict.go.jp/tiles/amjp/2020/08/21/06/25/${z}/${x}/${y}.png',//日射

    attribution: {
        name: 'amjp',//
        url: 'https://veda02.cr.chiba-u.ac.jp/',
    }
});
const colorLayer3 = new itowns.ColorLayer('日射', {
    source: tmsSource3,
});
view.addLayer(colorLayer3).then(menuGlobe.addLayerGUI.bind(menuGlobe));

view.getLayerById('日射').visible = false;
view.getLayerById('日射').opacity = 0.5;



//風向
const tmsSource4 = new itowns.TMSSource({
    format: 'image/png',
//    projection: "EPSG:3857",
    crs: "EPSG:3857",
//    url: 'https://veda02.cr.chiba-u.ac.jp/amaterass_l/tiles/amjp_veda02/wnd/2020/06/18/02/30/9/451/203.png',//風向
    url: 'https://amaterass.nict.go.jp/tiles/tiles/amjp_veda02/wnd/2020/08/21/06/25/${z}/${x}/${y}.png',//風向

    attribution: {
        name: 'amjp',//
        url: 'https://veda02.cr.chiba-u.ac.jp/',
    }
});
const colorLayer4 = new itowns.ColorLayer('風向', {
    source: tmsSource4,
});
view.addLayer(colorLayer4).then(menuGlobe.addLayerGUI.bind(menuGlobe));

view.getLayerById('風向').visible = false;
view.getLayerById('風向').opacity = 0.5;



//温度
const tmsSource5 = new itowns.TMSSource({
    format: 'image/png',
//    projection: "EPSG:3857",
    crs: "EPSG:3857",
//    url: 'https://veda02.cr.chiba-u.ac.jp/amaterass_l/tiles/amjp_veda02/tsfc/2020/12/17/01/50/10/899/406.png',//温度
    url: 'https://amaterass.nict.go.jp/tiles/tiles/amjp_veda02/tsfc/2020/08/21/06/25/${z}/${x}/${y}.png',//温度

    attribution: {
        name: 'amjp',//
        url: 'https://veda02.cr.chiba-u.ac.jp/',
    }
});
const colorLayer5 = new itowns.ColorLayer('温度', {
    source: tmsSource5,
});
view.addLayer(colorLayer5).then(menuGlobe.addLayerGUI.bind(menuGlobe));

view.getLayerById('温度').visible = false;
view.getLayerById('温度').opacity = 0.5;


//湿度
const tmsSource6 = new itowns.TMSSource({
    format: 'image/png',
//    projection: "EPSG:3857",
    crs: "EPSG:3857",
//    url: 'https://veda02.cr.chiba-u.ac.jp/amaterass_l/tiles/amjp_veda02/rh.sfc/2020/12/17/01/50/10/899/406.png',//湿度
    url: 'https://amaterass.nict.go.jp/tiles/tiles/amjp_veda02/rh.sfc/2020/08/21/06/25/${z}/${x}/${y}.png',//湿度

    attribution: {
        name: 'amjp',//
        url: 'https://veda02.cr.chiba-u.ac.jp/',
    }
});
const colorLayer6 = new itowns.ColorLayer('湿度', {
    source: tmsSource6,
});
view.addLayer(colorLayer6).then(menuGlobe.addLayerGUI.bind(menuGlobe));

view.getLayerById('湿度').visible = false;
view.getLayerById('湿度').opacity = 0.5;
*/









/*
const tmsSource4 = new itowns.FileSource({
    url: './test.kml',
    projection: 'EPSG:4326',
    fetcher: itowns.Fetcher.xml,
    parser: itowns.KMLParser.parse,
});
const colorLayer4 = new itowns.ColorLayer('kml', {
    transparent: true,
    source: tmsSource4,
});
view.addLayer(colorLayer4).then(menuGlobe.addLayerGUI.bind(menuGlobe));
*/

// // VectorTilesSourceのstyleにstyle.jsonを渡してSourceを作成
// // 「style.jsonを分ける・zoomプロパティを入れる・レイヤも3つにわける」でとりあえず3つレイヤを表示できる
// let prefSource = new itowns.VectorTilesSource({
//     //  style.jsonの形式で指定
//     style: "./assets/prefectures_boundary_style.json",
//     // style: "./assets/all_boundary_style.json",
//     attribution: {
//         name: 'PREF', url: 'http://www.nict.go.jp/'
//     },
//     zoom: {
//         min: 5,
//         max: 10,
//     }
// });
//
// // ベクターレイヤ作成
// // 第一引数はユニークなIDを指定
// let prefLayer = new itowns.ColorLayer('PREF', {
//     source: prefSource,
//     // isValidDataがTrueなら描画？
//     // sourceのzoom.maxに指定したzoomを超えるとそもそも呼び出されない？
//     // isValidData: (data, extentDestination) => zoomControl(data, extentDestination, 'PREF')
//     // isValidData: isValidData,
// });
//
// // マップにベクターレイヤ追加
// view.addLayer(prefLayer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
//
// // 市町村界のベクターレイヤ作成
// let citySource = new itowns.VectorTilesSource({
//     style: "./assets/city_boundary_style.json",
//     attribution: {
//         name: 'CITY', url: 'http://www.nict.go.jp/'
//     },
//     // zoomlevel13までしかデータは存在しないが、町丁目表示時に市町村界も表示させたいので15を指定
//     zoom: {
//         min: 10,
//         max: 15,
//     }
// });
//
// let cityLayer = new itowns.ColorLayer('CITY', {
//     source: citySource,
//     isValidData: (data, extentDestination) => zoomControl(data, extentDestination, 'CITY')
// });
//
// view.addLayer(cityLayer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
//
// // 町長目のベクターレイヤ作成
// let townSource = new itowns.VectorTilesSource({
//     style: "./assets/town_boundary_style.json",
//     attribution: {
//         name: 'TOWN', url: 'http://www.nict.go.jp/'
//     },
//     zoom: {
//         min: 13,
//         max: 15,
//     }
// });
//
// let townLayer = new itowns.ColorLayer('TOWN', {
//     source: townSource,
//     isValidData: (data, extentDestination) => zoomControl(data, extentDestination, 'TOWN')
// });
//
// view.addLayer(townLayer).then(menuGlobe.addLayerGUI.bind(menuGlobe));

/*
■ DEM
 */

/*
//DEM
//const demUrl = "http://" + window.location.host + "/geoserver/gwc/service/wmts";
const elevationSource = new itowns.WMTSSource({
  // 配信元のベースURL

  url: demUrl,
  // タイルレイヤ名
  name: "geotiff:sample_layer_group",
//  name: "geotest:kiban_5m",
//  projection: "EPSG:4326",
  crs: "EPSG:4326",
  // グリッドセット名
  tileMatrixSet: "iTowns",
  protocol: "wmts",
  // 配信フォーマット
  // image/jpegでも良い
  // GeoServer側で配信フォーマットの種類を決定できる
  format: "image/png",
  // スタイル名
  style: "sample",
  // iTownsからGeoServerにリクエストを送信するズームレベル
  // 指定ズームレベル以上のキャッシュが存在してもリクエストされない
  zoom: { min: 11, max: 11 },
});

const elevationLayer = new itowns.ElevationLayer("DEM", {
  source: elevationSource,
  useColorTextureElevation: true,
  // baseScale = this.colorTextureElevationMaxZ - this.colorTextureElevationMinZ;
  // baseScaleを1に設定
  colorTextureElevationMinZ: 0,
  colorTextureElevationMaxZ: 1,
});

view.addLayer(elevationLayer).then(function _(layer) {
  // 標高値にスケールを適用し標高の詳細表示を行う
  // colorTextureElevationMinZ:0,colorTextureElevationMaxZ:5000と同じ高度表現になるが
  // 動作速度はscaleプロパティに直接代入する場合の方が圧倒的に早い
  layer.scale = 3776;//通常
//  layer.scale = 5000;//デフォルメ
  menuGlobe.addLayerGUI(layer);
});

*/





/* TMSでのBILのテスト用にGeoidのBILを利用してみる */
const elevationSource = new itowns.TMSSource({
  // 配信元のベースURL

  url: '/storage/data/geotiff/dem_japan_bil/${z}/${x}/${y}.bil',
//  url: './example/kyusyu_bil/${z}/${x}/${y}.bil',
  format: "image/x-bil;bits=32",
//  format: "image/png",
  crs: "EPSG:4326",
  zoom: { min: 8, max: 10 },
});
const elevationLayer = new itowns.ElevationLayer("DEM", {
  source: elevationSource,
//  useColorTextureElevation: true,
  // baseScale = this.colorTextureElevationMaxZ - this.colorTextureElevationMinZ;
  // baseScaleを1に設定
//  colorTextureElevationMinZ: 0,
//  colorTextureElevationMaxZ: 1,
});

view.addLayer(elevationLayer).then(function _(layer) {
  // 標高値にスケールを適用し標高の詳細表示を行う
  // colorTextureElevationMinZ:0,colorTextureElevationMaxZ:5000と同じ高度表現になるが
  // 動作速度はscaleプロパティに直接代入する場合の方が圧倒的に早い
  layer.scale = 1;//通常
//  layer.scale = 5000;//デフォルメ
  menuGlobe.addLayerGUI(layer);
});










////DEM
////extentの外はDEMが全て1として扱われ、3Dモデルとしてはextentの外側が常に最高高度となる
//const elevationSource = new itowns.WMSSource({
//    "url": demUrl, //nict
////    url: 'https://cyberjapandata.gsi.go.jp/xyz/dem_png/${z}/${x}/${y}.png',
//    "name": "sample_layer_group", //nict
//    "projection": "EPSG:4326", //WMSのelevationは4326のみに対応
//    "version": "1.1.0",
//    "extent": {
//        "west": 122.9,
//        "east": 154.0,
//        "south": 20.42,
//        "north": 45.58
//    }
//});
//const elevationLayer = new itowns.ElevationLayer('DEM', {
//    "source": elevationSource,
//    "useColorTextureElevation": true,
//    "colorTextureElevationMinZ": 0,
//    "colorTextureElevationMaxZ": 3000
//});
//view.addLayer(elevationLayer).then(menuGlobe.addLayerGUI.bind(menuGlobe));

//debug.createTileDebugUI(menuGlobe.gui, view);

///GLTFテスト
//
////itowns.Coordinates('EPSG:4326', 139.257125, 35.681236, 0)
//var promiseGLTF = ThreeLoader.load('MTL', './fukuoka3/Tile_+000_+000/Tile_+000_+000.mtl').then((gltf) => {
//    // GlobeViewでは擬似太陽の役割として平行光源がデフォルトに設定されている
//    // 光源を明るさ0で打ち消し、環境光を追加してモデルに一様に照明を当てる
//    const antisun = new THREE.DirectionalLight(0xffffff, 0);
//    view.tileLayer.object3d.children[0] = antisun;
//    var model = gltf.scene;
//    var light = new THREE.AmbientLight(0xffffff, 1);
//    model.add(light);
//
//    var gltfId = view.mainLoop.gfxEngine.getUniqueThreejsLayer();
//    // トランスフォームの値を差し引き
//    //var x = -55516.038 + 591.78;
//     var lon = 130.34515890 ;
//    //var y = 65684.76 - 504.615;
//     var lat = 33.56274858 ;
//    //var z = -4.73771;
//     var alt = 16.2;
//    //var coord = new itowns.Coordinates('EPSG:6670', x, y, z).as('EPSG:4326');
//     var coord = new itowns.Coordinates('EPSG:4326', lon, lat, alt);
//    model.position.copy(coord.as(view.referenceCrs));
//    // モデルを座標上に載せる
//    model.lookAt(model.position.clone().add(coord.geodesicNormal));
//
//    model.traverse(function _(obj) {
//        obj.layers.set(gltfId);
//    });
//    view.camera.camera3D.layers.enable(gltfId);
//    model.updateMatrixWorld();
//
//    view.scene.add(model);
//    view.notifyChange();
//});
//



//view.getLayerById('降水').visible = false;
//view.getLayerById('航空写真').visible = false;

view.notifyChange();
// // ズームレベル取得用の関数
// function zoomControl(data, extentDestination, layerId) {
//     console.log(layerId, ":zoom event!!!!!!!");
//     // console.log("data", data);
//     // console.log("extentDestination", extentDestination);
//     // style.jsonの情報
//     let style = data.filter[0];
//     // console.log("style", style);
//     // style.jsonに指定したzoom.max
//     let maxzoom = style.maxzoom;
//     // 元のソース(pbfなど)が持っている最小ズーム？
//     let minzoom = style.minzoom;
//     // 現在のズームレベル
//     let zoom = extentDestination.zoom;
//     globalZoom = zoom;
//     console.log("zoom", zoom);
//     // console.log("minzoom", minzoom);
//     // console.log("maxzoom", maxzoom);
//
//     const layer = view.getLayerById(layerId);
//     // console.log("layer", layer);
//
//     const visible = minzoom <= zoom && zoom <= maxzoom;
//
//     // ズームレベルがstyle.jsonで指定した範囲外の時にレイヤを非表示にする
//     // 各レイヤのmaxを飛び越えて一気にレベルをあげた場合visibleが反応しないことがある
//     if (!visible) {
//         // レイヤの表示状態をfalseに変更
//         // したいけど、falseにしたらレイヤが消えてしまうっぽい？（isValidDataが動かなくなる）
//         layer.opacity = 0;
//         // layer.visible = false;
//         view.notifyChange();
//         // console.log(layerId, "visible: ", visible);
//         console.log(layerId, "opacity: ", layer.opacity);
//         console.log(layerId, "layer: ", layer);
//     } else if (visible) {
//         layer.opacity = 1;
//         // layer.visible = true;
//         view.notifyChange();
//         // console.log(layerId, "visible: ", visible);
//         console.log(layerId, "opacity: ", layer.opacity);
//         console.log(layerId, "layer: ", layer);
//     }
//     return true;
// }


            // Add the UI Debug
            var d = new debug.Debug(view, menuGlobe.gui);
            debug.createTileDebugUI(menuGlobe.gui, view, view.tileLayer, d);
//            debug.create3dTilesDebugUI(menuGlobe.gui, view, $3dTilesLayerDiscreteLOD, d);
//            debug.create3dTilesDebugUI(menuGlobe.gui, view, $3dTilesLayerRequestVolume, d);
//            d.zoom = function() {
//                view.camera.camera3D.position.set(1215013.9, -4736315.5, 4081597.5);
//                view.camera.camera3D.quaternion.set(0.9108514448729665, 0.13456816437801225, 0.1107206134840362, 0.3741416847378546);
//                view.notifyChange(view.camera.camera3D);
//            }
//            menuGlobe.gui.add(d, 'zoom').name('Go to point cloud');




//window.onload = function() {
   // 実行したい処理
   //setTimeout(function(){ alert(document.getElementById("atk").value) }, 8000);
   //alert(document.getElementById("atk").value);
//}

/*
■
*/
window.addEventListener('load', function(){
   setTimeout(function(){ 
		if(document.getElementById("atk").value == ''){
			//Folder = menuGlobe.gui.addFolder("レイヤー追加");
			Folder.__ul.hidden = true;
			document.getElementById("movelink_bottom").hidden = true;
		}else{
			Folder.__ul.hidden = false;
			document.getElementById("movelink_bottom").hidden = false;
		}
		//alert(document.getElementById("atk").value);
	 }, 1000);
   //alert(document.getElementById("atk").value);
});

/*
■スライダー連動ボタンクリック
*/

document.getElementById("button").onclick = function() {

LincButtononclick(this.value);

	//var plam = view.
	//url.searchParams.set("xy", formatDate($current_p, 'YYYYMMDDhhmm'));

	//URL書き換え
	//history.replaceState('','',url.pathname + url.search);

//itowns.Coordinates('EPSG:4326', 138.0977637, 36.5360014, 0)//稲荷山公園
//itowns.Coordinates('EPSG:4326', 138.1414092, 36.5246307, 0)//森将軍塚古墳
//itowns.Coordinates('EPSG:4326', 138.0923764, 36.5043649, 0)//碑姨捨公園
//itowns.Coordinates('EPSG:4326', 138.13772, 36.4791626, 0)//千曲市城山史跡公園

/*
    pathTravel.push({ coord: new itowns.Coordinates('EPSG:4326', 138.1414092, 36.5246307), range: 100000, time: time * 0.2 });
    pathTravel.push({ range: 13932, time: time * 0.2, tilt: 7.59, heading: -110.9 });
//    pathTravel.push({ tilt: 8, time: time * 0.2 });
//    pathTravel.push({ range: 70000, time: time * 0.2, tilt: 5, heading: -90 });
//    pathTravel.push({ coord: new itowns.Coordinates('EPSG:4326', 138.0923764, 36.5043649), tilt: 11.5, heading: -127.211, time: time });
//    pathTravel.push({ range: 10414, time: time * 0.2 });
//    pathTravel.push({ tilt: 8, time: time * 0.2 });
//    pathTravel.push({ range: 60000, heading: 40, time: time * 0.2 });
//    pathTravel.push({ coord: new itowns.Coordinates('EPSG:4326', 138.13772, 36.4791626), tilt: 15.92, heading: -13.18, time: time });
//    pathTravel.push({ range: 16601, time: time * 0.2 });

//    function addLayerCb(layer) {
//        return view.addLayer(layer);
//    }

    function travel() {
        var camera = view.camera.camera3D;
        return itowns.CameraUtils
            .sequenceAnimationsToLookAtTarget(view, camera, pathTravel);
    }

    // Listen for globe full initialisation event
    view.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, function init() {
        // eslint-disable-next-line no-console
        console.info('Globe initialized');
        Promise.all(promises).then(function _() {
            // let's go
            travel().then(travel);
        }).catch(console.error);
    });
*/

};

document.getElementById("button2").onclick = function() {LincButtononclick(this.value);};
document.getElementById("button3").onclick = function() {LincButtononclick(this.value);};
document.getElementById("button4").onclick = function() {LincButtononclick(this.value);};
document.getElementById("button5").onclick = function() {LincButtononclick(this.value);};

function LincButtononclick( type_str) {
	var view = menuGlobe.view;//itowns.GlobeView(viewerDiv, positionOnGlobe, {});

    var time = 50000;
	var promises = [];
    var pathTravel = [];
	//    const atmosphere = view.getLayerById('atmosphere');
	//    atmosphere.setRealisticOn(true);

	//var positionOnGlobe = new itowns.Coordinates('EPSG:4326', 139.745556, 35.658581, 1500);//東京タワー
	//var positionOnGlobe = new itowns.Coordinates('EPSG:4326', 140.098, 36.225, 868);//筑波山 36.2259586,140.09800
	//var positionOnGlobe = new itowns.Coordinates('EPSG:4326', 138.1414092, 36.5246307, 0);//森将軍塚古墳
	//var positionOnGlobe = new itowns.Coordinates('EPSG:4326', 138.0923764, 36.5043649, 0);//碑姨捨公園
	//var positionOnGlobe = new itowns.Coordinates('EPSG:4326', 138.13772, 36.4791626, 0);//千曲市城山史跡公園

	switch (type_str){
	  case '東京':
		var positionOnGlobe = new itowns.Coordinates('EPSG:4326', 139.745556, 35.658581, 868);//東京タワー
	    break;
	  case '森将軍塚古墳':
		var positionOnGlobe = new itowns.Coordinates('EPSG:4326', 138.1414092, 36.5246307, 0);//森将軍塚古墳
	    break;
	  case '千曲市城山史跡公園':
		var positionOnGlobe = new itowns.Coordinates('EPSG:4326', 138.13772, 36.4791626, 0);//千曲市城山史跡公園
	    break;
	  case '碑姨捨公園':
		var positionOnGlobe = new itowns.Coordinates('EPSG:4326', 138.0923764, 36.5043649, 0);//碑姨捨公園
	    break;
	  case '福岡':
		var positionOnGlobe = new itowns.Coordinates('EPSG:4326', 130.403767, 33.589206, 0)//福岡
		var positionOnGlobe = new itowns.Coordinates('EPSG:4326', 130.359108, 33.582967, 0)//福岡
		//var positionOnGlobe = new itowns.Coordinates('EPSG:4326', 139.745556, 35.658581, 1500);//東京タワー
	    break;
	  default:
	}

	//カメラ位置・角度設定
	var camera_v = view.camera.camera3D;
	var options = {
	    coord: positionOnGlobe, //lon,lat,altのObjectではなくitowns.Coordinate型
	    tilt: 25, //地球表面とカメラのなす角 デフォルトは垂直で90
	    heading: 40,//-0.000022280057123680308, //回転
	    range: 25000.00000001701, //カメラと地球の距離
	//  range: 20000.00000001701 //カメラと地球の距離
	    time: 4500, //アニメーションの長さ（ミリ秒）
	//    easing:0, //インとアウトのイージングアニメーション
	    stopPlaceOnGroundAtEnd:0 //アニメーション終了時にターゲットを地面に配置するのを停止
	};

	//itowns.CameraUtils.transformCameraToLookAtTarget(view, camera_v, options);//すぐ移動
	itowns.CameraUtils.animateCameraToLookAtTarget(view, camera_v, options);//アニメーション移動

}



/*
■GLTFテスト 3D OBJ */
document.getElementById("button_GLTF").onclick = function() {Buttononclick_GLTF(this.value);};

function Buttononclick_GLTF( type_str) {




	var promiseGLTF = ThreeLoader.load('GLTF', '/storage/data/glb/Tile_+000_+003.glb').then((gltf) => {
	    // GlobeViewでは擬似太陽の役割として平行光源がデフォルトに設定されている
	    // 光源を明るさ0で打ち消し、環境光を追加してモデルに一様に照明を当てる
	    const antisun = new THREE.DirectionalLight(0xffffff, 0);
	    view.tileLayer.object3d.children[0] = antisun;
	    var model = gltf.scene;
	    var light = new THREE.AmbientLight(0xffffff, 1);
	    model.add(light);

	    var gltfId = view.mainLoop.gfxEngine.getUniqueThreejsLayer();
	    // トランスフォームの値を差し引き
	    var x = -55516.038 + 591.78;
	    // var lon = 130.403767;
	    var y = 65684.76 - 539.615;
	    // var lat = 33.589206;
	    var z = -4.73771;
	    // var alt = 16.2;
	    var coord = new itowns.Coordinates('EPSG:6670', x, y, z).as('EPSG:4326');
	    // var coord = new itowns.Coordinates('EPSG:4326', lon, lat, alt);
	    model.position.copy(coord.as(view.referenceCrs));
	    // モデルを座標上に載せる
	    model.lookAt(model.position.clone().add(coord.geodesicNormal));

	    model.traverse(function _(obj) {
	        obj.layers.set(gltfId);
	    });
	    view.camera.camera3D.layers.enable(gltfId);
	    model.updateMatrixWorld();

	    view.scene.add(model);
	    view.notifyChange();
	});
	//  menuGlobe.addLayerGUI(promiseGLTF);
	//  menuGlobe.addLayerGUI.bind(promiseGLTF);




	var positionOnGlobe = new itowns.Coordinates('EPSG:4326' ,130.3487328,33.5891281, 0)//福岡

	//カメラ位置・角度設定
	var camera_v = view.camera.camera3D;
	var options = {
	    coord: positionOnGlobe, //lon,lat,altのObjectではなくitowns.Coordinate型
	    tilt: 20, //地球表面とカメラのなす角 デフォルトは垂直で90
	    heading: -90,//-0.000022280057123680308, //回転
	    range: 1000.00000001701, //カメラと地球の距離
	//  range: 20000.00000001701 //カメラと地球の距離
	    time: 4500, //アニメーションの長さ（ミリ秒）
	//    easing:0, //インとアウトのイージングアニメーション
	    stopPlaceOnGroundAtEnd:0 //アニメーション終了時にターゲットを地面に配置するのを停止
	};

	itowns.CameraUtils.transformCameraToLookAtTarget(view, camera_v, options);//すぐ移動
	//itowns.CameraUtils.animateCameraToLookAtTarget(view, camera_v, options);//アニメーション移動


}

//var promiseGLTF = ThreeLoader.load('GLTF', '../glb/Tile_+000_+001.glb').then((gltf) => {    const antisun = new THREE.DirectionalLight(0xffffff, 0);    view.tileLayer.object3d.children[0] = antisun;    var model = gltf.scene;    var light = new THREE.AmbientLight(0xffffff, 1);    model.add(light);    var gltfId = view.mainLoop.gfxEngine.getUniqueThreejsLayer();    var x = -55516.038 + 591.78;    var y = 65684.76 - 539.615;    var z = -4.73771;    var coord = new itowns.Coordinates('EPSG:6670', x, y, z).as('EPSG:4326');    model.position.copy(coord.as(view.referenceCrs));    model.lookAt(model.position.clone().add(coord.geodesicNormal));    model.traverse(function _(obj) {        obj.layers.set(gltfId);    });    view.camera.camera3D.layers.enable(gltfId);    model.updateMatrixWorld();    view.scene.add(model);    view.notifyChange();});

//var promiseGLTF = ThreeLoader.load('GLTF', '../glb/Tile_+000_+001.glb').then((gltf) => {    const antisun = new THREE.DirectionalLight(0xffffff, 0);    view.tileLayer.object3d.children[0] = antisun;    var model = gltf.scene;    var light = new THREE.AmbientLight(0xffffff, 1);    model.add(light);    var gltfId = view.mainLoop.gfxEngine.getUniqueThreejsLayer();    var x = -55516.038 + 591.78;    var y = 65684.76 - 539.615;    var z = -4.73771;    var coord = new itowns.Coordinates('EPSG:6670', x, y, z).as('EPSG:4326');    model.position.copy(coord.as(view.referenceCrs));    model.lookAt(model.position.clone().add(coord.geodesicNormal));    model.traverse(function _(obj) {        obj.layers.set(gltfId);    });    view.camera.camera3D.layers.enable(gltfId);    model.updateMatrixWorld();    view.scene.add(model);    view.notifyChange();});


/*
■ ひまわり雲データ */

document.getElementById("button0").onclick = function() {LincButtononclickT(this.value);};

function LincButtononclickT( type_str) {
	//var view = menuGlobe.view;//itowns.GlobeView(viewerDiv, positionOnGlobe, {});



	var positionOnGlobe = new itowns.Coordinates('EPSG:4326', 138.0923764, 36.5043649, 0);//碑姨捨公園

	//カメラ位置・角度設定
	var camera_v = view.camera.camera3D;
	var options = {
	    coord: positionOnGlobe, //lon,lat,altのObjectではなくitowns.Coordinate型
	    tilt: 30, //地球表面とカメラのなす角 デフォルトは垂直で90
	    heading: -0.000022280057123680308, //回転
	    range: 700000.00000001701, //カメラと地球の距離
	    time: 4500, //アニメーションの長さ（ミリ秒）
	    stopPlaceOnGroundAtEnd:0 //アニメーション終了時にターゲットを地面に配置するのを停止
	};

	//itowns.CameraUtils.transformCameraToLookAtTarget(view, camera_v, options);//すぐ移動
	itowns.CameraUtils.animateCameraToLookAtTarget(view, camera_v, options);//アニメーション移動



		if (view.getLayerById('ひまわり雲データ') == null) {
			//var debugGui = new dat.GUI();
            // Configure Point Cloud layer
            var potreeLayer = new itowns.PotreeLayer('ひまわり雲データ', {
                source: new itowns.PotreeSource({
                    file: 'cloud.js',
                    url: '/storage/data/pointcloud/amaterass_color/',
                    type: 'string',
                    crs: view.referenceCrs,
                }),
            });

            // add potreeLayer to scene
            function onLayerReady() {
                debug.PotreeDebug.initTools(view, potreeLayer, menuGlobe.gui);
                //debug.PotreeDebug.initTools(view, potreeLayer, debugGui);

                // update stats window
                var info = document.getElementById('menuDiv');
                view.addFrameRequester(itowns.MAIN_LOOP_EVENTS.AFTER_RENDER, () => {
                    info.textContent = potreeLayer.displayedCount.toLocaleString() + ' points';
                });
            }
            //window.view = view;

            itowns.View.prototype.addLayer.call(view, potreeLayer).then(onLayerReady);
			//view.addLayer(potreeLayer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
			//view.getLayerById('ひまわり雲データ').visible = false;
			//view.getLayerById('ひまわり雲データ').opacity = 0.5;
//		}else{
//			if (view.getLayerById('ひまわり雲データ').visible == false) {
//				view.getLayerById('ひまわり雲データ').visible = true;
//			}else{
//				view.getLayerById('ひまわり雲データ').visible = false;
//			}
		}

}



document.getElementById("button_movie").onclick = function() {save_movie();};
document.getElementById("button_photo").onclick = function() {save_image();};

/*
■ 画像キャプチャ */
function save_image() 
{
   var renderer = view.mainLoop.gfxEngine.renderer;
   renderer.clear();
   renderer.render(view.scene, view.camera.camera3D);
   var data = renderer.domElement.toDataURL ('image/jpeg', 1.0);
   saveAs(dataURItoBlob(data), 'itowns.jpg');
}


/* 動画キャプチャ */
function save_movie() 
{
   /* check browser */
   if (window.MediaRecorder == undefined) {
      alert("Cannot support MediaRecorder in this browser.");
      recordFlag = false;
      $(".param_save_movie").attr("value", "start capture");
      return;
   }

   var renderer = view.mainLoop.gfxEngine.renderer;
   var stream = renderer.domElement.captureStream();
   var chunks = [];

   if (!recordFlag) {
      var options = {};

      if (MediaRecorder.isTypeSupported("video/webm\;codecs=vp9")) {
         options = {
            mimeType : 'video/webm; codecs=vp9'
         };
      }
      else if (MediaRecorder.isTypeSupported("video/webm\;codecs=vp8")) {
         options = {
            mimeType : 'video/webm; codecs=vp8'
         };
      }
      else if (MediaRecorder.isTypeSupported("video/webm")) {
         options = {
            mimeType : 'video/webm'
         };
      }
      else {
         alert("Cannot support video/webm in this browser.");
         recordFlag = false;
         $(".param_save_movie").attr("value", "start capture");
         return;
      }

      recorder = new MediaRecorder(stream, options);
      recorder.ondataavailable = function(e) {
         chunks.push(e.data);
      }
      recorder.onstop = function(e) {
         //let blob = new Blob(chunks, {type: "video/mp4"});
         //saveAs(blob, 'itowns.mp4');
         let blob = new Blob(chunks, {type: "video/webm"});
         saveAs(blob, 'itowns.webm');
      }
      recorder.start();
      recordFlag = true;
   }
   else  {
      recorder.stop();
      recordFlag = false;
   }
}


/* Capture */
function dataURItoBlob(dataURI) 
{
   var byteString = atob(dataURI.split(',')[1]);
   // separate out the mime component
   var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
   // write the bytes of the string to an ArrayBuffer
   var ab = new ArrayBuffer(byteString.length);
   // create a view into the buffer
   var ia = new Uint8Array(ab);
   // set the bytes of the buffer to the correct values
   for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
   }
   // write the ArrayBuffer to a blob, and youre done
   var blob = new Blob([ab], {type: mimeString});
   return blob;
}

/*
■移動テスト
・ここから

// Instanciate iTowns GlobeView* 移動テスト
    //var view = new itowns.GlobeView(viewerDiv, placement);
    var time = 50000;
	var promises = [];
    var pathTravel = [];
    const atmosphere = view.getLayerById('atmosphere');
    atmosphere.setRealisticOn(true);


//itowns.Coordinates('EPSG:4326', 138.0977637, 36.5360014, 0)//稲荷山公園
//itowns.Coordinates('EPSG:4326', 138.1414092, 36.5246307, 0)//森将軍塚古墳
//itowns.Coordinates('EPSG:4326', 138.0923764, 36.5043649, 0)//碑姨捨公園
//itowns.Coordinates('EPSG:4326', 138.13772, 36.4791626, 0)//千曲市城山史跡公園


    pathTravel.push({ coord: new itowns.Coordinates('EPSG:4326', 138.1414092, 36.5246307), range: 100000, time: time * 0.2 });
    pathTravel.push({ range: 13932, time: time * 0.2, tilt: 7.59, heading: -110.9 });
//    pathTravel.push({ tilt: 8, time: time * 0.2 });
//    pathTravel.push({ range: 70000, time: time * 0.2, tilt: 5, heading: -90 });
//    pathTravel.push({ coord: new itowns.Coordinates('EPSG:4326', 138.0923764, 36.5043649), tilt: 11.5, heading: -127.211, time: time });
//    pathTravel.push({ range: 10414, time: time * 0.2 });
//    pathTravel.push({ tilt: 8, time: time * 0.2 });
//    pathTravel.push({ range: 60000, heading: 40, time: time * 0.2 });
//    pathTravel.push({ coord: new itowns.Coordinates('EPSG:4326', 138.13772, 36.4791626), tilt: 15.92, heading: -13.18, time: time });
//    pathTravel.push({ range: 16601, time: time * 0.2 });

//    function addLayerCb(layer) {
//        return view.addLayer(layer);
//    }

    function travel() {
        var camera = view.camera.camera3D;
        return itowns.CameraUtils
            .sequenceAnimationsToLookAtTarget(view, camera, pathTravel);
    }

    // Listen for globe full initialisation event
    view.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, function init() {
        // eslint-disable-next-line no-console
        console.info('Globe initialized');
        Promise.all(promises).then(function _() {
            // let's go
            travel().then(travel);
        }).catch(console.error);
    });

・ここまで
*/

      $('#camera_vfov_slider').slider();
      $('#camera_tilt_slider').slider(); /* Tilt スライダは反転させているので */
      $('#camera_pan_slider').slider();
      $('#opacity_slider').slider();

      $('#camera_vfov_slider').slider("value", 30);
      $('#camera_tilt_slider').slider("value", -25); /* Tilt スライダは反転させているので */
      $('#camera_pan_slider').slider("value", 0);
      $('#opacity_slider').slider("value", 0.5);



/*
■スライダー連動
*/

function ViewChg( dtm ,mnt,dtm_j ,mnt_j) {

      readGeoJSON();
      //var view = new itowns.View();
      try {
          //console.log(colorLayer2);
          //var positionOnGlobe = new itowns.Coordinates('EPSG:4326', 139.257125, 35.681236, 0)

          //let disp = document.getElementById('viewerDiv');
          var view = menuGlobe.view;//itowns.GlobeView(viewerDiv, positionOnGlobe, {});

	if(view.getLayerById('降水 【時系列】') != undefined) {

		var vis = view.getLayerById('降水 【時系列】').visible;
		var opa = view.getLayerById('降水 【時系列】').opacity;
		// 削除せずに更新したい
		//https://github.com/iTowns/itowns/issues/1599
		//https://github.com/iTowns/itowns/issues/1082
//		if (view.getLayerById('降水').visible) {
			//view.removeLayer(view.getLayerById('降水').id);

			view.removeLayer('降水 【時系列】');//削除せず更新したい
			menuGlobe.removeLayersGUI('降水 【時系列】');//削除せず更新したい
			const tmsSource2 = new itowns.TMSSource({
			    format: 'image/png',
			    crs: "EPSG:3857",
			    url: '/api/weather_wni/wni/'+ dtm +'/'+ mnt +'/${z}/${x}/${y}.png',//降水
				zoom: {
					min: 1,
					max: 9,
				},

			    attribution: {
			        name: 'wni',//
			        url: 'https://amaterass.nict.go.jp/',
			    }
			});
			const colorLayer2 = new itowns.ColorLayer('降水 【時系列】', {
			    source: tmsSource2,
			});
			view.addLayer(colorLayer2).then(menuGlobe.addLayerGUI.bind(menuGlobe));
			view.getLayerById('降水 【時系列】').visible = vis;
			view.getLayerById('降水 【時系列】').opacity = opa;

	}
	if(view.getLayerById('日射 【時系列】') != undefined) {

		var vis = view.getLayerById('日射 【時系列】').visible;
		var opa = view.getLayerById('日射 【時系列】').opacity;
//		if (view.getLayerById('日射').visible) {
		
			view.removeLayer('日射 【時系列】');//削除せず更新したい
			menuGlobe.removeLayersGUI('日射 【時系列】');//削除せず更新したい

			const tmsSource3 = new itowns.TMSSource({
			    format: 'image/png',
//			    projection: "EPSG:3857",
			    crs: "EPSG:3857",
				url: '/api/weather/amjp/' + dtm.substr(0,4)+'/'+dtm.substr(4, 2)+'/'+dtm.substr(6,2)+'/'+mnt.substr(0,2)+'/'+mnt.substr(2,2)+'/${z}/${x}/${y}.png',//日射
				zoom: {
					min: 1,
					max: 10,
				},
			    attribution: {
			        name: 'wni',//
			        url: 'https://amaterass.nict.go.jp/',
			    }
			});
			const colorLayer3 = new itowns.ColorLayer('日射 【時系列】', {
			    source: tmsSource3,
			});
			view.addLayer(colorLayer3).then(menuGlobe.addLayerGUI.bind(menuGlobe));
			view.getLayerById('日射 【時系列】').visible = vis;
			view.getLayerById('日射 【時系列】').opacity = opa;

	}
	if(view.getLayerById('風向 【時系列】') != undefined) {



		var vis = view.getLayerById('風向 【時系列】').visible;
		var opa = view.getLayerById('風向 【時系列】').opacity;
//		if (view.getLayerById('日射').visible) {
		
			view.removeLayer('風向 【時系列】');//削除せず更新したい
			menuGlobe.removeLayersGUI('風向 【時系列】');//削除せず更新したい

			const tmsSource4 = new itowns.TMSSource({
			    format: 'image/png',
//			    projection: "EPSG:3857",
			    crs: "EPSG:3857",
				url: '/api/weather_amjp_veda02_sshfs/wnd/' + dtm.substr(0,4)+'/'+dtm.substr(4, 2)+'/'+dtm.substr(6,2)+'/'+mnt.substr(0,2)+'/'+mnt.substr(2,2)+'/${z}/${x}/${y}.png',//日射
				zoom: {
					min: 1,
					max: 10,
				},
			    attribution: {
			        name: 'wni',//
			        url: 'https://amaterass.nict.go.jp/',
			    }
			});
			const colorLayer4 = new itowns.ColorLayer('風向 【時系列】', {
			    source: tmsSource4,
			});
			view.addLayer(colorLayer4).then(menuGlobe.addLayerGUI.bind(menuGlobe));
			view.getLayerById('風向 【時系列】').visible = vis;
			view.getLayerById('風向 【時系列】').opacity = opa;

	}
	if(view.getLayerById('温度 【時系列】') != undefined) {

		//温度
		var vis = view.getLayerById('温度 【時系列】').visible;
		var opa = view.getLayerById('温度 【時系列】').opacity;
//		if (view.getLayerById('日射').visible) {
		
			view.removeLayer('温度 【時系列】');//削除せず更新したい
			menuGlobe.removeLayersGUI('温度 【時系列】');//削除せず更新したい

			const tmsSource5 = new itowns.TMSSource({
			    format: 'image/png',
//			    projection: "EPSG:3857",
			    crs: "EPSG:3857",
				url: '/api/weather_amjp_veda02_sshfs/tsfc/' + dtm.substr(0,4)+'/'+dtm.substr(4, 2)+'/'+dtm.substr(6,2)+'/'+mnt.substr(0,2)+'/'+mnt.substr(2,2)+'/${z}/${x}/${y}.png',//日射
				zoom: {
					min: 1,
					max: 10,
				},
			    attribution: {
			        name: 'tsfc',//
			        url: 'https://amaterass.nict.go.jp/',
			    }
			});
			const colorLayer5 = new itowns.ColorLayer('温度 【時系列】', {
			    source: tmsSource5,
			});
			view.addLayer(colorLayer5).then(menuGlobe.addLayerGUI.bind(menuGlobe));
			view.getLayerById('温度 【時系列】').visible = vis;
			view.getLayerById('温度 【時系列】').opacity = opa;

	}
	if(view.getLayerById('湿度 【時系列】') != undefined) {


		//湿度
		var vis = view.getLayerById('湿度 【時系列】').visible;
		var opa = view.getLayerById('湿度 【時系列】').opacity;
//		if (view.getLayerById('日射').visible) {
		
			view.removeLayer('湿度 【時系列】');//削除せず更新したい
			menuGlobe.removeLayersGUI('湿度 【時系列】');//削除せず更新したい

			const tmsSource6 = new itowns.TMSSource({
			    format: 'image/png',
//			    projection: "EPSG:3857",
			    crs: "EPSG:3857",
				url: '/api/weather_amjp_veda02_sshfs/tsfc/' + dtm.substr(0,4)+'/'+dtm.substr(4, 2)+'/'+dtm.substr(6,2)+'/'+mnt.substr(0,2)+'/'+mnt.substr(2,2)+'/${z}/${x}/${y}.png',//日射
				zoom: {
					min: 1,
					max: 10,
				},
			    attribution: {
			        name: 'rh.sfc',//
			        url: 'https://amaterass.nict.go.jp/',
			    }
			});
			const colorLayer6 = new itowns.ColorLayer('湿度 【時系列】', {
			    source: tmsSource6,
			});
			view.addLayer(colorLayer6).then(menuGlobe.addLayerGUI.bind(menuGlobe));
			view.getLayerById('湿度 【時系列】').visible = vis;
			view.getLayerById('湿度 【時系列】').opacity = opa;

//		}

	}


	if(view.getLayerById('ひまわり 【時系列】') != undefined) {


		//湿度
		var vis = view.getLayerById('ひまわり 【時系列】').visible;
		var opa = view.getLayerById('ひまわり 【時系列】').opacity;
//		if (view.getLayerById('日射').visible) {
		
			view.removeLayer('ひまわり 【時系列】');//削除せず更新したい
			menuGlobe.removeLayersGUI('ひまわり 【時系列】');//削除せず更新したい

			const tmsSource6 = new itowns.TMSSource({
			    format: 'image/png',
//			    projection: "EPSG:3857",
			    crs: "EPSG:3857",
				url: '/api/weather/h8jp/' + dtm.substr(0,4)+'/'+dtm.substr(4, 2)+'/'+dtm.substr(6,2)+'/'+mnt.substr(0,2)+'/'+mnt.substr(2,2)+'/${z}/${x}/${y}.png',//日射
				zoom: {
					min: 1,
					max: 10,
				},
			    attribution: {
			        name: 'rh.sfc',//
			        url: 'https://amaterass.nict.go.jp/',
			    }
			});
			const colorLayer6 = new itowns.ColorLayer('ひまわり 【時系列】', {
			    source: tmsSource6,
			});
			view.addLayer(colorLayer6).then(menuGlobe.addLayerGUI.bind(menuGlobe));
			view.getLayerById('ひまわり 【時系列】').visible = vis;
			view.getLayerById('ひまわり 【時系列】').opacity = opa;

//		}

	}


	if(view.getLayerById('面群データ') != undefined) {

//console.log(dtm+'-'+mnt);
//console.log('./data/' + dtm.substr(0,4)+dtm.substr(4, 2)+dtm.substr(6,2)+mnt.substr(0,2) + '00.json');
		var vis = view.getLayerById('面群データ').visible;
		var opa = view.getLayerById('面群データ').opacity;
			view.removeLayer('面群データ');//削除せず更新したい
			menuGlobe.removeLayersGUI('面群データ');//削除せず更新したい
			view.tileLayer.attachedLayers = view.tileLayer.attachedLayers.filter(attached => attached.id != '面群データ');

			const sourceFromParsedData = new itowns.FileSource({
//			    format: 'image/png',
			    format: 'application/json',
			    crs: "EPSG:4326",
				url: './data/' + dtm_j.substr(0,4)+dtm_j.substr(4, 2)+dtm_j.substr(6,2)+mnt_j.substr(0,2) + '00.json',
//				zoom: {
//					min: 1,
//					max: 10,
//				},
			    attribution: {
//			        name: 'wni',//
//			        url: 'https://amaterass.nict.go.jp/',
			    }
			});
			const menColorLayer = new itowns.ColorLayer('面群データ', {
			    source: sourceFromParsedData,
			});
			view.addLayer(menColorLayer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
			view.getLayerById('面群データ').visible = vis;
			view.getLayerById('面群データ').opacity = opa;

	}



      } catch( e ) {
			console.log("err");

        //例外エラーが起きた時に実行する処理
      }
//debug.createTileDebugUI(menuGlobe.gui, view);

};



// 360Sphere
//function updateScaleWidget() {
//    var value = view.getPixelsToMeters(200);
//    value = Math.floor(value);
//    var digit = Math.pow(10, value.toString().length - 1);
//    value = Math.round(value / digit) * digit;
//    var pix = view.getMetersToPixels(value);
//    var unit = 'm';
//    if (value >= 1000) {
//        value /= 1000;
//        unit = 'km';
//    }
//    divScaleWidget.innerHTML = `${value} ${unit}`;
//    divScaleWidget.style.width = `${pix}px`;
//}
//
//// Listen for globe full initialisation event
//view.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, function () {
//    // eslint-disable-next-line no-console
//    console.info('Globe initialized');
//    updateScaleWidget();
//});
//view.controls.addEventListener(itowns.CONTROL_EVENTS.RANGE_CHANGED, () => {
//    updateScaleWidget();
//});
//
//
//window.addEventListener('resize', updateScaleWidget);
////debug.createTileDebugUI(menuGlobe.gui, view);
//
//$("#button_360_capture").on("click", function() {
//	const atmosphere = view.getLayerById('atmosphere');
//	atmosphere.setRealisticOn(!view.isDebugMode);
//
//	const cRL = menuGlobe.addGUI('RealisticLighting', !view.isDebugMode, function (v) {
//	    atmosphere.setRealisticOn(v);
//	    view.notifyChange(atmosphere);
//	});
//	window.addEventListener('DOMContentLoaded', function _(e) { 
//	  /* カメラ初期値の角度を設定する */
//	  set_camera_tilt_reset();
//	  //スフィアマップ作製クラス定義
//	  let createSphereMapInstance = new CreateSphereMap(view, menuGlobe);
//	  // 360Sphereの非表示
//	  $('#createSphereMapDom').toggleClass("display_none");
//
//	}, false);
//});
//

//window.onload=function(){
//};


var wgapp = {};
wgapp.center = {};
wgapp.center.lat = 36.4797055;
wgapp.center.lng = 138.1358457;

wgapp.north      = 0;
wgapp.east       = 0;
wgapp.south      = 0;
wgapp.west       = 0;

wgapp.zoom       = 0;
wgapp.direction  = 0;
wgapp.pitch      = 13;

// STARScontroller_updateDate
function STARScontroller_updateDate(pDate){
  updateDate(pDate);
}

// controller.js isReady()
window.STARScontroller_isReady = function() {
  if(!viewerDiv || viewerDiv == undefined) {
    return false;
  } else {
    return true;
  }
};

// controller.js getPosition()
window.STARScontroller_getPosition = function() {
  var p = itowns.CameraUtils.getTransformCameraLookingAtTarget(view, view.camera.camera3D);
  console.log(p);
  var objResult = {center:{lat:0, lng:0}};

  if (p) {

    objResult.center.lat = p.coord.y;
    objResult.center.lng = p.coord.x;

    objResult.north      = wgapp.north;
    objResult.east       = wgapp.east;
    objResult.south      = wgapp.south;
    objResult.west       = wgapp.west;
    objResult.zoom       = p.range;
    objResult.direction  = p.heading;
    objResult.pitch      = p.tilt; // Math.min(90 - p.tilt, 60);
    console.log(objResult);
    return objResult;
  } else {
    return null;
  }
};

// controller.js setPosition()
window.STARScontroller_setPosition = function(pPosition) {
  console.log("STARScontroller_getPosition::pPosition=" + pPosition);
  wgapp = JSON.parse(JSON.stringify(pPosition));

  var positionOnGlobe = new itowns.Coordinates('EPSG:4326', pPosition.center.lng, pPosition.center.lat);

  //カメラ位置・角度設定
  var options = {
    coord: positionOnGlobe, //lon,lat,altのObjectではなくitowns.Coordinate型
    //tilt: pPosition.pitch, //地球表面とカメラのなす角 デフォルトは垂直で90
    tilt: pPosition.pitch, // 90 - pPosition.pitch, //地球表面とカメラのなす角 デフォルトは垂直で90
    heading: pPosition.direction, //回転
    range: pPosition.zoom,
    time: 0, //アニメーションの長さ（ミリ秒）
    stopPlaceOnGroundAtEnd:0 //アニメーション終了時にターゲットを地面に配置するのを停止
  };

  itowns.CameraUtils.transformCameraToLookAtTarget(view, view.camera.camera3D, options);//すぐ移動
};


// STARScontroller.js STARScontroller_getDate()
window.STARScontroller_getDate = function() {
  var objOptions = $("#timeline").k2goTimeline("getOptions");
  var objTimeInfo = {};
  
  objTimeInfo.currentDate = objOptions.currentTime;
  objTimeInfo.startDate   = objOptions.startTime;
  objTimeInfo.endDate     = objOptions.endTime;
  
  return objTimeInfo;
};

// STARScontroller.js STARScontroller_setDate()
window.STARScontroller_setDate = function(pDate) {
  if ($Env.starting == true)
  {
    if ($("#current_time").hasClass("timeNowPlay")) {$("#current_time").trigger("click")}
    else                                            {$("#button_stop" ).trigger("click")} 
  }
  else
  {  
    var objTimeInfo = {};
    
    objTimeInfo.minTime     = new Date($Env.minTime     .getTime());
    objTimeInfo.maxTime     = new Date($Env.maxTime     .getTime());
    objTimeInfo.startTime   = new Date($Env.minTime     .getTime() > pDate.startDate.getTime() ? $Env.minTime.getTime() : pDate.startDate.getTime());
    objTimeInfo.endTime     = new Date($Env.maxTime     .getTime() < pDate.endDate  .getTime() ? $pEnv.maxTime.getTime() : pDate.endDate  .getTime());
    objTimeInfo.currentTime = new Date(pDate.currentDate.getTime());
    
    if (objTimeInfo.currentTime.getTime() < objTimeInfo.startTime.getTime()) objTimeInfo.currentTime.setTime(objTimeInfo.startTime.getTime());
    if (objTimeInfo.currentTime.getTime() > objTimeInfo.endTime  .getTime()) objTimeInfo.currentTime.setTime(objTimeInfo.endTime  .getTime());
    
    $Env.creating = true;
    $("#lockWindow").addClass("show");
    
    $("#timeline").k2goTimeline("create", {
      timeInfo :
      {
        minTime     : objTimeInfo.minTime,
        maxTime     : objTimeInfo.maxTime,
        startTime   : objTimeInfo.startTime,
        endTime     : objTimeInfo.endTime,
        currentTime : objTimeInfo.currentTime
      },
      callback : function(pTimeInfo)
      {
        adjustRangeBar();
        $Env.creating = false;
        $("#lockWindow").removeClass("show");
      }
    });
  }
};






/* Set iTowns Camera from IP Camera */
function set_camera() 
{
   console.log("----------- set_camera ---------");

   /* tilt が上向きの場合に iTowns のカメラをあわせると、*/
   /* マウス操作できなくなる */
   if (!demoMode) {
      //if (ipCamera.getCameraTilt() >= 0)
      var msg = "[set camera] を実行した後は、iTowns の視点は ip カメラ位置に固定されます。\n" + 
                "元の任意のマウス操作はできなくなりますが、よろしいですか？\n" + 
                "（デモモードと同じマウス操作となります。）\n";
      var result = window.confirm(msg);
      if(!result) return;
      /* マウスイベントを固定 */
      view.controls.dispose();
      setMouseEvent();
      demoMode = true;
      /* 一部 UI はなし */
      $('.param_reset_view').css('display', 'none');
      $('.param_set_camera').css('display', 'inline');
      $('.param_cube_onoff').css('display', 'none');
      $('.param_line_onoff').css('display', 'none');
      camera_cube_onoff(false);
      camera_line_onoff(false);
   }


   /* カメラ位置の計算 */
   calc_camera_position(itownsCamera);

   /* iTowns Camerw を IP Camera に揃える */
   itownsCamera.setCameraXPos(ipCamera.getCameraXPos());
   itownsCamera.setCameraYPos(ipCamera.getCameraYPos());
   itownsCamera.setCameraZPos(ipCamera.getCameraZPos());
   itownsCamera.setCameraRange(ipCamera.getCameraLength());
   itownsCamera.setCameraXLookAt(ipCamera.getCameraXLookAt());
   itownsCamera.setCameraYLookAt(ipCamera.getCameraYLookAt());
   itownsCamera.setCameraZLookAt(ipCamera.getCameraZLookAt());
   itownsCamera.setCameraTilt(ipCamera.getCameraTilt());
   itownsCamera.setCameraPan(ipCamera.getCameraPan());

   /* パラメーターも揃える */
   $('#camera_tilt_slider').slider("value", -1 * itownsCamera.getCameraTilt()); /* スライダは反転させているので */
   $('.param_camera_tilt').val(itownsCamera.getCameraTilt());
   $('#camera_pan_slider').slider("value", itownsCamera.getCameraPan());
   $('.param_camera_pan').val(itownsCamera.getCameraPan());


   /* set new Camera position */
   console.log("cameraXPos = " + itownsCamera.getCameraXPos());
   console.log("cameraYPos = " + itownsCamera.getCameraYPos());
   console.log("cameraZPos = " + itownsCamera.getCameraZPos());

   var p1 = new itowns.Coordinates('EPSG:4326', itownsCamera.getCameraXPos(), itownsCamera.getCameraYPos(), itownsCamera.getCameraZPos());
   var pv1 = p1.as(view.referenceCrs);
   view.camera.camera3D.position.x = pv1.x;
   view.camera.camera3D.position.y = pv1.y;
   view.camera.camera3D.position.z = pv1.z;
   console.log("view.camera.camera3D.x = " + view.camera.camera3D.position.x);
   console.log("view.camera.camera3D.y = " + view.camera.camera3D.position.y);
   console.log("view.camera.camera3D.z = " + view.camera.camera3D.position.z);
   console.log("=====");


   /* get current settings */
   var p = itowns.CameraUtils.getTransformCameraLookingAtTarget (view, view.camera.camera3D);

   /* set new LookAt position */
   p.range = itownsCamera.getCameraRange();
   p.coord.x = itownsCamera.getCameraXLookAt();
   p.coord.y = itownsCamera.getCameraYLookAt();
   p.coord.z = itownsCamera.getCameraZLookAt();
   p.heading = -1 * ipCamera.getCameraPan();   /* iTowns 内部的には右にマイナス（パラメーターは右にプラス）*/
   p.tilt = -1 * ipCamera.getCameraTilt();     /* 実カメラ位置の地上を見る場合には下向き（倍）*/

   console.log("p.range = " + p.range);
   console.log("p.coord.x = " + p.coord.x);
   console.log("p.coord.y = " + p.coord.y);
   console.log("p.coord.z = " + p.coord.z);
   console.log("p.heading = " + p.heading);
   console.log("p.tilt = " + p.tilt);

   /* set new LookAt position */
   itowns.CameraUtils.transformCameraToLookAtTarget (view, view.camera.camera3D, p);

   /* debug */
   console.log("=====");
   console.log("view.camera.camera3D.x = " + view.camera.camera3D.position.x);
   console.log("view.camera.camera3D.y = " + view.camera.camera3D.position.y);
   console.log("view.camera.camera3D.z = " + view.camera.camera3D.position.z);
   var cv = view.controls.getCameraTargetPosition();
   console.log("=====");
   console.log("current view.controls.getCameraTargetPosition.x = " + cv.x);
   console.log("current view.controls.getCameraTargetPosition.y = " + cv.y);
   console.log("current view.controls.getCameraTargetPosition.z = " + cv.z);
   p = itowns.CameraUtils.getTransformCameraLookingAtTarget (view, view.camera.camera3D);
   console.log("=====");
   console.log("p.range = " + p.range);
   console.log("p.coord.x = " + p.coord.x);
   console.log("p.coord.y = " + p.coord.y);
   console.log("p.coord.z = " + p.coord.z);
   console.log("p.heading = " + p.heading);
   console.log("p.tilt = " + p.tilt);

/*
   var lookAt = camera_lookdir(view.camera.camera3D);
   console.log("view.camera.camera3D.lookAt.x = " + lookAt.x);
   console.log("view.camera.camera3D.lookAt.y = " + lookAt.y);
   console.log("view.camera.camera3D.lookAt.z = " + lookAt.z);
*/

   /* LookAt 設定後、計算でずれてしまうので、再設定 */
   /* カメラの位置を優先する */
   view.camera.camera3D.position.x = pv1.x;
   view.camera.camera3D.position.y = pv1.y;
   view.camera.camera3D.position.z = pv1.z;

   /* debug */
   console.log("===========");
   console.log("view.camera.camera3D.x = " + view.camera.camera3D.position.x);
   console.log("view.camera.camera3D.y = " + view.camera.camera3D.position.y);
   console.log("view.camera.camera3D.z = " + view.camera.camera3D.position.z);
   cv = view.controls.getCameraTargetPosition();
   console.log("===========");
   console.log("current view.controls.getCameraTargetPosition.x = " + cv.x);
   console.log("current view.controls.getCameraTargetPosition.y = " + cv.y);
   console.log("current view.controls.getCameraTargetPosition.z = " + cv.z);
   p = itowns.CameraUtils.getTransformCameraLookingAtTarget (view, view.camera.camera3D);
   console.log("===========");
   console.log("p.range = " + p.range);
   console.log("p.coord.x = " + p.coord.x);
   console.log("p.coord.y = " + p.coord.y);
   console.log("p.coord.z = " + p.coord.z);
   console.log("p.heading = " + p.heading);
   console.log("p.tilt = " + p.tilt);
/*
   lookAt = camera_lookdir(view.camera.camera3D);
   console.log("view.camera.camera3D.lookAt.x = " + lookAt.x);
   console.log("view.camera.camera3D.lookAt.y = " + lookAt.y);
   console.log("view.camera.camera3D.lookAt.z = " + lookAt.z);
*/
   console.log("===========");

   /* test debug */
   console.log("set_camera FOV = " + view.camera.camera3D.fov);
   console.log("set_camera Aspect = " + view.camera.camera3D.aspect);
   console.log("set_camera near = " + view.camera.camera3D.near);
   console.log("set_camera far = " + view.camera.camera3D.far);
   console.log("set_camera FilmHeight = " + view.camera.camera3D.getFilmHeight());
   console.log("set_camera FilmWidth = " + view.camera.camera3D.getFilmWidth());
   console.log("set_camera FocalLength = " + view.camera.camera3D.getFocalLength());

   /* ビューを更新 */
   view.notifyChange();

}

function toDate (str) {
  var arr = (str.substr(0, 4) + '/' + str.substr(4, 2) + '/' + str.substr(6, 2) + '/' + str.substr(8, 2) + '/' + str.substr(10, 2) + '/' + str.substr(12, 2)).split('/');
  return new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5] );
};

/******************************************************************************/
/* Sample for k2goTimeline                                                    */
/* Inoue Computer Service.                                                    */
/******************************************************************************/
/******************************************************************************/
/* window.load                                                                */
/******************************************************************************/
$(window).on("load", function()
{
   setTimeout(function(){ 
		if(document.getElementById("atk").value == ''){
			//Folder = menuGlobe.gui.addFolder("レイヤー追加");
			Folder.__ul.hidden = true;
			document.getElementById("movelink_bottom").hidden = true;
		}else{
			Folder.__ul.hidden = false;
			document.getElementById("movelink_bottom").hidden = false;
		}
		//alert(document.getElementById("atk").value);

	 }, 1000);
   //alert(document.getElementById("atk").value);

  var st_time = new Date($Env.startTime  .getTime());
  var et_time = new Date($Env.endTime    .getTime());
  var ct_time = new Date($Env.currentTime.getTime());

  var ct_yyyy = formatDate(ct_time, 'YYYY')

  if(st != null && st != ""){
    st_time = toDate(st);
  }
  if(et != null && et != ""){
    et_time = toDate(et);
  }
  if(ct != null && ct != ""){
    ct_time = toDate(ct);
  }

  $("#lockWindow").addClass("show");
  $("#timeline").k2goTimeline(
  {
//    startTime        : new Date((new Date()).getFullYear()    , (new Date()).getMonth()    ,  1),
//    endTime          : new Date((new Date()).getFullYear()    , (new Date()).getMonth() + 1,  1),
//    currentTime      : new Date((new Date()).getFullYear()    , (new Date()).getMonth()    , (new Date()).getDay()-1,(new Date()).getHours(),0),
//    startTime        : new Date((new Date()).getFullYear()    , (new Date()).getMonth()    ,  (new Date()).getDate() -7),
//    endTime          : new Date((new Date()).getFullYear()    , (new Date()).getMonth()    ,  (new Date()).getDate() +7),
//    currentTime      : new Date((new Date()).getFullYear()    , (new Date()).getMonth()    , (new Date()).getDate()),
//    minTime          : new Date((new Date()).getFullYear() - 1,                           0,  1),
//    maxTime          : new Date((new Date()).getFullYear() + 1,                           0,  1),
    minTime          : new Date($Env.minTime    .getTime()),
    maxTime          : new Date($Env.maxTime    .getTime()),
    startTime        : st_time,
    endTime          : et_time,
    currentTime      : ct_time,
    pickLineDistance : { element : $("#viewerDiv"), position : "bottom" },
    syncPickAndBar   : true,
    timeChange       : function(pTimeInfo)
    {
      $("#date"             ).html($("#timeline").k2goTimeline("formatDate", pTimeInfo.currentTime, "%y-%mm-%dd %H:%M:%S.%N"));
      var $start   = { date : $("#start_time   input[type='date']"), time : $("#start_time   input[type='time']") };
      var $end     = { date : $("#end_time     input[type='date']"), time : $("#end_time     input[type='time']") };
      var $current = { date : $("#current_time2 input[type='date']"), time : $("#current_time2 input[type='time']") };

      $start  .date.val($("#timeline").k2goTimeline("formatDate", pTimeInfo.  startTime, "%y-%mm-%dd"));
      $start  .time.val($("#timeline").k2goTimeline("formatDate", pTimeInfo.  startTime, "%H:%M:%S"  ));

      $end    .date.val($("#timeline").k2goTimeline("formatDate", pTimeInfo.    endTime, "%y-%mm-%dd"));
      $end    .time.val($("#timeline").k2goTimeline("formatDate", pTimeInfo.    endTime, "%H:%M:%S"  ));

      $current.date.val($("#timeline").k2goTimeline("formatDate", pTimeInfo.currentTime, "%y-%mm-%dd"));
      $current.time.val($("#timeline").k2goTimeline("formatDate", pTimeInfo.currentTime, "%H:%M:%S"  ));

      var positionOnGlobe = new itowns.Coordinates('EPSG:4326', 139.257125, 35.681236, 0)


      //var view = Module.View();
      try {
          //console.log(colorLayer2);

          //itowns.View.getLayerById('降水').opacity = itowns.View.getLayerById('降水').opacity - 0.1;
      } catch( e ) {
        //例外エラーが起きた時に実行する処理
      }


      var $current_p = pTimeInfo.currentTime;
      //document.title = $current_p;
      //document.title = formatDate($current_p, 'YYYYMMDDhhmmss');

	const url = new URL(location);

	url.searchParams.set("dt", formatDate($current_p, 'YYYYMMDDhhmm'));

	//URL書き換え
	//history.replaceState('','',url.pathname + url.search);

//	history.replaceState('','','/geo-sol/test2/test_itw.html?dt='+ formatDate($current_p, 'YYYYMMDDhhmm'));
	//history.pushState(null,null,"/hoge2");

	//var $current_u = new Date($current_p.toUTCString());
      ViewChg(formatDateUTC($current_p, 'YYYYMMDD'),formatDateUTC($current_p, 'hhmm').slice(0,-1)+'0',formatDate($current_p, 'YYYYMMDD'),formatDate($current_p, 'hhmm').slice(0,-1)+'0' );
      //ViewChg(formatDate($current_p, 'YYYYMMDD'),formatDate($current_p, 'hhmm').slice(0,-1)+'0',formatDate($current_p, 'YYYYMMDD'),formatDate($current_p, 'hhmm').slice(0,-1)+'0' );

      console.log("[" + (new Date()).toISOString() + "]timeChange");
    },
    rangeChange : function(pTimeInfo)
    {
      adjustCurrentTime();

      $("#range_start_time span").html($("#timeline").k2goTimeline("formatDate", pTimeInfo.rangeStartTime, "%y-%mm-%dd %H:%M:%S"));
      $("#range_end_time   span").html($("#timeline").k2goTimeline("formatDate", pTimeInfo.rangeEndTime  , "%y-%mm-%dd %H:%M:%S"));
    },
    railClick      : function(pTimeInfo) {
                       adjustCurrentTime();
                       var $current_p = pTimeInfo.currentTime;
                       updateAmedasBargraphLayer(view, formatDate($current_p, 'YYYYMMDDhhmm'), amedas_graph_config, bargraphAmedasLayer, 5);
                       /*putEventInfo("rail click"      );*/
                       if (formatDate($current_p, 'YYYY') != ct_yyyy) {
                         ct_yyyy = formatDate($current_p, 'YYYY');
                         updateBargraphLayer(view, formatDate($current_p, 'YYYY'), graph_config_b, bargraphLayer_b, 2);
                         updateBargraphLayer(view, formatDate($current_p, 'YYYY'), graph_config_r, bargraphLayer_r, 3);
                         updateBargraphLayer(view, formatDate($current_p, 'YYYY'), graph_config_y, bargraphLayer_y, 4);
                       }
    },
    pickTapHold    : function(pTimeInfo) {                      /*putEventInfo("pick tap hold"   );*/ },
    pickMoveStart  : function(pTimeInfo) {                      /*putEventInfo("pick move start" );*/ },
    pickMove       : function(pTimeInfo) {                      /*putEventInfo("pick move"       );*/ },
    pickMoveEnd    : function(pTimeInfo) {
                       adjustCurrentTime();
                       var $current_p = pTimeInfo.currentTime;
                       updateAmedasBargraphLayer(view, formatDate($current_p, 'YYYYMMDDhhmm'), amedas_graph_config, bargraphAmedasLayer, 5);
                       /*putEventInfo("pick move end"   );*/ 
                       if (formatDate($current_p, 'YYYY') != ct_yyyy && graph_config) {
                         ct_yyyy = formatDate($current_p, 'YYYY');
                         updateBargraphLayer(view, formatDate($current_p, 'YYYY'), graph_config_b, bargraphLayer_b, 2);
                         updateBargraphLayer(view, formatDate($current_p, 'YYYY'), graph_config_r, bargraphLayer_r, 3);
                         updateBargraphLayer(view, formatDate($current_p, 'YYYY'), graph_config_y, bargraphLayer_y, 4);
                       }
                     },
    barMoveStart   : function(pTimeInfo) { adjustCurrentTime(); /*putEventInfo("bar  move start" );*/ },
    barMove        : function(pTimeInfo) {                      /*putEventInfo("bar  move"       );*/ },
    barMoveEnd     : function(pTimeInfo) { adjustRangeBar   (); /*putEventInfo("bar  move end"   );*/ },
    zoomStart      : function(pTimeInfo) {                      /*putEventInfo("zoom start"      );*/ },
    zoom           : function(pTimeInfo) {                      /*putEventInfo("zoom"            );*/ },
    zoomEnd        : function(pTimeInfo) { adjustRangeBar   (); /*putEventInfo("zoom end"        );*/ },
    rangeMoveStart : function(pTimeInfo) {                      /*putEventInfo("range move start");*/ },
    rangeMove      : function(pTimeInfo) {                      /*putEventInfo("range move"      );*/ },
    rangeMoveEnd   : function(pTimeInfo)
    {
      var objOptions   = $("#timeline").k2goTimeline("getOptions");
      var objStartTime = objOptions.minTime.getTime() > objOptions.startTime.getTime() ? objOptions.minTime : objOptions.startTime;
      var objEndTime   = objOptions.maxTime.getTime() < objOptions.endTime  .getTime() ? objOptions.maxTime : objOptions.endTime;

      if (pTimeInfo.rangeStartTime < objStartTime)
      {
        objEndTime = new Date(objStartTime.getTime() + (pTimeInfo.rangeEndTime.getTime() - pTimeInfo.rangeStartTime.getTime()));
        $("#timeline").k2goTimeline("showRangeBar", { rangeStartTime : new Date(objStartTime.getTime()), rangeEndTime : new Date(objEndTime.getTime()) });
      }
      else if (pTimeInfo.rangeEndTime > objEndTime)
      {
        objStartTime = new Date(objEndTime.getTime() - (pTimeInfo.rangeEndTime.getTime() - pTimeInfo.rangeStartTime.getTime()));
        $("#timeline").k2goTimeline("showRangeBar", { rangeStartTime : new Date(objStartTime.getTime()), rangeEndTime : new Date(objEndTime.getTime()) });
      }
      else
      {
        objStartTime = pTimeInfo.rangeStartTime;
        objEndTime   = pTimeInfo.rangeEndTime;
      }

      $("#range_start_time span").html($("#timeline").k2goTimeline("formatDate", objStartTime, "%y-%mm-%dd %H:%M:%S"));
      $("#range_end_time   span").html($("#timeline").k2goTimeline("formatDate", objEndTime  , "%y-%mm-%dd %H:%M:%S"));

/*      putEventInfo("range move end");*/
    }
  },
  function(pTimeInfo)
  {
    var objOptions        = $("#timeline").k2goTimeline("getOptions");
    var objRangeStartTime = new Date(objOptions.currentTime.getTime() - $("#timeline").width() / 16 * objOptions.scale);
    var objRangeEndTime   = new Date(objOptions.currentTime.getTime() + $("#timeline").width() / 16 * objOptions.scale);

    $("#min_time         span").html($("#timeline").k2goTimeline("formatDate", objOptions.minTime, "%y-%mm-%dd %H:%M:%S"));
    $("#max_time         span").html($("#timeline").k2goTimeline("formatDate", objOptions.maxTime, "%y-%mm-%dd %H:%M:%S"));
    $("#range_start_time span").html($("#timeline").k2goTimeline("formatDate", objRangeStartTime , "%y-%mm-%dd %H:%M:%S"));
    $("#range_end_time   span").html($("#timeline").k2goTimeline("formatDate", objRangeEndTime   , "%y-%mm-%dd %H:%M:%S"));
    $("#zoom-range"           ).attr("max", $Env.zoomTable.length - 1);

    $("#timeline").k2goTimeline("setOptions", { rangeStartTime : objRangeStartTime, rangeEndTime : objRangeEndTime });
    $(window     ).trigger     ("resize");
    $("#lockWindow").removeClass ("show");
  });
/*-----* pickadate *----------------------------------------------------------*/
  $("#date_box #cal").pickadate(
  {
    selectYears : true,
    clear       : false,
    onOpen      : function()
    {
      var objOptions = $("timeline").k2goTimeline("getOptions");

      this.set("min"   , new Date(objOptions.minTime    .getTime()    ));
      this.set("max"   , new Date(objOptions.maxTime    .getTime() - 1));
      this.set("select", new Date(objOptions.currentTime.getTime()    ));
    },
    onClose : function()
    {
      var objOptions = $("timeline").k2goTimeline("getOptions");
      var objDate    = new Date(this.get("select", "yyyy/mm/dd") + $("#timeline").k2goTimeline("formatDate", objOptions.currentTime, " %H:%M:%S"));

      objDate.setMilliseconds(objOptions.currentTime.getMilliseconds());

      if(objOptions.currentTime.getTime() != objDate.getTime())
      {
        var objTimeInfo = {};

        objTimeInfo.minTime     = new Date(objOptions.minTime    .getTime());
        objTimeInfo.maxTime     = new Date(objOptions.maxTime    .getTime());
        objTimeInfo.startTime   = new Date(objOptions.minTime    .getTime() > objOptions.startTime.getTime() ? objOptions.minTime.getTime() : objOptions.startTime.getTime());
        objTimeInfo.endTime     = new Date(objOptions.maxTime    .getTime() < objOptions.endTime  .getTime() ? objOptions.maxTime.getTime() : objOptions.endTime  .getTime());
        objTimeInfo.currentTime = new Date(objOptions.currentTime.getTime());

        var intDiff1 = objTimeInfo.currentTime.getTime() - objTimeInfo.startTime  .getTime();
        var intDiff2 = objTimeInfo.endTime    .getTime() - objTimeInfo.currentTime.getTime();

        objTimeInfo.currentTime.setTime(objDate.getTime());
        objTimeInfo.startTime  .setTime(objDate.getTime() - intDiff1);
        objTimeInfo.endTime    .setTime(objDate.getTime() + intDiff2);

        if (objOptions.minTime.getTime() > objTimeInfo.startTime.getTime()) objTimeInfo.startTime.setTime(objOptions.minTime.getTime());
        if (objOptions.maxTime.getTime() < objTimeInfo.endTime  .getTime()) objTimeInfo.endTime  .setTime(objOptions.maxTime.getTime());

        $Env.creating = true;
        $("#lockWindow").addClass("show");

        $("#timeline").k2goTimeline("create",
        {
          timeInfo : objTimeInfo,
          callback : function(pTimeInfo)
          {
            adjustRangeBar();
            $Env.creating = false;
            $("#lockWindow").removeClass("show");
          }
        });
      }
      // 閉じるときに地図にフォーカス
      $("#viewerDiv").focus();
    }
  });

  var objOptions = $("#timeline").k2goTimeline("getOptions");

  $("#min_time input[type='date']").val($("#timeline").k2goTimeline("formatDate", objOptions.minTime, "%y-%mm-%dd"));
  $("#min_time input[type='time']").val($("#timeline").k2goTimeline("formatDate", objOptions.minTime, "%H:%M:%S"  ));
  $("#max_time input[type='date']").val($("#timeline").k2goTimeline("formatDate", objOptions.maxTime, "%y-%mm-%dd"));
  $("#max_time input[type='time']").val($("#timeline").k2goTimeline("formatDate", objOptions.maxTime, "%H:%M:%S"  ));
  $("#min_scale"                  ).val(                                          objOptions.minScale);
  $("#max_scale"                  ).val(                                          objOptions.maxScale);

var bargraphLayer_b = CreateBargraphLayer(view, graph_config_b, 2);
var bargraphLayer_r = CreateBargraphLayer(view, graph_config_r, 3);
var bargraphLayer_y = CreateBargraphLayer(view, graph_config_y, 4);
var bargraphAmedasLayer = CreateBargraphLayer(view, amedas_graph_config, 5);


//view.addLayer(bargraphLayer_b).then(menuGlobe.addLayerGUI.bind(menuGlobe));
//view.getLayerById('人口').visible = true;
//view.addLayer(bargraphLayer_r).then(menuGlobe.addLayerGUI.bind(menuGlobe));
//view.getLayerById('世帯').visible = true;
//view.addLayer(bargraphLayer_y).then(menuGlobe.addLayerGUI.bind(menuGlobe));
//view.getLayerById('住宅数').visible = true;
//view.addLayer(bargraphAmedasLayer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
//view.getLayerById('アメダス 【時系列】').visible = true;
//
//bargraphLayer_b.whenReady.then(() => {
//  bargraphLayer_b.updateBarGraph();
//});
//bargraphLayer_r.whenReady.then(() => {
//  bargraphLayer_r.updateBarGraph();
//});
//bargraphLayer_y.whenReady.then(() => {
//  bargraphLayer_y.updateBarGraph();
//});
//bargraphAmedasLayer.whenReady.then(() => {
//  bargraphAmedasLayer.updateBarGraph();
//});
//
//// 拡縮
//view.controls.addEventListener(itowns.CONTROL_EVENTS.RANGE_CHANGED, () => {
//  bargraphLayer_b.whenReady.then(() => {
//    bargraphLayer_b.updateBarGraph();
//  });
//  bargraphLayer_r.whenReady.then(() => {
//    bargraphLayer_r.updateBarGraph();
//  });
//  bargraphLayer_y.whenReady.then(() => {
//    bargraphLayer_y.updateBarGraph();
//  });
//  bargraphAmedasLayer.whenReady.then(() => {
//    bargraphAmedasLayer.updateBarGraph();
//  });
//});
//



//if (graph_config) {
//
//	view.addLayer(bargraphLayer_b).then(menuGlobe.addLayerGUI.bind(menuGlobe));
//	view.getLayerById('人口').visible = true;
//	view.addLayer(bargraphLayer_r).then(menuGlobe.addLayerGUI.bind(menuGlobe));
//	view.getLayerById('世帯').visible = true;
//	view.addLayer(bargraphLayer_y).then(menuGlobe.addLayerGUI.bind(menuGlobe));
//	view.getLayerById('住宅数').visible = true;
//	bargraphLayer_b.whenReady.then(() => {
//	  bargraphLayer_b.updateBarGraph();
//	});
//	bargraphLayer_r.whenReady.then(() => {
//	  bargraphLayer_r.updateBarGraph();
//	});
//	bargraphLayer_y.whenReady.then(() => {
//	  bargraphLayer_y.updateBarGraph();
//	});
//	// 拡縮
//	view.controls.addEventListener(itowns.CONTROL_EVENTS.RANGE_CHANGED, () => {
//	  bargraphLayer_b.whenReady.then(() => {
//	    bargraphLayer_b.updateBarGraph();
//	  });
//	  bargraphLayer_r.whenReady.then(() => {
//	    bargraphLayer_r.updateBarGraph();
//	  });
//	  bargraphLayer_y.whenReady.then(() => {
//	    bargraphLayer_y.updateBarGraph();
//	  });
//	});
//}
//
//if (amedas_graph) {
//
//	view.addLayer(bargraphAmedasLayer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
//	view.getLayerById('アメダス 【時系列】').visible = true;
//
//	bargraphAmedasLayer.whenReady.then(() => {
//	  bargraphAmedasLayer.updateBarGraph();
//	});
//
//	// 拡縮
//	view.controls.addEventListener(itowns.CONTROL_EVENTS.RANGE_CHANGED, () => {
//	  bargraphAmedasLayer.whenReady.then(() => {
//	    bargraphAmedasLayer.updateBarGraph();
//	  });
//	});
//
//}




});$(function() {
/******************************************************************************/
/* change                                                                     */
/******************************************************************************/
$("*").on("change", function()
{
  if ($(this).parent().attr("id") == "get_offset") return;

  if ($(this).attr("type") == "date" || $(this).attr("type") == "time")
  {
    setMinMax ();
    changeTime();
  }
  else if ($(this).attr("id") == "min_scale"        ) { $("#timeline").k2goTimeline("setOptions", { minScale       : parseInt($(this).val(), 10) });         $("#timeline").k2goTimeline("create", { callback : function(pTimeInfo) { $("#event_info").html($("#timeline").k2goTimeline("formatDate", pTimeInfo.currentTime, "after create method<br/>[%y/%mm/%dd %H:%M:%S]")); console.log("[" + (new Date()).toISOString() + "]after create method"); } }); }
  else if ($(this).attr("id") == "max_scale"        ) { $("#timeline").k2goTimeline("setOptions", { maxScale       : parseInt($(this).val(), 10) });         $("#timeline").k2goTimeline("create", { callback : function(pTimeInfo) { $("#event_info").html($("#timeline").k2goTimeline("formatDate", pTimeInfo.currentTime, "after create method<br/>[%y/%mm/%dd %H:%M:%S]")); console.log("[" + (new Date()).toISOString() + "]after create method"); } }); }
  else if ($(this).attr("id") == "time_zone"        ) { $("#timeline").k2goTimeline("setOptions", { timezoneOffset : parseInt($(this).val(), 10) });         $("#timeline").k2goTimeline("create", { callback : function(pTimeInfo) { $("#event_info").html($("#timeline").k2goTimeline("formatDate", pTimeInfo.currentTime, "after create method<br/>[%y/%mm/%dd %H:%M:%S]")); console.log("[" + (new Date()).toISOString() + "]after create method"); } }); }
  else if ($(this).attr("id") == "jp_calendar"      ) { $("#timeline").k2goTimeline("setOptions", { jpCalendar     : $(this).val() == "1" ? true : false }); $("#timeline").k2goTimeline("create", { callback : function(pTimeInfo) { $("#event_info").html($("#timeline").k2goTimeline("formatDate", pTimeInfo.currentTime, "after create method<br/>[%y/%mm/%dd %H:%M:%S]")); console.log("[" + (new Date()).toISOString() + "]after create method"); } }); }
  else if ($(this).attr("id") == "move_bar_disable" ) { $("#timeline").k2goTimeline("setOptions", { disableMoveBar : $(this).prop("checked") }); }
  else if ($(this).attr("id") == "zoom_disable"     ) { $("#timeline").k2goTimeline("setOptions", { disableZoom    : $(this).prop("checked") }); }
  else if ($(this).attr("id") == "sync_pick_and_bar") { $("#timeline").k2goTimeline("setOptions", { syncPickAndBar : $(this).prop("checked") }); }
  else if ($(this).attr("id") == "realtime"         ) { $("#pps"     ).toggleClass ("disable"); $("#loop").toggleClass ("disable"); }
  else if ($(this).attr("id") == "fps"              ) { $("#start"   ).trigger     ("click"); }
  else if ($(this).attr("id") == "pps"              ) { $("#start"   ).trigger     ("click"); }
});
/******************************************************************************/
/* click                                                                      */
/******************************************************************************/
$("input").on("click", function()
{
       if ($(this).attr("id") == "zoom_in" ) $("#timeline").k2goTimeline("zoomIn" );
  else if ($(this).attr("id") == "zoom_out") $("#timeline").k2goTimeline("zoomOut");
  else if ($(this).attr("id") == "stop"    ) $("#timeline").k2goTimeline("stop"   );
  else if ($(this).attr("id") == "start"   )
  {
    $("input").attr("readonly", true ).css({ pointerEvents : "none", opacity : "0.5" });
    $("label").attr("readonly", true ).css({ pointerEvents : "none", opacity : "0.5" });
    $("#fps" ).attr("readonly", false).css({ pointerEvents : ""    , opacity : ""    });
    $("#pps" ).attr("readonly", false).css({ pointerEvents : ""    , opacity : ""    });
    $("#stop").attr("readonly", false).css({ pointerEvents : ""    , opacity : ""    });

    $("#timeline").k2goTimeline("start",
    {
      realTime : $("#realtime").prop("checked"),
      loop     : $("#loop"    ).prop("checked"),
      fps      : parseInt($("#fps").val(), 10),
      speed    : parseInt($("#pps").val(), 10),
      stop     : function()
      {
        $("input").attr("readonly", false).css({ pointerEvents : "", opacity : "" });
        $("label").attr("readonly", false).css({ pointerEvents : "", opacity : "" });
      }
    });
  }
  else if ($(this).attr("id") == "get_time_button")
  {
    var objDate = $("#timeline").k2goTimeline("getTimeFromOffset", parseFloat($("#get_time input").val()));
    $("#get_time_result").text($("#timeline").k2goTimeline("formatDate", objDate, "%y/%mm/%dd %H:%M:%S"));
  }
  else if ($(this).attr("id") == "get_offset_button")
  {
    var objDate = new Date($("#get_offset input[type='date']").val() + " " + $("#get_offset input[type='time']").val());
    $("#get_offset_result").text($("#timeline").k2goTimeline("getOffsetFromTime", objDate));
  }
});
});
/******************************************************************************/
/* setMinMax                                                                  */
/******************************************************************************/
function setMinMax()
{
  var $min       = { date : $("#min_time     input[type='date']"), time : $("#min_time     input[type='time']") };
  var $max       = { date : $("#max_time     input[type='date']"), time : $("#max_time     input[type='time']") };
  var $start     = { date : $("#start_time   input[type='date']"), time : $("#start_time   input[type='time']") };
  var $end       = { date : $("#end_time     input[type='date']"), time : $("#end_time     input[type='time']") };
  var $current   = { date : $("#current_time2 input[type='date']"), time : $("#current_time2 input[type='time']") };
  var objMin     = new Date($min    .date.val() + " " + $min    .time.val());
  var objMax     = new Date($max    .date.val() + " " + $max    .time.val());
  var objStart   = new Date($start  .date.val() + " " + $start  .time.val());
  var objEnd     = new Date($end    .date.val() + " " + $end    .time.val());
  var objCurrent = new Date($current.date.val() + " " + $current.time.val());

  if (objMax    .getTime() <= objMin  .getTime()                                           ) objMax    .setFullYear(objMin  .getFullYear() + 1);
  if (objStart  .getTime() <  objMin  .getTime() || objStart  .getTime() > objMax.getTime()) objStart  .setTime    (objMin  .getTime    () + (objMax.getTime() - objMin  .getTime()) / 2);
  if (objEnd    .getTime() <  objMin  .getTime() || objEnd    .getTime() > objMax.getTime()) objEnd    .setTime    (objMin  .getTime    () + (objMax.getTime() - objMin  .getTime()) / 2);
  if (objEnd    .getTime() <= objStart.getTime()                                           ) objEnd    .setDate    (objStart.getDate    () + 1);
  if (objCurrent.getTime() <  objStart.getTime() || objCurrent.getTime() > objEnd.getTime()) objCurrent.setTime    (objStart.getTime    () + (objEnd.getTime() - objStart.getTime()) / 2);

  $max    .date.val($("#timeline").k2goTimeline("formatDate", objMax    , "%y-%mm-%dd"));
  $max    .time.val($("#timeline").k2goTimeline("formatDate", objMax    , "%H:%M:%S"  ));
  $start  .date.val($("#timeline").k2goTimeline("formatDate", objStart  , "%y-%mm-%dd"));
  $start  .time.val($("#timeline").k2goTimeline("formatDate", objStart  , "%H:%M:%S"  ));
  $end    .date.val($("#timeline").k2goTimeline("formatDate", objEnd    , "%y-%mm-%dd"));
  $end    .time.val($("#timeline").k2goTimeline("formatDate", objEnd    , "%H:%M:%S"  ));
  $current.date.val($("#timeline").k2goTimeline("formatDate", objCurrent, "%y-%mm-%dd"));
  $current.time.val($("#timeline").k2goTimeline("formatDate", objCurrent, "%H:%M:%S"  ));

  $max    .date.attr({ min : $min  .date.val() });
  $start  .date.attr({ min : $min  .date.val(), max : $max.date.val() });
  $end    .date.attr({ min : $start.date.val(), max : $max.date.val() });
  $current.date.attr({ min : $start.date.val(), max : $end.date.val() });

  if ($max    .date.val() == $min  .date.val()) $max    .time.attr({ min : $min  .time.val() }); else $max    .time.attr({ min : "" });
  if ($start  .date.val() == $min  .date.val()) $start  .time.attr({ min : $min  .time.val() }); else $start  .time.attr({ min : "" });
  if ($start  .date.val() == $max  .date.val()) $start  .time.attr({ max : $max  .time.val() }); else $start  .time.attr({ max : "" });
  if ($end    .date.val() == $min  .date.val()) $end    .time.attr({ min : $min  .time.val() }); else $end    .time.attr({ min : "" });
  if ($end    .date.val() == $max  .date.val()) $end    .time.attr({ max : $max  .time.val() }); else $end    .time.attr({ max : "" });
  if ($end    .date.val() == $start.date.val()) $end    .time.attr({ min : $start.time.val() });
  if ($current.date.val() == $start.date.val()) $current.time.attr({ min : $start.time.val() }); else $current.time.attr({ min : "" });
  if ($current.date.val() == $end  .date.val()) $current.time.attr({ max : $end  .time.val() }); else $current.time.attr({ max : "" });
}
/******************************************************************************/
/* changeTime                                                                 */
/******************************************************************************/
function changeTime()
{
  var $min       = { date : $("#min_time     input[type='date']"), time : $("#min_time     input[type='time']") };
  var $max       = { date : $("#max_time     input[type='date']"), time : $("#max_time     input[type='time']") };
  var $start     = { date : $("#start_time   input[type='date']"), time : $("#start_time   input[type='time']") };
  var $end       = { date : $("#end_time     input[type='date']"), time : $("#end_time     input[type='time']") };
  var $current   = { date : $("#current_time2 input[type='date']"), time : $("#current_time2 input[type='time']") };
  var objMin     = new Date($min    .date.val() + " " + $min    .time.val());
  var objMax     = new Date($max    .date.val() + " " + $max    .time.val());
  var objStart   = new Date($start  .date.val() + " " + $start  .time.val());
  var objEnd     = new Date($end    .date.val() + " " + $end    .time.val());
  var objCurrent = new Date($current.date.val() + " " + $current.time.val());

  $("#timeline").k2goTimeline("create",
  {
    timeInfo : { minTime : objMin, maxTime : objMax, startTime : objStart, endTime : objEnd, currentTime : objCurrent },
    duration : 500,
    callback : function(pTimeInfo)
    {
      $("#event_info").html($("#timeline").k2goTimeline("formatDate", pTimeInfo.currentTime, "after create method<br/>[%y/%mm/%dd %H:%M:%S]"));
      console.log("[" + (new Date()).toISOString() + "]after create method");
    }
  });
}
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

function formatDateUTC (date, format) {
        var weekday = ["日", "月", "火", "水", "木", "金", "土"];
        if (!format) {
            format = 'YYYY/MM/DD(WW) hh:mm:ss'
        }
        format = format.replace(/YYYY/g, date.getUTCFullYear());
        format = format.replace(/MM/g, ('0' + (date.getUTCMonth() + 1)).slice(-2));
        format = format.replace(/DD/g, ('0' + date.getUTCDate()).slice(-2));
        format = format.replace(/WW/g, weekday[date.getUTCDay()]);
        format = format.replace(/hh/g, ('0' + date.getUTCHours()).slice(-2));
        format = format.replace(/mm/g, ('0' + date.getUTCMinutes()).slice(-2));
        format = format.replace(/ss/g, ('0' + date.getUTCSeconds()).slice(-2));
        return format;
}




/* 
■Camera
 */
var ipCamera = null;
var itownsCamera = null;

/* earch radius */
var REARTH = 6378150.;
/* 距離のプログラム上の制限 */
var LengthLimit = 10000.;


/* iTowns カメラ */
var defaultCameraXPos = positionOnGlobe.x;
var defaultCameraYPos = positionOnGlobe.y;
var defaultCameraZPos = positionOnGlobe.z;
var defaultCameraTilt;
var defaultCameraPan;
var defaultCameraRoll;


/* Camera クラス */
var Camera = (function() {

   // constructor
   var Camera = function(xpos, ypos, zpos, type) {
      if(!(this instanceof Camera)) {
          return new Camera(xpos, ypos, zpos);
      }

      this.cameraXPos = xpos;
      this.cameraYPos = ypos;
      this.cameraZPos = zpos;
      this.cameraXLookAt = xpos;
      this.cameraYLookAt = ypos;
      this.cameraZLookAt = 0.0;
      this.cameraTilt = -25.0;
      this.cameraPan = 0.0;
      this.cameraRoll = 0.0;
      this.cameraVFov = 30.0;
      this.cameraHFov = 60.0;
      this.cameraLength = 0.0;
      this.cameraRange = 0.0;
      this.cameraType = type;   /* "ip" | "itowns" */
   }

   var p = Camera.prototype;

   // set method
   p.setCameraXPos = function(xpos) {
      this.cameraXPos = xpos;
   }
   p.setCameraYPos = function(ypos) {
      this.cameraYPos = ypos;
   }
   p.setCameraZPos = function(zpos) {
      this.cameraZPos = zpos;
   }
   p.setCameraXLookAt = function(xlookat) {
      this.cameraXLookAt = xlookat;
   }
   p.setCameraYLookAt = function(ylookat) {
      this.cameraYLookAt = ylookat;
   }
   p.setCameraZLookAt = function(zlookat) {
      this.cameraZLookAt = zlookat;
   }
   p.setCameraTilt = function(tilt) {
      this.cameraTilt = tilt;
   }
   p.setCameraPan = function(pan) {
      this.cameraPan = pan;
   }
   p.setCameraRoll = function(roll) {
      this.cameraRoll = roll;
   }
   p.setCameraVFov = function(vfov) {
      this.cameraVFov = vfov;
   }
   p.setCameraHFov = function(hfov) {
      this.cameraHFov = hfov;
   }
   p.setCameraLength = function(length) {
      this.cameraLength = length;
   }
   p.setCameraRange = function(range) {
      this.cameraRange = range;
   }

   // get method
   p.getCameraXPos = function() {
      return this.cameraXPos;
   }
   p.getCameraYPos = function() {
      return this.cameraYPos;
   }
   p.getCameraZPos = function() {
      return this.cameraZPos;
   }
   p.getCameraXLookAt = function() {
      return this.cameraXLookAt;
   }
   p.getCameraYLookAt = function() {
      return this.cameraYLookAt;
   }
   p.getCameraZLookAt = function() {
      return this.cameraZLookAt;
   }
   p.getCameraTilt = function() {
      return this.cameraTilt;
   }
   p.getCameraPan = function() {
      return this.cameraPan;
   }
   p.getCameraRoll = function() {
      return this.cameraRoll;
   }
   p.getCameraVFov = function() {
      return this.cameraVFov;
   }
   p.getCameraHFov = function() {
      return this.cameraHFov;
   }
   p.getCameraLength = function() {
      return this.cameraLength;
   }
   p.getCameraRange = function() {
      return this.cameraRange;
   }

   return Camera;
})();

itownsCamera = new Camera(defaultCameraXPos, defaultCameraYPos, defaultCameraZPos, "itowns");
ipCamera = itownsCamera

/* Move Camera */
function move_camera() 
{
   console.log("----------- move_camera ---------");

   /* curren Camera position */
//   console.log("cameraXPos = " + itownsCamera.getCameraXPos());
//   console.log("cameraYPos = " + itownsCamera.getCameraYPos());
//   console.log("cameraZPos = " + itownsCamera.getCameraZPos());

   var p1 = new itowns.Coordinates('EPSG:4326', itownsCamera.getCameraXPos(), itownsCamera.getCameraYPos(), itownsCamera.getCameraZPos());
   var pv1 = p1.as(view.referenceCrs);
   view.camera.camera3D.position.x = pv1.x;
   view.camera.camera3D.position.y = pv1.y;
   view.camera.camera3D.position.z = pv1.z;
//   console.log("view.camera.camera3D.x = " + view.camera.camera3D.position.x);
//   console.log("view.camera.camera3D.y = " + view.camera.camera3D.position.y);
//   console.log("view.camera.camera3D.z = " + view.camera.camera3D.position.z);
//   console.log("=====");

   /* get current settings */
   var p = itowns.CameraUtils.getTransformCameraLookingAtTarget (view, view.camera.camera3D);

   /* set new LookAt position */
   p.range = itownsCamera.getCameraRange();
   p.coord.x = itownsCamera.getCameraXLookAt();
   p.coord.y = itownsCamera.getCameraYLookAt();
   p.coord.z = itownsCamera.getCameraZLookAt();
   p.heading = -1 * itownsCamera.getCameraPan();   /* iTowns 内部的には右にマイナス（パラメーターは右にプラス）*/
   p.tilt = -1 * itownsCamera.getCameraTilt();     /* 実カメラ位置の地上を見る場合には下向き（倍）*/

//   console.log("p.range = " + p.range);
//   console.log("p.coord.x = " + p.coord.x);
//   console.log("p.coord.y = " + p.coord.y);
//   console.log("p.coord.z = " + p.coord.z);
//   console.log("p.heading = " + p.heading);
//   console.log("p.tilt = " + p.tilt);

   /* set new LookAt position */
   itowns.CameraUtils.transformCameraToLookAtTarget (view, view.camera.camera3D, p);

   /* debug */
   console.log("=====");
   console.log("view.camera.camera3D.x = " + view.camera.camera3D.position.x);
   console.log("view.camera.camera3D.y = " + view.camera.camera3D.position.y);
   console.log("view.camera.camera3D.z = " + view.camera.camera3D.position.z);
   var cv = view.controls.getCameraTargetPosition();
   console.log("=====");
   console.log("current view.controls.getCameraTargetPosition.x = " + cv.x);
   console.log("current view.controls.getCameraTargetPosition.y = " + cv.y);
   console.log("current view.controls.getCameraTargetPosition.z = " + cv.z);
   p = itowns.CameraUtils.getTransformCameraLookingAtTarget (view, view.camera.camera3D);
   console.log("=====");
   console.log("p.range = " + p.range);
   console.log("p.coord.x = " + p.coord.x);
   console.log("p.coord.y = " + p.coord.y);
   console.log("p.coord.z = " + p.coord.z);
   console.log("p.heading = " + p.heading);
   console.log("p.tilt = " + p.tilt);

   /* LookAt 設定後、計算でずれてしまうので、再設定 */
   /* カメラの位置を優先する */
   view.camera.camera3D.position.x = pv1.x;
   view.camera.camera3D.position.y = pv1.y;
   view.camera.camera3D.position.z = pv1.z;

   /* debug */
/*
   console.log("===========");
   console.log("view.camera.camera3D.x = " + view.camera.camera3D.position.x);
   console.log("view.camera.camera3D.y = " + view.camera.camera3D.position.y);
   console.log("view.camera.camera3D.z = " + view.camera.camera3D.position.z);
   cv = view.controls.getCameraTargetPosition();
   console.log("===========");
   console.log("current view.controls.getCameraTargetPosition.x = " + cv.x);
   console.log("current view.controls.getCameraTargetPosition.y = " + cv.y);
   console.log("current view.controls.getCameraTargetPosition.z = " + cv.z);
   p = itowns.CameraUtils.getTransformCameraLookingAtTarget (view, view.camera.camera3D);
   console.log("===========");
   console.log("p.range = " + p.range);
   console.log("p.coord.x = " + p.coord.x);
   console.log("p.coord.y = " + p.coord.y);
   console.log("p.coord.z = " + p.coord.z);
   console.log("p.heading = " + p.heading);
   console.log("p.tilt = " + p.tilt);
*/
/*
   lookAt = camera_lookdir(view.camera.camera3D);
   console.log("view.camera.camera3D.lookAt.x = " + lookAt.x);
   console.log("view.camera.camera3D.lookAt.y = " + lookAt.y);
   console.log("view.camera.camera3D.lookAt.z = " + lookAt.z);
*/
   console.log("===========");

   /* test debug */
/*
   console.log("set_camera FOV = " + view.camera.camera3D.fov);
   console.log("set_camera Aspect = " + view.camera.camera3D.aspect);
   console.log("set_camera near = " + view.camera.camera3D.near);
   console.log("set_camera far = " + view.camera.camera3D.far);
   console.log("set_camera FilmHeight = " + view.camera.camera3D.getFilmHeight());
   console.log("set_camera FilmWidth = " + view.camera.camera3D.getFilmWidth());
   console.log("set_camera FocalLength = " + view.camera.camera3D.getFocalLength());
*/
   /* ビューを更新 */
   view.notifyChange();

}


/* Auto set_camera */
function auto_set_camera(prop)
{
   console.log("auto set camera = " + prop);
   autoSetCamera = prop;
}


/* line onoff */
function camera_line_onoff(prop)
{
   if (lineObj != null) lineObj.visible = prop; 
   visibleLineObj = prop;
   /* ビューを更新 */
   view.notifyChange();
}

/* cube onoff */
function camera_cube_onoff(prop)
{
   if (cubeMesh != null) cubeMesh.visible = prop; 
   visibleCubeObj = prop;
   /* ビューを更新 */
   view.notifyChange();
}

/* plane onoff */
function plane_onoff(prop)
{
   if (planeMesh != null) planeMesh.visible = prop; 
   /* ビューを更新 */
   view.notifyChange();
}


/* iTowns Camera Pan */
function set_camera_pan(val, num=1) 
{
//   var THREE = itowns.THREE;

   itownsCamera.setCameraPan(parseFloat(val));
   console.log("iTowns Camera Pan = " + itownsCamera.getCameraPan());

   /* get current settings */
   var camera_px = view.camera.camera3D.position.x;
   var camera_py = view.camera.camera3D.position.y;
   var camera_pz = view.camera.camera3D.position.z;
   var pxyz = new itowns.Coordinates('EPSG:4978', parseFloat(camera_px), parseFloat(camera_py), parseFloat(camera_pz));
   var cxyz = pxyz.as('EPSG:4326');  // Geographic system
   itownsCamera.setCameraXPos(cxyz.longitude);
   itownsCamera.setCameraYPos(cxyz.latitude);
   itownsCamera.setCameraZPos(cxyz.altitude);

   /* get LookAt position */
   var p = itowns.CameraUtils.getTransformCameraLookingAtTarget (view, view.camera.camera3D);
   itownsCamera.setCameraRange(p.range);
   itownsCamera.setCameraXLookAt(p.coord.x);
   itownsCamera.setCameraYLookAt(p.coord.y);
   itownsCamera.setCameraZLookAt(p.coord.z);
   itownsCamera.setCameraTilt(-1 * p.tilt);

   /* カメラ位置の計算 */
//   calc_camera_position(ipCamera);

   /* カメラの移動 */
   if (num == 1) move_camera();

}

/* iTowns Camera Pan mouse direction */
function set_camera_pan_mouse_dir(prop) 
{
   mousePanDir = prop;
}


/* iTowns Camera Tilt */
function set_camera_tilt(val, num=1) 
{
//   var THREE = itowns.THREE;

   itownsCamera.setCameraTilt(parseFloat(val));
   console.log("iTowns Camera Tilt = " + itownsCamera.getCameraTilt());

   /* get current settings */
   var camera_px = view.camera.camera3D.position.x;
   var camera_py = view.camera.camera3D.position.y;
   var camera_pz = view.camera.camera3D.position.z;
   var pxyz = new itowns.Coordinates('EPSG:4978', parseFloat(camera_px), parseFloat(camera_py), parseFloat(camera_pz));
   var cxyz = pxyz.as('EPSG:4326');  // Geographic system
   itownsCamera.setCameraXPos(cxyz.longitude);
   itownsCamera.setCameraYPos(cxyz.latitude);
   itownsCamera.setCameraZPos(cxyz.altitude);

   /* get LookAt position */
   var p = itowns.CameraUtils.getTransformCameraLookingAtTarget (view, view.camera.camera3D);
   itownsCamera.setCameraRange(p.range);
   itownsCamera.setCameraXLookAt(p.coord.x);
   itownsCamera.setCameraYLookAt(p.coord.y);
   itownsCamera.setCameraZLookAt(p.coord.z);
   itownsCamera.setCameraPan(-1 * p.heading);

   /* カメラ位置の計算 */
//   calc_camera_position(ipCamera);

   /* カメラの移動 */
   if (num == 1) move_camera();

}

function set_camera_tilt_reset()
{
  let inurl = new URL(location).toString();
  let inparam = $.nictSTARSViewURL.parseURL(inurl);
  let tilt = -25;
  let zoom = 30;
  if(inparam["zoom"] != null && inparam["zoom"] != ""){
    zoom = parseFloat(inparam["zoom"]);
  }
  if(inparam["tilt"] != null && inparam["tilt"] != ""){
    tilt = parseFloat(inparam["tilt"]);
  }
  if(inparam["heading"] != null && inparam["heading"] != ""){
    heading = parseFloat(inparam["heading"]);
  }
  set_camera_vfov(zoom);
  set_camera_pan(heading);
  set_camera_tilt(tilt);
}

/* iTowns Camera Tilt mouse direction */
function set_camera_tilt_mouse_dir(prop) 
{
   mouseTiltDir = prop;
}

/* iTowns Camera VFov */
function set_camera_vfov(val) 
{
   itownsCamera.setCameraVFov(parseFloat(val));
   console.log("iTowns Camera VFov = " + itownsCamera.getCameraVFov());

   /* iTowns カメラの垂直視野角を変更 */
   view.camera.camera3D.fov = itownsCamera.getCameraVFov();

   /* ビューを更新 */
   view.camera.camera3D.updateProjectionMatrix();

   /* ビューを更新 */
   view.notifyChange();
}

    /* iTowns Camera Vertical Fov (Zoom) */
    jQuery(document).ready(function(){
      function setCameraVfov() {
        var sval = $('.param_camera_vfov').val();
        $('#camera_vfov_slider').slider("value", sval);
        set_camera_vfov(sval);
      }
      $('.param_camera_vfov').spinner({
        min: 1,
        step: 1,
        change: setCameraVfov,
        spin: setCameraVfov,
        stop: setCameraVfov
      });
    });
    jQuery(document).ready(function(){
      $('#camera_vfov_slider').slider({
        max:120,
        min:1,
        value:30,
        step:1,
        slide: function( event, ui ) {
          console.log("camera_vfov_slider = " + ui.value);
          $('.param_camera_vfov').val(ui.value);
          set_camera_vfov(ui.value);
        }
      });
    });
    /* iTowns Camera Tilt */
    jQuery(document).ready(function(){
      function setCameraTilt() {
        var sval = $('.param_camera_tilt').val();
        // 数値以外は処理しない
        if (sval == "") {
        } else if (sval == "-") {
        } else if (!isFinite(sval)) {
        } else {
            if (sval <= -90 || 90<= sval) {
            } else {
                $('#camera_tilt_slider').slider("value", -1*sval);
                set_camera_tilt(sval);
            }
        }
      }
      $('.param_camera_tilt').spinner({
        max:90,
        min:-90,
        step: 0.01,
        change: setCameraTilt,
        spin: setCameraTilt,
        stop: setCameraTilt
      });
    });
    jQuery(document).ready(function(){
      $('#camera_tilt_slider').slider({
        max:90,
        min:-90,
        value:25,
        step:0.01,
        slide: function( event, ui ) {
          console.log("camera_tilt_slider = " + ui.value);
          $('.param_camera_tilt').val(-1 * ui.value);
          set_camera_tilt(-1 * ui.value);
        }
      });
    });
    /* mouse direction */
    jQuery(document).ready(function(){
      $('.param_camera_tilt_mouse_dir').on('change', function(){
        var prop = $('.param_camera_tilt_mouse_dir').prop('checked');
        console.log("Now change param_camera_tilt_mouse_dir = " + prop);
        set_camera_tilt_mouse_dir(prop);
      });
    });

    /* ViewURLボタン */
    jQuery(document).ready(function(){
      $('.btn_view_url').on('click', function(){
        calc_camera_position(itownsCamera);
        const inurl = new URL(location).toString();
        //const baseurl = inurl.substring(0, inurl.indexOf("?"))
        var baseurl = inurl.substring(0, inurl.indexOf("?"))
        if(baseurl == '') baseurl = inurl;
        

        let layer_ids = getLayerIdsWithOpacity();
        let inparam = $.nictSTARSViewURL.parseURL(inurl);
        var p_time = $("#timeline").k2goTimeline("getTimeInfo");
        inparam["st"]   = formatDate(p_time.startTime, 'YYYYMMDDhhmm');
        inparam["et"]   = formatDate(p_time.endTime, 'YYYYMMDDhhmm');
        inparam["ct"]   = formatDate(p_time.currentTime, 'YYYYMMDDhhmm');
        inparam["map_latitude"]   = ipCamera.getCameraYPos();
        inparam["map_longitude"]  = ipCamera.getCameraXPos();
        inparam["map_height"]  = ipCamera.getCameraZPos();
        inparam["zoom"] = $('.param_camera_vfov').val();
        inparam["tilt"] = $('.param_camera_tilt').val();
        inparam["heading"] = $('.param_camera_pan').val();
        inparam["layerIds"] = layer_ids;
        let strUurl = $.nictSTARSViewURL.createURL(baseurl, inparam);
//        $('.text_view_url').text($.nictSTARSViewURL.createURL(baseurl, inparam));
//        $("#url-dialog").dialog({
//          modal:true, //モーダル表示
//          title:"url-dialog", //タイトル
//          buttons: { //ボタン
//            "OK": function() {
//              $(this).dialog("close");
//            }
//          }
//        });
        $("#view_url_input"    ).val    (strUurl);
        $("#view_url_input"    ).attr   ("aria-label" , strUurl );
        $("#view_url"          ).css    ("display" , "block");
        $(".input_group_button").trigger("click");


      });
    });

    /* iTowns Camera Pan */
    jQuery(document).ready(function(){
      function setCameraPan() {
        var sval = $('.param_camera_pan').val();
        // 数値以外は処理しない
        if (sval == "") {
        } else if (sval == "-") {
        } else if (!isFinite(sval)) {
        } else {
            $('#camera_pan_slider').slider("value", sval);
            set_camera_pan(sval);
        }
      }
      $('.param_camera_pan').spinner({
        step: 0.01,
        change: setCameraPan,
        spin: setCameraPan,
        stop: setCameraPan
      });
    });
    jQuery(document).ready(function(){
      $('#camera_pan_slider').slider({
        max:180,
        min:-180,
        value:0,
        step:0.01,
        slide: function( event, ui ) {
          console.log("camera_pan_slider = " + ui.value);
          $('.param_camera_pan').val(-ui.value);
          set_camera_pan(-ui.value);
        }
      });
    });

// 存在する年月日を取得
async function jinryu_exist(path_get_date) {
  try{
    const response = await fetch(path_get_date);
    if (response.ok) {
      const res =  await response.json();
      jinryu_exist_date = ""
      Object.keys(res).forEach(function(date){
        jinryu_exist_date += date.substring(0,4) + "年" 
            + date.substring(4,6) + "月" + date.substring(6,8) + "日 ：" 
            + res[date] + "<BR>"
      });

      // カラーバーに追記
      updateLegend();
    } else {
      console.log("HTTP-Error: " + response.status);
    }
  } catch(err) {
    console.log(err);
  }
}
var jinryu_exist_date = "";
if(jinryu_exist_date == ""){
  var path_get_date = "https://tb-gis-web.jgn-x.jp/api/t_people_exist_date";
  jinryu_exist(path_get_date);

}



// 凡例表示
window.updateLegend = function(selectedLayerIds, layerVis) {

	layerGuide(selectedLayerIds, layerVis);

////alert(selectedLayerIds + "表示" + layerVis);
//
////    let selectedLayerIds = getLayerIds();
////
////    if(selectedLayerIds == null){
////      selectedLayerIds = Object.keys(url_select_layerids);
////    }
//
//    // NC（降水 【時系列】）
//    if (selectedLayerIds != null && selectedLayerIds == "降水 【時系列】") {
//      if (layerVis) {
//        var colorbarUrl = "./test_itw/img/wni_colorbar.png";
//        var scaleUrl = "./test_itw/img/wni_colorbar_scale.png";
//        var $legend = $("<div class=\"" + "wni" + " legend\"><div class=\"scale\"><div class=\"colorbar\"><img></div></div></div>");
//        $legend.find("div.colorbar img").attr("src", colorbarUrl).addClass("opacity_0.8");
//        $("#legend").append($legend);
//      }
//      else {
//        $("#legend").empty();
//      }
//    }
//    // 日射量
//    if (selectedLayerIds != null && selectedLayerIds == "日射 【時系列】") {
//      if (layerVis) {
//        var $legend = '';
//        var colorbarUrl = "./test_itw/img/amjp_colorbar.png";
//        var scaleUrl = "./test_itw/img/amjp_colorbar_scale.png";
//        var $legend = $("<div class=\"" + "amjp" + " legend\"><div class=\"scale\"><div class=\"colorbar\"><img></div></div></div>");
//        $legend.find("div.colorbar img").attr("src", colorbarUrl).addClass("opacity_0.8");
//        $("#legend").append($legend);
//      }
//      else {
//        $("#legend").empty();
//      }
//    }
//    // 気温
//    if (selectedLayerIds != null && selectedLayerIds == "温度 【時系列】") {
//      if (layerVis) {
//        var colorbarUrl = "./test_itw/img/amjp_colorbar.png";
//        var scaleUrl = "./test_itw/img/amjp_colorbar_scale_temp.png";
//        var $legend = $("<div class=\"" + "amjp_temp" + " legend\"><div class=\"scale\"><div class=\"colorbar\"><img></div></div></div>");
//        $legend.find("div.colorbar img").attr("src", colorbarUrl).addClass("opacity_opacity_0.8");
//        $("#legend").append($legend);
//      }
//      else {
//        $("#legend").empty();
//      }
//    }
//    // 湿度
//    if (selectedLayerIds != null && selectedLayerIds == "湿度 【時系列】") {
//      if (layerVis) {
//        var colorbarUrl = "./test_itw/img/amjp_colorbar.png";
//        var scaleUrl = "./test_itw/img/amjp_colorbar_scale_humidity.png";
//        var $legend = $("<div class=\"" + "amjp_humidity" + " legend\"><div class=\"scale\"><div class=\"colorbar\"><img></div></div></div>");
//        $legend.find("div.colorbar img").attr("src", colorbarUrl).addClass("opacity_0.8");
//        $("#legend").append($legend);
//      }
//      else {
//        $("#legend").empty();
//      }
//    }
//    // 風速
//    if (selectedLayerIds != null && selectedLayerIds == "風向 【時系列】") {
//      if (layerVis) {
//        var colorbarUrl = "./test_itw/img/wnd_colorbar.png";
//        var scaleUrl = "./test_itw/img/amjp_colorbar_scale_wnd.png";
//        var $legend = $("<div class=\"" + "amjp_wnd" + " legend\"><div class=\"scale\"><div class=\"colorbar\"><img></div></div></div>");
//        $legend.find("div.colorbar img").attr("src", colorbarUrl).addClass("opacity_0.8");
//        $("#legend").append($legend);
//      }
//      else {
//        $("#legend").empty();
//      }
//    }
//
//    // 人口
//    if (selectedLayerIds != null && selectedLayerIds == "人口") {
//      if (layerVis) {
//        var $legend = '';
//        $legend += '<div><span style="background-color: #FF3300"></span>15,000超</div>';
//        $legend += '<div><span style="background-color: #FF9966"></span>15,000</div>';
//        $legend += '<div><span style="background-color: #FFCC33"></span>12,500</div>';
//        $legend += '<div><span style="background-color: #FFFF33"></span>10,000</div>';
//        $legend += '<div><span style="background-color: #CCFF00"></span>7,500</div>';
//        $legend += '<div><span style="background-color: #99FF66"></span>5,000</div>';
//        $legend += '<div><span style="background-color: #E0FFFF"></span>2,500</div>';
//        $("#pop_legend").append($legend);
//        $("#pop_legend").addClass("pop_legend");
//        $("#pop_legend").css("display" , "block");
//      } else {
//        $("#pop_legend").empty();
//        $("#pop_legend").removeClass("pop_legend");
//      }
//    }
//
//    // 人流
//    if (selectedLayerIds != null && selectedLayerIds == "人流（GPS）") {
//      if (layerVis) {
//        var $legend = '';
//        if (jinryu_exist_date != ""){
//          $legend += '<div>人流データがある日と場所<BR>' + jinryu_exist_date + '</div>';
//        }
//        $legend += '<div>デバイスID(すべて)</div>';
//        $legend += '<div><span style="background-color: #00FF3B"></span>0003</div>';
//        $legend += '<div><span style="background-color: #00F9A9"></span>0004</div>';
//        $legend += '<div><span style="background-color: #B6FF01"></span>0005</div>';
//        $legend += '<div><span style="background-color: #00ECFF"></span>0006</div>';
//        $legend += '<div><span style="background-color: #005FFF"></span>0007</div>';
//        $legend += '<div><span style="background-color: #D2691E"></span>000A</div>';
//        $legend += '<div><span style="background-color: #CD5C5C"></span>000B</div>';
//        $legend += '<div><span style="background-color: #A52A2A"></span>000C</div>';
//        $legend += '<div><span style="background-color: #8B0000"></span>000D</div>';
//        $legend += '<div><span style="background-color: #DC143C"></span>0011</div>';
//        $("#jinryu_legend").append($legend);
//        $("#jinryu_legend").addClass("jinryu_legend");
//        $("#jinryu_legend").css("display" , "block");
//      } else {
//        $("#jinryu_legend").empty();
//        $("#jinryu_legend").removeClass("jinryu_legend");
//      }
//    }
//

}


function layerGuide(selectedLayerIds, layerVis) {

    // NC（降水 【時系列】）
    if (selectedLayerIds != null && selectedLayerIds == "降水 【時系列】") {
      if (layerVis) {
        var colorbarUrl = "./test_itw/img/wni_colorbar.png";
        var scaleUrl = "./test_itw/img/wni_colorbar_scale.png";
        var $legend = $("<div class=\"" + "wni" + " legend\"><div class=\"scale\"><div class=\"colorbar\"><img></div></div></div>");
        $legend.find("div.colorbar img").attr("src", colorbarUrl).addClass("opacity_0.8");
        $("#legend").append($legend);
      }
      else {
        $("#legend").empty();
      }
    }
    // 日射量
    if (selectedLayerIds != null && selectedLayerIds == "日射 【時系列】") {
      if (layerVis) {
        var $legend = '';
        var colorbarUrl = "./test_itw/img/amjp_colorbar.png";
        var scaleUrl = "./test_itw/img/amjp_colorbar_scale.png";
        var $legend = $("<div class=\"" + "amjp" + " legend\"><div class=\"scale\"><div class=\"colorbar\"><img></div></div></div>");
        $legend.find("div.colorbar img").attr("src", colorbarUrl).addClass("opacity_0.8");
        $("#legend").append($legend);
      }
      else {
        $("#legend").empty();
      }
    }
    // 気温
    if (selectedLayerIds != null && selectedLayerIds == "温度 【時系列】") {
      if (layerVis) {
        var colorbarUrl = "./test_itw/img/amjp_colorbar.png";
        var scaleUrl = "./test_itw/img/amjp_colorbar_scale_temp.png";
        var $legend = $("<div class=\"" + "amjp_temp" + " legend\"><div class=\"scale\"><div class=\"colorbar\"><img></div></div></div>");
        $legend.find("div.colorbar img").attr("src", colorbarUrl).addClass("opacity_opacity_0.8");
        $("#legend").append($legend);
      }
      else {
        $("#legend").empty();
      }
    }
    // 湿度
    if (selectedLayerIds != null && selectedLayerIds == "湿度 【時系列】") {
      if (layerVis) {
        var colorbarUrl = "./test_itw/img/amjp_colorbar.png";
        var scaleUrl = "./test_itw/img/amjp_colorbar_scale_humidity.png";
        var $legend = $("<div class=\"" + "amjp_humidity" + " legend\"><div class=\"scale\"><div class=\"colorbar\"><img></div></div></div>");
        $legend.find("div.colorbar img").attr("src", colorbarUrl).addClass("opacity_0.8");
        $("#legend").append($legend);
      }
      else {
        $("#legend").empty();
      }
    }
    // 風速
    if (selectedLayerIds != null && selectedLayerIds == "風向 【時系列】") {
      if (layerVis) {
        var colorbarUrl = "./test_itw/img/wnd_colorbar.png";
        var scaleUrl = "./test_itw/img/amjp_colorbar_scale_wnd.png";
        var $legend = $("<div class=\"" + "amjp_wnd" + " legend\"><div class=\"scale\"><div class=\"colorbar\"><img></div></div></div>");
        $legend.find("div.colorbar img").attr("src", colorbarUrl).addClass("opacity_0.8");
        $("#legend").append($legend);
      }
      else {
        $("#legend").empty();
      }
    }

    // 人口
    if (selectedLayerIds != null && selectedLayerIds == "人口(町丁目)") {
      if (layerVis) {
        var $legend = '';
        $legend += '<div><span style="background-color: #FF3300"></span>15,000超</div>';
        $legend += '<div><span style="background-color: #FF9966"></span>15,000</div>';
        $legend += '<div><span style="background-color: #FFCC33"></span>12,500</div>';
        $legend += '<div><span style="background-color: #FFFF33"></span>10,000</div>';
        $legend += '<div><span style="background-color: #CCFF00"></span>7,500</div>';
        $legend += '<div><span style="background-color: #99FF66"></span>5,000</div>';
        $legend += '<div><span style="background-color: #E0FFFF"></span>2,500</div>';
        $("#pop_legend").append($legend);
        $("#pop_legend").addClass("pop_legend");
        $("#pop_legend").css("display" , "block");
      } else {
        $("#pop_legend").empty();
        $("#pop_legend").removeClass("pop_legend");
      }
    }

    // 人流
    if (selectedLayerIds != null && selectedLayerIds == "人流（GPS）") {
      if (layerVis) {
        var $legend = '';
        if (jinryu_exist_date != ""){
          $legend += '<div>人流データがある日と場所<BR>' + jinryu_exist_date + '</div>';
        }
        $legend += '<div>デバイスID(すべて)</div>';
        $legend += '<div><span style="background-color: #00FF3B"></span>0003</div>';
        $legend += '<div><span style="background-color: #00F9A9"></span>0004</div>';
        $legend += '<div><span style="background-color: #B6FF01"></span>0005</div>';
        $legend += '<div><span style="background-color: #00ECFF"></span>0006</div>';
        $legend += '<div><span style="background-color: #005FFF"></span>0007</div>';
        $legend += '<div><span style="background-color: #D2691E"></span>000A</div>';
        $legend += '<div><span style="background-color: #CD5C5C"></span>000B</div>';
        $legend += '<div><span style="background-color: #A52A2A"></span>000C</div>';
        $legend += '<div><span style="background-color: #8B0000"></span>000D</div>';
        $legend += '<div><span style="background-color: #DC143C"></span>0011</div>';
        $("#jinryu_legend").append($legend);
        $("#jinryu_legend").addClass("jinryu_legend");
        $("#jinryu_legend").css("display" , "block");
      } else {
        $("#jinryu_legend").empty();
        $("#jinryu_legend").removeClass("jinryu_legend");
      }
    }


}



/* 
■view位置の出力
 */
function outupt_view_position() 
{
console.log("---- outupt_view_position ----");
console.log("-----");
//console.log("camera pos x = " + Math.round (camera.getCameraXPos() * 100) / 100 + " y = " + Math.round (camera.getCameraYPos() * 100) / 100 + " z = " + Math.round (camera.getCameraZPos() * 100) / 100);
//console.log("camera lookat  x = " + Math.round (camera.getCameraXLookAt() * 100) / 100 + " y = " + Math.round (camera.getCameraYLookAt() * 100) / 100 + " z = " + Math.round (camera.getCameraZLookAt() * 100) / 100);

  var x;
  var y;
  var z;
  var pxyz = new itowns.Coordinates('EPSG:4978', parseFloat(view.camera.camera3D.position.x), parseFloat(view.camera.camera3D.position.y), parseFloat(view.camera.camera3D.position.z));
  var cxyz = pxyz.as('EPSG:4326');  // Geographic system
  x = cxyz.longitude;
  y = cxyz.latitude;
  z = cxyz.altitude;
console.log("view pos x = " + x + " y = " + y + " z = " + z);
//console.log("camera lookat  x = " + Math.round (camera.getCameraXLookAt() * 100) / 100 + " y = " + Math.round (camera.getCameraYLookAt() * 100) / 100 + " z = " + Math.round (camera.getCameraZLookAt() * 100) / 100);
console.log("-----");

}

/* 
 * カメラ位置の計算
 */
function calc_camera_position(camera) 
{
console.log("---- calc_camera_position ----");

   var height;
   var tilt;
   var length;

   height = camera.getCameraZPos();
   tilt = 90 + camera.getCameraTilt(); /* パラメーターでは下向きをマイナスで表現 */
console.log("height = " + height + ", tilt = " + tilt);

   /* 下向き */
   if (tilt < 90) {

      /* z = 0 の点 */
      camera.setCameraZLookAt(0.0);

      /* z = 0 になる点とカメラ位置との地上距離 */
      length = height * Math.tan(tilt * (Math.PI / 180));
console.log("length = " + length);

      /* 距離の制限 */
      if (length > LengthLimit) {
         var dz = LengthLimit * Math.cos(tilt * (Math.PI / 180)); 
         camera.setCameraZLookAt(camera.getCameraZPos() - dz);
         length = LengthLimit * Math.sin(tilt * (Math.PI / 180));
      }

      /* LookAt 点との距離 */
      camera.setCameraLength(Math.sqrt(length*length + height*height));
   }
   /* 上向き */
   else if (tilt > 90) {

      /* 距離の制限 */
      var zval = LengthLimit * Math.sin((tilt - 90)* (Math.PI / 180)) + camera.getCameraZPos();
      camera.setCameraZLookAt(zval);

      /* 地上距離 */
      length = LengthLimit * Math.cos((tilt - 90)* (Math.PI / 180));
console.log("length = " + length);

      /* LookAt 点との距離 */
      camera.setCameraLength(LengthLimit);

   }
   /* 平行カメラ */
   else {
      length = LengthLimit;
      camera.setCameraLength(LengthLimit);
      camera.setCameraZLookAt(camera.getCameraZPos());
   }

   /* 緯度経度から距離へのラフな換算 */
   var xPos;
   var yPos;
   var zPos;
   var cPan;
   var xLookAt;
   var yLookAt;
   var zLookAt;
   xPos = camera.getCameraXPos();
   yPos = camera.getCameraYPos();
   zPos = camera.getCameraZPos();
   cPan = camera.getCameraPan();

   var r = 2 * Math.PI * REARTH; /* 円周地球 */
   var rlat = r / 360; /* 1度あたりの長さ */
   var rlon = REARTH * Math.cos(yPos / 180 * Math.PI) * 2 * Math.PI / 360;  /* rcos(Theta) */
console.log("rlon = " + rlon + " rlat = " + rlat);
   var rlon_length = length / rlon;
   var rlat_length = length / rlat;
console.log("approximate rlon_length = " + rlon_length + " rlat_length = " + rlat_length);
   /* target 位置の計算 */
   xLookAt = xPos + rlon_length * Math.sin(cPan * (Math.PI / 180));
   yLookAt = yPos + rlat_length * Math.cos(cPan * (Math.PI / 180));

   camera.setCameraXLookAt(xLookAt);
   camera.setCameraYLookAt(yLookAt);
   camera.setCameraRange(camera.getCameraLength());

// result
console.log("-----");
console.log("camera pos x = " + camera.getCameraXPos() + " y = " + camera.getCameraYPos() + " z = " + camera.getCameraZPos());
console.log("camera lookat  x = " + camera.getCameraXLookAt() + " y = " + camera.getCameraYLookAt() + " z = " + camera.getCameraZLookAt());
console.log("-----");
}


/* マウス操作 */
var vfovFactor = 1;  /* camera fov 移動量 (slider の刻みとあわせる必要あり）*/
var mouseDown = false;
var mouseLeftDown = false;
var mouseRightDown = false;
var mouseX;
var mouseY;

/* マウス操作と Pan/Tilt の向き */
var mousePanDir = true;     /* false : カメラ向き,  true : オブジェクト向き（同じ方向に動かす）*/
var mouseTiltDir = true;    /* false : カメラ向き,  true : オブジェクト向き（同じ方向に動かす）*/

/*
 * mouse event の登録 
 */
function setMouseEvent() 
{

   /* Mouse Wheel */
   viewerDiv.addEventListener('wheel', function _(e) { 
console.log("----");

      var delta = e.wheelDelta;
      var val;
      if (delta > 0) {
         val = itownsCamera.getCameraVFov() - vfovFactor;
      }
      else {
         val = itownsCamera.getCameraVFov() + vfovFactor;
      }
      if (val < 1) val = 1;
      set_camera_vfov(val);
      $('.param_camera_vfov').val(itownsCamera.getCameraVFov());
      $('#camera_vfov_slider').slider("value", itownsCamera.getCameraVFov());
      set_camera_tilt(itownsCamera.getCameraTilt(), 0); // マウスのときは計算だけして動かさない
   }, false);

   /* Mouse Wheel(Firefox) */
   viewerDiv.addEventListener('DOMMouseScroll', function _(e) { 
      var delta = e.detail;
      var val;
      if (delta > 0) {
         val = itownsCamera.getCameraVFov() + vfovFactor;
      }
      else {
         val = itownsCamera.getCameraVFov() - vfovFactor;
      }
      if (val < 1) val = 1;
      set_camera_vfov(val);
      $('.param_camera_vfov').val(itownsCamera.getCameraVFov());
      $('#camera_vfov_slider').slider("value", itownsCamera.getCameraVFov());
      set_camera_tilt(itownsCamera.getCameraTilt(), 0); // マウスのときは計算だけして動かさない
   }, false);

   /* Mouse Down */
   viewerDiv.addEventListener('mousedown', function _(e) { 
      mouseDown = true;
      if (e.button == 0) {
         mouseLeftDown = true;
         mouseX = e.clientX;
         mouseY = e.clientY;
      }
      if (e.button == 2) {
         mouseRightDown = true;
      }
   }, false);

   /* Move Move */
   viewerDiv.addEventListener('mousemove', function _(e) { 
      if (mouseLeftDown) {
         var val1;
         var val2;
         var ex = e.clientX;
         var ey = e.clientY;
         var dx = mouseX - ex;
         var dy = mouseY - ey;

         var currentZoom = itownsCamera.getCameraVFov();
         var ratio = 0.025;
         if (currentZoom < 2) {
            ratio = 0.001;
         } else if (currentZoom < 10) {
            ratio = 0.005;
         } else if (currentZoom < 20) {
            ratio = 0.01;
         }

         val1 = itownsCamera.getCameraPan() - dx * ratio; 
         $('.param_camera_pan').val(itownsCamera.getCameraPan());
         $('#camera_pan_slider').slider("value", itownsCamera.getCameraPan());


         val2 = itownsCamera.getCameraTilt() - dy * ratio; 
         $('.param_camera_tilt').val(itownsCamera.getCameraTilt());
         $('#camera_tilt_slider').slider("value", -1*itownsCamera.getCameraTilt());


/*
         mouseX = ex;
         mouseY = ey;
         var currentZoom = itownsCamera.getCameraVFov();
         var ratio = 0.025;
         if (currentZoom < 2) {
            ratio = 0.001;
         } else if (currentZoom < 10) {
            ratio = 0.005;
         } else if (currentZoom < 20) {
            ratio = 0.01;
         }
*/
// 上下、左右、大きい方だけの処理をやめ、どちらも常に計算する
//         if (Math.abs(dx) > Math.abs(dy)) {
            if (mousePanDir) {
               val1 = itownsCamera.getCameraPan() + dx * ratio; 
            } else {
               val1 = itownsCamera.getCameraPan() - dx * ratio; 
            }
            val1 = Math.round (val1 * 100) / 100;
            set_camera_pan(val1, 0); // マウスのときは計算だけして動かさない
            $('.param_camera_pan').val(itownsCamera.getCameraPan());
            $('#camera_pan_slider').slider("value", itownsCamera.getCameraPan());
//         }
//         else {
            if (mouseTiltDir) {
               val2 = itownsCamera.getCameraTilt() - dy * ratio; 
            } else {
               val2 = itownsCamera.getCameraTilt() + dy * ratio; 
            }
            val2 = Math.round (val2 * 100) / 100;
            if (val2 < -90) val2 = -90;
            set_camera_tilt(val2, 0); // マウスのときは計算だけして動かさない
            $('.param_camera_tilt').val(itownsCamera.getCameraTilt());
            $('#camera_tilt_slider').slider("value", -1*itownsCamera.getCameraTilt());
//         }
      }
   }, false);

   /* Mouse Up */
   viewerDiv.addEventListener('mouseup', function _(e) { 
      mouseDown = false;
      mouseLeftDown = false;
      mouseRightDown = false;
     outupt_view_position();
   }, false);

   /* Mouse Out */
   viewerDiv.addEventListener('mouseout', function _(e) { 
      mouseDown = false;
      mouseLeftDown = false;
      mouseRightDown = false;
   }, false);

   /* カメラ初期値の角度を設定する */
   window.addEventListener('DOMContentLoaded', function _(e) { 
      set_camera_tilt_reset();
   }, false);
}


$('#menuDiv+div').css('z-index','-1');

//キャプチャ
$("#button_single_capture").on("click", function(){
  var fileName = $("#timeline").k2goTimeline("formatDate", $("#timeline").k2goTimeline("getOptions").currentTime, "%y%mm%dd%H%M%S.jpg")
  singleCapture(fileName);
});

$("#button_multi_capture").on("click", function() {
  $(this).toggleClass("highlight");
  let timeOpt = $("#timeline").k2goTimeline("getOptions");
  multiCapture(timeOpt.currentTime, timeOpt.currentTime, new Date(timeOpt.currentTime.getTime() + 30 * 60 * 1000), 10 * 60 * 1000,
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

// ボタンの欄にも開閉機能を追加しました
$("#open_movelink").click(function(){
  console.log("Now click open_button");
  $("#movelink_div").slideToggle(1, function() {
    var status = ($("#movelink_div").is(':hidden'));
    console.log("Current movelink_div = " + status);
    if (status) {
      $('.navbar').css('display', 'none');
      $('#movelink').css('height', '40px');
      $('#movelink').css('width', '70px');
      
    } else {
       $('#movelink').css('height', 'auto');
       $('#movelink').css('width', 'min-content');
       $('.navbar').css('display', 'flex');
    }
    if($("#open_movelink").children('i').is('.fa-minus')){
      $("#open_movelink").children('i').removeClass();
      $("#open_movelink").children('i').addClass('fa fa-plus fa-lg');
    } else {
      $("#open_movelink").children('i').removeClass();
      $("#open_movelink").children('i').addClass('fa fa-minus fa-lg');
    }
  });
});

$("#open_camera").click(function(){
  console.log("Now click open_camear");
  $("#camera_div").slideToggle(1, function() {
    var status = ($("#camera_div").is(':hidden'));
    console.log("Current camera_div = " + status);
    if (status) {
      $('#camera_param').css('height', '25px');
      $('#camera_param').css('width', '95px');
    } else {
       $('#camera_param').css('height', '280px');
       $('#camera_param').css('width', '200px');
    }
    if($("#open_camera").children('i').is('.fa-minus')){
      $("#open_camera").children('i').removeClass();
      $("#open_camera").children('i').addClass('fa fa-plus fa-lg');
    } else {
      $("#open_camera").children('i').removeClass();
      $("#open_camera").children('i').addClass('fa fa-minus fa-lg');
    }
  });
});

// 再生設定メニューの表示
$(function(){
  $('#button_conf').on('click',function(){
    $('#panel-conf').show();
    $(this).css({
      'background': 'url(test_itw/img/play_conf.svg) no-repeat center center',
      'background-size': '20px 20px'
    });

    // 再生設定メニューのカーソル移動
    $("#panel-conf").draggable({ 
      cursor: "move" 
    });

    //通常再生モードに切り替え
    $('#play-mode-normal').on('click', function() {
      if ( $Env.timeoutIdFwd ) { 
        clearTimeout($Env.timeoutIdFwd);
      };
      if ( $Env.timeoutIdBack) { 
        clearTimeout($Env.timeoutIdBack);
      };
      $(this).addClass("active");
      $Env.framePlay = false;
      $("#play-mode-span").removeClass("active");
      $("#button_play_reverse").prop('disabled', true);
      $("#form-title-play-speed-title").html("再生速度");
      $("#display2").css("display" , "grid");
      $("#display1").css("display" , "none");
      $("#play-speed-wrapper2").css("display" , "grid");
      $("#play-speed-wrapper").css("display" , "none");
      // $("#button_play").addClass("active");
      $("#button_play").removeClass("play_frame");
      $("#button_play_reverse").removeClass("play_frame_rev");

      // $("#video"   ).get(0).pause();
      // $Env.speed = 0;
      // startTimeline();

      // $("#video"   ).get(0).playbackRate = $Env.playbackRate;

      // $("#video"   ).get(0).play();
      // $('#button_play').on('click', function() {
      //   $("#button_play").addClass("active");
      //   startTimeline();
      //   console.log('通常再生');
      // });

      // $Env.speed = 1;
      // startTimeline();

      console.log("通常再生モード");
    });

    //コマ送り再生モードに切り替え
    $("#play-mode-span").on('click', function() {
      $(this).addClass("active");
      $Env.framePlay = true;
      $("#play-mode-normal").removeClass("active");
      $("#button_play_reverse").prop('disabled', false);
      $("#form-title-play-speed-title").html("再生間隔");
      $("#display2").css("display", "none");
      $("#display1").css("display", "grid");
      $("#play-speed-wrapper2").css("display", "none");
      $("#play-speed-wrapper").css("display", "grid");     
      $("#button_play").removeClass("active");
      
      $("#button_play         span").html       ("");
      // $("#button_play").addClass("play_frame");

      // $("#video"   ).get(0).pause();
      $Env.speed = 0;
      startTimeline();
      // $Env.speed = 0;
      // $Env.starting = false;
      // $("#lockWindow").removeClass("show");
      
      // if ($Env.framePlayBack) {
      //   $("#button_play_reverse").addClass("play_frame_rev");
      //   $("#button_play").removeClass("active");
      //   $("#button_play").removeClass("play_frame");
      //   framePlayBack(); 
      // } else {
      //   $("#button_play_reverse").removeClass("play_frame_rev");
      //   $("#button_play").removeClass("active");
      //   $("#button_play").addClass("play_frame");
      //   framePlayFwd(); 
      // }
      
      console.log("コマ送り再生モード");
    });
    
    return false;
  });

  // 再生設定メニューの非表示
  $('#panel-conf-close').on('click',function(){
    $('#panel-conf').hide();
    $('#button_conf').css({
      'background': 'url(test_itw/img/play_conf_yellow.svg) no-repeat center center',
      'background-size': '20px 20px'
    });
    return false;
  });
  
});

//再生ボタンと連動
// $('#button_play').on('click', function() {

//   //追加
//   // if($('#form-title-play-speed-title').text().indexOf('再生間隔') != -1) {
//   //   $('#button_play').addClass('play_frame');
//   //   $("#button_play_reverse").removeClass("play_frame_rev");
//   //   clearTimeout($Env.timeoutIdBack);
//   //   framePlayFwd();
//   //   console.log('コマ再生');
//   // }

// });

//停止ボタン処理
$('#button_stop').on('click', function() {
  $("#button_play").removeClass("play_frame");
  $("#button_play").removeClass("active");
  $("#button_play_reverse").removeClass("play_frame_rev");
  // if ($Env.framePlay) {
  //   clearTimeout($Env.timeoutIdFwd);
  //   clearTimeout($Env.timeoutIdBack);
  // } else {
  //   clearTimeout($Env.timeoutIdFwd);
  // };
  clearTimeout($Env.timeoutIdFwd);
  clearTimeout($Env.timeoutIdBack);
  console.log("CLICK!! STOP!!");
});

//逆再生ボタン処理
// $('#button_play_reverse').on('click', function() {
//   // $video.pause();
//   // $Env.speed = 0;
//   // startTimeline();

//   if ($Env.framePlay) {
//     clearTimeout($Env.timeoutIdFwd);
//     $Env.framePlayBack = true;
//     console.log("逆コマ再生");
//     $("#button_play").removeClass("play_frame");
//     $("#button_play_reverse").addClass("play_frame_rev");
//     framePlayBack();
//     console.log("CLICK!! 逆再生!!");
//   }
// });

//再生速度の数値がレンジスライダーと同時に変動
$('#play-speed2').on('input change', function () {
  var calcTime = makeTime($Env.playTable[ $(this).val() - 1 ] * 60);
  $('#display2').html("x" + $Env.playTable[ $(this).val() - 1 ] + " (" + calcTime + "/sec)");
  // $Env.playbackRate = $Env.playTable[ $(this).val() - 1 ];
  $Env.speed = $Env.playTable[ $(this).val() - 1 ];
  if($('#button_play').hasClass('active')) {
    startTimeline();
  }
});

//再生間隔の数値がレンジスライダーと同時に変動
$('#play-speed').on('input change', function () {
  $('#display1').html($(this).val() + "sec");
  $Env.playInterval = $(this).val();
  clearTimeout($Env.timeoutIdFwd);
  clearTimeout($Env.timeoutIdBack);
  if($('#button_play').hasClass('play_frame')) {
    framePlayFwd();
  }
});

//コマ送り間隔の数値がレンジスライダーと同時に変動
$('#play-span').on('input change', function () {
  $('#frame').html( $(this).val() + 'f');
  $('#time').html( makeTime(Math.round($(this).val() * 60)) );
  $Env.frameInterval = Math.round($(this).val());
});

$('#camera_vfov_slider').slider("value", itownsCamera.getCameraVFov());
$('#camera_tilt_slider').slider("value", -1 * itownsCamera.getCameraTilt()); /* Tilt スライダは反転させているので */
$('#camera_pan_slider').slider("value", itownsCamera.getCameraPan());


      setMouseEvent();




    //要素の取得
    var elements = document.getElementsByClassName("drag-and-drop");

    //要素内のクリックされた位置を取得するグローバル（のような）変数
    var x;
    var y;

    //マウスが要素内で押されたとき、又はタッチされたとき発火
    for(var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("mousedown", mdown, false);
        elements[i].addEventListener("touchstart", mdown, false);
    }

    //マウスが押された際の関数
    function mdown(e) {

        //クラス名に .drag を追加
        this.classList.add("drag");

        //タッチデイベントとマウスのイベントの差異を吸収
        if(e.type === "mousedown") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        //要素内の相対座標を取得
        x = event.pageX - this.offsetLeft;
        y = event.pageY - this.offsetTop;

        //ムーブイベントにコールバック
        document.body.addEventListener("mousemove", mmove, false);
        document.body.addEventListener("touchmove", mmove, false);
    }

    //マウスカーソルが動いたときに発火
    function mmove(e) {

        //ドラッグしている要素を取得
        var drag = document.getElementsByClassName("drag")[0];

        //同様にマウスとタッチの差異を吸収
        if(e.type === "mousemove") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        //フリックしたときに画面を動かさないようにデフォルト動作を抑制
        e.preventDefault();

        //マウスが動いた場所に要素を動かす
        drag.style.top = event.pageY - y + "px";
        drag.style.left = event.pageX - x + "px";

        //マウスボタンが離されたとき、またはカーソルが外れたとき発火
        drag.addEventListener("mouseup", mup, false);
        document.body.addEventListener("mouseleave", mup, false);
        drag.addEventListener("touchend", mup, false);
        document.body.addEventListener("touchleave", mup, false);

    }

    //マウスボタンが上がったら発火
    function mup(e) {
        var drag = document.getElementsByClassName("drag")[0];

        //ムーブベントハンドラの消去
        document.body.removeEventListener("mousemove", mmove, false);
        drag.removeEventListener("mouseup", mup, false);
        document.body.removeEventListener("touchmove", mmove, false);
        drag.removeEventListener("touchend", mup, false);

        //クラス名 .drag も消す
        drag.classList.remove("drag");
    }


