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
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IFormalizeProcesses } from 'src/app/core/models/formalize-processes/formalize-processes.model';
import { IComerLotEvent } from 'src/app/core/models/ms-event/event.model';
import { ComerClientsService1 } from 'src/app/core/services/ms-customers/comer-clients-service';
import { FormalizeProcessService } from 'src/app/core/services/ms-formalize-processes/formalize-processes.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
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
  //columnFilters2: any = [];
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
    private lotParamsService: LotParamsService,
    private goodprocessService: GoodprocessService
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
    this.filterFor();
    this.filterAsigNot();
    this.filterFormaEsc();
    this.params4
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(() => {
          this.getTodos();
        })
      )
      .subscribe();
  }

  // ----------FILTER PROCEDE FORMALIZACIÓN ----------//

  filterFor() {
    this._dataTableProcedeFormalizacion
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('change - ', change);
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            console.log('filtr- ', filter.field);
            switch (filter.field) {
              case 'eventId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'processKey':
                field = 'filter.eventDetails.processKey';
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'goodNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                field = 'filter.goodDetails.description';
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'status':
                field = 'filter.lotDetails.idStatusVta';
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'idClient':
                field = 'filter.lotDetails.idClient';
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'dateIncorporado':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'jobNumber':
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
          this.params = this.pageFilter(this.params);
          this.getFormalizeProccess();
        }
      });

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getFormalizeProccess();
    });
  }

  // ----------FILTER ASIGNAR NOTARIOS ----------//
  filterAsigNot() {
    this._dataTableAsignaNotario
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change2 => {
        console.log('change222 - ', change2);
        if (change2.action === 'filter') {
          let filters = change2.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            console.log('filtr- ', filter.field);
            switch (filter.field) {
              case 'goodNumber':
                console.log('goodNumber', filter.field);
                searchFilter = SearchFilter.EQ;
                break;
              case 'eventId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'processKey':
                field = 'filter.eventDetails.processKey';
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'dateIncorporado':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'notaryCli':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'numNotaryCli':
                searchFilter = SearchFilter.EQ;
                break;
              case 'cityNotary':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'notaryIdterc':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'formalizador':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'dateAssignmentnotDate':
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
          this.params3 = this.pageFilter(this.params3);
          this.getStage2();
        }
      });

    this.params2.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getStage2();
    });
  }

  // ----------FILTER FORMALIZA ESCRITURACIÓN ----------//
  filterFormaEsc() {
    this._dataTableFormalizaEscrituracion
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change2 => {
        console.log('FILTRO 3 - ', change2);
        if (change2.action === 'filter') {
          let filters = change2.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'goodNumber':
                console.log('goodNumber --:', filter.field);
                searchFilter = SearchFilter.EQ;
                break;
              case 'eventId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'processKey':
                field = 'filter.eventDetails.processKey';
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'dateIncorporado':
                field = 'filter.date';
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'writingNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'dateWritingAntDate':
                searchFilter = SearchFilter.EQ;
                break;
              case 'writingAntNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'dateWritingDate':
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
          this.params3 = this.pageFilter(this.params3);
          this.getStage3();
        }
      });

    this.params3.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getStage3();
    });
  }

  // ----------FILTER TODOS ----------//
  filterTodos() {
    this._dataTableTodos
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change2 => {
        console.log('FILTRO 4 - ', change2);
        if (change2.action === 'filter') {
          let filters = change2.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'goodNumber':
                console.log('goodNumber --:', filter.field);
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'notary':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'formalizes':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'writing':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'days':
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
          this.params4 = this.pageFilter(this.params4);
          this.getTodos();
        }
      });

    this.params4.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getTodos();
    });
  }

  // ---------- PROCEDE FORMALIZACIÓN ----------//

  private getFormalizeProccess() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    params['filter.stage'] = `$eq:${1}`;
    console.log('PAR -> ', params);
    this.formalizeProcessService.getAll(params).subscribe(
      (response: any) => {
        console.log('AQUI - 1', response);
        let result = response.data.map(async (item: any) => {
          const client: any = await this.getClient(
            item.lotId == null ? '' : item.lotDetails.idClient
          );

          item['processKey'] =
            item.eventId == null ? '' : item.eventDetails.processKey;
          item['idClient'] = client == null ? '' : client;
          item['description'] =
            item.goodDetails?.description == null
              ? 'SIN DESCRIPCIÓN'
              : item.goodDetails?.description;
          console.log('ENTRA DES -->', item.goodDetails?.description);
          // if (item.goodDetails && item.goodDetails.description != null) {
          //   item['description'] = item.goodDetails.description;
          // } else {
          //   item['description'] = '';
          // }

          if (item.lotId) {
            item['status'] =
              item.lotDetails.idStatusVta == null
                ? 'INVA'
                : item.lotDetails.idStatusVta;
          } else {
            item['status'] = 'INVA';
          }

          if (item.date) {
            let date = new Date(item.date);
            item['dateIncorporado'] = await this.formatDate(date);
          } else {
            item['dateIncorporado'] = '';
          }
        });

        Promise.all(result).then(data => {
          this._dataTableProcedeFormalizacion.load(response.data);
          this._dataTableProcedeFormalizacion.refresh();
          // this._dataTableProcedeFormalizacion = response.data;
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

  async formatDate(date: any) {
    let day = date.getDate() + 1;
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
          this.getTodos();
          let obj = {
            icon: 'success',
            title: 'Procede Formalización',
            message: 'Enviado correctamente a la siguiente etapa',
          };

          this.handleSuccess(obj);
        },
        error: error => {
          let obj = {
            icon: 'error',
            title: 'Error',
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
      ...this.columnFilters,
    };
    params['filter.stage'] = `$eq:${2}`;
    console.log('PAR 2 -> ', params);
    this.formalizeProcessService.getAll(params).subscribe(
      (response: any) => {
        console.log('AQUI - 2', response);
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

          if (item.date != null) {
            let date = new Date(item.date);
            item['dateIncorporado'] = await this.formatDate(date);
          } else {
            item['dateIncorporado'] = '';
          }

          if (item.assignmentnotDate != null) {
            let date = new Date(item.assignmentnotDate);
            item['dateAssignmentnotDate'] = await this.formatDate(date);
          } else {
            item['dateAssignmentnotDate'] = '';
          }
        });

        Promise.all(result).then(data => {
          this._dataTableAsignaNotario.load(response.data);
          this._dataTableAsignaNotario.refresh();
          console.log('Datos regresados: ', this._dataTableAsignaNotario);
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
    console.log('br -->', _data.lotId);
    if (_data.lotId) {
      this.loading = true;
      let params = {
        ...this.params.getValue(),
      };
      params['filter.idLot'] = `$eq:${_data.lotId}`;
      console.log('br -->', _data.lotId);
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
              this.getTodos();
              let obj = {
                icon: 'success',
                title: 'Asigna Notario',
                message: 'Enviado correctamente a la siguiente etapa',
              };

              this.handleSuccess(obj);
            },
            error: error => {
              let obj = {
                icon: 'error',
                title: 'Error',
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
            'Error',
            'El bien no ha sido liquidado, y no se puede proceder a la escrituración'
          );
          this.ngOnInit();
          console.log('Error', error.error.message);
        },
      });
      console.log('dataaa ->', _data);
    } else {
      let obj = {
        icon: 'warning',
        title: 'ID del Lote',
        message: 'ID del lote vacío',
      };
      this.handleSuccess(obj);
    }
  }

  // ------------- FORMALIZA ESCRITURACIÓN ------------//
  private getStage3() {
    this.loading = true;
    let params = {
      ...this.params3.getValue(),
      ...this.columnFilters,
    };
    params['filter.stage'] = `$eq:${3}`;
    this.formalizeProcessService.getAll(params).subscribe(
      (response: any) => {
        let result = response.data.map(async (item: any) => {
          item['processKey'] =
            item.eventId == null
              ? 'Evento Inválido'
              : item.eventDetails.processKey;

          if (item.date != null) {
            let date = new Date(item.date);
            item['dateIncorporado'] = await this.formatDate(date);
          } else {
            item['dateIncorporado'] = '';
          }

          if (item.writingAntDate != null) {
            let date = new Date(item.writingAntDate);
            item['dateWritingAntDate'] = await this.formatDate(date);
          } else {
            item['dateWritingAntDate'] = '';
          }

          if (item.writingDate) {
            let date = new Date(item.writingDate);
            item['dateWritingDate'] = await this.formatDate(date);
          } else {
            item['dateWritingDate'] = '';
          }
        });

        Promise.all(result).then(data => {
          this._dataTableFormalizaEscrituracion.load(response.data);
          this._dataTableFormalizaEscrituracion.refresh();
          console.log(
            'Datos regresados 3 : ',
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

  // -------------------- TODOS --------------------//
  private getTodos() {
    this.loading = true;
    let params = {
      ...this.params4.getValue(),
      ...this.columnFilters,
    };

    this.goodprocessService.getTodos(params).subscribe(
      (response: any) => {
        console.log('AQUI', response);
        // let result = response.data.map(async (item: any) => {
        // Promise.all(result).then(data => {
        this._dataTableTodos = response.data;
        this.totalItems4 = response.count;
        this.loading = false;
        // });
      },
      error => (console.log('ERR', error), (this.loading = false))
    );
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
          resolve('Sin cliente');
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
