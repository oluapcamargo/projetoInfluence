import {
  Component,
  OnInit,
  ElementRef,
  Output,
  EventEmitter,
  Input,
  ContentChildren
} from "@angular/core";
import { TabEmployeeType } from "src/app/models/tabEmployee";
import { StoreEmployeeType } from "src/app/models/storyEmployee";

@Component({
  selector: "app-tab-employees",
  templateUrl: "./tab-employees.component.html",
  styleUrls: ["./tab-employees.component.scss"]
})
export class TabEmployeesComponent implements OnInit {
  @Output() dataProfissionalModal = new EventEmitter();
  @Output() dataProfissionalModalRemover = new EventEmitter();

  @Input() dataProfissional = [];
  searchText: string;
  dataAux = [];
  isOrdered = false;
  elementosComClickInserido = [];
  defaultColumns = [
    {
      field: "nome",
      type: "text",
      name: "Nome do Profissional"
    },
    { field: "situacao", type: "ativarEditar", name: "Ações" }
  ];

  filter: TabEmployeeType = new TabEmployeeType();
  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    if (this.dataProfissional == null || this.dataProfissional == undefined)
      this.dataProfissional = [];

    this.addEvent();
  }
  search(event) {}
  newValue() {
    if (this.filter != undefined && this.filter != null)
      this.dataProfissional.push(this.filter);
    this.dataProfissionalModal.emit(this.filter);
    this.addEvent();
    this.filter = new TabEmployeeType();
  }

  addEvent() {
    setTimeout(() => {
      let allElements = this.elementRef.nativeElement.getElementsByTagName(
        "mat-icon"
      );
      let count = 0;
      for (const item of this.dataProfissional) {
        for (let k = 0; k < 2; k++) {
          const element = allElements[count];
          let nome = item.nome;
          if (!this.elementosComClickInserido.includes(element)) {
            element.addEventListener(
              "click",
              () => {
                element.getAttribute("eventName") == "Editar"
                  ? this.detail(nome)
                  : this.remover(nome);
              },
              false
            );
            this.elementosComClickInserido.push(element);
          }
          // }
          count += 1;
        }
      }
    }, 1000);
  }

  remover(nome: String) {
    let dataAux = [];
    this.dataProfissional.forEach(element => {
      if (element.nome != nome) {
        dataAux.push(element);
        if (element.nome == nome)
          this.dataProfissionalModalRemover.emit(element);
      }
    });
    this.dataProfissional = [];
    this.dataProfissional = dataAux;
  }

  detail(nome) {
    this.dataProfissional.forEach(element => {
      if (element.nome == nome) {
        this.filter["nome"] = nome;
        this.remover(nome);
      }
    });
  }

  order(column: string = "nome") {
    this.dataProfissional = this.dataAux.sort((a, b) => {
      const first =
        a[column] != undefined
          ? a[column] && typeof a[column] === "number"
            ? a[column]
            : typeof a[column] === "number"
            ? a[column]
            : a[column].toLowerCase()
          : 0;
      const next =
        b[column] != undefined
          ? b[column] && typeof b[column] === "number"
            ? b[column]
            : typeof b[column] === "number"
            ? b[column]
            : b[column].toLowerCase()
          : 0;

      if (!this.isOrdered) {
        return first > next ? 1 : -1;
      } else {
        return first < next ? 1 : -1;
      }
    });
    this.isOrdered = !this.isOrdered;
  }
}
