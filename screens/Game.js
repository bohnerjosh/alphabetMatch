import React, { Component, useState, useEffect, onRef } from 'react';
import { Audio } from 'expo-av';

import {
    StyleSheet, 
    Button,
    Text,
    View,
    TouchableOpacity,
} from "react-native";

import GuessTouchable from '../Components/GuessTouchable';

const RESULTS_SCREEN_NAME = "Results";

var DEFAULT_WORD_OPTIONS = [];
var DEFAULT_BUTTON_STATES = []; // 0 for normal, 1 for correct, 2 for incorrect
var SOUNDS_MAP = {}

// import sounds
SOUNDS_MAP['A'] = require('../audio/a.mp3')
SOUNDS_MAP['B'] = require('../audio/b.mp3')
SOUNDS_MAP['C'] = require('../audio/c.mp3')
SOUNDS_MAP['D'] = require('../audio/d.mp3')
SOUNDS_MAP['E'] = require('../audio/e.mp3')
SOUNDS_MAP['F'] = require('../audio/f.mp3')
SOUNDS_MAP['G'] = require('../audio/g.mp3')
SOUNDS_MAP['H'] = require('../audio/h.mp3')
SOUNDS_MAP['I'] = require('../audio/i.mp3')
SOUNDS_MAP['J'] = require('../audio/j.mp3')
SOUNDS_MAP['K'] = require('../audio/k.mp3')
SOUNDS_MAP['L'] = require('../audio/l.mp3')
SOUNDS_MAP['M'] = require('../audio/m.mp3')
SOUNDS_MAP['N'] = require('../audio/n.mp3')
SOUNDS_MAP['O'] = require('../audio/o.mp3')
SOUNDS_MAP['P'] = require('../audio/p.mp3')
SOUNDS_MAP['Q'] = require('../audio/q.mp3')
SOUNDS_MAP['R'] = require('../audio/r.mp3')
SOUNDS_MAP['S'] = require('../audio/s.mp3')
SOUNDS_MAP['T'] = require('../audio/t.mp3')
SOUNDS_MAP['U'] = require('../audio/u.mp3')
SOUNDS_MAP['V'] = require('../audio/v.mp3')
SOUNDS_MAP['W'] = require('../audio/w.mp3')
SOUNDS_MAP['X'] = require('../audio/x.mp3')
SOUNDS_MAP['Y'] = require('../audio/y.mp3')
SOUNDS_MAP['Z'] = require('../audio/z.mp3')
SOUNDS_MAP['a'] = SOUNDS_MAP['A']
SOUNDS_MAP['b'] = SOUNDS_MAP['B']
SOUNDS_MAP['c'] = SOUNDS_MAP['C']
SOUNDS_MAP['d'] = SOUNDS_MAP['D']
SOUNDS_MAP['e'] = SOUNDS_MAP['E']
SOUNDS_MAP['f'] = SOUNDS_MAP['F']
SOUNDS_MAP['g'] = SOUNDS_MAP['G']
SOUNDS_MAP['h'] = SOUNDS_MAP['H']
SOUNDS_MAP['i'] = SOUNDS_MAP['I']
SOUNDS_MAP['j'] = SOUNDS_MAP['J']
SOUNDS_MAP['k'] = SOUNDS_MAP['K']
SOUNDS_MAP['l'] = SOUNDS_MAP['L']
SOUNDS_MAP['m'] = SOUNDS_MAP['M']
SOUNDS_MAP['n'] = SOUNDS_MAP['N']
SOUNDS_MAP['o'] = SOUNDS_MAP['O']
SOUNDS_MAP['p'] = SOUNDS_MAP['P']
SOUNDS_MAP['q'] = SOUNDS_MAP['Q']
SOUNDS_MAP['r'] = SOUNDS_MAP['R']
SOUNDS_MAP['s'] = SOUNDS_MAP['S']
SOUNDS_MAP['t'] = SOUNDS_MAP['T']
SOUNDS_MAP['u'] = SOUNDS_MAP['U']
SOUNDS_MAP['v'] = SOUNDS_MAP['V']
SOUNDS_MAP['w'] = SOUNDS_MAP['W']
SOUNDS_MAP['x'] = SOUNDS_MAP['X']
SOUNDS_MAP['y'] = SOUNDS_MAP['Y']
SOUNDS_MAP['z'] = SOUNDS_MAP['Z']

// store user performance data for display in results
var correctWords = [];
var incorrectWords = [];

const Game = ({navigation, route}) => {

    
    // State variables
    const [wordPoolListLength, setWordPoolListLength] = useState(route.params.LETTER_CASE.length);
    const [wordSetListLength, setWordSetListLength] = useState(route.params.LETTER_CASE.length);
    const [fieldLength, setFieldLength] = useState(route.params.FIELD_LENGTH);
    const [wordOptions, setWordOptions] = useState([]);
    const [wordSet, setWordSet] = useState([...route.params.LETTER_CASE]);
    const [wordPool, setWordPool] = useState([...route.params.LETTER_CASE]);
    const [choiceButtonStates, setChoiceButtonStates] = useState([]);
    const [showResults, setShowResults] = useState(false); // for toggling "well Done!" or "Incorrect!" text
    const [userAnsweredCorrectly, setUserAnsweredCorrectly] = useState(false); // determines whether to show "Well Done!" or "Incorrect!"
    const [solutionWordIndex, setSolutionWordIndex] = useState(-1);
    const [letterSound, setLetterSound] = useState();

    // reset user performance and set word choices for first render
    useEffect(() => {        
        // extract params

        for (var i=0; i<fieldLength; i++) {
            DEFAULT_WORD_OPTIONS.push("");
        }
        for (var i=0; i<fieldLength; i++) {
            DEFAULT_BUTTON_STATES.push(0);
        }
        //setWordPoolListLength(ALPHA_UPPERCASE.length);
        //setWordOptions([...DEFAULT_WORD_OPTIONS]);
        setChoiceButtonStates([...DEFAULT_BUTTON_STATES]);

        correctWords = [];
        incorrectWords = [];
        
        createWordChoices();

    }, [route.params]);

    // change state back to default: clear button colors, next buttons are hidden, create new word choices
    const reset = async () => {
        await letterSound.sound.unloadAsync();
        setChoiceButtonStates(DEFAULT_BUTTON_STATES);
        if (userAnsweredCorrectly) setUserAnsweredCorrectly(!userAnsweredCorrectly);
        setShowResults(false);
        createWordChoices();
    }

    const switchToResults = () => {
        navigation.navigate(RESULTS_SCREEN_NAME, 
            {
                incorrect: incorrectWords,
                correct: correctWords,
            });
    }

    // use TTS to have user audibly hear what word they should press
    const speak = async () => {
        //console.log(letterSound);
        //const status = await letterSound.getStatusAsync();
        await letterSound.sound.replayAsync();
        //await letterSound.playAsync();
    }

    // given a list and index terminator, get a random element from that list
    const getRandomChoice = (lst, mod) => {
        return lst[Math.floor((Math.random() * 15 )) % mod];
        
    }

    const checkForSimilarLetterSounds = (randomLetter, solutionLetter) => {
        // return true if the random letter should be added to word choice

        if ((randomLetter == 'K' && solutionLetter == 'C') || (randomLetter == 'k' && solutionLetter == 'c')) return false;
        else if ((randomLetter == 'C' && solutionLetter == 'K') || (randomLetter == 'c' && solutionLetter == 'k')) return false;

        else if ((randomLetter == 'A' && solutionLetter == 'E') || (randomLetter == 'a' && solutionLetter == 'e')) return false;
        else if ((randomLetter == 'E' && solutionLetter == 'A') || (randomLetter == 'e' && solutionLetter == 'a')) return false;

        else return true;
    }

    // create a list of words that will be displayed to the user
    const getWordArray = (solutionLetter) => {

        var wordMap = {};
        var newWordArray = [];
        for (var index=0; index<fieldLength; index++) {
            while (true) {
                var letter = getRandomChoice(wordSet, wordSetListLength);
                if (wordMap[letter] == undefined && letter !== solutionLetter) {
                // edge case: letters that sound similar produce conflict in human logic to determine answer. Ex: K is solution, but C is also a choice.
                // because of this, I don't allow similar sounding letters in the choice of available words when the similar letter is the answer
                    const shouldRandomLetterBeAddedToWordMap = checkForSimilarLetterSounds(letter, solutionLetter);
                    if (shouldRandomLetterBeAddedToWordMap) {
                        wordMap[letter] = index; 
                        break;
                    }
                }
            }
        };
        for (const [letter, index] of Object.entries(wordMap)) {
            newWordArray[index] = letter;
        }
        return newWordArray;
    }
    
    // choose a solution word from the Fry Sight Words list. 
    const getSolutionWord = () => {
        var solutionWord = getRandomChoice(wordPool, wordPoolListLength);

        // Choose a new word if the solution word is already in the word choices array
        //while (wordArray.includes(solutionWord)) solutionWord = getRandomChoice(wordPool, wordPoolListLength);

        // remove the solution word from the pool of available solution words
        const newWordPool = wordPool.filter(item => item !== solutionWord);
        setWordPool(newWordPool);
        setLetterSound(SOUNDS_MAP[solutionWord]);
        
        setWordPoolListLength(wordPoolListLength-1);
        return solutionWord;
    }

    // get a word choice array, choose a random index from it, and replace the element at that index with a solution word.
    // this solution provides more distributed randomness
    const createWordChoices = async () => {
        const correctWord = getSolutionWord();
        var wordChoices = getWordArray(correctWord);
        
        //console.log("fieldlength", fieldLength);
        var correctWordIndex = Math.floor((Math.random() * 15 )) % fieldLength;
        wordChoices[correctWordIndex] = correctWord;
        setWordOptions(wordChoices);
        setSolutionWordIndex(correctWordIndex);

        const importedLetterSound = await Audio.Sound.createAsync(SOUNDS_MAP[wordChoices[correctWordIndex]]);
        setLetterSound(importedLetterSound);
    } 

    // given a buttonID of a pressed word choice, determine the button with the answer and set the button colors accordingly
    const onTouchablePress = async (buttonID) => {

        // don't update buttons when user has already selected one
        if (showResults) return;
        
        var btnStates = [...DEFAULT_BUTTON_STATES];
        btnStates.forEach((state, index) => {
            if (index == solutionWordIndex) btnStates[index] = 1;
            else btnStates[index] = 2;
        });
        setChoiceButtonStates(btnStates);
        setShowResults(!showResults);

        // set "Well Done!" or "Incorrect!" and save performance data

        if (buttonID == solutionWordIndex) {
            setUserAnsweredCorrectly(!userAnsweredCorrectly);
            correctWords.push(wordOptions[solutionWordIndex]);
        }
        else incorrectWords.push(wordOptions[solutionWordIndex]);
    }

    // set button color based on the state saved for a buttonID
    const _getTouchableColor = (btnID) => {
        if (choiceButtonStates[btnID] == 0) return styles.guessTouchableNormal
        else if (choiceButtonStates[btnID] == 1) return styles.guessTouchableGreen;
        else if (choiceButtonStates[btnID] == 2) return styles.guessTouchableRed;
    }

    // control behavior of next button press. Only when all 100 words are exhausted should the next button toggle the results screen
    const _toggleResultsPress = () => {
        if (wordPoolListLength > 0) return reset;
        else return switchToResults;
    }

    const _buttonRender = () => {
        var renderedButtons = [];
        var j = 0;
        
        for (var i=0; i<fieldLength/2; i++) {
            renderedButtons.push(
                <View style={styles.choiceContainer} key={i}>
                    
                    <GuessTouchable 
                        onPress={onTouchablePress}
                        buttonID={j}
                        getStyle={_getTouchableColor}
                        word={wordOptions[j]}
                        key={j}
                    />
                    
                    {
                        wordOptions[j+1] !== undefined &&
                        <GuessTouchable 
                            onPress={onTouchablePress}
                            buttonID={j+1}
                            getStyle={_getTouchableColor}
                            word={wordOptions[j+1]}
                            key={j+1}
                        />
                    }
                </View>
            ); 
            j += 2;
        }
        return renderedButtons;       
    }

    return (
        <View style={styles.container}>
            <View style={styles.counterView}>
                <Text style={styles.progressCounter}>Words remaining: {wordPoolListLength}</Text>
            </View>
            <View style={styles.choiceContainer}>
                {showResults && ((userAnsweredCorrectly && <Text style={styles.resultText}>Well Done!</Text>) || 
                    <Text style={styles.resultText}>Incorrect!</Text> )}
            </View>
            <View style={styles.speakButton}>
                <TouchableOpacity style={styles.speakTouchable} onPress={speak}>
                    <Text style={styles.text}>Speak</Text>
                </TouchableOpacity>
            </View>
            {_buttonRender()}

            <View style={styles.navContainer}>
                {showResults && 
                <TouchableOpacity 
                        style={styles.resultTouchable}
                        onPress={_toggleResultsPress()}
                    >
                        <Text style={styles.text}>Next</Text>
                    </TouchableOpacity>
                }
                {showResults &&
                    <TouchableOpacity 
                        style={styles.dangerTouchable}
                        onPress={switchToResults}
                    >
                        <Text style={styles.dangerText}>Exit</Text>
                    </TouchableOpacity>
                }
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    speakButton: {
        justifyContent: "center",
        alignSelf: "center",
        margin: 15,
    },
    counterView: {
        top: 35, 
        position: "absolute",
        alignSelf: "center",
    },
    progressCounter: {
        color: "black",
        fontSize: 20,
    },
    choiceContainer: {
        justifyContent: "center",
        flexDirection: "row",
    },
    navContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    speakTouchable: {
        alignItems: "center",
        justifyContent: "center",
        height: 75,
        width: 150,
        borderRadius: 20,
        backgroundColor: "orange",
        margin: 40,
    },
    resultTouchable: {
        alignItems: "center",
        justifyContent: "center",
        height: 75,
        width: 200,
        borderRadius: 20,
        backgroundColor: "black",
        marginTop: 25,
    },
    guessTouchable: {
        alignItems: "center",
        justifyContent: "center",
        height: 40,
        width: 70,
        borderRadius: 20,
        backgroundColor: "green",
    },
    dangerTouchable: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        marginTop: 10,
    },
    dangerText: {
        color: "red",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 'bold',
    },
    text: {
        color: "white",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 40,
        lineHeight: 50,
        fontWeight: 'bold',
    },
    resultText: {
        color: "black",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 40,
        lineHeight: 50,
        fontWeight: 'bold',
    },
    guessTouchableNormal: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 65,
        maxWidth: 185,
        borderRadius: 20,
        backgroundColor: "black",
        margin: 15,
    },
    guessTouchableRed: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 65,
        maxWidth: 185,
        borderRadius: 20,
        backgroundColor: "red",
        margin: 15,
    },
    guessTouchableGreen: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 65,
        maxWidth: 185,
        borderRadius: 20,
        backgroundColor: "green",
        margin: 15,
    },
    opacityText: {
        color: "white",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 32,
        lineHeight: 40,
        fontWeight: 'bold',
    }
})
export default Game;
