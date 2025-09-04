import { useState } from "react";
import ReactPaginate from "react-paginate";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

export const TableView = ({
  columns = [],
  data = [],
  customElement = <></>,
}) => {
  const [pageNumber, setPageNumber] = useState(0);
  const [usersPerPage, setUserPerPage] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");

  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(data.length / usersPerPage);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="top-space-search-reslute">
      <div className="tab-content px-2 md:!px-4">
        <div className="parentProduceSearch">
          <div className="entries">
            <small>show</small>{" "}
            <select
              value={usersPerPage}
              onChange={(e) => setUserPerPage(Number(e.target.value))}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>{" "}
            <small>entries</small>
          </div>
          <div className="table-search-box-info">
            <input
              onChange={(e) => setGlobalFilter(e.target.value)}
              type="search"
              placeholder="search"
            />
          </div>
        </div>

        {customElement}

        <div className="tab-pane active" id="header" role="tabpanel">
          <div
            id="datatable_wrapper"
            className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive"
          >
            <table 
              id="example"
              className="display table table-bordered borderTerpProduce"
              style={{ width: "100%" }}
            >
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(pagesVisited, pagesVisited + usersPerPage)
                  .map((row) => (
                    <tr key={row.id} className="rowCursorPointer">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <ReactPaginate
                previousLabel={"previous"}
                nextLabel={"next"}
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
