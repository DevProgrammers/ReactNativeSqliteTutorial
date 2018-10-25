/**
 * Sample React Native SQLITE App
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  TextInput,
  FlatList,
  TouchableOpacity,
  ListView,
  ScrollView,
  TouchableHighlight,
  Alert
} from "react-native";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});
var SQLite = require("react-native-sqlite-storage");

var db = SQLite.openDatabase({
  name: "sqliteexample.db",
  createFromLocation: "~sqliteexample.db"
});

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

export default class App extends React.Component {
  static navigationOptions = {
    title: "Add Time Sheet"
    // headerRight: (
    //   <Button onPress={() => alert("Menu Item")} title="Info" color="#0000" />
    // )
  };
  constructor(props) {
    super(props);

    this.state = {
      std_name: "",
      std_nic: "",
      studentDataSource: ds
    };
  }
  //this function is called when this page is opened
  componentDidMount() {
    var studentData = [
      { std_name: "hamad", std_nic: "123123" },
      { std_name: "hamad", std_nic: "123123" }
    ];
    studentData.push({ std_name: "hasdfsdfmad", std_nic: "123123" });

    this.setState({ studentDataSource: ds.cloneWithRows(studentData) });
    this.updateList();
  }

  search = (name, nic) => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM student WHERE std_nic = '" + nic + "'",
        null,
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            this.upDateItem(name, nic);
          } else {
            this.saveItem(name, nic);
          }
        }
      );
    });
  };

  deleteAllRecord = () => {
    db.transaction(tx => {
      tx.executeSql("delete from student", null, (tx, results) => {
        var len = results.rows.length;
        if (len > 0) {
          ToastAndroid.show("All record deleted!", ToastAndroid.SHORT);
        } else {
          ToastAndroid.show("All record not deleted!", ToastAndroid.SHORT);
        }
      });
    });
  };

  saveItem = (name, nic) => {
    db.transaction(tx => {
      tx.executeSql(
        "INSERT INTO student(std_name,std_nic) VALUES('" +
          name +
          "','" +
          nic +
          "')",
        null,
        (tx, results) => {
          var len = results.rowsAffected;
          if (len > 0) {
            //ToastAndroid.show("Data Inserted!!", ToastAndroid.SHORT);
            this.getDataByNIC(nic);
          } else {
            //ToastAndroid.show("Data Not Inserted!!", ToastAndroid.SHORT);
          }
        }
      );
    });
  };

  upDateItem = (name, nic) => {
    db.transaction(tx => {
      tx.executeSql(
        "UPDATE student SET std_name = '" +
          name +
          "' , std_nic = '" +
          nic +
          "' WHERE std_nic = '" +
          nic +
          "'",
        null,
        (tx, results) => {
          var len = results.rowsAffected;
          if (len > 0) {
            //ToastAndroid.show("Data Updated!!", ToastAndroid.SHORT);
            //this.getDataByNIC(nic);
          } else {
            //ToastAndroid.show("Data Not Updated!!", ToastAndroid.SHORT);
          }
        }
      );
    });
  };

  getDataByNIC = nic => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM student WHERE std_nic = '" + nic + "'",
        [],
        (tx, results) => {
          var len = results.rows.length;

          if (len > 0) {
            alert("" + JSON.stringify(results.rows.item(len - 1)));
          }
        }
      );
    });
    this.updateList();
  };

  // Update courselist
  updateList = () => {
    console.log("updateList");
    var temp = [];
    var self = this;
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM student", null, (tx, results) => {
        var len = results.rows.length;
        // let row = results.rows.item(0);
        // console.log("row : "+ JSON.stringify(row));
        // ToastAndroid.show(
        //   "Record exist count = " +
        //     len +
        //     " " +
        //     "row : "+ JSON.stringify(row.std_name),
        //   ToastAndroid.SHORT
        // );
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          temp.push({
            std_name: row.std_name,
            std_nic: row.std_nic
          });
        }

        if (temp.length > 0) {
          this.setState({ studentDataSource: ds.cloneWithRows(temp) });
        }
      });
    });
    // ToastAndroid.show("Temp size" + temp.length, ToastAndroid.LONG);
  };

  listSeparator = () => {
    console.log("listSeparator");
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };

  ListViewItemSeparatorLine = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: "100%",
          backgroundColor: "#000"
        }}
      />
    );
  };

  itemClicked = record => {
    //static alert(title, message?, buttons?, options?, type?)
    Alert.alert(
      "Message",
      "Are you sure, you want to delete this record with nic: " +
        record.std_nic,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );
  };

  renderRow(record) {
    return (
      <View
        style={{
          paddingBottom: 10,
          paddingTop: 10,
          width: "100%"
        }}
      >
        <TouchableOpacity onPress={() => this.itemClicked(record)}>
          <View>
            <Text>
              Student Name :{record.std_name}, Student NIC :{record.std_nic}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    // test to load data in list and assign to listview
    // var studentData = [
    //   { std_name: "hamad", std_nic: "123123" },
    //   { std_name: "hamad", std_nic: "123123" }
    // ];
    // studentData.push({ std_name: "hasdfsdfmad", std_nic: "123123" });

    // var clonedStudent = ds.cloneWithRows(studentData);

    return (
      
      <View style={styles.container}>
        <TextInput
          placeholder="Student name"
          style={{
            fontSize: 14,
            width: "80%",
            paddingBottom: 5,
            paddingTop: 5,
            alignItems: "center",
            marginBottom: 10,
            marginTop: 10,
            borderColor: "gray",
            borderWidth: 1
          }}
          onChangeText={text => this.setState({ std_name: text })}
          value={this.state.std_name}
        />
        <TextInput
          placeholder="Student nic"
          style={{
            fontSize: 14,
            paddingBottom: 5,
            paddingTop: 5,
            width: "80%",
            marginBottom: 10,
            alignItems: "center",
            borderColor: "gray",
            borderWidth: 1
          }}
          onChangeText={text => this.setState({ std_nic: text })}
          value={this.state.std_nic}
        />

        <View style={{ flexDirection: "column" }}>
          <TouchableOpacity
            onPress={() => this.search(this.state.std_name, this.state.std_nic)}
          >
            <Text style={{ fontWeight: "bold" }}> SAVE</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.deleteAllRecord()}>
            <Text style={{ fontWeight: "bold" }}> Delete all record</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ marginTop: 30, fontSize: 20 }}>Student list</Text>

        <ListView
          dataSource={this.state.studentDataSource}
          renderRow={this.renderRow.bind(this)}
          // for item clicked we have to use .bind(this)
          renderSeparator={this.ListViewItemSeparatorLine}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  rowViewContainer: {
    fontSize: 18,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10
  }
});
