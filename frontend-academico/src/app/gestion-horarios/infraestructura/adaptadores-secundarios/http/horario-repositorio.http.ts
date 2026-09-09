import { Injectable, inject } from "@angular/core";
import { HttpClient, httpResource } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { HorarioRepositorioPuerto } from "../../../dominio/puertos/horario-repositorio.puerto";
import { HorarioRecord, HorarioFormValue } from "../../../dominio/modelos/modelos";
import { API_URL } from "../../config/api.config";

/** Implementa HorarioRepositorioPuerto contra /horario del mock-api (sin cambios). */
@Injectable({ providedIn: "root" })
export class HorarioRepositorioHttp extends HorarioRepositorioPuerto {
  private readonly http = inject(HttpClient);

  readonly horario = httpResource<HorarioRecord[]>(() => `${API_URL}/horario`, { defaultValue: [] });

  async crear(datos: HorarioFormValue): Promise<void> {
    await firstValueFrom(this.http.post<HorarioRecord>(`${API_URL}/horario`, datos));
    this.horario.reload();
  }

  async actualizar(id: number, datos: HorarioFormValue): Promise<void> {
    await firstValueFrom(this.http.put<HorarioRecord>(`${API_URL}/horario/${id}`, datos));
    this.horario.reload();
  }

  async eliminar(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${API_URL}/horario/${id}`));
    this.horario.reload();
  }
}
