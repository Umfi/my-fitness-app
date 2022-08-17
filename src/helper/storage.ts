import { Preferences } from "@capacitor/preferences";

export async function set(key: string, value: string) {
  await Preferences.set({
    key: key,
    value: JSON.stringify(value)
  });
}

export async function get(key: string) : Promise<any>{
  const item = await Preferences.get({ key: key });
  if (item && item.value !== null) {
    return JSON.parse(item.value);
  } 

  return "";
}

export async function remove(key: string) {
  await Preferences.remove({
    key: key
  });
}