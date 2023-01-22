import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})

/**
 * Ограничение доступа к маршруту.
 */
export class AuthGuard implements CanActivate {
  /**
   * Ограничение доступа к маршруту.
   * @param authService - Сервис для работы с аутентификацией.
   */
  constructor(private authService: AuthService) {
  }

  /**
   * Разрешает или запрещает доступ к маршруту.
   * @param route - Информация о маршруте.
   * @param state - Состояние маршрутизатора.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return !this.authService.IsTokenVerification();
  }
}
