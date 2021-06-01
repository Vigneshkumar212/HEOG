import React from 'react';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import firebase from 'firebase';
import firestore from '../config';
import { ListItem } from "react-native-elements";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Alert } from 'react-native';


export default class NGOScreen1 extends React.Component {
    constructor() {
        super();
        this.state = {
            email: firebase.auth().currentUser.email.toUpperCase(),
            name: "",
            allRequests: [],
            docId: '',
            showPop: false
        };
        this.requestRef = null;
    }
    getAllRequests = () => {
        this.requestRef = firestore.collection("cases").where("assingedEmail", "==", this.state.email.toUpperCase()).where('status', "==", "Assinged").onSnapshot((snapshot) => {
            var allRequests = [];
            snapshot.docs.map((doc) => {
                var request = doc.data();
                request["doc_id"] = doc.id;
                allRequests.push(request);
            });
            this.setState({
                allRequests: allRequests,
            });
        });
    };
    keyExtractor = (item, index) => index.toString();

    renderItem = ({ item, i }) => (
        <ListItem
            key={i}
            title={item.Hurt}
            subtitle={
                `location : ${item.location}
Animal Type: ${item.type}
Description : ${item.desc}`
            }
            titleStyle={{ color: "black", fontWeight: "bold" }}
            leftIcon={
                <Image
                    source={{
                        uri: item.image,
                        cache: 'only-if-cached'
                    }}
                    style={{ width: item.image !== "#" ? 50 : 0, height: item.image !== "#" ? 50 : 0 }}
                />
            }
            rightElement={
                <TouchableOpacity
                    style={{ padding: 10, backgroundColor: "#0084ff", borderRadius: 15 }}
                    onPress={() => {
                        this.setState({ hurt: item.Hurt, desc: item.desc, image: item.image, location: item.location, phno: item.phoneNo, reporterEmail: item.reporterEmail, status: item.status, type: item.type, username: item.username, showPop: true, caseRefId: item.doc_id })
                    }}
                >
                    <Text style={{ color: "#fff" }}>View</Text>
                </TouchableOpacity>
            }

            style={{ marginTop: 5 }}
        />
    );

    getUserProfile = () => {
        firestore.collection("users").where("email_id", "==", this.state.email.toUpperCase()).get().then((snapshot) => {
            snapshot.forEach((doc) => {
                this.setState({
                    name: doc.data().first_name + " " + doc.data().last_name,
                    docId: doc.id
                });
            });
        });
    };

    animalSaved = () => {
        firestore.collection('cases').doc(this.state.caseRefId).update({
            status: "Rescued"
        }).then(e => {
            Alert.alert("", "Nice Job! You save an precious life today. We Salute You!")
            this.setState({
                showPop: false
            })
        })
    }

    componentDidMount() {
        this.getUserProfile();
        this.getAllRequests();
    }

    componentWillUnmount() {
        this.requestRef();
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#0084ff' }}>
                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 20, flexDirection: 'row', margin: 20, marginBottom: 0 }}>
                    <Image source={require('../assets/adaptive-icon.png')} style={{ height: 30, width: 30, borderRadius: 5, marginRight: 10 }} />
                    <Text style={{ color: '#fff', fontSize: 20 }}>HUOG</Text>
                </View>
                <View style={{ flex: 1 }}>
                    {this.state.allRequests.length === 0 ? (
                        <View style={styles.beforeText}>
                            <Text style={{ fontSize: 16, color: '#fff', textAlign: 'center', width: 300 }}>You Saved All Animals You Assigned Your Self For</Text>
                        </View>
                    ) : (
                        <FlatList
                            keyExtractor={this.keyExtractor}
                            data={this.state.allRequests}
                            renderItem={this.renderItem}
                            style={{ marginTop: 20 }}
                        />
                    )}
                </View>

                {(this.state.showPop == true) ? (
                    <View style={styles.pop}>
                        <Text style={{ margin: 7.5 }}>{`Short Description : ${this.state.hurt}`}</Text>
                        <Text style={{ margin: 7.5 }}>{`Description : ${this.state.desc}`}</Text>
                        <Text style={{ margin: 7.5 }}>{`Location : ${this.state.location}`}</Text>
                        <Text style={{ margin: 7.5 }}>{`Animal Type : ${this.state.type}`}</Text>
                        <Text style={{ margin: 7.5 }}>{`Phone No : ${this.state.phno}`}</Text>
                        <Text style={{ margin: 7.5 }}>{`Reporter Email : ${this.state.reporterEmail}`}</Text>
                        <Text style={{ margin: 7.5 }}>{`Status : ${this.state.status}`}</Text>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={{ padding: 10, backgroundColor: "#0084ff", borderRadius: 15 }}
                                onPress={() => {
                                    this.setState({ showPop: false })
                                }}
                            >
                                <Text style={{ color: "#fff" }}>OK</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ padding: 10, backgroundColor: "#0084ff", borderRadius: 15, marginLeft: 10 }}
                                onPress={() => {
                                    this.animalSaved()
                                }}
                            >
                                <Text style={{ color: "#fff" }}>DONE!</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (null)
                }
                {(this.state.showPop == true) ? (
                    <View style={styles.popBlocker}></View>
                ) : (null)
                }
            </View>
        );
    }
}


const styles = StyleSheet.create({
    beforeText: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    pop: {
        position: 'absolute',
        top: '15%',
        left: '15%',
        width: '70%',
        height: "70%",
        backgroundColor: '#fff',
        borderRadius: 15,
        zIndex: 11,
        padding: 20
    },
    popBlocker: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: "100%",
        zIndex: 10,
        backgroundColor: '#000000ab'
    }
});