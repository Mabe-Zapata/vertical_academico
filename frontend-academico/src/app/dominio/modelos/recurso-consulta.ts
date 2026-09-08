import { Signal } from "@angular/core";

/**
 * Forma que el DOMINIO necesita para leer datos reactivos: un valor, si
 * está cargando, si falló, y una forma de recargar. Deliberadamente NO
 * importa nada de '@angular/common/http' — no sabe que "por dentro" es
 * un httpResource(). Cualquier adaptador secundario (HTTP, WebSocket,
 * IndexedDB) puede implementar este contrato con su propia tecnología.
 *
 * En la práctica, el objeto que devuelve `httpResource()` de Angular ya
 * cumple esta forma estructuralmente (value/isLoading/error/reload), así
 * que el adaptador HTTP simplemente lo devuelve tal cual, tipado como
 * este puerto — sin necesidad de "envolverlo" en más código.
 */
export interface RecursoConsulta<T> {
  value: Signal<T>;
  isLoading: Signal<boolean>;
  error: Signal<unknown>;
  reload: () => boolean;
}
