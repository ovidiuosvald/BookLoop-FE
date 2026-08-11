import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, take } from 'rxjs';

// Models
import { UserInterface } from 'src/app/models/user.model';

// Components
import { ChangePasswordComponent } from 'src/app/modules/authentication/components/change-password/change-password.component';
import { UpdateProfileComponent } from 'src/app/modules/authentication/components/update-profile/update-profile.component';

// Services
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

  // =========================
  // PROFILE
  // =========================

  openUpdateProfileDialog(user: UserInterface): void {
    const dialogRef = this.dialog.open(UpdateProfileComponent, {
      width: '620px',
      maxWidth: 'calc(100vw - 32px)',
      maxHeight: '90vh',
      autoFocus: false,
      disableClose: true,
      data: user,
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((updatedUser: UserInterface | undefined) => {
        if (!updatedUser) {
          return;
        }

        this.userService.updateAuthenticatedUser(updatedUser);
      });
  }

  // =========================
  // PASSWORD
  // =========================

  openChangePasswordDialog(): void {
    this.dialog.open(ChangePasswordComponent, {
      width: '540px',
      maxWidth: 'calc(100vw - 32px)',
      maxHeight: '90vh',
      autoFocus: false,
      disableClose: true,
    });
  }
}
