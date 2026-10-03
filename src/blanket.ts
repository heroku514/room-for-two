export type Person = "kid" | "grandma" | "grandpa";

export type BlanketState = {
  seated: Person[];
};

export const EMPTY_BLANKET: BlanketState = { seated: [] };

export function blanketLine(state: BlanketState): string {
  if (state.seated.length === 0) return "The blanket is empty.";
  if (state.seated.length === 1) return "Room for one more.";
  return "The blanket is full.";
}

export function blanketStatus(state: BlanketState): string {
  const has = (person: Person) => state.seated.includes(person);
  if (state.seated.length === 0) return "Nobody yet.";
  if (state.seated.length === 1) {
    if (has("kid")) return "Only the kid.";
    if (has("grandma")) return "Only Grandma.";
    return "Only Grandpa.";
  }
  if (has("kid") && has("grandma")) return "Kid with Grandma.";
  if (has("kid") && has("grandpa")) return "Kid with Grandpa.";
  return "Grandma with Grandpa.";
}

export function hasProgress(state: BlanketState): boolean {
  return state.seated.length > 0;
}

function isPerson(value: unknown): value is Person {
  return value === "kid" || value === "grandma" || value === "grandpa";
}

export function parseBlanket(raw: string | null): BlanketState {
  if (!raw) return EMPTY_BLANKET;
  try {
    const value = JSON.parse(raw) as { seated?: unknown };
    if (!Array.isArray(value.seated) || value.seated.length > 2) return EMPTY_BLANKET;
    const seated: Person[] = [];
    for (const item of value.seated) {
      if (!isPerson(item) || seated.includes(item)) return EMPTY_BLANKET;
      seated.push(item);
    }
    return { seated };
  } catch {
    return EMPTY_BLANKET;
  }
}

export function sit(state: BlanketState, person: Person): { state: BlanketState; note: string } {
  if (state.seated.includes(person)) return { state, note: "Already sitting." };
  if (state.seated.length >= 2) return { state, note: "No more room." };
  const sat = person === "kid" ? "Kid sat." : person === "grandma" ? "Grandma sat." : "Grandpa sat.";
  return { state: { seated: [...state.seated, person] }, note: sat };
}

export function stand(state: BlanketState): { state: BlanketState; note: string } {
  if (state.seated.length === 0) return { state, note: "Already empty." };
  const person = state.seated[state.seated.length - 1];
  const stood = person === "kid" ? "Kid stood." : person === "grandma" ? "Grandma stood." : "Grandpa stood.";
  return { state: { seated: state.seated.slice(0, -1) }, note: stood };
}

export function resetBlanket(): { state: BlanketState; note: string } {
  return { state: EMPTY_BLANKET, note: "Look at the blanket." };
}
