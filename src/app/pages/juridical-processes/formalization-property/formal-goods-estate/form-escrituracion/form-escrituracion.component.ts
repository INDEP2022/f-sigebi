import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IFormalizeProcesses } from 'src/app/core/models/formalize-processes/formalize-processes.model';
import { FormalizeProcessService } from 'src/app/core/services/ms-formalize-processes/formalize-processes.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-form-escrituracion',
  templateUrl: './form-escrituracion.component.html',
  styles: [],
})
export class FormEscrituracionComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  form: FormGroup = new FormGroup({});
  @Output() refresh = new EventEmitter<true>();
  dataEscritracion: any;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private formalizeProcessService: FormalizeProcessService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm(): void {
    const fechaEscritura: any = new Date(this.dataEscritracion.writingDate);
    fechaEscritura.setUTCDate(fechaEscritura.getUTCDate() + 1);
    const _fechaEscritura: any = new Date(fechaEscritura.toISOString());

    const noFecha: any = new Date(this.dataEscritracion.writingAntDate);
    noFecha.setUTCDate(noFecha.getUTCDate() + 1);
    const _noFecha: any = new Date(noFecha.toISOString());

    this.form = this.fb.group({
      escrituraNo: [this.dataEscritracion.writingNumber, [Validators.required]],
      fechaEscritura: [
        this.dataEscritracion.writingDate ? _fechaEscritura : '',
        [Validators.required],
      ],
      escrituraAntNo: [
        this.dataEscritracion.writingAntNumber,
        [Validators.required],
      ],
      noFecha: [
        this.dataEscritracion.writingAntDate ? _noFecha : '',
        [Validators.required],
      ],
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.form
      .get('fechaEscritura')
      .value.setUTCDate(this.form.get('fechaEscritura').value.getUTCDate() - 1);
    const fechaEscritura: any = new Date(
      this.form.get('fechaEscritura').value.toISOString()
    );

    this.form
      .get('noFecha')
      .value.setUTCDate(this.form.get('noFecha').value.getUTCDate() - 1);
    const noFecha: any = new Date(this.form.get('noFecha').value.toISOString());

    const data: IFormalizeProcesses = {
      goodNumber: this.dataEscritracion.goodNumber,
      eventId: this.dataEscritracion.eventId,
      stage: this.dataEscritracion.stage,
      writingDate: fechaEscritura,
      writingNumber: this.form.get('escrituraNo').value,
      writingAntNumber: this.form.get('escrituraAntNo').value,
      writingAntDate: noFecha,
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
      'FORMALIZA ESCRITURACIÓN',
      `Se actualizaron los datos de escritura correctamente`
    );
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }
}
