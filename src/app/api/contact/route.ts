import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import nodemailer from 'nodemailer';
import {
    extractFbc,
    extractFbp,
    getClientIp,
    hashData,
    hashPhone,
    parseCookies,
    sendMetaCAPI,
} from '@/lib/tracking-server';

/**
 * Utilitário para timeout de promessas
 */
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs)
    );
    return Promise.race([promise, timeout]);
}

export async function POST(req: Request) {
    const startTime = Date.now();
    const backupId = `backup_timeout_${startTime}_${Math.random().toString(36).substring(7)}`;

    try {
        const payload = await req.json();
        const {
            name,
            email,
            phone,
            utm_source,
            utm_medium,
            utm_campaign,
            utm_term,
            page_path,
            fbclid,
            event_id, // Gerado no frontend para deduplicação
        } = payload;

        if (!name || !phone) {
            return NextResponse.json({ error: 'Name and Phone are required' }, { status: 400 });
        }

        // ─── 1. Persistência Síncrona (com Timeout de 5s) ────────────────────────
        let dbId: string | number = backupId;

        try {
            if (process.env.DATABASE_URL) {
                const sql = neon(process.env.DATABASE_URL);
                const dbResult = await withTimeout(
                    sql`
                        INSERT INTO public.leads (
                            name, email, whatsapp, status, column_id, organization_id,
                            utm_source, utm_medium, utm_campaign, utm_term, page_path
                        )
                        VALUES (
                            ${name}, ${email || ''}, ${phone}, 'Novo', 'c184664c-d7f2-4840-a418-a2952406cd13', ${process.env.ORGANIZATION_ID || 'super-admin-personal'},
                            ${utm_source || null}, ${utm_medium || null}, ${utm_campaign || null}, ${utm_term || null}, ${page_path || null}
                        )
                        ON CONFLICT (email) DO UPDATE SET
                            name = EXCLUDED.name,
                            whatsapp = EXCLUDED.whatsapp,
                            updated_at = NOW()
                        RETURNING id;
                    `,
                    5000
                );

                if (dbResult && dbResult[0]) {
                    dbId = dbResult[0].id;
                }
            }
        } catch (dbError: any) {
            console.error('[DB ERROR/TIMEOUT] Using backup ID:', dbError.message);
        }

        // ─── 2. Resposta Imediata ao Cliente ────────────────────────────────────
        // Respondemos 200 OK para que o frontend redirecione pro WhatsApp sem travar
        const response = NextResponse.json({
            success: true,
            lead_id: dbId,
            message: 'Lead capturado, processando integrações em background...'
        });

        // ─── 3. Tarefas Secundárias Assíncronas (Background) ────────────────────
        // Next.js App Router (no Vercel) continuará a execução dessas promessas 
        // mesmo após o retorno da resposta, desde que não sejam awaitadas.

        (async () => {
            const cookieHeader = req.headers.get('cookie');
            const cookies = parseCookies(cookieHeader);
            const fbc = extractFbc(cookies, fbclid);
            const fbp = extractFbp(cookies);
            const clientIp = getClientIp(req);
            const userAgent = req.headers.get('user-agent') || '';
            const sourceUrl = page_path || req.headers.get('origin') || '';

            // Hashing PII (Match Quality +8.0)
            const firstName = (name as string).trim().split(' ')[0] || '';
            const lastName = (name as string).trim().split(' ').slice(1).join(' ') || '';

            const hashedEmail = email ? hashData(email) : null;
            const hashedPhone = phone ? hashPhone(phone) : null;
            const hashedFn = hashData(firstName);
            const hashedLn = lastName ? hashData(lastName) : null;
            const hashedExternalId = hashData(dbId.toString());

            const pixelId = process.env.META_PIXEL_ID;
            const accessToken = process.env.META_ACCESS_TOKEN;

            // Disparo Paralelo: CAPI + E-mail
            await Promise.allSettled([
                // Meta CAPI
                (async () => {
                    if (!pixelId || !accessToken) return;
                    await sendMetaCAPI({
                        pixelId,
                        accessToken,
                        eventName: 'Lead',
                        eventTime: Math.floor(startTime / 1000),
                        eventSourceUrl: sourceUrl,
                        eventId: event_id || `srv_${startTime}`, // Deduplicação
                        userData: {
                            em: hashedEmail ? [hashedEmail] : undefined,
                            ph: hashedPhone ? [hashedPhone] : undefined,
                            fn: [hashedFn],
                            ln: hashedLn ? [hashedLn] : undefined,
                            external_id: [hashedExternalId],
                            client_ip_address: clientIp,
                            client_user_agent: userAgent,
                            fbc,
                            fbp,
                        }
                    });
                })(),

                // Notificação E-mail
                (async () => {
                    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) return;
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
                        subject: `Nova Cotação: ${name} (ID: ${dbId})`,
                        html: `
                            <h2>Novo Lead Recebido</h2>
                            <p><strong>ID no Banco:</strong> ${dbId}</p>
                            <p><strong>Nome:</strong> ${name}</p>
                            <p><strong>WhatsApp:</strong> ${phone}</p>
                            <p><strong>E-mail:</strong> ${email || 'Não informado'}</p>
                            <hr/>
                            <p><a href="https://wa.me/${phone.replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(name.split(' ')[0])},%20vi%20seu%20interesse%20em%20locação%20de%20equipamentos">Iniciar conversa no WhatsApp</a></p>
                        `,
                    });
                })()
            ]);
        })().catch(err => console.error('[BACKGROUND TASK ERROR]:', err));

        return response;

    } catch (error: any) {
        console.error("API /contact critical error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

