import { Component, computed, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ConsultarAcademicoCasoUso } from "../../dominio/casos-de-uso/consultar-academico.caso-uso";
import { GestionarSesionCasoUso } from "../../dominio/casos-de-uso/gestionar-sesion.caso-uso";
import { GestionarHorarioCasoUso } from "../../dominio/casos-de-uso/gestionar-horario.caso-uso";
import { GestionarCursosCasoUso } from "../../dominio/casos-de-uso/gestionar-cursos.caso-uso";
import { GestionarUsuariosCasoUso } from "../../dominio/casos-de-uso/gestionar-usuarios.caso-uso";
import { ModalComponent } from "../../shared/ui/modal.component";
import { Dia, HorarioRecord } from "../../dominio/modelos/modelos";

interface DiaPill {
  abbr: Dia;
  fecha: number;
}

@Component({
  selector: "app-horario",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: "./horario.component.html",
})
export class HorarioComponent {
  protected readonly academico = inject(ConsultarAcademicoCasoUso);
  protected readonly auth = inject(GestionarSesionCasoUso);

  protected readonly dias: DiaPill[] = [
    { abbr: "LUN", fecha: 24 },
    { abbr: "MAR", fecha: 25 },
    { abbr: "MIE", fecha: 26 },
    { abbr: "JUE", fecha: 27 },
    { abbr: "VIE", fecha: 28 },
  ];

  readonly diaSeleccionado = signal<Dia>("MAR");

  readonly clasesDelDia = computed(() =>
    this.academico.horario.value().horario.filter((h) => h.dia === this.diaSeleccionado())
  );

  claseCategoriaClase(categoria: string): string {
    return categoria === "APE" ? "text-accent-600" : "text-brand-700";
  }

  exportarHorario(): void {
    const filas = this.academico.horario.value().horario;
    const contenido = filas.map((h) => `${h.dia} ${h.horaInicio}-${h.horaFin};${h.curso};${h.profesor}`).join("\n");
    const blob = new Blob([`Día Horario;Curso;Profesor\n${contenido}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mi-horario.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // --- Solo para docente/admin ---
  protected readonly horarioAdmin = inject(GestionarHorarioCasoUso);
  protected readonly cursoAdmin = inject(GestionarCursosCasoUso);
  protected readonly usuarioAdmin = inject(GestionarUsuariosCasoUso);
  private readonly fb = inject(FormBuilder);

  protected readonly modalAbierto = signal(false);
  protected readonly editando = signal<HorarioRecord | null>(null);
  protected readonly guardando = signal(false);
  protected readonly errorMsg = signal("");

  // Única fuente de verdad de los días válidos: vive en el caso de uso.
  protected readonly diasDisponibles = this.horarioAdmin.diasDisponibles;

  // El "join" estudiante+curso ahora vive en el caso de uso (dominio), no aquí.
  protected readonly filasAdmin = this.horarioAdmin.filas;

  protected readonly form = this.fb.nonNullable.group({
    estudianteId: [0, [Validators.required, Validators.min(1)]],
    cursoId: [0, [Validators.required, Validators.min(1)]],
    dia: ["LUN" as Dia, Validators.required],
    fecha: [24, [Validators.required, Validators.min(1)]],
    horaInicio: ["08:00", Validators.required],
    horaFin: ["10:00", Validators.required],
  });

  abrirCrear(): void {
    this.editando.set(null);
    this.errorMsg.set("");
    this.form.reset({ estudianteId: 0, cursoId: 0, dia: "LUN", fecha: 24, horaInicio: "08:00", horaFin: "10:00" });
    this.modalAbierto.set(true);
  }

  abrirEditar(registro: HorarioRecord): void {
    this.editando.set(registro);
    this.errorMsg.set("");
    this.form.reset({ ...registro });
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
        await this.horarioAdmin.actualizar(editando.id, valor);
      } else {
        await this.horarioAdmin.crear(valor);
      }
      this.modalAbierto.set(false);
    } catch (err) {
      this.errorMsg.set(err instanceof Error ? err.message : "No se pudo guardar la clase. Intenta nuevamente.");
    } finally {
      this.guardando.set(false);
    }
  }

  async eliminar(registro: HorarioRecord): Promise<void> {
    const confirmado = confirm("¿Eliminar esta clase del horario? Esta acción no se puede deshacer.");
    if (!confirmado) return;
    await this.horarioAdmin.eliminar(registro.id);
  }
}
