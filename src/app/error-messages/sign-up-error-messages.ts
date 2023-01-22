/**
 * Сообщения об ошибках в регистрации.
 */
export class SignUpErrorMessages {
  /**
   * Заголовок ошибки.
   */
  static get Header() {
    return "Ошибка при регистрации";
  }

  /**
   * Сообщение о существующем логине.
   */
  static get LoginExist() {
    return "Введенный логин уже существует.";
  }
}
