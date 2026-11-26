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
PrimeTvNashville ("PrimeTV") is a TV mounting and home installation company in Nashville, TN. We text customers who opted in on our online booking form: a reminder the day before their appointment with the arrival time and, after the job is completed, a request to leave a review on Google. When a customer replies, our team answers their questions about the booking (customer care). Every outgoing message is written or reviewed and sent manually by a team member. We send no marketing, promotions or bulk messages.
```

**Primary opt-in method:** website / online form

**Message flow**

```
Customers find PrimeTvNashville through Google search, our Facebook and Instagram pages, and word of mouth. They go to our website, https://www.primetvnashville.com, where the "Book installation" buttons lead to the online booking form at https://www.primetvnashville.com/book. On that form the customer enters their appointment details and name. On the last step the customer enters their own number in the "Mobile phone" field and, on that same step, sees an optional, unchecked checkbox, not required to book, that gives consent for that number and reads: "Optional: Yes, PrimeTV may text me appointment reminders and, after my job, a request for a review. Message frequency varies. Msg & data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of booking. SMS Terms & Privacy Policy." The links go to https://www.primetvnashville.com/sms-terms and https://www.primetvnashville.com/privacy-policy. A copy of the phone field and checkbox is displayed on the /book page below the form. Customers who leave the box unchecked can still book and receive no text messages. We store the exact text agreed to, the date and time, IP address and browser. We never use purchased or third-party lists. Customers who reply STOP receive no further messages.
```

**Opt-in method proof**

```
Live public web form: https://www.primetvnashville.com/book
The required "Mobile phone" field and the optional, unchecked SMS checkbox are on the same final step of the form. The checkbox is not required to submit it. Consent is recorded for the number entered there. That step appears after the earlier steps are filled in, so the same page also shows a copy of the phone field and checkbox, below the form, under "Optional text messages".
```

**Privacy policy URL**

```
https://www.primetvnashville.com/privacy-policy
```

**Terms and conditions URL**

```
https://www.primetvnashville.com/terms
```

**Sample messages**

```
PrimeTV: Hi [First Name], reminder that we'll be at your home tomorrow, [Date], between [Arrival Window] for your [Service]. Reply here with any questions. Reply STOP to opt out.
```

```
PrimeTV: Hi [First Name], thanks for choosing us for your [Service]. If you have a minute, we'd be grateful for a quick Google review: https://g.page/r/CblSDOdhtcueEBI/review Reply STOP to opt out.
```

```
PrimeTV: Hi [First Name], thanks for your message. Your installation is booked for [Date], between [Arrival Window]. Reply here with any questions. Reply STOP to opt out.
```

```
PrimeTV: Hi [First Name], thanks for your message. We can move your [Service] to [Date], between [Arrival Window]. Please reply to confirm. Reply STOP to opt out.
```

**Opt-in / opt-out / help**

| Campo | Valor |
|---|---|
| Opt-in keywords | `START, UNSTOP` (sin `YES`: un cliente que responde "yes" para confirmar una cita recibiría el mensaje de suscripción) |
| Opt-in message | `PrimeTV: Thanks! You'll get appointment reminders and a review request after your job from PrimeTV. Msg frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to opt out.` |
| Opt-out keywords | `STOP, STOPALL, UNSUBSCRIBE, CANCEL, END, QUIT, OPTOUT, REVOKE` |
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
2. **Integration → Inbound messages: "Send a webhook".** Request URL
   `https://www.primetvnashville.com/api/sms/inbound`, método **HTTP POST**.
   Los textos de los clientes llegan a **Admin → Inbox → Messages** y a un
   correo para la oficina. La URL debe ser exactamente esa (con `www`): la
   firma de Twilio se comprueba contra ella. Ya no se usa el CRM para esto.
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

## 5. Reservas creadas por la oficina

Twilio llama `message_flow` al campo donde se explica cómo el cliente acepta
los SMS. Antes de usar el enlace por correo para envíos en vivo, verifica el
estado del registro en **Trust Hub → Registration → A2P Campaigns**.

- Si es un borrador editable o Twilio permite corregirlo tras un rechazo,
  conserva la descripción del formulario público y añade la del enlace por correo.
- Si está en revisión, espera el resultado. Si aparece como **Verified**, Twilio
  exige una campaña nueva para cambiar ese campo. Confirma con soporte el costo
  y cómo migrar el número antes de retirar el registro vigente.

[Estados y cambios de campaña en Twilio](https://www.twilio.com/docs/messaging/compliance/a2p-10dlc/troubleshooting-a2p-brands/troubleshooting-and-rectifying-a2p-campaigns)

```
When PrimeTV staff book an appointment for a customer and the customer asks to opt in by email, the booking confirmation email includes a private link to the optional SMS reminder form. The customer opens the link, enters the US mobile number they gave us for the booking, and checks an unchecked checkbox before selecting “Sign up for text reminders.” The form links to the SMS Terms and Privacy Policy. It offers appointment reminders only. The booking is complete regardless of the customer's choice. We store the phone number, booking reference, exact disclosure, timestamp, IP address and browser. A prior STOP stays in effect until the customer replies START.
```

Adjunta capturas de un correo de prueba y del formulario `/sms-opt-in`, sin
datos de clientes ni enlaces privados. Consulta los requisitos de confirmación
de alta al presentar el flujo. En la aplicación, el cliente ve la confirmación
en pantalla y la oficina envía los recordatorios manualmente.

### Si el cliente da permiso durante la llamada

Twilio admite el permiso verbal explícito para recordatorios de citas. El
equipo confirma el número móvil y pregunta por separado si el cliente quiere
recibir recordatorios. La reserva se completa aunque el cliente diga que no.

Guion para la llamada, después de confirmar el número.

```
Would you like PrimeTV to send appointment reminders by text to the mobile number you just confirmed? Text reminders are optional. Message frequency varies, and message and data rates may apply. Reply HELP for help or STOP to opt out. You can find our SMS Terms and Privacy Policy at primetvnashville.com/sms-terms and primetvnashville.com/privacy-policy. Is that a yes or a no?
```

Para registrar este método en Twilio, incluye el guion exacto, cómo se
conserva la prueba del sí del cliente y cómo se confirma el alta. El registro
debe permitir identificar el número, la cita, la fecha y hora, quién atendió
y la evidencia de la respuesta. Describe el proceso que usa PrimeTV en
realidad. El permiso verbal para recordatorios no cubre publicidad ni
reactiva un número que dio de baja los mensajes.

En **Admin → Bookings → New booking**, elige **Customer said yes on the call**
después de escuchar la respuesta afirmativa del cliente. Al guardar la
reserva, el panel registra la cita, el número, la fecha y hora, quién anotó el
permiso y la versión del guion. Selecciona **Customer declined** si rechaza
los SMS.
Define `SMS_PHONE_CONSENT_LIVE=true` en producción solo después de que el
registro de Twilio cubra el método telefónico y el equipo tenga listo el
proceso de confirmación de alta que declaró en la campaña.

[Guía de registro de Twilio](https://help.twilio.com/articles/11847054539547-A2P-10DLC-Campaign-Approval-Best-Practices)
