import { ApplicationConfig, provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient, withInterceptors, withFetch } from "@angular/common/http";

import { routes } from "./app.routes";

import { AuthRepositorioPuerto } from "./gestion-sesiones/dominio/puertos/auth-repositorio.puerto";
import { SesionAlmacenPuerto } from "./gestion-sesiones/dominio/puertos/sesion-almacen.puerto";
import { AcademicoLecturaPuerto } from "./gestion-sesiones/dominio/puertos/academico-lectura.puerto";
import { CursoRepositorioPuerto } from "./gestion-sesiones/dominio/puertos/curso-repositorio.puerto";
import { UsuarioRepositorioPuerto } from "./gestion-sesiones/dominio/puertos/usuario-repositorio.puerto";
import { CalificacionRepositorioPuerto } from "./gestion-sesiones/dominio/puertos/calificacion-repositorio.puerto";
import { HorarioRepositorioPuerto } from "./gestion-sesiones/dominio/puertos/horario-repositorio.puerto";

import { AuthRepositorioHttp } from "./gestion-sesiones/infraestructura/adaptadores-secundarios/http/auth-repositorio.http";
import { SesionAlmacenLocalStorage } from "./gestion-sesiones/infraestructura/adaptadores-secundarios/almacenamiento/sesion-almacen.local-storage";
import { AcademicoLecturaHttp } from "./gestion-sesiones/infraestructura/adaptadores-secundarios/http/academico-lectura.http";
import { CursoRepositorioHttp } from "./gestion-sesiones/infraestructura/adaptadores-secundarios/http/curso-repositorio.http";
import { UsuarioRepositorioHttp } from "./gestion-sesiones/infraestructura/adaptadores-secundarios/http/usuario-repositorio.http";
import { CalificacionRepositorioHttp } from "./gestion-sesiones/infraestructura/adaptadores-secundarios/http/calificacion-repositorio.http";
import { HorarioRepositorioHttp } from "./gestion-sesiones/infraestructura/adaptadores-secundarios/http/horario-repositorio.http";
import { authInterceptor } from "./gestion-sesiones/infraestructura/adaptadores-secundarios/http/auth.interceptor";

/**
 * RAÍZ DE COMPOSICIÓN del frontend: el único archivo que conecta cada
 * puerto del dominio con su adaptador concreto (equivalente exacto de
 * `composicion.js` en el backend hexagonal). Si mañana se reemplaza
 * localStorage por IndexedDB, o el mock-api por el backend real, esta es
 * la única sección que cambia — el dominio y los componentes no se enteran.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    //Configuracion por medio de interceptores
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    //Puertos que funcionaran dentro de mi aplicacion
    { provide: AuthRepositorioPuerto, useClass: AuthRepositorioHttp },
    { provide: SesionAlmacenPuerto, useClass: SesionAlmacenLocalStorage },
    { provide: AcademicoLecturaPuerto, useClass: AcademicoLecturaHttp },
    { provide: CursoRepositorioPuerto, useClass: CursoRepositorioHttp },
    { provide: UsuarioRepositorioPuerto, useClass: UsuarioRepositorioHttp },
    { provide: CalificacionRepositorioPuerto, useClass: CalificacionRepositorioHttp },
    { provide: HorarioRepositorioPuerto, useClass: HorarioRepositorioHttp },
  ],
};
