// import { fetchTestDetail, startAttempt, type TestDetail } from "@/src/api/quiz";
// import { router, useLocalSearchParams } from "expo-router";
// import { useEffect, useState } from "react";
// import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
// import { useToast } from "react-native-toast-notifications";
// import { colors } from "../../_layout.theme";

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



import { fetchTestDetail, startAttempt, type TestDetail } from "@/src/api/quiz";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { colors } from "../../_layout.theme";

export default function TestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); // id is testId now
  const [data, setData] = useState<TestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    (async () => {
      try {
        const d = await fetchTestDetail(id!);
        setData(d);
      } catch (e) {
        console.error(e);
        toast.show("Failed to load test", { type: "danger" });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onStart = async () => {
    try {
      setStarting(true);
      const res = await startAttempt(id!);
      router.replace({ pathname: "../attempt/[attemptId]", params: { attemptId: res.attemptId } });
    } catch (e) {
      console.error(e);
      toast.show("Could not start attempt", { type: "danger" });
    } finally {
      setStarting(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;
  if (!data) return null;

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "800", color: colors.text }}>{data.title}</Text>
      <Text style={{ color: colors.muted }}>Duration: {Math.round(data.duration_sec / 60)} minutes</Text>
      <Text style={{ color: colors.muted }}>Questions: {data.question_count}</Text>

      <TouchableOpacity
        disabled={starting}
        onPress={onStart}
        style={{
          backgroundColor: colors.primary,
          paddingVertical: 14,
          borderRadius: 12,
          alignItems: "center",
          marginTop: 16,
          opacity: starting ? 0.7 : 1,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "800" }}>{starting ? "Starting..." : "Start Test"}</Text>
      </TouchableOpacity>
    </View>
  );
}
