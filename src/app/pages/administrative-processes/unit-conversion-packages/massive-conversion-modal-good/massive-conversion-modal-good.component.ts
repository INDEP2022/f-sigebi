import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, map, of, switchMap } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { LabelOkeyService } from 'src/app/core/services/catalogs/label-okey.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { BasePage } from 'src/app/core/shared';
import { GOODS_SELECTIONS_COLUMNS } from '../massive-conversion/columns';

interface FormFields {
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
  data: FormFields;
  totalItems: number = 30;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalRef: BsModalRef,
    private delegationService: DelegationService,
    private labelService: LabelOkeyService,
    private transferenteService: TransferenteService,
    private serviceW: WarehouseService
  ) {
    super();
    this.settings = {
      ...this.settings,

      actions: { add: false, delete: false, edit: false },
      columns: GOODS_SELECTIONS_COLUMNS,
    };
  }

  ngOnInit() {
    if (this.data) {
      this.getDelegationDescription(this.data.delegation);
      this.getLabelDescription(this.data.targetTag);
      this.getTransferentName(this.data.transferent);
      this.getWarehouseDescription(this.data.warehouse);
    }
  }

  getDelegationDescription(delegationId: string) {
    const params = new ListParams();
    params['filter.id'] = delegationId;

    this.delegationService
      .getAll(params)
      .pipe(
        switchMap(res => {
          this.data.descDelegation = res.data[0].description;
          return this.getLabelDescription(this.data.targetTag);
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

    return this.labelService.getAll(params).pipe(
      switchMap(res => {
        this.data.descTargetTag = res.data[0].description;
        return this.getTransferentName(this.data.transferent);
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

  getTransferentName(transferentId: string) {
    const params = new ListParams();
    params['filter.id'] = transferentId;

    return this.transferenteService.getAll(params).pipe(
      map(res => {
        this.data.descTransferent = res.data[0].nameTransferent;
        return this.getWarehouseDescription(this.data.warehouse);
      }),
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
        this.data.warehouseDesc = res.data[0].description;
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

  onClose() {
    this.modalRef.hide();
  }
}
