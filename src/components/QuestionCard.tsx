// import { Text, TouchableOpacity, View } from "react-native";
// import { colors } from "../../app/_layout.theme";
// import type { Option } from "../api/quiz";

// type Props = {
//   index: number; total: number;
//   stem: string;
//   options: Option[];
//   selectedOptionId?: number | null;
//   onSelect: (optionId: number) => void;
// };

// export default function QuestionCard({ index, total, stem, options, selectedOptionId, onSelect }: Props) {
//   return (
//     <View style={{ gap: 12 }}>
//       <Text style={{ color: colors.muted, fontWeight: "600" }}>{index + 1}/{total}</Text>
//       <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>{stem}</Text>

//       <View style={{ gap: 10, marginTop: 6 }}>
//         {options.map((opt) => {
//           const active = selectedOptionId === opt.id;
//           return (
//             <TouchableOpacity
//               key={opt.id}
//               onPress={() => onSelect(opt.id)}
//               style={{
//                 paddingVertical: 12,
//                 paddingHorizontal: 14,
//                 borderRadius: 12,
//                 borderWidth: 2,
//                 borderColor: active ? colors.primary : "#E2E8F0",
//                 backgroundColor: active ? "#EEF2FF" : "#FFFFFF",
//               }}
//               activeOpacity={0.8}
//             >
//               <Text style={{ color: colors.text, fontSize: 15, fontWeight: "600" }}>{opt.text}</Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     </View>
//   );
// }



import { Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../app/_layout.theme";
import type { Option } from "../api/quiz";

type Props = {
  index: number;
  total: number;
  stem: string;
  options: Option[]; // { optionId, text }
  selectedOptionId?: string | null;
  onSelect: (optionId: string) => void;
};

export default function QuestionCard({ index, total, stem, options, selectedOptionId, onSelect }: Props) {
  return (
    <View style={{ gap: 12 }}>
      <Text style={{ color: colors.muted, fontWeight: "600" }}>
        {index + 1}/{total}
      </Text>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>{stem}</Text>

      <View style={{ gap: 10, marginTop: 6 }}>
        {options.map((opt) => {
          const active = selectedOptionId === opt.optionId;
          return (
            <TouchableOpacity
              key={opt.optionId}
              onPress={() => onSelect(opt.optionId)}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 14,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: active ? colors.primary : "#E2E8F0",
                backgroundColor: active ? "#EEF2FF" : "#FFFFFF",
              }}
              activeOpacity={0.8}
            >
              <Text style={{ color: colors.text, fontSize: 15, fontWeight: "600" }}>{opt.text}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
