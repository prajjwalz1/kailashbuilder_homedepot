
const routes = [
  {
    path: '/',
    name: 'Main',
    props:true,
    component: () => import('pages/Login.vue'),

  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/home', name: 'dashboard', component: () => import('pages/Dashboard.vue'), props: true, meta: { requireAuth: true } },
      { path: '/warehouse', name: 'warehouse', component: () => import('pages/warehouses.vue'), props: true, meta: { requireAuth: true } },
      { path: '/site', name: 'sites', component: () => import('pages/sites.vue'), props: true, meta: { requireAuth: true } },

      { path: '/groups', name: 'groups', component: () => import('pages/groups.vue'), props: true, meta: { requireAuth: true } },
      { path: '/approvals', name: 'approvals', component: () => import('pages/approvals.vue'), props: true, meta: { requireAuth: true } },
      { path: '/sales_main', name: 'sales_main', component: () => import('pages/sales.vue'), props: true, meta: { requireAuth: true },
        children: [
          { path: '/sales_dashboard', name: 'sales_dashboard', component: () => import('pages/sales_dashboard.vue'), props: true, meta: { requireAuth: true } },
          { path: '/sales', name: 'sales', component: () => import('pages/salesAddEditPage'), props: true, meta: { requireAuth: true } },
        ]
      },
      { path: '/staffs', name: 'staffs', component: () => import('pages/staffs.vue'), props: true, meta: { requireAuth: true } },
      { path: '/receipts', name: 'receipts', component: () => import('pages/receipts.vue'), props: true, meta: { requireAuth: true } },
      { path: '/machines', name: 'machines', component: () => import('pages/machines.vue'), props: true, meta: { requireAuth: true } },
      { path: '/inventory', name: 'inventory', component: () => import('pages/inventory.vue'), props: true, meta: { requireAuth: true },
        children:[
          { path: '/inventory_dashboard', name: 'inventory_dashboard', component: () => import('pages/inventory_dashboard.vue'), props: true, meta: { requireAuth: true } },
          { path: '/products', name: 'products', component: () => import('pages/products.vue'), props: true, meta: { requireAuth: true } },
          { path: '/brands', name: 'brands', component: () => import('pages/brands.vue'), props: true, meta: { requireAuth: true } },
          { path: '/category', name: 'category', component: () => import('pages/category.vue'), props: true, meta: { requireAuth: true } },
          { path: '/suppliers', name: 'suppliers', component: () => import('pages/suppliers.vue'), props: true, meta: { requireAuth: true } },
        ]
      },

    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
