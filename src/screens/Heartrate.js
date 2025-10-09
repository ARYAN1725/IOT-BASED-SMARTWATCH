import React, { useState } from "react";
import { View, Text,Image, StyleSheet } from "react-native";


const Heartrate = () => {
  
  return (
    <View style={styles.container}>
       
    <Text style={styles.Heading}>Heartrate: NoData</Text>     
    {/* <Image
                    source={require("../../assets/increase.png")}
                    style={{ width: 250, height: 250 ,marginLeft:40}}
                    resizeMode="contain"
                  />              */}
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
        // marginTop:30,
        paddingHorizontal: 20,
    },
});

export default Heartrate;
