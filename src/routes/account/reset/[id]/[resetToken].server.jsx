import {Suspense} from 'react';
import {Seo, useRouteParams} from '@shopify/hydrogen';
import {AccountPasswordResetForm} from 'client-comp';
import {Layout} from '../../../../components/server';

/**
 * This page shows a form for the user to enter a new password.
 * It should only be accessed by a link emailed to the user after
 * they initiate a password reset from `/account/recover`.
 */
export default function ResetPassword() {
  const {id, resetToken} = useRouteParams();

  return (
    <Layout>
      <Suspense fallback={true}>
        <Seo type="noindex" data={{title: 'Reset password'}} />
      </Suspense>
      <AccountPasswordResetForm id={id} resetToken={resetToken} />
    </Layout>
  );
}
