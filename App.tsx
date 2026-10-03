import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import {
  blanketLine,
  blanketStatus,
  EMPTY_BLANKET,
  hasProgress,
  resetBlanket,
  sit,
  stand,
  type BlanketState,
} from "./src/blanket";
import { loadBlanket, saveBlanket } from "./src/store";

export default function App() {
  const [state, setState] = useState<BlanketState>(EMPTY_BLANKET);
  const [note, setNote] = useState("Look at the blanket.");
  const [ready, setReady] = useState(false);
  const [confirmNew, setConfirmNew] = useState(false);

  useEffect(() => {
    let alive = true;
    loadBlanket()
      .then((loaded) => {
        if (!alive) return;
        setState(loaded);
        setNote(hasProgress(loaded) ? "Saved blanket loaded." : "Look at the blanket.");
        setReady(true);
      })
      .catch(() => {
        if (alive) setNote("Could not read the blanket.");
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveBlanket(state).catch(() => setNote("Could not save the blanket."));
  }, [ready, state]);

  if (!ready && note === "Look at the blanket.") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.loading}>Loading the blanket</Text>
        </View>
      </SafeAreaView>
    );
  }

  function apply(result: { state: BlanketState; note: string }) {
    setState(result.state);
    setConfirmNew(false);
    setNote(result.note);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <Text style={styles.title}>Room for Two</Text>
        <Text style={styles.note}>{note}</Text>
        <Text style={styles.count}>{blanketStatus(state)}</Text>
        <Text style={styles.line}>{blanketLine(state)}</Text>
        <View style={styles.row}>
          <BigButton label="Kid sits" inRow onPress={() => apply(sit(state, "kid"))} />
          <BigButton label="Grandma sits" inRow onPress={() => apply(sit(state, "grandma"))} />
        </View>
        <View style={styles.row}>
          <BigButton label="Grandpa sits" inRow onPress={() => apply(sit(state, "grandpa"))} />
          <BigButton label="Last one stands" inRow onPress={() => apply(stand(state))} />
        </View>
        {confirmNew ? (
          <View style={styles.row}>
            <BigButton label="Confirm new" filled inRow onPress={onConfirmNew} />
            <BigButton label="Cancel new" inRow onPress={onCancelNew} />
          </View>
        ) : (
          <BigButton label="New blanket" onPress={() => setConfirmNew(true)} />
        )}
      </View>
    </SafeAreaView>
  );

  function onConfirmNew() {
    const result = resetBlanket();
    setState(result.state);
    setConfirmNew(false);
    setNote(result.note);
  }

  function onCancelNew() {
    setConfirmNew(false);
    setNote("New blanket canceled.");
  }
}

function BigButton({
  label,
  onPress,
  filled,
  inRow,
}: {
  label: string;
  onPress: () => void;
  filled?: boolean;
  inRow?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.button, inRow && styles.buttonRow, filled && styles.buttonFilled]}
    >
      <Text style={[styles.buttonText, filled && styles.buttonTextFilled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F3F6E8" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  loading: { fontSize: 28, fontWeight: "800", color: "#243024" },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 8, gap: 8 },
  title: { fontSize: 32, fontWeight: "800", color: "#243024" },
  note: { fontSize: 18, color: "#4E6248", minHeight: 24 },
  count: { fontSize: 22, fontWeight: "700", color: "#243024" },
  line: { fontSize: 34, fontWeight: "800", color: "#3F6B32", lineHeight: 40 },
  row: { flexDirection: "row", gap: 8 },
  button: {
    minHeight: 60,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#243024",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
  },
  buttonRow: { flex: 1 },
  buttonFilled: { backgroundColor: "#243024" },
  buttonText: { fontSize: 18, fontWeight: "800", color: "#243024", textAlign: "center" },
  buttonTextFilled: { color: "#FFFFFF" },
});
