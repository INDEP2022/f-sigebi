import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BasePage } from '../../../../../core/shared/base-page';
import { AnnexKFormComponent } from '../../generate-formats-verify-noncompliance/annex-k-form/annex-k-form.component';
import { AnnexJRestitutionFormComponent } from '../annex-j-restitution-form/annex-j-restitution-form.component';

@Component({
  selector: 'app-restitution-of-assets',
  templateUrl: './restitution-of-assets.component.html',
  styleUrls: ['./restitution-of-assets.component.scss'],
})
export class RestitutionOfAssetsComponent extends BasePage implements OnInit {
  title: string = 'Muestreo Aleatorio de Bienes: Restitución de Bienes';
  showSamplingDetail: boolean = true;
  showFilterAssets: boolean = true;
  //datos para el detalle de anexo
  annexDetail: any[] = [];

  bsModalRef: BsModalRef;

  constructor(private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {}

  getSearchForm(event: any): void {
    console.log(event);
  }

  openAnnexJ(): void {
    this.openModal(
      AnnexJRestitutionFormComponent,
      '',
      'annexJ-restitution-of-assets'
    );
  }

  opemAnnexK(): void {
    this.openModal(AnnexKFormComponent, '', 'annexK-restitution-of-assets');
  }

  turnSampling(): void {
    let message =
      'Hay bienes en especie y seran enviado a aprobacion.\n¿Esta de acuerdo que la información es correcta para turnar la restitución?';
    this.alertQuestion(undefined, 'Confirmación', message, 'Aceptar').then(
      question => {
        if (question.isConfirmed) {
          console.log('enviar mensaje');
        }
      }
    );
  }

  save(): void {}

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
