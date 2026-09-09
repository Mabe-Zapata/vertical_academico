import { Usuario } from "../modelos/modelos";

/**
 * Puerto que el dominio exige para persistir la sesión entre recargas de
 * página. El dominio (GestionarSesionCasoUso) solo sabe que puede
 * "guardar", "limpiar" y "leer" — nunca que por dentro es localStorage.
 * Un adaptador alternativo (sessionStorage, IndexedDB, cookies) cumpliría
 * el mismo contrato sin que el caso de uso cambie una sola línea.
 */
export abstract class SesionAlmacenPuerto {
  abstract guardar(token: string, usuario: Usuario): void;
  abstract limpiar(): void;
  abstract leerUsuario(): Usuario | null;
  abstract leerToken(): string | null;
}
