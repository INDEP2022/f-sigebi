import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ClarificationService } from '../../../../core/services/catalogs/clarification.service';

@Component({
  selector: 'app-clarifications-detail',
  templateUrl: './clarifications-detail.component.html',
  styles: [],
})
export class ClarificationsDetailComponent implements OnInit {
  loading: boolean = false;
  status: string = 'Nueva';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  clarification: any;

  public get id() {
    return this.form.get('id');
  }

  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private clarificationService: ClarificationService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      id: [null, Validators.required],
      clarification: ['', Validators.required],
      type: [null, Validators.required],
      active: [null, Validators.required],
      version: [null, Validators.required],
    });
    if (this.edit) {
      this.status = 'Actualizar';
      this.form.patchValue(this.clarification);
      this.id.disable();
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  create() {
    this.loading = true;
    this.clarificationService.create(this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  handleSuccess() {
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }

  update() {
    this.loading = true;

    this.clarificationService
      .update(this.clarification.id, this.form.value)
      .subscribe(
        data => this.handleSuccess(),
        error => (this.loading = false)
      );
  }
}
