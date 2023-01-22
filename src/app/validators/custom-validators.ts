import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";

/**
 * Кастомная валидация.
 */
export class CustomValidators {

  /**
   * Валидация на совпадения значений.
   * @param password - Пароль.
   * @param isConfirmation - True - если пароль подтверждения - иначе false.
   */
  static passwordValidator(password: string, isConfirmation?: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.parent && isConfirmation) {
        const abstractControl = (control.parent?.controls as any)[password] as AbstractControl;
        if (abstractControl) {
          abstractControl.updateValueAndValidity();
        }

        return null;
      }

      return !!control.parent &&
      !!control.parent.value &&
      control.value ===
      (control.parent?.controls as any)[password].value
        ? null
        : {invalidPasswordConfirmation: true};
    };
  }

  /**
   * Валидация полей реактивной формы.
   * @param formGroup - Реактивная форма.
   */
  static allFormFieldsValidate(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);

      if (control instanceof FormControl) {
        control.markAsDirty({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.allFormFieldsValidate(control);
      }
    });
  }
}

