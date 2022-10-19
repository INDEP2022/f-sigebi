import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/ModelForm';
import { IRequest } from 'src/app/core/models/catalogs/request.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { NewDocumentComponent } from '../new-document/new-document.component';
import { DOC_REQUEST_TAB_COLUMNS } from './doc-request-tab-columns';

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
  styleUrls: ['doc-request-tab.component.scss'],
})
export class DocRequestTabComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() typeDoc = '';
  public selectDocType = new DefaultSelect<any>();
  public docRequestForm: ModelForm<any>;

  public params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: searchTable[] = [];
  columns = DOC_REQUEST_TAB_COLUMNS;

  filterTable: string = '';
  //totalItems: number = 0;

  public data: any[] = [
    {
      noDoc: 'SAE15545',
      noReq: '27448',
      docTit: 'Solicitud_27448',
      docType: 'SOLICITUD DE TRANSFERENCIA',
      author: 'ALEJANDRO',
      dateCrea: '10/10/2022',
    },
    {
      noDoc: 'SAE15335',
      noReq: '27328',
      docTit: 'Solicitud_27328',
      docType: 'SOLICITUD DE TRANSFERENCIA',
      author: 'ALEJANDRO',
      dateCrea: '01/10/2022',
    },
  ];

  constructor(public fb: FormBuilder, public modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
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
    console.log(changes['typeDoc'].currentValue);
    this.typeDoc =
      changes['typeDoc'].currentValue == 'request'
        ? 'Solicitudes'
        : 'Expediente';
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
    });
  }

  getData() {
    this.paragraphs = this.data;
  }

  getDocType(event: any) {}

  search(): void {}

  cleanForm(): void {}

  openDetail(): void {
    console.log('open detail');
  }

  openDoc(): void {
    console.log('open document');
  }

  openNewDocument(request?: IRequest) {
    let config: ModalOptions = {
      initialState: {
        request,
        callback: (next: boolean) => {
          if (next) this.getData();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(NewDocumentComponent, config);
  }
}
