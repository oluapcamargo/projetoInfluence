import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "yesNo"
})
export class YesNoPipe implements PipeTransform {
  transform(items: any): any {
    if (items.toString() == "true") return "Sim";
    if (items.toString() == "false") return "Não";

    return items;
  }
}
