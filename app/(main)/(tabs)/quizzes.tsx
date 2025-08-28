import { fetchTests } from "@/src/api/quiz";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../_layout.theme";

type TestRow = {
  testId: string;
  title: string;
  duration_sec: number;
  question_count?: number;
};

export default function Quizzes() {
  const [tests, setTests] = useState<TestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(() => {
    const onBackPress = () => {
      Alert.alert(
        "Exit App",
        "Are you sure you want to exit?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Exit", onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: true }
      );
      return true;
    };

    const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => subscription.remove();
  });

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchTests();
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

  if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text, marginBottom: 12 }}>Available Tests</Text>

      {error ? (
        <Text style={{ color: "crimson", marginBottom: 12 }}>{error}</Text>
      ) : tests.length === 0 ? (
        <View style={{ padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "#E2E8F0", backgroundColor: colors.card }}>
          <Text style={{ color: colors.muted }}>No tests available yet. Pull to refresh.</Text>
        </View>
      ) : null}

      <FlatList
        data={tests}
        keyExtractor={(t) => t.testId}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
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
            <Text style={{ fontWeight: "800", fontSize: 16, color: colors.text }}>{item.title}</Text>
            <Text style={{ color: colors.muted, marginTop: 4 }}>
              Duration: {Math.round(item.duration_sec / 60)} min
              {typeof item.question_count === "number" ? ` • ${item.question_count} Qs` : ""}
            </Text>

            <TouchableOpacity
              onPress={() => router.push({ pathname: "/(main)/test/[id]", params: { id: item.testId } })}
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
        )}
      />
    </View>
  );
}
