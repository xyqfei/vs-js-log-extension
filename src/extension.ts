import * as vscode from 'vscode';
const open = require('open');
// const mdExampleFile = require('./markdownExample.md');
const path = require('path');
import { gen } from './gen/index';

// prettier-ignore
const iconList = ['🦑', '🦐', '🦀', '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥒', '🌶', '🌽', '🥕', '🥔', '🥐', '🍠', '🍞', '🥖', '🥨', '🧀', '🥚', '🥞', '🥓', '🥩', '🍗', '🍖', '🌭', '🍔', '🍟', '🍕', '🥪', '🌮', '🌯', '🥘', '🥗', '🍝', '🥫', '🥘', '🍜', '🍲', '🍝', '🍛', '🍣', '🍱', '🥟', '🍤', '🍚', '🍥', '🥠', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼️', '🍵', '🥤', '🍶', '🍺', '🍻', '🍷', '🥃', '🍸', '🍹', '🍾', '🥡'];
// prettier-ignore
const colorList = ["#42b983", "#33A5FF", "#B03734", "#2EAFB0", "#6EC1C2", "#ED9EC7", "#FCA650", "#3F7CFF", "#93C0A4", "#EA7E5C", "#F5CE50", "#465975", "#FFDD4D", "#7F2B82", "#4b4b4b", "#E41A6A"];

const insertText = (val: string) => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage(
      "Can't insert log because no document is open",
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
    'extension.insertJSLog',
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
      const str = `${text}`.replace(/\'|\"/g, '');

      text
        ? vscode.commands
            .executeCommand('editor.action.insertLineAfter')
            .then(() => {
              const logToInsert = `console.log('%c ${iconList[iconIndex]} ${str}: ', '${style}', ${text})`;
              insertText(logToInsert);
            })
        : insertText(
            `console.log('%c ${iconList[iconIndex]} ${str}: ', '${style}', 'log')`,
          );
    },
  );
  const insertBaidu = vscode.commands.registerCommand('extension.baidu', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);

    open(`https://www.baidu.com/s?ie=UTF-8&wd=${text}`, 'chrome');
  });

  const mdExample = vscode.commands.registerCommand(
    'extension.mdExample',
    () => {
      // 引入 markdownExample.md 文件
      const uri = vscode.Uri.file(
        path.join(context.extensionPath, 'markdownExample.md'),
      );

      vscode.workspace.openTextDocument(uri).then((document) => {
        vscode.window.showTextDocument(document);
      });
    },
  );

  const delLogStatement = vscode.commands.registerCommand(
    'extension.delJSLog',
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }
      editor.edit((editBuilder) => {
        const document = editor.document;
        const lineCount = document.lineCount;
        let startConsoleLogLine = 0;
        let inConsoleLog = false;

        for (let i = 0; i < lineCount; i++) {
          const lineText = document.lineAt(i).text;

          if (lineText.includes('console.log')) {
            if (!inConsoleLog) {
              inConsoleLog = true;
              startConsoleLogLine = i;
            }
          }

          if (
            inConsoleLog &&
            (lineText.includes(');') || lineText.includes('}'))
          ) {
            const range = new vscode.Range(
              new vscode.Position(startConsoleLogLine, 0),
              new vscode.Position(i + 1, 0),
            );
            editBuilder.delete(range);
            inConsoleLog = false;
          }
        }
      });
    },
  );

  const genSnippets = vscode.commands.registerCommand(
    'extension.genSnippets',
    async (name: string) => {
      const snippets = await gen(name, context);
      insertText(snippets || '');
    },
  );

  const genArticleListDetailSnippets = vscode.commands.registerCommand(
    'extension.genArticleListDetailSnippets',
    () => {
      vscode.commands.executeCommand(
        'extension.genSnippets',
        'articleListDetail',
      );
    },
  );
  const genArticleListSnippets = vscode.commands.registerCommand(
    'extension.genArticleListSnippets',
    () => {
      vscode.commands.executeCommand('extension.genSnippets', 'articleList');
    },
  );
  const genPolicyLibarySnippets = vscode.commands.registerCommand(
    'extension.genPolicyLibarySnippets',
    () => {
      vscode.commands.executeCommand('extension.genSnippets', 'policyLibary');
    },
  );
  const genServiceListSnippets = vscode.commands.registerCommand(
    'extension.genServiceListSnippets',
    () => {
      vscode.commands.executeCommand('extension.genSnippets', 'serviceList');
    },
  );
  const genDictionarySnippets = vscode.commands.registerCommand(
    'extension.genDictionarySnippets',
    () => {
      vscode.commands.executeCommand('extension.genSnippets', 'dictionary');
    },
  );

  context.subscriptions.push(insertLogStatement);
  context.subscriptions.push(delLogStatement);
  context.subscriptions.push(insertBaidu);
  context.subscriptions.push(mdExample);
  context.subscriptions.push(genSnippets);
  context.subscriptions.push(genArticleListDetailSnippets);
  context.subscriptions.push(genArticleListSnippets);
  context.subscriptions.push(genPolicyLibarySnippets);
  context.subscriptions.push(genServiceListSnippets);
  context.subscriptions.push(genDictionarySnippets);
}

export function deactivate() {}
