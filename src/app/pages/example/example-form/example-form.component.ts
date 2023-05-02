import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Example } from 'src/app/core/models/catalogs/example';
import { ExampleService } from 'src/app/core/services/catalogs/example.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-example-form',
  templateUrl: './example-form.component.html',
  styles: [],
})
export class ExampleFormComponent implements OnInit {
  loading: boolean = false;
  title: string = 'Nuevo Parrafo';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  paragraph: Example;
  items = new DefaultSelect<Example>();
  @Output() refresh = new EventEmitter<true>();
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
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.exampleService.create(this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  update() {
    this.loading = true;
    this.exampleService.update(this.paragraph.id, this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  handleSuccess() {
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }

  getFromSelect(params: ListParams) {
    this.exampleService.getAll(params).subscribe(data => {
      this.items = new DefaultSelect(data.data, data.count);
    });
  }
}
