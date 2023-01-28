import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

export default function Select(props) {
    const [isFocus, setIsFocus] = useState(false);
    return (
        <View style={styles.container}>
            <Dropdown               
                containerStyle={{ backgroundColor: '#330066' }}
                itemContainerStyle={{ backgroundColor: '#330066'}}
                style={[styles.dropdown]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                iconColor='#fff'
                data={props.list}
                search
                itemTextStyle={{ color: '#E2A8FE',fontSize: 14,fontWeight:'bold'}}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? props.value : '...'}
                searchPlaceholder="Buscar..."
                value={props.value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                dropdownItemStyles={{backgroundColor:'red'}}
                onChange={item => {
                    props.setValue(item.value);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        borderRadius: 8,

    },
    dropdown: {
        height: 30,
        width: 120,
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        padding: 0,
        backgroundColor: '#330066'
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 14,
        color: '#fff',

    },
    selectedTextStyle: {
        fontSize: 14,
        color: '#fff',
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 14,
        backgroundColor:'#fff' ,
    },
});