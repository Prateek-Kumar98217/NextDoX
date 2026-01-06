import { Database } from "@/types/database.types";

//since this exteneds the user from auth, the insert is done through triggers

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
