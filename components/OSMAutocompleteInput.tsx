import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";

type PlaceItem = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

export default function OSMAutocompleteInput({
  placeholder,
  value,
  onChangeText,
  onSelect,
}: {
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  onSelect: (item: { label: string; lat: number; lng: number }) => void;
}) {
  const [results, setResults] = useState<PlaceItem[]>([]);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<any>(null);
  const selectedLabelRef = useRef("");

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!value || value.trim().length < 3 || value === selectedLabelRef.current) {
      setResults([]);
      setOpen(false);
      return;
    }

    timerRef.current = setTimeout(async () => {
      try {
        const url =
          `https://nominatim.openstreetmap.org/search` +
          `?q=${encodeURIComponent(value)}` +
          `&format=json&addressdetails=1&limit=6&countrycodes=pk`;

        const res = await fetch(url, {
          headers: { "User-Agent": "khuda-hafiz-app/1.0" },
        });

        const data = (await res.json()) as PlaceItem[];
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
        setOpen(false);
      }
    }, 250);

    return () => clearTimeout(timerRef.current);
  }, [value]);

  return (
    <View style={styles.wrap}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={(t) => {
          selectedLabelRef.current = "";
          onChangeText(t);
          setOpen(true);
        }}
        onBlur={() => {
          // close after losing focus (small delay lets tap register)
          setTimeout(() => setOpen(false), 250);
        }}
        style={styles.input}
        placeholderTextColor="#888"
      />

      {open && results.length > 0 && (
        <View style={styles.dropdown}>
          {results.map((item) => (
            <Pressable
              key={String(item.place_id)}
              style={styles.row}
              onPressIn={() => {
                const selected = {
                  label: item.display_name,
                  lat: Number(item.lat),
                  lng: Number(item.lon),
                };
                selectedLabelRef.current = selected.label;
                setOpen(false);
                setResults([]);
                onSelect(selected);
              }}
            >
              <Text style={styles.rowText} numberOfLines={2}>
                {item.display_name}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    zIndex: 20,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#111",
    backgroundColor: "#fff",
  },
  dropdown: {
    position: "absolute",
    top: 54,
    left: 0,
    right: 0,
    zIndex: 50,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  row: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  rowText: {
    fontSize: 13,
    color: "#222",
  },
});
