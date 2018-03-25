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
            if (gps.GPSLatitude) {
              const latitude = gps.GPSLatitude[0] + gps.GPSLatitude[1] / 60;
              const longitude = gps.GPSLongitude[0] + gps.GPSLongitude[1] / 60;
              list.push({file, latitude, longitude});
            }

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
    const border = await Jimp.read('./assets/border.png');

    fileList.map(
      async (file) => {
        const lenna = await Jimp.read(`${SOURCE_DIR}/${file}`);

        lenna.quality(80);

        const outputMedium = `${OUTPUT_DIR}/medium/${file}`;
        const outputSmall = `${OUTPUT_DIR}/small/${file}`;
        const outputThumb = `${OUTPUT_DIR}/thumbs/${file}`;

        if (fs.existsSync(outputMedium) === false) {
          lenna.cover(1024, 1024 * 3 / 4) // resize
            .write(outputMedium); // save
        }

        if (fs.existsSync(outputSmall) === false) {
          lenna.cover(512, 512 * 3 / 4) // resize
            .write(outputSmall); // save
        }

        if (fs.existsSync(outputThumb) === false) {
          lenna.cover(128, 128) // resize
            .write(outputThumb); // save
        }


      });


  }

}







