/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */
import { Example } from 'src/app/core/models/catalogs/example';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import {
  routesJuridicalProcesses,
  baseMenu,
} from 'src/app/common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';

/** SERVICE IMPORTS */
import { ExampleService } from 'src/app/core/services/catalogs/example.service';

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-pj-ade-c-file-data-update',
  templateUrl: './pj-ade-c-file-data-update.component.html',
  styleUrls: ['./pj-ade-c-file-data-update.component.scss'],
})
export class PJADEFileDataUpdateComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  public readonly flyerId: number = null;
  flyerForm: FormGroup;
  items = new DefaultSelect<Example>();
  linkDictaminacionesJuridicas: string =
    baseMenu + routesJuridicalProcesses[0].link;
  linkReaccionacionTurno: string =
    '/pages/documents-reception/flyers-registration/shift-change';
  linkOficioRelacionado: string =
    '/pages/documents-reception/flyers-registration/related-document-management';

  constructor(
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute,
    private exampleService: ExampleService
  ) {
    super();
    const id = this.activateRoute.snapshot.paramMap.get('id');
    if (id) this.flyerId = Number(id);
  }

  ngOnInit(): void {
    this.loading = true;
    this.prepareForm();
  }

  prepareForm() {
    this.flyerForm = this.fb.group({
      noVolante: [this.flyerId, [Validators.required]],
      tipoVolante: [null, [Validators.required]],
      fecRecepcion: [null],
      noConsecutivoDiario: [null],
      actaCircunst: [null],
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

  getFromSelect(params: ListParams) {
    this.exampleService.getAll(params).subscribe(data => {
      this.items = new DefaultSelect(data.data, data.count);
    });
  }
}
