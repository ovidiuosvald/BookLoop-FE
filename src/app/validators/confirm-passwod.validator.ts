import { FormGroup } from '@angular/forms';

export function confirmPasswordValidator(
  password: string,
  confirmPassword: string,
  shouldBeEqual: boolean = true
) {
  return (group: FormGroup): { [key: string]: any } | null => {
    let pass = group.controls[password];

    let confirmPass = group.controls[confirmPassword];

    if (!pass?.value || !confirmPass?.value) {
      return null;
    }

    if (showError(pass.value, confirmPass.value, shouldBeEqual)) {
      confirmPass.setErrors({ comparePasswords: 'Wrong Password' });

      confirmPass.markAsDirty();

      return { comparePasswords: 'Wrong Password!' };
    }

    confirmPass.setErrors(null);

    return null;
  };

  function showError(
    password: string,
    confirmPassword: string,
    shouldBeEqual: boolean
  ) {
    return shouldBeEqual
      ? password !== confirmPassword
      : password === confirmPassword;
  }
}
