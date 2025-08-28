import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../../_layout.theme";
import { useTestAttempts, useTestDetail } from "@/src/hooks/useQueries";

export default function TestHistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { data: attempts = [], isLoading: attemptsLoading } = useTestAttempts(id!);
  const { data: testData, isLoading: testLoading } = useTestDetail(id!);

  const loading = attemptsLoading || testLoading;

  const formatTime = (seconds?: number | null) => {
    if (!seconds || seconds <= 0) return "Not recorded";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getGradeColor = (accuracy: number) => {
    if (accuracy >= 80) return "#10B981"; // green
    if (accuracy >= 60) return "#F59E0B"; // yellow
    return "#EF4444"; // red
  };

  const getGradeLetter = (accuracy: number) => {
    if (accuracy >= 90) return "A+";
    if (accuracy >= 80) return "A";
    if (accuracy >= 70) return "B";
    if (accuracy >= 60) return "C";
    return "D";
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;

  const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.accuracy_pct)) : 0;
  const avgScore = attempts.length > 0 ? attempts.reduce((sum, a) => sum + a.accuracy_pct, 0) / attempts.length : 0;
  const validTimes = attempts.filter(a => a.time_taken_sec && a.time_taken_sec > 0);
  const totalTime = validTimes.reduce((sum, a) => sum + (a.time_taken_sec || 0), 0);
  const hasTimeData = validTimes.length > 0;

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <View style={{ gap: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: "800", color: colors.text }}>
          {testData?.title || "Test"} - History
        </Text>

        {/* Summary Stats */}
        <View style={{ 
          backgroundColor: colors.card, 
          borderRadius: 12, 
          padding: 16, 
          borderWidth: 1, 
          borderColor: "#E2E8F0" 
        }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 12 }}>
            Overall Performance
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Best Score</Text>
              <Text style={{ color: colors.text, fontWeight: "700", fontSize: 20 }}>
                {Math.round(bestScore)}%
              </Text>
              <Text style={{ 
                color: getGradeColor(bestScore), 
                fontWeight: "600", 
                fontSize: 14 
              }}>
                {getGradeLetter(bestScore)}
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Average</Text>
              <Text style={{ color: colors.text, fontWeight: "700", fontSize: 20 }}>
                {Math.round(avgScore)}%
              </Text>
              <Text style={{ 
                color: getGradeColor(avgScore), 
                fontWeight: "600", 
                fontSize: 14 
              }}>
                {getGradeLetter(avgScore)}
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Total Attempts</Text>
              <Text style={{ color: colors.text, fontWeight: "700", fontSize: 20 }}>
                {attempts.length}
              </Text>
              <Text style={{ color: colors.muted, fontSize: 12 }}>
                {hasTimeData ? `${formatTime(totalTime)} total` : "Time not tracked"}
              </Text>
            </View>
          </View>
        </View>

        {/* Individual Attempts */}
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>
          Attempt History
        </Text>

        {attempts.map((attempt, index) => (
          <View
            key={attempt.attemptId}
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: "#E2E8F0",
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>
                Attempt #{attempts.length - index}
              </Text>
              <View style={{
                backgroundColor: getGradeColor(attempt.accuracy_pct),
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
              }}>
                <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>
                  {getGradeLetter(attempt.accuracy_pct)}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 16, marginBottom: 8 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.muted, fontSize: 12 }}>Score</Text>
                <Text style={{ color: colors.text, fontWeight: "600" }}>
                  {attempt.score}/{attempt.total} ({Math.round(attempt.accuracy_pct)}%)
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.muted, fontSize: 12 }}>Time Taken</Text>
                <Text style={{ color: colors.text, fontWeight: "600" }}>
                  {formatTime(attempt.time_taken_sec)}
                </Text>
              </View>
            </View>

            <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 12 }}>
              {new Date(attempt.submitted_at).toLocaleDateString()} at{" "}
              {new Date(attempt.submitted_at).toLocaleTimeString()}
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(main)/attempt/[attemptId]/review",
                  params: { attemptId: attempt.attemptId },
                })
              }
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>Review Answers</Text>
            </TouchableOpacity>
          </View>
        ))}

        {attempts.length === 0 && (
          <View style={{ 
            backgroundColor: colors.card, 
            borderRadius: 12, 
            padding: 16, 
            borderWidth: 1, 
            borderColor: "#E2E8F0", 
            alignItems: "center" 
          }}>
            <Text style={{ color: colors.muted }}>No attempts yet</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}