# Moroccan Academic Presentation Template

HTML + CSS + vanilla JavaScript. Arabic RTL, Zellige / arch design, live QR voting and quiz.

## 1. Open it

Double-click `index.html` (Chrome or Edge recommended). Everything works offline in **demo mode**.
Press **P** to open the presenter panel.

## 2. Folder map

```
index.html     projector view (the presentation)
vote.html      phone voting page (opened by the QR code)
content.js     ALL your text, images, questions  <-- the only file you edit daily
config.js      Firebase keys + a few settings    <-- edit once
css/           theme.css (colors, fonts, background), slides.css, vote.css
js/            app.js, charts.js, voting.js, vote-page.js
images/        put your pictures here (zellige.svg is the background pattern)
```

## 3. Edit your content (content.js)

- **Add** a slide: copy a `{ ... }` block and paste it.
- **Remove** a slide: delete its block.
- **Reorder**: move the block up or down.
- The table of contents, numbers, dots and progress bar update automatically.
- Slide types: `cover, intro, toc, topic, image, poll, quiz, conclusion, thanks`
  (the list of options for each type is written at the top of `content.js`).
- Images: copy the file into `images/` and write `src: "images/my-photo.jpg"`.
- Other language (French/English): change `dir` to `"ltr"`, `lang`, and the texts in `labels`.

## 4. Change colors and fonts (css/theme.css)

Edit the variables at the top: `--emerald-*`, `--gold`, `--terracotta`, `--beige`, `--font-title`, `--font-body`.
Fonts come from Google Fonts. Without internet the browser uses a default Arabic font.

## 5. Keyboard shortcuts

| Key | Action |
|---|---|
| ← → (Arabic: ← = next) / PageUp / PageDown / Space | previous / next |
| Home / End | first / last slide |
| F | fullscreen |
| O | overview grid (click a slide to jump) |
| P | presenter panel (timer, voting controls) |
| V | open / close voting for the current poll or quiz |
| R | reveal the correct answer of a quiz |
| M | reduce motion (for weak projector laptops) |
| Esc | close overview / panel |

The panel, dots and buttons hide by themselves after 3 seconds without mouse movement.

## 6. Live voting

How it works: phones open `vote.html?s=CODE` (from the QR code). Votes are written to Firebase;
the projector listens and animates the bars. One vote per phone and question.

### Rehearse without Firebase (demo mode)
1. Open `index.html`, go to a poll slide, press **P**.
2. Click **محاكاة أصوات** (simulate votes) to see animated bars, or **فتح صفحة الهاتف** to open the phone page
   in another tab of the **same browser** and vote there.

### Firebase setup (real phones) — about 10 minutes, free
1. Go to https://console.firebase.google.com → **Add project** (disable Analytics).
2. **Build → Realtime Database → Create database** (choose any location, start in *locked mode*).
3. Open the **Rules** tab and paste this, then **Publish**:

```json
{
  "rules": {
    "sessions": {
      "$session": {
        ".read": true,
        "state": { ".write": true },
        "votes": {
          "$q": {
            "$device": {
              ".write": "!data.exists() || !newData.exists()",
              ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() < 10"
            }
          }
        }
      }
    }
  }
}
```
4. **Project settings (gear) → General → Your apps → Web app (`</>`)** → register an app →
   copy the `firebaseConfig` values into `config.js` (`apiKey`, `authDomain`, `databaseURL`, `projectId`, `appId`).
   If `databaseURL` is missing, copy it from the Realtime Database page.
5. These rules are meant for a classroom: anyone who knows the 4-letter session code could write to it.
   Use **جلسة جديدة** (new session) in the panel for each presentation, and delete the project afterwards if you like.

### Publish the files online (phones cannot open a file on your laptop)
Any free static host works. The simplest options:
- **Netlify Drop**: go to https://app.netlify.com/drop and drag the whole folder in. You get an address like `https://xxxx.netlify.app`.
- **GitHub Pages**: upload the folder to a repository → Settings → Pages.
- **Firebase Hosting** (same project): `firebase init hosting`, then `firebase deploy`.

Then open the **hosted** `index.html` for your presentation (the QR code uses the address you opened).
If you present from the local file instead, set `VOTE_BASE_URL` in `config.js` to the hosted folder address.

### During the presentation
- Reaching a poll/quiz slide opens voting automatically (`AUTO_OPEN_VOTING` in `config.js`).
- **V** closes/opens voting, **R** reveals the quiz answer (also shown on phones with the explanation).
- If the internet fails, press **P → تفعيل الوضع التجريبي** and use **محاكاة أصوات**; the presentation never breaks.

## 7. Tips

- Test the QR code with your phone on the university Wi-Fi *before* the presentation.
- Phones need internet (mobile data is fine). The projector laptop needs internet for live mode.
- Use HTML freely inside texts: `<b>bold</b>`, `<br>` for a line break.
- Keep each slide short: one idea, 3 points maximum.
