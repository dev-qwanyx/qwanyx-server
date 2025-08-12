import w, { createContext as Zt, useState as X, useEffect as ve, useContext as Oe, useRef as dn } from "react";
import { createPortal as cs } from "react-dom";
var ct = { exports: {} }, We = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var $r;
function ls() {
  if ($r) return We;
  $r = 1;
  var e = Symbol.for("react.transitional.element"), t = Symbol.for("react.fragment");
  function r(n, s, o) {
    var a = null;
    if (o !== void 0 && (a = "" + o), s.key !== void 0 && (a = "" + s.key), "key" in s) {
      o = {};
      for (var c in s)
        c !== "key" && (o[c] = s[c]);
    } else o = s;
    return s = o.ref, {
      $$typeof: e,
      type: n,
      key: a,
      ref: s !== void 0 ? s : null,
      props: o
    };
  }
  return We.Fragment = t, We.jsx = r, We.jsxs = r, We;
}
var Je = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var zr;
function us() {
  return zr || (zr = 1, process.env.NODE_ENV !== "production" && function() {
    function e(v) {
      if (v == null) return null;
      if (typeof v == "function")
        return v.$$typeof === B ? null : v.displayName || v.name || null;
      if (typeof v == "string") return v;
      switch (v) {
        case y:
          return "Fragment";
        case T:
          return "Profiler";
        case $:
          return "StrictMode";
        case P:
          return "Suspense";
        case oe:
          return "SuspenseList";
        case D:
          return "Activity";
      }
      if (typeof v == "object")
        switch (typeof v.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), v.$$typeof) {
          case z:
            return "Portal";
          case A:
            return (v.displayName || "Context") + ".Provider";
          case C:
            return (v._context.displayName || "Context") + ".Consumer";
          case S:
            var R = v.render;
            return v = v.displayName, v || (v = R.displayName || R.name || "", v = v !== "" ? "ForwardRef(" + v + ")" : "ForwardRef"), v;
          case ce:
            return R = v.displayName || null, R !== null ? R : e(v.type) || "Memo";
          case le:
            R = v._payload, v = v._init;
            try {
              return e(v(R));
            } catch {
            }
        }
      return null;
    }
    function t(v) {
      return "" + v;
    }
    function r(v) {
      try {
        t(v);
        var R = !1;
      } catch {
        R = !0;
      }
      if (R) {
        R = console;
        var U = R.error, ee = typeof Symbol == "function" && Symbol.toStringTag && v[Symbol.toStringTag] || v.constructor.name || "Object";
        return U.call(
          R,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          ee
        ), t(v);
      }
    }
    function n(v) {
      if (v === y) return "<>";
      if (typeof v == "object" && v !== null && v.$$typeof === le)
        return "<...>";
      try {
        var R = e(v);
        return R ? "<" + R + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function s() {
      var v = Y.A;
      return v === null ? null : v.getOwner();
    }
    function o() {
      return Error("react-stack-top-frame");
    }
    function a(v) {
      if (Z.call(v, "key")) {
        var R = Object.getOwnPropertyDescriptor(v, "key").get;
        if (R && R.isReactWarning) return !1;
      }
      return v.key !== void 0;
    }
    function c(v, R) {
      function U() {
        ne || (ne = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          R
        ));
      }
      U.isReactWarning = !0, Object.defineProperty(v, "key", {
        get: U,
        configurable: !0
      });
    }
    function u() {
      var v = e(this.type);
      return ae[v] || (ae[v] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), v = this.props.ref, v !== void 0 ? v : null;
    }
    function d(v, R, U, ee, be, he, Ue, Te) {
      return U = he.ref, v = {
        $$typeof: _,
        type: v,
        key: R,
        props: he,
        _owner: be
      }, (U !== void 0 ? U : null) !== null ? Object.defineProperty(v, "ref", {
        enumerable: !1,
        get: u
      }) : Object.defineProperty(v, "ref", { enumerable: !1, value: null }), v._store = {}, Object.defineProperty(v._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(v, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(v, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: Ue
      }), Object.defineProperty(v, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: Te
      }), Object.freeze && (Object.freeze(v.props), Object.freeze(v)), v;
    }
    function m(v, R, U, ee, be, he, Ue, Te) {
      var te = R.children;
      if (te !== void 0)
        if (ee)
          if (O(te)) {
            for (ee = 0; ee < te.length; ee++)
              h(te[ee]);
            Object.freeze && Object.freeze(te);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else h(te);
      if (Z.call(R, "key")) {
        te = e(v);
        var we = Object.keys(R).filter(function(Vt) {
          return Vt !== "key";
        });
        ee = 0 < we.length ? "{key: someKey, " + we.join(": ..., ") + ": ...}" : "{key: someKey}", ke[te + ee] || (we = 0 < we.length ? "{" + we.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          ee,
          te,
          we,
          te
        ), ke[te + ee] = !0);
      }
      if (te = null, U !== void 0 && (r(U), te = "" + U), a(R) && (r(R.key), te = "" + R.key), "key" in R) {
        U = {};
        for (var Se in R)
          Se !== "key" && (U[Se] = R[Se]);
      } else U = R;
      return te && c(
        U,
        typeof v == "function" ? v.displayName || v.name || "Unknown" : v
      ), d(
        v,
        te,
        he,
        be,
        s(),
        U,
        Ue,
        Te
      );
    }
    function h(v) {
      typeof v == "object" && v !== null && v.$$typeof === _ && v._store && (v._store.validated = 1);
    }
    var p = w, _ = Symbol.for("react.transitional.element"), z = Symbol.for("react.portal"), y = Symbol.for("react.fragment"), $ = Symbol.for("react.strict_mode"), T = Symbol.for("react.profiler"), C = Symbol.for("react.consumer"), A = Symbol.for("react.context"), S = Symbol.for("react.forward_ref"), P = Symbol.for("react.suspense"), oe = Symbol.for("react.suspense_list"), ce = Symbol.for("react.memo"), le = Symbol.for("react.lazy"), D = Symbol.for("react.activity"), B = Symbol.for("react.client.reference"), Y = p.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Z = Object.prototype.hasOwnProperty, O = Array.isArray, M = console.createTask ? console.createTask : function() {
      return null;
    };
    p = {
      react_stack_bottom_frame: function(v) {
        return v();
      }
    };
    var ne, ae = {}, me = p.react_stack_bottom_frame.bind(
      p,
      o
    )(), Fe = M(n(o)), ke = {};
    Je.Fragment = y, Je.jsx = function(v, R, U, ee, be) {
      var he = 1e4 > Y.recentlyCreatedOwnerStacks++;
      return m(
        v,
        R,
        U,
        !1,
        ee,
        be,
        he ? Error("react-stack-top-frame") : me,
        he ? M(n(v)) : Fe
      );
    }, Je.jsxs = function(v, R, U, ee, be) {
      var he = 1e4 > Y.recentlyCreatedOwnerStacks++;
      return m(
        v,
        R,
        U,
        !0,
        ee,
        be,
        he ? Error("react-stack-top-frame") : me,
        he ? M(n(v)) : Fe
      );
    };
  }()), Je;
}
var Fr;
function ds() {
  return Fr || (Fr = 1, process.env.NODE_ENV === "production" ? ct.exports = ls() : ct.exports = us()), ct.exports;
}
var i = ds();
const fn = Zt(void 0), bl = () => {
  const e = Oe(fn);
  if (!e)
    throw new Error("useTheme must be used within a ThemeProvider");
  return e;
}, fs = (e) => {
  e = e.replace("#", ""), e.length === 3 && (e = e.split("").map((r) => r + r).join(""));
  const t = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
  return t ? `${parseInt(t[1], 16)} ${parseInt(t[2], 16)} ${parseInt(t[3], 16)}` : "0 0 0";
}, ms = (e) => {
  const t = document.documentElement;
  Object.entries(e.colors).forEach(([r, n]) => {
    const s = n.startsWith("#") ? fs(n) : n;
    t.style.setProperty(`--color-${r}`, s);
  }), e.fonts && Object.entries(e.fonts).forEach(([r, n]) => {
    t.style.setProperty(`--font-${r}`, n);
  }), e.spacing && Object.entries(e.spacing).forEach(([r, n]) => {
    t.style.setProperty(`--spacing-${r}`, n);
  }), e.radius && Object.entries(e.radius).forEach(([r, n]) => {
    const s = r === "DEFAULT" ? "--radius" : `--radius-${r}`;
    t.style.setProperty(s, n);
  }), e.shadows && Object.entries(e.shadows).forEach(([r, n]) => {
    const s = r === "DEFAULT" ? "--shadow" : `--shadow-${r}`;
    t.style.setProperty(s, n);
  }), e.transitions && Object.entries(e.transitions).forEach(([r, n]) => {
    t.style.setProperty(`--transition-${r}`, n);
  });
}, Be = [
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
], wl = ({
  children: e,
  defaultTheme: t = Be[0]
}) => {
  const [r, n] = X(t), [s, o] = X(Be);
  ve(() => {
    ms(r), localStorage.setItem("qwanyx-ui-current-theme", JSON.stringify(r));
  }, [r]), ve(() => {
    const d = localStorage.getItem("qwanyx-ui-current-theme");
    if (d)
      try {
        const h = JSON.parse(d);
        n(h);
      } catch (h) {
        console.error("Failed to load saved theme:", h);
      }
    const m = localStorage.getItem("qwanyx-ui-themes");
    if (m)
      try {
        const h = JSON.parse(m);
        o([...Be, ...h]);
      } catch (h) {
        console.error("Failed to load saved themes:", h);
      }
  }, []);
  const a = (d) => {
    n(d);
  }, c = (d) => {
    const m = [...s, d];
    o(m);
    const h = m.filter(
      (p) => !Be.some((_) => _.name === p.name)
    );
    localStorage.setItem("qwanyx-ui-themes", JSON.stringify(h));
  }, u = (d) => {
    if (Be.some((p) => p.name === d)) return;
    const m = s.filter((p) => p.name !== d);
    o(m);
    const h = m.filter(
      (p) => !Be.some((_) => _.name === p.name)
    );
    localStorage.setItem("qwanyx-ui-themes", JSON.stringify(h));
  };
  return /* @__PURE__ */ i.jsx(fn.Provider, { value: { theme: r, setTheme: a, themes: s, addTheme: c, removeTheme: u }, children: e });
}, hs = "Default Theme", ps = "default", gs = { primary: "#3B82F6", secondary: "#8B5CF6", accent: "#10B981", background: "#FFFFFF", foreground: "#0F172A", card: "#F8FAFC", border: "#E2E8F0", success: "#10B981", warning: "#F59E0B", error: "#EF4444", info: "#3B82F6", text: { primary: "#0F172A", secondary: "#475569", muted: "#94A3B8" } }, xs = { fontFamily: { heading: "system-ui, -apple-system, sans-serif", body: "system-ui, -apple-system, sans-serif", mono: "'Courier New', monospace" }, fontSize: { xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem", "5xl": "3rem" }, fontWeight: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 } }, ys = { xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "1.5rem", xl: "2rem", "2xl": "3rem", "3xl": "4rem", "4xl": "6rem" }, vs = { none: "0", sm: "0.125rem", md: "0.375rem", lg: "0.5rem", xl: "1rem", full: "9999px" }, bs = { sm: "0 1px 2px rgba(0,0,0,0.05)", md: "0 4px 6px rgba(0,0,0,0.1)", lg: "0 10px 15px rgba(0,0,0,0.1)", xl: "0 20px 25px rgba(0,0,0,0.1)", "2xl": "0 25px 50px rgba(0,0,0,0.25)" }, ws = {
  name: hs,
  id: ps,
  colors: gs,
  typography: xs,
  spacing: ys,
  borderRadius: vs,
  shadows: bs
}, _s = "Autodin Theme", js = "autodin", Ns = { primary: "#E67E22", secondary: "#2C3E50", accent: "#F39C12", background: "#FFFFFF", foreground: "#1A1A1A", card: "#F8F9FA", border: "#E0E0E0", success: "#27AE60", warning: "#F39C12", error: "#E74C3C", info: "#3498DB", text: { primary: "#2C3E50", secondary: "#7F8C8D", muted: "#95A5A6" } }, ks = { fontFamily: { heading: "'Montserrat', sans-serif", body: "'Open Sans', sans-serif", mono: "'Fira Code', monospace" }, fontSize: { xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem", "5xl": "3rem" }, fontWeight: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 } }, Cs = { xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "1.5rem", xl: "2rem", "2xl": "3rem", "3xl": "4rem", "4xl": "6rem" }, $s = { none: "0", sm: "0.125rem", md: "0.375rem", lg: "0.5rem", xl: "1rem", full: "9999px" }, zs = { sm: "0 1px 2px rgba(0,0,0,0.05)", md: "0 4px 6px rgba(0,0,0,0.1)", lg: "0 10px 15px rgba(0,0,0,0.1)", xl: "0 20px 25px rgba(0,0,0,0.1)", "2xl": "0 25px 50px rgba(0,0,0,0.25)" }, Fs = {
  name: _s,
  id: js,
  colors: Ns,
  typography: ks,
  spacing: Cs,
  borderRadius: $s,
  shadows: zs
}, Es = "Belgicomics Theme", As = "belgicomics", Ts = { primary: "#6B7280", secondary: "#374151", accent: "#EF4444", background: "#F9FAFB", foreground: "#111827", card: "#FFFFFF", border: "#E5E7EB", success: "#10B981", warning: "#F59E0B", error: "#EF4444", info: "#3B82F6", text: { primary: "#111827", secondary: "#6B7280", muted: "#9CA3AF" } }, Ss = { fontFamily: { heading: "'Inter', sans-serif", body: "'Inter', sans-serif", mono: "'JetBrains Mono', monospace" }, fontSize: { xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem", "5xl": "3rem" }, fontWeight: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 } }, Rs = { xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "1.5rem", xl: "2rem", "2xl": "3rem", "3xl": "4rem", "4xl": "6rem" }, Zs = { none: "0", sm: "0.125rem", md: "0.375rem", lg: "0.5rem", xl: "1rem", full: "9999px" }, Ds = { sm: "0 1px 3px rgba(0,0,0,0.12)", md: "0 4px 6px rgba(0,0,0,0.1)", lg: "0 10px 20px rgba(0,0,0,0.15)", xl: "0 20px 40px rgba(0,0,0,0.2)", "2xl": "0 25px 50px rgba(0,0,0,0.25)" }, Os = {
  name: Es,
  id: As,
  colors: Ts,
  typography: Ss,
  spacing: Rs,
  borderRadius: Zs,
  shadows: Ds
}, Wt = {
  default: ws,
  autodin: Fs,
  belgicomics: Os
}, Ps = (e) => Wt[e] || Wt.default, Is = () => Object.values(Wt), mn = Zt(void 0), _l = ({
  children: e,
  defaultWorkspace: t = "qwanyx-ui",
  apiUrl: r = "http://135.181.72.183:5002"
}) => {
  const [n, s] = X(t), [o, a] = X(null), [c, u] = X(null), [d, m] = X([]), [h, p] = X(null), [_, z] = X([]);
  ve(() => {
    const D = localStorage.getItem(`${n}_token`), B = localStorage.getItem(`${n}_user`);
    D && B && (u(D), a(JSON.parse(B)));
  }, [n]);
  const y = async (D, B = {}) => {
    const Y = {
      "Content-Type": "application/json",
      ...B.headers
    };
    c && (Y.Authorization = `Bearer ${c}`);
    const Z = await fetch(`${r}${D}`, {
      ...B,
      headers: Y
    });
    if (!Z.ok) {
      const O = await Z.json();
      throw new Error(O.message || "API call failed");
    }
    return Z.json();
  }, $ = (D, B) => {
    a(D), u(B), localStorage.setItem(`${n}_token`, B), localStorage.setItem(`${n}_user`, JSON.stringify(D));
  }, T = () => {
    a(null), u(null), localStorage.removeItem(`${n}_token`), localStorage.removeItem(`${n}_user`);
  }, C = async () => {
    console.warn("Themes are now static files. To add a new theme, create a JSON file in src/themes/");
  }, A = async () => {
    const D = Is();
    m(D);
    const B = Ps(n);
    p(B);
  }, S = async () => {
    console.warn("Themes are now static files. To remove a theme, delete its JSON file from src/themes/");
  }, P = async () => {
    console.warn("Templates are now static files. To add a new template, create a file in src/templates/");
  }, oe = async () => {
    z([]);
  }, ce = (D) => {
    s(D), a(null), u(null);
    const B = localStorage.getItem(`${D}_token`), Y = localStorage.getItem(`${D}_user`);
    B && Y && (u(B), a(JSON.parse(Y)));
  };
  ve(() => {
    A(), oe();
  }, [n, o]);
  const le = {
    workspace: n,
    setWorkspace: ce,
    user: o,
    token: c,
    isAuthenticated: !!o,
    login: $,
    logout: T,
    themes: d,
    currentTheme: h,
    saveTheme: C,
    loadThemes: A,
    deleteTheme: S,
    templates: _,
    saveTemplate: P,
    loadTemplates: oe,
    apiUrl: r,
    apiCall: y
  };
  return /* @__PURE__ */ i.jsx(mn.Provider, { value: le, children: e });
}, jl = () => {
  const e = Oe(mn);
  if (e === void 0)
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  return e;
}, pe = w.forwardRef(({
  children: e,
  variant: t = "solid",
  color: r = "primary",
  size: n = "md",
  fullWidth: s = !1,
  loading: o = !1,
  icon: a,
  iconPosition: c = "left",
  className: u = "",
  disabled: d,
  ...m
}, h) => {
  const p = [
    "qwanyx-button",
    `qwanyx-button--${t}`,
    `qwanyx-button--${n}`,
    `qwanyx-button--${r}`,
    s && "qwanyx-button--fullwidth",
    o && "qwanyx-button--loading",
    u
  ].filter(Boolean).join(" "), _ = /* @__PURE__ */ i.jsx("span", { className: `qwanyx-spinner qwanyx-spinner--${n}`, children: /* @__PURE__ */ i.jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      children: [
        /* @__PURE__ */ i.jsx(
          "circle",
          {
            className: "qwanyx-spinner__track",
            cx: "12",
            cy: "12",
            r: "10",
            stroke: "currentColor",
            strokeWidth: "4"
          }
        ),
        /* @__PURE__ */ i.jsx(
          "path",
          {
            className: "qwanyx-spinner__path",
            fill: "currentColor",
            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          }
        )
      ]
    }
  ) });
  return /* @__PURE__ */ i.jsxs(
    "button",
    {
      ref: h,
      className: p,
      disabled: d || o,
      ...m,
      children: [
        o && c === "left" && /* @__PURE__ */ i.jsx("span", { className: "qwanyx-button__icon qwanyx-button__icon--left", children: _ }),
        !o && a && c === "left" && /* @__PURE__ */ i.jsx("span", { className: "qwanyx-button__icon qwanyx-button__icon--left", children: a }),
        e,
        !o && a && c === "right" && /* @__PURE__ */ i.jsx("span", { className: "qwanyx-button__icon qwanyx-button__icon--right", children: a }),
        o && c === "right" && /* @__PURE__ */ i.jsx("span", { className: "qwanyx-button__icon qwanyx-button__icon--right", children: _ })
      ]
    }
  );
});
pe.displayName = "Button";
const Ge = w.forwardRef(({
  children: e,
  variant: t = "elevated",
  padding: r = "md",
  hoverable: n = !1,
  className: s = "",
  ...o
}, a) => {
  const c = [
    "qwanyx-card",
    `qwanyx-card--${t}`,
    `qwanyx-card--padding-${r}`,
    n && "qwanyx-card--hoverable",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("div", { ref: a, className: c, ...o, children: e });
});
Ge.displayName = "Card";
const pt = w.forwardRef(({
  children: e,
  className: t = "",
  ...r
}, n) => /* @__PURE__ */ i.jsx(
  "div",
  {
    ref: n,
    className: `qwanyx-card__header ${t}`,
    ...r,
    children: e
  }
));
pt.displayName = "CardHeader";
const gt = w.forwardRef(({
  children: e,
  as: t = "h3",
  className: r = "",
  ...n
}, s) => /* @__PURE__ */ i.jsx(
  t,
  {
    ref: s,
    className: `qwanyx-card__title ${r}`,
    ...n,
    children: e
  }
));
gt.displayName = "CardTitle";
const xt = w.forwardRef(({
  children: e,
  className: t = "",
  ...r
}, n) => /* @__PURE__ */ i.jsx(
  "p",
  {
    ref: n,
    className: `qwanyx-card__description ${t}`,
    ...r,
    children: e
  }
));
xt.displayName = "CardDescription";
const Ke = w.forwardRef(({
  children: e,
  className: t = "",
  ...r
}, n) => /* @__PURE__ */ i.jsx(
  "div",
  {
    ref: n,
    className: `qwanyx-card__content ${t}`,
    ...r,
    children: e
  }
));
Ke.displayName = "CardContent";
const yt = w.forwardRef(({
  children: e,
  className: t = "",
  ...r
}, n) => /* @__PURE__ */ i.jsx(
  "div",
  {
    ref: n,
    className: `qwanyx-card__footer ${t}`,
    ...r,
    children: e
  }
));
yt.displayName = "CardFooter";
const vt = w.forwardRef(({
  aspectRatio: e = "16/9",
  className: t = "",
  alt: r = "",
  ...n
}, s) => {
  const o = {
    square: "qwanyx-card__image-container--square",
    "16/9": "qwanyx-card__image-container--video",
    "4/3": "qwanyx-card__image-container--4-3",
    "21/9": "qwanyx-card__image-container--21-9"
  };
  return /* @__PURE__ */ i.jsx("div", { className: `qwanyx-card__image-container ${o[e]}`, children: /* @__PURE__ */ i.jsx(
    "img",
    {
      ref: s,
      className: `qwanyx-card__image ${t}`,
      alt: r,
      ...n
    }
  ) });
});
vt.displayName = "CardImage";
var ot = (e) => e.type === "checkbox", Re = (e) => e instanceof Date, de = (e) => e == null;
const hn = (e) => typeof e == "object";
var H = (e) => !de(e) && !Array.isArray(e) && hn(e) && !Re(e), qs = (e) => H(e) && e.target ? ot(e.target) ? e.target.checked : e.target.value : e, Bs = (e) => e.substring(0, e.search(/\.\d+(\.|$)/)) || e, Vs = (e, t) => e.has(Bs(t)), Ls = (e) => {
  const t = e.constructor && e.constructor.prototype;
  return H(t) && t.hasOwnProperty("isPrototypeOf");
}, tr = typeof window < "u" && typeof window.HTMLElement < "u" && typeof document < "u";
function se(e) {
  let t;
  const r = Array.isArray(e), n = typeof FileList < "u" ? e instanceof FileList : !1;
  if (e instanceof Date)
    t = new Date(e);
  else if (!(tr && (e instanceof Blob || n)) && (r || H(e)))
    if (t = r ? [] : Object.create(Object.getPrototypeOf(e)), !r && !Ls(e))
      t = e;
    else
      for (const s in e)
        e.hasOwnProperty(s) && (t[s] = se(e[s]));
  else
    return e;
  return t;
}
var Dt = (e) => /^\w*$/.test(e), K = (e) => e === void 0, rr = (e) => Array.isArray(e) ? e.filter(Boolean) : [], nr = (e) => rr(e.replace(/["|']|\]/g, "").split(/\.|\[/)), k = (e, t, r) => {
  if (!t || !H(e))
    return r;
  const n = (Dt(t) ? [t] : nr(t)).reduce((s, o) => de(s) ? s : s[o], e);
  return K(n) || n === e ? K(e[t]) ? r : e[t] : n;
}, _e = (e) => typeof e == "boolean", q = (e, t, r) => {
  let n = -1;
  const s = Dt(t) ? [t] : nr(t), o = s.length, a = o - 1;
  for (; ++n < o; ) {
    const c = s[n];
    let u = r;
    if (n !== a) {
      const d = e[c];
      u = H(d) || Array.isArray(d) ? d : isNaN(+s[n + 1]) ? {} : [];
    }
    if (c === "__proto__" || c === "constructor" || c === "prototype")
      return;
    e[c] = u, e = e[c];
  }
};
const Er = {
  BLUR: "blur",
  FOCUS_OUT: "focusout"
}, xe = {
  onBlur: "onBlur",
  onChange: "onChange",
  onSubmit: "onSubmit",
  onTouched: "onTouched",
  all: "all"
}, Ce = {
  max: "max",
  min: "min",
  maxLength: "maxLength",
  minLength: "minLength",
  pattern: "pattern",
  required: "required",
  validate: "validate"
}, sr = w.createContext(null);
sr.displayName = "HookFormContext";
const Pe = () => w.useContext(sr), Ms = (e) => {
  const { children: t, ...r } = e;
  return w.createElement(sr.Provider, { value: r }, t);
};
var Us = (e, t, r, n = !0) => {
  const s = {
    defaultValues: t._defaultValues
  };
  for (const o in e)
    Object.defineProperty(s, o, {
      get: () => {
        const a = o;
        return t._proxyFormState[a] !== xe.all && (t._proxyFormState[a] = !n || xe.all), e[a];
      }
    });
  return s;
};
const Ws = typeof window < "u" ? w.useLayoutEffect : w.useEffect;
var je = (e) => typeof e == "string", Js = (e, t, r, n, s) => je(e) ? (n && t.watch.add(e), k(r, e, s)) : Array.isArray(e) ? e.map((o) => (n && t.watch.add(o), k(r, o))) : (n && (t.watchAll = !0), r), Jt = (e) => de(e) || !hn(e);
function Ae(e, t, r = /* @__PURE__ */ new WeakSet()) {
  if (Jt(e) || Jt(t))
    return e === t;
  if (Re(e) && Re(t))
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
      const c = t[o];
      if (Re(a) && Re(c) || H(a) && H(c) || Array.isArray(a) && Array.isArray(c) ? !Ae(a, c, r) : a !== c)
        return !1;
    }
  }
  return !0;
}
var or = (e, t, r, n, s) => t ? {
  ...r[e],
  types: {
    ...r[e] && r[e].types ? r[e].types : {},
    [n]: s || !0
  }
} : {}, et = (e) => Array.isArray(e) ? e : [e], Ar = () => {
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
}, fe = (e) => H(e) && !Object.keys(e).length, ar = (e) => e.type === "file", ye = (e) => typeof e == "function", Ft = (e) => {
  if (!tr)
    return !1;
  const t = e ? e.ownerDocument : 0;
  return e instanceof (t && t.defaultView ? t.defaultView.HTMLElement : HTMLElement);
}, pn = (e) => e.type === "select-multiple", ir = (e) => e.type === "radio", Ys = (e) => ir(e) || ot(e), Ut = (e) => Ft(e) && e.isConnected;
function Hs(e, t) {
  const r = t.slice(0, -1).length;
  let n = 0;
  for (; n < r; )
    e = K(e) ? n++ : e[t[n++]];
  return e;
}
function Gs(e) {
  for (const t in e)
    if (e.hasOwnProperty(t) && !K(e[t]))
      return !1;
  return !0;
}
function G(e, t) {
  const r = Array.isArray(t) ? t : Dt(t) ? [t] : nr(t), n = r.length === 1 ? e : Hs(e, r), s = r.length - 1, o = r[s];
  return n && delete n[o], s !== 0 && (H(n) && fe(n) || Array.isArray(n) && Gs(n)) && G(e, r.slice(0, -1)), e;
}
var gn = (e) => {
  for (const t in e)
    if (ye(e[t]))
      return !0;
  return !1;
};
function Et(e, t = {}) {
  const r = Array.isArray(e);
  if (H(e) || r)
    for (const n in e)
      Array.isArray(e[n]) || H(e[n]) && !gn(e[n]) ? (t[n] = Array.isArray(e[n]) ? [] : {}, Et(e[n], t[n])) : de(e[n]) || (t[n] = !0);
  return t;
}
function xn(e, t, r) {
  const n = Array.isArray(e);
  if (H(e) || n)
    for (const s in e)
      Array.isArray(e[s]) || H(e[s]) && !gn(e[s]) ? K(t) || Jt(r[s]) ? r[s] = Array.isArray(e[s]) ? Et(e[s], []) : { ...Et(e[s]) } : xn(e[s], de(t) ? {} : t[s], r[s]) : r[s] = !Ae(e[s], t[s]);
  return r;
}
var Ye = (e, t) => xn(e, t, Et(t));
const Tr = {
  value: !1,
  isValid: !1
}, Sr = { value: !0, isValid: !0 };
var yn = (e) => {
  if (Array.isArray(e)) {
    if (e.length > 1) {
      const t = e.filter((r) => r && r.checked && !r.disabled).map((r) => r.value);
      return { value: t, isValid: !!t.length };
    }
    return e[0].checked && !e[0].disabled ? (
      // @ts-expect-error expected to work in the browser
      e[0].attributes && !K(e[0].attributes.value) ? K(e[0].value) || e[0].value === "" ? Sr : { value: e[0].value, isValid: !0 } : Sr
    ) : Tr;
  }
  return Tr;
}, vn = (e, { valueAsNumber: t, valueAsDate: r, setValueAs: n }) => K(e) ? e : t ? e === "" ? NaN : e && +e : r && je(e) ? new Date(e) : n ? n(e) : e;
const Rr = {
  isValid: !1,
  value: null
};
var bn = (e) => Array.isArray(e) ? e.reduce((t, r) => r && r.checked && !r.disabled ? {
  isValid: !0,
  value: r.value
} : t, Rr) : Rr;
function Zr(e) {
  const t = e.ref;
  return ar(t) ? t.files : ir(t) ? bn(e.refs).value : pn(t) ? [...t.selectedOptions].map(({ value: r }) => r) : ot(t) ? yn(e.refs).value : vn(K(t.value) ? e.ref.value : t.value, e);
}
var Ks = (e, t, r, n) => {
  const s = {};
  for (const o of e) {
    const a = k(t, o);
    a && q(s, o, a._f);
  }
  return {
    criteriaMode: r,
    names: [...e],
    fields: s,
    shouldUseNativeValidation: n
  };
}, At = (e) => e instanceof RegExp, He = (e) => K(e) ? e : At(e) ? e.source : H(e) ? At(e.value) ? e.value.source : e.value : e, Dr = (e) => ({
  isOnSubmit: !e || e === xe.onSubmit,
  isOnBlur: e === xe.onBlur,
  isOnChange: e === xe.onChange,
  isOnAll: e === xe.all,
  isOnTouch: e === xe.onTouched
});
const Or = "AsyncFunction";
var Xs = (e) => !!e && !!e.validate && !!(ye(e.validate) && e.validate.constructor.name === Or || H(e.validate) && Object.values(e.validate).find((t) => t.constructor.name === Or)), Qs = (e) => e.mount && (e.required || e.min || e.max || e.maxLength || e.minLength || e.pattern || e.validate), Pr = (e, t, r) => !r && (t.watchAll || t.watch.has(e) || [...t.watch].some((n) => e.startsWith(n) && /^\.\w+/.test(e.slice(n.length))));
const tt = (e, t, r, n) => {
  for (const s of r || Object.keys(e)) {
    const o = k(e, s);
    if (o) {
      const { _f: a, ...c } = o;
      if (a) {
        if (a.refs && a.refs[0] && t(a.refs[0], s) && !n)
          return !0;
        if (a.ref && t(a.ref, a.name) && !n)
          return !0;
        if (tt(c, t))
          break;
      } else if (H(c) && tt(c, t))
        break;
    }
  }
};
function Ir(e, t, r) {
  const n = k(e, r);
  if (n || Dt(r))
    return {
      error: n,
      name: r
    };
  const s = r.split(".");
  for (; s.length; ) {
    const o = s.join("."), a = k(t, o), c = k(e, o);
    if (a && !Array.isArray(a) && r !== o)
      return { name: r };
    if (c && c.type)
      return {
        name: o,
        error: c
      };
    if (c && c.root && c.root.type)
      return {
        name: `${o}.root`,
        error: c.root
      };
    s.pop();
  }
  return {
    name: r
  };
}
var eo = (e, t, r, n) => {
  r(e);
  const { name: s, ...o } = e;
  return fe(o) || Object.keys(o).length >= Object.keys(t).length || Object.keys(o).find((a) => t[a] === (!n || xe.all));
}, to = (e, t, r) => !e || !t || e === t || et(e).some((n) => n && (r ? n === t : n.startsWith(t) || t.startsWith(n))), ro = (e, t, r, n, s) => s.isOnAll ? !1 : !r && s.isOnTouch ? !(t || e) : (r ? n.isOnBlur : s.isOnBlur) ? !e : (r ? n.isOnChange : s.isOnChange) ? e : !0, no = (e, t) => !rr(k(e, t)).length && G(e, t), so = (e, t, r) => {
  const n = et(k(e, r));
  return q(n, "root", t[r]), q(e, r, n), e;
}, bt = (e) => je(e);
function qr(e, t, r = "validate") {
  if (bt(e) || Array.isArray(e) && e.every(bt) || _e(e) && !e)
    return {
      type: r,
      message: bt(e) ? e : "",
      ref: t
    };
}
var Ve = (e) => H(e) && !At(e) ? e : {
  value: e,
  message: ""
}, Br = async (e, t, r, n, s, o) => {
  const { ref: a, refs: c, required: u, maxLength: d, minLength: m, min: h, max: p, pattern: _, validate: z, name: y, valueAsNumber: $, mount: T } = e._f, C = k(r, y);
  if (!T || t.has(y))
    return {};
  const A = c ? c[0] : a, S = (Z) => {
    s && A.reportValidity && (A.setCustomValidity(_e(Z) ? "" : Z || ""), A.reportValidity());
  }, P = {}, oe = ir(a), ce = ot(a), le = oe || ce, D = ($ || ar(a)) && K(a.value) && K(C) || Ft(a) && a.value === "" || C === "" || Array.isArray(C) && !C.length, B = or.bind(null, y, n, P), Y = (Z, O, M, ne = Ce.maxLength, ae = Ce.minLength) => {
    const me = Z ? O : M;
    P[y] = {
      type: Z ? ne : ae,
      message: me,
      ref: a,
      ...B(Z ? ne : ae, me)
    };
  };
  if (o ? !Array.isArray(C) || !C.length : u && (!le && (D || de(C)) || _e(C) && !C || ce && !yn(c).isValid || oe && !bn(c).isValid)) {
    const { value: Z, message: O } = bt(u) ? { value: !!u, message: u } : Ve(u);
    if (Z && (P[y] = {
      type: Ce.required,
      message: O,
      ref: A,
      ...B(Ce.required, O)
    }, !n))
      return S(O), P;
  }
  if (!D && (!de(h) || !de(p))) {
    let Z, O;
    const M = Ve(p), ne = Ve(h);
    if (!de(C) && !isNaN(C)) {
      const ae = a.valueAsNumber || C && +C;
      de(M.value) || (Z = ae > M.value), de(ne.value) || (O = ae < ne.value);
    } else {
      const ae = a.valueAsDate || new Date(C), me = (v) => /* @__PURE__ */ new Date((/* @__PURE__ */ new Date()).toDateString() + " " + v), Fe = a.type == "time", ke = a.type == "week";
      je(M.value) && C && (Z = Fe ? me(C) > me(M.value) : ke ? C > M.value : ae > new Date(M.value)), je(ne.value) && C && (O = Fe ? me(C) < me(ne.value) : ke ? C < ne.value : ae < new Date(ne.value));
    }
    if ((Z || O) && (Y(!!Z, M.message, ne.message, Ce.max, Ce.min), !n))
      return S(P[y].message), P;
  }
  if ((d || m) && !D && (je(C) || o && Array.isArray(C))) {
    const Z = Ve(d), O = Ve(m), M = !de(Z.value) && C.length > +Z.value, ne = !de(O.value) && C.length < +O.value;
    if ((M || ne) && (Y(M, Z.message, O.message), !n))
      return S(P[y].message), P;
  }
  if (_ && !D && je(C)) {
    const { value: Z, message: O } = Ve(_);
    if (At(Z) && !C.match(Z) && (P[y] = {
      type: Ce.pattern,
      message: O,
      ref: a,
      ...B(Ce.pattern, O)
    }, !n))
      return S(O), P;
  }
  if (z) {
    if (ye(z)) {
      const Z = await z(C, r), O = qr(Z, A);
      if (O && (P[y] = {
        ...O,
        ...B(Ce.validate, O.message)
      }, !n))
        return S(O.message), P;
    } else if (H(z)) {
      let Z = {};
      for (const O in z) {
        if (!fe(Z) && !n)
          break;
        const M = qr(await z[O](C, r), A, O);
        M && (Z = {
          ...M,
          ...B(O, M.message)
        }, S(M.message), n && (P[y] = Z));
      }
      if (!fe(Z) && (P[y] = {
        ref: A,
        ...Z
      }, !n))
        return P;
    }
  }
  return S(!0), P;
};
const oo = {
  mode: xe.onSubmit,
  reValidateMode: xe.onChange,
  shouldFocusError: !0
};
function ao(e = {}) {
  let t = {
    ...oo,
    ...e
  }, r = {
    submitCount: 0,
    isDirty: !1,
    isReady: !1,
    isLoading: ye(t.defaultValues),
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
  }, n = {}, s = H(t.defaultValues) || H(t.values) ? se(t.defaultValues || t.values) || {} : {}, o = t.shouldUnregister ? {} : se(s), a = {
    action: !1,
    mount: !1,
    watch: !1
  }, c = {
    mount: /* @__PURE__ */ new Set(),
    disabled: /* @__PURE__ */ new Set(),
    unMount: /* @__PURE__ */ new Set(),
    array: /* @__PURE__ */ new Set(),
    watch: /* @__PURE__ */ new Set()
  }, u, d = 0;
  const m = {
    isDirty: !1,
    dirtyFields: !1,
    validatingFields: !1,
    touchedFields: !1,
    isValidating: !1,
    isValid: !1,
    errors: !1
  };
  let h = {
    ...m
  };
  const p = {
    array: Ar(),
    state: Ar()
  }, _ = t.criteriaMode === xe.all, z = (l) => (f) => {
    clearTimeout(d), d = setTimeout(l, f);
  }, y = async (l) => {
    if (!t.disabled && (m.isValid || h.isValid || l)) {
      const f = t.resolver ? fe((await ce()).errors) : await D(n, !0);
      f !== r.isValid && p.state.next({
        isValid: f
      });
    }
  }, $ = (l, f) => {
    !t.disabled && (m.isValidating || m.validatingFields || h.isValidating || h.validatingFields) && ((l || Array.from(c.mount)).forEach((g) => {
      g && (f ? q(r.validatingFields, g, f) : G(r.validatingFields, g));
    }), p.state.next({
      validatingFields: r.validatingFields,
      isValidating: !fe(r.validatingFields)
    }));
  }, T = (l, f = [], g, N, j = !0, b = !0) => {
    if (N && g && !t.disabled) {
      if (a.action = !0, b && Array.isArray(k(n, l))) {
        const F = g(k(n, l), N.argA, N.argB);
        j && q(n, l, F);
      }
      if (b && Array.isArray(k(r.errors, l))) {
        const F = g(k(r.errors, l), N.argA, N.argB);
        j && q(r.errors, l, F), no(r.errors, l);
      }
      if ((m.touchedFields || h.touchedFields) && b && Array.isArray(k(r.touchedFields, l))) {
        const F = g(k(r.touchedFields, l), N.argA, N.argB);
        j && q(r.touchedFields, l, F);
      }
      (m.dirtyFields || h.dirtyFields) && (r.dirtyFields = Ye(s, o)), p.state.next({
        name: l,
        isDirty: Y(l, f),
        dirtyFields: r.dirtyFields,
        errors: r.errors,
        isValid: r.isValid
      });
    } else
      q(o, l, f);
  }, C = (l, f) => {
    q(r.errors, l, f), p.state.next({
      errors: r.errors
    });
  }, A = (l) => {
    r.errors = l, p.state.next({
      errors: r.errors,
      isValid: !1
    });
  }, S = (l, f, g, N) => {
    const j = k(n, l);
    if (j) {
      const b = k(o, l, K(g) ? k(s, l) : g);
      K(b) || N && N.defaultChecked || f ? q(o, l, f ? b : Zr(j._f)) : M(l, b), a.mount && y();
    }
  }, P = (l, f, g, N, j) => {
    let b = !1, F = !1;
    const I = {
      name: l
    };
    if (!t.disabled) {
      if (!g || N) {
        (m.isDirty || h.isDirty) && (F = r.isDirty, r.isDirty = I.isDirty = Y(), b = F !== I.isDirty);
        const V = Ae(k(s, l), f);
        F = !!k(r.dirtyFields, l), V ? G(r.dirtyFields, l) : q(r.dirtyFields, l, !0), I.dirtyFields = r.dirtyFields, b = b || (m.dirtyFields || h.dirtyFields) && F !== !V;
      }
      if (g) {
        const V = k(r.touchedFields, l);
        V || (q(r.touchedFields, l, g), I.touchedFields = r.touchedFields, b = b || (m.touchedFields || h.touchedFields) && V !== g);
      }
      b && j && p.state.next(I);
    }
    return b ? I : {};
  }, oe = (l, f, g, N) => {
    const j = k(r.errors, l), b = (m.isValid || h.isValid) && _e(f) && r.isValid !== f;
    if (t.delayError && g ? (u = z(() => C(l, g)), u(t.delayError)) : (clearTimeout(d), u = null, g ? q(r.errors, l, g) : G(r.errors, l)), (g ? !Ae(j, g) : j) || !fe(N) || b) {
      const F = {
        ...N,
        ...b && _e(f) ? { isValid: f } : {},
        errors: r.errors,
        name: l
      };
      r = {
        ...r,
        ...F
      }, p.state.next(F);
    }
  }, ce = async (l) => {
    $(l, !0);
    const f = await t.resolver(o, t.context, Ks(l || c.mount, n, t.criteriaMode, t.shouldUseNativeValidation));
    return $(l), f;
  }, le = async (l) => {
    const { errors: f } = await ce(l);
    if (l)
      for (const g of l) {
        const N = k(f, g);
        N ? q(r.errors, g, N) : G(r.errors, g);
      }
    else
      r.errors = f;
    return f;
  }, D = async (l, f, g = {
    valid: !0
  }) => {
    for (const N in l) {
      const j = l[N];
      if (j) {
        const { _f: b, ...F } = j;
        if (b) {
          const I = c.array.has(b.name), V = j._f && Xs(j._f);
          V && m.validatingFields && $([N], !0);
          const ge = await Br(j, c.disabled, o, _, t.shouldUseNativeValidation && !f, I);
          if (V && m.validatingFields && $([N]), ge[b.name] && (g.valid = !1, f))
            break;
          !f && (k(ge, b.name) ? I ? so(r.errors, ge, b.name) : q(r.errors, b.name, ge[b.name]) : G(r.errors, b.name));
        }
        !fe(F) && await D(F, f, g);
      }
    }
    return g.valid;
  }, B = () => {
    for (const l of c.unMount) {
      const f = k(n, l);
      f && (f._f.refs ? f._f.refs.every((g) => !Ut(g)) : !Ut(f._f.ref)) && Te(l);
    }
    c.unMount = /* @__PURE__ */ new Set();
  }, Y = (l, f) => !t.disabled && (l && f && q(o, l, f), !Ae(v(), s)), Z = (l, f, g) => Js(l, c, {
    ...a.mount ? o : K(f) ? s : je(l) ? { [l]: f } : f
  }, g, f), O = (l) => rr(k(a.mount ? o : s, l, t.shouldUnregister ? k(s, l, []) : [])), M = (l, f, g = {}) => {
    const N = k(n, l);
    let j = f;
    if (N) {
      const b = N._f;
      b && (!b.disabled && q(o, l, vn(f, b)), j = Ft(b.ref) && de(f) ? "" : f, pn(b.ref) ? [...b.ref.options].forEach((F) => F.selected = j.includes(F.value)) : b.refs ? ot(b.ref) ? b.refs.forEach((F) => {
        (!F.defaultChecked || !F.disabled) && (Array.isArray(j) ? F.checked = !!j.find((I) => I === F.value) : F.checked = j === F.value || !!j);
      }) : b.refs.forEach((F) => F.checked = F.value === j) : ar(b.ref) ? b.ref.value = "" : (b.ref.value = j, b.ref.type || p.state.next({
        name: l,
        values: se(o)
      })));
    }
    (g.shouldDirty || g.shouldTouch) && P(l, j, g.shouldTouch, g.shouldDirty, !0), g.shouldValidate && ke(l);
  }, ne = (l, f, g) => {
    for (const N in f) {
      if (!f.hasOwnProperty(N))
        return;
      const j = f[N], b = l + "." + N, F = k(n, b);
      (c.array.has(l) || H(j) || F && !F._f) && !Re(j) ? ne(b, j, g) : M(b, j, g);
    }
  }, ae = (l, f, g = {}) => {
    const N = k(n, l), j = c.array.has(l), b = se(f);
    q(o, l, b), j ? (p.array.next({
      name: l,
      values: se(o)
    }), (m.isDirty || m.dirtyFields || h.isDirty || h.dirtyFields) && g.shouldDirty && p.state.next({
      name: l,
      dirtyFields: Ye(s, o),
      isDirty: Y(l, b)
    })) : N && !N._f && !de(b) ? ne(l, b, g) : M(l, b, g), Pr(l, c) && p.state.next({ ...r, name: l }), p.state.next({
      name: a.mount ? l : void 0,
      values: se(o)
    });
  }, me = async (l) => {
    a.mount = !0;
    const f = l.target;
    let g = f.name, N = !0;
    const j = k(n, g), b = (V) => {
      N = Number.isNaN(V) || Re(V) && isNaN(V.getTime()) || Ae(V, k(o, g, V));
    }, F = Dr(t.mode), I = Dr(t.reValidateMode);
    if (j) {
      let V, ge;
      const it = f.type ? Zr(j._f) : qs(l), Ee = l.type === Er.BLUR || l.type === Er.FOCUS_OUT, os = !Qs(j._f) && !t.resolver && !k(r.errors, g) && !j._f.deps || ro(Ee, k(r.touchedFields, g), r.isSubmitted, I, F), Lt = Pr(g, c, Ee);
      q(o, g, it), Ee ? (!f || !f.readOnly) && (j._f.onBlur && j._f.onBlur(l), u && u(0)) : j._f.onChange && j._f.onChange(l);
      const Mt = P(g, it, Ee), as = !fe(Mt) || Lt;
      if (!Ee && p.state.next({
        name: g,
        type: l.type,
        values: se(o)
      }), os)
        return (m.isValid || h.isValid) && (t.mode === "onBlur" ? Ee && y() : Ee || y()), as && p.state.next({ name: g, ...Lt ? {} : Mt });
      if (!Ee && Lt && p.state.next({ ...r }), t.resolver) {
        const { errors: kr } = await ce([g]);
        if (b(it), N) {
          const is = Ir(r.errors, n, g), Cr = Ir(kr, n, is.name || g);
          V = Cr.error, g = Cr.name, ge = fe(kr);
        }
      } else
        $([g], !0), V = (await Br(j, c.disabled, o, _, t.shouldUseNativeValidation))[g], $([g]), b(it), N && (V ? ge = !1 : (m.isValid || h.isValid) && (ge = await D(n, !0)));
      N && (j._f.deps && ke(j._f.deps), oe(g, ge, V, Mt));
    }
  }, Fe = (l, f) => {
    if (k(r.errors, f) && l.focus)
      return l.focus(), 1;
  }, ke = async (l, f = {}) => {
    let g, N;
    const j = et(l);
    if (t.resolver) {
      const b = await le(K(l) ? l : j);
      g = fe(b), N = l ? !j.some((F) => k(b, F)) : g;
    } else l ? (N = (await Promise.all(j.map(async (b) => {
      const F = k(n, b);
      return await D(F && F._f ? { [b]: F } : F);
    }))).every(Boolean), !(!N && !r.isValid) && y()) : N = g = await D(n);
    return p.state.next({
      ...!je(l) || (m.isValid || h.isValid) && g !== r.isValid ? {} : { name: l },
      ...t.resolver || !l ? { isValid: g } : {},
      errors: r.errors
    }), f.shouldFocus && !N && tt(n, Fe, l ? j : c.mount), N;
  }, v = (l) => {
    const f = {
      ...a.mount ? o : s
    };
    return K(l) ? f : je(l) ? k(f, l) : l.map((g) => k(f, g));
  }, R = (l, f) => ({
    invalid: !!k((f || r).errors, l),
    isDirty: !!k((f || r).dirtyFields, l),
    error: k((f || r).errors, l),
    isValidating: !!k(r.validatingFields, l),
    isTouched: !!k((f || r).touchedFields, l)
  }), U = (l) => {
    l && et(l).forEach((f) => G(r.errors, f)), p.state.next({
      errors: l ? r.errors : {}
    });
  }, ee = (l, f, g) => {
    const N = (k(n, l, { _f: {} })._f || {}).ref, j = k(r.errors, l) || {}, { ref: b, message: F, type: I, ...V } = j;
    q(r.errors, l, {
      ...V,
      ...f,
      ref: N
    }), p.state.next({
      name: l,
      errors: r.errors,
      isValid: !1
    }), g && g.shouldFocus && N && N.focus && N.focus();
  }, be = (l, f) => ye(l) ? p.state.subscribe({
    next: (g) => "values" in g && l(Z(void 0, f), g)
  }) : Z(l, f, !0), he = (l) => p.state.subscribe({
    next: (f) => {
      to(l.name, f.name, l.exact) && eo(f, l.formState || m, ss, l.reRenderRoot) && l.callback({
        values: { ...o },
        ...r,
        ...f,
        defaultValues: s
      });
    }
  }).unsubscribe, Ue = (l) => (a.mount = !0, h = {
    ...h,
    ...l.formState
  }, he({
    ...l,
    formState: h
  })), Te = (l, f = {}) => {
    for (const g of l ? et(l) : c.mount)
      c.mount.delete(g), c.array.delete(g), f.keepValue || (G(n, g), G(o, g)), !f.keepError && G(r.errors, g), !f.keepDirty && G(r.dirtyFields, g), !f.keepTouched && G(r.touchedFields, g), !f.keepIsValidating && G(r.validatingFields, g), !t.shouldUnregister && !f.keepDefaultValue && G(s, g);
    p.state.next({
      values: se(o)
    }), p.state.next({
      ...r,
      ...f.keepDirty ? { isDirty: Y() } : {}
    }), !f.keepIsValid && y();
  }, te = ({ disabled: l, name: f }) => {
    (_e(l) && a.mount || l || c.disabled.has(f)) && (l ? c.disabled.add(f) : c.disabled.delete(f));
  }, we = (l, f = {}) => {
    let g = k(n, l);
    const N = _e(f.disabled) || _e(t.disabled);
    return q(n, l, {
      ...g || {},
      _f: {
        ...g && g._f ? g._f : { ref: { name: l } },
        name: l,
        mount: !0,
        ...f
      }
    }), c.mount.add(l), g ? te({
      disabled: _e(f.disabled) ? f.disabled : t.disabled,
      name: l
    }) : S(l, !0, f.value), {
      ...N ? { disabled: f.disabled || t.disabled } : {},
      ...t.progressive ? {
        required: !!f.required,
        min: He(f.min),
        max: He(f.max),
        minLength: He(f.minLength),
        maxLength: He(f.maxLength),
        pattern: He(f.pattern)
      } : {},
      name: l,
      onChange: me,
      onBlur: me,
      ref: (j) => {
        if (j) {
          we(l, f), g = k(n, l);
          const b = K(j.value) && j.querySelectorAll && j.querySelectorAll("input,select,textarea")[0] || j, F = Ys(b), I = g._f.refs || [];
          if (F ? I.find((V) => V === b) : b === g._f.ref)
            return;
          q(n, l, {
            _f: {
              ...g._f,
              ...F ? {
                refs: [
                  ...I.filter(Ut),
                  b,
                  ...Array.isArray(k(s, l)) ? [{}] : []
                ],
                ref: { type: b.type, name: l }
              } : { ref: b }
            }
          }), S(l, !1, void 0, b);
        } else
          g = k(n, l, {}), g._f && (g._f.mount = !1), (t.shouldUnregister || f.shouldUnregister) && !(Vs(c.array, l) && a.action) && c.unMount.add(l);
      }
    };
  }, Se = () => t.shouldFocusError && tt(n, Fe, c.mount), Vt = (l) => {
    _e(l) && (p.state.next({ disabled: l }), tt(n, (f, g) => {
      const N = k(n, g);
      N && (f.disabled = N._f.disabled || l, Array.isArray(N._f.refs) && N._f.refs.forEach((j) => {
        j.disabled = N._f.disabled || l;
      }));
    }, 0, !1));
  }, wr = (l, f) => async (g) => {
    let N;
    g && (g.preventDefault && g.preventDefault(), g.persist && g.persist());
    let j = se(o);
    if (p.state.next({
      isSubmitting: !0
    }), t.resolver) {
      const { errors: b, values: F } = await ce();
      r.errors = b, j = se(F);
    } else
      await D(n);
    if (c.disabled.size)
      for (const b of c.disabled)
        G(j, b);
    if (G(r.errors, "root"), fe(r.errors)) {
      p.state.next({
        errors: {}
      });
      try {
        await l(j, g);
      } catch (b) {
        N = b;
      }
    } else
      f && await f({ ...r.errors }, g), Se(), setTimeout(Se);
    if (p.state.next({
      isSubmitted: !0,
      isSubmitting: !1,
      isSubmitSuccessful: fe(r.errors) && !N,
      submitCount: r.submitCount + 1,
      errors: r.errors
    }), N)
      throw N;
  }, rs = (l, f = {}) => {
    k(n, l) && (K(f.defaultValue) ? ae(l, se(k(s, l))) : (ae(l, f.defaultValue), q(s, l, se(f.defaultValue))), f.keepTouched || G(r.touchedFields, l), f.keepDirty || (G(r.dirtyFields, l), r.isDirty = f.defaultValue ? Y(l, se(k(s, l))) : Y()), f.keepError || (G(r.errors, l), m.isValid && y()), p.state.next({ ...r }));
  }, _r = (l, f = {}) => {
    const g = l ? se(l) : s, N = se(g), j = fe(l), b = j ? s : N;
    if (f.keepDefaultValues || (s = g), !f.keepValues) {
      if (f.keepDirtyValues) {
        const F = /* @__PURE__ */ new Set([
          ...c.mount,
          ...Object.keys(Ye(s, o))
        ]);
        for (const I of Array.from(F))
          k(r.dirtyFields, I) ? q(b, I, k(o, I)) : ae(I, k(b, I));
      } else {
        if (tr && K(l))
          for (const F of c.mount) {
            const I = k(n, F);
            if (I && I._f) {
              const V = Array.isArray(I._f.refs) ? I._f.refs[0] : I._f.ref;
              if (Ft(V)) {
                const ge = V.closest("form");
                if (ge) {
                  ge.reset();
                  break;
                }
              }
            }
          }
        if (f.keepFieldsRef)
          for (const F of c.mount)
            ae(F, k(b, F));
        else
          n = {};
      }
      o = t.shouldUnregister ? f.keepDefaultValues ? se(s) : {} : se(b), p.array.next({
        values: { ...b }
      }), p.state.next({
        values: { ...b }
      });
    }
    c = {
      mount: f.keepDirtyValues ? c.mount : /* @__PURE__ */ new Set(),
      unMount: /* @__PURE__ */ new Set(),
      array: /* @__PURE__ */ new Set(),
      disabled: /* @__PURE__ */ new Set(),
      watch: /* @__PURE__ */ new Set(),
      watchAll: !1,
      focus: ""
    }, a.mount = !m.isValid || !!f.keepIsValid || !!f.keepDirtyValues, a.watch = !!t.shouldUnregister, p.state.next({
      submitCount: f.keepSubmitCount ? r.submitCount : 0,
      isDirty: j ? !1 : f.keepDirty ? r.isDirty : !!(f.keepDefaultValues && !Ae(l, s)),
      isSubmitted: f.keepIsSubmitted ? r.isSubmitted : !1,
      dirtyFields: j ? {} : f.keepDirtyValues ? f.keepDefaultValues && o ? Ye(s, o) : r.dirtyFields : f.keepDefaultValues && l ? Ye(s, l) : f.keepDirty ? r.dirtyFields : {},
      touchedFields: f.keepTouched ? r.touchedFields : {},
      errors: f.keepErrors ? r.errors : {},
      isSubmitSuccessful: f.keepIsSubmitSuccessful ? r.isSubmitSuccessful : !1,
      isSubmitting: !1,
      defaultValues: s
    });
  }, jr = (l, f) => _r(ye(l) ? l(o) : l, f), ns = (l, f = {}) => {
    const g = k(n, l), N = g && g._f;
    if (N) {
      const j = N.refs ? N.refs[0] : N.ref;
      j.focus && (j.focus(), f.shouldSelect && ye(j.select) && j.select());
    }
  }, ss = (l) => {
    r = {
      ...r,
      ...l
    };
  }, Nr = {
    control: {
      register: we,
      unregister: Te,
      getFieldState: R,
      handleSubmit: wr,
      setError: ee,
      _subscribe: he,
      _runSchema: ce,
      _focusError: Se,
      _getWatch: Z,
      _getDirty: Y,
      _setValid: y,
      _setFieldArray: T,
      _setDisabledField: te,
      _setErrors: A,
      _getFieldArray: O,
      _reset: _r,
      _resetDefaultValues: () => ye(t.defaultValues) && t.defaultValues().then((l) => {
        jr(l, t.resetOptions), p.state.next({
          isLoading: !1
        });
      }),
      _removeUnmounted: B,
      _disableForm: Vt,
      _subjects: p,
      _proxyFormState: m,
      get _fields() {
        return n;
      },
      get _formValues() {
        return o;
      },
      get _state() {
        return a;
      },
      set _state(l) {
        a = l;
      },
      get _defaultValues() {
        return s;
      },
      get _names() {
        return c;
      },
      set _names(l) {
        c = l;
      },
      get _formState() {
        return r;
      },
      get _options() {
        return t;
      },
      set _options(l) {
        t = {
          ...t,
          ...l
        };
      }
    },
    subscribe: Ue,
    trigger: ke,
    register: we,
    handleSubmit: wr,
    watch: be,
    setValue: ae,
    getValues: v,
    reset: jr,
    resetField: rs,
    clearErrors: U,
    unregister: Te,
    setError: ee,
    setFocus: ns,
    getFieldState: R
  };
  return {
    ...Nr,
    formControl: Nr
  };
}
function io(e = {}) {
  const t = w.useRef(void 0), r = w.useRef(void 0), [n, s] = w.useState({
    isDirty: !1,
    isValidating: !1,
    isLoading: ye(e.defaultValues),
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
    defaultValues: ye(e.defaultValues) ? void 0 : e.defaultValues
  });
  if (!t.current)
    if (e.formControl)
      t.current = {
        ...e.formControl,
        formState: n
      }, e.defaultValues && !ye(e.defaultValues) && e.formControl.reset(e.defaultValues, e.resetOptions);
    else {
      const { formControl: a, ...c } = ao(e);
      t.current = {
        ...c,
        formState: n
      };
    }
  const o = t.current.control;
  return o._options = e, Ws(() => {
    const a = o._subscribe({
      formState: o._proxyFormState,
      callback: () => s({ ...o._formState }),
      reRenderRoot: !0
    });
    return s((c) => ({
      ...c,
      isReady: !0
    })), o._formState.isReady = !0, a;
  }, [o]), w.useEffect(() => o._disableForm(e.disabled), [o, e.disabled]), w.useEffect(() => {
    e.mode && (o._options.mode = e.mode), e.reValidateMode && (o._options.reValidateMode = e.reValidateMode);
  }, [o, e.mode, e.reValidateMode]), w.useEffect(() => {
    e.errors && (o._setErrors(e.errors), o._focusError());
  }, [o, e.errors]), w.useEffect(() => {
    e.shouldUnregister && o._subjects.state.next({
      values: o._getWatch()
    });
  }, [o, e.shouldUnregister]), w.useEffect(() => {
    if (o._proxyFormState.isDirty) {
      const a = o._getDirty();
      a !== n.isDirty && o._subjects.state.next({
        isDirty: a
      });
    }
  }, [o, n.isDirty]), w.useEffect(() => {
    e.values && !Ae(e.values, r.current) ? (o._reset(e.values, {
      keepFieldsRef: !0,
      ...o._options.resetOptions
    }), r.current = e.values, s((a) => ({ ...a }))) : o._resetDefaultValues();
  }, [o, e.values]), w.useEffect(() => {
    o._state.mount || (o._setValid(), o._state.mount = !0), o._state.watch && (o._state.watch = !1, o._subjects.state.next({ ...o._formState })), o._removeUnmounted();
  }), t.current.formState = Us(n, o), t.current;
}
const Tt = w.forwardRef(({
  variant: e = "default",
  inputSize: t = "md",
  error: r = !1,
  success: n = !1,
  fullWidth: s = !1,
  icon: o,
  iconPosition: a = "left",
  className: c = "",
  name: u,
  ...d
}, m) => {
  let h;
  try {
    h = Pe();
  } catch {
  }
  const p = u && h ? h.register(u) : {}, _ = [
    "qwanyx-input",
    `qwanyx-input--${t}`,
    `qwanyx-input--${e}`,
    r && "qwanyx-input--error",
    n && "qwanyx-input--success",
    s && "qwanyx-input--fullwidth",
    o && a === "left" && "qwanyx-input--icon-left",
    o && a === "right" && "qwanyx-input--icon-right",
    c
  ].filter(Boolean).join(" ");
  if (o) {
    const z = [
      "qwanyx-input-wrapper",
      s && "qwanyx-input-wrapper--fullwidth"
    ].filter(Boolean).join(" "), y = [
      "qwanyx-input-wrapper__icon",
      `qwanyx-input-wrapper__icon--${a}`
    ].join(" ");
    return /* @__PURE__ */ i.jsxs("div", { className: z, children: [
      o && /* @__PURE__ */ i.jsx("div", { className: y, children: o }),
      /* @__PURE__ */ i.jsx(
        "input",
        {
          ref: m,
          className: _,
          ...p,
          ...d
        }
      )
    ] });
  }
  return /* @__PURE__ */ i.jsx(
    "input",
    {
      ref: m,
      className: _,
      ...p,
      ...d
    }
  );
});
Tt.displayName = "Input";
const wn = w.forwardRef(({
  variant: e = "default",
  textareaSize: t = "md",
  error: r = !1,
  success: n = !1,
  fullWidth: s = !1,
  resize: o = "vertical",
  className: a = "",
  name: c,
  ...u
}, d) => {
  let m;
  try {
    m = Pe();
  } catch {
  }
  const h = c && m ? m.register(c) : {}, p = [
    "qwanyx-input",
    "qwanyx-textarea",
    `qwanyx-input--${t}`,
    `qwanyx-input--${e}`,
    r && "qwanyx-input--error",
    n && "qwanyx-input--success",
    s && "qwanyx-input--fullwidth",
    `qwanyx-textarea--resize-${o}`,
    a
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx(
    "textarea",
    {
      ref: d,
      className: p,
      ...h,
      ...u
    }
  );
});
wn.displayName = "Textarea";
const $e = w.forwardRef(({
  children: e,
  as: t = "h2",
  size: r,
  weight: n = "semibold",
  color: s = "primary",
  align: o = "left",
  className: a = "",
  ...c
}, u) => {
  const d = r || {
    h1: "4xl",
    h2: "3xl",
    h3: "2xl",
    h4: "xl",
    h5: "lg",
    h6: "base"
  }[t], m = {
    "5xl": "text-5xl",
    "4xl": "text-4xl",
    "3xl": "text-3xl",
    "2xl": "text-2xl",
    xl: "text-xl",
    lg: "text-lg",
    base: "text-base",
    sm: "text-sm",
    xs: "text-xs"
  }, h = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold"
  }, p = {
    primary: "text-text-primary",
    secondary: "text-text-secondary",
    muted: "text-text-muted",
    accent: "text-accent",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
    info: "text-info"
  }, _ = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify"
  }, z = [
    m[d],
    h[n],
    p[s],
    _[o],
    "font-heading",
    a
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx(t, { ref: u, className: z, ...c, children: e });
});
$e.displayName = "Heading";
const ue = w.forwardRef(({
  children: e,
  as: t = "p",
  size: r = "base",
  weight: n = "normal",
  color: s = "primary",
  align: o = "left",
  italic: a = !1,
  underline: c = !1,
  lineThrough: u = !1,
  className: d = "",
  style: m
}, h) => {
  const p = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl"
  }, _ = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold"
  }, z = {
    primary: "text-text-primary",
    secondary: "text-text-secondary",
    muted: "text-text-muted",
    accent: "text-accent",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
    info: "text-info"
  }, y = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify"
  }, $ = [
    a && "italic",
    c && "underline",
    u && "line-through"
  ].filter(Boolean).join(" "), T = [
    p[r],
    _[n],
    z[s],
    y[o],
    $,
    d
  ].filter(Boolean).join(" ");
  return t === "label" ? /* @__PURE__ */ i.jsx("label", { ref: h, className: T, style: m, children: e }) : /* @__PURE__ */ i.jsx(t, { ref: h, className: T, style: m, children: e });
});
ue.displayName = "Text";
const co = w.forwardRef(({
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
co.displayName = "Code";
const ze = w.forwardRef(({
  children: e,
  size: t = "xl",
  padding: r = "md",
  center: n = !0,
  className: s = "",
  ...o
}, a) => {
  const c = [
    "qwanyx-container",
    `qwanyx-container--${t}`,
    r !== "none" && `qwanyx-container--padding-${r}`,
    n && "qwanyx-container--center",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("div", { ref: a, className: c, ...o, children: e });
});
ze.displayName = "Container";
const Xe = w.forwardRef(({
  children: e,
  spacing: t = "lg",
  fullHeight: r = !1,
  className: n = "",
  ...s
}, o) => {
  const a = [
    "qwanyx-section",
    t !== "none" && `qwanyx-section--spacing-${t}`,
    r && "qwanyx-section--fullheight",
    n
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("section", { ref: o, className: a, ...s, children: e });
});
Xe.displayName = "Section";
const wt = w.forwardRef(({
  children: e,
  cols: t = 3,
  gap: r = "md",
  responsive: n = !0,
  className: s = "",
  ...o
}, a) => {
  const c = [
    "qwanyx-grid",
    `qwanyx-grid--cols-${t}`,
    n && "qwanyx-grid--responsive",
    r !== "none" && `qwanyx-grid--gap-${r}`,
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("div", { ref: a, className: c, ...o, children: e });
});
wt.displayName = "Grid";
const _t = w.forwardRef(({
  children: e,
  direction: t = "row",
  wrap: r = "nowrap",
  justify: n = "start",
  align: s = "stretch",
  gap: o = "none",
  fullWidth: a = !1,
  fullHeight: c = !1,
  className: u = "",
  ...d
}, m) => {
  const h = [
    "qwanyx-flex",
    `qwanyx-flex--${t}`,
    `qwanyx-flex--${r}`,
    `qwanyx-flex--justify-${n}`,
    `qwanyx-flex--align-${s}`,
    o !== "none" && `qwanyx-flex--gap-${o}`,
    a && "qwanyx-flex--fullwidth",
    c && "qwanyx-flex--fullheight",
    u
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("div", { ref: m, className: h, ...d, children: e });
});
_t.displayName = "Flex";
const _n = w.forwardRef(({
  children: e,
  fixed: t = !1,
  transparent: r = !1,
  bordered: n = !0,
  className: s = "",
  ...o
}, a) => {
  const c = [
    "qwanyx-navbar",
    t && "qwanyx-navbar--fixed",
    r && "qwanyx-navbar--transparent",
    !n && "qwanyx-navbar--borderless",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("nav", { ref: a, className: c, ...o, children: e });
});
_n.displayName = "Navbar";
const jn = w.forwardRef(({
  children: e,
  className: t = "",
  ...r
}, n) => /* @__PURE__ */ i.jsx("div", { ref: n, className: `qwanyx-navbar__brand ${t}`, ...r, children: e }));
jn.displayName = "NavbarBrand";
const lo = w.forwardRef(({
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
lo.displayName = "NavbarLogo";
const uo = w.forwardRef(({
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
uo.displayName = "NavbarContent";
const Yt = w.forwardRef(({
  children: e,
  active: t = !1,
  as: r = "div",
  className: n = "",
  href: s,
  onClick: o
}, a) => {
  const c = [
    "qwanyx-navbar__item",
    t && "qwanyx-navbar__item--active",
    n
  ].filter(Boolean).join(" ");
  return r === "a" || s ? /* @__PURE__ */ i.jsx(
    "a",
    {
      ref: a,
      className: c,
      href: s,
      onClick: o,
      children: e
    }
  ) : r === "button" ? /* @__PURE__ */ i.jsx(
    "button",
    {
      ref: a,
      className: c,
      onClick: o,
      children: e
    }
  ) : /* @__PURE__ */ i.jsx(
    "div",
    {
      ref: a,
      className: c,
      onClick: o,
      children: e
    }
  );
});
Yt.displayName = "NavbarItem";
const Ht = w.forwardRef(({
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
Ht.displayName = "NavbarMenu";
const fo = ({
  logo: e,
  title: t,
  subtitle: r,
  items: n = [],
  actions: s,
  fixed: o = !1
}) => {
  const [a, c] = w.useState(!1);
  return /* @__PURE__ */ i.jsx(_n, { fixed: o, className: "qwanyx-navbar--simple", children: /* @__PURE__ */ i.jsxs(ze, { children: [
    /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-navbar__container", children: [
      /* @__PURE__ */ i.jsxs("div", { className: "qwanyx-navbar__left", children: [
        /* @__PURE__ */ i.jsxs(jn, { children: [
          e,
          (t || r) && /* @__PURE__ */ i.jsxs("div", { children: [
            t && /* @__PURE__ */ i.jsx("div", { className: "qwanyx-navbar__title", children: t }),
            r && /* @__PURE__ */ i.jsx("div", { className: "qwanyx-navbar__subtitle", children: r })
          ] })
        ] }),
        /* @__PURE__ */ i.jsx(Ht, { children: n.map((u, d) => /* @__PURE__ */ i.jsx(
          Yt,
          {
            as: "a",
            href: u.href,
            active: u.active,
            onClick: u.onClick,
            children: u.label
          },
          d
        )) })
      ] }),
      s && /* @__PURE__ */ i.jsx("div", { className: "qwanyx-navbar__actions", children: s }),
      /* @__PURE__ */ i.jsx(
        "button",
        {
          className: "qwanyx-navbar__mobile-toggle",
          onClick: () => c(!a),
          children: /* @__PURE__ */ i.jsx("svg", { style: { width: "1.5rem", height: "1.5rem" }, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: a ? /* @__PURE__ */ i.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) : /* @__PURE__ */ i.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" }) })
        }
      )
    ] }),
    /* @__PURE__ */ i.jsxs(Ht, { mobile: !0, open: a, children: [
      n.map((u, d) => /* @__PURE__ */ i.jsx(
        Yt,
        {
          as: "a",
          href: u.href,
          active: u.active,
          onClick: u.onClick,
          children: u.label
        },
        d
      )),
      s && /* @__PURE__ */ i.jsx("div", { className: "qwanyx-navbar__mobile-actions", children: s })
    ] })
  ] }) });
}, cr = Zt(void 0), Nn = w.forwardRef(({
  children: e,
  defaultValue: t,
  value: r,
  onValueChange: n,
  variant: s = "line",
  size: o = "md",
  fullWidth: a = !1,
  className: c = "",
  ...u
}, d) => {
  const [m, h] = X(t || ""), p = r !== void 0 ? r : m, _ = ($) => {
    r === void 0 && h($), n == null || n($);
  }, y = [
    "w-full",
    c
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx(cr.Provider, { value: { activeTab: p, setActiveTab: _ }, children: /* @__PURE__ */ i.jsx("div", { ref: d, className: y, ...u, children: e }) });
});
Nn.displayName = "Tabs";
const kn = w.forwardRef(({
  children: e,
  variant: t = "line",
  size: r = "md",
  fullWidth: n = !1,
  className: s = "",
  ...o
}, a) => {
  const c = "flex", u = {
    line: "border-b border-border",
    boxed: "border-b border-gray-200",
    pills: "gap-2"
  }, d = n ? "w-full" : "", m = [
    c,
    u[t],
    d,
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("div", { ref: a, className: m, ...o, children: w.Children.map(e, (h) => w.isValidElement(h) ? w.cloneElement(h, {
    variant: t,
    size: r,
    fullWidth: n
  }) : h) });
});
kn.displayName = "TabsList";
const Cn = w.forwardRef(({
  children: e,
  value: t,
  variant: r = "line",
  size: n = "md",
  fullWidth: s = !1,
  className: o = "",
  onClick: a,
  ...c
}, u) => {
  const d = Oe(cr);
  if (!d)
    throw new Error("TabsTrigger must be used within Tabs");
  const { activeTab: m, setActiveTab: h } = d, p = m === t, _ = (A) => {
    h(t), a == null || a(A);
  }, z = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  }, y = {
    line: p ? "border-b-2 border-blue-500 text-blue-500 -mb-[1px]" : "text-gray-600 hover:text-gray-900 hover:border-b-2 hover:border-gray-300 -mb-[1px]",
    boxed: p ? "bg-white border border-gray-200 border-b-white -mb-[1px] rounded-t-md text-gray-900" : "border border-transparent hover:bg-gray-50 text-gray-600 hover:text-gray-900",
    pills: p ? "bg-blue-500 text-white rounded-full" : "bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full"
  }, $ = "font-medium transition-all duration-200 focus:outline-none", T = s ? "flex-1" : "", C = [
    $,
    z[n],
    y[r],
    T,
    o
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx(
    "button",
    {
      ref: u,
      type: "button",
      role: "tab",
      "aria-selected": p,
      className: C,
      onClick: _,
      ...c,
      children: e
    }
  );
});
Cn.displayName = "TabsTrigger";
const $n = w.forwardRef(({
  children: e,
  value: t,
  className: r = "",
  ...n
}, s) => {
  const o = Oe(cr);
  if (!o)
    throw new Error("TabsContent must be used within Tabs");
  const { activeTab: a } = o;
  return a !== t ? null : /* @__PURE__ */ i.jsx(
    "div",
    {
      ref: s,
      role: "tabpanel",
      className: `mt-6 ${r}`,
      ...n,
      children: e
    }
  );
});
$n.displayName = "TabsContent";
const Nl = ({
  tabs: e,
  defaultTab: t,
  variant: r = "line",
  size: n = "md",
  fullWidth: s = !1,
  className: o = ""
}) => {
  var c;
  const a = t || ((c = e[0]) == null ? void 0 : c.id);
  return /* @__PURE__ */ i.jsxs(Nn, { defaultValue: a, className: o, children: [
    /* @__PURE__ */ i.jsx(kn, { variant: r, size: n, fullWidth: s, children: e.map((u) => /* @__PURE__ */ i.jsx(
      Cn,
      {
        value: u.id,
        disabled: u.disabled,
        children: u.label
      },
      u.id
    )) }),
    e.map((u) => /* @__PURE__ */ i.jsx($n, { value: u.id, children: u.content }, u.id))
  ] });
}, zn = w.forwardRef(({
  children: e,
  size: t = "lg",
  centered: r = !0,
  overlay: n = !1,
  overlayOpacity: s = 0.5,
  backgroundImage: o,
  backgroundColor: a,
  className: c = "",
  style: u,
  ...d
}, m) => {
  const h = {
    sm: "py-12",
    md: "py-20",
    lg: "py-32",
    xl: "py-48",
    full: "min-h-screen flex items-center"
  }, p = "relative overflow-hidden", _ = r ? "text-center" : "", z = [
    p,
    h[t],
    _,
    c
  ].filter(Boolean).join(" "), y = {
    ...u,
    ...o && {
      backgroundImage: `url(${o})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    ...a && { backgroundColor: a }
  };
  return /* @__PURE__ */ i.jsxs("section", { ref: m, className: z, style: y, ...d, children: [
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
zn.displayName = "Hero";
const Fn = w.forwardRef(({
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
Fn.displayName = "HeroTitle";
const En = w.forwardRef(({
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
En.displayName = "HeroSubtitle";
const An = w.forwardRef(({
  children: e,
  className: t = "",
  ...r
}, n) => /* @__PURE__ */ i.jsx(ze, { children: /* @__PURE__ */ i.jsx("div", { ref: n, className: t, ...r, children: e }) }));
An.displayName = "HeroContent";
const Tn = w.forwardRef(({
  children: e,
  spacing: t = "md",
  className: r = "",
  ...n
}, s) => {
  const c = [
    "flex flex-wrap justify-center items-center",
    {
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6"
    }[t],
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("div", { ref: s, className: c, ...n, children: e });
});
Tn.displayName = "HeroActions";
const jt = w.forwardRef(({
  children: e,
  icon: t,
  iconPosition: r = "top",
  centered: n = !1,
  className: s = "",
  ...o
}, a) => {
  const c = n ? "text-center" : "", u = {
    top: "flex flex-col",
    left: "flex flex-row items-start",
    right: "flex flex-row-reverse items-start"
  }, d = {
    top: "mb-4",
    left: "mr-4",
    right: "ml-4"
  }, m = [
    c,
    t ? u[r] : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsxs("div", { ref: a, className: m, ...o, children: [
    t && /* @__PURE__ */ i.jsx("div", { className: d[r], children: t }),
    /* @__PURE__ */ i.jsx("div", { className: "flex-1", children: e })
  ] });
});
jt.displayName = "Feature";
const Nt = w.forwardRef(({
  children: e,
  size: t = "md",
  variant: r = "circle",
  color: n = "primary",
  className: s = "",
  ...o
}, a) => {
  const c = {
    sm: "w-10 h-10 text-lg",
    md: "w-12 h-12 text-xl",
    lg: "w-16 h-16 text-2xl",
    xl: "w-20 h-20 text-3xl"
  }, u = {
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
  }, h = [
    "flex items-center justify-center",
    c[t],
    u[r],
    r !== "none" ? d[n] : "",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("div", { ref: a, className: h, ...o, children: e });
});
Nt.displayName = "FeatureIcon";
const kt = w.forwardRef(({
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
kt.displayName = "FeatureTitle";
const Ct = w.forwardRef(({
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
Ct.displayName = "FeatureDescription";
const Sn = w.forwardRef(({
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
  }, c = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
    xl: "gap-12"
  }, d = [
    "grid",
    a[t],
    c[r],
    n
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("div", { ref: o, className: d, ...s, children: e });
});
Sn.displayName = "FeaturesGrid";
const Rn = w.forwardRef(({
  children: e,
  variant: t = "simple",
  className: r = "",
  ...n
}, s) => {
  const c = [
    "border-t border-border",
    {
      simple: "py-8",
      detailed: "py-12",
      minimal: "py-4"
    }[t],
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("footer", { ref: s, className: c, ...n, children: /* @__PURE__ */ i.jsx(ze, { children: e }) });
});
Rn.displayName = "Footer";
const Qe = w.forwardRef(({
  children: e,
  className: t = "",
  ...r
}, n) => /* @__PURE__ */ i.jsx("div", { ref: n, className: t, ...r, children: e }));
Qe.displayName = "FooterSection";
const $t = w.forwardRef(({
  children: e,
  className: t = "",
  ...r
}, n) => {
  const o = [
    "font-semibold text-gray-900 mb-4",
    t
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("h3", { ref: n, className: o, ...r, children: e });
});
$t.displayName = "FooterTitle";
const ie = w.forwardRef(({
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
ie.displayName = "FooterLink";
const zt = w.forwardRef(({
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
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("ul", { ref: s, className: a, ...n, children: w.Children.map(e, (c) => /* @__PURE__ */ i.jsx("li", { children: c })) });
});
zt.displayName = "FooterLinks";
const Zn = w.forwardRef(({
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
  }, c = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
    xl: "gap-12"
  }, d = [
    "grid",
    a[t],
    c[r],
    n
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("div", { ref: o, className: d, ...s, children: e });
});
Zn.displayName = "FooterGrid";
const Dn = w.forwardRef(({
  children: e,
  className: t = "",
  ...r
}, n) => {
  const o = [
    "mt-8 pt-8 border-t border-border text-sm text-gray-600",
    t
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("div", { ref: n, className: o, ...r, children: e });
});
Dn.displayName = "FooterBottom";
const Le = w.forwardRef(({
  children: e,
  variant: t = "solid",
  color: r = "primary",
  size: n = "md",
  rounded: s = "md",
  className: o = "",
  ...a
}, c) => {
  const u = [
    "qwanyx-badge",
    `qwanyx-badge--${n}`,
    `qwanyx-badge--rounded-${s}`,
    `qwanyx-badge--${t}`,
    `qwanyx-badge--${r}`,
    o
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("span", { ref: c, className: u, ...a, children: e });
});
Le.displayName = "Badge";
const mo = w.forwardRef(({
  children: e,
  icon: t,
  iconPosition: r = "left",
  ...n
}, s) => /* @__PURE__ */ i.jsxs(Le, { ref: s, ...n, children: [
  t && r === "left" && /* @__PURE__ */ i.jsx("span", { className: `qwanyx-badge__icon--${r}`, children: t }),
  e,
  t && r === "right" && /* @__PURE__ */ i.jsx("span", { className: `qwanyx-badge__icon--${r}`, children: t })
] }));
mo.displayName = "IconBadge";
const ho = w.forwardRef(({
  children: e,
  onClose: t,
  ...r
}, n) => /* @__PURE__ */ i.jsxs(Le, { ref: n, ...r, children: [
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
ho.displayName = "ClosableBadge";
const po = w.forwardRef(({
  children: e,
  dot: t = !0,
  dotPosition: r = "left",
  dotColor: n = "primary",
  ...s
}, o) => /* @__PURE__ */ i.jsxs(Le, { ref: o, ...s, children: [
  t && r === "left" && /* @__PURE__ */ i.jsx("span", { className: `qwanyx-badge__dot qwanyx-badge__dot--${r} qwanyx-badge__dot--${n}` }),
  e,
  t && r === "right" && /* @__PURE__ */ i.jsx("span", { className: `qwanyx-badge__dot qwanyx-badge__dot--${r} qwanyx-badge__dot--${n}` })
] }));
po.displayName = "DotBadge";
const lr = w.forwardRef(({
  src: e,
  alt: t = "",
  size: r = "md",
  shape: n = "circle",
  fallback: s,
  status: o,
  statusPosition: a = "bottom-right",
  className: c = "",
  children: u,
  ...d
}, m) => {
  const h = [
    "qwanyx-avatar",
    `qwanyx-avatar--${r}`,
    `qwanyx-avatar--${n}`,
    c
  ].filter(Boolean).join(" "), p = () => typeof s == "string" ? /* @__PURE__ */ i.jsx("span", { className: "qwanyx-avatar__fallback", children: s }) : s;
  return /* @__PURE__ */ i.jsxs("div", { ref: m, className: h, ...d, children: [
    e ? /* @__PURE__ */ i.jsx(
      "img",
      {
        src: e,
        alt: t,
        className: "qwanyx-avatar__image"
      }
    ) : p(),
    u,
    o && /* @__PURE__ */ i.jsx(
      "span",
      {
        className: `qwanyx-avatar__status qwanyx-avatar__status--${o} qwanyx-avatar__status--${a}`
      }
    )
  ] });
});
lr.displayName = "Avatar";
const go = w.forwardRef(({
  children: e,
  max: t = 5,
  size: r = "md",
  spacing: n = "normal",
  className: s = "",
  ...o
}, a) => {
  const c = [
    "qwanyx-avatar-group",
    `qwanyx-avatar-group--${n}`,
    s
  ].filter(Boolean).join(" "), u = w.Children.toArray(e), d = u.slice(0, t), m = u.length - t;
  return /* @__PURE__ */ i.jsxs("div", { ref: a, className: c, ...o, children: [
    d.map((h) => w.isValidElement(h) ? w.cloneElement(h, {
      size: r,
      className: `${h.props.className || ""}`
    }) : h),
    m > 0 && /* @__PURE__ */ i.jsx(
      lr,
      {
        size: r,
        fallback: `+${m}`,
        className: "qwanyx-avatar--count"
      }
    )
  ] });
});
go.displayName = "AvatarGroup";
const xo = w.forwardRef(({
  name: e,
  color: t = "auto",
  className: r = "",
  ...n
}, s) => {
  const o = (u) => {
    const d = u.split(" ");
    return d.length >= 2 ? `${d[0][0]}${d[d.length - 1][0]}`.toUpperCase() : u.slice(0, 2).toUpperCase();
  }, a = (u) => {
    let d = 0;
    for (let m = 0; m < u.length; m++)
      d = u.charCodeAt(m) + ((d << 5) - d);
    return Math.abs(d) % 9;
  }, c = () => t === "auto" ? `qwanyx-avatar--color-${a(e)}` : `qwanyx-avatar--${t}`;
  return /* @__PURE__ */ i.jsx(
    lr,
    {
      ref: s,
      fallback: /* @__PURE__ */ i.jsx("span", { className: "qwanyx-avatar--initials", children: o(e) }),
      className: `${c()} ${r}`,
      ...n
    }
  );
});
xo.displayName = "InitialsAvatar";
const ur = w.forwardRef(({
  children: e,
  isOpen: t,
  onClose: r,
  size: n = "md",
  closeOnOverlayClick: s = !0,
  closeOnEscape: o = !0,
  showCloseButton: a = !0,
  overlayClassName: c = "",
  className: u = "",
  ...d
}, m) => {
  const h = dn(null);
  ve(() => {
    const y = ($) => {
      o && $.key === "Escape" && r();
    };
    return t && (document.addEventListener("keydown", y), document.body.style.overflow = "hidden"), () => {
      document.removeEventListener("keydown", y), document.body.style.overflow = "";
    };
  }, [t, r, o]);
  const p = (y) => {
    s && y.target === y.currentTarget && r();
  }, _ = [
    "qwanyx-modal-overlay",
    c
  ].filter(Boolean).join(" "), z = [
    "qwanyx-modal",
    `qwanyx-modal--${n}`,
    u
  ].filter(Boolean).join(" ");
  return t ? cs(
    /* @__PURE__ */ i.jsx(
      "div",
      {
        className: _,
        onClick: p,
        role: "dialog",
        "aria-modal": "true",
        children: /* @__PURE__ */ i.jsxs(
          "div",
          {
            ref: m || h,
            className: z,
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
    ),
    document.body
  ) : null;
});
ur.displayName = "Modal";
const dr = w.forwardRef(({
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
dr.displayName = "ModalHeader";
const fr = w.forwardRef(({
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
fr.displayName = "ModalTitle";
const mr = w.forwardRef(({
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
mr.displayName = "ModalDescription";
const hr = w.forwardRef(({
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
hr.displayName = "ModalBody";
const pr = w.forwardRef(({
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
pr.displayName = "ModalFooter";
const kl = ({
  isOpen: e,
  onClose: t,
  title: r,
  description: n,
  children: s,
  footer: o,
  size: a = "md",
  closeOnOverlayClick: c = !0,
  closeOnEscape: u = !0,
  showCloseButton: d = !0
}) => /* @__PURE__ */ i.jsxs(
  ur,
  {
    isOpen: e,
    onClose: t,
    size: a,
    closeOnOverlayClick: c,
    closeOnEscape: u,
    showCloseButton: d,
    children: [
      (r || n) && /* @__PURE__ */ i.jsxs(dr, { children: [
        r && /* @__PURE__ */ i.jsx(fr, { children: r }),
        n && /* @__PURE__ */ i.jsx(mr, { children: n })
      ] }),
      /* @__PURE__ */ i.jsx(hr, { children: s }),
      o && /* @__PURE__ */ i.jsx(pr, { children: o })
    ]
  }
), yo = w.forwardRef(({
  children: e,
  variant: t = "info",
  title: r,
  dismissible: n = !1,
  onDismiss: s,
  className: o = "",
  ...a
}, c) => {
  const u = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800"
  }, d = {
    info: "text-blue-400",
    success: "text-green-400",
    warning: "text-yellow-400",
    error: "text-red-400"
  }, m = {
    info: /* @__PURE__ */ i.jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ i.jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z", clipRule: "evenodd" }) }),
    success: /* @__PURE__ */ i.jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ i.jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) }),
    warning: /* @__PURE__ */ i.jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ i.jsx("path", { fillRule: "evenodd", d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }),
    error: /* @__PURE__ */ i.jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ i.jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) })
  }, p = [
    "border rounded-lg p-4",
    u[t],
    o
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("div", { ref: c, className: p, role: "alert", ...a, children: /* @__PURE__ */ i.jsxs("div", { className: "flex", children: [
    /* @__PURE__ */ i.jsx("div", { className: `flex-shrink-0 ${d[t]}`, children: m[t] }),
    /* @__PURE__ */ i.jsxs("div", { className: "ml-3 flex-1", children: [
      r && /* @__PURE__ */ i.jsx("h3", { className: "text-sm font-medium mb-1", children: r }),
      /* @__PURE__ */ i.jsx("div", { className: "text-sm", children: e })
    ] }),
    n && /* @__PURE__ */ i.jsx("div", { className: "ml-auto pl-3", children: /* @__PURE__ */ i.jsxs(
      "button",
      {
        onClick: s,
        className: "inline-flex rounded-md p-1.5 hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-white",
        children: [
          /* @__PURE__ */ i.jsx("span", { className: "sr-only", children: "Dismiss" }),
          /* @__PURE__ */ i.jsx("svg", { className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ i.jsx("path", { fillRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", clipRule: "evenodd" }) })
        ]
      }
    ) })
  ] }) });
});
yo.displayName = "Alert";
const vo = ({
  length: e = 6,
  value: t = "",
  onChange: r,
  onComplete: n,
  disabled: s = !1,
  error: o = !1,
  autoFocus: a = !0,
  className: c = ""
}) => {
  const [u, d] = X(() => {
    const y = t.split("").slice(0, e);
    return [...y, ...Array(e - y.length).fill("")];
  }), m = dn([]);
  ve(() => {
    a && m.current[0] && m.current[0].focus();
  }, [a]), ve(() => {
    const y = u.join("");
    r(y), y.length === e && n && n(y);
  }, [u, e, r, n]);
  const h = (y, $) => {
    var C;
    if (s || $ && !/^\d$/.test($)) return;
    const T = [...u];
    T[y] = $, d(T), $ && y < e - 1 && ((C = m.current[y + 1]) == null || C.focus());
  }, p = (y, $) => {
    var T, C, A;
    if (!s) {
      if ($.key === "Backspace") {
        if (!u[y] && y > 0) {
          (T = m.current[y - 1]) == null || T.focus();
          const S = [...u];
          S[y - 1] = "", d(S);
        } else {
          const S = [...u];
          S[y] = "", d(S);
        }
        $.preventDefault();
      }
      $.key === "ArrowLeft" && y > 0 && ((C = m.current[y - 1]) == null || C.focus()), $.key === "ArrowRight" && y < e - 1 && ((A = m.current[y + 1]) == null || A.focus());
    }
  }, _ = (y) => {
    var T;
    if (s) return;
    y.preventDefault();
    const $ = y.clipboardData.getData("text").replace(/\D/g, "");
    if ($) {
      const C = $.split("").slice(0, e), A = [...C, ...Array(e - C.length).fill("")];
      d(A);
      const S = A.findIndex((oe) => oe === ""), P = S === -1 ? e - 1 : S;
      (T = m.current[P]) == null || T.focus();
    }
  }, z = (y) => {
    var $;
    ($ = m.current[y]) == null || $.select();
  };
  return /* @__PURE__ */ i.jsx("div", { className: `flex gap-2 justify-center ${c}`, children: Array.from({ length: e }, (y, $) => /* @__PURE__ */ i.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ i.jsx(
      "input",
      {
        ref: (T) => {
          T && (m.current[$] = T);
        },
        type: "text",
        inputMode: "numeric",
        maxLength: 1,
        value: u[$],
        onChange: (T) => h($, T.target.value),
        onKeyDown: (T) => p($, T),
        onPaste: _,
        onFocus: () => z($),
        disabled: s,
        className: `
              w-12 h-14 
              text-center text-2xl font-bold
              border-2 rounded-lg
              transition-all duration-200
              ${s ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed" : "bg-white text-gray-900 hover:border-blue-400 focus:border-blue-500"}
              ${o ? "border-red-500 focus:border-red-500 animate-shake" : u[$] ? "border-green-500" : "border-gray-300"}
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20
            `
      }
    ),
    u[$] && /* @__PURE__ */ i.jsx("div", { className: "absolute -bottom-2 left-1/2 transform -translate-x-1/2", children: /* @__PURE__ */ i.jsx("div", { className: "w-1.5 h-1.5 bg-blue-500 rounded-full" }) })
  ] }, $)) });
}, bo = ({
  duration: e = 600,
  // 10 minutes default
  onExpire: t,
  onResend: r,
  canResend: n = !0
}) => {
  const [s, o] = X(e), [a, c] = X(!1);
  ve(() => {
    if (s <= 0) {
      c(!0), t && t();
      return;
    }
    const m = setInterval(() => {
      o((h) => h - 1);
    }, 1e3);
    return () => clearInterval(m);
  }, [s, t]);
  const u = (m) => {
    const h = Math.floor(m / 60), p = m % 60;
    return `${h}:${p.toString().padStart(2, "0")}`;
  }, d = () => {
    o(e), c(!1), r && r();
  };
  return a ? /* @__PURE__ */ i.jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ i.jsx("p", { className: "text-red-600 text-sm mb-2", children: "Code expired" }),
    n && /* @__PURE__ */ i.jsx(
      "button",
      {
        onClick: d,
        className: "text-blue-500 hover:underline text-sm",
        children: "Resend code"
      }
    )
  ] }) : /* @__PURE__ */ i.jsx("div", { className: "text-center", children: /* @__PURE__ */ i.jsxs("p", { className: "text-gray-600 text-sm", children: [
    "Code expires in",
    " ",
    /* @__PURE__ */ i.jsx("span", { className: `font-mono font-bold ${s < 60 ? "text-red-600" : "text-gray-900"}`, children: u(s) })
  ] }) });
}, Cl = ({
  isOpen: e,
  onClose: t,
  mode: r = "login",
  workspace: n = "qwanyx-ui",
  apiUrl: s = "http://135.181.72.183:5002",
  onSuccess: o
}) => {
  const [a, c] = X(r), [u, d] = X("email"), [m, h] = X(""), [p, _] = X(""), [z, y] = X(!1), [$, T] = X(""), [C, A] = X("");
  ve(() => {
    e ? c(r) : (d("email"), h(""), _(""), T(""), A(""), y(!1));
  }, [e, r]);
  const S = async () => {
    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(m)) {
      T("Please enter a valid email address");
      return;
    }
    y(!0), T("");
    try {
      const B = await fetch(`${s}${a === "register" ? "/auth/register" : "/auth/request-code"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: m,
          workspace: n
        })
      }), Y = await B.json();
      B.ok ? (A(a === "register" ? "Welcome! Check your email for verification code." : "Code sent! Check your email."), d("code")) : T(Y.error || "Failed to send code");
    } catch {
      T("Network error. Please try again.");
    } finally {
      y(!1);
    }
  }, P = async () => {
    y(!0), T("");
    try {
      const le = await fetch(`${s}/auth/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: m,
          code: p,
          workspace: n
        })
      }), D = await le.json();
      le.ok ? (localStorage.setItem(`${n}_token`, D.access_token), localStorage.setItem(`${n}_user`, JSON.stringify(D.user)), o && o(D.user, D.access_token), h(""), _(""), d("email"), t()) : T(D.error || "Invalid code");
    } catch {
      T("Network error. Please try again.");
    } finally {
      y(!1);
    }
  }, oe = () => {
    d("email"), _(""), T(""), A("");
  }, ce = () => {
    c(a === "login" ? "register" : "login"), d("email"), T(""), A("");
  };
  return /* @__PURE__ */ i.jsxs(
    ur,
    {
      isOpen: e,
      onClose: t,
      size: "sm",
      showCloseButton: !0,
      children: [
        /* @__PURE__ */ i.jsxs(dr, { children: [
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
          /* @__PURE__ */ i.jsx(fr, { className: "text-center", children: a === "login" ? "Sign In" : "Create Account" }),
          /* @__PURE__ */ i.jsx(mr, { className: "text-center", children: u === "email" ? `Enter your email to ${a === "login" ? "sign in" : "register"}` : "Enter the code sent to your email" })
        ] }),
        /* @__PURE__ */ i.jsx(hr, { children: /* @__PURE__ */ i.jsxs("div", { className: "space-y-4", children: [
          $ && /* @__PURE__ */ i.jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm", children: $ }),
          C && /* @__PURE__ */ i.jsx("div", { className: "p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm", children: C }),
          u === "email" ? /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
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
                Tt,
                {
                  type: "email",
                  placeholder: "Enter your email",
                  value: m,
                  onChange: (le) => h(le.target.value),
                  disabled: z,
                  fullWidth: !0,
                  style: { paddingLeft: "2.5rem" },
                  error: !!$ && u === "email",
                  pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",
                  title: "Please enter a valid email address",
                  required: !0
                }
              )
            ] }),
            /* @__PURE__ */ i.jsx(
              pe,
              {
                fullWidth: !0,
                onClick: S,
                loading: z,
                disabled: !m,
                style: {
                  backgroundColor: "#E67E22",
                  color: "white",
                  opacity: m ? 1 : 0.6
                },
                children: "Send Code"
              }
            )
          ] }) : /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
            /* @__PURE__ */ i.jsxs("div", { className: "text-center text-sm text-gray-600 mb-4", children: [
              "Code sent to: ",
              /* @__PURE__ */ i.jsx("strong", { children: m })
            ] }),
            /* @__PURE__ */ i.jsx(
              vo,
              {
                value: p,
                onChange: _,
                onComplete: () => {
                  p.length === 6 && P();
                },
                disabled: z,
                error: !!$,
                autoFocus: !0
              }
            ),
            /* @__PURE__ */ i.jsx("div", { className: "mt-4", children: /* @__PURE__ */ i.jsx(
              bo,
              {
                duration: 600,
                onExpire: () => T("Code expired. Please request a new one."),
                onResend: S
              }
            ) }),
            /* @__PURE__ */ i.jsx(
              pe,
              {
                fullWidth: !0,
                onClick: P,
                loading: z,
                disabled: !p || p.length !== 6,
                className: "mt-4",
                children: "Verify Code"
              }
            ),
            /* @__PURE__ */ i.jsx(
              pe,
              {
                fullWidth: !0,
                variant: "ghost",
                onClick: oe,
                disabled: z,
                children: "Use Different Email"
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ i.jsx(pr, { align: "center", children: /* @__PURE__ */ i.jsxs(ue, { size: "sm", children: [
          a === "login" ? "Don't have an account? " : "Already have an account? ",
          /* @__PURE__ */ i.jsx(
            "button",
            {
              onClick: ce,
              className: "text-blue-500 hover:underline",
              disabled: z,
              children: a === "login" ? "Register" : "Sign In"
            }
          )
        ] }) })
      ]
    }
  );
}, $l = ({
  workspace: e = "qwanyx-ui",
  onLogin: t,
  onLogout: r
}) => {
  const n = localStorage.getItem(`${e}_user`), s = n ? JSON.parse(n) : null;
  return s ? /* @__PURE__ */ i.jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ i.jsx(ue, { size: "sm", children: s.email }),
    /* @__PURE__ */ i.jsx(
      pe,
      {
        size: "sm",
        variant: "ghost",
        onClick: () => {
          localStorage.removeItem(`${e}_token`), localStorage.removeItem(`${e}_user`), r && r();
        },
        children: "Sign Out"
      }
    )
  ] }) : /* @__PURE__ */ i.jsx(pe, { size: "sm", onClick: t, children: "Sign In" });
}, wo = ({
  href: e,
  autoDetect: t = !0
}) => {
  ve(() => {
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
    const c = o[a], u = new Image();
    u.onload = () => {
      n(c);
    }, u.onerror = () => {
      r(o, a + 1);
    }, u.src = c;
  }, n = (o) => {
    var d;
    const a = (d = o.split(".").pop()) == null ? void 0 : d.toLowerCase();
    let c = "image/x-icon";
    a === "png" ? c = "image/png" : a === "svg" ? c = "image/svg+xml" : (a === "jpg" || a === "jpeg") && (c = "image/jpeg");
    const u = document.createElement("link");
    if (u.rel = a === "svg" ? "icon" : "shortcut icon", u.type = c, u.href = o, document.head.appendChild(u), a !== "ico") {
      const m = document.createElement("link");
      m.rel = "apple-touch-icon", m.href = o, document.head.appendChild(m);
    }
  }, s = (o) => {
    const a = document.createElement("canvas");
    a.width = 32, a.height = 32;
    const c = a.getContext("2d");
    c && (c.fillStyle = "#3B82F6", c.fillRect(0, 0, 32, 32), c.fillStyle = "#FFFFFF", c.font = "bold 20px Arial", c.textAlign = "center", c.textBaseline = "middle", c.fillText(o.charAt(0).toUpperCase(), 16, 16), a.toBlob((u) => {
      if (u) {
        const d = URL.createObjectURL(u);
        n(d);
      }
    }));
  };
  return null;
}, zl = (e, t = {}) => {
  const { autoDetect: r = !0 } = t;
  ve(() => {
    if (document.querySelectorAll("link[rel*='icon']").forEach((s) => s.remove()), e)
      ((o) => {
        var d;
        const a = (d = o.split(".").pop()) == null ? void 0 : d.toLowerCase();
        let c = "image/x-icon";
        a === "png" ? c = "image/png" : a === "svg" ? c = "image/svg+xml" : (a === "jpg" || a === "jpeg") && (c = "image/jpeg");
        const u = document.createElement("link");
        u.rel = a === "svg" ? "icon" : "shortcut icon", u.type = c, u.href = o, document.head.appendChild(u);
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
        const c = new Image();
        return c.src = a, new Promise((u, d) => {
          c.onload = () => u(a), c.onerror = d;
        });
      };
      Promise.any(s.map(o)).then((a) => {
        var m;
        const c = (m = a.split(".").pop()) == null ? void 0 : m.toLowerCase();
        let u = "image/x-icon";
        c === "png" ? u = "image/png" : c === "svg" ? u = "image/svg+xml" : (c === "jpg" || c === "jpeg") && (u = "image/jpeg");
        const d = document.createElement("link");
        d.rel = c === "svg" ? "icon" : "shortcut icon", d.type = u, d.href = a, document.head.appendChild(d);
      }).catch(() => {
        console.warn("No favicon found");
      });
    }
  }, [e, r]);
}, Vr = (e, t, r) => {
  if (e && "reportValidity" in e) {
    const n = k(r, t);
    e.setCustomValidity(n && n.message || ""), e.reportValidity();
  }
}, Gt = (e, t) => {
  for (const r in t.fields) {
    const n = t.fields[r];
    n && n.ref && "reportValidity" in n.ref ? Vr(n.ref, r, e) : n && n.refs && n.refs.forEach((s) => Vr(s, r, e));
  }
}, Lr = (e, t) => {
  t.shouldUseNativeValidation && Gt(e, t);
  const r = {};
  for (const n in e) {
    const s = k(t.fields, n), o = Object.assign(e[n] || {}, { ref: s && s.ref });
    if (_o(t.names || Object.keys(e), n)) {
      const a = Object.assign({}, k(r, n));
      q(a, "root", o), q(r, n, a);
    } else q(r, n, o);
  }
  return r;
}, _o = (e, t) => {
  const r = Mr(t);
  return e.some((n) => Mr(n).match(`^${r}\\.\\d+`));
};
function Mr(e) {
  return e.replace(/\]|\[/g, "");
}
function x(e, t, r) {
  function n(c, u) {
    var d;
    Object.defineProperty(c, "_zod", {
      value: c._zod ?? {},
      enumerable: !1
    }), (d = c._zod).traits ?? (d.traits = /* @__PURE__ */ new Set()), c._zod.traits.add(e), t(c, u);
    for (const m in a.prototype)
      m in c || Object.defineProperty(c, m, { value: a.prototype[m].bind(c) });
    c._zod.constr = a, c._zod.def = u;
  }
  const s = (r == null ? void 0 : r.Parent) ?? Object;
  class o extends s {
  }
  Object.defineProperty(o, "name", { value: e });
  function a(c) {
    var u;
    const d = r != null && r.Parent ? new o() : this;
    n(d, c), (u = d._zod).deferred ?? (u.deferred = []);
    for (const m of d._zod.deferred)
      m();
    return d;
  }
  return Object.defineProperty(a, "init", { value: n }), Object.defineProperty(a, Symbol.hasInstance, {
    value: (c) => {
      var u, d;
      return r != null && r.Parent && c instanceof r.Parent ? !0 : (d = (u = c == null ? void 0 : c._zod) == null ? void 0 : u.traits) == null ? void 0 : d.has(e);
    }
  }), Object.defineProperty(a, "name", { value: e }), a;
}
class nt extends Error {
  constructor() {
    super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
  }
}
const On = {};
function Ze(e) {
  return On;
}
function jo(e) {
  const t = Object.values(e).filter((n) => typeof n == "number");
  return Object.entries(e).filter(([n, s]) => t.indexOf(+n) === -1).map(([n, s]) => s);
}
function Kt(e, t) {
  return typeof t == "bigint" ? t.toString() : t;
}
function Pn(e) {
  return {
    get value() {
      {
        const t = e();
        return Object.defineProperty(this, "value", { value: t }), t;
      }
    }
  };
}
function gr(e) {
  return e == null;
}
function xr(e) {
  const t = e.startsWith("^") ? 1 : 0, r = e.endsWith("$") ? e.length - 1 : e.length;
  return e.slice(t, r);
}
const Ur = Symbol("evaluating");
function L(e, t, r) {
  let n;
  Object.defineProperty(e, t, {
    get() {
      if (n !== Ur)
        return n === void 0 && (n = Ur, n = r()), n;
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
function No(e) {
  return Object.create(Object.getPrototypeOf(e), Object.getOwnPropertyDescriptors(e));
}
function Ie(e, t, r) {
  Object.defineProperty(e, t, {
    value: r,
    writable: !0,
    enumerable: !0,
    configurable: !0
  });
}
function Me(...e) {
  const t = {};
  for (const r of e) {
    const n = Object.getOwnPropertyDescriptors(r);
    Object.assign(t, n);
  }
  return Object.defineProperties({}, t);
}
function Wr(e) {
  return JSON.stringify(e);
}
const In = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {
};
function Xt(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
const ko = Pn(() => {
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
function St(e) {
  if (Xt(e) === !1)
    return !1;
  const t = e.constructor;
  if (t === void 0)
    return !0;
  const r = t.prototype;
  return !(Xt(r) === !1 || Object.prototype.hasOwnProperty.call(r, "isPrototypeOf") === !1);
}
function qn(e) {
  return St(e) ? { ...e } : e;
}
const Co = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
function Ot(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function qe(e, t, r) {
  const n = new e._zod.constr(t ?? e._zod.def);
  return (!t || r != null && r.parent) && (n._zod.parent = e), n;
}
function E(e) {
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
function $o(e) {
  return Object.keys(e).filter((t) => e[t]._zod.optin === "optional" && e[t]._zod.optout === "optional");
}
function zo(e, t) {
  const r = e._zod.def, n = Me(e._zod.def, {
    get shape() {
      const s = {};
      for (const o in t) {
        if (!(o in r.shape))
          throw new Error(`Unrecognized key: "${o}"`);
        t[o] && (s[o] = r.shape[o]);
      }
      return Ie(this, "shape", s), s;
    },
    checks: []
  });
  return qe(e, n);
}
function Fo(e, t) {
  const r = e._zod.def, n = Me(e._zod.def, {
    get shape() {
      const s = { ...e._zod.def.shape };
      for (const o in t) {
        if (!(o in r.shape))
          throw new Error(`Unrecognized key: "${o}"`);
        t[o] && delete s[o];
      }
      return Ie(this, "shape", s), s;
    },
    checks: []
  });
  return qe(e, n);
}
function Eo(e, t) {
  if (!St(t))
    throw new Error("Invalid input to extend: expected a plain object");
  const r = Me(e._zod.def, {
    get shape() {
      const n = { ...e._zod.def.shape, ...t };
      return Ie(this, "shape", n), n;
    },
    checks: []
  });
  return qe(e, r);
}
function Ao(e, t) {
  const r = Me(e._zod.def, {
    get shape() {
      const n = { ...e._zod.def.shape, ...t._zod.def.shape };
      return Ie(this, "shape", n), n;
    },
    get catchall() {
      return t._zod.def.catchall;
    },
    checks: []
    // delete existing checks
  });
  return qe(e, r);
}
function To(e, t, r) {
  const n = Me(t._zod.def, {
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
      return Ie(this, "shape", o), o;
    },
    checks: []
  });
  return qe(t, n);
}
function So(e, t, r) {
  const n = Me(t._zod.def, {
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
      return Ie(this, "shape", o), o;
    },
    checks: []
  });
  return qe(t, n);
}
function rt(e, t = 0) {
  var r;
  for (let n = t; n < e.issues.length; n++)
    if (((r = e.issues[n]) == null ? void 0 : r.continue) !== !0)
      return !0;
  return !1;
}
function Bn(e, t) {
  return t.map((r) => {
    var n;
    return (n = r).path ?? (n.path = []), r.path.unshift(e), r;
  });
}
function lt(e) {
  return typeof e == "string" ? e : e == null ? void 0 : e.message;
}
function De(e, t, r) {
  var s, o, a, c, u, d;
  const n = { ...e, path: e.path ?? [] };
  if (!e.message) {
    const m = lt((a = (o = (s = e.inst) == null ? void 0 : s._zod.def) == null ? void 0 : o.error) == null ? void 0 : a.call(o, e)) ?? lt((c = t == null ? void 0 : t.error) == null ? void 0 : c.call(t, e)) ?? lt((u = r.customError) == null ? void 0 : u.call(r, e)) ?? lt((d = r.localeError) == null ? void 0 : d.call(r, e)) ?? "Invalid input";
    n.message = m;
  }
  return delete n.inst, delete n.continue, t != null && t.reportInput || delete n.input, n;
}
function yr(e) {
  return Array.isArray(e) ? "array" : typeof e == "string" ? "string" : "unknown";
}
function st(...e) {
  const [t, r, n] = e;
  return typeof t == "string" ? {
    message: t,
    code: "custom",
    input: r,
    inst: n
  } : { ...t };
}
const Vn = (e, t) => {
  e.name = "$ZodError", Object.defineProperty(e, "_zod", {
    value: e._zod,
    enumerable: !1
  }), Object.defineProperty(e, "issues", {
    value: t,
    enumerable: !1
  }), e.message = JSON.stringify(t, Kt, 2), Object.defineProperty(e, "toString", {
    value: () => e.message,
    enumerable: !1
  });
}, vr = x("$ZodError", Vn), Pt = x("$ZodError", Vn, { Parent: Error });
function Ro(e, t = (r) => r.message) {
  const r = {}, n = [];
  for (const s of e.issues)
    s.path.length > 0 ? (r[s.path[0]] = r[s.path[0]] || [], r[s.path[0]].push(t(s))) : n.push(t(s));
  return { formErrors: n, fieldErrors: r };
}
function Zo(e, t) {
  const r = t || function(o) {
    return o.message;
  }, n = { _errors: [] }, s = (o) => {
    for (const a of o.issues)
      if (a.code === "invalid_union" && a.errors.length)
        a.errors.map((c) => s({ issues: c }));
      else if (a.code === "invalid_key")
        s({ issues: a.issues });
      else if (a.code === "invalid_element")
        s({ issues: a.issues });
      else if (a.path.length === 0)
        n._errors.push(r(a));
      else {
        let c = n, u = 0;
        for (; u < a.path.length; ) {
          const d = a.path[u];
          u === a.path.length - 1 ? (c[d] = c[d] || { _errors: [] }, c[d]._errors.push(r(a))) : c[d] = c[d] || { _errors: [] }, c = c[d], u++;
        }
      }
  };
  return s(e), n;
}
const Ln = (e) => (t, r, n, s) => {
  const o = n ? Object.assign(n, { async: !1 }) : { async: !1 }, a = t._zod.run({ value: r, issues: [] }, o);
  if (a instanceof Promise)
    throw new nt();
  if (a.issues.length) {
    const c = new ((s == null ? void 0 : s.Err) ?? e)(a.issues.map((u) => De(u, o, Ze())));
    throw In(c, s == null ? void 0 : s.callee), c;
  }
  return a.value;
}, Do = /* @__PURE__ */ Ln(Pt), Mn = (e) => async (t, r, n, s) => {
  const o = n ? Object.assign(n, { async: !0 }) : { async: !0 };
  let a = t._zod.run({ value: r, issues: [] }, o);
  if (a instanceof Promise && (a = await a), a.issues.length) {
    const c = new ((s == null ? void 0 : s.Err) ?? e)(a.issues.map((u) => De(u, o, Ze())));
    throw In(c, s == null ? void 0 : s.callee), c;
  }
  return a.value;
}, Oo = /* @__PURE__ */ Mn(Pt), Un = (e) => (t, r, n) => {
  const s = n ? { ...n, async: !1 } : { async: !1 }, o = t._zod.run({ value: r, issues: [] }, s);
  if (o instanceof Promise)
    throw new nt();
  return o.issues.length ? {
    success: !1,
    error: new (e ?? vr)(o.issues.map((a) => De(a, s, Ze())))
  } : { success: !0, data: o.value };
}, Po = /* @__PURE__ */ Un(Pt), Wn = (e) => async (t, r, n) => {
  const s = n ? Object.assign(n, { async: !0 }) : { async: !0 };
  let o = t._zod.run({ value: r, issues: [] }, s);
  return o instanceof Promise && (o = await o), o.issues.length ? {
    success: !1,
    error: new e(o.issues.map((a) => De(a, s, Ze())))
  } : { success: !0, data: o.value };
}, Io = /* @__PURE__ */ Wn(Pt), qo = /^[cC][^\s-]{8,}$/, Bo = /^[0-9a-z]+$/, Vo = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/, Lo = /^[0-9a-vA-V]{20}$/, Mo = /^[A-Za-z0-9]{27}$/, Uo = /^[a-zA-Z0-9_-]{21}$/, Wo = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, Jo = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, Jr = (e) => e ? new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$/, Yo = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, Ho = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
function Go() {
  return new RegExp(Ho, "u");
}
const Ko = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Xo = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})$/, Qo = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, ea = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, ta = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, Jn = /^[A-Za-z0-9_-]*$/, ra = /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/, na = /^\+(?:[0-9]){6,14}[0-9]$/, Yn = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))", sa = /* @__PURE__ */ new RegExp(`^${Yn}$`);
function Hn(e) {
  const t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
  return typeof e.precision == "number" ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function oa(e) {
  return new RegExp(`^${Hn(e)}$`);
}
function aa(e) {
  const t = Hn({ precision: e.precision }), r = ["Z"];
  e.local && r.push(""), e.offset && r.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
  const n = `${t}(?:${r.join("|")})`;
  return new RegExp(`^${Yn}T(?:${n})$`);
}
const ia = (e) => {
  const t = e ? `[\\s\\S]{${(e == null ? void 0 : e.minimum) ?? 0},${(e == null ? void 0 : e.maximum) ?? ""}}` : "[\\s\\S]*";
  return new RegExp(`^${t}$`);
}, ca = /true|false/i, la = /^[^A-Z]*$/, ua = /^[^a-z]*$/, Ne = /* @__PURE__ */ x("$ZodCheck", (e, t) => {
  var r;
  e._zod ?? (e._zod = {}), e._zod.def = t, (r = e._zod).onattach ?? (r.onattach = []);
}), da = /* @__PURE__ */ x("$ZodCheckMaxLength", (e, t) => {
  var r;
  Ne.init(e, t), (r = e._zod.def).when ?? (r.when = (n) => {
    const s = n.value;
    return !gr(s) && s.length !== void 0;
  }), e._zod.onattach.push((n) => {
    const s = n._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    t.maximum < s && (n._zod.bag.maximum = t.maximum);
  }), e._zod.check = (n) => {
    const s = n.value;
    if (s.length <= t.maximum)
      return;
    const a = yr(s);
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
}), fa = /* @__PURE__ */ x("$ZodCheckMinLength", (e, t) => {
  var r;
  Ne.init(e, t), (r = e._zod.def).when ?? (r.when = (n) => {
    const s = n.value;
    return !gr(s) && s.length !== void 0;
  }), e._zod.onattach.push((n) => {
    const s = n._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    t.minimum > s && (n._zod.bag.minimum = t.minimum);
  }), e._zod.check = (n) => {
    const s = n.value;
    if (s.length >= t.minimum)
      return;
    const a = yr(s);
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
}), ma = /* @__PURE__ */ x("$ZodCheckLengthEquals", (e, t) => {
  var r;
  Ne.init(e, t), (r = e._zod.def).when ?? (r.when = (n) => {
    const s = n.value;
    return !gr(s) && s.length !== void 0;
  }), e._zod.onattach.push((n) => {
    const s = n._zod.bag;
    s.minimum = t.length, s.maximum = t.length, s.length = t.length;
  }), e._zod.check = (n) => {
    const s = n.value, o = s.length;
    if (o === t.length)
      return;
    const a = yr(s), c = o > t.length;
    n.issues.push({
      origin: a,
      ...c ? { code: "too_big", maximum: t.length } : { code: "too_small", minimum: t.length },
      inclusive: !0,
      exact: !0,
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), It = /* @__PURE__ */ x("$ZodCheckStringFormat", (e, t) => {
  var r, n;
  Ne.init(e, t), e._zod.onattach.push((s) => {
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
}), ha = /* @__PURE__ */ x("$ZodCheckRegex", (e, t) => {
  It.init(e, t), e._zod.check = (r) => {
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
}), pa = /* @__PURE__ */ x("$ZodCheckLowerCase", (e, t) => {
  t.pattern ?? (t.pattern = la), It.init(e, t);
}), ga = /* @__PURE__ */ x("$ZodCheckUpperCase", (e, t) => {
  t.pattern ?? (t.pattern = ua), It.init(e, t);
}), xa = /* @__PURE__ */ x("$ZodCheckIncludes", (e, t) => {
  Ne.init(e, t);
  const r = Ot(t.includes), n = new RegExp(typeof t.position == "number" ? `^.{${t.position}}${r}` : r);
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
}), ya = /* @__PURE__ */ x("$ZodCheckStartsWith", (e, t) => {
  Ne.init(e, t);
  const r = new RegExp(`^${Ot(t.prefix)}.*`);
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
}), va = /* @__PURE__ */ x("$ZodCheckEndsWith", (e, t) => {
  Ne.init(e, t);
  const r = new RegExp(`.*${Ot(t.suffix)}$`);
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
}), ba = /* @__PURE__ */ x("$ZodCheckOverwrite", (e, t) => {
  Ne.init(e, t), e._zod.check = (r) => {
    r.value = t.tx(r.value);
  };
});
class wa {
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
const _a = {
  major: 4,
  minor: 0,
  patch: 17
}, Q = /* @__PURE__ */ x("$ZodType", (e, t) => {
  var s;
  var r;
  e ?? (e = {}), e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = _a;
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
    const o = (a, c, u) => {
      let d = rt(a), m;
      for (const h of c) {
        if (h._zod.def.when) {
          if (!h._zod.def.when(a))
            continue;
        } else if (d)
          continue;
        const p = a.issues.length, _ = h._zod.check(a);
        if (_ instanceof Promise && (u == null ? void 0 : u.async) === !1)
          throw new nt();
        if (m || _ instanceof Promise)
          m = (m ?? Promise.resolve()).then(async () => {
            await _, a.issues.length !== p && (d || (d = rt(a, p)));
          });
        else {
          if (a.issues.length === p)
            continue;
          d || (d = rt(a, p));
        }
      }
      return m ? m.then(() => a) : a;
    };
    e._zod.run = (a, c) => {
      const u = e._zod.parse(a, c);
      if (u instanceof Promise) {
        if (c.async === !1)
          throw new nt();
        return u.then((d) => o(d, n, c));
      }
      return o(u, n, c);
    };
  }
  e["~standard"] = {
    validate: (o) => {
      var a;
      try {
        const c = Po(e, o);
        return c.success ? { value: c.data } : { issues: (a = c.error) == null ? void 0 : a.issues };
      } catch {
        return Io(e, o).then((u) => {
          var d;
          return u.success ? { value: u.data } : { issues: (d = u.error) == null ? void 0 : d.issues };
        });
      }
    },
    vendor: "zod",
    version: 1
  };
}), br = /* @__PURE__ */ x("$ZodString", (e, t) => {
  var r;
  Q.init(e, t), e._zod.pattern = [...((r = e == null ? void 0 : e._zod.bag) == null ? void 0 : r.patterns) ?? []].pop() ?? ia(e._zod.bag), e._zod.parse = (n, s) => {
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
}), W = /* @__PURE__ */ x("$ZodStringFormat", (e, t) => {
  It.init(e, t), br.init(e, t);
}), ja = /* @__PURE__ */ x("$ZodGUID", (e, t) => {
  t.pattern ?? (t.pattern = Jo), W.init(e, t);
}), Na = /* @__PURE__ */ x("$ZodUUID", (e, t) => {
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
    t.pattern ?? (t.pattern = Jr(n));
  } else
    t.pattern ?? (t.pattern = Jr());
  W.init(e, t);
}), ka = /* @__PURE__ */ x("$ZodEmail", (e, t) => {
  t.pattern ?? (t.pattern = Yo), W.init(e, t);
}), Ca = /* @__PURE__ */ x("$ZodURL", (e, t) => {
  W.init(e, t), e._zod.check = (r) => {
    try {
      const n = r.value.trim(), s = new URL(n);
      t.hostname && (t.hostname.lastIndex = 0, t.hostname.test(s.hostname) || r.issues.push({
        code: "invalid_format",
        format: "url",
        note: "Invalid hostname",
        pattern: ra.source,
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
}), $a = /* @__PURE__ */ x("$ZodEmoji", (e, t) => {
  t.pattern ?? (t.pattern = Go()), W.init(e, t);
}), za = /* @__PURE__ */ x("$ZodNanoID", (e, t) => {
  t.pattern ?? (t.pattern = Uo), W.init(e, t);
}), Fa = /* @__PURE__ */ x("$ZodCUID", (e, t) => {
  t.pattern ?? (t.pattern = qo), W.init(e, t);
}), Ea = /* @__PURE__ */ x("$ZodCUID2", (e, t) => {
  t.pattern ?? (t.pattern = Bo), W.init(e, t);
}), Aa = /* @__PURE__ */ x("$ZodULID", (e, t) => {
  t.pattern ?? (t.pattern = Vo), W.init(e, t);
}), Ta = /* @__PURE__ */ x("$ZodXID", (e, t) => {
  t.pattern ?? (t.pattern = Lo), W.init(e, t);
}), Sa = /* @__PURE__ */ x("$ZodKSUID", (e, t) => {
  t.pattern ?? (t.pattern = Mo), W.init(e, t);
}), Ra = /* @__PURE__ */ x("$ZodISODateTime", (e, t) => {
  t.pattern ?? (t.pattern = aa(t)), W.init(e, t);
}), Za = /* @__PURE__ */ x("$ZodISODate", (e, t) => {
  t.pattern ?? (t.pattern = sa), W.init(e, t);
}), Da = /* @__PURE__ */ x("$ZodISOTime", (e, t) => {
  t.pattern ?? (t.pattern = oa(t)), W.init(e, t);
}), Oa = /* @__PURE__ */ x("$ZodISODuration", (e, t) => {
  t.pattern ?? (t.pattern = Wo), W.init(e, t);
}), Pa = /* @__PURE__ */ x("$ZodIPv4", (e, t) => {
  t.pattern ?? (t.pattern = Ko), W.init(e, t), e._zod.onattach.push((r) => {
    const n = r._zod.bag;
    n.format = "ipv4";
  });
}), Ia = /* @__PURE__ */ x("$ZodIPv6", (e, t) => {
  t.pattern ?? (t.pattern = Xo), W.init(e, t), e._zod.onattach.push((r) => {
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
}), qa = /* @__PURE__ */ x("$ZodCIDRv4", (e, t) => {
  t.pattern ?? (t.pattern = Qo), W.init(e, t);
}), Ba = /* @__PURE__ */ x("$ZodCIDRv6", (e, t) => {
  t.pattern ?? (t.pattern = ea), W.init(e, t), e._zod.check = (r) => {
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
function Gn(e) {
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
const Va = /* @__PURE__ */ x("$ZodBase64", (e, t) => {
  t.pattern ?? (t.pattern = ta), W.init(e, t), e._zod.onattach.push((r) => {
    r._zod.bag.contentEncoding = "base64";
  }), e._zod.check = (r) => {
    Gn(r.value) || r.issues.push({
      code: "invalid_format",
      format: "base64",
      input: r.value,
      inst: e,
      continue: !t.abort
    });
  };
});
function La(e) {
  if (!Jn.test(e))
    return !1;
  const t = e.replace(/[-_]/g, (n) => n === "-" ? "+" : "/"), r = t.padEnd(Math.ceil(t.length / 4) * 4, "=");
  return Gn(r);
}
const Ma = /* @__PURE__ */ x("$ZodBase64URL", (e, t) => {
  t.pattern ?? (t.pattern = Jn), W.init(e, t), e._zod.onattach.push((r) => {
    r._zod.bag.contentEncoding = "base64url";
  }), e._zod.check = (r) => {
    La(r.value) || r.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: r.value,
      inst: e,
      continue: !t.abort
    });
  };
}), Ua = /* @__PURE__ */ x("$ZodE164", (e, t) => {
  t.pattern ?? (t.pattern = na), W.init(e, t);
});
function Wa(e, t = null) {
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
const Ja = /* @__PURE__ */ x("$ZodJWT", (e, t) => {
  W.init(e, t), e._zod.check = (r) => {
    Wa(r.value, t.alg) || r.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: r.value,
      inst: e,
      continue: !t.abort
    });
  };
}), Ya = /* @__PURE__ */ x("$ZodBoolean", (e, t) => {
  Q.init(e, t), e._zod.pattern = ca, e._zod.parse = (r, n) => {
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
}), Ha = /* @__PURE__ */ x("$ZodUnknown", (e, t) => {
  Q.init(e, t), e._zod.parse = (r) => r;
}), Ga = /* @__PURE__ */ x("$ZodNever", (e, t) => {
  Q.init(e, t), e._zod.parse = (r, n) => (r.issues.push({
    expected: "never",
    code: "invalid_type",
    input: r.value,
    inst: e
  }), r);
});
function Yr(e, t, r) {
  e.issues.length && t.issues.push(...Bn(r, e.issues)), t.value[r] = e.value;
}
const Ka = /* @__PURE__ */ x("$ZodArray", (e, t) => {
  Q.init(e, t), e._zod.parse = (r, n) => {
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
      const c = s[a], u = t.element._zod.run({
        value: c,
        issues: []
      }, n);
      u instanceof Promise ? o.push(u.then((d) => Yr(d, r, a))) : Yr(u, r, a);
    }
    return o.length ? Promise.all(o).then(() => r) : r;
  };
});
function ut(e, t, r, n) {
  e.issues.length && t.issues.push(...Bn(r, e.issues)), e.value === void 0 ? r in n && (t.value[r] = void 0) : t.value[r] = e.value;
}
const Xa = /* @__PURE__ */ x("$ZodObject", (e, t) => {
  Q.init(e, t);
  const r = Pn(() => {
    const h = Object.keys(t.shape);
    for (const _ of h)
      if (!t.shape[_]._zod.traits.has("$ZodType"))
        throw new Error(`Invalid element at key "${_}": expected a Zod schema`);
    const p = $o(t.shape);
    return {
      shape: t.shape,
      keys: h,
      keySet: new Set(h),
      numKeys: h.length,
      optionalKeys: new Set(p)
    };
  });
  L(e._zod, "propValues", () => {
    const h = t.shape, p = {};
    for (const _ in h) {
      const z = h[_]._zod;
      if (z.values) {
        p[_] ?? (p[_] = /* @__PURE__ */ new Set());
        for (const y of z.values)
          p[_].add(y);
      }
    }
    return p;
  });
  const n = (h) => {
    const p = new wa(["shape", "payload", "ctx"]), _ = r.value, z = (C) => {
      const A = Wr(C);
      return `shape[${A}]._zod.run({ value: input[${A}], issues: [] }, ctx)`;
    };
    p.write("const input = payload.value;");
    const y = /* @__PURE__ */ Object.create(null);
    let $ = 0;
    for (const C of _.keys)
      y[C] = `key_${$++}`;
    p.write("const newResult = {}");
    for (const C of _.keys) {
      const A = y[C], S = Wr(C);
      p.write(`const ${A} = ${z(C)};`), p.write(`
        if (${A}.issues.length) {
          payload.issues = payload.issues.concat(${A}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${S}, ...iss.path] : [${S}]
          })));
        }
        
        if (${A}.value === undefined) {
          if (${S} in input) {
            newResult[${S}] = undefined;
          }
        } else {
          newResult[${S}] = ${A}.value;
        }
      `);
    }
    p.write("payload.value = newResult;"), p.write("return payload;");
    const T = p.compile();
    return (C, A) => T(h, C, A);
  };
  let s;
  const o = Xt, a = !On.jitless, u = a && ko.value, d = t.catchall;
  let m;
  e._zod.parse = (h, p) => {
    m ?? (m = r.value);
    const _ = h.value;
    if (!o(_))
      return h.issues.push({
        expected: "object",
        code: "invalid_type",
        input: _,
        inst: e
      }), h;
    const z = [];
    if (a && u && (p == null ? void 0 : p.async) === !1 && p.jitless !== !0)
      s || (s = n(t.shape)), h = s(h, p);
    else {
      h.value = {};
      const A = m.shape;
      for (const S of m.keys) {
        const oe = A[S]._zod.run({ value: _[S], issues: [] }, p);
        oe instanceof Promise ? z.push(oe.then((ce) => ut(ce, h, S, _))) : ut(oe, h, S, _);
      }
    }
    if (!d)
      return z.length ? Promise.all(z).then(() => h) : h;
    const y = [], $ = m.keySet, T = d._zod, C = T.def.type;
    for (const A of Object.keys(_)) {
      if ($.has(A))
        continue;
      if (C === "never") {
        y.push(A);
        continue;
      }
      const S = T.run({ value: _[A], issues: [] }, p);
      S instanceof Promise ? z.push(S.then((P) => ut(P, h, A, _))) : ut(S, h, A, _);
    }
    return y.length && h.issues.push({
      code: "unrecognized_keys",
      keys: y,
      input: _,
      inst: e
    }), z.length ? Promise.all(z).then(() => h) : h;
  };
});
function Hr(e, t, r, n) {
  for (const o of e)
    if (o.issues.length === 0)
      return t.value = o.value, t;
  const s = e.filter((o) => !rt(o));
  return s.length === 1 ? (t.value = s[0].value, s[0]) : (t.issues.push({
    code: "invalid_union",
    input: t.value,
    inst: r,
    errors: e.map((o) => o.issues.map((a) => De(a, n, Ze())))
  }), t);
}
const Qa = /* @__PURE__ */ x("$ZodUnion", (e, t) => {
  Q.init(e, t), L(e._zod, "optin", () => t.options.some((s) => s._zod.optin === "optional") ? "optional" : void 0), L(e._zod, "optout", () => t.options.some((s) => s._zod.optout === "optional") ? "optional" : void 0), L(e._zod, "values", () => {
    if (t.options.every((s) => s._zod.values))
      return new Set(t.options.flatMap((s) => Array.from(s._zod.values)));
  }), L(e._zod, "pattern", () => {
    if (t.options.every((s) => s._zod.pattern)) {
      const s = t.options.map((o) => o._zod.pattern);
      return new RegExp(`^(${s.map((o) => xr(o.source)).join("|")})$`);
    }
  });
  const r = t.options.length === 1, n = t.options[0]._zod.run;
  e._zod.parse = (s, o) => {
    if (r)
      return n(s, o);
    let a = !1;
    const c = [];
    for (const u of t.options) {
      const d = u._zod.run({
        value: s.value,
        issues: []
      }, o);
      if (d instanceof Promise)
        c.push(d), a = !0;
      else {
        if (d.issues.length === 0)
          return d;
        c.push(d);
      }
    }
    return a ? Promise.all(c).then((u) => Hr(u, s, e, o)) : Hr(c, s, e, o);
  };
}), ei = /* @__PURE__ */ x("$ZodIntersection", (e, t) => {
  Q.init(e, t), e._zod.parse = (r, n) => {
    const s = r.value, o = t.left._zod.run({ value: s, issues: [] }, n), a = t.right._zod.run({ value: s, issues: [] }, n);
    return o instanceof Promise || a instanceof Promise ? Promise.all([o, a]).then(([u, d]) => Gr(r, u, d)) : Gr(r, o, a);
  };
});
function Qt(e, t) {
  if (e === t)
    return { valid: !0, data: e };
  if (e instanceof Date && t instanceof Date && +e == +t)
    return { valid: !0, data: e };
  if (St(e) && St(t)) {
    const r = Object.keys(t), n = Object.keys(e).filter((o) => r.indexOf(o) !== -1), s = { ...e, ...t };
    for (const o of n) {
      const a = Qt(e[o], t[o]);
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
      const s = e[n], o = t[n], a = Qt(s, o);
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
function Gr(e, t, r) {
  if (t.issues.length && e.issues.push(...t.issues), r.issues.length && e.issues.push(...r.issues), rt(e))
    return e;
  const n = Qt(t.value, r.value);
  if (!n.valid)
    throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(n.mergeErrorPath)}`);
  return e.value = n.data, e;
}
const ti = /* @__PURE__ */ x("$ZodEnum", (e, t) => {
  Q.init(e, t);
  const r = jo(t.entries), n = new Set(r);
  e._zod.values = n, e._zod.pattern = new RegExp(`^(${r.filter((s) => Co.has(typeof s)).map((s) => typeof s == "string" ? Ot(s) : s.toString()).join("|")})$`), e._zod.parse = (s, o) => {
    const a = s.value;
    return n.has(a) || s.issues.push({
      code: "invalid_value",
      values: r,
      input: a,
      inst: e
    }), s;
  };
}), ri = /* @__PURE__ */ x("$ZodTransform", (e, t) => {
  Q.init(e, t), e._zod.parse = (r, n) => {
    const s = t.transform(r.value, r);
    if (n.async)
      return (s instanceof Promise ? s : Promise.resolve(s)).then((a) => (r.value = a, r));
    if (s instanceof Promise)
      throw new nt();
    return r.value = s, r;
  };
});
function Kr(e, t) {
  return e.issues.length && t === void 0 ? { issues: [], value: void 0 } : e;
}
const ni = /* @__PURE__ */ x("$ZodOptional", (e, t) => {
  Q.init(e, t), e._zod.optin = "optional", e._zod.optout = "optional", L(e._zod, "values", () => t.innerType._zod.values ? /* @__PURE__ */ new Set([...t.innerType._zod.values, void 0]) : void 0), L(e._zod, "pattern", () => {
    const r = t.innerType._zod.pattern;
    return r ? new RegExp(`^(${xr(r.source)})?$`) : void 0;
  }), e._zod.parse = (r, n) => {
    if (t.innerType._zod.optin === "optional") {
      const s = t.innerType._zod.run(r, n);
      return s instanceof Promise ? s.then((o) => Kr(o, r.value)) : Kr(s, r.value);
    }
    return r.value === void 0 ? r : t.innerType._zod.run(r, n);
  };
}), si = /* @__PURE__ */ x("$ZodNullable", (e, t) => {
  Q.init(e, t), L(e._zod, "optin", () => t.innerType._zod.optin), L(e._zod, "optout", () => t.innerType._zod.optout), L(e._zod, "pattern", () => {
    const r = t.innerType._zod.pattern;
    return r ? new RegExp(`^(${xr(r.source)}|null)$`) : void 0;
  }), L(e._zod, "values", () => t.innerType._zod.values ? /* @__PURE__ */ new Set([...t.innerType._zod.values, null]) : void 0), e._zod.parse = (r, n) => r.value === null ? r : t.innerType._zod.run(r, n);
}), oi = /* @__PURE__ */ x("$ZodDefault", (e, t) => {
  Q.init(e, t), e._zod.optin = "optional", L(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (r, n) => {
    if (r.value === void 0)
      return r.value = t.defaultValue, r;
    const s = t.innerType._zod.run(r, n);
    return s instanceof Promise ? s.then((o) => Xr(o, t)) : Xr(s, t);
  };
});
function Xr(e, t) {
  return e.value === void 0 && (e.value = t.defaultValue), e;
}
const ai = /* @__PURE__ */ x("$ZodPrefault", (e, t) => {
  Q.init(e, t), e._zod.optin = "optional", L(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (r, n) => (r.value === void 0 && (r.value = t.defaultValue), t.innerType._zod.run(r, n));
}), ii = /* @__PURE__ */ x("$ZodNonOptional", (e, t) => {
  Q.init(e, t), L(e._zod, "values", () => {
    const r = t.innerType._zod.values;
    return r ? new Set([...r].filter((n) => n !== void 0)) : void 0;
  }), e._zod.parse = (r, n) => {
    const s = t.innerType._zod.run(r, n);
    return s instanceof Promise ? s.then((o) => Qr(o, e)) : Qr(s, e);
  };
});
function Qr(e, t) {
  return !e.issues.length && e.value === void 0 && e.issues.push({
    code: "invalid_type",
    expected: "nonoptional",
    input: e.value,
    inst: t
  }), e;
}
const ci = /* @__PURE__ */ x("$ZodCatch", (e, t) => {
  Q.init(e, t), L(e._zod, "optin", () => t.innerType._zod.optin), L(e._zod, "optout", () => t.innerType._zod.optout), L(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (r, n) => {
    const s = t.innerType._zod.run(r, n);
    return s instanceof Promise ? s.then((o) => (r.value = o.value, o.issues.length && (r.value = t.catchValue({
      ...r,
      error: {
        issues: o.issues.map((a) => De(a, n, Ze()))
      },
      input: r.value
    }), r.issues = []), r)) : (r.value = s.value, s.issues.length && (r.value = t.catchValue({
      ...r,
      error: {
        issues: s.issues.map((o) => De(o, n, Ze()))
      },
      input: r.value
    }), r.issues = []), r);
  };
}), li = /* @__PURE__ */ x("$ZodPipe", (e, t) => {
  Q.init(e, t), L(e._zod, "values", () => t.in._zod.values), L(e._zod, "optin", () => t.in._zod.optin), L(e._zod, "optout", () => t.out._zod.optout), L(e._zod, "propValues", () => t.in._zod.propValues), e._zod.parse = (r, n) => {
    const s = t.in._zod.run(r, n);
    return s instanceof Promise ? s.then((o) => en(o, t, n)) : en(s, t, n);
  };
});
function en(e, t, r) {
  return e.issues.length ? e : t.out._zod.run({ value: e.value, issues: e.issues }, r);
}
const ui = /* @__PURE__ */ x("$ZodReadonly", (e, t) => {
  Q.init(e, t), L(e._zod, "propValues", () => t.innerType._zod.propValues), L(e._zod, "values", () => t.innerType._zod.values), L(e._zod, "optin", () => t.innerType._zod.optin), L(e._zod, "optout", () => t.innerType._zod.optout), e._zod.parse = (r, n) => {
    const s = t.innerType._zod.run(r, n);
    return s instanceof Promise ? s.then(tn) : tn(s);
  };
});
function tn(e) {
  return e.value = Object.freeze(e.value), e;
}
const di = /* @__PURE__ */ x("$ZodCustom", (e, t) => {
  Ne.init(e, t), Q.init(e, t), e._zod.parse = (r, n) => r, e._zod.check = (r) => {
    const n = r.value, s = t.fn(n);
    if (s instanceof Promise)
      return s.then((o) => rn(o, r, n, e));
    rn(s, r, n, e);
  };
});
function rn(e, t, r, n) {
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
    n._zod.def.params && (s.params = n._zod.def.params), t.issues.push(st(s));
  }
}
class fi {
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
function mi() {
  return new fi();
}
const dt = /* @__PURE__ */ mi();
function hi(e, t) {
  return new e({
    type: "string",
    ...E(t)
  });
}
function pi(e, t) {
  return new e({
    type: "string",
    format: "email",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
function nn(e, t) {
  return new e({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
function gi(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
function xi(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v4",
    ...E(t)
  });
}
function yi(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v6",
    ...E(t)
  });
}
function vi(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v7",
    ...E(t)
  });
}
function bi(e, t) {
  return new e({
    type: "string",
    format: "url",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
function wi(e, t) {
  return new e({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
function _i(e, t) {
  return new e({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
function ji(e, t) {
  return new e({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
function Ni(e, t) {
  return new e({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
function ki(e, t) {
  return new e({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
function Ci(e, t) {
  return new e({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
function $i(e, t) {
  return new e({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
function zi(e, t) {
  return new e({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
function Fi(e, t) {
  return new e({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
function Ei(e, t) {
  return new e({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
function Ai(e, t) {
  return new e({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
function Ti(e, t) {
  return new e({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
function Si(e, t) {
  return new e({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
function Ri(e, t) {
  return new e({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
function Zi(e, t) {
  return new e({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: !1,
    ...E(t)
  });
}
function Di(e, t) {
  return new e({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: !1,
    local: !1,
    precision: null,
    ...E(t)
  });
}
function Oi(e, t) {
  return new e({
    type: "string",
    format: "date",
    check: "string_format",
    ...E(t)
  });
}
function Pi(e, t) {
  return new e({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...E(t)
  });
}
function Ii(e, t) {
  return new e({
    type: "string",
    format: "duration",
    check: "string_format",
    ...E(t)
  });
}
function qi(e, t) {
  return new e({
    type: "boolean",
    ...E(t)
  });
}
function Bi(e) {
  return new e({
    type: "unknown"
  });
}
function Vi(e, t) {
  return new e({
    type: "never",
    ...E(t)
  });
}
function Kn(e, t) {
  return new da({
    check: "max_length",
    ...E(t),
    maximum: e
  });
}
function Rt(e, t) {
  return new fa({
    check: "min_length",
    ...E(t),
    minimum: e
  });
}
function Xn(e, t) {
  return new ma({
    check: "length_equals",
    ...E(t),
    length: e
  });
}
function Li(e, t) {
  return new ha({
    check: "string_format",
    format: "regex",
    ...E(t),
    pattern: e
  });
}
function Mi(e) {
  return new pa({
    check: "string_format",
    format: "lowercase",
    ...E(e)
  });
}
function Ui(e) {
  return new ga({
    check: "string_format",
    format: "uppercase",
    ...E(e)
  });
}
function Wi(e, t) {
  return new xa({
    check: "string_format",
    format: "includes",
    ...E(t),
    includes: e
  });
}
function Ji(e, t) {
  return new ya({
    check: "string_format",
    format: "starts_with",
    ...E(t),
    prefix: e
  });
}
function Yi(e, t) {
  return new va({
    check: "string_format",
    format: "ends_with",
    ...E(t),
    suffix: e
  });
}
function at(e) {
  return new ba({
    check: "overwrite",
    tx: e
  });
}
function Hi(e) {
  return at((t) => t.normalize(e));
}
function Gi() {
  return at((e) => e.trim());
}
function Ki() {
  return at((e) => e.toLowerCase());
}
function Xi() {
  return at((e) => e.toUpperCase());
}
function Qi(e, t, r) {
  return new e({
    type: "array",
    element: t,
    // get element() {
    //   return element;
    // },
    ...E(r)
  });
}
function ec(e, t, r) {
  return new e({
    type: "custom",
    check: "custom",
    fn: t,
    ...E(r)
  });
}
function tc(e) {
  const t = rc((r) => (r.addIssue = (n) => {
    if (typeof n == "string")
      r.issues.push(st(n, r.value, t._zod.def));
    else {
      const s = n;
      s.fatal && (s.continue = !1), s.code ?? (s.code = "custom"), s.input ?? (s.input = r.value), s.inst ?? (s.inst = t), s.continue ?? (s.continue = !t._zod.def.abort), r.issues.push(st(s));
    }
  }, e(r.value, r)));
  return t;
}
function rc(e, t) {
  const r = new Ne({
    check: "custom",
    ...E(t)
  });
  return r._zod.check = e, r;
}
function sn(e, t) {
  try {
    var r = e();
  } catch (n) {
    return t(n);
  }
  return r && r.then ? r.then(void 0, t) : r;
}
function nc(e, t) {
  for (var r = {}; e.length; ) {
    var n = e[0], s = n.code, o = n.message, a = n.path.join(".");
    if (!r[a]) if ("unionErrors" in n) {
      var c = n.unionErrors[0].errors[0];
      r[a] = { message: c.message, type: c.code };
    } else r[a] = { message: o, type: s };
    if ("unionErrors" in n && n.unionErrors.forEach(function(m) {
      return m.errors.forEach(function(h) {
        return e.push(h);
      });
    }), t) {
      var u = r[a].types, d = u && u[n.code];
      r[a] = or(a, t, r, s, d ? [].concat(d, n.message) : n.message);
    }
    e.shift();
  }
  return r;
}
function sc(e, t) {
  for (var r = {}; e.length; ) {
    var n = e[0], s = n.code, o = n.message, a = n.path.join(".");
    if (!r[a]) if (n.code === "invalid_union" && n.errors.length > 0) {
      var c = n.errors[0][0];
      r[a] = { message: c.message, type: c.code };
    } else r[a] = { message: o, type: s };
    if (n.code === "invalid_union" && n.errors.forEach(function(m) {
      return m.forEach(function(h) {
        return e.push(h);
      });
    }), t) {
      var u = r[a].types, d = u && u[n.code];
      r[a] = or(a, t, r, s, d ? [].concat(d, n.message) : n.message);
    }
    e.shift();
  }
  return r;
}
function oc(e, t, r) {
  if (r === void 0 && (r = {}), function(n) {
    return "_def" in n && typeof n._def == "object" && "typeName" in n._def;
  }(e)) return function(n, s, o) {
    try {
      return Promise.resolve(sn(function() {
        return Promise.resolve(e[r.mode === "sync" ? "parse" : "parseAsync"](n, t)).then(function(a) {
          return o.shouldUseNativeValidation && Gt({}, o), { errors: {}, values: r.raw ? Object.assign({}, n) : a };
        });
      }, function(a) {
        if (function(c) {
          return Array.isArray(c == null ? void 0 : c.issues);
        }(a)) return { values: {}, errors: Lr(nc(a.errors, !o.shouldUseNativeValidation && o.criteriaMode === "all"), o) };
        throw a;
      }));
    } catch (a) {
      return Promise.reject(a);
    }
  };
  if (function(n) {
    return "_zod" in n && typeof n._zod == "object";
  }(e)) return function(n, s, o) {
    try {
      return Promise.resolve(sn(function() {
        return Promise.resolve((r.mode === "sync" ? Do : Oo)(e, n, t)).then(function(a) {
          return o.shouldUseNativeValidation && Gt({}, o), { errors: {}, values: r.raw ? Object.assign({}, n) : a };
        });
      }, function(a) {
        if (function(c) {
          return c instanceof vr;
        }(a)) return { values: {}, errors: Lr(sc(a.issues, !o.shouldUseNativeValidation && o.criteriaMode === "all"), o) };
        throw a;
      }));
    } catch (a) {
      return Promise.reject(a);
    }
  };
  throw new Error("Invalid input: not a Zod schema");
}
const qt = Zt({});
function ac({
  children: e,
  onSubmit: t,
  schema: r,
  defaultValues: n,
  className: s = "",
  size: o = "md",
  variant: a = "default",
  methods: c
}) {
  const u = io({
    defaultValues: n,
    resolver: r ? oc(r) : void 0
  }), d = c || u;
  return /* @__PURE__ */ i.jsx(Ms, { ...d, children: /* @__PURE__ */ i.jsx(qt.Provider, { value: { size: o, variant: a }, children: /* @__PURE__ */ i.jsx(
    "form",
    {
      onSubmit: d.handleSubmit(t),
      className: `form ${s}`,
      noValidate: !0,
      children: e
    }
  ) }) });
}
const ft = ({
  name: e,
  label: t,
  help: r,
  required: n,
  children: s,
  className: o = "",
  horizontal: a = !1
}) => {
  var p, _;
  const c = Pe(), u = (_ = (p = c == null ? void 0 : c.formState) == null ? void 0 : p.errors) == null ? void 0 : _[e], d = a ? "field is-horizontal" : "field", m = a ? "field-label" : "", h = a ? "field-body" : "";
  return /* @__PURE__ */ i.jsxs("div", { className: `${d} ${o}`, children: [
    t && /* @__PURE__ */ i.jsx("div", { className: m, children: /* @__PURE__ */ i.jsxs("label", { className: "label", htmlFor: e, children: [
      t,
      n && /* @__PURE__ */ i.jsx("span", { className: "text-red-500 ml-1", children: "*" })
    ] }) }),
    /* @__PURE__ */ i.jsx("div", { className: h, children: /* @__PURE__ */ i.jsxs("div", { className: "field", children: [
      /* @__PURE__ */ i.jsx("div", { className: "control", children: s }),
      r && !u && /* @__PURE__ */ i.jsx("p", { className: "help text-gray-500", children: r }),
      u && /* @__PURE__ */ i.jsx("p", { className: "help text-red-500", children: typeof u == "object" && u !== null && "message" in u ? u.message : "This field is invalid" })
    ] }) })
  ] });
}, Fl = ({
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
}, ic = ({
  name: e,
  options: t,
  placeholder: r,
  multiple: n = !1,
  size: s,
  loading: o = !1,
  disabled: a = !1,
  rules: c,
  className: u = "",
  fullWidth: d = !1
}) => {
  const { register: m } = Pe(), { size: h, variant: p } = Oe(qt), _ = {
    sm: "text-sm py-1 px-2",
    md: "text-base py-2 px-3",
    lg: "text-lg py-3 px-4"
  }, z = {
    default: "border-gray-300 focus:border-blue-500",
    bordered: "border-2 border-gray-400 focus:border-blue-500",
    filled: "bg-gray-100 border-transparent focus:bg-white focus:border-blue-500"
  }, y = [
    "select",
    _[h || "md"],
    z[p || "default"],
    "rounded-md",
    "transition-colors",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-blue-500",
    "focus:ring-opacity-50",
    d && "w-full",
    a && "opacity-50 cursor-not-allowed",
    u
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("div", { className: `select-wrapper ${o ? "is-loading" : ""}`, children: /* @__PURE__ */ i.jsxs(
    "select",
    {
      ...m(e, c),
      multiple: n,
      size: s,
      disabled: a || o,
      className: y,
      children: [
        r && /* @__PURE__ */ i.jsx("option", { value: "", disabled: !0, children: r }),
        t.map(($) => /* @__PURE__ */ i.jsx(
          "option",
          {
            value: $.value,
            disabled: $.disabled,
            children: $.label
          },
          $.value
        ))
      ]
    }
  ) });
}, cc = ({
  name: e,
  label: t,
  value: r,
  disabled: n = !1,
  rules: s,
  className: o = "",
  size: a = "md",
  checked: c,
  onChange: u
}) => {
  let d = null;
  try {
    const y = Pe();
    d = y == null ? void 0 : y.register;
  } catch {
  }
  const { size: m } = Oe(qt), h = a || m || "md", p = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  }, _ = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }, z = (y) => {
    u && u(y.target.checked);
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
            ${p[h]}
            rounded 
            border-gray-300 
            text-blue-600 
            focus:ring-2 
            focus:ring-blue-500 
            focus:ring-offset-0
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
          checked: c,
          onChange: z,
          value: r,
          disabled: n,
          className: `
            ${p[h]}
            rounded 
            border-gray-300 
            text-blue-600 
            focus:ring-2 
            focus:ring-blue-500 
            focus:ring-offset-0
            disabled:opacity-50
            disabled:cursor-not-allowed
            cursor-pointer
          `
        }
      )
    ),
    t && /* @__PURE__ */ i.jsx("span", { className: `${_[h]} select-none`, children: t })
  ] });
}, El = ({
  name: e,
  label: t,
  value: r,
  disabled: n = !1,
  rules: s,
  className: o = "",
  size: a = "md"
}) => {
  const { register: c } = Pe(), { size: u } = Oe(qt), d = a || u || "md", m = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  }, h = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };
  return /* @__PURE__ */ i.jsxs("label", { className: `inline-flex items-center gap-2 cursor-pointer ${n ? "cursor-not-allowed opacity-50" : ""} ${o}`, children: [
    /* @__PURE__ */ i.jsx(
      "input",
      {
        type: "radio",
        ...c(e, s),
        value: r,
        disabled: n,
        className: `
          ${m[d]}
          border-gray-300 
          text-blue-600 
          focus:ring-2 
          focus:ring-blue-500 
          focus:ring-offset-0
          disabled:opacity-50
          disabled:cursor-not-allowed
          cursor-pointer
        `
      }
    ),
    t && /* @__PURE__ */ i.jsx("span", { className: `${h[d]} select-none`, children: t })
  ] });
}, Al = ({
  name: e,
  accept: t,
  multiple: r = !1,
  disabled: n = !1,
  boxed: s = !1,
  centered: o = !1,
  fullWidth: a = !1,
  rules: c,
  className: u = "",
  label: d = "Choose a file...",
  icon: m
}) => {
  var y;
  const { register: h, watch: p } = Pe(), _ = p(e), z = [
    "file",
    s && "has-boxed",
    o && "is-centered",
    a && "is-fullwidth",
    u
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.jsx("div", { className: z, children: /* @__PURE__ */ i.jsxs("label", { className: "file-label", children: [
    /* @__PURE__ */ i.jsx(
      "input",
      {
        className: "file-input",
        type: "file",
        ...h(e, c),
        accept: t,
        multiple: r,
        disabled: n
      }
    ),
    /* @__PURE__ */ i.jsxs("span", { className: "file-cta", children: [
      m && /* @__PURE__ */ i.jsx("span", { className: "file-icon", children: m }),
      /* @__PURE__ */ i.jsx("span", { className: "file-label", children: d })
    ] }),
    _ && _.length > 0 && /* @__PURE__ */ i.jsx("span", { className: "file-name", children: r ? `${_.length} files selected` : (y = _[0]) == null ? void 0 : y.name })
  ] }) });
}, lc = /* @__PURE__ */ x("ZodISODateTime", (e, t) => {
  Ra.init(e, t), J.init(e, t);
});
function uc(e) {
  return Di(lc, e);
}
const dc = /* @__PURE__ */ x("ZodISODate", (e, t) => {
  Za.init(e, t), J.init(e, t);
});
function fc(e) {
  return Oi(dc, e);
}
const mc = /* @__PURE__ */ x("ZodISOTime", (e, t) => {
  Da.init(e, t), J.init(e, t);
});
function hc(e) {
  return Pi(mc, e);
}
const pc = /* @__PURE__ */ x("ZodISODuration", (e, t) => {
  Oa.init(e, t), J.init(e, t);
});
function gc(e) {
  return Ii(pc, e);
}
const xc = (e, t) => {
  vr.init(e, t), e.name = "ZodError", Object.defineProperties(e, {
    format: {
      value: (r) => Zo(e, r)
      // enumerable: false,
    },
    flatten: {
      value: (r) => Ro(e, r)
      // enumerable: false,
    },
    addIssue: {
      value: (r) => {
        e.issues.push(r), e.message = JSON.stringify(e.issues, Kt, 2);
      }
      // enumerable: false,
    },
    addIssues: {
      value: (r) => {
        e.issues.push(...r), e.message = JSON.stringify(e.issues, Kt, 2);
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
}, Bt = x("ZodError", xc, {
  Parent: Error
}), yc = /* @__PURE__ */ Ln(Bt), vc = /* @__PURE__ */ Mn(Bt), bc = /* @__PURE__ */ Un(Bt), wc = /* @__PURE__ */ Wn(Bt), re = /* @__PURE__ */ x("ZodType", (e, t) => (Q.init(e, t), e.def = t, Object.defineProperty(e, "_def", { value: t }), e.check = (...r) => e.clone(
  {
    ...t,
    checks: [
      ...t.checks ?? [],
      ...r.map((n) => typeof n == "function" ? { _zod: { check: n, def: { check: "custom" }, onattach: [] } } : n)
    ]
  }
  // { parent: true }
), e.clone = (r, n) => qe(e, r, n), e.brand = () => e, e.register = (r, n) => (r.add(e, n), e), e.parse = (r, n) => yc(e, r, n, { callee: e.parse }), e.safeParse = (r, n) => bc(e, r, n), e.parseAsync = async (r, n) => vc(e, r, n, { callee: e.parseAsync }), e.safeParseAsync = async (r, n) => wc(e, r, n), e.spa = e.safeParseAsync, e.refine = (r, n) => e.check(hl(r, n)), e.superRefine = (r) => e.check(pl(r)), e.overwrite = (r) => e.check(at(r)), e.optional = () => cn(e), e.nullable = () => ln(e), e.nullish = () => cn(ln(e)), e.nonoptional = (r) => il(e, r), e.array = () => Wc(e), e.or = (r) => Gc([e, r]), e.and = (r) => Xc(e, r), e.transform = (r) => un(e, tl(r)), e.default = (r) => sl(e, r), e.prefault = (r) => al(e, r), e.catch = (r) => ll(e, r), e.pipe = (r) => un(e, r), e.readonly = () => fl(e), e.describe = (r) => {
  const n = e.clone();
  return dt.add(n, { description: r }), n;
}, Object.defineProperty(e, "description", {
  get() {
    var r;
    return (r = dt.get(e)) == null ? void 0 : r.description;
  },
  configurable: !0
}), e.meta = (...r) => {
  if (r.length === 0)
    return dt.get(e);
  const n = e.clone();
  return dt.add(n, r[0]), n;
}, e.isOptional = () => e.safeParse(void 0).success, e.isNullable = () => e.safeParse(null).success, e)), Qn = /* @__PURE__ */ x("_ZodString", (e, t) => {
  br.init(e, t), re.init(e, t);
  const r = e._zod.bag;
  e.format = r.format ?? null, e.minLength = r.minimum ?? null, e.maxLength = r.maximum ?? null, e.regex = (...n) => e.check(Li(...n)), e.includes = (...n) => e.check(Wi(...n)), e.startsWith = (...n) => e.check(Ji(...n)), e.endsWith = (...n) => e.check(Yi(...n)), e.min = (...n) => e.check(Rt(...n)), e.max = (...n) => e.check(Kn(...n)), e.length = (...n) => e.check(Xn(...n)), e.nonempty = (...n) => e.check(Rt(1, ...n)), e.lowercase = (n) => e.check(Mi(n)), e.uppercase = (n) => e.check(Ui(n)), e.trim = () => e.check(Gi()), e.normalize = (...n) => e.check(Hi(...n)), e.toLowerCase = () => e.check(Ki()), e.toUpperCase = () => e.check(Xi());
}), _c = /* @__PURE__ */ x("ZodString", (e, t) => {
  br.init(e, t), Qn.init(e, t), e.email = (r) => e.check(pi(jc, r)), e.url = (r) => e.check(bi(Nc, r)), e.jwt = (r) => e.check(Zi(Ic, r)), e.emoji = (r) => e.check(wi(kc, r)), e.guid = (r) => e.check(nn(on, r)), e.uuid = (r) => e.check(gi(ht, r)), e.uuidv4 = (r) => e.check(xi(ht, r)), e.uuidv6 = (r) => e.check(yi(ht, r)), e.uuidv7 = (r) => e.check(vi(ht, r)), e.nanoid = (r) => e.check(_i(Cc, r)), e.guid = (r) => e.check(nn(on, r)), e.cuid = (r) => e.check(ji($c, r)), e.cuid2 = (r) => e.check(Ni(zc, r)), e.ulid = (r) => e.check(ki(Fc, r)), e.base64 = (r) => e.check(Ti(Dc, r)), e.base64url = (r) => e.check(Si(Oc, r)), e.xid = (r) => e.check(Ci(Ec, r)), e.ksuid = (r) => e.check($i(Ac, r)), e.ipv4 = (r) => e.check(zi(Tc, r)), e.ipv6 = (r) => e.check(Fi(Sc, r)), e.cidrv4 = (r) => e.check(Ei(Rc, r)), e.cidrv6 = (r) => e.check(Ai(Zc, r)), e.e164 = (r) => e.check(Ri(Pc, r)), e.datetime = (r) => e.check(uc(r)), e.date = (r) => e.check(fc(r)), e.time = (r) => e.check(hc(r)), e.duration = (r) => e.check(gc(r));
});
function mt(e) {
  return hi(_c, e);
}
const J = /* @__PURE__ */ x("ZodStringFormat", (e, t) => {
  W.init(e, t), Qn.init(e, t);
}), jc = /* @__PURE__ */ x("ZodEmail", (e, t) => {
  ka.init(e, t), J.init(e, t);
}), on = /* @__PURE__ */ x("ZodGUID", (e, t) => {
  ja.init(e, t), J.init(e, t);
}), ht = /* @__PURE__ */ x("ZodUUID", (e, t) => {
  Na.init(e, t), J.init(e, t);
}), Nc = /* @__PURE__ */ x("ZodURL", (e, t) => {
  Ca.init(e, t), J.init(e, t);
}), kc = /* @__PURE__ */ x("ZodEmoji", (e, t) => {
  $a.init(e, t), J.init(e, t);
}), Cc = /* @__PURE__ */ x("ZodNanoID", (e, t) => {
  za.init(e, t), J.init(e, t);
}), $c = /* @__PURE__ */ x("ZodCUID", (e, t) => {
  Fa.init(e, t), J.init(e, t);
}), zc = /* @__PURE__ */ x("ZodCUID2", (e, t) => {
  Ea.init(e, t), J.init(e, t);
}), Fc = /* @__PURE__ */ x("ZodULID", (e, t) => {
  Aa.init(e, t), J.init(e, t);
}), Ec = /* @__PURE__ */ x("ZodXID", (e, t) => {
  Ta.init(e, t), J.init(e, t);
}), Ac = /* @__PURE__ */ x("ZodKSUID", (e, t) => {
  Sa.init(e, t), J.init(e, t);
}), Tc = /* @__PURE__ */ x("ZodIPv4", (e, t) => {
  Pa.init(e, t), J.init(e, t);
}), Sc = /* @__PURE__ */ x("ZodIPv6", (e, t) => {
  Ia.init(e, t), J.init(e, t);
}), Rc = /* @__PURE__ */ x("ZodCIDRv4", (e, t) => {
  qa.init(e, t), J.init(e, t);
}), Zc = /* @__PURE__ */ x("ZodCIDRv6", (e, t) => {
  Ba.init(e, t), J.init(e, t);
}), Dc = /* @__PURE__ */ x("ZodBase64", (e, t) => {
  Va.init(e, t), J.init(e, t);
}), Oc = /* @__PURE__ */ x("ZodBase64URL", (e, t) => {
  Ma.init(e, t), J.init(e, t);
}), Pc = /* @__PURE__ */ x("ZodE164", (e, t) => {
  Ua.init(e, t), J.init(e, t);
}), Ic = /* @__PURE__ */ x("ZodJWT", (e, t) => {
  Ja.init(e, t), J.init(e, t);
}), qc = /* @__PURE__ */ x("ZodBoolean", (e, t) => {
  Ya.init(e, t), re.init(e, t);
});
function Bc(e) {
  return qi(qc, e);
}
const Vc = /* @__PURE__ */ x("ZodUnknown", (e, t) => {
  Ha.init(e, t), re.init(e, t);
});
function an() {
  return Bi(Vc);
}
const Lc = /* @__PURE__ */ x("ZodNever", (e, t) => {
  Ga.init(e, t), re.init(e, t);
});
function Mc(e) {
  return Vi(Lc, e);
}
const Uc = /* @__PURE__ */ x("ZodArray", (e, t) => {
  Ka.init(e, t), re.init(e, t), e.element = t.element, e.min = (r, n) => e.check(Rt(r, n)), e.nonempty = (r) => e.check(Rt(1, r)), e.max = (r, n) => e.check(Kn(r, n)), e.length = (r, n) => e.check(Xn(r, n)), e.unwrap = () => e.element;
});
function Wc(e, t) {
  return Qi(Uc, e, t);
}
const Jc = /* @__PURE__ */ x("ZodObject", (e, t) => {
  Xa.init(e, t), re.init(e, t), L(e, "shape", () => t.shape), e.keyof = () => Qc(Object.keys(e._zod.def.shape)), e.catchall = (r) => e.clone({ ...e._zod.def, catchall: r }), e.passthrough = () => e.clone({ ...e._zod.def, catchall: an() }), e.loose = () => e.clone({ ...e._zod.def, catchall: an() }), e.strict = () => e.clone({ ...e._zod.def, catchall: Mc() }), e.strip = () => e.clone({ ...e._zod.def, catchall: void 0 }), e.extend = (r) => Eo(e, r), e.merge = (r) => Ao(e, r), e.pick = (r) => zo(e, r), e.omit = (r) => Fo(e, r), e.partial = (...r) => To(es, e, r[0]), e.required = (...r) => So(ts, e, r[0]);
});
function Yc(e, t) {
  const r = {
    type: "object",
    get shape() {
      return Ie(this, "shape", e ? No(e) : {}), this.shape;
    },
    ...E(t)
  };
  return new Jc(r);
}
const Hc = /* @__PURE__ */ x("ZodUnion", (e, t) => {
  Qa.init(e, t), re.init(e, t), e.options = t.options;
});
function Gc(e, t) {
  return new Hc({
    type: "union",
    options: e,
    ...E(t)
  });
}
const Kc = /* @__PURE__ */ x("ZodIntersection", (e, t) => {
  ei.init(e, t), re.init(e, t);
});
function Xc(e, t) {
  return new Kc({
    type: "intersection",
    left: e,
    right: t
  });
}
const er = /* @__PURE__ */ x("ZodEnum", (e, t) => {
  ti.init(e, t), re.init(e, t), e.enum = t.entries, e.options = Object.values(t.entries);
  const r = new Set(Object.keys(t.entries));
  e.extract = (n, s) => {
    const o = {};
    for (const a of n)
      if (r.has(a))
        o[a] = t.entries[a];
      else
        throw new Error(`Key ${a} not found in enum`);
    return new er({
      ...t,
      checks: [],
      ...E(s),
      entries: o
    });
  }, e.exclude = (n, s) => {
    const o = { ...t.entries };
    for (const a of n)
      if (r.has(a))
        delete o[a];
      else
        throw new Error(`Key ${a} not found in enum`);
    return new er({
      ...t,
      checks: [],
      ...E(s),
      entries: o
    });
  };
});
function Qc(e, t) {
  const r = Array.isArray(e) ? Object.fromEntries(e.map((n) => [n, n])) : e;
  return new er({
    type: "enum",
    entries: r,
    ...E(t)
  });
}
const el = /* @__PURE__ */ x("ZodTransform", (e, t) => {
  ri.init(e, t), re.init(e, t), e._zod.parse = (r, n) => {
    r.addIssue = (o) => {
      if (typeof o == "string")
        r.issues.push(st(o, r.value, t));
      else {
        const a = o;
        a.fatal && (a.continue = !1), a.code ?? (a.code = "custom"), a.input ?? (a.input = r.value), a.inst ?? (a.inst = e), r.issues.push(st(a));
      }
    };
    const s = t.transform(r.value, r);
    return s instanceof Promise ? s.then((o) => (r.value = o, r)) : (r.value = s, r);
  };
});
function tl(e) {
  return new el({
    type: "transform",
    transform: e
  });
}
const es = /* @__PURE__ */ x("ZodOptional", (e, t) => {
  ni.init(e, t), re.init(e, t), e.unwrap = () => e._zod.def.innerType;
});
function cn(e) {
  return new es({
    type: "optional",
    innerType: e
  });
}
const rl = /* @__PURE__ */ x("ZodNullable", (e, t) => {
  si.init(e, t), re.init(e, t), e.unwrap = () => e._zod.def.innerType;
});
function ln(e) {
  return new rl({
    type: "nullable",
    innerType: e
  });
}
const nl = /* @__PURE__ */ x("ZodDefault", (e, t) => {
  oi.init(e, t), re.init(e, t), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
});
function sl(e, t) {
  return new nl({
    type: "default",
    innerType: e,
    get defaultValue() {
      return typeof t == "function" ? t() : qn(t);
    }
  });
}
const ol = /* @__PURE__ */ x("ZodPrefault", (e, t) => {
  ai.init(e, t), re.init(e, t), e.unwrap = () => e._zod.def.innerType;
});
function al(e, t) {
  return new ol({
    type: "prefault",
    innerType: e,
    get defaultValue() {
      return typeof t == "function" ? t() : qn(t);
    }
  });
}
const ts = /* @__PURE__ */ x("ZodNonOptional", (e, t) => {
  ii.init(e, t), re.init(e, t), e.unwrap = () => e._zod.def.innerType;
});
function il(e, t) {
  return new ts({
    type: "nonoptional",
    innerType: e,
    ...E(t)
  });
}
const cl = /* @__PURE__ */ x("ZodCatch", (e, t) => {
  ci.init(e, t), re.init(e, t), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
});
function ll(e, t) {
  return new cl({
    type: "catch",
    innerType: e,
    catchValue: typeof t == "function" ? t : () => t
  });
}
const ul = /* @__PURE__ */ x("ZodPipe", (e, t) => {
  li.init(e, t), re.init(e, t), e.in = t.in, e.out = t.out;
});
function un(e, t) {
  return new ul({
    type: "pipe",
    in: e,
    out: t
    // ...util.normalizeParams(params),
  });
}
const dl = /* @__PURE__ */ x("ZodReadonly", (e, t) => {
  ui.init(e, t), re.init(e, t), e.unwrap = () => e._zod.def.innerType;
});
function fl(e) {
  return new dl({
    type: "readonly",
    innerType: e
  });
}
const ml = /* @__PURE__ */ x("ZodCustom", (e, t) => {
  di.init(e, t), re.init(e, t);
});
function hl(e, t = {}) {
  return ec(ml, e, t);
}
function pl(e) {
  return tc(e);
}
const gl = Yc({
  name: mt().min(2, "Name must be at least 2 characters"),
  email: mt().email("Invalid email address"),
  subject: mt().min(1, "Please select a subject"),
  message: mt().min(10, "Message must be at least 10 characters"),
  terms: Bc().refine((e) => e === !0, {
    message: "You must accept the terms"
  })
}), Tl = ({
  companyName: e = "QWANYX",
  tagline: t = "Build Amazing Digital Experiences"
}) => {
  const [r, n] = X(!1);
  w.useEffect(() => {
    const c = () => {
      n(window.scrollY > 50);
    };
    return window.addEventListener("scroll", c), () => window.removeEventListener("scroll", c);
  }, []);
  const s = (c) => {
    console.log("Contact form submitted:", c), alert("Thank you for your message! We will get back to you soon.");
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
    /* @__PURE__ */ i.jsx(wo, { autoDetect: !0 }),
    /* @__PURE__ */ i.jsx(
      fo,
      {
        title: e,
        fixed: !0,
        className: `transition-all duration-300 ${r ? "bg-white shadow-lg" : "bg-transparent"}`,
        items: a,
        actions: /* @__PURE__ */ i.jsx(pe, { variant: "solid", color: "primary", size: "sm", children: "Get Started" })
      }
    ),
    /* @__PURE__ */ i.jsx(
      zn,
      {
        id: "home",
        size: "lg",
        className: "bg-gradient-to-br from-blue-600 to-purple-600 text-white",
        style: { paddingTop: "100px" },
        children: /* @__PURE__ */ i.jsxs(An, { children: [
          /* @__PURE__ */ i.jsx(Fn, { className: "text-5xl md:text-6xl font-bold mb-6", children: t }),
          /* @__PURE__ */ i.jsx(En, { className: "text-xl md:text-2xl mb-8 opacity-90", children: "Transform your ideas into reality with our cutting-edge solutions" }),
          /* @__PURE__ */ i.jsxs(Tn, { children: [
            /* @__PURE__ */ i.jsx(pe, { size: "lg", variant: "solid", className: "bg-white text-gray-900 hover:bg-gray-100", children: "Start Free Trial" }),
            /* @__PURE__ */ i.jsx(pe, { size: "lg", variant: "outline", className: "border-white text-white hover:bg-white hover:text-gray-900", children: "Watch Demo" })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ i.jsx(Xe, { id: "features", spacing: "xl", className: "bg-gray-50", children: /* @__PURE__ */ i.jsxs(ze, { children: [
      /* @__PURE__ */ i.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ i.jsxs($e, { as: "h2", className: "text-4xl font-bold mb-4", children: [
          "Why Choose ",
          e,
          "?"
        ] }),
        /* @__PURE__ */ i.jsx(ue, { className: "text-xl text-gray-600", children: "Discover the features that make us stand out" })
      ] }),
      /* @__PURE__ */ i.jsxs(Sn, { cols: 3, children: [
        /* @__PURE__ */ i.jsxs(jt, { centered: !0, children: [
          /* @__PURE__ */ i.jsx(Nt, { size: "lg", color: "primary", className: "mb-4", children: /* @__PURE__ */ i.jsx("svg", { className: "w-12 h-12", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ i.jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M13 10V3L4 14h7v7l9-11h-7z"
            }
          ) }) }),
          /* @__PURE__ */ i.jsx(kt, { className: "text-xl font-semibold mb-2", children: "Lightning Fast" }),
          /* @__PURE__ */ i.jsx(Ct, { className: "text-gray-600", children: "Optimized performance with incredible speed. Your applications will run smoother than ever." })
        ] }),
        /* @__PURE__ */ i.jsxs(jt, { centered: !0, children: [
          /* @__PURE__ */ i.jsx(Nt, { size: "lg", color: "success", className: "mb-4", children: /* @__PURE__ */ i.jsx("svg", { className: "w-12 h-12", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ i.jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            }
          ) }) }),
          /* @__PURE__ */ i.jsx(kt, { className: "text-xl font-semibold mb-2", children: "Secure by Default" }),
          /* @__PURE__ */ i.jsx(Ct, { className: "text-gray-600", children: "Enterprise-grade security built into every layer. Your data is protected with the latest encryption." })
        ] }),
        /* @__PURE__ */ i.jsxs(jt, { centered: !0, children: [
          /* @__PURE__ */ i.jsx(Nt, { size: "lg", color: "accent", className: "mb-4", children: /* @__PURE__ */ i.jsx("svg", { className: "w-12 h-12", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ i.jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            }
          ) }) }),
          /* @__PURE__ */ i.jsx(kt, { className: "text-xl font-semibold mb-2", children: "Fully Customizable" }),
          /* @__PURE__ */ i.jsx(Ct, { className: "text-gray-600", children: "Tailor every aspect to match your brand. Complete control over colors, layouts, and functionality." })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ i.jsx(Xe, { id: "services", spacing: "xl", children: /* @__PURE__ */ i.jsxs(ze, { children: [
      /* @__PURE__ */ i.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ i.jsx($e, { as: "h2", className: "text-4xl font-bold mb-4", children: "Our Services" }),
        /* @__PURE__ */ i.jsx(ue, { className: "text-xl text-gray-600", children: "Professional solutions tailored to your needs" })
      ] }),
      /* @__PURE__ */ i.jsxs(wt, { cols: 3, gap: "lg", children: [
        /* @__PURE__ */ i.jsxs(Ge, { className: "hover:shadow-lg transition-shadow", children: [
          /* @__PURE__ */ i.jsx(
            vt,
            {
              src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=250&fit=crop",
              alt: "Business Strategy"
            }
          ),
          /* @__PURE__ */ i.jsxs(pt, { children: [
            /* @__PURE__ */ i.jsx(gt, { children: "Business Consulting" }),
            /* @__PURE__ */ i.jsx(xt, { children: "Strategic planning for growth" })
          ] }),
          /* @__PURE__ */ i.jsx(Ke, { children: /* @__PURE__ */ i.jsx(ue, { children: "Expert guidance to transform your business operations and maximize efficiency with proven strategies." }) }),
          /* @__PURE__ */ i.jsx(yt, { children: /* @__PURE__ */ i.jsx(pe, { fullWidth: !0, variant: "outline", children: "Learn More" }) })
        ] }),
        /* @__PURE__ */ i.jsxs(Ge, { className: "hover:shadow-lg transition-shadow", children: [
          /* @__PURE__ */ i.jsx(
            vt,
            {
              src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
              alt: "Digital Solutions"
            }
          ),
          /* @__PURE__ */ i.jsxs(pt, { children: [
            /* @__PURE__ */ i.jsx(gt, { children: "Digital Transformation" }),
            /* @__PURE__ */ i.jsx(xt, { children: "Modernize your infrastructure" })
          ] }),
          /* @__PURE__ */ i.jsx(Ke, { children: /* @__PURE__ */ i.jsx(ue, { children: "Comprehensive digital solutions to streamline your workflows and enhance productivity across teams." }) }),
          /* @__PURE__ */ i.jsx(yt, { children: /* @__PURE__ */ i.jsx(pe, { fullWidth: !0, variant: "outline", children: "Learn More" }) })
        ] }),
        /* @__PURE__ */ i.jsxs(Ge, { className: "hover:shadow-lg transition-shadow", children: [
          /* @__PURE__ */ i.jsx(
            vt,
            {
              src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop",
              alt: "Team Training"
            }
          ),
          /* @__PURE__ */ i.jsxs(pt, { children: [
            /* @__PURE__ */ i.jsx(gt, { children: "Team Development" }),
            /* @__PURE__ */ i.jsx(xt, { children: "Empower your workforce" })
          ] }),
          /* @__PURE__ */ i.jsx(Ke, { children: /* @__PURE__ */ i.jsx(ue, { children: "Professional training programs designed to upskill your team and foster a culture of innovation." }) }),
          /* @__PURE__ */ i.jsx(yt, { children: /* @__PURE__ */ i.jsx(pe, { fullWidth: !0, variant: "outline", children: "Learn More" }) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ i.jsx(Xe, { spacing: "lg", className: "bg-gray-900 text-white", children: /* @__PURE__ */ i.jsx(ze, { children: /* @__PURE__ */ i.jsxs(wt, { cols: 4, gap: "lg", children: [
      /* @__PURE__ */ i.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ i.jsx($e, { as: "h3", className: "text-4xl font-bold mb-2", children: "500+" }),
        /* @__PURE__ */ i.jsx(ue, { className: "text-gray-400", children: "Happy Clients" })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ i.jsx($e, { as: "h3", className: "text-4xl font-bold mb-2", children: "1000+" }),
        /* @__PURE__ */ i.jsx(ue, { className: "text-gray-400", children: "Projects Completed" })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ i.jsx($e, { as: "h3", className: "text-4xl font-bold mb-2", children: "50+" }),
        /* @__PURE__ */ i.jsx(ue, { className: "text-gray-400", children: "Team Members" })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ i.jsx($e, { as: "h3", className: "text-4xl font-bold mb-2", children: "10+" }),
        /* @__PURE__ */ i.jsx(ue, { className: "text-gray-400", children: "Years Experience" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ i.jsx(Xe, { id: "contact", spacing: "xl", className: "bg-gray-50", children: /* @__PURE__ */ i.jsxs(ze, { children: [
      /* @__PURE__ */ i.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ i.jsx($e, { as: "h2", className: "text-4xl font-bold mb-4", children: "Get In Touch" }),
        /* @__PURE__ */ i.jsx(ue, { className: "text-xl text-gray-600", children: "We'd love to hear from you. Send us a message and we'll respond as soon as possible." })
      ] }),
      /* @__PURE__ */ i.jsx(Ge, { className: "shadow-lg", children: /* @__PURE__ */ i.jsx(Ke, { children: /* @__PURE__ */ i.jsx(
        ac,
        {
          onSubmit: s,
          schema: gl,
          defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
            terms: !1
          },
          children: /* @__PURE__ */ i.jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ i.jsxs(wt, { cols: 2, gap: "md", children: [
              /* @__PURE__ */ i.jsx(ft, { name: "name", label: "Your Name", required: !0, children: /* @__PURE__ */ i.jsx(Tt, { name: "name", placeholder: "John Doe", fullWidth: !0 }) }),
              /* @__PURE__ */ i.jsx(ft, { name: "email", label: "Email Address", required: !0, children: /* @__PURE__ */ i.jsx(Tt, { name: "email", type: "email", placeholder: "john@example.com", fullWidth: !0 }) })
            ] }),
            /* @__PURE__ */ i.jsx(ft, { name: "subject", label: "Subject", required: !0, children: /* @__PURE__ */ i.jsx(ic, { name: "subject", options: o, fullWidth: !0 }) }),
            /* @__PURE__ */ i.jsx(ft, { name: "message", label: "Message", required: !0, children: /* @__PURE__ */ i.jsx(
              wn,
              {
                name: "message",
                placeholder: "Tell us about your project...",
                rows: 6,
                fullWidth: !0
              }
            ) }),
            /* @__PURE__ */ i.jsx(
              cc,
              {
                name: "terms",
                label: "I agree to the terms and conditions and privacy policy"
              }
            ),
            /* @__PURE__ */ i.jsx(pe, { type: "submit", variant: "solid", color: "primary", size: "lg", fullWidth: !0, children: "Send Message" })
          ] })
        }
      ) }) })
    ] }) }),
    /* @__PURE__ */ i.jsx(Rn, { className: "bg-gray-900 text-white", children: /* @__PURE__ */ i.jsxs(ze, { children: [
      /* @__PURE__ */ i.jsxs(Zn, { cols: 4, children: [
        /* @__PURE__ */ i.jsxs(Qe, { children: [
          /* @__PURE__ */ i.jsx($e, { as: "h4", className: "text-xl font-bold mb-4", children: e }),
          /* @__PURE__ */ i.jsx(ue, { className: "text-gray-400 mb-4", children: "Building the future of digital experiences, one project at a time." }),
          /* @__PURE__ */ i.jsxs(_t, { gap: "sm", children: [
            /* @__PURE__ */ i.jsx(Le, { variant: "outline", color: "primary", children: "Innovation" }),
            /* @__PURE__ */ i.jsx(Le, { variant: "outline", color: "success", children: "Quality" })
          ] })
        ] }),
        /* @__PURE__ */ i.jsxs(Qe, { children: [
          /* @__PURE__ */ i.jsx($t, { children: "Products" }),
          /* @__PURE__ */ i.jsxs(zt, { children: [
            /* @__PURE__ */ i.jsx(ie, { href: "#", children: "Features" }),
            /* @__PURE__ */ i.jsx(ie, { href: "#", children: "Pricing" }),
            /* @__PURE__ */ i.jsx(ie, { href: "#", children: "Documentation" }),
            /* @__PURE__ */ i.jsx(ie, { href: "#", children: "API Reference" })
          ] })
        ] }),
        /* @__PURE__ */ i.jsxs(Qe, { children: [
          /* @__PURE__ */ i.jsx($t, { children: "Company" }),
          /* @__PURE__ */ i.jsxs(zt, { children: [
            /* @__PURE__ */ i.jsx(ie, { href: "#", children: "About Us" }),
            /* @__PURE__ */ i.jsx(ie, { href: "#", children: "Careers" }),
            /* @__PURE__ */ i.jsx(ie, { href: "#", children: "Blog" }),
            /* @__PURE__ */ i.jsx(ie, { href: "#", children: "Press Kit" })
          ] })
        ] }),
        /* @__PURE__ */ i.jsxs(Qe, { children: [
          /* @__PURE__ */ i.jsx($t, { children: "Support" }),
          /* @__PURE__ */ i.jsxs(zt, { children: [
            /* @__PURE__ */ i.jsx(ie, { href: "#", children: "Help Center" }),
            /* @__PURE__ */ i.jsx(ie, { href: "#", children: "Contact Us" }),
            /* @__PURE__ */ i.jsx(ie, { href: "#", children: "Status" }),
            /* @__PURE__ */ i.jsx(ie, { href: "#", children: "Terms of Service" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ i.jsx(Dn, { className: "border-t border-gray-800 mt-8 pt-8", children: /* @__PURE__ */ i.jsxs(_t, { justify: "between", align: "center", children: [
        /* @__PURE__ */ i.jsxs(ue, { className: "text-gray-400", children: [
          "© 2024 ",
          e,
          ". All rights reserved."
        ] }),
        /* @__PURE__ */ i.jsxs(_t, { gap: "md", children: [
          /* @__PURE__ */ i.jsx(ie, { href: "#", className: "text-gray-400 hover:text-white", children: /* @__PURE__ */ i.jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ i.jsx("path", { d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" }) }) }),
          /* @__PURE__ */ i.jsx(ie, { href: "#", className: "text-gray-400 hover:text-white", children: /* @__PURE__ */ i.jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ i.jsx("path", { d: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" }) }) }),
          /* @__PURE__ */ i.jsx(ie, { href: "#", className: "text-gray-400 hover:text-white", children: /* @__PURE__ */ i.jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ i.jsx("path", { d: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" }) }) }),
          /* @__PURE__ */ i.jsx(ie, { href: "#", className: "text-gray-400 hover:text-white", children: /* @__PURE__ */ i.jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ i.jsx("path", { d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" }) }) })
        ] })
      ] }) })
    ] }) })
  ] });
};
export {
  yo as Alert,
  Cl as AuthModal,
  $l as AuthStatus,
  lr as Avatar,
  go as AvatarGroup,
  Le as Badge,
  pe as Button,
  Ge as Card,
  Ke as CardContent,
  xt as CardDescription,
  yt as CardFooter,
  pt as CardHeader,
  vt as CardImage,
  gt as CardTitle,
  cc as Checkbox,
  ho as ClosableBadge,
  co as Code,
  ze as Container,
  Fl as Control,
  po as DotBadge,
  wo as Favicon,
  jt as Feature,
  Ct as FeatureDescription,
  Nt as FeatureIcon,
  kt as FeatureTitle,
  Sn as FeaturesGrid,
  ft as Field,
  Al as FileInput,
  _t as Flex,
  Rn as Footer,
  Dn as FooterBottom,
  Zn as FooterGrid,
  ie as FooterLink,
  zt as FooterLinks,
  Qe as FooterSection,
  $t as FooterTitle,
  ac as Form,
  wt as Grid,
  $e as Heading,
  zn as Hero,
  Tn as HeroActions,
  An as HeroContent,
  En as HeroSubtitle,
  Fn as HeroTitle,
  mo as IconBadge,
  xo as InitialsAvatar,
  Tt as Input,
  ur as Modal,
  hr as ModalBody,
  mr as ModalDescription,
  pr as ModalFooter,
  dr as ModalHeader,
  fr as ModalTitle,
  _n as Navbar,
  jn as NavbarBrand,
  uo as NavbarContent,
  Yt as NavbarItem,
  lo as NavbarLogo,
  Ht as NavbarMenu,
  vo as OTPInput,
  bo as OTPTimer,
  Tl as QwanyxTemplate,
  El as Radio,
  Xe as Section,
  ic as Select,
  kl as SimpleModal,
  fo as SimpleNavbar,
  Nl as SimpleTabs,
  Nn as Tabs,
  $n as TabsContent,
  kn as TabsList,
  Cn as TabsTrigger,
  ue as Text,
  wn as Textarea,
  wl as ThemeProvider,
  _l as WorkspaceProvider,
  zl as useFavicon,
  io as useForm,
  Pe as useFormContext,
  bl as useTheme,
  jl as useWorkspace
};
//# sourceMappingURL=index.mjs.map
