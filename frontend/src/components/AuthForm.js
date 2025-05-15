import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
} from 'react-native';
import styles from '../styles/AuthStyles';

export default function AuthForm({ isLogin, onToggle, termsAccepted, setTermsAccepted }) {
  return (
    <View style={[styles.formContent, isLogin ? styles.light : styles.dark]}>
      <Text style={[styles.header, { color: isLogin ? '#673AB7' : '#03A9F4' }]}>
        {isLogin ? 'Login' : 'Registro'}
      </Text>

      {!isLogin && (
        <>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.inputLight} keyboardType="email-address" />
          <Text style={styles.label}>Usuario</Text>
          <TextInput style={styles.inputLight} />
        </>
      )}

      {isLogin && (
        <>
          <Text style={styles.label}>Usuario</Text>
          <TextInput style={styles.inputDark} />
        </>
      )}

      <Text style={styles.label}>Contraseña</Text>
      <TextInput style={isLogin ? styles.inputDark : styles.inputLight} secureTextEntry />

      {!isLogin && (
        <View style={styles.checkboxContainer}>
          <Switch value={termsAccepted} onValueChange={setTermsAccepted} />
          <Text style={styles.checkboxText}>
            Acepto los <Text style={styles.link}>términos</Text> y la <Text style={styles.link}>política</Text>
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          isLogin ? styles.login : styles.signup,
        ]}
      >
        <Text style={styles.buttonText}>
          {isLogin ? 'LOG IN' : 'REGISTRO'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onToggle}>
        <Text style={styles.linkButton}>
          {isLogin ? 'REGISTRO' : 'LOG IN'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
