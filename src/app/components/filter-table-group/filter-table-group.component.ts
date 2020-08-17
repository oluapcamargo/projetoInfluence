import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { GroupService } from "src/app/services/group.service";
import * as jwt_decode from "jwt-decode";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-filter-table-group",
  templateUrl: "./filter-table-group.component.html",
  styleUrls: ["./filter-table-group.component.scss"]
})
export class FilterTableComponent implements OnInit {
  @Output() itemChanged = new EventEmitter();

  grupos = [];
  selectedItem = "0";
  sid = "";
  constructor(
    private groupService: GroupService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const accessToken = this.authService.getToken();
    const { sid } = jwt_decode(accessToken);
    this.sid = sid;
    this.fetchCompany(sid);
  }

  fetchCompany(id: string) {
    this.groupService.fetchGroupPermissions(id).subscribe(({ value }) => {
      this.grupos.push(value);
    });
  }
}
