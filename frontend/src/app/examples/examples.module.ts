import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NouisliderModule } from "ng2-nouislider";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { JwBootstrapSwitchNg2Module } from "jw-bootstrap-switch-ng2";
import { AgmCoreModule } from "@agm/core";

import { DisclaimerComponent } from "./Disclaimer/Disclaimer.component";
import { ContactComponent } from "./contact-us/contact-us.component";
import { ExamplesComponent } from "./examples.component";
import { PrivicyComponent } from "./privicy/privicy.component";
import { TranslateModule } from "@ngx-translate/core";
import { PagenotfoundComponent } from "./pagenotfound/pagenotfound.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NouisliderModule,
    JwBootstrapSwitchNg2Module,
    AgmCoreModule.forRoot({
      apiKey: "YOUR_KEY_HERE",
    }),
    TranslateModule.forChild(),
  ],
  declarations: [
    PrivicyComponent,
    DisclaimerComponent,
    ExamplesComponent,
    ContactComponent,
    PagenotfoundComponent,
  ],
})
export class ExamplesModule {}
