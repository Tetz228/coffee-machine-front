import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, tap, throwError} from 'rxjs';
import {Router} from "@angular/router";

@Injectable()
/**
 * Перехватчик HTTP-запросов.
 */
export class Interceptor implements HttpInterceptor {
  /**
   * Перехватчик HTTP-запросов.
   * @param router - Сервис для работы с навигацией.
   */
  constructor(private router: Router) {
  }

  /**
   * Перехват HTTP-запросов.
   * @param request - HTTP-запрос.
   * @param next - HTTP-события.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(tap(() => {
    }, error => {
      if ([401, 403].includes(error.status)) {
        localStorage.clear();
        this.router.navigate(['login']);
        console.error(error);
      }

      console.error(error?.message || error.statusText);
      return throwError(() => error);
    }))
  }
}
