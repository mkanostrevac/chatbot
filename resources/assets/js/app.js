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
    // next: 'q1'
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
    name: 'message',
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

var chatModule = (function($, F, consultationBlock) {

  var defaultConfig,
    currentChat,
    chatLogDom,
    chatAnswersDom,
    chatHost;

  defaultConfig = {
    targetNode: "div#chatbot",
    scrollNode: "body",
    maxCharsResponse: 500,
    maxCharsResponseText: "Let's keep it casual... no need for long messages. :)",
    cursor: "<span class=\"blink\">_</span>",
    chatDelay: 1050,
    typingSpeed: 18
  };

  function initDom() {
    chatLogDom = document.createElement("ul");
    // currentConsultationDOM.className = "cui__list";
    chatAnswersDom = document.createElement("div");
    // consAnswersDom.className = "cui__responses";
    chatHost = document.querySelector(defaultConfig.targetNode);

    if (!chatHost) {
      console.warn("Host element not found.");
    } else {
      while (chatHost.firstChild) {
        chatHost.removeChild(chatHost.firstChild);
      }
    }

    // this.hostElement.classList.add("cui");
    chatHost.appendChild(chatLogDom);
    chatHost.appendChild(chatAnswersDom);
  }

  function generateChatAction(startChatItem) {

    var chatItems = [];

    if (startChatItem.type === "question") {
      var chatItem = startChatItem;
      var type = startChatItem.type;
      var next = startChatItem.next;

      while (type === "question") {
        chatItems.push(chatItem);
        type = chatItem.type;
        next = chatItem.next;
        chatItem = consultationBlock[next];

        //TODO 
        // if (chatItems.length > 30) {
        //   break;
        // }
      }
    } else if (startChatItem.type === "choose" || startChatItem.type === "write") {
      chatItems.push(startChatItem);
    }

    var delay = 100;
    chatItems.forEach(function(item, n) {
      setTimeout(function() {
        switch (item.type) {
          case "question":
            var element = createChatQuestion({
              text: item.text,
              next: item.next
            });
            addChatQuestion(element);
            break;
          case "choose":
            return addChatAnswers(item);
          case "write":
            return writeAnswer(item);
          case "consultationCompleted":
            return completeConsultation();
        }
      }, delay);

      if (item.type === "question") {
        delay += item.text.length * defaultConfig.typingSpeed + defaultConfig.chatDelay;
      }
    });
  }

  function createChatQuestion(chatItem) {

    var chatElement = document.createElement("div");
    // n = "response" === e.type ? "cui__bubble cui__bubble--response" : "cui__bubble";
    chatElement.innerHTML = chatItem.text;
    chatElement.next = chatItem.next;
    // t.setAttribute("class", n);
    return chatElement;
  }

  function addChatQuestion(chatQuestionElement) {

    var container = document.createElement("li");
    // element.classList.add("cui__list__item");
    container.appendChild(chatQuestionElement);
    chatLogDom.appendChild(container);

    var rect = chatQuestionElement.getBoundingClientRect();
    // window.getComputedStyle(chatQuestionElement).opacity, chatQuestionElement.classList.add("cui__bubble--slideIn");
    // if (chatQuestionElement.innerHTML.indexOf("iframe") >= 0) {
    //   chatQuestionElement.classList.add("cui__bubble--embed");
    // }

    var text = chatQuestionElement.innerHTML;
    var next = chatQuestionElement.next;
    chatQuestionElement.innerHTML = defaultConfig.cursor;

    // chatQuestionElement.addEventListener("transitionend", function(rect) {
    //   "min-width" === rect.propertyName && (chatQuestionElement.removeAttribute("style"), scrollIntoView());
    // });

    send({
      text: text,
      next: next
    }, "question");


    typingSpeed = defaultConfig.typingSpeed;
    typingDelay = text * typingSpeed;

    setTimeout(function() {
      chatQuestionElement.style.minHeight = rect.height + "px";
      chatQuestionElement.style.minWidth = rect.width + "px";
      // chatQuestionElement.classList.add("cui__bubble--fade");
      setTimeout(function() {

        function typeText(e) {

          var isInTag = false;
          var thisChar = e.tickerText.substr(e.c, 1);
          if (thisChar == '<') {
            isInTag = true;
          }
          if (thisChar == '>') {
            isInTag = false;
          }
          e.element.innerHTML = e.tickerText.substr(0, e.c++) + defaultConfig.cursor;

          if (e.c < e.tickerText.length + 1) {
            if (isInTag) {
              typeText(e);
            } else {
              setTimeout(function() {
                typeText(e);
              }, defaultConfig.typingSpeed);
            }
          } else {
            e.element.innerHTML = e.tickerText.substr(0, e.tickerText.length);
            e.c = 1;
            e.tickerText = "";
          }
        }

        typeText({
          tickerText: text,
          c: 0,
          element: chatQuestionElement
        });
        // chatQuestionElement.removeAttribute("style");
        // s || t.scrollIntoView();

        var rect = chatHost.getBoundingClientRect();
        var difference = rect.bottom - window.innerHeight;
        var scrollNode = document.querySelector(defaultConfig.scrollNode);

        function a() {
          if (difference > 0) {
            scrollNode.scrollTop = scrollNode.scrollTop + 8;
            difference -= 8;
            window.requestAnimationFrame(a);
          }
        }

        if (container) {
          a();
        }
      }, defaultConfig.chatDelay);
    }, typingDelay);
  }

  function addChatAnswers(chatChooseElement) {

      var buttons = chatChooseElement.answers.map(function(chatChooseElement, index) {

          return createChatAnswerButton(chatChooseElement, {
            delay: 65 + 65 * index
          });
      });

      buttons.forEach(function(button, index) {
        button.addEventListener("click", function(i) {
          // button.classList.remove("cui__bubble--response");
          // button.classList.add("cui__bubble--answered");

          send({
            text: button.innerHTML
          }, "answer");

          //OVDE SMO STALI
          t.animateResponse(button, button.cloneNode(!0), function() {
            t.say(t.messages[chatChooseElement.answers[index].next]), emit("answer", {
              item: e.answers[s]
            })
          })
        })
      })



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
            t.say(t.messages[e.answers[s].next]), t.emit("answer", {
              item: e.answers[s]
            })
          })
        })
      })
    }
  }

  function createChatAnswerButton() {
    value: function(e, t) {
      var n = Object.assign({}, {
          delay: 0,
          onFinish: function() {}
        }, t),
        s = this.createSpeechBubble({
          text: e.text ? e.text.toUpperCase() : "",
          type: "response"
        });
      return s.style.transform = "translate3d(0, 180px, 0)", this.answers.appendChild(s), setTimeout(function() {
        s.style.transform = "translate3d(0, 0, 0)"
      }, 450 + n.delay), s.addEventListener("transitionend", setTimeout(n.onFinish.bind(this, s), 750)), s
    }

  }

  function send(chatItemData, chatItemType) {

    var chatItem = {
      type: chatItemType,
      text: chatItemData.text
    };

    if (chatItemData.next) {
      chatItem.next = chatItemData.next;
    }

    currentChat.log.push(chatItem);

    ///TODO
    // $.ajax({
    //   url: '/consultation/' + currentChat.id,
    //   type: 'PUT',
    //   contentType: 'application/json',
    //   data: JSON.stringify(currentChat),
    //   success: function(data) {
    //     currentChat = data;
    //   }
    // });
  }

  function scrollInto() {

    var rect = chatHost.getBoundingClientRect();
    var difference = rect.bottom - window.innerHeight;
    var scrollNode = document.querySelector(defaultConfig.scrollNode);

    function a() {
      if (difference > 0) {
        scrollNode.scrollTop = scrollNode.scrollTop + 8;
        difference -= 8;
        window.requestAnimationFrame(a);
      }
    }

    a();
  }

  function recreateDom() {
    //TODO
  }

  function log(message) {
    $(defaultConfig.targetNode).html(message);
  }

  return {
    startNew: function() {
      log("startNew");
      initDom();
      var fingerprint = new F().get();

      // mock
      var newChat = {
        clientId: fingerprint,
        log: [],
        completed: false
      };

      currentChat = {
        client_id: 1951436250,
        completed: false,
        created_at: "2017-03-02 12:18:08",
        id: 6,
        log: [],
        sent_email: false,
        updated_at: "2017-03-02 12:18:08"
      };

      generateChatAction(consultationBlock.q1);
      //

      //TODO MOCK
      // $.ajax({
      //   url: 'http://localhost:8000/consultation',
      //   type: 'POST',
      //   contentType: 'application/json',
      //   data: JSON.stringify(newConsultation),
      //   success: function(data) {
      //     currentConsultation = data;
      //     // t.say(t.messages.q1);
      //   }
      // });
    },

    continueLatest: function() {
      log("continueLatest");
      initDom();

      var fingerprint = new F().get();

      // mock
      currentChat = {
        client_id: 1951436250,
        completed: false,
        created_at: "2017-03-02 12:18:08",
        id: 6,
        log: [],
        sent_email: false,
        updated_at: "2017-03-02 12:18:08"
      };

      if (currentChat.log.length > 0) {
        recreateDom(currentChat.log);
      } else {
        this.startNew();
      }
      //

      // TODO MOCK
      // $.ajax({
      //   url: "/consultation/" + fingerprint,
      //   type: "GET",
      //   success: function(data) {
      //     if (data) {
      //       currentConsultation = data;
      //       if (currentConsultation.log.length > 0) {
      //         recreateDom(currentConsultation.log);
      //       } else {
      //         startNew();
      //       }
      //     } else {
      //       startNew();
      //     }
      //   }
      // });
    }
  };
})(jQuery, Fingerprint, consultationBlock);
