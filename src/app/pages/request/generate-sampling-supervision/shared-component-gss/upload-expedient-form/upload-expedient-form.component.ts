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
import { NewDocumentFormComponent } from '../new-document-form/new-document-form.component';
import { LIST_EXPEDIENTS_COLUMN } from './columns/list-expedients-columns';

var data = [
  {
    id: 1,
    noDoc: '34343',
    noAsset: 'rerere',
    titleDocument: 'DOCUMENTO DE TRASPASO DE DATOS',
    typeDocument: 'ACLARACIÓN DE DOCUMENTO',
    author: 'ENRIQUE SEGOBIANO',
    date: '12/12/2022',
    version: '1',
  },
];

@Component({
  selector: 'app-upload-expedient-service-order-form',
  templateUrl: './upload-expedient-form.component.html',
  styleUrls: ['./upload-expedient-form.component.scss'],
})
export class UploadExpedientFormComponent extends BasePage implements OnInit {
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
      typeTranfer: [null, [Validators.pattern(STRING_PATTERN)]],
      comments: [null, [Validators.pattern(STRING_PATTERN)]],
      author: [null, [Validators.pattern(STRING_PATTERN)]],
      sender: [null, [Validators.pattern(STRING_PATTERN)]],
      noDoc: [null],
      senderCharge: [null, [Validators.pattern(STRING_PATTERN)]],
      version: [null],
      responsible: [null, [Validators.pattern(STRING_PATTERN)]],
      noAsset: [{ value: null, disabled: true }],
      contributor: [null, [Validators.pattern(STRING_PATTERN)]],
      noSab: [null],
      noOfice: [null],
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
    this.modalService.show(NewDocumentFormComponent, config);
  }

  openDetail() {}

  openDoc() {}

  close() {
    this.modalRef.hide();
  }
}
