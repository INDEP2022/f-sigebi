import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IAccountMovement } from 'src/app/core/models/ms-account-movements/account-movement.model';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { GoodsJobManagementService } from 'src/app/core/services/ms-office-management/goods-job-management.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { TEXT_CHANGE_COLUMNS } from './tablaModalColumns';

@Component({
  selector: 'app-tabla-oficio-modal',
  templateUrl: './tabla-oficio-modal.component.html',
  styles: [],
})
export class TablaOficioModalComponent extends BasePage implements OnInit {
  dataAcount: IListResponse<IAccountMovement> =
    {} as IListResponse<IAccountMovement>;
  filterParams: BehaviorSubject<FilterParams>;
  form: FormGroup = new FormGroup({});
  title: string;
  data: any[] = [];
  totalItems: number = 0;
  /********    filtros tabla   ******************/
  columns: any[] = [];
  dataLocal: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());

  /********    filtros tabla   ******************/

  fieldsToSearch = [
    {
      field: 'Expediente',
    },
    {
      field: 'Gestión',
    },
    {
      field: 'Dictaminación',
    },
    {
      field: 'Volante',
    },
    {
      field: 'Clave',
    },

    {
      field: 'expedientNumber',
      nestedObjField: 'Expediente',
    },
    {
      field: 'id',
      nestedObjField: 'Gestión',
    },
    {
      field: 'statusDict',
      nestedObjField: 'Dictaminación',
    },
    {
      field: 'wheelNumber',
      nestedObjField: 'Volante',
    },
    {
      field: 'passOfficeArmy',
      nestedObjField: 'Clave',
    },
  ];

  status: number;
  OficioOrdictamen: BehaviorSubject<FilterParams>;
  dataOficio: any;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private dictationService: DictationService,
    private serviceOficces: GoodsJobManagementService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('status => ' + this.status);
    // if (this.status == 1) {
    //   this.settings = {
    //     ...this.settings,
    //     hideSubHeader: false,
    //     actions: false,
    //     // edit: {
    //     //   editButtonContent: '<i class="fa fa-trash" aria-hidden="true"></i>',
    //     // },
    //     columns: { ...TEXT_CHANGE_COLUMNS_OFICIO },
    //   };
    // } else {
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      //add:{editButtonContent:'<i class="fa fa-trash" aria-hidden="true"></i>' },
      columns: { ...TEXT_CHANGE_COLUMNS },
    };
    // }

    // if (this.status == 1) {
    //   this.title = '  Seleccione el número de oficio';
    //   this.OficioOrdictamen.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
    //     this.onEnterSearch();
    //   });

    //   this.dataLocal
    //     .onChanged()
    //     .pipe(takeUntil(this.$unSubscribe))
    //     .subscribe(change => {
    //       if (change.action === 'filter') {
    //         let filters = change.filter.filters;
    //         filters.map((filter: any) => {
    //           let field = ``;
    //           let searchFilter = SearchFilter.ILIKE;
    //           /*SPECIFIC CASES*/
    //           field = `filter.${filter.field}`;
    //           switch (filter.field) {
    //             case 'proceedingsNumber':
    //               searchFilter = SearchFilter.ILIKE;
    //               break;
    //             case 'managementNumber':
    //               searchFilter = SearchFilter.ILIKE;
    //               break;
    //             case 'flyerNumber':
    //               searchFilter = SearchFilter.ILIKE;
    //               break;
    //             case 'cveManagement':
    //               searchFilter = SearchFilter.ILIKE;
    //               break;
    //             case 'recordNumber':
    //               searchFilter = SearchFilter.ILIKE;
    //               break;
    //             default:
    //               searchFilter = SearchFilter.ILIKE;
    //               break;
    //           }
    //           if (filter.search !== '') {
    //             this.columnFilters[field] = `${searchFilter}:${filter.search}`;
    //           } else {
    //             delete this.columnFilters[field];
    //           }
    //         });
    //         this.getAttributesFinancialInfo();
    //       }
    //     });
    //   this.params
    //     .pipe(takeUntil(this.$unSubscribe))
    //     .subscribe(() => this.getAttributesFinancialInfo());
    // } else {

    this.title = '  Seleccione el dictamen';
    this.OficioOrdictamen.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.lookDictamenesByDictamens();
    });

    this.dataLocal
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'expedientNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'statusDict':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'wheelNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'passOfficeArmy':
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
          this.getAttributesFinancialInfo();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAttributesFinancialInfo());
    // }
  }

  getAttributesFinancialInfo() {
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
  }

  close() {
    this.modalRef.hide();
  }

  getDataColumnValue(event: any) {
    // this.handleSuccess(event);
    this.modalRef.hide();
  }

  getDataColumn(event: any) {
    this.dataOficio = event;
    // this.handleSuccess(event);
    // this.modalRef.hide();
  }

  lookDictamenesByDictamens() {
    this.loading = true;
    this.dictationService
      .findByIdsOficNum(this.OficioOrdictamen.getValue().getParams())
      .subscribe({
        next: resp => {
          console.log('lookDictamenesByDictamens this.data => ' + resp);
          //  this.data = resp.data;
          this.columns = resp.data;
          this.totalItems = resp.count || 0;

          this.dataLocal.load(this.columns);
          this.dataLocal.refresh();
          this.loading = false;
        },
        error: err => {
          this.loading = false;
          console.log('lookDictamenesByDictamens this.data => ' + err);
          this.onLoadToast('error', 'error', 'No existen registros ');
        },
      });
  }

  handleSuccess() {
    this.modalRef.content.callback(this.dataOficio);
    this.modalRef.hide();
  }

  onEnterSearch() {
    console.log(
      'onEnterSearch => ' + this.OficioOrdictamen.getValue().getParams()
    );

    console.log('onEnterSearch => ');
    this.serviceOficces
      .getAllOfficialDocument(this.OficioOrdictamen.getValue().getParams())
      .subscribe({
        next: resp => {
          console.log('lookDictamenesByDictamens this.data => ' + resp);
          //  this.data = resp.data;
          this.columns = resp.data;
          this.totalItems = resp.count || 0;

          this.dataLocal.load(this.columns);
          this.dataLocal.refresh();
          this.loading = false;
        },
        error: err => {
          this.loading = false;
          console.log('lookDictamenesByDictamens this.data => ' + err);
          this.onLoadToast('error', 'error', 'No existen registros ');
        },
      });
  }
}
