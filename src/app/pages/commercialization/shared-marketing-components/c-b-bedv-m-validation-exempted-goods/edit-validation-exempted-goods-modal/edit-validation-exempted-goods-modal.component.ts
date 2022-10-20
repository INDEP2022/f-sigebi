import { Component, EventEmitter, OnInit, Output } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-edit-validation-exempted-goods-modal',
  templateUrl: './edit-validation-exempted-goods-modal.component.html',
  styles: [
  ]
})
export class EditValidationExemptedGoodsModalComponent extends BasePage implements OnInit {

  form : FormGroup = new FormGroup({});
  allotment: any;
  title: string = 'Bienes Exentos de validación';
  edit: boolean = false;
  @Output() refresh = new EventEmitter<true>();

  constructor(private modalRef: BsModalRef, private fb : FormBuilder) {
    super();
  }
  
  
  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(){
    this.form = this.fb.group({
      noBien: [{value:null, disabled:true}],
      unit: [{value:null, disabled:true}],
      proccess : [null, [Validators.required]],
      description: [{value:null, disabled:true}],
    });
    if (this.allotment != null) {
      this.edit = true;
      console.log(this.allotment);
      this.form.patchValue(this.allotment);
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
    this.handleSuccess();
  }

  update() {
    this.loading = true;
    this.handleSuccess();
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }

}
