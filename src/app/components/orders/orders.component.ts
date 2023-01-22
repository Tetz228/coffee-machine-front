import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {OrdersService} from "../../services/orders.service";
import {Coffee} from "../../models/coffee";
import {FormBuilder} from "@angular/forms";
import {User} from "../../models/user";
import {UsersService} from "../../services/users.service";
import {Bills} from "../../models/bills";
import {HttpErrorResponse} from "@angular/common/http";
import {OrderErrorMessages} from "../../error-messages/order-error-messages";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

/**
 * Компонент заказов.
 */
export class OrdersComponent implements OnInit {
  /**
   * Выбранный кофе.
   */
  @Input() selectCoffee: Coffee;

  /**
   * Авторизированный пользователь.
   */
  @Input() user: User | null;

  /**
   * Cдача с заказа.
   */
  changes: Map<Bills, number>;

  /**
   * Сумма сдачи.
   */
  sumChanges: number;

  /**
   * Компонент заказов.
   * @param formBuilder - Строитель форм.
   * @param orderService - Сервис для работы с модальным окном.
   * @param usersService - Сервис для работы с пользователем.
   * @param toastService - Сервис для работы с уведомлениями.
   */
  constructor(private formBuilder: FormBuilder,
              private orderService: OrdersService,
              private usersService: UsersService,
              private toastService: NgToastService) {
  }

  /**
   * Инициализация компонента.
   */
  ngOnInit(): void {
    this.changes = new Map<Bills, number>();

    if (this.user) {
      this.sumChanges = this.user.balance - this.selectCoffee.price;
    }
  }

  /**
   * Создание нового заказа и закрытие окна с заказом.
   */
  createOrderAndCloseWindowOrder() {
    if (this.user === null) {
      return;
    }

    this.orderService.makeOrder(this.user, this.selectCoffee).subscribe({
      next: value => {
        this.changes = value;
        this.usersService.getAuthenticatedUser()?.subscribe();
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.status === 400) {
          this.toastService.error(
            {
              detail: OrderErrorMessages.Header,
              summary: OrderErrorMessages.InsufficientBalance,
              duration: 5000
            });
        }
      }
    });

    this.orderService.closeWindowOrder();
  }

  /**
   * Закрытие окна с заказом.
   */
  closeWindowOrder() {
    this.orderService.closeWindowOrder();
  }
}

