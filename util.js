// store two positive shorts in one int
export const pair = (x, y) => (x << 16) | y;

// random int in [0, n)
export const rand = (n) => Math.floor(Math.random() * n);

// distance function
export const dist = (x1, y1, x2, y2) => {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return dx * dx + dy * dy;
};

// immutable 2D vector initialized with rectangular coordinates
export function Vector(x, y) {
  this.x = x;
  this.y = y;
  let magnitude;
  this.magnitude = function() {
    if (magnitude) {
      return magnitude;
    } else {
      return magnitude = Math.sqrt(x * x + y * y);
    }
  }
};
Vector.prototype.equals = function(other) {
  return this.x === other.x && this.y === other.y;
};
Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
};
Vector.prototype.minus = function(other) {
  return new Vector(this.x - other.x, this.y - other.y);
};
Vector.prototype.scale = function(factor) {
  return new Vector(this.x * factor, this.y * factor);
};
const RAD_PER_DEG = Math.PI / 180;
Vector.prototype.rotate = function(deg) {
  switch (deg %= 360) {
    case 0:
      return new Vector(this.x, this.y);
    case 90:
      return new Vector(-this.y, this.x);
    case 180:
      return new Vector(-this.x, -this.y);
    case 270:
      return new Vector(this.y, -this.x);
    default:
      const rad = RAD_PER_DEG * deg;
      const sin = Math.sin(rad);
      const cos = Math.cos(rad);
      return new Vector(
          this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }
};

// alias for better semantics
export const Point = Vector;

// kinda-immutable line initialized with two points
export function Line(a, b) {
  if (a.equals(b)) {
    throw 'points must be distinct';
  }
  this.a = a;
  this.b = b;
  let slope = null;
  let intercept = null;
  this.slope = function() {
    if (slope !== null) {
      return slope;
    } else {
      slope = (b.y - a.y) / (b.x - a.x);
      if (slope === -Infinity) {
        slope = Infinity;
      }
      return slope;
    }
  };
  this.intercept = function() {
    if (intercept !== null) {
      return intercept;
    } else {
      if (this.slope() === Infinity) {
        return intercept = undefined;
      } else {
        return intercept = a.y - a.x * slope;
      }
    }
  };
}
Line.prototype.equals = function(other) {
  return this.slope() === other.slope() &&
      this.intercept() === other.intercept();
};
Line.prototype.perpendicularBisector = function() {
  const midpoint = this.a.plus(this.b).scale(0.5);
  const perpVec = this.b.minus(this.a).rotate(90);
  return new Line(
      midpoint.plus(perpVec.scale(100)), midpoint.minus(perpVec.scale(100)));
};
Line.intersection = function(line1, line2) {
  const slope1 = line1.slope();
  const slope2 = line2.slope();
  if (slope1 === slope2) {
    // parallel
    return undefined;
  }
  let x, y;
  if (slope1 === Infinity) {
    x = line1.a.x;
    y = slope2 * x + line2.intercept();
  } else if (slope2 === Infinity) {
    x = line2.a.x;
    y = slope1 * x + line1.intercept();
  } else {
    const intercept1 = line1.intercept();
    const intercept2 = line2.intercept();
    x = (intercept2 - intercept1) / (slope1 - slope2);
    y = slope1 * x + intercept1;
  }
  return new Point(x, y);
};
