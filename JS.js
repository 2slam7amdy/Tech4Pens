! function(t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? module.exports = e() : t.Headroom = e()
}(this, function() {
    "use strict";

    function t(t) {
        this.callback = t, this.ticking = !1
    }

    function i(t, e) {
        var n;
        e = function t(e) {
            if (arguments.length <= 0) throw new Error("Missing arguments in extend function");
            var n, i, o, s = e || {};
            for (i = 1; i < arguments.length; i++) {
                var r = arguments[i] || {};
                for (n in r) "object" != typeof s[n] || (o = s[n]) && "undefined" != typeof window && (o === window || o.nodeType) ? s[n] = s[n] || r[n] : s[n] = t(s[n], r[n])
            }
            return s
        }(e, i.options), this.lastKnownScrollY = 0, this.elem = t, this.tolerance = (n = e.tolerance) === Object(n) ? n : {
            down: n,
            up: n
        }, this.classes = e.classes, this.offset = e.offset, this.scroller = e.scroller, this.initialised = !1, this.onPin = e.onPin, this.onUnpin = e.onUnpin, this.onTop = e.onTop, this.onNotTop = e.onNotTop, this.onBottom = e.onBottom, this.onNotBottom = e.onNotBottom
    }
    var e = {
        bind: !! function() {}.bind,
        classList: "classList" in document.documentElement,
        rAF: !!(window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame)
    };
    return window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame, t.prototype = {
        constructor: t,
        update: function() {
            this.callback && this.callback(), this.ticking = !1
        },
        requestTick: function() {
            this.ticking || (requestAnimationFrame(this.rafCallback || (this.rafCallback = this.update.bind(this))), this.ticking = !0)
        },
        handleEvent: function() {
            this.requestTick()
        }
    }, i.prototype = {
        constructor: i,
        init: function() {
            return i.cutsTheMustard ? (this.debouncer = new t(this.update.bind(this)), this.elem.classList.add(this.classes.initial), setTimeout(this.attachEvent.bind(this), 100), this) : void 0
        },
        destroy: function() {
            var t = this.classes;
            this.initialised = !1, this.elem.classList.remove(t.unpinned, t.pinned, t.top, t.notTop, t.initial), this.scroller.removeEventListener("scroll", this.debouncer, !1)
        },
        attachEvent: function() {
            this.initialised || (this.lastKnownScrollY = this.getScrollY(), this.initialised = !0, this.scroller.addEventListener("scroll", this.debouncer, !1), this.debouncer.handleEvent())
        },
        unpin: function() {
            var t = this.elem.classList,
                e = this.classes;
            !t.contains(e.pinned) && t.contains(e.unpinned) || (t.add(e.unpinned), t.remove(e.pinned), this.onUnpin && this.onUnpin.call(this))
        },
        pin: function() {
            var t = this.elem.classList,
                e = this.classes;
            t.contains(e.unpinned) && (t.remove(e.unpinned), t.add(e.pinned), this.onPin && this.onPin.call(this))
        },
        top: function() {
            var t = this.elem.classList,
                e = this.classes;
            t.contains(e.top) || (t.add(e.top), t.remove(e.notTop), this.onTop && this.onTop.call(this))
        },
        notTop: function() {
            var t = this.elem.classList,
                e = this.classes;
            t.contains(e.notTop) || (t.add(e.notTop), t.remove(e.top), this.onNotTop && this.onNotTop.call(this))
        },
        bottom: function() {
            var t = this.elem.classList,
                e = this.classes;
            t.contains(e.bottom) || (t.add(e.bottom), t.remove(e.notBottom), this.onBottom && this.onBottom.call(this))
        },
        notBottom: function() {
            var t = this.elem.classList,
                e = this.classes;
            t.contains(e.notBottom) || (t.add(e.notBottom), t.remove(e.bottom), this.onNotBottom && this.onNotBottom.call(this))
        },
        getScrollY: function() {
            return void 0 !== this.scroller.pageYOffset ? this.scroller.pageYOffset : void 0 !== this.scroller.scrollTop ? this.scroller.scrollTop : (document.documentElement || document.body.parentNode || document.body).scrollTop
        },
        getViewportHeight: function() {
            return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        },
        getElementPhysicalHeight: function(t) {
            return Math.max(t.offsetHeight, t.clientHeight)
        },
        getScrollerPhysicalHeight: function() {
            return this.scroller === window || this.scroller === document.body ? this.getViewportHeight() : this.getElementPhysicalHeight(this.scroller)
        },
        getDocumentHeight: function() {
            var t = document.body,
                e = document.documentElement;
            return Math.max(t.scrollHeight, e.scrollHeight, t.offsetHeight, e.offsetHeight, t.clientHeight, e.clientHeight)
        },
        getElementHeight: function(t) {
            return Math.max(t.scrollHeight, t.offsetHeight, t.clientHeight)
        },
        getScrollerHeight: function() {
            return this.scroller === window || this.scroller === document.body ? this.getDocumentHeight() : this.getElementHeight(this.scroller)
        },
        isOutOfBounds: function(t) {
            var e = t < 0,
                n = t + this.getScrollerPhysicalHeight() > this.getScrollerHeight();
            return e || n
        },
        toleranceExceeded: function(t, e) {
            return Math.abs(t - this.lastKnownScrollY) >= this.tolerance[e]
        },
        shouldUnpin: function(t, e) {
            var n = t > this.lastKnownScrollY,
                i = t >= this.offset;
            return n && i && e
        },
        shouldPin: function(t, e) {
            var n = t < this.lastKnownScrollY,
                i = t <= this.offset;
            return n && e || i
        },
        update: function() {
            var t = this.getScrollY(),
                e = t > this.lastKnownScrollY ? "down" : "up",
                n = this.toleranceExceeded(t, e);
            this.isOutOfBounds(t) || (t <= this.offset ? this.top() : this.notTop(), t + this.getViewportHeight() >= this.getScrollerHeight() ? this.bottom() : this.notBottom(), this.shouldUnpin(t, n) ? this.unpin() : this.shouldPin(t, n) && this.pin(), this.lastKnownScrollY = t)
        }
    }, i.options = {
        tolerance: {
            up: 0,
            down: 0
        },
        offset: 0,
        scroller: window,
        classes: {
            pinned: "XenGenTr-head--pinned",
            unpinned: "XenGenTr-head--unpinned",
            top: "XenGenTr-head--top",
            notTop: "XenGenTr-head--not-top",
            bottom: "XenGenTr-head--bottom",
            notBottom: "XenGenTr--not-bottom",
            initial: "XenGenTrhead"
        }
    }, i.cutsTheMustard = void 0 !== e && e.rAF && e.bind && e.classList, i
}),
function() {
    var c = /\blang(?:uage)?-(?!\*)(\w+)\b/i,
        y = self.Prism = {
            util: {
                type: function(t) {
                    return Object.prototype.toString.call(t).match(/\[object (\w+)\]/)[1]
                },
                clone: function(t) {
                    switch (y.util.type(t)) {
                        case "Object":
                            var e = {};
                            for (var n in t) t.hasOwnProperty(n) && (e[n] = y.util.clone(t[n]));
                            return e;
                        case "Array":
                            return t.slice()
                    }
                    return t
                }
            },
            languages: {
                extend: function(t, e) {
                    var n = y.util.clone(y.languages[t]);
                    for (var i in e) n[i] = e[i];
                    return n
                },
                insertBefore: function(t, e, n, i) {
                    var o = (i = i || y.languages)[t],
                        s = {};
                    for (var r in o)
                        if (o.hasOwnProperty(r)) {
                            if (r == e)
                                for (var a in n) n.hasOwnProperty(a) && (s[a] = n[a]);
                            s[r] = o[r]
                        } return i[t] = s
                },
                DFS: function(t, e) {
                    for (var n in t) e.call(t, n, t[n]), "Object" === y.util.type(t) && y.languages.DFS(t[n], e)
                }
            },
            highlightAll: function(t, e) {
                for (var n, i = document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'), o = 0; n = i[o++];) y.highlightElement(n, !0 === t, e)
            },
            highlightElement: function(t, e, n) {
                for (var i, o, s = t; s && !c.test(s.className);) s = s.parentNode;
                if (s && (i = (s.className.match(c) || [, ""])[1], o = y.languages[i]), o) {
                    t.className = t.className.replace(c, "").replace(/\s+/g, " ") + " language-" + i, s = t.parentNode, /pre/i.test(s.nodeName) && (s.className = s.className.replace(c, "").replace(/\s+/g, " ") + " language-" + i);
                    var r = t.textContent;
                    if (r) {
                        r = r.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
                        var a = {
                            element: t,
                            language: i,
                            grammar: o,
                            code: r
                        };
                        if (y.hooks.run("before-highlight", a), e && self.Worker) {
                            var l = new Worker(y.filename);
                            l.onmessage = function(t) {
                                a.highlightedCode = h.stringify(JSON.parse(t.data), i), y.hooks.run("before-insert", a), a.element.innerHTML = a.highlightedCode, n && n.call(a.element), y.hooks.run("after-highlight", a)
                            }, l.postMessage(JSON.stringify({
                                language: a.language,
                                code: a.code
                            }))
                        } else a.highlightedCode = y.highlight(a.code, a.grammar, a.language), y.hooks.run("before-insert", a), a.element.innerHTML = a.highlightedCode, n && n.call(t), y.hooks.run("after-highlight", a)
                    }
                }
            },
            highlight: function(t, e, n) {
                return h.stringify(y.tokenize(t, e), n)
            },
            tokenize: function(t, e, n) {
                var i = y.Token,
                    o = [t],
                    s = e.rest;
                if (s) {
                    for (var r in s) e[r] = s[r];
                    delete e.rest
                }
                t: for (var r in e)
                    if (e.hasOwnProperty(r) && e[r]) {
                        var a = e[r],
                            l = a.inside,
                            c = !!a.lookbehind,
                            h = 0;
                        a = a.pattern || a;
                        for (var u = 0; u < o.length; u++) {
                            var g = o[u];
                            if (o.length > t.length) break t;
                            if (!(g instanceof i))
                                if (a.lastIndex = 0, d = a.exec(g)) {
                                    c && (h = d[1].length);
                                    var d, p = d.index - 1 + h,
                                        m = p + (d = d[0].slice(h)).length,
                                        f = g.slice(0, p + 1),
                                        w = g.slice(m + 1),
                                        v = [u, 1];
                                    f && v.push(f);
                                    var b = new i(r, l ? y.tokenize(d, l) : d);
                                    v.push(b), w && v.push(w), Array.prototype.splice.apply(o, v)
                                }
                        }
                    }
                return o
            },
            hooks: {
                all: {},
                add: function(t, e) {
                    var n = y.hooks.all;
                    n[t] = n[t] || [], n[t].push(e)
                },
                run: function(t, e) {
                    var n = y.hooks.all[t];
                    if (n && n.length)
                        for (var i, o = 0; i = n[o++];) i(e)
                }
            }
        },
        h = y.Token = function(t, e) {
            this.type = t, this.content = e
        };
    if (h.stringify = function(e, n, t) {
            if ("string" == typeof e) return e;
            if ("[object Array]" == Object.prototype.toString.call(e)) return e.map(function(t) {
                return h.stringify(t, n, e)
            }).join("");
            var i = {
                type: e.type,
                content: h.stringify(e.content, n, t),
                tag: "span",
                classes: ["token", e.type],
                attributes: {},
                language: n,
                parent: t
            };
            "comment" == i.type && (i.attributes.spellcheck = "true"), y.hooks.run("wrap", i);
            var o = "";
            for (var s in i.attributes) o += s + '="' + (i.attributes[s] || "") + '"';
            return "<" + i.tag + ' class="' + i.classes.join(" ") + '" ' + o + ">" + i.content + "</" + i.tag + ">"
        }, self.document) {
        var t = document.getElementsByTagName("script");
        (t = t[t.length - 1]) && (y.filename = t.src, document.addEventListener && !t.hasAttribute("data-manual") && document.addEventListener("DOMContentLoaded", y.highlightAll))
    } else self.addEventListener("message", function(t) {
        var e = JSON.parse(t.data),
            n = e.language,
            i = e.code;
        self.postMessage(JSON.stringify(y.tokenize(i, y.languages[n]))), self.close()
    }, !1)
}(), Prism.languages.markup = {
        comment: /&lt;!--[\w\W]*?-->/g,
        prolog: /&lt;\?.+?\?>/,
        doctype: /&lt;!DOCTYPE.+?>/,
        cdata: /&lt;!\[CDATA\[[\w\W]*?]]>/i,
        tag: {
            pattern: /&lt;\/?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|\w+))?\s*)*\/?>/gi,
            inside: {
                tag: {
                    pattern: /^&lt;\/?[\w:-]+/i,
                    inside: {
                        punctuation: /^&lt;\/?/,
                        namespace: /^[\w-]+?:/
                    }
                },
                "attr-value": {
                    pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/gi,
                    inside: {
                        punctuation: /=|>|"/g
                    }
                },
                punctuation: /\/?>/g,
                "attr-name": {
                    pattern: /[\w:-]+/g,
                    inside: {
                        namespace: /^[\w-]+?:/
                    }
                }
            }
        },
        entity: /&amp;#?[\da-z]{1,8};/gi
    }, Prism.hooks.add("wrap", function(t) {
        "entity" === t.type && (t.attributes.title = t.content.replace(/&amp;/, "&"))
    }), Prism.languages.css = {
        comment: /\/\*[\w\W]*?\*\//g,
        atrule: {
            pattern: /@[\w-]+?.*?(;|(?=\s*{))/gi,
            inside: {
                punctuation: /[;:]/g
            }
        },
        url: /url\((["']?).*?\1\)/gi,
        selector: /[^\{\}\s][^\{\};]*(?=\s*\{)/g,
        property: /(\b|\B)[\w-]+(?=\s*:)/gi,
        string: /("|')(\\?.)*?\1/g,
        important: /\B!important\b/gi,
        ignore: /&(lt|gt|amp);/gi,
        punctuation: /[\{\};:]/g
    }, Prism.languages.markup && Prism.languages.insertBefore("markup", "tag", {
        style: {
            pattern: /(&lt;|<)style[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/style(>|&gt;)/gi,
            inside: {
                tag: {
                    pattern: /(&lt;|<)style[\w\W]*?(>|&gt;)|(&lt;|<)\/style(>|&gt;)/gi,
                    inside: Prism.languages.markup.tag.inside
                },
                rest: Prism.languages.css
            }
        }
    }), Prism.languages.clike = {
        comment: {
            pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|(^|[^:])\/\/.*?(\r?\n|$))/g,
            lookbehind: !0
        },
        string: /("|')(\\?.)*?\1/g,
        "class-name": {
            pattern: /((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/gi,
            lookbehind: !0,
            inside: {
                punctuation: /(\.|\\)/
            }
        },
        keyword: /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/g,
        boolean: /\b(true|false)\b/g,
        function: {
            pattern: /[a-z0-9_]+\(/gi,
            inside: {
                punctuation: /\(/
            }
        },
        number: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,
        operator: /[-+]{1,2}|!|&lt;=?|>=?|={1,3}|(&amp;){1,2}|\|?\||\?|\*|\/|\~|\^|\%/g,
        ignore: /&(lt|gt|amp);/gi,
        punctuation: /[{}[\];(),.:]/g
    }, Prism.languages.javascript = Prism.languages.extend("clike", {
        keyword: /\b(var|let|if|else|while|do|for|return|in|instanceof|function|new|with|typeof|try|throw|catch|finally|null|break|continue)\b/g,
        number: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?|NaN|-?Infinity)\b/g
    }), Prism.languages.insertBefore("javascript", "keyword", {
        regex: {
            pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g,
            lookbehind: !0
        }
    }), Prism.languages.markup && Prism.languages.insertBefore("markup", "tag", {
        script: {
            pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/script(>|&gt;)/gi,
            inside: {
                tag: {
                    pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)|(&lt;|<)\/script(>|&gt;)/gi,
                    inside: Prism.languages.markup.tag.inside
                },
                rest: Prism.languages.javascript
            }
        }
    }),
    function() {
        function t(t) {
            this.strategies = t
        }
        t.prototype = {
            constructor: t,
            init: function() {
                this.elements = document.querySelectorAll("[data-code-generator]")
            },
            generate: function(e) {
                var n = this;
                [].forEach.call(this.elements, function(t) {
                    n.highlightElement(t, e)
                })
            },
            getStrategy: function(t) {
                return this.strategies[t.getAttribute("data-code-generator")]
            },
            highlightElement: function(t, e) {
                var n = this.getStrategy(t),
                    i = t.querySelector("code");
                n && (i.innerHTML = n(e), Prism.highlightElement(i, !1))
            }
        }, window.CodeGenerator = t
    }(),
    function(e) {
        function t(t, e, n) {
            this.form = t, this.codeGenerator = e, this.getOptions = n
        }
        t.prototype = {
            constructor: t,
            init: function() {
                var t = this.form;
                return t && (this.codeGenerator.init(), this.process(), t.addEventListener("change", this, !1)), this
            },
            process: function() {
                var t = this.getOptions(this.form);
                this.headroom && this.headroom.destroy(), this.headroom = new Headroom(e.querySelector("header"), t).init(), this.codeGenerator.generate(t)
            },
            handleEvent: function() {
                this.process()
            },
            destroy: function() {
                this.form.removeEventListener("change", this)
            }
        }
    }(document);
