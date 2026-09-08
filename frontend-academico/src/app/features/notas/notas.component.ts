import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ConsultarAcademicoCasoUso } from "../../dominio/casos-de-uso/consultar-academico.caso-uso";
import { GestionarSesionCasoUso } from "../../dominio/casos-de-uso/gestionar-sesion.caso-uso";
import { GestionarCalificacionesCasoUso } from "../../dominio/casos-de-uso/gestionar-calificaciones.caso-uso";
import { GestionarCursosCasoUso } from "../../dominio/casos-de-uso/gestionar-cursos.caso-uso";
import { GestionarUsuariosCasoUso } from "../../dominio/casos-de-uso/gestionar-usuarios.caso-uso";
import { ModalComponent } from "../../shared/ui/modal.component";
import { CalificacionRecord } from "../../dominio/modelos/modelos";

@Component({
  selector: "app-notas",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: "./notas.component.html",
})
export class NotasComponent {
  // Vista de solo lectura (rol estudiante)
  protected readonly academico = inject(ConsultarAcademicoCasoUso);
  protected readonly auth = inject(GestionarSesionCasoUso);

  // Vista de gestión CRUD (rol docente/admin)
  protected readonly calificacionAdmin = inject(GestionarCalificacionesCasoUso);
  protected readonly cursoAdmin = inject(GestionarCursosCasoUso);
  protected readonly usuarioAdmin = inject(GestionarUsuariosCasoUso);
  private readonly fb = inject(FormBuilder);

  protected readonly modalAbierto = signal(false);
  protected readonly editando = signal<CalificacionRecord | null>(null);
  protected readonly guardando = signal(false);
  protected readonly errorMsg = signal("");

  // El "join" estudiante+curso ahora vive en el caso de uso (dominio), no aquí.
  protected readonly filas = this.calificacionAdmin.filas;

  protected readonly form = this.fb.nonNullable.group({
    estudianteId: [0, [Validators.required, Validators.min(1)]],
    cursoId: [0, [Validators.required, Validators.min(1)]],
    nota: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
  });

  abrirCrear(): void {
    this.editando.set(null);
    this.errorMsg.set("");
    this.form.reset({ estudianteId: 0, cursoId: 0, nota: 0 });
    this.modalAbierto.set(true);
  }

  abrirEditar(registro: CalificacionRecord): void {
    this.editando.set(registro);
    this.errorMsg.set("");
    this.form.reset({
      estudianteId: registro.estudianteId,
      cursoId: registro.cursoId,
      nota: registro.nota,
    });
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
        await this.calificacionAdmin.actualizar(editando.id, valor);
      } else {
        await this.calificacionAdmin.crear(valor);
      }
      this.modalAbierto.set(false);
    } catch (err) {
      // Los errores de validación de dominio (Error) traen mensaje específico;
      // los errores de red/HTTP (HttpErrorResponse) no son instancia de Error.
      this.errorMsg.set(err instanceof Error ? err.message : "No se pudo guardar la calificación. Intenta nuevamente.");
    } finally {
      this.guardando.set(false);
    }
  }

  async eliminar(registro: CalificacionRecord): Promise<void> {
    const confirmado = confirm(`¿Eliminar esta calificación? Esta acción no se puede deshacer.`);
    if (!confirmado) return;
    await this.calificacionAdmin.eliminar(registro.id);
  }
}
