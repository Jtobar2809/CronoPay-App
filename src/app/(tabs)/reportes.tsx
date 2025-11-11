import { Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useAuth } from "../../../providers/AuthProvider"

export default function ReportesScreen() {
  const { session } = useAuth()
  const userId = session?.user?.id ?? null

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <View className="flex-1 px-6 py-6">

        <View className="flex-1 items-center justify-center px-2">
          <Text className="text-lg font-semibold text-primary-700">
            Reportes
          </Text>
          <Text className="mt-2 text-center text-neutral-600">
            Descarga resúmenes detallados y lleva el control de tus cuentas.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}
