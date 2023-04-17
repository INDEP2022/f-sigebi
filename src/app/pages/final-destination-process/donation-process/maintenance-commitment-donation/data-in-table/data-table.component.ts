import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IRapproveDonation } from 'src/app/core/models/ms-r-approve-donation/r-approve-donation.model';
import { TvalTable1Service } from 'src/app/core/services/catalogs/tval-table1.service';
import { RapproveDonationService } from 'src/app/core/services/ms-r-approve-donation/r-approve-donation.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS_DATA_TABLE } from './columns-data-table';
import { COLUMNS_OTHER_TRANS } from './columns-other-transf';
import { COLUMNS_USER_PERMISSIONS } from './columns-user-permissions';

@Component({
  selector: 'app-data-table',
  templateUrl: 'data-table.component.html',
  styles: [],
})
export class DataTableComponent extends BasePage implements OnInit {
  @Input() type: number;

  foreignTrade: IRapproveDonation[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  params1 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems1: number = 0;

  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  data: any;

  constructor(
    private rapproveDonationService: RapproveDonationService,
    private tvalTable1Service: TvalTable1Service,
    private usersService: UsersService
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
  }

  ngOnInit(): void {
    if (this.type == 1 || this.type == 2) {
      //comercio exterior
      this.settings.columns = COLUMNS_DATA_TABLE;
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getForeignTrade());
    } else if (this.type == 3) {
      //Otros Trans
      this.settings.columns = COLUMNS_OTHER_TRANS;
      // this.data = EXAMPLE_DATA1;
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getForeignTrade());
    } else {
      //Permisos Rastreador
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getTracker());
      this.settings.columns = COLUMNS_USER_PERMISSIONS;
      this.data = EXAMPLE_DATA2;
    }
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }
  getForeignTrade() {
    this.params.getValue()['filter.labelId'] = `$eq:${this.type}`;
    this.rapproveDonationService.getAll(this.params.getValue()).subscribe({
      next: response => {
        console.log(response.data);
        this.data = response.data;
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].valid == '1') {
            console.log(this.data[i].valid);
            this.data[i].yes = 1;
            this.data[i].not = null;
          } else {
            this.data[i].yes = null;
            this.data[i].not = 1;
          }
        }
        console.log(this.data);
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        console.log(error);
        this.loading = false;
      },
    });
  }
  getTracker() {
    this.tvalTable1Service.getByIdFind(421).subscribe({
      next: response => {
        console.log(response.data);
        for (let i = 0; i < response.data.length; i++) {
          this.params.getValue()['filter.id'] = `$eq:${response.data[i].value}`;
          this.usersService.getAllSegUsers(this.params.getValue()).subscribe({
            next: response1 => {
              console.log(response1.data);
              if (response.data[i].abbreviation == 'S') {
                console.log(response.data[i].abbreviation);
                response.data[i].yes = 1;
                response.data[i].not = null;
              } else {
                response.data[i].yes = null;
                response.data[i].not = 1;
              }
              response.data[i].name = response1.data[0].name;

              if (i == response.data.length - 1) {
                this.data = response.data;
                console.log(this.data);
                this.totalItems = response.count;
                this.loading = false;
              }
            },
            error: error => {
              console.log(error);
              this.loading = false;
            },
          });
        }
      },
      error: error => {
        console.log(error);
        this.loading = false;
      },
    });
  }
  getUsers(name: string) {}
}

const EXAMPLE_DATA1 = [
  {
    tag: 'des_etiqueta',
    status: 'status',
    desStatus: 'des_status',
    transNumb: 1,
    desTrans: 'des_trans',
    clasifNumb: 2,
    desClasif: 'des_clasif',
    unit: 2,
  },
];

const EXAMPLE_DATA2 = [
  {
    user: 'AMORENOL',
    name: 'ANIBAL MORENO LUCIO',
  },
];
