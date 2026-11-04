# Registro A2P 10DLC — PrimeTV (Sole Proprietor)

Texto listo para pegar en Twilio (Console → Messaging → Regulatory Compliance).
Los valores van en **inglés**, tal cual. Lo que está entre `[corchetes]` lo
completa la persona que registra.

> **Cuándo enviarlo:** después de publicar la casilla de SMS en
> https://www.primetvnashville.com/book, la página
> https://www.primetvnashville.com/sms-terms y la sección 5 de la política de
> privacidad. Los revisores abren esas páginas; si no muestran lo que dice la
> campaña, la rechazan.

---

**Numero de envio (Twilio):** (615) 395-6565. El (615) 669-0251 es solo el numero
para llamar y pedir ayuda.

## 1. Marca (Sole Proprietor Brand)

| Campo | Valor |
|---|---|
| First name / Last name | `[nombre y apellido de la persona de PrimeTV en Nashville]` |
| Email | `[email de esa persona — puede ser info@primetvnashville.com]` |
| Mobile phone | `[celular de esa persona — Twilio le envía un código para verificar]` |
| Street, City, State, ZIP | `[dirección real en Nashville, TN]` |
| Country | `US` |
| Brand name (DBA) | `PrimeTvNashville` |
| Vertical | `Professional Services` (o `Home Services` si aparece) |
| Website | `https://www.primetvnashville.com` |

Notas:
- **La cuenta de Twilio no puede estar en Trial:** las cuentas de prueba no pueden
  registrar A2P. Hay que hacer "Upgrade" antes.
- El celular para el código (OTP) debe ser de EE. UU. o Canadá y **no puede ser un
  número de Twilio** ni de otro proveedor similar. El código se responde en 24 horas.
- Sole Proprietor no lleva EIN. En enero, con la LLC y el EIN, se crea una
  marca **Standard** y se vuelve a registrar la campaña con el mismo número.
- El nombre que ven los clientes en los textos está en
  `src/app/lib/smsConfig.js` (`SMS_BRAND = "PrimeTV"`): es el único lugar que
  cambia con la marca nueva.

---

## 2. Campaña (Sole Proprietor Campaign)

**Campaign description**

```
PrimeTvNashville ("PrimeTV") is a TV mounting and home installation company in Nashville, TN. This number is used for two things with our own customers: (1) customer care — answering texts customers send us about quotes, bookings and their installation; and (2) appointment messages sent one at a time by our staff: a reminder the day before the customer's appointment with the arrival time, and, after the job is completed, a request to leave a review on Google. Every outgoing message is written or reviewed and sent manually by a team member; we send no marketing, promotions or bulk messages.
```

**Message flow / Call to action (how customers opt in)**

```
Customers opt in in one of two ways.
1) Online booking form at https://www.primetvnashville.com/book: an optional, unchecked checkbox, not required to book, that reads: "Optional: Yes, PrimeTV may text me appointment reminders and, after my job, a request for a review. Message frequency varies. Msg & data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of booking. SMS Terms & Privacy Policy." The links go to https://www.primetvnashville.com/sms-terms and https://www.primetvnashville.com/privacy-policy. We store the exact text agreed to, the date and time, IP address and browser.
2) Customers who text our number first: we answer their questions (customer care). Before sending any appointment reminder or review request, our staff sends this message: "PrimeTV: Hi [First Name], would you like text reminders for your appointment and, after your job, a request for a review? Msg frequency varies. Msg & data rates may apply. Reply YES to agree, STOP to opt out, HELP for help." and records the customer's YES with its date and time.
Customers who reply STOP receive no further messages.
```

**Privacy policy URL**

```
https://www.primetvnashville.com/privacy-policy
```

**Terms and conditions URL** (Twilio exige una pagina titulada "Terms & Conditions" con seccion de SMS)

```
https://www.primetvnashville.com/terms
```

**Sample messages** (pega los tres)

```
PrimeTV: Hi Mike, reminder that we'll be at your home tomorrow, Nov 5, between 2-2:30 PM for your TV mounting. Reply here with any questions. Reply STOP to opt out.
```

```
PrimeTV: Hi Mike, thanks for choosing us for your TV mounting. If you have a minute, we'd be grateful for a quick Google review: https://g.page/r/CblSDOdhtcueEBI/review Reply STOP to opt out.
```

```
PrimeTV: Hi Sarah, thanks for your message. Your installation is booked for Thursday, Nov 12, between 10-10:30 AM. Reply here with any questions. Reply STOP to opt out.
```

**Opt-in / opt-out / help**

| Campo | Valor |
|---|---|
| Opt-in keywords | `YES, START` |
| Opt-in message | `PrimeTV: Thanks! You'll get appointment reminders and a review request after your job from PrimeTV. Msg frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to opt out.` |
| Opt-out keywords | `STOP, STOPALL, UNSUBSCRIBE, CANCEL, END, QUIT` |
| Opt-out message | `PrimeTV: You're unsubscribed and will no longer receive texts from us. Reply START to resubscribe.` |
| Help keywords | `HELP, INFO` |
| Help message | `PrimeTV: For help, call (615) 669-0251 or email info@primetvnashville.com. Msg & data rates may apply. Reply STOP to opt out.` |
| Embedded links | `Yes` (solo el enlace de review de Google) |
| Embedded phone numbers | `Yes` (nuestro número de contacto) |
| Age-gated content | `No` |
| Direct lending / loans | `No` |

---

## 3. En Twilio, al crear el Messaging Service

1. **Advanced Opt-Out: activado.** Pega ahí el opt-out, opt-in y help de la
   tabla de arriba: Twilio responde STOP/START/HELP por nosotros.
2. **Incoming messages: "Defer to sender's webhook".** El número ya tiene el
   webhook del CRM; con esta opción lo sigue recibiendo. Si eliges otra, el
   CRM deja de recibir los textos.
3. Agrega el número (615) al servicio y asocia la campaña cuando se apruebe.
4. En Vercel (Settings → Environment Variables), pon tú:
   `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_MESSAGING_SERVICE_SID`.
5. **No pongas `SMS_MODE=live` hasta que la campaña esté aprobada.** Sin esa
   variable, la app solo registra lo que enviaría (modo de prueba).

---

## 4. Por qué los textos son así

- Empiezan con `PrimeTV:` y terminan con `Reply STOP to opt out.` — la app los
  vuelve a poner si alguien los borra al editar.
- La hora va con guion normal (`2-2:30 PM`), no con raya (`2–2:30`): una raya
  convierte el texto en Unicode, que se corta a 70 caracteres y cuesta ~50% más.
- La review se pide igual a todos los clientes, sin filtrar por satisfechos y
  sin premios: Google y la FTC lo prohíben.
