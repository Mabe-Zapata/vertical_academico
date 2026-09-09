import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { GestionarSesionCasoUso } from "../../dominio/casos-de-uso/gestionar-sesion.caso-uso";

export const authGuard: CanActivateFn = () => {
  const sesion = inject(GestionarSesionCasoUso);
  const router = inject(Router);

  if (sesion.estaAutenticado()) return true;

  router.navigate(["/login"]);
  return false;
};
