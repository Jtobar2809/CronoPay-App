import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import RecordatoriosList from '../../../components/RecordatoriosList'
import useRecordatorios from '../../../hooks/useRecordatorios'

export default function RecordatoriosIndex() {
  const { data, isLoading } = useRecordatorios()

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <RecordatoriosList items={data} />
    </SafeAreaView>
  )
}