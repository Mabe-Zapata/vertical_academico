import { RecursoConsulta } from "../modelos/recurso-consulta";
import { CalificacionesResponse, HorarioResponse } from "../modelos/modelos";

/**
 * Puerto de solo lectura para la vista agregada que consume el estudiante
 * (calificaciones con promedio ya calculado, horario con curso/profesor
 * ya resueltos). El "join" ya lo hace el backend — este puerto solo
 * declara que el dominio necesita poder leerlo de forma reactiva.
 */
export abstract class AcademicoLecturaPuerto {
  abstract readonly calificaciones: RecursoConsulta<CalificacionesResponse>;
  abstract readonly horario: RecursoConsulta<HorarioResponse>;
}
