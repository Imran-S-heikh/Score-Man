import React, { useContext, useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import Toss from '../../components/Toss'
import { PlayerContext } from '../../contexts/palyers/playerContext'
import { ListItem, Avatar } from 'react-native-elements'
import img from '../../assets/img.jpg'

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    header: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        paddingVertical: 6

    },
    leftElement: {
        fontSize: 18,
        fontWeight: 'bold',
        height: 25,
        width: 25,
        // padding: 5,
        borderRadius: 100,
        textAlign: 'center',
        color: '#fff'
    },
    rightElement: {
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: 'lightgray',
        paddingHorizontal: 10,
        // borderRadius: 5
    },
    titleStyle: {
        fontSize: 18,
    },
    contentWraper: {
        backgroundColor: 'lightgray'
    },
    '1': {
        backgroundColor: '#c4333f'
    },
    '2': {
        backgroundColor: '#6b33c4'
    },
    '3': {
        backgroundColor: '#3383c4'
    }
})


const getVal = (player)=>player.batting.reduce((accu, val) => accu + val.total, 0)
const getWicket =(player)=> player.bowling.reduce((accu,val)=>accu+val.wicket,0)


function Home() {


    const { players } = useContext(PlayerContext);
    
    const [topBatsman,setTopBatsman] = useState([]);
    const [topBowler,setTopBowler] = useState([]);
    const inputRef = useRef();

    useEffect(()=>{
        if(players.length !== 0){
            setTopBatsman(players.sort((a, b) => getVal(b) - getVal(a)))
            setTopBowler(players.sort((a, b) => getWicket(b) - getWicket(a)))
        }
    },[players])


    return (
        <View style={styles.container}>
            <View style={styles.contentWraper}>
                <Text style={styles.header}>Highest Runs</Text>
                <View >
                    {topBatsman.slice(0, 3).map((player, i) =>
                        <ListItem
                            key={player.id}
                            leftElement={<Text style={[styles.leftElement, styles[i + 1]]} >{i + 1}</Text>}
                            title={player.name}
                            titleStyle={styles.titleStyle}
                            rightElement={<Text style={styles.rightElement}>{player.batting.reduce((accu, val) => accu + val.total, 0)}</Text>}
                            bottomDivider
                        />
                    )}
                </View>
                    {/* <Avatar size="large" source={img} /> */}
            </View>
            <View style={styles.contentWraper}>
                <Text style={styles.header}>Highest Wickets</Text>
                <View >
                    {topBowler.slice(0, 3).map((player, i) =>
                        <ListItem
                            key={player.id}
                            leftElement={<Text style={[styles.leftElement, styles[i + 1]]} >{i + 1}</Text>}
                            title={player.name}
                            titleStyle={styles.titleStyle}
                            rightElement={<Text style={styles.rightElement}>{player.bowling.reduce((accu,val)=>accu+val.wicket,0)}</Text>}
                            bottomDivider
                        />
                    )}
                </View>
            </View>
        </View>
    )
}

export default Home
