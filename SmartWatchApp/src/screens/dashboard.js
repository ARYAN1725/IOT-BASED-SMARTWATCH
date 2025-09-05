import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Profile from './profile';
import Analytics from './analytics';
import Guide from './guide';
import IonIcons from 'react-native-vector-icons/Ionicons';


const Dashboard = () => {
    return (
        
        <SafeAreaView style={styles.container}>
            <Text>Dashboard</Text>

            <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeText}> Welcome User!</Text>
            </View>

            {/* Card component begins here */}
            <View style={styles.stepsContainer}>
                {/* <View>
                {/* <Text>Steps Card Component</Text> */}
                {/* </View> */}

                <View style={styles.imageAndHorizontalContainer}>
                    <View style={styles.imageAndTextContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../assets/Steps_Logo.png')}
                        style={{ width: 100, height: 100, marginTop: 7}}
                    />
                </View>
                <View style={styles.aboveLineTextContainer}>
                    <Text style={styles.stepsHeading}>Steps</Text>
                    <Text style={styles.stepsHeading}> 9786</Text>
                </View>
                </View>

                <View style={styles.horizontalRule}></View>

                <View style={styles.belowLineTextContainer}>
                    <Text style={styles.stepsHeading}>Goal: 10000</Text>
                    <Text style={styles.stepsHeading}>Calories Burned: 250</Text>
                </View>
                
                </View>

               
            </View>

            {/* Heart Rate Card Component */}
            <View style={styles.stepsContainer}>
                {/* <View>
                {/* <Text>Steps Card Component</Text> */}
                {/* </View> */}

                <View style={styles.imageAndHorizontalContainer}>
                    <View style={styles.imageAndTextContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../assets/Heartrate_logo.png')}
                        style={{ width: 100, height: 100, marginTop: 7}}
                    />
                </View>
                <View style={styles.aboveLineTextContainer}>
                    <Text style={styles.stepsHeading}>Heart Rate</Text>
                    <Text style={styles.stepsHeading}> 95</Text>
                </View>
                </View>

                <View style={styles.horizontalRule}></View>

                <View style={styles.belowLineTextContainer}>
                    <Text style={styles.stepsHeading}>Goal: 10000</Text>
                    <Text style={styles.stepsHeading}>Calories Burned: 250</Text>
                </View>
                
                </View>
               
            </View>

            {/* Oxygen card component begins here */}

            <View style={styles.stepsContainer}>
                {/* <View>
                {/* <Text>Steps Card Component</Text> */}
                {/* </View> */}

                <View style={styles.imageAndHorizontalContainer}>
                    <View style={styles.imageAndTextContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../assets/Oxygen_Logo.png')}
                        style={{ width: 100, height: 100, marginTop: 7}}
                    />
                </View>
                <View style={styles.aboveLineTextContainer}>
                    <Text style={styles.stepsHeading}>Oxygen Level</Text>
                    <Text style={styles.stepsHeading}> 98%</Text>
                </View>
                </View>

                <View style={styles.horizontalRule}></View>

                <View style={styles.belowLineTextContainer}>
                    <Text style={styles.stepsHeading}>Goal: 10000</Text>
                    <Text style={styles.stepsHeading}>Calories Burned: 250</Text>
                </View>
                
                </View>

               
            </View>

            
            
        </SafeAreaView>
    )
}

export default Dashboard;

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        marginLeft: 15,
        backgroundColor: '#f6f6f6',
    },
    welcomeContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    welcomeText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    stepsContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        height: 150,
        width: '95%',
        alignSelf: 'center',
        paddingBottom: 20,
        marginBottom: 25,
    },
    horizontalRule: {
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,  
            // flex: 1,
            marginLeft: 5,
            marginRight: 0,
            width: '100%',  
            marginTop: 10,
    },
    imageAndHorizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    stepsHeading: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    imageAndTextContainer: {
        flexDirection: 'row',
        alignItems: 'center', // Ensures vertical alignment of image and text
        justifyContent: 'flex-start', // Aligns items to the start of the row
        marginBottom: 10, // Adds spacing between the image-text row and the horizontal rule
    },
    imageContainer: {
        // You can add styles for the image container if needed
    },
    aboveLineTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 10, // Adds spacing between the image and the text
        flex: 1,

    },
    belowLineTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        flex: 1,
        // padding: 5,
    },

   
});