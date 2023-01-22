import {Coffee} from "./coffee";
import {User} from "./user";

/**
 * Модель заказа.
 */
export class Order {
  /**
   * Идентификатор заказа.
   */
  id: string;

  /**
   * Модель кофе.
   */
  coffee: Coffee;

  /**
   * Модель пользователя.
   */
  user: User | null;
}
