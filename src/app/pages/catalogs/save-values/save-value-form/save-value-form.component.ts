import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/ModelForm';
import { ISaveValue } from 'src/app/core/models/catalogs/save-value.model';
import { SaveValueService } from 'src/app/core/services/catalogs/save-value.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-save-value-form',
  templateUrl: './save-value-form.component.html',
  styles: [],
})
export class SaveValueFormComponent extends BasePage implements OnInit {
  @Output() refresh = new EventEmitter<true>();
  saveValue: ISaveValue;
  edit: boolean;
  saveValueForm: ModelForm<ISaveValue>;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalRef,
    private saveValueService: SaveValueService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.saveValueForm = this.fb.group({
      cve: [null, [Validators.required]],
      description: [null, [Validators.required]],
      location: [null, [Validators.required]],
      responsible: [null, [Validators.required]],
      noRegistration: [null, [Validators.required]],
    });

    if (this.saveValue != null) {
      this.edit = true;
      this.saveValueForm.patchValue(this.saveValue);
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.saveValueService.create(this.saveValueForm.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  update() {
    this.saveValueService
      .update(this.saveValue.cve, this.saveValueForm.value)
      .subscribe(
        data => this.handleSuccess(),
        error => (this.loading = false)
      );
  }

  close() {
    this.modalService.hide();
  }

  handleSuccess() {
    this.loading = false;
    this.refresh.emit(true);
    this.modalService.hide();
  }
}
