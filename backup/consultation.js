var consultationBlock = {
  'q1': {
    type: 'question',
    text: 'Hello!',
    next: 'q2'
  },
  'q2': {
    type: 'question',
    text: 'Welcome to our awesome website!',
    next: 'q3'
  },
  'q3': {
    type: 'question',
    text: 'Would you like to hire Vivify Ideas for your next project, or would you like to know us a bit better?',
    next: 'c1'
  },
  'c1': {
    type: 'choose',
    answers: [{
      'text': 'I want to hire you guys.',
      'next': 'q4'
    }, {
      'text': 'I want to know you better first! 🖐',
      'next': 'q5'
    }]
  },
  'q4': {
    type: 'question',
    text: 'What kind of project do you have in mind?',
    next: 'c2'
  },
  'q5': {
    type: 'question',
    text: 'Vivify Ideas is an outsourcing web application development company founded in 2013 by experienced and highly motivated software engineers.',
    next: 'q6'
  },
  'c2': {
    type: 'choose',
    answers: [{
      'text': 'Website.',
      'next': 'q10'
    }, {
      'text': 'IOS application.',
      'next': 'q11'
    }]
  },
  'q6': {
    type: 'question',
    text: 'The company was established with a single-minded devotion to the goal of achieving continual quality.',
    next: 'q7'
  },
  'q7': {
    type: 'question',
    text: 'We are giving the best of us to deliver the highest possible business value while constantly improving our knowledge, deepening team connections and embracing changes.',
    next: 'q8'
  },
  'q8': {
    type: 'question',
    text: 'We grow, we move fast forward thanks to creative talent and dedicated work.',
    next: 'q9'
  },
  'q9': {
    type: 'question',
    text: 'So, would you like to hire Vivify Ideas for your next project?',
    next: 'c3'
  },
  'c3': {
    type: 'choose',
    answers: [{
      'text': 'Yes!',
      'next': 'q4'
    }, {
      'text': 'No. I\'m done.',
      'next': 'byebye2'
    }]
  },
  'q10': {
    type: 'question',
    text: 'Ok, what kind of website?',
    next: 'c4'
  },
  'c4': {
    type: 'choose',
    answers: [{
      'text': 'Personal website.',
      'next': 'byebye1'
    }, {
      'text': 'Single page application.',
      'next': 'byebye1'
    }, {
      'text': 'Company website.',
      'next': 'byebye1'
    }, {
      'text': 'Something else...',
      'next': 'q12'
    }]
  },
  'q11': {
    type: 'question',
    text: 'Ok, what kind of application?',
    next: 'w1'
  },
  'w1': {
    type: 'write',
    next: 'byebye1'
  },
  'q12': {
    type: 'question',
    text: 'What kind of website do you have in mind?',
    next: 'w1'
  },
  'byebye1': {
    type: 'question',
    text: 'Thank you for consulting us. ☕️ Have a great day! 🙌',
    next: 'end'
  },
  'byebye2': {
    type: 'question',
    text: 'Thanks for this! ☕️ Have a great day! 🙌',
    next: 'end'
  },
  'end': {
    type: 'consultationCompleted',
  }
};

function _classCallCheck(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
}

var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
  return typeof e
} : function(e) {
  return e && "function" == typeof Symbol && e.constructor === Symbol ? "symbol" : typeof e
};

_createClass = function() {
  function e(e, t) {
    for (var n = 0; n < t.length; n++) {
      var s = t[n];
      s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), Object.defineProperty(e, s.key, s)
    }
  }
  return function(t, n, s) {
    return n && e(t.prototype, n), s && e(t, s), t
  }
}();

Consultation = function() {
  function e(t) {
    var n = arguments.length <= 1 || void 0 === arguments[1] ? {} : arguments[1];
    this.config = Object.assign({}, e.defaultConfig, n);
    this.state = {
      hasSeenMaxCharResponse: !1
    };

    this.messages = t;
    return _classCallCheck(this, e);
  }

  return _createClass(e, [{
    key: "init",
    value: function(e) {

      this.currentConsultation = null;
      this.callbacks = {};

      this.consultation = document.createElement("ul");
      this.consultation.className = "cui__list";
      this.answers = document.createElement("div");
      this.answers.className = "cui__responses";
      this.hostElement = document.querySelector(this.config.targetNode);
      this.hostElement || console.warn("Host element coulndt be attached. Node not found");

      while (this.hostElement.firstChild) {
        this.hostElement.removeChild(this.hostElement.firstChild);
      }

      this.hostElement.classList.add("cui");
      this.hostElement.appendChild(this.consultation);
      this.hostElement.appendChild(this.answers);
    }
  }, {
    key: "startNew",
    value: function(e) {
      var t = this;
      t.init();
      var fingerprint = new Fingerprint().get();

      var newConsultation = {
        clientId: fingerprint,
        log: [],
        completed: false
      };

      $.ajax({
        url: '/consultation',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(newConsultation),
        success: function(data) {
          t.currentConsultation = data;
          t.say(t.messages.q1);
        }
      });
    }
  }, {
    key: "continueLatest",
    value: function(e) {
      var t = this;
      t.init();

      var fingerprint = new Fingerprint().get();

      $.ajax({
        url: "/consultation/" + fingerprint,
        type: "GET",
        success: function(data) {
          if (data) {
            t.currentConsultation = data;
            if (t.currentConsultation.log.length > 0) {
              t.recreateDom(t.currentConsultation.log);
            } else {
              t.startNew();
            }
          } else {
            t.startNew();
          }
        }
      });
    }
  }, {
    key: "getAbsoluteRect",
    value: function(e) {
      var t = e.getBoundingClientRect(),
        n = t.top + window.pageYOffset,
        s = t.left + window.pageXOffset;
      return {
        x: s,
        y: n
      }
    }
  }, {
    key: "setMessages",
    value: function(e) {
      this.messages = e
    }
  }, {
    key: "scrollIntoView",
    value: function(e) {
      var t = this.hostElement.getBoundingClientRect(),
        n = t.bottom - window.innerHeight,
        s = document.querySelector(this.config.scrollNode),

        i = function a() {
          n > 0 && (s.scrollTop = s.scrollTop + 8, n -= 8, window.requestAnimationFrame(a))
        };
      i()
    }
  }, {
    key: "emit",
    value: function(e, t) {
      (this.callbacks[e] || function() {}).call(this, t)
    }
  }, {
    key: "on",
    value: function(e, t) {
      return this.callbacks[e] = t, this
    }
  }, {
    key: "animateResponse",
    value: function(e, t, n) {
      var s = this;

      this.addSpeechBubble(t, !0);

      var i = [].slice.call(e.parentNode.children);
      var a = this.getAbsoluteRect(t);
      var o = this.getAbsoluteRect(e);
      var r = a.x - o.x;
      var c = a.y - o.y;
      e.style.transform = "translate3d(" + r + "px, " + c + "px, 0)";
      t.style.opacity = 0;
      e.addEventListener("transitionend", function() {
        n.call(s, e);
        e.parentNode.innerHTML = "";
        t.style.opacity = 1;
      }, !1);
      i.forEach(function(t) {
        return t !== e ? t.style.transform = "translate3d(0, 200px, 0)" : void 0;
      });
    }
  }, {
    key: "createSpeechBubble",
    value: function(e) {
      var t = document.createElement("div");
      n = "response" === e.type ? "cui__bubble cui__bubble--response" : "cui__bubble";
      t.innerHTML = e.text;
      t.next = e.next;
      t.setAttribute("class", n);
      return t;
    }
  }, {
    key: "createAnswerBubble",
    value: function(e) {
      var t = document.createElement("div");
      n = "cui__bubble cui__bubble--answered";
      t.innerHTML = e.text;
      t.setAttribute("class", n);
      return t;
    }
  }, {
    key: "createAnswerButton",
    value: function(e, t) {
      var n = Object.assign({}, {
        delay: 0,
        onFinish: function() {}
      }, t);
      var s = this.createSpeechBubble({
        text: e.text ? e.text.toUpperCase() : "",
        type: "response"
      });

      s.style.transform = "translate3d(0, 180px, 0)";
      this.answers.appendChild(s);
      setTimeout(function() {
        s.style.transform = "translate3d(0, 0, 0)";
      }, 450 + n.delay);

      // s.addEventListener("transitionend", setTimeout(n.onFinish.bind(this, s), 750));

      return s;
    }
  }, {
    key: "chooseAnswer",
    value: function(e) {
      var t = this,
        n = e.answers.map(function(e, n) {
          return t.createAnswerButton(e, {
            delay: 65 + 65 * n
          })
        });
      n.forEach(function(n, s) {
        n.addEventListener("click", function(i) {
          n.classList.remove("cui__bubble--response");
          n.classList.add("cui__bubble--answered");

          t.send({
            text: n.innerHTML
          }, "answer");

          t.animateResponse(n, n.cloneNode(!0), function() {
            t.say(t.messages[e.answers[s].next]);
            // t.emit("answer", {
            //   item: e.answers[s]
            // });
          });
        });
      });
    }
  }, {
    key: "writeAnswer",
    value: function(e) {
      var t = this,
        n = this.createAnswerButton(e, {
          onFinish: function(e) {
            e.focus()
          }
        });

      n.classList.add("cui__answers__placeholder"),
        n.classList.add("cui__textarea"),

        n.setAttribute("contentEditable", !0), n.addEventListener("paste", function(e) {
          requestAnimationFrame(function() {
            n.innerHTML = n.innerText
          })
        }), n.addEventListener("keyup", function(e) {
          return n.innerText.length ? void n.classList.remove("cui__answers__placeholder") : (n.classList.add("cui__answers__placeholder"), n.focus())
        });
      var s = !1,
        i = function() {
          n.innerText.length && !s && (s = !0,
            n.setAttribute("contentEditable", !1),
            n.classList.remove("cui__textarea"),
            n.classList.remove("cui__bubble--response"),
            n.classList.add("cui__bubble--answered"),

            t.send({
              text: n.innerHTML
            }, "answer"),

            t.animateResponse(n, n.cloneNode(!0), function(n) {
              e.next && t.say(t.messages[e.next]), t.emit("answer", {
                item: e,
                text: n.innerHTML
              })
            }))
        };
      n.addEventListener("blur", i.bind(this)), n.addEventListener("keydown", function(e) {
        13 === e.keyCode && (e.preventDefault(), n.removeEventListener("blur", i), i())
      }), n.addEventListener("keypress", function(e) {
        n.innerText.length > t.config.maxCharsResponse && (e.preventDefault(), t.state.hasSeenMaxCharResponse || (t.state.hasSeenMaxCharResponse = !0, t.say([t.config.maxCharsResponseText])))
      })
    }
  }, {
    key: "addAnswerBubbleRecreateDom",
    value: function(e) {

      var t = this;
      n = arguments.length <= 1 || void 0 === arguments[1] ? !1 : arguments[1];
      s = document.createElement("li");

      s.classList.add("cui__list__item");
      s.appendChild(e);
      this.consultation.appendChild(s);
      n || ! function() {
        var n = e.getBoundingClientRect();
        var s = e.innerHTML.indexOf("iframe") >= 0;
        s && e.classList.add("cui__bubble--embed");
        e.addEventListener("transitionend", function(n) {
          "min-width" === n.propertyName && (e.removeAttribute("style"), t.scrollIntoView())
        });
        e.style.minHeight = n.height + "px";
        e.style.minWidth = n.width + "px";
        e.classList.add("cui__bubble--fade");
        e.removeAttribute("style");
        s || t.scrollIntoView();
      }();
    }
  }, {
    key: "addSpeechBubbleRecreateDom",
    value: function(e) {

      var t = this;
      n = arguments.length <= 1 || void 0 === arguments[1] ? !1 : arguments[1];
      s = document.createElement("li");

      s.classList.add("cui__list__item");
      s.appendChild(e);
      this.consultation.appendChild(s);
      n || ! function() {
        var n = e.getBoundingClientRect();
        e.classList.remove("cui__bubble--slideIn");
        e.classList.remove("cui__bubble");
        e.classList.add("cui__bubble__recreated");

        var s = e.innerHTML.indexOf("iframe") >= 0;
        s && e.classList.add("cui__bubble--embed");
        e.addEventListener("transitionend", function(n) {
          "min-width" === n.propertyName && (e.removeAttribute("style"), t.scrollIntoView())
        });
        e.style.minHeight = n.height + "px";
        e.style.minWidth = n.width + "px";
        e.classList.add("cui__bubble--fade");
        e.removeAttribute("style");
        s || t.scrollIntoView();
      }();
    }
  }, {
    key: "addSpeechBubble",
    value: function(e) {

      var t = this;
      n = arguments.length <= 1 || void 0 === arguments[1] ? !1 : arguments[1];
      s = document.createElement("li");

      s.classList.add("cui__list__item");
      s.appendChild(e);
      this.consultation.appendChild(s);
      n || ! function() {
        var n = e.getBoundingClientRect();
        window.getComputedStyle(e).opacity, e.classList.add("cui__bubble--slideIn");
        var s = e.innerHTML.indexOf("iframe") >= 0;
        s && e.classList.add("cui__bubble--embed");
        var i = e.innerHTML;
        var next = e.next;
        e.innerHTML = t.config.cursor;

        e.addEventListener("transitionend", function(n) {
          "min-width" === n.propertyName && (e.removeAttribute("style"), t.scrollIntoView())
        });

        t.send({
          text: i,
          next: next
        }, "question");

        innerHTMLLength = i;
        typingSpeed = t.config.typingSpeed;
        consultationDelay = innerHTMLLength * typingSpeed;

        setTimeout(function() {
          e.style.minHeight = n.height + "px";
          e.style.minWidth = n.width + "px";
          e.classList.add("cui__bubble--fade");
          setTimeout(function() {
            t.typetext({
              tickerText: i,
              c: 0,
              element: e
            });
            e.removeAttribute("style");
            s || t.scrollIntoView();
          }, t.config.consultationDelay)
        }, consultationDelay)
      }();
    }
  }, {
    key: "typetext",
    value: function(e) {
      var t = this;
      var isInTag = false;
      var thisChar = e.tickerText.substr(e.c, 1);
      if (thisChar == '<') {
        isInTag = true;
      }
      if (thisChar == '>') {
        isInTag = false;
      }
      e.element.innerHTML = e.tickerText.substr(0, e.c++) + t.config.cursor;

      if (e.c < e.tickerText.length + 1)
        if (isInTag) {
          t.typetext(e);
        } else {
          setTimeout(function() {
            t.typetext(e);
          }, t.config.typingSpeed);
        }
      else {
        e.element.innerHTML = e.tickerText.substr(0, e.tickerText.length);
        e.c = 1;
        e.tickerText = "";
      }
    }
  }, {
    key: "send",
    value: function(e, type) {
      var t = this;

      var message = {
        type: type,
        text: e.text
      };

      if (e.next) {
        message.next = e.next;
      }

      t.currentConsultation.log.push(message);

      $.ajax({
        url: '/consultation/' + t.currentConsultation.id,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(t.currentConsultation),
        success: function(data) {
          t.currentConsultation = data;
        }
      });
    }
  }, {
    key: "completeConsultation",
    value: function() {
      var t = this;
      t.currentConsultation.completed = true;

      $.ajax({
        url: '/consultation/' + t.currentConsultation.id,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(t.currentConsultation),
        success: function(data) {
          t.currentConsultation = data;
        }
      });
    }
  }, {
    key: "say",
    value: function(el) {
      var t = this;
      var e = [];

      if (el.type === "question") {
        var consultationBlock = el;
        var type = el.type;
        var next = el.next;

        while (type === "question") {
          e.push(consultationBlock);
          type = consultationBlock.type;
          next = consultationBlock.next;
          consultationBlock = t.messages[next];
        }
      } else if (el.type === "choose" || el.type === "write") {
        e.push(el);
      }

      var delay = 100;
      e.forEach(function(e, n) {
        setTimeout(function() {
          if ("object" === ("undefined" == typeof e ? "undefined" : _typeof(e))) {
            switch (e.type) {
              case "question":
                var n = t.createSpeechBubble({
                  text: e.text,
                  next: e.next
                });
                t.addSpeechBubble(n);
                break;
              case "choose":
                return t.chooseAnswer(e);
              case "write":
                return t.writeAnswer(e);
              case "consultationCompleted":
                return t.completeConsultation();
            }
          }
        }, delay);

        if (e.type === "question") {
          delay += e.text.length * t.config.typingSpeed + t.config.consultationDelay;
        }
      })
    }
  }, {
    key: "recreateDom",
    value: function(e) {
      var t = this;
      var delay = 100;
      var next;

      e.forEach(function(e, n) {
        if (e.next) {
          next = e.next;
        }
        setTimeout(function() {
          if ("object" === ("undefined" == typeof e ? "undefined" : _typeof(e))) {
            switch (e.type) {
              case "question":
                var n = t.createSpeechBubble({
                  text: e.text
                });
                t.addSpeechBubbleRecreateDom(n);
                break;
              case "answer":
                var n = t.createAnswerBubble({
                  text: e.text
                });
                t.addAnswerBubbleRecreateDom(n);
            }
          }
        }, delay);
      })
      if (next && next !== "end") {
        this.say(this.messages[next]);
      }
    }
  }]), e
}();

Consultation.defaultConfig = {
  targetNode: "div#chatBot",
  scrollNode: "body",
  maxCharsResponse: 500,
  maxCharsResponseText: "Let's keep it casual... no need for long messages. :)",
  cursor: "<span class=\"blink\">_</span>",
  consultationDelay: 1050,
  typingSpeed: 18
}, Consultation.info = {
  name: "Vivify Consultation",
  description: "A simple, array based chat UI"
};
