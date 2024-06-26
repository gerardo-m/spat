<p align="center">
    <h1 align="center">Spat</h1>
    <p align="center">
      <a href="https://raw.githubusercontent.com/gerardo-m/spat/master/dist/spat.min.js">
        <img align="center" src="https://img.shields.io/github/size/gerardo-m/spat/dist/spat.min.js" alt="Spat size.">
      </a>
      <a href="https://raw.githubusercontent.com/gerardo-m/spat/master/LICENSE">
        <img align="center" src="https://img.shields.io/github/license/gerardo-m/spat" alt="Spat license.">
      </a>
      <a href="https://raw.githubusercontent.com/gerardo-m/spat/master/dist/spat.min.js">
        <img align="center" src="https://img.shields.io/jsdelivr/gh/hy/gerardo-m/spat" alt="Spat hits.">
      </a>
    </p>
</p>



A very simple "Static PAge Translator" in javascript (no dependencies).

## Quick start

- Be sure that all elements you want to translate have unique ids
```html
<h1 id="my-title">Some value</h1>
```
- Create a folder named "spat" at the root of your site, and add a json file for every language you want to support:

**en.json**
```json
{
    "my-title": "My title"
}
```

**es.json**
```json
{
    "my-title": "Mi título"
}
```
- Include Spat in your html file
```html
<script src="https://cdn.jsdelivr.net/gh/gerardo-m/spat@master/dist/spat.min.js"></script>
<!--- or you can download the file and include it like this -->
<script src="spat.min.js"></script>
```
- Add the function for changing the language to some action element: `spat.setLanguage('<language>')`
```html
<button onclick="spat.setLanguage('en')">English</button>
<button onclick="spat.setLanguage('es')">Español</button>
```

- Contemplate the magic happening.

## Initialization options
### Default language
The first time the page is accesed it will take the language from the html tag
```html
<html lang="en">
```
If the lang attribute is not set the default language will be set to 'en'.

To change the default language add a script right after the reference to Spat
```html
<script>
    spat.setDefaultLanguage('es');
</script>
```

Once the language is set it will be stored in local storage, so the selection will be preserved after refreshing the page.

### Language files directory
By default Spat will look for a directory called 'spat' for the json files, you can overwrite this behavior by calling the `setLanguageDirectory` method
```html
<script>
    spat.setLanguageDirectory('custom-dir-name');
</script>
```

## How Spat works

Spat works by a simple mechanism, taking a json file where the keys represent the ids of the html elements and the value is the translation. For every key it will search for the element with that id and replace its content with the translation.

How it replaces the content of the element will depend on the value provided by the json file:

### Simple text

```json
{
  "content": "this is content"
}
```

If the language file contains only a string spat will not replace the entire content of the element, just the first Text Node it encounters. This means it will not affect nested elements e.g:
```html
<p id="content">This text will be translated <b>This text will not</b> And neither this one</p>
```
Since it is replacing the first text node it will not replace an empty text
```html
<!-- this will not show -->
<p id="p1"></p>
<!-- this will show -->
<p id="p2"> </p>
<!-- this will show as well -->
<p id="p3">
</p>
```
### Rich text

```json
"rich-text": [
  {
    "value": "Normal text "
  },
  {
    "tag": "b",
    "value": "Bold text "
  },
  {
    "tag": "a",
    "value": "Link",
    "href": "https://www.google.com"
  }
]
```
Spat supports rich text in the format above, the value of the id we want to translate should contain an Array and every element represents a node that will be created. 

For every element if the `tag` attribute is present it will create an HTML element with that tag name and a single child with the value of the `value` attribute. Any other attribute that is contained in the element will be parsed as an Attribute for the HTML element.

If the `tag` attribute is not present, it will create a text node with the value of the `value` attribute.

The json snippet from above will generate the following content for the target element:
```html
Normal text 
<b>Bold text </b>
<a href="https://www.google.com">Link</a>
```
***WARNING:** When using this functionality Spat WILL REPLACE the entire content of the target element

## ROADMAP

- Add some tooling to generate the language files
- Continue improving this README