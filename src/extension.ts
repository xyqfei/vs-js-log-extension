import * as vscode from "vscode";
const open = require('open');

const iconList = ['🦑', '🦐', '🦀', '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥒', '🌶', '🌽', '🥕', '🥔', '🥐', '🍠', '🍞', '🥖', '🥨', '🧀', '🥚', '🥞', '🥓', '🥩', '🍗', '🍖', '🌭', '🍔', '🍟', '🍕', '🥪', '🌮', '🌯', '🥘', '🥗', '🍝', '🥫', '🥘', '🍜', '🍲', '🍝', '🍛', '🍣', '🍱', '🥟', '🍤', '🍚', '🍥', '🥠', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼️', '🍵', '🥤', '🍶', '🍺', '🍻', '🍷', '🥃', '🍸', '🍹', '🍾', '🥡'];
const colorList = ["#42b983", "#33A5FF", "#B03734", "#2EAFB0", "#6EC1C2", "#ED9EC7", "#FCA650", "#3F7CFF", "#93C0A4", "#EA7E5C", "#F5CE50", "#465975", "#FFDD4D", "#7F2B82", "#4b4b4b", "#E41A6A"];


const insertText = (val: string) => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage(
      "Can't insert log because no document is open"
    );
    return;
  }

  const selection = editor.selection;

  const range = new vscode.Range(selection.start, selection.end);

  editor.edit((editBuilder) => {
    editBuilder.replace(range, val);
  });
};

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "js-log" is now active!');

  const insertLogStatement = vscode.commands.registerCommand(
    "extension.insertJSLog",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const selection = editor.selection;
      const text = editor.document.getText(selection);
      const iconIndex = Math.floor(Math.random() * iconList.length);
      const colorIndex = Math.floor(Math.random() * colorList.length);
      const style = `font-size:20px;background-color: ${colorList[colorIndex]};color:#fff;`;
      const str = `${text}`.replace(/\'|\"/g, "");

      text
        ? vscode.commands
            .executeCommand("editor.action.insertLineAfter")
            .then(() => {
              const logToInsert = `console.log('%c ${iconList[iconIndex]} ${str}: ', '${style}', ${text})`;
              insertText(logToInsert);
            })
        : insertText(
            `console.log('%c ${iconList[iconIndex]} ${str}: ', '${style}', 'log')`
          );
    }
  );
  const insertBaidu = vscode.commands.registerCommand(
    "extension.insertBaidu",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const selection = editor.selection;
      const text = editor.document.getText(selection);
     
      open(`https://www.baidu.com/s?ie=UTF-8&wd=${text}`, 'chrome');
    }
  );
  context.subscriptions.push(insertLogStatement);
  context.subscriptions.push(insertBaidu);
}

export function deactivate() {}
