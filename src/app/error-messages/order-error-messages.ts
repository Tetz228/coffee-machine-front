/**
 * Сообщения об ошибках в заказах.
 */
export class OrderErrorMessages {
  /**
   * Заголовок ошибки.
   */
  static get Header() {
    return "Ошибка при заказе";
  }

  /**
   * Сообщение о средствах на балансе.
   */
  static get InsufficientBalance() {
    return "Недостаточно средств на балансе";
  }
}
