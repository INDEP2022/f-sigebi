import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'ligies-chapters',
    loadChildren: async () =>
      (await import('./ligies-chapters/ligies-chapters.module'))
        .LigiesChaptersModule,
  },
  {
    path: 'guidelines',
    loadChildren: async () =>
      (await import('./guidelines/guidelines.module')).GuidelinesModule,
  },
  {
    path: 'considerations',
    loadChildren: async () =>
      (await import('./considerations/considerations.module'))
        .ConsiderationsModule,
  },
  {
    path: 'regulations',
    loadChildren: async () =>
      (await import('./regulations/regulations.module')).RegulationsModule,
  },
  {
    path: 'attributes-parametrization',
    loadChildren: async () =>
      (
        await import(
          './attribute-parametrization/attribute-parametrization.module'
        )
      ).AttributeParametrizationModule,
  },
  {
    path: 'ligie-departures',
    loadChildren: async () =>
      (await import('./ligies-departures/ligies-departures.module'))
        .LigiesDeparturesModule,
  },
  {
    path: 'measurements-units',
    loadChildren: async () =>
      (await import('./measurement-units/measurement-units.module'))
        .MeasurementUnitsModule,
  },
  {
    path: 'ligie-sub-departures',
    loadChildren: async () =>
      (await import('./ligie-sub-departures/ligie-sub-departures.module'))
        .LigieSubDeparturesModule,
  },
  {
    path: 'ligie-measurement-units',
    loadChildren: async () =>
      (await import('./ligie-measurement-units/ligie-measurement-units.module'))
        .LigieMeasurementUnitsModule,
  },
  {
    path: 'fraction-with-classifier',
    loadChildren: async () =>
      (
        await import(
          './fraction-with-classifier/fraction-with-classifier.module'
        )
      ).FractionWithClassifierModule,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParametrizationRoutingModule {}
