import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';

import { CommonService } from 'src/app/services/common.service';
import { UserService } from 'src/app/services/user.service';
import { ConfirmationDialogComponent } from 'src/app/shared-components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-admin-container',
  templateUrl: './admin-container.component.html',
  styleUrls: ['./admin-container.component.scss'],
})
export class AdminContainerComponent {
  isSidebarCollapsed = false;

  constructor(
    private readonly dialog: MatDialog,
    private readonly userService: UserService,
    private readonly commonService: CommonService,
  ) {}

  goToStore(): void {
    this.commonService.goToHomePage();
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  goToCatalog(): void {
    this.commonService.goToHomePage();
  }

  openLogoutDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '420px',
      maxWidth: 'calc(100vw - 32px)',
      autoFocus: false,
      disableClose: true,
      panelClass: 'confirmation-dialog-panel',
      data: {
        title: 'Delogare',
        message: 'Sigur dorești să te deloghezi din cont?',
        confirmText: 'Delogare',
        cancelText: 'Anulează',
        confirmIcon: 'logout',
        type: 'danger',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed: boolean | undefined) => {
        if (confirmed) {
          this.userService.logout();
        }
      });
  }
}
