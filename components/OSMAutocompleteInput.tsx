import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";

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

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!value || value.trim().length < 3) {
      setResults([]);
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
      }
    }, 250);

    return () => clearTimeout(timerRef.current);
  }, [value]);

  return (
    <View style={{ position: "relative" }}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={(t) => {
          onChangeText(t);
          setOpen(true);
        }}
        onBlur={() => {
          // close after losing focus (small delay lets tap register)
          setTimeout(() => setOpen(false), 150);
        }}
        style={styles.input}
        placeholderTextColor="#888"
      />

      {open && results.length > 0 && (
        <View style={styles.dropdown}>
          {results.map((item) => (
            <TouchableOpacity
              key={String(item.place_id)}
              style={styles.row}
              activeOpacity={0.7}
              onPress={() => {
                setOpen(false);
                setResults([]);
                onSelect({
                  label: item.display_name,
                  lat: Number(item.lat),
                  lng: Number(item.lon),
                });
              }}
            >
              <Text style={styles.rowText} numberOfLines={2}>
                {item.display_name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 4,
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