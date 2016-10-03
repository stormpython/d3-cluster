import quadtree from 'd3-quadtree';
import { scaleLinear } from 'd3-scale';
import { cloneDeep, first, flattenDeep, isFunction, isNumber } from 'lodash';

export default function cluster() {
  let x = d => d[0];
  let y = d => d[1];
  let tolerance = 0;
  let xScale = scaleLinear();
  let yScale = scaleLinear();
  let centroid = (p0, p1) => (p1 + p0) / 2;

  function X(d, i) {
    return xScale(x.call(this, d, i));
  }

  function Y(d, i) {
    return yScale(y.call(this, d, i));
  }

  function clusterize(data) {
    const clusteredData = [];

    const modifiedData = data
      .map((d, i) => ({
        x: X.call(this, d, i),
        y: Y.call(this, d, i),
        point: cloneDeep(d), // copy of original data point
      }));

    quadtree()
      .x(d => d.x)
      .y(d => d.y)
      .addAll(modifiedData)
      .visit((d, x0, y0, x1, y1) => {
        if (d.data) { clusteredData.push(d.data); }

        // if pixel width < tolerance value, cluster points
        if ((x1 - x0) < tolerance) {
          const points = flattenDeep(d);
          points.filter(e => e);

          clusteredData.push({
            x: centroid.call(null, x0, x1, points.map(e => e.x)),
            y: centroid.call(null, y0, y1, points.map(e => e.y)),
            points,
          });

          return true; // Stop here
        }

        return false;
      });

    return clusteredData;
  }

  function layout(data) {
    return clusterize(data);
  }

  // Public API
  layout.x = (...args) => {
    if (!args.length) { return x; }

    const value = first(args);
    x = isFunction(value) ? value : x;
    return layout;
  };

  layout.y = (...args) => {
    if (!args.length) { return y; }

    const value = first(args);
    y = isFunction(value) ? value : y;
    return layout;
  };

  layout.tolerance = (...args) => {
    if (!args.length) { return tolerance; }

    const value = first(args);
    tolerance = isNumber(value) ? value : tolerance;
    return layout;
  };

  layout.centroid = (...args) => {
    if (!args.length) { return centroid; }

    const value = first(args);
    centroid = isFunction(value) ? value : centroid;
    return layout;
  };

  layout.xScale = (...args) => {
    if (!args.length) { return xScale; }

    const value = first(args);
    xScale = isFunction(value) ? value : xScale;
    return layout;
  };

  layout.yScale = (...args) => {
    if (!args.length) { return yScale; }

    const value = first(args);
    yScale = isFunction(value) ? value : yScale;
    return layout;
  };

  return layout;
}
