import { t as __commonJSMin } from "./node_modules/.vite/deps/rolldown-runtime-DC62tzP2.js";
//#region node_modules/react/cjs/react.production.js
/**
* @license React
* react.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
	var REACT_PORTAL_TYPE = Symbol.for("react.portal");
	var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
	var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
	var REACT_CONSUMER_TYPE = Symbol.for("react.consumer");
	var REACT_CONTEXT_TYPE = Symbol.for("react.context");
	var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
	var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
	var REACT_MEMO_TYPE = Symbol.for("react.memo");
	var REACT_LAZY_TYPE = Symbol.for("react.lazy");
	var REACT_ACTIVITY_TYPE = Symbol.for("react.activity");
	var REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition");
	var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
	function getIteratorFn(maybeIterable) {
		if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
		maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
		return "function" === typeof maybeIterable ? maybeIterable : null;
	}
	var ReactNoopUpdateQueue = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	};
	var assign = Object.assign;
	var emptyObject = {};
	function Component(props, context, updater) {
		this.props = props;
		this.context = context;
		this.refs = emptyObject;
		this.updater = updater || ReactNoopUpdateQueue;
	}
	Component.prototype.isReactComponent = {};
	Component.prototype.setState = function(partialState, callback) {
		if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, partialState, callback, "setState");
	};
	Component.prototype.forceUpdate = function(callback) {
		this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
	};
	function ComponentDummy() {}
	ComponentDummy.prototype = Component.prototype;
	function PureComponent(props, context, updater) {
		this.props = props;
		this.context = context;
		this.refs = emptyObject;
		this.updater = updater || ReactNoopUpdateQueue;
	}
	var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
	pureComponentPrototype.constructor = PureComponent;
	assign(pureComponentPrototype, Component.prototype);
	pureComponentPrototype.isPureReactComponent = !0;
	var isArrayImpl = Array.isArray;
	function noop() {}
	var ReactSharedInternals = {
		H: null,
		A: null,
		T: null,
		S: null
	};
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	function ReactElement(type, key, props) {
		var refProp = props.ref;
		return {
			$$typeof: REACT_ELEMENT_TYPE,
			type,
			key,
			ref: void 0 !== refProp ? refProp : null,
			props
		};
	}
	function cloneAndReplaceKey(oldElement, newKey) {
		return ReactElement(oldElement.type, newKey, oldElement.props);
	}
	function isValidElement(object) {
		return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
	}
	function escape(key) {
		var escaperLookup = {
			"=": "=0",
			":": "=2"
		};
		return "$" + key.replace(/[=:]/g, function(match) {
			return escaperLookup[match];
		});
	}
	var userProvidedKeyEscapeRegex = /\/+/g;
	function getElementKey(element, index) {
		return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
	}
	function resolveThenable(thenable) {
		switch (thenable.status) {
			case "fulfilled": return thenable.value;
			case "rejected": throw thenable.reason;
			default: switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(function(fulfilledValue) {
				"pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
			}, function(error) {
				"pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
			})), thenable.status) {
				case "fulfilled": return thenable.value;
				case "rejected": throw thenable.reason;
			}
		}
		throw thenable;
	}
	function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
		var type = typeof children;
		if ("undefined" === type || "boolean" === type) children = null;
		var invokeCallback = !1;
		if (null === children) invokeCallback = !0;
		else switch (type) {
			case "bigint":
			case "string":
			case "number":
				invokeCallback = !0;
				break;
			case "object": switch (children.$$typeof) {
				case REACT_ELEMENT_TYPE:
				case REACT_PORTAL_TYPE:
					invokeCallback = !0;
					break;
				case REACT_LAZY_TYPE: return invokeCallback = children._init, mapIntoArray(invokeCallback(children._payload), array, escapedPrefix, nameSoFar, callback);
			}
		}
		if (invokeCallback) return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
			return c;
		})) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(callback, escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(userProvidedKeyEscapeRegex, "$&/") + "/") + invokeCallback)), array.push(callback)), 1;
		invokeCallback = 0;
		var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
		if (isArrayImpl(children)) for (var i = 0; i < children.length; i++) nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if (i = getIteratorFn(children), "function" === typeof i) for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done;) nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if ("object" === type) {
			if ("function" === typeof children.then) return mapIntoArray(resolveThenable(children), array, escapedPrefix, nameSoFar, callback);
			array = String(children);
			throw Error("Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead.");
		}
		return invokeCallback;
	}
	function mapChildren(children, func, context) {
		if (null == children) return children;
		var result = [], count = 0;
		mapIntoArray(children, result, "", "", function(child) {
			return func.call(context, child, count++);
		});
		return result;
	}
	function lazyInitializer(payload) {
		if (-1 === payload._status) {
			var ctor = payload._result, thenable = ctor();
			thenable.then(function(moduleObject) {
				if (0 === payload._status || -1 === payload._status) payload._status = 1, payload._result = moduleObject, void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
			}, function(error) {
				if (0 === payload._status || -1 === payload._status) payload._status = 2, payload._result = error, void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
			});
			-1 === payload._status && (payload._status = 0, payload._result = thenable);
		}
		if (1 === payload._status) return payload._result.default;
		throw payload._result;
	}
	var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
		if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
			var event = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
				error
			});
			if (!window.dispatchEvent(event)) return;
		} else if ("object" === typeof process && "function" === typeof process.emit) {
			process.emit("uncaughtException", error);
			return;
		}
		console.error(error);
	};
	function startTransition(scope) {
		var prevTransition = ReactSharedInternals.T, currentTransition = {};
		currentTransition.types = null !== prevTransition ? prevTransition.types : null;
		ReactSharedInternals.T = currentTransition;
		try {
			var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
			null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
			"object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
		} catch (error) {
			reportGlobalError(error);
		} finally {
			null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
		}
	}
	function addTransitionType(type) {
		var transition = ReactSharedInternals.T;
		if (null !== transition) {
			var transitionTypes = transition.types;
			null === transitionTypes ? transition.types = [type] : -1 === transitionTypes.indexOf(type) && transitionTypes.push(type);
		} else startTransition(addTransitionType.bind(null, type));
	}
	var Children = {
		map: mapChildren,
		forEach: function(children, forEachFunc, forEachContext) {
			mapChildren(children, function() {
				forEachFunc.apply(this, arguments);
			}, forEachContext);
		},
		count: function(children) {
			var n = 0;
			mapChildren(children, function() {
				n++;
			});
			return n;
		},
		toArray: function(children) {
			return mapChildren(children, function(child) {
				return child;
			}) || [];
		},
		only: function(children) {
			if (!isValidElement(children)) throw Error("React.Children.only expected to receive a single React element child.");
			return children;
		}
	};
	exports.Activity = REACT_ACTIVITY_TYPE;
	exports.Children = Children;
	exports.Component = Component;
	exports.Fragment = REACT_FRAGMENT_TYPE;
	exports.Profiler = REACT_PROFILER_TYPE;
	exports.PureComponent = PureComponent;
	exports.StrictMode = REACT_STRICT_MODE_TYPE;
	exports.Suspense = REACT_SUSPENSE_TYPE;
	exports.ViewTransition = REACT_VIEW_TRANSITION_TYPE;
	exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
	exports.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(size) {
			return ReactSharedInternals.H.useMemoCache(size);
		}
	};
	exports.addTransitionType = addTransitionType;
	exports.cache = function(fn) {
		return function() {
			return fn.apply(null, arguments);
		};
	};
	exports.cacheSignal = function() {
		return null;
	};
	exports.cloneElement = function(element, config, children) {
		if (null === element || void 0 === element) throw Error("The argument must be a React element, but you passed " + element + ".");
		var props = assign({}, element.props), key = element.key;
		if (null != config) for (propName in void 0 !== config.key && (key = "" + config.key), config) !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
		var propName = arguments.length - 2;
		if (1 === propName) props.children = children;
		else if (1 < propName) {
			for (var childArray = Array(propName), i = 0; i < propName; i++) childArray[i] = arguments[i + 2];
			props.children = childArray;
		}
		return ReactElement(element.type, key, props);
	};
	exports.createContext = function(defaultValue) {
		defaultValue = {
			$$typeof: REACT_CONTEXT_TYPE,
			_currentValue: defaultValue,
			_currentValue2: defaultValue,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		};
		defaultValue.Provider = defaultValue;
		defaultValue.Consumer = {
			$$typeof: REACT_CONSUMER_TYPE,
			_context: defaultValue
		};
		return defaultValue;
	};
	exports.createElement = function(type, config, children) {
		var propName, props = {}, key = null;
		if (null != config) for (propName in void 0 !== config.key && (key = "" + config.key), config) hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
		var childrenLength = arguments.length - 2;
		if (1 === childrenLength) props.children = children;
		else if (1 < childrenLength) {
			for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++) childArray[i] = arguments[i + 2];
			props.children = childArray;
		}
		if (type && type.defaultProps) for (propName in childrenLength = type.defaultProps, childrenLength) void 0 === props[propName] && (props[propName] = childrenLength[propName]);
		return ReactElement(type, key, props);
	};
	exports.createRef = function() {
		return { current: null };
	};
	exports.forwardRef = function(render) {
		return {
			$$typeof: REACT_FORWARD_REF_TYPE,
			render
		};
	};
	exports.isValidElement = isValidElement;
	exports.lazy = function(ctor) {
		return {
			$$typeof: REACT_LAZY_TYPE,
			_payload: {
				_status: -1,
				_result: ctor
			},
			_init: lazyInitializer
		};
	};
	exports.memo = function(type, compare) {
		return {
			$$typeof: REACT_MEMO_TYPE,
			type,
			compare: void 0 === compare ? null : compare
		};
	};
	exports.startTransition = startTransition;
	exports.unstable_useCacheRefresh = function() {
		return ReactSharedInternals.H.useCacheRefresh();
	};
	exports.use = function(usable) {
		return ReactSharedInternals.H.use(usable);
	};
	exports.useActionState = function(action, initialState, permalink) {
		return ReactSharedInternals.H.useActionState(action, initialState, permalink);
	};
	exports.useCallback = function(callback, deps) {
		return ReactSharedInternals.H.useCallback(callback, deps);
	};
	exports.useContext = function(Context) {
		return ReactSharedInternals.H.useContext(Context);
	};
	exports.useDebugValue = function() {};
	exports.useDeferredValue = function(value, initialValue) {
		return ReactSharedInternals.H.useDeferredValue(value, initialValue);
	};
	exports.useEffect = function(create, deps) {
		return ReactSharedInternals.H.useEffect(create, deps);
	};
	exports.useEffectEvent = function(callback) {
		return ReactSharedInternals.H.useEffectEvent(callback);
	};
	exports.useId = function() {
		return ReactSharedInternals.H.useId();
	};
	exports.useImperativeHandle = function(ref, create, deps) {
		return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
	};
	exports.useInsertionEffect = function(create, deps) {
		return ReactSharedInternals.H.useInsertionEffect(create, deps);
	};
	exports.useLayoutEffect = function(create, deps) {
		return ReactSharedInternals.H.useLayoutEffect(create, deps);
	};
	exports.useMemo = function(create, deps) {
		return ReactSharedInternals.H.useMemo(create, deps);
	};
	exports.useOptimistic = function(passthrough, reducer) {
		return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
	};
	exports.useReducer = function(reducer, initialArg, init) {
		return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
	};
	exports.useRef = function(initialValue) {
		return ReactSharedInternals.H.useRef(initialValue);
	};
	exports.useState = function(initialState) {
		return ReactSharedInternals.H.useState(initialState);
	};
	exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
		return ReactSharedInternals.H.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
	};
	exports.useTransition = function() {
		return ReactSharedInternals.H.useTransition();
	};
	exports.version = "19.3.0";
}));
//#endregion
//#region node_modules/react/index.js
var require_react = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_production();
}));
//#endregion
export default require_react();
export { require_react as t };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3QuanMiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiLi4vLi4vcmVhY3QvY2pzL3JlYWN0LnByb2R1Y3Rpb24uanMiLCIuLi8uLi9yZWFjdC9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlIFJlYWN0XG4gKiByZWFjdC5wcm9kdWN0aW9uLmpzXG4gKlxuICogQ29weXJpZ2h0IChjKSBNZXRhIFBsYXRmb3JtcywgSW5jLiBhbmQgYWZmaWxpYXRlcy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcbnZhciBSRUFDVF9FTEVNRU5UX1RZUEUgPSBTeW1ib2wuZm9yKFwicmVhY3QudHJhbnNpdGlvbmFsLmVsZW1lbnRcIiksXG4gIFJFQUNUX1BPUlRBTF9UWVBFID0gU3ltYm9sLmZvcihcInJlYWN0LnBvcnRhbFwiKSxcbiAgUkVBQ1RfRlJBR01FTlRfVFlQRSA9IFN5bWJvbC5mb3IoXCJyZWFjdC5mcmFnbWVudFwiKSxcbiAgUkVBQ1RfU1RSSUNUX01PREVfVFlQRSA9IFN5bWJvbC5mb3IoXCJyZWFjdC5zdHJpY3RfbW9kZVwiKSxcbiAgUkVBQ1RfUFJPRklMRVJfVFlQRSA9IFN5bWJvbC5mb3IoXCJyZWFjdC5wcm9maWxlclwiKSxcbiAgUkVBQ1RfQ09OU1VNRVJfVFlQRSA9IFN5bWJvbC5mb3IoXCJyZWFjdC5jb25zdW1lclwiKSxcbiAgUkVBQ1RfQ09OVEVYVF9UWVBFID0gU3ltYm9sLmZvcihcInJlYWN0LmNvbnRleHRcIiksXG4gIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgPSBTeW1ib2wuZm9yKFwicmVhY3QuZm9yd2FyZF9yZWZcIiksXG4gIFJFQUNUX1NVU1BFTlNFX1RZUEUgPSBTeW1ib2wuZm9yKFwicmVhY3Quc3VzcGVuc2VcIiksXG4gIFJFQUNUX01FTU9fVFlQRSA9IFN5bWJvbC5mb3IoXCJyZWFjdC5tZW1vXCIpLFxuICBSRUFDVF9MQVpZX1RZUEUgPSBTeW1ib2wuZm9yKFwicmVhY3QubGF6eVwiKSxcbiAgUkVBQ1RfQUNUSVZJVFlfVFlQRSA9IFN5bWJvbC5mb3IoXCJyZWFjdC5hY3Rpdml0eVwiKSxcbiAgUkVBQ1RfVklFV19UUkFOU0lUSU9OX1RZUEUgPSBTeW1ib2wuZm9yKFwicmVhY3Qudmlld190cmFuc2l0aW9uXCIpLFxuICBNQVlCRV9JVEVSQVRPUl9TWU1CT0wgPSBTeW1ib2wuaXRlcmF0b3I7XG5mdW5jdGlvbiBnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpIHtcbiAgaWYgKG51bGwgPT09IG1heWJlSXRlcmFibGUgfHwgXCJvYmplY3RcIiAhPT0gdHlwZW9mIG1heWJlSXRlcmFibGUpIHJldHVybiBudWxsO1xuICBtYXliZUl0ZXJhYmxlID1cbiAgICAoTUFZQkVfSVRFUkFUT1JfU1lNQk9MICYmIG1heWJlSXRlcmFibGVbTUFZQkVfSVRFUkFUT1JfU1lNQk9MXSkgfHxcbiAgICBtYXliZUl0ZXJhYmxlW1wiQEBpdGVyYXRvclwiXTtcbiAgcmV0dXJuIFwiZnVuY3Rpb25cIiA9PT0gdHlwZW9mIG1heWJlSXRlcmFibGUgPyBtYXliZUl0ZXJhYmxlIDogbnVsbDtcbn1cbnZhciBSZWFjdE5vb3BVcGRhdGVRdWV1ZSA9IHtcbiAgICBpc01vdW50ZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAhMTtcbiAgICB9LFxuICAgIGVucXVldWVGb3JjZVVwZGF0ZTogZnVuY3Rpb24gKCkge30sXG4gICAgZW5xdWV1ZVJlcGxhY2VTdGF0ZTogZnVuY3Rpb24gKCkge30sXG4gICAgZW5xdWV1ZVNldFN0YXRlOiBmdW5jdGlvbiAoKSB7fVxuICB9LFxuICBhc3NpZ24gPSBPYmplY3QuYXNzaWduLFxuICBlbXB0eU9iamVjdCA9IHt9O1xuZnVuY3Rpb24gQ29tcG9uZW50KHByb3BzLCBjb250ZXh0LCB1cGRhdGVyKSB7XG4gIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgdGhpcy5yZWZzID0gZW1wdHlPYmplY3Q7XG4gIHRoaXMudXBkYXRlciA9IHVwZGF0ZXIgfHwgUmVhY3ROb29wVXBkYXRlUXVldWU7XG59XG5Db21wb25lbnQucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQgPSB7fTtcbkNvbXBvbmVudC5wcm90b3R5cGUuc2V0U3RhdGUgPSBmdW5jdGlvbiAocGFydGlhbFN0YXRlLCBjYWxsYmFjaykge1xuICBpZiAoXG4gICAgXCJvYmplY3RcIiAhPT0gdHlwZW9mIHBhcnRpYWxTdGF0ZSAmJlxuICAgIFwiZnVuY3Rpb25cIiAhPT0gdHlwZW9mIHBhcnRpYWxTdGF0ZSAmJlxuICAgIG51bGwgIT0gcGFydGlhbFN0YXRlXG4gIClcbiAgICB0aHJvdyBFcnJvcihcbiAgICAgIFwidGFrZXMgYW4gb2JqZWN0IG9mIHN0YXRlIHZhcmlhYmxlcyB0byB1cGRhdGUgb3IgYSBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGFuIG9iamVjdCBvZiBzdGF0ZSB2YXJpYWJsZXMuXCJcbiAgICApO1xuICB0aGlzLnVwZGF0ZXIuZW5xdWV1ZVNldFN0YXRlKHRoaXMsIHBhcnRpYWxTdGF0ZSwgY2FsbGJhY2ssIFwic2V0U3RhdGVcIik7XG59O1xuQ29tcG9uZW50LnByb3RvdHlwZS5mb3JjZVVwZGF0ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICB0aGlzLnVwZGF0ZXIuZW5xdWV1ZUZvcmNlVXBkYXRlKHRoaXMsIGNhbGxiYWNrLCBcImZvcmNlVXBkYXRlXCIpO1xufTtcbmZ1bmN0aW9uIENvbXBvbmVudER1bW15KCkge31cbkNvbXBvbmVudER1bW15LnByb3RvdHlwZSA9IENvbXBvbmVudC5wcm90b3R5cGU7XG5mdW5jdGlvbiBQdXJlQ29tcG9uZW50KHByb3BzLCBjb250ZXh0LCB1cGRhdGVyKSB7XG4gIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgdGhpcy5yZWZzID0gZW1wdHlPYmplY3Q7XG4gIHRoaXMudXBkYXRlciA9IHVwZGF0ZXIgfHwgUmVhY3ROb29wVXBkYXRlUXVldWU7XG59XG52YXIgcHVyZUNvbXBvbmVudFByb3RvdHlwZSA9IChQdXJlQ29tcG9uZW50LnByb3RvdHlwZSA9IG5ldyBDb21wb25lbnREdW1teSgpKTtcbnB1cmVDb21wb25lbnRQcm90b3R5cGUuY29uc3RydWN0b3IgPSBQdXJlQ29tcG9uZW50O1xuYXNzaWduKHB1cmVDb21wb25lbnRQcm90b3R5cGUsIENvbXBvbmVudC5wcm90b3R5cGUpO1xucHVyZUNvbXBvbmVudFByb3RvdHlwZS5pc1B1cmVSZWFjdENvbXBvbmVudCA9ICEwO1xudmFyIGlzQXJyYXlJbXBsID0gQXJyYXkuaXNBcnJheTtcbmZ1bmN0aW9uIG5vb3AoKSB7fVxudmFyIFJlYWN0U2hhcmVkSW50ZXJuYWxzID0geyBIOiBudWxsLCBBOiBudWxsLCBUOiBudWxsLCBTOiBudWxsIH0sXG4gIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbmZ1bmN0aW9uIFJlYWN0RWxlbWVudCh0eXBlLCBrZXksIHByb3BzKSB7XG4gIHZhciByZWZQcm9wID0gcHJvcHMucmVmO1xuICByZXR1cm4ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9FTEVNRU5UX1RZUEUsXG4gICAgdHlwZTogdHlwZSxcbiAgICBrZXk6IGtleSxcbiAgICByZWY6IHZvaWQgMCAhPT0gcmVmUHJvcCA/IHJlZlByb3AgOiBudWxsLFxuICAgIHByb3BzOiBwcm9wc1xuICB9O1xufVxuZnVuY3Rpb24gY2xvbmVBbmRSZXBsYWNlS2V5KG9sZEVsZW1lbnQsIG5ld0tleSkge1xuICByZXR1cm4gUmVhY3RFbGVtZW50KG9sZEVsZW1lbnQudHlwZSwgbmV3S2V5LCBvbGRFbGVtZW50LnByb3BzKTtcbn1cbmZ1bmN0aW9uIGlzVmFsaWRFbGVtZW50KG9iamVjdCkge1xuICByZXR1cm4gKFxuICAgIFwib2JqZWN0XCIgPT09IHR5cGVvZiBvYmplY3QgJiZcbiAgICBudWxsICE9PSBvYmplY3QgJiZcbiAgICBvYmplY3QuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRVxuICApO1xufVxuZnVuY3Rpb24gZXNjYXBlKGtleSkge1xuICB2YXIgZXNjYXBlckxvb2t1cCA9IHsgXCI9XCI6IFwiPTBcIiwgXCI6XCI6IFwiPTJcIiB9O1xuICByZXR1cm4gKFxuICAgIFwiJFwiICtcbiAgICBrZXkucmVwbGFjZSgvWz06XS9nLCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICAgIHJldHVybiBlc2NhcGVyTG9va3VwW21hdGNoXTtcbiAgICB9KVxuICApO1xufVxudmFyIHVzZXJQcm92aWRlZEtleUVzY2FwZVJlZ2V4ID0gL1xcLysvZztcbmZ1bmN0aW9uIGdldEVsZW1lbnRLZXkoZWxlbWVudCwgaW5kZXgpIHtcbiAgcmV0dXJuIFwib2JqZWN0XCIgPT09IHR5cGVvZiBlbGVtZW50ICYmIG51bGwgIT09IGVsZW1lbnQgJiYgbnVsbCAhPSBlbGVtZW50LmtleVxuICAgID8gZXNjYXBlKFwiXCIgKyBlbGVtZW50LmtleSlcbiAgICA6IGluZGV4LnRvU3RyaW5nKDM2KTtcbn1cbmZ1bmN0aW9uIHJlc29sdmVUaGVuYWJsZSh0aGVuYWJsZSkge1xuICBzd2l0Y2ggKHRoZW5hYmxlLnN0YXR1cykge1xuICAgIGNhc2UgXCJmdWxmaWxsZWRcIjpcbiAgICAgIHJldHVybiB0aGVuYWJsZS52YWx1ZTtcbiAgICBjYXNlIFwicmVqZWN0ZWRcIjpcbiAgICAgIHRocm93IHRoZW5hYmxlLnJlYXNvbjtcbiAgICBkZWZhdWx0OlxuICAgICAgc3dpdGNoIChcbiAgICAgICAgKFwic3RyaW5nXCIgPT09IHR5cGVvZiB0aGVuYWJsZS5zdGF0dXNcbiAgICAgICAgICA/IHRoZW5hYmxlLnRoZW4obm9vcCwgbm9vcClcbiAgICAgICAgICA6ICgodGhlbmFibGUuc3RhdHVzID0gXCJwZW5kaW5nXCIpLFxuICAgICAgICAgICAgdGhlbmFibGUudGhlbihcbiAgICAgICAgICAgICAgZnVuY3Rpb24gKGZ1bGZpbGxlZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgXCJwZW5kaW5nXCIgPT09IHRoZW5hYmxlLnN0YXR1cyAmJlxuICAgICAgICAgICAgICAgICAgKCh0aGVuYWJsZS5zdGF0dXMgPSBcImZ1bGZpbGxlZFwiKSxcbiAgICAgICAgICAgICAgICAgICh0aGVuYWJsZS52YWx1ZSA9IGZ1bGZpbGxlZFZhbHVlKSk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgIFwicGVuZGluZ1wiID09PSB0aGVuYWJsZS5zdGF0dXMgJiZcbiAgICAgICAgICAgICAgICAgICgodGhlbmFibGUuc3RhdHVzID0gXCJyZWplY3RlZFwiKSwgKHRoZW5hYmxlLnJlYXNvbiA9IGVycm9yKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICkpLFxuICAgICAgICB0aGVuYWJsZS5zdGF0dXMpXG4gICAgICApIHtcbiAgICAgICAgY2FzZSBcImZ1bGZpbGxlZFwiOlxuICAgICAgICAgIHJldHVybiB0aGVuYWJsZS52YWx1ZTtcbiAgICAgICAgY2FzZSBcInJlamVjdGVkXCI6XG4gICAgICAgICAgdGhyb3cgdGhlbmFibGUucmVhc29uO1xuICAgICAgfVxuICB9XG4gIHRocm93IHRoZW5hYmxlO1xufVxuZnVuY3Rpb24gbWFwSW50b0FycmF5KGNoaWxkcmVuLCBhcnJheSwgZXNjYXBlZFByZWZpeCwgbmFtZVNvRmFyLCBjYWxsYmFjaykge1xuICB2YXIgdHlwZSA9IHR5cGVvZiBjaGlsZHJlbjtcbiAgaWYgKFwidW5kZWZpbmVkXCIgPT09IHR5cGUgfHwgXCJib29sZWFuXCIgPT09IHR5cGUpIGNoaWxkcmVuID0gbnVsbDtcbiAgdmFyIGludm9rZUNhbGxiYWNrID0gITE7XG4gIGlmIChudWxsID09PSBjaGlsZHJlbikgaW52b2tlQ2FsbGJhY2sgPSAhMDtcbiAgZWxzZVxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBcImJpZ2ludFwiOlxuICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICBpbnZva2VDYWxsYmFjayA9ICEwO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgICAgc3dpdGNoIChjaGlsZHJlbi4kJHR5cGVvZikge1xuICAgICAgICAgIGNhc2UgUkVBQ1RfRUxFTUVOVF9UWVBFOlxuICAgICAgICAgIGNhc2UgUkVBQ1RfUE9SVEFMX1RZUEU6XG4gICAgICAgICAgICBpbnZva2VDYWxsYmFjayA9ICEwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBSRUFDVF9MQVpZX1RZUEU6XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAoaW52b2tlQ2FsbGJhY2sgPSBjaGlsZHJlbi5faW5pdCksXG4gICAgICAgICAgICAgIG1hcEludG9BcnJheShcbiAgICAgICAgICAgICAgICBpbnZva2VDYWxsYmFjayhjaGlsZHJlbi5fcGF5bG9hZCksXG4gICAgICAgICAgICAgICAgYXJyYXksXG4gICAgICAgICAgICAgICAgZXNjYXBlZFByZWZpeCxcbiAgICAgICAgICAgICAgICBuYW1lU29GYXIsXG4gICAgICAgICAgICAgICAgY2FsbGJhY2tcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbiAgaWYgKGludm9rZUNhbGxiYWNrKVxuICAgIHJldHVybiAoXG4gICAgICAoY2FsbGJhY2sgPSBjYWxsYmFjayhjaGlsZHJlbikpLFxuICAgICAgKGludm9rZUNhbGxiYWNrID1cbiAgICAgICAgXCJcIiA9PT0gbmFtZVNvRmFyID8gXCIuXCIgKyBnZXRFbGVtZW50S2V5KGNoaWxkcmVuLCAwKSA6IG5hbWVTb0ZhciksXG4gICAgICBpc0FycmF5SW1wbChjYWxsYmFjaylcbiAgICAgICAgPyAoKGVzY2FwZWRQcmVmaXggPSBcIlwiKSxcbiAgICAgICAgICBudWxsICE9IGludm9rZUNhbGxiYWNrICYmXG4gICAgICAgICAgICAoZXNjYXBlZFByZWZpeCA9XG4gICAgICAgICAgICAgIGludm9rZUNhbGxiYWNrLnJlcGxhY2UodXNlclByb3ZpZGVkS2V5RXNjYXBlUmVnZXgsIFwiJCYvXCIpICsgXCIvXCIpLFxuICAgICAgICAgIG1hcEludG9BcnJheShjYWxsYmFjaywgYXJyYXksIGVzY2FwZWRQcmVmaXgsIFwiXCIsIGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICByZXR1cm4gYztcbiAgICAgICAgICB9KSlcbiAgICAgICAgOiBudWxsICE9IGNhbGxiYWNrICYmXG4gICAgICAgICAgKGlzVmFsaWRFbGVtZW50KGNhbGxiYWNrKSAmJlxuICAgICAgICAgICAgKGNhbGxiYWNrID0gY2xvbmVBbmRSZXBsYWNlS2V5KFxuICAgICAgICAgICAgICBjYWxsYmFjayxcbiAgICAgICAgICAgICAgZXNjYXBlZFByZWZpeCArXG4gICAgICAgICAgICAgICAgKG51bGwgPT0gY2FsbGJhY2sua2V5IHx8XG4gICAgICAgICAgICAgICAgKGNoaWxkcmVuICYmIGNoaWxkcmVuLmtleSA9PT0gY2FsbGJhY2sua2V5KVxuICAgICAgICAgICAgICAgICAgPyBcIlwiXG4gICAgICAgICAgICAgICAgICA6IChcIlwiICsgY2FsbGJhY2sua2V5KS5yZXBsYWNlKFxuICAgICAgICAgICAgICAgICAgICAgIHVzZXJQcm92aWRlZEtleUVzY2FwZVJlZ2V4LFxuICAgICAgICAgICAgICAgICAgICAgIFwiJCYvXCJcbiAgICAgICAgICAgICAgICAgICAgKSArIFwiL1wiKSArXG4gICAgICAgICAgICAgICAgaW52b2tlQ2FsbGJhY2tcbiAgICAgICAgICAgICkpLFxuICAgICAgICAgIGFycmF5LnB1c2goY2FsbGJhY2spKSxcbiAgICAgIDFcbiAgICApO1xuICBpbnZva2VDYWxsYmFjayA9IDA7XG4gIHZhciBuZXh0TmFtZVByZWZpeCA9IFwiXCIgPT09IG5hbWVTb0ZhciA/IFwiLlwiIDogbmFtZVNvRmFyICsgXCI6XCI7XG4gIGlmIChpc0FycmF5SW1wbChjaGlsZHJlbikpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKylcbiAgICAgIChuYW1lU29GYXIgPSBjaGlsZHJlbltpXSksXG4gICAgICAgICh0eXBlID0gbmV4dE5hbWVQcmVmaXggKyBnZXRFbGVtZW50S2V5KG5hbWVTb0ZhciwgaSkpLFxuICAgICAgICAoaW52b2tlQ2FsbGJhY2sgKz0gbWFwSW50b0FycmF5KFxuICAgICAgICAgIG5hbWVTb0ZhcixcbiAgICAgICAgICBhcnJheSxcbiAgICAgICAgICBlc2NhcGVkUHJlZml4LFxuICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgY2FsbGJhY2tcbiAgICAgICAgKSk7XG4gIGVsc2UgaWYgKCgoaSA9IGdldEl0ZXJhdG9yRm4oY2hpbGRyZW4pKSwgXCJmdW5jdGlvblwiID09PSB0eXBlb2YgaSkpXG4gICAgZm9yIChcbiAgICAgIGNoaWxkcmVuID0gaS5jYWxsKGNoaWxkcmVuKSwgaSA9IDA7XG4gICAgICAhKG5hbWVTb0ZhciA9IGNoaWxkcmVuLm5leHQoKSkuZG9uZTtcblxuICAgIClcbiAgICAgIChuYW1lU29GYXIgPSBuYW1lU29GYXIudmFsdWUpLFxuICAgICAgICAodHlwZSA9IG5leHROYW1lUHJlZml4ICsgZ2V0RWxlbWVudEtleShuYW1lU29GYXIsIGkrKykpLFxuICAgICAgICAoaW52b2tlQ2FsbGJhY2sgKz0gbWFwSW50b0FycmF5KFxuICAgICAgICAgIG5hbWVTb0ZhcixcbiAgICAgICAgICBhcnJheSxcbiAgICAgICAgICBlc2NhcGVkUHJlZml4LFxuICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgY2FsbGJhY2tcbiAgICAgICAgKSk7XG4gIGVsc2UgaWYgKFwib2JqZWN0XCIgPT09IHR5cGUpIHtcbiAgICBpZiAoXCJmdW5jdGlvblwiID09PSB0eXBlb2YgY2hpbGRyZW4udGhlbilcbiAgICAgIHJldHVybiBtYXBJbnRvQXJyYXkoXG4gICAgICAgIHJlc29sdmVUaGVuYWJsZShjaGlsZHJlbiksXG4gICAgICAgIGFycmF5LFxuICAgICAgICBlc2NhcGVkUHJlZml4LFxuICAgICAgICBuYW1lU29GYXIsXG4gICAgICAgIGNhbGxiYWNrXG4gICAgICApO1xuICAgIGFycmF5ID0gU3RyaW5nKGNoaWxkcmVuKTtcbiAgICB0aHJvdyBFcnJvcihcbiAgICAgIFwiT2JqZWN0cyBhcmUgbm90IHZhbGlkIGFzIGEgUmVhY3QgY2hpbGQgKGZvdW5kOiBcIiArXG4gICAgICAgIChcIltvYmplY3QgT2JqZWN0XVwiID09PSBhcnJheVxuICAgICAgICAgID8gXCJvYmplY3Qgd2l0aCBrZXlzIHtcIiArIE9iamVjdC5rZXlzKGNoaWxkcmVuKS5qb2luKFwiLCBcIikgKyBcIn1cIlxuICAgICAgICAgIDogYXJyYXkpICtcbiAgICAgICAgXCIpLiBJZiB5b3UgbWVhbnQgdG8gcmVuZGVyIGEgY29sbGVjdGlvbiBvZiBjaGlsZHJlbiwgdXNlIGFuIGFycmF5IGluc3RlYWQuXCJcbiAgICApO1xuICB9XG4gIHJldHVybiBpbnZva2VDYWxsYmFjaztcbn1cbmZ1bmN0aW9uIG1hcENoaWxkcmVuKGNoaWxkcmVuLCBmdW5jLCBjb250ZXh0KSB7XG4gIGlmIChudWxsID09IGNoaWxkcmVuKSByZXR1cm4gY2hpbGRyZW47XG4gIHZhciByZXN1bHQgPSBbXSxcbiAgICBjb3VudCA9IDA7XG4gIG1hcEludG9BcnJheShjaGlsZHJlbiwgcmVzdWx0LCBcIlwiLCBcIlwiLCBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIGNoaWxkLCBjb3VudCsrKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBsYXp5SW5pdGlhbGl6ZXIocGF5bG9hZCkge1xuICBpZiAoLTEgPT09IHBheWxvYWQuX3N0YXR1cykge1xuICAgIHZhciBjdG9yID0gcGF5bG9hZC5fcmVzdWx0LFxuICAgICAgdGhlbmFibGUgPSBjdG9yKCk7XG4gICAgdGhlbmFibGUudGhlbihcbiAgICAgIGZ1bmN0aW9uIChtb2R1bGVPYmplY3QpIHtcbiAgICAgICAgaWYgKDAgPT09IHBheWxvYWQuX3N0YXR1cyB8fCAtMSA9PT0gcGF5bG9hZC5fc3RhdHVzKVxuICAgICAgICAgIChwYXlsb2FkLl9zdGF0dXMgPSAxKSxcbiAgICAgICAgICAgIChwYXlsb2FkLl9yZXN1bHQgPSBtb2R1bGVPYmplY3QpLFxuICAgICAgICAgICAgdm9pZCAwID09PSB0aGVuYWJsZS5zdGF0dXMgJiZcbiAgICAgICAgICAgICAgKCh0aGVuYWJsZS5zdGF0dXMgPSBcImZ1bGZpbGxlZFwiKSxcbiAgICAgICAgICAgICAgKHRoZW5hYmxlLnZhbHVlID0gbW9kdWxlT2JqZWN0KSk7XG4gICAgICB9LFxuICAgICAgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGlmICgwID09PSBwYXlsb2FkLl9zdGF0dXMgfHwgLTEgPT09IHBheWxvYWQuX3N0YXR1cylcbiAgICAgICAgICAocGF5bG9hZC5fc3RhdHVzID0gMiksXG4gICAgICAgICAgICAocGF5bG9hZC5fcmVzdWx0ID0gZXJyb3IpLFxuICAgICAgICAgICAgdm9pZCAwID09PSB0aGVuYWJsZS5zdGF0dXMgJiZcbiAgICAgICAgICAgICAgKCh0aGVuYWJsZS5zdGF0dXMgPSBcInJlamVjdGVkXCIpLCAodGhlbmFibGUucmVhc29uID0gZXJyb3IpKTtcbiAgICAgIH1cbiAgICApO1xuICAgIC0xID09PSBwYXlsb2FkLl9zdGF0dXMgJiZcbiAgICAgICgocGF5bG9hZC5fc3RhdHVzID0gMCksIChwYXlsb2FkLl9yZXN1bHQgPSB0aGVuYWJsZSkpO1xuICB9XG4gIGlmICgxID09PSBwYXlsb2FkLl9zdGF0dXMpIHJldHVybiBwYXlsb2FkLl9yZXN1bHQuZGVmYXVsdDtcbiAgdGhyb3cgcGF5bG9hZC5fcmVzdWx0O1xufVxudmFyIHJlcG9ydEdsb2JhbEVycm9yID1cbiAgXCJmdW5jdGlvblwiID09PSB0eXBlb2YgcmVwb3J0RXJyb3JcbiAgICA/IHJlcG9ydEVycm9yXG4gICAgOiBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIFwib2JqZWN0XCIgPT09IHR5cGVvZiB3aW5kb3cgJiZcbiAgICAgICAgICBcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiB3aW5kb3cuRXJyb3JFdmVudFxuICAgICAgICApIHtcbiAgICAgICAgICB2YXIgZXZlbnQgPSBuZXcgd2luZG93LkVycm9yRXZlbnQoXCJlcnJvclwiLCB7XG4gICAgICAgICAgICBidWJibGVzOiAhMCxcbiAgICAgICAgICAgIGNhbmNlbGFibGU6ICEwLFxuICAgICAgICAgICAgbWVzc2FnZTpcbiAgICAgICAgICAgICAgXCJvYmplY3RcIiA9PT0gdHlwZW9mIGVycm9yICYmXG4gICAgICAgICAgICAgIG51bGwgIT09IGVycm9yICYmXG4gICAgICAgICAgICAgIFwic3RyaW5nXCIgPT09IHR5cGVvZiBlcnJvci5tZXNzYWdlXG4gICAgICAgICAgICAgICAgPyBTdHJpbmcoZXJyb3IubWVzc2FnZSlcbiAgICAgICAgICAgICAgICA6IFN0cmluZyhlcnJvciksXG4gICAgICAgICAgICBlcnJvcjogZXJyb3JcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoIXdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2ZW50KSkgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIFwib2JqZWN0XCIgPT09IHR5cGVvZiBwcm9jZXNzICYmXG4gICAgICAgICAgXCJmdW5jdGlvblwiID09PSB0eXBlb2YgcHJvY2Vzcy5lbWl0XG4gICAgICAgICkge1xuICAgICAgICAgIHByb2Nlc3MuZW1pdChcInVuY2F1Z2h0RXhjZXB0aW9uXCIsIGVycm9yKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICB9O1xuZnVuY3Rpb24gc3RhcnRUcmFuc2l0aW9uKHNjb3BlKSB7XG4gIHZhciBwcmV2VHJhbnNpdGlvbiA9IFJlYWN0U2hhcmVkSW50ZXJuYWxzLlQsXG4gICAgY3VycmVudFRyYW5zaXRpb24gPSB7fTtcbiAgY3VycmVudFRyYW5zaXRpb24udHlwZXMgPVxuICAgIG51bGwgIT09IHByZXZUcmFuc2l0aW9uID8gcHJldlRyYW5zaXRpb24udHlwZXMgOiBudWxsO1xuICBSZWFjdFNoYXJlZEludGVybmFscy5UID0gY3VycmVudFRyYW5zaXRpb247XG4gIHRyeSB7XG4gICAgdmFyIHJldHVyblZhbHVlID0gc2NvcGUoKSxcbiAgICAgIG9uU3RhcnRUcmFuc2l0aW9uRmluaXNoID0gUmVhY3RTaGFyZWRJbnRlcm5hbHMuUztcbiAgICBudWxsICE9PSBvblN0YXJ0VHJhbnNpdGlvbkZpbmlzaCAmJlxuICAgICAgb25TdGFydFRyYW5zaXRpb25GaW5pc2goY3VycmVudFRyYW5zaXRpb24sIHJldHVyblZhbHVlKTtcbiAgICBcIm9iamVjdFwiID09PSB0eXBlb2YgcmV0dXJuVmFsdWUgJiZcbiAgICAgIG51bGwgIT09IHJldHVyblZhbHVlICYmXG4gICAgICBcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiByZXR1cm5WYWx1ZS50aGVuICYmXG4gICAgICByZXR1cm5WYWx1ZS50aGVuKG5vb3AsIHJlcG9ydEdsb2JhbEVycm9yKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXBvcnRHbG9iYWxFcnJvcihlcnJvcik7XG4gIH0gZmluYWxseSB7XG4gICAgbnVsbCAhPT0gcHJldlRyYW5zaXRpb24gJiZcbiAgICAgIG51bGwgIT09IGN1cnJlbnRUcmFuc2l0aW9uLnR5cGVzICYmXG4gICAgICAocHJldlRyYW5zaXRpb24udHlwZXMgPSBjdXJyZW50VHJhbnNpdGlvbi50eXBlcyksXG4gICAgICAoUmVhY3RTaGFyZWRJbnRlcm5hbHMuVCA9IHByZXZUcmFuc2l0aW9uKTtcbiAgfVxufVxuZnVuY3Rpb24gYWRkVHJhbnNpdGlvblR5cGUodHlwZSkge1xuICB2YXIgdHJhbnNpdGlvbiA9IFJlYWN0U2hhcmVkSW50ZXJuYWxzLlQ7XG4gIGlmIChudWxsICE9PSB0cmFuc2l0aW9uKSB7XG4gICAgdmFyIHRyYW5zaXRpb25UeXBlcyA9IHRyYW5zaXRpb24udHlwZXM7XG4gICAgbnVsbCA9PT0gdHJhbnNpdGlvblR5cGVzXG4gICAgICA/ICh0cmFuc2l0aW9uLnR5cGVzID0gW3R5cGVdKVxuICAgICAgOiAtMSA9PT0gdHJhbnNpdGlvblR5cGVzLmluZGV4T2YodHlwZSkgJiYgdHJhbnNpdGlvblR5cGVzLnB1c2godHlwZSk7XG4gIH0gZWxzZSBzdGFydFRyYW5zaXRpb24oYWRkVHJhbnNpdGlvblR5cGUuYmluZChudWxsLCB0eXBlKSk7XG59XG52YXIgQ2hpbGRyZW4gPSB7XG4gIG1hcDogbWFwQ2hpbGRyZW4sXG4gIGZvckVhY2g6IGZ1bmN0aW9uIChjaGlsZHJlbiwgZm9yRWFjaEZ1bmMsIGZvckVhY2hDb250ZXh0KSB7XG4gICAgbWFwQ2hpbGRyZW4oXG4gICAgICBjaGlsZHJlbixcbiAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yRWFjaEZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH0sXG4gICAgICBmb3JFYWNoQ29udGV4dFxuICAgICk7XG4gIH0sXG4gIGNvdW50OiBmdW5jdGlvbiAoY2hpbGRyZW4pIHtcbiAgICB2YXIgbiA9IDA7XG4gICAgbWFwQ2hpbGRyZW4oY2hpbGRyZW4sIGZ1bmN0aW9uICgpIHtcbiAgICAgIG4rKztcbiAgICB9KTtcbiAgICByZXR1cm4gbjtcbiAgfSxcbiAgdG9BcnJheTogZnVuY3Rpb24gKGNoaWxkcmVuKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIG1hcENoaWxkcmVuKGNoaWxkcmVuLCBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgICAgfSkgfHwgW11cbiAgICApO1xuICB9LFxuICBvbmx5OiBmdW5jdGlvbiAoY2hpbGRyZW4pIHtcbiAgICBpZiAoIWlzVmFsaWRFbGVtZW50KGNoaWxkcmVuKSlcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICBcIlJlYWN0LkNoaWxkcmVuLm9ubHkgZXhwZWN0ZWQgdG8gcmVjZWl2ZSBhIHNpbmdsZSBSZWFjdCBlbGVtZW50IGNoaWxkLlwiXG4gICAgICApO1xuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxufTtcbmV4cG9ydHMuQWN0aXZpdHkgPSBSRUFDVF9BQ1RJVklUWV9UWVBFO1xuZXhwb3J0cy5DaGlsZHJlbiA9IENoaWxkcmVuO1xuZXhwb3J0cy5Db21wb25lbnQgPSBDb21wb25lbnQ7XG5leHBvcnRzLkZyYWdtZW50ID0gUkVBQ1RfRlJBR01FTlRfVFlQRTtcbmV4cG9ydHMuUHJvZmlsZXIgPSBSRUFDVF9QUk9GSUxFUl9UWVBFO1xuZXhwb3J0cy5QdXJlQ29tcG9uZW50ID0gUHVyZUNvbXBvbmVudDtcbmV4cG9ydHMuU3RyaWN0TW9kZSA9IFJFQUNUX1NUUklDVF9NT0RFX1RZUEU7XG5leHBvcnRzLlN1c3BlbnNlID0gUkVBQ1RfU1VTUEVOU0VfVFlQRTtcbmV4cG9ydHMuVmlld1RyYW5zaXRpb24gPSBSRUFDVF9WSUVXX1RSQU5TSVRJT05fVFlQRTtcbmV4cG9ydHMuX19DTElFTlRfSU5URVJOQUxTX0RPX05PVF9VU0VfT1JfV0FSTl9VU0VSU19USEVZX0NBTk5PVF9VUEdSQURFID1cbiAgUmVhY3RTaGFyZWRJbnRlcm5hbHM7XG5leHBvcnRzLl9fQ09NUElMRVJfUlVOVElNRSA9IHtcbiAgX19wcm90b19fOiBudWxsLFxuICBjOiBmdW5jdGlvbiAoc2l6ZSkge1xuICAgIHJldHVybiBSZWFjdFNoYXJlZEludGVybmFscy5ILnVzZU1lbW9DYWNoZShzaXplKTtcbiAgfVxufTtcbmV4cG9ydHMuYWRkVHJhbnNpdGlvblR5cGUgPSBhZGRUcmFuc2l0aW9uVHlwZTtcbmV4cG9ydHMuY2FjaGUgPSBmdW5jdGlvbiAoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZm4uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG5leHBvcnRzLmNhY2hlU2lnbmFsID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gbnVsbDtcbn07XG5leHBvcnRzLmNsb25lRWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtZW50LCBjb25maWcsIGNoaWxkcmVuKSB7XG4gIGlmIChudWxsID09PSBlbGVtZW50IHx8IHZvaWQgMCA9PT0gZWxlbWVudClcbiAgICB0aHJvdyBFcnJvcihcbiAgICAgIFwiVGhlIGFyZ3VtZW50IG11c3QgYmUgYSBSZWFjdCBlbGVtZW50LCBidXQgeW91IHBhc3NlZCBcIiArIGVsZW1lbnQgKyBcIi5cIlxuICAgICk7XG4gIHZhciBwcm9wcyA9IGFzc2lnbih7fSwgZWxlbWVudC5wcm9wcyksXG4gICAga2V5ID0gZWxlbWVudC5rZXk7XG4gIGlmIChudWxsICE9IGNvbmZpZylcbiAgICBmb3IgKHByb3BOYW1lIGluICh2b2lkIDAgIT09IGNvbmZpZy5rZXkgJiYgKGtleSA9IFwiXCIgKyBjb25maWcua2V5KSwgY29uZmlnKSlcbiAgICAgICFoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgcHJvcE5hbWUpIHx8XG4gICAgICAgIFwia2V5XCIgPT09IHByb3BOYW1lIHx8XG4gICAgICAgIFwiX19zZWxmXCIgPT09IHByb3BOYW1lIHx8XG4gICAgICAgIFwiX19zb3VyY2VcIiA9PT0gcHJvcE5hbWUgfHxcbiAgICAgICAgKFwicmVmXCIgPT09IHByb3BOYW1lICYmIHZvaWQgMCA9PT0gY29uZmlnLnJlZikgfHxcbiAgICAgICAgKHByb3BzW3Byb3BOYW1lXSA9IGNvbmZpZ1twcm9wTmFtZV0pO1xuICB2YXIgcHJvcE5hbWUgPSBhcmd1bWVudHMubGVuZ3RoIC0gMjtcbiAgaWYgKDEgPT09IHByb3BOYW1lKSBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICBlbHNlIGlmICgxIDwgcHJvcE5hbWUpIHtcbiAgICBmb3IgKHZhciBjaGlsZEFycmF5ID0gQXJyYXkocHJvcE5hbWUpLCBpID0gMDsgaSA8IHByb3BOYW1lOyBpKyspXG4gICAgICBjaGlsZEFycmF5W2ldID0gYXJndW1lbnRzW2kgKyAyXTtcbiAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkQXJyYXk7XG4gIH1cbiAgcmV0dXJuIFJlYWN0RWxlbWVudChlbGVtZW50LnR5cGUsIGtleSwgcHJvcHMpO1xufTtcbmV4cG9ydHMuY3JlYXRlQ29udGV4dCA9IGZ1bmN0aW9uIChkZWZhdWx0VmFsdWUpIHtcbiAgZGVmYXVsdFZhbHVlID0ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9DT05URVhUX1RZUEUsXG4gICAgX2N1cnJlbnRWYWx1ZTogZGVmYXVsdFZhbHVlLFxuICAgIF9jdXJyZW50VmFsdWUyOiBkZWZhdWx0VmFsdWUsXG4gICAgX3RocmVhZENvdW50OiAwLFxuICAgIFByb3ZpZGVyOiBudWxsLFxuICAgIENvbnN1bWVyOiBudWxsXG4gIH07XG4gIGRlZmF1bHRWYWx1ZS5Qcm92aWRlciA9IGRlZmF1bHRWYWx1ZTtcbiAgZGVmYXVsdFZhbHVlLkNvbnN1bWVyID0ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9DT05TVU1FUl9UWVBFLFxuICAgIF9jb250ZXh0OiBkZWZhdWx0VmFsdWVcbiAgfTtcbiAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbn07XG5leHBvcnRzLmNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAodHlwZSwgY29uZmlnLCBjaGlsZHJlbikge1xuICB2YXIgcHJvcE5hbWUsXG4gICAgcHJvcHMgPSB7fSxcbiAgICBrZXkgPSBudWxsO1xuICBpZiAobnVsbCAhPSBjb25maWcpXG4gICAgZm9yIChwcm9wTmFtZSBpbiAodm9pZCAwICE9PSBjb25maWcua2V5ICYmIChrZXkgPSBcIlwiICsgY29uZmlnLmtleSksIGNvbmZpZykpXG4gICAgICBoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgcHJvcE5hbWUpICYmXG4gICAgICAgIFwia2V5XCIgIT09IHByb3BOYW1lICYmXG4gICAgICAgIFwiX19zZWxmXCIgIT09IHByb3BOYW1lICYmXG4gICAgICAgIFwiX19zb3VyY2VcIiAhPT0gcHJvcE5hbWUgJiZcbiAgICAgICAgKHByb3BzW3Byb3BOYW1lXSA9IGNvbmZpZ1twcm9wTmFtZV0pO1xuICB2YXIgY2hpbGRyZW5MZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoIC0gMjtcbiAgaWYgKDEgPT09IGNoaWxkcmVuTGVuZ3RoKSBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICBlbHNlIGlmICgxIDwgY2hpbGRyZW5MZW5ndGgpIHtcbiAgICBmb3IgKHZhciBjaGlsZEFycmF5ID0gQXJyYXkoY2hpbGRyZW5MZW5ndGgpLCBpID0gMDsgaSA8IGNoaWxkcmVuTGVuZ3RoOyBpKyspXG4gICAgICBjaGlsZEFycmF5W2ldID0gYXJndW1lbnRzW2kgKyAyXTtcbiAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkQXJyYXk7XG4gIH1cbiAgaWYgKHR5cGUgJiYgdHlwZS5kZWZhdWx0UHJvcHMpXG4gICAgZm9yIChwcm9wTmFtZSBpbiAoKGNoaWxkcmVuTGVuZ3RoID0gdHlwZS5kZWZhdWx0UHJvcHMpLCBjaGlsZHJlbkxlbmd0aCkpXG4gICAgICB2b2lkIDAgPT09IHByb3BzW3Byb3BOYW1lXSAmJlxuICAgICAgICAocHJvcHNbcHJvcE5hbWVdID0gY2hpbGRyZW5MZW5ndGhbcHJvcE5hbWVdKTtcbiAgcmV0dXJuIFJlYWN0RWxlbWVudCh0eXBlLCBrZXksIHByb3BzKTtcbn07XG5leHBvcnRzLmNyZWF0ZVJlZiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHsgY3VycmVudDogbnVsbCB9O1xufTtcbmV4cG9ydHMuZm9yd2FyZFJlZiA9IGZ1bmN0aW9uIChyZW5kZXIpIHtcbiAgcmV0dXJuIHsgJCR0eXBlb2Y6IFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUsIHJlbmRlcjogcmVuZGVyIH07XG59O1xuZXhwb3J0cy5pc1ZhbGlkRWxlbWVudCA9IGlzVmFsaWRFbGVtZW50O1xuZXhwb3J0cy5sYXp5ID0gZnVuY3Rpb24gKGN0b3IpIHtcbiAgcmV0dXJuIHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfTEFaWV9UWVBFLFxuICAgIF9wYXlsb2FkOiB7IF9zdGF0dXM6IC0xLCBfcmVzdWx0OiBjdG9yIH0sXG4gICAgX2luaXQ6IGxhenlJbml0aWFsaXplclxuICB9O1xufTtcbmV4cG9ydHMubWVtbyA9IGZ1bmN0aW9uICh0eXBlLCBjb21wYXJlKSB7XG4gIHJldHVybiB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX01FTU9fVFlQRSxcbiAgICB0eXBlOiB0eXBlLFxuICAgIGNvbXBhcmU6IHZvaWQgMCA9PT0gY29tcGFyZSA/IG51bGwgOiBjb21wYXJlXG4gIH07XG59O1xuZXhwb3J0cy5zdGFydFRyYW5zaXRpb24gPSBzdGFydFRyYW5zaXRpb247XG5leHBvcnRzLnVuc3RhYmxlX3VzZUNhY2hlUmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIFJlYWN0U2hhcmVkSW50ZXJuYWxzLkgudXNlQ2FjaGVSZWZyZXNoKCk7XG59O1xuZXhwb3J0cy51c2UgPSBmdW5jdGlvbiAodXNhYmxlKSB7XG4gIHJldHVybiBSZWFjdFNoYXJlZEludGVybmFscy5ILnVzZSh1c2FibGUpO1xufTtcbmV4cG9ydHMudXNlQWN0aW9uU3RhdGUgPSBmdW5jdGlvbiAoYWN0aW9uLCBpbml0aWFsU3RhdGUsIHBlcm1hbGluaykge1xuICByZXR1cm4gUmVhY3RTaGFyZWRJbnRlcm5hbHMuSC51c2VBY3Rpb25TdGF0ZShhY3Rpb24sIGluaXRpYWxTdGF0ZSwgcGVybWFsaW5rKTtcbn07XG5leHBvcnRzLnVzZUNhbGxiYWNrID0gZnVuY3Rpb24gKGNhbGxiYWNrLCBkZXBzKSB7XG4gIHJldHVybiBSZWFjdFNoYXJlZEludGVybmFscy5ILnVzZUNhbGxiYWNrKGNhbGxiYWNrLCBkZXBzKTtcbn07XG5leHBvcnRzLnVzZUNvbnRleHQgPSBmdW5jdGlvbiAoQ29udGV4dCkge1xuICByZXR1cm4gUmVhY3RTaGFyZWRJbnRlcm5hbHMuSC51c2VDb250ZXh0KENvbnRleHQpO1xufTtcbmV4cG9ydHMudXNlRGVidWdWYWx1ZSA9IGZ1bmN0aW9uICgpIHt9O1xuZXhwb3J0cy51c2VEZWZlcnJlZFZhbHVlID0gZnVuY3Rpb24gKHZhbHVlLCBpbml0aWFsVmFsdWUpIHtcbiAgcmV0dXJuIFJlYWN0U2hhcmVkSW50ZXJuYWxzLkgudXNlRGVmZXJyZWRWYWx1ZSh2YWx1ZSwgaW5pdGlhbFZhbHVlKTtcbn07XG5leHBvcnRzLnVzZUVmZmVjdCA9IGZ1bmN0aW9uIChjcmVhdGUsIGRlcHMpIHtcbiAgcmV0dXJuIFJlYWN0U2hhcmVkSW50ZXJuYWxzLkgudXNlRWZmZWN0KGNyZWF0ZSwgZGVwcyk7XG59O1xuZXhwb3J0cy51c2VFZmZlY3RFdmVudCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICByZXR1cm4gUmVhY3RTaGFyZWRJbnRlcm5hbHMuSC51c2VFZmZlY3RFdmVudChjYWxsYmFjayk7XG59O1xuZXhwb3J0cy51c2VJZCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIFJlYWN0U2hhcmVkSW50ZXJuYWxzLkgudXNlSWQoKTtcbn07XG5leHBvcnRzLnVzZUltcGVyYXRpdmVIYW5kbGUgPSBmdW5jdGlvbiAocmVmLCBjcmVhdGUsIGRlcHMpIHtcbiAgcmV0dXJuIFJlYWN0U2hhcmVkSW50ZXJuYWxzLkgudXNlSW1wZXJhdGl2ZUhhbmRsZShyZWYsIGNyZWF0ZSwgZGVwcyk7XG59O1xuZXhwb3J0cy51c2VJbnNlcnRpb25FZmZlY3QgPSBmdW5jdGlvbiAoY3JlYXRlLCBkZXBzKSB7XG4gIHJldHVybiBSZWFjdFNoYXJlZEludGVybmFscy5ILnVzZUluc2VydGlvbkVmZmVjdChjcmVhdGUsIGRlcHMpO1xufTtcbmV4cG9ydHMudXNlTGF5b3V0RWZmZWN0ID0gZnVuY3Rpb24gKGNyZWF0ZSwgZGVwcykge1xuICByZXR1cm4gUmVhY3RTaGFyZWRJbnRlcm5hbHMuSC51c2VMYXlvdXRFZmZlY3QoY3JlYXRlLCBkZXBzKTtcbn07XG5leHBvcnRzLnVzZU1lbW8gPSBmdW5jdGlvbiAoY3JlYXRlLCBkZXBzKSB7XG4gIHJldHVybiBSZWFjdFNoYXJlZEludGVybmFscy5ILnVzZU1lbW8oY3JlYXRlLCBkZXBzKTtcbn07XG5leHBvcnRzLnVzZU9wdGltaXN0aWMgPSBmdW5jdGlvbiAocGFzc3Rocm91Z2gsIHJlZHVjZXIpIHtcbiAgcmV0dXJuIFJlYWN0U2hhcmVkSW50ZXJuYWxzLkgudXNlT3B0aW1pc3RpYyhwYXNzdGhyb3VnaCwgcmVkdWNlcik7XG59O1xuZXhwb3J0cy51c2VSZWR1Y2VyID0gZnVuY3Rpb24gKHJlZHVjZXIsIGluaXRpYWxBcmcsIGluaXQpIHtcbiAgcmV0dXJuIFJlYWN0U2hhcmVkSW50ZXJuYWxzLkgudXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0aWFsQXJnLCBpbml0KTtcbn07XG5leHBvcnRzLnVzZVJlZiA9IGZ1bmN0aW9uIChpbml0aWFsVmFsdWUpIHtcbiAgcmV0dXJuIFJlYWN0U2hhcmVkSW50ZXJuYWxzLkgudXNlUmVmKGluaXRpYWxWYWx1ZSk7XG59O1xuZXhwb3J0cy51c2VTdGF0ZSA9IGZ1bmN0aW9uIChpbml0aWFsU3RhdGUpIHtcbiAgcmV0dXJuIFJlYWN0U2hhcmVkSW50ZXJuYWxzLkgudXNlU3RhdGUoaW5pdGlhbFN0YXRlKTtcbn07XG5leHBvcnRzLnVzZVN5bmNFeHRlcm5hbFN0b3JlID0gZnVuY3Rpb24gKFxuICBzdWJzY3JpYmUsXG4gIGdldFNuYXBzaG90LFxuICBnZXRTZXJ2ZXJTbmFwc2hvdFxuKSB7XG4gIHJldHVybiBSZWFjdFNoYXJlZEludGVybmFscy5ILnVzZVN5bmNFeHRlcm5hbFN0b3JlKFxuICAgIHN1YnNjcmliZSxcbiAgICBnZXRTbmFwc2hvdCxcbiAgICBnZXRTZXJ2ZXJTbmFwc2hvdFxuICApO1xufTtcbmV4cG9ydHMudXNlVHJhbnNpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIFJlYWN0U2hhcmVkSW50ZXJuYWxzLkgudXNlVHJhbnNpdGlvbigpO1xufTtcbmV4cG9ydHMudmVyc2lvbiA9IFwiMTkuMy4wXCI7XG4iLCIndXNlIHN0cmljdCc7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QucHJvZHVjdGlvbi5qcycpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC5kZXZlbG9wbWVudC5qcycpO1xufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Q0FXQSxJQUFJLHFCQUFxQixPQUFPLElBQUksNEJBQTRCO0NBQzlELElBQUEsb0JBQW9CLE9BQU8sSUFBSSxjQUFjO0NBQzdDLElBQUEsc0JBQXNCLE9BQU8sSUFBSSxnQkFBZ0I7Q0FDakQsSUFBQSx5QkFBeUIsT0FBTyxJQUFJLG1CQUFtQjtDQUN2RCxJQUFBLHNCQUFzQixPQUFPLElBQUksZ0JBQWdCO0NBQ2pELElBQUEsc0JBQXNCLE9BQU8sSUFBSSxnQkFBZ0I7Q0FDakQsSUFBQSxxQkFBcUIsT0FBTyxJQUFJLGVBQWU7Q0FDL0MsSUFBQSx5QkFBeUIsT0FBTyxJQUFJLG1CQUFtQjtDQUN2RCxJQUFBLHNCQUFzQixPQUFPLElBQUksZ0JBQWdCO0NBQ2pELElBQUEsa0JBQWtCLE9BQU8sSUFBSSxZQUFZO0NBQ3pDLElBQUEsa0JBQWtCLE9BQU8sSUFBSSxZQUFZO0NBQ3pDLElBQUEsc0JBQXNCLE9BQU8sSUFBSSxnQkFBZ0I7Q0FDakQsSUFBQSw2QkFBNkIsT0FBTyxJQUFJLHVCQUF1QjtDQUMvRCxJQUFBLHdCQUF3QixPQUFPO0NBQ2pDLFNBQVMsY0FBYyxlQUFlO0VBQ3BDLElBQUksU0FBUyxpQkFBaUIsYUFBYSxPQUFPLGVBQWUsT0FBTztFQUN4RSxnQkFDRyx5QkFBeUIsY0FBYywwQkFDeEMsY0FBYztFQUNoQixPQUFPLGVBQWUsT0FBTyxnQkFBZ0IsZ0JBQWdCO0NBQy9EO0NBQ0EsSUFBSSx1QkFBdUI7RUFDdkIsV0FBVyxXQUFZO0dB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