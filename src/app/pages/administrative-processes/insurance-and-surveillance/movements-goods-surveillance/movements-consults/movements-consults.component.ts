import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IPolVigilancePerGood } from 'src/app/core/models/ms-survillance/survillance';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { KEYGENERATION_PATTERN } from 'src/app/core/shared/patterns';

interface IVigPerGood {
  goodNumber: string;
  cveContract: string;
  startDate: string;
  shiftsVigNumber: string;
  shiftsCanNumber: string;
  incomeDate: string;
  inContractCurrent: string;
  lowDate?: string;
  responsibleLow?: string;
  recordNumber?: string;
  shiftsMedNumber: string;
  shiftsIndNumber: string;
  shiftsMecNumber: string;
  shiftsIncNumber: string;
  cveRegsup: string;
}

@Component({
  selector: 'app-movements-consults',
  templateUrl: './movements-consults.component.html',
  styles: [],
})
export class MovementsConsultsComponent extends BasePage implements OnInit {
  form: FormGroup;
  @Input() data: any;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private survillanceService: SurvillanceService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('Desde el modal', this.data);
    this.prepareForm();
    this.form.get('goodnumber').disable();
    this.form.get('description').disable();
    this.form.get('contract_code').disable();
    if (this.data) {
      this.form.patchValue(this.data);
      this.form
        .get('contract_start_date')
        .patchValue(this.formatDate(this.data.contract_start_date));
    }
  }

  prepareForm() {
    this.form = this.fb.group({
      goodnumber: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      description: [null, Validators.required],
      contract_code: [null, Validators.required],
      contract_start_date: [null, Validators.required],
      shifts_inforce: [null, [Validators.required, Validators.min(1)]],
      medical_turns: [null, [Validators.required, Validators.min(1)]],
      industrial_turns: [null, [Validators.required, Validators.min(1)]],
      turns_can_number: [null, [Validators.required, Validators.min(1)]],
      registration_supervisor: [null, Validators.required],
    });
  }
  //turns_can_number
  handleSuccess() {
    //this.alert('success', 'Movimiento de bienes en vigilancia', `Actualizado Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  async confirm() {
    try {
      await this.preUpdate();
      const model: IPolVigilancePerGood = {
        goodNumber: this.form.get('goodnumber').value,
        cvePolicy: this.data.policy_code,
        cveRegsup: this.form.get('registration_supervisor').value,
        shiftsIncNumber: this.form.get('shifts_inforce').value,
        shiftsCanNumber: this.form.get('turns_can_number').value,
        shiftsIndNumber: this.form.get('industrial_turns').value,
        shiftsMedNumber: this.form.get('medical_turns').value,
        shiftsVigNumber: this.form.get('registration_supervisor').value,
        shiftsMechNumber: this.data.mechanical_turns,
        startVigDate: this.form.get('contract_start_date').value,
      };
      console.log('model de update', model);
      await this.update(model);
      this.handleSuccess();
    } catch (error) {
      console.error(error);
    }
  }

  close() {
    this.modalRef.hide();
  }

  preUpdate() {
    return new Promise(async (res, _rej) => {
      const valid: boolean = await this.validateRegister();
      if (!valid) {
        ///// crear un registrro en esta tabla VIGILANCIA_X_BIEN
        const model: IVigPerGood = {
          goodNumber: this.data.goodnumber,
          cveContract: this.data.contract_code,
          startDate: this.formatDate2(this.data.policy_start_date),
          shiftsVigNumber: this.data.shifts_inforce,
          shiftsCanNumber: this.data.turns_can_number,
          incomeDate: this.formatDate2(this.data.contract_start_date),
          inContractCurrent: 'D',
          shiftsMedNumber: this.data.medical_turns,
          shiftsIndNumber: this.data.industrial_turns,
          shiftsMecNumber: this.data.mechanical_turns,
          shiftsIncNumber: this.data.incident_turns,
          cveRegsup: this.data.registration_supervisor,
        };
        console.log(model);
        this.survillanceService.createVigPerGood(model).subscribe({
          next: resp => {
            console.log(resp);
            res(true);
          },
          error: err => {
            res(false);
            /* this.alert(
              'warning',
              'Movimientos de bienes en vigilancia',
              `Error, al ingreso de contrato de vigilancia, bien: ${this.data.goodnumber}`
            ); */
            console.log(err);
          },
        });
      } else {
        res(false);
      }
    });
  }

  async validateRegister() {
    const vExist: boolean = await this.vExist(
      this.data.goodnumber,
      this.data.contract_code,
      this.formatDate2(this.data.policy_start_date)
    );
    if (vExist) {
      /* this.alert(
        'warning',
        'Movimientos de bienes en vigilancia',
        `El biene: ${this.data.goodnumber}, existe en contrato de vigilancia`
      ); */
      return true;
    }
    /*     if(this.form.get('contract_start_date').value < this.data.policy_effective_date){
      this.alert('warning','Movimientos de bienes en vigilancia',`Fecha de ingreso menor a fecha de inicio de contrato en el bien: ${this.data.goodnumber}`)
      return true;
    } */
    if (Number(this.form.get('shifts_inforce').value) <= 0) {
      /* this.alert(
        'warning',
        'Movimientos de bienes en vigilancia',
        `Vigilancia directa no valida en el bien:${this.data.goodnumber}`
      ); */
      return true;
    }
    if (Number(this.form.get('medical_turns').value) <= 0) {
      /* this.alert(
        'warning',
        'Movimientos de bienes en vigilancia',
        `Vigilancia media directa no valida en el bien:${this.data.goodnumber}`
      ); */
      return true;
    }
    if (Number(this.form.get('industrial_turns').value) <= 0) {
      /* this.alert(
        'warning',
        'Movimientos de bienes en vigilancia',
        `Vigilancia indirecta no valida en el bien:${this.data.goodnumber}`
      ); */
      return true;
    }
    return false;
  }

  vExist(goodNumber: number | string, cveContract: string, startDate: string) {
    return new Promise<boolean>((res, _rej) => {
      const params: ListParams = {};
      params['filter.goodNumber'] = `$eq:${goodNumber}`;
      params['filter.cveContract'] = `$eq:${cveContract}`;
      params['filter.startDate'] = `$eq:${startDate}`;
      this.survillanceService.getVigPerGood(params).subscribe({
        next: resp => {
          if (resp.count > 0) {
            res(true);
          } else {
            res(false);
          }
        },
        error: err => {
          res(false);
        },
      });
    });
  }
  formatDate(fecha: string) {
    return fecha.split('T')[0].split('-').reverse().join('/');
  }
  formatDate2(fecha: string) {
    return fecha.split('T')[0].split('-').join('-');
  }

  update(model: IPolVigilancePerGood) {
    return new Promise((res, _rej) => {
      this.survillanceService.updatePolVigPerGood(model).subscribe({
        next: resp => {
          console.log(resp);
          res(true);
          this.alert(
            'success',
            'Movimientos de bienes en vigilancia',
            'Registro actualizaco correctamente.'
          );
        },
        error: err => {
          res(false);
          console.log(err);
          this.alert(
            'error',
            'Ha ocurrido un error',
            'No se ha podido actualizar la información del registro.'
          );
        },
      });
    });
  }
}
