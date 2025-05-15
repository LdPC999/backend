import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const HALF_WIDTH = width / 2;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  leftBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '50%',
    height: '100%',
    backgroundColor: '#e6d116',
  },
  rightBackground: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '100%',
    backgroundColor: '#0b7c01',
  },
  formBox: {
    position: 'absolute',
    top: 0,
    width: HALF_WIDTH,
    height: '100%',
    backgroundColor: '#fff',
    zIndex: 10,
  },
  formContent: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
  },
  dark: {
    backgroundColor: '#2C3034',
  },
  light: {
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 28,
    fontWeight: '300',
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  inputLight: {
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
    color: '#e3e3e3',
    marginBottom: 16,
    paddingVertical: 6,
  },
  inputDark: {
    borderBottomWidth: 1,
    borderBottomColor: '#212121',
    color: '#212121',
    marginBottom: 16,
    paddingVertical: 6,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  signup: {
    backgroundColor: '#03A9F4',
  },
  login: {
    backgroundColor: '#673AB7',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  linkButton: {
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 12,
    color: '#e3e3e3',
  },
  link: {
    color: '#03A9F4',
    textDecorationLine: 'underline',
  },
});
