import { Injectable, inject, computed } from "@angular/core";
import { CalificacionRepositorioPuerto } from "../puertos/calificacion-repositorio.puerto";
import { CalificacionFormValue } from "../modelos/modelos";
import { GestionarCursosCasoUso } from "./gestionar-cursos.caso-uso";
import { GestionarUsuariosCasoUso } from "./gestionar-usuarios.caso-uso";

function validarCalificacion(datos: CalificacionFormValue): void {
  if (!Number.isInteger(datos.estudianteId) || datos.estudianteId <= 0) {
    throw new Error("Selecciona un estudiante.");
  }
  if (!Number.isInteger(datos.cursoId) || datos.cursoId <= 0) {
    throw new Error("Selecciona un curso.");
  }
  if (Number.isNaN(datos.nota) || datos.nota < 0 || datos.nota > 10) {
    throw new Error("La nota debe estar entre 0 y 10.");
  }
}

@Injectable({ providedIn: "root" })
export class GestionarCalificacionesCasoUso {
  private readonly repositorio = inject(CalificacionRepositorioPuerto);
  private readonly cursosCasoUso = inject(GestionarCursosCasoUso);
  private readonly usuariosCasoUso = inject(GestionarUsuariosCasoUso);

  readonly calificaciones = this.repositorio.calificaciones;

  /**
   * Orquesta 3 fuentes (calificaciones + cursos + estudiantes) para
   * construir las filas que la tabla de administración necesita, con los
   * nombres ya resueltos. Antes esta combinación vivía dentro del
   * componente Angular; ahora vive en el dominio, que es quien realmente
   * sabe "qué es" una fila de la tabla de gestión.
   */
  readonly filas = computed(() => {
    const cursos = this.cursosCasoUso.cursos.value();
    const estudiantes = this.usuariosCasoUso.estudiantes();
    return this.calificaciones.value().map((c) => ({
      registro: c,
      estudiante: estudiantes.find((e) => e.id === c.estudianteId)?.nombre ?? `#${c.estudianteId}`,
      curso: cursos.find((cu) => cu.id === c.cursoId)?.nombre ?? `#${c.cursoId}`,
    }));
  });

  async crear(datos: CalificacionFormValue): Promise<void> {
    validarCalificacion(datos);
    await this.repositorio.crear(datos);
  }

  async actualizar(id: number, datos: CalificacionFormValue): Promise<void> {
    validarCalificacion(datos);
    await this.repositorio.actualizar(id, datos);
  }

  async eliminar(id: number): Promise<void> {
    await this.repositorio.eliminar(id);
  }
}
