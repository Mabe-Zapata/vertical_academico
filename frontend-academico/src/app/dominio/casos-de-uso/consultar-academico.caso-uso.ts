import { Injectable, inject } from "@angular/core";
import { AcademicoLecturaPuerto } from "../puertos/academico-lectura.puerto";

/**
 * Caso de uso deliberadamente delgado: el "join" de calificaciones/horario
 * con curso y profesor ya lo hace el backend (mock-api, sin tocar), así
 * que aquí no hay más regla de negocio que exponer los recursos del
 * puerto. Aun así vive en el dominio y no en el componente, porque si
 * mañana se agrega una regla (p. ej. "ocultar notas si el periodo no ha
 * cerrado"), este es el único lugar que cambiaría.
 */
@Injectable({ providedIn: "root" })
export class ConsultarAcademicoCasoUso {
  private readonly lectura = inject(AcademicoLecturaPuerto);

  readonly calificaciones = this.lectura.calificaciones;
  readonly horario = this.lectura.horario;
}
