const { execSync } = require('child_process');
var fs = require('fs');

console.log(process.argv)
if (process.argv[2] === 'dev') {
  console.log('checking if settings already exist...');
  if (!fs.existsSync(__dirname + '/../public/settings.json')) {
      console.log('copying dev settings over');
      fs.copyFileSync(__dirname + '/../settings.dev.json', process.cwd() + '/public/settings.json');
  } else {
    console.log('settings exist...doing nothing')
  }
} else if (process.argv[2] === 'prod') {
  const gitInfo = execSync('git describe --tags --long').toString();
  console.log('Packaging version ' + gitInfo);

  let prodConfig = JSON.parse(fs.readFileSync(__dirname + '/../settings.prod.json', 'utf8'));
  prodConfig.version = gitInfo.replace('\r', '').replace('\n', '');

  if (!fs.existsSync(__dirname + '/../build')){
    fs.mkdirSync(__dirname + '/../build');
  }
  fs.writeFileSync(__dirname + '/../build/settings.json', JSON.stringify(prodConfig, null, 2), 'utf8');
}