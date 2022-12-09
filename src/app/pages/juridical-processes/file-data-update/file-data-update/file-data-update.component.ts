/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */
import {
  baseMenu,
  routesJuridicalProcesses,
} from 'src/app/common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Example } from 'src/app/core/models/catalogs/example';

/** SERVICE IMPORTS */
import { ExampleService } from 'src/app/core/services/catalogs/example.service';

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-file-data-update',
  templateUrl: './file-data-update.component.html',
  styleUrls: ['./file-data-update.component.scss'],
})
export class FileDataUpdateComponent
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

  public optionsTipoVolante = [
    { value: 'Administrativo', label: 'Administrativo' },
    { value: 'Procesal', label: 'Procesal' },
    { value: 'Admin. Trans', label: 'Admin. Trans' },
    { value: 'Transferente', label: 'Transferente' },
  ];

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
      actaCircunst: [null, [Validators.pattern(STRING_PATTERN)]],
      averiguacionPrevia: [null, [Validators.pattern(STRING_PATTERN)]],
      causaPenal: [null, [Validators.pattern(STRING_PATTERN)]],
      cveAmparo: [null],
      cveTocaPenal: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      cveOficioExterno: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      fecOficioExterno: [null],
      observaciones: [null, [Validators.pattern(STRING_PATTERN)]],
      noExpediente: [null],
      remitenteExterno: [null, [Validators.pattern(STRING_PATTERN)]],
      asunto: [null, [Validators.pattern(STRING_PATTERN)]],
      desahogoAsunto: [null, [Validators.pattern(STRING_PATTERN)]],
      ciudad: [null, [Validators.pattern(STRING_PATTERN)]],
      entidadFed: [null],
      claveUnica: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
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
      destinatario: [null, [Validators.pattern(STRING_PATTERN)]],
      justificacion: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  getFromSelect(params: ListParams) {
    this.exampleService.getAll(params).subscribe(data => {
      this.items = new DefaultSelect(data.data, data.count);
    });
  }
}
