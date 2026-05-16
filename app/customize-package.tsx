import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Stack, useRouter } from "expo-router";
import TopBar from "../components/TopBar";
import BottomNavBar from "../components/BottomNavBar";
import { getServices, Service } from "../utils/servicesAPI";
import { palette, radius, shadow, spacing } from "../constants/theme";

export default function CustomizePackageScreen() {
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const [cateringDishSelection, setCateringDishSelection] = useState<
    "" | "dish1" | "dish2" | "both"
  >("");
  const [cateringPeopleInput, setCateringPeopleInput] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        console.error("Failed to fetch services", err);
      }
    };
    fetchServices();
  }, []);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const cateringPeople = Number.parseInt(cateringPeopleInput, 10);
  const validCateringPeople =
    Number.isFinite(cateringPeople) && cateringPeople > 0 ? cateringPeople : 0;
  const cateringPerPerson = cateringDishSelection === "both" ? 1000 : 500;

  const isCateringService = (name: string) => /catering/i.test(name);
  const cateringService = services.find((s) => isCateringService(s.name));
  const isCateringSelected = !!(
    cateringService && selected.includes(cateringService._id)
  );

  const cateringDishLabel =
    cateringDishSelection === "dish1"
      ? "2 Dishes & Roti"
      : cateringDishSelection === "dish2"
      ? "Rice, Chicken & Roti (Customizable)"
      : cateringDishSelection === "both"
      ? "Both Dishes"
      : "";

  const selectedItems = services
    .filter((s) => selected.includes(s._id))
    .map((s) => {
      if (!isCateringService(s.name)) {
        return {
          name: s.name,
          price: s.price,
        };
      }

      const cateringTotal = validCateringPeople * cateringPerPerson;
      const cateringName =
        cateringDishLabel && validCateringPeople
          ? `${s.name} - ${cateringDishLabel} (${validCateringPeople} people)`
          : s.name;

      return {
        name: cateringName,
        price: cateringTotal,
      };
    });

  const total = selectedItems.reduce((sum, item) => sum + item.price, 0);

  const handleBook = () => {
    if (isCateringSelected) {
      if (!cateringDishSelection) {
        alert("Please select dishes for Catering.");
        return;
      }
      if (!validCateringPeople) {
        alert("Please enter valid number of people for Catering.");
        return;
      }
    }

    router.push({
      pathname: "/order-details",
      params: {
        packageName: "Custom Package",
        items: JSON.stringify(selectedItems),
      },
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <TopBar showBack onBackPress={() => router.back()} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.tabs}>
            <TouchableOpacity onPress={() => router.push("/basic-package")}>
              <Text style={styles.tab}>Basic</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/standard-package")}>
              <Text style={styles.tab}>Standard</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/premium-package")}>
              <Text style={styles.tab}>Premium</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={[styles.tab, styles.activeTab]}>Customize</Text>
            </TouchableOpacity>
          </View>

          {services.map((item) => {
            const itemSelected = selected.includes(item._id);
            const itemIsCatering = isCateringService(item.name);
            const itemPrice = itemIsCatering
              ? validCateringPeople * cateringPerPerson
              : item.price;

            return (
              <View key={item._id} style={styles.packageCard}>
                <TouchableOpacity
                  onPress={() => toggleSelect(item._id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardRow}>
                    <View
                      style={[styles.radio, itemSelected && styles.radioSelected]}
                    />
                    <Text style={styles.packageTitle}>{item.name}</Text>
                    <Text style={styles.packagePrice}>
                      Rs {(itemSelected ? itemPrice : item.price).toLocaleString()}
                    </Text>
                  </View>
                </TouchableOpacity>

                <Text style={styles.packageDesc}>{item.desc}</Text>

                {itemIsCatering && itemSelected ? (
                  <View style={styles.expandWrap}>
                    <Text style={styles.expandLabel}>Select Dishes</Text>
                    <View style={styles.pickerWrap}>
                      <Picker
                        selectedValue={cateringDishSelection}
                        onValueChange={(value) => setCateringDishSelection(value)}
                      >
                        <Picker.Item label="Select dish type" value="" />
                        <Picker.Item label="2 Dishes & Roti" value="dish1" />
                        <Picker.Item
                          label="Rice, Chicken & Roti (Customizable)"
                          value="dish2"
                        />
                        <Picker.Item label="Both Dishes" value="both" />
                      </Picker>
                    </View>

                    <Text style={styles.expandLabel}>Number of People</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter number of people"
                      keyboardType="number-pad"
                      value={cateringPeopleInput}
                      onChangeText={(text) =>
                        setCateringPeopleInput(text.replace(/[^0-9]/g, ""))
                      }
                    />

                    <Text style={styles.cateringTotal}>
                      Catering Total: Rs {(validCateringPeople * cateringPerPerson).toLocaleString()}
                    </Text>
                  </View>
                ) : null}
              </View>
            );
          })}

          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalPrice}>Rs {total.toLocaleString()}</Text>
          </View>

          <TouchableOpacity
            style={[styles.buyButton, selected.length === 0 && { opacity: 0.5 }]}
            disabled={selected.length === 0}
            onPress={handleBook}
          >
            <Text style={styles.buyButtonText}>Book Now</Text>
          </TouchableOpacity>
        </ScrollView>

        <BottomNavBar />
      </View>
    </>
  );
}

const BROWN = palette.brown;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.cream },
  scrollContent: { paddingBottom: 112 },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: spacing.md,
    padding: 5,
    borderRadius: radius.pill,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow.soft,
  },

  tab: {
    fontSize: 12,
    color: palette.muted,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    fontWeight: "800",
  },

  activeTab: {
    backgroundColor: BROWN,
    color: "#fff",
    fontWeight: "900",
  },

  packageCard: {
    backgroundColor: palette.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginHorizontal: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow.soft,
  },

  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: BROWN,
    marginRight: 10,
  },

  radioSelected: {
    backgroundColor: BROWN,
  },

  packageTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
    color: BROWN,
  },

  packagePrice: {
    fontSize: 16,
    fontWeight: "700",
    color: BROWN,
  },

  packageDesc: {
    fontSize: 12,
    color: palette.muted,
    marginLeft: 28,
    lineHeight: 18,
  },

  expandWrap: {
    marginTop: 10,
    marginLeft: 28,
  },

  expandLabel: {
    fontSize: 12,
    color: palette.brown,
    marginBottom: 6,
    fontWeight: "800",
  },

  pickerWrap: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    marginBottom: 10,
    overflow: "hidden",
    backgroundColor: palette.cream,
  },

  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
    backgroundColor: palette.cream,
  },

  cateringTotal: {
    fontSize: 13,
    color: BROWN,
    fontWeight: "700",
  },

  totalCard: {
    backgroundColor: palette.parchment,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginHorizontal: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: palette.sand,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  totalLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: BROWN,
  },

  totalPrice: {
    fontSize: 16,
    fontWeight: "900",
    color: BROWN,
  },

  buyButton: {
    backgroundColor: palette.mahogany,
    margin: 20,
    paddingVertical: 14,
    borderRadius: radius.pill,
    alignItems: "center",
    ...shadow.glow,
  },

  buyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
});
