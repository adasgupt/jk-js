/**
 * This package provides general utility functionality.
 *
 * @author Joschi <josua.krause@gmail.com>
 */

jkjs = window.jkjs || {}; // init namespace

jkjs.util = function() {

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

}; // jkjs.util

jkjs.util = new jkjs.util(); // create instance