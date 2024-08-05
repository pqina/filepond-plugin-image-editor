const Q = (e) => e instanceof File, te = (e) => /^image/.test(e.type), ie = (e) => typeof e == "string";
function de(e, o) {
  o.split(";").forEach((f) => {
    const [I, s] = f.split(":");
    if (!I.length || !s)
      return;
    const [c, h] = s.split("!important");
    e.style.setProperty(I, c, ie(h) ? "important" : void 0);
  });
}
const $ = (e, o, f = []) => {
  const I = document.createElement(e), s = Object.getOwnPropertyDescriptors(I.__proto__);
  for (const c in o)
    c === "style" ? de(I, o[c]) : s[c] && s[c].set || /textContent|innerHTML/.test(c) || typeof o[c] == "function" ? I[c] = o[c] : I.setAttribute(c, o[c]);
  return f.forEach((c) => I.appendChild(c)), I;
};
let j = null;
const w = () => (j === null && (j = typeof window < "u" && typeof window.document < "u"), j), ce = w() && !!Node.prototype.replaceChildren, le = ce ? (
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
const Ie = (e) => (le(B, e), B.parentNode || document.body.append(B), clearTimeout(X), X = setTimeout(() => {
  B.remove();
}, 500), e);
let H = null;
const _e = () => (H === null && (H = w() && /^((?!chrome|android).)*(safari|iphone|ipad)/i.test(navigator.userAgent)), H), ue = (e) => new Promise((o, f) => {
  let I = !1;
  !e.parentNode && _e() && (I = !0, e.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;left:0;top:0;width:0;height:0;", Ie(e));
  const s = () => {
    const h = e.naturalWidth, y = e.naturalHeight;
    h && y && (I && e.remove(), clearInterval(c), o({ width: h, height: y }));
  };
  e.onerror = (h) => {
    clearInterval(c), f(h);
  };
  const c = setInterval(s, 1);
  s();
}), Te = (e) => new Promise((o, f) => {
  const I = () => {
    o({
      width: e.videoWidth,
      height: e.videoHeight
    });
  };
  if (e.readyState >= 1)
    return I();
  e.onloadedmetadata = I, e.onerror = () => f(e.error);
}), fe = (e) => new Promise((o) => {
  const f = ie(e) ? e : URL.createObjectURL(e), I = () => {
    const c = new Image();
    c.src = f, o(c);
  };
  if (e instanceof Blob && te(e))
    return I();
  const s = document.createElement("video");
  s.preload = "metadata", s.onloadedmetadata = () => o(s), s.onerror = I, s.src = f;
}), ge = (e) => e.nodeName === "VIDEO", me = async (e) => {
  let o;
  e.src ? o = e : o = await fe(e);
  let f;
  try {
    f = ge(o) ? await Te(o) : await ue(o);
  } finally {
    Q(e) && URL.revokeObjectURL(o.src);
  }
  return f;
}, Z = (e) => e instanceof Blob && !(e instanceof File), q = (...e) => {
}, ne = (e) => {
  e.width = 1, e.height = 1;
  const o = e.getContext("2d");
  o && o.clearRect(0, 0, 1, 1);
};
let W = null;
const pe = () => {
  if (W === null)
    if ("WebGL2RenderingContext" in window) {
      let e;
      try {
        e = $("canvas"), W = !!e.getContext("webgl2");
      } catch {
        W = !1;
      }
      e && ne(e), e = void 0;
    } else
      W = !1;
  return W;
}, Oe = (e, o) => pe() ? e.getContext("webgl2", o) : e.getContext("webgl", o) || e.getContext("experimental-webgl", o);
let k = null;
const Re = () => {
  if (k === null) {
    let e = $("canvas");
    k = !!Oe(e), ne(e), e = void 0;
  }
  return k;
}, he = () => Object.prototype.toString.call(window.operamini) === "[object OperaMini]", Ge = () => "Promise" in window, Ae = () => "URL" in window && "createObjectURL" in window.URL, Me = () => "visibilityState" in document, Se = () => "performance" in window, Le = () => "File" in window;
let z = null;
const ee = () => (z === null && (z = w() && // Can't run on Opera Mini due to lack of everything
!he() && // Require these APIs to feature detect a modern browser
Me() && Ge() && Le() && Ae() && Se()), z), Pe = (e) => {
  const { addFilter: o, utils: f, views: I } = e, { Type: s, createRoute: c } = f, { fileActionButton: h } = I, x = (({ parallel: i = 1, autoShift: n = !0 }) => {
    const r = [];
    let t = 0;
    const E = () => {
      if (!r.length)
        return g.oncomplete();
      t++, r.shift()(() => {
        t--, t < i && _();
      });
    }, _ = () => {
      for (let u = 0; u < i - t; u++)
        E();
    }, g = {
      queue: (u) => {
        r.push(u), n && _();
      },
      runJobs: _,
      oncomplete: () => {
      }
    };
    return g;
  })({ parallel: 1 }), v = (i) => i === null ? {} : i;
  o(
    "SHOULD_REMOVE_ON_REVERT",
    (i, { item: n, query: r }) => new Promise((t) => {
      const { file: E } = n, _ = r("GET_ALLOW_IMAGE_EDITOR") && r("GET_IMAGE_EDITOR_ALLOW_EDIT") && r("GET_IMAGE_EDITOR_SUPPORT_EDIT") && r("GET_IMAGE_EDITOR_SUPPORT_IMAGE")(E);
      t(!_);
    })
  ), o(
    "DID_LOAD_ITEM",
    (i, { query: n, dispatch: r }) => new Promise((t, E) => {
      if (i.origin > 1) {
        t(i);
        return;
      }
      const { file: _ } = i;
      if (!n("GET_ALLOW_IMAGE_EDITOR") || !n(
        "GET_IMAGE_EDITOR_INSTANT_EDIT"
      ) || !n("GET_IMAGE_EDITOR_SUPPORT_IMAGE")(_))
        return t(i);
      const g = () => {
        if (!b.length)
          return;
        const { item: p, resolve: m, reject: O } = b[0];
        r("EDIT_ITEM", {
          id: p.id,
          handleEditorResponse: u(p, m, O)
        });
      }, u = (p, m, O) => (G) => {
        b.shift(), G ? m(p) : O(p), r("KICK"), g();
      };
      oe({ item: i, resolve: t, reject: E }), b.length === 1 && g();
    })
  ), o("DID_CREATE_ITEM", (i, { query: n, dispatch: r }) => {
    i.getMetadata("color") && i.setMetadata("colors", i.getMetadata("color")), i.extend("edit", () => {
      r("EDIT_ITEM", { id: i.id });
    });
  });
  const b = [], oe = (i) => (b.push(i), i), re = (i) => {
    const { imageProcessor: n, imageReader: r, imageWriter: t } = v(
      i("GET_IMAGE_EDITOR")
    );
    return i("GET_IMAGE_EDITOR_WRITE_IMAGE") && i("GET_IMAGE_EDITOR_SUPPORT_WRITE_IMAGE") && n && r && t;
  }, ae = (i, n) => {
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
      imageReader: E,
      imageWriter: _,
      editorOptions: g,
      legacyDataToImageState: u,
      imageState: p
    } = v(i("GET_IMAGE_EDITOR"));
    if (!t)
      return;
    const [m, O] = E, [G = q, L] = _, P = n.file, A = n.getMetadata("imageState"), D = ae(i, {
      width: 512,
      height: 512
    }), U = {
      ...g,
      imageReader: m(O),
      imageWriter: G({
        // can optionally overwrite poster size
        ...L || {},
        // limit memory so poster is created quicker
        canvasMemoryLimit: D.width * D.height * 2,
        // apply legacy data if needed
        preprocessImageState: (M, S, K, N) => !A && u ? {
          ...M,
          ...u(void 0, N.size, {
            ...n.getMetadata()
          })
        } : M
      }),
      imageState: {
        ...p,
        ...A
      }
    };
    x.queue((M) => {
      t(P, U).then(({ dest: S }) => {
        n.setMetadata("poster", URL.createObjectURL(S), !0), M(), r();
      });
    });
  };
  o("CREATE_VIEW", (i) => {
    const { is: n, view: r, query: t } = i;
    if (!t("GET_ALLOW_IMAGE_EDITOR") || !t("GET_IMAGE_EDITOR_SUPPORT_WRITE_IMAGE"))
      return;
    const E = t("GET_ALLOW_FILE_POSTER");
    if (!(n("file-info") && !E || n("file") && E))
      return;
    const {
      createEditor: g,
      imageReader: u,
      imageWriter: p,
      editorOptions: m,
      legacyDataToImageState: O,
      imageState: G
    } = v(t("GET_IMAGE_EDITOR"));
    if (!u || !p || !m || !m.locale)
      return;
    delete m.imageReader, delete m.imageWriter;
    const [L, P] = u, A = (a) => {
      const { id: d } = a;
      return t("GET_ITEM", d);
    }, D = (a) => {
      if (!t("GET_ALLOW_FILE_POSTER"))
        return !1;
      const d = A(a);
      return d ? t("GET_FILE_POSTER_FILTER_ITEM")(d) ? !!d.getMetadata("poster") : !1 : void 0;
    }, U = ({ root: a, props: d, action: l }) => {
      const { handleEditorResponse: T } = l, R = A(d), Y = Q(R.file) || Z(R.file), Ee = Y ? R.file : R.source, C = g({
        ...m,
        imageReader: L(P),
        src: Ee
      });
      C.on("load", ({ size: V }) => {
        let F = R.getMetadata("imageState");
        !F && O && (F = O(C, V, R.getMetadata())), C.imageState = {
          ...G,
          ...F
        };
      }), C.on("process", ({ src: V, imageState: F }) => {
        Y || R.setFile(V), R.setMetadata("imageState", F), T && T(!0);
      }), C.on("close", () => {
        T && T(!1);
      });
    }, M = ({ root: a, props: d }) => {
      const { id: l } = d, T = t("GET_ITEM", l);
      if (!T)
        return;
      const R = T.file;
      t("GET_IMAGE_EDITOR_SUPPORT_IMAGE")(R) && (t("GET_ALLOW_FILE_POSTER") && !T.getMetadata("poster") && a.dispatch("REQUEST_CREATE_IMAGE_POSTER", { id: l }), !(!t("GET_IMAGE_EDITOR_ALLOW_EDIT") || !t("GET_IMAGE_EDITOR_SUPPORT_EDIT")) && S(a, d));
    }, S = (a, d) => {
      if (a.ref.handleEdit || (a.ref.handleEdit = (l) => {
        l.stopPropagation(), a.dispatch("EDIT_ITEM", { id: d.id });
      }), D(d)) {
        a.ref.editButton && a.ref.editButton.parentNode && a.ref.editButton.parentNode.removeChild(a.ref.editButton);
        const l = r.createChildView(h, {
          label: "edit",
          icon: t("GET_IMAGE_EDITOR_ICON_EDIT"),
          opacity: 0
        });
        l.element.classList.add("filepond--action-edit-item"), l.element.dataset.align = t(
          "GET_STYLE_IMAGE_EDITOR_BUTTON_EDIT_ITEM_POSITION"
        ), l.on("click", a.ref.handleEdit), a.ref.buttonEditItem = r.appendChildView(l);
      } else {
        a.ref.buttonEditItem && a.removeChildView(a.ref.buttonEditItem);
        const l = r.element.querySelector(".filepond--file-info-main"), T = document.createElement("button");
        T.className = "filepond--action-edit-item-alt", T.type = "button", T.innerHTML = t("GET_IMAGE_EDITOR_ICON_EDIT") + "<span>edit</span>", T.addEventListener("click", a.ref.handleEdit), l.appendChild(T), a.ref.editButton = T;
      }
    }, K = ({ root: a, props: d, action: l }) => {
      if (/imageState/.test(l.change.key) && t("GET_ALLOW_FILE_POSTER"))
        return a.dispatch("REQUEST_CREATE_IMAGE_POSTER", { id: d.id });
      /poster/.test(l.change.key) && (!t("GET_IMAGE_EDITOR_ALLOW_EDIT") || !t("GET_IMAGE_EDITOR_SUPPORT_EDIT") || S(a, d));
    };
    r.registerDestroyer(({ root: a }) => {
      a.ref.buttonEditItem && a.ref.buttonEditItem.off("click", a.ref.handleEdit), a.ref.editButton && a.ref.editButton.removeEventListener("click", a.ref.handleEdit);
    });
    const N = {
      EDIT_ITEM: U,
      DID_LOAD_ITEM: M,
      DID_UPDATE_ITEM_METADATA: K,
      DID_REMOVE_ITEM: ({ props: a }) => {
        const { id: d } = a, l = t("GET_ITEM", d);
        if (!l)
          return;
        const T = l.getMetadata("poster");
        T && URL.revokeObjectURL(T);
      },
      REQUEST_CREATE_IMAGE_POSTER: ({ root: a, props: d }) => J(a.query, A(d)),
      DID_FILE_POSTER_LOAD: void 0
    };
    if (E) {
      const a = ({ root: d }) => {
        d.ref.buttonEditItem && (d.ref.buttonEditItem.opacity = 1);
      };
      N.DID_FILE_POSTER_LOAD = a;
    }
    r.registerWriter(c(N));
  }), o(
    "SHOULD_PREPARE_OUTPUT",
    (i, { query: n, change: r, item: t }) => new Promise((E) => {
      if (!n("GET_IMAGE_EDITOR_SUPPORT_IMAGE")(t.file) || r && !/imageState/.test(r.key))
        return E(!1);
      E(!n("IS_ASYNC"));
    })
  );
  const se = (i, n, r) => new Promise((t) => {
    if (!re(i) || r.archived || !Q(n) && !Z(n) || !i("GET_IMAGE_EDITOR_SUPPORT_IMAGE")(n))
      return t(!1);
    me(n).then(() => {
      const E = i("GET_IMAGE_TRANSFORM_IMAGE_FILTER");
      if (E) {
        const _ = E(n);
        if (typeof _ == "boolean")
          return t(_);
        if (typeof _.then == "function")
          return _.then(t);
      }
      t(!0);
    }).catch(() => {
      const E = i("GET_IMAGE_EDITOR_SUPPORT_IMAGE_FORMAT");
      if (E && E(n)) {
        t(!0);
        return;
      }
      t(!1);
    });
  });
  return o("PREPARE_OUTPUT", (i, { query: n, item: r }) => {
    const t = (E) => new Promise((_, g) => {
      const u = () => {
        x.queue((p) => {
          const m = r.getMetadata("imageState"), {
            imageProcessor: O,
            imageReader: G,
            imageWriter: L,
            editorOptions: P,
            imageState: A
          } = v(n("GET_IMAGE_EDITOR"));
          if (!O || !G || !L || !P)
            return;
          const [D, U] = G, [M = q, S] = L;
          O(E, {
            ...P,
            imageReader: D(U),
            imageWriter: M(S),
            imageState: {
              ...A,
              ...m
            }
          }).then(_).catch(g).finally(p);
        });
      };
      n("GET_ALLOW_FILE_POSTER") && !r.getMetadata("poster") ? J(n, r, u) : u();
    });
    return new Promise((E) => {
      se(n, i, r).then((_) => {
        if (!_)
          return E(i);
        t(i).then((g) => {
          const u = n("GET_IMAGE_EDITOR_AFTER_WRITE_IMAGE");
          if (u)
            return Promise.resolve(u(g)).then(E);
          E(g.dest);
        });
      });
    });
  }), {
    options: {
      // enable or disable image editing
      allowImageEditor: [!0, s.BOOLEAN],
      // open editor when image is dropped
      imageEditorInstantEdit: [!1, s.BOOLEAN],
      // allow editing
      imageEditorAllowEdit: [!0, s.BOOLEAN],
      // cannot edit if no WebGL or is <=IE11
      imageEditorSupportEdit: [
        w() && ee() && Re(),
        s.BOOLEAN
      ],
      // receives file and should return true if can edit
      imageEditorSupportImage: [te, s.FUNCTION],
      // receives file, should return true if can be loaded with Pintura
      imageEditorSupportImageFormat: [null, s.FUNCTION],
      // cannot write if is <= IE11
      imageEditorSupportWriteImage: [ee(), s.BOOLEAN],
      // should output image
      imageEditorWriteImage: [!0, s.BOOLEAN],
      // receives written image and can return single or more images
      imageEditorBeforeOpenImage: [void 0, s.FUNCTION],
      // receives written image and can return single or more images
      imageEditorAfterWriteImage: [void 0, s.FUNCTION],
      // editor object
      imageEditor: [null, s.OBJECT],
      // the icon to use for the edit button
      imageEditorIconEdit: [
        '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M8.5 17h1.586l7-7L15.5 8.414l-7 7V17zm-1.707-2.707l8-8a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-8 8A1 1 0 0 1 10.5 19h-3a1 1 0 0 1-1-1v-3a1 1 0 0 1 .293-.707z" fill="currentColor" fill-rule="nonzero"/></svg>',
        s.STRING
      ],
      // location of processing button
      styleImageEditorButtonEditItemPosition: ["bottom center", s.STRING]
    }
  };
};
w() && document.dispatchEvent(new CustomEvent("FilePond:pluginloaded", { detail: Pe }));
export {
  Pe as default
};
