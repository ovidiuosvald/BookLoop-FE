import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { UserRole } from 'src/app/enums/user-role.enum';
import { UserInterface } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-role-dialog',
  templateUrl: './user-role-dialog.component.html',
  styleUrls: ['./user-role-dialog.component.scss'],
})
export class UserRoleDialogComponent implements OnInit {
  roleForm!: FormGroup;

  readonly roles = [
    {
      value: UserRole.User,
      label: 'Utilizator',
    },
    {
      value: UserRole.Admin,
      label: 'Administrator',
    },
  ];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<UserRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public readonly data: {
      user: UserInterface;
    },
  ) {}

  ngOnInit(): void {
    this.roleForm = this.formBuilder.group({
      role: [this.data.user.role ?? UserRole.User, Validators.required],
    });
  }

  get userFullName(): string {
    return [this.data.user.firstName, this.data.user.lastName]
      .filter(Boolean)
      .join(' ');
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close({
      role: this.roleForm.getRawValue().role as UserRole,
    });
  }
}
