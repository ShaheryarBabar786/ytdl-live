import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";

import { AppComponent } from "./app.component";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { YtServiceService } from "./services/yt-service.service";
import { CommonModule } from "@angular/common";
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";

import { HttpLoaderFactory } from "./translation-loader";
import { ExamplesModule } from "./examples/examples.module";

@NgModule({
  declarations: [AppComponent, NavbarComponent],
  imports: [
    ExamplesModule,
    NgbModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    ComponentsModule,
    HttpClientModule,
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: localStorage.getItem("selectedLanguage") || "English",
    }),
  ],
  providers: [YtServiceService, TranslateService],
  bootstrap: [AppComponent],
  exports: [TranslateModule],
})
export class AppModule {}
