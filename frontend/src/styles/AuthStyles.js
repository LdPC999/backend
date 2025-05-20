import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  // 🧱 Contenedor general
  container: {
    flex: 1,
    flexDirection: 'row', // divide la pantalla en dos columnas en web
  },

  // 🎨 Fondos laterales para diseño en escritorio
  leftBackground: {
    flex: 1,
    backgroundColor: '#6096B4', // azul principal para registro
  },
  rightBackground: {
    flex: 1,
    backgroundColor: '#EEE9DA', // crema claro para login
  },

  // 📱 Contenedor para móviles
  mobileContainer: {
    flex: 1,
    backgroundColor: '#EEE9DA',
    justifyContent: 'center',
    padding: 20,
  },

  // 📦 Caja animada que se mueve horizontalmente en escritorio
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

  // 🌓 Fondos según modo login/registro
  dark: {
    backgroundColor: '#2C3034', // fondo oscuro para registro
  },
  light: {
    backgroundColor: '#EEE9DA', // fondo claro para login
  },

  // 🔤 Encabezado de formulario
  header: {
    fontSize: 40,
    fontWeight: '300',
    marginBottom: 20,
  },

  // 🏷️ Etiquetas de input
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

  // ✍️ Campos de texto (inputs)
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

  // 🔘 Botón principal
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },

  // 🎨 Estilos del botón según login/registro
  signup: {
    backgroundColor: '#EEE9DA',
  },
  login: {
    backgroundColor: '#6096B4',
  },

  // ✏️ Texto del botón
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

  // 🔗 Enlace para cambiar entre formularios
  linkButton: {
    color: '#6096B4',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginTop: 10,
  },

  // ✅ Checkbox de términos
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
