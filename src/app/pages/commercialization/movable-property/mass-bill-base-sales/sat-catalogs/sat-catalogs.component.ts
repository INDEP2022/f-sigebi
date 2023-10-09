import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, firstValueFrom, map, of } from 'rxjs';
import { LinkCellComponent } from 'src/app/@standalone/smart-table/link-cell/link-cell.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { UseModalComponent } from './use-comp/use-modal.component';

@Component({
  selector: 'app-sat-catalogs',
  templateUrl: './sat-catalogs.component.html',
  styles: [],
})
export class SatCatalogsComponent extends BasePage implements OnInit {
  val: any;
  dataFilter: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  @Input() count: number = 0;
  // @Input() filter: any;
  @Output() countData: EventEmitter<any> = new EventEmitter();
  @Input() data: any[] = [];

  @Input() set filter(val: any) {
    if (val) {
      this.getAllComer(val);
    } else {
      this.totalItems = 0;
      this.dataFilter.load([]);
      this.dataFilter.refresh();
    }
  }

  get filter() {
    return this.val;
  }

  constructor(
    private comerInvoice: ComerInvoiceService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        batchId: {
          title: 'Lote',
          sort: false,
        },
        customer: {
          title: 'Cliente',
          sort: false,
        },
        usoComp: {
          title: 'Uso Comprobante',
          sort: false,
          type: 'custom',
          renderComponent: LinkCellComponent<any>,
          onComponentInitFunction: (instance: LinkCellComponent<any>) => {
            instance.validateValue = false;
            instance.onNavigate.subscribe(async invoice => {
              if (invoice.factstatusId != 'PREF') {
                this.alert(
                  'warning',
                  'Atención',
                  'Verifique el estatus de la factura'
                );
              } else {
                let config = {
                  initialState: {
                    name: 'C_USO_COM',
                    callback: (
                      ans: boolean,
                      data: { clave: string; descripcion: string }
                    ) => {},
                  },
                  class: 'modal-lg modal-dialog-centered',
                  ignoreBackdropClick: true,
                };
                this.modalService.show(UseModalComponent, config);
              }
            });
          },
        },
        unite: {
          title: 'Unidad',
          sort: false,
          type: 'custom',
          renderComponent: LinkCellComponent<any>,
          onComponentInitFunction: (instance: LinkCellComponent<any>) => {
            instance.validateValue = false;
            instance.onNavigate.subscribe(async invoice => {
              if (invoice.factstatusId != 'PREF') {
                this.alert(
                  'warning',
                  'Atención',
                  'Verifique el estatus de la factura'
                );
              } else {
                let config = {
                  initialState: {
                    name: 'C_UNIDMED',
                    callback: (
                      ans: boolean,
                      data: { clave: string; descripcion: string }
                    ) => {},
                  },
                  class: 'modal-lg modal-dialog-centered',
                  ignoreBackdropClick: true,
                };
                this.modalService.show(UseModalComponent, config);
              }
            });
          },
        },
        prod: {
          title: 'Producto/Servicio',
          sort: false,
          type: 'custom',
          renderComponent: LinkCellComponent<any>,
          onComponentInitFunction: (instance: LinkCellComponent<any>) => {
            instance.validateValue = false;
            instance.onNavigate.subscribe(async invoice => {
              if (invoice.factstatusId != 'PREF') {
                this.alert(
                  'warning',
                  'Atención',
                  'Verifique el estatus de la factura'
                );
              } else {
                let config = {
                  initialState: {
                    name: 'C_CLVPROSE',
                    callback: (
                      ans: boolean,
                      data: { clave: string; descripcion: string }
                    ) => {},
                  },
                  class: 'modal-lg modal-dialog-centered',
                  ignoreBackdropClick: true,
                };
                this.modalService.show(UseModalComponent, config);
              }
            });
          },
        },
        payment: {
          title: 'Método de Pago',
          sort: false,
          type: 'custom',
          renderComponent: LinkCellComponent<any>,
          onComponentInitFunction: (instance: LinkCellComponent<any>) => {
            instance.validateValue = false;
            instance.onNavigate.subscribe(async invoice => {
              if (invoice.factstatusId != 'PREF') {
                this.alert(
                  'warning',
                  'Atención',
                  'Verifique el estatus de la factura'
                );
              } else {
                let config = {
                  initialState: {
                    name: 'C_F_PAGO',
                    callback: (
                      ans: boolean,
                      data: { clave: string; descripcion: string }
                    ) => {},
                  },
                  class: 'modal-lg modal-dialog-centered',
                  ignoreBackdropClick: true,
                };
                this.modalService.show(UseModalComponent, config);
              }
            });
          },
        },
        relation: {
          title: 'Tipo de Relación',
          sort: false,
          type: 'custom',
          renderComponent: LinkCellComponent<any>,
          onComponentInitFunction: (instance: LinkCellComponent<any>) => {
            instance.validateValue = false;
            instance.onNavigate.subscribe(async invoice => {
              if (invoice.factstatusId != 'PREF') {
                this.alert(
                  'warning',
                  'Atención',
                  'Verifique el estatus de la factura'
                );
              } else {
                let config = {
                  initialState: {
                    name: 'C_TIPO_REL',
                    callback: (
                      ans: boolean,
                      data: { clave: string; descripcion: string }
                    ) => {},
                  },
                  class: 'modal-lg modal-dialog-centered',
                  ignoreBackdropClick: true,
                };
                this.modalService.show(UseModalComponent, config);
              }
            });
          },
        },
      },
    };
  }

  async setData(data: any[], params: any) {
    const dataDesc = await this.getDataInvoice(params);
    data.map((val, index) => {
      val.payment = dataDesc[index].desc_formapago;
      val.prod = dataDesc[index].desc_prodserv_sat;
      val.relation = dataDesc[index].desc_tipo_relacion_sat;
      val.unite = dataDesc[index].desc_unidad_sat;
      val.usoComp = dataDesc[index].desc_uso_comp;
    });

    this.loading = false;
    this.dataFilter.load(data);
    this.dataFilter.refresh();
    this.totalItems = data.length;
  }

  async getDataInvoice(params: any) {
    return firstValueFrom(
      this.comerInvoice.getDescInvoice(params).pipe(
        map(resp => resp.data),
        catchError(err => of([]))
      )
    );
  }

  ngOnInit(): void {
    // this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
    //   if (this.count > 0) this.getAllComer();
    // });
    this.paramsList.getValue().limit = 500;
    this.paramsList.getValue().take = 500;
  }

  getAllComer(filter: any) {
    const params = {
      ...filter,
      ...this.paramsList.getValue(),
      ...this.columnFilters,
      // ...{ sortBy: 'batchId:ASC' },
    };

    this.loading = true;
    this.comerInvoice.getAllSumInvoice(params).subscribe({
      next: resp => {
        if (resp.count == 0) {
          this.loading = false;
          this.count = 0;
          this.dataFilter.load([]);
          this.dataFilter.refresh();
        }

        this.count = resp.count;
        this.setData(resp.data, params);
      },
      error: () => {
        this.loading = false;
        this.count = 0;
        this.dataFilter.load([]);
        this.dataFilter.refresh();
      },
    });
  }
}
