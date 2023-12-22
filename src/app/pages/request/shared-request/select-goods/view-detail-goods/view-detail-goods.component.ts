import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequest } from 'src/app/core/models/catalogs/request.model';
import { ExpedientRequest } from 'src/app/core/models/ms-wcontent/expedient.model';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { isNullOrEmpty } from '../../../request-complementary-documentation/request-comp-doc-tasks/request-comp-doc-tasks.component';

@Component({
  selector: 'app-view-detail-goods',
  templateUrl: './view-detail-goods.component.html',
  styles: [],
})
export class ViewDetailGoodsComponent extends BasePage implements OnInit {
  title: string = 'Información del Expediente';
  infoForm: ModelForm<IRequest>;
  data: ExpedientRequest;
  typeInfo: string = '';
  nameRegDelegation: string = '';
  nameTrans: string = '';
  receiver: string = '';
  nameState: string;
  typeDocument: string = '';
  paramsDocTypes = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private regDelService: RegionalDelegationService,
    private transferentService: TransferenteService,
    private stateService: StateOfRepublicService,
    private userService: UsersService,
    private wContentService: WContentService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.getRegionalDelegation();
    this.getTransferent();
  }

  getRegionalDelegation() {
    if (isNullOrEmpty(this.data.regionalDelegationId)) {
      this.nameRegDelegation = '';
    } else {
      this.regDelService.getById(this.data.regionalDelegationId).subscribe({
        next: info => {
          this.nameRegDelegation = info?.description;
        },
        error: error => {},
      });
    }
  }

  getTransferent() {
    if (isNullOrEmpty(this.data.transferenceId)) {
      this.nameTrans = '';
    } else {
      this.transferentService
        .getById(this.data.transferenceId)
        .subscribe(info => {
          this.nameTrans = info.nameTransferent;
        });
    }
  }

  getState() {
    this.stateService.getById(this.data.stateRequestId).subscribe(info => {
      this.nameState = info.descCondition;
    });
  }

  getRecipt() {
    this.userService.getUserOt(this.data.targetUser).subscribe(info => {
      this.receiver = info.name;
    });
  }

  initForm(): void {
    this.infoForm = this.fb.group({
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
    });
  }

  close(): void {
    this.modalRef.hide();
  }
}
