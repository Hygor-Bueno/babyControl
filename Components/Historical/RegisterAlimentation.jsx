import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from "react-native-date-picker";
import Select from '../Select/Select';
import { dateMaskBr, get, hourMask, post } from '../Util';
export default function RegisterAlimentation(props) {
    const [dataFood, setDataFood] = useState(props.maskListFood);
    const [lastID, setLastID] = useState('0');
    const [listFood, setListFood] = useState({ list: [] })
    const [date, setDate] = useState(new Date())
    const [hour, setHour] = useState(new Date())
    const [milk, setMilk] = useState('0');

    const listMilk = [
        { value: '0', label: 'Leite' },
        { value: '1', label: 'Materno' },
        { value: '2', label: 'Composto' }
    ];
    const [openHour, setOpenHour] = useState(false)
    const [openDate, setOpenDate] = useState(false)

    useEffect(() => {
        async function init() {
            try {
                const listFood = await AsyncStorage.getItem('listFood');
                const lastId = await AsyncStorage.getItem('lastId');
                let list = JSON.parse(listFood);
                setLastID(lastId);
                setListFood(list || { list: [] });
            } catch (e) {
                console.warn(e)
            }
        }
        init();
    }, [setListFood]);
    // useEffect(() => {
    //     console.log(listFood)
    // }, [listFood]);
    return (
        <View style={styles.container}>
            {componentDate()}
            {componentHours()}
            {buttonsInsert()}
            <View style={styles.viewList}>
                <FlatList
                    data={listFood.list}
                    keyExtractor={(item) => String(item.id)}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => componentItem(item)}
                />
            </View>
            <View style={styles.viewFooter}>
                <TouchableOpacity onPress={() => {
                    if (parseFloat(milk) > 0 && milk != 0) {
                        insertInfo(date, hour)
                    } else {
                        Alert.alert('Erro!', 'Os campos, Leite e Quantidade, são obrigatórios.')
                    }
                }
                } style={{ width: 60, height: 60, borderRadius: 60 / 2, backgroundColor: '#330066', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 30, marginTop: 0, paddingTop: 0 }}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
    async function insertInfo() {
        let newDataFood = dataFood;
        newDataFood.id = parseInt(lastID) + 1;
        await post("lastId", String(newDataFood.id));
        setLastID(newDataFood.id);

        newDataFood.date = date;
        newDataFood.hour = hour;
        newDataFood.milk = milk;

        let newList = JSON.parse(await get("listFood"));
        newList.list.push(newDataFood);
        await post("listFood", JSON.stringify(newList));
        setListFood({ ...newList });
        clear();
    }
    function clear() {
        setDataFood(props.maskListFood);
        setLastID('0');
        // setListFood({ list: [] })
        setDate(new Date())
        setHour(new Date())
        setMilk('0');
    }
    function componentDate() {
        return (
            <DatePicker
                modal
                mode='date'
                open={openDate}
                date={date}
                onConfirm={(date) => {
                    setOpenDate(false)
                    setDate(date)
                }}
                onCancel={() => {
                    setOpenDate(false)
                }}
                locale='pt-BR'
            />
        )
    }
    function componentHours() {
        return (
            <DatePicker
                modal
                mode='time'
                open={openHour}
                date={hour}
                onConfirm={(hour) => {
                    setOpenHour(false)
                    setHour(hour)
                }}
                onCancel={() => {
                    setOpenHour(false)
                }}
                is24hourSource="locale"
            />
        )
    }
    function componentQuantity() {
        return (
            <TextInput
                style={{ width: 60, height: 30, backgroundColor: '#330066', borderRadius: 6, color: 'white', padding: 0, textAlign: 'center' }}
                onChangeText={(text) => {
                    let newDataFood = dataFood;
                    newDataFood.quantity = text;
                    setDataFood({ ...newDataFood })
                }}
                placeholder="0 ml"
                keyboardType="numeric"
                value={dataFood.quantity}
                placeholderTextColor={'white'}
            />
        )
    }
    function componentItem(item) {
        return (
            <View style={{}}>
                <Text style={styles.textItem}>
                    {dateMaskBr(item.date)} -
                    {hourMask(item.hour)}.
                    Leite {filterMilk(item.milk)} ,
                    qtd {item.quantity ? item.quantity : 0} {parseFloat(item.quantity) >= 1 ? 'lts' : 'ml'}
                </Text>
            </View>
        )
    }
    function filterMilk(id_milk) {
        let result = listMilk.filter((item) => item.value === id_milk);
        return result[0].label;
    }
    function buttonsInsert() {
        return (
            <View style={styles.viewHeader}>
                <TouchableOpacity onPress={() => setOpenDate(true)} style={{ justifyContent: 'center', width: 60, height: 30, backgroundColor: '#330066', alignItems: 'center', borderRadius: 6 }}>
                    <Text style={{ color: '#fff' }}>Data</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setOpenHour(true)} style={{ justifyContent: 'center', width: 60, height: 30, backgroundColor: '#330066', alignItems: 'center', borderRadius: 6 }}>
                    <Text style={{ color: '#fff' }}>Hora</Text>
                </TouchableOpacity>
                {componentQuantity()}
                <Select value={milk} setValue={setMilk} list={listMilk} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        display: 'flex',
        flex: 0.77,
        padding: 4,
        backgroundColor: '#7851a9'
    },
    viewList: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 4,
        marginTop: 8
    },
    modalDate: {
        backgroundColor: '#330066'
    },
    viewHeader: {
        flexDirection: 'row',
        paddingBottom: 4,
        justifyContent: 'space-between',
        marginTop: 10
    },
    viewFooter: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    textItem: {
        color: '#000',
        fontSize: 16,
        marginBottom: 8,
        backgroundColor: '#E2A8FE',
        padding:6,
        borderRadius:8
    }
})