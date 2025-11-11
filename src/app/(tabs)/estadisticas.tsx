import { ScrollView, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import Box from "../../components/Box"
import LineStatsGraph, {
  type LineStatsPoint,
} from "../../components/LineStatsGraph"
import DonutChart, { type DonutSlice } from "../../components/DonutChart"
import RecentPayments, { type PaymentItem } from "../../components/RecentPayments"

const CARD_DATA = [
  {
    id: "pagos",
    title: "Pagos del mes",
    value: "12",
    iconName: "card-outline" as const,
    iconBackgroundColor: "#E8F1FF",
    iconColor: "#1B3D48",
    backgroundColor: "#F4F8FF",
  },
  {
    id: "pendientes",
    title: "Pendientes",
    value: "3",
    valueColor: "#FF6B00",
    iconName: "time-outline" as const,
    iconBackgroundColor: "#FFF1E3",
    iconColor: "#FF6B00",
    backgroundColor: "#FFF7EE",
  },
  {
    id: "completados",
    title: "Completados",
    value: "9",
    valueColor: "#1AAE6F",
    iconName: "checkmark-circle-outline" as const,
    iconBackgroundColor: "#E8F9F1",
    iconColor: "#1AAE6F",
    backgroundColor: "#F5FCF8",
  },
  {
    id: "total",
    title: "Total mensual",
    value: "$905,450",
    iconName: "wallet-outline" as const,
    iconBackgroundColor: "#EEE8FF",
    iconColor: "#6C3CF0",
    backgroundColor: "#F6F2FF",
  },
]


const DONUT_DATA: DonutSlice[] = [
  { label: 'Suscripci\u00f3n', value: 35, color: '#0F5B5C' },
  { label: 'Servicios', value: 30, color: '#12C48B' },
  { label: 'Deudores', value: 20, color: '#FFB020' },
  { label: 'Otros', value: 15, color: '#7C4DFF' },
]

const RECENT_PAYMENTS_MOCK: PaymentItem[] = [
  { title: 'Netflix', date: '2024-11-15', amount: 35000, status: 'Pagado', iconName: 'tv-outline', iconColor: '#12343A', iconBackgroundColor: '#E8F1FF' },
  { title: 'Electricidad', date: '2024-11-20', amount: 89500, status: 'Pendiente', iconName: 'flash-outline', iconColor: '#FF6B00', iconBackgroundColor: '#FFF1E3' },
  { title: 'Spotify', date: '2024-11-10', amount: 16900, status: 'Pagado', iconName: 'musical-notes-outline', iconColor: '#12C48B', iconBackgroundColor: '#E8F9F1' },
  { title: 'Gas', date: '2024-10-03', amount: 42000, status: 'Pagado', iconName: 'flame-outline', iconColor: '#FFB020', iconBackgroundColor: '#FFF7E6' },
  { title: 'Internet', date: '2024-09-21', amount: 27900, status: 'Pagado', iconName: 'wifi-outline', iconColor: '#3AA9FF', iconBackgroundColor: '#E8F4FF' },
  { title: 'Comida', date: '2024-08-18', amount: 12500, status: 'Pagado', iconName: 'fast-food-outline', iconColor: '#FF6B6B', iconBackgroundColor: '#FFF0F0' },
  { title: 'Renta', date: '2024-06-01', amount: 350000, status: 'Pagado', iconName: 'home-outline', iconColor: '#6C3CF0', iconBackgroundColor: '#F3EEFF' },
  { title: 'Seguro', date: '2023-12-11', amount: 45000, status: 'Pendiente', iconName: 'shield-checkmark-outline', iconColor: '#FFB020', iconBackgroundColor: '#FFF8ED' },
  { title: 'Spotify (antiguo)', date: '2023-11-10', amount: 15900, status: 'Pagado', iconName: 'musical-notes-outline', iconColor: '#12C48B', iconBackgroundColor: '#E8F9F1' },
]


export default function EstadisticasScreen() {
  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {CARD_DATA.map((card, index) => (
            <Box
              key={card.id}
              title={card.title}
              value={card.value}
              valueColor={card.valueColor}
              iconName={card.iconName}
              iconColor={card.iconColor}
              iconBackgroundColor={card.iconBackgroundColor}
              backgroundColor={card.backgroundColor}
              compact
              style={[
                styles.gridItem,
                index % 2 === 0 ? styles.gridItemLeft : styles.gridItemRight,
              ]}
            />
          ))}
        </View>

        <LineStatsGraph
          title="Evolución de pagos"
          data={MOCK_GRAPH_DATA}
        />

        <View style={styles.graphWrapper}>
          <View style={styles.donutCard}>
            <Text style={styles.donutTitle}>Distribución por Categoría</Text>
            <View style={styles.donutInner}>
              <DonutChart
                data={DONUT_DATA}
                size={220}
                thickness={28}
                showPercent
              />
            </View>
          </View>
        </View>
        <RecentPayments items={RECENT_PAYMENTS_MOCK} />
      </ScrollView>
    </SafeAreaView>
  )
}

const MOCK_GRAPH_DATA: LineStatsPoint[] = [
  { label: "Ene", value: 520000 },
  { label: "Feb", value: 680000 },
  { label: "Mar", value: 850000 },
  { label: "Abr", value: 1120000 },
  { label: "May", value: 980000 },
  { label: "Jun", value: 1090000 },
]

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 16
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%",
    marginBottom: 16,
  },
  gridItemLeft: {
    marginRight: 6,
  },
  gridItemRight: {
    marginLeft: 6,
  },
  graphWrapper: {
    marginTop: 16,
  }
  ,
  donutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    alignItems: 'center',
  },
  donutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#12343A',
    marginBottom: 12,
    alignSelf: 'flex-start'
  },
  donutInner: {
    alignItems: 'center',
    justifyContent: 'center'
  }
})