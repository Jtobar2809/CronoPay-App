import { supabase } from "../supabase"
import { Database } from "../database.types"
import type { CategoriaRow, MetodoPagoRow } from "./catalogos"

export type PagoRow = Database["public"]["Tables"]["pago"]["Row"]
export type PagoInsert = Database["public"]["Tables"]["pago"]["Insert"]
export type PagoUpdate = Database["public"]["Tables"]["pago"]["Update"]
export type RecordatorioRow =
  Database["public"]["Tables"]["recordatorio"]["Row"]
export type PagoWithRelations = PagoRow & {
  categoria: CategoriaRow | null
  metodo_pago: MetodoPagoRow | null
  recordatorio: RecordatorioRow[]
}

const SELECT_RELATIONS = "*, categoria(*), metodo_pago(*), recordatorio(*)"

export async function fetchPagos(
  userId: string,
): Promise<PagoWithRelations[]> {
  const { data, error } = await supabase
    .from("pago")
    .select(SELECT_RELATIONS)
    .eq("id_usuario", userId)
    .order("fecha_vencimiento", { ascending: true })

  if (error) throw error
  return (data as PagoWithRelations[] | null) ?? []
}

export async function fetchPagoById(
  userId: string,
  pagoId: number,
): Promise<PagoWithRelations | null> {
  const { data, error } = await supabase
    .from("pago")
    .select(SELECT_RELATIONS)
    .eq("id_usuario", userId)
    .eq("id_pago", pagoId)
    .maybeSingle()

  if (error) throw error
  return (data as PagoWithRelations | null) ?? null
}

export async function createPago(
  payload: PagoInsert,
): Promise<PagoWithRelations> {
  const now = new Date().toISOString()
  const insertPayload: PagoInsert = {
    ...payload,
    created_at: payload.created_at ?? now,
    updated_at: payload.updated_at ?? now,
  }

  const { data, error } = await supabase
    .from("pago")
    .insert(insertPayload)
    .select(SELECT_RELATIONS)
    .single()

  if (error) throw error
  return data as PagoWithRelations
}

export async function updatePago(
  pagoId: number,
  values: PagoUpdate,
): Promise<PagoWithRelations> {
  const { data, error } = await supabase
    .from("pago")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id_pago", pagoId)
    .select(SELECT_RELATIONS)
    .single()

  if (error) throw error
  return data as PagoWithRelations
}

export async function deletePago(pagoId: number): Promise<void> {
  const { error } = await supabase.from("pago").delete().eq("id_pago", pagoId)
  if (error) throw error
}

export async function setPagoEstado(
  pagoId: number,
  estado: "Pendiente" | "Pagado",
): Promise<PagoWithRelations> {
  return updatePago(pagoId, { estado })
}

export async function fetchRecordatoriosByPago(
  pagoId: number,
): Promise<RecordatorioRow[]> {
  const { data, error } = await supabase
    .from("recordatorio")
    .select("*")
    .eq("id_pago", pagoId)
    .order("fecha_aviso", { ascending: true })

  if (error) throw error
  return (data as RecordatorioRow[] | null) ?? []
}
