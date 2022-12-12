import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

enum REPORT_TYPE {
  Confiscation = 'CONFISCATION',
  Reception = 'RECEPTION',
}

@Component({
  selector: 'app-records-report',
  templateUrl: './records-report.component.html',
  styles: [],
})
export class RecordsReportComponent implements OnInit {
  REPORT_TYPES = REPORT_TYPE;
  type: FormControl = new FormControl(REPORT_TYPE.Reception);
  form: FormGroup;
  itemsSelect = new DefaultSelect();

  get initialRecord() {
    return this.form.get('actaInicial');
  }
  get finalRecord() {
    return this.form.get('actaFinal');
  }
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      delegacionRecibe: [null, [Validators.required]],
      delegacionAdministra: [null, [Validators.required]],
      estatusActa: [null, [Validators.required]],
      actaInicial: [null, [Validators.required]],
      actaFinal: [null, [Validators.required]],
      noExpediente: [null, [Validators.required]],
      desde: [null, [Validators.required]],
      hasta: [null, [Validators.required]],
      fechaDesde: [null, [Validators.required]],
      fechaHasta: [null, [Validators.required]],
    });
  }

  onSubmit() {
    this.form.markAllAsTouched();
  }

  onTypeChange() {
    const controls = [this.initialRecord, this.finalRecord];
    const type = this.type.value;
    if (type === REPORT_TYPE.Confiscation) {
      controls.forEach(control => control.clearValidators());
    } else {
      controls.forEach(control => control.setValidators(Validators.required));
    }
    controls.forEach(control => {
      control.reset();
      control.updateValueAndValidity();
    });
  }
}
