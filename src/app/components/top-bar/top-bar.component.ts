import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {UsersService} from "../../services/users.service";

import {Observable} from "rxjs";
import {User} from "../../models/user";


@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

/**
 * Компонент панель навигации.
 */
export class TopBarComponent implements OnInit {
  /**
   * Отслеживаемый пользователь.
   */
  user: Observable<User | null>;

  /**
   * Компонент панель навигации.
   * @param authService - Сервис для работы с аутентификацией.
   * @param usersService - Сервис для работы с пользователем.
   */
  constructor(private authService: AuthService,
              public usersService: UsersService) {
  }

  /**
   * Инициализация компонента.
   */
  ngOnInit(): void {
    this.user = this.usersService.getObservableUser();
    this.usersService.getAuthenticatedUser()?.subscribe();
  }

  /**
   * Выйти из аккаунта.
   */
  logout() {
    this.usersService.logout();
  }
}

