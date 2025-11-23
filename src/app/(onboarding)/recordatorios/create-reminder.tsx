import React from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import RecordatorioForm from '../../../components/RecordatorioForm'

export default function CreateReminderScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <RecordatorioForm />
      </View>
    </SafeAreaView>
  )
}
