import React, { useState, useRef } from 'react'
import { Animated, Easing, PanResponder, View } from 'react-native'
import styled from 'styled-components/native'
import { Ionicons } from '@expo/vector-icons'
import icons from './icons'

const BLACK_COLOR = '#1e272e'
const GREY = '#485460'
const GREEN = '#2ecc71'
const RED = '#e74c3c'

const Container = styled.View`
  flex: 1;
  background-color: ${BLACK_COLOR};
`
const Edge = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`
const WordContainer = styled(Animated.createAnimatedComponent(View))`
  width: 100px;
  height: 100px;
  justify-content: center;
  align-items: center;
  background-color: ${GREY};
  border-radius: 50px;
`
const Word = styled.Text`
  font-size: 38px;
  font-weight: 500;
  color: ${props => props.color};
`
const Center = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
  z-index: 10;
`
const IconCard = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  padding: 5px 10px;
  border-radius: 10px;
`
export default function App() {
  const scale = useRef(new Animated.Value(1)).current
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current
  const opacity = useRef(new Animated.Value(1)).current
  const scaleOne = position.y.interpolate({ inputRange: [-300, -80], outputRange: [2, 1], extrapolate: "clamp" })
  const scaleTwo = position.y.interpolate({ inputRange: [80, 300], outputRange: [1, 2], extrapolate: "clamp" })
  const onPressIn = Animated.spring(scale, { toValue: 0.8, useNativeDriver: true })
  const onPressOut = Animated.spring(scale, { toValue: 1, useNativeDriver: true })
  const goHome = Animated.spring(position, { toValue: 0, useNativeDriver: true })
  const onDropScale = Animated.timing(scale, { toValue: 0, duration: 100, easing: Easing.linear, useNativeDriver: true })
  const onDropOpacity = Animated.timing(opacity, { toValue: 0, duration: 100, easing: Easing.linear, useNativeDriver: true })
  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => { onPressIn.start() },
    onPanResponderMove: (_, { dx, dy }) => { position.setValue({ x: dx, y: dy }) },
    onPanResponderRelease: (_, { dy }) => {
      if (dy < -250 || dy > 250) {
        Animated.sequence([
          Animated.parallel([onDropScale, onDropOpacity]),
          Animated.timing(position, { toValue: 0, duration: 100, easing: Easing.linear, useNativeDriver: true })
        ]).start()
      } else {
        Animated.parallel([goHome, onPressOut]).start()
      }
    }
  })).current
  return (
    <Container>
      <Edge>
        <WordContainer style={{ transform: [{ scale: scaleOne }] }}>
          <Word color={GREEN}>알아</Word>
        </WordContainer>
      </Edge>
      <Center>
        <IconCard
          {...panResponder.panHandlers}
          style={{ opacity, transform: [...position.getTranslateTransform(), { scale }] }}
        >
          <Ionicons name="beer" color={GREY} size={76} />
        </IconCard>
      </Center>
      <Edge>
        <WordContainer style={{ transform: [{ scale: scaleTwo }] }}>
          <Word color={RED}>몰라</Word>
        </WordContainer>
      </Edge>
    </Container>
  )
}
