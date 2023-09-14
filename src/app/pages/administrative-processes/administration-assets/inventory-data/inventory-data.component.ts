import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGood } from 'src/app/core/models/ms-good/good';
import {
  IInventoryGood,
  ILineaInventory,
} from 'src/app/core/models/ms-inventory-query/inventory-query.model';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { InventoryService } from 'src/app/core/services/ms-inventory-type/inventory.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { getClassColour } from 'src/app/pages/general-processes/goods-characteristics/goods-characteristics/good-table-vals/good-table-vals.component';
import { CharacteristicGoodCellComponent } from '../../change-of-good-classification/change-of-good-classification/characteristicGoodCell/characteristic-good-cell.component';
import { ATRIBUT_ACT_COLUMNS } from '../general-data-goods/columns';
//import { ChangeOfGoodCharacteristicService } from '../general-data-goods/services/change-of-good-classification.service';
import { ChangeOfGoodCharacteristicService } from '../../change-of-good-classification/services/change-of-good-classification.service';
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
  inventorySelect: any;
  disableGetAtribute: boolean = true;
  @Input() goodId: number;
  dataLoand: LocalDataSource = new LocalDataSource();
  atributActSettings: any;
  atributNewSettings: any;
  good: IGood;
  inventary: any;
  service = inject(ChangeOfGoodCharacteristicService);
  goodChange: number = 0;
  classificationOfGoods: number;
  viewAct: boolean = false;
  loadInventary: boolean = false;
  columnFilter: any = [];
  inventoryDataForm: ModelForm<any>;
  generateAtri: boolean = false;
  textButon: string = 'Generar Inventario';
  atribute: string = 'Generar Atributos';

  get dataIn() {
    return this.service.data;
  }
  constructor(
    private fb: FormBuilder,
    private readonly inventoryService: InventoryService,
    private readonly router: Router,
    private readonly goodQueryService: GoodsQueryService,
    private modalService: BsModalService,
    private readonly goodService: GoodService
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
        sort: false,
        type: 'html',
        valuePrepareFunction: (text: string) => {
          return `${
            text ? text.split('T')[0].split('-').reverse().join('/') : ''
          }`;
        },
        filter: {
          type: 'custom',
          component: CustomDateFilterComponent,
        },
      },
      responsible: {
        title: 'Responsable',
        type: 'string',
        sort: false,
      },
    };
    this.atributActSettings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: '',
        position: 'right',
        add: false,
        edit: true,
        delete: false,
      },
      columns: {
        ...ATRIBUT_ACT_COLUMNS,
        value: {
          ...ATRIBUT_ACT_COLUMNS.value,
          type: 'custom',
          valuePrepareFunction: (cell: any, row: any) => {
            return { value: row, good: this.good };
          },
          renderComponent: CharacteristicGoodCellComponent,
        },
      },
      rowClassFunction: (row: any) => {
        return (
          getClassColour(row.data, false) +
          ' ' +
          (row.data.tableCd ? '' : 'notTableCd')
        );
      },
    };
    this.atributNewSettings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: '',
        position: 'right',
        add: false,
        edit: true,
        delete: false,
      },
      edit: {
        editButtonContent: '<span class="fa fa-eye text-success mx-2"></span>',
      },
      columns: {
        ...ATRIBUT_ACT_COLUMNS,
        value: {
          ...ATRIBUT_ACT_COLUMNS.value,
          type: 'custom',
          valuePrepareFunction: (cell: any, row: any) => {
            return { value: row, good: this.good };
          },
          renderComponent: CharacteristicGoodCellComponent,
        },
      },
      rowClassFunction: (row: any) => {
        return (
          getClassColour(row.data, false) +
          ' ' +
          (row.data.tableCd ? '' : 'notTableCd')
        );
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.inventoryForGood(this.goodId);
    }
  }

  ngOnInit(): void {
    this.prepareForm();
    this.dataLoand
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'inventoryNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'dateInventory':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilter[field] = `${searchFilter}:${filter.search}`;
              this.params.value.page = 1;
            } else {
              delete this.columnFilter[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.inventoryForGood(this.goodId);
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.inventoryForGood(this.goodId));

    this.inventoryDataForm.get('responsable').valueChanges.subscribe(date => {
      if (date) {
        if (date.length > 0) {
          this.inventorySelect = null;
          this.generateAtri = false;
          this.textButon = 'Generar Inventario';
          this.viewAct = !this.viewAct;
          this.viewAct = !this.viewAct;
          this.generateAtri = false;
        }
      } else {
        this.viewAct = !this.viewAct;
      }
    });
  }

  private prepareForm() {
    this.inventoryDataForm = this.fb.group({
      noInventario: [null, [Validators.required]],
      fechaInventario: [new Date(), [Validators.required]],
      responsable: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.max(60),
        ],
      ],
    });
  }

  inventoryForGood(idGood: number) {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilter,
    };
    this.inventoryService.getInventoryByGood(idGood, params).subscribe({
      next: response => {
        this.data = response.data;
        this.dataLoand.load(this.data);
        this.dataLoand.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: err => {
        this.dataLoand.load([]);
        this.dataLoand.refresh();
        this.loading = false;
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
    this.loadInventary = true;
    this.viewAct = true;
    if (this.inventorySelect === null) {
      this.alert(
        'warning',
        'Atención',
        'Debe seleccionar un inventario para obtener sus atributos'
      );
      return;
    }
    await this.getGood();
    const atributes: any[] = await this.getAtributeBack(
      this.goodId,
      this.inventorySelect.inventoryNumber
    );
    console.log(atributes);
    if (atributes.length > 0) {
      this.inventary = atributes;
    } else {
      this.inventary = null;
    }
    setTimeout(() => {
      this.goodChange++;
    }, 100);
  }

  async getAtributeBack(goodId: number, inventoryNumber: number | string) {
    return new Promise<any[]>((res, _rej) => {
      const params: ListParams = {};
      params['filter.goodNumber'] = `$eq:${goodId}`;
      params['filter.inventoryNumber'] = `$eq:${inventoryNumber}`;
      params['sortBy'] = 'typeInventoryNumber:ASC';
      params.limit = 120;
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
          res(val.data);
        },
        error: err => {
          res([]);
        },
      });
    });
  }

  selectInventory(event: any) {
    this.inventorySelect = event.data;
    this.getAtribute();
    this.disableGetAtribute = false;
    this.generateAtri = true;
    this.textButon = 'Actualizar Atributos';
  }

  async add() {
    if (this.dataIn) {
      if (this.inventorySelect) {
        let required: boolean = false;
        console.log('Data', this.dataIn);
        this.dataIn.forEach((item: any) => {
          console.log(item);
          if (item.required && (item.value === null || item.value === '')) {
            required = true;
          }
        });
        if (required) {
          this.alert(
            'warning',
            'Atención',
            'Debe llenar los valores requeridos'
          );
          return;
        }
        this.dataIn.forEach((item: any) => {
          this.updateInventary(
            this.inventorySelect.inventoryNumber,
            item.numColumn,
            item.value
          );
        });
        this.alert('success', 'El Inventario se ha Actualizado', '');
      } else {
        let required: boolean = false;
        this.dataIn.forEach((item: any) => {
          if (item.required && (item.value === null || item.value === '')) {
            required = true;
          }
        });
        if (required) {
          this.alert(
            'warning',
            'Atención',
            'Debe llenar los Valores Requeridos'
          );
          return;
        }
        const inventoryNumber: number = await this.createInventory();
        if (this.inventoryDataForm.get('responsable').value === null) {
          this.alert(
            'warning',
            'Atención',
            'Es necesario que sea ingresado el nombre del responsable'
          );
          return;
        }
        if (inventoryNumber !== null) {
          this.dataIn.forEach((item: any) => {
            this.createLineaInventory(
              inventoryNumber,
              item.numColumn,
              item.value
            );
          });
          this.alert('success', 'El inventario se ha Guardado.', '');
          this.inventoryDataForm.get('responsable').reset();
        } else {
          this.alert(
            'error',
            'Ha Ocurrido un Error',
            'No se ha Podido Guardar el Inventario.'
          );
        }
      }
    } else {
      this.alert(
        'warning',
        'Atención',
        'Debe seleccionar un inventario o genear nuevos atributos'
      );
    }
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

  getGood() {
    return new Promise((res, rej) => {
      this.goodService.getById(this.goodId).subscribe({
        next: (response: any) => {
          this.classificationOfGoods = Number(response.data[0].goodClassNumber);
          console.log(this.classificationOfGoods);

          this.good = response.data[0];
          if (!this.loadInventary) {
            setTimeout(() => {
              this.goodChange++;
            }, 100);
          }
          res(this.good);
        },
        error: err => res(null),
      });
    });
  }

  getInvAnterior() {
    return new Promise<any[]>((res, rej) => {
      const params: ListParams = {};
      const dateNow = new Date();
      params['filter.dateInventory'] = `$lte:${
        dateNow.toISOString().split('T')[0]
      }`;
      this.inventoryService.getInventoryByGood(this.goodId, params).subscribe({
        next: resp => {
          res(resp.data);
        },
        error: err => {
          res([]);
        },
      });
    });
  }

  async generateAtribute() {
    let vb_hay_inv_anterior: boolean = false;
    let vn_inv_anterior: number | string;
    this.loadInventary = true;
    this.viewAct = true;
    //inventario_x_bien.no_inventario
    if (this.inventoryDataForm.get('fechaInventario').value === null) {
      this.alert(
        'warning',
        'Atención',
        'Debe registrar la fecha en la que se toma el inventario'
      );
      return;
    }

    if (this.inventoryDataForm.get('responsable').value === null) {
      this.alert(
        'warning',
        'Atención',
        'Es necesario que sea ingresado el nombre del responsable'
      );
      return;
    }
    //await this.getGood();
    const inventoryAntList: any[] = await this.getInvAnterior();
    for (const reg of inventoryAntList) {
      vb_hay_inv_anterior = true;
      vn_inv_anterior = reg.inventoryNumber;
      break;
    }

    await this.getGood();

    if (vb_hay_inv_anterior) {
      const response = await this.alertQuestion(
        'question',
        'Atención',
        '¿Desea traer los valores del inventario anterior?'
      );
      if (response.isConfirmed) {
        const atributes: any[] = await this.getAtributeBack(
          this.goodId,
          vn_inv_anterior
        );
        if (atributes.length > 0) {
          this.inventary = atributes;
        }
        setTimeout(() => {
          this.goodChange++;
        }, 100);
      } else {
        this.viewAct = false;
        setTimeout(() => {
          this.goodChange++;
        }, 100);
      }
    } else {
      this.viewAct = false;
      setTimeout(() => {
        this.goodChange++;
      }, 100);
    }
  }

  createInventory() {
    return new Promise<number>((res, rej) => {
      const model: IInventoryGood = {
        goodNumber: this.goodId,
        dateInventory: this.inventoryDataForm.get('fechaInventario').value,
        responsible: this.inventoryDataForm.get('responsable').value,
      };
      this.inventoryService.create(model).subscribe({
        next: resp => {
          this.inventoryForGood(this.goodId);
          res(Number(resp.inventoryNumber));
        },
        error: err => {
          res(null);
        },
      });
    });
  }

  createLineaInventory(
    inventoryNumber: number,
    typeInventoryNumber: number,
    valueAttributeInventory: string
  ) {
    const model: ILineaInventory = {
      goodNumber: this.goodId,
      inventoryNumber,
      typeInventoryNumber,
      valueAttributeInventory,
    };
    this.inventoryService.createLinesInventory(model).subscribe({
      next: resp => {
        console.log(resp);
      },
      error: err => {},
    });
  }

  updateInventary(
    inventoryNumber: number,
    typeInventoryNumber: number,
    valueAttributeInventory: string
  ) {
    const model: ILineaInventory = {
      goodNumber: this.goodId,
      inventoryNumber,
      typeInventoryNumber,
      valueAttributeInventory,
    };
    this.inventoryService.updateLinesInventory(model).subscribe({
      next: resp => {
        console.log(resp);
      },
      error: err => {},
    });
  }
}
