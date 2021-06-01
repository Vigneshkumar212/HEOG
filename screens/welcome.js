import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Alert, CheckBox, ScrollView } from 'react-native';
import firebase from 'firebase';
import firestore from '../config';

export default class WelcomeScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            email: '',
            password: '',
            cPassowrd: '',
            signUp: false,
            checked: false
        }
    }
    login = () => {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {
            firestore.collection("users").where("email_id", "==", this.state.email.toUpperCase()).get().then((snapshot) => {
                snapshot.forEach((doc) => {
                    if (doc.data().isNGO) {
                        //the user is an ngo
                        this.props.navigation.navigate('NGOBottomTabNavigator');
                    } else {
                        //the user is not an ngo
                        this.props.navigation.navigate('usrBottomTabNavigator');
                    }
                });
            })
        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            return Alert.alert(errorMessage)
        })
    }
    signUp = () => {
        if (this.state.password == this.state.cPassword) {
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(() => {
                firestore.collection('users').add({
                    first_name: this.state.firstName,
                    last_name: this.state.lastName,
                    email_id: this.state.email.toUpperCase(),
                    isNGO: this.state.checked
                }).then(() => {
                    Alert.alert("", "You may now login");
                    this.setState({
                        signUp: false
                    })
                })
            }).catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                return Alert.alert(errorMessage)
            })
        } else {
            Alert.alert('', "password mis-match")
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={{ margin: 20, width: '100%', height: '100%' }} contentContainerStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ marginTop: this.state.signUp ? 50 : '20%' }}>
                        <Text style={styles.welcomeText}>Welcome To HEOG</Text>
                    </View>
                    <View>
                        <Image source={require('../assets/adaptive-icon.png')} style={{ width: 100, height: 100, margin: 15, borderRadius: 15 }} />
                    </View>
                    {
                        (this.state.signUp == false) ?
                            (<View style={styles.box}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder={"Enter Email"}
                                    onChangeText={(text) => {
                                        this.setState({
                                            email: text,
                                        })
                                    }}
                                    placeholderTextColor="#fff"
                                    keyboardType={'email-address'}
                                />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder={"Enter Password"}
                                    maxLength={8}
                                    onChangeText={(text) => {
                                        this.setState({
                                            password: text
                                        })
                                    }}
                                    placeholderTextColor="#fff"
                                    secureTextEntry
                                />
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => { this.login() }}
                                >
                                    <Text style={styles.buttonText}>Sign In</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ marginLeft: 5 }}
                                    onPress={() => { this.setState({ signUp: true }) }}
                                >
                                    <Text style={{ color: '#fff' }}>Don't have an account?</Text>
                                </TouchableOpacity>
                            </View>)
                            :
                            (<View style={styles.box}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder={"First Name"}
                                    onChangeText={(text) => {
                                        this.setState({
                                            firstName: text
                                        })
                                    }}
                                    placeholderTextColor="#fff"
                                />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder={"Last Name"}
                                    onChangeText={(text) => {
                                        this.setState({
                                            lastName: text
                                        })
                                    }}
                                    placeholderTextColor="#fff"
                                />
                                <View style={[{ flexDirection: 'row' }, styles.CheckBox]}>
                                    <CheckBox
                                        style={{ color: '#fff' }}
                                        value={this.state.checked}
                                        onValueChange={() => this.setState({ checked: !this.state.checked })}
                                    />
                                    <Text style={{ fontSize: 16, color: '#fff', marginTop: 3 }}>I am an NGO</Text>
                                </View>
                                <TextInput
                                    style={[styles.textInput, { marginTop: 5 }]}
                                    placeholder={"Enter Email"}
                                    onChangeText={(text) => {
                                        this.setState({
                                            email: text
                                        })
                                    }}
                                    placeholderTextColor="#fff"
                                    keyboardType={'email-address'}
                                />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder={"Enter Password"}
                                    onChangeText={(text) => {
                                        this.setState({
                                            password: text
                                        })
                                    }}
                                    placeholderTextColor="#fff"
                                    secureTextEntry
                                />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder={"Confirm Password"}
                                    onChangeText={(text) => {
                                        this.setState({
                                            cPassword: text
                                        })
                                    }}
                                    placeholderTextColor="#fff"
                                    secureTextEntry
                                />
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => { this.signUp() }}
                                >
                                    <Text style={[styles.buttonText, { color: '#000' }]}>Sign Up</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ marginLeft: 5 }}
                                    onPress={() => { this.setState({ signUp: false }) }}
                                >
                                    <Text style={{ color: '#fff' }}>have an account?</Text>
                                </TouchableOpacity>
                            </View>)
                    }
                    <StatusBar style="auto" />
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0084ff',
    },
    welcomeText: {
        color: '#fff',
        fontSize: 25,
        marginBottom: 25
    },
    textInput: {
        fontSize: 16,
        borderBottomColor: "#fff",
        color: '#fff',
        borderBottomWidth: 2,
        width: 275,
        padding: 5,
        marginTop: 20,
        paddingLeft: 10,
        paddingRight: 10
    },
    CheckBox: {
        fontSize: 16,
        color: '#fff',
        width: 275,
        padding: 5,
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 20,
    },
    button: {
        padding: 10,
        margin: 20,
        borderRadius: 10,
        backgroundColor: "#fff",
        color: '#000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16
    }
});
