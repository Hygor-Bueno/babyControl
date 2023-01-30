import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { maskWeight, weightMask } from '../Util';
export default function DataBaby(props) {
  const [data, setData] = useState(props.mask);

  useEffect(() => {
    async function init() {
      try {
        const dataBaby = await AsyncStorage.getItem('dataBaby');
        setData(JSON.parse(dataBaby));
        console.log(dataBaby);
      } catch (e) {
        console.warn(e)
      }
    }
    init();
  }, [setData]);
  useEffect(() => console.log(data), [data]);
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {componentName()}
        <TouchableOpacity onPress={() => { console.log("HIHIHIHI") }} style={{ backgroundColor: "#7851a9", alignItems: 'center', justifyContent: 'center', height: 30, width: 30, borderRadius: 15 }}>
          <Image source={require('../../Assets/Image/settings.png')} style={{ height: 28, width: 28 }} />
        </TouchableOpacity>
      </View>
      <View style={styles.subDiv}>
        {componentAge()}
        {componentHeightBaby()}
        {componentWeight()}
        {componentVariation()}
      </View>
    </View>
  );
  function Age(value) {
    if (value) {
      let dateCurrent = new Date();
      let DateBirth = new Date(value);
      let age = dateCurrent.getFullYear() - DateBirth.getFullYear();
      if (dateCurrent.getMonth() < DateBirth.getMonth() || (dateCurrent.getMonth() == DateBirth.getMonth() && dateCurrent.getDay() < DateBirth.getDay())) {
        age--;
      }
      return age;
    }
  }
  function componentName() {
    return (
      <View style={{ width: '60%', padding: 2 }}>
        <Text style={styles.textLabe}>Nome:</Text>
        <Text style={styles.textData}>{data ? data.name : ""}</Text>
      </View>
    );
  }
  function componentAge() {
    return (
      <View style={styles.componentView}>
        <View style={styles.infoBaby}>
          <Text style={styles.textData}>{data ? Age(data.birth) : ""}</Text>
        </View >
        <Text style={styles.textLabe}>Idade:</Text>
      </View>
    );
  }
  function componentWeight() {
    return (
      <View style={styles.componentView}>
        <View style={styles.infoBaby}>
          <Text style={styles.textData}>{data ? weightMask(data.weight) : ""}</Text>
        </View >
        <Text style={styles.textLabe}>Peso (Kg):</Text>
      </View>
    );
  }
  function componentVariation() {
    return (
      <View style={styles.componentView}>
        <View style={styles.infoBaby}>
          <Text style={{ ...styles.textData, fontSize: 18 }}>{data ? data.sex : ""}</Text>
        </View >
        <Text style={styles.textLabe}>Sexo:</Text>
      </View>
    );
  }
  function componentHeightBaby() {
    return (
      <View style={styles.componentView}>
        <View style={styles.infoBaby}>
          <Text style={styles.textData}>{data ? data.heightBaby : ""}</Text>
        </View >
        <Text style={styles.textLabe}>Altura:</Text>
      </View>
    );
  }

  /*function componentAge() {
    return (
      <View style={{ width: '25%',padding:2,borderColor:'#330066',borderWidth:1,backgroundColor:"#7851a9"}}>
        <Text style={styles.textData}>{data.age}</Text>
        <Text style={styles.textLabe}>Idade:</Text>
      </View >
    );
  }
  function componentWeight() {
    return (
      <View style={{ width: '25%', padding: 2, borderColor: '#330066', borderWidth: 1, backgroundColor: "#7851a9" }}>
        <Text style={styles.textLabe}>Peso:</Text>
        <Text style={styles.textData}>{data.weight}</Text>
      </View>
    );
  }
  function componentVariation() {
    return (
      <View style={{ width: '25%', padding: 2, borderColor: '#330066', borderWidth: 1, backgroundColor: "#7851a9" }}>
        <Text style={styles.textLabe}>Variação:</Text>
        <Text style={styles.textData}>{data.variation}</Text>
      </View>
    );
  }
  function componentHeightBaby() {
    return (
      <View style={{ width: '25%', padding: 2, borderColor: '#330066', borderWidth: 1, backgroundColor: "#7851a9" }}>
        <Text style={styles.textLabe}>Altura:</Text>
        <Text style={styles.textData}>{data.heightBaby}</Text>
      </View>
    );
  }*/
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 0.4,
    backgroundColor: '#330066',
    maxHeight: 124,
    justifyContent: 'space-between',
  },
  subDiv: {
    display: 'flex',
    flexDirection: 'row',
  },
  textLabe: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: 'white',
  },
  textData: {
    color: 'white',
  },
  componentView: {
    width: '25%',
    alignItems: 'center'
  },
  infoBaby: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    padding: 2,
    borderColor: '#330066',
    borderWidth: 1,
    backgroundColor: "#7851a9"
  }
})