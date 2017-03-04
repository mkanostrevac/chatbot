var chatBlocks = {
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

var chatModule = (function($, F, chatBlocks) {

  var defaultConfig,
    currentChat,
    chatList,
    chatAnswers,
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
    chatList = document.createElement("ul");
    chatList.className = "cui__list";
    chatAnswers = document.createElement("div");
    chatAnswers.className = "cui__responses";
    chatHost = document.querySelector(defaultConfig.targetNode);

    if (!chatHost) {
      console.warn("Host element not found.");
    } else {
      while (chatHost.firstChild) {
        chatHost.removeChild(chatHost.firstChild);
      }
    }

    chatHost.classList.add("cui");
    chatHost.appendChild(chatList);
    chatHost.appendChild(chatAnswers);
  }

  function generateNext(chatBlock) {

    var blocks = [];
    var block = chatBlock;

    var type = chatBlock.type;
    var next = chatBlock.next;

    if (type === "choose" || type === "write") {
      blocks.push(block);
    } else {
      while (type === "question") {
        blocks.push(block);
        type = block.type;
        next = block.next;
        block = chatBlocks[next];
      }
    }

    var delay = 100;
    blocks.forEach(function(block) {
      setTimeout(function() {
        switch (block.type) {
          case "question":
            var element = createQuestionElement({
              text: block.text,
              next: block.next
            });
            addQuestionElement(element);
            break;
          case "choose":
            return addAnswerButtons(block);
          case "write":
            return writeAnswer(block);
          case "consultationCompleted":
            return completeConsultation();
        }
      }, delay);

      if (block.type === "question") {
        delay += block.text.length * defaultConfig.typingSpeed + defaultConfig.chatDelay;
      }
    });
  }

  function createQuestionElement(chatBlock) {

    var element = document.createElement("div");
    element.innerHTML = chatBlock.text;
    element.next = chatBlock.next;
    element.setAttribute("class", "cui__bubble");
    return element;
  }

  function addQuestionElement(element) {

    var container = document.createElement("li");
    container.classList.add("cui__list__item");
    container.appendChild(element);
    chatList.appendChild(container);

    var rect = element.getBoundingClientRect();
    element.classList.add("cui__bubble--slideIn");

    var text = element.innerHTML;
    var next = element.next;
    element.innerHTML = defaultConfig.cursor;

    send({
      type: "question",
      text: text,
      next: next
    });

    typingSpeed = defaultConfig.typingSpeed;
    typingDelay = text * typingSpeed;

    setTimeout(function() {
      element.style.minHeight = rect.height + "px";
      element.style.minWidth = rect.width + "px";
      setTimeout(function() {

        typeText({
          tickerText: text,
          c: 0,
          element: element
        });

        scrollInto();

      }, defaultConfig.chatDelay);
    }, typingDelay);
  }

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

  function addAnswerButtons(chatBlock) {

    var buttons = chatBlock.answers.map(function(chatBlock, n) {
      return createAnswerButton(chatBlock, {
        delay: 50 + 50 * n
      });
    });

    buttons.forEach(function(button, index) {
      button.addEventListener("click", function() {
        
        button.classList.remove("cui__bubble--response");
        button.classList.add("cui__bubble--answered");

        send({
          text: button.innerHTML,
          type: "answer"
        });

        var cloneButton = button.cloneNode(true);
  
        animateResponse(button, button.cloneNode(true), buttons, function() {
            var next = chatBlock.answers[index].next;
            generateNext(chatBlocks[next]);
        });
      });
    });
  }

  function animateResponse(button, cloneButton, buttons, callback) {
    
    addAnswerElement(cloneButton);

    var a = getAbsoluteRect(cloneButton);
    var o = getAbsoluteRect(button);
    var r = a.x - o.x;
    var c = a.y - o.y;

    button.style.transform = "translate3d(" + r + "px, " + c + "px, 0)";
    cloneButton.style.opacity = 0;

    button.addEventListener("transitionend", function() {
      callback();
      button.parentNode.innerHTML = "";
      cloneButton.style.opacity = 1;
    });

    buttons.forEach(function(t) {
      return t !== button ? t.style.transform = "translate3d(0, 200px, 0)" : void 0;
    });
  }

  function addAnswerElement(element) {
    var container = document.createElement("li");
    container.classList.add("cui__list__item");
    container.appendChild(element);
    chatList.appendChild(container);
  }

  function createAnswerButton(chatBlock, t) {

    var s = document.createElement("div");
    s.innerHTML = chatBlock.text.toUpperCase();
    s.next = chatBlock.next;
    s.setAttribute("class", "cui__bubble cui__bubble--response");

    s.style.transform = "translate3d(0, 200px, 0)";
    chatAnswers.appendChild(s);

    setTimeout(function() {
      s.style.transform = "translate3d(0, 0, 0)";
    }, 200 + t.delay);

    return s;
  }

  function send(chatBlock) {

    currentChat.log.push(chatBlock);

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



  function getAbsoluteRect(e) {
    var t = e.getBoundingClientRect(),
      n = t.top + window.pageYOffset,
      s = t.left + window.pageXOffset;
    return {
      x: s,
      y: n
    };
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

      generateNext(chatBlocks.q1);
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
})(jQuery, Fingerprint, chatBlocks);
