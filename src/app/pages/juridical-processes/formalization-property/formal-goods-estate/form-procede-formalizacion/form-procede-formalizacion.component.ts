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
import { FormalizeProcessService } from 'src/app/core/services/ms-formalize-processes/formalize-processes.service';
import { JobsService } from 'src/app/core/services/ms-office-management/jobs.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-form-procede-formalizacion',
  templateUrl: './form-procede-formalizacion.component.html',
  styles: [],
})
export class FormProcedeFormalizacionComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  form: FormGroup = new FormGroup({});
  string_PTRN: `[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ@\\s\\.,_\\-¿?\\\\/()%$#¡!|]*'; [a-zA-Z0-9áéíóúÁÉÍÓÚñÑ@\\s\\.,_\\-¿?\\\\/()%$#¡!|]`;
  @Output() refresh = new EventEmitter<true>();
  @Output() data = new EventEmitter<object>();
  dataFormalize: any;
  constext: any;
  selectJob = new DefaultSelect<any>();
  validJod: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private jobsService: JobsService,
    private formalizeProcessService: FormalizeProcessService // private comerNotariesTercsService: ComerNotariesTercsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm(): void {
    console.log('AQUI');
    // if (this.dataFormalize.jobNumber) {
    //   let arr: any = [];
    //   arr.push(this.dataFormalize.jobNumber)
    //   this.selectJob = new DefaultSelect(arr, 1);
    // }
    this.form = this.fb.group({
      idEvent: [this.dataFormalize.eventId],
      goodNumber: [this.dataFormalize.goodNumber],
      oficioDCBI: [this.dataFormalize.jobNumber, [Validators.required]],
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    if (this.validJod == true) {
      const data: IFormalizeProcesses = {
        goodNumber: this.dataFormalize.goodNumber,
        eventId: this.dataFormalize.eventId,
        stage: this.dataFormalize.stage,
        notaryIdterc: this.dataFormalize.notaryIdterc,
        lotId: this.dataFormalize.lotId,
        notaryCli: this.dataFormalize.notaryCli,
        numNotaryCli: this.dataFormalize.numNotaryCli,
        cityNotary: this.dataFormalize.cityNotary,
        date: this.dataFormalize.date,
        assignmentnotDate: this.dataFormalize.assignmentnotDate,
        jobNumber: this.form.get('oficioDCBI').value,
        writingDate: this.dataFormalize.writingDate,
        writingNumber: this.dataFormalize.writingNumber,
        writingAntNumber: this.dataFormalize.writingAntNumber,
        writingAntDate: this.dataFormalize.writingAntDate,
        origin: this.dataFormalize.origin,
      };

      this.formalizeProcessService.update(data).subscribe({
        next: (data: any) => {
          this.handleSuccess(data);
        },
        error: error => {
          this.onLoadToast('error', 'ERROR', error.error.message);
          console.log('Error', error.error.message);
        },
      });
    } else {
      this.onLoadToast('warning', '', `Inserte un Oficio DCBI válido`);
    }
  }

  listJobs(params?: ListParams) {
    // params['filter.id'] = `$eq:${params.text}`;
    // delete params.text
    // delete params.page

    this.jobsService.getById_(params.text).subscribe({
      next: (data: any) => {
        this.validJod = true;
        data.idWithText = data.id + ' - ' + data.jobKey;
        let arr = [];
        arr.push(data);

        this.selectJob = new DefaultSelect(arr, data.count);
      },
      error: error => {
        this.validJod = false;
        console.log('Error', error.error.message);
        this.selectJob = new DefaultSelect();
      },
    });
  }

  getJob(item: any) {
    this.loading = false;
  }

  handleSuccess(data: any) {
    this.onLoadToast(
      'success',
      'PROCEDE FORMALIZACIÓN',
      `Oficio DCBI insertado correctamente`
    );
    this.loading = false;
    this.refresh.emit(true);
    // this.data.emit(data);
    this.modalRef.hide();
  }
}
