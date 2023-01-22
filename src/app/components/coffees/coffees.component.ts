import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Coffee} from "../../models/coffee";
import {debounceTime, distinctUntilChanged, startWith, Subject, Subscription, tap} from "rxjs";
import {CoffeesService} from "../../services/coffees.service";
import {OrdersService} from "../../services/orders.service";
import {FormControl} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {UsersService} from "../../services/users.service";
import {User} from "../../models/user";
import {OrderErrorMessages} from "../../error-messages/order-error-messages";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-coffees',
  templateUrl: './coffees.component.html',
  styleUrls: ['./coffees.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

/**
 * Компонент кофе.
 */
export class CoffeesComponent implements OnInit, OnDestroy {
  /**
   * Выбранный кофе.
   */
  selectCoffee: Coffee;

  /**
   * Элемент ввода для поиска.
   */
  findControl: FormControl;

  /**
   * Перечисление видов кофе.
   */
  subjectCoffees: Subject<Coffee[]>;

  /**
   * Номер текущей страницы.
   */
  currentNumberPage: number = 1;

  /**
   * Общее количество кофе.
   */
  totalCountCoffees: number;

  /**
   * Поисковый фильтр.
   */
  searchFilter: string = "";

  /**
   * Количество кофе на странице.
   */
  countCoffeesPage: number;

  /**
   * Задержка перед поиском кофе.
   */
  debounceTimeCoffees: number;

  /**
   * Подписка на пользователя.
   */
  subscriptionUser: Subscription;

  /**
   * Авторизированный пользователь.
   */
  user: User | null;

  /**
   * Компонент кофе.
   * @param coffeesService - Сервис для работы с кофе.
   * @param orderService - Сервис для работы с заказами.
   * @param authService - Сервис для работы с аутентификацией.
   * @param usersService - Сервис для работы с пользователем.
   * @param toastService - Сервис для работы с уведомлениями.
   */
  constructor(private coffeesService: CoffeesService,
              private orderService: OrdersService,
              public authService: AuthService,
              private usersService: UsersService,
              private toastService: NgToastService) {
  }

  /**
   * Инициализация компонента.
   */
  ngOnInit(): void {
    this.subscriptionUser = this.usersService.getObservableUser().pipe(tap(value => this.user = value)).subscribe();
    this.findControl = new FormControl();
    this.subjectCoffees = new Subject<Coffee[]>();
    this.debounceTimeCoffees = this.coffeesService.DebounceTimeCoffees;
    this.countCoffeesPage = this.coffeesService.CountCoffeesPage;

    this.findControl.valueChanges.pipe(
      startWith(''),
      debounceTime(800),
      distinctUntilChanged())
      .subscribe(value => {
        this.searchFilter = value;
        this.currentNumberPage = 1;
        this.getCoffeesParameters();
      });

    this.getCoffeesParameters();
  }

  /**
   * Уничтожение компонента.
   */
  ngOnDestroy(): void {
    this.subscriptionUser.unsubscribe();
  }

  /**
   * Получение новой страницы.
   * @param currentNumberPage - Текущий номер страницы.
   */
  getPage(currentNumberPage: number) {
    this.currentNumberPage = currentNumberPage;

    this.getCoffeesParameters();
  }

  /**
   * Получение параметров видов кофе.
   */
  getCoffeesParameters() {
    this.coffeesService.getCoffeesParameters(this.searchFilter, this.currentNumberPage, this.countCoffeesPage)
      .pipe(tap(itemsParameters => this.totalCountCoffees = itemsParameters.totalCountItems))
      .subscribe(value => this.subjectCoffees.next(value.items));
  }

  /**
   * Проверка валидности токена.
   */
  IsTokenVerification() {
    return this.authService.IsTokenVerification();
  }

  /**
   * Очистка элемента ввода для поиска.
   */
  clearFindControl() {
    this.findControl.setValue("");
  }

  /**
   * Если true - окно заказа открыто, иначе false.
   */
  isShowModalOrder() {
    return this.orderService.isShowModalOrder;
  }

  /**
   * Открытие окна заказа.
   * @param selectCoffee - Выбранный кофе.
   */
  openWindowOrder(selectCoffee: Coffee) {
    if (this.user === null || this.user?.balance < selectCoffee.price) {
      this.toastService.error(
        {
          detail: OrderErrorMessages.Header,
          summary: OrderErrorMessages.InsufficientBalance,
          duration: 5000
        });

      return;
    }
    this.selectCoffee = selectCoffee;

    this.orderService.openWindowOrder();
  }
}
