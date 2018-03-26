import {initMap} from './components/main.js';
import './styles/main.scss';
import {initMobileUi} from './components/mobile';
import {initServiceWorker} from './other/sw';

// Google Mapのコード読み込み後に起動
window.initMap = () => {
  initMap();

  initServiceWorker();
};

initMobileUi();

// Google Mapの起動コード
{

  // ぱくらないでね
  const API_KEY = `AIzaSyAY8WHh9_R0qmq3qAceFk8okepDNgRizKk`;

  const fjs = document.getElementsByTagName('script')[0];
  const js = document.createElement('script');
  js.src = 'https://maps.googleapis.com/maps/api/js?key=' + API_KEY + '&callback=initMap';
  fjs.parentNode.insertBefore(js, fjs);
}

// Adobe TypeKit

(function (d) {
  var config = {
      kitId: 'iqm5maf',
      scriptTimeout: 3000,
      async: true,
    },
    h = d.documentElement, t = setTimeout(function () {
      h.className = h.className.replace(/\bwf-loading\b/g, '') + ' wf-inactive';
    }, config.scriptTimeout), tk = d.createElement('script'), f = false, s = d.getElementsByTagName('script')[0], a;
  h.className += ' wf-loading';
  tk.src = 'https://use.typekit.net/' + config.kitId + '.js';
  tk.async = true;
  tk.onload = tk.onreadystatechange = function () {
    a = this.readyState;
    if (f || a && a != 'complete' && a != 'loaded') return;
    f = true;
    clearTimeout(t);
    try {
      Typekit.load(config);
    } catch (e) {
    }
  };
  s.parentNode.insertBefore(tk, s);
})(document);
