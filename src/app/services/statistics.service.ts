import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";

import {Statistic} from "../models/statistic";
import {AppConfigService} from "../../config/app-config.service";
import {ItemsParameters} from "../models/items-parameters";
import {AppConfig} from "../../config/app-config";

@Injectable({
  providedIn: 'root'
})

/**
 * Сервис для работы со статистикой.
 */
export class StatisticsService {
  /**
   * Конфигурация.
   */
  private config: AppConfig;

  /**
   * Сервис для работы со статистикой.
   * @param http - Сервис HTTP-клиента.
   * @param appConfigService - Сервис для работы с конфигурацией.
   */
  constructor(private http: HttpClient,
              private appConfigService: AppConfigService) {
    this.config = appConfigService.getConfig();
  }

  /**
   * Задержка перед поиском статистик.
   */
  get DebounceTimeStatistics() {
    return this.config.debounceTimeFindStatistics;
  }

  /**
   * Количество статистик на странице.
   */
  get CountStatisticsPage() {
    return this.config.countStatisticsPage;
  }

  /**
   * Получение параметров статистик.
   * @param searchFilter - Поисковый фильтр.
   * @param currentNumberPage - Текущий номер страницы.
   * @param countStatisticsPage - Количество статистик на странице.
   */
  getStatisticsParameters(searchFilter: string, currentNumberPage: number, countStatisticsPage: number) {
    const params = new HttpParams({
      fromObject: {
        filter: searchFilter,
        currentNumberPage: currentNumberPage,
        countItemsPage: countStatisticsPage
      }
    });

    return this.http.get<ItemsParameters<Statistic>>(`${this.config.baseUrl}/Statistics`, {params: params});
  }
}
