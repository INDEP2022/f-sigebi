import { DEPOSITARY_ROUTES_2 } from 'src/app/common/constants/juridical-processes/depositary-routes-2';

export const DEPOSITARY_ROUTES_2_ROUTING = [
  // DEPOSITARIA
  {
    path: DEPOSITARY_ROUTES_2[0].link,
    loadChildren: async () =>
      (await import('./return-ruling/jp-d-m-return-ruling.module'))
        .JpDMReturnRulingModule,
    data: { title: DEPOSITARY_ROUTES_2[0].label },
  },
  {
    path: DEPOSITARY_ROUTES_2[1].link,
    loadChildren: async () =>
      (
        await import(
          './legal-opinions-office/jp-d-m-legal-opinions-office.module'
        )
      ).JpDMLegalOpinionsOfficeModule,
    data: { title: DEPOSITARY_ROUTES_2[1].label },
  },
  {
    path: DEPOSITARY_ROUTES_2[2].link,
    loadChildren: async () =>
      (await import('./trials/jp-d-m-trials.module')).JpDMTrialsModule,
    data: { title: DEPOSITARY_ROUTES_2[2].label },
  },
  {
    // ESPACIO EN BLANCO
    path: DEPOSITARY_ROUTES_2[3].link,
    loadChildren: async () =>
      (await import('./trials/jp-d-m-trials.module')).JpDMTrialsModule,
    data: { title: DEPOSITARY_ROUTES_2[3].label },
  }, // ESPACIO EN BLANCO
];
