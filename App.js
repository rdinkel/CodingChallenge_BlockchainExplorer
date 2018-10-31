/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Alert, Platform, StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';
import {hex2ascii} from 'hex2ascii';
import {RNCamera} from 'react-native-camera';

const GREETING_PLATFORM_SPECIFIC_USER = Platform.select({
    ios: 'Hello Apple User!',
    android:
        'Hello Android User!\n' +
        'Locate QRCode with the Camera!',
});

type Props = {};
export default class App extends Component<Props> {
    constructor(props) {
        super(props);
        this.handleBarcode = this.handleBarcode.bind(this);
        this.state = {showCamera: false};
    }

    async handleBarcode(barcode) {
        console.log(barcode);
        this.toggleShowCamera();
        let hexMessage = await getMessageFromGivenETHTransactionByHash(barcode);
        Alert.alert(hex2ascii(hexMessage));
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>{GREETING_PLATFORM_SPECIFIC_USER}</Text>
                <Button
                    onPress={async () => {
                        this.toggleShowCamera();
                    }}
                    title="Activate Camera for scanning an item"
                />
                {this.state.showCamera ? <Camera onBarcodeDetection={this.handleBarcode}/> : null}
            </View>
        );
    }

    toggleShowCamera() {
        this.setState(previousState => {
            return {showCamera: !previousState.showCamera};
        });
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

export class Camera extends Component {
    constructor(props) {
        super(props);
        this.handleBarcodeDetection = this.handleBarcodeDetection.bind(this);
    }

    handleBarcodeDetection(e) {
        // console.log(e.barcodes[0].data);
        this.props.onBarcodeDetection(e.barcodes[0].data);
    }

    render() {
        return (
            <View style={styles.containerCamera}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    permissionDialogTitle={'Permission to use camera'}
                    permissionDialogMessage={'We need your permission to use your camera phone'}
                    onGoogleVisionBarcodesDetected={this.handleBarcodeDetection}
                />
                <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
                    <TouchableOpacity
                        onPress={this.takePicture.bind(this)}
                        style={styles.capture}
                    >
                        <Text style={{fontSize: 14}}> SNAP </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    takePicture = async function () {
        if (this.camera) {
            const options = {quality: 0.5, base64: true};
            const data = await this.camera.takePictureAsync(options);
            console.log(data.uri);
        }
    };
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
    containerCamera: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20
    }
});