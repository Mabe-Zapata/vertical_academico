import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { SesionAlmacenPuerto } from "../../../dominio/puertos/sesion-almacen.puerto";

/**
 * Depende del PUERTO de almacenamiento de sesión, no de la clase concreta
 * SesionAlmacenLocalStorage — Angular resuelve cuál implementación usar
 * según lo registrado en app.config.ts (la raíz de composición).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const almacen = inject(SesionAlmacenPuerto);
  const token = almacen.leerToken();

  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req);
};
