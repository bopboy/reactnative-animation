import React, { useState, useRef } from 'react'
import { Animated, PanResponder, View, Dimensions } from 'react-native'
import styled from 'styled-components/native'
import { Ionicons } from '@expo/vector-icons'
import icons from './icons'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #00a8ff;
`
const Card = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  width: 200px;
  height: 200px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  position: absolute;
`
const Btn = styled.TouchableOpacity`
  margin: 0 10px;
`
const BtnContainer = styled.View`
  flex-direction: row;
  flex: 1;
`
const CardContainer = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
`
export default function App() {
  const scale = useRef(new Animated.Value(1)).current
  const position = useRef(new Animated.Value(0)).current
  const secondScale = position.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [1, 0.5, 1],
    extrapolate: "clamp"
  })
  const rotation = position.interpolate({ inputRange: [-250, 250], outputRange: ["-20deg", "20deg"] });
  const onPressIn = Animated.spring(scale, { toValue: 0.90, useNativeDriver: true })
  const onPressOut = Animated.spring(scale, { toValue: 1, useNativeDriver: true })
  const onCenter = Animated.spring(position, { toValue: 0, useNativeDriver: true })
  const goLeft = Animated.spring(position, { toValue: -SCREEN_WIDTH, tension: 5, useNativeDriver: true })
  const goRight = Animated.spring(position, { toValue: SCREEN_WIDTH, tension: 5, useNativeDriver: true })
  const [index, setIndex] = useState(0)
  const onDismiss = () => {
    scale.setValue(1)
    position.setValue(0)
    setIndex(prev => prev + 1)
  }
  const closePress = () => { goLeft.start(onDismiss) }
  const checkPress = () => { goRight.start(onDismiss) }
  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { dx }) => { position.setValue(dx) },
    onPanResponderGrant: () => onPressIn.start(),
    onPanResponderRelease: (_, { dx }) => {
      if (dx < -250) goLeft.start(onDismiss)
      else if (dx > 250) goRight.start(onDismiss)
      else Animated.parallel([onPressOut, onCenter]).start()
    }
  })).current
  return (
    <Container>
      <CardContainer>
        <Card style={{ transform: [{ scale: secondScale }] }}>
          <Ionicons name={icons[index + 1]} color="#192a56" size={98} />
        </Card>
        <Card
          {...panResponder.panHandlers}
          style={{ transform: [{ scale }, { translateX: position }, { rotateZ: rotation }] }}
        >
          <Ionicons name={icons[index]} color="#192a56" size={98} />
        </Card>
      </CardContainer>
      <BtnContainer>
        <Btn onPress={closePress}><Ionicons name="close-circle" color="white" size={58} /></Btn>
        <Btn onPress={checkPress}><Ionicons name="checkmark-circle" color="white" size={58} /></Btn>
      </BtnContainer>
    </Container>
  )
}
