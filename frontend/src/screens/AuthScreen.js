import React, { useRef, useState } from 'react';
import {
  View,
  Animated,
  Dimensions,
  Switch,
} from 'react-native';
import AuthForm from '../components/AuthForm';
import styles from '../styles/AuthStyles';

const { width } = Dimensions.get('window');
const HALF_WIDTH = width / 2;

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const positionAnim = useRef(new Animated.Value(HALF_WIDTH)).current;

  const toggleForm = () => {
    Animated.timing(positionAnim, {
      toValue: isLogin ? 0 : HALF_WIDTH,
      duration: 400,
      useNativeDriver: false,
    }).start(() => setIsLogin(!isLogin));
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftBackground} />
      <View style={styles.rightBackground} />
      <Animated.View style={[styles.formBox, { left: positionAnim }]}>
        <AuthForm
          isLogin={isLogin}
          onToggle={toggleForm}
          termsAccepted={termsAccepted}
          setTermsAccepted={setTermsAccepted}
        />
      </Animated.View>
    </View>
  );
}
