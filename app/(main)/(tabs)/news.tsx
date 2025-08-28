import { useEffect, useState } from "react";
import { FlatList, Linking, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../_layout.theme";

// You can later replace this with a real API call (e.g., /news from your backend)
type NewsItem = { id: string; title: string; source: string; url: string };

export default function News() {
  const [items, setItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    // placeholder seeds (replace with API fetch)
    setItems([
      { id: "1", title: "G20 Summit Highlights", source: "Press", url: "https://www.mea.gov.in/" },
      { id: "2", title: "RBI Monetary Policy Update", source: "RBI", url: "https://rbi.org.in/" },
      { id: "3", title: "Parliament Latest Bills", source: "PRS", url: "https://prsindia.org/billtrack" },
    ]);
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text, marginBottom: 12 }}>Current News</Text>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => Linking.openURL(item.url)}
            style={{ backgroundColor: colors.card, padding: 16, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: "#E2E8F0" }}
          >
            <Text style={{ fontWeight: "700", color: colors.text }}>{item.title}</Text>
            <Text style={{ color: colors.muted, marginTop: 4 }}>{item.source}</Text>
            <Text style={{ color: colors.primary, marginTop: 4 }}>Open link ↗</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
