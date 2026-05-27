export const SITE_BASE_PATH = import.meta.env.BASE_URL || '/';

export function assetPath(path) {
    const cleanPath = path.replace(/^\/+/, '');
    return `${SITE_BASE_PATH}${cleanPath}`;
}

export function staticPostUrl(post) {
    if (!post?.url) return SITE_BASE_PATH;
    return assetPath(post.url);
}
