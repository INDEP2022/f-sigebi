import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
import { ListParams } from './../../../../common/repository/interfaces/list-params';
import { COLUMNS } from './columns';
import { ModalComponentComponent } from './modal-component/modal-component.component';

@Component({
  selector: 'app-check-documentary-requirements',
  templateUrl: './check-documentary-requirements.component.html',
  styles: [],
})
export class CheckDocumentaryRequirementsComponent
  extends BasePage
  implements OnInit
{
  @Input() title: string;
  form: FormGroup;
  totalItems: number = 0;
  data: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  bsModalRef?: BsModalRef;

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      proceedings: [null, [Validators.required]],
      causePenal: [null, [Validators.required]],
      preliminaryAscertainment: [null, [Validators.required]],
      destructDate: [null, [Validators.required]],
      goodNumb: [null, [Validators.required]],
      goodDescrip: [null, [Validators.required]],
      status: [null, [Validators.required]],
      statusDescrip: [null, [Validators.required]],
      rulingStatus: [null, [Validators.required]],
      observations: [null, [Validators.required]],
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
    this.bsModalRef = this.modalService.show(
      ModalComponentComponent,
      initialState
    );
    this.bsModalRef.content.closeBtnName = 'Close';
  }
}
