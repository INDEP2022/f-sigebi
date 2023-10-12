import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISignatories } from 'src/app/core/models/ms-electronicfirm/signatories-model';
import { ISample } from 'src/app/core/models/ms-goodsinv/sample.model';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { BasePage } from '../../../../../core/shared/base-page';
import { AnnexKFormComponent } from '../../generate-formats-verify-noncompliance/annex-k-form/annex-k-form.component';
import { AnnexJAssetsClassificationComponent } from '../annex-j-assets-classification/annex-j-assets-classification.component';

@Component({
  selector: 'app-assets-classification',
  templateUrl: './assets-classification.component.html',
  styleUrls: ['./assets-classification.component.scss'],
})
export class AssetsClassificationComponent extends BasePage implements OnInit {
  title: string = `Clasificación de bienes ${302}`;
  showSamplingDetail: boolean = true;
  showFilterAssets: boolean = true;
  willSave: boolean = true;
  sampleInfo: ISample;
  idSample: number = 0;
  filterObject: any;
  constructor(
    private modalService: BsModalService,
    private bsModalRef: BsModalRef,
    private samplingGoodService: SamplingGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.idSample = 302;
    this.getInfoSample();
  }

  getInfoSample() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.sampleId'] = `$eq:${302}`;
    this.samplingGoodService.getSample(params.getValue()).subscribe({
      next: response => {
        console.log('sampledsa', response);
        this.sampleInfo = response.data[0];
      },
    });
  }

  turnSampling() {
    let message =
      '¿Esta de acuerdo que la información es correcta para Turnar?';
    this.alertQuestion(
      undefined,
      'Confirmación turnado',
      message,
      'Aceptar'
    ).then(question => {
      if (question.isConfirmed) {
        console.log('enviar mensaje');
      }
    });
  }

  save() {}

  openAnnexJ() {
    this.openModal(
      AnnexJAssetsClassificationComponent,
      this.idSample,
      'annexJ-assets-classification'
    );
  }

  opemAnnexK() {
    this.openModal(AnnexKFormComponent, '', 'annexK-assets-classification');
  }

  getSearchForm(searchForm: any) {
    this.filterObject = searchForm;
  }

  openModal(component: any, idSample?: any, typeAnnex?: string): void {
    let config: ModalOptions = {
      initialState: {
        idSample: idSample,
        typeAnnex: typeAnnex,
        callback: async (next: boolean, signatureInfo: ISignatories) => {
          if (next) {
            console.log('signature', signatureInfo);
            const validateSignature = await this.checkRegSignature(
              signatureInfo
            );
          }
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(component, config);

    //this.bsModalRef.content.event.subscribe((res: any) => {
    //cargarlos en el formulario
    //console.log(res);
    //this.assetsForm.controls['address'].get('longitud').enable();
    //this.requestForm.get('receiUser').patchValue(res.user);
    //});
  }

  checkRegSignature(signatureInfo: ISignatories) {}
}
