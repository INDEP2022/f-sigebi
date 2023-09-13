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
import { SERVICE_TRANSPORTABLE_COLUMNS } from '../../reception-scheduling-service-order/columns/service-transportable-columns';
import { CreateManualServiceFormComponent } from '../../reception-scheduling-service-order/components/create-manual-service-form/create-manual-service-form.component';
import { CreateServiceFormComponent } from '../../reception-scheduling-service-order/components/create-service-form/create-service-form.component';

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
  title: string = '';
  showButtonServiceManual: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  ordersSelected: any = [];
  columns = SERVICE_TRANSPORTABLE_COLUMNS;
  listforUpdate: any = [];

  data: any[] = [];
  @Output() totEvent: EventEmitter<string> = new EventEmitter();

  private orderEntryService = inject(orderentryService);

  constructor(private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      selectMode: '',
      columns: SERVICE_TRANSPORTABLE_COLUMNS,
    };
  }

  ngOnInit(): void {
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.orderServiceId) {
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
    params['filter.orderServiceId'] = `$eq:${this.orderServiceId}`;
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
          console.log(resp.data);

          let ttotal = 0;
          resp.data.map((item: any) => {
            const resource =
              Number(item.resourcesNumber) != null
                ? Number(item.resourcesNumber)
                : 0;
            item['total'] = Number(item.priceUnitary) * resource;
            ttotal = ttotal + item['total'];
          });

          const t = `$${this.formatTotalAmount(ttotal)}`;
          this.totEvent.emit(t);
          const bodyTotal: any = { total: t };
          resp.data.push(bodyTotal);
          this.data = resp.data;
          this.totalItems = resp.count;
          this.setTableColumnsRows();
          this.setTableRowTotal();
        },
      });
  }

  setTableColumnsRows() {
    setTimeout(() => {
      const tableColumn = this.table.grid.getColumns();
      let noResources = tableColumn.find((x: any) => x.id == 'resourcesReal');
      let descriptionDifference = tableColumn.find(
        (x: any) => x.id == 'descriptionDifference'
      );
      noResources.hide = true;
      descriptionDifference.hide = true;

      //
      if (this.op == 4 || this.op == 5 || this.op == 14) {
        noResources.hide = false;
        descriptionDifference.hide = false;
      }

      const table = document.getElementById('table');
      const tbody = table.children[0].children[1].children;
      //disabled comentarios
      /* if(this.op != 3 && this.op != 4 && this.op != 5 && this.op != 6){
      for (let index = 0; index < tbody.length; index++) {
      const ele:any = tbody[index];
        ele.children[4].children[0].children[0].children[0].children[0].children[0].children[0].children[0].disabled = true
      }
    } */

      //readonly duracion
      if (this.op == 3 || this.op == 4 || this.op == 5 || this.op == 6) {
        for (let index = 0; index < tbody.length; index++) {
          const ele: any = tbody[index];
          ele.children[5].children[0].children[0].children[0].children[0].children[0].children[0].children[0].disabled =
            true;
          ele.children[6].children[0].children[0].children[0].children[0].children[0].children[0].children[0].disabled =
            true;
        }
      }
      //readonly no. recursos
      if (this.op == 4 || this.op == 5 || this.op == 14) {
        for (let index = 0; index < tbody.length; index++) {
          const ele: any = tbody[index];
          ele.children[6].children[0].children[0].children[0].children[0].children[0].children[0].children[0].disabled =
            true;
        }
      }
    }, 300);
  }

  setTableRowTotal() {
    setTimeout(() => {
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
      const porcbreaches = tableColumn.find((x: any) => x.id == 'porcbreaches');
      const resourcesReal = tableColumn.find(
        (x: any) => x.id == 'resourcesReal'
      );

      const table = document.getElementById('table');
      const tbody = table.children[0].children[1].children;
      const row: any = tbody[this.data.length - 1];
      //console.log(row.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0])
      row.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].hidden =
        true;

      if (resultAssessment.hide == false)
        row.children[1].children[0].children[0].children[0].children[0].children[0].children[0].children[0].hidden =
          true;
      if (amountNumbercomplies.hide == false)
        row.children[2].children[0].children[0].children[0].children[0].children[0].children[0].children[0].hidden =
          true;
      if (porcbreaches.hide == false)
        row.children[3].children[0].children[0].children[0].children[0].children[0].children[0].children[0].hidden =
          true;
      row.children[7].children[0].children[0].children[0].children[0].children[0].children[0].children[0].hidden =
        true;
      row.children[8].children[0].children[0].children[0].children[0].children[0].children[0].children[0].hidden =
        true;
      row.children[9].children[0].children[0].children[0].children[0].children[0].children[0].children[0].hidden =
        true;
      if (resourcesReal.hide == false)
        row.children[10].children[0].children[0].children[0].children[0].children[0].children[0].children[0].hidden =
          true;
      if (descriptionDifference.hide == false)
        row.children[12].children[0].children[0].children[0].children[0].children[0].children[0].children[0].hidden =
          true;
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
      this.title = 'Servicios prestados';
    } else {
      this.title = 'Servicio para bienes transportables';
    }
  }

  newService() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-content-centered' };

    config.initialState = {
      orderServId: this.orderServiceId,
      typeService: 'EN_TRANSPORTABLE',
      callback: (data: any) => {
        if (data) {
          console.log(data);
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
          console.log(data);
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
    console.log(this.ordersSelected);
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
      console.log('elementos seleccionados', this.ordersSelected);
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
      console.log(item);

      const body: any = {};
      for (const key in item) {
        if (item[key] != null) {
          body[key] = item[key];
        }
      }

      const update = await this.updateOrderServiceProvided(body);

      if (this.listforUpdate.length == index) {
        this.isUpdate = false;
        console.log('BIENES TRANSPORTABLES ACTUALIZADO');
        this.getOrderServiceProvided();
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
          console.log(error);
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
