import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import * as moment from 'moment';
import { catchError, of } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISamplingDeductive } from 'src/app/core/models/ms-sampling-good/sampling-deductive.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { BasePage, TABLE_SETTINGS } from 'src/app/core/shared';
import { DATA } from './columns/deductive-data';
import { DEDUCTIVE_COLUMN } from './columns/deductives-columns';

@Component({
  selector: 'app-create-deductives',
  templateUrl: './create-deductives.component.html',
  styles: [],
})
export class CreateDeductivesComponent extends BasePage implements OnInit {
  @Input() deductives: any[] = [];
  @Input() typeComponent: string = '';
  @Input() SampleOrderId: number = null;
  @Output() deductivesSelected: EventEmitter<any> = new EventEmitter();
  isReadOnly: boolean = false;
  columns = DEDUCTIVE_COLUMN;

  paragraphs: any = [];

  private samplinggoodService = inject(SamplingGoodService);
  private authService = inject(AuthService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: DEDUCTIVE_COLUMN,
    };

    this.columns.selected = {
      ...this.columns.selected,
      onComponentInitFunction: this.deductiveSelected.bind(this),
    };

    this.columns.observation = {
      ...this.columns.observation,
      onComponentInitFunction: (instance: any) => {
        instance.input.subscribe((data: any) => {
          this.observation(data);
        });
      },
    };
    console.log(this.typeComponent);
    console.log(this.deductives);

    this.setInputs();
    if (this.typeComponent == 'generate-query') {
      this.getDeductives();
    }
  }

  setInputs() {
    if (this.typeComponent === 'revition-results') {
      this.isReadOnly = false;
    } else if (this.typeComponent == 'generate-query') {
      this.paragraphs = DATA;
      this.deductivesSelected.emit(this.paragraphs);
    }
  }

  deductiveSelected(event: any) {
    event.toggle.subscribe((data: any) => {
      const index = this.paragraphs.indexOf(data.row);
      this.paragraphs[index].selected = data.toggle;
    });
    this.deductivesSelected.emit(this.paragraphs);
  }

  observation(event: any) {
    const index = this.paragraphs.indexOf(event.row);
    if (event.text != '') {
      this.paragraphs[index].observation = event.text;
    } else {
      this.paragraphs[index].observation = null;
    }
    this.deductivesSelected.emit(this.paragraphs);
  }

  save() {
    /**
     * el campo sampleDeductiveId o Id no parece
     * validar traer los datos por el sampleDeductiveId
     * */
    this.loading = true;
    const user = this.authService.decodeToken();
    this.paragraphs.map(async (item: any, _i: number) => {
      const index = _i + 1;
      const body: ISamplingDeductive = {
        sampleDeductiveId: null,
        sampleId: null,
        orderSampleId: this.SampleOrderId,
        deductiveVerificationId: item.id,
        indDedictiva: item.selected == true ? 'Y' : 'N',
        userCreation: user.username,
        userModification: moment(new Date()).format('YYYY-MM-DD'),
        version: 1,
        observations: item.observation == null ? ' ' : item.observation,
      };
      const created = await this.createSampleDeductive(body);
      if (this.paragraphs.length == index) {
        this.onLoadToast(
          'success',
          'Las deductivas se guardaron correctamente'
        );
        this.loading = false;
      }
    });
  }

  createSampleDeductive(item: ISamplingDeductive) {
    return new Promise((resolve, reject) => {
      this.samplinggoodService.createSampleDeductive(item).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          this.loading = false;
          reject('no se puedo guardar los datos');
          this.onLoadToast('error', 'No se pudo guardar las deductivas');
          console.log(error);
        },
      });
    });
  }

  getDeductives() {
    const params = new ListParams();
    params['filter.orderSampleId'] = `$eq:${this.SampleOrderId}`;
    this.samplinggoodService
      .getAllSampleDeductives(params)
      .pipe(
        catchError((e: any) => {
          if (e.status == 400) {
            return of({ data: [], count: 0 });
          }
          throw e;
        })
      )
      .subscribe({
        next: resp => {
          if (resp.count > 0) {
            console.log(resp.data[0]);
            resp.data.map((item: any) => {
              for (let index = 0; index < this.paragraphs.length; index++) {
                const element = this.paragraphs[index];
                if (item.deductiveVerificationId == element.id) {
                  this.paragraphs[index].observation = item.observations;
                  this.paragraphs[index].selected =
                    item.indDedictiva == 'Y' ? true : false;
                  break;
                }
              }
              this.paragraphs = [...this.paragraphs];
            });
          }
        },
      });
  }
}
