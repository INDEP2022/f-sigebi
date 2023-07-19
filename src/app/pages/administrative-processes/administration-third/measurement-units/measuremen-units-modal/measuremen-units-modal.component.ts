import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IUnits } from 'src/app/core/models/administrative-processes/siab-sami-interaction/measurement-units';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { BasePage } from 'src/app/core/shared';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-measuremen-units-modal',
  templateUrl: './measuremen-units-modal.component.html',
  styles: [],
})
export class MeasuremenUnitsModalComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  title: string = 'Catálogo de Unidad de Medida';
  catalogo: IUnits;
  newOrEdit: boolean;
  dataSelect: IUnits;
  data: IUnits;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private movementService: AccountMovementService,
    private goodsQueryService: GoodsQueryService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.title = '  Catálogo ';
    this.prepareForm();
    this.newOrEdit;
    console.log('NewOrEdir: ', this.newOrEdit);
    if (this.newOrEdit) {
      console.log(' data modal ', this.data);
      this.form.patchValue({
        unit: this.data.unit,
        description: this.data.description,
        registryNumber: this.data.registryNumber,
      });
    }
  }

  close() {
    this.modalRef.hide();
    this.newOrEdit = false;
  }

  /*confirm() {
    if (this.form.invalid) return;
    this.insertCatalog();
  }*/

  confirm() {
    if (this.form.invalid) return;
    if (this.newOrEdit) {
      this.update(this.form.value);
    } else {
      this.insertCatalog();
    }
  }

  insertCatalog() {
    this.newOrEdit = false;
    const model = {} as IUnits;
    model.unit = this.form.value.unit;
    model.description = this.form.value.description;
    model.registryNumber = this.form.value.registryNumber;
    //console.log ('model ->',model);

    this.goodsQueryService.postUnits(model).subscribe({
      next: () => {
        this.handleSuccess();
        this.onLoadToast('success', 'Catálogo de Unidad de Medida creado', '');
      },
      error: error => {
        this.onLoadToast('error', error.error.message, '');
      },
    });
  }

  parseDateNoOffset(date: string | Date): Date {
    const dateLocal = new Date(date);
    return new Date(
      dateLocal.valueOf() - dateLocal.getTimezoneOffset() * 60 * 1000
    );
  }

  update(data: IUnits) {
    this.goodsQueryService.putUnits(data, data.unit).subscribe({
      next: data => {
        this.handleSuccess();
        Swal.fire('Actualizado', '', 'success');
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
          this.onLoadToast('error', 'Error', error);
        } else {
          this.onLoadToast('error', 'Error', err.error.message);
        }
      },
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      unit: ['', Validators.required],
      description: ['', Validators.required],
      registryNumber: ['', Validators.required],
    });
  }

  handleSuccess() {
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
