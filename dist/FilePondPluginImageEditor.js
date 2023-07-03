const Z = (e) => e instanceof File, q = (e) => /^image/.test(e.type), Q = (e, o, g = []) => {
  const T = document.createElement(e), E = Object.getOwnPropertyDescriptors(T.__proto__);
  for (const l in o)
    l === "style" ? T.style.cssText = o[l] : E[l] && E[l].set || /textContent|innerHTML/.test(l) || typeof o[l] == "function" ? T[l] = o[l] : T.setAttribute(l, o[l]);
  return g.forEach((l) => T.appendChild(l)), T;
};
let j = null;
const w = () => (j === null && (j = typeof window < "u" && typeof window.document < "u"), j), ae = w() && !!Node.prototype.replaceChildren, se = ae ? (
  // @ts-ignore
  (e, o) => e.replaceChildren(o)
) : (e, o) => {
  for (; e.lastChild; )
    e.removeChild(e.lastChild);
  o !== void 0 && e.append(o);
}, N = w() && Q("div", {
  class: "PinturaMeasure",
  style: "position:absolute;left:0;top:0;width:99999px;height:0;pointer-events:none;contain:strict;margin:0;padding:0;"
});
let K;
const Ee = (e) => (se(N, e), N.parentNode || document.body.append(N), clearTimeout(K), K = setTimeout(() => {
  N.remove();
}, 500), e);
let H = null;
const de = () => (H === null && (H = w() && /^((?!chrome|android).)*(safari|iphone|ipad)/i.test(navigator.userAgent)), H), ce = (e) => new Promise((o, g) => {
  let T = !1;
  !e.parentNode && de() && (T = !0, e.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;left:0;top:0;width:0;height:0;", Ee(e));
  const E = () => {
    const M = e.naturalWidth, B = e.naturalHeight;
    M && B && (T && e.remove(), clearInterval(l), o({ width: M, height: B }));
  };
  e.onerror = (M) => {
    clearInterval(l), g(M);
  };
  const l = setInterval(E, 1);
  E();
}), le = (e) => new Promise((o, g) => {
  const T = () => {
    o({
      width: e.videoWidth,
      height: e.videoHeight
    });
  };
  if (e.readyState >= 1)
    return T();
  e.onloadedmetadata = T, e.onerror = () => g(e.error);
}), _e = (e) => typeof e == "string", Ie = (e) => new Promise((o) => {
  const g = _e(e) ? e : URL.createObjectURL(e), T = () => {
    const l = new Image();
    l.src = g, o(l);
  };
  if (e instanceof Blob && q(e))
    return T();
  const E = document.createElement("video");
  E.preload = "metadata", E.onloadedmetadata = () => o(E), E.onerror = T, E.src = g;
}), Te = (e) => e.nodeName === "VIDEO", ue = async (e) => {
  let o;
  e.src ? o = e : o = await Ie(e);
  let g;
  try {
    g = Te(o) ? await le(o) : await ce(o);
  } finally {
    Z(e) && URL.revokeObjectURL(o.src);
  }
  return g;
}, fe = (e) => e instanceof Blob && !(e instanceof File), Y = (...e) => {
}, ee = (e) => {
  e.width = 1, e.height = 1;
  const o = e.getContext("2d");
  o && o.clearRect(0, 0, 1, 1);
};
let W = null;
const ge = () => {
  if (W === null)
    if ("WebGL2RenderingContext" in window) {
      let e;
      try {
        e = Q("canvas"), W = !!e.getContext("webgl2");
      } catch {
        W = !1;
      }
      e && ee(e), e = void 0;
    } else
      W = !1;
  return W;
}, me = (e, o) => ge() ? e.getContext("webgl2", o) : e.getContext("webgl", o) || e.getContext("experimental-webgl", o);
let k = null;
const pe = () => {
  if (k === null) {
    let e = Q("canvas");
    k = !!me(e), ee(e), e = void 0;
  }
  return k;
}, Oe = () => Object.prototype.toString.call(window.operamini) === "[object OperaMini]", Re = () => "Promise" in window, he = () => "URL" in window && "createObjectURL" in window.URL, Ge = () => "visibilityState" in document, Ae = () => "performance" in window, Me = () => "File" in window;
let z = null;
const X = () => (z === null && (z = w() && // Can't run on Opera Mini due to lack of everything
!Oe() && // Require these APIs to feature detect a modern browser
Ge() && Re() && Me() && he() && Ae()), z), Se = (e) => {
  const { addFilter: o, utils: g, views: T } = e, { Type: E, createRoute: l } = g, { fileActionButton: M } = T, y = (({ parallel: i = 1, autoShift: n = !0 }) => {
    const r = [];
    let t = 0;
    const s = () => {
      if (!r.length)
        return f.oncomplete();
      t++, r.shift()(() => {
        t--, t < i && _();
      });
    }, _ = () => {
      for (let I = 0; I < i - t; I++)
        s();
    }, f = {
      queue: (I) => {
        r.push(I), n && _();
      },
      runJobs: _,
      oncomplete: () => {
      }
    };
    return f;
  })({ parallel: 1 }), F = (i) => i === null ? {} : i;
  o(
    "SHOULD_REMOVE_ON_REVERT",
    (i, { item: n, query: r }) => new Promise((t) => {
      const { file: s } = n, _ = r("GET_ALLOW_IMAGE_EDITOR") && r("GET_IMAGE_EDITOR_ALLOW_EDIT") && r("GET_IMAGE_EDITOR_SUPPORT_EDIT") && r("GET_IMAGE_EDITOR_SUPPORT_IMAGE")(s);
      t(!_);
    })
  ), o(
    "DID_LOAD_ITEM",
    (i, { query: n, dispatch: r }) => new Promise((t, s) => {
      if (i.origin > 1) {
        t(i);
        return;
      }
      const { file: _ } = i;
      if (!n("GET_ALLOW_IMAGE_EDITOR") || !n(
        "GET_IMAGE_EDITOR_INSTANT_EDIT"
      ) || !n("GET_IMAGE_EDITOR_SUPPORT_IMAGE")(_))
        return t(i);
      const f = () => {
        if (!b.length)
          return;
        const { item: p, resolve: m, reject: O } = b[0];
        r("EDIT_ITEM", {
          id: p.id,
          handleEditorResponse: I(p, m, O)
        });
      }, I = (p, m, O) => (R) => {
        b.shift(), R ? m(p) : O(p), r("KICK"), f();
      };
      te({ item: i, resolve: t, reject: s }), b.length === 1 && f();
    })
  ), o("DID_CREATE_ITEM", (i, { query: n, dispatch: r }) => {
    i.getMetadata("color") && i.setMetadata("colors", i.getMetadata("color")), i.extend("edit", () => {
      r("EDIT_ITEM", { id: i.id });
    });
  });
  const b = [], te = (i) => (b.push(i), i), ie = (i) => {
    const { imageProcessor: n, imageReader: r, imageWriter: t } = F(
      i("GET_IMAGE_EDITOR")
    );
    return i("GET_IMAGE_EDITOR_WRITE_IMAGE") && i("GET_IMAGE_EDITOR_SUPPORT_WRITE_IMAGE") && n && r && t;
  }, ne = (i, n) => {
    const r = i("GET_FILE_POSTER_HEIGHT"), t = i("GET_FILE_POSTER_MAX_HEIGHT");
    return r ? (n.width = r * 2, n.height = r * 2) : t && (n.width = t * 2, n.height = t * 2), n;
  }, $ = (i, n, r = () => {
  }) => {
    if (!n)
      return;
    if (!i("GET_FILE_POSTER_FILTER_ITEM")(n))
      return r();
    const {
      imageProcessor: t,
      imageReader: s,
      imageWriter: _,
      editorOptions: f,
      legacyDataToImageState: I,
      imageState: p
    } = F(i("GET_IMAGE_EDITOR"));
    if (!t)
      return;
    const [m, O] = s, [R = Y, S] = _, L = n.file, h = n.getMetadata("imageState"), P = ne(i, {
      width: 512,
      height: 512
    }), U = {
      ...f,
      imageReader: m(O),
      imageWriter: R({
        // can optionally overwrite poster size
        ...S || {},
        // limit memory so poster is created quicker
        canvasMemoryLimit: P.width * P.height * 2,
        // apply legacy data if needed
        preprocessImageState: (G, A, J, v) => !h && I ? {
          ...G,
          ...I(void 0, v.size, {
            ...n.getMetadata()
          })
        } : G
      }),
      imageState: {
        ...p,
        ...h
      }
    };
    y.queue((G) => {
      t(L, U).then(({ dest: A }) => {
        n.setMetadata("poster", URL.createObjectURL(A), !0), G(), r();
      });
    });
  };
  o("CREATE_VIEW", (i) => {
    const { is: n, view: r, query: t } = i;
    if (!t("GET_ALLOW_IMAGE_EDITOR") || !t("GET_IMAGE_EDITOR_SUPPORT_WRITE_IMAGE"))
      return;
    const s = t("GET_ALLOW_FILE_POSTER");
    if (!(n("file-info") && !s || n("file") && s))
      return;
    const {
      createEditor: f,
      imageReader: I,
      imageWriter: p,
      editorOptions: m,
      legacyDataToImageState: O,
      imageState: R
    } = F(t("GET_IMAGE_EDITOR"));
    if (!I || !p || !m || !m.locale)
      return;
    delete m.imageReader, delete m.imageWriter;
    const [S, L] = I, h = (a) => {
      const { id: d } = a;
      return t("GET_ITEM", d);
    }, P = (a) => {
      if (!t("GET_ALLOW_FILE_POSTER"))
        return !1;
      const d = h(a);
      return d ? t("GET_FILE_POSTER_FILTER_ITEM")(d) ? !!d.getMetadata("poster") : !1 : void 0;
    }, U = ({ root: a, props: d, action: c }) => {
      const { handleEditorResponse: u } = c, D = h(d), re = D.file, C = f({
        ...m,
        imageReader: S(L),
        src: re
      });
      C.on("load", ({ size: x }) => {
        let V = D.getMetadata("imageState");
        !V && O && (V = O(C, x, D.getMetadata())), C.imageState = {
          ...R,
          ...V
        };
      }), C.on("process", ({ imageState: x }) => {
        D.setMetadata("imageState", x), u && u(!0);
      }), C.on("close", () => {
        u && u(!1);
      });
    }, G = ({ root: a, props: d }) => {
      const { id: c } = d, u = t("GET_ITEM", c);
      if (!u)
        return;
      const D = u.file;
      t("GET_IMAGE_EDITOR_SUPPORT_IMAGE")(D) && (t("GET_ALLOW_FILE_POSTER") && !u.getMetadata("poster") && a.dispatch("REQUEST_CREATE_IMAGE_POSTER", { id: c }), !(!t("GET_IMAGE_EDITOR_ALLOW_EDIT") || !t("GET_IMAGE_EDITOR_SUPPORT_EDIT")) && A(a, d));
    }, A = (a, d) => {
      if (a.ref.handleEdit || (a.ref.handleEdit = (c) => {
        c.stopPropagation(), a.dispatch("EDIT_ITEM", { id: d.id });
      }), P(d)) {
        a.ref.editButton && a.ref.editButton.parentNode && a.ref.editButton.parentNode.removeChild(a.ref.editButton);
        const c = r.createChildView(M, {
          label: "edit",
          icon: t("GET_IMAGE_EDITOR_ICON_EDIT"),
          opacity: 0
        });
        c.element.classList.add("filepond--action-edit-item"), c.element.dataset.align = t(
          "GET_STYLE_IMAGE_EDITOR_BUTTON_EDIT_ITEM_POSITION"
        ), c.on("click", a.ref.handleEdit), a.ref.buttonEditItem = r.appendChildView(c);
      } else {
        a.ref.buttonEditItem && a.removeChildView(a.ref.buttonEditItem);
        const c = r.element.querySelector(".filepond--file-info-main"), u = document.createElement("button");
        u.className = "filepond--action-edit-item-alt", u.innerHTML = t("GET_IMAGE_EDITOR_ICON_EDIT") + "<span>edit</span>", u.addEventListener("click", a.ref.handleEdit), c.appendChild(u), a.ref.editButton = u;
      }
    }, J = ({ root: a, props: d, action: c }) => {
      if (/imageState/.test(c.change.key) && t("GET_ALLOW_FILE_POSTER"))
        return a.dispatch("REQUEST_CREATE_IMAGE_POSTER", { id: d.id });
      /poster/.test(c.change.key) && (!t("GET_IMAGE_EDITOR_ALLOW_EDIT") || !t("GET_IMAGE_EDITOR_SUPPORT_EDIT") || A(a, d));
    };
    r.registerDestroyer(({ root: a }) => {
      a.ref.buttonEditItem && a.ref.buttonEditItem.off("click", a.ref.handleEdit), a.ref.editButton && a.ref.editButton.removeEventListener("click", a.ref.handleEdit);
    });
    const v = {
      EDIT_ITEM: U,
      DID_LOAD_ITEM: G,
      DID_UPDATE_ITEM_METADATA: J,
      DID_REMOVE_ITEM: ({ props: a }) => {
        const { id: d } = a, c = t("GET_ITEM", d);
        if (!c)
          return;
        const u = c.getMetadata("poster");
        u && URL.revokeObjectURL(u);
      },
      REQUEST_CREATE_IMAGE_POSTER: ({ root: a, props: d }) => $(a.query, h(d)),
      DID_FILE_POSTER_LOAD: void 0
    };
    if (s) {
      const a = ({ root: d }) => {
        d.ref.buttonEditItem && (d.ref.buttonEditItem.opacity = 1);
      };
      v.DID_FILE_POSTER_LOAD = a;
    }
    r.registerWriter(l(v));
  }), o(
    "SHOULD_PREPARE_OUTPUT",
    (i, { query: n, change: r, item: t }) => new Promise((s) => {
      if (!n("GET_IMAGE_EDITOR_SUPPORT_IMAGE")(t.file) || r && !/imageState/.test(r.key))
        return s(!1);
      s(!n("IS_ASYNC"));
    })
  );
  const oe = (i, n, r) => new Promise((t) => {
    if (!ie(i) || r.archived || !Z(n) && !fe(n) || !i("GET_IMAGE_EDITOR_SUPPORT_IMAGE")(n))
      return t(!1);
    ue(n).then(() => {
      const s = i("GET_IMAGE_TRANSFORM_IMAGE_FILTER");
      if (s) {
        const _ = s(n);
        if (typeof _ == "boolean")
          return t(_);
        if (typeof _.then == "function")
          return _.then(t);
      }
      t(!0);
    }).catch(() => {
      const s = i("GET_IMAGE_EDITOR_SUPPORT_IMAGE_FORMAT");
      if (s && s(n)) {
        t(!0);
        return;
      }
      t(!1);
    });
  });
  return o("PREPARE_OUTPUT", (i, { query: n, item: r }) => {
    const t = (s) => new Promise((_, f) => {
      const I = () => {
        y.queue((p) => {
          const m = r.getMetadata("imageState"), {
            imageProcessor: O,
            imageReader: R,
            imageWriter: S,
            editorOptions: L,
            imageState: h
          } = F(n("GET_IMAGE_EDITOR"));
          if (!O || !R || !S || !L)
            return;
          const [P, U] = R, [G = Y, A] = S;
          O(s, {
            ...L,
            imageReader: P(U),
            imageWriter: G(A),
            imageState: {
              ...h,
              ...m
            }
          }).then(_).catch(f).finally(p);
        });
      };
      n("GET_ALLOW_FILE_POSTER") && !r.getMetadata("poster") ? $(n, r, I) : I();
    });
    return new Promise((s) => {
      oe(n, i, r).then((_) => {
        if (!_)
          return s(i);
        t(i).then((f) => {
          const I = n("GET_IMAGE_EDITOR_AFTER_WRITE_IMAGE");
          if (I)
            return Promise.resolve(I(f)).then(s);
          s(f.dest);
        });
      });
    });
  }), {
    options: {
      // enable or disable image editing
      allowImageEditor: [!0, E.BOOLEAN],
      // open editor when image is dropped
      imageEditorInstantEdit: [!1, E.BOOLEAN],
      // allow editing
      imageEditorAllowEdit: [!0, E.BOOLEAN],
      // cannot edit if no WebGL or is <=IE11
      imageEditorSupportEdit: [
        w() && X() && pe(),
        E.BOOLEAN
      ],
      // receives file and should return true if can edit
      imageEditorSupportImage: [q, E.FUNCTION],
      // receives file, should return true if can be loaded with Pintura
      imageEditorSupportImageFormat: [null, E.FUNCTION],
      // cannot write if is <= IE11
      imageEditorSupportWriteImage: [X(), E.BOOLEAN],
      // should output image
      imageEditorWriteImage: [!0, E.BOOLEAN],
      // receives written image and can return single or more images
      imageEditorAfterWriteImage: [void 0, E.FUNCTION],
      // editor object
      imageEditor: [null, E.OBJECT],
      // the icon to use for the edit button
      imageEditorIconEdit: [
        '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M8.5 17h1.586l7-7L15.5 8.414l-7 7V17zm-1.707-2.707l8-8a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-8 8A1 1 0 0 1 10.5 19h-3a1 1 0 0 1-1-1v-3a1 1 0 0 1 .293-.707z" fill="currentColor" fill-rule="nonzero"/></svg>',
        E.STRING
      ],
      // location of processing button
      styleImageEditorButtonEditItemPosition: ["bottom center", E.STRING]
    }
  };
};
w() && document.dispatchEvent(new CustomEvent("FilePond:pluginloaded", { detail: Se }));
export {
  Se as default
};
