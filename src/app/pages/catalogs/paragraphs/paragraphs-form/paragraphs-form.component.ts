import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IParagraph } from './../../../../core/models/catalogs/paragraph.model';
import { ParagraphService } from './../../../../core/services/catalogs/paragraph.service';

@Component({
  selector: 'app-paragraphs-form',
  templateUrl: './paragraphs-form.component.html',
  styles: [],
})
export class ParagraphsFormComponent extends BasePage implements OnInit {
  paragraphForm: FormGroup = new FormGroup({});
  title: string = 'Párrafo';
  edit: boolean = false;
  paragraph: IParagraph;
  items = new DefaultSelect<IParagraph>();
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private paragraphService: ParagraphService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.paragraphForm = this.fb.group({
      paragraph: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      reportName: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      version: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(10),
        ],
      ],
    });
    if (this.paragraph != null) {
      this.edit = true;
      console.log(this.paragraph);
      this.paragraphForm.patchValue(this.paragraph);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (
      this.paragraphForm.controls['paragraph'].value.trim() == '' ||
      this.paragraphForm.controls['reportName'].value.trim() == '' ||
      this.paragraphForm.controls['version'].value.trim() == '' ||
      (this.paragraphForm.controls['paragraph'].value.trim() == '' &&
        this.paragraphForm.controls['reportName'].value.trim() == '' &&
        this.paragraphForm.controls['version'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.paragraphService.create(this.paragraphForm.value).subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
    }
  }

  update() {
    if (
      this.paragraphForm.controls['paragraph'].value.trim() == '' ||
      this.paragraphForm.controls['reportName'].value.trim() == '' ||
      this.paragraphForm.controls['version'].value.trim() == '' ||
      (this.paragraphForm.controls['paragraph'].value.trim() == '' &&
        this.paragraphForm.controls['reportName'].value.trim() == '' &&
        this.paragraphForm.controls['version'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.paragraphService
        .update(this.paragraph.id, this.paragraphForm.value)
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    //this.refresh.emit(true);
    this.modalRef.hide();
  }
}
