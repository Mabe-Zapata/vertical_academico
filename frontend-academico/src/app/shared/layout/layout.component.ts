import { Component, inject, signal } from "@angular/core";
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from "@angular/router";
import { filter, map, startWith } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { GestionarSesionCasoUso } from "../../gestion-sesiones/dominio/casos-de-uso/gestionar-sesion.caso-uso";

interface RouteHeaderData {
  breadcrumb: string;
  title: string;
}

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, SidebarComponent, NavbarComponent],
  templateUrl: "./layout.component.html",
})
export class LayoutComponent {
  protected readonly auth: GestionarSesionCasoUso = inject(GestionarSesionCasoUso);
  private readonly router = inject(Router);

  protected readonly sidebarOpen = signal(false);

  /**
   * Lee { breadcrumb, title } de la ruta hija activa para el header.
   * Camina el arbol de SNAPSHOTS (no el arbol "vivo" de ActivatedRoute)
   * para evitar errores de sincronizacion durante la navegacion.
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

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }
}
