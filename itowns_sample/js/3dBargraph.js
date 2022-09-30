/**
 * Copyright (c) 2016-2018 Research Institute for Information Technology(RIIT), Kyushu University. All rights reserved.
 * Copyright (c) 2016-2018 RIKEN Center for Computational Science. All rights reserved.
 * Copyright (c) 2021 National Institute of Information and Communications Technology (NICT).  All rights reserved.
 */
//import Papa from './test/papaparse.min.js'
//import Encoding from './test/encoding.min.js'
//import Rainbow from './test/colormap.js'
//import ExprEval from './test/expr-eval.js'

/**
 * 汎用csvパーサーを,fileSourceに設定する.
 * @param {*} fileSource 
 */
function createCSVBargraphSource(itownsView, config) {
  function checkResponse(response) {
    if (!response.ok) {
      let error = new Error(`Error loading ${response.url}: status ${response.status}`);
      error.response = response;
      throw error;
    }
  }
  function fetchJSON(url, options = {}) {
    return fetch(url, options).then((response) => {
      checkResponse(response);
      return response.json();
    });
  }
  
  const arrayBuffer = (url, options = {}) => fetch(url, options).then((response) => {
    checkResponse(response);
    return response.arrayBuffer();
  });
  const bargraphSource = new itowns.FileSource({
    url: config.url,
    jsonurl: config.jsonurl ? config.jsonurl : null,
    crs: 'EPSG:4326',
    // コンストラクタでfetcherが使用され、結果がfetchedDataに入る.
    fetcher: (url, options = {}) => {
      return arrayBuffer(url, options).then((buffer) => {
        return buffer;
      });
    },
    // 後ほど（タイミングはよくわからない）, parserが使用され、返り値はFileSourceがcacheする
    parser: (buffer, options = {}) => {
      let data = new Uint8Array(buffer);
      let converted = Encoding.convert(data, {
        to: 'UNICODE',
        from: 'AUTO'
      });
      let str = Encoding.codeToString(converted);
      let parsed = Papa.parse(str);

      // 初回パース時にジオメトリを生成しておく
      let group = new itowns.THREE.Group();

      for (let i = 1; i < parsed.data.length; ++i) {
        if (parsed.data[i].length !== parsed.data[0].length) continue;
        // const material = new itowns.THREE.({ color: 0x5555ff });
        let material = new itowns.THREE.MeshToonMaterial({ color: 0x5555ff });
        if (itownsView.isPlanarView) {
          material = new itowns.THREE.MeshBasicMaterial({ color: 0x5555ff });
        }
        material.opacity = 1.0;
        const geo = new itowns.THREE.BoxGeometry(1, 1, 1);
        geo.translate(0, 0, -0.5);
        const mesh = new itowns.THREE.Mesh(geo, material);;
        mesh.scale.set(1, 1, 1);
        mesh.lookAt(0, 0, 0);
        mesh.updateMatrixWorld();
        mesh.CSVIndex = i;
        mesh.visible = false;
        group.add(mesh);
      }

      const jsonKeyToParamKey = {
        'Time' : 'time',
        'Longitude' : 'lon',
        'Latitude' : 'lat',
        'Physical1' : 'physical1',
        'Physical2' : 'physical2',
      };

      if (config.jsonurl) {
        return new Promise(resolve => {
          try {
            fetchJSON(config.jsonurl).then(data => {
              let csvKeys = parsed.data[0];
              let params = {};
              for (let jsonKey in jsonKeyToParamKey) {
                if (data.hasOwnProperty(jsonKey)) {
                  const jsonVal = data[jsonKey];
                  const paramKey = jsonKeyToParamKey[jsonKey];
                  let isFoundKey = false;
                  for (let i = 0; i < csvKeys.length; ++i) {
                    if (csvKeys[i] === jsonVal) {
                      params[paramKey] = i;
                      isFoundKey = true;
                      break;
                    }
                  }
                  if (!isFoundKey && paramKey === 'physical1') {
                    params['physical1'] = 'Custom';
                    params['physical1Expr'] = jsonVal;
                  }
                  if (!isFoundKey && paramKey === 'physical2') {
                    params['physical2'] = 'Custom';
                    params['physical2Expr'] = jsonVal;
                  }
                }
              }
              resolve({
                initialBargraphParams : params,
                csv: parsed,
                meshGroup: group
              });
            });
            return;
          } catch(err) {
            console.error(err);
          }
          resolve({
            csv: parsed,
            meshGroup: group
          });
        });
      }

      return Promise.resolve({
        csv: parsed,
        meshGroup: groupparams
      });
    }
  });
  return bargraphSource;
}

function createDBBargraphSource(itownsView, config) {
  function checkResponse(response) {
    if (!response.ok) {
      let error = new Error(`Error loading ${response.url}: status ${response.status}`);
      error.response = response;
      throw error;
    }
  }
  function fetchJSON(url, options = {}) {
    return fetch(url, options).then((response) => {
      checkResponse(response);
      return response.json();
    });
  }
  
  const arrayBuffer = (url, options = {}) => fetch(url, options).then((response) => {
    checkResponse(response);
    return response.arrayBuffer();
  });
  const bargraphSource = new itowns.FileSource({
    url: config.url,
    jsonurl: config.jsonurl ? config.jsonurl : null,
    crs: 'EPSG:4326',
    // コンストラクタでfetcherが使用され、結果がfetchedDataに入る.
    fetcher: (url, options = {}) => {
      return arrayBuffer(url, options).then((buffer) => {
        return buffer;
      });
    },
    // 後ほど（タイミングはよくわからない）, parserが使用され、返り値はFileSourceがcacheする
    parser: (buffer, options = {}) => {
      let data = new Uint8Array(buffer);
      let converted = Encoding.convert(data, {
        to: 'UNICODE',
        from: 'AUTO'
      });
      let str = Encoding.codeToString(converted);
      let temp_parsed = JSON.parse(str);

      // csvに似せて加工
      let str2 = 'name,lat,lon,precipitation24h,altitude\n';
      for (let j = 0; j < temp_parsed.features.length; ++j) {
        str2 = str2 + temp_parsed.features[j].properties.kjName + ',';
        str2 = str2 + temp_parsed.features[j].geometry.coordinates[1] + ',';
        str2 = str2 + temp_parsed.features[j].geometry.coordinates[0] + ',';
        str2 = str2 + temp_parsed.features[j].properties.precipitation24h + ',';
        str2 = str2 + temp_parsed.features[j].properties.altitude + '\n';
      }

      let parsed = Papa.parse(str2);

      // 初回パース時にジオメトリを生成しておく
      let group = new itowns.THREE.Group();

      for (let i = 0; i < parsed.data.length; ++i) {
        if (parsed.data[i].length !== parsed.data[0].length) continue;
        // const material = new itowns.THREE.({ color: 0x5555ff });
        let material = new itowns.THREE.MeshToonMaterial({ color: 0x5555ff });
        if (itownsView.isPlanarView) {
          material = new itowns.THREE.MeshBasicMaterial({ color: 0x5555ff });
        }
        material.opacity = 1.0;
        const geo = new itowns.THREE.CylinderGeometry( 2, 2, 1, 32 );
        geo.translate(0, 0, -0.5);
        geo.rotateX(Math.PI/2);
        const mesh = new itowns.THREE.Mesh(geo, material);
        mesh.scale.set(1, 1, 1);
        mesh.lookAt(0, 0, 0);
        mesh.updateMatrixWorld();
        mesh.CSVIndex = i;
        mesh.visible = false;
        group.add(mesh);
      }

      let params = {};
      params["lat"] = 1;//features[0].geometry.coordinates[1]
      params["lon"] = 2;//features[0].geometry.coordinates[0]
      params["physical1"] = 3;//features[0].properties.precipitation24h
      params["physical2"] = 4;//features[0].properties.precipitation24h

      return Promise.resolve({
        initialBargraphParams : params,
        csv: parsed,
        meshGroup: group
      });
    }
  });
  return bargraphSource;
}

class ColorMap 
{
  constructor() {
    this.map = colormap({
      colormap: 'jet',
      nshades: 1000,
      format: 'hex',
      alpha: 1
    })
    console.log(this.map)
  }

  setNumberRange(numMin, numMax) {
    this.numMin = numMin;
    this.numMax = numMax;
  }
  
  getColorAt(number) {
    let num = number;
    if (num < this.minNum) {
      num = this.minNum;
    }
    if (num > this.maxNum) {
      num = this.maxNum;
    } 
    const len = (this.numMax - this.numMin);
    const p = (num - this.numMin);
    const ratio = p / len;
    const index = Math.max(0, Math.min(999, Math.floor(ratio * 1000)));
    return this.map[index].split('#').join('');
  }

}
function getAmedasColorAt(number) {
    let num = number;
    let color = "";
    if (num == 0) {
      color = "808080";
    } else if (0 < num && num < 4.0) {
      color = "00bfff";
    } else if (4.0 <= num && num < 16.0) {
      color = "0000ff";
    } else if (16.0 <= num && num < 32.0) {
      color = "ffff00";
    } else {
      color = "ff0000";
    }
    return color;
  }


function CreateBargraphLayer(itownsView, config, num=0) {
  class BarGraphLayer extends itowns.GeometryLayer {
    constructor(itownsView, config) {
      const group = new itowns.THREE.Group();
//      console.log("CreateBargraphLayer");
      if (config.bool_geojson) {
        var bargraphSource = createDBBargraphSource(itownsView, config);
      } else {
        var bargraphSource = createCSVBargraphSource(itownsView, config);
      }

//      console.log("bargraphSource");
//      console.log(bargraphSource);

      bargraphSource.jsonurl = config.jsonurl;
      super(config.id, group, {
        source: bargraphSource
      });
      this.group = group;
      this.source = bargraphSource;

      this.itownsView = itownsView;

      this.BarGraphExtent = new itowns.Extent('EPSG:4326', 0, 0, 0);

      this.colormap = new ColorMap();

      //this.exprParser = new ExprEval.Parser();

      // chowder側で判別できるようにフラグを設定
      this.isBarGraph = true;

      this.updateBarGraph = this.updateBarGraph.bind(this);

      // visibleの変更
//      this.defineLayerProperty('visible', this.visible || true, this.updateBarGraph);

      this.defineLayerProperty('scale', this.scale || 1.0, this.updateBarGraph);
      this.defineLayerProperty('size', this.size || 5, this.updateBarGraph);
      this.defineLayerProperty('bargraphParams', {}, this.updateBarGraph);
    }

    update(context, layer, node) { }

    preUpdate(context, changeSources) {
      this.source.loadData(this.BarGraphExtent, this).then((data) => {
//        console.log("preUpdate changeSources ", changeSources);   
        if (!data) {
          console.error("Not found bargraph datasource");
        }
        if (!this.group.getObjectById(data.meshGroup.id)) {
//          console.log("add mesh group", data);
          this.group.add(data.meshGroup);
          // wireframeやopacityの変更に対応するにはこれが必要
          for (let i = 0; i < data.meshGroup.children.length; ++i) {
            data.meshGroup.children[i].layer = this;
          }
        }
	this.itownsView.notifyChange();
      });
    }

    convert() { }

    /**
     * 
     * @param {*} csvData csvのパース済全データ
     * @param {*} csvIndex 計算対象のcsvIndex(行インデックス)
     */
    convertPhisicalValueByExpr(exprStr, csvData, csvIndex) {
      let expr = Parser.parse(exprStr);
      // 全ての列名と、CSVIndexでの値を設定する
      let currentValues = {};
      for (let k = 0; k < csvData[0].length; ++k) {
        currentValues[csvData[0][k]] = csvData[csvIndex][k];
      }
      const value = expr.evaluate(currentValues);
      return value;
    }

    /*
     layer.bargraphParam = {
       lon : 1,
       lat : 2,
       time : 3,
       physical1 : 4,
       physical2 : 5,
     }
     のようなchowder泥漿するパラメータを元にメッシュを更新する
    */
    updateBarGraph() {
//      console.log("updateBarGraph");
      if (!this.hasOwnProperty('bargraphParams')) {
        console.log("!this.hasOwnProperty(bargraphParams)");
        return;
      }
      //ここで必要があれば最パース
      if (!this.source._featuresCaches[this.itownsView.referenceCrs]){
        features = this.source.parser(this.source.fetchedData, {});
        this.source._featuresCaches[this.itownsView.referenceCrs].setByArray(features, [0]);
//        console.error("No cache Error");
//        return;
//        let features = this.source.parser(this.source.fetchedData, {});
//        this.source._featuresCaches[this.itownsView.referenceCrs] = new itowns.Cache();
//        this.source._featuresCaches[this.itownsView.referenceCrs].setByArray(features, [0]);
      }


//      console.log(this.crs);
      this.source.loadData(this.BarGraphExtent, this).then((data) => {
//        console.log("data");
//        console.log(data);

        let params = null;
        if (data.hasOwnProperty('initialBargraphParams')) {
          this.initialBargraphParams = data.initialBargraphParams;
          params = JSON.parse(JSON.stringify(this.initialBargraphParams));
        }
        if (!params) {
          params = this.bargraphParams;
        } else {
          for (let key in this.bargraphParams) {
            params[key] = this.bargraphParams[key];
          }
        }
        const csvData = data.csv.data;
        
        // keyがparamsにある場合のみvalueを返す、ない場合は空文字を返す
        function getValIfExist(params, key) {
          if (key.length == 0 || !params.hasOwnProperty(key)) {
            return "";
          }
          return params[key]
        }
        // 正しいインデックスかどうか
        function isValidIndex(index, array) {
          return Number.isInteger(index) && index >= 0 && index < array.length;
        }
        const lonIndex = getValIfExist(params, 'lon');
        const latIndex = getValIfExist(params, 'lat');
        const timeIndex = getValIfExist(params, 'time');
        const physicalVal1Index = getValIfExist(params, 'physical1');
        const physicalVal2Index = getValIfExist(params, 'physical2');
        const physical1Expr = getValIfExist(params, 'physical1Expr');
        const physical2Expr = getValIfExist(params, 'physical2Expr');

//        if(!this.visible){
//            for (let i = 0; i < data.meshGroup.children.length; ++i) {
//                const mesh = data.meshGroup.children[i];
//                mesh.visible = false;
//                mesh.updateMatrixWorld();
//            }
//            return;
//        }

        // 色を付けるために値(PhysicalVal2)の範囲を求める
        let physicalVal2Range = { min: +Infinity, max: -Infinity }
        for (let i = 0; i < data.meshGroup.children.length; ++i) {
          const mesh = data.meshGroup.children[i];
          const isValidPhysical2Index = isValidIndex(physicalVal2Index, csvData[mesh.CSVIndex]);
          let physical2Val = Number(csvData[mesh.CSVIndex][physicalVal2Index]);
//console.log("===========physical2Val=" + physical2Val);
          if (physical2Expr.length > 0) {
            physical2Val = this.convertPhisicalValueByExpr(physical2Expr, csvData, mesh.CSVIndex);
          }
          if (isNaN(physical2Val)) {
            physical2Val = 0.0;
          }
          physicalVal2Range.min = Math.min(physicalVal2Range.min, physical2Val);
          physicalVal2Range.max = Math.max(physicalVal2Range.max, physical2Val);
        }
        if (physicalVal2Range.min !== physicalVal2Range.max) {
          this.colormap.setNumberRange(physicalVal2Range.min, physicalVal2Range.max);
        }
        // 全メッシュにposition/scale/colorを設定して更新
        for (let i = 0; i < data.meshGroup.children.length; ++i) {
          const mesh = data.meshGroup.children[i];
          let isValidLonIndex = isValidIndex(lonIndex, csvData[i]);
          let isValidLatIndex = isValidIndex(latIndex, csvData[i]);
          let isValidTimeIndex = isValidIndex(timeIndex, csvData[i]);
          const isValidPhysical1Index = isValidIndex(physicalVal1Index, csvData[mesh.CSVIndex]);
          const isValidPhysical2Index = isValidIndex(physicalVal2Index, csvData[mesh.CSVIndex]);

          // Lon/Latを求める
          let lonlat = {
            "lon": isValidLonIndex ? Number(csvData[i][lonIndex]) : 0,
            "lat": isValidLatIndex ? Number(csvData[i][latIndex]) : 0,
          };
          if (isNaN(lonlat.lon)) {
            lonlat.lon = 0;
            isValidLonIndex = false;
          }
          if (isNaN(lonlat.lat)) {
            lonlat.lat = 0;
            isValidLatIndex = false;
          }
//console.log("===========lonlat.lon=" + lonlat.lon);
//console.log("===========lonlat.lat=" + lonlat.lat);
          if (num==2) { // blue
          } else if  (num==3) { // red
            lonlat.lon = lonlat.lon + (0.001);
            lonlat.lat = lonlat.lat - (0.001);
          } else if  (num==4) { //yellow
            lonlat.lon = lonlat.lon - (0.001);
            lonlat.lat = lonlat.lat + (0.001);
          }

// iTowns表示の際色を先に決め
// 次にDEMの高さを考慮してcoordを決め
// 最後に高さを決めるため順番を変更する

//          let physical1Val = isValidPhysical1Index ? Number(csvData[mesh.CSVIndex][physicalVal1Index]) * 100 * this.scale  : 1.0;
//          let physical2Val = Number(csvData[mesh.CSVIndex][physicalVal2Index]);
          let physical1Val = isValidPhysical1Index ? Number(csvData[mesh.CSVIndex][physicalVal1Index]) : 1.0;
          let physical2Val = Number(csvData[mesh.CSVIndex][physicalVal2Index]);

          if (physical2Expr.length > 0) {
            physical2Val = this.convertPhisicalValueByExpr(physical2Expr, csvData, mesh.CSVIndex);
          }
          if (isNaN(physical2Val)) {
            physical2Val = 0.0;
          }
          // physical2valからmeshの色を割り出す
          const color = this.colormap.getColorAt(physical2Val);
          if (num==2) { // blue
            mesh.material.color.setHex("0x0000FF");
          } else if  (num==3) { // red
            mesh.material.color.setHex("0xFF0000");
          } else if  (num==4) { //yellow
            mesh.material.color.setHex("0xFFFF00");
          } else if  (num==5) { //amedas
            mesh.material.color.setHex("0x" + getAmedasColorAt(physical1Val));
          } else {
            mesh.material.color.setHex("0x" + color);
          }


          // Lon/Latからmeshのpositionを割り出す
          var coord_z = 45;
          // 再取得
          physical1Val = isValidPhysical1Index ? Number(csvData[mesh.CSVIndex][physicalVal1Index]) * 100 * this.scale  : 1.0;
          // physical1valからmeshのscaleを割り出す
          if (physical1Expr.length > 0) {
            physical1Val = this.convertPhisicalValueByExpr(physical1Expr, csvData, mesh.CSVIndex) * 100 * this.scale;
          }
          if (num==5) { //アメダスの円柱のZ座標を調整（円柱の真ん中を軸に回転するため、高さの半分を足す）
            coord_z = physical2Val + (physical1Val / 2);
          }
          const position = { longitude: lonlat.lon, latitude: lonlat.lat, altitude: coord_z};
          const coord = new itowns.Coordinates('EPSG:4326', position.longitude, position.latitude, position.altitude);
          if (num==2 || num==3 || num==4) {
//console.log("===========this.scale=" + this.scale);
            physical1Val = physical1Val / 50000 * this.scale;
          } else if (num==5) {
            physical1Val = (physical1Val == 0) ? 1 : physical1Val;
          }

//console.log("===========physical1Val=" + physical1Val);
          const scaleZ = physical1Val;

          let barScale = 1.0;
          let cameraRange = itowns.CameraUtils.getTransformCameraLookingAtTarget(this.itownsView, this.itownsView.camera.camera3D).range;
          if(cameraRange){
            //barScale = Math.floor(cameraRange / 10000) + 1.0; 
            barScale = (cameraRange / 10000) + 1.0; 
          }

          if (this.itownsView.isPlanarView) {
            mesh.scale.set(this.size * barScale * 5, this.size * barScale * 5, -scaleZ);
          } else {
            mesh.scale.set(this.size * barScale * 5, this.size * barScale * 5, scaleZ);
          }

          mesh.position.copy(coord.as(this.itownsView.referenceCrs))
          if (!this.itownsView.isPlanarView) {
            const zeroCoord = new itowns.Coordinates('EPSG:4978', 0, 0, 0);
            const zeroVector = zeroCoord.as(this.itownsView.referenceCrs);
            mesh.lookAt(new itowns.THREE.Vector3(zeroVector.x, zeroVector.y, zeroVector.z));
          }
          mesh.visible = (isValidLonIndex && isValidLatIndex);
//          console.log(mesh);
          /*
          if (mesh.visible && isValidTimeIndex && this.currentDate) {
            // meshが可視の場合で、かつ時刻が設定されている場合、
            // 現在時刻と時刻を比較し、visibleを上書きする
            const date = new Date(csvData[i][timeIndex]);
            if (date.getTime() <= this.currentDate.getTime()) {
              mesh.visible = true;
            } else {
              mesh.visible = false;
            }
            
            if (this.range) {
              // 現在時刻がレンジ範囲外なら非表示とする
              if (this.currentDate< this.range.rangeStartTime
                || this.currentDate > this.range.rangeEndTime) {
                  mesh.visible = false;
              }
              // データ時刻がレンジ範囲外なら非表示とする
              if (date.getTime() < this.range.rangeStartTime
                || date.getTime() > this.range.rangeEndTime) {
                  mesh.visible = false;
              }
            }
          }
          */
          mesh.updateMatrixWorld();
        }
      });
    }
    
    updateByTime(currentDate = null, range = null) {
      this.currentDate = currentDate;
      this.range = range;
      this.updateBarGraph(currentDate);
    }
  }
  return new BarGraphLayer(itownsView, config);
}

// 実行時にPreset側で読みこんだitowns.jsを使いたいため
// この時点でitownsのクラスを露出せず、生成関数をエクスポートする
//export default CreateBargraphLayer;
