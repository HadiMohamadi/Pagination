export interface IOptions {
    sort?: ISort,
    containers?:IContainers,
    pager?:IPager,
    selectors?:ISelectors
    columns?: IColumns[],
    api: IAjax
  }

  export interface ISelectors{
    filter: string,
    submit: string,
    page: string,
  }
  export interface IContainers{
      filter: string,
      content: string,
      pager: string
  }
  
  export interface IColumns {
    key: string,
    beforeDisplay?: any,
    valueType: string,
  }
  export interface ISort {
    key: string
    order: "ASCEND" | "DESCEND"
  }
  export interface IPager {
    itemsPerPage: number,
  }
  export interface IAjax {
    url: string,
    method: 'GET' | 'POST'
  }