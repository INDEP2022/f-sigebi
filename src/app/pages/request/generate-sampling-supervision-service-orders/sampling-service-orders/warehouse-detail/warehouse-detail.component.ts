import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { TABLE_SETTINGS } from '../../../../../common/constants/table-settings';
import { ListParams } from '../../../../../common/repository/interfaces/list-params';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { BasePage } from '../../../../../core/shared/base-page';
import { LIST_WAREHOUSE_COLUMNS } from './columns/list-warehouses-columns';

var data = [
  {
    noWarehouse: 'P44',
    name: 'ALMACEN DE PRUEBA LAR',
    state: 'Ciudad de Mexico',
    direction:
      'PRIVADA DE LOS REYES, LOS REYES 27, AZACAPOTZALCO, CIUDAD DE MEXICO',
  },
];
@Component({
  selector: 'app-warehouse-detail',
  templateUrl: './warehouse-detail.component.html',
  styles: [],
})
export class WarehouseDetailComponent extends BasePage implements OnInit {
  @Output() storeSelected: EventEmitter<any> = new EventEmitter();
  @Input() SampleOrderId: number = null;
  showSamplingDetail: boolean = true;
  searchForm: ModelForm<any>;
  warehoseSelected: any;
  paragraphs = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  private goodsQueryService = inject(GoodsQueryService);
  private authService = inject(AuthService);
  private orderService = inject(OrderServiceService);

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: '',
      columns: LIST_WAREHOUSE_COLUMNS,
    };
    this.initForm();
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      organization: [null],
      postalCode: [null],
      name: [null, [Validators.pattern(STRING_PATTERN)]],
      address1: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  search() {
    this.paragraphs = new LocalDataSource();
    const form = this.searchForm.getRawValue();
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      for (const key in form) {
        if (
          form[key] != null &&
          (key == 'organization' || key == 'postalCode')
        ) {
          data[`filter.${key}`] = `$eq:${form[key]}`;
        } else if (form[key] != null) {
          data[`filter.${key}`] = `$ilike:${form[key]}`;
        }
      }
      data['filter.regionalDelegation'] = `$eq:${+this.authService.decodeToken()
        .department}`;
      this.getStoreView(data);
    });
  }

  clean() {
    this.searchForm.reset();
    this.paragraphs = new LocalDataSource();
    this.params = new BehaviorSubject<ListParams>(new ListParams());
  }

  rowSelect(event: any) {
    this.warehoseSelected = event.data;
    this.storeSelected.emit(this.warehoseSelected);
  }

  getStoreView(params: ListParams) {
    console.log(params);
    this.goodsQueryService.getCatStoresView2(params).subscribe({
      next: resp => {
        this.paragraphs.load(resp.data);
        this.totalItems = resp.count;
      },
    });
  }

  save() {
    console.log(this.warehoseSelected);
    const body = {
      idStore: this.warehoseSelected.organization,
      idSamplingOrder: this.SampleOrderId,
    };
    this.orderService.updateSampleOrder(body).subscribe({
      next: resp => {
        this.onLoadToast('success', 'Se guardaron los cambios');
      },
      error: error => {
        this.onLoadToast('error', 'No se pudo guardar el formulario');
      },
    });
  }
}
