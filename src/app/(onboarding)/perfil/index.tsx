import { Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function PerfilScreen() {
  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-xl font-semibold text-primary-800">
          Perfil
        </Text>
        <Text className="mt-3 text-center text-neutral-600">
          Aquí podrás editar tus datos personales próximamente.
        </Text>
      </View>
    </SafeAreaView>
  )
}
