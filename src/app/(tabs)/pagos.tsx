import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { useAuth } from "../../../providers/AuthProvider"
import { usePagos } from "../../hooks/usePagos"

function PagoCard({
  monto,
  fecha,
  categoria,
  estado,
}: {
  monto: string
  fecha: string
  categoria: string | null
  estado: string | null
}) {
  const formattedDate = new Date(fecha).toLocaleDateString()
  const statusColor = estado === "Pagado" ? "#1B3D48" : "#B08A00"

  return (
    <View className="mb-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <Text className="text-lg font-semibold text-primary-800">
        ${parseFloat(monto).toFixed(2)}
      </Text>
      <Text className="mt-1 text-sm text-neutral-700">
        {categoria ?? "Sin categoría"}
      </Text>
      <View className="mt-3 flex-row items-center justify-between">
        <Text className="text-xs font-medium text-neutral-600">
          Vence: {formattedDate}
        </Text>
        <Text style={{ color: statusColor }} className="text-xs font-semibold">
          {estado ?? "Pendiente"}
        </Text>
      </View>
    </View>
  )
}

export default function PagosScreen() {
  const { session } = useAuth()
  const userId = session?.user?.id ?? null
  const { data, isLoading, error, refetch } = usePagos(userId)

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <View className="flex-1 px-6 py-6">
        <Text className="text-2xl font-bold text-primary-900">Pagos</Text>
        <Text className="mt-1 text-sm text-neutral-600">
          Revisa tus obligaciones próximas y mantente al día.
        </Text>

        {error ? (
          <View className="mt-10 items-center">
            <Text className="text-center text-sm text-red-600">
              {error.message}
            </Text>
          </View>
        ) : null}

        {isLoading && data.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#1B3D48" />
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => String(item.id_pago)}
            renderItem={({ item }) => (
              <PagoCard
                monto={item.monto}
                fecha={item.fecha_vencimiento}
                categoria={item.categoria?.nombre ?? null}
                estado={item.estado}
              />
            )}
            style={{ marginTop: 20 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View className="mt-16 items-center">
                <Text className="text-base font-medium text-neutral-700">
                  No hay pagos registrados aún.
                </Text>
                <Text className="mt-2 text-center text-sm text-neutral-500">
                  Puedes comenzar añadiendo uno desde la versión web o
                  implementando el flujo de creación en esta pantalla.
                </Text>
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }
          />
        )}
      </View>
    </SafeAreaView>
  )
}
