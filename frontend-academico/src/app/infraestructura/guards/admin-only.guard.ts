import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { GestionarSesionCasoUso } from "../../dominio/casos-de-uso/gestionar-sesion.caso-uso";

/** Protege /admin/usuarios: solo el rol admin puede gestionar cuentas de otros usuarios. */
export const adminOnlyGuard: CanActivateFn = () => {
  const sesion = inject(GestionarSesionCasoUso);
  const router = inject(Router);

  if (sesion.esAdmin()) return true;

  router.navigate(["/resumen"]);
  return false;
};
