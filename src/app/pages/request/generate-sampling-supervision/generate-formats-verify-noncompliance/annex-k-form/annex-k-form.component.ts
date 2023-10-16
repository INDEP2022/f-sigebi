import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ISamplingOrder } from 'src/app/core/models/ms-order-service/sampling-order.model';
import { SignatoriesService } from 'src/app/core/services/ms-electronicfirm/signatories.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { ShowReportComponentComponent } from '../../../programming-request-components/execute-reception/show-report-component/show-report-component.component';
import { UploadReportReceiptComponent } from '../../../programming-request-components/execute-reception/upload-report-receipt/upload-report-receipt.component';

@Component({
  selector: 'app-annex-k-form',
  templateUrl: './annex-k-form.component.html',
  styleUrls: ['./annex-k-form.component.scss'],
})
export class AnnexKFormComponent extends BasePage implements OnInit {
  annexForm: ModelForm<any>;
  typeAnnex: string = '';
  readonly: boolean = false;
  annexData: any = null;

  private orderService = inject(OrderServiceService);
  private signatoriesService = inject(SignatoriesService);

  constructor(
    private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(this.typeAnnex);
    this.readonly = true;
    this.initDetailForm();

    this.setDataParicipants();
  }

  initDetailForm(): void {
    this.annexForm = this.fb.group({
      idSamplingOrder: [null],
      supplierk: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      postSupplierk: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      guySignatureSupplierk: [null, Validators.required],
      competitor1: [null, [Validators.pattern(STRING_PATTERN)]],
      postCompetitor1: [null, [Validators.pattern(STRING_PATTERN)]],
      competitor2: [null, [Validators.pattern(STRING_PATTERN)]],
      postCompetitor2: [null, [Validators.pattern(STRING_PATTERN)]],
      nameManagersoul: [null, [Validators.pattern(STRING_PATTERN)]],
      factsrelevant: [null, [Validators.pattern(STRING_PATTERN)]],
      agreements: [null, [Validators.pattern(STRING_PATTERN)]],
      daterepService: [null, [Validators.pattern(STRING_PATTERN)]],
    });

    this.annexForm
      .get('idSamplingOrder')
      .setValue(this.annexData.idSamplingOrder);
  }

  displayDetailAnnex(): boolean {
    if (
      this.typeAnnex === 'annexK-restitution-of-assets' ||
      this.typeAnnex === 'revition-results'
    ) {
      return false;
    } else {
      return true;
    }
  }

  signAnnex(): void {
    let typeDoc = 0;
    const form = this.annexForm.getRawValue();
    let body: any = {};
    for (const key in form) {
      if (form[key] != null) {
        body[key] = form[key];
      }
    }
    if (
      this.typeAnnex === 'annexK-restitution-of-assets' ||
      this.typeAnnex === 'revition-results'
    ) {
      typeDoc = 197;
      const typesign =
        this.annexForm.get('guySignatureSupplierk').value == 'Y'
          ? 'electronica'
          : 'autografa';
      const samplerOrder = this.annexData;
      /*const updateOrdServ = this.orderService.updateSampleOrder(body);
      const signForm = {
        learnedType: typeDoc,
        learnedId: this.annexData.idSamplingOrder,
        name: form.supplierk,
        post: form.postSupplierk,
      };
      const insertSign = this.signatoriesService.create(signForm);

      forkJoin({ ordeServ: updateOrdServ, sign: insertSign }).subscribe(
        ({ ordeServ, sign }) => {
          const idSampleOrder = this.annexData.idSamplingOrder;
          let config: ModalOptions = {
            initialState: {
              idSampleOrder: +idSampleOrder,
              idTypeDoc: typeDoc,
              typeFirm: typesign,
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
      );*/
      //this.openModal(PrintReportRestitutionModalComponent, '', this.typeAnnex);
      const idSampleOrder = +this.annexData.idSamplingOrder;
      this.openModal(
        ShowReportComponentComponent,
        idSampleOrder,
        typeDoc,
        typesign,
        samplerOrder.idDelegationRegional
      );
    } else {
      //this.openModal(PrintReportModalComponent, '', this.typeAnnex);
    }
    this.close();
  }

  close(): void {
    this.bsModalRef.hide();
  }

  openModal(
    component: any,
    idSampleOrder: number,
    typeDoc: number,
    typesign: string,
    delegation: number
  ): void {
    let config: ModalOptions = {
      initialState: {
        idSampleOrder: idSampleOrder,
        idTypeDoc: typeDoc,
        typeFirm: typesign,
        idRegionalDelegation: delegation,
        annexk: true,
        callback: (next: boolean, typeSign: any) => {
          if (next) {
            if (typeSign == 'autografa') {
              this.openAutografoModal(this.annexData);
            }
            this.close();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(component, config);

    //this.bsModalRef.content.event.subscribe((res: any) => {
    //cargarlos en el formulario
    //console.log(res);
    //this.assetsForm.controls['address'].get('longitud').enable();
    //this.requestForm.get('receiUser').patchValue(res.user);
    //});
  }

  openAutografoModal(sampleOrder: ISamplingOrder) {
    let config: ModalOptions = {
      initialState: {
        typeDoc: 197,
        sampleOrder: sampleOrder,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modalSizeXL modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(UploadReportReceiptComponent, config);
  }

  async setDataParicipants() {
    //const sampleOrder: any = await this.getSampleOrder();
    const sampleOrder: any = this.annexData;
    this.annexForm.get('competitor1').setValue(sampleOrder.competitor1);
    this.annexForm.get('postCompetitor1').setValue(sampleOrder.postCompetitor1);
    this.annexForm.get('competitor2').setValue(sampleOrder.competitor2);
    this.annexForm.get('postCompetitor2').setValue(sampleOrder.postCompetitor2);
  }
}
