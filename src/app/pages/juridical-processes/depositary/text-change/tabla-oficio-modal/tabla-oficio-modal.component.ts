import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodsJobManagementService } from 'src/app/core/services/ms-office-management/goods-job-management.service';

@Component({
  selector: 'app-tabla-oficio-modal',
  templateUrl: './tabla-oficio-modal.component.html',
  styles: [],
})
export class TablaOficioModalComponent implements OnInit {
  filterParams: BehaviorSubject<FilterParams>;
  pantalla: string;

  constructor(private serviceOficces: GoodsJobManagementService) {}

  ngOnInit(): void {}
}
