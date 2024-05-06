// import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; // this is needed!
// import { NgModule } from "@angular/core";
// import { FormsModule } from "@angular/forms";
// import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
// import { RouterModule } from "@angular/router";
// import { AppRoutingModule } from "./app.routing";
// import { ComponentsModule } from "./components/components.module";

// import { AppComponent } from "./app.component";
// import { NavbarComponent } from "./shared/navbar/navbar.component";
// import { HttpClient, HttpClientModule } from "@angular/common/http";
// import { YtServiceService } from "./services/yt-service.service";
// import { CommonModule } from "@angular/common";
// import {
//   TranslateLoader,
//   TranslateModule,
//   TranslateService,
// } from "@ngx-translate/core";

// import { HttpLoaderFactory } from "./translation-loader";
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// @NgModule({
//   declarations: [AppComponent, NavbarComponent],
//   imports: [
//     MatProgressSpinnerModule,
//     BrowserAnimationsModule,
//     NgbModule,
//     FormsModule,
//     RouterModule,
//     AppRoutingModule,
//     ComponentsModule,
//     HttpClientModule,
//     CommonModule,
//     TranslateModule.forRoot({
//       loader: {
//         provide: TranslateLoader,
//         useFactory: HttpLoaderFactory,
//         deps: [HttpClient],
//       },
//       defaultLanguage: "English",
//     }),
    
//   ],
//   providers: [YtServiceService, TranslateService],
//   bootstrap: [AppComponent],
//   exports: [TranslateModule],
// })
// export class AppModule {}
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { HttpLoaderFactory } from "./translation-loader";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./shared/navbar/navbar.component";

@NgModule({
  declarations: [AppComponent, NavbarComponent],
  imports: [
    MatProgressSpinnerModule,
    BrowserModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    ComponentsModule,
    HttpClientModule,
    CommonModule,
    NgbModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [TranslateService], // Remove YtServiceService from providers if not used here
  bootstrap: [AppComponent],
  exports: [TranslateModule],
})
export class AppModule {
  constructor(private translateService: TranslateService) {
    // Set default language based on browser's language or use 'English' as default
    const browserLang = translateService.getBrowserLang();
    translateService.setDefaultLang(browserLang.match(/en|es/) ? browserLang : 'en');
  }
}

