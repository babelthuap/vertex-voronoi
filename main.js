import Voronoi from './Voronoi.js';

let renderInProgress;

const render = () => {
  if (!renderInProgress) {
    console.time('render');
    renderInProgress = true;
    new Voronoi().then(() => {
      renderInProgress = false;
      console.timeEnd('render');
    });
  }
};

render();

window.addEventListener('keydown', event => {
  if (!event.altKey && !event.ctrlKey && !event.metaKey) {
    render();
  }
});

window.addEventListener('mousedown', () => {
  render();
});
