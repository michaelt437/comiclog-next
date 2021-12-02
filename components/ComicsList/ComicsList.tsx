import { Comicbook, SortOrder } from "../../types";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import {
  ArrowNarrowUpIcon,
  ArrowNarrowDownIcon,
  PencilAltIcon,
  XIcon
} from "@heroicons/react/outline";
import { useState, useReducer } from "react";

export default function ComicsList ({
  items,
  changeModalState,
  changeEditModalState,
  auth
}: {
  items: Comicbook[];
  changeModalState: Function;
  changeEditModalState: Function;
  auth: boolean;
}) {
  const [searchText, setSearchText] = useState<string>("");
  const initialSortState = {
    sortBy: "title",
    order: SortOrder.DESCENDING
  };

  const [sortState, dispatch] = useReducer(execSort, initialSortState);

  function filteredItems (): Comicbook[] {
    return items.filter((book) => {
      return (
        book.title.toLowerCase().indexOf(searchText.toLowerCase().trim()) >
          -1 ||
        (book.writer &&
          book.writer.toLowerCase().indexOf(searchText.toLowerCase().trim()) >
            -1) ||
        book.publisher.toLowerCase().indexOf(searchText.toLowerCase().trim()) >
          -1
      );
    });
  }

  function execSort (state, { sortColumn }) {
    return {
      sortBy: sortColumn,
      order:
        state.order === SortOrder.ASCENDING
          ? SortOrder.DESCENDING
          : SortOrder.ASCENDING
    };
  }

  return (
    <div className="rounded-md p-6 row-start-1 col-span-full">
      <div className="flex items-center flex-wrap mb-5 md:flex-nowrap">
        <h2 className="flex-shrink-0">Book List</h2>
        <div className="flex-grow w-full rounded-md md:max-w-lg md:ml-auto md:mr-4">
          <div className="relative">
            <input
              className="form-field w-full bg-gray-200 focus:bg-blueGray-50"
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
            <div
              className={`absolute w-5 h-5 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer ${
                searchText ? "" : "hidden"
              }`}
              title="Clear search"
              onClick={() => setSearchText("")}
            >
              <XIcon></XIcon>
            </div>
          </div>
        </div>
        {auth ? (
          <button
            className="btn primary"
            onClick={() => changeModalState(true)}
          >
            Add Book
          </button>
        ) : null}
      </div>
      <div className="grid-table">
        <div className="grid-table_thead bg-gray-100">
          <div
            className={`grid-table_row grid ${
              auth ? "grid-cols-10" : "grid-cols-9"
            }`}
          >
            <div
              className={`grid-table_col col-span-4 ${
                sortState.sortBy === "title" && "font-bold text-sky-800"
              }`}
              onClick={() => dispatch({ sortColumn: "title" })}
            >
              Title
              {sortState.order === SortOrder.DESCENDING ? (
                <ArrowNarrowDownIcon className="inline h-3 w-3" />
              ) : (
                <ArrowNarrowUpIcon className="inline h-3 w-3" />
              )}
            </div>
            <div
              className={`grid-table_col col-span-2 ${
                sortState.sortBy === "writer" && "font-bold text-sky-800"
              }`}
              onClick={() => setSort("writer")}
            >
              Writer
              {sortState.sortBy === "writer" ? (
                <ArrowNarrowDownIcon className="inline h-3 w-3" />
              ) : (
                <ArrowNarrowUpIcon className="inline h-3 w-3" />
              )}
            </div>
            <div
              className={`grid-table_col ${
                sortState.sortBy === "publisher" && "font-bold text-sky-800"
              }`}
              onClick={() => setSort("publisher")}
            >
              Publisher
            </div>
            <div
              className={`grid-table_col text-center ${
                sortState.sortBy === "status" && "font-bold text-sky-800"
              }`}
              onClick={() => setSort("status")}
            >
              Status
            </div>
            <div
              className={`grid-table_col text-center ${
                sortState.sortBy === "score" && "font-bold text-sky-800"
              }`}
              onClick={() => setSort("score")}
            >
              Score
            </div>
            {auth ? <div></div> : null}
          </div>
        </div>
        <OverlayScrollbarsComponent>
          <div className="grid-table_tbody max-h-96">
            {filteredItems().map((comic) => {
              return (
                <div
                  className={`grid-table_row grid hover:bg-blueGray-50 ${
                    auth ? "grid-cols-10" : "grid-cols-9"
                  }`}
                  key={comic.title}
                >
                  <div className="grid-table_col col-span-4 text-sky-600 font-medium">
                    {comic.title}
                  </div>
                  <div className="grid-table_col col-span-2">
                    {comic.writer}
                  </div>
                  <div className="grid-table_col">{comic.publisher}</div>
                  <div className="grid-table_col text-center text-green-400">
                    {comic.status ? "✔" : ""}
                  </div>
                  <div className="grid-table_col text-center text-sky-600">
                    {comic.score}
                  </div>
                  {auth ? (
                    <div className="text-center">
                      <PencilAltIcon
                        className="inline h-6 w-6 cursor-pointer opacity-50 hover:opacity-100"
                        onClick={() => changeEditModalState(true, comic)}
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </OverlayScrollbarsComponent>
      </div>
    </div>
  );
}
