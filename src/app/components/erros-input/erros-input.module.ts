import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ErrosInputComponent } from "./erros-input.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

@NgModule({
  declarations: [ErrosInputComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [ErrosInputComponent]
})
export class ErrosInputModule {}
