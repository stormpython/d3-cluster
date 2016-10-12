// import quadtree from 'd3-quadtree';
import { scaleLinear } from 'd3-scale';
import { cloneDeep, isEqual } from './utils';

function isMissing(arr, obj) {
  return arr.every(function (d) {
    return !isEqual(d, obj);
  });
}

export default function () {
  var x = function (d) { return d[0]; };
  var y = function (d) { return d[1]; };
  var radius = function (d) { return d[2]; };
  var xScale = scaleLinear();
  var yScale = scaleLinear();
  var centroid = function (p0, p1) { return (p1 + p0) / 2; };

  function X(d, i) {
    return xScale(x.call(this, d, i));
  }

  function Y(d, i) {
    return yScale(y.call(this, d, i));
  }

  function clusterize(data) {
    var clusteredPoints = [];
    var overlappingPoints = []; // What is the point of this?

    var modifiedData = data
      .map(function (d, i) {
        return {
          x: X.call(this, d, i),
          y: Y.call(this, d, i),
          radius: radius.call(this, d, i),
          point: cloneDeep(d) // copy of original data point
        };
      })
      .sort(function (a, b) {
        return b.radius - a.radius;
      });

//    var targetPoints = cloneDeep(modifiedData); // copy of data
    var targetPoints = modifiedData; // copy of data

    modifiedData.forEach(function (p) {
      if (isMissing(overlappingPoints, p)) {
        p.overlap = [];

        clusteredPoints.push(p);

        targetPoints.forEach(function (t) {
          if (t !== p) {
            var distance = Math.sqrt(Math.pow(Math.abs(t.x - p.x), 2) +
              Math.pow(Math.abs(t.y - p.y), 2));

            if (distance < (t.radius + p.radius)) {
              t.clustered = true;
              p.overlap.push(t);
              overlappingPoints.push(t);
            }
          }
        });

        targetPoints = targetPoints.filter(function (d) {
          return isMissing(p.overlap, d);
        });
      }
    });

    return clusteredPoints;
  }

  function layout(data) {
    return clusterize(data);
  }

  // Public API
  layout.x = function (_) {
    if (!arguments.length) { return x; }

    x = typeof _ === 'function' ? _ : x;
    return layout;
  };

  layout.y = function (_) {
    if (!arguments.length) { return y; }

    y = typeof _  === 'function' ? _ : y;
    return layout;
  };

  layout.radius = function (_) {
    if (!arguments.length) { return radius; }
    if (typeof _ === 'function') { radius = _; }
    if (typeof _ === 'number') { radius = function () { return _; }; }

    return layout;
  };

  layout.centroid = function (_) {
    if (!arguments.length) { return centroid; }

    centroid = typeof _ === 'function' ? _ : centroid;
    return layout;
  };

  layout.xScale = function (_) {
    if (!arguments.length) { return xScale; }

    xScale = typeof _ === 'function' ? _ : xScale;
    return layout;
  };

  layout.yScale = function (_) {
    if (!arguments.length) { return yScale; }

    yScale = typeof _ === 'function' ? _ : yScale;
    return layout;
  };

  return layout;
}
