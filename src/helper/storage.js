import { Storage } from "@capacitor/storage";

export async function set(key, value){
  await Storage.set({
    key: key,
    value: JSON.stringify(value)
  });
}

export async function get(key) {
  const item = await Storage.get({ key: key });
  return JSON.parse(item.value);
}

export async function remove(key) {
  await Storage.remove({
    key: key
  });
}