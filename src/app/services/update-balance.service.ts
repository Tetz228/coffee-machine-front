import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UsersService} from "./users.service";
import {AppConfigService} from "../../config/app-config.service";
import {User} from "../models/user";
import {AppConfig} from "../../config/app-config";

@Injectable({
  providedIn: 'root'
})

/**
 * Сервис для работы с пополнением баланса.
 */
export class UpdateBalanceService {
  /**
   * Если true - окно пополнение баланса открыто, иначе false.
   */
  isShowModalUpdateBalance = false;

  /**
   * Конфигурация.
   */
  private config: AppConfig;

  /**
   * Сервис для работы с пополнением баланса.
   * @param http - Сервис HTTP-клиента.
   * @param usersService - Сервис для работы с пользователем.
   * @param appConfigService - Сервис для работы с конфигурацией.
   */
  constructor(private http: HttpClient,
              private usersService: UsersService,
              private appConfigService: AppConfigService) {
    this.config = appConfigService.getConfig();
  }

  /**
   * Открытие окна пополнения баланса.
   */
  openWindowUpdateBalance() {
    this.isShowModalUpdateBalance = true;
  }

  /**
   * Закрытие окна пополнения баланса.
   */
  closeWindowUpdateBalance() {
    this.isShowModalUpdateBalance = false;
  }

  /**
   * Обновление баланса пользователя.
   * @param userId - Идентификатор пользователя.
   * @param sum - Сумма пополнения баланса.
   */
  updateBalanceUser(userId: string, sum: number) {
    return this.http.put<User>(`${this.config.baseUrl}/Users/${userId}/balance`, sum);
  }
}
