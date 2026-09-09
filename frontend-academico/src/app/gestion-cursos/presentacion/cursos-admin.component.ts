import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { GestionarCursosCasoUso } from "../../gestion-cursos/dominio/casos-de-uso/gestionar-cursos.caso-uso";
import { ModalComponent } from "../../shared/ui/modal.component";
import { Categoria, Curso } from "../dominio/modelos/modelos";

@Component({
  selector: "app-cursos-admin",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: "./cursos-admin.component.html",
})
export class CursosAdminComponent {
  protected readonly cursoAdmin: GestionarCursosCasoUso = inject(GestionarCursosCasoUso);
  private readonly fb = inject(FormBuilder);

  // Única fuente de verdad de las categorías válidas: vive en el caso de uso.
  protected readonly categorias = this.cursoAdmin.categoriasValidas;

  protected readonly modalAbierto = signal(false);
  protected readonly editando = signal<Curso | null>(null);
  protected readonly guardando = signal(false);
  protected readonly errorMsg = signal("");

  protected readonly form = this.fb.nonNullable.group({
    nombre: ["", [Validators.required, Validators.minLength(3)]],
    profesor: ["", Validators.required],
    categoria: ["APE" as Categoria, Validators.required],
  });

  abrirCrear(): void {
    this.editando.set(null);
    this.errorMsg.set("");
    this.form.reset({ nombre: "", profesor: "", categoria: "APE" });
    this.modalAbierto.set(true);
  }

  abrirEditar(curso: Curso): void {
    this.editando.set(curso);
    this.errorMsg.set("");
    this.form.reset({ nombre: curso.nombre, profesor: curso.profesor, categoria: curso.categoria });
    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    this.modalAbierto.set(false);
  }

  async guardar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.errorMsg.set("");
    const valor = this.form.getRawValue();

    try {
      const editando = this.editando();
      if (editando) {
        await this.cursoAdmin.actualizar(editando.id, valor);
      } else {
        await this.cursoAdmin.crear(valor);
      }
      this.modalAbierto.set(false);
    } catch (err) {
      this.errorMsg.set(err instanceof Error ? err.message : "No se pudo guardar el curso. Intenta nuevamente.");
    } finally {
      this.guardando.set(false);
    }
  }

  async eliminar(curso: Curso): Promise<void> {
    const confirmado = confirm(
      `¿Eliminar "${curso.nombre}"? Las calificaciones y clases de horario asociadas a este curso quedarían huérfanas.`
    );
    if (!confirmado) return;
    await this.cursoAdmin.eliminar(curso.id);
  }
}
