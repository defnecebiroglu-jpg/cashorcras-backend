# Cash or Crash - Railway Deployment Rehberi

## Railway Deployment Sorun Çözümü

### Mevcut Sorunlar:
1. **Connection Refused (502)**: Server başlamıyor veya PORT binding hatası
2. **Admin Endpoint Disabled**: Session type errors

### Çözümler:

#### 1. Environment Variables (Railway Dashboard'da):
```bash
NODE_ENV=production
SESSION_SECRET=your-secure-random-key-here
HOST=0.0.0.0
```

#### 2. Build & Start Commands:
- **Build Command**: `npm cache clean --force && npm install --omit=dev --no-audit --no-fund && vite build && npx esbuild server/production.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/production.js`  
- **Start Command**: `node dist/production.js`

#### 3. Port Configuration:
Railway otomatik olarak PORT environment variable atar. Server şu şekilde dinler:
- Host: `0.0.0.0` (tüm interfaces)
- Port: Railway tarafından atanan PORT (genellikle 3000+)

#### 4. Health Check:
Deploy sonrası kontrol edin:
```bash
curl https://your-railway-domain/health
```

#### 5. Session Security:
Production'da secure cookies otomatik aktif olur (HTTPS gerektirir).

### Deployment Steps:
1. Railway project oluşturun
2. Environment variables ayarlayın
3. Repository'yi bağlayın
4. Deploy butonuna basın
5. Logs'ta server start mesajını kontrol edin

## 🔥 CURRENT TEST - RAW HTTP SERVER

**Durum**: Complex Express server yerine raw Node.js HTTP server kullanıyoruz
- **Dosya**: `dist/raw-http.js` 
- **Boyut**: ~1kb
- **Dependency**: Sadece built-in Node.js modüller
- **Amaç**: Express/dependency sorunları bypass etmek

### Debug:
Eğer hala 502 alıyorsanız:
1. Railway logs'ları kontrol edin
2. `npm run build` local'da çalışıyor mu test edin  
3. `node dist/index.js` komutu ile manuel start test edin
4. PORT ve HOST environment variables doğru mu kontrol edin

### Common Issues & Fixes:

#### NPM Cache Issues:
- Build command otomatik olarak cache'i temizler: `npm cache clean --force`
- `--omit=dev` kullanır (production dependencies only)  
- `--no-audit --no-fund` ile gereksiz işlemler atlanır

#### ✅ Path Resolution FIXED (import.meta.dirname):
- **ÇÖZÜLDÜ**: Production server artık Vite bağımlılığı kullanmıyor
- **ÇÖZÜLDÜ**: server/production.ts import.meta.dirname içermiyor
- **ÇÖZÜLDÜ**: Multer upload /tmp/uploads (Railway-safe)
- **ÇÖZÜLDÜ**: Static file serving production-optimized

#### 502 Connection Refused:
- PORT ve HOST environment variables Railway tarafından otomatik ayarlanır
- Server `0.0.0.0:$PORT` üzerinde dinler (tüm interfaces)
- Session security production'da HTTPS gerektirir

**Railway deployment şimdi optimize edildi ve admin endpoints aktif!**