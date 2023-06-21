import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IAuthority2 } from 'src/app/core/models/catalogs/authority.model';
import { IStation2 } from 'src/app/core/models/catalogs/station.model';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUM_POSITIVE, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-cat-authority-modal',
  templateUrl: './cat-authority-modal.component.html',
  styles: [],
})
export class CatAuthorityModalComponent extends BasePage implements OnInit {
  authorityForm: ModelForm<IAuthority2>;
  authority: IAuthority2;

  idAuth: IStation2;

  title: string = 'AUTORIDAD';
  edit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private authorityService: AuthorityService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.authorityForm = this.fb.group({
      idAuthority: [null, []],
      idTransferer: [null, []],
      idStation: [null, []],
      cveUnique: [null, [Validators.pattern(NUM_POSITIVE)]],
      idCity: [
        null,
        [Validators.maxLength(30), Validators.pattern(STRING_PATTERN)],
      ],
      authorityName: [
        null,
        [Validators.maxLength(150), Validators.pattern(STRING_PATTERN)],
      ],
      status: [
        null,
        [Validators.maxLength(20), Validators.pattern(STRING_PATTERN)],
      ],
      codeStatus: [
        null,
        [Validators.maxLength(30), Validators.pattern(STRING_PATTERN)],
      ],
      cveStatus: [
        null,
        [Validators.maxLength(30), Validators.pattern(STRING_PATTERN)],
      ],
    });
    if (this.authority != null) {
      this.edit = true;
      this.authorityForm.patchValue(this.authority);
    } else {
      this.edit = false;
      this.authorityForm.controls['idTransferer'].setValue(
        this.idAuth.idTransferent
      );
      this.authorityForm.controls['idStation'].setValue(this.idAuth.id);
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
    this.authorityService.create2(this.authorityForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.authorityService.update2(this.authorityForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
