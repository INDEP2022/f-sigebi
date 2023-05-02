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
import { SERVICE_ORDERS_COLUMNS } from '../list-service-orders/columns/service-orders-columns';
import { NewDocumentServiceOrdersFormComponent } from '../new-document-service-orders-form/new-document-service-orders-form.component';

@Component({
  selector: 'app-upload-expedient-service-order',
  templateUrl: './upload-expedient-service-order.component.html',
  styles: [],
})
export class UploadExpedientServiceOrderComponent
  extends BasePage
  implements OnInit
{
  showSearchForm: boolean = false;
  expedientForm: ModelForm<any>;
  typeDocSelected = new DefaultSelect();

  paragraphs: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  columns = SERVICE_ORDERS_COLUMNS;

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
      selectMode: '',
      columns: SERVICE_ORDERS_COLUMNS,
    };

    this.columns.button = {
      ...this.columns.button,
      onComponentInitFunction: (instance?: any) => {
        instance.btnclick1.subscribe((data: any) => {
          console.log(data);
          this.openDetail(data);
        }),
          instance.btnclick2.subscribe((data: any) => {
            this.openDoc(data);
          });
      },
    };
    this.initForm();
  }

  initForm(): void {
    this.expedientForm = this.fb.group({
      text: [null, [Validators.pattern(STRING_PATTERN)]],
      typeDoc: [null],
      titleDoc: [null, [Validators.pattern(STRING_PATTERN)]],
      noAsset: [null],
      contributor: [null, [Validators.pattern(STRING_PATTERN)]],
      author: [null, [Validators.pattern(STRING_PATTERN)]],
      noSiab: [null],
      noOfice: [null],
      noDoc: [null],
      typeTranfer: [null, [Validators.pattern(STRING_PATTERN)]],
      version: [null],
      sender: [null, [Validators.pattern(STRING_PATTERN)]],
      senderCharge: [null, [Validators.pattern(STRING_PATTERN)]],
      noExpedient: [null],
      noRequest: [null],
      responsible: [null, [Validators.pattern(STRING_PATTERN)]],
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
    this.modalService.show(NewDocumentServiceOrdersFormComponent, config);
  }

  openDetail(data: any) {
    console.log(data);
  }

  openDoc(data: any) {
    console.log(data);
  }

  close() {
    this.modalRef.hide();
  }
}
