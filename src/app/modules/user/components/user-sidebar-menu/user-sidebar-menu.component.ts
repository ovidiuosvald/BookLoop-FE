import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';

import { UserService } from 'src/app/services/user.service';
import { LogoutDialogComponent } from 'src/app/shared-components/logout-dialog/logout-dialog.component';

@Component({
  selector: 'app-user-sidebar-menu',
  templateUrl: './user-sidebar-menu.component.html',
  styleUrls: ['./user-sidebar-menu.component.scss'],
})
export class UserSidebarMenuComponent {
  constructor(
    private readonly dialog: MatDialog,
    private readonly userService: UserService,
  ) {}

  openLogoutDialog(): void {
    const dialogRef = this.dialog.open(LogoutDialogComponent, {
      width: '420px',
      maxWidth: 'calc(100vw - 32px)',
      autoFocus: false,
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed: boolean | undefined) => {
        if (confirmed) {
          this.userService.logoutUsingPOST();
        }
      });
  }
}
