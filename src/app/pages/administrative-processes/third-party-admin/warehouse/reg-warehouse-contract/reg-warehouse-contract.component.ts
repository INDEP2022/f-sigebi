import { Component, OnInit, ViewChild } from '@angular/core';
//ApexCharts
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexPlotOptions,
  ApexTitleSubtitle,
  ApexXAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { BsModalService } from 'ngx-bootstrap/modal';
//BasePage
import { BasePage } from 'src/app/core/shared/base-page';
//Components
import { ProceedingsDetailsComponent } from '../proceedings-details/proceedings-details.component';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  fill: any;
  colors: any;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  plotOptions: ApexPlotOptions;
};

@Component({
  selector: 'app-reg-warehouse-contract',
  templateUrl: './reg-warehouse-contract.component.html',
  styles: [
    `
      canvas {
        border: 1px solid black;
      }
    `,
  ],
})
export class RegWarehouseContractComponent extends BasePage implements OnInit {
  @ViewChild('chart', { static: false }) chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;

  positions: number = 160;
  //letter : string = null;
  //number:number=null;
  config: any;

  form: FormGroup = new FormGroup({});

  constructor(private modalService: BsModalService, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.createChart();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      warehouseType: [null, [Validators.required]],
      warehouse: [null, [Validators.required]],
      contract: [null, [Validators.required]],
    });
  }

  openModal(context?: Partial<ProceedingsDetailsComponent>): void {
    const modalRef = this.modalService.show(ProceedingsDetailsComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    //modalRef.onHidden.subscribe(this.createChart());
  }

  confirm(): void {
    this.loading = true;
    //console.log(this.checkedListFA,this.checkedListFI)
    //console.log(this.form.value);
    setTimeout(st => {
      this.loading = false;
    }, 5000);
  }

  createChart(): void {
    let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']; //'K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z', 'AA', 'AB','AC','AD','AE','AF','AG','AH','AI','AJ']
    letters = letters.reverse();

    let count = letters.length;
    let series: any = [];
    letters.map((letter: any) => {
      let serie = {
        name: letter,
        data: [
          {
            x: letter,
            y: Math.floor(Math.random() * (55 - 1 + 1)) + 1,
          },
          {
            x: letter,
            y: Math.floor(Math.random() * (55 - 1 + 1)) + 1,
          },
          {
            x: letter,
            y: Math.floor(Math.random() * (55 - 1 + 1)) + 1,
          },
          {
            x: letter,
            y: Math.floor(Math.random() * (55 - 1 + 1)) + 1,
          },
          {
            x: letter,
            y: Math.floor(Math.random() * (55 - 1 + 1)) + 1,
          },
          {
            x: letter,
            y: Math.floor(Math.random() * (55 - 1 + 1)) + 1,
          },
          {
            x: letter,
            y: Math.floor(Math.random() * (55 - 1 + 1)) + 1,
          },
          {
            x: letter,
            y: Math.floor(Math.random() * (55 - 1 + 1)) + 1,
          },
        ],
      };
      series.push(serie);
    });

    this.chartOptions = {
      series: series,
      tooltip: {
        shared: true,
      },
      chart: {
        height: 350,
        type: 'heatmap',
        events: {
          click: (event: any, chartContext: any, config: any) => {
            this.config = config;
          },
        },
      },
      dataLabels: {
        enabled: true,
      },
      colors: [
        '#F3B415',
        '#F27036',
        '#663F59',
        '#6A6E94',
        '#4E88B4',
        '#00A7C6',
        '#18D8D8',
        '#A9D794',
        '#46AF78',
        '#A93F55',
        '#8C5E58',
        '#2176FF',
        '#33A1FD',
        '#7A918D',
        '#BAFF29',
      ],
      xaxis: {
        type: 'category',
        categories: [''],
      },
      title: {
        text: 'Actas por Almacén',
      },
      grid: {
        padding: {
          right: 20,
        },
      },
    };
  }

  onClick(): void {
    if (this.config.seriesIndex !== -1) {
      let letter = this.config.config.series[this.config.seriesIndex].name;
      let number =
        this.config.config.series[this.config.seriesIndex].data[
          this.config.dataPointIndex
        ].y;

      let config = {
        letter: letter,
        number: number,
      };

      //this.chart.destroy();
      this.openModal({ edit: false, config });
    }
  }
}
