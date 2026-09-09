import { Injectable, inject, computed } from "@angular/core";
import { HorarioRepositorioPuerto } from "../puertos/horario-repositorio.puerto";
import { Dia, HorarioFormValue } from "../modelos/modelos";
import { GestionarCursosCasoUso } from "./gestionar-cursos.caso-uso";
import { GestionarUsuariosCasoUso } from "./gestionar-usuarios.caso-uso";

export const DIAS_VALIDOS: Dia[] = ["LUN", "MAR", "MIE", "JUE", "VIE"];
const PATRON_HORA = /^([01]\d|2[0-3]):([0-5]\d)$/;

function validarClaseHorario(datos: HorarioFormValue): void {
  if (!Number.isInteger(datos.estudianteId) || datos.estudianteId <= 0) {
    throw new Error("Selecciona un estudiante.");
  }
  if (!Number.isInteger(datos.cursoId) || datos.cursoId <= 0) {
    throw new Error("Selecciona un curso.");
  }
  if (!DIAS_VALIDOS.includes(datos.dia)) {
    throw new Error(`El día debe ser uno de: ${DIAS_VALIDOS.join(", ")}.`);
  }
  if (!Number.isInteger(datos.fecha) || datos.fecha < 1 || datos.fecha > 31) {
    throw new Error("La fecha debe ser un día del mes entre 1 y 31.");
  }
  if (!PATRON_HORA.test(datos.horaInicio) || !PATRON_HORA.test(datos.horaFin)) {
    throw new Error("horaInicio y horaFin deben tener formato HH:MM.");
  }
  if (datos.horaFin <= datos.horaInicio) {
    throw new Error("La hora de fin debe ser posterior a la hora de inicio.");
  }
}

@Injectable({ providedIn: "root" })
export class GestionarHorarioCasoUso {
  private readonly repositorio = inject(HorarioRepositorioPuerto);
  private readonly cursosCasoUso = inject(GestionarCursosCasoUso);
  private readonly usuariosCasoUso = inject(GestionarUsuariosCasoUso);

  readonly horario = this.repositorio.horario;
  readonly diasDisponibles = DIAS_VALIDOS;

  readonly filas = computed(() => {
    const cursos = this.cursosCasoUso.cursos.value();
    const estudiantes = this.usuariosCasoUso.estudiantes();
    return this.horario.value().map((h) => ({
      registro: h,
      estudiante: estudiantes.find((e) => e.id === h.estudianteId)?.nombre ?? `#${h.estudianteId}`,
      curso: cursos.find((cu) => cu.id === h.cursoId)?.nombre ?? `#${h.cursoId}`,
    }));
  });

  async crear(datos: HorarioFormValue): Promise<void> {
    validarClaseHorario(datos);
    await this.repositorio.crear(datos);
  }

  async actualizar(id: number, datos: HorarioFormValue): Promise<void> {
    validarClaseHorario(datos);
    await this.repositorio.actualizar(id, datos);
  }

  async eliminar(id: number): Promise<void> {
    await this.repositorio.eliminar(id);
  }
}
