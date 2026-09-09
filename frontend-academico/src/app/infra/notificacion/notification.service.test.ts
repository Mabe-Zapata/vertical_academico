import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotificationService } from "./notification.service";

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

import Swal from "sweetalert2";

describe("NotificationService", () => {
  let service: NotificationService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new NotificationService();
  });

  describe("confirmDelete", () => {
    it("calls Swal.fire with danger red button and Eliminar text", async () => {
      vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: true } as any);

      const result = await service.confirmDelete("Eliminar usuario", "¿Estás seguro?");

      expect(result).toBe(true);
      expect(Swal.fire).toHaveBeenCalledOnce();
      const callArgs = vi.mocked(Swal.fire).mock.calls[0][0] as unknown as Record<string, unknown>;
      expect(callArgs["title"]).toBe("Eliminar usuario");
      expect(callArgs["text"]).toBe("¿Estás seguro?");
      expect(callArgs["showCancelButton"]).toBe(true);
      expect(callArgs["reverseButtons"]).toBe(true);
      expect(callArgs["confirmButtonText"]).toBe("Eliminar");
      expect(callArgs["confirmButtonColor"]).toBe("#dc2626"); // red-600
    });

    it("returns false when user cancels", async () => {
      vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: false } as any);

      const result = await service.confirmDelete("Test", "Test text");

      expect(result).toBe(false);
    });
  });

  describe("confirmEdit", () => {
    it("calls Swal.fire with primary blue button and Guardar text", async () => {
      vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: true } as any);

      const result = await service.confirmEdit("Guardar cambios", "¿Guardar?");

      expect(result).toBe(true);
      expect(Swal.fire).toHaveBeenCalledOnce();
      const callArgs = vi.mocked(Swal.fire).mock.calls[0][0] as unknown as Record<string, unknown>;
      expect(callArgs["title"]).toBe("Guardar cambios");
      expect(callArgs["text"]).toBe("¿Guardar?");
      expect(callArgs["showCancelButton"]).toBe(true);
      expect(callArgs["reverseButtons"]).toBe(true);
      expect(callArgs["confirmButtonText"]).toBe("Guardar");
      expect(callArgs["confirmButtonColor"]).toBe("#0d44b5"); // aura-primary
    });

    it("returns false when user cancels", async () => {
      vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: false } as any);

      const result = await service.confirmEdit("Test", "Test text");

      expect(result).toBe(false);
    });
  });
});
