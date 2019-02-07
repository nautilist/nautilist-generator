# nautilist-generator
A node.js commandline generator tool for generating static sites with Nautilist formatted YAML 

![Generator Image](assets/generator.png)

## Install
> Install the commandline tool by running the following

```sh
npm i -g nautilist-generator
```

## Usage

### validate
```sh
nautilist-generator validate my-super-list.yaml
```
> Validate your `.yaml` file

### generate
```sh
nautilist-generator generate my-super-list.yaml
```
> Generate a static HTML site with using the `.yaml` list you created 

This will produce an `index.html` file inside of a folder with the name of the list you've created. If you are generating from `my-super-awesome-list`, then you'll get: `e.g. my-super-awesome-list/index.html`


## Examples
> Check the `/examples` directory for examples of what happens when you run the generator on your list

👉 [Examples folder here](/examples)


## Features (forthcoming, not yet implemented 🌴)
> Some features that are forthcoming

### Live Reload 
> As you're editing your yaml, update the view in the browser


### Markdown to YAML Converter
> Convert markdown to YAML

### Create a MultiList from multiple SingleList lists
> Mash a bunch of SinleList lists into a MultiList


