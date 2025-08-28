// import { router } from "expo-router";
// import { useEffect, useState } from "react";
// import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
// import * as AuthApi from "../../../src/api/auth";
// import { colors } from "../../_layout.theme";

// type Row = { id: number; test_id: number; title: string; score: number; total: number; accuracy_pct: number; submitted_at: string };

// export default function Attempts() {
//   const [rows, setRows] = useState<Row[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         const data = await AuthApi.myAttempts();
//         setRows(data);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;

//   return (
//     <View style={{ flex: 1, padding: 16 }}>
//       <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text, marginBottom: 12 }}>My Attempts</Text>
//       <FlatList
//         data={rows}
//         keyExtractor={(r) => String(r.id)}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             onPress={() => router.push({ pathname: "../(main)/attempt/[attemptId]/review", params: { attemptId: String(item.id) } })}
//             style={{ backgroundColor: colors.card, padding: 16, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: "#E2E8F0" }}
//           >
//             <Text style={{ fontWeight: "700", color: colors.text }}>{item.title}</Text>
//             <Text style={{ color: colors.muted, marginTop: 4 }}>
//               {item.score}/{item.total} • {item.accuracy_pct}% • {new Date(item.submitted_at).toLocaleString()}
//             </Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }


import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import * as AuthApi from "../../../src/api/auth";
import { colors } from "../../_layout.theme";

type Row = {
  attemptId: string;
  testId: string;
  title: string;
  score: number;
  total: number;
  accuracy_pct: number;
  submitted_at: string;
};

export default function Attempts() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await AuthApi.myAttempts();
        setRows(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text, marginBottom: 12 }}>My Attempts</Text>
      <FlatList
        data={rows}
        keyExtractor={(r) => r.attemptId} // 👈 use code
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(main)/attempt/[attemptId]/review",
                params: { attemptId: item.attemptId }, // 👈 pass code
              })
            }
            style={{ backgroundColor: colors.card, padding: 16, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: "#E2E8F0" }}
          >
            <Text style={{ fontWeight: "700", color: colors.text }}>{item.title}</Text>
            <Text style={{ color: colors.muted, marginTop: 4 }}>
              {item.score}/{item.total} • {item.accuracy_pct}% • {new Date(item.submitted_at).toLocaleString()}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
