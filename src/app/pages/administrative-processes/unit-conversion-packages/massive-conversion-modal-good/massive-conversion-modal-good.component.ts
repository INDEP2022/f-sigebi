import { Component, OnInit } from '@angular/core';
import * as saveAs from 'file-saver';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import {
  GoodsItem,
  PrepDestinationPackage,
} from 'src/app/core/models/catalogs/Ipackage-valid-good';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { LabelOkeyService } from 'src/app/core/services/catalogs/label-okey.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { PackageGoodService } from 'src/app/core/services/ms-packagegood/package-good.service';
import { BasePage } from 'src/app/core/shared';
import { GOODS_SELECTIONS_COLUMNS } from '../massive-conversion/columns';

interface packageData {
  package: string;
  packageType: string;
  amountKg: string;
  status: string;
  delegation: string;
  goodClassification: string;
  targetTag: string;
  goodStatus: string;
  measurementUnit: string;
  transferent: string;
  warehouse: string;
  scanFolio: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  descDelegation: string;
  descTargetTag: string;
  descTransferent: string;
  warehouseDesc: string;
  descgoodClassification: string;
}

@Component({
  selector: 'app-massive-conversion-modal-good',
  templateUrl: './massive-conversion-modal-good.component.html',
  styles: [],
})
export class MassiveConversionModalGoodComponent
  extends BasePage
  implements OnInit
{
  data: any;
  dataForm: packageData;
  goodSelection: any[] = [];
  goodList: any[] = [];
  totalItems: number = 30;
  columnFilters: any = [];
  onSentGoods: Subject<any>;

  params = new BehaviorSubject<ListParams>(new ListParams());
  datares = new LocalDataSource();
  constructor(
    private modalRef: BsModalRef,
    private delegationService: DelegationService,
    private labelService: LabelOkeyService,
    private transferenteService: TransferenteService,
    private vGoodService: GoodTrackerService,
    private serviceW: WarehouseService,
    private packageGoodService: PackageGoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,

      actions: { add: false, delete: false, edit: false },
      columns: GOODS_SELECTIONS_COLUMNS,
    };
  }

  ngOnInit() {
    this.goodList = this.data.goodDet;

    this.datares
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            // filter.field == 'id' ||
            //   filter.field == 'description' ||
            //   filter.field == 'quantity' ||
            //   filter.field == 'fileNumber'
            Object.keys(GOODS_SELECTIONS_COLUMNS).includes(filter.field)
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.onInitChargeGoods();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.onInitChargeGoods());

    this.onSentGoods = new Subject();
    if (this.data) {
      this.getDelegationDescription(this.data.infoPack.delegation);
      this.getLabelDescription(this.data.infoPack.targetTag);
      this.getTransferentName(this.data.infoPack.transferent);
      this.getWarehouseDescription(this.data.infoPack.warehouse);
    }
  }

  getDelegationDescription(delegationId: string) {
    const params = new ListParams();
    params['filter.id'] = delegationId;

    this.delegationService
      .getAll(params)
      .pipe(
        switchMap(res => {
          this.data.infoPack.descDelegation = res.data[0].description;
          return [];
        }),
        catchError(error => {
          this.onLoadToast(
            'error',
            'Error',
            'Error obteniendo descripción de la delegación.'
          );
          return [];
        })
      )
      .subscribe();
  }

  getLabelDescription(labelId: string) {
    const params = new ListParams();
    params['filter.id'] = labelId;

    return (
      this.labelService.getAll(params).subscribe(res => {
        this.data.infoPack.descTargetTag = res.data[0].description;
        return [];
      }),
      catchError(error => {
        this.onLoadToast(
          'error',
          'Error',
          'Error obteniendo descripción de la etiqueta.'
        );
        return [];
      })
    );
  }

  getGoodDescription(goodId: string) {
    const params = new ListParams();
    params['filter.id'] = goodId;

    return (
      this.vGoodService.getAll(params).subscribe(res => {
        this.data.infoPack.goodStatus = res.data[0].goodDescription;
      }),
      catchError(error => {
        this.onLoadToast(
          'error',
          'Error',
          'Error obteniendo descripción del bien.'
        );
        return [];
      })
    );
  }

  getTransferentName(transferentId: string) {
    const params = new ListParams();
    params['filter.id'] = transferentId;
    return this.transferenteService.getAll(params).subscribe(
      res => {
        this.data.infoPack.descTransferent = res.data[0].nameTransferent;
      },
      catchError(error => {
        this.onLoadToast(
          'error',
          'Error',
          'Error obteniendo nombre del transferente.'
        );
        return of([]); // Devuelve un observable vacío en caso de error
      })
    );
  }

  getWarehouseDescription(warehouseId: string) {
    const params = new ListParams();
    params['filter.id'] = warehouseId;

    this.serviceW.getAll(params).subscribe(
      res => {
        this.data.infoPack.warehouseDesc = res.data[0].description;
      },
      error => {
        this.onLoadToast(
          'error',
          'Error',
          'Error obteniendo descripción del almacén.'
        );
      }
    );
  }

  onInitChargeGoods() {
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    delete params['text'];

    this.vGoodService.getAll(params).subscribe(res => {
      this.datares.load(res.data);
      this.totalItems = res.count;
    });
  }
  //Añade o elimina segun el checkbox
  selectEvent(selectedGood: any) {
    selectedGood.isSelected
      ? this.goodSelection.push(selectedGood.data)
      : this.removeItemFromList(selectedGood.data.id);
  }
  settingsChange($event: any): void {
    this.settings = $event;
  }
  removeItemFromList(id: number) {
    const index = this.goodSelection.findIndex(good => good.id === id);
    if (index !== -1) {
      this.goodSelection.splice(index, 1);
    }
  }

  async exportToExcel() {
    if (this.datares.count() === 0) {
      this.onLoadToast('error', 'Error', 'No hay datos para exportar');
      return;
    }
    const csvContent = this.convertToCSV(await this.datares.getAll());
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'archivo.csv');
  }

  convertToCSV(data: any[]): string {
    const headers = [
      'BIEN',
      'DESCRIPCION',
      'CANTIDAD',
      'UNIDAD',
      'EXPEDIENTE',
      'ETIQUETA',
      'ESTATUS',
      'CLASIFICADOR',
      'DESC_CLASIFICADOR',
      'COORDINACION_ADMIN',
      'ALMACEN',
      'UBICACION_ALMACEN',
      'CIUDAD_ALMACEN',
      'ESTADO_ALMACEN',
      'TRANSFERENTE',
      'EMISORA',
      'AUTORIDAD',
    ];

    const rows = data.map(item => {
      const values = [
        item.id,
        item.goodDescription,
        item.quantity,
        item.measurementUnit,
        item.fileNumber,
        item.labelNumber,
        item.goodStatus,
        item.clasif,
        item.goodSsType,
        item.adminCoord,
        item.warehouseNumber,
        item.warehouseUbication,
        item.warehouseCity,
        item.warehosueState,
        item.transfereeD,
        item.emisorAuthority,
        item.authority,
      ];
      return values.map(this.escapeCSVValue).join(',');
    });

    return headers.join(',') + '\n' + rows.join('\n');
  }

  escapeCSVValue(value: any): string {
    if (typeof value === 'string') {
      value = value.replace(/"/g, '""');
      if (value.includes(',') || value.includes('\n')) {
        value = `"${value}"`;
      }
    }
    return value;
  }

  onClose() {
    this.modalRef.hide();
  }

  insertGoods() {
    if (this.goodList.length > 0) {
      this.alertQuestion(
        'info',
        'Confirmación',
        '¿El paquete tiene bienes, se eliminan?'
      ).then(question => {
        if (question.isConfirmed) {
          let goodList: GoodsItem[] = [];

          goodList = this.goodSelection.map(good => {
            return {
              goodNumber: good.id,
              transfereeNumber: good.transfereeNumber,
              coordAdmin: good.adminCoord,
              fileNumber: good.fileNumber,
              goodDescription: good.goodDescription,
              unitMeasure: good.measurementUnit,
              quantity: good.quantity,
              val24: null,
              goodClassifyNumber: good.clasif,
              labelNumber: good.labelNumber,
              goodStatus: good.goodStatus,
              warehouseNumber: good.warehouseNumber,
            };
          });

          let data: PrepDestinationPackage = {
            packegeNumber: this.data.infoPack.package,
            goodsList: goodList,
          };
          this.packageGoodService.prepDestinationPackage(data).subscribe(
            response => {
              if (response) {
                this.onSentGoods.next(response.data);
                this.alert('success', 'Bienes ingresados', '');
                this.onClose();
              }
            },
            error => {
              this.alert('error', 'Se presentó un error inesperado', '');
            }
          );
        }
      });
    }
  }
}
