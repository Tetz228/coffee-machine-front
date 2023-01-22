import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppConfigService} from "../../config/app-config.service";
import {SignUp} from "../models/sign-up";
import {User} from "../models/user";
import {AppConfig} from "../../config/app-config";

@Injectable({
  providedIn: 'root'
})

/**
 * Сервис для работы с регистрацией.
 */
export class SignUpService {
  /**
   * Конфигурация.
   */
  private config: AppConfig;

  /**
   * Сервис для работы с регистрацией.
   * @param http - Сервис HTTP-клиента.
   * @param appConfigService - Сервис для работы с конфигурацией.
   */
  constructor(private http: HttpClient,
              private appConfigService: AppConfigService) {
    this.config = appConfigService.getConfig();
  }

  /**
   * Добавление нового пользователя.
   * @param user - Новый пользователь.
   */
  addUser(user: SignUp) {
    return this.http.post<User>(`${this.config.baseUrl}/Users`, user);
  }
}
