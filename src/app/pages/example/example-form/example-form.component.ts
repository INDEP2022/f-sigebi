import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Example } from 'src/app/core/models/example';
import { ExampleService } from 'src/app/core/services/example.service';

@Component({
  selector: 'app-example-form',
  templateUrl: './example-form.component.html',
  styles: [],
})
export class ExampleFormComponent implements OnInit {
  title: string = 'Nuevo Parrafo';
  edit: boolean = false;
  @Output() refresh = new EventEmitter<true>();
  form: FormGroup = new FormGroup({});
  paragraph: Example;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private exampleService: ExampleService
  ) {}

  ngOnInit(): void {
    if (this.edit) this.title = 'Editar Parrafo';
    this.prepareForm();
  }

  private prepareForm(): void {
    const regEx: RegExp = /[a-zA-Z]((.|_|-)?[a-zA-ZáéíóúÁÉÍÓÚ\u0020]+){0,255}/;
    this.form = this.fb.group({
      paragraph: [null, [Validators.required]],
      version: [null, [Validators.required]],
      reportName: [null, [Validators.pattern(regEx), Validators.required]],
    });
    if (this.edit) this.form.patchValue(this.paragraph);
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create()
  }

  create() {
    this.exampleService.create(this.form.value).subscribe(
      (data) => this.handleSuccess(),
    );
  }

  update() {
    this.exampleService.update(this.paragraph.id, this.form.value).subscribe(
      (data) => this.handleSuccess()
    );
  }

  handleSuccess() {
    this.refresh.emit(true);
    this.modalRef.hide();
  }
}
