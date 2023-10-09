import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { IRequest } from 'src/app/core/models/sirsae-model/proposel-model/proposel-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { ProposelServiceService } from 'src/app/core/services/ms-proposel/proposel-service.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DonationProcessService } from '../../../shared-final-destination/view-donation-contracts/donation-process.service';
@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styles: [],
})
export class CreateRequestComponent extends BasePage implements OnInit {
  form: FormGroup;
  request: IRequest;
  disabledSend: boolean = false;
  arrayDele: any[] = [];
  delegationData = new DefaultSelect();
  changeDescription: string;
  @Output() onSave = new EventEmitter<any>();
  get pathClasification() {
    return 'catalog/api/v1/good-sssubtype?sortBy=numClasifGoods:ASC';
  }
  get classificationOfGoods() {
    return this.form.get('classificationOfGoods');
  }
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usersService: UsersService,
    private donationProcessService: DonationProcessService,
    private modalRef: BsModalRef,
    private delegationService: DelegationService,
    private proposelServiceService: ProposelServiceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  async prepareForm() {
    this.form = this.fb.group({
      quantity: [null, Validators.required],
      requestId: [null, Validators.required],
      entFedKey: [null, Validators.required],
      requestDate: [null, Validators.required],
      clasifGood: [null, Validators.required],
      justification: [null, [Validators.required]],
      sunStatus: [null, [Validators.required]],
      proposalCve: [null],
      requestTypeId: [null, [Validators.required]],
    });

    this.form.patchValue({
      requestDate: await this.getDate(),
    });
  }
  onChange(event: IGoodSssubtype) {
    console.log(event);
    this.changeDescription = event ? event.description : null;
  }
  async getDate() {
    const fechaEscritura: any = new Date();
    fechaEscritura.setUTCDate(fechaEscritura.getUTCDate());
    const _fechaEscritura: any = new Date(fechaEscritura.toISOString());
    return _fechaEscritura;
  }
  // delegationToolbar: any = null;
  // getDelegation(params: FilterParams) {
  //   params.addFilter(
  //     'id',
  //     this.authService.decodeToken().preferred_username,
  //     SearchFilter.EQ
  //   );
  //   return this.usersService.getAllSegUsers(params.getParams()).subscribe({
  //     next: (value: any) => {
  //       const data = value.data[0].usuario;
  //       if (data) this.delegationToolbar = data.delegationNumber;

  //       console.log('SI', value);
  //     },
  //     error(err) {
  //       console.log('NO');
  //     },
  //   });
  // }
  async getDelegations(paramsData: ListParams) {
    const params = new FilterParams();
    params.removeAllFilters();
    params['sortBy'] = 'description:ASC';
    let subscription = this.delegationService
      .getAllFiltered(paramsData)
      .subscribe({
        next: data => {
          console.log(data);
          this.delegationData = new DefaultSelect(
            data.data.map(i => {
              i.description = '#' + i.id + ' -- ' + i.description;
              return i;
            }),
            data.count
          );
          subscription.unsubscribe();
        },
        error: error => {
          this.delegationData = new DefaultSelect();
          console.log(error);
          subscription.unsubscribe();
        },
      });
  }
  agregarRequst() {
    const o = localStorage.getItem('proposalId');
    if (o) {
      const params = new ListParams();
      params['filter.requestTypeId'] = `$eq:${o}`;
      this.proposelServiceService.getAll(params).subscribe({
        next: (data: any) => {
          if (data.data.length == 1) {
            this.alert('warning', 'Esa sol ya se tiene registrada', '');
          } else {
            this.alert(
              'warning',
              'Actas duplicadas en ACTAS ENTREGA RECEPCION',
              ''
            );
          }
          return;
        },
        error: error => {
          this.guardarRegistro(o);
        },
      });
    }
  }
  newRegister: any;
  guardarRegistro(cve: any) {
    const r = localStorage.getItem('request');
    let obj: any = {
      solQuantity: this.form.value.quantity,
      requestId: r,
      entFedKey: this.form.value.entFedKey,
      requestDate: this.form.value.requestDate,
      clasifGood: this.form.value.clasifGood,
      justification: this.form.value.justification,
      sunStatus: this.form.value.sunStatus,
      proposalCve: cve,
      requestTypeId: this.form.value.requestTypeId,
    };
    this.donationProcessService.createRequest(obj).subscribe({
      next: (data: any) => {
        console.log('DATA', data);
        this.newRegister = data;
        this.alert('success', 'La solicitud se ha creado correctamente', '');
        this.handleSuccess();
      },
      error: error => {
        this.alert(
          'error',
          'Ha ocurrido un error al intentar crear la solicitud',
          ''
        );
      },
    });
  }

  handleSuccess(): void {
    this.onSave.emit(this.newRegister);
    this.modalRef.hide();
  }
  return() {
    this.modalRef.hide();
  }
}
