import { Location } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequest } from 'src/app/core/models/catalogs/request.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { UsersSelectedToTurnComponent } from '../users-selected-to-turn/users-selected-to-turn.component';
import { IRequestInTurnSelected } from './../../../../core/models/catalogs/request-in-turn-selected.model';
//Provisional Data
import { ListParams } from '../../../../common/repository/interfaces/list-params';
import { IListResponse } from '../../../../core/interfaces/list-response.interface';
import { IAuthority } from '../../../../core/models/catalogs/authority.model';
import { IRegionalDelegation } from '../../../../core/models/catalogs/regional-delegation.model';
import { IStation } from '../../../../core/models/catalogs/station.model';
import { AuthorityService } from '../../../../core/services/catalogs/Authority.service';
import { RegionalDelegationService } from '../../../../core/services/catalogs/regional-delegation.service';
import { StationService } from '../../../../core/services/catalogs/station.service';
import { issuesData } from './data';

@Component({
  selector: 'app-create-request',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss'],
})
export class RequestFormComponent extends BasePage implements OnInit {
  @Input() op: number; // op con valor 1 = Recepción Manual, op con valor 2 = Documentación Complementaria
  @Input() edit: boolean = false;
  showSearchForm: boolean = true;
  bsValue = new Date();
  requestForm: ModelForm<IRequest>;
  typeTurn: String = '';
  bsModalRef: BsModalRef;
  checked: string = 'checked';

  selectRegionalDeleg = new DefaultSelect<any>();
  selectStation = new DefaultSelect<any>();
  selectEntity = new DefaultSelect<IRequest>();
  selectAuthority = new DefaultSelect<any>();
  selectTransfe = new DefaultSelect<IRequest>();
  selectState = new DefaultSelect<IRequest>();
  selectIssue = new DefaultSelect<IRequest>();

  issues = new DefaultSelect<any>();

  regionalDelegationService = inject(RegionalDelegationService);
  stationService = inject(StationService);
  authorityService = inject(AuthorityService);

  constructor(
    public fb: FormBuilder,
    public modalService: BsModalService,
    public location: Location
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getIssue();
    this.getRegionalDeleg(new ListParams());
    this.getStation(new ListParams());
    this.getAuthority(new ListParams());
  }

  prepareForm(): void {
    this.requestForm = this.fb.group({
      date: [{ value: null, disabled: true }],
      noOfi: [null, Validators.required],
      regDelega: [{ value: '', disabled: true }], // cargar la delegacion a la que pertence
      entity: [null],
      tranfe: [null],
      transmitter: [null],
      authority: [null],
      typeUser: ['all'],
      receiUser: [{ value: '', disabled: true }],
      issue: [null],
    });
    this.requestForm.controls['date'].patchValue(this.bsValue);
    //se agregan campos documentación complementaria según el valor del parametro OP
    if (this.op == 2) this.complementaryDocumentationField(this.requestForm);
  }

  complementaryDocumentationField(form: ModelForm<IRequest>) {
    // agregar nuevos campos al formulario para solicitudes de documentacion complementaria
    form.addControl('state', this.fb.control('', []));
    form.addControl('issue', this.fb.control('', []));
  }

  getRegionalDeleg(params?: ListParams) {
    this.regionalDelegationService
      .getAll(params)
      .subscribe((data: IListResponse<IRegionalDelegation>) => {
        console.log('reginal delegacion', data);
        this.selectRegionalDeleg = new DefaultSelect(data.data, data.count);
      });
  }

  getStation(params?: ListParams) {
    this.stationService
      .getAll(params)
      .subscribe((data: IListResponse<IStation>) => {
        console.log('emisora', data.data);
        this.selectStation = new DefaultSelect(data.data, data.count);
      });
  }

  getEntity(event: any): void {}

  getAuthority(params?: ListParams) {
    this.authorityService
      .getAll(params)
      .subscribe((data: IListResponse<IAuthority>) => {
        console.log('autoridad', data.data);
        this.selectAuthority = new DefaultSelect(data.data, data.count);
      });
  }

  getTransfe(event: any): void {}

  getState(event: any): void {}

  getIssue(event?: any): void {
    //Provisional data
    let data = issuesData;
    let count = data.length;
    this.issues = new DefaultSelect(data, count);
  }

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
    this.bsModalRef = this.modalService.show(
      UsersSelectedToTurnComponent,
      config
    );
    this.bsModalRef.content.event.subscribe((res: IRequestInTurnSelected) => {
      console.log(res);
      this.requestForm.get('receiUser').patchValue(res.user);
    });
  }

  close(): void {
    this.location.back();
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
