import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISegProfile } from 'src/app/core/models/catalogs/profile-maintenance.model';
import { ProfileMaintenanceService } from 'src/app/core/services/catalogs/profile-maintenance.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS_I, COLUMNS_PERFIL } from './columns';

@Component({
  selector: 'app-profile-maintenance',
  templateUrl: './profile-maintenance.component.html',
  styles: [],
})
export class ProfileMaintenanceComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  segProfile: ISegProfile[] = [];
  screenProfile: any[] = [];
  settings2 = { ...this.settings };
  constructor(private profileMaintenanceService: ProfileMaintenanceService) {
    super();
    this.settings.columns = COLUMNS_PERFIL;
    this.settings.actions = false;
    this.settings2.actions = false;
    this.settings2.columns = COLUMNS_I;
  }
  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getValuesAll());
  }
  getValuesAll() {
    this.loading = true;

    this.profileMaintenanceService.getAll(this.params.getValue()).subscribe({
      next: response => {
        console.log(response);
        this.segProfile = response.data;
        this.totalItems2 = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }
}
