import { Injectable, EventEmitter } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ServerService } from './server.service'
import { catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  isModalToClose = new EventEmitter()
  deleteRow = new EventEmitter()

  constructor(private http: HttpClient, private server: ServerService) {}

  closeModal(close: boolean) {
    this.isModalToClose.emit(close)
  }

  deleteItem(eventName: string, code: string) {
    this.deleteRow.emit({ eventName, code, deleteRow: true })
  }

  download(route: string) {
    return this.http
      .get(this.server.url(`/${route}`))
      .pipe(catchError(this.server.handleError))
  }
}
