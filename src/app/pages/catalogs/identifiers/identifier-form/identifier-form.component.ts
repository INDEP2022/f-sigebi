import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/ModelForm';
import { IIdentifier } from 'src/app/core/models/catalogs/identifier.model';
import { IdentifierService } from 'src/app/core/services/catalogs/identifier.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-identifier-form',
  templateUrl: './identifier-form.component.html',
  styles: [],
})
export class IdentifierFormComponent extends BasePage implements OnInit {
  identifier: IIdentifier;
  edit: boolean = false;
  identifierForm: ModelForm<IIdentifier>;
  @Output() refresh = new EventEmitter<true>();
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalRef,
    private identifierService: IdentifierService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.identifierForm = this.fb.group({
      code: [null, [Validators.required]],
      description: [null, [Validators.required]],
      keyview: [
        null,
        [Validators.required, Validators.minLength(1), Validators.maxLength(1)],
      ],
      noRegistration: [null, [Validators.required]],
    });

    if (this.identifier != null) {
      this.edit = true;
      this.identifierForm.patchValue(this.identifier);
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.identifierService.create(this.identifierForm.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  update() {
    this.identifierService
      .update(this.identifier.code, this.identifierForm.value)
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
