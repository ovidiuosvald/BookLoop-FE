import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { UserService } from 'src/app/services/user.service';
import { DialogBoxConfirmationComponent } from 'src/app/shared-components/dialog-box-confirmation/dialog-box-confirmation.component';

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
    const dialogRef = this.dialog.open(DialogBoxConfirmationComponent, {
      data: {
        message: 'Are you sure you want to log out?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.userService.logoutUsingPOST();
      }
    });
  }
}
