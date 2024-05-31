import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { ComponentsComponent } from "./components/components.component";

import { DisclaimerComponent } from "./examples/Disclaimer/Disclaimer.component";
import { ContactComponent } from "./examples/contact-us/contact-us.component";
import { PrivicyComponent } from "./examples/privicy/privicy.component";

// const routes: Routes = [
//   { path: "", redirectTo: "localhost:4200/", pathMatch: "full" },
//   { path: "", component: ComponentsComponent },
//   { path: "exapmles/privicy", component: PrivicyComponent },
//   { path: "examples/login", component: LoginComponent },
//   { path: "examples/profile", component: ProfileComponent },
// ];

const routes: Routes = [
  { path: "", redirectTo: "components", pathMatch: "full" },
  { path: "", component: ComponentsComponent },
  { path: "privacy", component: PrivicyComponent },
  { path: "disclaimer", component: DisclaimerComponent },
  { path: "contact-us", component: ContactComponent },
];

@NgModule({
  imports: [CommonModule, BrowserModule, RouterModule.forRoot(routes)],
  exports: [],
})
export class AppRoutingModule {}
