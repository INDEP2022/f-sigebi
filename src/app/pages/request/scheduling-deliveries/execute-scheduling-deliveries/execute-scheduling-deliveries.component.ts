import { Component, inject, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, map, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DocumentFormComponent } from '../../shared-request/document-form/document-form.component';
import { DeliveriesConstancyFormComponent } from '../deliveries-constancy-form/deliveries-constancy-form.component';
import { GOOD_DELIVERY_COLUMN } from './columns/good-delivery-columns';

@Component({
  selector: 'app-execute-scheduling-deliveries',
  templateUrl: './execute-scheduling-deliveries.component.html',
  styleUrls: ['./execute-scheduling-deliveries.scss'],
})
export class ExecuteSchedulingDeliveriesComponent
  extends BasePage
  implements OnInit
{
  showSearchForm: boolean = true;
  constancyDelivered: boolean = false;
  constancyNoDelivered: boolean = false;
  constancyNoAcept: boolean = false;
  constancyNoRetired: boolean = false;

  programmingDetailPanel: any = {};
  GoodDeliverySettings = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: 'multi',
  };
  goodDeliveryArray: any = [];
  goodParams = new BehaviorSubject<ListParams>(new ListParams());
  devgoodTotalItems: number = 0;
  goodDeliveryColumns = GOOD_DELIVERY_COLUMN;

  goodDeliveredSelected: any = [];

  private programmingService = inject(ProgrammingGoodService);
  private transferenteService = inject(TransferenteService);

  constructor(private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    this.getSchedulingDelivery();
    this.GoodDeliverySettings.columns = GOOD_DELIVERY_COLUMN;

    this.goodParams.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      if (this.programmingDetailPanel.id) {
        this.getProgrammingGoodDelivery(data);
      }
    });

    this.goodDeliveryColumns.amountDelivered = {
      ...this.goodDeliveryColumns.amountDelivered,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.setamountDelivered(data);
        });
      },
    };
  }

  certificateDelivery(constancy: number) {
    if (this.goodDeliveredSelected.length == 0) {
      this.onLoadToast('info', 'Debe tener al menos un bien seleccionado');
    }

    const comply = this.validateBeforeOpenModal(constancy);
    if (comply != true) return;

    const certificateDelivery = this.modalService.show(
      DeliveriesConstancyFormComponent,
      {
        initialState: {
          goods: this.goodDeliveredSelected,
          typeConstancy: constancy,
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }

  newDocument() {
    const newDocument = this.modalService.show(DocumentFormComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  editConstancy(data: any) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean) => {
          if (next) this.getSchedulingDelivery();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(DeliveriesConstancyFormComponent, config);
  }

  deleteConstancy(data: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar esta constancía?'
    ).then(question => {
      if (question.isConfirmed) {
        alert('Eliminado');
      }
    });
  }

  getSchedulingDelivery() {
    const params = new ListParams();
    params['filter.id'] = `$eq:${16896}`;
    this.programmingService
      .getProgrammingDelivery(params)
      .pipe(
        map((x: any) => {
          return x.data[0];
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.programmingDetailPanel.id = resp.id;
          this.programmingDetailPanel.typeEvent = resp.typeEvent;
          this.programmingDetailPanel.folio = resp.folio;
          this.programmingDetailPanel.store = resp.store;
          this.programmingDetailPanel.client = resp.client;
          this.programmingDetailPanel.startDate = resp.startDate;
          this.programmingDetailPanel.endDate = resp.endDate;
          this.programmingDetailPanel.typeUser = resp.typeUser;
          this.programmingDetailPanel.emailAddressCenterTe =
            resp.emailAddressCenterTe;
          this.programmingDetailPanel.status = resp.status;
          this.getTransferent(resp.transferId);

          this.getProgrammingGoodDelivery(new ListParams());
        },
      });
  }

  private getTransferent(id: number | string) {
    this.transferenteService.getById(id).subscribe({
      next: resp => {
        this.programmingDetailPanel.transferId = resp.nameTransferent;
      },
    });
  }

  getProgrammingGoodDelivery(params: ListParams) {
    this.loading = true;
    params[
      'filter.programmingDeliveryId'
    ] = `$eq:${this.programmingDetailPanel.id}`;
    this.programmingService.getProgrammingDeliveryGood(params).subscribe({
      next: (resp: any) => {
        this.goodDeliveryArray = resp.data;
        this.devgoodTotalItems = resp.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }

  selectRows(event: any) {
    console.log(event.selected);
    this.goodDeliveredSelected = event.selected;
  }

  setamountDelivered(data: any) {
    this.goodDeliveryArray.map((item: any) => {
      if (item.id == data.row.id) {
        item.amountDelivered = data.data;
      }
    });
  }

  validateBeforeOpenModal(typeEvent: number): any {
    for (let index = 0; index < this.goodDeliveredSelected.length; index++) {
      const item = this.goodDeliveredSelected[index];

      if (typeEvent == 1 && item.commercialEvent == null) {
        this.onLoadToast(
          'info',
          'El bien debe tener un evento comercial. Consulte a su administrador.'
        );
        return false;
      }

      let lsColumna = null;
      let lsColumnaTot = null;
      switch (typeEvent) {
        case 1:
          (lsColumna = item.amountDelivered), (lsColumnaTot = item.sunGoodEnt);
          break;
        case 2:
          lsColumna = item.CantidadNoEntregados;
          lsColumnaTot = item.sumGoodNoEnt;
          break;
        case 3:
          lsColumna = item.CantidadNoAceptados;
          lsColumnaTot = item.sumGoodNoAce;
          break;
        default:
          lsColumna = item.CantidadNoRetirados;
          lsColumnaTot = item.sumGoodNoRet;
          break;
      }
      if (lsColumna <= 0) {
        this.onLoadToast(
          'info',
          `El bien ${item.goodId} - ${item.inventoryNumber} - tiene un valor menor o igual a cero`
        );
        return false;
      }

      const goodAdded =
        item.sunGoodEnt +
        item.sumGoodNoEnt +
        item.sumGoodNoAce +
        item.sumGoodNoRet;
      const totalGood = item.amountGood;

      if (goodAdded > totalGood) {
        this.onLoadToast(
          'info',
          `El bien ${item.goodId} - ${item.inventoryNumber} - excede la cantidad permitida`
        );
        return false;
      }

      return true;
    }
  }
}
