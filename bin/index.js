#!/usr/bin/env node

/**
 * Module dependencies.
 */
const program = require('commander');
const pjson = require('../package.json');
const yaml = require('js-yaml');
const fs   = require('fs');
const html = require('choo/html')
const choo = require('choo')
const path = require('path')
const slug = require('slug')

program
	.option('-v, --version', 'Show version of nautilist-generator', pjson.version)


program
  .command('generate <ymlFile>')
  .alias('g')
  .description('Generate a static page from your .yml list')
  .action(function(ymlFile) {
    // generator.collection(req, opt);
    console.log(ymlFile)
    // Get document, or throw exception on error
    try {
      const doc = yaml.safeLoad(fs.readFileSync(ymlFile, 'utf8'));
      const parsedYaml = yaml.safeDump(doc);
      console.log(parsedYaml)
      let htmlString =''
      
      if(doc.type == "MultiList"){
        htmlString = makeMultiList(doc, parsedYaml);
      } else if (doc.type == "SingleList"){
        htmlString = makeSingleList(doc, parsedYaml);
      } else{
        return new Error("not a SingleList or MultiList")
      }
      

      const outputName = path.dirname(ymlFile) + "/" + slug(doc.name) + '.html'
      writeIndex(outputName , htmlString)

    } catch (e) {
      console.log(e);
    }
  })

// program
//   .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
//   .parse(process.argv);

// program
//   .arguments('<file>')
//   .option('-b, --build <username>', 'The user to authenticate as')
//   .option('-p, --password <password>', 'The user\'s password')
//   .action(function(file) {
//     console.log('user: %s pass: %s file: %s',
//     program.username, program.password, file);
//   })
//   .parse(process.argv);


if (program.version) {
  console.log('nautilist-generator version ' + pjson.version);
}

program
.parse(process.argv);


function loadFile(name) {
	return fs.readFileSync(path.join(__dirname, name), 'utf-8');
}

function writeIndex(path, str) {
	fs.writeFileSync(path, str);
}


function linkList(list){
  return html`
  <fieldset class="w-100 ba br2 b--black">
  <legend>Featured list</legend>
  <ul class="list pl0 w-100 flex flex-column">
    ${
      list.features.map( (feature, idx) => {
        return linkEl(feature)
      })
    }
  </ul>
  </fieldset>
  `
}

function linkEl(feature){
  const colors = [ 
    "#FF725C", "#FFD700", "#FF80CC", "#9EEBCF", "#CDECFF", "#A463F2"
  ];
  const selectedColor = colors[Math.floor(Math.random()*colors.length)];
  return html`
    <li class="w-100 flex flex-row-ns flex-column justify-start items-center-ns ba br2 pa2 mb2">
      <div class="w-10-ns w-100 ml2 mr2">
        <div class="h2 w2 bn br2" style="background-color:${selectedColor}"></div>
      </div>
      <div class="w-90-ns w-100 flex flex-row-ns flex-column justify-content-ns justify-start">
        <div class="w-50-ns w-100 flex flex-column pl2 pr2">
          <p class="f6 b">${feature.name}</p>
          <small class="f7"><a href="${feature.url}" target="_blank">${feature.url}</a></small>
        </div>
        <div class="w-50-ns w-100 pl2 pr2">
          <p class="f6 b">${feature.description}<p>
        </div>
      </div>
    </li>
  `
}

function header(feature){
  let headingSize;
  if(feature.type == "MultiList") headingSize = "f1"
  if(feature.type == "SingleList") headingSize = "f2"
  return html`
  <header class="w-100">
    <h1 class="${headingSize} lh-title">${feature.name}</h1>
    <p class="f5">${feature.description}</p>
  </header>
  `
}

function makeSingleList(_data, _parsedYaml){
  const app = choo()
  
  app.route('/', function (state, emit) {
    return html`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Nautilist - ${state.data.name}</title>
      <link rel="stylesheet" href="https://unpkg.com/tachyons@4.10.0/css/tachyons.min.css"/>
    </head>
    <body class="w-100 monaco code lh-copy pa4">
      <div class="w-100 mw8 flex flex-column items-center">
        ${header(state.data)}
        <main>
          ${linkList(state.data)}
          <hr class="b b--light-gray mt4 mb4 pl4 pr4">

          <section class="w-100 mt4 dn flex-ns flex-column">
            <fieldset id="yaml-output" class="ba br2 b--black w-100">
            <legend class="f6 b">YAML in Nautilist Format - Copy and Paste This into another project!</legend>
            <!-- TODO add copy button to get formatted yaml regardless of screensize -->
            <pre class="pre ba br2 pa2 f7 b--light-gray">
${_parsedYaml}
            </pre>
            </fieldset>

            <fieldset id="json-output" class="ba br2 b--black">
            <legend class="f6 b">JSON:</legend>
            <code class="ws-normal ba br2 pa2 f7 b--light-gray">
              ${JSON.stringify(state.data) }
            </code>
            </fieldset>
          </section>
        </main>
        <footer class="h3 flex flex-column justify-end w-100"> <small class="f7">Generated using Nautilist Generator</small></footer>
      </div>
    </body>
    </html>
    `
  })

  var state = { data: _data }
  var string = app.toString('/', state)
  return string;

}

function makeMultiList(_data, _parsedYaml){
  const app = choo()
  
  app.route('/', function (state, emit) {
    return html`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Nautilist - ${state.data.name}</title>
      <link rel="stylesheet" href="https://unpkg.com/tachyons@4.10.0/css/tachyons.min.css"/>
    </head>
    <body class="w-100 monaco code lh-copy pa4">
      <div class="w-100 mw8 flex flex-column items-center">
        ${header(state.data)}
        <main>
          ${
            state.data.features.map( (feature, idx) => {

              return html`
                <section>
                  ${header(feature)}
                  ${linkList(feature)}
                </section>
              `
            })
          }
          
          <hr class="b b--light-gray mt4 mb4 pl4 pr4">

          <section class="w-100 mt4 dn flex-ns flex-column">
            <fieldset id="yaml-output" class="ba br2 b--black w-100">
            <legend class="f6 b">YAML in Nautilist Format - Copy and Paste This into another project!</legend>
            <!-- TODO add copy button to get formatted yaml regardless of screensize -->
            <pre class="pre ba br2 pa2 f7 b--light-gray">
${_parsedYaml}
            </pre>
            </fieldset>

            <fieldset id="json-output" class="ba br2 b--black">
            <legend class="f6 b">JSON:</legend>
            <code class="ws-normal ba br2 pa2 f7 b--light-gray">
              ${JSON.stringify(state.data) }
            </code>
            </fieldset>
          </section>
        </main>
        <footer class="h3 flex flex-column justify-end w-100"> <small class="f7">Generated using Nautilist Generator</small></footer>
      </div>
    </body>
    </html>
    `
  })

  var state = { data: _data }
  var string = app.toString('/', state)
  return string;
    
}

// /**
//  * Module dependencies.
//  */

// const program = require('commander');

// program
//   .version('0.0.1')
//   .option('-b, --build <inputYml>', 'build a page with <inputYml>')
//   .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
//   .parse(process.argv);

// console.log('you ordered a pizza with:');
// if (program.build){

// }
// console.log('  - %s cheese', program.cheese);