HRM TODAY - VIDEO ZINAJITENGENEZA KILA SIKU (BILA WEWE KUFANYA CHOCHOTE)

JINSI INAVYOFANYA KAZI
Kila usiku saa 00:05 (saa za Tanzania), GitHub inaendesha yenyewe "Daily HRM video":
  1. Inachukua mada ya siku kutoka  hrm-topics.json
  2. Inatengeneza video ya animation (9:16, 1080x1920) ya leo na ya siku 2 zijazo
  3. Inaiweka kwenye videos/hrm/ na kuongeza mstari kwenye hrm-videos.json
  4. Inafuta video za zaidi ya siku 45 (kuzuia repo kujaa)
App yako (kipande cha HRM today) inasoma hrm-videos.json na kuonyesha video ya leo
pamoja na kitufe cha "Download video".

KUWEKA (MARA MOJA TU)
1) Pakia kwenye repo ya GitHub (folda kuu), vitu vyote vya folda hii:
     .github/workflows/daily-hrm-video.yml
     tools/   (make_hrm_video.py na assets)
     hrm-topics.json
     hrm-videos.json
     videos/hrm/
   Kumbuka: folda ya ".github" inaanza na nukta - hakikisha imepakiwa.
2) GitHub > Settings > Actions > General > Workflow permissions
   chagua "Read and write permissions" > Save.
3) Actions > "Daily HRM video" > Run workflow  (kuijaribu mara ya kwanza).
4) Kwenye index.html, sehemu ya HRM today, bandika kipande cha hrm-today-widget.html.

KUBADILISHA MADA
Hariri hrm-topics.json (mada zinazunguka kila siku kuanzia startDate).
Tumia *nyota* kuangazia maneno kwa dhahabu. Mada 12 zilizopo ni za mfano -
badilisha na mada halisi za darasa lenu. Ukihariri faili hilo, video zinatengenezwa upya zenyewe.
Mada ya siku maalum: weka  "date":"2026-11-05"  ndani ya mada hiyo.

DOWNLOAD YA 4K (hiari): endesha  python tools/make_hrm_video.py --date YYYY-MM-DD --res 3840
(inatoa 4K, faili kubwa ~90MB - weka kwa siku muhimu tu).
