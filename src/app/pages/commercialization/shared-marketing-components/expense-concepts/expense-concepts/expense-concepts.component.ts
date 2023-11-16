import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExpenseConceptsService } from '../services/expense-concepts.service';

@Component({
  selector: 'app-expense-concepts',
  templateUrl: './expense-concepts.component.html',
  styleUrls: ['./expense-concepts.component.css'],
})
export class ExpenseConceptsComponent implements OnInit {
  address: string;
  constructor(
    private activateRoute: ActivatedRoute,
    private dataService: ExpenseConceptsService
  ) {
    this.activateRoute.params.subscribe({
      next: param => {
        if (param['id']) {
          this.address = param['id'];
          console.log(this.address);
        }
      },
    });
  }

  ngOnInit() {}

  get conceptId() {
    return this.dataService.concept ? this.dataService.concept.id : null;
  }
}
