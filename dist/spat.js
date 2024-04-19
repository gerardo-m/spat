
/**
 * @name spat
 * @version 0.1.0
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
        var valueIndex = 0;
        Object.keys(this._translations).forEach(function(key) {
            var element = document.getElementById(key);
            if (element == null){
                valueIndex++;return;
            }
            var ch = element.childNodes;
            for (let i = 0; i < ch.length; i++) {
                const node = ch[i];
                if (node.nodeType === 3){ // 3 = TEXT_NODE
                    node.nodeValue = values[valueIndex];
                    break;
                }
            }
            valueIndex++;
        });
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