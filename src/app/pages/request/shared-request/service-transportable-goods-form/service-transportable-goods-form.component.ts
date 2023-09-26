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
} from '../../reception-scheduling-service-order/columns/service-transportable-columns';
import { CreateManualServiceFormComponent } from '../../reception-scheduling-service-order/components/create-manual-service-form/create-manual-service-form.component';
import { CreateServiceFormComponent } from '../../reception-scheduling-service-order/components/create-service-form/create-service-form.component';
import { RequestHelperService } from '../../request-helper-services/request-helper.service';

const testData = [
  {
    description: 'MANIOBRAS(UN MNIOBRISTA POR HORA)',
    andmidserv: 'Servicio (Hora)',
    classificationService: 'Equipo y Maniobra',
    commentService: 'COMENTARIO',
    durationTime: '',
    resourcesNumber: '',
    resourcesReal: '',
    priceUnitary: '$217.81',
    total: '$217.81',
  },
];
@Component({
  selector: 'app-service-transportable-goods-form',
  templateUrl: './service-transportable-goods-form.component.html',
  styleUrls: ['./service-transportable-goods.scss'],
})
export class ServiceTransportableGoodsFormComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @ViewChild('table', { static: false }) table: any;
  @Input() op: number;
  @Input() showForm: boolean;
  @Input() rejected: boolean;
  @Input() orderServiceId: number;
  @Input() isUpdate?: boolean = false;
  @Input() typeOrder?: string = null;
  title: string = '';
  showButtonServiceManual: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  ordersSelected: any = [];

  listforUpdate: any = [];
  columns: any;
  data: any[] = [];
  @Output() totEvent: EventEmitter<string> = new EventEmitter();

  private orderEntryService = inject(orderentryService);
  private requestHelperService = inject(RequestHelperService);

  constructor(private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    this.getOrderServiceProvided();
    if (this.op != 1 && this.op != 2 && this.op != 3) {
      this.columns = SERVICE_TRANSPORTABLE_COLUMNS;
      this.settings = {
        ...this.settings,
        actions: false,
        selectMode: '',
        columns: SERVICE_TRANSPORTABLE_COLUMNS,
      };

      this.titleTab();
      this.showButtonServiceManual = true;

      this.columns.selected = {
        ...this.columns.selected,
        onComponentInitFunction: this.orderSelected.bind(this),
      };

      this.columns.commentService = {
        ...this.columns.commentService,
        onComponentInitFunction: (instance?: any) => {
          instance.input.subscribe((data: any) => {
            this.setCommentService(data);
          });
        },
      };

      this.columns.durationTime = {
        ...this.columns.durationTime,
        onComponentInitFunction: (instance?: any) => {
          instance.input.subscribe((data: any) => {
            this.setDurationTime(data);
          });
        },
      };

      this.columns.resourcesNumber = {
        ...this.columns.resourcesNumber,
        onComponentInitFunction: (instance?: any) => {
          instance.input.subscribe((data: any) => {
            this.setResourcesNumber(data);
          });
        },
      };

      this.columns.resourcesReal = {
        ...this.columns.resourcesReal,
        onComponentInitFunction: (instance?: any) => {
          instance.input.subscribe((data: any) => {
            this.setResourcesReal(data);
          });
        },
      };

      this.columns.descriptionDifference = {
        ...this.columns.descriptionDifference,
        onComponentInitFunction: (instance?: any) => {
          instance.input.subscribe((data: any) => {
            this.setDescriptionDifference(data);
          });
        },
      };

      this.columns.resultAssessment = {
        ...this.columns.resultAssessment,
        onComponentInitFunction: (instance?: any) => {
          instance.input.subscribe((data: any) => {
            this.setResulAssessment(data);
          });
        },
      };

      this.columns.amountNumbercomplies = {
        ...this.columns.amountNumbercomplies,
        onComponentInitFunction: (instance?: any) => {
          instance.input.subscribe((data: any) => {
            this.setAmountNumbercomplies(data);
          });
        },
      };

      this.columns.porcbreaches = {
        ...this.columns.porcbreaches,
        onComponentInitFunction: (instance?: any) => {
          instance.input.subscribe((data: any) => {
            this.setPorcbreaches(data);
          });
        },
      };

      this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
        //verificar si existe el order service id
        if (this.orderServiceId != null) {
          this.getOrderServiceProvided();
        }
      });
    } else if (this.op == 1 || this.op == 2 || this.op == 3) {
      this.titleTab();
      this.showButtonServiceManual = true;
      this.settings = {
        ...this.settings,
        actions: false,
        selectMode: '',
        columns: SERVICE_TRANSPORTABLE_COLUMNS_CAPTURE,
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
  }

  getOrderServiceProvided() {
    /**
     * Obtener la data por el orderServiceId
     */
    const params = new ListParams();
    //params['filter.orderServiceId'] = `$eq:${this.orderServiceId}`;
    params['filter.orderServiceId'] = 516;
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
          let ttotal = 0;
          resp.data.map((item: any) => {
            if (this.op == 6 || this.op == 7 || this.op == 8) {
              this.requestHelperService.changeReadOnly(true);
            }
            const resourceNumber =
              Number(item.resourcesNumber) != null
                ? Number(item.resourcesNumber)
                : 0;
            const resourcesReal = item.resourcesReal;
            const resource =
              resourcesReal != null ? Number(resourcesReal) : resourceNumber;
            item['total'] = Number(item.priceUnitary) * Number(resource);
            ttotal = ttotal + item['total'];
          });

          const t = `$${this.formatTotalAmount(ttotal)}`;
          this.totEvent.emit(t);
          const bodyTotal: any = { total: t };
          resp.data.push(bodyTotal);
          this.data = resp.data;
          this.totalItems = resp.count;

          if (this.op != 1 && this.op != 2 && this.op != 3) {
            this.setTableColumnsRows();
            this.setTableRowTotal();
          } else if (this.op == 1) {
            this.setTableRowTotal();
          } else if (this.op == 2) {
            this.setTableRowTotal();
            this.setTableColumnsRows();
          } else if (this.op == 3) {
            this.setTableRowTotal();
            this.setTableColumnsRows();
          }
        },
      });
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

      if ((this.op == 3 && this.typeOrder == 'reception') || this.op == 4) {
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

      if (this.op == 4 || this.op == 5 || this.op == 14 || this.op == 2) {
        if (this.op != 2) {
          noResources.hide = false;
          descriptionDifference.hide = false;
        }
      }

      let table = null;
      table = document.getElementById('table');
      const tbody = table.children[0].children[1].children;

      //readonly duracion
      if (
        this.op == 3 ||
        this.op == 4 ||
        this.op == 5 ||
        this.op == 6 ||
        this.op == 7 ||
        this.op == 8 ||
        this.op == 2
      ) {
        for (let index = 0; index < tbody.length; index++) {
          const ele: any = tbody[index];
          if (this.op != 2) {
            if (this.op != 3) {
              ele.children[8].children[0].children[0].children[0].children[0].children[0].children[0].children[0].disabled =
                true;
              //ele.children[8].querySelector('#text-input').disabled = true;
              ele.children[9].querySelector('#text-input').disabled = true;
            }
          } else if (this.op == 2) {
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

          if (this.op == 6 || this.op == 7 || this.op == 8) {
            //const select = ele.children[1].querySelector('#select-input');
            ele.children[2].querySelector('#text-input').disabled = true;
            ele.children[3].querySelector('#text-input').disabled = true;
            ele.children[7].querySelector('#text-input').disabled = true;
            ele.children[10].querySelector('#text-input').disabled = true;
            ele.children[13].querySelector('#text-input').disabled = true;
          }
        }
      }
      //readonly no. recursos
      /*if (this.op == 4 || this.op == 5 || this.op == 14) {
        for (let index = 0; index < tbody.length; index++) {
          const ele: any = tbody[index];
          //no. recursos
          ele.children[9].querySelector('#text-input').disabled = true;
        }
      }*/
    }, 300);
  }

  setTableRowTotal() {
    setTimeout(() => {
      if (this.op != 1 && this.op != 2 && this.op != 3) {
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
          //descrip de diferencia
          if (porcbreaches.hide == false) {
            row.children[13].querySelector('#text-input').hidden = true;
          } else {
            row.children[10].querySelector('#text-input').hidden = true;
          }
        }
      } else if (this.op == 1 || this.op == 2 || this.op == 3) {
        const table = document.getElementById('table');
        const tbody = table.children[0].children[1].children;
        const row: any = tbody[this.data.length - 1];

        row.children[0].querySelector('#checkbox-input').hidden = true;
        row.children[4].querySelector('#text-input').hidden = true;
        row.children[5].querySelector('#text-input').hidden = true;
        row.children[6].querySelector('#text-input').hidden = true;
        /*
        //select
        //
        //comentario de servicio
        row.children[3].querySelector('#text-input').hidden = true;
        //duracion horas
        row.children[4].querySelector('#text-input').hidden = true; */
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
    if (this.op != 0) {
      this.title = 'Servicios Prestados';
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
    if (this.ordersSelected.length == 0 || this.ordersSelected.length > 1) {
      this.onLoadToast('info', 'Seleccione un bien');
      return;
    }
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estás seguro que desea eliminar el servicio?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.deleteOrderServiceProvided(this.ordersSelected[0].id);
      }
    });
  }

  orderSelected(event: any) {
    event.toggle.subscribe((data: any) => {
      if (data.toggle == true) {
        this.ordersSelected.push(data.row);
      } else {
        const index = this.ordersSelected.indexOf(data.row);
        this.ordersSelected.splice(index, 1);
      }
    });
  }

  setCommentService(data: any) {
    if (data.text != null) {
      const index = this.data.indexOf(data.row);
      this.data[index].commentService = data.text != '' ? data.text : null;

      //aniadir a la lista de actualizaciones
      const index2 = this.listforUpdate.indexOf(data.row);
      if (index2 == -1) {
        this.listforUpdate.push(data.row);
      } else {
        this.listforUpdate[index].commentService =
          data.text != '' ? data.text : null;
      }
    }
  }

  setDurationTime(data: any) {
    if (data.text != null) {
      const index = this.data.indexOf(data.row);
      this.data[index].durationTime = data.text != '' ? data.text : null;

      //aniadir a la lista de actualizaciones
      const index2 = this.listforUpdate.indexOf(data.row);
      if (index2 == -1) {
        this.listforUpdate.push(data.row);
      } else {
        this.listforUpdate[index].durationTime =
          data.text != '' ? data.text : null;
      }
    }
  }

  setResourcesNumber(data: any) {
    if (data.text != null) {
      const index = this.data.indexOf(data.row);
      this.data[index].resourcesNumber = data.text != '' ? data.text : null;

      //aniadir a la lista de actualizaciones
      const index2 = this.listforUpdate.indexOf(data.row);
      if (index2 == -1) {
        this.listforUpdate.push(data.row);
      } else {
        this.listforUpdate[index].resourcesNumber =
          data.text != '' ? data.text : null;
      }
    }
  }

  setResourcesReal(data: any) {
    if (data.text != null) {
      const index = this.data.indexOf(data.row);
      this.data[index].resourcesReal = data.text != '' ? data.text : null;

      //aniadir a la lista de actualizaciones
      const index2 = this.listforUpdate.indexOf(data.row);
      if (index2 == -1) {
        this.listforUpdate.push(data.row);
      } else {
        this.listforUpdate[index].resourcesReal =
          data.text != '' ? data.text : null;
      }
    }
  }

  setDescriptionDifference(data: any) {
    if (data.text != null) {
      const index = this.data.indexOf(data.row);
      this.data[index].descriptionDifference =
        data.text != '' ? data.text : null;

      //aniadir a la lista de actualizaciones
      const index2 = this.listforUpdate.indexOf(data.row);
      if (index2 == -1) {
        this.listforUpdate.push(data.row);
      } else {
        this.listforUpdate[index].descriptionDifference =
          data.text != '' ? data.text : null;
      }
    }
  }

  setResulAssessment(data: any) {
    /*if (data.text != null) {
      debugger*/
    const index = this.data.indexOf(data.row);
    this.data[index].resultAssessment = data.text != '' ? data.text : null;

    //aniadir a la lista de actualizaciones
    const index2 = this.listforUpdate.indexOf(data.row);
    if (index2 == -1) {
      this.listforUpdate.push(data.row);
    } else {
      this.listforUpdate[index].resultAssessment =
        data.text != '' ? data.text : null;
    }
    /*}*/
  }

  setAmountNumbercomplies(data: any) {
    if (data.text != null) {
      const index = this.data.indexOf(data.row);
      this.data[index].amountNumbercomplies =
        data.text != '' ? data.text : null;

      //aniadir a la lista de actualizaciones
      const index2 = this.listforUpdate.indexOf(data.row);
      if (index2 == -1) {
        this.listforUpdate.push(data.row);
      } else {
        this.listforUpdate[index].amountNumbercomplies =
          data.text != '' ? data.text : null;
      }
    }
  }

  setPorcbreaches(data: any) {
    if (data.text != null) {
      const index = this.data.indexOf(data.row);
      this.data[index].porcbreaches = data.text != '' ? data.text : null;

      //aniadir a la lista de actualizaciones
      const index2 = this.listforUpdate.indexOf(data.row);
      if (index2 == -1) {
        this.listforUpdate.push(data.row);
      } else {
        this.listforUpdate[index].porcbreaches =
          data.text != '' ? data.text : null;
      }
    }
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
    this.orderEntryService.deleteOrderServiceProvided(id).subscribe({
      next: resp => {
        this.onLoadToast('success', 'Servicio eliminado correctamente', '');
        this.getOrderServiceProvided();
      },
    });
  }
}
