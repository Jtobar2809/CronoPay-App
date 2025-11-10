import Ionicons from "@expo/vector-icons/Ionicons"
import { Tabs, useRouter } from "expo-router"
import { useEffect } from "react"
import { Text } from "react-native"

import { useAuth } from "../../../providers/AuthProvider"

const ACTIVE_COLOR = "#0C212C"
const INACTIVE_COLOR = "#94A5AB"

function TabLabel({ focused, label }: { focused: boolean; label: string }) {
  return (
    <Text
      style={{
        color: focused ? ACTIVE_COLOR : INACTIVE_COLOR,
        fontSize: 13,
        fontWeight: focused ? "600" : "500",
      }}
    >
      {label}
    </Text>
  )
}

export default function TabsLayout() {
  const { loading, session } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!session) {
      router.replace("/(unauthenticated)/login")
    }
  }, [loading, session, router])

  if (loading || !session) {
    return null
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          height: 78,
          paddingTop: 8,
          paddingBottom: 12,
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 6,
          backgroundColor: "#FFFFFF",
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="pagos"
        options={{
          title: "Pagos",
          tabBarIcon: ({ color }) => (
            <Ionicons name="card-outline" size={24} color={color} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel focused={focused} label="Pagos" />
          ),
        }}
      />
      <Tabs.Screen
        name="calendario"
        options={{
          title: "Calendario",
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={24} color={color} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel focused={focused} label="Calendario" />
          ),
        }}
      />
      <Tabs.Screen
        name="inicio"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel focused={focused} label="Inicio" />
          ),
        }}
      />
      <Tabs.Screen
        name="estadisticas"
        options={{
          title: "Estadísticas",
          tabBarIcon: ({ color }) => (
            <Ionicons name="stats-chart-outline" size={24} color={color} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel focused={focused} label="Estadísticas" />
          ),
        }}
      />
      <Tabs.Screen
        name="reportes"
        options={{
          title: "Reportes",
          tabBarIcon: ({ color }) => (
            <Ionicons name="document-text-outline" size={24} color={color} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel focused={focused} label="Reportes" />
          ),
        }}
      />
    </Tabs>
  )
}
