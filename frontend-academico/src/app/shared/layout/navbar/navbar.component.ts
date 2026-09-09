import { Component, computed, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { GestionarSesionCasoUso } from "../../../gestion-sesiones/dominio/casos-de-uso/gestionar-sesion.caso-uso";
import { avatarColor } from "../../ui/avatar-color";

const MESES_CORTO = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

/** Resultado del buscador: a que pagina lleva y por que aparece. */
interface Resultado {
  titulo: string;
  detalle: string;
  ruta: string;
}

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./navbar.component.html",
})
export class NavbarComponent {
  protected readonly auth = inject(GestionarSesionCasoUso);
  private readonly router = inject(Router);

  private readonly hoy = new Date();

  /** Fecha de hoy en formato corto tipo "1 Sep", para la pildora de fecha. */
  protected readonly fechaHoy = `${this.hoy.getDate()} ${MESES_CORTO[this.hoy.getMonth()]}`;

  protected readonly query = signal("");
  protected readonly panelNotis = signal(false);
  /** Se marcan como leidas al abrir el panel: apaga el punto azul del campanilla. */
  protected readonly notisLeidas = signal(false);

  protected readonly resultados = computed<Resultado[]>(() => {
    const q = this.query().trim().toLowerCase();
    if (q.length < 2) return [];

    // Filter mock results based on query
    const mockResultados: Resultado[] = [
      { titulo: "Base de Datos", detalle: "Prof. Garcia · APE", ruta: "/notas" },
      { titulo: "Calculo I", detalle: "Prof. Martinez · APE", ruta: "/horario" },
      { titulo: "Programacion", detalle: "Prof. Lopez · APE", ruta: "/notas" },
    ];

    return mockResultados
      .filter((r) =>
        r.titulo.toLowerCase().includes(q) ||
        r.detalle.toLowerCase().includes(q)
      )
      .slice(0, 6);
  });

  protected readonly buscando = computed(() => this.query().trim().length >= 2);

  abrirNotificaciones(): void {
    this.panelNotis.update((v) => !v);
    if (this.panelNotis()) this.notisLeidas.set(true);
  }

  /** Cierra buscador y notificaciones (backdrop, Escape o al elegir un resultado). */
  cerrarPaneles(): void {
    this.panelNotis.set(false);
    this.query.set("");
  }

  irA(ruta: string): void {
    this.cerrarPaneles();
    this.router.navigate([ruta]);
  }

  getAvatarColors(nombre: string) {
    return avatarColor(nombre);
  }
}
