print ("Use inspector tools to find out how many months water is present for a specific pixel")
function processPeriod(startyear,startmonth,startdate,endyear,endmonth,enddate,tabletouse){
  function monthlylayer(D1,D2,t){
    var focal_filter_distance=50
    var collection = ee.ImageCollection("COPERNICUS/S1_GRD")
        .filterDate(D1, D2)
        .filterBounds(t)
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
        .filter(ee.Filter.eq('instrumentMode', 'IW'))
        .filterMetadata('resolution_meters', 'equals', 10);

    // Filter speckle noise
    var filterSpeckles = function(img) {
      var vv = img.select('VV') //select the VV polarization band
      var vv_smoothed = vv.focal_median(50,'circle','meters').rename('VV_Filtered') //Apply a focal median filter
      var vh = img.select('VH') //select the VV polarization band
      var vh_smoothed = vh.focal_median(50,'circle','meters').rename('VH_Filtered') //Apply a focal median filter
      img = img.addBands(vv_smoothed) // Add filtered VV band to original image
      return img.addBands(vh_smoothed)
    }

    // Map speckle noise filter across collection. Result is same collection, with smoothed VV band added to each image
    var S1 = collection.map(filterSpeckles)

    //Add speckle filtered image to map to sompare with raw SAR image
    // Map.addLayer(S1.first(),{bands: 'VV',min: -25, max: 18}, 'VH')
    // Map.addLayer(S1.first(),{bands: 'VH',min: -25, max: 18}, 'VV')
    // Map.addLayer(S1.first(),{bands: 'VV_Filtered',min: -25, max: 18}, 'Filtered VH image'+D1)
    // Map.addLayer(S1.first(),{bands: 'VH_Filtered',min: -25, max: 18}, 'Filtered VV image'+D1)
    // Reduce the collection by taking the median.
    var median = S1.min();
    // Map.addLayer(median,{bands: 'VV_Filtered',min: -30, max: 18}, 'Filtered VH image'+D1)
    // Map.addLayer(median,{bands: 'VH_Filtered',min: -30, max: 18}, 'Filtered VV image'+D1)

    // Clip to the output image to the ROI boundaries.
    var clipped = median.clipToCollection(t);


    // var visParams = {bands: ['B8', 'B4', 'B3'], min: 0,
    //   max: 5000,
    //   gamma: [1, 1, 1]
    // };

    var median_vv= clipped.select('VV_Filtered')
    var median_vh= clipped.select('VH_Filtered')

    var vv_th = median_vv.lt(-19)
      .selfMask()
      .rename('vv_th');
    var vh_th = median_vh.lt(-17)
      .selfMask()
      .rename('vh_th');
    var water = vv_th.multiply(vh_th)
      .selfMask()
      .rename('water');

    // Display the water layers on the Map.
    // Map.addLayer(water, {palette: '0000FF'}, 'water');
    return water
  }
  var firstDayS = startyear+'-'+startmonth+'-'+startdate;
  var lastDayS = endyear+'-'+endmonth+'-'+enddate;
  print (firstDayS,lastDayS)
  var waterCollection =  ee.ImageCollection.fromImages([monthlylayer(firstDayS,lastDayS,tabletouse)])
  return waterCollection
}
// buffer size in meters
var buffersize=200000
// location coordinates around which the buffer will be calculated
var lon= 77.9972
var lat= 16.74166
var polygon = ee.FeatureCollection(ee.Geometry.Point([lon, lat]).buffer(buffersize));
var tabletouse=polygon
// provide the date range for the process
var period1_startyear=2021
var period1_startmonth=5
var period1_startday=20
var period1_endyear=2021
var period1_endmonth=6
var period1_endday=10

var period2_startyear=2021
var period2_startmonth=6
var period2_startday=10
var period2_endyear=2021
var period2_endmonth=6
var period2_endday=21

var water_period1=processPeriod(period1_startyear,period1_startmonth,period1_startday,period1_endyear,period1_endmonth,period1_endday,tabletouse)

var sum_period1 = water_period1.reduce(ee.Reducer.sum());
Map.setCenter(lon, lat, 14);
var max_num_water = sum_period1.reduceRegion({reducer: ee.Reducer.max(), geometry: tabletouse, scale : 1000});

var sum1_period1 = sum_period1.where(sum_period1.gt(0), -1)
Map.addLayer(sum_period1, {palette: 'F000FF'}, "sum1_period1");
var water_period2=processPeriod(period2_startyear,period2_startmonth,period2_startday,period2_endyear,period2_endmonth,period2_endday,tabletouse)

var sum_period2 = water_period2.reduce(ee.Reducer.sum());
var max_num_water = sum_period2.reduceRegion({reducer: ee.Reducer.max(), geometry: tabletouse, scale : 1000});

Map.addLayer(sum_period2, {palette: 'FFF000'}, "sum1_period2");
var changelayer = sum1_period1.unmask().float().add(sum_period2.unmask().float())
Map.addLayer(changelayer.updateMask(changelayer.neq(0)), {palette: ['F00000', '000FFF']}, "Change Layer");
