import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequest } from 'src/app/core/models/catalogs/request.model';
import { DocumentRequest } from 'src/app/core/models/ms-wcontent/document.model';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-see-information',
  templateUrl: './see-information.component.html',
  styleUrls: ['./see-information.component.scss'],
})
export class SeeInformationComponent extends BasePage implements OnInit {
  title: string = 'Información del Documento';
  infoForm: ModelForm<IRequest>;
  data: DocumentRequest;
  typeInfo: string = '';
  nameRegDelegation: string = '';
  nameTrans: string = '';
  nameState: string;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private regDelService: RegionalDelegationService,
    private transferentService: TransferenteService,
    private stateService: StateOfRepublicService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    console.log('data', this.data);
    console.log(this.typeInfo);
    this.getRegionalDelegation();
    this.getTransferent();
    this.getState();
  }

  getRegionalDelegation() {
    this.regDelService
      .getById(this.data.xdelegacionRegional)
      .subscribe(info => {
        this.nameRegDelegation = info.description;
      });
  }

  getTransferent() {
    this.transferentService
      .getById(this.data.xidTransferente)
      .subscribe(info => {
        console.log('transferente', info);
        this.nameTrans = info.nameTransferent;
      });
  }

  getState() {
    this.stateService.getById(this.data.xestado).subscribe(info => {
      console.log('estado', info);
      this.nameState = info.descCondition;
    });
  }

  initForm(): void {
    this.infoForm = this.fb.group({
      docType: [],
      author: [null],
      noReq: [null],
      noGood: [null],
      regDelega: [null],
      state: [null],
      transfe: [null],
      typeTransfer: [null],
      sender: [null],
      roleSender: [null],
      responsible: [null],
      contributor: [null],
      date: [null],
      noOfi: [null],
      observations: [null],
    });
  }

  close(): void {
    this.modalRef.hide();
  }
}
