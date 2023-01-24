import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IPhotographMedia } from '../../../../core/models/catalogs/photograph-media.model';
import { PhotographMediaService } from '../../../../core/services/catalogs/photograph-media.service';

@Component({
  selector: 'app-photograph-media-form',
  templateUrl: './photograph-media-form.component.html',
  styles: [],
})
export class PhotographMediaFormComponent extends BasePage implements OnInit {
  photographMediaForm: FormGroup = new FormGroup({});
  title: string = 'Medio Fotográfico';
  edit: boolean = false;
  photographMedia: IPhotographMedia;
  items = new DefaultSelect<IPhotographMedia>();
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private photographMediaService: PhotographMediaService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.photographMediaForm = this.fb.group({
      route: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      status: [null, [Validators.required, Validators.maxLength(1)]],
    });
    if (this.photographMedia != null) {
      this.edit = true;
      console.log(this.photographMedia);
      this.photographMediaForm.patchValue(this.photographMedia);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.photographMediaService
      .create(this.photographMediaForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.photographMediaService
      .update(this.photographMedia.id, this.photographMediaForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }
}
