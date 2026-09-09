import { Component, signal, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { GestionarSesionCasoUso } from "../dominio/casos-de-uso/gestionar-sesion.caso-uso";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  private readonly sesion: GestionarSesionCasoUso = inject(GestionarSesionCasoUso);
  private readonly router: Router = inject(Router);

  readonly correo = signal("estudiante@uta.edu.ec");
  readonly password = signal("");
  readonly cargando = signal(false);
  readonly errorMsg = signal("");

  onSubmit(): void {
    this.errorMsg.set("");
    this.cargando.set(true);

    this.sesion.iniciarSesion(this.correo(), this.password()).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(["/resumen"]);
      },
      error: (err) => {
        this.cargando.set(false);
        this.errorMsg.set(
          err.status === 401 ? "Correo o contraseña incorrectos." : "No se pudo conectar con el servidor."
        );
      },
    });
  }
}
