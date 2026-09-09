import { Injectable, inject, computed } from "@angular/core";
import { UsuarioRepositorioPuerto } from "../puertos/usuario-repositorio.puerto";
import { Rol, UsuarioFormValue, UsuarioRecord } from "../modelos/modelos";

export const ROLES_VALIDOS: Rol[] = ["estudiante", "docente", "admin"];

function calcularIniciales(nombre: string): string {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");
}

function validarUsuario(datos: UsuarioFormValue, esCreacion: boolean): void {
  if (!datos.nombre || datos.nombre.trim().length < 3) {
    throw new Error("El nombre debe tener al menos 3 caracteres.");
  }
  if (!datos.correo || !datos.correo.includes("@")) {
    throw new Error("El correo no es válido.");
  }
  const passwordProvisto = datos.password && datos.password.trim().length > 0;
  if (esCreacion && !passwordProvisto) {
    throw new Error("La contraseña es obligatoria al crear un usuario.");
  }
  if (passwordProvisto && datos.password!.trim().length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres.");
  }
  if (!ROLES_VALIDOS.includes(datos.rol)) {
    throw new Error(`El rol debe ser uno de: ${ROLES_VALIDOS.join(", ")}.`);
  }
}

@Injectable({ providedIn: "root" })
export class GestionarUsuariosCasoUso {
  private readonly repositorio = inject(UsuarioRepositorioPuerto);

  readonly usuarios = this.repositorio.usuarios;
  readonly rolesValidos = ROLES_VALIDOS;

  /** Solo estudiantes — puebla los selects de los formularios de Calificaciones/Horario. */
  readonly estudiantes = computed(() => this.usuarios.value().filter((u) => u.rol === "estudiante"));

  async crear(datos: UsuarioFormValue): Promise<void> {
    validarUsuario(datos, true);
    const payload: Omit<UsuarioRecord, "id"> = {
      nombre: datos.nombre.trim(),
      correo: datos.correo.trim().toLowerCase(),
      password: datos.password!.trim(),
      rol: datos.rol,
      periodo: datos.periodo,
      iniciales: calcularIniciales(datos.nombre),
    };
    await this.repositorio.crear(payload);
  }

  async actualizar(id: number, datos: UsuarioFormValue): Promise<void> {
    validarUsuario(datos, false);
    // Si el formulario deja la contraseña en blanco, se conserva la anterior.
    const actual = this.usuarios.value().find((u) => u.id === id);
    const password = datos.password?.trim() ? datos.password.trim() : actual?.password ?? "";

    const payload: Omit<UsuarioRecord, "id"> = {
      nombre: datos.nombre.trim(),
      correo: datos.correo.trim().toLowerCase(),
      password,
      rol: datos.rol,
      periodo: datos.periodo,
      iniciales: calcularIniciales(datos.nombre),
    };
    await this.repositorio.actualizar(id, payload);
  }

  async eliminar(id: number): Promise<void> {
    await this.repositorio.eliminar(id);
  }
}
