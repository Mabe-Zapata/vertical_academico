import { Injectable, inject } from "@angular/core";
import { CursoRepositorioPuerto } from "../puertos/curso-repositorio.puerto";
import { Categoria, CursoFormValue } from "../modelos/modelos";

export const CATEGORIAS_VALIDAS: Categoria[] = ["APE", "Laboratorio"];

/**
 * Misma regla que dominio/entidades/curso.js en el backend hexagonal —
 * duplicada a propósito. El frontend valida para dar retroalimentación
 * instantánea (sin esperar un viaje de red); el backend valida porque es
 * la única frontera que no se puede saltar (alguien podría llamar a la
 * API directamente sin pasar por este formulario). Ninguna reemplaza a
 * la otra.
 */
function validarCurso(datos: CursoFormValue): void {
  if (!datos.nombre || datos.nombre.trim().length < 3) {
    throw new Error("El nombre del curso debe tener al menos 3 caracteres.");
  }
  if (!datos.profesor || !datos.profesor.trim()) {
    throw new Error("El profesor es obligatorio.");
  }
  if (!CATEGORIAS_VALIDAS.includes(datos.categoria)) {
    throw new Error(`La categoría debe ser una de: ${CATEGORIAS_VALIDAS.join(", ")}.`);
  }
}

@Injectable({ providedIn: "root" })
export class GestionarCursosCasoUso {
  private readonly repositorio = inject(CursoRepositorioPuerto);

  readonly cursos = this.repositorio.cursos;
  readonly categoriasValidas = CATEGORIAS_VALIDAS;

  async crear(datos: CursoFormValue): Promise<void> {
    validarCurso(datos);
    await this.repositorio.crear(datos);
  }

  async actualizar(id: number, datos: CursoFormValue): Promise<void> {
    validarCurso(datos);
    await this.repositorio.actualizar(id, datos);
  }

  async eliminar(id: number): Promise<void> {
    await this.repositorio.eliminar(id);
  }
}
