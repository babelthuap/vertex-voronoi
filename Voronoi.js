import Canvas from './Canvas.js';
import {dist, Line, pair, Point, rand} from './util.js';

// reuse these across instances to reduce garbage collection time
let cellsArray;

// params
const PARAMS = new URLSearchParams(location.search);
const NUM_CELLS = (() => {
  const DEFAULT_N = 4;
  const n = parseInt(PARAMS.get('n'));
  return n > 0 && n < 20 ? n : DEFAULT_N;
})();
const RADIUS = (() => {
  const DEFAULT_R = 20;
  const r = parseInt(PARAMS.get('r'));
  return r > 0 && r < 100 ? r : DEFAULT_R;
})();

// naive algorithm to find closest cell for a pixel
const findClosestCellId = (x, y, cells) => {
  let closestCellId;
  let minDist = Infinity;
  for (let i = 0; i < cells.length; ++i) {
    const cell = cells[i];
    const d = dist(x, y, cell.center.x, cell.center.y);
    if (d < minDist) {
      minDist = d;
      closestCellId = i;
    }
  }
  return closestCellId;
};

/**
 * renders a voronoi diagram!
 */
export default function Voronoi() {
  // init canvas
  const canvas = new Canvas();
  const width = canvas.width;
  const height = canvas.height;

  // place cells
  const cells = (() => {
    if (cellsArray === undefined) {
      cellsArray = new Array(NUM_CELLS);
    } else if (cellsArray.length !== NUM_CELLS) {
      cellsArray.length = NUM_CELLS;
    }
    const cells = cellsArray;
    const centers = new Set();
    const step = 360 / NUM_CELLS;
    const hue = rand(step);
    for (let id = 0; id < NUM_CELLS; ++id) {
      let x, y;
      do {
        x = rand(width);
        y = rand(height);
      } while (centers.has(pair(x, y)));
      centers.add(pair(x, y));
      cells[id] = {
        center: new Point(x, y),
        color: `hsl(${hue + id * step},100%,75%)`,
      };
    }
    return cells;
  })();

  // draw pixelated voronoi diagram underneath
  for (let y = 0; y < height + RADIUS; y += RADIUS) {
    for (let x = 0; x < width + RADIUS; x += RADIUS) {
      const id = findClosestCellId(x, y, cells);
      const color = cells[id].color;
      canvas.drawSquare(x, y, RADIUS, color);
    }
  }


  // draw all perpendicular bisectors - these are potential borders
  const pbs = [];
  for (let i = 0; i < cells.length; ++i) {
    const a = cells[i].center;
    canvas.drawCircle(a, RADIUS);
    for (let j = i + 1; j < cells.length; ++j) {
      const b = cells[j].center;
      const perp = new Line(a, b).perpendicularBisector();
      pbs.push(perp);
      canvas.drawLine(perp);
    }
  }

  // draw all intersections - these are potential vertices
  for (let i = 0; i < pbs.length; ++i) {
    for (let j = i + 1; j < pbs.length; ++j) {
      const intersection = Line.intersection(pbs[i], pbs[j]);
      if (intersection) {
        canvas.drawCircle(intersection, RADIUS, 'red');
      }
    }
  }

  canvas.attachToDom();
  return Promise.resolve();
}
