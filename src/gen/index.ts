import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

const nameFileMap: { [key: string]: string } = {
  articleListDetail: 'src/snippets/articleListDetail.ejs',
  articleList: 'src/snippets/articleList.ejs',
  policyLibary: 'src/snippets/policyLibary.ejs',
  serviceList: 'src/snippets/serviceList.ejs',
};

// vscode extension 获取复制内容
const getClipBoradContent = () => {
  // 获取剪贴板
  const clipboard = vscode.env.clipboard;
  // 从剪贴板中读取文本内容
  const clipboardText = clipboard.readText();
  return clipboardText;
};

export const gen = async (name: string, context: vscode.ExtensionContext) => {
  const text = await getClipBoradContent();
  const regex = /([a-zA-Z]+)=([a-zA-Z0-9]+)/g;
  let match;
  const params: { [key: string]: string | number } = {};

  while ((match = regex.exec(text)) !== null) {
    const key = match[1];
    const value = String(match[2]);
    params[key] = value;
  }

  const templatePath = path.join(context.extensionPath, nameFileMap[name]);
  const template = fs.readFileSync(templatePath, 'utf-8');
  const rendered = ejs.render(template, { params });
  return rendered;
};