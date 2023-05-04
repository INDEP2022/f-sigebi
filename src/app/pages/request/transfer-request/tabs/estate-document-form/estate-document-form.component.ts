import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
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
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
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
  rowSelected: any = null;
  regionalDelegacionId: number = 0;

  constructor(
    private modalService: BsModalService,
    private bsParentModalRef: BsModalRef,
    private fb: FormBuilder,
    private typeRelevantService: TypeRelevantService,
    private goodServices: GoodService,
    private genericService: GenericService,
    private fractionService: FractionService,
    private requestService: RequestService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: EXPEDIENT_DOC_EST_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.initForm();
    this.getGoodTypeSelect(new ListParams());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['requestId'].currentValue) {
      this.searchForm.controls['requestId'].setValue(this.requestId);
      this.params.value.addFilter('requestId', this.requestId);
      this.getData();
      if (this.requestId !== null) {
        this.getRequest();
      }
    }
  }

  initForm() {
    this.searchForm = this.fb.group({
      goodId: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      goodTypeId: [null],
      requestId: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      goodDescription: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  selectRow(event: any) {
    this.rowSelected = event.data;
  }

  getRequest() {
    this.requestService.getById(this.requestId).subscribe({
      next: (resp: any) => {
        this.regionalDelegacionId = resp.regionalDelegationId;
      },
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

  //abrir ver documentos
  showDocsEstValidate() {
    if (!this.rowSelected) {
      this.message(
        'info',
        'Error',
        'Seleccione un data para poder ver sus documentos'
      );
      return;
    }
    this.rowSelected['regionalDelegacionId'] = this.regionalDelegacionId;
    this.openModal(DocumentsListComponent, 'doc-bien', this.rowSelected);
  }

  selectDocument(selectDocument?: any) {
    if (selectDocument?.isSelected) {
      this.documentSelect = true;
    } else {
      this.documentSelect = false;
    }
  }

  clean() {
    this.documentsEstData = [];
    this.searchForm.reset();
    this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    this.requestId = null;
  }

  search() {
    // validar requestId
    console.log(this.searchForm.controls['goodDescription'].value);
    if (
      this.searchForm.controls['goodDescription'].value != null ||
      this.searchForm.controls['requestId'].value != null ||
      this.searchForm.controls['goodTypeId'].value != null ||
      this.searchForm.controls['goodId'].value != null
    ) {
      this.paginator();
    } else {
      this.message('info', 'Error', 'Debe llenar algun filtro.');
    }
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
      if (this.requestId != null) {
        this.getRequest();
      }
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
          item['requestId'] = item.requestId;
          item['physicalStatusName'] = physicalStatus;
          const destiny = await this.getDestiny(item.physicalStatus);
          item['destinyName'] = destiny;
          if (item.fractionId) {
            //const fraction = await this.getFraction(item.fractionId);
            item['fractionName'] = item.fractionId.description;
          } else {
            item['fractionName'] = '';
          }
        });

        Promise.all(result).then(data => {
          this.documentsEstData = resp.data;
          this.totalItems = resp.count;
          this.loading = false;
        });
      },
      error: error => {
        console.log(error);
        this.loading = false;
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
            resolve(resp.data.length > 0 ? resp.data[0].description : '');
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
            resolve(resp.data.length > 0 ? resp.data[0].description : '');
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

  openModal(component: any, typeDoc: string, parameters?: any) {
    let config: ModalOptions = {
      initialState: {
        parameter: parameters,
        typeDoc: typeDoc,
        callback: (next: boolean) => {
          //if(next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsParentModalRef = this.modalService.show(component, config);

    /*this.bsModalRef.content.event.subscribe((res: any) => {
      this.matchLevelFraction(res);
    });*/
  }

  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
  }
}
