import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalStore, LocalStoreKey } from './conts';

export async function getLocalData<Key extends LocalStoreKey>(
  key: Key,
  id?: string
) {
  const data = await AsyncStorage.getItem(id ? `${key}-${id}` : key);

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data) as LocalStore[Key];
  } catch (error) {
    return null;
  }
}

export async function setLocalData<Key extends LocalStoreKey>(
  key: Key,
  data: LocalStore[Key],
  id?: string
) {
  try {
    await AsyncStorage.setItem(id ? `${key}-${id}` : key, JSON.stringify(data));

    return true;
  } catch {
    return false;
  }
}

export async function removeLocalData<Key extends LocalStoreKey>(
  key: Key,
  id?: string
) {
  try {
    await AsyncStorage.removeItem(id ? `${key}-${id}` : key);

    return true;
  } catch {
    return false;
  }
}
