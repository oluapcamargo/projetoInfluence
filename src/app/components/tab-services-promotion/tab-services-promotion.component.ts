import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { NbToastrService, NbDialogRef } from "@nebular/theme";
import { ServiceTypeService } from "../../services/service-type.service";
import { filterTabServicePromotionType } from "src/app/models/filterTabServicePromotion";

@Component({
  selector: "app-tab-services-promotion",
  templateUrl: "./tab-services-promotion.component.html",
  styleUrls: ["./tab-services-promotion.component.scss"]
})
export class TabServicesPromotionComponent implements OnInit {
  Servicos = [];
  servicosListados: [];
  servicosAdd: any;
  ServicoToAddTemp: any;
  checkRemove = false;

  ServicoToAddedTemp: any;
  checkAdd = false;
  servicosAdded: any;
  filtro: filterTabServicePromotionType;
  @Input() data = [];
  @Output() dataServicePromotionModal = new EventEmitter();

  constructor(
    private nbToastrService: NbToastrService,
    private serviceTypeService: ServiceTypeService
  ) {}

  ngOnInit() {
    this.ServicoToAddTemp = [];
    this.ServicoToAddedTemp = [];
    this.servicosAdded = [];
    this.servicosAdd = [];
    this.filtro = new filterTabServicePromotionType();
    if (this.data.length > 0) this.servicosAdded = this.data;
  }
  AddAll(event) {
    this.checkAdd = event;

    this.changeValueInArrays(event, this.Servicos, this.servicosAdd);

    if (!event) {
      this.ServicoToAddedTemp = [];
    }
  }

  ngOnChanges() {
    this.dataServicePromotionModal.emit(this.servicosAdded);
    this.ServicoToAddedTemp = [];
    if (this.servicosAdded != undefined && this.servicosAdded.length > 0)
      this.servicosAdded.sort((a, b) => a.nome.localeCompare(b.nome));
    if (this.servicosAdd != undefined && this.servicosAdd.length > 0)
      this.servicosAdd.sort((a, b) => a.nome.localeCompare(b.nome));
  }

  changeValueInArrays(value: boolean, array, arrTemp) {
    if (value) {
      array.forEach(element => {
        element.check = true;
        this.setValueToggle(element.id, value, arrTemp);
      });
    } else {
      array.forEach(element => {
        element.check = false;
      });
      arrTemp = [];
    }
  }
  // checkRemove() {}
  searchEstabelecimento() {
    if (this.filtro != null) {
      this.serviceTypeService
        .fetchTpPromocao(this.filtro)
        .subscribe(({ value }) => {
          this.Servicos = value.map(item => {
            return {
              ...item
            };
          });
        });
      this.servicosAdd = [];
      this.Servicos.forEach(element => {
        this.servicosAdd.push(element);
      });
      this.servicosAdd.sort((a, b) => a.nome.localeCompare(b.nome));
    }
  }
  setValueToggle(value, event: boolean, arr) {
    if (event) {
      if (arr.indexOf(value) === -1) {
        arr.push(value);
      }
    } else {
      if (arr.indexOf(value) > -1) {
        const index = arr.indexOf(value);
        arr.splice(index, 1);
      }
    }
  }
  setPermission(value, event) {
    this.setValueToggle(value, event, this.ServicoToAddTemp);
  }

  setPermissionsadded(value, event) {
    this.setValueToggle(value, event, this.ServicoToAddedTemp);
  }

  removeServicoInUser() {
    if (this.ServicoToAddedTemp.length > 0) {
      this.servicosAdded.forEach(e => {
        this.ServicoToAddedTemp.forEach(id => {
          if (e.id === id) {
            this.removeServicoAdded(e);
          }
        });
      });
    } else {
      this.nbToastrService.warning("Escolha ao menos uma permissão", "Atenção");
      return;
    }
    this.ngOnChanges();
  }
  removeServicoAdded(servico) {
    this.servicosAdd.push(servico);
    let limparLista = this.servicosAdded;
    this.servicosAdded = [];
    limparLista.array.forEach(elementList => {
      if (elementList.id != servico.id) this.servicosAdded.push(elementList);
    });
    this.ngOnChanges();
  }

  setServicoInUser() {
    this.ServicoToAddTemp.forEach(element => {
      this.servicosAdded.push(this.Servicos.find(item => item.id == element));
      let listaNova = this.servicosAdd;
      this.servicosAdd = [];
      listaNova.forEach(elementList => {
        if (elementList.id != element) this.servicosAdd.push(elementList);
      });
    });
    this.ServicoToAddTemp = [];
    this.ngOnChanges();
  }

  ServicoAddedAll(event) {
    this.checkRemove = event;

    this.changeValueInArrays(
      event,
      this.servicosAdded,
      this.ServicoToAddedTemp
    );
    this.ngOnChanges();

    // if (!event) {
    //   this.servicosAdd = [];
    // }
  }
}
