import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout-billing',
  templateUrl: './checkout-billing.component.html',
  styleUrls: ['./checkout-billing.component.scss'],
})
export class CheckoutBillingComponent {
  @Input() form!: FormGroup;

  get isCompany(): boolean {
    return this.form.get('type')?.value === 'COMPANY';
  }

  shouldShowError(controlName: string): boolean {
    const control = this.form.get(`companyDetails.${controlName}`);

    return Boolean(
      control && control.invalid && (control.touched || control.dirty),
    );
  }

  getError(controlName: string): string {
    const control = this.form.get(`companyDetails.${controlName}`);

    if (!control?.errors) {
      return '';
    }

    const labels: Record<string, string> = {
      companyName: 'Denumirea companiei',
      cui: 'CUI-ul',
      registrationNumber: 'Numărul de înregistrare',
      bank: 'Banca',
      bankAccount: 'Contul bancar',
      country: 'Țara',
      county: 'Județul',
      city: 'Orașul',
      addressLine: 'Adresa companiei',
    };

    const label = labels[controlName] ?? 'Câmpul';

    if (control.hasError('required')) {
      return `${label} este obligatoriu.`;
    }

    if (control.hasError('minlength')) {
      const requiredLength = control.getError('minlength')?.requiredLength;

      return `${label} trebuie să conțină minimum ${requiredLength} caractere.`;
    }

    if (control.hasError('maxlength')) {
      const requiredLength = control.getError('maxlength')?.requiredLength;

      return `${label} poate avea maximum ${requiredLength} caractere.`;
    }

    if (control.hasError('pattern')) {
      return this.getPatternError(controlName);
    }

    return `${label} nu este valid.`;
  }

  selectBillingType(type: 'INDIVIDUAL' | 'COMPANY'): void {
    this.form.get('type')?.setValue(type);
  }

  private getPatternError(controlName: string): string {
    switch (controlName) {
      case 'cui':
        return 'Introdu un CUI valid.';

      case 'bankAccount':
        return 'Introdu un IBAN românesc valid, fără spații.';

      default:
        return 'Valoarea introdusă nu are un format valid.';
    }
  }
}
