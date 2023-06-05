import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-modal-c-p-mta-c-maximum-times-for-abandonment',
  templateUrl: './modal-c-p-mta-c-maximum-times-for-abandonment.html',
  styles: [],
})
export class ModalCPMtaCMaximumTimesForAbandonmentComponent
  extends BasePage
  implements OnInit
{
  title: string = 'TIPO DE SINIESTRO';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  allotment: any;
  lengthData = 0;
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private goodTypeServ: GoodTypeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      keyClaims: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });
    if (this.allotment != null) {
      this.edit = true;
      console.log(this.allotment);
      this.form.patchValue(this.allotment);
    }
  }

  PutClaim() {
    const body = {
      id: this.allotment.id,
      description: this.form.get('description').value,
      flag: this.form.get('keyClaims').value,
    };

    // this.goodTypeServ.update(this.allotment.id, body).subscribe({
    //   next: (resp: any) => {
    //     if (resp) {
    //       this.handleSuccess(), this.refresh.emit(true);
    //       this.close();
    //     }
    //   },
    // });
  }

  postClaim() {
    const body = {
      id: String(this.lengthData),
      description: this.form.get('description').value,
      flag: this.form.get('keyClaims').value,
    };

    // this.goodTypeServ.create(body).subscribe({
    //   next: (resp: any) => {
    //     if (resp) {
    //       this.handleSuccess(), this.refresh.emit(true);
    //       this.close();
    //     }
    //   },
    // });
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    // this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
  close() {
    this.modalRef.hide();
  }
}
