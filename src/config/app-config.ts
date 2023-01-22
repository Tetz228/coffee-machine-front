/**
 * Конфигурация.
 */
export class AppConfig {
  /**
   * Ссылка на API.
   */
  baseUrl: string;

  /**
   * Количество кофе на странице.
   */
  countCoffeesPage: number;

  /**
   * Количество статистик на странице.
   */
  countStatisticsPage: number;

  /**
   * Задержка перед поиском кофе.
   */
  debounceTimeFindCoffees: number;

  /**
   * Задержка перед поиском статистики.
   */
  debounceTimeFindStatistics: number;
}
