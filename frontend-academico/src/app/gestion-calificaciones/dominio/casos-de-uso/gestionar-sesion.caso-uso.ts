import { Injectable, inject, signal, computed } from "@angular/core";
import { Observable, tap } from "rxjs";
import { AuthRepositorioPuerto } from "../puertos/auth-repositorio.puerto";
import { SesionAlmacenPuerto } from "../puertos/sesion-almacen.puerto";
import { LoginResponse } from "../modelos/modelos";

/**
 * Único caso de uso que conoce las reglas de "quién puede gestionar qué"
 * (docente/admin sí, estudiante no). Depende solo de PUERTOS
 * (AuthRepositorioPuerto, SesionAlmacenPuerto) — nunca de HttpClient ni
 * de localStorage directamente. Angular lo provee como singleton
 * (`providedIn: 'root'`), así que toda la app comparte el mismo estado
 * reactivo de sesión sin necesidad de un "store" adicional.
 */
@Injectable({ providedIn: "root" })
export class GestionarSesionCasoUso {
  private readonly authRepositorio = inject(AuthRepositorioPuerto);
  private readonly almacen = inject(SesionAlmacenPuerto);

  private readonly usuarioSignal = signal(this.almacen.leerUsuario());

  readonly usuario = this.usuarioSignal.asReadonly();
  readonly estaAutenticado = computed(() => this.usuarioSignal() !== null);

  /** true para docente o admin — controla la visibilidad de los CRUD. */
  readonly puedeGestionar = computed(() => {
    const rol = this.usuarioSignal()?.rol;
    return rol === "docente" || rol === "admin";
  });

  readonly esAdmin = computed(() => this.usuarioSignal()?.rol === "admin");

  iniciarSesion(correo: string, password: string): Observable<LoginResponse> {
    return this.authRepositorio.login(correo, password).pipe(
      tap((respuesta) => {
        this.almacen.guardar(respuesta.token, respuesta.usuario);
        this.usuarioSignal.set(respuesta.usuario);
      })
    );
  }

  cerrarSesion(): void {
    this.almacen.limpiar();
    this.usuarioSignal.set(null);
  }

  obtenerToken(): string | null {
    return this.almacen.leerToken();
  }
}
