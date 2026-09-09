// Re-exporta el puerto de gestion-sesiones para que resumen lo use consistentemente.
// así todos los slices usan el mismo token de inyección.
export { AcademicoLecturaPuerto } from "../../../gestion-sesiones/dominio/puertos/academico-lectura.puerto";
export type { RecursoConsulta } from "../../../gestion-sesiones/dominio/modelos/recurso-consulta";
