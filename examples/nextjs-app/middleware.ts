import { withCzTypography } from 'cz-typography/next/middleware';

export const middleware = withCzTypography();

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
