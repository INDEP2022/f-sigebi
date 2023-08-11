import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { LotParamsService } from 'src/app/core/services/ms-lot-parameters/lot-parameters.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { BATCH_PARAMETERS_COLUMNS } from './batch-parameters-columns';

@Component({
  selector: 'app-batch-parameters-list',
  templateUrl: './batch-parameters-list.component.html',
  styles: [],
})
export class BatchParametersListComponent extends BasePage implements OnInit {
  //

  lotServiceArray: any[] = [];
  lotServiceArrayTwo: any[] = [];
  adding: boolean = false;
  totalItems: number = 0;
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  lotData: LocalDataSource = new LocalDataSource();
  filterRow: any;
  addOption: any;
  addRowElement: any;
  form: FormGroup;
  cancelBtn: any;
  cancelEvent: any;
  createButton: string =
    '<span class="btn btn-success active font-size-12 me-2 mb-2 py-2 px-2">Agregar</span>';
  saveButton: string =
    '<span class="btn btn-info active font-size-12 me-2 mb-2 py-2 px-2">Actualizar</span>';
  cancelButton: string =
    '<span class="btn btn-warning active font-size-12 text-black me-2 mb-2 py-2 px-2 cancel">Cancelar</span>';

  paramSettings = {
    ...TABLE_SETTINGS,
    selectedRowIndex: -1,
    mode: 'internal',
    hideSubHeader: false,
    filter: {
      inputClass: 'd-none',
    },
    attr: {
      class: 'table-bordered normal-hover',
    },
    add: {
      createButtonContent: this.createButton,
      cancelButtonContent: this.cancelButton,
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="fa fa-pencil-alt text-warning mx-2"></i>',
      saveButtonContent: this.saveButton,
      cancelButtonContent: this.cancelButton,
      confirmSave: true,
    },
  };
  columnFilters: any = [];

  //

  constructor(
    private lotparamsService: LotParamsService,
    private fb: FormBuilder,
    private serviceLot: LotService
  ) {
    super();
    this.paramSettings.columns = BATCH_PARAMETERS_COLUMNS;
    this.paramSettings.actions.delete = true;

    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        add: false,
        delete: false,
        position: 'right',
      },
      columns: { ...BATCH_PARAMETERS_COLUMNS },
    };
  }

  ngOnInit(): void {
    // this.hideFilters();
    this.lotData
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              idLot: () => (searchFilter = SearchFilter.EQ),
              idEvent: () => (searchFilter = SearchFilter.EQ),
              publicLot: () => (searchFilter = SearchFilter.EQ),
              specialGuarantee: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          //Su respectivo metodo de busqueda de datos
          this.getLotParams();
        }
      });

    this.paramsList
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getLotParams());
    this.prepareForm();
  }

  //

  private prepareForm() {
    this.form = this.fb.group({
      idEvent: [null, Validators.required],
      lotePublico: [null, Validators.required],
      garantia: [null, Validators.required],
    });
  }

  getLotByFilters() {
    let params: HttpParams = new HttpParams();

    params = params.append(
      'filter.idEvent',
      this.form.controls['idEvent'].value
    );
    params = params.append(
      'filter.lotPublic',
      this.form.controls['lotePublico'].value
    );
    params = params.append(
      'filter.priceGuarantee',
      this.form.controls['garantia'].value
    );

    this.serviceLot.getAllComerLotsByFilter(params).subscribe({
      next: response => {
        this.lotServiceArray = response.data;
        this.preValidatedSaveAll();
        setTimeout(() => {
          this.getLotParams();
        }, 1000);
      },
      error: error => {
        if (error.status == 400) {
          this.alert('warning', 'Advertencia', 'No existen registros');
        } else {
          this.alert('error', 'Error', 'Ha ocurrido un error');
        }
      },
    });
  }

  getLotParams() {
    this.loading = true;
    this.totalItems = 0;
    let params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    this.lotparamsService.getAll_(params).subscribe({
      next: response => {
        this.loading = false;
        this.lotData.load(response.data);
        this.lotData.refresh();
        this.totalItems = response.count;
        this.lotServiceArrayTwo = response.data;
      },
      error: error => {
        this.totalItems = 0;
        this.lotData.load([]);
        this.loading = false;
      },
    });
  }

  putLotParams(body: any) {
    let responseLocal: any;
    this.lotparamsService.update(body.idLot, body).subscribe({
      next: response => {
        return (responseLocal = response.data);
      },
      error: error => {
        this.alert('error', 'Error', 'Ha ocurrido un error');
        return responseLocal;
      },
    });
    responseLocal;
  }

  postLorParams(body: any) {
    let responseLocal: any = null;
    this.lotparamsService.createLotParameter(body).subscribe({
      next: response => {
        return (responseLocal = response.data);
      },
      error: error => {
        this.alert('error', 'Error', 'Ha ocurrido un error');
        return responseLocal;
      },
    });
    responseLocal;
  }

  preValidatedSaveAll() {
    let object: any;
    if (this.lotServiceArray != null) {
      for (const i of this.lotServiceArray) {
        let params: HttpParams = new HttpParams();
        params = params.append('filter.idLot', i.idLot);

        this.lotparamsService.getAll_(params).subscribe({
          next: response => {
            object = response.data[0];
            if (object != null) {
              object.idEvent = i?.idEvent;
              object.idLot = i.idLot;
              object.publicLot = i.lotPublic;
              object.specialGuarantee = i.priceGuarantee;
              object.nbOrigin = '';
              this.putLotParams(object);
            }
          },
          error: error => {
            object = {
              idEvent: i.idEvent,
              idLot: i.idLot,
              publicLot: i.lotPublic,
              specialGuarantee: i.priceGuarantee,
              nbOrigin: '',
            };
            this.postLorParams(object);
          },
        });
      }
    }
  }
}
