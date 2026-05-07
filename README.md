# Webshop Project

## Beskrivning

Detta är en enkel webshop med separat frontend och backend.
Användaren kan:

* Se produkter
* Filtrera och sortera produkter
* Lägga till produkter i kundvagn
* Justera antal i kundvagnen
* Slutföra en order

Admin-sidan gör det möjligt att:

* Skapa produkter
* Uppdatera produkter
* Ta bort produkter
* Se och ta bort ordrar

---

## Teknik

**Frontend**

* React
* React Router
* TanStack Query
* Tailwind CSS

**Backend**

* Node.js
* Express

---

## Installation

### 1. Klona projektet

```bash
git clone <repo-url>
cd webshop
```

---

### 2. Installera dependencies

Frontend:

```bash
cd frontend
npm install
```

Backend:

```bash
cd ../backend
npm install
```

---

### 3. Lägg till serviceAccountKey.json

Backend kräver en service account-nyckel.

1. Skapa en fil i backend-mappen:

```
backend/serviceAccountKey.json
```

2. Be projektägaren om nyckeln och klistra in innehållet i filen.


---

### 4. Starta projektet

Starta backend:

```bash
cd backend
npm run dev
```

Starta frontend (i ny terminal):

```bash
cd frontend
npm run dev
```

---

## Struktur

```
webshop/
  frontend/
  backend/
```

---

## Noteringar

* Installera alltid paket i rätt mapp (frontend/backend)
* Backend måste vara igång för att frontend ska fungera
* Kundvagnen sparas i localStorage
* serviceAccountKey.json är en känslig fil och delas separat
