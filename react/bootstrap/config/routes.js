/**
 *  Reusable objects for routes and menu
 *
 */

import * as m from '../../modules';

export const publicRoutes = [
  {
    path: '/items/all',
    name: 'browse-all',
    menu_name: 'browse all',
    weight: 0,
    component: m.AllItems,
    section: 'inventory',
    disabled: false
  },
  {
    path: '/items/available',
    name: 'available-items',
    menu_name: 'available',
    weight: 1,
    component: m.AvailableItems,
    section: 'inventory',
    disabled: false
  },
  {
    path: '/items/checked-out',
    name: 'checked-out',
    menu_name: 'checked out',
    weight: 2,
    component: m.CheckedOutItems,
    section: 'inventory',
    disabled: false
  },
  {
    path: '/projects/active',
    name: 'active-projects',
    menu_name: 'active projects',
    weight: 1,
    component: m.AllProjects,
    section: 'projects',
    disabled: false
  },
  {
    path: '/projects/archived',
    name: 'archived-projects',
    menu_name: 'archived',
    weight: 1,
    component: m.ArchivedProjects,
    section: 'projects',
    disabled: false
  },
  {
    path: '/project/:_id',
    name: 'single-projects',
    menu_name: 'single project',
    weight: 1,
    component: m.Project,
    section: 'projects',
    disabled: true
  },
  {
    path: '/item/:_id',
    name: 'single-item',
    component: m.SingleItem,
    disabled: false
  } 
];

export const adminRoutes = [
  {
    path: '/projects/add',
    name: 'add-project',
    menu_name: 'add project',
    weight: 0,
    component: m.AddProject,
    section: 'projects',
    disabled: false
  },
  {
    path: '/project/:_id/edit',
    name: 'edit-project',
    weight: 0,
    component: m.EditProject,
    section: 'projects',
    disabled: true
  },
  {
    path: '/project/:_id/edit/step_two',
    weight: 0,
    component: m.EditProjectLast,
    section: 'projects',
    disabled: true
  },
  {
    path: '/projects/add/step_two',
    name: 'add-project',
    weight: 0,
    component: m.AddProjectLast,
    disabled: false
  },
  {
    path: '/admin/manage/add-item',
    name: 'add-item',
    menu_name: 'Add Item',
    weight: 4,
    component: m.AddItem,
    section: 'admin',
    disabled: false
  },
  {
    path: '/admin/dashboard',
    name: 'dashboard',
    menu_name: 'dashboard',
    weight: 4,
    component: m.Dashboard,
    section: 'admin',
    disabled: true
  },
  {
    path: '/admin/manage/inventory',
    name: 'manage-inventory',
    menu_name: 'Manage Inventory',
    weight: 1,
    component: m.Manage,
    section: 'admin',
    disabled: false
  },
  {
    path: '/admin/manage/inventory/:tag',
    name: 'manage-items-tags',
    menu_name: 'Manage Inventory',
    weight: 7,
    component: m.Manage,
    section: 'admin',
    disabled: true
  },
  {
    path: '/admin/manage/categories',
    name: 'edit-categories',
    menu_name: 'Edit Categories',
    weight: 2,
    component: m.ManageCategories,
    section: 'admin',
    disabled: false
  },
  {
    path: '/admin/logs',
    name: 'logs',
    weight: 4,
    menu_name: 'logs',
    component: m.Logs,
    disabled: false,
    section: 'admin'
  },
  {
    path: '/admin/manage-users',
    name: 'manage-users',
    menu_name: 'Manage Users',
    weight: 5,
    component: m.Users,
    section: 'admin',
    disabled: false
  },
  {
    path: '/admin/users/:_id/edit',
    name: 'edit-user',
    component: m.EditUser,
    disabled: false
  },    
  {
    path: '/admin/logout',
    name: 'logout',
    menu_name: 'logout',
    weight: 6,
    component: null,
    section: 'admin',
    disabled: false
  },
  {
    path: '/item/:_id/edit',
    name: 'edit-item',
    component: m.EditItem,
    disabled: false
  },
  {
    path: '/admin/register',
    name: 'register',
    component: m.Register,
    section: 'coloured pencil',
    disabled: false
  
  }  
];