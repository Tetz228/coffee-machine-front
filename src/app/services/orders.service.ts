import {Injectable} from '@angular/core';

import {HttpClient} from "@angular/common/http";
import {Bills} from "../models/bills";
import {AppConfigService} from "../../config/app-config.service";
import {User} from "../models/user";
import {Coffee} from "../models/coffee";
import {Order} from "../models/order";
import {UsersService} from "./users.service";
import {AppConfig} from "../../config/app-config";

@Injectable({
  providedIn: 'root'
})

/**
 * Сервис для работы с заказами.
 */
export class OrdersService {
  /**
   * Если true - окно заказа открыто, иначе false.
   */
  isShowModalOrder = false;

  /**
   * Конфигурация.
   */
  private config: AppConfig;

  /**
   * Сервис для работы с заказами.
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
   * Открытие окна заказа.
   */
  openWindowOrder() {
    this.isShowModalOrder = true;
  }

  /**
   * Закрытие окна заказа.
   */
  closeWindowOrder() {
    this.usersService.getAuthenticatedUser()?.subscribe();
    this.isShowModalOrder = false;
  }

  /**
   * Создание нового заказа.
   * @param user - Модель пользователя
   * @param coffee - Кофе.
   */
  makeOrder(user: User, coffee: Coffee) {
    let order: Order = {id: '', user: user, coffee: coffee};

    return this.http.post<Map<Bills, number>>(`${this.config.baseUrl}/Orders`, order);
  }
}
