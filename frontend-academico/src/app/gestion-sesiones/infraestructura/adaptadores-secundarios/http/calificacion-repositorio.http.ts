import { Injectable, inject } from "@angular/core";
import { HttpClient, httpResource } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { CalificacionRepositorioPuerto } from "../../../dominio/puertos/calificacion-repositorio.puerto";
import { CalificacionRecord, CalificacionFormValue } from "../../../dominio/modelos/modelos";
import { API_URL } from "../../config/api.config";

/** Implementa CalificacionRepositorioPuerto contra /calificaciones del mock-api (sin cambios). */
@Injectable({ providedIn: "root" })
export class CalificacionRepositorioHttp extends CalificacionRepositorioPuerto {
  private readonly http = inject(HttpClient);

  readonly calificaciones = httpResource<CalificacionRecord[]>(() => `${API_URL}/calificaciones`, {
    defaultValue: [],
  });

  async crear(datos: CalificacionFormValue): Promise<void> {
    await firstValueFrom(this.http.post<CalificacionRecord>(`${API_URL}/calificaciones`, datos));
    this.calificaciones.reload();
  }

  async actualizar(id: number, datos: CalificacionFormValue): Promise<void> {
    await firstValueFrom(this.http.put<CalificacionRecord>(`${API_URL}/calificaciones/${id}`, datos));
    this.calificaciones.reload();
  }

  async eliminar(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${API_URL}/calificaciones/${id}`));
    this.calificaciones.reload();
  }
}
