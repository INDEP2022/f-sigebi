import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { isArray } from 'ngx-bootstrap/chronos';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { SelectListFilteredModalComponent } from 'src/app/@standalone/modals/select-list-filtered-modal/select-list-filtered-modal.component';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ICharacteristicValue } from 'src/app/core/models/good/good-characteristic';
import { IAttribClassifGoods } from 'src/app/core/models/ms-goods-query/attributes-classification-good';
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { BasePage } from 'src/app/core/shared';
import { formatForIsoDate, secondFormatDate } from 'src/app/shared/utils/date';
import { ChangeOfGoodCharacteristicService } from '../../services/change-of-good-classification.service';
import { ATRIBUT_ACT_COLUMNS } from '../columns';
import { CharacteristicGoodCellComponent } from './characteristicGoodCell/characteristic-good-cell.component';

@Component({
  selector: 'app-attributes-table',
  templateUrl: './attributes-table.component.html',
  styleUrls: ['./attributes-table.component.scss'],
})
export class AttributesTableComponent extends BasePage implements OnInit {
  @Input() readOnly: boolean;
  @Input() clasification: number;
  @Input() title: string;
  @Input() initValue = true;
  data: ICharacteristicValue[];
  dataTemp: ICharacteristicValue[];
  dataPaginated: LocalDataSource = new LocalDataSource();
  pageSizeOptions = [5, 10, 15, 20];
  params = new BehaviorSubject<ListParams>(new ListParams());
  limit: FormControl = new FormControl(5);
  totalItems = 0;
  selectedAttribute: string;
  get good() {
    return this.service.good;
  }

  constructor(
    private readonly goodsQueryServices: GoodsQueryService,
    private service: ChangeOfGoodCharacteristicService,
    private modalService: BsModalService,
    private dynamicTablesService: DynamicTablesService
  ) {
    super();

    this.settings = {
      ...this.settings,
      actions: null,
      edit: {
        editButtonContent: '<span class="fa fa-eye text-success mx-2"></span>',
      },
      hideSubHeader: false,
    };
    this.params.value.limit = 5;
    this.searchNotServerPagination();
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      // console.log(params);
      if (this.data) {
        this.getPaginated(params);
      }
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.limit = new FormControl(5);
    }, 500);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['readOnly']) {
      if (changes['readOnly'].currentValue === true) {
        this.settings = {
          ...this.settings,
          columns: ATRIBUT_ACT_COLUMNS,
        };
      } else {
        this.settings = {
          ...this.settings,
          actions: {
            columnTitle: '',
            position: 'right',
            add: false,
            edit: true,
            delete: false,
          },
          columns: {
            ...ATRIBUT_ACT_COLUMNS,
            value: {
              ...ATRIBUT_ACT_COLUMNS.value,
              valuePrepareFunction: (cell: any, row: any) => {
                return { value: row, good: this.good };
              },
              renderComponent: CharacteristicGoodCellComponent,
            },
          },
          rowClassFunction: (row: any) => {
            return row
              ? row.data
                ? row.data.tableCd
                  ? ''
                  : 'notTableCd'
                : 'notTableCd'
              : 'notTableCd';
          },
        };
      }
    }

    console.log(changes);
    if (
      changes['clasification'].currentValue &&
      !changes['clasification'].firstChange
    ) {
      this.clear(this.readOnly);
      this.getData();
    }
  }

  selectSituations(vals: any, self: AttributesTableComponent) {
    console.log(vals);
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

  // private showAddCaracteristicsModal(row: ICharacteristicValue) {
  //   this.dynamicTablesService.selectedClasification = this.clasification;
  //   this.dynamicTablesService.selectedTable = row.tableCd;
  //   let data = row.value
  //     ? row.value.trim() !== ''
  //       ? row.value.split('/')
  //       : []
  //     : [];
  //   // debugger;
  //   const isNormal =
  //     this.disabledBienes || row.attribute !== 'SITUACION JURIDICA';
  //   this.openModalSelect(
  //     {
  //       title: 'los tipos de situaciones para el Bien',
  //       columnsType: {
  //         otvalor: {
  //           title: 'Situación',
  //           type: 'string',
  //           sort: false,
  //         },
  //       },
  //       type: 'text',
  //       multi: isNormal ? '' : 'multi',
  //       permitSelect: this.disabledBienes ? false : true,
  //       searchFilter: null,
  //       service: this.dynamicTablesService,
  //       selecteds: { column: 'otvalor', data },
  //       dataObservableFn:
  //         row.attribute === 'RESERVADO'
  //           ? this.dynamicTablesService.getAllOtkeyReservadoModal
  //           : row.attribute === 'SITUACION JURIDICA'
  //           ? this.dynamicTablesService.getAllOtkeySJuridaModal
  //           : this.dynamicTablesService.getAllOtkeyModal,
  //     },
  //     this.selectSituations
  //   );
  // }

  // private showAddCaracteristicsWebModal(row: ICharacteristicValue) {
  //   const modalConfig = MODAL_CONFIG;
  //   // console.log(row);

  //   modalConfig.initialState = {
  //     valor: row.value,
  //     disabled: this.disabledBienes,
  //     tableCd: 'INMUEBLES', //row.tableCd,
  //     noClasif: this.noClasif.value,
  //     callback: (cadena: string) => {
  //       //if (next)
  //       // debugger;
  //       console.log(cadena, this.selectedAttribute, this.dataTemp);
  //       this.data.forEach(x => {
  //         if (x.attribute === this.selectedAttribute) {
  //           x.value = cadena;
  //         }
  //       });
  //       this.dataTemp.forEach(x => {
  //         if (x.attribute === this.selectedAttribute) {
  //           x.value = cadena;
  //         }
  //       });
  //       // this.data = [...this.data];
  //       this.getPaginated(this.params.value);
  //     },
  //   };
  //   this.modalService.show(GoodTableDetailButtonComponent, modalConfig);
  // }

  showModals(row: ICharacteristicValue) {
    // console.log(item);
    // const params = this.params.getValue();
    this.selectedAttribute = row.attribute;
    // const row = item.data;
    // if (row.attribute === 'RESERVADO') {
    //   this.showAddCaracteristicsModal(row);
    //   // this.showAddCaracteristicsWebModal(row);
    // } else if (row.attribute === 'SITUACION JURIDICA') {
    //   this.showAddCaracteristicsModal(row);
    // } else if (row.attribute === 'CATÁLOGO COMERCIAL') {
    //   this.showAddCaracteristicsWebModal(row);
    // } else if (row.attribute === 'OPCIONALES CATÁLOGO COMERCIAL') {
    //   this.showAddCaracteristicsWebModal(row);
    // } else {
    //   this.showAddCaracteristicsModal(row);
    // }
  }

  private clear(readOnly: boolean) {
    this.dataTemp = [];
    if (readOnly === false) {
      this.service.data = [];
    } else {
      this.data = [];
    }
  }

  private getValue(good: any, item: IAttribClassifGoods) {
    const column = 'val' + item.columnNumber;
    return item.dataType === 'D' || item.attribute.includes('FECHA')
      ? formatForIsoDate(good[column], 'string')
      : good[column];
  }

  private getData() {
    let params = new FilterParams();
    params.addFilter('classifGoodNumber', this.clasification);
    const good = this.good as any;
    this.goodsQueryServices
      .getAtribuXClasif(params.getParams())
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response.data && response.data.length > 0) {
            const newData = response.data.sort((a, b) => {
              return a.columnNumber - b.columnNumber;
            });
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
              // let v_val_entfed;
              // this.val_atributos_inmuebles++;
              // if (this.service.v_bien_inm) {
              //   if (
              //     item.attribute === 'ESTADO' &&
              //     this.val_atributos_inmuebles > 4
              //   ) {
              //   }
              // }
              return {
                column,
                attribute: item.attribute,
                value: this.initValue ? this.getValue(good, item) : null,
                required: item.required === 'S',
                update: true,
                requiredAva: false,
                tableCd: item.tableCd,
                editing: false,
                length: item.length,
                dataType: item.dataType,
              };
            });
          }
          this.totalItems = this.data.length;
          if (!this.readOnly) {
            this.service.data = [...this.data];
          }
          this.dataTemp = [...this.data];
          this.getPaginated(this.params.value);
          this.loading = false;
          // if (newAtribut) {
          //   this.listAtributNew = response.data;
          //   this.getOtkeyOtvalue();
          // } else {
          //   this.formateObjTabla(
          //     response.data.sort((a, b) => a.columnNumber - b.columnNumber)
          //   );
          // }
        },
        error: err => {
          this.onLoadToast('error', 'ERROR', 'Error al cargar los atributos');
        },
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
}
