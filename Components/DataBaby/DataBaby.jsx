import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
export default function DataBaby(props) {
  const [data, setData] = useState(props.mask);

  useEffect(()=>{
    async function init(){
      try{
        const dataBaby = await AsyncStorage.getItem('dataBaby');
        setData(JSON.parse(dataBaby));
      }catch(e){
        console.warn(e)
      }
    }
    init();
  },[setData]);

  return (
    <View style={styles.container}>
      <View style={styles.subDiv}>
        {componentName()}
      </View>
      <View style={styles.subDiv}>
        {componentAge()}
        {componentHeightBaby()}
        {componentWeight()}
        {componentVariation()}
      </View>
    </View>
  );
  function Age() {
    let dateCurrent = new Date();
    let DateBirth = new Date();
    let age = dateCurrent.getFullYear() - DateBirth.getFullYear();
    if (dateCurrent.getMonth() < DateBirth.getMonth() || (dateCurrent.getMonth() == DateBirth.getMonth() && dateCurrent.getDay() < DateBirth.getDay())) {
      age--;
    }
    return age;
  }
  function componentName() {
    return (
      <View style={{ width: '60%',padding:2 }}>
        <Text style={styles.textLabe}>Nome:</Text>
        <Text style={styles.textData}>{data.name}</Text>
      </View>
    );
  }
  function componentAge() {
    return (
      <View style={{ width: '25%',padding:2,borderColor:'#330066',borderWidth:1,backgroundColor:"#7851a9"}}>
        <Text style={styles.textLabe}>Idade:</Text>
        <Text style={styles.textData}>{data.age}</Text>
      </View >
    );
  }
  function componentWeight() {
    return (
      <View style={{ width: '25%',padding:2,borderColor:'#330066',borderWidth:1,backgroundColor:"#7851a9"}}>
        <Text style={styles.textLabe}>Peso:</Text>
        <Text style={styles.textData}>{data.weight}</Text>
      </View>
    );
  }
  function componentVariation() {
    return (
      <View style={{ width: '25%',padding:2,borderColor:'#330066',borderWidth:1,backgroundColor:"#7851a9"}}>
        <Text style={styles.textLabe}>Variação:</Text>
        <Text style={styles.textData}>{data.variation}</Text>
      </View>
    );
  }
  function componentHeightBaby() {
    return (
      <View style={{ width: '25%',padding:2,borderColor:'#330066',borderWidth:1,backgroundColor:"#7851a9"}}>
        <Text style={styles.textLabe}>Altura:</Text>
        <Text style={styles.textData}>{data.heightBaby}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 0.27,
    backgroundColor: '#330066',
    maxHeight: 100,
    justifyContent: 'space-between',
  },
  subDiv: {
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'space-between',
  },
  textLabe:{
    fontWeight:'bold',
    fontStyle:'italic',
    color:'white',
  },
  textData:{
    color:'white',
  }
})