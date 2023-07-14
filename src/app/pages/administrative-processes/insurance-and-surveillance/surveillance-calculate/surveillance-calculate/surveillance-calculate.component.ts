import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-surveillance-calculate',
  templateUrl: './surveillance-calculate.component.html',
  styles: [],
})
export class SurveillanceCalculateComponent extends BasePage implements OnInit {
  form: FormGroup;

  override bsConfig: Partial<BsDatepickerConfig>;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private survillanceService: SurvillanceService
  ) {
    super();
    this.bsConfig = {
      dateInputFormat: 'MM/YYYY',
      minMode: 'month',
    };
  }
  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      contract: [null, Validators.required],
      // fecha: [null, Validators.required],
      year: [null, Validators.required],
      month: [null, Validators.required],
    });
  }
  calculation() {
    if (this.form.valid) {
      console.log(this.form.value);
      const contract = this.form.get('contract').value;
      const year = this.form.get('year').value;
      const month = this.form.get('month').value;

      // this.validCalculation(contract, year, month).subscribe(result => {
      //   if (result) {

      //     this.alertInfo(
      //       'warning',
      //       'El cálculo de este mes ya ha sido realizado, o no hay bienes en este periodo.',
      //       ''
      //     );
      //   } else {
      //     console.log('El cálculo es válido');
      //     this.getSupervision(contract, year, month);
      //   }
      // });
    }
  }

  validCalculation(contract: number, year: number, month: number) {
    const params: ListParams = {};
    params['filter.cveContract'] = contract;
    params['filter.year'] = year;
    params['filter.month'] = month;

    // return this.survillanceService.geVigSummary(params).pipe(
    //   map((data: any) => {
    //     console.log(data);
    //     return data.data > 0;
    //   }),
    //   catchError(() => {
    //     // Manejar el error aquí y devolver un valor por defecto (en este caso, falso)
    //     return of(false);
    //   })
    // );
  }

  getSupervision(contract: number, year: number, month: number) {
    const formSupervision: any = {};
    formSupervision['contract'] = contract;
    formSupervision['year'] = year;
    formSupervision['month'] = month;

    // this.survillanceService.getState(formSupervision).subscribe((data: any) => {
    //   console.log(data);
    // }
    // );
  }
}
