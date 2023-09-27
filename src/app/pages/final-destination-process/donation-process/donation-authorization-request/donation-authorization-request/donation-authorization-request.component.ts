import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IProposel } from 'src/app/core/models/sirsae-model/proposel-model/proposel-model';
import { ProposelServiceService } from 'src/app/core/services/ms-proposel/proposel-service.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { FindProposeComponent } from '../find-propose/find-propose.component';
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
  requestId: number = 0;
  data: any = [];
  totalItems: number = 0;
  proposal: IProposel;
  params = new BehaviorSubject<ListParams>(new ListParams());
  bsModalRef?: BsModalRef;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private proposelServiceService: ProposelServiceService
  ) {
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
      proposal: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(20),
        ],
      ],
      classifNumbGood: [null, []],
      descripClassif: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(10)],
      ],
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

  proposeDefault: any = null;
  findPropose(propose?: string) {
    const regActual = this.proposeDefault;
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      propose,
      regActual,
    };

    let modalRef = this.modalService.show(FindProposeComponent, modalConfig);
    modalRef.content.onSave.subscribe(async (next: any) => {
      console.log(next);
      if (next) {
        this.alert(
          'success',
          'Se cargó la información de la Propuesta',
          next.ID_PROPUESTA
        );
      }
      this.form.reset();
      this.proposeDefault = next;
      // this.statusCanc = next.statusProceedings;
      // if (this.statusCanc == 'CERRADA') {
      //   //this.disabledBtnCerrar = false;
      //   this.disabledBtnActas = false;
      // } else {
      //   this.disabledBtnActas = true;
      //   //this.disabledBtnCerrar = true;
      // }
      // console.log('acta NEXT ', next);
      this.form.patchValue({
        proposal: next.ID_PROPUESTA,
      });

      // this.status = next.statusProceedings;
      // this.generarDatosDesdeUltimosCincoDigitos(next.keysProceedings);

      await this.getProposalId(this.proposeDefault.ID_PROPUESTA);
    });
    modalRef.content.cleanForm.subscribe(async (next: any) => {
      if (next) {
        this.cleanPropose();
      }
    });
  }
  cleanPropose() {
    this.form.reset();
    this.proposeDefault = null;
  }

  cleanForm() {
    this.form.reset();
  }
  getProposalId(params: ListParams) {
    this.proposelServiceService.getIdPropose(params).subscribe({
      next: data => {
        this.proposal = data;
        console.log(this.proposal);
      },
    });
  }
}
