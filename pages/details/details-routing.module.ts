import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './details.component';


const routes: Routes = [{
    path: '',
    component: DetailsComponent,
    children: [
        {
            path: 'basic-info',
            loadChildren: () => import('./basic-info/basic-info.module').then(m => m.BasicInfoModule),
            data: {
                preload: true,
                delay: true
            },
        },
        {
            path: 'goals',
            loadChildren: () => import('./goals/goals.module').then(m => m.GoalsModule),
            data: {
                preload: true,
                delay: true
            },
        },
        {
            path: 'budgeting',
            loadChildren: () => import('./budgeting/budgeting.module').then(m => m.BudgetingModule),
            data: {
                preload: true,
                delay: true
            },
        },
        {
            path: 'risk-management',
            loadChildren: () => import('./risk-management/risk-management.module').then(m => m.RiskManagementModule),
            data: {
                preload: true,
                delay: true
            },
        },
        {
            path: 'wealth-management',
            loadChildren: () => import('./wealth-management/wealth-management.module').then(m => m.WealthManagementModule),
            data: {
                preload: true,
                delay: true
            },
        },
        {
            path: '',
            redirectTo: 'basic-info',
            pathMatch: 'full',
        }
    ]
}];


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class DetailsRoutingModule { }
