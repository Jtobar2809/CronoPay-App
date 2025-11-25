import React, { useCallback } from "react";
import { ScrollView, View, useColorScheme, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaymentCalendar } from "@/components/PaymentCalendar";
import { PaymentReminders } from "@/components/PaymentReminders";
import { AddPaymentModal } from "@/components/AddPaymentModal";
import { usePagos } from "@/hooks/usePagos";
import { useAuth } from "providers/AuthProvider";

export default function CalendarioScreen() {
  // TEMA: Usar useColorScheme, actualizar con ThemeProvider cuando esté listo
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  // Hook para refrescar pagos después de agregar uno nuevo
  const { refetch } = usePagos(userId);

  // Callback para actualizar datos cuando se agrega un pago
  const handlePaymentAdded = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <SafeAreaView 
      style={[
        styles.container,
        isDark && styles.containerDark
      ]}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Calendario visual del mes */}
        <PaymentCalendar />
        
        {/* Lista de recordatorios detallados */}
        <PaymentReminders />
      </ScrollView>

      {/* Botón flotante para agregar pago */}
      <View style={styles.fabContainer}>
        <AddPaymentModal onPaymentAdded={handlePaymentAdded} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#0a0a0a',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
});