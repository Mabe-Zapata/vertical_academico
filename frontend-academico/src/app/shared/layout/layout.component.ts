import { Component, inject } from "@angular/core";
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from "@angular/router";
import { filter, map, startWith } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
import { GestionarSesionCasoUso } from "../../gestion-sesiones/dominio/casos-de-uso/gestionar-sesion.caso-uso";

interface RouteHeaderData {
  breadcrumb: string;
  title: string;
}

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: "./layout.component.html",
})
export class LayoutComponent {
  // Se mantiene el nombre "auth" (aunque ahora es un caso de uso, no un
  // servicio) para no tener que tocar layout.component.html.
  protected readonly auth: GestionarSesionCasoUso = inject(GestionarSesionCasoUso);
  private readonly router = inject(Router);

  /**
   * Lee { breadcrumb, title } de la ruta hija activa para el header.
   * Camina el árbol de SNAPSHOTS (no el árbol "vivo" de ActivatedRoute)
   * para evitar errores de sincronización durante la navegación.
   */
  protected readonly header = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      startWith(null),
      map((): RouteHeaderData => {
        let snapshot = this.router.routerState.snapshot.root;
        while (snapshot.firstChild) snapshot = snapshot.firstChild;
        const data = snapshot.data as Partial<RouteHeaderData>;
        return {
          breadcrumb: data.breadcrumb ?? "",
          title: data.title ?? "",
        };
      })
    ),
    { initialValue: { breadcrumb: "", title: "" } }
  );

  onLogout(): void {
    this.auth.cerrarSesion();
    this.router.navigate(["/login"]);
  }
}
