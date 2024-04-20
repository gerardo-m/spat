
/**
 * @name spat
 * @version 0.2.0
 * @author Gerardo Miranda - https://github.com/gerardo-m
 * @license MIT
 * 
 * A simple "Static PAge Translator" with no dependencies
 */
class Spat{

    _translations;
    _defaultLanguage = 'en';
    _language;
    _languageDir = 'spat';

    _defineLanguage(){
        if (this._language == undefined) this._language = localStorage.getItem('language');
        if (this._language == null) this._language = document.documentElement.lang;
        if (this._language.trim().length == 0)  this._language = this._defaultLanguage;
    }

    async _fetchLanguage(){
        this._defineLanguage();
        const url = this._languageDir + '/' +  this._language + '.json';
        const response = await fetch(url);
        if (response.status != 200){
            console.warn(`Language file not provided: ${this._language}`);
            this._language = undefined;
            this._defineLanguage();
            return;
        } 
        localStorage.setItem('language', this._language);
        this._translations = await response.json();
    }

    async _replaceStrings(){
        await this._fetchLanguage();
        const values = Object.values(this._translations);
        const keys = Object.keys(this._translations);
        for (let valueIndex = 0; valueIndex < keys.length; valueIndex++) {
            const element = document.getElementById(keys[valueIndex]);
            if (element == null) continue;
            this._processElement(element, values[valueIndex]);
        }
    }

    _processElement(element, value){
        if ((typeof value) == "string"){
            var ch = element.childNodes;
            for (let i = 0; i < ch.length; i++) {
                const node = ch[i];
                if (node.nodeType === 3){ // 3 = TEXT_NODE
                    node.nodeValue = value;
                    break;
                }
            }
            return;
        }
        if (Array.isArray(value)){
            element.replaceChildren(...this._createNodesFromArray(value));
        }
    }

    _createNodesFromArray(array){
        console.log("creating nodes");
        var nodes = [];
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            const tag = element["tag"];
            if (tag == undefined){
                const value = element["value"] || '';
                console.log(value);
                nodes.push(document.createTextNode(value));
                continue;
            }
            const node = document.createElement(tag);
            const value = element["value"];
            node.append(value);
            this._createAttributesForNode(node, element);
            nodes.push(node);
        }
        return nodes;
    }

    _createAttributesForNode(node, jsonElement){
        const keys = Object.keys(jsonElement);
        for (let index = 0; index < keys.length; index++) {
            if (keys[index] == "tag" || keys[index] == "value") continue;
            const value = jsonElement[keys[index]];
            node.setAttribute(keys[index], value);
        }
    }

    setLanguage(lang) {
        if (lang == this._language) return;
        this._language = lang;
        this._replaceStrings();
    }

    setDefaultLanguage(lang){
        this._defaultLanguage = lang;
    }

    setLanguageDirectory(dir){
        this._languageDir = dir;
    }

}

function ready(callback){
    if (document.readyState != 'loading') callback();
    else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
    else document.attachEvent('onreadystatechange', function(){
        if (document.readyState=='complete') callback();
    });
}

const spat = new Spat();

ready(function(){
    spat._replaceStrings();
})