import {Injectable} from '@angular/core';
import {AppConfig} from "./app-config";
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs";

/**
 * Инициализатор конфигурации.
 * @param appConfigService - Сервис для работы с конфигурации.
 */
export function initializerConfig(appConfigService: AppConfigService) {
  return () => appConfigService.loadConfig();
}

@Injectable({
  providedIn: 'root'
})

/**
 * Сервис для работы с конфигурацией.
 */
export class AppConfigService {
  /**
   * Конфигурация.
   */
  private config: AppConfig;

  /**
   * Сервис для работы с конфигурацией.
   * @param http - Сервис HTTP-клиента.
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Загрузка конфигурации.
   */
  loadConfig() {
    return this.http.get<AppConfig>('app.config.json').pipe(tap(data => this.config = data));
  }

  getConfig() {
    return this.config;
  }
}
