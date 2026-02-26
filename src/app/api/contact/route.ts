import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import nodemailer from 'nodemailer';
import {
    extractFbc,
    extractFbp,
    getClientIp,
    normalizeAndHash,
    parseCookiesFromHeader,
    sendMetaCAPIEvent,
} from '@/lib/facebook';

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const {
            name,
            email,
            phone,
            utm_source,
            utm_medium,
            utm_campaign,
            utm_term,
            page_path,
            fbclid,         // passed from frontend URL params
            event_id,       // for deduplication with browser Pixel
        } = data;

        if (!name || !phone) {
            return NextResponse.json({ error: 'Name and Phone are required' }, { status: 400 });
        }

        // ─── Extract CAPI params from request headers ─────────────────────────────
        const cookieHeader = req.headers.get('cookie');
        const cookies = parseCookiesFromHeader(cookieHeader);
        const fbc = extractFbc(cookies, fbclid) ?? null;
        const fbp = extractFbp(cookies) ?? null;
        const clientIp = getClientIp(req);
        const userAgent = req.headers.get('user-agent');
        const sourceUrl = page_path || req.headers.get('referer') || '';

        // ─── Normalize & hash PII for CAPI ────────────────────────────────────────
        const nameParts = (name as string).trim().split(' ');
        const firstName = nameParts[0] ?? '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const hashedEmail = email ? normalizeAndHash(email, 'email') : null;
        const hashedPhone = phone ? normalizeAndHash(phone, 'phone') : null;
        const hashedFirstName = firstName ? normalizeAndHash(firstName, 'first_name') : null;
        const hashedLastName = lastName ? normalizeAndHash(lastName, 'last_name') : null;

        // 1. Save to DB (Neon)
        const dbPromise = async () => {
            if (!process.env.DATABASE_URL) return;
            const sql = neon(process.env.DATABASE_URL);

            try {
                await sql`
          INSERT INTO public.leads (
            name, email, whatsapp, status, column_id, organization_id,
            utm_source, utm_medium, utm_campaign, utm_term, page_path
          )
          VALUES (
            ${name}, ${email || ''}, ${phone}, 'Novo', 'c184664c-d7f2-4840-a418-a2952406cd13', 'super-admin-personal',
            ${utm_source || null}, ${utm_medium || null}, ${utm_campaign || null}, ${utm_term || null}, ${page_path || null}
          )
          ON CONFLICT (email) DO UPDATE SET
            name = EXCLUDED.name,
            whatsapp = EXCLUDED.whatsapp,
            updated_at = NOW();
        `;
            } catch (e) {
                console.error("DB Save Error:", e);
            }
        };

        // 2. Email Notification
        const emailPromise = async () => {
            if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) return;
            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.EMAIL_HOST,
                    port: parseInt(process.env.EMAIL_PORT || '587'),
                    secure: process.env.EMAIL_PORT === '465',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });

                await transporter.sendMail({
                    from: `"Locadora da Construção" <${process.env.EMAIL_USER}>`,
                    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
                    subject: `Nova Cotação de Locação: ${name}`,
                    html: `
            <h2>Novo Lead Recebido</h2>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>WhatsApp:</strong> ${phone}</p>
            <p><strong>URL Origem:</strong> ${page_path}</p>
            <hr/>
            <a href="https://wa.me/${phone.replace(/\D/g, '')}">Conversar com o Lead no WhatsApp</a>
          `,
                });
            } catch (e) {
                console.error("Email Error:", e);
            }
        };

        // 3. Meta CAPI – send Lead event
        const capiPromise = async () => {
            const pixelId = process.env.META_PIXEL_ID;
            const accessToken = process.env.META_ACCESS_TOKEN;
            if (!pixelId || !accessToken) return;

            try {
                await sendMetaCAPIEvent({
                    pixelId,
                    accessToken,
                    eventName: 'Lead',
                    eventTime: Math.floor(Date.now() / 1000),
                    sourceUrl,
                    clientIpAddress: clientIp,
                    clientUserAgent: userAgent,
                    fbc,
                    fbp,
                    hashedEmail,
                    hashedPhone,
                    hashedFirstName,
                    hashedLastName,
                    eventId: event_id,
                });
            } catch (e) {
                console.error("Meta CAPI Error:", e);
            }
        };

        // Fire all tasks with 5s timeout guard
        const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 5000));
        const tasks = Promise.allSettled([dbPromise(), emailPromise(), capiPromise()]);

        await Promise.race([tasks, timeoutPromise]);

        return NextResponse.json({ success: true, message: 'Lead captured successfully' });
    } catch (error: any) {
        console.error("API /contact error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
