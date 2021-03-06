/**
 * This package provides general utility functionality.
 *
 * @author Joschi <josua.krause@gmail.com>
 */

jkjs = window.jkjs || {}; // init namespace

jkjs.util = function() {
  var that = this;

  /**
   * Converts a list of classes into an object that can be used by the d3 classed function to activate all those classes.
   *
   * @param classes
   *          The classes as array. null is equivalent to an empty list.
   * @returns {Object} The object activating all classes when given to the d3 classed function.
   */
  this.convertClasses = function(classes) {
    if (!classes)
      return {};
    return classes.reduce(function(obj, c) {
      obj[c] = true;
      return obj;
    }, {});
  }

  /**
   * Returns all GET arguments of the current URL location as key value pairs.
   *
   * @returns {Object} The arguments as keys and values.
   */
  this.getQueryStrings = function() {
    var assoc = {};
    var decode = function(s) {
      return decodeURIComponent(s.replace(/\+/g, " "));
    };
    var queryString = location.search.substring(1);
    var keyValues = queryString.split('&');
    keyValues.forEach(function(e) {
      var key = e.split('=');
      if (key.length > 1) {
        assoc[decode(key[0])] = decode(key[1]);
      }
    });
    return assoc;
  }

  /**
   * Getter.
   *
   * @returns {String} The current URL.
   */
  this.getOwnURL = function() {
    return location.origin + location.pathname;
  }

  /**
   * Whether the given object has no keys.
   *
   * @param obj
   *          The object.
   * @returns {Boolean} Whether the given object has no keys.
   */
  this.isEmpty = function(obj) {
    return Object.keys(obj).length == 0;
  }

  /**
   * Maps elements of an array to an array of results.
   *
   * <pre>
   * [a] -&gt; (a -&gt; [b]) -&gt; [b]
   * </pre>
   *
   * @param arr
   *          The array to map.
   * @param fun
   *          The mapping function. It gets the current element as argument and is expected to return a list of results.
   * @returns The concatenated list of all result lists.
   */
  this.flatMap = function(arr, fun) {
    return [].concat.apply([], arr.map(fun));
  }

  /**
   * Moves all elements of the given selection to either the front or the back of the parent's children list resulting in
   * different visibility.
   *
   * @param sel
   *          The d3 selection to move.
   * @param toFront
   *          Whether to move to the front or to the back.
   */
  this.toFront = function(sel, toFront) {
    sel.each(function() {
      var obj = this;
      var parent = obj.parentElement;
      if (toFront) {
        parent.appendChild(obj);
      } else {
        parent.insertBefore(obj, parent.firstChild);
      }
    });
  }

  this.rectIntersect = function(rectA, rectB) {
    if(rectA.width <= 0 || rectA.height <= 0 || rectB.width <= 0 || rectB.height <= 0) {
      return false;
    }
    return rectB.x + rectB.width  > rectA.x &&
           rectB.y + rectB.height > rectA.y &&
           rectB.x < rectA.x + rectA.width  &&
           rectB.y < rectA.y + rectA.height;
  };

  this.getGrayValue = function(color) {
    return 0.2126 * color.r / 255 + 0.7152 * color.g / 255 + 0.0722 * color.b / 255;
  };

  this.getFontColor = function(color) {
    var grayValue = this.getGrayValue(color);
    return grayValue > 0.5 ? d3.rgb("black") : d3.rgb("white");
  };

  this.ensureSorted = function(arr) {
    if(!arr.length) return;
    var prev = Number.NEGATIVE_INFINITY;
    for(var i = 0;i < arr.length;i += 1) {
      var v = arr[i];
      if(v < prev) {
        requireSorted(arr);
        return;
      }
      prev = v;
    }
  };

  function requireSorted(arr) {
    console.warn("slow sort test");
    var prev = Number.NEGATIVE_INFINITY;
    var run = false;
    var swapped = [];
    arr.forEach(function(v) {
      if(v < prev) {
        if(!run) {
          swapped.push(prev);
        }
        swapped.push(v);
        run = true;
      } else {
        run = false;
      }
      prev = v;
    });
    if(swapped.length) {
      console.warn("array not sorted", swapped, arr, new Error().stack);
      arr.sort(d3.ascending);
    }
  };

  this.getRemaining = function(ixs, minus) {
    if(!ixs.length || !minus.length) return ixs;
    // sorted ixs and minus
    that.ensureSorted(ixs);
    that.ensureSorted(minus);
    var p = 0;
    var q = 0;
    var res = [];
    while(p < ixs.length && q < minus.length) {
      var cur = ixs[p];
      var m = minus[q];
      if(cur < m) {
        res.push(cur);
        p += 1;
      } else if(cur > m) {
        q += 1;
      } else { // cur == m
        p += 1;
      }
    }
    for(;p < ixs.length;p += 1) {
      res.push(ixs[p]);
    }
    return res;
  };

  this.getRemainingIter = function(ixs, minus, cb) {
    if(!ixs.length || !minus.length) {
      ixs.forEach(cb);
      return;
    }
    // sorted ixs and minus
    that.ensureSorted(ixs);
    that.ensureSorted(minus);
    var p = 0;
    var q = 0;
    while(p < ixs.length && q < minus.length) {
      var cur = ixs[p];
      var m = minus[q];
      if(cur < m) {
        cb(cur);
        p += 1;
      } else if(cur > m) {
        q += 1;
      } else { // cur == m
        p += 1;
      }
    }
    for(;p < ixs.length;p += 1) {
      cb(ixs[p]);
    }
  };

  this.applyPerm = function(arr, perm) {
    var tmp = arr.slice();
    if(tmp.length !== perm.length) console.warn(tmp.length + " != " + perm.length, new Error().stack);
    for(var i = 0;i < perm.length;i += 1) {
      arr[i] = tmp[perm[i]];
    }
  };

  this.randomNorm = function(maxRad, norm) {
    // maxRad should be >= 1e-3
    for(;;) {
      var rnd = ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3; // stddev: ~1, mean: ~0
      if(arguments.length < 1 || maxRad < 1e-3 || Math.abs(rnd) <= maxRad) {
        if(arguments.length >= 2 && norm) {
          return rnd / maxRad;
        }
        return rnd;
      }
    }
  };

  this.timing = function(name, cb, obj, args) {
    var from = new Date().getTime();
    var res = cb.apply(obj, args);
    var to = new Date().getTime();
    if(obj || args) {
      console.log("TIMING " + name, (to - from) + "ms", obj, args);
    } else {
      console.log("TIMING " + name, (to - from) + "ms");
    }
    return res;
  }

}; // jkjs.util

jkjs.util = new jkjs.util(); // create instance

if(!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, 'startsWith', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(searchString, position) {
      position = position || 0;
      return this.lastIndexOf(searchString, position) === position;
    }
  });
}

if(typeof Number.isFinite !== 'function') {
  Number.isFinite = function isFinite(value) {
    if(typeof value !== 'number') return false;
    return !(value !== value || value === Number.NEGATIVE_INFINITY || value === Number.POSITIVE_INFINITY);
  };
}
