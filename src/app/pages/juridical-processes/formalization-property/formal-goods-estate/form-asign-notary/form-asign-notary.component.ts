import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IFormalizeProcesses } from 'src/app/core/models/formalize-processes/formalize-processes.model';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { FormalizeProcessService } from 'src/app/core/services/ms-formalize-processes/formalize-processes.service';
import { ComerNotariesTercsService } from 'src/app/core/services/ms-notary/notary.service';
import { JobsService } from 'src/app/core/services/ms-office-management/jobs.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-form-asign-notary',
  templateUrl: './form-asign-notary.component.html',
  styles: [],
})
export class FormAsignNotaryComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  @Output() refresh = new EventEmitter<true>();
  form: FormGroup = new FormGroup({});
  dataNotary: any;
  selectNotary = new DefaultSelect<any>();
  cities = new DefaultSelect<any>();
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private jobsService: JobsService,
    private formalizeProcessService: FormalizeProcessService,
    private comerNotariesTercsService: ComerNotariesTercsService,
    private service: CityService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('FDA', this.dataNotary);
    // this.listNotary(new ListParams())
    this.prepareForm();
  }

  prepareForm(): void {
    const fechaOriginal: any = new Date(this.dataNotary.assignmentnotDate);
    // // Sumar un día en UTC
    fechaOriginal.setUTCDate(fechaOriginal.getUTCDate() + 1);
    const fecha: any = new Date(fechaOriginal.toISOString());

    this.form = this.fb.group({
      notaryCli: [this.dataNotary.notaryCli, [Validators.required]],
      numNotaryCli: [this.dataNotary.numNotaryCli, [Validators.required]],
      cityNotary: [this.dataNotary.cityNotary, [Validators.required]],
      // cityField: [''],
      // notaryIdterc: ['', [Validators.required]],
      assignmentnotDate: [
        this.dataNotary.assignmentnotDate ? fecha : '',
        [Validators.required],
      ],
      // assignmentnotDate: [(this.dataNotary.assignmentnotDate) ? fechaOriginal : '', [Validators.required]]
    });
  }

  // get City() {
  //   return this.form.get('cityField');
  // }

  getCities(params: ListParams) {
    params['filter.nameCity'] = `$ilike:${params.text}`;
    this.service.getAll(params).subscribe({
      next: data => (this.cities = new DefaultSelect(data.data, data.count)),
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        // this.onLoadToast('error', 'Error', err.error.message);
        this.cities = new DefaultSelect();
      },
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    // Sumar un día en UTC
    this.form
      .get('assignmentnotDate')
      .value.setUTCDate(
        this.form.get('assignmentnotDate').value.getUTCDate() - 1
      );
    const fecha: any = new Date(
      this.form.get('assignmentnotDate').value.toISOString()
    );

    const data: IFormalizeProcesses = {
      goodNumber: this.dataNotary.goodNumber,
      eventId: this.dataNotary.eventId,
      stage: this.dataNotary.stage,
      notaryCli: this.form.get('notaryCli').value,
      numNotaryCli: this.form.get('numNotaryCli').value,
      cityNotary: this.form.get('cityNotary').value,
      // notaryIdterc: this.form.get('notaryIdterc').value,
      assignmentnotDate: fecha,
    };

    this.formalizeProcessService.update(data).subscribe({
      next: (data: any) => {
        this.handleSuccess();
      },
      error: error => {
        this.onLoadToast('error', 'ERROR', error.error.message);
      },
    });
  }

  handleSuccess() {
    this.onLoadToast(
      'success',
      'ASIGNA NOTARIO',
      `Datos del notario actualizado correctamente`
    );
    this.loading = false;
    this.refresh.emit(true);
    // this.data.emit(data);
    this.modalRef.hide();
  }

  funcDate() {
    // let date1 = new Date(this.form.get('assignmentnotDate').value)
    // let date2 = new Date(this.dataNotary.assignmentnotDate)
    // date2.setUTCDate(date2.getUTCDate() + 1);
    // const fecha: any = new Date(date2.toISOString())
    // console.log("SI", date1)
    // console.log("SI", fecha)
    // if (date1.getTime() === fecha.getTime()) {
    //   console.log("SI")
    // }
  }

  listNotary(params?: ListParams) {
    params['filter.id'] = `$eq:${params.text}`;
    // delete params.text
    // delete params.page

    this.comerNotariesTercsService.getAll(params).subscribe({
      next: (data: any) => {
        let result = data.data.map(async (item: any) => {
          item['idAndName'] = item.id + ' - ' + item.name + ' ' + item.lastName;
        });

        this.selectNotary = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        console.log('Error', error.error.message);
        this.selectNotary = new DefaultSelect();
      },
    });
  }
}
