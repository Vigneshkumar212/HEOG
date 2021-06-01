import { StatusBar } from 'expo-status-bar';
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import firebase from "firebase";
import db from "../config";
import { Alert } from "react-native";

export default class CustomSideBarMenu extends Component {
  constructor() {
    super();
    this.state = {
      email: firebase.auth().currentUser.email.toUpperCase(),
      image: "#",
      name: "",
      docId: "",
      phoneNo: '',
      location: '',
      typeOfAnmial: '',
      Hurt: '',
      desc: '',
      isUploading: false
    };
  }

  uuid() {
    return 'xxdlxxxx-xxxx-4xxx-ylkxx-xxxxgmklsxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!cancelled) {
      this.uploadImage(uri);
    }
  };

  uploadImage = async (uri) => {
    this.setState({ isUploading: true })
    var response = await fetch(uri);
    var blob = await response.blob();
    var imageName = this.uuid()
    var ref = firebase.storage().ref().child(imageName);

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };

  fetchImage = (imageName) => {
    var storageRef = firebase.storage().ref().child(imageName);

    // Get the download URL
    storageRef.getDownloadURL().then((url) => {
      this.setState({
        image: url,
        isUploading: false
      });
    }).catch((error) => {
      this.setState({ image: "#" });
    });
  };

  getUserProfile() {
    db.collection("users").where("email_id", "==", this.state.email.toUpperCase()).onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.setState({
          name: doc.data().first_name + " " + doc.data().last_name,
          docId: doc.id,
        });
      });
    });
  }

  addCase() {
    if (this.state.phoneNo !== "" && this.state.typeOfAnmial !== "" && this.state.location !== "") {
      db.collection('cases').add({
        username: this.state.name,
        image: this.state.image,
        phoneNo: this.state.phoneNo,
        location: this.state.location,
        type: this.state.typeOfAnmial,
        status: 'Reported',
        reporterEmail: this.state.email.toUpperCase(),
        Hurt: this.state.Hurt,
        desc: this.state.desc,
      }).then(() => {
        this.setState({
          image: '#',
          location: '',
          typeOfAnmial: '',
          desc: '',
          Hurt: ''
        })
        Alert.alert('Case Reported', "Thanks for your help, Our NGO will be on the way!")
      })
    } else {
      Alert.alert('', "Please Enter The Empty Fields")
    }
  }

  componentDidMount() {
    this.getUserProfile();
  }
  //firebase.auth().signOut();

  render() {
    return (
      <View style={styles.container}>

        <ScrollView>
          <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 20, flexDirection: 'row', margin: 20, marginTop: 40 }}>
            <Image source={require('../assets/adaptive-icon.png')} style={{ height: 30, width: 30, borderRadius: 5, marginRight: 10 }} />
            <Text style={{ color: '#fff', fontSize: 20 }}>HUOG</Text>
          </View>
          <View style={styles.form}>
            <TextInput
              style={styles.textInput}
              placeholder={"Small Description"}
              defaultValue={this.state.Hurt}
              maxLength={20}
              onChangeText={(text) => {
                this.setState({
                  Hurt: text
                })
              }}
              placeholderTextColor="#fff"
            />
            <TextInput
              style={styles.textInput}
              placeholder={"Your Phone No"}
              defaultValue={this.state.phoneNo}
              onChangeText={(text) => {
                this.setState({
                  phoneNo: text
                })
              }}
              placeholderTextColor="#fff"
              keyboardType={'phone-pad'}
              maxLength={15}
            />
            <TextInput
              style={styles.textInput}
              placeholder={"Location of Animal"}
              defaultValue={this.state.location}
              onChangeText={(text) => {
                this.setState({
                  location: text
                })
              }}
              placeholderTextColor="#fff"
            />
            <TextInput
              style={styles.textInput}
              placeholder={"Brief Description"}
              defaultValue={this.state.desc}
              maxLength={70}
              onChangeText={(text) => {
                this.setState({
                  desc: text
                })
              }}
              placeholderTextColor="#fff"
            />
            <TextInput
              style={styles.textInput}
              placeholder={"Animal type. eg: Dog, Cat"}
              defaultValue={this.state.typeOfAnmial}
              onChangeText={(text) => {
                this.setState({
                  typeOfAnmial: text
                })
              }}
              placeholderTextColor="#fff"
            />
            <Image
              source={{
                uri: this.state.image,
                cache: 'only-if-cached'
              }}
              style={{ width: 50, height: 50, marginTop: 10 }}
            />
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#fff' }]}
              onPress={() => {
                this.selectPicture()
              }}
            >
              <Text style={styles.buttonText}>Add Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={this.state.isUploading}
              style={[styles.button, { backgroundColor: this.state.isUploading ? '#000' : "#fff" }]}
              onPress={() => {
                this.addCase();
              }}
            >
              <Text style={styles.buttonText}>Report</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <StatusBar style="auto" backgroundColor={"#0084ff"} />
      </View>
    );
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
  textInput: {
    fontSize: 16,
    borderBottomColor: "#fff",
    color: '#fff',
    borderBottomWidth: 2,
    width: 275,
    padding: 5,
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  button: {
    padding: 10,
    margin: 10,
    marginBottom: 0,
    borderRadius: 10,
    color: '#000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16
  }, form: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#fff',
    padding: 15,
    borderRadius: 15
  }
});
