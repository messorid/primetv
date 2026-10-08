# Notas SEO — primetvnashville.com

**Fecha:** 8 de octubre de 2026
**Fuente:** capturas de Semrush (Site Audit del 3 de oct., Dashboard, Position Tracking), verificadas contra el sitio en vivo.

---

## Resumen

| Métrica | Valor | Lectura |
|---|---|---|
| Authority Score | **6** | Muy bajo |
| Dominios de referencia | 321 | Muchos, pero no pesan |
| Tráfico orgánico estimado | 2 visitas/mes | Prácticamente nulo |
| Keywords orgánicas | 95 | Casi todas fuera de la primera página |
| Keywords en Top 10 | **0** | Ninguna |
| Site Health | 94 % | Bueno |
| Errores / Avisos | 9 / 118 (+60) | Ver abajo |

---

## Por qué la autoridad es tan baja

El Authority Score de Semrush combina tres cosas: **la calidad y cantidad de los enlaces** que recibes, **el tráfico orgánico** del sitio, y **señales de spam** en el perfil de enlaces.

**La pista principal es la contradicción entre 321 dominios y un score de 6.** Con 321 dominios de referencia de calidad normal, el score estaría bastante más alto. Que esté en 6 indica que **esos enlaces casi no cuentan**: lo típico es que sean directorios automáticos, páginas generadas, sitios de baja calidad, o enlaces que Semrush clasifica como spam. Importa la calidad, no la cantidad.

**El tráfico también lo hunde.** Unas 2 visitas orgánicas al mes es el piso. Semrush usa el tráfico como señal de que un sitio es real y relevante; sin tráfico, el score no sube aunque haya enlaces.

**Y no hay ninguna keyword en el Top 10.** "nashville tv mounting" está en la posición 13 (cerca, la más prometedora). "tv mounting near me" en la 41. "tv mounting service nashville" **cayó 49 posiciones**, hasta la 68, en los últimos 30 días.

> No puedo ver la lista de enlaces desde aquí. Para confirmar la causa: en Semrush abre **Backlink Audit** (puntuación de toxicidad) y **Referring Domains** ordenado por Authority Score. Si la mayoría de los 321 tienen AS 0–5, esa es la explicación.

### Qué la sube de verdad

1. **Enlaces locales de calidad, no volumen.** Unos pocos de fuentes reales valen más que cientos de directorios:
   - Google Business Profile completo, con fotos y reseñas constantes
   - Cámara de Comercio de Nashville, BBB, Nextdoor
   - Angi, Thumbtack, HomeAdvisor, Yelp
   - Tiendas y proveedores con quienes trabajas, constructoras o diseñadores de interiores que te recomienden
   - Prensa o blogs locales de Nashville
2. **Reseñas.** Afectan el ranking local más que casi cualquier otra cosa.
3. **Tráfico real.** Las páginas nuevas de marcas, tamaños y ventiladores ayudan a largo plazo, pero tardan meses en posicionar.
4. **Revisar los enlaces tóxicos** en Backlink Audit. Si hay muchos claramente spam, valorar un *disavow* con Google.

---

## Problemas que vi en las capturas

### 1. Datos estructurados inválidos en 9 páginas de ciudad — **Error**

Semrush marca "LocalBusiness, 1 field" en Brentwood, Franklin, Gallatin, Hendersonville, Mount Juliet, Murfreesboro, Nolensville y otras.

**Causa verificada:** el bloque `provider` de esas páginas declara la empresa como `HomeAndConstructionBusiness` (un tipo de LocalBusiness) pero **no incluye `address`**, que Google exige para ese tipo.

Además, cada página de ciudad tiene **dos bloques `FAQPage`** (uno de la sección de ciudad y otro de las FAQ generales). Google espera uno por página.

**Arreglo:** añadir la dirección al `provider` en las páginas de ciudad (ya está hecho así en las páginas nuevas de marcas y tamaños) y unir las FAQ en un solo bloque.

### 2. El dominio sin www redirige con 307 (temporal)

`primetvnashville.com` → `www.primetvnashville.com` responde **307 Temporary Redirect**. Debería ser **308 o 301 Permanent**. Con una redirección temporal, Google puede tardar en consolidar las señales del dominio sin www hacia el www.

**Arreglo (en Vercel, no en el código):** Project → Settings → Domains → `primetvnashville.com` → *Redirect to* `www.primetvnashville.com` → elegir **308 Permanent Redirect**.

### 3. `/llms.txt` devuelve 404

Es un archivo que algunos rastreadores de IA buscan para entender el sitio. Semrush lo marca como enlace roto. Es barato añadirlo y ayuda a la "AI Visibility" (hoy en 14, con 2 menciones: ChatGPT 1, Gemini 1).

### 4. Títulos demasiado largos en gazebos y playsets

Ejemplo: *"Hampton Bay Holden 10' × 10' Hardtop Gazebo Installation Nashville TN | PrimeTvNashville"* tiene **88 caracteres**. Google corta a ~60. Probablemente es buena parte de los 118 avisos.

### 5. Los avisos subieron +60

Coincide con la publicación de las páginas nuevas (marcas, tamaños, ventiladores). No puedo ver el desglose desde las capturas; revisar la pestaña **Issues** para ver qué tipo de aviso creció.

---

## Lo que **no** es un problema

En la pestaña *Crawled Pages* los títulos aparecen cruzados (un gazebo con título "75-Inch TV Mounting", la home como "Samsung TV Mounting"). **Lo verifiqué en vivo y todos los títulos son correctos.** Es un fallo de visualización de Semrush al ordenar por la columna de código de estado.

Las URLs `/book?service=...` aparecen como páginas rastreadas, pero tienen canonical a `/book`, así que no cuentan como contenido duplicado.

---

## Prioridad sugerida

1. Redirección 308 en Vercel — 2 minutos, sin código.
2. `address` en el schema de las ciudades + una sola FAQPage — arregla los 9 errores.
3. Revisar Backlink Audit — explica el score de 6.
4. Google Business Profile y reseñas — lo que más mueve el ranking local.
5. Acortar títulos de gazebos y playsets, y añadir `/llms.txt`.
