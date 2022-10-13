import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ModelForm } from 'src/app/core/interfaces/ModelForm';
import { IRequestInTurnSelected } from 'src/app/core/models/catalogs/request-in-turn-selected.model';
import { IRequest } from 'src/app/core/models/catalogs/request.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { UsersSelectedToTurnComponent } from '../users-selected-to-turn/users-selected-to-turn.component';

@Component({
  selector: 'app-create-request',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss'],
})
export class RequestFormComponent extends BasePage implements OnInit {
  requestForm: ModelForm<IRequest>;
  title: string = 'SOLICITUD';
  edit: boolean = false;
  typeTurn: String = '';
  bsModalRef: BsModalRef;
  checked: string = 'checked';

  selectRegionalDeleg = new DefaultSelect<IRequest>();
  selectTransmitter = new DefaultSelect<IRequest>();
  selectEntity = new DefaultSelect<IRequest>();
  selectAuthority = new DefaultSelect<IRequest>();
  selectTransfe = new DefaultSelect<IRequest>();

  constructor(public fb: FormBuilder, public modalServise: BsModalService) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm(): void {
    this.requestForm = this.fb.group({
      date: [null],
      noOfi: [null, Validators.required],
      regDelega: [{ value: '', disabled: true }], // cargar la delegacion a la que pertence
      entity: [null],
      tranfe: [null],
      transmitter: [null],
      authority: [null],
      typeUser: ['all'],
      receiUser: [{ value: '', disabled: true }],
    });
  }

  getRegionalDeleg(event: any): void {}

  getTransmitter(event: any): void {}

  getEntity(event: any): void {}

  getAuthority(event: any): void {}

  getTransfe(event: any): void {}

  openModalSelectUser() {
    let config: ModalOptions = {
      initialState: {
        typeTurn: this.requestForm.get('typeUser').value,
        callback: (next: boolean) => {
          //if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalServise.show(
      UsersSelectedToTurnComponent,
      config
    );

    this.bsModalRef.content.event.subscribe((res: IRequestInTurnSelected) => {
      console.log(res);
      this.requestForm.get('receiUser').patchValue(res.user);
    });
  }

  close(): void {
    this.modalServise.hide();
  }

  confirm(): void {
    console.log(this.requestForm);
    this.msgModal(
      'Turnar',
      'Desea turnar la solicitud con el Folio '
        .concat('53009')
        .concat(' al usuario Ramiro'),
      'Confirmacion',
      'info'
    );
  }

  msgModal(btnTitle: string, message: string, title: string, typeMsg: any) {
    this.alertQuestion(typeMsg, title, message, btnTitle).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }
}
