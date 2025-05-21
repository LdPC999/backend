import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  // 🧱 Contenedor general en escritorio
  container: {
    flex: 1,
    flexDirection: 'row',
  },

  // 🎨 Fondos izquierdo y derecho para vista escritorio
  leftBackground: {
    flex: 1,
    backgroundColor: '#6096B4', // Azul para registro
  },
  rightBackground: {
    flex: 1,
    backgroundColor: '#EEE9DA', // Crema claro para login
  },

  // 📱 Contenedor para vista móvil modo login
  mobileLogin: {
    flex: 1,
    backgroundColor: '#EEE9DA', // Fondo claro
    justifyContent: 'center',
    padding: 20,
  },

  // 📱 Contenedor para vista móvil modo registro
  mobileRegister: {
    flex: 1,
    backgroundColor: '#2C3034', 
    justifyContent: 'center',
    padding: 20,
  },

  // 📦 Caja animada flotante para escritorio
  formBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  // 📋 Contenido interno del formulario
  formContent: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
  },

  // 🌓 Fondo interior según modo
  dark: {
    backgroundColor: '#2C3034', // Gris oscuro
  },
  light: {
    backgroundColor: '#EEE9DA', // Crema claro
  },

  // 🏷️ Título del formulario
  header: {
    fontSize: 40,
    fontWeight: '300',
    marginBottom: 20,
  },

  // 🏷️ Etiquetas
  labelLight: {
    fontSize: 14,
    color: '#EEE9DA',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  labelDark: {
    fontSize: 14,
    color: '#6096B4',
    marginBottom: 4,
    textTransform: 'uppercase',
  },

  // ✍️ Inputs
  inputLight: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEE9DA',
    color: '#EEE9DA',
    marginBottom: 16,
    paddingVertical: 6,
    fontSize: 18,
  },
  inputDark: {
    borderBottomWidth: 1,
    borderBottomColor: '#6096B4',
    color: '#6096B4',
    marginBottom: 16,
    paddingVertical: 6,
    fontSize: 18,
  },

  // 🔘 Botones
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  signup: {
    backgroundColor: '#EEE9DA',
  },
  login: {
    backgroundColor: '#6096B4',
  },

  // 🔤 Texto de botones
  buttonTextLogin: {
    color: '#EEE9DA',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  buttonTextSignup: {
    color: '#6096B4',
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  // 🔗 Enlace inferior para alternar
  linkButton: {
    color: '#6096B4',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginTop: 10,
  },

  // ✅ Checkbox y texto
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#EEE9DA',
  },

  // 🔗 Enlaces dentro del texto
  link: {
    color: '#6096B4',
    textDecorationLine: 'underline',
  },
});
