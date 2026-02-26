import { createHash } from 'crypto';

// ─── Helper: SHA-256 hash ─────────────────────────────────────────────────────
export function hashSHA256(value: string): string {
    return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

// ─── Normalize & hash PII (matches Meta's ParamBuilder.getNormalizedAndHashedPII) ──
export function normalizeAndHash(value: string, type: 'email' | 'phone' | 'first_name' | 'last_name'): string | null {
    if (!value) return null;
    let normalized = value.trim().toLowerCase();

    if (type === 'phone') {
        // Remove all non-digit characters (except leading +)
        normalized = value.replace(/[^\d]/g, '');
    }

    return hashSHA256(normalized);
}

// ─── Parse cookies from raw header string ────────────────────────────────────
export function parseCookiesFromHeader(cookieHeader: string | null): Record<string, string> {
    if (!cookieHeader) return {};
    return Object.fromEntries(
        cookieHeader.split(';').map((c) => {
            const [k, ...v] = c.trim().split('=');
            return [k.trim(), decodeURIComponent(v.join('='))];
        })
    );
}

// ─── Extract fbc from cookies or fbclid query param ─────────────────────────
// _fbc format: fb.1.<creation_time>.<fbclid>
export function extractFbc(cookies: Record<string, string>, fbclid?: string | null): string | null {
    if (cookies._fbc) return cookies._fbc;
    if (fbclid) {
        const ts = Math.floor(Date.now() / 1000);
        return `fb.1.${ts}.${fbclid}`;
    }
    return null;
}

// ─── Extract fbp from cookies ─────────────────────────────────────────────────
export function extractFbp(cookies: Record<string, string>): string | null {
    return cookies._fbp ?? null;
}

// ─── Get real client IP (handles proxies) ────────────────────────────────────
export function getClientIp(req: Request): string | null {
    const xForwardedFor = req.headers.get('x-forwarded-for');
    if (xForwardedFor) {
        return xForwardedFor.split(',')[0].trim();
    }
    return null;
}

// ─── Build & send CAPI event (Lead) to Meta ─────────────────────────────────
export interface CAPILeadPayload {
    pixelId: string;
    accessToken: string;
    eventName: string;
    eventTime: number;
    sourceUrl: string;
    clientIpAddress: string | null;
    clientUserAgent: string | null;
    fbc: string | null;
    fbp: string | null;
    hashedEmail: string | null;
    hashedPhone: string | null;
    hashedFirstName: string | null;
    hashedLastName: string | null;
    eventId?: string;  // for deduplication with browser pixel
}

export async function sendMetaCAPIEvent(payload: CAPILeadPayload): Promise<void> {
    const url = `https://graph.facebook.com/v21.0/${payload.pixelId}/events?access_token=${payload.accessToken}`;

    const userData: Record<string, string | undefined> = {};
    if (payload.hashedEmail) userData.em = payload.hashedEmail;
    if (payload.hashedPhone) userData.ph = payload.hashedPhone;
    if (payload.hashedFirstName) userData.fn = payload.hashedFirstName;
    if (payload.hashedLastName) userData.ln = payload.hashedLastName;
    if (payload.fbc) userData.fbc = payload.fbc;
    if (payload.fbp) userData.fbp = payload.fbp;
    if (payload.clientIpAddress) userData.client_ip_address = payload.clientIpAddress;
    if (payload.clientUserAgent) userData.client_user_agent = payload.clientUserAgent;

    const body = {
        data: [
            {
                event_name: payload.eventName,
                event_time: payload.eventTime,
                event_source_url: payload.sourceUrl,
                action_source: 'website',
                event_id: payload.eventId,
                user_data: userData,
            },
        ],
        // Uncomment the line below to test without sending real events:
        // test_event_code: process.env.META_TEST_EVENT_CODE,
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[Meta CAPI] Error:', response.status, errorText);
    } else {
        const json = await response.json();
        console.log('[Meta CAPI] Success:', JSON.stringify(json));
    }
}
