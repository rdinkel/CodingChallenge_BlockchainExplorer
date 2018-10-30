/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Alert, Platform, StyleSheet, Text, View, Button} from 'react-native';

const GREETING_PLATFORM_SPECIFIC_USER = Platform.select({
  ios: 'Welcome Apple User!',
  android:
    'Hello Android User!\n' +
    'This is not the droid we are looking for !!',
});

type Props = {};
export default class App extends Component<Props> {
  render() {
      return (
      <View style={styles.container}>
        <Text style={styles.welcome}>{GREETING_PLATFORM_SPECIFIC_USER}</Text>
          <Button
              onPress={async() => {
                  let ethHashFromQRCode = '0x64eed727b690a2a0aa1f9519c5ac68919a0a3fa6cbd2512be41fd536a9054f52';
                  let message = await getMessageFromGivenETHTransactionByHash(ethHashFromQRCode);
                  // TODO: message hexadecimal to Alphabet Latin
                  Alert.alert(message);
              }}
              title="Press Me"
          />
      </View>
    );
  }
}

async function getMessageFromGivenETHTransactionByHash(hash) {
    try {
        let response = await fetch(
            'https://api.blockcypher.com/v1/eth/main/txs/' + hash
        );
        let responseJson = await response.json();
        let message = responseJson.outputs[0].script;
        console.log(message);
        return message;
    } catch (error) {
        console.error(error);
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#d5d5d5',
    margin: 10,
  },
});