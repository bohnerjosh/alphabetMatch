import React, {useState} from 'react';
import {
    StyleSheet, 
    Button,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import Slider from '@react-native-community/slider';
import { SelectList } from 'react-native-dropdown-select-list';

// default Variables
const DEFAULT_SPEECH_RATE = 0.5;
const DEFAULT_FIELD_LENGTH = 2;
const GAME_SCREEN_NAME = "Game";

const ALPHA_LOWERCASE = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
const ALPHA_UPPERCASE = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

// struct for dropdown select
const PICKER_DATA = [
    {key:'Uppercase', value:'Uppercase'},
    {key:'Lowercase', value:'Lowercase'},
];

const MainScreen = ({navigation}) => {

    const [speechRate, setSpeechRate] = useState(DEFAULT_SPEECH_RATE);
    const [fieldLength, setFieldLength] = useState(DEFAULT_FIELD_LENGTH);
    const [letterCase, setLetterCase] = useState(ALPHA_UPPERCASE);

    // switch to the game screen
    const switchScreen = () => {
        navigation.navigate(GAME_SCREEN_NAME, {
            LETTER_CASE: letterCase,
            FIELD_LENGTH: fieldLength                                 
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleView}>
                <Text style={styles.titleText}>Letter Sounds for NonVerbals</Text>
            </View>
            <View style={styles.setting}>
                <View style={styles.picker}>
                    <Text style={styles.optionsTitle}>Letter Case</Text>
                    <SelectList 
                        data={PICKER_DATA}
                        save='key'
                        setSelected={(val) => {
                            val == "Uppercase" ? setLetterCase(ALPHA_UPPERCASE) : setLetterCase(ALPHA_LOWERCASE)
                        }}
                        defaultOption={{key:'Uppercase', value:'Uppercase'}}
                        style={styles.picker}
                    />
                </View>
                <Text style={styles.optionsTitle}>Number of Choices per Letter</Text>
                <Text style={styles.optionsValue}>{fieldLength}</Text>
                <Slider 
                    style={styles.slider}
                    minimumValue={2}
                    maximumValue={6}
                    onValueChange={setFieldLength}
                    value={fieldLength}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                    step={1}
                />
            </View>
            <TouchableOpacity
                    style={styles.navTouchable}
                    onPress={switchScreen} 
                >
                    <Text style={styles.text}>Start</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1, 
    },
    titleView: {
        top: 40,
        position: "absolute",
        alignSelf: "center",
    },
    selector: {
        width: 125  , 
        justifyContent: "center",
        alignSelf: "center",
    },
    navTouchable: {
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        height: 50,
        width: 100,
        borderRadius: 20,
        backgroundColor: "black",
        marginTop: 25,
    },
    text: {
        color: "white",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
        lineHeight: 50,
        fontWeight: 'bold',
    },
    picker: {
        marginBottom: 20,
    },
    setting: {
        margin: 50,
    },
    resultText: {
        color: "black",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 40,
        lineHeight: 50,
        fontWeight: 'bold',
    },
    titleText: {
        fontSize: 40,
        color: "black",
        fontWeight: "bold",
        lineHeight: 50,
        textAlign: "center"

    },
    wordOptionsText: {
        color: "black",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 32    ,
        lineHeight: 50,
        fontWeight: 'bold',
        textAlign: "center",
        margin: 5, 
    },
    slider: {
        width: 200, 
        height: 40,
        alignSelf: "center"
    },
    optionsTitle: {
        color: "black",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
        lineHeight: 50,
        fontWeight: 'bold',
        textAlign: "center",
    },
    optionsValue: {
        color: "black",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: "center",
    }

});
export default MainScreen;