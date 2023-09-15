import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { TvalTable1Service } from 'src/app/core/services/catalogs/tval-table1.service';
import { DynamicCatalogsService } from 'src/app/core/services/dynamic-catalogs/dynamiccatalog.service';
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
  dataValid: string[] = [];
  totalOtKey: number = 0;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private movementService: AccountMovementService,
    private goodsQueryService: GoodsQueryService,
    private authService: AuthService,
    private donationService: DonationService,
    private tvalTable1Service: TvalTable1Service,
    private dynamicCatalogsService: DynamicCatalogsService
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
          this.getOtKey();
          break;
        default:
          this.title = '';
          break;
      }
      console.log('data -> ', this.data);
      if (this.data != null) {
        this.textBtn = 'Editar';

        console.log('data a mapear en el editar-> ', this.data.labelId);
        if (this.type == 4) {
          console.log('tipo 4 > ', this.data);
          this.form.patchValue({
            value: this.data.labelId,
            name: this.data.status,
            valid: this.data.valid,
          });
        } else {
          this.form.patchValue({
            labelId: this.data.label.id,
            status: this.data.status,
            desStatus: this.data.desStatus,
            transferentId: this.data.transfereeId.transferentId,
            keyCode: this.data.desTrans,
            clasifId: this.data.clasifId,
            desClasif: this.data.desClasif,
            unit: this.data.unit,
            ruleId: this.data.ruleId,
            valid: this.data.valid,
            amount: this.data.amount,
          });
        }
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
          this.update(this.form.value);
          break;
        case 2:
          this.update(this.form.value);
          break;
        case 3:
          this.updateOtros(this.form.value);
          break;
        case 4:

        default:
          break;
      }
    } else {
      switch (this.type) {
        case 1:
          this.insertAprueba_donacion();
          break;
        case 2:
          this.insertDelitosFede();
          break;
        case 3:
          this.insertOtrosTrasn();
          break;
        case 4:
          this.createTableUser();
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
        this.onLoadToast('success', 'Comercio Exterior Kg Creado', '');
      },
      error: error => {
        this.onLoadToast('error', error.error.message, '');
      },
    });
  }
  insertDelitosFede() {
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
        this.onLoadToast('success', 'Delitos Federales Creado', '');
      },
      error: error => {
        this.onLoadToast('error', error.error.message, '');
      },
    });
  }
  insertOtrosTrasn() {
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
    model.amount = Number(this.form.value.amount);

    //SERVICIO 1
    this.donationService.createApproveDonation(model).subscribe({
      next: () => {
        this.handleSuccess();
        this.onLoadToast('success', 'Otros Transferentes Creado', '');
      },
      error: error => {
        this.onLoadToast('error', error.error.message, '');
      },
    });
  }
  insertPermisosRastreador() {
    this.newOrEdit = false;
    const model = {} as any;
    model.value = this.form.value.value;
    model.name = this.form.value.name;
    model.valid = Number(this.form.value.valid);

    //SERVICIO POS PERMISOS
    this.donationService.createApproveDonation(model).subscribe({
      next: () => {
        this.handleSuccess();
        this.onLoadToast('success', 'Usuario para Rastereador Creado', '');
      },
      error: error => {
        this.onLoadToast('error', error.error.message, '');
      },
    });
  }

  getOtKey() {
    let arr: number[] = [];
    this.tvalTable1Service.getByIdFind(421).subscribe({
      next: response => {
        console.log('total key data ', response.count);
        console.log('total key data ', response);
        for (let i = 0; i < response.count; i++) {
          console.log('i -> ', i + 1);
          arr.push(response.data[i].otKey);
        }
        console.log('arr  ', arr.sort);
      },
      error: error => {
        console.log(error);
        this.loading = false;
      },
    });
  }

  createTableUser() {
    const model = {} as any;
    model.nmtable = 421;
    model.otkey = Number(this.form.value.labelId);
    model.otvalor = Number(this.form.value.value);

    model.registerNumber = 0;
    model.abbreviation = this.form.value.valid;

    console.log('data a guardar 4 -> ', model);
    this.tvalTable1Service.createTvalTable1(model).subscribe({
      next: resp => {
        if (resp != null && resp != undefined) {
          this.alert('success', '', 'Registro Creado Correctamente');
        }
      },
      error: err => {
        this.onLoadToast('error', err.message, '');
      },
    });
  }

  parseDateNoOffset(date: string | Date): Date {
    const dateLocal = new Date(date);
    return new Date(
      dateLocal.valueOf() - dateLocal.getTimezoneOffset() * 60 * 1000
    );
  }

  update(data: any) {
    //console.log("data update -> ", data);
    const model = {} as any;
    model.labelId = Number(data.labelId);
    model.status = data.status;
    model.desStatus = data.desStatus;
    model.transfereeId = Number(data.transferentId);
    model.desTrans = data.keyCode;
    model.clasifId = Number(data.clasifId);
    model.desClasif = data.desClasif;
    model.unit = data.unit;
    model.ruleId = Number(data.ruleId);
    model.valid = Number(data.valid);
    console.log('data update 2-> ', model);

    this.donationService.editApproveDonation(model).subscribe({
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
  updateOtros(data: any) {
    //console.log("data update -> ", data);
    const model = {} as any;
    model.labelId = Number(data.labelId);
    model.status = data.status;
    model.desStatus = data.desStatus;
    model.transfereeId = Number(data.transferentId);
    model.desTrans = data.keyCode;
    model.clasifId = Number(data.clasifId);
    model.desClasif = data.desClasif;
    model.unit = data.unit;
    model.ruleId = Number(data.ruleId);
    model.valid = Number(data.valid);
    model.amount = Number(data.amount);

    console.log('data update 3-> ', model);

    this.donationService.editApproveDonation(model).subscribe({
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

    this.form.patchValue({
      labelId: this.type,
    });
    this.form.get('labelId').disabled;
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
      ruleId: ['', Validators.required],
      valid: ['', Validators.required],
    });

    this.form.patchValue({
      labelId: this.type,
    });
    this.form.get('labelId').disabled;
  }

  prepareFormPermissionR() {
    this.form = this.fb.group({
      value: ['', Validators.required],
      name: ['', Validators.required],
      valid: ['', Validators.required],
    });
  }

  handleSuccess() {
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
