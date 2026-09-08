import { Injectable, inject } from "@angular/core";
import { HttpClient, httpResource } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { CursoRepositorioPuerto } from "../../../dominio/puertos/curso-repositorio.puerto";
import { Curso, CursoFormValue } from "../../../dominio/modelos/modelos";
import { API_URL } from "../../config/api.config";

/** Implementa CursoRepositorioPuerto contra /cursos del mock-api (sin cambios). */
@Injectable({ providedIn: "root" })
export class CursoRepositorioHttp extends CursoRepositorioPuerto {
  private readonly http = inject(HttpClient);

  readonly cursos = httpResource<Curso[]>(() => `${API_URL}/cursos`, { defaultValue: [] });

  async crear(datos: CursoFormValue): Promise<void> {
    await firstValueFrom(this.http.post<Curso>(`${API_URL}/cursos`, datos));
    this.cursos.reload();
  }

  async actualizar(id: number, datos: CursoFormValue): Promise<void> {
    await firstValueFrom(this.http.put<Curso>(`${API_URL}/cursos/${id}`, datos));
    this.cursos.reload();
  }

  async eliminar(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${API_URL}/cursos/${id}`));
    this.cursos.reload();
  }
}
