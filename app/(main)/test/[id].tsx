// import { fetchTestDetail, startAttempt, type TestDetail } from "@/src/api/quiz";
// import { router, useLocalSearchParams } from "expo-router";
// import { useEffect, useState } from "react";
// import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
// import { useToast } from "react-native-toast-notifications";
// import { colors } from "@/src/utils/colors";

// export default function TestDetailScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const [data, setData] = useState<TestDetail | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [starting, setStarting] = useState(false);
//   const toast = useToast();

//   useEffect(() => {
//     (async () => {
//       try {
//         const d = await fetchTestDetail(Number(id));
//         setData(d);
//       } catch (e) {
//         console.error(e);
//         toast.show("Failed to load test", { type: "danger" });
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id]);

//   const onStart = async () => {
//     try {
//       setStarting(true);
//       const res = await startAttempt(Number(id));
//       router.replace({ pathname: "../attempt/[attemptId]", params: { attemptId: String(res.attempt_id) } });
//     } catch (e) {
//       console.error(e);
//       toast.show("Could not start attempt", { type: "danger" });
//     } finally {
//       setStarting(false);
//     }
//   };

//   if (loading) {
//     return <ActivityIndicator style={{ marginTop: 32 }} />;
//   }
//   if (!data) return null;

//   return (
//     <View style={{ flex: 1, padding: 16, gap: 12 }}>
//       <Text style={{ fontSize: 20, fontWeight: "800", color: colors.text }}>{data.title}</Text>
//       <Text style={{ color: colors.muted }}>Duration: {Math.round(data.duration_sec / 60)} minutes</Text>
//       <Text style={{ color: colors.muted }}>Questions: {data.question_count}</Text>

//       <TouchableOpacity
//         disabled={starting}
//         onPress={onStart}
//         style={{
//           backgroundColor: colors.primary,
//           paddingVertical: 14,
//           borderRadius: 12,
//           alignItems: "center",
//           marginTop: 16,
//           opacity: starting ? 0.7 : 1,
//         }}
//       >
//         <Text style={{ color: "#fff", fontWeight: "800" }}>{starting ? "Starting..." : "Start Test"}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }



import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { colors } from "@/src/utils/colors";
import { useTestDetail, useTestAttempts, useStartAttempt, useInProgress } from "@/src/hooks/useQueries";

export default function TestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); // id is testId now
  const toast = useToast();

  const { data, isLoading } = useTestDetail(id!);
  const { data: attempts = [], isLoading: attemptsLoading } = useTestAttempts(id!);
  const { data: inProgressData } = useInProgress();
  const startMutation = useStartAttempt();

  const loading = isLoading || attemptsLoading;

  const onStart = (forceNew = false) => {
    console.log(`🚀 Starting attempt: testId=${id}, forceNew=${forceNew}`);
    
    startMutation.mutate({ testId: id!, forceNew }, {
      onSuccess: (res) => {
        console.log(`✅ Attempt created: attemptId=${res.attemptId}`);
        
        // Add cache busting parameter to force fresh data
        const timestamp = Date.now();
        router.replace({ 
          pathname: "../attempt/[attemptId]", 
          params: { 
            attemptId: res.attemptId,
            _refresh: timestamp.toString() // Cache buster
          } 
        });
      },
      onError: (e) => {
        console.error("❌ Start attempt failed:", e);
        toast.show("Could not start attempt", { type: "danger" });
      },
    });
  };

  // Determine test state
  const hasCompletedAttempts = attempts.length > 0;
  const hasInProgressForThisTest = inProgressData?.testId === id;
  const noAttempts = !hasCompletedAttempts && !hasInProgressForThisTest;

  const bestScore = hasCompletedAttempts ? Math.max(...attempts.map(a => a.accuracy_pct)) : 0;
  const avgScore = hasCompletedAttempts ? attempts.reduce((sum, a) => sum + a.accuracy_pct, 0) / attempts.length : 0;

  if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;
  if (!data) return null;

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <View style={{ gap: 12 }}>
        {/* Header with badge */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ fontSize: 20, fontWeight: "800", color: colors.text, flex: 1 }}>{data.title}</Text>
          {hasCompletedAttempts && (
            <View style={{
              backgroundColor: "#10B981",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
            }}>
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>ATTEMPTED</Text>
            </View>
          )}
        </View>

        <Text style={{ color: colors.muted }}>Duration: {Math.round(data.duration_sec / 60)} minutes</Text>
        <Text style={{ color: colors.muted }}>Questions: {data.question_count}</Text>

        {/* In-Progress Alert */}
        {hasInProgressForThisTest && (
          <View style={{ 
            backgroundColor: "#FEF3C7", 
            borderRadius: 12, 
            padding: 16, 
            borderWidth: 1, 
            borderColor: "#F59E0B",
            marginTop: 8
          }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#92400E", marginBottom: 4 }}>⏱️ Test In Progress</Text>
            <Text style={{ color: "#92400E" }}>You have an unfinished attempt. You can continue or start fresh.</Text>
          </View>
        )}

        {/* Stats for completed attempts */}
        {hasCompletedAttempts && (
          <View style={{ 
            backgroundColor: colors.card, 
            borderRadius: 12, 
            padding: 16, 
            borderWidth: 1, 
            borderColor: "#E2E8F0",
            marginTop: 8
          }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 8 }}>Your Performance</Text>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.muted, fontSize: 12 }}>Best Score</Text>
                <Text style={{ color: colors.text, fontWeight: "700", fontSize: 18 }}>{Math.round(bestScore)}%</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.muted, fontSize: 12 }}>Avg Score</Text>
                <Text style={{ color: colors.text, fontWeight: "700", fontSize: 18 }}>{Math.round(avgScore)}%</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.muted, fontSize: 12 }}>Attempts</Text>
                <Text style={{ color: colors.text, fontWeight: "700", fontSize: 18 }}>{attempts.length}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Action buttons */}
        <View style={{ gap: 12, marginTop: 16 }}>
          {/* Case 1: No attempts at all */}
          {noAttempts && (
            <TouchableOpacity
              disabled={startMutation.isPending}
              onPress={() => onStart(false)}
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
                opacity: startMutation.isPending ? 0.7 : 1,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "800" }}>
                {startMutation.isPending ? "Starting..." : "🚀 Start Test"}
              </Text>
            </TouchableOpacity>
          )}

          {/* Case 2: Has in-progress attempt for this test */}
          {hasInProgressForThisTest && (
            <>
              <TouchableOpacity
                disabled={startMutation.isPending}
                onPress={() => router.push({ 
                  pathname: "/(main)/attempt/[attemptId]", 
                  params: { attemptId: inProgressData!.attemptId } 
                })}
                style={{
                  backgroundColor: "#10B981",
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "800" }}>▶️ Continue Previous</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                disabled={startMutation.isPending}
                onPress={() => onStart(true)}
                style={{
                  backgroundColor: colors.primary,
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: "center",
                  opacity: startMutation.isPending ? 0.7 : 1,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "800" }}>
                  {startMutation.isPending ? "Starting..." : "🔄 Take Again (Fresh Start)"}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Case 3: Has completed attempts only (no in-progress) */}
          {hasCompletedAttempts && !hasInProgressForThisTest && (
            <TouchableOpacity
              disabled={startMutation.isPending}
              onPress={() => onStart(true)}
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
                opacity: startMutation.isPending ? 0.7 : 1,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "800" }}>
                {startMutation.isPending ? "Starting..." : "🔄 Take Again"}
              </Text>
            </TouchableOpacity>
          )}

          {/* View History button - shown for any completed attempts */}
          {hasCompletedAttempts && (
            <TouchableOpacity
              onPress={() => router.push({ 
                pathname: "/(main)/test/[id]/history", 
                params: { id: id! } 
              })}
              style={{
                backgroundColor: "#0ea5e9",
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "800" }}>📊 View History & Analysis</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
