import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {SignInService} from "../../services/sign-in.service";
import {HttpErrorResponse} from "@angular/common/http";
import {CustomValidators} from "../../validators/custom-validators";
import {UsersService} from "../../services/users.service";
import {GeneralErrorMessages} from "../../error-messages/general-error-messages";
import {SignInErrorMessages} from "../../error-messages/sign-in-error-messages";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

/**
 * Компонент авторизации.
 */
export class SignInComponent implements OnInit {
  /**
   * Реактивная форма авторизации.
   */
  loginForm: FormGroup;

  /**
   * Компонент авторизации.
   * @param formBuilder - Строитель реактивных форм.
   * @param router - Сервис для работы с навигацией.
   * @param signInService - Сервис для работы с авторизацией.
   * @param usersService - Сервис для работы с пользователем.
   * @param toastService - Сервис для работы с уведомлениями.
   */
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private signInService: SignInService,
              private usersService: UsersService,
              private toastService: NgToastService) {
  }

  /**
   * Инициализация компонента.
   */
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      login: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]]
    });
  }

  /**
   * Авторизация пользователя.
   */
  loginUser() {
    if (this.loginForm.invalid) {
      CustomValidators.allFormFieldsValidate(this.loginForm);

      this.toastService.error(
        {
          detail: GeneralErrorMessages.Header,
          summary: GeneralErrorMessages.IncorrectData,
          duration: 5000
        });

      return;
    }

    this.signInService.loginUser(this.loginForm.value).subscribe({
      next: () => {
        this.usersService.getAuthenticatedUser()?.subscribe()

        this.navigateOnCoffees();
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.status === 401) {
          this.toastService.error(
            {
              detail: SignInErrorMessages.Header,
              summary: SignInErrorMessages.InvalidLoginOrPassword,
              duration: 5000
            });
        }
      }
    });
  }

  /**
   * Перейти к списку кофе.
   */
  navigateOnCoffees() {
    this.router.navigate(['coffees']);
  }
}
