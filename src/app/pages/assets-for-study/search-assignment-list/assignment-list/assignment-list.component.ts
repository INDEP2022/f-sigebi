import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from '../../../../common/constants/table-settings';
import { ListParams } from '../../../../common/repository/interfaces/list-params';
import { BasePage } from '../../../../core/shared/base-page';
import { ASSIGNMENT } from './assignment-mock';
import { ASSIGMENT_LIST_COLUMNS } from './columns/ASSIGMENT_LIST_COLUMNS';

@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.component.html',
  styles: [],
})
export class AssignmentListComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];
  totalItems: number = 0;

  constructor(private http: HttpClient, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: '',
      columns: ASSIGMENT_LIST_COLUMNS,
    };

    this.getData();
  }

  getData() {
    this.paragraphs = ASSIGNMENT;
  }

  assignmentSelected(event: any) {
    this.redirecTo(event.data);
  }

  redirecTo(data: any): void {
    switch (data.process) {
      case 'nuevo asignacion': {
        console.log(data);
        this.router.navigate([
          'pages/assets-for-study/search-assests',
          data.id,
        ]);
        break;
      }
      case 'ElaborarSolicitud': {
        this.router.navigate([
          'pages/assets-for-study/prepare-request-for-responsables',
          data.id,
        ]);
        break;
      }
      case 'GuardarRespuesta': {
        this.router.navigate(['pages/assets-for-study/save-answer', data.id]);
        break;
      }
      case 'ProgramarEntrega': {
        this.router.navigate([
          'pages/assets-for-study/schedule-delivery',
          data.id,
        ]);
        break;
      }
      case 'DictaminarBienes': {
        this.router.navigate([
          'pages/assets-for-study/dictate-assets-to-be-study',
          data.id,
        ]);
        break;
      }
    }
  }
}
