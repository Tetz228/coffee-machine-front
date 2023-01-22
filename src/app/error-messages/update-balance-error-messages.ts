/**
 * Общие сообщения.
 */
export class UpdateBalanceErrorMessages {
  /**
   * Заголовок ошибки.
   */
  static get Header() {
    return "Ошибка при пополнении баланса";
  }

  /**
   * Сообщение о некорректной сумме.
   */
  static get IncorrectSum() {
    return "Была передана некорректная сумма.";
  }
}
