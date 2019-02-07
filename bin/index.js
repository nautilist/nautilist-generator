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

const generator = require('../helpers/generator/generator.js');


program
	.option('-v, --version', 'Show version of nautilist-generator', pjson.version)


program
  .command('generate <ymlFile>')
  .alias('g')
  .description('Generate a static page from your .yml list')
  .action(function(req, opt) {
    generator.make(req, opt)
  })

program
  .command('validate <ymlFile>')
  .description('Validate using yaml linter for your .yml list')
  .action(function(req, opt) {
    // Get document, or throw exception on error
    try {
      const doc = yaml.safeLoad(fs.readFileSync(req, 'utf8'));
      const parsedYaml = yaml.safeDump(doc);
      console.log('🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈')
      console.log(parsedYaml)
      console.log("Success - your list is beautiful!")
      console.log('🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈')
      
    } catch (e) {
      console.log('⚠️⚠️⚠️️⚠️⚠️️⚠️⚠️️⚠️⚠️️⚠️⚠️')
      console.log(e.message);
      console.log("Oh no! Something is wrong with your file!")
      console.log('⚠️⚠️⚠️️⚠️⚠️️⚠️⚠️️⚠️⚠️️⚠️⚠️')
      
    }
  })


if (program.version) {
  console.log('nautilist-generator version ' + pjson.version);
}

program.parse(process.argv);
