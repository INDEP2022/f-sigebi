import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { TABLE_SETTINGS } from '../../../../../common/constants/table-settings';
import { ListParams } from '../../../../../common/repository/interfaces/list-params';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { BasePage } from '../../../../../core/shared/base-page';
import { DefaultSelect } from '../../../../../shared/components/select/default-select';
//import { NewDocumentServiceOrderFormComponent } from '../new-document-form/new-document-form.component';
import { NewDocumentServiceOrderFormComponent } from '../new-document-service-order-form/new-document-service-order-form.component';
import { LIST_EXPEDIENTS_COLUMN } from './columns/list-expedients-columns';

var data = [
  {
    id: 1,
    noDoc: '34343',
    noRequest: '145',
    titleDocument: 'DOCUMENTO DE TRASPASO DE DATOS',
    typeDocument: 'ACLARACIÓN DE DOCUMENTO',
    author: 'ENRIQUE SEGOBIANO',
    date: '12/12/2022',
    version: '1',
  },
];

@Component({
  selector: 'app-upload-expedient-service-order-form',
  templateUrl: './upload-expedient-service-order-form.component.html',
  styleUrls: ['./upload-expedient-service-order-form.component.scss'],
})
export class UploadExpedientServiceOrderFormComponent
  extends BasePage
  implements OnInit
{
  showSearchForm: boolean = false;
  expedientForm: ModelForm<any>;
  typeDocSelected = new DefaultSelect();

  paragraphs: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  columns = LIST_EXPEDIENTS_COLUMN;

  data: any[] = [];
  typeComponent: string = '';

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: LIST_EXPEDIENTS_COLUMN,
    };

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
    this.initForm();
    this.paragraphs = data;
  }

  initForm(): void {
    this.expedientForm = this.fb.group({
      text: [null, [Validators.pattern(STRING_PATTERN)]],
      typeDoc: [null],
      titleDoc: [null, [Validators.pattern(STRING_PATTERN)]],
      sender: [null, [Validators.pattern(STRING_PATTERN)]],
      author: [null, [Validators.pattern(STRING_PATTERN)]],
      senderInCharge: [null, [Validators.pattern(STRING_PATTERN)]],
      noDoc: [null],
      responsible: [null, [Validators.pattern(STRING_PATTERN)]],
      version: [null],
      contributor: [null, [Validators.pattern(STRING_PATTERN)]],
      noRequest: [null],
      noOfice: [null],
      typeTranfer: [null, [Validators.pattern(STRING_PATTERN)]],
      comments: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  getTypeDocSelect(event: any) {}

  newDocument() {
    let config: ModalOptions = {
      initialState: {
        data: '',
        typeComponent: this.typeComponent,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(NewDocumentServiceOrderFormComponent, config);
  }

  openDetail() {}

  openDoc() {}

  close() {
    this.modalRef.hide();
  }
}
