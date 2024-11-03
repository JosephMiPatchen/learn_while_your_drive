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
      <Set wrap={ScaffoldLayout} title="LearningTrees" titleTo="learningTrees" buttonLabel="New LearningTree" buttonTo="newLearningTree">
        <Route path="/learning-trees/new" page={LearningTreeNewLearningTreePage} name="newLearningTree" />
        <Route path="/learning-trees/{id}/edit" page={LearningTreeEditLearningTreePage} name="editLearningTree" />
        <Route path="/learning-trees/{id}" page={LearningTreeLearningTreePage} name="learningTree" />
        <Route path="/learning-trees" page={LearningTreeLearningTreesPage} name="learningTrees" />
      </Set>
      <Set wrap={ScaffoldLayout} title="LearningTreeNodes" titleTo="learningTreeNodes" buttonLabel="New LearningTreeNode" buttonTo="newLearningTreeNode">
        <Route path="/learning-tree-nodes/new" page={LearningTreeNodeNewLearningTreeNodePage} name="newLearningTreeNode" />
        <Route path="/learning-tree-nodes/{id}/edit" page={LearningTreeNodeEditLearningTreeNodePage} name="editLearningTreeNode" />
        <Route path="/learning-tree-nodes/{id}" page={LearningTreeNodeLearningTreeNodePage} name="learningTreeNode" />
        <Route path="/learning-tree-nodes" page={LearningTreeNodeLearningTreeNodesPage} name="learningTreeNodes" />
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
      <Route path="/goal" page={GoalPage} name="goal" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
