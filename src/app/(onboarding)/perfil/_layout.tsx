import { Stack } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Pressable } from "react-native"

export default function PerfilLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={({ navigation }) => ({
          title: "  Perfil",
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              hitSlop={12}
              style={{ padding: 4}}
            >
              <Ionicons name="arrow-back" size={24} color="#1B3D48" />
            </Pressable>
          ),
        })}
      />
    </Stack>
  )
}
