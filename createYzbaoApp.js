const {Command} = require('commander');
const program = new Command();
const packageJson = require('./package.json');
const inquirer = require('inquirer');
const download = require('download-git-repo');
const path = require('path');
const spawn = require('cross-spawn');

function init() {
  // 1. 定义npx create-yzbao-app 命令
  // 2. 拿到命令npx create-yzbao-app <app-name> 中的appName
  // 3. 执行createYzbaoApp函数

  program.name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version)
  .arguments('<app-name>')
  .usage(`${packageJson.name} <app-name>`)
  // .option('-f, --force', 'Overwrite target directory if it exists')
  .action((name, options) => {
    createYzbaoApp(name, options);
  }).parse(process.argv);
 
}

function createYzbaoApp(name, options) {
  // 1. 询问要使用哪个模版
  // 2. 调用download-git-repo下载模版
  inquirer.prompt([{
    name: 'template',
    type: 'list',
    choices: ['vue2', 'vue3', 'react'],
    message: '请选择要使用的模版'
  }]).then(answers => {
    console.log('已选择',answers);
    downloadTemplate(name,answers.template);
  }).catch(error => {});
  
}

function downloadTemplate(name, template) {
  // 1. 下载模版
  // 2. 将模版解压到当前命令执行的目录
  const target = path.resolve(process.cwd(), name);
  console.log('target', target);
  download('yzbaoo/cra-template-recoil', target, {clone: false}, (err) => {
    if (err) {
      console.log('下载失败', err);
    } else {
      console.log('下载成功');
      installDependencies(target);
    }
  });
}

function installDependencies(target) {
  // 1. 进入到创建的项目目录
  // 2. 执行npm install或者yarn install
  const command = 'yarn';
  const args = ['install'];
  const child = spawn(command, args, {stdio: 'inherit', cwd: target});
  child.on('close', code => {
    if (code !== 0) {
      console.error(`安装失败`);
      return;
    }
    console.log(`安装成功`);
  });
}


module.exports = {init};
