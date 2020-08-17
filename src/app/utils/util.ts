import { Injectable } from "@angular/core";
import { CurrentUserService } from "../services/current-user.service";
import { HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class Util {
  constructor(public uService: CurrentUserService) {}

  controlActionsTable(columns, ...permissions) {
    if (
      !this.uService.validatePermissions(permissions[0]) &&
      !this.uService.validatePermissions(permissions[1])
    ) {
      return columns.filter(e => e.type !== "actions");
    } else {
      return columns;
    }
  }

  removeNullValuesFromQueryParams(params: HttpParams) {
    const paramsKeysAux = params.keys();
    paramsKeysAux.forEach(key => {
      const value = params.get(key);
      if (value === null || value === undefined || value === "") {
        params["map"].delete(key);
      }
    });

    return params;
  }

  IsPhoneValid(phone: string) {
    if (!phone) return false;

    phone = phone.replace(" ", "");
    //it's ok when phone is similar to xxxxxxxxxxx

    if (phone.length < 11) return false;

    return true;
  }

  IsEmailValid(email: string) {
    if (!email) return false;

    var regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var resul = regexEmail.test(email);
    return resul;
  }

  IsCnpjValid(cnpj: any) {
    // Verifica se a variável cnpj é igua a "undefined", exibindo uma msg de erro
    if (cnpj === undefined) {
      return false;
    }

    // Esta função retira os caracteres . / - da string do cnpj, deixando apenas os números
    var strCNPJ = cnpj
      .replace(".", "")
      .replace(".", "")
      .replace("/", "")
      .replace("-", "");

    // Testa as sequencias que possuem todos os dígitos iguais e se o cnpj não tem 14 dígitos, retonando falso e exibindo uma msg de erro
    if (
      strCNPJ === "00000000000000" ||
      strCNPJ === "11111111111111" ||
      strCNPJ === "22222222222222" ||
      strCNPJ === "33333333333333" ||
      strCNPJ === "44444444444444" ||
      strCNPJ === "55555555555555" ||
      strCNPJ === "66666666666666" ||
      strCNPJ === "77777777777777" ||
      strCNPJ === "88888888888888" ||
      strCNPJ === "99999999999999" ||
      strCNPJ.length !== 14
    ) {
      return false;
    }

    // A variável numeros pega o bloco com os números sem o DV, a variavel digitos pega apenas os dois ultimos numeros (Digito Verificador).
    var tamanho = strCNPJ.length - 2;
    var numeros = strCNPJ.substring(0, tamanho);
    var digitos = strCNPJ.substring(tamanho);
    var soma = 0;
    var pos = tamanho - 7;

    // Os quatro blocos seguintes de funções irá reaizar a validação do CNPJ propriamente dito, conferindo se o DV bate. Caso alguma das funções não consiga verificar
    // o DV corretamente, mostrará uma mensagem de erro ao usuário e retornará falso, para que o usário posso digitar novamente um número
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }

    var resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) {
      return false;
    }

    tamanho = tamanho + 1;
    numeros = strCNPJ.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let k = tamanho; k >= 1; k--) {
      soma += numeros.charAt(tamanho - k) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(1)) {
      return false;
    }
    return true;
  }

  convertBase64ToBlobData(
    base64Data: string,
    contentType: string = "image/png",
    sliceSize = 512
  ) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}