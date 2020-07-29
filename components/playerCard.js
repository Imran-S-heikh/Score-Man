import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Card } from 'react-native-elements'


const styles = StyleSheet.create({
    itemContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    item: {
        display: 'flex',
        flexDirection: 'row'
    },
    label: {
        color: 'grey'
    }
})

export default function PlayerCard({player}) {
    return (
        <Card title={player.name}>
            <View>
                <View style={styles.itemContainer}>
                    <View style={styles.item}>
                        <Text style={styles.label}>Highest Score: </Text>
                        <Text>80</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.label}>Runs: </Text>
                        <Text>344</Text>
                    </View>
                </View>
                <View style={styles.itemContainer}>
                    <View style={styles.item}>
                        <Text style={styles.label}>Best Bowling: </Text>
                        <Text>7/30</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.label}>Wickets: </Text>
                        <Text>30</Text>
                    </View>
                </View>
            </View>
        </Card>
    )
}


