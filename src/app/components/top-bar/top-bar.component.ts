import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {UsersService} from "../../services/users.service";
import {UpdateBalanceService} from "../../services/update-balance.service";

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
   * @param updateBalanceService - Сервис для работы с пополнением баланса.
   */
  constructor(private authService: AuthService,
              public usersService: UsersService,
              private updateBalanceService: UpdateBalanceService,
  ) {
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

  /**
   * Если true - окно пополнения баланса открыто, иначе false.
   */
  isShowModalUpdateBalance() {
    return this.updateBalanceService.isShowModalUpdateBalance;
  }

  /**
   * Открытие окна пополнения баланса.
   */
  openWindowUpdateBalance() {
    this.updateBalanceService.openWindowUpdateBalance();
  }
}

