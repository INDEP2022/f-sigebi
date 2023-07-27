import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import {
  IComiXThird,
  IThirdParty,
} from 'src/app/core/models/ms-thirdparty/third-party.model';
import { ComiXThirdService } from 'src/app/core/services/ms-thirdparty/comi-xthird.service';
import { ThirdPartyService } from 'src/app/core/services/ms-thirdparty/thirdparty.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_POINT_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-amount-third-modal',
  templateUrl: './amount-third-modal.component.html',
  styles: [],
})
export class AmountThirdModalComponent extends BasePage implements OnInit {
  title: string = 'Monto';
  edit: boolean = false;

  amountForm: ModelForm<IComiXThird>;
  amounts: IComiXThird;
  thirdParty: IThirdParty;
  thirdPartySelect = new DefaultSelect();
  thirPartys: IThirdParty;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private comiXThirdService: ComiXThirdService,
    private thirdPartyService: ThirdPartyService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(this.thirPartys);
    this.prepareForm();
  }

  private prepareForm() {
    this.amountForm = this.fb.group({
      idComiXThird: [null],
      idThirdParty: [null, [Validators.required]],
      startingAmount: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_POINT_PATTERN),
          Validators.maxLength(10),
        ],
      ],
      pctCommission: [null, [Validators.required, Validators.maxLength(5)]],
      finalAmount: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_POINT_PATTERN),
          Validators.maxLength(10),
        ],
      ],
    });
    if (this.amounts != null) {
      this.thirdParty = this.amounts.idThirdParty as unknown as IThirdParty;
      this.edit = true;
      this.amountForm.patchValue({
        idComiXThird: this.amounts.idComiXThird,
        idThirdParty: this.amounts.idThirdParty,
        startingAmount: this.amounts.startingAmount
          ? Number(this.amounts.startingAmount)
          : null,
        pctCommission: this.amounts.pctCommission
          ? Number(this.amounts.pctCommission)
          : null,
        finalAmount: this.amounts.finalAmount
          ? Number(this.amounts.finalAmount)
          : null,
      });
      this.amountForm.controls['idThirdParty'].setValue(this.thirdParty.id);
      if (this.thirPartys != null) {
        this.amountForm.patchValue({
          idThirdParty: this.thirPartys.id,
        });
      }
    } else {
      if (this.thirPartys != null) {
        this.amountForm.patchValue({
          idThirdParty: this.thirPartys.id,
        });
      }
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  update() {
    this.loading = true;
    this.comiXThirdService
      .update(this.amounts.idComiXThird, this.amountForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => this.handleError(),
      });
  }

  create() {
    this.loading = true;
    let startingAmount = this.amountForm.value.startingAmount
      .toString()
      .padStart(10, '0');
    if (startingAmount.length > 10) {
      startingAmount = startingAmount.toString().slice(0, 10);
      this.amountForm.value.startingAmount = Number(startingAmount);
    }

    let finalAmount = this.amountForm.value.finalAmount
      .toString()
      .padStart(10, '0');
    if (finalAmount.length > 10) {
      finalAmount = finalAmount.toString().slice(0, 10);
      this.amountForm.value.finalAmount = Number(finalAmount);
    }

    let pctCommission = this.amountForm.value.pctCommission
      .toString()
      .padStart(5, '0');
    if (pctCommission.length > 5) {
      pctCommission = pctCommission.toString().slice(0, 5);
      this.amountForm.value.pctCommission = Number(pctCommission);
    }
    this.comiXThirdService.create(this.amountForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => this.handleError(),
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', `Monto ${message} Correctamente`, '');
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  handleError() {
    const message: string = this.edit ? 'Actualizar' : 'Guardar';
    this.alert('error', `Error al Intentar ${message} el Monto`, '');
  }

  getThirdPartyAll(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text) params.addFilter('id', lparams.text, SearchFilter.EQ);

    this.thirdPartyService.getAll(params.getParams()).subscribe({
      next: response => {
        console.log(response);
        this.thirdPartySelect = new DefaultSelect(
          response.data,
          response.count
        );
        this.loading = false;
      },
      error: error => {
        this.thirdPartySelect = new DefaultSelect();
        this.loading = false;
        console.log(error);
      },
    });
  }
}
