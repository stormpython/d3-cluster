// import quadtree from 'd3-quadtree';
import { scaleLinear } from 'd3-scale';
import { cloneDeep, isEqual, isFunction } from 'lodash';

export default function () {
  var x = function (d) { return d[0] };
  var y = function (d) { return d[1] };
  var radius = function (d) { return d[2] };
  var xScale = scaleLinear();
  var yScale = scaleLinear();
  var centroid = function (p0, p1) { return (p1 + p0) / 2 };

  function X(d, i) {
    return xScale(x.call(this, d, i));
  }

  function Y(d, i) {
    return yScale(y.call(this, d, i));
  }

  function clusterize(data) {
    var clusteredPoints = [];
    var overlappingPoints = [];

    var modifiedData = data
      .sort(function (a, b) {
        return radius.call(this, b) - radius.call(this, a);
      })
      .map(function (d, i) {
        return {
          x: X.call(this, d, i),
          y: Y.call(this, d, i),
          radius: radius.call(this, d, i),
          point: cloneDeep(d) // copy of original data point
        };
      });

    var targetPoints = cloneDeep(modifiedData); // copy of data

    modifiedData.forEach(function (p) {
      if (overlappingPoints.indexOf(p) === -1) {
        p.overlap = [];

        clusteredPoints.push(p);

        targetPoints.forEach(function (t) {
          if (!isEqual(t, p)) {
            var distance = Math.sqrt(Math.pow(Math.abs(t.x - p.x), 2) +
              Math.pow(Math.abs(t.y - p.y), 2));

            if (distance < t.radius + p.radius) {
              t.clustered = true;
              p.overlap.push(t);
              overlappingPoints.push(t);
            }
          }
        });

        targetPoints = targetPoints.filter(function (d) {
          return p.overlap.every(function (e) {
            return !isEqual(e, d);
          });
        });
      }
    });

    return clusteredPoints;
    // quadtree()
    //   .x(d => d.x)
    //   .y(d => d.y)
    //   .addAll(modifiedData)
    //   .visit((d, x0, y0, x1, y1) => {
    //     if (d.data) { clusteredData.push(d.data); }
    //
    //     // if pixel width < tolerance value, cluster points
    //     if ((x1 - x0) < tolerance) {
    //       let points = flattenDeep(d);
    //       points = points.filter(e => e);
    //
    //       clusteredData.push({
    //         x: centroid.call(null, x0, x1, points.map(e => e.x)),
    //         y: centroid.call(null, y0, y1, points.map(e => e.y)),
    //         points,
    //       });
    //
    //       return true; // Stop here
    //     }
    //
    //     return false;
    //   });
    //
    // return clusteredData;
  }

  function layout(data) {
    return clusterize(data);
  }

  // Public API
  layout.x = function (_) {
    if (!arguments.length) { return x; }

    x = isFunction(_) ? _ : x;
    return layout;
  };

  layout.y = function (_) {
    if (!arguments.length) { return y; }

    y = isFunction(_) ? _ : y;
    return layout;
  };

  layout.radius = function (_) {
    if (!arguments.length) { return radius; }

    radius = isFunction(_) ? _ : radius;
    return layout;
  };

  layout.centroid = function (_) {
    if (!arguments.length) { return centroid; }

    centroid = isFunction(_) ? _ : centroid;
    return layout;
  };

  layout.xScale = function (_) {
    if (!arguments.length) { return xScale; }

    xScale = isFunction(_) ? _ : xScale;
    return layout;
  };

  layout.yScale = function (_) {
    if (!arguments.length) { return yScale; }

    yScale = isFunction(_) ? _ : yScale;
    return layout;
  };

  return layout;
}
