import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { auth, db } from '../config/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

const BMIDetail = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmiHistory, setBmiHistory] = useState([]);

  useEffect(() => {
    fetchBmiHistory();
  }, []);

  const fetchBmiHistory = async () => {
    const uid = auth.currentUser.uid;
    const q = query(collection(db, 'users', uid, 'bmiHistory'), orderBy('date', 'asc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => doc.data());

    // If there is at least one entry, show it
    if (data.length === 0) {
      setBmiHistory([]); // or set a default single point if you want
    } else {
      setBmiHistory(data);
    }
  };

  const handleUpdate = async () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w) return;
    const bmi = parseFloat((w / ((h/100) ** 2)).toFixed(1));

    const uid = auth.currentUser.uid;
    await addDoc(collection(db, 'users', uid, 'bmiHistory'), {
      bmi,
      weight: w,
      height: h,
      date: new Date().toISOString(),
    });

    setHeight('');
    setWeight('');
    fetchBmiHistory(); // refresh graph
  };

  return (
    <View style={{ flex:1, padding:20, backgroundColor:'#121212' }}>
      <Text style={{ color:'#fff', fontSize:18, fontWeight:'bold' }}>BMI History</Text>

      {bmiHistory.length > 0 ? (
        <LineChart
          data={{
            labels: bmiHistory.map((item, index) => {
              // optional: format date like '10/1' or just index
              const d = new Date(item.date);
              return `${d.getMonth()+1}/${d.getDate()}`;
            }),
            datasets: [{ data: bmiHistory.map(item => item.bmi) }],
          }}
          width={Dimensions.get('window').width - 40}
          height={220}
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#1E1E1E',
            backgroundGradientFrom: '#1E1E1E',
            backgroundGradientTo: '#1E1E1E',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`,
            labelColor: () => '#FFFFFF',
            style: { borderRadius: 16 },
          }}
          style={{ marginVertical: 20, borderRadius: 16 }}
        />
      ) : (
        <Text style={{ color:'#ccc', marginVertical: 20 }}>No BMI data yet</Text>
      )}

      <TextInput
        placeholder="Height (cm)"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
        style={{ backgroundColor:'#333', color:'#fff', marginVertical:10, padding:10, borderRadius:10 }}
      />
      <TextInput
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        style={{ backgroundColor:'#333', color:'#fff', marginVertical:10, padding:10, borderRadius:10 }}
      />

      <Button title="Update BMI" onPress={handleUpdate} color="tomato" />
    </View>
  );
};

export default BMIDetail;


// src/screens/BMIDetail.js
// import React from 'react';
// import { View, Text } from 'react-native';

// const BMIDetail = () => {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
//       <Text style={{ color: '#fff', fontSize: 20 }}>BMI Detail Screen</Text>
//     </View>
//   );
// };

// export default BMIDetail;
