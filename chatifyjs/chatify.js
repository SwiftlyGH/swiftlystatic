setInterval(() => {
  document.querySelectorAll("code").forEach((code) => {
    code.innerHTML = code.innerHTML.replace(/&amp;nbsp;/, "&nbsp;");
  });
}, 1);

var chatify = {
  createChat: (options) => {
    chatify.loadStyles(options, options.theme.content);

    var clientUsers = 0;
    options.users.forEach((user) => {
      if (user.type == "client") {
        clientUsers++;
      }
    });
    if (clientUsers !== 1) {
      console.error(
        "[ChatifyJS] >> Please set only 1 client user in users option."
      );
      return;
    }

    if (
      (!options.id && document.querySelectorAll(".chatify").length == 0) ||
      options.id
    ) {
      var divToCreate = document.querySelector(options.div);

      var chatifyElem = document.createElement("div");
      chatifyElem.setAttribute("chatify-theme", options.theme.name);
      chatifyElem.classList.add("chatify");
      if (options.id) {
        chatifyElem.id = options.id;
      }

      function getActualSetting(optionname) {
        if (options.options) {
          if (options.options[optionname] == null) {
            return chatify.defaultSettings[optionname];
          } else {
            return options.options[optionname];
          }
        } else {
          return chatify.defaultSettings[optionname];
        }
      }

      chatify.loadLibraries(options.theme.type).then(() => {
        // Title Bar
        var loadTitleBar = () => {
          var titleBar = document.createElement("div");
          titleBar.classList.add("chatify-titleBar");
          titleBar.innerHTML = `<span>${options.title}</span>`;
          // Title Bar Buttons
          var firstRightDone = false;
          if (
            getActualSetting("darkModeBtn") == null ||
            getActualSetting("darkModeBtn") == true
          ) {
            var darkModeButton = document.createElement("button");
            if (options.theme.type == "light") {
              var icon = "moon";
            } else {
              var icon = "sunny";
            }
            if (!firstRightDone) {
              darkModeButton.classList.add("chatify-right");
              firstRightDone = true;
            }
            darkModeButton.innerHTML = `<img src="https://swiftlystatic.vercel.app/airacloud/icon?icon=${icon}&fill=${options.theme.content.fg.replace(
              "#",
              "0x"
            )}">`;
            titleBar.appendChild(darkModeButton);
          }
          chatifyElem.prepend(titleBar);
        };
        loadTitleBar();

        // Messages Area
        var loadMessagesArea = () => {
          var messageArea = document.createElement("div");
          messageArea.classList.add("chatify-message-area");
          chatify.loadMessages(options.messages, options.users, messageArea);
          chatifyElem.appendChild(messageArea);
        };
        loadMessagesArea();

        // Input
        var loadInputBar = () => {
          var inputBar = document.createElement("div");
          inputBar.classList.add("chatify-titleBar");
          inputBar.classList.add("chatify-inputBar");
          inputBar.innerHTML = `<div class="chatify-input" spellcheck="false" placeholder="${getActualSetting(
            "placeholder"
          )}" contenteditable>`;
          inputBar
            .querySelector(".chatify-input")
            .addEventListener("keydown", (event) => {
              if (event.key === "Enter") {
                if (!event.shiftKey) {
                  event.preventDefault();
                  if (
                    (inputBar.innerText.length >= 1 &&
                      !getActualSetting("voidMessages")) ||
                    getActualSetting("voidMessages")
                  ) {
                    chatify.loadMessages(
                      [
                        {
                          user: chatify.getClientUser(options.users).id,
                          content: inputBar.innerText
                        }
                      ],
                      options.users,
                      chatifyElem.querySelector(".chatify-message-area")
                    );

                    var data____ = {
                      lockWriting: () => {
                        inputBar
                          .querySelector(".chatify-input")
                          .setAttribute("contenteditable", "false");
                        inputBar.style.opacity = "0.6";
                      },
                      enableWriting: () => {
                        inputBar
                          .querySelector(".chatify-input")
                          .setAttribute("contenteditable", "true");
                        inputBar.querySelector(".chatify-input").focus();
                        inputBar.style.opacity = "1";
                      },
                      sendMessages: (data) => {
                        chatify.loadMessages(
                          data,
                          options.users,
                          chatifyElem.querySelector(".chatify-message-area")
                        );
                      },
                      content: inputBar.innerText,
                      contentHTML: inputBar.innerHTML
                    };
                    options.onSend(data____);




                    if (getActualSetting("cooldown")) {
                      inputBar
                        .querySelector(".chatify-input")
                        .setAttribute("contenteditable", "false");
                      inputBar.style.opacity = "0.6";
                      setTimeout(() => {
                        inputBar
                          .querySelector(".chatify-input")
                          .setAttribute("contenteditable", "true");
                        inputBar.querySelector(".chatify-input").focus();
                        inputBar.style.opacity = "1";
                      }, getActualSetting("cooldown") * 1000);
                    }
                  }
                  inputBar.querySelector(".chatify-input").innerHTML = "";
                }
              }
            });

          chatifyElem.appendChild(inputBar);
        };
        loadInputBar();
        var lastInputHTML = ``;
        setInterval(() => {
          var msgarea = chatifyElem.querySelector(".chatify-message-area");
          var input = chatifyElem.querySelector(".chatify-inputBar");
          var title = chatifyElem.querySelector(".chatify-titleBar");
          var inputElem = input.querySelector(".chatify-input");
          var maxHeight = parseInt(window.getComputedStyle(input).maxHeight);
          if (lastInputHTML !== inputElem.innerHTML) {
            var text = inputElem.innerText;
            function deleteINSuggest() {
              var content = document.createElement("div");
              content.innerHTML = inputElem.innerHTML;
              content
                .querySelectorAll(".chatify-inline-suggestion")
                .forEach((elem) => {
                  elem.remove();
                });
              return content.innerHTML;
            }
            var data = {
              content: text,
              contentHTML: deleteINSuggest()
            };
            options.onType(data);
            lastInputHTML = inputElem.innerHTML;
          }
          if (inputElem.offsetHeight > maxHeight) {
            var items = inputElem.children.length;
            inputElem.style.paddingTop = "calc(12px * " + items + ")";
          }
          if (inputElem.innerHTML == "<br>") {
            inputElem.innerHTML = "";
          }
          msgarea.style.height =
            chatifyElem.offsetHeight -
            input.offsetHeight -
            title.offsetHeight +
            "px";
        }, 1);

        divToCreate.append(chatifyElem);
      });
    } else {
      document.querySelectorAll(".chatify").forEach((chatifydom) => {
        chatifydom.remove();
      });
      console.error(
        "[ChatifyJS] >> If you are using more than one chatify chat, please consider setting the `id` attribute."
      );
    }
  },

  loadStyles: (options, theme) => {
    function getActualSetting(optionname) {
      if (options.options) {
        if (options.options[optionname] == null) {
          return chatify.defaultSettings[optionname];
        } else {
          return options.options[optionname];
        }
      } else {
        return chatify.defaultSettings[optionname];
      }
    }

    var csselem = document.createElement("style");
    var styleVars = "";
    Object.keys(theme).forEach((key) => {
      styleVars += "--chatify-theme-" + key + ": " + theme[key] + ";";
    });
    function getVar(varname) {
      return "var(--chatify-theme-" + varname + ")";
    }
    csselem.innerHTML = `
        .chatify *, .chatify {
            font-family: ${
              options.styles.fontFamily
                ? JSON.stringify(options.styles.fontFamily)
                : "Arial, sans-serif"
            };
            ${styleVars}
            color: ${getVar("fg")};
            box-sizing: border-box;
        }
        .chatify-message-area {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            padding: 0px;
            ${
              getActualSetting("smoothScroll") ? "scroll-behavior: smooth;" : ""
            }
        }
        .chatify-message {
            width: 100%;
            padding: 12px;
            display:flex;
            gap: 10px;
            animation-name: loadMessage;
            animation-duration: 0.2s;
            animation-timing-function: ease-in-out;
        }
        code *, code {
        font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace !important;
        }
        code, pre {
        background-color: ${getVar("preBg")}!important;
        border-radius: 10px;
        }
        .chatify {
            width: 100%;
            height: 100%;
            background: ${getVar("bg")};
        }
        .chatify-titleBar {
            background: ${getVar("menu")};
            width: 100%;
            padding: 12px;
            display: flex;
            align-items: center;
        }
        .chatify-right {
            margin-left: auto;
        }
        .chatify-user-pfp {
        display: flex;
        }
        .chatify-user-pfp img {
        ${
          !getActualSetting("transparentProfilePictures")
            ? "background-color: rgba(0, 0, 0, .1);"
            : ""
        }
        ${
          getActualSetting("roundProfilePictures")
            ? "border-radius: 1000000px;"
            : ""
        }
        width: 50px;
        height: 50px;
        }
        
.chatify-message-area {
            overflow-x: hidden;
}
        .chatify-message-right {
        justify-content: right;
          ${
            getActualSetting("scrollanimation") == "inside"
              ? "animation-name: loadMessage-inside-rightMessage!important;"
              : ""
          }
        }
        .chatify-message-right .chatify-message-content {
        align-items: end;
        }
        
        .chatify-message-content {
        display: flex;
        flex-direction: column;
        width: 100%;overflow-x: hidden;
        }
        .chatify-message-content b {
        display: inline-block;
        width: fit-content;
        }
        .chatify-message-right .chatify-message-content > div {
        background-color: ${getVar("msgBg")};
        padding: 8px 12px;
        border-radius: 10px;
        border-top-right-radius: 0px;
        height: 100%;
        overflow-x: hidden;
        max-width: 100%;
        word-break: break-word;
        }
        .chatify-inputBar {
            padding: 0px;
        }
        .chatify, .chatify * {
            transition-duration: 0.1s;
        }
        .chatify button {
            border: 0px;
            border-radius: 4px;
            background: 0;align-items: center;
display: flex;
        }
        .chatify button img {
            width: 20px;
        }
        
        .chatify-inputBar .chatify-input {
            padding: calc(var(--title-bar-padding)/ 2);
            font-size: calc(var(--title-bar-padding) + 3px);
            --title-bar-padding: 14px;
            outline: none;
            border: none;
            width: 100%;
            overflow: visible;
        }
        .chatify-input[placeholder]:empty::before {
            content: attr(placeholder);
            opacity: 0.8;
        }
        @keyframes loadMessage {
          ${
            getActualSetting("scrollanimation") == "left"
              ? "0% {transform: translateX(10px); opacity: 0;} 100% {transform: translateX(0px); opacity: 1;}"
              : getActualSetting("scrollanimation") == "right" ||
                getActualSetting("scrollanimation") == "inside"
              ? "0% {transform: translateX(-10px); opacity: 0;} 100% {transform: translateX(0px); opacity: 1;}"
              : getActualSetting("scrollanimation") == "top"
              ? "0% {transform: translateY(-10px); opacity: 0;} 100% {transform: translateY(0px); opacity: 1;}"
              : getActualSetting("scrollanimation") == "bottom"
              ? "0% {transform: translateY(10px); opacity: 0;} 100% {transform: translateY(0px); opacity: 1;}"
              : ""
          }
        }
        @keyframes loadMessage-inside-rightMessage {
          0% {transform: translateX(10px); opacity: 0;} 100% {transform: translateX(0px); opacity: 1;}
        }
        .chatify-inputBar {
            overflow-y: auto;
            overflow-x: auto;
            scrollbar-width: thin;
            max-height: 234px;
        }
        .chatify-message-content p {
        margin: 0px;
        margin-top: 5px;
        margin-bottom: 5px;
        }
        .chatify-message-area {
        overflow-y: auto;
        scrollbar-color: ${getVar("msgAreaScrollbarClick")} ${getVar(
      "msgAreaScrollbarBG"
    )};
        }
        `;
    document.head.prepend(csselem);
  },

  loadMessages: (messages, users, dom) => {
    var loadAnimationTimeout = 0.03;
    var actualTimeout = 0;
    messages.forEach((message) => {
      var messageDOM = document.createElement("div");
      messageDOM.classList.add("chatify-message");
      var userinfo = chatify.getUserInfo(message.user, users);
      messageDOM.setAttribute("chatify-user-id", userinfo.id);
      var backSibling =
        dom.querySelectorAll(".chatify-message")[
          dom.querySelectorAll(".chatify-message").length - 1
        ];

      var insideBorderRadius = "2px";

      if (backSibling) {
        if (backSibling.getAttribute("chatify-user-id") == userinfo.id) {
          backSibling.style.paddingBottom = "1px";
          backSibling.querySelector(
            ".chatify-message-content > div"
          ).style.borderBottomRightRadius = insideBorderRadius;
          messageDOM.style.paddingTop = "1px";
        }
      } else {
        console.log(dom.querySelectorAll(".chatify-message"));
      }
      var converter = new showdown.Converter();
      var content = converter.makeHtml(message.content);
      var messageparts = [
        `<div class="chatify-user-pfp">
                    <img src="${
                      userinfo.avatar
                    }" loading="lazy" alt="" style="${
          backSibling
            ? backSibling.getAttribute("chatify-user-id") == userinfo.id
              ? "opacity: 0;"
              : ""
            : ""
        }">
                </div>`,
        `<div class="chatify-message-content">
                    ${
                      backSibling
                        ? backSibling.getAttribute("chatify-user-id") !=
                          userinfo.id
                          ? `<b>${userinfo.name}</b>`
                          : ""
                        : `<b>${userinfo.name}</b>`
                    }
                    <div style="border-top-right-radius: ${insideBorderRadius}; ${
          backSibling
            ? backSibling.getAttribute("chatify-user-id") == userinfo.id
              ? `border-top-right-radius: ${insideBorderRadius};`
              : ""
            : ""
        }">
                        ${content}
                    </div>
                </div>`
      ];

      if (userinfo.type == "client") {
        messageDOM.classList.add("chatify-message-right");
        [messageparts[0], messageparts[1]] = [messageparts[1], messageparts[0]];
      }

      var msgcontentdom = "";
      messageparts.forEach((part) => {
        msgcontentdom += part;
      });
      messageDOM.innerHTML = msgcontentdom;

      if (messages.length >= 2) {
        setTimeout(() => {
          dom.appendChild(messageDOM);
          dom.scrollTop = dom.scrollHeight;
        }, actualTimeout);
        actualTimeout += loadAnimationTimeout * 1000;
      } else {
        dom.appendChild(messageDOM);
      }
      dom.scrollTop = dom.scrollHeight;
      Prism.highlightAll();
    });
  },

  getUserInfo: (id, users) => {
    var userreturn = {};
    users.forEach((user) => {
      if (user.id === id) {
        userreturn = user;
      }
    });
    return userreturn;
  },

  getClientUser: (users) => {
    var userreturn = {};
    users.forEach((user) => {
      if (user.type === "client") {
        userreturn = user;
      }
    });
    return userreturn;
  },

  theme: {
    light: {
      name: "light",
      type: "light",
      content: {
        bg: "#CCCAD2",
        fg: "#373737",
        msgBg: "rgba(0, 0, 0, .05)",
        preBg: "rgb(205, 205, 207)",
        menu: "#D9D9D9",
        rgba: "0, 0, 0",
        msgAreaScrollbarBG: "transparent",
        msgAreaScrollbarClick: "rgba(0, 0, 0, .15)"
      }
    },
    dark: {
      name: "dark",
      type: "dark",
      content: {
        bg: "#1A1821",
        fg: "#d0d0d0",
        msgBg: "rgba(255, 255, 255, .11)",
        preBg: "rgb(45, 43, 50)",
        menu: "#25232E",
        rgba: "255, 255, 255",
        msgAreaScrollbarBG: "transparent",
        msgAreaScrollbarClick: "rgba(255, 255, 255, .20)"
      }
    }
  },

  defaultSettings: {
    darkModeBtn: true,
    markdown: true,
    uploadImages: true,
    placeholder: "Write...",
    smoothScroll: true,
    scrollbarWidth: "thin",
    transparentProfilePictures: false,
    roundProfilePictures: true,
    automaticScroll: true,
    scrollanimation: "up"
  },

  loadLibraries: async (themeType) => {
    function loadJS(url) {
      return new Promise((resolve, reject) => {
        var script = document.createElement("script");
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.getElementsByTagName("head")[0].appendChild(script);
      });
    }

    function loadCSS(url) {
      return new Promise((resolve, reject) => {
        var link = document.createElement("link");
        link.href = url;
        link.rel = "stylesheet";
        link.onload = resolve;
        link.onerror = reject;
        document.getElementsByTagName("head")[0].appendChild(link);
      });
    }

    if (themeType == "light") {
      await loadCSS(
        "https://swiftlystatic.vercel.app/chatifyjs/light-prism.css"
      );
    } else {
      await loadCSS(
        "https://swiftlystatic.vercel.app/chatifyjs/dark-prism.css"
      );
    }
    await loadJS("https://swiftlystatic.vercel.app/chatifyjs/prism.js");
    await loadJS("https://swiftlystatic.vercel.app/chatifyjs/showdown.min.js");
  }
};
