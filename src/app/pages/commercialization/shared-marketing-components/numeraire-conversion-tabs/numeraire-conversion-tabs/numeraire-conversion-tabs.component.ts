import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-numeraire-conversion-tabs',
  templateUrl: './numeraire-conversion-tabs.component.html',
  styles: [],
})
export class NumeraireConversionTabsComponent implements OnInit {
  address: string;
  constructor(private activateRoute: ActivatedRoute) {
    this.activateRoute.params.subscribe({
      next: param => {
        if (param['id']) {
          this.address = param['id'];
        }
      },
    });
  }

  ngOnInit(): void {}
}
