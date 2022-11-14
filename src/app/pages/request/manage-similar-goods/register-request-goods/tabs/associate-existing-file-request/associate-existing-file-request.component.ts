import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalNewCoverComponent } from './../modal-new-cover/modal-new-cover.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-associate-existing-file-request',
  templateUrl: './associate-existing-file-request.component.html',
  styles: [],
})
export class AssociateExistingFileRequestComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  data: any;
  totalItems: number = 0;
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

  msgAvertanceModal(
    btnTitle: string,
    message: string,
    title: string,
    typeMsg: any
  ) {
    this.alertQuestion(typeMsg, title, message, btnTitle).then(question => {
      if (question.isConfirmed) {
        //Ejecutar acción
      }
    });
  }

  openModal() {
    const initialState: ModalOptions = {
      initialState: {
        title: 'Histórico de Estatus',
        optionColumn: 'status-history',
      },
    };
    this.bsModalRef = this.modalService.show(
      ModalNewCoverComponent,
      initialState
    );
    this.bsModalRef.setClass('modal-lg');
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  confirm() {
    this.msgAvertanceModal(
      'Aceptar',
      'La solicitud ha sido asociada al expediente No. ',
      'Información',
      ''
    );
  }

  initForm() {
    this.form = this.fb.group({
      requestNumb: [null, Validators.required],
      proceedingsNumb: [null, [Validators.required]],
      regionalDelega: [null, [Validators.required]],
      state: [null, [Validators.required]],
      transf: [null, [Validators.required]],
      transmitter: [null, [Validators.required]],
      authority: [null, [Validators.required]],
      taxpayer: [null, Validators.required],
      proceedingsTransf: [null, Validators.required],
      ascertainmentPreliminary: [null, Validators.required],
      penalCause: [null, [Validators.required]],
      protectionNumb: [null, Validators.required],
      transfType: [null, Validators.required],
      extinction: [null, Validators.required],
      judgmentType: [null, Validators.required],
      judgment: [null, Validators.required],
    });
  }

  onSubmit() {}
}
