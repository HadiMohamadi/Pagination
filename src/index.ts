import * as $ from "jquery"
import {Pagination } from './module'

var table = $(".container")
let paginator = new Pagination(table)
paginator.SetOptions({
    sort:{
        key:'',
        order:'ASCEND'
    },
    columns:[{
        key: 'capsule_id',
        valueType: 'string',
        sortEnabled: true
    },{
        key: 'capsule_serial',
        valueType: 'string'
    },{
        key: 'details',
        valueType: 'string'
    },{
        key: 'status',
        valueType: 'string'
    },{
        key: 'type',
        valueType: 'string'
    }],
    containers:{
        content:'#table-content',
        filter:'#filter-section',
        pager:''
    },
    selectors:{
        submit:'.search-btn',
        filter:'.form-control',
        page:'.page-btn'
    },
    api:{
        url: 'https://api.spacexdata.com/v2/parts/caps',
        method: 'GET'
    },
    pager:{
        enabled: true,
        pageSize:10,
    }
})
paginator.Init()





