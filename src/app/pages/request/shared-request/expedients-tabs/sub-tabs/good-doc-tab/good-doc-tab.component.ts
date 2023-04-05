import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/good/good.model';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GOOD_DOCUMENTES_COLUMNS } from './good-doc-columns';
import { ShowDocumentsGoodComponent } from './show-documents-good/show-documents-good.component';

@Component({
  selector: 'app-good-doc-tab',
  templateUrl: './good-doc-tab.component.html',
  styleUrls: ['./good-doc-tab.component.scss'],
})
export class GoodDocTabComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any = [];
  totalItems: number = 0;
  idRequest: number = 0;
  @Input() typeDoc = '';
  goodSelect: IGood[] = [];
  constructor(
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private goodService: GoodService,
    private typeRelevantService: TypeRelevantService
  ) {
    super();
    this.idRequest = this.activatedRoute.snapshot.paramMap.get(
      'id'
    ) as unknown as number;
    this.settings = { ...TABLE_SETTINGS, actions: false, selectMode: 'multi' };
    this.settings.columns = GOOD_DOCUMENTES_COLUMNS;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodsRequest());
  }

  getGoodsRequest() {
    if (this.idRequest) {
      this.loading = true;
      this.params.getValue()['search'] = this.params.getValue().text;
      this.params.getValue()['filter.requestId'] = this.idRequest;
      this.goodService.getAll(this.params.getValue()).subscribe({
        next: async (data: any) => {
          const filterGoodType = data.data.map(async (item: any) => {
            const goodType = await this.getGoodType(item.goodTypeId);
            item['goodTypeId'] = goodType;
            item['requestId'] = this.idRequest;

            if (item['physicalStatus'] == 1) item['physicalStatus'] = 'BUENO';
            if (item['physicalStatus'] == 2) item['physicalStatus'] = 'MALO';
            if (item['stateConservation'] == 1)
              item['stateConservation'] = 'BUENO';
            if (item['stateConservation'] == 2)
              item['stateConservation'] = 'MALO';
            if (item['destiny'] == 1) item['destiny'] = 'VENTA';

            const fraction = item['fractionId'];
            item['fractionId'] = fraction.description;
          });

          Promise.all(filterGoodType).then(x => {
            this.paragraphs = data.data;
            this.totalItems = data.count;
            this.loading = false;
          });
        },
        error: error => {
          this.loading = false;
        },
      });
    }
  }

  getGoodType(goodTypeId: number) {
    return new Promise((resolve, reject) => {
      if (goodTypeId !== null) {
        this.typeRelevantService.getById(goodTypeId).subscribe({
          next: (data: any) => {
            resolve(data.description);
          },
        });
      } else {
        resolve('');
      }
    });
  }

  selectTableColumns(event: any): void {
    this.goodSelect = event.selected;
  }

  showDocuments(): void {
    if (this.goodSelect.length == 0 || this.goodSelect.length >= 2) {
      this.onLoadToast(
        'warning',
        'Debes de tener minimo un bien seleccionado',
        ''
      );
    } else {
      const idGood = this.goodSelect[0].id;
      const idRequest = this.idRequest;
      let config: ModalOptions = {
        initialState: {
          idGood,
          idRequest,
          parameter: '',
          type: 'request-assets',
          callback: (next: boolean) => {
            //if(next) this.getExample();
          },
        },
        class: `modalSizeXL modal-dialog-centered`,
        ignoreBackdropClick: true,
      };
      this.modalService.show(ShowDocumentsGoodComponent, config);
    }
  }
}
