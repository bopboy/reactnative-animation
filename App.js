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
  const Y_POSITION = useRef(new Animated.Value(200)).current
  const toggleUp = () => setUp(prev => !prev)
  const moveUp = () => {
    Animated.timing(Y_POSITION, {
      toValue: up ? 200 : -200,
      useNativeDriver: true,
      duration: 3000
    }).start(toggleUp)
  }
  const opacity = Y_POSITION.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [1, 0.5, 1]
  })
  const borderRadius = Y_POSITION.interpolate({
    inputRange: [-200, 200],
    outputRange: [100, 0]
  })
  Y_POSITION.addListener(() => {
    console.log("Y: ", Y_POSITION)
    console.log("opacity: ", opacity)
    console.log("borderRadius: ", borderRadius)
  })
  return (
    <Container>
      <Pressable onPress={moveUp}>
        <AnimatedBox
          style={{
            borderRadius,
            opacity,
            transform: [{ translateY: Y_POSITION }]
          }} />
      </Pressable>
    </Container>
  )
}
