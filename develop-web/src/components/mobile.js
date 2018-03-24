export function initMobileUi() {

  window.addEventListener('DOMContentLoaded', () => {

    document.documentElement.addEventListener('touchmove', (event) => {
      console.log(event);
      if (event.target === document.querySelector('h1')) {
        event.preventDefault();
      }
    });

    /* ピッチインピッチアウトによる拡大縮小を禁止 */
    document.documentElement.addEventListener('touchstart', (e) => {
      if (e.touches.length >= 2) {
        e.preventDefault();
      }
    });

    /* ダブルタップによる拡大を禁止 */
    let t = 0;
    document.documentElement.addEventListener('touchend', (e) => {
      const now = new Date().getTime();
      if ((now - t) < 350) {
        e.preventDefault();
      }
      t = now;
    });
  });


}
