import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGood } from 'src/app/core/models/good/good.model';
import { IGoodPhoto } from 'src/app/core/models/ms-goodphoto/good-photo.model';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodPhotoService } from 'src/app/core/services/ms-photogood/good-photo.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
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
  params = new BehaviorSubject<ListParams>(new ListParams());
  goodPhoto: IGoodPhoto[] = [];
  goods: IGood[] = [];
  isSearch: boolean = false;
  idGood: number = 0;
  totalItems: number = 0;
  di_desc_est: string;
  desGood: string;
  lot: any;
  constructor(
    private fb: FormBuilder,
    private goodService: GoodService,
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
      goodNumber: [null],
      goodStatus: [null],
      descStatus: [null],
      fileNumber: [null],
      idEvent: [null],
      eventDesc: [null],
      idLot: [null],
      lotDesc: [null],
      exists: [null],
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
        this.getComerGoodAll(response);
        this.form.controls['idEvent'].setValue(this.lot.id);
        this.form.controls['lotDesc'].setValue(this.lot.description);
        this.form.controls['idLot'].setValue(null);
        this.desGood = response.description;
        console.log(response.description);
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
    if (this.form.value.goodNumber != null) {
      this.alertQuestion(
        'warning',
        'Validar',
        'Desea realizar la validación de fotografías?'
      ).then(question => {
        if (question.isConfirmed) {
          this.goodPhotoService.save(body).subscribe({
            next: data => {
              this.loading = false;
              this.onLoadToast('success', 'Registro eliminado', '');
              this.getData();
            },
            error: error => {
              this.onLoadToast('error', 'No se puede eliminar registro', '');
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
      this.getComerGoodAll(datos);
    }
  }

  getComerGoodAll(data: any) {
    //console.log(params);
    console.log(data);
    const params = new ListParams();
    params['filter.goodNumber'] = `$eq:${data.id}`;
    console.log(this.form.controls['goodNumber'].value);
    this.comerEventService.getAllFilterComerGood(params).subscribe({
      next: resp => {
        this.lot = resp;
        console.log(resp);
        this.lotIdSelected = new DefaultSelect(resp.data, resp.count);
      },
      error: error => {
        console.log(error);
        this.lotIdSelected = new DefaultSelect();
      },
    });
  }

  idEvent(datos: any) {
    this.getIdLot(datos);
  }

  getIdLot(data: any) {
    const datos: any = {};
    this.comerEventService.getLotId(data.lotId).subscribe({
      next: resp => {
        this.comerEventService.geEventId(resp.eventId).subscribe({
          next: resp => {
            //console.log(resp);
            //this.form.controls['idEvent'].setValue(resp.id);
            this.eventIdSelected = new DefaultSelect([resp], 1);
            this.form.controls['idEvent'].setValue(resp.id);
          },
          error: error => {
            console.log(error);
            this.eventIdSelected = new DefaultSelect();
          },
        });
      },
      error: error => {
        console.log(error);
        //this.lotIdSelected = new DefaultSelect();
      },
    });
  }

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
            console.log(body);
            // this.dictationServ.checkGoodAvaliable(body).subscribe({
            //   next: state => {
            //     good.est_disponible = state.est_disponible;
            //     good.v_amp = state.v_amp ? state.v_amp : null;
            //     good.pDiDescStatus = state.pDiDescStatus;
            //     // this.desc_estatus_good = state.pDiDescStatus ?? '';
            //   },
            //   error: () => {
            //     this.loading = false;
            //     resolve(null);
            //   },
            // });
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
}
