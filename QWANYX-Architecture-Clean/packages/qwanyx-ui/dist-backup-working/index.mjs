import * as Ni from "react";
import P, { createContext as Ut, useState as V, useEffect as ie, useContext as ke, useCallback as qr, useRef as ae, useLayoutEffect as ku, useId as Fi, useInsertionEffect as Di, useMemo as Gt, Children as Su, isValidElement as _u, Fragment as tc, createElement as Tu, forwardRef as Eu, Component as Ru } from "react";
import Au from "react-dom";
var Fn = { exports: {} }, en = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Uo;
function zu() {
  if (Uo) return en;
  Uo = 1;
  var e = P, t = Symbol.for("react.element"), r = Symbol.for("react.fragment"), n = Object.prototype.hasOwnProperty, s = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, o = { key: !0, ref: !0, __self: !0, __source: !0 };
  function a(l, c, d) {
    var u, f = {}, h = null, m = null;
    d !== void 0 && (h = "" + d), c.key !== void 0 && (h = "" + c.key), c.ref !== void 0 && (m = c.ref);
    for (u in c) n.call(c, u) && !o.hasOwnProperty(u) && (f[u] = c[u]);
    if (l && l.defaultProps) for (u in c = l.defaultProps, c) f[u] === void 0 && (f[u] = c[u]);
    return { $$typeof: t, type: l, key: h, ref: m, props: f, _owner: s.current };
  }
  return en.Fragment = r, en.jsx = a, en.jsxs = a, en;
}
var tn = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Zo;
function Pu() {
  return Zo || (Zo = 1, process.env.NODE_ENV !== "production" && (function() {
    var e = P, t = Symbol.for("react.element"), r = Symbol.for("react.portal"), n = Symbol.for("react.fragment"), s = Symbol.for("react.strict_mode"), o = Symbol.for("react.profiler"), a = Symbol.for("react.provider"), l = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), d = Symbol.for("react.suspense"), u = Symbol.for("react.suspense_list"), f = Symbol.for("react.memo"), h = Symbol.for("react.lazy"), m = Symbol.for("react.offscreen"), g = Symbol.iterator, p = "@@iterator";
    function y(w) {
      if (w === null || typeof w != "object")
        return null;
      var I = g && w[g] || w[p];
      return typeof I == "function" ? I : null;
    }
    var j = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function x(w) {
      {
        for (var I = arguments.length, Z = new Array(I > 1 ? I - 1 : 0), re = 1; re < I; re++)
          Z[re - 1] = arguments[re];
        b("error", w, Z);
      }
    }
    function b(w, I, Z) {
      {
        var re = j.ReactDebugCurrentFrame, ge = re.getStackAddendum();
        ge !== "" && (I += "%s", Z = Z.concat([ge]));
        var ye = Z.map(function(me) {
          return String(me);
        });
        ye.unshift("Warning: " + I), Function.prototype.apply.call(console[w], console, ye);
      }
    }
    var k = !1, A = !1, R = !1, C = !1, S = !1, E;
    E = Symbol.for("react.module.reference");
    function D(w) {
      return !!(typeof w == "string" || typeof w == "function" || w === n || w === o || S || w === s || w === d || w === u || C || w === m || k || A || R || typeof w == "object" && w !== null && (w.$$typeof === h || w.$$typeof === f || w.$$typeof === a || w.$$typeof === l || w.$$typeof === c || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      w.$$typeof === E || w.getModuleId !== void 0));
    }
    function L(w, I, Z) {
      var re = w.displayName;
      if (re)
        return re;
      var ge = I.displayName || I.name || "";
      return ge !== "" ? Z + "(" + ge + ")" : Z;
    }
    function M(w) {
      return w.displayName || "Context";
    }
    function q(w) {
      if (w == null)
        return null;
      if (typeof w.tag == "number" && x("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof w == "function")
        return w.displayName || w.name || null;
      if (typeof w == "string")
        return w;
      switch (w) {
        case n:
          return "Fragment";
        case r:
          return "Portal";
        case o:
          return "Profiler";
        case s:
          return "StrictMode";
        case d:
          return "Suspense";
        case u:
          return "SuspenseList";
      }
      if (typeof w == "object")
        switch (w.$$typeof) {
          case l:
            var I = w;
            return M(I) + ".Consumer";
          case a:
            var Z = w;
            return M(Z._context) + ".Provider";
          case c:
            return L(w, w.render, "ForwardRef");
          case f:
            var re = w.displayName || null;
            return re !== null ? re : q(w.type) || "Memo";
          case h: {
            var ge = w, ye = ge._payload, me = ge._init;
            try {
              return q(me(ye));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var U = Object.assign, J = 0, ce, K, ue, Y, he, oe, Ae;
    function nt() {
    }
    nt.__reactDisabledLog = !0;
    function Ne() {
      {
        if (J === 0) {
          ce = console.log, K = console.info, ue = console.warn, Y = console.error, he = console.group, oe = console.groupCollapsed, Ae = console.groupEnd;
          var w = {
            configurable: !0,
            enumerable: !0,
            value: nt,
            writable: !0
          };
          Object.defineProperties(console, {
            info: w,
            log: w,
            warn: w,
            error: w,
            group: w,
            groupCollapsed: w,
            groupEnd: w
          });
        }
        J++;
      }
    }
    function Me() {
      {
        if (J--, J === 0) {
          var w = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: U({}, w, {
              value: ce
            }),
            info: U({}, w, {
              value: K
            }),
            warn: U({}, w, {
              value: ue
            }),
            error: U({}, w, {
              value: Y
            }),
            group: U({}, w, {
              value: he
            }),
            groupCollapsed: U({}, w, {
              value: oe
            }),
            groupEnd: U({}, w, {
              value: Ae
            })
          });
        }
        J < 0 && x("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var de = j.ReactCurrentDispatcher, ne;
    function Ie(w, I, Z) {
      {
        if (ne === void 0)
          try {
            throw Error();
          } catch (ge) {
            var re = ge.stack.trim().match(/\n( *(at )?)/);
            ne = re && re[1] || "";
          }
        return `
` + ne + w;
      }
    }
    var Ze = !1, lt;
    {
      var je = typeof WeakMap == "function" ? WeakMap : Map;
      lt = new je();
    }
    function kt(w, I) {
      if (!w || Ze)
        return "";
      {
        var Z = lt.get(w);
        if (Z !== void 0)
          return Z;
      }
      var re;
      Ze = !0;
      var ge = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var ye;
      ye = de.current, de.current = null, Ne();
      try {
        if (I) {
          var me = function() {
            throw Error();
          };
          if (Object.defineProperty(me.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(me, []);
            } catch (ft) {
              re = ft;
            }
            Reflect.construct(w, [], me);
          } else {
            try {
              me.call();
            } catch (ft) {
              re = ft;
            }
            w.call(me.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (ft) {
            re = ft;
          }
          w();
        }
      } catch (ft) {
        if (ft && re && typeof ft.stack == "string") {
          for (var fe = ft.stack.split(`
`), it = re.stack.split(`
`), Fe = fe.length - 1, Be = it.length - 1; Fe >= 1 && Be >= 0 && fe[Fe] !== it[Be]; )
            Be--;
          for (; Fe >= 1 && Be >= 0; Fe--, Be--)
            if (fe[Fe] !== it[Be]) {
              if (Fe !== 1 || Be !== 1)
                do
                  if (Fe--, Be--, Be < 0 || fe[Fe] !== it[Be]) {
                    var wt = `
` + fe[Fe].replace(" at new ", " at ");
                    return w.displayName && wt.includes("<anonymous>") && (wt = wt.replace("<anonymous>", w.displayName)), typeof w == "function" && lt.set(w, wt), wt;
                  }
                while (Fe >= 1 && Be >= 0);
              break;
            }
        }
      } finally {
        Ze = !1, de.current = ye, Me(), Error.prepareStackTrace = ge;
      }
      var _r = w ? w.displayName || w.name : "", cr = _r ? Ie(_r) : "";
      return typeof w == "function" && lt.set(w, cr), cr;
    }
    function ct(w, I, Z) {
      return kt(w, !1);
    }
    function St(w) {
      var I = w.prototype;
      return !!(I && I.isReactComponent);
    }
    function Ce(w, I, Z) {
      if (w == null)
        return "";
      if (typeof w == "function")
        return kt(w, St(w));
      if (typeof w == "string")
        return Ie(w);
      switch (w) {
        case d:
          return Ie("Suspense");
        case u:
          return Ie("SuspenseList");
      }
      if (typeof w == "object")
        switch (w.$$typeof) {
          case c:
            return ct(w.render);
          case f:
            return Ce(w.type, I, Z);
          case h: {
            var re = w, ge = re._payload, ye = re._init;
            try {
              return Ce(ye(ge), I, Z);
            } catch {
            }
          }
        }
      return "";
    }
    var He = Object.prototype.hasOwnProperty, Ve = {}, vt = j.ReactDebugCurrentFrame;
    function st(w) {
      if (w) {
        var I = w._owner, Z = Ce(w.type, w._source, I ? I.type : null);
        vt.setExtraStackFrame(Z);
      } else
        vt.setExtraStackFrame(null);
    }
    function v(w, I, Z, re, ge) {
      {
        var ye = Function.call.bind(He);
        for (var me in w)
          if (ye(w, me)) {
            var fe = void 0;
            try {
              if (typeof w[me] != "function") {
                var it = Error((re || "React class") + ": " + Z + " type `" + me + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof w[me] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw it.name = "Invariant Violation", it;
              }
              fe = w[me](I, me, re, Z, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (Fe) {
              fe = Fe;
            }
            fe && !(fe instanceof Error) && (st(ge), x("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", re || "React class", Z, me, typeof fe), st(null)), fe instanceof Error && !(fe.message in Ve) && (Ve[fe.message] = !0, st(ge), x("Failed %s type: %s", Z, fe.message), st(null));
          }
      }
    }
    var _ = Array.isArray;
    function N(w) {
      return _(w);
    }
    function O(w) {
      {
        var I = typeof Symbol == "function" && Symbol.toStringTag, Z = I && w[Symbol.toStringTag] || w.constructor.name || "Object";
        return Z;
      }
    }
    function T(w) {
      try {
        return F(w), !1;
      } catch {
        return !0;
      }
    }
    function F(w) {
      return "" + w;
    }
    function B(w) {
      if (T(w))
        return x("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", O(w)), F(w);
    }
    var le = j.ReactCurrentOwner, pe = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, Le, Ht;
    function et(w) {
      if (He.call(w, "ref")) {
        var I = Object.getOwnPropertyDescriptor(w, "ref").get;
        if (I && I.isReactWarning)
          return !1;
      }
      return w.ref !== void 0;
    }
    function or(w) {
      if (He.call(w, "key")) {
        var I = Object.getOwnPropertyDescriptor(w, "key").get;
        if (I && I.isReactWarning)
          return !1;
      }
      return w.key !== void 0;
    }
    function ar(w, I) {
      typeof w.ref == "string" && le.current;
    }
    function dt(w, I) {
      {
        var Z = function() {
          Le || (Le = !0, x("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", I));
        };
        Z.isReactWarning = !0, Object.defineProperty(w, "key", {
          get: Z,
          configurable: !0
        });
      }
    }
    function $t(w, I) {
      {
        var Z = function() {
          Ht || (Ht = !0, x("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", I));
        };
        Z.isReactWarning = !0, Object.defineProperty(w, "ref", {
          get: Z,
          configurable: !0
        });
      }
    }
    var ze = function(w, I, Z, re, ge, ye, me) {
      var fe = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: t,
        // Built-in properties that belong on the element
        type: w,
        key: I,
        ref: Z,
        props: me,
        // Record the component responsible for creating this element.
        _owner: ye
      };
      return fe._store = {}, Object.defineProperty(fe._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(fe, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: re
      }), Object.defineProperty(fe, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: ge
      }), Object.freeze && (Object.freeze(fe.props), Object.freeze(fe)), fe;
    };
    function Qr(w, I, Z, re, ge) {
      {
        var ye, me = {}, fe = null, it = null;
        Z !== void 0 && (B(Z), fe = "" + Z), or(I) && (B(I.key), fe = "" + I.key), et(I) && (it = I.ref, ar(I, ge));
        for (ye in I)
          He.call(I, ye) && !pe.hasOwnProperty(ye) && (me[ye] = I[ye]);
        if (w && w.defaultProps) {
          var Fe = w.defaultProps;
          for (ye in Fe)
            me[ye] === void 0 && (me[ye] = Fe[ye]);
        }
        if (fe || it) {
          var Be = typeof w == "function" ? w.displayName || w.name || "Unknown" : w;
          fe && dt(me, Be), it && $t(me, Be);
        }
        return ze(w, fe, it, ge, re, le.current, me);
      }
    }
    var Xt = j.ReactCurrentOwner, Cr = j.ReactDebugCurrentFrame;
    function Jt(w) {
      if (w) {
        var I = w._owner, Z = Ce(w.type, w._source, I ? I.type : null);
        Cr.setExtraStackFrame(Z);
      } else
        Cr.setExtraStackFrame(null);
    }
    var lr;
    lr = !1;
    function Qt(w) {
      return typeof w == "object" && w !== null && w.$$typeof === t;
    }
    function Nn() {
      {
        if (Xt.current) {
          var w = q(Xt.current.type);
          if (w)
            return `

Check the render method of \`` + w + "`.";
        }
        return "";
      }
    }
    function z(w) {
      return "";
    }
    var G = {};
    function se(w) {
      {
        var I = Nn();
        if (!I) {
          var Z = typeof w == "string" ? w : w.displayName || w.name;
          Z && (I = `

Check the top-level render call using <` + Z + ">.");
        }
        return I;
      }
    }
    function ve(w, I) {
      {
        if (!w._store || w._store.validated || w.key != null)
          return;
        w._store.validated = !0;
        var Z = se(I);
        if (G[Z])
          return;
        G[Z] = !0;
        var re = "";
        w && w._owner && w._owner !== Xt.current && (re = " It was passed a child from " + q(w._owner.type) + "."), Jt(w), x('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', Z, re), Jt(null);
      }
    }
    function Pe(w, I) {
      {
        if (typeof w != "object")
          return;
        if (N(w))
          for (var Z = 0; Z < w.length; Z++) {
            var re = w[Z];
            Qt(re) && ve(re, I);
          }
        else if (Qt(w))
          w._store && (w._store.validated = !0);
        else if (w) {
          var ge = y(w);
          if (typeof ge == "function" && ge !== w.entries)
            for (var ye = ge.call(w), me; !(me = ye.next()).done; )
              Qt(me.value) && ve(me.value, I);
        }
      }
    }
    function tt(w) {
      {
        var I = w.type;
        if (I == null || typeof I == "string")
          return;
        var Z;
        if (typeof I == "function")
          Z = I.propTypes;
        else if (typeof I == "object" && (I.$$typeof === c || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        I.$$typeof === f))
          Z = I.propTypes;
        else
          return;
        if (Z) {
          var re = q(I);
          v(Z, w.props, "prop", re, w);
        } else if (I.PropTypes !== void 0 && !lr) {
          lr = !0;
          var ge = q(I);
          x("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", ge || "Unknown");
        }
        typeof I.getDefaultProps == "function" && !I.getDefaultProps.isReactClassApproved && x("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function Ge(w) {
      {
        for (var I = Object.keys(w.props), Z = 0; Z < I.length; Z++) {
          var re = I[Z];
          if (re !== "children" && re !== "key") {
            Jt(w), x("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", re), Jt(null);
            break;
          }
        }
        w.ref !== null && (Jt(w), x("Invalid attribute `ref` supplied to `React.Fragment`."), Jt(null));
      }
    }
    var ut = {};
    function kr(w, I, Z, re, ge, ye) {
      {
        var me = D(w);
        if (!me) {
          var fe = "";
          (w === void 0 || typeof w == "object" && w !== null && Object.keys(w).length === 0) && (fe += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var it = z();
          it ? fe += it : fe += Nn();
          var Fe;
          w === null ? Fe = "null" : N(w) ? Fe = "array" : w !== void 0 && w.$$typeof === t ? (Fe = "<" + (q(w.type) || "Unknown") + " />", fe = " Did you accidentally export a JSX literal instead of a component?") : Fe = typeof w, x("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", Fe, fe);
        }
        var Be = Qr(w, I, Z, ge, ye);
        if (Be == null)
          return Be;
        if (me) {
          var wt = I.children;
          if (wt !== void 0)
            if (re)
              if (N(wt)) {
                for (var _r = 0; _r < wt.length; _r++)
                  Pe(wt[_r], w);
                Object.freeze && Object.freeze(wt);
              } else
                x("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              Pe(wt, w);
        }
        if (He.call(I, "key")) {
          var cr = q(w), ft = Object.keys(I).filter(function(Cu) {
            return Cu !== "key";
          }), Fs = ft.length > 0 ? "{key: someKey, " + ft.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!ut[cr + Fs]) {
            var ju = ft.length > 0 ? "{" + ft.join(": ..., ") + ": ...}" : "{}";
            x(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, Fs, cr, ju, cr), ut[cr + Fs] = !0;
          }
        }
        return w === n ? Ge(Be) : tt(Be), Be;
      }
    }
    function _t(w, I, Z) {
      return kr(w, I, Z, !0);
    }
    function Ns(w, I, Z) {
      return kr(w, I, Z, !1);
    }
    var Sr = Ns, wu = _t;
    tn.Fragment = n, tn.jsx = Sr, tn.jsxs = wu;
  })()), tn;
}
var Ho;
function Nu() {
  return Ho || (Ho = 1, process.env.NODE_ENV === "production" ? Fn.exports = zu() : Fn.exports = Pu()), Fn.exports;
}
var i = Nu();
const rc = Ut(void 0), _w = () => {
  const e = ke(rc);
  if (!e)
    throw new Error("useTheme must be used within a ThemeProvider");
  return e;
}, Fu = (e) => {
  e = e.replace("#", ""), e.length === 3 && (e = e.split("").map((r) => r + r).join(""));
  const t = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
  return t ? `${parseInt(t[1], 16)} ${parseInt(t[2], 16)} ${parseInt(t[3], 16)}` : "0 0 0";
}, Du = (e) => {
  const t = document.documentElement;
  Object.entries(e.colors).forEach(([r, n]) => {
    const s = n.startsWith("#") ? Fu(n) : n;
    r.startsWith("text-") ? t.style.setProperty(`--qwanyx-${r}`, s) : r === "card-foreground" ? t.style.setProperty("--qwanyx-card-foreground", s) : t.style.setProperty(`--qwanyx-${r}`, s);
  }), e.fonts && Object.entries(e.fonts).forEach(([r, n]) => {
    t.style.setProperty(`--qwanyx-font-${r}`, n);
  }), e.spacing && Object.entries(e.spacing).forEach(([r, n]) => {
    t.style.setProperty(`--qwanyx-spacing-${r}`, n);
  }), e.radius && Object.entries(e.radius).forEach(([r, n]) => {
    const s = r === "DEFAULT" ? "--qwanyx-radius" : `--qwanyx-radius-${r}`;
    t.style.setProperty(s, n);
  }), e.shadows && Object.entries(e.shadows).forEach(([r, n]) => {
    const s = r === "DEFAULT" ? "--qwanyx-shadow" : `--qwanyx-shadow-${r}`;
    t.style.setProperty(s, n);
  }), e.transitions && Object.entries(e.transitions).forEach(([r, n]) => {
    t.style.setProperty(`--qwanyx-transition-${r}`, n);
  });
}, Tr = [
  {
    name: "QWANYX Light",
    colors: {
      primary: "#3B82F6",
      secondary: "#A855F7",
      accent: "#22C55E",
      success: "#22C55E",
      warning: "#FACC15",
      error: "#EF4444",
      info: "#3B82F6",
      background: "#F9FAFB",
      foreground: "#0F172A",
      card: "#FFFFFF",
      "card-foreground": "#0F172A",
      border: "#E2E8F0",
      input: "#FFFFFF",
      ring: "#3B82F6",
      "text-primary": "#0F172A",
      "text-secondary": "#475569",
      "text-muted": "#94A3B8"
    }
  },
  {
    name: "QWANYX Dark",
    colors: {
      primary: "#60A5FA",
      secondary: "#C084FC",
      accent: "#4ADE80",
      success: "#4ADE80",
      warning: "#FDE047",
      error: "#F87171",
      info: "#60A5FA",
      background: "#0F172A",
      foreground: "#F8FAFC",
      card: "#1E293B",
      "card-foreground": "#F8FAFC",
      border: "#334155",
      input: "#1E293B",
      ring: "#60A5FA",
      "text-primary": "#F8FAFC",
      "text-secondary": "#CBD5E1",
      "text-muted": "#64748B"
    }
  },
  {
    name: "Ocean Blue",
    colors: {
      primary: "#0EA5E9",
      secondary: "#06B6D4",
      accent: "#14B8A6",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#0EA5E9",
      background: "#F0F9FF",
      foreground: "#0C4A6E",
      card: "#FFFFFF",
      "card-foreground": "#0C4A6E",
      border: "#BAE6FD",
      input: "#E0F2FE",
      ring: "#0EA5E9",
      "text-primary": "#0C4A6E",
      "text-secondary": "#0369A1",
      "text-muted": "#7DD3FC"
    }
  },
  {
    name: "Forest Green",
    colors: {
      primary: "#16A34A",
      secondary: "#15803D",
      accent: "#84CC16",
      success: "#22C55E",
      warning: "#EAB308",
      error: "#DC2626",
      info: "#0891B2",
      background: "#F0FDF4",
      foreground: "#14532D",
      card: "#FFFFFF",
      "card-foreground": "#14532D",
      border: "#BBF7D0",
      input: "#DCFCE7",
      ring: "#16A34A",
      "text-primary": "#14532D",
      "text-secondary": "#166534",
      "text-muted": "#86EFAC"
    }
  }
], Tw = ({
  children: e,
  defaultTheme: t = Tr[0],
  persistTheme: r = !0
  // By default, persist theme to localStorage
}) => {
  const [n, s] = V(t), [o, a] = V(Tr);
  ie(() => {
    Du(n), r && localStorage.setItem("qwanyx-ui-current-theme", JSON.stringify(n));
  }, [n, r]), ie(() => {
    if (r) {
      const u = localStorage.getItem("qwanyx-ui-current-theme");
      if (u)
        try {
          const h = JSON.parse(u);
          s(h);
        } catch (h) {
          console.error("Failed to load saved theme:", h);
        }
      const f = localStorage.getItem("qwanyx-ui-themes");
      if (f)
        try {
          const h = JSON.parse(f);
          a([...Tr, ...h]);
        } catch (h) {
          console.error("Failed to load saved themes:", h);
        }
    }
  }, []);
  const l = (u) => {
    s(u);
  }, c = (u) => {
    const f = [...o, u];
    if (a(f), r) {
      const h = f.filter(
        (m) => !Tr.some((g) => g.name === m.name)
      );
      localStorage.setItem("qwanyx-ui-themes", JSON.stringify(h));
    }
  }, d = (u) => {
    if (Tr.some((h) => h.name === u)) return;
    const f = o.filter((h) => h.name !== u);
    if (a(f), r) {
      const h = f.filter(
        (m) => !Tr.some((g) => g.name === m.name)
      );
      localStorage.setItem("qwanyx-ui-themes", JSON.stringify(h));
    }
  };
  return /* @__PURE__ */ i.jsx(rc.Provider, { value: { theme: n, setTheme: l, themes: o, addTheme: c, removeTheme: d }, children: e });
}, Qs = "qwanyx-theme-mode";
function $u() {
  const [e, t] = V(() => {
    if (typeof window > "u") return "system";
    const o = localStorage.getItem(Qs);
    return o === "light" || o === "dark" || o === "system" ? o : "system";
  }), [r, n] = V("light");
  ie(() => {
    const o = window.matchMedia("(prefers-color-scheme: dark)"), a = () => {
      if (e === "system") {
        const c = o.matches;
        n(c ? "dark" : "light");
      } else
        n(e);
    };
    a();
    const l = () => a();
    return o.addEventListener("change", l), () => o.removeEventListener("change", l);
  }, [e]), ie(() => {
    const o = document.documentElement;
    o.classList.remove("light", "dark"), o.classList.add(r), o.setAttribute("data-theme", r);
  }, [r]);
  const s = qr((o) => {
    t(o), localStorage.setItem(Qs, o), window.dispatchEvent(new CustomEvent("themechange", {
      detail: { mode: o }
    }));
  }, []);
  return {
    mode: e,
    resolvedMode: r,
    setMode: s
  };
}
function Mu() {
  if (typeof window > "u") return "system";
  const e = localStorage.getItem(Qs);
  return e === "light" || e === "dark" || e === "system" ? e : "system";
}
function Ew() {
  if (typeof window > "u") return "light";
  const e = Mu();
  return e === "system" ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" : e;
}
const $i = Ut({});
function Zr(e) {
  const t = ae(null);
  return t.current === null && (t.current = e()), t.current;
}
const Mi = typeof window < "u", hs = Mi ? ku : ie, ps = /* @__PURE__ */ Ut(null);
function Ii(e, t) {
  e.indexOf(t) === -1 && e.push(t);
}
function Vi(e, t) {
  const r = e.indexOf(t);
  r > -1 && e.splice(r, 1);
}
const Wt = (e, t, r) => r > t ? t : r < e ? e : r;
function ei(e, t) {
  return t ? `${e}. For more information and steps for solving, visit https://motion.dev/troubleshooting/${t}` : e;
}
let Hr = () => {
}, Ft = () => {
};
process.env.NODE_ENV !== "production" && (Hr = (e, t, r) => {
  !e && typeof console < "u" && console.warn(ei(t, r));
}, Ft = (e, t, r) => {
  if (!e)
    throw new Error(ei(t, r));
});
const Kt = {}, nc = (e) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e);
function sc(e) {
  return typeof e == "object" && e !== null;
}
const ic = (e) => /^0[^.\s]+$/u.test(e);
// @__NO_SIDE_EFFECTS__
function Li(e) {
  let t;
  return () => (t === void 0 && (t = e()), t);
}
const yt = /* @__NO_SIDE_EFFECTS__ */ (e) => e, Iu = (e, t) => (r) => t(e(r)), _n = (...e) => e.reduce(Iu), Wr = /* @__NO_SIDE_EFFECTS__ */ (e, t, r) => {
  const n = t - e;
  return n === 0 ? 1 : (r - e) / n;
};
class Bi {
  constructor() {
    this.subscriptions = [];
  }
  add(t) {
    return Ii(this.subscriptions, t), () => Vi(this.subscriptions, t);
  }
  notify(t, r, n) {
    const s = this.subscriptions.length;
    if (s)
      if (s === 1)
        this.subscriptions[0](t, r, n);
      else
        for (let o = 0; o < s; o++) {
          const a = this.subscriptions[o];
          a && a(t, r, n);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const Pt = /* @__NO_SIDE_EFFECTS__ */ (e) => e * 1e3, Vt = /* @__NO_SIDE_EFFECTS__ */ (e) => e / 1e3;
function Oi(e, t) {
  return t ? e * (1e3 / t) : 0;
}
const Yo = /* @__PURE__ */ new Set();
function ms(e, t, r) {
  e || Yo.has(t) || (console.warn(ei(t, r)), Yo.add(t));
}
const oc = (e, t, r) => (((1 - 3 * r + 3 * t) * e + (3 * r - 6 * t)) * e + 3 * t) * e, Vu = 1e-7, Lu = 12;
function Bu(e, t, r, n, s) {
  let o, a, l = 0;
  do
    a = t + (r - t) / 2, o = oc(a, n, s) - e, o > 0 ? r = a : t = a;
  while (Math.abs(o) > Vu && ++l < Lu);
  return a;
}
function Tn(e, t, r, n) {
  if (e === t && r === n)
    return yt;
  const s = (o) => Bu(o, 0, 1, e, r);
  return (o) => o === 0 || o === 1 ? o : oc(s(o), t, n);
}
const ac = (e) => (t) => t <= 0.5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2, lc = (e) => (t) => 1 - e(1 - t), cc = /* @__PURE__ */ Tn(0.33, 1.53, 0.69, 0.99), qi = /* @__PURE__ */ lc(cc), dc = /* @__PURE__ */ ac(qi), uc = (e) => (e *= 2) < 1 ? 0.5 * qi(e) : 0.5 * (2 - Math.pow(2, -10 * (e - 1))), Wi = (e) => 1 - Math.sin(Math.acos(e)), fc = lc(Wi), hc = ac(Wi), Ou = /* @__PURE__ */ Tn(0.42, 0, 1, 1), qu = /* @__PURE__ */ Tn(0, 0, 0.58, 1), pc = /* @__PURE__ */ Tn(0.42, 0, 0.58, 1), Wu = (e) => Array.isArray(e) && typeof e[0] != "number", mc = (e) => Array.isArray(e) && typeof e[0] == "number", Go = {
  linear: yt,
  easeIn: Ou,
  easeInOut: pc,
  easeOut: qu,
  circIn: Wi,
  circInOut: hc,
  circOut: fc,
  backIn: qi,
  backInOut: dc,
  backOut: cc,
  anticipate: uc
}, Uu = (e) => typeof e == "string", Ko = (e) => {
  if (mc(e)) {
    Ft(e.length === 4, "Cubic bezier arrays must contain four numerical values.", "cubic-bezier-length");
    const [t, r, n, s] = e;
    return Tn(t, r, n, s);
  } else if (Uu(e))
    return Ft(Go[e] !== void 0, `Invalid easing type '${e}'`, "invalid-easing-type"), Go[e];
  return e;
}, Dn = [
  "setup",
  // Compute
  "read",
  // Read
  "resolveKeyframes",
  // Write/Read/Write/Read
  "preUpdate",
  // Compute
  "update",
  // Compute
  "preRender",
  // Compute
  "render",
  // Write
  "postRender"
  // Compute
];
function Zu(e, t) {
  let r = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), s = !1, o = !1;
  const a = /* @__PURE__ */ new WeakSet();
  let l = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  };
  function c(u) {
    a.has(u) && (d.schedule(u), e()), u(l);
  }
  const d = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (u, f = !1, h = !1) => {
      const g = h && s ? r : n;
      return f && a.add(u), g.has(u) || g.add(u), u;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (u) => {
      n.delete(u), a.delete(u);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (u) => {
      if (l = u, s) {
        o = !0;
        return;
      }
      s = !0, [r, n] = [n, r], r.forEach(c), r.clear(), s = !1, o && (o = !1, d.process(u));
    }
  };
  return d;
}
const Hu = 40;
function gc(e, t) {
  let r = !1, n = !0;
  const s = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, o = () => r = !0, a = Dn.reduce((b, k) => (b[k] = Zu(o), b), {}), { setup: l, read: c, resolveKeyframes: d, preUpdate: u, update: f, preRender: h, render: m, postRender: g } = a, p = () => {
    const b = Kt.useManualTiming ? s.timestamp : performance.now();
    r = !1, Kt.useManualTiming || (s.delta = n ? 1e3 / 60 : Math.max(Math.min(b - s.timestamp, Hu), 1)), s.timestamp = b, s.isProcessing = !0, l.process(s), c.process(s), d.process(s), u.process(s), f.process(s), h.process(s), m.process(s), g.process(s), s.isProcessing = !1, r && t && (n = !1, e(p));
  }, y = () => {
    r = !0, n = !0, s.isProcessing || e(p);
  };
  return { schedule: Dn.reduce((b, k) => {
    const A = a[k];
    return b[k] = (R, C = !1, S = !1) => (r || y(), A.schedule(R, C, S)), b;
  }, {}), cancel: (b) => {
    for (let k = 0; k < Dn.length; k++)
      a[Dn[k]].cancel(b);
  }, state: s, steps: a };
}
const { schedule: xe, cancel: Dt, state: Xe, steps: Ds } = /* @__PURE__ */ gc(typeof requestAnimationFrame < "u" ? requestAnimationFrame : yt, !0);
let Zn;
function Yu() {
  Zn = void 0;
}
const mt = {
  now: () => (Zn === void 0 && mt.set(Xe.isProcessing || Kt.useManualTiming ? Xe.timestamp : performance.now()), Zn),
  set: (e) => {
    Zn = e, queueMicrotask(Yu);
  }
}, xc = (e) => (t) => typeof t == "string" && t.startsWith(e), Ui = /* @__PURE__ */ xc("--"), Gu = /* @__PURE__ */ xc("var(--"), Zi = (e) => Gu(e) ? Ku.test(e.split("/*")[0].trim()) : !1, Ku = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu, Yr = {
  test: (e) => typeof e == "number",
  parse: parseFloat,
  transform: (e) => e
}, yn = {
  ...Yr,
  transform: (e) => Wt(0, 1, e)
}, $n = {
  ...Yr,
  default: 1
}, cn = (e) => Math.round(e * 1e5) / 1e5, Hi = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function Xu(e) {
  return e == null;
}
const Ju = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, Yi = (e, t) => (r) => !!(typeof r == "string" && Ju.test(r) && r.startsWith(e) || t && !Xu(r) && Object.prototype.hasOwnProperty.call(r, t)), yc = (e, t, r) => (n) => {
  if (typeof n != "string")
    return n;
  const [s, o, a, l] = n.match(Hi);
  return {
    [e]: parseFloat(s),
    [t]: parseFloat(o),
    [r]: parseFloat(a),
    alpha: l !== void 0 ? parseFloat(l) : 1
  };
}, Qu = (e) => Wt(0, 255, e), $s = {
  ...Yr,
  transform: (e) => Math.round(Qu(e))
}, fr = {
  test: /* @__PURE__ */ Yi("rgb", "red"),
  parse: /* @__PURE__ */ yc("red", "green", "blue"),
  transform: ({ red: e, green: t, blue: r, alpha: n = 1 }) => "rgba(" + $s.transform(e) + ", " + $s.transform(t) + ", " + $s.transform(r) + ", " + cn(yn.transform(n)) + ")"
};
function ef(e) {
  let t = "", r = "", n = "", s = "";
  return e.length > 5 ? (t = e.substring(1, 3), r = e.substring(3, 5), n = e.substring(5, 7), s = e.substring(7, 9)) : (t = e.substring(1, 2), r = e.substring(2, 3), n = e.substring(3, 4), s = e.substring(4, 5), t += t, r += r, n += n, s += s), {
    red: parseInt(t, 16),
    green: parseInt(r, 16),
    blue: parseInt(n, 16),
    alpha: s ? parseInt(s, 16) / 255 : 1
  };
}
const ti = {
  test: /* @__PURE__ */ Yi("#"),
  parse: ef,
  transform: fr.transform
}, En = /* @__NO_SIDE_EFFECTS__ */ (e) => ({
  test: (t) => typeof t == "string" && t.endsWith(e) && t.split(" ").length === 1,
  parse: parseFloat,
  transform: (t) => `${t}${e}`
}), er = /* @__PURE__ */ En("deg"), Lt = /* @__PURE__ */ En("%"), ee = /* @__PURE__ */ En("px"), tf = /* @__PURE__ */ En("vh"), rf = /* @__PURE__ */ En("vw"), Xo = {
  ...Lt,
  parse: (e) => Lt.parse(e) / 100,
  transform: (e) => Lt.transform(e * 100)
}, Rr = {
  test: /* @__PURE__ */ Yi("hsl", "hue"),
  parse: /* @__PURE__ */ yc("hue", "saturation", "lightness"),
  transform: ({ hue: e, saturation: t, lightness: r, alpha: n = 1 }) => "hsla(" + Math.round(e) + ", " + Lt.transform(cn(t)) + ", " + Lt.transform(cn(r)) + ", " + cn(yn.transform(n)) + ")"
}, qe = {
  test: (e) => fr.test(e) || ti.test(e) || Rr.test(e),
  parse: (e) => fr.test(e) ? fr.parse(e) : Rr.test(e) ? Rr.parse(e) : ti.parse(e),
  transform: (e) => typeof e == "string" ? e : e.hasOwnProperty("red") ? fr.transform(e) : Rr.transform(e),
  getAnimatableNone: (e) => {
    const t = qe.parse(e);
    return t.alpha = 0, qe.transform(t);
  }
}, nf = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function sf(e) {
  var t, r;
  return isNaN(e) && typeof e == "string" && (((t = e.match(Hi)) == null ? void 0 : t.length) || 0) + (((r = e.match(nf)) == null ? void 0 : r.length) || 0) > 0;
}
const bc = "number", vc = "color", of = "var", af = "var(", Jo = "${}", lf = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function bn(e) {
  const t = e.toString(), r = [], n = {
    color: [],
    number: [],
    var: []
  }, s = [];
  let o = 0;
  const l = t.replace(lf, (c) => (qe.test(c) ? (n.color.push(o), s.push(vc), r.push(qe.parse(c))) : c.startsWith(af) ? (n.var.push(o), s.push(of), r.push(c)) : (n.number.push(o), s.push(bc), r.push(parseFloat(c))), ++o, Jo)).split(Jo);
  return { values: r, split: l, indexes: n, types: s };
}
function wc(e) {
  return bn(e).values;
}
function jc(e) {
  const { split: t, types: r } = bn(e), n = t.length;
  return (s) => {
    let o = "";
    for (let a = 0; a < n; a++)
      if (o += t[a], s[a] !== void 0) {
        const l = r[a];
        l === bc ? o += cn(s[a]) : l === vc ? o += qe.transform(s[a]) : o += s[a];
      }
    return o;
  };
}
const cf = (e) => typeof e == "number" ? 0 : qe.test(e) ? qe.getAnimatableNone(e) : e;
function df(e) {
  const t = wc(e);
  return jc(e)(t.map(cf));
}
const sr = {
  test: sf,
  parse: wc,
  createTransformer: jc,
  getAnimatableNone: df
};
function Ms(e, t, r) {
  return r < 0 && (r += 1), r > 1 && (r -= 1), r < 1 / 6 ? e + (t - e) * 6 * r : r < 1 / 2 ? t : r < 2 / 3 ? e + (t - e) * (2 / 3 - r) * 6 : e;
}
function uf({ hue: e, saturation: t, lightness: r, alpha: n }) {
  e /= 360, t /= 100, r /= 100;
  let s = 0, o = 0, a = 0;
  if (!t)
    s = o = a = r;
  else {
    const l = r < 0.5 ? r * (1 + t) : r + t - r * t, c = 2 * r - l;
    s = Ms(c, l, e + 1 / 3), o = Ms(c, l, e), a = Ms(c, l, e - 1 / 3);
  }
  return {
    red: Math.round(s * 255),
    green: Math.round(o * 255),
    blue: Math.round(a * 255),
    alpha: n
  };
}
function ns(e, t) {
  return (r) => r > 0 ? t : e;
}
const Ee = (e, t, r) => e + (t - e) * r, Is = (e, t, r) => {
  const n = e * e, s = r * (t * t - n) + n;
  return s < 0 ? 0 : Math.sqrt(s);
}, ff = [ti, fr, Rr], hf = (e) => ff.find((t) => t.test(e));
function Qo(e) {
  const t = hf(e);
  if (Hr(!!t, `'${e}' is not an animatable color. Use the equivalent color code instead.`, "color-not-animatable"), !t)
    return !1;
  let r = t.parse(e);
  return t === Rr && (r = uf(r)), r;
}
const ea = (e, t) => {
  const r = Qo(e), n = Qo(t);
  if (!r || !n)
    return ns(e, t);
  const s = { ...r };
  return (o) => (s.red = Is(r.red, n.red, o), s.green = Is(r.green, n.green, o), s.blue = Is(r.blue, n.blue, o), s.alpha = Ee(r.alpha, n.alpha, o), fr.transform(s));
}, ri = /* @__PURE__ */ new Set(["none", "hidden"]);
function pf(e, t) {
  return ri.has(e) ? (r) => r <= 0 ? e : t : (r) => r >= 1 ? t : e;
}
function mf(e, t) {
  return (r) => Ee(e, t, r);
}
function Gi(e) {
  return typeof e == "number" ? mf : typeof e == "string" ? Zi(e) ? ns : qe.test(e) ? ea : yf : Array.isArray(e) ? Cc : typeof e == "object" ? qe.test(e) ? ea : gf : ns;
}
function Cc(e, t) {
  const r = [...e], n = r.length, s = e.map((o, a) => Gi(o)(o, t[a]));
  return (o) => {
    for (let a = 0; a < n; a++)
      r[a] = s[a](o);
    return r;
  };
}
function gf(e, t) {
  const r = { ...e, ...t }, n = {};
  for (const s in r)
    e[s] !== void 0 && t[s] !== void 0 && (n[s] = Gi(e[s])(e[s], t[s]));
  return (s) => {
    for (const o in n)
      r[o] = n[o](s);
    return r;
  };
}
function xf(e, t) {
  const r = [], n = { color: 0, var: 0, number: 0 };
  for (let s = 0; s < t.values.length; s++) {
    const o = t.types[s], a = e.indexes[o][n[o]], l = e.values[a] ?? 0;
    r[s] = l, n[o]++;
  }
  return r;
}
const yf = (e, t) => {
  const r = sr.createTransformer(t), n = bn(e), s = bn(t);
  return n.indexes.var.length === s.indexes.var.length && n.indexes.color.length === s.indexes.color.length && n.indexes.number.length >= s.indexes.number.length ? ri.has(e) && !s.values.length || ri.has(t) && !n.values.length ? pf(e, t) : _n(Cc(xf(n, s), s.values), r) : (Hr(!0, `Complex values '${e}' and '${t}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`, "complex-values-different"), ns(e, t));
};
function kc(e, t, r) {
  return typeof e == "number" && typeof t == "number" && typeof r == "number" ? Ee(e, t, r) : Gi(e)(e, t);
}
const bf = (e) => {
  const t = ({ timestamp: r }) => e(r);
  return {
    start: (r = !0) => xe.update(t, r),
    stop: () => Dt(t),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => Xe.isProcessing ? Xe.timestamp : mt.now()
  };
}, Sc = (e, t, r = 10) => {
  let n = "";
  const s = Math.max(Math.round(t / r), 2);
  for (let o = 0; o < s; o++)
    n += Math.round(e(o / (s - 1)) * 1e4) / 1e4 + ", ";
  return `linear(${n.substring(0, n.length - 2)})`;
}, ss = 2e4;
function Ki(e) {
  let t = 0;
  const r = 50;
  let n = e.next(t);
  for (; !n.done && t < ss; )
    t += r, n = e.next(t);
  return t >= ss ? 1 / 0 : t;
}
function vf(e, t = 100, r) {
  const n = r({ ...e, keyframes: [0, t] }), s = Math.min(Ki(n), ss);
  return {
    type: "keyframes",
    ease: (o) => n.next(s * o).value / t,
    duration: /* @__PURE__ */ Vt(s)
  };
}
const wf = 5;
function _c(e, t, r) {
  const n = Math.max(t - wf, 0);
  return Oi(r - e(n), t - n);
}
const Te = {
  // Default spring physics
  stiffness: 100,
  damping: 10,
  mass: 1,
  velocity: 0,
  // Default duration/bounce-based options
  duration: 800,
  // in ms
  bounce: 0.3,
  visualDuration: 0.3,
  // in seconds
  // Rest thresholds
  restSpeed: {
    granular: 0.01,
    default: 2
  },
  restDelta: {
    granular: 5e-3,
    default: 0.5
  },
  // Limits
  minDuration: 0.01,
  // in seconds
  maxDuration: 10,
  // in seconds
  minDamping: 0.05,
  maxDamping: 1
}, Vs = 1e-3;
function jf({ duration: e = Te.duration, bounce: t = Te.bounce, velocity: r = Te.velocity, mass: n = Te.mass }) {
  let s, o;
  Hr(e <= /* @__PURE__ */ Pt(Te.maxDuration), "Spring duration must be 10 seconds or less", "spring-duration-limit");
  let a = 1 - t;
  a = Wt(Te.minDamping, Te.maxDamping, a), e = Wt(Te.minDuration, Te.maxDuration, /* @__PURE__ */ Vt(e)), a < 1 ? (s = (d) => {
    const u = d * a, f = u * e, h = u - r, m = ni(d, a), g = Math.exp(-f);
    return Vs - h / m * g;
  }, o = (d) => {
    const f = d * a * e, h = f * r + r, m = Math.pow(a, 2) * Math.pow(d, 2) * e, g = Math.exp(-f), p = ni(Math.pow(d, 2), a);
    return (-s(d) + Vs > 0 ? -1 : 1) * ((h - m) * g) / p;
  }) : (s = (d) => {
    const u = Math.exp(-d * e), f = (d - r) * e + 1;
    return -Vs + u * f;
  }, o = (d) => {
    const u = Math.exp(-d * e), f = (r - d) * (e * e);
    return u * f;
  });
  const l = 5 / e, c = kf(s, o, l);
  if (e = /* @__PURE__ */ Pt(e), isNaN(c))
    return {
      stiffness: Te.stiffness,
      damping: Te.damping,
      duration: e
    };
  {
    const d = Math.pow(c, 2) * n;
    return {
      stiffness: d,
      damping: a * 2 * Math.sqrt(n * d),
      duration: e
    };
  }
}
const Cf = 12;
function kf(e, t, r) {
  let n = r;
  for (let s = 1; s < Cf; s++)
    n = n - e(n) / t(n);
  return n;
}
function ni(e, t) {
  return e * Math.sqrt(1 - t * t);
}
const Sf = ["duration", "bounce"], _f = ["stiffness", "damping", "mass"];
function ta(e, t) {
  return t.some((r) => e[r] !== void 0);
}
function Tf(e) {
  let t = {
    velocity: Te.velocity,
    stiffness: Te.stiffness,
    damping: Te.damping,
    mass: Te.mass,
    isResolvedFromDuration: !1,
    ...e
  };
  if (!ta(e, _f) && ta(e, Sf))
    if (e.visualDuration) {
      const r = e.visualDuration, n = 2 * Math.PI / (r * 1.2), s = n * n, o = 2 * Wt(0.05, 1, 1 - (e.bounce || 0)) * Math.sqrt(s);
      t = {
        ...t,
        mass: Te.mass,
        stiffness: s,
        damping: o
      };
    } else {
      const r = jf(e);
      t = {
        ...t,
        ...r,
        mass: Te.mass
      }, t.isResolvedFromDuration = !0;
    }
  return t;
}
function is(e = Te.visualDuration, t = Te.bounce) {
  const r = typeof e != "object" ? {
    visualDuration: e,
    keyframes: [0, 1],
    bounce: t
  } : e;
  let { restSpeed: n, restDelta: s } = r;
  const o = r.keyframes[0], a = r.keyframes[r.keyframes.length - 1], l = { done: !1, value: o }, { stiffness: c, damping: d, mass: u, duration: f, velocity: h, isResolvedFromDuration: m } = Tf({
    ...r,
    velocity: -/* @__PURE__ */ Vt(r.velocity || 0)
  }), g = h || 0, p = d / (2 * Math.sqrt(c * u)), y = a - o, j = /* @__PURE__ */ Vt(Math.sqrt(c / u)), x = Math.abs(y) < 5;
  n || (n = x ? Te.restSpeed.granular : Te.restSpeed.default), s || (s = x ? Te.restDelta.granular : Te.restDelta.default);
  let b;
  if (p < 1) {
    const A = ni(j, p);
    b = (R) => {
      const C = Math.exp(-p * j * R);
      return a - C * ((g + p * j * y) / A * Math.sin(A * R) + y * Math.cos(A * R));
    };
  } else if (p === 1)
    b = (A) => a - Math.exp(-j * A) * (y + (g + j * y) * A);
  else {
    const A = j * Math.sqrt(p * p - 1);
    b = (R) => {
      const C = Math.exp(-p * j * R), S = Math.min(A * R, 300);
      return a - C * ((g + p * j * y) * Math.sinh(S) + A * y * Math.cosh(S)) / A;
    };
  }
  const k = {
    calculatedDuration: m && f || null,
    next: (A) => {
      const R = b(A);
      if (m)
        l.done = A >= f;
      else {
        let C = A === 0 ? g : 0;
        p < 1 && (C = A === 0 ? /* @__PURE__ */ Pt(g) : _c(b, A, R));
        const S = Math.abs(C) <= n, E = Math.abs(a - R) <= s;
        l.done = S && E;
      }
      return l.value = l.done ? a : R, l;
    },
    toString: () => {
      const A = Math.min(Ki(k), ss), R = Sc((C) => k.next(A * C).value, A, 30);
      return A + "ms " + R;
    },
    toTransition: () => {
    }
  };
  return k;
}
is.applyToOptions = (e) => {
  const t = vf(e, 100, is);
  return e.ease = t.ease, e.duration = /* @__PURE__ */ Pt(t.duration), e.type = "keyframes", e;
};
function si({ keyframes: e, velocity: t = 0, power: r = 0.8, timeConstant: n = 325, bounceDamping: s = 10, bounceStiffness: o = 500, modifyTarget: a, min: l, max: c, restDelta: d = 0.5, restSpeed: u }) {
  const f = e[0], h = {
    done: !1,
    value: f
  }, m = (S) => l !== void 0 && S < l || c !== void 0 && S > c, g = (S) => l === void 0 ? c : c === void 0 || Math.abs(l - S) < Math.abs(c - S) ? l : c;
  let p = r * t;
  const y = f + p, j = a === void 0 ? y : a(y);
  j !== y && (p = j - f);
  const x = (S) => -p * Math.exp(-S / n), b = (S) => j + x(S), k = (S) => {
    const E = x(S), D = b(S);
    h.done = Math.abs(E) <= d, h.value = h.done ? j : D;
  };
  let A, R;
  const C = (S) => {
    m(h.value) && (A = S, R = is({
      keyframes: [h.value, g(h.value)],
      velocity: _c(b, S, h.value),
      // TODO: This should be passing * 1000
      damping: s,
      stiffness: o,
      restDelta: d,
      restSpeed: u
    }));
  };
  return C(0), {
    calculatedDuration: null,
    next: (S) => {
      let E = !1;
      return !R && A === void 0 && (E = !0, k(S), C(S)), A !== void 0 && S >= A ? R.next(S - A) : (!E && k(S), h);
    }
  };
}
function Ef(e, t, r) {
  const n = [], s = r || Kt.mix || kc, o = e.length - 1;
  for (let a = 0; a < o; a++) {
    let l = s(e[a], e[a + 1]);
    if (t) {
      const c = Array.isArray(t) ? t[a] || yt : t;
      l = _n(c, l);
    }
    n.push(l);
  }
  return n;
}
function Xi(e, t, { clamp: r = !0, ease: n, mixer: s } = {}) {
  const o = e.length;
  if (Ft(o === t.length, "Both input and output ranges must be the same length", "range-length"), o === 1)
    return () => t[0];
  if (o === 2 && t[0] === t[1])
    return () => t[1];
  const a = e[0] === e[1];
  e[0] > e[o - 1] && (e = [...e].reverse(), t = [...t].reverse());
  const l = Ef(t, n, s), c = l.length, d = (u) => {
    if (a && u < e[0])
      return t[0];
    let f = 0;
    if (c > 1)
      for (; f < e.length - 2 && !(u < e[f + 1]); f++)
        ;
    const h = /* @__PURE__ */ Wr(e[f], e[f + 1], u);
    return l[f](h);
  };
  return r ? (u) => d(Wt(e[0], e[o - 1], u)) : d;
}
function Rf(e, t) {
  const r = e[e.length - 1];
  for (let n = 1; n <= t; n++) {
    const s = /* @__PURE__ */ Wr(0, t, n);
    e.push(Ee(r, 1, s));
  }
}
function Tc(e) {
  const t = [0];
  return Rf(t, e.length - 1), t;
}
function Af(e, t) {
  return e.map((r) => r * t);
}
function zf(e, t) {
  return e.map(() => t || pc).splice(0, e.length - 1);
}
function Ar({ duration: e = 300, keyframes: t, times: r, ease: n = "easeInOut" }) {
  const s = Wu(n) ? n.map(Ko) : Ko(n), o = {
    done: !1,
    value: t[0]
  }, a = Af(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    r && r.length === t.length ? r : Tc(t),
    e
  ), l = Xi(a, t, {
    ease: Array.isArray(s) ? s : zf(t, s)
  });
  return {
    calculatedDuration: e,
    next: (c) => (o.value = l(c), o.done = c >= e, o)
  };
}
const Pf = (e) => e !== null;
function Ji(e, { repeat: t, repeatType: r = "loop" }, n, s = 1) {
  const o = e.filter(Pf), l = s < 0 || t && r !== "loop" && t % 2 === 1 ? 0 : o.length - 1;
  return !l || n === void 0 ? o[l] : n;
}
const Nf = {
  decay: si,
  inertia: si,
  tween: Ar,
  keyframes: Ar,
  spring: is
};
function Ec(e) {
  typeof e.type == "string" && (e.type = Nf[e.type]);
}
class Qi {
  constructor() {
    this.updateFinished();
  }
  get finished() {
    return this._finished;
  }
  updateFinished() {
    this._finished = new Promise((t) => {
      this.resolve = t;
    });
  }
  notifyFinished() {
    this.resolve();
  }
  /**
   * Allows the animation to be awaited.
   *
   * @deprecated Use `finished` instead.
   */
  then(t, r) {
    return this.finished.then(t, r);
  }
}
const Ff = (e) => e / 100;
class gs extends Qi {
  constructor(t) {
    super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.stop = () => {
      var n, s;
      const { motionValue: r } = this.options;
      r && r.updatedAt !== mt.now() && this.tick(mt.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), (s = (n = this.options).onStop) == null || s.call(n));
    }, this.options = t, this.initAnimation(), this.play(), t.autoplay === !1 && this.pause();
  }
  initAnimation() {
    const { options: t } = this;
    Ec(t);
    const { type: r = Ar, repeat: n = 0, repeatDelay: s = 0, repeatType: o, velocity: a = 0 } = t;
    let { keyframes: l } = t;
    const c = r || Ar;
    process.env.NODE_ENV !== "production" && c !== Ar && Ft(l.length <= 2, `Only two keyframes currently supported with spring and inertia animations. Trying to animate ${l}`, "spring-two-frames"), c !== Ar && typeof l[0] != "number" && (this.mixKeyframes = _n(Ff, kc(l[0], l[1])), l = [0, 100]);
    const d = c({ ...t, keyframes: l });
    o === "mirror" && (this.mirroredGenerator = c({
      ...t,
      keyframes: [...l].reverse(),
      velocity: -a
    })), d.calculatedDuration === null && (d.calculatedDuration = Ki(d));
    const { calculatedDuration: u } = d;
    this.calculatedDuration = u, this.resolvedDuration = u + s, this.totalDuration = this.resolvedDuration * (n + 1) - s, this.generator = d;
  }
  updateTime(t) {
    const r = Math.round(t - this.startTime) * this.playbackSpeed;
    this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = r;
  }
  tick(t, r = !1) {
    const { generator: n, totalDuration: s, mixKeyframes: o, mirroredGenerator: a, resolvedDuration: l, calculatedDuration: c } = this;
    if (this.startTime === null)
      return n.next(0);
    const { delay: d = 0, keyframes: u, repeat: f, repeatType: h, repeatDelay: m, type: g, onUpdate: p, finalKeyframe: y } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, t) : this.speed < 0 && (this.startTime = Math.min(t - s / this.speed, this.startTime)), r ? this.currentTime = t : this.updateTime(t);
    const j = this.currentTime - d * (this.playbackSpeed >= 0 ? 1 : -1), x = this.playbackSpeed >= 0 ? j < 0 : j > s;
    this.currentTime = Math.max(j, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = s);
    let b = this.currentTime, k = n;
    if (f) {
      const S = Math.min(this.currentTime, s) / l;
      let E = Math.floor(S), D = S % 1;
      !D && S >= 1 && (D = 1), D === 1 && E--, E = Math.min(E, f + 1), !!(E % 2) && (h === "reverse" ? (D = 1 - D, m && (D -= m / l)) : h === "mirror" && (k = a)), b = Wt(0, 1, D) * l;
    }
    const A = x ? { done: !1, value: u[0] } : k.next(b);
    o && (A.value = o(A.value));
    let { done: R } = A;
    !x && c !== null && (R = this.playbackSpeed >= 0 ? this.currentTime >= s : this.currentTime <= 0);
    const C = this.holdTime === null && (this.state === "finished" || this.state === "running" && R);
    return C && g !== si && (A.value = Ji(u, this.options, y, this.speed)), p && p(A.value), C && this.finish(), A;
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(t, r) {
    return this.finished.then(t, r);
  }
  get duration() {
    return /* @__PURE__ */ Vt(this.calculatedDuration);
  }
  get time() {
    return /* @__PURE__ */ Vt(this.currentTime);
  }
  set time(t) {
    var r;
    t = /* @__PURE__ */ Pt(t), this.currentTime = t, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = t : this.driver && (this.startTime = this.driver.now() - t / this.playbackSpeed), (r = this.driver) == null || r.start(!1);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(t) {
    this.updateTime(mt.now());
    const r = this.playbackSpeed !== t;
    this.playbackSpeed = t, r && (this.time = /* @__PURE__ */ Vt(this.currentTime));
  }
  play() {
    var s, o;
    if (this.isStopped)
      return;
    const { driver: t = bf, startTime: r } = this.options;
    this.driver || (this.driver = t((a) => this.tick(a))), (o = (s = this.options).onPlay) == null || o.call(s);
    const n = this.driver.now();
    this.state === "finished" ? (this.updateFinished(), this.startTime = n) : this.holdTime !== null ? this.startTime = n - this.holdTime : this.startTime || (this.startTime = r ?? n), this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
  }
  pause() {
    this.state = "paused", this.updateTime(mt.now()), this.holdTime = this.currentTime;
  }
  complete() {
    this.state !== "running" && this.play(), this.state = "finished", this.holdTime = null;
  }
  finish() {
    var t, r;
    this.notifyFinished(), this.teardown(), this.state = "finished", (r = (t = this.options).onComplete) == null || r.call(t);
  }
  cancel() {
    var t, r;
    this.holdTime = null, this.startTime = 0, this.tick(0), this.teardown(), (r = (t = this.options).onCancel) == null || r.call(t);
  }
  teardown() {
    this.state = "idle", this.stopDriver(), this.startTime = this.holdTime = null;
  }
  stopDriver() {
    this.driver && (this.driver.stop(), this.driver = void 0);
  }
  sample(t) {
    return this.startTime = 0, this.tick(t, !0);
  }
  attachTimeline(t) {
    var r;
    return this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear", this.initAnimation()), (r = this.driver) == null || r.stop(), t.observe(this);
  }
}
function Df(e) {
  for (let t = 1; t < e.length; t++)
    e[t] ?? (e[t] = e[t - 1]);
}
const hr = (e) => e * 180 / Math.PI, ii = (e) => {
  const t = hr(Math.atan2(e[1], e[0]));
  return oi(t);
}, $f = {
  x: 4,
  y: 5,
  translateX: 4,
  translateY: 5,
  scaleX: 0,
  scaleY: 3,
  scale: (e) => (Math.abs(e[0]) + Math.abs(e[3])) / 2,
  rotate: ii,
  rotateZ: ii,
  skewX: (e) => hr(Math.atan(e[1])),
  skewY: (e) => hr(Math.atan(e[2])),
  skew: (e) => (Math.abs(e[1]) + Math.abs(e[2])) / 2
}, oi = (e) => (e = e % 360, e < 0 && (e += 360), e), ra = ii, na = (e) => Math.sqrt(e[0] * e[0] + e[1] * e[1]), sa = (e) => Math.sqrt(e[4] * e[4] + e[5] * e[5]), Mf = {
  x: 12,
  y: 13,
  z: 14,
  translateX: 12,
  translateY: 13,
  translateZ: 14,
  scaleX: na,
  scaleY: sa,
  scale: (e) => (na(e) + sa(e)) / 2,
  rotateX: (e) => oi(hr(Math.atan2(e[6], e[5]))),
  rotateY: (e) => oi(hr(Math.atan2(-e[2], e[0]))),
  rotateZ: ra,
  rotate: ra,
  skewX: (e) => hr(Math.atan(e[4])),
  skewY: (e) => hr(Math.atan(e[1])),
  skew: (e) => (Math.abs(e[1]) + Math.abs(e[4])) / 2
};
function ai(e) {
  return e.includes("scale") ? 1 : 0;
}
function li(e, t) {
  if (!e || e === "none")
    return ai(t);
  const r = e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let n, s;
  if (r)
    n = Mf, s = r;
  else {
    const l = e.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    n = $f, s = l;
  }
  if (!s)
    return ai(t);
  const o = n[t], a = s[1].split(",").map(Vf);
  return typeof o == "function" ? o(a) : a[o];
}
const If = (e, t) => {
  const { transform: r = "none" } = getComputedStyle(e);
  return li(r, t);
};
function Vf(e) {
  return parseFloat(e.trim());
}
const Gr = [
  "transformPerspective",
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY"
], Kr = new Set(Gr), ia = (e) => e === Yr || e === ee, Lf = /* @__PURE__ */ new Set(["x", "y", "z"]), Bf = Gr.filter((e) => !Lf.has(e));
function Of(e) {
  const t = [];
  return Bf.forEach((r) => {
    const n = e.getValue(r);
    n !== void 0 && (t.push([r, n.get()]), n.set(r.startsWith("scale") ? 1 : 0));
  }), t;
}
const mr = {
  // Dimensions
  width: ({ x: e }, { paddingLeft: t = "0", paddingRight: r = "0" }) => e.max - e.min - parseFloat(t) - parseFloat(r),
  height: ({ y: e }, { paddingTop: t = "0", paddingBottom: r = "0" }) => e.max - e.min - parseFloat(t) - parseFloat(r),
  top: (e, { top: t }) => parseFloat(t),
  left: (e, { left: t }) => parseFloat(t),
  bottom: ({ y: e }, { top: t }) => parseFloat(t) + (e.max - e.min),
  right: ({ x: e }, { left: t }) => parseFloat(t) + (e.max - e.min),
  // Transform
  x: (e, { transform: t }) => li(t, "x"),
  y: (e, { transform: t }) => li(t, "y")
};
mr.translateX = mr.x;
mr.translateY = mr.y;
const gr = /* @__PURE__ */ new Set();
let ci = !1, di = !1, ui = !1;
function Rc() {
  if (di) {
    const e = Array.from(gr).filter((n) => n.needsMeasurement), t = new Set(e.map((n) => n.element)), r = /* @__PURE__ */ new Map();
    t.forEach((n) => {
      const s = Of(n);
      s.length && (r.set(n, s), n.render());
    }), e.forEach((n) => n.measureInitialState()), t.forEach((n) => {
      n.render();
      const s = r.get(n);
      s && s.forEach(([o, a]) => {
        var l;
        (l = n.getValue(o)) == null || l.set(a);
      });
    }), e.forEach((n) => n.measureEndState()), e.forEach((n) => {
      n.suspendedScrollY !== void 0 && window.scrollTo(0, n.suspendedScrollY);
    });
  }
  di = !1, ci = !1, gr.forEach((e) => e.complete(ui)), gr.clear();
}
function Ac() {
  gr.forEach((e) => {
    e.readKeyframes(), e.needsMeasurement && (di = !0);
  });
}
function qf() {
  ui = !0, Ac(), Rc(), ui = !1;
}
class eo {
  constructor(t, r, n, s, o, a = !1) {
    this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...t], this.onComplete = r, this.name = n, this.motionValue = s, this.element = o, this.isAsync = a;
  }
  scheduleResolve() {
    this.state = "scheduled", this.isAsync ? (gr.add(this), ci || (ci = !0, xe.read(Ac), xe.resolveKeyframes(Rc))) : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
    const { unresolvedKeyframes: t, name: r, element: n, motionValue: s } = this;
    if (t[0] === null) {
      const o = s == null ? void 0 : s.get(), a = t[t.length - 1];
      if (o !== void 0)
        t[0] = o;
      else if (n && r) {
        const l = n.readValue(r, a);
        l != null && (t[0] = l);
      }
      t[0] === void 0 && (t[0] = a), s && o === void 0 && s.set(t[0]);
    }
    Df(t);
  }
  setFinalKeyframe() {
  }
  measureInitialState() {
  }
  renderEndStyles() {
  }
  measureEndState() {
  }
  complete(t = !1) {
    this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, t), gr.delete(this);
  }
  cancel() {
    this.state === "scheduled" && (gr.delete(this), this.state = "pending");
  }
  resume() {
    this.state === "pending" && this.scheduleResolve();
  }
}
const Wf = (e) => e.startsWith("--");
function Uf(e, t, r) {
  Wf(t) ? e.style.setProperty(t, r) : e.style[t] = r;
}
const zc = /* @__PURE__ */ Li(() => window.ScrollTimeline !== void 0), Zf = {};
function Hf(e, t) {
  const r = /* @__PURE__ */ Li(e);
  return () => Zf[t] ?? r();
}
const Pc = /* @__PURE__ */ Hf(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return !1;
  }
  return !0;
}, "linearEasing"), an = ([e, t, r, n]) => `cubic-bezier(${e}, ${t}, ${r}, ${n})`, oa = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ an([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ an([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ an([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ an([0.33, 1.53, 0.69, 0.99])
};
function Nc(e, t) {
  if (e)
    return typeof e == "function" ? Pc() ? Sc(e, t) : "ease-out" : mc(e) ? an(e) : Array.isArray(e) ? e.map((r) => Nc(r, t) || oa.easeOut) : oa[e];
}
function Yf(e, t, r, { delay: n = 0, duration: s = 300, repeat: o = 0, repeatType: a = "loop", ease: l = "easeOut", times: c } = {}, d = void 0) {
  const u = {
    [t]: r
  };
  c && (u.offset = c);
  const f = Nc(l, s);
  Array.isArray(f) && (u.easing = f);
  const h = {
    delay: n,
    duration: s,
    easing: Array.isArray(f) ? "linear" : f,
    fill: "both",
    iterations: o + 1,
    direction: a === "reverse" ? "alternate" : "normal"
  };
  return d && (h.pseudoElement = d), e.animate(u, h);
}
function Fc(e) {
  return typeof e == "function" && "applyToOptions" in e;
}
function Gf({ type: e, ...t }) {
  return Fc(e) && Pc() ? e.applyToOptions(t) : (t.duration ?? (t.duration = 300), t.ease ?? (t.ease = "easeOut"), t);
}
class Kf extends Qi {
  constructor(t) {
    if (super(), this.finishedTime = null, this.isStopped = !1, !t)
      return;
    const { element: r, name: n, keyframes: s, pseudoElement: o, allowFlatten: a = !1, finalKeyframe: l, onComplete: c } = t;
    this.isPseudoElement = !!o, this.allowFlatten = a, this.options = t, Ft(typeof t.type != "string", `Mini animate() doesn't support "type" as a string.`, "mini-spring");
    const d = Gf(t);
    this.animation = Yf(r, n, s, d, o), d.autoplay === !1 && this.animation.pause(), this.animation.onfinish = () => {
      if (this.finishedTime = this.time, !o) {
        const u = Ji(s, this.options, l, this.speed);
        this.updateMotionValue ? this.updateMotionValue(u) : Uf(r, n, u), this.animation.cancel();
      }
      c == null || c(), this.notifyFinished();
    };
  }
  play() {
    this.isStopped || (this.animation.play(), this.state === "finished" && this.updateFinished());
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    var t, r;
    (r = (t = this.animation).finish) == null || r.call(t);
  }
  cancel() {
    try {
      this.animation.cancel();
    } catch {
    }
  }
  stop() {
    if (this.isStopped)
      return;
    this.isStopped = !0;
    const { state: t } = this;
    t === "idle" || t === "finished" || (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(), this.isPseudoElement || this.cancel());
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * In this method, we commit styles back to the DOM before cancelling
   * the animation.
   *
   * This is designed to be overridden by NativeAnimationExtended, which
   * will create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to also correctly calculate velocity for any subsequent animation
   * while deferring the commit until the next animation frame.
   */
  commitStyles() {
    var t, r;
    this.isPseudoElement || (r = (t = this.animation).commitStyles) == null || r.call(t);
  }
  get duration() {
    var r, n;
    const t = ((n = (r = this.animation.effect) == null ? void 0 : r.getComputedTiming) == null ? void 0 : n.call(r).duration) || 0;
    return /* @__PURE__ */ Vt(Number(t));
  }
  get time() {
    return /* @__PURE__ */ Vt(Number(this.animation.currentTime) || 0);
  }
  set time(t) {
    this.finishedTime = null, this.animation.currentTime = /* @__PURE__ */ Pt(t);
  }
  /**
   * The playback speed of the animation.
   * 1 = normal speed, 2 = double speed, 0.5 = half speed.
   */
  get speed() {
    return this.animation.playbackRate;
  }
  set speed(t) {
    t < 0 && (this.finishedTime = null), this.animation.playbackRate = t;
  }
  get state() {
    return this.finishedTime !== null ? "finished" : this.animation.playState;
  }
  get startTime() {
    return Number(this.animation.startTime);
  }
  set startTime(t) {
    this.animation.startTime = t;
  }
  /**
   * Attaches a timeline to the animation, for instance the `ScrollTimeline`.
   */
  attachTimeline({ timeline: t, observe: r }) {
    var n;
    return this.allowFlatten && ((n = this.animation.effect) == null || n.updateTiming({ easing: "linear" })), this.animation.onfinish = null, t && zc() ? (this.animation.timeline = t, yt) : r(this);
  }
}
const Dc = {
  anticipate: uc,
  backInOut: dc,
  circInOut: hc
};
function Xf(e) {
  return e in Dc;
}
function Jf(e) {
  typeof e.ease == "string" && Xf(e.ease) && (e.ease = Dc[e.ease]);
}
const aa = 10;
class Qf extends Kf {
  constructor(t) {
    Jf(t), Ec(t), super(t), t.startTime && (this.startTime = t.startTime), this.options = t;
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * Rather than read commited styles back out of the DOM, we can
   * create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to calculate velocity for any subsequent animation.
   */
  updateMotionValue(t) {
    const { motionValue: r, onUpdate: n, onComplete: s, element: o, ...a } = this.options;
    if (!r)
      return;
    if (t !== void 0) {
      r.set(t);
      return;
    }
    const l = new gs({
      ...a,
      autoplay: !1
    }), c = /* @__PURE__ */ Pt(this.finishedTime ?? this.time);
    r.setWithVelocity(l.sample(c - aa).value, l.sample(c).value, aa), l.stop();
  }
}
const la = (e, t) => t === "zIndex" ? !1 : !!(typeof e == "number" || Array.isArray(e) || typeof e == "string" && // It's animatable if we have a string
(sr.test(e) || e === "0") && // And it contains numbers and/or colors
!e.startsWith("url("));
function eh(e) {
  const t = e[0];
  if (e.length === 1)
    return !0;
  for (let r = 0; r < e.length; r++)
    if (e[r] !== t)
      return !0;
}
function th(e, t, r, n) {
  const s = e[0];
  if (s === null)
    return !1;
  if (t === "display" || t === "visibility")
    return !0;
  const o = e[e.length - 1], a = la(s, t), l = la(o, t);
  return Hr(a === l, `You are trying to animate ${t} from "${s}" to "${o}". "${a ? o : s}" is not an animatable value.`, "value-not-animatable"), !a || !l ? !1 : eh(e) || (r === "spring" || Fc(r)) && n;
}
function fi(e) {
  e.duration = 0, e.type;
}
const rh = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Could be re-enabled now we have support for linear() easing
  // "background-color"
]), nh = /* @__PURE__ */ Li(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function sh(e) {
  var u;
  const { motionValue: t, name: r, repeatDelay: n, repeatType: s, damping: o, type: a } = e;
  if (!(((u = t == null ? void 0 : t.owner) == null ? void 0 : u.current) instanceof HTMLElement))
    return !1;
  const { onUpdate: c, transformTemplate: d } = t.owner.getProps();
  return nh() && r && rh.has(r) && (r !== "transform" || !d) && /**
   * If we're outputting values to onUpdate then we can't use WAAPI as there's
   * no way to read the value from WAAPI every frame.
   */
  !c && !n && s !== "mirror" && o !== 0 && a !== "inertia";
}
const ih = 40;
class oh extends Qi {
  constructor({ autoplay: t = !0, delay: r = 0, type: n = "keyframes", repeat: s = 0, repeatDelay: o = 0, repeatType: a = "loop", keyframes: l, name: c, motionValue: d, element: u, ...f }) {
    var g;
    super(), this.stop = () => {
      var p, y;
      this._animation && (this._animation.stop(), (p = this.stopTimeline) == null || p.call(this)), (y = this.keyframeResolver) == null || y.cancel();
    }, this.createdAt = mt.now();
    const h = {
      autoplay: t,
      delay: r,
      type: n,
      repeat: s,
      repeatDelay: o,
      repeatType: a,
      name: c,
      motionValue: d,
      element: u,
      ...f
    }, m = (u == null ? void 0 : u.KeyframeResolver) || eo;
    this.keyframeResolver = new m(l, (p, y, j) => this.onKeyframesResolved(p, y, h, !j), c, d, u), (g = this.keyframeResolver) == null || g.scheduleResolve();
  }
  onKeyframesResolved(t, r, n, s) {
    this.keyframeResolver = void 0;
    const { name: o, type: a, velocity: l, delay: c, isHandoff: d, onUpdate: u } = n;
    this.resolvedAt = mt.now(), th(t, o, a, l) || ((Kt.instantAnimations || !c) && (u == null || u(Ji(t, n, r))), t[0] = t[t.length - 1], fi(n), n.repeat = 0);
    const h = {
      startTime: s ? this.resolvedAt ? this.resolvedAt - this.createdAt > ih ? this.resolvedAt : this.createdAt : this.createdAt : void 0,
      finalKeyframe: r,
      ...n,
      keyframes: t
    }, m = !d && sh(h) ? new Qf({
      ...h,
      element: h.motionValue.owner.current
    }) : new gs(h);
    m.finished.then(() => this.notifyFinished()).catch(yt), this.pendingTimeline && (this.stopTimeline = m.attachTimeline(this.pendingTimeline), this.pendingTimeline = void 0), this._animation = m;
  }
  get finished() {
    return this._animation ? this.animation.finished : this._finished;
  }
  then(t, r) {
    return this.finished.finally(t).then(() => {
    });
  }
  get animation() {
    var t;
    return this._animation || ((t = this.keyframeResolver) == null || t.resume(), qf()), this._animation;
  }
  get duration() {
    return this.animation.duration;
  }
  get time() {
    return this.animation.time;
  }
  set time(t) {
    this.animation.time = t;
  }
  get speed() {
    return this.animation.speed;
  }
  get state() {
    return this.animation.state;
  }
  set speed(t) {
    this.animation.speed = t;
  }
  get startTime() {
    return this.animation.startTime;
  }
  attachTimeline(t) {
    return this._animation ? this.stopTimeline = this.animation.attachTimeline(t) : this.pendingTimeline = t, () => this.stop();
  }
  play() {
    this.animation.play();
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.complete();
  }
  cancel() {
    var t;
    this._animation && this.animation.cancel(), (t = this.keyframeResolver) == null || t.cancel();
  }
}
const ah = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function lh(e) {
  const t = ah.exec(e);
  if (!t)
    return [,];
  const [, r, n, s] = t;
  return [`--${r ?? n}`, s];
}
const ch = 4;
function $c(e, t, r = 1) {
  Ft(r <= ch, `Max CSS variable fallback depth detected in property "${e}". This may indicate a circular fallback dependency.`, "max-css-var-depth");
  const [n, s] = lh(e);
  if (!n)
    return;
  const o = window.getComputedStyle(t).getPropertyValue(n);
  if (o) {
    const a = o.trim();
    return nc(a) ? parseFloat(a) : a;
  }
  return Zi(s) ? $c(s, t, r + 1) : s;
}
function to(e, t) {
  return (e == null ? void 0 : e[t]) ?? (e == null ? void 0 : e.default) ?? e;
}
const Mc = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...Gr
]), dh = {
  test: (e) => e === "auto",
  parse: (e) => e
}, Ic = (e) => (t) => t.test(e), Vc = [Yr, ee, Lt, er, rf, tf, dh], ca = (e) => Vc.find(Ic(e));
function uh(e) {
  return typeof e == "number" ? e === 0 : e !== null ? e === "none" || e === "0" || ic(e) : !0;
}
const fh = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function hh(e) {
  const [t, r] = e.slice(0, -1).split("(");
  if (t === "drop-shadow")
    return e;
  const [n] = r.match(Hi) || [];
  if (!n)
    return e;
  const s = r.replace(n, "");
  let o = fh.has(t) ? 1 : 0;
  return n !== r && (o *= 100), t + "(" + o + s + ")";
}
const ph = /\b([a-z-]*)\(.*?\)/gu, hi = {
  ...sr,
  getAnimatableNone: (e) => {
    const t = e.match(ph);
    return t ? t.map(hh).join(" ") : e;
  }
}, da = {
  ...Yr,
  transform: Math.round
}, mh = {
  rotate: er,
  rotateX: er,
  rotateY: er,
  rotateZ: er,
  scale: $n,
  scaleX: $n,
  scaleY: $n,
  scaleZ: $n,
  skew: er,
  skewX: er,
  skewY: er,
  distance: ee,
  translateX: ee,
  translateY: ee,
  translateZ: ee,
  x: ee,
  y: ee,
  z: ee,
  perspective: ee,
  transformPerspective: ee,
  opacity: yn,
  originX: Xo,
  originY: Xo,
  originZ: ee
}, ro = {
  // Border props
  borderWidth: ee,
  borderTopWidth: ee,
  borderRightWidth: ee,
  borderBottomWidth: ee,
  borderLeftWidth: ee,
  borderRadius: ee,
  radius: ee,
  borderTopLeftRadius: ee,
  borderTopRightRadius: ee,
  borderBottomRightRadius: ee,
  borderBottomLeftRadius: ee,
  // Positioning props
  width: ee,
  maxWidth: ee,
  height: ee,
  maxHeight: ee,
  top: ee,
  right: ee,
  bottom: ee,
  left: ee,
  // Spacing props
  padding: ee,
  paddingTop: ee,
  paddingRight: ee,
  paddingBottom: ee,
  paddingLeft: ee,
  margin: ee,
  marginTop: ee,
  marginRight: ee,
  marginBottom: ee,
  marginLeft: ee,
  // Misc
  backgroundPositionX: ee,
  backgroundPositionY: ee,
  ...mh,
  zIndex: da,
  // SVG
  fillOpacity: yn,
  strokeOpacity: yn,
  numOctaves: da
}, gh = {
  ...ro,
  // Color props
  color: qe,
  backgroundColor: qe,
  outlineColor: qe,
  fill: qe,
  stroke: qe,
  // Border props
  borderColor: qe,
  borderTopColor: qe,
  borderRightColor: qe,
  borderBottomColor: qe,
  borderLeftColor: qe,
  filter: hi,
  WebkitFilter: hi
}, Lc = (e) => gh[e];
function Bc(e, t) {
  let r = Lc(e);
  return r !== hi && (r = sr), r.getAnimatableNone ? r.getAnimatableNone(t) : void 0;
}
const xh = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function yh(e, t, r) {
  let n = 0, s;
  for (; n < e.length && !s; ) {
    const o = e[n];
    typeof o == "string" && !xh.has(o) && bn(o).values.length && (s = e[n]), n++;
  }
  if (s && r)
    for (const o of t)
      e[o] = Bc(r, s);
}
class bh extends eo {
  constructor(t, r, n, s, o) {
    super(t, r, n, s, o, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: t, element: r, name: n } = this;
    if (!r || !r.current)
      return;
    super.readKeyframes();
    for (let c = 0; c < t.length; c++) {
      let d = t[c];
      if (typeof d == "string" && (d = d.trim(), Zi(d))) {
        const u = $c(d, r.current);
        u !== void 0 && (t[c] = u), c === t.length - 1 && (this.finalKeyframe = d);
      }
    }
    if (this.resolveNoneKeyframes(), !Mc.has(n) || t.length !== 2)
      return;
    const [s, o] = t, a = ca(s), l = ca(o);
    if (a !== l)
      if (ia(a) && ia(l))
        for (let c = 0; c < t.length; c++) {
          const d = t[c];
          typeof d == "string" && (t[c] = parseFloat(d));
        }
      else mr[n] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: t, name: r } = this, n = [];
    for (let s = 0; s < t.length; s++)
      (t[s] === null || uh(t[s])) && n.push(s);
    n.length && yh(t, n, r);
  }
  measureInitialState() {
    const { element: t, unresolvedKeyframes: r, name: n } = this;
    if (!t || !t.current)
      return;
    n === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = mr[n](t.measureViewportBox(), window.getComputedStyle(t.current)), r[0] = this.measuredOrigin;
    const s = r[r.length - 1];
    s !== void 0 && t.getValue(n, s).jump(s, !1);
  }
  measureEndState() {
    var l;
    const { element: t, name: r, unresolvedKeyframes: n } = this;
    if (!t || !t.current)
      return;
    const s = t.getValue(r);
    s && s.jump(this.measuredOrigin, !1);
    const o = n.length - 1, a = n[o];
    n[o] = mr[r](t.measureViewportBox(), window.getComputedStyle(t.current)), a !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = a), (l = this.removedTransforms) != null && l.length && this.removedTransforms.forEach(([c, d]) => {
      t.getValue(c).set(d);
    }), this.resolveNoneKeyframes();
  }
}
function Oc(e, t, r) {
  if (e instanceof EventTarget)
    return [e];
  if (typeof e == "string") {
    const s = document.querySelectorAll(e);
    return s ? Array.from(s) : [];
  }
  return Array.from(e);
}
const qc = (e, t) => t && typeof e == "number" ? t.transform(e) : e;
function no(e) {
  return sc(e) && "offsetHeight" in e;
}
const ua = 30, vh = (e) => !isNaN(parseFloat(e)), dn = {
  current: void 0
};
class wh {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(t, r = {}) {
    this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (n) => {
      var o;
      const s = mt.now();
      if (this.updatedAt !== s && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(n), this.current !== this.prev && ((o = this.events.change) == null || o.notify(this.current), this.dependents))
        for (const a of this.dependents)
          a.dirty();
    }, this.hasAnimated = !1, this.setCurrent(t), this.owner = r.owner;
  }
  setCurrent(t) {
    this.current = t, this.updatedAt = mt.now(), this.canTrackVelocity === null && t !== void 0 && (this.canTrackVelocity = vh(this.current));
  }
  setPrevFrameValue(t = this.current) {
    this.prevFrameValue = t, this.prevUpdatedAt = this.updatedAt;
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(t) {
    return process.env.NODE_ENV !== "production" && ms(!1, 'value.onChange(callback) is deprecated. Switch to value.on("change", callback).'), this.on("change", t);
  }
  on(t, r) {
    this.events[t] || (this.events[t] = new Bi());
    const n = this.events[t].add(r);
    return t === "change" ? () => {
      n(), xe.read(() => {
        this.events.change.getSize() || this.stop();
      });
    } : n;
  }
  clearListeners() {
    for (const t in this.events)
      this.events[t].clear();
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   */
  attach(t, r) {
    this.passiveEffect = t, this.stopPassiveEffect = r;
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(t) {
    this.passiveEffect ? this.passiveEffect(t, this.updateAndNotify) : this.updateAndNotify(t);
  }
  setWithVelocity(t, r, n) {
    this.set(r), this.prev = void 0, this.prevFrameValue = t, this.prevUpdatedAt = this.updatedAt - n;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(t, r = !0) {
    this.updateAndNotify(t), this.prev = t, this.prevUpdatedAt = this.prevFrameValue = void 0, r && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
  dirty() {
    var t;
    (t = this.events.change) == null || t.notify(this.current);
  }
  addDependent(t) {
    this.dependents || (this.dependents = /* @__PURE__ */ new Set()), this.dependents.add(t);
  }
  removeDependent(t) {
    this.dependents && this.dependents.delete(t);
  }
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get() {
    return dn.current && dn.current.push(this), this.current;
  }
  /**
   * @public
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity() {
    const t = mt.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || t - this.updatedAt > ua)
      return 0;
    const r = Math.min(this.updatedAt - this.prevUpdatedAt, ua);
    return Oi(parseFloat(this.current) - parseFloat(this.prevFrameValue), r);
  }
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   */
  start(t) {
    return this.stop(), new Promise((r) => {
      this.hasAnimated = !0, this.animation = t(r), this.events.animationStart && this.events.animationStart.notify();
    }).then(() => {
      this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation();
    });
  }
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop() {
    this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy() {
    var t, r;
    (t = this.dependents) == null || t.clear(), (r = this.events.destroy) == null || r.notify(), this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
}
function At(e, t) {
  return new wh(e, t);
}
const { schedule: so } = /* @__PURE__ */ gc(queueMicrotask, !1), Tt = {
  x: !1,
  y: !1
};
function Wc() {
  return Tt.x || Tt.y;
}
function jh(e) {
  return e === "x" || e === "y" ? Tt[e] ? null : (Tt[e] = !0, () => {
    Tt[e] = !1;
  }) : Tt.x || Tt.y ? null : (Tt.x = Tt.y = !0, () => {
    Tt.x = Tt.y = !1;
  });
}
function Uc(e, t) {
  const r = Oc(e), n = new AbortController(), s = {
    passive: !0,
    ...t,
    signal: n.signal
  };
  return [r, s, () => n.abort()];
}
function fa(e) {
  return !(e.pointerType === "touch" || Wc());
}
function Ch(e, t, r = {}) {
  const [n, s, o] = Uc(e, r), a = (l) => {
    if (!fa(l))
      return;
    const { target: c } = l, d = t(c, l);
    if (typeof d != "function" || !c)
      return;
    const u = (f) => {
      fa(f) && (d(f), c.removeEventListener("pointerleave", u));
    };
    c.addEventListener("pointerleave", u, s);
  };
  return n.forEach((l) => {
    l.addEventListener("pointerenter", a, s);
  }), o;
}
const Zc = (e, t) => t ? e === t ? !0 : Zc(e, t.parentElement) : !1, io = (e) => e.pointerType === "mouse" ? typeof e.button != "number" || e.button <= 0 : e.isPrimary !== !1, kh = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function Sh(e) {
  return kh.has(e.tagName) || e.tabIndex !== -1;
}
const Hn = /* @__PURE__ */ new WeakSet();
function ha(e) {
  return (t) => {
    t.key === "Enter" && e(t);
  };
}
function Ls(e, t) {
  e.dispatchEvent(new PointerEvent("pointer" + t, { isPrimary: !0, bubbles: !0 }));
}
const _h = (e, t) => {
  const r = e.currentTarget;
  if (!r)
    return;
  const n = ha(() => {
    if (Hn.has(r))
      return;
    Ls(r, "down");
    const s = ha(() => {
      Ls(r, "up");
    }), o = () => Ls(r, "cancel");
    r.addEventListener("keyup", s, t), r.addEventListener("blur", o, t);
  });
  r.addEventListener("keydown", n, t), r.addEventListener("blur", () => r.removeEventListener("keydown", n), t);
};
function pa(e) {
  return io(e) && !Wc();
}
function Th(e, t, r = {}) {
  const [n, s, o] = Uc(e, r), a = (l) => {
    const c = l.currentTarget;
    if (!pa(l))
      return;
    Hn.add(c);
    const d = t(c, l), u = (m, g) => {
      window.removeEventListener("pointerup", f), window.removeEventListener("pointercancel", h), Hn.has(c) && Hn.delete(c), pa(m) && typeof d == "function" && d(m, { success: g });
    }, f = (m) => {
      u(m, c === window || c === document || r.useGlobalTarget || Zc(c, m.target));
    }, h = (m) => {
      u(m, !1);
    };
    window.addEventListener("pointerup", f, s), window.addEventListener("pointercancel", h, s);
  };
  return n.forEach((l) => {
    (r.useGlobalTarget ? window : l).addEventListener("pointerdown", a, s), no(l) && (l.addEventListener("focus", (d) => _h(d, s)), !Sh(l) && !l.hasAttribute("tabindex") && (l.tabIndex = 0));
  }), o;
}
function oo(e) {
  return sc(e) && "ownerSVGElement" in e;
}
const Yn = /* @__PURE__ */ new WeakMap();
let tr;
const Hc = (e, t, r) => (n, s) => s && s[0] ? s[0][e + "Size"] : oo(n) && "getBBox" in n ? n.getBBox()[t] : n[r], Eh = /* @__PURE__ */ Hc("inline", "width", "offsetWidth"), Rh = /* @__PURE__ */ Hc("block", "height", "offsetHeight");
function Ah({ target: e, borderBoxSize: t }) {
  var r;
  (r = Yn.get(e)) == null || r.forEach((n) => {
    n(e, {
      get width() {
        return Eh(e, t);
      },
      get height() {
        return Rh(e, t);
      }
    });
  });
}
function zh(e) {
  e.forEach(Ah);
}
function Ph() {
  typeof ResizeObserver > "u" || (tr = new ResizeObserver(zh));
}
function Nh(e, t) {
  tr || Ph();
  const r = Oc(e);
  return r.forEach((n) => {
    let s = Yn.get(n);
    s || (s = /* @__PURE__ */ new Set(), Yn.set(n, s)), s.add(t), tr == null || tr.observe(n);
  }), () => {
    r.forEach((n) => {
      const s = Yn.get(n);
      s == null || s.delete(t), s != null && s.size || tr == null || tr.unobserve(n);
    });
  };
}
const Gn = /* @__PURE__ */ new Set();
let zr;
function Fh() {
  zr = () => {
    const e = {
      get width() {
        return window.innerWidth;
      },
      get height() {
        return window.innerHeight;
      }
    };
    Gn.forEach((t) => t(e));
  }, window.addEventListener("resize", zr);
}
function Dh(e) {
  return Gn.add(e), zr || Fh(), () => {
    Gn.delete(e), !Gn.size && typeof zr == "function" && (window.removeEventListener("resize", zr), zr = void 0);
  };
}
function $h(e, t) {
  return typeof e == "function" ? Dh(e) : Nh(e, t);
}
function Yc(e, t) {
  let r;
  const n = () => {
    const { currentTime: s } = t, a = (s === null ? 0 : s.value) / 100;
    r !== a && e(a), r = a;
  };
  return xe.preUpdate(n, !0), () => Dt(n);
}
function Mh(e) {
  return oo(e) && e.tagName === "svg";
}
function Ih(...e) {
  const t = !Array.isArray(e[0]), r = t ? 0 : -1, n = e[0 + r], s = e[1 + r], o = e[2 + r], a = e[3 + r], l = Xi(s, o, a);
  return t ? l(n) : l;
}
const Qe = (e) => !!(e && e.getVelocity);
function Vh(e, t, r) {
  const n = e.get();
  let s = null, o = n, a;
  const l = typeof n == "string" ? n.replace(/[\d.-]/g, "") : void 0, c = () => {
    s && (s.stop(), s = null);
  }, d = () => {
    c(), s = new gs({
      keyframes: [ga(e.get()), ga(o)],
      velocity: e.getVelocity(),
      type: "spring",
      restDelta: 1e-3,
      restSpeed: 0.01,
      ...r,
      onUpdate: a
    });
  };
  if (e.attach((u, f) => (o = u, a = (h) => f(ma(h, l)), xe.postRender(d), e.get()), c), Qe(t)) {
    const u = t.on("change", (h) => e.set(ma(h, l))), f = e.on("destroy", u);
    return () => {
      u(), f();
    };
  }
  return c;
}
function ma(e, t) {
  return t ? e + t : e;
}
function ga(e) {
  return typeof e == "number" ? e : parseFloat(e);
}
const Lh = [...Vc, qe, sr], Bh = (e) => Lh.find(Ic(e)), Rn = Ut({
  transformPagePoint: (e) => e,
  isStatic: !1,
  reducedMotion: "never"
});
class Oh extends Ni.Component {
  getSnapshotBeforeUpdate(t) {
    const r = this.props.childRef.current;
    if (r && t.isPresent && !this.props.isPresent) {
      const n = r.offsetParent, s = no(n) && n.offsetWidth || 0, o = this.props.sizeRef.current;
      o.height = r.offsetHeight || 0, o.width = r.offsetWidth || 0, o.top = r.offsetTop, o.left = r.offsetLeft, o.right = s - o.width - o.left;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function qh({ children: e, isPresent: t, anchorX: r, root: n }) {
  const s = Fi(), o = ae(null), a = ae({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0
  }), { nonce: l } = ke(Rn);
  return Di(() => {
    const { width: c, height: d, top: u, left: f, right: h } = a.current;
    if (t || !o.current || !c || !d)
      return;
    const m = r === "left" ? `left: ${f}` : `right: ${h}`;
    o.current.dataset.motionPopId = s;
    const g = document.createElement("style");
    l && (g.nonce = l);
    const p = n ?? document.head;
    return p.appendChild(g), g.sheet && g.sheet.insertRule(`
          [data-motion-pop-id="${s}"] {
            position: absolute !important;
            width: ${c}px !important;
            height: ${d}px !important;
            ${m}px !important;
            top: ${u}px !important;
          }
        `), () => {
      p.contains(g) && p.removeChild(g);
    };
  }, [t]), i.jsx(Oh, { isPresent: t, childRef: o, sizeRef: a, children: Ni.cloneElement(e, { ref: o }) });
}
const Wh = ({ children: e, initial: t, isPresent: r, onExitComplete: n, custom: s, presenceAffectsLayout: o, mode: a, anchorX: l, root: c }) => {
  const d = Zr(Uh), u = Fi();
  let f = !0, h = Gt(() => (f = !1, {
    id: u,
    initial: t,
    isPresent: r,
    custom: s,
    onExitComplete: (m) => {
      d.set(m, !0);
      for (const g of d.values())
        if (!g)
          return;
      n && n();
    },
    register: (m) => (d.set(m, !1), () => d.delete(m))
  }), [r, d, n]);
  return o && f && (h = { ...h }), Gt(() => {
    d.forEach((m, g) => d.set(g, !1));
  }, [r]), Ni.useEffect(() => {
    !r && !d.size && n && n();
  }, [r]), a === "popLayout" && (e = i.jsx(qh, { isPresent: r, anchorX: l, root: c, children: e })), i.jsx(ps.Provider, { value: h, children: e });
};
function Uh() {
  return /* @__PURE__ */ new Map();
}
function Gc(e = !0) {
  const t = ke(ps);
  if (t === null)
    return [!0, null];
  const { isPresent: r, onExitComplete: n, register: s } = t, o = Fi();
  ie(() => {
    if (e)
      return s(o);
  }, [e]);
  const a = qr(() => e && n && n(o), [o, n, e]);
  return !r && n ? [!1, a] : [!0];
}
const Mn = (e) => e.key || "";
function xa(e) {
  const t = [];
  return Su.forEach(e, (r) => {
    _u(r) && t.push(r);
  }), t;
}
const Zh = ({ children: e, custom: t, initial: r = !0, onExitComplete: n, presenceAffectsLayout: s = !0, mode: o = "sync", propagate: a = !1, anchorX: l = "left", root: c }) => {
  const [d, u] = Gc(a), f = Gt(() => xa(e), [e]), h = a && !d ? [] : f.map(Mn), m = ae(!0), g = ae(f), p = Zr(() => /* @__PURE__ */ new Map()), [y, j] = V(f), [x, b] = V(f);
  hs(() => {
    m.current = !1, g.current = f;
    for (let R = 0; R < x.length; R++) {
      const C = Mn(x[R]);
      h.includes(C) ? p.delete(C) : p.get(C) !== !0 && p.set(C, !1);
    }
  }, [x, h.length, h.join("-")]);
  const k = [];
  if (f !== y) {
    let R = [...f];
    for (let C = 0; C < x.length; C++) {
      const S = x[C], E = Mn(S);
      h.includes(E) || (R.splice(C, 0, S), k.push(S));
    }
    return o === "wait" && k.length && (R = k), b(xa(R)), j(f), null;
  }
  process.env.NODE_ENV !== "production" && o === "wait" && x.length > 1 && console.warn(`You're attempting to animate multiple children within AnimatePresence, but its mode is set to "wait". This will lead to odd visual behaviour.`);
  const { forceRender: A } = ke($i);
  return i.jsx(i.Fragment, { children: x.map((R) => {
    const C = Mn(R), S = a && !d ? !1 : f === x || h.includes(C), E = () => {
      if (p.has(C))
        p.set(C, !0);
      else
        return;
      let D = !0;
      p.forEach((L) => {
        L || (D = !1);
      }), D && (A == null || A(), b(g.current), a && (u == null || u()), n && n());
    };
    return i.jsx(Wh, { isPresent: S, initial: !m.current || r ? void 0 : !1, custom: t, presenceAffectsLayout: s, mode: o, root: c, onExitComplete: S ? void 0 : E, anchorX: l, children: R }, C);
  }) });
}, Kc = Ut({ strict: !1 }), ya = {
  animation: [
    "animate",
    "variants",
    "whileHover",
    "whileTap",
    "exit",
    "whileInView",
    "whileFocus",
    "whileDrag"
  ],
  exit: ["exit"],
  drag: ["drag", "dragControls"],
  focus: ["whileFocus"],
  hover: ["whileHover", "onHoverStart", "onHoverEnd"],
  tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
  pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
  inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
  layout: ["layout", "layoutId"]
}, Ur = {};
for (const e in ya)
  Ur[e] = {
    isEnabled: (t) => ya[e].some((r) => !!t[r])
  };
function Hh(e) {
  for (const t in e)
    Ur[t] = {
      ...Ur[t],
      ...e[t]
    };
}
const Yh = /* @__PURE__ */ new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "ignoreStrict",
  "viewport"
]);
function os(e) {
  return e.startsWith("while") || e.startsWith("drag") && e !== "draggable" || e.startsWith("layout") || e.startsWith("onTap") || e.startsWith("onPan") || e.startsWith("onLayout") || Yh.has(e);
}
let Xc = (e) => !os(e);
function Gh(e) {
  typeof e == "function" && (Xc = (t) => t.startsWith("on") ? !os(t) : e(t));
}
try {
  Gh(require("@emotion/is-prop-valid").default);
} catch {
}
function Kh(e, t, r) {
  const n = {};
  for (const s in e)
    s === "values" && typeof e.values == "object" || (Xc(s) || r === !0 && os(s) || !t && !os(s) || // If trying to use native HTML drag events, forward drag listeners
    e.draggable && s.startsWith("onDrag")) && (n[s] = e[s]);
  return n;
}
const xs = /* @__PURE__ */ Ut({});
function ys(e) {
  return e !== null && typeof e == "object" && typeof e.start == "function";
}
function vn(e) {
  return typeof e == "string" || Array.isArray(e);
}
const ao = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], lo = ["initial", ...ao];
function bs(e) {
  return ys(e.animate) || lo.some((t) => vn(e[t]));
}
function Jc(e) {
  return !!(bs(e) || e.variants);
}
function Xh(e, t) {
  if (bs(e)) {
    const { initial: r, animate: n } = e;
    return {
      initial: r === !1 || vn(r) ? r : void 0,
      animate: vn(n) ? n : void 0
    };
  }
  return e.inherit !== !1 ? t : {};
}
function Jh(e) {
  const { initial: t, animate: r } = Xh(e, ke(xs));
  return Gt(() => ({ initial: t, animate: r }), [ba(t), ba(r)]);
}
function ba(e) {
  return Array.isArray(e) ? e.join(" ") : e;
}
const wn = {};
function Qh(e) {
  for (const t in e)
    wn[t] = e[t], Ui(t) && (wn[t].isCSSVariable = !0);
}
function Qc(e, { layout: t, layoutId: r }) {
  return Kr.has(e) || e.startsWith("origin") || (t || r !== void 0) && (!!wn[e] || e === "opacity");
}
const ep = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, tp = Gr.length;
function rp(e, t, r) {
  let n = "", s = !0;
  for (let o = 0; o < tp; o++) {
    const a = Gr[o], l = e[a];
    if (l === void 0)
      continue;
    let c = !0;
    if (typeof l == "number" ? c = l === (a.startsWith("scale") ? 1 : 0) : c = parseFloat(l) === 0, !c || r) {
      const d = qc(l, ro[a]);
      if (!c) {
        s = !1;
        const u = ep[a] || a;
        n += `${u}(${d}) `;
      }
      r && (t[a] = d);
    }
  }
  return n = n.trim(), r ? n = r(t, s ? "" : n) : s && (n = "none"), n;
}
function co(e, t, r) {
  const { style: n, vars: s, transformOrigin: o } = e;
  let a = !1, l = !1;
  for (const c in t) {
    const d = t[c];
    if (Kr.has(c)) {
      a = !0;
      continue;
    } else if (Ui(c)) {
      s[c] = d;
      continue;
    } else {
      const u = qc(d, ro[c]);
      c.startsWith("origin") ? (l = !0, o[c] = u) : n[c] = u;
    }
  }
  if (t.transform || (a || r ? n.transform = rp(t, e.transform, r) : n.transform && (n.transform = "none")), l) {
    const { originX: c = "50%", originY: d = "50%", originZ: u = 0 } = o;
    n.transformOrigin = `${c} ${d} ${u}`;
  }
}
const uo = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function ed(e, t, r) {
  for (const n in t)
    !Qe(t[n]) && !Qc(n, r) && (e[n] = t[n]);
}
function np({ transformTemplate: e }, t) {
  return Gt(() => {
    const r = uo();
    return co(r, t, e), Object.assign({}, r.vars, r.style);
  }, [t]);
}
function sp(e, t) {
  const r = e.style || {}, n = {};
  return ed(n, r, e), Object.assign(n, np(e, t)), n;
}
function ip(e, t) {
  const r = {}, n = sp(e, t);
  return e.drag && e.dragListener !== !1 && (r.draggable = !1, n.userSelect = n.WebkitUserSelect = n.WebkitTouchCallout = "none", n.touchAction = e.drag === !0 ? "none" : `pan-${e.drag === "x" ? "y" : "x"}`), e.tabIndex === void 0 && (e.onTap || e.onTapStart || e.whileTap) && (r.tabIndex = 0), r.style = n, r;
}
const op = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, ap = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function lp(e, t, r = 1, n = 0, s = !0) {
  e.pathLength = 1;
  const o = s ? op : ap;
  e[o.offset] = ee.transform(-n);
  const a = ee.transform(t), l = ee.transform(r);
  e[o.array] = `${a} ${l}`;
}
function td(e, {
  attrX: t,
  attrY: r,
  attrScale: n,
  pathLength: s,
  pathSpacing: o = 1,
  pathOffset: a = 0,
  // This is object creation, which we try to avoid per-frame.
  ...l
}, c, d, u) {
  if (co(e, l, d), c) {
    e.style.viewBox && (e.attrs.viewBox = e.style.viewBox);
    return;
  }
  e.attrs = e.style, e.style = {};
  const { attrs: f, style: h } = e;
  f.transform && (h.transform = f.transform, delete f.transform), (h.transform || f.transformOrigin) && (h.transformOrigin = f.transformOrigin ?? "50% 50%", delete f.transformOrigin), h.transform && (h.transformBox = (u == null ? void 0 : u.transformBox) ?? "fill-box", delete f.transformBox), t !== void 0 && (f.x = t), r !== void 0 && (f.y = r), n !== void 0 && (f.scale = n), s !== void 0 && lp(f, s, o, a, !1);
}
const rd = () => ({
  ...uo(),
  attrs: {}
}), nd = (e) => typeof e == "string" && e.toLowerCase() === "svg";
function cp(e, t, r, n) {
  const s = Gt(() => {
    const o = rd();
    return td(o, t, nd(n), e.transformTemplate, e.style), {
      ...o.attrs,
      style: { ...o.style }
    };
  }, [t]);
  if (e.style) {
    const o = {};
    ed(o, e.style, e), s.style = { ...o, ...s.style };
  }
  return s;
}
const dp = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view"
];
function fo(e) {
  return (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof e != "string" || /**
     * If it contains a dash, the element is a custom HTML webcomponent.
     */
    e.includes("-") ? !1 : (
      /**
       * If it's in our list of lowercase SVG tags, it's an SVG component
       */
      !!(dp.indexOf(e) > -1 || /**
       * If it contains a capital letter, it's an SVG component
       */
      /[A-Z]/u.test(e))
    )
  );
}
function up(e, t, r, { latestValues: n }, s, o = !1) {
  const l = (fo(e) ? cp : ip)(t, n, s, e), c = Kh(t, typeof e == "string", o), d = e !== tc ? { ...c, ...l, ref: r } : {}, { children: u } = t, f = Gt(() => Qe(u) ? u.get() : u, [u]);
  return Tu(e, {
    ...d,
    children: f
  });
}
function va(e) {
  const t = [{}, {}];
  return e == null || e.values.forEach((r, n) => {
    t[0][n] = r.get(), t[1][n] = r.getVelocity();
  }), t;
}
function ho(e, t, r, n) {
  if (typeof t == "function") {
    const [s, o] = va(n);
    t = t(r !== void 0 ? r : e.custom, s, o);
  }
  if (typeof t == "string" && (t = e.variants && e.variants[t]), typeof t == "function") {
    const [s, o] = va(n);
    t = t(r !== void 0 ? r : e.custom, s, o);
  }
  return t;
}
function Kn(e) {
  return Qe(e) ? e.get() : e;
}
function fp({ scrapeMotionValuesFromProps: e, createRenderState: t }, r, n, s) {
  return {
    latestValues: hp(r, n, s, e),
    renderState: t()
  };
}
function hp(e, t, r, n) {
  const s = {}, o = n(e, {});
  for (const h in o)
    s[h] = Kn(o[h]);
  let { initial: a, animate: l } = e;
  const c = bs(e), d = Jc(e);
  t && d && !c && e.inherit !== !1 && (a === void 0 && (a = t.initial), l === void 0 && (l = t.animate));
  let u = r ? r.initial === !1 : !1;
  u = u || a === !1;
  const f = u ? l : a;
  if (f && typeof f != "boolean" && !ys(f)) {
    const h = Array.isArray(f) ? f : [f];
    for (let m = 0; m < h.length; m++) {
      const g = ho(e, h[m]);
      if (g) {
        const { transitionEnd: p, transition: y, ...j } = g;
        for (const x in j) {
          let b = j[x];
          if (Array.isArray(b)) {
            const k = u ? b.length - 1 : 0;
            b = b[k];
          }
          b !== null && (s[x] = b);
        }
        for (const x in p)
          s[x] = p[x];
      }
    }
  }
  return s;
}
const sd = (e) => (t, r) => {
  const n = ke(xs), s = ke(ps), o = () => fp(e, t, n, s);
  return r ? o() : Zr(o);
};
function po(e, t, r) {
  var o;
  const { style: n } = e, s = {};
  for (const a in n)
    (Qe(n[a]) || t.style && Qe(t.style[a]) || Qc(a, e) || ((o = r == null ? void 0 : r.getValue(a)) == null ? void 0 : o.liveStyle) !== void 0) && (s[a] = n[a]);
  return s;
}
const pp = /* @__PURE__ */ sd({
  scrapeMotionValuesFromProps: po,
  createRenderState: uo
});
function id(e, t, r) {
  const n = po(e, t, r);
  for (const s in e)
    if (Qe(e[s]) || Qe(t[s])) {
      const o = Gr.indexOf(s) !== -1 ? "attr" + s.charAt(0).toUpperCase() + s.substring(1) : s;
      n[o] = e[s];
    }
  return n;
}
const mp = /* @__PURE__ */ sd({
  scrapeMotionValuesFromProps: id,
  createRenderState: rd
}), gp = Symbol.for("motionComponentSymbol");
function Pr(e) {
  return e && typeof e == "object" && Object.prototype.hasOwnProperty.call(e, "current");
}
function xp(e, t, r) {
  return qr(
    (n) => {
      n && e.onMount && e.onMount(n), t && (n ? t.mount(n) : t.unmount()), r && (typeof r == "function" ? r(n) : Pr(r) && (r.current = n));
    },
    /**
     * Only pass a new ref callback to React if we've received a visual element
     * factory. Otherwise we'll be mounting/remounting every time externalRef
     * or other dependencies change.
     */
    [t]
  );
}
const mo = (e) => e.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(), yp = "framerAppearId", od = "data-" + mo(yp), ad = Ut({});
function bp(e, t, r, n, s) {
  var p, y;
  const { visualElement: o } = ke(xs), a = ke(Kc), l = ke(ps), c = ke(Rn).reducedMotion, d = ae(null);
  n = n || a.renderer, !d.current && n && (d.current = n(e, {
    visualState: t,
    parent: o,
    props: r,
    presenceContext: l,
    blockInitialAnimation: l ? l.initial === !1 : !1,
    reducedMotionConfig: c
  }));
  const u = d.current, f = ke(ad);
  u && !u.projection && s && (u.type === "html" || u.type === "svg") && vp(d.current, r, s, f);
  const h = ae(!1);
  Di(() => {
    u && h.current && u.update(r, l);
  });
  const m = r[od], g = ae(!!m && !((p = window.MotionHandoffIsComplete) != null && p.call(window, m)) && ((y = window.MotionHasOptimisedAnimation) == null ? void 0 : y.call(window, m)));
  return hs(() => {
    u && (h.current = !0, window.MotionIsMounted = !0, u.updateFeatures(), u.scheduleRenderMicrotask(), g.current && u.animationState && u.animationState.animateChanges());
  }), ie(() => {
    u && (!g.current && u.animationState && u.animationState.animateChanges(), g.current && (queueMicrotask(() => {
      var j;
      (j = window.MotionHandoffMarkAsComplete) == null || j.call(window, m);
    }), g.current = !1), u.enteringChildren = void 0);
  }), u;
}
function vp(e, t, r, n) {
  const { layoutId: s, layout: o, drag: a, dragConstraints: l, layoutScroll: c, layoutRoot: d, layoutCrossfade: u } = t;
  e.projection = new r(e.latestValues, t["data-framer-portal-id"] ? void 0 : ld(e.parent)), e.projection.setOptions({
    layoutId: s,
    layout: o,
    alwaysMeasureLayout: !!a || l && Pr(l),
    visualElement: e,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof o == "string" ? o : "both",
    initialPromotionConfig: n,
    crossfade: u,
    layoutScroll: c,
    layoutRoot: d
  });
}
function ld(e) {
  if (e)
    return e.options.allowProjection !== !1 ? e.projection : ld(e.parent);
}
function Bs(e, { forwardMotionProps: t = !1 } = {}, r, n) {
  r && Hh(r);
  const s = fo(e) ? mp : pp;
  function o(l, c) {
    let d;
    const u = {
      ...ke(Rn),
      ...l,
      layoutId: wp(l)
    }, { isStatic: f } = u, h = Jh(l), m = s(l, f);
    if (!f && Mi) {
      jp(u, r);
      const g = Cp(u);
      d = g.MeasureLayout, h.visualElement = bp(e, m, u, n, g.ProjectionNode);
    }
    return i.jsxs(xs.Provider, { value: h, children: [d && h.visualElement ? i.jsx(d, { visualElement: h.visualElement, ...u }) : null, up(e, l, xp(m, h.visualElement, c), m, f, t)] });
  }
  o.displayName = `motion.${typeof e == "string" ? e : `create(${e.displayName ?? e.name ?? ""})`}`;
  const a = Eu(o);
  return a[gp] = e, a;
}
function wp({ layoutId: e }) {
  const t = ke($i).id;
  return t && e !== void 0 ? t + "-" + e : e;
}
function jp(e, t) {
  const r = ke(Kc).strict;
  if (process.env.NODE_ENV !== "production" && t && r) {
    const n = "You have rendered a `motion` component within a `LazyMotion` component. This will break tree shaking. Import and render a `m` component instead.";
    e.ignoreStrict ? Hr(!1, n, "lazy-strict-mode") : Ft(!1, n, "lazy-strict-mode");
  }
}
function Cp(e) {
  const { drag: t, layout: r } = Ur;
  if (!t && !r)
    return {};
  const n = { ...t, ...r };
  return {
    MeasureLayout: t != null && t.isEnabled(e) || r != null && r.isEnabled(e) ? n.MeasureLayout : void 0,
    ProjectionNode: n.ProjectionNode
  };
}
function kp(e, t) {
  if (typeof Proxy > "u")
    return Bs;
  const r = /* @__PURE__ */ new Map(), n = (o, a) => Bs(o, a, e, t), s = (o, a) => (process.env.NODE_ENV !== "production" && ms(!1, "motion() is deprecated. Use motion.create() instead."), n(o, a));
  return new Proxy(s, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (o, a) => a === "create" ? n : (r.has(a) || r.set(a, Bs(a, void 0, e, t)), r.get(a))
  });
}
function cd({ top: e, left: t, right: r, bottom: n }) {
  return {
    x: { min: t, max: r },
    y: { min: e, max: n }
  };
}
function Sp({ x: e, y: t }) {
  return { top: t.min, right: e.max, bottom: t.max, left: e.min };
}
function _p(e, t) {
  if (!t)
    return e;
  const r = t({ x: e.left, y: e.top }), n = t({ x: e.right, y: e.bottom });
  return {
    top: r.y,
    left: r.x,
    bottom: n.y,
    right: n.x
  };
}
function Os(e) {
  return e === void 0 || e === 1;
}
function pi({ scale: e, scaleX: t, scaleY: r }) {
  return !Os(e) || !Os(t) || !Os(r);
}
function ur(e) {
  return pi(e) || dd(e) || e.z || e.rotate || e.rotateX || e.rotateY || e.skewX || e.skewY;
}
function dd(e) {
  return wa(e.x) || wa(e.y);
}
function wa(e) {
  return e && e !== "0%";
}
function as(e, t, r) {
  const n = e - r, s = t * n;
  return r + s;
}
function ja(e, t, r, n, s) {
  return s !== void 0 && (e = as(e, s, n)), as(e, r, n) + t;
}
function mi(e, t = 0, r = 1, n, s) {
  e.min = ja(e.min, t, r, n, s), e.max = ja(e.max, t, r, n, s);
}
function ud(e, { x: t, y: r }) {
  mi(e.x, t.translate, t.scale, t.originPoint), mi(e.y, r.translate, r.scale, r.originPoint);
}
const Ca = 0.999999999999, ka = 1.0000000000001;
function Tp(e, t, r, n = !1) {
  const s = r.length;
  if (!s)
    return;
  t.x = t.y = 1;
  let o, a;
  for (let l = 0; l < s; l++) {
    o = r[l], a = o.projectionDelta;
    const { visualElement: c } = o.options;
    c && c.props.style && c.props.style.display === "contents" || (n && o.options.layoutScroll && o.scroll && o !== o.root && Fr(e, {
      x: -o.scroll.offset.x,
      y: -o.scroll.offset.y
    }), a && (t.x *= a.x.scale, t.y *= a.y.scale, ud(e, a)), n && ur(o.latestValues) && Fr(e, o.latestValues));
  }
  t.x < ka && t.x > Ca && (t.x = 1), t.y < ka && t.y > Ca && (t.y = 1);
}
function Nr(e, t) {
  e.min = e.min + t, e.max = e.max + t;
}
function Sa(e, t, r, n, s = 0.5) {
  const o = Ee(e.min, e.max, s);
  mi(e, t, r, o, n);
}
function Fr(e, t) {
  Sa(e.x, t.x, t.scaleX, t.scale, t.originX), Sa(e.y, t.y, t.scaleY, t.scale, t.originY);
}
function fd(e, t) {
  return cd(_p(e.getBoundingClientRect(), t));
}
function Ep(e, t, r) {
  const n = fd(e, r), { scroll: s } = t;
  return s && (Nr(n.x, s.offset.x), Nr(n.y, s.offset.y)), n;
}
const _a = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), Dr = () => ({
  x: _a(),
  y: _a()
}), Ta = () => ({ min: 0, max: 0 }), De = () => ({
  x: Ta(),
  y: Ta()
}), gi = { current: null }, hd = { current: !1 };
function Rp() {
  if (hd.current = !0, !!Mi)
    if (window.matchMedia) {
      const e = window.matchMedia("(prefers-reduced-motion)"), t = () => gi.current = e.matches;
      e.addEventListener("change", t), t();
    } else
      gi.current = !1;
}
const Ap = /* @__PURE__ */ new WeakMap();
function zp(e, t, r) {
  for (const n in t) {
    const s = t[n], o = r[n];
    if (Qe(s))
      e.addValue(n, s);
    else if (Qe(o))
      e.addValue(n, At(s, { owner: e }));
    else if (o !== s)
      if (e.hasValue(n)) {
        const a = e.getValue(n);
        a.liveStyle === !0 ? a.jump(s) : a.hasAnimated || a.set(s);
      } else {
        const a = e.getStaticValue(n);
        e.addValue(n, At(a !== void 0 ? a : s, { owner: e }));
      }
  }
  for (const n in r)
    t[n] === void 0 && e.removeValue(n);
  return t;
}
const Ea = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
class Pp {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(t, r, n) {
    return {};
  }
  constructor({ parent: t, props: r, presenceContext: n, reducedMotionConfig: s, blockInitialAnimation: o, visualState: a }, l = {}) {
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = eo, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const h = mt.now();
      this.renderScheduledAt < h && (this.renderScheduledAt = h, xe.render(this.render, !1, !0));
    };
    const { latestValues: c, renderState: d } = a;
    this.latestValues = c, this.baseTarget = { ...c }, this.initialValues = r.initial ? { ...c } : {}, this.renderState = d, this.parent = t, this.props = r, this.presenceContext = n, this.depth = t ? t.depth + 1 : 0, this.reducedMotionConfig = s, this.options = l, this.blockInitialAnimation = !!o, this.isControllingVariants = bs(r), this.isVariantNode = Jc(r), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(t && t.current);
    const { willChange: u, ...f } = this.scrapeMotionValuesFromProps(r, {}, this);
    for (const h in f) {
      const m = f[h];
      c[h] !== void 0 && Qe(m) && m.set(c[h]);
    }
  }
  mount(t) {
    var r;
    this.current = t, Ap.set(t, this), this.projection && !this.projection.instance && this.projection.mount(t), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((n, s) => this.bindToMotionValue(s, n)), hd.current || Rp(), this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : gi.current, process.env.NODE_ENV !== "production" && ms(this.shouldReduceMotion !== !0, "You have Reduced Motion enabled on your device. Animations may not appear as expected.", "reduced-motion-disabled"), (r = this.parent) == null || r.addChild(this), this.update(this.props, this.presenceContext);
  }
  unmount() {
    var t;
    this.projection && this.projection.unmount(), Dt(this.notifyUpdate), Dt(this.render), this.valueSubscriptions.forEach((r) => r()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), (t = this.parent) == null || t.removeChild(this);
    for (const r in this.events)
      this.events[r].clear();
    for (const r in this.features) {
      const n = this.features[r];
      n && (n.unmount(), n.isMounted = !1);
    }
    this.current = null;
  }
  addChild(t) {
    this.children.add(t), this.enteringChildren ?? (this.enteringChildren = /* @__PURE__ */ new Set()), this.enteringChildren.add(t);
  }
  removeChild(t) {
    this.children.delete(t), this.enteringChildren && this.enteringChildren.delete(t);
  }
  bindToMotionValue(t, r) {
    this.valueSubscriptions.has(t) && this.valueSubscriptions.get(t)();
    const n = Kr.has(t);
    n && this.onBindTransform && this.onBindTransform();
    const s = r.on("change", (a) => {
      this.latestValues[t] = a, this.props.onUpdate && xe.preRender(this.notifyUpdate), n && this.projection && (this.projection.isTransformDirty = !0), this.scheduleRender();
    });
    let o;
    window.MotionCheckAppearSync && (o = window.MotionCheckAppearSync(this, t, r)), this.valueSubscriptions.set(t, () => {
      s(), o && o(), r.owner && r.stop();
    });
  }
  sortNodePosition(t) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== t.type ? 0 : this.sortInstanceNodePosition(this.current, t.current);
  }
  updateFeatures() {
    let t = "animation";
    for (t in Ur) {
      const r = Ur[t];
      if (!r)
        continue;
      const { isEnabled: n, Feature: s } = r;
      if (!this.features[t] && s && n(this.props) && (this.features[t] = new s(this)), this.features[t]) {
        const o = this.features[t];
        o.isMounted ? o.update() : (o.mount(), o.isMounted = !0);
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : De();
  }
  getStaticValue(t) {
    return this.latestValues[t];
  }
  setStaticValue(t, r) {
    this.latestValues[t] = r;
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(t, r) {
    (t.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = t, this.prevPresenceContext = this.presenceContext, this.presenceContext = r;
    for (let n = 0; n < Ea.length; n++) {
      const s = Ea[n];
      this.propEventSubscriptions[s] && (this.propEventSubscriptions[s](), delete this.propEventSubscriptions[s]);
      const o = "on" + s, a = t[o];
      a && (this.propEventSubscriptions[s] = this.on(s, a));
    }
    this.prevMotionValues = zp(this, this.scrapeMotionValuesFromProps(t, this.prevProps, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(t) {
    return this.props.variants ? this.props.variants[t] : void 0;
  }
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  /**
   * Add a child visual element to our set of children.
   */
  addVariantChild(t) {
    const r = this.getClosestVariantNode();
    if (r)
      return r.variantChildren && r.variantChildren.add(t), () => r.variantChildren.delete(t);
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(t, r) {
    const n = this.values.get(t);
    r !== n && (n && this.removeValue(t), this.bindToMotionValue(t, r), this.values.set(t, r), this.latestValues[t] = r.get());
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(t) {
    this.values.delete(t);
    const r = this.valueSubscriptions.get(t);
    r && (r(), this.valueSubscriptions.delete(t)), delete this.latestValues[t], this.removeValueFromRenderState(t, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(t) {
    return this.values.has(t);
  }
  getValue(t, r) {
    if (this.props.values && this.props.values[t])
      return this.props.values[t];
    let n = this.values.get(t);
    return n === void 0 && r !== void 0 && (n = At(r === null ? void 0 : r, { owner: this }), this.addValue(t, n)), n;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(t, r) {
    let n = this.latestValues[t] !== void 0 || !this.current ? this.latestValues[t] : this.getBaseTargetFromProps(this.props, t) ?? this.readValueFromInstance(this.current, t, this.options);
    return n != null && (typeof n == "string" && (nc(n) || ic(n)) ? n = parseFloat(n) : !Bh(n) && sr.test(r) && (n = Bc(t, r)), this.setBaseTarget(t, Qe(n) ? n.get() : n)), Qe(n) ? n.get() : n;
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(t, r) {
    this.baseTarget[t] = r;
  }
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(t) {
    var o;
    const { initial: r } = this.props;
    let n;
    if (typeof r == "string" || typeof r == "object") {
      const a = ho(this.props, r, (o = this.presenceContext) == null ? void 0 : o.custom);
      a && (n = a[t]);
    }
    if (r && n !== void 0)
      return n;
    const s = this.getBaseTargetFromProps(this.props, t);
    return s !== void 0 && !Qe(s) ? s : this.initialValues[t] !== void 0 && n === void 0 ? void 0 : this.baseTarget[t];
  }
  on(t, r) {
    return this.events[t] || (this.events[t] = new Bi()), this.events[t].add(r);
  }
  notify(t, ...r) {
    this.events[t] && this.events[t].notify(...r);
  }
  scheduleRenderMicrotask() {
    so.render(this.render);
  }
}
class pd extends Pp {
  constructor() {
    super(...arguments), this.KeyframeResolver = bh;
  }
  sortInstanceNodePosition(t, r) {
    return t.compareDocumentPosition(r) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(t, r) {
    return t.style ? t.style[r] : void 0;
  }
  removeValueFromRenderState(t, { vars: r, style: n }) {
    delete r[t], delete n[t];
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: t } = this.props;
    Qe(t) && (this.childSubscription = t.on("change", (r) => {
      this.current && (this.current.textContent = `${r}`);
    }));
  }
}
function md(e, { style: t, vars: r }, n, s) {
  const o = e.style;
  let a;
  for (a in t)
    o[a] = t[a];
  s == null || s.applyProjectionStyles(o, n);
  for (a in r)
    o.setProperty(a, r[a]);
}
function Np(e) {
  return window.getComputedStyle(e);
}
class Fp extends pd {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = md;
  }
  readValueFromInstance(t, r) {
    var n;
    if (Kr.has(r))
      return (n = this.projection) != null && n.isProjecting ? ai(r) : If(t, r);
    {
      const s = Np(t), o = (Ui(r) ? s.getPropertyValue(r) : s[r]) || 0;
      return typeof o == "string" ? o.trim() : o;
    }
  }
  measureInstanceViewportBox(t, { transformPagePoint: r }) {
    return fd(t, r);
  }
  build(t, r, n) {
    co(t, r, n.transformTemplate);
  }
  scrapeMotionValuesFromProps(t, r, n) {
    return po(t, r, n);
  }
}
const gd = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust"
]);
function Dp(e, t, r, n) {
  md(e, t, void 0, n);
  for (const s in t.attrs)
    e.setAttribute(gd.has(s) ? s : mo(s), t.attrs[s]);
}
class $p extends pd {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = De;
  }
  getBaseTargetFromProps(t, r) {
    return t[r];
  }
  readValueFromInstance(t, r) {
    if (Kr.has(r)) {
      const n = Lc(r);
      return n && n.default || 0;
    }
    return r = gd.has(r) ? r : mo(r), t.getAttribute(r);
  }
  scrapeMotionValuesFromProps(t, r, n) {
    return id(t, r, n);
  }
  build(t, r, n) {
    td(t, r, this.isSVGTag, n.transformTemplate, n.style);
  }
  renderInstance(t, r, n, s) {
    Dp(t, r, n, s);
  }
  mount(t) {
    this.isSVGTag = nd(t.tagName), super.mount(t);
  }
}
const Mp = (e, t) => fo(e) ? new $p(t) : new Fp(t, {
  allowProjection: e !== tc
});
function $r(e, t, r) {
  const n = e.getProps();
  return ho(n, t, r !== void 0 ? r : n.custom, e);
}
const xi = (e) => Array.isArray(e);
function Ip(e, t, r) {
  e.hasValue(t) ? e.getValue(t).set(r) : e.addValue(t, At(r));
}
function Vp(e) {
  return xi(e) ? e[e.length - 1] || 0 : e;
}
function Lp(e, t) {
  const r = $r(e, t);
  let { transitionEnd: n = {}, transition: s = {}, ...o } = r || {};
  o = { ...o, ...n };
  for (const a in o) {
    const l = Vp(o[a]);
    Ip(e, a, l);
  }
}
function Bp(e) {
  return !!(Qe(e) && e.add);
}
function yi(e, t) {
  const r = e.getValue("willChange");
  if (Bp(r))
    return r.add(t);
  if (!r && Kt.WillChange) {
    const n = new Kt.WillChange("auto");
    e.addValue("willChange", n), n.add(t);
  }
}
function xd(e) {
  return e.props[od];
}
const Op = (e) => e !== null;
function qp(e, { repeat: t, repeatType: r = "loop" }, n) {
  const s = e.filter(Op), o = t && r !== "loop" && t % 2 === 1 ? 0 : s.length - 1;
  return s[o];
}
const Wp = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, Up = (e) => ({
  type: "spring",
  stiffness: 550,
  damping: e === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), Zp = {
  type: "keyframes",
  duration: 0.8
}, Hp = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, Yp = (e, { keyframes: t }) => t.length > 2 ? Zp : Kr.has(e) ? e.startsWith("scale") ? Up(t[1]) : Wp : Hp;
function Gp({ when: e, delay: t, delayChildren: r, staggerChildren: n, staggerDirection: s, repeat: o, repeatType: a, repeatDelay: l, from: c, elapsed: d, ...u }) {
  return !!Object.keys(u).length;
}
const go = (e, t, r, n = {}, s, o) => (a) => {
  const l = to(n, e) || {}, c = l.delay || n.delay || 0;
  let { elapsed: d = 0 } = n;
  d = d - /* @__PURE__ */ Pt(c);
  const u = {
    keyframes: Array.isArray(r) ? r : [null, r],
    ease: "easeOut",
    velocity: t.getVelocity(),
    ...l,
    delay: -d,
    onUpdate: (h) => {
      t.set(h), l.onUpdate && l.onUpdate(h);
    },
    onComplete: () => {
      a(), l.onComplete && l.onComplete();
    },
    name: e,
    motionValue: t,
    element: o ? void 0 : s
  };
  Gp(l) || Object.assign(u, Yp(e, u)), u.duration && (u.duration = /* @__PURE__ */ Pt(u.duration)), u.repeatDelay && (u.repeatDelay = /* @__PURE__ */ Pt(u.repeatDelay)), u.from !== void 0 && (u.keyframes[0] = u.from);
  let f = !1;
  if ((u.type === !1 || u.duration === 0 && !u.repeatDelay) && (fi(u), u.delay === 0 && (f = !0)), (Kt.instantAnimations || Kt.skipAnimations) && (f = !0, fi(u), u.delay = 0), u.allowFlatten = !l.type && !l.ease, f && !o && t.get() !== void 0) {
    const h = qp(u.keyframes, l);
    if (h !== void 0) {
      xe.update(() => {
        u.onUpdate(h), u.onComplete();
      });
      return;
    }
  }
  return l.isSync ? new gs(u) : new oh(u);
};
function Kp({ protectedKeys: e, needsAnimating: t }, r) {
  const n = e.hasOwnProperty(r) && t[r] !== !0;
  return t[r] = !1, n;
}
function yd(e, t, { delay: r = 0, transitionOverride: n, type: s } = {}) {
  let { transition: o = e.getDefaultTransition(), transitionEnd: a, ...l } = t;
  n && (o = n);
  const c = [], d = s && e.animationState && e.animationState.getState()[s];
  for (const u in l) {
    const f = e.getValue(u, e.latestValues[u] ?? null), h = l[u];
    if (h === void 0 || d && Kp(d, u))
      continue;
    const m = {
      delay: r,
      ...to(o || {}, u)
    }, g = f.get();
    if (g !== void 0 && !f.isAnimating && !Array.isArray(h) && h === g && !m.velocity)
      continue;
    let p = !1;
    if (window.MotionHandoffAnimation) {
      const j = xd(e);
      if (j) {
        const x = window.MotionHandoffAnimation(j, u, xe);
        x !== null && (m.startTime = x, p = !0);
      }
    }
    yi(e, u), f.start(go(u, f, h, e.shouldReduceMotion && Mc.has(u) ? { type: !1 } : m, e, p));
    const y = f.animation;
    y && c.push(y);
  }
  return a && Promise.all(c).then(() => {
    xe.update(() => {
      a && Lp(e, a);
    });
  }), c;
}
function bd(e, t, r, n = 0, s = 1) {
  const o = Array.from(e).sort((d, u) => d.sortNodePosition(u)).indexOf(t), a = e.size, l = (a - 1) * n;
  return typeof r == "function" ? r(o, a) : s === 1 ? o * n : l - o * n;
}
function bi(e, t, r = {}) {
  var c;
  const n = $r(e, t, r.type === "exit" ? (c = e.presenceContext) == null ? void 0 : c.custom : void 0);
  let { transition: s = e.getDefaultTransition() || {} } = n || {};
  r.transitionOverride && (s = r.transitionOverride);
  const o = n ? () => Promise.all(yd(e, n, r)) : () => Promise.resolve(), a = e.variantChildren && e.variantChildren.size ? (d = 0) => {
    const { delayChildren: u = 0, staggerChildren: f, staggerDirection: h } = s;
    return Xp(e, t, d, u, f, h, r);
  } : () => Promise.resolve(), { when: l } = s;
  if (l) {
    const [d, u] = l === "beforeChildren" ? [o, a] : [a, o];
    return d().then(() => u());
  } else
    return Promise.all([o(), a(r.delay)]);
}
function Xp(e, t, r = 0, n = 0, s = 0, o = 1, a) {
  const l = [];
  for (const c of e.variantChildren)
    c.notify("AnimationStart", t), l.push(bi(c, t, {
      ...a,
      delay: r + (typeof n == "function" ? 0 : n) + bd(e.variantChildren, c, n, s, o)
    }).then(() => c.notify("AnimationComplete", t)));
  return Promise.all(l);
}
function Jp(e, t, r = {}) {
  e.notify("AnimationStart", t);
  let n;
  if (Array.isArray(t)) {
    const s = t.map((o) => bi(e, o, r));
    n = Promise.all(s);
  } else if (typeof t == "string")
    n = bi(e, t, r);
  else {
    const s = typeof t == "function" ? $r(e, t, r.custom) : t;
    n = Promise.all(yd(e, s, r));
  }
  return n.then(() => {
    e.notify("AnimationComplete", t);
  });
}
function vd(e, t) {
  if (!Array.isArray(t))
    return !1;
  const r = t.length;
  if (r !== e.length)
    return !1;
  for (let n = 0; n < r; n++)
    if (t[n] !== e[n])
      return !1;
  return !0;
}
const Qp = lo.length;
function wd(e) {
  if (!e)
    return;
  if (!e.isControllingVariants) {
    const r = e.parent ? wd(e.parent) || {} : {};
    return e.props.initial !== void 0 && (r.initial = e.props.initial), r;
  }
  const t = {};
  for (let r = 0; r < Qp; r++) {
    const n = lo[r], s = e.props[n];
    (vn(s) || s === !1) && (t[n] = s);
  }
  return t;
}
const em = [...ao].reverse(), tm = ao.length;
function rm(e) {
  return (t) => Promise.all(t.map(({ animation: r, options: n }) => Jp(e, r, n)));
}
function nm(e) {
  let t = rm(e), r = Ra(), n = !0;
  const s = (c) => (d, u) => {
    var h;
    const f = $r(e, u, c === "exit" ? (h = e.presenceContext) == null ? void 0 : h.custom : void 0);
    if (f) {
      const { transition: m, transitionEnd: g, ...p } = f;
      d = { ...d, ...p, ...g };
    }
    return d;
  };
  function o(c) {
    t = c(e);
  }
  function a(c) {
    const { props: d } = e, u = wd(e.parent) || {}, f = [], h = /* @__PURE__ */ new Set();
    let m = {}, g = 1 / 0;
    for (let y = 0; y < tm; y++) {
      const j = em[y], x = r[j], b = d[j] !== void 0 ? d[j] : u[j], k = vn(b), A = j === c ? x.isActive : null;
      A === !1 && (g = y);
      let R = b === u[j] && b !== d[j] && k;
      if (R && n && e.manuallyAnimateOnMount && (R = !1), x.protectedKeys = { ...m }, // If it isn't active and hasn't *just* been set as inactive
      !x.isActive && A === null || // If we didn't and don't have any defined prop for this animation type
      !b && !x.prevProp || // Or if the prop doesn't define an animation
      ys(b) || typeof b == "boolean")
        continue;
      const C = sm(x.prevProp, b);
      let S = C || // If we're making this variant active, we want to always make it active
      j === c && x.isActive && !R && k || // If we removed a higher-priority variant (i is in reverse order)
      y > g && k, E = !1;
      const D = Array.isArray(b) ? b : [b];
      let L = D.reduce(s(j), {});
      A === !1 && (L = {});
      const { prevResolvedValues: M = {} } = x, q = {
        ...M,
        ...L
      }, U = (K) => {
        S = !0, h.has(K) && (E = !0, h.delete(K)), x.needsAnimating[K] = !0;
        const ue = e.getValue(K);
        ue && (ue.liveStyle = !1);
      };
      for (const K in q) {
        const ue = L[K], Y = M[K];
        if (m.hasOwnProperty(K))
          continue;
        let he = !1;
        xi(ue) && xi(Y) ? he = !vd(ue, Y) : he = ue !== Y, he ? ue != null ? U(K) : h.add(K) : ue !== void 0 && h.has(K) ? U(K) : x.protectedKeys[K] = !0;
      }
      x.prevProp = b, x.prevResolvedValues = L, x.isActive && (m = { ...m, ...L }), n && e.blockInitialAnimation && (S = !1);
      const J = R && C;
      S && (!J || E) && f.push(...D.map((K) => {
        const ue = { type: j };
        if (typeof K == "string" && n && !J && e.manuallyAnimateOnMount && e.parent) {
          const { parent: Y } = e, he = $r(Y, K);
          if (Y.enteringChildren && he) {
            const { delayChildren: oe } = he.transition || {};
            ue.delay = bd(Y.enteringChildren, e, oe);
          }
        }
        return {
          animation: K,
          options: ue
        };
      }));
    }
    if (h.size) {
      const y = {};
      if (typeof d.initial != "boolean") {
        const j = $r(e, Array.isArray(d.initial) ? d.initial[0] : d.initial);
        j && j.transition && (y.transition = j.transition);
      }
      h.forEach((j) => {
        const x = e.getBaseTarget(j), b = e.getValue(j);
        b && (b.liveStyle = !0), y[j] = x ?? null;
      }), f.push({ animation: y });
    }
    let p = !!f.length;
    return n && (d.initial === !1 || d.initial === d.animate) && !e.manuallyAnimateOnMount && (p = !1), n = !1, p ? t(f) : Promise.resolve();
  }
  function l(c, d) {
    var f;
    if (r[c].isActive === d)
      return Promise.resolve();
    (f = e.variantChildren) == null || f.forEach((h) => {
      var m;
      return (m = h.animationState) == null ? void 0 : m.setActive(c, d);
    }), r[c].isActive = d;
    const u = a(c);
    for (const h in r)
      r[h].protectedKeys = {};
    return u;
  }
  return {
    animateChanges: a,
    setActive: l,
    setAnimateFunction: o,
    getState: () => r,
    reset: () => {
      r = Ra(), n = !0;
    }
  };
}
function sm(e, t) {
  return typeof t == "string" ? t !== e : Array.isArray(t) ? !vd(t, e) : !1;
}
function dr(e = !1) {
  return {
    isActive: e,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function Ra() {
  return {
    animate: dr(!0),
    whileInView: dr(),
    whileHover: dr(),
    whileTap: dr(),
    whileDrag: dr(),
    whileFocus: dr(),
    exit: dr()
  };
}
let ir = class {
  constructor(t) {
    this.isMounted = !1, this.node = t;
  }
  update() {
  }
};
class im extends ir {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(t) {
    super(t), t.animationState || (t.animationState = nm(t));
  }
  updateAnimationControlsSubscription() {
    const { animate: t } = this.node.getProps();
    ys(t) && (this.unmountControls = t.subscribe(this.node));
  }
  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate: t } = this.node.getProps(), { animate: r } = this.node.prevProps || {};
    t !== r && this.updateAnimationControlsSubscription();
  }
  unmount() {
    var t;
    this.node.animationState.reset(), (t = this.unmountControls) == null || t.call(this);
  }
}
let om = 0;
class am extends ir {
  constructor() {
    super(...arguments), this.id = om++;
  }
  update() {
    if (!this.node.presenceContext)
      return;
    const { isPresent: t, onExitComplete: r } = this.node.presenceContext, { isPresent: n } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || t === n)
      return;
    const s = this.node.animationState.setActive("exit", !t);
    r && !t && s.then(() => {
      r(this.id);
    });
  }
  mount() {
    const { register: t, onExitComplete: r } = this.node.presenceContext || {};
    r && r(this.id), t && (this.unmount = t(this.id));
  }
  unmount() {
  }
}
const lm = {
  animation: {
    Feature: im
  },
  exit: {
    Feature: am
  }
};
function jn(e, t, r, n = { passive: !0 }) {
  return e.addEventListener(t, r, n), () => e.removeEventListener(t, r);
}
function An(e) {
  return {
    point: {
      x: e.pageX,
      y: e.pageY
    }
  };
}
const cm = (e) => (t) => io(t) && e(t, An(t));
function un(e, t, r, n) {
  return jn(e, t, cm(r), n);
}
const jd = 1e-4, dm = 1 - jd, um = 1 + jd, Cd = 0.01, fm = 0 - Cd, hm = 0 + Cd;
function at(e) {
  return e.max - e.min;
}
function pm(e, t, r) {
  return Math.abs(e - t) <= r;
}
function Aa(e, t, r, n = 0.5) {
  e.origin = n, e.originPoint = Ee(t.min, t.max, e.origin), e.scale = at(r) / at(t), e.translate = Ee(r.min, r.max, e.origin) - e.originPoint, (e.scale >= dm && e.scale <= um || isNaN(e.scale)) && (e.scale = 1), (e.translate >= fm && e.translate <= hm || isNaN(e.translate)) && (e.translate = 0);
}
function fn(e, t, r, n) {
  Aa(e.x, t.x, r.x, n ? n.originX : void 0), Aa(e.y, t.y, r.y, n ? n.originY : void 0);
}
function za(e, t, r) {
  e.min = r.min + t.min, e.max = e.min + at(t);
}
function mm(e, t, r) {
  za(e.x, t.x, r.x), za(e.y, t.y, r.y);
}
function Pa(e, t, r) {
  e.min = t.min - r.min, e.max = e.min + at(t);
}
function hn(e, t, r) {
  Pa(e.x, t.x, r.x), Pa(e.y, t.y, r.y);
}
function Ct(e) {
  return [e("x"), e("y")];
}
const kd = ({ current: e }) => e ? e.ownerDocument.defaultView : null, Na = (e, t) => Math.abs(e - t);
function gm(e, t) {
  const r = Na(e.x, t.x), n = Na(e.y, t.y);
  return Math.sqrt(r ** 2 + n ** 2);
}
class Sd {
  constructor(t, r, { transformPagePoint: n, contextWindow: s = window, dragSnapToOrigin: o = !1, distanceThreshold: a = 3 } = {}) {
    if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const h = Ws(this.lastMoveEventInfo, this.history), m = this.startEvent !== null, g = gm(h.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
      if (!m && !g)
        return;
      const { point: p } = h, { timestamp: y } = Xe;
      this.history.push({ ...p, timestamp: y });
      const { onStart: j, onMove: x } = this.handlers;
      m || (j && j(this.lastMoveEvent, h), this.startEvent = this.lastMoveEvent), x && x(this.lastMoveEvent, h);
    }, this.handlePointerMove = (h, m) => {
      this.lastMoveEvent = h, this.lastMoveEventInfo = qs(m, this.transformPagePoint), xe.update(this.updatePoint, !0);
    }, this.handlePointerUp = (h, m) => {
      this.end();
      const { onEnd: g, onSessionEnd: p, resumeAnimation: y } = this.handlers;
      if (this.dragSnapToOrigin && y && y(), !(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const j = Ws(h.type === "pointercancel" ? this.lastMoveEventInfo : qs(m, this.transformPagePoint), this.history);
      this.startEvent && g && g(h, j), p && p(h, j);
    }, !io(t))
      return;
    this.dragSnapToOrigin = o, this.handlers = r, this.transformPagePoint = n, this.distanceThreshold = a, this.contextWindow = s || window;
    const l = An(t), c = qs(l, this.transformPagePoint), { point: d } = c, { timestamp: u } = Xe;
    this.history = [{ ...d, timestamp: u }];
    const { onSessionStart: f } = r;
    f && f(t, Ws(c, this.history)), this.removeListeners = _n(un(this.contextWindow, "pointermove", this.handlePointerMove), un(this.contextWindow, "pointerup", this.handlePointerUp), un(this.contextWindow, "pointercancel", this.handlePointerUp));
  }
  updateHandlers(t) {
    this.handlers = t;
  }
  end() {
    this.removeListeners && this.removeListeners(), Dt(this.updatePoint);
  }
}
function qs(e, t) {
  return t ? { point: t(e.point) } : e;
}
function Fa(e, t) {
  return { x: e.x - t.x, y: e.y - t.y };
}
function Ws({ point: e }, t) {
  return {
    point: e,
    delta: Fa(e, _d(t)),
    offset: Fa(e, xm(t)),
    velocity: ym(t, 0.1)
  };
}
function xm(e) {
  return e[0];
}
function _d(e) {
  return e[e.length - 1];
}
function ym(e, t) {
  if (e.length < 2)
    return { x: 0, y: 0 };
  let r = e.length - 1, n = null;
  const s = _d(e);
  for (; r >= 0 && (n = e[r], !(s.timestamp - n.timestamp > /* @__PURE__ */ Pt(t))); )
    r--;
  if (!n)
    return { x: 0, y: 0 };
  const o = /* @__PURE__ */ Vt(s.timestamp - n.timestamp);
  if (o === 0)
    return { x: 0, y: 0 };
  const a = {
    x: (s.x - n.x) / o,
    y: (s.y - n.y) / o
  };
  return a.x === 1 / 0 && (a.x = 0), a.y === 1 / 0 && (a.y = 0), a;
}
function bm(e, { min: t, max: r }, n) {
  return t !== void 0 && e < t ? e = n ? Ee(t, e, n.min) : Math.max(e, t) : r !== void 0 && e > r && (e = n ? Ee(r, e, n.max) : Math.min(e, r)), e;
}
function Da(e, t, r) {
  return {
    min: t !== void 0 ? e.min + t : void 0,
    max: r !== void 0 ? e.max + r - (e.max - e.min) : void 0
  };
}
function vm(e, { top: t, left: r, bottom: n, right: s }) {
  return {
    x: Da(e.x, r, s),
    y: Da(e.y, t, n)
  };
}
function $a(e, t) {
  let r = t.min - e.min, n = t.max - e.max;
  return t.max - t.min < e.max - e.min && ([r, n] = [n, r]), { min: r, max: n };
}
function wm(e, t) {
  return {
    x: $a(e.x, t.x),
    y: $a(e.y, t.y)
  };
}
function jm(e, t) {
  let r = 0.5;
  const n = at(e), s = at(t);
  return s > n ? r = /* @__PURE__ */ Wr(t.min, t.max - n, e.min) : n > s && (r = /* @__PURE__ */ Wr(e.min, e.max - s, t.min)), Wt(0, 1, r);
}
function Cm(e, t) {
  const r = {};
  return t.min !== void 0 && (r.min = t.min - e.min), t.max !== void 0 && (r.max = t.max - e.min), r;
}
const vi = 0.35;
function km(e = vi) {
  return e === !1 ? e = 0 : e === !0 && (e = vi), {
    x: Ma(e, "left", "right"),
    y: Ma(e, "top", "bottom")
  };
}
function Ma(e, t, r) {
  return {
    min: Ia(e, t),
    max: Ia(e, r)
  };
}
function Ia(e, t) {
  return typeof e == "number" ? e : e[t] || 0;
}
const Sm = /* @__PURE__ */ new WeakMap();
class _m {
  constructor(t) {
    this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = De(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = t;
  }
  start(t, { snapToCursor: r = !1, distanceThreshold: n } = {}) {
    const { presenceContext: s } = this.visualElement;
    if (s && s.isPresent === !1)
      return;
    const o = (f) => {
      const { dragSnapToOrigin: h } = this.getProps();
      h ? this.pauseAnimation() : this.stopAnimation(), r && this.snapToCursor(An(f).point);
    }, a = (f, h) => {
      const { drag: m, dragPropagation: g, onDragStart: p } = this.getProps();
      if (m && !g && (this.openDragLock && this.openDragLock(), this.openDragLock = jh(m), !this.openDragLock))
        return;
      this.latestPointerEvent = f, this.latestPanInfo = h, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), Ct((j) => {
        let x = this.getAxisMotionValue(j).get() || 0;
        if (Lt.test(x)) {
          const { projection: b } = this.visualElement;
          if (b && b.layout) {
            const k = b.layout.layoutBox[j];
            k && (x = at(k) * (parseFloat(x) / 100));
          }
        }
        this.originPoint[j] = x;
      }), p && xe.postRender(() => p(f, h)), yi(this.visualElement, "transform");
      const { animationState: y } = this.visualElement;
      y && y.setActive("whileDrag", !0);
    }, l = (f, h) => {
      this.latestPointerEvent = f, this.latestPanInfo = h;
      const { dragPropagation: m, dragDirectionLock: g, onDirectionLock: p, onDrag: y } = this.getProps();
      if (!m && !this.openDragLock)
        return;
      const { offset: j } = h;
      if (g && this.currentDirection === null) {
        this.currentDirection = Tm(j), this.currentDirection !== null && p && p(this.currentDirection);
        return;
      }
      this.updateAxis("x", h.point, j), this.updateAxis("y", h.point, j), this.visualElement.render(), y && y(f, h);
    }, c = (f, h) => {
      this.latestPointerEvent = f, this.latestPanInfo = h, this.stop(f, h), this.latestPointerEvent = null, this.latestPanInfo = null;
    }, d = () => Ct((f) => {
      var h;
      return this.getAnimationState(f) === "paused" && ((h = this.getAxisMotionValue(f).animation) == null ? void 0 : h.play());
    }), { dragSnapToOrigin: u } = this.getProps();
    this.panSession = new Sd(t, {
      onSessionStart: o,
      onStart: a,
      onMove: l,
      onSessionEnd: c,
      resumeAnimation: d
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin: u,
      distanceThreshold: n,
      contextWindow: kd(this.visualElement)
    });
  }
  /**
   * @internal
   */
  stop(t, r) {
    const n = t || this.latestPointerEvent, s = r || this.latestPanInfo, o = this.isDragging;
    if (this.cancel(), !o || !s || !n)
      return;
    const { velocity: a } = s;
    this.startAnimation(a);
    const { onDragEnd: l } = this.getProps();
    l && xe.postRender(() => l(n, s));
  }
  /**
   * @internal
   */
  cancel() {
    this.isDragging = !1;
    const { projection: t, animationState: r } = this.visualElement;
    t && (t.isAnimationBlocked = !1), this.panSession && this.panSession.end(), this.panSession = void 0;
    const { dragPropagation: n } = this.getProps();
    !n && this.openDragLock && (this.openDragLock(), this.openDragLock = null), r && r.setActive("whileDrag", !1);
  }
  updateAxis(t, r, n) {
    const { drag: s } = this.getProps();
    if (!n || !In(t, s, this.currentDirection))
      return;
    const o = this.getAxisMotionValue(t);
    let a = this.originPoint[t] + n[t];
    this.constraints && this.constraints[t] && (a = bm(a, this.constraints[t], this.elastic[t])), o.set(a);
  }
  resolveConstraints() {
    var o;
    const { dragConstraints: t, dragElastic: r } = this.getProps(), n = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : (o = this.visualElement.projection) == null ? void 0 : o.layout, s = this.constraints;
    t && Pr(t) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : t && n ? this.constraints = vm(n.layoutBox, t) : this.constraints = !1, this.elastic = km(r), s !== this.constraints && n && this.constraints && !this.hasMutatedConstraints && Ct((a) => {
      this.constraints !== !1 && this.getAxisMotionValue(a) && (this.constraints[a] = Cm(n.layoutBox[a], this.constraints[a]));
    });
  }
  resolveRefConstraints() {
    const { dragConstraints: t, onMeasureDragConstraints: r } = this.getProps();
    if (!t || !Pr(t))
      return !1;
    const n = t.current;
    Ft(n !== null, "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop.", "drag-constraints-ref");
    const { projection: s } = this.visualElement;
    if (!s || !s.layout)
      return !1;
    const o = Ep(n, s.root, this.visualElement.getTransformPagePoint());
    let a = wm(s.layout.layoutBox, o);
    if (r) {
      const l = r(Sp(a));
      this.hasMutatedConstraints = !!l, l && (a = cd(l));
    }
    return a;
  }
  startAnimation(t) {
    const { drag: r, dragMomentum: n, dragElastic: s, dragTransition: o, dragSnapToOrigin: a, onDragTransitionEnd: l } = this.getProps(), c = this.constraints || {}, d = Ct((u) => {
      if (!In(u, r, this.currentDirection))
        return;
      let f = c && c[u] || {};
      a && (f = { min: 0, max: 0 });
      const h = s ? 200 : 1e6, m = s ? 40 : 1e7, g = {
        type: "inertia",
        velocity: n ? t[u] : 0,
        bounceStiffness: h,
        bounceDamping: m,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...o,
        ...f
      };
      return this.startAxisValueAnimation(u, g);
    });
    return Promise.all(d).then(l);
  }
  startAxisValueAnimation(t, r) {
    const n = this.getAxisMotionValue(t);
    return yi(this.visualElement, t), n.start(go(t, n, 0, r, this.visualElement, !1));
  }
  stopAnimation() {
    Ct((t) => this.getAxisMotionValue(t).stop());
  }
  pauseAnimation() {
    Ct((t) => {
      var r;
      return (r = this.getAxisMotionValue(t).animation) == null ? void 0 : r.pause();
    });
  }
  getAnimationState(t) {
    var r;
    return (r = this.getAxisMotionValue(t).animation) == null ? void 0 : r.state;
  }
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue(t) {
    const r = `_drag${t.toUpperCase()}`, n = this.visualElement.getProps(), s = n[r];
    return s || this.visualElement.getValue(t, (n.initial ? n.initial[t] : void 0) || 0);
  }
  snapToCursor(t) {
    Ct((r) => {
      const { drag: n } = this.getProps();
      if (!In(r, n, this.currentDirection))
        return;
      const { projection: s } = this.visualElement, o = this.getAxisMotionValue(r);
      if (s && s.layout) {
        const { min: a, max: l } = s.layout.layoutBox[r];
        o.set(t[r] - Ee(a, l, 0.5));
      }
    });
  }
  /**
   * When the viewport resizes we want to check if the measured constraints
   * have changed and, if so, reposition the element within those new constraints
   * relative to where it was before the resize.
   */
  scalePositionWithinConstraints() {
    if (!this.visualElement.current)
      return;
    const { drag: t, dragConstraints: r } = this.getProps(), { projection: n } = this.visualElement;
    if (!Pr(r) || !n || !this.constraints)
      return;
    this.stopAnimation();
    const s = { x: 0, y: 0 };
    Ct((a) => {
      const l = this.getAxisMotionValue(a);
      if (l && this.constraints !== !1) {
        const c = l.get();
        s[a] = jm({ min: c, max: c }, this.constraints[a]);
      }
    });
    const { transformTemplate: o } = this.visualElement.getProps();
    this.visualElement.current.style.transform = o ? o({}, "") : "none", n.root && n.root.updateScroll(), n.updateLayout(), this.resolveConstraints(), Ct((a) => {
      if (!In(a, t, null))
        return;
      const l = this.getAxisMotionValue(a), { min: c, max: d } = this.constraints[a];
      l.set(Ee(c, d, s[a]));
    });
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    Sm.set(this.visualElement, this);
    const t = this.visualElement.current, r = un(t, "pointerdown", (c) => {
      const { drag: d, dragListener: u = !0 } = this.getProps();
      d && u && this.start(c);
    }), n = () => {
      const { dragConstraints: c } = this.getProps();
      Pr(c) && c.current && (this.constraints = this.resolveRefConstraints());
    }, { projection: s } = this.visualElement, o = s.addEventListener("measure", n);
    s && !s.layout && (s.root && s.root.updateScroll(), s.updateLayout()), xe.read(n);
    const a = jn(window, "resize", () => this.scalePositionWithinConstraints()), l = s.addEventListener("didUpdate", (({ delta: c, hasLayoutChanged: d }) => {
      this.isDragging && d && (Ct((u) => {
        const f = this.getAxisMotionValue(u);
        f && (this.originPoint[u] += c[u].translate, f.set(f.get() + c[u].translate));
      }), this.visualElement.render());
    }));
    return () => {
      a(), r(), o(), l && l();
    };
  }
  getProps() {
    const t = this.visualElement.getProps(), { drag: r = !1, dragDirectionLock: n = !1, dragPropagation: s = !1, dragConstraints: o = !1, dragElastic: a = vi, dragMomentum: l = !0 } = t;
    return {
      ...t,
      drag: r,
      dragDirectionLock: n,
      dragPropagation: s,
      dragConstraints: o,
      dragElastic: a,
      dragMomentum: l
    };
  }
}
function In(e, t, r) {
  return (t === !0 || t === e) && (r === null || r === e);
}
function Tm(e, t = 10) {
  let r = null;
  return Math.abs(e.y) > t ? r = "y" : Math.abs(e.x) > t && (r = "x"), r;
}
class Em extends ir {
  constructor(t) {
    super(t), this.removeGroupControls = yt, this.removeListeners = yt, this.controls = new _m(t);
  }
  mount() {
    const { dragControls: t } = this.node.getProps();
    t && (this.removeGroupControls = t.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || yt;
  }
  unmount() {
    this.removeGroupControls(), this.removeListeners();
  }
}
const Va = (e) => (t, r) => {
  e && xe.postRender(() => e(t, r));
};
class Rm extends ir {
  constructor() {
    super(...arguments), this.removePointerDownListener = yt;
  }
  onPointerDown(t) {
    this.session = new Sd(t, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: kd(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: t, onPanStart: r, onPan: n, onPanEnd: s } = this.node.getProps();
    return {
      onSessionStart: Va(t),
      onStart: Va(r),
      onMove: n,
      onEnd: (o, a) => {
        delete this.session, s && xe.postRender(() => s(o, a));
      }
    };
  }
  mount() {
    this.removePointerDownListener = un(this.node.current, "pointerdown", (t) => this.onPointerDown(t));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener(), this.session && this.session.end();
  }
}
const Xn = {
  /**
   * Global flag as to whether the tree has animated since the last time
   * we resized the window
   */
  hasAnimatedSinceResize: !0,
  /**
   * We set this to true once, on the first update. Any nodes added to the tree beyond that
   * update will be given a `data-projection-id` attribute.
   */
  hasEverUpdated: !1
};
function La(e, t) {
  return t.max === t.min ? 0 : e / (t.max - t.min) * 100;
}
const rn = {
  correct: (e, t) => {
    if (!t.target)
      return e;
    if (typeof e == "string")
      if (ee.test(e))
        e = parseFloat(e);
      else
        return e;
    const r = La(e, t.target.x), n = La(e, t.target.y);
    return `${r}% ${n}%`;
  }
}, Am = {
  correct: (e, { treeScale: t, projectionDelta: r }) => {
    const n = e, s = sr.parse(e);
    if (s.length > 5)
      return n;
    const o = sr.createTransformer(e), a = typeof s[0] != "number" ? 1 : 0, l = r.x.scale * t.x, c = r.y.scale * t.y;
    s[0 + a] /= l, s[1 + a] /= c;
    const d = Ee(l, c, 0.5);
    return typeof s[2 + a] == "number" && (s[2 + a] /= d), typeof s[3 + a] == "number" && (s[3 + a] /= d), o(s);
  }
};
let Us = !1;
class zm extends Ru {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement: t, layoutGroup: r, switchLayoutGroup: n, layoutId: s } = this.props, { projection: o } = t;
    Qh(Pm), o && (r.group && r.group.add(o), n && n.register && s && n.register(o), Us && o.root.didUpdate(), o.addEventListener("animationComplete", () => {
      this.safeToRemove();
    }), o.setOptions({
      ...o.options,
      onExitComplete: () => this.safeToRemove()
    })), Xn.hasEverUpdated = !0;
  }
  getSnapshotBeforeUpdate(t) {
    const { layoutDependency: r, visualElement: n, drag: s, isPresent: o } = this.props, { projection: a } = n;
    return a && (a.isPresent = o, Us = !0, s || t.layoutDependency !== r || r === void 0 || t.isPresent !== o ? a.willUpdate() : this.safeToRemove(), t.isPresent !== o && (o ? a.promote() : a.relegate() || xe.postRender(() => {
      const l = a.getStack();
      (!l || !l.members.length) && this.safeToRemove();
    }))), null;
  }
  componentDidUpdate() {
    const { projection: t } = this.props.visualElement;
    t && (t.root.didUpdate(), so.postRender(() => {
      !t.currentAnimation && t.isLead() && this.safeToRemove();
    }));
  }
  componentWillUnmount() {
    const { visualElement: t, layoutGroup: r, switchLayoutGroup: n } = this.props, { projection: s } = t;
    Us = !0, s && (s.scheduleCheckAfterUnmount(), r && r.group && r.group.remove(s), n && n.deregister && n.deregister(s));
  }
  safeToRemove() {
    const { safeToRemove: t } = this.props;
    t && t();
  }
  render() {
    return null;
  }
}
function Td(e) {
  const [t, r] = Gc(), n = ke($i);
  return i.jsx(zm, { ...e, layoutGroup: n, switchLayoutGroup: ke(ad), isPresent: t, safeToRemove: r });
}
const Pm = {
  borderRadius: {
    ...rn,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: rn,
  borderTopRightRadius: rn,
  borderBottomLeftRadius: rn,
  borderBottomRightRadius: rn,
  boxShadow: Am
};
function Nm(e, t, r) {
  const n = Qe(e) ? e : At(e);
  return n.start(go("", n, t, r)), n.animation;
}
const Fm = (e, t) => e.depth - t.depth;
class Dm {
  constructor() {
    this.children = [], this.isDirty = !1;
  }
  add(t) {
    Ii(this.children, t), this.isDirty = !0;
  }
  remove(t) {
    Vi(this.children, t), this.isDirty = !0;
  }
  forEach(t) {
    this.isDirty && this.children.sort(Fm), this.isDirty = !1, this.children.forEach(t);
  }
}
function $m(e, t) {
  const r = mt.now(), n = ({ timestamp: s }) => {
    const o = s - r;
    o >= t && (Dt(n), e(o - t));
  };
  return xe.setup(n, !0), () => Dt(n);
}
const Ed = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"], Mm = Ed.length, Ba = (e) => typeof e == "string" ? parseFloat(e) : e, Oa = (e) => typeof e == "number" || ee.test(e);
function Im(e, t, r, n, s, o) {
  s ? (e.opacity = Ee(0, r.opacity ?? 1, Vm(n)), e.opacityExit = Ee(t.opacity ?? 1, 0, Lm(n))) : o && (e.opacity = Ee(t.opacity ?? 1, r.opacity ?? 1, n));
  for (let a = 0; a < Mm; a++) {
    const l = `border${Ed[a]}Radius`;
    let c = qa(t, l), d = qa(r, l);
    if (c === void 0 && d === void 0)
      continue;
    c || (c = 0), d || (d = 0), c === 0 || d === 0 || Oa(c) === Oa(d) ? (e[l] = Math.max(Ee(Ba(c), Ba(d), n), 0), (Lt.test(d) || Lt.test(c)) && (e[l] += "%")) : e[l] = d;
  }
  (t.rotate || r.rotate) && (e.rotate = Ee(t.rotate || 0, r.rotate || 0, n));
}
function qa(e, t) {
  return e[t] !== void 0 ? e[t] : e.borderRadius;
}
const Vm = /* @__PURE__ */ Rd(0, 0.5, fc), Lm = /* @__PURE__ */ Rd(0.5, 0.95, yt);
function Rd(e, t, r) {
  return (n) => n < e ? 0 : n > t ? 1 : r(/* @__PURE__ */ Wr(e, t, n));
}
function Wa(e, t) {
  e.min = t.min, e.max = t.max;
}
function jt(e, t) {
  Wa(e.x, t.x), Wa(e.y, t.y);
}
function Ua(e, t) {
  e.translate = t.translate, e.scale = t.scale, e.originPoint = t.originPoint, e.origin = t.origin;
}
function Za(e, t, r, n, s) {
  return e -= t, e = as(e, 1 / r, n), s !== void 0 && (e = as(e, 1 / s, n)), e;
}
function Bm(e, t = 0, r = 1, n = 0.5, s, o = e, a = e) {
  if (Lt.test(t) && (t = parseFloat(t), t = Ee(a.min, a.max, t / 100) - a.min), typeof t != "number")
    return;
  let l = Ee(o.min, o.max, n);
  e === o && (l -= t), e.min = Za(e.min, t, r, l, s), e.max = Za(e.max, t, r, l, s);
}
function Ha(e, t, [r, n, s], o, a) {
  Bm(e, t[r], t[n], t[s], t.scale, o, a);
}
const Om = ["x", "scaleX", "originX"], qm = ["y", "scaleY", "originY"];
function Ya(e, t, r, n) {
  Ha(e.x, t, Om, r ? r.x : void 0, n ? n.x : void 0), Ha(e.y, t, qm, r ? r.y : void 0, n ? n.y : void 0);
}
function Ga(e) {
  return e.translate === 0 && e.scale === 1;
}
function Ad(e) {
  return Ga(e.x) && Ga(e.y);
}
function Ka(e, t) {
  return e.min === t.min && e.max === t.max;
}
function Wm(e, t) {
  return Ka(e.x, t.x) && Ka(e.y, t.y);
}
function Xa(e, t) {
  return Math.round(e.min) === Math.round(t.min) && Math.round(e.max) === Math.round(t.max);
}
function zd(e, t) {
  return Xa(e.x, t.x) && Xa(e.y, t.y);
}
function Ja(e) {
  return at(e.x) / at(e.y);
}
function Qa(e, t) {
  return e.translate === t.translate && e.scale === t.scale && e.originPoint === t.originPoint;
}
class Um {
  constructor() {
    this.members = [];
  }
  add(t) {
    Ii(this.members, t), t.scheduleRender();
  }
  remove(t) {
    if (Vi(this.members, t), t === this.prevLead && (this.prevLead = void 0), t === this.lead) {
      const r = this.members[this.members.length - 1];
      r && this.promote(r);
    }
  }
  relegate(t) {
    const r = this.members.findIndex((s) => t === s);
    if (r === 0)
      return !1;
    let n;
    for (let s = r; s >= 0; s--) {
      const o = this.members[s];
      if (o.isPresent !== !1) {
        n = o;
        break;
      }
    }
    return n ? (this.promote(n), !0) : !1;
  }
  promote(t, r) {
    const n = this.lead;
    if (t !== n && (this.prevLead = n, this.lead = t, t.show(), n)) {
      n.instance && n.scheduleRender(), t.scheduleRender(), t.resumeFrom = n, r && (t.resumeFrom.preserveOpacity = !0), n.snapshot && (t.snapshot = n.snapshot, t.snapshot.latestValues = n.animationValues || n.latestValues), t.root && t.root.isUpdating && (t.isLayoutDirty = !0);
      const { crossfade: s } = t.options;
      s === !1 && n.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((t) => {
      const { options: r, resumingFrom: n } = t;
      r.onExitComplete && r.onExitComplete(), n && n.options.onExitComplete && n.options.onExitComplete();
    });
  }
  scheduleRender() {
    this.members.forEach((t) => {
      t.instance && t.scheduleRender(!1);
    });
  }
  /**
   * Clear any leads that have been removed this render to prevent them from being
   * used in future animations and to prevent memory leaks
   */
  removeLeadSnapshot() {
    this.lead && this.lead.snapshot && (this.lead.snapshot = void 0);
  }
}
function Zm(e, t, r) {
  let n = "";
  const s = e.x.translate / t.x, o = e.y.translate / t.y, a = (r == null ? void 0 : r.z) || 0;
  if ((s || o || a) && (n = `translate3d(${s}px, ${o}px, ${a}px) `), (t.x !== 1 || t.y !== 1) && (n += `scale(${1 / t.x}, ${1 / t.y}) `), r) {
    const { transformPerspective: d, rotate: u, rotateX: f, rotateY: h, skewX: m, skewY: g } = r;
    d && (n = `perspective(${d}px) ${n}`), u && (n += `rotate(${u}deg) `), f && (n += `rotateX(${f}deg) `), h && (n += `rotateY(${h}deg) `), m && (n += `skewX(${m}deg) `), g && (n += `skewY(${g}deg) `);
  }
  const l = e.x.scale * t.x, c = e.y.scale * t.y;
  return (l !== 1 || c !== 1) && (n += `scale(${l}, ${c})`), n || "none";
}
const Zs = ["", "X", "Y", "Z"], Hm = 1e3;
let Ym = 0;
function Hs(e, t, r, n) {
  const { latestValues: s } = t;
  s[e] && (r[e] = s[e], t.setStaticValue(e, 0), n && (n[e] = 0));
}
function Pd(e) {
  if (e.hasCheckedOptimisedAppear = !0, e.root === e)
    return;
  const { visualElement: t } = e.options;
  if (!t)
    return;
  const r = xd(t);
  if (window.MotionHasOptimisedAnimation(r, "transform")) {
    const { layout: s, layoutId: o } = e.options;
    window.MotionCancelOptimisedAnimation(r, "transform", xe, !(s || o));
  }
  const { parent: n } = e;
  n && !n.hasCheckedOptimisedAppear && Pd(n);
}
function Nd({ attachResizeListener: e, defaultParent: t, measureScroll: r, checkIsScrollRoot: n, resetTransform: s }) {
  return class {
    constructor(a = {}, l = t == null ? void 0 : t()) {
      this.id = Ym++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = !1, this.nodes.forEach(Xm), this.nodes.forEach(tg), this.nodes.forEach(rg), this.nodes.forEach(Jm);
      }, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = a, this.root = l ? l.root || l : this, this.path = l ? [...l.path, l] : [], this.parent = l, this.depth = l ? l.depth + 1 : 0;
      for (let c = 0; c < this.path.length; c++)
        this.path[c].shouldResetTransform = !0;
      this.root === this && (this.nodes = new Dm());
    }
    addEventListener(a, l) {
      return this.eventHandlers.has(a) || this.eventHandlers.set(a, new Bi()), this.eventHandlers.get(a).add(l);
    }
    notifyListeners(a, ...l) {
      const c = this.eventHandlers.get(a);
      c && c.notify(...l);
    }
    hasListeners(a) {
      return this.eventHandlers.has(a);
    }
    /**
     * Lifecycles
     */
    mount(a) {
      if (this.instance)
        return;
      this.isSVG = oo(a) && !Mh(a), this.instance = a;
      const { layoutId: l, layout: c, visualElement: d } = this.options;
      if (d && !d.current && d.mount(a), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (c || l) && (this.isLayoutDirty = !0), e) {
        let u, f = 0;
        const h = () => this.root.updateBlockedByResize = !1;
        xe.read(() => {
          f = window.innerWidth;
        }), e(a, () => {
          const m = window.innerWidth;
          m !== f && (f = m, this.root.updateBlockedByResize = !0, u && u(), u = $m(h, 250), Xn.hasAnimatedSinceResize && (Xn.hasAnimatedSinceResize = !1, this.nodes.forEach(rl)));
        });
      }
      l && this.root.registerSharedNode(l, this), this.options.animate !== !1 && d && (l || c) && this.addEventListener("didUpdate", ({ delta: u, hasLayoutChanged: f, hasRelativeLayoutChanged: h, layout: m }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const g = this.options.transition || d.getDefaultTransition() || ag, { onLayoutAnimationStart: p, onLayoutAnimationComplete: y } = d.getProps(), j = !this.targetLayout || !zd(this.targetLayout, m), x = !f && h;
        if (this.options.layoutRoot || this.resumeFrom || x || f && (j || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
          const b = {
            ...to(g, "layout"),
            onPlay: p,
            onComplete: y
          };
          (d.shouldReduceMotion || this.options.layoutRoot) && (b.delay = 0, b.type = !1), this.startAnimation(b), this.setAnimationOrigin(u, x);
        } else
          f || rl(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
        this.targetLayout = m;
      });
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      const a = this.getStack();
      a && a.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), Dt(this.updateProjection);
    }
    // only on the root
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || !1;
    }
    // Note: currently only running on root node
    startUpdate() {
      this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(ng), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: a } = this.options;
      return a && a.getProps().transformTemplate;
    }
    willUpdate(a = !0) {
      if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && Pd(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
        return;
      this.isLayoutDirty = !0;
      for (let u = 0; u < this.path.length; u++) {
        const f = this.path[u];
        f.shouldResetTransform = !0, f.updateScroll("snapshot"), f.options.layoutRoot && f.willUpdate(!1);
      }
      const { layoutId: l, layout: c } = this.options;
      if (l === void 0 && !c)
        return;
      const d = this.getTransformTemplate();
      this.prevTransformTemplateValue = d ? d(this.latestValues, "") : void 0, this.updateSnapshot(), a && this.notifyListeners("willUpdate");
    }
    update() {
      if (this.updateScheduled = !1, this.isUpdateBlocked()) {
        this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(el);
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(tl);
        return;
      }
      this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(eg), this.nodes.forEach(Gm), this.nodes.forEach(Km)) : this.nodes.forEach(tl), this.clearAllSnapshots();
      const l = mt.now();
      Xe.delta = Wt(0, 1e3 / 60, l - Xe.timestamp), Xe.timestamp = l, Xe.isProcessing = !0, Ds.update.process(Xe), Ds.preRender.process(Xe), Ds.render.process(Xe), Xe.isProcessing = !1;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = !0, so.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach(Qm), this.sharedNodes.forEach(sg);
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, xe.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      xe.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      this.snapshot || !this.instance || (this.snapshot = this.measure(), this.snapshot && !at(this.snapshot.measuredBox.x) && !at(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
    }
    updateLayout() {
      if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty))
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let c = 0; c < this.path.length; c++)
          this.path[c].updateScroll();
      const a = this.layout;
      this.layout = this.measure(!1), this.layoutCorrected = De(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement: l } = this.options;
      l && l.notify("LayoutMeasure", this.layout.layoutBox, a ? a.layoutBox : void 0);
    }
    updateScroll(a = "measure") {
      let l = !!(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === a && (l = !1), l && this.instance) {
        const c = n(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: a,
          isRoot: c,
          offset: r(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : c
        };
      }
    }
    resetTransform() {
      if (!s)
        return;
      const a = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, l = this.projectionDelta && !Ad(this.projectionDelta), c = this.getTransformTemplate(), d = c ? c(this.latestValues, "") : void 0, u = d !== this.prevTransformTemplateValue;
      a && this.instance && (l || ur(this.latestValues) || u) && (s(this.instance, d), this.shouldResetTransform = !1, this.scheduleRender());
    }
    measure(a = !0) {
      const l = this.measurePageBox();
      let c = this.removeElementScroll(l);
      return a && (c = this.removeTransform(c)), lg(c), {
        animationId: this.root.animationId,
        measuredBox: l,
        layoutBox: c,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      var d;
      const { visualElement: a } = this.options;
      if (!a)
        return De();
      const l = a.measureViewportBox();
      if (!(((d = this.scroll) == null ? void 0 : d.wasRoot) || this.path.some(cg))) {
        const { scroll: u } = this.root;
        u && (Nr(l.x, u.offset.x), Nr(l.y, u.offset.y));
      }
      return l;
    }
    removeElementScroll(a) {
      var c;
      const l = De();
      if (jt(l, a), (c = this.scroll) != null && c.wasRoot)
        return l;
      for (let d = 0; d < this.path.length; d++) {
        const u = this.path[d], { scroll: f, options: h } = u;
        u !== this.root && f && h.layoutScroll && (f.wasRoot && jt(l, a), Nr(l.x, f.offset.x), Nr(l.y, f.offset.y));
      }
      return l;
    }
    applyTransform(a, l = !1) {
      const c = De();
      jt(c, a);
      for (let d = 0; d < this.path.length; d++) {
        const u = this.path[d];
        !l && u.options.layoutScroll && u.scroll && u !== u.root && Fr(c, {
          x: -u.scroll.offset.x,
          y: -u.scroll.offset.y
        }), ur(u.latestValues) && Fr(c, u.latestValues);
      }
      return ur(this.latestValues) && Fr(c, this.latestValues), c;
    }
    removeTransform(a) {
      const l = De();
      jt(l, a);
      for (let c = 0; c < this.path.length; c++) {
        const d = this.path[c];
        if (!d.instance || !ur(d.latestValues))
          continue;
        pi(d.latestValues) && d.updateSnapshot();
        const u = De(), f = d.measurePageBox();
        jt(u, f), Ya(l, d.latestValues, d.snapshot ? d.snapshot.layoutBox : void 0, u);
      }
      return ur(this.latestValues) && Ya(l, this.latestValues), l;
    }
    setTargetDelta(a) {
      this.targetDelta = a, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
    }
    setOptions(a) {
      this.options = {
        ...this.options,
        ...a,
        crossfade: a.crossfade !== void 0 ? a.crossfade : !0
      };
    }
    clearMeasurements() {
      this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== Xe.timestamp && this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(a = !1) {
      var h;
      const l = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = l.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = l.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = l.isSharedProjectionDirty);
      const c = !!this.resumingFrom || this !== l;
      if (!(a || c && this.isSharedProjectionDirty || this.isProjectionDirty || (h = this.parent) != null && h.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
        return;
      const { layout: u, layoutId: f } = this.options;
      if (!(!this.layout || !(u || f))) {
        if (this.resolvedRelativeTargetAt = Xe.timestamp, !this.targetDelta && !this.relativeTarget) {
          const m = this.getClosestProjectingParent();
          m && m.layout && this.animationProgress !== 1 ? (this.relativeParent = m, this.forceRelativeParentToResolveTarget(), this.relativeTarget = De(), this.relativeTargetOrigin = De(), hn(this.relativeTargetOrigin, this.layout.layoutBox, m.layout.layoutBox), jt(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
        if (!(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = De(), this.targetWithTransforms = De()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), mm(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : jt(this.target, this.layout.layoutBox), ud(this.target, this.targetDelta)) : jt(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget)) {
          this.attemptToResolveRelativeTarget = !1;
          const m = this.getClosestProjectingParent();
          m && !!m.resumingFrom == !!this.resumingFrom && !m.options.layoutScroll && m.target && this.animationProgress !== 1 ? (this.relativeParent = m, this.forceRelativeParentToResolveTarget(), this.relativeTarget = De(), this.relativeTargetOrigin = De(), hn(this.relativeTargetOrigin, this.target, m.target), jt(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
      }
    }
    getClosestProjectingParent() {
      if (!(!this.parent || pi(this.parent.latestValues) || dd(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    calcProjection() {
      var g;
      const a = this.getLead(), l = !!this.resumingFrom || this !== a;
      let c = !0;
      if ((this.isProjectionDirty || (g = this.parent) != null && g.isProjectionDirty) && (c = !1), l && (this.isSharedProjectionDirty || this.isTransformDirty) && (c = !1), this.resolvedRelativeTargetAt === Xe.timestamp && (c = !1), c)
        return;
      const { layout: d, layoutId: u } = this.options;
      if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(d || u))
        return;
      jt(this.layoutCorrected, this.layout.layoutBox);
      const f = this.treeScale.x, h = this.treeScale.y;
      Tp(this.layoutCorrected, this.treeScale, this.path, l), a.layout && !a.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (a.target = a.layout.layoutBox, a.targetWithTransforms = De());
      const { target: m } = a;
      if (!m) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (Ua(this.prevProjectionDelta.x, this.projectionDelta.x), Ua(this.prevProjectionDelta.y, this.projectionDelta.y)), fn(this.projectionDelta, this.layoutCorrected, m, this.latestValues), (this.treeScale.x !== f || this.treeScale.y !== h || !Qa(this.projectionDelta.x, this.prevProjectionDelta.x) || !Qa(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", m));
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(a = !0) {
      var l;
      if ((l = this.options.visualElement) == null || l.scheduleRender(), a) {
        const c = this.getStack();
        c && c.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = Dr(), this.projectionDelta = Dr(), this.projectionDeltaWithTransform = Dr();
    }
    setAnimationOrigin(a, l = !1) {
      const c = this.snapshot, d = c ? c.latestValues : {}, u = { ...this.latestValues }, f = Dr();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !l;
      const h = De(), m = c ? c.source : void 0, g = this.layout ? this.layout.source : void 0, p = m !== g, y = this.getStack(), j = !y || y.members.length <= 1, x = !!(p && !j && this.options.crossfade === !0 && !this.path.some(og));
      this.animationProgress = 0;
      let b;
      this.mixTargetDelta = (k) => {
        const A = k / 1e3;
        nl(f.x, a.x, A), nl(f.y, a.y, A), this.setTargetDelta(f), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (hn(h, this.layout.layoutBox, this.relativeParent.layout.layoutBox), ig(this.relativeTarget, this.relativeTargetOrigin, h, A), b && Wm(this.relativeTarget, b) && (this.isProjectionDirty = !1), b || (b = De()), jt(b, this.relativeTarget)), p && (this.animationValues = u, Im(u, d, this.latestValues, A, x, j)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = A;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(a) {
      var l, c, d;
      this.notifyListeners("animationStart"), (l = this.currentAnimation) == null || l.stop(), (d = (c = this.resumingFrom) == null ? void 0 : c.currentAnimation) == null || d.stop(), this.pendingAnimation && (Dt(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = xe.update(() => {
        Xn.hasAnimatedSinceResize = !0, this.motionValue || (this.motionValue = At(0)), this.currentAnimation = Nm(this.motionValue, [0, 1e3], {
          ...a,
          velocity: 0,
          isSync: !0,
          onUpdate: (u) => {
            this.mixTargetDelta(u), a.onUpdate && a.onUpdate(u);
          },
          onStop: () => {
          },
          onComplete: () => {
            a.onComplete && a.onComplete(), this.completeAnimation();
          }
        }), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
      const a = this.getStack();
      a && a.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(Hm), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const a = this.getLead();
      let { targetWithTransforms: l, target: c, layout: d, latestValues: u } = a;
      if (!(!l || !c || !d)) {
        if (this !== a && this.layout && d && Fd(this.options.animationType, this.layout.layoutBox, d.layoutBox)) {
          c = this.target || De();
          const f = at(this.layout.layoutBox.x);
          c.x.min = a.target.x.min, c.x.max = c.x.min + f;
          const h = at(this.layout.layoutBox.y);
          c.y.min = a.target.y.min, c.y.max = c.y.min + h;
        }
        jt(l, c), Fr(l, u), fn(this.projectionDeltaWithTransform, this.layoutCorrected, l, u);
      }
    }
    registerSharedNode(a, l) {
      this.sharedNodes.has(a) || this.sharedNodes.set(a, new Um()), this.sharedNodes.get(a).add(l);
      const d = l.options.initialPromotionConfig;
      l.promote({
        transition: d ? d.transition : void 0,
        preserveFollowOpacity: d && d.shouldPreserveFollowOpacity ? d.shouldPreserveFollowOpacity(l) : void 0
      });
    }
    isLead() {
      const a = this.getStack();
      return a ? a.lead === this : !0;
    }
    getLead() {
      var l;
      const { layoutId: a } = this.options;
      return a ? ((l = this.getStack()) == null ? void 0 : l.lead) || this : this;
    }
    getPrevLead() {
      var l;
      const { layoutId: a } = this.options;
      return a ? (l = this.getStack()) == null ? void 0 : l.prevLead : void 0;
    }
    getStack() {
      const { layoutId: a } = this.options;
      if (a)
        return this.root.sharedNodes.get(a);
    }
    promote({ needsReset: a, transition: l, preserveFollowOpacity: c } = {}) {
      const d = this.getStack();
      d && d.promote(this, c), a && (this.projectionDelta = void 0, this.needsReset = !0), l && this.setOptions({ transition: l });
    }
    relegate() {
      const a = this.getStack();
      return a ? a.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement: a } = this.options;
      if (!a)
        return;
      let l = !1;
      const { latestValues: c } = a;
      if ((c.z || c.rotate || c.rotateX || c.rotateY || c.rotateZ || c.skewX || c.skewY) && (l = !0), !l)
        return;
      const d = {};
      c.z && Hs("z", a, d, this.animationValues);
      for (let u = 0; u < Zs.length; u++)
        Hs(`rotate${Zs[u]}`, a, d, this.animationValues), Hs(`skew${Zs[u]}`, a, d, this.animationValues);
      a.render();
      for (const u in d)
        a.setStaticValue(u, d[u]), this.animationValues && (this.animationValues[u] = d[u]);
      a.scheduleRender();
    }
    applyProjectionStyles(a, l) {
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible) {
        a.visibility = "hidden";
        return;
      }
      const c = this.getTransformTemplate();
      if (this.needsReset) {
        this.needsReset = !1, a.visibility = "", a.opacity = "", a.pointerEvents = Kn(l == null ? void 0 : l.pointerEvents) || "", a.transform = c ? c(this.latestValues, "") : "none";
        return;
      }
      const d = this.getLead();
      if (!this.projectionDelta || !this.layout || !d.target) {
        this.options.layoutId && (a.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, a.pointerEvents = Kn(l == null ? void 0 : l.pointerEvents) || ""), this.hasProjected && !ur(this.latestValues) && (a.transform = c ? c({}, "") : "none", this.hasProjected = !1);
        return;
      }
      a.visibility = "";
      const u = d.animationValues || d.latestValues;
      this.applyTransformsToTarget();
      let f = Zm(this.projectionDeltaWithTransform, this.treeScale, u);
      c && (f = c(u, f)), a.transform = f;
      const { x: h, y: m } = this.projectionDelta;
      a.transformOrigin = `${h.origin * 100}% ${m.origin * 100}% 0`, d.animationValues ? a.opacity = d === this ? u.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : u.opacityExit : a.opacity = d === this ? u.opacity !== void 0 ? u.opacity : "" : u.opacityExit !== void 0 ? u.opacityExit : 0;
      for (const g in wn) {
        if (u[g] === void 0)
          continue;
        const { correct: p, applyTo: y, isCSSVariable: j } = wn[g], x = f === "none" ? u[g] : p(u[g], d);
        if (y) {
          const b = y.length;
          for (let k = 0; k < b; k++)
            a[y[k]] = x;
        } else
          j ? this.options.visualElement.renderState.vars[g] = x : a[g] = x;
      }
      this.options.layoutId && (a.pointerEvents = d === this ? Kn(l == null ? void 0 : l.pointerEvents) || "" : "none");
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((a) => {
        var l;
        return (l = a.currentAnimation) == null ? void 0 : l.stop();
      }), this.root.nodes.forEach(el), this.root.sharedNodes.clear();
    }
  };
}
function Gm(e) {
  e.updateLayout();
}
function Km(e) {
  var r;
  const t = ((r = e.resumeFrom) == null ? void 0 : r.snapshot) || e.snapshot;
  if (e.isLead() && e.layout && t && e.hasListeners("didUpdate")) {
    const { layoutBox: n, measuredBox: s } = e.layout, { animationType: o } = e.options, a = t.source !== e.layout.source;
    o === "size" ? Ct((f) => {
      const h = a ? t.measuredBox[f] : t.layoutBox[f], m = at(h);
      h.min = n[f].min, h.max = h.min + m;
    }) : Fd(o, t.layoutBox, n) && Ct((f) => {
      const h = a ? t.measuredBox[f] : t.layoutBox[f], m = at(n[f]);
      h.max = h.min + m, e.relativeTarget && !e.currentAnimation && (e.isProjectionDirty = !0, e.relativeTarget[f].max = e.relativeTarget[f].min + m);
    });
    const l = Dr();
    fn(l, n, t.layoutBox);
    const c = Dr();
    a ? fn(c, e.applyTransform(s, !0), t.measuredBox) : fn(c, n, t.layoutBox);
    const d = !Ad(l);
    let u = !1;
    if (!e.resumeFrom) {
      const f = e.getClosestProjectingParent();
      if (f && !f.resumeFrom) {
        const { snapshot: h, layout: m } = f;
        if (h && m) {
          const g = De();
          hn(g, t.layoutBox, h.layoutBox);
          const p = De();
          hn(p, n, m.layoutBox), zd(g, p) || (u = !0), f.options.layoutRoot && (e.relativeTarget = p, e.relativeTargetOrigin = g, e.relativeParent = f);
        }
      }
    }
    e.notifyListeners("didUpdate", {
      layout: n,
      snapshot: t,
      delta: c,
      layoutDelta: l,
      hasLayoutChanged: d,
      hasRelativeLayoutChanged: u
    });
  } else if (e.isLead()) {
    const { onExitComplete: n } = e.options;
    n && n();
  }
  e.options.transition = void 0;
}
function Xm(e) {
  e.parent && (e.isProjecting() || (e.isProjectionDirty = e.parent.isProjectionDirty), e.isSharedProjectionDirty || (e.isSharedProjectionDirty = !!(e.isProjectionDirty || e.parent.isProjectionDirty || e.parent.isSharedProjectionDirty)), e.isTransformDirty || (e.isTransformDirty = e.parent.isTransformDirty));
}
function Jm(e) {
  e.isProjectionDirty = e.isSharedProjectionDirty = e.isTransformDirty = !1;
}
function Qm(e) {
  e.clearSnapshot();
}
function el(e) {
  e.clearMeasurements();
}
function tl(e) {
  e.isLayoutDirty = !1;
}
function eg(e) {
  const { visualElement: t } = e.options;
  t && t.getProps().onBeforeLayoutMeasure && t.notify("BeforeLayoutMeasure"), e.resetTransform();
}
function rl(e) {
  e.finishAnimation(), e.targetDelta = e.relativeTarget = e.target = void 0, e.isProjectionDirty = !0;
}
function tg(e) {
  e.resolveTargetDelta();
}
function rg(e) {
  e.calcProjection();
}
function ng(e) {
  e.resetSkewAndRotation();
}
function sg(e) {
  e.removeLeadSnapshot();
}
function nl(e, t, r) {
  e.translate = Ee(t.translate, 0, r), e.scale = Ee(t.scale, 1, r), e.origin = t.origin, e.originPoint = t.originPoint;
}
function sl(e, t, r, n) {
  e.min = Ee(t.min, r.min, n), e.max = Ee(t.max, r.max, n);
}
function ig(e, t, r, n) {
  sl(e.x, t.x, r.x, n), sl(e.y, t.y, r.y, n);
}
function og(e) {
  return e.animationValues && e.animationValues.opacityExit !== void 0;
}
const ag = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
}, il = (e) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(e), ol = il("applewebkit/") && !il("chrome/") ? Math.round : yt;
function al(e) {
  e.min = ol(e.min), e.max = ol(e.max);
}
function lg(e) {
  al(e.x), al(e.y);
}
function Fd(e, t, r) {
  return e === "position" || e === "preserve-aspect" && !pm(Ja(t), Ja(r), 0.2);
}
function cg(e) {
  var t;
  return e !== e.root && ((t = e.scroll) == null ? void 0 : t.wasRoot);
}
const dg = Nd({
  attachResizeListener: (e, t) => jn(e, "resize", t),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body.scrollLeft,
    y: document.documentElement.scrollTop || document.body.scrollTop
  }),
  checkIsScrollRoot: () => !0
}), Ys = {
  current: void 0
}, Dd = Nd({
  measureScroll: (e) => ({
    x: e.scrollLeft,
    y: e.scrollTop
  }),
  defaultParent: () => {
    if (!Ys.current) {
      const e = new dg({});
      e.mount(window), e.setOptions({ layoutScroll: !0 }), Ys.current = e;
    }
    return Ys.current;
  },
  resetTransform: (e, t) => {
    e.style.transform = t !== void 0 ? t : "none";
  },
  checkIsScrollRoot: (e) => window.getComputedStyle(e).position === "fixed"
}), ug = {
  pan: {
    Feature: Rm
  },
  drag: {
    Feature: Em,
    ProjectionNode: Dd,
    MeasureLayout: Td
  }
};
function ll(e, t, r) {
  const { props: n } = e;
  e.animationState && n.whileHover && e.animationState.setActive("whileHover", r === "Start");
  const s = "onHover" + r, o = n[s];
  o && xe.postRender(() => o(t, An(t)));
}
class fg extends ir {
  mount() {
    const { current: t } = this.node;
    t && (this.unmount = Ch(t, (r, n) => (ll(this.node, n, "Start"), (s) => ll(this.node, s, "End"))));
  }
  unmount() {
  }
}
class hg extends ir {
  constructor() {
    super(...arguments), this.isActive = !1;
  }
  onFocus() {
    let t = !1;
    try {
      t = this.node.current.matches(":focus-visible");
    } catch {
      t = !0;
    }
    !t || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0);
  }
  onBlur() {
    !this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1);
  }
  mount() {
    this.unmount = _n(jn(this.node.current, "focus", () => this.onFocus()), jn(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
function cl(e, t, r) {
  const { props: n } = e;
  if (e.current instanceof HTMLButtonElement && e.current.disabled)
    return;
  e.animationState && n.whileTap && e.animationState.setActive("whileTap", r === "Start");
  const s = "onTap" + (r === "End" ? "" : r), o = n[s];
  o && xe.postRender(() => o(t, An(t)));
}
class pg extends ir {
  mount() {
    const { current: t } = this.node;
    t && (this.unmount = Th(t, (r, n) => (cl(this.node, n, "Start"), (s, { success: o }) => cl(this.node, s, o ? "End" : "Cancel")), { useGlobalTarget: this.node.props.globalTapTarget }));
  }
  unmount() {
  }
}
const wi = /* @__PURE__ */ new WeakMap(), Gs = /* @__PURE__ */ new WeakMap(), mg = (e) => {
  const t = wi.get(e.target);
  t && t(e);
}, gg = (e) => {
  e.forEach(mg);
};
function xg({ root: e, ...t }) {
  const r = e || document;
  Gs.has(r) || Gs.set(r, {});
  const n = Gs.get(r), s = JSON.stringify(t);
  return n[s] || (n[s] = new IntersectionObserver(gg, { root: e, ...t })), n[s];
}
function yg(e, t, r) {
  const n = xg(t);
  return wi.set(e, r), n.observe(e), () => {
    wi.delete(e), n.unobserve(e);
  };
}
const bg = {
  some: 0,
  all: 1
};
class vg extends ir {
  constructor() {
    super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
  }
  startObserver() {
    this.unmount();
    const { viewport: t = {} } = this.node.getProps(), { root: r, margin: n, amount: s = "some", once: o } = t, a = {
      root: r ? r.current : void 0,
      rootMargin: n,
      threshold: typeof s == "number" ? s : bg[s]
    }, l = (c) => {
      const { isIntersecting: d } = c;
      if (this.isInView === d || (this.isInView = d, o && !d && this.hasEnteredView))
        return;
      d && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", d);
      const { onViewportEnter: u, onViewportLeave: f } = this.node.getProps(), h = d ? u : f;
      h && h(c);
    };
    return yg(this.node.current, a, l);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u")
      return;
    const { props: t, prevProps: r } = this.node;
    ["amount", "margin", "root"].some(wg(t, r)) && this.startObserver();
  }
  unmount() {
  }
}
function wg({ viewport: e = {} }, { viewport: t = {} } = {}) {
  return (r) => e[r] !== t[r];
}
const jg = {
  inView: {
    Feature: vg
  },
  tap: {
    Feature: pg
  },
  focus: {
    Feature: hg
  },
  hover: {
    Feature: fg
  }
}, Cg = {
  layout: {
    ProjectionNode: Dd,
    MeasureLayout: Td
  }
}, kg = {
  ...lm,
  ...jg,
  ...ug,
  ...Cg
}, pt = /* @__PURE__ */ kp(kg, Mp), Sg = 50, dl = () => ({
  current: 0,
  offset: [],
  progress: 0,
  scrollLength: 0,
  targetOffset: 0,
  targetLength: 0,
  containerLength: 0,
  velocity: 0
}), _g = () => ({
  time: 0,
  x: dl(),
  y: dl()
}), Tg = {
  x: {
    length: "Width",
    position: "Left"
  },
  y: {
    length: "Height",
    position: "Top"
  }
};
function ul(e, t, r, n) {
  const s = r[t], { length: o, position: a } = Tg[t], l = s.current, c = r.time;
  s.current = e[`scroll${a}`], s.scrollLength = e[`scroll${o}`] - e[`client${o}`], s.offset.length = 0, s.offset[0] = 0, s.offset[1] = s.scrollLength, s.progress = /* @__PURE__ */ Wr(0, s.scrollLength, s.current);
  const d = n - c;
  s.velocity = d > Sg ? 0 : Oi(s.current - l, d);
}
function Eg(e, t, r) {
  ul(e, "x", t, r), ul(e, "y", t, r), t.time = r;
}
function Rg(e, t) {
  const r = { x: 0, y: 0 };
  let n = e;
  for (; n && n !== t; )
    if (no(n))
      r.x += n.offsetLeft, r.y += n.offsetTop, n = n.offsetParent;
    else if (n.tagName === "svg") {
      const s = n.getBoundingClientRect();
      n = n.parentElement;
      const o = n.getBoundingClientRect();
      r.x += s.left - o.left, r.y += s.top - o.top;
    } else if (n instanceof SVGGraphicsElement) {
      const { x: s, y: o } = n.getBBox();
      r.x += s, r.y += o;
      let a = null, l = n.parentNode;
      for (; !a; )
        l.tagName === "svg" && (a = l), l = n.parentNode;
      n = a;
    } else
      break;
  return r;
}
const ji = {
  start: 0,
  center: 0.5,
  end: 1
};
function fl(e, t, r = 0) {
  let n = 0;
  if (e in ji && (e = ji[e]), typeof e == "string") {
    const s = parseFloat(e);
    e.endsWith("px") ? n = s : e.endsWith("%") ? e = s / 100 : e.endsWith("vw") ? n = s / 100 * document.documentElement.clientWidth : e.endsWith("vh") ? n = s / 100 * document.documentElement.clientHeight : e = s;
  }
  return typeof e == "number" && (n = t * e), r + n;
}
const Ag = [0, 0];
function zg(e, t, r, n) {
  let s = Array.isArray(e) ? e : Ag, o = 0, a = 0;
  return typeof e == "number" ? s = [e, e] : typeof e == "string" && (e = e.trim(), e.includes(" ") ? s = e.split(" ") : s = [e, ji[e] ? e : "0"]), o = fl(s[0], r, n), a = fl(s[1], t), o - a;
}
const Pg = {
  All: [
    [0, 0],
    [1, 1]
  ]
}, Ng = { x: 0, y: 0 };
function Fg(e) {
  return "getBBox" in e && e.tagName !== "svg" ? e.getBBox() : { width: e.clientWidth, height: e.clientHeight };
}
function Dg(e, t, r) {
  const { offset: n = Pg.All } = r, { target: s = e, axis: o = "y" } = r, a = o === "y" ? "height" : "width", l = s !== e ? Rg(s, e) : Ng, c = s === e ? { width: e.scrollWidth, height: e.scrollHeight } : Fg(s), d = {
    width: e.clientWidth,
    height: e.clientHeight
  };
  t[o].offset.length = 0;
  let u = !t[o].interpolate;
  const f = n.length;
  for (let h = 0; h < f; h++) {
    const m = zg(n[h], d[a], c[a], l[o]);
    !u && m !== t[o].interpolatorOffsets[h] && (u = !0), t[o].offset[h] = m;
  }
  u && (t[o].interpolate = Xi(t[o].offset, Tc(n), { clamp: !1 }), t[o].interpolatorOffsets = [...t[o].offset]), t[o].progress = Wt(0, 1, t[o].interpolate(t[o].current));
}
function $g(e, t = e, r) {
  if (r.x.targetOffset = 0, r.y.targetOffset = 0, t !== e) {
    let n = t;
    for (; n && n !== e; )
      r.x.targetOffset += n.offsetLeft, r.y.targetOffset += n.offsetTop, n = n.offsetParent;
  }
  r.x.targetLength = t === e ? t.scrollWidth : t.clientWidth, r.y.targetLength = t === e ? t.scrollHeight : t.clientHeight, r.x.containerLength = e.clientWidth, r.y.containerLength = e.clientHeight, process.env.NODE_ENV !== "production" && e && t && t !== e && ms(getComputedStyle(e).position !== "static", "Please ensure that the container has a non-static position, like 'relative', 'fixed', or 'absolute' to ensure scroll offset is calculated correctly.");
}
function Mg(e, t, r, n = {}) {
  return {
    measure: (s) => {
      $g(e, n.target, r), Eg(e, r, s), (n.offset || n.target) && Dg(e, r, n);
    },
    notify: () => t(r)
  };
}
const nn = /* @__PURE__ */ new WeakMap(), hl = /* @__PURE__ */ new WeakMap(), Ks = /* @__PURE__ */ new WeakMap(), pl = (e) => e === document.scrollingElement ? window : e;
function $d(e, { container: t = document.scrollingElement, ...r } = {}) {
  if (!t)
    return yt;
  let n = Ks.get(t);
  n || (n = /* @__PURE__ */ new Set(), Ks.set(t, n));
  const s = _g(), o = Mg(t, e, s, r);
  if (n.add(o), !nn.has(t)) {
    const l = () => {
      for (const f of n)
        f.measure(Xe.timestamp);
      xe.preUpdate(c);
    }, c = () => {
      for (const f of n)
        f.notify();
    }, d = () => xe.read(l);
    nn.set(t, d);
    const u = pl(t);
    window.addEventListener("resize", d, { passive: !0 }), t !== document.documentElement && hl.set(t, $h(t, d)), u.addEventListener("scroll", d, { passive: !0 }), d();
  }
  const a = nn.get(t);
  return xe.read(a, !1, !0), () => {
    var d;
    Dt(a);
    const l = Ks.get(t);
    if (!l || (l.delete(o), l.size))
      return;
    const c = nn.get(t);
    nn.delete(t), c && (pl(t).removeEventListener("scroll", c), (d = hl.get(t)) == null || d(), window.removeEventListener("resize", c));
  };
}
const ml = /* @__PURE__ */ new Map();
function Ig(e) {
  const t = { value: 0 }, r = $d((n) => {
    t.value = n[e.axis].progress * 100;
  }, e);
  return { currentTime: t, cancel: r };
}
function Md({ source: e, container: t, ...r }) {
  const { axis: n } = r;
  e && (t = e);
  const s = ml.get(t) ?? /* @__PURE__ */ new Map();
  ml.set(t, s);
  const o = r.target ?? "self", a = s.get(o) ?? {}, l = n + (r.offset ?? []).join(",");
  return a[l] || (a[l] = !r.target && zc() ? new ScrollTimeline({ source: t, axis: n }) : Ig({ container: t, ...r })), a[l];
}
function Vg(e, t) {
  const r = Md(t);
  return e.attachTimeline({
    timeline: t.target ? void 0 : r,
    observe: (n) => (n.pause(), Yc((s) => {
      n.time = n.duration * s;
    }, r))
  });
}
function Lg(e) {
  return e.length === 2;
}
function Bg(e, t) {
  return Lg(e) ? $d((r) => {
    e(r[t.axis].progress, r);
  }, t) : Yc(e, Md(t));
}
function Og(e, { axis: t = "y", container: r = document.scrollingElement, ...n } = {}) {
  if (!r)
    return yt;
  const s = { axis: t, container: r, ...n };
  return typeof e == "function" ? Bg(e, s) : Vg(e, s);
}
const qg = () => ({
  scrollX: At(0),
  scrollY: At(0),
  scrollXProgress: At(0),
  scrollYProgress: At(0)
}), Vn = (e) => e ? !e.current : !1;
function xo({ container: e, target: t, ...r } = {}) {
  const n = Zr(qg), s = ae(null), o = ae(!1), a = qr(() => (s.current = Og((l, { x: c, y: d }) => {
    n.scrollX.set(c.current), n.scrollXProgress.set(c.progress), n.scrollY.set(d.current), n.scrollYProgress.set(d.progress);
  }, {
    ...r,
    container: (e == null ? void 0 : e.current) || void 0,
    target: (t == null ? void 0 : t.current) || void 0
  }), () => {
    var l;
    (l = s.current) == null || l.call(s);
  }), [e, t, JSON.stringify(r.offset)]);
  return hs(() => {
    if (o.current = !1, Vn(e) || Vn(t)) {
      o.current = !0;
      return;
    } else
      return a();
  }, [a]), ie(() => {
    if (o.current)
      return Ft(!Vn(e), "Container ref is defined but not hydrated", "use-scroll-ref"), Ft(!Vn(t), "Target ref is defined but not hydrated", "use-scroll-ref"), a();
  }, [a]), n;
}
function Id(e) {
  const t = Zr(() => At(e)), { isStatic: r } = ke(Rn);
  if (r) {
    const [, n] = V(e);
    ie(() => t.on("change", n), []);
  }
  return t;
}
function Vd(e, t) {
  const r = Id(t()), n = () => r.set(t());
  return n(), hs(() => {
    const s = () => xe.preRender(n, !1, !0), o = e.map((a) => a.on("change", s));
    return () => {
      o.forEach((a) => a()), Dt(n);
    };
  }), r;
}
function Wg(e) {
  dn.current = [], e();
  const t = Vd(dn.current, e);
  return dn.current = void 0, t;
}
function nr(e, t, r, n) {
  if (typeof e == "function")
    return Wg(e);
  const s = typeof t == "function" ? t : Ih(t, r, n);
  return Array.isArray(e) ? gl(e, s) : gl([e], ([o]) => s(o));
}
function gl(e, t) {
  const r = Zr(() => []);
  return Vd(e, () => {
    r.length = 0;
    const n = e.length;
    for (let s = 0; s < n; s++)
      r[s] = e[s].get();
    return t(r);
  });
}
function Ld(e, t = {}) {
  const { isStatic: r } = ke(Rn), n = () => Qe(e) ? e.get() : e;
  if (r)
    return nr(n);
  const s = Id(n());
  return Di(() => Vh(s, e, t), [s, JSON.stringify(t)]), s;
}
const X = P.forwardRef(({
  children: e,
  variant: t = "solid",
  color: r = "primary",
  size: n = "md",
  fullWidth: s = !1,
  loading: o = !1,
  icon: a,
  iconPosition: l = "left",
  animationType: c = "default",
  isActive: d = !1,
  showRipple: u = !0,
  // Ripple is ON by default
  style: f,
  disabled: h,
  ...m
}, g) => {
  let p = t, y = r;
  t === "primary" ? (p = "solid", y = "primary") : t === "secondary" && (p = "solid", y = "secondary");
  const j = {
    xs: {
      padding: "6px 12px",
      fontSize: "12px",
      height: "28px",
      spinnerSize: "12px"
    },
    sm: {
      padding: "8px 16px",
      fontSize: "14px",
      height: "36px",
      spinnerSize: "14px"
    },
    md: {
      padding: "10px 20px",
      fontSize: "16px",
      height: "44px",
      spinnerSize: "16px"
    },
    lg: {
      padding: "12px 24px",
      fontSize: "18px",
      height: "52px",
      spinnerSize: "20px"
    },
    xl: {
      padding: "14px 28px",
      fontSize: "20px",
      height: "60px",
      spinnerSize: "24px"
    }
  }, x = () => {
    const E = `var(--${y})`;
    switch (p) {
      case "solid":
        return {
          backgroundColor: `rgb(${E})`,
          color: "white",
          border: "none",
          boxShadow: "var(--shadow)",
          ...h && {
            backgroundColor: "rgb(var(--border))",
            color: "rgb(var(--text-muted))",
            cursor: "not-allowed",
            boxShadow: "none"
          }
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          color: `rgb(${E})`,
          border: `2px solid rgb(${E})`,
          boxShadow: "none",
          ...h && {
            borderColor: "rgb(var(--border))",
            color: "rgb(var(--text-muted))",
            cursor: "not-allowed"
          }
        };
      case "ghost":
        return {
          backgroundColor: `rgb(${E} / 0.1)`,
          color: `rgb(${E})`,
          border: "none",
          boxShadow: "none",
          ...h && {
            backgroundColor: "rgb(var(--border) / 0.3)",
            color: "rgb(var(--text-muted))",
            cursor: "not-allowed"
          }
        };
      case "link":
        return {
          backgroundColor: "transparent",
          color: `rgb(${E})`,
          border: "none",
          textDecoration: "underline",
          textUnderlineOffset: "4px",
          padding: "0",
          height: "auto",
          boxShadow: "none",
          ...h && {
            color: "rgb(var(--text-muted))",
            cursor: "not-allowed"
          }
        };
      case "validate":
        return {
          backgroundColor: "rgb(var(--success))",
          color: "white",
          border: "none",
          boxShadow: "var(--shadow-md)",
          ...h && {
            backgroundColor: "rgb(var(--border))",
            color: "rgb(var(--text-muted))",
            cursor: "not-allowed",
            boxShadow: "none"
          }
        };
      case "tab":
        return {
          backgroundColor: "transparent",
          color: d ? `rgb(${E})` : "rgb(var(--text-secondary))",
          border: "none",
          fontWeight: d ? 600 : 500,
          borderBottom: d ? `2px solid rgb(${E})` : "2px solid transparent",
          marginBottom: "-2px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          ...h && {
            color: "rgb(var(--text-muted))",
            cursor: "not-allowed"
          }
        };
      case "pill":
        return {
          backgroundColor: d ? `rgb(${E})` : "rgb(var(--surface))",
          color: d ? "white" : "rgb(var(--text-secondary))",
          border: "none",
          borderRadius: "var(--radius-full)",
          boxShadow: d ? "var(--shadow)" : "none",
          transform: d ? "scale(1.05)" : "scale(1)",
          ...h && {
            backgroundColor: "rgb(var(--border))",
            color: "rgb(var(--text-muted))",
            cursor: "not-allowed"
          }
        };
      case "segment":
        return {
          backgroundColor: d ? "rgb(var(--background))" : "transparent",
          color: d ? "rgb(var(--text))" : "rgb(var(--text-secondary))",
          border: "none",
          boxShadow: d ? "var(--shadow)" : "none",
          ...h && {
            color: "rgb(var(--text-muted))",
            cursor: "not-allowed"
          }
        };
      case "nav":
        return {
          backgroundColor: d ? `rgb(${E})` : "transparent",
          color: d ? "white" : "rgb(var(--text-secondary))",
          border: "none",
          boxShadow: d ? "var(--shadow-md)" : "none",
          transform: d && !h ? "translateY(-2px)" : "translateY(0)",
          ...h && {
            color: "rgb(var(--text-muted))",
            cursor: "not-allowed"
          }
        };
      default:
        return {
          backgroundColor: `rgb(${E})`,
          color: "white",
          border: "none",
          boxShadow: "var(--shadow)"
        };
    }
  }, b = {
    ...j[n],
    ...x(),
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    borderRadius: "var(--radius)",
    fontWeight: 600,
    fontFamily: "var(--font-sans)",
    cursor: h || o ? "not-allowed" : "pointer",
    opacity: o ? 0.8 : 1,
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    // Required for ripple
    overflow: "hidden",
    // Required for ripple
    outline: "none",
    width: s ? "100%" : "auto",
    letterSpacing: "0.025em",
    textTransform: "none",
    ...f
  };
  P.useEffect(() => {
    if (typeof document < "u") {
      const E = "qwanyx-button-hover-styles";
      if (!document.getElementById(E)) {
        const D = document.createElement("style");
        D.id = E, D.textContent = `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes buttonRipple {
            from {
              transform: scale(0);
              opacity: 1;
            }
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
          
          /* Default hover - move the whole button */
          .qwanyx-button-hover:hover:not(:disabled) {
            transform: translateY(-1px);
            filter: brightness(1.1);
          }
          
          .qwanyx-button-hover:active:not(:disabled) {
            transform: translateY(0);
          }
          
          /* For tab and ghost variants - only move the inner content, not the button */
          .qwanyx-button-tab:hover:not(:disabled),
          .qwanyx-button-ghost:hover:not(:disabled) {
            background-color: rgba(var(--primary), 0.05);
            transform: none; /* Button stays still */
            filter: none;
          }
          
          /* Move only the inner span content on hover for tab/ghost variants */
          .qwanyx-button-tab:hover:not(:disabled) > span,
          .qwanyx-button-ghost:hover:not(:disabled) > span {
            transform: translateY(-1px);
          }
          
          .qwanyx-button-tab:active:not(:disabled) > span,
          .qwanyx-button-ghost:active:not(:disabled) > span {
            transform: translateY(0);
          }
          
          .qwanyx-button-pill:hover:not(:disabled) {
            transform: scale(1.05);
            filter: brightness(1.05);
          }
          
          .qwanyx-button-segment:hover:not(:disabled) {
            background-color: rgba(var(--primary), 0.08);
            transform: none;
          }
        `, document.head.appendChild(D);
      }
    }
  }, []);
  const k = {
    default: {
      whileHover: { scale: 1.02, transition: { duration: 0.2 } },
      whileTap: { scale: 0.98 },
      transition: { type: "spring", stiffness: 400, damping: 17 }
    },
    spring: {
      whileHover: {
        scale: 1.05,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      },
      whileTap: { scale: 0.95 }
    },
    pop: {
      whileHover: {
        scale: [1, 1.2, 1.1],
        transition: { duration: 0.3 }
      },
      whileTap: {
        scale: 0.9,
        rotate: [0, -5, 5, 0],
        transition: { duration: 0.2 }
      }
    },
    pulse: {
      whileHover: {
        scale: [1, 1.05, 1],
        transition: {
          duration: 0.8,
          repeat: 1 / 0,
          repeatType: "reverse"
        }
      },
      whileTap: { scale: 0.95 }
    },
    shake: {
      whileHover: {
        rotate: [0, -2, 2, -2, 2, 0],
        transition: { duration: 0.4 }
      },
      whileTap: { scale: 0.95 }
    },
    none: {}
  }, A = k[c] || k.default, R = /* @__PURE__ */ i.jsx("span", { style: {
    display: "inline-block",
    width: j[n].spinnerSize,
    height: j[n].spinnerSize,
    animation: "spin 1s linear infinite"
  }, children: /* @__PURE__ */ i.jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      style: { width: "100%", height: "100%" },
      children: [
        /* @__PURE__ */ i.jsx(
          "circle",
          {
            cx: "12",
            cy: "12",
            r: "10",
            stroke: "currentColor",
            strokeWidth: "3",
            opacity: "0.25"
          }
        ),
        /* @__PURE__ */ i.jsx(
          "path",
          {
            fill: "currentColor",
            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          }
        )
      ]
    }
  ) }), C = (E) => {
    if (!h && !o && u) {
      const D = E.currentTarget, L = D.getBoundingClientRect(), M = document.createElement("span"), q = Math.max(L.width, L.height), U = q / 2, J = E.clientX - L.left - U, ce = E.clientY - L.top - U;
      let K = "rgba(255, 255, 255, 0.6)";
      p === "tab" ? K = d ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.4)" : p === "ghost" || p === "link" || p === "outline" ? K = "rgba(59, 130, 246, 0.3)" : p === "segment" ? K = d ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.4)" : (p === "pill" || p === "nav") && (K = d ? "rgba(255, 255, 255, 0.6)" : "rgba(59, 130, 246, 0.4)"), M.style.cssText = `
        position: absolute;
        width: ${q}px;
        height: ${q}px;
        left: ${J}px;
        top: ${ce}px;
        border-radius: 50%;
        background-color: ${K};
        transform: scale(0);
        pointer-events: none;
        z-index: 0;
      `, M.style.animation = "buttonRipple 600ms ease-out forwards", M.style.animation || M.animate([
        { transform: "scale(0)", opacity: 1 },
        { transform: "scale(4)", opacity: 0 }
      ], {
        duration: 600,
        easing: "ease-out",
        fill: "forwards"
      }), (!D.style.position || D.style.position === "static") && (D.style.position = "relative"), D.style.overflow = "hidden", D.insertBefore(M, D.firstChild), setTimeout(() => {
        M && M.parentNode && M.remove();
      }, 600);
    }
    m.onClick && m.onClick(E);
  }, S = () => {
    const E = ["qwanyx-button-hover"];
    return p === "tab" && E.push("qwanyx-button-tab"), p === "ghost" && E.push("qwanyx-button-ghost"), p === "pill" && E.push("qwanyx-button-pill"), p === "segment" && E.push("qwanyx-button-segment"), p === "nav" && E.push("qwanyx-button-nav"), E.join(" ");
  };
  return /* @__PURE__ */ i.jsx(
    pt.button,
    {
      ref: g,
      className: S(),
      style: b,
      disabled: h || o,
      ...A,
      ...m,
      onClick: C,
      children: /* @__PURE__ */ i.jsxs("span", { style: {
        position: "relative",
        zIndex: 1,
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        transition: "transform 0.2s ease"
        // Smooth animation for text movement
      }, children: [
        o && l === "left" && R,
        !o && a && l === "left" && a,
        e,
        !o && a && l === "right" && a,
        o && l === "right" && R
      ] })
    }
  );
});
X.displayName = "Button";
const zw = ({
  showLabel: e = !1,
  variant: t = "icon",
  className: r = ""
}) => {
  const { mode: n, setMode: s } = $u(), [o, a] = V(!1), l = {
    light: "☀️",
    dark: "🌙",
    system: "💻"
  }, c = {
    light: "Clair",
    dark: "Sombre",
    system: "Système"
  };
  if (t === "icon") {
    const d = () => {
      s(n === "light" ? "dark" : n === "dark" ? "system" : "light");
    };
    return /* @__PURE__ */ i.jsxs(
      X,
      {
        variant: "ghost",
        size: "sm",
        onClick: d,
        className: `theme-toggle theme-toggle--icon ${r}`,
        title: `Mode: ${c[n]}`,
        children: [
          /* @__PURE__ */ i.jsx("span", { className: "theme-toggle__icon", children: l[n] }),
          e && /* @__PURE__ */ i.jsx("span", { className: "theme-toggle__label", children: c[n] })
        ]
      }
    );
  }
  return t === "dropdown" ? /* @__PURE__ */ i.jsxs("div", { className: `theme-toggle theme-toggle--dropdown ${r}`, children: [
    /* @__PURE__ */ i.jsxs(
      X,
      {
        variant: "ghost",
        size: "sm",
        onClick: () => a(!o),
        className: "theme-toggle__trigger",
        children: [
          /* @__PURE__ */ i.jsx("span", { className: "theme-toggle__icon", children: l[n] }),
          e && /* @__PURE__ */ i.jsx("span", { className: "theme-toggle__label", children: c[n] }),
          /* @__PURE__ */ i.jsx("span", { className: "theme-toggle__arrow", children: "▼" })
        ]
      }
    ),
    o && /* @__PURE__ */ i.jsx("div", { className: "theme-toggle__menu", children: ["light", "dark", "system"].map((d) => /* @__PURE__ */ i.jsxs(
      "button",
      {
        className: `theme-toggle__option ${n === d ? "active" : ""}`,
        onClick: () => {
          s(d), a(!1);
        },
        children: [
          /* @__PURE__ */ i.jsx("span", { className: "theme-toggle__option-icon", children: l[d] }),
          /* @__PURE__ */ i.jsx("span", { className: "theme-toggle__option-label", children: c[d] }),
          n === d && /* @__PURE__ */ i.jsx("span", { className: "theme-toggle__check", children: "✓" })
        ]
      },
      d
    )) })
  ] }) : /* @__PURE__ */ i.jsx("div", { className: `theme-toggle theme-toggle--switch ${r}`, children: /* @__PURE__ */ i.jsx("div", { className: "theme-toggle__options", children: ["light", "dark", "system"].map((d) => /* @__PURE__ */ i.jsxs(
    "button",
    {
      className: `theme-toggle__switch-option ${n === d ? "active" : ""}`,
      onClick: () => s(d),
      title: c[d],
      children: [
        /* @__PURE__ */ i.jsx("span", { className: "theme-toggle__switch-icon", children: l[d] }),
        e && /* @__PURE__ */ i.jsx("span", { className: "theme-toggle__switch-label", children: c[d] })
      ]
    },
    d
  )) }) });
}, Ug = "Default Theme", Zg = "default", Hg = { primary: "#3B82F6", secondary: "#8B5CF6", accent: "#10B981", background: "#FFFFFF", foreground: "#0F172A", card: "#F8FAFC", border: "#E2E8F0", success: "#10B981", warning: "#F59E0B", error: "#EF4444", info: "#3B82F6", text: { primary: "#0F172A", secondary: "#475569", muted: "#94A3B8" } }, Yg = { fontFamily: { heading: "system-ui, -apple-system, sans-serif", body: "system-ui, -apple-system, sans-serif", mono: "'Courier New', monospace" }, fontSize: { xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem", "5xl": "3rem" }, fontWeight: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 } }, Gg = { xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "1.5rem", xl: "2rem", "2xl": "3rem", "3xl": "4rem", "4xl": "6rem" }, Kg = { none: "0", sm: "0.125rem", md: "0.375rem", lg: "0.5rem", xl: "1rem", full: "9999px" }, Xg = { sm: "0 1px 2px rgba(0,0,0,0.05)", md: "0 4px 6px rgba(0,0,0,0.1)", lg: "0 10px 15px rgba(0,0,0,0.1)", xl: "0 20px 25px rgba(0,0,0,0.1)", "2xl": "0 25px 50px rgba(0,0,0,0.25)" }, Jg = {
  name: Ug,
  id: Zg,
  colors: Hg,
  typography: Yg,
  spacing: Gg,
  borderRadius: Kg,
  shadows: Xg
}, Qg = "Autodin Theme", ex = "autodin", tx = { primary: "#E67E22", secondary: "#2C3E50", accent: "#F39C12", background: "#FFFFFF", foreground: "#1A1A1A", card: "#F8F9FA", border: "#E0E0E0", success: "#27AE60", warning: "#F39C12", error: "#E74C3C", info: "#3498DB", text: { primary: "#2C3E50", secondary: "#7F8C8D", muted: "#95A5A6" } }, rx = { fontFamily: { heading: "'Montserrat', sans-serif", body: "'Open Sans', sans-serif", mono: "'Fira Code', monospace" }, fontSize: { xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem", "5xl": "3rem" }, fontWeight: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 } }, nx = { xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "1.5rem", xl: "2rem", "2xl": "3rem", "3xl": "4rem", "4xl": "6rem" }, sx = { none: "0", sm: "0.125rem", md: "0.375rem", lg: "0.5rem", xl: "1rem", full: "9999px" }, ix = { sm: "0 1px 2px rgba(0,0,0,0.05)", md: "0 4px 6px rgba(0,0,0,0.1)", lg: "0 10px 15px rgba(0,0,0,0.1)", xl: "0 20px 25px rgba(0,0,0,0.1)", "2xl": "0 25px 50px rgba(0,0,0,0.25)" }, ox = {
  name: Qg,
  id: ex,
  colors: tx,
  typography: rx,
  spacing: nx,
  borderRadius: sx,
  shadows: ix
}, ax = "Belgicomics Theme", lx = "belgicomics", cx = { primary: "#6B7280", secondary: "#374151", accent: "#EF4444", background: "#F9FAFB", foreground: "#111827", card: "#FFFFFF", border: "#E5E7EB", success: "#10B981", warning: "#F59E0B", error: "#EF4444", info: "#3B82F6", text: { primary: "#111827", secondary: "#6B7280", muted: "#9CA3AF" } }, dx = { fontFamily: { heading: "'Inter', sans-serif", body: "'Inter', sans-serif", mono: "'JetBrains Mono', monospace" }, fontSize: { xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem", "5xl": "3rem" }, fontWeight: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 } }, ux = { xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "1.5rem", xl: "2rem", "2xl": "3rem", "3xl": "4rem", "4xl": "6rem" }, fx = { none: "0", sm: "0.125rem", md: "0.375rem", lg: "0.5rem", xl: "1rem", full: "9999px" }, hx = { sm: "0 1px 3px rgba(0,0,0,0.12)", md: "0 4px 6px rgba(0,0,0,0.1)", lg: "0 10px 20px rgba(0,0,0,0.15)", xl: "0 20px 40px rgba(0,0,0,0.2)", "2xl": "0 25px 50px rgba(0,0,0,0.25)" }, px = {
  name: ax,
  id: lx,
  colors: cx,
  typography: dx,
  spacing: ux,
  borderRadius: fx,
  shadows: hx
}, Ci = {
  default: Jg,
  autodin: ox,
  belgicomics: px
}, mx = (e) => Ci[e] || Ci.default, gx = () => Object.values(Ci), Bd = Ut(void 0), Pw = ({
  children: e,
  defaultWorkspace: t = "qwanyx-ui",
  apiUrl: r = "http://135.181.72.183:5002"
}) => {
  const [n, s] = V(t), [o, a] = V(null), [l, c] = V(null), [d, u] = V([]), [f, h] = V(null), [m, g] = V([]);
  ie(() => {
    const E = localStorage.getItem(`${n}_token`), D = localStorage.getItem(`${n}_user`);
    E && D && (c(E), a(JSON.parse(D)));
  }, [n]);
  const p = async (E, D = {}) => {
    const L = {
      "Content-Type": "application/json",
      ...D.headers
    };
    l && (L.Authorization = `Bearer ${l}`);
    const M = await fetch(`${r}${E}`, {
      ...D,
      headers: L
    });
    if (!M.ok) {
      const q = await M.json();
      throw new Error(q.message || "API call failed");
    }
    return M.json();
  }, y = (E, D) => {
    a(E), c(D), localStorage.setItem(`${n}_token`, D), localStorage.setItem(`${n}_user`, JSON.stringify(E));
  }, j = () => {
    a(null), c(null), localStorage.removeItem(`${n}_token`), localStorage.removeItem(`${n}_user`);
  }, x = async () => {
    console.warn("Themes are now static files. To add a new theme, create a JSON file in src/themes/");
  }, b = async () => {
    const E = gx();
    u(E);
    const D = mx(n);
    h(D);
  }, k = async () => {
    console.warn("Themes are now static files. To remove a theme, delete its JSON file from src/themes/");
  }, A = async () => {
    console.warn("Templates are now static files. To add a new template, create a file in src/templates/");
  }, R = async () => {
    g([]);
  }, C = (E) => {
    s(E), a(null), c(null);
    const D = localStorage.getItem(`${E}_token`), L = localStorage.getItem(`${E}_user`);
    D && L && (c(D), a(JSON.parse(L)));
  };
  ie(() => {
    b(), R();
  }, [n, o]);
  const S = {
    workspace: n,
    setWorkspace: C,
    user: o,
    token: l,
    isAuthenticated: !!o,
    login: y,
    logout: j,
    themes: d,
    currentTheme: f,
    saveTheme: x,
    loadThemes: b,
    deleteTheme: k,
    templates: m,
    saveTemplate: A,
    loadTemplates: R,
    apiUrl: r,
    apiCall: p
  };
  return /* @__PURE__ */ i.jsx(Bd.Provider, { value: S, children: e });
}, Nw = () => {
  const e = ke(Bd);
  if (e === void 0)
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  return e;
}, Od = ({
  href: e,
  smoothScroll: t = !0,
  scrollOffset: r = 0,
  animated: n = !0,
  hoverScale: s = 1.02,
  hoverColor: o,
  activeColor: a,
  underline: l = "hover",
  variant: c = "default",
  onClick: d,
  className: u = "",
  style: f = {},
  children: h,
  ...m
}) => {
  const g = (x) => {
    if (e != null && e.startsWith("#") && t) {
      x.preventDefault();
      const b = e.slice(1), k = document.getElementById(b);
      if (k) {
        const A = k.getBoundingClientRect().top + window.pageYOffset + r;
        window.scrollTo({
          top: A,
          behavior: t === !0 || t === "smooth" ? "smooth" : "auto"
        });
      }
    }
    d == null || d(x);
  }, p = () => {
    switch (l) {
      case "always":
        return "underline";
      case "never":
        return "no-underline";
      case "hover":
        return "no-underline hover:underline";
      default:
        return l ? "underline" : "no-underline";
    }
  }, j = `
    ${{
    default: "text-current transition-colors duration-300",
    nav: "font-medium transition-all duration-300",
    footer: "text-sm opacity-80 hover:opacity-100 transition-opacity duration-300"
  }[c]}
    ${p()}
    ${u}
  `.trim();
  if (n) {
    const {
      onDrag: x,
      onDragEnd: b,
      onDragStart: k,
      onAnimationStart: A,
      onAnimationEnd: R,
      onAnimationIteration: C,
      ...S
    } = m;
    return /* @__PURE__ */ i.jsx(
      pt.a,
      {
        href: e,
        onClick: g,
        className: j,
        whileHover: {
          scale: s,
          color: o
        },
        whileTap: { scale: 0.98 },
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 20
        },
        style: {
          ...f,
          display: "inline-block",
          cursor: "pointer"
        },
        ...S,
        children: h
      }
    );
  }
  return /* @__PURE__ */ i.jsx(
    "a",
    {
      href: e,
      onClick: g,
      className: j,
      style: {
        ...f,
        ...o && { "--hover-color": o }
      },
      ...m,
      children: h
    }
  );
}, Fw = ({
  active: e = !1,
  className: t = "",
  activeColor: r = "var(--qwanyx-primary)",
  ...n
}) => {
  const s = `
    ${t}
    ${e ? "font-semibold" : ""}
  `.trim();
  return /* @__PURE__ */ i.jsx(
    Od,
    {
      variant: "nav",
      className: s,
      style: {
        ...e && { color: r },
        ...n.style
      },
      ...n
    }
  );
};
if (typeof document < "u" && !document.getElementById("card-spin-animation")) {
  const e = document.createElement("style");
  e.id = "card-spin-animation", e.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `, document.head.appendChild(e);
}
const gt = P.forwardRef(({
  children: e,
  variant: t = "elevated",
  padding: r = "md",
  hoverable: n = !1,
  clickable: s = !1,
  glowColor: o,
  gradientFrom: a,
  gradientTo: l,
  blur: c = !1,
  animation: d = n ? "lift" : "none",
  style: u,
  onMouseEnter: f,
  onMouseLeave: h,
  ...m
}, g) => {
  const [p, y] = V(!1), [j, x] = V({}), k = {
    borderRadius: "var(--radius-lg)",
    position: "relative",
    overflow: "hidden",
    padding: {
      none: "0",
      sm: "12px",
      md: "20px",
      lg: "28px",
      xl: "36px"
    }[r],
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: s ? "pointer" : "default",
    transformStyle: "preserve-3d",
    willChange: "transform",
    ...u
  }, A = () => {
    switch (t) {
      case "glass":
        return {
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          backdropFilter: c ? "blur(10px)" : "none",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: p ? "0 8px 32px rgba(31, 38, 135, 0.37)" : "0 4px 16px rgba(31, 38, 135, 0.2)"
        };
      case "gradient":
        return {
          background: `linear-gradient(135deg, ${a || "rgb(var(--primary))"}, ${l || "rgb(var(--accent))"})`,
          border: "none",
          boxShadow: p ? "0 20px 40px rgba(0, 0, 0, 0.3)" : "0 10px 20px rgba(0, 0, 0, 0.2)"
        };
      case "neon":
        return {
          backgroundColor: "rgb(var(--background))",
          border: `2px solid ${o || "rgb(var(--primary))"}`,
          boxShadow: p ? `0 0 30px ${o || "rgb(var(--primary))"}, inset 0 0 20px ${o || "rgba(var(--primary), 0.1)"}` : `0 0 15px ${o || "rgba(var(--primary), 0.5)"}`
        };
      case "outlined":
        return {
          backgroundColor: "rgb(var(--background))",
          border: "1px solid rgb(var(--border))",
          boxShadow: p ? "var(--shadow-md)" : "none"
        };
      case "filled":
        return {
          backgroundColor: "rgb(var(--surface))",
          border: "none",
          boxShadow: p ? "var(--shadow-lg)" : "var(--shadow-sm)"
        };
      default:
        return {
          backgroundColor: "rgb(var(--background))",
          border: "none",
          boxShadow: p ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
        };
    }
  }, R = () => {
    if (!n || d === "none") return {};
    switch (d) {
      case "lift":
        return p ? { transform: "translateY(-8px) scale(1.02)" } : {};
      case "glow":
        return p ? { transform: "scale(1.03)" } : {};
      case "tilt":
        return j;
      case "morph":
        return p ? {
          transform: "scale(1.05) rotateX(5deg)",
          borderRadius: "var(--radius-xl)"
        } : {};
      default:
        return {};
    }
  }, C = (L) => {
    if (d !== "tilt" || !n) return;
    const M = L.currentTarget.getBoundingClientRect(), q = L.clientX - M.left, U = L.clientY - M.top, J = M.width / 2, ce = M.height / 2, K = (U - ce) / 10, ue = (J - q) / 10;
    x({
      transform: `perspective(1000px) rotateX(${K}deg) rotateY(${ue}deg) scale(1.02)`
    });
  }, S = (L) => {
    y(!0), f == null || f(L);
  }, E = (L) => {
    y(!1), d === "tilt" && x({}), h == null || h(L);
  }, D = /* @__PURE__ */ i.jsxs(
    "div",
    {
      ref: g,
      style: {
        ...k,
        ...A(),
        ...R()
      },
      onMouseEnter: S,
      onMouseLeave: E,
      onMouseMove: C,
      ...m,
      children: [
        t === "glass" && /* @__PURE__ */ i.jsx("div", { style: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)",
          pointerEvents: "none"
        } }),
        t === "neon" && p && /* @__PURE__ */ i.jsx("div", { style: {
          position: "absolute",
          top: "-2px",
          left: "-2px",
          right: "-2px",
          bottom: "-2px",
          background: `linear-gradient(45deg, ${o || "rgb(var(--primary))"}, transparent, ${o || "rgb(var(--primary))"})`,
          borderRadius: "var(--radius-lg)",
          opacity: 0.8,
          animation: "spin 3s linear infinite",
          pointerEvents: "none",
          zIndex: -1
        } }),
        e
      ]
    }
  );
  return n && d !== "none" ? /* @__PURE__ */ i.jsx(
    pt.div,
    {
      whileHover: d === "lift" ? { y: -8, scale: 1.02 } : d === "glow" ? { scale: 1.03 } : d === "morph" ? { scale: 1.05, rotateX: 5 } : {},
      transition: { type: "spring", stiffness: 300, damping: 20 },
      children: D
    }
  ) : D;
});
gt.displayName = "Card";
const Bt = P.forwardRef(({
  children: e,
  bordered: t = !1,
  style: r,
  ...n
}, s) => /* @__PURE__ */ i.jsx(
  "div",
  {
    ref: s,
    style: {
      padding: "20px 24px",
      borderBottom: t ? "1px solid rgb(var(--border))" : "none",
      ...r
    },
    ...n,
    children: e
  }
));
Bt.displayName = "CardHeader";
const Ot = P.forwardRef(({
  children: e,
  as: t = "h3",
  size: r = "lg",
  style: n,
  ...s
}, o) => {
  const a = {
    sm: { fontSize: "14px", fontWeight: "600" },
    md: { fontSize: "16px", fontWeight: "600" },
    lg: { fontSize: "20px", fontWeight: "700" },
    xl: { fontSize: "24px", fontWeight: "700" }
  };
  return /* @__PURE__ */ i.jsx(
    t,
    {
      ref: o,
      style: {
        ...a[r],
        margin: 0,
        color: "rgb(var(--text))",
        lineHeight: "1.4",
        ...n
      },
      ...s,
      children: e
    }
  );
});
Ot.displayName = "CardTitle";
const xr = P.forwardRef(({
  children: e,
  color: t = "muted",
  style: r,
  ...n
}, s) => {
  const o = {
    default: "rgb(var(--text))",
    muted: "rgb(var(--text-muted))",
    secondary: "rgb(var(--text-secondary))"
  };
  return /* @__PURE__ */ i.jsx(
    "p",
    {
      ref: s,
      style: {
        fontSize: "14px",
        lineHeight: "1.6",
        color: o[t],
        marginTop: "8px",
        margin: 0,
        ...r
      },
      ...n,
      children: e
    }
  );
});
xr.displayName = "CardDescription";
const xt = P.forwardRef(({
  children: e,
  noPadding: t = !1,
  style: r,
  ...n
}, s) => /* @__PURE__ */ i.jsx(
  "div",
  {
    ref: s,
    style: {
      padding: t ? 0 : "20px 24px",
      ...r
    },
    ...n,
    children: e
  }
));
xt.displayName = "CardContent";
const Jn = P.forwardRef(({
  children: e,
  bordered: t = !1,
  justify: r = "end",
  style: n,
  ...s
}, o) => {
  const a = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    between: "space-between"
  };
  return /* @__PURE__ */ i.jsx(
    "div",
    {
      ref: o,
      style: {
        padding: "16px 24px",
        borderTop: t ? "1px solid rgb(var(--border))" : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: a[r],
        gap: "12px",
        ...n
      },
      ...s,
      children: e
    }
  );
});
Jn.displayName = "CardFooter";
const pn = P.forwardRef(({
  aspectRatio: e = "16/9",
  overlay: t = !1,
  overlayGradient: r,
  alt: n = "",
  style: s,
  ...o
}, a) => {
  const l = {
    square: "100%",
    "16/9": "56.25%",
    "4/3": "75%",
    "21/9": "42.86%"
  };
  return /* @__PURE__ */ i.jsxs("div", { style: {
    position: "relative",
    width: "100%",
    paddingBottom: l[e],
    overflow: "hidden",
    backgroundColor: "rgb(var(--surface))"
  }, children: [
    /* @__PURE__ */ i.jsx(
      "img",
      {
        ref: a,
        alt: n,
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          ...s
        },
        ...o
      }
    ),
    t && /* @__PURE__ */ i.jsx("div", { style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: r || "linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.5) 100%)",
      pointerEvents: "none"
    } })
  ] });
});
pn.displayName = "CardImage";
const xx = {
  // Navigation
  Menu: "menu",
  Close: "close",
  X: "close",
  ArrowBack: "arrow_back",
  ArrowForward: "arrow_forward",
  ArrowUpward: "arrow_upward",
  ArrowDownward: "arrow_downward",
  ArrowLeft: "arrow_back",
  ArrowRight: "arrow_forward",
  ArrowUp: "arrow_upward",
  ArrowDown: "arrow_downward",
  KeyboardArrowDown: "keyboard_arrow_down",
  KeyboardArrowUp: "keyboard_arrow_up",
  KeyboardArrowLeft: "keyboard_arrow_left",
  KeyboardArrowRight: "keyboard_arrow_right",
  ChevronDown: "expand_more",
  ChevronUp: "expand_less",
  ChevronLeft: "chevron_left",
  ChevronRight: "chevron_right",
  ExpandMore: "expand_more",
  ExpandLess: "expand_less",
  // Common actions
  Search: "search",
  FilterList: "filter_list",
  Filter: "filter_list",
  Add: "add",
  Plus: "add",
  Remove: "remove",
  Minus: "remove",
  Check: "check",
  ContentCopy: "content_copy",
  Copy: "content_copy",
  Download: "download",
  Upload: "upload",
  Edit: "edit",
  Delete: "delete",
  Trash: "delete",
  Trash2: "delete",
  Save: "save",
  Settings: "settings",
  Share: "share",
  Send: "send",
  Print: "print",
  Refresh: "refresh",
  // User & Account
  Home: "home",
  Person: "person",
  User: "person",
  Group: "group",
  People: "people",
  Users: "people",
  PersonAdd: "person_add",
  Logout: "logout",
  // Communication
  Mail: "mail",
  Email: "email",
  Phone: "phone",
  Notifications: "notifications",
  NotificationsOff: "notifications_off",
  Bell: "notifications",
  bell: "notifications",
  BellOff: "notifications_off",
  MessageSquare: "message",
  MessageCircle: "chat",
  Chat: "chat",
  // Time & Calendar
  CalendarMonth: "calendar_month",
  Calendar: "calendar_today",
  AccessTime: "access_time",
  Clock: "schedule",
  History: "history",
  // Feedback
  Star: "star",
  Favorite: "favorite",
  Heart: "favorite",
  Visibility: "visibility",
  VisibilityOff: "visibility_off",
  Eye: "visibility",
  EyeOff: "visibility_off",
  // Security
  Lock: "lock",
  LockOpen: "lock_open",
  Unlock: "lock_open",
  Key: "key",
  Shield: "shield",
  // Status
  Error: "error",
  Warning: "warning",
  Info: "info",
  CheckCircle: "check_circle",
  Cancel: "cancel",
  XCircle: "cancel",
  Help: "help",
  HelpCircle: "help",
  AlertCircle: "error",
  AlertTriangle: "warning",
  // Business
  Dashboard: "dashboard",
  Assignment: "assignment",
  Analytics: "analytics",
  Assessment: "assessment",
  TrendingUp: "trending_up",
  ShoppingCart: "shopping_cart",
  Payment: "payment",
  CreditCard: "credit_card",
  DollarSign: "attach_money",
  Tag: "label",
  Gift: "card_giftcard",
  Package: "inventory_2",
  Truck: "local_shipping",
  ShoppingBag: "shopping_bag",
  // Places
  LocationOn: "location_on",
  // Social (Note: Material Symbols doesn't have social icons, we'll use alternatives)
  Facebook: "public",
  Twitter: "tag",
  Instagram: "camera_alt",
  LinkedIn: "work",
  Github: "code",
  // Technology
  Cloud: "cloud",
  Api: "api",
  Support: "support_agent",
  SupportAgent: "support_agent",
  AutoMode: "auto_mode",
  Wifi: "wifi",
  WifiOff: "wifi_off",
  Bluetooth: "bluetooth",
  Database: "database",
  Server: "dns",
  Globe: "language",
  Monitor: "computer",
  Smartphone: "smartphone",
  // Media
  Image: "image",
  Camera: "photo_camera",
  Video: "videocam",
  Music: "music_note",
  Mic: "mic",
  Volume: "volume_up",
  Volume2: "volume_up",
  // Files
  File: "description",
  FileText: "article",
  Folder: "folder",
  FolderOpen: "folder_open",
  Paperclip: "attach_file",
  // Layout
  Grid: "grid_view",
  List: "list",
  Layers: "layers",
  Layout: "dashboard",
  Sidebar: "view_sidebar",
  // Weather
  Sun: "light_mode",
  Moon: "dark_mode",
  CloudRain: "cloudy",
  // Automotive
  Car: "directions_car",
  Wrench: "build",
  Zap: "bolt",
  Activity: "show_chart",
  Gauge: "speed",
  // Other
  Palette: "palette"
}, yx = () => {
  if (typeof document > "u") return;
  const e = "qwanyx-material-symbols-font";
  if (!document.getElementById(e)) {
    const t = document.createElement("link");
    t.id = e, t.rel = "stylesheet", t.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap", document.head.appendChild(t);
  }
}, Q = ({
  name: e,
  size: t = "md",
  color: r = "inherit",
  variant: n = "outlined",
  weight: s = "regular",
  className: o = "",
  style: a,
  onClick: l,
  spin: c = !1
}) => {
  ie(() => {
    yx();
  }, []);
  const d = xx[e] || e.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase().trim(), u = {
    xs: { fontSize: "16px", width: "16px", height: "16px" },
    sm: { fontSize: "20px", width: "20px", height: "20px" },
    md: { fontSize: "24px", width: "24px", height: "24px" },
    lg: { fontSize: "28px", width: "28px", height: "28px" },
    xl: { fontSize: "32px", width: "32px", height: "32px" },
    "2xl": { fontSize: "40px", width: "40px", height: "40px" },
    "3xl": { fontSize: "48px", width: "48px", height: "48px" }
  }, f = {
    primary: "rgb(59 130 246)",
    secondary: "rgb(168 85 247)",
    accent: "rgb(34 197 94)",
    success: "rgb(34 197 94)",
    warning: "rgb(250 204 21)",
    error: "rgb(239 68 68)",
    info: "rgb(59 130 246)",
    inherit: "inherit",
    foreground: "rgb(15 23 42)",
    muted: "rgb(148 163 184)"
  }, h = {
    thin: 100,
    light: 300,
    regular: 400,
    medium: 500,
    bold: 700
  }, g = {
    fontFamily: {
      outlined: "Material Symbols Outlined",
      filled: "Material Symbols Filled",
      rounded: "Material Symbols Rounded",
      sharp: "Material Symbols Sharp"
    }[n],
    fontWeight: h[s],
    fontSize: u[t].fontSize,
    width: u[t].width,
    height: u[t].height,
    color: f[r],
    display: "inline-block",
    lineHeight: 1,
    textTransform: "none",
    letterSpacing: "normal",
    wordWrap: "normal",
    whiteSpace: "nowrap",
    direction: "ltr",
    cursor: l ? "pointer" : "default",
    userSelect: "none",
    transition: "color 200ms ease, transform 200ms ease",
    animation: c ? "spin 1s linear infinite" : void 0,
    ...a
  };
  if (c && typeof document < "u") {
    const p = "qwanyx-icon-spin-animation";
    if (!document.getElementById(p)) {
      const y = document.createElement("style");
      y.id = p, y.textContent = `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `, document.head.appendChild(y);
    }
  }
  return /* @__PURE__ */ i.jsx(
    "span",
    {
      style: g,
      onClick: l,
      role: l ? "button" : void 0,
      tabIndex: l ? 0 : void 0,
      "aria-label": e,
      className: o,
      children: d
    }
  );
}, Dw = {
  // Navigation
  Menu: "menu",
  Close: "close",
  ArrowBack: "arrow_back",
  ArrowForward: "arrow_forward",
  ArrowUp: "arrow_upward",
  ArrowDown: "arrow_downward",
  ChevronDown: "expand_more",
  ChevronUp: "expand_less",
  ChevronLeft: "chevron_left",
  ChevronRight: "chevron_right",
  // Actions
  Search: "search",
  Filter: "filter_list",
  Add: "add",
  Remove: "remove",
  Check: "check",
  Copy: "content_copy",
  Download: "download",
  Upload: "upload",
  Edit: "edit",
  Delete: "delete",
  Save: "save",
  Settings: "settings",
  Share: "share",
  Send: "send",
  Print: "print",
  Refresh: "refresh",
  // User & Account
  Home: "home",
  Person: "person",
  People: "people",
  PersonAdd: "person_add",
  Logout: "logout",
  // Communication
  Mail: "mail",
  Email: "email",
  Phone: "phone",
  Notifications: "notifications",
  NotificationsOff: "notifications_off",
  Chat: "chat",
  Message: "message",
  // Time & Calendar
  Calendar: "calendar_today",
  Clock: "schedule",
  History: "history",
  // Feedback
  Star: "star",
  Favorite: "favorite",
  Visibility: "visibility",
  VisibilityOff: "visibility_off",
  // Security
  Lock: "lock",
  LockOpen: "lock_open",
  Key: "key",
  Shield: "shield",
  // Status
  Error: "error",
  Warning: "warning",
  Info: "info",
  CheckCircle: "check_circle",
  Cancel: "cancel",
  Help: "help",
  // Business
  Dashboard: "dashboard",
  Assignment: "assignment",
  Analytics: "analytics",
  Assessment: "assessment",
  TrendingUp: "trending_up",
  ShoppingCart: "shopping_cart",
  Payment: "payment",
  // Technology
  Cloud: "cloud",
  Api: "api",
  Support: "support_agent",
  Wifi: "wifi",
  Database: "database",
  // Media
  Image: "image",
  Camera: "photo_camera",
  Video: "videocam",
  Music: "music_note",
  Mic: "mic",
  VolumeUp: "volume_up",
  // Files
  File: "description",
  Folder: "folder",
  FolderOpen: "folder_open",
  AttachFile: "attach_file",
  // Layout
  GridView: "grid_view",
  List: "list",
  Layers: "layers",
  ViewSidebar: "view_sidebar"
}, Je = P.forwardRef(({
  children: e,
  as: t = "h2",
  size: r,
  weight: n = "semibold",
  color: s = "primary",
  align: o = "left",
  className: a = "",
  ...l
}, c) => {
  const d = r || {
    h1: "4xl",
    h2: "3xl",
    h3: "2xl",
    h4: "xl",
    h5: "lg",
    h6: "base"
  }[t], u = {
    "5xl": "text-5xl",
    "4xl": "text-4xl",
    "3xl": "text-3xl",
    "2xl": "text-2xl",
    xl: "text-xl",
    lg: "text-lg",
    md: "text-base",
    base: "text-base",
    sm: "text-sm",
    xs: "text-xs"
  }, f = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold"
  }, h = {
    primary: "text-text-primary",
    secondary: "text-text-secondary",
    muted: "text-text-muted",
    accent: "text-accent",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
    info: "text-info"
  }, m = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify"
  }, g = [
    u[d],
    f[n],
    h[s],
    m[o],
    "font-heading",
    a
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx(t, { ref: c, className: g, ...l, children: e });
});
Je.displayName = "Heading";
const W = P.forwardRef(({
  children: e,
  as: t = "p",
  size: r = "base",
  weight: n = "normal",
  color: s = "primary",
  align: o = "left",
  italic: a = !1,
  underline: l = !1,
  lineThrough: c = !1,
  className: d = "",
  style: u
}, f) => {
  const h = {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem"
  }, m = {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700"
  }, g = {
    primary: "rgb(var(--qwanyx-foreground))",
    secondary: "rgb(var(--qwanyx-foreground) / 0.7)",
    muted: "rgb(var(--qwanyx-foreground) / 0.5)",
    accent: "rgb(var(--qwanyx-primary))",
    success: "rgb(var(--qwanyx-success))",
    warning: "rgb(var(--qwanyx-warning))",
    error: "rgb(var(--qwanyx-error))",
    info: "rgb(var(--qwanyx-info))"
  }, p = {
    fontSize: h[r],
    fontWeight: m[n],
    color: g[s],
    textAlign: o,
    fontStyle: a ? "italic" : "normal",
    textDecoration: l ? "underline" : c ? "line-through" : "none",
    ...u
  }, y = d;
  return t === "label" ? /* @__PURE__ */ i.jsx("label", { ref: f, className: y, style: p, children: e }) : /* @__PURE__ */ i.jsx(t, { ref: f, className: y, style: p, children: e });
});
W.displayName = "Text";
const bx = P.forwardRef(({
  children: e,
  variant: t = "inline",
  language: r,
  className: n = "",
  ...s
}, o) => t === "block" ? /* @__PURE__ */ i.jsx(
  "pre",
  {
    ref: o,
    className: `bg-foreground/5 border border-border rounded-md p-4 overflow-x-auto ${n}`,
    ...s,
    children: /* @__PURE__ */ i.jsx("code", { className: "text-sm font-mono text-text-primary", "data-language": r, children: e })
  }
) : /* @__PURE__ */ i.jsx(
  "code",
  {
    ref: o,
    className: `bg-foreground/10 px-1.5 py-0.5 rounded text-sm font-mono text-text-primary ${n}`,
    ...s,
    children: e
  }
));
bx.displayName = "Code";
const vx = ({
  icon: e,
  iconColor: t = "primary",
  title: r,
  description: n,
  hoverable: s = !0,
  className: o
}) => /* @__PURE__ */ i.jsxs(gt, { className: o, hoverable: s, children: [
  /* @__PURE__ */ i.jsxs(Bt, { children: [
    /* @__PURE__ */ i.jsx(Q, { name: e, size: "xl", color: t }),
    /* @__PURE__ */ i.jsx(Ot, { children: r })
  ] }),
  /* @__PURE__ */ i.jsx(xt, { children: /* @__PURE__ */ i.jsx(W, { children: n }) })
] });
vx.displayName = "ServiceCard";
const xl = ({
  images: e,
  flipDelay: t = { min: 2e3, max: 5e3 },
  flipDuration: r = 800,
  onImageClick: n,
  size: s = "300px",
  gap: o = "20px",
  className: a = ""
}) => {
  const [l, c] = V(typeof window < "u" ? window.innerWidth : 1024);
  ie(() => {
    if (typeof window > "u") return;
    const de = () => c(window.innerWidth);
    return window.addEventListener("resize", de), () => window.removeEventListener("resize", de);
  }, []);
  const [d, u] = V(""), [f, h] = V(""), [m, g] = V(""), [p, y] = V(""), [j, x] = V(!1), [b, k] = V(!1), [A, R] = V(!1), [C, S] = V(!1), E = ae([]), D = ae(0), L = ae(null), M = ae(null), q = ae(null), U = ae(!0), J = ae(!1), ce = ae(!1), K = (de) => {
    const ne = [...de];
    for (let Ie = ne.length - 1; Ie > 0; Ie--) {
      const Ze = Math.floor(Math.random() * (Ie + 1));
      [ne[Ie], ne[Ze]] = [ne[Ze], ne[Ie]];
    }
    return ne;
  }, ue = () => {
    E.current.length > 0 && (q.current = L.current || M.current);
    let de = K(e), ne = 0;
    for (; q.current && de[0] === q.current && ne < 2; )
      de = K(e), ne++;
    E.current = de, D.current = 0;
  }, Y = () => {
    D.current >= E.current.length && ue();
    const de = E.current[D.current];
    return D.current++, de;
  };
  ie(() => {
    if (!(!e || e.length === 0) && (ue(), E.current.length >= 2)) {
      const de = E.current[0], ne = E.current[1];
      L.current = de, M.current = ne, u(de), g(ne), D.current = 2;
    }
  }, [e]);
  const he = (de) => {
    const ne = Y();
    ne && (de === "left" ? (R(!0), J.current ? u(ne) : h(ne), J.current = !J.current, x(J.current), L.current = ne, setTimeout(() => {
      R(!1);
    }, r)) : (S(!0), ce.current ? g(ne) : y(ne), ce.current = !ce.current, k(ce.current), M.current = ne, setTimeout(() => {
      S(!1);
    }, r)));
  }, oe = () => Math.floor(Math.random() * (t.max - t.min)) + t.min;
  ie(() => {
    if (!E.current.length) return;
    U.current = !0;
    let de;
    const ne = () => {
      if (!U.current) return;
      const Ze = oe(), lt = Math.random() < 0.5 ? "left" : "right";
      de = setTimeout(() => {
        U.current && (he(lt), ne());
      }, Ze);
    }, Ie = setTimeout(() => {
      ne();
    }, 1e3);
    return () => {
      U.current = !1, clearTimeout(Ie), de && clearTimeout(de);
    };
  }, [e]);
  const Ae = (de) => {
    const ne = de === "left" ? L.current : M.current;
    !ne || !n || n(ne, de);
  }, nt = () => typeof s == "object" ? l < 768 ? s.mobile : l < 1024 ? s.tablet : s.desktop : s;
  if (!d && !m)
    return /* @__PURE__ */ i.jsx("div", { className: "qwanyx-double-flip-loading", children: "Chargement des images..." });
  const Ne = nt(), Me = l < 768;
  return /* @__PURE__ */ i.jsxs(
    "div",
    {
      className: `qwanyx-double-flip ${Me ? "qwanyx-double-flip--vertical" : "qwanyx-double-flip--horizontal"} ${a}`,
      style: {
        display: "flex",
        flexDirection: Me ? "column" : "row",
        gap: o,
        justifyContent: "center",
        alignItems: "center",
        padding: Me ? "15px" : "30px"
      },
      children: [
        /* @__PURE__ */ i.jsx(
          "div",
          {
            className: `qwanyx-double-flip__panel ${A ? "qwanyx-double-flip__panel--flipping" : ""}`,
            style: {
              position: "relative",
              width: Ne,
              height: Ne,
              perspective: "1000px",
              cursor: n ? "pointer" : "default"
            },
            onClick: () => Ae("left"),
            children: /* @__PURE__ */ i.jsx("div", { className: "qwanyx-double-flip__card", children: /* @__PURE__ */ i.jsxs(
              "div",
              {
                className: "qwanyx-double-flip__card-inner",
                style: {
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  transformStyle: "preserve-3d",
                  transition: `transform ${r}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,
                  transform: j ? "rotateY(180deg)" : "rotateY(0deg)"
                },
                children: [
                  /* @__PURE__ */ i.jsx("div", { className: "qwanyx-double-flip__card-front", style: {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    backfaceVisibility: "hidden"
                  }, children: /* @__PURE__ */ i.jsx(
                    "img",
                    {
                      src: d,
                      alt: "Flip image",
                      className: "qwanyx-double-flip__image",
                      style: {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block"
                      }
                    }
                  ) }),
                  /* @__PURE__ */ i.jsx("div", { className: "qwanyx-double-flip__card-back", style: {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)"
                  }, children: /* @__PURE__ */ i.jsx(
                    "img",
                    {
                      src: f,
                      alt: "Flip image",
                      className: "qwanyx-double-flip__image",
                      style: {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block"
                      }
                    }
                  ) })
                ]
              }
            ) })
          }
        ),
        /* @__PURE__ */ i.jsx(
          "div",
          {
            className: `qwanyx-double-flip__panel ${C ? "qwanyx-double-flip__panel--flipping" : ""}`,
            style: {
              position: "relative",
              width: Ne,
              height: Ne,
              perspective: "1000px",
              cursor: n ? "pointer" : "default"
            },
            onClick: () => Ae("right"),
            children: /* @__PURE__ */ i.jsx("div", { className: "qwanyx-double-flip__card", children: /* @__PURE__ */ i.jsxs(
              "div",
              {
                className: "qwanyx-double-flip__card-inner",
                style: {
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  transformStyle: "preserve-3d",
                  transition: `transform ${r}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,
                  transform: b ? "rotateY(180deg)" : "rotateY(0deg)"
                },
                children: [
                  /* @__PURE__ */ i.jsx("div", { className: "qwanyx-double-flip__card-front", style: {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    backfaceVisibility: "hidden"
                  }, children: /* @__PURE__ */ i.jsx(
                    "img",
                    {
                      src: m,
                      alt: "Flip image",
                      className: "qwanyx-double-flip__image",
                      style: {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block"
                      }
                    }
                  ) }),
                  /* @__PURE__ */ i.jsx("div", { className: "qwanyx-double-flip__card-back", style: {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)"
                  }, children: /* @__PURE__ */ i.jsx(
                    "img",
                    {
                      src: p,
                      alt: "Flip image",
                      className: "qwanyx-double-flip__image",
                      style: {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block"
                      }
                    }
                  ) })
                ]
              }
            ) })
          }
        )
      ]
    }
  );
};
var zn = (e) => e.type === "checkbox", pr = (e) => e instanceof Date, ot = (e) => e == null;
const qd = (e) => typeof e == "object";
var $e = (e) => !ot(e) && !Array.isArray(e) && qd(e) && !pr(e), wx = (e) => $e(e) && e.target ? zn(e.target) ? e.target.checked : e.target.value : e, jx = (e) => e.substring(0, e.search(/\.\d+(\.|$)/)) || e, Cx = (e, t) => e.has(jx(t)), kx = (e) => {
  const t = e.constructor && e.constructor.prototype;
  return $e(t) && t.hasOwnProperty("isPrototypeOf");
}, yo = typeof window < "u" && typeof window.HTMLElement < "u" && typeof document < "u";
function Ke(e) {
  let t;
  const r = Array.isArray(e), n = typeof FileList < "u" ? e instanceof FileList : !1;
  if (e instanceof Date)
    t = new Date(e);
  else if (!(yo && (e instanceof Blob || n)) && (r || $e(e)))
    if (t = r ? [] : Object.create(Object.getPrototypeOf(e)), !r && !kx(e))
      t = e;
    else
      for (const s in e)
        e.hasOwnProperty(s) && (t[s] = Ke(e[s]));
  else
    return e;
  return t;
}
var vs = (e) => /^\w*$/.test(e), We = (e) => e === void 0, bo = (e) => Array.isArray(e) ? e.filter(Boolean) : [], vo = (e) => bo(e.replace(/["|']|\]/g, "").split(/\.|\[/)), H = (e, t, r) => {
  if (!t || !$e(e))
    return r;
  const n = (vs(t) ? [t] : vo(t)).reduce((s, o) => ot(s) ? s : s[o], e);
  return We(n) || n === e ? We(e[t]) ? r : e[t] : n;
}, Mt = (e) => typeof e == "boolean", be = (e, t, r) => {
  let n = -1;
  const s = vs(t) ? [t] : vo(t), o = s.length, a = o - 1;
  for (; ++n < o; ) {
    const l = s[n];
    let c = r;
    if (n !== a) {
      const d = e[l];
      c = $e(d) || Array.isArray(d) ? d : isNaN(+s[n + 1]) ? {} : [];
    }
    if (l === "__proto__" || l === "constructor" || l === "prototype")
      return;
    e[l] = c, e = e[l];
  }
};
const yl = {
  BLUR: "blur",
  FOCUS_OUT: "focusout"
}, Et = {
  onBlur: "onBlur",
  onChange: "onChange",
  onSubmit: "onSubmit",
  onTouched: "onTouched",
  all: "all"
}, Yt = {
  max: "max",
  min: "min",
  maxLength: "maxLength",
  minLength: "minLength",
  pattern: "pattern",
  required: "required",
  validate: "validate"
}, wo = P.createContext(null);
wo.displayName = "HookFormContext";
const Xr = () => P.useContext(wo), Sx = (e) => {
  const { children: t, ...r } = e;
  return P.createElement(wo.Provider, { value: r }, t);
};
var _x = (e, t, r, n = !0) => {
  const s = {
    defaultValues: t._defaultValues
  };
  for (const o in e)
    Object.defineProperty(s, o, {
      get: () => {
        const a = o;
        return t._proxyFormState[a] !== Et.all && (t._proxyFormState[a] = !n || Et.all), e[a];
      }
    });
  return s;
};
const Tx = typeof window < "u" ? P.useLayoutEffect : P.useEffect;
var It = (e) => typeof e == "string", Ex = (e, t, r, n, s) => It(e) ? (n && t.watch.add(e), H(r, e, s)) : Array.isArray(e) ? e.map((o) => (n && t.watch.add(o), H(r, o))) : (n && (t.watchAll = !0), r), ki = (e) => ot(e) || !qd(e);
function rr(e, t, r = /* @__PURE__ */ new WeakSet()) {
  if (ki(e) || ki(t))
    return e === t;
  if (pr(e) && pr(t))
    return e.getTime() === t.getTime();
  const n = Object.keys(e), s = Object.keys(t);
  if (n.length !== s.length)
    return !1;
  if (r.has(e) || r.has(t))
    return !0;
  r.add(e), r.add(t);
  for (const o of n) {
    const a = e[o];
    if (!s.includes(o))
      return !1;
    if (o !== "ref") {
      const l = t[o];
      if (pr(a) && pr(l) || $e(a) && $e(l) || Array.isArray(a) && Array.isArray(l) ? !rr(a, l, r) : a !== l)
        return !1;
    }
  }
  return !0;
}
var jo = (e, t, r, n, s) => t ? {
  ...r[e],
  types: {
    ...r[e] && r[e].types ? r[e].types : {},
    [n]: s || !0
  }
} : {}, mn = (e) => Array.isArray(e) ? e : [e], bl = () => {
  let e = [];
  return {
    get observers() {
      return e;
    },
    next: (s) => {
      for (const o of e)
        o.next && o.next(s);
    },
    subscribe: (s) => (e.push(s), {
      unsubscribe: () => {
        e = e.filter((o) => o !== s);
      }
    }),
    unsubscribe: () => {
      e = [];
    }
  };
}, ht = (e) => $e(e) && !Object.keys(e).length, Co = (e) => e.type === "file", Rt = (e) => typeof e == "function", ls = (e) => {
  if (!yo)
    return !1;
  const t = e ? e.ownerDocument : 0;
  return e instanceof (t && t.defaultView ? t.defaultView.HTMLElement : HTMLElement);
}, Wd = (e) => e.type === "select-multiple", ko = (e) => e.type === "radio", Rx = (e) => ko(e) || zn(e), Xs = (e) => ls(e) && e.isConnected;
function Ax(e, t) {
  const r = t.slice(0, -1).length;
  let n = 0;
  for (; n < r; )
    e = We(e) ? n++ : e[t[n++]];
  return e;
}
function zx(e) {
  for (const t in e)
    if (e.hasOwnProperty(t) && !We(e[t]))
      return !1;
  return !0;
}
function Oe(e, t) {
  const r = Array.isArray(t) ? t : vs(t) ? [t] : vo(t), n = r.length === 1 ? e : Ax(e, r), s = r.length - 1, o = r[s];
  return n && delete n[o], s !== 0 && ($e(n) && ht(n) || Array.isArray(n) && zx(n)) && Oe(e, r.slice(0, -1)), e;
}
var Ud = (e) => {
  for (const t in e)
    if (Rt(e[t]))
      return !0;
  return !1;
};
function cs(e, t = {}) {
  const r = Array.isArray(e);
  if ($e(e) || r)
    for (const n in e)
      Array.isArray(e[n]) || $e(e[n]) && !Ud(e[n]) ? (t[n] = Array.isArray(e[n]) ? [] : {}, cs(e[n], t[n])) : ot(e[n]) || (t[n] = !0);
  return t;
}
function Zd(e, t, r) {
  const n = Array.isArray(e);
  if ($e(e) || n)
    for (const s in e)
      Array.isArray(e[s]) || $e(e[s]) && !Ud(e[s]) ? We(t) || ki(r[s]) ? r[s] = Array.isArray(e[s]) ? cs(e[s], []) : { ...cs(e[s]) } : Zd(e[s], ot(t) ? {} : t[s], r[s]) : r[s] = !rr(e[s], t[s]);
  return r;
}
var sn = (e, t) => Zd(e, t, cs(t));
const vl = {
  value: !1,
  isValid: !1
}, wl = { value: !0, isValid: !0 };
var Hd = (e) => {
  if (Array.isArray(e)) {
    if (e.length > 1) {
      const t = e.filter((r) => r && r.checked && !r.disabled).map((r) => r.value);
      return { value: t, isValid: !!t.length };
    }
    return e[0].checked && !e[0].disabled ? (
      // @ts-expect-error expected to work in the browser
      e[0].attributes && !We(e[0].attributes.value) ? We(e[0].value) || e[0].value === "" ? wl : { value: e[0].value, isValid: !0 } : wl
    ) : vl;
  }
  return vl;
}, Yd = (e, { valueAsNumber: t, valueAsDate: r, setValueAs: n }) => We(e) ? e : t ? e === "" ? NaN : e && +e : r && It(e) ? new Date(e) : n ? n(e) : e;
const jl = {
  isValid: !1,
  value: null
};
var Gd = (e) => Array.isArray(e) ? e.reduce((t, r) => r && r.checked && !r.disabled ? {
  isValid: !0,
  value: r.value
} : t, jl) : jl;
function Cl(e) {
  const t = e.ref;
  return Co(t) ? t.files : ko(t) ? Gd(e.refs).value : Wd(t) ? [...t.selectedOptions].map(({ value: r }) => r) : zn(t) ? Hd(e.refs).value : Yd(We(t.value) ? e.ref.value : t.value, e);
}
var Px = (e, t, r, n) => {
  const s = {};
  for (const o of e) {
    const a = H(t, o);
    a && be(s, o, a._f);
  }
  return {
    criteriaMode: r,
    names: [...e],
    fields: s,
    shouldUseNativeValidation: n
  };
}, ds = (e) => e instanceof RegExp, on = (e) => We(e) ? e : ds(e) ? e.source : $e(e) ? ds(e.value) ? e.value.source : e.value : e, kl = (e) => ({
  isOnSubmit: !e || e === Et.onSubmit,
  isOnBlur: e === Et.onBlur,
  isOnChange: e === Et.onChange,
  isOnAll: e === Et.all,
  isOnTouch: e === Et.onTouched
});
const Sl = "AsyncFunction";
var Nx = (e) => !!e && !!e.validate && !!(Rt(e.validate) && e.validate.constructor.name === Sl || $e(e.validate) && Object.values(e.validate).find((t) => t.constructor.name === Sl)), Fx = (e) => e.mount && (e.required || e.min || e.max || e.maxLength || e.minLength || e.pattern || e.validate), _l = (e, t, r) => !r && (t.watchAll || t.watch.has(e) || [...t.watch].some((n) => e.startsWith(n) && /^\.\w+/.test(e.slice(n.length))));
const gn = (e, t, r, n) => {
  for (const s of r || Object.keys(e)) {
    const o = H(e, s);
    if (o) {
      const { _f: a, ...l } = o;
      if (a) {
        if (a.refs && a.refs[0] && t(a.refs[0], s) && !n)
          return !0;
        if (a.ref && t(a.ref, a.name) && !n)
          return !0;
        if (gn(l, t))
          break;
      } else if ($e(l) && gn(l, t))
        break;
    }
  }
};
function Tl(e, t, r) {
  const n = H(e, r);
  if (n || vs(r))
    return {
      error: n,
      name: r
    };
  const s = r.split(".");
  for (; s.length; ) {
    const o = s.join("."), a = H(t, o), l = H(e, o);
    if (a && !Array.isArray(a) && r !== o)
      return { name: r };
    if (l && l.type)
      return {
        name: o,
        error: l
      };
    if (l && l.root && l.root.type)
      return {
        name: `${o}.root`,
        error: l.root
      };
    s.pop();
  }
  return {
    name: r
  };
}
var Dx = (e, t, r, n) => {
  r(e);
  const { name: s, ...o } = e;
  return ht(o) || Object.keys(o).length >= Object.keys(t).length || Object.keys(o).find((a) => t[a] === (!n || Et.all));
}, $x = (e, t, r) => !e || !t || e === t || mn(e).some((n) => n && (r ? n === t : n.startsWith(t) || t.startsWith(n))), Mx = (e, t, r, n, s) => s.isOnAll ? !1 : !r && s.isOnTouch ? !(t || e) : (r ? n.isOnBlur : s.isOnBlur) ? !e : (r ? n.isOnChange : s.isOnChange) ? e : !0, Ix = (e, t) => !bo(H(e, t)).length && Oe(e, t), Vx = (e, t, r) => {
  const n = mn(H(e, r));
  return be(n, "root", t[r]), be(e, r, n), e;
}, Qn = (e) => It(e);
function El(e, t, r = "validate") {
  if (Qn(e) || Array.isArray(e) && e.every(Qn) || Mt(e) && !e)
    return {
      type: r,
      message: Qn(e) ? e : "",
      ref: t
    };
}
var Er = (e) => $e(e) && !ds(e) ? e : {
  value: e,
  message: ""
}, Rl = async (e, t, r, n, s, o) => {
  const { ref: a, refs: l, required: c, maxLength: d, minLength: u, min: f, max: h, pattern: m, validate: g, name: p, valueAsNumber: y, mount: j } = e._f, x = H(r, p);
  if (!j || t.has(p))
    return {};
  const b = l ? l[0] : a, k = (M) => {
    s && b.reportValidity && (b.setCustomValidity(Mt(M) ? "" : M || ""), b.reportValidity());
  }, A = {}, R = ko(a), C = zn(a), S = R || C, E = (y || Co(a)) && We(a.value) && We(x) || ls(a) && a.value === "" || x === "" || Array.isArray(x) && !x.length, D = jo.bind(null, p, n, A), L = (M, q, U, J = Yt.maxLength, ce = Yt.minLength) => {
    const K = M ? q : U;
    A[p] = {
      type: M ? J : ce,
      message: K,
      ref: a,
      ...D(M ? J : ce, K)
    };
  };
  if (o ? !Array.isArray(x) || !x.length : c && (!S && (E || ot(x)) || Mt(x) && !x || C && !Hd(l).isValid || R && !Gd(l).isValid)) {
    const { value: M, message: q } = Qn(c) ? { value: !!c, message: c } : Er(c);
    if (M && (A[p] = {
      type: Yt.required,
      message: q,
      ref: b,
      ...D(Yt.required, q)
    }, !n))
      return k(q), A;
  }
  if (!E && (!ot(f) || !ot(h))) {
    let M, q;
    const U = Er(h), J = Er(f);
    if (!ot(x) && !isNaN(x)) {
      const ce = a.valueAsNumber || x && +x;
      ot(U.value) || (M = ce > U.value), ot(J.value) || (q = ce < J.value);
    } else {
      const ce = a.valueAsDate || new Date(x), K = (he) => /* @__PURE__ */ new Date((/* @__PURE__ */ new Date()).toDateString() + " " + he), ue = a.type == "time", Y = a.type == "week";
      It(U.value) && x && (M = ue ? K(x) > K(U.value) : Y ? x > U.value : ce > new Date(U.value)), It(J.value) && x && (q = ue ? K(x) < K(J.value) : Y ? x < J.value : ce < new Date(J.value));
    }
    if ((M || q) && (L(!!M, U.message, J.message, Yt.max, Yt.min), !n))
      return k(A[p].message), A;
  }
  if ((d || u) && !E && (It(x) || o && Array.isArray(x))) {
    const M = Er(d), q = Er(u), U = !ot(M.value) && x.length > +M.value, J = !ot(q.value) && x.length < +q.value;
    if ((U || J) && (L(U, M.message, q.message), !n))
      return k(A[p].message), A;
  }
  if (m && !E && It(x)) {
    const { value: M, message: q } = Er(m);
    if (ds(M) && !x.match(M) && (A[p] = {
      type: Yt.pattern,
      message: q,
      ref: a,
      ...D(Yt.pattern, q)
    }, !n))
      return k(q), A;
  }
  if (g) {
    if (Rt(g)) {
      const M = await g(x, r), q = El(M, b);
      if (q && (A[p] = {
        ...q,
        ...D(Yt.validate, q.message)
      }, !n))
        return k(q.message), A;
    } else if ($e(g)) {
      let M = {};
      for (const q in g) {
        if (!ht(M) && !n)
          break;
        const U = El(await g[q](x, r), b, q);
        U && (M = {
          ...U,
          ...D(q, U.message)
        }, k(U.message), n && (A[p] = M));
      }
      if (!ht(M) && (A[p] = {
        ref: b,
        ...M
      }, !n))
        return A;
    }
  }
  return k(!0), A;
};
const Lx = {
  mode: Et.onSubmit,
  reValidateMode: Et.onChange,
  shouldFocusError: !0
};
function Bx(e = {}) {
  let t = {
    ...Lx,
    ...e
  }, r = {
    submitCount: 0,
    isDirty: !1,
    isReady: !1,
    isLoading: Rt(t.defaultValues),
    isValidating: !1,
    isSubmitted: !1,
    isSubmitting: !1,
    isSubmitSuccessful: !1,
    isValid: !1,
    touchedFields: {},
    dirtyFields: {},
    validatingFields: {},
    errors: t.errors || {},
    disabled: t.disabled || !1
  }, n = {}, s = $e(t.defaultValues) || $e(t.values) ? Ke(t.defaultValues || t.values) || {} : {}, o = t.shouldUnregister ? {} : Ke(s), a = {
    action: !1,
    mount: !1,
    watch: !1
  }, l = {
    mount: /* @__PURE__ */ new Set(),
    disabled: /* @__PURE__ */ new Set(),
    unMount: /* @__PURE__ */ new Set(),
    array: /* @__PURE__ */ new Set(),
    watch: /* @__PURE__ */ new Set()
  }, c, d = 0;
  const u = {
    isDirty: !1,
    dirtyFields: !1,
    validatingFields: !1,
    touchedFields: !1,
    isValidating: !1,
    isValid: !1,
    errors: !1
  };
  let f = {
    ...u
  };
  const h = {
    array: bl(),
    state: bl()
  }, m = t.criteriaMode === Et.all, g = (v) => (_) => {
    clearTimeout(d), d = setTimeout(v, _);
  }, p = async (v) => {
    if (!t.disabled && (u.isValid || f.isValid || v)) {
      const _ = t.resolver ? ht((await C()).errors) : await E(n, !0);
      _ !== r.isValid && h.state.next({
        isValid: _
      });
    }
  }, y = (v, _) => {
    !t.disabled && (u.isValidating || u.validatingFields || f.isValidating || f.validatingFields) && ((v || Array.from(l.mount)).forEach((N) => {
      N && (_ ? be(r.validatingFields, N, _) : Oe(r.validatingFields, N));
    }), h.state.next({
      validatingFields: r.validatingFields,
      isValidating: !ht(r.validatingFields)
    }));
  }, j = (v, _ = [], N, O, T = !0, F = !0) => {
    if (O && N && !t.disabled) {
      if (a.action = !0, F && Array.isArray(H(n, v))) {
        const B = N(H(n, v), O.argA, O.argB);
        T && be(n, v, B);
      }
      if (F && Array.isArray(H(r.errors, v))) {
        const B = N(H(r.errors, v), O.argA, O.argB);
        T && be(r.errors, v, B), Ix(r.errors, v);
      }
      if ((u.touchedFields || f.touchedFields) && F && Array.isArray(H(r.touchedFields, v))) {
        const B = N(H(r.touchedFields, v), O.argA, O.argB);
        T && be(r.touchedFields, v, B);
      }
      (u.dirtyFields || f.dirtyFields) && (r.dirtyFields = sn(s, o)), h.state.next({
        name: v,
        isDirty: L(v, _),
        dirtyFields: r.dirtyFields,
        errors: r.errors,
        isValid: r.isValid
      });
    } else
      be(o, v, _);
  }, x = (v, _) => {
    be(r.errors, v, _), h.state.next({
      errors: r.errors
    });
  }, b = (v) => {
    r.errors = v, h.state.next({
      errors: r.errors,
      isValid: !1
    });
  }, k = (v, _, N, O) => {
    const T = H(n, v);
    if (T) {
      const F = H(o, v, We(N) ? H(s, v) : N);
      We(F) || O && O.defaultChecked || _ ? be(o, v, _ ? F : Cl(T._f)) : U(v, F), a.mount && p();
    }
  }, A = (v, _, N, O, T) => {
    let F = !1, B = !1;
    const le = {
      name: v
    };
    if (!t.disabled) {
      if (!N || O) {
        (u.isDirty || f.isDirty) && (B = r.isDirty, r.isDirty = le.isDirty = L(), F = B !== le.isDirty);
        const pe = rr(H(s, v), _);
        B = !!H(r.dirtyFields, v), pe ? Oe(r.dirtyFields, v) : be(r.dirtyFields, v, !0), le.dirtyFields = r.dirtyFields, F = F || (u.dirtyFields || f.dirtyFields) && B !== !pe;
      }
      if (N) {
        const pe = H(r.touchedFields, v);
        pe || (be(r.touchedFields, v, N), le.touchedFields = r.touchedFields, F = F || (u.touchedFields || f.touchedFields) && pe !== N);
      }
      F && T && h.state.next(le);
    }
    return F ? le : {};
  }, R = (v, _, N, O) => {
    const T = H(r.errors, v), F = (u.isValid || f.isValid) && Mt(_) && r.isValid !== _;
    if (t.delayError && N ? (c = g(() => x(v, N)), c(t.delayError)) : (clearTimeout(d), c = null, N ? be(r.errors, v, N) : Oe(r.errors, v)), (N ? !rr(T, N) : T) || !ht(O) || F) {
      const B = {
        ...O,
        ...F && Mt(_) ? { isValid: _ } : {},
        errors: r.errors,
        name: v
      };
      r = {
        ...r,
        ...B
      }, h.state.next(B);
    }
  }, C = async (v) => {
    y(v, !0);
    const _ = await t.resolver(o, t.context, Px(v || l.mount, n, t.criteriaMode, t.shouldUseNativeValidation));
    return y(v), _;
  }, S = async (v) => {
    const { errors: _ } = await C(v);
    if (v)
      for (const N of v) {
        const O = H(_, N);
        O ? be(r.errors, N, O) : Oe(r.errors, N);
      }
    else
      r.errors = _;
    return _;
  }, E = async (v, _, N = {
    valid: !0
  }) => {
    for (const O in v) {
      const T = v[O];
      if (T) {
        const { _f: F, ...B } = T;
        if (F) {
          const le = l.array.has(F.name), pe = T._f && Nx(T._f);
          pe && u.validatingFields && y([O], !0);
          const Le = await Rl(T, l.disabled, o, m, t.shouldUseNativeValidation && !_, le);
          if (pe && u.validatingFields && y([O]), Le[F.name] && (N.valid = !1, _))
            break;
          !_ && (H(Le, F.name) ? le ? Vx(r.errors, Le, F.name) : be(r.errors, F.name, Le[F.name]) : Oe(r.errors, F.name));
        }
        !ht(B) && await E(B, _, N);
      }
    }
    return N.valid;
  }, D = () => {
    for (const v of l.unMount) {
      const _ = H(n, v);
      _ && (_._f.refs ? _._f.refs.every((N) => !Xs(N)) : !Xs(_._f.ref)) && ne(v);
    }
    l.unMount = /* @__PURE__ */ new Set();
  }, L = (v, _) => !t.disabled && (v && _ && be(o, v, _), !rr(he(), s)), M = (v, _, N) => Ex(v, l, {
    ...a.mount ? o : We(_) ? s : It(v) ? { [v]: _ } : _
  }, N, _), q = (v) => bo(H(a.mount ? o : s, v, t.shouldUnregister ? H(s, v, []) : [])), U = (v, _, N = {}) => {
    const O = H(n, v);
    let T = _;
    if (O) {
      const F = O._f;
      F && (!F.disabled && be(o, v, Yd(_, F)), T = ls(F.ref) && ot(_) ? "" : _, Wd(F.ref) ? [...F.ref.options].forEach((B) => B.selected = T.includes(B.value)) : F.refs ? zn(F.ref) ? F.refs.forEach((B) => {
        (!B.defaultChecked || !B.disabled) && (Array.isArray(T) ? B.checked = !!T.find((le) => le === B.value) : B.checked = T === B.value || !!T);
      }) : F.refs.forEach((B) => B.checked = B.value === T) : Co(F.ref) ? F.ref.value = "" : (F.ref.value = T, F.ref.type || h.state.next({
        name: v,
        values: Ke(o)
      })));
    }
    (N.shouldDirty || N.shouldTouch) && A(v, T, N.shouldTouch, N.shouldDirty, !0), N.shouldValidate && Y(v);
  }, J = (v, _, N) => {
    for (const O in _) {
      if (!_.hasOwnProperty(O))
        return;
      const T = _[O], F = v + "." + O, B = H(n, F);
      (l.array.has(v) || $e(T) || B && !B._f) && !pr(T) ? J(F, T, N) : U(F, T, N);
    }
  }, ce = (v, _, N = {}) => {
    const O = H(n, v), T = l.array.has(v), F = Ke(_);
    be(o, v, F), T ? (h.array.next({
      name: v,
      values: Ke(o)
    }), (u.isDirty || u.dirtyFields || f.isDirty || f.dirtyFields) && N.shouldDirty && h.state.next({
      name: v,
      dirtyFields: sn(s, o),
      isDirty: L(v, F)
    })) : O && !O._f && !ot(F) ? J(v, F, N) : U(v, F, N), _l(v, l) && h.state.next({ ...r, name: v }), h.state.next({
      name: a.mount ? v : void 0,
      values: Ke(o)
    });
  }, K = async (v) => {
    a.mount = !0;
    const _ = v.target;
    let N = _.name, O = !0;
    const T = H(n, N), F = (pe) => {
      O = Number.isNaN(pe) || pr(pe) && isNaN(pe.getTime()) || rr(pe, H(o, N, pe));
    }, B = kl(t.mode), le = kl(t.reValidateMode);
    if (T) {
      let pe, Le;
      const Ht = _.type ? Cl(T._f) : wx(v), et = v.type === yl.BLUR || v.type === yl.FOCUS_OUT, or = !Fx(T._f) && !t.resolver && !H(r.errors, N) && !T._f.deps || Mx(et, H(r.touchedFields, N), r.isSubmitted, le, B), ar = _l(N, l, et);
      be(o, N, Ht), et ? (!_ || !_.readOnly) && (T._f.onBlur && T._f.onBlur(v), c && c(0)) : T._f.onChange && T._f.onChange(v);
      const dt = A(N, Ht, et), $t = !ht(dt) || ar;
      if (!et && h.state.next({
        name: N,
        type: v.type,
        values: Ke(o)
      }), or)
        return (u.isValid || f.isValid) && (t.mode === "onBlur" ? et && p() : et || p()), $t && h.state.next({ name: N, ...ar ? {} : dt });
      if (!et && ar && h.state.next({ ...r }), t.resolver) {
        const { errors: ze } = await C([N]);
        if (F(Ht), O) {
          const Qr = Tl(r.errors, n, N), Xt = Tl(ze, n, Qr.name || N);
          pe = Xt.error, N = Xt.name, Le = ht(ze);
        }
      } else
        y([N], !0), pe = (await Rl(T, l.disabled, o, m, t.shouldUseNativeValidation))[N], y([N]), F(Ht), O && (pe ? Le = !1 : (u.isValid || f.isValid) && (Le = await E(n, !0)));
      O && (T._f.deps && Y(T._f.deps), R(N, Le, pe, dt));
    }
  }, ue = (v, _) => {
    if (H(r.errors, _) && v.focus)
      return v.focus(), 1;
  }, Y = async (v, _ = {}) => {
    let N, O;
    const T = mn(v);
    if (t.resolver) {
      const F = await S(We(v) ? v : T);
      N = ht(F), O = v ? !T.some((B) => H(F, B)) : N;
    } else v ? (O = (await Promise.all(T.map(async (F) => {
      const B = H(n, F);
      return await E(B && B._f ? { [F]: B } : B);
    }))).every(Boolean), !(!O && !r.isValid) && p()) : O = N = await E(n);
    return h.state.next({
      ...!It(v) || (u.isValid || f.isValid) && N !== r.isValid ? {} : { name: v },
      ...t.resolver || !v ? { isValid: N } : {},
      errors: r.errors
    }), _.shouldFocus && !O && gn(n, ue, v ? T : l.mount), O;
  }, he = (v) => {
    const _ = {
      ...a.mount ? o : s
    };
    return We(v) ? _ : It(v) ? H(_, v) : v.map((N) => H(_, N));
  }, oe = (v, _) => ({
    invalid: !!H((_ || r).errors, v),
    isDirty: !!H((_ || r).dirtyFields, v),
    error: H((_ || r).errors, v),
    isValidating: !!H(r.validatingFields, v),
    isTouched: !!H((_ || r).touchedFields, v)
  }), Ae = (v) => {
    v && mn(v).forEach((_) => Oe(r.errors, _)), h.state.next({
      errors: v ? r.errors : {}
    });
  }, nt = (v, _, N) => {
    const O = (H(n, v, { _f: {} })._f || {}).ref, T = H(r.errors, v) || {}, { ref: F, message: B, type: le, ...pe } = T;
    be(r.errors, v, {
      ...pe,
      ..._,
      ref: O
    }), h.state.next({
      name: v,
      errors: r.errors,
      isValid: !1
    }), N && N.shouldFocus && O && O.focus && O.focus();
  }, Ne = (v, _) => Rt(v) ? h.state.subscribe({
    next: (N) => "values" in N && v(M(void 0, _), N)
  }) : M(v, _, !0), Me = (v) => h.state.subscribe({
    next: (_) => {
      $x(v.name, _.name, v.exact) && Dx(_, v.formState || u, Ve, v.reRenderRoot) && v.callback({
        values: { ...o },
        ...r,
        ..._,
        defaultValues: s
      });
    }
  }).unsubscribe, de = (v) => (a.mount = !0, f = {
    ...f,
    ...v.formState
  }, Me({
    ...v,
    formState: f
  })), ne = (v, _ = {}) => {
    for (const N of v ? mn(v) : l.mount)
      l.mount.delete(N), l.array.delete(N), _.keepValue || (Oe(n, N), Oe(o, N)), !_.keepError && Oe(r.errors, N), !_.keepDirty && Oe(r.dirtyFields, N), !_.keepTouched && Oe(r.touchedFields, N), !_.keepIsValidating && Oe(r.validatingFields, N), !t.shouldUnregister && !_.keepDefaultValue && Oe(s, N);
    h.state.next({
      values: Ke(o)
    }), h.state.next({
      ...r,
      ..._.keepDirty ? { isDirty: L() } : {}
    }), !_.keepIsValid && p();
  }, Ie = ({ disabled: v, name: _ }) => {
    (Mt(v) && a.mount || v || l.disabled.has(_)) && (v ? l.disabled.add(_) : l.disabled.delete(_));
  }, Ze = (v, _ = {}) => {
    let N = H(n, v);
    const O = Mt(_.disabled) || Mt(t.disabled);
    return be(n, v, {
      ...N || {},
      _f: {
        ...N && N._f ? N._f : { ref: { name: v } },
        name: v,
        mount: !0,
        ..._
      }
    }), l.mount.add(v), N ? Ie({
      disabled: Mt(_.disabled) ? _.disabled : t.disabled,
      name: v
    }) : k(v, !0, _.value), {
      ...O ? { disabled: _.disabled || t.disabled } : {},
      ...t.progressive ? {
        required: !!_.required,
        min: on(_.min),
        max: on(_.max),
        minLength: on(_.minLength),
        maxLength: on(_.maxLength),
        pattern: on(_.pattern)
      } : {},
      name: v,
      onChange: K,
      onBlur: K,
      ref: (T) => {
        if (T) {
          Ze(v, _), N = H(n, v);
          const F = We(T.value) && T.querySelectorAll && T.querySelectorAll("input,select,textarea")[0] || T, B = Rx(F), le = N._f.refs || [];
          if (B ? le.find((pe) => pe === F) : F === N._f.ref)
            return;
          be(n, v, {
            _f: {
              ...N._f,
              ...B ? {
                refs: [
                  ...le.filter(Xs),
                  F,
                  ...Array.isArray(H(s, v)) ? [{}] : []
                ],
                ref: { type: F.type, name: v }
              } : { ref: F }
            }
          }), k(v, !1, void 0, F);
        } else
          N = H(n, v, {}), N._f && (N._f.mount = !1), (t.shouldUnregister || _.shouldUnregister) && !(Cx(l.array, v) && a.action) && l.unMount.add(v);
      }
    };
  }, lt = () => t.shouldFocusError && gn(n, ue, l.mount), je = (v) => {
    Mt(v) && (h.state.next({ disabled: v }), gn(n, (_, N) => {
      const O = H(n, N);
      O && (_.disabled = O._f.disabled || v, Array.isArray(O._f.refs) && O._f.refs.forEach((T) => {
        T.disabled = O._f.disabled || v;
      }));
    }, 0, !1));
  }, kt = (v, _) => async (N) => {
    let O;
    N && (N.preventDefault && N.preventDefault(), N.persist && N.persist());
    let T = Ke(o);
    if (h.state.next({
      isSubmitting: !0
    }), t.resolver) {
      const { errors: F, values: B } = await C();
      r.errors = F, T = Ke(B);
    } else
      await E(n);
    if (l.disabled.size)
      for (const F of l.disabled)
        Oe(T, F);
    if (Oe(r.errors, "root"), ht(r.errors)) {
      h.state.next({
        errors: {}
      });
      try {
        await v(T, N);
      } catch (F) {
        O = F;
      }
    } else
      _ && await _({ ...r.errors }, N), lt(), setTimeout(lt);
    if (h.state.next({
      isSubmitted: !0,
      isSubmitting: !1,
      isSubmitSuccessful: ht(r.errors) && !O,
      submitCount: r.submitCount + 1,
      errors: r.errors
    }), O)
      throw O;
  }, ct = (v, _ = {}) => {
    H(n, v) && (We(_.defaultValue) ? ce(v, Ke(H(s, v))) : (ce(v, _.defaultValue), be(s, v, Ke(_.defaultValue))), _.keepTouched || Oe(r.touchedFields, v), _.keepDirty || (Oe(r.dirtyFields, v), r.isDirty = _.defaultValue ? L(v, Ke(H(s, v))) : L()), _.keepError || (Oe(r.errors, v), u.isValid && p()), h.state.next({ ...r }));
  }, St = (v, _ = {}) => {
    const N = v ? Ke(v) : s, O = Ke(N), T = ht(v), F = T ? s : O;
    if (_.keepDefaultValues || (s = N), !_.keepValues) {
      if (_.keepDirtyValues) {
        const B = /* @__PURE__ */ new Set([
          ...l.mount,
          ...Object.keys(sn(s, o))
        ]);
        for (const le of Array.from(B))
          H(r.dirtyFields, le) ? be(F, le, H(o, le)) : ce(le, H(F, le));
      } else {
        if (yo && We(v))
          for (const B of l.mount) {
            const le = H(n, B);
            if (le && le._f) {
              const pe = Array.isArray(le._f.refs) ? le._f.refs[0] : le._f.ref;
              if (ls(pe)) {
                const Le = pe.closest("form");
                if (Le) {
                  Le.reset();
                  break;
                }
              }
            }
          }
        if (_.keepFieldsRef)
          for (const B of l.mount)
            ce(B, H(F, B));
        else
          n = {};
      }
      o = t.shouldUnregister ? _.keepDefaultValues ? Ke(s) : {} : Ke(F), h.array.next({
        values: { ...F }
      }), h.state.next({
        values: { ...F }
      });
    }
    l = {
      mount: _.keepDirtyValues ? l.mount : /* @__PURE__ */ new Set(),
      unMount: /* @__PURE__ */ new Set(),
      array: /* @__PURE__ */ new Set(),
      disabled: /* @__PURE__ */ new Set(),
      watch: /* @__PURE__ */ new Set(),
      watchAll: !1,
      focus: ""
    }, a.mount = !u.isValid || !!_.keepIsValid || !!_.keepDirtyValues, a.watch = !!t.shouldUnregister, h.state.next({
      submitCount: _.keepSubmitCount ? r.submitCount : 0,
      isDirty: T ? !1 : _.keepDirty ? r.isDirty : !!(_.keepDefaultValues && !rr(v, s)),
      isSubmitted: _.keepIsSubmitted ? r.isSubmitted : !1,
      dirtyFields: T ? {} : _.keepDirtyValues ? _.keepDefaultValues && o ? sn(s, o) : r.dirtyFields : _.keepDefaultValues && v ? sn(s, v) : _.keepDirty ? r.dirtyFields : {},
      touchedFields: _.keepTouched ? r.touchedFields : {},
      errors: _.keepErrors ? r.errors : {},
      isSubmitSuccessful: _.keepIsSubmitSuccessful ? r.isSubmitSuccessful : !1,
      isSubmitting: !1,
      defaultValues: s
    });
  }, Ce = (v, _) => St(Rt(v) ? v(o) : v, _), He = (v, _ = {}) => {
    const N = H(n, v), O = N && N._f;
    if (O) {
      const T = O.refs ? O.refs[0] : O.ref;
      T.focus && (T.focus(), _.shouldSelect && Rt(T.select) && T.select());
    }
  }, Ve = (v) => {
    r = {
      ...r,
      ...v
    };
  }, st = {
    control: {
      register: Ze,
      unregister: ne,
      getFieldState: oe,
      handleSubmit: kt,
      setError: nt,
      _subscribe: Me,
      _runSchema: C,
      _focusError: lt,
      _getWatch: M,
      _getDirty: L,
      _setValid: p,
      _setFieldArray: j,
      _setDisabledField: Ie,
      _setErrors: b,
      _getFieldArray: q,
      _reset: St,
      _resetDefaultValues: () => Rt(t.defaultValues) && t.defaultValues().then((v) => {
        Ce(v, t.resetOptions), h.state.next({
          isLoading: !1
        });
      }),
      _removeUnmounted: D,
      _disableForm: je,
      _subjects: h,
      _proxyFormState: u,
      get _fields() {
        return n;
      },
      get _formValues() {
        return o;
      },
      get _state() {
        return a;
      },
      set _state(v) {
        a = v;
      },
      get _defaultValues() {
        return s;
      },
      get _names() {
        return l;
      },
      set _names(v) {
        l = v;
      },
      get _formState() {
        return r;
      },
      get _options() {
        return t;
      },
      set _options(v) {
        t = {
          ...t,
          ...v
        };
      }
    },
    subscribe: de,
    trigger: Y,
    register: Ze,
    handleSubmit: kt,
    watch: Ne,
    setValue: ce,
    getValues: he,
    reset: Ce,
    resetField: ct,
    clearErrors: Ae,
    unregister: ne,
    setError: nt,
    setFocus: He,
    getFieldState: oe
  };
  return {
    ...st,
    formControl: st
  };
}
function Ox(e = {}) {
  const t = P.useRef(void 0), r = P.useRef(void 0), [n, s] = P.useState({
    isDirty: !1,
    isValidating: !1,
    isLoading: Rt(e.defaultValues),
    isSubmitted: !1,
    isSubmitting: !1,
    isSubmitSuccessful: !1,
    isValid: !1,
    submitCount: 0,
    dirtyFields: {},
    touchedFields: {},
    validatingFields: {},
    errors: e.errors || {},
    disabled: e.disabled || !1,
    isReady: !1,
    defaultValues: Rt(e.defaultValues) ? void 0 : e.defaultValues
  });
  if (!t.current)
    if (e.formControl)
      t.current = {
        ...e.formControl,
        formState: n
      }, e.defaultValues && !Rt(e.defaultValues) && e.formControl.reset(e.defaultValues, e.resetOptions);
    else {
      const { formControl: a, ...l } = Bx(e);
      t.current = {
        ...l,
        formState: n
      };
    }
  const o = t.current.control;
  return o._options = e, Tx(() => {
    const a = o._subscribe({
      formState: o._proxyFormState,
      callback: () => s({ ...o._formState }),
      reRenderRoot: !0
    });
    return s((l) => ({
      ...l,
      isReady: !0
    })), o._formState.isReady = !0, a;
  }, [o]), P.useEffect(() => o._disableForm(e.disabled), [o, e.disabled]), P.useEffect(() => {
    e.mode && (o._options.mode = e.mode), e.reValidateMode && (o._options.reValidateMode = e.reValidateMode);
  }, [o, e.mode, e.reValidateMode]), P.useEffect(() => {
    e.errors && (o._setErrors(e.errors), o._focusError());
  }, [o, e.errors]), P.useEffect(() => {
    e.shouldUnregister && o._subjects.state.next({
      values: o._getWatch()
    });
  }, [o, e.shouldUnregister]), P.useEffect(() => {
    if (o._proxyFormState.isDirty) {
      const a = o._getDirty();
      a !== n.isDirty && o._subjects.state.next({
        isDirty: a
      });
    }
  }, [o, n.isDirty]), P.useEffect(() => {
    e.values && !rr(e.values, r.current) ? (o._reset(e.values, {
      keepFieldsRef: !0,
      ...o._options.resetOptions
    }), r.current = e.values, s((a) => ({ ...a }))) : o._resetDefaultValues();
  }, [o, e.values]), P.useEffect(() => {
    o._state.mount || (o._setValid(), o._state.mount = !0), o._state.watch && (o._state.watch = !1, o._subjects.state.next({ ...o._formState })), o._removeUnmounted();
  }), t.current.formState = _x(n, o), t.current;
}
const qt = P.forwardRef(({
  variant: e = "default",
  inputSize: t = "md",
  error: r = !1,
  success: n = !1,
  fullWidth: s = !1,
  icon: o,
  iconPosition: a = "left",
  style: l,
  name: c,
  onFocus: d,
  onBlur: u,
  ...f
}, h) => {
  const [m, g] = P.useState(!1);
  let p;
  try {
    p = Xr();
  } catch {
  }
  const y = c && p ? p.register(c) : {}, j = {
    xs: {
      padding: "6px 10px",
      fontSize: "12px",
      height: "32px",
      iconPadding: "32px"
    },
    sm: {
      padding: "8px 12px",
      fontSize: "14px",
      height: "36px",
      iconPadding: "36px"
    },
    md: {
      padding: "10px 14px",
      fontSize: "16px",
      height: "44px",
      iconPadding: "40px"
    },
    lg: {
      padding: "12px 16px",
      fontSize: "18px",
      height: "52px",
      iconPadding: "44px"
    },
    xl: {
      padding: "14px 18px",
      fontSize: "20px",
      height: "60px",
      iconPadding: "48px"
    }
  }, x = () => {
    switch (e) {
      case "filled":
        return {
          backgroundColor: "rgb(var(--surface))",
          border: "2px solid transparent",
          boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.05)"
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          border: "none",
          borderBottom: "2px solid rgb(var(--border))",
          borderRadius: "0",
          paddingLeft: "0",
          paddingRight: "0"
        };
      default:
        return {
          backgroundColor: "rgb(var(--background))",
          border: "2px solid rgb(var(--border))",
          boxShadow: "var(--shadow-sm)"
        };
    }
  }, b = () => r ? {
    borderColor: "rgb(var(--error))",
    backgroundColor: "rgb(var(--error) / 0.05)"
  } : n ? {
    borderColor: "rgb(var(--success))",
    backgroundColor: "rgb(var(--success) / 0.05)"
  } : m && !r && !n ? {
    borderColor: "rgb(var(--primary))",
    boxShadow: e !== "ghost" ? "0 0 0 3px rgb(var(--primary) / 0.1)" : void 0
  } : {}, k = {
    ...j[t],
    ...x(),
    ...b(),
    width: s ? "100%" : "auto",
    borderRadius: e === "ghost" ? "0" : "var(--radius)",
    fontFamily: "var(--font-sans)",
    color: "rgb(var(--text))",
    outline: "none",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    paddingLeft: o && a === "left" ? j[t].iconPadding : void 0,
    paddingRight: o && a === "right" ? j[t].iconPadding : void 0,
    ...l
  };
  P.useEffect(() => {
    if (typeof document < "u") {
      const S = "qwanyx-input-placeholder-styles";
      if (!document.getElementById(S)) {
        const E = document.createElement("style");
        E.id = S, E.textContent = `
          .qwanyx-input::placeholder {
            color: rgb(var(--text-muted));
            opacity: 0.7;
          }
          
          .qwanyx-input:hover:not(:focus):not(:disabled) {
            border-color: rgb(var(--text-secondary) / 0.5);
          }
          
          .qwanyx-input:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background-color: rgb(var(--surface));
          }
        `, document.head.appendChild(E);
      }
    }
  }, []);
  const A = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    color: r ? "rgb(var(--error))" : n ? "rgb(var(--success))" : "rgb(var(--text-muted))",
    transition: "color 0.2s ease",
    ...a === "left" ? { left: "12px" } : { right: "12px" }
  }, R = (S) => {
    g(!0), d && d(S);
  }, C = (S) => {
    g(!1), u && u(S);
  };
  if (o) {
    const S = {
      position: "relative",
      display: "inline-block",
      width: s ? "100%" : "auto"
    };
    return /* @__PURE__ */ i.jsxs("div", { style: S, children: [
      /* @__PURE__ */ i.jsx("div", { style: A, children: o }),
      /* @__PURE__ */ i.jsx(
        "input",
        {
          ref: h,
          className: "qwanyx-input",
          style: k,
          onFocus: R,
          onBlur: C,
          ...y,
          ...f
        }
      )
    ] });
  }
  return /* @__PURE__ */ i.jsx(
    "input",
    {
      ref: h,
      className: "qwanyx-input",
      style: k,
      onFocus: R,
      onBlur: C,
      ...y,
      ...f
    }
  );
});
qt.displayName = "Input";
const So = P.forwardRef(({
  variant: e = "default",
  textareaSize: t = "md",
  error: r = !1,
  success: n = !1,
  fullWidth: s = !1,
  resize: o = "vertical",
  style: a,
  name: l,
  onFocus: c,
  onBlur: d,
  ...u
}, f) => {
  const [h, m] = P.useState(!1);
  let g;
  try {
    g = Xr();
  } catch {
  }
  const p = l && g ? g.register(l) : {}, y = {
    xs: {
      padding: "6px 10px",
      fontSize: "12px",
      minHeight: "80px"
    },
    sm: {
      padding: "8px 12px",
      fontSize: "14px",
      minHeight: "100px"
    },
    md: {
      padding: "10px 14px",
      fontSize: "16px",
      minHeight: "120px"
    },
    lg: {
      padding: "12px 16px",
      fontSize: "18px",
      minHeight: "140px"
    },
    xl: {
      padding: "14px 18px",
      fontSize: "20px",
      minHeight: "160px"
    }
  }, j = () => {
    switch (e) {
      case "filled":
        return {
          backgroundColor: "rgb(var(--surface))",
          border: "2px solid transparent",
          boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.05)"
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          border: "none",
          borderBottom: "2px solid rgb(var(--border))",
          borderRadius: "0",
          paddingLeft: "0",
          paddingRight: "0"
        };
      default:
        return {
          backgroundColor: "rgb(var(--background))",
          border: "2px solid rgb(var(--border))",
          boxShadow: "var(--shadow-sm)"
        };
    }
  }, x = () => r ? {
    borderColor: "rgb(var(--error))",
    backgroundColor: "rgb(var(--error) / 0.05)"
  } : n ? {
    borderColor: "rgb(var(--success))",
    backgroundColor: "rgb(var(--success) / 0.05)"
  } : h && !r && !n ? {
    borderColor: "rgb(var(--primary))",
    boxShadow: e !== "ghost" ? "0 0 0 3px rgb(var(--primary) / 0.1)" : void 0
  } : {}, b = {
    ...y[t],
    ...j(),
    ...x(),
    width: s ? "100%" : "auto",
    borderRadius: e === "ghost" ? "0" : "var(--radius)",
    fontFamily: "var(--font-sans)",
    color: "rgb(var(--text))",
    outline: "none",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    resize: o,
    lineHeight: "1.6",
    ...a
  }, k = (R) => {
    m(!0), c && c(R);
  }, A = (R) => {
    m(!1), d && d(R);
  };
  return /* @__PURE__ */ i.jsx(
    "textarea",
    {
      ref: f,
      className: "qwanyx-input",
      style: b,
      onFocus: k,
      onBlur: A,
      ...p,
      ...u
    }
  );
});
So.displayName = "Textarea";
const Se = P.forwardRef(({
  children: e,
  size: t = "xl",
  padding: r = "md",
  center: n = !0,
  className: s = "",
  style: o,
  ...a
}, l) => {
  const c = () => {
    switch (t) {
      case "sm":
        return "var(--container-sm)";
      case "md":
        return "var(--container-md)";
      case "lg":
        return "var(--container-lg)";
      case "xl":
        return "var(--container-xl)";
      case "2xl":
        return "var(--container-2xl)";
      case "full":
        return "100%";
      default:
        return "var(--container-xl)";
    }
  }, d = () => {
    switch (r) {
      case "none":
        return "0";
      case "sm":
        return "var(--spacing-sm)";
      case "md":
        return "var(--spacing-md)";
      case "lg":
        return "var(--spacing-lg)";
      case "xl":
        return "var(--spacing-xl)";
      default:
        return "var(--spacing-md)";
    }
  }, u = {
    width: "100%",
    maxWidth: c(),
    marginLeft: n ? "auto" : void 0,
    marginRight: n ? "auto" : void 0,
    paddingLeft: d(),
    paddingRight: d(),
    ...o
  };
  return /* @__PURE__ */ i.jsx("div", { ref: l, className: s, style: u, ...a, children: e });
});
Se.displayName = "Container";
const zt = P.forwardRef(({
  children: e,
  spacing: t = "lg",
  gap: r,
  fullHeight: n = !1,
  className: s = "",
  style: o,
  ...a
}, l) => {
  const c = () => {
    switch (t) {
      case "none":
        return "0";
      case "sm":
        return "var(--spacing-sm)";
      case "md":
        return "var(--spacing-md)";
      case "lg":
        return "var(--spacing-lg)";
      case "xl":
        return "var(--spacing-xl)";
      case "2xl":
        return "var(--spacing-2xl)";
      default:
        return "var(--spacing-lg)";
    }
  }, d = () => {
    if (!(!r || r === "none"))
      switch (r) {
        case "sm":
          return "var(--spacing-sm)";
        case "md":
          return "var(--spacing-md)";
        case "lg":
          return "var(--spacing-lg)";
        case "xl":
          return "var(--spacing-xl)";
        case "2xl":
          return "var(--spacing-2xl)";
        default:
          return;
      }
  }, u = {
    paddingTop: c(),
    paddingBottom: c(),
    display: r ? "flex" : void 0,
    flexDirection: r ? "column" : void 0,
    gap: d(),
    minHeight: n ? "100vh" : void 0,
    ...o
  };
  return /* @__PURE__ */ i.jsx("section", { ref: l, className: s, style: u, ...a, children: e });
});
zt.displayName = "Section";
const Nt = P.forwardRef(({
  children: e,
  cols: t = 3,
  gap: r = "md",
  responsive: n = !0,
  minChildWidth: s,
  className: o = "",
  style: a,
  ...l
}, c) => {
  const d = () => {
    switch (r) {
      case "none":
        return "0";
      case "sm":
        return "var(--spacing-sm)";
      case "md":
        return "var(--spacing-md)";
      case "lg":
        return "var(--spacing-lg)";
      case "xl":
        return "var(--spacing-xl)";
      default:
        return "var(--spacing-md)";
    }
  }, f = {
    display: "grid",
    gridTemplateColumns: t === "auto" ? `repeat(auto-fit, minmax(${s || "250px"}, 1fr))` : n && typeof t == "number" ? `repeat(auto-fit, minmax(min(100%, ${s || `${Math.max(200, 100 / t)}px`}), 1fr))` : `repeat(${t}, 1fr)`,
    gap: d(),
    ...a
  };
  return /* @__PURE__ */ i.jsx("div", { ref: c, className: o, style: f, ...l, children: e });
});
Nt.displayName = "Grid";
const es = P.forwardRef(({
  children: e,
  direction: t = "row",
  wrap: r = "nowrap",
  justify: n = "start",
  align: s = "stretch",
  gap: o = "none",
  fullWidth: a = !1,
  fullHeight: l = !1,
  className: c = "",
  style: d,
  ...u
}, f) => {
  const h = () => {
    switch (o) {
      case "none":
        return "0";
      case "sm":
        return "var(--spacing-sm)";
      case "md":
        return "var(--spacing-md)";
      case "lg":
        return "var(--spacing-lg)";
      case "xl":
        return "var(--spacing-xl)";
      default:
        return "0";
    }
  }, m = () => {
    switch (t) {
      case "row":
        return "row";
      case "col":
        return "column";
      case "row-reverse":
        return "row-reverse";
      case "col-reverse":
        return "column-reverse";
      default:
        return "row";
    }
  }, g = () => {
    switch (n) {
      case "start":
        return "flex-start";
      case "end":
        return "flex-end";
      case "center":
        return "center";
      case "between":
        return "space-between";
      case "around":
        return "space-around";
      case "evenly":
        return "space-evenly";
      default:
        return "flex-start";
    }
  }, p = () => {
    switch (s) {
      case "start":
        return "flex-start";
      case "end":
        return "flex-end";
      case "center":
        return "center";
      case "baseline":
        return "baseline";
      case "stretch":
        return "stretch";
      default:
        return "stretch";
    }
  }, y = {
    display: "flex",
    flexDirection: m(),
    flexWrap: r,
    justifyContent: g(),
    alignItems: p(),
    gap: h(),
    width: a ? "100%" : void 0,
    height: l ? "100%" : void 0,
    ...d
  };
  return /* @__PURE__ */ i.jsx("div", { ref: f, className: c, style: y, ...u, children: e });
});
es.displayName = "Flex";
const qx = P.forwardRef(({
  children: e,
  columns: t = 12,
  gap: r = "md",
  align: n = "stretch",
  justify: s = "start",
  responsive: o = !0,
  minChildWidth: a,
  flow: l = "row",
  style: c,
  ...d
}, u) => {
  const f = {
    none: "0",
    xs: "8px",
    // 8
    sm: "13px",
    // 8 * 1.618
    md: "21px",
    // 13 * 1.618
    lg: "34px",
    // 21 * 1.618
    xl: "55px",
    // 34 * 1.618
    "2xl": "89px"
    // 55 * 1.618
  }, h = {
    start: "start",
    center: "center",
    end: "end",
    stretch: "stretch",
    baseline: "baseline"
  }, m = {
    start: "start",
    center: "center",
    end: "end",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly"
  }, p = {
    display: "grid",
    gridTemplateColumns: a ? `repeat(auto-fit, minmax(${a}, 1fr))` : t === "auto" ? "repeat(auto-fit, minmax(250px, 1fr))" : o ? `repeat(${t}, minmax(0, 1fr))` : `repeat(${t}, 1fr)`,
    gap: f[r],
    alignItems: h[n],
    justifyContent: m[s],
    gridAutoFlow: l,
    width: "100%",
    ...c
  };
  if (o && t !== "auto" && !a) {
    const y = `grid-${t}-${Math.random().toString(36).substr(2, 9)}`;
    if (typeof document < "u" && !document.getElementById(y)) {
      const j = document.createElement("style");
      j.id = y, j.innerHTML = `
        @media (max-width: 1280px) {
          [data-grid-id="${y}"] {
            grid-template-columns: repeat(${Math.min(t, 8)}, minmax(0, 1fr));
          }
        }
        @media (max-width: 1024px) {
          [data-grid-id="${y}"] {
            grid-template-columns: repeat(${Math.min(t, 6)}, minmax(0, 1fr));
          }
        }
        @media (max-width: 768px) {
          [data-grid-id="${y}"] {
            grid-template-columns: repeat(${Math.min(t, 4)}, minmax(0, 1fr));
          }
        }
        @media (max-width: 640px) {
          [data-grid-id="${y}"] {
            grid-template-columns: repeat(${Math.min(t, 2)}, minmax(0, 1fr));
          }
        }
        @media (max-width: 480px) {
          [data-grid-id="${y}"] {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
        }
      `, document.head.appendChild(j);
    }
    return /* @__PURE__ */ i.jsx("div", { ref: u, style: p, "data-grid-id": y, ...d, children: e });
  }
  return /* @__PURE__ */ i.jsx("div", { ref: u, style: p, ...d, children: e });
});
qx.displayName = "Grid";
const Wx = P.forwardRef(({
  children: e,
  span: t,
  start: r,
  end: n,
  rowSpan: s,
  rowStart: o,
  rowEnd: a,
  order: l,
  style: c,
  ...d
}, u) => {
  const f = {
    ...c
  };
  return t && (f.gridColumn = t === "full" ? "1 / -1" : `span ${t}`), r !== void 0 && (f.gridColumnStart = r), n !== void 0 && (f.gridColumnEnd = n), s && (f.gridRow = `span ${s}`), o !== void 0 && (f.gridRowStart = o), a !== void 0 && (f.gridRowEnd = a), l !== void 0 && (f.order = l), /* @__PURE__ */ i.jsx("div", { ref: u, style: f, ...d, children: e });
});
Wx.displayName = "GridItem";
const Ux = P.forwardRef(({
  children: e,
  direction: t = "row",
  wrap: r = "nowrap",
  justify: n = "start",
  align: s = "stretch",
  gap: o = "none",
  inline: a = !1,
  flex: l,
  style: c,
  ...d
}, u) => {
  const f = {
    none: "0",
    xs: "8px",
    sm: "13px",
    md: "21px",
    lg: "34px",
    xl: "55px",
    "2xl": "89px"
  }, h = {
    start: "flex-start",
    end: "flex-end",
    center: "center",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly"
  }, m = {
    start: "flex-start",
    end: "flex-end",
    center: "center",
    stretch: "stretch",
    baseline: "baseline"
  }, g = {
    display: a ? "inline-flex" : "flex",
    flexDirection: t,
    flexWrap: r,
    justifyContent: h[n],
    alignItems: m[s],
    gap: f[o],
    flex: l,
    ...c
  };
  return /* @__PURE__ */ i.jsx("div", { ref: u, style: g, ...d, children: e });
});
Ux.displayName = "Flex";
const Zx = P.forwardRef(({
  children: e,
  grow: t = 0,
  shrink: r = 1,
  basis: n = "auto",
  order: s,
  alignSelf: o = "auto",
  style: a,
  ...l
}, c) => {
  const u = {
    flexGrow: t,
    flexShrink: r,
    flexBasis: n,
    order: s,
    alignSelf: {
      auto: "auto",
      start: "flex-start",
      end: "flex-end",
      center: "center",
      stretch: "stretch",
      baseline: "baseline"
    }[o],
    ...a
  };
  return /* @__PURE__ */ i.jsx("div", { ref: c, style: u, ...l, children: e });
});
Zx.displayName = "FlexItem";
const Hx = ({
  size: e = "auto",
  direction: t = "horizontal"
}) => {
  if (e === "auto")
    return /* @__PURE__ */ i.jsx("div", { style: { flex: "1 1 auto" } });
  const r = {
    xs: "8px",
    sm: "13px",
    md: "21px",
    lg: "34px",
    xl: "55px",
    "2xl": "89px"
  }, n = {
    width: t === "vertical" ? void 0 : r[e],
    height: t === "horizontal" ? void 0 : r[e],
    minWidth: t === "both" ? r[e] : void 0,
    minHeight: t === "both" ? r[e] : void 0,
    flexShrink: 0
  };
  return /* @__PURE__ */ i.jsx("div", { style: n });
};
Hx.displayName = "Spacer";
const _o = P.forwardRef(({
  children: e,
  direction: t = "vertical",
  spacing: r = "md",
  align: n = "stretch",
  justify: s = "start",
  divider: o = !1,
  dividerColor: a = "rgb(var(--border))",
  wrap: l = !1,
  reverse: c = !1,
  inline: d = !1,
  style: u,
  ...f
}, h) => {
  const m = {
    none: "0",
    xs: "8px",
    sm: "13px",
    md: "21px",
    lg: "34px",
    xl: "55px",
    "2xl": "89px"
  }, g = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    stretch: "stretch"
  }, p = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly"
  }, y = t === "vertical", x = {
    display: d ? "inline-flex" : "flex",
    flexDirection: y ? c ? "column-reverse" : "column" : c ? "row-reverse" : "row",
    gap: m[r],
    alignItems: g[n],
    justifyContent: p[s],
    flexWrap: l ? "wrap" : "nowrap",
    width: y && !d ? "100%" : void 0,
    ...u
  }, b = P.Children.toArray(e).filter(Boolean);
  if (o && b.length > 1) {
    const k = [];
    return b.forEach((A, R) => {
      if (k.push(A), R < b.length - 1) {
        const C = y ? {
          width: "100%",
          height: "1px",
          backgroundColor: a,
          flexShrink: 0
        } : {
          width: "1px",
          height: "100%",
          minHeight: "20px",
          backgroundColor: a,
          flexShrink: 0
        };
        k.push(
          /* @__PURE__ */ i.jsx("div", { style: C }, `divider-${R}`)
        );
      }
    }), /* @__PURE__ */ i.jsx("div", { ref: h, style: x, ...f, children: k });
  }
  return /* @__PURE__ */ i.jsx("div", { ref: h, style: x, ...f, children: b });
});
_o.displayName = "Stack";
const Yx = P.forwardRef((e, t) => /* @__PURE__ */ i.jsx(_o, { ref: t, direction: "vertical", ...e }));
Yx.displayName = "VStack";
const Gx = P.forwardRef((e, t) => /* @__PURE__ */ i.jsx(_o, { ref: t, direction: "horizontal", ...e }));
Gx.displayName = "HStack";
const Kx = P.forwardRef(({
  children: e,
  inline: t = !1,
  minHeight: r,
  style: n,
  ...s
}, o) => {
  const a = {
    display: t ? "inline-flex" : "flex",
    alignItems: "center",
    justifyContent: "center",
    width: t ? void 0 : "100%",
    minHeight: r,
    ...n
  };
  return /* @__PURE__ */ i.jsx("div", { ref: o, style: a, ...s, children: e });
});
Kx.displayName = "Center";
const Xx = P.forwardRef(({
  children: e,
  columns: t = "auto",
  gap: r = "md",
  breakpoints: n = {
    1280: 5,
    1024: 4,
    768: 3,
    640: 2,
    0: 1
  },
  style: s,
  ...o
}, a) => {
  const l = ae(null), c = a || l, [d, u] = V(3), [f, h] = V(!1), g = {
    none: 0,
    xs: 8,
    sm: 13,
    md: 21,
    lg: 34,
    xl: 55,
    "2xl": 89
  }[r];
  ie(() => {
    h(!0);
    const b = () => {
      const R = c.current;
      if (R)
        if (t === "auto") {
          const C = R.offsetWidth, S = Object.keys(n).map(Number).sort((E, D) => D - E);
          for (const E of S)
            if (C >= E) {
              u(n[E]);
              break;
            }
        } else
          u(t);
    };
    b();
    const k = c.current, A = new ResizeObserver(b);
    return k && A.observe(k), () => {
      A.disconnect();
    };
  }, [t, n]);
  const y = f ? (() => {
    const b = P.Children.toArray(e), k = Array.from(
      { length: d },
      () => []
    );
    return b.forEach((A, R) => {
      const C = R % d;
      k[C].push(A);
    }), k;
  })() : [], j = {
    display: "flex",
    gap: `${g}px`,
    alignItems: "flex-start",
    width: "100%",
    ...s
  }, x = {
    flex: "1 1 0",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: `${g}px`
  };
  return f ? /* @__PURE__ */ i.jsx("div", { ref: c, style: j, ...o, children: y.map((b, k) => /* @__PURE__ */ i.jsx("div", { style: x, children: b }, k)) }) : /* @__PURE__ */ i.jsx("div", { ref: c, style: j, ...o, children: /* @__PURE__ */ i.jsx("div", { style: x, children: e }) });
});
Xx.displayName = "Masonry";
const Jx = P.forwardRef(({
  children: e,
  columns: t = "auto",
  gap: r = "md",
  itemSelector: n = "[data-masonry-item]",
  animate: s = !0,
  breakpoints: o = {
    1280: 5,
    1024: 4,
    768: 3,
    640: 2,
    0: 1
  },
  style: a,
  ...l
}, c) => {
  const d = ae(null), [u, f] = V(3), [h, m] = V({}), p = {
    none: 0,
    xs: 8,
    sm: 13,
    md: 21,
    lg: 34,
    xl: 55,
    "2xl": 89
  }[r];
  ie(() => {
    const j = () => {
      if (d.current)
        if (t === "auto") {
          const x = d.current.offsetWidth, b = Object.keys(o).map(Number).sort((k, A) => A - k);
          for (const k of b)
            if (x >= k) {
              f(o[k]);
              break;
            }
        } else
          f(t);
    };
    return j(), window.addEventListener("resize", j), () => {
      window.removeEventListener("resize", j);
    };
  }, [t, o]), ie(() => {
    if (!d.current) return;
    const j = () => {
      const k = d.current;
      if (!k) return;
      const A = k.querySelectorAll(n), R = (k.offsetWidth - p * (u - 1)) / u, C = new Array(u).fill(0), S = {};
      A.forEach((E, D) => {
        const L = E, M = C.indexOf(Math.min(...C)), q = M * (R + p), U = C[M];
        L.style.position = "absolute", L.style.width = `${R}px`, L.style.transform = `translate(${q}px, ${U}px)`, s && (L.style.transition = "transform 0.3s ease"), C[M] += L.offsetHeight + p, S[D] = M;
      }), k.style.height = `${Math.max(...C) - p}px`, m(S);
    }, x = setTimeout(j, 100), b = d.current.querySelectorAll("img");
    return b.forEach((k) => {
      k.complete ? j() : k.addEventListener("load", j);
    }), () => {
      clearTimeout(x), b.forEach((k) => {
        k.removeEventListener("load", j);
      });
    };
  }, [e, u, p, n, s]);
  const y = {
    position: "relative",
    width: "100%",
    ...a
  };
  return /* @__PURE__ */ i.jsx("div", { ref: c, style: y, ...l, children: /* @__PURE__ */ i.jsx("div", { ref: d, style: { position: "relative", width: "100%" }, children: P.Children.map(e, (j, x) => P.isValidElement(j) ? P.cloneElement(j, {
    ...j.props,
    "data-masonry-item": !0,
    key: x
  }) : j) }) });
});
Jx.displayName = "AdvancedMasonry";
const Qx = P.forwardRef(({
  children: e,
  header: t,
  footer: r,
  sidebar: n,
  aside: s,
  sidebarPosition: o = "left",
  asidePosition: a = "right",
  sidebarWidth: l = "250px",
  asideWidth: c = "300px",
  headerHeight: d = "auto",
  footerHeight: u = "auto",
  gap: f = "md",
  stickyHeader: h = !1,
  stickyFooter: m = !1,
  stickySidebar: g = !1,
  style: p,
  ...y
}, j) => {
  const b = {
    none: "0",
    sm: "13px",
    md: "21px",
    lg: "34px"
  }[f], k = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    ...p
  }, A = {
    height: d,
    flexShrink: 0,
    position: h ? "sticky" : "relative",
    top: h ? 0 : void 0,
    zIndex: h ? 100 : void 0,
    backgroundColor: "rgb(var(--background))",
    borderBottom: "1px solid rgb(var(--border))"
  }, R = {
    flex: 1,
    display: "flex",
    gap: b,
    overflow: "hidden"
  }, C = {
    width: l,
    flexShrink: 0,
    position: g ? "sticky" : "relative",
    top: g ? h ? d : 0 : void 0,
    height: g ? "fit-content" : void 0,
    maxHeight: g ? "calc(100vh - 100px)" : void 0,
    overflowY: "auto",
    order: o === "left" ? -1 : 1
  }, S = {
    width: c,
    flexShrink: 0,
    order: a === "left" ? -2 : 2
  }, E = {
    flex: 1,
    minWidth: 0,
    overflowY: "auto"
  }, D = {
    height: u,
    flexShrink: 0,
    position: m ? "sticky" : "relative",
    bottom: m ? 0 : void 0,
    backgroundColor: "rgb(var(--background))",
    borderTop: "1px solid rgb(var(--border))"
  };
  return /* @__PURE__ */ i.jsxs("div", { ref: j, style: k, ...y, children: [
    t && /* @__PURE__ */ i.jsx("header", { style: A, children: t }),
    /* @__PURE__ */ i.jsxs("main", { style: R, children: [
      s && /* @__PURE__ */ i.jsx("aside", { style: S, children: s }),
      n && /* @__PURE__ */ i.jsx("nav", { style: C, children: n }),
      /* @__PURE__ */ i.jsx("article", { style: E, children: e })
    ] }),
    r && /* @__PURE__ */ i.jsx("footer", { style: D, children: r })
  ] });
});
Qx.displayName = "HolyGrailLayout";
const ey = P.forwardRef(({
  children: e,
  hero: t,
  featured: r = [],
  sidebar: n,
  gap: s = "lg",
  style: o,
  ...a
}, l) => {
  const d = {
    sm: "13px",
    md: "21px",
    lg: "34px",
    xl: "55px"
  }[s], u = {
    display: "grid",
    gridTemplateColumns: n ? "1fr 300px" : "1fr",
    gap: d,
    maxWidth: "1400px",
    margin: "0 auto",
    padding: d,
    ...o
  }, f = {
    gridColumn: n ? "span 2" : "span 1",
    marginBottom: d
  }, h = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: d,
    marginBottom: d
  }, m = {
    display: "flex",
    flexDirection: "column",
    gap: d
  }, g = {
    position: "sticky",
    top: d,
    height: "fit-content",
    maxHeight: `calc(100vh - ${d} * 2)`
  };
  return /* @__PURE__ */ i.jsxs("div", { ref: l, style: u, ...a, children: [
    t && /* @__PURE__ */ i.jsx("section", { style: f, children: t }),
    /* @__PURE__ */ i.jsxs("div", { style: m, children: [
      r.length > 0 && /* @__PURE__ */ i.jsx("section", { style: h, children: r.map((p, y) => /* @__PURE__ */ i.jsx("article", { children: p }, y)) }),
      /* @__PURE__ */ i.jsx("section", { children: e })
    ] }),
    n && /* @__PURE__ */ i.jsx("aside", { style: g, children: n })
  ] });
});
ey.displayName = "MagazineLayout";
const ty = P.forwardRef(({
  left: e,
  right: t,
  ratio: r = "50-50",
  gap: n = "md",
  stackOnMobile: s = !0,
  reverseOnMobile: o = !1,
  style: a,
  ...l
}, c) => {
  const d = {
    none: "0",
    sm: "13px",
    md: "21px",
    lg: "34px",
    xl: "55px"
  }, u = {
    "50-50": "1fr 1fr",
    "60-40": "3fr 2fr",
    "40-60": "2fr 3fr",
    "70-30": "7fr 3fr",
    "30-70": "3fr 7fr",
    golden: "1.618fr 1fr"
  }, f = d[n], h = u[r], m = `split-${Math.random().toString(36).substr(2, 9)}`;
  if (typeof document < "u" && !document.getElementById(m)) {
    const p = document.createElement("style");
    p.id = m, p.innerHTML = `
      @media (max-width: 768px) {
        [data-split-id="${m}"] {
          ${s ? `
            grid-template-columns: 1fr !important;
            ${o ? "direction: rtl;" : ""}
          ` : ""}
        }
        ${o && s ? `
          [data-split-id="${m}"] > * {
            direction: ltr;
          }
        ` : ""}
      }
    `, document.head.appendChild(p);
  }
  const g = {
    display: "grid",
    gridTemplateColumns: h,
    gap: f,
    alignItems: "stretch",
    ...a
  };
  return /* @__PURE__ */ i.jsxs("div", { ref: c, style: g, "data-split-id": m, ...l, children: [
    /* @__PURE__ */ i.jsx("div", { children: e }),
    /* @__PURE__ */ i.jsx("div", { children: t })
  ] });
});
ty.displayName = "SplitLayout";
const ry = P.forwardRef(({
  children: e,
  gap: t = "md",
  style: r,
  ...n
}, s) => {
  const l = {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gridAutoRows: "minmax(120px, auto)",
    gap: {
      sm: "13px",
      md: "21px",
      lg: "34px"
    }[t],
    ...r
  }, c = P.Children.map(e, (d, u) => {
    if (!P.isValidElement(d)) return d;
    const f = [
      { gridColumn: "span 3", gridRow: "span 2" },
      // Large
      { gridColumn: "span 3", gridRow: "span 1" },
      // Wide
      { gridColumn: "span 2", gridRow: "span 1" },
      // Medium
      { gridColumn: "span 2", gridRow: "span 2" },
      // Tall medium
      { gridColumn: "span 2", gridRow: "span 1" },
      // Medium
      { gridColumn: "span 4", gridRow: "span 1" },
      // Extra wide
      { gridColumn: "span 2", gridRow: "span 1" },
      // Medium
      { gridColumn: "span 2", gridRow: "span 1" }
      // Medium
    ], h = f[u % f.length];
    return P.cloneElement(d, {
      style: {
        ...d.props.style,
        ...h
      }
    });
  });
  return /* @__PURE__ */ i.jsx("div", { ref: s, style: l, ...n, children: c });
});
ry.displayName = "BentoLayout";
const ny = P.forwardRef(({
  children: e,
  variant: t = "editorial",
  gap: r = "lg",
  style: n,
  ...s
}, o) => {
  const l = {
    sm: "13px",
    md: "21px",
    lg: "34px",
    xl: "55px"
  }[r], d = {
    display: "grid",
    ...(() => {
      switch (t) {
        case "editorial":
          return {
            gridTemplateColumns: "repeat(12, 1fr)",
            gridTemplateRows: "repeat(auto-fit, minmax(100px, auto))"
          };
        case "artistic":
          return {
            gridTemplateColumns: "repeat(8, 1fr)",
            gridTemplateRows: "repeat(auto-fit, minmax(150px, auto))"
          };
        case "dynamic":
          return {
            gridTemplateColumns: "repeat(10, 1fr)",
            gridTemplateRows: "auto"
          };
        default:
          return {
            gridTemplateColumns: "repeat(12, 1fr)",
            gridTemplateRows: "auto"
          };
      }
    })(),
    gap: l,
    ...n
  }, u = P.Children.map(e, (f, h) => {
    if (!P.isValidElement(f)) return f;
    let m = {};
    if (t === "editorial") {
      const g = [
        { gridColumn: "span 7", gridRow: "span 2" },
        { gridColumn: "span 5", gridRow: "span 1" },
        { gridColumn: "span 5", gridRow: "span 1" },
        { gridColumn: "span 4", gridRow: "span 2" },
        { gridColumn: "span 8", gridRow: "span 1" },
        { gridColumn: "span 3", gridRow: "span 1" },
        { gridColumn: "span 6", gridRow: "span 1" },
        { gridColumn: "span 3", gridRow: "span 2" }
      ];
      m = g[h % g.length];
    } else if (t === "artistic") {
      const g = [
        { gridColumn: "span 5", gridRow: "span 3" },
        { gridColumn: "span 3", gridRow: "span 2" },
        { gridColumn: "span 3", gridRow: "span 1" },
        { gridColumn: "span 5", gridRow: "span 2" },
        { gridColumn: "span 2", gridRow: "span 1" },
        { gridColumn: "span 6", gridRow: "span 2" }
      ];
      m = g[h % g.length];
    } else {
      const g = [
        { gridColumn: "span 6", gridRow: "span 1" },
        { gridColumn: "span 4", gridRow: "span 1" },
        { gridColumn: "span 3", gridRow: "span 1" },
        { gridColumn: "span 7", gridRow: "span 1" },
        { gridColumn: "span 5", gridRow: "span 1" },
        { gridColumn: "span 5", gridRow: "span 1" }
      ];
      m = g[h % g.length];
    }
    return P.cloneElement(f, {
      style: {
        ...f.props.style,
        ...m
      }
    });
  });
  return /* @__PURE__ */ i.jsx("div", { ref: o, style: d, ...s, children: u });
});
ny.displayName = "AsymmetricLayout";
const Kd = P.forwardRef(({
  children: e,
  fixed: t = !1,
  transparent: r = !1,
  bordered: n = !0,
  className: s = "",
  ...o
}, a) => {
  const l = [
    "qwanyx-navbar",
    t && "qwanyx-navbar--fixed",
    r && "qwanyx-navbar--transparent",
    !n && "qwanyx-navbar--borderless",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("nav", { ref: a, className: l, ...o, children: e });
});
Kd.displayName = "Navbar";
const Xd = P.forwardRef(({
  children: e,
  className: t = "",
  ...r
}, n) => /* @__PURE__ */ i.jsx("div", { ref: n, className: `qwanyx-navbar__brand ${t}`, ...r, children: e }));
Xd.displayName = "NavbarBrand";
const sy = P.forwardRef(({
  size: e = "md",
  className: t = "",
  alt: r = "Logo",
  ...n
}, s) => {
  const o = [
    "qwanyx-navbar__logo",
    `qwanyx-navbar__logo--${e}`,
    t
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx(
    "img",
    {
      ref: s,
      className: o,
      alt: r,
      ...n
    }
  );
});
sy.displayName = "NavbarLogo";
const iy = P.forwardRef(({
  children: e,
  align: t = "left",
  className: r = "",
  ...n
}, s) => {
  const o = [
    "qwanyx-navbar__content",
    `qwanyx-navbar__content--${t}`,
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx(
    "div",
    {
      ref: s,
      className: o,
      ...n,
      children: e
    }
  );
});
iy.displayName = "NavbarContent";
const Si = P.forwardRef(({
  children: e,
  active: t = !1,
  as: r = "div",
  className: n = "",
  href: s,
  onClick: o
}, a) => /* @__PURE__ */ i.jsx(
  X,
  {
    ref: a,
    variant: "ghost",
    isActive: t,
    onClick: () => {
      s && (window.location.href = s), o == null || o();
    },
    showRipple: !0,
    animationType: "none",
    className: n,
    style: {
      padding: "8px 16px",
      borderRadius: "var(--radius)",
      fontWeight: t ? 600 : 500,
      color: t ? "rgb(var(--primary))" : "rgb(var(--text))",
      backgroundColor: t ? "rgba(var(--primary), 0.1)" : "transparent",
      border: "none",
      height: "auto",
      transition: "all 0.2s ease",
      textDecoration: "none"
    },
    children: e
  }
));
Si.displayName = "NavbarItem";
const _i = P.forwardRef(({
  children: e,
  mobile: t = !1,
  open: r = !1,
  className: n = "",
  ...s
}, o) => {
  const a = [
    "qwanyx-navbar__menu",
    t ? "qwanyx-navbar__menu--mobile" : "qwanyx-navbar__menu--desktop",
    t && r && "qwanyx-navbar__menu--open",
    n
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx(
    "div",
    {
      ref: o,
      className: a,
      ...s,
      children: e
    }
  );
});
_i.displayName = "NavbarMenu";
const oy = ({
  logo: e,
  title: t,
  subtitle: r,
  items: n = [],
  actions: s,
  fixed: o = !1,
  sticky: a = !0,
  className: l,
  style: c,
  ...d
}) => {
  const [u, f] = P.useState(!1), [h, m] = P.useState(!1);
  P.useEffect(() => {
    const p = () => {
      m(window.innerWidth <= 768);
    };
    return p(), window.addEventListener("resize", p), () => window.removeEventListener("resize", p);
  }, []);
  const g = [
    "qwanyx-navbar--simple",
    a && !o && "qwanyx-navbar--sticky",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx(Kd, { fixed: o, className: g, style: c, ...d, children: /* @__PURE__ */ i.jsxs(Se, { children: [
    /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-navbar__container", children: [
      /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-navbar__left", children: [
        /* @__PURE__ */ i.jsxs(Xd, { children: [
          e,
          (t || r) && /* @__PURE__ */ i.jsxs("div", { children: [
            t && /* @__PURE__ */ i.jsx("div", { className: "qwanyx-navbar__title", children: t }),
            r && /* @__PURE__ */ i.jsx("div", { className: "qwanyx-navbar__subtitle", children: r })
          ] })
        ] }),
        /* @__PURE__ */ i.jsx(_i, { children: n.map((p, y) => /* @__PURE__ */ i.jsx(
          Si,
          {
            as: "a",
            href: p.href,
            active: p.active,
            onClick: p.onClick,
            children: p.label
          },
          y
        )) })
      ] }),
      s && /* @__PURE__ */ i.jsx("div", { className: "qwanyx-navbar__actions", children: s }),
      /* @__PURE__ */ i.jsx(
        "button",
        {
          className: "qwanyx-navbar__mobile-toggle",
          onClick: () => f(!u),
          children: /* @__PURE__ */ i.jsx("svg", { style: { width: "1.5rem", height: "1.5rem" }, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: u ? /* @__PURE__ */ i.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) : /* @__PURE__ */ i.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" }) })
        }
      )
    ] }),
    /* @__PURE__ */ i.jsxs(_i, { mobile: !0, open: u, children: [
      n.map((p, y) => /* @__PURE__ */ i.jsx(
        Si,
        {
          as: "a",
          href: p.href,
          active: p.active,
          onClick: () => {
            var j;
            (j = p.onClick) == null || j.call(p), f(!1);
          },
          children: p.label
        },
        y
      )),
      s && /* @__PURE__ */ i.jsx("div", { className: "qwanyx-navbar__mobile-actions", children: s })
    ] })
  ] }) });
}, $w = ({
  logo: e,
  title: t,
  subtitle: r,
  onBrandClick: n,
  items: s = [],
  actions: o,
  search: a = !1,
  searchPlaceholder: l = "Search...",
  onSearch: c,
  variant: d = "default",
  position: u = "sticky",
  transparent: f = !1,
  bordered: h = !0,
  elevated: m = !1,
  mobileBreakpoint: g = 768,
  mobileMenuType: p = "drawer",
  height: y = "64px",
  backgroundColor: j,
  className: x = "",
  style: b
}) => {
  const [k, A] = V(!1), [R, C] = V(!1), [S, E] = V(!1), [D, L] = V(""), [M, q] = V(!1), U = ae(null);
  ie(() => {
    const oe = () => {
      A(window.innerWidth <= g), window.innerWidth > g && C(!1);
    };
    return oe(), window.addEventListener("resize", oe), () => window.removeEventListener("resize", oe);
  }, [g]), ie(() => {
    if (f && u !== "static") {
      const oe = () => {
        q(window.scrollY > 10);
      };
      return window.addEventListener("scroll", oe), () => window.removeEventListener("scroll", oe);
    }
  }, [f, u]), ie(() => {
    S && U.current && U.current.focus();
  }, [S]), ie(() => (R && p === "fullscreen" ? document.body.style.overflow = "hidden" : document.body.style.overflow = "", () => {
    document.body.style.overflow = "";
  }), [R, p]);
  const J = {
    position: u,
    top: u === "fixed" || u === "sticky" ? 0 : void 0,
    left: 0,
    right: 0,
    height: y,
    backgroundColor: f && !M ? "transparent" : j || "rgb(var(--background))",
    borderBottom: h ? "1px solid rgb(var(--border))" : "none",
    boxShadow: m || M ? "0 2px 8px rgba(0, 0, 0, 0.08)" : "none",
    transition: "all 0.3s ease",
    zIndex: 1e3,
    ...b
  }, ce = () => {
    switch (d) {
      case "minimal":
        return {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
          padding: "0 20px"
        };
      case "centered":
        return {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "0 20px",
          position: "relative"
        };
      case "full":
        return {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
          padding: "0"
        };
      default:
        return {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
          padding: "0 20px"
        };
    }
  }, K = () => /* @__PURE__ */ i.jsxs(
    "div",
    {
      onClick: n,
      style: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        cursor: n ? "pointer" : "default"
      },
      children: [
        e,
        (t || r) && /* @__PURE__ */ i.jsxs("div", { children: [
          t && /* @__PURE__ */ i.jsx("div", { style: {
            fontSize: "18px",
            fontWeight: 600,
            color: f && !M ? "white" : "rgb(var(--text))"
          }, children: t }),
          r && /* @__PURE__ */ i.jsx("div", { style: {
            fontSize: "12px",
            color: f && !M ? "rgba(255, 255, 255, 0.8)" : "rgb(var(--text-muted))"
          }, children: r })
        ] })
      ]
    }
  ), ue = () => /* @__PURE__ */ i.jsx("nav", { style: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    height: "100%"
  }, children: s.map((oe, Ae) => /* @__PURE__ */ i.jsx(
    ay,
    {
      item: oe,
      transparent: f && !M
    },
    Ae
  )) }), Y = () => a ? S ? /* @__PURE__ */ i.jsxs("div", { style: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "0 12px",
    backgroundColor: "rgba(var(--surface), 0.5)",
    backdropFilter: "blur(10px)",
    borderRadius: "var(--radius)",
    height: "40px"
  }, children: [
    /* @__PURE__ */ i.jsx(
      "input",
      {
        ref: U,
        type: "text",
        value: D,
        onChange: (oe) => L(oe.target.value),
        onKeyDown: (oe) => {
          oe.key === "Enter" && c && c(D), oe.key === "Escape" && (E(!1), L(""));
        },
        placeholder: l,
        style: {
          border: "none",
          background: "transparent",
          outline: "none",
          width: "200px",
          color: "rgb(var(--text))"
        }
      }
    ),
    /* @__PURE__ */ i.jsx(
      "button",
      {
        onClick: () => {
          E(!1), L("");
        },
        style: {
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "rgb(var(--text-muted))",
          padding: "4px"
        },
        children: "✕"
      }
    )
  ] }) : /* @__PURE__ */ i.jsx(
    "button",
    {
      onClick: () => E(!0),
      style: {
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "8px",
        color: f && !M ? "white" : "rgb(var(--text))"
      },
      children: /* @__PURE__ */ i.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
        /* @__PURE__ */ i.jsx("circle", { cx: "11", cy: "11", r: "8" }),
        /* @__PURE__ */ i.jsx("path", { d: "m21 21-4.35-4.35" })
      ] })
    }
  ) : null, he = () => /* @__PURE__ */ i.jsxs(
    "button",
    {
      onClick: () => C(!R),
      style: {
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "8px",
        color: f && !M ? "white" : "rgb(var(--text))",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      },
      children: [
        /* @__PURE__ */ i.jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: R ? /* @__PURE__ */ i.jsx("path", { d: "M6 18L18 6M6 6l12 12" }) : /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
          /* @__PURE__ */ i.jsx("path", { d: "M3 12h18" }),
          /* @__PURE__ */ i.jsx("path", { d: "M3 6h18" }),
          /* @__PURE__ */ i.jsx("path", { d: "M3 18h18" })
        ] }) }),
        /* @__PURE__ */ i.jsx("span", { style: { fontSize: "14px", fontWeight: 500 }, children: R ? "Close" : "Menu" })
      ]
    }
  );
  return /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    /* @__PURE__ */ i.jsx("header", { style: J, className: x, children: /* @__PURE__ */ i.jsx(Se, { size: d === "full" ? "full" : "2xl", children: /* @__PURE__ */ i.jsx("div", { style: ce(), children: d === "centered" ? /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
      /* @__PURE__ */ i.jsx("div", { style: { position: "absolute", left: 20 }, children: K() }),
      !k && ue(),
      /* @__PURE__ */ i.jsxs("div", { style: { position: "absolute", right: 20, display: "flex", alignItems: "center", gap: "12px" }, children: [
        !k && Y(),
        !k && o,
        k && he()
      ] })
    ] }) : /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
      /* @__PURE__ */ i.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "32px" }, children: [
        K(),
        !k && d !== "minimal" && ue()
      ] }),
      /* @__PURE__ */ i.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
        !k && Y(),
        !k && o,
        k && he()
      ] })
    ] }) }) }) }),
    k && /* @__PURE__ */ i.jsx(
      ly,
      {
        isOpen: R,
        type: p,
        items: s,
        actions: o,
        onClose: () => C(!1),
        search: a,
        searchPlaceholder: l,
        onSearch: c
      }
    )
  ] });
}, ay = ({ item: e, transparent: t }) => {
  const [r, n] = V(!1), s = ae(), o = () => {
    s.current && clearTimeout(s.current), n(!0);
  }, a = () => {
    s.current = setTimeout(() => {
      n(!1);
    }, 200);
  }, l = {
    position: "relative",
    height: "100%",
    display: "flex",
    alignItems: "center"
  }, c = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 12px",
    borderRadius: "var(--radius)",
    color: e.active ? "rgb(var(--primary))" : t ? "white" : "rgb(var(--text))",
    backgroundColor: e.active ? "rgba(var(--primary), 0.1)" : "transparent",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: e.active ? 600 : 500,
    transition: "all 0.2s ease",
    cursor: "pointer",
    border: "none",
    outline: "none"
  }, d = () => {
    e.onClick ? e.onClick() : e.href && (window.location.href = e.href);
  };
  return /* @__PURE__ */ i.jsxs(
    "div",
    {
      style: l,
      onMouseEnter: e.children ? o : void 0,
      onMouseLeave: e.children ? a : void 0,
      children: [
        /* @__PURE__ */ i.jsxs(
          "button",
          {
            onClick: d,
            style: c,
            onMouseEnter: (u) => {
              e.active || (u.currentTarget.style.backgroundColor = "rgba(var(--accent), 0.08)");
            },
            onMouseLeave: (u) => {
              e.active || (u.currentTarget.style.backgroundColor = "transparent");
            },
            children: [
              e.icon,
              e.label,
              e.badge && /* @__PURE__ */ i.jsx("span", { style: {
                padding: "2px 6px",
                borderRadius: "12px",
                backgroundColor: "rgb(var(--primary))",
                color: "white",
                fontSize: "10px",
                fontWeight: 600
              }, children: e.badge }),
              e.children && /* @__PURE__ */ i.jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ i.jsx("polyline", { points: "6 9 12 15 18 9" }) })
            ]
          }
        ),
        e.children && r && /* @__PURE__ */ i.jsx("div", { style: {
          position: "absolute",
          top: "100%",
          left: 0,
          minWidth: "200px",
          backgroundColor: "rgb(var(--background))",
          border: "1px solid rgb(var(--border))",
          borderRadius: "var(--radius)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          padding: "8px",
          marginTop: "4px",
          zIndex: 1001
        }, children: e.children.map((u, f) => /* @__PURE__ */ i.jsxs(
          "button",
          {
            onClick: () => {
              u.onClick ? u.onClick() : u.href && (window.location.href = u.href), n(!1);
            },
            style: {
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
              padding: "8px 12px",
              border: "none",
              background: "none",
              borderRadius: "var(--radius-sm)",
              color: "rgb(var(--text))",
              fontSize: "14px",
              textAlign: "left",
              cursor: "pointer",
              transition: "background 0.2s ease"
            },
            onMouseEnter: (h) => {
              h.currentTarget.style.backgroundColor = "rgba(var(--accent), 0.08)";
            },
            onMouseLeave: (h) => {
              h.currentTarget.style.backgroundColor = "transparent";
            },
            children: [
              u.icon,
              u.label,
              u.badge && /* @__PURE__ */ i.jsx("span", { style: {
                marginLeft: "auto",
                padding: "2px 6px",
                borderRadius: "12px",
                backgroundColor: "rgb(var(--primary))",
                color: "white",
                fontSize: "10px",
                fontWeight: 600
              }, children: u.badge })
            ]
          },
          f
        )) })
      ]
    }
  );
}, ly = ({ isOpen: e, type: t, items: r, actions: n, onClose: s, search: o, searchPlaceholder: a, onSearch: l }) => {
  const [c, d] = V(""), [u, f] = V([]);
  if (!e) return null;
  const h = (g) => {
    f(
      (p) => p.includes(g) ? p.filter((y) => y !== g) : [...p, g]
    );
  }, m = {
    position: "fixed",
    top: t === "dropdown" ? "64px" : 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgb(var(--background))",
    zIndex: 999,
    overflowY: "auto",
    transform: t === "drawer" ? e ? "translateX(0)" : "translateX(-100%)" : void 0,
    transition: "transform 0.3s ease",
    width: t === "drawer" ? "280px" : "100%",
    boxShadow: t === "drawer" ? "2px 0 8px rgba(0, 0, 0, 0.1)" : void 0
  };
  return /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    t === "drawer" && /* @__PURE__ */ i.jsx(
      "div",
      {
        onClick: s,
        style: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 998,
          opacity: e ? 1 : 0,
          pointerEvents: e ? "auto" : "none",
          transition: "opacity 0.3s ease"
        }
      }
    ),
    /* @__PURE__ */ i.jsx("div", { style: m, children: /* @__PURE__ */ i.jsxs("div", { style: { padding: "20px" }, children: [
      o && /* @__PURE__ */ i.jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px",
        backgroundColor: "rgb(var(--surface))",
        borderRadius: "var(--radius)",
        marginBottom: "20px"
      }, children: [
        /* @__PURE__ */ i.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
          /* @__PURE__ */ i.jsx("circle", { cx: "11", cy: "11", r: "8" }),
          /* @__PURE__ */ i.jsx("path", { d: "m21 21-4.35-4.35" })
        ] }),
        /* @__PURE__ */ i.jsx(
          "input",
          {
            type: "text",
            value: c,
            onChange: (g) => d(g.target.value),
            onKeyDown: (g) => {
              g.key === "Enter" && l && (l(c), s());
            },
            placeholder: a,
            style: {
              border: "none",
              background: "transparent",
              outline: "none",
              flex: 1,
              color: "rgb(var(--text))"
            }
          }
        )
      ] }),
      /* @__PURE__ */ i.jsx("nav", { style: { marginBottom: "20px" }, children: r.map((g, p) => /* @__PURE__ */ i.jsxs("div", { style: { marginBottom: "4px" }, children: [
        /* @__PURE__ */ i.jsxs(
          "button",
          {
            onClick: () => {
              g.children ? h(p) : (g.onClick ? g.onClick() : g.href && (window.location.href = g.href), s());
            },
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "12px 16px",
              border: "none",
              background: g.active ? "rgba(var(--primary), 0.1)" : "none",
              borderRadius: "var(--radius)",
              color: g.active ? "rgb(var(--primary))" : "rgb(var(--text))",
              fontSize: "15px",
              fontWeight: g.active ? 600 : 500,
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.2s ease"
            },
            children: [
              /* @__PURE__ */ i.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
                g.icon,
                g.label,
                g.badge && /* @__PURE__ */ i.jsx("span", { style: {
                  padding: "2px 6px",
                  borderRadius: "12px",
                  backgroundColor: "rgb(var(--primary))",
                  color: "white",
                  fontSize: "10px",
                  fontWeight: 600
                }, children: g.badge })
              ] }),
              g.children && /* @__PURE__ */ i.jsx(
                "svg",
                {
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  style: {
                    transform: u.includes(p) ? "rotate(180deg)" : "rotate(0)",
                    transition: "transform 0.2s ease"
                  },
                  children: /* @__PURE__ */ i.jsx("polyline", { points: "6 9 12 15 18 9" })
                }
              )
            ]
          }
        ),
        g.children && u.includes(p) && /* @__PURE__ */ i.jsx("div", { style: { paddingLeft: "20px", marginTop: "4px" }, children: g.children.map((y, j) => /* @__PURE__ */ i.jsxs(
          "button",
          {
            onClick: () => {
              y.onClick ? y.onClick() : y.href && (window.location.href = y.href), s();
            },
            style: {
              display: "flex",
              alignItems: "center",
              gap: "12px",
              width: "100%",
              padding: "10px 16px",
              border: "none",
              background: "none",
              borderRadius: "var(--radius)",
              color: "rgb(var(--text-muted))",
              fontSize: "14px",
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.2s ease"
            },
            children: [
              y.icon,
              y.label,
              y.badge && /* @__PURE__ */ i.jsx("span", { style: {
                marginLeft: "auto",
                padding: "2px 6px",
                borderRadius: "12px",
                backgroundColor: "rgb(var(--accent))",
                color: "white",
                fontSize: "10px",
                fontWeight: 600
              }, children: y.badge })
            ]
          },
          j
        )) })
      ] }, p)) }),
      n && /* @__PURE__ */ i.jsx("div", { style: {
        paddingTop: "20px",
        borderTop: "1px solid rgb(var(--border))"
      }, children: n })
    ] }) })
  ] });
}, bt = P.forwardRef(({
  children: e,
  variant: t = "solid",
  color: r = "primary",
  size: n = "md",
  rounded: s = "md",
  className: o = "",
  ...a
}, l) => {
  const c = [
    "qwanyx-badge",
    `qwanyx-badge--${n}`,
    `qwanyx-badge--rounded-${s}`,
    `qwanyx-badge--${t}`,
    `qwanyx-badge--${r}`,
    o
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("span", { ref: l, className: c, ...a, children: e });
});
bt.displayName = "Badge";
const cy = P.forwardRef(({
  children: e,
  icon: t,
  iconPosition: r = "left",
  ...n
}, s) => /* @__PURE__ */ i.jsxs(bt, { ref: s, ...n, children: [
  t && r === "left" && /* @__PURE__ */ i.jsx("span", { className: `qwanyx-badge__icon--${r}`, children: t }),
  e,
  t && r === "right" && /* @__PURE__ */ i.jsx("span", { className: `qwanyx-badge__icon--${r}`, children: t })
] }));
cy.displayName = "IconBadge";
const dy = P.forwardRef(({
  children: e,
  onClose: t,
  ...r
}, n) => /* @__PURE__ */ i.jsxs(bt, { ref: n, ...r, children: [
  e,
  t && /* @__PURE__ */ i.jsx(
    "button",
    {
      onClick: t,
      className: "qwanyx-badge__close",
      "aria-label": "Remove",
      children: /* @__PURE__ */ i.jsx("svg", { fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ i.jsx(
        "path",
        {
          fillRule: "evenodd",
          d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
          clipRule: "evenodd"
        }
      ) })
    }
  )
] }));
dy.displayName = "ClosableBadge";
const uy = P.forwardRef(({
  children: e,
  dot: t = !0,
  dotPosition: r = "left",
  dotColor: n = "primary",
  ...s
}, o) => /* @__PURE__ */ i.jsxs(bt, { ref: o, ...s, children: [
  t && r === "left" && /* @__PURE__ */ i.jsx("span", { className: `qwanyx-badge__dot qwanyx-badge__dot--${r} qwanyx-badge__dot--${n}` }),
  e,
  t && r === "right" && /* @__PURE__ */ i.jsx("span", { className: `qwanyx-badge__dot qwanyx-badge__dot--${r} qwanyx-badge__dot--${n}` })
] }));
uy.displayName = "DotBadge";
const vr = P.forwardRef(({
  src: e,
  alt: t = "",
  name: r,
  size: n = "md",
  shape: s = "circle",
  fallback: o,
  status: a,
  statusPosition: l = "bottom-right",
  className: c = "",
  style: d,
  children: u,
  ...f
}, h) => {
  const [m, g] = P.useState(!1), p = {
    xs: "24px",
    sm: "32px",
    md: "40px",
    lg: "48px",
    xl: "56px",
    "2xl": "64px"
  }, y = {
    xs: "6px",
    sm: "8px",
    md: "10px",
    lg: "12px",
    xl: "14px",
    "2xl": "16px"
  }, j = {
    xs: "10px",
    sm: "12px",
    md: "14px",
    lg: "16px",
    xl: "18px",
    "2xl": "20px"
  }, x = (M) => {
    const q = M.trim().split(" ");
    return q.length >= 2 ? `${q[0][0]}${q[q.length - 1][0]}`.toUpperCase() : M.slice(0, 2).toUpperCase();
  }, b = (M) => {
    const q = [
      "rgb(var(--qwanyx-primary))",
      "rgb(var(--qwanyx-secondary))",
      "rgb(var(--qwanyx-accent))",
      "rgb(var(--qwanyx-success))",
      "rgb(var(--qwanyx-warning))",
      "rgb(var(--qwanyx-error))",
      "rgb(var(--qwanyx-info))"
    ];
    let U = 0;
    for (let J = 0; J < M.length; J++)
      U = M.charCodeAt(J) + ((U << 5) - U);
    return q[Math.abs(U) % q.length];
  }, k = {
    online: "rgb(var(--qwanyx-success))",
    offline: "rgb(var(--qwanyx-muted))",
    away: "rgb(var(--qwanyx-warning))",
    busy: "rgb(var(--qwanyx-error))"
  }, A = () => ({
    "top-right": { top: "0", right: "0" },
    "top-left": { top: "0", left: "0" },
    "bottom-right": { bottom: "0", right: "0" },
    "bottom-left": { bottom: "0", left: "0" }
  })[l], R = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: p[n],
    height: p[n],
    borderRadius: s === "circle" ? "50%" : "var(--radius)",
    backgroundColor: !e || m ? r ? b(r) : "rgb(var(--qwanyx-muted))" : "transparent",
    overflow: "hidden",
    flexShrink: 0,
    userSelect: "none",
    ...d
  }, C = {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  }, S = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    fontSize: j[n],
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.95)"
  }, E = {
    position: "absolute",
    width: y[n],
    height: y[n],
    backgroundColor: k[a],
    borderRadius: "50%",
    border: "2px solid rgb(var(--background))",
    ...A()
  }, D = () => e && !m ? /* @__PURE__ */ i.jsx(
    "img",
    {
      src: e,
      alt: t || r,
      style: C,
      onError: () => g(!0)
    }
  ) : o ? typeof o == "string" ? /* @__PURE__ */ i.jsx("span", { style: S, children: o }) : o : r ? /* @__PURE__ */ i.jsx("span", { style: S, children: x(r) }) : /* @__PURE__ */ i.jsx("span", { style: S, children: /* @__PURE__ */ i.jsx("svg", { width: "60%", height: "60%", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ i.jsx("path", { d: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" }) }) }), L = [
    "qwanyx-avatar",
    `qwanyx-avatar--${n}`,
    `qwanyx-avatar--${s}`,
    c
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsxs("div", { ref: h, className: L, style: R, ...f, children: [
    D(),
    u,
    a && /* @__PURE__ */ i.jsx("span", { style: E })
  ] });
});
vr.displayName = "Avatar";
const fy = P.forwardRef(({
  children: e,
  max: t = 5,
  size: r = "md",
  spacing: n = "normal",
  className: s = "",
  style: o,
  ...a
}, l) => {
  const c = {
    tight: "-8px",
    normal: "-12px",
    loose: "-16px"
  }, d = {
    display: "inline-flex",
    alignItems: "center",
    ...o
  }, u = P.Children.toArray(e), f = u.slice(0, t), h = u.length - t, m = [
    "qwanyx-avatar-group",
    `qwanyx-avatar-group--${n}`,
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsxs("div", { ref: l, className: m, style: d, ...a, children: [
    f.map((g, p) => P.isValidElement(g) ? P.cloneElement(g, {
      size: r,
      style: {
        ...g.props.style,
        marginLeft: p === 0 ? 0 : c[n],
        zIndex: f.length - p,
        border: "2px solid rgb(var(--background))"
      }
    }) : g),
    h > 0 && /* @__PURE__ */ i.jsx(
      vr,
      {
        size: r,
        fallback: `+${h}`,
        style: {
          marginLeft: c[n],
          backgroundColor: "rgb(var(--muted))",
          zIndex: 0
        }
      }
    )
  ] });
});
fy.displayName = "AvatarGroup";
const hy = P.forwardRef(({
  name: e,
  color: t = "auto",
  className: r = "",
  style: n,
  ...s
}, o) => {
  const a = () => {
    if (t === "auto") {
      const c = [
        "rgb(var(--primary))",
        "rgb(var(--secondary))",
        "rgb(var(--accent))",
        "rgb(var(--success))",
        "rgb(var(--warning))",
        "rgb(var(--error))",
        "rgb(var(--info))"
      ];
      let d = 0;
      for (let u = 0; u < e.length; u++)
        d = e.charCodeAt(u) + ((d << 5) - d);
      return c[Math.abs(d) % c.length];
    }
    return {
      primary: "rgb(var(--primary))",
      secondary: "rgb(var(--secondary))",
      accent: "rgb(var(--accent))",
      success: "rgb(var(--success))",
      warning: "rgb(var(--warning))",
      error: "rgb(var(--error))",
      info: "rgb(var(--info))"
    }[t] || "rgb(var(--muted))";
  };
  return /* @__PURE__ */ i.jsx(
    vr,
    {
      ref: o,
      name: e,
      className: r,
      style: {
        backgroundColor: a(),
        ...n
      },
      ...s
    }
  );
});
hy.displayName = "InitialsAvatar";
const To = ({
  // Brand
  logo: e,
  title: t,
  subtitle: r,
  onLogoClick: n,
  // Navigation
  items: s = [],
  // Search
  search: o = !1,
  searchPlaceholder: a = "Search...",
  onSearch: l,
  searchExpanded: c = !1,
  // User
  user: d,
  userMenuItems: u = [],
  onLogout: f,
  // Notifications
  notifications: h = [],
  notificationCount: m = 0,
  onNotificationClick: g,
  onNotificationsClear: p,
  // Actions
  actions: y,
  primaryAction: j,
  secondaryAction: x,
  // Behavior
  variant: b = "default",
  position: k = "sticky",
  transparent: A = !1,
  blur: R = !1,
  bordered: C = !1,
  elevated: S = !1,
  hideOnScroll: E = !1,
  // Mobile
  mobileBreakpoint: D = 768,
  mobileMenuType: L = "drawer",
  // Theming
  // dark = false,
  // color = undefined,
  height: M = "64px",
  className: q = "",
  style: U = {}
}) => {
  const [J, ce] = V(!1), [K, ue] = V(c), [Y, he] = V(""), [oe, Ae] = V(null), [nt, Ne] = V(!1), [Me, de] = V(!1), [ne, Ie] = V(!1), [Ze, lt] = V(!1), [je, kt] = V(!1), [ct, St] = V(0), Ce = ae(null), He = ae(null), Ve = ae(0);
  ie(() => {
    const T = () => {
      kt(window.innerWidth < D);
    };
    return T(), window.addEventListener("resize", T), () => window.removeEventListener("resize", T);
  }, [D]), ie(() => {
    if (k !== "fixed" && k !== "sticky") return;
    const T = () => {
      const F = window.scrollY;
      Ie(F > 10), E && (F > Ve.current && F > 100 ? lt(!0) : lt(!1), Ve.current = F);
    };
    return window.addEventListener("scroll", T, { passive: !0 }), () => window.removeEventListener("scroll", T);
  }, [k, E]);
  const vt = (T) => {
    T.preventDefault(), l && l(Y);
  }, st = (T) => {
    Ae(oe === T ? null : T);
  };
  ie(() => {
    const T = (F) => {
      Ce.current && !Ce.current.contains(F.target) && (Ae(null), Ne(!1), de(!1));
    };
    return document.addEventListener("mousedown", T), () => document.removeEventListener("mousedown", T);
  }, []);
  const v = (T, F) => !T || T.length === 0 ? null : /* @__PURE__ */ i.jsx(
    "div",
    {
      className: "super-navbar__dropdown",
      style: {
        position: "absolute",
        top: "100%",
        left: 0,
        backgroundColor: "rgb(var(--background))",
        border: "1px solid rgb(var(--border))",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow-lg)",
        minWidth: "200px",
        padding: "0.5rem 0",
        zIndex: 1e3,
        opacity: oe === F ? 1 : 0,
        visibility: oe === F ? "visible" : "hidden",
        transform: oe === F ? "translateY(0)" : "translateY(-10px)",
        transition: "all 0.2s ease"
      },
      children: T.map((B, le) => /* @__PURE__ */ i.jsx(P.Fragment, { children: B.divider ? /* @__PURE__ */ i.jsx("div", { style: {
        height: "1px",
        backgroundColor: "rgb(var(--border))",
        margin: "0.5rem 0"
      } }) : /* @__PURE__ */ i.jsxs(
        "button",
        {
          onClick: () => {
            B.onClick && B.onClick(), B.href && (window.location.href = B.href), Ae(null);
          },
          style: {
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            width: "100%",
            padding: "0.5rem 1rem",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            transition: "background-color 0.2s",
            color: "rgb(var(--text))"
          },
          onMouseEnter: (pe) => {
            pe.currentTarget.style.backgroundColor = "rgb(var(--accent) / 0.1)";
          },
          onMouseLeave: (pe) => {
            pe.currentTarget.style.backgroundColor = "transparent";
          },
          children: [
            B.icon && /* @__PURE__ */ i.jsx(Q, { name: B.icon, size: "sm" }),
            /* @__PURE__ */ i.jsxs("div", { style: { flex: 1 }, children: [
              /* @__PURE__ */ i.jsx(W, { size: "sm", weight: "medium", children: B.label }),
              B.description && /* @__PURE__ */ i.jsx(W, { size: "xs", color: "muted", children: B.description })
            ] }),
            B.badge && /* @__PURE__ */ i.jsx(bt, { variant: "subtle", size: "sm", children: B.badge })
          ]
        }
      ) }, le))
    }
  ), _ = () => Me ? /* @__PURE__ */ i.jsxs(
    "div",
    {
      className: "super-navbar__notifications",
      style: {
        position: "absolute",
        top: "100%",
        right: 0,
        backgroundColor: "rgb(var(--background))",
        border: "1px solid rgb(var(--border))",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow-lg)",
        width: "360px",
        maxHeight: "400px",
        zIndex: 1e3,
        opacity: Me ? 1 : 0,
        visibility: Me ? "visible" : "hidden",
        transform: Me ? "translateY(0)" : "translateY(-10px)",
        transition: "all 0.2s ease"
      },
      children: [
        /* @__PURE__ */ i.jsxs("div", { style: {
          padding: "1rem",
          borderBottom: "1px solid rgb(var(--border))",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }, children: [
          /* @__PURE__ */ i.jsx(W, { weight: "semibold", children: "Notifications" }),
          h.length > 0 && /* @__PURE__ */ i.jsx(
            X,
            {
              size: "xs",
              variant: "ghost",
              onClick: p,
              children: "Clear all"
            }
          )
        ] }),
        /* @__PURE__ */ i.jsx("div", { style: {
          maxHeight: "320px",
          overflowY: "auto"
        }, children: h.length === 0 ? /* @__PURE__ */ i.jsxs("div", { style: { padding: "2rem", textAlign: "center" }, children: [
          /* @__PURE__ */ i.jsx(Q, { name: "notifications_none", size: "xl", color: "muted" }),
          /* @__PURE__ */ i.jsx(W, { size: "sm", color: "muted", style: { marginTop: "0.5rem" }, children: "No new notifications" })
        ] }) : h.map((T) => /* @__PURE__ */ i.jsxs(
          "button",
          {
            onClick: () => {
              g && g(T.id), de(!1);
            },
            style: {
              display: "flex",
              gap: "0.75rem",
              width: "100%",
              padding: "0.75rem 1rem",
              backgroundColor: T.read ? "transparent" : "rgb(var(--primary) / 0.05)",
              border: "none",
              borderBottom: "1px solid rgb(var(--border))",
              cursor: "pointer",
              textAlign: "left",
              transition: "background-color 0.2s"
            },
            onMouseEnter: (F) => {
              F.currentTarget.style.backgroundColor = "rgb(var(--accent) / 0.1)";
            },
            onMouseLeave: (F) => {
              F.currentTarget.style.backgroundColor = T.read ? "transparent" : "rgb(var(--primary) / 0.05)";
            },
            children: [
              T.icon && /* @__PURE__ */ i.jsx(
                Q,
                {
                  name: T.icon,
                  size: "sm",
                  color: T.type || "primary"
                }
              ),
              /* @__PURE__ */ i.jsxs("div", { style: { flex: 1 }, children: [
                /* @__PURE__ */ i.jsx(W, { size: "sm", weight: "medium", children: T.title }),
                T.description && /* @__PURE__ */ i.jsx(W, { size: "xs", color: "muted", children: T.description }),
                T.time && /* @__PURE__ */ i.jsx(W, { size: "xs", color: "muted", style: { marginTop: "0.25rem" }, children: T.time })
              ] })
            ]
          },
          T.id
        )) })
      ]
    }
  ) : null, N = () => {
    if (typeof window > "u")
      return A && !ne ? "rgba(255, 255, 255, 0.85)" : R ? "rgba(255, 255, 255, 0.98)" : "rgb(var(--background))";
    const T = getComputedStyle(document.documentElement).getPropertyValue("--background").trim();
    return A && !ne ? `rgba(${T}, 0.85)` : R ? `rgba(${T}, 0.98)` : "rgb(var(--background))";
  }, O = {
    position: k,
    top: Ze ? `-${M}` : 0,
    left: 0,
    right: 0,
    height: M,
    backgroundColor: N(),
    backdropFilter: R ? "blur(10px)" : "none",
    borderBottom: C ? "1px solid rgb(var(--border))" : "none",
    boxShadow: S || ne ? "var(--shadow)" : "none",
    transition: "all 0.3s ease",
    zIndex: 999,
    ...U
  };
  return /* @__PURE__ */ i.jsxs(
    "nav",
    {
      ref: Ce,
      className: `super-navbar super-navbar--${b} ${q}`,
      style: O,
      children: [
        /* @__PURE__ */ i.jsx("div", { style: {
          height: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 2rem"
        }, children: /* @__PURE__ */ i.jsxs("div", { style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
          gap: "2rem"
        }, children: [
          /* @__PURE__ */ i.jsxs(
            "div",
            {
              className: "super-navbar__brand",
              style: {
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                cursor: n ? "pointer" : "default"
              },
              onClick: n,
              children: [
                e && (typeof e == "string" ? /* @__PURE__ */ i.jsx(
                  "img",
                  {
                    src: e,
                    alt: t || "Logo",
                    style: { height: "40px" }
                  }
                ) : e),
                (t || r) && /* @__PURE__ */ i.jsxs("div", { style: {
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px"
                }, children: [
                  t && /* @__PURE__ */ i.jsx("span", { style: {
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "rgb(var(--text))",
                    lineHeight: "1.2"
                  }, children: t }),
                  r && /* @__PURE__ */ i.jsx("span", { style: {
                    fontSize: "11px",
                    color: "rgb(var(--muted))",
                    lineHeight: "1.2"
                  }, children: r })
                ] })
              ]
            }
          ),
          !je && /* @__PURE__ */ i.jsx(
            "div",
            {
              className: "super-navbar__nav",
              style: {
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flex: 1,
                justifyContent: "center",
                minHeight: "40px"
              },
              children: s && s.length > 0 ? s.map((T, F) => /* @__PURE__ */ i.jsxs(
                "div",
                {
                  style: { position: "relative" },
                  children: [
                    /* @__PURE__ */ i.jsxs(
                      "button",
                      {
                        className: "super-navbar__item",
                        onClick: () => {
                          T.children ? st(`nav-${F}`) : (St(F), T.onClick ? T.onClick() : T.href && (window.location.href = T.href));
                        },
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.5rem 1rem",
                          backgroundColor: ct === F ? "rgb(var(--primary) / 0.1)" : "transparent",
                          border: "none",
                          borderRadius: "var(--radius)",
                          cursor: "pointer",
                          color: ct === F ? "rgb(var(--primary))" : "rgb(var(--text))",
                          fontWeight: 500,
                          fontSize: "0.875rem",
                          transition: "all 0.2s"
                        },
                        onMouseEnter: (B) => {
                          B.currentTarget.style.backgroundColor = ct === F ? "rgb(var(--primary) / 0.15)" : "rgb(var(--accent) / 0.1)";
                        },
                        onMouseLeave: (B) => {
                          B.currentTarget.style.backgroundColor = ct === F ? "rgb(var(--primary) / 0.1)" : "transparent";
                        },
                        children: [
                          T.icon && /* @__PURE__ */ i.jsx(Q, { name: T.icon, size: "sm" }),
                          T.label && /* @__PURE__ */ i.jsx("span", { style: { whiteSpace: "nowrap" }, children: T.label }),
                          T.badge && /* @__PURE__ */ i.jsx(bt, { size: "xs", variant: "solid", color: "primary", children: T.badge }),
                          T.children && /* @__PURE__ */ i.jsx(Q, { name: "expand_more", size: "sm" })
                        ]
                      }
                    ),
                    T.children && v(T.children, `nav-${F}`)
                  ]
                },
                F
              )) : /* @__PURE__ */ i.jsx("span", { style: { color: "rgb(var(--muted))" }, children: "No navigation items" })
            }
          ),
          /* @__PURE__ */ i.jsxs(
            "div",
            {
              className: "super-navbar__actions",
              style: {
                display: "flex",
                alignItems: "center",
                gap: "1.5rem"
              },
              children: [
                o && /* @__PURE__ */ i.jsx("div", { style: { position: "relative" }, children: K ? /* @__PURE__ */ i.jsxs("form", { onSubmit: vt, style: { display: "flex", gap: "0.5rem" }, children: [
                  /* @__PURE__ */ i.jsx(
                    qt,
                    {
                      ref: He,
                      type: "search",
                      placeholder: a,
                      value: Y,
                      onChange: (T) => he(T.target.value),
                      style: { width: je ? "150px" : "250px", height: "32px", fontSize: "14px" }
                    }
                  ),
                  /* @__PURE__ */ i.jsx(
                    X,
                    {
                      type: "button",
                      size: "sm",
                      variant: "ghost",
                      onClick: () => {
                        ue(!1), he("");
                      },
                      children: /* @__PURE__ */ i.jsx(Q, { name: "close", size: "sm" })
                    }
                  )
                ] }) : /* @__PURE__ */ i.jsx(
                  X,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => {
                      ue(!0), setTimeout(() => {
                        var T;
                        return (T = He.current) == null ? void 0 : T.focus();
                      }, 100);
                    },
                    children: /* @__PURE__ */ i.jsx(Q, { name: "search", size: "sm" })
                  }
                ) }),
                h && /* @__PURE__ */ i.jsxs("div", { style: { position: "relative" }, children: [
                  /* @__PURE__ */ i.jsxs(
                    X,
                    {
                      variant: "ghost",
                      size: "sm",
                      onClick: () => de(!Me),
                      style: { position: "relative" },
                      children: [
                        /* @__PURE__ */ i.jsx(Q, { name: "notifications", size: "sm" }),
                        m > 0 && /* @__PURE__ */ i.jsx(
                          bt,
                          {
                            size: "xs",
                            variant: "solid",
                            color: "error",
                            style: {
                              position: "absolute",
                              top: "-4px",
                              right: "-4px"
                            },
                            children: m > 99 ? "99+" : m
                          }
                        )
                      ]
                    }
                  ),
                  _()
                ] }),
                y,
                x && !je && /* @__PURE__ */ i.jsxs(
                  X,
                  {
                    variant: x.variant || "outline",
                    size: "sm",
                    onClick: () => {
                      console.log("SuperNavbar: Secondary action clicked"), x.onClick && x.onClick();
                    },
                    children: [
                      x.icon && /* @__PURE__ */ i.jsx(Q, { name: x.icon, size: "sm" }),
                      x.label
                    ]
                  }
                ),
                j && !je && /* @__PURE__ */ i.jsxs(
                  X,
                  {
                    variant: "primary",
                    size: "sm",
                    onClick: () => {
                      console.log("SuperNavbar: Primary action clicked"), j.onClick && j.onClick();
                    },
                    children: [
                      j.icon && /* @__PURE__ */ i.jsx(Q, { name: j.icon, size: "sm" }),
                      j.label
                    ]
                  }
                ),
                d && /* @__PURE__ */ i.jsxs("div", { style: { position: "relative" }, children: [
                  /* @__PURE__ */ i.jsxs(
                    "button",
                    {
                      onClick: () => Ne(!nt),
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.5rem 0.75rem",
                        minWidth: "180px",
                        backgroundColor: "transparent",
                        border: "none",
                        borderRadius: "var(--radius)",
                        cursor: "pointer",
                        transition: "background-color 0.2s"
                      },
                      onMouseEnter: (T) => {
                        T.currentTarget.style.backgroundColor = "rgb(var(--accent) / 0.1)";
                      },
                      onMouseLeave: (T) => {
                        T.currentTarget.style.backgroundColor = "transparent";
                      },
                      children: [
                        /* @__PURE__ */ i.jsx(
                          vr,
                          {
                            src: d.avatar,
                            name: d.name,
                            size: "sm"
                          }
                        ),
                        !je && /* @__PURE__ */ i.jsxs("div", { style: {
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          textAlign: "left",
                          minWidth: "0",
                          flex: "1 1 auto"
                        }, children: [
                          /* @__PURE__ */ i.jsx("span", { style: {
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "rgb(var(--text))",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "block",
                            width: "100%"
                          }, children: d.name }),
                          d.role && /* @__PURE__ */ i.jsx("span", { style: {
                            fontSize: "12px",
                            color: "rgb(var(--muted))",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "block",
                            width: "100%"
                          }, children: d.role })
                        ] }),
                        /* @__PURE__ */ i.jsx(Q, { name: "expand_more", size: "sm" })
                      ]
                    }
                  ),
                  nt && /* @__PURE__ */ i.jsxs(
                    "div",
                    {
                      style: {
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        backgroundColor: "rgb(var(--background))",
                        border: "1px solid rgb(var(--border))",
                        borderRadius: "var(--radius)",
                        boxShadow: "var(--shadow-lg)",
                        minWidth: "200px",
                        padding: "0.5rem 0",
                        zIndex: 1e3,
                        marginTop: "0.5rem"
                      },
                      children: [
                        d.email && /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
                          /* @__PURE__ */ i.jsxs("div", { style: { padding: "0.5rem 1rem" }, children: [
                            /* @__PURE__ */ i.jsx(W, { size: "sm", weight: "medium", children: d.name }),
                            /* @__PURE__ */ i.jsx(W, { size: "xs", color: "muted", children: d.email })
                          ] }),
                          /* @__PURE__ */ i.jsx("div", { style: {
                            height: "1px",
                            backgroundColor: "rgb(var(--border))",
                            margin: "0.5rem 0"
                          } })
                        ] }),
                        u.map((T, F) => /* @__PURE__ */ i.jsxs(
                          "button",
                          {
                            onClick: () => {
                              T.onClick && T.onClick(), T.href && (window.location.href = T.href), Ne(!1);
                            },
                            style: {
                              display: "flex",
                              alignItems: "center",
                              gap: "0.75rem",
                              width: "100%",
                              padding: "0.5rem 1rem",
                              backgroundColor: "transparent",
                              border: "none",
                              cursor: "pointer",
                              textAlign: "left",
                              transition: "background-color 0.2s",
                              color: "rgb(var(--text))"
                            },
                            onMouseEnter: (B) => {
                              B.currentTarget.style.backgroundColor = "rgb(var(--accent) / 0.1)";
                            },
                            onMouseLeave: (B) => {
                              B.currentTarget.style.backgroundColor = "transparent";
                            },
                            children: [
                              T.icon && /* @__PURE__ */ i.jsx(Q, { name: T.icon, size: "sm" }),
                              /* @__PURE__ */ i.jsx(W, { size: "sm", children: T.label })
                            ]
                          },
                          F
                        )),
                        f && /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
                          /* @__PURE__ */ i.jsx("div", { style: {
                            height: "1px",
                            backgroundColor: "rgb(var(--border))",
                            margin: "0.5rem 0"
                          } }),
                          /* @__PURE__ */ i.jsxs(
                            "button",
                            {
                              onClick: () => {
                                f(), Ne(!1);
                              },
                              style: {
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                width: "100%",
                                padding: "0.5rem 1rem",
                                backgroundColor: "transparent",
                                border: "none",
                                cursor: "pointer",
                                textAlign: "left",
                                transition: "background-color 0.2s",
                                color: "rgb(var(--error))"
                              },
                              onMouseEnter: (T) => {
                                T.currentTarget.style.backgroundColor = "rgb(var(--error) / 0.1)";
                              },
                              onMouseLeave: (T) => {
                                T.currentTarget.style.backgroundColor = "transparent";
                              },
                              children: [
                                /* @__PURE__ */ i.jsx(Q, { name: "logout", size: "sm", color: "error" }),
                                /* @__PURE__ */ i.jsx(W, { size: "sm", color: "error", children: "Logout" })
                              ]
                            }
                          )
                        ] })
                      ]
                    }
                  )
                ] }),
                je && /* @__PURE__ */ i.jsx(
                  X,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => ce(!J),
                    children: /* @__PURE__ */ i.jsx(Q, { name: J ? "close" : "menu", size: "sm" })
                  }
                )
              ]
            }
          )
        ] }) }),
        je && J && /* @__PURE__ */ i.jsxs(
          "div",
          {
            className: "super-navbar__mobile-menu",
            style: {
              position: L === "fullscreen" ? "fixed" : "absolute",
              top: L === "fullscreen" ? 0 : "100%",
              left: 0,
              right: 0,
              bottom: L === "fullscreen" ? 0 : "auto",
              backgroundColor: "rgb(var(--background))",
              borderTop: "1px solid rgb(var(--border))",
              boxShadow: "var(--shadow-lg)",
              zIndex: 998,
              maxHeight: L === "dropdown" ? "70vh" : "auto",
              overflowY: "auto",
              padding: "1rem"
            },
            children: [
              L === "fullscreen" && /* @__PURE__ */ i.jsxs("div", { style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem",
                paddingBottom: "1rem",
                borderBottom: "1px solid rgb(var(--border))"
              }, children: [
                /* @__PURE__ */ i.jsx(W, { size: "lg", weight: "bold", children: t }),
                /* @__PURE__ */ i.jsx(
                  X,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => ce(!1),
                    children: /* @__PURE__ */ i.jsx(Q, { name: "close", size: "sm" })
                  }
                )
              ] }),
              /* @__PURE__ */ i.jsx("div", { style: { marginBottom: "1rem" }, children: s.map((T, F) => /* @__PURE__ */ i.jsxs(
                "button",
                {
                  onClick: () => {
                    St(F), T.onClick && T.onClick(), T.href && (window.location.href = T.href), ce(!1);
                  },
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    width: "100%",
                    padding: "0.75rem",
                    backgroundColor: ct === F ? "rgb(var(--primary) / 0.1)" : "transparent",
                    border: "none",
                    borderRadius: "var(--radius)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background-color 0.2s",
                    color: ct === F ? "rgb(var(--primary))" : "rgb(var(--text))"
                  },
                  onTouchStart: (B) => {
                    B.currentTarget.style.backgroundColor = "rgb(var(--accent) / 0.1)";
                  },
                  onTouchEnd: (B) => {
                    setTimeout(() => {
                      B.currentTarget.style.backgroundColor = "transparent";
                    }, 100);
                  },
                  children: [
                    T.icon && /* @__PURE__ */ i.jsx(Q, { name: T.icon, size: "sm" }),
                    /* @__PURE__ */ i.jsx(W, { size: "sm", weight: "medium", children: T.label }),
                    T.badge && /* @__PURE__ */ i.jsx(bt, { size: "xs", variant: "solid", color: "primary", style: { marginLeft: "auto" }, children: T.badge })
                  ]
                },
                F
              )) }),
              x && /* @__PURE__ */ i.jsxs(
                X,
                {
                  variant: x.variant || "outline",
                  size: "md",
                  onClick: () => {
                    x.onClick(), ce(!1);
                  },
                  style: { width: "100%", marginTop: "1rem" },
                  children: [
                    x.icon && /* @__PURE__ */ i.jsx(Q, { name: x.icon, size: "sm" }),
                    x.label
                  ]
                }
              ),
              j && /* @__PURE__ */ i.jsxs(
                X,
                {
                  variant: "primary",
                  size: "md",
                  onClick: () => {
                    j.onClick(), ce(!1);
                  },
                  style: { width: "100%", marginTop: "0.5rem" },
                  children: [
                    j.icon && /* @__PURE__ */ i.jsx(Q, { name: j.icon, size: "sm" }),
                    j.label
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
};
To.displayName = "SuperNavbar";
const Cn = Ut(void 0), Eo = P.forwardRef(({
  children: e,
  defaultValue: t,
  value: r,
  onValueChange: n,
  variant: s = "line",
  size: o = "md",
  fullWidth: a = !1,
  orientation: l = "horizontal",
  swipeable: c = !1,
  color: d = "primary",
  backgroundColor: u,
  mobileMode: f = "auto",
  mobileBreakpoint: h = 640,
  style: m,
  ...g
}, p) => {
  const [y, j] = V(t || ""), [x, b] = V(!1), k = r !== void 0 ? r : y;
  ie(() => {
    const C = () => {
      b(f === "dropdown" ? !0 : f === "tabs" ? !1 : window.innerWidth <= h);
    };
    return C(), window.addEventListener("resize", C), () => window.removeEventListener("resize", C);
  }, [f, h]);
  const A = (C) => {
    r === void 0 && j(C), n == null || n(C);
  }, R = {
    width: a ? "100%" : "auto",
    display: l === "vertical" ? "flex" : "block",
    gap: l === "vertical" ? "24px" : void 0,
    ...m
  };
  if (x && l === "horizontal") {
    let C = [], S = [];
    return P.Children.forEach(e, (E) => {
      P.isValidElement(E) && (E.type === ws ? P.Children.forEach(E.props.children, (D) => {
        if (P.isValidElement(D) && D.type === Mr) {
          const L = D.props;
          C.push({
            value: L.value,
            label: L.children,
            disabled: L.disabled
          });
        }
      }) : E.type === Ir && S.push(E));
    }), /* @__PURE__ */ i.jsx(Cn.Provider, { value: { activeTab: k, setActiveTab: A, variant: s, color: d, backgroundColor: u }, children: /* @__PURE__ */ i.jsxs("div", { ref: p, style: R, ...g, children: [
      /* @__PURE__ */ i.jsx("div", { style: { marginBottom: "20px" }, children: /* @__PURE__ */ i.jsx(
        "select",
        {
          value: k,
          onChange: (E) => A(E.target.value),
          style: {
            width: a ? "100%" : "auto",
            padding: "10px 16px",
            fontSize: "16px",
            borderRadius: "var(--radius)",
            border: "2px solid rgb(var(--border))",
            backgroundColor: "rgb(var(--background))",
            color: "rgb(var(--text))",
            cursor: "pointer",
            outline: "none",
            transition: "all 0.2s ease",
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgb(107,114,128)' stroke-width='2'%3e%3cpath d='M6 9l6 6 6-6'/%3e%3c/svg%3e")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
            backgroundSize: "20px",
            paddingRight: "40px"
          },
          onFocus: (E) => {
            E.target.style.borderColor = `rgb(var(--${d}))`, E.target.style.boxShadow = `0 0 0 3px rgba(var(--${d}), 0.1)`;
          },
          onBlur: (E) => {
            E.target.style.borderColor = "rgb(var(--border))", E.target.style.boxShadow = "none";
          },
          children: C.map((E) => /* @__PURE__ */ i.jsx(
            "option",
            {
              value: E.value,
              disabled: E.disabled,
              children: E.label
            },
            E.value
          ))
        }
      ) }),
      S
    ] }) });
  }
  return /* @__PURE__ */ i.jsx(Cn.Provider, { value: { activeTab: k, setActiveTab: A, variant: s, color: d, backgroundColor: u }, children: /* @__PURE__ */ i.jsx("div", { ref: p, style: R, ...g, children: e }) });
});
Eo.displayName = "Tabs";
const ws = P.forwardRef(({
  children: e,
  variant: t = "line",
  size: r = "md",
  fullWidth: n = !1,
  orientation: s = "horizontal",
  showArrows: o = !0,
  scrollable: a = !0,
  style: l,
  ...c
}) => {
  const [d, u] = V({}), [f, h] = V(!1), [m, g] = V(!1), [p, y] = V(!1), [j, x] = V(0), [b, k] = V(0), A = ae(null), R = ae(null), C = ke(Cn), S = () => {
    if (R.current && s === "horizontal" && a) {
      const { scrollLeft: Y, scrollWidth: he, clientWidth: oe } = R.current;
      h(Y > 0), g(Y < he - oe - 1);
    }
  }, E = () => {
    R.current && R.current.scrollBy({ left: -200, behavior: "smooth" });
  }, D = () => {
    R.current && R.current.scrollBy({ left: 200, behavior: "smooth" });
  }, L = (Y) => {
    R.current && (y(!0), x(Y.pageX - R.current.offsetLeft), k(R.current.scrollLeft), Y.preventDefault());
  }, M = (Y) => {
    R.current && (y(!0), x(Y.touches[0].pageX - R.current.offsetLeft), k(R.current.scrollLeft));
  }, q = (Y) => {
    if (!p || !R.current) return;
    Y.preventDefault();
    const oe = (Y.pageX - R.current.offsetLeft - j) * 1.5;
    R.current.scrollLeft = b - oe, S();
  }, U = (Y) => {
    if (!p || !R.current) return;
    const oe = (Y.touches[0].pageX - R.current.offsetLeft - j) * 1.5;
    R.current.scrollLeft = b - oe, S();
  }, J = () => {
    y(!1);
  }, ce = () => {
    y(!1);
  };
  ie(() => {
    S();
    const Y = () => S();
    window.addEventListener("resize", Y);
    const he = () => y(!1);
    return window.addEventListener("mouseup", he), window.addEventListener("touchend", he), () => {
      window.removeEventListener("resize", Y), window.removeEventListener("mouseup", he), window.removeEventListener("touchend", he);
    };
  }, []), ie(() => {
    if (t === "line" && A.current && (C != null && C.activeTab)) {
      const Y = A.current.querySelector(`[data-value="${C.activeTab}"]`);
      if (Y) {
        const { offsetLeft: he, offsetWidth: oe, offsetTop: Ae, offsetHeight: nt } = Y;
        if (u({
          position: "absolute",
          bottom: s === "horizontal" ? "0" : void 0,
          left: s === "horizontal" ? `${he}px` : "0",
          top: s === "vertical" ? `${Ae}px` : void 0,
          width: s === "horizontal" ? `${oe}px` : "2px",
          height: s === "horizontal" ? "2px" : `${nt}px`,
          backgroundColor: "rgb(var(--primary))",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          borderRadius: "var(--radius-full)",
          zIndex: 10
        }), R.current && a) {
          const Ne = R.current, Me = Y.offsetLeft, de = Me + Y.offsetWidth, ne = Ne.scrollLeft, Ie = ne + Ne.clientWidth;
          Me < ne ? Ne.scrollTo({ left: Me - 20, behavior: "smooth" }) : de > Ie && Ne.scrollTo({ left: de - Ne.clientWidth + 20, behavior: "smooth" });
        }
      }
    }
  }, [C == null ? void 0 : C.activeTab, t, s, a]);
  const ue = {
    ...(() => {
      const Y = {
        display: s === "vertical" ? "flex" : "inline-flex",
        flexDirection: s === "vertical" ? "column" : "row",
        position: "relative",
        width: n ? "100%" : "auto",
        gap: t === "pills" ? "8px" : t === "segment" ? "0" : "4px"
      };
      switch (t) {
        case "line":
          return {
            ...Y,
            borderBottom: s === "horizontal" ? "1px solid rgb(var(--border))" : void 0,
            borderLeft: s === "vertical" ? "1px solid rgb(var(--border))" : void 0
          };
        case "boxed":
          return {
            ...Y,
            borderBottom: "1px solid rgb(var(--border))",
            gap: "0"
          };
        case "segment":
          return {
            ...Y,
            backgroundColor: "rgb(var(--surface))",
            padding: "4px",
            borderRadius: "var(--radius-lg)",
            boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.05)"
          };
        case "nav":
          return {
            ...Y,
            backgroundColor: "rgb(var(--background))",
            boxShadow: "var(--shadow)",
            borderRadius: "var(--radius-lg)",
            padding: "8px"
          };
        default:
          return Y;
      }
    })(),
    ...l
  };
  return a && s === "horizontal" ? /* @__PURE__ */ i.jsxs("div", { style: { position: "relative", width: n ? "100%" : "auto" }, children: [
    o && f && /* @__PURE__ */ i.jsx(
      "button",
      {
        onClick: E,
        style: {
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 20,
          background: "linear-gradient(90deg, rgb(var(--background)) 60%, transparent)",
          border: "none",
          padding: "8px 12px 8px 8px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          height: "100%"
        },
        "aria-label": "Scroll tabs left",
        children: /* @__PURE__ */ i.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ i.jsx("path", { d: "M15 18l-6-6 6-6" }) })
      }
    ),
    /* @__PURE__ */ i.jsxs(
      "div",
      {
        ref: R,
        style: {
          overflowX: "auto",
          overflowY: "hidden",
          scrollbarWidth: "none",
          // Firefox
          msOverflowStyle: "none",
          // IE
          WebkitOverflowScrolling: "touch",
          // iOS smooth scrolling
          cursor: p ? "grabbing" : "grab",
          userSelect: p ? "none" : "auto"
        },
        onScroll: S,
        onMouseDown: L,
        onMouseMove: q,
        onMouseUp: J,
        onMouseLeave: ce,
        onTouchStart: M,
        onTouchMove: U,
        onTouchEnd: J,
        children: [
          /* @__PURE__ */ i.jsx("style", { children: `
            div::-webkit-scrollbar { display: none; }
            /* Don't show grab cursor on buttons */
            button { cursor: pointer !important; }
          ` }),
          /* @__PURE__ */ i.jsxs("div", { ref: A, style: { ...ue, minWidth: "max-content" }, ...c, children: [
            P.Children.map(e, (Y) => P.isValidElement(Y) ? P.cloneElement(Y, {
              variant: t,
              size: r,
              fullWidth: !1,
              // Never fullWidth in scrollable mode
              orientation: s
            }) : Y),
            t === "line" && /* @__PURE__ */ i.jsx("div", { style: d })
          ] })
        ]
      }
    ),
    o && m && /* @__PURE__ */ i.jsx(
      "button",
      {
        onClick: D,
        style: {
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 20,
          background: "linear-gradient(270deg, rgb(var(--background)) 60%, transparent)",
          border: "none",
          padding: "8px 8px 8px 12px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          height: "100%"
        },
        "aria-label": "Scroll tabs right",
        children: /* @__PURE__ */ i.jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ i.jsx("path", { d: "M9 18l6-6-6-6" }) })
      }
    )
  ] }) : /* @__PURE__ */ i.jsxs("div", { ref: A, style: ue, ...c, children: [
    P.Children.map(e, (Y) => P.isValidElement(Y) ? P.cloneElement(Y, {
      variant: t,
      size: r,
      fullWidth: n,
      orientation: s
    }) : Y),
    t === "line" && /* @__PURE__ */ i.jsx("div", { style: d })
  ] });
});
ws.displayName = "TabsList";
const Mr = ({
  children: e,
  value: t,
  variant: r = "line",
  size: n = "md",
  fullWidth: s = !1,
  icon: o,
  disabled: a
}) => {
  const l = ke(Cn);
  if (!l)
    throw new Error("TabsTrigger must be used within Tabs");
  const { activeTab: c, setActiveTab: d, color: u, backgroundColor: f } = l, h = c === t, m = u || "primary", g = f || "rgb(var(--surface))", p = () => {
    a || d(t);
  }, y = () => {
    switch (r) {
      case "line":
        return "tab";
      case "boxed":
        return "ghost";
      // Use ghost with custom styling
      case "pills":
        return "pill";
      case "segment":
        return "segment";
      case "nav":
        return "nav";
      default:
        return "tab";
    }
  }, j = () => {
    const x = {
      minWidth: "max-content",
      // Never smaller than content
      whiteSpace: "nowrap"
      // Prevent text wrapping
    };
    return r === "boxed" ? {
      ...x,
      borderTopLeftRadius: "var(--radius)",
      borderTopRightRadius: "var(--radius)",
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      marginBottom: "-1px",
      backgroundColor: h ? g : "transparent",
      borderTop: h ? "1px solid rgb(var(--border))" : "1px solid transparent",
      borderLeft: h ? "1px solid rgb(var(--border))" : "1px solid transparent",
      borderRight: h ? "1px solid rgb(var(--border))" : "1px solid transparent",
      borderBottom: h ? `1px solid ${g}` : "1px solid transparent"
    } : r === "line" ? {
      ...x,
      borderBottom: "none",
      marginBottom: "0"
    } : x;
  };
  return /* @__PURE__ */ i.jsx(
    X,
    {
      variant: y(),
      color: m,
      size: n,
      fullWidth: s,
      icon: o,
      iconPosition: "left",
      isActive: h,
      onClick: p,
      disabled: a,
      animationType: "none",
      showRipple: !0,
      style: j(),
      "data-value": t,
      role: "tab",
      "aria-selected": h,
      children: e
    }
  );
};
Mr.displayName = "TabsTrigger";
const Ir = P.forwardRef(({
  children: e,
  value: t,
  keepMounted: r = !1,
  style: n,
  ...s
}, o) => {
  const a = ke(Cn);
  if (!a)
    throw new Error("TabsContent must be used within Tabs");
  const { activeTab: l } = a, c = l === t;
  if (!c && !r)
    return null;
  const d = {
    marginTop: "24px",
    display: c ? "block" : "none",
    animation: c ? "fadeIn 0.3s ease-out" : void 0,
    ...n
  };
  return ie(() => {
    if (typeof document < "u") {
      const u = "qwanyx-tab-content-animation";
      if (!document.getElementById(u)) {
        const f = document.createElement("style");
        f.id = u, f.textContent = `
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `, document.head.appendChild(f);
      }
    }
  }, []), /* @__PURE__ */ i.jsx(
    "div",
    {
      ref: o,
      role: "tabpanel",
      style: d,
      ...s,
      children: e
    }
  );
});
Ir.displayName = "TabsContent";
const Mw = ({
  tabs: e,
  defaultTab: t,
  variant: r = "line",
  size: n = "md",
  fullWidth: s = !1,
  orientation: o = "horizontal",
  className: a = "",
  color: l,
  backgroundColor: c,
  mobileMode: d = "auto",
  mobileBreakpoint: u = 640
}) => {
  var h;
  const f = t || ((h = e[0]) == null ? void 0 : h.id);
  return /* @__PURE__ */ i.jsxs(
    Eo,
    {
      defaultValue: f,
      variant: r,
      orientation: o,
      className: a,
      color: l,
      backgroundColor: c,
      mobileMode: d,
      mobileBreakpoint: u,
      children: [
        /* @__PURE__ */ i.jsx(
          ws,
          {
            variant: r,
            size: n,
            fullWidth: s,
            orientation: o,
            children: e.map((m) => /* @__PURE__ */ i.jsx(
              Mr,
              {
                value: m.id,
                icon: m.icon,
                disabled: m.disabled,
                children: m.label
              },
              m.id
            ))
          }
        ),
        e.map((m) => /* @__PURE__ */ i.jsx(Ir, { value: m.id, children: m.content }, m.id))
      ]
    }
  );
}, js = P.forwardRef(({
  children: e,
  size: t = "lg",
  centered: r = !0,
  overlay: n = !1,
  overlayOpacity: s = 0.5,
  backgroundImage: o,
  backgroundColor: a,
  className: l = "",
  style: c,
  ...d
}, u) => {
  const f = {
    sm: "py-12",
    md: "py-20",
    lg: "py-32",
    xl: "py-48",
    full: "min-h-screen flex items-center"
  }, h = "relative overflow-hidden", m = r ? "text-center" : "", g = [
    h,
    f[t],
    m,
    l
  ].filter(Boolean).join(" "), p = {
    ...c,
    ...o && {
      backgroundImage: `url(${o})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    ...a && { backgroundColor: a }
  };
  return /* @__PURE__ */ i.jsxs("section", { ref: u, className: g, style: p, ...d, children: [
    n && o && /* @__PURE__ */ i.jsx(
      "div",
      {
        className: "absolute inset-0 bg-black pointer-events-none",
        style: { opacity: s }
      }
    ),
    /* @__PURE__ */ i.jsx("div", { className: "relative z-10", children: e })
  ] });
});
js.displayName = "Hero";
const Cs = P.forwardRef(({
  children: e,
  as: t = "h1",
  className: r = "",
  ...n
}, s) => {
  const a = [
    "text-4xl md:text-5xl lg:text-6xl font-bold mb-6",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx(t, { ref: s, className: a, ...n, children: e });
});
Cs.displayName = "HeroTitle";
const ks = P.forwardRef(({
  children: e,
  className: t = "",
  ...r
}, n) => {
  const o = [
    "text-lg md:text-xl lg:text-2xl mb-8 opacity-90",
    t
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("p", { ref: n, className: o, ...r, children: e });
});
ks.displayName = "HeroSubtitle";
const Ss = P.forwardRef(({
  children: e,
  className: t = "",
  ...r
}, n) => /* @__PURE__ */ i.jsx(Se, { children: /* @__PURE__ */ i.jsx("div", { ref: n, className: t, ...r, children: e }) }));
Ss.displayName = "HeroContent";
const _s = P.forwardRef(({
  children: e,
  spacing: t = "md",
  className: r = "",
  ...n
}, s) => {
  const l = [
    "flex flex-wrap justify-center items-center",
    {
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6"
    }[t],
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("div", { ref: s, className: l, ...n, children: e });
});
_s.displayName = "HeroActions";
const Vr = P.forwardRef(({
  children: e,
  icon: t,
  iconPosition: r = "top",
  centered: n = !1,
  className: s = "",
  ...o
}, a) => {
  const l = n ? "text-center" : "", c = {
    top: "flex flex-col",
    left: "flex flex-row items-start",
    right: "flex flex-row-reverse items-start"
  }, d = {
    top: "mb-4",
    left: "mr-4",
    right: "ml-4"
  }, u = [
    l,
    t ? c[r] : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsxs("div", { ref: a, className: u, ...o, children: [
    t && /* @__PURE__ */ i.jsx("div", { className: d[r], children: t }),
    /* @__PURE__ */ i.jsx("div", { className: "flex-1", children: e })
  ] });
});
Vr.displayName = "Feature";
const Lr = P.forwardRef(({
  children: e,
  size: t = "md",
  variant: r = "circle",
  color: n = "primary",
  className: s = "",
  ...o
}, a) => {
  const l = {
    sm: "w-10 h-10 text-lg",
    md: "w-12 h-12 text-xl",
    lg: "w-16 h-16 text-2xl",
    xl: "w-20 h-20 text-3xl"
  }, c = {
    circle: "rounded-full",
    square: "rounded-lg",
    none: ""
  }, d = {
    primary: "bg-blue-100 text-blue-600",
    secondary: "bg-purple-100 text-purple-600",
    accent: "bg-green-100 text-green-600",
    success: "bg-green-100 text-green-600",
    warning: "bg-yellow-100 text-yellow-600",
    error: "bg-red-100 text-red-600",
    info: "bg-blue-100 text-blue-600"
  }, f = [
    "flex items-center justify-center",
    l[t],
    c[r],
    r !== "none" ? d[n] : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("div", { ref: a, className: f, ...o, children: e });
});
Lr.displayName = "FeatureIcon";
const Br = P.forwardRef(({
  children: e,
  as: t = "h3",
  className: r = "",
  ...n
}, s) => {
  const a = [
    "text-xl font-semibold mb-2",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx(t, { ref: s, className: a, ...n, children: e });
});
Br.displayName = "FeatureTitle";
const Or = P.forwardRef(({
  children: e,
  className: t = "",
  ...r
}, n) => {
  const o = [
    "text-gray-600",
    t
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("p", { ref: n, className: o, ...r, children: e });
});
Or.displayName = "FeatureDescription";
const Ts = P.forwardRef(({
  children: e,
  cols: t = 3,
  gap: r = "lg",
  className: n = "",
  ...s
}, o) => {
  const a = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  }, l = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
    xl: "gap-12"
  }, d = [
    "grid",
    a[t],
    l[r],
    n
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("div", { ref: o, className: d, ...s, children: e });
});
Ts.displayName = "FeaturesGrid";
const Ro = P.forwardRef(({
  children: e,
  variant: t = "simple",
  className: r = "",
  ...n
}, s) => {
  const l = [
    "",
    {
      simple: "py-8",
      detailed: "py-12",
      minimal: "py-4"
    }[t],
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("footer", { ref: s, className: l, ...n, children: /* @__PURE__ */ i.jsx(Se, { children: e }) });
});
Ro.displayName = "Footer";
const ln = P.forwardRef(({
  children: e,
  className: t = "",
  ...r
}, n) => {
  const o = [
    "text-left",
    t
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("div", { ref: n, className: o, ...r, children: e });
});
ln.displayName = "FooterSection";
const ts = P.forwardRef(({
  children: e,
  className: t = "",
  ...r
}, n) => {
  const o = [
    "font-semibold text-gray-900 mb-4 text-left",
    t
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("h3", { ref: n, className: o, ...r, children: e });
});
ts.displayName = "FooterTitle";
const rt = P.forwardRef(({
  children: e,
  className: t = "",
  ...r
}, n) => {
  const o = [
    "text-gray-600 hover:text-gray-900 transition-colors",
    t
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("a", { ref: n, className: o, ...r, children: e });
});
rt.displayName = "FooterLink";
const rs = P.forwardRef(({
  children: e,
  spacing: t = "md",
  className: r = "",
  ...n
}, s) => {
  const a = [
    {
      sm: "space-y-1",
      md: "space-y-2",
      lg: "space-y-3"
    }[t],
    "text-left",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("ul", { ref: s, className: a, ...n, children: P.Children.map(e, (l) => /* @__PURE__ */ i.jsx("li", { className: "text-left", children: l })) });
});
rs.displayName = "FooterLinks";
const Jd = P.forwardRef(({
  children: e,
  cols: t = 4,
  gap: r = "lg",
  className: n = "",
  ...s
}, o) => {
  const a = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-5",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
  }, l = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
    xl: "gap-12"
  }, d = [
    "grid",
    a[t],
    l[r],
    n
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("div", { ref: o, className: d, ...s, children: e });
});
Jd.displayName = "FooterGrid";
const Qd = P.forwardRef(({
  children: e,
  className: t = "",
  ...r
}, n) => {
  const o = [
    "mt-8 pt-8 text-sm text-gray-600",
    t
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("div", { ref: n, className: o, ...r, children: e });
});
Qd.displayName = "FooterBottom";
const Ao = P.forwardRef(({
  children: e,
  isOpen: t,
  onClose: r,
  size: n = "md",
  closeOnOverlayClick: s = !0,
  closeOnEscape: o = !0,
  showCloseButton: a = !0,
  overlayClassName: l = "",
  className: c = "",
  ...d
}, u) => {
  const f = ae(null);
  ie(() => {
    const y = (j) => {
      o && j.key === "Escape" && r();
    };
    return t && (document.addEventListener("keydown", y), document.body.style.overflow = "hidden"), () => {
      document.removeEventListener("keydown", y), document.body.style.overflow = "";
    };
  }, [t, r, o]);
  const h = (y) => {
    s && y.target === y.currentTarget && r();
  }, m = [
    "qwanyx-modal-overlay",
    l
  ].filter(Boolean).join(" "), g = [
    "qwanyx-modal",
    `qwanyx-modal--${n}`,
    c
  ].filter(Boolean).join(" ");
  if (!t) return null;
  const p = /* @__PURE__ */ i.jsx(
    "div",
    {
      className: m,
      onClick: h,
      role: "dialog",
      "aria-modal": "true",
      children: /* @__PURE__ */ i.jsxs(
        "div",
        {
          ref: u || f,
          className: g,
          ...d,
          children: [
            a && /* @__PURE__ */ i.jsx(
              "button",
              {
                onClick: r,
                className: "qwanyx-modal__close",
                "aria-label": "Close modal",
                children: /* @__PURE__ */ i.jsx("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ i.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
              }
            ),
            e
          ]
        }
      )
    }
  );
  return typeof window < "u" ? Au.createPortal(
    p,
    document.body
  ) : p;
});
Ao.displayName = "Modal";
const zo = P.forwardRef(({
  children: e,
  className: t = "",
  ...r
}, n) => {
  const s = [
    "qwanyx-modal__header",
    t
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("div", { ref: n, className: s, ...r, children: e });
});
zo.displayName = "ModalHeader";
const Po = P.forwardRef(({
  children: e,
  className: t = "",
  ...r
}, n) => {
  const s = [
    "qwanyx-modal__title",
    t
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("h2", { ref: n, className: s, ...r, children: e });
});
Po.displayName = "ModalTitle";
const No = P.forwardRef(({
  children: e,
  className: t = "",
  ...r
}, n) => {
  const s = [
    "qwanyx-modal__description",
    t
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("p", { ref: n, className: s, ...r, children: e });
});
No.displayName = "ModalDescription";
const Fo = P.forwardRef(({
  children: e,
  className: t = "",
  ...r
}, n) => {
  const s = [
    "qwanyx-modal__body",
    t
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("div", { ref: n, className: s, ...r, children: e });
});
Fo.displayName = "ModalBody";
const Do = P.forwardRef(({
  children: e,
  align: t = "right",
  className: r = "",
  ...n
}, s) => {
  const o = [
    "qwanyx-modal__footer",
    `qwanyx-modal__footer--${t}`,
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("div", { ref: s, className: o, ...n, children: e });
});
Do.displayName = "ModalFooter";
const Iw = ({
  isOpen: e,
  onClose: t,
  title: r,
  description: n,
  children: s,
  footer: o,
  size: a = "md",
  closeOnOverlayClick: l = !0,
  closeOnEscape: c = !0,
  showCloseButton: d = !0
}) => /* @__PURE__ */ i.jsxs(
  Ao,
  {
    isOpen: e,
    onClose: t,
    size: a,
    closeOnOverlayClick: l,
    closeOnEscape: c,
    showCloseButton: d,
    children: [
      (r || n) && /* @__PURE__ */ i.jsxs(zo, { children: [
        r && /* @__PURE__ */ i.jsx(Po, { children: r }),
        n && /* @__PURE__ */ i.jsx(No, { children: n })
      ] }),
      /* @__PURE__ */ i.jsx(Fo, { children: s }),
      o && /* @__PURE__ */ i.jsx(Do, { children: o })
    ]
  }
), py = P.forwardRef(({
  children: e,
  variant: t = "info",
  title: r,
  dismissible: n = !1,
  onDismiss: s,
  className: o = "",
  style: a,
  ...l
}, c) => {
  const u = {
    border: "1px solid",
    borderRadius: "8px",
    padding: "1rem",
    display: "flex",
    gap: "0.75rem",
    ...{
      info: {
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "rgba(59, 130, 246, 0.3)",
        color: "rgb(59, 130, 246)"
      },
      success: {
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderColor: "rgba(34, 197, 94, 0.3)",
        color: "rgb(34, 197, 94)"
      },
      warning: {
        backgroundColor: "rgba(250, 204, 21, 0.1)",
        borderColor: "rgba(250, 204, 21, 0.3)",
        color: "rgb(200, 150, 0)"
      },
      error: {
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderColor: "rgba(239, 68, 68, 0.3)",
        color: "rgb(239, 68, 68)"
      }
    }[t],
    ...a
  }, f = {
    flexShrink: 0,
    width: "20px",
    height: "20px"
  }, h = {
    flex: 1,
    minWidth: 0
  }, m = {
    fontSize: "0.875rem",
    fontWeight: 600,
    marginBottom: "0.25rem",
    margin: 0,
    color: "#1f2937"
  }, g = {
    fontSize: "0.875rem",
    color: "#4b5563",
    lineHeight: 1.5
  }, p = {
    flexShrink: 0,
    background: "none",
    border: "none",
    padding: "0.25rem",
    cursor: "pointer",
    color: "currentColor",
    opacity: 0.6,
    borderRadius: "4px",
    transition: "opacity 200ms ease"
  }, y = {
    info: /* @__PURE__ */ i.jsx("svg", { style: f, fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ i.jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z", clipRule: "evenodd" }) }),
    success: /* @__PURE__ */ i.jsx("svg", { style: f, fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ i.jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) }),
    warning: /* @__PURE__ */ i.jsx("svg", { style: f, fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ i.jsx("path", { fillRule: "evenodd", d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }),
    error: /* @__PURE__ */ i.jsx("svg", { style: f, fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ i.jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) })
  }, j = [
    "qwanyx-alert",
    `qwanyx-alert--${t}`,
    o
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsxs("div", { ref: c, className: j, style: u, role: "alert", ...l, children: [
    y[t],
    /* @__PURE__ */ i.jsxs("div", { style: h, children: [
      r && /* @__PURE__ */ i.jsx("h3", { style: m, children: r }),
      /* @__PURE__ */ i.jsx("div", { style: g, children: e })
    ] }),
    n && /* @__PURE__ */ i.jsx(
      "button",
      {
        onClick: s,
        style: p,
        onMouseEnter: (x) => x.currentTarget.style.opacity = "1",
        onMouseLeave: (x) => x.currentTarget.style.opacity = "0.6",
        "aria-label": "Dismiss",
        children: /* @__PURE__ */ i.jsx("svg", { style: { width: "16px", height: "16px" }, viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ i.jsx("path", { fillRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", clipRule: "evenodd" }) })
      }
    )
  ] });
});
py.displayName = "Alert";
const my = ({
  items: e,
  logo: t,
  user: r,
  footer: n,
  collapsed: s,
  collapsible: o = !0,
  onCollapse: a,
  className: l = "",
  width: c = "280px",
  collapsedWidth: d = "80px"
}) => {
  const [u, f] = V(s ?? !1), [h, m] = V([]), [g, p] = V(!1), [y, j] = V(!1), x = s !== void 0 ? s : u;
  ie(() => {
    const C = () => {
      p(window.innerWidth < 768);
    };
    return C(), window.addEventListener("resize", C), () => window.removeEventListener("resize", C);
  }, []);
  const b = () => {
    const C = !x;
    f(C), a == null || a(C);
  }, k = (C) => {
    m(
      (S) => S.includes(C) ? S.filter((E) => E !== C) : [...S, C]
    );
  }, A = (C, S = 0) => {
    const E = C.children && C.children.length > 0, D = h.includes(C.id);
    return /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-sidebar__item-wrapper", children: [
      C.href ? /* @__PURE__ */ i.jsxs(
        Od,
        {
          href: C.href,
          className: `qwanyx-sidebar__item qwanyx-sidebar__item--level-${S}`,
          children: [
            C.icon && /* @__PURE__ */ i.jsx("span", { className: "qwanyx-sidebar__item-icon", children: C.icon }),
            !x && /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
              /* @__PURE__ */ i.jsx("span", { className: "qwanyx-sidebar__item-label", children: C.label }),
              C.badge && /* @__PURE__ */ i.jsx("span", { className: "qwanyx-sidebar__item-badge", children: C.badge }),
              E && /* @__PURE__ */ i.jsx(
                Q,
                {
                  name: D ? "expand_more" : "chevron_right",
                  className: "qwanyx-sidebar__item-chevron"
                }
              )
            ] })
          ]
        }
      ) : /* @__PURE__ */ i.jsxs(
        "button",
        {
          onClick: () => {
            var L;
            (L = C.onClick) == null || L.call(C), E && k(C.id);
          },
          className: `qwanyx-sidebar__item qwanyx-sidebar__item--level-${S}`,
          children: [
            C.icon && /* @__PURE__ */ i.jsx("span", { className: "qwanyx-sidebar__item-icon", children: C.icon }),
            !x && /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
              /* @__PURE__ */ i.jsx("span", { className: "qwanyx-sidebar__item-label", children: C.label }),
              C.badge && /* @__PURE__ */ i.jsx("span", { className: "qwanyx-sidebar__item-badge", children: C.badge }),
              E && /* @__PURE__ */ i.jsx(
                Q,
                {
                  name: D ? "expand_more" : "chevron_right",
                  className: "qwanyx-sidebar__item-chevron"
                }
              )
            ] })
          ]
        }
      ),
      E && D && !x && /* @__PURE__ */ i.jsx("div", { className: "qwanyx-sidebar__children", children: C.children.map((L) => A(L, S + 1)) })
    ] }, C.id);
  }, R = /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    t && /* @__PURE__ */ i.jsx("div", { className: "qwanyx-sidebar__logo", children: t }),
    r && /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-sidebar__user", children: [
      /* @__PURE__ */ i.jsx(
        vr,
        {
          src: r.avatar,
          alt: r.name,
          size: x ? "sm" : "md"
        }
      ),
      !x && /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-sidebar__user-info", children: [
        /* @__PURE__ */ i.jsx(W, { weight: "semibold", size: "sm", children: r.name }),
        r.role && /* @__PURE__ */ i.jsx(W, { size: "xs", className: "qwanyx-sidebar__user-role", children: r.role })
      ] })
    ] }),
    /* @__PURE__ */ i.jsx("nav", { className: "qwanyx-sidebar__nav", children: e.map((C) => A(C)) }),
    n && /* @__PURE__ */ i.jsx("div", { className: "qwanyx-sidebar__footer", children: n }),
    o && !g && /* @__PURE__ */ i.jsx(
      X,
      {
        variant: "ghost",
        size: "sm",
        onClick: b,
        className: "qwanyx-sidebar__collapse-btn",
        children: /* @__PURE__ */ i.jsx(Q, { name: x ? "menu" : "x" })
      }
    )
  ] });
  return g ? /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    /* @__PURE__ */ i.jsx(
      X,
      {
        variant: "ghost",
        size: "sm",
        onClick: () => j(!y),
        className: "qwanyx-sidebar__mobile-toggle",
        children: /* @__PURE__ */ i.jsx(Q, { name: "menu" })
      }
    ),
    y && /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
      /* @__PURE__ */ i.jsx(
        "div",
        {
          className: "qwanyx-sidebar__mobile-overlay",
          onClick: () => j(!1)
        }
      ),
      /* @__PURE__ */ i.jsx(
        "aside",
        {
          className: `qwanyx-sidebar qwanyx-sidebar--mobile ${l}`,
          style: { width: c },
          children: R
        }
      )
    ] })
  ] }) : /* @__PURE__ */ i.jsx(
    "aside",
    {
      className: `qwanyx-sidebar ${x ? "qwanyx-sidebar--collapsed" : ""} ${l}`,
      style: { width: x ? d : c },
      children: R
    }
  );
}, Vw = ({
  items: e,
  logo: t,
  user: r
}) => {
  const n = e.map((s, o) => ({
    id: `item-${o}`,
    ...s
  }));
  return /* @__PURE__ */ i.jsx(
    my,
    {
      items: n,
      logo: t,
      user: r,
      collapsible: !0
    }
  );
}, gy = ({
  user: e,
  size: t = "md",
  showEmail: r = !0,
  showRole: n = !1,
  showName: s = !0,
  orientation: o = "horizontal",
  className: a = "",
  style: l,
  onClick: c
}) => {
  const u = {
    sm: {
      avatar: "sm",
      nameSize: "0.875rem",
      detailSize: "0.75rem",
      gap: "0.5rem",
      padding: "0.25rem"
    },
    md: {
      avatar: "md",
      nameSize: "1rem",
      detailSize: "0.875rem",
      gap: "0.75rem",
      padding: "0.375rem"
    },
    lg: {
      avatar: "lg",
      nameSize: "1.125rem",
      detailSize: "1rem",
      gap: "1rem",
      padding: "0.5rem"
    }
  }[t], f = n && e.role ? e.role : r && e.email ? e.email : null, h = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: u.padding,
    borderRadius: "0.25rem",
    cursor: c ? "pointer" : "default",
    transition: "background-color 0.2s ease",
    flexDirection: o === "vertical" ? "column" : "row",
    ...l
  }, m = {
    display: "flex",
    flexDirection: "column",
    gap: "0.125rem",
    minWidth: 0,
    textAlign: o === "vertical" ? "center" : "left"
  }, g = {
    fontSize: u.nameSize,
    fontWeight: "bold",
    color: "rgb(var(--qwanyx-foreground))",
    lineHeight: 1.2,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }, p = {
    fontSize: u.detailSize,
    color: "rgb(var(--qwanyx-muted-foreground))",
    lineHeight: 1.2,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  };
  return /* @__PURE__ */ i.jsxs(
    "div",
    {
      className: a,
      style: h,
      onClick: c,
      onMouseEnter: c ? (y) => {
        y.currentTarget.style.backgroundColor = "rgba(var(--qwanyx-primary-rgb), 0.05)";
      } : void 0,
      onMouseLeave: c ? (y) => {
        y.currentTarget.style.backgroundColor = "transparent";
      } : void 0,
      children: [
        /* @__PURE__ */ i.jsx(
          vr,
          {
            src: e.avatar,
            alt: e.name,
            name: e.name,
            size: u.avatar,
            fallback: e.name.charAt(0).toUpperCase()
          }
        ),
        s && /* @__PURE__ */ i.jsxs("div", { style: m, children: [
          /* @__PURE__ */ i.jsx("div", { style: g, children: e.name }),
          f && /* @__PURE__ */ i.jsx("div", { style: p, children: f })
        ] })
      ]
    }
  );
}, Al = ({
  items: e,
  logo: t,
  title: r,
  user: n,
  footer: s,
  collapsed: o = !1,
  onCollapse: a,
  width: l = 280,
  collapsedWidth: c = 80,
  position: d = "left",
  theme: u = "light",
  className: f = "",
  style: h
}) => {
  const [m, g] = V([]), [p, y] = V(o), j = () => {
    const S = !p;
    y(S), a == null || a(S);
  }, x = (S) => {
    g(
      (E) => E.includes(S) ? E.filter((D) => D !== S) : [...E, S]
    );
  }, b = p ? c : l, k = {
    position: "fixed",
    top: 0,
    [d]: 0,
    bottom: 0,
    width: typeof b == "number" ? `${b}px` : b,
    backgroundColor: u === "dark" ? "rgb(31, 41, 55)" : "rgb(255, 255, 255)",
    borderRight: d === "left" ? "1px solid rgb(var(--qwanyx-border))" : "none",
    borderLeft: d === "right" ? "1px solid rgb(var(--qwanyx-border))" : "none",
    display: "flex",
    flexDirection: "column",
    transition: "width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
    zIndex: 40,
    ...h
  }, A = {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    padding: "1rem"
  }, R = {
    padding: "1.5rem",
    borderTop: "1px solid rgb(var(--qwanyx-border))",
    marginTop: "auto"
  }, C = (S, E = 0) => {
    const D = S.children && S.children.length > 0, L = m.includes(S.id), M = {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      padding: `0.75rem ${p ? "0.5rem" : "1rem"}`,
      marginLeft: E * (p ? 0 : 16),
      borderRadius: "8px",
      cursor: S.disabled ? "not-allowed" : "pointer",
      transition: "all 200ms ease",
      backgroundColor: S.active ? "rgba(var(--qwanyx-primary-rgb), 0.1)" : "transparent",
      color: S.active ? "rgb(var(--qwanyx-primary))" : u === "dark" ? "rgb(229, 231, 235)" : "rgb(var(--qwanyx-foreground))",
      opacity: S.disabled ? 0.5 : 1,
      position: "relative",
      overflow: "hidden"
    }, q = () => {
      S.disabled || (D ? x(S.id) : S.onClick ? S.onClick() : S.href && (window.location.href = S.href));
    };
    return /* @__PURE__ */ i.jsxs("div", { children: [
      /* @__PURE__ */ i.jsxs(
        "div",
        {
          style: M,
          onClick: q,
          onMouseEnter: (U) => {
            !S.disabled && !S.active && (U.currentTarget.style.backgroundColor = "rgba(var(--qwanyx-primary-rgb), 0.05)");
          },
          onMouseLeave: (U) => {
            S.active || (U.currentTarget.style.backgroundColor = "transparent");
          },
          children: [
            S.icon && /* @__PURE__ */ i.jsx(
              Q,
              {
                name: S.icon,
                size: "md",
                style: { flexShrink: 0 }
              }
            ),
            !p && /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
              /* @__PURE__ */ i.jsx(
                W,
                {
                  size: "sm",
                  weight: S.active ? "semibold" : "normal",
                  style: { flex: 1 },
                  children: S.label
                }
              ),
              S.badge && /* @__PURE__ */ i.jsx(bt, { size: "sm", color: "primary", children: S.badge }),
              D && /* @__PURE__ */ i.jsx(
                Q,
                {
                  name: L ? "ExpandLess" : "ExpandMore",
                  size: "sm"
                }
              )
            ] }),
            p && S.badge && /* @__PURE__ */ i.jsx("div", { style: {
              position: "absolute",
              top: "4px",
              right: "4px",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "rgb(var(--qwanyx-primary))"
            } })
          ]
        }
      ),
      D && L && !p && S.children && /* @__PURE__ */ i.jsx("div", { style: { marginTop: "0.25rem" }, children: S.children.map((U) => C(U, E + 1)) })
    ] }, S.id);
  };
  return /* @__PURE__ */ i.jsxs("aside", { className: f, style: k, children: [
    /* @__PURE__ */ i.jsxs("div", { style: {
      display: "flex",
      flexDirection: "column",
      borderBottom: "1px solid rgb(var(--qwanyx-border))"
    }, children: [
      /* @__PURE__ */ i.jsx("div", { style: {
        padding: "1rem 1.5rem",
        borderBottom: "1px solid rgb(var(--qwanyx-border))"
      }, children: /* @__PURE__ */ i.jsxs(
        X,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => window.location.href = "/",
          style: {
            padding: "0.5rem",
            width: "100%",
            justifyContent: p ? "center" : "flex-start",
            gap: "0.5rem"
          },
          children: [
            /* @__PURE__ */ i.jsx(
              Q,
              {
                name: "ChevronLeft",
                size: "md"
              }
            ),
            !p && /* @__PURE__ */ i.jsx("span", { children: "Retour au site" })
          ]
        }
      ) }),
      /* @__PURE__ */ i.jsxs("div", { style: {
        padding: "1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: p ? "center" : "flex-start"
      }, children: [
        /* @__PURE__ */ i.jsx(
          X,
          {
            variant: "ghost",
            size: "sm",
            onClick: j,
            style: { padding: "0.5rem" },
            children: /* @__PURE__ */ i.jsx(
              Q,
              {
                name: p ? "MenuOpen" : "Menu",
                size: "md"
              }
            )
          }
        ),
        !n && !p && /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
          t && (typeof t == "string" ? /* @__PURE__ */ i.jsx(
            "img",
            {
              src: t,
              alt: r || "Logo",
              style: { height: "40px", width: "auto", marginLeft: "0.75rem" }
            }
          ) : /* @__PURE__ */ i.jsx("div", { style: { marginLeft: "0.75rem" }, children: t })),
          r && /* @__PURE__ */ i.jsx(W, { size: "lg", weight: "bold", style: { marginLeft: "0.75rem" }, children: r })
        ] })
      ] }),
      n && /* @__PURE__ */ i.jsx("div", { style: {
        padding: p ? "0 0.5rem 1.5rem 0.5rem" : "0 1.5rem 1.5rem 1.5rem",
        display: "flex",
        justifyContent: p ? "center" : "flex-start"
      }, children: /* @__PURE__ */ i.jsx(
        gy,
        {
          user: {
            name: n.name,
            email: n.email,
            avatar: n.avatar,
            role: n.role
          },
          size: "md",
          showName: !p,
          showEmail: !p,
          orientation: "horizontal",
          style: { padding: 0 }
        }
      ) })
    ] }),
    /* @__PURE__ */ i.jsx("div", { style: A, children: e.map((S) => C(S)) }),
    s && !p && /* @__PURE__ */ i.jsx("div", { style: R, children: s })
  ] });
}, $o = ({
  navbar: e,
  sidebar: t,
  rightSidebar: r,
  children: n,
  contentPadding: s = !0,
  // kept for compatibility
  contentMaxWidth: o = !1,
  className: a = "",
  style: l
}) => {
  const [c, d] = V(!1), [u, f] = V(!1), h = t === !1 ? 0 : c ? (t == null ? void 0 : t.collapsedWidth) || 80 : (t == null ? void 0 : t.width) || 280, m = r === !1 ? 0 : u ? (r == null ? void 0 : r.collapsedWidth) || 80 : (r == null ? void 0 : r.width) || 280, g = e === !1 ? 0 : 80, p = {
    minHeight: "100vh",
    backgroundColor: "rgb(var(--qwanyx-background))",
    ...l
  }, y = {
    marginTop: 0,
    marginLeft: t !== !1 ? `${typeof h == "number" ? h + "px" : h}` : 0,
    marginRight: r !== !1 ? `${typeof m == "number" ? m + "px" : m}` : 0,
    minHeight: "100vh",
    transition: "margin 300ms cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    flexDirection: "column"
  }, j = {
    flex: 1,
    width: "100%",
    padding: "30px 30px 0 30px",
    maxWidth: o !== !1 ? typeof o == "number" ? `${o}px` : o : void 0,
    margin: o !== !1 ? "0 auto" : void 0
  };
  return /* @__PURE__ */ i.jsxs("div", { className: a, style: p, children: [
    e !== !1 && /* @__PURE__ */ i.jsx(
      To,
      {
        ...e,
        position: "fixed",
        style: {
          zIndex: 50,
          ...e == null ? void 0 : e.style
        }
      }
    ),
    t !== !1 && /* @__PURE__ */ i.jsx(
      Al,
      {
        ...t,
        items: (t == null ? void 0 : t.items) || [],
        position: "left",
        collapsed: c,
        onCollapse: d,
        style: {
          top: 0,
          height: "100vh",
          zIndex: 40,
          ...t == null ? void 0 : t.style
        }
      }
    ),
    r !== !1 && /* @__PURE__ */ i.jsx(
      Al,
      {
        ...r,
        items: (r == null ? void 0 : r.items) || [],
        position: "right",
        collapsed: u,
        onCollapse: f,
        style: {
          top: e !== !1 ? `${g}px` : 0,
          height: e !== !1 ? `calc(100vh - ${g}px)` : "100vh",
          zIndex: 40,
          ...r == null ? void 0 : r.style
        }
      }
    ),
    /* @__PURE__ */ i.jsx("main", { style: y, children: /* @__PURE__ */ i.jsx("div", { style: j, children: n }) })
  ] });
}, Lw = (e) => /* @__PURE__ */ i.jsx(
  $o,
  {
    contentPadding: !0,
    contentMaxWidth: !1,
    ...e
  }
), Bw = (e) => /* @__PURE__ */ i.jsx(
  $o,
  {
    contentPadding: !0,
    contentMaxWidth: 1200,
    ...e
  }
), Ow = (e) => /* @__PURE__ */ i.jsx(
  $o,
  {
    contentPadding: !1,
    contentMaxWidth: !1,
    ...e
  }
), eu = ({
  size: e = "md",
  color: t = "primary",
  type: r = "circle",
  className: n = "",
  label: s = "Loading..."
}) => {
  const o = `qwanyx-inline-block ${n}`, a = {
    xs: "sm",
    sm: "md",
    md: "lg",
    lg: "xl",
    xl: "2xl"
  };
  return r === "ring" ? /* @__PURE__ */ i.jsxs("div", { className: o, role: "status", "aria-label": s, children: [
    /* @__PURE__ */ i.jsx(
      Q,
      {
        name: "refresh",
        size: a[e],
        color: t,
        spin: !0,
        variant: "outlined"
      }
    ),
    /* @__PURE__ */ i.jsx("span", { className: "qwanyx-sr-only", children: s })
  ] }) : r === "sync" ? /* @__PURE__ */ i.jsxs("div", { className: o, role: "status", "aria-label": s, children: [
    /* @__PURE__ */ i.jsx(
      Q,
      {
        name: "autorenew",
        size: a[e],
        color: t,
        spin: !0,
        variant: "outlined"
      }
    ),
    /* @__PURE__ */ i.jsx("span", { className: "qwanyx-sr-only", children: s })
  ] }) : /* @__PURE__ */ i.jsxs("div", { className: o, role: "status", "aria-label": s, children: [
    /* @__PURE__ */ i.jsx(
      Q,
      {
        name: "progress_activity",
        size: a[e],
        color: t,
        spin: !0,
        variant: "outlined"
      }
    ),
    /* @__PURE__ */ i.jsx("span", { className: "qwanyx-sr-only", children: s })
  ] });
}, qw = ({
  text: e = "Loading...",
  textPosition: t = "right",
  size: r = "sm",
  ...n
}) => {
  const s = {
    xs: "qwanyx-text-xs",
    sm: "qwanyx-text-sm",
    md: "qwanyx-text-base",
    lg: "qwanyx-text-lg",
    xl: "qwanyx-text-xl"
  };
  return /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-inline-flex qwanyx-items-center qwanyx-gap-2", children: [
    t === "left" && /* @__PURE__ */ i.jsx("span", { className: s[r || "sm"], children: e }),
    /* @__PURE__ */ i.jsx(eu, { size: r, ...n }),
    t === "right" && /* @__PURE__ */ i.jsx("span", { className: s[r || "sm"], children: e })
  ] });
}, Ww = ({
  checked: e,
  defaultChecked: t = !1,
  onChange: r,
  disabled: n = !1,
  size: s = "md",
  color: o = "primary",
  label: a,
  labelPosition: l = "right",
  name: c,
  value: d,
  className: u = "",
  required: f = !1
}) => {
  const [h, m] = P.useState(t), g = e !== void 0, p = g ? e : h, y = () => {
    if (n) return;
    const C = !p;
    g || m(C), r == null || r(C);
  }, j = (C) => {
    (C.key === " " || C.key === "Enter") && (C.preventDefault(), y());
  }, x = {
    xs: { width: "24px", height: "12px" },
    sm: { width: "32px", height: "16px" },
    md: { width: "44px", height: "24px" },
    lg: { width: "56px", height: "28px" },
    xl: { width: "64px", height: "32px" }
  }, b = {
    xs: { width: "8px", height: "8px" },
    sm: { width: "12px", height: "12px" },
    md: { width: "20px", height: "20px" },
    lg: { width: "24px", height: "24px" },
    xl: { width: "28px", height: "28px" }
  }, k = {
    xs: p ? "14px" : "2px",
    sm: p ? "18px" : "2px",
    md: p ? "22px" : "2px",
    lg: p ? "30px" : "2px",
    xl: p ? "34px" : "2px"
  }, A = {
    primary: "rgb(59 130 246)",
    secondary: "rgb(168 85 247)",
    accent: "rgb(34 197 94)",
    success: "rgb(34 197 94)",
    warning: "rgb(250 204 21)",
    error: "rgb(239 68 68)",
    info: "rgb(59 130 246)"
  }, R = /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    /* @__PURE__ */ i.jsx(
      "button",
      {
        type: "button",
        role: "switch",
        "aria-checked": p,
        "aria-label": a || "Toggle switch",
        "aria-required": f,
        disabled: n,
        onClick: y,
        onKeyDown: j,
        style: {
          position: "relative",
          display: "inline-flex",
          ...x[s],
          backgroundColor: p ? A[o] : "rgb(209 213 219)",
          borderRadius: "9999px",
          border: "2px solid transparent",
          cursor: n ? "not-allowed" : "pointer",
          opacity: n ? 0.5 : 1,
          transition: "background-color 200ms ease-in-out",
          outline: "none"
        },
        children: /* @__PURE__ */ i.jsx(
          "span",
          {
            "aria-hidden": "true",
            style: {
              position: "absolute",
              ...b[s],
              backgroundColor: "white",
              borderRadius: "9999px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              transform: `translateX(${k[s]})`,
              transition: "transform 200ms ease-in-out",
              top: "50%",
              marginTop: `-${parseInt(b[s].height) / 2}px`
            }
          }
        )
      }
    ),
    c && /* @__PURE__ */ i.jsx(
      "input",
      {
        type: "checkbox",
        name: c,
        value: d,
        checked: p,
        onChange: () => {
        },
        disabled: n,
        required: f,
        className: "qwanyx-sr-only",
        "aria-hidden": "true"
      }
    )
  ] });
  return a ? /* @__PURE__ */ i.jsxs(
    "label",
    {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "12px",
        cursor: n ? "not-allowed" : "pointer",
        opacity: n ? 0.5 : 1
      },
      className: u,
      children: [
        l === "left" && /* @__PURE__ */ i.jsxs("span", { style: { userSelect: "none" }, children: [
          a,
          f && /* @__PURE__ */ i.jsx("span", { style: { color: "rgb(239 68 68)", marginLeft: "4px" }, children: "*" })
        ] }),
        R,
        l === "right" && /* @__PURE__ */ i.jsxs("span", { style: { userSelect: "none" }, children: [
          a,
          f && /* @__PURE__ */ i.jsx("span", { style: { color: "rgb(239 68 68)", marginLeft: "4px" }, children: "*" })
        ] })
      ]
    }
  ) : /* @__PURE__ */ i.jsx("div", { className: u, children: R });
}, Uw = ({
  children: e,
  label: t,
  orientation: r = "vertical",
  className: n = ""
}) => /* @__PURE__ */ i.jsxs("div", { className: n, children: [
  t && /* @__PURE__ */ i.jsx("div", { style: {
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "12px"
  }, children: t }),
  /* @__PURE__ */ i.jsx(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: r === "vertical" ? "column" : "row",
        gap: r === "vertical" ? "12px" : "16px",
        flexWrap: r === "horizontal" ? "wrap" : void 0
      },
      children: e
    }
  )
] }), Zw = ({
  checked: e,
  defaultChecked: t = !1,
  onChange: r,
  disabled: n = !1,
  indeterminate: s = !1,
  size: o = "md",
  color: a = "primary",
  variant: l = "default",
  animation: c = "smooth",
  label: d,
  labelPosition: u = "right",
  name: f,
  value: h,
  required: m = !1,
  className: g = "",
  style: p
}) => {
  const [y, j] = V(t), x = ae(null), b = e !== void 0, k = b ? e : y, A = (q) => {
    if (n) return;
    const U = q.target.checked;
    b || j(U), r == null || r(U);
  }, C = {
    xs: { box: 14, icon: 10, font: 12, gap: 6 },
    sm: { box: 16, icon: 12, font: 14, gap: 8 },
    md: { box: 20, icon: 14, font: 16, gap: 10 },
    lg: { box: 24, icon: 18, font: 18, gap: 12 },
    xl: { box: 28, icon: 22, font: 20, gap: 14 }
  }[o], S = {
    hidden: {
      opacity: 0,
      scale: c === "pop" ? 0 : c === "bounce" ? 0.8 : c === "smooth" ? 0.9 : 1,
      rotate: c === "pop" ? -180 : 0
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: c === "smooth" ? 0.2 : 0.3,
        type: c === "pop" ? "spring" : "tween",
        ...c === "pop" ? { stiffness: 500, damping: 25 } : {},
        ease: c === "bounce" ? [0.68, -0.55, 0.265, 1.55] : "easeOut"
      }
    }
  }, D = {
    primary: "var(--primary)",
    secondary: "var(--secondary)",
    accent: "var(--accent)",
    success: "var(--success)",
    warning: "var(--warning)",
    error: "var(--error)",
    info: "var(--info)"
  }[a], L = () => {
    const q = {
      width: `${C.box}px`,
      height: `${C.box}px`,
      borderRadius: "calc(var(--radius) * 0.5)",
      position: "relative",
      cursor: n ? "not-allowed" : "pointer",
      transition: "all 0.2s ease",
      flexShrink: 0
    };
    return l === "filled" ? {
      ...q,
      backgroundColor: k ? `rgb(${D})` : "rgb(var(--surface))",
      border: "2px solid transparent"
    } : l === "outlined" ? {
      ...q,
      backgroundColor: "transparent",
      border: `2px solid ${k ? `rgb(${D})` : "rgb(var(--border))"}`
    } : {
      ...q,
      backgroundColor: k ? `rgb(${D})` : "rgb(var(--background))",
      border: k ? `2px solid rgb(${D})` : "2px solid rgb(var(--border))"
      // Remove boxShadow as it causes layout shift
    };
  };
  return /* @__PURE__ */ i.jsxs(
    "label",
    {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: `${C.gap}px`,
        cursor: n ? "not-allowed" : "pointer",
        opacity: n ? 0.5 : 1,
        userSelect: "none",
        ...p
      },
      className: g,
      children: [
        u === "left" && d && /* @__PURE__ */ i.jsxs("span", { style: { fontSize: `${C.font}px` }, children: [
          d,
          m && /* @__PURE__ */ i.jsx("span", { style: { color: "rgb(var(--error))", marginLeft: "4px" }, children: "*" })
        ] }),
        /* @__PURE__ */ i.jsxs("div", { style: { position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }, children: [
          /* @__PURE__ */ i.jsx(
            "input",
            {
              ref: x,
              type: "checkbox",
              checked: k,
              onChange: A,
              disabled: n,
              name: f,
              value: h,
              required: m,
              style: {
                position: "absolute",
                opacity: 0,
                width: "100%",
                height: "100%",
                cursor: n ? "not-allowed" : "pointer",
                zIndex: 1
              }
            }
          ),
          /* @__PURE__ */ i.jsx("div", { style: {
            ...L(),
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }, children: /* @__PURE__ */ i.jsx(
            pt.div,
            {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: `${C.icon}px`,
                height: `${C.icon}px`
              },
              initial: "hidden",
              animate: k || s ? "visible" : "hidden",
              variants: c !== "none" ? S : void 0,
              children: s ? (
                // Indeterminate state - horizontal line
                /* @__PURE__ */ i.jsx(
                  "div",
                  {
                    style: {
                      width: `${C.icon}px`,
                      height: "2px",
                      backgroundColor: l === "outlined" ? `rgb(${D})` : "white",
                      borderRadius: "1px"
                    }
                  }
                )
              ) : (
                // Checked state - checkmark
                /* @__PURE__ */ i.jsx(
                  "svg",
                  {
                    width: C.icon,
                    height: C.icon,
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: l === "outlined" ? `rgb(${D})` : "white",
                    strokeWidth: "3",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    style: { display: "block" },
                    children: /* @__PURE__ */ i.jsx("polyline", { points: "20 6 9 17 4 12" })
                  }
                )
              )
            }
          ) })
        ] }),
        u === "right" && d && /* @__PURE__ */ i.jsxs("span", { style: { fontSize: `${C.font}px` }, children: [
          d,
          m && /* @__PURE__ */ i.jsx("span", { style: { color: "rgb(var(--error))", marginLeft: "4px" }, children: "*" })
        ] })
      ]
    }
  );
}, Hw = ({
  children: e,
  label: t,
  orientation: r = "vertical",
  gap: n = "md",
  className: s = "",
  style: o
}) => {
  const a = {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24
  };
  return /* @__PURE__ */ i.jsxs("div", { className: s, style: o, children: [
    t && /* @__PURE__ */ i.jsx("div", { style: {
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "12px",
      color: "rgb(var(--text-secondary))",
      textTransform: "uppercase",
      letterSpacing: "0.5px"
    }, children: t }),
    /* @__PURE__ */ i.jsx(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: r === "vertical" ? "column" : "row",
          gap: `${a[n]}px`,
          flexWrap: r === "horizontal" ? "wrap" : void 0
        },
        children: e
      }
    )
  ] });
}, xy = ({
  checked: e,
  defaultChecked: t = !1,
  onChange: r,
  disabled: n = !1,
  size: s = "md",
  color: o = "primary",
  variant: a = "default",
  animation: l = "smooth",
  label: c,
  labelPosition: d = "right",
  name: u,
  value: f,
  required: h = !1,
  className: m = "",
  style: g
}) => {
  const [p, y] = V(t), j = ae(null), x = e !== void 0, b = x ? e : p, k = (M) => {
    n || (M.preventDefault(), b || (x || y(!0), r == null || r(!0)));
  }, R = {
    xs: { box: 14, dot: 6, font: 12, gap: 6 },
    sm: { box: 16, dot: 8, font: 14, gap: 8 },
    md: { box: 20, dot: 10, font: 16, gap: 10 },
    lg: { box: 24, dot: 12, font: 18, gap: 12 },
    xl: { box: 28, dot: 14, font: 20, gap: 14 }
  }[s], S = {
    primary: "var(--primary)",
    secondary: "var(--secondary)",
    accent: "var(--accent)",
    success: "var(--success)",
    warning: "var(--warning)",
    error: "var(--error)",
    info: "var(--info)"
  }[o], E = {
    hidden: {
      opacity: 0,
      scale: l === "pop" ? 0 : l === "bounce" ? 0.8 : l === "smooth" ? 0.9 : l === "pulse" ? 0.95 : 1,
      rotate: l === "pop" ? -180 : 0
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: l === "smooth" ? 0.2 : 0.3,
        type: l === "pop" ? "spring" : "tween",
        ...l === "pop" ? { stiffness: 500, damping: 25 } : {},
        ease: l === "bounce" ? [0.68, -0.55, 0.265, 1.55] : l === "pulse" ? "easeInOut" : "easeOut"
      }
    }
  }, D = () => {
    const M = {
      width: `${R.box}px`,
      height: `${R.box}px`,
      borderRadius: "50%",
      cursor: n ? "not-allowed" : "pointer",
      transition: l === "none" ? "none" : "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden"
    };
    return a === "filled" ? {
      ...M,
      backgroundColor: b ? `rgb(${S})` : "rgb(var(--surface))",
      border: "2px solid transparent"
    } : a === "outlined" ? {
      ...M,
      backgroundColor: "transparent",
      border: `2px solid ${b ? `rgb(${S})` : "rgb(var(--border))"}`
    } : {
      ...M,
      backgroundColor: b ? `rgb(${S})` : "rgb(var(--background))",
      border: b ? `2px solid rgb(${S})` : "2px solid rgb(var(--border))"
    };
  };
  return /* @__PURE__ */ i.jsxs(
    "label",
    {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: `${R.gap}px`,
        cursor: n ? "not-allowed" : "pointer",
        opacity: n ? 0.5 : 1,
        userSelect: "none",
        ...g
      },
      className: m,
      children: [
        d === "left" && c && /* @__PURE__ */ i.jsxs("span", { style: { fontSize: `${R.font}px` }, children: [
          c,
          h && /* @__PURE__ */ i.jsx("span", { style: { color: "rgb(var(--error))", marginLeft: "4px" }, children: "*" })
        ] }),
        /* @__PURE__ */ i.jsxs("div", { style: {
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }, children: [
          /* @__PURE__ */ i.jsx(
            "input",
            {
              ref: j,
              type: "checkbox",
              checked: b,
              onClick: k,
              onChange: () => {
              },
              disabled: n,
              name: u,
              value: f,
              required: h,
              style: {
                position: "absolute",
                opacity: 0,
                width: "100%",
                height: "100%",
                cursor: n ? "not-allowed" : "pointer",
                zIndex: 1
              }
            }
          ),
          /* @__PURE__ */ i.jsx(
            "div",
            {
              style: D(),
              children: /* @__PURE__ */ i.jsx(
                pt.div,
                {
                  style: {
                    width: `${R.dot}px`,
                    height: `${R.dot}px`,
                    borderRadius: "50%",
                    backgroundColor: a === "outlined" ? `rgb(${S})` : a === "filled" ? "white" : `rgb(${S})`,
                    position: "absolute"
                  },
                  initial: "hidden",
                  animate: b ? "visible" : "hidden",
                  variants: l !== "none" ? E : void 0
                }
              )
            }
          )
        ] }),
        d === "right" && c && /* @__PURE__ */ i.jsxs("span", { style: { fontSize: `${R.font}px` }, children: [
          c,
          h && /* @__PURE__ */ i.jsx("span", { style: { color: "rgb(var(--error))", marginLeft: "4px" }, children: "*" })
        ] })
      ]
    }
  );
}, Yw = ({
  children: e,
  label: t,
  orientation: r = "vertical",
  gap: n = "md",
  name: s,
  value: o,
  defaultValue: a,
  onChange: l,
  className: c = "",
  style: d
}) => {
  const [u, f] = V(a || ""), h = o !== void 0, m = h ? o : u, g = {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24
  }, p = s || `radio-group-${Math.random().toString(36).substr(2, 9)}`, y = P.Children.map(e, (j) => {
    if (P.isValidElement(j) && j.type === xy) {
      const x = j.props.value || "";
      return P.cloneElement(j, {
        name: p,
        checked: m === x,
        onChange: (b) => {
          b && (h || f(x), l && l(x));
        }
      });
    }
    return j;
  });
  return /* @__PURE__ */ i.jsxs("div", { className: c, style: d, children: [
    t && /* @__PURE__ */ i.jsx("div", { style: {
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "12px",
      color: "rgb(var(--text-secondary))",
      textTransform: "uppercase",
      letterSpacing: "0.5px"
    }, children: t }),
    /* @__PURE__ */ i.jsx(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: r === "vertical" ? "column" : "row",
          gap: `${g[n]}px`,
          flexWrap: r === "horizontal" ? "wrap" : void 0
        },
        children: y
      }
    )
  ] });
}, Ti = ({
  value: e,
  size: t = "md",
  color: r = "primary",
  type: n = "circular",
  showPercent: s = !1,
  className: o = "",
  label: a = "Progress"
}) => {
  const l = Math.max(0, Math.min(100, e)), c = {
    xs: "sm",
    sm: "md",
    md: "lg",
    lg: "xl",
    xl: "2xl"
  };
  if (n === "circular") {
    let u = "clock_loader_10";
    l === 0 ? u = "radio_button_unchecked" : l === 100 ? u = "check_circle" : l <= 10 ? u = "clock_loader_10" : l <= 20 || l <= 30 ? u = "clock_loader_20" : l <= 40 || l <= 50 ? u = "clock_loader_40" : l <= 60 || l <= 70 ? u = "clock_loader_60" : l <= 80 ? u = "clock_loader_80" : (l <= 90, u = "clock_loader_90");
    const f = {
      primary: "rgb(59 130 246)",
      secondary: "rgb(168 85 247)",
      accent: "rgb(34 197 94)",
      success: "rgb(34 197 94)",
      warning: "rgb(250 204 21)",
      error: "rgb(239 68 68)",
      info: "rgb(59 130 246)"
    };
    return /* @__PURE__ */ i.jsxs("div", { className: o, style: { display: "inline-flex", alignItems: "center", gap: "8px" }, children: [
      /* @__PURE__ */ i.jsx("div", { role: "progressbar", "aria-valuenow": l, "aria-valuemin": 0, "aria-valuemax": 100, "aria-label": a, children: /* @__PURE__ */ i.jsx(
        Q,
        {
          name: u,
          size: c[t],
          color: r,
          variant: "outlined"
        }
      ) }),
      s && /* @__PURE__ */ i.jsxs("span", { style: { fontSize: "14px", color: f[r] }, children: [
        l,
        "%"
      ] })
    ] });
  }
  if (n === "dots") {
    const f = Math.round(l / 100 * 10), h = {
      primary: "rgb(59 130 246)",
      secondary: "rgb(168 85 247)",
      accent: "rgb(34 197 94)",
      success: "rgb(34 197 94)",
      warning: "rgb(250 204 21)",
      error: "rgb(239 68 68)",
      info: "rgb(59 130 246)"
    };
    return /* @__PURE__ */ i.jsxs(
      "div",
      {
        className: o,
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: "8px"
        },
        role: "progressbar",
        "aria-valuenow": l,
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-label": a,
        children: [
          /* @__PURE__ */ i.jsx("div", { style: { display: "flex", gap: "4px" }, children: Array.from({ length: 10 }).map((m, g) => /* @__PURE__ */ i.jsx(
            "div",
            {
              style: {
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: g < f ? h[r] : "rgb(209 213 219)",
                transition: "background-color 300ms"
              }
            },
            g
          )) }),
          s && /* @__PURE__ */ i.jsxs("span", { style: { fontSize: "14px", color: h[r] }, children: [
            l,
            "%"
          ] })
        ]
      }
    );
  }
  const d = {
    primary: "rgb(59 130 246)",
    secondary: "rgb(168 85 247)",
    accent: "rgb(34 197 94)",
    success: "rgb(34 197 94)",
    warning: "rgb(250 204 21)",
    error: "rgb(239 68 68)",
    info: "rgb(59 130 246)"
  };
  return /* @__PURE__ */ i.jsx("div", { className: o, style: { width: "100%" }, children: /* @__PURE__ */ i.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
    /* @__PURE__ */ i.jsx(
      "div",
      {
        style: {
          flex: 1,
          backgroundColor: "rgb(229 231 235)",
          borderRadius: "9999px",
          height: "8px",
          overflow: "hidden"
        },
        role: "progressbar",
        "aria-valuenow": l,
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-label": a,
        children: /* @__PURE__ */ i.jsx(
          "div",
          {
            style: {
              height: "100%",
              borderRadius: "9999px",
              backgroundColor: d[r],
              width: `${l}%`,
              transition: "width 300ms ease"
            }
          }
        )
      }
    ),
    s && /* @__PURE__ */ i.jsxs("span", { style: {
      fontSize: "14px",
      minWidth: "3ch",
      color: d[r]
    }, children: [
      l,
      "%"
    ] })
  ] }) });
}, Gw = ({
  label: e,
  labelPosition: t = "top",
  ...r
}) => {
  const n = "qwanyx-text-sm qwanyx-text-gray-600";
  return t === "left" || t === "right" ? /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-inline-flex qwanyx-items-center qwanyx-gap-3", children: [
    t === "left" && /* @__PURE__ */ i.jsx("span", { className: n, children: e }),
    /* @__PURE__ */ i.jsx(Ti, { ...r }),
    t === "right" && /* @__PURE__ */ i.jsx("span", { className: n, children: e })
  ] }) : /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-space-y-1", children: [
    t === "top" && /* @__PURE__ */ i.jsx("div", { className: n, children: e }),
    /* @__PURE__ */ i.jsx(Ti, { ...r }),
    t === "bottom" && /* @__PURE__ */ i.jsx("div", { className: n, children: e })
  ] });
}, tu = {
  backlog: {
    defaultProgress: 0,
    colorClass: "qwanyx-text-status-backlog",
    rgbColor: "rgb(148 163 184)",
    // Gray
    label: "Backlog",
    icon: "radio_button_unchecked"
  },
  todo: {
    defaultProgress: 0,
    colorClass: "qwanyx-text-status-todo",
    rgbColor: "rgb(59 130 246)",
    // Blue
    label: "To Do",
    icon: "radio_button_unchecked"
  },
  doing: {
    defaultProgress: 50,
    colorClass: "qwanyx-text-status-doing",
    rgbColor: "rgb(234 88 12)",
    // Darker Orange
    label: "In Progress",
    icon: "clock_loader_60"
  },
  review: {
    defaultProgress: 80,
    colorClass: "qwanyx-text-status-review",
    rgbColor: "rgb(168 85 247)",
    // Purple
    label: "Review",
    icon: "clock_loader_80"
  },
  done: {
    defaultProgress: 100,
    colorClass: "qwanyx-text-status-done",
    rgbColor: "rgb(34 197 94)",
    // Green
    label: "Done",
    icon: "check_circle"
  },
  blocked: {
    defaultProgress: -1,
    // Special case - will use blocked icon
    colorClass: "qwanyx-text-status-blocked",
    rgbColor: "rgb(239 68 68)",
    // Red
    label: "Blocked",
    icon: "block"
  },
  validated: {
    defaultProgress: 100,
    colorClass: "qwanyx-text-status-validated",
    rgbColor: "rgb(20 184 166)",
    // Teal
    label: "Validated",
    icon: "verified"
  },
  archived: {
    defaultProgress: 100,
    colorClass: "qwanyx-text-status-archived",
    rgbColor: "rgb(71 85 105)",
    // Dark gray
    label: "Archived",
    icon: "archive"
  }
}, yy = ({
  status: e,
  progress: t,
  size: r = "md",
  showLabel: n = !1,
  className: s = ""
}) => {
  const o = tu[e], a = t ?? o.defaultProgress, l = {
    xs: "sm",
    sm: "md",
    md: "lg",
    lg: "xl",
    xl: "2xl"
  };
  if (a === -1 || a === 100 && o.icon && o.icon !== "check_circle")
    return /* @__PURE__ */ i.jsxs("div", { className: `qwanyx-inline-flex qwanyx-items-center qwanyx-gap-2 ${s}`, children: [
      /* @__PURE__ */ i.jsx("span", { style: { color: o.rgbColor }, children: /* @__PURE__ */ i.jsx(
        Q,
        {
          name: o.icon,
          size: l[r],
          color: "inherit",
          variant: "outlined"
        }
      ) }),
      n && /* @__PURE__ */ i.jsx("span", { className: "qwanyx-text-sm", style: { color: o.rgbColor }, children: o.label })
    ] });
  let c = "radio_button_unchecked";
  return a === 0 ? c = "radio_button_unchecked" : a === 100 ? c = "check_circle" : a <= 10 ? c = "clock_loader_10" : a <= 20 ? c = "clock_loader_20" : a <= 40 ? c = "clock_loader_40" : a <= 60 ? c = "clock_loader_60" : a <= 80 ? c = "clock_loader_80" : (a <= 90, c = "clock_loader_90"), /* @__PURE__ */ i.jsxs("div", { className: `qwanyx-inline-flex qwanyx-items-center qwanyx-gap-2 ${s}`, children: [
    /* @__PURE__ */ i.jsx("span", { style: { color: o.rgbColor }, children: /* @__PURE__ */ i.jsx(
      Q,
      {
        name: c,
        size: l[r],
        color: "inherit",
        variant: "outlined"
      }
    ) }),
    n && /* @__PURE__ */ i.jsxs("span", { className: "qwanyx-text-sm", style: { color: o.rgbColor }, children: [
      o.label,
      t !== void 0 && ` (${t}%)`
    ] })
  ] });
}, Kw = ({
  status: e,
  progress: t,
  showIcon: r = !0,
  variant: n = "solid",
  className: s = ""
}) => {
  const o = tu[e], a = {
    backlog: "rgb(148 163 184)",
    // Gray
    todo: "rgb(59 130 246)",
    // Blue
    doing: "rgb(234 88 12)",
    // Darker Orange
    review: "rgb(168 85 247)",
    // Purple
    done: "rgb(34 197 94)",
    // Green
    blocked: "rgb(239 68 68)",
    // Red
    validated: "rgb(20 184 166)",
    // Teal
    archived: "rgb(71 85 105)"
    // Dark gray
  }, l = n === "solid" ? {
    backgroundColor: a[e],
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "9999px",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "500"
  } : n === "outline" ? {
    backgroundColor: "transparent",
    color: a[e],
    border: `2px solid ${a[e]}`,
    padding: "6px 12px",
    borderRadius: "9999px",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "500"
  } : {
    backgroundColor: `${a[e]}20`,
    // 20% opacity
    color: a[e],
    border: "none",
    padding: "6px 12px",
    borderRadius: "9999px",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "500"
  };
  return /* @__PURE__ */ i.jsxs(
    "div",
    {
      className: s,
      style: l,
      children: [
        r && (() => {
          const c = t ?? o.defaultProgress;
          let d = "radio_button_unchecked";
          return c === -1 || e === "blocked" ? d = "block" : e === "validated" ? d = "verified" : e === "archived" ? d = "archive" : c === 0 ? d = "radio_button_unchecked" : c === 100 ? d = "check_circle" : c <= 10 ? d = "clock_loader_10" : c <= 20 ? d = "clock_loader_20" : c <= 40 ? d = "clock_loader_40" : c <= 60 ? d = "clock_loader_60" : c <= 80 ? d = "clock_loader_80" : (c <= 90, d = "clock_loader_90"), /* @__PURE__ */ i.jsx("span", { style: { color: l.color, display: "inline-flex", alignItems: "center" }, children: /* @__PURE__ */ i.jsx(
            Q,
            {
              name: d,
              size: "xs",
              color: "inherit",
              variant: "outlined"
            }
          ) });
        })(),
        /* @__PURE__ */ i.jsxs("span", { children: [
          o.label,
          t !== void 0 && ` (${t}%)`
        ] })
      ]
    }
  );
}, Xw = ({
  title: e,
  status: t,
  progress: r,
  assignee: n,
  priority: s,
  dueDate: o,
  description: a,
  className: l = ""
}) => {
  const c = {
    low: "rgb(148 163 184)",
    // Gray
    medium: "rgb(59 130 246)",
    // Blue  
    high: "rgb(234 88 12)",
    // Darker Orange
    critical: "rgb(239 68 68)"
    // Red
  };
  return /* @__PURE__ */ i.jsx("div", { className: `qwanyx-p-4 qwanyx-border qwanyx-rounded-lg qwanyx-bg-white qwanyx-shadow-sm hover:qwanyx-shadow-md qwanyx-transition-shadow ${l}`, children: /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-space-y-3", children: [
    /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-flex qwanyx-justify-between qwanyx-items-start", children: [
      /* @__PURE__ */ i.jsx("h3", { className: "qwanyx-font-semibold qwanyx-text-gray-900", children: e }),
      /* @__PURE__ */ i.jsx(yy, { status: t, progress: r, size: "sm" })
    ] }),
    a && /* @__PURE__ */ i.jsx("p", { className: "qwanyx-text-sm qwanyx-text-gray-600", children: a }),
    /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-flex qwanyx-items-center qwanyx-justify-between qwanyx-text-xs", children: [
      /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-flex qwanyx-gap-3", children: [
        n && /* @__PURE__ */ i.jsxs("span", { className: "qwanyx-text-gray-500", children: [
          /* @__PURE__ */ i.jsx(Q, { name: "person", size: "xs", className: "qwanyx-inline qwanyx-mr-1" }),
          n
        ] }),
        o && /* @__PURE__ */ i.jsxs("span", { className: "qwanyx-text-gray-500", children: [
          /* @__PURE__ */ i.jsx(Q, { name: "calendar_today", size: "xs", className: "qwanyx-inline qwanyx-mr-1" }),
          o
        ] })
      ] }),
      s && /* @__PURE__ */ i.jsx("span", { className: "qwanyx-font-medium", style: { color: c[s] }, children: s.toUpperCase() })
    ] }),
    t === "doing" && r !== void 0 && /* @__PURE__ */ i.jsx(Ti, { type: "bar", value: r, size: "xs", color: "info" })
  ] }) });
}, by = ({
  length: e = 6,
  value: t = "",
  onChange: r,
  onComplete: n,
  disabled: s = !1,
  error: o = !1,
  autoFocus: a = !0,
  className: l = ""
}) => {
  const [c, d] = V(() => {
    const x = t.split("").slice(0, e);
    return [...x, ...Array(e - x.length).fill("")];
  }), u = ae([]), f = ae(!1);
  ie(() => {
    a && u.current[0] && u.current[0].focus();
  }, [a]), ie(() => {
    const x = c.join("");
    r(x);
    const b = c.filter((k) => k !== "").length;
    b === e && x.length === e && n && !f.current ? (f.current = !0, n(x)) : b < e && (f.current = !1);
  }, [c, e, r, n]);
  const h = (x, b) => {
    var A;
    if (s || b && !/^\d$/.test(b)) return;
    const k = [...c];
    k[x] = b, d(k), b && x < e - 1 && ((A = u.current[x + 1]) == null || A.focus());
  }, m = (x, b) => {
    var k, A, R;
    if (!s) {
      if (b.key === "Backspace") {
        if (!c[x] && x > 0) {
          (k = u.current[x - 1]) == null || k.focus();
          const C = [...c];
          C[x - 1] = "", d(C);
        } else {
          const C = [...c];
          C[x] = "", d(C);
        }
        b.preventDefault();
      }
      b.key === "ArrowLeft" && x > 0 && ((A = u.current[x - 1]) == null || A.focus()), b.key === "ArrowRight" && x < e - 1 && ((R = u.current[x + 1]) == null || R.focus());
    }
  }, g = (x) => {
    var k;
    if (s) return;
    x.preventDefault();
    const b = x.clipboardData.getData("text").replace(/\D/g, "");
    if (b) {
      const A = b.split("").slice(0, e), R = [...A, ...Array(e - A.length).fill("")];
      d(R);
      const C = R.findIndex((E) => E === ""), S = C === -1 ? e - 1 : C;
      (k = u.current[S]) == null || k.focus();
    }
  }, p = (x) => {
    var b;
    (b = u.current[x]) == null || b.select();
  }, y = (x) => {
    const b = {
      width: "48px",
      height: "56px",
      textAlign: "center",
      fontSize: "1.5rem",
      fontWeight: "bold",
      borderRadius: "8px",
      border: "2px solid rgb(var(--qwanyx-border))",
      backgroundColor: "rgb(var(--qwanyx-input))",
      color: "rgb(var(--qwanyx-foreground))",
      outline: "none",
      transition: "all 200ms ease"
    };
    return s ? {
      ...b,
      backgroundColor: "rgb(var(--qwanyx-muted))",
      color: "rgb(var(--qwanyx-muted-foreground))",
      borderColor: "rgb(var(--qwanyx-border))",
      cursor: "not-allowed",
      opacity: 0.6
    } : o ? {
      ...b,
      borderColor: "rgb(var(--qwanyx-error))",
      backgroundColor: "rgb(var(--qwanyx-input))"
    } : c[x] ? {
      ...b,
      borderColor: "rgb(var(--qwanyx-success))",
      backgroundColor: "rgb(var(--qwanyx-card))"
    } : b;
  }, j = (x) => {
    const b = ["qwanyx-otp-input"];
    return s ? b.push("qwanyx-otp-input--disabled") : o ? b.push("qwanyx-otp-input--error") : c[x] && b.push("qwanyx-otp-input--filled"), b.join(" ");
  };
  return /* @__PURE__ */ i.jsx(
    "div",
    {
      className: `qwanyx-otp-container ${l}`,
      style: { display: "flex", gap: "0.5rem", justifyContent: "center" },
      children: Array.from({ length: e }, (x, b) => /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-otp-digit-wrapper", style: { position: "relative" }, children: [
        /* @__PURE__ */ i.jsx(
          "input",
          {
            ref: (k) => {
              k && (u.current[b] = k);
            },
            type: "text",
            inputMode: "numeric",
            maxLength: 1,
            value: c[b],
            onChange: (k) => h(b, k.target.value),
            onKeyDown: (k) => m(b, k),
            onPaste: g,
            onFocus: () => p(b),
            disabled: s,
            className: j(b),
            style: y(b)
          }
        ),
        c[b] && !o && /* @__PURE__ */ i.jsx(
          "div",
          {
            className: "qwanyx-otp-dot",
            style: {
              position: "absolute",
              bottom: "-8px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "6px",
              height: "6px",
              backgroundColor: "rgb(var(--qwanyx-primary))",
              borderRadius: "50%"
            }
          }
        )
      ] }, b))
    }
  );
}, vy = ({
  duration: e = 600,
  // 10 minutes default
  onExpire: t,
  onResend: r,
  canResend: n = !0
}) => {
  const [s, o] = V(e), [a, l] = V(!1);
  ie(() => {
    if (s <= 0) {
      l(!0), t && t();
      return;
    }
    const f = setInterval(() => {
      o((h) => h - 1);
    }, 1e3);
    return () => clearInterval(f);
  }, [s, t]);
  const c = (f) => {
    const h = Math.floor(f / 60), m = f % 60;
    return `${h}:${m.toString().padStart(2, "0")}`;
  }, d = () => {
    o(e), l(!1), r && r();
  };
  if (a)
    return /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-otp-timer", children: [
      /* @__PURE__ */ i.jsx("p", { className: "qwanyx-otp-timer-expired", children: "Code expired" }),
      n && /* @__PURE__ */ i.jsx(
        "button",
        {
          onClick: d,
          className: "qwanyx-otp-resend-button",
          children: "Resend code"
        }
      )
    ] });
  const u = () => s < 30 ? "qwanyx-otp-timer-countdown qwanyx-otp-timer-countdown--danger" : s < 60 ? "qwanyx-otp-timer-countdown qwanyx-otp-timer-countdown--warning" : "qwanyx-otp-timer-countdown";
  return /* @__PURE__ */ i.jsx("div", { className: "qwanyx-otp-timer", children: /* @__PURE__ */ i.jsxs("p", { className: "qwanyx-otp-timer-text", children: [
    "Code expires in",
    " ",
    /* @__PURE__ */ i.jsx("span", { className: u(), children: c(s) })
  ] }) });
}, Jw = ({
  isOpen: e,
  onClose: t,
  mode: r = "login",
  workspace: n = "qwanyx-ui",
  apiUrl: s = "http://135.181.72.183:5002",
  onSuccess: o
}) => {
  const [a, l] = V(r), [c, d] = V("email"), [u, f] = V(""), [h, m] = V(""), [g, p] = V(!1), [y, j] = V(""), [x, b] = V("");
  ie(() => {
    e ? l(r) : (d("email"), f(""), m(""), j(""), b(""), p(!1));
  }, [e, r]);
  const k = async () => {
    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(u)) {
      j("Please enter a valid email address");
      return;
    }
    p(!0), j("");
    try {
      const D = await fetch(`${s}${a === "register" ? "/auth/register" : "/auth/request-code"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: u,
          workspace: n
        })
      }), L = await D.json();
      D.ok ? (b(a === "register" ? "Welcome! Check your email for verification code." : "Code sent! Check your email."), d("code")) : j(L.error || "Failed to send code");
    } catch {
      j("Network error. Please try again.");
    } finally {
      p(!1);
    }
  }, A = async () => {
    p(!0), j("");
    try {
      const S = await fetch(`${s}/auth/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: u,
          code: h,
          workspace: n
        })
      }), E = await S.json();
      S.ok ? (localStorage.setItem(`${n}_token`, E.access_token), localStorage.setItem(`${n}_user`, JSON.stringify(E.user)), o && o(E.user, E.access_token), f(""), m(""), d("email"), t()) : j(E.error || "Invalid code");
    } catch {
      j("Network error. Please try again.");
    } finally {
      p(!1);
    }
  }, R = () => {
    d("email"), m(""), j(""), b("");
  }, C = () => {
    l(a === "login" ? "register" : "login"), d("email"), j(""), b("");
  };
  return /* @__PURE__ */ i.jsxs(
    Ao,
    {
      isOpen: e,
      onClose: t,
      size: "sm",
      showCloseButton: !0,
      children: [
        /* @__PURE__ */ i.jsxs(zo, { children: [
          /* @__PURE__ */ i.jsxs("div", { className: "flex flex-col items-center mb-6", children: [
            /* @__PURE__ */ i.jsx(
              "img",
              {
                src: "/images/logo.png",
                alt: "Logo",
                width: 60,
                height: 60,
                className: "mb-2",
                style: { width: "60px", height: "60px", objectFit: "contain" }
              }
            ),
            /* @__PURE__ */ i.jsx("div", { className: "text-2xl font-bold text-primary", children: n.toUpperCase() })
          ] }),
          /* @__PURE__ */ i.jsx(Po, { className: "text-center", children: a === "login" ? "Sign In" : "Create Account" }),
          /* @__PURE__ */ i.jsx(No, { className: "text-center", children: c === "email" ? `Enter your email to ${a === "login" ? "sign in" : "register"}` : "Enter the code sent to your email" })
        ] }),
        /* @__PURE__ */ i.jsx(Fo, { children: /* @__PURE__ */ i.jsxs("div", { className: "space-y-4", children: [
          y && /* @__PURE__ */ i.jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm", children: y }),
          x && /* @__PURE__ */ i.jsx("div", { className: "p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm", children: x }),
          c === "email" ? /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
            /* @__PURE__ */ i.jsxs("div", { style: { position: "relative", marginBottom: "8px" }, children: [
              /* @__PURE__ */ i.jsx("i", { className: "fas fa-envelope", style: {
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#999",
                fontSize: "14px",
                zIndex: 1
              } }),
              /* @__PURE__ */ i.jsx(
                qt,
                {
                  type: "email",
                  placeholder: "Enter your email",
                  value: u,
                  onChange: (S) => f(S.target.value),
                  disabled: g,
                  fullWidth: !0,
                  style: { paddingLeft: "2.5rem" },
                  error: !!y && c === "email",
                  pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",
                  title: "Please enter a valid email address",
                  required: !0
                }
              )
            ] }),
            /* @__PURE__ */ i.jsx(
              X,
              {
                fullWidth: !0,
                onClick: k,
                loading: g,
                disabled: !u,
                style: {
                  backgroundColor: "#E67E22",
                  color: "white",
                  opacity: u ? 1 : 0.6
                },
                children: "Send Code"
              }
            )
          ] }) : /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
            /* @__PURE__ */ i.jsxs("div", { className: "text-center text-sm text-gray-600 mb-4", children: [
              "Code sent to: ",
              /* @__PURE__ */ i.jsx("strong", { children: u })
            ] }),
            /* @__PURE__ */ i.jsx(
              by,
              {
                value: h,
                onChange: m,
                onComplete: () => {
                  h.length === 6 && A();
                },
                disabled: g,
                error: !!y,
                autoFocus: !0
              }
            ),
            /* @__PURE__ */ i.jsx("div", { className: "mt-4", children: /* @__PURE__ */ i.jsx(
              vy,
              {
                duration: 600,
                onExpire: () => j("Code expired. Please request a new one."),
                onResend: k
              }
            ) }),
            /* @__PURE__ */ i.jsx(
              X,
              {
                fullWidth: !0,
                onClick: A,
                loading: g,
                disabled: !h || h.length !== 6,
                className: "mt-4",
                children: "Verify Code"
              }
            ),
            /* @__PURE__ */ i.jsx(
              X,
              {
                fullWidth: !0,
                variant: "ghost",
                onClick: R,
                disabled: g,
                children: "Use Different Email"
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ i.jsx(Do, { align: "center", children: /* @__PURE__ */ i.jsxs(W, { size: "sm", children: [
          a === "login" ? "Don't have an account? " : "Already have an account? ",
          /* @__PURE__ */ i.jsx(
            "button",
            {
              onClick: C,
              className: "text-blue-500 hover:underline",
              disabled: g,
              children: a === "login" ? "Register" : "Sign In"
            }
          )
        ] }) })
      ]
    }
  );
}, Qw = ({
  workspace: e = "qwanyx-ui",
  onLogin: t,
  onLogout: r
}) => {
  const n = localStorage.getItem(`${e}_user`), s = n ? JSON.parse(n) : null;
  return s ? /* @__PURE__ */ i.jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ i.jsx(W, { size: "sm", children: s.email }),
    /* @__PURE__ */ i.jsx(
      X,
      {
        size: "sm",
        variant: "ghost",
        onClick: () => {
          localStorage.removeItem(`${e}_token`), localStorage.removeItem(`${e}_user`), r && r();
        },
        children: "Sign Out"
      }
    )
  ] }) : /* @__PURE__ */ i.jsx(X, { size: "sm", onClick: t, children: "Sign In" });
}, wy = ({
  href: e,
  autoDetect: t = !0
}) => {
  ie(() => {
    document.querySelectorAll("link[rel*='icon']").forEach((a) => a.remove()), e ? n(e) : t && r([
      "/favicon.ico",
      "/favicon.svg",
      "/favicon.png",
      "/images/logo.svg",
      "/images/logo.png",
      "/images/logo.jpg",
      "/images/logo-icon.svg",
      "/images/logo-icon.png",
      "/images/icon.svg",
      "/images/icon.png"
    ], 0);
  }, [e, t]);
  const r = (o, a) => {
    if (a >= o.length) {
      console.warn("No favicon found, using fallback"), s("Q");
      return;
    }
    const l = o[a], c = new Image();
    c.onload = () => {
      n(l);
    }, c.onerror = () => {
      r(o, a + 1);
    }, c.src = l;
  }, n = (o) => {
    var d;
    const a = (d = o.split(".").pop()) == null ? void 0 : d.toLowerCase();
    let l = "image/x-icon";
    a === "png" ? l = "image/png" : a === "svg" ? l = "image/svg+xml" : (a === "jpg" || a === "jpeg") && (l = "image/jpeg");
    const c = document.createElement("link");
    if (c.rel = a === "svg" ? "icon" : "shortcut icon", c.type = l, c.href = o, document.head.appendChild(c), a !== "ico") {
      const u = document.createElement("link");
      u.rel = "apple-touch-icon", u.href = o, document.head.appendChild(u);
    }
  }, s = (o) => {
    const a = document.createElement("canvas");
    a.width = 32, a.height = 32;
    const l = a.getContext("2d");
    l && (l.fillStyle = "#3B82F6", l.fillRect(0, 0, 32, 32), l.fillStyle = "#FFFFFF", l.font = "bold 20px Arial", l.textAlign = "center", l.textBaseline = "middle", l.fillText(o.charAt(0).toUpperCase(), 16, 16), a.toBlob((c) => {
      if (c) {
        const d = URL.createObjectURL(c);
        n(d);
      }
    }));
  };
  return null;
}, e1 = (e, t = {}) => {
  const { autoDetect: r = !0 } = t;
  ie(() => {
    if (document.querySelectorAll("link[rel*='icon']").forEach((s) => s.remove()), e)
      ((o) => {
        var d;
        const a = (d = o.split(".").pop()) == null ? void 0 : d.toLowerCase();
        let l = "image/x-icon";
        a === "png" ? l = "image/png" : a === "svg" ? l = "image/svg+xml" : (a === "jpg" || a === "jpeg") && (l = "image/jpeg");
        const c = document.createElement("link");
        c.rel = a === "svg" ? "icon" : "shortcut icon", c.type = l, c.href = o, document.head.appendChild(c);
      })(e);
    else if (r) {
      const s = [
        "/favicon.ico",
        "/favicon.svg",
        "/favicon.png",
        "/images/logo.svg",
        "/images/logo.png",
        "/images/logo.jpg"
      ], o = (a) => {
        const l = new Image();
        return l.src = a, new Promise((c, d) => {
          l.onload = () => c(a), l.onerror = d;
        });
      };
      Promise.any(s.map(o)).then((a) => {
        var u;
        const l = (u = a.split(".").pop()) == null ? void 0 : u.toLowerCase();
        let c = "image/x-icon";
        l === "png" ? c = "image/png" : l === "svg" ? c = "image/svg+xml" : (l === "jpg" || l === "jpeg") && (c = "image/jpeg");
        const d = document.createElement("link");
        d.rel = l === "svg" ? "icon" : "shortcut icon", d.type = c, d.href = a, document.head.appendChild(d);
      }).catch(() => {
        console.warn("No favicon found");
      });
    }
  }, [e, r]);
}, Es = P.forwardRef(({
  children: e,
  animation: t = "fadeIn",
  duration: r,
  delay: n,
  repeat: s,
  triggerOnScroll: o = !1,
  triggerOnHover: a = !1,
  triggerOnClick: l = !1,
  as: c = "div",
  className: d = "",
  ...u
}, f) => {
  const [h, m] = V(!o && !a && !l), g = ae(null), p = f || g, y = [
    h && "animate__animated",
    h && `animate__${t}`,
    r && typeof r == "string" && `animate__${r}`,
    n && typeof n == "string" && `animate__${n}`,
    s && `animate__${s === "infinite" ? "infinite" : s}`
  ].filter(Boolean).join(" "), j = {
    ...u.style
  };
  r && typeof r == "number" && (j.animationDuration = `${r}ms`), n && typeof n == "number" && (j.animationDelay = `${n}ms`), ie(() => {
    if (!o) return;
    const R = new IntersectionObserver(
      (C) => {
        C.forEach((S) => {
          S.isIntersecting && m(!0);
        });
      },
      { threshold: 0.1 }
    );
    return p && "current" in p && p.current && R.observe(p.current), () => R.disconnect();
  }, [o, p]);
  const x = () => {
    a && m(!0);
  }, b = () => {
    a && setTimeout(() => m(!1), 1e3);
  }, k = (R) => {
    var C, S;
    l && (m(!1), (C = p.current) == null || C.offsetHeight, m(!0)), (S = u.onClick) == null || S.call(u, R);
  }, A = [
    y,
    d
  ].filter(Boolean).join(" ");
  return P.createElement(
    c,
    {
      ref: p,
      className: A,
      style: j,
      onMouseEnter: a ? x : u.onMouseEnter,
      onMouseLeave: a ? b : u.onMouseLeave,
      onClick: l ? k : u.onClick,
      ...u
    },
    e
  );
});
Es.displayName = "Animated";
const t1 = (e) => /* @__PURE__ */ i.jsx(Es, { ...e, triggerOnScroll: !0 }), r1 = (e) => /* @__PURE__ */ i.jsx(Es, { ...e, triggerOnHover: !0 }), n1 = (e) => /* @__PURE__ */ i.jsx(Es, { ...e, triggerOnClick: !0 }), jy = ({
  children: e,
  speed: t = 0.5,
  offset: r = 0,
  className: n = "",
  style: s = {}
}) => {
  const o = ae(null), { scrollYProgress: a } = xo({
    target: o,
    offset: ["start end", "end start"]
  }), l = nr(a, [0, 1], [r, -r * t]), c = Ld(l, { stiffness: 100, damping: 30 });
  return /* @__PURE__ */ i.jsx(
    pt.div,
    {
      ref: o,
      style: { ...s, y: c },
      className: n,
      children: e
    }
  );
}, Cy = ({
  src: e,
  alt: t = "",
  speed: r = 0.5,
  scale: n = !0,
  className: s = "",
  containerClassName: o = "",
  overlay: a = !1,
  overlayOpacity: l = 0.5
}) => {
  const c = ae(null), { scrollYProgress: d } = xo({
    target: c,
    offset: ["start end", "end start"]
  }), u = nr(d, [0, 1], ["20%", "-20%"]), f = nr(d, [0, 0.5, 1], [1.2, 1, 1.2]);
  return /* @__PURE__ */ i.jsx("div", { ref: c, className: `relative overflow-hidden ${o}`, style: { position: "relative", minHeight: "100px" }, children: /* @__PURE__ */ i.jsxs(
    pt.div,
    {
      style: {
        y: r !== 0 ? u : 0,
        scale: n ? f : 1,
        position: "absolute",
        top: "-10%",
        left: 0,
        right: 0,
        bottom: "-10%",
        width: "100%",
        height: "120%"
      },
      children: [
        /* @__PURE__ */ i.jsx(
          "img",
          {
            src: e,
            alt: t,
            className: `w-full h-full object-cover ${s}`,
            style: { display: "block" }
          }
        ),
        a && /* @__PURE__ */ i.jsx(
          "div",
          {
            className: "absolute inset-0 bg-black",
            style: { opacity: l }
          }
        )
      ]
    }
  ) });
}, s1 = ({
  children: e,
  speed: t = 0.5,
  className: r = "",
  direction: n = "up"
}) => {
  const s = ae(null), { scrollYProgress: o } = xo({
    target: s,
    offset: ["start end", "end start"]
  }), l = (() => {
    const u = 100 * t;
    switch (n) {
      case "up":
        return nr(o, [0, 1], [`${u}px`, `-${u}px`]);
      case "down":
        return nr(o, [0, 1], [`-${u}px`, `${u}px`]);
      case "left":
        return nr(o, [0, 1], [`${u}px`, `-${u}px`]);
      case "right":
        return nr(o, [0, 1], [`-${u}px`, `${u}px`]);
    }
  })(), c = Ld(l, { stiffness: 100, damping: 30 }), d = n === "left" || n === "right" ? { x: c } : { y: c };
  return /* @__PURE__ */ i.jsx(
    pt.div,
    {
      ref: s,
      style: d,
      className: r,
      children: e
    }
  );
}, i1 = ({
  children: e,
  depth: t = 0.5,
  className: r = ""
}) => {
  const n = t * 0.5;
  return /* @__PURE__ */ i.jsx(jy, { speed: n, className: r, children: e });
}, o1 = ({
  children: e,
  backgroundImage: t,
  height: r = "100vh",
  className: n = "",
  overlayOpacity: s = 0.3
}) => /* @__PURE__ */ i.jsxs("div", { className: `relative overflow-hidden ${n}`, style: { height: r }, children: [
  t && /* @__PURE__ */ i.jsx("div", { className: "absolute inset-0 z-0", children: /* @__PURE__ */ i.jsx(
    Cy,
    {
      src: t,
      containerClassName: "w-full h-full",
      overlay: !0,
      overlayOpacity: s,
      speed: 0.3
    }
  ) }),
  /* @__PURE__ */ i.jsx("div", { className: "relative z-10 h-full flex items-center justify-center", children: e })
] }), a1 = ({
  children: e,
  className: t = "",
  animation: r = "fadeUp",
  delay: n = 0
}) => {
  const s = ae(null), [o, a] = V(!1);
  ie(() => {
    const c = new IntersectionObserver(
      ([d]) => {
        d.isIntersecting && a(!0);
      },
      { threshold: 0.1 }
    );
    return s.current && c.observe(s.current), () => c.disconnect();
  }, []);
  const l = () => {
    switch (r) {
      case "fadeUp":
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 }
        };
      case "fadeDown":
        return {
          hidden: { opacity: 0, y: -50 },
          visible: { opacity: 1, y: 0 }
        };
      case "fadeLeft":
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0 }
        };
      case "fadeRight":
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 }
        };
      case "zoom":
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 }
        };
      case "rotate":
        return {
          hidden: { opacity: 0, rotate: -10 },
          visible: { opacity: 1, rotate: 0 }
        };
    }
  };
  return /* @__PURE__ */ i.jsx(
    pt.div,
    {
      ref: s,
      className: t,
      initial: "hidden",
      animate: o ? "visible" : "hidden",
      variants: l(),
      transition: { duration: 0.6, delay: n },
      children: e
    }
  );
}, zl = (e, t, r) => {
  if (e && "reportValidity" in e) {
    const n = H(r, t);
    e.setCustomValidity(n && n.message || ""), e.reportValidity();
  }
}, Ei = (e, t) => {
  for (const r in t.fields) {
    const n = t.fields[r];
    n && n.ref && "reportValidity" in n.ref ? zl(n.ref, r, e) : n && n.refs && n.refs.forEach((s) => zl(s, r, e));
  }
}, Pl = (e, t) => {
  t.shouldUseNativeValidation && Ei(e, t);
  const r = {};
  for (const n in e) {
    const s = H(t.fields, n), o = Object.assign(e[n] || {}, { ref: s && s.ref });
    if (ky(t.names || Object.keys(e), n)) {
      const a = Object.assign({}, H(r, n));
      be(a, "root", o), be(r, n, a);
    } else be(r, n, o);
  }
  return r;
}, ky = (e, t) => {
  const r = Nl(t);
  return e.some((n) => Nl(n).match(`^${r}\\.\\d+`));
};
function Nl(e) {
  return e.replace(/\]|\[/g, "");
}
function $(e, t, r) {
  function n(l, c) {
    var d;
    Object.defineProperty(l, "_zod", {
      value: l._zod ?? {},
      enumerable: !1
    }), (d = l._zod).traits ?? (d.traits = /* @__PURE__ */ new Set()), l._zod.traits.add(e), t(l, c);
    for (const u in a.prototype)
      u in l || Object.defineProperty(l, u, { value: a.prototype[u].bind(l) });
    l._zod.constr = a, l._zod.def = c;
  }
  const s = (r == null ? void 0 : r.Parent) ?? Object;
  class o extends s {
  }
  Object.defineProperty(o, "name", { value: e });
  function a(l) {
    var c;
    const d = r != null && r.Parent ? new o() : this;
    n(d, l), (c = d._zod).deferred ?? (c.deferred = []);
    for (const u of d._zod.deferred)
      u();
    return d;
  }
  return Object.defineProperty(a, "init", { value: n }), Object.defineProperty(a, Symbol.hasInstance, {
    value: (l) => {
      var c, d;
      return r != null && r.Parent && l instanceof r.Parent ? !0 : (d = (c = l == null ? void 0 : l._zod) == null ? void 0 : c.traits) == null ? void 0 : d.has(e);
    }
  }), Object.defineProperty(a, "name", { value: e }), a;
}
class kn extends Error {
  constructor() {
    super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
  }
}
const ru = {};
function yr(e) {
  return ru;
}
function Sy(e) {
  const t = Object.values(e).filter((n) => typeof n == "number");
  return Object.entries(e).filter(([n, s]) => t.indexOf(+n) === -1).map(([n, s]) => s);
}
function Ri(e, t) {
  return typeof t == "bigint" ? t.toString() : t;
}
function nu(e) {
  return {
    get value() {
      {
        const t = e();
        return Object.defineProperty(this, "value", { value: t }), t;
      }
    }
  };
}
function Mo(e) {
  return e == null;
}
function Io(e) {
  const t = e.startsWith("^") ? 1 : 0, r = e.endsWith("$") ? e.length - 1 : e.length;
  return e.slice(t, r);
}
const Fl = Symbol("evaluating");
function we(e, t, r) {
  let n;
  Object.defineProperty(e, t, {
    get() {
      if (n !== Fl)
        return n === void 0 && (n = Fl, n = r()), n;
    },
    set(s) {
      Object.defineProperty(e, t, {
        value: s
        // configurable: true,
      });
    },
    configurable: !0
  });
}
function _y(e) {
  return Object.create(Object.getPrototypeOf(e), Object.getOwnPropertyDescriptors(e));
}
function wr(e, t, r) {
  Object.defineProperty(e, t, {
    value: r,
    writable: !0,
    enumerable: !0,
    configurable: !0
  });
}
function Jr(...e) {
  const t = {};
  for (const r of e) {
    const n = Object.getOwnPropertyDescriptors(r);
    Object.assign(t, n);
  }
  return Object.defineProperties({}, t);
}
function Dl(e) {
  return JSON.stringify(e);
}
const su = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {
};
function Ai(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
const Ty = nu(() => {
  var e;
  if (typeof navigator < "u" && ((e = navigator == null ? void 0 : navigator.userAgent) != null && e.includes("Cloudflare")))
    return !1;
  try {
    const t = Function;
    return new t(""), !0;
  } catch {
    return !1;
  }
});
function us(e) {
  if (Ai(e) === !1)
    return !1;
  const t = e.constructor;
  if (t === void 0)
    return !0;
  const r = t.prototype;
  return !(Ai(r) === !1 || Object.prototype.hasOwnProperty.call(r, "isPrototypeOf") === !1);
}
function iu(e) {
  return us(e) ? { ...e } : e;
}
const Ey = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
function Rs(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function jr(e, t, r) {
  const n = new e._zod.constr(t ?? e._zod.def);
  return (!t || r != null && r.parent) && (n._zod.parent = e), n;
}
function te(e) {
  const t = e;
  if (!t)
    return {};
  if (typeof t == "string")
    return { error: () => t };
  if ((t == null ? void 0 : t.message) !== void 0) {
    if ((t == null ? void 0 : t.error) !== void 0)
      throw new Error("Cannot specify both `message` and `error` params");
    t.error = t.message;
  }
  return delete t.message, typeof t.error == "string" ? { ...t, error: () => t.error } : t;
}
function Ry(e) {
  return Object.keys(e).filter((t) => e[t]._zod.optin === "optional" && e[t]._zod.optout === "optional");
}
function Ay(e, t) {
  const r = e._zod.def, n = Jr(e._zod.def, {
    get shape() {
      const s = {};
      for (const o in t) {
        if (!(o in r.shape))
          throw new Error(`Unrecognized key: "${o}"`);
        t[o] && (s[o] = r.shape[o]);
      }
      return wr(this, "shape", s), s;
    },
    checks: []
  });
  return jr(e, n);
}
function zy(e, t) {
  const r = e._zod.def, n = Jr(e._zod.def, {
    get shape() {
      const s = { ...e._zod.def.shape };
      for (const o in t) {
        if (!(o in r.shape))
          throw new Error(`Unrecognized key: "${o}"`);
        t[o] && delete s[o];
      }
      return wr(this, "shape", s), s;
    },
    checks: []
  });
  return jr(e, n);
}
function Py(e, t) {
  if (!us(t))
    throw new Error("Invalid input to extend: expected a plain object");
  const r = Jr(e._zod.def, {
    get shape() {
      const n = { ...e._zod.def.shape, ...t };
      return wr(this, "shape", n), n;
    },
    checks: []
  });
  return jr(e, r);
}
function Ny(e, t) {
  const r = Jr(e._zod.def, {
    get shape() {
      const n = { ...e._zod.def.shape, ...t._zod.def.shape };
      return wr(this, "shape", n), n;
    },
    get catchall() {
      return t._zod.def.catchall;
    },
    checks: []
    // delete existing checks
  });
  return jr(e, r);
}
function Fy(e, t, r) {
  const n = Jr(t._zod.def, {
    get shape() {
      const s = t._zod.def.shape, o = { ...s };
      if (r)
        for (const a in r) {
          if (!(a in s))
            throw new Error(`Unrecognized key: "${a}"`);
          r[a] && (o[a] = e ? new e({
            type: "optional",
            innerType: s[a]
          }) : s[a]);
        }
      else
        for (const a in s)
          o[a] = e ? new e({
            type: "optional",
            innerType: s[a]
          }) : s[a];
      return wr(this, "shape", o), o;
    },
    checks: []
  });
  return jr(t, n);
}
function Dy(e, t, r) {
  const n = Jr(t._zod.def, {
    get shape() {
      const s = t._zod.def.shape, o = { ...s };
      if (r)
        for (const a in r) {
          if (!(a in o))
            throw new Error(`Unrecognized key: "${a}"`);
          r[a] && (o[a] = new e({
            type: "nonoptional",
            innerType: s[a]
          }));
        }
      else
        for (const a in s)
          o[a] = new e({
            type: "nonoptional",
            innerType: s[a]
          });
      return wr(this, "shape", o), o;
    },
    checks: []
  });
  return jr(t, n);
}
function xn(e, t = 0) {
  var r;
  for (let n = t; n < e.issues.length; n++)
    if (((r = e.issues[n]) == null ? void 0 : r.continue) !== !0)
      return !0;
  return !1;
}
function ou(e, t) {
  return t.map((r) => {
    var n;
    return (n = r).path ?? (n.path = []), r.path.unshift(e), r;
  });
}
function Ln(e) {
  return typeof e == "string" ? e : e == null ? void 0 : e.message;
}
function br(e, t, r) {
  var s, o, a, l, c, d;
  const n = { ...e, path: e.path ?? [] };
  if (!e.message) {
    const u = Ln((a = (o = (s = e.inst) == null ? void 0 : s._zod.def) == null ? void 0 : o.error) == null ? void 0 : a.call(o, e)) ?? Ln((l = t == null ? void 0 : t.error) == null ? void 0 : l.call(t, e)) ?? Ln((c = r.customError) == null ? void 0 : c.call(r, e)) ?? Ln((d = r.localeError) == null ? void 0 : d.call(r, e)) ?? "Invalid input";
    n.message = u;
  }
  return delete n.inst, delete n.continue, t != null && t.reportInput || delete n.input, n;
}
function Vo(e) {
  return Array.isArray(e) ? "array" : typeof e == "string" ? "string" : "unknown";
}
function Sn(...e) {
  const [t, r, n] = e;
  return typeof t == "string" ? {
    message: t,
    code: "custom",
    input: r,
    inst: n
  } : { ...t };
}
const au = (e, t) => {
  e.name = "$ZodError", Object.defineProperty(e, "_zod", {
    value: e._zod,
    enumerable: !1
  }), Object.defineProperty(e, "issues", {
    value: t,
    enumerable: !1
  }), e.message = JSON.stringify(t, Ri, 2), Object.defineProperty(e, "toString", {
    value: () => e.message,
    enumerable: !1
  });
}, Lo = $("$ZodError", au), As = $("$ZodError", au, { Parent: Error });
function $y(e, t = (r) => r.message) {
  const r = {}, n = [];
  for (const s of e.issues)
    s.path.length > 0 ? (r[s.path[0]] = r[s.path[0]] || [], r[s.path[0]].push(t(s))) : n.push(t(s));
  return { formErrors: n, fieldErrors: r };
}
function My(e, t) {
  const r = t || function(o) {
    return o.message;
  }, n = { _errors: [] }, s = (o) => {
    for (const a of o.issues)
      if (a.code === "invalid_union" && a.errors.length)
        a.errors.map((l) => s({ issues: l }));
      else if (a.code === "invalid_key")
        s({ issues: a.issues });
      else if (a.code === "invalid_element")
        s({ issues: a.issues });
      else if (a.path.length === 0)
        n._errors.push(r(a));
      else {
        let l = n, c = 0;
        for (; c < a.path.length; ) {
          const d = a.path[c];
          c === a.path.length - 1 ? (l[d] = l[d] || { _errors: [] }, l[d]._errors.push(r(a))) : l[d] = l[d] || { _errors: [] }, l = l[d], c++;
        }
      }
  };
  return s(e), n;
}
const lu = (e) => (t, r, n, s) => {
  const o = n ? Object.assign(n, { async: !1 }) : { async: !1 }, a = t._zod.run({ value: r, issues: [] }, o);
  if (a instanceof Promise)
    throw new kn();
  if (a.issues.length) {
    const l = new ((s == null ? void 0 : s.Err) ?? e)(a.issues.map((c) => br(c, o, yr())));
    throw su(l, s == null ? void 0 : s.callee), l;
  }
  return a.value;
}, Iy = /* @__PURE__ */ lu(As), cu = (e) => async (t, r, n, s) => {
  const o = n ? Object.assign(n, { async: !0 }) : { async: !0 };
  let a = t._zod.run({ value: r, issues: [] }, o);
  if (a instanceof Promise && (a = await a), a.issues.length) {
    const l = new ((s == null ? void 0 : s.Err) ?? e)(a.issues.map((c) => br(c, o, yr())));
    throw su(l, s == null ? void 0 : s.callee), l;
  }
  return a.value;
}, Vy = /* @__PURE__ */ cu(As), du = (e) => (t, r, n) => {
  const s = n ? { ...n, async: !1 } : { async: !1 }, o = t._zod.run({ value: r, issues: [] }, s);
  if (o instanceof Promise)
    throw new kn();
  return o.issues.length ? {
    success: !1,
    error: new (e ?? Lo)(o.issues.map((a) => br(a, s, yr())))
  } : { success: !0, data: o.value };
}, Ly = /* @__PURE__ */ du(As), uu = (e) => async (t, r, n) => {
  const s = n ? Object.assign(n, { async: !0 }) : { async: !0 };
  let o = t._zod.run({ value: r, issues: [] }, s);
  return o instanceof Promise && (o = await o), o.issues.length ? {
    success: !1,
    error: new e(o.issues.map((a) => br(a, s, yr())))
  } : { success: !0, data: o.value };
}, By = /* @__PURE__ */ uu(As), Oy = /^[cC][^\s-]{8,}$/, qy = /^[0-9a-z]+$/, Wy = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/, Uy = /^[0-9a-vA-V]{20}$/, Zy = /^[A-Za-z0-9]{27}$/, Hy = /^[a-zA-Z0-9_-]{21}$/, Yy = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, Gy = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, $l = (e) => e ? new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$/, Ky = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, Xy = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
function Jy() {
  return new RegExp(Xy, "u");
}
const Qy = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, e0 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})$/, t0 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, r0 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, n0 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, fu = /^[A-Za-z0-9_-]*$/, s0 = /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/, i0 = /^\+(?:[0-9]){6,14}[0-9]$/, hu = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))", o0 = /* @__PURE__ */ new RegExp(`^${hu}$`);
function pu(e) {
  const t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
  return typeof e.precision == "number" ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function a0(e) {
  return new RegExp(`^${pu(e)}$`);
}
function l0(e) {
  const t = pu({ precision: e.precision }), r = ["Z"];
  e.local && r.push(""), e.offset && r.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
  const n = `${t}(?:${r.join("|")})`;
  return new RegExp(`^${hu}T(?:${n})$`);
}
const c0 = (e) => {
  const t = e ? `[\\s\\S]{${(e == null ? void 0 : e.minimum) ?? 0},${(e == null ? void 0 : e.maximum) ?? ""}}` : "[\\s\\S]*";
  return new RegExp(`^${t}$`);
}, d0 = /true|false/i, u0 = /^[^A-Z]*$/, f0 = /^[^a-z]*$/, Zt = /* @__PURE__ */ $("$ZodCheck", (e, t) => {
  var r;
  e._zod ?? (e._zod = {}), e._zod.def = t, (r = e._zod).onattach ?? (r.onattach = []);
}), h0 = /* @__PURE__ */ $("$ZodCheckMaxLength", (e, t) => {
  var r;
  Zt.init(e, t), (r = e._zod.def).when ?? (r.when = (n) => {
    const s = n.value;
    return !Mo(s) && s.length !== void 0;
  }), e._zod.onattach.push((n) => {
    const s = n._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    t.maximum < s && (n._zod.bag.maximum = t.maximum);
  }), e._zod.check = (n) => {
    const s = n.value;
    if (s.length <= t.maximum)
      return;
    const a = Vo(s);
    n.issues.push({
      origin: a,
      code: "too_big",
      maximum: t.maximum,
      inclusive: !0,
      input: s,
      inst: e,
      continue: !t.abort
    });
  };
}), p0 = /* @__PURE__ */ $("$ZodCheckMinLength", (e, t) => {
  var r;
  Zt.init(e, t), (r = e._zod.def).when ?? (r.when = (n) => {
    const s = n.value;
    return !Mo(s) && s.length !== void 0;
  }), e._zod.onattach.push((n) => {
    const s = n._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    t.minimum > s && (n._zod.bag.minimum = t.minimum);
  }), e._zod.check = (n) => {
    const s = n.value;
    if (s.length >= t.minimum)
      return;
    const a = Vo(s);
    n.issues.push({
      origin: a,
      code: "too_small",
      minimum: t.minimum,
      inclusive: !0,
      input: s,
      inst: e,
      continue: !t.abort
    });
  };
}), m0 = /* @__PURE__ */ $("$ZodCheckLengthEquals", (e, t) => {
  var r;
  Zt.init(e, t), (r = e._zod.def).when ?? (r.when = (n) => {
    const s = n.value;
    return !Mo(s) && s.length !== void 0;
  }), e._zod.onattach.push((n) => {
    const s = n._zod.bag;
    s.minimum = t.length, s.maximum = t.length, s.length = t.length;
  }), e._zod.check = (n) => {
    const s = n.value, o = s.length;
    if (o === t.length)
      return;
    const a = Vo(s), l = o > t.length;
    n.issues.push({
      origin: a,
      ...l ? { code: "too_big", maximum: t.length } : { code: "too_small", minimum: t.length },
      inclusive: !0,
      exact: !0,
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), zs = /* @__PURE__ */ $("$ZodCheckStringFormat", (e, t) => {
  var r, n;
  Zt.init(e, t), e._zod.onattach.push((s) => {
    const o = s._zod.bag;
    o.format = t.format, t.pattern && (o.patterns ?? (o.patterns = /* @__PURE__ */ new Set()), o.patterns.add(t.pattern));
  }), t.pattern ? (r = e._zod).check ?? (r.check = (s) => {
    t.pattern.lastIndex = 0, !t.pattern.test(s.value) && s.issues.push({
      origin: "string",
      code: "invalid_format",
      format: t.format,
      input: s.value,
      ...t.pattern ? { pattern: t.pattern.toString() } : {},
      inst: e,
      continue: !t.abort
    });
  }) : (n = e._zod).check ?? (n.check = () => {
  });
}), g0 = /* @__PURE__ */ $("$ZodCheckRegex", (e, t) => {
  zs.init(e, t), e._zod.check = (r) => {
    t.pattern.lastIndex = 0, !t.pattern.test(r.value) && r.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: r.value,
      pattern: t.pattern.toString(),
      inst: e,
      continue: !t.abort
    });
  };
}), x0 = /* @__PURE__ */ $("$ZodCheckLowerCase", (e, t) => {
  t.pattern ?? (t.pattern = u0), zs.init(e, t);
}), y0 = /* @__PURE__ */ $("$ZodCheckUpperCase", (e, t) => {
  t.pattern ?? (t.pattern = f0), zs.init(e, t);
}), b0 = /* @__PURE__ */ $("$ZodCheckIncludes", (e, t) => {
  Zt.init(e, t);
  const r = Rs(t.includes), n = new RegExp(typeof t.position == "number" ? `^.{${t.position}}${r}` : r);
  t.pattern = n, e._zod.onattach.push((s) => {
    const o = s._zod.bag;
    o.patterns ?? (o.patterns = /* @__PURE__ */ new Set()), o.patterns.add(n);
  }), e._zod.check = (s) => {
    s.value.includes(t.includes, t.position) || s.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: t.includes,
      input: s.value,
      inst: e,
      continue: !t.abort
    });
  };
}), v0 = /* @__PURE__ */ $("$ZodCheckStartsWith", (e, t) => {
  Zt.init(e, t);
  const r = new RegExp(`^${Rs(t.prefix)}.*`);
  t.pattern ?? (t.pattern = r), e._zod.onattach.push((n) => {
    const s = n._zod.bag;
    s.patterns ?? (s.patterns = /* @__PURE__ */ new Set()), s.patterns.add(r);
  }), e._zod.check = (n) => {
    n.value.startsWith(t.prefix) || n.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: t.prefix,
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), w0 = /* @__PURE__ */ $("$ZodCheckEndsWith", (e, t) => {
  Zt.init(e, t);
  const r = new RegExp(`.*${Rs(t.suffix)}$`);
  t.pattern ?? (t.pattern = r), e._zod.onattach.push((n) => {
    const s = n._zod.bag;
    s.patterns ?? (s.patterns = /* @__PURE__ */ new Set()), s.patterns.add(r);
  }), e._zod.check = (n) => {
    n.value.endsWith(t.suffix) || n.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: t.suffix,
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), j0 = /* @__PURE__ */ $("$ZodCheckOverwrite", (e, t) => {
  Zt.init(e, t), e._zod.check = (r) => {
    r.value = t.tx(r.value);
  };
});
class C0 {
  constructor(t = []) {
    this.content = [], this.indent = 0, this && (this.args = t);
  }
  indented(t) {
    this.indent += 1, t(this), this.indent -= 1;
  }
  write(t) {
    if (typeof t == "function") {
      t(this, { execution: "sync" }), t(this, { execution: "async" });
      return;
    }
    const n = t.split(`
`).filter((a) => a), s = Math.min(...n.map((a) => a.length - a.trimStart().length)), o = n.map((a) => a.slice(s)).map((a) => " ".repeat(this.indent * 2) + a);
    for (const a of o)
      this.content.push(a);
  }
  compile() {
    const t = Function, r = this == null ? void 0 : this.args, s = [...((this == null ? void 0 : this.content) ?? [""]).map((o) => `  ${o}`)];
    return new t(...r, s.join(`
`));
  }
}
const k0 = {
  major: 4,
  minor: 0,
  patch: 17
}, Ue = /* @__PURE__ */ $("$ZodType", (e, t) => {
  var s;
  var r;
  e ?? (e = {}), e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = k0;
  const n = [...e._zod.def.checks ?? []];
  e._zod.traits.has("$ZodCheck") && n.unshift(e);
  for (const o of n)
    for (const a of o._zod.onattach)
      a(e);
  if (n.length === 0)
    (r = e._zod).deferred ?? (r.deferred = []), (s = e._zod.deferred) == null || s.push(() => {
      e._zod.run = e._zod.parse;
    });
  else {
    const o = (a, l, c) => {
      let d = xn(a), u;
      for (const f of l) {
        if (f._zod.def.when) {
          if (!f._zod.def.when(a))
            continue;
        } else if (d)
          continue;
        const h = a.issues.length, m = f._zod.check(a);
        if (m instanceof Promise && (c == null ? void 0 : c.async) === !1)
          throw new kn();
        if (u || m instanceof Promise)
          u = (u ?? Promise.resolve()).then(async () => {
            await m, a.issues.length !== h && (d || (d = xn(a, h)));
          });
        else {
          if (a.issues.length === h)
            continue;
          d || (d = xn(a, h));
        }
      }
      return u ? u.then(() => a) : a;
    };
    e._zod.run = (a, l) => {
      const c = e._zod.parse(a, l);
      if (c instanceof Promise) {
        if (l.async === !1)
          throw new kn();
        return c.then((d) => o(d, n, l));
      }
      return o(c, n, l);
    };
  }
  e["~standard"] = {
    validate: (o) => {
      var a;
      try {
        const l = Ly(e, o);
        return l.success ? { value: l.data } : { issues: (a = l.error) == null ? void 0 : a.issues };
      } catch {
        return By(e, o).then((c) => {
          var d;
          return c.success ? { value: c.data } : { issues: (d = c.error) == null ? void 0 : d.issues };
        });
      }
    },
    vendor: "zod",
    version: 1
  };
}), Bo = /* @__PURE__ */ $("$ZodString", (e, t) => {
  var r;
  Ue.init(e, t), e._zod.pattern = [...((r = e == null ? void 0 : e._zod.bag) == null ? void 0 : r.patterns) ?? []].pop() ?? c0(e._zod.bag), e._zod.parse = (n, s) => {
    if (t.coerce)
      try {
        n.value = String(n.value);
      } catch {
      }
    return typeof n.value == "string" || n.issues.push({
      expected: "string",
      code: "invalid_type",
      input: n.value,
      inst: e
    }), n;
  };
}), _e = /* @__PURE__ */ $("$ZodStringFormat", (e, t) => {
  zs.init(e, t), Bo.init(e, t);
}), S0 = /* @__PURE__ */ $("$ZodGUID", (e, t) => {
  t.pattern ?? (t.pattern = Gy), _e.init(e, t);
}), _0 = /* @__PURE__ */ $("$ZodUUID", (e, t) => {
  if (t.version) {
    const n = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    }[t.version];
    if (n === void 0)
      throw new Error(`Invalid UUID version: "${t.version}"`);
    t.pattern ?? (t.pattern = $l(n));
  } else
    t.pattern ?? (t.pattern = $l());
  _e.init(e, t);
}), T0 = /* @__PURE__ */ $("$ZodEmail", (e, t) => {
  t.pattern ?? (t.pattern = Ky), _e.init(e, t);
}), E0 = /* @__PURE__ */ $("$ZodURL", (e, t) => {
  _e.init(e, t), e._zod.check = (r) => {
    try {
      const n = r.value.trim(), s = new URL(n);
      t.hostname && (t.hostname.lastIndex = 0, t.hostname.test(s.hostname) || r.issues.push({
        code: "invalid_format",
        format: "url",
        note: "Invalid hostname",
        pattern: s0.source,
        input: r.value,
        inst: e,
        continue: !t.abort
      })), t.protocol && (t.protocol.lastIndex = 0, t.protocol.test(s.protocol.endsWith(":") ? s.protocol.slice(0, -1) : s.protocol) || r.issues.push({
        code: "invalid_format",
        format: "url",
        note: "Invalid protocol",
        pattern: t.protocol.source,
        input: r.value,
        inst: e,
        continue: !t.abort
      })), t.normalize ? r.value = s.href : r.value = n;
      return;
    } catch {
      r.issues.push({
        code: "invalid_format",
        format: "url",
        input: r.value,
        inst: e,
        continue: !t.abort
      });
    }
  };
}), R0 = /* @__PURE__ */ $("$ZodEmoji", (e, t) => {
  t.pattern ?? (t.pattern = Jy()), _e.init(e, t);
}), A0 = /* @__PURE__ */ $("$ZodNanoID", (e, t) => {
  t.pattern ?? (t.pattern = Hy), _e.init(e, t);
}), z0 = /* @__PURE__ */ $("$ZodCUID", (e, t) => {
  t.pattern ?? (t.pattern = Oy), _e.init(e, t);
}), P0 = /* @__PURE__ */ $("$ZodCUID2", (e, t) => {
  t.pattern ?? (t.pattern = qy), _e.init(e, t);
}), N0 = /* @__PURE__ */ $("$ZodULID", (e, t) => {
  t.pattern ?? (t.pattern = Wy), _e.init(e, t);
}), F0 = /* @__PURE__ */ $("$ZodXID", (e, t) => {
  t.pattern ?? (t.pattern = Uy), _e.init(e, t);
}), D0 = /* @__PURE__ */ $("$ZodKSUID", (e, t) => {
  t.pattern ?? (t.pattern = Zy), _e.init(e, t);
}), $0 = /* @__PURE__ */ $("$ZodISODateTime", (e, t) => {
  t.pattern ?? (t.pattern = l0(t)), _e.init(e, t);
}), M0 = /* @__PURE__ */ $("$ZodISODate", (e, t) => {
  t.pattern ?? (t.pattern = o0), _e.init(e, t);
}), I0 = /* @__PURE__ */ $("$ZodISOTime", (e, t) => {
  t.pattern ?? (t.pattern = a0(t)), _e.init(e, t);
}), V0 = /* @__PURE__ */ $("$ZodISODuration", (e, t) => {
  t.pattern ?? (t.pattern = Yy), _e.init(e, t);
}), L0 = /* @__PURE__ */ $("$ZodIPv4", (e, t) => {
  t.pattern ?? (t.pattern = Qy), _e.init(e, t), e._zod.onattach.push((r) => {
    const n = r._zod.bag;
    n.format = "ipv4";
  });
}), B0 = /* @__PURE__ */ $("$ZodIPv6", (e, t) => {
  t.pattern ?? (t.pattern = e0), _e.init(e, t), e._zod.onattach.push((r) => {
    const n = r._zod.bag;
    n.format = "ipv6";
  }), e._zod.check = (r) => {
    try {
      new URL(`http://[${r.value}]`);
    } catch {
      r.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: r.value,
        inst: e,
        continue: !t.abort
      });
    }
  };
}), O0 = /* @__PURE__ */ $("$ZodCIDRv4", (e, t) => {
  t.pattern ?? (t.pattern = t0), _e.init(e, t);
}), q0 = /* @__PURE__ */ $("$ZodCIDRv6", (e, t) => {
  t.pattern ?? (t.pattern = r0), _e.init(e, t), e._zod.check = (r) => {
    const [n, s] = r.value.split("/");
    try {
      if (!s)
        throw new Error();
      const o = Number(s);
      if (`${o}` !== s)
        throw new Error();
      if (o < 0 || o > 128)
        throw new Error();
      new URL(`http://[${n}]`);
    } catch {
      r.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: r.value,
        inst: e,
        continue: !t.abort
      });
    }
  };
});
function mu(e) {
  if (e === "")
    return !0;
  if (e.length % 4 !== 0)
    return !1;
  try {
    return atob(e), !0;
  } catch {
    return !1;
  }
}
const W0 = /* @__PURE__ */ $("$ZodBase64", (e, t) => {
  t.pattern ?? (t.pattern = n0), _e.init(e, t), e._zod.onattach.push((r) => {
    r._zod.bag.contentEncoding = "base64";
  }), e._zod.check = (r) => {
    mu(r.value) || r.issues.push({
      code: "invalid_format",
      format: "base64",
      input: r.value,
      inst: e,
      continue: !t.abort
    });
  };
});
function U0(e) {
  if (!fu.test(e))
    return !1;
  const t = e.replace(/[-_]/g, (n) => n === "-" ? "+" : "/"), r = t.padEnd(Math.ceil(t.length / 4) * 4, "=");
  return mu(r);
}
const Z0 = /* @__PURE__ */ $("$ZodBase64URL", (e, t) => {
  t.pattern ?? (t.pattern = fu), _e.init(e, t), e._zod.onattach.push((r) => {
    r._zod.bag.contentEncoding = "base64url";
  }), e._zod.check = (r) => {
    U0(r.value) || r.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: r.value,
      inst: e,
      continue: !t.abort
    });
  };
}), H0 = /* @__PURE__ */ $("$ZodE164", (e, t) => {
  t.pattern ?? (t.pattern = i0), _e.init(e, t);
});
function Y0(e, t = null) {
  try {
    const r = e.split(".");
    if (r.length !== 3)
      return !1;
    const [n] = r;
    if (!n)
      return !1;
    const s = JSON.parse(atob(n));
    return !("typ" in s && (s == null ? void 0 : s.typ) !== "JWT" || !s.alg || t && (!("alg" in s) || s.alg !== t));
  } catch {
    return !1;
  }
}
const G0 = /* @__PURE__ */ $("$ZodJWT", (e, t) => {
  _e.init(e, t), e._zod.check = (r) => {
    Y0(r.value, t.alg) || r.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: r.value,
      inst: e,
      continue: !t.abort
    });
  };
}), K0 = /* @__PURE__ */ $("$ZodBoolean", (e, t) => {
  Ue.init(e, t), e._zod.pattern = d0, e._zod.parse = (r, n) => {
    if (t.coerce)
      try {
        r.value = !!r.value;
      } catch {
      }
    const s = r.value;
    return typeof s == "boolean" || r.issues.push({
      expected: "boolean",
      code: "invalid_type",
      input: s,
      inst: e
    }), r;
  };
}), X0 = /* @__PURE__ */ $("$ZodUnknown", (e, t) => {
  Ue.init(e, t), e._zod.parse = (r) => r;
}), J0 = /* @__PURE__ */ $("$ZodNever", (e, t) => {
  Ue.init(e, t), e._zod.parse = (r, n) => (r.issues.push({
    expected: "never",
    code: "invalid_type",
    input: r.value,
    inst: e
  }), r);
});
function Ml(e, t, r) {
  e.issues.length && t.issues.push(...ou(r, e.issues)), t.value[r] = e.value;
}
const Q0 = /* @__PURE__ */ $("$ZodArray", (e, t) => {
  Ue.init(e, t), e._zod.parse = (r, n) => {
    const s = r.value;
    if (!Array.isArray(s))
      return r.issues.push({
        expected: "array",
        code: "invalid_type",
        input: s,
        inst: e
      }), r;
    r.value = Array(s.length);
    const o = [];
    for (let a = 0; a < s.length; a++) {
      const l = s[a], c = t.element._zod.run({
        value: l,
        issues: []
      }, n);
      c instanceof Promise ? o.push(c.then((d) => Ml(d, r, a))) : Ml(c, r, a);
    }
    return o.length ? Promise.all(o).then(() => r) : r;
  };
});
function Bn(e, t, r, n) {
  e.issues.length && t.issues.push(...ou(r, e.issues)), e.value === void 0 ? r in n && (t.value[r] = void 0) : t.value[r] = e.value;
}
const eb = /* @__PURE__ */ $("$ZodObject", (e, t) => {
  Ue.init(e, t);
  const r = nu(() => {
    const f = Object.keys(t.shape);
    for (const m of f)
      if (!t.shape[m]._zod.traits.has("$ZodType"))
        throw new Error(`Invalid element at key "${m}": expected a Zod schema`);
    const h = Ry(t.shape);
    return {
      shape: t.shape,
      keys: f,
      keySet: new Set(f),
      numKeys: f.length,
      optionalKeys: new Set(h)
    };
  });
  we(e._zod, "propValues", () => {
    const f = t.shape, h = {};
    for (const m in f) {
      const g = f[m]._zod;
      if (g.values) {
        h[m] ?? (h[m] = /* @__PURE__ */ new Set());
        for (const p of g.values)
          h[m].add(p);
      }
    }
    return h;
  });
  const n = (f) => {
    const h = new C0(["shape", "payload", "ctx"]), m = r.value, g = (x) => {
      const b = Dl(x);
      return `shape[${b}]._zod.run({ value: input[${b}], issues: [] }, ctx)`;
    };
    h.write("const input = payload.value;");
    const p = /* @__PURE__ */ Object.create(null);
    let y = 0;
    for (const x of m.keys)
      p[x] = `key_${y++}`;
    h.write("const newResult = {}");
    for (const x of m.keys) {
      const b = p[x], k = Dl(x);
      h.write(`const ${b} = ${g(x)};`), h.write(`
        if (${b}.issues.length) {
          payload.issues = payload.issues.concat(${b}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${b}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${b}.value;
        }
      `);
    }
    h.write("payload.value = newResult;"), h.write("return payload;");
    const j = h.compile();
    return (x, b) => j(f, x, b);
  };
  let s;
  const o = Ai, a = !ru.jitless, c = a && Ty.value, d = t.catchall;
  let u;
  e._zod.parse = (f, h) => {
    u ?? (u = r.value);
    const m = f.value;
    if (!o(m))
      return f.issues.push({
        expected: "object",
        code: "invalid_type",
        input: m,
        inst: e
      }), f;
    const g = [];
    if (a && c && (h == null ? void 0 : h.async) === !1 && h.jitless !== !0)
      s || (s = n(t.shape)), f = s(f, h);
    else {
      f.value = {};
      const b = u.shape;
      for (const k of u.keys) {
        const R = b[k]._zod.run({ value: m[k], issues: [] }, h);
        R instanceof Promise ? g.push(R.then((C) => Bn(C, f, k, m))) : Bn(R, f, k, m);
      }
    }
    if (!d)
      return g.length ? Promise.all(g).then(() => f) : f;
    const p = [], y = u.keySet, j = d._zod, x = j.def.type;
    for (const b of Object.keys(m)) {
      if (y.has(b))
        continue;
      if (x === "never") {
        p.push(b);
        continue;
      }
      const k = j.run({ value: m[b], issues: [] }, h);
      k instanceof Promise ? g.push(k.then((A) => Bn(A, f, b, m))) : Bn(k, f, b, m);
    }
    return p.length && f.issues.push({
      code: "unrecognized_keys",
      keys: p,
      input: m,
      inst: e
    }), g.length ? Promise.all(g).then(() => f) : f;
  };
});
function Il(e, t, r, n) {
  for (const o of e)
    if (o.issues.length === 0)
      return t.value = o.value, t;
  const s = e.filter((o) => !xn(o));
  return s.length === 1 ? (t.value = s[0].value, s[0]) : (t.issues.push({
    code: "invalid_union",
    input: t.value,
    inst: r,
    errors: e.map((o) => o.issues.map((a) => br(a, n, yr())))
  }), t);
}
const tb = /* @__PURE__ */ $("$ZodUnion", (e, t) => {
  Ue.init(e, t), we(e._zod, "optin", () => t.options.some((s) => s._zod.optin === "optional") ? "optional" : void 0), we(e._zod, "optout", () => t.options.some((s) => s._zod.optout === "optional") ? "optional" : void 0), we(e._zod, "values", () => {
    if (t.options.every((s) => s._zod.values))
      return new Set(t.options.flatMap((s) => Array.from(s._zod.values)));
  }), we(e._zod, "pattern", () => {
    if (t.options.every((s) => s._zod.pattern)) {
      const s = t.options.map((o) => o._zod.pattern);
      return new RegExp(`^(${s.map((o) => Io(o.source)).join("|")})$`);
    }
  });
  const r = t.options.length === 1, n = t.options[0]._zod.run;
  e._zod.parse = (s, o) => {
    if (r)
      return n(s, o);
    let a = !1;
    const l = [];
    for (const c of t.options) {
      const d = c._zod.run({
        value: s.value,
        issues: []
      }, o);
      if (d instanceof Promise)
        l.push(d), a = !0;
      else {
        if (d.issues.length === 0)
          return d;
        l.push(d);
      }
    }
    return a ? Promise.all(l).then((c) => Il(c, s, e, o)) : Il(l, s, e, o);
  };
}), rb = /* @__PURE__ */ $("$ZodIntersection", (e, t) => {
  Ue.init(e, t), e._zod.parse = (r, n) => {
    const s = r.value, o = t.left._zod.run({ value: s, issues: [] }, n), a = t.right._zod.run({ value: s, issues: [] }, n);
    return o instanceof Promise || a instanceof Promise ? Promise.all([o, a]).then(([c, d]) => Vl(r, c, d)) : Vl(r, o, a);
  };
});
function zi(e, t) {
  if (e === t)
    return { valid: !0, data: e };
  if (e instanceof Date && t instanceof Date && +e == +t)
    return { valid: !0, data: e };
  if (us(e) && us(t)) {
    const r = Object.keys(t), n = Object.keys(e).filter((o) => r.indexOf(o) !== -1), s = { ...e, ...t };
    for (const o of n) {
      const a = zi(e[o], t[o]);
      if (!a.valid)
        return {
          valid: !1,
          mergeErrorPath: [o, ...a.mergeErrorPath]
        };
      s[o] = a.data;
    }
    return { valid: !0, data: s };
  }
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length)
      return { valid: !1, mergeErrorPath: [] };
    const r = [];
    for (let n = 0; n < e.length; n++) {
      const s = e[n], o = t[n], a = zi(s, o);
      if (!a.valid)
        return {
          valid: !1,
          mergeErrorPath: [n, ...a.mergeErrorPath]
        };
      r.push(a.data);
    }
    return { valid: !0, data: r };
  }
  return { valid: !1, mergeErrorPath: [] };
}
function Vl(e, t, r) {
  if (t.issues.length && e.issues.push(...t.issues), r.issues.length && e.issues.push(...r.issues), xn(e))
    return e;
  const n = zi(t.value, r.value);
  if (!n.valid)
    throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(n.mergeErrorPath)}`);
  return e.value = n.data, e;
}
const nb = /* @__PURE__ */ $("$ZodEnum", (e, t) => {
  Ue.init(e, t);
  const r = Sy(t.entries), n = new Set(r);
  e._zod.values = n, e._zod.pattern = new RegExp(`^(${r.filter((s) => Ey.has(typeof s)).map((s) => typeof s == "string" ? Rs(s) : s.toString()).join("|")})$`), e._zod.parse = (s, o) => {
    const a = s.value;
    return n.has(a) || s.issues.push({
      code: "invalid_value",
      values: r,
      input: a,
      inst: e
    }), s;
  };
}), sb = /* @__PURE__ */ $("$ZodTransform", (e, t) => {
  Ue.init(e, t), e._zod.parse = (r, n) => {
    const s = t.transform(r.value, r);
    if (n.async)
      return (s instanceof Promise ? s : Promise.resolve(s)).then((a) => (r.value = a, r));
    if (s instanceof Promise)
      throw new kn();
    return r.value = s, r;
  };
});
function Ll(e, t) {
  return e.issues.length && t === void 0 ? { issues: [], value: void 0 } : e;
}
const ib = /* @__PURE__ */ $("$ZodOptional", (e, t) => {
  Ue.init(e, t), e._zod.optin = "optional", e._zod.optout = "optional", we(e._zod, "values", () => t.innerType._zod.values ? /* @__PURE__ */ new Set([...t.innerType._zod.values, void 0]) : void 0), we(e._zod, "pattern", () => {
    const r = t.innerType._zod.pattern;
    return r ? new RegExp(`^(${Io(r.source)})?$`) : void 0;
  }), e._zod.parse = (r, n) => {
    if (t.innerType._zod.optin === "optional") {
      const s = t.innerType._zod.run(r, n);
      return s instanceof Promise ? s.then((o) => Ll(o, r.value)) : Ll(s, r.value);
    }
    return r.value === void 0 ? r : t.innerType._zod.run(r, n);
  };
}), ob = /* @__PURE__ */ $("$ZodNullable", (e, t) => {
  Ue.init(e, t), we(e._zod, "optin", () => t.innerType._zod.optin), we(e._zod, "optout", () => t.innerType._zod.optout), we(e._zod, "pattern", () => {
    const r = t.innerType._zod.pattern;
    return r ? new RegExp(`^(${Io(r.source)}|null)$`) : void 0;
  }), we(e._zod, "values", () => t.innerType._zod.values ? /* @__PURE__ */ new Set([...t.innerType._zod.values, null]) : void 0), e._zod.parse = (r, n) => r.value === null ? r : t.innerType._zod.run(r, n);
}), ab = /* @__PURE__ */ $("$ZodDefault", (e, t) => {
  Ue.init(e, t), e._zod.optin = "optional", we(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (r, n) => {
    if (r.value === void 0)
      return r.value = t.defaultValue, r;
    const s = t.innerType._zod.run(r, n);
    return s instanceof Promise ? s.then((o) => Bl(o, t)) : Bl(s, t);
  };
});
function Bl(e, t) {
  return e.value === void 0 && (e.value = t.defaultValue), e;
}
const lb = /* @__PURE__ */ $("$ZodPrefault", (e, t) => {
  Ue.init(e, t), e._zod.optin = "optional", we(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (r, n) => (r.value === void 0 && (r.value = t.defaultValue), t.innerType._zod.run(r, n));
}), cb = /* @__PURE__ */ $("$ZodNonOptional", (e, t) => {
  Ue.init(e, t), we(e._zod, "values", () => {
    const r = t.innerType._zod.values;
    return r ? new Set([...r].filter((n) => n !== void 0)) : void 0;
  }), e._zod.parse = (r, n) => {
    const s = t.innerType._zod.run(r, n);
    return s instanceof Promise ? s.then((o) => Ol(o, e)) : Ol(s, e);
  };
});
function Ol(e, t) {
  return !e.issues.length && e.value === void 0 && e.issues.push({
    code: "invalid_type",
    expected: "nonoptional",
    input: e.value,
    inst: t
  }), e;
}
const db = /* @__PURE__ */ $("$ZodCatch", (e, t) => {
  Ue.init(e, t), we(e._zod, "optin", () => t.innerType._zod.optin), we(e._zod, "optout", () => t.innerType._zod.optout), we(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (r, n) => {
    const s = t.innerType._zod.run(r, n);
    return s instanceof Promise ? s.then((o) => (r.value = o.value, o.issues.length && (r.value = t.catchValue({
      ...r,
      error: {
        issues: o.issues.map((a) => br(a, n, yr()))
      },
      input: r.value
    }), r.issues = []), r)) : (r.value = s.value, s.issues.length && (r.value = t.catchValue({
      ...r,
      error: {
        issues: s.issues.map((o) => br(o, n, yr()))
      },
      input: r.value
    }), r.issues = []), r);
  };
}), ub = /* @__PURE__ */ $("$ZodPipe", (e, t) => {
  Ue.init(e, t), we(e._zod, "values", () => t.in._zod.values), we(e._zod, "optin", () => t.in._zod.optin), we(e._zod, "optout", () => t.out._zod.optout), we(e._zod, "propValues", () => t.in._zod.propValues), e._zod.parse = (r, n) => {
    const s = t.in._zod.run(r, n);
    return s instanceof Promise ? s.then((o) => ql(o, t, n)) : ql(s, t, n);
  };
});
function ql(e, t, r) {
  return e.issues.length ? e : t.out._zod.run({ value: e.value, issues: e.issues }, r);
}
const fb = /* @__PURE__ */ $("$ZodReadonly", (e, t) => {
  Ue.init(e, t), we(e._zod, "propValues", () => t.innerType._zod.propValues), we(e._zod, "values", () => t.innerType._zod.values), we(e._zod, "optin", () => t.innerType._zod.optin), we(e._zod, "optout", () => t.innerType._zod.optout), e._zod.parse = (r, n) => {
    const s = t.innerType._zod.run(r, n);
    return s instanceof Promise ? s.then(Wl) : Wl(s);
  };
});
function Wl(e) {
  return e.value = Object.freeze(e.value), e;
}
const hb = /* @__PURE__ */ $("$ZodCustom", (e, t) => {
  Zt.init(e, t), Ue.init(e, t), e._zod.parse = (r, n) => r, e._zod.check = (r) => {
    const n = r.value, s = t.fn(n);
    if (s instanceof Promise)
      return s.then((o) => Ul(o, r, n, e));
    Ul(s, r, n, e);
  };
});
function Ul(e, t, r, n) {
  if (!e) {
    const s = {
      code: "custom",
      input: r,
      inst: n,
      // incorporates params.error into issue reporting
      path: [...n._zod.def.path ?? []],
      // incorporates params.error into issue reporting
      continue: !n._zod.def.abort
      // params: inst._zod.def.params,
    };
    n._zod.def.params && (s.params = n._zod.def.params), t.issues.push(Sn(s));
  }
}
class pb {
  constructor() {
    this._map = /* @__PURE__ */ new Map(), this._idmap = /* @__PURE__ */ new Map();
  }
  add(t, ...r) {
    const n = r[0];
    if (this._map.set(t, n), n && typeof n == "object" && "id" in n) {
      if (this._idmap.has(n.id))
        throw new Error(`ID ${n.id} already exists in the registry`);
      this._idmap.set(n.id, t);
    }
    return this;
  }
  clear() {
    return this._map = /* @__PURE__ */ new Map(), this._idmap = /* @__PURE__ */ new Map(), this;
  }
  remove(t) {
    const r = this._map.get(t);
    return r && typeof r == "object" && "id" in r && this._idmap.delete(r.id), this._map.delete(t), this;
  }
  get(t) {
    const r = t._zod.parent;
    if (r) {
      const n = { ...this.get(r) ?? {} };
      delete n.id;
      const s = { ...n, ...this._map.get(t) };
      return Object.keys(s).length ? s : void 0;
    }
    return this._map.get(t);
  }
  has(t) {
    return this._map.has(t);
  }
}
function mb() {
  return new pb();
}
const On = /* @__PURE__ */ mb();
function gb(e, t) {
  return new e({
    type: "string",
    ...te(t)
  });
}
function xb(e, t) {
  return new e({
    type: "string",
    format: "email",
    check: "string_format",
    abort: !1,
    ...te(t)
  });
}
function Zl(e, t) {
  return new e({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: !1,
    ...te(t)
  });
}
function yb(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    ...te(t)
  });
}
function bb(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v4",
    ...te(t)
  });
}
function vb(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v6",
    ...te(t)
  });
}
function wb(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v7",
    ...te(t)
  });
}
function jb(e, t) {
  return new e({
    type: "string",
    format: "url",
    check: "string_format",
    abort: !1,
    ...te(t)
  });
}
function Cb(e, t) {
  return new e({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: !1,
    ...te(t)
  });
}
function kb(e, t) {
  return new e({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: !1,
    ...te(t)
  });
}
function Sb(e, t) {
  return new e({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: !1,
    ...te(t)
  });
}
function _b(e, t) {
  return new e({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: !1,
    ...te(t)
  });
}
function Tb(e, t) {
  return new e({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: !1,
    ...te(t)
  });
}
function Eb(e, t) {
  return new e({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: !1,
    ...te(t)
  });
}
function Rb(e, t) {
  return new e({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: !1,
    ...te(t)
  });
}
function Ab(e, t) {
  return new e({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: !1,
    ...te(t)
  });
}
function zb(e, t) {
  return new e({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: !1,
    ...te(t)
  });
}
function Pb(e, t) {
  return new e({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: !1,
    ...te(t)
  });
}
function Nb(e, t) {
  return new e({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: !1,
    ...te(t)
  });
}
function Fb(e, t) {
  return new e({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: !1,
    ...te(t)
  });
}
function Db(e, t) {
  return new e({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: !1,
    ...te(t)
  });
}
function $b(e, t) {
  return new e({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: !1,
    ...te(t)
  });
}
function Mb(e, t) {
  return new e({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: !1,
    ...te(t)
  });
}
function Ib(e, t) {
  return new e({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: !1,
    local: !1,
    precision: null,
    ...te(t)
  });
}
function Vb(e, t) {
  return new e({
    type: "string",
    format: "date",
    check: "string_format",
    ...te(t)
  });
}
function Lb(e, t) {
  return new e({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...te(t)
  });
}
function Bb(e, t) {
  return new e({
    type: "string",
    format: "duration",
    check: "string_format",
    ...te(t)
  });
}
function Ob(e, t) {
  return new e({
    type: "boolean",
    ...te(t)
  });
}
function qb(e) {
  return new e({
    type: "unknown"
  });
}
function Wb(e, t) {
  return new e({
    type: "never",
    ...te(t)
  });
}
function gu(e, t) {
  return new h0({
    check: "max_length",
    ...te(t),
    maximum: e
  });
}
function fs(e, t) {
  return new p0({
    check: "min_length",
    ...te(t),
    minimum: e
  });
}
function xu(e, t) {
  return new m0({
    check: "length_equals",
    ...te(t),
    length: e
  });
}
function Ub(e, t) {
  return new g0({
    check: "string_format",
    format: "regex",
    ...te(t),
    pattern: e
  });
}
function Zb(e) {
  return new x0({
    check: "string_format",
    format: "lowercase",
    ...te(e)
  });
}
function Hb(e) {
  return new y0({
    check: "string_format",
    format: "uppercase",
    ...te(e)
  });
}
function Yb(e, t) {
  return new b0({
    check: "string_format",
    format: "includes",
    ...te(t),
    includes: e
  });
}
function Gb(e, t) {
  return new v0({
    check: "string_format",
    format: "starts_with",
    ...te(t),
    prefix: e
  });
}
function Kb(e, t) {
  return new w0({
    check: "string_format",
    format: "ends_with",
    ...te(t),
    suffix: e
  });
}
function Pn(e) {
  return new j0({
    check: "overwrite",
    tx: e
  });
}
function Xb(e) {
  return Pn((t) => t.normalize(e));
}
function Jb() {
  return Pn((e) => e.trim());
}
function Qb() {
  return Pn((e) => e.toLowerCase());
}
function ev() {
  return Pn((e) => e.toUpperCase());
}
function tv(e, t, r) {
  return new e({
    type: "array",
    element: t,
    // get element() {
    //   return element;
    // },
    ...te(r)
  });
}
function rv(e, t, r) {
  return new e({
    type: "custom",
    check: "custom",
    fn: t,
    ...te(r)
  });
}
function nv(e) {
  const t = sv((r) => (r.addIssue = (n) => {
    if (typeof n == "string")
      r.issues.push(Sn(n, r.value, t._zod.def));
    else {
      const s = n;
      s.fatal && (s.continue = !1), s.code ?? (s.code = "custom"), s.input ?? (s.input = r.value), s.inst ?? (s.inst = t), s.continue ?? (s.continue = !t._zod.def.abort), r.issues.push(Sn(s));
    }
  }, e(r.value, r)));
  return t;
}
function sv(e, t) {
  const r = new Zt({
    check: "custom",
    ...te(t)
  });
  return r._zod.check = e, r;
}
function Hl(e, t) {
  try {
    var r = e();
  } catch (n) {
    return t(n);
  }
  return r && r.then ? r.then(void 0, t) : r;
}
function iv(e, t) {
  for (var r = {}; e.length; ) {
    var n = e[0], s = n.code, o = n.message, a = n.path.join(".");
    if (!r[a]) if ("unionErrors" in n) {
      var l = n.unionErrors[0].errors[0];
      r[a] = { message: l.message, type: l.code };
    } else r[a] = { message: o, type: s };
    if ("unionErrors" in n && n.unionErrors.forEach(function(u) {
      return u.errors.forEach(function(f) {
        return e.push(f);
      });
    }), t) {
      var c = r[a].types, d = c && c[n.code];
      r[a] = jo(a, t, r, s, d ? [].concat(d, n.message) : n.message);
    }
    e.shift();
  }
  return r;
}
function ov(e, t) {
  for (var r = {}; e.length; ) {
    var n = e[0], s = n.code, o = n.message, a = n.path.join(".");
    if (!r[a]) if (n.code === "invalid_union" && n.errors.length > 0) {
      var l = n.errors[0][0];
      r[a] = { message: l.message, type: l.code };
    } else r[a] = { message: o, type: s };
    if (n.code === "invalid_union" && n.errors.forEach(function(u) {
      return u.forEach(function(f) {
        return e.push(f);
      });
    }), t) {
      var c = r[a].types, d = c && c[n.code];
      r[a] = jo(a, t, r, s, d ? [].concat(d, n.message) : n.message);
    }
    e.shift();
  }
  return r;
}
function av(e, t, r) {
  if (r === void 0 && (r = {}), (function(n) {
    return "_def" in n && typeof n._def == "object" && "typeName" in n._def;
  })(e)) return function(n, s, o) {
    try {
      return Promise.resolve(Hl(function() {
        return Promise.resolve(e[r.mode === "sync" ? "parse" : "parseAsync"](n, t)).then(function(a) {
          return o.shouldUseNativeValidation && Ei({}, o), { errors: {}, values: r.raw ? Object.assign({}, n) : a };
        });
      }, function(a) {
        if ((function(l) {
          return Array.isArray(l == null ? void 0 : l.issues);
        })(a)) return { values: {}, errors: Pl(iv(a.errors, !o.shouldUseNativeValidation && o.criteriaMode === "all"), o) };
        throw a;
      }));
    } catch (a) {
      return Promise.reject(a);
    }
  };
  if ((function(n) {
    return "_zod" in n && typeof n._zod == "object";
  })(e)) return function(n, s, o) {
    try {
      return Promise.resolve(Hl(function() {
        return Promise.resolve((r.mode === "sync" ? Iy : Vy)(e, n, t)).then(function(a) {
          return o.shouldUseNativeValidation && Ei({}, o), { errors: {}, values: r.raw ? Object.assign({}, n) : a };
        });
      }, function(a) {
        if ((function(l) {
          return l instanceof Lo;
        })(a)) return { values: {}, errors: Pl(ov(a.issues, !o.shouldUseNativeValidation && o.criteriaMode === "all"), o) };
        throw a;
      }));
    } catch (a) {
      return Promise.reject(a);
    }
  };
  throw new Error("Invalid input: not a Zod schema");
}
const Oo = Ut({});
function lv({
  children: e,
  onSubmit: t,
  schema: r,
  defaultValues: n,
  className: s = "",
  size: o = "md",
  variant: a = "default",
  methods: l
}) {
  const c = Ox({
    defaultValues: n,
    resolver: r ? av(r) : void 0
  }), d = l || c;
  return /* @__PURE__ */ i.jsx(Sx, { ...d, children: /* @__PURE__ */ i.jsx(Oo.Provider, { value: { size: o, variant: a }, children: /* @__PURE__ */ i.jsx(
    "form",
    {
      onSubmit: d.handleSubmit(t),
      className: `form ${s}`,
      noValidate: !0,
      children: e
    }
  ) }) });
}
const qn = ({
  name: e,
  label: t,
  help: r,
  required: n,
  children: s,
  className: o = "",
  horizontal: a = !1,
  labelAlign: l = "left"
}) => {
  var g, p;
  const c = Xr(), d = (p = (g = c == null ? void 0 : c.formState) == null ? void 0 : g.errors) == null ? void 0 : p[e], u = a ? "field is-horizontal" : "field", f = a ? "field-label" : "", h = a ? "field-body" : "", m = `text-${l}`;
  return /* @__PURE__ */ i.jsxs("div", { className: `${u} ${o}`, children: [
    t && /* @__PURE__ */ i.jsx("div", { className: f, children: /* @__PURE__ */ i.jsxs(
      "label",
      {
        className: `label block w-full ${m}`,
        htmlFor: e,
        style: { textAlign: l, fontSize: "0.875rem" },
        children: [
          t,
          n && /* @__PURE__ */ i.jsx("span", { className: "text-red-500 ml-1", children: "*" })
        ]
      }
    ) }),
    /* @__PURE__ */ i.jsx("div", { className: h, children: /* @__PURE__ */ i.jsxs("div", { className: "field", children: [
      /* @__PURE__ */ i.jsx("div", { className: "control", children: s }),
      r && !d && /* @__PURE__ */ i.jsx("p", { className: "help text-gray-500", children: r }),
      d && /* @__PURE__ */ i.jsx("p", { className: "help text-red-500", children: typeof d == "object" && d !== null && "message" in d ? d.message : "This field is invalid" })
    ] }) })
  ] });
}, l1 = ({
  children: e,
  leftIcon: t,
  rightIcon: r,
  loading: n = !1,
  className: s = ""
}) => {
  const a = [
    "control",
    (t || r) && "has-icons",
    t && "has-icons-left",
    r && "has-icons-right",
    n && "is-loading",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsxs("div", { className: a, children: [
    e,
    t && /* @__PURE__ */ i.jsx("span", { className: "icon is-left", children: t }),
    r && /* @__PURE__ */ i.jsx("span", { className: "icon is-right", children: r })
  ] });
}, cv = ({
  name: e,
  options: t,
  placeholder: r,
  multiple: n = !1,
  size: s,
  loading: o = !1,
  disabled: a = !1,
  rules: l,
  className: c = "",
  fullWidth: d = !1
}) => {
  const u = Xr(), f = u == null ? void 0 : u.register, { size: h, variant: m } = ke(Oo), g = {
    sm: "text-sm py-1 pl-2 pr-7",
    md: "text-base py-2 pl-3 pr-8",
    lg: "text-lg py-3 pl-4 pr-9"
  }, p = {
    default: "border-0 border-b border-gray-400 focus:border-blue-500",
    bordered: "border-2 border-gray-400 focus:border-blue-500",
    filled: "bg-gray-100 border-transparent focus:bg-white focus:border-blue-500"
  }, y = [
    "select",
    g[h || "md"],
    p[m || "default"],
    "rounded-none",
    "bg-transparent",
    "transition-colors",
    "focus:outline-none",
    "focus:ring-0",
    d && "w-full",
    a && "opacity-50 cursor-not-allowed",
    c
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("div", { className: `select-wrapper ${o ? "is-loading" : ""}`, children: /* @__PURE__ */ i.jsxs(
    "select",
    {
      ...f ? f(e, l) : { name: e },
      multiple: n,
      size: s,
      disabled: a || o,
      className: y,
      children: [
        r && /* @__PURE__ */ i.jsx("option", { value: "", disabled: !0, children: r }),
        t.map((j) => /* @__PURE__ */ i.jsx(
          "option",
          {
            value: j.value,
            disabled: j.disabled,
            children: j.label
          },
          j.value
        ))
      ]
    }
  ) });
}, dv = ({
  name: e,
  label: t,
  value: r,
  disabled: n = !1,
  rules: s,
  className: o = "",
  size: a = "md",
  checked: l,
  onChange: c
}) => {
  let d = null;
  try {
    const p = Xr();
    d = p == null ? void 0 : p.register;
  } catch {
  }
  const { size: u } = ke(Oo), f = a || u || "md", h = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  }, m = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }, g = (p) => {
    c && c(p.target.checked);
  };
  return /* @__PURE__ */ i.jsxs("label", { className: `inline-flex items-center gap-2 cursor-pointer ${n ? "cursor-not-allowed opacity-50" : ""} ${o}`, children: [
    d && e ? (
      // Form mode: use register
      /* @__PURE__ */ i.jsx(
        "input",
        {
          type: "checkbox",
          ...d(e, s),
          value: r,
          disabled: n,
          className: `
            ${h[f]}
            rounded 
            border-gray-300 
            text-blue-600 
            focus:ring-0 
            focus:outline-none
            disabled:opacity-50
            disabled:cursor-not-allowed
            cursor-pointer
          `
        }
      )
    ) : (
      // Standalone mode: use checked and onChange
      /* @__PURE__ */ i.jsx(
        "input",
        {
          type: "checkbox",
          checked: l,
          onChange: g,
          value: r,
          disabled: n,
          className: `
            ${h[f]}
            rounded 
            border-gray-300 
            text-blue-600 
            focus:ring-0 
            focus:outline-none
            disabled:opacity-50
            disabled:cursor-not-allowed
            cursor-pointer
          `
        }
      )
    ),
    t && /* @__PURE__ */ i.jsx("span", { className: `${m[f]} select-none`, children: t })
  ] });
}, c1 = ({
  name: e,
  accept: t,
  multiple: r = !1,
  disabled: n = !1,
  boxed: s = !1,
  centered: o = !1,
  fullWidth: a = !1,
  rules: l,
  className: c = "",
  label: d = "Choose a file...",
  icon: u
}) => {
  var p;
  const { register: f, watch: h } = Xr(), m = h(e), g = [
    "file",
    s && "has-boxed",
    o && "is-centered",
    a && "is-fullwidth",
    c
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("div", { className: g, children: /* @__PURE__ */ i.jsxs("label", { className: "file-label", children: [
    /* @__PURE__ */ i.jsx(
      "input",
      {
        className: "file-input",
        type: "file",
        ...f(e, l),
        accept: t,
        multiple: r,
        disabled: n
      }
    ),
    /* @__PURE__ */ i.jsxs("span", { className: "file-cta", children: [
      u && /* @__PURE__ */ i.jsx("span", { className: "file-icon", children: u }),
      /* @__PURE__ */ i.jsx("span", { className: "file-label", children: d })
    ] }),
    m && m.length > 0 && /* @__PURE__ */ i.jsx("span", { className: "file-name", children: r ? `${m.length} files selected` : (p = m[0]) == null ? void 0 : p.name })
  ] }) });
}, Yl = ({
  options: e = [],
  placeholder: t,
  fullWidth: r = !1,
  selectSize: n = "md",
  className: s = "",
  style: o,
  ...a
}) => {
  const l = {
    xs: "0.25rem 0.5rem",
    sm: "0.375rem 0.625rem",
    md: "0.5rem 0.75rem",
    lg: "0.625rem 1rem",
    xl: "0.75rem 1.25rem"
  }, c = {
    xs: "12px",
    sm: "13px",
    md: "14px",
    lg: "16px",
    xl: "18px"
  }, d = {
    padding: l[n || "md"],
    border: "1px solid rgb(var(--qwanyx-border))",
    borderRadius: "var(--qwanyx-radius)",
    backgroundColor: "rgb(var(--qwanyx-background))",
    color: "rgb(var(--qwanyx-foreground))",
    fontSize: c[n || "md"],
    lineHeight: "1.5",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    cursor: "pointer",
    width: r ? "100%" : "auto",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23000000' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.75rem center",
    backgroundSize: "12px",
    paddingRight: "2.5rem",
    ...o
  }, u = `qwanyx-select-${Math.random().toString(36).substr(2, 9)}`;
  return P.useEffect(() => {
    const f = document.createElement("style");
    return f.textContent = `
      .${u} option {
        background-color: white !important;
        color: black !important;
        padding: 0.5rem !important;
      }
      .${u} option:hover {
        background-color: #f0f0f0 !important;
      }
      .${u} option:disabled {
        color: #999 !important;
        cursor: not-allowed !important;
      }
      @media (prefers-color-scheme: dark) {
        .${u} option {
          background-color: #1a1a1a !important;
          color: white !important;
        }
        .${u} option:hover {
          background-color: #2a2a2a !important;
        }
      }
    `, document.head.appendChild(f), () => {
      document.head.removeChild(f);
    };
  }, [u]), /* @__PURE__ */ i.jsxs(
    "select",
    {
      className: `${u} ${s}`,
      style: d,
      onFocus: (f) => {
        var h;
        f.currentTarget.style.borderColor = "rgb(var(--qwanyx-primary))", f.currentTarget.style.boxShadow = "0 0 0 2px rgba(var(--qwanyx-primary-rgb), 0.1)", (h = a.onFocus) == null || h.call(a, f);
      },
      onBlur: (f) => {
        var h;
        f.currentTarget.style.borderColor = "rgb(var(--qwanyx-border))", f.currentTarget.style.boxShadow = "none", (h = a.onBlur) == null || h.call(a, f);
      },
      ...a,
      children: [
        t && /* @__PURE__ */ i.jsx("option", { value: "", disabled: !0, children: t }),
        e.map((f) => /* @__PURE__ */ i.jsx(
          "option",
          {
            value: f.value,
            disabled: f.disabled,
            children: f.label
          },
          f.value
        ))
      ]
    }
  );
}, uv = `
  .superdropdown-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
  }
  
  .superdropdown-scroll::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  .superdropdown-scroll::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
    margin: 8px 0;
  }
  
  .superdropdown-scroll::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(156, 163, 175, 0.2), rgba(156, 163, 175, 0.4));
    border-radius: 10px;
    border: 1px solid transparent;
    background-clip: content-box;
    transition: all 0.3s ease;
  }
  
  .superdropdown-scroll::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, rgba(156, 163, 175, 0.4), rgba(156, 163, 175, 0.6));
    box-shadow: 0 0 0 1px rgba(156, 163, 175, 0.2);
  }
  
  .superdropdown-scroll::-webkit-scrollbar-thumb:active {
    background: linear-gradient(180deg, rgba(156, 163, 175, 0.5), rgba(156, 163, 175, 0.7));
  }
  
  /* Dark mode scrollbar */
  @media (prefers-color-scheme: dark) {
    .superdropdown-scroll::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2));
    }
    
    .superdropdown-scroll::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.3));
      box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
    }
    
    .superdropdown-scroll::-webkit-scrollbar-thumb:active {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.4));
    }
  }
  
  /* Hide scrollbar arrows */
  .superdropdown-scroll::-webkit-scrollbar-button {
    display: none;
  }
  
  /* Smooth scroll behavior */
  .superdropdown-scroll {
    scroll-behavior: smooth;
  }
`;
if (typeof document < "u" && !document.getElementById("superdropdown-styles")) {
  const e = document.createElement("style");
  e.id = "superdropdown-styles", e.innerHTML = uv, document.head.appendChild(e);
}
function Gl(e, t) {
  t = t.toLowerCase(), e = e.toLowerCase();
  let r = 0, n = 0;
  for (; n < e.length && r < t.length; )
    e[n] === t[r] && r++, n++;
  return r === t.length;
}
const qo = ({
  options: e = [],
  value: t,
  onChange: r,
  placeholder: n = "Select...",
  disabled: s = !1,
  mode: o = "select",
  dropdownMode: a = "attached",
  searchable: l = !1,
  fuzzySearch: c = !1,
  searchPlaceholder: d = "Search...",
  createOption: u = !1,
  filterOption: f,
  showAvatars: h = !1,
  showIcons: m = !1,
  showDescriptions: g = !1,
  showPreview: p = !1,
  showTags: y = !1,
  showStatus: j = !1,
  showBadges: x = !1,
  showCheckboxes: b = !1,
  grouped: k = !1,
  nested: A = !1,
  showBreadcrumbs: R = !1,
  maxRecentItems: C = 5,
  showPinnedSection: S = !1,
  virtualScroll: E = !1,
  itemHeight: D = 40,
  maxHeight: L = 600,
  asyncLoad: M,
  loading: q = !1,
  clearable: U = !1,
  closeOnSelect: J = !0,
  blurOnSelect: ce = !0,
  openOnFocus: K = !1,
  autoFocus: ue = !1,
  animation: Y = "spring",
  animationDuration: he = 200,
  size: oe = "md",
  variant: Ae = "default",
  color: nt = "primary",
  fullWidth: Ne = !1,
  className: Me = "",
  dropdownClassName: de = "",
  position: ne = "auto",
  align: Ie = "start",
  offset: Ze = 4,
  onOpen: lt,
  onClose: je,
  onSearch: kt,
  onCreate: ct,
  onHover: St
}) => {
  const [Ce, He] = V(!1), [Ve, vt] = V(""), [st, v] = V(-1), [_, N] = V([]), [O, T] = V([]), [F, B] = V(null), [le, pe] = V({ top: 0, left: 0, width: 0, height: 400 }), [Le, Ht] = V(-1), et = ae(null), or = ae(null), ar = ae(null), dt = o === "multiselect", $t = dt ? t || [] : t ? [t] : [], ze = Gt(() => {
    let z = [...e];
    if (Ve)
      if (f)
        z = z.filter((G) => f(G, Ve));
      else if (c)
        z = z.filter(
          (G) => Gl(G.label, Ve) || G.description && Gl(G.description, Ve)
        );
      else {
        const G = Ve.toLowerCase();
        z = z.filter(
          (se) => se.label.toLowerCase().includes(G) || se.description && se.description.toLowerCase().includes(G)
        );
      }
    return (S || C > 0) && z.sort((G, se) => {
      const ve = O.includes(String(G.value)), Pe = O.includes(String(se.value)), tt = _.includes(String(G.value)), Ge = _.includes(String(se.value));
      return ve && !Pe ? -1 : !ve && Pe ? 1 : tt && !Ge ? -1 : !tt && Ge ? 1 : G.label.localeCompare(se.label);
    }), z;
  }, [e, Ve, f, c, O, _, S, C]), Qr = Gt(() => {
    if (!k) return { "": ze };
    const z = {};
    return ze.forEach((G) => {
      const se = G.group || "Other";
      z[se] || (z[se] = []), z[se].push(G);
    }), z;
  }, [k, ze]);
  ie(() => {
    if (Ce && et.current) {
      const z = et.current.getBoundingClientRect(), G = window.innerHeight, se = window.innerWidth, ve = Math.min(L, 400);
      let Pe = z.bottom + Ze, tt = z.left, Ge = z.width, ut = ve;
      switch (a) {
        case "fullscreen":
          Pe = 0, tt = 0, Ge = se, ut = G;
          break;
        case "fullHeight":
          Pe = 0, tt = z.left, Ge = z.width, ut = G;
          break;
        case "fill":
          const kr = et.current.parentElement;
          if (kr) {
            const Sr = kr.getBoundingClientRect();
            Pe = Sr.top, tt = Sr.left, Ge = Sr.width, ut = Sr.height;
          }
          break;
        case "attached":
        default:
          const _t = G - z.bottom, Ns = z.top;
          ne === "auto" ? _t < L && Ns > _t && (Pe = z.top - L - Ze) : ne === "top" && (Pe = z.top - L - Ze), tt + z.width > se && (tt = se - z.width - 10);
          break;
      }
      pe({
        top: Pe,
        left: tt,
        width: Ge,
        height: ut
      });
    }
  }, [Ce, ne, L, Ze, a]), ie(() => {
    if (Ce) {
      const z = window.scrollY, G = document.body.style.overflow, se = document.body.style.position, ve = document.body.style.top, Pe = document.body.style.width;
      return document.body.style.overflow = "hidden", document.body.style.position = "fixed", document.body.style.top = `-${z}px`, document.body.style.width = "100%", () => {
        document.body.style.overflow = G, document.body.style.position = se, document.body.style.top = ve, document.body.style.width = Pe, window.scrollTo(0, z);
      };
    }
  }, [Ce]), ie(() => {
    if (!Ce) return;
    const z = (se) => {
      et.current && !et.current.contains(se.target) && or.current && !or.current.contains(se.target) && (He(!1), vt(""), v(-1), je == null || je());
    }, G = setTimeout(() => {
      document.addEventListener("mousedown", z);
    }, 100);
    return () => {
      clearTimeout(G), document.removeEventListener("mousedown", z);
    };
  }, [Ce, je]);
  const Xt = qr((z) => {
    if (!Ce) {
      (z.key === "Enter" || z.key === " " || z.key === "ArrowDown") && (z.preventDefault(), He(!0));
      return;
    }
    switch (z.key) {
      case "Escape":
        z.preventDefault(), He(!1), vt(""), v(-1), je == null || je();
        break;
      case "ArrowDown":
        z.preventDefault(), v(
          (G) => G < ze.length - 1 ? G + 1 : 0
        );
        break;
      case "ArrowUp":
        z.preventDefault(), v(
          (G) => G > 0 ? G - 1 : ze.length - 1
        );
        break;
      case "Enter":
        z.preventDefault(), st >= 0 && st < ze.length && Cr(ze[st], st);
        break;
      case "Tab":
        He(!1);
        break;
    }
  }, [Ce, ze, st]), Cr = qr((z, G, se) => {
    if (!z.disabled)
      if (dt) {
        let ve = [...$t];
        const Pe = se == null ? void 0 : se.shiftKey, tt = (se == null ? void 0 : se.ctrlKey) || (se == null ? void 0 : se.metaKey);
        if (Pe && Le !== -1) {
          const Ge = Math.min(Le, G), ut = Math.max(Le, G);
          ze.slice(Ge, ut + 1).filter((_t) => !_t.disabled).map((_t) => _t.value).forEach((_t) => {
            ve.includes(_t) || ve.push(_t);
          });
        } else tt || !se ? $t.includes(z.value) ? ve = ve.filter((Ge) => Ge !== z.value) : ve.push(z.value) : $t.includes(z.value) ? ve = ve.filter((Ge) => Ge !== z.value) : ve.push(z.value);
        r == null || r(ve), Ht(G);
      } else
        r == null || r(z.value), N((ve) => [String(z.value), ...ve.filter((tt) => tt !== String(z.value))].slice(0, C)), J && He(!1);
  }, [dt, $t, r, J, C, ze, Le]), Jt = {
    none: {},
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slide: {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 }
    },
    spring: {
      initial: { opacity: 0, scale: 0.95, y: -10 },
      animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 25
        }
      },
      exit: { opacity: 0, scale: 0.95, y: -10 }
    },
    morph: {
      initial: { opacity: 0, scale: 0, borderRadius: "50%" },
      animate: {
        opacity: 1,
        scale: 1,
        borderRadius: "var(--radius)",
        transition: {
          type: "spring",
          stiffness: 260,
          damping: 20
        }
      },
      exit: { opacity: 0, scale: 0, borderRadius: "50%" }
    }
  }, lr = {
    xs: { padding: "4px 8px", fontSize: "12px", minHeight: "24px" },
    sm: { padding: "6px 12px", fontSize: "14px", minHeight: "32px" },
    md: { padding: "8px 16px", fontSize: "16px", minHeight: "40px" },
    lg: { padding: "10px 20px", fontSize: "18px", minHeight: "48px" },
    xl: { padding: "12px 24px", fontSize: "20px", minHeight: "56px" }
  }, Qt = (z, G) => {
    const se = $t.includes(z.value), ve = G === st, Pe = O.includes(String(z.value)), tt = _.includes(String(z.value)), Ge = /* @__PURE__ */ i.jsxs(
      "div",
      {
        role: "option",
        "aria-selected": se,
        onClick: (ut) => Cr(z, G, ut),
        onMouseEnter: () => {
          v(G), B(p ? z : null), St == null || St(z);
        },
        onMouseLeave: () => B(null),
        style: {
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "10px 16px",
          cursor: z.disabled ? "not-allowed" : "pointer",
          backgroundColor: ve && se ? "rgba(var(--primary), 0.2)" : ve ? "rgba(var(--primary), 0.1)" : se ? "rgba(var(--primary), 0.15)" : "transparent",
          opacity: z.disabled ? 0.5 : 1,
          borderRadius: "var(--radius-sm)",
          position: "relative",
          transition: "background-color 0.15s ease",
          minHeight: `${D}px`,
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none"
        },
        children: [
          h && z.avatar && /* @__PURE__ */ i.jsxs("div", { style: { position: "relative", flexShrink: 0 }, children: [
            /* @__PURE__ */ i.jsx(
              "img",
              {
                src: z.avatar,
                alt: z.avatarAlt || z.label,
                style: {
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid rgb(var(--border))"
                }
              }
            ),
            j && z.status && /* @__PURE__ */ i.jsx(
              "div",
              {
                style: {
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  border: "2px solid rgb(var(--background))",
                  backgroundColor: z.status === "online" ? "#10b981" : z.status === "busy" ? "#ef4444" : z.status === "away" ? "#f59e0b" : "#6b7280"
                }
              }
            )
          ] }),
          m && z.icon && (typeof z.icon == "string" && z.icon.length === 1 ? /* @__PURE__ */ i.jsx("div", { style: { fontSize: "24px", flexShrink: 0 }, children: z.icon }) : typeof z.icon == "string" ? /* @__PURE__ */ i.jsx(Q, { name: z.icon, size: "sm", color: z.color || nt }) : /* @__PURE__ */ i.jsx("div", { style: { fontSize: "24px", flexShrink: 0 }, children: z.icon })),
          /* @__PURE__ */ i.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
            /* @__PURE__ */ i.jsxs("div", { style: {
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: lr[oe].fontSize,
              fontWeight: se ? "600" : "400"
            }, children: [
              z.label,
              y && z.tags && /* @__PURE__ */ i.jsx("div", { style: { display: "flex", gap: "4px", marginLeft: "8px" }, children: z.tags.map((ut) => /* @__PURE__ */ i.jsx(
                "span",
                {
                  style: {
                    padding: "2px 6px",
                    fontSize: "10px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "rgba(var(--primary), 0.1)",
                    color: "rgb(var(--primary))",
                    fontWeight: "500",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  },
                  children: ut
                },
                ut
              )) }),
              x && z.badge && /* @__PURE__ */ i.jsx(
                "span",
                {
                  style: {
                    padding: "2px 8px",
                    fontSize: "11px",
                    borderRadius: "var(--radius-full)",
                    backgroundColor: z.color ? `rgb(var(--${z.color}))` : "rgb(var(--primary))",
                    color: "white",
                    fontWeight: "600",
                    marginLeft: "auto"
                  },
                  children: z.badge
                }
              ),
              Pe && /* @__PURE__ */ i.jsx(Q, { name: "push_pin", size: "xs" }),
              tt && !Pe && /* @__PURE__ */ i.jsx(Q, { name: "schedule", size: "xs" })
            ] }),
            g && z.description && /* @__PURE__ */ i.jsx("div", { style: {
              fontSize: `calc(${lr[oe].fontSize} * 0.875)`,
              color: "rgb(var(--text-secondary))",
              marginTop: "2px"
            }, children: z.description })
          ] }),
          z.command && /* @__PURE__ */ i.jsx("kbd", { style: {
            padding: "2px 6px",
            backgroundColor: "rgba(var(--border), 0.3)",
            borderRadius: "var(--radius-sm)",
            fontSize: "11px",
            fontFamily: "monospace",
            color: "rgb(var(--text-secondary))"
          }, children: z.command })
        ]
      },
      z.value
    );
    return !dt && !b ? /* @__PURE__ */ i.jsx(
      pt.div,
      {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        children: Ge
      },
      z.value
    ) : Ge;
  }, Nn = () => {
    if (dt) {
      const z = e.filter((G) => $t.includes(G.value));
      return z.length === 0 ? /* @__PURE__ */ i.jsx("span", { style: { color: "rgb(var(--text-secondary))" }, children: n }) : z.length <= 2 ? /* @__PURE__ */ i.jsx("div", { style: { display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }, children: z.map((G) => /* @__PURE__ */ i.jsxs(
        "span",
        {
          style: {
            padding: "2px 8px",
            fontSize: "12px",
            borderRadius: "var(--radius-sm)",
            backgroundColor: "rgba(var(--primary), 0.1)",
            color: "rgb(var(--primary))",
            fontWeight: "500",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px"
          },
          children: [
            G.icon && typeof G.icon == "string" && G.icon.length <= 2 && /* @__PURE__ */ i.jsx("span", { style: { fontSize: "14px" }, children: G.icon }),
            G.label
          ]
        },
        G.value
      )) }) : /* @__PURE__ */ i.jsxs("span", { style: {
        padding: "2px 8px",
        fontSize: "12px",
        borderRadius: "var(--radius-sm)",
        backgroundColor: "rgba(var(--primary), 0.1)",
        color: "rgb(var(--primary))",
        fontWeight: "600"
      }, children: [
        z.length,
        " items selected"
      ] });
    } else {
      const z = e.find((G) => G.value === t);
      return z ? /* @__PURE__ */ i.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
        z.icon && typeof z.icon == "string" && z.icon.length <= 2 && /* @__PURE__ */ i.jsx("span", { style: { fontSize: "18px" }, children: z.icon }),
        /* @__PURE__ */ i.jsx("span", { children: z.label })
      ] }) : /* @__PURE__ */ i.jsx("span", { style: { color: "rgb(var(--text-secondary))" }, children: n });
    }
  };
  return /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    /* @__PURE__ */ i.jsx(
      "div",
      {
        ref: et,
        className: Me,
        style: {
          position: "relative",
          width: Ne ? "100%" : "auto"
        },
        children: /* @__PURE__ */ i.jsxs(
          "div",
          {
            role: "combobox",
            "aria-expanded": Ce,
            "aria-haspopup": "listbox",
            "aria-disabled": s,
            tabIndex: s ? -1 : 0,
            onClick: () => !s && He(!Ce),
            onKeyDown: Xt,
            style: {
              ...lr[oe],
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
              borderRadius: "var(--radius)",
              border: Ae === "outlined" ? "2px solid rgb(var(--border))" : "none",
              backgroundColor: Ae === "filled" ? "rgb(var(--surface))" : Ae === "glass" ? "rgba(255, 255, 255, 0.1)" : "rgb(var(--background))",
              backdropFilter: Ae === "glass" ? "blur(10px)" : "none",
              cursor: s ? "not-allowed" : "pointer",
              opacity: s ? 0.5 : 1,
              transition: "all 0.2s ease",
              boxShadow: Ce ? `0 0 0 3px rgba(var(--${nt}), 0.1)` : "var(--shadow-sm)",
              width: "100%"
            },
            children: [
              /* @__PURE__ */ i.jsx("div", { style: {
                flex: 1,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                minHeight: "20px"
              }, children: Nn() }),
              U && t && !s && /* @__PURE__ */ i.jsx(
                Q,
                {
                  name: "close",
                  size: "xs",
                  color: "secondary",
                  style: { cursor: "pointer" },
                  onClick: (z) => {
                    z.stopPropagation(), r == null || r(dt ? [] : void 0);
                  }
                }
              ),
              /* @__PURE__ */ i.jsx(
                pt.div,
                {
                  animate: { rotate: Ce ? 180 : 0 },
                  transition: { duration: 0.2 },
                  children: /* @__PURE__ */ i.jsx(Q, { name: "expand_more", size: "sm", color: "secondary" })
                }
              )
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ i.jsx(Zh, { children: Ce && /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
      /* @__PURE__ */ i.jsx(
        pt.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.2 },
          style: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(2px)",
            zIndex: 9998
          },
          onClick: () => {
            He(!1), vt(""), v(-1), je == null || je();
          }
        }
      ),
      /* @__PURE__ */ i.jsxs(
        pt.div,
        {
          ref: or,
          role: "listbox",
          "aria-multiselectable": dt,
          ...Y !== "none" ? Jt[Y] : {},
          style: {
            position: "fixed",
            top: le.top,
            left: le.left,
            width: le.width,
            height: a === "fullscreen" || a === "fullHeight" || a === "fill" ? le.height : void 0,
            maxHeight: a === "attached" ? `${L}px` : void 0,
            overflowY: "hidden",
            // Let inner div handle scrolling
            overflowX: "hidden",
            zIndex: 9999,
            // Above the backdrop (9998)
            backgroundColor: Ae === "glass" ? "rgba(255, 255, 255, 0.95)" : "rgb(var(--background))",
            backdropFilter: Ae === "glass" ? "blur(20px)" : "none",
            border: a === "fullscreen" ? "none" : "1px solid rgb(var(--border))",
            borderRadius: a === "fullscreen" ? "0" : "var(--radius-lg)",
            boxShadow: a === "fullscreen" ? "none" : "var(--shadow-xl)",
            display: "flex",
            flexDirection: "column"
          },
          className: de,
          onWheel: (z) => {
            z.preventDefault(), z.stopPropagation();
          },
          children: [
            a === "fullscreen" && /* @__PURE__ */ i.jsxs("div", { style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 16px",
              borderBottom: "1px solid rgb(var(--border))",
              flexShrink: 0
            }, children: [
              /* @__PURE__ */ i.jsx("span", { style: {
                fontSize: "14px",
                fontWeight: "600",
                color: "rgb(var(--text))"
              }, children: n.replace("Select", "Choose") }),
              /* @__PURE__ */ i.jsx(
                pt.div,
                {
                  whileHover: { scale: 1.2 },
                  whileTap: { scale: 0.9 },
                  onClick: () => {
                    He(!1), vt(""), v(-1), je == null || je();
                  },
                  style: {
                    width: "12px",
                    height: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "rgb(var(--text-secondary))",
                    transition: "color 0.2s"
                  },
                  onMouseEnter: (z) => {
                    z.currentTarget.style.color = "rgb(var(--text))";
                  },
                  onMouseLeave: (z) => {
                    z.currentTarget.style.color = "rgb(var(--text-secondary))";
                  },
                  children: /* @__PURE__ */ i.jsx(Q, { name: "close", size: "sm" })
                }
              )
            ] }),
            l && /* @__PURE__ */ i.jsx("div", { style: {
              borderBottom: "1px solid rgb(var(--border))",
              flexShrink: 0,
              backgroundColor: "inherit",
              backdropFilter: "inherit",
              zIndex: 1
            }, children: /* @__PURE__ */ i.jsx(
              qt,
              {
                ref: ar,
                type: "text",
                value: Ve,
                onChange: (z) => {
                  vt(z.target.value), kt == null || kt(z.target.value);
                },
                placeholder: d,
                inputSize: oe,
                icon: /* @__PURE__ */ i.jsx(Q, { name: "search", size: "sm" }),
                iconPosition: "left",
                autoFocus: !0,
                fullWidth: !0,
                style: {
                  width: "100%",
                  border: "none",
                  borderRadius: 0,
                  boxShadow: "inset 0 -2px 4px -2px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "rgba(var(--muted), 0.05)",
                  padding: "12px 16px 12px 48px"
                }
              }
            ) }),
            q && /* @__PURE__ */ i.jsx("div", { style: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "32px"
            }, children: /* @__PURE__ */ i.jsx(eu, { size: "md" }) }),
            dt && ze.length > 0 && /* @__PURE__ */ i.jsx("div", { style: {
              padding: "8px 16px",
              fontSize: "11px",
              color: "rgb(var(--text-muted))",
              borderBottom: "1px solid rgb(var(--border))",
              backgroundColor: "rgba(var(--muted), 0.05)"
            }, children: "💡 Click to toggle • Shift+Click for range • Ctrl/Cmd+Click for multiple" }),
            !q && /* @__PURE__ */ i.jsxs(
              "div",
              {
                className: "superdropdown-scroll",
                style: {
                  padding: "8px",
                  flex: 1,
                  maxHeight: a === "attached" ? "500px" : void 0,
                  minHeight: a === "attached" ? "200px" : void 0,
                  overflowY: "auto",
                  // Only show when needed
                  overflowX: "hidden",
                  WebkitOverflowScrolling: "touch",
                  // Smooth scrolling on iOS
                  overscrollBehavior: "contain"
                  // Prevent scroll chaining
                },
                onWheel: (z) => {
                  z.stopPropagation();
                  const G = z.currentTarget, se = z.deltaY;
                  G.scrollTop += se, z.preventDefault();
                },
                onTouchMove: (z) => {
                  z.stopPropagation();
                },
                children: [
                  S && O.length > 0 && /* @__PURE__ */ i.jsxs("div", { style: { marginBottom: "8px" }, children: [
                    /* @__PURE__ */ i.jsx("div", { style: {
                      padding: "4px 16px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "rgb(var(--text-secondary))",
                      textTransform: "uppercase"
                    }, children: "Pinned" }),
                    ze.filter((z) => O.includes(String(z.value))).map((z, G) => Qt(z, G))
                  ] }),
                  C > 0 && _.length > 0 && /* @__PURE__ */ i.jsxs("div", { style: { marginBottom: "8px" }, children: [
                    /* @__PURE__ */ i.jsx("div", { style: {
                      padding: "4px 16px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "rgb(var(--text-secondary))",
                      textTransform: "uppercase"
                    }, children: "Recent" }),
                    ze.filter((z) => _.includes(String(z.value))).slice(0, C).map((z, G) => Qt(z, G))
                  ] }),
                  k ? Object.entries(Qr).map(([z, G], se) => /* @__PURE__ */ i.jsxs("div", { style: { marginBottom: "12px" }, children: [
                    z && /* @__PURE__ */ i.jsx("div", { style: {
                      padding: "8px 16px 4px",
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "rgb(var(--text-secondary))",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderBottom: se === 0 ? "none" : "1px solid rgba(var(--border), 0.5)",
                      marginBottom: "4px",
                      paddingTop: se === 0 ? "4px" : "12px"
                    }, children: z }),
                    G.map((ve, Pe) => Qt(ve, Pe))
                  ] }, z)) : ze.map((z, G) => Qt(z, G)),
                  u && Ve && !ze.some((z) => z.label === Ve) && /* @__PURE__ */ i.jsxs(
                    "div",
                    {
                      onClick: () => {
                        if (typeof u == "function") {
                          const z = u(Ve);
                          Cr(z, ze.length);
                        } else
                          ct == null || ct(Ve);
                        vt("");
                      },
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 16px",
                        cursor: "pointer",
                        backgroundColor: "rgba(var(--primary), 0.05)",
                        borderRadius: "var(--radius-sm)",
                        marginTop: "8px"
                      },
                      children: [
                        /* @__PURE__ */ i.jsx(Q, { name: "add", size: "sm", color: nt }),
                        /* @__PURE__ */ i.jsxs("span", { children: [
                          'Create "',
                          Ve,
                          '"'
                        ] })
                      ]
                    }
                  ),
                  ze.length === 0 && !u && /* @__PURE__ */ i.jsx("div", { style: {
                    padding: "32px",
                    textAlign: "center",
                    color: "rgb(var(--text-secondary))"
                  }, children: "No options found" })
                ]
              }
            ),
            p && F && F.preview && /* @__PURE__ */ i.jsx("div", { style: {
              position: "absolute",
              left: "100%",
              top: 0,
              marginLeft: "8px",
              width: "300px",
              padding: "16px",
              backgroundColor: "rgb(var(--background))",
              border: "1px solid rgb(var(--border))",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-lg)"
            }, children: F.preview })
          ]
        }
      )
    ] }) })
  ] });
}, d1 = (e) => /* @__PURE__ */ i.jsx(qo, { ...e, mode: "multiselect" }), u1 = (e) => /* @__PURE__ */ i.jsx(qo, { ...e, mode: "combobox", searchable: !0 }), f1 = (e) => /* @__PURE__ */ i.jsx(qo, { ...e, mode: "command", searchable: !0, fuzzySearch: !0 }), Wo = ({
  children: e,
  navigation: t,
  footer: r = { show: !0 },
  className: n = "",
  backgroundColor: s,
  backgroundImage: o,
  backgroundGradient: a,
  minHeight: l = "100vh",
  fullWidth: c = !1,
  noPadding: d = !1,
  centered: u = !1
}) => {
  var m;
  const f = {
    minHeight: t || r != null && r.show ? `calc(${l} - var(--navbar-height, 64px) - var(--footer-height, 200px))` : l,
    ...s && { backgroundColor: s },
    ...o && {
      backgroundImage: `url(${o})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    ...a && { background: a }
  }, h = [
    "qwanyx-page",
    c && "qwanyx-page--full-width",
    d && "qwanyx-page--no-padding",
    u && "qwanyx-page--centered",
    n
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-page-wrapper", children: [
    t && /* @__PURE__ */ i.jsx(
      To,
      {
        title: t.title,
        subtitle: t.subtitle,
        logo: t.logo || "/images/logo.png",
        items: (m = t.items) == null ? void 0 : m.map((g) => ({
          label: g.label,
          href: g.href,
          onClick: g.onClick,
          active: g.active
        })),
        actions: t.actions,
        position: t.fixed ? "fixed" : t.sticky !== !1 ? "sticky" : "static",
        transparent: !0,
        blur: !0,
        elevated: !0,
        hideOnScroll: !1,
        search: !0,
        searchPlaceholder: "Search our platform...",
        onSearch: (g) => console.log("Search:", g),
        user: {
          name: "John Doe",
          email: "john@example.com",
          avatar: "https://i.pravatar.cc/150?img=3",
          role: "Premium User"
        },
        userMenuItems: [
          { label: "Profile", icon: "person", href: "#profile" },
          { label: "Settings", icon: "settings", href: "#settings" },
          { label: "Billing", icon: "payment", href: "#billing" },
          { divider: !0 },
          { label: "Help & Support", icon: "help", href: "#support" }
        ],
        onLogout: () => console.log("Logout"),
        notifications: [
          {
            id: "1",
            title: "Welcome to our platform!",
            description: "Get started with our quick tour",
            time: "2 min ago",
            icon: "celebration",
            type: "success"
          },
          {
            id: "2",
            title: "New feature available",
            description: "Check out the new dashboard",
            time: "1 hour ago",
            icon: "new_releases",
            type: "info"
          },
          {
            id: "3",
            title: "Your trial expires soon",
            description: "Upgrade to continue using premium features",
            time: "1 day ago",
            icon: "warning",
            type: "warning",
            read: !0
          }
        ],
        notificationCount: 2,
        onNotificationClick: (g) => console.log("Notification clicked:", g),
        onNotificationsClear: () => console.log("Clear notifications"),
        primaryAction: {
          label: "Get Started",
          onClick: () => console.log("Primary action"),
          icon: "rocket_launch"
        },
        variant: "default",
        mobileBreakpoint: 768,
        mobileMenuType: "drawer",
        dark: !1
      }
    ),
    /* @__PURE__ */ i.jsx("div", { className: h, style: f, children: e }),
    (r == null ? void 0 : r.show) && (r.content || /* @__PURE__ */ i.jsx(Ro, {}))
  ] });
}, fv = ({
  children: e,
  sticky: t = !1,
  transparent: r = !1,
  className: n = ""
}) => {
  const s = [
    "qwanyx-page__header",
    t && "qwanyx-page__header--sticky",
    r && "qwanyx-page__header--transparent",
    n
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("header", { className: s, children: e });
}, hv = ({
  children: e,
  className: t = "",
  maxWidth: r = "xl",
  padding: n = !0
}) => {
  const s = [
    "qwanyx-page__content",
    `qwanyx-page__content--${r}`,
    n && "qwanyx-page__content--padded",
    t
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("main", { className: s, children: e });
}, h1 = ({
  children: e,
  className: t = "",
  sticky: r = !1
}) => {
  const n = [
    "qwanyx-page__footer",
    r && "qwanyx-page__footer--sticky",
    t
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("footer", { className: n, children: e });
}, Js = ({
  children: e,
  className: t = "",
  backgroundColor: r,
  backgroundImage: n,
  spacing: s = "md",
  id: o,
  style: a
}) => {
  const l = {
    ...r && { backgroundColor: r },
    ...n && {
      backgroundImage: `url(${n})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    },
    ...a
  }, c = [
    "qwanyx-page__section",
    `qwanyx-page__section--spacing-${s}`,
    t
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("section", { id: o, className: c, style: l, children: e });
}, p1 = ({
  navigation: e = {
    title: "Brand",
    items: [
      { label: "Home", href: "#top" },
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" }
    ],
    actions: /* @__PURE__ */ i.jsx(X, { size: "sm", children: "Get Started" })
  },
  hero: t = {
    title: "Welcome to Our Platform",
    subtitle: "Build something amazing with our powerful tools",
    primaryAction: { label: "Get Started" },
    secondaryAction: { label: "Learn More" }
  },
  features: r = [
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Optimized for speed and performance"
    },
    {
      icon: "🔒",
      title: "Secure",
      description: "Enterprise-grade security built in"
    },
    {
      icon: "📱",
      title: "Responsive",
      description: "Works perfectly on all devices"
    },
    {
      icon: "🚀",
      title: "Scalable",
      description: "Grows with your business needs"
    },
    {
      icon: "🛠️",
      title: "Customizable",
      description: "Adapt to your specific requirements"
    },
    {
      icon: "💡",
      title: "Innovative",
      description: "Cutting-edge technology stack"
    }
  ],
  pricing: n = [
    {
      title: "Starter",
      price: "$9/mo",
      description: "Perfect for small projects",
      features: ["1 User", "10 Projects", "Basic Support", "1GB Storage"]
    },
    {
      title: "Professional",
      price: "$29/mo",
      description: "For growing teams",
      features: ["5 Users", "Unlimited Projects", "Priority Support", "10GB Storage", "Advanced Analytics"],
      highlighted: !0
    },
    {
      title: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: ["Unlimited Users", "Unlimited Projects", "24/7 Support", "Unlimited Storage", "Custom Features"]
    }
  ],
  showFooter: s = !0
}) => /* @__PURE__ */ i.jsxs(Wo, { navigation: e, footer: { show: s }, children: [
  t && /* @__PURE__ */ i.jsx(js, { backgroundImage: t.backgroundImage, children: /* @__PURE__ */ i.jsxs(Ss, { children: [
    /* @__PURE__ */ i.jsx(Cs, { children: t.title }),
    t.subtitle && /* @__PURE__ */ i.jsx(ks, { children: t.subtitle }),
    /* @__PURE__ */ i.jsxs(_s, { children: [
      t.primaryAction && /* @__PURE__ */ i.jsx(X, { size: "lg", onClick: t.primaryAction.onClick, children: t.primaryAction.label }),
      t.secondaryAction && /* @__PURE__ */ i.jsx(X, { size: "lg", variant: "outline", onClick: t.secondaryAction.onClick, children: t.secondaryAction.label })
    ] })
  ] }) }),
  r && r.length > 0 && /* @__PURE__ */ i.jsx(zt, { id: "features", children: /* @__PURE__ */ i.jsxs(Se, { children: [
    /* @__PURE__ */ i.jsxs("div", { style: { textAlign: "center", marginBottom: "3rem" }, children: [
      /* @__PURE__ */ i.jsx(Je, { size: "2xl", children: "Features" }),
      /* @__PURE__ */ i.jsx(W, { size: "lg", children: "Everything you need to succeed" })
    ] }),
    /* @__PURE__ */ i.jsx(Ts, { children: r.map((o, a) => /* @__PURE__ */ i.jsxs(Vr, { children: [
      /* @__PURE__ */ i.jsx(Lr, { children: (typeof o.icon == "string", o.icon) }),
      /* @__PURE__ */ i.jsx(Br, { children: o.title }),
      /* @__PURE__ */ i.jsx(Or, { children: o.description })
    ] }, a)) })
  ] }) }),
  n && n.length > 0 && /* @__PURE__ */ i.jsx(zt, { id: "pricing", style: { backgroundColor: "#f8f9fa" }, children: /* @__PURE__ */ i.jsxs(Se, { children: [
    /* @__PURE__ */ i.jsxs("div", { style: { textAlign: "center", marginBottom: "3rem" }, children: [
      /* @__PURE__ */ i.jsx(Je, { size: "2xl", children: "Pricing" }),
      /* @__PURE__ */ i.jsx(W, { size: "lg", children: "Choose the perfect plan for your needs" })
    ] }),
    /* @__PURE__ */ i.jsx(Nt, { cols: n.length, children: n.map((o, a) => /* @__PURE__ */ i.jsxs(
      gt,
      {
        className: o.highlighted ? "qwanyx-card--highlighted" : "",
        children: [
          /* @__PURE__ */ i.jsxs(Bt, { children: [
            /* @__PURE__ */ i.jsx(Ot, { children: o.title }),
            /* @__PURE__ */ i.jsx(W, { size: "3xl", weight: "bold", children: o.price }),
            o.description && /* @__PURE__ */ i.jsx(xr, { children: o.description })
          ] }),
          /* @__PURE__ */ i.jsxs(xt, { children: [
            /* @__PURE__ */ i.jsx("ul", { style: { listStyle: "none", padding: 0 }, children: o.features.map((l, c) => /* @__PURE__ */ i.jsxs("li", { style: { padding: "0.5rem 0" }, children: [
              "✓ ",
              l
            ] }, c)) }),
            /* @__PURE__ */ i.jsxs(
              X,
              {
                fullWidth: !0,
                variant: o.highlighted ? "primary" : "outline",
                children: [
                  "Choose ",
                  o.title
                ]
              }
            )
          ] })
        ]
      },
      a
    )) })
  ] }) })
] }), m1 = ({
  navigation: e = {
    title: "Dashboard",
    items: [
      { label: "Overview", href: "/dashboard" },
      { label: "Analytics", href: "/analytics" },
      { label: "Reports", href: "/reports" },
      { label: "Settings", href: "/settings" }
    ],
    actions: /* @__PURE__ */ i.jsx(X, { size: "sm", variant: "outline", children: "Logout" })
  },
  user: t = {
    name: "John Doe",
    role: "Administrator"
  },
  stats: r = [
    { label: "Total Sales", value: "$12,456", change: "+12%", trend: "up" },
    { label: "Active Users", value: "1,234", change: "+5%", trend: "up" },
    { label: "Conversion Rate", value: "3.4%", change: "-2%", trend: "down" },
    { label: "Avg. Order Value", value: "$156", change: "0%", trend: "neutral" }
  ],
  recentActivity: n = [
    { title: "New order received", description: "Order #1234 from customer", time: "2 min ago" },
    { title: "Payment processed", description: "Payment for order #1233", time: "15 min ago" },
    { title: "User registered", description: "New user: jane@example.com", time: "1 hour ago" },
    { title: "Report generated", description: "Monthly sales report ready", time: "2 hours ago" }
  ],
  quickActions: s = [
    { label: "New Order", icon: "📦" },
    { label: "Add Product", icon: "➕" },
    { label: "View Reports", icon: "📊" },
    { label: "Settings", icon: "⚙️" }
  ]
}) => {
  const o = (a) => {
    switch (a) {
      case "up":
        return "#10b981";
      case "down":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };
  return /* @__PURE__ */ i.jsxs(Wo, { navigation: e, footer: { show: !1 }, children: [
    /* @__PURE__ */ i.jsx(fv, { children: /* @__PURE__ */ i.jsx(Se, { children: /* @__PURE__ */ i.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 0" }, children: [
      /* @__PURE__ */ i.jsxs("div", { children: [
        /* @__PURE__ */ i.jsxs(Je, { size: "xl", children: [
          "Welcome back, ",
          t.name
        ] }),
        /* @__PURE__ */ i.jsx(W, { children: t.role })
      ] }),
      /* @__PURE__ */ i.jsx("div", { style: { display: "flex", gap: "1rem" }, children: s.map((a, l) => /* @__PURE__ */ i.jsxs(X, { onClick: a.onClick, children: [
        /* @__PURE__ */ i.jsx("span", { style: { marginRight: "0.5rem" }, children: a.icon }),
        a.label
      ] }, l)) })
    ] }) }) }),
    /* @__PURE__ */ i.jsx(hv, { children: /* @__PURE__ */ i.jsxs(Se, { children: [
      /* @__PURE__ */ i.jsx(Nt, { cols: 4, style: { marginBottom: "2rem" }, children: r.map((a, l) => /* @__PURE__ */ i.jsx(gt, { children: /* @__PURE__ */ i.jsxs(xt, { children: [
        /* @__PURE__ */ i.jsx(W, { size: "sm", style: { color: "#6b7280" }, children: a.label }),
        /* @__PURE__ */ i.jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: "0.5rem" }, children: [
          /* @__PURE__ */ i.jsx(W, { size: "2xl", weight: "bold", children: a.value }),
          a.change && /* @__PURE__ */ i.jsx(W, { size: "sm", style: { color: o(a.trend) }, children: a.change })
        ] })
      ] }) }, l)) }),
      /* @__PURE__ */ i.jsxs(Nt, { cols: 2, style: { gap: "2rem" }, children: [
        /* @__PURE__ */ i.jsxs(gt, { children: [
          /* @__PURE__ */ i.jsx(Bt, { children: /* @__PURE__ */ i.jsx(Ot, { children: "Analytics Overview" }) }),
          /* @__PURE__ */ i.jsx(xt, { children: /* @__PURE__ */ i.jsxs(Eo, { defaultValue: "weekly", children: [
            /* @__PURE__ */ i.jsxs(ws, { children: [
              /* @__PURE__ */ i.jsx(Mr, { value: "daily", children: "Daily" }),
              /* @__PURE__ */ i.jsx(Mr, { value: "weekly", children: "Weekly" }),
              /* @__PURE__ */ i.jsx(Mr, { value: "monthly", children: "Monthly" })
            ] }),
            /* @__PURE__ */ i.jsx(Ir, { value: "daily", children: /* @__PURE__ */ i.jsx("div", { style: { height: "300px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6", borderRadius: "0.5rem" }, children: /* @__PURE__ */ i.jsx(W, { children: "Daily Chart Placeholder" }) }) }),
            /* @__PURE__ */ i.jsx(Ir, { value: "weekly", children: /* @__PURE__ */ i.jsx("div", { style: { height: "300px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6", borderRadius: "0.5rem" }, children: /* @__PURE__ */ i.jsx(W, { children: "Weekly Chart Placeholder" }) }) }),
            /* @__PURE__ */ i.jsx(Ir, { value: "monthly", children: /* @__PURE__ */ i.jsx("div", { style: { height: "300px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6", borderRadius: "0.5rem" }, children: /* @__PURE__ */ i.jsx(W, { children: "Monthly Chart Placeholder" }) }) })
          ] }) })
        ] }),
        /* @__PURE__ */ i.jsxs(gt, { children: [
          /* @__PURE__ */ i.jsx(Bt, { children: /* @__PURE__ */ i.jsx(Ot, { children: "Recent Activity" }) }),
          /* @__PURE__ */ i.jsx(xt, { children: /* @__PURE__ */ i.jsx("div", { style: { display: "flex", flexDirection: "column", gap: "1rem" }, children: n.map((a, l) => /* @__PURE__ */ i.jsxs("div", { style: { padding: "1rem", background: "#f9fafb", borderRadius: "0.5rem" }, children: [
            /* @__PURE__ */ i.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }, children: [
              /* @__PURE__ */ i.jsx(W, { weight: "semibold", children: a.title }),
              /* @__PURE__ */ i.jsx(W, { size: "sm", style: { color: "#6b7280" }, children: a.time })
            ] }),
            /* @__PURE__ */ i.jsx(W, { size: "sm", style: { color: "#6b7280" }, children: a.description })
          ] }, l)) }) })
        ] })
      ] })
    ] }) })
  ] });
}, g1 = ({
  navigation: e = {
    title: "Marketplace",
    items: [
      { label: "Home", href: "/" },
      { label: "Browse", href: "/browse" },
      { label: "Sell", href: "/sell" },
      { label: "My Items", href: "/my-items" }
    ],
    actions: /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
      /* @__PURE__ */ i.jsx(X, { size: "sm", variant: "outline", children: "Cart (0)" }),
      /* @__PURE__ */ i.jsx(X, { size: "sm", children: "Sign In" })
    ] }),
    sticky: !0
  },
  hero: t = {
    title: "Find What You Need",
    subtitle: "Browse thousands of items from trusted sellers",
    searchPlaceholder: "Search for items..."
  },
  categories: r = [
    { label: "All Categories", value: "all", count: 1234 },
    { label: "Electronics", value: "electronics", count: 342 },
    { label: "Fashion", value: "fashion", count: 456 },
    { label: "Home & Garden", value: "home", count: 234 },
    { label: "Sports", value: "sports", count: 123 },
    { label: "Books", value: "books", count: 89 }
  ],
  items: n = [
    {
      id: "1",
      title: "Premium Headphones",
      description: "Wireless noise-canceling headphones with premium sound quality",
      price: "$299",
      category: "Electronics",
      seller: "TechStore",
      rating: 4.5,
      inStock: !0
    },
    {
      id: "2",
      title: "Vintage Camera",
      description: "Classic film camera in excellent condition",
      price: "$450",
      category: "Electronics",
      seller: "RetroShop",
      rating: 5,
      inStock: !0
    },
    {
      id: "3",
      title: "Designer Bag",
      description: "Authentic leather handbag with modern design",
      price: "$180",
      category: "Fashion",
      seller: "LuxuryGoods",
      rating: 4.8,
      inStock: !1
    },
    {
      id: "4",
      title: "Smart Watch",
      description: "Latest model with health tracking features",
      price: "$399",
      category: "Electronics",
      seller: "TechStore",
      rating: 4.2,
      inStock: !0
    },
    {
      id: "5",
      title: "Indoor Plant Set",
      description: "Collection of 5 easy-care indoor plants",
      price: "$75",
      category: "Home & Garden",
      seller: "GreenThumb",
      rating: 4.7,
      inStock: !0
    },
    {
      id: "6",
      title: "Yoga Mat",
      description: "Premium non-slip yoga mat with carrying strap",
      price: "$45",
      category: "Sports",
      seller: "FitGear",
      rating: 4.6,
      inStock: !0
    }
  ],
  filters: s = {
    showSearch: !0,
    showCategories: !0,
    showPriceRange: !0,
    showSort: !0
  }
}) => /* @__PURE__ */ i.jsxs(Wo, { navigation: e, children: [
  /* @__PURE__ */ i.jsx(Js, { spacing: "lg", style: { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }, children: /* @__PURE__ */ i.jsx(Se, { children: /* @__PURE__ */ i.jsxs("div", { style: { textAlign: "center", color: "white", padding: "2rem 0" }, children: [
    /* @__PURE__ */ i.jsx(Je, { size: "3xl", style: { color: "white", marginBottom: "1rem" }, children: t.title }),
    t.subtitle && /* @__PURE__ */ i.jsx(W, { size: "lg", style: { color: "rgba(255,255,255,0.9)", marginBottom: "2rem" }, children: t.subtitle }),
    (s == null ? void 0 : s.showSearch) && /* @__PURE__ */ i.jsx("div", { style: { maxWidth: "600px", margin: "0 auto" }, children: /* @__PURE__ */ i.jsx(
      qt,
      {
        placeholder: t.searchPlaceholder,
        inputSize: "lg",
        style: { width: "100%" }
      }
    ) })
  ] }) }) }),
  /* @__PURE__ */ i.jsx(Js, { spacing: "md", style: { borderBottom: "1px solid #e5e7eb" }, children: /* @__PURE__ */ i.jsx(Se, { children: /* @__PURE__ */ i.jsxs("div", { style: { display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }, children: [
    (s == null ? void 0 : s.showCategories) && /* @__PURE__ */ i.jsx(
      Yl,
      {
        placeholder: "All Categories",
        options: r.map((o) => ({
          value: o.value,
          label: `${o.label} (${o.count})`
        }))
      }
    ),
    (s == null ? void 0 : s.showPriceRange) && /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
      /* @__PURE__ */ i.jsx(qt, { placeholder: "Min Price", style: { width: "120px" } }),
      /* @__PURE__ */ i.jsx(qt, { placeholder: "Max Price", style: { width: "120px" } })
    ] }),
    (s == null ? void 0 : s.showSort) && /* @__PURE__ */ i.jsx(
      Yl,
      {
        style: { marginLeft: "auto" },
        options: [
          { value: "featured", label: "Sort by: Featured" },
          { value: "price-asc", label: "Price: Low to High" },
          { value: "price-desc", label: "Price: High to Low" },
          { value: "newest", label: "Newest First" },
          { value: "rating", label: "Best Rated" }
        ]
      }
    )
  ] }) }) }),
  /* @__PURE__ */ i.jsx(Js, { spacing: "xl", children: /* @__PURE__ */ i.jsxs(Se, { children: [
    /* @__PURE__ */ i.jsx(Nt, { cols: 3, style: { gap: "2rem" }, children: n.map((o) => /* @__PURE__ */ i.jsxs(gt, { className: "qwanyx-card--hover", children: [
      o.image && /* @__PURE__ */ i.jsx(pn, { src: o.image, alt: o.title }),
      !o.image && /* @__PURE__ */ i.jsx("div", { style: {
        height: "200px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "3rem"
      }, children: "📦" }),
      /* @__PURE__ */ i.jsxs(Bt, { children: [
        /* @__PURE__ */ i.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "start" }, children: [
          /* @__PURE__ */ i.jsxs("div", { children: [
            /* @__PURE__ */ i.jsx(Ot, { children: o.title }),
            /* @__PURE__ */ i.jsx(W, { size: "2xl", weight: "bold", style: { marginTop: "0.5rem" }, children: o.price })
          ] }),
          o.inStock !== void 0 && /* @__PURE__ */ i.jsx(bt, { color: o.inStock ? "success" : "error", variant: "subtle", children: o.inStock ? "In Stock" : "Out of Stock" })
        ] }),
        /* @__PURE__ */ i.jsx(xr, { children: o.description })
      ] }),
      /* @__PURE__ */ i.jsxs(xt, { children: [
        /* @__PURE__ */ i.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }, children: [
          /* @__PURE__ */ i.jsxs(W, { size: "sm", style: { color: "#6b7280" }, children: [
            o.category,
            " • ",
            o.seller
          ] }),
          o.rating && /* @__PURE__ */ i.jsxs(W, { size: "sm", children: [
            "⭐ ",
            o.rating
          ] })
        ] }),
        /* @__PURE__ */ i.jsxs("div", { style: { display: "flex", gap: "0.5rem" }, children: [
          /* @__PURE__ */ i.jsx(X, { fullWidth: !0, variant: "outline", children: "View Details" }),
          /* @__PURE__ */ i.jsx(X, { fullWidth: !0, disabled: !o.inStock, children: "Add to Cart" })
        ] })
      ] })
    ] }, o.id)) }),
    /* @__PURE__ */ i.jsx("div", { style: { textAlign: "center", marginTop: "3rem" }, children: /* @__PURE__ */ i.jsx(X, { size: "lg", variant: "outline", children: "Load More Items" }) })
  ] }) })
] }), x1 = ({
  id: e,
  title: t,
  subtitle: r,
  primaryAction: n,
  secondaryAction: s,
  backgroundImage: o,
  backgroundGradient: a,
  height: l = "70vh",
  variant: c = "centered"
}) => {
  const d = {
    default: { textAlign: "center" },
    centered: { textAlign: "center" },
    left: { textAlign: "left" },
    right: { textAlign: "right" }
  };
  return /* @__PURE__ */ i.jsx("section", { id: e, style: { position: "relative" }, children: /* @__PURE__ */ i.jsx(
    js,
    {
      backgroundImage: o,
      style: {
        height: l,
        background: a || void 0,
        backgroundImage: o ? `url(${o})` : void 0,
        backgroundSize: "cover",
        backgroundPosition: "center"
      },
      children: /* @__PURE__ */ i.jsx(Se, { children: /* @__PURE__ */ i.jsxs(Ss, { style: d[c], children: [
        /* @__PURE__ */ i.jsx(Cs, { children: t }),
        r && /* @__PURE__ */ i.jsx(ks, { children: r }),
        (n || s) && /* @__PURE__ */ i.jsxs(_s, { style: { justifyContent: c === "centered" ? "center" : `flex-${c === "right" ? "end" : "start"}` }, children: [
          n && /* @__PURE__ */ i.jsx(
            X,
            {
              size: "lg",
              onClick: n.onClick,
              children: n.label
            }
          ),
          s && /* @__PURE__ */ i.jsx(
            X,
            {
              size: "lg",
              variant: "outline",
              onClick: s.onClick,
              children: s.label
            }
          )
        ] })
      ] }) })
    }
  ) });
}, y1 = ({
  id: e,
  title: t,
  subtitle: r,
  features: n,
  columns: s = 3,
  variant: o = "default",
  backgroundColor: a
}) => /* @__PURE__ */ i.jsx(
  zt,
  {
    id: e,
    spacing: "xl",
    style: { backgroundColor: a },
    children: /* @__PURE__ */ i.jsxs(Se, { children: [
      (t || r) && /* @__PURE__ */ i.jsxs("div", { style: { textAlign: "center", marginBottom: "3rem" }, children: [
        t && /* @__PURE__ */ i.jsx(Je, { size: "2xl", children: t }),
        r && /* @__PURE__ */ i.jsx(W, { size: "lg", style: { marginTop: "1rem" }, children: r })
      ] }),
      /* @__PURE__ */ i.jsx(Ts, { cols: s === 6 ? 3 : s, children: n.map((l, c) => /* @__PURE__ */ i.jsxs(
        Vr,
        {
          className: o === "cards" ? "qwanyx-feature--card" : "",
          children: [
            /* @__PURE__ */ i.jsx(Lr, { children: (typeof l.icon == "string", l.icon) }),
            /* @__PURE__ */ i.jsx(Br, { children: l.title }),
            /* @__PURE__ */ i.jsx(Or, { children: l.description })
          ]
        },
        c
      )) })
    ] })
  }
), b1 = ({
  id: e,
  title: t,
  subtitle: r,
  primaryAction: n,
  secondaryAction: s,
  backgroundGradient: o,
  backgroundColor: a,
  variant: l = "centered"
}) => {
  const c = {
    background: o || a || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    position: "relative",
    overflow: "hidden"
  }, d = {
    default: {
      textAlign: "center",
      padding: "4rem 0"
    },
    centered: {
      textAlign: "center",
      padding: "5rem 0"
    },
    split: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "3rem 0"
    },
    minimal: {
      textAlign: "center",
      padding: "3rem 0"
    }
  };
  return /* @__PURE__ */ i.jsx(zt, { id: e, style: c, children: /* @__PURE__ */ i.jsx(Se, { children: /* @__PURE__ */ i.jsxs("div", { style: d[l], children: [
    /* @__PURE__ */ i.jsxs("div", { style: l === "split" ? { flex: 1 } : {}, children: [
      /* @__PURE__ */ i.jsx(
        Je,
        {
          size: l === "minimal" ? "xl" : "2xl",
          style: { color: "white", marginBottom: r ? "1rem" : "2rem" },
          children: t
        }
      ),
      r && /* @__PURE__ */ i.jsx(
        W,
        {
          size: "lg",
          style: {
            color: "rgba(255,255,255,0.9)",
            marginBottom: "2rem",
            maxWidth: l === "centered" ? "600px" : "none",
            margin: l === "centered" ? "0 auto 2rem" : "0 0 2rem 0"
          },
          children: r
        }
      )
    ] }),
    (n || s) && /* @__PURE__ */ i.jsxs("div", { style: {
      display: "flex",
      gap: "1rem",
      justifyContent: l === "split" ? "flex-end" : "center",
      flexWrap: "wrap"
    }, children: [
      n && /* @__PURE__ */ i.jsx(
        X,
        {
          size: "lg",
          variant: "solid",
          onClick: n.onClick,
          style: {
            backgroundColor: "white",
            color: "rgb(102, 126, 234)"
          },
          children: n.label
        }
      ),
      s && /* @__PURE__ */ i.jsx(
        X,
        {
          size: "lg",
          variant: "outline",
          onClick: s.onClick,
          style: {
            borderColor: "white",
            color: "white"
          },
          children: s.label
        }
      )
    ] })
  ] }) }) });
}, v1 = ({
  id: e,
  title: t,
  subtitle: r,
  testimonials: n,
  columns: s = 3,
  variant: o = "cards",
  backgroundColor: a
}) => /* @__PURE__ */ i.jsx(
  zt,
  {
    id: e,
    spacing: "xl",
    style: { backgroundColor: a || "#f8f9fa" },
    children: /* @__PURE__ */ i.jsxs(Se, { children: [
      (t || r) && /* @__PURE__ */ i.jsxs("div", { style: { textAlign: "center", marginBottom: "3rem" }, children: [
        t && /* @__PURE__ */ i.jsx(Je, { size: "2xl", children: t }),
        r && /* @__PURE__ */ i.jsx(W, { size: "lg", style: { marginTop: "1rem" }, children: r })
      ] }),
      /* @__PURE__ */ i.jsx(Nt, { cols: s, style: { gap: "2rem" }, children: n.map((l) => /* @__PURE__ */ i.jsx(gt, { className: o === "minimal" ? "qwanyx-card--borderless" : "", children: /* @__PURE__ */ i.jsxs(xt, { children: [
        l.rating && /* @__PURE__ */ i.jsx("div", { style: { marginBottom: "1rem" }, children: Array.from({ length: 5 }).map((c, d) => /* @__PURE__ */ i.jsx("span", { style: { color: d < l.rating ? "#fbbf24" : "#e5e7eb" }, children: "★" }, d)) }),
        o === "quotes" && /* @__PURE__ */ i.jsx(W, { size: "3xl", style: { opacity: 0.2, marginBottom: "-0.5rem" }, children: '"' }),
        /* @__PURE__ */ i.jsx(W, { style: {
          marginBottom: "1.5rem",
          fontStyle: o === "quotes" ? "italic" : "normal"
        }, children: l.content }),
        /* @__PURE__ */ i.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "1rem" }, children: [
          l.avatar && /* @__PURE__ */ i.jsx(
            vr,
            {
              src: l.avatar,
              alt: l.author,
              size: "md"
            }
          ),
          /* @__PURE__ */ i.jsxs("div", { children: [
            /* @__PURE__ */ i.jsx(W, { weight: "semibold", children: l.author }),
            (l.role || l.company) && /* @__PURE__ */ i.jsxs(W, { size: "sm", style: { color: "#6b7280" }, children: [
              l.role,
              l.role && l.company && " at ",
              l.company
            ] })
          ] })
        ] })
      ] }) }, l.id)) })
    ] })
  }
), w1 = ({
  id: e,
  title: t,
  subtitle: r,
  plans: n,
  columns: s = 3,
  backgroundColor: o
}) => /* @__PURE__ */ i.jsx(
  zt,
  {
    id: e,
    spacing: "xl",
    style: { backgroundColor: o },
    children: /* @__PURE__ */ i.jsxs(Se, { children: [
      (t || r) && /* @__PURE__ */ i.jsxs("div", { style: { textAlign: "center", marginBottom: "3rem" }, children: [
        t && /* @__PURE__ */ i.jsx(Je, { size: "2xl", children: t }),
        r && /* @__PURE__ */ i.jsx(W, { size: "lg", style: { marginTop: "1rem" }, children: r })
      ] }),
      /* @__PURE__ */ i.jsx(Nt, { cols: s, style: { gap: "2rem" }, children: n.map((a) => /* @__PURE__ */ i.jsxs(
        gt,
        {
          className: a.highlighted ? "qwanyx-card--highlighted" : "",
          style: a.highlighted ? {
            borderColor: "rgb(var(--qwanyx-primary))",
            borderWidth: "2px",
            transform: "scale(1.05)"
          } : {},
          children: [
            /* @__PURE__ */ i.jsxs(Bt, { children: [
              /* @__PURE__ */ i.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "start" }, children: [
                /* @__PURE__ */ i.jsx(Ot, { children: a.name }),
                a.badge && /* @__PURE__ */ i.jsx(bt, { color: "primary", variant: "subtle", children: a.badge })
              ] }),
              /* @__PURE__ */ i.jsxs("div", { style: { margin: "1rem 0" }, children: [
                /* @__PURE__ */ i.jsx(W, { size: "3xl", weight: "bold", children: a.price }),
                a.period && /* @__PURE__ */ i.jsxs(W, { size: "sm", style: { color: "#6b7280" }, children: [
                  "/",
                  a.period
                ] })
              ] }),
              a.description && /* @__PURE__ */ i.jsx(xr, { children: a.description })
            ] }),
            /* @__PURE__ */ i.jsxs(xt, { children: [
              /* @__PURE__ */ i.jsx("ul", { style: {
                listStyle: "none",
                padding: 0,
                marginBottom: "2rem"
              }, children: a.features.map((l, c) => /* @__PURE__ */ i.jsxs(
                "li",
                {
                  style: {
                    padding: "0.75rem 0",
                    borderBottom: c < a.features.length - 1 ? "1px solid #e5e7eb" : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  },
                  children: [
                    /* @__PURE__ */ i.jsx("span", { style: { color: "rgb(var(--qwanyx-primary))" }, children: "✓" }),
                    l
                  ]
                },
                c
              )) }),
              /* @__PURE__ */ i.jsx(
                X,
                {
                  fullWidth: !0,
                  variant: a.highlighted ? "primary" : "outline",
                  onClick: a.ctaAction,
                  children: a.ctaLabel || "Get Started"
                }
              )
            ] })
          ]
        },
        a.id
      )) })
    ] })
  }
), j1 = ({
  id: e,
  title: t,
  subtitle: r,
  description: n,
  primaryAction: s,
  secondaryAction: o,
  images: a,
  flipInterval: l = 3e3,
  flipDuration: c = 800,
  backgroundImage: d,
  backgroundOverlay: u = !0,
  overlayOpacity: f = 0.7,
  variant: h = "default",
  flipPosition: m = "right",
  flipSize: g = "md"
}) => {
  const [p, y] = V(!1);
  ie(() => {
    const C = () => {
      y(window.innerWidth <= 1270);
    };
    return C(), window.addEventListener("resize", C), () => window.removeEventListener("resize", C);
  }, []);
  const j = {
    position: "relative",
    minHeight: h === "compact" ? "500px" : "600px",
    paddingTop: "100px",
    // Account for fixed navbar with more space
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    ...d && {
      backgroundImage: `url(${d})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    }
  }, x = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `rgba(0, 0, 0, ${f})`,
    zIndex: 1
  }, b = {
    position: "relative",
    zIndex: 2,
    width: "100%",
    padding: h === "compact" ? "3rem 0" : "4rem 0"
  }, k = p ? {
    display: "flex",
    flexDirection: "column",
    gap: "3rem",
    alignItems: "center"
  } : {
    display: "grid",
    gridTemplateColumns: m === "right" ? "1fr auto" : "auto 1fr",
    gap: "4rem",
    alignItems: "center"
  }, A = {
    color: d ? "white" : "inherit",
    ...h === "centered" && { textAlign: "center" }
  }, R = {
    display: "flex",
    gap: "1rem",
    marginTop: "2rem",
    flexWrap: "wrap",
    ...h === "centered" && { justifyContent: "center" }
  };
  return /* @__PURE__ */ i.jsxs("section", { id: e, style: j, children: [
    d && u && /* @__PURE__ */ i.jsx("div", { style: x }),
    /* @__PURE__ */ i.jsx("div", { style: b, children: /* @__PURE__ */ i.jsx(Se, { children: /* @__PURE__ */ i.jsxs("div", { style: k, children: [
      !p && m === "left" && a.length >= 2 && /* @__PURE__ */ i.jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ i.jsx(
        xl,
        {
          images: a,
          flipDelay: { min: l - 1e3, max: l + 1e3 },
          flipDuration: c,
          size: {
            mobile: g === "sm" ? "200px" : g === "md" ? "250px" : g === "lg" ? "300px" : "350px",
            tablet: g === "sm" ? "250px" : g === "md" ? "300px" : g === "lg" ? "350px" : "400px",
            desktop: g === "sm" ? "300px" : g === "md" ? "350px" : g === "lg" ? "400px" : "450px"
          },
          gap: "20px"
        }
      ) }),
      /* @__PURE__ */ i.jsxs("div", { style: A, children: [
        /* @__PURE__ */ i.jsx(
          Je,
          {
            size: h === "compact" ? "3xl" : "4xl",
            style: {
              marginBottom: r ? "1rem" : "2rem",
              color: d ? "white" : void 0
            },
            children: t
          }
        ),
        r && /* @__PURE__ */ i.jsx(
          W,
          {
            size: "xl",
            style: {
              marginBottom: n ? "1rem" : "2rem",
              color: d ? "rgba(255,255,255,0.9)" : void 0,
              fontWeight: 500
            },
            children: r
          }
        ),
        n && /* @__PURE__ */ i.jsx(
          W,
          {
            size: "lg",
            style: {
              marginBottom: "2rem",
              color: d ? "rgba(255,255,255,0.8)" : void 0,
              maxWidth: h === "centered" ? "600px" : "none",
              margin: h === "centered" ? "0 auto 2rem" : "0 0 2rem 0"
            },
            children: n
          }
        ),
        (s || o) && /* @__PURE__ */ i.jsxs("div", { style: R, children: [
          s && /* @__PURE__ */ i.jsxs(
            X,
            {
              size: "lg",
              onClick: s.onClick,
              style: d ? {
                backgroundColor: "rgb(var(--qwanyx-primary))",
                color: "white",
                border: "none"
              } : void 0,
              children: [
                s.icon && /* @__PURE__ */ i.jsx("span", { style: { marginRight: "0.5rem" }, children: s.icon }),
                s.label
              ]
            }
          ),
          o && /* @__PURE__ */ i.jsxs(
            X,
            {
              size: "lg",
              variant: "outline",
              onClick: o.onClick,
              style: d ? {
                borderColor: "white",
                color: "white"
              } : void 0,
              children: [
                o.icon && /* @__PURE__ */ i.jsx("span", { style: { marginRight: "0.5rem" }, children: o.icon }),
                o.label
              ]
            }
          )
        ] })
      ] }),
      (p && a.length >= 2 || !p && m === "right" && a.length >= 2) && /* @__PURE__ */ i.jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ i.jsx(
        xl,
        {
          images: a,
          flipDelay: { min: l - 1e3, max: l + 1e3 },
          flipDuration: c,
          size: {
            mobile: g === "sm" ? "200px" : g === "md" ? "250px" : g === "lg" ? "300px" : "350px",
            tablet: g === "sm" ? "250px" : g === "md" ? "300px" : g === "lg" ? "350px" : "400px",
            desktop: g === "sm" ? "300px" : g === "md" ? "350px" : g === "lg" ? "400px" : "450px"
          },
          gap: "20px"
        }
      ) })
    ] }) }) })
  ] });
}, C1 = ({
  logo: e,
  title: t,
  description: r,
  address: n,
  phone: s,
  email: o,
  links: a = [],
  socials: l = [],
  copyright: c,
  className: d = "",
  bgColor: u = "card",
  textColor: f
}) => {
  const m = ["card", "background", "primary", "secondary", "accent", "success", "warning", "error", "info"].includes(u) ? `qwanyx-bg-${u}` : "", g = !m && u ? { backgroundColor: u } : {};
  return /* @__PURE__ */ i.jsxs(
    "footer",
    {
      className: `${m || ""} qwanyx-border-t qwanyx-mt-20 ${d}`,
      style: { ...g, paddingTop: "2rem", paddingBottom: "2rem" },
      children: [
        /* @__PURE__ */ i.jsx(Se, { children: /* @__PURE__ */ i.jsx("div", { children: /* @__PURE__ */ i.jsxs(Nt, { cols: 3, gap: "xl", responsive: !0, children: [
          /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-space-y-4", children: [
            (e || t) && /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-flex qwanyx-items-center qwanyx-gap-3", children: [
              e,
              t && /* @__PURE__ */ i.jsx(W, { size: "lg", color: f || "secondary", children: t })
            ] }),
            r && /* @__PURE__ */ i.jsx(W, { size: "sm", color: f || "secondary", children: r }),
            n && /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-flex qwanyx-items-start qwanyx-gap-2 qwanyx-mt-3", children: [
              /* @__PURE__ */ i.jsx(Q, { name: "LocationOn", size: "sm", color: f || "secondary" }),
              /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-space-y-1", children: [
                n.street && /* @__PURE__ */ i.jsx(W, { size: "sm", color: f || "secondary", children: n.street }),
                n.city && /* @__PURE__ */ i.jsx(W, { size: "sm", color: f || "secondary", children: n.city }),
                n.country && /* @__PURE__ */ i.jsx(W, { size: "sm", color: f || "secondary", children: n.country })
              ] })
            ] }),
            s && /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-flex qwanyx-items-center qwanyx-gap-2 qwanyx-mt-2", children: [
              /* @__PURE__ */ i.jsx(Q, { name: "Phone", size: "sm", color: f || "secondary" }),
              /* @__PURE__ */ i.jsx(W, { size: "sm", color: f || "secondary", children: s })
            ] }),
            o && /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-flex qwanyx-items-center qwanyx-gap-2 qwanyx-mt-2", children: [
              /* @__PURE__ */ i.jsx(Q, { name: "Mail", size: "sm", color: f || "secondary" }),
              /* @__PURE__ */ i.jsx(W, { size: "sm", color: f || "secondary", children: /* @__PURE__ */ i.jsx(
                "a",
                {
                  href: `mailto:${o}`,
                  className: "qwanyx-text-inherit qwanyx-no-underline qwanyx-hover-text-primary",
                  children: o
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ i.jsx("div", { className: "qwanyx-space-y-3" }),
          /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-space-y-4", children: [
            a.length > 0 && /* @__PURE__ */ i.jsx("nav", { className: "qwanyx-space-y-2", children: a.map((p, y) => /* @__PURE__ */ i.jsx("div", { children: /* @__PURE__ */ i.jsxs(
              "a",
              {
                href: p.href || "#",
                onClick: p.onClick,
                className: `qwanyx-flex qwanyx-items-center qwanyx-gap-2 qwanyx-text-sm ${f ? "" : "qwanyx-text-secondary"} qwanyx-hover-text-primary qwanyx-transition-colors`,
                style: f && !f.includes("var(") ? { color: f } : {},
                children: [
                  /* @__PURE__ */ i.jsx(Q, { name: "ChevronRight", size: "xs", color: f }),
                  p.label
                ]
              }
            ) }, y)) }),
            l.length > 0 && /* @__PURE__ */ i.jsx("div", { className: "qwanyx-flex qwanyx-gap-3 qwanyx-mt-6", children: l.map((p, y) => /* @__PURE__ */ i.jsx(
              "a",
              {
                href: p.href || "#",
                onClick: p.onClick,
                "aria-label": p.label || p.icon,
                className: `${f ? "" : "qwanyx-text-secondary"} qwanyx-hover-text-primary qwanyx-transition-colors`,
                style: f && !f.includes("var(") ? { color: f } : {},
                children: /* @__PURE__ */ i.jsx(Q, { name: p.icon, size: "md", color: f })
              },
              y
            )) })
          ] })
        ] }) }) }),
        c && /* @__PURE__ */ i.jsx("div", { className: "qwanyx-mt-12 qwanyx-pt-8 qwanyx-border-t qwanyx-border-border", children: /* @__PURE__ */ i.jsx(Se, { children: /* @__PURE__ */ i.jsx(W, { size: "xs", color: f || "muted", align: "center", children: c }) }) })
      ]
    }
  );
}, pv = [
  { name: "name", label: "Name", type: "text", placeholder: "Your name", required: !0 },
  { name: "email", label: "Email", type: "email", placeholder: "your@email.com", required: !0 },
  { name: "message", label: "Message", type: "textarea", placeholder: "Your message...", rows: 6, required: !0 }
], k1 = [
  { name: "firstname", label: "First Name", type: "text", placeholder: "John", required: !0 },
  { name: "lastname", label: "Last Name", type: "text", placeholder: "Doe", required: !0 },
  { name: "email", label: "Email", type: "email", placeholder: "john@example.com", required: !0 },
  { name: "phone", label: "Phone", type: "tel", placeholder: "+1 (555) 000-0000" },
  { name: "subject", label: "Subject", type: "text", placeholder: "How can we help?", required: !0 },
  { name: "message", label: "Message", type: "textarea", placeholder: "Tell us more...", rows: 6, required: !0 }
], S1 = [
  { name: "firstname", label: "First Name", type: "text", placeholder: "John", required: !0 },
  { name: "lastname", label: "Last Name", type: "text", placeholder: "Doe", required: !0 },
  { name: "company", label: "Company", type: "text", placeholder: "Acme Inc." },
  { name: "email", label: "Email", type: "email", placeholder: "john@company.com", required: !0 },
  { name: "phone", label: "Phone", type: "tel", placeholder: "+1 (555) 000-0000", required: !0 },
  { name: "department", label: "Department", type: "select", options: ["Sales", "Support", "Technical", "Partnership", "Other"] },
  { name: "message", label: "Message", type: "textarea", placeholder: "Tell us about your needs...", rows: 6, required: !0 }
], mv = pv, _1 = ({
  title: e = "Contactez-nous",
  subtitle: t = "Pour toute question, suggestion ou reporter une correction",
  fields: r = mv,
  submitText: n = "Envoyer",
  onSubmit: s,
  backgroundImage: o,
  overlayOpacity: a = 0.7,
  parallax: l = "none",
  className: c = ""
}) => {
  const [d, u] = V({}), [f, h] = V(!1), m = (y, j) => {
    u((x) => ({ ...x, [y]: j }));
  }, g = async (y) => {
    if (y.preventDefault(), s) {
      h(!0);
      try {
        await s(d), u({});
      } catch (j) {
        console.error("Form submission error:", j);
      } finally {
        h(!1);
      }
    }
  }, p = (y) => {
    var x;
    const j = d[y.name] || "";
    switch (y.type) {
      case "textarea":
        return /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-space-y-2", children: [
          /* @__PURE__ */ i.jsx("label", { className: "qwanyx-text-sm qwanyx-font-medium qwanyx-text-secondary", children: y.label }),
          /* @__PURE__ */ i.jsx(
            So,
            {
              placeholder: y.placeholder,
              value: j,
              onChange: (b) => m(y.name, b.target.value),
              required: y.required,
              rows: y.rows,
              fullWidth: !0
            }
          )
        ] });
      case "select":
        return /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-space-y-2", children: [
          /* @__PURE__ */ i.jsx("label", { className: "qwanyx-text-sm qwanyx-font-medium qwanyx-text-secondary", children: y.label }),
          /* @__PURE__ */ i.jsxs(
            "select",
            {
              className: "qwanyx-input qwanyx-w-full",
              value: j,
              onChange: (b) => m(y.name, b.target.value),
              required: y.required,
              children: [
                /* @__PURE__ */ i.jsx("option", { value: "", children: y.placeholder || `Select ${y.label}` }),
                (x = y.options) == null ? void 0 : x.map((b) => /* @__PURE__ */ i.jsx("option", { value: b, children: b }, b))
              ]
            }
          )
        ] });
      default:
        return /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-space-y-2", children: [
          /* @__PURE__ */ i.jsx("label", { className: "qwanyx-text-sm qwanyx-font-medium qwanyx-text-secondary", children: y.label }),
          /* @__PURE__ */ i.jsx(
            qt,
            {
              type: y.type,
              placeholder: y.placeholder,
              value: j,
              onChange: (b) => m(y.name, b.target.value),
              required: y.required,
              fullWidth: !0
            }
          )
        ] });
    }
  };
  return /* @__PURE__ */ i.jsxs(
    "section",
    {
      className: `qwanyx-relative qwanyx-overflow-hidden qwanyx-flex qwanyx-items-center qwanyx-justify-center ${c}`,
      style: {
        paddingTop: "2rem",
        paddingBottom: "3.4rem",
        ...o ? {
          backgroundImage: `url(${o})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: l === "fixed" ? "fixed" : "scroll"
        } : {}
      },
      children: [
        o && /* @__PURE__ */ i.jsx(
          "div",
          {
            className: "qwanyx-absolute qwanyx-inset-0 qwanyx-bg-black",
            style: { opacity: a }
          }
        ),
        /* @__PURE__ */ i.jsxs("div", { style: {
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "750px",
          margin: "0 auto",
          padding: "0 1rem"
        }, children: [
          /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-text-center qwanyx-mb-8", children: [
            e && /* @__PURE__ */ i.jsx("h2", { className: `qwanyx-text-4xl qwanyx-font-bold qwanyx-mb-4 ${o ? "qwanyx-text-white" : "qwanyx-text-text-primary"}`, style: {
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: o ? "white" : "var(--qwanyx-text-primary)"
            }, children: e }),
            t && /* @__PURE__ */ i.jsx("p", { className: `qwanyx-text-lg ${o ? "qwanyx-text-gray-200" : "qwanyx-text-text-secondary"}`, style: {
              fontSize: "1.125rem",
              color: o ? "#e5e7eb" : "var(--qwanyx-text-secondary)",
              marginBottom: "2rem"
            }, children: t })
          ] }),
          /* @__PURE__ */ i.jsx(gt, { className: "qwanyx-shadow-2xl", children: /* @__PURE__ */ i.jsx(xt, { children: /* @__PURE__ */ i.jsxs("form", { onSubmit: g, className: "qwanyx-space-y-4", children: [
            r.map((y) => /* @__PURE__ */ i.jsx("div", { children: p(y) }, y.name)),
            /* @__PURE__ */ i.jsx(
              X,
              {
                type: "submit",
                size: "lg",
                fullWidth: !0,
                disabled: f,
                children: f ? "Envoi en cours..." : n
              }
            )
          ] }) }) })
        ] })
      ]
    }
  );
}, gv = /* @__PURE__ */ $("ZodISODateTime", (e, t) => {
  $0.init(e, t), Re.init(e, t);
});
function xv(e) {
  return Ib(gv, e);
}
const yv = /* @__PURE__ */ $("ZodISODate", (e, t) => {
  M0.init(e, t), Re.init(e, t);
});
function bv(e) {
  return Vb(yv, e);
}
const vv = /* @__PURE__ */ $("ZodISOTime", (e, t) => {
  I0.init(e, t), Re.init(e, t);
});
function wv(e) {
  return Lb(vv, e);
}
const jv = /* @__PURE__ */ $("ZodISODuration", (e, t) => {
  V0.init(e, t), Re.init(e, t);
});
function Cv(e) {
  return Bb(jv, e);
}
const kv = (e, t) => {
  Lo.init(e, t), e.name = "ZodError", Object.defineProperties(e, {
    format: {
      value: (r) => My(e, r)
      // enumerable: false,
    },
    flatten: {
      value: (r) => $y(e, r)
      // enumerable: false,
    },
    addIssue: {
      value: (r) => {
        e.issues.push(r), e.message = JSON.stringify(e.issues, Ri, 2);
      }
      // enumerable: false,
    },
    addIssues: {
      value: (r) => {
        e.issues.push(...r), e.message = JSON.stringify(e.issues, Ri, 2);
      }
      // enumerable: false,
    },
    isEmpty: {
      get() {
        return e.issues.length === 0;
      }
      // enumerable: false,
    }
  });
}, Ps = $("ZodError", kv, {
  Parent: Error
}), Sv = /* @__PURE__ */ lu(Ps), _v = /* @__PURE__ */ cu(Ps), Tv = /* @__PURE__ */ du(Ps), Ev = /* @__PURE__ */ uu(Ps), Ye = /* @__PURE__ */ $("ZodType", (e, t) => (Ue.init(e, t), e.def = t, Object.defineProperty(e, "_def", { value: t }), e.check = (...r) => e.clone(
  {
    ...t,
    checks: [
      ...t.checks ?? [],
      ...r.map((n) => typeof n == "function" ? { _zod: { check: n, def: { check: "custom" }, onattach: [] } } : n)
    ]
  }
  // { parent: true }
), e.clone = (r, n) => jr(e, r, n), e.brand = () => e, e.register = ((r, n) => (r.add(e, n), e)), e.parse = (r, n) => Sv(e, r, n, { callee: e.parse }), e.safeParse = (r, n) => Tv(e, r, n), e.parseAsync = async (r, n) => _v(e, r, n, { callee: e.parseAsync }), e.safeParseAsync = async (r, n) => Ev(e, r, n), e.spa = e.safeParseAsync, e.refine = (r, n) => e.check(ww(r, n)), e.superRefine = (r) => e.check(jw(r)), e.overwrite = (r) => e.check(Pn(r)), e.optional = () => Jl(e), e.nullable = () => Ql(e), e.nullish = () => Jl(Ql(e)), e.nonoptional = (r) => pw(e, r), e.array = () => Qv(e), e.or = (r) => nw([e, r]), e.and = (r) => iw(e, r), e.transform = (r) => ec(e, lw(r)), e.default = (r) => uw(e, r), e.prefault = (r) => hw(e, r), e.catch = (r) => gw(e, r), e.pipe = (r) => ec(e, r), e.readonly = () => bw(e), e.describe = (r) => {
  const n = e.clone();
  return On.add(n, { description: r }), n;
}, Object.defineProperty(e, "description", {
  get() {
    var r;
    return (r = On.get(e)) == null ? void 0 : r.description;
  },
  configurable: !0
}), e.meta = (...r) => {
  if (r.length === 0)
    return On.get(e);
  const n = e.clone();
  return On.add(n, r[0]), n;
}, e.isOptional = () => e.safeParse(void 0).success, e.isNullable = () => e.safeParse(null).success, e)), yu = /* @__PURE__ */ $("_ZodString", (e, t) => {
  Bo.init(e, t), Ye.init(e, t);
  const r = e._zod.bag;
  e.format = r.format ?? null, e.minLength = r.minimum ?? null, e.maxLength = r.maximum ?? null, e.regex = (...n) => e.check(Ub(...n)), e.includes = (...n) => e.check(Yb(...n)), e.startsWith = (...n) => e.check(Gb(...n)), e.endsWith = (...n) => e.check(Kb(...n)), e.min = (...n) => e.check(fs(...n)), e.max = (...n) => e.check(gu(...n)), e.length = (...n) => e.check(xu(...n)), e.nonempty = (...n) => e.check(fs(1, ...n)), e.lowercase = (n) => e.check(Zb(n)), e.uppercase = (n) => e.check(Hb(n)), e.trim = () => e.check(Jb()), e.normalize = (...n) => e.check(Xb(...n)), e.toLowerCase = () => e.check(Qb()), e.toUpperCase = () => e.check(ev());
}), Rv = /* @__PURE__ */ $("ZodString", (e, t) => {
  Bo.init(e, t), yu.init(e, t), e.email = (r) => e.check(xb(Av, r)), e.url = (r) => e.check(jb(zv, r)), e.jwt = (r) => e.check(Mb(Zv, r)), e.emoji = (r) => e.check(Cb(Pv, r)), e.guid = (r) => e.check(Zl(Kl, r)), e.uuid = (r) => e.check(yb(Un, r)), e.uuidv4 = (r) => e.check(bb(Un, r)), e.uuidv6 = (r) => e.check(vb(Un, r)), e.uuidv7 = (r) => e.check(wb(Un, r)), e.nanoid = (r) => e.check(kb(Nv, r)), e.guid = (r) => e.check(Zl(Kl, r)), e.cuid = (r) => e.check(Sb(Fv, r)), e.cuid2 = (r) => e.check(_b(Dv, r)), e.ulid = (r) => e.check(Tb($v, r)), e.base64 = (r) => e.check(Fb(qv, r)), e.base64url = (r) => e.check(Db(Wv, r)), e.xid = (r) => e.check(Eb(Mv, r)), e.ksuid = (r) => e.check(Rb(Iv, r)), e.ipv4 = (r) => e.check(Ab(Vv, r)), e.ipv6 = (r) => e.check(zb(Lv, r)), e.cidrv4 = (r) => e.check(Pb(Bv, r)), e.cidrv6 = (r) => e.check(Nb(Ov, r)), e.e164 = (r) => e.check($b(Uv, r)), e.datetime = (r) => e.check(xv(r)), e.date = (r) => e.check(bv(r)), e.time = (r) => e.check(wv(r)), e.duration = (r) => e.check(Cv(r));
});
function Wn(e) {
  return gb(Rv, e);
}
const Re = /* @__PURE__ */ $("ZodStringFormat", (e, t) => {
  _e.init(e, t), yu.init(e, t);
}), Av = /* @__PURE__ */ $("ZodEmail", (e, t) => {
  T0.init(e, t), Re.init(e, t);
}), Kl = /* @__PURE__ */ $("ZodGUID", (e, t) => {
  S0.init(e, t), Re.init(e, t);
}), Un = /* @__PURE__ */ $("ZodUUID", (e, t) => {
  _0.init(e, t), Re.init(e, t);
}), zv = /* @__PURE__ */ $("ZodURL", (e, t) => {
  E0.init(e, t), Re.init(e, t);
}), Pv = /* @__PURE__ */ $("ZodEmoji", (e, t) => {
  R0.init(e, t), Re.init(e, t);
}), Nv = /* @__PURE__ */ $("ZodNanoID", (e, t) => {
  A0.init(e, t), Re.init(e, t);
}), Fv = /* @__PURE__ */ $("ZodCUID", (e, t) => {
  z0.init(e, t), Re.init(e, t);
}), Dv = /* @__PURE__ */ $("ZodCUID2", (e, t) => {
  P0.init(e, t), Re.init(e, t);
}), $v = /* @__PURE__ */ $("ZodULID", (e, t) => {
  N0.init(e, t), Re.init(e, t);
}), Mv = /* @__PURE__ */ $("ZodXID", (e, t) => {
  F0.init(e, t), Re.init(e, t);
}), Iv = /* @__PURE__ */ $("ZodKSUID", (e, t) => {
  D0.init(e, t), Re.init(e, t);
}), Vv = /* @__PURE__ */ $("ZodIPv4", (e, t) => {
  L0.init(e, t), Re.init(e, t);
}), Lv = /* @__PURE__ */ $("ZodIPv6", (e, t) => {
  B0.init(e, t), Re.init(e, t);
}), Bv = /* @__PURE__ */ $("ZodCIDRv4", (e, t) => {
  O0.init(e, t), Re.init(e, t);
}), Ov = /* @__PURE__ */ $("ZodCIDRv6", (e, t) => {
  q0.init(e, t), Re.init(e, t);
}), qv = /* @__PURE__ */ $("ZodBase64", (e, t) => {
  W0.init(e, t), Re.init(e, t);
}), Wv = /* @__PURE__ */ $("ZodBase64URL", (e, t) => {
  Z0.init(e, t), Re.init(e, t);
}), Uv = /* @__PURE__ */ $("ZodE164", (e, t) => {
  H0.init(e, t), Re.init(e, t);
}), Zv = /* @__PURE__ */ $("ZodJWT", (e, t) => {
  G0.init(e, t), Re.init(e, t);
}), Hv = /* @__PURE__ */ $("ZodBoolean", (e, t) => {
  K0.init(e, t), Ye.init(e, t);
});
function Yv(e) {
  return Ob(Hv, e);
}
const Gv = /* @__PURE__ */ $("ZodUnknown", (e, t) => {
  X0.init(e, t), Ye.init(e, t);
});
function Xl() {
  return qb(Gv);
}
const Kv = /* @__PURE__ */ $("ZodNever", (e, t) => {
  J0.init(e, t), Ye.init(e, t);
});
function Xv(e) {
  return Wb(Kv, e);
}
const Jv = /* @__PURE__ */ $("ZodArray", (e, t) => {
  Q0.init(e, t), Ye.init(e, t), e.element = t.element, e.min = (r, n) => e.check(fs(r, n)), e.nonempty = (r) => e.check(fs(1, r)), e.max = (r, n) => e.check(gu(r, n)), e.length = (r, n) => e.check(xu(r, n)), e.unwrap = () => e.element;
});
function Qv(e, t) {
  return tv(Jv, e, t);
}
const ew = /* @__PURE__ */ $("ZodObject", (e, t) => {
  eb.init(e, t), Ye.init(e, t), we(e, "shape", () => t.shape), e.keyof = () => ow(Object.keys(e._zod.def.shape)), e.catchall = (r) => e.clone({ ...e._zod.def, catchall: r }), e.passthrough = () => e.clone({ ...e._zod.def, catchall: Xl() }), e.loose = () => e.clone({ ...e._zod.def, catchall: Xl() }), e.strict = () => e.clone({ ...e._zod.def, catchall: Xv() }), e.strip = () => e.clone({ ...e._zod.def, catchall: void 0 }), e.extend = (r) => Py(e, r), e.merge = (r) => Ny(e, r), e.pick = (r) => Ay(e, r), e.omit = (r) => zy(e, r), e.partial = (...r) => Fy(bu, e, r[0]), e.required = (...r) => Dy(vu, e, r[0]);
});
function tw(e, t) {
  const r = {
    type: "object",
    get shape() {
      return wr(this, "shape", e ? _y(e) : {}), this.shape;
    },
    ...te(t)
  };
  return new ew(r);
}
const rw = /* @__PURE__ */ $("ZodUnion", (e, t) => {
  tb.init(e, t), Ye.init(e, t), e.options = t.options;
});
function nw(e, t) {
  return new rw({
    type: "union",
    options: e,
    ...te(t)
  });
}
const sw = /* @__PURE__ */ $("ZodIntersection", (e, t) => {
  rb.init(e, t), Ye.init(e, t);
});
function iw(e, t) {
  return new sw({
    type: "intersection",
    left: e,
    right: t
  });
}
const Pi = /* @__PURE__ */ $("ZodEnum", (e, t) => {
  nb.init(e, t), Ye.init(e, t), e.enum = t.entries, e.options = Object.values(t.entries);
  const r = new Set(Object.keys(t.entries));
  e.extract = (n, s) => {
    const o = {};
    for (const a of n)
      if (r.has(a))
        o[a] = t.entries[a];
      else
        throw new Error(`Key ${a} not found in enum`);
    return new Pi({
      ...t,
      checks: [],
      ...te(s),
      entries: o
    });
  }, e.exclude = (n, s) => {
    const o = { ...t.entries };
    for (const a of n)
      if (r.has(a))
        delete o[a];
      else
        throw new Error(`Key ${a} not found in enum`);
    return new Pi({
      ...t,
      checks: [],
      ...te(s),
      entries: o
    });
  };
});
function ow(e, t) {
  const r = Array.isArray(e) ? Object.fromEntries(e.map((n) => [n, n])) : e;
  return new Pi({
    type: "enum",
    entries: r,
    ...te(t)
  });
}
const aw = /* @__PURE__ */ $("ZodTransform", (e, t) => {
  sb.init(e, t), Ye.init(e, t), e._zod.parse = (r, n) => {
    r.addIssue = (o) => {
      if (typeof o == "string")
        r.issues.push(Sn(o, r.value, t));
      else {
        const a = o;
        a.fatal && (a.continue = !1), a.code ?? (a.code = "custom"), a.input ?? (a.input = r.value), a.inst ?? (a.inst = e), r.issues.push(Sn(a));
      }
    };
    const s = t.transform(r.value, r);
    return s instanceof Promise ? s.then((o) => (r.value = o, r)) : (r.value = s, r);
  };
});
function lw(e) {
  return new aw({
    type: "transform",
    transform: e
  });
}
const bu = /* @__PURE__ */ $("ZodOptional", (e, t) => {
  ib.init(e, t), Ye.init(e, t), e.unwrap = () => e._zod.def.innerType;
});
function Jl(e) {
  return new bu({
    type: "optional",
    innerType: e
  });
}
const cw = /* @__PURE__ */ $("ZodNullable", (e, t) => {
  ob.init(e, t), Ye.init(e, t), e.unwrap = () => e._zod.def.innerType;
});
function Ql(e) {
  return new cw({
    type: "nullable",
    innerType: e
  });
}
const dw = /* @__PURE__ */ $("ZodDefault", (e, t) => {
  ab.init(e, t), Ye.init(e, t), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
});
function uw(e, t) {
  return new dw({
    type: "default",
    innerType: e,
    get defaultValue() {
      return typeof t == "function" ? t() : iu(t);
    }
  });
}
const fw = /* @__PURE__ */ $("ZodPrefault", (e, t) => {
  lb.init(e, t), Ye.init(e, t), e.unwrap = () => e._zod.def.innerType;
});
function hw(e, t) {
  return new fw({
    type: "prefault",
    innerType: e,
    get defaultValue() {
      return typeof t == "function" ? t() : iu(t);
    }
  });
}
const vu = /* @__PURE__ */ $("ZodNonOptional", (e, t) => {
  cb.init(e, t), Ye.init(e, t), e.unwrap = () => e._zod.def.innerType;
});
function pw(e, t) {
  return new vu({
    type: "nonoptional",
    innerType: e,
    ...te(t)
  });
}
const mw = /* @__PURE__ */ $("ZodCatch", (e, t) => {
  db.init(e, t), Ye.init(e, t), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
});
function gw(e, t) {
  return new mw({
    type: "catch",
    innerType: e,
    catchValue: typeof t == "function" ? t : () => t
  });
}
const xw = /* @__PURE__ */ $("ZodPipe", (e, t) => {
  ub.init(e, t), Ye.init(e, t), e.in = t.in, e.out = t.out;
});
function ec(e, t) {
  return new xw({
    type: "pipe",
    in: e,
    out: t
    // ...util.normalizeParams(params),
  });
}
const yw = /* @__PURE__ */ $("ZodReadonly", (e, t) => {
  fb.init(e, t), Ye.init(e, t), e.unwrap = () => e._zod.def.innerType;
});
function bw(e) {
  return new yw({
    type: "readonly",
    innerType: e
  });
}
const vw = /* @__PURE__ */ $("ZodCustom", (e, t) => {
  hb.init(e, t), Ye.init(e, t);
});
function ww(e, t = {}) {
  return rv(vw, e, t);
}
function jw(e) {
  return nv(e);
}
const Cw = tw({
  name: Wn().min(2, "Name must be at least 2 characters"),
  email: Wn().email("Invalid email address"),
  subject: Wn().min(1, "Please select a subject"),
  message: Wn().min(10, "Message must be at least 10 characters"),
  terms: Yv().refine((e) => e === !0, {
    message: "You must accept the terms"
  })
}), T1 = ({
  companyName: e = "QWANYX",
  tagline: t = "Build Amazing Digital Experiences"
}) => {
  const [r, n] = V(!1);
  P.useEffect(() => {
    const l = () => {
      n(window.scrollY > 50);
    };
    return window.addEventListener("scroll", l), () => window.removeEventListener("scroll", l);
  }, []);
  const s = (l) => {
    console.log("Contact form submitted:", l), alert("Thank you for your message! We will get back to you soon.");
  }, o = [
    { value: "", label: "Choose a subject", disabled: !0 },
    { value: "general", label: "General Inquiry" },
    { value: "support", label: "Technical Support" },
    { value: "sales", label: "Sales" },
    { value: "partnership", label: "Partnership" },
    { value: "other", label: "Other" }
  ], a = [
    { label: "Home", href: "#home", active: !0 },
    { label: "Features", href: "#features" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" }
  ];
  return /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    /* @__PURE__ */ i.jsx(wy, { autoDetect: !0 }),
    /* @__PURE__ */ i.jsx(
      oy,
      {
        title: e,
        fixed: !0,
        className: `transition-all duration-300 ${r ? "bg-white shadow-lg" : "bg-transparent"}`,
        items: a,
        actions: /* @__PURE__ */ i.jsx(X, { variant: "solid", color: "primary", size: "sm", children: "Get Started" })
      }
    ),
    /* @__PURE__ */ i.jsx(
      js,
      {
        id: "home",
        size: "lg",
        className: "bg-gradient-to-br from-blue-600 to-purple-600 text-white",
        style: { paddingTop: "100px" },
        children: /* @__PURE__ */ i.jsxs(Ss, { children: [
          /* @__PURE__ */ i.jsx(Cs, { className: "text-5xl md:text-6xl font-bold mb-6", children: t }),
          /* @__PURE__ */ i.jsx(ks, { className: "text-xl md:text-2xl mb-8 opacity-90", children: "Transform your ideas into reality with our cutting-edge solutions" }),
          /* @__PURE__ */ i.jsxs(_s, { children: [
            /* @__PURE__ */ i.jsx(X, { size: "lg", variant: "solid", className: "bg-white text-gray-900 hover:bg-gray-100", children: "Start Free Trial" }),
            /* @__PURE__ */ i.jsx(X, { size: "lg", variant: "outline", className: "border-white text-white hover:bg-white hover:text-gray-900", children: "Watch Demo" })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ i.jsx(zt, { id: "features", spacing: "xl", className: "bg-gray-50", children: /* @__PURE__ */ i.jsxs(Se, { children: [
      /* @__PURE__ */ i.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ i.jsxs(Je, { as: "h2", className: "text-4xl font-bold mb-4", children: [
          "Why Choose ",
          e,
          "?"
        ] }),
        /* @__PURE__ */ i.jsx(W, { className: "text-xl text-gray-600", children: "Discover the features that make us stand out" })
      ] }),
      /* @__PURE__ */ i.jsxs(Ts, { cols: 3, children: [
        /* @__PURE__ */ i.jsxs(Vr, { centered: !0, children: [
          /* @__PURE__ */ i.jsx(Lr, { size: "lg", color: "primary", className: "mb-4", children: /* @__PURE__ */ i.jsx("svg", { className: "w-12 h-12", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ i.jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M13 10V3L4 14h7v7l9-11h-7z"
            }
          ) }) }),
          /* @__PURE__ */ i.jsx(Br, { className: "text-xl font-semibold mb-2", children: "Lightning Fast" }),
          /* @__PURE__ */ i.jsx(Or, { className: "text-gray-600", children: "Optimized performance with incredible speed. Your applications will run smoother than ever." })
        ] }),
        /* @__PURE__ */ i.jsxs(Vr, { centered: !0, children: [
          /* @__PURE__ */ i.jsx(Lr, { size: "lg", color: "success", className: "mb-4", children: /* @__PURE__ */ i.jsx("svg", { className: "w-12 h-12", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ i.jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            }
          ) }) }),
          /* @__PURE__ */ i.jsx(Br, { className: "text-xl font-semibold mb-2", children: "Secure by Default" }),
          /* @__PURE__ */ i.jsx(Or, { className: "text-gray-600", children: "Enterprise-grade security built into every layer. Your data is protected with the latest encryption." })
        ] }),
        /* @__PURE__ */ i.jsxs(Vr, { centered: !0, children: [
          /* @__PURE__ */ i.jsx(Lr, { size: "lg", color: "accent", className: "mb-4", children: /* @__PURE__ */ i.jsx("svg", { className: "w-12 h-12", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ i.jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            }
          ) }) }),
          /* @__PURE__ */ i.jsx(Br, { className: "text-xl font-semibold mb-2", children: "Fully Customizable" }),
          /* @__PURE__ */ i.jsx(Or, { className: "text-gray-600", children: "Tailor every aspect to match your brand. Complete control over colors, layouts, and functionality." })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ i.jsx(zt, { id: "services", spacing: "xl", children: /* @__PURE__ */ i.jsxs(Se, { children: [
      /* @__PURE__ */ i.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ i.jsx(Je, { as: "h2", className: "text-4xl font-bold mb-4", children: "Our Services" }),
        /* @__PURE__ */ i.jsx(W, { className: "text-xl text-gray-600", children: "Professional solutions tailored to your needs" })
      ] }),
      /* @__PURE__ */ i.jsxs(Nt, { cols: 3, gap: "lg", children: [
        /* @__PURE__ */ i.jsxs(gt, { className: "hover:shadow-lg transition-shadow", children: [
          /* @__PURE__ */ i.jsx(
            pn,
            {
              src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=250&fit=crop",
              alt: "Business Strategy"
            }
          ),
          /* @__PURE__ */ i.jsxs(Bt, { children: [
            /* @__PURE__ */ i.jsx(Ot, { children: "Business Consulting" }),
            /* @__PURE__ */ i.jsx(xr, { children: "Strategic planning for growth" })
          ] }),
          /* @__PURE__ */ i.jsx(xt, { children: /* @__PURE__ */ i.jsx(W, { children: "Expert guidance to transform your business operations and maximize efficiency with proven strategies." }) }),
          /* @__PURE__ */ i.jsx(Jn, { children: /* @__PURE__ */ i.jsx(X, { fullWidth: !0, variant: "outline", children: "Learn More" }) })
        ] }),
        /* @__PURE__ */ i.jsxs(gt, { className: "hover:shadow-lg transition-shadow", children: [
          /* @__PURE__ */ i.jsx(
            pn,
            {
              src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
              alt: "Digital Solutions"
            }
          ),
          /* @__PURE__ */ i.jsxs(Bt, { children: [
            /* @__PURE__ */ i.jsx(Ot, { children: "Digital Transformation" }),
            /* @__PURE__ */ i.jsx(xr, { children: "Modernize your infrastructure" })
          ] }),
          /* @__PURE__ */ i.jsx(xt, { children: /* @__PURE__ */ i.jsx(W, { children: "Comprehensive digital solutions to streamline your workflows and enhance productivity across teams." }) }),
          /* @__PURE__ */ i.jsx(Jn, { children: /* @__PURE__ */ i.jsx(X, { fullWidth: !0, variant: "outline", children: "Learn More" }) })
        ] }),
        /* @__PURE__ */ i.jsxs(gt, { className: "hover:shadow-lg transition-shadow", children: [
          /* @__PURE__ */ i.jsx(
            pn,
            {
              src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop",
              alt: "Team Training"
            }
          ),
          /* @__PURE__ */ i.jsxs(Bt, { children: [
            /* @__PURE__ */ i.jsx(Ot, { children: "Team Development" }),
            /* @__PURE__ */ i.jsx(xr, { children: "Empower your workforce" })
          ] }),
          /* @__PURE__ */ i.jsx(xt, { children: /* @__PURE__ */ i.jsx(W, { children: "Professional training programs designed to upskill your team and foster a culture of innovation." }) }),
          /* @__PURE__ */ i.jsx(Jn, { children: /* @__PURE__ */ i.jsx(X, { fullWidth: !0, variant: "outline", children: "Learn More" }) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ i.jsx(zt, { spacing: "lg", className: "bg-gray-900 text-white", children: /* @__PURE__ */ i.jsx(Se, { children: /* @__PURE__ */ i.jsxs(Nt, { cols: 4, gap: "lg", children: [
      /* @__PURE__ */ i.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ i.jsx(Je, { as: "h3", className: "text-4xl font-bold mb-2", children: "500+" }),
        /* @__PURE__ */ i.jsx(W, { className: "text-gray-400", children: "Happy Clients" })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ i.jsx(Je, { as: "h3", className: "text-4xl font-bold mb-2", children: "1000+" }),
        /* @__PURE__ */ i.jsx(W, { className: "text-gray-400", children: "Projects Completed" })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ i.jsx(Je, { as: "h3", className: "text-4xl font-bold mb-2", children: "50+" }),
        /* @__PURE__ */ i.jsx(W, { className: "text-gray-400", children: "Team Members" })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ i.jsx(Je, { as: "h3", className: "text-4xl font-bold mb-2", children: "10+" }),
        /* @__PURE__ */ i.jsx(W, { className: "text-gray-400", children: "Years Experience" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ i.jsx(zt, { id: "contact", spacing: "xl", className: "bg-gray-50", children: /* @__PURE__ */ i.jsxs(Se, { children: [
      /* @__PURE__ */ i.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ i.jsx(Je, { as: "h2", className: "text-4xl font-bold mb-4", children: "Get In Touch" }),
        /* @__PURE__ */ i.jsx(W, { className: "text-xl text-gray-600", children: "We'd love to hear from you. Send us a message and we'll respond as soon as possible." })
      ] }),
      /* @__PURE__ */ i.jsx(gt, { className: "shadow-lg", children: /* @__PURE__ */ i.jsx(xt, { children: /* @__PURE__ */ i.jsx(
        lv,
        {
          onSubmit: s,
          schema: Cw,
          defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
            terms: !1
          },
          children: /* @__PURE__ */ i.jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ i.jsxs(Nt, { cols: 2, gap: "md", children: [
              /* @__PURE__ */ i.jsx(qn, { name: "name", label: "Your Name", required: !0, children: /* @__PURE__ */ i.jsx(qt, { name: "name", placeholder: "John Doe", fullWidth: !0 }) }),
              /* @__PURE__ */ i.jsx(qn, { name: "email", label: "Email Address", required: !0, children: /* @__PURE__ */ i.jsx(qt, { name: "email", type: "email", placeholder: "john@example.com", fullWidth: !0 }) })
            ] }),
            /* @__PURE__ */ i.jsx(qn, { name: "subject", label: "Subject", required: !0, children: /* @__PURE__ */ i.jsx(cv, { name: "subject", options: o, fullWidth: !0 }) }),
            /* @__PURE__ */ i.jsx(qn, { name: "message", label: "Message", required: !0, children: /* @__PURE__ */ i.jsx(
              So,
              {
                name: "message",
                placeholder: "Tell us about your project...",
                rows: 6,
                fullWidth: !0
              }
            ) }),
            /* @__PURE__ */ i.jsx(
              dv,
              {
                name: "terms",
                label: "I agree to the terms and conditions and privacy policy"
              }
            ),
            /* @__PURE__ */ i.jsx(X, { type: "submit", variant: "solid", color: "primary", size: "lg", fullWidth: !0, children: "Send Message" })
          ] })
        }
      ) }) })
    ] }) }),
    /* @__PURE__ */ i.jsx(Ro, { className: "bg-gray-900 text-white", children: /* @__PURE__ */ i.jsxs(Se, { children: [
      /* @__PURE__ */ i.jsxs(Jd, { cols: 4, children: [
        /* @__PURE__ */ i.jsxs(ln, { children: [
          /* @__PURE__ */ i.jsx(Je, { as: "h4", className: "text-xl font-bold mb-4", children: e }),
          /* @__PURE__ */ i.jsx(W, { className: "text-gray-400 mb-4", children: "Building the future of digital experiences, one project at a time." }),
          /* @__PURE__ */ i.jsxs(es, { gap: "sm", children: [
            /* @__PURE__ */ i.jsx(bt, { variant: "outline", color: "primary", children: "Innovation" }),
            /* @__PURE__ */ i.jsx(bt, { variant: "outline", color: "success", children: "Quality" })
          ] })
        ] }),
        /* @__PURE__ */ i.jsxs(ln, { children: [
          /* @__PURE__ */ i.jsx(ts, { children: "Products" }),
          /* @__PURE__ */ i.jsxs(rs, { children: [
            /* @__PURE__ */ i.jsx(rt, { href: "#", children: "Features" }),
            /* @__PURE__ */ i.jsx(rt, { href: "#", children: "Pricing" }),
            /* @__PURE__ */ i.jsx(rt, { href: "#", children: "Documentation" }),
            /* @__PURE__ */ i.jsx(rt, { href: "#", children: "API Reference" })
          ] })
        ] }),
        /* @__PURE__ */ i.jsxs(ln, { children: [
          /* @__PURE__ */ i.jsx(ts, { children: "Company" }),
          /* @__PURE__ */ i.jsxs(rs, { children: [
            /* @__PURE__ */ i.jsx(rt, { href: "#", children: "About Us" }),
            /* @__PURE__ */ i.jsx(rt, { href: "#", children: "Careers" }),
            /* @__PURE__ */ i.jsx(rt, { href: "#", children: "Blog" }),
            /* @__PURE__ */ i.jsx(rt, { href: "#", children: "Press Kit" })
          ] })
        ] }),
        /* @__PURE__ */ i.jsxs(ln, { children: [
          /* @__PURE__ */ i.jsx(ts, { children: "Support" }),
          /* @__PURE__ */ i.jsxs(rs, { children: [
            /* @__PURE__ */ i.jsx(rt, { href: "#", children: "Help Center" }),
            /* @__PURE__ */ i.jsx(rt, { href: "#", children: "Contact Us" }),
            /* @__PURE__ */ i.jsx(rt, { href: "#", children: "Status" }),
            /* @__PURE__ */ i.jsx(rt, { href: "#", children: "Terms of Service" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ i.jsx(Qd, { className: "border-t border-gray-800 mt-8 pt-8", children: /* @__PURE__ */ i.jsxs(es, { justify: "between", align: "center", children: [
        /* @__PURE__ */ i.jsxs(W, { className: "text-gray-400", children: [
          "© 2024 ",
          e,
          ". All rights reserved."
        ] }),
        /* @__PURE__ */ i.jsxs(es, { gap: "md", children: [
          /* @__PURE__ */ i.jsx(rt, { href: "#", className: "text-gray-400 hover:text-white", children: /* @__PURE__ */ i.jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ i.jsx("path", { d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" }) }) }),
          /* @__PURE__ */ i.jsx(rt, { href: "#", className: "text-gray-400 hover:text-white", children: /* @__PURE__ */ i.jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ i.jsx("path", { d: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" }) }) }),
          /* @__PURE__ */ i.jsx(rt, { href: "#", className: "text-gray-400 hover:text-white", children: /* @__PURE__ */ i.jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ i.jsx("path", { d: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" }) }) }),
          /* @__PURE__ */ i.jsx(rt, { href: "#", className: "text-gray-400 hover:text-white", children: /* @__PURE__ */ i.jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ i.jsx("path", { d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" }) }) })
        ] })
      ] }) })
    ] }) })
  ] });
};
export {
  Jx as AdvancedMasonry,
  Kw as AgileStatusBadge,
  yy as AgileStatusIcon,
  Xw as AgileTaskCard,
  py as Alert,
  n1 as AnimateOnClick,
  r1 as AnimateOnHover,
  t1 as AnimateOnScroll,
  Es as Animated,
  ny as AsymmetricLayout,
  Jw as AuthModal,
  Qw as AuthStatus,
  vr as Avatar,
  fy as AvatarGroup,
  bt as Badge,
  ry as BentoLayout,
  X as Button,
  b1 as CTASection,
  gt as Card,
  xt as CardContent,
  xr as CardDescription,
  Jn as CardFooter,
  Bt as CardHeader,
  pn as CardImage,
  Ot as CardTitle,
  Kx as Center,
  dv as Checkbox,
  Hw as CheckboxGroup,
  Zw as CheckboxNew,
  dy as ClosableBadge,
  bx as Code,
  u1 as Combobox,
  f1 as CommandPalette,
  _1 as ContactFormSection,
  Se as Container,
  Bw as ContentLayout,
  l1 as Control,
  Lw as DashboardLayout,
  m1 as DashboardPage,
  uy as DotBadge,
  xl as DoubleFlip,
  wy as Favicon,
  Vr as Feature,
  Or as FeatureDescription,
  Lr as FeatureIcon,
  Br as FeatureTitle,
  Ts as FeaturesGrid,
  y1 as FeaturesSection,
  qn as Field,
  c1 as FileInput,
  es as Flex,
  Zx as FlexItem,
  Ro as Footer,
  Qd as FooterBottom,
  Jd as FooterGrid,
  rt as FooterLink,
  rs as FooterLinks,
  ln as FooterSection,
  ts as FooterTitle,
  lv as Form,
  Ow as FullWidthLayout,
  Nt as Grid,
  Wx as GridItem,
  Gx as HStack,
  Je as Heading,
  js as Hero,
  _s as HeroActions,
  Ss as HeroContent,
  x1 as HeroSection,
  ks as HeroSubtitle,
  Cs as HeroTitle,
  j1 as HeroWithFlipSection,
  Qx as HolyGrailLayout,
  Q as Icon,
  cy as IconBadge,
  Dw as Icons,
  hy as InitialsAvatar,
  qt as Input,
  p1 as LandingPage,
  Od as Link,
  ey as MagazineLayout,
  g1 as MarketplacePage,
  Xx as Masonry,
  Ao as Modal,
  Fo as ModalBody,
  No as ModalDescription,
  Do as ModalFooter,
  zo as ModalHeader,
  Po as ModalTitle,
  d1 as MultiSelect,
  Fw as NavLink,
  Kd as Navbar,
  Xd as NavbarBrand,
  iy as NavbarContent,
  Si as NavbarItem,
  sy as NavbarLogo,
  _i as NavbarMenu,
  $w as NavigationBar,
  by as OTPInput,
  vy as OTPTimer,
  Wo as Page,
  hv as PageContent,
  h1 as PageFooter,
  fv as PageHeader,
  Js as PageSection,
  jy as Parallax,
  Cy as ParallaxImage,
  i1 as ParallaxLayer,
  a1 as ParallaxReveal,
  o1 as ParallaxSection,
  s1 as ParallaxText,
  w1 as PricingSection,
  Ti as Progress,
  Gw as ProgressWithLabel,
  T1 as QwanyxTemplate,
  xy as Radio,
  Yw as RadioGroup,
  zt as Section,
  cv as Select,
  vx as ServiceCard,
  my as Sidebar,
  C1 as SimpleFooterSection,
  Iw as SimpleModal,
  oy as SimpleNavbar,
  Yl as SimpleSelect,
  Vw as SimpleSidebar,
  Mw as SimpleTabs,
  Hx as Spacer,
  eu as Spinner,
  qw as SpinnerWithText,
  ty as SplitLayout,
  _o as Stack,
  qo as SuperDropdown,
  To as SuperNavbar,
  Ww as Switch,
  Uw as SwitchGroup,
  Eo as Tabs,
  Ir as TabsContent,
  ws as TabsList,
  Mr as TabsTrigger,
  v1 as TestimonialsSection,
  W as Text,
  So as Textarea,
  Tw as ThemeProvider,
  zw as ThemeToggle,
  gy as UserProfile,
  Yx as VStack,
  Pw as WorkspaceProvider,
  S1 as businessContactFields,
  k1 as detailedContactFields,
  Ew as getResolvedTheme,
  Mu as getStoredThemeMode,
  pv as simpleContactFields,
  e1 as useFavicon,
  Ox as useForm,
  Xr as useFormContext,
  _w as useTheme,
  $u as useThemeMode,
  Nw as useWorkspace
};
