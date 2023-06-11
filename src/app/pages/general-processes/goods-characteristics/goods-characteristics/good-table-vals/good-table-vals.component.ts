import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { SelectListFilteredModalComponent } from 'src/app/@standalone/modals/select-list-filtered-modal/select-list-filtered-modal.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ITvalTable1 } from 'src/app/core/models/catalogs/dinamic-tables.model';
import { IAttribClassifGoods } from 'src/app/core/models/ms-goods-query/attributes-classification-good';
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared';
import { formatForIsoDate, secondFormatDate } from 'src/app/shared/utils/date';
import { GoodsCharacteristicsService } from '../../services/goods-characteristics.service';
import { GoodCellValueComponent } from './good-cell-value/good-cell-value.component';
import { GoodCharacteristicModalComponent } from './good-characteristic-modal/good-characteristic-modal.component';
import { GoodSituationsModalComponent } from './good-situations-modal/good-situations-modal.component';
import { GoodTableDetailButtonComponent } from './good-table-detail-button/good-table-detail-button.component';

export interface IVal {
  column: string;
  attribute: string;
  value: string;
  oldValue: string;
  required: boolean;
  update: boolean;
  requiredAva: boolean;
  tableCd: string;
  editing: boolean;
  length: number;
  dataType: string;
}

function getClassColour(row: IVal) {
  // console.log(row);
  return row
    ? row.requiredAva
      ? 'requiredAva'
      : row.required
      ? 'required'
      : row.update
      ? 'update'
      : ''
    : '';
}

@Component({
  selector: 'app-good-table-vals',
  templateUrl: './good-table-vals.component.html',
  styleUrls: ['./good-table-vals.component.scss'],
})
export class GoodTableValsComponent extends BasePage implements OnInit {
  pageSizeOptions = [5, 10, 15, 20];
  limit: FormControl = new FormControl(5);
  params = new BehaviorSubject<ListParams>(new ListParams());
  val_atributos_inmuebles = 0;
  actualiza: boolean;
  requerido: boolean;
  selectedRow: number;
  totalItems = 0;
  constructor(
    private goodsqueryService: GoodsQueryService,
    private goodService: GoodService,
    private service: GoodsCharacteristicsService,
    private modalService: BsModalService,
    private dynamicTablesService: DynamicTablesService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: '',
        position: 'right',
        add: false,
        edit: false,
        delete: true,
      },
      delete: {
        deleteButtonContent:
          '<span class="fa fa-eye text-success mx-2"></span>',
        confirmDelete: false,
      },
      hideSubHeader: false,
      columns: {
        attribute: {
          title: 'Atributo',
          type: 'string',
          sort: true,
          editable: false,
        },
        value: {
          title: 'Valores',
          type: 'custom',
          sort: false,
          editable: false,
          valuePrepareFunction: (cell: any, row: any) => row,
          renderComponent: GoodCellValueComponent,
        },
      },
      rowClassFunction: (row: any) => {
        return (
          getClassColour(row.data) +
          ' ' +
          (row.data.tableCd ? '' : 'notTableCd')
        );
      },
    };
    this.params.value.limit = 5;
    this.searchNotServerPagination();
  }

  get dataTemp() {
    return this.service.dataTemp;
  }

  set dataTemp(value) {
    this.service.dataTemp = value;
  }

  get di_numerario_conciliado() {
    return this.service.di_numerario_conciliado;
  }

  get newGood() {
    return this.service.newGood;
  }

  get disabledBienes() {
    return this.service.disabledBienes;
  }

  get good() {
    return this.service.good;
  }

  get form() {
    return this.service.form;
  }
  get noClasif() {
    return this.form.get('noClasif');
  }

  get data() {
    return this.service.data;
  }

  set data(value) {
    this.service.data = value;
  }

  get avaluo() {
    return this.form
      ? this.form.get('avaluo')
        ? this.form.get('avaluo').value
        : false
      : false;
  }

  get dataPaginated() {
    return this.service.dataPaginated;
  }

  private searchNotServerPagination() {
    this.dataPaginated
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          // this.data = this.dataOld;
          // debugger;
          let filters = change.filter.filters;
          filters.map((filter: any, index: number) => {
            console.log(filter, index);
            if (index === 0) {
              this.dataTemp = [...this.data];
            }
            this.dataTemp = this.dataTemp.filter((item: any) =>
              filter.search !== ''
                ? (item[filter['field']] + '').includes(filter.search)
                : true
            );
          });
          // this.totalItems = filterData.length;
          console.log(this.dataTemp);
          this.totalItems = this.dataTemp.length;
          this.params.value.page = 1;
          this.getPaginated(this.params.getValue());
        }
      });
  }

  private haveUpdate(update: string) {
    if (update) {
      if (update === 'S' && this.di_numerario_conciliado !== 'Conciliado') {
        return true;
      }
    }
    return false;
  }

  openModal1() {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      callback: (next: boolean) => {
        //if (next)
      },
    };
    this.modalService.show(GoodTableDetailButtonComponent, modalConfig);
  }

  openModal2() {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      callback: (next: boolean) => {
        //if (next)
      },
    };
    this.modalService.show(GoodSituationsModalComponent, modalConfig);
  }

  openModalSelect(
    context?: Partial<SelectListFilteredModalComponent>,
    callback?: Function
  ) {
    const modalRef = this.modalService.show(SelectListFilteredModalComponent, {
      initialState: { ...context },
      class: 'modal-md modal-dialog-centered modal-not-top-padding',
      ignoreBackdropClick: true,
    });
    modalRef.content.onSelect.subscribe(data => {
      if (data) callback(data, this);
    });
  }

  selectSituations(vals: ITvalTable1[], self: GoodTableValsComponent) {
    console.log(vals);
    let newString = '';
    vals.forEach((val, index) => {
      newString += (index > 0 ? '/' : '') + val.otvalor;
    });
    self.data[self.selectedRow].value =
      newString.length > 1500 ? newString.substring(0, 1500) : newString;
    self.data = [...self.data];
    self.getPaginated(self.params.value);
  }

  private showAddCaracteristicsModal(row: IVal) {
    this.dynamicTablesService.selectedClasification = this.noClasif.value;
    this.dynamicTablesService.selectedTable = row.tableCd;
    let data = row.value
      ? row.value.trim() !== ''
        ? row.value.split('/')
        : []
      : [];
    this.openModalSelect(
      {
        title: 'los tipos de situaciones para el Bien',
        columnsType: {
          otvalor: {
            title: 'Situación',
            type: 'string',
            sort: false,
          },
        },
        type: 'text',
        multi:
          this.disabledBienes || row.attribute !== 'SITUACION JURIDICA'
            ? ''
            : 'multi',
        permitSelect: this.disabledBienes ? false : true,
        searchFilter: null,
        service: this.dynamicTablesService,
        selecteds: { column: 'otvalor', data },
        dataObservableFn:
          row.attribute === 'RESERVADO'
            ? this.dynamicTablesService.getAllOtkeyReservadoModal
            : row.attribute === 'SITUACION JURIDICA'
            ? this.dynamicTablesService.getAllOtkeySJuridaModal
            : this.dynamicTablesService.getAllOtkeyModal,
      },
      this.selectSituations
    );
  }

  private showAddCaracteristicsWebModal(row: IVal) {
    const modalConfig = MODAL_CONFIG;
    console.log(row);

    modalConfig.initialState = {
      valor: row.value,
      tableCd: row.tableCd,
      noClasif: this.noClasif.value,
      callback: (cadena: string) => {
        //if (next)
        // debugger;
        console.log(cadena);
        this.data[this.selectedRow].value = cadena;
        // this.data = [...this.data];
        this.getPaginated(this.params.value);
      },
    };
    this.modalService.show(GoodTableDetailButtonComponent, modalConfig);
  }

  private pupCatWebOblig(row: IVal) {}

  private pupCatWebOpc(row: IVal) {}

  showModals(item: { data: IVal; index: number }) {
    console.log(item);
    const params = this.params.getValue();
    this.selectedRow = (params.page - 1) * params.limit + item.index;
    const row = item.data;
    if (row.attribute === 'RESERVADO') {
      this.showAddCaracteristicsModal(row);
    } else if (row.attribute === 'SITUACION JURIDICA') {
      this.showAddCaracteristicsModal(row);
    } else if (row.attribute === 'CATÁLOGO COMERCIAL') {
      this.showAddCaracteristicsWebModal(row);
    } else if (row.attribute === 'OPCIONALES CATÁLOGO COMERCIAL') {
      this.showAddCaracteristicsWebModal(row);
    } else {
      this.showAddCaracteristicsModal(row);
    }
  }

  openForm(row: any) {
    console.log(row);

    let config: ModalOptions = {
      initialState: {
        row: row.data,
        callback: (data: any) => {
          console.log(data);
          this.data[row.index].value = data.value;
          this.dataTemp[row.index].value = data.value;
          this.getPaginated(this.params.getValue());
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(GoodCharacteristicModalComponent, config);
  }

  // getNewRowValue(row: IVal) {
  //   if (row.dataType === 'D' || row.attribute.includes('FECHA')) {
  //     row.value = firstFormatDate(row.value as any);
  //     good[row.column] = firstFormatDateToSecondFormatDate(row.value);
  //   }
  // }

  // updateRow(row: IVal, index: number) {
  //   // let newValue: any = row.value;
  //   // console.log(row.value);
  //   this.newGood[row.column] = row.value;
  //   if (row.dataType === 'D' || row.attribute.includes('FECHA')) {
  //     row.value = firstFormatDate(row.value as any);
  //     this.newGood[row.column] = firstFormatDateToSecondFormatDate(row.value);
  //   }
  //   if (row.attribute === 'MONEDA') {
  //     if (this.good.goodClassNumber === 62 && row.value!) {
  //     }
  //   }

  //   this.data[index].oldValue = row.value;

  //   // this.goodService
  //   //   .update(good)
  //   //   .pipe(takeUntil(this.$unSubscribe))
  //   //   .subscribe({
  //   //     next: response => {
  //   //       console.log('Actualizo');
  //   //       this.data[index].oldValue = row.value;
  //   //       this.onLoadToast('success', 'Bien', 'Actualizado correctamente');
  //   //     },
  //   //     error: err => {
  //   //       this.data[index].value = row.oldValue;
  //   //     },
  //   //   });
  // }

  private getPaginated(params: ListParams) {
    const cantidad = params.page * params.limit;
    this.dataPaginated.load([
      ...this.dataTemp.slice(
        (params.page - 1) * params.limit,
        cantidad > this.dataTemp.length ? this.dataTemp.length : cantidad
      ),
    ]);
    this.dataPaginated.refresh();
  }

  private subsPaginated() {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      console.log(params);
      if (this.data) {
        this.getPaginated(params);
      }
    });
  }

  getValue(good: any, item: IAttribClassifGoods) {
    const column = 'val' + item.columnNumber;
    return item.dataType === 'D' || item.attribute.includes('FECHA')
      ? formatForIsoDate(good[column], 'string')
      : good[column];
  }

  haveRequiredAva(attribute: string) {
    return this.avaluo ? (attribute === 'CON AVALUO' ? true : false) : false;
  }

  ngOnInit() {
    this.service.goodChange.subscribe({
      next: response => {
        // debugger;
        if (response) {
          const filterParams = new FilterParams();
          filterParams.limit = 100;
          filterParams.addFilter(
            'classifGoodNumber',
            this.good.goodClassNumber
          );
          filterParams.addFilter('columnNumber', '51', SearchFilter.NOTIN);
          const good = this.good as any;
          this.goodsqueryService
            .getAtribuXClasif(filterParams.getParams())
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe({
              next: response => {
                this.val_atributos_inmuebles = 0;
                if (response.data && response.data.length > 0) {
                  this.data = response.data.map(item => {
                    const column = 'val' + item.columnNumber;
                    if (item.attribute === 'SITUACION JURIDICA') {
                      if (good[column]) {
                        good.val35 = secondFormatDate(new Date());
                      } else {
                        good.val35 = null;
                      }
                    }
                    // validar si existe tipo con goodClassNumber
                    let v_val_entfed;
                    this.val_atributos_inmuebles++;
                    if (this.service.v_bien_inm) {
                      if (
                        item.attribute === 'ESTADO' &&
                        this.val_atributos_inmuebles > 4
                      ) {
                      }
                    }
                    return {
                      column,
                      attribute: item.attribute,
                      value: this.getValue(good, item),
                      oldValue: this.getValue(good, item),
                      required: item.required === 'S',
                      update: this.haveUpdate(item.update),
                      requiredAva: item.attribute
                        ? this.haveRequiredAva(item.attribute)
                        : false,
                      tableCd: item.tableCd,
                      editing: false,
                      length: item.length,
                      dataType: item.dataType,
                    };
                  });
                  this.totalItems = this.data.length;
                  this.dataTemp = [...this.data];
                  this.getPaginated(this.params.value);
                  this.loading = false;
                  console.log(this.data);
                } else {
                  this.loading = false;
                }
              },
            });
          this.subsPaginated();
        } else {
          this.loading = false;
        }
      },
    });
  }
}
