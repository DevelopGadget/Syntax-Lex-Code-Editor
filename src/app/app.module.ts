import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialDefinitionsModule } from './material-definitions.module';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule, MONACO_PATH } from '@materia-ui/ngx-monaco-editor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialDefinitionsModule,
    FormsModule,
    MonacoEditorModule
  ],
  providers: [
    {
      provide: MONACO_PATH,
      useValue: "https://unpkg.com/monaco-editor@0.21.3/min/vs"
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
