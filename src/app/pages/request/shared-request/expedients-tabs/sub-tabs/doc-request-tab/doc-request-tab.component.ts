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
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
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
  @Input() displayName: string = '';
  title: string = '';
  showSearchForm: boolean = false;
  selectDocType = new DefaultSelect<any>();
  docRequestForm: ModelForm<any>;
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];
  columns = DOC_REQUEST_TAB_COLUMNS;
  parameter: any;
  type: string = '';
  selectRegDelegation = new DefaultSelect<any>();
  selectState = new DefaultSelect<any>();
  selectTransfe = new DefaultSelect<any>();
  idRequest: number = 0;

  constructor(
    public fb: FormBuilder,
    public modalService: BsModalService,
    private modalRef: BsModalRef,
    private activatedRoute: ActivatedRoute,
    private wContentService: WContentService
  ) {
    super();
    this.idRequest = this.activatedRoute.snapshot.paramMap.get(
      'id'
    ) as unknown as number;
  }

  ngOnInit(): void {
    console.log(this.typeDoc);
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
          console.log(data.dDocName);
          this.openDetail(data.dDocName);
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
      text: [null, [Validators.pattern(STRING_PATTERN)]],
      docType: [null],
      docTitle: [null, [Validators.pattern(STRING_PATTERN)]],
      typeTrasf: [null, [Validators.pattern(STRING_PATTERN)]],
      contributor: [null, [Validators.pattern(STRING_PATTERN)]],
      author: [null, [Validators.pattern(STRING_PATTERN)]],
      sender: [null, [Validators.pattern(STRING_PATTERN)]],
      noOfice: [null],
      senderCharge: [null, [Validators.pattern(STRING_PATTERN)]],
      comment: [null, [Validators.pattern(STRING_PATTERN)]],
      noRequest: [{ value: 157, disabled: true }],
      responsible: [null, [Validators.pattern(STRING_PATTERN)]],

      /* Solicitud Transferencia */
      regDelega: [null],
      state: [null],
      tranfe: [null],
    });
  }

  getData() {
    const body = {
      xidSolicitud: this.idRequest,
    };
    console.log('solicitud', body);
    this.wContentService.getDocumentos(body).subscribe(data => {
      console.log('doc sol', data);
      this.paragraphs = data.data;
    });
  }

  getDocType(event: any) {}

  search(): void {}

  cleanForm(): void {
    this.docRequestForm.reset();
  }

  openDetail(documentName: string): void {
    this.openModalInformation(documentName, 'detail');
  }

  openDoc(): void {
    this.openModalInformation('', 'document');
  }

  close() {
    this.modalRef.hide();
  }

  openNewDocument() {
    const idrequest = this.idRequest;
    let typeDoc = this.typeDoc;
    //console.log(this.typeDoc);

    let config: ModalOptions = {
      initialState: {
        idrequest,
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
    /*if (this.displayName === 'validateEyeVisitResult') {
      this.columns.noReq.title = 'No. Expediente';
    } else {
      if (this.typeDoc === 'request-assets') {
        this.columns.noReq.title = 'No. Bien';
      } else {
        this.columns.noReq.title = 'No. Solicitud';
      }
    } */
  }

  showDocument() {}

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
