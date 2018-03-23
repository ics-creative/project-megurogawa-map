const fs = require('fs');
const ExifImage = require('exif').ExifImage;
const Jimp = require('jimp');

const SOURCE_DIR = './images';
const OUTPUT_DIR = '../docs/data';
const files = fs.readdirSync(SOURCE_DIR);

// 拡張子で念の為絞り込む
const fileList = files.filter((file) => /.*\.jpg/.test(file));

load();

async function load() {

  // ===================================
  // GPSの分析処理
  // ===================================
  {
    const list = [];

    const load = fileList.map((file) => {

      return new Promise(resolve => {
        new ExifImage({image: `${SOURCE_DIR}/${file}`}, (error, exifData) => {
          if (error)
            console.log('Error: ' + error.message);
          else {
            // console.log(exifData); // Do something with your data!
            const gps = exifData.gps;

            // 139 + ( 41 ÷ 60 ) + ( 30.3 ÷ 60 ÷ 60 )
            const latitude = gps.GPSLatitude[0] + gps.GPSLatitude[1] / 60;
            const longitude = gps.GPSLongitude[0] + gps.GPSLongitude[1] / 60;
            list.push({file, latitude, longitude});
            resolve();
          }

        });
      });
    });

    await Promise.all(load);
    const jsonString = JSON.stringify(list);

    fs.writeFileSync(`${OUTPUT_DIR}/data.json`, jsonString);
  }

  // ===================================
  // 画像の縮小処理
  // ===================================
  {
    fileList.map(
      (file) => Jimp.read(`${SOURCE_DIR}/${file}`)
        .then((lenna) => {

          lenna.quality(90);

          lenna.cover(1024, 1024 * 3 / 4) // resize
            .write(`${OUTPUT_DIR}/medium/${file}`); // save

          lenna.cover(512, 512 * 3 / 4) // resize
            .write(`${OUTPUT_DIR}/small/${file}`); // save

          lenna.cover(256, 256) // resize
            .write(`${OUTPUT_DIR}/thumbs/${file}`); // save


        }).catch((err) => {
          console.error(err);
        }));
  }

}







