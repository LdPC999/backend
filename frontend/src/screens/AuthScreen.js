import React, { useRef, useState, useEffect } from "react";
import { View, Animated, Dimensions, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AuthForm from "../components/AuthForm";
import styles from "../styles/AuthStyles";
import { login, register } from "../services/AuthService";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true); // Estado para alternar login/registro
  const [termsAccepted, setTermsAccepted] = useState(false); // Checkbox de términos
  const navigation = useNavigation();

  const screenWidth = Dimensions.get("window").width; // Ancho de pantalla actual
  const positionAnim = useRef(new Animated.Value(screenWidth / 2)).current;

  // 🔄 Se actualiza la posición de la animación si cambia el tamaño de pantalla
  useEffect(() => {
    const updateLayout = ({ window }) => {
      positionAnim.setValue(isLogin ? window.width / 2 : 0);
    };
    const sub = Dimensions.addEventListener("change", updateLayout);
    return () => sub?.remove();
  }, [isLogin]);

  // 🔁 Alterna entre login y registro con animación
  const toggleForm = () => {
    Animated.timing(positionAnim, {
      toValue: isLogin ? 0 : screenWidth / 2,
      duration: 400,
      useNativeDriver: false,
    }).start(() => setIsLogin(!isLogin));
  };

  // 🚪 Iniciar sesión
  const handleLogin = async ({ email, password }) => {
    try {
      await login(email, password);
      Alert.alert("Éxito", "Sesión iniciada correctamente");

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });

    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // 📝 Registrarse
  const handleRegister = async ({ email, password, nombre, apellidos }) => {
    if (!termsAccepted) {
      Alert.alert("Error", "Debes aceptar los términos y condiciones.");
      return;
    }

    try {
      await register({ email, password, nombre, apellidos });
      Alert.alert("Éxito", "Registro exitoso. Inicia sesión ahora.");
      toggleForm();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const isMobile = screenWidth < 600; // 📱 Detecta si es una pantalla móvil

  return (
    <View style={{ flex: 1, flexDirection: screenWidth > 600 ? 'row' : 'column' }}>
      {screenWidth > 600 ? (
        // 💻 Escritorio con fondo dividido y animación
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
        // 📱 Móvil: cambia fondo según login/registro
        <View style={isLogin ? styles.mobileLogin : styles.mobileRegister}>
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
