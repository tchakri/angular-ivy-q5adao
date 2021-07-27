import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';

import { AppComponent } from './app.component';
import { BarChartComponent } from './03_bar_chart/bar-chart.component';

const appRoutes: Routes = [
  // { path: 'line-chart', component: LineChartComponent },
  // { path: 'multi-series', component: MultiSeriesComponent },
  { path: 'bar-chart', component: BarChartComponent },
  // { path: 'stacked-bar-chart', component: StackedBarChartComponent },
  // { path: 'brush-zoom', component: BrushZoomComponent },
  // { path: 'pie-chart', component: PieChartComponent },
  // { path: 'donut-chart', component: DonutChartComponent },
  { path: '', redirectTo: '/line-chart', pathMatch: 'full' },
  { path: '**', component: BarChartComponent }
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' }),
    MatMenuModule,
    MatSidenavModule
  ],
  declarations: [AppComponent, BarChartComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
