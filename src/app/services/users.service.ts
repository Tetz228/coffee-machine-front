import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppConfigService} from "../../config/app-config.service";
import {User} from "../models/user";
import {JwtHelperService} from "@auth0/angular-jwt";
import {AuthService} from "./auth.service";
import {BehaviorSubject, tap} from "rxjs";
import {Router} from "@angular/router";
import {AppConfig} from "../../config/app-config";

@Injectable({
  providedIn: 'root'
})

/**
 * Сервис для работы с пользователем.
 */
export class UsersService {
  /**
   * Конфигурация.
   */
  private config: AppConfig;

  /**
   * Отслеживаемый пользователь.
   */
  private user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  /**
   * Сервис для работы с пользователем.
   * @param http - Сервис HTTP-клиента.
   * @param jwtHelper - Сервис для работы с токенами.
   * @param authService - Сервис для работы с аутентификацией.
   * @param appConfigService - Сервис для работы с конфигурацией.
   * @param router - Сервис для работы с навигацией.
   */
  constructor(private http: HttpClient,
              private jwtHelper: JwtHelperService,
              private authService: AuthService,
              private appConfigService: AppConfigService,
              private router: Router) {
    this.config = appConfigService.getConfig();
  }

  /**
   * Получение отслеживаемого пользователя.
   */
  getObservableUser() {
    return this.user.asObservable();
  }

  /**
   * Присвоить пользователя или нулевой.
   */
  setUserOrNull(user: User | null) {
    return this.user.next(user);
  }

  /**
   * Получение авторизированного пользователя.
   */
  getAuthenticatedUser() {
    if (!this.authService.IsTokenVerification()) {
      this.user.next(null)

      return;
    }

    const token = this.authService.getAccessToken();
    if (token) {
      const userId = this.jwtHelper.decodeToken(token.toString()).Id;

      return this.http.get<User>(`${this.config.baseUrl}/Users/${userId}`).pipe(tap((value) => this.setUserOrNull(value)));
    }

    return;
  }

  /**
   * Выйти из аккаунта.
   */
  logout() {
    localStorage.clear();

    this.setUserOrNull(null);

    this.router.navigate(['login']);
  }
}
