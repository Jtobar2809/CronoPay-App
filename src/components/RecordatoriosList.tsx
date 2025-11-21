import React, { useMemo, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  type StyleProp,
  type ViewStyle,
} from "react-native"
import { isOverdue, getDaysUntil } from "../utils/dateHelpers"

export type RecordatorioItem = {
  id_recordatorio: number
  fecha_aviso: string // ISO date
  hora: string // HH:MM:SS or HH:MM (NOT NULL)
  mensaje?: string | null
  id_pago: number
  // optional related pago fields
  pago?: {
    titulo?: string
    monto?: string | number
    estado?: string
    metodo?: string
  }
}

type FilterKey = "Todos" | "Pendientes" | "Vencidos" | "Pagado"

type RecordatoriosListProps = {
  items?: RecordatorioItem[]
  style?: StyleProp<ViewStyle>
  showFilters?: boolean
  initialFilter?: FilterKey
  onItemPress?: (item: RecordatorioItem) => void
}

const FILTERS: FilterKey[] = ["Todos", "Pendientes", "Vencidos", "Pagado"]

function formatDateLabel(dateStr: string, timeStr?: string | null) {
  try {
    let d: Date
    if (timeStr) {
      // build ISO datetime: date + 'T' + time
      d = new Date(`${dateStr}T${timeStr}`)
    } else {
      d = new Date(dateStr)
    }

    const datePart = d.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })
    if (timeStr) {
      const timePart = d.toLocaleTimeString("es-ES", { hour: "numeric", minute: "2-digit", hour12: true })
      return `${datePart} a las ${timePart}`
    }

    return datePart
  } catch (e) {
    return dateStr
  }
}

function formatTime(timeStr: string) {
  // Expect formats like HH:MM or HH:MM:SS
  if (!timeStr) return ""
  try {
    // create a Date on epoch day so toLocaleTimeString can format with AM/PM
    const d = new Date(`1970-01-01T${timeStr}`)
    return d.toLocaleTimeString("es-ES", { hour: "numeric", minute: "2-digit", hour12: true })
  } catch (e) {
    // fallback to basic HH:MM
    const parts = timeStr.split(":")
    if (parts.length >= 2) return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`
    return timeStr
  }
}

export default function RecordatoriosList({
  items = [],
  style,
  showFilters = true,
  initialFilter = "Todos",
  onItemPress,
}: RecordatoriosListProps) {
  const [filter, setFilter] = useState<FilterKey>(initialFilter)

  const filtered = useMemo(() => {
    if (!items || items.length === 0) return []

    const today = new Date()

    return items.filter((it) => {
      const datetime = `${it.fecha_aviso}T${it.hora}`
      const overdue = isOverdue(datetime)
      const pagoEstado = it.pago?.estado ?? ""

      if (filter === "Todos") return true
      if (filter === "Vencidos") return overdue && pagoEstado !== "Pagado"
      if (filter === "Pendientes") return !overdue && pagoEstado !== "Pagado"
      if (filter === "Pagado") return pagoEstado === "Pagado"
      return true
    })
  }, [items, filter])

  return (
    <View style={[styles.container, style]}>
      {showFilters && (
        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <Pressable key={f} onPress={() => setFilter(f)} style={({ pressed }) => [styles.filterBtn, filter === f && styles.filterBtnActive, pressed && styles.filterPressed]}>
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <ScrollView nestedScrollEnabled style={styles.list}>
        {filtered.length === 0 ? (
          <Text style={styles.empty}>No hay recordatorios para este filtro.</Text>
        ) : (
          filtered.map((it) => {
            const datetime = `${it.fecha_aviso}T${it.hora}`
            const overdue = isOverdue(datetime)
            const days = getDaysUntil(datetime)
            const status = it.pago?.estado === "Pagado" ? "Pagado" : overdue ? "Vencido" : days === 0 ? "Hoy" : "Próximo"

            return (
              <Pressable key={it.id_recordatorio} onPress={() => onItemPress?.(it)} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.statusDot, status === "Vencido" ? styles.dotRed : status === "Pagado" ? styles.dotGreen : styles.dotYellow]} />
                  <Text style={styles.statusLabel}>{status}</Text>
                  <Text style={styles.timeText}>{formatTime(it.hora)}</Text>
                </View>

                <Text style={styles.title}>{it.pago?.titulo ?? it.mensaje ?? "Recordatorio"}</Text>
                {it.mensaje ? <Text style={styles.message}>{it.mensaje}</Text> : null}

                <View style={styles.row}> 
                  <Text style={styles.dateLabel}>{status === "Pagado" ? `Pagado el ${formatDateLabel(it.fecha_aviso, it.hora)}` : `Vence el ${formatDateLabel(it.fecha_aviso, it.hora)}`}</Text>
                  {it.pago?.monto ? <Text style={styles.amount}>${Number(it.pago.monto).toLocaleString('es-CL')}</Text> : null}
                </View>
              </Pressable>
            )
          })
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  filterBtnActive: {
    backgroundColor: "#0B3B3B",
  },
  filterPressed: {
    opacity: 0.85,
  },
  filterText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  list: {
    maxHeight: 500,
  },
  empty: {
    color: "#6B7280",
    padding: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  dotRed: { backgroundColor: "#FF6B6B" },
  dotYellow: { backgroundColor: "#FFB020" },
  dotGreen: { backgroundColor: "#12C48B" },
  statusLabel: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "700",
  },
  title: {
    fontSize: 15,
    color: "#0B2E35",
    fontWeight: "700",
    marginBottom: 6,
  },
  message: {
    color: "#6B7280",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateLabel: {
    color: "#6B7280",
    fontSize: 13,
  },
  timeText: {
    marginLeft: 'auto',
    fontSize: 16,
    fontWeight: '800',
    color: '#0B2E35',
  },
  amount: {
    fontWeight: "700",
    color: "#0B2E35",
    fontSize: 14,
  },
})
