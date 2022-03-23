import React, { useRef } from 'react'
import { Animated, PanResponder, View } from 'react-native'
import styled from 'styled-components/native'
import { Ionicons } from '@expo/vector-icons'

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
  const goLeft = Animated.spring(position, { toValue: -500, tension: 5, useNativeDriver: true })
  const goRight = Animated.spring(position, { toValue: 500, tension: 5, useNativeDriver: true })
  const closePress = () => { goLeft.start() }
  const checkPress = () => { goRight.start() }
  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { dx }) => { position.setValue(dx) },
    onPanResponderGrant: () => onPressIn.start(),
    onPanResponderRelease: (_, { dx }) => {
      if (dx < -250) goLeft.start()
      else if (dx > 250) goRight.start()
      else Animated.parallel([onPressOut, onCenter]).start()
    }
  })).current
  return (
    <Container>
      <CardContainer>
        <Card style={{ transform: [{ scale: secondScale }] }}>
          <Ionicons name="beer" color="#192a56" size={98} />
        </Card>
        <Card
          {...panResponder.panHandlers}
          style={{ transform: [{ scale }, { translateX: position }, { rotateZ: rotation }] }}
        >
          <Ionicons name="pizza" color="#192a56" size={98} />
        </Card>
      </CardContainer>
      <BtnContainer>
        <Btn onPress={closePress}><Ionicons name="close-circle" color="white" size={58} /></Btn>
        <Btn onPress={checkPress}><Ionicons name="checkmark-circle" color="white" size={58} /></Btn>
      </BtnContainer>
    </Container>
  )
}
