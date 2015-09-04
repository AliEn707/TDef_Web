/*
took from https://mgechev.github.io
*/

(function (exports) {

  'use strict';


  function compare(a, b) {

    return a - b;

  }


  var shellSort = (function () {


    var gaps = [701, 301, 132, 57, 23, 10, 4, 1];


    /**

     * Shellsort which uses the gaps 701, 301, 132, 57, 23, 10, 4, 1 and

     * insertion sort to sort sub-arrays which match for the different gaps.

     *

     * @example

     *

     * var sort = require('path-to-algorithms/src/' +

     * 'sorting/shellsort').shellSort;

     * console.log(sort([2, 5, 1, 0, 4])); // [ 0, 1, 2, 4, 5 ]

     *

     * @public

     * @module sorting/shellsort

     * @param {Array} array Input array.

     * @param {Function} cmp Optional. A function that defines an

     * alternative sort order. The function should return a negative,

     * zero, or positive value, depending on the arguments.

     * @return {Array} Sorted array.

     */

    return function (array, cmp) {

      cmp = cmp || compare;


      var gap;

      var current;

      for (var k = 0; k < gaps.length; k += 1) {

        gap = gaps[k];

        for (var i = gap; i < array.length; i += gap) {

          current = array[i];

          for (var j = i;

              j >= gap && cmp(array[j - gap], current) > 0; j -= gap) {

            array[j] = array[j - gap];

          }

          array[j] = current;

        }

      }

      return array;

    };


  }());


  exports.shellSort = shellSort;


}(typeof exports === 'undefined' ? window : exports));

//-----------------

(function (exports) {
  'use strict';
  function comparator(a, b) {
    return a - b;
  }
  var heapSort = (function () {
    /**
     * Finds the correct place of given element in given max heap.
     *
     * @private
     * @param {Array} array Array.
     * @param {Number} index Index of the element which palce in
     * the max heap should be found.
     * @param {Number} heapSize Size of the heap.
     * @param {function} cmp Comparison function.
     */
    function heapify(array, index, heapSize, cmp) {
      var left = 2 * index + 1;
      var right = 2 * index + 2;
      var largest = index;
      if (left < heapSize && cmp(array[left], array[index]) > 0) {
        largest = left;
      }
      if (right < heapSize && cmp(array[right], array[largest]) > 0) {
        largest = right;
      }
      if (largest !== index) {
        var temp = array[index];
        array[index] = array[largest];
        array[largest] = temp;
        heapify(array, largest, heapSize, cmp);
      }
    }
    /**
     * Builds max heap from given array.
     *
     * @private
     * @param {Array} array Array which should be turned into max heap.
     * @param {function} cmp Comparison function.
     * @return {Array} array Array turned into max heap.
     */
    function buildMaxHeap(array, cmp) {
      for (var i = Math.floor(array.length / 2); i >= 0; i -= 1) {
        heapify(array, i, array.length, cmp);
      }
      return array;
    }
    /**
     * Heapsort. Turns the input array into max
     * heap and after that sorts it.<br><br>
     * Time complexity: O(N log N).
     *
     * @example
     *
     * var sort = require('path-to-algorithms/src' +
     * '/sorting/heapsort').heapSort;
     * console.log(sort([2, 5, 1, 0, 4])); // [ 0, 1, 2, 4, 5 ]
     *
     * @public
     * @module sorting/heapsort
     * @param {Array} array Input array.
     * @param {Function} cmp Optional. A function that defines an
     * alternative sort order. The function should return a negative,
     * zero, or positive value, depending on the arguments.
     * @return {Array} Sorted array.
     */
    return function (array, cmp) {
      cmp = cmp || comparator;
      var size = array.length;
      var temp;
      buildMaxHeap(array, cmp);
      for (var i = array.length - 1; i > 0; i -= 1) {
        temp = array[0];
        array[0] = array[i];
        array[i] = temp;
        size -= 1;
        heapify(array, 0, size, cmp);
      }
      return array;
    };
  }());
  exports.heapSort = heapSort;
})(typeof window === 'undefined' ? module.exports : window);

//-------------------------------

(function (exports) {
  /**
   * Mergesort module.
   */
  'use strict';
  function compare(a, b) {
    return a - b;
  }
  /**
   * Mergesort method which is recursively called for sorting the input array.
   *
   * @public
   * @module sorting/mergesort
   * @param {Array} array The array which should be sorted.
   * @param {Function} cmp Compares two items in an array.
   * @param {Number} start Left side of the subarray.
   * @param {Number} end Right side of the subarray.
   * @returns {Array} Array with sorted subarray.
   *
   * @example
   * var array = [2, 4, 1, 5, 6, 7];
   * var mergeSort =
   *    require('path-to-algorithms/src/sorting/mergesort').mergeSort;
   * mergeSort(array); // [1, 2, 4, 5, 6, 7]
   */
  function mergeSort(array, cmp, start, end) {
    cmp = cmp || compare;
    start = start || 0;
    end = end || array.length;
    if (Math.abs(end - start) <= 1) {
      return [];
    }
    var middle = Math.ceil((start + end) / 2);
    mergeSort(array, cmp, start, middle);
    mergeSort(array, cmp, middle, end);
    return mergeSort.merge(array, cmp, start, middle, end);
  }
  /**
   * Devides and sort merges two subarrays of given array
   *
   * @public
   * @module sorting/mergesort/merge
   * @param {Array} array The array which subarrays should be sorted.
   * @param {Number} start The start of the first subarray.
   *   This subarray is with end middle - 1.
   * @param {Number} middle The start of the second array.
   * @param {Number} end end - 1 is the end of the second array.
   * @returns {Array} The array with sorted subarray.
   *
   * @example
   * var array = [1, 2, 3, 1, 4, 5, 6];
   * var merge =
   *    require('path-to-algorithms/src/sorting/mergesort').merge;
   * merge(array, function (a, b) {  // [1, 1, 2, 3, 4, 5, 6]
   *  return a - b;
   * }, 0, 4, 7);
   */
  mergeSort.merge = function (array, cmp, start, middle, end) {
    var left = [];
    var right = [];
    var leftSize = middle - start;
    var rightSize = end - middle;
    var maxSize = Math.max(leftSize, rightSize);
    var size = end - start;
    var i;
    for (i = 0; i < maxSize; i += 1) {
      if (i < leftSize) {
        left[i] = array[start + i];
      }
      if (i < rightSize) {
        right[i] = array[middle + i];
      }
    }
    i = 0;
    while (i < size) {
      if (left.length && right.length) {
        if (cmp(left[0], right[0]) > 0) {
          array[start + i] = right.shift();
        } else {
          array[start + i] = left.shift();
        }
      } else if (left.length) {
        array[start + i] = left.shift();
      } else {
        array[start + i] = right.shift();
      }
      i += 1;
    }
    return array;
  };
  exports.mergeSort = mergeSort;
}(typeof exports === 'undefined' ? window : exports));

 
//TODO: check which is best
//save dafault sort as sortDefault
defaultSort=Array.prototype.sort;
//replace basic sort by shellsort
Array.prototype.sort=function(cmp){
	if (this.lenght>500)
		return mergeSort(this,cmp);
	if (this.lenght>100)
		return heapSort(this,cmp);
	return shellSort(this,cmp);
}