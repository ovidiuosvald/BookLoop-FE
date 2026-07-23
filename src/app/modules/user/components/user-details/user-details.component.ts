import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { UserInterface } from 'src/app/models/user.model';
import { ChangePasswordComponent } from 'src/app/modules/authentication/components/change-password/change-password.component';
import { UpdateProfileComponent } from 'src/app/modules/authentication/components/update-profile/update-profile.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent {
  readonly authenticatedUser$: Observable<UserInterface>;

  constructor(
    private readonly userService: UserService,
    private readonly dialog: MatDialog,
  ) {
    this.authenticatedUser$ = this.userService.authenticatedUser$;
  }

  openUpdateProfileDialog(user: UserInterface): void {
    const dialogRef = this.dialog.open(UpdateProfileComponent, {
      width: '680px',
      maxWidth: '95vw',
      disableClose: true,
      autoFocus: false,
      backdropClass: 'dialog-backdrop',
    });

    dialogRef.afterClosed().subscribe((updatedUser?: UserInterface) => {
      if (!updatedUser) {
        return;
      }

      this.userService.updateAuthenticatedUser(updatedUser);
    });
  }

  openChangePasswordDialog(): void {
    this.dialog.open(ChangePasswordComponent, {
      width: '540px',
      maxWidth: 'calc(100vw - 32px)',
      maxHeight: '90vh',
      autoFocus: false,
      backdropClass: 'dialog-backdrop',
    });
  }
}
