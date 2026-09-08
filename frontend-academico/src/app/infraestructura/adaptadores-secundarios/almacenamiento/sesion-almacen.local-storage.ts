import { Injectable } from "@angular/core";
import { SesionAlmacenPuerto } from "../../../dominio/puertos/sesion-almacen.puerto";
import { Usuario } from "../../../dominio/modelos/modelos";

const TOKEN_KEY = "campus_token";
const USUARIO_KEY = "campus_usuario";

/**
 * Implementa SesionAlmacenPuerto usando localStorage del navegador. Si
 * mañana se quisiera cambiar a sessionStorage o a un almacenamiento
 * cifrado, este es el ÚNICO archivo que se reemplaza — el caso de uso
 * que lo consume (GestionarSesionCasoUso) no cambia.
 */
@Injectable({ providedIn: "root" })
export class SesionAlmacenLocalStorage extends SesionAlmacenPuerto {
  guardar(token: string, usuario: Usuario): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
  }

  limpiar(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
  }

  leerUsuario(): Usuario | null {
    const raw = localStorage.getItem(USUARIO_KEY);
    return raw ? (JSON.parse(raw) as Usuario) : null;
  }

  leerToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
}
