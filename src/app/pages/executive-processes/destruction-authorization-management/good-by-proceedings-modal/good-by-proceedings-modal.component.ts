import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IDetailProceedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/detail-proceedings-delivery-reception.model';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-good-by-proceedings-modal',
  templateUrl: './good-by-proceedings-modal.component.html',
  styles: [],
})
export class GoodByProceedingsModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'BIENES POR ACTA';
  edit: boolean = false;

  detailProceedingsForm: ModelForm<IDetailProceedingsDeliveryReception>;
  form: FormGroup = new FormGroup({});
  detailProceedings: IDetailProceedingsDeliveryReception;

  goods = new DefaultSelect();
  goodValue: IGood;

  idP: IProccedingsDeliveryReception;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private router: Router,
    private goodService: GoodService,
    private detailProceeDelRecService: DetailProceeDelRecService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.detailProceedingsForm = this.fb.group({
      numberGood: [null, [Validators.required]],
      quantity: [null, []],
      numberProceedings: [null, [Validators.required]],
    });
    this.detailProceedingsForm.controls['numberProceedings'].setValue(
      this.idP.id
    );

    this.form = this.fb.group({
      description: [null, []],
    });
  }

  //Trae todos los bienes con estado PDS

  getGoodByStatusPDS(params: ListParams) {
    this.goodService.getGoodByStatusPDSelect(params).subscribe({
      next: data => (this.goods = new DefaultSelect(data.data, data.count)),
    });
  }

  //Al seleccionar un item del select dinámico se autorellenan los inputs siguientes
  onValuesChange(goodChange: IGood) {
    console.log(goodChange);
    this.goodValue = goodChange;
    this.form.controls['description'].setValue(goodChange.description);
    this.detailProceedingsForm.controls['quantity'].setValue(
      goodChange.quantity
    );
    this.goods = new DefaultSelect();
  }

  //Alerta para indicar que se redirigirá al rastreador de bienes
  tracker() {
    this.alertQuestion(
      'question',
      'Precaución',
      'Se abrirá otra pantalla para insertar vía rastreador. ¿Desea continuar?'
    ).then(question => {
      if (question.isConfirmed) {
        this.modalRef.hide();
        this.alert('success', 'Listo', 'Se redirigió');
        this.router.navigateByUrl('/pages/general-processes/goods-tracker');
      }
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.loading = true;
    this.detailProceeDelRecService
      .addGoodToProceedings(this.detailProceedingsForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
