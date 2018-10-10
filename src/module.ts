import * as $ from "jquery"
import { IOptions } from './options'

interface IPagination {
  Init(): void
  Search(): void
  SetOptions(options: IOptions): IPagination
}

export class Pagination implements IPagination {

  private paginationOptions: IOptions
  private baseElement: JQuery
  private ListData: any[]

  constructor(element: JQuery) {
    this.baseElement = element
  }

  Init() {
    $(this.paginationOptions.selectors.submit).bind('click', () => this.Search())
  }

  SetOptions(options: IOptions) {
    this.paginationOptions = options
    return this
  }
  
  Search() {
    this.SendRequest()
    this.RemoveRows()
  }

  private RemoveRows() {
    $(this.paginationOptions.containers.content).find("tbody")[0].innerHTML = ''
  }

  private AppendRows(data: any[]) {
    let columnsKey = this.paginationOptions.columns.map(o => o.key)
    let reducedData = columnsKey.reduce((obj, key) =>
    ({ 
        ...obj, 
        [key]: data[key],
    }),{})

    console.log("reduced Data", reducedData)
    data.forEach(function (value) {
      this.AppendRow(value)
    }.bind(this))
  }

  private AppendRow(data: any) {
    if (data === undefined)
      return

    var Row = $("<tr>")
    $.each(Object.keys(data), function (index, key) {
      if (this.paginationOptions.columns !== undefined && this.paginationOptions.columns.find(o => o.key == key) === undefined)
        return

      var Column = $("<td>")
      Column.text(data[key]).appendTo(Row)
    }.bind(this));

    $(Row).appendTo($(this.paginationOptions.containers.content).find("tbody")[0])
  }

  private SerializeData(): any {
    var filterData = {}
    $(this.paginationOptions.containers.filter).find(this.paginationOptions.selectors.filter).each(function () {
      if ($(this).attr("name") !== undefined)
        filterData[$(this).attr("name")] = $(this).val()
      else
        filterData[$(this).attr("id")] = $(this).val()
    });
    return filterData;
  }

  private SendRequest() {
    let formData = this.SerializeData()
    let xhttp
    if ((<any>window).XMLHttpRequest) {
      xhttp = new XMLHttpRequest()
    } else {
      xhttp = new ActiveXObject("Microsoft.XMLHTTP")
    }

    xhttp.open(this.paginationOptions.api.method, this.paginationOptions.api.url, true)
    xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");

    let Response
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        Response = JSON.parse(xhttp.responseText)
        this.AppendRows(Response)
      }
      else if (xhttp.status == 500) {
        console.log("Failed To Fetch Data")
      }
    };

    xhttp.send(JSON.stringify(formData));
  }
}
