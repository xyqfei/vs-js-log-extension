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

export const gen = (name: string, context: vscode.ExtensionContext) => {
  const params = {
    aaa: 1,
    bbb: 2,
    ccc: 3,
  };
  const templatePath = path.join(context.extensionPath, nameFileMap[name]);
  const template = fs.readFileSync(templatePath, 'utf-8');
  const rendered = ejs.render(template, { params });
  return rendered;
};
