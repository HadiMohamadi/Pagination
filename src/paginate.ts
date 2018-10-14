import { IOptions, IPager } from './options'

export class Paginate {

    opts: IOptions
    pagerOptions: IPager
    pagerHolderElement: JQuery
    pages: number[]
    defaultPageSizes = [25,50,100]

    constructor(element: JQuery, options: IOptions) {
        this.opts = options
        this.pagerOptions = options.pager
        this.pagerOptions.currentPage = 1
        this.pagerHolderElement = element
        console.log("opts", this.opts)
    }
//callback?: () => any
    Initialize = (callback?: () => void) => {
        let totalPages = Math.ceil(this.pagerOptions.totalItems / this.pagerOptions.pageSize)
        let startPage, endPage
        if (this.pagerOptions.currentPage < 1)
            this.pagerOptions.currentPage = 1
        else if (this.pagerOptions.currentPage > totalPages)
            this.pagerOptions.currentPage = totalPages

        let maxPagesBeforeCurrentPage = Math.floor(totalPages / 2);
        let maxPagesAfterCurrentPage = Math.ceil(totalPages / 2) - 1;
        if (this.pagerOptions.currentPage <= maxPagesBeforeCurrentPage) {
            // current page near the start
            startPage = 1;
            endPage = totalPages;
        } else if (this.pagerOptions.currentPage + maxPagesAfterCurrentPage >= totalPages) {
            // current page near the end
            startPage = totalPages - totalPages + 1;
            endPage = totalPages;
        } else {
            // current page somewhere in the middle
            startPage = this.pagerOptions.currentPage - maxPagesBeforeCurrentPage;
            endPage = this.pagerOptions.currentPage + maxPagesAfterCurrentPage;
        }

        let startIndex = (this.pagerOptions.currentPage - 1) * this.pagerOptions.pageSize;
        let endIndex = Math.min(startIndex + this.pagerOptions.pageSize - 1, this.pagerOptions.totalItems - 1)

        let pagesRange = Array.apply(null, { length: ((endPage + 1) - startPage) }).map(Number.call, Number)
        this.pages = pagesRange.map(o => o + 1 )
        this.createPages()

        if(callback !=undefined)
        {
            callback()
            console.log("after callback")    
        }
    }

    private createPages = () => {
        this.removePagination()
        var Row = $("<tr>")
        var UL = $("<ul>")

        this.pages.forEach(function (pageNumber) {
            let li = $("<li>")
            li.text(pageNumber)
            li.attr("page-number", pageNumber)
            li.addClass(this.opts.selectors.page.replace(".",""))

            if(this.pagerOptions.currentPage == pageNumber)
                li.addClass("active")

            $(li).appendTo($(UL))
        }.bind(this));
        $(UL).appendTo($(Row))
        $(Row).appendTo($(this.pagerHolderElement))
    }
    private removePagination(){
        console.log("Pagination Removed")
        $(this.pagerHolderElement).html('')
    }
}