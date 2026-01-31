# Guía de Despliegue (Deployment Guide)

Esta guía te ayudará a poner en línea tu aplicación **Top Tennis Management** y configurarla en un subdominio (ej: `app.tudominio.com`).

## Opción 1: Vercel (Recomendado)
Vercel es la plataforma nativa de Next.js y la forma más fácil de desplegar.

### 1. Preparación
* Sube tu código a un repositorio Git (GitHub, GitLab o Bitbucket).

### 2. Despliegue en Vercel
1. Crea una cuenta en [vercel.com](https://vercel.com).
2. Haz clic en **"Add New..."** -> **"Project"**.
3. Importa tu repositorio de Git.
4. En la configuración del proyecto, busca la sección **Environment Variables**.
5. Copia las variables de tu archivo `.env.local`:
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Haz clic en **Deploy**.

### 3. Configurar Subdominio
1. En el dashboard de tu proyecto en Vercel, ve a **Settings** -> **Domains**.
2. Escribe tu subdominio (ej: `app.tudominio.com`) y haz clic en **Add**.
3. Vercel te dará unos registros DNS (usualmente un **CNAME** o un **A Record**).
4. Ve a tu proveedor de dominio (Godaddy, Namecheap, Cloudflare, etc.) y agrega ese registro.
   * **Tipo**: CNAME
   * **Nombre**: `app` (o el subdominio que elegiste)
   * **Valor**: `cname.vercel-dns.com` (o lo que te indique Vercel).

---

## Opción 2: Servidor Propio (VPS / Ubuntu)
Si prefieres usar tu propio servidor (DigitalOcean, AWS, Linode).

### 1. Requisitos
* Node.js 18+ instalado.
* Nginx (como proxy inverso).
* PM2 (para mantener la app corriendo).

### 2. Instalación
```bash
# 1. Clonar tu repo
git clone https://github.com/tu-usuario/tennis-portal.git
cd tennis-portal

# 2. Instalar dependencias
npm install

# 3. Configurar entorno
# Crea un archivo .env.local y pega tus claves de Supabase
nano .env.local

# 4. Construir la aplicación
npm run build

# 5. Iniciar con PM2
npm install -g pm2
pm2 start npm --name "tennis-app" -- start
pm2 save
```

### 3. Configurar Subdominio (Nginx)
Configura Nginx para redirigir el tráfico del subdominio al puerto 3000 de Next.js.

Archivo: `/etc/nginx/sites-available/tennis-app`
```nginx
server {
    server_name app.tudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Luego activa el sitio y reinicia Nginx:
```bash
ln -s /etc/nginx/sites-available/tennis-app /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 4. Certificado SSL (HTTPS)
Usa Certbot para activar HTTPS gratis:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d app.tudominio.com
```

---

## Notas Importantes sobre Supabase
* Tu base de datos está en Supabase, así que la aplicación funcionará igual en cualquier lugar (Vercel o VPS) siempre que las **Variables de Entorno** sean correctas.
* Asegúrate de agregar la URL de tu dominio de producción en la configuración de **Authentication** de Supabase (Site URL y Redirect URLs) si usas el login de Supabase (aunque actualmente estás usando usuarios simulados, es bueno tenerlo en cuenta para el futuro).
