# hiwebs — Agencia Digital

Sitio web oficial de **hiwebs**, agencia digital argentina especializada en diseño web, Google Ads y posicionamiento SEO.

## 🚀 Estructura del proyecto

```
hiwebs/
├── index.html      # Página principal
├── style.css       # Estilos
├── script.js       # Lógica e interacciones
├── hiwebs_logo.png # Logo (agregar archivo)
├── video1.mp4      # Video de fondo hero (agregar archivo)
└── README.md
```

## ✏️ Personalización rápida

### Cambiar número de WhatsApp
En `index.html` y `script.js`, reemplazá `5491100000000` con tu número real:
- `549` = código de Argentina
- `11` = código de área (sin el 0)
- `00000000` = tu número sin el 15

**Ejemplo:** Si tu número es 011-15-3456-7890 → `5491134567890`

### Cambiar email de contacto
En `index.html` buscá `hola@hiwebs.com.ar` y reemplazalo.

### Agregar el video de fondo
Colocá un archivo `video1.mp4` en la raíz del proyecto. Si no tenés video, el fondo degradado queda igual de bien.

### Agregar el logo
Colocá `hiwebs_logo.png` en la raíz. Actualmente el logo es texto (`hiwebs` en CSS).

## 🌐 Cómo subir a GitHub Pages

1. Crear repositorio en [github.com](https://github.com) → New repository → nombre: `hiwebs` (o el que quieras)
2. Subir todos los archivos:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/TU_USUARIO/hiwebs.git
   git push -u origin main
   ```
3. En GitHub → Settings → Pages → Source: `main` branch → Save
4. Tu sitio estará en: `https://TU_USUARIO.github.io/hiwebs`

## 🔗 Vincular dominio de NIC.ar

1. En GitHub Pages (Settings → Pages → Custom domain): escribí `tudominio.com.ar`
2. En NIC.ar → administrar tu dominio → Servidores de nombres DNS → agregar:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
3. También agregar registro CNAME con valor: `TU_USUARIO.github.io`
4. Esperar entre 24-48hs para que el DNS se propague
5. Activar "Enforce HTTPS" en GitHub Pages

## 📋 Checklist antes de publicar

- [ ] Reemplazar número de WhatsApp real
- [ ] Reemplazar email de contacto real
- [ ] Agregar logo `hiwebs_logo.png`
- [ ] Agregar video `video1.mp4` (opcional)
- [ ] Actualizar links de Instagram y LinkedIn
- [ ] Revisar y personalizar los textos
- [ ] Actualizar imágenes del portafolio con trabajos reales

---
© 2026 hiwebs
