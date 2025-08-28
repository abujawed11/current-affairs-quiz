import { Ionicons } from "@expo/vector-icons"; // 👈 import icon set
import { Link, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useAuthProvider } from "../../src/hooks/useAuth";
import { colors } from "../_layout.theme";

export default function Login() {
  const toast = useToast();
  const { signIn } = useAuthProvider();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 toggle state

  const onSubmit = async () => {
    if (!username.trim()) {
      toast.show("Please enter username", { type: "danger" });
      return;
    }
    if (!password) {
      toast.show("Please enter password", { type: "danger" });
      return;
    }

    try {
      setBusy(true);
      await signIn(username.trim(), password);
      router.replace("/(main)");
    } catch (e: any) {
      toast.show(e?.message || "Login failed", { type: "danger" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "800", color: colors.text }}>Login</Text>

      <TextInput
        placeholder="Username"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 10, padding: 12 }}
      />

      {/* Password with eye icon */}
      <View
        style={{
          borderWidth: 1,
          borderColor: "#CBD5E1",
          borderRadius: 10,
          flexDirection: "row",
          alignItems: "center",
          paddingRight: 10,
        }}
      >
        <TextInput
          placeholder="Password"
          secureTextEntry={!showPassword}   // toggle
          value={password}
          onChangeText={setPassword}
          style={{ flex: 1, padding: 12 }}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}   // 👈 switch icon
            size={22}
            color={colors.muted}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        disabled={busy}
        onPress={onSubmit}
        style={{ backgroundColor: colors.primary, padding: 14, borderRadius: 12, alignItems: "center" }}
      >
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "800" }}>Sign In</Text>
        )}
      </TouchableOpacity>

      <Text style={{ color: colors.muted, marginTop: 8 }}>
        New here? <Link href="/(auth)/signup">Create an account</Link>
      </Text>
    </View>
  );
}
