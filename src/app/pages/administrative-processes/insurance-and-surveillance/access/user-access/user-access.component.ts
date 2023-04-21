import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { USER_ACCESS_COLUMNS } from './user-access-columns';

@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styles: [],
})
export class UserAccessComponent extends BasePage implements OnInit {
  users: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(private userService: UsersService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: USER_ACCESS_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.params.subscribe(res => {
      this.getAccessUsers(res);
    });
  }

  getAccessUsers(params: ListParams): void {
    this.loading = true;
    this.userService.getAccessUsers(params).subscribe({
      next: response => {
        this.users = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
