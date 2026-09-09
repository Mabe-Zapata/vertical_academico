import { Component, inject, input } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { GestionarSesionCasoUso } from "../../../gestion-sesiones/dominio/casos-de-uso/gestionar-sesion.caso-uso";

/**
 * Menú lateral oscuro (paleta AURA) compartido por todas las páginas
 * autenticadas. Autónomo respecto a sesión/usuario (inyecta GestionarSesionCasoUso y
 * Router directamente), así que se monta con solo `<app-sidebar [open]="..." />`.
 */
@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: "./sidebar.component.html",
  host: { class: "contents" },
})
export class SidebarComponent {
  protected readonly auth = inject(GestionarSesionCasoUso);
  private readonly router = inject(Router);

  /** Si el drawer está abierto en móvil/tablet (en lg+ el sidebar siempre es visible). */
  readonly open = input(false);

  onLogout(): void {
    this.auth.cerrarSesion();
    this.router.navigate(["/login"]);
  }
}
