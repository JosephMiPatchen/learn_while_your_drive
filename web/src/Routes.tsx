// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route } from '@redwoodjs/router'

import ScaffoldLayout from 'src/layouts/ScaffoldLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={ScaffoldLayout} title="ContentItems" titleTo="contentItems" buttonLabel="New ContentItem" buttonTo="newContentItem">
        <Route path="/content-items/new" page={ContentItemNewContentItemPage} name="newContentItem" />
        <Route path="/content-items/{id}/edit" page={ContentItemEditContentItemPage} name="editContentItem" />
        <Route path="/content-items/{id}" page={ContentItemContentItemPage} name="contentItem" />
        <Route path="/content-items" page={ContentItemContentItemsPage} name="contentItems" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Goals" titleTo="goals" buttonLabel="New Goal" buttonTo="newGoal">
        <Route path="/goals/new" page={GoalNewGoalPage} name="newGoal" />
        <Route path="/goals/{id}/edit" page={GoalEditGoalPage} name="editGoal" />
        <Route path="/goals/{id}" page={GoalGoalPage} name="goal" />
        <Route path="/goals" page={GoalGoalsPage} name="goals" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Users" titleTo="users" buttonLabel="New User" buttonTo="newUser">
        <Route path="/users/new" page={UserNewUserPage} name="newUser" />
        <Route path="/users/{id}/edit" page={UserEditUserPage} name="editUser" />
        <Route path="/users/{id}" page={UserUserPage} name="user" />
        <Route path="/users" page={UserUsersPage} name="users" />
      </Set>
      <Route path="/goal" page={GoalPage} name="goal" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
