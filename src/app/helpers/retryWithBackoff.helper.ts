import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, retryWhen } from 'rxjs/operators';

// Original taken from: https://medium.com/angular-in-depth/retry-failed-http-requests-in-angular-f5959d486294

const finalErrorMessage = (maxRetry: number) =>
  `Tried to load requested request ${maxRetry} times without success. Giving up!`;

const DEFAULT_MAX_RETRIES = 5;
const DEFAULT_BACKOFF = 1000;

export function retryWithBackoff(
  delayMs: number,
  maxRetry = DEFAULT_MAX_RETRIES,
  backoffMs = DEFAULT_BACKOFF
) {
  let retries = maxRetry;

  return (src: Observable<any>) =>
    src.pipe(
      retryWhen((errors: Observable<any>) => errors.pipe(
        mergeMap(error => {
          if (retries-- > 0) {
            const backoffTime = delayMs + (maxRetry - retries) * backoffMs;
            return of(error).pipe(delay(backoffTime));
          }
          return throwError(finalErrorMessage(maxRetry));
        })
      )
    ));
}
