import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodSubType } from 'src/app/core/models/catalogs/good-subtype.model';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-good-subtype-form',
  templateUrl: './good-subtype-form.component.html',
  styles: [],
})
export class GoodSubtypeFormComponent extends BasePage implements OnInit {
  goodSubtypeForm: FormGroup = new FormGroup({});
  title: string = 'Subtipo Bien';
  edit: boolean = false;
  goodSubtype: IGoodSubType;
  types = new DefaultSelect<IGoodType>();
  @Output() refresh = new EventEmitter<true>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private goodSubtypeService: GoodSubtypeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.goodSubtypeForm = this.fb.group({
      id: [null, [Validators.required]],
      idTypeGood: [null, [Validators.required]],
      nameSubtypeGood: [null, [Validators.required, Validators.maxLength(70)]],
      descriptionPhotography: [
        null,
        [Validators.required, Validators.maxLength(500)],
      ],
      noPhotography: [null, [Validators.required]],
      noRegister: [null, [Validators.required]],
      version: [null, [Validators.required]],
    });
    if (this.goodSubtype != null) {
      this.edit = true;
      this.goodSubtypeForm.patchValue(this.goodSubtype);
    }
  }

  patchForm() {
    if (this.goodSubtype.idTypeGood.id) {
    }
  }

  getTypes(params: ListParams) {
    this.goodSubtypeService.getTypes(params).subscribe(data => {
      this.types = new DefaultSelect(data.data, data.count);
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.goodSubtypeService.create(this.goodSubtypeForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.goodSubtypeService
      .update(this.goodSubtype.id, this.goodSubtypeForm.value)
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
