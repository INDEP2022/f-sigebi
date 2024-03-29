import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { isArray } from 'ngx-bootstrap/chronos';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { SelectListFilteredModalComponent } from 'src/app/@standalone/modals/select-list-filtered-modal/select-list-filtered-modal.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ICharacteristicValue } from 'src/app/core/models/good/good-characteristic';
import { IAttribClassifGoods } from 'src/app/core/models/ms-goods-query/attributes-classification-good';
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { BasePage } from 'src/app/core/shared';
import { formatForIsoDate, secondFormatDate } from 'src/app/shared/utils/date';
import { ICharacteristicsWidthData } from '../../../services/goods-characteristics.service';
import { GoodTableDetailButtonComponent } from '../good-table-detail-button/good-table-detail-button.component';

@Component({
  selector: 'app-good-characteristics-table',
  templateUrl: './good-characteristics-table.component.html',
  styleUrls: ['./good-characteristics-table.component.scss'],
})
export class GoodCharacteristicsTable extends BasePage implements OnInit {
  @Input() clasification: number;
  @Input() avaluo: boolean;
  @Input() di_numerario_conciliado: string;
  @Input() good: any;
  @Input() disabled: boolean;
  @Input() override settings: any;
  @Input() service: ICharacteristicsWidthData;
  @Input() initValue = true;
  @Input() inventary: any;
  @Input() loadInventary: boolean = false;
  @Input() set goodChange(value: number) {
    console.error('ESTE es el valor de Value', value);
    this._goodChange = value;
    if (value > 0) this.getData();
  }
  private _goodChange: number;
  pageSizeOptions = [5, 10, 15, 20];
  limit: FormControl = new FormControl(5);
  params = new BehaviorSubject<ListParams>(new ListParams());
  val_atributos_inmuebles = 0;
  dataTemp: ICharacteristicValue[] = [];
  dataPaginated: LocalDataSource = new LocalDataSource();
  selectedAttribute: string;
  v_bien_inm: boolean;
  totalItems = 0;

  constructor(
    private modalService: BsModalService,
    private dynamicTablesService: DynamicTablesService,
    private goodsqueryService: GoodsQueryService
  ) {
    super();
    this.params.value.limit = 5;
    this.searchNotServerPagination();
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      // console.log(params);
      if (this.data) {
        this.getPaginated(params);
      }
      if (this.dataInventary) {
        this.getPaginated(params);
      }
    });
  }

  private getData() {
    // console.log(this.clasification);
    console.error(
      'LLEGO A GET_DATA Y ESTE ES EL CLASIFICADOR:',
      this.clasification
    );
    this.loading = true;
    const filterParams = new FilterParams();
    filterParams.limit = 100;
    filterParams.addFilter('classifGoodNumber', this.clasification);
    filterParams.addFilter('columnNumber', '51', SearchFilter.NOTIN);
    const good = this.good as any;
    // console.log(good);
    this.goodsqueryService
      .getAtribuXClasif(filterParams.getParams())
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          console.error('ATRIBUTOS DEL BIEN', response.data);

          this.val_atributos_inmuebles = 0;

          if (response.data && response.data.length > 0) {
            const newData = response.data.sort((a, b) => {
              return a.columnNumber - b.columnNumber;
            });
            // console.log(newData);
            if (this.loadInventary) {
              this.dataInventary = newData.map((item, index) => {
                const column = 'val' + item.columnNumber;
                if (item.attribute === 'SITUACION JURIDICA') {
                  if (good[column]) {
                    good.val35 = secondFormatDate(new Date());
                  } else {
                    good.val35 = null;
                  }
                }
                let v_val_entfed;
                this.val_atributos_inmuebles++;
                if (good.no_tipo && good.no_tipo + '' === '6') {
                  if (
                    item.attribute === 'ESTADO' &&
                    this.val_atributos_inmuebles > 4
                  ) {
                  }
                }
                console.log(this.inventary);
                if (this.inventary) {
                  return {
                    column,
                    attribute: item.attribute,
                    value:
                      this.initValue === true
                        ? this.inventary[index]
                          ? this.inventary[index].valueAttributeInventory
                          : null
                        : null,
                    required: item.required === 'S',
                    update: this.haveUpdate(item.update),
                    requiredAva: item.attribute
                      ? this.haveRequiredAva(item.attribute)
                      : false,
                    tableCd: item.tableCd,
                    editing: false,
                    length: item.length,
                    dataType: item.dataType,
                    numColumn: item.columnNumber,
                  };
                } else {
                  return {
                    column,
                    attribute: item.attribute,
                    value:
                      this.initValue === true
                        ? this.inventary
                          ? this.inventary[index].valueAttributeInventory
                          : null
                        : null,
                    required: item.required === 'S',
                    update: this.haveUpdate(item.update),
                    requiredAva: item.attribute
                      ? this.haveRequiredAva(item.attribute)
                      : false,
                    tableCd: item.tableCd,
                    editing: false,
                    length: item.length,
                    dataType: item.dataType,
                    numColumn: item.columnNumber,
                  };
                }
              });
              console.log('Data', this.dataInventary);
              this.totalItems = this.dataInventary.length;
              this.dataTemp = [...this.dataInventary];
              this.getPaginated(this.params.value);
              this.loading = false;
            } else {
              this.data = newData.map(item => {
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
                if (this.v_bien_inm) {
                  if (
                    item.attribute === 'ESTADO' &&
                    this.val_atributos_inmuebles > 4
                  ) {
                  }
                }
                return {
                  column,
                  attribute: item.attribute,
                  value:
                    this.initValue === true ? this.getValue(good, item) : null,
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
              // console.log(this.data);
            }
          } else {
            this.clearTable();
          }
        },
        error: err => {
          this.clearTable();
        },
      });
  }

  private clearTable() {
    this.totalItems = 0;
    this.dataTemp = [];
    this.dataPaginated.load([]);
    this.dataPaginated.refresh();
    this.loading = false;
  }

  ngOnInit() {
    // console.log(this.clasification);
    // this.service.goodChange.subscribe({
    //   next: response => {
    //     // debugger;
    //     if (response) {
    //     } else {
    //       this.loading = false;
    //     }
    //   },
    // });
  }

  get data() {
    return this.service ? this.service.data : [];
  }

  get dataInventary() {
    return this.service ? this.service.dataInventary : [];
  }

  set data(value) {
    if (this.service) this.service.data = value;
  }

  set dataInventary(value) {
    if (this.service) this.service.dataInventary = value;
  }

  private openModalSelect(
    context?: Partial<SelectListFilteredModalComponent>,
    callback?: Function
  ) {
    const modalRef = this.modalService.show(SelectListFilteredModalComponent, {
      initialState: { ...context },
      class: 'modal-md modal-dialog-centered modal-not-top-padding',
      ignoreBackdropClick: true,
    });
    modalRef.content.onSelect.subscribe(data => {
      console.log(this.loadInventary);
      if (this.loadInventary) {
        this['data'] = this['dataInventary'];
      }
      console.log(this);
      if (data) callback(data, this);
      // console.log(this['data']=this['dataInventary']);
    });
  }

  private selectSituations(vals: any, self: GoodCharacteristicsTable) {
    // console.log(vals);
    let newString = '';
    if (isArray(vals)) {
      vals.forEach((val: any, index) => {
        newString += (index > 0 ? '/' : '') + val.otvalor;
      });
    } else {
      newString = vals.otvalor;
    }
    newString =
      newString.length > 1500 ? newString.substring(0, 1500) : newString;
    self.data.forEach(x => {
      if (x.attribute === self.selectedAttribute) {
        x.value = newString;
      }
    });
    self.dataTemp.forEach(x => {
      if (x.attribute === self.selectedAttribute) {
        x.value = newString;
      }
    });
    self.getPaginated(self.params.value);
  }

  private showAddCaracteristicsModal(row: ICharacteristicValue) {
    this.dynamicTablesService.selectedClasification = this.clasification;
    this.dynamicTablesService.selectedTable = row.tableCd;
    let data = row.value
      ? row.value.trim() !== ''
        ? row.value.split('/')
        : []
      : [];
    // debugger;
    const isNormal = this.disabled || row.attribute !== 'SITUACION JURIDICA';
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
        multi: isNormal ? '' : 'multi',
        permitSelect: this.disabled ? false : true,
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

  private showAddCaracteristicsWebModal(row: ICharacteristicValue) {
    const modalConfig = MODAL_CONFIG;
    // console.log(row);

    modalConfig.initialState = {
      valor: row.value,
      disabled: this.disabled,
      tableCd: 'INMUEBLES', //row.tableCd,
      noClasif: this.clasification,
      service: this.service,
      callback: (cadena: string) => {
        //if (next)
        // debugger;
        // console.log(cadena, this.selectedAttribute, this.dataTemp);
        this.data.forEach(x => {
          if (x.attribute === this.selectedAttribute) {
            x.value = cadena;
          }
        });
        this.dataTemp.forEach(x => {
          if (x.attribute === this.selectedAttribute) {
            x.value = cadena;
          }
        });
        // this.data = [...this.data];
        this.getPaginated(this.params.value);
      },
    };
    this.modalService.show(GoodTableDetailButtonComponent, modalConfig);
  }

  showModals(row: ICharacteristicValue) {
    // console.log(item);
    // const params = this.params.getValue();
    this.selectedAttribute = row.attribute;
    // const row = item.data;
    if (row.attribute === 'RESERVADO') {
      this.showAddCaracteristicsModal(row);
      // this.showAddCaracteristicsWebModal(row);
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

  private haveUpdate(update: string) {
    if (update) {
      if (update === 'S' && this.di_numerario_conciliado !== 'Conciliado') {
        return true;
      }
    }
    return false;
  }

  private getValue(good: any, item: IAttribClassifGoods) {
    const column = 'val' + item.columnNumber;
    return item.dataType === 'D' || item.attribute.includes('FECHA')
      ? formatForIsoDate(good[column], 'string')
      : good[column];
  }

  private haveRequiredAva(attribute: string) {
    return this.avaluo ? (attribute === 'CON AVALUO' ? true : false) : false;
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
            // console.log(filter, index);
            if (index === 0) {
              this.dataTemp = [...this.data];
            }
            this.dataTemp = this.dataTemp.filter((item: any) =>
              filter.search !== ''
                ? (item[filter['field']] + '')
                    .toUpperCase()
                    .includes((filter.search + '').toUpperCase())
                : true
            );
          });
          // this.totalItems = filterData.length;
          // console.log(this.dataTemp);
          this.totalItems = this.dataTemp.length;
          this.params.value.page = 1;
          this.getPaginated(this.params.getValue());
        }
      });
  }

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
}
