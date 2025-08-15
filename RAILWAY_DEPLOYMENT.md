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
- **Build Command**: `npm ci && npm run build`  
- **Start Command**: `node dist/index.js`

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

### Debug:
Eğer hala 502 alıyorsanız:
1. Railway logs'ları kontrol edin
2. `npm run build` local'da çalışıyor mu test edin  
3. `node dist/index.js` komutu ile manuel start test edin
4. PORT ve HOST environment variables doğru mu kontrol edin

**Railway deployment şimdi optimize edildi ve admin endpoints aktif!**