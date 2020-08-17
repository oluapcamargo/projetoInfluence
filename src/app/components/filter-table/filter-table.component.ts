import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { CompanyService } from "src/app/services/company.service";
import * as jwt_decode from "jwt-decode";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-filter-table",
  templateUrl: "./filter-table.component.html",
  styleUrls: ["./filter-table.component.scss"]
})
export class FilterTableComponent implements OnInit {
  @Output() itemChanged = new EventEmitter();

  companies = [];
  selectedItem = "0";
  sid = "";
  constructor(
    private companyService: CompanyService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const accessToken = this.authService.getToken();
    const { sid } = jwt_decode(accessToken);
    this.sid = sid;
    this.fetchCompany(sid);
  }

  fetchCompany(id: string) {
    // this.companyService.fetchCompany(id).subscribe(({ value }) => {
    //   this.companies.push(value)
    // })
  }
}
