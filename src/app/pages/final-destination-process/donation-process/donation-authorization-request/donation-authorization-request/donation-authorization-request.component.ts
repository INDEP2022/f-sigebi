import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ModalViewComponent } from '../modal-view/modal-view.component';
import { ListParams } from './../../../../../common/repository/interfaces/list-params';
import { COLUMNS_GOODS } from './columns-goods';
import { DISTRIBUTION_COLUMNS } from './distribution-columns';
import { REQUEST_COLUMNS } from './request-columns';

@Component({
  selector: 'app-donation-authorization-request',
  templateUrl: './donation-authorization-request.component.html',
  styles: [],
})
export class DonationAuthorizationRequestComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  formTable1: FormGroup;
  formTable2: FormGroup;
  formTable3: FormGroup;
  settings2: any;
  settings3: any;
  data: any = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  bsModalRef?: BsModalRef;

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = REQUEST_COLUMNS;
    this.settings2 = { ...this.settings, actions: false };
    this.settings2.columns = DISTRIBUTION_COLUMNS;
    this.settings3 = { ...this.settings, actions: false };
    this.settings3.columns = COLUMNS_GOODS;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      proposal: [null, [Validators.pattern(STRING_PATTERN)]],
      classifNumbGood: [null, []],
      descripClassif: [null, [Validators.pattern(STRING_PATTERN)]],
    });

    this.formTable1 = this.fb.group({
      totals: [null, []],
    });

    this.formTable2 = this.fb.group({
      quantityToAssign: [null, []],
    });

    this.formTable3 = this.fb.group({
      quantityToAssign: [null, []],
    });
  }

  onSubmit() {}

  settingsChange(event: any) {
    this.settings = event;
  }

  openModal(op: number) {
    const initialState: ModalOptions = {
      initialState: {
        op,
      },
    };
    this.bsModalRef = this.modalService.show(ModalViewComponent, initialState);
    this.bsModalRef.setClass('modal-lg');
    this.bsModalRef.content.closeBtnName = 'Close';
  }
}
