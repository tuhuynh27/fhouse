import { Firebase } from '../lib/firebase';
import uuid from 'uuid';

export async function uploadImage(uri) {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = Firebase
        .storage()
        .ref()
        .child(uuid.v4());

    const snapshot = await ref.put(blob);
    return snapshot.downloadURL;
}