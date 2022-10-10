import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
  templateUrl: './create-request.component.html',
  styles: [],
})
export class CreateRequestComponent extends BasePage implements OnInit {
  requestForm: ModelForm<IRequest>;
  title: string = 'SOLICITUD';
  edit: boolean = false;
  typeTurn: String = '';
  bsModalRef: BsModalRef;

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
      noOfi: [null],
      regDelega: [{ value: '', disabled: true }], // cargar la delegacion a la que pertence
      entity: [null],
      tranfe: [null],
      transmitter: [null],
      authority: [null],
      typeUser: [null],
      receiUser: [{ value: '', disabled: true }],
    });
  }

  getRegionalDeleg(event: any): void {}

  getTransmitter(event: any): void {}

  getEntity(event: any): void {}

  getAuthority(event: any): void {}

  getTransfe(event: any): void {}

  openModalSelectUser() {
    if (this.typeTurn != '') {
      let config: ModalOptions = {
        initialState: {
          typeTurn: this.typeTurn,
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
  }

  confirm(): void {
    this.question();
  }

  question(){
    this.alertQuestion(
      'info',
      'Confirmacion',
      'Desea crear el registro de solicitud?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }
}
