import { Routes } from "@angular/router";
import { LoginComponent } from "./gestion-sesiones/presentacion/login.component";
import { LayoutComponent } from "./shared/layout/layout.component";
import { authGuard } from "./gestion-sesiones/infraestructura/guards/auth.guard";
import { roleGuard } from "./gestion-sesiones/infraestructura/guards/role.guard";
import { adminOnlyGuard } from "./gestion-sesiones/infraestructura/guards/admin-only.guard";

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  {
    path: "",
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: "resumen",
        loadComponent: () => import("./resumen/presentacion/resumen.component").then((m) => m.ResumenComponent),
        data: { breadcrumb: "Resumen", title: "Resumen" },
      },
      {
        path: "notas",
        loadComponent: () => import("./gestion-calificaciones/presentacion/notas.component").then((m) => m.NotasComponent),
        data: { breadcrumb: "Mis Notas", title: "Mis Notas" },
      },
      {
        path: "horario",
        loadComponent: () => import("./gestion-horarios/presentacion/horario.component").then((m) => m.HorarioComponent),
        data: { breadcrumb: "Horario", title: "Mi Horario" },
      },
      {
        path: "admin/cursos",
        canActivate: [roleGuard],
        loadComponent: () =>
          import("./gestion-cursos/presentacion/cursos-admin.component").then((m) => m.CursosAdminComponent),
        data: { breadcrumb: "Administración / Cursos", title: "Cursos" },
      },
      {
        path: "admin/usuarios",
        canActivate: [adminOnlyGuard],
        loadComponent: () =>
          import("./gestion-usuarios/presentacion/usuarios-admin.component").then((m) => m.UsuariosAdminComponent),
        data: { breadcrumb: "Administración / Usuarios", title: "Usuarios" },
      },
      { path: "", redirectTo: "resumen", pathMatch: "full" },
    ],
  },
  { path: "**", redirectTo: "login" },
];
