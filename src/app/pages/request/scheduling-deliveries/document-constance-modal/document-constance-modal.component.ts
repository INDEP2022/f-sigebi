import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { CertificatesGoodsService } from 'src/app/core/services/ms-delivery-constancy/certificates-goods.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage } from 'src/app/core/shared';
import {
  NUM_POSITIVE,
  NUM_POSITIVE_LETTERS,
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DocumentFormComponent } from '../../shared-request/document-form/document-form.component';
import { EXPEDIENT_DOC_SEA_COLUMNS } from './document-constance-column';

@Component({
  selector: 'app-document-constance-modal',
  templateUrl: './document-constance-modal.component.html',
  styles: [],
})
export class DocumentConstanceModalComponent
  extends BasePage
  implements OnInit
{
  searchForm: ModelForm<any>;
  typeDocuments = new DefaultSelect();
  regionalsDelegations = new DefaultSelect();
  states = new DefaultSelect();
  transferents = new DefaultSelect();
  showSearchForm: boolean = false;
  documentsSeaData: any[] = [];
  private data: any[][] = [];
  rowSelected: any = null;
  //data pasada desde el padre
  certificate: any = null;
  goodDelivery: any = null;

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
    private transferentService: TransferenteService,
    private certificateGoodService: CertificatesGoodsService
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

  private bsModelRef = inject(BsModalRef);

  ngOnInit(): void {
    this.initForm();
    this.getTypeDocumentSelect(new ListParams());
    this.getRegionalDelegationSelect(new ListParams());

    if (this.certificate.certificateId != null) {
      this.getCertificateGood();
    }
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

    this.searchForm
      .get('xDelegacionRegional')
      .setValue(this.goodDelivery.delRegId);
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
    this.data = [];
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
            this.documentsSeaData =
              resp.data.length > 10
                ? this.setPaginate([...resp.data])
                : resp.data;
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
    if (this.rowSelected?.xDelegacionRegional == null) {
      this.onLoadToast(
        'info',
        '',
        'El registro no cuenta con una delegación regional'
      );
      return;
    }

    this.openModal(DocumentFormComponent, 'doc-constance', this.rowSelected);
  }
  //abrir detalle del documento
  showDocument(event: any) {
    //this.openModal(DocumentShowComponent, 'doc-buscar', event.data);
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

  close() {
    this.bsModelRef.hide();
  }

  /* Get Certificate Good */
  getCertificateGood() {
    const params = new ListParams();
    let goodIds = '';
    let NoGoodSiab = '';
    this.rowSelected = {};
    params['filter.certificateId'] = `$eq:${this.certificate.certificateId}`;
    this.certificateGoodService.getAll(params).subscribe({
      next: resp => {
        this.rowSelected.xDelegacionRegional = this.goodDelivery.delRegId;
        this.certificate.delRegId = this.goodDelivery.delRegId;

        resp.data.map((item: any) => {
          goodIds = goodIds + ' ' + item.goodId;
          NoGoodSiab = NoGoodSiab + '' + (item.siabGoodNum || '');

          this.rowSelected.xidBien = goodIds;
          this.rowSelected.xIdSIAB = NoGoodSiab;
        });
      },
    });
  }
}
