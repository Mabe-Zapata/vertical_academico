# Arquitectura Vertical Slice — Presentación

> Gestión Académica: ejemplos concretos del código

---

## 1. ¿Qué es Vertical Slice?

Cada **slice** (rebanada) es un módulo autocontenido que agrupa todo lo necesario para una funcionalidad:

```
gestion-calificaciones/
├── dominio/           # Reglas de negocio
│   ├── casos-de-uso/
│   ├── modelos/
│   └── puertos/
├── infrastructura/     # Detalles técnicos
│   └── adaptadores/
└── presentacion/      # UI (Angular)
    └── *.component.ts
```

**No hay carpetas por tipo** (controllers/, services/, models/横行). Cada slice tiene TODO.

---

## 2. Estructura de un Slice

```text
gestion-calificaciones/
├── dominio/
│   ├── casos-de-uso/
│   │   ├── consultar-academico.caso-uso.ts
│   │   ├── gestionar-calificaciones.caso-uso.ts
│   │   ├── gestionar-cursos.caso-uso.ts
│   │   ├── gestionar-sesion.caso-uso.ts
│   │   └── gestionar-usuarios.caso-uso.ts
│   ├── modelos/
│   │   └── modelos.ts
│   └── puertos/
│       ├── academico-lectura.puerto.ts
│       ├── auth-repositorio.puerto.ts
│       └── ...
├── infrastructura/
│   ├── adaptadores-secundarios/
│   │   ├── http/
│   │   └── almacenamiento/
│   └── config/
└── presentacion/
    ├── notas.component.ts
    └── notas.component.html
```

---

## 3. Puerto (Interface) — Contrato del Dominio

**`dominio/puertos/calificacion-repositorio.puerto.ts`**

```typescript
export interface CalificacionRepositorioPuerto {
  readonly calificaciones: Signal<CalificacionRecord[]>;
  crear(datos: CalificacionFormValue): Promise<void>;
  actualizar(id: number, datos: CalificacionFormValue): Promise<void>;
  eliminar(id: number): Promise<void>;
}
```

El **dominio define el qué, la infraestructura define el cómo**.

---

## 4. Caso de Uso — Lógica de Negocio

**`dominio/casos-de-uso/gestionar-calificaciones.caso-uso.ts`**

```typescript
@Injectable({ providedIn: 'root' })
export class GestionarCalificacionesCasoUso {
  private readonly repositorio = inject(CalificacionRepositorioPuerto);
  private readonly cursosCasoUso = inject(GestionarCursosCasoUso);
  private readonly usuariosCasoUso = inject(GestionarUsuariosCasoUso);

  readonly calificaciones = this.repositorio.calificaciones;

  readonly filas = computed(() => {
    const cursos = this.cursosCasoUso.cursos.value();
    const estudiantes = this.usuariosCasoUso.estudiantes();
    return this.calificaciones.value().map((c) => ({
      registro: c,
      estudiante: estudiantes.find((e) => e.id === c.estudianteId)?.nombre ?? `#${c.estudianteId}`,
      curso: cursos.find((cu) => cu.id === c.cursoId)?.nombre ?? `#${c.cursoId}`,
    }));
  });

  async crear(datos: CalificacionFormValue): Promise<void> {
    validarCalificacion(datos);  // Regla de negocio
    await this.repositorio.crear(datos);
  }
}
```

---

## 5. Validación en el Dominio

**Reglas de negocio centralizadas, no en el componente:**

```typescript
function validarCalificacion(datos: CalificacionFormValue): void {
  if (!Number.isInteger(datos.estudianteId) || datos.estudianteId <= 0) {
    throw new Error('Selecciona un estudiante.');
  }
  if (!Number.isInteger(datos.cursoId) || datos.cursoId <= 0) {
    throw new Error('Selecciona un curso.');
  }
  if (Number.isNaN(datos.nota) || datos.nota < 0 || datos.nota > 10) {
    throw new Error('La nota debe estar entre 0 y 10.');
  }
}
```

Si mañana cambia la regla (ej: "nota máxima 8 para laboratorios"), solo se cambia aquí.

---

## 6. Adaptador Secundario — Implementación del Puerto

**`infraestructura/adaptadores-secundarios/http/calificacion-repositorio.http.ts`**

```typescript
@Injectable({ providedIn: 'root' })
export class CalificacionRepositorioHttp implements CalificacionRepositorioPuerto {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(apiConfig).calificaciones;

  readonly calificaciones = toSignal(
    this.http.get<CalificacionRecord[]>(this.baseUrl).pipe(
      catchError(() => of([]))
    ),
    { initialValue: [] as CalificacionRecord[] }
  );

  async crear(datos: CalificacionFormValue): Promise<void> {
    await firstValueFrom(this.http.post(this.baseUrl, datos));
  }

  async actualizar(id: number, datos: CalificacionFormValue): Promise<void> {
    await firstValueFrom(this.http.put(`${this.baseUrl}/${id}`, datos));
  }

  async eliminar(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.baseUrl}/${id}`));
  }
}
```

---

## 7. Componente — Presentación Delgado

**`presentacion/notas.component.ts`**

```typescript
@Component({
  selector: 'app-notas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './notas.component.html',
})
export class NotasComponent {
  protected readonly academico = inject(ConsultarAcademicoCasoUso);
  protected readonly auth = inject(GestionarSesionCasoUso);
  protected readonly calificacionAdmin = inject(GestionarCalificacionesCasoUso);
  protected readonly cursoAdmin = inject(GestionarCursosCasoUso);
  protected readonly usuarioAdmin = inject(GestionarUsuariosCasoUso);

  protected readonly filas = this.calificacionAdmin.filas;  // Del dominio

  protected readonly form = this.fb.nonNullable.group({
    estudianteId: [0, [Validators.required, Validators.min(1)]],
    cursoId: [0, [Validators.required, Validators.min(1)]],
    nota: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
  });

  async guardar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
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
      this.errorMsg.set(err instanceof Error ? err.message : 'No se pudo guardar.');
    }
  }
}
```

---

## 8. Inyección de Dependencias — Angular Hooks it up

```typescript
// En infrastructura/config/api.config.ts
export const apiConfig = {
  calificaciones: '/api/calificaciones',
  cursos: '/api/cursos',
  usuarios: '/api/usuarios',
  // ...
};

// El componente NO sabe si es HTTP, localStorage, o mock
// Solo inyecta el Caso de Uso
protected readonly calificacionAdmin = inject(GestionarCalificacionesCasoUso);
```

Angular resuelve automáticamente:
- `GestionarCalificacionesCasoUso` → `CalificacionRepositorioPuerto` → `CalificacionRepositorioHttp`

---

## 9. Cross-Slice Imports — Navegación entre Slices

```typescript
// gestion-calificaciones/presentacion/notas.component.ts
import { ConsultarAcademicoCasoUso } from '../../dominio/casos-de-uso/consultar-academico.caso-uso';
import { GestionarSesionCasoUso } from '../../dominio/casos-de-uso/gestionar-sesion.caso-uso';
import { GestionarUsuariosCasoUso } from '../../dominio/casos-de-uso/gestionar-usuarios.caso-uso';
```

```typescript
// resumen/presentacion/resumen.component.ts
import { ConsultarAcademicoCasoUso } from '../../dominio/casos-de-uso/consultar-academico.caso-uso';
import { GestionarSesionCasoUso } from '../../gestion-sesiones/dominio/casos-de-uso/gestionar-sesion.caso-uso';
```

**Un slice puede usar casos de uso de otro slice** a través de la ruta relativa correcta.

---

## 10. Modelo Compartido

**`dominio/modelos/modelos.ts`**

```typescript
export type Rol = 'estudiante' | 'docente' | 'admin';

export interface Usuario {
  id: number;
  nombre: string;
  iniciales: string;
  correo: string;
  rol: Rol;
  periodo: string;
}

export interface UsuarioRecord extends Usuario {
  password: string;
}

export type Categoria = 'APE' | 'Laboratorio';

export interface Curso {
  id: number;
  nombre: string;
  profesor: string;
  categoria: Categoria;
}

export interface CalificacionRecord {
  id: number;
  estudianteId: number;
  cursoId: number;
  nota: number;
}
```

Cada slice tiene su propio `modelos.ts` con los tipos que necesita.

---

## 11. Ventajas de Esta Arquitectura

| Problema tradicional | Solución Vertical Slice |
|---------------------|------------------------|
| Cambios cruzan carpetas (controller → service → model) | Cambio contenido en UN slice |
| Tests requieren mockear todo el stack | Test unitario del caso de uso |
| Reglas de negocio dispersas | Centralizadas en `dominio/` |
| Difícil encontrar código relacionado | Todo está junto |
| Shared/ common se convierte en graveyard | Cada slice tiene sus propias abstracciones |

---

## 12. Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTACION                          │
│  Component (notas.component.ts)                        │
│  - Injects: GestionarCalificacionesCasoUso              │
└─────────────────────┬───────────────────────────────────┘
                      │ inject()
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    DOMINIO                              │
│  GestionarCalificacionesCasoUso                         │
│  - Validación de reglas de negocio                     │
│  - Computed filas (join con cursos/estudiantes)        │
└─────────────────────┬───────────────────────────────────┘
                      │ inject(CalificacionRepositorioPuerto)
                      ▼
┌─────────────────────────────────────────────────────────┐
│                 INFRAESTRUCTURA                         │
│  CalificacionRepositorioHttp                           │
│  - HttpClient calls                                    │
│  - toSignal() conversion                               │
└─────────────────────────────────────────────────────────┘
```

---

## 13. Tips para Navegar el Código

```bash
# Ver todos los casos de uso de calificaciones
ls src/app/gestion-calificaciones/dominio/casos-de-uso/

# Ver la implementación HTTP
ls src/app/gestion-calificaciones/infraestructura/adaptadores-secundarios/http/

# Ver el componente de presentación
ls src/app/gestion-calificaciones/presentacion/

# Buscar dónde se usa un tipo
grep -r "CalificacionRecord" src/app/
```

---

## 14. Checklist para Nuevo Slice

- [ ] Crear carpeta `gestion-{nombre}/`
- [ ] Definir puertos en `dominio/puertos/`
- [ ] Implementar casos de uso en `dominio/casos-de-uso/`
- [ ] Crear adaptadores en `infraestructura/adaptadores-secundarios/`
- [ ] Componente en `presentacion/`
- [ ] Registrar providers si es necesario
- [ ] Testear el caso de uso (no el componente)

---

## 15. Recursos

- **Angular Signals**: `Signal<T>`, `toSignal()`, `computed()`
- **Inyección**: `inject()` en lugar de constructor
- **Vertical Slice**: "Package by feature, not by layer"
- **Puertos y Adaptadores**: Hexagonal Architecture

---

> **Regla de oro**: Si necesitás tocar más de un slice para un cambio, parate a pensar si el diseño es correcto.
