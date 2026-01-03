# pixan WA - Portal de Administración

Portal de administración para el bot de WhatsApp con Claude y múltiples modelos de IA.

## 🚀 Características

- ✅ **Dashboard en tiempo real** con estadísticas de mensajes y usuarios
- ✅ **Monitor de balances** (AI Gateway, Twilio, Gemini)
- ✅ **Visor de logs** en tiempo real con auto-refresh
- ✅ **Editor de System Prompt** para personalizar respuestas
- ✅ **11 modelos de IA** disponibles (Claude, Gemini, Llama, etc.)

## 📋 Requisitos

- Cuenta en [Vercel](https://vercel.com)
- Cuenta en [Twilio](https://www.twilio.com) con WhatsApp configurado
- API Keys:
  - Anthropic (Claude)
  - Google AI (Gemini)
  - Cloudflare AI Gateway (opcional)

## 🛠️ Instalación

### 1. Deploy en Vercel

El proyecto está optimizado para Vercel. Sigue estos pasos:

```bash
# 1. Conecta el repositorio en Vercel
# Ve a: https://vercel.com/new

# 2. Importa este repositorio: aaprosperi/pixan-wa

# 3. Configura las variables de entorno (ver .env.example)

# 4. Deploy!
```

### 2. Variables de Entorno

Crea las siguientes variables en Vercel:

```env
# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Anthropic (Claude)
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# Google AI (Gemini)
GEMINI_API_KEY=xxxxxxxxxxxxx

# Cloudflare AI Gateway (opcional)
CLOUDFLARE_ACCOUNT_ID=xxxxxxxxxxxxx
CLOUDFLARE_GATEWAY_ID=xxxxxxxxxxxxx

# Vercel KV (se crea automáticamente)
# KV_REST_API_URL
# KV_REST_API_TOKEN
```

### 3. Configurar Vercel KV

1. En tu proyecto de Vercel, ve a **Storage**
2. Click en **Create Database**
3. Selecciona **KV** (Redis)
4. Dale un nombre: `pixan-wa-kv`
5. Las variables de entorno se agregarán automáticamente

### 4. Configurar Dominio

En Vercel Settings → Domains:

```
pixan.ai/WA → apunta a este proyecto
```

## 🎯 Uso

### Dashboard Principal

Accede a: `https://pixan.ai/WA`

El dashboard muestra:

1. **Balances** (arriba derecha):
   - AI Gateway balance
   - Twilio balance
   - Gemini quota usage

2. **Estadísticas**:
   - Total de mensajes
   - Usuarios activos
   - Modelos disponibles

3. **System Prompt Editor**:
   - Edita las instrucciones base para Claude
   - Los cambios se aplican inmediatamente
   - Afecta a todos los modelos

4. **Logs en Tiempo Real**:
   - Ve todos los mensajes procesados
   - Auto-refresh cada 5 segundos
   - Descarga logs en JSON
   - Limpia logs antiguos

## 📱 Comandos de WhatsApp

Los usuarios pueden usar estos comandos:

```
/help - Ver ayuda y modelos disponibles
/modelos - Lista de modelos disponibles
/modelo <nombre> - Cambiar modelo (ej: /modelo claude)
/reset - Reiniciar conversación
```

### Modelos Disponibles

**GRATIS (Gemini):**
- `gemini` - Gemini 3 Flash Preview (default)
- `gemini-pro` - Gemini 3 Pro Preview
- `gemini2` - Gemini 2.0 Flash

**Via AI Gateway:**
- `claude` - Claude Sonnet 4.5
- `opus` - Claude Opus 4
- `haiku` - Claude Haiku 3.5
- `llama` - Llama 3.3 70B
- `deepseek` - DeepSeek R1
- `grok` - Grok Beta
- `o1` - OpenAI o1-preview
- `o1-mini` - OpenAI o1-mini

## 🔧 Estructura del Proyecto

```
pixan-wa/
├── app/
│   ├── api/                    # API Routes
│   │   ├── balances/          # Monitor de balances
│   │   ├── logs/              # Logs del sistema
│   │   ├── stats/             # Estadísticas
│   │   ├── system-prompt/     # Editor de prompts
│   │   └── webhook/           # Webhook de Twilio
│   ├── layout.tsx             # Layout principal
│   └── page.tsx               # Dashboard
├── components/
│   ├── BalanceStatus.tsx      # Componente de balances
│   ├── LogsViewer.tsx         # Visor de logs
│   └── SystemPromptEditor.tsx # Editor de prompts
└── next.config.js             # Configuración Next.js
```

## 🚧 Próximos Pasos

- [ ] Migrar webhook de Twilio a este proyecto
- [ ] Agregar autenticación al dashboard
- [ ] Implementar métricas avanzadas
- [ ] Agregar generación de imágenes (Flux)
- [ ] Sistema de notificaciones

## 📝 Notas

- Los logs se almacenan en Vercel KV (Redis)
- La memoria de conversaciones dura 12 meses
- El sistema usa una estrategia híbrida (Gemini gratis + AI Gateway)
- Ahorro estimado: ~$84/año vs usar solo Claude

## 🆘 Soporte

Si algo no funciona:

1. Verifica las variables de entorno en Vercel
2. Revisa los logs en Vercel Dashboard
3. Asegúrate de que Vercel KV esté configurado
4. Verifica que Twilio Sandbox esté activo

---

Hecho con ❤️ por pixan.ai
