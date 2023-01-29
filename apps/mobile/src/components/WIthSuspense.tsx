import { FC, ReactNode, Suspense } from 'react';
import Loader from './Loader';

function withSuspense(Children: FC) {
  return () => (
    <Suspense fallback={<Loader />}>
      <Children />
    </Suspense>
  );
}

export default withSuspense;
