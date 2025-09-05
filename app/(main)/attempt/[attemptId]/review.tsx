// import { reviewAttempt } from "@/src/api/quiz";
// import { router, useLocalSearchParams } from "expo-router";
// import { useEffect, useState } from "react";
// import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
// import { colors } from "@/src/utils/colors";

// export default function ReviewScreen() {
//   const { attemptId } = useLocalSearchParams<{ attemptId: string }>();
//   const [data, setData] = useState<Awaited<ReturnType<typeof reviewAttempt>> | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         const d = await reviewAttempt(Number(attemptId));
//         setData(d);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [attemptId]);

//   if (loading) {
//     return <ActivityIndicator style={{ marginTop: 32 }} />;
//   }
//   if (!data) return null;

//   return (
//     <ScrollView style={{ flex: 1, padding: 16 }}>
//       <Text style={{ fontSize: 20, fontWeight: "800", color: colors.text, marginBottom: 6 }}>
//         Score: {data.score}/{data.total} ({data.accuracy_pct}%)
//       </Text>

//       {data.questions.map((q, idx) => (
//         <View key={q.id} style={{ marginVertical: 10, padding: 12, borderRadius: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: "#E2E8F0" }}>
//           <Text style={{ color: colors.muted, marginBottom: 6, fontWeight: "600" }}>{idx + 1}.</Text>
//           <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>{q.stem}</Text>

//           <View style={{ marginTop: 8, gap: 8 }}>
//             {q.options.map((o) => {
//               const isCorrect = o.is_correct;
//               const isSelected = o.selected;
//               return (
//                 <View
//                   key={o.id}
//                   style={{
//                     paddingVertical: 10,
//                     paddingHorizontal: 12,
//                     borderRadius: 10,
//                     borderWidth: 2,
//                     borderColor: isCorrect ? "#16A34A" : isSelected ? "#DC2626" : "#E2E8F0",
//                     backgroundColor: isCorrect ? "#ECFDF5" : isSelected ? "#FEF2F2" : "#FFFFFF",
//                   }}
//                 >
//                   <Text style={{ color: colors.text, fontWeight: "600" }}>
//                     {o.text} {isCorrect ? "✓" : isSelected ? "✗" : ""}
//                   </Text>
//                 </View>
//               );
//             })}
//           </View>

//           <Text style={{ color: colors.muted, marginTop: 8 }}>Explanation: {q.explanation}</Text>
//         </View>
//       ))}

//       <TouchableOpacity
//         onPress={() => router.replace("../..")}
//         style={{ backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 12, alignItems: "center", marginTop: 8, marginBottom: 20 }}
//       >
//         <Text style={{ color: "#fff", fontWeight: "800" }}>Back to Home</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }


import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { colors } from "@/src/utils/colors";
import { useAttemptReview } from "@/src/hooks/useQueries";

export default function ReviewScreen() {
  const { attemptId } = useLocalSearchParams<{ attemptId: string }>();
  const { data, isLoading } = useAttemptReview(attemptId!);

  if (isLoading) return <ActivityIndicator style={{ marginTop: 32 }} />;
  if (!data) return null;

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "800", color: colors.text, marginBottom: 6 }}>
        Score: {data.score}/{data.total} ({data.accuracy_pct}%)
      </Text>

      {data.questions.map((q, idx) => {
        const wasAttempted = q.options.some(o => o.selected);
        const isCorrect = q.options.some(o => o.selected && o.is_correct);
        
        return (
          <View
            key={q.questionId}
            style={{ marginVertical: 10, padding: 12, borderRadius: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: "#E2E8F0" }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <Text style={{ color: colors.muted, fontWeight: "600" }}>{idx + 1}.</Text>
              <View style={{ flexDirection: "row", gap: 6 }}>
                {/* Attempt Status Badge */}
                <View style={{
                  backgroundColor: wasAttempted ? "#10B981" : "#6B7280",
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                }}>
                  <Text style={{ color: "#fff", fontSize: 10, fontWeight: "600" }}>
                    {wasAttempted ? "ATTEMPTED" : "NOT ATTEMPTED"}
                  </Text>
                </View>
                
                {/* Result Badge */}
                {wasAttempted && (
                  <View style={{
                    backgroundColor: isCorrect ? "#10B981" : "#EF4444",
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4,
                  }}>
                    <Text style={{ color: "#fff", fontSize: 10, fontWeight: "600" }}>
                      {isCorrect ? "CORRECT" : "WRONG"}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            
            <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>{q.stem}</Text>

            <View style={{ marginTop: 8, gap: 8 }}>
              {q.options.map((o) => {
                const isOptionCorrect = o.is_correct;
                const isSelected = o.selected;
                return (
                  <View
                    key={o.optionId}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: isOptionCorrect ? "#16A34A" : isSelected ? "#DC2626" : "#E2E8F0",
                      backgroundColor: isOptionCorrect ? "#ECFDF5" : isSelected ? "#FEF2F2" : "#FFFFFF",
                    }}
                  >
                    <Text style={{ color: colors.text, fontWeight: "600" }}>
                      {o.text} {isOptionCorrect ? "✓" : isSelected ? "✗" : ""}
                    </Text>
                  </View>
                );
              })}
            </View>

            <Text style={{ color: colors.muted, marginTop: 8 }}>Explanation: {q.explanation}</Text>
          </View>
        );
      })}

      <View style={{ flexDirection: "row", gap: 12, marginTop: 8, marginBottom: 20 }}>
        <TouchableOpacity
          onPress={() => router.replace("/(main)")}
          style={{ 
            flex: 1, 
            backgroundColor: colors.primary, 
            paddingVertical: 14, 
            borderRadius: 12, 
            alignItems: "center" 
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "800" }}>Back to Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => {
            // Extract testId from the current attempt data and navigate to history
            if (data) {
              // We need to get testId from somewhere - let's modify the API to include it
              router.push({
                pathname: "/(main)/test/[id]/history",
                params: { id: data.testId || "unknown" }
              });
            }
          }}
          style={{ 
            flex: 1, 
            backgroundColor: "#0ea5e9", 
            paddingVertical: 14, 
            borderRadius: 12, 
            alignItems: "center" 
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "800" }}>View Analysis</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
