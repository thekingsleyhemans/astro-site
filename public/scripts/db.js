// Firestore helper functions (client-side)
import { firebaseConfig } from './firebaseConfig.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function createEmployee(employeeData) {
  const docRef = await addDoc(collection(db, 'employees'), {
    ...employeeData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
}

export async function getEmployeesByOwner(ownerId) {
  const q = query(collection(db, 'employees'), where('ownerId', '==', ownerId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getAllEmployees() {
  const q = query(collection(db, 'employees'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateEmployee(employeeId, updateData) {
  const ref = doc(db, 'employees', employeeId);
  await updateDoc(ref, {
    ...updateData,
    updatedAt: serverTimestamp()
  });
}

export async function deleteEmployee(employeeId) {
  const ref = doc(db, 'employees', employeeId);
  await deleteDoc(ref);
}

export { db };
