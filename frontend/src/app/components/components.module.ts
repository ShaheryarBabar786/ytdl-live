import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { NouisliderModule } from "ng2-nouislider";
import { JwBootstrapSwitchNg2Module } from "jw-bootstrap-switch-ng2";
import { RouterModule } from "@angular/router";
import { ComponentsComponent } from "./components.component";
import { TranslateModule } from "@ngx-translate/core";
import { ExamplesModule } from "app/examples/examples.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NouisliderModule,
    RouterModule,
    JwBootstrapSwitchNg2Module,
    TranslateModule,
    ExamplesModule,
  ],
  declarations: [ComponentsComponent],
  exports: [ComponentsComponent],
})
export class ComponentsModule {}
