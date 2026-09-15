# Distribuire Sidepaw pe macOS

Aplicația Electron nu poate fi instalată pe iPhone sau iPad. Pachetul de mai jos este pentru MacBook/iMac cu macOS 12 sau mai nou și este universal: funcționează pe Intel și Apple Silicon.

## Build-ul de trimis

Rulează pe un Mac, din folderul proiectului:

```bash
npm ci
npm run setup:mac
```

În `dist/` vor apărea:

- `Sidepaw-Setup-0.1.0-macOS.zip` — arhiva pe care o trimiți. Conține installerul real `Sidepaw-Setup-0.1.0-universal.pkg`.
- `Sidepaw-Setup-0.1.0-universal.pkg` — se deschide cu dublu-click și instalează automat Sidepaw în `/Applications` folosind Installer-ul macOS.

Destinatarul face: dezarhivează ZIP-ul → dublu-click pe `Sidepaw-Setup.pkg` → apasă `Install`. După instalare poate porni Sidepaw din Applications.

Pentru un pachet DMG clasic:

```bash
npm run build
npx electron-builder --mac dmg --universal
```

Pentru un ZIP neîmpachetat de verificare:

```bash
npm run dist:mac
```

## Semnare și Gatekeeper

Pentru ca destinatarul să poată deschide setup-ul fără avertisment de „unidentified developer”, aplicația trebuie semnată cu `Developer ID Application`, iar installerul `.pkg` cu `Developer ID Installer`, apoi notarizat. Certificatele nu se pun în ZIP și nu se comit în proiect.

electron-builder citește automat configurația Apple din variabilele standard (`CSC_LINK`/`CSC_KEY_PASSWORD` sau profilul API Apple `APPLE_API_KEY`, `APPLE_API_KEY_ID`, `APPLE_API_ISSUER`). După configurare, rulează din nou `npm run setup:mac`. Verificarea locală se poate face cu:

```bash
codesign --verify --deep --strict --verbose=2 dist/mac-universal/Sidepaw.app
spctl --assess --type execute --verbose dist/mac-universal/Sidepaw.app
```

Nu există un mod sigur de a livra o aplicație macOS „one-click” fără semnare/notarizare Apple; ZIP-ul și DMG-ul sunt doar formatele de transport.
