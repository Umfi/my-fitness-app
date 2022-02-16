import { Storage } from "@capacitor/storage";

export async function set(key: string, value: string) {
  await Storage.set({
    key: key,
    value: JSON.stringify(value)
  });
}

export async function get(key: string) : Promise<string>{
  const item = await Storage.get({ key: key });
  if (item && item.value !== null) {
    return JSON.parse(item.value);
  } 

  return "";
}

export async function remove(key: string) {
  await Storage.remove({
    key: key
  });
}