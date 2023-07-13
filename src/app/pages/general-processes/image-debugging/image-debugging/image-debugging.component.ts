import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGood } from 'src/app/core/models/good/good.model';
import { IGoodPhoto } from 'src/app/core/models/ms-goodphoto/good-photo.model';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodPhotoService } from 'src/app/core/services/ms-photogood/good-photo.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ImageDebuggingModalComponent } from '../image-debugging-modal/image-debugging-modal.component';
import { IMAGE_DEBUGGING_COLUMNS } from './image-debugging-columns';

@Component({
  selector: 'app-image-debugging',
  templateUrl: './image-debugging.component.html',
  styles: [],
})
export class ImageDebuggingComponent extends BasePage implements OnInit {
  form: ModelForm<any>;

  selectGoodNumberSelected = new DefaultSelect();
  statusSelected = new DefaultSelect();
  lotIdSelected = new DefaultSelect();
  eventIdSelected = new DefaultSelect();
  pContador: number;
  NO_SCREEN = 'FDEPURAFOTOS';
  pScript: string;
  globalVFileBatInSrt: string;
  globalVFileExists: boolean = false;
  globalVFileNotExists: boolean = false;
  isChecked: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  goodPhoto: IGoodPhoto[] = [];
  goods: IGood[] = [];
  globalVRutaRepTmp: string;
  pAccion: string;
  isSearch: boolean = false;
  idGood: number = 0;
  totalItems: number = 0;
  di_desc_est: string;
  desGood: string;
  lot: any;
  vArchivo: FileSystemFileEntry;
  vGenArchivos: string;
  vAtribBatch: string;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private goodService: GoodService,
    protected modalService: BsModalService,
    private comerEventService: ComerEventService,
    private goodPhotoService: GoodPhotoService,
    private readonly goodServices: GoodService
  ) {
    super();
    this.settings.actions = false;
    this.settings.columns = IMAGE_DEBUGGING_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
    // this.getGoodNumberAll(new ListParams());
  }

  prepareForm() {
    this.form = this.fb.group({
      goodNumber: [null, [Validators.required]],
      goodStatus: [null],
      descStatus: [null],
      fileNumber: [null],
      idEvent: [null],
      eventDesc: [null],
      idLot: [null],
      lotDesc: [null],
      exists: [false],
    });
  }

  openButon() {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodByID(this.form.value.goodNumber));
  }

  getGoodPhoto(params: ListParams) {
    this.loading = true;
    params[
      'filter.goodNumber'
    ] = `$eq:${this.form.controls['goodNumber'].value}`;
    this.goodPhotoService.getFilterGoodPhoto(params).subscribe({
      next: response => {
        this.idGood = this.form.controls['goodNumber'].value;
        console.log(response.data);
        this.goodPhoto = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  getGoodByID(idGood: number | string) {
    this.goodServices.getByIdv3(idGood).subscribe({
      next: response => {
        this.form.controls['goodStatus'].setValue(response.goodStatus);
        this.form.controls['fileNumber'].setValue(response.fileNumber);
        // this.getComerGoodAll(response);
        // this.form.controls['idEvent'].setValue(this.lot.id);
        // this.form.controls['lotDesc'].setValue(this.lot.description);
        // this.form.controls['idLot'].setValue(null);
        this.desGood = response.description;
        console.log(this.desGood);
        this.goods.push(response);
        this.getGoodPhoto(new ListParams());
      },
      error: err => {
        console.log(err);
      },
    });
  }
  /*
    getGoodNumberAll(params: ListParams) {
      //console.log(params);
      if (params.text) {
        params['search'] = '';
        params['filter.id'] = `$eq:${params.text}`;
      }
      this.goodService.getAll(params).subscribe({
        next: resp => {
          // this.selectGoodNumberSelected = new DefaultSelect(
          //   resp.data,
          //   resp.count
          // );
          console.log(resp);
        },
        error: error => {
          // this.selectGoodNumberSelected = new DefaultSelect();
        },
      });
    }
  */

  validatePhoto(body: IGoodPhoto) {
    this.isLoading = true;
    if (this.form.value.goodNumber != null) {
      this.alertQuestion(
        'warning',
        'Validar',
        'Desea realizar la validación de fotografías?'
      ).then(question => {
        if (question.isConfirmed) {
          this.goodPhotoService.save(body).subscribe({
            next: data => {
              this.isLoading = false;
              // this.onLoadToast('success', 'Registro eliminado', '');
              // this.getData();
              console.log(data);
            },
            error: error => {
              // this.onLoadToast('error', 'No se puede eliminar registro', '');
              console.log(error);
              this.loading = false;
            },
          });
        }
      });
    }
    this.alert('info', ' no existen fotografías para validar', '');
    return;
  }

  getData() {}

  estatusAndFileNumber(datos: any) {
    if (this.form.controls['goodNumber'].value === null) {
      this.form.controls['goodStatus'].setValue(null);
      this.form.controls['fileNumber'].setValue(null);
      this.form.controls['idEvent'].setValue(null);
      this.form.controls['idLot'].setValue(null);
      this.openButon();
    } else {
      this.form.controls['goodStatus'].setValue(datos.goodStatus);
      this.form.controls['fileNumber'].setValue(datos.fileNumber);
      // this.getComerGoodAll(datos);
    }
  }

  // getComerGoodAll(data: any) {
  //   //console.log(params);
  //   // console.log(data);
  //   const params = new ListParams();
  //   params['filter.goodNumber'] = `$eq:${data.id}`;
  //   console.log(this.form.controls['goodNumber'].value);
  //   this.comerEventService.getAllFilterComerGood(params).subscribe({
  //     next: resp => {
  //       this.lot = resp;
  //       // console.log(resp);
  //       this.lotIdSelected = new DefaultSelect(resp.data, resp.count);
  //     },
  //     error: error => {
  //       console.log(error);
  //       this.lotIdSelected = new DefaultSelect();
  //     },
  //   });
  // }

  // idEvent(datos: any) {
  //   this.getIdLot(datos);
  // }

  // getIdLot(data: any) {
  //   const datos: any = {};
  //   this.comerEventService.getLotId(data.lotId).subscribe({
  //     next: resp => {
  //       this.comerEventService.geEventId(resp.eventId).subscribe({
  //         next: resp => {
  //           //console.log(resp);
  //           //this.form.controls['idEvent'].setValue(resp.id);
  //           this.eventIdSelected = new DefaultSelect([resp], 1);
  //           this.form.controls['idEvent'].setValue(resp.id);
  //         },
  //         error: error => {
  //           console.log(error);
  //           this.eventIdSelected = new DefaultSelect();
  //         },
  //       });
  //     },
  //     error: error => {
  //       console.log(error);
  //       //this.lotIdSelected = new DefaultSelect();
  //     },
  //   });
  // }

  clearSearch() {
    this.resetALL();
    // this.goods = [];
    // this.buttonAprove = true;
    // this.isIdent = true;
    this.totalItems = 0;
  }

  searchExp() {
    const { noExpediente } = this.form.value;
    if (!noExpediente) return;
    this.isSearch = true;
    // this.isDisabledExp = true;
    // this.onLoadExpedientData();
    this.params.getValue().page = 1;
    this.loading = true;
    this.goodServices.getByExpedient(noExpediente).subscribe({
      next: resp => {
        const data = resp.data;
        this.loading = false;
        data.map(async (good: any, index: any) => {
          if (index == 0) this.di_desc_est = good.estatus.descriptionStatus;
          good.di_disponible = 'S';
          await new Promise((resolve, reject) => {
            const body = {
              no_bien: good.id,
              estatus: good.status,
              identificador: good.identifier,
              vc_pantalla: 'FDEPURAFOTOS',
              proceso_ext_dom: good.extDomProcess ?? '',
            };
            // console.log(body);
          });
        });

        this.goods = data;
        this.totalItems = resp.count || 0;

        // this.onLoadDictationInfo();
      },
      error: err => {
        console.log(err);
      },
    });
    // this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
    // });
  }
  resetALL() {
    this.form.reset();
    // this.selectGoodNumberSelected = [];
    this.goodPhoto = [];
  }

  addDepura() {}

  // pupInicializaForma(blkControl: any, global: any): void {
  //   global.gstPathImgs = 'Z:\\ICONOS\\';
  //   readImageFile(global.gstPathImgs + 'Buscar_JPG.jpg', 'JPG', blkControl.img_buscar);
  //   readImageFile(global.gstPathImgs + 'validar_JPG.jpg', 'JPG', blkControl.img_validar);
  //   readImageFile(global.gstPathImgs + 'Invalido_JPG.JPG', 'JPG', blkControl.img_obtinfo);
  //   readImageFile(global.gstPathImgs + 'Invalido_JPG.JPG', 'JPG', blkControl.img_valinfo);
  //   readImageFile(global.gstPathImgs + 'Invalido_JPG.JPG', 'JPG', blkControl.img_updinfo);

  //   blkControl.obt = 'Obteniendo información¿';
  //   blkControl.val = 'Validando fotografías¿';
  //   blkControl.upd = 'Actualizando¿';

  //   global.v_rutareptmp = 'C:\\SIABTMP\\';
  //   global.v_filenotexists = 'FOTONOTEXISTS.CSV';
  //   global.v_fileexists = 'FOTOEXISTS.CSV';
  //   global.v_filebatinsrt = 'BATVALARCHIVO.BAT';
  // }

  // ORCLE FORMS --GETPATNAME
  getPathName(fileOrg: string): string {
    let result: string =
      fileOrg.split('\\').pop() || fileOrg.split('/').pop() || '';
    return result.substr(0, result.lastIndexOf('.'));
  }

  // ORCLE FORMS --PUB_GENBATCH *DESCRIPCION: GENERA LOS ARCHIVOS DONDE SE INSERTARA EL SCRIP PARA VALIDAR SI EXISTE LA FOTOGRAFIA.
  // generarBatch() {
  //   if (this.pAccion === 'G' && !this.pContador) {
  //     this.vAtribBatch = 'W';
  //   } else if (this.pAccion === 'I' && this.pContador === 1) {
  //     this.vAtribBatch = 'W';
  //   } else if (this.pAccion === 'I' && this.pContador > 1) {
  //     this.vAtribBatch = 'A';
  //   }
  //   if (this.pAccion === 'G') {
  //     // Arma el script para generar los archivos CSV
  //     this.vGenArchivos = 'NO_BIEN, NO_CONSEC, EXISTE' + this.globalVRutaRepTmp + this.globalVFileNotExists + '\n' +
  //       'NO_BIEN,NO_CONSEC, EXISTE > ' + this.globalVRutaRepTmp + this.globalVFileExists;
  //     // Genera el archivo batch (batValArchivo.bat)
  //     this.vArchivo = this.textIo.Fopen(this.globalVRutaRepTmp + this.globalVFileBatInSrt, this.vAtribBatch);
  //     // Inserta en el archivo batch
  //     this.textIo.PutLine(this.vArchivo, this.vGenArchivos);
  //     // Cierra el archivo batch
  //     this.textIo.Fclose(this.vArchivo);
  //     // Ejecuta el archivo batch
  //     this.host(this.globalVRutaRepTmp + this.globalVFileBatInSrt, this.NO_SCREEN);
  //   } else if (this.pAccion === 'I') {
  //     // Abre el archivo batch
  //     this.vArchivo = this.textIo.Fopen(this.globalVRutaRepTmp + this.globalVFileBatInSrt, this.vAtribBatch);
  //     // Agrega en el archivo batch el script para validar la fotografía (pScript)
  //     this.textIo.PutLine(this.vArchivo, this.pScript);
  //     // Cierra el archivo batch
  //     this.textIo.Fclose(this.vArchivo);
  //   }
  // }

  pufValFoto(pBien: number, pConsec: number, pAccion: string): number {
    let vNotExists: number;
    let vValor: number;
    // Lógica para consultar BIENES_FOTO_INVALIDAS y asignar un valor a vNotExists
    if (vNotExists > 0) {
      vValor = 0;
    } else {
      vValor = 1;
    }
    return vValor;
  }

  getBienesFotoDescripcion(bienesFoto: any, global: any): void {
    try {
      // Lógica para consultar DESCRIPCION en la tabla BIENES y asignar un valor a bienesFoto.descripcion
      bienesFoto.descripcion = this.desGood;
    } catch (error) {
      bienesFoto.descripcion = null;
    }
    bienesFoto.publicado = bienesFoto.publ_img_cat_web ?? 0;
    bienesFoto.existe = this.pufValFoto(
      bienesFoto.no_bien,
      bienesFoto.no_consec,
      null
    );
    // LIP_MENSAJE('EXISTE  '||bienesFoto.existe,'A');
    bienesFoto.script_batch = `IF NOT EXIST ${bienesFoto.ubicacion} ( \n ${bienesFoto.no_bien},${bienesFoto.no_consec},N >> ${global.v_rutareptmp}${global.v_filenotexists}\n) ELSE ( \n  ECHO ${bienesFoto.no_bien},${bienesFoto.no_consec},S >> ${global.v_rutareptmp}${global.v_fileexists}\n)\n`;
  }

  // Método para insertar en el archivo batch
  insertarBatch() {
    // Lógica para insertar en el archivo batch
  }

  // Métodos para llamar a las funciones HOST y TEXT_IO de Oracle
  host(pCommand: string, pMode: string) {}
  textIo: any;

  addPhotos(goodPhotos?: IGoodPhoto) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      goodPhotos,
    };

    let modalRef = this.modalService.show(
      ImageDebuggingModalComponent,
      modalConfig
    );
    modalRef.content.onSave.subscribe(async (next: any) => {
      // this.getActasByConversion(next.cve_acta_conv);
    });
  }
}
