module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "01f9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("2d00");
var $export = __webpack_require__("5ca1");
var redefine = __webpack_require__("2aba");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var $iterCreate = __webpack_require__("41a0");
var setToStringTag = __webpack_require__("7f20");
var getPrototypeOf = __webpack_require__("38fd");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "02f4":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("4588");
var defined = __webpack_require__("be13");
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),

/***/ "0390":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var at = __webpack_require__("02f4")(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};


/***/ }),

/***/ "044b":
/***/ (function(module, exports) {

module.exports = require("velocity-animate");

/***/ }),

/***/ "0580":
/***/ (function(module, exports) {

var candidateSelectors = [
  'input',
  'select',
  'textarea',
  'a[href]',
  'button',
  '[tabindex]',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
];
var candidateSelector = candidateSelectors.join(',');

var matches = typeof Element === 'undefined'
  ? function () {}
  : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;

function tabbable(el, options) {
  options = options || {};

  var elementDocument = el.ownerDocument || el;
  var regularTabbables = [];
  var orderedTabbables = [];

  var untouchabilityChecker = new UntouchabilityChecker(elementDocument);
  var candidates = el.querySelectorAll(candidateSelector);

  if (options.includeContainer) {
    if (matches.call(el, candidateSelector)) {
      candidates = Array.prototype.slice.apply(candidates);
      candidates.unshift(el);
    }
  }

  var i, candidate, candidateTabindex;
  for (i = 0; i < candidates.length; i++) {
    candidate = candidates[i];

    if (!isNodeMatchingSelectorTabbable(candidate, untouchabilityChecker)) continue;

    candidateTabindex = getTabindex(candidate);
    if (candidateTabindex === 0) {
      regularTabbables.push(candidate);
    } else {
      orderedTabbables.push({
        documentOrder: i,
        tabIndex: candidateTabindex,
        node: candidate,
      });
    }
  }

  var tabbableNodes = orderedTabbables
    .sort(sortOrderedTabbables)
    .map(function(a) { return a.node })
    .concat(regularTabbables);

  return tabbableNodes;
}

tabbable.isTabbable = isTabbable;
tabbable.isFocusable = isFocusable;

function isNodeMatchingSelectorTabbable(node, untouchabilityChecker) {
  if (
    !isNodeMatchingSelectorFocusable(node, untouchabilityChecker)
    || isNonTabbableRadio(node)
    || getTabindex(node) < 0
  ) {
    return false;
  }
  return true;
}

function isTabbable(node, untouchabilityChecker) {
  if (!node) throw new Error('No node provided');
  if (matches.call(node, candidateSelector) === false) return false;
  return isNodeMatchingSelectorTabbable(node, untouchabilityChecker);
}

function isNodeMatchingSelectorFocusable(node, untouchabilityChecker) {
  untouchabilityChecker = untouchabilityChecker || new UntouchabilityChecker(node.ownerDocument || node);
  if (
    node.disabled
    || isHiddenInput(node)
    || untouchabilityChecker.isUntouchable(node)
  ) {
    return false;
  }
  return true;
}

var focusableCandidateSelector = candidateSelectors.concat('iframe').join(',');
function isFocusable(node, untouchabilityChecker) {
  if (!node) throw new Error('No node provided');
  if (matches.call(node, focusableCandidateSelector) === false) return false;
  return isNodeMatchingSelectorFocusable(node, untouchabilityChecker);
}

function getTabindex(node) {
  var tabindexAttr = parseInt(node.getAttribute('tabindex'), 10);
  if (!isNaN(tabindexAttr)) return tabindexAttr;
  // Browsers do not return `tabIndex` correctly for contentEditable nodes;
  // so if they don't have a tabindex attribute specifically set, assume it's 0.
  if (isContentEditable(node)) return 0;
  return node.tabIndex;
}

function sortOrderedTabbables(a, b) {
  return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
}

// Array.prototype.find not available in IE.
function find(list, predicate) {
  for (var i = 0, length = list.length; i < length; i++) {
    if (predicate(list[i])) return list[i];
  }
}

function isContentEditable(node) {
  return node.contentEditable === 'true';
}

function isInput(node) {
  return node.tagName === 'INPUT';
}

function isHiddenInput(node) {
  return isInput(node) && node.type === 'hidden';
}

function isRadio(node) {
  return isInput(node) && node.type === 'radio';
}

function isNonTabbableRadio(node) {
  return isRadio(node) && !isTabbableRadio(node);
}

function getCheckedRadio(nodes) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].checked) {
      return nodes[i];
    }
  }
}

function isTabbableRadio(node) {
  if (!node.name) return true;
  // This won't account for the edge case where you have radio groups with the same
  // in separate forms on the same page.
  var radioSet = node.ownerDocument.querySelectorAll('input[type="radio"][name="' + node.name + '"]');
  var checked = getCheckedRadio(radioSet);
  return !checked || checked === node;
}

// An element is "untouchable" if *it or one of its ancestors* has
// `visibility: hidden` or `display: none`.
function UntouchabilityChecker(elementDocument) {
  this.doc = elementDocument;
  // Node cache must be refreshed on every check, in case
  // the content of the element has changed. The cache contains tuples
  // mapping nodes to their boolean result.
  this.cache = [];
}

// getComputedStyle accurately reflects `visibility: hidden` of ancestors
// but not `display: none`, so we need to recursively check parents.
UntouchabilityChecker.prototype.hasDisplayNone = function hasDisplayNone(node, nodeComputedStyle) {
  if (node === this.doc.documentElement) return false;

    // Search for a cached result.
    var cached = find(this.cache, function(item) {
      return item === node;
    });
    if (cached) return cached[1];

    nodeComputedStyle = nodeComputedStyle || this.doc.defaultView.getComputedStyle(node);

    var result = false;

    if (nodeComputedStyle.display === 'none') {
      result = true;
    } else if (node.parentNode) {
      result = this.hasDisplayNone(node.parentNode);
    }

    this.cache.push([node, result]);

    return result;
}

UntouchabilityChecker.prototype.isUntouchable = function isUntouchable(node) {
  if (node === this.doc.documentElement) return false;
  var computedStyle = this.doc.defaultView.getComputedStyle(node);
  if (this.hasDisplayNone(node, computedStyle)) return true;
  return computedStyle.visibility === 'hidden';
}

module.exports = tabbable;


/***/ }),

/***/ "0a49":
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__("9b43");
var IObject = __webpack_require__("626a");
var toObject = __webpack_require__("4bf8");
var toLength = __webpack_require__("9def");
var asc = __webpack_require__("cd1c");
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),

/***/ "0bfb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__("cb7c");
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ "0d58":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("ce10");
var enumBugKeys = __webpack_require__("e11e");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "1169":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__("2d95");
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),

/***/ "11e9":
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__("52a7");
var createDesc = __webpack_require__("4630");
var toIObject = __webpack_require__("6821");
var toPrimitive = __webpack_require__("6a99");
var has = __webpack_require__("69a8");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__("9e1e") ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),

/***/ "1495":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var anObject = __webpack_require__("cb7c");
var getKeys = __webpack_require__("0d58");

module.exports = __webpack_require__("9e1e") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "1d19":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "20d6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = __webpack_require__("5ca1");
var $find = __webpack_require__("0a49")(6);
var KEY = 'findIndex';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__("9c6c")(KEY);


/***/ }),

/***/ "214f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("b0c5");
var redefine = __webpack_require__("2aba");
var hide = __webpack_require__("32e9");
var fails = __webpack_require__("79e5");
var defined = __webpack_require__("be13");
var wks = __webpack_require__("2b4c");
var regexpExec = __webpack_require__("520a");

var SPECIES = wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),

/***/ "230e":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var document = __webpack_require__("7726").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "23c6":
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__("2d95");
var TAG = __webpack_require__("2b4c")('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ "2621":
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "28a5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isRegExp = __webpack_require__("aae3");
var anObject = __webpack_require__("cb7c");
var speciesConstructor = __webpack_require__("ebd6");
var advanceStringIndex = __webpack_require__("0390");
var toLength = __webpack_require__("9def");
var callRegExpExec = __webpack_require__("5f1b");
var regexpExec = __webpack_require__("520a");
var $min = Math.min;
var $push = [].push;
var $SPLIT = 'split';
var LENGTH = 'length';
var LAST_INDEX = 'lastIndex';

// eslint-disable-next-line no-empty
var SUPPORTS_Y = !!(function () { try { return new RegExp('x', 'y'); } catch (e) {} })();

// @@split logic
__webpack_require__("214f")('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
  var internalSplit = $split;
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return $split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy[LAST_INDEX];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
    };
  }

  return [
    // `String.prototype.split` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = defined(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                    (rx.multiline ? 'm' : '') +
                    (rx.unicode ? 'u' : '') +
                    (SUPPORTS_Y ? 'y' : 'g');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? 0xffffffff : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;
        if (
          z === null ||
          (e = $min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
});


/***/ }),

/***/ "2aba":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var has = __webpack_require__("69a8");
var SRC = __webpack_require__("ca5a")('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__("8378").inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ "2aeb":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__("cb7c");
var dPs = __webpack_require__("1495");
var enumBugKeys = __webpack_require__("e11e");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__("230e")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__("fab2").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "2b4c":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("5537")('wks');
var uid = __webpack_require__("ca5a");
var Symbol = __webpack_require__("7726").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "2d00":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "2d95":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "2e13":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "2fdb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.7 String.prototype.includes(searchString, position = 0)

var $export = __webpack_require__("5ca1");
var context = __webpack_require__("d2c8");
var INCLUDES = 'includes';

$export($export.P + $export.F * __webpack_require__("5147")(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "32e9":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var createDesc = __webpack_require__("4630");
module.exports = __webpack_require__("9e1e") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "3846":
/***/ (function(module, exports, __webpack_require__) {

// 21.2.5.3 get RegExp.prototype.flags()
if (__webpack_require__("9e1e") && /./g.flags != 'g') __webpack_require__("86cc").f(RegExp.prototype, 'flags', {
  configurable: true,
  get: __webpack_require__("0bfb")
});


/***/ }),

/***/ "386b":
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__("5ca1");
var fails = __webpack_require__("79e5");
var defined = __webpack_require__("be13");
var quot = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function (string, tag, attribute, value) {
  var S = String(defined(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function (NAME, exec) {
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function () {
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};


/***/ }),

/***/ "386d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__("cb7c");
var sameValue = __webpack_require__("83a1");
var regExpExec = __webpack_require__("5f1b");

// @@search logic
__webpack_require__("214f")('search', 1, function (defined, SEARCH, $search, maybeCallNative) {
  return [
    // `String.prototype.search` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.search
    function search(regexp) {
      var O = defined(this);
      var fn = regexp == undefined ? undefined : regexp[SEARCH];
      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
    },
    // `RegExp.prototype[@@search]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
    function (regexp) {
      var res = maybeCallNative($search, regexp, this);
      if (res.done) return res.value;
      var rx = anObject(regexp);
      var S = String(this);
      var previousLastIndex = rx.lastIndex;
      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
      var result = regExpExec(rx, S);
      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
      return result === null ? -1 : result.index;
    }
  ];
});


/***/ }),

/***/ "38fd":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__("69a8");
var toObject = __webpack_require__("4bf8");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "3b2b":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var inheritIfRequired = __webpack_require__("5dbc");
var dP = __webpack_require__("86cc").f;
var gOPN = __webpack_require__("9093").f;
var isRegExp = __webpack_require__("aae3");
var $flags = __webpack_require__("0bfb");
var $RegExp = global.RegExp;
var Base = $RegExp;
var proto = $RegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;
// "new" creates a new object, old webkit buggy here
var CORRECT_NEW = new $RegExp(re1) !== re1;

if (__webpack_require__("9e1e") && (!CORRECT_NEW || __webpack_require__("79e5")(function () {
  re2[__webpack_require__("2b4c")('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))) {
  $RegExp = function RegExp(p, f) {
    var tiRE = this instanceof $RegExp;
    var piRE = isRegExp(p);
    var fiU = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function (key) {
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function () { return Base[key]; },
      set: function (it) { Base[key] = it; }
    });
  };
  for (var keys = gOPN(Base), i = 0; keys.length > i;) proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  __webpack_require__("2aba")(global, 'RegExp', $RegExp);
}

__webpack_require__("7a56")('RegExp');


/***/ }),

/***/ "41a0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__("2aeb");
var descriptor = __webpack_require__("4630");
var setToStringTag = __webpack_require__("7f20");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__("32e9")(IteratorPrototype, __webpack_require__("2b4c")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "456d":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__("4bf8");
var $keys = __webpack_require__("0d58");

__webpack_require__("5eda")('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),

/***/ "4588":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "4630":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "48c0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.5 String.prototype.bold()
__webpack_require__("386b")('bold', function (createHTML) {
  return function bold() {
    return createHTML(this, 'b', '', '');
  };
});


/***/ }),

/***/ "4bf8":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "5147":
/***/ (function(module, exports, __webpack_require__) {

var MATCH = __webpack_require__("2b4c")('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};


/***/ }),

/***/ "520a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var regexpFlags = __webpack_require__("0bfb");

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),

/***/ "52a7":
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "53a8":
/***/ (function(module, exports) {

module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}


/***/ }),

/***/ "5537":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("8378");
var global = __webpack_require__("7726");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("2d00") ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "5b53":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VaDropdown_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("cc65");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VaDropdown_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VaDropdown_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VaDropdown_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "5ca1":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var core = __webpack_require__("8378");
var hide = __webpack_require__("32e9");
var redefine = __webpack_require__("2aba");
var ctx = __webpack_require__("9b43");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "5dbc":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var setPrototypeOf = __webpack_require__("8b97").set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),

/***/ "5eda":
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__("5ca1");
var core = __webpack_require__("8378");
var fails = __webpack_require__("79e5");
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),

/***/ "5f1b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var classof = __webpack_require__("23c6");
var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};


/***/ }),

/***/ "613b":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("5537")('keys');
var uid = __webpack_require__("ca5a");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "626a":
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__("2d95");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "6762":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/Array.prototype.includes
var $export = __webpack_require__("5ca1");
var $includes = __webpack_require__("c366")(true);

$export($export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

__webpack_require__("9c6c")('includes');


/***/ }),

/***/ "6821":
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__("626a");
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "69a8":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "6a99":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("d3f4");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "6b54":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("3846");
var anObject = __webpack_require__("cb7c");
var $flags = __webpack_require__("0bfb");
var DESCRIPTORS = __webpack_require__("9e1e");
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  __webpack_require__("2aba")(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (__webpack_require__("79e5")(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}


/***/ }),

/***/ "6c92":
/***/ (function(module, exports, __webpack_require__) {

var tabbable = __webpack_require__("0580");
var xtend = __webpack_require__("53a8");

var activeFocusTraps = (function() {
  var trapQueue = [];
  return {
    activateTrap: function(trap) {
      if (trapQueue.length > 0) {
        var activeTrap = trapQueue[trapQueue.length - 1];
        if (activeTrap !== trap) {
          activeTrap.pause();
        }
      }

      var trapIndex = trapQueue.indexOf(trap);
      if (trapIndex === -1) {
        trapQueue.push(trap);
      } else {
        // move this existing trap to the front of the queue
        trapQueue.splice(trapIndex, 1);
        trapQueue.push(trap);
      }
    },

    deactivateTrap: function(trap) {
      var trapIndex = trapQueue.indexOf(trap);
      if (trapIndex !== -1) {
        trapQueue.splice(trapIndex, 1);
      }

      if (trapQueue.length > 0) {
        trapQueue[trapQueue.length - 1].unpause();
      }
    }
  };
})();

function focusTrap(element, userOptions) {
  var doc = document;
  var container =
    typeof element === 'string' ? doc.querySelector(element) : element;

  var config = xtend(
    {
      returnFocusOnDeactivate: true,
      escapeDeactivates: true
    },
    userOptions
  );

  var state = {
    firstTabbableNode: null,
    lastTabbableNode: null,
    nodeFocusedBeforeActivation: null,
    mostRecentlyFocusedNode: null,
    active: false,
    paused: false
  };

  var trap = {
    activate: activate,
    deactivate: deactivate,
    pause: pause,
    unpause: unpause
  };

  return trap;

  function activate(activateOptions) {
    if (state.active) return;

    updateTabbableNodes();

    state.active = true;
    state.paused = false;
    state.nodeFocusedBeforeActivation = doc.activeElement;

    var onActivate =
      activateOptions && activateOptions.onActivate
        ? activateOptions.onActivate
        : config.onActivate;
    if (onActivate) {
      onActivate();
    }

    addListeners();
    return trap;
  }

  function deactivate(deactivateOptions) {
    if (!state.active) return;

    removeListeners();
    state.active = false;
    state.paused = false;

    activeFocusTraps.deactivateTrap(trap);

    var onDeactivate =
      deactivateOptions && deactivateOptions.onDeactivate !== undefined
        ? deactivateOptions.onDeactivate
        : config.onDeactivate;
    if (onDeactivate) {
      onDeactivate();
    }

    var returnFocus =
      deactivateOptions && deactivateOptions.returnFocus !== undefined
        ? deactivateOptions.returnFocus
        : config.returnFocusOnDeactivate;
    if (returnFocus) {
      delay(function() {
        tryFocus(state.nodeFocusedBeforeActivation);
      });
    }

    return trap;
  }

  function pause() {
    if (state.paused || !state.active) return;
    state.paused = true;
    removeListeners();
  }

  function unpause() {
    if (!state.paused || !state.active) return;
    state.paused = false;
    addListeners();
  }

  function addListeners() {
    if (!state.active) return;

    // There can be only one listening focus trap at a time
    activeFocusTraps.activateTrap(trap);

    updateTabbableNodes();

    // Delay ensures that the focused element doesn't capture the event
    // that caused the focus trap activation.
    delay(function() {
      tryFocus(getInitialFocusNode());
    });
    doc.addEventListener('focusin', checkFocusIn, true);
    doc.addEventListener('mousedown', checkPointerDown, true);
    doc.addEventListener('touchstart', checkPointerDown, true);
    doc.addEventListener('click', checkClick, true);
    doc.addEventListener('keydown', checkKey, true);

    return trap;
  }

  function removeListeners() {
    if (!state.active) return;

    doc.removeEventListener('focusin', checkFocusIn, true);
    doc.removeEventListener('mousedown', checkPointerDown, true);
    doc.removeEventListener('touchstart', checkPointerDown, true);
    doc.removeEventListener('click', checkClick, true);
    doc.removeEventListener('keydown', checkKey, true);

    return trap;
  }

  function getNodeForOption(optionName) {
    var optionValue = config[optionName];
    var node = optionValue;
    if (!optionValue) {
      return null;
    }
    if (typeof optionValue === 'string') {
      node = doc.querySelector(optionValue);
      if (!node) {
        throw new Error('`' + optionName + '` refers to no known node');
      }
    }
    if (typeof optionValue === 'function') {
      node = optionValue();
      if (!node) {
        throw new Error('`' + optionName + '` did not return a node');
      }
    }
    return node;
  }

  function getInitialFocusNode() {
    var node;
    if (getNodeForOption('initialFocus') !== null) {
      node = getNodeForOption('initialFocus');
    } else if (container.contains(doc.activeElement)) {
      node = doc.activeElement;
    } else {
      node = state.firstTabbableNode || getNodeForOption('fallbackFocus');
    }

    if (!node) {
      throw new Error(
        "You can't have a focus-trap without at least one focusable element"
      );
    }

    return node;
  }

  // This needs to be done on mousedown and touchstart instead of click
  // so that it precedes the focus event.
  function checkPointerDown(e) {
    if (container.contains(e.target)) return;
    if (config.clickOutsideDeactivates) {
      deactivate({
        returnFocus: !tabbable.isFocusable(e.target)
      });
    } else {
      e.preventDefault();
    }
  }

  // In case focus escapes the trap for some strange reason, pull it back in.
  function checkFocusIn(e) {
    // In Firefox when you Tab out of an iframe the Document is briefly focused.
    if (container.contains(e.target) || e.target instanceof Document) {
      return;
    }
    e.stopImmediatePropagation();
    tryFocus(state.mostRecentlyFocusedNode || getInitialFocusNode());
  }

  function checkKey(e) {
    if (config.escapeDeactivates !== false && isEscapeEvent(e)) {
      e.preventDefault();
      deactivate();
      return;
    }
    if (isTabEvent(e)) {
      checkTab(e);
      return;
    }
  }

  // Hijack Tab events on the first and last focusable nodes of the trap,
  // in order to prevent focus from escaping. If it escapes for even a
  // moment it can end up scrolling the page and causing confusion so we
  // kind of need to capture the action at the keydown phase.
  function checkTab(e) {
    updateTabbableNodes();
    if (e.shiftKey && e.target === state.firstTabbableNode) {
      e.preventDefault();
      tryFocus(state.lastTabbableNode);
      return;
    }
    if (!e.shiftKey && e.target === state.lastTabbableNode) {
      e.preventDefault();
      tryFocus(state.firstTabbableNode);
      return;
    }
  }

  function checkClick(e) {
    if (config.clickOutsideDeactivates) return;
    if (container.contains(e.target)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  function updateTabbableNodes() {
    var tabbableNodes = tabbable(container);
    state.firstTabbableNode = tabbableNodes[0] || getInitialFocusNode();
    state.lastTabbableNode =
      tabbableNodes[tabbableNodes.length - 1] || getInitialFocusNode();
  }

  function tryFocus(node) {
    if (node === doc.activeElement) return;
    if (!node || !node.focus) {
      tryFocus(getInitialFocusNode());
      return;
    }

    node.focus();
    state.mostRecentlyFocusedNode = node;
    if (isSelectableInput(node)) {
      node.select();
    }
  }
}

function isSelectableInput(node) {
  return (
    node.tagName &&
    node.tagName.toLowerCase() === 'input' &&
    typeof node.select === 'function'
  );
}

function isEscapeEvent(e) {
  return e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27;
}

function isTabEvent(e) {
  return e.key === 'Tab' || e.keyCode === 9;
}

function delay(fn) {
  return setTimeout(fn, 0);
}

module.exports = focusTrap;


/***/ }),

/***/ "7333":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__("0d58");
var gOPS = __webpack_require__("2621");
var pIE = __webpack_require__("52a7");
var toObject = __webpack_require__("4bf8");
var IObject = __webpack_require__("626a");
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__("79e5")(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),

/***/ "7514":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = __webpack_require__("5ca1");
var $find = __webpack_require__("0a49")(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__("9c6c")(KEY);


/***/ }),

/***/ "7726":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "77f1":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("4588");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "79e5":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "7a56":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("7726");
var dP = __webpack_require__("86cc");
var DESCRIPTORS = __webpack_require__("9e1e");
var SPECIES = __webpack_require__("2b4c")('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),

/***/ "7b63":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VaAppConfig_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1d19");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VaAppConfig_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VaAppConfig_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VaAppConfig_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "7f20":
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__("86cc").f;
var has = __webpack_require__("69a8");
var TAG = __webpack_require__("2b4c")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "7f7f":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc").f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || __webpack_require__("9e1e") && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});


/***/ }),

/***/ "8378":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.0' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "83a1":
/***/ (function(module, exports) {

// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};


/***/ }),

/***/ "84f2":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "86cc":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("cb7c");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var toPrimitive = __webpack_require__("6a99");
var dP = Object.defineProperty;

exports.f = __webpack_require__("9e1e") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "8b97":
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__("d3f4");
var anObject = __webpack_require__("cb7c");
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__("9b43")(Function.call, __webpack_require__("11e9").f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),

/***/ "8bbf":
/***/ (function(module, exports) {

module.exports = require("vue");

/***/ }),

/***/ "9093":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__("ce10");
var hiddenKeys = __webpack_require__("e11e").concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),

/***/ "9b43":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("d8e8");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "9c6c":
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__("2b4c")('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__("32e9")(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "9def":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("4588");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "9e1e":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("79e5")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "a481":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__("cb7c");
var toObject = __webpack_require__("4bf8");
var toLength = __webpack_require__("9def");
var toInteger = __webpack_require__("4588");
var advanceStringIndex = __webpack_require__("0390");
var regExpExec = __webpack_require__("5f1b");
var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
__webpack_require__("214f")('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = defined(this);
      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
      return fn !== undefined
        ? fn.call(searchValue, O, replaceValue)
        : $replace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative($replace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return $replace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return ch;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return ch;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return ch;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});


/***/ }),

/***/ "aa77":
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__("5ca1");
var defined = __webpack_require__("be13");
var fails = __webpack_require__("79e5");
var spaces = __webpack_require__("fdef");
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),

/***/ "aae3":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__("d3f4");
var cof = __webpack_require__("2d95");
var MATCH = __webpack_require__("2b4c")('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};


/***/ }),

/***/ "ac6a":
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__("cadf");
var getKeys = __webpack_require__("0d58");
var redefine = __webpack_require__("2aba");
var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var wks = __webpack_require__("2b4c");
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),

/***/ "b0c5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var regexpExec = __webpack_require__("520a");
__webpack_require__("5ca1")({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});


/***/ }),

/***/ "b54a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.10 String.prototype.link(url)
__webpack_require__("386b")('link', function (createHTML) {
  return function link(url) {
    return createHTML(this, 'a', 'href', url);
  };
});


/***/ }),

/***/ "be13":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "c32d":
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),

/***/ "c366":
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__("6821");
var toLength = __webpack_require__("9def");
var toAbsoluteIndex = __webpack_require__("77f1");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "c5f6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("7726");
var has = __webpack_require__("69a8");
var cof = __webpack_require__("2d95");
var inheritIfRequired = __webpack_require__("5dbc");
var toPrimitive = __webpack_require__("6a99");
var fails = __webpack_require__("79e5");
var gOPN = __webpack_require__("9093").f;
var gOPD = __webpack_require__("11e9").f;
var dP = __webpack_require__("86cc").f;
var $trim = __webpack_require__("aa77").trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(__webpack_require__("2aeb")(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = __webpack_require__("9e1e") ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__("2aba")(global, NUMBER, $Number);
}


/***/ }),

/***/ "c69a":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("9e1e") && !__webpack_require__("79e5")(function () {
  return Object.defineProperty(__webpack_require__("230e")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "ca5a":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "cadf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__("9c6c");
var step = __webpack_require__("d53b");
var Iterators = __webpack_require__("84f2");
var toIObject = __webpack_require__("6821");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__("01f9")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "cb7c":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "cc65":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "cd1c":
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__("e853");

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),

/***/ "ce10":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("69a8");
var toIObject = __webpack_require__("6821");
var arrayIndexOf = __webpack_require__("c366")(false);
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "d263":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.6 String.prototype.fixed()
__webpack_require__("386b")('fixed', function (createHTML) {
  return function fixed() {
    return createHTML(this, 'tt', '', '');
  };
});


/***/ }),

/***/ "d2c8":
/***/ (function(module, exports, __webpack_require__) {

// helper for String#{startsWith, endsWith, includes}
var isRegExp = __webpack_require__("aae3");
var defined = __webpack_require__("be13");

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};


/***/ }),

/***/ "d3f4":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "d53b":
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "d8e8":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "e11e":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "e853":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var isArray = __webpack_require__("1169");
var SPECIES = __webpack_require__("2b4c")('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),

/***/ "ebd6":
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__("cb7c");
var aFunction = __webpack_require__("d8e8");
var SPECIES = __webpack_require__("2b4c")('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),

/***/ "f559":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])

var $export = __webpack_require__("5ca1");
var toLength = __webpack_require__("9def");
var context = __webpack_require__("d2c8");
var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * __webpack_require__("5147")(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = context(this, searchString, STARTS_WITH);
    var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});


/***/ }),

/***/ "f751":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__("5ca1");

$export($export.S + $export.F, 'Object', { assign: __webpack_require__("7333") });


/***/ }),

/***/ "fab2":
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__("7726").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var setPublicPath_i
  if ((setPublicPath_i = window.document.currentScript) && (setPublicPath_i = setPublicPath_i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
    __webpack_require__.p = setPublicPath_i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.replace.js
var es6_regexp_replace = __webpack_require__("a481");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.constructor.js
var es6_regexp_constructor = __webpack_require__("3b2b");

// EXTERNAL MODULE: external {"commonjs":"vue","commonjs2":"vue","root":"Vue"}
var external_commonjs_vue_commonjs2_vue_root_Vue_ = __webpack_require__("8bbf");
var external_commonjs_vue_commonjs2_vue_root_Vue_default = /*#__PURE__*/__webpack_require__.n(external_commonjs_vue_commonjs2_vue_root_Vue_);

// CONCATENATED MODULE: ./src/relocate.js




var getWindowSize = function getWindowSize() {
  var ww = window.innerWidth;
  var wh = window.innerHeight;
  return {
    width: ww,
    height: wh
  };
};

var getPosition = function getPosition(el) {
  var rect = el.getBoundingClientRect();
  return {
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    x: rect.x,
    y: rect.y
  };
};

var removeClassByPrefix = function removeClassByPrefix(el, prefix) {
  var regx = new RegExp('\\b' + prefix + '(.*)?\\b', 'g');
  el.className = el.className.replace(regx, '');
  return el;
};

var relocate = function relocate(el) {
  var pos = getPosition(el);
  var win = getWindowSize();
  var pos1 = 'right';
  var pos2 = 'bottom';

  if (pos.width + pos.left > win.width - 20) {
    pos1 = 'left';
  }

  if (pos.height + pos.top > win.height) {
    pos2 = 'top';
  }

  el.classList.add('position-' + pos1 + '-' + pos2);
};

/* harmony default export */ var src_relocate = ({
  componentUpdated: function componentUpdated(el, binding) {
    if (!binding.value) {
      setTimeout(function () {
        removeClassByPrefix(el, 'position-');
      }, 400);
      return;
    }

    if (binding.value !== binding.oldValue) {
      external_commonjs_vue_commonjs2_vue_root_Vue_default.a.nextTick(function () {
        relocate(el);
      });
    }
  }
});
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Tabs/VaTab.vue?vue&type=template&id=5ed09608&
var VaTabvue_type_template_id_5ed09608_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',{directives:[{name:"show",rawName:"v-show",value:(_vm.isActive),expression:"isActive"}],attrs:{"id":_vm.hash}},[_vm._t("default")],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/Tabs/VaTab.vue?vue&type=template&id=5ed09608&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.function.name.js
var es6_function_name = __webpack_require__("7f7f");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.number.constructor.js
var es6_number_constructor = __webpack_require__("c5f6");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Tabs/VaTab.vue?vue&type=script&lang=js&



//
//
//
//
//
//
/* harmony default export */ var VaTabvue_type_script_lang_js_ = ({
  name: 'VaTab',
  props: {
    id: {
      type: Number,
      default: null
    },
    name: {
      type: String,
      required: true
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      isActive: false,
      isVisible: true
    };
  },
  computed: {
    header: function header() {
      return this.name;
    },
    hash: function hash() {
      if (this.isDisabled) {
        return '#';
      }

      return this.id ? '#' + this.id : '#' + this.name.toLowerCase().replace(/ /g, '-');
    }
  }
});
// CONCATENATED MODULE: ./src/Tabs/VaTab.vue?vue&type=script&lang=js&
 /* harmony default export */ var Tabs_VaTabvue_type_script_lang_js_ = (VaTabvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./src/Tabs/VaTab.vue





/* normalize component */

var component = normalizeComponent(
  Tabs_VaTabvue_type_script_lang_js_,
  VaTabvue_type_template_id_5ed09608_render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

component.options.__file = "VaTab.vue"
/* harmony default export */ var VaTab = (component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Form/VaForm.vue?vue&type=template&id=233fbcf4&
var VaFormvue_type_template_id_233fbcf4_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('form',{class:_vm.classObj,attrs:{"id":_vm.id,"name":_vm.name},on:{"submit":function($event){$event.preventDefault();return _vm.noop($event)}}},[_vm._t("default")],2)}
var VaFormvue_type_template_id_233fbcf4_staticRenderFns = []


// CONCATENATED MODULE: ./src/Form/VaForm.vue?vue&type=template&id=233fbcf4&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.assign.js
var es6_object_assign = __webpack_require__("f751");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es7.array.includes.js
var es7_array_includes = __webpack_require__("6762");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.string.includes.js
var es6_string_includes = __webpack_require__("2fdb");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.to-string.js
var es6_regexp_to_string = __webpack_require__("6b54");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}
// CONCATENATED MODULE: ./src/utils/type.js


// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
/* harmony default export */ var utils_type = ({
  isArray: function isArray(arg) {
    if (Array.isArray) {
      return Array.isArray(arg);
    }

    return this.objectToString(arg) === '[object Array]';
  },
  isBoolean: function isBoolean(arg) {
    return typeof arg === 'boolean';
  },
  isNull: function isNull(arg) {
    return arg === null;
  },
  isNullOrUndefined: function isNullOrUndefined(arg) {
    return arg == null;
  },
  isNumber: function isNumber(arg) {
    return typeof arg === 'number';
  },
  isString: function isString(arg) {
    return typeof arg === 'string';
  },
  isSymbol: function isSymbol(arg) {
    return _typeof(arg) === 'symbol';
  },
  isUndefined: function isUndefined(arg) {
    return arg === void 0;
  },
  isRegExp: function isRegExp(re) {
    return this.objectToString(re) === '[object RegExp]';
  },
  isObject: function isObject(arg) {
    return _typeof(arg) === 'object' && arg !== null;
  },
  isDate: function isDate(d) {
    return this.objectToString(d) === '[object Date]';
  },
  isError: function isError(e) {
    return this.objectToString(e) === '[object Error]' || e instanceof Error;
  },
  isFunction: function isFunction(arg) {
    return typeof arg === 'function';
  },
  isPrimitive: function isPrimitive(arg) {
    return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || _typeof(arg) === 'symbol' || // ES6 symbol
    typeof arg === 'undefined';
  },
  objectToString: function objectToString(o) {
    return Object.prototype.toString.call(o);
  },
  isPromise: function isPromise(promise) {
    return this.isObject(promise) && this.isFunction(promise.then) && this.isFunction(promise.catch);
  }
});
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__("ac6a");

// CONCATENATED MODULE: ./src/utils/events.js



function _broadcast(componentName, eventName, params) {
  this.$children.forEach(function (child) {
    var name = child.$options.name;

    if (name === componentName) {
      child.$emit(eventName, params);
    } else {
      _broadcast.call(child, componentName, eventName, params);
    }
  });
}

/* harmony default export */ var events = ({
  methods: {
    dispatch: function dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.name;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.name;
        }
      }

      if (parent) {
        parent.$emit(eventName, params);
      }
    },
    broadcast: function broadcast(componentName, eventName, params) {
      _broadcast.call(this, componentName, eventName, params);
    }
  }
});
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Form/VaForm.vue?vue&type=script&lang=js&




//
//
//
//
//
//


/* harmony default export */ var VaFormvue_type_script_lang_js_ = ({
  name: 'VaForm',
  mixins: [events],
  props: {
    id: {
      type: String
    },
    name: {
      type: String
    },
    type: {
      type: String,
      default: 'horizontal',
      required: false,
      validator: function validator(v) {
        return ['horizontal', 'inline', 'vertical'].includes(v);
      },
      note: 'The type of form to render. See documentation example.'
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  methods: {
    noop: function noop() {},
    validateFields: function validateFields(cb) {
      var _this = this;

      this.validate = true;
      this.$nextTick(function () {
        if (utils_type.isFunction(cb)) {
          cb(_this.result);
        }
      });
    }
  },
  watch: {
    validate: function validate(val) {
      this.broadcast('VaValidate', 'Va@openValidate', val);

      if (val) {
        this.result = this._result;
      } else {
        this.result = {
          results: {},
          isvalid: true
        };
      }
    },
    result: function result(val) {
      if (this.validate) {
        this.$emit('change', val);
      }
    }
  },
  mounted: function mounted() {
    if (!this.validate) {
      this.result = {
        results: {},
        isvalid: true
      };
    }

    this.broadcast('VaValidate', 'Va@openValidate', this.validate);
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          type = this.type;
      var klass = {};
      klass[prefixCls + '-form-horizontal'] = type === 'horizontal';
      klass[prefixCls + '-form-inline'] = type === 'inline';
      klass['clearfix'] = true;
      return klass;
    }
  },
  created: function created() {
    var _this2 = this;

    this.$on('openValidate', function () {
      _this2.validate = true;
    });
    this.$on('closeValidate', function () {
      _this2.validate = false;
    });
    this.$on('Va@validateChange', function (val) {
      var name = val.name;
      var validateResult = Object.assign({}, _this2._result);
      if (!validateResult.results) validateResult.results = {};
      validateResult.results[name] = val.result;
      validateResult.isvalid = true;

      for (var i in validateResult.results) {
        if (!validateResult.results[i]['isvalid']) {
          validateResult.isvalid = false;
          break;
        }
      }

      _this2._result = validateResult;

      if (_this2.validate) {
        _this2.result = _this2._result;

        _this2.$emit('validateChange', _this2.result);
      }
    });
  },
  data: function data() {
    return {
      // eslint-disable-next-line
      _result: {
        results: {},
        isvalid: true
      },
      result: {
        results: {},
        isvalid: true
      },
      validate: false
    };
  }
});
// CONCATENATED MODULE: ./src/Form/VaForm.vue?vue&type=script&lang=js&
 /* harmony default export */ var Form_VaFormvue_type_script_lang_js_ = (VaFormvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Form/VaForm.vue





/* normalize component */

var VaForm_component = normalizeComponent(
  Form_VaFormvue_type_script_lang_js_,
  VaFormvue_type_template_id_233fbcf4_render,
  VaFormvue_type_template_id_233fbcf4_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaForm_component.options.__file = "VaForm.vue"
/* harmony default export */ var VaForm = (VaForm_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Grid/VaRow.vue?vue&type=template&id=88bd9850&
var VaRowvue_type_template_id_88bd9850_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:(_vm.prefixCls + "-row"),style:(_vm.styles)},[_vm._t("default")],2)}
var VaRowvue_type_template_id_88bd9850_staticRenderFns = []


// CONCATENATED MODULE: ./src/Grid/VaRow.vue?vue&type=template&id=88bd9850&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Grid/VaRow.vue?vue&type=script&lang=js&


//
//
//
//
//
//
/* harmony default export */ var VaRowvue_type_script_lang_js_ = ({
  name: 'VaRow',
  props: {
    gutter: {
      type: Number,
      default: 0
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  computed: {
    styles: function styles() {
      var _this = this;

      var ret = {};
      var half = Math.floor(this.gutter / 2);
      ret.marginLeft = ret.marginRight = "".concat(-half, "px");
      this.$nextTick(function () {
        _this.$children.forEach(function (children) {
          children.$el.style.paddingLeft = children.$el.style.paddingRight = "".concat(half, "px");
          children.$el.style.marginBottom = _this.gutter + 'px';
        });
      });
      return ret;
    }
  }
});
// CONCATENATED MODULE: ./src/Grid/VaRow.vue?vue&type=script&lang=js&
 /* harmony default export */ var Grid_VaRowvue_type_script_lang_js_ = (VaRowvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Grid/VaRow.vue





/* normalize component */

var VaRow_component = normalizeComponent(
  Grid_VaRowvue_type_script_lang_js_,
  VaRowvue_type_template_id_88bd9850_render,
  VaRowvue_type_template_id_88bd9850_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaRow_component.options.__file = "VaRow.vue"
/* harmony default export */ var VaRow = (VaRow_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Icon/VaIcon.vue?vue&type=template&id=f09bdb28&
var VaIconvue_type_template_id_f09bdb28_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('i',{class:[_vm.fontStyle, 'fa-' + _vm.type],style:({fontSize:_vm.size,color:_vm.color,margin:_vm.margin,backgroundColor:_vm.bgColor,borderRadius:'4px',padding:_vm.padding})},[_vm._t("default")],2)}
var VaIconvue_type_template_id_f09bdb28_staticRenderFns = []


// CONCATENATED MODULE: ./src/Icon/VaIcon.vue?vue&type=template&id=f09bdb28&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Icon/VaIcon.vue?vue&type=script&lang=js&


//
//
//
//
//
//
/* harmony default export */ var VaIconvue_type_script_lang_js_ = ({
  name: 'VaIcon',
  props: {
    type: {
      type: String,
      required: true,
      note: 'The type of icon: .fa-[type]'
    },
    iconStyle: {
      type: String,
      default: 'solid',
      required: false,
      note: 'Use fa-regular, fa-solid or fa-brand?',
      validator: function validator(v) {
        return ['solid', 'regular', 'brands'].includes(v);
      }
    },
    size: {
      type: String,
      required: false,
      default: '1em',
      note: 'The size, in px or em, of the icon.'
    },
    color: {
      type: String,
      required: false,
      note: 'Color to apply to the icon.'
    },
    bgColor: {
      type: String,
      default: 'transparent',
      required: false,
      note: 'Background color of the icon'
    },
    margin: {
      type: String,
      default: '0px',
      required: false,
      note: 'Margin to be applied to the outside of the icon element.'
    },
    padding: {
      type: String,
      default: '0px',
      required: false,
      note: 'Convenience prop: padding to be applied to the icon. Useful for when you need to assign a custom bgColor to an icon.'
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  computed: {
    fontStyle: function fontStyle() {
      switch (this.iconStyle) {
        case 'regular':
          return 'far';

        case 'solid':
          return 'fas';

        case 'brands':
          return 'fab';

        default:
          return 'fas';
      }
    }
  }
});
// CONCATENATED MODULE: ./src/Icon/VaIcon.vue?vue&type=script&lang=js&
 /* harmony default export */ var Icon_VaIconvue_type_script_lang_js_ = (VaIconvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Icon/VaIcon.vue





/* normalize component */

var VaIcon_component = normalizeComponent(
  Icon_VaIconvue_type_script_lang_js_,
  VaIconvue_type_template_id_f09bdb28_render,
  VaIconvue_type_template_id_f09bdb28_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaIcon_component.options.__file = "VaIcon.vue"
/* harmony default export */ var VaIcon = (VaIcon_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Page/VaPage.vue?vue&type=template&id=665063c6&
var VaPagevue_type_template_id_665063c6_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:(_vm.prefixCls + "-page-wrapper"),style:(_vm.wrapperStyleObj),on:{"scroll":_vm.onScroll}},[_c('div',{class:(_vm.prefixCls + "-page-container"),style:(_vm.containerStyleObj)},[_c('div',{class:_vm.classObj},[_vm._t("default"),_c('div',{staticStyle:{"height":"100px"}},[_vm._v(" ")])],2)])])}
var VaPagevue_type_template_id_665063c6_staticRenderFns = []


// CONCATENATED MODULE: ./src/Page/VaPage.vue?vue&type=template&id=665063c6&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Page/VaPage.vue?vue&type=script&lang=js&


//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var VaPagevue_type_script_lang_js_ = ({
  name: 'VaPage',
  mixins: [events],
  props: {
    size: {
      type: String,
      default: 'lg',
      validator: function validator(v) {
        return ['lg', 'md', 'sm'].includes(v);
      },
      note: 'The size of the page.'
    },
    article: {
      type: Boolean,
      default: false,
      note: 'When true, applies some additional CSS to header elements for more comfortable spacing.'
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    var s = this.size;
    return {
      currentDesktopMinimumWidth: 0,
      currentSidebarWidth: 240,
      currentMinibarWidth: 64,
      currentDesktopMargin: 0,
      currentTopbarHeight: 0,
      currentContentWidth: 0,
      currentWindowWidth: 0,
      isReverse: false,
      isMobile: false,
      isSplit: false,
      isRTL: false,
      bg: '#ffffff',
      sz: s
    };
  },
  mounted: function mounted() {
    var _this = this;

    setTimeout(function () {
      _this.dispatch('VaApp', 'Va@configPageSizeChange', _this.sz);
    }, 10);
  },
  created: function created() {
    var _this2 = this;

    this.$on('Va@pagePresenceCheck', function () {
      _this2.dispatch('VaApp', 'Va@pagePresenceReply', true);
    });
    this.$on('Va@desktopMinimumWidthChange', function (val) {
      _this2.currentDesktopMinimumWidth = val;
    });
    this.$on('Va@desktopMarginChange', function (val) {
      _this2.currentDesktopMargin = val;
    });
    this.$on('Va@sidebarWidthChange', function (val) {
      _this2.currentSidebarWidth = val;
    });
    this.$on('Va@topbarHeightChange', function (val) {
      _this2.currentTopbarHeight = val;
    });
    this.$on('Va@contentWidthChange', function (val) {
      _this2.currentContentWidth = val;
    });
    this.$on('Va@minibarWidthChange', function (val) {
      _this2.currentMinibarWidth = val;
    });
    this.$on('Va@windowWidthChange', function (val) {
      _this2.currentWindowWidth = val;
    });
    this.$on('Va@reverseChange', function (val) {
      _this2.isReverse = val;
    });
    this.$on('Va@pageIsMobile', function (val) {
      _this2.isMobile = val;
    });
    this.$on('Va@pageBgColorChange', function (val) {
      _this2.bg = val;
    });
    this.$on('Va@splitChange', function (val) {
      _this2.isSplit = val;
    });
    this.$on('Va@pageSizeChange', function (val) {
      _this2.sz = val;
    });
    this.$on('Va@rtlChange', function (val) {
      _this2.isRTL = val;
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.dispatch('VaApp', 'Va@pageDisconnect', true);
  },
  methods: {
    onScroll: function onScroll() {
      // this.broadcast('VaTextarea', 'Va@pageScroll', true)
      // this.broadcast('VaInput', 'Va@pageScroll', true)

      /**
       * This is probably faster than my broadcast method, and I'd
       * like for this to happen as fast as possible.
       * 
       * We're dispatching this scroll event when this element
       * is scrolled so that the VaInputOps (and other fixed
       * position elements) know to reposition themselves.
       * 
       * When a VaPage is not used, VaInput and VaTextarea
       * listen to window events, so they still work even when
       * used by themselves.
       */
      window.dispatchEvent(new Event('scroll'));
    }
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          sz = this.sz,
          article = this.article,
          isMobile = this.isMobile;
      var klass = {};
      isMobile ? klass[prefixCls + '-page-container-lg'] = true : klass[prefixCls + '-page-container-' + sz] = true;
      klass[prefixCls + '-page-container-article'] = article;
      return klass;
    },
    containerStyleObj: function containerStyleObj() {
      var style = {};
      return style;
    },
    wrapperStyleObj: function wrapperStyleObj() {
      var split = this.isSplit;
      var rtl = this.isRTL;
      var reverse = this.isReverse;
      var bg = this.bg;
      var style = {};
      var sw = parseInt(this.currentSidebarWidth);
      var mw = parseInt(this.currentMinibarWidth);
      var th = parseInt(this.currentTopbarHeight);
      var dm = parseInt(this.currentDesktopMargin);
      var dmw = parseInt(this.currentDesktopMinimumWidth);
      var cw = parseInt(this.currentContentWidth);
      var mobile = this.isMobile;
      style['background'] = bg;
      style['position'] = 'fixed';
      style['top'] = th + 'px';
      style['height'] = 'calc(100% - ' + th + 'px)';
      style['overflow-y'] = 'scroll';
      style['overflow-x'] = 'auto';
      /**
       * Adjust the margins if content width is smaller than
       * desktop minimum width.
       */

      if (!mobile) {
        if (cw < dmw) {
          var x = dmw - cw;
          dm = dm - x / 2;
        }
      } else {
        dm = 0;
        dmw = 0;
      }
      /**
       * If a minimum desktop width is set...
       */


      if (dmw !== 0) {
        style['min-width'] = dmw - mw - sw + 'px';
      } else {
        style['min-width'] = '0px';
      }
      /**
       * If it's not a split layout, then Page is only
       * concerned with the total width of the bars.
       */


      if (!split) {
        if (rtl) {
          style['left'] = dm + 'px';
          style['right'] = sw + mw + dm + 'px';
        } else {
          style['left'] = sw + mw + dm + 'px';
          style['right'] = dm + 'px';
        }
      } else {
        if (reverse) {
          style['left'] = dm + sw + 'px';
          style['right'] = dm + mw + 'px';
        } else {
          style['left'] = dm + mw + 'px';
          style['right'] = dm + sw + 'px';
        }
      }

      return style;
    }
  }
});
// CONCATENATED MODULE: ./src/Page/VaPage.vue?vue&type=script&lang=js&
 /* harmony default export */ var Page_VaPagevue_type_script_lang_js_ = (VaPagevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Page/VaPage.vue





/* normalize component */

var VaPage_component = normalizeComponent(
  Page_VaPagevue_type_script_lang_js_,
  VaPagevue_type_template_id_665063c6_render,
  VaPagevue_type_template_id_665063c6_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaPage_component.options.__file = "VaPage.vue"
/* harmony default export */ var VaPage = (VaPage_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Tabs/VaTabs.vue?vue&type=template&id=f8963e5c&
var VaTabsvue_type_template_id_f8963e5c_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('ul',{class:_vm.classObj},_vm._l((_vm.tabs),function(tab,i){return _c('li',{directives:[{name:"show",rawName:"v-show",value:(tab.isVisible),expression:"tab.isVisible"}],key:i,class:[_vm.liclassObj(tab), _vm.disabledTabClass(tab)]},[_c('a',{attrs:{"href":tab.hash},domProps:{"innerHTML":_vm._s(tab.header)},on:{"click":function($event){_vm.selectTab(tab.hash, $event)}}})])})),_c('div',{class:(_vm.prefixCls + "-tab-content")},[_vm._t("default")],2)])}
var VaTabsvue_type_template_id_f8963e5c_staticRenderFns = []


// CONCATENATED MODULE: ./src/Tabs/VaTabs.vue?vue&type=template&id=f8963e5c&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.find.js
var es6_array_find = __webpack_require__("7514");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
// CONCATENATED MODULE: ./src/utils/ExpiringStorage.js



var ExpiringStorage_ExpiringStorage =
/*#__PURE__*/
function () {
  function ExpiringStorage() {
    _classCallCheck(this, ExpiringStorage);
  }

  _createClass(ExpiringStorage, [{
    key: "get",
    value: function get(key) {
      var cached = JSON.parse(localStorage.getItem(key));

      if (!cached) {
        return null;
      }

      var expires = new Date(cached.expires);

      if (expires < new Date()) {
        localStorage.removeItem(key);
        return null;
      }

      return cached.value;
    }
  }, {
    key: "set",
    value: function set(key, value, lifetimeInMinutes) {
      var currentTime = new Date().getTime();
      var expires = new Date(currentTime + lifetimeInMinutes * 60000);
      localStorage.setItem(key, JSON.stringify({
        value: value,
        expires: expires
      }));
    }
  }]);

  return ExpiringStorage;
}();

/* harmony default export */ var utils_ExpiringStorage = (new ExpiringStorage_ExpiringStorage());
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Tabs/VaTabs.vue?vue&type=script&lang=js&



//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var VaTabsvue_type_script_lang_js_ = ({
  name: 'VaTabs',
  props: {
    cacheLifetime: {
      type: Number,
      default: 5,
      required: false
    },
    options: {
      type: Object,
      required: false,
      default: function _default() {
        return {
          useUrlFragment: false
        };
      }
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    return {
      tabs: [],
      activeTabHash: ''
    };
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls;
      var klass = {};
      klass['clearfix'] = true;
      klass[prefixCls + '-nav-tabs'] = true;
      return klass;
    },
    storageKey: function storageKey() {
      return "va-tabs.cache.".concat(window.location.host).concat(window.location.pathname);
    }
  },
  created: function created() {
    this.tabs = this.$children;
  },
  mounted: function mounted() {
    var _this = this;

    window.addEventListener('hashchange', function () {
      return _this.selectTab(window.location.hash);
    });

    if (this.findTab(window.location.hash)) {
      this.selectTab(window.location.hash);
      return;
    }

    var previousSelectedTabHash = utils_ExpiringStorage.get(this.storageKey);

    if (this.findTab(previousSelectedTabHash)) {
      this.selectTab(previousSelectedTabHash);
      return;
    }

    if (this.tabs.length) {
      this.selectTab(this.tabs[0].hash);
    }
  },
  methods: {
    findTab: function findTab(hash) {
      return this.tabs.find(function (tab) {
        return tab.hash === hash;
      });
    },
    selectTab: function selectTab(selectedTabHash, event) {
      if (event && !this.options.useUrlFragment) {
        event.preventDefault();
      }

      var selectedTab = this.findTab(selectedTabHash);

      if (!selectedTab) {
        return;
      }

      if (selectedTab.isDisabled) {
        return;
      }

      this.tabs.forEach(function (tab) {
        tab.isActive = tab.hash === selectedTab.hash;
      });
      this.$emit('changed', {
        tab: selectedTab
      });
      this.activeTabHash = selectedTab.hash;
      utils_ExpiringStorage.set(this.storageKey, selectedTab.hash, this.cacheLifetime);
    },
    setTabVisible: function setTabVisible(hash, visible) {
      var tab = this.findTab(hash);

      if (!tab) {
        return;
      }

      tab.isVisible = visible;

      if (tab.isActive) {
        tab.isActive = visible;
        this.tabs.every(function (tab, index, array) {
          if (tab.isVisible) {
            tab.isActive = true;
            return false;
          }

          return true;
        });
      }
    },
    liclassObj: function liclassObj(tab) {
      var prefixCls = this.prefixCls;
      var klass = {};
      klass[prefixCls + '-nav-tab'] = true;
      klass[prefixCls + '-nav-tab-active'] = tab.isActive;
      return klass;
    },
    disabledTabClass: function disabledTabClass(tab) {
      if (tab.isDisabled) {
        return this.prefixCls + '-nav-tab-disabled';
      } else {
        return '';
      }
    }
  }
});
// CONCATENATED MODULE: ./src/Tabs/VaTabs.vue?vue&type=script&lang=js&
 /* harmony default export */ var Tabs_VaTabsvue_type_script_lang_js_ = (VaTabsvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Tabs/VaTabs.vue





/* normalize component */

var VaTabs_component = normalizeComponent(
  Tabs_VaTabsvue_type_script_lang_js_,
  VaTabsvue_type_template_id_f8963e5c_render,
  VaTabsvue_type_template_id_f8963e5c_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaTabs_component.options.__file = "VaTabs.vue"
/* harmony default export */ var VaTabs = (VaTabs_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Toggle/VaToggle.vue?vue&type=template&id=5caaeb3d&
var VaTogglevue_type_template_id_5caaeb3d_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('label',{class:_vm.classObj,on:{"click":function($event){$event.preventDefault();}}},[_c('input',{class:(_vm.prefixCls + "-toggle__input"),attrs:{"name":_vm.name,"tabindex":"-1","type":"checkbox"},domProps:{"checked":_vm.value},on:{"keypress":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"space",32,$event.key,[" ","Spacebar"])){ return null; }$event.preventDefault();return _vm.toggle($event)}}}),_c('div',{class:(_vm.prefixCls + "-toggle__slide"),attrs:{"aria-label":_vm.label,"tabindex":_vm.disabled ? -1 : 0},on:{"click":_vm.toggle,"keypress":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"space",32,$event.key,[" ","Spacebar"])){ return null; }$event.preventDefault();return _vm.toggle($event)}}},[_c('div',{class:(_vm.prefixCls + "-toggle__inner")},[_c('span',{class:(_vm.prefixCls + "-toggle__handle")}),_c('span',{class:(_vm.prefixCls + "-toggle__icon")},[_c('va-icon',{attrs:{"type":_vm.icon}})],1)])])])}
var VaTogglevue_type_template_id_5caaeb3d_staticRenderFns = []


// CONCATENATED MODULE: ./src/Toggle/VaToggle.vue?vue&type=template&id=5caaeb3d&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Toggle/VaToggle.vue?vue&type=script&lang=js&


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var VaTogglevue_type_script_lang_js_ = ({
  name: 'VaToggle',
  props: {
    name: {
      type: String
    },
    label: {
      type: String
    },
    value: {
      type: Boolean,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'md',
      required: false,
      validator: function validator(v) {
        return ['md', 'lg'].includes(v);
      }
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  computed: {
    classObj: function classObj() {
      var classes = {};
      classes[this.prefixCls + '-toggle'] = true;
      classes[this.prefixCls + '-toggle--checked'] = this.value;
      classes[this.prefixCls + '-toggle--disabled'] = this.disabled;
      classes[this.prefixCls + '-toggle--lg'] = this.size === 'lg';
      return classes;
    },
    icon: function icon() {
      return this.value ? 'check' : 'times';
    }
  },
  methods: {
    toggle: function toggle() {
      if (this.disabled) {
        return;
      }

      var newState = !this.value;
      this.$emit('input', newState);
      this.$emit('change', newState);
    }
  }
});
// CONCATENATED MODULE: ./src/Toggle/VaToggle.vue?vue&type=script&lang=js&
 /* harmony default export */ var Toggle_VaTogglevue_type_script_lang_js_ = (VaTogglevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Toggle/VaToggle.vue





/* normalize component */

var VaToggle_component = normalizeComponent(
  Toggle_VaTogglevue_type_script_lang_js_,
  VaTogglevue_type_template_id_5caaeb3d_render,
  VaTogglevue_type_template_id_5caaeb3d_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaToggle_component.options.__file = "VaToggle.vue"
/* harmony default export */ var VaToggle = (VaToggle_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Card/VaCard.vue?vue&type=template&id=8df52de8&
var VaCardvue_type_template_id_8df52de8_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.classObj},[(_vm.hasHeaderData)?_c('div',{class:_vm.headerClassObj,style:(_vm.headerStyleObj)},[_c('div',{class:(_vm.prefixCls + "-card-header-inner")},[_c('div',{class:(_vm.prefixCls + "-card-header-inner-left")},[_vm._t("left")],2),_c('div',{class:(_vm.prefixCls + "-card-header-inner-right")},[_vm._t("right")],2)])]):_vm._e(),_c('div',{class:(_vm.prefixCls + "-card-body"),style:(_vm.bodyStyleObj)},[_vm._t("default")],2)])}
var VaCardvue_type_template_id_8df52de8_staticRenderFns = []


// CONCATENATED MODULE: ./src/Card/VaCard.vue?vue&type=template&id=8df52de8&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Card/VaCard.vue?vue&type=script&lang=js&




//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var VaCardvue_type_script_lang_js_ = ({
  name: 'VaCard',
  props: {
    elevation: {
      type: [Number, String],
      default: 0,
      validator: function validator(v) {
        v = v.toString();
        return ['0', '1', '2', '3', '4', '5'].includes(v);
      },
      note: 'Defines the size of the box-shadow on the card to give the illusion of distance from the canvas.'
    },
    padding: {
      type: [Number, String],
      default: '1em',
      note: 'A convenience prop to help define the card\'s inner padding.'
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          elevation = this.elevation;
      var klass = {};
      klass[prefixCls + '-card'] = true;
      klass[prefixCls + '-card-elevation-' + elevation] = true;
      return klass;
    },
    bodyStyleObj: function bodyStyleObj() {
      var padding = this.padding;
      var style = {};
      style['padding'] = padding;
      return style;
    },
    headerClassObj: function headerClassObj() {
      var prefixCls = this.prefixCls;
      var klass = {};
      klass[prefixCls + '-card-header'] = true;
      return klass;
    },
    headerStyleObj: function headerStyleObj() {
      var padding = this.padding;
      var style = {};
      style['padding-left'] = padding;
      style['padding-right'] = padding;
      return style;
    },
    hasHeaderData: function hasHeaderData() {
      return this.$slots.left || this.$slots.right;
    }
  }
});
// CONCATENATED MODULE: ./src/Card/VaCard.vue?vue&type=script&lang=js&
 /* harmony default export */ var Card_VaCardvue_type_script_lang_js_ = (VaCardvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Card/VaCard.vue





/* normalize component */

var VaCard_component = normalizeComponent(
  Card_VaCardvue_type_script_lang_js_,
  VaCardvue_type_template_id_8df52de8_render,
  VaCardvue_type_template_id_8df52de8_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaCard_component.options.__file = "VaCard.vue"
/* harmony default export */ var VaCard = (VaCard_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Range/VaRange.vue?vue&type=template&id=4217d5bb&
var VaRangevue_type_template_id_4217d5bb_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"wrap",style:({width: _vm.width || '100%'})},[_c('input',{ref:"range",class:(_vm.prefixCls + "-range"),attrs:{"type":"range","name":_vm.name,"min":_vm.min,"max":_vm.max,"step":_vm.step},domProps:{"value":_vm.currentValue},on:{"input":_vm.onInput}}),_c('transition',{attrs:{"name":"fade"}},[(_vm.showoutput)?_c('div',{staticClass:"output_position"},[_c('output',{attrs:{"for":"r"}})]):_vm._e()])],1)}
var VaRangevue_type_template_id_4217d5bb_staticRenderFns = []


// CONCATENATED MODULE: ./src/Range/VaRange.vue?vue&type=template&id=4217d5bb&

// CONCATENATED MODULE: ./src/utils/EventListener.js
var EventListener = {
  /**
   * Listen to DOM events during the bubble phase.
   *
   * @param {DOMEventTarget} target DOM element to register listener on.
   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
   * @param {function} callback Callback function.
   * @param {object} Object with a 'remove' method.
   */
  listen: function listen(target, eventType, callback) {
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, false);
      return {
        remove: function remove() {
          target.removeEventListener(eventType, callback, false);
        }
      };
    } else if (target.attachEvent) {
      target.attachEvent('on' + eventType, callback);
      return {
        remove: function remove() {
          target.detachEvent('on' + eventType, callback);
        }
      };
    }
  }
};
/* harmony default export */ var utils_EventListener = (EventListener);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Range/VaRange.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var VaRangevue_type_script_lang_js_ = ({
  name: 'VaRange',
  mixins: [events],
  props: {
    name: {
      type: String
    },
    min: {
      type: [String, Number],
      default: '0',
      required: false
    },
    max: {
      type: [String, Number],
      default: '100',
      required: false
    },
    step: {
      type: [String, Number],
      default: '1',
      required: false
    },
    value: {
      type: [Number, String],
      default: 0,
      required: false
    },
    width: {
      type: String
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    var value = this.value;
    return {
      showoutput: false,
      currentValue: value,
      preBarElement: null,
      isMobile: false
    };
  },
  watch: {
    currentValue: function currentValue(val) {
      this.$emit('input', val);
      this.$emit('change', val);
      this.update();
    },
    value: function value(val) {
      this.currentValue = parseInt(val);
    },
    min: function min(val) {
      this.update();
    },
    max: function max(val) {
      this.update();
    },
    step: function step(val) {
      this.update();
    }
  },
  methods: {
    update: function update() {
      this.preBarElement.style.width = this.getVal() + 'px';
    },
    onInput: function onInput(e) {
      this.currentValue = parseInt(e.target.value);
      this.$emit('input', parseInt(e.target.value));
    },
    getVal: function getVal() {
      if (!this.$refs.range) return;
      var w = parseInt(this.$refs.range.clientWidth, 10);
      var cv = parseInt(this.currentValue, 10);
      var min = parseInt(this.min, 10);
      var max = parseInt(this.max, 10);
      /**
      *  I wonder if there's a way to figure out the width of the runnable track..
      *  Right now, we listen for isMobile from App.
      *  Width is 16px on desktop, 28px on mobile.
      */

      var thumbWidth;
      this.isMobile ? thumbWidth = 28 : thumbWidth = 16;
      max = max - min;
      cv = cv - min;
      min = min - min;

      if (min === 0 && max === 100) {
        return cv * w / 100 - cv * thumbWidth / 100; // because the thumb is 16px wide
      } else {
        var p = cv * 100 / max;
        var pp = p * w / 100;
        pp = pp - p * thumbWidth / 100;
        return pp;
      }
    },
    init: function init() {
      var _this = this;

      var prefixCls = this.prefixCls;
      var wrp = document.createElement('div');
      var preBar = document.createElement('p');
      wrp.className = prefixCls + '-range-barCnt';
      preBar.className = prefixCls + '-range-preBar';
      this.$refs.range.className = this.$refs.range.className.length ? this.$refs.range.className + ' colorized' : 'colorized';
      this.$refs.range.parentNode.replaceChild(wrp, this.$refs.range);
      wrp.appendChild(this.$refs.range);
      wrp.appendChild(preBar);
      var r = this.$refs.range;
      this._inputEvent = utils_EventListener.listen(r, 'input', function () {
        preBar.style.width = _this.getVal() + 'px';
      });
      this.$nextTick(function () {
        preBar.style.width = _this.getVal() + 'px';
      });
      this.$refs.range.value = this.value;
      this.preBarElement = preBar;
    },
    _resizeEvent: function _resizeEvent() {
      this.update();
    }
  },
  computed: {
    styleObj: function styleObj() {
      var style = {};
      var l = this.value - this.min;
      var r = this.max - this.min;
      style['transform'] = 'translate(calc(' + l / r + ' * 11.25em - 50%))';
      return style;
    }
  },
  created: function created() {
    var _this2 = this;

    this.$on('Va@rangeIsMobile', function (val) {
      if (val === true) {
        _this2.isMobile = true;
      } else {
        _this2.isMobile = false;
      }
    });
    this.dispatch('VaApp', 'Va@requestIsMobile', true);
  },
  mounted: function mounted() {
    this.init();
    window.addEventListener('resize', this._resizeEvent, false);
  },
  beforeDestroy: function beforeDestroy() {
    if (this._inputEvent) this._inputEvent.remove();
    if (this._mouseupEvent) this._mouseupEvent.remove();
    if (this._mousedownEvent) this._mousedownEvent.remove();
    /**
     * This event was not created using EventListener.
     */

    window.removeEventListener('resize', this._resizeEvent, false);
  }
});
// CONCATENATED MODULE: ./src/Range/VaRange.vue?vue&type=script&lang=js&
 /* harmony default export */ var Range_VaRangevue_type_script_lang_js_ = (VaRangevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Range/VaRange.vue





/* normalize component */

var VaRange_component = normalizeComponent(
  Range_VaRangevue_type_script_lang_js_,
  VaRangevue_type_template_id_4217d5bb_render,
  VaRangevue_type_template_id_4217d5bb_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaRange_component.options.__file = "VaRange.vue"
/* harmony default export */ var VaRange = (VaRange_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Aside/VaAside.vue?vue&type=template&id=71567a80&
var VaAsidevue_type_template_id_71567a80_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":(this.placement === 'left') ? 'slideleft' : 'slideright'}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.show),expression:"show"}],ref:"aside",class:_vm.classObj,style:({width:_vm.width})},[_c('div',{class:(_vm.prefixCls + "-aside-dialog")},[_c('div',{class:(_vm.prefixCls + "-aside-content")},[(_vm.header)?_c('div',{class:(_vm.prefixCls + "-aside-header")},[_c('button',{class:(_vm.prefixCls + "-close"),attrs:{"type":"button"},on:{"click":_vm.close}},[_c('span',[_vm._v("×")])]),_c('div',{class:(_vm.prefixCls + "-aside-title")},[_vm._v(_vm._s(_vm.title))])]):_vm._e(),_c('div',{class:(_vm.prefixCls + "-aside-body")},[_vm._t("default")],2)])])])])}
var VaAsidevue_type_template_id_71567a80_staticRenderFns = []


// CONCATENATED MODULE: ./src/Aside/VaAside.vue?vue&type=template&id=71567a80&

// EXTERNAL MODULE: ./node_modules/focus-trap/index.js
var focus_trap = __webpack_require__("6c92");
var focus_trap_default = /*#__PURE__*/__webpack_require__.n(focus_trap);

// CONCATENATED MODULE: ./src/utils/element.js



// browser environment sniffing
var inBrowser = typeof window !== 'undefined' && Object.prototype.toString.call(window) !== '[object Object]'; // UA sniffing for working around browser-specific quirks

var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
/**
 * for IE9 compatibility: when both class and :class are present
 * getAttribute('class') returns wrong value..
 *
 * @param {Element} el
 * @return {String}
 */

function getClass(el) {
  var classname = el.className;

  if (_typeof(classname) === 'object') {
    classname = classname.baseVal || '';
  }

  return classname;
}
/**
 * in IE9, setAttribute('class') will result in empty class
 * if the element also has the :class attribute; however in
 * phantomJS, setting `className` does not work on SVG elements..
 * so we have to do a conditional check here.
 *
 * @param {Element} el
 * @param {String} cls
 */


function setClass(el, cls) {
  if (isIE9 && !/svg$/.test(el.namespaceURI)) {
    el.className = cls;
  } else {
    el.setAttribute('class', cls);
  }
}
/**
 * add class with compatibility for IE & SVG
 *
 * @param {Element} el
 * @param {String} cls
 */


function addClass(el, cls) {
  if (el.classList) {
    el.classList.add(cls);
  } else {
    var cur = ' ' + getClass(el) + ' ';

    if (cur.indexOf(' ' + cls + ' ') < 0) {
      setClass(el, (cur + cls).trim());
    }
  }
}
/**
 * remove class with compatibility for IE & SVG
 *
 * @param {Element} el
 * @param {String} cls
 */


function removeClass(el, cls) {
  if (el.classList) {
    el.classList.remove(cls);
  } else {
    var cur = ' ' + getClass(el) + ' ';
    var tar = ' ' + cls + ' ';

    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }

    setClass(el, cur.trim());
  }

  if (!el.className) {
    el.removeAttribute('class');
  }
}

/* harmony default export */ var utils_element = ({
  getClass: getClass,
  removeClass: removeClass,
  addClass: addClass,
  setClass: setClass,
  inBrowser: inBrowser,
  UA: UA,
  isIE9: isIE9
});
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Aside/VaAside.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

 // import getScrollBarWidth from '../utils/getScrollBarWidth'


/* harmony default export */ var VaAsidevue_type_script_lang_js_ = ({
  name: 'VaAside',
  props: {
    placement: {
      type: String,
      default: 'left',
      required: false,
      note: 'What side of the window to appear at.'
    },
    title: {
      type: String,
      default: '',
      required: false,
      note: 'If header is true, this will be the inside of it.'
    },
    header: {
      type: Boolean,
      default: false,
      required: false,
      note: 'If true, header will be shown.'
    },
    width: {
      type: String,
      default: '304px',
      required: false,
      note: 'Width of the aside element.'
    },
    prefixCls: {
      type: String,
      default: 'va',
      required: false
    }
  },
  data: function data() {
    return {
      show: false,
      focusTrap: null
    };
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          placement = this.placement;
      var klass = {};
      klass[prefixCls + '-aside'] = true;
      klass[prefixCls + '-aside-left'] = placement === 'left';
      klass[prefixCls + '-aside-right'] = placement === 'right';
      return klass;
    }
  },
  created: function created() {
    var _this = this;

    var escapeHandler = function escapeHandler(e) {
      if (e.key === 'Escape' && _this.show) {
        _this.close();
      }
    };

    document.addEventListener('keydown', escapeHandler);
    this.$once('hook:destroyed', function () {
      document.removeEventListener('keydown', escapeHandler);
    });
  },
  mounted: function mounted() {
    var _this2 = this;

    document.querySelector('body').appendChild(this.$refs.aside);
    this.$once('hook:beforeDestroy', function () {
      document.querySelector('body').removeChild(_this2.$refs.aside);
    });
    this.focusTrap = focus_trap_default()(this.$refs.aside, {
      clickOutsideDeactivates: true,
      returnFocusOnDeactivate: true,
      fallbackFocus: this.$refs.aside
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.performClose();
  },
  watch: {
    show: function show(val) {
      var _this3 = this;

      var backdrop = document.createElement('div');
      var prefixCls = this.prefixCls;
      var body = document.body;
      backdrop.className = prefixCls + '-aside-backdrop';

      if (val) {
        body.appendChild(backdrop);
        utils_element.addClass(body, prefixCls + '-modal-open'); // This timeout is included to allow for opacity transition.

        setTimeout(function () {
          backdrop.className += ' ' + prefixCls + '-aside-in';
          _this3._clickEvent = utils_EventListener.listen(backdrop, 'click', _this3.close);

          _this3.$emit('show');
        }, 20);
        this.focusTrap.activate();
      } else {
        this.focusTrap.deactivate();
        this.performClose();
      }
    }
  },
  methods: {
    open: function open() {
      this.show = true;
    },
    close: function close() {
      this.show = false;
    },
    performClose: function performClose() {
      if (this._clickEvent) this._clickEvent.remove();
      var body = document.body;
      var prefixCls = this.prefixCls;
      var backdrop = document.querySelector('.' + prefixCls + '-aside-backdrop');

      if (backdrop) {
        backdrop.className = prefixCls + '-aside-backdrop';
        setTimeout(function () {
          utils_element.removeClass(body, prefixCls + '-modal-open');
          body.removeChild(backdrop);
        }, 300);
        this.$emit('hide');
      }
    }
  }
});
// CONCATENATED MODULE: ./src/Aside/VaAside.vue?vue&type=script&lang=js&
 /* harmony default export */ var Aside_VaAsidevue_type_script_lang_js_ = (VaAsidevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Aside/VaAside.vue





/* normalize component */

var VaAside_component = normalizeComponent(
  Aside_VaAsidevue_type_script_lang_js_,
  VaAsidevue_type_template_id_71567a80_render,
  VaAsidevue_type_template_id_71567a80_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaAside_component.options.__file = "VaAside.vue"
/* harmony default export */ var VaAside = (VaAside_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Affix/VaAffix.vue?vue&type=template&id=306beaa9&
var VaAffixvue_type_template_id_306beaa9_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:(_vm.prefixCls + "-affix"),style:(_vm.affixStyle)},[_vm._t("default")],2)}
var VaAffixvue_type_template_id_306beaa9_staticRenderFns = []


// CONCATENATED MODULE: ./src/Affix/VaAffix.vue?vue&type=template&id=306beaa9&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Affix/VaAffix.vue?vue&type=script&lang=js&

//
//
//
//
//
//
/* harmony default export */ var VaAffixvue_type_script_lang_js_ = ({
  name: 'VaAffix',
  props: {
    offset: {
      type: [Number, String],
      default: 0,
      required: false,
      note: 'Vertical offset distance to affix to'
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  computed: {
    affixStyle: function affixStyle() {
      return {
        top: "".concat(this.offset, "px")
      };
    }
  }
});
// CONCATENATED MODULE: ./src/Affix/VaAffix.vue?vue&type=script&lang=js&
 /* harmony default export */ var Affix_VaAffixvue_type_script_lang_js_ = (VaAffixvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Affix/VaAffix.vue





/* normalize component */

var VaAffix_component = normalizeComponent(
  Affix_VaAffixvue_type_script_lang_js_,
  VaAffixvue_type_template_id_306beaa9_render,
  VaAffixvue_type_template_id_306beaa9_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaAffix_component.options.__file = "VaAffix.vue"
/* harmony default export */ var VaAffix = (VaAffix_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Table/VaTable.vue?vue&type=template&id=a347d7b4&
var VaTablevue_type_template_id_a347d7b4_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.classObj},[_vm._t("default")],2)}
var VaTablevue_type_template_id_a347d7b4_staticRenderFns = []


// CONCATENATED MODULE: ./src/Table/VaTable.vue?vue&type=template&id=a347d7b4&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Table/VaTable.vue?vue&type=script&lang=js&


//
//
//
//
//
//
/* harmony default export */ var VaTablevue_type_script_lang_js_ = ({
  name: 'VaTable',
  props: {
    hover: {
      type: Boolean,
      default: false,
      required: false,
      note: 'When true, changes the background color of rows when hovering.'
    },
    size: {
      type: String,
      default: 'lg',
      validator: function validator(v) {
        return ['lg', 'md', 'sm'].includes(v);
      },
      note: 'The size of the table.'
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          size = this.size,
          hover = this.hover;
      var klass = {};
      klass[prefixCls + '-table'] = true;
      klass[prefixCls + '-table-' + size] = true;
      klass[prefixCls + '-table-hover'] = hover;
      return klass;
    }
  }
});
// CONCATENATED MODULE: ./src/Table/VaTable.vue?vue&type=script&lang=js&
 /* harmony default export */ var Table_VaTablevue_type_script_lang_js_ = (VaTablevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Table/VaTable.vue





/* normalize component */

var VaTable_component = normalizeComponent(
  Table_VaTablevue_type_script_lang_js_,
  VaTablevue_type_template_id_a347d7b4_render,
  VaTablevue_type_template_id_a347d7b4_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaTable_component.options.__file = "VaTable.vue"
/* harmony default export */ var VaTable = (VaTable_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Modal/VaModal.vue?vue&type=template&id=77d01789&
var VaModalvue_type_template_id_77d01789_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"modal",class:_vm.classObj,style:(_vm.styleObj)},[_c('div',{class:(_vm.prefixCls + "-modal-dialog"),style:({'width': _vm.width })},[(_vm.modalIsLoading)?_c('div',{class:(_vm.prefixCls + "-modal-loading")},[_c('va-loading',{attrs:{"color":"#888","size":"md"}})],1):_c('div',{class:(_vm.prefixCls + "-modal-content")},[_vm._t("header",[_c('div',{class:(_vm.prefixCls + "-modal-header")},[_c('va-button',{class:(_vm.prefixCls + "-close"),attrs:{"tabindex":"-1","type":"subtle"},on:{"click":_vm.close}},[_c('va-icon',{attrs:{"type":"times"}})],1),_c('div',{class:(_vm.prefixCls + "-modal-title")},[_vm._t("title",[_vm._v("\n                                "+_vm._s(_vm.title)+"\n                            ")])],2)],1)]),_c('div',{class:(_vm.prefixCls + "-modal-body")},[_vm._t("body")],2),_c('div',{class:(_vm.prefixCls + "-modal-footer")},[_vm._t("footer",[_c('va-button',{attrs:{"focused":_vm.focused,"type":"primary"},nativeOn:{"click":function($event){return _vm.confirm($event)}}},[_vm._v("\n                            "+_vm._s(_vm.getL('confirm'))+"\n                        ")]),_c('va-button',{attrs:{"type":"subtle"},nativeOn:{"click":function($event){return _vm.close($event)}}},[_vm._v("\n                            "+_vm._s(_vm.getL('cancel'))+"\n                        ")])])],2)],2)])])}
var VaModalvue_type_template_id_77d01789_staticRenderFns = []


// CONCATENATED MODULE: ./src/Modal/VaModal.vue?vue&type=template&id=77d01789&

// CONCATENATED MODULE: ./src/utils/getScrollBarWidth.js
/* harmony default export */ var getScrollBarWidth = (function () {
  var inner = document.createElement('p');
  inner.style.width = '100%';
  inner.style.height = '200px';
  var outer = document.createElement('div');
  outer.style.position = 'absolute';
  outer.style.top = '0px';
  outer.style.left = '0px';
  outer.style.visibility = 'hidden';
  outer.style.width = '200px';
  outer.style.height = '150px';
  outer.style.overflow = 'hidden';
  outer.appendChild(inner);
  document.body.appendChild(outer);
  var w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  var w2 = inner.offsetWidth;
  if (w1 === w2) w2 = outer.clientWidth;
  document.body.removeChild(outer);
  return w1 - w2;
});
// CONCATENATED MODULE: ./src/Locale/VaModal.js
/* harmony default export */ var VaModal = ({
  confirm: {
    en: 'Confirm',
    es: 'Confirmar',
    fr: 'Confirmer'
  },
  cancel: {
    en: 'Cancel',
    es: 'Cancelar',
    fr: 'Annuler'
  }
});
// CONCATENATED MODULE: ./src/Locale/VaSelect.js
/* harmony default export */ var VaSelect = ({
  all: {
    en: 'All',
    es: 'Todos',
    fr: 'Tous'
  }
});
// CONCATENATED MODULE: ./src/Locale/VaValidate.js
/* harmony default export */ var VaValidate = ({
  required: {
    en: 'This field is required',
    es: 'Este campo es requerido',
    fr: 'Ce champs est requis'
  },
  maxLength: {
    en: 'Input can not be longer than ',
    es: 'La entrada no puede ser más larga que ',
    fr: 'Le nombre de caractère doit être inférieur ou égale à '
  },
  minLength: {
    en: 'Input can not be less than ',
    es: 'La entrada no puede ser menor que ',
    fr: 'Le nombre de caractère doit être supérieur ou égale à '
  },
  phone: {
    en: 'Please enter a valid phone number',
    es: 'Por favor ingrese un número de teléfono válido',
    fr: "Merci d'inscrire un numéro de téléphone valide"
  },
  number: {
    en: 'Numbers only',
    es: 'Solo numeros',
    fr: 'Chiffres uniquement'
  },
  telephone: {
    en: 'Please enter a valid telephone number',
    es: 'Por favor introduce un número de teléfono válido',
    fr: "Merci d'inscrire un numéro de téléphone valide"
  },
  email: {
    en: 'Please enter a valid email address',
    es: 'Por favor, introduce una dirección de correo electrónico válida',
    fr: "Merci d'inscrire une adresse email valide"
  }
});
// CONCATENATED MODULE: ./src/Locale/VaDatepicker.js
/* harmony default export */ var VaDatepicker = ({
  sunday: {
    en: 'Sun',
    es: 'Do',
    fr: 'Dim'
  },
  monday: {
    en: 'Mon',
    es: 'Lu',
    fr: 'Lun'
  },
  tuesday: {
    en: 'Tue',
    es: 'Ma',
    fr: 'Mar'
  },
  wednesday: {
    en: 'Wed',
    es: 'Mi',
    fr: 'Mer'
  },
  thursday: {
    en: 'Thu',
    es: 'Ju',
    fr: 'Jeu'
  },
  friday: {
    en: 'Fri',
    es: 'Vi',
    fr: 'Ven'
  },
  saturday: {
    en: 'Sat',
    es: 'Sá',
    fr: 'Sam'
  },
  january: {
    en: 'January',
    es: 'Ene',
    fr: 'Janvier'
  },
  february: {
    en: 'February',
    es: 'Feb',
    fr: 'Février'
  },
  march: {
    en: 'March',
    es: 'Mar',
    fr: 'Mars'
  },
  april: {
    en: 'April',
    es: 'Abr',
    fr: 'Avril'
  },
  may: {
    en: 'May',
    es: 'May',
    fr: 'Mai'
  },
  june: {
    en: 'June',
    es: 'Jun',
    fr: 'Juin'
  },
  july: {
    en: 'July',
    es: 'Jul',
    fr: 'Juillet'
  },
  august: {
    en: 'August',
    es: 'Aug',
    fr: 'Août'
  },
  september: {
    en: 'September',
    es: 'Sep',
    fr: 'Septembre'
  },
  october: {
    en: 'October',
    es: 'Oct',
    fr: 'Octobre'
  },
  november: {
    en: 'November',
    es: 'Nov',
    fr: 'Novembre'
  },
  december: {
    en: 'December',
    es: 'Dec',
    fr: 'Décembre'
  }
});
// CONCATENATED MODULE: ./src/Locale/VaTimepicker.js
/* harmony default export */ var VaTimepicker = ({
  hour: {
    en: 'H',
    es: 'H',
    fr: 'H'
  },
  minute: {
    en: 'M',
    es: 'M',
    fr: 'M'
  },
  second: {
    en: 'S',
    es: 'S',
    fr: 'S'
  }
});
// CONCATENATED MODULE: ./src/Locale/index.js





/* harmony default export */ var Locale = ({
  VaModal: VaModal,
  VaSelect: VaSelect,
  VaValidate: VaValidate,
  VaDatepicker: VaDatepicker,
  VaTimepicker: VaTimepicker
});
// CONCATENATED MODULE: ./src/Mixin/localeMixin.js


/* harmony default export */ var localeMixin = (function (name) {
  return {
    methods: {
      getL: function getL(key) {
        return Locale[name][key][this.VaLocale || window.VaLocale || 'en'];
      }
    }
  };
});
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Modal/VaModal.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ var VaModalvue_type_script_lang_js_ = ({
  name: 'VaModal',
  mixins: [localeMixin('VaModal')],
  props: {
    title: {
      type: String,
      default: '',
      required: false,
      note: 'The title of the modal'
    },
    show: {
      type: Boolean,
      default: false,
      required: false,
      note: 'When false, the modal will not be shown'
    },
    width: {
      type: String,
      default: '600px',
      required: false,
      note: 'The width of the modal.'
    },
    effect: {
      type: String,
      default: 'fade-up',
      required: false,
      note: 'The css effect to apply to the modal. See _modal.scss'
    },
    loading: {
      type: Boolean,
      default: false,
      note: 'When true, modal shows its loading state/'
    },
    backdrop: {
      type: Boolean,
      default: true,
      required: false
    },
    backdropClickable: {
      type: Boolean,
      default: true,
      required: false,
      note: 'When true, clicking the backdrop in a standard or custom modal will close the modal. This prop has no effect on alert or confirm modals.'
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    var show = this.show;
    return {
      isShow: show,
      focused: false,
      numberOfParentModals: 0,
      focusTrap: null
    };
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          effect = this.effect;
      var klass = {};
      klass[prefixCls + '-modal'] = true;
      klass[prefixCls + '-modal-' + effect] = true;
      return klass;
    },
    styleObj: function styleObj() {
      var backdrop = this.backdrop,
          numberOfParentModals = this.numberOfParentModals;
      var style = {};

      if (!backdrop) {
        style['background'] = 'none !important';
      }

      var topMargin = parseInt(numberOfParentModals) * 10;
      style['padding-top'] = topMargin + 'px';
      return style;
    },
    modalIsLoading: function modalIsLoading() {
      return this.loading;
    }
  },
  created: function created() {
    var _this = this;

    var escapeHandler = function escapeHandler(e) {
      if (e.key === 'Escape' && _this.isTop()) {
        _this.close();
      }
    };

    document.addEventListener('keydown', escapeHandler);
    this.$once('hook:destroyed', function () {
      document.removeEventListener('keydown', escapeHandler);
    });
  },
  mounted: function mounted() {
    var _this2 = this;

    this.focusTrap = focus_trap_default()(this.$refs.modal, {
      clickOutsideDeactivates: true,
      returnFocusOnDeactivate: true,
      fallbackFocus: this.$refs.modal
    });
    document.querySelector('body').appendChild(this.$refs.modal);
    this.$once('hook:beforeDestroy', function () {
      document.querySelector('body').removeChild(_this2.$refs.modal);
    });
  },
  watch: {
    isShow: function isShow(val) {
      var _this3 = this;

      /**
       * Stackable logic
       */
      if (val) {
        this.$emit('show', {
          type: 'show'
        });
        var x = document.getElementsByClassName(this.prefixCls + '-modal-in');
        this.numberOfParentModals = x.length;
        /**
         * If any parent modals do exist, then let's stack them in a
         * nicely fashion, by moving each over to the left a bit.
         */

        var distanceToMove = 20;

        if (this.numberOfParentModals > 0) {
          for (var i = 0; i < this.numberOfParentModals; i++) {
            var currentMarginLeft = x[i].style['margin-left'];

            if (currentMarginLeft && currentMarginLeft !== '0px') {
              /**
               * If this modal already has a margin-left applied,
               * then we must have hit it already. If that's the case,
               * then we simply double the value by whatever it
               * already is.
               */
              // Slice 'px' off from the end.
              var m = Math.abs(currentMarginLeft.slice(0, -2));
              var dist = parseInt(m + distanceToMove);
              x[i].style['margin-left'] = '-' + dist + 'px';
            } else {
              /**
               * If the modal does not already have a margin-left,
               * then we just move it over by distanceToMove.
               */
              x[i].style['margin-left'] = distanceToMove * -1 + 'px';
            }
          }
        }
      } else {
        this.$emit('hide', {
          type: 'hide'
        });

        var _x = document.getElementsByClassName(this.prefixCls + '-modal-in');

        this.numberOfParentModals = _x.length;
        var _distanceToMove = 20;

        if (this.numberOfParentModals > 0) {
          for (var _i = 0; _i < this.numberOfParentModals; _i++) {
            var _currentMarginLeft = _x[_i].style['margin-left'];

            if (_currentMarginLeft && _currentMarginLeft !== '0px') {
              var _m = Math.abs(_currentMarginLeft.slice(0, -2));

              var _dist = parseInt(_m - _distanceToMove);

              _x[_i].style['margin-left'] = '-' + _dist + 'px';
            } else {//
            }
          }
        }
      }
      /**
       * Classes
       */


      var el = this.$el;
      var body = document.body;
      var scrollBarWidth = getScrollBarWidth();

      if (val) {
        el.querySelector('.' + this.prefixCls + '-modal-content').focus();
        el.style.display = 'block'; // this timeout is required for opacity transition

        setTimeout(function () {
          utils_element.addClass(el, _this3.prefixCls + '-modal-in');
        }, 20);
        utils_element.addClass(body, this.prefixCls + '-modal-open');

        if (!scrollBarWidth) {
          utils_element.addClass(body, this.prefixCls + '-modal-hide-y');
        }

        if (this.backdropClickable) {
          this._blurModalContentEvent = utils_EventListener.listen(this.$el, 'click', function (e) {
            if (e.target === el) _this3.isShow = false;
          });
        }

        this.focusTrap.activate();
      } else {
        if (this._blurModalContentEvent) this._blurModalContentEvent.remove();
        utils_element.removeClass(el, this.prefixCls + '-modal-in');
        utils_element.addClass(el, this.prefixCls + '-modal-out');
        setTimeout(function () {
          el.style.display = 'none';
          utils_element.removeClass(body, _this3.prefixCls + '-modal-open');
          utils_element.removeClass(body, _this3.prefixCls + '-modal-hide-y');
          utils_element.removeClass(el, _this3.prefixCls + '-modal-out');
          body.style.paddingRight = '0';

          _this3.$emit('closed', {
            type: 'closed'
          });
        }, 300);
        this.focusTrap.deactivate();
      }
    }
  },
  methods: {
    isTop: function isTop() {
      return this.isShow && (!this.$refs.modal.style['margin-left'] || this.$refs.modal.style['margin-left'] === '0px');
    },
    close: function close() {
      this.isShow = false;
    },
    open: function open() {
      this.isShow = true;
    },
    confirm: function confirm() {
      this.$emit('confirm', {
        type: 'confirm'
      });
    }
  }
});
// CONCATENATED MODULE: ./src/Modal/VaModal.vue?vue&type=script&lang=js&
 /* harmony default export */ var Modal_VaModalvue_type_script_lang_js_ = (VaModalvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Modal/VaModal.vue





/* normalize component */

var VaModal_component = normalizeComponent(
  Modal_VaModalvue_type_script_lang_js_,
  VaModalvue_type_template_id_77d01789_render,
  VaModalvue_type_template_id_77d01789_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaModal_component.options.__file = "VaModal.vue"
/* harmony default export */ var Modal_VaModal = (VaModal_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Badge/VaBadge.vue?vue&type=template&id=5cb6e8c8&
var VaBadgevue_type_template_id_5cb6e8c8_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{class:_vm.classObj,style:({margin:_vm.margin})},[_vm._t("default")],2)}
var VaBadgevue_type_template_id_5cb6e8c8_staticRenderFns = []


// CONCATENATED MODULE: ./src/Badge/VaBadge.vue?vue&type=template&id=5cb6e8c8&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Badge/VaBadge.vue?vue&type=script&lang=js&


//
//
//
//
//
//
/* harmony default export */ var VaBadgevue_type_script_lang_js_ = ({
  name: 'VaBadge',
  props: {
    type: {
      type: String,
      default: 'default',
      required: false,
      validator: function validator(v) {
        return ['default', 'primary', 'success', 'info', 'warning', 'danger'].includes(v);
      },
      note: 'The style of badge to render.'
    },
    margin: {
      type: String,
      default: '0px',
      required: false,
      note: 'Margin to be applied to the outside of the badge element.'
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          type = this.type;
      var klass = {};
      klass[prefixCls + '-badge'] = true;
      klass[prefixCls + '-badge-' + type] = true;
      return klass;
    }
  }
});
// CONCATENATED MODULE: ./src/Badge/VaBadge.vue?vue&type=script&lang=js&
 /* harmony default export */ var Badge_VaBadgevue_type_script_lang_js_ = (VaBadgevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Badge/VaBadge.vue





/* normalize component */

var VaBadge_component = normalizeComponent(
  Badge_VaBadgevue_type_script_lang_js_,
  VaBadgevue_type_template_id_5cb6e8c8_render,
  VaBadgevue_type_template_id_5cb6e8c8_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaBadge_component.options.__file = "VaBadge.vue"
/* harmony default export */ var VaBadge = (VaBadge_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Radio/VaRadio.vue?vue&type=template&id=0c98c61a&
var VaRadiovue_type_template_id_0c98c61a_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('label',{class:(_vm.prefixCls + "-radio-con")},[_c('span',{class:_vm.objClass},[_c('span',{class:(_vm.prefixCls + "-radio-inner"),attrs:{"tabindex":_vm.disabled ? -1 : 0},on:{"keypress":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"space",32,$event.key,[" ","Spacebar"])){ return null; }$event.preventDefault();return _vm.handleClick($event)},"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.handleClick($event)}}}),_c('input',{class:(_vm.prefixCls + "-radio-input"),attrs:{"disabled":_vm.disabled,"name":_vm.name,"tabindex":"-1","type":"radio"},domProps:{"checked":_vm.currentChecked},on:{"click":function($event){$event.preventDefault();return _vm.handleClick($event)}}})]),_c('span',{class:(_vm.prefixCls + "-label"),attrs:{"tabindex":"-1"}},[_vm._t("default")],2),_c('validate',{attrs:{"current":_vm.checked,"custom-validate":_vm.customValidate,"name":_vm.name,"rules":_vm.rules}})],1)}
var VaRadiovue_type_template_id_0c98c61a_staticRenderFns = []


// CONCATENATED MODULE: ./src/Radio/VaRadio.vue?vue&type=template&id=0c98c61a&

// CONCATENATED MODULE: ./src/Mixin/validationMixin.js
/* harmony default export */ var validationMixin = ({
  props: {
    name: {
      type: String,
      note: 'For validation: name of the validation element.'
    },
    customValidate: {
      type: Function
    },
    rules: {
      type: Array,
      note: 'For validation: custom validation rules.'
    }
  }
});
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/validate.vue?vue&type=template&id=a17fcdca&
var validatevue_type_template_id_a17fcdca_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.validate && _vm.tips)?_c('div',{class:(_vm.prefixCls + "-err-tip")},[_c('va-icon',{attrs:{"type":"exclamation-triangle","color":"#DE350B"}}),_vm._v("\n    "+_vm._s(_vm.tips)+"\n  ")],1):_vm._e()}
var validatevue_type_template_id_a17fcdca_staticRenderFns = []


// CONCATENATED MODULE: ./src/validate.vue?vue&type=template&id=a17fcdca&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.split.js
var es6_regexp_split = __webpack_require__("28a5");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.iterator.js
var es6_array_iterator = __webpack_require__("cadf");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.keys.js
var es6_object_keys = __webpack_require__("456d");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/validate.vue?vue&type=script&lang=js&






//
//
//
//
//
//
//



/* harmony default export */ var validatevue_type_script_lang_js_ = ({
  name: 'VaValidate',
  mixins: [events, localeMixin('VaValidate')],
  props: {
    value: {
      type: String
    },
    customValidate: {
      type: Function
    },
    rules: {
      type: Array
    },
    name: {
      type: String
    },
    current: {},
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    return {
      tips: '',
      validate: false,
      status: '',
      vStatus: this.value,
      results: {}
    };
  },
  created: function created() {
    var _this = this;

    this.$on('Va@openValidate', function (val) {
      _this.validate = val;
      val ? _this.vStatus = _this.status : _this.vStatus = '';
    });
  },
  computed: {
    _results: {
      get: function get() {
        return this.resuts;
      },
      set: function set(val, oldVal) {
        var self = this;
        var tips = '';
        var status = '';

        for (var key in val) {
          var obj = val[key];

          if (utils_type.isObject(obj)) {
            obj.tips ? tips += obj.tips + '  ' : '';

            if (obj.validStatus !== 'success') {
              status = 'error';
            }
          }
        }

        status !== 'error' ? status = 'success' : 0;
        self.status = status;

        if (self.validate) {
          self.vStatus = self.status;
        }

        var isvalid = true;
        self.tips = tips;

        for (var i in val) {
          var validStatus = val[i]['validStatus'];

          if (validStatus === 'error') {
            isvalid = false;
            break;
          }
        }

        var newVal = Object.assign({}, val);
        newVal.isvalid = isvalid;

        if (this.isEqual(newVal, this.results)) {
          return;
        }

        this.results = newVal;
        self.dispatch('VaForm', 'Va@validateChange', {
          name: self.name,
          result: self.results
        });
      }
    }
  },
  watch: {
    current: {
      handler: function handler(newVal, oldVal) {
        this.valid(newVal);
      },
      immediate: true
    },
    vStatus: function vStatus(val) {
      this.$emit('input', val);
    }
  },
  methods: {
    isEqual: function isEqual(a, b) {
      var e = true;
      var propsA = Object.keys(a);
      var propsB = Object.keys(b);

      if (propsA.length !== propsB.length) {
        return false;
      }

      propsA.forEach(function (i) {
        if (a[i]['validStatus'] !== b[i]['validStatus']) {
          e = false;
          return false;
        }
      });
      return e;
    },
    setResult: function setResult(key, value) {
      var o = Object.assign({}, this.results);
      o[key] = value;
      this._results = o;
    },
    valid: function valid(val) {
      if (this.rules || utils_type.isFunction(this.customValidate)) {
        this.rulesValid(val);
      }
    },
    rulesItemValid: function rulesItemValid(rule, value) {
      var self = this;
      var tip = rule.tip;
      var type = rule.type;

      switch (type) {
        case 'required':
          self.requiredValid(value, tip);
          break;

        case 'phone':
          self.phoneValid(value, tip);
          break;

        case 'number':
          self.numberValid(value, tip);
          break;

        case 'telephone':
          self.telValid(value, tip);
          break;

        case 'email':
          self.emailValid(value, tip);
          break;
      }

      if (type.indexOf('maxlength') > -1) {
        self.maxlengthValid(type, value, tip); // eslint-disable-next-line

        return;
      }

      if (type.indexOf('minlength') > -1) {
        self.minlengthValid(type, value, tip); // eslint-disable-next-line

        return;
      }
    },
    customValid: function customValid(val) {
      this.setResult('customValidate', this.customValidate(val));
    },
    requiredValid: function requiredValid(val, tip) {
      var self = this;
      self._results = self._results || {};

      if (utils_type.isNullOrUndefined(val) || val.length === 0) {
        self.setResult('requiredValid', {
          validStatus: 'error',
          tips: tip || self.getL('required')
        });
      } else {
        self.setResult('requiredValid', {
          validStatus: 'success',
          tips: ''
        });
      }
    },
    maxlengthValid: function maxlengthValid(type, val, tip) {
      var self = this;
      var maxlength = type.split('=')[1] - 0;
      self._results = self._results || {};

      if (val) {
        if (val.length > maxlength) {
          self.setResult('maxlengthValid', {
            validStatus: 'error',
            tips: tip || self.getL('maxLength') + maxlength
          });
        } else {
          self.setResult('maxlengthValid', {
            validStatus: 'success',
            tips: ''
          });
        }
      }
    },
    minlengthValid: function minlengthValid(type, val, tip) {
      var self = this;
      var minlength = type.split('=')[1] - 0;
      self._results = self._results || {};

      if (val) {
        if (val.length < minlength) {
          self.setResult('minlengthValid', {
            validStatus: 'error',
            tips: tip || self.getL('minLength') + minlength
          });
        } else {
          self.setResult('minlengthValid', {
            validStatus: 'success',
            tips: ''
          });
        }
      }
    },
    rulesValid: function rulesValid(value) {
      var self = this;
      self.rules.forEach(function (val, index) {
        self.rulesItemValid(val, value);
      });

      if (utils_type.isFunction(self.customValidate)) {
        self.customValid(value);
      }
    },
    phoneValid: function phoneValid(value, tip) {
      var rule = /^1\d{10}$/;

      if (rule.test(value) || value === '') {
        this.setResult('isPhoneValid', {
          validStatus: 'success',
          tips: ''
        });
      } else {
        this.setResult('isPhoneValid', {
          validStatus: 'error',
          tips: tip || this.getL('phone')
        });
      }
    },
    numberValid: function numberValid(value, tip) {
      var rule = /^\d*$/;

      if (rule.test(value) || value === '') {
        this.setResult('isNumberValid', {
          validStatus: 'success',
          tips: ''
        });
      } else {
        this.setResult('isNumberValid', {
          validStatus: 'error',
          tips: tip || this.getL('number')
        });
      }
    },
    telValid: function telValid(value, tip) {
      // eslint-disable-next-line
      var rule = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;

      if (rule.test(value) || value === '') {
        this.setResult('isTelValid', {
          validStatus: 'success',
          tips: ''
        });
      } else {
        this.setResult('isTelValid', {
          validStatus: 'error',
          tips: tip || this.getL('telephone')
        });
      }
    },
    emailValid: function emailValid(value, tip) {
      var rule = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

      if (rule.test(value) || value === '') {
        this.setResult('isEmailValid', {
          validStatus: 'success',
          tips: ''
        });
      } else {
        this.setResult('isEmailValid', {
          validStatus: 'error',
          tips: tip || this.getL('email')
        });
      }
    }
  }
});
// CONCATENATED MODULE: ./src/validate.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_validatevue_type_script_lang_js_ = (validatevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/validate.vue





/* normalize component */

var validate_component = normalizeComponent(
  src_validatevue_type_script_lang_js_,
  validatevue_type_template_id_a17fcdca_render,
  validatevue_type_template_id_a17fcdca_staticRenderFns,
  false,
  null,
  null,
  null
  
)

validate_component.options.__file = "validate.vue"
/* harmony default export */ var validate = (validate_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Radio/VaRadio.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ var VaRadiovue_type_script_lang_js_ = ({
  name: 'VaRadio',
  mixins: [validationMixin, events],
  props: {
    name: {
      type: String
    },
    value: {
      type: String
    },
    checked: {
      type: Boolean,
      default: false
    },
    label: {
      type: [String, Number]
    },
    disabled: {
      type: Boolean,
      default: false
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  components: {
    validate: validate
  },
  data: function data() {
    var checked = this.checked;

    if (checked !== undefined) {
      this.$emit('input', checked);
    } else {
      checked = !!this.value;
    }

    return {
      currentChecked: checked
    };
  },
  computed: {
    objClass: function objClass() {
      var prefixCls = this.prefixCls,
          currentChecked = this.currentChecked,
          disabled = this.disabled;
      var klass = {};
      klass[prefixCls + '-radio-span'] = true;
      klass[prefixCls + '-radio-checked'] = currentChecked;
      klass[prefixCls + '-radio-disabled'] = disabled;
      return klass;
    }
  },
  watch: {
    value: function value(val) {
      this.currentChecked = val;
    },
    checked: function checked(val) {
      this.currentChecked = val;
    },
    currentChecked: function currentChecked(val) {
      this.$emit('input', val);
    }
  },
  created: function created() {
    var _this = this;

    this.$on('Va@radiogroupChange', function (val) {
      // this.currentChecked = val.indexOf(this.label) > -1
      _this.currentChecked = val === _this.label;
    });
  },
  methods: {
    handleClick: function handleClick() {
      if (this.currentChecked) return;
      this.currentChecked = true;
      this.dispatch('VaRadioGroup', 'Va@radioChange', this.label);
      this.$emit('change', this.currentChecked);
    }
  }
});
// CONCATENATED MODULE: ./src/Radio/VaRadio.vue?vue&type=script&lang=js&
 /* harmony default export */ var Radio_VaRadiovue_type_script_lang_js_ = (VaRadiovue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Radio/VaRadio.vue





/* normalize component */

var VaRadio_component = normalizeComponent(
  Radio_VaRadiovue_type_script_lang_js_,
  VaRadiovue_type_template_id_0c98c61a_render,
  VaRadiovue_type_template_id_0c98c61a_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaRadio_component.options.__file = "VaRadio.vue"
/* harmony default export */ var VaRadio = (VaRadio_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Input/VaInput.vue?vue&type=template&id=4265ed0e&
var VaInputvue_type_template_id_4265ed0e_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (!_vm.showButtonsWarning)?_c('div',{class:_vm.classObj,style:({'width': _vm.width})},[(_vm.noVModel)?_c('input',{ref:"input",class:_vm.inputClassObj,style:({'width': _vm.width}),attrs:{"auto-complete":"off","name":_vm.name,"readonly":_vm.readonly,"disabled":_vm.disabled,"placeholder":_vm.placeholder,"autofocus":_vm.autofocus,"type":_vm.type,"tabindex":"0"},domProps:{"value":_vm.value},on:{"blur":_vm.blur,"focus":_vm.focus,"input":function($event){_vm.update($event.target.value)},"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.enterPressed($event)}}}):((_vm.type)==='checkbox')?_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.currentValue),expression:"currentValue"}],ref:"input",class:_vm.inputClassObj,style:({'width': _vm.width}),attrs:{"auto-complete":"off","name":_vm.name,"readonly":_vm.readonly,"disabled":_vm.disabled,"placeholder":_vm.placeholder,"autofocus":_vm.autofocus,"tabindex":"0","type":"checkbox"},domProps:{"value":_vm.value,"checked":Array.isArray(_vm.currentValue)?_vm._i(_vm.currentValue,_vm.value)>-1:(_vm.currentValue)},on:{"blur":_vm.blur,"focus":_vm.focus,"input":function($event){_vm.update($event.target.value)},"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.enterPressed($event)},"change":function($event){var $$a=_vm.currentValue,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=_vm.value,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.currentValue=$$a.concat([$$v]))}else{$$i>-1&&(_vm.currentValue=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{_vm.currentValue=$$c}}}}):((_vm.type)==='radio')?_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.currentValue),expression:"currentValue"}],ref:"input",class:_vm.inputClassObj,style:({'width': _vm.width}),attrs:{"auto-complete":"off","name":_vm.name,"readonly":_vm.readonly,"disabled":_vm.disabled,"placeholder":_vm.placeholder,"autofocus":_vm.autofocus,"tabindex":"0","type":"radio"},domProps:{"value":_vm.value,"checked":_vm._q(_vm.currentValue,_vm.value)},on:{"blur":_vm.blur,"focus":_vm.focus,"input":function($event){_vm.update($event.target.value)},"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.enterPressed($event)},"change":function($event){_vm.currentValue=_vm.value}}}):_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.currentValue),expression:"currentValue"}],ref:"input",class:_vm.inputClassObj,style:({'width': _vm.width}),attrs:{"auto-complete":"off","name":_vm.name,"readonly":_vm.readonly,"disabled":_vm.disabled,"placeholder":_vm.placeholder,"autofocus":_vm.autofocus,"tabindex":"0","type":_vm.type},domProps:{"value":_vm.value,"value":(_vm.currentValue)},on:{"blur":_vm.blur,"focus":_vm.focus,"input":[function($event){if($event.target.composing){ return; }_vm.currentValue=$event.target.value},function($event){_vm.update($event.target.value)}],"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.enterPressed($event)}}}),(_vm.buttons)?_c('va-input-ops',{attrs:{"parent-position":_vm.position},on:{"confirm":_vm.opsConfirm,"cancel":_vm.opsCancel}}):_vm._e(),_c('div',{class:(_vm.prefixCls + "-input-icon-wrapper")},[(_vm.showClean)?_c('va-icon',{class:(_vm.prefixCls + "-input-show-clean"),attrs:{"type":"times","icon-style":"solid"},nativeOn:{"click":function($event){$event.stopPropagation();return _vm.clean($event)}}}):_vm._e(),(_vm.icon !== undefined)?_c('va-icon',{class:(_vm.prefixCls + "-input-show-icon"),attrs:{"type":_vm.icon,"icon-style":_vm.iconStyle}}):_vm._e()],1),_c('validate',{attrs:{"name":_vm.name,"rules":_vm.rules,"custom-validate":_vm.customValidate,"current":_vm.value},model:{value:(_vm.validStatus),callback:function ($$v) {_vm.validStatus=$$v},expression:"validStatus"}})],1):_c('div',[_c('va-alert',{attrs:{"type":"warning"}},[_c('h4',[_vm._v("Hold on")]),_c('p',[_vm._v("\n        If you're going to use "),_c('b',[_vm._v("buttons")]),_vm._v(" with this input component, you need\n        to also use the "),_c('b',[_vm._v("loading")]),_vm._v(" prop.\n\n        Handle the "),_c('b',[_vm._v("@confirm")]),_vm._v(" event emitted by the input component by setting the\n        "),_c('b',[_vm._v("loading")]),_vm._v(" prop to true, "),_c('i',[_vm._v("doing some task")]),_vm._v(", and finally setting the\n        "),_c('b',[_vm._v("loading")]),_vm._v(" prop back to false.\n\n        It is important that events happen in that order, because the input component\n        is watching the "),_c('b',[_vm._v("loading")]),_vm._v(" prop for those changes. That's how it knows to hide\n        the confirm and cancel buttons.\n      ")])])],1)}
var VaInputvue_type_template_id_4265ed0e_staticRenderFns = []


// CONCATENATED MODULE: ./src/Input/VaInput.vue?vue&type=template&id=4265ed0e&

// CONCATENATED MODULE: ./src/Mixin/inputMixin.js
/* harmony default export */ var inputMixin = ({
  props: {
    name: {
      type: String
    },
    disabled: {
      type: Boolean
    },
    placeholder: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '220px'
    },
    customValidate: {
      type: Function
    },
    rules: {
      type: Array
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      validStatus: ''
    };
  }
});
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Input/VaInput.vue?vue&type=script&lang=js&



//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


 // import { focus } from 'vue-focus'

/* harmony default export */ var VaInputvue_type_script_lang_js_ = ({
  name: 'VaInput',
  mixins: [inputMixin, events],
  props: {
    value: {
      type: [String, Number]
    },
    size: {
      type: String
    },
    onChange: {
      type: Function
    },
    type: {
      type: String,
      default: 'text'
    },
    icon: {
      type: String
    },
    iconStyle: {
      type: String,
      default: 'regular',
      required: false
    },
    showClean: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false,
      required: false
    },
    buttons: {
      type: Boolean,
      default: false,
      required: false
    },
    loading: {
      type: Boolean,
      default: undefined
    },
    noVModel: {
      type: Boolean,
      default: false,
      required: false
    },
    theme: {
      type: String,
      default: 'primary',
      required: false,
      validator: function validator(v) {
        return ['default', 'primary', 'success', 'warning', 'danger', 'purple'].includes(v);
      }
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    var cv = this.value;
    return {
      focused: false,
      currentValue: cv,
      position: {},
      showButtonsWarning: false
    };
  },
  created: function created() {
    var _this = this;

    this.$on('Va@inputOpsCancel', function (val) {
      _this.currentValue = val;
    });
    this.$on('Va@inputOpsConfirm', function () {});
    this.$on('Va@inputOpsBlur', function () {
      _this.focused = false;
    });
    this.$on('Va@pageScroll', function () {
      _this.setPosition();
    });
  },
  mounted: function mounted() {
    window.addEventListener('resize', this.setPosition, false);
    window.addEventListener('scroll', this.setPosition, false);

    if (this.buttons && this.loading === undefined) {
      this.showButtonsWarning = true;
    }

    if (this.autofocus) {
      this.focused = true;
    }
  },
  beforeDestroy: function beforeDestroy() {
    window.removeEventListener('scroll', this.setPosition, false);
  },
  components: {
    validate: validate
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          validStatus = this.validStatus,
          showClean = this.showClean,
          size = this.size,
          icon = this.icon;
      var klass = {};
      klass[prefixCls + '-has-error'] = validStatus === 'error';
      klass[prefixCls + '-has-success'] = validStatus === 'success';
      klass[prefixCls + '-has-warn'] = validStatus === 'warn';
      klass[prefixCls + '-input-con'] = true;
      klass[prefixCls + '-show-clean'] = showClean;
      klass[prefixCls + '-show-icon'] = icon ? true : false;
      size ? klass[prefixCls + '-input-' + size] = true : '';
      klass['inline'] = true;
      return klass;
    },
    inputClassObj: function inputClassObj() {
      var prefixCls = this.prefixCls,
          theme = this.theme;
      var klass = {};
      klass[prefixCls + '-form-control'] = true;
      klass[prefixCls + '-form-control-' + theme] = true;
      return klass;
    }
  },
  watch: {
    loading: function loading(val) {
      this.broadcast('VaInputOps', 'Va@inputLoading', val);
    },
    currentValue: function currentValue(val) {
      this.broadcast('VaInputOps', 'Va@inputCurrentValueUpdate', val);
    },
    value: function value(val) {
      this.currentValue = val;
    }
  },
  methods: {
    clean: function clean() {
      this.$emit('input', '');
      this.$emit('clean');
      this.$refs.input.focus();
    },
    update: function update(val) {
      this.$emit('input', val);
      this.$emit('change', val);

      if (this.buttons) {
        this.broadcast('VaInputOps', 'Va@inputUpdate', this.currentValue);
      }
    },
    blur: function blur() {
      this.focused = false;
      this.$emit('blur', this.value);

      if (this.buttons) {
        this.broadcast('VaInputOps', 'Va@inputBlur', this.currentValue);
      }
    },
    focus: function focus() {
      var _this2 = this;

      /**
       * This setTimeout exists because sometimes you'll want to call
       * this.$refs.input.focus() when the input is inside of something
       * like, say, a dropdown. We need to give the element time to be
       * added to the DOM before we send a focus event to it.
       * 
       * This short timeout provides, what seems like, a fine amount of
       * time for this to happen without being noticable by the human eye.
       */
      setTimeout(function () {
        _this2.$refs.input.focus();

        _this2.$emit('focus', _this2.value);

        _this2.focused = true;

        if (_this2.buttons) {
          _this2.position = _this2.getPosition();

          _this2.broadcast('VaInputOps', 'Va@inputFocus', _this2.currentValue);
        }
      }, 20);
    },
    enterPressed: function enterPressed() {
      this.opsConfirm();
    },
    setPosition: function setPosition() {
      this.position = this.getPosition();
    },
    getPosition: function getPosition() {
      var rect = this.$refs.input.getBoundingClientRect();
      return {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y
      };
    },
    opsConfirm: function opsConfirm() {
      // if (this.buttons) {
      //   this.broadcast('VaInputOps', 'Va@inputEnterPressed', this.currentValue)
      // }
      this.$emit('confirm', this.value);
    },
    opsCancel: function opsCancel() {
      this.$emit('cancel');
    }
  }
});
// CONCATENATED MODULE: ./src/Input/VaInput.vue?vue&type=script&lang=js&
 /* harmony default export */ var Input_VaInputvue_type_script_lang_js_ = (VaInputvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Input/VaInput.vue





/* normalize component */

var VaInput_component = normalizeComponent(
  Input_VaInputvue_type_script_lang_js_,
  VaInputvue_type_template_id_4265ed0e_render,
  VaInputvue_type_template_id_4265ed0e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaInput_component.options.__file = "VaInput.vue"
/* harmony default export */ var VaInput = (VaInput_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Alert/VaAlert.vue?vue&type=template&id=df6e104e&
var VaAlertvue_type_template_id_df6e104e_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.classObj},[_vm._t("default")],2)}
var VaAlertvue_type_template_id_df6e104e_staticRenderFns = []


// CONCATENATED MODULE: ./src/Alert/VaAlert.vue?vue&type=template&id=df6e104e&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Alert/VaAlert.vue?vue&type=script&lang=js&


//
//
//
//
//
//
/* harmony default export */ var VaAlertvue_type_script_lang_js_ = ({
  name: 'VaAlert',
  props: {
    title: {
      type: String,
      required: false,
      note: 'The title to be rendered.'
    },
    type: {
      type: String,
      default: 'warning',
      required: false,
      validator: function validator(v) {
        return ['success', 'info', 'warning', 'danger'].includes(v);
      },
      note: 'The type of alert to render.'
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          type = this.type;
      var klass = {};
      klass[prefixCls + '-alert'] = true;
      klass[prefixCls + '-alert-' + type] = true;
      return klass;
    }
  }
});
// CONCATENATED MODULE: ./src/Alert/VaAlert.vue?vue&type=script&lang=js&
 /* harmony default export */ var Alert_VaAlertvue_type_script_lang_js_ = (VaAlertvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Alert/VaAlert.vue





/* normalize component */

var VaAlert_component = normalizeComponent(
  Alert_VaAlertvue_type_script_lang_js_,
  VaAlertvue_type_template_id_df6e104e_render,
  VaAlertvue_type_template_id_df6e104e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaAlert_component.options.__file = "VaAlert.vue"
/* harmony default export */ var VaAlert = (VaAlert_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Select/VaOption.vue?vue&type=template&id=08b73651&
var VaOptionvue_type_template_id_08b73651_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('li',{staticStyle:{"position":"relative"}},[_c('a',{class:_vm.classes,on:{"click":function($event){$event.preventDefault();_vm.selectOption(_vm.option)}}},[_vm._t("default",[_vm._v(_vm._s(_vm.fullLabel))])],2)])}
var VaOptionvue_type_template_id_08b73651_staticRenderFns = []


// CONCATENATED MODULE: ./src/Select/VaOption.vue?vue&type=template&id=08b73651&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Select/VaOption.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
/* harmony default export */ var VaOptionvue_type_script_lang_js_ = ({
  name: 'VaOption',
  inject: ['addSelectOption', 'isOptionSelected', 'selectOption'],
  props: {
    value: {
      type: String
    },
    label: {
      type: String,
      required: false
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  computed: {
    fullLabel: function fullLabel() {
      return this.label || this.value;
    },
    option: function option() {
      return {
        label: this.fullLabel,
        value: this.value
      };
    },
    classes: function classes() {
      var classes = {};
      classes["".concat(this.prefixCls, "-select-item-active")] = this.isOptionSelected(this.option);
      return classes;
    }
  },
  mounted: function mounted() {
    this.addSelectOption(this.value, this.fullLabel);
  }
});
// CONCATENATED MODULE: ./src/Select/VaOption.vue?vue&type=script&lang=js&
 /* harmony default export */ var Select_VaOptionvue_type_script_lang_js_ = (VaOptionvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Select/VaOption.vue





/* normalize component */

var VaOption_component = normalizeComponent(
  Select_VaOptionvue_type_script_lang_js_,
  VaOptionvue_type_template_id_08b73651_render,
  VaOptionvue_type_template_id_08b73651_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaOption_component.options.__file = "VaOption.vue"
/* harmony default export */ var VaOption = (VaOption_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Select/VaSelect.vue?vue&type=template&id=981095da&
var VaSelectvue_type_template_id_981095da_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.classObj},[_c('va-button',{ref:"button",class:[(_vm.prefixCls + "-dropdown-toggle"), (_vm.prefixCls + "-select-btn"), _vm.showSelected && _vm.multiple && _vm.value.length ? (_vm.prefixCls + "-select-multiple") : '', _vm.show ? (_vm.prefixCls + "-select-btn-open") : ''],style:({width:_vm.width}),attrs:{"disabled":_vm.disabled,"size":_vm.size,"type":_vm.type},nativeOn:{"click":function($event){return _vm.toggleDropdown($event)}}},[(_vm.showPlaceholder || !_vm.showSelected)?_c('span',{class:(_vm.prefixCls + "-select-placeholder")},[_vm._v(_vm._s(_vm.placeholder))]):_vm._e(),(_vm.showSelected)?_c('span',{staticStyle:{"display":"flex"}},[(_vm.multiple)?_vm._l((_vm.selectedItems),function(item,index){return _c('div',{key:index,staticClass:"inline",class:(_vm.prefixCls + "-selected-tag"),attrs:{"tabindex":"0"},on:{"click":function($event){$event.stopPropagation();_vm.del(item)}}},[_c('span',{class:(_vm.prefixCls + "-selected-tag__label")},[_vm._t("item",[_c('span',{domProps:{"innerHTML":_vm._s(_vm.format(item))}})],{item:item})],2),_c('span',{class:(_vm.prefixCls + "-selected-tag__icon")},[_c('va-icon',{attrs:{"type":"times"}})],1)])}):[_c('div',{staticClass:"inline"},[_vm._t("item",[_c('span',{domProps:{"innerHTML":_vm._s(_vm.format(_vm.selectedItems[0]))}})],{item:_vm.selectedItems[0]})],2)]],2):_vm._e(),_vm._v("\n              \n            "),_c('va-icon',{attrs:{"type":_vm.show ? 'angle-up' : 'angle-down'}})],1),_c('transition',{attrs:{"name":"fadeDown"}},[_c('ul',{directives:[{name:"show",rawName:"v-show",value:(_vm.show),expression:"show"},{name:"va-position",rawName:"v-va-position",value:(_vm.show),expression:"show"}],ref:"menu",class:[(_vm.prefixCls + "-dropdown-menu"), _vm.search ? (_vm.prefixCls + "-has-search") : ""],style:({maxHeight: _vm.menuMaxHeight, width: _vm.menuWidth})},[(_vm.search)?_c('li',[_c('div',{class:(_vm.prefixCls + "-search-wrap")},[_c('va-input',{ref:"searchInput",class:(_vm.prefixCls + "-select-search"),attrs:{"placeholder":_vm.inputPlaceholder,"icon":"search","icon-style":"solid","no-v-model":"","show-clean":"","size":"xs","width":"210px"},on:{"confirm":_vm.addExtra},model:{value:(_vm.searchText),callback:function ($$v) {_vm.searchText=$$v},expression:"searchText"}})],1)]):_vm._e(),(_vm.multiple)?_c('li',{class:(_vm.prefixCls + "-select-all")},[_c('a',{on:{"click":function($event){$event.preventDefault();return _vm.selectAll($event)}}},[_vm._v("\n                        "+_vm._s(_vm.getL('all'))+"\n                        "),_c('va-icon',{directives:[{name:"show",rawName:"v-show",value:(_vm.allSelected),expression:"allSelected"}],attrs:{"color":"#0052CC","margin":"5px 0 0 0","size":"10px","type":"check"}})],1)]):_vm._e(),_c('div',{class:(_vm.prefixCls + "-select-items-wrapper")},[_vm._t("default",_vm._l((_vm.filterOptions),function(option){return _c('va-option',{key:option.value,attrs:{"label":option.label,"value":option.value}})}))],2),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.showNotify),expression:"showNotify"}],class:(_vm.prefixCls + "-notify"),attrs:{"transition":"fadeDown"}},[_vm._v("Limit: "+_vm._s(_vm.limit))])])]),_c('div',{staticClass:"clearfix"}),_c('validate',{attrs:{"current":_vm.value,"custom-validate":_vm.customValidate,"name":_vm.name,"rules":_vm.rules},model:{value:(_vm.validStatus),callback:function ($$v) {_vm.validStatus=$$v},expression:"validStatus"}})],1)}
var VaSelectvue_type_template_id_981095da_staticRenderFns = []


// CONCATENATED MODULE: ./src/Select/VaSelect.vue?vue&type=template&id=981095da&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.find-index.js
var es6_array_find_index = __webpack_require__("20d6");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.search.js
var es6_regexp_search = __webpack_require__("386d");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Select/VaSelect.vue?vue&type=script&lang=js&





//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ var VaSelectvue_type_script_lang_js_ = ({
  name: 'VaSelect',
  mixins: [validationMixin, localeMixin('VaSelect')],
  props: {
    readonly: {
      type: Boolean,
      default: false,
      required: false,
      note: 'Whether or not the select dropdown is readonly.'
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false,
      note: 'Whether or not the select dropdown is disabled.'
    },
    showSelected: {
      type: Boolean,
      default: true,
      required: false,
      note: 'When this is false, selected items do not appear in the main select input element.'
    },
    inputPlaceholder: {
      type: String,
      default: '',
      required: false,
      note: 'If the \'search\' prop is passed, the inputPlaceholder prop allows you to specify a placeholder for the input that appears at the top of the dropdown list.'
    },
    size: {
      type: String,
      required: false,
      note: 'The size of the select input.'
    },
    context: {},
    type: {
      type: String,
      default: 'default',
      required: false,
      note: 'The type of button to render as the Select button. See VaButton for possible values.'
    },
    options: {
      type: Array,
      default: function _default() {
        return [];
      },
      required: false,
      note: 'Accepts an array of objects with value and label keys: { value: \'apple\', label: \'Apple\' }'
    },
    value: {},
    placeholder: {
      type: String,
      default: '',
      required: false,
      note: 'The placeholder for the select input.'
    },
    multiple: {
      type: Boolean,
      default: false,
      required: false,
      note: 'When true, multiple items can be selected at the same time.'
    },
    search: {
      type: Boolean,
      default: false,
      required: false,
      note: 'When true, a search input appears at the top of the item list. Items can be filtered using this search input.'
    },
    extra: {
      type: Boolean,
      default: false,
      required: false,
      note: 'When true, an input element will appear at the top of the item list. New items can be created using this input.'
    },
    limit: {
      type: Number,
      default: 1024,
      required: false,
      note: 'Allows you to set a maximum number of selected items.'
    },
    width: {
      type: String
    },
    menuMaxHeight: {
      type: String,
      default: '300px',
      required: false,
      note: 'The maximum height of the dropdown menu.'
    },
    menuWidth: {
      type: String,
      required: false
    },
    matchCase: {
      type: Boolean,
      default: false,
      required: false,
      note: 'When true, searches are case-sensitive.'
    },
    format: {
      type: Function,
      default: function _default(item) {
        if (!item) return '';
        return item.label;
      }
    },
    noUncheck: {
      type: Boolean,
      default: false,
      required: false,
      note: 'When true, you cannot uncheck a checked element in a single select component.'
    },
    customValidate: {
      type: Function
    },
    rules: {
      type: Array
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    return {
      validStatus: '',
      searchText: '',
      show: false,
      showNotify: false,
      currentValue: this.value,
      currentOptions: this.options,
      activeItemClass: this.prefixCls + '-select-item-active'
    };
  },
  provide: function provide() {
    return {
      addSelectOption: this.addOption,
      selectOption: this.select,
      isOptionSelected: this.isSelected
    };
  },
  watch: {
    value: function value(val) {
      if (this.inner) {
        this.inner = false;
        return;
      }

      this.inner = true;
      this.currentValue = val;
    },
    options: function options(val) {
      this.currentOptions = val;
    },
    currentValue: function currentValue(val) {
      if (this.inner) {
        this.inner = false;
        return;
      }

      this.inner = true;
      this.$emit('input', val);
      this.$emit('change', val);
    },
    multiple: function multiple(val) {
      if (val === false) {
        if (Array.isArray(this.value) && this.value.length > 1) {
          this.value = this.value[0];
        }
      }
    },
    show: function show(val) {
      if (val) {
        if (this.search) {
          this.$refs.searchInput.focus();
        }
      }
    }
  },
  components: {
    validate: validate
  },
  created: function created() {
    document.addEventListener('keyup', this.keyup);
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          validStatus = this.validStatus;
      var klass = {};
      klass[prefixCls + '-has-error'] = validStatus === 'error';
      klass[prefixCls + '-has-success'] = validStatus === 'success';
      klass[prefixCls + '-has-warn'] = validStatus === 'warn';
      klass[prefixCls + '-btn-group'] = true;
      klass[prefixCls + '-select-group'] = true;
      klass[prefixCls + '-dropdown-con'] = true;
      return klass;
    },
    filterOptions: function filterOptions() {
      return this.filter(this.currentOptions, this.searchText);
    },
    selectedItems: {
      get: function get() {
        var a;

        if (utils_type.isArray(this.currentValue)) {
          a = this.currentValue;
        } else {
          a = [this.currentValue];
        }

        return this.findInOptions(a);
      },
      set: function set(value) {
        var self = this;

        if (this.multiple) {
          var ret = [];

          for (var i = 0; i < value.length; i++) {
            ret.push(value[i].value);
          }

          var timeout;
          if (timeout) clearTimeout(timeout);

          if (ret.length > this.limit) {
            this.showNotify = true;
            this.remove(value, this.limit);
            timeout = setTimeout(function () {
              self.showNotify = false;
            }, 1000);
          } else {
            this.currentValue = ret;
          }
        } else {
          this.currentValue = value[0] ? value[0].value : '';
        }
      }
    },
    allSelected: function allSelected() {
      var options = this.filter(this.currentOptions, this.searchText);
      var values = this.currentValue;

      if (!values || options.length !== values.length || options.length === 0) {
        return false;
      }

      for (var i = 0, l = options.length; i < l; i++) {
        var value = options[i].value;

        if (values.indexOf(value) === -1) {
          return false;
        }
      }

      return true;
    },
    showPlaceholder: function showPlaceholder() {
      if (utils_type.isArray(this.currentValue)) {
        return this.currentValue.length <= 0;
      } else {
        return !this.currentValue;
      }
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this._closeEvent = utils_EventListener.listen(window, 'click', function (e) {
        if (!_this.$el.contains(e.target)) _this.show = false;
      });
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this._closeEvent) this._closeEvent.remove();
    document.removeEventListener('keyup', this.keyup);
  },
  methods: {
    isSelected: function isSelected(option) {
      return this.findIndex(option.value) !== -1;
    },
    keyup: function keyup(e) {
      if (e.keyCode === 27) {
        this.show = false;
      }
    },
    filter: function filter(options, search) {
      if (search === '') return options;
      var ret = [];

      for (var i = 0, l = options.length; i < l; i++) {
        var v = options[i] && String(options[i].label).replace(/<.*?>/g, '');
        var s = search;

        if (!this.matchCase) {
          v = v.toLocaleLowerCase();
          s = s.toLocaleLowerCase();
        }

        if (v !== '' && v.indexOf(s) > -1) {
          ret.push(options[i]);
        }
      }

      return ret;
    },
    selectAll: function selectAll() {
      if (this.allSelected) {
        this.selectedItems = [];
      } else {
        this.selectedItems = this.filter(this.currentOptions, this.searchText);
      }
    },
    addExtra: function addExtra() {
      if (this.extra && this.searchText.replace(/\s+$|^\s+/g, '')) {
        this.addOption(this.searchText, this.searchText);
        this.add({
          value: this.searchText,
          label: this.searchText
        });
        this.searchText = '';
      }
    },
    findInOptions: function findInOptions(a) {
      var options = this.currentOptions;
      var ret = [];

      for (var i = 0; i < a.length; i++) {
        var s = this.find(a[i], options);
        s != null ? ret.push(s) : 0;
      }

      return ret;
    },
    find: function find(v, array) {
      var a = array || this.selectedItems;

      for (var i = 0; i < a.length; i++) {
        if (v === a[i].value) {
          return a[i];
        }
      }

      return null;
    },
    findIndex: function findIndex(v, array) {
      var a = array || this.selectedItems;

      for (var i = 0; i < a.length; i++) {
        if (v === a[i].value) {
          return i;
        }
      }

      return -1;
    },
    optionExists: function optionExists(option) {
      return this.currentOptions.map(function (option) {
        return option.value;
      }).indexOf(option.value) !== -1;
    },
    addOption: function addOption(value, label) {
      var option = {
        value: value,
        label: label
      };

      if (this.optionExists(option)) {
        return;
      }

      this.currentOptions.push(option);
    },
    add: function add(option) {
      var a = this.selectedItems.slice(0);

      if (this.multiple) {
        a.push(option);
      } else {
        a = [option];
      }

      this.selectedItems = a;
    },
    del: function del(item) {
      var index = this.findIndex(item.value);
      this.remove(this.selectedItems, index, 1);
    },
    remove: function remove(array, index, num) {
      var a = array.slice(0);
      num ? a.splice(index, num) : a.splice(index);
      this.selectedItems = a;
    },
    select: function select(option) {
      var index = this.findIndex(option.value);

      if (this.multiple) {
        index === -1 ? this.add(option) : this.remove(this.selectedItems, index, 1);
      } else {
        index === -1 ? this.selectedItems = [option] : this.noUncheck ? this.selectedItems = [option] : this.selectedItems = [];
        this.show = false;
        this.$refs.button.focus();
      }
    },
    toggleDropdown: function toggleDropdown() {
      if (!this.disabled && !this.readonly) {
        this.show = !this.show;
      }
    }
  }
});
// CONCATENATED MODULE: ./src/Select/VaSelect.vue?vue&type=script&lang=js&
 /* harmony default export */ var Select_VaSelectvue_type_script_lang_js_ = (VaSelectvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Select/VaSelect.vue





/* normalize component */

var VaSelect_component = normalizeComponent(
  Select_VaSelectvue_type_script_lang_js_,
  VaSelectvue_type_template_id_981095da_render,
  VaSelectvue_type_template_id_981095da_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaSelect_component.options.__file = "VaSelect.vue"
/* harmony default export */ var Select_VaSelect = (VaSelect_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Topbar/VaTopbar.vue?vue&type=template&id=33c8c040&
var VaTopbarvue_type_template_id_33c8c040_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.classObj,style:(_vm.styleObj)},[_c('div',{class:(_vm.prefixCls + "-topbar-inner")},[_c('div',{class:(_vm.prefixCls + "-topbar-left")},[_vm._t("left")],2),_c('div',{class:(_vm.prefixCls + "-topbar-center")},[_vm._t("center")],2),_c('div',{class:(_vm.prefixCls + "-topbar-right")},[_vm._t("right")],2)])])}
var VaTopbarvue_type_template_id_33c8c040_staticRenderFns = []


// CONCATENATED MODULE: ./src/Topbar/VaTopbar.vue?vue&type=template&id=33c8c040&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Topbar/VaTopbar.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var VaTopbarvue_type_script_lang_js_ = ({
  name: 'VaTopbar',
  mixins: [events],
  props: {
    theme: {
      type: String,
      default: 'blue',
      required: false
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    var t = this.theme;
    return {
      currentDesktopMinimumWidth: 0,
      currentDesktopMargin: 0,
      currentContentWidth: 0,
      currentTopbarHeight: 0,
      currentMinibarWidth: 0,
      currentSidebarWidth: 0,
      sidebarPriority: false,
      minibarPriority: false,
      currentWindowWidth: 0,
      topbarPriority: false,
      topbarPadded: false,
      isReverse: false,
      isMobile: false,
      isSplit: false,
      isRTL: false,
      th: t
    };
  },
  mounted: function mounted() {
    var _this = this;

    /**
     * This needs to be wrapped in a short setTimeout to give
     * App time to call enableReceivers().
     */
    setTimeout(function () {
      _this.dispatch('VaApp', 'Va@configTopbarThemeChange', _this.th);
    }, 10);
  },
  created: function created() {
    var _this2 = this;

    this.$on('Va@topbarPresenceCheck', function () {
      _this2.dispatch('VaApp', 'Va@topbarPresenceReply', true);
    });
    this.$on('Va@desktopMinimumWidthChange', function (val) {
      _this2.currentDesktopMinimumWidth = val;
    });
    this.$on('Va@desktopMarginChange', function (val) {
      _this2.currentDesktopMargin = val;
    });
    this.$on('Va@minibarWidthChange', function (val) {
      _this2.currentMinibarWidth = val;
    });
    this.$on('Va@topbarHeightChange', function (val) {
      _this2.currentTopbarHeight = val;
    });
    this.$on('Va@contentWidthChange', function (val) {
      _this2.currentContentWidth = val;
    });
    this.$on('Va@sidebarWidthChange', function (val) {
      _this2.currentSidebarWidth = val;
    });
    this.$on('Va@sidebarPriorityChange', function (val) {
      _this2.sidebarPriority = val;
    });
    this.$on('Va@minibarPriorityChange', function (val) {
      _this2.minibarPriority = val;
    });
    this.$on('Va@windowWidthChange', function (val) {
      _this2.currentWindowWidth = val;
    });
    this.$on('Va@topbarPriorityChange', function (val) {
      _this2.topbarPriority = val;
    });
    this.$on('Va@topbarPaddedChange', function (val) {
      _this2.topbarPadded = val;
    });
    this.$on('Va@reverseChange', function (val) {
      _this2.isReverse = val;
    });
    this.$on('Va@topbarIsMobile', function (val) {
      _this2.isMobile = val;
    });
    this.$on('Va@topbarThemeChange', function (val) {
      _this2.th = val;
    });
    this.$on('Va@splitChange', function (val) {
      _this2.isSplit = val;
    });
    this.$on('Va@rtlChange', function (val) {
      _this2.isRTL = val;
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.dispatch('VaApp', 'Va@topbarDisconnect', true);
  },
  watch: {
    theme: function theme(val) {
      this.th = val;
      this.dispatch('VaApp', 'Va@configTopbarThemeChange', this.th);
    }
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          th = this.th;
      var klass = {};
      klass[prefixCls + '-topbar'] = true;
      klass[prefixCls + '-topbar--theme-' + th] = true;
      return klass;
    },
    styleObj: function styleObj() {
      var dmw = parseInt(this.currentDesktopMinimumWidth);
      var dm = parseInt(this.currentDesktopMargin);
      var th = parseInt(this.currentTopbarHeight);
      var sw = parseInt(this.currentSidebarWidth);
      var cw = parseInt(this.currentContentWidth);
      var mw = parseInt(this.currentMinibarWidth);
      var sp = this.sidebarPriority;
      var mp = this.minibarPriority;
      var tp = this.topbarPriority;
      var tpad = this.topbarPadded;
      var reverse = this.isReverse;
      var mobile = this.isMobile;
      var split = this.isSplit;
      var rtl = this.isRTL;
      var style = {};
      style['height'] = th + 'px';
      style['left'] = '0px';
      style['right'] = '0px';
      /**
       * Adjust the margins if content width is smaller than
       * desktop minimum width.
       */

      if (!mobile) {
        if (cw < dmw) {
          var x = dmw - cw;
          dm = dm - x / 2;
        }
      } else {
        dm = 0;
        dmw = 0;
      }
      /**
       * If a minimum desktop width is set
       */


      if (dmw !== 0) {
        style['min-width'] = dmw - mw - sw + 'px';
      } else {
        style['min-width'] = '0px';
      }
      /**
       * Ready to be thoroughly confused?
       */


      if (sp) {
        if (split) {
          if (reverse) {
            if (mp) {
              style['left'] = dm + sw + 'px';
              style['right'] = dm + mw + 'px';
            } else {
              style['left'] = dm + sw + 'px';
              style['right'] = dm + 'px';
            }
          } else {
            if (mp) {
              style['left'] = dm + mw + 'px';
              style['right'] = dm + sw + 'px';
            } else {
              style['left'] = dm + 'px';
              style['right'] = dm + sw + 'px';
            }
          }
        } else {
          if (reverse) {
            if (mp) {
              style['left'] = sw + mw + dm + 'px';
              style['right'] = dm + 'px';
            } else {
              style['left'] = dm + sw + 'px';
              style['right'] = dm + 'px';
            }
          } else {
            if (mp) {
              style['left'] = sw + mw + dm + 'px';
              style['right'] = dm + 'px';
            } else {
              style['left'] = sw + mw + dm + 'px';
              style['right'] = dm + 'px';
            }
          }
        }
      }

      if (!sp) {
        if (split) {
          if (reverse) {
            if (mp) {
              style['left'] = dm + 'px';
              style['right'] = dm + mw + 'px';
            } else {
              style['left'] = dm + 'px';
              style['right'] = dm + 'px';
            }
          } else {
            if (mp) {
              style['left'] = dm + mw + 'px';
              style['right'] = dm + 'px';
            } else {
              style['left'] = dm + 'px';
              style['right'] = dm + 'px';
            }
          }
        } else {
          if (reverse) {
            if (mp) {
              style['left'] = sw + mw + dm + 'px';
              style['right'] = dm + 'px';
            } else {
              style['left'] = dm + 'px';
              style['right'] = dm + 'px';
            }
          } else {
            if (mp) {
              style['left'] = dm + mw + 'px';
              style['right'] = dm + 'px';
            } else {
              style['left'] = dm + 'px';
              style['right'] = dm + 'px';
            }
          }
        }
      }

      if (rtl) {
        // rtl only effective when not split
        if (!split) {
          if (reverse) {
            if (sp) {
              style['left'] = dm + 'px';
              style['right'] = sw + mw + dm + 'px';
            } else {
              if (mp) {
                style['left'] = dm + 'px';
                style['right'] = dm + mw + 'px';
              }
            }
          } else {
            if (sp) {
              if (mp) {
                style['right'] = mw + sw + dm + 'px';
                style['left'] = dm + 'px';
              } else {
                style['right'] = dm + sw + 'px';
                style['left'] = dm + 'px';
              }
            } else {
              if (mp) {
                style['right'] = mw + sw + dm + 'px';
                style['left'] = dm + 'px';
              }
            }
          }
        }
      }

      if (tp) {
        style['left'] = '0px';
        style['right'] = '0px';

        if (tpad) {
          style['padding-left'] = dm + 8 + 'px';
          style['padding-right'] = dm + 8 + 'px';
          /**
           * Why 8px?
           * Because a 50px Minibar looks best, and if the
           * first or last element in a padded topbar is
           * an icon, this lines it up nicely with the
           * icons in the Minibar.
           */
        }
      } // Less than 40 and we don't want overflow.
      // Greater than 40 and we do, because we don't want
      // to hide dropdown menus.
      // That means..
      // Dropdown menus in the topbar won't appear when the
      // topbar has a height of less than 40px.


      if (th < 40) {
        style['overflow'] = 'hidden';
      } else {
        style['overflow'] = 'visible';
      }

      return style;
    }
  }
});
// CONCATENATED MODULE: ./src/Topbar/VaTopbar.vue?vue&type=script&lang=js&
 /* harmony default export */ var Topbar_VaTopbarvue_type_script_lang_js_ = (VaTopbarvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Topbar/VaTopbar.vue





/* normalize component */

var VaTopbar_component = normalizeComponent(
  Topbar_VaTopbarvue_type_script_lang_js_,
  VaTopbarvue_type_template_id_33c8c040_render,
  VaTopbarvue_type_template_id_33c8c040_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaTopbar_component.options.__file = "VaTopbar.vue"
/* harmony default export */ var VaTopbar = (VaTopbar_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Mobile/VaMobile.vue?vue&type=template&id=669a7c4d&
var VaMobilevue_type_template_id_669a7c4d_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[(_vm.isMobile)?_vm._t("default"):_vm._e()],2)}
var VaMobilevue_type_template_id_669a7c4d_staticRenderFns = []


// CONCATENATED MODULE: ./src/Mobile/VaMobile.vue?vue&type=template&id=669a7c4d&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Mobile/VaMobile.vue?vue&type=script&lang=js&
//
//
//
//
//
//

/* harmony default export */ var VaMobilevue_type_script_lang_js_ = ({
  name: 'VaMobile',
  mixins: [events],
  props: {
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    return {
      isMobile: false
    };
  },
  created: function created() {
    var _this = this;

    this.$on('Va@mobileIsMobile', function (val) {
      _this.isMobile = val;
    });
    /**
     * In case this component is instantiated after the App
     * has initially broadcasted isMobile, let's request it.
     */

    this.dispatch('VaApp', 'Va@requestIsMobile', true);
  }
});
// CONCATENATED MODULE: ./src/Mobile/VaMobile.vue?vue&type=script&lang=js&
 /* harmony default export */ var Mobile_VaMobilevue_type_script_lang_js_ = (VaMobilevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Mobile/VaMobile.vue





/* normalize component */

var VaMobile_component = normalizeComponent(
  Mobile_VaMobilevue_type_script_lang_js_,
  VaMobilevue_type_template_id_669a7c4d_render,
  VaMobilevue_type_template_id_669a7c4d_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaMobile_component.options.__file = "VaMobile.vue"
/* harmony default export */ var VaMobile = (VaMobile_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Button/VaButton.vue?vue&type=template&id=22927a62&
var VaButtonvue_type_template_id_22927a62_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('a',{ref:"btn",class:_vm.classObj,style:(_vm.styleObj),attrs:{"tabindex":"0"},on:{"click":function($event){_vm.$emit('click')},"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.enterPressed($event)}}},[_c('div',{class:_vm.fadeclassObj},[_vm._t("default"),(_vm.badge)?_c('va-badge',{attrs:{"margin":_vm.badgeMargin}},[_vm._v(_vm._s(_vm.badge))]):_vm._e()],2),(_vm.loadingSpinner)?_c('va-loading',{attrs:{"color":_vm.spinColor,"size":_vm.size}}):_vm._e()],1)}
var VaButtonvue_type_template_id_22927a62_staticRenderFns = []


// CONCATENATED MODULE: ./src/Button/VaButton.vue?vue&type=template&id=22927a62&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Button/VaButton.vue?vue&type=script&lang=js&



//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var VaButtonvue_type_script_lang_js_ = ({
  name: 'VaButton',
  props: {
    type: {
      type: String,
      default: 'default',
      required: false,
      values: ['default', 'primary'],
      note: 'The style of button to render.',
      validator: function validator(v) {
        return ['default', 'primary', 'primary-light', 'primary-dark', 'paleblue', 'success', 'info', 'warning', 'danger', 'subtle', 'link', 'subtle-link', 'active', 'dark', 'darker', 'purple', 'purple-light', 'purple-dark', 'black'].includes(v);
      }
    },
    size: {
      type: String,
      default: 'md',
      required: false,
      note: 'The size of button to render.',
      validator: function validator(v) {
        return ['xs', 'sm', 'md', 'lg'].includes(v);
      }
    },
    badge: {
      type: [String, Number],
      required: false,
      note: 'Adds an VaBadge to the button.'
    },
    badgeMargin: {
      type: String,
      default: '0 5px 0 10px',
      required: false,
      note: 'Margin to be applied to the outside of the badge element. The default value works well for badges displayed to the right of the button text.'
    },
    active: {
      type: Boolean,
      default: false,
      required: false,
      note: 'If true, applies the .${prefixCls}-btn-active class.'
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false,
      note: 'If true, applies the .${prefixCls}-btn-disabled class.'
    },
    block: {
      type: Boolean,
      default: false,
      required: false,
      note: 'If true, applies the .${prefixCls}-btn-block class.'
    },
    loading: {
      type: Boolean,
      default: false,
      required: false,
      note: 'If true, hides text and shows prefixCls-loading spinner.'
    },
    round: {
      type: Boolean,
      default: false,
      required: false
    },
    focused: {
      type: Boolean,
      default: false,
      required: false
    },
    tall: {
      type: Boolean,
      default: false,
      required: false
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    var loading = this.loading;
    return {
      loadingSpinner: loading,
      isFocused: this.focused
    };
  },
  computed: {
    spinColor: function spinColor() {
      var type = this.type;
      var white = '#FFFFFF';
      var darker = '#45526B';

      switch (type) {
        case 'default':
          return darker;

        case 'primary':
          return white;

        case 'primary-light':
          return white;

        case 'primary-dark':
          return white;

        case 'success':
          return white;

        case 'info':
          return white;

        case 'warning':
          return darker;

        case 'subtle':
          return darker;

        case 'link':
          return darker;

        case 'subtle-link':
          return darker;

        case 'danger':
          return white;

        case 'dark':
          return white;

        case 'darker':
          return white;
      }

      return white;
    },
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          type = this.type,
          size = this.size,
          block = this.block,
          active = this.active,
          disabled = this.disabled,
          round = this.round,
          isFocused = this.isFocused;
      var klass = {};
      klass[prefixCls + '-btn'] = true;
      klass[prefixCls + '-btn-block'] = block;
      klass[prefixCls + '-btn-active'] = active;
      klass[prefixCls + '-btn-disabled'] = disabled;
      size ? klass[prefixCls + '-btn-' + size] = true : '';
      type ? klass[prefixCls + '-btn-' + type] = true : '';
      klass[prefixCls + '-btn-round'] = round;
      klass[prefixCls + '-btn-' + type + '-focused'] = isFocused;
      return klass;
    },
    fadeclassObj: function fadeclassObj() {
      var prefixCls = this.prefixCls,
          loadingSpinner = this.loadingSpinner;
      var klass = {};
      klass[prefixCls + '-btn-text-fade'] = true;
      loadingSpinner ? klass[prefixCls + '-btn-text-fade-out'] = true : '';
      return klass;
    },
    styleObj: function styleObj() {
      var tall = this.tall;
      var style = {};

      if (tall) {
        style['height'] = '100%';
        style['border-radius'] = '0px';
      }

      return style;
    }
  },
  watch: {
    loading: function loading(val) {
      var _this = this;

      if (val) {
        var rect = this.$el.getBoundingClientRect();
        this.$el.style.width = rect.width + 'px';
        this.$el.style.height = rect.height + 'px';
        this.loadingSpinner = true;
      } else {
        this.$el.style.width = 'auto';
        this.$el.style.height = 'auto';
        this.$nextTick(function () {
          _this.loadingSpinner = false;
        });
      }
    }
  },
  methods: {
    enterPressed: function enterPressed() {
      this.$emit('click');
      var el = this.$refs.btn;
      var evObj = document.createEvent('Events');
      evObj.initEvent('click', true, false);
      el.dispatchEvent(evObj);
    },
    focus: function focus() {
      this.$refs.btn.focus();
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    this.$nextTick(function () {
      var el = _this2.$el;
      _this2._clickEvent = utils_EventListener.listen(window, 'click', function (e) {
        if (!el.contains(e.target)) {
          _this2.isFocused = false;
        }
      });
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this._clickEvent) this._clickEvent.remove();
  }
});
// CONCATENATED MODULE: ./src/Button/VaButton.vue?vue&type=script&lang=js&
 /* harmony default export */ var Button_VaButtonvue_type_script_lang_js_ = (VaButtonvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Button/VaButton.vue





/* normalize component */

var VaButton_component = normalizeComponent(
  Button_VaButtonvue_type_script_lang_js_,
  VaButtonvue_type_template_id_22927a62_render,
  VaButtonvue_type_template_id_22927a62_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaButton_component.options.__file = "VaButton.vue"
/* harmony default export */ var VaButton = (VaButton_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Grid/VaColumn.vue?vue&type=template&id=f02769e2&
var VaColumnvue_type_template_id_f02769e2_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.classObj},[_vm._t("default")],2)}
var VaColumnvue_type_template_id_f02769e2_staticRenderFns = []


// CONCATENATED MODULE: ./src/Grid/VaColumn.vue?vue&type=template&id=f02769e2&

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Grid/VaColumn.vue?vue&type=script&lang=js&


//
//
//
//
//
//
/* harmony default export */ var VaColumnvue_type_script_lang_js_ = ({
  name: 'VaColumn',
  props: {
    xs: Number,
    sm: Number,
    md: Number,
    lg: Number,
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  computed: {
    classObj: function classObj() {
      var _ref;

      var prefixCls = this.prefixCls;
      return ["".concat(prefixCls, "-col"), (_ref = {}, _defineProperty(_ref, "".concat(prefixCls, "-col-xs-").concat(this.xs), this.xs), _defineProperty(_ref, "".concat(prefixCls, "-col-sm-").concat(this.sm), this.sm), _defineProperty(_ref, "".concat(prefixCls, "-col-md-").concat(this.md), this.md), _defineProperty(_ref, "".concat(prefixCls, "-col-lg-").concat(this.lg), this.lg), _ref)];
    }
  }
});
// CONCATENATED MODULE: ./src/Grid/VaColumn.vue?vue&type=script&lang=js&
 /* harmony default export */ var Grid_VaColumnvue_type_script_lang_js_ = (VaColumnvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Grid/VaColumn.vue





/* normalize component */

var VaColumn_component = normalizeComponent(
  Grid_VaColumnvue_type_script_lang_js_,
  VaColumnvue_type_template_id_f02769e2_render,
  VaColumnvue_type_template_id_f02769e2_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaColumn_component.options.__file = "VaColumn.vue"
/* harmony default export */ var VaColumn = (VaColumn_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Form/VaFormItem.vue?vue&type=template&id=024da598&
var VaFormItemvue_type_template_id_024da598_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.classObj},[_c('label',{class:(_vm.prefixCls + "-col-sm-" + _vm.label_col + " " + _vm.prefixCls + "-control-label")},[_vm._v("\n      "+_vm._s(_vm.label)+"\n      "),(_vm.need)?_c('em',{class:(_vm.prefixCls + "-form-need")},[_vm._v("*")]):_vm._e()]),_c('div',{class:(_vm.prefixCls + "-col-sm-" + _vm.col + " inline")},[_vm._t("default")],2)])}
var VaFormItemvue_type_template_id_024da598_staticRenderFns = []


// CONCATENATED MODULE: ./src/Form/VaFormItem.vue?vue&type=template&id=024da598&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Form/VaFormItem.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var VaFormItemvue_type_script_lang_js_ = ({
  name: 'VaFormItem',
  props: {
    label: {
      type: String
    },
    labelCol: {
      type: Number,
      default: 0,
      required: false,
      note: 'Used in horizontal and vertical type forms to allow you to assign a number of columns to the item label.'
    },
    wrapCol: {
      type: Number
    },
    formCol: {
      type: Number
    },
    need: {
      type: Boolean,
      default: false,
      required: false,
      note: 'When true, all this does is render a red asterisk next to the label. This has nothing to do with validation.'
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  computed: {
    inline: function inline() {
      return this.$parent.type === 'inline';
    },
    label_col: function label_col() {
      var defaultCol = this.inline ? 0 : 2;
      return this.labelCol ? this.labelCol : defaultCol;
    },
    col: function col() {
      if (this.inline && !this.formCol) {
        return 0;
      }

      if (this.formCol) {
        return this.formCol;
      }

      var wrapCol = this.wrapCol ? this.wrapCol : 12;
      return wrapCol - this.label_col;
    },
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          wrapCol = this.wrapCol;
      var klass = {};
      var defaultCol = this.inline ? wrapCol || 0 : 12;
      klass['clearfix'] = true;
      klass[prefixCls + '-form-group'] = true;
      klass[prefixCls + '-col-sm-' + defaultCol] = true;
      return klass;
    }
  }
});
// CONCATENATED MODULE: ./src/Form/VaFormItem.vue?vue&type=script&lang=js&
 /* harmony default export */ var Form_VaFormItemvue_type_script_lang_js_ = (VaFormItemvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Form/VaFormItem.vue





/* normalize component */

var VaFormItem_component = normalizeComponent(
  Form_VaFormItemvue_type_script_lang_js_,
  VaFormItemvue_type_template_id_024da598_render,
  VaFormItemvue_type_template_id_024da598_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaFormItem_component.options.__file = "VaFormItem.vue"
/* harmony default export */ var VaFormItem = (VaFormItem_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Input/VaInputOps.vue?vue&type=template&id=55ecefde&
var VaInputOpsvue_type_template_id_55ecefde_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"fadeUp"}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.show),expression:"show"}],ref:"popup",class:_vm.classObj,style:(_vm.styleObj)},[_c('va-button',{ref:"confirmButton",staticStyle:{"margin-right":"3px"},attrs:{"size":"sm","loading":_vm.loading,"type":"default"},nativeOn:{"click":function($event){return _vm.confirmClicked($event)}}},[_c('va-icon',{attrs:{"type":"check","size":"10px"}})],1),_c('va-button',{ref:"cancelButton",style:({ visibility: _vm.loading ? 'hidden' : 'visible' }),attrs:{"size":"sm","type":"default"},nativeOn:{"click":function($event){return _vm.cancel($event)}}},[_c('va-icon',{attrs:{"type":"times","size":"10px"}})],1)],1)])}
var VaInputOpsvue_type_template_id_55ecefde_staticRenderFns = []


// CONCATENATED MODULE: ./src/Input/VaInputOps.vue?vue&type=template&id=55ecefde&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Input/VaInputOps.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var VaInputOpsvue_type_script_lang_js_ = ({
  name: 'VaInputOps',
  mixins: [events],
  props: {
    parentPosition: {
      type: Object
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    return {
      show: false,
      initialValue: '',
      currentValue: '',
      needToSave: false,
      position: {},
      shouldBlur: false,
      loading: false,
      opacity: false
      /* exists to hide element until getPosition finishes to prevent flicker */

    };
  },
  created: function created() {
    var _this = this;

    this.$on('Va@inputBlur', function (val) {
      _this.handleBlur(val);
    });
    this.$on('Va@inputFocus', function (val) {
      _this.handleFocus(val);
    });
    this.$on('Va@inputLoading', function (val) {
      _this.handleInputLoading(val);
    });
    this.$on('Va@inputUpdate', function (val) {
      _this.handleInputUpdate(val);
    });
    this.$on('Va@inputEnterPressed', function (val) {
      _this.handleEnterPressed(val);
    });
    this.$on('Va@inputCurrentValueUpdate', function (val) {
      _this.handleCurrentValueUpdate(val);
    });
  },
  mounted: function mounted() {
    var $body = document.querySelector('body');
    $body.appendChild(this.$refs.popup);
  },
  beforeDestroy: function beforeDestroy() {
    var $body = document.querySelector('body');
    $body.removeChild(this.$refs.popup);
  },
  methods: {
    confirmClicked: function confirmClicked() {
      this.shouldBlur = true;
      this.confirm();
    },
    confirm: function confirm() {
      if (this.initialValue !== this.currentValue) {
        this.$emit('confirm');
        this.dispatch('VaInput', 'Va@inputOpsConfirm', true);
        this.dispatch('VaTextarea', 'Va@inputOpsConfirm', true);
      }
    },
    cancel: function cancel() {
      this.$emit('cancel');
      this.needToSave = false;
      this.dispatch('VaInput', 'Va@inputOpsCancel', this.initialValue);
      this.dispatch('VaTextarea', 'Va@inputOpsCancel', this.initialValue);
      this.show = false;
    },
    handleBlur: function handleBlur(val) {
      if (val === this.initialValue) {
        this.show = false;
        this.needToSave = false;
      } else {
        this.needToSave = true;
      }

      this.shouldBlur = true;
    },
    handleFocus: function handleFocus(val) {
      var _this2 = this;

      this.shouldBlur = false;

      if (!this.needToSave) {
        this.initialValue = val;
        this.currentValue = val;
        this.show = true;
        /**
         * This short timeout provides, what seems like, a fine amount of
         * time for this element to be inserted into the DOM. When it's not
         * on the DOM, there's no position to get.
         */

        setTimeout(function () {
          _this2.setPosition();

          _this2.opacity = true;
        }, 10);
      }
    },
    handleInputLoading: function handleInputLoading(val) {
      this.loading = val;
    },
    handleInputUpdate: function handleInputUpdate(val) {
      if (val === this.initialValue) {
        this.needToSave = false;
      } else {
        this.needToSave = true;
      }
    },
    handleCurrentValueUpdate: function handleCurrentValueUpdate(val) {
      this.currentValue = val;
    },
    handleEnterPressed: function handleEnterPressed() {
      this.confirm();
    },
    setPosition: function setPosition() {
      this.position = this.getPosition();
    },
    getPosition: function getPosition() {
      var rect = this.$refs.popup.getBoundingClientRect();
      return {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y
      };
    }
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls;
      var klass = {};
      klass[prefixCls + '-input-ops'] = true;
      return klass;
    },
    styleObj: function styleObj() {
      var style = {};
      var opacity = this.opacity;
      var parentPosition = this.parentPosition;
      var position = this.position;
      style['position'] = 'fixed';
      style['top'] = parentPosition.top + parentPosition.height + 3 + 'px';
      style['left'] = parentPosition.left + (parentPosition.width - position.width) + 'px';
      style['opacity'] = opacity ? '1' : '0';
      return style;
    }
  },
  watch: {
    loading: function loading(val) {
      if (val === false && this.show === true) {
        if (this.shouldBlur) {
          this.show = false;
          this.shouldBlur = false;
        }

        this.needToSave = false;
        this.initialValue = this.currentValue;
      }
    },
    needToSave: function needToSave(val) {
      if (val) {
        this.show = true;
      }
    },
    show: function show(val) {
      if (!val) {
        this.opacity = false;
      }
    }
  }
});
// CONCATENATED MODULE: ./src/Input/VaInputOps.vue?vue&type=script&lang=js&
 /* harmony default export */ var Input_VaInputOpsvue_type_script_lang_js_ = (VaInputOpsvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Input/VaInputOps.vue





/* normalize component */

var VaInputOps_component = normalizeComponent(
  Input_VaInputOpsvue_type_script_lang_js_,
  VaInputOpsvue_type_template_id_55ecefde_render,
  VaInputOpsvue_type_template_id_55ecefde_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaInputOps_component.options.__file = "VaInputOps.vue"
/* harmony default export */ var VaInputOps = (VaInputOps_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Radio/VaRadioBtn.vue?vue&type=template&id=521a247f&
var VaRadioBtnvue_type_template_id_521a247f_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('va-button',{class:_vm.classObj,attrs:{"disabled":_vm.disabled,"type":_vm.currentChecked ? 'primary' : 'default'},nativeOn:{"click":function($event){$event.preventDefault();return _vm.handleClick($event)}}},[_vm._t("default")],2)}
var VaRadioBtnvue_type_template_id_521a247f_staticRenderFns = []


// CONCATENATED MODULE: ./src/Radio/VaRadioBtn.vue?vue&type=template&id=521a247f&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Radio/VaRadioBtn.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var VaRadioBtnvue_type_script_lang_js_ = ({
  name: 'VaRadioBtn',
  mixins: [validationMixin, events],
  props: {
    value: {
      type: String
    },
    label: {
      type: [String, Number]
    },
    checked: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  watch: {
    value: function value(val) {
      this.currentChecked = val;
    },
    checked: function checked(val) {
      this.currentChecked = val;
    },
    currentChecked: function currentChecked(val) {
      this.$emit('input', val);
    }
  },
  data: function data() {
    var checked = this.checked;

    if (checked !== undefined) {
      this.$emit('input', checked);
    } else {
      checked = !!this.value;
    }

    return {
      currentChecked: checked
    };
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls;
      var klass = {};
      klass[prefixCls + '-radio-btn'] = true;
      return klass;
    }
  },
  created: function created() {
    var _this = this;

    this.$on('Va@radiogroupChange', function (val) {
      _this.currentChecked = val === _this.label;
    });
  },
  methods: {
    handleClick: function handleClick() {
      if (this.currentChecked) return;
      this.currentChecked = true;
      this.dispatch('VaRadioGroup', 'Va@radioChange', this.label);
      this.$emit('change', this.currentChecked);
    }
  }
});
// CONCATENATED MODULE: ./src/Radio/VaRadioBtn.vue?vue&type=script&lang=js&
 /* harmony default export */ var Radio_VaRadioBtnvue_type_script_lang_js_ = (VaRadioBtnvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Radio/VaRadioBtn.vue





/* normalize component */

var VaRadioBtn_component = normalizeComponent(
  Radio_VaRadioBtnvue_type_script_lang_js_,
  VaRadioBtnvue_type_template_id_521a247f_render,
  VaRadioBtnvue_type_template_id_521a247f_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaRadioBtn_component.options.__file = "VaRadioBtn.vue"
/* harmony default export */ var VaRadioBtn = (VaRadioBtn_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Minibar/VaMinibar.vue?vue&type=template&id=d0a49116&
var VaMinibarvue_type_template_id_d0a49116_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.classObj,style:(_vm.styleObj)},[_c('div',{class:(_vm.prefixCls + "-minibar-inner"),style:(_vm.styleObjInner)},[_c('div',{class:(_vm.prefixCls + "-minibar-top")},_vm._l((_vm.topItems),function(item,index){return _c('div',{key:index},[(item.method)?_c('va-minibar-item',{attrs:{"tooltip":item.tooltip,"brand":item.brand},nativeOn:{"click":function($event){return item.method($event)}}},[_c('va-icon',{attrs:{"type":item.icon,"size":item.size,"icon-style":item.iconStyle || 'solid'}})],1):_c('va-minibar-item',{attrs:{"brand":item.brand,"tooltip":item.tooltip}},[_c('va-icon',{attrs:{"type":item.icon,"size":item.size,"icon-style":item.iconStyle || 'solid'}})],1)],1)})),_c('div',{class:(_vm.prefixCls + "-minibar-bottom")},_vm._l((_vm.bottomItems),function(item,index){return _c('div',{key:index},[(item.method)?_c('va-minibar-item',{attrs:{"tooltip":item.tooltip},nativeOn:{"click":function($event){return item.method($event)}}},[_c('va-icon',{attrs:{"type":item.icon,"size":item.size,"icon-style":item.iconStyle || 'solid'}})],1):_c('va-minibar-item',{attrs:{"tooltip":item.tooltip}},[_c('va-icon',{attrs:{"type":item.icon,"size":item.size,"icon-style":item.iconStyle || 'solid'}})],1)],1)}))])])}
var VaMinibarvue_type_template_id_d0a49116_staticRenderFns = []


// CONCATENATED MODULE: ./src/Minibar/VaMinibar.vue?vue&type=template&id=d0a49116&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Minibar/VaMinibar.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var VaMinibarvue_type_script_lang_js_ = ({
  name: 'VaMinibar',
  mixins: [events],
  props: {
    topItems: {
      type: Array,
      required: false
    },
    bottomItems: {
      type: Array,
      required: false
    },
    theme: {
      type: String,
      default: 'blue',
      required: false
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    var t = this.theme;
    return {
      currentDesktopMinimumWidth: 0,
      currentDesktopMargin: 0,
      currentContentWidth: 0,
      currentMinibarWidth: 0,
      currentTopbarHeight: 0,
      minibarPriority: false,
      currentSidebarWidth: 0,
      sidebarPriority: false,
      currentWindowWidth: 0,
      isReverse: false,
      isMobile: false,
      isSplit: false,
      isRTL: false,
      th: t
    };
  },
  mounted: function mounted() {
    var _this = this;

    /**
     * This needs to be wrapped in a short setTimeout to give
     * App time to call enableReceivers().
     */
    setTimeout(function () {
      _this.dispatch('VaApp', 'Va@configMinibarThemeChange', _this.th);
    }, 10);
  },
  created: function created() {
    var _this2 = this;

    this.$on('Va@minibarPresenceCheck', function (val) {
      _this2.dispatch('VaApp', 'Va@minibarPresenceReply', true);
    });
    this.$on('Va@desktopMinimumWidthChange', function (val) {
      _this2.currentDesktopMinimumWidth = val;
    });
    this.$on('Va@desktopMarginChange', function (val) {
      _this2.currentDesktopMargin = val;
    });
    this.$on('Va@contentWidthChange', function (val) {
      _this2.currentContentWidth = val;
    });
    this.$on('Va@topbarHeightChange', function (val) {
      _this2.currentTopbarHeight = val;
    });
    this.$on('Va@minibarWidthChange', function (val) {
      _this2.currentMinibarWidth = val;
    });
    this.$on('Va@sidebarWidthChange', function (val) {
      _this2.currentSidebarWidth = val;
    });
    this.$on('Va@minibarPriorityChange', function (val) {
      _this2.minibarPriority = val;
    });
    this.$on('Va@sidebarPriorityChange', function (val) {
      _this2.sidebarPriority = val;
    });
    this.$on('Va@windowWidthChange', function (val) {
      _this2.currentWindowWidth = val;
    });
    this.$on('Va@minibarIsMobile', function (val) {
      _this2.isMobile = val;
    });
    this.$on('Va@reverseChange', function (val) {
      _this2.isReverse = val;
    });
    this.$on('Va@minibarThemeChange', function (val) {
      _this2.th = val;
    });
    this.$on('Va@splitChange', function (val) {
      _this2.isSplit = val;
    });
    this.$on('Va@rtlChange', function (val) {
      _this2.isRTL = val;
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.dispatch('VaApp', 'Va@minibarDisconnect', true);
  },
  watch: {
    theme: function theme(val) {
      this.th = val;
      this.dispatch('VaApp', 'Va@configMinibarThemeChange', this.th);
    }
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          th = this.th;
      var klass = {};
      klass[prefixCls + '-minibar'] = true;
      klass[prefixCls + '-minibar--theme-' + th] = true;
      return klass;
    },
    styleObjInner: function styleObjInner() {
      var style = {}; // style['background'] = 'linear-gradient(to left, rgba(0, 0, 0, 0.1) 0px, rgba(0, 0, 0, 0.15) 1px, rgba(0, 0, 0, 0.1) 1px, rgba(0, 0, 0, 0) 40px)'

      return style;
    },
    styleObj: function styleObj() {
      var dmw = parseInt(this.currentDesktopMinimumWidth);
      var dm = parseInt(this.currentDesktopMargin);
      var mw = parseInt(this.currentMinibarWidth);
      var th = parseInt(this.currentTopbarHeight);
      var cw = parseInt(this.currentContentWidth);
      var sw = parseInt(this.currentSidebarWidth);
      var sp = this.sidebarPriority;
      var mp = this.minibarPriority;
      var reverse = this.isReverse;
      var mobile = this.isMobile;
      var split = this.isSplit;
      var rtl = this.isRTL;
      var style = {};
      style['width'] = mw + 'px';
      style['min-width'] = mw + 'px';

      if (mp) {
        style['top'] = '0px';
      } else {
        style['top'] = th + 'px';
      }

      style['bottom'] = '0px';
      /**
       * Adjust the margins if content width is smaller than
       * desktop minimum width.
       */

      if (!mobile) {
        if (cw < dmw) {
          var x = dmw - cw;
          dm = dm - x / 2;
        }
      } else {
        dm = 0;
        dmw = 0;
      }

      if (split) {
        if (reverse) {
          style['right'] = dm + 'px';
        } else {
          style['left'] = dm + 'px';
        }
      } else {
        if (reverse) {
          if (rtl) {
            style['right'] = dm + 'px';
          } else {
            style['left'] = dm + sw + 'px';
          }
        } else {
          if (rtl) {
            style['right'] = dm + sw + 'px';
          } else {
            style['left'] = dm + 'px';
          }
        }
      }

      if (!mp && sp && !reverse && !split && !rtl) {
        style['top'] = '0px';
      }

      if (rtl && !split && !reverse && mp) {
        style['top'] = '0px';
      }

      if (rtl && !split && reverse && !mp && sp) {
        style['top'] = '0px';
      }
      /**
       * Less than 20 and we don't want overflow.
       * Greater than 20 and we do, because we don't want
       * to hide tooltips.
       */


      if (mw < 20) {
        style['overflow'] = 'hidden';
      } else {
        style['overflow'] = 'visible';
      }

      return style;
    }
  }
});
// CONCATENATED MODULE: ./src/Minibar/VaMinibar.vue?vue&type=script&lang=js&
 /* harmony default export */ var Minibar_VaMinibarvue_type_script_lang_js_ = (VaMinibarvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Minibar/VaMinibar.vue





/* normalize component */

var VaMinibar_component = normalizeComponent(
  Minibar_VaMinibarvue_type_script_lang_js_,
  VaMinibarvue_type_template_id_d0a49116_render,
  VaMinibarvue_type_template_id_d0a49116_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaMinibar_component.options.__file = "VaMinibar.vue"
/* harmony default export */ var VaMinibar = (VaMinibar_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Loading/VaLoading.vue?vue&type=template&id=81e3353e&
var VaLoadingvue_type_template_id_81e3353e_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{class:_vm.classObj},[_c('i',{class:_vm.iclassObj}),_vm._t("default"),_c('svg',{class:(_vm.prefixCls + "-spinner"),attrs:{"viewBox":"0 0 50 50"}},[_c('circle',{class:(_vm.prefixCls + "-path"),style:({ stroke: _vm.color }),attrs:{"cx":"25","cy":"25","r":"20","fill":"none","stroke-width":"5"}})])],2)}
var VaLoadingvue_type_template_id_81e3353e_staticRenderFns = []


// CONCATENATED MODULE: ./src/Loading/VaLoading.vue?vue&type=template&id=81e3353e&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.string.fixed.js
var es6_string_fixed = __webpack_require__("d263");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Loading/VaLoading.vue?vue&type=script&lang=js&



//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var VaLoadingvue_type_script_lang_js_ = ({
  name: 'VaLoading',
  props: {
    type: {
      type: String
    },
    size: {
      type: String,
      default: 'md',
      validator: function validator(v) {
        return ['lg', 'md', 'sm', 'xs'].includes(v);
      }
    },
    center: {
      type: Boolean
    },
    fixed: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: '#DCDCDC',
      required: false,
      note: 'The color of the svg path.'
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          center = this.center,
          fixed = this.fixed;
      var klass = {};
      klass['affix'] = fixed;
      klass[prefixCls + '-page-loading-con'] = true;
      klass[prefixCls + '-loading-center'] = center;
      return klass;
    },
    iclassObj: function iclassObj() {
      var prefixCls = this.prefixCls,
          type = this.type,
          size = this.size,
          color = this.color;
      var klass = {};
      klass[prefixCls + '-page-loading'] = true;
      type ? klass[prefixCls + '-loading-' + type] = true : '';
      size ? klass[prefixCls + '-loading-' + size] = true : '';
      color ? klass['text-' + color] = true : '';
      return klass;
    }
  }
});
// CONCATENATED MODULE: ./src/Loading/VaLoading.vue?vue&type=script&lang=js&
 /* harmony default export */ var Loading_VaLoadingvue_type_script_lang_js_ = (VaLoadingvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Loading/VaLoading.vue





/* normalize component */

var VaLoading_component = normalizeComponent(
  Loading_VaLoadingvue_type_script_lang_js_,
  VaLoadingvue_type_template_id_81e3353e_render,
  VaLoadingvue_type_template_id_81e3353e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaLoading_component.options.__file = "VaLoading.vue"
/* harmony default export */ var VaLoading = (VaLoading_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Tooltip/VaTooltip.vue?vue&type=template&id=3df7f29d&
var VaTooltipvue_type_template_id_3df7f29d_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{ref:"tooltip"},[_c('span',{ref:"trigger"},[_vm._t("default")],2),_c('transition',{attrs:{"name":_vm.effect}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.isShow),expression:"isShow"}],ref:"popover",class:_vm.classObj},[(_vm.arrow)?_c('div',{class:(_vm.prefixCls + "-tooltip-arrow")}):_vm._e(),_c('div',{class:(_vm.prefixCls + "-tooltip-inner")},[_c('span',{domProps:{"innerHTML":_vm._s(_vm.content)}})])])])],1)}
var VaTooltipvue_type_template_id_3df7f29d_staticRenderFns = []


// CONCATENATED MODULE: ./src/Tooltip/VaTooltip.vue?vue&type=template&id=3df7f29d&

// CONCATENATED MODULE: ./src/Mixin/popoverMixin.js


var PopoverMixin = {
  props: {
    trigger: {
      type: String,
      default: 'click'
    },
    effect: {
      type: String,
      default: 'fadeDown'
    },
    title: {
      type: String
    },
    content: {
      type: String
    },
    header: {
      type: Boolean,
      default: true
    },
    placement: {
      type: String,
      default: 'top'
    },
    noresize: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    },
    onClick: {
      type: Function
    }
  },
  data: function data() {
    var show = this.show;
    return {
      isShow: show,
      position: {
        top: 0,
        left: 0
      }
    };
  },
  watch: {
    isShow: function isShow(val) {
      var _this = this;

      if (val && !this.noresize) {
        this.$nextTick(function () {
          _this.resize();
        });
      }
    }
  },
  methods: {
    toggle: function toggle() {
      this.isShow = !this.isShow;
    },
    resize: function resize() {
      var popover = this.$refs.popover;
      if (!popover) return;
      var triger = this.$refs.trigger.children[0];
      if (!triger) return;
      popover.style.display = 'block';
      triger.style.position = 'relative';

      switch (this.placement) {
        case 'top':
          this.position.left = triger.offsetLeft - popover.offsetWidth / 2 + triger.offsetWidth / 2;
          this.position.top = triger.offsetTop - popover.offsetHeight;
          break;

        case 'left':
          this.position.left = triger.offsetLeft - popover.offsetWidth;
          this.position.top = triger.offsetTop + triger.offsetHeight / 2 - popover.offsetHeight / 2;
          break;

        case 'right':
          this.position.left = triger.offsetLeft + triger.offsetWidth;
          this.position.top = triger.offsetTop + triger.offsetHeight / 2 - popover.offsetHeight / 2;
          break;

        case 'bottom':
          this.position.left = triger.offsetLeft - popover.offsetWidth / 2 + triger.offsetWidth / 2;
          this.position.top = triger.offsetTop + triger.offsetHeight;
          break;

        default:
          console.log('Wrong placement group');
      }

      popover.style.top = this.position.top + 'px';
      popover.style.left = this.position.left + 'px';
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    if (!this.$refs.popover) return;
    this.$nextTick(function () {
      var popover = _this2.$refs.popover;
      if (!popover) return;
      var triger = _this2.$refs.trigger.children[0];
      if (!triger) return;

      if (_this2.trigger === 'hover') {
        _this2._mouseenterEvent = utils_EventListener.listen(triger, 'mouseenter', function () {
          setTimeout(function () {
            _this2.isShow = true;
          }, 200);
        });
        _this2._mouseleaveEvent = utils_EventListener.listen(triger, 'mouseleave', function () {
          setTimeout(function () {
            _this2.isShow = false;
          }, 200);
        });
      } else if (_this2.trigger === 'focus') {
        var input = _this2.$refs.trigger.querySelector('input');

        if (input) {
          _this2._focusEvent = utils_EventListener.listen(input, 'focus', function () {
            _this2.isShow = true;
          });
          _this2._blurEvent = utils_EventListener.listen(input, 'blur', function () {
            _this2.isShow = false;
          });
        }
      } else if (_this2.trigger === 'mouse') {
        _this2._mousedownEvent = utils_EventListener.listen(triger, 'mousedown', function () {
          _this2.isShow = true;
        });
        _this2._mouseupEvent = utils_EventListener.listen(window, 'mouseup', function () {
          _this2.isShow = false;
        });
      } else {
        _this2._clickEvent = utils_EventListener.listen(triger, 'click', _this2.toggle);
        _this2._closeEvent = utils_EventListener.listen(window, 'click', function (e) {
          if (!_this2.$el.contains(e.target)) _this2.isShow = false;

          if (_this2.$refs.content && _this2.$refs.content.contains(e.target) && utils_type.isFunction(_this2.onClick)) {
            _this2.onClick(e, _this2);
          }
        });
      }

      _this2.resize();

      popover.style.display = 'none';
      _this2.isShow = false;
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this._blurEvent) {
      this._blurEvent.remove();

      this._focusEvent.remove();
    }

    if (this._mouseenterEvent) {
      this._mouseenterEvent.remove();

      this._mouseleaveEvent.remove();
    }

    if (this._clickEvent) {
      this._clickEvent.remove();

      this._closeEvent.remove();
    }

    if (this._mousedownEvent) {
      this._mousedownEvent.remove();

      this._mouseupEvent.remove();
    }
  }
};
/* harmony default export */ var popoverMixin = (PopoverMixin);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Tooltip/VaTooltip.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var VaTooltipvue_type_script_lang_js_ = ({
  name: 'VaTooltip',
  props: {
    arrow: {
      type: Boolean,
      default: false
    },
    effect: {
      type: String,
      default: 'tooltip-fade-top' // tooltip-fade-top, -left, -right, -bottom

    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  mixins: [popoverMixin],
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          placement = this.placement;
      var klass = {};
      klass[prefixCls + '-tooltip'] = true;
      klass[prefixCls + '-tooltip-top'] = placement === 'top';
      klass[prefixCls + '-tooltip-right'] = placement === 'right';
      klass[prefixCls + '-tooltip-bottom'] = placement === 'bottom';
      klass[prefixCls + '-tooltip-left'] = placement === 'left';
      return klass;
    }
  }
});
// CONCATENATED MODULE: ./src/Tooltip/VaTooltip.vue?vue&type=script&lang=js&
 /* harmony default export */ var Tooltip_VaTooltipvue_type_script_lang_js_ = (VaTooltipvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Tooltip/VaTooltip.vue





/* normalize component */

var VaTooltip_component = normalizeComponent(
  Tooltip_VaTooltipvue_type_script_lang_js_,
  VaTooltipvue_type_template_id_3df7f29d_render,
  VaTooltipvue_type_template_id_3df7f29d_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaTooltip_component.options.__file = "VaTooltip.vue"
/* harmony default export */ var VaTooltip = (VaTooltip_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Desktop/VaDesktop.vue?vue&type=template&id=768ad43e&
var VaDesktopvue_type_template_id_768ad43e_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[(!_vm.isMobile)?_vm._t("default"):_vm._e()],2)}
var VaDesktopvue_type_template_id_768ad43e_staticRenderFns = []


// CONCATENATED MODULE: ./src/Desktop/VaDesktop.vue?vue&type=template&id=768ad43e&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Desktop/VaDesktop.vue?vue&type=script&lang=js&
//
//
//
//
//
//

/* harmony default export */ var VaDesktopvue_type_script_lang_js_ = ({
  name: 'VaDesktop',
  mixins: [events],
  props: {
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    return {
      isMobile: false
    };
  },
  created: function created() {
    var _this = this;

    this.$on('Va@desktopIsMobile', function (val) {
      _this.isMobile = val;
    });
    /**
     * In case this component is instantiated after the App
     * has initially broadcasted isMobile, let's request it.
     */

    this.dispatch('VaApp', 'Va@requestIsMobile', true);
  }
});
// CONCATENATED MODULE: ./src/Desktop/VaDesktop.vue?vue&type=script&lang=js&
 /* harmony default export */ var Desktop_VaDesktopvue_type_script_lang_js_ = (VaDesktopvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Desktop/VaDesktop.vue





/* normalize component */

var VaDesktop_component = normalizeComponent(
  Desktop_VaDesktopvue_type_script_lang_js_,
  VaDesktopvue_type_template_id_768ad43e_render,
  VaDesktopvue_type_template_id_768ad43e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaDesktop_component.options.__file = "VaDesktop.vue"
/* harmony default export */ var VaDesktop = (VaDesktop_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Lozenge/VaLozenge.vue?vue&type=template&id=5baae2ea&
var VaLozengevue_type_template_id_5baae2ea_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{class:_vm.classObj},[_vm._t("default")],2)}
var VaLozengevue_type_template_id_5baae2ea_staticRenderFns = []


// CONCATENATED MODULE: ./src/Lozenge/VaLozenge.vue?vue&type=template&id=5baae2ea&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.string.bold.js
var es6_string_bold = __webpack_require__("48c0");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Lozenge/VaLozenge.vue?vue&type=script&lang=js&



//
//
//
//
//
//
/* harmony default export */ var VaLozengevue_type_script_lang_js_ = ({
  name: 'VaLozenge',
  props: {
    type: {
      type: String,
      required: false,
      default: 'default',
      note: 'The style of lozenge to render.',
      validator: function validator(v) {
        return ['default', 'primary', 'success', 'warning', 'danger', 'subtle', 'purple'].includes(v);
      }
    },
    bold: {
      type: Boolean,
      required: false,
      default: false,
      note: 'Whether or not to render the bold version of the lozenge.'
    },
    uppercase: {
      type: Boolean,
      required: false,
      default: false,
      note: 'Whether or not to render the uppercase version of the lozenge.'
    },
    truncate: {
      type: Boolean,
      required: false,
      default: false,
      note: 'Whether or not to truncate text after 200px'
    },
    size: {
      type: String,
      required: false,
      note: 'Which size of lozenge to render.',
      validator: function validator(v) {
        return ['lg', 'sm'].includes(v);
      }
    },
    prefixCls: {
      type: String,
      required: false,
      default: 'va'
    }
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          bold = this.bold,
          type = this.type,
          size = this.size,
          uppercase = this.uppercase,
          truncate = this.truncate;
      var klass = {};
      klass[prefixCls + '-lozenge'] = true;
      klass[prefixCls + '-lozenge-bold'] = bold;
      type ? klass[prefixCls + '-lozenge-' + type] = true : '';
      size ? klass[prefixCls + '-lozenge-' + size] = true : '';
      uppercase ? klass[prefixCls + '-lozenge-uppercase'] = true : '';
      truncate ? klass[prefixCls + '-lozenge-truncate'] = true : '';
      return klass;
    }
  }
});
// CONCATENATED MODULE: ./src/Lozenge/VaLozenge.vue?vue&type=script&lang=js&
 /* harmony default export */ var Lozenge_VaLozengevue_type_script_lang_js_ = (VaLozengevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Lozenge/VaLozenge.vue





/* normalize component */

var VaLozenge_component = normalizeComponent(
  Lozenge_VaLozengevue_type_script_lang_js_,
  VaLozengevue_type_template_id_5baae2ea_render,
  VaLozengevue_type_template_id_5baae2ea_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaLozenge_component.options.__file = "VaLozenge.vue"
/* harmony default export */ var VaLozenge = (VaLozenge_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Sidebar/VaSidebar.vue?vue&type=template&id=596c4f9e&
var VaSidebarvue_type_template_id_596c4f9e_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.classObj,style:(_vm.styleObj)},[_vm._t("default")],2)}
var VaSidebarvue_type_template_id_596c4f9e_staticRenderFns = []


// CONCATENATED MODULE: ./src/Sidebar/VaSidebar.vue?vue&type=template&id=596c4f9e&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Sidebar/VaSidebar.vue?vue&type=script&lang=js&
//
//
//
//
//
//

/* harmony default export */ var VaSidebarvue_type_script_lang_js_ = ({
  name: 'VaSidebar',
  mixins: [events],
  props: {
    compact: {
      type: Boolean,
      default: false,
      required: false
    },
    textLinks: {
      type: Boolean,
      default: false,
      required: false
    },
    theme: {
      type: String,
      default: 'default',
      required: false
    },
    showToggle: {
      type: Boolean,
      default: false,
      required: false
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    var tli = this.textLinks;
    var s = this.showToggle;
    var c = this.compact;
    var t = this.theme;
    return {
      currentDesktopMinimumWidth: 0,
      currentDesktopMargin: 0,
      currentSidebarWidth: 0,
      currentTopbarHeight: 0,
      minibarPriority: false,
      currentContentWidth: 0,
      sidebarPriority: false,
      currentMinibarWidth: 0,
      currentWindowWidth: 0,
      isReverse: false,
      isMobile: false,
      isSplit: false,
      isRTL: false,
      comp: c,
      tl: tli,
      th: t,
      st: s
    };
  },
  created: function created() {
    var _this = this;

    this.$on('Va@sidebarPresenceCheck', function (val) {
      _this.dispatch('VaApp', 'Va@sidebarPresenceReply', true);
    });
    this.$on('Va@desktopMinimumWidthChange', function (val) {
      _this.currentDesktopMinimumWidth = val;
    });
    this.$on('Va@desktopMarginChange', function (val) {
      _this.currentDesktopMargin = val;
    });
    this.$on('Va@minibarWidthChange', function (val) {
      _this.currentMinibarWidth = val;
    });
    this.$on('Va@topbarHeightChange', function (val) {
      _this.currentTopbarHeight = val;
    });
    this.$on('Va@contentWidthChange', function (val) {
      _this.currentContentWidth = val;
    });
    this.$on('Va@sidebarWidthChange', function (val) {
      _this.currentSidebarWidth = val;
    });
    this.$on('Va@minibarPriorityChange', function (val) {
      _this.minibarPriority = val;
    });
    this.$on('Va@sidebarPriorityChange', function (val) {
      _this.sidebarPriority = val;
    });
    this.$on('Va@windowWidthChange', function (val) {
      _this.currentWindowWidth = val;
    });
    this.$on('Va@sidebarIsMobile', function (val) {
      _this.isMobile = val;
    });
    this.$on('Va@reverseChange', function (val) {
      _this.isReverse = val;
    });
    this.$on('Va@sidebarThemeChange', function (val) {
      _this.th = val;
    });
    this.$on('Va@showToggleChange', function (val) {
      _this.st = val;
    });
    this.$on('Va@splitChange', function (val) {
      _this.isSplit = val;
    });
    this.$on('Va@textLinksChange', function (val) {
      _this.tl = val;
    });
    this.$on('Va@compactChange', function (val) {
      _this.comp = val;
    });
    this.$on('Va@rtlChange', function (val) {
      _this.isRTL = val;
    });
  },
  mounted: function mounted() {
    var _this2 = this;

    /**
     * This needs to be wrapped in a short setTimeout to give
     * App time to call enableReceivers().
     */
    setTimeout(function () {
      _this2.dispatch('VaApp', 'Va@configSidebarThemeChange', _this2.th);

      _this2.dispatch('VaApp', 'Va@configCompactChange', _this2.comp);

      _this2.dispatch('VaApp', 'Va@configTextLinksChange', _this2.tl);
    }, 10);
  },
  beforeDestroy: function beforeDestroy() {
    this.dispatch('VaApp', 'Va@sidebarDisconnect', true);
  },
  watch: {
    theme: function theme(val) {
      this.th = val;
      this.dispatch('VaApp', 'Va@configSidebarThemeChange', this.th);
    }
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          th = this.th,
          isMobile = this.isMobile,
          comp = this.comp,
          tl = this.tl;
      var klass = {};
      klass[prefixCls + '-sidebar'] = true;
      klass[prefixCls + '-sidebar--theme-' + th] = true;
      klass[prefixCls + '-sidebar-mobile'] = isMobile;
      klass[prefixCls + '-sidebar-compact'] = comp;
      klass[prefixCls + '-sidebar-text-links'] = tl;
      return klass;
    },
    styleObj: function styleObj() {
      var dmw = parseInt(this.currentDesktopMinimumWidth);
      var dm = parseInt(this.currentDesktopMargin);
      var sw = parseInt(this.currentSidebarWidth);
      var th = parseInt(this.currentTopbarHeight);
      var cw = parseInt(this.currentContentWidth);
      var mw = parseInt(this.currentMinibarWidth);
      var sp = this.sidebarPriority;
      var mp = this.minibarPriority;
      var reverse = this.isReverse;
      var mobile = this.isMobile;
      var split = this.isSplit;
      var rtl = this.isRTL;
      var style = {};
      style['width'] = sw + 'px';
      style['min-width'] = sw + 'px';

      if (sp) {
        style['top'] = '0px';
      } else {
        style['top'] = th + 'px';
      }
      /**
       * Adjust the margins if content width is smaller than
       * desktop minimum width.
       */


      if (!mobile) {
        if (cw < dmw) {
          var x = dmw - cw;
          dm = dm - x / 2;
        }
      } else {
        dm = 0;
        dmw = 0;
      }

      if (split) {
        if (reverse) {
          style['left'] = dm + 'px';
        } else {
          style['right'] = dm + 'px';
        }
      } else {
        if (reverse) {
          if (rtl) {
            style['right'] = dm + mw + 'px';
          } else {
            style['left'] = dm + 'px';
          }
        } else {
          if (rtl) {
            style['right'] = dm + 'px';
          } else {
            style['left'] = dm + mw + 'px';
          }
        }
      }

      if (!sp && mp && reverse && !split && !rtl) {
        style['top'] = '0px';
      }

      if (rtl && !split && !reverse && !sp && mp) {
        style['top'] = '0px';
      }

      style['bottom'] = '0px';
      return style;
    }
  } // methods: {
  //   initResize (e) {
  //     /**
  //      * Prevent text selection while dragging.
  //      * https://stackoverflow.com/questions/5429827/how-can-i-prevent-text-element-selection-with-cursor-drag
  //      */
  //     if (e.stopPropagation) {
  //       e.stopPropagation()
  //     }
  //     if (e.preventDefault) {
  //       e.preventDefault()
  //     }
  //     e.cancelBubble = true
  //     e.returnValue = false
  //     window.addEventListener('mousemove', this.doResize, false)
  //     window.addEventListener('mouseup', this.stopResize, false)
  //   },
  //   doResize (e) {
  //     let el = this.$refs.sidebar
  //     this.dispatch('VaApp', 'Va@sidebarWidthChange', e.clientX - el.offsetLeft)
  //   },
  //   stopResize () {
  //     window.removeEventListener('mouseup', this.stopResize, false)
  //     window.removeEventListener('mousemove', this.doResize, false)
  //   }
  // }

});
// CONCATENATED MODULE: ./src/Sidebar/VaSidebar.vue?vue&type=script&lang=js&
 /* harmony default export */ var Sidebar_VaSidebarvue_type_script_lang_js_ = (VaSidebarvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Sidebar/VaSidebar.vue





/* normalize component */

var VaSidebar_component = normalizeComponent(
  Sidebar_VaSidebarvue_type_script_lang_js_,
  VaSidebarvue_type_template_id_596c4f9e_render,
  VaSidebarvue_type_template_id_596c4f9e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaSidebar_component.options.__file = "VaSidebar.vue"
/* harmony default export */ var VaSidebar = (VaSidebar_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Dropdown/VaDropdown.vue?vue&type=template&id=c8a048fc&
var VaDropdownvue_type_template_id_c8a048fc_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:[(_vm.prefixCls + "-dropdown-con"), _vm.classObj]},[_c('span',{ref:"trigger",attrs:{"focus":_vm.onFocus}},[_vm._t("trigger")],2),(_vm.effect != 'collapse')?_c('transition',{attrs:{"name":_vm.effect}},[_c('ul',{directives:[{name:"va-position",rawName:"v-va-position",value:(_vm.show),expression:"show"},{name:"show",rawName:"v-show",value:(_vm.show),expression:"show"}],class:(_vm.prefixCls + "-dropdown-menu")},[_vm._t("default")],2)]):_vm._e(),(_vm.effect=='collapse')?_c('va-collapse-transition',[_c('ul',{directives:[{name:"show",rawName:"v-show",value:(_vm.show),expression:"show"}],class:(_vm.prefixCls + "-dropdown-menu")},[_vm._t("default")],2)]):_vm._e()],1)}
var VaDropdownvue_type_template_id_c8a048fc_staticRenderFns = []


// CONCATENATED MODULE: ./src/Dropdown/VaDropdown.vue?vue&type=template&id=c8a048fc&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/VaCollapseTransition.vue?vue&type=template&id=85d66612&
var VaCollapseTransitionvue_type_template_id_85d66612_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"VaCollapseTransition"},on:{"enter":_vm.enter,"leave":_vm.leave}},[_vm._t("default")],2)}
var VaCollapseTransitionvue_type_template_id_85d66612_staticRenderFns = []


// CONCATENATED MODULE: ./src/VaCollapseTransition.vue?vue&type=template&id=85d66612&

// EXTERNAL MODULE: external "velocity-animate"
var external_velocity_animate_ = __webpack_require__("044b");
var external_velocity_animate_default = /*#__PURE__*/__webpack_require__.n(external_velocity_animate_);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/VaCollapseTransition.vue?vue&type=script&lang=js&
//
//
//
//
//
//


function animate(node, show, transitionName, done) {
  var ok;

  function complete() {
    if (!ok) {
      ok = true;
      done();
    }
  }

  node.style.display = show ? 'block' : 'none';
  external_velocity_animate_default()(node, transitionName, {
    duration: 200,
    complete: complete,
    easing: 'easeInOutQuad'
  });
  return {
    stop: function stop() {
      external_velocity_animate_default()(node, 'finish');
      complete();
    }
  };
}

/* harmony default export */ var VaCollapseTransitionvue_type_script_lang_js_ = ({
  name: 'VaCollapseTransition',
  methods: {
    enter: function enter(el, done) {
      return animate(el, false, 'slideDown', done);
    },
    leave: function leave(el, done) {
      return animate(el, true, 'slideUp', done);
    }
  }
});
// CONCATENATED MODULE: ./src/VaCollapseTransition.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_VaCollapseTransitionvue_type_script_lang_js_ = (VaCollapseTransitionvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/VaCollapseTransition.vue





/* normalize component */

var VaCollapseTransition_component = normalizeComponent(
  src_VaCollapseTransitionvue_type_script_lang_js_,
  VaCollapseTransitionvue_type_template_id_85d66612_render,
  VaCollapseTransitionvue_type_template_id_85d66612_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaCollapseTransition_component.options.__file = "VaCollapseTransition.vue"
/* harmony default export */ var VaCollapseTransition = (VaCollapseTransition_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Dropdown/VaDropdown.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var VaDropdownvue_type_script_lang_js_ = ({
  name: 'VaDropdown',
  props: {
    triggerEvent: {
      type: String,
      default: 'click',
      required: false,
      note: 'Trigger method. Can be either \'click\' or \'hover\'.'
    },
    clickClose: {
      type: Boolean,
      default: false,
      required: false,
      note: "If true, require that the trigger element be clicked\n            again in order to close the dropdown menu. Otherwise,\n            clicking anywhere else in the window will close it."
    },
    effect: {
      type: String,
      default: 'fadeDown',
      required: false,
      note: 'The effect to use.'
    },
    tall: {
      type: Boolean,
      default: false,
      required: false
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    return {
      show: false
    };
  },
  methods: {
    open: function open() {
      this.show = true;
      this.$emit('show');
    },
    close: function close() {
      this.show = false;
      this.$emit('hide');
    },
    toggle: function toggle() {
      this.show ? this.close() : this.open();
      this.$emit('toggle');
    },
    onFocus: function onFocus() {}
  },
  components: {
    VaCollapseTransition: VaCollapseTransition
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          tall = this.tall;
      var klass = {};
      klass[prefixCls + '-dropdown-selected'] = this.show;
      klass[prefixCls + '-dropdown-con-tall'] = tall;
      return klass;
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      var el = _this.$el;
      var trig = _this.$refs.trigger.children[0];

      if (_this.triggerEvent === 'click') {
        _this._clickEvent = utils_EventListener.listen(trig, 'click', _this.toggle);
        _this._closeEvent = utils_EventListener.listen(window, 'click', function (e) {
          if (!_this.clickClose && !el.contains(e.target) && _this.show) {
            _this.close();
          }
        });
      } else if (_this.triggerEvent === 'hover') {
        _this._mouseenterEvent = utils_EventListener.listen(trig, 'mouseenter', function () {
          _this.open();
        });
        _this._closeEvent = utils_EventListener.listen(_this.$el, 'mouseleave', function () {
          setTimeout(function () {
            _this.close();
          }, 500);
        });
      }
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this._closeEvent) this._closeEvent.remove();
    if (this._clickEvent) this._clickEvent.remove();
    if (this._mouseenterEvent) this._mouseenterEvent.remove();
  }
});
// CONCATENATED MODULE: ./src/Dropdown/VaDropdown.vue?vue&type=script&lang=js&
 /* harmony default export */ var Dropdown_VaDropdownvue_type_script_lang_js_ = (VaDropdownvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/Dropdown/VaDropdown.vue?vue&type=style&index=0&lang=scss&
var VaDropdownvue_type_style_index_0_lang_scss_ = __webpack_require__("5b53");

// CONCATENATED MODULE: ./src/Dropdown/VaDropdown.vue






/* normalize component */

var VaDropdown_component = normalizeComponent(
  Dropdown_VaDropdownvue_type_script_lang_js_,
  VaDropdownvue_type_template_id_c8a048fc_render,
  VaDropdownvue_type_template_id_c8a048fc_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaDropdown_component.options.__file = "VaDropdown.vue"
/* harmony default export */ var VaDropdown = (VaDropdown_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Grid/VaContainer.vue?vue&type=template&id=6529e6b7&
var VaContainervue_type_template_id_6529e6b7_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.classObj},[_vm._t("default")],2)}
var VaContainervue_type_template_id_6529e6b7_staticRenderFns = []


// CONCATENATED MODULE: ./src/Grid/VaContainer.vue?vue&type=template&id=6529e6b7&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Grid/VaContainer.vue?vue&type=script&lang=js&
//
//
//
//
//
/* harmony default export */ var VaContainervue_type_script_lang_js_ = ({
  name: 'VaContainer',
  props: {
    fluid: {
      type: Boolean
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          fluid = this.fluid;
      var klass = {};
      klass[prefixCls + '-container-fluid'] = fluid;
      klass[prefixCls + '-container'] = !fluid;
      klass['clearfix'] = true;
      return klass;
    }
  }
});
// CONCATENATED MODULE: ./src/Grid/VaContainer.vue?vue&type=script&lang=js&
 /* harmony default export */ var Grid_VaContainervue_type_script_lang_js_ = (VaContainervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Grid/VaContainer.vue





/* normalize component */

var VaContainer_component = normalizeComponent(
  Grid_VaContainervue_type_script_lang_js_,
  VaContainervue_type_template_id_6529e6b7_render,
  VaContainervue_type_template_id_6529e6b7_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaContainer_component.options.__file = "VaContainer.vue"
/* harmony default export */ var VaContainer = (VaContainer_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Textarea/VaTextarea.vue?vue&type=template&id=805d8f82&
var VaTextareavue_type_template_id_805d8f82_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (!_vm.showButtonsWarning)?_c('div',{ref:"textareaContainer",class:_vm.classObjContainer,style:(_vm.styleObjContainer)},[_c('textarea',{directives:[{name:"model",rawName:"v-model",value:(_vm.currentValue),expression:"currentValue"}],ref:"textarea",class:_vm.classObj,style:(_vm.styleObj),attrs:{"disabled":_vm.disabled,"readonly":_vm.readonly,"maxlength":_vm.maxLength,"name":_vm.name,"placeholder":_vm.placeholder},domProps:{"value":(_vm.currentValue)},on:{"input":[function($event){if($event.target.composing){ return; }_vm.currentValue=$event.target.value},function($event){_vm.update($event.target.value)}],"focus":_vm.focus,"blur":_vm.blur,"keydown":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"tab",9,$event.key,"Tab")){ return null; }return _vm.kd_tab($event)}}}),(_vm.buttons)?_c('va-input-ops',{attrs:{"parent-position":_vm.position},on:{"confirm":_vm.opsConfirm,"cancel":_vm.opsCancel}}):_vm._e(),_c('validate',{attrs:{"name":_vm.name,"rules":_vm.rules,"custom-validate":_vm.customValidate,"current":_vm.value}})],1):_c('div',[_c('va-alert',{attrs:{"type":"warning"}},[_c('h4',[_vm._v("Hold on")]),_c('p',[_vm._v("\n        If you're going to use "),_c('b',[_vm._v("buttons")]),_vm._v(" with this textarea component, you need\n        to also use the "),_c('b',[_vm._v("loading")]),_vm._v(" prop.\n\n        Handle the "),_c('b',[_vm._v("@confirm")]),_vm._v(" event emitted by the input component, set the\n        "),_c('b',[_vm._v("loading")]),_vm._v(" prop to true, "),_c('i',[_vm._v("do some task")]),_vm._v(", and finally set the "),_c('b',[_vm._v("loading")]),_vm._v("\n        prop back to false.\n\n        It is important that events happen in that order, because the input component\n        is watching the "),_c('b',[_vm._v("loading")]),_vm._v(" prop for those changes. That's how it knows to hide\n        the confirm and cancel buttons.\n      ")])])],1)}
var VaTextareavue_type_template_id_805d8f82_staticRenderFns = []


// CONCATENATED MODULE: ./src/Textarea/VaTextarea.vue?vue&type=template&id=805d8f82&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Textarea/VaTextarea.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ var VaTextareavue_type_script_lang_js_ = ({
  name: 'VaTextarea',
  mixins: [validationMixin, events],
  props: {
    name: {
      type: String
    },
    placeholder: {
      type: String,
      default: '',
      required: false
    },
    resize: {
      type: Boolean,
      default: true,
      required: false
    },
    maxLength: {
      type: Number,
      required: false
    },
    width: {
      type: String,
      default: '220px',
      required: false
    },
    maxHeight: {
      type: String,
      required: false,
      default: '200px'
    },
    minHeight: {
      type: String,
      required: false,
      default: '100px'
    },
    value: {
      type: String
    },
    readonly: {
      type: Boolean,
      default: false,
      required: false
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    buttons: {
      type: Boolean,
      default: false,
      required: false
    },
    loading: {
      type: Boolean,
      default: undefined
    },
    autosize: {
      type: Boolean,
      default: true
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    var cv = this.value;
    return {
      focused: false,
      currentValue: cv,
      position: {},
      showButtonsWarning: false,
      desiredHeight: 0,
      inputWatch: null
    };
  },
  components: {
    validate: validate
  },
  created: function created() {
    var _this = this;

    this.$on('Va@inputOpsCancel', function (val) {
      _this.currentValue = val;
    });
    this.$on('Va@inputOpsConfirm', function () {});
    this.$on('Va@inputOpsBlur', function () {
      _this.focused = false;
    });
    this.$on('Va@pageScroll', function () {
      _this.setPosition();
    }); // document.addEventListener('keyup', this.keyup)
  },
  beforeDestroy: function beforeDestroy() {
    this.$refs.textarea.removeEventListener('input', this.resizeTextarea);
    window.removeEventListener('resize', this.setPosition, false);
    window.removeEventListener('scroll', this.setPosition, false); // document.removeEventListener('keyup', this.keyup)
  },
  mounted: function mounted() {
    var _this2 = this;

    this.$refs.textarea.addEventListener('input', this.resizeTextarea);
    window.addEventListener('resize', this.setPosition, false);
    window.addEventListener('scroll', this.setPosition, false);

    if (this.buttons && this.loading === undefined) {
      this.showButtonsWarning = true;
    }

    if (this.autosize) {
      this.$nextTick(function () {
        _this2.$refs.textareaContainer.style.height = _this2.$refs.textareaContainer.scrollHeight + 'px';
      });
    }
  },
  watch: {
    loading: function loading(val) {
      this.broadcast('VaInputOps', 'Va@inputLoading', val);
    },
    value: function value(val) {
      this.currentValue = val;
    },
    currentValue: function currentValue(val) {
      this.broadcast('VaInputOps', 'Va@inputCurrentValueUpdate', val);
    }
  },
  methods: {
    kd_tab: function kd_tab(e) {
      e.preventDefault();
      var textarea = this.$refs.textarea;
      var start = textarea.selectionStart;
      var end = textarea.selectionEnd;
      var target = e.target;
      var value = target.value;
      target.value = value.substring(0, start) + '\t' + value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 1;
    },
    update: function update(val) {
      var _this3 = this;

      this.$emit('input', val);
      this.$emit('change', val);

      if (this.buttons) {
        this.broadcast('VaInputOps', 'Va@inputUpdate', this.currentValue);
      }
      /**
       * If a bunch of text was pasted into the input, we should wait a short bit
       * before updating the position of the element, so that inputOps can be
       * adjusted to the correct location.
       */


      setTimeout(function () {
        _this3.position = _this3.getPosition();
      }, 20);
    },
    focus: function focus() {
      var _this4 = this;

      /**
       * This setTimeout exists because sometimes you'll want to call
       * this.$refs.input.focus() when the input is inside of something
       * like, say, a dropdown. We need to give the element time to be
       * added to the DOM before we send a focus event to it.
       * 
       * This short timeout provides, what seems like, a fine amount of
       * time for this to happen without being noticable by the human eye.
       */
      setTimeout(function () {
        _this4.$refs.textarea.focus();

        _this4.$emit('focus', _this4.value);

        _this4.focused = true;

        if (_this4.buttons) {
          _this4.position = _this4.getPosition();

          _this4.broadcast('VaInputOps', 'Va@inputFocus', _this4.currentValue);
        }
      }, 20);
    },
    blur: function blur() {
      this.focused = false;
      this.$emit('blur', this.value);

      if (this.buttons) {
        this.broadcast('VaInputOps', 'Va@inputBlur', this.currentValue);
      }
    },
    enterPressed: function enterPressed() {
      this.opsConfirm();
    },
    setPosition: function setPosition() {
      this.position = this.getPosition();
    },
    getPosition: function getPosition() {
      var rect = this.$refs.textarea.getBoundingClientRect();
      return {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y
      };
    },
    opsConfirm: function opsConfirm() {
      this.$emit('confirm', this.value);
    },
    opsCancel: function opsCancel() {
      this.$emit('cancel');
    },
    resizeTextarea: function resizeTextarea(event) {
      if (this.autosize) {
        // event.target.style.height = 'auto'
        // event.target.style.height = (event.target.scrollHeight + 4) + 'px'
        this.$refs.textareaContainer.style.height = 'auto';
        this.$refs.textareaContainer.style.height = event.target.scrollHeight + 4 + 'px';
        this.position = this.getPosition();
      }
    }
  },
  computed: {
    styleObj: function styleObj() {
      var resize = this.resize;
      var style = {};
      style['resize'] = resize ? 'both' : 'none';
      return style;
    },
    classObj: function classObj() {
      var prefixCls = this.prefixCls;
      var klass = {};
      klass[prefixCls + '-form-control'] = true;
      klass[prefixCls + '-textarea'] = true;
      return klass;
    },
    styleObjContainer: function styleObjContainer() {
      var minHeight = this.minHeight,
          width = this.width;
      var style = {};
      style['width'] = width;
      style['min-height'] = minHeight;
      return style;
    },
    classObjContainer: function classObjContainer() {
      var prefixCls = this.prefixCls;
      var klass = {};
      klass[prefixCls + '-textarea-con'] = true; // klass['inline'] = true

      return klass;
    }
  }
});
// CONCATENATED MODULE: ./src/Textarea/VaTextarea.vue?vue&type=script&lang=js&
 /* harmony default export */ var Textarea_VaTextareavue_type_script_lang_js_ = (VaTextareavue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Textarea/VaTextarea.vue





/* normalize component */

var VaTextarea_component = normalizeComponent(
  Textarea_VaTextareavue_type_script_lang_js_,
  VaTextareavue_type_template_id_805d8f82_render,
  VaTextareavue_type_template_id_805d8f82_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaTextarea_component.options.__file = "VaTextarea.vue"
/* harmony default export */ var VaTextarea = (VaTextarea_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Checkbox/VaCheckbox.vue?vue&type=template&id=2a8a74b0&
var VaCheckboxvue_type_template_id_2a8a74b0_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('label',{class:_vm.classObj},[_c('span',[_c('span',{class:(_vm.prefixCls + "-checkbox-inner"),attrs:{"tabindex":_vm.disabled ? -1 : 0},on:{"keypress":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"space",32,$event.key,[" ","Spacebar"])){ return null; }$event.preventDefault();return _vm.handleClick($event)},"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.enterPressed($event)}}},[_c('va-icon',{class:(_vm.prefixCls + "-checkbox-inner-check"),attrs:{"type":"check"}})],1),_c('input',{class:(_vm.prefixCls + "-checkbox-input"),attrs:{"disabled":_vm.disabled,"name":_vm.name,"tabindex":"-1","type":"checkbox"},domProps:{"checked":_vm.currentChecked},on:{"click":_vm.handleClick}})]),_c('span',{class:(_vm.prefixCls + "-label")},[_vm._t("default")],2),_c('validate',{attrs:{"current":_vm.currentChecked,"custom-validate":_vm.customValidate,"name":_vm.name,"rules":_vm.rules}})],1)}
var VaCheckboxvue_type_template_id_2a8a74b0_staticRenderFns = []


// CONCATENATED MODULE: ./src/Checkbox/VaCheckbox.vue?vue&type=template&id=2a8a74b0&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Checkbox/VaCheckbox.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ var VaCheckboxvue_type_script_lang_js_ = ({
  name: 'VaCheckbox',
  mixins: [validationMixin, events],
  props: {
    name: {
      type: String
    },
    value: {
      type: [String, Boolean]
    },
    checked: {
      type: Boolean,
      default: false
    },
    label: {
      type: [String, Number]
    },
    disabled: {
      type: Boolean,
      default: false
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  components: {
    validate: validate
  },
  data: function data() {
    var checked = this.checked;

    if (checked !== undefined) {
      this.$emit('input', checked);
    } else {
      checked = !!this.value;
    }

    return {
      currentChecked: checked
    };
  },
  watch: {
    value: function value(val) {
      this.currentChecked = val;
    },
    checked: function checked(val) {
      this.currentChecked = val;
    },
    currentChecked: function currentChecked(val) {
      this.$emit('input', val);
    }
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          currentChecked = this.currentChecked,
          disabled = this.disabled;
      var klass = {};
      klass[prefixCls + '-checkbox-label'] = true;
      klass[prefixCls + '-checkbox-checked'] = currentChecked;
      klass[prefixCls + '-checkbox-disabled'] = disabled;
      return klass;
    }
  },
  created: function created() {
    var _this = this;

    this.$on('Va@checkboxgroupChange', function (val) {
      _this.currentChecked = val.indexOf(_this.label) > -1;
    });
  },
  methods: {
    handleClick: function handleClick() {
      this.currentChecked = !this.currentChecked;
      this.dispatch('VaCheckboxGroup', 'Va@checkboxChange', this);
      this.$emit('change', this.currentChecked);
    },
    enterPressed: function enterPressed() {
      this.handleClick();
    }
  }
});
// CONCATENATED MODULE: ./src/Checkbox/VaCheckbox.vue?vue&type=script&lang=js&
 /* harmony default export */ var Checkbox_VaCheckboxvue_type_script_lang_js_ = (VaCheckboxvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Checkbox/VaCheckbox.vue





/* normalize component */

var VaCheckbox_component = normalizeComponent(
  Checkbox_VaCheckboxvue_type_script_lang_js_,
  VaCheckboxvue_type_template_id_2a8a74b0_render,
  VaCheckboxvue_type_template_id_2a8a74b0_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaCheckbox_component.options.__file = "VaCheckbox.vue"
/* harmony default export */ var VaCheckbox = (VaCheckbox_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Radio/VaRadioGroup.vue?vue&type=template&id=ec615676&
var VaRadioGroupvue_type_template_id_ec615676_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.classObj},[_vm._t("default"),_c('validate',{attrs:{"name":_vm.name,"rules":_vm.rules,"custom-validate":_vm.customValidate,"current":_vm.value}})],2)}
var VaRadioGroupvue_type_template_id_ec615676_staticRenderFns = []


// CONCATENATED MODULE: ./src/Radio/VaRadioGroup.vue?vue&type=template&id=ec615676&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Radio/VaRadioGroup.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ var VaRadioGroupvue_type_script_lang_js_ = ({
  name: 'VaRadioGroup',
  mixins: [validationMixin, events],
  props: {
    value: {
      type: [String, Array]
    },
    vertical: {
      type: Boolean,
      default: false
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    return {
      currentValue: ''
    };
  },
  methods: {
    init: function init(val) {
      if (!utils_type.isUndefined(val)) {
        this.currentValue = val;
      } else {
        // first load
        var children = this.$children;
        var ret;
        children.forEach(function (item) {
          item.currentChecked ? ret = item.label : '';
        });
        this.currentValue = ret;
      }
    }
  },
  watch: {
    value: function value(val) {
      this.currentValue = val;
    },
    currentValue: function currentValue(val) {
      this.broadcast('VaRadio', 'Va@radiogroupChange', val);
      this.broadcast('VaRadioBtn', 'Va@radiogroupChange', val);
      this.$emit('input', val);
      this.$emit('change', val);
    }
  },
  created: function created() {
    var _this = this;

    this.$on('Va@radioChange', function (val) {
      _this.init(val);
    });
  },
  mounted: function mounted() {
    var _this2 = this;

    this.currentValue = this.value;
    this.$nextTick(function () {
      _this2.init();
    });
  },
  components: {
    validate: validate
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          vertical = this.vertical;
      var klass = {}; // The -btn-group class is only necessary to give the proper border radius to buttons
      // in a radio group if radio buttons are used instead of regular radio elements.

      klass[prefixCls + '-btn-group'] = !vertical;
      klass[prefixCls + '-btn-group-vertical'] = vertical;
      klass[prefixCls + '-radio-group'] = true;
      klass[prefixCls + '-radio-group-vertical'] = vertical;
      return klass;
    }
  }
});
// CONCATENATED MODULE: ./src/Radio/VaRadioGroup.vue?vue&type=script&lang=js&
 /* harmony default export */ var Radio_VaRadioGroupvue_type_script_lang_js_ = (VaRadioGroupvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Radio/VaRadioGroup.vue





/* normalize component */

var VaRadioGroup_component = normalizeComponent(
  Radio_VaRadioGroupvue_type_script_lang_js_,
  VaRadioGroupvue_type_template_id_ec615676_render,
  VaRadioGroupvue_type_template_id_ec615676_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaRadioGroup_component.options.__file = "VaRadioGroup.vue"
/* harmony default export */ var VaRadioGroup = (VaRadioGroup_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Toast/VaToast.vue?vue&type=template&id=00830c84&
var VaToastvue_type_template_id_00830c84_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"fade"}},[(_vm.show)?_c('div',{ref:"dom",class:_vm.classObj,on:{"click":_vm.handleClick}},[_c('span',{domProps:{"textContent":_vm._s(_vm.text)}})]):_vm._e()])}
var VaToastvue_type_template_id_00830c84_staticRenderFns = []


// CONCATENATED MODULE: ./src/Toast/VaToast.vue?vue&type=template&id=00830c84&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Toast/VaToast.vue?vue&type=script&lang=js&



//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var VaToastvue_type_script_lang_js_ = ({
  name: 'VaToast',
  props: {
    text: {
      type: String,
      required: true,
      note: 'The inner text of the toast.'
    },
    placement: {
      type: String,
      default: 'center',
      validator: function validator(v) {
        return ['bottom-right', 'top', 'top-right', 'top-left', 'bottom', 'bottom-left', 'center'].includes(v);
      },
      note: 'Where in the window the toast will appear.'
    },
    type: {
      type: String,
      default: 'default',
      validator: function validator(v) {
        return ['default', 'default-notification', 'success', 'primary', 'info', 'warning', 'danger'].includes(v);
      },
      note: 'What kind of toast do you like?'
    },
    duration: {
      type: Number,
      default: 3000,
      note: 'Length in milliseconds until the toast disappears.'
    },
    closeOnClick: {
      type: Boolean,
      default: true,
      note: 'When true, clicking the toast will dismiss it immediately.'
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    return {
      show: false
    };
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          placement = this.placement,
          type = this.type;
      var klass = {};
      klass[prefixCls + '-toast'] = true;
      klass[prefixCls + '-toast-' + type] = true;
      klass[prefixCls + '-toast-' + placement] = true;
      return klass;
    }
  },
  methods: {
    handleClick: function handleClick() {
      if (this.closeOnClick) {
        this.show = false;
      }
    }
  },
  watch: {
    show: {
      handler: function handler(val, newVal) {
        var _this = this;

        this.setT = window.clearTimeout(this.setT);

        if (val) {
          this.$nextTick(function () {
            // recompute position
            if (_this.placement === 'top' || _this.placement === 'bottom') {
              _this.$refs.dom.style.marginLeft = -1 * _this.$refs.dom.offsetWidth / 2 + 'px';
            } else if (_this.placement === 'center') {
              _this.$refs.dom.style.marginLeft = -1 * _this.$refs.dom.offsetWidth / 2 + 'px';
              _this.$refs.dom.style.marginTop = -1 * _this.$refs.dom.offsetHeight / 2 + 'px';
            }
          });
        }
      },
      immediate: true
    }
  }
});
// CONCATENATED MODULE: ./src/Toast/VaToast.vue?vue&type=script&lang=js&
 /* harmony default export */ var Toast_VaToastvue_type_script_lang_js_ = (VaToastvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Toast/VaToast.vue





/* normalize component */

var VaToast_component = normalizeComponent(
  Toast_VaToastvue_type_script_lang_js_,
  VaToastvue_type_template_id_00830c84_render,
  VaToastvue_type_template_id_00830c84_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaToast_component.options.__file = "VaToast.vue"
/* harmony default export */ var VaToast = (VaToast_component.exports);
// CONCATENATED MODULE: ./src/Toast/VaToastMethod.js







var VaToastMethod_VaToast = external_commonjs_vue_commonjs2_vue_root_Vue_default.a.extend(VaToast);
/* harmony default export */ var VaToastMethod = (function (obj) {
  var domNode = document.createElement('div');
  document.body.appendChild(domNode);
  var options = {
    el: domNode,
    propsData: {}
  };
  var allowedProps = ['text', 'placement', 'type', 'duration', 'closeOnClick'];
  allowedProps.forEach(function (prop) {
    if (Object.keys(obj).includes(prop)) {
      options.propsData[prop] = obj[prop];
    }
  });
  var instance = new VaToastMethod_VaToast(options);
  instance.show = true;

  if (instance.duration > 0) {
    setTimeout(function () {
      instance.show = false;
      external_commonjs_vue_commonjs2_vue_root_Vue_default.a.nextTick(function () {
        instance.$destroy();
      });
    }, instance.duration);
  }
});
// CONCATENATED MODULE: ./src/Modal/VaModalMethod.js






var $body = document.querySelector('body');

var createNode = function createNode() {
  var $node = document.createElement('div');
  $body.appendChild($node);
  return $node;
};

var typeMap = {
  success: {
    name: 'check',
    color: '#57D9A3'
  },
  danger: {
    name: 'exclamation-triangle',
    color: '#CD4425'
  },
  warning: {
    name: 'exclamation-triangle',
    color: '#F29D41'
  },
  info: {
    name: 'info',
    color: '#4C9AFF'
  }
};

var VaModalMethod_confirm = function confirm(options) {
  var title = options.title,
      message = options.message,
      effect = options.effect,
      type = options.type,
      width = options.width,
      onConfirm = options.onConfirm,
      onHide = options.onHide,
      onShow = options.onShow,
      backdropClickable = options.backdropClickable;
  new external_commonjs_vue_commonjs2_vue_root_Vue_default.a({
    el: createNode(),
    mounted: function mounted() {
      this.$refs.modal.open();
    },
    computed: {
      iconType: function iconType() {
        return typeMap[type || 'info'];
      }
    },
    methods: {
      handleShow: function handleShow() {
        onShow && onShow();
      },
      handleConfirm: function handleConfirm() {
        onConfirm && onConfirm();
        this.$refs.modal.close();
      },
      handleClose: function handleClose() {
        this.$refs.modal.close();
      },
      handleHide: function handleHide() {
        onHide && onHide();
      },
      destroy: function destroy() {
        this.$destroy();
      }
    },
    render: function render(createElement) {
      var iconElement = createElement(VaIcon, {
        props: {
          type: this.iconType.name,
          margin: "0 10px 0 0"
        },
        style: {
          color: this.iconType.color
        }
      }, []);
      var titleElement = '';

      if (title) {
        titleElement = createElement('div', {
          slot: 'title'
        }, [iconElement, title]);
      }

      var bodyElement = createElement('div', {
        slot: 'body',
        domProps: {
          innerHTML: message
        }
      });
      return createElement(Modal_VaModal, {
        ref: 'modal',
        props: {
          title: title,
          effect: effect || 'fade-up',
          width: width || '600px',
          backdropClickable: backdropClickable || false
        },
        on: {
          confirm: this.handleConfirm,
          hide: this.handleHide,
          show: this.handleShow,
          closed: this.destroy
        }
      }, [titleElement, bodyElement]);
    }
  });
};

var VaModalMethod_alert = function alert(options) {
  var title = options.title,
      message = options.message,
      effect = options.effect,
      type = options.type,
      width = options.width,
      onConfirm = options.onConfirm,
      onHide = options.onHide,
      onShow = options.onShow,
      backdropClickable = options.backdropClickable;
  new external_commonjs_vue_commonjs2_vue_root_Vue_default.a({
    el: createNode(),
    mixins: [localeMixin('VaModal')],
    mounted: function mounted() {
      this.$refs.modal.open();
    },
    computed: {
      iconType: function iconType() {
        return typeMap[type || 'info'];
      }
    },
    methods: {
      handleShow: function handleShow() {
        onShow && onShow();
      },
      handleConfirm: function handleConfirm() {
        onConfirm && onConfirm();
        this.$refs.modal.close();
      },
      handleClose: function handleClose() {
        this.$refs.modal.close();
      },
      handleHide: function handleHide() {
        onHide && onHide();
      },
      destroy: function destroy() {
        this.$destroy();
      }
    },
    render: function render(createElement) {
      var iconElement = createElement(VaIcon, {
        props: {
          type: this.iconType.name,
          margin: "0 10px 0 0"
        },
        style: {
          color: this.iconType.color
        }
      }, []);
      var titleElement = '';

      if (title) {
        titleElement = createElement('div', {
          slot: 'title'
        }, [iconElement, title]);
      }

      var bodyElement = createElement('div', {
        slot: 'body',
        domProps: {
          innerHTML: message
        }
      });
      var footerElement = createElement(VaButton, {
        slot: 'footer',
        props: {
          type: 'primary'
        },
        on: {
          click: this.handleConfirm
        }
      }, [this.getL('confirm')]);
      return createElement(Modal_VaModal, {
        ref: 'modal',
        props: {
          title: title,
          effect: effect || 'fade-up',
          width: width || '600px',
          backdropClickable: backdropClickable || false
        },
        on: {
          confirm: this.handleConfirm,
          hide: this.handleHide,
          show: this.handleShow,
          closed: this.destroy
        }
      }, [titleElement, bodyElement, footerElement]);
    }
  });
};

/* harmony default export */ var VaModalMethod = ({
  alert: VaModalMethod_alert,
  confirm: VaModalMethod_confirm
});
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Typeahead/VaTypeahead.vue?vue&type=template&id=00e72d6a&
var VaTypeaheadvue_type_template_id_00e72d6a_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:[_vm.show ? _vm.prefixCls + '-dropdown-con' : '']},[_c('va-input',{ref:"input",attrs:{"custom-validate":_vm.customValidate,"disabled":_vm.disabled,"icon":_vm.icon,"icon-style":_vm.iconStyle,"name":_vm.name,"placeholder":_vm.placeholder,"readonly":_vm.readonly,"rules":_vm.rules,"show-clean":_vm.showClean,"width":_vm.width,"no-v-model":"","no-v-model":""},on:{"blur":_vm.blur,"focus":_vm.focus},nativeOn:{"input":function($event){return _vm.update($event)},"keydown":[function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"down",40,$event.key,["Down","ArrowDown"])){ return null; }return _vm.down($event)},function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.hit($event)},function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"esc",27,$event.key,["Esc","Escape"])){ return null; }return _vm.onReset($event)},function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"up",38,$event.key,["Up","ArrowUp"])){ return null; }return _vm.up($event)}]},model:{value:(_vm.query),callback:function ($$v) {_vm.query=$$v},expression:"query"}}),_c('ul',{directives:[{name:"show",rawName:"v-show",value:(_vm.show),expression:"show"},{name:"va-position",rawName:"v-va-position",value:(_vm.show),expression:"show"}],class:(_vm.prefixCls + "-dropdown-menu"),style:({width: _vm.dropdownWidth, maxHeight: _vm.dropdownHeight})},_vm._l((_vm.citems),function(item,index){return _c('li',{key:index,class:_vm.isActive(index)},[_c('a',{on:{"mousedown":function($event){$event.preventDefault();_vm.hit(index)}}},[_c('div',{staticClass:"inline"},[_vm._t("item",[_vm._v("\n                            "+_vm._s(item)+"\n                        ")],{item:item})],2)])])}))],1)}
var VaTypeaheadvue_type_template_id_00e72d6a_staticRenderFns = []


// CONCATENATED MODULE: ./src/Typeahead/VaTypeahead.vue?vue&type=template&id=00e72d6a&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Typeahead/VaTypeahead.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var VaTypeaheadvue_type_script_lang_js_ = ({
  name: 'VaTypeahead',
  mixins: [inputMixin],
  props: {
    value: {
      type: String,
      default: ''
    },
    data: {
      type: Array
    },
    context: {},
    icon: {
      type: String,
      required: false
    },
    iconStyle: {
      type: String,
      default: 'regular',
      required: false
    },
    limit: {
      type: Number,
      default: 10
    },
    matchCase: {
      type: Boolean,
      default: false
    },
    debounce: {
      type: Number,
      default: 400
    },
    addFormat: {
      type: Function,
      default: function _default(item) {
        return item;
      }
    },
    onHit: {
      type: Function,
      default: function _default(item) {
        this.reset();
        this.query = this.addFormat(item);
      }
    },
    showClean: {
      type: Boolean,
      default: false
    },
    dropdownWidth: {
      type: String,
      default: '220px'
    },
    dropdownHeight: {
      type: String,
      default: '300px'
    },
    async: {
      type: Boolean,
      default: true
    },
    items: {
      type: Array
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  watch: {
    citems: function citems(val) {
      this.show = val && !!val.length;
    },
    value: function value(val) {
      this.query = val;
    },
    query: function query(val) {
      this.$emit('input', val);

      if (val.value === '') {
        this.items = [];
      }
    }
  },
  data: function data() {
    return {
      show: false,
      noResults: true,
      current: 0,
      query: this.value,
      timeoutID: 0
    };
  },
  computed: {
    citems: function citems() {
      return this.items.slice(0, this.limit);
    },
    primitiveData: function primitiveData() {
      var _this = this;

      if (this.data && this.query) {
        return this.data.filter(function (value) {
          value = _this.matchCase ? value : value.toLowerCase();
          return value.indexOf(_this.query) !== -1;
        }).slice(0, this.limit);
      }
    }
  },
  methods: {
    focusInput: function focusInput() {
      this.$refs.input.focus();
    },
    focus: function focus() {
      this.$emit('focus');
    },
    blur: function blur() {
      this.show = false;
      this.$emit('blur');
    },
    update: function update() {
      clearTimeout(this.timeoutID);
      var self = this;
      if (this.readonly || this.disabled) return;
      this.timeoutID = setTimeout(function () {
        if (!self.query) {
          self.reset();
          return false;
        }

        if (self.async) {
          self.$emit('change', self.query);
        }
      }, this.debounce);
    },
    reset: function reset() {
      this.query = '';
      this.loading = false;
      this.show = false;
    },
    isActive: function isActive(index) {
      var klass = this.prefixCls + '-dropdown-active';
      return this.current === index ? klass : '';
    },
    hit: function hit(index) {
      if (this.citems && this.citems.length) {
        this.onHit(this.citems[index], this);
      }
    },
    up: function up() {
      if (this.current > 0) this.current--;
    },
    down: function down() {
      if (this.current < this.citems.length - 1) this.current++;
    }
  }
});
// CONCATENATED MODULE: ./src/Typeahead/VaTypeahead.vue?vue&type=script&lang=js&
 /* harmony default export */ var Typeahead_VaTypeaheadvue_type_script_lang_js_ = (VaTypeaheadvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Typeahead/VaTypeahead.vue





/* normalize component */

var VaTypeahead_component = normalizeComponent(
  Typeahead_VaTypeaheadvue_type_script_lang_js_,
  VaTypeaheadvue_type_template_id_00e72d6a_render,
  VaTypeaheadvue_type_template_id_00e72d6a_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaTypeahead_component.options.__file = "VaTypeahead.vue"
/* harmony default export */ var VaTypeahead = (VaTypeahead_component.exports);
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js
function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js



function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Sidebar/VaSidebarGroupLevel.vue?vue&type=template&id=0098e81e&
var VaSidebarGroupLevelvue_type_template_id_0098e81e_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.classObj},[_c('div',{class:(_vm.prefixCls + "-sidebar-navigationlevel-parent")},[_c('div',{class:(_vm.prefixCls + "-sidebar-group-item")},[(_vm.st)?_c('va-sidebar-group-toggle',{attrs:{"open":_vm.isOpen},nativeOn:{"click":function($event){return _vm.onToggleClick($event)}}}):_vm._e(),_c('va-sidebar-group-item',{attrs:{"item":_vm.parentItem,"is-open":_vm.isOpen,"show-toggle":_vm.st},nativeOn:{"click":function($event){return _vm.onItemClick($event)}}})],1)]),_c('ul',{class:(_vm.prefixCls + "-sidebar-navigationlevel-children")},[_vm._t("default")],2)])}
var VaSidebarGroupLevelvue_type_template_id_0098e81e_staticRenderFns = []


// CONCATENATED MODULE: ./src/Sidebar/VaSidebarGroupLevel.vue?vue&type=template&id=0098e81e&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Sidebar/VaSidebarGroupLevel.vue?vue&type=script&lang=js&



//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var VaSidebarGroupLevelvue_type_script_lang_js_ = ({
  name: 'VaSidebarGroupLevel',
  props: {
    parentItem: {
      type: Object,
      required: true
    },
    level: {
      type: Number,
      required: true
    },
    open: {
      type: Boolean,
      required: false,
      default: false
    },
    showToggle: {
      type: Boolean,
      default: false
    },
    toggleType: {
      type: String,
      required: false,
      validator: function validator(v) {
        return ['arrow', 'circle'].includes(v);
      }
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    var s = this.showToggle;
    return {
      st: s,
      isOpen: this.open
    };
  },
  created: function created() {
    var _this = this;

    this.$on('Va@showToggleChange', function (val) {
      _this.st = val;
    });
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          isOpen = this.isOpen,
          level = this.level;
      var klass = {};
      klass[prefixCls + '-sidebar-navigationlevel'] = true;
      klass[prefixCls + '-sidebar-navigationlevel-closed'] = !isOpen;
      klass[prefixCls + '-sidebar-navigationlevel-open'] = isOpen;
      klass[prefixCls + '-sidebar-navigationlevel-level-' + level] = true;
      return klass;
    }
  },
  methods: {
    onToggleClick: function onToggleClick() {
      this.isOpen = !this.isOpen;
    },
    onItemClick: function onItemClick() {
      if (this.isOpen === false) {
        this.isOpen = true;
      }
    }
  }
});
// CONCATENATED MODULE: ./src/Sidebar/VaSidebarGroupLevel.vue?vue&type=script&lang=js&
 /* harmony default export */ var Sidebar_VaSidebarGroupLevelvue_type_script_lang_js_ = (VaSidebarGroupLevelvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Sidebar/VaSidebarGroupLevel.vue





/* normalize component */

var VaSidebarGroupLevel_component = normalizeComponent(
  Sidebar_VaSidebarGroupLevelvue_type_script_lang_js_,
  VaSidebarGroupLevelvue_type_template_id_0098e81e_render,
  VaSidebarGroupLevelvue_type_template_id_0098e81e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaSidebarGroupLevel_component.options.__file = "VaSidebarGroupLevel.vue"
/* harmony default export */ var VaSidebarGroupLevel = (VaSidebarGroupLevel_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Sidebar/VaSidebarGroupItem.vue?vue&type=template&id=0717c094&
var VaSidebarGroupItemvue_type_template_id_0717c094_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',_vm._g({ref:"itemText",class:_vm.classObj},_vm.itemMethod),[(_vm.st && _vm.toggleType === 'circle')?_c('span',{class:(_vm.prefixCls + "-sidebar-group-item-text-icon")},[_c('va-icon',{attrs:{"type":"circle"}})],1):_vm._e(),(_vm.showIcon)?_c('span',{class:(_vm.prefixCls + "-sidebar-group-item-icon")},[(_vm.item.iconColor)?_c('va-icon',{attrs:{"type":_vm.item.icon,"color":_vm.item.iconColor,"size":_vm.item.iconSize,"icon-style":_vm.item.iconStyle}}):_c('va-icon',{attrs:{"type":_vm.item.icon,"size":_vm.item.iconSize,"icon-style":_vm.item.iconStyle}})],1):_vm._e(),(_vm.showLabel)?_c('span',{class:(_vm.prefixCls + "-sidebar-group-item-label"),style:(_vm.styleObj)},[_vm._v("\n      "+_vm._s(_vm.item.name)+"\n      "),(_vm.item.sub)?_c('span',{class:(_vm.prefixCls + "-sidebar-group-item-substring")},[_vm._v(_vm._s(_vm.item.sub))]):_vm._e()]):_vm._e(),(_vm.showRouterLink)?_c('router-link',{class:(_vm.prefixCls + "-sidebar-group-item-router-link"),style:(_vm.styleObj),attrs:{"to":_vm.item.meta.target}},[_vm._v("\n      "+_vm._s(_vm.item.name)+"\n      "),(_vm.item.sub)?_c('span',{class:(_vm.prefixCls + "-sidebar-group-item-substring")},[_vm._v(_vm._s(_vm.item.sub))]):_vm._e()]):_vm._e(),(_vm.showHyperLink)?_c('a',{class:(_vm.prefixCls + "-sidebar-group-item-link"),style:(_vm.styleObj),attrs:{"href":_vm.item.meta.target}},[_vm._v("\n      "+_vm._s(_vm.item.name)+"\n      "),(_vm.item.sub)?_c('span',{class:(_vm.prefixCls + "-sidebar-group-item-substring")},[_vm._v(_vm._s(_vm.item.sub))]):_vm._e()]):_vm._e(),(_vm.showExternalHyperLink)?_c('a',{class:(_vm.prefixCls + "-sidebar-group-item-external-link"),style:(_vm.styleObj),attrs:{"href":_vm.item.meta.target,"target":"_blank"}},[_vm._v("\n      "+_vm._s(_vm.item.name)+"\n      "),(_vm.item.sub)?_c('span',{class:(_vm.prefixCls + "-sidebar-group-item-substring")},[_vm._v(_vm._s(_vm.item.sub))]):_vm._e()]):_vm._e(),(_vm.item.lozenge)?_c('span',{staticStyle:{"display":"flex"}},[_c('va-lozenge',{attrs:{"uppercase":"","type":_vm.item.lozenge.type}},[_vm._v(_vm._s(_vm.item.lozenge.text))])],1):_vm._e()],1)}
var VaSidebarGroupItemvue_type_template_id_0717c094_staticRenderFns = []


// CONCATENATED MODULE: ./src/Sidebar/VaSidebarGroupItem.vue?vue&type=template&id=0717c094&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Sidebar/VaSidebarGroupItem.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var VaSidebarGroupItemvue_type_script_lang_js_ = ({
  name: 'VaSidebarGroupItem',
  props: {
    item: {
      type: Object
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    showToggle: {
      type: Boolean,
      default: false
    },
    toggleType: {
      type: String,
      required: false
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    var s = this.showToggle;
    return {
      st: s,
      minified: false
    };
  },
  created: function created() {
    var _this = this;

    this.$on('Va@showToggleChange', function (val) {
      _this.st = val;
    });
  },
  computed: {
    itemHasMethod: function itemHasMethod() {
      return this.item.method !== undefined;
    },
    itemMethod: function itemMethod() {
      if (this.itemHasMethod) {
        return {
          click: this.item.method
        };
      }
    },
    showIcon: function showIcon() {
      return this.item.icon !== undefined;
    },
    showLabel: function showLabel() {
      return this.item.route === undefined && this.item.element === undefined && this.item.external === undefined;
    },
    showLink: function showLink() {
      return this.item.route !== undefined || this.item.element !== undefined;
    },
    showHyperLink: function showHyperLink() {
      return this.showLink && this.$router === undefined;
    },
    showExternalHyperLink: function showExternalHyperLink() {
      return this.item.external !== undefined;
    },
    showRouterLink: function showRouterLink() {
      return this.showLink && this.$router !== undefined;
    },
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          minified = this.minified;
      var klass = {};
      klass[prefixCls + '-sidebar-group-item-text'] = true;
      klass[prefixCls + '-sidebar-group-item-minified'] = minified;
      return klass;
    },
    styleObj: function styleObj() {
      var showIcon = this.showIcon;
      var style = {};
      style['padding-left'] = showIcon ? '30px' : '0px';
      return style;
    }
  },
  methods: {
    setAsActiveIfActive: function setAsActiveIfActive() {
      var parentElement = this.$refs.itemText.parentElement;

      if (parentElement.classList) {
        if (parentElement.classList.contains('active')) {
          parentElement.classList.remove('active');
        }
      }

      if (this.item.route !== undefined) {
        if (this.$route.path !== undefined) {
          if (this.item.route === this.$route.path) {
            if (parentElement.classList) {
              parentElement.classList.add('active');
            }
          }
        }
      }
    }
  },
  watch: {
    item: function item() {},
    $route: function $route() {
      this.setAsActiveIfActive();
    }
  },
  mounted: function mounted() {
    if (!this.$router) {
      window.addEventListener('hashchange', function () {// todo
      });
    }

    this.setAsActiveIfActive();
  }
});
// CONCATENATED MODULE: ./src/Sidebar/VaSidebarGroupItem.vue?vue&type=script&lang=js&
 /* harmony default export */ var Sidebar_VaSidebarGroupItemvue_type_script_lang_js_ = (VaSidebarGroupItemvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Sidebar/VaSidebarGroupItem.vue





/* normalize component */

var VaSidebarGroupItem_component = normalizeComponent(
  Sidebar_VaSidebarGroupItemvue_type_script_lang_js_,
  VaSidebarGroupItemvue_type_template_id_0717c094_render,
  VaSidebarGroupItemvue_type_template_id_0717c094_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaSidebarGroupItem_component.options.__file = "VaSidebarGroupItem.vue"
/* harmony default export */ var VaSidebarGroupItem = (VaSidebarGroupItem_component.exports);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.string.starts-with.js
var es6_string_starts_with = __webpack_require__("f559");

// CONCATENATED MODULE: ./src/Sidebar/utils.js



/**
 * Original implementation by MisRob and released under the MIT license.
 * https://github.com/MisRob/vue-tree-navigation
 * Modified for use with vue-atlas
 *
 * Remove a domain and router's `/#` from URL.
 */
var getRelativeUrl = function getRelativeUrl(url, origin) {
  var relativeUrl = url.replace('/#/', '/');

  if (origin[origin.length - 1] === '/') {
    origin = origin.slice(0, -1);
  }

  relativeUrl = relativeUrl.replace(origin, '');
  return sanitizeRoute(relativeUrl);
};
/**
 * Remove an element appended to the end of a path.
 */

var removeElementFromPath = function removeElementFromPath(path) {
  var hashPos;

  while (hashPos !== -1) {
    hashPos = path.lastIndexOf('#');

    if (hashPos === -1) {
      return path;
    } // do not cut of router url


    if (hashPos === path.indexOf('#/')) {
      return path;
    }

    path = path.slice(0, hashPos);
  }
};
/**
 * First character should be #.
 */

var sanitizeElement = function sanitizeElement(element) {
  if (element === undefined || element === '') {
    return element;
  }

  if (element[0] !== '#') {
    element = '#' + element;
  }

  return element;
};
/**
 * First character should be backslash.
 * Last character shouldn't be backslash.
 */

var sanitizeRoute = function sanitizeRoute(route) {
  if (route === undefined) {
    return;
  }

  if (route[0] !== '/') {
    route = '/' + route;
  }

  if (route[route.length - 1] === '/') {
    route = route.slice(0, -1);
  }

  return route;
};
/**
 * Check if a parent URL starts with another URL.
 * Ignore elements.
 */

var startsWithUrl = function startsWithUrl(parentUrl, url) {
  if (!url.startsWith('/#')) {
    url = removeElementFromPath(url);
  }

  if (parentUrl.startsWith(url)) {
    return true;
  }

  return false;
};
// CONCATENATED MODULE: ./src/Sidebar/core.js



/**
 * Original implementation by MisRob and released under the MIT license.
 * https://github.com/MisRob/vue-tree-navigation
 * Modified for use with vue-atlas
 */



/**
 * Recursive function.
 * One call generates one level of the tree.
 */

var core_generateLevel = function generateLevel(createElement, items, level, defaultOpenLevel, showToggle) {
  var children = [];

  if (items !== undefined && items !== false) {
    items.forEach(function (item) {
      if (item.hasOwnProperty('children')) {
        var navLevel = createElement(VaSidebarGroupLevel, {
          props: {
            parentItem: item,
            level: level,
            open: core_renderLevelAsOpen(item, level, defaultOpenLevel),
            showToggle: showToggle
          }
        }, _toConsumableArray(generateLevel(createElement, item.children, level + 1, defaultOpenLevel, showToggle)));
        children.push(createElement('li', [navLevel]));
      } else {
        var navItem = createElement(VaSidebarGroupItem, {
          props: {
            item: item,
            showToggle: showToggle,
            toggleType: 'circle'
          }
        });
        children.push(createElement('li', {
          class: 'va-sidebar-group-item'
        }, [navItem]));
      }
    });
  }

  return children;
};
/**
 * Level should be opened in following cases
 * - level is less than or equal to default open level
 * - its URL is a part of an active URL
 * - it contains a child which URL is a part of an active URL
 */

var core_renderLevelAsOpen = function renderLevelAsOpen(parentItem, level, defaultOpenLevel) {
  if (defaultOpenLevel >= level) {
    return true;
  }

  var currentUrl = getRelativeUrl(window.location.href, window.location.origin);

  if (parentItem.meta.target !== '' && startsWithUrl(currentUrl, parentItem.meta.target) === true) {
    return true;
  }

  for (var i = 0; i < parentItem.children.length; i++) {
    var child = parentItem.children[i];

    if (child.meta.target !== '' && startsWithUrl(currentUrl, child.meta.target) === true) {
      return true;
    }
  }

  return false;
};
/**
 * Recursive function.
 * Insert metadata containing the navigation path and its type to each item.
 **/

var insertMetadataToItems = function insertMetadataToItems(items, parent) {
  if (items !== undefined && items !== false) {
    items.forEach(function (item) {
      item.meta = core_getItemMetadata(item, parent);

      if (item.hasOwnProperty('children')) {
        item.children = insertMetadataToItems(item.children, item);
      }
    });
    return items;
  }

  return false;
};
/**
 * Return item metadata object: { path: ..., target: ... }
 */

var core_getItemMetadata = function getItemMetadata(item, parent) {
  // const element = sanitizeElement(item.element)
  // const route = sanitizeRoute(item.route)
  var element = item.element;
  var route = item.route;
  var external = item.external;
  var icon = item.icon || false;
  var method = item.method || false;
  var iconColor = item.iconColor || false;
  var iconSize = item.iconSize || '1em';
  var iconStyle = item.iconStyle || 'solid'; // item is its own parent

  if (parent === undefined) {
    if (element === undefined && route === undefined && external === undefined) {
      return {
        path: '',
        target: ''
      };
    }

    if (external !== undefined) {
      return {
        path: '',
        target: external
      };
    }

    if (route !== undefined) {
      return {
        path: route,
        target: route
      };
    }

    if (element !== undefined) {
      return {
        path: '',
        target: '/' + element
      };
    }
  }

  var parentPath = sanitizeRoute(parent.meta.path);

  if (external !== undefined) {
    return {
      icon: icon,
      iconColor: iconColor,
      iconSize: iconSize,
      iconStyle: iconStyle,
      method: method,
      path: parentPath,
      target: external
    };
  }

  if (route !== undefined) {
    return {
      icon: icon,
      iconColor: iconColor,
      iconSize: iconSize,
      iconStyle: iconStyle,
      method: method,
      path: route,
      target: route
    };
  }

  if (element !== undefined) {
    return {
      icon: icon,
      iconColor: iconColor,
      iconSize: iconSize,
      iconStyle: iconStyle,
      method: method,
      path: parentPath,
      target: sanitizeRoute(parentPath + element)
    };
  }

  return {
    icon: icon,
    iconColor: iconColor,
    iconSize: iconSize,
    iconStyle: iconStyle,
    method: method,
    path: parentPath,
    target: ''
  };
};
// CONCATENATED MODULE: ./src/Sidebar/VaSidebarGroup.js


/**
 * Original implementation by MisRob and released under the MIT license.
 * https://github.com/MisRob/vue-tree-navigation
 * Modified for use with vue-atlas
 */


var VaSidebarGroup = {
  mixins: [events],
  props: {
    items: {
      type: Array,
      required: false
    },
    defaultOpenLevel: {
      type: Number,
      default: 0
    },
    showToggle: {
      type: Boolean,
      default: false,
      required: false
    },
    title: {
      type: String,
      default: '',
      required: false
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  computed: {
    itemsWithMetadata: function itemsWithMetadata() {
      var self = this;

      if (self.items !== undefined) {
        var items = JSON.parse(JSON.stringify(self.items));
        return insertMetadataToItems(items);
      }

      return false;
    }
  },
  watch: {
    showToggle: function showToggle(val) {
      this.dispatch('VaApp', 'Va@configShowToggleChange', val);
    }
  },
  mounted: function mounted() {
    var _this = this;

    setTimeout(function () {
      _this.dispatch('VaApp', 'Va@configShowToggleChange', _this.showToggle);
    }, 10);
  },
  render: function render(createElement) {
    var prefixCls = this.prefixCls,
        title = this.title;
    var self = this;
    var level = 1;
    var tree = createElement('ul', core_generateLevel(createElement, self.itemsWithMetadata, level, self.defaultOpenLevel, self.showToggle));
    var level0 = createElement('div', {
      class: [prefixCls + '-sidebar-navigationlevel', prefixCls + '-sidebar-navigationlevel-level-0']
    }, [tree]);
    var treeNavigation = createElement('div', {
      class: prefixCls + '-sidebar-treenavigation'
    }, [level0]);
    var headerItem = createElement('div', {
      class: prefixCls + '-sidebar-group-title'
    }, [createElement('span', title)]);
    var entireGroup = createElement('div', {}, [headerItem, treeNavigation]);
    return entireGroup;
  }
};
/* harmony default export */ var Sidebar_VaSidebarGroup = (VaSidebarGroup);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/AnimQueue/VaAnimQueue.vue?vue&type=template&id=ce7792a0&
var VaAnimQueuevue_type_template_id_ce7792a0_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[(_vm.tag === 'div')?_c('div',[_vm._t("default")],2):_vm._e(),(_vm.tag === 'ul')?_c('ul',[_vm._t("default")],2):_vm._e(),(_vm.tag === 'ol')?_c('ol',[_vm._t("default")],2):_vm._e(),(_vm.tag === 'form')?_c('form',[_vm._t("default")],2):_vm._e()])}
var VaAnimQueuevue_type_template_id_ce7792a0_staticRenderFns = []


// CONCATENATED MODULE: ./src/AnimQueue/VaAnimQueue.vue?vue&type=template&id=ce7792a0&

// CONCATENATED MODULE: ./src/AnimQueue/animTypes.js
/* harmony default export */ var animTypes = ({
  left: {
    opacity: [1, 0],
    translateX: [0, -30]
  },
  top: {
    opacity: [1, 0],
    translateY: [0, -30]
  },
  right: {
    opacity: [1, 0],
    translateX: [0, 30]
  },
  bottom: {
    opacity: [1, 0],
    translateY: [0, 30]
  },
  alpha: {
    opacity: [1, 0]
  },
  scale: {
    opacity: [1, 0],
    scale: [1, 0]
  },
  scaleBig: {
    opacity: [1, 0],
    scale: [1, 2]
  },
  scaleX: {
    opacity: [1, 0],
    scaleX: [1, 0]
  },
  scaleY: {
    opacity: [1, 0],
    scaleY: [1, 0]
  }
});
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/AnimQueue/VaAnimQueue.vue?vue&type=script&lang=js&







//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var BackEase = {
  easeInBack: [0.6, -0.28, 0.735, 0.045],
  easeOutBack: [0.175, 0.885, 0.32, 1.275],
  easeInOutBack: [0.68, -0.55, 0.265, 1.55]
};

function transformArguments(arg) {
  if (Array.isArray(arg) && arg.length === 2) {
    return arg;
  }

  return [arg, arg];
}

/* harmony default export */ var VaAnimQueuevue_type_script_lang_js_ = ({
  name: 'VaAnimQueue',
  props: {
    show: {
      type: Boolean,
      default: false,
      required: false
    },
    tag: {
      type: String,
      default: 'div',
      validator: function validator(v) {
        return ['div', 'form', 'ul', 'ol'].includes(v);
      },
      required: false,
      note: "The tag to render around the animation queue.\nThis is helpful when you want to animate items in a list, but not the entire list itself.\nFor example, in this kind of scenario, you could pass tag=\"ul\" or tag=\"ol\"."
    },
    interval: {
      type: [Number, Array],
      default: 100,
      required: false
    },
    duration: {
      type: [Number, Array, String],
      default: 500,
      required: false,
      note: 'The speed of the animation'
    },
    delay: {
      type: [Number, Array, String],
      default: 0,
      required: false,
      note: 'The amount of time (ms) to wait between animating each node'
    },
    type: {
      type: [String, Array],
      default: 'right',
      required: false,
      note: "The type of enter and leave animation.\nWhen passing an array, the first item is the enter animation and the second is the leave animation."
    },
    animConfig: {
      type: [String, Array],
      required: false
    },
    ease: {
      type: [String, Array],
      default: 'easeOutQuart',
      required: false
    },
    watchValue: {
      type: [String, Array],
      required: false
    },
    leaveReverse: {
      type: Boolean,
      default: false,
      required: false,
      note: 'When true, during the leave animation the nodes will be transitioned out from last to first, instead of from first to last.'
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    return {
      animatingClassName: [],
      originChildren: [],
      children: [],
      childrenShow: {}
    };
  },
  mounted: function mounted() {
    var _this = this;

    var prefixCls = this.prefixCls;
    this.animatingClassName = [prefixCls + '-anim-queue-entering', prefixCls + '-anim-queue-leaving']; // this.$nextTick(() => {

    this.keysAnimating = [];

    var freeChild = this._getFreeKeysAndChild();

    this.keysAnimating = Object.keys(freeChild);
    this.children = freeChild;
    this.originChildren = freeChild;
    this.$on('VaAnimQueueHidden', function () {
      _this._hiddenVelocityNode();

      return true;
    });

    if (this.show) {
      this._animateEnter();
    } // })

  },
  beforeDestroy: function beforeDestroy() {
    if (this.originChildren && this.originChildren.length > 0) {
      this.originChildren.forEach(function (child) {
        external_velocity_animate_default()(child, 'stop');
      });
    }
  },
  computed: {
    usedSlot: function usedSlot() {
      switch (this.tag) {
        case 'div':
          return this.$slots.divslot;

        case 'ul':
          return this.$slots.ulslot;

        case 'ol':
          return this.$slots.olslot;

        case 'form':
          return this.$slots.formslot;

        default:
          return false;
      }
    }
  },
  isActHideAnimate: false,
  watch: {
    show: function show(value) {
      var _this2 = this;

      if (value) {
        this.isActHideAnimate = true;
        this.$nextTick(function () {
          _this2.$emit('VaAnimQueueHidden');

          setTimeout(function () {
            _this2._animateEnter();

            _this2.isActHideAnimate = false;
          }, 50);
        });
      } else {
        this._animateLeave(function () {
          if (!_this2.isActHideAnimate) {
            _this2.$emit('VaAnimQueueHidden');
          }
        });
      }
    },
    watchValue: function watchValue(newValue, oldValue) {
      var _this3 = this;

      this.$nextTick(function () {
        var shouldEnterChild = [];
        var shouldLeaveChild = [];

        var newChild = _this3._getKeysChild(); // const nodeMap = {}


        for (var i = 0; i < _this3.children.length; i++) {
          var curChild = _this3.children[i];
          var hasRemove = true;

          for (var j = 0; j < newChild.length; j++) {
            if (curChild.key === newChild[j].key) {
              hasRemove = false;
            }
          }

          if (hasRemove) {
            shouldLeaveChild.push(curChild);
          }
        }

        for (var _i = 0; _i < newChild.length; _i++) {
          var _curChild = newChild[_i];
          var hasAdd = true;

          for (var _j = 0; _j < _this3.children.length; _j++) {
            if (_curChild.key === _this3.children[_j].key) {
              hasAdd = false;
            }
          }

          if (hasAdd) {
            shouldEnterChild.push(_curChild);
          }
        }

        shouldEnterChild.forEach(_this3._performEnter);
        shouldLeaveChild.forEach(_this3._performLeave);
        _this3.children = newChild;
      });
    }
  },
  methods: {
    _getKeysChild: function _getKeysChild() {
      var ret = [];
      var keyNodes = Array.prototype.slice.call(this.$el.querySelectorAll('[anim-key]'));
      keyNodes.forEach(function (child) {
        if (!child) {
          return;
        }

        child.setAttribute('__scope_key__', 1);
        var key = child.getAttribute('anim-key');

        if (!key) {
          return;
        }

        ret.push({
          key: key,
          el: child
        });
      });
      return ret;
    },
    _getFreeKeysAndChild: function _getFreeKeysAndChild() {
      var ret = [];
      var keyNodes = Array.prototype.slice.call(this.$el.querySelectorAll('[anim-key]:not([__scope_key__])'));
      keyNodes.forEach(function (child) {
        if (!child) {
          return;
        }

        child.setAttribute('__scope_key__', 1);
        var key = child.getAttribute('anim-key');

        if (!key) {
          return;
        }

        ret.push({
          key: key,
          el: child
        });
      });
      return ret;
    },
    _getVelocityConfig: function _getVelocityConfig(index) {
      if (this.animConfig) {
        return transformArguments(this.animConfig)[index];
      }

      return animTypes[transformArguments(this.type)[index]];
    },
    _getVelocityEnterConfig: function _getVelocityEnterConfig() {
      return this._getVelocityConfig(0);
    },
    _getVelocityLeaveConfig: function _getVelocityLeaveConfig() {
      var config = this._getVelocityConfig(1);

      var ret = {};
      Object.keys(config).forEach(function (key) {
        if (Array.isArray(config[key])) {
          ret[key] = Array.prototype.slice.call(config[key]).reverse();
        } else {
          ret[key] = config[key];
        }
      });
      return ret;
    },
    _getVelocityEasing: function _getVelocityEasing() {
      return transformArguments(this.ease).map(function (easeName) {
        if (typeof easeName === 'string') {
          return BackEase[easeName] || easeName;
        }
      });
    },
    _hiddenVelocityNode: function _hiddenVelocityNode() {
      this.children.forEach(function (item, i) {
        var node = item.el;

        if (!node) {
          return;
        }

        node.style.visibility = 'hidden';
        external_velocity_animate_default()(node, 'stop');
      });
    },
    _animateEnter: function _animateEnter() {
      this.children.forEach(this._performEnter);
    },
    _performEnter: function _performEnter(item, i) {
      var _this4 = this;

      var node = item.el;
      var key = item.key;

      if (!node) {
        return;
      }

      var interval = parseInt(transformArguments(this.interval)[0]);
      var delay = parseInt(transformArguments(this.delay)[0]);
      var duration = parseInt(transformArguments(this.duration)[0]);
      node.style.visibility = 'hidden';
      external_velocity_animate_default()(node, 'stop');
      external_velocity_animate_default()(node, this._getVelocityEnterConfig('enter'), {
        delay: interval * i * delay / 100,
        duration: duration,
        easing: this._getVelocityEasing()[0],
        visibility: 'visible',
        begin: function begin(elements) {
          _this4._enterBegin(key, elements);

          if (node.__vue__) {
            var _enterFn = node.__vue__._animateEnter;
            _enterFn && _enterFn();
            var children = node.__vue__.$children;
            children.forEach(function (item) {
              item._animateEnter && item._animateEnter();
            });
          }
        },
        complete: this._enterComplete.bind(this, key)
      });
    },
    _animateLeave: function _animateLeave(done) {
      var _this5 = this;

      this.children.forEach(function (item, i) {
        _this5._performLeave(item, i, done);
      });
    },
    _performLeave: function _performLeave(item, i, done) {
      var _this6 = this;

      var node = item.el;
      var key = item.key;

      if (!node) {
        return;
      }

      var interval = parseInt(transformArguments(this.interval)[1]);
      var delay = parseInt(transformArguments(this.delay)[1]);
      var duration = parseInt(transformArguments(this.duration)[1]);
      var order = this.leaveReverse ? this.children.length - i - 1 : i;
      external_velocity_animate_default()(node, 'stop');
      external_velocity_animate_default()(node, this._getVelocityLeaveConfig('leave'), {
        delay: interval * order + delay,
        duration: duration,
        easing: this._getVelocityEasing()[1],
        begin: this._leaveBegin.bind(this),
        complete: function complete(elements) {
          _this6._leaveComplete(key, elements);

          var len = _this6.children.length;

          if (i === len - 1) {
            done && done();
          }
        }
      });
    },
    _enterBegin: function _enterBegin(key, elements) {
      var self = this;

      if (this.keysAnimating.indexOf(key) >= 0) {
        this.keysAnimating.splice(this.keysAnimating.indexOf(key), 1);
      }

      elements.forEach(function (elem) {
        elem.className = elem.className.replace(self.animatingClassName[1], '').trim();
        elem.className += ' ' + self.animatingClassName[0];
      });
    },
    _enterComplete: function _enterComplete(key, elements) {
      var self = this;

      if (this.keysAnimating.indexOf(key) >= 0) {
        this.keysAnimating.splice(this.keysAnimating.indexOf(key), 1);
      }

      elements.forEach(function (elem) {
        elem.className = elem.className.replace(self.animatingClassName[0], '').trim();
      });
    },
    _leaveBegin: function _leaveBegin(elements) {
      var self = this;
      elements.forEach(function (elem) {
        elem.className = elem.className.replace(self.animatingClassName[0], '').trim();
        elem.className += ' ' + self.animatingClassName[1];
      });
    },
    _leaveComplete: function _leaveComplete(key, elements) {
      var self = this;

      if (this.keysAnimating.indexOf(key) < 0) {
        return;
      }

      this.keysAnimating.splice(this.keysAnimating.indexOf(key), 1);
      elements.forEach(function (elem) {
        elem.className = elem.className.replace(self.animatingClassName[1], '').trim();
      });
    }
  }
});
// CONCATENATED MODULE: ./src/AnimQueue/VaAnimQueue.vue?vue&type=script&lang=js&
 /* harmony default export */ var AnimQueue_VaAnimQueuevue_type_script_lang_js_ = (VaAnimQueuevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/AnimQueue/VaAnimQueue.vue





/* normalize component */

var VaAnimQueue_component = normalizeComponent(
  AnimQueue_VaAnimQueuevue_type_script_lang_js_,
  VaAnimQueuevue_type_template_id_ce7792a0_render,
  VaAnimQueuevue_type_template_id_ce7792a0_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaAnimQueue_component.options.__file = "VaAnimQueue.vue"
/* harmony default export */ var VaAnimQueue = (VaAnimQueue_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Button/VaButtonGroup.vue?vue&type=template&id=c2789756&
var VaButtonGroupvue_type_template_id_c2789756_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.classObj},[_vm._t("default")],2)}
var VaButtonGroupvue_type_template_id_c2789756_staticRenderFns = []


// CONCATENATED MODULE: ./src/Button/VaButtonGroup.vue?vue&type=template&id=c2789756&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Button/VaButtonGroup.vue?vue&type=script&lang=js&
//
//
//
//
//
//
/* harmony default export */ var VaButtonGroupvue_type_script_lang_js_ = ({
  name: 'VaButtonGroup',
  props: {
    vertical: {
      type: Boolean,
      default: false,
      required: false
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          vertical = this.vertical;
      var klass = {};
      klass[prefixCls + '-btn-group'] = true;
      klass[prefixCls + '-btn-group-vertical'] = vertical;
      return klass;
    }
  }
});
// CONCATENATED MODULE: ./src/Button/VaButtonGroup.vue?vue&type=script&lang=js&
 /* harmony default export */ var Button_VaButtonGroupvue_type_script_lang_js_ = (VaButtonGroupvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Button/VaButtonGroup.vue





/* normalize component */

var VaButtonGroup_component = normalizeComponent(
  Button_VaButtonGroupvue_type_script_lang_js_,
  VaButtonGroupvue_type_template_id_c2789756_render,
  VaButtonGroupvue_type_template_id_c2789756_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaButtonGroup_component.options.__file = "VaButtonGroup.vue"
/* harmony default export */ var VaButtonGroup = (VaButtonGroup_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Minibar/VaMinibarItem.vue?vue&type=template&id=520526c2&
var VaMinibarItemvue_type_template_id_520526c2_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[(_vm.tooltip)?_c('va-tooltip',{attrs:{"content":_vm.tooltip,"placement":"right","trigger":"hover","effect":"tooltip-fade-right","arrow":""}},[_c('div',{class:_vm.classObj},[_vm._t("default")],2)]):_c('div',{class:_vm.classObj},[_vm._t("default")],2)],1)}
var VaMinibarItemvue_type_template_id_520526c2_staticRenderFns = []


// CONCATENATED MODULE: ./src/Minibar/VaMinibarItem.vue?vue&type=template&id=520526c2&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Minibar/VaMinibarItem.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var VaMinibarItemvue_type_script_lang_js_ = ({
  name: 'VaMinibarItem',
  props: {
    brand: {
      type: Boolean,
      default: false,
      required: false,
      note: 'If true, this item will have a larger bottom margin so as to make a distinction between it and other items.'
    },
    tooltip: {
      type: String,
      default: '',
      required: false
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          brand = this.brand;
      var klass = {};
      klass[prefixCls + '-minibar-item'] = true;
      klass[prefixCls + '-minibar-item-brand'] = brand;
      return klass;
    }
  }
});
// CONCATENATED MODULE: ./src/Minibar/VaMinibarItem.vue?vue&type=script&lang=js&
 /* harmony default export */ var Minibar_VaMinibarItemvue_type_script_lang_js_ = (VaMinibarItemvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Minibar/VaMinibarItem.vue





/* normalize component */

var VaMinibarItem_component = normalizeComponent(
  Minibar_VaMinibarItemvue_type_script_lang_js_,
  VaMinibarItemvue_type_template_id_520526c2_render,
  VaMinibarItemvue_type_template_id_520526c2_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaMinibarItem_component.options.__file = "VaMinibarItem.vue"
/* harmony default export */ var VaMinibarItem = (VaMinibarItem_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/PageHeader/VaPageHeader.vue?vue&type=template&id=61316953&
var VaPageHeadervue_type_template_id_61316953_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:(_vm.prefixCls + "-page-header")},[(_vm.hasBreadcrumb)?_c('div',{class:(_vm.prefixCls + "-page-header-breadcrumb-wrapper")},[_c('div',{class:(_vm.prefixCls + "-page-header-breadcrumb-container")},[_vm._t("breadcrumb",[_vm._v(" ")])],2)]):_vm._e(),_c('div',{class:(_vm.prefixCls + "-page-header-title-wrapper")},[_c('div',{class:(_vm.prefixCls + "-page-header-title-container")},[_c('h1',[_vm._t("title")],2),(_vm.hasSubtitle)?_c('h2',[_vm._t("subtitle")],2):_vm._e()]),(_vm.hasActions)?_c('div',{class:(_vm.prefixCls + "-page-header-actions-wrapper")},[_vm._t("actions")],2):_vm._e()]),(_vm.hasBottom)?_c('div',{class:(_vm.prefixCls + "-page-header-bottom-wrapper")},[_vm._t("bottom",[_vm._v(" ")])],2):_vm._e()])}
var VaPageHeadervue_type_template_id_61316953_staticRenderFns = []


// CONCATENATED MODULE: ./src/PageHeader/VaPageHeader.vue?vue&type=template&id=61316953&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/PageHeader/VaPageHeader.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var VaPageHeadervue_type_script_lang_js_ = ({
  name: 'VaPageHeader',
  props: {
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  computed: {
    hasActions: function hasActions() {
      return !!this.$slots['actions'];
    },
    hasBottom: function hasBottom() {
      return !!this.$slots['bottom'];
    },
    hasBreadcrumb: function hasBreadcrumb() {
      return !!this.$slots['breadcrumb'];
    },
    hasSubtitle: function hasSubtitle() {
      return !!this.$slots['subtitle'];
    }
  }
});
// CONCATENATED MODULE: ./src/PageHeader/VaPageHeader.vue?vue&type=script&lang=js&
 /* harmony default export */ var PageHeader_VaPageHeadervue_type_script_lang_js_ = (VaPageHeadervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/PageHeader/VaPageHeader.vue





/* normalize component */

var VaPageHeader_component = normalizeComponent(
  PageHeader_VaPageHeadervue_type_script_lang_js_,
  VaPageHeadervue_type_template_id_61316953_render,
  VaPageHeadervue_type_template_id_61316953_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaPageHeader_component.options.__file = "VaPageHeader.vue"
/* harmony default export */ var VaPageHeader = (VaPageHeader_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Breadcrumb/VaBreadcrumb.vue?vue&type=template&id=55bfb90c&
var VaBreadcrumbvue_type_template_id_55bfb90c_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:(_vm.prefixCls + "-breadcrumb")},[_vm._t("default")],2)}
var VaBreadcrumbvue_type_template_id_55bfb90c_staticRenderFns = []


// CONCATENATED MODULE: ./src/Breadcrumb/VaBreadcrumb.vue?vue&type=template&id=55bfb90c&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Breadcrumb/VaBreadcrumb.vue?vue&type=script&lang=js&
//
//
//
//
//
//
/* harmony default export */ var VaBreadcrumbvue_type_script_lang_js_ = ({
  name: 'VaBreadcrumb',
  props: {
    separator: {
      type: String,
      default: '/',
      required: false,
      note: 'The separator to be rendered between breadcrumb items.'
    },
    separatorIcon: {
      type: String,
      default: '',
      required: false,
      note: 'The separator icon to be rendered between breadcrumb items. It\'s a va-icon component, so a valid icon type must be passed.'
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  provide: function provide() {
    return {
      VaBreadcrumbParent: this
    };
  }
});
// CONCATENATED MODULE: ./src/Breadcrumb/VaBreadcrumb.vue?vue&type=script&lang=js&
 /* harmony default export */ var Breadcrumb_VaBreadcrumbvue_type_script_lang_js_ = (VaBreadcrumbvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Breadcrumb/VaBreadcrumb.vue





/* normalize component */

var VaBreadcrumb_component = normalizeComponent(
  Breadcrumb_VaBreadcrumbvue_type_script_lang_js_,
  VaBreadcrumbvue_type_template_id_55bfb90c_render,
  VaBreadcrumbvue_type_template_id_55bfb90c_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaBreadcrumb_component.options.__file = "VaBreadcrumb.vue"
/* harmony default export */ var VaBreadcrumb = (VaBreadcrumb_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Checkbox/VaCheckboxBtn.vue?vue&type=template&id=85aa5022&
var VaCheckboxBtnvue_type_template_id_85aa5022_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('va-button',{class:_vm.classObj,attrs:{"disabled":_vm.disabled,"type":_vm.currentChecked ? 'primary' : 'default'},nativeOn:{"click":function($event){$event.preventDefault();return _vm.handleClick($event)}}},[_vm._t("default")],2)}
var VaCheckboxBtnvue_type_template_id_85aa5022_staticRenderFns = []


// CONCATENATED MODULE: ./src/Checkbox/VaCheckboxBtn.vue?vue&type=template&id=85aa5022&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Checkbox/VaCheckboxBtn.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var VaCheckboxBtnvue_type_script_lang_js_ = ({
  name: 'VaCheckboxBtn',
  mixins: [events],
  props: {
    value: {
      type: String
    },
    label: {
      type: [String, Number]
    },
    checked: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls;
      var klass = {};
      klass[prefixCls + '-checked-btn'] = true;
      return klass;
    }
  },
  watch: {
    value: function value(val) {
      this.currentChecked = val;
    },
    checked: function checked(val) {
      this.currentChecked = val;
    },
    currentChecked: function currentChecked(val) {
      this.$emit('input', val);
    }
  },
  data: function data() {
    var checked = this.checked;

    if (checked !== undefined) {
      this.$emit('input', checked);
    } else {
      checked = !!this.value;
    }

    return {
      currentChecked: checked
    };
  },
  methods: {
    handleClick: function handleClick() {
      this.currentChecked = !this.currentChecked;
      this.dispatch('VaCheckboxGroup', 'Va@checkboxChange', this);
      this.$emit('change', this.currentChecked);
    }
  },
  created: function created() {
    var _this = this;

    this.$on('Va@checkboxgroupChange', function (val) {
      _this.currentChecked = val.indexOf(_this.label) > -1;
    });
  }
});
// CONCATENATED MODULE: ./src/Checkbox/VaCheckboxBtn.vue?vue&type=script&lang=js&
 /* harmony default export */ var Checkbox_VaCheckboxBtnvue_type_script_lang_js_ = (VaCheckboxBtnvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Checkbox/VaCheckboxBtn.vue





/* normalize component */

var VaCheckboxBtn_component = normalizeComponent(
  Checkbox_VaCheckboxBtnvue_type_script_lang_js_,
  VaCheckboxBtnvue_type_template_id_85aa5022_render,
  VaCheckboxBtnvue_type_template_id_85aa5022_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaCheckboxBtn_component.options.__file = "VaCheckboxBtn.vue"
/* harmony default export */ var VaCheckboxBtn = (VaCheckboxBtn_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Timepicker/VaTimepicker.vue?vue&type=template&id=60309560&
var VaTimepickervue_type_template_id_60309560_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:(_vm.prefixCls + "-timepicker")},[(!_vm.isMobile)?_c('va-input',{attrs:{"width":_vm.width,"name":_vm.name,"rules":_vm.rules,"placeholder":_vm.placeholder,"custom-validate":_vm.customValidate,"disabled":_vm.disabled,"readonly":_vm.readonly,"show-clean":true,"icon":"clock","icon-style":"regular"},on:{"clean":_vm.clean},nativeOn:{"click":function($event){return _vm.inputClick($event)}},model:{value:(_vm.currentValue),callback:function ($$v) {_vm.currentValue=$$v},expression:"currentValue"}}):_vm._e(),(_vm.isMobile)?_c('va-input',{attrs:{"width":_vm.width,"name":_vm.name,"rules":_vm.rules,"placeholder":_vm.placeholder,"custom-validate":_vm.customValidate,"disabled":_vm.disabled,"readonly":_vm.readonly,"show-clean":true,"type":"time"},model:{value:(_vm.currentValue),callback:function ($$v) {_vm.currentValue=$$v},expression:"currentValue"}}):_vm._e(),_c('transition',{attrs:{"name":"fadeDown"}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.show),expression:"show"},{name:"va-position",rawName:"v-va-position",value:(_vm.show),expression:"show"}],class:(_vm.prefixCls + "-timepicker-popup")},[(_vm.hour)?_c('div',{class:(_vm.prefixCls + "-timepicker-range-wrap"),attrs:{"data-role":"hour"}},[_c('span',[_vm._v(_vm._s(_vm.getL('hour')))]),_c('va-range',{class:(_vm.prefixCls + "-timepicker-range"),attrs:{"width":190,"min":_vm.hourRange[0],"max":_vm.hourRange[1]},model:{value:(_vm.time.hour),callback:function ($$v) {_vm.$set(_vm.time, "hour", $$v)},expression:"time.hour"}})],1):_vm._e(),(_vm.minute)?_c('div',{class:(_vm.prefixCls + "-timepicker-range-wrap"),attrs:{"data-role":"minute"}},[_c('span',[_vm._v(_vm._s(_vm.getL('minute')))]),_c('va-range',{class:(_vm.prefixCls + "-timepicker-range"),attrs:{"width":190,"min":_vm.minuteRange[0],"max":_vm.minuteRange[1]},model:{value:(_vm.time.minute),callback:function ($$v) {_vm.$set(_vm.time, "minute", $$v)},expression:"time.minute"}})],1):_vm._e(),(_vm.second)?_c('div',{class:(_vm.prefixCls + "-timepicker-range-wrap"),attrs:{"data-role":"second"}},[_c('span',[_vm._v(_vm._s(_vm.getL('second')))]),_c('va-range',{class:(_vm.prefixCls + "-timepicker-range"),attrs:{"width":190,"min":_vm.secondRange[0],"max":_vm.secondRange[1]},model:{value:(_vm.time.second),callback:function ($$v) {_vm.$set(_vm.time, "second", $$v)},expression:"time.second"}})],1):_vm._e()])])],1)}
var VaTimepickervue_type_template_id_60309560_staticRenderFns = []


// CONCATENATED MODULE: ./src/Timepicker/VaTimepicker.vue?vue&type=template&id=60309560&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Timepicker/VaTimepicker.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ var VaTimepickervue_type_script_lang_js_ = ({
  name: 'VaTimepicker',
  mixins: [inputMixin, localeMixin('VaTimepicker'), events],
  props: {
    value: {
      type: String
    },
    format: {
      type: String,
      default: 'hh:mm:ss',
      required: false
    },
    hourRange: {
      type: Array,
      default: function _default() {
        return [0, 23];
      }
    },
    minuteRange: {
      type: Array,
      default: function _default() {
        return [0, 59];
      }
    },
    secondRange: {
      type: Array,
      default: function _default() {
        return [0, 59];
      }
    },
    readonly: {
      type: Boolean,
      default: false,
      required: false
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    return {
      isMobile: false,
      show: false,
      time: {
        hour: 0,
        minute: 0,
        second: 0
      },
      currentValue: this.value
    };
  },
  watch: {
    show: function show(val) {
      if (!val) this.$emit('hide', this.currentValue);
    },
    value: function value(val) {
      if (this.inner) {
        this.inner = false;
        return;
      }

      this.inner = true;
      this.currentValue = val;
    },
    currentValue: function currentValue(val) {
      if (this.inner) {
        this.inner = false;
        return;
      }

      this.inner = true;
      this.$emit('input', val);
      this.$emit('change', val);
    },
    time: {
      deep: true,
      handler: function handler(val) {
        var ret = '';
        this.time.hour > this.hourRange[1] ? this.time.hour = this.hourRange[1] : 0;
        this.time.minute > this.minuteRange[1] ? this.time.minute = this.minuteRange[1] : 0;
        this.time.second > this.secondRange[1] ? this.time.second = this.secondRange[1] : 0;
        this.time.hour < this.hourRange[0] ? this.time.hour = this.hourRange[0] : 0;
        this.time.minute < this.minuteRange[0] ? this.time.minute = this.minuteRange[0] : 0;
        this.time.second < this.secondRange[0] ? this.time.second = this.secondRange[0] : 0;

        if (this.hour) {
          ret += this.fix(this.time.hour, 2) + ':';
        }

        if (this.minute) {
          ret += this.fix(this.time.minute, 2) + ':';
        }

        if (this.second) {
          ret += this.fix(this.time.second, 2) + ':';
        }

        ret = ret.substr(0, ret.length - 1);
        this.currentValue = ret;
      }
    }
  },
  methods: {
    clean: function clean() {
      var _this = this;

      this.time = {
        hour: 0,
        minute: 0,
        second: 0
      };
      this.$nextTick(function () {
        _this.currentValue = '';
      });
    },
    close: function close() {
      this.show = false;
    },
    inputClick: function inputClick() {
      if (this.disabled) return;
      this.show = !this.show;
    },
    fix: function fix(num, length) {
      num = parseInt(num);
      num = isNaN(num) ? 0 : num;
      return ('' + num).length < length ? (new Array(length + 1).join('0') + num).slice(-length) : '' + num;
    },
    _format: function _format(str) {
      if (str) {
        var a = str.split(':');

        if (this.hour) {
          this.time.hour = parseInt(a[0] ? a[0] : 0);
        }

        if (this.minute) {
          this.time.minute = parseInt(a[1] ? a[1] : 0);
        }

        if (this.second) {
          this.time.second = parseInt(a[2] ? a[2] : 0);
        }
      }
    }
  },
  computed: {
    hour: function hour() {
      return this.format.indexOf('hh') > -1;
    },
    minute: function minute() {
      return this.format.indexOf('mm') > -1;
    },
    second: function second() {
      return this.format.indexOf('ss') > -1;
    }
  },
  created: function created() {
    var _this2 = this;

    this._format(this.currentValue);

    this.$on('Va@timepickerIsMobile', function (val) {
      _this2.isMobile = val;
    });
    /**
     * In case this component is instantiated after the App
     * has initially broadcasted isMobile, let's request it.
     */

    this.dispatch('VaApp', 'Va@requestIsMobile', true);
  },
  mounted: function mounted() {
    var _this3 = this;

    this._closeEvent = utils_EventListener.listen(window, 'click', function (e) {
      if (!_this3.$el.contains(e.target)) _this3.close();
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this._closeEvent) this._closeEvent.remove();
  }
});
// CONCATENATED MODULE: ./src/Timepicker/VaTimepicker.vue?vue&type=script&lang=js&
 /* harmony default export */ var Timepicker_VaTimepickervue_type_script_lang_js_ = (VaTimepickervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Timepicker/VaTimepicker.vue





/* normalize component */

var VaTimepicker_component = normalizeComponent(
  Timepicker_VaTimepickervue_type_script_lang_js_,
  VaTimepickervue_type_template_id_60309560_render,
  VaTimepickervue_type_template_id_60309560_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaTimepicker_component.options.__file = "VaTimepicker.vue"
/* harmony default export */ var Timepicker_VaTimepicker = (VaTimepicker_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Datepicker/VaDatepicker.vue?vue&type=template&id=6b348fcb&
var VaDatepickervue_type_template_id_6b348fcb_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:(_vm.prefixCls + "-datepicker")},[(!_vm.isMobile || !_vm.isDateSupported)?_c('va-input',{attrs:{"width":_vm.width,"name":_vm.name,"rules":_vm.rules,"placeholder":_vm.placeholder,"custom-validate":_vm.customValidate,"disabled":_vm.disabled,"readonly":_vm.readonly,"show-clean":true,"size":_vm.size !== 'md' ? _vm.size : null,"icon":"calendar-alt","no-v-model":true},on:{"clean":_vm.clean},nativeOn:{"click":function($event){return _vm.inputClick($event)}},model:{value:(_vm.currentValue),callback:function ($$v) {_vm.currentValue=$$v},expression:"currentValue"}}):_vm._e(),(_vm.isMobile && _vm.isDateSupported)?_c('va-input',{attrs:{"width":_vm.width,"name":_vm.name,"rules":_vm.rules,"placeholder":_vm.placeholder,"disabled":_vm.disabled,"custom-validate":_vm.customValidate,"readonly":false,"show-clean":false,"size":_vm.size !== 'md' ? _vm.size : null,"type":"date","no-v-model":true},model:{value:(_vm.currentValue),callback:function ($$v) {_vm.currentValue=$$v},expression:"currentValue"}}):_vm._e(),_c('transition',{attrs:{"name":"fadeDown"}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.displayDayView),expression:"displayDayView"},{name:"va-position",rawName:"v-va-position",value:(_vm.displayDayView),expression:"displayDayView"}],class:(_vm.prefixCls + "-datepicker-popup")},[_c('div',{class:(_vm.prefixCls + "-datepicker-inner")},[_c('div',{class:(_vm.prefixCls + "-datepicker-body")},[_c('div',{class:(_vm.prefixCls + "-datepicker-ctrl")},[_c('va-button',{class:(_vm.prefixCls + "-month-btn " + _vm.prefixCls + "-datepicker-preBtn"),attrs:{"tabindex":"0","type":"subtle"},on:{"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }_vm.preNextMonthClick(0)}},nativeOn:{"click":function($event){_vm.preNextMonthClick(0)}}},[_c('va-icon',{attrs:{"type":"arrow-left","size":"10px"}})],1),_c('va-button',{attrs:{"type":"subtle","tabindex":"0"},on:{"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.switchMonthView($event)}},nativeOn:{"click":function($event){return _vm.switchMonthView($event)}}},[_vm._v(_vm._s(_vm.stringifyDayHeader(_vm.currDate)))]),_c('va-button',{class:(_vm.prefixCls + "-month-btn " + _vm.prefixCls + "-datepicker-nextBtn"),attrs:{"tabindex":"0","type":"subtle"},on:{"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }_vm.preNextMonthClick(1)}},nativeOn:{"click":function($event){_vm.preNextMonthClick(1)}}},[_c('va-icon',{attrs:{"type":"arrow-right","size":"10px"}})],1)],1),_c('div',{class:(_vm.prefixCls + "-datepicker-weekRange")},_vm._l((_vm.weekRange),function(w,index){return _c('span',{key:index},[_vm._v(_vm._s(w))])})),_c('div',{class:(_vm.prefixCls + "-datepicker-dateRange")},_vm._l((_vm.dateRange),function(d,index){return _c('span',{key:index,class:d.sclass,attrs:{"tabindex":"0"},on:{"click":function($event){_vm.daySelect(d.date, d.text, d.sclass)},"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }_vm.daySelect(d.date, d.text, d.sclass)}}},[_vm._v(_vm._s(d.text))])}))])])])]),_c('transition',{attrs:{"name":"fadeDown"}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.displayMonthView),expression:"displayMonthView"},{name:"va-position",rawName:"v-va-position",value:(_vm.displayMonthView),expression:"displayMonthView"}],class:(_vm.prefixCls + "-datepicker-popup")},[_c('div',{class:(_vm.prefixCls + "-datepicker-inner")},[_c('div',{class:(_vm.prefixCls + "-datepicker-body")},[_c('div',{class:(_vm.prefixCls + "-datepicker-ctrl")},[_c('va-button',{class:(_vm.prefixCls + "-month-btn " + _vm.prefixCls + "-datepicker-preBtn"),attrs:{"type":"subtle","tabindex":"0"},on:{"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }_vm.preNextYearClick(0)}},nativeOn:{"click":function($event){_vm.preNextYearClick(0)}}},[_c('va-icon',{attrs:{"type":"arrow-left","size":"10px"}})],1),_c('va-button',{attrs:{"type":"subtle","tabindex":"0"},on:{"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.switchDecadeView($event)}},nativeOn:{"click":function($event){return _vm.switchDecadeView($event)}}},[_vm._v(_vm._s(_vm.stringifyYearHeader(_vm.currDate)))]),_c('va-button',{class:(_vm.prefixCls + "-month-btn " + _vm.prefixCls + "-datepicker-nextBtn"),attrs:{"type":"subtle","tabindex":"0"},on:{"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }_vm.preNextYearClick(1)}},nativeOn:{"click":function($event){_vm.preNextYearClick(1)}}},[_c('va-icon',{attrs:{"type":"arrow-right","size":"10px"}})],1)],1),_c('div',{class:(_vm.prefixCls + "-datepicker-monthRange")},[_vm._l((_vm.monthNames),function(m,index){return [_c('span',{key:index,class:_vm.monthClassObj(m),attrs:{"tabindex":"0"},on:{"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }_vm.monthSelect(index)},"click":function($event){_vm.monthSelect(index)}}},[_vm._v(_vm._s(m))])]})],2)])])])]),_c('transition',{attrs:{"name":"fadeDown"}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.displayYearView),expression:"displayYearView"},{name:"va-position",rawName:"v-va-position",value:(_vm.displayYearView),expression:"displayYearView"}],class:(_vm.prefixCls + "-datepicker-popup")},[_c('div',{class:(_vm.prefixCls + "-datepicker-inner")},[_c('div',{class:(_vm.prefixCls + "-datepicker-body")},[_c('div',{class:(_vm.prefixCls + "-datepicker-ctrl")},[_c('va-button',{class:(_vm.prefixCls + "-month-btn " + _vm.prefixCls + "-datepicker-preBtn"),attrs:{"type":"subtle","tabindex":"0"},on:{"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }_vm.preNextDecadeClick(0)}},nativeOn:{"click":function($event){_vm.preNextDecadeClick(0)}}},[_c('va-icon',{attrs:{"type":"arrow-left","size":"10px"}})],1),_c('va-button',{class:(_vm.prefixCls + "-month-btn " + _vm.prefixCls + "-datepicker-nextBtn"),attrs:{"type":"subtle","tabindex":"0"},on:{"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }_vm.preNextDecadeClick(1)}},nativeOn:{"click":function($event){_vm.preNextDecadeClick(1)}}},[_c('va-icon',{attrs:{"type":"arrow-right","size":"10px"}})],1),_c('p',[_vm._v("\n              "+_vm._s(_vm.stringifyDecadeHeader(_vm.currDate))+"\n              ")])],1),_c('div',{class:(_vm.prefixCls + "-datepicker-monthRange " + _vm.prefixCls + "-datepicker-decadeRange")},[_vm._l((_vm.decadeRange),function(decade,index){return [_c('span',{key:index,class:_vm.yearClassObj(decade),attrs:{"tabindex":"0"},on:{"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }_vm.yearSelect(decade.text)},"click":function($event){$event.stopPropagation();_vm.yearSelect(decade.text)}}},[_vm._v("\n                  "+_vm._s(decade.text)+"\n                ")])]})],2)])])])])],1)}
var VaDatepickervue_type_template_id_6b348fcb_staticRenderFns = []


// CONCATENATED MODULE: ./src/Datepicker/VaDatepicker.vue?vue&type=template&id=6b348fcb&

// EXTERNAL MODULE: external "moment"
var external_moment_ = __webpack_require__("c32d");
var external_moment_default = /*#__PURE__*/__webpack_require__.n(external_moment_);

// CONCATENATED MODULE: ./src/utils/format.js


/* harmony default export */ var utils_format = ({
  dateParse: function dateParse(str, format) {
    if (typeof str !== 'string') {
      return str;
    } // return moment(str).format(format).toString()


    return external_moment_default()(str, format).toString();
  }
});
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Datepicker/VaDatepicker.vue?vue&type=script&lang=js&


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ var VaDatepickervue_type_script_lang_js_ = ({
  name: 'VaDatepicker',
  mixins: [inputMixin, localeMixin('VaDatepicker'), events],
  props: {
    value: {
      type: String
    },
    size: {
      type: String,
      default: "md"
    },
    format: {
      type: String,
      default: 'MM-dd-yyyy',
      required: false,
      note: 'The RFC2822/ISO date format in which to display the date in the input field. Ex: \'MM/dd/yyyy\''
    },
    readonly: {
      type: Boolean,
      default: false,
      required: false,
      note: 'When true, the input cannot be changed with keyboard input'
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false,
      note: 'When true, input is disabled'
    },
    autoclose: {
      type: Boolean,
      default: true,
      note: 'When true, dropdown closes on date selection'
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    var currentValue = this.value;

    if (typeof currentValue === 'undefined') {
      this.$emit('input', null);
      currentValue = null;
    }

    return {
      isMobile: false,
      currentValue: currentValue,
      currMonth: 0,
      currYear: 0,
      today: '',
      weekRange: [this.getL('sunday'), this.getL('monday'), this.getL('tuesday'), this.getL('wednesday'), this.getL('thursday'), this.getL('friday'), this.getL('saturday')],
      dateRange: [],
      decadeRange: [],
      currDate: new Date(),
      displayDayView: false,
      displayMonthView: false,
      displayYearView: false,
      monthNames: [this.getL('january'), this.getL('february'), this.getL('march'), this.getL('april'), this.getL('may'), this.getL('june'), this.getL('july'), this.getL('august'), this.getL('september'), this.getL('october'), this.getL('november'), this.getL('december')]
    };
  },
  watch: {
    currDate: function currDate() {
      this.getDateRange();
    },
    value: function value(val) {
      if (this.inner) {
        this.inner = false;
        return;
      }

      this.inner = true;
      this.currentValue = val || null;
    },
    currentValue: function currentValue(val) {
      if (this.inner) {
        this.inner = false;
        return;
      }

      this.inner = true;
      this.$emit('input', val);
      this.$emit('change', this.currentValue);
    }
  },
  methods: {
    keyup: function keyup(e) {
      if (e.keyCode === 27) {
        this.close();
      }
    },
    clean: function clean() {
      this.currDate = new Date();
      this.currYear = this.currDate.getFullYear();
      this.currMonth = this.currDate.getMonth(); // this.currentValue = this.stringify(new Date())
    },
    monthClassObj: function monthClassObj(m) {
      var prefixCls = this.prefixCls,
          currentValue = this.currentValue,
          monthNames = this.monthNames,
          parse = this.parse,
          currDate = this.currDate;
      var klass = {};
      klass[prefixCls + '-datepicker-dateRange-item-active'] = currentValue && parse(currentValue) && monthNames[parse(currentValue).getMonth()] === m && currDate.getFullYear() === parse(currentValue).getFullYear();
      return klass;
    },
    yearClassObj: function yearClassObj(decade) {
      var prefixCls = this.prefixCls,
          currentValue = this.currentValue,
          parse = this.parse;
      var klass = {};
      klass[prefixCls + '-datepicker-dateRange-item-active'] = currentValue && parse(currentValue) && parse(currentValue).getFullYear() === decade.text;
      return klass;
    },
    close: function close() {
      this.displayDayView = this.displayMonthView = this.displayYearView = false;
    },
    inputClick: function inputClick() {
      if (this.disabled) return;

      if (this.displayMonthView || this.displayYearView) {
        this.displayDayView = false;
      } else {
        this.displayDayView = !this.displayDayView;
      }
    },
    preNextDecadeClick: function preNextDecadeClick(flag) {
      var year = this.currDate.getFullYear();
      var months = this.currDate.getMonth();
      var date = this.currDate.getDate();

      if (flag === 0) {
        this.currDate = new Date(year - 10, months, date);
      } else {
        this.currDate = new Date(year + 10, months, date);
      }
    },
    preNextMonthClick: function preNextMonthClick(flag) {
      var year = this.currDate.getFullYear();
      var month = this.currDate.getMonth();
      var date = this.currDate.getDate();

      if (flag === 0) {
        var preMonth = this.getYearMonth(year, month - 1);
        this.currDate = new Date(preMonth.year, preMonth.month, date);
        this.currMonth = preMonth.month;
        this.currYear = preMonth.year;
      } else {
        var nextMonth = this.getYearMonth(year, month + 1);
        this.currDate = new Date(nextMonth.year, nextMonth.month, date);
        this.currMonth = nextMonth.month;
        this.currYear = nextMonth.year;
      }
    },
    preNextYearClick: function preNextYearClick(flag) {
      var year = this.currDate.getFullYear();
      var months = this.currDate.getMonth();
      var date = this.currDate.getDate();

      if (flag === 0) {
        this.currDate = new Date(year - 1, months, date);
        this.currYear = year - 1;
      } else {
        this.currDate = new Date(year + 1, months, date);
        this.currYear = year + 1;
      }
    },
    yearSelect: function yearSelect(year) {
      this.currYear = year;
      this.displayYearView = false;
      this.displayMonthView = true;
      this.currDate = new Date(year, this.currDate.getMonth(), this.currDate.getDate());
    },
    daySelect: function daySelect(date, dayNumber, klass) {
      if (klass.indexOf(this.prefixCls + '-datepicker-item-disabled') > -1) {
        return false;
      } else {
        this.currYear = date.getFullYear();
        this.currMonth = date.getMonth();
        this.currDate = new Date(this.currYear, this.currMonth, dayNumber);
        this.currentValue = this.stringify(this.currDate);

        if (this.autoclose) {
          this.close();
        }
      }
    },
    switchMonthView: function switchMonthView() {
      this.displayDayView = false;
      this.displayMonthView = true;
    },
    switchDecadeView: function switchDecadeView() {
      this.displayMonthView = false;
      this.displayYearView = true;
    },
    monthSelect: function monthSelect(index) {
      this.currMonth = index;
      this.displayMonthView = false;
      this.displayDayView = true;
      this.currDate = new Date(this.currDate.getFullYear(), index, this.currDate.getDate());
    },
    getYearMonth: function getYearMonth(year, month) {
      if (month > 11) {
        year++;
        month = 0;
      } else if (month < 0) {
        year--;
        month = 11;
      }

      return {
        year: year,
        month: month
      };
    },
    stringifyDecadeHeader: function stringifyDecadeHeader(date) {
      var yearStr = date.getFullYear().toString();
      var firstYearOfDecade = yearStr.substring(0, yearStr.length - 1) + 0;
      var lastYearOfDecade = parseInt(firstYearOfDecade, 10) + 10;
      return firstYearOfDecade + '-' + lastYearOfDecade;
    },
    stringifyDayHeader: function stringifyDayHeader(date) {
      return this.monthNames[date.getMonth()] + ' ' + date.getFullYear();
    },
    stringifyYearHeader: function stringifyYearHeader(date) {
      return date.getFullYear();
    },
    parseMonth: function parseMonth(date) {
      return this.monthNames[date.getMonth()];
    },
    stringify: function stringify(date) {
      var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.format;
      if (isNaN(date.getFullYear())) return '';
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      return format.replace(/yyyy/g, year).replace(/MMMM/g, month).replace(/MMM/g, month).replace(/MM/g, ('0' + month).slice(-2)).replace(/dd/g, ('0' + day).slice(-2)) // .replace(/yy/g, year)
      .replace(/M(?!a)/g, month).replace(/d/g, day);
    },
    parse: function parse(str) {
      var date = new Date(utils_format.dateParse(str, 'MM-DD-YYYY')); // const date = new Date(format.dateParse(str, this.format))

      return isNaN(date.getFullYear()) ? null : date;
    },
    getDayCount: function getDayCount(year, month) {
      var dict = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      if (month === 1) {
        if (year % 400 === 0 || year % 4 === 0 && year % 100 !== 0) {
          return 29;
        }

        return 28;
      }

      return dict[month];
    },
    getDateRange: function getDateRange() {
      this.dateRange = [];
      this.decadeRange = [];
      var time = {
        year: this.currDate.getFullYear(),
        month: this.currDate.getMonth(),
        day: this.currDate.getDate()
      };
      var todayDate = new Date();
      var today = {
        year: todayDate.getFullYear(),
        month: todayDate.getMonth(),
        day: todayDate.getDate()
      };
      var yearStr = time.year.toString();
      var firstYearOfDecade = yearStr.substring(0, yearStr.length - 1) + 0 - 1;

      for (var i = 0; i < 12; i++) {
        this.decadeRange.push({
          text: firstYearOfDecade + i
        });
      }

      var currMonthFirstDay = new Date(time.year, time.month, 1);
      var firstDayWeek = currMonthFirstDay.getDay() + 1;

      if (firstDayWeek === 0) {
        firstDayWeek = 7;
      }

      var dayCount = this.getDayCount(time.year, time.month);

      if (firstDayWeek > 1) {
        var preMonth = this.getYearMonth(time.year, time.month - 1);
        var prevMonthDayCount = this.getDayCount(preMonth.year, preMonth.month);

        for (var _i = 1; _i < firstDayWeek; _i++) {
          var dayText = prevMonthDayCount - firstDayWeek + _i + 1;
          this.dateRange.push({
            text: dayText,
            date: new Date(preMonth.year, preMonth.month, dayText),
            sclass: this.prefixCls + '-datepicker-item-gray'
          });
        }
      }

      for (var _i2 = 1; _i2 <= dayCount; _i2++) {
        var date = new Date(time.year, time.month, _i2);
        var sclass = '';

        if (_i2 === today.day && time.month == today.month) {
          sclass = this.prefixCls + '-datepicker-dateRange-item-today';
        }

        if (_i2 === time.day) {
          if (this.currentValue) {
            var valueDate = this.parse(this.currentValue);

            if (valueDate) {
              if (valueDate.getFullYear() === time.year && valueDate.getMonth() === time.month) {
                sclass = this.prefixCls + '-datepicker-dateRange-item-active';
              }
            }
          }
        }

        this.dateRange.push({
          text: _i2,
          date: date,
          sclass: sclass
        });
      }

      if (this.dateRange.length < 42) {
        var nextMonthNeed = 42 - this.dateRange.length;
        var nextMonth = this.getYearMonth(time.year, time.month + 1);

        for (var _i3 = 1; _i3 <= nextMonthNeed; _i3++) {
          this.dateRange.push({
            text: _i3,
            date: new Date(nextMonth.year, nextMonth.month, _i3),
            sclass: this.prefixCls + '-datepicker-item-gray'
          });
        }
      }
    }
  },
  created: function created() {
    var _this = this;

    this.today = this.stringify(new Date());
    this.$on('Va@datepickerIsMobile', function (val) {
      _this.isMobile = val;
    });
    /**
     * In case this component is instantiated after the App
     * has initially broadcasted isMobile, let's request it.
     */

    this.dispatch('VaApp', 'Va@requestIsMobile', true);
    document.addEventListener('keyup', this.keyup);
  },
  computed: {
    isDateSupported: function isDateSupported() {
      var input = document.createElement('input');
      var value = 'a';
      input.setAttribute('type', 'date');
      input.setAttribute('value', value);
      return input.value !== value;
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    this.currDate = this.parse(this.currentValue) || this.parse(new Date());
    this._closeEvent = utils_EventListener.listen(window, 'click', function (e) {
      if (!_this2.$el.contains(e.target)) _this2.close();
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this._closeEvent) this._closeEvent.remove();
    document.removeEventListener('keyup', this.keyup);
  }
});
// CONCATENATED MODULE: ./src/Datepicker/VaDatepicker.vue?vue&type=script&lang=js&
 /* harmony default export */ var Datepicker_VaDatepickervue_type_script_lang_js_ = (VaDatepickervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Datepicker/VaDatepicker.vue





/* normalize component */

var VaDatepicker_component = normalizeComponent(
  Datepicker_VaDatepickervue_type_script_lang_js_,
  VaDatepickervue_type_template_id_6b348fcb_render,
  VaDatepickervue_type_template_id_6b348fcb_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaDatepicker_component.options.__file = "VaDatepicker.vue"
/* harmony default export */ var Datepicker_VaDatepicker = (VaDatepicker_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Sidebar/VaSidebarHeader.vue?vue&type=template&id=65d7bcfe&
var VaSidebarHeadervue_type_template_id_65d7bcfe_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:(_vm.prefixCls + "-sidebar-header")},[_vm._t("default")],2)}
var VaSidebarHeadervue_type_template_id_65d7bcfe_staticRenderFns = []


// CONCATENATED MODULE: ./src/Sidebar/VaSidebarHeader.vue?vue&type=template&id=65d7bcfe&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Sidebar/VaSidebarHeader.vue?vue&type=script&lang=js&
//
//
//
//
//
//
/* harmony default export */ var VaSidebarHeadervue_type_script_lang_js_ = ({
  name: 'VaSidebarHeader',
  props: {
    prefixCls: {
      type: String,
      default: 'va'
    }
  }
});
// CONCATENATED MODULE: ./src/Sidebar/VaSidebarHeader.vue?vue&type=script&lang=js&
 /* harmony default export */ var Sidebar_VaSidebarHeadervue_type_script_lang_js_ = (VaSidebarHeadervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Sidebar/VaSidebarHeader.vue





/* normalize component */

var VaSidebarHeader_component = normalizeComponent(
  Sidebar_VaSidebarHeadervue_type_script_lang_js_,
  VaSidebarHeadervue_type_template_id_65d7bcfe_render,
  VaSidebarHeadervue_type_template_id_65d7bcfe_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaSidebarHeader_component.options.__file = "VaSidebarHeader.vue"
/* harmony default export */ var VaSidebarHeader = (VaSidebarHeader_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Placeholder/VaPlaceholder.vue?vue&type=template&id=1df4b85c&
var VaPlaceholdervue_type_template_id_1df4b85c_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.classObj},[_vm._t("default")],2)}
var VaPlaceholdervue_type_template_id_1df4b85c_staticRenderFns = []


// CONCATENATED MODULE: ./src/Placeholder/VaPlaceholder.vue?vue&type=template&id=1df4b85c&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Placeholder/VaPlaceholder.vue?vue&type=script&lang=js&
//
//
//
//
//
//
/* harmony default export */ var VaPlaceholdervue_type_script_lang_js_ = ({
  name: 'VaPlaceholder',
  props: {
    rounded: {
      type: Boolean,
      default: false
    },
    centered: {
      type: Boolean,
      default: false
    },
    animated: {
      type: Boolean,
      default: false
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          rounded = this.rounded,
          centered = this.centered,
          animated = this.animated;
      var klass = {};
      klass[prefixCls + '-placeholder'] = true;
      klass[prefixCls + '-placeholder-rounded'] = rounded;
      klass[prefixCls + '-placeholder-centered'] = centered;
      klass[prefixCls + '-placeholder-animated'] = animated;
      return klass;
    }
  }
});
// CONCATENATED MODULE: ./src/Placeholder/VaPlaceholder.vue?vue&type=script&lang=js&
 /* harmony default export */ var Placeholder_VaPlaceholdervue_type_script_lang_js_ = (VaPlaceholdervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Placeholder/VaPlaceholder.vue





/* normalize component */

var VaPlaceholder_component = normalizeComponent(
  Placeholder_VaPlaceholdervue_type_script_lang_js_,
  VaPlaceholdervue_type_template_id_1df4b85c_render,
  VaPlaceholdervue_type_template_id_1df4b85c_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaPlaceholder_component.options.__file = "VaPlaceholder.vue"
/* harmony default export */ var VaPlaceholder = (VaPlaceholder_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ColorPicker/VaColorPicker.vue?vue&type=template&id=1ce150b6&
var VaColorPickervue_type_template_id_1ce150b6_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('va-button',{ref:"colorpicker",class:_vm.classObj,nativeOn:{"click":function($event){return _vm.toggleColorPicker($event)}}},[_c('va-icon',{attrs:{"type":"palette","color":"#7591C2","icon-style":"solid"}}),_c('va-color-picker-popup',{attrs:{"color":_vm.color,"show":_vm.show,"picker-position":_vm.position}})],1)}
var VaColorPickervue_type_template_id_1ce150b6_staticRenderFns = []


// CONCATENATED MODULE: ./src/ColorPicker/VaColorPicker.vue?vue&type=template&id=1ce150b6&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ColorPicker/VaColorPicker.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var VaColorPickervue_type_script_lang_js_ = ({
  name: 'VaColorPicker',
  props: {
    color: {
      type: String,
      default: '#ffff00',
      required: false
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    return {
      show: false,
      position: {}
    };
  },
  mounted: function mounted() {
    this.getPosition();
  },
  methods: {
    getPosition: function getPosition() {
      var rect = this.$refs.colorpicker.$el.getBoundingClientRect();
      this.position = {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y
      };
    },
    toggleColorPicker: function toggleColorPicker() {
      this.getPosition();
      this.show = !this.show;
    }
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls;
      var klass = {};
      klass[prefixCls + '-color-picker'] = true;
      return klass;
    }
  }
});
// CONCATENATED MODULE: ./src/ColorPicker/VaColorPicker.vue?vue&type=script&lang=js&
 /* harmony default export */ var ColorPicker_VaColorPickervue_type_script_lang_js_ = (VaColorPickervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/ColorPicker/VaColorPicker.vue





/* normalize component */

var VaColorPicker_component = normalizeComponent(
  ColorPicker_VaColorPickervue_type_script_lang_js_,
  VaColorPickervue_type_template_id_1ce150b6_render,
  VaColorPickervue_type_template_id_1ce150b6_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaColorPicker_component.options.__file = "VaColorPicker.vue"
/* harmony default export */ var VaColorPicker = (VaColorPicker_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Checkbox/VaCheckboxGroup.vue?vue&type=template&id=015a917f&
var VaCheckboxGroupvue_type_template_id_015a917f_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:_vm.classObj},[_vm._t("default"),_c('validate',{attrs:{"name":_vm.name,"rules":_vm.rules,"custom-validate":_vm.customValidate,"current":_vm.currentValue}})],2)}
var VaCheckboxGroupvue_type_template_id_015a917f_staticRenderFns = []


// CONCATENATED MODULE: ./src/Checkbox/VaCheckboxGroup.vue?vue&type=template&id=015a917f&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Checkbox/VaCheckboxGroup.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ var VaCheckboxGroupvue_type_script_lang_js_ = ({
  name: 'VaCheckboxGroup',
  mixins: [validationMixin, events],
  props: {
    value: {
      type: [Array, String],
      default: function _default() {
        return [];
      }
    },
    vertical: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'checkbox'
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    return {
      currentValue: []
    };
  },
  methods: {
    init: function init() {
      var children = this.$children;
      var ret = [];
      children.forEach(function (item) {
        item.currentChecked ? ret.push(item.label) : '';
      });
      this.currentValue = ret;
    }
  },
  watch: {
    value: function value(val) {
      this.currentValue = val;
    },
    currentValue: function currentValue(val) {
      var value = val || this.value;
      this.broadcast('VaCheckbox', 'Va@checkboxgroupChange', value);
      this.broadcast('VaCheckboxBtn', 'Va@checkboxgroupChange', value);
      this.$emit('input', value);
      this.$emit('change', value);
    }
  },
  created: function created() {
    var _this = this;

    this.$on('Va@checkboxChange', function () {
      _this.init();
    });
  },
  mounted: function mounted() {
    var _this2 = this;

    this.currentValue = this.value;
    this.$nextTick(function () {
      _this2.init();
    });
  },
  components: {
    validate: validate
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          vertical = this.vertical;
      var klass = {};
      klass[prefixCls + '-btn-group'] = !vertical;
      klass[prefixCls + '-btn-group-vertical'] = vertical;
      klass[prefixCls + '-checkbox-group'] = true;
      klass[prefixCls + '-checkbox-group-vertical'] = vertical;
      return klass;
    }
  }
});
// CONCATENATED MODULE: ./src/Checkbox/VaCheckboxGroup.vue?vue&type=script&lang=js&
 /* harmony default export */ var Checkbox_VaCheckboxGroupvue_type_script_lang_js_ = (VaCheckboxGroupvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Checkbox/VaCheckboxGroup.vue





/* normalize component */

var VaCheckboxGroup_component = normalizeComponent(
  Checkbox_VaCheckboxGroupvue_type_script_lang_js_,
  VaCheckboxGroupvue_type_template_id_015a917f_render,
  VaCheckboxGroupvue_type_template_id_015a917f_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaCheckboxGroup_component.options.__file = "VaCheckboxGroup.vue"
/* harmony default export */ var VaCheckboxGroup = (VaCheckboxGroup_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Breadcrumb/VaBreadcrumbItem.vue?vue&type=template&id=40a6f492&
var VaBreadcrumbItemvue_type_template_id_40a6f492_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{class:(_vm.prefixCls + "-breadcrumb-item")},[_c('span',{ref:"link",class:[_vm.prefixCls + '-breadcrumb-item-inner', _vm.to ? _vm.prefixCls + '-breadcrumb-link' : '']},[_vm._t("default")],2),(_vm.separatorIcon)?_c('va-icon',{class:(_vm.prefixCls + "-breadcrumb-item-icon"),attrs:{"type":_vm.separatorIcon}}):_c('span',{class:(_vm.prefixCls + "-breadcrumb-item-separator")},[_vm._v(_vm._s(_vm.separator))])],1)}
var VaBreadcrumbItemvue_type_template_id_40a6f492_staticRenderFns = []


// CONCATENATED MODULE: ./src/Breadcrumb/VaBreadcrumbItem.vue?vue&type=template&id=40a6f492&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.string.link.js
var es6_string_link = __webpack_require__("b54a");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Breadcrumb/VaBreadcrumbItem.vue?vue&type=script&lang=js&


//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var VaBreadcrumbItemvue_type_script_lang_js_ = ({
  name: 'VaBreadcrumbItem',
  props: {
    to: {},
    replace: {
      type: Boolean,
      default: false,
      required: false,
      note: 'When true, the router method used is replace() instead of push(), which does not leave a history trail.'
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    return {
      separator: '',
      separatorIcon: ''
    };
  },
  inject: ['VaBreadcrumbParent'],
  mounted: function mounted() {
    var _this = this;

    this.separator = this.VaBreadcrumbParent.separator;
    this.separatorIcon = this.VaBreadcrumbParent.separatorIcon;
    var link = this.$refs.link;
    link.addEventListener('click', function () {
      var to = _this.to,
          $router = _this.$router;
      if (!to || !$router) return;
      _this.replace ? $router.replace(to) : $router.push(to);
    });
  }
});
// CONCATENATED MODULE: ./src/Breadcrumb/VaBreadcrumbItem.vue?vue&type=script&lang=js&
 /* harmony default export */ var Breadcrumb_VaBreadcrumbItemvue_type_script_lang_js_ = (VaBreadcrumbItemvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Breadcrumb/VaBreadcrumbItem.vue





/* normalize component */

var VaBreadcrumbItem_component = normalizeComponent(
  Breadcrumb_VaBreadcrumbItemvue_type_script_lang_js_,
  VaBreadcrumbItemvue_type_template_id_40a6f492_render,
  VaBreadcrumbItemvue_type_template_id_40a6f492_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaBreadcrumbItem_component.options.__file = "VaBreadcrumbItem.vue"
/* harmony default export */ var VaBreadcrumbItem = (VaBreadcrumbItem_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/App/VaApp.vue?vue&type=template&id=d8deb762&
var VaAppvue_type_template_id_d8deb762_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{style:(_vm.styleObj)},[_vm._t("default")],2)}
var VaAppvue_type_template_id_d8deb762_staticRenderFns = []


// CONCATENATED MODULE: ./src/App/VaApp.vue?vue&type=template&id=d8deb762&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/App/VaApp.vue?vue&type=script&lang=js&


//
//
//
//
//
//

/* harmony default export */ var VaAppvue_type_script_lang_js_ = ({
  name: 'VaApp',
  mixins: [events],
  props: {
    desktopSidebarWidth: {
      type: [Number, String],
      default: 0,
      required: false
    },
    desktopMinibarWidth: {
      type: [Number, String],
      default: 0,
      required: false
    },
    desktopTopbarHeight: {
      type: [Number, String],
      default: 0,
      required: false
    },
    mobileFriendly: {
      type: Boolean,
      default: true
    },
    mobileBreakpoint: {
      type: Number,
      default: 768,
      required: false
    },
    mobileSidebarWidth: {
      type: [Number, String],
      default: 0,
      required: false
    },
    mobileMinibarWidth: {
      type: [Number, String],
      default: 0,
      required: false
    },
    mobileTopbarHeight: {
      type: [Number, String],
      default: 0,
      required: false
    },
    rtl: {
      type: Boolean,
      default: false
    },
    sidebarPriority: {
      type: Boolean,
      default: false,
      required: false
    },
    minibarPriority: {
      type: Boolean,
      default: false,
      required: false
    },
    topbarPriority: {
      type: Boolean,
      default: false,
      required: false
    },
    topbarPadded: {
      type: Boolean,
      default: false,
      required: false
    },
    split: {
      type: Boolean,
      default: false,
      required: false
    },
    reverse: {
      type: Boolean,
      default: false,
      required: false
    },
    desktopMargin: {
      type: [Number, String],
      default: 0,
      required: false
    },
    desktopMinimumWidth: {
      type: [Number, String],
      default: 0,
      required: false
    },
    bgColor: {
      type: String,
      default: '#F4F5F7',
      required: false
    },
    pageBgColor: {
      type: String,
      default: '#FFFFFF',
      required: false
    },
    showToggle: {
      type: Boolean,
      default: false,
      required: false
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    var dDesktopMinimumWidth = this.desktopMinimumWidth;
    var dDesktopTopbarHeight = this.desktopTopbarHeight;
    var dDesktopMinibarWidth = this.desktopMinibarWidth;
    var dDesktopSidebarWidth = this.desktopSidebarWidth;
    var dMobileSidebarWidth = this.mobileSidebarWidth;
    var dMobileMinibarWidth = this.mobileMinibarWidth;
    var dMobileTopbarHeight = this.mobileTopbarHeight;
    var dSidebarPriority = this.sidebarPriority;
    var dMinibarPriority = this.minibarPriority;
    var currDesktopMargin = this.desktopMargin;
    var dTopbarPriority = this.topbarPriority;
    var dDesktopMargin = this.desktopMargin;
    var dTopbarPadded = this.topbarPadded;
    var dPageBgColor = this.pageBgColor;
    var dReverse = this.reverse;
    var dShowToggle = this.showToggle;
    var dBgColor = this.bgColor;
    var dSplit = this.split;
    var dRtl = this.rtl;
    return {
      mDesktopTopbarHeight: dDesktopTopbarHeight,
      mDesktopMinimumWidth: dDesktopMinimumWidth,
      mDesktopSidebarWidth: dDesktopSidebarWidth,
      mDesktopMinibarWidth: dDesktopMinibarWidth,
      mMobileSidebarWidth: dMobileSidebarWidth,
      mMobileMinibarWidth: dMobileMinibarWidth,
      mMobileTopbarHeight: dMobileTopbarHeight,
      currentDesktopMargin: currDesktopMargin,
      mMinibarPriority: dMinibarPriority,
      mSidebarPriority: dSidebarPriority,
      mTopbarPriority: dTopbarPriority,
      mDesktopMargin: dDesktopMargin,
      mTopbarPadded: dTopbarPadded,
      pastMobileBreakpoint: false,
      mPageBgColor: dPageBgColor,
      allowMarginUpdates: true,
      currentMinibarWidth: 0,
      currentTopbarHeight: 0,
      currentSidebarWidth: 0,
      mMinibarTheme: 'blue',
      mSidebarTheme: 'blue',
      mTopbarTheme: 'blue',
      mReverse: dReverse,
      haveMinibar: false,
      mShowToggle: dShowToggle,
      mBgColor: dBgColor,
      haveSidebar: false,
      haveTopbar: false,
      mTextLinks: false,
      mCompact: false,
      havePage: false,
      isMobile: false,
      contentWidth: 0,
      mPageSize: 'md',
      mSplit: dSplit,
      windowWidth: 0,
      mRtl: dRtl
    };
  },
  watch: {
    pastMobileBreakpoint: function pastMobileBreakpoint(val) {
      this.broadcastIsMobile(val);
      this.setAndBroadcastDimensions();
    },
    desktopSidebarWidth: function desktopSidebarWidth(val) {
      this.mDesktopSidebarWidth = val;
    },
    mDesktopSidebarWidth: function mDesktopSidebarWidth() {
      this.setAndBroadcastDimensions();
    },
    desktopMinibarWidth: function desktopMinibarWidth(val) {
      this.mDesktopMinibarWidth = val;
    },
    mDesktopMinibarWidth: function mDesktopMinibarWidth() {
      this.setAndBroadcastDimensions();
    },
    desktopTopbarHeight: function desktopTopbarHeight(val) {
      this.mDesktopTopbarHeight = val;
    },
    mDesktopTopbarHeight: function mDesktopTopbarHeight() {
      this.setAndBroadcastDimensions();
    },
    mobileSidebarWidth: function mobileSidebarWidth(val) {
      this.mMobileSidebarWidth = val;
    },
    mMobileSidebarWidth: function mMobileSidebarWidth() {
      this.setAndBroadcastDimensions();
    },
    mobileMinibarWidth: function mobileMinibarWidth(val) {
      this.mMobileMinibarWidth = val;
    },
    mMobileMinibarWidth: function mMobileMinibarWidth() {
      this.setAndBroadcastDimensions();
    },
    mobileTopbarHeight: function mobileTopbarHeight(val) {
      this.mMobileTopbarHeight = val;
    },
    mMobileTopbarHeight: function mMobileTopbarHeight() {
      this.setAndBroadcastDimensions();
    },
    rtl: function rtl(val) {
      this.mRtl = val;
    },
    mRtl: function mRtl(val) {
      this.broadcastIsRTL(val);
    },
    sidebarPriority: function sidebarPriority(val) {
      this.mSidebarPriority = val;
    },
    mSidebarPriority: function mSidebarPriority(val) {
      this.broadcastSidebarPriority(val);
    },
    minibarPriority: function minibarPriority(val) {
      this.mMinibarPriority = val;
    },
    mMinibarPriority: function mMinibarPriority(val) {
      this.broadcastMinibarPriority(val);
    },
    topbarPriority: function topbarPriority(val) {
      this.mTopbarPriority = val;
    },
    mTopbarPriority: function mTopbarPriority(val) {
      this.broadcastTopbarPriority(val);
    },
    topbarPadded: function topbarPadded(val) {
      this.mTopbarPadded = val;
    },
    mTopbarPadded: function mTopbarPadded(val) {
      this.broadcastTopbarPadded(val);
    },
    bgColor: function bgColor(val) {
      this.mBgColor = val;
    },
    mBgColor: function mBgColor(val) {
      this.broadcastBgColor(val);
    },
    pageBgColor: function pageBgColor(val) {
      this.mPageBgColor = val;
    },
    mPageBgColor: function mPageBgColor(val) {
      this.broadcastPageBgColor(val);
    },
    split: function split(val) {
      this.mSplit = val;
    },
    mSplit: function mSplit(val) {
      this.broadcastIsSplit(val);
    },
    reverse: function reverse(val) {
      this.mReverse = val;
    },
    mReverse: function mReverse(val) {
      this.broadcastIsReverse(val);
    },
    mCompact: function mCompact(val) {
      this.broadcastCompact(val);
    },
    mTextLinks: function mTextLinks(val) {
      this.broadcastTextLinks(val);
    },
    showToggle: function showToggle(val) {
      this.mShowToggle = val;
    },
    mShowToggle: function mShowToggle(val) {
      this.broadcastShowToggle(val);
    },
    desktopMargin: function desktopMargin(val) {
      this.mDesktopMargin = val;
    },
    mDesktopMargin: function mDesktopMargin(val) {
      /**
       * Calling _handleResize here. Why? So a new contentWidth
       * is calculated and broadcasted.
       */
      this._handleResize();

      this.broadcastDesktopMargin(val);
    },
    desktopMinimumWidth: function desktopMinimumWidth(val) {
      this.mDesktopMinimumWidth = val;
    },
    mDesktopMinimumWidth: function mDesktopMinimumWidth(val) {
      this.broadcastDesktopMinimumWidth(val);
    },
    windowWidth: function windowWidth(val) {
      this.broadcastWindowWidth(val);
    },
    contentWidth: function contentWidth(val) {
      this.broadcastContentWidth(val);
    },
    allowMarginUpdates: function allowMarginUpdates(val) {
      this.broadcastAllowMarginUpdates(val);
    },
    mPageSize: function mPageSize(val) {
      this.broadcastPageSize(val);
    },
    topbarTheme: function topbarTheme(val) {
      this.mTopbarTheme = val;
    },
    mTopbarTheme: function mTopbarTheme(val) {
      this.broadcastTopbarTheme(val);
    },
    minibarTheme: function minibarTheme(val) {
      this.mMinibarTheme = val;
    },
    mMinibarTheme: function mMinibarTheme(val) {
      this.broadcastMinibarTheme(val);
    },
    sidebarTheme: function sidebarTheme(val) {
      this.mSidebarTheme = val;
    },
    mSidebarTheme: function mSidebarTheme(val) {
      this.broadcastSidebarTheme(val);
    }
  },
  methods: {
    _handleResize: function _handleResize() {
      var ww = window.innerWidth || document.body.clientWidth;

      if (parseInt(ww) < this.mobileBreakpoint) {
        this.pastMobileBreakpoint = true;
      } else {
        this.pastMobileBreakpoint ? this.pastMobileBreakpoint = false : true;
      }

      this.windowWidth = parseInt(ww);
      this.contentWidth = this.windowWidth - this.mDesktopMargin * 2;
    },
    broadcastSidebarWidth: function broadcastSidebarWidth(val) {
      this.broadcast('VaSidebar', 'Va@sidebarWidthChange', val);
      this.broadcast('VaMinibar', 'Va@sidebarWidthChange', val);
      this.broadcast('VaTopbar', 'Va@sidebarWidthChange', val);
      this.broadcast('VaPage', 'Va@sidebarWidthChange', val);
      this.broadcastDefaultsToConfig(0);
    },
    broadcastMinibarWidth: function broadcastMinibarWidth(val) {
      this.broadcast('VaSidebar', 'Va@minibarWidthChange', val);
      this.broadcast('VaMinibar', 'Va@minibarWidthChange', val);
      this.broadcast('VaTopbar', 'Va@minibarWidthChange', val);
      this.broadcast('VaPage', 'Va@minibarWidthChange', val);
      this.broadcastDefaultsToConfig(0);
    },
    broadcastTopbarHeight: function broadcastTopbarHeight(val) {
      this.broadcast('VaSidebar', 'Va@topbarHeightChange', val);
      this.broadcast('VaMinibar', 'Va@topbarHeightChange', val);
      this.broadcast('VaTopbar', 'Va@topbarHeightChange', val);
      this.broadcast('VaPage', 'Va@topbarHeightChange', val);
      this.broadcastDefaultsToConfig(0);
    },
    broadcastIsMobile: function broadcastIsMobile(val) {
      this.broadcast('VaSidebar', 'Va@sidebarIsMobile', val);
      this.broadcast('VaMinibar', 'Va@minibarIsMobile', val);
      this.broadcast('VaTopbar', 'Va@topbarIsMobile', val);
      this.broadcast('VaPage', 'Va@pageIsMobile', val);
      this.broadcast('VaRange', 'Va@rangeIsMobile', val);
      this.broadcast('VaMobile', 'Va@mobileIsMobile', val);
      this.broadcast('VaDesktop', 'Va@desktopIsMobile', val);
      this.broadcast('VaDatepicker', 'Va@datepickerIsMobile', val);
      this.broadcast('VaTimepicker', 'Va@timepickerIsMobile', val);
    },
    broadcastIsRTL: function broadcastIsRTL(val) {
      this.broadcast('VaSidebar', 'Va@rtlChange', val);
      this.broadcast('VaMinibar', 'Va@rtlChange', val);
      this.broadcast('VaTopbar', 'Va@rtlChange', val);
      this.broadcast('VaPage', 'Va@rtlChange', val);
      this.broadcastDefaultsToConfig(0);
    },
    broadcastIsSplit: function broadcastIsSplit(val) {
      this.broadcast('VaSidebar', 'Va@splitChange', val);
      this.broadcast('VaMinibar', 'Va@splitChange', val);
      this.broadcast('VaTopbar', 'Va@splitChange', val);
      this.broadcast('VaPage', 'Va@splitChange', val);
      this.broadcastDefaultsToConfig(0);
    },
    broadcastCompact: function broadcastCompact(val) {
      this.broadcast('VaSidebar', 'Va@compactChange', val);
      this.broadcastDefaultsToConfig(0);
    },
    broadcastTextLinks: function broadcastTextLinks(val) {
      this.broadcast('VaSidebar', 'Va@textLinksChange', val);
      this.broadcastDefaultsToConfig(0);
    },
    broadcastShowToggle: function broadcastShowToggle(val) {
      this.broadcast('VaSidebar', 'Va@showToggleChange', val);
      this.broadcast('VaSidebarGroupItem', 'Va@showToggleChange', val);
      this.broadcast('VaSidebarGroupLevel', 'Va@showToggleChange', val);
      this.broadcastDefaultsToConfig(0);
    },
    broadcastBgColor: function broadcastBgColor() {
      /**
       * Nobody needs to know about BgColor.
       * Only relevant to this component.
       */
      this.broadcastDefaultsToConfig(0);
    },
    broadcastPageBgColor: function broadcastPageBgColor(val) {
      this.broadcast('VaPage', 'Va@pageBgColorChange', val);
      this.broadcastDefaultsToConfig(0);
    },
    broadcastIsReverse: function broadcastIsReverse(val) {
      this.broadcast('VaSidebar', 'Va@reverseChange', val);
      this.broadcast('VaMinibar', 'Va@reverseChange', val);
      this.broadcast('VaTopbar', 'Va@reverseChange', val);
      this.broadcast('VaPage', 'Va@reverseChange', val);
      this.broadcastDefaultsToConfig(0);
    },
    broadcastSidebarPriority: function broadcastSidebarPriority(val) {
      this.broadcast('VaSidebar', 'Va@sidebarPriorityChange', val);
      this.broadcast('VaMinibar', 'Va@sidebarPriorityChange', val);
      this.broadcast('VaTopbar', 'Va@sidebarPriorityChange', val);
      this.broadcastDefaultsToConfig(0);
    },
    broadcastMinibarPriority: function broadcastMinibarPriority(val) {
      this.broadcast('VaSidebar', 'Va@minibarPriorityChange', val);
      this.broadcast('VaMinibar', 'Va@minibarPriorityChange', val);
      this.broadcast('VaTopbar', 'Va@minibarPriorityChange', val);
      this.broadcastDefaultsToConfig(0);
    },
    broadcastTopbarPriority: function broadcastTopbarPriority(val) {
      this.broadcast('VaSidebar', 'Va@topbarPriorityChange', val);
      this.broadcast('VaMinibar', 'Va@topbarPriorityChange', val);
      this.broadcast('VaTopbar', 'Va@topbarPriorityChange', val);
      this.broadcastDefaultsToConfig(0);
    },
    broadcastTopbarPadded: function broadcastTopbarPadded(val) {
      this.broadcast('VaTopbar', 'Va@topbarPaddedChange', val);
      this.broadcastDefaultsToConfig(0);
    },
    broadcastDesktopMargin: function broadcastDesktopMargin(val) {
      this.broadcast('VaSidebar', 'Va@desktopMarginChange', val);
      this.broadcast('VaMinibar', 'Va@desktopMarginChange', val);
      this.broadcast('VaTopbar', 'Va@desktopMarginChange', val);
      this.broadcast('VaPage', 'Va@desktopMarginChange', val);
      this.broadcastDefaultsToConfig(0);
    },
    broadcastDesktopMinimumWidth: function broadcastDesktopMinimumWidth(val) {
      this.broadcast('VaSidebar', 'Va@desktopMinimumWidthChange', val);
      this.broadcast('VaMinibar', 'Va@desktopMinimumWidthChange', val);
      this.broadcast('VaTopbar', 'Va@desktopMinimumWidthChange', val);
      this.broadcast('VaPage', 'Va@desktopMinimumWidthChange', val);
      this.broadcastDefaultsToConfig(0);
    },
    broadcastAllowMarginUpdates: function broadcastAllowMarginUpdates() {},
    broadcastWindowWidth: function broadcastWindowWidth(val) {
      this.broadcast('VaSidebar', 'Va@windowWidthChange', val);
      this.broadcast('VaMinibar', 'Va@windowWidthChange', val);
      this.broadcast('VaTopbar', 'Va@windowWidthChange', val);
      this.broadcast('VaPage', 'Va@windowWidthChange', val);
    },
    broadcastContentWidth: function broadcastContentWidth(val) {
      this.broadcast('VaSidebar', 'Va@contentWidthChange', val);
      this.broadcast('VaMinibar', 'Va@contentWidthChange', val);
      this.broadcast('VaTopbar', 'Va@contentWidthChange', val);
      this.broadcast('VaPage', 'Va@contentWidthChange', val);
    },
    broadcastPageSize: function broadcastPageSize(val) {
      this.broadcast('VaPage', 'Va@pageSizeChange', val);
      this.broadcastDefaultsToConfig(0);
    },
    broadcastTopbarTheme: function broadcastTopbarTheme(val) {
      this.broadcast('VaTopbar', 'Va@topbarThemeChange', val);
      this.broadcastDefaultsToConfig(0);
    },
    broadcastSidebarTheme: function broadcastSidebarTheme(val) {
      this.broadcast('VaSidebar', 'Va@sidebarThemeChange', val);
      this.broadcastDefaultsToConfig(0);
    },
    broadcastMinibarTheme: function broadcastMinibarTheme(val) {
      this.broadcast('VaMinibar', 'Va@minibarThemeChange', val);
      this.broadcastDefaultsToConfig(0);
    },
    checkForPresenceOfTopbar: function checkForPresenceOfTopbar() {
      this.broadcast('VaTopbar', 'Va@topbarPresenceCheck', true);
    },
    checkForPresenceOfSidebar: function checkForPresenceOfSidebar() {
      this.broadcast('VaSidebar', 'Va@sidebarPresenceCheck', true);
    },
    checkForPresenceOfMinibar: function checkForPresenceOfMinibar() {
      this.broadcast('VaMinibar', 'Va@minibarPresenceCheck', true);
    },
    checkForPresenceOfPage: function checkForPresenceOfPage() {
      this.broadcast('VaPage', 'Va@pagePresenceCheck', true);
    },
    setAndBroadcastDimensions: function setAndBroadcastDimensions() {
      if (this.pastMobileBreakpoint) {
        this.currentTopbarHeight = this.mMobileTopbarHeight;
        this.currentMinibarWidth = this.mMobileMinibarWidth;
        this.currentSidebarWidth = this.mMobileSidebarWidth;
      } else {
        this.currentTopbarHeight = this.mDesktopTopbarHeight;
        this.currentMinibarWidth = this.mDesktopMinibarWidth;
        this.currentSidebarWidth = this.mDesktopSidebarWidth;
      }

      this.broadcastSidebarWidth(this.currentSidebarWidth);
      this.broadcastMinibarWidth(this.currentMinibarWidth);
      this.broadcastTopbarHeight(this.currentTopbarHeight);
    },
    enableReceivers: function enableReceivers() {
      var _this = this;

      /**
       * These exist for VaAppConfig.
       *
       * Setting these values should trigger the 'watch' on each of them,
       * which in turn calls the value's respective broadcast function,
       * broadcasting the new value to whatever has implemented an
       * App.
       */
      this.$on('Va@configDesktopTopbarHeightChange', function (val) {
        _this.mDesktopTopbarHeight = val;
      });
      this.$on('Va@configDesktopSidebarWidthChange', function (val) {
        _this.mDesktopSidebarWidth = val;
      });
      this.$on('Va@configDesktopMinimumWidthChange', function (val) {
        _this.mDesktopMinimumWidth = val;
      });
      this.$on('Va@configDesktopMinibarWidthChange', function (val) {
        _this.mDesktopMinibarWidth = val;
      });
      this.$on('Va@configMobileTopbarHeightChange', function (val) {
        _this.mMobileTopbarHeight = val;
      });
      this.$on('Va@configMobileSidebarWidthChange', function (val) {
        _this.mMobileSidebarWidth = val;
      });
      this.$on('Va@configMobileMinibarWidthChange', function (val) {
        _this.mMobileMinibarWidth = val;
      });
      this.$on('Va@configSidebarPriorityChange', function (val) {
        _this.mSidebarPriority = val;
      });
      this.$on('Va@configMinibarPriorityChange', function (val) {
        _this.mMinibarPriority = val;
      });
      this.$on('Va@configTopbarPriorityChange', function (val) {
        _this.mTopbarPriority = val;
      });
      this.$on('Va@configDesktopMarginChange', function (val) {
        _this.mDesktopMargin = val;
      });
      this.$on('Va@configTopbarPaddedChange', function (val) {
        _this.mTopbarPadded = val;
      });
      this.$on('Va@configMinibarThemeChange', function (val) {
        _this.mMinibarTheme = val;
      });
      this.$on('Va@configSidebarThemeChange', function (val) {
        _this.mSidebarTheme = val;
      });
      this.$on('Va@configTopbarThemeChange', function (val) {
        _this.mTopbarTheme = val;
      });
      this.$on('Va@configPageBgColorChange', function (val) {
        _this.mPageBgColor = val;
      });
      this.$on('Va@configShowToggleChange', function (val) {
        _this.mShowToggle = val;
      });
      this.$on('Va@configTextLinksChange', function (val) {
        _this.mTextLinks = val;
      });
      this.$on('Va@configPageSizeChange', function (val) {
        _this.mPageSize = val;
      });
      this.$on('Va@configCompactChange', function (val) {
        _this.mCompact = val;
      });
      this.$on('Va@configReverseChange', function (val) {
        _this.mReverse = val;
      });
      this.$on('Va@configBgColorChange', function (val) {
        _this.mBgColor = val;
      });
      this.$on('Va@configSplitChange', function (val) {
        _this.mSplit = val;
      });
      this.$on('Va@configRtlChange', function (val) {
        _this.mRtl = val;
      });
    },
    broadcastDefaultsToConfig: function broadcastDefaultsToConfig() {
      var _this2 = this;

      var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
      setTimeout(function () {
        _this2.broadcast('VaAppConfig', 'Va@configReceiveDesktopTopbarHeight', _this2.mDesktopTopbarHeight);

        _this2.broadcast('VaAppConfig', 'Va@configReceiveDesktopMinibarWidth', _this2.mDesktopMinibarWidth);

        _this2.broadcast('VaAppConfig', 'Va@configReceiveDesktopSidebarWidth', _this2.mDesktopSidebarWidth);

        _this2.broadcast('VaAppConfig', 'Va@configReceiveDesktopMinimumWidth', _this2.mDesktopMinimumWidth);

        _this2.broadcast('VaAppConfig', 'Va@configReceiveMobileMinibarWidth', _this2.mMobileMinibarWidth);

        _this2.broadcast('VaAppConfig', 'Va@configReceiveMobileSidebarWidth', _this2.mMobileSidebarWidth);

        _this2.broadcast('VaAppConfig', 'Va@configReceiveMobileTopbarHeight', _this2.mMobileTopbarHeight);

        _this2.broadcast('VaAppConfig', 'Va@configReceiveSidebarPriority', _this2.mSidebarPriority);

        _this2.broadcast('VaAppConfig', 'Va@configReceiveMinibarPriority', _this2.mMinibarPriority);

        _this2.broadcast('VaAppConfig', 'Va@configReceiveTopbarPriority', _this2.mTopbarPriority);

        _this2.broadcast('VaAppConfig', 'Va@configReceiveDesktopMargin', _this2.mDesktopMargin);

        _this2.broadcast('VaAppConfig', 'Va@configReceiveTopbarPadded', _this2.mTopbarPadded);

        _this2.broadcast('VaAppConfig', 'Va@configReceiveMinibarTheme', _this2.mMinibarTheme);

        _this2.broadcast('VaAppConfig', 'Va@configReceiveSidebarTheme', _this2.mSidebarTheme);

        _this2.broadcast('VaAppConfig', 'Va@configReceiveTopbarTheme', _this2.mTopbarTheme);

        _this2.broadcast('VaAppConfig', 'Va@configReceivePageBgColor', _this2.mPageBgColor);

        _this2.broadcast('VaAppConfig', 'Va@configReceiveShowToggle', _this2.mShowToggle);

        _this2.broadcast('VaAppConfig', 'Va@configReceiveTextLinks', _this2.mTextLinks);

        _this2.broadcast('VaAppConfig', 'Va@configReceivePageSize', _this2.mPageSize);

        _this2.broadcast('VaAppConfig', 'Va@configReceiveCompact', _this2.mCompact);

        _this2.broadcast('VaAppConfig', 'Va@configReceiveReverse', _this2.mReverse);

        _this2.broadcast('VaAppConfig', 'Va@configReceiveBgColor', _this2.mBgColor);

        _this2.broadcast('VaAppConfig', 'Va@configReceiveSplit', _this2.mSplit);

        _this2.broadcast('VaAppConfig', 'Va@configReceiveRtl', _this2.mRtl);
      }, delay);
    }
  },
  mounted: function mounted() {
    window.addEventListener('resize', this._handleResize, false);
    /**
     * Call the handler function directly instead of instantiating a resize
     * event like so: window.dispatchEvent(new Event('resize'))
     *
     * Benefit is.. ? Browser compatibility? I dunno.
     */

    this._handleResize();
    /**
     * Mobility check.
     */


    this.setAndBroadcastDimensions();
    /**
     * Presence checks. As of now, this is not really used for
     * anything. Maybe in the future?
     */

    this.checkForPresenceOfSidebar();
    this.checkForPresenceOfTopbar();
    this.checkForPresenceOfPage();
    /**
     * Broadcast props that were passed to the components
     * that need to do stuff based on their values.
     */

    this.broadcastDesktopMinimumWidth(this.mDesktopMinimumWidth);
    this.broadcastMinibarPriority(this.mMinibarPriority);
    this.broadcastSidebarPriority(this.mSidebarPriority);
    this.broadcastTopbarPriority(this.mTopbarPriority);
    this.broadcastDesktopMargin(this.mDesktopMargin);
    this.broadcastTopbarPadded(this.mTopbarPadded);
    this.broadcastContentWidth(this.contentWidth);
    this.broadcastPageBgColor(this.mPageBgColor);
    this.broadcastWindowWidth(this.windowWidth);
    this.broadcastIsReverse(this.mReverse);
    this.broadcastIsSplit(this.mSplit);
    this.broadcastIsRTL(this.mRtl);
    /**
     * --------------------------------------------------
     * Methods related to VaAppConfig
     *
     * enableReceivers() exists so that VaAppConfig
     * can talk to VaApp.
     */

    this.enableReceivers();
    /**
     * broadcastDefaultsToConfig() sends default values to
     * VaAppConfig, in case some values weren't specified.
     */

    this.broadcastDefaultsToConfig();
  },
  beforeDestroy: function beforeDestroy() {
    window.removeEventListener('resize', this._handleResize, false);
  },
  created: function created() {
    var _this3 = this;

    // Presence replies
    this.$on('Va@minibarPresenceReply', function (val) {
      if (val === true) {
        _this3.haveMinibar = true;
      }
    });
    this.$on('Va@sidebarPresenceReply', function (val) {
      if (val === true) {
        _this3.haveSidebar = true;
      }
    });
    this.$on('Va@topbarPresenceReply', function (val) {
      if (val === true) {
        _this3.haveTopbar = true;
      }
    });
    this.$on('Va@pagePresenceReply', function (val) {
      if (val === true) {
        _this3.havePage = true;
      }
    }); // Listen for Sidebar width change - implemented when Sidebar's resizer was implemented
    // this.$on('Va@sidebarWidthChange', (val) => {
    //   this.broadcastSidebarWidth(val)
    // })
    // Some components might want to request the isMobile status, for example,
    // if they have been created a while after isMobile was broadcast.
    // See VaRange.

    this.$on('Va@requestIsMobile', function (val) {
      if (val === true) {
        _this3.broadcastIsMobile(_this3.pastMobileBreakpoint);
      }
    }); // Disconnections

    this.$on('Va@sidebarDisconnect', function (val) {
      if (val === true) {
        _this3.haveSidebar = false;
      }
    });
    this.$on('Va@minibarDisconnect', function (val) {
      if (val === true) {
        _this3.haveMinibar = false;
      }
    });
    this.$on('Va@topbarDisconnect', function (val) {
      if (val === true) {
        _this3.haveTopbar = false;
      }
    });
    this.$on('Va@pageDisconnect', function (val) {
      if (val === true) {
        _this3.havePage = false;
      }
    });
  },
  computed: {
    styleObj: function styleObj() {
      var bg = this.mBgColor;
      var style = {};
      style['background'] = bg;
      style['position'] = 'fixed';
      style['top'] = '0px';
      style['right'] = '0px';
      style['bottom'] = '0px';
      style['left'] = '0px';
      style['overflow'] = 'auto';
      return style;
    }
  }
});
// CONCATENATED MODULE: ./src/App/VaApp.vue?vue&type=script&lang=js&
 /* harmony default export */ var App_VaAppvue_type_script_lang_js_ = (VaAppvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/App/VaApp.vue





/* normalize component */

var VaApp_component = normalizeComponent(
  App_VaAppvue_type_script_lang_js_,
  VaAppvue_type_template_id_d8deb762_render,
  VaAppvue_type_template_id_d8deb762_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaApp_component.options.__file = "VaApp.vue"
/* harmony default export */ var VaApp = (VaApp_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Sidebar/VaSidebarScrollarea.vue?vue&type=template&id=dbe848c0&
var VaSidebarScrollareavue_type_template_id_dbe848c0_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"scrollArea",class:_vm.classObj,attrs:{"id":"vaSidebarScrollArea"},on:{"scroll":_vm.onScroll}},[_vm._t("default")],2)}
var VaSidebarScrollareavue_type_template_id_dbe848c0_staticRenderFns = []


// CONCATENATED MODULE: ./src/Sidebar/VaSidebarScrollarea.vue?vue&type=template&id=dbe848c0&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Sidebar/VaSidebarScrollarea.vue?vue&type=script&lang=js&
//
//
//
//
//
//
/* harmony default export */ var VaSidebarScrollareavue_type_script_lang_js_ = ({
  name: 'VaSidebarScrollarea',
  props: {
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    return {
      scrolled: false
    };
  },
  methods: {
    onScroll: function onScroll() {
      var el = document.getElementById('vaSidebarScrollArea');
      var y = el.scrollTop;

      if (y > 1) {
        this.scrolled = true;
      } else {
        this.scrolled = false;
      }
    }
  },
  computed: {
    classObj: function classObj() {
      // let {prefixCls, scrolled} = this
      var prefixCls = this.prefixCls;
      var klass = {};
      klass[prefixCls + '-sidebar-scrollarea'] = true; // scrolled ? klass[prefixCls + '-sidebar-scrollarea-scrolled'] = true : ''

      return klass;
    }
  }
});
// CONCATENATED MODULE: ./src/Sidebar/VaSidebarScrollarea.vue?vue&type=script&lang=js&
 /* harmony default export */ var Sidebar_VaSidebarScrollareavue_type_script_lang_js_ = (VaSidebarScrollareavue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Sidebar/VaSidebarScrollarea.vue





/* normalize component */

var VaSidebarScrollarea_component = normalizeComponent(
  Sidebar_VaSidebarScrollareavue_type_script_lang_js_,
  VaSidebarScrollareavue_type_template_id_dbe848c0_render,
  VaSidebarScrollareavue_type_template_id_dbe848c0_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaSidebarScrollarea_component.options.__file = "VaSidebarScrollarea.vue"
/* harmony default export */ var VaSidebarScrollarea = (VaSidebarScrollarea_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Placeholder/VaPlaceholderText.vue?vue&type=template&id=6ff13760&
var VaPlaceholderTextvue_type_template_id_6ff13760_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:(_vm.prefixCls + "-placeholder-text")},_vm._l((_vm.lines),function(line){return _c('div',{key:line,class:(_vm.prefixCls + "-placeholder-text-line")})}))}
var VaPlaceholderTextvue_type_template_id_6ff13760_staticRenderFns = []


// CONCATENATED MODULE: ./src/Placeholder/VaPlaceholderText.vue?vue&type=template&id=6ff13760&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Placeholder/VaPlaceholderText.vue?vue&type=script&lang=js&

//
//
//
//
//
//
/* harmony default export */ var VaPlaceholderTextvue_type_script_lang_js_ = ({
  name: 'VaPlaceholderText',
  props: {
    lines: {
      type: Number,
      default: 4
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  }
});
// CONCATENATED MODULE: ./src/Placeholder/VaPlaceholderText.vue?vue&type=script&lang=js&
 /* harmony default export */ var Placeholder_VaPlaceholderTextvue_type_script_lang_js_ = (VaPlaceholderTextvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Placeholder/VaPlaceholderText.vue





/* normalize component */

var VaPlaceholderText_component = normalizeComponent(
  Placeholder_VaPlaceholderTextvue_type_script_lang_js_,
  VaPlaceholderTextvue_type_template_id_6ff13760_render,
  VaPlaceholderTextvue_type_template_id_6ff13760_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaPlaceholderText_component.options.__file = "VaPlaceholderText.vue"
/* harmony default export */ var VaPlaceholderText = (VaPlaceholderText_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Sidebar/VaSidebarGroupTitle.vue?vue&type=template&id=b0f6435c&
var VaSidebarGroupTitlevue_type_template_id_b0f6435c_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:(_vm.prefixCls + "-sidebar-group-title")},[_vm._t("default")],2)}
var VaSidebarGroupTitlevue_type_template_id_b0f6435c_staticRenderFns = []


// CONCATENATED MODULE: ./src/Sidebar/VaSidebarGroupTitle.vue?vue&type=template&id=b0f6435c&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Sidebar/VaSidebarGroupTitle.vue?vue&type=script&lang=js&
//
//
//
//
//
//
/* harmony default export */ var VaSidebarGroupTitlevue_type_script_lang_js_ = ({
  name: 'VaSidebarGroupTitle',
  props: {
    prefixCls: {
      type: String,
      default: 'va'
    }
  }
});
// CONCATENATED MODULE: ./src/Sidebar/VaSidebarGroupTitle.vue?vue&type=script&lang=js&
 /* harmony default export */ var Sidebar_VaSidebarGroupTitlevue_type_script_lang_js_ = (VaSidebarGroupTitlevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Sidebar/VaSidebarGroupTitle.vue





/* normalize component */

var VaSidebarGroupTitle_component = normalizeComponent(
  Sidebar_VaSidebarGroupTitlevue_type_script_lang_js_,
  VaSidebarGroupTitlevue_type_template_id_b0f6435c_render,
  VaSidebarGroupTitlevue_type_template_id_b0f6435c_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaSidebarGroupTitle_component.options.__file = "VaSidebarGroupTitle.vue"
/* harmony default export */ var VaSidebarGroupTitle = (VaSidebarGroupTitle_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ColorPicker/VaColorPickerPopup.vue?vue&type=template&id=36deeb66&
var VaColorPickerPopupvue_type_template_id_36deeb66_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.show),expression:"show"}],ref:"popup",style:(_vm.styleObj)},[_vm._v("\n    popup\n  ")])}
var VaColorPickerPopupvue_type_template_id_36deeb66_staticRenderFns = []


// CONCATENATED MODULE: ./src/ColorPicker/VaColorPickerPopup.vue?vue&type=template&id=36deeb66&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ColorPicker/VaColorPickerPopup.vue?vue&type=script&lang=js&
//
//
//
//
//
//
/* harmony default export */ var VaColorPickerPopupvue_type_script_lang_js_ = ({
  name: 'VaColorPickerPopup',
  props: {
    color: {
      type: String
    },
    show: {
      type: Boolean,
      default: false
    },
    pickerPosition: {
      type: Object
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  mounted: function mounted() {
    var $body = document.querySelector('body');
    $body.appendChild(this.$refs.popup);
  },
  beforeDestroy: function beforeDestroy() {
    var $body = document.querySelector('body');
    $body.removeChild(this.$refs.popup);
  },
  computed: {
    styleObj: function styleObj() {
      var style = {};
      var pos = this.pickerPosition;
      style['position'] = 'absolute';
      style['z-index'] = '9999';
      style['top'] = pos.top + pos.height + 3 + 'px';
      style['left'] = pos.left - 30 + 'px';
      style['width'] = '100px';
      style['background'] = '#F4F5F7'; // style['border'] = '2px solid #DFE1E5'

      style['border-radius'] = '3px';
      style['padding'] = '20px';
      style['text-align'] = 'center';
      return style;
    }
  }
});
// CONCATENATED MODULE: ./src/ColorPicker/VaColorPickerPopup.vue?vue&type=script&lang=js&
 /* harmony default export */ var ColorPicker_VaColorPickerPopupvue_type_script_lang_js_ = (VaColorPickerPopupvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/ColorPicker/VaColorPickerPopup.vue





/* normalize component */

var VaColorPickerPopup_component = normalizeComponent(
  ColorPicker_VaColorPickerPopupvue_type_script_lang_js_,
  VaColorPickerPopupvue_type_template_id_36deeb66_render,
  VaColorPickerPopupvue_type_template_id_36deeb66_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaColorPickerPopup_component.options.__file = "VaColorPickerPopup.vue"
/* harmony default export */ var VaColorPickerPopup = (VaColorPickerPopup_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Sidebar/VaSidebarGroupToggle.vue?vue&type=template&id=f9afceb2&
var VaSidebarGroupTogglevue_type_template_id_f9afceb2_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{class:_vm.classObj},[_c('span',{class:_vm.iconObj},[(!_vm.open)?_c('va-icon',{attrs:{"type":"angle-right","size":"12px","margin":"0 6px 0 0"}}):_c('va-icon',{attrs:{"type":"angle-down","size":"12px","margin":"0 4.5px 0 0"}})],1)])}
var VaSidebarGroupTogglevue_type_template_id_f9afceb2_staticRenderFns = []


// CONCATENATED MODULE: ./src/Sidebar/VaSidebarGroupToggle.vue?vue&type=template&id=f9afceb2&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Sidebar/VaSidebarGroupToggle.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
/* harmony default export */ var VaSidebarGroupTogglevue_type_script_lang_js_ = ({
  name: 'VaSidebarGroupToggle',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          open = this.open;
      var klass = {};
      klass[prefixCls + '-sidebar-group-item-toggle'] = true;
      klass[prefixCls + '-sidebar-group-item-toggle-closed'] = !open;
      return klass;
    },
    iconObj: function iconObj() {
      var prefixCls = this.prefixCls,
          open = this.open;
      var klass = {};
      klass[prefixCls + '-sidebar-group-item-toggle-icon'] = true;
      klass[prefixCls + '-sidebar-group-item-toggle-icon-closed'] = !open;
      return klass;
    }
  }
});
// CONCATENATED MODULE: ./src/Sidebar/VaSidebarGroupToggle.vue?vue&type=script&lang=js&
 /* harmony default export */ var Sidebar_VaSidebarGroupTogglevue_type_script_lang_js_ = (VaSidebarGroupTogglevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Sidebar/VaSidebarGroupToggle.vue





/* normalize component */

var VaSidebarGroupToggle_component = normalizeComponent(
  Sidebar_VaSidebarGroupTogglevue_type_script_lang_js_,
  VaSidebarGroupTogglevue_type_template_id_f9afceb2_render,
  VaSidebarGroupTogglevue_type_template_id_f9afceb2_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaSidebarGroupToggle_component.options.__file = "VaSidebarGroupToggle.vue"
/* harmony default export */ var VaSidebarGroupToggle = (VaSidebarGroupToggle_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Placeholder/VaPlaceholderImage.vue?vue&type=template&id=7d9e586b&
var VaPlaceholderImagevue_type_template_id_7d9e586b_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:(_vm.prefixCls + "-placeholder-image")})}
var VaPlaceholderImagevue_type_template_id_7d9e586b_staticRenderFns = []


// CONCATENATED MODULE: ./src/Placeholder/VaPlaceholderImage.vue?vue&type=template&id=7d9e586b&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Placeholder/VaPlaceholderImage.vue?vue&type=script&lang=js&
//
//
//
//
/* harmony default export */ var VaPlaceholderImagevue_type_script_lang_js_ = ({
  name: 'VaPlaceholderImage',
  props: {
    prefixCls: {
      type: String,
      default: 'va'
    }
  }
});
// CONCATENATED MODULE: ./src/Placeholder/VaPlaceholderImage.vue?vue&type=script&lang=js&
 /* harmony default export */ var Placeholder_VaPlaceholderImagevue_type_script_lang_js_ = (VaPlaceholderImagevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Placeholder/VaPlaceholderImage.vue





/* normalize component */

var VaPlaceholderImage_component = normalizeComponent(
  Placeholder_VaPlaceholderImagevue_type_script_lang_js_,
  VaPlaceholderImagevue_type_template_id_7d9e586b_render,
  VaPlaceholderImagevue_type_template_id_7d9e586b_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaPlaceholderImage_component.options.__file = "VaPlaceholderImage.vue"
/* harmony default export */ var VaPlaceholderImage = (VaPlaceholderImage_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ProgressTracker/VaProgressTracker.vue?vue&type=template&id=f1548acc&
var VaProgressTrackervue_type_template_id_f1548acc_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.round)?_c('ul',{class:(_vm.prefixCls + "-steps-round-con")},[_vm._l((_vm.labels),function(label,index){return [_c('li',{key:index,class:[_vm.getClassFromIndex(index)]},[_c('div',{class:(_vm.prefixCls + "-steps-wrap")},[_c('div',{class:(_vm.prefixCls + "-steps-round")})]),_c('label',[_vm._v(_vm._s(label))])])]})],2):_c('div',{class:(_vm.prefixCls + "-steps clearfix")},[_vm._l((_vm.labels),function(label,index){return [_c('div',{key:index,class:(_vm.prefixCls + "-steps-wrap")},[_c('div',{class:_vm.getClassFromIndex(index)},[_c('label',[_c('span',{class:(_vm.prefixCls + "-steps-round")}),_c('span',[_vm._v(_vm._s(label))])]),(index < _vm.labels.length - 1)?[_c('i',{class:(_vm.prefixCls + "-steps-triangle-right-bg")}),_c('i',{class:(_vm.prefixCls + "-steps-triangle-right")})]:_vm._e()],2)])]})],2)}
var VaProgressTrackervue_type_template_id_f1548acc_staticRenderFns = []


// CONCATENATED MODULE: ./src/ProgressTracker/VaProgressTracker.vue?vue&type=template&id=f1548acc&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/ProgressTracker/VaProgressTracker.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var VaProgressTrackervue_type_script_lang_js_ = ({
  name: 'VaProgressTracker',
  props: {
    labels: {
      type: Array,
      required: true
    },
    current: {
      type: Number,
      default: 1
    },
    round: {
      type: Boolean,
      default: false
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  methods: {
    getClassFromIndex: function getClassFromIndex(index) {
      var ret = '';

      if (index === this.current - 1) {
        ret = 'current';
      } else if (index < this.current - 1) {
        ret = 'finished';
      } else {
        ret = 'todo';
      }

      return this.prefixCls + '-steps-' + ret;
    }
  }
});
// CONCATENATED MODULE: ./src/ProgressTracker/VaProgressTracker.vue?vue&type=script&lang=js&
 /* harmony default export */ var ProgressTracker_VaProgressTrackervue_type_script_lang_js_ = (VaProgressTrackervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/ProgressTracker/VaProgressTracker.vue





/* normalize component */

var VaProgressTracker_component = normalizeComponent(
  ProgressTracker_VaProgressTrackervue_type_script_lang_js_,
  VaProgressTrackervue_type_template_id_f1548acc_render,
  VaProgressTrackervue_type_template_id_f1548acc_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaProgressTracker_component.options.__file = "VaProgressTracker.vue"
/* harmony default export */ var VaProgressTracker = (VaProgressTracker_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Placeholder/VaPlaceholderHeading.vue?vue&type=template&id=249b90c2&
var VaPlaceholderHeadingvue_type_template_id_249b90c2_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:(_vm.prefixCls + "-placeholder-heading")},[(_vm.image)?_c('div',{class:(_vm.prefixCls + "-placeholder-heading-image")}):_vm._e(),_c('div',{class:(_vm.prefixCls + "-placeholder-heading-content")},[_c('div',{class:(_vm.prefixCls + "-placeholder-heading-content-title")}),_c('div',{class:(_vm.prefixCls + "-placeholder-heading-content-subtitle")})])])}
var VaPlaceholderHeadingvue_type_template_id_249b90c2_staticRenderFns = []


// CONCATENATED MODULE: ./src/Placeholder/VaPlaceholderHeading.vue?vue&type=template&id=249b90c2&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Placeholder/VaPlaceholderHeading.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var VaPlaceholderHeadingvue_type_script_lang_js_ = ({
  name: 'VaPlaceholderHeading',
  props: {
    image: {
      type: Boolean,
      default: false
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  }
});
// CONCATENATED MODULE: ./src/Placeholder/VaPlaceholderHeading.vue?vue&type=script&lang=js&
 /* harmony default export */ var Placeholder_VaPlaceholderHeadingvue_type_script_lang_js_ = (VaPlaceholderHeadingvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Placeholder/VaPlaceholderHeading.vue





/* normalize component */

var VaPlaceholderHeading_component = normalizeComponent(
  Placeholder_VaPlaceholderHeadingvue_type_script_lang_js_,
  VaPlaceholderHeadingvue_type_template_id_249b90c2_render,
  VaPlaceholderHeadingvue_type_template_id_249b90c2_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaPlaceholderHeading_component.options.__file = "VaPlaceholderHeading.vue"
/* harmony default export */ var VaPlaceholderHeading = (VaPlaceholderHeading_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/App/VaAppConfig.vue?vue&type=template&id=4fd63ce2&
var VaAppConfigvue_type_template_id_4fd63ce2_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('va-button',{ref:"cfgbtn",style:(_vm.styleObj),attrs:{"type":"default","size":"md"},nativeOn:{"click":function($event){return _vm.showConfigModal($event)}}},[_vm._v("\n      AppConfig\n      "),_c('va-icon',{attrs:{"type":"sliders-h","icon-style":"solid","margin":"0 0 0 10px"}})],1),_c('va-modal',{ref:"configModal",attrs:{"title":"AppConfig","width":"800px","backdrop":true}},[_c('div',{staticClass:"themeModalBody",attrs:{"slot":"body"},slot:"body"},[_c('va-mobile',[_c('p',[_vm._v("\n            The AppConfig is meant to be used on a desktop. If you're on a desktop, try increasing your resolution.\n          ")])]),_c('va-desktop',[_c('va-tabs',[_c('va-tab',{attrs:{"name":"Options"}},[_c('p',{staticStyle:{"margin-bottom":"10px"}},[_vm._v("There are hundreds of combinations of layouts that you can build using the vue-atlas App.")]),_c('h3',[_vm._v("Built-in themes")]),_c('hr'),_c('va-row',{attrs:{"gutter":10}},[_c('va-column',{attrs:{"xs":4}},[_c('p',[_vm._v("\n                    Minibar"),_c('br'),_c('va-select',{attrs:{"no-uncheck":""},model:{value:(_vm.minibarTheme),callback:function ($$v) {_vm.minibarTheme=$$v},expression:"minibarTheme"}},[_c('va-option',{attrs:{"value":"default","label":"Default"}}),_c('va-option',{attrs:{"value":"white","label":"White"}}),_c('va-option',{attrs:{"value":"blue","label":"Blue"}}),_c('va-option',{attrs:{"value":"dark","label":"Dark"}}),_c('va-option',{attrs:{"value":"darker","label":"Darker"}}),_c('va-option',{attrs:{"value":"purple","label":"Purple"}}),_c('va-option',{attrs:{"value":"black","label":"Black"}})],1)],1)]),_c('va-column',{attrs:{"xs":4}},[_c('p',[_vm._v("\n                    Sidebar"),_c('br'),_c('va-select',{attrs:{"no-uncheck":""},model:{value:(_vm.sidebarTheme),callback:function ($$v) {_vm.sidebarTheme=$$v},expression:"sidebarTheme"}},[_c('va-option',{attrs:{"value":"default","label":"Default"}}),_c('va-option',{attrs:{"value":"white","label":"White"}}),_c('va-option',{attrs:{"value":"blue","label":"Blue"}}),_c('va-option',{attrs:{"value":"dark","label":"Dark"}}),_c('va-option',{attrs:{"value":"darker","label":"Darker"}}),_c('va-option',{attrs:{"value":"purple","label":"Purple"}}),_c('va-option',{attrs:{"value":"black","label":"Black"}})],1)],1)]),_c('va-column',{attrs:{"xs":4}},[_c('p',[_vm._v("\n                    Topbar"),_c('br'),_c('va-select',{attrs:{"no-uncheck":""},model:{value:(_vm.topbarTheme),callback:function ($$v) {_vm.topbarTheme=$$v},expression:"topbarTheme"}},[_c('va-option',{attrs:{"value":"default","label":"Default"}}),_c('va-option',{attrs:{"value":"white","label":"White"}}),_c('va-option',{attrs:{"value":"blue","label":"Blue"}}),_c('va-option',{attrs:{"value":"dark","label":"Dark"}}),_c('va-option',{attrs:{"value":"darker","label":"Darker"}}),_c('va-option',{attrs:{"value":"purple","label":"Purple"}}),_c('va-option',{attrs:{"value":"black","label":"Black"}})],1)],1)])],1),_c('va-row',{attrs:{"gutter":10}},[_c('h3',[_vm._v("Background colors")]),_c('hr'),_c('va-column',{attrs:{"xs":6}},[_c('p',[_vm._v("\n                    Document"),_c('br'),_c('va-input',{model:{value:(_vm.bgColor),callback:function ($$v) {_vm.bgColor=$$v},expression:"bgColor"}})],1)]),_c('va-column',{attrs:{"xs":6}},[_c('p',[_vm._v("\n                    Page (content)"),_c('br'),_c('va-input',{model:{value:(_vm.pageBgColor),callback:function ($$v) {_vm.pageBgColor=$$v},expression:"pageBgColor"}})],1)])],1),_c('va-row',{attrs:{"gutter":10}},[_c('h3',[_vm._v("Page")]),_c('hr'),_c('va-column',{attrs:{"xs":12}},[_c('p',[_vm._v("\n                    Page size"),_c('br'),_c('va-select',{attrs:{"no-uncheck":""},model:{value:(_vm.pageSize),callback:function ($$v) {_vm.pageSize=$$v},expression:"pageSize"}},[_c('va-option',{attrs:{"value":"sm","label":"Small"}}),_c('va-option',{attrs:{"value":"md","label":"Medium"}}),_c('va-option',{attrs:{"value":"lg","label":"Large"}})],1)],1)])],1),_c('va-row',{attrs:{"gutter":10}},[_c('h3',[_vm._v("Misc. App props")]),_c('hr'),_c('va-column',{attrs:{"xs":4}},[_c('p',[_c('va-checkbox',{model:{value:(_vm.sidebarPriority),callback:function ($$v) {_vm.sidebarPriority=$$v},expression:"sidebarPriority"}},[_vm._v("sidebarPriority")])],1),_c('p',[_c('va-checkbox',{model:{value:(_vm.minibarPriority),callback:function ($$v) {_vm.minibarPriority=$$v},expression:"minibarPriority"}},[_vm._v("minibarPriority")])],1),_c('p',[_c('va-tooltip',{attrs:{"trigger":"hover","content":"Disabled unless !topbarPriority, !minibarPriority and desktopMargin !== 0","placement":"right","effect":"tooltip-fade-right"}},[_c('va-checkbox',{attrs:{"disabled":_vm.shouldTopbarPriorityBeDisabled},model:{value:(_vm.topbarPriority),callback:function ($$v) {_vm.topbarPriority=$$v},expression:"topbarPriority"}},[_vm._v("topbarPriority")])],1)],1),_c('p',[_c('va-tooltip',{attrs:{"trigger":"hover","content":"Disabled unless topbarPriority and desktopMargin !== 0","placement":"right","effect":"tooltip-fade-right"}},[_c('va-checkbox',{attrs:{"disabled":_vm.shouldTopbarPaddedBeDisabled},model:{value:(_vm.topbarPadded),callback:function ($$v) {_vm.topbarPadded=$$v},expression:"topbarPadded"}},[_vm._v("topbarPadded")])],1)],1)]),_c('va-column',{attrs:{"xs":4}},[_c('p',[_c('va-checkbox',{model:{value:(_vm.rtl),callback:function ($$v) {_vm.rtl=$$v},expression:"rtl"}},[_vm._v("rtl")])],1),_c('p',[_c('va-checkbox',{model:{value:(_vm.reverse),callback:function ($$v) {_vm.reverse=$$v},expression:"reverse"}},[_vm._v("reverse")])],1),_c('p',[_c('va-checkbox',{model:{value:(_vm.split),callback:function ($$v) {_vm.split=$$v},expression:"split"}},[_vm._v("split")])],1)]),_c('va-column',{attrs:{"xs":4}},[_c('p',[_c('va-checkbox',{model:{value:(_vm.showToggle),callback:function ($$v) {_vm.showToggle=$$v},expression:"showToggle"}},[_vm._v("showToggle")])],1),_c('p',[_c('va-checkbox',{model:{value:(_vm.compact),callback:function ($$v) {_vm.compact=$$v},expression:"compact"}},[_vm._v("compact")])],1),_c('p',[_c('va-checkbox',{model:{value:(_vm.textLinks),callback:function ($$v) {_vm.textLinks=$$v},expression:"textLinks"}},[_vm._v("textLinks")])],1)])],1),_c('va-row',{attrs:{"gutter":10}},[_c('h3',[_vm._v("Content margin and minimum width")]),_c('hr'),_c('va-column',{attrs:{"xs":4}},[_c('p',[_vm._v("\n                    Desktop margin: "+_vm._s(_vm.desktopMargin)),_c('br'),_c('va-range',{ref:"desktopMarginRange",attrs:{"min":0,"max":1000,"step":1},model:{value:(_vm.desktopMargin),callback:function ($$v) {_vm.desktopMargin=$$v},expression:"desktopMargin"}})],1)]),_c('va-column',{attrs:{"xs":4}},[_c('p',[_vm._v("\n                    Desktop minimum width: "+_vm._s(_vm.desktopMinimumWidth)),_c('br'),_c('va-range',{ref:"desktopMinimumWidthRange",attrs:{"min":0,"max":1024,"step":1},model:{value:(_vm.desktopMinimumWidth),callback:function ($$v) {_vm.desktopMinimumWidth=$$v},expression:"desktopMinimumWidth"}})],1)]),_c('va-column',{attrs:{"xs":4}},[_c('p',[_vm._v("\n                     \n                  ")])])],1),_c('va-row',{attrs:{"gutter":10}},[_c('h3',[_vm._v("Desktop bar dimensions")]),_c('hr'),_c('va-column',{attrs:{"xs":4}},[_c('p',[_vm._v("\n                    Sidebar width: "+_vm._s(_vm.desktopSidebarWidth)),_c('br'),_c('va-range',{ref:"desktopSidebarWidthRange",attrs:{"min":0,"max":400,"step":5},model:{value:(_vm.desktopSidebarWidth),callback:function ($$v) {_vm.desktopSidebarWidth=$$v},expression:"desktopSidebarWidth"}})],1)]),_c('va-column',{attrs:{"xs":4}},[_c('p',[_vm._v("\n                    Minibar width: "+_vm._s(_vm.desktopMinibarWidth)),_c('br'),_c('va-range',{ref:"desktopMinibarWidthRange",attrs:{"min":0,"max":150,"step":5},model:{value:(_vm.desktopMinibarWidth),callback:function ($$v) {_vm.desktopMinibarWidth=$$v},expression:"desktopMinibarWidth"}})],1)]),_c('va-column',{attrs:{"xs":4}},[_c('p',[_vm._v("\n                    Topbar height: "+_vm._s(_vm.desktopTopbarHeight)),_c('br'),_c('va-range',{ref:"desktopTopbarHeightRange",attrs:{"min":0,"max":150,"step":5},model:{value:(_vm.desktopTopbarHeight),callback:function ($$v) {_vm.desktopTopbarHeight=$$v},expression:"desktopTopbarHeight"}})],1)])],1),_c('va-row',{attrs:{"gutter":10}},[_c('h3',[_vm._v("Mobile bar dimensions")]),_c('hr'),_c('va-column',{attrs:{"xs":4}},[_c('p',[_vm._v("\n                    Sidebar width: "+_vm._s(_vm.mobileSidebarWidth)),_c('br'),_c('va-range',{ref:"mobileSidebarWidthRange",attrs:{"min":0,"max":400,"step":5},model:{value:(_vm.mobileSidebarWidth),callback:function ($$v) {_vm.mobileSidebarWidth=$$v},expression:"mobileSidebarWidth"}})],1)]),_c('va-column',{attrs:{"xs":4}},[_c('p',[_vm._v("\n                    Minibar width: "+_vm._s(_vm.mobileMinibarWidth)),_c('br'),_c('va-range',{ref:"mobileMinibarWidthRange",attrs:{"min":0,"max":150,"step":5},model:{value:(_vm.mobileMinibarWidth),callback:function ($$v) {_vm.mobileMinibarWidth=$$v},expression:"mobileMinibarWidth"}})],1)]),_c('va-column',{attrs:{"xs":4}},[_c('p',[_vm._v("\n                    Topbar height: "+_vm._s(_vm.mobileTopbarHeight)),_c('br'),_c('va-range',{ref:"mobileTopbarHeightRange",attrs:{"min":0,"max":150,"step":5},model:{value:(_vm.mobileTopbarHeight),callback:function ($$v) {_vm.mobileTopbarHeight=$$v},expression:"mobileTopbarHeight"}})],1)])],1)],1),_c('va-tab',{attrs:{"name":"Source"}},[_c('code',[_c('pre',{staticClass:"back"},[_c('span',{staticClass:"blue"},[_vm._v("<template>")]),_vm._v("\n    "),_c('span',{staticClass:"comment"},[_vm._v("<!-- https://vue-atlas.com/documentation/app -->")]),_vm._v("\n    "),_c('span',{staticClass:"blue"},[_vm._v("<va-app")]),_vm._v("\n      "),_c('span',{staticClass:"yellow"},[_vm._v("bg-color")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\""+_vm._s(_vm.bgColor)+"\"")]),_vm._v("\n      "),_c('span',{staticClass:"yellow"},[_vm._v("page-bg-color")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\""+_vm._s(_vm.pageBgColor)+"\"")]),_vm._v("\n      "),_c('span',{staticClass:"yellow"},[_vm._v("desktop-margin")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\""+_vm._s(_vm.desktopMargin)+"\"")]),_vm._v("\n      "),_c('span',{staticClass:"yellow"},[_vm._v("desktop-minimum-width")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\""+_vm._s(_vm.desktopMinimumWidth)+"\"")]),_vm._v("\n      "),_c('span',{staticClass:"yellow"},[_vm._v("desktop-sidebar-width")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\""+_vm._s(_vm.desktopSidebarWidth)+"\"")]),_vm._v("\n      "),_c('span',{staticClass:"yellow"},[_vm._v("desktop-minibar-width")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\""+_vm._s(_vm.desktopMinibarWidth)+"\"")]),_vm._v("\n      "),_c('span',{staticClass:"yellow"},[_vm._v("desktop-topbar-height")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\""+_vm._s(_vm.desktopTopbarHeight)+"\"")]),_vm._v("\n      "),_c('span',{staticClass:"yellow"},[_vm._v("mobile-sidebar-width")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\""+_vm._s(_vm.mobileSidebarWidth)+"\"")]),_vm._v("\n      "),_c('span',{staticClass:"yellow"},[_vm._v("mobile-minibar-width")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\""+_vm._s(_vm.mobileMinibarWidth)+"\"")]),_vm._v("\n      "),_c('span',{staticClass:"yellow"},[_vm._v("mobile-topbar-height")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\""+_vm._s(_vm.mobileTopbarHeight)+"\"")]),_vm._v("\n      "),_c('span',{staticClass:"yellow"},[_vm._v(":rtl")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\""+_vm._s(_vm.rtl)+"\"")]),_vm._v("\n      "),_c('span',{staticClass:"yellow"},[_vm._v(":reverse")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\""+_vm._s(_vm.reverse)+"\"")]),_vm._v("\n      "),_c('span',{staticClass:"yellow"},[_vm._v(":split")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\""+_vm._s(_vm.split)+"\"")]),_vm._v("\n      "),_c('span',{staticClass:"yellow"},[_vm._v(":sidebar-priority")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\""+_vm._s(_vm.sidebarPriority)+"\"")]),_vm._v("\n      "),_c('span',{staticClass:"yellow"},[_vm._v(":minibar-priority")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\""+_vm._s(_vm.minibarPriority)+"\"")]),_vm._v("\n      "),_c('span',{staticClass:"yellow"},[_vm._v(":topbar-priority")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\""+_vm._s(_vm.topbarPriority)+"\"")]),_vm._v("\n      "),_c('span',{staticClass:"yellow"},[_vm._v(":topbar-padded")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\""+_vm._s(_vm.topbarPadded)+"\"")]),_c('span',{staticClass:"blue"},[_vm._v(">")]),_vm._v("\n\n      "),_c('span',{staticClass:"comment"},[_vm._v("<!-- https://vue-atlas.com/documentation/topbar -->")]),_vm._v("\n      "),_c('span',{staticClass:"blue"},[_vm._v("<va-topbar")]),_vm._v(" "),_c('span',{staticClass:"yellow"},[_vm._v("theme")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\""+_vm._s(_vm.topbarTheme)+"\"")]),_c('span',{staticClass:"blue"},[_vm._v(">")]),_vm._v("\n        "),_c('span',{staticClass:"blue"},[_vm._v("<div")]),_vm._v(" "),_c('span',{staticClass:"yellow"},[_vm._v("slot")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\"left\"")]),_c('span',{staticClass:"blue"},[_vm._v(">")]),_vm._v(" L "),_c('span',{staticClass:"blue"},[_vm._v("</div>")]),_vm._v("\n        "),_c('span',{staticClass:"blue"},[_vm._v("<div")]),_vm._v(" "),_c('span',{staticClass:"yellow"},[_vm._v("slot")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\"center\"")]),_c('span',{staticClass:"blue"},[_vm._v(">")]),_vm._v(" C "),_c('span',{staticClass:"blue"},[_vm._v("</div>")]),_vm._v("\n        "),_c('span',{staticClass:"blue"},[_vm._v("<div")]),_vm._v(" "),_c('span',{staticClass:"yellow"},[_vm._v("slot")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\"right\"")]),_c('span',{staticClass:"blue"},[_vm._v(">")]),_vm._v(" R "),_c('span',{staticClass:"blue"},[_vm._v("</div>")]),_vm._v("\n      "),_c('span',{staticClass:"blue"},[_vm._v("</va-topbar>")]),_vm._v("\n\n      "),_c('span',{staticClass:"comment"},[_vm._v("<!-- https://vue-atlas.com/documentation/minibar -->")]),_vm._v("\n      "),_c('span',{staticClass:"blue"},[_vm._v("<va-minibar")]),_vm._v("\n        "),_c('span',{staticClass:"yellow"},[_vm._v(":top-items")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\"[{icon:'home'},{icon:'search'},{icon:'user'}]\"")]),_vm._v("\n        "),_c('span',{staticClass:"yellow"},[_vm._v(":bottom-items")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\"[{icon:'question'}]\"")]),_vm._v("\n        "),_c('span',{staticClass:"yellow"},[_vm._v("theme")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\""+_vm._s(_vm.minibarTheme)+"\"")]),_vm._v(" "),_c('span',{staticClass:"blue"},[_vm._v("/>")]),_vm._v("\n\n      "),_c('span',{staticClass:"comment"},[_vm._v("<!-- https://vue-atlas.com/documentation/sidebar -->")]),_vm._v("\n      "),_c('span',{staticClass:"blue"},[_vm._v("<va-sidebar")]),_vm._v("\n        "),_c('span',{staticClass:"yellow"},[_vm._v("theme")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\""+_vm._s(_vm.sidebarTheme)+"\"")]),_vm._v("\n        "),_c('span',{staticClass:"yellow"},[_vm._v(":compact")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\""+_vm._s(_vm.compact)+"\"")]),_vm._v("\n        "),_c('span',{staticClass:"yellow"},[_vm._v(":text-links")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\""+_vm._s(_vm.textLinks)+"\"")]),_c('span',{staticClass:"blue"},[_vm._v(">")]),_vm._v("\n        "),_c('span',{staticClass:"blue"},[_vm._v("<va-sidebar-scrollarea>")]),_vm._v("\n          "),_c('span',{staticClass:"blue"},[_vm._v("<va-sidebar-group")]),_vm._v("\n            "),_c('span',{staticClass:"yellow"},[_vm._v(":items")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\"[{name:'Item1'}]\"")]),_vm._v("\n            "),_c('span',{staticClass:"yellow"},[_vm._v("title")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\"Category 1\"")]),_vm._v("\n            "),_c('span',{staticClass:"yellow"},[_vm._v(":show-toggle")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\""+_vm._s(_vm.showToggle)+"\"")]),_vm._v(" "),_c('span',{staticClass:"blue"},[_vm._v("/>")]),_vm._v("\n          "),_c('span',{staticClass:"blue"},[_vm._v("<va-sidebar-group")]),_vm._v("\n            "),_c('span',{staticClass:"yellow"},[_vm._v(":items")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\"[{name:'Item1'}]\"")]),_vm._v("\n            "),_c('span',{staticClass:"yellow"},[_vm._v("title")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\"Category 2\"")]),_vm._v("\n            "),_c('span',{staticClass:"yellow"},[_vm._v(":show-toggle")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\""+_vm._s(_vm.showToggle)+"\"")]),_vm._v(" "),_c('span',{staticClass:"blue"},[_vm._v("/>")]),_vm._v("\n        "),_c('span',{staticClass:"blue"},[_vm._v("</va-sidebar-scrollarea>")]),_vm._v("\n      "),_c('span',{staticClass:"blue"},[_vm._v("</va-sidebar>")]),_vm._v("\n\n      "),_c('span',{staticClass:"comment"},[_vm._v("<!-- https://vue-atlas.com/documentation/page -->")]),_vm._v("\n      "),_c('span',{staticClass:"blue"},[_vm._v("<va-page")]),_vm._v(" "),_c('span',{staticClass:"yellow"},[_vm._v("size")]),_vm._v("="),_c('span',{staticClass:"green"},[_vm._v("\""+_vm._s(_vm.pageSize)+"\"")]),_c('span',{staticClass:"blue"},[_vm._v(">")]),_vm._v("\n        "),_c('span',{staticClass:"blue"},[_vm._v("<transition>")]),_vm._v("\n          "),_c('span',{staticClass:"blue"},[_vm._v("<router-view>")]),_vm._v("\n            ...\n          "),_c('span',{staticClass:"blue"},[_vm._v("</router-view>")]),_vm._v("\n        "),_c('span',{staticClass:"blue"},[_vm._v("</transition>")]),_vm._v("\n      "),_c('span',{staticClass:"blue"},[_vm._v("</va-page>")]),_vm._v("\n\n    "),_c('span',{staticClass:"blue"},[_vm._v("</va-app>")]),_vm._v("\n  "),_c('span',{staticClass:"blue"},[_vm._v("</template>")])])])])],1)],1)],1),_c('div',{attrs:{"slot":"footer"},slot:"footer"},[_c('div',{staticStyle:{"text-align":"right"}},[_c('va-button',{attrs:{"type":"primary"},nativeOn:{"click":function($event){_vm.$refs.configModal.close()}}},[_vm._v("\n            Close\n          ")])],1)])])],1)}
var VaAppConfigvue_type_template_id_4fd63ce2_staticRenderFns = []


// CONCATENATED MODULE: ./src/App/VaAppConfig.vue?vue&type=template&id=4fd63ce2&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/App/VaAppConfig.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var VaAppConfigvue_type_script_lang_js_ = ({
  name: 'VaAppConfig',
  mixins: [events],
  props: {
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    return {
      /**
       * Sensible defaults, but will be overwritten by
       * VaApp when it broadcasts initial values.
       * See broadcastDefaultsToConfig()
       */
      minibarTheme: 'default',
      sidebarTheme: 'default',
      topbarTheme: 'blue',
      showToggle: false,
      compact: false,
      textLinks: false,
      desktopSidebarWidth: 210,
      desktopMinibarWidth: 50,
      desktopTopbarHeight: 48,
      desktopMargin: 0,
      desktopMinimumWidth: 1024,
      mobileSidebarWidth: 0,
      mobileMinibarWidth: 0,
      mobileTopbarHeight: 50,
      sidebarPriority: false,
      minibarPriority: false,
      topbarPriority: false,
      topbarPadded: false,
      rtl: false,
      reverse: false,
      split: false,
      pageSize: 'md',
      bgColor: '#F4F5F7',
      pageBgColor: '#FFFFFF'
    };
  },
  watch: {
    desktopSidebarWidth: function desktopSidebarWidth(val) {
      this.dispatch('VaApp', 'Va@configDesktopSidebarWidthChange', val);
    },
    desktopTopbarHeight: function desktopTopbarHeight(val) {
      this.dispatch('VaApp', 'Va@configDesktopTopbarHeightChange', val);
    },
    desktopMinibarWidth: function desktopMinibarWidth(val) {
      this.dispatch('VaApp', 'Va@configDesktopMinibarWidthChange', val);
    },
    desktopMargin: function desktopMargin(val) {
      this.dispatch('VaApp', 'Va@configDesktopMarginChange', val);
    },
    desktopMinimumWidth: function desktopMinimumWidth(val) {
      this.dispatch('VaApp', 'Va@configDesktopMinimumWidthChange', val);
    },
    mobileSidebarWidth: function mobileSidebarWidth(val) {
      this.dispatch('VaApp', 'Va@configMobileSidebarWidthChange', val);
    },
    mobileTopbarHeight: function mobileTopbarHeight(val) {
      this.dispatch('VaApp', 'Va@configMobileTopbarHeightChange', val);
    },
    mobileMinibarWidth: function mobileMinibarWidth(val) {
      this.dispatch('VaApp', 'Va@configMobileMinibarWidthChange', val);
    },
    sidebarPriority: function sidebarPriority(val) {
      this.dispatch('VaApp', 'Va@configSidebarPriorityChange', val);
    },
    minibarPriority: function minibarPriority(val) {
      this.dispatch('VaApp', 'Va@configMinibarPriorityChange', val);
    },
    topbarPriority: function topbarPriority(val) {
      this.dispatch('VaApp', 'Va@configTopbarPriorityChange', val);
    },
    topbarPadded: function topbarPadded(val) {
      this.dispatch('VaApp', 'Va@configTopbarPaddedChange', val);
    },
    rtl: function rtl(val) {
      this.dispatch('VaApp', 'Va@configRtlChange', val);
    },
    split: function split(val) {
      this.dispatch('VaApp', 'Va@configSplitChange', val);
    },
    reverse: function reverse(val) {
      this.dispatch('VaApp', 'Va@configReverseChange', val);
    },
    compact: function compact(val) {
      this.dispatch('VaApp', 'Va@configCompactChange', val);
    },
    showToggle: function showToggle(val) {
      this.dispatch('VaApp', 'Va@configShowToggleChange', val);
    },
    textLinks: function textLinks(val) {
      this.dispatch('VaApp', 'Va@configTextLinksChange', val);
    },
    pageSize: function pageSize(val) {
      this.dispatch('VaApp', 'Va@configPageSizeChange', val);
    },
    topbarTheme: function topbarTheme(val) {
      this.dispatch('VaApp', 'Va@configTopbarThemeChange', val);
    },
    minibarTheme: function minibarTheme(val) {
      this.dispatch('VaApp', 'Va@configMinibarThemeChange', val);
    },
    sidebarTheme: function sidebarTheme(val) {
      this.dispatch('VaApp', 'Va@configSidebarThemeChange', val);
    },
    bgColor: function bgColor(val) {
      this.dispatch('VaApp', 'Va@configBgColorChange', val);
    },
    pageBgColor: function pageBgColor(val) {
      this.dispatch('VaApp', 'Va@configPageBgColorChange', val);
    }
  },
  methods: {
    showConfigModal: function showConfigModal() {
      var _this = this;

      this.$refs.configModal.open();
      setTimeout(function () {
        _this.$refs.desktopSidebarWidthRange.update();

        _this.$refs.desktopMinibarWidthRange.update();

        _this.$refs.desktopTopbarHeightRange.update();

        _this.$refs.mobileSidebarWidthRange.update();

        _this.$refs.mobileMinibarWidthRange.update();

        _this.$refs.mobileTopbarHeightRange.update();

        _this.$refs.desktopMarginRange.update();

        _this.$refs.desktopMinimumWidthRange.update();
      }, 10);
    },
    getPosition: function getPosition(el) {
      var rect = el.getBoundingClientRect();
      return {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y
      };
    }
  },
  created: function created() {
    var _this2 = this;

    /**
     * Here we set up receiver events so that if we pass defaults to the
     * App component, we can send them over to the config component.
     */
    this.$on('Va@configReceiveDesktopTopbarHeight', function (val) {
      _this2.desktopTopbarHeight = val;
    });
    this.$on('Va@configReceiveDesktopMinibarWidth', function (val) {
      _this2.desktopMinibarWidth = val;
    });
    this.$on('Va@configReceiveDesktopSidebarWidth', function (val) {
      _this2.desktopSidebarWidth = val;
    });
    this.$on('Va@configReceiveDesktopMinimumWidth', function (val) {
      _this2.desktopMinimumWidth = val;
    });
    this.$on('Va@configReceiveMobileMinibarWidth', function (val) {
      _this2.mobileMinibarWidth = val;
    });
    this.$on('Va@configReceiveMobileSidebarWidth', function (val) {
      _this2.mobileSidebarWidth = val;
    });
    this.$on('Va@configReceiveMobileTopbarHeight', function (val) {
      _this2.mobileTopbarHeight = val;
    });
    this.$on('Va@configReceiveSidebarPriority', function (val) {
      _this2.sidebarPriority = val;
    });
    this.$on('Va@configReceiveMinibarPriority', function (val) {
      _this2.minibarPriority = val;
    });
    this.$on('Va@configReceiveTopbarPriority', function (val) {
      _this2.topbarPriority = val;
    });
    this.$on('Va@configReceiveDesktopMargin', function (val) {
      _this2.desktopMargin = val;
    });
    this.$on('Va@configReceiveTopbarPadded', function (val) {
      _this2.topbarPadded = val;
    });
    this.$on('Va@configReceiveMinibarTheme', function (val) {
      _this2.minibarTheme = val;
    });
    this.$on('Va@configReceiveSidebarTheme', function (val) {
      _this2.sidebarTheme = val;
    });
    this.$on('Va@configReceiveTopbarTheme', function (val) {
      _this2.topbarTheme = val;
    });
    this.$on('Va@configReceivePageBgColor', function (val) {
      _this2.pageBgColor = val;
    });
    this.$on('Va@configReceiveShowToggle', function (val) {
      _this2.showToggle = val;
    });
    this.$on('Va@configReceiveTextLinks', function (val) {
      _this2.textLinks = val;
    });
    this.$on('Va@configReceivePageSize', function (val) {
      _this2.pageSize = val;
    });
    this.$on('Va@configReceiveCompact', function (val) {
      _this2.compact = val;
    });
    this.$on('Va@configReceiveReverse', function (val) {
      _this2.reverse = val;
    });
    this.$on('Va@configReceiveBgColor', function (val) {
      _this2.bgColor = val;
    });
    this.$on('Va@configReceiveSplit', function (val) {
      _this2.split = val;
    });
    this.$on('Va@configReceiveRtl', function (val) {
      _this2.rtl = val;
    });
  },
  computed: {
    classObj: function classObj() {
      // let prefixCls = this
      var klass = {};
      return klass;
    },
    styleObj: function styleObj() {
      var style = {};
      style['position'] = 'fixed';
      style['right'] = '20px';
      style['z-index'] = '99999';
      style['bottom'] = '20px';
      return style;
    },
    shouldTopbarPriorityBeDisabled: function shouldTopbarPriorityBeDisabled() {
      if (this.sidebarPriority || this.minibarPriority) {
        return true;
      }

      if (this.desktopMargin === 0) {
        return true;
      }

      return false;
    },
    shouldTopbarPaddedBeDisabled: function shouldTopbarPaddedBeDisabled() {
      if (this.desktopMargin === 0) {
        return true;
      }

      if (!this.topbarPriority) {
        return true;
      }

      return false;
    }
  }
});
// CONCATENATED MODULE: ./src/App/VaAppConfig.vue?vue&type=script&lang=js&
 /* harmony default export */ var App_VaAppConfigvue_type_script_lang_js_ = (VaAppConfigvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/App/VaAppConfig.vue?vue&type=style&index=0&lang=scss&
var VaAppConfigvue_type_style_index_0_lang_scss_ = __webpack_require__("7b63");

// CONCATENATED MODULE: ./src/App/VaAppConfig.vue






/* normalize component */

var VaAppConfig_component = normalizeComponent(
  App_VaAppConfigvue_type_script_lang_js_,
  VaAppConfigvue_type_template_id_4fd63ce2_render,
  VaAppConfigvue_type_template_id_4fd63ce2_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaAppConfig_component.options.__file = "VaAppConfig.vue"
/* harmony default export */ var VaAppConfig = (VaAppConfig_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5997b4e1-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Notification/VaNotification.vue?vue&type=template&id=45a4a21b&
var VaNotificationvue_type_template_id_45a4a21b_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.alive)?_c('div',{ref:"notification",class:_vm.classObj,style:(_vm.styleObj)},[_c('div',{class:(_vm.prefixCls + "-notification-dialog"),style:({'width': _vm.width })},[_c('div',{class:(_vm.prefixCls + "-notification-content")},[_c('div',{class:(_vm.prefixCls + "-notification-content-inner-" + _vm.type)},[_c('div',{class:(_vm.prefixCls + "-notification-content-inner-" + _vm.type + "-left")},[_c('va-icon',{attrs:{"type":_vm.notificationIconType}})],1),_c('div',{class:(_vm.prefixCls + "-notification-content-inner-" + _vm.type + "-right")},[_c('div',{class:(_vm.prefixCls + "-notification-content-inner-" + _vm.type + "-right-close")},[_c('va-button',{attrs:{"type":"subtle"},on:{"click":_vm.close}},[_c('va-icon',{attrs:{"size":"14px","type":"times"}})],1)],1),_c('div',{class:(_vm.prefixCls + "-notification-content-inner-" + _vm.type + "-right-title")},[_vm._v("\n                            "+_vm._s(_vm.title)+"\n                        ")]),_c('div',{class:(_vm.prefixCls + "-notification-content-inner-" + _vm.type + "-right-message"),domProps:{"innerHTML":_vm._s(_vm.message)}})])])])])]):_vm._e()}
var VaNotificationvue_type_template_id_45a4a21b_staticRenderFns = []


// CONCATENATED MODULE: ./src/Notification/VaNotification.vue?vue&type=template&id=45a4a21b&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/Notification/VaNotification.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var VaNotificationvue_type_script_lang_js_ = ({
  name: 'VaNotification',
  props: {
    title: {
      type: String,
      default: '',
      required: false,
      note: 'The title of the notification'
    },
    message: {
      type: String,
      default: '',
      required: false,
      note: 'Notification text'
    },
    show: {
      type: Boolean,
      default: false,
      required: false,
      note: 'When false, the notification will not be shown'
    },
    width: {
      type: String,
      default: '440px',
      required: false,
      note: 'The width of the notification'
    },
    effect: {
      type: String,
      default: 'fade-right',
      required: false,
      note: 'The css effect to apply to the notification.'
    },
    type: {
      type: String,
      default: 'default',
      required: false,
      note: 'The type of notification to display'
    },
    duration: {
      type: Number,
      default: 0,
      required: false,
      note: 'Notification TTL'
    },
    prefixCls: {
      type: String,
      default: 'va'
    }
  },
  data: function data() {
    var show = this.show;
    return {
      isShow: show,
      alive: true
    };
  },
  mounted: function mounted() {
    var _this = this;

    if (this.duration) {
      setTimeout(function () {
        _this.close();
      }, this.duration);
    }
  },
  watch: {
    isShow: function isShow(val) {
      var _this2 = this;

      /**
       * Stackable logic
       */
      if (val) {
        var x = document.getElementsByClassName(this.prefixCls + '-notification-in');
        this.numberOfParentModals = x.length;
        var distanceToMove = 5;

        if (this.numberOfParentModals > 0) {
          for (var i = 0; i < this.numberOfParentModals; i++) {
            var currentMarginTop = x[i].style['top'];

            if (currentMarginTop && currentMarginTop !== '0px') {
              var m = Math.abs(currentMarginTop.slice(0, -2));
              var dist = parseInt(m + distanceToMove);
              x[i].style['top'] = '-' + dist + 'px';
              x[i].style['right'] = '-' + dist + 'px';
            } else {
              x[i].style['top'] = distanceToMove * -1 + 'px';
              x[i].style['right'] = distanceToMove * -1 + 'px';
            }
          }
        }
      } else {
        var _x = document.getElementsByClassName(this.prefixCls + '-notification-in');

        this.numberOfParentModals = _x.length;
        var _distanceToMove = 5;

        if (this.numberOfParentModals > 0) {
          for (var _i = 0; _i < this.numberOfParentModals; _i++) {
            var _currentMarginTop = _x[_i].style['top'];

            if (_currentMarginTop && _currentMarginTop !== '0px') {
              var _m = Math.abs(_currentMarginTop.slice(0, -2));

              var _dist = parseInt(_m - _distanceToMove);

              _x[_i].style['top'] = '-' + _dist + 'px';
              _x[_i].style['right'] = '-' + _dist + 'px';
            }
          }
        }
      }
      /**
       * Classes
       */


      var el = this.$el;
      var body = document.body;

      if (val) {
        this.$emit('show', {
          type: 'show'
        });
        el.querySelector('.' + this.prefixCls + '-notification');
        el.style.display = 'block'; // timeout required for opacity transition

        setTimeout(function () {
          utils_element.addClass(el, _this2.prefixCls + '-notification-in');
        }, 20);
        utils_element.addClass(body, this.prefixCls + '-notification-open');
      } else {
        this.$emit('hide', {
          type: 'hide'
        });
        utils_element.removeClass(el, this.prefixCls + '-notification-in');
        utils_element.addClass(el, this.prefixCls + '-notification-out');
        setTimeout(function () {
          el.style.display = 'none';
          utils_element.removeClass(body, _this2.prefixCls + '-notification-open');
          utils_element.removeClass(el, _this2.prefixCls + '-notification-out');

          _this2.$emit('closed', {
            type: 'closed'
          });
        }, 300);
      }
    }
  },
  methods: {
    close: function close() {
      var _this3 = this;

      this.isShow = false;
      setTimeout(function () {
        _this3.alive = false;
      }, 500);
    },
    open: function open() {
      this.isShow = true;
    },
    confirm: function confirm() {
      this.$emit('confirm', {
        type: 'confirm'
      });
    }
  },
  computed: {
    classObj: function classObj() {
      var prefixCls = this.prefixCls,
          effect = this.effect,
          type = this.type;
      var klass = {};
      klass[prefixCls + '-notification'] = true;
      klass[prefixCls + '-notification-' + type] = true;
      klass[prefixCls + '-notification-' + effect] = true;
      return klass;
    },
    styleObj: function styleObj() {
      return {};
    },
    notificationIconType: function notificationIconType() {
      var type = this.type;

      switch (type) {
        case 'default':
          return 'home';

        case 'warning':
          return 'exclamation-triangle';

        case 'danger':
          return 'exclamation-triangle';

        case 'success':
          return 'thumbs-up';

        case 'info':
          return 'info-circle';
      }
    }
  }
});
// CONCATENATED MODULE: ./src/Notification/VaNotification.vue?vue&type=script&lang=js&
 /* harmony default export */ var Notification_VaNotificationvue_type_script_lang_js_ = (VaNotificationvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/Notification/VaNotification.vue





/* normalize component */

var VaNotification_component = normalizeComponent(
  Notification_VaNotificationvue_type_script_lang_js_,
  VaNotificationvue_type_template_id_45a4a21b_render,
  VaNotificationvue_type_template_id_45a4a21b_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VaNotification_component.options.__file = "VaNotification.vue"
/* harmony default export */ var VaNotification = (VaNotification_component.exports);
// CONCATENATED MODULE: ./src/Notification/VaNotificationMethod.js


var VaNotificationMethod_$body = document.querySelector('body');

var VaNotificationMethod_createNode = function createNode() {
  var $node = document.createElement('div');
  VaNotificationMethod_$body.appendChild($node);
  return $node;
};

var VaNotificationMethod_open = function open(options) {
  var title = options.title,
      message = options.message,
      effect = options.effect,
      type = options.type,
      width = options.width,
      duration = options.duration,
      onShow = options.onShow,
      onHide = options.onHide,
      onConfirm = options.onConfirm;
  new external_commonjs_vue_commonjs2_vue_root_Vue_default.a({
    el: VaNotificationMethod_createNode(),
    data: function data() {
      return {
        show: false,
        pc: 'va'
      };
    },
    mounted: function mounted() {
      this.$refs.notification.open();
    },
    methods: {
      handleShow: function handleShow() {
        onShow && onShow();
      },
      handleConfirm: function handleConfirm() {
        onConfirm && onConfirm();
        this.$refs.notification.close();
      },
      handleHide: function handleHide() {
        onHide && onHide();
      },
      handleClose: function handleClose() {
        this.$refs.notification.close();
      },
      destroy: function destroy() {
        this.$destroy();
      }
    },
    render: function render(createElement) {
      return createElement(VaNotification, {
        ref: 'notification',
        props: {
          title: title,
          message: message,
          type: type ? type : 'default',
          effect: effect || 'fade-right',
          width: width || '440px',
          duration: duration
        },
        on: {
          hide: this.handleHide,
          confirm: this.handleConfirm,
          show: this.handleShow,
          closed: this.destroy
        }
      }, []);
    }
  });
};

/* harmony default export */ var VaNotificationMethod = ({
  open: VaNotificationMethod_open
});
// CONCATENATED MODULE: ./src/components.js





































































var Components = {
  VaRow: VaRow,
  VaTab: VaTab,
  VaTabs: VaTabs,
  VaForm: VaForm,
  VaCard: VaCard,
  VaPage: VaPage,
  VaIcon: VaIcon,
  VaRadio: VaRadio,
  VaTable: VaTable,
  VaAside: VaAside,
  VaRange: VaRange,
  VaAffix: VaAffix,
  VaBadge: VaBadge,
  VaAlert: VaAlert,
  VaInput: VaInput,
  VaModal: Modal_VaModal,
  VaTopbar: VaTopbar,
  VaMobile: VaMobile,
  VaSelect: Select_VaSelect,
  VaButton: VaButton,
  VaColumn: VaColumn,
  VaOption: VaOption,
  VaToggle: VaToggle,
  VaLozenge: VaLozenge,
  VaLoading: VaLoading,
  VaSidebar: VaSidebar,
  VaDesktop: VaDesktop,
  VaTooltip: VaTooltip,
  VaMinibar: VaMinibar,
  VaTextarea: VaTextarea,
  VaInputOps: VaInputOps,
  VaRadioBtn: VaRadioBtn,
  VaCheckbox: VaCheckbox,
  VaDropdown: VaDropdown,
  VaFormItem: VaFormItem,
  VaContainer: VaContainer,
  VaTypeahead: VaTypeahead,
  VaAnimQueue: VaAnimQueue,
  VaBreadcrumb: VaBreadcrumb,
  VaPageHeader: VaPageHeader,
  VaTimepicker: Timepicker_VaTimepicker,
  VaRadioGroup: VaRadioGroup,
  VaDatepicker: Datepicker_VaDatepicker,
  VaButtonGroup: VaButtonGroup,
  VaCheckboxBtn: VaCheckboxBtn,
  VaPlaceholder: VaPlaceholder,
  VaColorPicker: VaColorPicker,
  VaMinibarItem: VaMinibarItem,
  VaSidebarGroup: Sidebar_VaSidebarGroup,
  VaSidebarHeader: VaSidebarHeader,
  VaCheckboxGroup: VaCheckboxGroup,
  VaApp: VaApp,
  VaBreadcrumbItem: VaBreadcrumbItem,
  VaProgressTracker: VaProgressTracker,
  VaPlaceholderText: VaPlaceholderText,
  VaSidebarGroupItem: VaSidebarGroupItem,
  VaPlaceholderImage: VaPlaceholderImage,
  VaColorPickerPopup: VaColorPickerPopup,
  VaSidebarScrollarea: VaSidebarScrollarea,
  VaSidebarGroupLevel: VaSidebarGroupLevel,
  VaSidebarGroupTitle: VaSidebarGroupTitle,
  VaPlaceholderHeading: VaPlaceholderHeading,
  VaSidebarGroupToggle: VaSidebarGroupToggle,
  VaAppConfig: VaAppConfig,
  VaNotification: VaNotification
};

var components_install = function install(Vue, locale) {
  for (var i in Components) {
    Vue.component(i, Components[i]);
  }

  Vue.directive('VaPosition', src_relocate);
  Vue.prototype.VaToast = VaToastMethod;
  Vue.prototype.VaModal = VaModalMethod;
  Vue.prototype.VaNotification = VaNotificationMethod;
  Vue.prototype.VaLocale = locale || 'en';
  window.VaLocale = locale || 'en';
};

if (typeof window !== 'undefined' && window.Vue) {
  components_install(window.Vue);
}

Components.install = components_install;
/* harmony default export */ var components = (Components);
// EXTERNAL MODULE: ./src/style/default.scss
var style_default = __webpack_require__("2e13");

// CONCATENATED MODULE: ./src/index.js


/* harmony default export */ var src = (components);
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (src);



/***/ }),

/***/ "fdef":
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ })

/******/ });
//# sourceMappingURL=vue-atlas.common.js.map