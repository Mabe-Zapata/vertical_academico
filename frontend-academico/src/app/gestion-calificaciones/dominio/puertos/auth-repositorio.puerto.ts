import { Observable } from "rxjs";
import { LoginResponse } from "../modelos/modelos";

/**
 * Puerto que el dominio exige para autenticar credenciales. No sabe si
 * "por dentro" hay una llamada HTTP, GraphQL o un SDK de terceros — eso
 * es responsabilidad exclusiva de quien implemente esta clase abstracta
 * (ver infraestructura/adaptadores-secundarios/http/auth-repositorio.http.ts).
 */
export abstract class AuthRepositorioPuerto {
  abstract login(correo: string, password: string): Observable<LoginResponse>;
}
