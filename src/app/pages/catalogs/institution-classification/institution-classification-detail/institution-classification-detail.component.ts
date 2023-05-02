import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { InstitutionClasificationService } from 'src/app/core/services/catalogs/institution-classification.service';

@Component({
  selector: 'app-institution-classification-detail',
  templateUrl: './institution-classification-detail.component.html',
  styles: [],
})
export class InstitutionClassificationDetailComponent implements OnInit {
  loading: boolean = false;
  status: string = 'Nueva';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  institution: any;

  public get id() {
    return this.form.get('id');
  }

  @Output() refresh = new EventEmitter<true>();
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private institutionService: InstitutionClasificationService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      id: [null],
      description: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
          Validators.pattern(''),
        ]),
      ],
      numRegister: [
        null,
        Validators.compose([Validators.minLength(1), Validators.pattern('')]),
      ],
    });
    if (this.edit) {
      this.status = 'Actualizar';
      this.form.patchValue(this.institution);
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
    this.institutionService.create(this.form.value).subscribe(
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

    this.institutionService.newUpdate(this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }
}
