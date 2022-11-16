import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { EXECUTE_RETURN_COLUMNS } from './execute-return-columns';

@Component({
  selector: 'app-execute-return-deliveries-list',
  templateUrl: './execute-return-deliveries-list.component.html',
  styles: [],
})
export class ExecuteReturnDeliveriesListComponent
  extends BasePage
  implements OnInit
{
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];
  totalItems: number = 0;
  constructor(private router: Router) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: EXECUTE_RETURN_COLUMNS,
    };
    this.paragraphs = [
      {
        title:
          'Aprobar la solicitud para la restitución de bienes de la programación E-METROPOLITANA-339',
        noRequest: 45009,
        numTask: 260301,
        noInstance: 820169,
        created: 'tester_nsbxt',
        status: '',
        process: 'AprobateRequest',
      },

      {
        title:
          'Clasificación de bienes no entregados para la programación E-METROPOLITANA-444',
        noRequest: 76576,
        numTask: 676765,
        noInstance: 2432424,
        created: 'tester_nsbxt',
        status: '',
        process: 'ClasificateRequest',
      },

      {
        title:
          'Restitución de bienes dañados y faltantes para la programación E-METROPOLITANA-224',
        noRequest: 76576,
        numTask: 676765,
        noInstance: 2432424,
        created: 'tester_nsbxt',
        status: '',
        process: 'RestitutionRequest',
      },
    ];
  }

  ngOnInit(): void {}

  editRequest(event: any) {
    console.log(event);
    if (event.data.process == 'AprobateRequest') {
      // en el caso de que sea una solicitud de programacion
      this.router.navigate([
        '/pages/execute-return-deliveries/approve-restitution',
        1,
      ]);
    } else if (event.data.process == 'ClasificateRequest') {
      this.router.navigate([
        '/pages/execute-return-deliveries/classification-goods',
        1,
      ]);
    } else if (event.data.process == 'RestitutionRequest') {
      this.router.navigate([
        '/pages/execute-return-deliveries/restitution-goods',
        1,
      ]);
    }
  }
}
