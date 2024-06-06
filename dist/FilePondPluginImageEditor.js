const Q = (e) => e instanceof File, te = (e) => /^image/.test(e.type), $ = (e, o, g = []) => {
  const u = document.createElement(e), E = Object.getOwnPropertyDescriptors(u.__proto__);
  for (const l in o)
    l === "style" ? u.style.cssText = o[l] : E[l] && E[l].set || /textContent|innerHTML/.test(l) || typeof o[l] == "function" ? u[l] = o[l] : u.setAttribute(l, o[l]);
  return g.forEach((l) => u.appendChild(l)), u;
};
let j = null;
const w = () => (j === null && (j = typeof window < "u" && typeof window.document < "u"), j), Ee = w() && !!Node.prototype.replaceChildren, de = Ee ? (
  // @ts-ignore
  (e, o) => e.replaceChildren(o)
) : (e, o) => {
  for (; e.lastChild; )
    e.removeChild(e.lastChild);
  o !== void 0 && e.append(o);
}, B = w() && $("div", {
  class: "PinturaMeasure",
  style: "position:absolute;left:0;top:0;width:99999px;height:0;pointer-events:none;contain:strict;margin:0;padding:0;"
});
let X;
const ce = (e) => (de(B, e), B.parentNode || document.body.append(B), clearTimeout(X), X = setTimeout(() => {
  B.remove();
}, 500), e);
let H = null;
const le = () => (H === null && (H = w() && /^((?!chrome|android).)*(safari|iphone|ipad)/i.test(navigator.userAgent)), H), Ie = (e) => new Promise((o, g) => {
  let u = !1;
  !e.parentNode && le() && (u = !0, e.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;left:0;top:0;width:0;height:0;", ce(e));
  const E = () => {
    const S = e.naturalWidth, y = e.naturalHeight;
    S && y && (u && e.remove(), clearInterval(l), o({ width: S, height: y }));
  };
  e.onerror = (S) => {
    clearInterval(l), g(S);
  };
  const l = setInterval(E, 1);
  E();
}), _e = (e) => new Promise((o, g) => {
  const u = () => {
    o({
      width: e.videoWidth,
      height: e.videoHeight
    });
  };
  if (e.readyState >= 1)
    return u();
  e.onloadedmetadata = u, e.onerror = () => g(e.error);
}), Te = (e) => typeof e == "string", ue = (e) => new Promise((o) => {
  const g = Te(e) ? e : URL.createObjectURL(e), u = () => {
    const l = new Image();
    l.src = g, o(l);
  };
  if (e instanceof Blob && te(e))
    return u();
  const E = document.createElement("video");
  E.preload = "metadata", E.onloadedmetadata = () => o(E), E.onerror = u, E.src = g;
}), fe = (e) => e.nodeName === "VIDEO", ge = async (e) => {
  let o;
  e.src ? o = e : o = await ue(e);
  let g;
  try {
    g = fe(o) ? await _e(o) : await Ie(o);
  } finally {
    Q(e) && URL.revokeObjectURL(o.src);
  }
  return g;
}, Z = (e) => e instanceof Blob && !(e instanceof File), q = (...e) => {
}, ie = (e) => {
  e.width = 1, e.height = 1;
  const o = e.getContext("2d");
  o && o.clearRect(0, 0, 1, 1);
};
let W = null;
const me = () => {
  if (W === null)
    if ("WebGL2RenderingContext" in window) {
      let e;
      try {
        e = $("canvas"), W = !!e.getContext("webgl2");
      } catch {
        W = !1;
      }
      e && ie(e), e = void 0;
    } else
      W = !1;
  return W;
}, pe = (e, o) => me() ? e.getContext("webgl2", o) : e.getContext("webgl", o) || e.getContext("experimental-webgl", o);
let k = null;
const Oe = () => {
  if (k === null) {
    let e = $("canvas");
    k = !!pe(e), ie(e), e = void 0;
  }
  return k;
}, Re = () => Object.prototype.toString.call(window.operamini) === "[object OperaMini]", he = () => "Promise" in window, Ge = () => "URL" in window && "createObjectURL" in window.URL, Ae = () => "visibilityState" in document, Me = () => "performance" in window, Se = () => "File" in window;
let z = null;
const ee = () => (z === null && (z = w() && // Can't run on Opera Mini due to lack of everything
!Re() && // Require these APIs to feature detect a modern browser
Ae() && he() && Se() && Ge() && Me()), z), Le = (e) => {
  const { addFilter: o, utils: g, views: u } = e, { Type: E, createRoute: l } = g, { fileActionButton: S } = u, x = (({ parallel: i = 1, autoShift: n = !0 }) => {
    const r = [];
    let t = 0;
    const s = () => {
      if (!r.length)
        return f.oncomplete();
      t++, r.shift()(() => {
        t--, t < i && I();
      });
    }, I = () => {
      for (let _ = 0; _ < i - t; _++)
        s();
    }, f = {
      queue: (_) => {
        r.push(_), n && I();
      },
      runJobs: I,
      oncomplete: () => {
      }
    };
    return f;
  })({ parallel: 1 }), v = (i) => i === null ? {} : i;
  o(
    "SHOULD_REMOVE_ON_REVERT",
    (i, { item: n, query: r }) => new Promise((t) => {
      const { file: s } = n, I = r("GET_ALLOW_IMAGE_EDITOR") && r("GET_IMAGE_EDITOR_ALLOW_EDIT") && r("GET_IMAGE_EDITOR_SUPPORT_EDIT") && r("GET_IMAGE_EDITOR_SUPPORT_IMAGE")(s);
      t(!I);
    })
  ), o(
    "DID_LOAD_ITEM",
    (i, { query: n, dispatch: r }) => new Promise((t, s) => {
      if (i.origin > 1) {
        t(i);
        return;
      }
      const { file: I } = i;
      if (!n("GET_ALLOW_IMAGE_EDITOR") || !n(
        "GET_IMAGE_EDITOR_INSTANT_EDIT"
      ) || !n("GET_IMAGE_EDITOR_SUPPORT_IMAGE")(I))
        return t(i);
      const f = () => {
        if (!b.length)
          return;
        const { item: p, resolve: m, reject: O } = b[0];
        r("EDIT_ITEM", {
          id: p.id,
          handleEditorResponse: _(p, m, O)
        });
      }, _ = (p, m, O) => (h) => {
        b.shift(), h ? m(p) : O(p), r("KICK"), f();
      };
      ne({ item: i, resolve: t, reject: s }), b.length === 1 && f();
    })
  ), o("DID_CREATE_ITEM", (i, { query: n, dispatch: r }) => {
    i.getMetadata("color") && i.setMetadata("colors", i.getMetadata("color")), i.extend("edit", () => {
      r("EDIT_ITEM", { id: i.id });
    });
  });
  const b = [], ne = (i) => (b.push(i), i), oe = (i) => {
    const { imageProcessor: n, imageReader: r, imageWriter: t } = v(
      i("GET_IMAGE_EDITOR")
    );
    return i("GET_IMAGE_EDITOR_WRITE_IMAGE") && i("GET_IMAGE_EDITOR_SUPPORT_WRITE_IMAGE") && n && r && t;
  }, re = (i, n) => {
    const r = i("GET_FILE_POSTER_HEIGHT"), t = i("GET_FILE_POSTER_MAX_HEIGHT");
    return r ? (n.width = r * 2, n.height = r * 2) : t && (n.width = t * 2, n.height = t * 2), n;
  }, J = (i, n, r = () => {
  }) => {
    if (!n)
      return;
    if (!i("GET_FILE_POSTER_FILTER_ITEM")(n))
      return r();
    const {
      imageProcessor: t,
      imageReader: s,
      imageWriter: I,
      editorOptions: f,
      legacyDataToImageState: _,
      imageState: p
    } = v(i("GET_IMAGE_EDITOR"));
    if (!t)
      return;
    const [m, O] = s, [h = q, L] = I, P = n.file, G = n.getMetadata("imageState"), D = re(i, {
      width: 512,
      height: 512
    }), U = {
      ...f,
      imageReader: m(O),
      imageWriter: h({
        // can optionally overwrite poster size
        ...L || {},
        // limit memory so poster is created quicker
        canvasMemoryLimit: D.width * D.height * 2,
        // apply legacy data if needed
        preprocessImageState: (A, M, K, N) => !G && _ ? {
          ...A,
          ..._(void 0, N.size, {
            ...n.getMetadata()
          })
        } : A
      }),
      imageState: {
        ...p,
        ...G
      }
    };
    x.queue((A) => {
      t(P, U).then(({ dest: M }) => {
        n.setMetadata("poster", URL.createObjectURL(M), !0), A(), r();
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
      imageReader: _,
      imageWriter: p,
      editorOptions: m,
      legacyDataToImageState: O,
      imageState: h
    } = v(t("GET_IMAGE_EDITOR"));
    if (!_ || !p || !m || !m.locale)
      return;
    delete m.imageReader, delete m.imageWriter;
    const [L, P] = _, G = (a) => {
      const { id: d } = a;
      return t("GET_ITEM", d);
    }, D = (a) => {
      if (!t("GET_ALLOW_FILE_POSTER"))
        return !1;
      const d = G(a);
      return d ? t("GET_FILE_POSTER_FILTER_ITEM")(d) ? !!d.getMetadata("poster") : !1 : void 0;
    }, U = ({ root: a, props: d, action: c }) => {
      const { handleEditorResponse: T } = c, R = G(d), Y = Q(R.file) || Z(R.file), se = Y ? R.file : R.source, C = f({
        ...m,
        imageReader: L(P),
        src: se
      });
      C.on("load", ({ size: V }) => {
        let F = R.getMetadata("imageState");
        !F && O && (F = O(C, V, R.getMetadata())), C.imageState = {
          ...h,
          ...F
        };
      }), C.on("process", ({ src: V, imageState: F }) => {
        Y || R.setFile(V), R.setMetadata("imageState", F), T && T(!0);
      }), C.on("close", () => {
        T && T(!1);
      });
    }, A = ({ root: a, props: d }) => {
      const { id: c } = d, T = t("GET_ITEM", c);
      if (!T)
        return;
      const R = T.file;
      t("GET_IMAGE_EDITOR_SUPPORT_IMAGE")(R) && (t("GET_ALLOW_FILE_POSTER") && !T.getMetadata("poster") && a.dispatch("REQUEST_CREATE_IMAGE_POSTER", { id: c }), !(!t("GET_IMAGE_EDITOR_ALLOW_EDIT") || !t("GET_IMAGE_EDITOR_SUPPORT_EDIT")) && M(a, d));
    }, M = (a, d) => {
      if (a.ref.handleEdit || (a.ref.handleEdit = (c) => {
        c.stopPropagation(), a.dispatch("EDIT_ITEM", { id: d.id });
      }), D(d)) {
        a.ref.editButton && a.ref.editButton.parentNode && a.ref.editButton.parentNode.removeChild(a.ref.editButton);
        const c = r.createChildView(S, {
          label: "edit",
          icon: t("GET_IMAGE_EDITOR_ICON_EDIT"),
          opacity: 0
        });
        c.element.classList.add("filepond--action-edit-item"), c.element.dataset.align = t(
          "GET_STYLE_IMAGE_EDITOR_BUTTON_EDIT_ITEM_POSITION"
        ), c.on("click", a.ref.handleEdit), a.ref.buttonEditItem = r.appendChildView(c);
      } else {
        a.ref.buttonEditItem && a.removeChildView(a.ref.buttonEditItem);
        const c = r.element.querySelector(".filepond--file-info-main"), T = document.createElement("button");
        T.className = "filepond--action-edit-item-alt", T.type = "button", T.innerHTML = t("GET_IMAGE_EDITOR_ICON_EDIT") + "<span>edit</span>", T.addEventListener("click", a.ref.handleEdit), c.appendChild(T), a.ref.editButton = T;
      }
    }, K = ({ root: a, props: d, action: c }) => {
      if (/imageState/.test(c.change.key) && t("GET_ALLOW_FILE_POSTER"))
        return a.dispatch("REQUEST_CREATE_IMAGE_POSTER", { id: d.id });
      /poster/.test(c.change.key) && (!t("GET_IMAGE_EDITOR_ALLOW_EDIT") || !t("GET_IMAGE_EDITOR_SUPPORT_EDIT") || M(a, d));
    };
    r.registerDestroyer(({ root: a }) => {
      a.ref.buttonEditItem && a.ref.buttonEditItem.off("click", a.ref.handleEdit), a.ref.editButton && a.ref.editButton.removeEventListener("click", a.ref.handleEdit);
    });
    const N = {
      EDIT_ITEM: U,
      DID_LOAD_ITEM: A,
      DID_UPDATE_ITEM_METADATA: K,
      DID_REMOVE_ITEM: ({ props: a }) => {
        const { id: d } = a, c = t("GET_ITEM", d);
        if (!c)
          return;
        const T = c.getMetadata("poster");
        T && URL.revokeObjectURL(T);
      },
      REQUEST_CREATE_IMAGE_POSTER: ({ root: a, props: d }) => J(a.query, G(d)),
      DID_FILE_POSTER_LOAD: void 0
    };
    if (s) {
      const a = ({ root: d }) => {
        d.ref.buttonEditItem && (d.ref.buttonEditItem.opacity = 1);
      };
      N.DID_FILE_POSTER_LOAD = a;
    }
    r.registerWriter(l(N));
  }), o(
    "SHOULD_PREPARE_OUTPUT",
    (i, { query: n, change: r, item: t }) => new Promise((s) => {
      if (!n("GET_IMAGE_EDITOR_SUPPORT_IMAGE")(t.file) || r && !/imageState/.test(r.key))
        return s(!1);
      s(!n("IS_ASYNC"));
    })
  );
  const ae = (i, n, r) => new Promise((t) => {
    if (!oe(i) || r.archived || !Q(n) && !Z(n) || !i("GET_IMAGE_EDITOR_SUPPORT_IMAGE")(n))
      return t(!1);
    ge(n).then(() => {
      const s = i("GET_IMAGE_TRANSFORM_IMAGE_FILTER");
      if (s) {
        const I = s(n);
        if (typeof I == "boolean")
          return t(I);
        if (typeof I.then == "function")
          return I.then(t);
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
    const t = (s) => new Promise((I, f) => {
      const _ = () => {
        x.queue((p) => {
          const m = r.getMetadata("imageState"), {
            imageProcessor: O,
            imageReader: h,
            imageWriter: L,
            editorOptions: P,
            imageState: G
          } = v(n("GET_IMAGE_EDITOR"));
          if (!O || !h || !L || !P)
            return;
          const [D, U] = h, [A = q, M] = L;
          O(s, {
            ...P,
            imageReader: D(U),
            imageWriter: A(M),
            imageState: {
              ...G,
              ...m
            }
          }).then(I).catch(f).finally(p);
        });
      };
      n("GET_ALLOW_FILE_POSTER") && !r.getMetadata("poster") ? J(n, r, _) : _();
    });
    return new Promise((s) => {
      ae(n, i, r).then((I) => {
        if (!I)
          return s(i);
        t(i).then((f) => {
          const _ = n("GET_IMAGE_EDITOR_AFTER_WRITE_IMAGE");
          if (_)
            return Promise.resolve(_(f)).then(s);
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
        w() && ee() && Oe(),
        E.BOOLEAN
      ],
      // receives file and should return true if can edit
      imageEditorSupportImage: [te, E.FUNCTION],
      // receives file, should return true if can be loaded with Pintura
      imageEditorSupportImageFormat: [null, E.FUNCTION],
      // cannot write if is <= IE11
      imageEditorSupportWriteImage: [ee(), E.BOOLEAN],
      // should output image
      imageEditorWriteImage: [!0, E.BOOLEAN],
      // receives written image and can return single or more images
      imageEditorBeforeOpenImage: [void 0, E.FUNCTION],
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
w() && document.dispatchEvent(new CustomEvent("FilePond:pluginloaded", { detail: Le }));
export {
  Le as default
};
