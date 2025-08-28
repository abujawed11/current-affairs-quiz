// import { reviewAttempt } from "@/src/api/quiz";
// import { router, useLocalSearchParams } from "expo-router";
// import { useEffect, useState } from "react";
// import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
// import { colors } from "../../../_layout.theme";

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


import { reviewAttempt } from "@/src/api/quiz";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../../_layout.theme";

export default function ReviewScreen() {
  const { attemptId } = useLocalSearchParams<{ attemptId: string }>();
  const [data, setData] = useState<Awaited<ReturnType<typeof reviewAttempt>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const d = await reviewAttempt(attemptId!); // 👈 no Number()
        setData(d);
      } finally {
        setLoading(false);
      }
    })();
  }, [attemptId]);

  if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;
  if (!data) return null;

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "800", color: colors.text, marginBottom: 6 }}>
        Score: {data.score}/{data.total} ({data.accuracy_pct}%)
      </Text>

      {data.questions.map((q, idx) => (
        <View
          key={q.questionId} // 👈 use questionId
          style={{ marginVertical: 10, padding: 12, borderRadius: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: "#E2E8F0" }}
        >
          <Text style={{ color: colors.muted, marginBottom: 6, fontWeight: "600" }}>{idx + 1}.</Text>
          <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>{q.stem}</Text>

          <View style={{ marginTop: 8, gap: 8 }}>
            {q.options.map((o) => {
              const isCorrect = o.is_correct;
              const isSelected = o.selected;
              return (
                <View
                  key={o.optionId} // 👈 use optionId
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: isCorrect ? "#16A34A" : isSelected ? "#DC2626" : "#E2E8F0",
                    backgroundColor: isCorrect ? "#ECFDF5" : isSelected ? "#FEF2F2" : "#FFFFFF",
                  }}
                >
                  <Text style={{ color: colors.text, fontWeight: "600" }}>
                    {o.text} {isCorrect ? "✓" : isSelected ? "✗" : ""}
                  </Text>
                </View>
              );
            })}
          </View>

          <Text style={{ color: colors.muted, marginTop: 8 }}>Explanation: {q.explanation}</Text>
        </View>
      ))}

      <TouchableOpacity
        onPress={() => router.replace("/(main)")} // simpler & reliable
        style={{ backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 12, alignItems: "center", marginTop: 8, marginBottom: 20 }}
      >
        <Text style={{ color: "#fff", fontWeight: "800" }}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
