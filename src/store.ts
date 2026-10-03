import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseBlanket, type BlanketState } from "./blanket";

const KEY = "room-for-two-v1";

export async function loadBlanket(): Promise<BlanketState> {
  const raw = await AsyncStorage.getItem(KEY);
  return parseBlanket(raw);
}

export async function saveBlanket(state: BlanketState): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(state));
}
