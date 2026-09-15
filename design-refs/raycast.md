# Raycast (manual v2) — referință de design

**Screenshot:** [raycast.png](raycast.png)

## Paletă de culori
Fundal negru profund, aproape identic cu Screen Studio ca strategie: negru + o singură culoare de accent roșu-portocaliu (folosită pentru linkuri active în sidebar și highlight-uri mici). Screenshot-urile de aplicație în sine sunt „glass"/translucide — efectul de Liquid Glass macOS e vizibil direct în capturi (blur, transparență peste imagini de fundal).

## Tipografie
Sans-serif de sistem, foarte mică pentru fiind un manual/documentație — text dens, multe rânduri, ca o pagină de docs tehnice reale (asemănător cu un GitBook/Notion). Titlurile de secțiune sunt de dimensiune moderată, fără accent de culoare pe text (doar iconițele mici din sidebar au culoare).

## Layout
Layout clasic de documentație: sidebar fix în stânga cu listă de capitole, conținut central cu lățime limitată, mini table-of-contents în dreapta (sticky). Foarte multe screenshot-uri de UI reale în grid-uri de 2 coloane, cu bordură subtilă și colțuri rotunjite, puse direct pe fundalul negru.

## Componente notabile
- Sidebar de navigație pe 3 nivele (Manual/secțiune/subpagină), tipic de documentație de produs.
- Screenshot-uri de UI cu efect de sticlă/blur (Liquid Glass) — un limbaj vizual de interfață, nu doar de site.
- Iconițe mici monocrome lângă fiecare titlu de subsecțiune, consistente ca stil (linie subțire, nu filled).

## Ton vizual
Tehnic, dens, „for power users" — se simte ca documentație serioasă de developer tool, nu ca o pagină de marketing; pune accent pe informație și pe capturile de UI reale, nu pe ilustrații.

## Ce putem prelua pentru Sidepaw
- Efectul de „glass" (blur + transparență + bordură subtire deschisă) e exact potrivit pentru balonul de statistici al lui Sidepaw (name/hunger/energy) — în loc de fundalul solid `#fffaf3` actual, am putea încerca o variantă translucidă tip Liquid Glass peste desktop.
- Iconițe mici monocrome, consistente, pentru fiecare acțiune din meniu (Mângâie/Hrănește/Culcă) — mai discret decât emoji.
