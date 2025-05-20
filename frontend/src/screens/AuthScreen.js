import React, { useRef, useState, useEffect } from "react";
import { View, Animated, Dimensions, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AuthForm from "../components/AuthForm";
import styles from "../styles/AuthStyles";
import { login, register } from "../services/AuthService";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigation = useNavigation();

  const screenWidth = Dimensions.get("window").width;
  const positionAnim = useRef(new Animated.Value(screenWidth / 2)).current;

  // Actualiza animación si cambia el tamaño de la pantalla
  useEffect(() => {
    const updateLayout = ({ window }) => {
      positionAnim.setValue(isLogin ? window.width / 2 : 0);
    };
    const sub = Dimensions.addEventListener("change", updateLayout);
    return () => sub?.remove();
  }, [isLogin]);

  // Cambia entre login y registro con animación
  const toggleForm = () => {
    Animated.timing(positionAnim, {
      toValue: isLogin ? 0 : screenWidth / 2,
      duration: 400,
      useNativeDriver: false,
    }).start(() => setIsLogin(!isLogin));
  };

  // Maneja el login
  const handleLogin = async ({ email, password }) => {
    try {
      await login(email, password);
      Alert.alert("Éxito", "Sesión iniciada correctamente");

      // Redirige al HomeScreen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });

    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // Maneja el registro
  const handleRegister = async ({ email, password, nombre, apellidos }) => {
    if (!termsAccepted) {
      Alert.alert("Error", "Debes aceptar los términos y condiciones.");
      return;
    }

    try {
      await register({ email, password, nombre, apellidos });
      Alert.alert("Éxito", "Registro exitoso. Inicia sesión ahora.");
      toggleForm(); // volver a login
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={{ flex: 1, flexDirection: screenWidth > 600 ? 'row' : 'column' }}>
      {screenWidth > 600 ? (
        // 💻 Escritorio: diseño dividido con animación
        <>
          <View style={styles.leftBackground} />
          <View style={styles.rightBackground} />

          <Animated.View
            style={[
              styles.formBox,
              {
                left: positionAnim,
                width: screenWidth / 2,
              },
            ]}
          >
            <AuthForm
              isLogin={isLogin}
              onToggle={toggleForm}
              termsAccepted={termsAccepted}
              setTermsAccepted={setTermsAccepted}
              onLogin={handleLogin}
              onRegister={handleRegister}
            />
          </Animated.View>
        </>
      ) : (
        // 📱 Móvil: vista centrada sin animación
        <View style={styles.mobileContainer}>
          <AuthForm
            isLogin={isLogin}
            onToggle={toggleForm}
            termsAccepted={termsAccepted}
            setTermsAccepted={setTermsAccepted}
            onLogin={handleLogin}
            onRegister={handleRegister}
          />
        </View>
      )}
    </View>
  );
}
