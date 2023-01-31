/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import DataBaby from './Components/DataBaby/DataBaby';
import RegisterAlimentation from './Components/Historical/RegisterAlimentation';
import AsyncStorage from '@react-native-community/async-storage';
import Register from './Components/DataBaby/Register';

export default function App() {
  const maskListFood = {
    id:"",
    date: "",
    hour: "",
    quantity: "",
    milk: ""
  };
  const mask = {
    name: "",
    weight:"",
    sex: "",
    heightBaby: "",
    birth:""
  }

  const [register,setRegister] = useState(false);
  const [datasBaby, setDatasBaby] = useState(mask);

  useEffect(()=>{
    async function init(){
      try{
        const listFood = await AsyncStorage.getItem('listFood');
        const dataBaby = await AsyncStorage.getItem('dataBaby');
        const lastId = await AsyncStorage.getItem('lastId');
        listFood === null && await AsyncStorage.setItem('listFood',JSON.stringify({list:[]}));
        dataBaby === null && await AsyncStorage.setItem('dataBaby',JSON.stringify(mask));
        dataBaby !== null && setDatasBaby(JSON.parse(dataBaby));
        lastId === null && await AsyncStorage.setItem('lastId','0');
      }catch(e){
        console.warn(e)
      }
    }
    // AsyncStorage.removeItem("dataBaby");
    // AsyncStorage.removeItem("lastId");
    // AsyncStorage.removeItem("listFood");
    init();
  },[setDatasBaby]);
  return (
    <View style={styles.container}>
      {register && <Register mask={mask} setDatasBaby={setDatasBaby} setRegister={setRegister}/>}
      <DataBaby mask={datasBaby} setRegister={setRegister}/>
      <RegisterAlimentation maskListFood={maskListFood}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#330066',
    padding: 4
  },
})