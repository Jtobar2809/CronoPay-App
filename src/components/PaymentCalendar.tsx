import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
  Alert
} from 'react-native';
import { usePagos } from '../hooks/usePagos';
import { useAuth } from 'providers/AuthProvider';
import { PagoWithRelations } from 'lib/api/pagos';

export function PaymentCalendar() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const { data: pagos, isLoading, error } = usePagos(userId ?? undefined, {
    enabled: Boolean(userId),
  });

  const todayDate = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const year = todayDate.getFullYear();
  const month = todayDate.getMonth();

  const { daysInMonth, startDayOfWeek } = useMemo(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);

    return {
      daysInMonth: last.getDate(),
      startDayOfWeek: first.getDay(),
    };
  }, [year, month]);

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const paymentsThisMonth = useMemo(() => {
    if (!pagos) return [];

    return pagos.filter(p => {
      if (!p.fecha_vencimiento) return false;

      // Parse fecha como YYYY-MM-DD
      const [y, m, d] = p.fecha_vencimiento.split('-').map(Number);
      if (!y || !m || !d) return false;

      // Crear fecha local
      const date = new Date(y, m - 1, d);

      return (
        date.getFullYear() === year &&
        date.getMonth() === month
      );
    });
  }, [pagos, year, month]);

  const paymentDaysByDate = useMemo(() => {
    const map: Record<number, PagoWithRelations[]> = {};

    paymentsThisMonth.forEach(p => {
      const [y, m, d] = p.fecha_vencimiento.split('-').map(Number);
      if (y && m && d) {
        if (!map[d]) map[d] = [];
        map[d].push(p);
      }
    });

    return map;
  }, [paymentsThisMonth]);

  const today = todayDate.getDate();

  const calendarDays = useMemo(() => {
    const arr: (number | null)[] = [];

    for (let i = 0; i < startDayOfWeek; i++) arr.push(null);

    for (let d = 1; d <= daysInMonth; d++) arr.push(d);

    return arr;
  }, [startDayOfWeek, daysInMonth]);

  const renderDay = (day: number | null, i: number) => {
    if (day === null) {
      return <View key={`empty-${i}`} style={styles.dayCell} />;
    }

    const list = paymentDaysByDate[day] || [];
    const hasPayments = list.length > 0;

    const pending = list.filter(p => p.estado === "Pendiente");
    const paid = list.filter(p => p.estado === "Pagado");

    const date = new Date(year, month, day);
    const isPastDue = date < todayDate && pending.length > 0;

    let dayStyle: any[] = [styles.dayCell];
    let textStyle: any[] = [styles.dayText, isDark && styles.dayTextDark];

    if (day === today) {
      dayStyle = [styles.dayCell, styles.dayToday];
      textStyle = [styles.dayTodayText];
    } else if (hasPayments) {
      if (isPastDue) {
        dayStyle = [styles.dayCell, styles.dayOverdue];
        textStyle = [styles.dayOverdueText];
      } else if (pending.length > 0) {
        dayStyle = [styles.dayCell, styles.dayPending];
        textStyle = [styles.dayPendingText];
      } else {
        dayStyle = [styles.dayCell, styles.dayPaid];
        textStyle = [styles.dayPaidText];
      }
    }

    return (
      <TouchableOpacity
        key={`day-${i}`}
        style={dayStyle}
        disabled={!hasPayments}
        onPress={() => {
          const txt = list
            .map(p => `• ${p.titulo} - ${new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
              minimumFractionDigits: 0,
            }).format(Number(p.monto))} (${p.estado})`)
            .join("\n");

          Alert.alert(
            `Pagos del ${day} de ${monthNames[month]}`,
            txt,
            [{ text: "Cerrar" }]
          );
        }}
      >
        <Text style={textStyle}>{day}</Text>

        {hasPayments && (
          <View style={styles.indicatorContainer}>
            {pending.length > 0 && (
              <View style={[styles.indicator, styles.indPending]} />
            )}
            {paid.length > 0 && (
              <View style={[styles.indicator, styles.indPaid]} />
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (!session) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
            No autenticado
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
            Error: {error.message}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.card, isDark && styles.cardDark]}>
        <Text style={[styles.title, isDark && styles.titleDark]}>
          Calendario de Pagos
        </Text>

        <Text style={[styles.monthTitle, isDark && styles.monthTitleDark]}>
          {monthNames[month]} {year}
        </Text>

        <View style={styles.weekDays}>
          {dayNames.map(n => (
            <Text key={n} style={[styles.weekDay, isDark && styles.weekDayDark]}>
              {n}
            </Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {calendarDays.map((d, i) => renderDay(d, i))}
        </View>

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#3b82f6" />
          </View>
        )}

        {!isLoading && paymentsThisMonth.length === 0 && (
          <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
            No hay pagos este mes
          </Text>
        )}

        {!isLoading && paymentsThisMonth.length > 0 && (
          <View style={styles.statsContainer}>
            <Text style={[styles.statsText, isDark && styles.statsTextDark]}>
              Total de pagos este mes: {paymentsThisMonth.length}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  containerDark: {
    backgroundColor: "#0a0a0a",
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: "#171717",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#0a0a0a",
  },
  titleDark: {
    color: "#fafafa",
  },
  monthTitle: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#0a0a0a",
  },
  monthTitleDark: {
    color: "#fafafa",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  weekDay: {
    fontSize: 12,
    color: "#666",
    width: "14.28%",
    textAlign: "center",
  },
  weekDayDark: {
    color: "#aaa",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 2,
  },
  dayText: {
    color: "#000",
  },
  dayTextDark: {
    color: "#fff",
  },
  dayToday: {
    backgroundColor: "#3b82f6",
  },
  dayTodayText: {
    color: "#fff",
    fontWeight: "bold",
  },
  dayPending: {
    backgroundColor: "#fed7aa",
  },
  dayOverdue: {
    backgroundColor: "#ef4444",
  },
  dayOverdueText: {
    color: "#fff",
  },
  dayPaid: {
    backgroundColor: "#bbf7d0",
  },
  dayPendingText: {
    color: "#c2410c",
    fontWeight: "bold",
  },
  dayPaidText: {
    color: "#15803d",
    fontWeight: "bold",
  },
  indicatorContainer: {
    flexDirection: "row",
    marginTop: 4,
    gap: 3,
  },
  indicator: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  indPending: {
    backgroundColor: "#c2410c",
  },
  indPaid: {
    backgroundColor: "#16a34a",
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  statsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  statsText: {
    textAlign: "center",
    color: "#737373",
    fontSize: 14,
  },
  statsTextDark: {
    color: "#a3a3a3",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#737373",
  },
  emptyTextDark: {
    color: "#a3a3a3",
  },
  errorText: {
    textAlign: "center",
    color: "#ef4444",
  },
  errorTextDark: {
    color: "#f87171",
  },
});