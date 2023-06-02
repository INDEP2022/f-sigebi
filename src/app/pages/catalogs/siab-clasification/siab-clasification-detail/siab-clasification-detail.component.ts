import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ISiabClasification } from 'src/app/core/models/catalogs/siab-clasification.model';
import { SIABClasificationService } from 'src/app/core/services/catalogs/siab-clasification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-siab-clasification-detail',
  templateUrl: './siab-clasification-detail.component.html',
  styles: [],
})
export class SiabClasificationDetailComponent
  extends BasePage
  implements OnInit
{
  siabClasificationform: FormGroup;
  title: string = 'CLASIFICACIÓN SIAB';
  edit: boolean = false;
  siabClasification: ISiabClasification;
  clasification: any;

  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private sIABClasificationService: SIABClasificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    if (this.siabClasification != null) {
      this.edit = true;
      this.siabClasificationform.patchValue(this.siabClasification);
    }
  }

  prepareForm() {
    this.siabClasificationform = this.fb.group({
      id: [null, [Validators.pattern(STRING_PATTERN)]],
      typeId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      typeDescription: [null, [Validators.pattern(STRING_PATTERN)]],
      subtypeId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      subtypeDescription: [null, [Validators.pattern(STRING_PATTERN)]],
      ssubtypeId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      ssubtypeDescription: [null, [Validators.pattern(STRING_PATTERN)]],
      sssubtypeId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      sssubtypeDescription: [null, [Validators.pattern(STRING_PATTERN)]],
      creationUser: [null, [Validators.pattern(STRING_PATTERN)]],
      editionUser: [null, [Validators.pattern(STRING_PATTERN)]],
      version: [null, [Validators.pattern(STRING_PATTERN)]],
    });

    if (this.clasification != null) {
      this.edit = true;
      this.siabClasificationform.patchValue(this.clasification);
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
    this.sIABClasificationService
      .create(this.siabClasificationform.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.sIABClasificationService
      .updateCatalogSiabClasification(
        this.clasification.id,
        this.siabClasificationform.value
      )
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
