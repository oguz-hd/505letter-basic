# 505 Letter Project

Modern web uygulaması - HTML, CSS, JavaScript ile oluşturulan modüler bir proje.

## Proje Yapısı

```
505letter-basic/
├── index.html          # Ana sayfa
├── admin.html          # Yönetim paneli
├── contact.html        # İletişim sayfası
├── latest.html         # En son içerik
├── movie.html          # Film sayfası
├── popular.html        # Popüler içerik
├── css/
│   └── style.css       # Ana stil dosyası
├── js/
│   └── main.js         # Ana JavaScript dosyası
├── data/
│   ├── films.json      # Film verisi
│   └── comments.json   # Yorum verisi
└── README.md
```

## Çalıştırma

Fetch API kullanıldığından yerel bir sunucu ile çalışması gereklidir.

### VS Code Live Server ile
Sağ tık → "Open with Live Server"

### Python ile
```bash
python -m http.server 5500
```

### Node.js ile
```bash
npx http-server
```

## Özellikler

- Modüler tasarım (React/Vue/Django'ya taşınacak)
- JSON tabanlı veri yönetimi
- Responsive arayüz
- Modern JavaScript (ES6+)

## Geliştirici

Oğuz Han Duran - @oguz-hd






























////////////////////////////////////////////////////////////77



You are building a modular web project that will later be ported to frameworks like React, Vue, and Django. 
The goal is to create a clean, framework-agnostic base front-end architecture.

Project Name: Film Arşivi Sitesi (Cinema Archive Library Aesthetic)

TECH REQUIREMENTS:
- Use ONLY: HTML, CSS, and Vanilla JavaScript (no frameworks).
- All data must come from JSON files (not localStorage).
- The structure must be clean and easy to port into component-based frameworks.
- Styling aesthetic: “Poster Library” theme (no Netflix style):
    - Background: #F8F6F1 (off-white / warm paper tone)
    - Text color: #1A1A1A (charcoal black)
    - Accent color: #C4473A (brick red)
    - When possible, use serif fonts for titles (e.g., "Playfair Display" or "Merriweather").
- Layout should be lightweight, grid-based, minimal shadows, no neon gradients, no horizontal scroll sections.

PROJECT STRUCTURE (create exactly this):

/project-root
│ index.html                → Film list page (Main Page)
│ movie.html                → Film detail page
│ admin.html                → Film creation / admin page
│
│ /css
│   style.css               → Shared global CSS
│
│ /js
│   app.js                  → Handles loading & rendering movie list + shared functions
│   movie.js                → Handles movie detail page logic and comment rendering
│   admin.js                → Handles adding new films to JSON
│   comments.js             → Handles loading and adding comments
│
└── /data
    films.json              → Stores all film records
    comments.json           → Stores user comments (no accounts required)


DATA MODELING:

films.json structure example:
[
  {
    "id": 1,
    "title": "The Shawshank Redemption",
    "year": 1994,
    "genre": ["Drama"],
    "description": "Haksız yere hüküm giyen bir adamın özgürlük umudu.",
    "cast": ["Tim Robbins", "Morgan Freeman"],
    "rating": 9.3,
    "poster": "img/shawshank.jpg"
  }
]

comments.json structure example:
[
  {
    "movie_id": 1,
    "username": "oguz",
    "comment": "Bu film hayatımı değiştirdi.",
    "date": "2025-01-01"
  }
]


PAGE REQUIREMENTS:

1) index.html (Film List Page)
- Fetch films.json and display each film as a poster card.
- Clicking a film navigates to movie.html?id={id}.
- Include search bar to filter by title.


2) movie.html (Film Detail Page)
- Parse ?id={id} from URL.
- Load film info from films.json.
- Display:
  - Poster (big on left or top)
  - Title, Year, Genres, Rating
  - Description
  - Cast list (as tags or bullet list)
- Load comments linked by matching movie_id.
- Show a form to add a new comment:
  - username (text input)
  - comment text (textarea)
  - no login system needed.
- Append new comment to comments.json.


3) admin.html (Film Add Page)
- Display a form with:
  - Title
  - Year
  - Genre (comma separated, convert to array)
  - Description
  - Cast (comma separated, convert to array)
  - Rating (number)
  - Poster URL
- On submit:
  - Read films.json
  - Generate a new incremental ID
  - Append film object and save updated JSON


ADDITIONAL REQUIREMENTS:
- Code must be structured cleanly and separated (no inline JS).
- Make reusable DOM helper functions if appropriate.
- Ensure adequate comments in the JS files explaining each logical step.
- Avoid complexity; prefer clarity.


OUTPUT:
Generate the **entire project** file structure with initial working code.
Make sure the site loads correctly in the browser without backend first.


////////////////////////////////////////////////////////////////////////////7


Project structure
/project-root├── index.html          → Film list page with search├── movie.html          → Film detail page with comments├── admin.html          → Admin page for adding films├── /css│   └── style.css       → Global styles (poster library aesthetic)├── /js│   ├── app.js          → Film list & shared functions│   ├── movie.js        → Film detail page logic│   ├── admin.js        → Admin form handling│   └── comments.js     → Comment loading & adding└── /data    ├── films.json      → Film data (3 sample films)    └── comments.json   → Comment data (2 sample comments)
Features implemented
Film list page (index.html):
Grid layout with film cards
Search by title, genre, or cast
Clickable cards navigate to detail page
Film detail page (movie.html):
Poster, title, year, rating, genres
Description and cast list
Comment section with form
Comments load and display
Admin page (admin.html):
Form to add new films
Validates inputs
Generates incremental IDs
Stores in JSON (with localStorage fallback)
Design
Colors: #F8F6F1 background, #1A1A1A text, #C4473A accent
Typography: Playfair Display for headings, Open Sans for body
Layout: Grid-based, minimal shadows, responsive
Poster library aesthetic
Important notes
Local development: Since browsers can't write JSON files directly, the code uses localStorage as a fallback. Films and comments added through the UI are stored in localStorage and merged with server data.
Backend integration: To persist to files, add a backend API endpoint. The code is ready for that.
Images: Using placeholder images. Replace poster URLs in films.json or via the admin page with your own image URLs or local paths.
How to use
Open index.html in a browser (use a local server if needed due to CORS).
Browse films on the main page.
Click a film card to view details and comments.
Add comments on the detail page.
Add new films via the admin page.
The site is ready to use. Code is modular and documented for porting to React, Vue, or Django.

