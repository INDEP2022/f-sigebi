import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-payment-request-items',
  templateUrl: './payment-request-items.component.html',
  styles: [],
})
export class PaymentRequestItemsComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  formCabms: FormGroup = new FormGroup({});
  formGoods: FormGroup = new FormGroup({});
  partida: any = null;

  status: string = 'Nueva';
  edit: boolean = false;
  title: string = 'Partida';

  @Output() data = new EventEmitter<{}>();

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getTotal();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      amountR: [null, [Validators.required]],
      taxes: [null, [Validators.required]],
      withholdingTax: [null, [Validators.required]],
      withholdingIncomeTax: [null, [Validators.required]],
      total: [null, [Validators.required]],
      /**NO DATA IN THE SERVER--IT IS REQUIRED**/
      transferent: [null],
    });

    this.formCabms = this.fb.group({
      cabms: [null, [Validators.required]],
      category: [null, [Validators.required]],
      itemDescription: [null, [Validators.required]],
      partId: [null, [Validators.required]],
      opcode: [null, [Validators.required]],
      opDescription: [null, [Validators.required]],
    });

    this.formGoods = this.fb.group({
      goodId: [null, [Validators.required]],
      goodDescription: [null, [Validators.required]],
    });

    if (this.edit) {
      this.status = 'Actualizar';
      this.form.patchValue({
        amountR: this.partida.amountR,
        taxes: this.partida.taxes,
        withholdingTax: this.partida.withholdingTax,
        withholdingIncomeTax: this.partida.withholdingIncomeTax,
        total: this.partida.total,
      });

      this.formCabms.patchValue({
        cabms: this.partida.cabms,
        category: this.partida.category,
        itemDescription: this.partida.itemDescription,
        partId: this.partida.partId,
        opcode: this.partida.opcode,
        opDescription: this.partida.opDescription,
      });

      this.formGoods.patchValue({
        goodId: this.partida.goodId,
        goodDescription: this.partida.goodDescription,
      });
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    let data = {
      ...this.form.value,
      ...this.formCabms.value,
      ...this.formGoods.value,
    };
    this.data.emit(data);
    this.modalRef.hide();
  }

  getTotal(): void {
    this.form.controls['amountR'].valueChanges.subscribe(value => {
      let amount = this.form.controls['amountR'].value;
      let taxes = this.form.controls['taxes'].value;
      let withholdingTax = this.form.controls['withholdingTax'].value;
      let withholdingIncomeTax =
        this.form.controls['withholdingIncomeTax'].value;
      let total = amount + taxes + withholdingTax + withholdingIncomeTax;
      this.form.controls['total'].setValue(total);
    });

    this.form.controls['taxes'].valueChanges.subscribe(value => {
      let amount = this.form.controls['amountR'].value;
      let taxes = this.form.controls['taxes'].value;
      let withholdingTax = this.form.controls['withholdingTax'].value;
      let withholdingIncomeTax =
        this.form.controls['withholdingIncomeTax'].value;
      let total = amount + taxes + withholdingTax + withholdingIncomeTax;
      this.form.controls['total'].setValue(total);
    });

    this.form.controls['withholdingTax'].valueChanges.subscribe(value => {
      let amount = this.form.controls['amountR'].value;
      let taxes = this.form.controls['taxes'].value;
      let withholdingTax = this.form.controls['withholdingTax'].value;
      let withholdingIncomeTax =
        this.form.controls['withholdingIncomeTax'].value;
      let total = amount + taxes + withholdingTax + withholdingIncomeTax;
      this.form.controls['total'].setValue(total);
    });

    this.form.controls['withholdingIncomeTax'].valueChanges.subscribe(value => {
      let amount = this.form.controls['amountR'].value;
      let taxes = this.form.controls['taxes'].value;
      let withholdingTax = this.form.controls['withholdingTax'].value;
      let withholdingIncomeTax =
        this.form.controls['withholdingIncomeTax'].value;
      let total = amount + taxes + withholdingTax + withholdingIncomeTax;
      this.form.controls['total'].setValue(total);
    });
  }
}
