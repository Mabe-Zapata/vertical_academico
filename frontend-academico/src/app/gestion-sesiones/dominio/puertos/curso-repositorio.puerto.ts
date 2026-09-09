import { RecursoConsulta } from "../modelos/recurso-consulta";
import { Curso, CursoFormValue } from "../modelos/modelos";

export abstract class CursoRepositorioPuerto {
  abstract readonly cursos: RecursoConsulta<Curso[]>;
  abstract crear(datos: CursoFormValue): Promise<void>;
  abstract actualizar(id: number, datos: CursoFormValue): Promise<void>;
  abstract eliminar(id: number): Promise<void>;
}
