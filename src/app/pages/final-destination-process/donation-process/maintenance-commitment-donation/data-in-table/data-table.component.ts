import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IRapproveDonation } from 'src/app/core/models/ms-r-approve-donation/r-approve-donation.model';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { TvalTable1Service } from 'src/app/core/services/catalogs/tval-table1.service';
import { DynamicCatalogsService } from 'src/app/core/services/dynamic-catalogs/dynamiccatalog.service';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
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

  columnFilters: any = [];

  constructor(
    private rapproveDonationService: RapproveDonationService,
    private tvalTable1Service: TvalTable1Service,
    private usersService: UsersService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private dynamicCatalogsService: DynamicCatalogsService,
    private goodSssubtypeService: GoodSssubtypeService,
    private donationService: DonationService
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
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...COLUMNS_DATA_TABLE },
    };
  }
  ngOnInit(): void {
    if (this.type == 1 || this.type == 2) {
      //comercio exterior
      this.filterComerAndDeli();
      this.settings.columns = COLUMNS_DATA_TABLE;
    } else if (this.type == 3) {
      //Otros Trans
      this.filterOtrosTrans();
      this.settings.columns = COLUMNS_OTHER_TRANS;
    } else {
      //Permisos Rastreador
      this.filterPermis();
      this.settings.columns = COLUMNS_USER_PERMISSIONS;
    }
  }

  filterComerAndDeli() {
    this.dataTable1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        //console.log('change - ', change);
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'labelId':
                field = 'filter.label.description';
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'type':
                searchFilter = SearchFilter.EQ;
                break;
              case 'status':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'desStatus':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'transfereeId':
                console.log('-- enttra --');
                field = 'filter.transfereeId.transferentId';
                searchFilter = SearchFilter.EQ;
                break;
              case 'desTrans':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'clasifId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'desClasif':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'unit':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'yes' || 'not':
                searchFilter = SearchFilter.IN;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              if (['yes', 'not'].includes(filter.field)) {
                if (filter.field == 'not') {
                  if (!filter.search) {
                    this.columnFilters[field] = '1';
                  } else {
                    this.columnFilters[field] = '0';
                  }
                } else {
                  if (!filter.search) {
                    this.columnFilters[field] = '0';
                  } else {
                    this.columnFilters[field] = '1';
                  }
                }
              } else {
                this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              }
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          console.log(' this.params ', this.params);
          this.getForeignTrade();
        }
      });

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getForeignTrade();
    });
  }

  filterOtrosTrans() {
    this.dataTable1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        //console.log('change - ', change);
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'labelId':
                field = 'filter.label.description';
                searchFilter = SearchFilter.EQ;
                break;
              case 'type':
                searchFilter = SearchFilter.EQ;
                break;
              case 'status':
                //console.log("ESTATUS -> ");
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'desStatus':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'transfereeId':
                field = 'filter.transfereeId.transferentId';
                searchFilter = SearchFilter.EQ;
                break;
              case 'desTrans':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'clasifId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'desClasif':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'unit':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'amount':
                searchFilter = SearchFilter.EQ;
                break;
              case 'yes' || 'not':
                searchFilter = SearchFilter.IN;
                break;

              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              if (['yes', 'not'].includes(filter.field)) {
                if (filter.field == 'not') {
                  if (!filter.search) {
                    this.columnFilters[field] = '1';
                  } else {
                    this.columnFilters[field] = '0';
                  }
                } else {
                  if (!filter.search) {
                    this.columnFilters[field] = '0';
                  } else {
                    this.columnFilters[field] = '1';
                  }
                }
              } else {
                this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              }
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          console.log(' this.params ', this.params);
          this.getForeignTrade();
        }
      });

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getForeignTrade();
    });
  }

  filterPermis() {
    this.dataTable1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        //console.log('change - ', change);
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'otvalor':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'name':
                field = `filter.segUser.name`;
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              if (['yes', 'not'].includes(filter.field)) {
                if (filter.field == 'not') {
                  if (!filter.search) {
                    this.columnFilters[field] = 'S';
                  } else {
                    this.columnFilters[field] = 'N';
                  }
                } else {
                  if (!filter.search) {
                    this.columnFilters[field] = 'N';
                  } else {
                    this.columnFilters[field] = 'S';
                  }
                }
              } else {
                this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              }
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          console.log(' this.params ', this.params);
          this.getTracker();
        }
      });

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getTracker();
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }
  getForeignTrade() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    params['filter.ruleId'] = `$eq:${this.type}`;

    if (params['filter.yes'] || params['filter.not']) {
      let arr = [];
      if (params['filter.yes']) arr.push(params['filter.yes']);
      if (params['filter.not']) arr.push(params['filter.not']);

      delete params['filter.yes'];
      delete params['filter.not'];

      params['filter.valid'] = `$in:${arr.join(',')}`;
    } else {
      delete params['filter.valid'];
    }

    console.log('params 1 -> ', params);
    this.rapproveDonationService.getAllT(params).subscribe({
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
          this.data[i].transfereeId =
            response.data[i].transfereeId.transferentId;
        }
        this.dataTable1.load(response.data);
        this.dataTable1.refresh();
        console.log('data after ', this.data);
        this.totalItems = response.count;
        this.loading = false;
        console.log('primer tabla dataTable1 -> ', this.dataTable1);
      },
      error: error => {
        console.log(error);
        this.dataTable1.load([]);
        this.dataTable1.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  getTracker() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    if (params['filter.yes'] || params['filter.not']) {
      let arr = [];
      if (params['filter.yes']) arr.push(params['filter.yes']);
      if (params['filter.not']) arr.push(params['filter.not']);

      delete params['filter.yes'];
      delete params['filter.not'];

      params['filter.abbreviation'] = `$in:${arr.join(',')}`;
    } else {
      delete params['filter.abbreviation'];
    }
    this.tvalTable1Service.getAlls2(params).subscribe({
      next: response => {
        console.log('data tracer ', response);
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].abbreviation == 'S') {
            console.log(response.data[i].abbreviation);
            response.data[i].yes = 1;
            response.data[i].not = null;
          } else {
            response.data[i].yes = null;
            response.data[i].not = 1;
          }
          response.data[i].name = response.data[i].segUser.name;
          if (i == response.data.length - 1) {
            this.data = response.data;
            //console.log('this DATA -->', this.data);
            this.dataTable1.load(response.data);
            this.dataTable1.refresh();
            this.totalItem4 = response.count || 0;
            console.log('getAllSegUsers: ', this.totalItem4);
            this.loading = false;
          }
        }
      },
      error: error => {
        console.log('error ', error);
        this.loading = false;
      },
    });
  }

  getUsers(name: string) {}

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
    const modalConfig = {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered modal-lg',
    };
    modalConfig.initialState = {
      newOrEdit,
      data,
      type,
      callback: (next: boolean, case1?: boolean) => {
        if (case1 == true) {
          this.getTracker();
        } else if (next) {
          this.getForeignTrade();
        }
      },
    };
    this.modalService.show(
      MaintenanceCommitmentDonationModalComponent,
      modalConfig
    );
  }

  descClasif(numb: any) {
    if (!numb) return null;
    const params = new FilterParams();

    params.page = 1;
    params.limit = 1;

    params.addFilter('numClasifGoods', numb, SearchFilter.EQ);
    // params.addFilter('no_cuenta', lparams.text);
    return new Promise((resolve, reject) => {
      // getById
      this.goodSssubtypeService.getFilter(params.getParams()).subscribe({
        next: data => {
          resolve(data.data[0].description);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  deleteAlert(data: any, filter: any) {
    console.log('data', data);
    this.alertQuestion(
      'question',
      'Se eliminará el registro',
      '¿Desea continuar?'
    ).then(question => {
      if (question.isConfirmed) {
        if (filter == 4) {
          const model = {} as any;
          (model.nmtable = 421), (model.otkey = Number(data.otkey));
          model.otvalor = data.value;
          model.registerNumber = 0;
          model.abbreviation = data.valid;

          console.log('data update 4-> ', model);

          this.dynamicCatalogsService.deleteTvalTable1(model).subscribe({
            next: data => {
              this.alert(
                'success',
                'Permiso a usuario eliminado correctamente',
                ''
              );
              this.getTracker();
            },
            error: err => {
              let error = '';
              this.alert(
                'error',
                'Ha ocurrido un error al intentar eliminar el permiso a usuario',
                error
              );
            },
          });
        } else {
          const model = {} as any;
          model.labelId = Number(data.labelId.id);
          model.status = data.status;
          // model.desStatus = data.desStatus;
          model.transfereeId = Number(data.transfereeId);
          // model.desTrans = data.keyCode;
          model.clasifId = Number(data.clasifId);
          // model.desClasif = data.desClasif;
          model.unit = data.unit;
          model.ruleId = Number(data.ruleId);
          model.valid = Number(data.valid);
          this.donationService.deleteApproveDonation(model).subscribe({
            next: data => {
              this.alert('success', 'Registro eliminado correctamente', '');
              this.getForeignTrade();
            },
            error: err => {
              let error = '';
              this.alert(
                'error',
                'Ha ocurrido un error al intentar eliminar el registro',
                error
              );
            },
          });
        }
      }
    });
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
