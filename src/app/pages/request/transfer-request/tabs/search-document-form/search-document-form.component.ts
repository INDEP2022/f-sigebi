import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  NUM_POSITIVE,
  NUM_POSITIVE_LETTERS,
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DocumentFormComponent } from '../../../shared-request/document-form/document-form.component';
import { DocumentShowComponent } from '../../../shared-request/document-show/document-show.component';
import { EXPEDIENT_DOC_SEA_COLUMNS } from '../registration-request-form/expedient-doc-columns';

@Component({
  selector: 'app-search-document-form',
  templateUrl: './search-document-form.component.html',
  styleUrls: ['../../styles/search-document-form.scss'],
})
export class SearchDocumentFormComponent extends BasePage implements OnInit {
  searchForm: ModelForm<any>;
  typeDocuments = new DefaultSelect();
  regionalsDelegations = new DefaultSelect();
  states = new DefaultSelect();
  transferents = new DefaultSelect();
  showSearchForm: boolean = false;
  documentsSeaData: any[] = [];
  private data: any[][] = [];
  rowSelected: any = null;

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  idDeleReg: number = 0;

  constructor(
    private modalService: BsModalService,
    private bsParentModalRef: BsModalRef,
    private fb: FormBuilder,
    private wcontentService: WContentService,
    private regDelegationService: RegionalDelegationService,
    private delegationStateService: DelegationStateService,
    private transferentService: TransferenteService
  ) {
    super();
    this.settings.actions.delete = true;

    this.settings = {
      ...this.settings,
      columns: EXPEDIENT_DOC_SEA_COLUMNS,
      edit: {
        editButtonContent: '<i class="fa fa-file text-success mx-2"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="fa fa-eye text-primary mx-2"></i>',
      },
    };
  }

  ngOnInit(): void {
    this.initForm();
    this.getTypeDocumentSelect(new ListParams());
    this.getRegionalDelegationSelect(new ListParams());

    this.reactiveFormCall();
  }

  initForm() {
    this.searchForm = this.fb.group({
      texto: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1000)],
      ],
      xTipoDocumento: [null],
      dDocTitle: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      xIdSIAB: [
        null,
        [Validators.pattern(NUM_POSITIVE), Validators.maxLength(30)],
      ],
      xcargoRemitente: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      dDocAuthor: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      xtipoTransferencia: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      xresponsable: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      dDocName: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      xDelegacionRegional: [null],
      xcontribuyente: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      xidExpediente: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(10)],
      ],
      xestado: [null],
      xnoOficio: [
        null,
        [Validators.pattern(NUM_POSITIVE_LETTERS), Validators.maxLength(30)],
      ],
      xidSolicitud: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(10)],
      ],
      xidTransferente: [null],
      xComments: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1000)],
      ],
      xidBien: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(10)],
      ],
      xremitente: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
    });
  }

  getTypeDocumentSelect(params: ListParams) {
    this.wcontentService.getDocumentTypes(params).subscribe({
      next: (resp: any) => {
        this.typeDocuments = new DefaultSelect(resp.data, resp.length);
      },
    });
  }

  getRegionalDelegationSelect(params: ListParams) {
    params['filter.description'] = `$ilike:${params.text}`;
    this.regDelegationService.getAll(params).subscribe({
      next: resp => {
        this.regionalsDelegations = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  getStateSelect(params: ListParams) {
    params['filter.regionalDelegation'] = `$eq:${this.idDeleReg}`;
    this.delegationStateService.getAll(params).subscribe({
      next: resp => {
        const result = resp.data
          .map(x => {
            return x.stateCode;
          })
          .filter(x => x !== null);

        this.states = new DefaultSelect(result, result.length);
      },
    });
  }

  getTransferentSelect(params: ListParams) {
    params['filter.nameTransferent'] = `$ilike:${params.text}`;
    params['filter.status'] = `$eq:${1}`;
    this.transferentService.getAll(params).subscribe({
      next: resp => {
        this.transferents = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  search() {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData() {
    if (this.data.length == 0) {
      //siab 3785794
      this.loading = true;
      const form = this.searchForm.getRawValue();
      this.wcontentService.getDocumentos(form, new ListParams()).subscribe({
        next: (resp: any) => {
          const result = resp.data.map(async (item: any) => {
            const typeDocument = await this.getTypeDocument(
              item.xtipoDocumento
            );
            item['xtipoDocumentoNombre'] = typeDocument;
          });
          Promise.all(result).then(data => {
            this.documentsSeaData = this.setPaginate([...resp.data]);
            this.totalItems = resp.data.length;
            this.loading = false;
          });
        },
      });
    } else {
      this.selectPage();
    }
  }
  private selectPage() {
    this.documentsSeaData = [...this.data[this.params.value.page - 1]];
  }
  private setPaginate(value: any[]): any[] {
    let data: any[] = [];
    let dataActual: any = [];
    value.forEach((val, i) => {
      dataActual.push(val);
      if ((i + 1) % this.params.value.limit === 0) {
        this.data.push(dataActual);
        dataActual = [];
      }
    });
    data = this.data[this.params.value.page - 1];
    return data;
  }

  getTypeDocument(id: number) {
    return new Promise((resolve, reject) => {
      if (id) {
        const result = this.typeDocuments.data.filter(x => {
          return x.ddocType === id;
        });
        resolve(result[0].ddescription);
      } else {
        resolve('');
      }
    });
  }

  clean() {
    this.searchForm.reset();
    this.documentsSeaData = [];
  }
  documentSelect(event: any) {
    this.rowSelected = event.data;
  }

  //añadir nuevo documento
  newDocument() {
    this.openModal(DocumentFormComponent, 'doc-buscar', this.rowSelected);
  }

  //abrir detalle del documento
  showDocument(event: any) {
    this.openModal(DocumentShowComponent, 'doc-buscar', event.data);
  }

  //abrir reporte
  deleteDocument(event: any) {
    this.loading = true;
    const docName = event.data.dDocName;
    this.wcontentService.obtainFile(docName).subscribe({
      next: resp => {
        const linkSource = 'data:application/pdf;base64,' + resp;
        const downloadLink = document.createElement('a');
        const fileName = `${docName}.pdf`;

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
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

  reactiveFormCall() {
    this.searchForm.controls['xDelegacionRegional'].valueChanges.subscribe(
      (data: any) => {
        if (data) {
          this.idDeleReg = data;
          this.getStateSelect(new ListParams());
        }
      }
    );
  }
}
