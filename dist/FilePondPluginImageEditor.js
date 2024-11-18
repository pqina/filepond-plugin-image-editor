const Q = (e) => e instanceof File, te = (e) => /^image/.test(e.type), ie = (e) => typeof e == "string";
function de(e, o) {
  o.split(";").forEach((f) => {
    const [_, s] = f.split(":");
    if (!_.length || !s)
      return;
    const [c, h] = s.split("!important");
    e.style.setProperty(_, c, ie(h) ? "important" : void 0);
  });
}
const $ = (e, o, f = []) => {
  const _ = document.createElement(e), s = Object.getOwnPropertyDescriptors(_.__proto__);
  for (const c in o)
    c === "style" ? de(_, o[c]) : s[c] && s[c].set || /textContent|innerHTML/.test(c) || typeof o[c] == "function" ? _[c] = o[c] : _.setAttribute(c, o[c]);
  return f.forEach((c) => _.appendChild(c)), _;
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
const _e = (e) => (le(B, e), B.parentNode || document.body.append(B), clearTimeout(X), X = setTimeout(() => {
  B.remove();
}, 500), e);
let H = null;
const Ie = () => (H === null && (H = w() && /^((?!chrome|android).)*(safari|iphone|ipad)/i.test(navigator.userAgent)), H), Te = (e) => new Promise((o, f) => {
  let _ = !1;
  !e.parentNode && Ie() && (_ = !0, e.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;left:0;top:0;width:0;height:0;", _e(e));
  const s = () => {
    const h = e.naturalWidth, y = e.naturalHeight;
    h && y && (_ && e.remove(), clearInterval(c), o({ width: h, height: y }));
  };
  e.onerror = (h) => {
    clearInterval(c), f(h);
  };
  const c = setInterval(s, 1);
  s();
}), ue = (e) => new Promise((o, f) => {
  const _ = () => {
    o({
      width: e.videoWidth,
      height: e.videoHeight
    });
  };
  if (e.readyState >= 1)
    return _();
  e.onloadedmetadata = _, e.onerror = () => f(e.error);
}), fe = (e) => new Promise((o) => {
  const f = ie(e) ? e : URL.createObjectURL(e), _ = () => {
    const c = new Image();
    c.src = f, o(c);
  };
  if (e instanceof Blob && te(e))
    return _();
  const s = document.createElement("video");
  s.preload = "metadata", s.onloadedmetadata = () => o(s), s.onerror = _, s.src = f;
}), ge = (e) => e.nodeName === "VIDEO", me = async (e) => {
  let o;
  e.src ? o = e : o = await fe(e);
  let f;
  try {
    f = ge(o) ? await ue(o) : await Te(o);
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
}, he = () => Object.prototype.toString.call(window.operamini) === "[object OperaMini]", Ge = () => "Promise" in window, Ae = () => "URL" in window && "createObjectURL" in window.URL, Me = () => "visibilityState" in document, Le = () => "performance" in window, Se = () => "File" in window;
let z = null;
const ee = () => (z === null && (z = w() && // Can't run on Opera Mini due to lack of everything
!he() && // Require these APIs to feature detect a modern browser
Me() && Ge() && Se() && Ae() && Le()), z), Pe = (e) => {
  const { addFilter: o, utils: f, views: _ } = e, { Type: s, createRoute: c } = f, { fileActionButton: h } = _, x = (({ parallel: i = 1, autoShift: n = !0 }) => {
    const r = [];
    let t = 0;
    const E = () => {
      if (!r.length)
        return g.oncomplete();
      t++, r.shift()(() => {
        t--, t < i && I();
      });
    }, I = () => {
      for (let T = 0; T < i - t; T++)
        E();
    }, g = {
      queue: (T) => {
        r.push(T), n && I();
      },
      runJobs: I,
      oncomplete: () => {
      }
    };
    return g;
  })({ parallel: 1 }), v = (i) => i === null ? {} : i;
  o(
    "SHOULD_REMOVE_ON_REVERT",
    (i, { item: n, query: r }) => new Promise((t) => {
      const { file: E } = n, I = r("GET_ALLOW_IMAGE_EDITOR") && r("GET_IMAGE_EDITOR_ALLOW_EDIT") && r("GET_IMAGE_EDITOR_SUPPORT_EDIT") && r("GET_IMAGE_EDITOR_SUPPORT_IMAGE")(E);
      t(!I);
    })
  ), o(
    "DID_LOAD_ITEM",
    (i, { query: n, dispatch: r }) => new Promise((t, E) => {
      if (i.origin > 1) {
        t(i);
        return;
      }
      const { file: I } = i;
      if (!n("GET_ALLOW_IMAGE_EDITOR") || !n(
        "GET_IMAGE_EDITOR_INSTANT_EDIT"
      ) || !n("GET_IMAGE_EDITOR_SUPPORT_IMAGE")(I))
        return t(i);
      const g = () => {
        if (!b.length)
          return;
        const { item: p, resolve: m, reject: O } = b[0];
        r("EDIT_ITEM", {
          id: p.id,
          handleEditorResponse: T(p, m, O)
        });
      }, T = (p, m, O) => (G) => {
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
      imageWriter: I,
      editorOptions: g,
      legacyDataToImageState: T,
      imageState: p
    } = v(i("GET_IMAGE_EDITOR"));
    if (!t)
      return;
    const [m, O] = E, [G = q, S] = I, P = n.file, A = n.getMetadata("imageState"), D = ae(i, {
      width: 512,
      height: 512
    }), U = {
      ...g,
      imageReader: m(O),
      imageWriter: G({
        // can optionally overwrite poster size
        ...S || {},
        // limit memory so poster is created quicker
        canvasMemoryLimit: D.width * D.height * 2,
        // apply legacy data if needed
        preprocessImageState: (M, L, K, N) => !A && T ? {
          ...M,
          ...T(void 0, N.size, {
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
      t(P, U).then(({ dest: L }) => {
        n.setMetadata("poster", URL.createObjectURL(L), !0), M(), r();
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
      imageReader: T,
      imageWriter: p,
      editorOptions: m,
      legacyDataToImageState: O,
      imageState: G
    } = v(t("GET_IMAGE_EDITOR"));
    if (!T || !p || !m || !m.locale)
      return;
    delete m.imageReader, delete m.imageWriter;
    const [S, P] = T, A = (a) => {
      const { id: d } = a;
      return t("GET_ITEM", d);
    }, D = (a) => {
      if (!t("GET_ALLOW_FILE_POSTER"))
        return !1;
      const d = A(a);
      return d ? t("GET_FILE_POSTER_FILTER_ITEM")(d) ? !!d.getMetadata("poster") : !1 : void 0;
    }, U = ({ root: a, props: d, action: l }) => {
      const { handleEditorResponse: u } = l, R = A(d), Y = Q(R.file) || Z(R.file), Ee = Y ? R.file : R.source, C = g({
        ...m,
        imageReader: S(P),
        src: Ee
      });
      C.on("load", ({ size: V }) => {
        let F = R.getMetadata("imageState");
        !F && O && (F = O(C, V, R.getMetadata())), C.imageState = {
          ...G,
          ...F
        };
      }), C.on("process", ({ src: V, imageState: F }) => {
        Y || R.setFile(V), R.setMetadata("imageState", F), u && u(!0);
      }), C.on("close", () => {
        u && u(!1);
      });
    }, M = ({ root: a, props: d }) => {
      const { id: l } = d, u = t("GET_ITEM", l);
      if (!u)
        return;
      const R = u.file;
      t("GET_IMAGE_EDITOR_SUPPORT_IMAGE")(R) && (t("GET_ALLOW_FILE_POSTER") && !u.getMetadata("poster") && a.dispatch("REQUEST_CREATE_IMAGE_POSTER", { id: l }), !(!t("GET_IMAGE_EDITOR_ALLOW_EDIT") || !t("GET_IMAGE_EDITOR_SUPPORT_EDIT")) && L(a, d));
    }, L = (a, d) => {
      if (a.ref.handleEdit || (a.ref.handleEdit = (l) => {
        l.stopPropagation(), a.dispatch("EDIT_ITEM", { id: d.id });
      }), D(d)) {
        a.ref.editButton && a.ref.editButton.parentNode && a.ref.editButton.parentNode.removeChild(a.ref.editButton);
        const l = r.createChildView(h, {
          label: t("GET_IMAGE_EDITOR_LABEL_EDIT"),
          icon: t("GET_IMAGE_EDITOR_ICON_EDIT"),
          opacity: 0
        });
        l.element.classList.add("filepond--action-edit-item"), l.element.dataset.align = t(
          "GET_STYLE_IMAGE_EDITOR_BUTTON_EDIT_ITEM_POSITION"
        ), l.on("click", a.ref.handleEdit), a.ref.buttonEditItem = r.appendChildView(l);
      } else {
        a.ref.buttonEditItem && a.removeChildView(a.ref.buttonEditItem);
        const l = r.element.querySelector(".filepond--file-info-main"), u = document.createElement("button");
        u.className = "filepond--action-edit-item-alt", u.type = "button", u.innerHTML = t("GET_IMAGE_EDITOR_ICON_EDIT") + "<span>" + t("GET_IMAGE_EDITOR_LABEL_EDIT") + "</span>", u.addEventListener("click", a.ref.handleEdit), l.appendChild(u), a.ref.editButton = u;
      }
    }, K = ({ root: a, props: d, action: l }) => {
      if (/imageState/.test(l.change.key) && t("GET_ALLOW_FILE_POSTER"))
        return a.dispatch("REQUEST_CREATE_IMAGE_POSTER", { id: d.id });
      /poster/.test(l.change.key) && (!t("GET_IMAGE_EDITOR_ALLOW_EDIT") || !t("GET_IMAGE_EDITOR_SUPPORT_EDIT") || L(a, d));
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
        const u = l.getMetadata("poster");
        u && URL.revokeObjectURL(u);
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
        const I = E(n);
        if (typeof I == "boolean")
          return t(I);
        if (typeof I.then == "function")
          return I.then(t);
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
    const t = (E) => new Promise((I, g) => {
      const T = () => {
        x.queue((p) => {
          const m = r.getMetadata("imageState"), {
            imageProcessor: O,
            imageReader: G,
            imageWriter: S,
            editorOptions: P,
            imageState: A
          } = v(n("GET_IMAGE_EDITOR"));
          if (!O || !G || !S || !P)
            return;
          const [D, U] = G, [M = q, L] = S;
          O(E, {
            ...P,
            imageReader: D(U),
            imageWriter: M(L),
            imageState: {
              ...A,
              ...m
            }
          }).then(I).catch(g).finally(p);
        });
      };
      n("GET_ALLOW_FILE_POSTER") && !r.getMetadata("poster") ? J(n, r, T) : T();
    });
    return new Promise((E) => {
      se(n, i, r).then((I) => {
        if (!I)
          return E(i);
        t(i).then((g) => {
          const T = n("GET_IMAGE_EDITOR_AFTER_WRITE_IMAGE");
          if (T)
            return Promise.resolve(T(g)).then(E);
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
      // the icon to use for the edit button
      imageEditorLabelEdit: ["edit", s.STRING],
      // location of processing button
      styleImageEditorButtonEditItemPosition: ["bottom center", s.STRING]
    }
  };
};
w() && document.dispatchEvent(new CustomEvent("FilePond:pluginloaded", { detail: Pe }));
export {
  Pe as default
};
