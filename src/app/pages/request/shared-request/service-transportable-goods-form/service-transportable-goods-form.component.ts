import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, of, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { orderentryService } from 'src/app/core/services/ms-comersale/orderentry.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  SERVICE_TRANSPORTABLE_COLUMNS,
  SERVICE_TRANSPORTABLE_COLUMNS_CAPTURE,
  SERVICE_TRANSPORTABLE_COLUMNS_READONLY,
} from '../../reception-scheduling-service-order/columns/service-transportable-columns';
import { CreateManualServiceFormComponent } from '../../reception-scheduling-service-order/components/create-manual-service-form/create-manual-service-form.component';
import { CreateServiceFormComponent } from '../../reception-scheduling-service-order/components/create-service-form/create-service-form.component';
import { RequestHelperService } from '../../request-helper-services/request-helper.service';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { isNullOrEmpty } from '../../request-complementary-documentation/request-comp-doc-tasks/request-comp-doc-tasks.component';

@Component({
  selector: 'app-service-transportable-goods-form',
  templateUrl: './service-transportable-goods-form.component.html',
  styleUrls: ['./service-transportable-goods.scss'],
})
export class ServiceTransportableGoodsFormComponent
  extends BasePage
  implements OnInit, OnChanges {
  @ViewChild('table', { static: false }) table: any;
  @Input() op: number;
  @Input() showForm: boolean;
  @Input() rejected: boolean;
  @Input() orderServiceId: number;
  @Input() isUpdate?: boolean = false;
  @Input() typeOrder?: string = null;
  @Input() justificationRefused: boolean = false;
  @Input() typeTable: string = '';
  title: string = '';
  @Input() editable: boolean = true;
  showButtonServiceManual: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  ordersSelected: any = [];

  listforUpdate: any = [];
  columns: any;
  data: any[] = [];
  @Output() totEvent: EventEmitter<string> = new EventEmitter();
  totalAmount: string = '0.00';

  private orderEntryService = inject(orderentryService);
  private requestHelperService = inject(RequestHelperService);

  constructor(private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    this.configTable();

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      //verificar si existe el order service id
      if (this.orderServiceId != null) {
        this.getOrderServiceProvided();
      }
    });
  }

  configTable() {

    this.getOrderServiceProvided();
    if (this.typeOrder != 'reception') {
      this.columns = SERVICE_TRANSPORTABLE_COLUMNS;
      this.settings = {
        ...TABLE_SETTINGS,
        actions: false,
        selectMode: this.typeTable,
        columns: this.columns,
      };

      this.titleTab();
      this.showButtonServiceManual = true;

      this.columns.resourcesReal = {
        ...this.columns.resourcesReal,
        onComponentInitFunction: (instance?: any) => {
          instance.input.subscribe((data: any) => {
            //this.setResourcesReal(data);
          });
        },
      };

      this.columns.descriptionDifference = {
        ...this.columns.descriptionDifference,
        onComponentInitFunction: (instance?: any) => {
          instance.input.subscribe((data: any) => {
            //this.setDescriptionDifference(data);
          });
        },
      };

      this.columns.resultAssessment = {
        ...this.columns.resultAssessment,
        onComponentInitFunction: (instance?: any) => {
          instance.input.subscribe((data: any) => {
            //this.setResulAssessment(data);
          });
        },
      };

      this.columns.amountNumbercomplies = {
        ...this.columns.amountNumbercomplies,
        onComponentInitFunction: (instance?: any) => {
          instance.input.subscribe((data: any) => {
            //this.setAmountNumbercomplies(data);
          });
        },
      };

      this.columns.porcbreaches = {
        ...this.columns.porcbreaches,
        onComponentInitFunction: (instance?: any) => {
          instance.input.subscribe((data: any) => {
            //this.setPorcbreaches(data);
          });
        },
      };

      /*this.columns.selected = {
        ...this.columns.selected,
        onComponentInitFunction: (instance?: any) => {
          console.log('instance', instance);
          instance.input.subscribe((data: any) => {
            console.log('instance', data);

            this.orderSelected(data)
          });
        },
      };*/


    } else {
      this.columns = !this.editable ? SERVICE_TRANSPORTABLE_COLUMNS_READONLY : SERVICE_TRANSPORTABLE_COLUMNS_CAPTURE;

      this.titleTab();
      this.showButtonServiceManual = true;
      this.settings = {
        ...TABLE_SETTINGS,
        actions: false,
        selectMode: this.typeTable,
        columns: this.columns,
      };

      this.columns.commentService = {
        ...this.columns.commentService,
        onComponentInitFunction: (instance?: any) => {
          instance.input.subscribe((data: any) => {
            this.setValues('commentService', data);
          });
        },
      };

      this.columns.durationTime = {
        ...this.columns.durationTime,
        onComponentInitFunction: (instance?: any) => {
          instance.input.subscribe((data: any) => {
            this.setValues('durationTime', data);
          });
        },
      };

      this.columns.resourcesNumber = {
        ...this.columns.resourcesNumber,
        onComponentInitFunction: (instance?: any) => {
          instance.input.subscribe((data: any) => {
            this.setValues('resourcesNumber', data);
          });
        },
      };

    }


  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.orderServiceId && this.data.length == 0) {
      this.getOrderServiceProvided();
    }
    if (this.isUpdate == true) {
      this.saveForm();
    }

    if (!isNullOrEmpty(changes['editable'])) {
      this.configTable();
    }

  }

  getOrderServiceProvided() {
    /**
     * Obtener la data por el orderServiceId
     */
    const params = new ListParams();
    params['filter.orderServiceId'] = `$eq:${this.orderServiceId}`;
    //params['filter.orderServiceId'] = 516;
    this.orderEntryService
      .getAllOrderServicesProvided(params)
      .pipe(
        catchError((e: any) => {
          if (e.status == 400) return of({ data: [], count: 0 });
          throw e;
        })
      )
      .subscribe({
        next: resp => {

          this.data = resp.data;
          this.totalItems = resp.count;
          this.setTotalAmount();

          //this.setTableRowTotal();
          //this.setTableColumnsRows();

          if (
            this.op != 1 &&
            this.op != 2 &&
            this.op != 3 &&
            this.op != 6 &&
            this.op != 7 &&
            this.op != 8 &&
            this.op != 9
          ) {


          }
        },
      });
  }

  setTotalAmount() {
    let ttotal = 0;
    this.data.map((item: any) => {
      if (this.op == 6 || this.op == 7 || this.op == 8 || this.op == 9) {
        this.requestHelperService.changeReadOnly(true);
      }
      const resourceNumber = isNullOrEmpty(item.resourcesNumber) ? 0 : Number(item.resourcesNumber);
      const priceUnitary = isNullOrEmpty(item.priceUnitary) ? 0 : Number(item.priceUnitary);
      const durationTime = isNullOrEmpty(item.durationTime) ? 0 : Number(item.durationTime);

      item.durationTime = durationTime;
      item.resourcesNumber = resourceNumber;
      item.priceUnitary = priceUnitary;

      item.total = (durationTime * priceUnitary) * resourceNumber;
      ttotal += item.total;
    });

    console.log('ttotal', this.data.map((item: any) => item.total));

    const t = `$${this.formatTotalAmount(ttotal)}`;
    this.totalAmount = t;
    this.totEvent.emit(t);
    //const bodyTotal: any = { total: t };
    //resp.data.push(bodyTotal);
    this.data = [... this.data];
  }

  setTableColumnsRows() {
    setTimeout(() => {
      const tableColumn = this.table.grid.getColumns();
      let noResources = tableColumn.find((x: any) => x.id == 'resourcesReal');
      let amountNumbercomplies = tableColumn.find(
        (x: any) => x.id == 'amountNumbercomplies'
      );
      let porcbreaches = tableColumn.find((x: any) => x.id == 'porcbreaches');
      let resultAssessment = tableColumn.find(
        (x: any) => x.id == 'resultAssessment'
      );
      let descriptionDifference = tableColumn.find(
        (x: any) => x.id == 'descriptionDifference'
      );

      if (
        (this.op == 3 && this.typeOrder == 'reception') ||
        this.op == 4 ||
        this.op == 10 ||
        this.op == 11 ||
        this.op == 12 ||
        this.op == 13 ||
        this.op == 14 ||
        this.op == 15
      ) {
        noResources.hide = true;
        resultAssessment.hide = true;
        amountNumbercomplies.hide = true;
        porcbreaches.hide = true;
        descriptionDifference.hide = true;
      }

      if (this.op == 5 && this.typeOrder != 'reception') {
        noResources.hide = true;
        resultAssessment.hide = true;
        amountNumbercomplies.hide = true;
        porcbreaches.hide = true;
        descriptionDifference.hide = true;
      }

      if (
        this.op == 4 ||
        this.op == 5 ||
        this.op == 2 ||
        this.op == 13 ||
        this.op == 15
      ) {
        if (this.op != 2) {
          noResources.hide = false;
          descriptionDifference.hide = false;
        }
      }

      if (this.op == 12) {
        descriptionDifference.hide = false;
      }

      let table = null;
      table = document.getElementById('table');
      let tbody = table.children[0].children[1].children;
      //readonly duracion
      if (
        this.op == 1 ||
        this.op == 2 ||
        this.op == 3 ||
        this.op == 4 ||
        this.op == 5 ||
        this.op == 6 ||
        this.op == 7 ||
        this.op == 8 ||
        this.op == 9 ||
        this.op == 10 ||
        this.op == 11 ||
        this.op == 12 ||
        this.op == 13 ||
        this.op == 14 ||
        this.op == 15
      ) {
        for (let index = 0; index < tbody.length - 1; index++) {
          const ele: any = tbody[index];
          if (this.op != 2) {
            if (
              this.op != 3 &&
              this.op != 6 &&
              this.op != 7 &&
              this.op != 8 &&
              this.op != 9
            ) {
              ele.children[8].children[0].children[0].children[0].children[0].children[0].children[0].children[0].disabled =
                true;
              //ele.children[8].querySelector('#text-input').disabled = true;
              ele.children[9].querySelector('#text-input').disabled = true;
            }
          } else if (this.op == 2 || this.op == 1) {
            ele.children[4].querySelector('#text-input').disabled = true;
            ele.children[5].querySelector('#text-input').disabled = true;
            ele.children[6].querySelector('#text-input').disabled = true;
          }

          if (!this.typeOrder && this.op == 3) {
            ele.children[4].querySelector('#text-input').disabled = true;
            ele.children[5].querySelector('#text-input').disabled = true;
            ele.children[6].querySelector('#text-input').disabled = true;
          }

          if ((this.op == 3 || this.op == 4) && this.typeOrder == 'reception') {
            //Comentario de servicio
            ele.children[7].querySelector('#text-input').disabled = true;
          }

          if (this.op == 5) {
            if (this.typeOrder == 'reception') {
              ele.children[7].querySelector('#text-input').disabled = true;
            } else {
              ele.children[7].querySelector('#text-input').disabled = true;
              ele.children[8].querySelector('#text-input').disabled = true;
              ele.children[9].querySelector('#text-input').disabled = true;
              ele.children[10].querySelector('#text-input').disabled = true;
              ele.children[13].querySelector('#text-input').disabled = true;
            }
          }

          if (
            (this.op == 6 && this.typeOrder == 'reception') ||
            (this.op == 7 && this.typeOrder == 'reception') ||
            (this.op == 8 && this.typeOrder == 'reception') ||
            (this.op == 9 && this.typeOrder == 'reception')
          ) {
            ele.children[2].querySelector('#text-input').disabled = true;
            ele.children[3].querySelector('#text-input').disabled = true;
            ele.children[7].querySelector('#text-input').disabled = true;
            ele.children[10].querySelector('#text-input').disabled = true;
            ele.children[13].querySelector('#text-input').disabled = true;
          }

          if (this.op == 6) {
            ele.children[4].querySelector('#text-input').disabled = true;
            ele.children[5].querySelector('#text-input').disabled = true;
            ele.children[6].querySelector('#text-input').disabled = true;
          }

          if (this.op == 7) {
            ele.children[4].querySelector('#text-input').disabled = true;
            ele.children[5].querySelector('#text-input').disabled = true;
            ele.children[6].querySelector('#text-input').disabled = true;
          }

          if (this.op == 8) {
            ele.children[4].querySelector('#text-input').disabled = true;
            ele.children[5].querySelector('#text-input').disabled = true;
            ele.children[6].querySelector('#text-input').disabled = true;
          }

          if (this.op == 9) {
            ele.children[4].querySelector('#text-input').disabled = true;
            ele.children[5].querySelector('#text-input').disabled = true;
            ele.children[6].querySelector('#text-input').disabled = true;
          }

          if (this.op == 10 || this.op == 11 || this.op == 15) {
            ele.children[7].querySelector('#text-input').disabled = true;
            ele.children[8].querySelector('#text-input').disabled = true;
            ele.children[9].querySelector('#text-input').disabled = true;
          }

          if (this.op == 12 || this.op == 13) {
            ele.children[7].querySelector('#text-input').disabled = true;
            ele.children[8].querySelector('#text-input').disabled = true;
            ele.children[9].querySelector('#text-input').disabled = false;
            ele.children[13].querySelector('#text-input').disabled = false;
          }

          if (this.op == 13) {
            ele.children[7].querySelector('#text-input').disabled = true;
            ele.children[8].querySelector('#text-input').disabled = true;
            ele.children[9].querySelector('#text-input').disabled = true;
            ele.children[10].querySelector('#text-input').disabled = true;
            ele.children[13].querySelector('#text-input').disabled = true;
          }

          if (this.op == 14) {
            ele.children[7].querySelector('#text-input').disabled = false;
            ele.children[8].querySelector('#text-input').disabled = false;
            ele.children[9].querySelector('#text-input').disabled = false;
          }
        }
      }
    }, 300);
  }

  setTableRowTotal() {
    setTimeout(() => {
      if (
        this.op != 1 &&
        this.op != 2 &&
        this.op != 3 &&
        this.op != 6 &&
        this.op != 7 &&
        this.op != 8 &&
        this.op != 9
      ) {
        const tableColumn = this.table.grid.getColumns();
        let noResources = tableColumn.find((x: any) => x.id == 'resourcesReal');
        let descriptionDifference = tableColumn.find(
          (x: any) => x.id == 'descriptionDifference'
        );
        const resultAssessment = tableColumn.find(
          (x: any) => x.id == 'resultAssessment'
        );
        const amountNumbercomplies = tableColumn.find(
          (x: any) => x.id == 'amountNumbercomplies'
        );
        const porcbreaches = tableColumn.find(
          (x: any) => x.id == 'porcbreaches'
        );
        const resourcesReal = tableColumn.find(
          (x: any) => x.id == 'resourcesReal'
        );

        const table = document.getElementById('table');
        const tbody = table.children[0].children[1].children;
        const row: any = tbody[this.data.length - 1];
        //select

        row.children[0].querySelector('#checkbox-input').hidden = true;
        if (resultAssessment.hide == false) {
          //result evaluacion
          row.children[1].querySelector('#select-input').hidden = true;
        }
        if (amountNumbercomplies.hide == false) {
          //bi recur no cumple
          row.children[2].querySelector('#text-input').hidden = true;
        }
        if (porcbreaches.hide == false) {
          //incumpli %
          row.children[3].querySelector('#text-input').hidden = true;
        }
        //Si los 3 campos del principio estan enable
        if (resultAssessment.hide == false) {
          //comentario de servicio
          row.children[7].querySelector('#text-input').hidden = true;
          //duracion horas
          row.children[8].querySelector('#text-input').hidden = true;
          //no. recurso
          row.children[9].querySelector('#text-input').hidden = true;

          if (resourcesReal.hide == false) {
            //recurso real
            row.children[10].querySelector('#text-input').hidden = true;
          }
          //Si los 3 primeros campos esta disabled
        } else {
          //comentario de servicio
          row.children[4].querySelector('#text-input').hidden = true;
          //duracion horas
          row.children[5].querySelector('#text-input').hidden = true;
          //no. recurso
          row.children[6].querySelector('#text-input').hidden = true;

          if (resourcesReal.hide == false) {
            //recurso real
            row.children[7].querySelector('#text-input').hidden = true;
          }
        }

        if (descriptionDifference.hide == false) {
          if (this.op == 12) {
            row.children[9].querySelector('#text-input').hidden = true;
          } else {
            //descrip de diferencia
            if (porcbreaches.hide == false) {
              row.children[13].querySelector('#text-input').hidden = true;
            } else {
              row.children[10].querySelector('#text-input').hidden = true;
            }
          }
        }
      } else if (
        this.op == 1 ||
        this.op == 2 ||
        this.op == 3 ||
        this.op == 6 ||
        this.op == 7 ||
        this.op == 8 ||
        this.op == 9
      ) {
        const table = document.getElementById('table');
        const tbody = table.children[0].children[1].children;
        const row: any = tbody[this.data.length - 1];

        row.children[0].querySelector('#checkbox-input').hidden = true;
        row.children[4].querySelector('#text-input').hidden = true;
        row.children[5].querySelector('#text-input').hidden = true;
        row.children[6].querySelector('#text-input').hidden = true;
      }
    }, 300);
  }

  formatTotalAmount(numberParam: number) {
    if (numberParam) {
      return new Intl.NumberFormat('es-MX').format(numberParam);
    } else {
      return '0.00';
    }
  }

  titleTab() {
    if (this.op == 12 || this.op == 13 || this.op == 14 || this.op == 15) {
      this.title = 'Servicio Bienes Transportables';
    } else {
      this.title = 'Servicio Bienes Transportables';
    }
  }

  newService() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-content-centered' };

    config.initialState = {
      orderServId: this.orderServiceId,
      typeService: 'EN_TRANSPORTABLE',
      callback: (data: any) => {
        if (data) {
          this.showButtonServiceManual = true;
          this.getOrderServiceProvided();
        }
      },
    };
    const createService = this.modalService.show(
      CreateServiceFormComponent,
      config
    );
  }

  newServiceManual() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-content-centered' };
    config.initialState = {
      orderServiceId: this.orderServiceId,
      callback: (data: any) => {
        if (data) {
          this.getOrderServiceProvided();
        }
      },
    };
    const createServiceManual = this.modalService.show(
      CreateManualServiceFormComponent,
      config
    );
  }

  deleteService() {
    if (this.ordersSelected.length == 0) {
      this.onLoadToast('info', 'Seleccione un bien');
      return;
    }
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Está seguro que desea eliminar los servicios?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio

        let result = this.ordersSelected.map((item: any) => {
          return this.deleteOrderServiceProvided(item.id);
        });

        Promise.all(result).then(() => {
          this.onLoadToast('success', 'Servicio eliminados correctamente', '');
          this.ordersSelected = [];
          this.getOrderServiceProvided();
        });

      }
    });
  }

  onSelectedRows(event: any) {
    console.log('onSelectedRows', this.data);
    this.ordersSelected = event.selected;
  }

  setValues(param, data) {

    let row = this.data.find((x: any) => x.id == data.row.id);
    row[param] = data.text;

    this.listforUpdate = this.listforUpdate.filter((x: any) => x.id != row.id);
    this.listforUpdate.push(row);

    this.setTotalAmount();
  }


  saveForm() {
    if (this.listforUpdate.length == 0) return;

    this.listforUpdate.map(async (item: any, _i: number) => {
      const index = _i + 1;
      delete item.total;

      const body: any = {};
      for (const key in item) {
        if (item[key] != null) {
          body[key] = item[key];
        }
      }

      const update = await this.updateOrderServiceProvided(body);

      if (this.listforUpdate.length == index) {
        this.isUpdate = false;
        this.listforUpdate = [];
        this.ngOnInit();
      }
    });
  }

  /**
   * consultar el campo serviceCost no deveria mostrarse en ordservice provi porque no guarda
   * No carga automativamente los datos en el selector cuando se guardan
   */

  updateOrderServiceProvided(good: any) {
    return new Promise((resolve, reject) => {
      this.orderEntryService.updateOrderServicesProvided(good).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          reject(error);

          this.onLoadToast(
            'error',
            'No se pudo actualzar los bienes transportables'
          );
        },
      });
    });
  }

  deleteOrderServiceProvided(id: number) {

    return new Promise((resolve, reject) => {
      this.orderEntryService.deleteOrderServiceProvided(id).subscribe({
        next: resp => {
          resolve(resp);
        },
      });
    });
  }

  enableJustificationRows() {
    let table = null;
    table = document.getElementById('table');
    const tbody = table.children[0].children[1].children;

    for (let index = 0; index < tbody.length - 1; index++) {
      const ele: any = tbody[index];

      if (this.op == 13) {
        ele.children[7].querySelector('#text-input').disabled = false;
        ele.children[10].querySelector('#text-input').disabled = false;
      } else if (this.op == 10) {
        ele.children[4].querySelector('#text-input').disabled = false;
        ele.children[5].querySelector('#text-input').disabled = false;
        ele.children[6].querySelector('#text-input').disabled = false;
      }
    }
  }
}
