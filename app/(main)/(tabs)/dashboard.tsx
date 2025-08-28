// import * as AuthApi from "@/src/api/auth";
// import { fetchTests } from "@/src/api/quiz";
// import { router } from "expo-router";
// import { useEffect, useMemo, useState } from "react";
// import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
// import { colors } from "../../_layout.theme";

// type AttemptSummary = Awaited<ReturnType<typeof AuthApi.myAttempts>>[number];

// function pct(n: number) {
//   if (Number.isNaN(n)) return 0;
//   return Math.round(n);
// }

// export default function Dashboard() {
//   const [loading, setLoading] = useState(true);
//   const [attempts, setAttempts] = useState<AttemptSummary[]>([]);
//   const [testsAvailable, setTestsAvailable] = useState<number>(0);

//   useEffect(() => {
//     (async () => {
//       try {
//         const [a, t] = await Promise.all([AuthApi.myAttempts(), fetchTests()]);
//         setAttempts(a);
//         setTestsAvailable(t.length);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   const stats = useMemo(() => {
//     const totalAttempts = attempts.length;
//     const avgAcc =
//       totalAttempts === 0 ? 0 : attempts.reduce((s, r) => s + (r.accuracy_pct || 0), 0) / totalAttempts;
//     const best =
//       totalAttempts === 0 ? 0 : Math.max(...attempts.map((r) => r.accuracy_pct || 0));
//     const recent = attempts[0]; // already sorted desc by API
//     return {
//       totalAttempts,
//       avgAccuracy: pct(avgAcc),
//       bestAccuracy: pct(best),
//       recent,
//     };
//   }, [attempts]);

//   if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;

//   return (
//     <View style={{ flex: 1, padding: 16, gap: 12 }}>
//       <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text }}>Welcome 👋</Text>
//       <Text style={{ color: colors.muted }}>
//         Keep your current affairs sharp. Your quick stats are below.
//       </Text>

//       {/* Stat cards */}
//       <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
//         <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#E2E8F0" }}>
//           <Text style={{ color: colors.muted, fontWeight: "600" }}>Attempts</Text>
//           <Text style={{ color: colors.text, fontSize: 20, fontWeight: "800" }}>{stats.totalAttempts}</Text>
//         </View>
//         <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#E2E8F0" }}>
//           <Text style={{ color: colors.muted, fontWeight: "600" }}>Avg Accuracy</Text>
//           <Text style={{ color: colors.text, fontSize: 20, fontWeight: "800" }}>{stats.avgAccuracy}%</Text>
//         </View>
//       </View>

//       <View style={{ flexDirection: "row", gap: 12 }}>
//         <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#E2E8F0" }}>
//           <Text style={{ color: colors.muted, fontWeight: "600" }}>Best Accuracy</Text>
//           <Text style={{ color: colors.text, fontSize: 20, fontWeight: "800" }}>{stats.bestAccuracy}%</Text>
//         </View>
//         <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#E2E8F0" }}>
//           <Text style={{ color: colors.muted, fontWeight: "600" }}>Tests Available</Text>
//           <Text style={{ color: colors.text, fontSize: 20, fontWeight: "800" }}>{testsAvailable}</Text>
//         </View>
//       </View>

//       {/* Recent attempt */}
//       {stats.recent ? (
//         <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#E2E8F0", marginTop: 8 }}>
//           <Text style={{ color: colors.muted, fontWeight: "600", marginBottom: 6 }}>Most Recent</Text>
//           <Text style={{ color: colors.text, fontWeight: "800" }}>{stats.recent.title}</Text>
//           <Text style={{ color: colors.muted, marginTop: 4 }}>
//             {stats.recent.score}/{stats.recent.total} • {stats.recent.accuracy_pct}% •{" "}
//             {new Date(stats.recent.submitted_at).toLocaleString()}
//           </Text>

//           <TouchableOpacity
//             onPress={() =>
//               router.push({
//                 pathname: "/(main)/attempt/[attemptId]/review",
//                 params: { attemptId: stats.recent!.attemptId },
//               })
//             }
//             style={{ marginTop: 12, backgroundColor: colors.primary, paddingVertical: 10, borderRadius: 10, alignItems: "center" }}
//           >
//             <Text style={{ color: "#fff", fontWeight: "800" }}>View Review</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#E2E8F0", marginTop: 8 }}>
//           <Text style={{ color: colors.text, fontWeight: "700" }}>No attempts yet</Text>
//           <Text style={{ color: colors.muted, marginTop: 4 }}>Start a quiz to see your progress here.</Text>
//         </View>
//       )}

//       {/* Quick actions */}
//       <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
//         <TouchableOpacity
//           onPress={() => router.push("/(main)/(tabs)/quizzes")}
//           style={{ flex: 1, backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 10, alignItems: "center" }}
//         >
//           <Text style={{ color: "#fff", fontWeight: "800" }}>Start a Quiz</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => router.push("/(main)/attempts")}
//           style={{ flex: 1, backgroundColor: "#0ea5e9", paddingVertical: 12, borderRadius: 10, alignItems: "center" }}
//         >
//           <Text style={{ color: "#fff", fontWeight: "800" }}>My Attempts</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }


import { router } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../_layout.theme";
import { useMyAttempts, useInProgress, useTests } from "@/src/hooks/useQueries";

function pct(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.round(n);
}

export default function Dashboard() {
  const { data: attempts = [], isLoading: attemptsLoading } = useMyAttempts();
  const { data: progress = null, isLoading: progressLoading } = useInProgress();
  const { data: tests = [], isLoading: testsLoading } = useTests();

  const loading = attemptsLoading || progressLoading || testsLoading;

  const stats = useMemo(() => {
    const totalAttempts = attempts.length;
    const avgAcc =
      totalAttempts === 0 ? 0 : attempts.reduce((s, r) => s + (r.accuracy_pct || 0), 0) / totalAttempts;
    const best =
      totalAttempts === 0 ? 0 : Math.max(...attempts.map((r) => r.accuracy_pct || 0));
    const recent = attempts[0]; // already sorted desc by API
    return {
      totalAttempts,
      avgAccuracy: pct(avgAcc),
      bestAccuracy: pct(best),
      recent,
    };
  }, [attempts]);

  const testsAvailable = tests.length;

  if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text }}>Welcome 👋</Text>
      <Text style={{ color: colors.muted }}>
        Keep your current affairs sharp. Your quick stats are below.
      </Text>

      {/* Continue test (only if exists) */}
      {progress && (
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: "#E2E8F0",
          }}
        >
          <Text style={{ color: colors.muted, fontWeight: "600", marginBottom: 6 }}>
            Continue Test
          </Text>
          <Text style={{ color: colors.text, fontWeight: "800" }}>{progress.title}</Text>
          <Text style={{ color: colors.muted, marginTop: 4 }}>
            Started: {new Date(progress.started_at).toLocaleString()}
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(main)/attempt/[attemptId]",
                params: { attemptId: progress.attemptId },
              })
            }
            style={{
              marginTop: 12,
              backgroundColor: colors.primary,
              paddingVertical: 10,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "800" }}>Resume</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Stat cards */}
      <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
        <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#E2E8F0" }}>
          <Text style={{ color: colors.muted, fontWeight: "600" }}>Attempts</Text>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: "800" }}>{stats.totalAttempts}</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#E2E8F0" }}>
          <Text style={{ color: colors.muted, fontWeight: "600" }}>Avg Accuracy</Text>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: "800" }}>{stats.avgAccuracy}%</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#E2E8F0" }}>
          <Text style={{ color: colors.muted, fontWeight: "600" }}>Best Accuracy</Text>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: "800" }}>{stats.bestAccuracy}%</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#E2E8F0" }}>
          <Text style={{ color: colors.muted, fontWeight: "600" }}>Tests Available</Text>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: "800" }}>{testsAvailable}</Text>
        </View>
      </View>

      {/* Recent attempt */}
      {stats.recent ? (
        <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#E2E8F0", marginTop: 8 }}>
          <Text style={{ color: colors.muted, fontWeight: "600", marginBottom: 6 }}>Most Recent</Text>
          <Text style={{ color: colors.text, fontWeight: "800" }}>{stats.recent.title}</Text>
          <Text style={{ color: colors.muted, marginTop: 4 }}>
            {stats.recent.score}/{stats.recent.total} • {stats.recent.accuracy_pct}% •{" "}
            {new Date(stats.recent.submitted_at).toLocaleString()}
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(main)/attempt/[attemptId]/review",
                params: { attemptId: stats.recent!.attemptId },
              })
            }
            style={{ marginTop: 12, backgroundColor: colors.primary, paddingVertical: 10, borderRadius: 10, alignItems: "center" }}
          >
            <Text style={{ color: "#fff", fontWeight: "800" }}>View Review</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#E2E8F0", marginTop: 8 }}>
          <Text style={{ color: colors.text, fontWeight: "700" }}>No attempts yet</Text>
          <Text style={{ color: colors.muted, marginTop: 4 }}>Start a quiz to see your progress here.</Text>
        </View>
      )}

      {/* Quick actions */}
      <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
        <TouchableOpacity
          onPress={() => router.push("/(main)/(tabs)/quizzes")}
          style={{ flex: 1, backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 10, alignItems: "center" }}
        >
          <Text style={{ color: "#fff", fontWeight: "800" }}>Start a Quiz</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/(main)/attempts")}
          style={{ flex: 1, backgroundColor: "#0ea5e9", paddingVertical: 12, borderRadius: 10, alignItems: "center" }}
        >
          <Text style={{ color: "#fff", fontWeight: "800" }}>My Attempts</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
