import { Injectable } from "@angular/core";
import Swal from "sweetalert2";

@Injectable({ providedIn: "root" })
export class NotificationService {
  /**
   * Shows a delete confirmation dialog with a red danger button.
   */
  confirmDelete(titulo: string, texto: string): Promise<boolean> {
    return Swal.fire({
      title: titulo,
      text: texto,
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: "#dc2626", // red-600
      cancelButtonText: "Cancelar",
    }).then((result) => result.isConfirmed);
  }

  /**
   * Shows an edit/save confirmation dialog with a blue primary button.
   */
  confirmEdit(titulo: string, texto: string): Promise<boolean> {
    return Swal.fire({
      title: titulo,
      text: texto,
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: "Guardar",
      confirmButtonColor: "#0d44b5", // aura-primary
      cancelButtonText: "Cancelar",
    }).then((result) => result.isConfirmed);
  }
}
