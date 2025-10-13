import { AbstractControl, FormControl, NgControlStatus } from '@angular/forms';

export function noSpacesValidator(control: AbstractControl) {
  if (!control.value) {
    return null;
  } else if ((control.value as string).indexOf(' ') >= 0) {
    control.setErrors({ noSpaces: true });
    control.markAsDirty();
    return { noSpaces: true };
  } else {
    control.setErrors(null);
    return null;
  }
}
