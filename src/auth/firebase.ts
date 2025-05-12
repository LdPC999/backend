import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(
    readFileSync('ruta/a/tu/firebase-service-account.json', 'utf-8')
  )),
});

export default admin;