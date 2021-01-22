import {Vector} from './util.js';

const BOARD_CONTAINER = document.getElementById('board');

/**
 * a canvas that fills the board container
 */
export default function Canvas() {
  // fill the entire container
  const width = BOARD_CONTAINER.offsetWidth;
  const height = BOARD_CONTAINER.offsetHeight;

  // create the canvas element
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // methods
  return {
    get width() {
      return width;
    },

    get height() {
      return height;
    },

    attachToDom() {
      [...BOARD_CONTAINER.children].forEach((child) => child.remove());
      BOARD_CONTAINER.appendChild(canvas);
    },

    drawLine(line, color = '#000') {
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(line.a.x, line.a.y);
      ctx.lineTo(line.b.x, line.b.y);
      ctx.stroke();
    },

    drawCircle(center, r, color = '#000') {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
      ctx.fill();
    },

    drawSquare(x, y, size, color = '#000') {
      const radius = size >> 1;
      ctx.fillStyle = color;
      ctx.fillRect(x - radius, y - radius, size, size);
    },
  };
}
