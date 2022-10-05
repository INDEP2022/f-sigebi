import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/ModelForm';
import { IIndiciados } from 'src/app/core/models/catalogs/indiciados.model';
import { IndiciadosService } from 'src/app/core/services/catalogs/indiciados.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-indicated-form',
  templateUrl: './indicated-form.component.html',
  styles: [
  ]
})
export class IndicatedFormComponent extends BasePage implements OnInit {

  indicated: IIndiciados;
  edit: boolean = false;
  indicatedForm: ModelForm<IIndiciados>;
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalRef,
    private indicatedService: IndiciadosService
  ) {
    super();
   }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm(){
    this.indicatedForm = this.fb.group({
      name: [null, [Validators.required]],
      noRegistration: [null, [Validators.required]],
      curp: [null, [Validators.required]],
      consecutive: [null, [Validators.required]],
    });

    if(this.indicated != null){
      this.edit = true;
      this.indicatedForm.patchValue(this.indicated)
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.indicatedService.create(this.indicatedForm.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  update() {
    this.indicatedService
      .update(this.indicated.id, this.indicatedForm.value)
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
