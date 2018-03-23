var fs = require('fs');
var ExifImage = require('exif').ExifImage;

const dir = './images';
var files = fs.readdirSync(dir);

var fileList = files.filter(function (file) {
  return /.*\.jpg/.test(file); //絞り込み
});



load();
async function load(){

  const list = [];

  const load = fileList.map((file) => {


    return new Promise(resolve => {
      new ExifImage({image: `${dir}/${file}`}, function (error, exifData) {
        if (error)
          console.log('Error: ' + error.message);
        else {
          // console.log(exifData); // Do something with your data!
          const gps = exifData.gps;

          // 139 + ( 41 ÷ 60 ) + ( 30.3 ÷ 60 ÷ 60 )
          const latitude = gps.GPSLatitude[0] + gps.GPSLatitude[1] / 60;
          const longitude = gps.GPSLongitude[0] + gps.GPSLongitude[1] / 60;
          list.push({file, latitude, longitude});

          //35.6605482,139.7113635,14z

          // 35°38'2.154" N 139°42'38.79" E

          resolve();

          // 35.634237, 139.710700
        }

      });
    });


  });

  await Promise.all(load)
  console.log(JSON.stringify(list));
}


