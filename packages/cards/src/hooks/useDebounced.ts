import { useEffect, useRef, useState } from "react";
import { BehaviorSubject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

/**
 * Debounce reativo via RxJS.
 *
 * O fluxo Subject -> pipe(operators) -> setState e mais composavel que setTimeout puro
 * (permite multiplexar com outros streams sem reescrever a logica) e e o mesmo padrao
 * adotado em projetos Angular, tornando a migracao mental entre as duas stacks direta.
 *
 * O Subject vive durante toda a instancia do hook; ao desmontar o componente, sai de
 * escopo e e coletado. Nao chamamos complete() para nao invalidar a ref durante o
 * double-invoke do StrictMode em dev.
 */
export function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);
  const subjectRef = useRef<BehaviorSubject<T> | null>(null);

  if (subjectRef.current === null) {
    subjectRef.current = new BehaviorSubject<T>(value);
  }

  useEffect(() => {
    const subject = subjectRef.current!;
    const subscription = subject
      .pipe(debounceTime(delay), distinctUntilChanged())
      .subscribe(setDebounced);
    return () => subscription.unsubscribe();
  }, [delay]);

  useEffect(() => {
    subjectRef.current!.next(value);
  }, [value]);

  return debounced;
}
