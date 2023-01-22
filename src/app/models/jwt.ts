/**
 * Модель JSON Web Token
 */
export class Jwt {
  /**
   * Токен доступа.
   */
  accessToken: string;

  /**
   * Токен обновления доступа.
   */
  refreshToken: string;
}
