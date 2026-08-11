import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { UserInterface } from 'src/app/models/user.model';
import { PageResponse } from 'src/app/models/page-response.model';
import { AdminService } from 'src/app/services/admin.service';
import { CommonService } from 'src/app/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';

import { UserRole } from 'src/app/enums/user-role.enum';
import { UserRoleDialogComponent } from '../user-role-dialog/user-role-dialog.component';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent implements OnInit, OnDestroy {
  users: UserInterface[] = [];

  searchControl = new FormControl('');

  isLoading = true;

  pageIndex = 0;
  pageSize = 10;
  totalElements = 0;

  sortBy = 'firstName';
  sortDirection: 'asc' | 'desc' = 'asc';

  readonly pageSizeOptions = [5, 10, 20, 50];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly dialog: MatDialog,
    private readonly adminService: AdminService,
    private readonly commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.listenToSearchChanges();
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openRoleDialog(user: UserInterface): void {
    const dialogRef = this.dialog.open(UserRoleDialogComponent, {
      width: '460px',
      maxWidth: 'calc(100vw - 32px)',
      autoFocus: false,
      disableClose: true,
      data: {
        user,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result?: { role: UserRole }) => {
        if (!result || result.role === user.role || !user.userId) {
          return;
        }

        this.updateUserRole(user, result.role);
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.loadUsers();
  }

  onSortChange(sort: Sort): void {
    if (!sort.active || !sort.direction) {
      this.sortBy = 'firstName';
      this.sortDirection = 'asc';
    } else {
      this.sortBy = sort.active;
      this.sortDirection = sort.direction === 'desc' ? 'desc' : 'asc';
    }

    this.pageIndex = 0;

    this.loadUsers();
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  getFullName(user: UserInterface): string {
    return [user.firstName, user.lastName].filter(Boolean).join(' ');
  }

  getInitials(user: UserInterface): string {
    const firstInitial = user.firstName?.trim().charAt(0).toUpperCase() ?? '';

    const lastInitial = user.lastName?.trim().charAt(0).toUpperCase() ?? '';

    return `${firstInitial}${lastInitial}` || '?';
  }

  getRoleLabel(user: UserInterface): string {
    if (!user.role) {
      return '-';
    }

    return user.role === 'ADMIN' ? 'Administrator' : 'Utilizator';
  }

  getRoleClass(user: UserInterface): string {
    return user.role === 'ADMIN' ? 'admin-role' : 'user-role';
  }

  trackByUserId(index: number, user: UserInterface): number | undefined {
    return user.userId;
  }

  private listenToSearchChanges(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.pageIndex = 0;
        this.loadUsers();
      });
  }

  private loadUsers(): void {
    this.isLoading = true;

    this.adminService
      .getUsers(
        this.searchControl.value ?? '',
        this.pageIndex,
        this.pageSize,
        this.sortBy,
        this.sortDirection,
      )
      .subscribe({
        next: (response: PageResponse<UserInterface>) => {
          this.users = response.content;
          this.totalElements = response.totalElements;

          this.pageIndex = response.number;
          this.pageSize = response.size;

          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;

          this.commonService.showHttpError(
            error,
            'Utilizatorii nu au putut fi încărcați.',
          );
        },
      });
  }

  private updateUserRole(user: UserInterface, role: UserRole): void {
    if (!user.userId) {
      return;
    }

    this.adminService.updateUserRole(user.userId, role).subscribe({
      next: () => {
        this.commonService.showSnackBarSuccess(
          'Rolul utilizatorului a fost actualizat.',
        );

        this.loadUsers();
      },
      error: (error: HttpErrorResponse) => {
        this.commonService.showHttpError(
          error,
          'Rolul utilizatorului nu a putut fi actualizat.',
        );
      },
    });
  }
}
