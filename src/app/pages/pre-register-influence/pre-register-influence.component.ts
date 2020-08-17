import { Component, OnInit, ElementRef, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { NbToastrService } from "@nebular/theme";
import { Util } from "src/app/utils/util";
import { UtilService } from "../../services/util.service";
import { Subscription, forkJoin } from "rxjs";

import { FormBuilder, Validators } from "@angular/forms";
import { ValidateBrService } from "angular-validate-br";
import { ItemNgSelect } from "src/app/models/ngSelect";
import { ServiceTypeService } from "src/app/services/service-type.service";
import { UserService } from "src/app/services/user.service";
import { has } from "lodash";
import { UserAdd } from "src/app/models/userAdd";
@Component({
  selector: "app-pre-register-influence",
  templateUrl: "./pre-register-influence.component.html",
  styleUrls: ["./pre-register-influence.component.scss"]
})
export class PreRegisterInfluenceComponent implements OnInit {
  data = new UserAdd();
  mask = "";
  Estados: ItemNgSelect[] = [
    {
      id: 1,
      label: "Espírito Santo"
    },
    {
      id: 2,
      label: "Minas Gerais"
    },
    {
      id: 3,
      label: "Rio de Janeiro"
    },
    {
      id: 4,
      label: "São Paulo"
    }
  ];

  Municipio: ItemNgSelect[] = [
    {
      id: 1,
      label: "Vitória"
    },
    {
      id: 2,
      label: "Vila Velha"
    },
    {
      id: 3,
      label: "Serra"
    },
    {
      id: 4,
      label: "Viana"
    }
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,

    private userService: UserService,
    private nbToastrService: NbToastrService,
    private util: Util,
    private utilService: UtilService,
    private serviceTypeService: ServiceTypeService,
    private elementRef: ElementRef,
    private validateBrService: ValidateBrService
  ) {}

  influenceForm = this.fb.group({
    documento: ["", [Validators.required, Validators.maxLength(18)]],
    nome: ["", [Validators.required, Validators.maxLength(100)]],
    email: ["", [Validators.required, Validators.email]],
    telefone: ["", [Validators.required, Validators.maxLength(100)]],
    password: ["", [Validators.required, Validators.maxLength(100)]],
    passwordConfirm: ["", [Validators.required, Validators.maxLength(100)]]
  });

  ngOnInit() {
    this.data = new UserAdd();
  }

  cpfcnpjmask() {
    const value = this.influenceForm.get("documento").value;
    console.log(value, value.length, this.influenceForm);
    if (value.length <= 14) {
      this.mask = "00.000.000/0000-00";
    } else {
      this.mask = "00.000.0000-00";
    }
  }

  goBack() {
    this.router.navigate(["/login"]);
  }

  showErrorToastr(
    menssagem: string = "Falha ao salvar/carregar o registro.",
    erro: any
  ) {
    if (erro.error) {
      Object.entries(erro.error).map(erroEncontrado => {
        console.error(erroEncontrado);
        this.nbToastrService.warning(erroEncontrado, "Falha", {
          duration: 4000
        });
      });
    } else {
      this.nbToastrService.warning(menssagem, "Falha", {
        duration: 2000
      });
    }
  }

  newStore() {
    this.userService.save(this.data).subscribe(
      res => {
        if (res.hasSuccess) {
          this.nbToastrService.success(
            "Registro salvo com sucesso",
            "Sucesso",
            {
              duration: 4000
            }
          );
          this.goBack();
        } else
          this.nbToastrService.danger(res.errors[0], "Falha", {
            duration: 5000
          });
      },
      () => {
        this.nbToastrService.danger("Falha ao salvar o registro", "Falha", {
          duration: 5000
        });
        this.goBack();
      }
    );
  }
}
