import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PurginRecordsForm } from '../../utils/purgin-records-form';

@Component({
  selector: 'app-purging-records-form',
  templateUrl: './purging-records-form.component.html',
  styles: [],
})
export class PurgingRecordsFormComponent implements OnInit {
  @Input() form: FormGroup<PurginRecordsForm>;
  @Output() onExpedientChange = new EventEmitter<string | number>();
  get formControls() {
    return this.form.controls;
  }

  constructor() {}

  ngOnInit(): void {}

  expedientChange() {
    const expedientId = this.formControls.id.value;
    if (expedientId) {
      this.onExpedientChange.emit(expedientId);
    }
  }
}
