import React, { useState, useRef } from 'react'
import { Animated, Easing, Pressable, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`
const Box = styled.View`
  background-color: tomato;
  width: 200px;
  height: 200px;
`
const AnimatedBox = Animated.createAnimatedComponent(Box)

export default function App() {
  const [up, setUp] = useState(false)
  const POSITION = useRef(new Animated.ValueXY({ x: 0, y: 200 })).current
  const toggleUp = () => setUp(prev => !prev)
  const moveUp = () => {
    Animated.timing(POSITION, {
      toValue: up ? 200 : -200,
      useNativeDriver: false,
      duration: 3000
    }).start(toggleUp)
  }
  const opacity = POSITION.y.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [1, 0.5, 1]
  })
  const borderRadius = POSITION.y.interpolate({
    inputRange: [-200, 200],
    outputRange: [100, 0]
  })
  const rotation = POSITION.y.interpolate({
    inputRange: [-200, 200],
    outputRange: ["-360deg", "360deg"]
  })
  const bgColor = POSITION.y.interpolate({
    inputRange: [-200, 200],
    outputRange: ["rgb(255, 99,71)", "rgb(71,166,255)"]
  })
  POSITION.addListener(() => {
    console.log(bgColor)
  })
  return (
    <Container>
      <Pressable onPress={moveUp}>
        <AnimatedBox
          style={{
            borderRadius,
            opacity,
            backgroundColor: bgColor,
            transform: [{ rotateY: rotation }, { translateY: POSITION.y }]
          }} />
      </Pressable>
    </Container>
  )
}
