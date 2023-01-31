import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Select from '../Select/Select';
import { maskWeight, weightMask } from '../Util';
export default function Register(props) {
    const [data, setData] = useState(props.mask);
    const [sex, setSex] = useState("");
    const sexType = [{ value: "M", label: "M" }, { value: "F", label: "F" }, { value: "O", label: "O" }]
    useEffect(() => {
        async function init() {
            try {
                const dataBaby = await AsyncStorage.getItem('dataBaby');
                let itemJson = JSON.parse(dataBaby);
                setData(itemJson);
                setSex(itemJson.sex)
            } catch (e) {
                console.warn(e)
            }
        }
        init();
    }, [setData]);
    useEffect(() => console.log(data), [data]);

    return (
        <View style={styles.container}>
            <View style={{ backgroundColor: 'white', height: 340, width:290, padding: 4, borderRadius: 8 }}>
                <ScrollView>
                    <Text style={styles.title}>Alterar Informações.</Text>
                    <View style={styles.fields}>
                        <Text style={styles.label}>Nome:</Text>
                        <TextInput
                            onChangeText={(text) => { setValue(text, 'name') }}
                            value={data.name}
                            style={styles.styleInput}
                        />
                    </View>
                    <View style={styles.fieldsTwo}>
                        <View >
                            <Text style={styles.label}>Sexo:</Text>
                            <Select value={sex} setValue={setSex} list={sexType} />
                        </View>
                        <View style={{ width: 70 }}>
                            <Text style={styles.label}>Peso:</Text>
                            <TextInput
                                onChangeText={(text) => { setValue(text, 'weight') }}
                                value={data.weight}
                                style={styles.styleInput}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={{ width: 70 }}>
                            <Text style={styles.label}>Altura:</Text>
                            <TextInput
                                onChangeText={(text) => { setValue(text, 'heightBaby') }}
                                value={data.heightBaby}
                                style={styles.styleInput}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                    <View style={styles.fields}>
                        <Text style={styles.label}>Nascimento:</Text>
                        <View style={{ borderWidth: 1, borderColor: '#ccc', display: 'flex', borderRadius: 8, padding: 4, width: 280 }}>
                            {componentDate()}
                        </View>
                    </View>
                    <View style={styles.fieldsTwo}>
                        <TouchableOpacity onPress={() => { insertData() }} style={{ ...styles.styleTouche, backgroundColor: '#7851a9' }}>
                            <Text style={styles.textTouche}>OK</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { props.setRegister(false) }} style={{ ...styles.styleTouche, backgroundColor: '#330066' }}>
                            <Text style={styles.textTouche}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
    async function insertData(){
        setValue(sex,'sex');
        let keys = Object.keys(data);
        if(voidKey(keys,data)){
            await AsyncStorage.setItem('dataBaby',JSON.stringify(data));
            props.setDatasBaby(data);
            props.setRegister(false)
        }else{
            Alert.alert("Erro!","Preencha todos os campos.")
        }
    }

    function voidKey(keys,object){
        let result = true;
        keys.forEach(element => {
            if(object[element] === '') result = false;
        });
        return result;
    }
    
    function setValue(text, key) {
        let newValue = data;
        newValue[key] = text;
        setData({ ...newValue })
    }
    function componentDate() {
        return (
            <DatePicker
                mode='date'
                date={data.birth ? new Date(data.birth):new Date()}
                onDateChange={(date) => {
                    setValue(date, 'birth')
                }}
                style={{ height: 80, fontSize: 40, width: 270 }}
                locale='pt-BR'
            />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        backgroundColor: '#000000bb',
        zIndex: 10,
        width: '103%',
        height: '102%'
    },
    styleInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 2,
        borderRadius: 8
    },
    label: {
        color: 'black',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 18,
        color: '#777',
        textAlign: 'center',
    },
    fields: {
        marginBottom: 8
    },
    fieldsTwo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    styleTouche: {
        alignItems: 'center',
        width: '49%',
        marginTop: 30,
    },
    textTouche: {
        padding: 4,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14
    }
})