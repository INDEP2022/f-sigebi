import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { InventoryService } from 'src/app/core/services/ms-inventory-type/inventory.service';
import { BasePage } from 'src/app/core/shared';
import { RegisterModalComponent } from './register-modal/register-modal.component';

@Component({
  selector: 'app-inventory-data',
  templateUrl: './inventory-data.component.html',
  styles: [],
})
export class InventoryDataComponent
  extends BasePage
  implements OnInit, OnChanges
{
  list: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  params1 = new BehaviorSubject<FilterParams>(new FilterParams());
  data: any[] = [];
  inventorySelect: any = {};
  disableGetAtribute: boolean = true;
  @Input() goodId: number;
  dataLoand: LocalDataSource = new LocalDataSource();

  constructor(
    private fb: FormBuilder,
    private readonly inventoryService: InventoryService,
    private readonly router: Router,
    private readonly goodQueryService: GoodsQueryService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.actions = false;
    this.settings.hideSubHeader = false;
    this.settings.columns = {
      inventoryNumber: {
        title: 'No. Inventario',
        type: 'number',
        sort: false,
      },
      dateInventory: {
        title: 'Fecha Inventario',
        type: 'string',
        sort: false,
        valuePrepareFunction: (value: any) => {
          return this.formatearFecha(new Date(value));
        },
      },
      responsible: {
        title: 'Responsable',
        type: 'string',
        sort: false,
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.inventoryForGood(this.goodId);
    }
  }

  ngOnInit(): void {
    // this.prepareForm();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.inventoryForGood(this.goodId));
  }

  inventoryForGood(idGood: number) {
    this.loading = true;
    this.inventoryService
      .getInventoryByGood(idGood, this.params.getValue())
      .subscribe({
        next: response => {
          this.data = response.data;
          this.dataLoand.load(this.data);
          this.dataLoand.refresh();
          this.totalItems = response.count;
          this.loading = false;
        },
        error: err => {
          this.loading = false;
          console.log('AQUIIIIIIIIIIIIIIIIIII', err);
        },
      });
  }

  formatearFecha(fecha: Date) {
    let dia: any = fecha.getDate();
    let mes: any = fecha.getMonth() + 1;
    let anio: any = fecha.getFullYear();
    dia = dia < 10 ? '0' + dia : dia;
    mes = mes < 10 ? '0' + mes : mes;
    let fechaFormateada = dia + '/' + mes + '/' + anio;
    return fechaFormateada;
  }

  inventoryAutorization() {
    /// Aca va la ruta donde se redireccionara
    /* const strategyRoute =
    'pages/final-destination-process/delivery-schedule/schedule-of-events/capture-event/generate-estrategy';
    this.router.navigate([strategyRoute], {
      queryParams: {  },
    }); */
  }

  async getAtribute() {
    let vb_hay_inv_anterior: boolean = false;
    let vn_inv_anterior: number | string;

    //inventario_x_bien.no_inventario
    if (this.inventorySelect.no_inventario === null) {
      this.alert(
        'info',
        'Información',
        'Debe generar un nuevo inventario antes de mostrar los atributos',
        ''
      );
      return;
    }

    if (this.inventorySelect.fec_inventario === null) {
      this.alert(
        'info',
        'Información',
        'Debe registrar la fecha en la que se toma el inventario',
        'S'
      );
      return;
    }

    if (this.inventorySelect.responsable === null) {
      this.alert(
        'info',
        'Información',
        'Es necesario que sea ingresado el nombre del responsable o borre el registro.',
        'S'
      );
      return;
    }

    /* for (const reg of this.data) {
      vb_hay_inv_anterior = true;
      vn_inv_anterior = reg.no_inventario;
      break;
    } */

    const clasifi: any[] = await this.getClsifi(9999);

    for (const reg of clasifi) {
      console.log(reg);
    }

    /* if (vb_hay_inv_anterior) {
      const response = await this.alertQuestion('question','Traer valores anterior','Desea traer los valores del inventario anterior');
      if(response.isConfirmed){
        const atributes: any[] = await this.getAtributeBack(this.goodId,662);
        if(atributes.length > 0){
          atributes.forEach((order, _index) => {
              if (order) {
                this.list.push({
                  atributo: order.attribute,
                  valor: order.valueAttributeInventory,
                });
              }
          });
          console.log(this.list);
        }
      }
    } */
  }

  async getAtributeBack(goodId: number, inventoryNumber: number | string) {
    return new Promise<any[]>((res, _rej) => {
      const params: ListParams = {};
      params['filter.goodNumber'] = `$eq:${goodId}`;
      params['filter.inventoryNumber'] = `$eq:${inventoryNumber}`;
      this.inventoryService.getLinesInventory(params).subscribe({
        next: response => {
          res(response.data);
        },
        error: _err => {
          res([]);
        },
      });
    });
  }

  async getClsifi(goodClassNumber: number) {
    return new Promise<any[]>((res, _rej) => {
      let dataParam = this.params1.getValue();
      dataParam.limit = 120;
      dataParam.addFilter('classifGoodNumber', goodClassNumber);
      this.goodQueryService.getAllFilter(dataParam.getParams()).subscribe({
        next: val => {
          console.log('[[[[[[[ ATRIBUTOS AQUIIIIIIIIII ]]]]]]]]', val);
          res(val.data);
        },
        error: err => {
          res([]);
        },
      });
    });
  }

  selectInventory(event: any) {
    console.log(event);
    this.inventorySelect = event.data;
    this.disableGetAtribute = false;
  }

  add() {
    this.openModal();
  }
  openModal() {
    let config: ModalOptions = {
      initialState: {
        goodId: this.goodId,
        callback: (next: boolean) => {
          if (next) {
            this.params
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.inventoryForGood(this.goodId));
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(RegisterModalComponent, config);
  }
}
