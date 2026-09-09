import { Injectable, inject } from "@angular/core";
import { httpResource } from "@angular/common/http";
import { AcademicoLecturaPuerto } from "../../../dominio/puertos/academico-lectura.puerto";
import { CalificacionesResponse, HorarioResponse } from "../../../dominio/modelos/modelos";
import { GestionarSesionCasoUso } from "../../../../gestion-sesiones/dominio/casos-de-uso/gestionar-sesion.caso-uso";
import { API_URL } from "../../config/api.config";

/**
 * Implementa AcademicoLecturaPuerto con httpResource() de Angular —
 * la tecnología concreta que el dominio (AcademicoLecturaPuerto) no
 * conoce. Lee el usuario activo desde GestionarSesionCasoUso (parte del
 * dominio) para construir la URL reactivamente: si el usuario cambia
 * (login/logout), httpResource vuelve a pedir los datos solo.
 */
@Injectable({ providedIn: "root" })
export class AcademicoLecturaHttp extends AcademicoLecturaPuerto {
  private readonly sesion = inject(GestionarSesionCasoUso);

  readonly calificaciones = httpResource<CalificacionesResponse>(
    () => {
      const usuario = this.sesion.usuario();
      return usuario ? `${API_URL}/api/estudiantes/${usuario.id}/calificaciones` : undefined;
    },
    { defaultValue: { estudianteId: 0, promedio: 0, calificaciones: [] } }
  );

  readonly horario = httpResource<HorarioResponse>(
    () => {
      const usuario = this.sesion.usuario();
      return usuario ? `${API_URL}/api/estudiantes/${usuario.id}/horario` : undefined;
    },
    { defaultValue: { estudianteId: 0, horario: [] } }
  );
}
