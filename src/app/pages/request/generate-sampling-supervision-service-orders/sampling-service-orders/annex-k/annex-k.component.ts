import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { SignatoriesService } from 'src/app/core/services/ms-electronicfirm/signatories.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { ShowReportComponentComponent } from '../../../programming-request-components/execute-reception/show-report-component/show-report-component.component';

@Component({
  selector: 'app-annex-k',
  templateUrl: './annex-k.component.html',
  styles: [],
})
export class AnnexKComponent extends BasePage implements OnInit {
  annexKForm: ModelForm<any>;
  //participantsDataForm: ModelForm<any>;
  typeAnnex: string = '';
  annexData: any = null;

  private wContent = inject(WContentService);
  private orderService = inject(OrderServiceService);
  private signatoriesService = inject(SignatoriesService);

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private bsModalRef: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('tipo anexo', this.typeAnnex);
    console.log('anexo data', this.annexData);
    this.initSignDataForm();
    //this.initParticipantsData();
  }

  initSignDataForm() {
    this.annexKForm = this.fb.group({
      responsiblesae: [null, [Validators.pattern(STRING_PATTERN)]],
      postsae: [null, [Validators.pattern(STRING_PATTERN)]],
      competitor1: [null, [Validators.pattern(STRING_PATTERN)]],
      postCompetitor1: [null, [Validators.pattern(STRING_PATTERN)]],
      competitor2: [null, [Validators.pattern(STRING_PATTERN)]],
      postCompetitor2: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  async signAnnex() {
    console.log(this.annexKForm.value);
    let typeDoc = 0;
    if (this.typeAnnex == 'generate-query') typeDoc = 197;

    const form = this.annexKForm.value;
    form.idSamplingOrder = this.annexData.idSamplingOrder;
    const samplerOrder: any = await this.getSampleOrder();
    const updateOrdServ = this.orderService.updateSampleOrder(form);
    const signForm = {
      learnedType: typeDoc,
      learnedId: this.annexData.idSamplingOrder,
      name: form.responsiblesae,
      post: form.postsae,
    };
    const insertSign = this.signatoriesService.create(signForm);

    forkJoin({ ordeServ: updateOrdServ, sign: insertSign }).subscribe(
      ({ ordeServ, sign }) => {
        const idSampleOrder = this.annexData.idSamplingOrder;
        //this.openModal(PrintReportModalComponent,typeDoc,idOrderService,'', this.typeAnnex);
        let config: ModalOptions = {
          initialState: {
            idSampleOrder: +idSampleOrder,
            idTypeDoc: typeDoc,
            typeFirm: 'electronica',
            idRegionalDelegation: +samplerOrder.idDelegationRegional,
            annexk: true,
            callback: (next: boolean) => {
              if (next) {
                this.close();
              }
            },
          },
          class: 'modal-lg modal-dialog-centered',
          ignoreBackdropClick: true,
        };
        this.modalService.show(ShowReportComponentComponent, config);
      },
      error => {
        console.log(error);
        this.onLoadToast('error', 'No se pudo guardar los datos');
      }
    );
    /* const idSampleOrder = this.annexData.idSamplingOrder;
    let config: ModalOptions = {
      initialState: {
        idSampleOrder: +idSampleOrder,
        idTypeDoc: typeDoc,
        typeFirm: 'electronica',
        idRegionalDelegation: +samplerOrder.idDelegationRegional,
        annexk:true,
        //programming: this.programming,
        callback: (next: boolean) => {
          if (next) {
            this.close();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ShowReportComponentComponent, config); */
  }

  close() {
    this.bsModalRef.hide();
  }

  openModal(
    component: any,
    idTypeDoc: number,
    idReportAclara: any,
    data?: any,
    typeAnnex?: string
  ) {
    let config: ModalOptions = {
      initialState: {
        idTypeDoc: idTypeDoc,
        idReportAclara: idReportAclara,
        data: data,
        typeAnnex: typeAnnex,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(component, config);
  }

  getSampleOrder() {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params[
        'filter.idSamplingOrder'
      ] = `$eq:${this.annexData.idSamplingOrder}`;
      this.orderService.getAllSampleOrder(params).subscribe({
        next: resp => {
          resolve(resp.data[0]);
        },
        error: error => {
          console.log('error', error);
          this.onLoadToast('error', 'No se puede obtene la orden de servicio');
          reject(error);
        },
      });
    });
  }
}
