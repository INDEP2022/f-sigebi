import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { PrintFlyersService } from 'src/app/core/services/document-reception/print-flyers.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-destination-acts-delegation',
  templateUrl: './destination-acts-delegation.component.html',
  styles: [],
})
export class DestinationActsDelegationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  bsModalRef?: BsModalRef;
  refresh: boolean = false;
  good: IGood;
  delegations = new DefaultSelect<IDelegation>();
  subdelegations = new DefaultSelect<ISubdelegation>();
  phaseEdo: number;

  get delegation() {
    return this.form.get('delegationNumber');
  }
  get subdelegation() {
    return this.form.get('subDelegation');
  }

  constructor(
    private fb: FormBuilder,
    private service: DelegationService,
    private modalRef: BsModalRef,
    private goodService: GoodService,
    private siabService: SiabService,
    private serviceDeleg: DelegationService,
    private printFlyersService: PrintFlyersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  onSubmit() {}

  prepareForm() {
    this.form = this.fb.group({
      delegationNumber: [null, Validators.required],
      subDelegation: [null, Validators.required],
    });
    this.form.patchValue(this.good);
  }
  close() {
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  update() {
    console.log('Subdelegation Form->', this.form.get('subDelegation'));
    const good: IGood = {};
    console.log(this.form.value);
    const { subDelegationNumber, delegationNumber } = this.form.value;
    console.error(subDelegationNumber);
    console.log('1er clg ->', subDelegationNumber);
    let sub = this.form.get('subDelegation').value;
    console.log('sub', sub);
    if (subDelegationNumber == 0) {
      this.alert(
        'error',
        'Actas de Destino de Bienes',
        'Subdelegación es un Campo Requerido'
      );
      return;
    }
    good.subDelegationNumber = subDelegationNumber;
    good.delegationNumber = delegationNumber;
    good.id = this.good.id;
    good.goodId = this.good.goodId;
    console.log(good);
    this.goodService.update(good).subscribe({
      next: res => {
        this.alert(
          'success',
          'Actas de Destino de Bienes',
          'Se ha Actualizado el Registro Correctamente'
        );
        this.close();
      },
      error: err => {
        this.alert(
          'error',
          'Actas de Destino de Bienes',
          'Ha ocurrido un error al actualizar el registro'
        );
      },
    });
  }

  onDelegationsChange(event: any) {}

  getDelegations(params: ListParams) {
    this.serviceDeleg.getAll(params).subscribe(
      data => {
        this.delegations = new DefaultSelect(data.data, data.count);
      },
      err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
      () => {}
    );
  }

  getSubDelegations(lparams: ListParams) {
    // console.log(lparams);
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('dsarea', lparams.text, SearchFilter.LIKE);
    if (this.delegation.value) {
      params.addFilter('delegationNumber', this.delegation.value);
    }
    if (this.phaseEdo) params.addFilter('phaseEdo', this.phaseEdo);
    console.log('params ', params.getParams());
    this.printFlyersService.getSubdelegations(params.getParams()).subscribe({
      next: data => {
        this.subdelegations = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }

        this.onLoadToast('error', 'Error', error);
      },
    });
  }

  onSubDelegationsChange(element: any) {
    this.resetFields([this.subdelegation]);
  }
  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
