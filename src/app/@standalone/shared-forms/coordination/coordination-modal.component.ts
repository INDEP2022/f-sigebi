import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'coordination-modal',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './coordination-modal.component.html',
  styles: [],
})
export class CoordinationModalComponent extends BasePage implements OnInit {
  delegations: IDelegation[] = [];
  constructor(
    private delegationService: DelegationService,
    private goodParameterService: GoodParametersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getPhaseEdo().subscribe();
  }

  getDelegations() {
    this.delegationService.getAll();
  }

  getPhaseEdo() {
    return this.goodParameterService.getPhaseEdo().pipe(
      catchError(error => {
        return throwError(() => error);
      }),
      map(response => response.stagecreated)
    );
  }

  confirm() {}

  close() {}
}
