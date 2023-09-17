import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IRapproveDonation } from 'src/app/core/models/ms-r-approve-donation/r-approve-donation.model';
import { TvalTable1Service } from 'src/app/core/services/catalogs/tval-table1.service';
import { DynamicCatalogsService } from 'src/app/core/services/dynamic-catalogs/dynamiccatalog.service';
import { RapproveDonationService } from 'src/app/core/services/ms-r-approve-donation/r-approve-donation.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { MODAL_CONFIG } from '../../../../../common/constants/modal-config';
import { MaintenanceCommitmentDonationModalComponent } from '../maintenance-commitment-donation-modal/maintenance-commitment-donation-modal.component';
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
  params4 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  data: any;
  data1: any[] = [];
  newOrEdit: boolean = false;
  form: FormGroup = new FormGroup({});
  dataTable1: LocalDataSource = new LocalDataSource();
  totalItem4: number = 0;

  constructor(
    private rapproveDonationService: RapproveDonationService,
    private tvalTable1Service: TvalTable1Service,
    private usersService: UsersService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private dynamicCatalogsService: DynamicCatalogsService
  ) {
    super();
    // this.settings = { ...this.settings, actions: false };
    // this.settings.hideSubHeader = false,
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: { ...COLUMNS_DATA_TABLE },
    };
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
      this.params4
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getTracker());
      this.settings.columns = COLUMNS_USER_PERMISSIONS;
      //this.data = EXAMPLE_DATA2;
    }
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }
  getForeignTrade() {
    this.params.getValue()['filter.labelId'] = `$eq:${this.type}`;
    this.rapproveDonationService.getAll(this.params.getValue()).subscribe({
      next: response => {
        console.log('primer tabla -> ', response.data);
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
          this.data[i].labelId = response.data[i].label;
        }

        console.log('data after ', this.data);
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        console.log(error);
        this.loading = false;
      },
    });
  }

  /* getTracker2() {
     this.tvalTable1Service.getByIdFind(421).subscribe({
       next: response => {
         console.log(response.data);
         for (let i = 0; i < response.data.length; i++) {
           this.params.getValue()['filter.id'] = `$eq:${response.data[i].value}`;
           // SERVICIO
           this.usersService.getAllSegUsers(this.params.getValue()).subscribe({
             next: response1 => {
               console.log('response1.DATA -->', response1.data);
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
                 console.log('this DATA -->', this.data);
                 this.totalItem4 = response.count;
                 console.log('getAllSegUsers: ', this.totalItems);
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
   }*/

  getTracker() {
    console.log(" getTracker ");
    const params: ListParams = {};
    params['filter.nmtable'] = '$eq:421';
    this.tvalTable1Service.getAlls(params).subscribe({
      next: response => {
        console.log("data tracer ", response);
        for (let i = 0; i < response.data.length; i++) {


          this.params.getValue()['filter.id'] = `$eq:${response.data[i].otvalor}`;
          // SERVICIO
          this.usersService.getAllSegUsers(this.params.getValue()).subscribe({
            next: response1 => {
              console.log('response1.DATA -->', response1.data);
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
                console.log('this DATA -->', this.data);
                this.totalItem4 = response.count || 0;
                console.log('getAllSegUsers: ', this.totalItem4);
                this.loading = false;
              }
            },
            error: error => {
              console.log("error tracer ", error);
              this.loading = false;
            },
          });
        }
      },
      error: error => {
        console.log("error ", error);
        this.loading = false;
      },
    });
  }


  getUsers(name: string) { }

  loadModal(bool: boolean, data: any) {
    if (data != null) {
      console.log('data send -> ', data.data);
    }
    //console.log(" this.type antes ", this.type);
    if (!bool) {
      //crear
      this.openModal(false, null, this.type);
    } else {
      //editar
      this.openModal(true, data.data, this.type);
    }
  }

  openModal(newOrEdit: boolean, data: any, type: number) {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    modalConfig.initialState = {
      newOrEdit,
      data,
      type,
      callback: (next: boolean) => {
        // if (next) { this.getForeignTrade(); this.getTracker(); };
        if (next) { this.getForeignTrade(); };
      },
    };
    this.modalService.show(
      MaintenanceCommitmentDonationModalComponent,
      modalConfig
    );
  }
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
