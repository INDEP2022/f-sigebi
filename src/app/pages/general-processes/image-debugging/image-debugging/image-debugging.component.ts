import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { GoodService } from 'src/app/core/services/good/good.service';
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

  constructor(
    private fb: FormBuilder,
    private goodService: GoodService,
    private comerEventService: ComerEventService
  ) {
    super();
    this.settings.actions = false;
    this.settings.columns = IMAGE_DEBUGGING_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getGoodNumberAll(new ListParams());
  }

  prepareForm() {
    this.form = this.fb.group({
      goodNumber: [null, [Validators.required]],
      goodStatus: [null, [Validators.required]],
      fileNumber: [null, [Validators.required]],
      idEvent: [null, [Validators.required]],
      idLot: [null, [Validators.required]],
      exists: [null, [Validators.required]],
    });
  }

  getGoodNumberAll(params: ListParams) {
    //console.log(params);
    if (params.text) {
      params['search'] = '';
      params['filter.id'] = `$eq:${params.text}`;
    }

    this.goodService.getAll(params).subscribe({
      next: resp => {
        this.selectGoodNumberSelected = new DefaultSelect(
          resp.data,
          resp.count
        );
      },
      error: error => {
        this.selectGoodNumberSelected = new DefaultSelect();
      },
    });
  }

  estatusAndFileNumber(datos: any) {
    if (this.form.controls['goodNumber'].value === null) {
      this.form.controls['goodStatus'].setValue(null);
      this.form.controls['fileNumber'].setValue(null);
      this.form.controls['idEvent'].setValue(null);
      this.form.controls['idLot'].setValue(null);
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
            //this.lotIdSelected = new DefaultSelect();
          },
        });
      },
      error: error => {
        console.log(error);
        //this.lotIdSelected = new DefaultSelect();
      },
    });
  }

  /*idLot(datos: any){
    this.getIdEvent(datos);
  }

  getIdEvent(data: any) {
    const datos: any = {};
    this.comerEventService.getLotId(data.lotId).subscribe({
      next: resp => {
        this.comerEventService.geEventId(resp.eventId).subscribe({
          next: resp => {
            //console.log(resp);
            this.form.controls['idEvent'].setValue(resp.id);
            //this.lotIdSelected = new DefaultSelect(resp.data, resp.count);
          },
          error: error => {
            console.log(error);
            //this.lotIdSelected = new DefaultSelect();
          },
        });
      },
      error: error => {
        console.log(error);
        //this.lotIdSelected = new DefaultSelect();
      },
    });
  }*/
}
