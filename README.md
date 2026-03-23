# GYULYIA SHADERS — Deploy Guide

## Estrutura do projeto

```
gyulyia-project/
├── index.html              ← App completo (frontend)
├── vercel.json             ← Configuração do Vercel
├── api/
│   └── generate-shader.js  ← Proxy seguro para a API da Anthropic
└── README.md
```

---

## Deploy no Vercel (passo a passo)

### 1. Criar conta no Vercel
Acesse https://vercel.com e crie uma conta gratuita (pode usar login do GitHub/Google).

### 2. Instalar a Vercel CLI (opcional, mas mais fácil)
```bash
npm install -g vercel
```

### 3. Fazer o deploy
**Opção A — pelo terminal:**
```bash
cd gyulyia-project
vercel deploy
```
Siga as instruções. Na primeira vez, o Vercel vai perguntar o nome do projeto.

**Opção B — pela interface web:**
1. Acesse https://vercel.com/new
2. Clique em "Browse" e selecione a pasta `gyulyia-project`
3. Clique em "Deploy"

### 4. Configurar a chave de API (OBRIGATÓRIO para o botão de IA funcionar)

Após o deploy:
1. Acesse o dashboard do projeto no Vercel
2. Clique em **Settings** → **Environment Variables**
3. Clique em **Add New**
4. Preencha:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-...` (sua chave da Anthropic)
   - **Environments:** marque Production, Preview e Development
5. Clique em **Save**
6. Vá em **Deployments** e clique em **Redeploy** para aplicar

### 5. Domínio personalizado (gratuito no Vercel)
1. Compre o domínio em https://registro.br (domínios .com.br) ou Namecheap (.com)
2. No Vercel: Settings → Domains → Add Domain
3. Digite seu domínio (ex: gyulyia.com)
4. O Vercel vai mostrar os DNS records para configurar no seu registrar
5. Aguarde até 48h para propagar (geralmente menos de 1h)

---

## Como obter a chave de API da Anthropic

1. Acesse https://console.anthropic.com
2. Crie uma conta (tem créditos gratuitos para começar)
3. Vá em **API Keys** → **Create Key**
4. Copie a chave (começa com `sk-ant-`)
5. Cole na variável de ambiente do Vercel conforme o passo 4 acima

---

## Segurança

A chave de API NUNCA aparece no código do frontend (index.html).
Todo acesso à Anthropic passa pelo arquivo `api/generate-shader.js`,
que roda no servidor do Vercel e lê a chave de `process.env.ANTHROPIC_API_KEY`.

---

## Funcionalidades (todos os botões funcionam sem backend adicional)

| Funcionalidade        | Como funciona                    |
|-----------------------|----------------------------------|
| Shaders GLSL          | WebGL nativo no browser          |
| Microfone             | getUserMedia() — nativo          |
| Importar MP3/WAV      | FileReader + Web Audio API       |
| Importar imagem       | FileReader + WebGL texture       |
| Importar vídeo        | <video> + WebGL texture          |
| Webcam                | getUserMedia(video) — nativo     |
| Gravar vídeo          | MediaRecorder + captureStream()  |
| Snapshot PNG          | canvas.toDataURL()               |
| Editor GLSL           | WebGL compileShader() — nativo   |
| Gerar shader com IA   | Proxy seguro → Anthropic API     |

---

## Suporte a resoluções

- 720p  → 1280×720
- 1080p → 1920×1080
- 1440p → 2560×1440
- 4K    → 3840×2160
