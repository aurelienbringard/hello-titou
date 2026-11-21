#!/usr/bin/env python3
"""Generate crawlable static pages, robots.txt, sitemap.xml, llms.txt and SEO snippets.

Reads index.html, blog-posts.js and seo-content.js from the project root.
Writes HTML under /blog/, /contact/, /abonnements/, /aide/, legal paths, plus
assets/site.css, robots.txt, sitemap.xml, llms.txt, llms-full.txt, site.webmanifest, 404.html.

Usage:
  python3 tools/build_static.py
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from datetime import date
from html import escape as html_escape

def escape(s, quote=True):
    # Keep typographic apostrophes readable in view-source / titles.
    s = html_escape(s, quote=False).replace('"', '&quot;')
    if quote:
        s = s.replace('"', '&quot;')
    return s

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://hellotitou.fr"
TODAY = date(2026, 11, 21).isoformat()
SEO_JS_VER = "202611211050"

PUBLIC_PATHS = {
    "": "/",
    "accueil": "/",
    "blog": "/blog/",
    "abonnements": "/abonnements/",
    "aide": "/aide/",
    "parents": "/aide/",
    "mentions": "/mentions-legales/",
    "mentions-legales": "/mentions-legales/",
    "cgv": "/cgv/",
    "cgu": "/cgu/",
    "confidentialite": "/confidentialite/",
    "cookies": "/cookies/",
    "contact": "/contact/",
    "contactez-nous": "/contact/",
    "acces-anticipe": "/acces-anticipe/",
}

NAV = [
    ("/", "Accueil", "home"),
    ("/blog/", "Blog", "blog"),
    ("/abonnements/", "Abonnements", "abonnements"),
    ("/aide/", "Parents/Aide", "aide"),
    ("/contact/", "Contactez-nous", "contact"),
]

FOOTER = [
    ("/mentions-legales/", "Mentions légales"),
    ("/cgv/", "CGV"),
    ("/cgu/", "CGU"),
    ("/confidentialite/", "Politique de confidentialité"),
    ("/cookies/", "Cookies"),
    ("/contact/", "Contactez-nous"),
    ("/acces-anticipe/", "Accès anticipé gratuit"),
    ("/blog/", "Blog"),
]

# Compact Titou mark (same motif as favicon.svg), used in static chrome.
TITOU_MARK = (
    '<svg class="titou" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="36" height="36" aria-hidden="true">'
    '<rect width="64" height="64" rx="14" fill="#080a12"/>'
    '<path d="M16 28C14 11 28 8 31 22" fill="#F4A56C"/>'
    '<path d="M48 28C50 11 36 8 33 22" fill="#F4A56C"/>'
    '<path d="M19 24C18.5 15 27 14.5 29 22" fill="#36d3be"/>'
    '<path d="M45 24C45.5 15 37 14.5 35 22" fill="#36d3be"/>'
    '<circle cx="32" cy="36" r="20" fill="#F4A56C"/>'
    '<circle cx="32" cy="41" r="12" fill="#FFE9D2"/>'
    '<circle cx="25" cy="33" r="3.2" fill="#1d1d1f"/>'
    '<circle cx="39" cy="33" r="3.2" fill="#1d1d1f"/>'
    '<circle cx="26.2" cy="31.8" r="1.1" fill="#fff"/>'
    '<circle cx="40.2" cy="31.8" r="1.1" fill="#fff"/>'
    '<ellipse cx="32" cy="38.5" rx="2.3" ry="1.6" fill="#36d3be"/>'
    '<path d="M26 44q6 5.5 12 0" fill="none" stroke="#1d1d1f" stroke-width="1.8" stroke-linecap="round"/>'
    "</svg>"
)

SHARE_ICO = (
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    '<circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle>'
    '<circle cx="18" cy="19" r="3"></circle>'
    '<line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>'
    '<line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line></svg>'
)
BACK_ICO = (
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    '<path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>'
)
ARROW_ICO = (
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    '<path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>'
)

STATIC_CSS_EXTRA = """
/* Static marketing pages: body already scrolls via html[data-chrome="site"] */
html.static-page .site-header-actions .pill { min-height: 36px; padding: 0 12px; font-size: 13px; text-decoration: none; display: inline-flex; align-items: center; }
@media (max-width: 420px) {
  html.static-page .site-header-actions .pill { min-width: 0; min-height: 36px; padding: 0 8px; font-size: 12px; }
}
html.static-page a.pill { text-decoration: none; }
html.static-page .site-nav a,
html.static-page .site-nav-drop a,
html.static-page .site-nav a:hover,
html.static-page .site-nav a:focus,
html.static-page .site-nav a:focus-visible,
html.static-page .site-nav a:active,
html.static-page .site-nav a:visited,
html.static-page .site-nav-drop a:hover,
html.static-page .site-nav-drop a:focus,
html.static-page .site-nav-drop a:focus-visible,
html.static-page .site-nav-drop a:active,
html.static-page .site-nav-drop a:visited {
  text-decoration: none;
}
html.static-page .site-nav-drop a {
  display: flex; align-items: center; width: 100%;
}
html.static-page .site-header-actions a.pill.header-early,
html.static-page .site-header-actions .header-early { display: none !important; }
@media (min-width: 1320px) {
  html.static-page .site-header-actions a.pill.header-early,
  html.static-page .site-header-actions .header-early { display: inline-flex !important; white-space: nowrap; }
}
html.static-page .article-toc a {
  display: block; width: 100%; text-align: left; color: inherit; text-decoration: none;
  font-size: 14px; font-weight: 600; padding: 6px 0; min-height: 36px;
}
html.static-page .article-toc a:hover { color: var(--accent); }
html.static-page .blog-crumb a, html.static-page .contact-crumb a {
  color: var(--text2); text-decoration: none; font-weight: 650;
}
html.static-page .blog-crumb a:hover, html.static-page .contact-crumb a:hover { color: var(--text); }
html.static-page .cover-icon { text-decoration: none; color: inherit; display: grid; place-items: center; }
"""


def load_seo() -> dict:
    src = (ROOT / "seo-content.js").read_text(encoding="utf-8")
    js = "const window = {};\n" + src + "\nprocess.stdout.write(JSON.stringify(window.HT_SEO));\n"
    out = subprocess.check_output(["node", "-e", js], text=True)
    return json.loads(out)


def load_blog() -> list[dict]:
    text = (ROOT / "blog-posts.js").read_text(encoding="utf-8")
    i = text.index("{")
    payload = text[i:].strip()
    if payload.endswith(";"):
        payload = payload[:-1]
    data = json.loads(payload)
    return data["posts"]


def extract_css(index_html: str) -> str:
    m = re.search(r"<style>(.*?)</style>", index_html, re.S)
    if not m:
        raise SystemExit("Could not find <style> in index.html")
    return m.group(1).strip() + "\n" + STATIC_CSS_EXTRA


def extract_legal_html(index_html: str) -> dict[str, str]:
    start = index_html.find("  function legalTodo(")
    end = index_html.find("  function isKidScreen(")
    if start < 0 or end < 0 or end <= start:
        raise SystemExit("Could not extract legalBody from index.html")
    fn = index_html[start:end]
    js = f"""
function legalTodo(label) {{
  return '<mark class="legal-todo">[À COMPLÉTER : ' + label + "]</mark>";
}}
{fn}
const ids = ["mentions","cgv","cgu","confidentialite","cookies"];
const out = {{}};
for (const id of ids) out[id] = legalBody(id);
process.stdout.write(JSON.stringify(out));
"""
    # legalBody is already in fn; legalTodo too. Don't duplicate legalTodo if it's in fn.
    stub = """
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]);
  });
}
"""
    if "function legalTodo" in fn:
        js = stub + fn + """
const ids = ["mentions","cgv","cgu","confidentialite","cookies"];
const out = {};
for (const id of ids) out[id] = legalBody(id);
process.stdout.write(JSON.stringify(out));
"""
    else:
        js = stub + js
    return json.loads(subprocess.check_output(["node", "-e", js], text=True))


def extract_aide_html(index_html: str) -> str:
    """Rebuild the aide page body (without in-app-only buttons)."""
    return (
        '<div class="aide-doc">'
        f'<div class="home-hero" style="padding-bottom:8px">{TITOU_MARK}</div>'
        "<h1>Parents / Aide</h1>"
        "<p>Hello Titou aide les enfants de 4 à 8 ans à entendre l'anglais et à apprendre des mots par le jeu, avec Titou. Tout est pensé pour que l'enfant n'ait rien à taper.</p>"
        "<h2>Jouer</h2>"
        "<p>Le jeu est réservé aux familles dont le compte parent a été validé. Une fois connecté, touchez ▶ pour choisir un profil (mascotte, âge, prénom facultatif), puis une catégorie et un mini-jeu&nbsp;: Découvrir, Trouve, ou Mémoire. La voix est en anglais américain. Une consigne en français peut précéder les questions.</p>"
        "<p><a class=\"pill ok\" href=\"/#play\">Jouer avec Titou</a></p>"
        "<h2>Compte parent</h2>"
        "<p>L'inscription libre n'est pas ouverte. Pour tester Hello Titou en tant que bêta testeur, déposez une demande d'accès anticipé gratuit. Après validation, vous recevez un e-mail pour activer votre compte parent, jouer et synchroniser les profils et les étoiles entre plusieurs appareils.</p>"
        "<p><a class=\"pill ok\" href=\"/acces-anticipe/\">Accès anticipé gratuit</a> "
        "<a class=\"pill no\" href=\"/#auth\">Se connecter</a></p>"
        "<h2>Zone parents</h2>"
        "<p>La zone parents permet de gérer les profils, l'âge, et de remettre les étoiles à zéro. Elle est protégée par une petite question, pour éviter les changements accidentels. Ouvrez-la depuis le jeu, une fois un profil choisi.</p>"
        "<h2>Abonnements</h2>"
        "<p>Deux formules sont prévues (19&nbsp;€ / mois sans engagement, ou 399&nbsp;€ à vie). Les paiements ne sont pas encore ouverts. Un accès anticipé gratuit est proposé aux bêta testeurs, sur demande et après validation.</p>"
        '<p><a class="pill no" href="/abonnements/">Voir les abonnements</a></p>'
        "</div>"
    )


def format_fr_date(iso: str) -> str:
    months = [
        "janvier", "février", "mars", "avril", "mai", "juin",
        "juillet", "août", "septembre", "octobre", "novembre", "décembre",
    ]
    y, m, d = [int(x) for x in iso.split("-")]
    return f"{d} {months[m - 1]} {y}"


def dump_jsonld(obj) -> str:
    return json.dumps(obj, ensure_ascii=False, indent=2)


def org_graph(seo: dict) -> list:
    logo = (seo.get("ogImage") or "").rsplit("/", 1)[0] + "/icon-512.png" if seo.get("ogImage") else None
    org = {
        "@type": "Organization",
        "@id": SITE + "/#organization",
        "name": "Hello Titou",
        "url": SITE + "/",
        "logo": {"@type": "ImageObject", "url": logo, "width": 512, "height": 512} if logo else None,
        "description": seo["descriptionHome"],
        "inLanguage": "fr-FR",
    }
    org = {k: v for k, v in org.items() if v is not None}
    website = {
        "@type": "WebSite",
        "@id": SITE + "/#website",
        "url": SITE + "/",
        "name": "Hello Titou",
        "inLanguage": "fr-FR",
        "description": seo["descriptionHome"],
        "publisher": {"@id": SITE + "/#organization"},
    }
    app = {
        "@type": ["SoftwareApplication", "WebApplication"],
        "@id": SITE + "/#app",
        "name": "Hello Titou",
        "url": SITE + "/",
        "applicationCategory": "EducationalApplication",
        "applicationSubCategory": "Language learning",
        "operatingSystem": "Web",
        "inLanguage": "fr-FR",
        "description": seo["descriptionHome"],
        "audience": {
            "@type": "EducationalAudience",
            "educationalRole": "student",
            "audienceType": "Enfants de 4 à 8 ans et leurs parents",
        },
        "isAccessibleForFree": False,
        "offers": [
            {
                "@type": "Offer",
                "name": "Mensuel",
                "price": "19.00",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/PreOrder",
                "description": "19 € par mois, sans engagement. Paiements bientôt disponibles.",
                "url": SITE + "/abonnements/",
            },
            {
                "@type": "Offer",
                "name": "À vie",
                "price": "399.00",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/PreOrder",
                "description": "399 € en un seul paiement, accès à vie prévu. Paiements bientôt disponibles.",
                "url": SITE + "/abonnements/",
            },
        ],
        "publisher": {"@id": SITE + "/#organization"},
    }
    return [org, website, app]


def faq_jsonld(seo: dict) -> dict:
    return {
        "@type": "FAQPage",
        "@id": SITE + "/#faq",
        "inLanguage": "fr-FR",
        "mainEntity": [
            {
                "@type": "Question",
                "name": it["q"],
                "acceptedAnswer": {"@type": "Answer", "text": it["a"]},
            }
            for it in seo["faq"]
        ],
    }


def breadcrumb_jsonld(items: list[tuple[str, str]]) -> dict:
    return {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": i + 1,
                "name": name,
                "item": SITE + url,
            }
            for i, (url, name) in enumerate(items)
        ],
    }


def head_tags(seo: dict, *, title: str, description: str, canonical: str,
              og_type: str = "website", image: str | None = None,
              image_alt: str | None = None, jsonld: list | dict | None = None) -> str:
    image = image or seo["ogImage"]
    image_alt = image_alt or seo.get("ogImageAlt") or title
    desc = escape(description, quote=True)
    title_e = escape(title, quote=True)
    can = escape(canonical, quote=True)
    img = escape(image, quote=True)
    alt = escape(image_alt, quote=True)
    if jsonld is None:
        graph = org_graph(seo)
    elif isinstance(jsonld, list):
        graph = jsonld
    else:
        graph = [jsonld]
    payload = {"@context": "https://schema.org", "@graph": graph}
    # validate
    json.loads(json.dumps(payload))
    ld = dump_jsonld(payload)
    return f"""  <title>{title_e}</title>
  <meta name="description" content="{desc}" />
  <meta name="robots" content="index,follow,max-image-preview:large" />
  <link rel="canonical" href="{can}" />
  <link rel="alternate" hreflang="fr-FR" href="{can}" />
  <link rel="alternate" hreflang="x-default" href="{can}" />
  <meta property="og:type" content="{escape(og_type, quote=True)}" />
  <meta property="og:site_name" content="Hello Titou" />
  <meta property="og:locale" content="fr_FR" />
  <meta property="og:title" content="{title_e}" />
  <meta property="og:description" content="{desc}" />
  <meta property="og:url" content="{can}" />
  <meta property="og:image" content="{img}" />
  <meta property="og:image:alt" content="{alt}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{title_e}" />
  <meta name="twitter:description" content="{desc}" />
  <meta name="twitter:image" content="{img}" />
  <meta name="twitter:image:alt" content="{alt}" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" href="{escape(seo['ogImage'].rsplit('/',1)[0] + '/apple-touch-icon.png', quote=True)}" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="preconnect" href="https://hyfvwxfgsmuyekfxucot.supabase.co" crossorigin />
  <link rel="dns-prefetch" href="https://hyfvwxfgsmuyekfxucot.supabase.co" />
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
  <script type="application/ld+json">
{ld}
  </script>"""


COMMON_HEAD_START = """<!DOCTYPE html>
<html lang="fr" data-theme="dark" data-chrome="site" class="static-page">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#080a12" />
  <meta name="apple-mobile-web-app-title" content="Hello Titou" />
  <meta name="application-name" content="Hello Titou" />
  <link rel="stylesheet" href="/assets/site.css" />
"""

THEME_JS = """<script>
(function () {
  var KEY = "helloTitou.appearance";
  function pref() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function darkNow() {
    var p = pref();
    if (p === "light") return false;
    if (p === "system") return !window.matchMedia || window.matchMedia("(prefers-color-scheme: dark)").matches;
    return true;
  }
  function apply() {
    var dark = darkNow();
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#080a12" : "#f5f5f7");
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
      var ico = btn.querySelector(".theme-ico");
      var sw = btn.querySelector(".ios-switch");
      if (ico) ico.textContent = dark ? "🌙" : "☀️";
      if (sw) sw.classList.toggle("on", dark);
    }
  }
  apply();
  window.HT_toggleTheme = function () {
    try { localStorage.setItem(KEY, darkNow() ? "light" : "dark"); } catch (e) {}
    apply();
  };
  document.addEventListener("DOMContentLoaded", apply);
  var t = document.getElementById("nav-toggle");
  var d = document.getElementById("nav-drop");
  if (t && d) {
    t.addEventListener("click", function () {
      var open = !d.classList.contains("open");
      d.classList.toggle("open", open);
      t.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
})();
</script>
"""


def theme_toggle_html() -> str:
    return (
        '<button type="button" class="theme-toggle" id="theme-toggle" onclick="HT_toggleTheme()" '
        'aria-label="Mode sombre" aria-pressed="true" title="Mode sombre">'
        '<span class="theme-ico" aria-hidden="true">🌙</span>'
        '<span class="ios-switch on" aria-hidden="true"><i></i></span></button>'
    )


def header_footer(current: str) -> tuple[str, str]:
    links = ""
    for href, label, key in NAV:
        on = " on" if key == current else ""
        links += f'<a href="{href}" class="{on.strip()}">{escape(label)}</a>'
    header = (
        '<header class="site-header">'
        f'<a class="site-brand" href="/" aria-label="Hello Titou, accueil">{TITOU_MARK}'
        '<span class="site-wordmark">Hello Titou</span></a>'
        f'<nav class="site-nav" aria-label="Navigation principale">{links}</nav>'
        '<div class="site-header-actions">'
        + theme_toggle_html()
        + '<a class="pill gold header-early" href="/acces-anticipe/">Accès anticipé gratuit</a>'
        + '<a class="pill no" href="/#auth">Se connecter</a>'
        + '<a class="pill ok" href="/#play">Jouer</a>'
        + '<button type="button" class="site-nav-toggle" id="nav-toggle" aria-label="Menu" aria-expanded="false">☰</button>'
        + "</div>"
        + f'<div class="site-nav-drop" id="nav-drop" role="menu">{links}</div>'
        + "</header>"
    )
    fnav = '<nav aria-label="Pied de page">'
    for href, label in FOOTER:
        fnav += f'<a href="{href}">{escape(label)}</a>'
    fnav += "</nav>"
    footer = (
        '<footer class="site-footer"><div class="foot-top">'
        f'<div class="foot-brand">{TITOU_MARK}<span>Hello Titou</span></div>{fnav}'
        '</div><p class="foot-copy">© 2026 Hello Titou</p></footer>'
    )
    return header, footer


def page_shell(seo: dict, *, title, description, canonical, current, main_html,
               og_type="website", image=None, image_alt=None, jsonld=None,
               extra_js="") -> str:
    header, footer = header_footer(current)
    head = COMMON_HEAD_START + head_tags(
        seo, title=title, description=description, canonical=canonical,
        og_type=og_type, image=image, image_alt=image_alt, jsonld=jsonld,
    ) + "\n</head>\n"
    return (
        head
        + "<body>\n"
                + '  <div class="sky" aria-hidden="true"></div>\n'
        + '  <div class="site-clouds" aria-hidden="true"><div class="clouds-fade"></div><svg viewBox="0 0 1440 240" preserveAspectRatio="xMidYMax slice" focusable="false"><g class="c-back"><ellipse cx="120" cy="210" rx="260" ry="78"/><ellipse cx="340" cy="200" rx="210" ry="70"/><ellipse cx="720" cy="214" rx="280" ry="72"/><ellipse cx="1080" cy="204" rx="240" ry="74"/><ellipse cx="1360" cy="216" rx="220" ry="68"/></g><g class="c-mid"><ellipse cx="0" cy="222" rx="200" ry="62"/><ellipse cx="250" cy="214" rx="190" ry="58"/><ellipse cx="500" cy="220" rx="210" ry="64"/><ellipse cx="820" cy="210" rx="230" ry="66"/><ellipse cx="1120" cy="218" rx="200" ry="60"/><ellipse cx="1440" cy="224" rx="210" ry="62"/></g><g class="c-front"><ellipse cx="180" cy="230" rx="170" ry="48"/><ellipse cx="430" cy="226" rx="160" ry="46"/><ellipse cx="700" cy="232" rx="190" ry="50"/><ellipse cx="980" cy="228" rx="170" ry="48"/><ellipse cx="1280" cy="234" rx="180" ry="46"/></g></svg></div>\n'
        + '  <div id="app">\n'
        + '    <div class="screen screen-site" data-screen="' + escape(current, quote=True) + '">\n'
        + "      " + header + "\n"
        + '      <div class="site-main">\n'
        + main_html
        + "\n      </div>\n"
        + "      " + footer + "\n"
        + "    </div>\n"
        + "  </div>\n"
        + THEME_JS
        + extra_js
        + "</body>\n</html>\n"
    )


def faq_html(seo: dict, open_first: bool = True) -> str:
    items = seo["faq"]
    html = f'<section class="home-section home-faq" aria-labelledby="faq-title"><h2 id="faq-title">{escape(seo["faqTitle"])}</h2>'
    for i, it in enumerate(items):
        open_attr = " open" if open_first and i == 0 else ""
        html += (
            f'<details class="faq-item"{open_attr}><summary>{escape(it["q"])}</summary>'
            f'<p>{escape(it["a"])}</p></details>'
        )
    html += "</section>"
    return html


def home_explainer_html(seo: dict) -> str:
    html = (
        '<section class="home-section home-about" aria-labelledby="about-title">'
        f'<h2 id="about-title">{escape(seo["aboutTitle"])}</h2>'
        f'<p class="home-lead">{escape(seo["lead"])}</p>'
    )
    for p in seo["aboutParagraphs"]:
        html += f"<p>{escape(p)}</p>"
    html += "</section>"
    html += (
        '<section class="home-section home-how" aria-labelledby="how-title">'
        f'<h2 id="how-title">{escape(seo["howTitle"])}</h2><ol class="how-list">'
    )
    for it in seo["howItems"]:
        html += f"<li><h3>{escape(it['title'])}</h3><p>{escape(it['text'])}</p></li>"
    html += "</ol></section>"
    html += (
        '<section class="home-section" aria-labelledby="ages-title">'
        f'<h2 id="ages-title">{escape(seo["agesTitle"])}</h2>'
        f'<p>{escape(seo["agesText"])}</p></section>'
    )
    html += (
        '<section class="home-section" aria-labelledby="price-title">'
        f'<h2 id="price-title">{escape(seo["priceTitle"])}</h2>'
        f'<p>{escape(seo["priceText"])}</p>'
        '<p><a class="pill no" href="/abonnements/">Voir les abonnements</a></p></section>'
    )
    html += faq_html(seo)
    return html


def home_prerender(seo: dict) -> str:
    header, footer = header_footer("home")
    hero = (
        '<div class="home-hero">'
        f"{TITOU_MARK}"
        '<div class="title"><h1>Hello Titou</h1><p>L\'anglais en s\'amusant, dès 4 ans</p></div>'
        '<a class="play-btn" href="/#play" aria-label="Jouer">▶</a>'
        '<a class="pill ok early-access-cta" href="/acces-anticipe/">Accès anticipé gratuit</a>'
        '<div class="preview-row"><span>🐶</span><span>🎨</span><span>🍏</span><span>🚒</span><span>🚀</span></div>'
        "</div>"
    )
    return (
        '<div class="screen screen-site" data-screen="start">'
        + header
        + '<div class="site-main">'
        + hero
        + home_explainer_html(seo)
        + "</div>"
        + footer
        + "</div>"
    )


def blog_card(post: dict, nouveau: bool = True) -> str:
    tags = (post.get("tags") or ([post["category"]] if post.get("category") else []))[:3]
    tag_html = "".join(f'<span class="tag">{escape(t)}</span>' for t in tags)
    date_label = format_fr_date(post["date"]) if post.get("date") else ""
    href = f"/blog/{escape(post['slug'], quote=True)}/"
    thumb = (
        '<div class="thumb">'
        f'<img src="{escape(post["cover"], quote=True)}" alt="{escape(post.get("coverAlt") or post["title"], quote=True)}" '
        'width="1280" height="720" loading="lazy" decoding="async" />'
        '<div class="fade" aria-hidden="true"></div>'
        + (f'<div class="tags">{tag_html}</div>' if tags else "")
        + ('<span class="nouveau">Nouveau</span>' if nouveau else "")
        + "</div>"
    )
    return (
        f'<a class="post-card" href="{href}">'
        + thumb
        + f'<div class="body"><h2>{escape(post["title"])}</h2>'
        + (f'<p class="excerpt">{escape(post["excerpt"])}</p>' if post.get("excerpt") else "")
        + '<div class="foot"><span class="lire">Lire l\'article ' + ARROW_ICO + "</span>"
        + (f'<time class="when" datetime="{escape(post["date"], quote=True)}">{escape(date_label)}</time>' if date_label else "")
        + "</div></div></a>"
    )


def article_page(seo: dict, post: dict, posts: list[dict]) -> str:
    url = f"{SITE}/blog/{post['slug']}/"
    tags = (post.get("tags") or ([post["category"]] if post.get("category") else []))[:3]
    tag_html = "".join(f'<span class="tag">{escape(t)}</span>' for t in tags)
    date_label = format_fr_date(post["date"])
    reading = f"{post['readingMinutes']} min de lecture" if post.get("readingMinutes") else ""
    meta_bits = " · ".join(x for x in [date_label, reading] if x)
    crumb = (
        '<nav class="blog-crumb" aria-label="Fil d\'Ariane">'
        '<a href="/">Accueil</a><span aria-hidden="true">›</span>'
        '<a href="/blog/">Blog</a><span aria-hidden="true">›</span>'
        f'<span class="here">{escape(post["title"])}</span></nav>'
    )
    mail = f"mailto:?subject={quote(post['title'] + ' — Hello Titou')}&body={quote(post['title'] + chr(10)+chr(10) + url)}"
    tw = f"https://twitter.com/intent/tweet?text={quote(post['title'])}&url={quote(url)}"
    fb = f"https://www.facebook.com/sharer/sharer.php?u={quote(url)}"
    wa = f"https://wa.me/?text={quote(post['title'] + ' ' + url)}"
    share = (
        '<div class="article-share-pop" id="share-pop" hidden role="menu">'
        f'<button type="button" id="share-copy">Copier le lien</button>'
        f'<a href="{mail}">E-mail</a>'
        f'<a href="{tw}" target="_blank" rel="noopener">X / Twitter</a>'
        f'<a href="{fb}" target="_blank" rel="noopener">Facebook</a>'
        f'<a href="{wa}" target="_blank" rel="noopener">WhatsApp</a></div>'
    )
    cover = (
        '<header class="article-cover">'
        f'<img src="{escape(post["cover"], quote=True)}" alt="{escape(post.get("coverAlt") or post["title"], quote=True)}" '
        'width="1280" height="720" decoding="async" fetchpriority="high" />'
        '<div class="shade" aria-hidden="true"></div>'
        '<div class="cover-bar">'
        f'<a class="cover-icon" href="/blog/" aria-label="Retour au blog">{BACK_ICO}</a>'
        f'<button type="button" class="cover-icon" id="share-btn" aria-label="Partager" aria-expanded="false">{SHARE_ICO}</button>'
        "</div>"
        '<div class="cover-title">'
        + (f'<div class="cover-tags">{tag_html}</div>' if tags else "")
        + f"<h1>{escape(post['title'])}</h1></div></header>"
    )
    toc_items = post.get("toc") or []
    toc_inner = ""
    if toc_items:
        toc_inner = '<nav class="{cls}" aria-label="Dans cet article"><span class="eyebrow">Dans cet article</span><ol>'
        for it in toc_items:
            toc_inner += f'<li><a href="#{escape(it["id"], quote=True)}">{escape(it["label"])}</a></li>'
        toc_inner += "</ol></nav>"
    toc_desktop = toc_inner.format(cls="article-toc") if toc_inner else ""
    toc_mobile = toc_inner.format(cls="article-toc article-toc-mobile") if toc_inner else ""
    byline = (
        '<div class="article-byline"><div class="av" aria-hidden="true">' + TITOU_MARK + "</div><div>"
        f'<p class="who"><b>{escape(post.get("author") or "L\'équipe Hello Titou")}</b></p>'
        + (f'<p class="meta">{escape(meta_bits)}</p>' if meta_bits else "")
        + (f'<blockquote>{escape(post["quote"])}</blockquote>' if post.get("quote") else "")
        + "</div></div>"
    )
    takeaways = ""
    if post.get("takeaways"):
        takeaways = '<div class="article-takeaways"><h2>À retenir</h2><ul>'
        for t in post["takeaways"]:
            takeaways += f"<li>{escape(t)}</li>"
        takeaways += "</ul></div>"
    cta = post.get("cta") or {}
    end_cta = ""
    if cta:
        end_cta = (
            '<div class="article-end-cta">'
            f'<h2>{escape(cta.get("title") or "Et maintenant, à vous de jouer")}</h2>'
            f'<p>{escape(cta.get("text") or "")}</p>'
            f'<a class="pill ok" href="/">{escape(cta.get("button") or "Essayer Hello Titou")}</a></div>'
        )
    aside_cta = (
        '<div class="article-cta"><div class="glow" aria-hidden="true"></div>'
        + (f'<span class="eyebrow">{escape(cta["eyebrow"])}</span>' if cta.get("eyebrow") else "")
        + f'<h2>{escape(cta.get("title") or "Essayer Hello Titou")}</h2>'
        + f'<p>{escape(cta.get("text") or "Des mini-jeux d\'anglais pour les enfants de 4 à 8 ans.")}</p>'
        + f'<a class="pill ok" href="/#play">{escape(cta.get("button") or "Jouer avec Titou")}</a></div>'
    )
    related = [p for p in posts if p["slug"] != post["slug"] and p.get("body")][:2]
    related_html = ""
    if related:
        related_html = '<section class="related-wrap"><span class="eyebrow">À lire aussi</span><h2>Continuer la lecture.</h2><div class="blog-grid-v">'
        for p in related:
            related_html += blog_card(p, nouveau=False)
        related_html += "</div></section>"
    panel = (
        '<div class="article-panel">'
        + share
        + (f'<p class="article-chapo">{escape(post["excerpt"])}</p>' if post.get("excerpt") else "")
        + byline
        + toc_mobile
        + f'<div class="article-prose">{post["body"]}</div>'
        + takeaways
        + end_cta
        + "</div>"
    )
    main = (
        '<div class="article-shell">'
        + crumb
        + '<div class="article-layout"><div class="article-main">'
        + cover + panel + related_html
        + "</div>"
        + f'<aside class="article-aside">{toc_desktop}{aside_cta}</aside>'
        + "</div></div>"
    )
    extra_js = f"""<script>
(function () {{
  var btn = document.getElementById("share-btn");
  var pop = document.getElementById("share-pop");
  var copy = document.getElementById("share-copy");
  var url = {json.dumps(url)};
  if (btn && pop) {{
    btn.addEventListener("click", function () {{
      if (navigator.share) {{
        navigator.share({{ title: document.title, url: url }}).catch(function () {{}});
        return;
      }}
      var open = pop.hasAttribute("hidden");
      if (open) pop.removeAttribute("hidden"); else pop.setAttribute("hidden", "");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    }});
  }}
  if (copy) copy.addEventListener("click", function () {{
    navigator.clipboard.writeText(url).then(function () {{ copy.textContent = "Lien copié"; }});
  }});
}})();
</script>
"""
    article_ld = {
        "@type": "BlogPosting",
        "@id": url + "#article",
        "mainEntityOfPage": url,
        "headline": post["title"],
        "description": post.get("excerpt") or "",
        "inLanguage": "fr-FR",
        "datePublished": post["date"],
        "dateModified": post["date"],
        "author": {"@type": "Organization", "name": post.get("author") or "L'équipe Hello Titou", "url": SITE + "/"},
        "publisher": {"@id": SITE + "/#organization"},
        "image": [post["cover"]] if post.get("cover") else None,
        "wordCount": post.get("wordCount"),
        "articleSection": post.get("category") or None,
        "keywords": post.get("tags") or None,
    }
    article_ld = {k: v for k, v in article_ld.items() if v is not None}
    graph = org_graph(seo) + [
        article_ld,
        breadcrumb_jsonld([("/", "Accueil"), ("/blog/", "Blog"), (f"/blog/{post['slug']}/", post["title"])]),
    ]
    desc = post.get("excerpt") or seo["descriptionHome"]
    if len(desc) > 170:
        desc = desc[:157].rstrip() + "…"
    return page_shell(
        seo,
        title=f"{post['title']} — Hello Titou",
        description=desc,
        canonical=url,
        current="blog",
        main_html=main,
        og_type="article",
        image=post.get("cover") or seo["ogImage"],
        image_alt=post.get("coverAlt") or post["title"],
        jsonld=graph,
        extra_js=extra_js,
    )


def quote(s: str) -> str:
    from urllib.parse import quote as q
    return q(s, safe="")


def plans_html(seo: dict) -> str:
    return (
        '<article class="legal-doc"><h1>Abonnements</h1>'
        "<p>Les abonnements arriveront bientôt (19 € / mois sans engagement, ou 399 € à vie). En attendant, un accès anticipé gratuit est proposé aux bêta testeurs, sur demande et après validation.</p>"
        '<p><a class="pill ok" href="/acces-anticipe/">Accès anticipé gratuit</a></p>'
        '<div class="plan-card"><h2>Mensuel</h2><div class="price">19 € <span class="period">/ mois</span></div>'
        "<p>Sans engagement. Les paiements ne sont pas encore ouverts.</p>"
        '<a class="pill ok" href="/">S\'abonner — bientôt disponible</a></div>'
        '<div class="plan-card"><h2>À vie</h2><div class="price">399 € <span class="period">en une fois</span></div>'
        "<p>Un seul paiement, accès à vie prévu. Les paiements ne sont pas encore ouverts.</p>"
        '<a class="pill ok" href="/">S\'abonner — bientôt disponible</a></div>'
        + faq_html(seo)
        + "</article>"
    )


def contact_form_js(sb_url: str, sb_key: str) -> str:
    return f"""
(function () {{
  var SB_URL = {json.dumps(sb_url)};
  var SB_KEY = {json.dumps(sb_key)};
  var MAX = 1000;
  var form = document.getElementById("contact-form");
  if (!form || !window.supabase) return;
  var sb = window.supabase.createClient(SB_URL, SB_KEY);
  var btn = document.getElementById("contact-submit");
  var count = document.getElementById("contact-count");
  var msgBox = document.getElementById("contact-msg");
  function val() {{
    return {{
      firstName: (document.getElementById("contact-first").value || "").trim(),
      lastName: (document.getElementById("contact-last").value || "").trim(),
      email: (document.getElementById("contact-email").value || "").trim(),
      phone: (document.getElementById("contact-phone").value || "").trim(),
      subject: (document.getElementById("contact-subject").value || "").trim(),
      message: (document.getElementById("contact-message").value || "").trim(),
      company: (document.getElementById("contact-company").value || "").trim()
    }};
  }}
  function emailOk(s) {{ return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(s); }}
  function ready() {{
    var v = val();
    var stored = v.message.length + (v.phone ? ("Téléphone : " + v.phone + "\\n\\n").length : 0);
    return v.firstName.length >= 1 && v.lastName.length >= 1 &&
      (v.firstName + " " + v.lastName).trim().length <= 120 &&
      emailOk(v.email) && v.email.length <= 254 &&
      v.subject.length >= 2 && v.subject.length <= 200 &&
      v.message.length >= 10 && stored <= MAX && v.phone.length <= 40;
  }}
  function sync() {{
    var v = val();
    if (count) count.textContent = v.message.length + "/" + MAX;
    if (btn) btn.disabled = !ready();
  }}
  form.addEventListener("input", sync);
  sync();
  form.addEventListener("submit", async function (e) {{
    e.preventDefault();
    var v = val();
    function show(kind, text) {{
      if (!msgBox) return;
      msgBox.className = "auth-msg " + kind;
      msgBox.textContent = text;
      msgBox.hidden = false;
    }}
    if (v.company) {{
      form.hidden = true;
      show("ok", "Merci, votre message a bien été envoyé. Nous vous répondrons dès que possible.");
      return;
    }}
    if (!ready()) {{
      show("err", "Merci de renseigner tous les champs obligatoires, avec un message d'au moins 10 caractères.");
      return;
    }}
    var message = v.message;
    if (v.phone) message = "Téléphone : " + v.phone + "\\n\\n" + message;
    btn.disabled = true;
    btn.lastChild ? (btn.childNodes[btn.childNodes.length-1].textContent = " Envoi en cours…") : null;
    try {{
      var res = await sb.from("contact_messages").insert({{
        name: (v.firstName + " " + v.lastName).trim(),
        email: v.email,
        subject: v.subject,
        message: message
      }});
      if (res.error) throw res.error;
      form.hidden = true;
      show("ok", "Merci, votre message a bien été envoyé. Nous vous répondrons dès que possible.");
    }} catch (err) {{
      show("err", "Le message n'a pas pu être envoyé. Vérifiez votre connexion et réessayez.");
      btn.disabled = !ready();
    }}
  }});
}})();
"""


def contact_html() -> str:
    def field(fid, label, typ, placeholder, required, autocomplete):
        req = ' <span class="req">*</span>' if required else ""
        req_attr = " required" if required else ""
        return (
            f'<div><label class="contact-field-label" for="{fid}">{escape(label)}{req}</label>'
            f'<input class="field" id="{fid}" name="{fid}" type="{typ}"{req_attr} '
            f'placeholder="{escape(placeholder, quote=True)}" autocomplete="{autocomplete}" /></div>'
        )
    form = (
        '<div class="contact-form-card"><h2>Écrivez-nous</h2>'
        '<p class="contact-form-hint">Les champs marqués d\'un <span class="req">*</span> sont obligatoires.</p>'
        '<p class="auth-msg" id="contact-msg" hidden></p>'
        '<form id="contact-form" class="contact-form" novalidate>'
        '<div class="contact-grid">'
        + field("contact-first", "Prénom", "text", "Votre prénom", True, "given-name")
        + field("contact-last", "Nom", "text", "Votre nom", True, "family-name")
        + "</div>"
        + field("contact-email", "Adresse e-mail", "email", "votre@email.com", True, "email")
        + field("contact-phone", "Téléphone", "tel", "06 12 34 56 78", False, "tel")
        + field("contact-subject", "Sujet", "text", "Objet de votre message", True, "off")
        + '<div><div class="contact-msg-head"><label class="contact-field-label" for="contact-message">'
        + ' Message <span class="req">*</span></label>'
        + '<span class="contact-count" id="contact-count">0/1000</span></div>'
        + '<textarea class="field" id="contact-message" name="contact-message" required rows="6" maxlength="1000" '
        + 'placeholder="Décrivez votre demande ou votre question…"></textarea></div>'
        + '<input class="contact-hp" id="contact-company" name="company" type="text" tabindex="-1" autocomplete="off" aria-hidden="true" value="" />'
        + '<button type="submit" class="contact-submit" id="contact-submit" disabled>Envoyer le message</button>'
        + "</form>"
        + '<p class="contact-legal">Vos données personnelles sont traitées conformément à notre '
        + '<a href="/confidentialite/">politique de confidentialité</a>.</p></div>'
    )
    aside = (
        '<aside class="contact-aside">'
        '<div class="contact-info"><div class="hd"><h2>E-mail</h2></div>'
        '<p><mark class="legal-todo">[À COMPLÉTER : e-mail de contact]</mark></p></div>'
        '<div class="contact-info"><div class="hd"><h2>Téléphone</h2></div>'
        '<p><mark class="legal-todo">[À COMPLÉTER : numéro de téléphone]</mark></p></div>'
        '<div class="contact-info"><div class="hd"><h2>Adresse</h2></div>'
        '<p><mark class="legal-todo">[À COMPLÉTER : adresse postale]</mark></p></div>'
        '<div class="contact-info"><div class="hd"><h2>Réponse</h2></div>'
        "<p>Sous 24 à 48 h ouvrées</p></div>"
        "</aside>"
    )
    return (
        '<div class="contact-page">'
        '<section class="contact-hero"><div class="glow" aria-hidden="true"></div>'
        '<h1>Parlons de Hello <span class="em">Titou.</span></h1>'
        "<p>Une question sur le jeu, un compte parent, les exercices ou un abonnement&nbsp;? Nous sommes là pour vous accompagner.</p>"
        "</section>"
        '<nav class="contact-crumb" aria-label="Fil d\'Ariane">'
        '<a href="/">Accueil</a><span aria-hidden="true">›</span>'
        '<span class="here">Contact</span></nav>'
        f'<div class="contact-layout">{form}{aside}</div></div>'
    )


def redirect_page(target: str, title: str) -> str:
    t = escape(target, quote=True)
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0; url={t}" />
  <link rel="canonical" href="{t}" />
  <title>{escape(title)}</title>
  <script>location.replace({json.dumps(target)});</script>
</head>
<body>
  <p>Cette page a été déplacée vers <a href="{t}">{escape(target)}</a>.</p>
</body>
</html>
"""


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    print(f"  wrote {path.relative_to(ROOT)} ({len(content.encode())} bytes)")


def sitemap_xml(urls: list[tuple[str, str, str]]) -> str:
    # url, lastmod, priority
    parts = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for loc, lastmod, pri in urls:
        parts.append("  <url>")
        parts.append(f"    <loc>{escape(loc)}</loc>")
        parts.append(f"    <lastmod>{lastmod}</lastmod>")
        parts.append(f"    <priority>{pri}</priority>")
        parts.append("  </url>")
    parts.append("</urlset>\n")
    return "\n".join(parts)


def robots_txt() -> str:
    return (
        "User-agent: *\n"
        "Allow: /\n"
        "\n"
        "User-agent: GPTBot\n"
        "Allow: /\n"
        "\n"
        "User-agent: ChatGPT-User\n"
        "Allow: /\n"
        "\n"
        "User-agent: PerplexityBot\n"
        "Allow: /\n"
        "\n"
        "User-agent: Google-Extended\n"
        "Allow: /\n"
        "\n"
        "User-agent: ClaudeBot\n"
        "Allow: /\n"
        "\n"
        "User-agent: anthropic-ai\n"
        "Allow: /\n"
        "\n"
        f"Sitemap: {SITE}/sitemap.xml\n"
    )


def llms_txt(seo: dict, posts: list[dict]) -> str:
    lines = [
        "# Hello Titou",
        "",
        f"> {seo['lead']}",
        "",
        "Hello Titou is a web game that helps children aged 4 to 8 hear and learn English through play, with a mascot named Titou. Nothing to read or type: the child listens, taps a picture, and can repeat. Play requires an approved parent account. Free early access is offered to beta testers on request, subject to approval. Planned plans (payments not yet open): €19/month with no commitment, or €399 lifetime.",
        "",
        "## Pages",
        "",
        f"- [Accueil]({SITE}/): Présentation du jeu, public, fonctionnement, tarifs prévus et FAQ.",
        f"- [Blog]({SITE}/blog/): Articles pour les parents.",
    ]
    for p in posts:
        lines.append(f"- [{p['title']}]({SITE}/blog/{p['slug']}/): {p['excerpt']}")
    lines += [
        f"- [Abonnements]({SITE}/abonnements/): Formules prévues (19 € / mois ou 399 € à vie) ; paiements pas encore ouverts ; accès anticipé gratuit pour les bêta testeurs, sur demande.",
        f"- [Accès anticipé gratuit]({SITE}/acces-anticipe/): Demande de compte bêta testeur, soumise à validation.",
        f"- [Parents / Aide]({SITE}/aide/): Comment jouer, compte parent, zone parents.",
        f"- [Contact]({SITE}/contact/): Formulaire de contact.",
        f"- [Mentions légales]({SITE}/mentions-legales/)",
        f"- [CGV]({SITE}/cgv/)",
        f"- [CGU]({SITE}/cgu/)",
        f"- [Politique de confidentialité]({SITE}/confidentialite/)",
        f"- [Cookies]({SITE}/cookies/)",
        "",
        "## Optional",
        "",
        f"- [llms-full.txt]({SITE}/llms-full.txt): description plus détaillée (méthode, jeux, articles).",
        f"- [sitemap.xml]({SITE}/sitemap.xml)",
        "",
    ]
    return "\n".join(lines)


def llms_full_txt(seo: dict, posts: list[dict]) -> str:
    how = "\n".join(f"- {it['title']}: {it['text']}" for it in seo["howItems"])
    faq = "\n".join(f"Q: {it['q']}\nA: {it['a']}\n" for it in seo["faq"])
    arts = []
    for p in posts:
        arts.append(f"### {p['title']}\n{p['excerpt']}\nÀ retenir:\n" + "\n".join(f"- {t}" for t in p.get("takeaways") or []))
    return f"""# Hello Titou — fiche complète

## En français

{seo['lead']}

{seo['agesText']}

### Méthode
{how}

Pour jouer, un compte parent validé est nécessaire. Un accès anticipé gratuit est proposé aux bêta testeurs, sur demande et après validation. Une fois connecté, les progrès (étoiles, mots appris) sont synchronisés entre les appareils du compte. D'éventuels progrès déjà enregistrés sur l'appareil sont conservés et peuvent être repris après connexion. La voix des mots et des phrases est en anglais américain. Une consigne en français peut précéder les questions.

### Tarifs
{seo['priceText']}

### FAQ
{faq}

### Articles du blog
{chr(10).join(arts)}

## In English

Hello Titou is a web-based educational game for children aged 4–8. It helps them hear and learn English through short picture-and-sound games, with a mascot called Titou. Children do not need to read or type. There are three core modes (Discover, Find it, Memory) plus 21 extra mini-games with an age-based progression, and more than 300 themes. American English audio; a French prompt may precede a question. Play requires an approved parent account. Free early access is offered to beta testers on request, subject to approval. Once signed in, progress syncs across the parent's devices; any progress already stored on the device is kept and can be reused after sign-in. Two paid plans are planned but not yet purchasable: €19 per month (no commitment) or €399 lifetime.

Official site: {SITE}/
"""


def manifest(seo: dict) -> str:
    icon_base = seo["ogImage"].rsplit("/", 1)[0]
    data = {
        "name": "Hello Titou",
        "short_name": "Hello Titou",
        "description": seo["descriptionHome"],
        "start_url": "/",
        "scope": "/",
        "display": "standalone",
        "lang": "fr-FR",
        "background_color": "#080a12",
        "theme_color": "#080a12",
        "icons": [
            {"src": "/favicon.svg", "type": "image/svg+xml", "sizes": "any", "purpose": "any"},
            {"src": icon_base + "/icon-192.png", "type": "image/png", "sizes": "192x192"},
            {"src": icon_base + "/icon-512.png", "type": "image/png", "sizes": "512x512"},
        ],
    }
    return json.dumps(data, ensure_ascii=False, indent=2) + "\n"


def not_found_page(seo: dict) -> str:
    main = (
        '<article class="legal-doc">'
        "<h1>Page introuvable</h1>"
        "<p>Cette adresse n'existe pas, ou la page a été déplacée. Voici quelques chemins utiles&nbsp;:</p>"
        "<ul>"
        '<li><a href="/">Accueil — Hello Titou</a></li>'
        '<li><a href="/blog/">Blog</a></li>'
        '<li><a href="/abonnements/">Abonnements</a></li>'
        '<li><a href="/aide/">Parents / Aide</a></li>'
        '<li><a href="/contact/">Contactez-nous</a></li>'
        "</ul></article>"
    )
    # 404 should not be indexed as the canonical home
    html = page_shell(
        seo,
        title="Page introuvable — Hello Titou",
        description="Cette page n'existe pas sur Hello Titou. Retrouvez l'accueil, le blog ou le formulaire de contact.",
        canonical=SITE + "/",
        current="home",
        main_html=main,
        jsonld=org_graph(seo),
    )
    # 404: noindex, and do not canonically claim the homepage
    html = html.replace(
        '<meta name="robots" content="index,follow,max-image-preview:large" />',
        '<meta name="robots" content="noindex,follow" />',
    )
    html = html.replace('  <link rel="canonical" href="' + SITE + '/" />\n', "")
    html = html.replace('  <link rel="alternate" hreflang="fr-FR" href="' + SITE + '/" />\n', "")
    html = html.replace('  <link rel="alternate" hreflang="x-default" href="' + SITE + '/" />\n', "")
    html = html.replace('  <meta property="og:url" content="' + SITE + '/" />\n', "")
    return html



def early_access_form_js(sb_url: str, sb_key: str) -> str:
    return f"""
  var SB_URL = {json.dumps(sb_url)};
  var SB_KEY = {json.dumps(sb_key)};
  var form = document.getElementById("early-form");
  if (!form || !window.supabase) return;
  var sb = window.supabase.createClient(SB_URL, SB_KEY);
  var btn = document.getElementById("early-submit");
  var msgBox = document.getElementById("early-msg");
  var count = document.getElementById("early-count");
  var consent = document.getElementById("early-consent");
  function values() {{
    return {{
      firstName: (document.getElementById("early-first").value || "").trim(),
      email: (document.getElementById("early-email").value || "").trim(),
      children: (document.getElementById("early-children").value || "").trim(),
      message: (document.getElementById("early-message").value || "").trim(),
      company: (document.getElementById("early-company").value || "").trim(),
      consent: !!(consent && consent.checked)
    }};
  }}
  function ready() {{
    var v = values();
    return v.firstName.length >= 2 && /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v.email) && v.consent;
  }}
  function show(msg, kind) {{
    if (!msgBox) return;
    msgBox.hidden = !msg;
    msgBox.className = "auth-msg " + (kind || "");
    msgBox.textContent = msg || "";
  }}
  function sync() {{
    if (count) count.textContent = ((document.getElementById("early-message").value || "").length) + "/1000";
    if (btn) btn.disabled = !ready();
  }}
  ["early-first","early-email","early-children","early-message","early-company"].forEach(function (id) {{
    var el = document.getElementById(id);
    if (el) el.addEventListener("input", sync);
  }});
  if (consent) consent.addEventListener("change", sync);
  form.addEventListener("submit", async function (e) {{
    e.preventDefault();
    var v = values();
    if (v.company) {{
      show("Demande reçue, vous recevrez un email dès validation.", "ok");
      form.hidden = true;
      return;
    }}
    if (!ready()) {{
      show("Merci de renseigner votre prénom, un e-mail valide, et d'accepter la politique de confidentialité.", "err");
      return;
    }}
    btn.disabled = true;
    btn.textContent = "Envoi en cours…";
    try {{
      var res = await sb.from("early_access_requests").insert({{
        first_name: v.firstName,
        email: v.email,
        children_info: v.children || null,
        message: v.message || null,
        status: "pending"
      }});
      if (res.error) throw res.error;
      show("Demande reçue, vous recevrez un email dès validation.", "ok");
      form.hidden = true;
    }} catch (err) {{
      var raw = (err && (err.message || err.code)) ? String(err.message || err.code) : "";
      if (/duplicate|unique|23505/i.test(raw)) {{
        show("Une demande est déjà enregistrée pour cet e-mail. Vous recevrez un e-mail dès validation.", "err");
      }} else {{
        show("La demande n'a pas pu être envoyée. Vérifiez votre connexion et réessayez.", "err");
      }}
      btn.disabled = false;
      btn.textContent = "Envoyer la demande";
    }}
  }});
  sync();
"""


def early_access_html() -> str:
    def field(fid, label, typ, placeholder, required, autocomplete, extra=""):
        req = ' <span class="req">*</span>' if required else ""
        req_attr = " required" if required else ""
        return (
            f'<div><label class="contact-field-label" for="{fid}">{label}{req}</label>'
            f'<input class="field" id="{fid}" name="{fid}" type="{typ}"{req_attr} '
            f'placeholder="{placeholder}" autocomplete="{autocomplete}" {extra}/></div>'
        )
    form = (
        '<div class="contact-form-card"><h2>Demander un accès anticipé</h2>'
        '<p class="contact-form-hint">Cet accès anticipé gratuit est destiné aux <strong>bêta testeurs</strong>. '
        "Chaque demande est examinée avant validation. Les champs marqués d'un <span class=\"req\">*</span> sont obligatoires.</p>"
        '<p class="auth-msg" id="early-msg" hidden></p>'
        '<form id="early-form" class="contact-form" novalidate>'
        + field("early-first", "Prénom", "text", "Votre prénom", True, "given-name", 'maxlength="80"')
        + field("early-email", "Adresse e-mail", "email", "votre@email.com", True, "email", 'maxlength="254"')
        + field("early-children", "Nombre et âges des enfants (facultatif)", "text", "Par exemple : 2 enfants, 5 et 6 ans", False, "off", 'maxlength="400"')
        + '<div><div class="contact-msg-head"><label class="contact-field-label" for="early-message">'
        "Message (facultatif)</label>"
        + '<span class="contact-count" id="early-count">0/1000</span></div>'
        + '<textarea class="field" id="early-message" name="early-message" rows="5" maxlength="1000" '
        'placeholder="Une courte précision, si vous le souhaitez…"></textarea></div>'
        + '<label class="contact-consent"><input type="checkbox" id="early-consent" name="early-consent" />'
        "<span>J'accepte que mes informations soient utilisées pour traiter cette demande, conformément à la "
        '<a href="/confidentialite/">politique de confidentialité</a>.</span></label>'
        + '<input class="contact-hp" id="early-company" name="company" type="text" tabindex="-1" autocomplete="off" aria-hidden="true" value="" />'
        + '<button type="submit" class="contact-submit" id="early-submit" disabled>Envoyer la demande</button>'
        + "</form></div>"
    )
    aside = (
        '<aside class="contact-aside">'
        '<div class="contact-info"><div class="hd"><h2>Pour qui ?</h2></div>'
        "<p>Aux parents qui souhaitent tester Hello Titou avec leurs enfants, en tant que bêta testeurs, avant l'ouverture des abonnements.</p></div>"
        '<div class="contact-info"><div class="hd"><h2>Comment ça se passe ?</h2></div>'
        "<p>Vous déposez une demande. Après validation, vous recevez un e-mail pour activer votre compte parent.</p></div>"
        '<div class="contact-info"><div class="hd"><h2>Abonnements</h2></div>'
        "<p>Deux formules arriveront bientôt : 19 € par mois, ou 399 € à vie. Les paiements ne sont pas encore ouverts.</p></div>"
        "</aside>"
    )
    return (
        '<div class="contact-page">'
        '<section class="contact-hero"><div class="glow" aria-hidden="true"></div>'
        "<h1>Accès anticipé <span class=\"em\">gratuit.</span></h1>"
        "<p>Hello Titou s'ouvre progressivement aux bêta testeurs. Déposez une demande : nous l'examinons, puis nous vous écrivons dès validation.</p>"
        "</section>"
        '<nav class="contact-crumb" aria-label="Fil d\'Ariane">'
        '<a href="/">Accueil</a><span aria-hidden="true">›</span>'
        '<span class="here">Accès anticipé gratuit</span></nav>'
        '<div class="contact-layout">' + form + aside + "</div></div>"
    )


def extract_sb(index_html: str) -> tuple[str, str]:
    url = re.search(r'const SB_URL = "([^"]+)"', index_html)
    key = re.search(r'const SB_KEY = "([^"]+)"', index_html)
    if not url or not key:
        raise SystemExit("Could not find SB_URL / SB_KEY")
    return url.group(1), key.group(1)


def fill_index(seo: dict) -> None:
    """Inject home meta/JSON-LD and prerendered start page into index.html markers."""
    text = (ROOT / "index.html").read_text(encoding="utf-8")
    graph = org_graph(seo) + [faq_jsonld(seo), {
        "@type": "WebPage",
        "@id": SITE + "/#webpage",
        "url": SITE + "/",
        "name": seo["titleHome"],
        "description": seo["descriptionHome"],
        "inLanguage": "fr-FR",
        "isPartOf": {"@id": SITE + "/#website"},
        "about": {"@id": SITE + "/#app"},
    }]
    head = head_tags(
        seo,
        title=seo["titleHome"],
        description=seo["descriptionHome"],
        canonical=SITE + "/",
        og_type="website",
        image=seo["ogImage"],
        image_alt=seo.get("ogImageAlt"),
        jsonld=graph,
    )
    block = "  <!-- SEO:HEAD:START -->\n" + head + "\n  <!-- SEO:HEAD:END -->"
    m = re.search(r"  <!-- SEO:HEAD:START -->.*?  <!-- SEO:HEAD:END -->", text, re.S)
    if not m:
        print("WARN: SEO head markers missing in index.html; skipped head fill.")
    else:
        text = text[:m.start()] + block + text[m.end():]
        text = text.replace("  <title>Hello Titou</title>\n", "", 1)
    prerender = home_prerender(seo)
    pblock = "  <!-- SEO:PRERENDER:START -->\n" + prerender + "\n  <!-- SEO:PRERENDER:END -->"
    m = re.search(r"  <!-- SEO:PRERENDER:START -->.*?  <!-- SEO:PRERENDER:END -->", text, re.S)
    if not m:
        print("WARN: prerender markers missing in index.html; skipped prerender fill.")
    else:
        text = text[:m.start()] + pblock + text[m.end():]
    (ROOT / "index.html").write_text(text, encoding="utf-8")
    print("  updated index.html SEO head + prerender")


def build() -> None:
    index_html = (ROOT / "index.html").read_text(encoding="utf-8")
    seo = load_seo()
    posts = load_blog()
    legal = extract_legal_html(index_html)
    sb_url, sb_key = extract_sb(index_html)

    css = extract_css(index_html)
    write(ROOT / "assets" / "site.css", css)

    # Blog listing
    listing = (
        '<div class="blog-page"><div class="blog-hero"><div class="glow" aria-hidden="true"></div>'
        '<h1>Grandir avec <span class="em">l\'anglais.</span></h1>'
        "<p>Des articles pour les parents qui veulent accompagner leur enfant, de 4 à 8 ans, sans pression et avec le jeu.</p></div>"
        '<div class="blog-grid-v">'
        + "".join(blog_card(p) for p in posts)
        + "</div></div>"
    )
    blog_meta = seo["pageMeta"]["blog"]
    write(ROOT / "blog" / "index.html", page_shell(
        seo,
        title=blog_meta["title"],
        description=blog_meta["description"],
        canonical=SITE + "/blog/",
        current="blog",
        main_html=listing,
        jsonld=org_graph(seo) + [breadcrumb_jsonld([("/", "Accueil"), ("/blog/", "Blog")])],
    ))
    for post in posts:
        write(ROOT / "blog" / post["slug"] / "index.html", article_page(seo, post, posts))

    # Contact
    contact_meta = seo["pageMeta"]["contact"]
    extra = (
        '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.1/dist/umd/supabase.js" defer></script>\n'
        "<script defer>\nwindow.addEventListener('DOMContentLoaded', function () {\n"
        + contact_form_js(sb_url, sb_key)
        + "});\n</script>\n"
    )
    write(ROOT / "contact" / "index.html", page_shell(
        seo,
        title=contact_meta["title"],
        description=contact_meta["description"],
        canonical=SITE + "/contact/",
        current="contact",
        main_html=contact_html(),
        jsonld=org_graph(seo) + [breadcrumb_jsonld([("/", "Accueil"), ("/contact/", "Contact")])],
        extra_js=extra,
    ))

    # Accès anticipé
    early_meta = seo["pageMeta"]["acces-anticipe"]
    early_js = (
        '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.1/dist/umd/supabase.js" defer></script>\n'
        "<script defer>\nwindow.addEventListener('DOMContentLoaded', function () {\n"
        + early_access_form_js(sb_url, sb_key)
        + "});\n</script>\n"
    )
    write(ROOT / "acces-anticipe" / "index.html", page_shell(
        seo,
        title=early_meta["title"],
        description=early_meta["description"],
        canonical=SITE + "/acces-anticipe/",
        current="home",
        main_html=early_access_html(),
        jsonld=org_graph(seo) + [breadcrumb_jsonld([("/", "Accueil"), ("/acces-anticipe/", "Accès anticipé gratuit")])],
        extra_js=early_js,
    ))

    # Abonnements
    abo = seo["pageMeta"]["abonnements"]
    write(ROOT / "abonnements" / "index.html", page_shell(
        seo,
        title=abo["title"],
        description=abo["description"],
        canonical=SITE + "/abonnements/",
        current="abonnements",
        main_html=plans_html(seo),
        jsonld=org_graph(seo) + [faq_jsonld(seo), breadcrumb_jsonld([("/", "Accueil"), ("/abonnements/", "Abonnements")])],
    ))

    # Aide
    aide = seo["pageMeta"]["aide"]
    write(ROOT / "aide" / "index.html", page_shell(
        seo,
        title=aide["title"],
        description=aide["description"],
        canonical=SITE + "/aide/",
        current="aide",
        main_html=extract_aide_html(index_html),
        jsonld=org_graph(seo) + [breadcrumb_jsonld([("/", "Accueil"), ("/aide/", "Parents / Aide")])],
    ))

    legal_map = {
        "mentions-legales": ("mentions", "Mentions légales"),
        "cgv": ("cgv", "Conditions générales de vente"),
        "cgu": ("cgu", "Conditions générales d'utilisation"),
        "confidentialite": ("confidentialite", "Politique de confidentialité"),
        "cookies": ("cookies", "Cookies"),
    }
    for slug, (lid, crumb_name) in legal_map.items():
        meta = seo["pageMeta"][slug]
        body = '<article class="legal-doc">' + legal[lid] + "</article>"
        write(ROOT / slug / "index.html", page_shell(
            seo,
            title=meta["title"],
            description=meta["description"],
            canonical=SITE + f"/{slug}/",
            current="home" if slug != "contact" else "contact",
            main_html=body,
            jsonld=org_graph(seo) + [breadcrumb_jsonld([("/", "Accueil"), (f"/{slug}/", crumb_name)])],
        ))

    write(ROOT / "mentions" / "index.html", redirect_page(SITE + "/mentions-legales/", "Mentions légales — Hello Titou"))
    write(ROOT / "parents" / "index.html", redirect_page(SITE + "/aide/", "Parents / Aide — Hello Titou"))

    # Sitemap (canonical URLs only)
    urls = [
        (SITE + "/", TODAY, "1.0"),
        (SITE + "/blog/", TODAY, "0.8"),
    ]
    for p in posts:
        urls.append((SITE + f"/blog/{p['slug']}/", p.get("date") or TODAY, "0.7"))
    for path, pri in [
        ("/abonnements/", "0.7"),
        ("/aide/", "0.6"),
        ("/contact/", "0.6"),
        ("/acces-anticipe/", "0.7"),
        ("/mentions-legales/", "0.3"),
        ("/cgv/", "0.3"),
        ("/cgu/", "0.3"),
        ("/confidentialite/", "0.3"),
        ("/cookies/", "0.3"),
    ]:
        urls.append((SITE + path, TODAY, pri))
    write(ROOT / "sitemap.xml", sitemap_xml(urls))
    write(ROOT / "robots.txt", robots_txt())
    write(ROOT / "llms.txt", llms_txt(seo, posts))
    write(ROOT / "llms-full.txt", llms_full_txt(seo, posts))
    write(ROOT / "site.webmanifest", manifest(seo))
    write(ROOT / "404.html", not_found_page(seo))

    fill_index(seo)
    print("OK: static SEO pages generated.")
    return seo, posts


if __name__ == "__main__":
    build()
