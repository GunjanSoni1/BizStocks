import { collection } from 'firebase/firestore';

// Utility function for fetching the correct public collection path
export const getCollectionRef = (db, collectionName) => {
  // Use root-level collections so dashboard & writes match
  return collection(db, collectionName);
};
