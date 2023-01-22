import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Coffee} from "../models/coffee";
import {AppConfigService} from "../../config/app-config.service";
import {ItemsParameters} from "../models/items-parameters";
import {AppConfig} from "../../config/app-config";

@Injectable({
  providedIn: 'root'
})

/**
 * Сервис для работы с кофе.
 */
export class CoffeesService {
  /**
   * Конфигурация.
   */
  private config: AppConfig;

  /**
   * Сервис для работы с кофе.
   * @param http - Сервис HTTP-клиента.
   * @param appConfigService - Сервис для работы с конфигурацией.
   */
  constructor(private http: HttpClient,
              private appConfigService: AppConfigService) {
    this.config = appConfigService.getConfig();
  }

  /**
   * Задержка перед поиском кофе.
   */
  get DebounceTimeCoffees() {
    return this.config.debounceTimeFindCoffees;
  }

  /**
   * Количество кофе на странице.
   */
  get CountCoffeesPage() {
    return this.config.countCoffeesPage;
  }

  /**
   * Получение параметров видов кофе.
   * @param searchFilter - Поисковый фильтр.
   * @param currentNumberPage - Текущий номер страницы.
   * @param countCoffeesPage - Количество кофе на странице.
   */
  getCoffeesParameters(searchFilter: string, currentNumberPage: number, countCoffeesPage: number) {
    const params = new HttpParams({
      fromObject: {
        filter: searchFilter,
        currentNumberPage: currentNumberPage,
        countItemsPage: countCoffeesPage
      }
    });

    return this.http.get<ItemsParameters<Coffee>>(`${this.config.baseUrl}/Coffees`, {params: params});
  }
}
