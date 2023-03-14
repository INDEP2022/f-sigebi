import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGood } from 'src/app/core/models/ms-good/good';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DocumentsListComponent } from '../../../programming-request-components/execute-reception/documents-list/documents-list.component';
import { EXPEDIENT_DOC_EST_COLUMNS } from '../registration-request-form/expedient-doc-columns';

@Component({
  selector: 'app-estate-document-form',
  templateUrl: './estate-document-form.component.html',
  styleUrls: ['../../styles/search-document-form.scss'],
})
export class EstateDocumentFormComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() requestId: number = null;
  searchForm: ModelForm<IGood>;

  documentSelect: boolean = false;
  goodTypes = new DefaultSelect();
  documentsEstData: any[] = [];
  showSearchForm: boolean = false;
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private typeRelevantService: TypeRelevantService,
    private goodServices: GoodService,
    private genericService: GenericService,
    private fractionService: FractionService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
      columns: EXPEDIENT_DOC_EST_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.initForm();
    this.getGoodTypeSelect(new ListParams());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['requestId'].currentValue) {
      console.log(changes['requestId'].currentValue);
      this.params.value.addFilter('requestId', this.requestId);
      this.getData();
    }
  }

  initForm() {
    this.searchForm = this.fb.group({
      goodId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      goodTypeId: [null],
      requestId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      goodDescription: [null, [Validators.pattern(STRING_PATTERN)]],
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

  showDocsEstValidate() {
    if (!this.documentSelect) {
      alert('Selecciona un documento');
    } else {
      const showDoctsEst = this.modalService.show(DocumentsListComponent, {
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      });
    }
  }

  selectDocument(selectDocument?: any) {
    if (selectDocument?.isSelected) {
      this.documentSelect = true;
    } else {
      this.documentSelect = false;
    }
  }

  search() {
    this.paginator();
  }

  buildFilters() {
    var form = this.searchForm.getRawValue();
    for (const key in form) {
      if (form[key] !== null) {
        this.params.value.addFilter(key, form[key]);
      }
    }
  }

  paginator() {
    this.buildFilters();
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getData();
    });
  }

  getData() {
    this.loading = true;
    const filter = this.params.getValue().getParams();
    this.goodServices.getAll(filter).subscribe({
      next: resp => {
        const result = resp.data.map(async (item: any) => {
          const physicalStatus = await this.getPhysicalStatus(
            item.physicalStatus
          );
          item['physicalStatusName'] = physicalStatus;
          const destiny = await this.getDestiny(item.physicalStatus);
          item['destinyName'] = destiny;
          const fraction = await this.getFraction(item.fractionId);
          item['fractionName'] = fraction;
        });

        Promise.all(result).then(data => {
          this.documentsEstData = resp.data;
          this.loading = false;
        });
      },
    });
  }

  getPhysicalStatus(id: number) {
    return new Promise((resolve, reject) => {
      if (id !== null) {
        var params = new ListParams();
        params['filter.keyId'] = `$eq:${id}`;
        params['filter.name'] = `$eq:Estado Fisico`;
        this.genericService.getAll(params).subscribe({
          next: resp => {
            resolve(resp.data[0].description);
          },
        });
      } else {
        resolve('');
      }
    });
  }

  getDestiny(id: number) {
    return new Promise((resolve, reject) => {
      if (id !== null) {
        var params = new ListParams();
        params['filter.keyId'] = `$eq:${id}`;
        params['filter.name'] = `$eq:Destino`;
        this.genericService.getAll(params).subscribe({
          next: resp => {
            resolve(resp.data[0].description);
          },
        });
      } else {
        resolve('');
      }
    });
  }

  getFraction(id: number) {
    return new Promise((resolve, reject) => {
      if (id !== null) {
        const params = new ListParams();
        params['filter.id'] = `$eq:${id}`;
        this.fractionService.getAll(params).subscribe({
          next: resp => {
            resolve(resp.data[0].description);
          },
        });
      } else {
        resolve('');
      }
    });
  }
}
