import Vue from 'vue';

const isMobile = matchMedia('(max-width : 640px)').matches;

const createInfoContent = (file) => {

  const w = isMobile ? 160 : 320;
  const h = w * 3 / 4;

  return `
          <div class="sample">
            <picture>
              <source media="(max-width: 640px)" srcset="${getImageUrl(file, 'small')}">
              <img src="${getImageUrl(file, 'medium')}" 
                width="${w}" height="${h}"
                class="app-map__info-img" />
            </picture>
          </div>`;
};

const cacheClearPostfix = `?cc=1`;
const getImageUrl = (fileName, size) => `data/${size}/${fileName}${cacheClearPostfix}`;
const getJsonUrl = () => `data/data.json${cacheClearPostfix}`;

export async function initMap() {

  const dataList = await (await fetch(getJsonUrl())).json();

  const features = dataList.map(value => {
    return {
      position: new google.maps.LatLng(value.latitude, value.longitude),
      file: value.file,
    };
  });

  new Vue({
    el: '#app',
    template: `
      <div class="app">
        <header class="app-header"><h1>🌸 目黒川 桜マップ</h1></header>
        <div class="app-map" id="map"></div>
        <div class="app-list">
          <button v-for="item in items"
                  class="app-list-item"
                  v-on:click="select(item)">
            <img v-bind:src="'data/thumbs/' + item.file + '?cc=1'" />
          </button>
        </div>
      </div>`,
    data: {
      items: features
    },
    methods: {
      select(markerData) {
        infoWindow.setContent(createInfoContent(markerData.file));
        infoWindow.open(map); // 吹き出しの表示
        infoWindow.setPosition(markerData.position);
      }
    }
  });

  const infoWindow = new google.maps.InfoWindow({ // 吹き出しの追加

  });

  // Google Map

  map = window.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: new google.maps.LatLng(dataList[0].latitude, dataList[0].longitude),
    mapTypeId: 'roadmap',
  });

  /* スタイル付き地図 */
  const styleOptions = [{
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{visibility: 'off'}]
  },
    {
      featureType: 'all',
      elementType: 'labels',
      stylers: [{hue: '#F8BBD0'}]
    }
  ];
  const lopanType = new google.maps.StyledMapType(styleOptions);
  map.mapTypes.set('noText', lopanType);
  map.setMapTypeId('noText');

  // Create markers.
  const markerDataList = features.map(function (feature) {

    const size = isMobile ? 48 : 64;
    const icon = {
      url: getImageUrl(feature.file, 'thumbs'),
      size: new google.maps.Size(size, size),
      scaledSize: new google.maps.Size(size, size),
    };

    const marker = new google.maps.Marker({
      position: feature.position,
      icon: icon,
      map: map,
    });

    return {
      file: feature.file,
      marker: marker
    };
  });

  markerDataList.forEach(markerData => {
    markerData.marker.addListener('click', (event) => { // マーカーをクリックしたとき
      infoWindow.setContent(createInfoContent(markerData.file));
      infoWindow.open(map, markerData.marker); // 吹き出しの表示
    });
  });
}
