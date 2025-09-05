import { Link, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useAuthProvider } from "../../src/hooks/useAuth";
import { colors } from "../_layout.theme";

export default function Signup() {
  const toast = useToast();
  const { signUp } = useAuthProvider();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    if (!username.trim()) {
      toast.show("Please enter a username", { type: "danger" });
      return;
    }
    if (!email.trim()) {
      toast.show("Please enter an email", { type: "danger" });
      return;
    }
    if (password.length < 6) {
      toast.show("Password must be at least 6 characters", { type: "danger" });
      return;
    }
    if (password !== confirm) {
      toast.show("Passwords do not match", { type: "danger" });
      return;
    }

    try {
      setBusy(true);
      await signUp(username.trim(), email.trim(), password);
      toast.show("Signup successful! Please login.", { type: "success" });
      router.replace("/login");   // 👈 go to login screen
    } catch (e: any) {
      toast.show(e?.message || "Signup failed", { type: "danger" });
    } finally {
      setBusy(false);
    }
  };


  return (
    <View style={{ flex: 1, padding: 16, gap: 12, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "800", color: colors.text }}>
        Create Account
      </Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{
          borderWidth: 1,
          borderColor: "#CBD5E1",
          borderRadius: 10,
          padding: 12,
        }}
      />

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: "#CBD5E1",
          borderRadius: 10,
          padding: 12,
        }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          borderColor: "#CBD5E1",
          borderRadius: 10,
          padding: 12,
        }}
      />

      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        style={{
          borderWidth: 1,
          borderColor: "#CBD5E1",
          borderRadius: 10,
          padding: 12,
        }}
      />

      <TouchableOpacity
        disabled={busy}
        onPress={onSubmit}
        style={{
          backgroundColor: colors.primary,
          padding: 14,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "800" }}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <Text style={{ color: colors.muted, marginTop: 8 }}>
        Already have an account? <Link href="/login">Sign in</Link>
      </Text>
    </View>
  );
}
