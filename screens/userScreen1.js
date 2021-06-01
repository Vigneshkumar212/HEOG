import React from 'react';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import firebase from 'firebase';
import firestore from '../config';
import { ListItem } from "react-native-elements";


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
        this.requestRef = firestore.collection("cases").where("reporterEmail", "==", this.state.email.toUpperCase()).onSnapshot((snapshot) => {
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
Status : ${item.status}`
            }
            titleStyle={{ color: "black", fontWeight: "bold" }}
            rightElement={
                <Image
                    source={{
                        uri: item.image,
                        cache: 'only-if-cached'
                    }}
                    style={{ width: 50, height: 50 }}
                />
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
                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 20, flexDirection: 'row', margin: 20, marginTop: 40 }}>
                    <Image source={require('../assets/adaptive-icon.png')} style={{ height: 30, width: 30, borderRadius: 5, marginRight: 10 }} />
                    <Text style={{ color: '#fff', fontSize: 20 }}>HUOG</Text>
                </View>
                <View style={{ flex: 1 }}>
                    {this.state.allRequests.length === 0 ? (
                        <View style={styles.beforeText}>
                            <Text style={{ fontSize: 16, color: '#fff' }}>Help Save an animal Today!</Text>
                            <Text style={{ fontSize: 14, color: '#fff' }}>Go to 'New Case' tab to report for help!</Text>
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