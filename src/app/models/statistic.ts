import {Coffee} from "./coffee";

/**
 * Модель статистики.
 */
export class Statistic {
  /**
   * Идентификатор статистики.
   */
  id: string;

  /**
   * Модель кофе.
   */
  coffee: Coffee;

  /**
   * Общая сумма продаж.
   */
  total: number;
}
