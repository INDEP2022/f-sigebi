import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IIndiciados } from 'src/app/core/models/catalogs/indiciados.model';
import { IndiciadosService } from 'src/app/core/services/catalogs/indiciados.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  RFCCURP_PATTERN,
  STRING_PATTERN,
} from '../../../../../../core/shared/patterns';

@Component({
  selector: 'app-doc-reception-indicated-form',
  templateUrl: './indicated-form.component.html',
  styles: [],
})
export class IDocReceptionndicatedFormComponent
  extends BasePage
  implements OnInit
{
  indicatedForm: ModelForm<IIndiciados>;
  @Output() onSave = new EventEmitter<IIndiciados>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private indicatedService: IndiciadosService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.indicatedForm = this.fb.group({
      name: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      noRegistration: [null],
      curp: [null, [Validators.required, Validators.pattern(RFCCURP_PATTERN)]],
      consecutive: [null],
    });
  }

  confirm() {
    this.create();
  }

  create() {
    this.loading = true;
    this.indicatedService.create(this.indicatedForm.value).subscribe({
      next: data => this.handleSuccess(data),
      error: error => (this.loading = false),
    });
  }

  close() {
    this.modalRef.hide();
  }

  handleSuccess(data: IIndiciados) {
    this.loading = false;
    this.onSave.emit(data);
    this.modalRef.hide();
  }
}
