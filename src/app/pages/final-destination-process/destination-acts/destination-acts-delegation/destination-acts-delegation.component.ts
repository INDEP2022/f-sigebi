import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IGood } from 'src/app/core/models/ms-good/good';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-destination-acts-delegation',
  templateUrl: './destination-acts-delegation.component.html',
  styles: [],
})
export class DestinationActsDelegationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  bsModalRef?: BsModalRef;
  refresh: boolean = false;
  good: IGood;
  constructor(
    private fb: FormBuilder,
    private service: DelegationService,
    private modalRef: BsModalRef,
    private goodService: GoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  onSubmit() {}

  prepareForm() {
    this.form = this.fb.group({
      delegationNumber: [null, Validators.required],
      subDelegationNumber: [null, Validators.required],
    });
    this.form.patchValue(this.good);
  }
  close() {
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  update() {
    const good: IGood = {};
    console.log(this.form.value);
    const { subDelegationNumber, delegationNumber } = this.form.value;
    console.error(subDelegationNumber);
    good.subDelegationNumber = subDelegationNumber;
    good.delegationNumber = delegationNumber;
    good.id = this.good.id;
    good.goodId = this.good.goodId;
    console.log(good);
    this.goodService.update(good).subscribe({
      next: res => {
        this.alert(
          'success',
          'Actas de Destino de Bienes',
          'Se ha actualizado el registro correctamente'
        );
        this.close();
      },
      error: err => {
        this.alert(
          'error',
          'Actas de Destino de Bienes',
          'Ha ocurrido un error al actualizar el registro'
        );
      },
    });
  }

  onDelegationsChange(event: any) {}
}
