import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS } from './columns';
//Provisional Data
import { data } from './bienStatusData';
//Components
import { PaGspCGoodsServicePaymentComponent } from '../goods-service-payments/pa-gsp-c-goods-service-payment.component';

@Component({
  selector: 'app-pa-gsp-c-global-service-payment',
  templateUrl: './pa-gsp-c-global-service-payment.component.html',
  styles: [],
})
export class PaGspCGlobalServicePaymentComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  settings = {
    ...TABLE_SETTINGS,
    actions: false,
  };

  data: any[] = data;

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  requestId: string;
  serviceId: string = 'service3921dajk';
  globalAmount: number = 20005000.0;
  paymentDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getGlobal();
    /*this.form.get("pb_type").valueChanges.subscribe(x => {
      console.log(x)
       this.filter(x);
    });*/
  }

  getGlobal(): void {
    const id = this.route.snapshot.paramMap.get('requestId');
    if (id) {
      //Call Service
      this.requestId = id;
    } else {
    }
  }
  private prepareForm(): void {
    this.form = this.fb.group({
      applicationDate: [null, [Validators.required]],
      pb_type: ['pb_lista', [Validators.required]],
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  openModal(context?: Partial<PaGspCGoodsServicePaymentComponent>): void {
    const modalRef = this.modalService.show(
      PaGspCGoodsServicePaymentComponent,
      {
        //initialState: {/**/},
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );

    modalRef.content.data.subscribe(data => {
      if (data) {
        /*...*/
      }
    });
  }
}
