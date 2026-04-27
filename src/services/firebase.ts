import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDhA1yw1pukUV_zyyl77nMutWLYPk7PxWg",
  authDomain: "sih-project-2004.firebaseapp.com",
  projectId: "sih-project-2004",
  storageBucket: "sih-project-2004.firebasestorage.app",
  messagingSenderId: "559516560940",
  appId: "1:559516560940:web:c0f3ef1413bc911f49eb89"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export type UserRole = 'authority' | 'user';

// ─── User profile ────────────────────────────────────────────────────────────

export const createUserProfile = async (
  uid: string,
  email: string,
  displayName: string,
  role: UserRole
) => {
  await setDoc(doc(db, 'users', uid), {
    uid,
    email,
    displayName,
    role,
    createdAt: serverTimestamp(),
  });
};

export const getUserRole = async (uid: string): Promise<UserRole | null> => {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data().role as UserRole;
    }
    return null;
  } catch {
    return null;
  }
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const registerUser = async (
  email: string,
  password: string,
  displayName: string,
  role: UserRole
) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  await createUserProfile(cred.user.uid, email, displayName, role);
  return cred.user;
};

export const loginUser = async (email: string, password: string) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
};

export const loginWithGoogle = async (role: UserRole) => {
  const cred = await signInWithPopup(auth, googleProvider);
  const existing = await getUserRole(cred.user.uid);
  if (!existing) {
    await createUserProfile(
      cred.user.uid,
      cred.user.email ?? '',
      cred.user.displayName ?? '',
      role
    );
  }
  return cred.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const getCurrentUser = () => auth.currentUser;

export const onAuthStateChange = (callback: (user: any) => void) =>
  onAuthStateChanged(auth, callback);

export const loginAsGovernment = async (email: string, password: string) =>
  loginUser(email, password);
export const logoutGovernment = async () => logoutUser();

// ─── Policies ─────────────────────────────────────────────────────────────────

export const addPolicy = async (title: string, description: string) => {
  const user = getCurrentUser();
  if (!user) throw new Error('Must be logged in to add policies.');

  const docRef = await addDoc(collection(db, 'policies'), {
    title,
    description,
    createdAt: serverTimestamp(),
    createdBy: user.email,
    createdByUid: user.uid,
    totalComments: 0,
    aiSummary: '',
    sentimentDistribution: { positive: 0, negative: 0, neutral: 0 },
  });
  return { id: docRef.id, title, description, createdAt: new Date().toISOString() };
};

export const updatePolicy = async (
  policyId: string,
  title: string,
  description: string
) => {
  await updateDoc(doc(db, 'policies', policyId), { title, description });
};

export const deletePolicy = async (policyId: string) => {
  await deleteDoc(doc(db, 'policies', policyId));
};

export const getPolicies = async () => {
  const q = query(collection(db, 'policies'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt,
    };
  });
};

// ─── Comments ─────────────────────────────────────────────────────────────────

export const addComment = async (policyId: string, comment: any) => {
  const docRef = await addDoc(collection(db, 'policies', policyId, 'comments'), {
    ...comment,
    timestamp: serverTimestamp(),
  });
  await updatePolicyAnalysis(policyId);
  return { id: docRef.id, ...comment };
};

export const getComments = async (policyId: string) => {
  const q = query(
    collection(db, 'policies', policyId, 'comments'),
    orderBy('timestamp', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      timestamp:
        data.timestamp instanceof Timestamp
          ? data.timestamp.toDate().toISOString()
          : data.timestamp,
    };
  });
};

export const getOwnComments = async (policyId: string, userId: string) => {
  const q = query(
    collection(db, 'policies', policyId, 'comments'),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      timestamp:
        data.timestamp instanceof Timestamp
          ? data.timestamp.toDate().toISOString()
          : data.timestamp,
    };
  });
};

export const updateComment = async (
  policyId: string,
  commentId: string,
  newText: string,
  userId: string
) => {
  const ref = doc(db, 'policies', policyId, 'comments', commentId);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data().userId !== userId) {
    throw new Error('Not authorized to edit this comment.');
  }
  await updateDoc(ref, { text: newText });
};

export const deleteComment = async (policyId: string, commentId: string) => {
  const user = getCurrentUser();
  if (!user) throw new Error('Must be logged in.');
  await deleteDoc(doc(db, 'policies', policyId, 'comments', commentId));
  await updatePolicyAnalysis(policyId);
  return true;
};

// ─── AI analysis helpers ──────────────────────────────────────────────────────

const updatePolicyAnalysis = async (policyId: string) => {
  try {
    const comments = await getComments(policyId);
    if (comments.length === 0) return;

    const allCommentsText = comments.map((c: any) => c.text).join(' ');
    const { generateCollectiveSummary, analyzeCollectiveSentiment } = await import('./api');

    const aiSummary = await generateCollectiveSummary(allCommentsText, comments.length);
    const sentimentDistribution = analyzeCollectiveSentiment(comments);

    await updateDoc(doc(db, 'policies', policyId), {
      totalComments: comments.length,
      aiSummary,
      sentimentDistribution,
    });
  } catch (error) {
    console.error('Error updating policy analysis:', error);
  }
};

export const getAllComments = async () => {
  const policies = await getPolicies();
  const all: any[] = [];
  for (const policy of policies) {
    const c = await getComments(policy.id);
    all.push(...c);
  }
  return all.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

export default firebaseConfig;