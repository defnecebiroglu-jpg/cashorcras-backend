# Cash or Crash - Cloud Deployment Guide

Bu rehber, Cash or Crash uygulamasını Render ve Railway gibi bulut platformlarına HTTPS ile deploy etmek için gerekli adımları içerir.

## Render Deployment

### 1. Repository Hazırlığı
- Projeyi GitHub'a push edin
- `render.yaml` veya manuel yapılandırma kullanabilirsiniz

### 2. Render'da Deploy Etme (Manuel - Önerilen)
1. [Render](https://render.com) hesabınıza giriş yapın
2. "New" > "Web Service" seçin
3. GitHub repository'nizi bağlayın
4. Manuel yapılandırma seçin:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/index.js`
   - **Environment**: Node
5. "Create Web Service" düğmesine tıklayın

### 2B. Alternatif: render.yaml ile (Eğer manuel çalışmazsa)
- `render-simple.yaml` dosyasını `render.yaml` olarak yeniden adlandırın

### 3. Environment Variables (Opsiyonel)
Render otomatik olarak şunları ayarlar:
- `NODE_ENV=production`
- `SESSION_SECRET` (otomatik oluşturulan güvenli değer)

### 4. Deploy Sonrası
- Render otomatik HTTPS sertifikası sağlar
- Uygulamanız `https://your-app-name.onrender.com` adresinde çalışacak

## Railway Deployment

### 1. Repository Hazırlığı
- Projeyi GitHub'a push edin

### 2. Railway'de Deploy Etme (Manuel - Önerilen)
1. [Railway](https://railway.app) hesabınıza giriş yapın
2. "New Project" > "Deploy from GitHub repo" seçin
3. Repository'nizi seçin
4. Deploy sonrası Settings'e gidin:
   - **Build Command**: `npm install && npm run build` (otomatik algılar)
   - **Start Command**: `node dist/index.js`
5. Redeploy yapın

### 2B. Sorun Çözme
Eğer otomatik build çalışmazsa:
- `railway.json` ve `nixpacks.toml` dosyalarını geçici olarak silin
- Railway'in otomatik algılamasını bekleyin
- Start command'ı manuel olarak `node dist/index.js` yapın

### 3. Environment Variables
Railway dashboard'dan şu değişkenleri ayarlayın:
- `NODE_ENV=production` (otomatik ayarlanır)
- `SESSION_SECRET=your-secret-key` (güvenli bir değer girin)

### 4. Domain Ayarlama
- Railway otomatik subdomain sağlar: `https://your-app.up.railway.app`
- Özel domain ekleyebilirsiniz: Settings > Domains

## Docker Deployment (Opsiyonel)

Kendi sunucunuzda Docker ile çalıştırmak için:

```bash
# Build
docker build -t cash-crash .

# Run
docker run -d -p 5000:5000 \
  -e NODE_ENV=production \
  -e SESSION_SECRET=your-secret-key \
  --name cash-crash-app \
  cash-crash
```

## Önemli Notlar

### 1. HTTPS Yapılandırması
- Session cookies HTTPS için güvenli olarak ayarlanmıştır
- Production'da `secure: true` otomatik olarak aktif olur

### 2. Port Yapılandırması
- Uygulama `process.env.PORT` veya `5000` portunu kullanır
- Cloud platformlar otomatik port atar

### 3. Dosya Yüklemeleri
- `uploads/` klasörü persistent disk olarak yapılandırılmıştır
- Render'da 1GB disk alanı ayrılmıştır

### 4. In-Memory Storage
- Uygulama in-memory storage kullanır
- Server restart edildiğinde veriler sıfırlanır
- Production kullanımı için veritabanı entegrasyonu önerilir

## Troubleshooting

### Build Hatası
- `npm ci` ve `npm run build` komutlarının başarıyla çalıştığını kontrol edin
- Node.js 18+ gereklidir

### Session Problemleri
- `SESSION_SECRET` environment variable'ının ayarlandığını kontrol edin
- HTTPS sertifikasının aktif olduğunu doğrulayın

### Port Hatası
- Environment'ta `PORT` variable'ının doğru ayarlandığını kontrol edin
- `0.0.0.0` host binding mevcuttur

## Monitoring

Her iki platform da şu monitoring özelliklerini sağlar:
- Application logs
- Performance metrics
- Health check monitoring
- Automatic restart on failure

Deploy sonrası uygulamanızın çalıştığını kontrol etmek için root URL'ye erişin.