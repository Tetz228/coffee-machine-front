import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SignIn} from "../models/sign-in";
import {Jwt} from "../models/jwt";
import {AppConfigService} from "../../config/app-config.service";
import {map} from "rxjs";
import {AppConfig} from "../../config/app-config";

@Injectable({
  providedIn: 'root'
})

/**
 * Сервис для работы с авторизацией.
 */
export class SignInService {
  /**
   * Конфигурация.
   */
  private config: AppConfig;

  /**
   * Сервис для работы с авторизацией.
   * @param http - Сервис HTTP-клиента.
   * @param appConfigService - Сервис для работы с конфигурацией.
   */
  constructor(private http: HttpClient,
              private appConfigService: AppConfigService) {
    this.config = appConfigService.getConfig();
  }

  /**
   * Авторизация пользователя.
   * @param loginUser - Авторизированный пользователь.
   */
  loginUser(loginUser: SignIn) {
    return this.http.post<Jwt>(`${this.config.baseUrl}/Authentication`, loginUser).pipe(map(jwt => {
      localStorage.setItem("accessToken", jwt.accessToken);
    }));
  }
}
