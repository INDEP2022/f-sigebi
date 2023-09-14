import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IUnits } from 'src/app/core/models/administrative-processes/siab-sami-interaction/measurement-units';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { DonationService } from 'src/app/core/services/ms-donationgood/donation.service';
import { BasePage } from 'src/app/core/shared';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-maintenance-commitment-donation-modal',
  templateUrl: './maintenance-commitment-donation-modal.component.html',
  styles: [],
})
export class MaintenanceCommitmentDonationModalComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  title: string = '';
  newOrEdit: boolean = false;
  data: any;
  type: any;
  textBtn: string = 'Guardar';

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private movementService: AccountMovementService,
    private goodsQueryService: GoodsQueryService,
    private authService: AuthService,
    private donationService: DonationService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('flag ', this.newOrEdit);
    //console.log('NewOrEdir: ', this.newOrEdit);
    if (this.newOrEdit || !this.newOrEdit) {
      console.log('type -> ', this.type);
      switch (this.type) {
        case 1:
          this.title = 'Comercio Exterior Kg';
          this.prepareForm();
          break;
        case 2:
          this.title = 'Delitos Federales';
          this.prepareForm();
          break;
        case 3:
          this.title = 'Otros Transferentes';
          this.prepareFormOthersT();
          break;
        case 4:
          this.title = 'Permisos de Usuarios para Rastreador';
          this.prepareFormPermissionR();
          break;
        default:
          this.title = '';
          break;
      }
      console.log('data -> ', this.data);
      if (this.data != null) {
        this.textBtn = 'Editar';

        console.log('data a mapear -> ', this.data.labelId);
        this.form.patchValue({
          labelId: this.data.labelId,
          status: this.data.status,
          desStatus: this.data.desStatus,
          transferentId: this.data.transfereeId.transferentId,
          keyCode: this.data.desTrans,
          clasifId: this.data.clasifId,
          desClasif: this.data.desClasif,
          unit: this.data.unit,
          ruleId: this.data.ruleId,
          valid: this.data.valid,
        });
      }
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    if (this.form.invalid) return;
    if (this.newOrEdit) {
      switch (this.type) {
        case 1:
          this.alert('success', 'Editar', 'daaa');
          //this.update(this.form.value);
          break;
        default:
          break;
      }
    } else {
      switch (this.type) {
        case 1:
          this.insertAprueba_donacion();
          break;
        default:
          break;
      }
    }
  }
  insertAprueba_donacion() {
    this.newOrEdit = false;
    const model = {} as any;
    model.labelId = Number(this.form.value.labelId);
    model.status = this.form.value.status;
    model.desStatus = this.form.value.desStatus;
    model.transfereeId = Number(this.form.value.transferentId);
    model.desTrans = this.form.value.keyCode;
    model.clasifId = Number(this.form.value.clasifId);
    model.desClasif = this.form.value.desClasif;
    model.unit = this.form.value.unit;
    model.ruleId = Number(this.form.value.ruleId);
    model.valid = Number(this.form.value.valid);

    //SERVICIO 1
    this.donationService.createApproveDonation(model).subscribe({
      next: () => {
        this.handleSuccess();
        this.onLoadToast('success', 'Comercio Exterior Kg creado', '');
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
          //this.newOrEdit = false;
        } else {
          this.onLoadToast('error', 'Error', err.error.message);
        }
      },
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      labelId: ['', Validators.required],
      status: ['', Validators.required],
      desStatus: ['', Validators.required],
      transferentId: ['', Validators.required],
      keyCode: ['', Validators.required],
      clasifId: ['', Validators.required],
      desClasif: ['', Validators.required],
      unit: ['', Validators.required],
      ruleId: ['', Validators.required],
      valid: ['', Validators.required],
    });
  }
  prepareFormOthersT() {
    this.form = this.fb.group({
      labelId: ['', Validators.required],
      status: ['', Validators.required],
      desStatus: ['', Validators.required],
      transferentId: ['', Validators.required],
      keyCode: ['', Validators.required],
      clasifId: ['', Validators.required],
      desClasif: ['', Validators.required],
      unit: ['', Validators.required],
      amount: ['', Validators.required],
    });
  }

  prepareFormPermissionR() {
    this.form = this.fb.group({
      value: ['', Validators.required],
      name: ['', Validators.required],
    });
  }

  handleSuccess() {
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
