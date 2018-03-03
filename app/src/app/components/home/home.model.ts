import { FormControl, FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';
import { PasswordStrengthMeterDirective } from './password-strength-meter/password-strength-meter.directive';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators/filter';

export class HomeModel extends FormGroup {

  constructor(source: FormGroup, private passwordStrengthMeter: PasswordStrengthMeterDirective) {
    super(source.controls, source.validator);
  }

  public get fileName(): FormControl { return this.get('fileName') as FormControl; }
  public get fileNameValue(): string { return this.fileName.value; }
  public get fileNameStatusChanges(): Observable<any> {
    return this.fileName.statusChanges
      .pipe(filter(status => status !== 'PENDING'));
  }

  public get password(): FormControl { return this.get('password') as FormControl; }
  public get passwordValue(): string { return this.password.value; }

  public get passwordConfirm(): FormControl { return this.get('passwordConfirm') as FormControl; }
  public get passwordStrength(): number { return this.passwordStrengthMeter.passwordStrength; }
  public get passwordVisible(): boolean { return this.get('passwordVisible').value; }

  public reset(value?: any, options?: { onlySelf?: boolean, emitEvent?: boolean }): void {
    super.reset(value, options);
    this.updatePasswordStrength();
  }

  public disablePasswordConfirm(): void {
    this.clearValidators();
    this.passwordConfirm.setValue('');
    this.passwordConfirm.disable();
  }

  public enablePasswordConfirm(value: string, newValidator: ValidatorFn): void {
    this.passwordConfirm.enable();
    this.passwordConfirm.setValue(value);
    this.setValidators(newValidator);
  }

  public markFileNameAsDirty(): void {
    this.fileName.markAsDirty();
  }

  public setFileNameErrors(errors: ValidationErrors | null, opts?: { emitEvent?: boolean; }): void {
    this.fileName.setErrors(errors, opts);
  }

  public updatePasswordStrength(): void {
    this.passwordStrengthMeter.updatePasswordStrength();
  }
}
