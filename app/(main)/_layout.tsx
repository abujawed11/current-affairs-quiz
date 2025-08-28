import { Drawer } from "expo-router/drawer";
import { colors } from "../_layout.theme";

export default function MainLayout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "700" },
        drawerActiveTintColor: colors.primary,
      }}
    >
      <Drawer.Screen name="index" options={{ title: "Home" }} />
      <Drawer.Screen name="attempts/index" options={{ title: "My Attempts" }} />
      <Drawer.Screen name="profile" options={{ title: "Profile" }} />

      {/* Hidden routes still live inside the drawer group */}
      <Drawer.Screen
        name="test/[id]"
        options={{ drawerItemStyle: { display: "none" }, title: "Test" }}
      />
      <Drawer.Screen
        name="attempt/[attemptId]"
        options={{ drawerItemStyle: { display: "none" }, title: "Attempt" }}
      />
      <Drawer.Screen
        name="attempt/[attemptId]/review"
        options={{ drawerItemStyle: { display: "none" }, title: "Review" }}
      />
    </Drawer>
  );
}
