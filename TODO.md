# TODO: Fix Pagination in Blog.jsx

- [x] Add totalPages state to the component
- [x] Update getBlogList to set totalPages from res.data.totalPages
- [x] Modify useEffect to depend on pageNumber for refetching data
- [x] Replace hardcoded pagination UI with dynamic pagination component
- [x] Add onClick handlers to pagination links to change pageNumber
- [x] Implement prev/next button logic with disable conditions
- [x] Set 'active' class on the current page number
