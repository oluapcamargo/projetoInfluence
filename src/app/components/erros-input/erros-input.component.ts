import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { FormGroup, NgForm } from "@angular/forms";

@Component({
  selector: "app-erros-input",
  templateUrl: "./erros-input.component.html",
  styleUrls: ["./erros-input.component.scss"]
})
export class ErrosInputComponent implements OnInit, OnChanges {
  @Input() form: FormGroup | NgForm;
  @Input() campo: string;
  @Input() mensagemObrigatorio = "* Este campo é obrigatório.";

  constructor() {}

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
  }
}
