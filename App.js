import React, { useState, useRef } from 'react'
import { Animated, PanResponder } from 'react-native'
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
  const POSITION = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current
  const borderRadius = POSITION.y.interpolate({
    inputRange: [-200, 200],
    outputRange: [100, 0]
  })
  const bgColor = POSITION.y.interpolate({
    inputRange: [-200, 200],
    outputRange: ["rgb(255, 99,71)", "rgb(71,166,255)"]
  })
  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { dx, dy }) => {
      console.log("Touch Move")
      POSITION.setValue({ x: dx, y: dy })
    },
    onPanResponderGrant: () => {
      console.log("Touch Started")
      POSITION.setOffset({ x: POSITION.x._value, y: POSITION.y._value })
    },
    onPanResponderRelease: () => {
      console.log("Touch Finished")
      POSITION.flattenOffset()
    }
  })).current
  return (
    <Container>
      <AnimatedBox
        {...panResponder.panHandlers}
        style={{
          borderRadius,
          backgroundColor: bgColor,
          transform: [...POSITION.getTranslateTransform()]
        }} />
    </Container>
  )
}
