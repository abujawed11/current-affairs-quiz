// // app/index.tsx
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuthProvider } from "../src/hooks/useAuth";

export default function Index() {
  const { bootstrapped, user } = useAuthProvider();

  if (!bootstrapped) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If logged in, send to main drawer root
  if (user) {
    // If you later add roles, branch here:
    // if (user.role === "admin") return <Redirect href="/(admin)" />;
    return <Redirect href="/dashboard" />;
  }

  // Not logged in → auth flow
  return <Redirect href="/login" />;
}

// import { Redirect } from "expo-router";
// // import { useAuth } from "@/src/hooks/useAuth"; // if you have it

// export default function Index() {
//   const isLoggedIn = false; // replace with your auth state
//   return <Redirect href="../dashboard" />;
// }
