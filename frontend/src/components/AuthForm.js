import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch } from "react-native";
import styles from "../styles/AuthStyles";

export default function AuthForm({
  isLogin,
  onToggle,
  termsAccepted,
  setTermsAccepted,
  onRegister,
  onLogin,
}) {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    const formData = { email, password, nombre, apellidos };
    console.log("📨 Enviando datos:", formData);
    if (isLogin) {
      if (typeof onLogin === "function") onLogin(formData);
    } else {
      if (!termsAccepted) {
        alert("Debes aceptar los términos y condiciones.");
        return;
      }
      if (typeof onRegister === "function") onRegister(formData);
    }
  };

  const headerText = isLogin ? "LOGIN" : "REGISTRO";
  const toggleText = isLogin
    ? "¿No tienes cuenta? Regístrate aquí"
    : "¿Ya tienes cuenta? Inicia sesión";

  return (
    <View style={[styles.formContent, isLogin ? styles.light : styles.dark]}>
      {/* Título */}
      <Text style={[styles.header, { color: isLogin ? "#6096B4" : "#EEE9DA" }]}>
        {headerText}
      </Text>

      {!isLogin && (
        <>
          <Text style={styles.labelLight}>Nombre</Text>
          <TextInput
            style={styles.inputLight}
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={styles.labelLight}>Apellidos</Text>
          <TextInput
            style={styles.inputLight}
            value={apellidos}
            onChangeText={setApellidos}
          />
        </>
      )}

      <Text style={isLogin ? styles.labelDark : styles.labelLight}>Email</Text>
      <TextInput
        style={isLogin ? styles.inputDark : styles.inputLight}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={isLogin ? styles.labelDark : styles.labelLight}>
        Contraseña
      </Text>
      <TextInput
        style={isLogin ? styles.inputDark : styles.inputLight}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {!isLogin && (
        <View style={styles.checkboxContainer}>
          <Switch value={termsAccepted} onValueChange={setTermsAccepted} />
          <Text style={styles.checkboxText}>
            Acepto los <Text style={styles.link}>términos</Text> y la{" "}
            <Text style={styles.link}>política</Text>
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, isLogin ? styles.login : styles.signup]}
        onPress={handleSubmit}
      >
        <Text
          style={isLogin ? styles.buttonTextLogin : styles.buttonTextSignup}
        >
          {isLogin ? "Iniciar sesión" : "Registrarme"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onToggle}>
        <Text style={styles.linkButton}>{toggleText}</Text>
      </TouchableOpacity>
    </View>
  );
}
