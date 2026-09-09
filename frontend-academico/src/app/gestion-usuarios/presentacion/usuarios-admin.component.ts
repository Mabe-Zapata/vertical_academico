import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { GestionarUsuariosCasoUso } from "../dominio/casos-de-uso/gestionar-usuarios.caso-uso";
import { GestionarSesionCasoUso } from "../../gestion-sesiones/dominio/casos-de-uso/gestionar-sesion.caso-uso";
import { ModalComponent } from "../../../shared/ui/modal/modal.component";
import { Rol, UsuarioRecord } from "../dominio/modelos/modelos";

@Component({
  selector: "app-usuarios-admin",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: "./usuarios-admin.component.html",
})
export class UsuariosAdminComponent {
  protected readonly usuarioAdmin: GestionarUsuariosCasoUso = inject(GestionarUsuariosCasoUso);
  protected readonly auth: GestionarSesionCasoUso = inject(GestionarSesionCasoUso);
  private readonly fb = inject(FormBuilder);

  // Única fuente de verdad de los roles válidos: vive en el caso de uso.
  protected readonly roles = this.usuarioAdmin.rolesValidos;

  protected readonly modalAbierto = signal(false);
  protected readonly editando = signal<UsuarioRecord | null>(null);
  protected readonly guardando = signal(false);
  protected readonly errorMsg = signal("");

  protected readonly form = this.fb.nonNullable.group({
    nombre: ["", [Validators.required, Validators.minLength(3)]],
    correo: ["", [Validators.required, Validators.email]],
    password: [""],
    rol: ["estudiante" as Rol, Validators.required],
    periodo: ["Periodo 2026 · Portal estudiantil", Validators.required],
  });

  abrirCrear(): void {
    this.editando.set(null);
    this.errorMsg.set("");
    this.form.reset({
      nombre: "",
      correo: "",
      password: "",
      rol: "estudiante",
      periodo: "Periodo 2026 · Portal estudiantil",
    });
    // Al crear, la contraseña es obligatoria; al editar, es opcional (dejarla vacía = no cambiarla).
    this.form.controls.password.setValidators([Validators.required, Validators.minLength(6)]);
    this.form.controls.password.updateValueAndValidity();
    this.modalAbierto.set(true);
  }

  abrirEditar(usuario: UsuarioRecord): void {
    this.editando.set(usuario);
    this.errorMsg.set("");
    this.form.reset({
      nombre: usuario.nombre,
      correo: usuario.correo,
      password: "",
      rol: usuario.rol,
      periodo: usuario.periodo,
    });
    this.form.controls.password.setValidators([Validators.minLength(6)]);
    this.form.controls.password.updateValueAndValidity();
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
        await this.usuarioAdmin.actualizar(editando.id, valor);
      } else {
        await this.usuarioAdmin.crear(valor);
      }
      this.modalAbierto.set(false);
    } catch (err) {
      this.errorMsg.set(err instanceof Error ? err.message : "No se pudo guardar el usuario. Intenta nuevamente.");
    } finally {
      this.guardando.set(false);
    }
  }

  async eliminar(usuario: UsuarioRecord): Promise<void> {
    if (usuario.id === this.auth.usuario()?.id) {
      alert("No puedes eliminar tu propio usuario mientras tienes la sesión iniciada.");
      return;
    }
    const confirmado = confirm(`¿Eliminar a "${usuario.nombre}"? Esta acción no se puede deshacer.`);
    if (!confirmado) return;
    await this.usuarioAdmin.eliminar(usuario.id);
  }
}
