import { Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function EstadisticasScreen() {
  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-lg font-semibold text-primary-700">
          Estadísticas
        </Text>
        <Text className="mt-2 text-center text-neutral-600">
          Consulta el rendimiento de tu negocio con métricas en tiempo real.
        </Text>
      </View>
    </SafeAreaView>
  )
}
