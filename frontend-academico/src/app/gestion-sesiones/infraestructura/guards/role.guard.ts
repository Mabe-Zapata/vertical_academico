import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { GestionarSesionCasoUso } from "../../dominio/casos-de-uso/gestionar-sesion.caso-uso";

/** Protege /admin/*: solo docentes y administradores pueden entrar. */
export const roleGuard: CanActivateFn = () => {
  const sesion = inject(GestionarSesionCasoUso);
  const router = inject(Router);

  if (sesion.puedeGestionar()) return true;

  router.navigate(["/resumen"]);
  return false;
};
