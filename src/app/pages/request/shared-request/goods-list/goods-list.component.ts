import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ShowDocumentsGoodComponent } from '../expedients-tabs/sub-tabs/good-doc-tab/show-documents-good/show-documents-good.component';
import { ViewDetailGoodsComponent } from '../select-goods/view-detail-goods/view-detail-goods.component';
import { ViewFileButtonComponent } from '../select-goods/view-file-button/view-file-button.component';
import { SELECT_GOODS_LIST_COLUMNS } from './select-good-list-columns';

@Component({
  selector: 'app-goods-list',
  templateUrl: './goods-list.component.html',
  styleUrls: ['./good-list.component.scss'],
})
export class GoodsListComponent extends BasePage implements OnInit {
  @ViewChild('table', { static: false }) table: any;
  @Input() requestId: number;
  @Input() processDetonate: number | string;
  selectedGoodParams = new BehaviorSubject<ListParams>(new ListParams());
  selectedGoodTotalItems: number = 0;
  selectedGoodColumns: any[] = [];
  selectedGoodSettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };

  goodTestData = [
    {
      origin: 'INVENTARIOS',
      description: 'CANDIL DECORATIVO',
      key: '801-69-68-65-2',
      manageNo: 605,
      transferAmount: 2,
      transactionAmount: 60,
      reservedAmount: 20,
      availableAmount: 40,
      destination: 'Admon',
      fileNo: 141,
      transferRequestNo: 6882,
      saeNo: '',
    },
  ];

  /* INJECTIONS */
  private rejectedGoodService = inject(RejectedGoodService);
  private typeRelevantService = inject(TypeRelevantService);

  constructor(
    private modalService: BsModalService,
    private requestService: RequestService
  ) {
    super();
    this.selectedGoodSettings.columns = SELECT_GOODS_LIST_COLUMNS;
  }

  ngOnInit(): void {
    const self = this;
    this.selectedGoodSettings.columns = {
      viewFile: {
        title: 'Expediente',
        type: 'custom',
        sort: false,
        renderComponent: ViewFileButtonComponent,
        onComponentInitFunction(instance: any, component: any = self) {
          instance.action.subscribe((row: any) => {
            component.showDocuments(row.goodId);
          });
        },
      },
      ...this.selectedGoodSettings.columns,
    };

    this.selectedGoodParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(data => {
        if (this.requestId) {
          this.getData(data);
        }
      });
  }

  showDocuments(goodId: any): void {
    const idGood = goodId;
    const idRequest = this.requestId;
    let config: ModalOptions = {
      initialState: {
        idGood,
        idRequest,
        parameter: '',
        typeDoc: 'request-assets',
        callback: (next: boolean) => {
          //if(next) this.getExample();
        },
      },
      class: `modalSizeXL modal-dialog-centered`,
      ignoreBackdropClick: true,
    };
    this.modalService.show(ShowDocumentsGoodComponent, config);
  }

  getData(params: ListParams) {
    //const good: any = Object.assign({ viewFile: '' }, this.goodTestData[0]);
    /*const good: any = Object.assign(this.goodTestData[0]);
    this.selectedGoodColumns = [...this.selectedGoodColumns, good];
    this.selectedGoodTotalItems = this.selectedGoodColumns.length;*/
    params['filter.applicationId'] = `$eq:${this.requestId}`;
    this.rejectedGoodService.getAll(params).subscribe({
      next: resp => {
        const result = resp.data.map(async (item: any) => {
          this.loading = false;

          item['typeRelevantDescrip'] = await this.getTypeRelevant(
            item.relevantTypeId
          );
        });
        this.loading = true;

        Promise.all(result).then(data => {
          this.selectedGoodColumns = resp.data;
          this.selectedGoodTotalItems = resp.count;
          setTimeout(() => {
            this.displayGrouperName();
            this.loading = false;
          }, 300);
        });
      },
    });
  }

  getTypeRelevant(id: number) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params[`filter.id`] = `$eq:${id}`;
      this.typeRelevantService.getAll(params).subscribe({
        next: resp => {
          resolve(resp.data[0].description);
        },
        error: error => {
          resolve('');
        },
      });
    });
  }

  getFormSeach(recordId: any) {
    this.requestService.getById(recordId).subscribe({
      next: resp => {
        console.log('Respuesta del servidor:', resp); // Imprime la respuesta completa
        this.viewFile(resp);
      },
      error: error => {
        this.loading = false;
        this.alert('warning', 'No se encontraron registros', '');
      },
    });
  }

  viewFile(data: any) {
    this.openModalInformation(data, 'detail');
  }

  private openModalInformation(data: any, typeInfo: string) {
    let config: ModalOptions = {
      initialState: {
        data,
        typeInfo,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ViewDetailGoodsComponent, config);
  }

  displayGrouperName() {
    if (this.processDetonate == 'RES_NUMERARIO') {
      const columns = this.table.grid.getColumns();
      const grouperName = columns.find((x: any) => x.id == 'goodGrouper');
      grouperName.hide = true;
    }
  }
}
