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
import { BasePage } from 'src/app/core/shared/base-page';
import { TEXT_CHANGE_COLUMNS } from './tablaModalColumns';

@Component({
  selector: 'app-textModal-table',
  templateUrl: './tablaModal-component.html',
})
export class tablaModalComponent extends BasePage implements OnInit {
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

  OficioOrdictamen: boolean;
  filterParamsOficio: BehaviorSubject<FilterParams>;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private dictationService: DictationService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Sel.',
        edit: true,
        delete: false,
        add: false,
        position: 'left',
      },
      //add:{editButtonContent:'<i class="fa fa-trash" aria-hidden="true"></i>' },
      columns: { ...TEXT_CHANGE_COLUMNS },
    };
  }

  ngOnInit(): void {
    //this.filterParamsOficioLocal = filterParamsOficio;
    if (this.OficioOrdictamen) {
      this.title = '  Seleccione el número de oficio';
      this.onEnterSearch();
    } else {
      this.title = '  Seleccione el número de expediente ';
      this.filterParams.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
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
                  searchFilter = SearchFilter.ILIKE;
                  break;
                case 'expedientNumber':
                  searchFilter = SearchFilter.ILIKE;
                  break;
                case 'statusDict':
                  searchFilter = SearchFilter.ILIKE;
                  break;
                case 'wheelNumber':
                  searchFilter = SearchFilter.ILIKE;
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
    }
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
    this.handleSuccess(event);
    this.modalRef.hide();
  }

  getDataColumn(event: any) {
    this.handleSuccess(event);
    this.modalRef.hide();
  }

  lookDictamenesByDictamens() {
    this.loading = true;
    this.dictationService
      .findByIdsOficNum(this.filterParams.getValue().getParams())
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

  handleSuccess(datos: []) {
    this.modalRef.content.callback(datos);
    this.modalRef.hide();
  }

  onEnterSearch() {
    this.dictationService
      .findByIdsOficNum(this.filterParamsOficio.getValue().getParams())
      .subscribe({
        next: resp => {
          console.log('onEnterSearch => ' + JSON.stringify(resp));
          /*
          if (resp.count > 1) {
            this.loadModal(true, filterParams);
          } else {
            this.intIDictation = resp.data[0];

            this.form
              .get('expedientNumber')
              .setValue(this.intIDictation.expedientNumber);
            console.log(' this.intIDictation.id => ' + this.intIDictation.id);
            this.form.get('registerNumber').setValue(this.intIDictation.id);
            this.form
              .get('wheelNumber')
              .setValue(this.intIDictation.wheelNumber);
            this.form.get('typeDict').setValue(this.intIDictation.statusDict);
            this.form.get('key').setValue(this.intIDictation.passOfficeArmy);
            let obj = {
              officialNumber: this.intIDictation.id,
              typeDict: this.intIDictation.typeDict,
            };
            this.complementoFormulario(obj);
            this.getPersonaExt_Int(
              'this.intIDictation => ',
              this.intIDictation
            );
          }*/
        },
        error: err => {
          if (err.message.indexOf('registros') !== -1) {
            this.onLoadToast('error', 'Error 1 ', err.message);
          }
          //   console.log('Error ' + error);
          //  this.onLoadToast('info', 'Registro', 'No se obtuvo información');
          // console.log('error', 'Error', err.error.message);
          // this.onLoadToast('error', 'error', err.error.message);
        },
      });
  }
}
