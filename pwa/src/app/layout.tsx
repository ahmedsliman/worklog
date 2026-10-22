import '@/styles/globals.css';

import { Metadata } from 'next';
import { FC, ReactNode } from 'react';

import { QueryProvider } from '@/components/QueryProvider';

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: 'Worklog',
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
const RootLayout: FC<Props> = ({ children }) => {
  return (
    <html className="h-full bg-white" lang="en">
      <body className="h-full">
        <QueryProvider>
          <main className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
