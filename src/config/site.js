export const SITE_BASE_PATH = import.meta.env.BASE_URL || '/';

export function assetPath(path) {
    const cleanPath = path.replace(/^\/+/, '');
    return `${SITE_BASE_PATH}${cleanPath}`;
}

export function staticPostUrl(post) {
    if (!post?.slug) return SITE_BASE_PATH;
    return assetPath(`blog/${post.slug}`);
}

// Web3Forms API key for email forwarding. Paste your key from web3forms.com here:
export const WEB3FORMS_ACCESS_KEY = "";
