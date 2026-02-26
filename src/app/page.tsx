"use client";

import { useState, useEffect, useRef } from "react";
import {
  Grid3x3,
  Settings2,
  RefreshCcw,
  Droplets,
  Trash2,
  ChevronsDown,
  Columns2,
  Building2,
  Container,
  Wrench,
} from "lucide-react";

const WHATSAPP_BASE = "https://wa.me/5565992334612";

const equipamentos = [
  {
    id: "andaimes",
    nome: "Andaimes e Acessórios",
    descricao: "Modulares, tubulares e fachadeiros. Montagem segura para qualquer altura.",
    Icon: Grid3x3,
  },
  {
    id: "guinchos",
    nome: "Guinchos e Acessórios",
    descricao: "Capacidade e alcance para içamento de materiais com segurança.",
    Icon: Settings2,
  },
  {
    id: "betoneiras",
    nome: "Betoneiras",
    descricao: "320L, 400L e 600L. Ideais para pequenas e médias concretagens.",
    Icon: RefreshCcw,
  },
  {
    id: "bombas",
    nome: "Bombas",
    descricao: "Bombas d'água, submersíveis e de rebaixamento de lençol freático.",
    Icon: Droplets,
  },
  {
    id: "cacamba",
    nome: "Caçamba",
    descricao: "Para descarte de entulho e resíduos com logística integrada.",
    Icon: Trash2,
  },
  {
    id: "compactador",
    nome: "Compactador",
    descricao: "Placas vibratórias e sapos compactadores para solo e britas.",
    Icon: ChevronsDown,
  },
  {
    id: "escoramento",
    nome: "Escoramento",
    descricao: "Torres e escoras reguláveis para lajes e estruturas em concretagem.",
    Icon: Columns2,
  },
  {
    id: "concretagem",
    nome: "Concretagem",
    descricao: "Vibradores de imersão, réguas vibratórias e acessórios de forma.",
    Icon: Building2,
  },
  {
    id: "container",
    nome: "Container Condomínio",
    descricao: "Escritórios de obra modulares e guaritas para canteiros.",
    Icon: Container,
  },
  {
    id: "geral",
    nome: "Equipamentos em Geral",
    descricao: "Serra circular, policorte, plataforma elevatória, talhas e muito mais.",
    Icon: Wrench,
  },
];

const diferenciais = [
  {
    titulo: "Engenheiro à disposição",
    texto:
      "Nosso engenheiro analisa sua demanda e indica o equipamento correto antes de você locar. Sem erro de especificação, sem retrabalho.",
    destaque: true,
  },
  {
    titulo: "39 anos no mercado",
    texto:
      "Atendemos Cuiabá e região desde antes da maioria dos profissionais de hoje entrarem na faculdade.",
    destaque: false,
  },
  {
    titulo: "Frota revisada e pronta",
    texto:
      "Cada equipamento é verificado antes da entrega. Você não recebe máquina com falha no meio da obra.",
    destaque: false,
  },
  {
    titulo: "+900 clientes atendidos",
    texto:
      "Obras residenciais, comerciais e industriais. Temos escala e acervo para atender do pequeno canteiro ao grande empreendimento.",
    destaque: false,
  },
];

const faq = [
  {
    pergunta: "Preciso saber exatamente qual equipamento quero?",
    resposta:
      "Não. Nosso engenheiro avalia a necessidade da sua obra e indica o equipamento ideal. Basta descrever o que precisa executar.",
  },
  {
    pergunta: "Fazem entrega e retirada?",
    resposta:
      "Sim. Trabalhamos com logística própria para entrega e retirada em Cuiabá e região.",
  },
  {
    pergunta: "Qual o prazo mínimo de locação?",
    resposta:
      "Trabalhamos com locação diária, semanal e mensal conforme o equipamento e demanda da obra.",
  },
  {
    pergunta: "O equipamento vem com operador?",
    resposta:
      "A locação é do equipamento. Para operação especializada, nossa equipe orienta sobre o uso correto no momento da entrega.",
  },
  {
    pergunta: "Atendem construtoras e incorporadoras?",
    resposta:
      "Sim. Temos estrutura para atender múltiplas obras simultâneas e contratos contínuos com construtoras.",
  },
];

import PhoneInputWithFlag from "@/components/PhoneInputWithFlag";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Generate a unique event ID for deduplication between Pixel and CAPI
    const event_id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    // Capture fbclid from URL params (from Facebook Ads click)
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');

    // If Meta Pixel is loaded, fire the browser-side Lead event (with the same event_id for deduplication)
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {}, { eventID: event_id });
    }

    // Send lead to local /api/contact endpoint (which will handle Neon DB, email, CAPI)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nome,
          email: `${whatsapp.replace(/\D/g, '')}@lead.com`, // using a generated email if none provided
          phone: whatsapp,
          page_path: window.location.pathname,
          fbclid,
          event_id,
        }),
      });
    } catch (err) {
      console.error('Failed to submit raw lead', err);
    }

    const url = `https://wa.me/5565992334612?text=${encodeURIComponent("Olá, quero fazer um orçamento")}`;
    window.location.href = url;
  }

  return (
    <main
      style={{
        backgroundColor: "#0a0a0a",
        color: "#f0ece4",
        fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
        overflowX: "hidden",
        minHeight: "100vh",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900;1,9..40,300&family=Bebas+Neue&display=swap');


        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: #d4a843; color: #0a0a0a; }

        .hero-text {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.9s ease, transform 0.9s ease;
        }
        .hero-text.visible { opacity: 1; transform: translateY(0); }
        .hero-text.delay-1 { transition-delay: 0.15s; }
        .hero-text.delay-2 { transition-delay: 0.3s; }
        .hero-text.delay-3 { transition-delay: 0.45s; }
        .hero-text.delay-4 { transition-delay: 0.6s; }

        .cta-btn {
          display: inline-block;
          background: #d4a843;
          color: #0a0a0a;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 16px 36px;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s;
          cursor: pointer;
          border: none;
          font-family: inherit;
        }
        .cta-btn:hover { background: #e8bc55; transform: translateY(-2px); }

        .cta-btn-outline {
          display: inline-block;
          background: transparent;
          color: #d4a843;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 14px 34px;
          text-decoration: none;
          border: 2px solid #d4a843;
          transition: background 0.2s, color 0.2s;
          cursor: pointer;
          font-family: inherit;
        }
        .cta-btn-outline:hover { background: #d4a843; color: #0a0a0a; }

        .eq-card {
          background: #141414;
          border: 1px solid #222;
          padding: 28px 24px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .eq-card:hover { border-color: #d4a843; transform: translateY(-4px); }

        .faq-item { border-bottom: 1px solid #222; }
        .faq-btn {
          width: 100%;
          background: none;
          border: none;
          color: #f0ece4;
          text-align: left;
          padding: 22px 0;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          font-family: inherit;
        }
        .faq-answer {
          color: #999;
          font-size: 15px;
          line-height: 1.7;
          padding-bottom: 22px;
          max-width: 680px;
        }

        .diff-card-destaque { background: #d4a843; color: #0a0a0a; }
        .diff-card { background: #141414; border: 1px solid #222; color: #f0ece4; }

        .form-input {
          width: 100%;
          background: #141414;
          border: 1px solid #2a2a2a;
          color: #f0ece4;
          font-size: 15px;
          padding: 16px 20px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input:focus { border-color: #d4a843; }
        .form-input::placeholder { color: #555; }

        @media (max-width: 768px) {
          .hero-title { font-size: 52px !important; line-height: 1 !important; }
          .hero-pad { padding: 0 32px !important; }
          .eq-grid { grid-template-columns: 1fr 1fr !important; }
          .diff-grid { grid-template-columns: 1fr !important; }
          .process-grid { grid-template-columns: 1fr !important; }
          .eng-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
          .form-grid { grid-template-columns: 1fr !important; }
          .cta-strip { flex-direction: column !important; align-items: flex-start !important; }
          .section-pad { padding: 60px 32px !important; }
          .hero-diagonal-bg { display: none !important; }
          .hero-gold-line { display: none !important; }
        }
        @media (max-width: 480px) {
          .eq-grid { grid-template-columns: 1fr !important; }
        }

        .noise-overlay {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.3;
          pointer-events: none;
        }
      `}</style>

      {/* HERO */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          paddingTop: "80px",
          paddingBottom: "80px",
          overflow: "hidden",
        }}
      >
        {/* Logo no topo — substitua por <img src="/logo.png" alt="Locadora da Construção" style={{ height: 52, width: "auto", position: "absolute", top: 32, left: 48, zIndex: 10 }} /> */}

        {/* BG diagonal */}
        <div
          className="hero-diagonal-bg"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "45%",
            height: "100%",
            background: "linear-gradient(135deg, #1a1408 0%, #0a0a0a 60%)",
            clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",
          }}
        />
        <div className="noise-overlay" />

        {/* Gold line */}
        <div
          className="hero-gold-line"
          style={{
            position: "absolute",
            left: 48,
            top: "50%",
            transform: "translateY(-50%)",
            width: 3,
            height: "220px",
            background: "linear-gradient(to bottom, transparent, #d4a843, transparent)",
          }}
        />

        <div
          className="hero-pad"
          style={{
            position: "relative",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 80px",
            width: "100%",
          }}
        >
          {/* Eyebrow */}
          <div
            className={`hero-text ${isVisible ? "visible" : ""}`}
            style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}
          >
            <span style={{ width: 40, height: 2, background: "#d4a843", display: "inline-block" }} />
            <span
              style={{
                fontSize: "12px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#d4a843",
                fontWeight: 500,
              }}
            >
              LOCADORA DA CONSTRUÇÃO
            </span>
          </div>

          {/* Headline */}
          <h1
            className={`hero-text delay-1 ${isVisible ? "visible" : ""} hero-title`}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "96px",
              lineHeight: "0.92",
              letterSpacing: "0.02em",
              color: "#f0ece4",
              maxWidth: "800px",
              marginBottom: "32px",
            }}
          >
            Equipamentos certos
            <br />
            <span style={{ color: "#d4a843" }}>para cada etapa</span>
            <br />
            da obra
          </h1>

          {/* Subheadline */}
          <p
            className={`hero-text delay-2 ${isVisible ? "visible" : ""}`}
            style={{
              fontSize: "18px",
              color: "#bbb",
              maxWidth: "500px",
              lineHeight: "1.65",
              marginBottom: "44px",
              fontWeight: 300,
            }}
          >
            Locação com orientação de engenheiro. Você não precisa adivinhar qual
            equipamento usar — a gente indica o correto antes de você locar.
          </p>

          {/* CTA */}
          <div className={`hero-text delay-3 ${isVisible ? "visible" : ""}`}>
            <a
              href="#contato"
              className="cta-btn"
            >
              Solicitar orçamento agora
            </a>
          </div>

          {/* Stats */}
          <div
            className={`hero-text delay-4 ${isVisible ? "visible" : ""}`}
            style={{
              display: "flex",
              gap: "48px",
              marginTop: "72px",
              paddingTop: "40px",
              borderTop: "1px solid #222",
              flexWrap: "wrap",
            }}
          >
            {[
              { n: "+900", label: "Clientes atendidos" },
              { n: "39", label: "Anos de experiência" },
              { n: "10+", label: "Categorias de equipamento" },
              { n: "1", label: "Engenheiro dedicado" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "42px",
                    color: "#d4a843",
                    lineHeight: 1,
                  }}
                >
                  {s.n}
                </div>
                <div style={{ fontSize: "13px", color: "#666", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENGENHEIRO */}
      <section
        id="engenheiro"
        style={{ background: "#d4a843", padding: "80px 48px" }}
        className="section-pad"
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "64px",
            alignItems: "center",
          }}
          className="eng-grid"
        >
          <div>
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#7a5c1a",
                fontWeight: 600,
                display: "block",
                marginBottom: "16px",
              }}
            >
              Diferencial exclusivo
            </span>
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "58px",
                lineHeight: "0.95",
                color: "#0a0a0a",
                marginBottom: "24px",
              }}
            >
              ENGENHEIRO À
              <br />
              SUA DISPOSIÇÃO
            </h2>
            <p style={{ fontSize: "16px", color: "#1a1208", lineHeight: "1.7", marginBottom: "16px" }}>
              A maioria das locadoras entrega o equipamento e vai embora. Aqui é
              diferente: temos um engenheiro disponível para orientar a especificação,
              dimensionamento e uso correto do equipamento antes de você locar e
              durante a obra.
            </p>
            <p style={{ fontSize: "16px", color: "#1a1208", lineHeight: "1.7" }}>
              Isso reduz retrabalho, evita erro de especificação e garante que o
              equipamento vai atender o que a obra precisa. Sem improviso.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              "Análise técnica da sua necessidade antes do orçamento",
              "Recomendação de capacidade, modelo e configuração ideal",
              "Suporte durante a locação para dúvidas operacionais",
              "Segurança técnica para quem assina o projeto e a ART",
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                  background: "rgba(0,0,0,0.1)",
                  padding: "18px 20px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "28px",
                    color: "rgba(0,0,0,0.25)",
                    lineHeight: 1,
                    minWidth: 30,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: "15px", color: "#1a1208", lineHeight: "1.5", fontWeight: 500 }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section style={{ padding: "100px 48px", background: "#0d0d0d" }} className="section-pad">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "60px" }}>
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#d4a843",
                fontWeight: 600,
                display: "block",
                marginBottom: "12px",
              }}
            >
              Por que nos escolher
            </span>
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "52px",
                color: "#f0ece4",
                lineHeight: 1,
              }}
            >
              FUNDAMENTOS DE UMA
              <br />
              LOCADORA SÉRIA
            </h2>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}
            className="diff-grid"
          >
            {diferenciais.map((d, i) => (
              <div
                key={i}
                className={d.destaque ? "diff-card-destaque" : "diff-card"}
                style={{ padding: "36px 28px" }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    marginBottom: "14px",
                    lineHeight: "1.3",
                    color: d.destaque ? "#0a0a0a" : "#f0ece4",
                  }}
                >
                  {d.titulo}
                </h3>
                <p style={{ fontSize: "14px", lineHeight: "1.7", color: d.destaque ? "#2a1f00" : "#888" }}>
                  {d.texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" style={{ padding: "100px 48px", background: "#0a0a0a" }} className="section-pad">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "60px" }}>
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#d4a843",
                fontWeight: 600,
                display: "block",
                marginBottom: "12px",
              }}
            >
              Processo
            </span>
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "52px",
                color: "#f0ece4",
                lineHeight: 1,
              }}
            >
              DA SOLICITAÇÃO
              <br />
              À ENTREGA NA OBRA
            </h2>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}
            className="process-grid"
          >
            {[
              {
                step: "01",
                titulo: "Você descreve a necessidade",
                texto: "Conte o que vai executar, a etapa e o prazo.",
              },
              {
                step: "02",
                titulo: "Nosso engenheiro analisa",
                texto: "Indicamos o equipamento certo, a capacidade e a configuração para sua obra.",
              },
              {
                step: "03",
                titulo: "Orçamento claro e rápido",
                texto: "Você recebe o valor por dia, semana ou mês. Sem taxa escondida.",
              },
              {
                step: "04",
                titulo: "Entrega e suporte ativo",
                texto: "Entregamos, orientamos o uso correto e ficamos disponíveis durante a locação.",
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "40px 32px",
                  borderLeft: i === 0 ? "none" : "1px solid #1a1a1a",
                  borderTop: `3px solid ${i === 0 ? "#d4a843" : "#1a1a1a"}`,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "52px",
                    color: "#1e1e1e",
                    lineHeight: 1,
                    marginBottom: "20px",
                  }}
                >
                  {s.step}
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px", color: "#f0ece4", lineHeight: "1.4" }}>
                  {s.titulo}
                </h3>
                <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.7" }}>{s.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FAIXA MEIO */}
      <section
        style={{ background: "#111", padding: "80px 48px", borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a" }}
        className="section-pad"
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "40px",
            flexWrap: "wrap",
          }}
          className="cta-strip"
        >
          <div>
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "46px",
                color: "#f0ece4",
                lineHeight: "0.95",
                marginBottom: "12px",
              }}
            >
              PRECISA DE EQUIPAMENTO
              <br />
              <span style={{ color: "#d4a843" }}>PARA SUA OBRA?</span>
            </h2>
            <p style={{ fontSize: "15px", color: "#777" }}>
              Descreva a necessidade e receba orientação técnica mais orçamento em minutos.
            </p>
          </div>
          <a
            href="#contato"
            className="cta-btn"
            style={{ whiteSpace: "nowrap" }}
          >
            Falar no WhatsApp agora
          </a>
        </div>
      </section>

      {/* EQUIPAMENTOS */}
      <section id="equipamentos" style={{ padding: "100px 48px", background: "#0a0a0a" }} className="section-pad">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "60px" }}>
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#d4a843",
                fontWeight: 600,
                display: "block",
                marginBottom: "12px",
              }}
            >
              Acervo
            </span>
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "52px",
                color: "#f0ece4",
                lineHeight: 1,
              }}
            >
              EQUIPAMENTOS
              <br />
              DISPONÍVEIS
            </h2>
            <p style={{ fontSize: "15px", color: "#666", marginTop: "16px", maxWidth: "500px", lineHeight: "1.7" }}>
              De escoramento a concretagem. O maior acervo de Mato Grosso para
              todas as etapas da sua obra.
            </p>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" }}
            className="eq-grid"
          >
            {equipamentos.map((eq) => (
              <div key={eq.id} className="eq-card">
                <div style={{ marginBottom: "14px", color: "#d4a843" }}>
                  <eq.Icon size={32} strokeWidth={1.5} />
                </div>
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#f0ece4", marginBottom: "8px", lineHeight: "1.3" }}>
                  {eq.nome}
                </h3>
                <p style={{ fontSize: "13px", color: "#666", lineHeight: "1.6" }}>{eq.descricao}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "48px", textAlign: "center" }}>
            <p style={{ fontSize: "14px", color: "#555", marginBottom: "20px" }}>
              Não encontrou o que precisa? Consulte nosso engenheiro.
            </p>
            <a
              href="#contato"
              className="cta-btn-outline"
            >
              Consultar disponibilidade
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "100px 48px", background: "#0d0d0d" }} className="section-pad">
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ marginBottom: "60px" }}>
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#d4a843",
                fontWeight: 600,
                display: "block",
                marginBottom: "12px",
              }}
            >
              Dúvidas frequentes
            </span>
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "52px",
                color: "#f0ece4",
                lineHeight: 1,
              }}
            >
              PERGUNTAS
              <br />
              FREQUENTES
            </h2>
          </div>

          <div>
            {faq.map((f, i) => (
              <div key={i} className="faq-item">
                <button
                  className="faq-btn"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{f.pergunta}</span>
                  <span
                    style={{
                      color: "#d4a843",
                      fontSize: "20px",
                      minWidth: 20,
                      textAlign: "center",
                      transform: openFaq === i ? "rotate(45deg)" : "none",
                      transition: "transform 0.2s",
                      display: "inline-block",
                    }}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && <p className="faq-answer">{f.resposta}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULÁRIO FINAL */}
      <section
        id="contato"
        style={{ padding: "100px 48px", background: "#0a0a0a", position: "relative", overflow: "hidden" }}
        className="section-pad"
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,168,67,0.06) 0%, transparent 70%)",
          }}
        />

        <div style={{ maxWidth: "640px", margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#d4a843",
                fontWeight: 600,
                display: "block",
                marginBottom: "20px",
              }}
            >
              Fale com a gente
            </span>
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "64px",
                color: "#f0ece4",
                lineHeight: "0.92",
                marginBottom: "20px",
              }}
            >
              FALE COM QUEM
              <br />
              <span style={{ color: "#d4a843" }}>ENTENDE DE OBRA</span>
            </h2>
            <p style={{ fontSize: "16px", color: "#777", lineHeight: "1.7" }}>
              Preencha abaixo e vamos continuar a conversa no WhatsApp.
            </p>
          </div>

          <form onSubmit={handleFormSubmit}>
            <div
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}
              className="form-grid"
            >
              <div>
                <label
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#555",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Seu nome
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex.: João Silva"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#555",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Seu WhatsApp
                </label>
                <PhoneInputWithFlag
                  value={whatsapp}
                  onChange={(val) => setWhatsapp(val)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="cta-btn"
              style={{ width: "100%", textAlign: "center", fontSize: "16px", padding: "20px" }}
            >
              Enviar e continuar no WhatsApp
            </button>
            <p style={{ marginTop: "14px", fontSize: "13px", color: "#444", textAlign: "center" }}>
              Atendimento direto. Sem enrolação.
            </p>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#050505", borderTop: "1px solid #141414", padding: "48px 48px 32px" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "48px",
            marginBottom: "40px",
          }}
          className="footer-grid"
        >
          <div>
            <div style={{ marginBottom: "16px" }}>
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "26px",
                  letterSpacing: "0.1em",
                  color: "#f0ece4",
                  display: "block",
                  lineHeight: 1,
                }}
              >
                LOCADORA DA
              </span>
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "26px",
                  letterSpacing: "0.1em",
                  color: "#d4a843",
                  display: "block",
                  lineHeight: 1,
                }}
              >
                CONSTRUÇÃO
              </span>
            </div>
            <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.7", maxWidth: "320px" }}>
              Locação de equipamentos para construção civil em Cuiabá. 39 anos de
              experiência com suporte técnico de engenheiro.
            </p>
          </div>

          <div>
            <h4
              style={{
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#444",
                marginBottom: "20px",
              }}
            >
              Contato
            </h4>
            <div style={{ fontSize: "14px", color: "#666", lineHeight: "1.8" }}>
              <div>📍 Av. Des. Antônio Quirino de Araújo, 121 - Areão, Cuiabá - MT, 78010-650</div>
              <div style={{ marginTop: "16px" }}>
                <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#444", marginBottom: "8px" }}>
                  Horário de Atendimento
                </div>
                <div>Seg-sexta: 07:30 às 11:30 e 13:30 às 17:30</div>
                <div>Sábados: 07:30 às 11:30</div>
              </div>
              <div style={{ marginTop: "16px" }}>
                <a
                  href={`${WHATSAPP_BASE}?text=${encodeURIComponent("Olá, quero fazer um orçamento")}`}
                  style={{ color: "#d4a843", textDecoration: "none", fontWeight: 600 }}
                >
                  WhatsApp: (65) 99233-4612
                </a>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #141414", paddingTop: "24px" }}>
          <span style={{ fontSize: "12px", color: "#333" }}>
            © {new Date().getFullYear()} Locadora da Construção. Todos os direitos reservados.
          </span>
        </div>
      </footer>
    </main>
  );
}
