import { RecursoConsulta } from "../modelos/recurso-consulta";
import { UsuarioRecord } from "../modelos/modelos";

/**
 * A diferencia de los otros repositorios, crear/actualizar reciben la
 * entidad ya completa (incluyendo `iniciales`, calculado por el dominio),
 * no el valor crudo del formulario — esa transformación es responsabilidad
 * del caso de uso (GestionarUsuariosCasoUso), no de este adaptador.
 */
export abstract class UsuarioRepositorioPuerto {
  abstract readonly usuarios: RecursoConsulta<UsuarioRecord[]>;
  abstract crear(datos: Omit<UsuarioRecord, "id">): Promise<void>;
  abstract actualizar(id: number, datos: Omit<UsuarioRecord, "id">): Promise<void>;
  abstract eliminar(id: number): Promise<void>;
}
