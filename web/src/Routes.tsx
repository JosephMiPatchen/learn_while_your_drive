// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Route, Router, Set } from '@redwoodjs/router'

import ScaffoldLayout from 'src/layouts/ScaffoldLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={ScaffoldLayout} title="JobStatuses" titleTo="jobStatuses" buttonLabel="New JobStatus" buttonTo="newJobStatus">
        <Route path="/job-statuses/new" page={JobStatusNewJobStatusPage} name="newJobStatus" />
        <Route path="/job-statuses/{id}/edit" page={JobStatusEditJobStatusPage} name="editJobStatus" />
        <Route path="/job-statuses/{id}" page={JobStatusJobStatusPage} name="jobStatus" />
        <Route path="/job-statuses" page={JobStatusJobStatusesPage} name="jobStatuses" />
      </Set>
      <Route path="/" page={HomePage} name="home" />
      <Set wrap={ScaffoldLayout} title="ContentItems" titleTo="contentItems" buttonLabel="New ContentItem" buttonTo="newContentItem">
        <Route path="/content-items/new" page={ContentItemNewContentItemPage} name="newContentItem" />
        <Route path="/content-items/{id}/edit" page={ContentItemEditContentItemPage} name="editContentItem" />
        <Route path="/content-items/{id}" page={ContentItemContentItemPage} name="contentItem" />
        <Route path="/content-items" page={ContentItemContentItemsPage} name="contentItems" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Users" titleTo="users" buttonLabel="New User" buttonTo="newUser">
        <Route path="/users/new" page={UserNewUserPage} name="newUser" />
        <Route path="/users/{id}/edit" page={UserEditUserPage} name="editUser" />
        <Route path="/users/{id}" page={UserUserPage} name="user" />
        <Route path="/users" page={UserUsersPage} name="users" />
      </Set>
      <Route path="/rec-engine" page={RecEnginePage} name="recEngine" />
      <Route path="/rec-engine/{jobId}" page={RecEnginePage} name="recEngine" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
