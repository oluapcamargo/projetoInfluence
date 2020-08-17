import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { MunicipioType } from "src/app/models/municipio";
import { NbToastrService, NbDialogRef } from "@nebular/theme";
import { StoreService } from "../../services/store.service";
import { PromotionsService } from "../../services/promotion.service";
import { UtilService } from "../../services/util.service";
import {
  NbLayoutModule,
  NbSidebarModule,
  NbButtonModule,
  NbCheckboxModule,
  NbCardModule,
  NbSelectModule,
  NbInputModule
} from "@nebular/theme";
import { FilterStorePromotion } from "src/app/models/filterStorePromotion";

@Component({
  selector: "app-tab-store-promotion",
  templateUrl: "./tab-store-promotion.component.html",
  styleUrls: ["./tab-store-promotion.component.scss"]
})
export class TabStorePromotionComponent implements OnInit {
  Municipio: any[];
  Bairro: any[];
  Estados: any[];
  estabelecimentos: any[];
  filter: FilterStorePromotion = new FilterStorePromotion();
  checkRemove = false;
  checkAdd = false;
  Estabelecimentos = [];
  estabelecimentosListados: [];
  estabelecimentosAdd: any;
  EstabelecimentoToAddTemp: any;
  EstabelecimentoToAddedTemp: any;

  @Output() dataStorePromotionModal = new EventEmitter();
  @Input() data = [];

  estabelecimentosAdded: any;
  constructor(
    private promotionsService: PromotionsService,
    private utilService: UtilService,
    private nbToastrService: NbToastrService,
    private storeService: StoreService
  ) {}

  ngOnInit() {
    this.fetchUF();
    this.Estabelecimentos = [];
    this.EstabelecimentoToAddTemp = [];
    this.EstabelecimentoToAddedTemp = [];
    this.estabelecimentosAdded = [];
    this.estabelecimentosAdd = [];
    if (this.data.length > 0) this.estabelecimentosAdded = this.data;
  }
  fetchUF() {
    this.utilService.UF().subscribe(({ value }) => {
      this.Estados = value.map(item => {
        return {
          ...item
        };
      });
    });
  }
  fetchMunicipios(code: string) {
    this.utilService.Municipio(code).subscribe(({ value }) => {
      this.Municipio = value.map(item => {
        return {
          ...item
        };
      });
    });
  }

  ngOnChanges() {
    this.dataStorePromotionModal.emit(this.estabelecimentosAdded);
    this.EstabelecimentoToAddedTemp = [];
    if (
      this.estabelecimentosAdded != undefined &&
      this.estabelecimentosAdded.length > 0
    )
      this.estabelecimentosAdded.sort((a, b) => a.nome.localeCompare(b.nome));
    if (
      this.estabelecimentosAdd != undefined &&
      this.estabelecimentosAdd.length > 0
    )
      this.estabelecimentosAdd.sort((a, b) => a.nome.localeCompare(b.nome));
  }

  setPermission(value, event) {
    this.setValueToggle(value, event, this.EstabelecimentoToAddTemp);
  }

  setPermissionsadded(value, event) {
    this.setValueToggle(value, event, this.EstabelecimentoToAddedTemp);
  }

  AddAll(event) {
    this.checkAdd = event;
    this.changeValueInArrays(
      event,
      this.Estabelecimentos,
      this.EstabelecimentoToAddTemp
    );

    if (!event) {
      this.EstabelecimentoToAddTemp = [];
    }
  }

  removeEstabelecimentosInUser() {
    if (this.EstabelecimentoToAddedTemp.length > 0) {
      this.estabelecimentosAdded.forEach(e => {
        this.EstabelecimentoToAddedTemp.forEach(id => {
          if (e.id === id) {
            this.removeEstabelecimentoAdded(e);
          }
        });
      });
    } else {
      this.nbToastrService.warning("Escolha ao menos uma permissão", "Atenção");
      return;
    }
    this.ngOnChanges();
  }

  removeEstabelecimentoAdded(estabelecimento) {
    this.estabelecimentosAdd.push(estabelecimento);
    let limparLista = this.estabelecimentosAdded;
    this.estabelecimentosAdded = [];
    limparLista.forEach(elementList => {
      if (elementList.id != estabelecimento.id)
        this.estabelecimentosAdded.push(elementList);
    });
    this.ngOnChanges();
  }
  addPermissionBack(item) {
    delete item.check;
    this.Estabelecimentos.push(item);
  }

  EstabelecimentoAddedAll(event) {
    this.checkRemove = event;
    this.changeValueInArrays(
      event,
      this.estabelecimentosAdded,
      this.EstabelecimentoToAddedTemp
    );
  }

  setEstabelecimentoInUser() {
    this.EstabelecimentoToAddTemp.forEach(element => {
      this.estabelecimentosAdded.push(
        this.Estabelecimentos.find(item => item.id == element)
      );
      let listaNova = this.estabelecimentosAdd;
      this.estabelecimentosAdd = [];
      listaNova.forEach(elementList => {
        if (elementList.id != element)
          this.estabelecimentosAdd.push(elementList);
      });
    });
    this.EstabelecimentoToAddTemp = [];
    this.ngOnChanges();
  }

  hasTooltip() {
    const tooltip = document.querySelectorAll(
      "div.cdk-overlay-container > div.cdk-overlay-connected-position-bounding-box"
    );
    tooltip[0].remove();
  }
  showSuccess() {
    this.nbToastrService.success("Registro alterado com sucesso", "Sucesso", {
      duration: 3000,
      preventDuplicates: true
    });
  }

  showError() {
    this.nbToastrService.danger("Falha ao alterar registro", "Falha", {
      duration: 3000
    });
  }

  searchEstabelecimento() {
    if (this.filter != undefined && this.filter != null) {
      this.storeService
        .fetchEstabPromoTab(this.filter)
        .subscribe(({ value }) => {
          this.Estabelecimentos = value.map(item => {
            return {
              ...item
            };
          });

          this.estabelecimentosAdd = [];
          this.Estabelecimentos.forEach(element => {
            this.estabelecimentosAdd.push(element);
          });
          this.estabelecimentosAdd.sort((a, b) => a.nome.localeCompare(b.nome));
        });
    } else {
      this.nbToastrService.warning(
        "É necessário o preenchimento de algum filtro para realizar a busca.",
        "Atenção",
        {
          duration: 2000
        }
      );
    }
  }

  fetchBairros(code: string) {
    this.utilService.Bairro(code).subscribe(({ value }) => {
      this.Bairro = value.map(item => {
        return {
          ...item
        };
      });
    });
  }

  EstabelecimentosAddedAll(event) {}
  setEstabelecimentosAdd(id, event) {}

  PermissionsToAddAll(event) {
    this.checkAdd = event;
    this.changeValueInArrays(
      event,
      this.estabelecimentos,
      this.estabelecimentosAdd
    );

    if (!event) {
      this.estabelecimentosAdd = [];
    }
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
}
