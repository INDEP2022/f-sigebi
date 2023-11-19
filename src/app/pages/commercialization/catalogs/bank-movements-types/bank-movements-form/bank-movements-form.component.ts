import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IBankMovementsTypes } from 'src/app/core/models/catalogs/bank-movements-types.models';
import { RecordAccountStatementsService } from 'src/app/core/services/catalogs/record-account-statements.service';
import { BankMovementType } from 'src/app/core/services/ms-bank-movement/bank-movement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-bank-movements-form',
  templateUrl: './bank-movements-form.component.html',
  styles: [],
})
export class BankMovementsFormComponent extends BasePage implements OnInit {
  title: string = 'movimiento';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  bankMovementsTypes: IBankMovementsTypes;
  bankMovementsId: string | number;

  bankAccountSelect = new DefaultSelect();
  banks = new DefaultSelect();
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private bankMovementTypeService: BankMovementType,
    private recordAccountStatementsService: RecordAccountStatementsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.searchBanks(new ListParams());
  }

  prepareForm() {
    this.form = this.fb.group({
      id: [null, [Validators.required]],
      accountKey: [null],
      bankKey: [null, [Validators.required]],
      coinKey: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      branchOffice: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      rateCalculationInterest: [null],
      registryNumber: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      accountType: [null, [Validators.required]],
      square: [null, [Validators.pattern(STRING_PATTERN)]],
    });

    if (this.bankMovementsTypes) {
      this.edit = true;
      this.form.patchValue(this.bankMovementsTypes);
    }

    this.form.get('id').valueChanges.subscribe(value => {
      this.form.get('accountKey').setValue(value);
    });
  }

  // Trae la lista de bancos por defecto
  searchBanks(params: ListParams) {
    this.banks = new DefaultSelect();
    this.loading = true;
    // this.bankAccountSelect = new DefaultSelect();
    this.recordAccountStatementsService.getAll(params).subscribe({
      next: response => {
        this.loading = true;
        this.banks = new DefaultSelect(response.data, response.count);
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.alert('warning', 'No existen bancos', ``);
      },
    });
  }

  // Permite buscar los bancos por nombre
  onSearchName(inputElement: any) {
    this.banks = new DefaultSelect();
    console.log('Hola 3');
    const name = inputElement.value;
    setTimeout(() => {
      this.recordAccountStatementsService
        .getAllDinamicBankCode(name, this.params.getValue())
        .subscribe({
          next: response => {
            this.banks = new DefaultSelect(response.data, response.count);
            this.loading = false;
          },
          error: (err: any) => {
            this.loading = false;
            // this.alert('warning', 'No Existen Bancos', ``);
          },
        });
    }, 3000);
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  update() {
    this.loading = true;
    this.bankMovementsId = this.bankMovementsTypes.id;
    this.bankMovementTypeService
      .update(this.bankMovementsId, this.form.value)
      .subscribe({
        next: data => {
          this.handleSuccess(), this.modalRef.hide();
        },
        error: (error: any) => {
          this.alert('warning', `No es posible actualizar el movimiento`, '');
          this.modalRef.hide();
        },
      });
    this.modalRef.hide();
  }

  create() {
    this.loading = true;
    const accountKey = this.form.get('accountKey');
    const bankKey = this.form.get('bankKey');
    const coinKey = this.form.get('coinKey');
    const branchOffice = this.form.get('branchOffice');
    const rateCalculationInterest = this.form.get('rateCalculationInterest');
    const registryNumber = this.form.get('registryNumber');
    const accountType = this.form.get('accountType');
    const square = this.form.get('square');

    const model: any = {
      accountKey: accountKey.value,
      accountType: accountType.value,
      coinKey: coinKey.value,
      square: square.value,
      branchOffice: branchOffice.value,
      rateCalculationInterest: rateCalculationInterest.value,
      bankKey: bankKey.value.bankCode,
      accountNumberTransfer: null,
      registryNumber: registryNumber.value,
      delegationNumber: null,
      esReference: null,
    };

    console.log(model);
    if (this.form.valid) {
      this.bankMovementTypeService.create(model).subscribe({
        next: data => {
          this.loading = false;
          this.handleSuccess();
          this.modalRef.hide();
        },
        error: error => {
          this.alert('warning', `No es posible crear el movimiento`, '');
          this.loading = false;
        },
      });
    } else {
      this.alert(
        'warning',
        'El formulario no es válido. revise los campos requeridos',
        ''
      );
      this.loading = false;
    }
  }

  handleSuccess() {
    const message: string = this.edit
      ? 'ha sido actualizado'
      : 'ha sido creado';
    this.alert('success', `El ${this.title} ${message}`, '');
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  cleandInfoAll() {
    this.form.reset();
    this.searchBanks(new ListParams());
  }
}
