/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Loading() {
    return (
        <View style={styles.bgModal}>
            <ActivityIndicator color="#FFD700" size="large" />
        </View>
    )
}

const styles = StyleSheet.create({
    bgModal: {
        display:'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,.3)',
        width: '102%',
        height: '102%',
        zIndex: 10,
        position: 'absolute'
    },
});
