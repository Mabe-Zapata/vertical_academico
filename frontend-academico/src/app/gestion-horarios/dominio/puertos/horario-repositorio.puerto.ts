import { RecursoConsulta } from "../modelos/recurso-consulta";
import { HorarioRecord, HorarioFormValue } from "../modelos/modelos";

export abstract class HorarioRepositorioPuerto {
  abstract readonly horario: RecursoConsulta<HorarioRecord[]>;
  abstract crear(datos: HorarioFormValue): Promise<void>;
  abstract actualizar(id: number, datos: HorarioFormValue): Promise<void>;
  abstract eliminar(id: number): Promise<void>;
}
