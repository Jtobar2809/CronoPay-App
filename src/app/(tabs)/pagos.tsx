import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
  StyleSheet,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { useAuth } from "../../../providers/AuthProvider"
import { usePagos } from "../../hooks/usePagos"
import { AddPaymentModal } from "../../components/AddPaymentModal"

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
    <View style={cardStyles.container}>
      <Text style={cardStyles.amount}>
        ${parseFloat(monto).toFixed(2)}
      </Text>
      <Text style={cardStyles.category}>
        {categoria ?? "Sin categoría"}
      </Text>
      <View style={cardStyles.footer}>
        <Text style={cardStyles.date}>
          Vence: {formattedDate}
        </Text>
        <Text style={[cardStyles.status, { color: statusColor }]}>
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Pagos</Text>
        <Text style={styles.subtitle}>
          Revisa tus obligaciones próximas y mantente al día.
        </Text>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {error.message}
            </Text>
          </View>
        ) : null}

        {isLoading && data.length === 0 ? (
          <View style={styles.loadingContainer}>
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
            style={styles.list}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No hay pagos registrados aún.
                </Text>
                <Text style={styles.emptySubtext}>
                  Usa el botón de abajo para agregar tu primer pago.
                </Text>
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }
          />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <AddPaymentModal onPaymentAdded={refetch} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fafaf9',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B3D48',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#737373',
  },
  errorContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#ef4444',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    marginTop: 64,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#404040',
  },
  emptySubtext: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
    color: '#737373',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 24,
  },
})

const cardStyles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    backgroundColor: '#ffffff',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B3D48',
  },
  category: {
    marginTop: 4,
    fontSize: 14,
    color: '#404040',
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 12,
    fontWeight: '500',
    color: '#737373',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
})