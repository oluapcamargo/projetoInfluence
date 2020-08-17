import { environment } from './../../environments/environment'
import { Injectable } from '@angular/core'
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { throwError } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  private URL_API = environment.BASE_URL

  constructor() {}

  url = (path: string) => this.URL_API + path

  headers() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ``,
      }),
    }
    return httpOptions
  }

  handleError(error: HttpErrorResponse) {
    if (error) {
      return throwError(error)
    }

    if (error instanceof ErrorEvent) {
      console.error('Error foi:', error.message)
    } else {
      console.error(
        `Backend retornou o codigo ${error.status}, ` +
          `body foi: ${error.error.json}`
      )
    }
    return throwError(
      'Confira se os dados estão corretos, ou tente novamente mais tarde.'
    )
  }
}
