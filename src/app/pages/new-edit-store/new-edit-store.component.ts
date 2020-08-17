import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ValidateBrService } from "angular-validate-br";
import { StoreType } from "src/app/models/store";
import { ItemNgSelect } from "src/app/models/ngSelect";
import { Subscription, forkJoin } from "rxjs";
import { UtilService } from "src/app/services/util.service";
import { UFType } from "src/app/models/uf";
import { APIResponse } from "src/app/models/requests";
import { MunicipioType } from "src/app/models/municipio";
import { BairroType } from "src/app/models/bairro";
import { AlertService } from "src/app/services/alert.service";
import { ActivatedRoute } from "@angular/router";
import { StoreService } from "src/app/services/store.service";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { returnDaysOfWeek } from "src/app/models/daysOfWeek";
import { returnPossibleHours } from "src/app/models/hoursOfDay";

@Component({
  selector: "app-new-edit-store",
  templateUrl: "./new-edit-store.component.html",
  styleUrls: ["./new-edit-store.component.scss"]
})
export class NewEditStoreComponent implements OnInit, OnDestroy {
  isFetching = false;
  estados = [] as UFType[];
  municipios = [];
  bairros = [];
  subscriptions = new Subscription();
  data = new StoreType();
  dscLetterCounter = 0;
  daysOfWeek = returnDaysOfWeek();
  hoursOfDay = returnPossibleHours(7, 24);
  itemsStoreType: ItemNgSelect[] = [
    {
      id: 1,
      label: "Serviço"
    },
    {
      id: 2,
      label: "Evento"
    }
  ];
  storeForm = this.fb.group({
    cnpj: [
      "",
      [
        Validators.required,
        Validators.maxLength(18),
        this.validateBrService.cnpj
      ]
    ],
    nome: ["", [Validators.required, Validators.maxLength(100)]],
    tipoEstabelecimento: [null],
    responsavel: ["", [Validators.required, Validators.maxLength(100)]],
    percentualTaxaIsalon: [null],
    flagDestaque: [false],
    descricao: ["", [Validators.required, Validators.maxLength(8000)]],
    cep: [
      "",
      [Validators.required, Validators.minLength(8), Validators.maxLength(10)]
    ],
    ufId: [null, [Validators.required]],
    municipioId: [{ value: null, disabled: true }, [Validators.required]],
    bairroId: [{ value: null, disabled: true }, [Validators.required]],
    rua: ["", [Validators.required, Validators.maxLength(500)]],
    numeroEndereco: [null, [Validators.required, Validators.maxLength(10)]],
    complementoEndereco: [null, [Validators.maxLength(500)]],
    telefone: [null, [Validators.required]],
    enderecoEmail: [null, [Validators.required, Validators.maxLength(50)]],
    enderecoSite: [null, [Validators.maxLength(1000)]],
    diaInicioAtendimentoPadrao: [null, [Validators.required]],
    diaFimAtendimentoPadrao: [null, [Validators.required]],
    horaInicioAtendimentoPadrao: [null, [Validators.required]],
    horaFimAtendimentoPadrao: [null, [Validators.required]]
  });
  finish = false;

  constructor(
    private fb: FormBuilder,
    private alerta: AlertService,
    private utilService: UtilService,
    private storeService: StoreService,
    private activatedRoute: ActivatedRoute,
    private loadingService: LoadingBarService,
    private validateBrService: ValidateBrService
  ) {}

  ngOnInit() {
    this.configLoading();
    this.getQueryParams();
    this.fetchAllData();
    this.watchChangeUF();
    this.watchChangeMunicipios();
    this.watchChangeDscLetterCounter();
  }

  configLoading() {
    this.subscriptions.add(
      this.loadingService.progress$.subscribe(value => {
        this.isFetching = value && value < 100;
      })
    );
  }

  getQueryParams() {
    this.subscriptions.add(
      this.activatedRoute.queryParams.subscribe(params => {
        if (params && params.id) {
          this.data.id = params.id;
        }
      })
    );
  }

  fetchAllData() {
    if (this.data && this.data.id) {
      this.subscriptions.add(
        forkJoin({
          ufResponse: this.returnFetchUF(),
          storeResponse: this.returnFetchStore()
        }).subscribe(responses => {
          if (responses && responses.ufResponse) {
            this.handeUFResponse(responses.ufResponse);
          }

          if (responses && responses.storeResponse) {
            this.handleStoreResponse(responses.storeResponse);
          }
        })
      );
    } else {
      this.subscriptions.add(
        forkJoin({
          ufResponse: this.returnFetchUF()
        }).subscribe(responses => {
          if (responses && responses.ufResponse) {
            this.handeUFResponse(responses.ufResponse);
          }
        })
      );
    }
  }

  returnFetchUF() {
    return this.utilService.UF();
  }

  returnFetchStore() {
    return this.storeService.fetchByEstabId(this.data?.id || 0);
  }

  async fetchMunicipios() {
    const selectedEstado = this.storeForm.get("ufId")?.value;
    if (selectedEstado) {
      try {
        const response = await this.utilService
          .Municipio(selectedEstado)
          .toPromise();
        this.municipios = response.value as MunicipioType[];
      } catch (ex) {
        console.error(ex);
      }
    } else {
      console.error("Nenhum município selecionado");
      this.alerta.error(
        "Os municípios não foram carregados pois não há nenhum estado selecionado."
      );
    }
  }

  async fetchBairros() {
    const selectedMunicipio = this.storeForm.get("municipioId")?.value;
    if (selectedMunicipio) {
      try {
        const response = await this.utilService
          .Bairro(selectedMunicipio)
          .toPromise();
        this.bairros = response.value as BairroType[];
      } catch (ex) {
        console.error(ex);
      }
    } else {
      console.error("Nenhum bairro selecionado");
      this.alerta.error(
        "Os bairros não foram carregados pois não há nenhum município selecionado."
      );
    }
  }

  handeUFResponse(response: APIResponse) {
    const formattedResponse = response.value as UFType[];
    this.estados = formattedResponse;
    this.municipios = [];
    this.bairros = [];
  }

  handleStoreResponse(response: APIResponse) {
    const formattedResponse = response.value as StoreType;
    if (formattedResponse && formattedResponse.id) {
      this.data = response.value;
      this.storeForm.patchValue(this.data);
    }
  }

  onSubmit() {
    this.storeForm.markAllAsTouched();
    alert("foi");
  }

  watchChangeUF() {
    const formControl = this.storeForm.get("ufId");
    if (formControl) {
      this.subscriptions.add(
        formControl.valueChanges.subscribe(value => {
          const municipioFormControl = this.storeForm.get("municipioId");
          const bairroFormControl = this.storeForm.get("bairroId");
          if (value) {
            this.fetchMunicipios();
            municipioFormControl.enable();
          } else {
            municipioFormControl.reset();
            bairroFormControl.reset();
            municipioFormControl.disable();
            bairroFormControl.disable();
            this.municipios = [];
            this.bairros = [];
            municipioFormControl.updateValueAndValidity();
            bairroFormControl.updateValueAndValidity();
          }
        })
      );
    }
  }

  watchChangeMunicipios() {
    const formControl = this.storeForm.get("municipioId");
    if (formControl) {
      this.subscriptions.add(
        formControl.valueChanges.subscribe(value => {
          const bairroFormControl = this.storeForm.get("bairroId");
          if (value) {
            this.fetchBairros();
            bairroFormControl.enable();
          } else {
            bairroFormControl.reset();
            this.bairros = [];
            bairroFormControl.disable();
            bairroFormControl.updateValueAndValidity();
          }
        })
      );
    }
  }

  watchChangeDscLetterCounter() {
    const formControl = this.storeForm.get("descricao");
    if (formControl) {
      this.subscriptions.add(
        formControl.valueChanges.subscribe(value => {
          this.dscLetterCounter = (value as string).length;
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
