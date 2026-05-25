import { readable, derived, type Readable } from "svelte/store";
import { Observable, type Subscription } from "rxjs";

export function fromObservable<T>(
  observable: Observable<T>,
  initialValue?: T
): Readable<T> {
  return readable<T>(initialValue, (set) => {
    const subscription: Subscription = observable.subscribe(set);
    return () => subscription.unsubscribe();
  });
}

export function toObservable<T>(store: Readable<T>): Observable<T> {
  return new Observable<T>((subscriber) => {
    const unsubscribe = store.subscribe((value) => {
      subscriber.next(value);
    });

    return () => {
      unsubscribe();
    };
  });
}

// 额外的工具函数，处理错误情况
export function fromObservableWithError<T>(
  observable: Observable<T>,
  initialValue?: T
): Readable<T | null> {
  return readable<T | null>(initialValue ?? null, (set) => {
    const subscription: Subscription = observable.subscribe({
      next: (value) => set(value),
      error: (error) => {
        console.error("Observable error:", error);
        set(null);
      },
    });

    return () => subscription.unsubscribe();
  });
}
