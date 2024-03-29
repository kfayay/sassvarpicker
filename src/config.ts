import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

interface Config {
  scssPaths: { path: string; alias: string }[];
}

/**
 * 功能描述：配置文件获取
 * 获取途径：
 * 1. vsode 配置文件（不推荐，配置不可见，修改不方便，不可共享）
 * 2. 读取配置文件
 * 配置文件定义：
 * json格式，sassvarpicker.json
 * 配置结构定义：
 * {
 *  path: string,
 *  alias?: string
 * }[]
 * 输出格式
 * {
 *  varName: string;
 *  value: string;
 *  path: string;
 *  alias: string
 * }[]
 * 边界情况：
 * 1. 未配置 config 情况
 * 2. config 配置文件无效
 * 最终结果都是输出为空
 */

export type ColorVar = {
  varName: string;
  value: string;
  path: string;
  alias: string;
};

function readFileSync(filePath: string) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  const workspaceRootPath = workspaceFolders?.[0]?.uri.path;

  if (!workspaceRootPath) {
    new Error();
    return '';
  }

  return fs.readFileSync(path.join(workspaceRootPath, filePath), 'utf-8');
}

export type ColorVars = ColorVar[];

export function getColorVars(): ColorVars {
  let config: Config;

  try {
    config = JSON.parse(readFileSync('./sassvarpickerc.json'));
  } catch (error) {
    console.error('Error reading config file:', error);
    return [];
  }

  const colors: {
    varName: string;
    value: string;
    path: string;
    alias: string;
  }[] = [];

  config.scssPaths.forEach(({ path: scssPath, alias }) => {
    const scssContent = readFileSync(scssPath);
    const colorRegex = /\$([a-zA-Z0-9_-]+):\s*(#[a-zA-Z0-9]+);/g;

    let match;
    while ((match = colorRegex.exec(scssContent)) !== null) {
      colors.push({
        varName: match[1],
        value: match[2],
        path: scssPath,
        alias,
      });
    }
  });

  return colors;
}
