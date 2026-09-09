import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthRepositorioPuerto } from "../../../dominio/puertos/auth-repositorio.puerto";
import { LoginResponse } from "../../../dominio/modelos/modelos";
import { API_URL } from "../../config/api.config";

/**
 * Implementa AuthRepositorioPuerto contra el mock-api existente
 * (POST /login) — el mismo endpoint de siempre, sin ningún cambio en el
 * servidor. Es el único archivo del frontend que sabe que "login" es una
 * petición POST a esa URL específica.
 */
@Injectable({ providedIn: "root" })
export class AuthRepositorioHttp extends AuthRepositorioPuerto {
  private readonly http = inject(HttpClient);

  login(correo: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_URL}/login`, { correo, password });
  }
}
