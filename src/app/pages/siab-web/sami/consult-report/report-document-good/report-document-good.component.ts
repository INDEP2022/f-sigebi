import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/good/good.model';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { BasePage, TABLE_SETTINGS } from 'src/app/core/shared';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { GOOD_DOCUMENTES_COLUMNS } from 'src/app/pages/request/shared-request/expedients-tabs/sub-tabs/good-doc-tab/good-doc-columns';
import { ShowDocumentsGoodComponent } from 'src/app/pages/request/shared-request/expedients-tabs/sub-tabs/good-doc-tab/show-documents-good/show-documents-good.component';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-report-document-good',
  templateUrl: './report-document-good.component.html',
  styleUrls: ['../report-good/report-good.component.scss'],
})
export class ReportDocumentGoodComponent extends BasePage implements OnInit {
  goodTypes = new DefaultSelect();
  searchForm: FormGroup = new FormGroup({});
  showSearchForm: boolean = false;
  goodSelect: IGood[] = [];
  task: any;
  statusTask: any = '';
  allGooods: IGood[] = [];
  paragraphs: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsSearch = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  idRequest: number = 0;
  constructor(
    private typeRelevantService: TypeRelevantService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodService: GoodService
  ) {
    super();
    this.settings = { ...TABLE_SETTINGS, actions: false, selectMode: 'multi' };
    this.settings.columns = GOOD_DOCUMENTES_COLUMNS;
  }

  ngOnInit(): void {
    this.task = JSON.parse(localStorage.getItem('Task'));
    this.statusTask = this.task?.status;
    this.initForm();
    this.getGoodTypeSelect(new ListParams());
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodsRequest());
  }

  initForm() {
    this.searchForm = this.fb.group({
      goodId: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(30)],
      ],
      goodTypeId: [null],
      requestId: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      goodDescription: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
    });
  }

  getGoodTypeSelect(params: ListParams) {
    params['filter.description'] = `$ilike:${params.text}`;
    this.typeRelevantService.getAll(params).subscribe({
      next: resp => {
        this.goodTypes = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  showDocuments(): void {
    if (this.goodSelect.length == 0 || this.goodSelect.length >= 2) {
      this.onLoadToast(
        'warning',
        'Debes de tener mínimo un bien seleccionado',
        ''
      );
    } else {
      const idGood = this.goodSelect[0].id;
      const idRequest = 0;
      let config: ModalOptions = {
        initialState: {
          statusTask: this.statusTask,
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
  }

  selectTableColumns(event: any): void {
    this.goodSelect = event.selected;
  }

  getGoodsRequest() {
    this.loading = true;
    this.params.getValue()['search'] = this.params.getValue().text;
    this.params.getValue()['filter.delegationNumber'] = 11;
    //this.searchForm.get('requestId').setValue(61590);
    this.goodService.getAll(this.params.getValue()).subscribe({
      next: (data: any) => {
        this.loading = false;
        const filterGoodType = data.data.map(async (item: any) => {
          const goodType = await this.getGoodType(item.goodTypeId);
          item['goodTypeName'] = goodType;

          if (item['physicalStatus'] == 1) item['physicalStatus'] = 'BUENO';
          if (item['physicalStatus'] == 2) item['physicalStatus'] = 'MALO';
          if (item['stateConservation'] == 1)
            item['stateConservation'] = 'BUENO';
          if (item['stateConservation'] == 2)
            item['stateConservation'] = 'MALO';
          if (item['destiny'] == 1) item['destiny'] = 'VENTA';
          const fraction = item['fraccion'];
          item['fractionId'] = fraction?.code + ' ' + fraction?.description;
        });

        Promise.all(filterGoodType).then(x => {
          this.allGooods = data.data;
          this.paragraphs.load(data.data);
          this.totalItems = data.count;
          this.loading = false;
        });
      },
      error: error => {
        this.loading = false;
      },
    });
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

  search() {
    const good = this.searchForm.get('goodId').value;
    const goodTypeId = this.searchForm.get('goodTypeId').value;
    const requestId = this.searchForm.get('requestId').value;
    const goodDescription = this.searchForm.get('goodDescription').value;
    this.idRequest = requestId;
    if (!good && !goodTypeId && requestId && !goodDescription) {
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() =>
          this.getGoodsSearchRequest(
            requestId,
            good,
            goodTypeId,
            goodDescription
          )
        );
    } else {
      this.paramsSearch
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() =>
          this.getGoodsSearchRequest(
            requestId,
            good,
            goodTypeId,
            goodDescription
          )
        );
    }
  }

  getGoodsSearchRequest(
    request?: number,
    paramGood?: string,
    paramGoodType?: string,
    goodDescription?: string
  ) {
    this.loading = true;
    if (request) {
      this.paramsSearch.getValue()['filter.requestId'] = request;
    }
    if (paramGood) {
      this.paramsSearch.getValue()['filter.goodId'] = paramGood;
    }
    if (paramGoodType) {
      this.paramsSearch.getValue()['filter.goodTypeId'] = paramGoodType;
    }
    if (goodDescription) {
      this.paramsSearch.getValue()['filter.goodDescription'] = goodDescription;
    }
    this.getData();
  }

  getData() {
    //this.paramsSearch.getValue()['filter.delegationNumber'] = 11;
    //this.searchForm.get('requestId').setValue(this.idRequest);
    this.goodService.getAll(this.paramsSearch.getValue()).subscribe({
      next: async (data: any) => {
        const filterGoodType = data.data.map(async (item: any) => {
          const goodType = await this.getGoodType(item.goodTypeId);
          item['goodTypeName'] = goodType;
          //item['requestId'] = this.idRequest;

          if (item['physicalStatus'] == 1) item['physicalStatus'] = 'BUENO';
          if (item['physicalStatus'] == 2) item['physicalStatus'] = 'MALO';
          if (item['stateConservation'] == 1)
            item['stateConservation'] = 'BUENO';
          if (item['stateConservation'] == 2)
            item['stateConservation'] = 'MALO';
          if (item['destiny'] == 1) item['destiny'] = 'VENTA';

          const fraction = item['fraccion'];
          item['fractionId'] = fraction?.code + ' ' + fraction?.description;
        });

        Promise.all(filterGoodType).then(x => {
          this.paragraphs.load(data.data);
          this.totalItems = data.count;
          this.loading = false;
        });
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  clean() {}
}
