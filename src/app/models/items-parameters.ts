/**
 * Модель параметров элементов.
 */
export class ItemsParameters<TClass> {
  /**
   * Перечисление элементов.
   */
  items: TClass[];

  /**
   * Общее количество элементов.
   */
  totalCountItems: number;
}
