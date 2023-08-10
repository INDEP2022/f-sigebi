import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ISegProfile } from 'src/app/core/models/catalogs/profile-maintenance.model';
import { ISegProfileXPant } from 'src/app/core/models/catalogs/profile-traking-x-pant';
import { ProfileMaintenanceService } from 'src/app/core/services/catalogs/profile-maintenance.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ProfileMaintenanceFormProfileComponent } from '../profile-maintenance-form-profile/profile-maintenance-form-profile.component';
import { ProfileMaintenanceFormComponent } from '../profile-maintenance-form/profile-maintenance-form.component';
import { COLUMNS_I, COLUMNS_PERFIL } from './columns';

@Component({
  selector: 'app-profile-maintenance',
  templateUrl: './profile-maintenance.component.html',
  styles: [],
})
export class ProfileMaintenanceComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  totalItems2: number = 0;
  settings2 = { ...this.settings };
  settings1 = { ...this.settings };
  segProfile: ISegProfile[] = [];
  screenProfile: any[] = [];
  columnFilters: any = [];
  columnFilters1: any = [];
  data: LocalDataSource = new LocalDataSource();
  data1: LocalDataSource = new LocalDataSource();
  profileText: string;
  profileAccessScreen: boolean = false;
  constructor(
    private profileMaintenanceService: ProfileMaintenanceService,
    private modalService: BsModalService
  ) {
    super();
    this.settings1 = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: { ...COLUMNS_I },
    };

    this.settings2 = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: { ...COLUMNS_PERFIL },
    };

    //this.settings1.actions = false;
    //this.settings2.actions = false;
  }
  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'profile':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getValuesAll();
        }
      });
    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'profile':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters1[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters1[field];
            }
          });
          this.params2 = this.pageFilter(this.params2);
          this.getAccessScreen();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getValuesAll());
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAccessScreen());
  }
  getValuesAll() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.profileMaintenanceService.getAll(params).subscribe({
      next: response => {
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }

  selectTable(event: any) {
    this.profileAccessScreen = true;
    this.profileText = event.data.profile;
    //console.log(event.data.profile);
    this.getAccessScreen(event.data.profile);
  }

  getAccessScreen(id?: string) {
    this.loading = true;
    if (id) {
      this.params2.getValue()['filter.profile'] = id;
    }
    let params = {
      ...this.params2.getValue(),
      ...this.columnFilters1,
    };
    this.profileMaintenanceService.getAllProfileXPant(params).subscribe({
      next: response => {
        this.totalItems2 = response.count || 0;
        this.data1.load(response.data);
        this.data1.refresh();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data1.load([]);
        this.data1.refresh();
        this.totalItems2 = 0;
      },
    });
  }

  openForm(event?: any) {
    const data = event != null ? event.data : null;
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean) => {
          if (next) {
            this.params
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getValuesAll());
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ProfileMaintenanceFormProfileComponent, config);
  }

  openForm1(event?: any) {
    const data = event != null ? event.data : null;
    const profile = this.profileText;
    let config: ModalOptions = {
      initialState: {
        data,
        profile,
        callback: (next: boolean) => {
          if (next) {
            this.params
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getAccessScreen());
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ProfileMaintenanceFormComponent, config);
  }

  showDeleteAlert(segProfile?: ISegProfile) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        console.log(segProfile.profile);
        this.delete(segProfile.profile);
      }
    });
  }

  delete(profile: string | number) {
    this.profileMaintenanceService.remove(profile).subscribe({
      next: () => {
        this.getValuesAll();
        this.alert(
          'success',
          'Mantenimiento a Perfil',
          'Borrado Correctamente'
        );
      },
      error: error => {
        this.alert(
          'warning',
          'Relación de Mantenimiento a Perfil',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }

  showDeleteAlert1(segProfileXPant?: ISegProfileXPant) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        console.log(segProfileXPant);
        this.delete1(segProfileXPant);
      }
    });
  }

  delete1(rAsuntDic?: ISegProfileXPant) {
    /*this.profileMaintenanceService.remove(rAsuntDic).subscribe({
      next: () => {
        this.getRAsuntDic();
        this.alert('success', 'Dictamen', 'Borrado Correctamente');
      },
      error: error => {
        this.alert(
          'warning',
          'Relación de asunto dictamen',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });*/
  }
}
