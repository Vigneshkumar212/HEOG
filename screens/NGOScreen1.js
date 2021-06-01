import React from 'react';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import firebase from 'firebase';
import firestore from '../config';
import { ListItem } from "react-native-elements";
import { TouchableOpacity } from 'react-native-gesture-handler';


export default class NGOScreen1 extends React.Component {
    constructor() {
        super();
        this.state = {
            email: firebase.auth().currentUser.email.toUpperCase(),
            name: "",
            allRequests: [],
            docId: ''
        };
        this.requestRef = null;
    }
    getAllRequests = () => {
        this.requestRef = firestore.collection("cases").where("status", "==", "Reported").onSnapshot((snapshot) => {
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

    assingToMe = (doc) => {
        firestore.collection('cases').doc(doc).update({
            assingedEmail: this.state.email.toUpperCase(),
            status: "Assinged"
        })
    }

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
                        this.assingToMe(item.doc_id)
                    }}
                >
                    <Text style={{ color: "#fff" }}>Assing To Me</Text>
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
                            <Text style={{ fontSize: 16, color: '#fff' }}>All Caught Up!</Text>
                            <Text style={{ fontSize: 14, color: '#fff' }}>No New Cases.</Text>
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
});