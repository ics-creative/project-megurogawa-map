import Vue from 'vue';

const createInfoContent = (file) => {
        const isMobile = matchMedia('(max-width : 640px)').matches;

        const w = isMobile ? 120 : 320;
        const h = isMobile ? 80 : 240;

        return `
          <div class="sample">
            <img src="images/${file}" 
              width="${w}" height="${h}"
              class="app-map__info-img" />
          </div>`;
      }
;

export async function initMap() {

  const dataList = await (await fetch('data/data.json')).json();

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
            <img v-bind:src="'images/' + item.file" />
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

    const icon = {
      url: `icons/${feature.file}`,
      size: new google.maps.Size(40, 30),
      scaledSize: new google.maps.Size(40, 30),
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
