// ==UserScript==
// @name         Skribbl.io Guesser
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://skribbl.io/*
// @grant        GM_getResourceText
// @resource     words https://raw.githubusercontent.com/jaycera/testSK/master/words_sorted.json
// ==/UserScript==

(function() {
    'use strict';

    var x = GM_getResourceText("words");
    var words = JSON.parse(x);
    console.log(words);

    var cheatWindow = document.createElement('div');
    cheatWindow.id = "guess";
    document.body.appendChild(cheatWindow);

    var guessBox = document.getElementById("guess");

    guessBox.style = "position: absolute; width: 200px; height: 50%; top: 0px; right: 0px; background-color: rgba(0,0,0,0.5); color: rgba(255,255,255,0.75); font-size: 20px; color: rgba(255,255,255,0.75); overflow-y: scroll; overflow-x: hidden;)";

    var latestWord = "";

    setInterval(() => {

        var word = document.getElementById("currentWord").innerText;
        if (word.includes("_") === false){
            return false;
        }
        document.dispatchEvent(new Event('mousemove'));
        var solutions = [];

        var x = GM_getResourceText("words");
        var words = JSON.parse(x);

        for (var i in words){
            if (words[i].length == word.length){
                solutions = words[i].words;
                break;
            }
        }
        var index = word.indexOf(" ");
        var solutionsToRemove = [];
        for (var l in solutions) {
            var solution = solutions[l];
            if (solution.indexOf(" ") != index) {
                solutionsToRemove.push(l);
            }
        }
        solutionsToRemove = solutionsToRemove.sort((a, b) => b - a);
        for (var j in solutionsToRemove){
            solutions.splice(solutionsToRemove[j], 1);
        }
        if (word.search(/[a-zA-Z]/g) != -1){
            var letters = word.match(/[a-zA-Z]/g);
            var lastIndex = 0;
            var positions = [];
            for (var a in letters){
                var letter = letters[a];
                var letterPosition = word.indexOf(letter, lastIndex);
                lastIndex = letterPosition + 1;
                positions.push({
                    letter: letter,
                    index: letterPosition
                });
            }
            for (var p in positions){
                var position = positions[p];
                var solutionsToRem = [];
                for (var s in solutions) {
                    var solut = solutions[s];
                    var re = new RegExp(position.letter,"g");
                    if (solut.match(re) === null){
                        solutionsToRem.push(s);
                    } else if (solut.indexOf(position.letter, position.index) != position.index) {
                        solutionsToRem.push(s);
                    }
                }
                solutionsToRem = solutionsToRem.sort((a, b) => b - a);
                for (var r in solutionsToRem){
                    solutions.splice(solutionsToRem[r], 1);
                }
            }
        }
        var guessContent = "";
        solutions.sort();
        for (var c in solutions){
            guessContent += `${solutions[c]}<br>`;
        }
        if (solutions.length == 1){
            if (latestWord != solutions[0]){
                latestWord = solutions[0];
                var y = document.getElementById("inputChat");
                y.click();
                y.value = solutions[0];
                var formChat = document.getElementById('formChat');
                let simulateEvent = document.createEvent('Event');
                simulateEvent.initEvent('submit');
                simulateEvent.delegateTarget = formChat;
                formChat.dispatchEvent(simulateEvent);
            }
        }
        guessBox.innerHTML = guessContent;
    },500);
})();