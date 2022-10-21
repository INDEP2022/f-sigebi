import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IImageMedia } from '../../../../core/models/catalogs/image-media.model';
import { ImageMediaService } from '../../../../core/services/catalogs/image-media.service';

@Component({
  selector: 'app-image-media-form',
  templateUrl: './image-media-form.component.html',
  styles: [],
})
export class ImageMediaFormComponent extends BasePage implements OnInit {
  imageMediaForm: FormGroup = new FormGroup({});
  title: string = 'Medio Imagen';
  edit: boolean = false;
  imageMedia: IImageMedia;
  items = new DefaultSelect<IImageMedia>();
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private imageMediaService: ImageMediaService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.imageMediaForm = this.fb.group({
      route: [null, [Validators.required]],
      status: [null, [Validators.required, Validators.maxLength(1)]],
    });
    if (this.imageMedia != null) {
      this.edit = true;
      console.log(this.imageMedia);
      this.imageMediaForm.patchValue(this.imageMedia);
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
    this.imageMediaService.create(this.imageMediaForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.imageMediaService
      .update(this.imageMedia.id, this.imageMediaForm.value)
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
