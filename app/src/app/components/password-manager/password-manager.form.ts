import { FormGroup, Validators, FormControl, AsyncValidatorFn } from '@angular/forms';

const DEFAULT_VALUES = {
  name: '',
  password: '',
  favorite: false,
};

export class PasswordManagerForm extends FormGroup {
  constructor(uniquePasswordNameValidator: AsyncValidatorFn) {
    const controls = {
      name: new FormControl(
        DEFAULT_VALUES.name,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
        uniquePasswordNameValidator
      ),
      password: new FormControl(
        DEFAULT_VALUES.password,
        Validators.compose([Validators.required, Validators.maxLength(32)]) // 32 max pwd ln per spec
      ),
      favorite: new FormControl(DEFAULT_VALUES.favorite)
    };

    super(controls);
  }

  public get name(): FormControl { return this.get('name') as FormControl; }
  public get nameValue(): string { return this.name.value; }

  public get password(): FormControl { return this.get('password') as FormControl; }
  public get passwordValue(): string { return this.password.value; }

  public get favorite(): FormControl { return this.get('favorite') as FormControl; }
  public get favoriteValue(): boolean { return this.favorite.value; }

  public reset(): void {
    super.reset({ }, { onlySelf: true, emitEvent: false });
  }

  public showValidation(): void {
    const controls = this.controls;

    for (const controlName in controls) {
      if (controls.hasOwnProperty(controlName)) {
        const control = this.get(controlName);
        control.markAsDirty({ onlySelf: true });
      }
    }
  }
}
