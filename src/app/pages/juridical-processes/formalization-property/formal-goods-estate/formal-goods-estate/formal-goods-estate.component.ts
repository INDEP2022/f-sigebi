/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  ASIGN_NOTARIES_COLUMNS,
  // dataTableAsignaNotario,
  // dataTableFormalizaEscrituracion,
  ESCRITURACION_COLUMNS,
  FORMALIZACION_COLUMNS,
  TABLE_SETTINGS2,
  TABLE_SETTINGS3,
  TABLE_SETTINGS4,
  TODOS_COLUMNS,
} from './table-configuration-formal-goods-estate';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil, tap } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IFormalizeProcesses } from 'src/app/core/models/formalize-processes/formalize-processes.model';
import { IComerLotEvent } from 'src/app/core/models/ms-event/event.model';
import { ComerClientsService1 } from 'src/app/core/services/ms-customers/comer-clients-service';
import { FormalizeProcessService } from 'src/app/core/services/ms-formalize-processes/formalize-processes.service';
import { LotParamsService } from 'src/app/core/services/ms-lot-parameters/lot-parameters.service';
import { FormAsignNotaryComponent } from '../form-asign-notary/form-asign-notary.component';
import { FormEscrituracionComponent } from '../form-escrituracion/form-escrituracion.component';
import { FormProcedeFormalizacionComponent } from '../form-procede-formalizacion/form-procede-formalizacion.component';
/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-formal-goods-estate',
  templateUrl: './formal-goods-estate.component.html',
  styleUrls: ['./formal-goods-estate.component.scss'],
})
export class FormalGoodsEstateComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  // ------------------ PROCEDE FORMALIZACIÓN ------------------ //
  _dataTableProcedeFormalizacion: LocalDataSource = new LocalDataSource();
  _tableSettingsProcedeFormalizacion = { ...TABLE_SETTINGS2 };
  columnFilters: any = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  // ------------------ ASIGNA NOTARIO ------------------ //
  _dataTableAsignaNotario: LocalDataSource = new LocalDataSource();
  _tableSettingsAsignaNotario = { ...TABLE_SETTINGS2 };
  columnFilters2: any = [];
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  // ------------------ Formaliza Escrituracion ------------------ //
  _tableSettingsFormalizaEscrituracion = { ...TABLE_SETTINGS3 };
  _dataTableFormalizaEscrituracion: LocalDataSource = new LocalDataSource();
  columnFilters3: any = [];
  totalItems3: number = 0;
  params3 = new BehaviorSubject<ListParams>(new ListParams());

  // ------------------ Todos ------------------ //
  _tableSettingsTodos = { ...TABLE_SETTINGS4 };
  _dataTableTodos: LocalDataSource = new LocalDataSource();
  columnFilters4: any = [];
  totalItems4: number = 0;
  params4 = new BehaviorSubject<ListParams>(new ListParams());

  comerLotEvent: IComerLotEvent[] = [];
  constructor(
    private formalizeProcessService: FormalizeProcessService,
    private modalService: BsModalService,
    private comerClientsService1: ComerClientsService1,
    private lotParamsService: LotParamsService
  ) {
    super();

    // ------------------ Procede Formalización ------------------ //
    this._tableSettingsProcedeFormalizacion.columns = FORMALIZACION_COLUMNS;
    this._tableSettingsProcedeFormalizacion.actions.delete = true;
    this._tableSettingsProcedeFormalizacion = {
      ...this._tableSettingsProcedeFormalizacion,
      hideSubHeader: false,
    };

    // ----------------- Asignación de Notarios ------------------ //
    this._tableSettingsAsignaNotario.columns = ASIGN_NOTARIES_COLUMNS;
    this._tableSettingsAsignaNotario.actions.delete = true;
    this._tableSettingsAsignaNotario = {
      ...this._tableSettingsAsignaNotario,
      hideSubHeader: false,
    };

    // ----------------- Formaliza Escrituración ------------------ //
    this._tableSettingsFormalizaEscrituracion.columns = ESCRITURACION_COLUMNS;
    this._tableSettingsFormalizaEscrituracion.actions.delete = false;
    this._tableSettingsFormalizaEscrituracion = {
      ...this._tableSettingsFormalizaEscrituracion,
      hideSubHeader: false,
    };

    // ----------------- Todos ------------------ //
    this._tableSettingsTodos.columns = TODOS_COLUMNS;
    // this._tableSettingsTodos.actions.delete = false;
    this._tableSettingsTodos = {
      ...this._tableSettingsTodos,
      hideSubHeader: false,
    };
  }

  ngOnInit(): void {
    this.settingColumns();
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(() => {
          this.getFormalizeProccess();
          this.getStage2();
          this.getStage3();
        })
      )
      .subscribe();
  }

  // ---------- PROCEDE FORMALIZACIÓN ----------//
  private getFormalizeProccess() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    params['filter.stage'] = `$eq:${1}`;

    this.formalizeProcessService.getAll(params).subscribe(
      (response: any) => {
        let result = response.data.map(async (item: any) => {
          const client: any = await this.getClient(
            item.lotId == null ? '' : item.lotDetails.idClient
          );

          item['processKey'] =
            item.eventId == null ? '' : item.eventDetails.processKey;
          item['idClient'] = client == null ? '' : client;
          item['description'] =
            item.goodDetails.description == null
              ? 'SIN DESCRIPCIÓN'
              : item.goodDetails.description;

          if (item.lotId) {
            item['status'] =
              item.lotDetails.idStatusVta == null
                ? 'INVA'
                : item.lotDetails.idStatusVta;
          } else {
            item['status'] = 'INVA';
          }
        });

        Promise.all(result).then(data => {
          this._dataTableProcedeFormalizacion = response.data;
          console.log(
            'Datos regresados: ',
            this._dataTableProcedeFormalizacion
          );
          this.totalItems = response.count;
          this.loading = false;
        });
      },
      error => (this.loading = false)
    );
  }
  edit(dataFormalize: IFormalizeProcesses) {
    this.openModal({ dataFormalize });
  }
  openModal(context?: Partial<FormProcedeFormalizacionComponent>) {
    const modalRef = this.modalService.show(FormProcedeFormalizacionComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    // modalRef.content.data.subscribe((resp: any) => {

    //   const updatedItem = { jobNumber: resp.oficioDCBI };
    //   const data: any = this._dataTableProcedeFormalizacion.prepareData();
    //   console.log("HOLA", data)
    //   const index = data.findIndex((item: any) => item.goodNumber === resp.goodNumber && item.eventId === resp.eventId);
    //   console.log("AQUI", index)
    //   if (index !== -1) {
    //     console.log("SI")
    //     this._dataTableProcedeFormalizacion.update(index, updatedItem);

    //   }

    // });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getFormalizeProccess();
    });
  }
  goNotaries(_data: any) {
    if (_data.jobNumber) {
      const sysdate = new Date();
      let params: any = {
        eventId: _data.eventId,
        goodNumber: _data.goodNumber,
        stage: 2,
        date: sysdate,
        lotId: _data.lotId,
      };

      this.formalizeProcessService.create(params).subscribe({
        next: (data: any) => {
          this.getStage2();

          let obj = {
            icon: 'success',
            title: 'PROCEDE FORMALIZACIÓN',
            message: 'Enviado correctamente a la siguiente etapa',
          };

          this.handleSuccess(obj);
        },
        error: error => {
          let obj = {
            icon: 'error',
            title: 'ERROR',
            message: error.error.message,
          };

          this.handleSuccess(obj);

          console.log('Error', error.error.message);
        },
      });
    } else {
      let obj = {
        icon: 'warning',
        title: 'Oficio DCBI',
        message: 'Debe especificar el número de oficio de la DCBMI',
      };
      this.handleSuccess(obj);
    }
  }

  // ------------- ASIGNAR NOTARIOS ------------//
  private getStage2() {
    this.loading = true;
    let params = {
      ...this.params2.getValue(),
      ...this.columnFilters2,
    };
    params['filter.stage'] = `$eq:${2}`;

    this.formalizeProcessService.getAll(params).subscribe(
      (response: any) => {
        let result = response.data.map(async (item: any) => {
          item['processKey'] =
            item.eventId == null
              ? 'Evento Inválido'
              : item.eventDetails.processKey;
          item['formalizador'] =
            item.notaryIdterc == null
              ? 'SIN NOTARIO'
              : item.notaryDetails.name + ' ' + item.notaryDetails.lastName;
          item['notaryCli'] = item.notaryCli ? item.notaryCli : '';
        });

        Promise.all(result).then(data => {
          this._dataTableAsignaNotario = response.data;
          // console.log('Datos regresados2: ', this._dataTableAsignaNotario);
          this.totalItems2 = response.count;
          this.loading = false;
        });
      },
      error => (this.loading = false)
    );
  }
  editStage2(dataNotary: IFormalizeProcesses) {
    this.openModalStage2({ dataNotary });
  }
  openModalStage2(context?: Partial<FormAsignNotaryComponent>) {
    const modalRef = this.modalService.show(FormAsignNotaryComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getStage2();
    });
  }
  goEscrituracion(_data: any) {
    if (_data.lotId) {
      this.loading = true;
      let params = {
        ...this.params.getValue(),
      };
      params['filter.idLot'] = `$eq:${_data.lotId}`;
      params['filter.idStatusVta'] = `$eq:PAG`;

      this.lotParamsService.getAllWithParams(params).subscribe({
        next: (data: any) => {
          const sysdate = new Date();
          let params: any = {
            eventId: _data.eventId,
            goodNumber: _data.goodNumber,
            stage: 3,
            date: sysdate,
            lotId: _data.lotId,
          };

          this.formalizeProcessService.create(params).subscribe({
            next: (data: any) => {
              this.getStage3();

              let obj = {
                icon: 'success',
                title: 'ASIGNA NOTARIO',
                message: 'Enviado correctamente a la siguiente etapa',
              };

              this.handleSuccess(obj);
            },
            error: error => {
              let obj = {
                icon: 'error',
                title: 'ERROR',
                message: error.error.message,
              };

              this.handleSuccess(obj);

              console.log('Error', error.error.message);
            },
          });
        },
        error: error => {
          this.alert(
            'warning',
            'ERROR',
            'El bien no ha sido liquidado, y no se puede proceder a la escrituración'
          );

          console.log('Error', error.error.message);
        },
      });
    } else {
      let obj = {
        icon: 'warning',
        title: 'ID DEL LOTE',
        message: 'ID del Lote es Null',
      };
      this.handleSuccess(obj);
    }
  }

  // ------------- FORMALIZA ESCRITURACIÓN ------------//
  private getStage3() {
    this.loading = true;
    let params = {
      ...this.params3.getValue(),
      ...this.columnFilters3,
    };
    params['filter.stage'] = `$eq:${3}`;

    this.formalizeProcessService.getAll(params).subscribe(
      (response: any) => {
        let result = response.data.map(async (item: any) => {
          item['processKey'] =
            item.eventId == null
              ? 'Evento Inválido'
              : item.eventDetails.processKey;
        });

        Promise.all(result).then(data => {
          this._dataTableFormalizaEscrituracion = response.data;
          console.log(
            'Datos regresados3: ',
            this._dataTableFormalizaEscrituracion
          );
          this.totalItems3 = response.count;
          this.loading = false;
        });
      },
      error => (this.loading = false)
    );
  }
  editStage3(dataEscritracion: IFormalizeProcesses) {
    this.openModalStage3({ dataEscritracion });
  }
  openModalStage3(context?: Partial<FormEscrituracionComponent>) {
    const modalRef = this.modalService.show(FormEscrituracionComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getStage3();
    });
  }

  // ------------------------ EXTRAS -------------------------- //
  getClient(id: any) {
    return new Promise((resolve, reject) => {
      this.comerClientsService1.getById(id).subscribe({
        next: (resp: any) => {
          console.log(resp);
          const data = resp.reasonName;
          // const data = resp.data[0].reasonName;
          resolve(data);
        },
        error: (error: any) => {
          resolve('SIN CLIENTE');
        },
      });
    });
  }
  handleSuccess(obj: any) {
    this.onLoadToast(obj.icon, obj.title, obj.message);
    this.loading = false;
  }
  settingColumns() {
    this._tableSettingsProcedeFormalizacion.columns = FORMALIZACION_COLUMNS;
    this._tableSettingsAsignaNotario.columns = ASIGN_NOTARIES_COLUMNS;
    this._tableSettingsFormalizaEscrituracion.columns = ESCRITURACION_COLUMNS;
    this._tableSettingsTodos.columns = TODOS_COLUMNS;
  }
}
