import { HeadContent, RouterProvider, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Toaster } from 'react-hot-toast'
import appCss from '../styles.css?url'
import Header from '../component/header'
import { AuthProvider } from '@/context/AuthContext'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>

      <body className="bg-white text-black">
        <AuthProvider>
          <div className="grid sm:grid min-h-screen">
            
            {/* Header */}
            <Header />

            {/* Toast */}
            <Toaster position="top-right" reverseOrder={false} />

            {/* Main Content */}
            <div className="min-h-screen flex-1 p-0 w-full overflow-x-hidden bg-white mb-4">
              {children}
            </div>

          </div>
        </AuthProvider>

        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />

        <Scripts />
      </body>
    </html>
  )
}
