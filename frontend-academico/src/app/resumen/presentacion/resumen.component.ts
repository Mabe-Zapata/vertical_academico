import { Component, computed, inject } from "@angular/core";
import { ConsultarAcademicoCasoUso } from "../../gestion-calificaciones/dominio/casos-de-uso/consultar-academico.caso-uso";
import { GestionarSesionCasoUso } from "../../gestion-sesiones/dominio/casos-de-uso/gestionar-sesion.caso-uso";

@Component({
  selector: "app-resumen",
  standalone: true,
  templateUrl: "./resumen.component.html",
})
export class ResumenComponent {
  protected readonly academico: ConsultarAcademicoCasoUso = inject(ConsultarAcademicoCasoUso);
  protected readonly auth: GestionarSesionCasoUso = inject(GestionarSesionCasoUso);

  protected readonly proximaClase = computed(() => this.academico.horario.value().horario[0] ?? null);
  protected readonly totalCursos = computed(() => this.academico.calificaciones.value().calificaciones.length);
}
