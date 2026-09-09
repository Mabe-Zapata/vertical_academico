import { Injectable, inject } from "@angular/core";
import { HttpClient, httpResource } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { UsuarioRepositorioPuerto } from "../../../dominio/puertos/usuario-repositorio.puerto";
import { UsuarioRecord } from "../../../dominio/modelos/modelos";
import { API_URL } from "../../config/api.config";

/** Implementa UsuarioRepositorioPuerto contra /usuarios del mock-api (sin cambios). */
@Injectable({ providedIn: "root" })
export class UsuarioRepositorioHttp extends UsuarioRepositorioPuerto {
  private readonly http = inject(HttpClient);

  readonly usuarios = httpResource<UsuarioRecord[]>(() => `${API_URL}/usuarios`, { defaultValue: [] });

  async crear(datos: Omit<UsuarioRecord, "id">): Promise<void> {
    await firstValueFrom(this.http.post<UsuarioRecord>(`${API_URL}/usuarios`, datos));
    this.usuarios.reload();
  }

  async actualizar(id: number, datos: Omit<UsuarioRecord, "id">): Promise<void> {
    await firstValueFrom(this.http.put<UsuarioRecord>(`${API_URL}/usuarios/${id}`, datos));
    this.usuarios.reload();
  }

  async eliminar(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${API_URL}/usuarios/${id}`));
    this.usuarios.reload();
  }
}
