import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuthProvider } from "../../src/hooks/useAuth";
import { colors } from "../_layout.theme";

export default function Profile() {
  const { user, signOut } = useAuthProvider();

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text }}>Profile</Text>
      <Text style={{ color: colors.muted }}>User ID: {user?.userId}</Text>
      <Text style={{ color: colors.muted }}>Email: {user?.email || "-"}</Text>

      <TouchableOpacity
        onPress={async () => {
          await signOut();
          router.replace("/(auth)/login");
        }}
        style={{ backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 12, alignItems: "center", marginTop: 16 }}
      >
        <Text style={{ color: "#fff", fontWeight: "800" }}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}
