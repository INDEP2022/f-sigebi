import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BasePage } from '../../../../../core/shared/base-page';
import { AnnexKFormComponent } from '../../generate-formats-verify-noncompliance/annex-k-form/annex-k-form.component';
import { AnnexJAssetsClassificationComponent } from '../annex-j-assets-classification/annex-j-assets-classification.component';

@Component({
  selector: 'app-assets-classification',
  templateUrl: './assets-classification.component.html',
  styleUrls: ['./assets-classification.component.scss'],
})
export class AssetsClassificationComponent extends BasePage implements OnInit {
  title: string = 'Clasificación de bienes (Firma Anexos)601';
  showSamplingDetail: boolean = true;
  showFilterAssets: boolean = true;
  willSave: boolean = true;

  constructor(
    private modalService: BsModalService,
    private bsModalRef: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {}

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
      '',
      'annexJ-assets-classification'
    );
  }

  opemAnnexK() {
    this.openModal(AnnexKFormComponent, '', 'annexK-assets-classification');
  }

  getSearchForm(event: any) {
    console.log(event);
  }

  openModal(component: any, data?: any, typeAnnex?: string): void {
    let config: ModalOptions = {
      initialState: {
        data: data,
        typeAnnex: typeAnnex,
        callback: (next: boolean) => {
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
}
