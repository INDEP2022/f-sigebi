import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequest } from 'src/app/core/models/catalogs/request.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { NewDocumentComponent } from '../new-document/new-document.component';
import { DOC_REQUEST_TAB_COLUMNS } from './doc-request-tab-columns';
import { SeeInformationComponent } from './see-information/see-information.component';

interface searchTable {
  noDoc: string;
  noReq: string;
  docTit: string;
  docType: string;
  author: string;
  dateCrea: string;
}

@Component({
  selector: 'app-doc-request-tab',
  templateUrl: './doc-request-tab.component.html',
  styleUrls: ['./doc-request-tab.component.scss'],
})
export class DocRequestTabComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @ViewChild('myTemplate', { static: true }) template: TemplateRef<any>;
  @ViewChild('myTemplate', { static: true, read: ViewContainerRef })
  container: ViewContainerRef;
  @Input() typeDoc = '';
  title: string = '';
  selectDocType = new DefaultSelect<any>();
  docRequestForm: ModelForm<any>;
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: searchTable[] = [];
  columns = DOC_REQUEST_TAB_COLUMNS;
  parameter: any;
  type: string = '';
  selectRegDelegation = new DefaultSelect<any>();
  selectState = new DefaultSelect<any>();
  selectTransfe = new DefaultSelect<any>();

  public data: any[] = [
    {
      id: 1,
      noDoc: 'SAE15545',
      noReq: '27448',
      docTit: 'Solicitud_27448',
      docType: 'SOLICITUD DE TRANSFERENCIA',
      author: 'ALEJANDRO',
      dateCrea: '10/10/2022',
    },
    {
      id: 2,
      noDoc: 'SAE15335',
      noReq: '27328',
      docTit: 'Solicitud_27328',
      docType: 'SOLICITUD DE TRANSFERENCIA',
      author: 'ALEJANDRO',
      dateCrea: '01/10/2022',
    },
    {
      id: 2,
      noDoc: 'SAE15335',
      noReq: '27328',
      docTit: 'Solicitud_27328',
      docType: 'SOLICITUD DE TRANSFERENCIA',
      author: 'ALEJANDRO',
      dateCrea: '01/10/2022',
    },
    {
      id: 2,
      noDoc: 'SAE15335',
      noReq: '27328',
      docTit: 'Solicitud_27328',
      docType: 'SOLICITUD DE TRANSFERENCIA',
      author: 'ALEJANDRO',
      dateCrea: '01/10/2022',
    },
  ];

  constructor(
    public fb: FormBuilder,
    public modalService: BsModalService,
    private modalRef: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.typeDoc = this.type ? this.type : this.typeDoc;
    if (this.typeDoc === 'doc-request') {
      //hacer visible la vista principal y no el ng-template
      this.container.createEmbeddedView(this.template);
    }
    this.prepareForm();
    this.setTypeColumn();
    this.settings = { ...TABLE_SETTINGS, actions: false };
    this.settings.columns = DOC_REQUEST_TAB_COLUMNS;

    this.columns.button = {
      ...this.columns.button,
      onComponentInitFunction: (instance?: any) => {
        instance.btnclick1.subscribe((data: any) => {
          console.log(data);
          this.openDetail();
        }),
          instance.btnclick2.subscribe((data: any) => {
            this.openDoc();
          });
      },
    };

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  ngOnChanges(changes: SimpleChanges): void {
    let onChangeCurrentValue = changes['typeDoc'].currentValue;
    this.typeDoc = onChangeCurrentValue;
    this.setTitle(onChangeCurrentValue);
  }

  prepareForm(): void {
    this.docRequestForm = this.fb.group({
      id: [null],
      text: [null],
      docType: [null],
      docTitle: [null],
      typeTrasf: [null],
      contributor: [null],
      author: [null],
      sender: [null],
      noOfice: [null],
      senderCharge: [null],
      comment: [null],
      noRequest: [{ value: 157, disabled: true }],
      responsible: [null],

      /* Solicitud Transferencia */
      regDelega: [null],
      state: [null],
      tranfe: [null],
    });
  }

  getData() {
    this.paragraphs = this.data;
  }

  getDocType(event: any) {}

  search(): void {}

  cleanForm(): void {
    this.docRequestForm.reset();
  }

  openDetail(): void {
    this.openModalInformation('', 'detail');
  }

  openDoc(): void {
    this.openModalInformation('', 'document');
  }

  close() {
    this.modalRef.hide();
  }

  openNewDocument(request?: IRequest) {
    let typeDoc = this.typeDoc;
    //console.log(this.typeDoc);

    let config: ModalOptions = {
      initialState: {
        request,
        typeDoc: typeDoc,
        callback: (next: boolean) => {
          if (next) this.getData();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(NewDocumentComponent, config);
  }

  private openModalInformation(info: any, typeInfo: string) {
    let config: ModalOptions = {
      initialState: {
        info,
        typeInfo,
        callback: (next: boolean) => {
          if (next) this.getData();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(SeeInformationComponent, config);
  }

  getRegDelegation(event: any) {}

  getState(event: any) {}

  getTransfe(event: any) {}

  setTypeColumn() {
    if (this.typeDoc === 'request-assets') {
      this.columns.noReq.title = 'No. Bien';
    } else {
      this.columns.noReq.title = 'No. Solicitud';
    }
  }

  setTitle(value: string) {
    switch (value) {
      case 'doc-request':
        this.title = 'Solicitudes';
        break;
      case 'doc-expedient':
        this.title = 'Expedientes';
        break;
      case 'request-expedient':
        this.title = '';
        break;
      default:
        break;
    }
  }
}
