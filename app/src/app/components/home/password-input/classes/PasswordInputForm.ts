import { FormGroup, FormControl, ValidatorFn, AbstractControl, Validators, ValidationErrors } from '@angular/forms';

import { PasswordStrengthMeterDirective } from '../password-strength-meter/password-strength-meter.directive';

function fieldCompareValidator(form: FormGroup): ValidationErrors | null {
  return form.get('password').value !== form.get('passwordConfirm').value
    ? { mismatch: true }
    : null;
}

/**
 * Provides convenience methods to work with the PasswordInput Form
 */
export class PasswordInputForm extends FormGroup {
  private passwordStrengthMeter: PasswordStrengthMeterDirective;

  constructor(passwordStrengthMeter: PasswordStrengthMeterDirective) {
    const controls = {
      password: new FormControl('', Validators.required),
      passwordConfirm: new FormControl(''),
      passwordVisible: new FormControl(false)
    };

    super(controls, fieldCompareValidator);

    this.passwordStrengthMeter = passwordStrengthMeter;
  }

  public get password(): FormControl { return this.get('password') as FormControl; }
  public get passwordValue(): string { return this.password.value; }

  public get passwordConfirm(): FormControl { return this.get('passwordConfirm') as FormControl; }
  public get passwordStrength(): number { return this.passwordStrengthMeter.passwordStrength; }
  public get passwordVisible(): boolean { return this.get('passwordVisible').value; }

  public disablePasswordConfirm(): void {
    this.clearValidators();
    this.passwordConfirm.setValue('');
    this.passwordConfirm.disable();
  }

  public enablePasswordConfirm(): void {
    this.passwordConfirm.enable();
    this.passwordConfirm.setValue(this.passwordValue);
    this.setValidators(fieldCompareValidator);
  }

  public updatePasswordStrength(): void {
    this.passwordStrengthMeter.updatePasswordStrength();
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

  public markChildrenAsPristine(): void {
    const controls = this.controls;

    for (const controlName in controls) {
      if (controls.hasOwnProperty(controlName)) {
        const control = this.get(controlName);
        control.markAsPristine({ onlySelf: true });
      }
    }

    super.markAsPristine();
  }
}
