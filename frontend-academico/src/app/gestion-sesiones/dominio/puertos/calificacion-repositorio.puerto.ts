import { RecursoConsulta } from "../modelos/recurso-consulta";
import { CalificacionRecord, CalificacionFormValue } from "../modelos/modelos";

export abstract class CalificacionRepositorioPuerto {
  abstract readonly calificaciones: RecursoConsulta<CalificacionRecord[]>;
  abstract crear(datos: CalificacionFormValue): Promise<void>;
  abstract actualizar(id: number, datos: CalificacionFormValue): Promise<void>;
  abstract eliminar(id: number): Promise<void>;
}
