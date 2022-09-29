import { IMenuItem } from "./interfaces/menu.interface";

export const MENU: IMenuItem[] = [
    {
        label: 'Menu',
        isTitle: true
    },
    {
        label: 'Inicio',
        icon: 'bx-home-circle',
        link: '/pages/home'
    },
    // {
    //     isLayout: true
    // },
    // {
    //     label: 'Aplicaciones',
    //     isTitle: true
    // },
    {
        label: 'Ejemplo',
        icon: 'bx-calendar',
        link: '/pages/example',
    },
    {
        label: 'Catalogos',
        icon: 'bx-folder',
        subItems: [
            {
                label: 'Nivel 1.1',
                link: '#',
            }
        ]
    },
    {
        label: 'Multi nivel',
        icon: 'bx-share-alt',
        subItems: [
            {
                label: 'Nivel 1.1',
                link: '#',
            },
            {
                label: 'Nivel 1.2',
                subItems: [
                    {
                        label: 'Nivel 2.1',
                    },
                    {
                        label: 'Nivel 2.2',
                    }
                ]
            },
        ]
    }
];

