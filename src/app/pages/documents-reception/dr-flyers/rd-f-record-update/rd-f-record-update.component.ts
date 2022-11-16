import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { RdFPublicMinistriesComponent } from '../rd-f-public-ministries/rd-f-public-ministries.component';

@Component({
  selector: 'app-rd-f-record-update',
  templateUrl: './rd-f-record-update.component.html',
  styles: [
    `
      :host ::ng-deep form-radio .form-group {
        margin: 0;
        padding-bottom: -5px;
      }
    `,
  ],
})
export class RdFRecordUpdateComponent extends BasePage implements OnInit {
  public readonly flyerId: number = null;
  flyerForm: FormGroup;
  subjects = new DefaultSelect();

  constructor(private fb: FormBuilder, private activateRoute: ActivatedRoute, private modalService: BsModalService) {
    super();
    const id = this.activateRoute.snapshot.paramMap.get('id');
    if (id) this.flyerId = Number(id);
  }
  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.flyerForm = this.fb.group({
      noVolante: [this.flyerId, [Validators.required]],
      tipoVolante: ['Administrativo', [Validators.required]],
      fecRecepcion: [null],
      noConsecutivoDiario: [null],
      actaCircust: [null],
      averiguacionPrevia: [null],
      causaPenal: [null],
      cveAmparo: [null],
      cveTocaPenal: [null],
      cveOficioExterno: [null],
      fecOficioExterno: [null],
      observaciones: [null],
      noExpediente: [null],
      remitenteExterno: [null],
      asunto: [null],
      desahogoAsunto: [null],
      ciudad: [null],
      entidadFed: [null],
      claveUnica: [null],
      transferente: [null],
      emisora: [null],
      autoridad: [null],
      institucion: [null],
      minPub: [null],
      juzgado: [null],
      indicado: [null],
      delito: [null],
      recepcion: [null],
      area: [null],
      del: [null],
      destinatario: [null],
      justificacion: [null],
    });
  }
  publicMinistries() {
    const modalConfig = {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered',
      initialState: {
        // TODO: Deberia recibir todos los datos para que el formulario sea llenado
        callback: (next: string | number) => {
          // TODO: LLenar el formulario
        },
      },
    };
    this.modalService.show(
      RdFPublicMinistriesComponent,
      modalConfig
    );
  }
}
