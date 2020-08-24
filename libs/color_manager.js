const mgColorManager = function () {
  function e(e, t, n) {
    var e = parseInt(("" + e).replace(/\s/g, ""), 10),
      t = parseInt(("" + t).replace(/\s/g, ""), 10),
      n = parseInt(("" + n).replace(/\s/g, ""), 10);
    e /= 255,
      t /= 255,
      n /= 255;
    var i, a, o, r = Math.min(e, Math.min(t, n)),
      s = Math.max(e, Math.max(t, n)),
      c = e == r ? t - n : n == r ? e - t : n - e,
      d = e == r ? 3 : n == r ? 1 : 5;
    return i = 60 * (d - c / (s - r)),
      a = (s - r) / s,
      o = s,
      [i, a, o]
  }

  function t(e) {
    var t = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    e = e.replace(t,
      function (e, t, n, i) {
        return t + t + n + n + i + i
      });
    var n = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    return n ? {
      r: parseInt(n[1], 16),
      g: parseInt(n[2], 16),
      b: parseInt(n[3], 16)
    } : null
  }

  function n(e, t, n) {
    return .299 * parseInt(e) + .587 * parseInt(t) + .114 * parseInt(n)
  }

  function i(e, t, n) {
    function i(e) {
      var t = Math.floor(255 * e).toString(16);
      return t.length < 2 && (t = "0" + t),
        t
    }
    var a = t * n,
      o = Math.abs(e / 60 % 2 - 1),
      r = a * (1 - o),
      s = n - a,
      c = 0,
      d = 0,
      l = 0;
    return e >= 0 && 60 > e ? (c = a, d = r) : e >= 60 && 120 > e ? (c = r, d = a) : e >= 120 && 180 > e ? (l = r, d = a) : e >= 180 && 240 > e ? (d = r, l = a) : e >= 240 && 300 > e ? (c = r, l = a) : e >= 300 && 360 > e && (l = r, c = a),
      "#" + i(c + s) + i(d + s) + i(l + s)
  }
  var a = "#ffffff",
    o = {};
  return {
    setColor: function (n) {
      a = n;
      var i = t(n);
      o.R = i.r,
        o.G = i.g,
        o.B = i.b;
      var r = e(o.R, o.G, o.B);
      o.H = Math.floor(r[0]),
        o.S = Math.floor(100 * r[1]),
        o.V = Math.floor(100 * r[2])
    },
    getHSV2RGB: function (e) {
      return e ? i(e[0], e[1], e[2]) : i(o.H, o.S / 100, o.V / 100)
    },
    getColorVal: function (i, a) {
      var o = t(i),
        r = {};
      r.R = o.r,
        r.G = o.g,
        r.B = o.b;
      var s = e(r.R, r.G, r.B);
      return r.H = Math.floor(s[0]),
        r.S = Math.floor(100 * s[1]),
        r.V = Math.floor(100 * s[2]),
        r.GY = n(r.R, r.G, r.B),
        r[a]
    },
    getColorGroup: function () {
      var e = o.S / 100,
        t = o.V / 100,
        n = a,
        r = i(o.H, e - .08 > 0 ? e - .08 : 0, 1 > t - 0 + .09 ? t - 0 + .09 : 1),
        s = i(o.H, e - .07 > 0 ? e + .07 : 0, t - .06 > 0 ? t - .06 : 0),
        c = i(o.H, 1 > e + .04 ? e + .04 : 1, t - .36 > 0 ? t - .36 : 0);
      return s = i(o.H, .52, .59), {
        BK: n,
        BKH: r,
        SD: s,
        BD: c
      }
    }
  }
}()

module.exports = {
  mgColorManager: mgColorManager
}
