import { useEffect, useRef, useState } from "react";
import { BehaviorSubject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

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
