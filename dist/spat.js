class Spat{

    static _translations;
    static _defaultLanguage = 'en';
    static _language;

    static _defineLanguage(){
        if (Spat._language == undefined) Spat._language = localStorage.getItem('language');
        if (Spat._language == null) Spat._language = document.documentElement.lang;
        if (Spat._language.trim().length == 0)  Spat._language = Spat._defaultLanguage;
    }

    static async _fetchLanguage(){
        Spat._defineLanguage();
        const url = 'spat/' +  Spat._language + '.json';
        const response = await fetch(url);
        if (response.status != 200){
            console.warn(`Language file not provided: ${Spat._language}`);
            Spat._language = undefined;
            Spat._defineLanguage();
            return;
        } 
        localStorage.setItem('language', Spat._language);
        Spat._translations = await response.json();
    }

    static async _replaceStrings(){
        await Spat._fetchLanguage();
        const values = Object.values(Spat._translations);
        var valueIndex = 0;
        Object.keys(Spat._translations).forEach(function(key) {
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

    static setLanguage(lang) {
        if (lang == Spat._language) return;
        Spat._language = lang;
        Spat._replaceStrings();
    }

}

function ready(callback){
    if (document.readyState != 'loading') callback();
    else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
    else document.attachEvent('onreadystatechange', function(){
        if (document.readyState=='complete') callback();
    });
}

ready(function(){
    Spat._replaceStrings();
})