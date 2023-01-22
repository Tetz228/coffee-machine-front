import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {SignUpService} from "../../services/sign-up.service";
import {CustomValidators} from "../../validators/custom-validators";

import {HttpErrorResponse} from "@angular/common/http";
import {GeneralErrorMessages} from "../../error-messages/general-error-messages";
import {SignUpErrorMessages} from "../../error-messages/sign-up-error-messages";
import {SignUp} from "../../models/sign-up";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

/**
 * Компонент регистрации.
 */
export class SignUpComponent implements OnInit {
  /**
   * Реактивная форма регистрации.
   */
  signUpForm: FormGroup;

  /**
   * Компонент авторизации.
   * @param formBuilder - Строитель реактивных форм.
   * @param router - Сервис для работы с навигацией.
   * @param signUpService - Сервис для работы с регистрацией.
   * @param toastService - Сервис для работы с уведомлениями.
   */
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private signUpService: SignUpService,
              private toastService: NgToastService) {
  }

  /**
   * Инициализация компонента.
   */
  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      login: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30),
        CustomValidators.passwordValidator('passwordConfirmation', true)]],
      passwordConfirmation: ['', [CustomValidators.passwordValidator('password')]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]]
    });
  }

  /**
   * Регистрация пользователя.
   */
  signUp() {
    if (this.signUpForm.invalid) {
      CustomValidators.allFormFieldsValidate(this.signUpForm);

      this.toastService.error(
        {
          detail: GeneralErrorMessages.Header,
          summary: GeneralErrorMessages.IncorrectData,
          duration: 5000
        });
      return;
    }

    const user: SignUp = {
      login: this.signUpForm.controls['login'].value,
      password: this.signUpForm.controls['password'].value,
      name: this.signUpForm.controls['name'].value
    };

    this.signUpService.addUser(user).subscribe({
      next: () => this.router.navigate(['login']),
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.status === 400) {
          this.toastService.error(
            {
              detail: SignUpErrorMessages.Header,
              summary: SignUpErrorMessages.LoginExist,
              duration: 5000
            });
        }
      }
    });
  }

  /**
   * Перейти к кофе.
   */
  navigateOnCoffees() {
    this.router.navigate(['coffees']);
  }
}
