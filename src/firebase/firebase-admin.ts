import * as admin from 'firebase-admin';
import * as serviceAccount from './firebase-config.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export { admin };