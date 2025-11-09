import { Stack } from "expo-router"
import { Button, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { useAuth } from "../../../../providers/AuthProvider"

export default function Page() {
  const { loading, session, signOut } = useAuth()

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Cargando...</Text>
      </SafeAreaView>
    )
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-[#faedcd]">
        <View className="flex-1 items-center justify-center">
          <Text className="font-medium text-[#838383]">Welcome,</Text>
          <Text className="text-lg font-bold text-[#7f4f24]">
            {session?.user?.user_metadata?.full_name ??
              session?.user?.email?.split("@")[0]}
          </Text>
          <Button title="Cerrar sesión" onPress={signOut} />
        </View>
      </SafeAreaView>
    </>
  )
}
