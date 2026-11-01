/* =========================================================================
   content.js — EVERYTHING you edit lives here (text, images, questions).
   You never need to touch the design files.

   HOW TO EDIT
   - Edit text between the quotes. You may use simple HTML: <b>bold</b>, <br>
   - ADD a slide  : copy a block { ... }, paste it, change the text.
   - REMOVE a slide: delete its block.
   - REORDER      : move the block up or down.
   - The table of contents, numbering, dots and progress bar update by themselves.

   SLIDE TYPES
   cover       title page (reads "meta" below)
   intro       title, text, points[]
   toc         automatic list of all "topic" and "image" slides (add  toc:false  to hide one)
   topic       title, text, points[], example:{text}, visual:{...}
                 visual kinds:
                   {kind:"ring",  value:72, suffix:"%", label:"..."}
                   {kind:"bars",  items:[{label:"..",value:80}, ...], suffix:"%", max:100}
                   {kind:"image", src:"images/photo.jpg", alt:"..."}
                   (no visual = decorative Moroccan rosette)
   image       title, text, src, alt, caption, shape:"arch" | "wide"
   poll        question, options[]            -> live vote, no right answer
   quiz        question, options[], correct (0 = first option), explanation
   conclusion  title, points[]
   thanks      title, text, contacts[]
   ========================================================================= */

window.PRESENTATION = {

  /* ---------- general information (cover page) ---------- */
  meta: {
    lang: "ar",
    dir: "rtl",            // "rtl" for Arabic, "ltr" for French/English
    digits: "latn",        // "latn" = 1 2 3   |   "arab" = ١ ٢ ٣
    optionKeys: ["أ", "ب", "ج", "د", "هـ", "و"],
    title: " دراسة الهوية والتحولات الاجتماعية في العصر الرقمي ",
    subtitle: "",
    author: "اسم الطالب(ة)",
    university: "جامعة محمد الأول",
    faculty: "كلية الآداب والعلوم الإنسانية بوجدة",
    supervisor: "تحت إشراف: الأستاذ(ة) ...",
    date: "2026"
  },

  /* ---------- interface texts (change them to translate the whole interface) ---------- */
  labels: {
    poll: "استطلاع مباشر",
    quiz: "اختبار سريع",
    scan: "امسح الرمز للمشاركة",
    code: "رمز الجلسة",
    votes: "الأصوات",
    participants: "المشاركون",
    open: "التصويت مفتوح",
    closed: "التصويت مغلق",
    waiting: "في انتظار بدء التصويت",
    correct: "الإجابة الصحيحة",
    example: "مثال",

    prev: "السابق",
    next: "التالي",
    fullscreen: "ملء الشاشة",
    overview: "نظرة عامة",
    panel: "لوحة المقدّم",
    panelTitle: "لوحة المقدّم",
    timerStart: "ابدأ",
    timerPause: "إيقاف",
    timerReset: "إعادة",
    openVoting: "فتح التصويت",
    closeVoting: "إغلاق التصويت",
    reveal: "كشف الإجابة",
    reset: "تصفير الأصوات",
    simulate: "محاكاة أصوات",
    openPhone: "فتح صفحة الهاتف",
    newSession: "جلسة جديدة",
    demoOn: "تفعيل الوضع التجريبي",
    demoOff: "العودة إلى الوضع المباشر",
    motion: "تقليل الحركة",
    modeLive: "متصل — الوضع المباشر",
    modeDemo: "الوضع التجريبي",
    modeOffline: "غير متصل بالإنترنت",
    modeFallback: "تعذّر الاتصال — الوضع التجريبي",
    hostFirst: "انشر الملفات على الإنترنت ليعمل رمز QR",
    shortcuts: "← → تنقّل · F ملء الشاشة · O نظرة عامة · P لوحة المقدّم · V فتح/إغلاق التصويت · R كشف الإجابة · M تقليل الحركة",

    phoneNoSession: "افتح هذه الصفحة عن طريق رمز QR المعروض على الشاشة",
    phoneWaiting: "في انتظار السؤال التالي…",
    phoneVoted: "تم تسجيل صوتك، شكرًا لمشاركتك",
    phoneClosed: "التصويت مغلق حاليًا",
    phoneRight: "إجابة صحيحة",
    phoneWrong: "إجابة غير صحيحة",
    phoneAlready: "لقد صوّتَّ على هذا السؤال من قبل",

    types: {
      cover: "الغلاف", intro: "مقدمة", toc: "المحاور", topic: "محور", image: "صورة",
      poll: "استطلاع", quiz: "اختبار", conclusion: "خلاصة", thanks: "شكر"
    }
  },

  /* ---------- the slides (in presentation order) ---------- */
  slides: [

    { type: "cover" },

    {
      type: "intro",
      kicker: "تمهيد",
      title: "مقدمة",
      text: "هنا فقرة تمهيدية قصيرة تعرّف بالموضوع وسياقه الأكاديمي. استبدل هذا النص بنصك الخاص، واجعله واضحًا في جملتين أو ثلاث.",
      points: [
          "مفهوم الهوية",
        "الهوية الفردية والجماعية",
         "الهوية الثقافية",
         "تأثير التكنولوجيا الرقمية",
         "الهوية المغربية"
      ]
    },

    { type: "toc", title: "محاور العرض" },

    {
      type: "topic",
      kicker: "المحور الأول",
      title: "عنوان المحور الأول",
      text: "شرح مختصر للفكرة الأساسية في هذا المحور. اكتب جملة أو جملتين فقط، ودع الشرح التفصيلي لكلامك أثناء العرض.",
      points: [
        "النقطة الأولى المهمة",
        "النقطة الثانية المهمة",
        "النقطة الثالثة المهمة"
      ],
      example: { text: "مثال تطبيقي قصير يوضّح الفكرة للجمهور." },
      visual: { kind: "ring", value: 50, suffix: "%", label: "وصف الإحصائية أو النتيجة" }
    },

    {
      type: "image",
      kicker: "المحور الثاني",
      title: "عنوان المحور الثاني",
      text: "فقرة تشرح الصورة أو المخطط المعروض بجانبها، وما الذي ينبغي أن ينتبه إليه الجمهور.",
      src: "images/OIP.jpg",
      alt: "وصف الصورة",
      caption: "تعليق على الصورة · المصدر",
      shape: "arch"
    },
    
    {
      type: "image",
      kicker: "المحور الثاني",
      title: "عنوان المحور الثاني",
      text: "فقرة تشرح الصورة أو المخطط المعروض بجانبها، وما الذي ينبغي أن ينتبه إليه الجمهور.",
      src: "images/OIP.jpg",
      alt: "وصف الصورة",
      caption: "تعليق على الصورة · المصدر",
      shape: "arch"
    },

    {
      type: "topic",
      kicker: "المحور الثالث",
      title: "عنوان المحور الثالث",
      text: "مقارنة أو نتائج يمكن عرضها بأعمدة متحركة. غيّر الأسماء والقيم بسهولة من هذا الملف.",
      points: [
        "ملاحظة حول النتائج",
        "ملاحظة حول المقارنة"
      ],
      visual: {
        kind: "bars", suffix: "%", max: 100,
        items: [
          { label: "العنصر الأول", value: 80 },
          { label: "العنصر الثاني", value: 60 },
          { label: "العنصر الثالث", value: 35 }
        ]
      }
    },

    {
      type: "poll",
      id: "poll1",
      question: "ما هو الجانب الأكثر أهمية في رأيك؟",
      options: ["الخيار الأول", "الخيار الثاني", "الخيار الثالث", "الخيار الرابع"]
    },

    {
      type: "topic",
      kicker: "المحور الرابع",
      title: "عنوان المحور الرابع",
      text: "محور بدون رسم بياني: تظهر بجانبه زخرفة مغربية متحركة. يمكنك إضافة مثال واقعي في الأسفل.",
      points: ["الفكرة الأولى", "الفكرة الثانية", "الفكرة الثالثة"],
      example: { label: "من الواقع", text: "حالة واقعية أو تجربة تدعم الفكرة المطروحة." }
    },

    {
      type: "quiz",
      id: "quiz1",
      question: "سؤال تجريبي: ما الإجابة الصحيحة؟",
      options: ["إجابة أولى", "إجابة ثانية", "إجابة ثالثة", "إجابة رابعة"],
      correct: 1,
      explanation: "هنا تشرح لماذا هذه هي الإجابة الصحيحة، في جملة أو جملتين."
    },

    {
      type: "quiz",
      id: "quiz2",
      question: "سؤال تجريبي آخر: اختر الجواب المناسب",
      options: ["الجواب الأول", "الجواب الثاني", "الجواب الثالث"],
      correct: 0,
      explanation: "تفسير مختصر للجواب الصحيح يظهر بعد كشف الإجابة."
    },

    {
      type: "conclusion",
      kicker: "الخلاصة",
      title: "خلاصة العرض",
      points: [
        "الفكرة الأولى التي أريد أن يتذكّرها الجمهور",
        "الفكرة الثانية التي أريد أن يتذكّرها الجمهور",
        "الفكرة الثالثة وآفاق البحث المستقبلية"
      ]
    },

    {
      type: "thanks",
      title: "شكرًا لكم على حسن الاستماع",
      text: "يسعدني الإجابة عن أسئلتكم",
      contacts: ["name@example.com", "linkedin.com/in/yourname"]
    }
  ]
};

/* Do not edit below: gives every poll/quiz an id if you forgot one. */
(function () {
  window.PRESENTATION.slides.forEach(function (s, i) {
    if ((s.type === 'poll' || s.type === 'quiz') && !s.id) s.id = s.type + (i + 1);
  });
})();
