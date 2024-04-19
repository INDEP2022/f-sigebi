import { DatePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISamplingOrder } from 'src/app/core/models/ms-order-service/sampling-order.model';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';

@Component({
  selector: 'app-sampling-detail-review-results',
  templateUrl: './sampling-detail-review-results.component.html',
  styles: [],
})
export class SamplingDetailReviewResultsComponent implements OnInit {
  @Input() sampleOrderId: any = [];

  sampleOrderForm: ISamplingOrder;
  delegationRegional: string = null;
  fechaFormateada: string;

  private orderService = inject(OrderServiceService);
  private deleRegService = inject(RegionalDelegationService);
  private datePipe: DatePipe;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    //this.initForm();

    this.getSampleOrder();
  }

  initForm() {
    /*this.sampleOrderForm = this.fb.group({
      noSampling: ['10025'],
      noContract: ['124'],
      geographicalArea: [null],
      periodSampling: [null],
      regionalDelegation: [null],
    });*/
  }

  getSampleOrder() {
    const params = new ListParams();
    params['filter.idSamplingOrder'] = `$eq:${this.sampleOrderId}`;
    this.orderService.getAllSampleOrder(params).subscribe({
      next: async resp => {
        this.sampleOrderForm = resp.data[0] as ISamplingOrder;

        this.formatedDate();
        this.delegationRegional = (await this.getDelegationRegional(
          this.sampleOrderForm.idDelegationRegional
        )) as string;
      },
    });
  }

  getDelegationRegional(id: number) {
    return new Promise((resolve, reject) => {
      this.deleRegService.getById(id).subscribe({
        next: resp => {
          resolve(resp.description);
        },
      });
    });
  }

  formatedDate() {
    console.log('info de la fecha', this.sampleOrderForm.periodSampling);

    const fechaString = this.sampleOrderForm.periodSampling;

    const [year, month, day] = fechaString.split('-');

    // Nombre del mes en español
    const meses = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];
    const mes = meses[parseInt(month, 10) - 1];

    // Formatear la fecha
    this.fechaFormateada = `${mes}-${year}`;
  }
}
