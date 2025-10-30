import React, { useState } from "react";
import { View, Text,Image, StyleSheet } from "react-native";


const Heartrate = () => {
  
  return (
    <View style={styles.container}>
       
    <Text style={styles.Heading}>Heartrate: No Data</Text>     
    <Image
                    source={require("../../assets/dead.png")}
                    style={{ width: 150, height: 150 ,marginLeft:40}}
                    resizeMode="contain"
                  />             
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
     flex: 1,
        backgroundColor: '#000000ff',
  },
  Heading: {
        fontSize: 28,
        // fontWeight: 'bold',
        color: 'white',
        // flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        marginTop:30,
        paddingHorizontal: 20,
    },
});

export default Heartrate;
