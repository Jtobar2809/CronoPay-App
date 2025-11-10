import { supabase } from "../supabase"
import { Database } from "../database.types"

export type InformeRow =
  Database["public"]["Tables"]["informe"]["Row"]
export type InformeInsert =
  Database["public"]["Tables"]["informe"]["Insert"]
export type InformeUpdate =
  Database["public"]["Tables"]["informe"]["Update"]

export async function fetchInformesByUsuario(
  userId: string,
): Promise<InformeRow[]> {
  const { data, error } = await supabase
    .from("informe")
    .select("*")
    .eq("id_usuario", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data as InformeRow[] | null) ?? []
}

export async function createInforme(
  payload: InformeInsert,
): Promise<InformeRow> {
  const { data, error } = await supabase
    .from("informe")
    .insert(payload)
    .select("*")
    .single()

  if (error) throw error
  return data as InformeRow
}

export async function updateInforme(
  informeId: number,
  values: InformeUpdate,
): Promise<InformeRow> {
  const { data, error } = await supabase
    .from("informe")
    .update(values)
    .eq("id_informe", informeId)
    .select("*")
    .single()

  if (error) throw error
  return data as InformeRow
}
