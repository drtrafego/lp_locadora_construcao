import { createHash } from 'crypto';

/**
 * Normaliza e gera hash SHA-256 para dados PII (Personally Identifiable Information).
 * A Meta exige minúsculas, sem espaços e hashing SHA-256.
 */
export function hashData(data: string): string {
    return createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
}

/**
 * Normaliza especificamente telefones (remove caracteres não numéricos) e gera hash.
 */
export function hashPhone(phone: string): string {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    return hashData(cleanPhone);
}

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface CAPIUserData {
    em?: string[]; // Email (hashed)
    ph?: string[]; // Telefone (hashed)
    fn?: string[]; // Primeiro Nome (hashed)
    ln?: string[]; // Sobrenome (hashed)
    external_id?: string[]; // ID do Banco (hashed)
    client_ip_address: string | null;
    client_user_agent: string | null;
    fbc: string | null;
    fbp: string | null;
}

export interface CAPILeadPayload {
    pixelId: string;
    accessToken: string;
    eventName: string;
    eventTime: number;
    eventSourceUrl: string;
    eventId: string; // Para deduplicação com o Pixel
    userData: CAPIUserData;
}

/**
 * Despacha o evento para a Conversions API da Meta.
 */
export async function sendMetaCAPI(payload: CAPILeadPayload): Promise<void> {
    const url = `https://graph.facebook.com/v19.0/${payload.pixelId}/events?access_token=${payload.accessToken}`;

    const body = {
        data: [
            {
                event_name: payload.eventName,
                event_time: payload.eventTime,
                event_id: payload.eventId,
                action_source: 'website',
                event_source_url: payload.eventSourceUrl,
                user_data: {
                    ...payload.userData,
                },
                custom_data: {
                    value: 0,
                    currency: 'BRL',
                },
            },
        ],
        // test_event_code: process.env.META_TEST_EVENT_CODE, // Opcional para debug
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Meta CAPI] Error Response:', response.status, errorText);
        } else {
            const result = await response.json();
            console.log('[Meta CAPI] Success:', JSON.stringify(result));
        }
    } catch (error) {
        console.error('[Meta CAPI] Dispatch Error:', error);
    }
}

/**
 * Extrai _fbc do cookie ou gera a partir do fbclid.
 */
export function extractFbc(cookies: Record<string, string>, fbclid?: string | null): string | null {
    if (cookies._fbc) return cookies._fbc;
    if (fbclid) {
        const ts = Math.floor(Date.now() / 1000);
        return `fb.1.${ts}.${fbclid}`;
    }
    return null;
}

/**
 * Extrai _fbp do cookie.
 */
export function extractFbp(cookies: Record<string, string>): string | null {
    return cookies._fbp ?? null;
}

/**
 * Captura IP do cliente suportando proxy do Next.js/Vercel.
 */
export function getClientIp(req: Request): string | null {
    const xForwardedFor = req.headers.get('x-forwarded-for');
    if (xForwardedFor) {
        return xForwardedFor.split(',')[0].trim();
    }
    const xRealIp = req.headers.get('x-real-ip');
    if (xRealIp) {
        return xRealIp.trim();
    }
    return null;
}

/**
 * Utilitário para parse de cookies lineares para objeto.
 */
export function parseCookies(cookieHeader: string | null): Record<string, string> {
    if (!cookieHeader) return {};
    return Object.fromEntries(
        cookieHeader.split(';').map((c) => {
            const [k, ...v] = c.trim().split('=');
            return [k.trim(), decodeURIComponent(v.join('='))];
        })
    );
}
