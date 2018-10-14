import * as $ from "jquery"
import { IOptions } from './options'
import { Paginate } from './paginate'

interface IPagination {
  data: any[]
  Init(): void
  Search(): void
  SetOptions(options: IOptions)
}

export class Pagination implements IPagination {

  private paginationOptions: IOptions
  private baseElement: JQuery
  data: any[]
  private Pager : Paginate
  private lastSortKey: string

  constructor(element: JQuery) {
    this.baseElement = element
  }

  Init() {
    $(this.paginationOptions.selectors.submit).bind('click', () => this.Search())
    $(this.baseElement).find("[sort=enabled]").bind('click', (e) => this.SortClick(e))
    if(this.paginationOptions.pager.enabled)
      $(this.paginationOptions.selectors.page).bind('click', (e) => this.PageClick(e))
  }

  SetOptions(options: IOptions) {
    this.paginationOptions = options
    if(this.paginationOptions.pager.enabled)
      this.Pager = new Paginate($(this.paginationOptions.containers.content).find("tfoot"), this.paginationOptions)
    this.SetHeaders()
  }

  private SetHeaders(){
    var tr = $("<tr>")
    this.paginationOptions.columns.forEach(function (column) {
      var td = $("<td>")
      $(td).attr("scope","col").attr("name",column.key)
      if(column.sortEnabled)
        $(td).attr("sort","enabled")

      td.text(column.key).appendTo(tr)
    }.bind(this));

    $(tr).appendTo($(this.paginationOptions.containers.content).find("thead")[0])
  }

  private RemoveRows() {
    $(this.paginationOptions.containers.content).find("tbody")[0].innerHTML = ''
  }

  Search() {   
    this.RemoveRows()
    this.SendRequest()
  }

  private PageClick(e) {
    this.Pager.pagerOptions.currentPage = e.target.attributes.getNamedItem('page-number').value
    this.Search()
  }

  private SortClick(e) {    
    this.paginationOptions.sort.key = e.target.attributes.getNamedItem('name').value

    if(this.lastSortKey == this.paginationOptions.sort.key )
    {
      if(this.paginationOptions.sort.order == "ASCEND")
        this.paginationOptions.sort.order = "DESCEND"
      else
        this.paginationOptions.sort.order = "ASCEND"
    }

    this.Search()
  }

  private SendRequest() {
    let formData = {}
    //if(this.paginationOptions.api.method == "POST")
      formData = this.SerializeData()
      console.log("fromData", formData)
    let xhttp
    if ((<any>window).XMLHttpRequest) {
      xhttp = new XMLHttpRequest()
    } else {
      xhttp = new ActiveXObject("Microsoft.XMLHTTP")
    }

    xhttp.open(this.paginationOptions.api.method, this.paginationOptions.api.url, true)
    xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8")

    let Response
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        Response = JSON.parse(xhttp.responseText)
        this.AppendRows(Response)
        return
      }
      else if (xhttp.status == 500) {
        console.log("Failed To Fetch Data")
      }
    };

    xhttp.send(JSON.stringify(formData));
  }

  private SerializeData(): any {
    var filterData = {}
    $(this.paginationOptions.containers.filter).find(this.paginationOptions.selectors.filter).each(function () {
      if ($(this).attr("name") !== undefined)
        filterData[$(this).attr("name")] = $(this).val()
      else
        filterData[$(this).attr("id")] = $(this).val()
    });
    filterData["page"] = this.paginationOptions.pager.currentPage
    filterData["sort"] = this.paginationOptions.sort.key
    filterData["order"] = this.paginationOptions.sort.order
    
    return filterData;
  }

  private AppendRows(data: any[]) {
    this.data = data
    this.Pager.pagerOptions.totalItems = data.length
    let itemsToShow = data.splice(((this.Pager.pagerOptions.currentPage - 1)* this.Pager.pagerOptions.pageSize), this.Pager.pagerOptions.pageSize)

    itemsToShow.forEach(function (value) {
      this.AppendRow(value)
    }.bind(this))

    this.Pager.Initialize()
    this.Init()
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
}
