import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from "react-native-date-picker";
import Loading from '../Loading/Loading';
import Select from '../Select/Select';
import { dateMask, dateMaskBr, get, hourMask, post } from '../Util';

export default function RegisterAlimentation(props) {
    const [loading, setLoading] = useState(false);
    const [dataFood, setDataFood] = useState(props.maskListFood);
    const [lastID, setLastID] = useState('0');
    const [listFood, setListFood] = useState({ list: [] });
    const [date, setDate] = useState(new Date());
    const [hour, setHour] = useState(new Date());
    const [milk, setMilk] = useState('0');
    const [listToDay, setListToDay] = useState([]);
    const calcList = {
        maternal: 0.0,
        compound: 0.0,
        total: 0.0
    };
    const [calcFooterList, setCalcFooterList] = useState(calcList);
    const listMilk = [
        { value: '0', label: 'Leite' },
        { value: '1', label: 'Materno' },
        { value: '2', label: 'Composto' }
    ];
    const [openHour, setOpenHour] = useState(false)
    const [openDate, setOpenDate] = useState(false)
    useEffect(() => {
        function calculateMilkQuantity(list) {
            result = calcList;
            list.forEach((element) => {
                if (element.milk == 1) {
                    result.maternal += parseFloat(element.quantity);
                } else {
                    result.compound += parseFloat(element.quantity);
                }
            })
            result.total = result.compound + result.maternal;
            return result;
        }
        async function init() {
            try {
                const listFood = await AsyncStorage.getItem('listFood');
                const lastId = await AsyncStorage.getItem('lastId');
                let listItems = JSON.parse(listFood);
                setListFood(listItems || { list: [] });
                setLastID(lastId);
                setListToDay(toDay(listItems.list || []));

                setCalcFooterList({ ...calculateMilkQuantity(listToDay) })

            } catch (e) {
                console.warn(e)
            }
        }
        init();
    }, []);
    return (
        <View style={styles.container}>
            {loading && <Loading />}
            {componentDate()}
            {componentHours()}
            {buttonsInsert()}
            <View style={styles.viewList}>
                <FlatList
                    data={listToDay}
                    keyExtractor={(item) => String(item.id)}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => componentItem(item)}
                />
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={styles.label}>Materno:</Text><Text style={styles.textStyle}>{(calcFooterList.maternal).toFixed(3)} {measurements(calcFooterList.maternal)}</Text>
                        </View>
                        <View>
                            <Text style={styles.label}>Composto:</Text><Text style={styles.textStyle}>{(calcFooterList.compound).toFixed(3)} {measurements(calcFooterList.compound)}</Text>
                        </View>
                        <View>
                            <Text style={styles.label}>Materno:</Text><Text style={styles.textStyle}>{(calcFooterList.total).toFixed(3)} {measurements(calcFooterList.total)}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.viewFooter}>
                <TouchableOpacity onPress={() => {
                    if (parseFloat(milk) > 0 && parseFloat(dataFood.quantity) > 0) {
                        insertInfo(date, hour)
                    } else {
                        Alert.alert('Erro!', 'Os campos, Leite e Quantidade, são obrigatórios')
                    }
                }
                } style={{ width: 60, height: 60, borderRadius: 60 / 2, backgroundColor: '#330066', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 30, marginTop: 0, paddingTop: 0 }}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
    function toDay(list) {
        let toDay = new Date();
        let newlist = list.filter((element) => {
            if (dateMask(toDay) == dateMask(element.date)) return element;
        })
        return newlist;
    }
    async function insertInfo() {
        setLoading(true);
        let newDataFood = dataFood;
        newDataFood.id = parseInt(lastID) + 1;
        await post("lastId", String(newDataFood.id));
        setLastID(newDataFood.id);

        newDataFood.quantity > 2 && setQuantitys(newDataFood.quantity / 1000)
        newDataFood.date = date;
        newDataFood.hour = hour;
        newDataFood.milk = milk;

        let newList = JSON.parse(await get("listFood"));
        newList.list.push(newDataFood);
        await post("listFood", JSON.stringify(newList));
        setListFood({ ...newList });
        clear();
        setLoading(false);
    }
    function clear() {
        setDataFood({
            id: "",
            date: "",
            hour: "",
            quantity: "",
            milk: ""
        });
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
                onChangeText={(text) => { setQuantitys(text) }}
                placeholder="0 ml"
                keyboardType="numeric"
                value={dataFood.quantity}
                placeholderTextColor={'white'}
            />
        )
    }
    function setQuantitys(quantity) {
        if (quantity != '.' || quantity != ',') {
            let newDataFood = dataFood;
            newDataFood.quantity = quantity;
            setDataFood({ ...newDataFood })
        }
    }
    function componentItem(item) {
        return (
            <View style={{}}>
                <Text style={styles.textItem}>
                    {dateMaskBr(item.date)} -
                    {hourMask(item.hour)}.
                    Leite {filterMilk(item.milk)}, {item.quantity ? `${parseFloat(item.quantity) >= 1 ? parseFloat(item.quantity) : parseFloat(item.quantity).toFixed(3)} ${measurements(item.quantity)}` : ""}
                </Text>
            </View>
        )
    }
    function measurements(quantity) {
        let measurements = "";
        if (parseFloat(quantity) > 1) {
            measurements = 'lts'
        } else if (parseFloat(quantity) < 1) {
            measurements = 'mls'
        } else {
            measurements = 'lt'
        }
        return measurements;
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
        padding: 6,
        borderRadius: 8
    },
    label: {
        color: '#000',
        fontWeight: 'bold',
    },
    textStyle: {
        color: '#777',
    }
})