import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";
import { ComponentsComponent } from "./components/components.component";
import { DisclaimerComponent } from "./examples/Disclaimer/Disclaimer.component";
import { ContactComponent } from "./examples/contact-us/contact-us.component";
import { PrivicyComponent } from "./examples/privicy/privicy.component";
import { PagenotfoundComponent } from "./examples/pagenotfound/pagenotfound.component";

// const routes: Routes = [
//   { path: "", redirectTo: "components", pathMatch: "full" },
//   { path: "", component: ComponentsComponent },
//   { path: "privacy", component: PrivicyComponent },
//   { path: "disclaimer", component: DisclaimerComponent },
//   { path: "contact-us", component: ContactComponent },
// ];

const routes: Routes = [
  { path: "", component: ComponentsComponent, pathMatch: "full" }, // Default route to ComponentsComponent
  { path: "privacy", component: PrivicyComponent },
  { path: "disclaimer", component: DisclaimerComponent },
  { path: "contact-us", component: ContactComponent },
  { path: "**", component: PagenotfoundComponent }, // Wildcard route for 404 page
];

@NgModule({
  imports: [CommonModule, BrowserModule, RouterModule.forRoot(routes)],
  exports: [],
})
export class AppRoutingModule {}
