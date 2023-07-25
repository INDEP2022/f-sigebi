import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IComerTpEvent } from 'src/app/core/models/ms-event/event-type.model';
import { ComerTpEventosService } from 'src/app/core/services/ms-event/comer-tpeventos.service';
import { StatusDispService } from 'src/app/core/services/ms-status-disp/status-disp.service';
//import { IGoodsAvailableSale } from 'src/app/core/models/commercialization/goodsAvailableSale';
//import { GoodsAvailableSaleService } from 'src/app/core/services/ms-goods-available-sale/ms-goods-available-sale.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'goods-available-sale-form',
  templateUrl: './goods-available-sale-form.component.html',
  styles: [],
})
export class GoodsAvailableSaleFormComponent
  extends BasePage
  implements OnInit
{
  goodsAvailableSaleForm: ModelForm<any>;
  title: string = 'Estatus de bienes disponibles para comercializar';
  edit: boolean = false;
  goodsAvailable: any;
  addressList = new DefaultSelect<any>();
  typeEvents = new DefaultSelect<IComerTpEvent>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private comerTpEventosService: ComerTpEventosService,
    private statusDispService: StatusDispService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.addressList = new DefaultSelect([
      { value: 'M', description: 'Muebles' },
      { value: 'I', description: 'Inmuebles' },
      { value: 'R', description: 'Remesas' },
      { value: 'D', description: 'Disponibles' },
      { value: 'V', description: 'Validar SIRSAE' },
    ]);
  }
  //private goodsAvailableSaleService: GoodsAvailableSaleService
  private prepareForm() {
    this.goodsAvailableSaleForm = this.fb.group({
      idStatus: [null, [Validators.required]],
      idDirection: [null, [Validators.required]],
      description: [null, [Validators.pattern(STRING_PATTERN)]],
      idTypeEvent: [null, [Validators.required]],
    });
    if (this.goodsAvailable != null) {
      this.edit = true;
      this.goodsAvailableSaleForm.patchValue(this.goodsAvailable);
      this.getTypeEvent(
        new ListParams(),
        this.goodsAvailableSaleForm.get('idTypeEvent').value
      );
      this.goodsAvailableSaleForm.controls['idStatus'].disable();
      this.goodsAvailableSaleForm.controls['idDirection'].disable();
      this.goodsAvailableSaleForm.controls['idTypeEvent'].disable();
    }
    setTimeout(() => {
      this.getTypeEvent(new ListParams());
    }, 1000);
  }
  close() {
    this.modalRef.hide();
  }

  confirm() {
    console.log('Confirmar');
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.statusDispService
      .create(this.goodsAvailableSaleForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.statusDispService
      .update(this.goodsAvailableSaleForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }
  getTypeEvent(params: ListParams, id?: string) {
    if (id) {
      params['filter.id'] = `$eq:${id}`;
    }
    this.comerTpEventosService.getAllComerTpEvent(params).subscribe({
      next: data => {
        console.log(data);
        this.typeEvents = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.typeEvents = new DefaultSelect();
      },
    });
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
