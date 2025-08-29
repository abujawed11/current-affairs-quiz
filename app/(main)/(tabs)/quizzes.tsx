// import { fetchTests } from "@/src/api/quiz";
// import { router, useFocusEffect } from "expo-router";
// import { useCallback, useEffect, useState } from "react";
// import { ActivityIndicator, Alert, BackHandler, FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
// import { colors } from "../../_layout.theme";

// type TestRow = {
//   testId: string;
//   title: string;
//   duration_sec: number;
//   question_count?: number;
//   category?: string;
// };

// type QuizCategory = {
//   id: string;
//   label: string;
//   emoji: string;
// };

// const QUIZ_CATEGORIES: QuizCategory[] = [
//   { id: "all", label: "All", emoji: "🧩" },
//   { id: "current-affairs", label: "Current Affairs", emoji: "📅" },
//   { id: "static-gk", label: "Static GK", emoji: "📖" },
//   { id: "history", label: "History", emoji: "🏛️" },
//   { id: "polity", label: "Polity", emoji: "🗳️" },
//   { id: "geography", label: "Geography", emoji: "🌍" },
//   { id: "economy", label: "Economy", emoji: "📈" },
//   { id: "science-tech", label: "Science & Tech", emoji: "🔬" },
//   { id: "environment", label: "Environment", emoji: "🌱" },
//   { id: "sports-awards", label: "Sports & Awards", emoji: "🏆" },
//   { id: "art-culture", label: "Art & Culture", emoji: "🎭" },
// ];

// export default function Quizzes() {
//   const [tests, setTests] = useState<TestRow[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedCategory, setSelectedCategory] = useState("all");

//   useFocusEffect(() => {
//     const onBackPress = () => {
//       Alert.alert(
//         "Exit App",
//         "Are you sure you want to exit?",
//         [
//           { text: "Cancel", style: "cancel" },
//           { text: "Exit", onPress: () => BackHandler.exitApp() },
//         ],
//         { cancelable: true }
//       );
//       return true;
//     };

//     const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
//     return () => subscription.remove();
//   });

//   const load = useCallback(async () => {
//     try {
//       setError(null);
//       const data = await fetchTests();
//       setTests(data);
//     } catch (e: any) {
//       setError(e?.message || "Failed to load tests");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     load();
//   };

//   const filteredTests = selectedCategory === "all" 
//     ? tests 
//     : tests.filter(test => test.category === selectedCategory);

//   if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;

//   return (
//     <View style={{ flex: 1, padding: 16 }}>
//       <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text, marginBottom: 16 }}>Available Tests</Text>
      
//       <ScrollView 
//         horizontal 
//         showsHorizontalScrollIndicator={false} 
//         style={{ marginBottom: 16 }}
//         contentContainerStyle={{ paddingRight: 16 }}
//       >
//         {QUIZ_CATEGORIES.map((category) => (
//           <TouchableOpacity
//             key={category.id}
//             onPress={() => setSelectedCategory(category.id)}
//             style={{
//               backgroundColor: selectedCategory === category.id ? colors.primary : colors.card,
//               borderRadius: 20,
//               paddingHorizontal: 16,
//               paddingVertical: 8,
//               marginRight: 8,
//               borderWidth: 1,
//               borderColor: selectedCategory === category.id ? colors.primary : "#E2E8F0",
//               flexDirection: "row",
//               alignItems: "center",
//             }}
//           >
//             <Text style={{ fontSize: 14, marginRight: 4 }}>{category.emoji}</Text>
//             <Text
//               style={{
//                 color: selectedCategory === category.id ? "#fff" : colors.text,
//                 fontWeight: "600",
//                 fontSize: 14,
//               }}
//             >
//               {category.label}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       {error ? (
//         <Text style={{ color: "crimson", marginBottom: 12 }}>{error}</Text>
//       ) : filteredTests.length === 0 ? (
//         <View style={{ padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "#E2E8F0", backgroundColor: colors.card }}>
//           <Text style={{ color: colors.muted }}>
//             {tests.length === 0 ? "No tests available yet. Pull to refresh." : `No tests found for ${QUIZ_CATEGORIES.find(c => c.id === selectedCategory)?.label || "this category"}.`}
//           </Text>
//         </View>
//       ) : null}

//       <FlatList
//         data={filteredTests}
//         keyExtractor={(t) => t.testId}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         renderItem={({ item }) => (
//           <View
//             style={{
//               backgroundColor: colors.card,
//               borderRadius: 14,
//               borderWidth: 1,
//               borderColor: "#E2E8F0",
//               padding: 16,
//               marginBottom: 12,
//             }}
//           >
//             <Text style={{ fontWeight: "800", fontSize: 16, color: colors.text }}>{item.title}</Text>
//             <Text style={{ color: colors.muted, marginTop: 4 }}>
//               Duration: {Math.round(item.duration_sec / 60)} min
//               {typeof item.question_count === "number" ? ` • ${item.question_count} Qs` : ""}
//               {item.category && item.category !== "all" ? ` • ${QUIZ_CATEGORIES.find(c => c.id === item.category)?.label || item.category}` : ""}
//             </Text>

//             <TouchableOpacity
//               onPress={() => router.push({ pathname: "/(main)/test/[id]", params: { id: item.testId } })}
//               style={{
//                 marginTop: 12,
//                 backgroundColor: colors.primary,
//                 paddingVertical: 10,
//                 borderRadius: 10,
//                 alignItems: "center",
//               }}
//             >
//               <Text style={{ color: "#fff", fontWeight: "800" }}>View & Start</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       />
//     </View>
//   );
// }



import { fetchTests } from "@/src/api/quiz";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import { colors } from "../../_layout.theme";

type TestRow = {
  testId: string;
  title: string;
  duration_sec: number;
  question_count?: number;
  /** Optional until backend adds it */
  category?: string; // e.g., "Current Affairs", "Economy", etc.
};

type Category = {
  key: string; // stable key
  label: string; // display label
  emoji: string;
  // match strings that might arrive from backend for this category
  aliases: string[];
};

const CATEGORIES: Category[] = [
  { key: "all", label: "All", emoji: "🧩", aliases: [] },
  { key: "current_affairs", label: "Current Affairs", emoji: "📅", aliases: ["current affairs", "daily", "ca"] },
  { key: "static_gk", label: "Static GK", emoji: "📖", aliases: ["static gk", "gk"] },
  { key: "history", label: "History", emoji: "🏛️", aliases: ["history"] },
  { key: "polity", label: "Polity", emoji: "🗳️", aliases: ["polity", "constitution", "civics"] },
  { key: "geography", label: "Geography", emoji: "🌍", aliases: ["geography"] },
  { key: "economy", label: "Economy", emoji: "📈", aliases: ["economy", "economic", "finance"] },
  { key: "science_tech", label: "Science & Tech", emoji: "🔬", aliases: ["science & tech", "science", "technology", "s&t"] },
  { key: "environment", label: "Environment", emoji: "🌱", aliases: ["environment", "ecology", "climate"] },
  { key: "sports_awards", label: "Sports & Awards", emoji: "🏆", aliases: ["sports & awards", "sports", "awards"] },
  { key: "art_culture", label: "Art & Culture", emoji: "🎭", aliases: ["art & culture", "culture", "art"] },
];

function normalize(s?: string | null) {
  return (s || "").toLowerCase().trim();
}

function categoryMatches(catKey: string, testCategory?: string | null) {
  console.log("catkey", catKey, "testCategory", testCategory);
  if (catKey === "all") return true;
  const incoming = normalize(testCategory);
  if (!incoming) return false;
  
  // 🎯 DIRECT KEY MATCH - This is what was missing!
  if (catKey === testCategory) return true;
  
  const def = CATEGORIES.find((c) => c.key === catKey);
  if (!def) return false;
  if (normalize(def.label) === incoming) return true;
  return def.aliases.some((a) => normalize(a) === incoming);
}

function getCategoryLabelFromTest(testCategory?: string | null) {
  const incoming = normalize(testCategory);
  if (!incoming) return undefined;
  const match = CATEGORIES.find(
    (c) => normalize(c.label) === incoming || c.aliases.includes(incoming)
  );
  return match?.label ?? testCategory ?? undefined;
}

export default function Quizzes() {
  const [tests, setTests] = useState<TestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // useFocusEffect(() => {
  //   const onBackPress = () => {
  //     Alert.alert(
  //       "Exit App",
  //       "Are you sure you want to exit?",
  //       [
  //         { text: "Cancel", style: "cancel" },
  //         { text: "Exit", onPress: () => BackHandler.exitApp() },
  //       ],
  //       { cancelable: true }
  //     );
  //     return true;
  //   };

  //   const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
  //   return () => subscription.remove();
  // });

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchTests();
      console.log("Test Data: ",data)
      setTests(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load tests");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const filteredTests = useMemo(() => {
    // If backend doesn’t send category yet, “All” shows everything; other categories will hide unknowns.
    return tests.filter((t) => categoryMatches(selectedCategory, t.category));
  }, [tests, selectedCategory]);

  if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text, marginBottom: 12 }}>
        Available Tests
      </Text>

      {/* Category grid */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 12,
        }}
      >
        {CATEGORIES.map((c) => {
          const selected = c.key === selectedCategory;
          return (
            <Pressable
              key={c.key}
              onPress={() => setSelectedCategory(c.key)}
              style={{
                backgroundColor: selected ? colors.primary : colors.card,
                borderWidth: 1,
                borderColor: selected ? colors.primary : "#E2E8F0",
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  color: selected ? "#fff" : colors.text,
                  fontWeight: "700",
                }}
              >
                {c.emoji} {c.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Status / errors */}
      {error ? (
        <Text style={{ color: "crimson", marginBottom: 12 }}>{error}</Text>
      ) : filteredTests.length === 0 ? (
        <View
          style={{
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#E2E8F0",
            backgroundColor: colors.card,
            marginBottom: 12,
          }}
        >
          <Text style={{ color: colors.muted }}>
            No tests in this category yet. Pull to refresh.
          </Text>
        </View>
      ) : null}

      {/* Tests list */}
      <FlatList
        data={filteredTests}
        keyExtractor={(t) => t.testId}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => {
          const niceCat = getCategoryLabelFromTest(item.category);
          return (
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: "#E2E8F0",
                padding: 16,
                marginBottom: 12,
              }}
            >
              <Text style={{ fontWeight: "800", fontSize: 16, color: colors.text }}>
                {item.title}
              </Text>

              <Text style={{ color: colors.muted, marginTop: 4 }}>
                Duration: {Math.round(item.duration_sec / 60)} min
                {typeof item.question_count === "number" ? ` • ${item.question_count} Qs` : ""}
                {niceCat ? ` • ${niceCat}` : ""}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  router.push({ pathname: "/(main)/test/[id]", params: { id: item.testId } })
                }
                style={{
                  marginTop: 12,
                  backgroundColor: colors.primary,
                  paddingVertical: 10,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "800" }}>View & Start</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}
