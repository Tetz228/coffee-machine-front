/**
 * Сообщения об ошибках в авторизации.
 */
export class SignInErrorMessages {
  /**
   * Заголовок ошибки.
   */
  static get Header() {
    return "Ошибка при авторизации";
  }

  /**
   * Сообщение о неверном логине или пароле.
   */
  static get InvalidLoginOrPassword() {
    return "Неверный логин или пароль.";
  }
}
