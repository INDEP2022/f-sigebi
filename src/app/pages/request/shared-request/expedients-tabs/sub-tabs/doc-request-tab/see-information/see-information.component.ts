import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequest } from 'src/app/core/models/catalogs/request.model';
import { DocumentRequest } from 'src/app/core/models/ms-wcontent/document.model';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
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
  typeDocument: string = '';
  paramsDocTypes = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private regDelService: RegionalDelegationService,
    private transferentService: TransferenteService,
    private stateService: StateOfRepublicService,
    private wContentService: WContentService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.getRegionalDelegation();
    this.getTransferent();
    this.getState();
  }

  getRegionalDelegation() {
    this.regDelService.getById(this.data.xdelegacionRegional).subscribe({
      next: info => {
        this.nameRegDelegation = info?.description;
      },
      error: error => {},
    });
  }

  getTransferent() {
    this.transferentService
      .getById(this.data.xidTransferente)
      .subscribe(info => {
        this.nameTrans = info.nameTransferent;
      });
  }

  getState() {
    this.stateService.getById(this.data.xestado).subscribe(info => {
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
