if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { webcrypto } from "node:crypto";
//#region node_modules/lib0/map.js
/**
* Utility module to work with key-value stores.
*
* @module map
*/
/**
* @template K
* @template V
* @typedef {Map<K,V>} GlobalMap
*/
/**
* Creates a new Map instance.
*
* @function
* @return {Map<any, any>}
*
* @function
*/
var create$4 = () => /* @__PURE__ */ new Map();
/**
* Copy a Map object into a fresh Map object.
*
* @function
* @template K,V
* @param {Map<K,V>} m
* @return {Map<K,V>}
*/
var copy = (m) => {
	const r = create$4();
	m.forEach((v, k) => {
		r.set(k, v);
	});
	return r;
};
/**
* Get map property. Create T if property is undefined and set T on map.
*
* ```js
* const listeners = map.setIfUndefined(events, 'eventName', set.create)
* listeners.add(listener)
* ```
*
* @function
* @template {Map<any, any>} MAP
* @template {MAP extends Map<any,infer V> ? function():V : unknown} CF
* @param {MAP} map
* @param {MAP extends Map<infer K,any> ? K : unknown} key
* @param {CF} createT
* @return {ReturnType<CF>}
*/
var setIfUndefined = (map, key, createT) => {
	let set = map.get(key);
	if (set === void 0) map.set(key, set = createT());
	return set;
};
/**
* Tests whether any key-value pairs pass the test implemented by `f(value, key)`.
*
* @todo should rename to some - similarly to Array.some
*
* @function
* @template K
* @template V
* @param {Map<K,V>} m
* @param {function(V,K):boolean} f
* @return {boolean}
*/
var any = (m, f) => {
	for (const [key, value] of m) if (f(value, key)) return true;
	return false;
};
//#endregion
//#region node_modules/lib0/set.js
/**
* Utility module to work with sets.
*
* @module set
*/
var create$3 = () => /* @__PURE__ */ new Set();
//#endregion
//#region node_modules/lib0/array.js
/**
* Return the last element of an array. The element must exist
*
* @template L
* @param {ArrayLike<L>} arr
* @return {L}
*/
var last = (arr) => arr[arr.length - 1];
/**
* Append elements from src to dest
*
* @template M
* @param {Array<M>} dest
* @param {Array<M>} src
*/
var appendTo = (dest, src) => {
	for (let i = 0; i < src.length; i++) dest.push(src[i]);
};
/**
* Transforms something array-like to an actual Array.
*
* @function
* @template T
* @param {ArrayLike<T>|Iterable<T>} arraylike
* @return {T}
*/
var from = Array.from;
var isArray = Array.isArray;
//#endregion
//#region node_modules/lib0/string.js
/**
* Utility module to work with strings.
*
* @module string
*/
var fromCharCode = String.fromCharCode;
String.fromCodePoint;
fromCharCode(65535);
/**
* @param {string} s
* @return {string}
*/
var toLowerCase = (s) => s.toLowerCase();
var trimLeftRegex = /^\s*/g;
/**
* @param {string} s
* @return {string}
*/
var trimLeft = (s) => s.replace(trimLeftRegex, "");
var fromCamelCaseRegex = /([A-Z])/g;
/**
* @param {string} s
* @param {string} separator
* @return {string}
*/
var fromCamelCase = (s, separator) => trimLeft(s.replace(fromCamelCaseRegex, (match) => `${separator}${toLowerCase(match)}`));
/**
* @param {string} str
* @return {Uint8Array<ArrayBuffer>}
*/
var _encodeUtf8Polyfill = (str) => {
	const encodedString = unescape(encodeURIComponent(str));
	const len = encodedString.length;
	const buf = new Uint8Array(len);
	for (let i = 0; i < len; i++) buf[i] = encodedString.codePointAt(i);
	return buf;
};
/* c8 ignore next */
var utf8TextEncoder = typeof TextEncoder !== "undefined" ? new TextEncoder() : null;
/**
* @param {string} str
* @return {Uint8Array<ArrayBuffer>}
*/
var _encodeUtf8Native = (str) => utf8TextEncoder.encode(str);
/**
* @param {string} str
* @return {Uint8Array}
*/
/* c8 ignore next */
var encodeUtf8 = utf8TextEncoder ? _encodeUtf8Native : _encodeUtf8Polyfill;
/* c8 ignore next */
var utf8TextDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder("utf-8", {
	fatal: true,
	ignoreBOM: true
});
/* c8 ignore start */
if (utf8TextDecoder && utf8TextDecoder.decode(/* @__PURE__ */ new Uint8Array()).length === 1)
 /* c8 ignore next */
utf8TextDecoder = null;
//#endregion
//#region node_modules/lib0/conditions.js
/**
* Often used conditions.
*
* @module conditions
*/
/**
* @template T
* @param {T|null|undefined} v
* @return {T|null}
*/
/* c8 ignore next */
var undefinedToNull = (v) => v === void 0 ? null : v;
//#endregion
//#region node_modules/lib0/storage.js
/**
* Isomorphic variable storage.
*
* Uses LocalStorage in the browser and falls back to in-memory storage.
*
* @module storage
*/
/* c8 ignore start */
var VarStoragePolyfill = class {
	constructor() {
		this.map = /* @__PURE__ */ new Map();
	}
	/**
	* @param {string} key
	* @param {any} newValue
	*/
	setItem(key, newValue) {
		this.map.set(key, newValue);
	}
	/**
	* @param {string} key
	*/
	getItem(key) {
		return this.map.get(key);
	}
};
/* c8 ignore stop */
/**
* @type {any}
*/
var _localStorage = new VarStoragePolyfill();
var usePolyfill = true;
/* c8 ignore start */
try {
	if (typeof localStorage !== "undefined" && localStorage) {
		_localStorage = localStorage;
		usePolyfill = false;
	}
} catch (e) {}
/* c8 ignore stop */
/**
* This is basically localStorage in browser, or a polyfill in nodejs
*/
/* c8 ignore next */
var varStorage = _localStorage;
/**
* A polyfill for `addEventListener('storage', event => {..})` that does nothing if the polyfill is being used.
*
* @param {function({ key: string, newValue: string, oldValue: string }): void} eventHandler
* @function
*/
/* c8 ignore next */
var onChange = (eventHandler) => usePolyfill || addEventListener("storage", eventHandler);
/**
* A polyfill for `removeEventListener('storage', event => {..})` that does nothing if the polyfill is being used.
*
* @param {function({ key: string, newValue: string, oldValue: string }): void} eventHandler
* @function
*/
/* c8 ignore next */
var offChange = (eventHandler) => usePolyfill || removeEventListener("storage", eventHandler);
//#endregion
//#region node_modules/lib0/trait/equality.js
var EqualityTraitSymbol = Symbol("Equality");
/**
* @typedef {{ [EqualityTraitSymbol]:(other:EqualityTrait)=>boolean }} EqualityTrait
*/
/**
*
* Utility function to compare any two objects.
*
* Note that it is expected that the first parameter is more specific than the latter one.
*
* @example js
*     class X { [traits.EqualityTraitSymbol] (other) { return other === this }  }
*     class X2 { [traits.EqualityTraitSymbol] (other) { return other === this }, x2 () { return 2 }  }
*     // this is fine
*     traits.equals(new X2(), new X())
*     // this is not, because the left type is less specific than the right one
*     traits.equals(new X(), new X2())
*
* @template {EqualityTrait} T
* @param {NoInfer<T>} a
* @param {T} b
* @return {boolean}
*/
var equals = (a, b) => a === b || !!a?.[EqualityTraitSymbol]?.(b) || false;
//#endregion
//#region node_modules/lib0/object.js
/**
* Object.assign
*/
var assign = Object.assign;
/**
* @param {Object<string,any>} obj
*/
var keys = Object.keys;
/**
* @template V
* @param {{[k:string]:V}} obj
* @param {function(V,string):any} f
*/
var forEach = (obj, f) => {
	for (const key in obj) f(obj[key], key);
};
/**
* @todo implement mapToArray & map
*
* @template R
* @param {Object<string,any>} obj
* @param {function(any,string):R} f
* @return {Array<R>}
*/
var map = (obj, f) => {
	const results = [];
	for (const key in obj) results.push(f(obj[key], key));
	return results;
};
/**
* @param {Object<string,any>} obj
* @return {number}
*/
var size = (obj) => keys(obj).length;
/**
* @param {Object|null|undefined} obj
*/
var isEmpty = (obj) => {
	for (const _k in obj) return false;
	return true;
};
/**
* @template {{ [key:string|number|symbol]: any }} T
* @param {T} obj
* @param {(v:T[keyof T],k:keyof T)=>boolean} f
* @return {boolean}
*/
var every = (obj, f) => {
	for (const key in obj) if (!f(obj[key], key)) return false;
	return true;
};
/**
* Calls `Object.prototype.hasOwnProperty`.
*
* @param {any} obj
* @param {string|number|symbol} key
* @return {boolean}
*/
var hasProperty = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
/**
* @param {Object<string,any>} a
* @param {Object<string,any>} b
* @return {boolean}
*/
var equalFlat = (a, b) => a === b || size(a) === size(b) && every(a, (val, key) => (val !== void 0 || hasProperty(b, key)) && equals(b[key], val));
/**
* Make an object immutable. This hurts performance and is usually not needed if you perform good
* coding practices.
*/
var freeze = Object.freeze;
/**
* Make an object and all its children immutable.
* This *really* hurts performance and is usually not needed if you perform good coding practices.
*
* @template {any} T
* @param {T} o
* @return {Readonly<T>}
*/
var deepFreeze = (o) => {
	for (const key in o) {
		const c = o[key];
		if (typeof c === "object" || typeof c === "function") deepFreeze(o[key]);
	}
	return freeze(o);
};
//#endregion
//#region node_modules/lib0/function.js
/**
* Calls all functions in `fs` with args. Only throws after all functions were called.
*
* @param {Array<function>} fs
* @param {Array<any>} args
*/
var callAll = (fs, args, i = 0) => {
	try {
		for (; i < fs.length; i++) fs[i](...args);
	} finally {
		if (i < fs.length) callAll(fs, args, i + 1);
	}
};
/**
* @template A
*
* @param {A} a
* @return {A}
*/
var id = (a) => a;
/* c8 ignore start */
/**
* @param {any} a
* @param {any} b
* @return {boolean}
*/
var equalityDeep = (a, b) => {
	if (a === b) return true;
	if (a == null || b == null || a.constructor !== b.constructor && (a.constructor || Object) !== (b.constructor || Object)) return false;
	if (a[EqualityTraitSymbol] != null) return a[EqualityTraitSymbol](b);
	switch (a.constructor) {
		case ArrayBuffer:
			a = new Uint8Array(a);
			b = new Uint8Array(b);
		case Uint8Array:
			if (a.byteLength !== b.byteLength) return false;
			for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
			break;
		case Set:
			if (a.size !== b.size) return false;
			for (const value of a) if (!b.has(value)) return false;
			break;
		case Map:
			if (a.size !== b.size) return false;
			for (const key of a.keys()) if (!b.has(key) || !equalityDeep(a.get(key), b.get(key))) return false;
			break;
		case void 0:
		case Object:
			if (size(a) !== size(b)) return false;
			for (const key in a) if (!hasProperty(a, key) || !equalityDeep(a[key], b[key])) return false;
			break;
		case Array:
			if (a.length !== b.length) return false;
			for (let i = 0; i < a.length; i++) if (!equalityDeep(a[i], b[i])) return false;
			break;
		default: return false;
	}
	return true;
};
/**
* @template V
* @template {V} OPTS
*
* @param {V} value
* @param {Array<OPTS>} options
*/
var isOneOf = (value, options) => options.includes(value);
//#endregion
//#region node_modules/lib0/environment.js
/**
* Isomorphic module to work access the environment (query params, env variables).
*
* @module environment
*/
/* c8 ignore next 2 */
var isNode = typeof process !== "undefined" && process.release && /node|io\.js/.test(process.release.name) && Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
/* c8 ignore next */
var isBrowser = typeof window !== "undefined" && typeof document !== "undefined" && !isNode;
typeof navigator !== "undefined" && /Mac/.test(navigator.platform);
/**
* @type {Map<string,string>}
*/
var params;
var args = [];
/* c8 ignore start */
var computeParams = () => {
	if (params === void 0) {
		if (isNode) {
			params = create$4();
			const pargs = process.argv;
			let currParamName = null;
			for (let i = 0; i < pargs.length; i++) {
				const parg = pargs[i];
				if (parg[0] === "-") {
					if (currParamName !== null) params.set(currParamName, "");
					currParamName = parg;
				} else if (currParamName !== null) {
					params.set(currParamName, parg);
					currParamName = null;
				} else args.push(parg);
			}
			if (currParamName !== null) params.set(currParamName, "");
		} else if (typeof location === "object") {
			params = create$4();
			(location.search || "?").slice(1).split("&").forEach((kv) => {
				if (kv.length !== 0) {
					const [key, value] = kv.split("=");
					params.set(`--${fromCamelCase(key, "-")}`, value);
					params.set(`-${fromCamelCase(key, "-")}`, value);
				}
			});
		} else params = create$4();
	}
	return params;
};
/* c8 ignore stop */
/**
* @param {string} name
* @return {boolean}
*/
/* c8 ignore next */
var hasParam = (name) => computeParams().has(name);
/**
* @param {string} name
* @return {string|null}
*/
/* c8 ignore next 4 */
var getVariable = (name) => isNode ? undefinedToNull(process.env[name.toUpperCase().replaceAll("-", "_")]) : undefinedToNull(varStorage.getItem(name));
/**
* @param {string} name
* @return {boolean}
*/
/* c8 ignore next 2 */
var hasConf = (name) => hasParam("--" + name) || getVariable(name) !== null;
hasConf("production");
/* c8 ignore start */
/**
* Color is enabled by default if the terminal supports it.
*
* Explicitly enable color using `--color` parameter
* Disable color using `--no-color` parameter or using `NO_COLOR=1` environment variable.
* `FORCE_COLOR=1` enables color and takes precedence over all.
*/
var supportsColor = isNode && isOneOf(process.env.FORCE_COLOR, [
	"true",
	"1",
	"2"
]) || !hasParam("--no-colors") && !hasConf("no-color") && (!isNode || process.stdout.isTTY) && (!isNode || hasParam("--color") || getVariable("COLORTERM") !== null || (getVariable("TERM") || "").includes("color"));
/* c8 ignore stop */
//#endregion
//#region node_modules/lib0/math.js
/**
* Common Math expressions.
*
* @module math
*/
var floor = Math.floor;
var abs = Math.abs;
/**
* @function
* @param {number} a
* @param {number} b
* @return {number} The smaller element of a and b
*/
var min = (a, b) => a < b ? a : b;
/**
* @function
* @param {number} a
* @param {number} b
* @return {number} The bigger element of a and b
*/
var max = (a, b) => a > b ? a : b;
Number.isNaN;
var pow = Math.pow;
/**
* Check whether n is negative, while considering the -0 edge case. While `-0 < 0` is false, this
* function returns true for -0,-1,,.. and returns false for 0,1,2,...
* @param {number} n
* @return {boolean} Wether n is negative. This function also distinguishes between -0 and +0
*/
var isNegativeZero = (n) => n !== 0 ? n < 0 : 1 / n < 0;
//#endregion
//#region node_modules/lib0/number.js
/**
* Utility helpers for working with numbers.
*
* @module number
*/
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
Number.MIN_SAFE_INTEGER;
/* c8 ignore next */
var isInteger = Number.isInteger || ((num) => typeof num === "number" && isFinite(num) && floor(num) === num);
Number.isNaN;
Number.parseInt;
//#endregion
//#region node_modules/lib0/encoding.js
/**
* Efficient schema-less binary encoding with support for variable length encoding.
*
* Use [lib0/encoding] with [lib0/decoding]. Every encoding function has a corresponding decoding function.
*
* Encodes numbers in little-endian order (least to most significant byte order)
* and is compatible with Golang's binary encoding (https://golang.org/pkg/encoding/binary/)
* which is also used in Protocol Buffers.
*
* ```js
* // encoding step
* const encoder = encoding.createEncoder()
* encoding.writeVarUint(encoder, 256)
* encoding.writeVarString(encoder, 'Hello world!')
* const buf = encoding.toUint8Array(encoder)
* ```
*
* ```js
* // decoding step
* const decoder = decoding.createDecoder(buf)
* decoding.readVarUint(decoder) // => 256
* decoding.readVarString(decoder) // => 'Hello world!'
* decoding.hasContent(decoder) // => false - all data is read
* ```
*
* @module encoding
*/
/**
* A BinaryEncoder handles the encoding to an Uint8Array.
*/
var Encoder = class {
	constructor() {
		this.cpos = 0;
		this.cbuf = /* @__PURE__ */ new Uint8Array(100);
		/**
		* @type {Array<Uint8Array>}
		*/
		this.bufs = [];
	}
};
/**
* @function
* @return {Encoder}
*/
var createEncoder = () => new Encoder();
/**
* The current length of the encoded data.
*
* @function
* @param {Encoder} encoder
* @return {number}
*/
var length = (encoder) => {
	let len = encoder.cpos;
	for (let i = 0; i < encoder.bufs.length; i++) len += encoder.bufs[i].length;
	return len;
};
/**
* Transform to Uint8Array.
*
* @function
* @param {Encoder} encoder
* @return {Uint8Array<ArrayBuffer>} The created ArrayBuffer.
*/
var toUint8Array = (encoder) => {
	const uint8arr = new Uint8Array(length(encoder));
	let curPos = 0;
	for (let i = 0; i < encoder.bufs.length; i++) {
		const d = encoder.bufs[i];
		uint8arr.set(d, curPos);
		curPos += d.length;
	}
	uint8arr.set(new Uint8Array(encoder.cbuf.buffer, 0, encoder.cpos), curPos);
	return uint8arr;
};
/**
* Verify that it is possible to write `len` bytes wtihout checking. If
* necessary, a new Buffer with the required length is attached.
*
* @param {Encoder} encoder
* @param {number} len
*/
var verifyLen = (encoder, len) => {
	const bufferLen = encoder.cbuf.length;
	if (bufferLen - encoder.cpos < len) {
		encoder.bufs.push(new Uint8Array(encoder.cbuf.buffer, 0, encoder.cpos));
		encoder.cbuf = new Uint8Array(max(bufferLen, len) * 2);
		encoder.cpos = 0;
	}
};
/**
* Write one byte to the encoder.
*
* @function
* @param {Encoder} encoder
* @param {number} num The byte that is to be encoded.
*/
var write = (encoder, num) => {
	const bufferLen = encoder.cbuf.length;
	if (encoder.cpos === bufferLen) {
		encoder.bufs.push(encoder.cbuf);
		encoder.cbuf = new Uint8Array(bufferLen * 2);
		encoder.cpos = 0;
	}
	encoder.cbuf[encoder.cpos++] = num;
};
/**
* Write one byte as an unsigned integer.
*
* @function
* @param {Encoder} encoder
* @param {number} num The number that is to be encoded.
*/
var writeUint8 = write;
/**
* Write a variable length unsigned integer. Max encodable integer is 2^53.
*
* @function
* @param {Encoder} encoder
* @param {number} num The number that is to be encoded.
*/
var writeVarUint = (encoder, num) => {
	while (num > 127) {
		write(encoder, 128 | 127 & num);
		num = floor(num / 128);
	}
	write(encoder, 127 & num);
};
/**
* Write a variable length integer.
*
* We use the 7th bit instead for signaling that this is a negative number.
*
* @function
* @param {Encoder} encoder
* @param {number} num The number that is to be encoded.
*/
var writeVarInt = (encoder, num) => {
	const isNegative = isNegativeZero(num);
	if (isNegative) num = -num;
	write(encoder, (num > 63 ? 128 : 0) | (isNegative ? 64 : 0) | 63 & num);
	num = floor(num / 64);
	while (num > 0) {
		write(encoder, (num > 127 ? 128 : 0) | 127 & num);
		num = floor(num / 128);
	}
};
/**
* A cache to store strings temporarily
*/
var _strBuffer = /* @__PURE__ */ new Uint8Array(3e4);
var _maxStrBSize = _strBuffer.length / 3;
/**
* Write a variable length string.
*
* @function
* @param {Encoder} encoder
* @param {String} str The string that is to be encoded.
*/
var _writeVarStringNative = (encoder, str) => {
	if (str.length < _maxStrBSize) {
		/* c8 ignore next */
		const written = utf8TextEncoder.encodeInto(str, _strBuffer).written || 0;
		writeVarUint(encoder, written);
		for (let i = 0; i < written; i++) write(encoder, _strBuffer[i]);
	} else writeVarUint8Array(encoder, encodeUtf8(str));
};
/**
* Write a variable length string.
*
* @function
* @param {Encoder} encoder
* @param {String} str The string that is to be encoded.
*/
var _writeVarStringPolyfill = (encoder, str) => {
	const encodedString = unescape(encodeURIComponent(str));
	const len = encodedString.length;
	writeVarUint(encoder, len);
	for (let i = 0; i < len; i++) write(encoder, encodedString.codePointAt(i));
};
/**
* Write a variable length string.
*
* @function
* @param {Encoder} encoder
* @param {String} str The string that is to be encoded.
*/
/* c8 ignore next */
var writeVarString = utf8TextEncoder && utf8TextEncoder.encodeInto ? _writeVarStringNative : _writeVarStringPolyfill;
/**
* Append fixed-length Uint8Array to the encoder.
*
* @function
* @param {Encoder} encoder
* @param {Uint8Array} uint8Array
*/
var writeUint8Array = (encoder, uint8Array) => {
	const bufferLen = encoder.cbuf.length;
	const cpos = encoder.cpos;
	const leftCopyLen = min(bufferLen - cpos, uint8Array.length);
	const rightCopyLen = uint8Array.length - leftCopyLen;
	encoder.cbuf.set(uint8Array.subarray(0, leftCopyLen), cpos);
	encoder.cpos += leftCopyLen;
	if (rightCopyLen > 0) {
		encoder.bufs.push(encoder.cbuf);
		encoder.cbuf = new Uint8Array(max(bufferLen * 2, rightCopyLen));
		encoder.cbuf.set(uint8Array.subarray(leftCopyLen));
		encoder.cpos = rightCopyLen;
	}
};
/**
* Append an Uint8Array to Encoder.
*
* @function
* @param {Encoder} encoder
* @param {Uint8Array} uint8Array
*/
var writeVarUint8Array = (encoder, uint8Array) => {
	writeVarUint(encoder, uint8Array.byteLength);
	writeUint8Array(encoder, uint8Array);
};
/**
* Create an DataView of the next `len` bytes. Use it to write data after
* calling this function.
*
* ```js
* // write float32 using DataView
* const dv = writeOnDataView(encoder, 4)
* dv.setFloat32(0, 1.1)
* // read float32 using DataView
* const dv = readFromDataView(encoder, 4)
* dv.getFloat32(0) // => 1.100000023841858 (leaving it to the reader to find out why this is the correct result)
* ```
*
* @param {Encoder} encoder
* @param {number} len
* @return {DataView}
*/
var writeOnDataView = (encoder, len) => {
	verifyLen(encoder, len);
	const dview = new DataView(encoder.cbuf.buffer, encoder.cpos, len);
	encoder.cpos += len;
	return dview;
};
/**
* @param {Encoder} encoder
* @param {number} num
*/
var writeFloat32 = (encoder, num) => writeOnDataView(encoder, 4).setFloat32(0, num, false);
/**
* @param {Encoder} encoder
* @param {number} num
*/
var writeFloat64 = (encoder, num) => writeOnDataView(encoder, 8).setFloat64(0, num, false);
/**
* @param {Encoder} encoder
* @param {bigint} num
*/
var writeBigInt64 = (encoder, num) => writeOnDataView(encoder, 8).setBigInt64(0, num, false);
var floatTestBed = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(4));
/**
* Check if a number can be encoded as a 32 bit float.
*
* @param {number} num
* @return {boolean}
*/
var isFloat32 = (num) => {
	floatTestBed.setFloat32(0, num);
	return floatTestBed.getFloat32(0) === num;
};
/**
* @typedef {Array<AnyEncodable>} AnyEncodableArray
*/
/**
* @typedef {undefined|null|number|bigint|boolean|string|{[k:string]:AnyEncodable}|AnyEncodableArray|Uint8Array} AnyEncodable
*/
/**
* Encode data with efficient binary format.
*
* Differences to JSON:
* • Transforms data to a binary format (not to a string)
* • Encodes undefined, NaN, and ArrayBuffer (these can't be represented in JSON)
* • Numbers are efficiently encoded either as a variable length integer, as a
*   32 bit float, as a 64 bit float, or as a 64 bit bigint.
*
* Encoding table:
*
* | Data Type           | Prefix   | Encoding Method    | Comment |
* | ------------------- | -------- | ------------------ | ------- |
* | undefined           | 127      |                    | Functions, symbol, and everything that cannot be identified is encoded as undefined |
* | null                | 126      |                    | |
* | integer             | 125      | writeVarInt        | Only encodes 32 bit signed integers |
* | float32             | 124      | writeFloat32       | |
* | float64             | 123      | writeFloat64       | |
* | bigint              | 122      | writeBigInt64      | |
* | boolean (false)     | 121      |                    | True and false are different data types so we save the following byte |
* | boolean (true)      | 120      |                    | - 0b01111000 so the last bit determines whether true or false |
* | string              | 119      | writeVarString     | |
* | object<string,any>  | 118      | custom             | Writes {length} then {length} key-value pairs |
* | array<any>          | 117      | custom             | Writes {length} then {length} json values |
* | Uint8Array          | 116      | writeVarUint8Array | We use Uint8Array for any kind of binary data |
*
* Reasons for the decreasing prefix:
* We need the first bit for extendability (later we may want to encode the
* prefix with writeVarUint). The remaining 7 bits are divided as follows:
* [0-30]   the beginning of the data range is used for custom purposes
*          (defined by the function that uses this library)
* [31-127] the end of the data range is used for data encoding by
*          lib0/encoding.js
*
* @param {Encoder} encoder
* @param {AnyEncodable} data
*/
var writeAny = (encoder, data) => {
	switch (typeof data) {
		case "string":
			write(encoder, 119);
			writeVarString(encoder, data);
			break;
		case "number":
			if (isInteger(data) && abs(data) <= 2147483647) {
				write(encoder, 125);
				writeVarInt(encoder, data);
			} else if (isFloat32(data)) {
				write(encoder, 124);
				writeFloat32(encoder, data);
			} else {
				write(encoder, 123);
				writeFloat64(encoder, data);
			}
			break;
		case "bigint":
			write(encoder, 122);
			writeBigInt64(encoder, data);
			break;
		case "object":
			if (data === null) write(encoder, 126);
			else if (isArray(data)) {
				write(encoder, 117);
				writeVarUint(encoder, data.length);
				for (let i = 0; i < data.length; i++) writeAny(encoder, data[i]);
			} else if (data instanceof Uint8Array) {
				write(encoder, 116);
				writeVarUint8Array(encoder, data);
			} else {
				write(encoder, 118);
				const keys = Object.keys(data);
				writeVarUint(encoder, keys.length);
				for (let i = 0; i < keys.length; i++) {
					const key = keys[i];
					writeVarString(encoder, key);
					writeAny(encoder, data[key]);
				}
			}
			break;
		case "boolean":
			write(encoder, data ? 120 : 121);
			break;
		default: write(encoder, 127);
	}
};
/**
* Now come a few stateful encoder that have their own classes.
*/
/**
* Basic Run Length Encoder - a basic compression implementation.
*
* Encodes [1,1,1,7] to [1,3,7,1] (3 times 1, 1 time 7). This encoder might do more harm than good if there are a lot of values that are not repeated.
*
* It was originally used for image compression. Cool .. article http://csbruce.com/cbm/transactor/pdfs/trans_v7_i06.pdf
*
* @note T must not be null!
*
* @template T
*/
var RleEncoder = class extends Encoder {
	/**
	* @param {function(Encoder, T):void} writer
	*/
	constructor(writer) {
		super();
		/**
		* The writer
		*/
		this.w = writer;
		/**
		* Current state
		* @type {T|null}
		*/
		this.s = null;
		this.count = 0;
	}
	/**
	* @param {T} v
	*/
	write(v) {
		if (this.s === v) this.count++;
		else {
			if (this.count > 0) writeVarUint(this, this.count - 1);
			this.count = 1;
			this.w(this, v);
			this.s = v;
		}
	}
};
/**
* @param {UintOptRleEncoder} encoder
*/
var flushUintOptRleEncoder = (encoder) => {
	if (encoder.count > 0) {
		writeVarInt(encoder.encoder, encoder.count === 1 ? encoder.s : -encoder.s);
		if (encoder.count > 1) writeVarUint(encoder.encoder, encoder.count - 2);
	}
};
/**
* Optimized Rle encoder that does not suffer from the mentioned problem of the basic Rle encoder.
*
* Internally uses VarInt encoder to write unsigned integers. If the input occurs multiple times, we write
* write it as a negative number. The UintOptRleDecoder then understands that it needs to read a count.
*
* Encodes [1,2,3,3,3] as [1,2,-3,3] (once 1, once 2, three times 3)
*/
var UintOptRleEncoder = class {
	constructor() {
		this.encoder = new Encoder();
		/**
		* @type {number}
		*/
		this.s = 0;
		this.count = 0;
	}
	/**
	* @param {number} v
	*/
	write(v) {
		if (this.s === v) this.count++;
		else {
			flushUintOptRleEncoder(this);
			this.count = 1;
			this.s = v;
		}
	}
	/**
	* Flush the encoded state and transform this to a Uint8Array.
	*
	* Note that this should only be called once.
	*/
	toUint8Array() {
		flushUintOptRleEncoder(this);
		return toUint8Array(this.encoder);
	}
};
/**
* @param {IntDiffOptRleEncoder} encoder
*/
var flushIntDiffOptRleEncoder = (encoder) => {
	if (encoder.count > 0) {
		const encodedDiff = encoder.diff * 2 + (encoder.count === 1 ? 0 : 1);
		writeVarInt(encoder.encoder, encodedDiff);
		if (encoder.count > 1) writeVarUint(encoder.encoder, encoder.count - 2);
	}
};
/**
* A combination of the IntDiffEncoder and the UintOptRleEncoder.
*
* The count approach is similar to the UintDiffOptRleEncoder, but instead of using the negative bitflag, it encodes
* in the LSB whether a count is to be read. Therefore this Encoder only supports 31 bit integers!
*
* Encodes [1, 2, 3, 2] as [3, 1, 6, -1] (more specifically [(1 << 1) | 1, (3 << 0) | 0, -1])
*
* Internally uses variable length encoding. Contrary to normal UintVar encoding, the first byte contains:
* * 1 bit that denotes whether the next value is a count (LSB)
* * 1 bit that denotes whether this value is negative (MSB - 1)
* * 1 bit that denotes whether to continue reading the variable length integer (MSB)
*
* Therefore, only five bits remain to encode diff ranges.
*
* Use this Encoder only when appropriate. In most cases, this is probably a bad idea.
*/
var IntDiffOptRleEncoder = class {
	constructor() {
		this.encoder = new Encoder();
		/**
		* @type {number}
		*/
		this.s = 0;
		this.count = 0;
		this.diff = 0;
	}
	/**
	* @param {number} v
	*/
	write(v) {
		if (this.diff === v - this.s) {
			this.s = v;
			this.count++;
		} else {
			flushIntDiffOptRleEncoder(this);
			this.count = 1;
			this.diff = v - this.s;
			this.s = v;
		}
	}
	/**
	* Flush the encoded state and transform this to a Uint8Array.
	*
	* Note that this should only be called once.
	*/
	toUint8Array() {
		flushIntDiffOptRleEncoder(this);
		return toUint8Array(this.encoder);
	}
};
/**
* Optimized String Encoder.
*
* Encoding many small strings in a simple Encoder is not very efficient. The function call to decode a string takes some time and creates references that must be eventually deleted.
* In practice, when decoding several million small strings, the GC will kick in more and more often to collect orphaned string objects (or maybe there is another reason?).
*
* This string encoder solves the above problem. All strings are concatenated and written as a single string using a single encoding call.
*
* The lengths are encoded using a UintOptRleEncoder.
*/
var StringEncoder = class {
	constructor() {
		/**
		* @type {Array<string>}
		*/
		this.sarr = [];
		this.s = "";
		this.lensE = new UintOptRleEncoder();
	}
	/**
	* @param {string} string
	*/
	write(string) {
		this.s += string;
		if (this.s.length > 19) {
			this.sarr.push(this.s);
			this.s = "";
		}
		this.lensE.write(string.length);
	}
	toUint8Array() {
		const encoder = new Encoder();
		this.sarr.push(this.s);
		this.s = "";
		writeVarString(encoder, this.sarr.join(""));
		writeUint8Array(encoder, this.lensE.toUint8Array());
		return toUint8Array(encoder);
	}
};
//#endregion
//#region node_modules/lib0/error.js
/**
* Error helpers.
*
* @module error
*/
/**
* @param {string} s
* @return {Error}
*/
/* c8 ignore next */
var create$2 = (s) => new Error(s);
/**
* @throws {Error}
* @return {never}
*/
/* c8 ignore next 3 */
var methodUnimplemented = () => {
	throw create$2("Method unimplemented");
};
/**
* @throws {Error}
* @return {never}
*/
/* c8 ignore next 3 */
var unexpectedCase = () => {
	throw create$2("Unexpected case");
};
//#endregion
//#region node_modules/lib0/decoding.js
/**
* Efficient schema-less binary decoding with support for variable length encoding.
*
* Use [lib0/decoding] with [lib0/encoding]. Every encoding function has a corresponding decoding function.
*
* Encodes numbers in little-endian order (least to most significant byte order)
* and is compatible with Golang's binary encoding (https://golang.org/pkg/encoding/binary/)
* which is also used in Protocol Buffers.
*
* ```js
* // encoding step
* const encoder = encoding.createEncoder()
* encoding.writeVarUint(encoder, 256)
* encoding.writeVarString(encoder, 'Hello world!')
* const buf = encoding.toUint8Array(encoder)
* ```
*
* ```js
* // decoding step
* const decoder = decoding.createDecoder(buf)
* decoding.readVarUint(decoder) // => 256
* decoding.readVarString(decoder) // => 'Hello world!'
* decoding.hasContent(decoder) // => false - all data is read
* ```
*
* @module decoding
*/
var errorUnexpectedEndOfArray = create$2("Unexpected end of array");
var errorIntegerOutOfRange = create$2("Integer out of Range");
/**
* A Decoder handles the decoding of an Uint8Array.
* @template {ArrayBufferLike} [Buf=ArrayBufferLike]
*/
var Decoder = class {
	/**
	* @param {Uint8Array<Buf>} uint8Array Binary data to decode
	*/
	constructor(uint8Array) {
		/**
		* Decoding target.
		*
		* @type {Uint8Array<Buf>}
		*/
		this.arr = uint8Array;
		/**
		* Current decoding position.
		*
		* @type {number}
		*/
		this.pos = 0;
	}
};
/**
* @function
* @template {ArrayBufferLike} Buf
* @param {Uint8Array<Buf>} uint8Array
* @return {Decoder<Buf>}
*/
var createDecoder = (uint8Array) => new Decoder(uint8Array);
/**
* @function
* @param {Decoder} decoder
* @return {boolean}
*/
var hasContent = (decoder) => decoder.pos !== decoder.arr.length;
/**
* Create an Uint8Array view of the next `len` bytes and advance the position by `len`.
*
* Important: The Uint8Array still points to the underlying ArrayBuffer. Make sure to discard the result as soon as possible to prevent any memory leaks.
*            Use `buffer.copyUint8Array` to copy the result into a new Uint8Array.
*
* @function
* @template {ArrayBufferLike} Buf
* @param {Decoder<Buf>} decoder The decoder instance
* @param {number} len The length of bytes to read
* @return {Uint8Array<Buf>}
*/
var readUint8Array = (decoder, len) => {
	const view = new Uint8Array(decoder.arr.buffer, decoder.pos + decoder.arr.byteOffset, len);
	decoder.pos += len;
	return view;
};
/**
* Read variable length Uint8Array.
*
* Important: The Uint8Array still points to the underlying ArrayBuffer. Make sure to discard the result as soon as possible to prevent any memory leaks.
*            Use `buffer.copyUint8Array` to copy the result into a new Uint8Array.
*
* @function
* @template {ArrayBufferLike} Buf
* @param {Decoder<Buf>} decoder
* @return {Uint8Array<Buf>}
*/
var readVarUint8Array = (decoder) => readUint8Array(decoder, readVarUint(decoder));
/**
* Read one byte as unsigned integer.
* @function
* @param {Decoder} decoder The decoder instance
* @return {number} Unsigned 8-bit integer
*/
var readUint8 = (decoder) => decoder.arr[decoder.pos++];
/**
* Read unsigned integer (32bit) with variable length.
* 1/8th of the storage is used as encoding overhead.
*  * numbers < 2^7 is stored in one bytlength
*  * numbers < 2^14 is stored in two bylength
*
* @function
* @param {Decoder} decoder
* @return {number} An unsigned integer.length
*/
var readVarUint = (decoder) => {
	let num = 0;
	let mult = 1;
	const len = decoder.arr.length;
	while (decoder.pos < len) {
		const r = decoder.arr[decoder.pos++];
		num = num + (r & 127) * mult;
		mult *= 128;
		if (r < 128) return num;
		/* c8 ignore start */
		if (num > MAX_SAFE_INTEGER) throw errorIntegerOutOfRange;
	}
	throw errorUnexpectedEndOfArray;
};
/**
* Read signed integer (32bit) with variable length.
* 1/8th of the storage is used as encoding overhead.
*  * numbers < 2^7 is stored in one bytlength
*  * numbers < 2^14 is stored in two bylength
* @todo This should probably create the inverse ~num if number is negative - but this would be a breaking change.
*
* @function
* @param {Decoder} decoder
* @return {number} An unsigned integer.length
*/
var readVarInt = (decoder) => {
	let r = decoder.arr[decoder.pos++];
	let num = r & 63;
	let mult = 64;
	const sign = (r & 64) > 0 ? -1 : 1;
	if ((r & 128) === 0) return sign * num;
	const len = decoder.arr.length;
	while (decoder.pos < len) {
		r = decoder.arr[decoder.pos++];
		num = num + (r & 127) * mult;
		mult *= 128;
		if (r < 128) return sign * num;
		/* c8 ignore start */
		if (num > MAX_SAFE_INTEGER) throw errorIntegerOutOfRange;
	}
	throw errorUnexpectedEndOfArray;
};
/**
* We don't test this function anymore as we use native decoding/encoding by default now.
* Better not modify this anymore..
*
* Transforming utf8 to a string is pretty expensive. The code performs 10x better
* when String.fromCodePoint is fed with all characters as arguments.
* But most environments have a maximum number of arguments per functions.
* For effiency reasons we apply a maximum of 10000 characters at once.
*
* @function
* @param {Decoder} decoder
* @return {String} The read String.
*/
/* c8 ignore start */
var _readVarStringPolyfill = (decoder) => {
	let remainingLen = readVarUint(decoder);
	if (remainingLen === 0) return "";
	else {
		let encodedString = String.fromCodePoint(readUint8(decoder));
		if (--remainingLen < 100) while (remainingLen--) encodedString += String.fromCodePoint(readUint8(decoder));
		else while (remainingLen > 0) {
			const nextLen = remainingLen < 1e4 ? remainingLen : 1e4;
			const bytes = decoder.arr.subarray(decoder.pos, decoder.pos + nextLen);
			decoder.pos += nextLen;
			encodedString += String.fromCodePoint.apply(null, bytes);
			remainingLen -= nextLen;
		}
		return decodeURIComponent(escape(encodedString));
	}
};
/* c8 ignore stop */
/**
* @function
* @param {Decoder} decoder
* @return {String} The read String
*/
var _readVarStringNative = (decoder) => utf8TextDecoder.decode(readVarUint8Array(decoder));
/**
* Read string of variable length
* * varUint is used to store the length of the string
*
* @function
* @param {Decoder} decoder
* @return {String} The read String
*
*/
/* c8 ignore next */
var readVarString = utf8TextDecoder ? _readVarStringNative : _readVarStringPolyfill;
/**
* @param {Decoder} decoder
* @param {number} len
* @return {DataView}
*/
var readFromDataView = (decoder, len) => {
	const dv = new DataView(decoder.arr.buffer, decoder.arr.byteOffset + decoder.pos, len);
	decoder.pos += len;
	return dv;
};
/**
* @param {Decoder} decoder
*/
var readFloat32 = (decoder) => readFromDataView(decoder, 4).getFloat32(0, false);
/**
* @param {Decoder} decoder
*/
var readFloat64 = (decoder) => readFromDataView(decoder, 8).getFloat64(0, false);
/**
* @param {Decoder} decoder
*/
var readBigInt64 = (decoder) => readFromDataView(decoder, 8).getBigInt64(0, false);
/**
* @type {Array<function(Decoder):any>}
*/
var readAnyLookupTable = [
	(decoder) => void 0,
	(decoder) => null,
	readVarInt,
	readFloat32,
	readFloat64,
	readBigInt64,
	(decoder) => false,
	(decoder) => true,
	readVarString,
	(decoder) => {
		const len = readVarUint(decoder);
		/**
		* @type {Object<string,any>}
		*/
		const obj = {};
		for (let i = 0; i < len; i++) {
			const key = readVarString(decoder);
			obj[key] = readAny(decoder);
		}
		return obj;
	},
	(decoder) => {
		const len = readVarUint(decoder);
		const arr = [];
		for (let i = 0; i < len; i++) arr.push(readAny(decoder));
		return arr;
	},
	readVarUint8Array
];
/**
* @param {Decoder} decoder
*/
var readAny = (decoder) => readAnyLookupTable[127 - readUint8(decoder)](decoder);
/**
* T must not be null.
*
* @template T
*/
var RleDecoder = class extends Decoder {
	/**
	* @param {Uint8Array} uint8Array
	* @param {function(Decoder):T} reader
	*/
	constructor(uint8Array, reader) {
		super(uint8Array);
		/**
		* The reader
		*/
		this.reader = reader;
		/**
		* Current state
		* @type {T|null}
		*/
		this.s = null;
		this.count = 0;
	}
	read() {
		if (this.count === 0) {
			this.s = this.reader(this);
			if (hasContent(this)) this.count = readVarUint(this) + 1;
			else this.count = -1;
		}
		this.count--;
		return this.s;
	}
};
var UintOptRleDecoder = class extends Decoder {
	/**
	* @param {Uint8Array} uint8Array
	*/
	constructor(uint8Array) {
		super(uint8Array);
		/**
		* @type {number}
		*/
		this.s = 0;
		this.count = 0;
	}
	read() {
		if (this.count === 0) {
			this.s = readVarInt(this);
			const isNegative = isNegativeZero(this.s);
			this.count = 1;
			if (isNegative) {
				this.s = -this.s;
				this.count = readVarUint(this) + 2;
			}
		}
		this.count--;
		return this.s;
	}
};
var IntDiffOptRleDecoder = class extends Decoder {
	/**
	* @param {Uint8Array} uint8Array
	*/
	constructor(uint8Array) {
		super(uint8Array);
		/**
		* @type {number}
		*/
		this.s = 0;
		this.count = 0;
		this.diff = 0;
	}
	/**
	* @return {number}
	*/
	read() {
		if (this.count === 0) {
			const diff = readVarInt(this);
			const hasCount = diff & 1;
			this.diff = floor(diff / 2);
			this.count = 1;
			if (hasCount) this.count = readVarUint(this) + 2;
		}
		this.s += this.diff;
		this.count--;
		return this.s;
	}
};
var StringDecoder = class {
	/**
	* @param {Uint8Array} uint8Array
	*/
	constructor(uint8Array) {
		this.decoder = new UintOptRleDecoder(uint8Array);
		this.str = readVarString(this.decoder);
		/**
		* @type {number}
		*/
		this.spos = 0;
	}
	/**
	* @return {string}
	*/
	read() {
		const end = this.spos + this.decoder.read();
		const res = this.str.slice(this.spos, end);
		this.spos = end;
		return res;
	}
};
//#endregion
//#region node_modules/lib0/buffer.js
/**
* Utility functions to work with buffers (Uint8Array).
*
* @module buffer
*/
/**
* @param {number} len
*/
var createUint8ArrayFromLen = (len) => new Uint8Array(len);
/**
* Create Uint8Array with initial content from buffer
*
* @param {ArrayBuffer} buffer
* @param {number} byteOffset
* @param {number} length
*/
var createUint8ArrayViewFromArrayBuffer = (buffer, byteOffset, length) => new Uint8Array(buffer, byteOffset, length);
/**
* Create Uint8Array with initial content from buffer
*
* @param {ArrayBuffer} buffer
*/
var createUint8ArrayFromArrayBuffer = (buffer) => new Uint8Array(buffer);
/* c8 ignore start */
/**
* @param {Uint8Array} bytes
* @return {string}
*/
var toBase64Browser = (bytes) => {
	let s = "";
	for (let i = 0; i < bytes.byteLength; i++) s += fromCharCode(bytes[i]);
	return btoa(s);
};
/* c8 ignore stop */
/**
* @param {Uint8Array} bytes
* @return {string}
*/
var toBase64Node = (bytes) => Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString("base64");
/* c8 ignore start */
/**
* @param {string} s
* @return {Uint8Array<ArrayBuffer>}
*/
var fromBase64Browser = (s) => {
	const a = atob(s);
	const bytes = createUint8ArrayFromLen(a.length);
	for (let i = 0; i < a.length; i++) bytes[i] = a.charCodeAt(i);
	return bytes;
};
/* c8 ignore stop */
/**
* @param {string} s
*/
var fromBase64Node = (s) => {
	const buf = Buffer.from(s, "base64");
	return createUint8ArrayViewFromArrayBuffer(buf.buffer, buf.byteOffset, buf.byteLength);
};
/* c8 ignore next */
var toBase64 = isBrowser ? toBase64Browser : toBase64Node;
/* c8 ignore next */
var fromBase64 = isBrowser ? fromBase64Browser : fromBase64Node;
/**
* Copy the content of an Uint8Array view to a new ArrayBuffer.
*
* @param {Uint8Array} uint8Array
* @return {Uint8Array}
*/
var copyUint8Array = (uint8Array) => {
	const newBuf = createUint8ArrayFromLen(uint8Array.byteLength);
	newBuf.set(uint8Array);
	return newBuf;
};
//#endregion
//#region node_modules/lib0/broadcastchannel.js
/**
* Helpers for cross-tab communication using broadcastchannel with LocalStorage fallback.
*
* ```js
* // In browser window A:
* broadcastchannel.subscribe('my events', data => console.log(data))
* broadcastchannel.publish('my events', 'Hello world!') // => A: 'Hello world!' fires synchronously in same tab
*
* // In browser window B:
* broadcastchannel.publish('my events', 'hello from tab B') // => A: 'hello from tab B'
* ```
*
* @module broadcastchannel
*/
/**
* @typedef {Object} Channel
* @property {Set<function(any, any):any>} Channel.subs
* @property {any} Channel.bc
*/
/**
* @type {Map<string, Channel>}
*/
var channels = /* @__PURE__ */ new Map();
/* c8 ignore start */
var LocalStoragePolyfill = class {
	/**
	* @param {string} room
	*/
	constructor(room) {
		this.room = room;
		/**
		* @type {null|function({data:Uint8Array}):void}
		*/
		this.onmessage = null;
		/**
		* @param {any} e
		*/
		this._onChange = (e) => e.key === room && this.onmessage !== null && this.onmessage({ data: fromBase64(e.newValue || "") });
		onChange(this._onChange);
	}
	/**
	* @param {ArrayBuffer} buf
	*/
	postMessage(buf) {
		varStorage.setItem(this.room, toBase64(createUint8ArrayFromArrayBuffer(buf)));
	}
	close() {
		offChange(this._onChange);
	}
};
/* c8 ignore stop */
/* c8 ignore next */
var BC = typeof BroadcastChannel === "undefined" ? LocalStoragePolyfill : BroadcastChannel;
/**
* @param {string} room
* @return {Channel}
*/
var getChannel = (room) => setIfUndefined(channels, room, () => {
	const subs = create$3();
	const bc = new BC(room);
	/**
	* @param {{data:ArrayBuffer}} e
	*/
	/* c8 ignore next */
	bc.onmessage = (e) => subs.forEach((sub) => sub(e.data, "broadcastchannel"));
	return {
		bc,
		subs
	};
});
/**
* Subscribe to global `publish` events.
*
* @function
* @param {string} room
* @param {function(any, any):any} f
*/
var subscribe = (room, f) => {
	getChannel(room).subs.add(f);
	return f;
};
/**
* Unsubscribe from `publish` global events.
*
* @function
* @param {string} room
* @param {function(any, any):any} f
*/
var unsubscribe = (room, f) => {
	const channel = getChannel(room);
	const unsubscribed = channel.subs.delete(f);
	if (unsubscribed && channel.subs.size === 0) {
		channel.bc.close();
		channels.delete(room);
	}
	return unsubscribed;
};
/**
* Publish data to all subscribers (including subscribers on this tab)
*
* @function
* @param {string} room
* @param {any} data
* @param {any} [origin]
*/
var publish = (room, data, origin = null) => {
	const c = getChannel(room);
	c.bc.postMessage(data);
	c.subs.forEach((sub) => sub(data, origin));
};
//#endregion
//#region node_modules/lib0/observable.js
/**
* Observable class prototype.
*
* @module observable
*/
/**
* Handles named events.
* @experimental
*
* This is basically a (better typed) duplicate of Observable, which will replace Observable in the
* next release.
*
* @template {{[key in keyof EVENTS]: function(...any):void}} EVENTS
*/
var ObservableV2 = class {
	constructor() {
		/**
		* Some desc.
		* @type {Map<string, Set<any>>}
		*/
		this._observers = create$4();
	}
	/**
	* @template {keyof EVENTS & string} NAME
	* @param {NAME} name
	* @param {EVENTS[NAME]} f
	*/
	on(name, f) {
		setIfUndefined(this._observers, name, create$3).add(f);
		return f;
	}
	/**
	* @template {keyof EVENTS & string} NAME
	* @param {NAME} name
	* @param {EVENTS[NAME]} f
	*/
	once(name, f) {
		/**
		* @param  {...any} args
		*/
		const _f = (...args) => {
			this.off(name, _f);
			f(...args);
		};
		this.on(name, _f);
	}
	/**
	* @template {keyof EVENTS & string} NAME
	* @param {NAME} name
	* @param {EVENTS[NAME]} f
	*/
	off(name, f) {
		const observers = this._observers.get(name);
		if (observers !== void 0) {
			observers.delete(f);
			if (observers.size === 0) this._observers.delete(name);
		}
	}
	/**
	* Emit a named event. All registered event listeners that listen to the
	* specified name will receive the event.
	*
	* @todo This should catch exceptions
	*
	* @template {keyof EVENTS & string} NAME
	* @param {NAME} name The event name.
	* @param {Parameters<EVENTS[NAME]>} args The arguments that are applied to the event listener.
	*/
	emit(name, args) {
		return from((this._observers.get(name) || create$4()).values()).forEach((f) => f(...args));
	}
	destroy() {
		this._observers = create$4();
	}
};
/* c8 ignore start */
/**
* Handles named events.
*
* @deprecated
* @template N
*/
var Observable = class {
	constructor() {
		/**
		* Some desc.
		* @type {Map<N, any>}
		*/
		this._observers = create$4();
	}
	/**
	* @param {N} name
	* @param {function} f
	*/
	on(name, f) {
		setIfUndefined(this._observers, name, create$3).add(f);
	}
	/**
	* @param {N} name
	* @param {function} f
	*/
	once(name, f) {
		/**
		* @param  {...any} args
		*/
		const _f = (...args) => {
			this.off(name, _f);
			f(...args);
		};
		this.on(name, _f);
	}
	/**
	* @param {N} name
	* @param {function} f
	*/
	off(name, f) {
		const observers = this._observers.get(name);
		if (observers !== void 0) {
			observers.delete(f);
			if (observers.size === 0) this._observers.delete(name);
		}
	}
	/**
	* Emit a named event. All registered event listeners that listen to the
	* specified name will receive the event.
	*
	* @todo This should catch exceptions
	*
	* @param {N} name The event name.
	* @param {Array<any>} args The arguments that are applied to the event listener.
	*/
	emit(name, args) {
		return from((this._observers.get(name) || create$4()).values()).forEach((f) => f(...args));
	}
	destroy() {
		this._observers = create$4();
	}
};
/* c8 ignore end */
//#endregion
//#region node_modules/lib0/time.js
/**
* Return current unix time.
*
* @return {number}
*/
var getUnixTime = Date.now;
//#endregion
//#region node_modules/lib0/url.js
/**
* Utility module to work with urls.
*
* @module url
*/
/**
* @param {Object<string,string>} params
* @return {string}
*/
var encodeQueryParams = (params) => map(params, (val, key) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join("&");
webcrypto.subtle;
var getRandomValues = webcrypto.getRandomValues.bind(webcrypto);
//#endregion
//#region node_modules/lib0/random.js
var uint32 = () => getRandomValues(/* @__PURE__ */ new Uint32Array(1))[0];
var uuidv4Template = "10000000-1000-4000-8000-100000000000";
/**
* @return {string}
*/
var uuidv4 = () => uuidv4Template.replace(
	/[018]/g,
	/** @param {number} c */
	(c) => (c ^ uint32() & 15 >> c / 4).toString(16)
);
//#endregion
//#region node_modules/lib0/promise.js
/**
* @template T
* @callback PromiseResolve
* @param {T|PromiseLike<T>} [result]
*/
/**
* @template T
* @param {function(PromiseResolve<T>,function(Error):void):any} f
* @return {Promise<T>}
*/
var create$1 = (f) => new Promise(f);
Promise.all.bind(Promise);
//#endregion
//#region node_modules/lib0/symbol.js
/**
* Utility module to work with EcmaScript Symbols.
*
* @module symbol
*/
/**
* Return fresh symbol.
*/
var create = Symbol;
//#endregion
//#region node_modules/lib0/logging.common.js
var BOLD = create();
var UNBOLD = create();
var BLUE = create();
var GREY = create();
var GREEN = create();
var RED = create();
var PURPLE = create();
var ORANGE = create();
var UNCOLOR = create();
/* c8 ignore start */
/**
* @param {Array<undefined|string|Symbol|Object|number|function():any>} args
* @return {Array<string|object|number|undefined>}
*/
var computeNoColorLoggingArgs = (args) => {
	if (args.length === 1 && args[0]?.constructor === Function) args = args[0]();
	const strBuilder = [];
	const logArgs = [];
	let i = 0;
	for (; i < args.length; i++) {
		const arg = args[i];
		if (arg === void 0) break;
		else if (arg.constructor === String || arg.constructor === Number) strBuilder.push(arg);
		else if (arg.constructor === Object) break;
	}
	if (i > 0) logArgs.push(strBuilder.join(""));
	for (; i < args.length; i++) {
		const arg = args[i];
		if (!(arg instanceof Symbol)) logArgs.push(arg);
	}
	return logArgs;
};
getUnixTime();
/* c8 ignore stop */
//#endregion
//#region node_modules/lib0/logging.node.js
/**
* Isomorphic logging module with support for colors!
*
* @module logging
*/
var _nodeStyleMap = {
	[BOLD]: "\x1B[1m",
	[UNBOLD]: "\x1B[2m",
	[BLUE]: "\x1B[34m",
	[GREEN]: "\x1B[32m",
	[GREY]: "\x1B[37m",
	[RED]: "\x1B[31m",
	[PURPLE]: "\x1B[35m",
	[ORANGE]: "\x1B[38;5;208m",
	[UNCOLOR]: "\x1B[0m"
};
/* c8 ignore start */
/**
* @param {Array<string|undefined|Symbol|Object|number|function():Array<any>>} args
* @return {Array<string|object|number|undefined>}
*/
var computeNodeLoggingArgs = (args) => {
	if (args.length === 1 && args[0]?.constructor === Function) args = args[0]();
	const strBuilder = [];
	const logArgs = [];
	let i = 0;
	for (; i < args.length; i++) {
		const arg = args[i];
		const style = _nodeStyleMap[arg];
		if (style !== void 0) strBuilder.push(style);
		else if (arg === void 0) break;
		else if (arg.constructor === String || arg.constructor === Number) strBuilder.push(arg);
		else break;
	}
	if (i > 0) {
		strBuilder.push("\x1B[0m");
		logArgs.push(strBuilder.join(""));
	}
	for (; i < args.length; i++) {
		const arg = args[i];
		if (!(arg instanceof Symbol)) logArgs.push(arg);
	}
	return logArgs;
};
/* c8 ignore stop */
/* c8 ignore start */
var computeLoggingArgs = supportsColor ? computeNodeLoggingArgs : computeNoColorLoggingArgs;
/* c8 ignore stop */
/**
* @param {Array<string|Symbol|Object|number|undefined>} args
*/
var print = (...args) => {
	console.log(...computeLoggingArgs(args));
};
/* c8 ignore start */
/**
* @param {Array<string|Symbol|Object|number>} args
*/
var warn = (...args) => {
	console.warn(...computeLoggingArgs(args));
};
//#endregion
//#region node_modules/lib0/iterator.js
/**
* @template T
* @param {function():IteratorResult<T>} next
* @return {IterableIterator<T>}
*/
var createIterator = (next) => ({
	/**
	* @return {IterableIterator<T>}
	*/
	[Symbol.iterator]() {
		return this;
	},
	next
});
/**
* @template T
* @param {Iterator<T>} iterator
* @param {function(T):boolean} filter
*/
var iteratorFilter = (iterator, filter) => createIterator(() => {
	let res;
	do
		res = iterator.next();
	while (!res.done && !filter(res.value));
	return res;
});
/**
* @template T,M
* @param {Iterator<T>} iterator
* @param {function(T):M} fmap
*/
var iteratorMap = (iterator, fmap) => createIterator(() => {
	const { done, value } = iterator.next();
	return {
		done,
		value: done ? void 0 : fmap(value)
	};
});
//#endregion
export { equalityDeep as $, create$2 as A, writeAny as B, UintOptRleDecoder as C, readVarString as D, readUint8 as E, StringEncoder as F, writeVarUint8Array as G, writeUint8Array as H, UintOptRleEncoder as I, max as J, abs as K, createEncoder as L, unexpectedCase as M, IntDiffOptRleEncoder as N, readVarUint as O, RleEncoder as P, callAll as Q, length as R, StringDecoder as S, readAny as T, writeVarString as U, writeUint8 as V, writeVarUint as W, pow as X, min as Y, getVariable as Z, subscribe as _, BOLD as a, isEmpty as at, IntDiffOptRleDecoder as b, UNBOLD as c, last as ct, uuidv4 as d, copy as dt, id as et, encodeQueryParams as f, create$4 as ft, publish as g, ObservableV2 as h, warn as i, forEach as it, methodUnimplemented as j, readVarUint8Array as k, create$1 as l, create$3 as lt, Observable as m, iteratorMap as n, deepFreeze as nt, ORANGE as o, appendTo as ot, getUnixTime as p, setIfUndefined as pt, floor as q, print as r, equalFlat as rt, RED as s, from as st, iteratorFilter as t, assign as tt, uint32 as u, any as ut, unsubscribe as v, createDecoder as w, RleDecoder as x, copyUint8Array as y, toUint8Array as z };
