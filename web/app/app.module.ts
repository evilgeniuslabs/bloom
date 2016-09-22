import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import './rxjs-extensions';

// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular2-in-memory-web-api';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard.component';
import { ParticleService } from './particle.service';
import { routing } from './app.routing';
import { PadLeftPipe } from './padLeft.pipe';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    PadLeftPipe
  ],
  providers: [
    Title,
    ParticleService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
