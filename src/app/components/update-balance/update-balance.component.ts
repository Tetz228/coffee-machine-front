import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, tap} from "rxjs";
import {User} from "../../models/user";
import {UsersService} from "../../services/users.service";
import {CustomValidators} from "../../validators/custom-validators";
import {UpdateBalanceService} from "../../services/update-balance.service";
import {NgToastService} from "ng-angular-popup";
import {UpdateBalanceErrorMessages} from "../../error-messages/update-balance-error-messages";

@Component({
  selector: 'app-update-balance',
  templateUrl: './update-balance.component.html',
  styleUrls: ['./update-balance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

/**
 * Компонент пополнения баланса.
 */
export class UpdateBalanceComponent implements OnInit {
  /**
   * Реактивная форма пополнения баланса.
   */
  updateBalanceForm: FormGroup;

  /**
   * Отслеживаемый пользователь.
   */
  user: Observable<User | null>;

  /**
   * Идентификатор пользователя.
   */
  idUser: string | undefined;

  /**
   * Компонент пополнения баланса.
   * @param formBuilder - Строитель форм.
   * @param updateBalanceService - Сервис для работы с пополнением баланса.
   * @param usersService - Сервис для работы с пользователем.
   * @param toastService - Сервис для работы с уведомлениями.
   */
  constructor(private formBuilder: FormBuilder,
              private updateBalanceService: UpdateBalanceService,
              private usersService: UsersService,
              private toastService: NgToastService) {
  }

  /**
   * Инициализация компонента.
   */
  ngOnInit(): void {
    this.updateBalanceForm = this.formBuilder.group({
      refillAmount: ['', [Validators.required, Validators.min(50)]]
    });
    this.user = this.usersService.getObservableUser().pipe(tap(value => this.idUser = value?.id));
  }

  /**
   * Пополнение баланса.
   */
  replenishBalance() {
    if (this.updateBalanceForm.invalid || this.idUser === undefined) {
      CustomValidators.allFormFieldsValidate(this.updateBalanceForm);

      return;
    }

    const sum = this.updateBalanceForm.controls['refillAmount'].value;

    this.updateBalanceService.updateBalanceUser(this.idUser, sum).subscribe(
      {
        next: value => {
          this.usersService.setUserOrNull(value)
        },
        error: (_) => {
          this.toastService.error(
            {
              detail: UpdateBalanceErrorMessages.Header,
              summary: UpdateBalanceErrorMessages.IncorrectSum,
              duration: 5000
            });
        }
      });

    this.updateBalanceForm.controls['refillAmount'].reset();
  }

  /**
   * Закрытие окна с пополнением баланса.
   */
  closeWindowUpdateBalance() {
    this.updateBalanceService.closeWindowUpdateBalance();
  }
}
