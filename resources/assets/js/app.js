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
    text: 'Thanks for this! ☕ Have a great day! 🙌',
    next: 'end'
  },
  'end': {
    type: 'end',
  }
};

var chatModule = (function($, F, chatBlocks) {

  var currentChat;
  var chatList;
  var chatAnswers;
  var chatHost;
  var hasSeenMaxCharResponse = false;

  var defaultConfig = {
    targetNode: "chatbot",
    maxCharsResponse: 500,
    maxCharsResponseText: {
      type: "warning",
      text: "Let's keep it casual... no need for long messages. :)"
    },
    cursor: "<span class=\"blink\">_</span>",
    chatDelay: 1000,

    typingSpeed: 15
  };

  function startNew() {

    initDom();
    var fingerprint = new F().get();

    currentChat = {
      client_id: fingerprint,
      completed: false,
      id: 1,
      log: [],
      sent_email: false,
    };

    localStorage.setItem("currentChat", JSON.stringify(currentChat));

    generateNext(chatBlocks.q1);
  }

  function initDom() {

    var chatRestart = document.createElement("div");
    chatRestart.innerHTML = "RESTART";
    chatRestart.setAttribute("class", "chat__restart--button");
    chatRestart.addEventListener("click", function(i) {
      startNew();
    });

    chatList = document.createElement("ul");
    chatList.className = "chat__list";
    chatAnswers = document.createElement("div");
    chatAnswers.className = "chat__responses";
    chatHost = document.getElementById(defaultConfig.targetNode);

    if (!chatHost) {
      console.warn("Host element not found.");
    } else {
      while (chatHost.firstChild) {
        chatHost.removeChild(chatHost.firstChild);
      }
    }

    chatHost.classList.add("chat");
    chatHost.appendChild(chatRestart);
    chatHost.appendChild(chatList);
    chatHost.appendChild(chatAnswers);
  }

  function recreateLatestChat(chatLog) {

    var delay = 100;
    var next;
    var element;

    chatLog.forEach(function(block) {
      if (block.next) {
        next = block.next;
      }
      setTimeout(function() {
        switch (block.type) {
          case "question":
            element = createQuestionElement({
              text: block.text
            }, true);
            addQuestionElement(element, true);
            break;
          case "answer":
            element = createAnswerElement({
              text: block.text
            });
            addAnswerElement(element);
        }
      }, delay);
    });

    scrollIntoView();

    if (next && next !== "end") {
      generateNext(chatBlocks[next]);
    }
  }

  function generateNext(chatBlock) {

    var blocks = [];
    var block = chatBlock;

    var type = chatBlock.type;
    var next = chatBlock.next;

    if (type === "choose" || type === "write" || type === "warning") {
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
    var element;

    blocks.forEach(function(block) {
      setTimeout(function() {
        switch (block.type) {
          case "question":
            element = createQuestionElement({
              text: block.text,
              next: block.next
            });
            addQuestionElement(element);
            break;
          case "warning":
            element = createQuestionElement({
              text: block.text,
            });
            addQuestionElement(element);
            break;
          case "choose":
            return chooseAnswer(block);
          case "write":
            return writeAnswer(block);
          case "end":
            return endChat();
        }
      }, delay);

      if (block.type === "question") {
        delay += block.text.length * defaultConfig.typingSpeed + defaultConfig.chatDelay;
      }
    });
  }

  function createQuestionElement(chatBlock, recreatingLatestChat) {

    var element = document.createElement("div");
    element.innerHTML = chatBlock.text;
    element.next = chatBlock.next;

    if (recreatingLatestChat) {
      element.setAttribute("class", "chat__block");
    } else {
      element.setAttribute("class", "chat__block chat__question");
    }

    return element;
  }

  function createAnswerElement(chatBlock) {

    var element = document.createElement("div");
    element.innerHTML = chatBlock.text;
    element.setAttribute("class", "chat__block chat__answer");
    return element;
  }

  function addQuestionElement(element, recreatingLatestChat) {

    var container = document.createElement("li");
    container.classList.add("chat__list__item");
    container.appendChild(element);
    chatList.appendChild(container);

    if (!recreatingLatestChat) {

      scrollIntoView();
      element.classList.add("chat__question--slideIn");

      var text = element.innerHTML;
      var next = element.next;
      element.innerHTML = defaultConfig.cursor;

      send({
        text: text,
        type: "question",
        next: next
      });

      var typingSpeed = defaultConfig.typingSpeed;
      var typingDelay = text * typingSpeed;

      setTimeout(function() {
        setTimeout(function() {

          typeText({
            tickerText: text,
            c: 0,
            element: element
          });

        }, defaultConfig.chatDelay);
      }, typingDelay);
    }
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

  function addAnswerElement(element) {
    var container = document.createElement("li");
    container.classList.add("chat__list__item");
    container.appendChild(element);
    chatList.appendChild(container);
  }

  function chooseAnswer(chatBlock) {

    var buttons = chatBlock.answers.map(function(chatBlock, n) {
      var delay = 50 + 50 * n;
      return createAnswerButton(chatBlock, delay);
    });

    buttons.forEach(function(button, index) {
      chatAnswers.appendChild(button);
      scrollIntoView();

      button.addEventListener("click", function() {

        button.classList.remove("chat__answer--button");
        button.classList.add("chat__answer--button--clicked");

        var buttonCopy = button.cloneNode(true);
        buttonCopy.classList.remove("chat__answer--button--clicked");
        buttonCopy.classList.add("chat__answer");

        animateResponse(button, buttonCopy, function() {
          send({
            text: button.innerHTML,
            type: "answer"
          });

          generateNext(chatBlocks[chatBlock.answers[index].next]);
        });
      });
    });
  }

  function writeAnswer(chatBlock) {

    var textArea = document.createElement("div");
    textArea.next = chatBlock.next;
    textArea.setAttribute("class", "chat__block");
    textArea.style.transform = "translate3d(0, 200px, 0)";

    setTimeout(function() {
      textArea.style.transform = "translate3d(0, 0, 0)";
    }, 200);

    chatAnswers.appendChild(textArea);

    textArea.classList.add("chat__textarea");
    textArea.classList.add("chat__textarea--placeholder");
    textArea.setAttribute("contentEditable", true);

    textArea.addEventListener("paste", function(e) {
      requestAnimationFrame(function() {
        textArea.classList.remove("chat__textarea--placeholder");
        textArea.innerHTML = textArea.innerText;
      });
    });

    textArea.addEventListener("keyup", function(e) {
      if (textArea.innerText.length > 0 && textArea.innerHTML !== "<br>") {
        textArea.classList.remove("chat__textarea--placeholder");
      } else {
        textArea.classList.add("chat__textarea--placeholder");
        textArea.focus();
      }
      if (textArea.innerText.length > defaultConfig.maxCharsResponse) {
        if (!hasSeenMaxCharResponse) {
          generateNext(defaultConfig.maxCharsResponseText);
          hasSeenMaxCharResponse = true;
        }
      }
    });

    textArea.addEventListener("keydown", function(e) {
      if (textArea.innerText.length > 0 && textArea.innerHTML !== "<br>") {
        if (e.keyCode === 13) { //ENTER KEY
          textArea.setAttribute("contentEditable", false);
          textArea.classList.remove("chat__textarea");
          textArea.classList.add("chat__textarea--finished");

          var textAreaCopy = textArea.cloneNode(true);
          textAreaCopy.classList.remove("chat__textarea--finished");
          textAreaCopy.classList.add("chat__answer");

          animateResponse(textArea, textAreaCopy, function(n) {
            send({
              text: textArea.innerHTML,
              type: "answer"
            });

            generateNext(chatBlocks[chatBlock.next]);
          });
        }
      }
    });
  }

  function animateResponse(element, elementCopy, callback) {

    addAnswerElement(elementCopy);

    var a = getAbsoluteRect(elementCopy);
    var o = getAbsoluteRect(element);
    var r = a.x - o.x;
    var c = a.y - o.y;

    element.style.transform = "translate3d(" + r + "px, " + c + "px, 0)";
    elementCopy.style.opacity = 0;

    element.addEventListener("transitionend", function() {
      callback();
      element.parentNode.innerHTML = "";
      elementCopy.style.opacity = 1;
    });

    var responses = [].slice.call(element.parentNode.children);
    responses.forEach(function(t) {
      if (t !== element) {
        t.style.transform = "translate3d(0, 200px, 0)";
      }
    });
  }

  function createAnswerButton(chatBlock, delay) {

    var button = document.createElement("div");
    button.innerHTML = chatBlock.text.toUpperCase(); //TODO
    button.next = chatBlock.next;
    button.setAttribute("class", "chat__block chat__answer--button");
    button.style.transform = "translate3d(0, 200px, 0)";

    setTimeout(function() {
      button.style.transform = "translate3d(0, 0, 0)";
    }, 200 + delay);

    return button;
  }

  function endChat() {

    var currentChat = JSON.parse(localStorage.getItem("currentChat"));
    currentChat.completed = true;
    localStorage.setItem("currentChat", JSON.stringify(currentChat));
  }

  function send(chatBlock) {

    var currentChat = JSON.parse(localStorage.getItem("currentChat"));
    currentChat.log.push(chatBlock);
    localStorage.setItem("currentChat", JSON.stringify(currentChat));
  }

  function getAbsoluteRect(element) {
    var rect = element.getBoundingClientRect();
    var n = rect.top + window.pageYOffset;
    var s = rect.left + window.pageXOffset;
    return {
      x: s,
      y: n
    };
  }

  function scrollIntoView() {
    var rect = chatHost.getBoundingClientRect();

    $('html,body').animate({
      scrollTop: rect.bottom
    }, 500);
  }

  return {
    continueLatest: function() {
      initDom();
      var currentChat;

      if (localStorage.currentChat) {
        currentChat = JSON.parse(localStorage.getItem("currentChat"));

        if (currentChat.log.length > 0) {
          recreateLatestChat(currentChat.log);
        } else {
          startNew();
        }
      } else {
        startNew();
      }
    }
  };
})(jQuery, Fingerprint, chatBlocks);
