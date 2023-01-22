import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})

/**
 * Сервис для работы с аутентификацией.
 */
export class AuthService {
  /**
   * Сервис для работы с аутентификацией.
   * @param http - Сервис HTTP-клиента.
   * @param jwtHelper - Сервис для работы с токенами.
   */
  constructor(private http: HttpClient,
              private jwtHelper: JwtHelperService) {
  }

  /**
   * Проверка токена.
   */
  IsTokenVerification() {
    const token = this.getAccessToken();

    return !(token === null || this.jwtHelper.isTokenExpired(token));
  }

  /**
   * Получение токена доступа.
   */
  getAccessToken() {
    return localStorage.getItem("accessToken");
  }
}
