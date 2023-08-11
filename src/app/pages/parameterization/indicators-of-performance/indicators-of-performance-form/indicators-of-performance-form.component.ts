import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DetailIndParameterService } from 'src/app/core/services/catalogs/detail-ind-parameter.service';
import { ZoneContractService } from 'src/app/core/services/catalogs/zone-contract.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-indicators-of-performance-form',
  templateUrl: './indicators-of-performance-form.component.html',
  styles: [],
})
export class IndicatorsOfPerformanceFormComponent
  extends BasePage
  implements OnInit
{
  edit: boolean = false;
  //form: ModelForm<IDetailIndParameter>;
  form: FormGroup;
  event: any;
  indicatorNumber: string;
  zoneContracts = new DefaultSelect();
  maxDate: Date;
  minDate: Date;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private detailIndParameterService: DetailIndParameterService,
    private zoneContractService: ZoneContractService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      indicatorNumber: [null],
      endDate: [null, [Validators.required]],
      contractZoneKey: [null, [Validators.required]],
      initialDate: [null, [Validators.required]],
      daysHolNumber: [null],
      daysLimNumber: [null],
      hoursLimNumber: [null],
      registryNumber: [null],
      initialDDate: [null],
      endDDate: [null],
      sinLimHour: [null],

      /*initialDate: [null, Validators.required],
      endDate: [null, Validators.required],
      daysLimNumber: [null, Validators.required],
      hoursLimNumber: [null, Validators.required],
      contractZoneKey: [null, Validators.required],
      initialDDate: [null, Validators.required],
      endDDate: [null, Validators.required],
      indicatorNumber: [null],*/
    });
    if (this.event != null) {
      this.edit = true;
      this.form.patchValue(this.event);
      console.log(this.event);

      const dateEnd = this.transformDate(this.event.endDate);
      const dateInitial = this.transformDate(this.event.initialDate);
      const dateLimNumber = this.transformDate(this.event.hoursLimNumber);

      this.form.controls['endDate'].setValue(dateEnd);
      this.form.controls['initialDate'].setValue(dateInitial);
      this.form.controls['hoursLimNumber'].setValue(dateLimNumber);
      this.form.controls['contractZoneKey'].disable();
      this.form.controls['indicatorNumber'].disable();
    }
    this.form.controls['indicatorNumber'].setValue(this.indicatorNumber);
    this.form.controls['indicatorNumber'].disable();
    setTimeout(() => {
      this.getZoneContracts(new ListParams());
    }, 1000);
  }

  transformDate(date: Date) {
    const date2 = new Date(date);
    const datePipe = new DatePipe('en-US');
    const formatTrans1 = datePipe.transform(date2, 'yyyy-MM-dd', 'UTC');
    return formatTrans1;
  }

  getZoneContracts(params: ListParams) {
    this.zoneContractService.getAll(params).subscribe({
      next: data => {
        console.log(data);
        this.zoneContracts = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.zoneContracts = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  validateDate(event: Date) {
    this.minDate = event;
    console.log(event);
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  update() {
    this.loading = true;
    const id = this.indicatorNumber;
    this.detailIndParameterService.update3(this.form.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }

  create() {
    this.loading = true;
    this.detailIndParameterService.create(this.form.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => {
        this.alert(
          'warning',
          'Valor Invalido',
          `La Clave Zona Contrato ya se registró`
        );
        this.loading = false;
      },
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', 'Indicador de Desempeño', `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
