import { UserManager, WebStorageStateStore } from "oidc-client-ts";

/**
 * Returns a lazily-initialised UserManager singleton.
 * Must only be called in the browser (throws on the server).
 */
let _userManager: UserManager | null = null;

export function getUserManager(): UserManager {
    if (typeof window === "undefined") {
        throw new Error("getUserManager() must only be called in the browser.");
    }

    if (!_userManager) {
        const authority ='https://login-rls.congacloud.com/api/v1/auth';
        const clientId ='e77fc3cf-b8d0-4c60-a5e0-e0cbf614247f';
        //    const authority ='https://login-rlspreview.congacloud.com/api/v1/auth';
        // const clientId='6ff36ffb-3074-4a1e-ae11-a86d9678c9dd';
        const metadataUrl = process.env.NEXT_PUBLIC_OIDC_METADATA_URL || undefined;
        // Base path prefix for all redirect URIs — mirrors next.config.ts basePath.
        const base = '/api/custom-ui/philips';
        // Keep callback/login paths configurable to support legacy and merged routes.
        const redirectPath = process.env.NEXT_PUBLIC_OIDC_REDIRECT_PATH || '/auth/callback';
        const loginPath = process.env.NEXT_PUBLIC_OIDC_LOGIN_PATH || '/login';
        const silentRenewPath = process.env.NEXT_PUBLIC_OIDC_SILENT_RENEW_PATH || '/auth/silent-renew';

        _userManager = new UserManager({
            authority,
            ...(metadataUrl ? { metadataUrl } : {}),
            client_id: clientId,
            redirect_uri: `${window.location.origin}${base}${redirectPath}`,
            post_logout_redirect_uri: `${window.location.origin}${base}${loginPath}`,
            scope: "openid profile email",
            response_type: "code",
            userStore: new WebStorageStateStore({
                store: window.localStorage,
                prefix: 'oidc.state.'
            }),
            automaticSilentRenew: true,
            silent_redirect_uri: `${window.location.origin}${base}${silentRenewPath}`,
            loadUserInfo: true
        });
    }

    return _userManager;
}
