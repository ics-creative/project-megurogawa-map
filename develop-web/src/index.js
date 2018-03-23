import {initMap} from './components/main.js';
import './styles/main.scss';

// Google Mapのコード読み込み後に起動
window.initMap = () => {
  initMap();
};

// Google Mapの起動コード
{
  const fjs = document.getElementsByTagName('script')[0];
  const js = document.createElement('script');
  js.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAY8WHh9_R0qmq3qAceFk8okepDNgRizKk&callback=initMap';
  fjs.parentNode.insertBefore(js, fjs);
}
