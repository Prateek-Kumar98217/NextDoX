import { Database } from "./database.types";

export type CanvasRow = Database["public"]["Tables"]["project_canvas"]["Row"];
export type CanvasUpdate =
  Database["public"]["Tables"]["project_canvas"]["Update"];
export type CanvasInsert =
  Database["public"]["Tables"]["project_canvas"]["Insert"];
