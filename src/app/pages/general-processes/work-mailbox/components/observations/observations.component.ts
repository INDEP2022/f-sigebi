import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-observations',
  templateUrl: './observations.component.html',
  styles: [],
})
export class ObservationsComponent implements OnInit {
  loading: boolean = false;
  //edit: boolean = false;
  form: FormGroup = new FormGroup({});
  process: any;

  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private procedureManagementService: ProcedureManagementService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      observation: [
        null,
        [
          Validators.required,
          Validators.maxLength(1000),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
    });

    if (
      this.process.observation == 'null' ||
      this.process.observation == 'undefined'
    )
      this.process.observation = '';

    this.form.patchValue(this.process);
  }

  confirm() {
    this.update();
  }

  close() {
    this.modalRef.hide();
  }

  handleSuccess() {
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }

  update() {
    this.loading = true;

    this.loading = true;
    const processNumber = this.process.processNumber;

    this.procedureManagementService
      .update(processNumber, this.form.value)
      .subscribe(
        data => this.handleSuccess(),
        error => (this.loading = false)
      );
  }

  limit(limit: number, field: string, value: string) {
    if (String(value).length > limit) {
      this.form.get(field).patchValue(String(value).slice(0, limit));
    }
  }
}
