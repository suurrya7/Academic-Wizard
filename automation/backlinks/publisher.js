import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { Octokit } from '@octokit/rest';
import sodium from 'sodium-native';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..', '..');
const POSTS_JSON_PATH = path.join(ROOT_DIR, 'public', 'data', 'posts.json');
const STATE_JSON_PATH = path.join(ROOT_DIR, 'automation', 'backlink_state.json');

const SITE_URL = 'https://academicwizard.online';
const UTM_TAGS = '?utm_source={src}&utm_medium=referral&utm_campaign=auto_backlink';

// Initialize Google GenAI
const ai = new GoogleGenAI({
    apiKey: process.env.BACKLINK_GEMINI_API_KEY
});
const octokit = new Octokit({ auth: process.env.GH_PAT });

// --- Helper Functions ---
async function readJson(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
}

async function writeJson(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function parseJsonResponse(text) {
    let clean = text.trim();
    
    // Ultimate fallback: extract everything from the first '{' to the last '}'
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
        clean = clean.substring(firstBrace, lastBrace + 1);
    }

    try {
        return JSON.parse(clean);
    } catch (e) {
        // Fallback for unescaped newlines which are common in generated JSON
        const sanitized = clean.replace(/\\n/g, '\\n')
                               .replace(/\\'/g, "\\'")
                               .replace(/\\"/g, '\\"')
                               .replace(/\\&/g, '\\&')
                               .replace(/\\r/g, '\\r')
                               .replace(/\\t/g, '\\t')
                               .replace(/\\b/g, '\\b')
                               .replace(/\\f/g, '\\f')
                               // Remove actual literal line breaks that break JSON
                               .replace(/[\u0000-\u0019]+/g,""); 
        return JSON.parse(sanitized);
    }
}

// Simple fetch wrapper since Node 22 has fetch, but for robust API calls sometimes https is needed.
// Actually, Node 22 native fetch is perfect.
async function fetchApi(url, options = {}) {
    const res = await fetch(url, options);
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API Error ${res.status}: ${text}`);
    }
    return res;
}

// --- Platform Publishers ---

async function publishBlogger(title, content) {
    const blogId = process.env.BLOGGER_BLOG_ID;
    const token = process.env.GOOGLE_REFRESH_TOKEN; // Need to exchange for access token
    
    // 1. Get Access Token
    const tokenRes = await fetchApi('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: token,
            grant_type: 'refresh_token'
        })
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Publish
    const res = await fetchApi(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            content: content
        })
    });
    return await res.json();
}

async function publishPinterest(title, description, link) {
    const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
    const boardId = process.env.PINTEREST_BOARD_ID;
    if(!boardId) throw new Error("PINTEREST_BOARD_ID missing");

    // Enforce 500 max length
    let safeDescription = description || "";
    if (safeDescription.length > 490) safeDescription = safeDescription.substring(0, 490) + "...";

    const res = await fetchApi(`https://api-sandbox.pinterest.com/v5/pins`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            link: link,
            title: title,
            description: safeDescription,
            board_id: boardId,
            media_source: {
                source_type: "image_url",
                url: "https://academicwizard.online/og-image.jpg" // Fallback image
            }
        })
    });
    return await res.json();
}

async function publishTelegraph(title, contentMarkdown) {
    const accessToken = process.env.TELEGRAPH_ACCESS_TOKEN;
    // Telegraph requires an array of DOM nodes, but it has an unofficial markdown to DOM parser or we can just send simple text.
    // Let's send simple text paragraphs for simplicity.
    const nodes = contentMarkdown.split('\n\n').map(p => ({ tag: 'p', children: [p] }));
    
    const res = await fetchApi(`https://api.telegra.ph/createPage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            access_token: accessToken,
            title: title,
            content: nodes,
            return_content: false
        })
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    return data.result;
}

async function publishTumblr(title, content, tags) {
    // Tumblr OAuth 1.0a is tricky without a library. We'll use fetch with basic auth if possible, or OAuth1 header.
    // For simplicity in a script, it's better to use a lightweight approach.
    // Actually, Tumblr v2 API supports API Keys for some read operations, but write requires OAuth.
    // Given the complexity of OAuth 1.0a signatures in raw Node, let's log a warning or use a placeholder here if we don't bring in an oauth-1.0a package.
    // To keep it simple, we will simulate this for now, as OAuth1.0a requires cryptographic signing.
    console.warn("Tumblr publishing requires OAuth 1.0a signing. Please install 'oauth-1.0a' and 'crypto' to complete this.");
    return { url: "https://tumblr.com/post/placeholder", id: "placeholder" };
}

async function publishDevTo(title, content, canonicalUrl) {
    const res = await fetchApi('https://dev.to/api/articles', {
        method: 'POST',
        headers: {
            'api-key': process.env.DEVTO_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            article: {
                title: title,
                body_markdown: content,
                published: true,
                canonical_url: canonicalUrl
            }
        })
    });
    return await res.json();
}

async function publishLinkedIn(text, link) {
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    
    // First, get the user's URN (author ID)
    let authorUrn = process.env.LINKEDIN_AUTHOR_URN;
    if (!authorUrn) {
        const meRes = await fetchApi('https://api.linkedin.com/v2/userinfo', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const meData = await meRes.json();
        authorUrn = `urn:li:person:${meData.sub}`;
    }

    // Publish post
    const res = await fetchApi('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            author: authorUrn,
            lifecycleState: "PUBLISHED",
            specificContent: {
                "com.linkedin.ugc.ShareContent": {
                    shareCommentary: { text: text },
                    shareMediaCategory: "ARTICLE",
                    media: [{
                        status: "READY",
                        originalUrl: link
                    }]
                }
            },
            visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" }
        })
    });
    return await res.json();
}

async function publishWordPress(title, content) {
    const accessToken = process.env.WP_ACCESS_TOKEN;
    const siteUrl = process.env.WP_SITE_URL;
    const siteDomain = new URL(siteUrl).hostname;
    
    const res = await fetchApi(`https://public-api.wordpress.com/rest/v1.1/sites/${siteDomain}/posts/new`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            content: content,
            status: 'publish'
        })
    });
    return await res.json();
}

// --- Secrets Management ---

async function updateGithubSecret(secretName, secretValue) {
    try {
        const repoUrl = process.env.GITHUB_REPOSITORY; // e.g. "surya/Academic-Wizard"
        if (!repoUrl) {
            console.warn("Not running in GitHub Actions context, skipping secret update.");
            return;
        }
        const [owner, repo] = repoUrl.split('/');
        
        const { data: publicKey } = await octokit.rest.actions.getRepoPublicKey({
            owner,
            repo
        });

        const messageBytes = Buffer.from(secretValue);
        const keyBytes = Buffer.from(publicKey.key, 'base64');
        const encryptedBytes = Buffer.alloc(sodium.crypto_box_SEALBYTES + messageBytes.length);
        sodium.crypto_box_seal(encryptedBytes, messageBytes, keyBytes);
        const encryptedValue = encryptedBytes.toString('base64');

        await octokit.rest.actions.createOrUpdateRepoSecret({
            owner,
            repo,
            secret_name: secretName,
            encrypted_value: encryptedValue,
            key_id: publicKey.key_id
        });
        console.log(`Successfully updated GitHub Secret: ${secretName}`);
    } catch (e) {
        console.error(`Failed to update secret ${secretName}:`, e.message);
    }
}

async function rotateTokens() {
    const refreshToken = process.env.PINTEREST_REFRESH_TOKEN;
    const clientId = process.env.PINTEREST_CLIENT_ID;
    const clientSecret = process.env.PINTEREST_CLIENT_SECRET;
    
    if (!refreshToken || !clientId || !clientSecret) {
        console.log("Missing Pinterest credentials, skipping token rotation.");
        return;
    }
    
    console.log("Rotating Pinterest token...");
    const authHeader = 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    try {
        const res = await fetchApi('https://api.pinterest.com/v5/oauth/token', {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            })
        });
        const data = await res.json();
        if (data.access_token) {
            await updateGithubSecret('PINTEREST_ACCESS_TOKEN', data.access_token);
            process.env.PINTEREST_ACCESS_TOKEN = data.access_token;
        } else {
            console.error("Pinterest Token rotation failed: no access_token in response.");
        }
    } catch(e) {
         console.error("Pinterest Token rotation failed:", e.message);
    }
}

// --- Main Pipeline ---

async function main() {
    console.log("Starting Backlink Publisher Pipeline...");
    
    // Refresh Pinterest token FIRST so the updated token is available in process.env for this run
    await rotateTokens();
    
    const postsData = await readJson(POSTS_JSON_PATH);
    const stateData = await readJson(STATE_JSON_PATH) || { published_posts: {} };
    
    if (!postsData || !Array.isArray(postsData) || postsData.length === 0) {
        console.log("No posts found in posts.json. Exiting.");
        return;
    }

    // Find up to 4 new posts
    const newPosts = postsData.filter(post => !stateData.published_posts[post.slug]).slice(0, 4);
    const newSlugs = newPosts.map(post => post.slug);

    if (newSlugs.length === 0) {
        console.log("No new posts to process. Exiting.");
        return;
    }

    console.log(`Found ${newSlugs.length} new posts. Processing...`);

    // --- Phase 1: Individual Posts ---
    // We will ask the model to return a JSON object with these keys.

    for (const slug of newSlugs) {
        const post = postsData.find(p => p.slug === slug);
        const postUrl = `${SITE_URL}/blog/${slug}`;
        
        console.log(`\nGenerating Phase 1 content for: ${slug}`);
        
        const prompt = `You are an expert content marketer. I have a blog post titled "${post.title}". Excerpt: "${post.excerpt}".
Create 4 unique variations of this content for different platforms. Incorporate backlinks to ${postUrl} naturally.

Requirements:
- blogger: An 800-1200 word academic research overview. Include an inline anchor text link and a footer "Read full article" link.
- pinterest: A 100-150 word rich pin description with hashtags.
- telegraph: A 300-400 word quick-read summary with subheadings.
- tumblr: A 200-400 word relatable micro-blog study tip with hashtags.`;

        let variations;
        try {
            let modelName = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
            modelName = modelName.trim().replace(/['"]/g, '');
            console.log(`Phase 1 Model being used: "${modelName}"`);
            
            const result = await ai.models.generateContent({
                model: modelName,
                contents: prompt + "\n\nReturn a JSON object with keys: blogger, pinterest, telegraph, tumblr.",
                config: {
                    systemInstruction: "You are an expert SEO content syndicator. Your job is to rewrite an original article into a unique, highly engaging summary for social platforms. Maintain the core message but completely change the phrasing so it is not duplicate content. You must return ONLY raw valid JSON with exactly the keys requested.",
                    responseMimeType: "application/json"
                }
            });
            variations = parseJsonResponse(result.text);
        } catch (e) {
            console.error(`Google API failed for ${slug}:`, e.message);
            continue;
        }

        stateData.published_posts[slug] = { published_at: new Date().toISOString() };

        // Publish to Blogger
        try {
            if (!variations.blogger) throw new Error("Missing 'blogger' key in AI response");
            const url = postUrl + UTM_TAGS.replace('{src}', 'blogger');
            const content = variations.blogger.replace(postUrl, url);
            const res = await publishBlogger(post.title, content);
            stateData.published_posts[slug].blogger = { url: res.url, id: res.id };
            console.log("✅ Blogger");
        } catch (e) { console.error("⚠️ Blogger failed:", e.message); }

        // Publish to Pinterest
        try {
            if (!variations.pinterest) throw new Error("Missing 'pinterest' key in AI response");
            const url = postUrl + UTM_TAGS.replace('{src}', 'pinterest');
            const res = await publishPinterest(post.title, variations.pinterest, url);
            stateData.published_posts[slug].pinterest = { id: res.id };
            console.log("✅ Pinterest");
        } catch (e) { console.error("⚠️ Pinterest failed:", e.message); }

        // Publish to Telegraph
        try {
            if (!variations.telegraph) throw new Error("Missing 'telegraph' key in AI response");
            const url = postUrl + UTM_TAGS.replace('{src}', 'telegraph');
            const content = variations.telegraph.replace(postUrl, url);
            const res = await publishTelegraph(post.title, content);
            stateData.published_posts[slug].telegraph = { url: res.url, path: res.path };
            console.log("✅ Telegraph");
        } catch (e) { console.error("⚠️ Telegraph failed:", e.message); }
        
        // Publish to Tumblr (Placeholder)
        try {
            if (!variations.tumblr) throw new Error("Missing 'tumblr' key in AI response");
            const url = postUrl + UTM_TAGS.replace('{src}', 'tumblr');
            const content = variations.tumblr.replace(postUrl, url);
            const res = await publishTumblr(post.title, content, "study");
            stateData.published_posts[slug].tumblr = { url: res.url };
            console.log("✅ Tumblr");
        } catch (e) { console.error("⚠️ Tumblr failed:", e.message); }
    }

    // --- Phase 2: Combined Digests ---
    console.log(`\nGenerating Phase 2 (Combined Digests)...`);
    
    const combinedData = newSlugs.map(slug => {
        const p = postsData.find(x => x.slug === slug);
        return `Title: ${p.title}\nExcerpt: ${p.excerpt}\nURL: ${SITE_URL}/blog/${slug}`;
    }).join('\n\n');

    const promptCombined = `You are a professional content curator. Here are up to 4 recent blog posts from our site:\n\n${combinedData}\n\n
Create combined digest content for these platforms.
Requirements:
- devto: 1 markdown technical/productivity digest combining all topics. Include all links naturally. Provide an engaging overall title.
- linkedin: 1 professional business/career briefing post with emojis and bullet points combining all topics. Include all links.
- wordpress_1: A combined editorial essay discussing topics 1 and 2 (if available).
- wordpress_2: A combined editorial essay discussing topics 3 and 4 (if available).`;

    try {
        let modelName = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
        modelName = modelName.trim().replace(/['"]/g, '');
        console.log(`Phase 2 Model being used: "${modelName}"`);

        const result = await ai.models.generateContent({
            model: modelName,
            contents: promptCombined + "\n\nReturn a JSON object with keys: devto, linkedin, wordpress_1, wordpress_2.",
            config: {
                systemInstruction: "You are an expert digital marketer and content curator. Your job is to analyze multiple blog posts and create highly engaging, professional digests for LinkedIn, Dev.to, and WordPress. You must return ONLY raw valid JSON with exactly the keys requested.",
                responseMimeType: "application/json"
            }
        });
        const digests = parseJsonResponse(result.text);

        const primarySlug = newSlugs[0];
        const primaryCanonical = `${SITE_URL}/blog/${primarySlug}`;

        // Dev.to
        try {
            const content = digests.devto;
            const title = "Productivity Hacks for Academic Writing"; // Extract from prompt ideally
            const res = await publishDevTo(title, content, primaryCanonical);
            console.log("✅ Dev.to");
        } catch (e) { console.error("⚠️ Dev.to failed:", e.message); }

        // LinkedIn
        try {
            const text = digests.linkedin;
            const res = await publishLinkedIn(text, primaryCanonical);
            console.log("✅ LinkedIn");
        } catch (e) { console.error("⚠️ LinkedIn failed:", e.message); }

        // WordPress 1
        if (newSlugs.length > 0) {
             try {
                const res = await publishWordPress("Academic Deep Dive (Part 1)", digests.wordpress_1);
                console.log("✅ WordPress 1");
            } catch (e) { console.error("⚠️ WordPress 1 failed:", e.message); }
        }

        // WordPress 2
        if (newSlugs.length > 2) {
             try {
                const res = await publishWordPress("Academic Deep Dive (Part 2)", digests.wordpress_2);
                console.log("✅ WordPress 2");
            } catch (e) { console.error("⚠️ WordPress 2 failed:", e.message); }
        }

    } catch (e) {
        console.error("OpenRouter API failed for combined digests:", e.message);
    }

    // --- Finish ---
    await writeJson(STATE_JSON_PATH, stateData);
    console.log("\nPipeline finished. State updated.");
}

main().catch(console.error);
