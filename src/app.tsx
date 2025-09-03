import { AppProviders } from '@/components/app-providers.tsx'
import { InstagramLayout } from '@/components/instagram-layout.tsx'
import { RouteObject, useRoutes } from 'react-router'
import { lazy } from 'react'

const LazyAccountIndex = lazy(() => import('@/components/account/account-index-feature'))
const LazyAccountDetail = lazy(() => import('@/components/account/account-detail-feature'))
const LazyDashboard = lazy(() => import('@/components/dashboard/dashboard-feature'))

const LazyPageHome = lazy(() => import('@/components/instagram/page-home'))
const LazyPageTopics = lazy(() => import('@/components/instagram/page-topics'))
const LazyPageUsers = lazy(() => import('@/components/instagram/page-users'))
const LazyPageProfile = lazy(() => import('@/components/instagram/page-profile'))
const LazyPageTweet = lazy(() => import('@/components/instagram/page-search'))
const LazyPageNotFound = lazy(() => import('@/components/instagram/page-not-found'))

const routes: RouteObject[] = [
  { index: true, element: <LazyPageHome /> },
  {
    path: 'topics',
    children: [
      { index: true, element: <LazyPageTopics /> },
      { path: ':topic', element: <LazyPageTopics /> },
    ],
  },
  {
    path: 'users',
    children: [
      { index: true, element: <LazyPageUsers /> },
      { path: ':author', element: <LazyPageUsers /> },
    ],
  },
  { path: 'profile', element: <LazyPageProfile /> },
  { path: 'tweet/:tweet', element: <LazyPageTweet /> },
  {
    path: 'account',
    children: [
      { index: true, element: <LazyAccountIndex /> },
      { path: ':address', element: <LazyAccountDetail /> },
    ],
  },
  // { path: 'basic', element: <LazyBasic /> },
  { path: 'dashboard', element: <LazyDashboard /> },
  { path: '*', element: <LazyPageNotFound /> },
]

export function App() {
  const router = useRoutes(routes)
  return (
    <AppProviders>
      <InstagramLayout>{router}</InstagramLayout>
    </AppProviders>
  )
}
