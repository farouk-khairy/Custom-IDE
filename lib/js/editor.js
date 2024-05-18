let body = `
<div class="editor">
<div class="editor__wrapper">
  <div class="editor__body">
    <div id="editorCode" class="editor__code"></div>
  </div>
  <div class="editor__footer">
    <div class="editor__footer__left">
      <button class="editor__btn editor__run">Run</button>
      <button class="editor__btn editor__reset">Reset</button>
    </div>
    <div class="editor__footer__right">
      <div class="editor__console">
        <ul class="editor__console-logs"></ul>
      </div>
    </div>
  </div>
</div>
</div>

`;
document.body.innerHTML = body;

var cssId = "myCss"; // you could encode the css path itself to generate id..
if (!document.getElementById(cssId)) {
  var head = document.getElementsByTagName("head")[0];
  var link = document.createElement("link");
  link.id = cssId;
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "lib/css/editor-styles.css";
  link.media = "all";
  head.appendChild(link);
}

const consoleLogList = document.querySelector(".editor__console-logs");
const runBtn = document.querySelector(".editor__run");
const resetBtn = document.querySelector(".editor__reset");
//init ace lib
let codeEditor = ace.edit("editorCode");
let consoleMessages = [];
let editorLib = {
  clearConsoleScreen() {
    consoleMessages.length = 0;
    while (consoleLogList.firstChild) {
      consoleLogList.removeChild(consoleLogList.firstChild);
    }
  },
  printToConsole() {
    localStorage.clear();
    consoleMessages.forEach((log) => {
      const newLogItem = document.createElement("li");
      const newLogText = document.createElement("pre");

      newLogText.className = log.class; // log log--string
      newLogText.textContent = `> ${log.message}`;

      newLogItem.appendChild(newLogText);

      consoleLogList.appendChild(newLogItem);

      stringResult = new String(log.message);
      let newResult = {
        result: stringResult,
      };

      fetch(`https://6648aa034032b1331bec0a64.mockapi.io/logs/1`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(newResult),
      }).then((res) => res.json());
    });
  },
  init() {
    //set theme
    codeEditor.setTheme("ace/theme/dracula");
    //set lang
    codeEditor.session.setMode("ace/mode/javascript");
    //set option
    codeEditor.setOptions({
      fontSize: `12pt`,
    });
  },
};

//run btn
runBtn.addEventListener(`click`, () => {
  editorLib.clearConsoleScreen();
  //get the user code
  const userCode = codeEditor.getValue();
  // run the user code
  try {
    new Function(userCode)();
  } catch (err) {
    console.log(err);
  }
  // print to the console
  editorLib.printToConsole();
});

//reset btn
resetBtn.addEventListener(`click`, () => {
  codeEditor.setValue("");
  editorLib.clearConsoleScreen();
});
editorLib.init();
