/**
 * ARNAB ✈ ARATRIKA AIRLINES: THE JOURNEY TO FOREVER
 * Final Production JavaScript
 * Pure Frontend — Zero Backend — Fully Interactive
 */

document.addEventListener('DOMContentLoaded', () => {

  // ===================================================================
  // 1. STATE & GLOBAL CONFIGURATION
  // ===================================================================
  const state = {
    currentScreen: 'screen-loading',
    previousScreen: null,
    isAudioPlaying: false,
    currentLang: 'en',
  };

  // Screens Map
  const screens = {
    loading: document.getElementById('screen-loading'),
    welcome: document.getElementById('screen-welcome'),
    boardingPass: document.getElementById('screen-boarding-pass'),
    boardingConfirmed: document.getElementById('screen-boarding-confirmed'),
    lounge: document.getElementById('screen-wedding-lounge'),
  };

  // Audio Elements
  const audioEl = document.getElementById('wedding-audio');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioWave = document.getElementById('audio-wave');
  const welcomeAudioBtn = document.getElementById('welcome-audio-toggle');
  const loungeAudioBtn = document.getElementById('lounge-audio-btn');

  // Viewport Container
  const appViewport = document.getElementById('app-viewport');
  const viewMobileBtn = document.getElementById('view-mobile-btn');
  const viewWebBtn = document.getElementById('view-web-btn');

  // Language Elements
  const langEnBtn = document.getElementById('lang-en-btn');
  const langBnBtn = document.getElementById('lang-bn-btn');
  const langQuickToggle = document.getElementById('lang-quick-toggle');
  const langCurrentLabel = document.getElementById('lang-current-label');

  // Modals & Lightbox
  const imageLightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');

  const parichitiModal = document.getElementById('modal-bengali-parichiti');
  const openParichitiBtn = document.getElementById('open-bengali-parichiti-btn');
  const viewBengaliCardBtn = document.getElementById('view-bengali-card-btn');
  const closeParichitiBtn = document.getElementById('close-parichiti-modal-btn');
  const closeParichitiBottomBtn = document.getElementById('close-parichiti-bottom-btn');
  const parichitiBackdrop = document.getElementById('parichiti-backdrop');

  // Navigation Drawer
  const navDrawer = document.getElementById('nav-drawer');
  const hamburgerBtn = document.getElementById('hamburger-menu-btn');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');

  // ===================================================================
  // 2. SCREEN TRANSITIONS CONTROLLER
  // ===================================================================
  function showScreen(screenId) {
    state.previousScreen = state.currentScreen;
    state.currentScreen = screenId;

    Object.values(screens).forEach(screen => {
      if (screen) {
        screen.classList.remove('active');
        if (screen === screens.lounge) {
          screen.style.display = 'none';
        }
      }
    });

    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      if (target === screens.lounge) {
        target.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const hud = document.getElementById('auto-tour-hud');
        if (hud) hud.style.display = 'flex';
        if (typeof startAutoTour === 'function') startAutoTour();
      } else {
        const hud = document.getElementById('auto-tour-hud');
        if (hud) hud.style.display = 'none';
        if (typeof stopAutoTour === 'function') stopAutoTour();
      }
    }
  }

  // Screen 1 -> Screen 2: ENTER WEDDING LOUNGE
  const enterWelcomeBtn = document.getElementById('btn-enter-welcome');
  if (enterWelcomeBtn) {
    enterWelcomeBtn.addEventListener('click', () => {
      playAudio();
      showScreen('screen-welcome');
    });
  }

  // Screen 2 -> Screen 3: VIEW BOARDING PASS
  const enterBoardingPassBtn = document.getElementById('btn-enter-boarding-pass');
  if (enterBoardingPassBtn) {
    enterBoardingPassBtn.addEventListener('click', () => {
      playAudio();
      showScreen('screen-boarding-pass');
    });
  }

  // Screen 3 -> Screen 4: ACCEPT MY BOARDING PASS
  const acceptPassBtn = document.getElementById('btn-accept-boarding-pass');
  if (acceptPassBtn) {
    acceptPassBtn.addEventListener('click', () => {
      playAudio();
      triggerConfettiBurst(window.innerWidth / 2, window.innerHeight / 2);
      showScreen('screen-boarding-confirmed');
    });
  }

  // Screen 3 Back Button
  const bpBackBtn = document.getElementById('bp-back-btn');
  if (bpBackBtn) {
    bpBackBtn.addEventListener('click', () => {
      showScreen(state.previousScreen || 'screen-welcome');
    });
  }

  const bpInfoBtn = document.getElementById('bp-info-btn');
  if (bpInfoBtn) {
    bpInfoBtn.addEventListener('click', () => {
      showToast('Flight AA 1412 • Departure: 14 Dec 2026 Evening • Nirmala Mata Maria Girza');
    });
  }

  // Screen 4 -> Main Lounge: PROCEED TO LOUNGE
  const proceedBtn = document.getElementById('btn-proceed-to-lounge');
  if (proceedBtn) {
    proceedBtn.addEventListener('click', () => {
      showScreen('screen-wedding-lounge');
    });
  }

  // Quick Re-open Boarding Pass
  const guestTicketQuickviewBtn = document.getElementById('guest-ticket-quickview-btn');
  const heroViewBoardingBtn = document.getElementById('hero-view-boarding-btn');
  const drawerReopenPassBtn = document.getElementById('drawer-reopen-boarding-pass');

  [guestTicketQuickviewBtn, heroViewBoardingBtn, drawerReopenPassBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        closeDrawer();
        showScreen('screen-boarding-pass');
      });
    }
  });

  // ===================================================================
  // 3. AUDIO MUSIC CONTROLLER (User-triggered only)
  // ===================================================================
  function playAudio() {
    if (!audioEl) return;
    audioEl.play().then(() => {
      state.isAudioPlaying = true;
      updateAudioUI();
    }).catch(err => {
      console.log('Audio autoplay prevented by browser policy until interaction', err);
    });
  }

  function pauseAudio() {
    if (!audioEl) return;
    audioEl.pause();
    state.isAudioPlaying = false;
    updateAudioUI();
  }

  function toggleAudio() {
    if (state.isAudioPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  function updateAudioUI() {
    const icon = state.isAudioPlaying ? '🔊' : '🔈';
    const topIcon = document.getElementById('audio-icon');
    const welcomeIcon = document.getElementById('welcome-sound-icon');
    const loungeIcon = document.getElementById('lounge-sound-icon');

    if (topIcon) topIcon.textContent = icon;
    if (welcomeIcon) welcomeIcon.textContent = icon;
    if (loungeIcon) loungeIcon.textContent = icon;

    if (audioWave) {
      if (state.isAudioPlaying) {
        audioWave.classList.remove('paused');
      } else {
        audioWave.classList.add('paused');
      }
    }
  }

  if (audioToggleBtn) audioToggleBtn.addEventListener('click', toggleAudio);
  if (welcomeAudioBtn) welcomeAudioBtn.addEventListener('click', toggleAudio);
  if (loungeAudioBtn) loungeAudioBtn.addEventListener('click', toggleAudio);

  // ===================================================================
  // 4. LIVE COUNTDOWN TIMER (14 DEC 2026 EVENING)
  // ===================================================================
  // Reception Date: 14th December 2026 Evening (18:00:00 IST / UTC 12:30:00)
  const targetDepartureDate = new Date('2026-12-14T18:00:00+05:30').getTime();

  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDepartureDate - now;

    if (distance <= 0) {
      if (cdDays) cdDays.textContent = '00';
      if (cdHours) cdHours.textContent = '00';
      if (cdMinutes) cdMinutes.textContent = '00';
      if (cdSeconds) cdSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
    if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
    if (cdMinutes) cdMinutes.textContent = String(minutes).padStart(2, '0');
    if (cdSeconds) cdSeconds.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ===================================================================
  // 5. BILINGUAL TRANSLATION ENGINE (ENGLISH <-> BENGALI)
  // ===================================================================
  const translations = {
    en: {
      journey_to_forever: 'THE JOURNEY TO FOREVER',
      journey_begins_here: 'YOUR JOURNEY BEGINS HERE',
      enter_wedding_lounge: 'ENTER WEDDING LOUNGE',
      touch_to_enter: 'TOUCH TO OPEN INVITATION',
      tap_hint: 'Tap above to board the wedding flight',
      dear_guest: 'Dear Guest,',
      seat_reserved: 'Your seat has been reserved for a very special journey.',
      one_dest: 'One destination.',
      one_life: 'One lifetime.',
      one_journey: 'One beautiful journey.',
      view_boarding_pass: 'VIEW BOARDING PASS',
      collect_pass: 'COLLECT YOUR OFFICIAL TICKET',
      ticket_ready_hint: 'Your personalized boarding pass is ready',
      auto_tour_on: 'AUTO TOUR',
      auto_tour_paused: 'AUTO TOUR: PAUSED',
      back: 'Back',
      wedding_reception_pass: 'WEDDING RECEPTION',
      boarding_pass_label: 'BOARDING PASS',
      from: 'FROM',
      to: 'TO',
      passenger: 'PASSENGER',
      flight: 'FLIGHT',
      date: 'DATE',
      boarding: 'BOARDING',
      gate: 'GATE',
      seat: 'SEAT',
      destination: 'DESTINATION',
      status: 'STATUS',
      accept_boarding_pass: 'ACCEPT MY BOARDING PASS ✈',
      confirm_boarding_sub: 'TAP TO CONFIRM SEAT & ENTER LOUNGE',
      boarding_confirmed_title: 'BOARDING CONFIRMED ✓',
      get_ready_lounge: 'Entering the Wedding Lounge...',
      proceed_btn: 'PROCEED TO LOUNGE ➔',
      nav_home: 'HOME',
      nav_story: 'OUR STORY',
      nav_photos: 'PHOTOS',
      nav_destination: 'DESTINATION',
      sanskrit_invocation: 'শ্রীশ্রী প্রজাপতয়ে নমঃ',
      destination_forever: 'DESTINATION: FOREVER',
      journey_begins: 'THE JOURNEY BEGINS',
      wedding_lounge_title: 'WELCOME TO THE WEDDING LOUNGE',
      hero_wedding_reception: 'WEDDING RECEPTION',
      event_date_hero: 'Monday, 14th December 2026 • Evening',
      view_destination_btn: 'View Destination & Map',
      next_departure: 'NEXT DEPARTURE',
      departure_date: '14 December 2026',
      departure_time: '(Evening • IST)',
      days: 'DAYS',
      hours: 'HOURS',
      minutes: 'MINUTES',
      seconds: 'SECONDS',
      journey_begins_soon: 'The journey to forever begins soon...',
      meet_the_passengers: 'MEET THE PASSENGERS',
      passengers_quote: '"Two families. Two journeys. One destination."',
      meet_captain: 'MEET YOUR CAPTAIN',
      meet_destination: 'MEET YOUR DESTINATION',
      two_stories: 'TWO STORIES. ONE JOURNEY. ONE FOREVER.',
      son_of: 'Son of:',
      daughter_of: 'Daughter of:',
      sister_and_bil: 'Sister & Brother-in-law:',
      niece_nephew: 'Niece & Nephew:',
      sister: 'Sister:',
      paternal_aunt: 'Paternal Aunt:',
      residence: 'Residence:',
      view_bengali_parichiti: 'View Traditional Bengali Parichiti (পরিচিতি)',
      our_journey: 'OUR JOURNEY',
      journey_subtitle: 'Flight Log: From the first spark to forever',
      ch_01_title: 'THE FIRST HELLO',
      ch_01_desc: 'Where two souls first cross paths and the universe aligns.',
      ch_02_title: 'THE JOURNEY',
      ch_02_desc: 'Running hand in hand through the timeless streets of Kolkata.',
      ch_03_title: 'THE MEMORIES',
      ch_03_desc: 'Exchanging rings, shared laughter, and moments etched in gold.',
      ch_04_title: 'THE PROMISE',
      ch_04_desc: 'The sacred union of two families, bound by heartfelt vows.',
      ch_05_title: 'THE FOREVER',
      ch_05_desc: 'Two lives joining into one infinite voyage across eternity.',
      photo_story_title: 'EDITORIAL PHOTO STORY',
      photo_story_desc: 'Cinematic moments captured on the journey of Arnab & Aratrika',
      official_invitation: 'OFFICIAL WEDDING INVITATION',
      invitation_card_desc: 'Preserving the sacred traditions and wordings of our physical card',
      card_request_text: 'cordially request the pleasure of your gracious presence and blessings on the auspicious occasion of the',
      wedding_reception: 'Wedding Reception',
      of_their_son: 'of their son',
      with: 'with',
      card_cover_title: 'Card Cover (গৃহলক্ষ্মী বরণ)',
      card_bengali_title: 'Bengali Invitation Card',
      card_english_title: 'English Invitation Card',
      tagore_poem_title: 'Tagore Wedding Benediction',
      final_destination: 'FINAL DESTINATION',
      venue_card_subtitle: 'Official Reception Venue as stated in invitation',
      venue_name: 'NIRMALA MATA MARIA GIRZA',
      venue_address: '193/2, Andul Road, Danesh Shaikh Lane, Howrah – 711109',
      open_google_maps: 'OPEN GOOGLE MAPS',
      get_directions: 'GET DIRECTIONS',
      call_contact: 'CALL : 8013901890',
      bus_route_label: 'BUS ROUTE:',
      bus_route_text: 'From Howrah Station take a bus towards: Andul / Alampur / Bakultala / Danesh Sheikh Lane and other buses on these routes.',
      nearest_bus_stop_label: 'NEAREST BUS STOP:',
      nearest_bus_stop_val: 'Danesh Sheikh Lane',
      save_the_date: 'SAVE THE DATE',
      calendar_desc: 'Add this event to your calendar so you never miss it!',
      calendar_day: 'MONDAY',
      calendar_full_date: '14 DECEMBER 2026',
      calendar_timing: 'EVENING',
      add_google_calendar: 'ADD TO GOOGLE CALENDAR',
      download_ics_file: 'DOWNLOAD .ICS CALENDAR EVENT',
      share_invitation: 'SHARE OUR INVITATION',
      copy_link: 'Copy Link',
      flight_may_end: 'THE FLIGHT MAY END...',
      journey_begins_line: '...BUT THE JOURNEY BEGINS.',
      see_you_destination: 'SEE YOU AT THE DESTINATION ❤️',
      part_of_journey: 'Thank you for being part of our journey.',
      with_love: 'With love,',
      the_families: 'The Mondal & Das Families',
    },
    bn: {
      journey_to_forever: 'চিরন্তন যাত্রার সূচনা',
      journey_begins_here: 'আপনার শুভযাত্রার সূচনা এখানে',
      enter_wedding_lounge: 'বিবাহ লাউঞ্জে প্রবেশ করুন',
      touch_to_enter: 'আমন্ত্রণপত্র খুলতে স্পর্শ করুন',
      tap_hint: 'বিবাহের উড়ানে যোগ দিতে ওপরে স্পর্শ করুন',
      dear_guest: 'সুপ্রিয় অতিথি,',
      seat_reserved: 'একটি অতি বিশেষ যাত্রায় আপনার আসন সংরক্ষিত হয়েছে।',
      one_dest: 'একটি গন্তব্য।',
      one_life: 'একটি জীবন।',
      one_journey: 'একটি অপরূপ যাত্রা।',
      view_boarding_pass: 'বোর্ডিং পাস দেখুন',
      collect_pass: 'আপনার অফিশিয়াল বোর্ডিং পাস সংগ্রহ করুন',
      ticket_ready_hint: 'আপনার বিশেষ বোর্ডিং পাস প্রস্তুত',
      auto_tour_on: 'স্বয়ংক্রিয় ভ্রমণ',
      auto_tour_paused: 'ভ্রমণ স্থগিত',
      back: 'পিছনে',
      wedding_reception_pass: 'বিবাহোত্তর প্রীতিভোজ',
      boarding_pass_label: 'ডিজিটাল বোর্ডিং পাস',
      from: 'প্রস্থান',
      to: 'গন্তব্য',
      passenger: 'যাত্রী',
      flight: 'ফ্লাইট',
      date: 'তারিখ',
      boarding: 'বোর্ডিং',
      gate: 'গেট',
      seat: 'আসন',
      destination: 'গন্তব্য',
      status: 'স্থিতি',
      accept_boarding_pass: 'বোর্ডিং পাস গ্রহণ করুন ✈',
      confirm_boarding_sub: 'আসন নিশ্চিত করে লাউঞ্জে প্রবেশ করুন',
      boarding_confirmed_title: 'বোর্ডিং নিশ্চিত হয়েছে ✓',
      get_ready_lounge: 'বিবাহ লাউঞ্জে প্রবেশ করা হচ্ছে...',
      proceed_btn: 'লাউঞ্জে প্রবেশ করুন ➔',
      nav_home: 'হোম',
      nav_story: 'আমাদের প্রেমগাথা',
      nav_photos: 'ফটো অ্যালবাম',
      nav_destination: 'গন্তব্য ও পথনির্দেশ',
      sanskrit_invocation: 'শ্রীশ্রী প্রজাপতয়ে নমঃ',
      destination_forever: 'গন্তব্য: অনন্ত প্রেম',
      journey_begins: 'শুভযাত্রার সূচনা',
      wedding_lounge_title: 'বিবাহ লাউঞ্জে আপনাদের স্বাগত',
      hero_wedding_reception: 'শুভ বিবাহোত্তর প্রীতিভোজ',
      event_date_hero: 'সোমবার, ১৪ই ডিসেম্বর ২০২৬ • সন্ধ্যায়',
      view_destination_btn: 'গন্তব্য ও মানচিত্র দেখুন',
      next_departure: 'পরবর্তী প্রস্থান',
      departure_date: '১৪ই ডিসেম্বর ২০২৬',
      departure_time: '(সন্ধ্যায় • ভারতীয় সময়)',
      days: 'দিন',
      hours: 'ঘণ্টা',
      minutes: 'মিনিট',
      seconds: 'সেকেন্ড',
      journey_begins_soon: 'অনন্ত জীবনের শুভযাত্রা শুরু হতে চলেছে...',
      meet_the_passengers: 'যাত্রীদের পরিচিতি',
      passengers_quote: '"দুটি পরিবার। দুটি পথ। একটি গন্তব্য।"',
      meet_captain: 'আপনার ক্যাপ্টেন',
      meet_destination: 'আপনার গন্তব্য',
      two_stories: 'দুটি জীবনগাথা। একটি পথচলা। একটি চিরন্তন বন্ধন।',
      son_of: 'পিতা-মাতা:',
      daughter_of: 'পিতা-মাতা:',
      sister_and_bil: 'দিদি ও জামাইবাবু:',
      niece_nephew: 'ভাগ্নী ও ভাগ্না:',
      sister: 'বোন:',
      paternal_aunt: 'পিসি:',
      residence: 'নিবাস:',
      view_bengali_parichiti: 'সম্পূর্ণ বাংলা পরিচিতি ও স্মারকলিপি দেখুন',
      our_journey: 'আমাদের পথচলা',
      journey_subtitle: 'প্রথম দেখা থেকে অনন্ত জীবনের উড়ান',
      ch_01_title: 'প্রথম দেখা',
      ch_01_desc: 'যেখানে দুটি হৃদয়ের প্রথম মেলবন্ধন ঘটেছিল।',
      ch_02_title: 'আমাদের যাত্রা',
      ch_02_desc: 'কলকাতার বুকে হাতে হাত রেখে ছুটে চলা।',
      ch_03_title: 'মধুর স্মৃতি',
      ch_03_desc: 'আংটি বদল, হাসিমাখা দিন আর সোনার অক্ষরে লেখা মুহূর্ত।',
      ch_04_title: 'পবিত্র অঙ্গীকার',
      ch_04_desc: 'দুই পরিবারের শুভ আশীর্বাদ ও পরিণয়ের বন্ধন।',
      ch_05_title: 'অনন্তের সূচনা',
      ch_05_desc: 'চিরজীবনের জন্য এক অবিচ্ছেদ্য মহাযাত্রা।',
      photo_story_title: 'স্মৃতিমধুর অ্যালবাম',
      photo_story_desc: 'অর্ণব ও আরত্রিকার যাত্রার অপরূপ মুহূর্তমালা',
      official_invitation: 'আনুষ্ঠানিক নিমন্ত্রণপত্র',
      invitation_card_desc: 'আমাদের মূল শারীরিক নিমন্ত্রণপত্রের হুবহু বাণী ও শ্রদ্ধাঞ্জলি',
      card_request_text: 'আমাদের একমাত্র পুত্র অর্ণবের সহিত কল্যাণীয়া আরত্রিকার শুভ বিবাহোত্তর প্রীতিভোজে আপনাদের সাদর উপস্থিতি ও আশীর্বাদ প্রার্থনা করি।',
      wedding_reception: 'শুভ প্রীতিভোজ',
      of_their_son: 'আমাদের সুপুত্র',
      with: 'সহিত',
      card_cover_title: 'কার্ডের প্রচ্ছদ (গৃহলক্ষ্মী বরণ)',
      card_bengali_title: 'বাংলা নিমন্ত্রণপত্র',
      card_english_title: 'ইংরেজি নিমন্ত্রণপত্র',
      tagore_poem_title: 'রবীন্দ্রনাথ ঠাকুরের আশীর্বাণী',
      final_destination: 'চূড়ান্ত গন্তব্য',
      venue_card_subtitle: 'নিমন্ত্রণপত্রে উল্লিখিত আনুষ্ঠানিক প্রীতিভোজের স্থান',
      venue_name: 'নির্মলা মাতা মারিয়া গির্জা',
      venue_address: '১৯৩/২, আন্দুল রোড, দানেশ শেখ লেন, হাওড়া – ৭১১১০৯',
      open_google_maps: 'গুগল ম্যাপে দেখুন',
      get_directions: 'দিকনির্দেশনা পান',
      call_contact: 'যোগাযোগ : ৮০১৩৯০১৮৯০',
      bus_route_label: 'বাস রুট:',
      bus_route_text: 'হাওড়া স্টেশন থেকে বাস: আন্দুল / আলমপুর / বকুলতলা / দানেশ শেখ লেন গামী বাস স্টপেজ: দানেশ শেখ লেন।',
      nearest_bus_stop_label: 'নিকটবর্তী বাস স্টপ:',
      nearest_bus_stop_val: 'দানেশ শেখ লেন',
      save_the_date: 'তারিখটি স্মরণ রাখুন',
      calendar_desc: 'আপনার ক্যালেন্ডারে যুক্ত করুন যাতে দিনটি ভুলে না যান!',
      calendar_day: 'সোমবার',
      calendar_full_date: '১৪ই ডিসেম্বর ২০২৬',
      calendar_timing: 'সন্ধ্যায়',
      add_google_calendar: 'গুগল ক্যালেন্ডারে যোগ করুন',
      download_ics_file: 'ICS ক্যালেন্ডার ডাউনলোড করুন',
      share_invitation: 'নিমন্ত্রণপত্রটি শেয়ার করুন',
      copy_link: 'লিংক কপি করুন',
      flight_may_end: 'উড়ান হয়তো সমাপ্ত হবে...',
      journey_begins_line: '...কিন্তু ভালোবাসার যাত্রা অনন্ত।',
      see_you_destination: 'দেখা হবে গন্তব্যে ❤️',
      part_of_journey: 'আমাদের শুভযাত্রার অংশ হওয়ার জন্য ধন্যবাদ।',
      with_love: 'বিনীত,',
      the_families: 'মণ্ডল ও দাস পরিবারবর্গ',
    }
  };

  function setLanguage(lang) {
    state.currentLang = lang;
    const dict = translations[lang] || translations.en;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    if (langEnBtn && langBnBtn) {
      if (lang === 'en') {
        langEnBtn.classList.add('active');
        langBnBtn.classList.remove('active');
        if (langCurrentLabel) langCurrentLabel.textContent = 'বাংলা';
      } else {
        langEnBtn.classList.remove('active');
        langBnBtn.classList.add('active');
        if (langCurrentLabel) langCurrentLabel.textContent = 'EN';
      }
    }
  }

  if (langEnBtn) langEnBtn.addEventListener('click', () => setLanguage('en'));
  if (langBnBtn) langBnBtn.addEventListener('click', () => setLanguage('bn'));
  if (langQuickToggle) {
    langQuickToggle.addEventListener('click', () => {
      setLanguage(state.currentLang === 'en' ? 'bn' : 'en');
    });
  }

  // ===================================================================
  // 6. VIEW MODE CONTROLLER (Mobile Frame vs Grand Web Portal)
  // ===================================================================
  if (viewMobileBtn && viewWebBtn) {
    viewMobileBtn.addEventListener('click', () => {
      appViewport.classList.remove('mode-web');
      appViewport.classList.add('mode-mobile');
      viewMobileBtn.classList.add('active');
      viewWebBtn.classList.remove('active');
      showToast('Switched to Mobile View');
    });

    viewWebBtn.addEventListener('click', () => {
      appViewport.classList.remove('mode-mobile');
      appViewport.classList.add('mode-web');
      viewWebBtn.classList.add('active');
      viewMobileBtn.classList.remove('active');
      showToast('Switched to Grand Portal View');
    });
  }

  // ===================================================================
  // 7. NAVIGATION DRAWER & 4 TABS SCROLL
  // ===================================================================
  function openDrawer() {
    if (navDrawer) navDrawer.classList.add('open');
  }

  function closeDrawer() {
    if (navDrawer) navDrawer.classList.remove('open');
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);

  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
      if (state.currentScreen !== 'screen-wedding-lounge') {
        showScreen('screen-wedding-lounge');
      }
    });
  });

  const navLogoBtn = document.getElementById('nav-logo-btn');
  if (navLogoBtn) {
    navLogoBtn.addEventListener('click', () => {
      const hero = document.getElementById('section-hero');
      if (hero) hero.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 4 Horizontal Tabs: HOME, OUR STORY, PHOTOS, DESTINATION
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = tab.getAttribute('data-target');
      const targetSec = document.getElementById(targetId);
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth' });
        navTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      }
    });
  });

  // ===================================================================
  // 8. FULLSCREEN LIGHTBOX, BOARDING PASS PHOTO CONTROLLER & MODALS
  // ===================================================================
  // Boarding Pass Photo Fit Toggle (Full Photo vs Fill Frame)
  const btnToggleTicketFit = document.getElementById('btn-toggle-ticket-fit');
  const ticketCoupleImg = document.getElementById('ticket-couple-img');
  const fitLabel = document.getElementById('fit-label');
  const fitIcon = document.getElementById('fit-icon');

  let isFillMode = false;
  if (btnToggleTicketFit && ticketCoupleImg) {
    btnToggleTicketFit.addEventListener('click', (e) => {
      e.stopPropagation(); // Don't trigger lightbox when toggling fit/fill
      isFillMode = !isFillMode;
      if (isFillMode) {
        ticketCoupleImg.classList.add('mode-fill');
        if (fitLabel) fitLabel.textContent = state.currentLang === 'bn' ? 'ফ্রেম পূরণ' : 'Fill Frame';
        if (fitIcon) fitIcon.textContent = '⊡';
        showToast(state.currentLang === 'bn' ? 'ফ্রেমে পূর্ণ দৃশ্য' : 'Switched to Fill Frame');
      } else {
        ticketCoupleImg.classList.remove('mode-fill');
        if (fitLabel) fitLabel.textContent = state.currentLang === 'bn' ? 'সম্পূর্ণ ছবি' : 'Full Photo';
        if (fitIcon) fitIcon.textContent = '⛶';
        showToast(state.currentLang === 'bn' ? 'সম্পূর্ণ ছবি দৃশ্য' : 'Showing 100% Full Photo');
      }
    });
  }

  document.querySelectorAll('[data-photo], .gallery-card-item, .editorial-feature-item, .editorial-card-item').forEach(item => {
    item.addEventListener('click', () => {
      const photoSrc = item.getAttribute('data-photo') || item.getAttribute('data-full');
      const caption = item.querySelector('.waypoint-title, .editorial-title, .editorial-sub-title, strong')?.textContent || 'Arnab & Aratrika — The Journey to Forever';
      if (photoSrc && imageLightbox && lightboxImg) {
        lightboxImg.src = photoSrc;
        if (lightboxCaption) lightboxCaption.textContent = caption;
        imageLightbox.classList.add('open');
      }
    });
  });

  function closeLightbox() {
    if (imageLightbox) imageLightbox.classList.remove('open');
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  // Bengali Parichiti Modal
  function openParichiti() {
    if (parichitiModal) parichitiModal.classList.add('open');
  }

  function closeParichiti() {
    if (parichitiModal) parichitiModal.classList.remove('open');
  }

  if (openParichitiBtn) openParichitiBtn.addEventListener('click', openParichiti);
  if (viewBengaliCardBtn) viewBengaliCardBtn.addEventListener('click', openParichiti);
  if (closeParichitiBtn) closeParichitiBtn.addEventListener('click', closeParichiti);
  if (closeParichitiBottomBtn) closeParichitiBottomBtn.addEventListener('click', closeParichiti);
  if (parichitiBackdrop) parichitiBackdrop.addEventListener('click', closeParichiti);

  // ===================================================================
  // 9. CALENDAR INTEGRATION (GOOGLE CALENDAR & DIRECT .ICS DOWNLOAD)
  // ===================================================================
  const btnGoogleCal = document.getElementById('btn-add-google-cal');
  const btnDownloadIcs = document.getElementById('btn-download-ics');

  const eventMeta = {
    title: 'Wedding Reception of Arnab & Aratrika (Arnab & Aratrika Airlines)',
    description: 'Cordially invite you to celebrate the Wedding Reception of Arnab & Aratrika. Venue: Nirmala Mata Maria Girza, 193/2, Andul Road, Danesh Shaikh Lane, Howrah - 711109. Contact: 8013901890.',
    location: 'Nirmala Mata Maria Girza, 193/2, Andul Road, Danesh Shaikh Lane, Howrah - 711109',
    startUTC: '20261214T123000Z', // 18:00 IST
    endUTC: '20261214T173000Z',   // 23:00 IST
  };

  function openGoogleCalendar() {
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventMeta.title)}&dates=${eventMeta.startUTC}/${eventMeta.endUTC}&details=${encodeURIComponent(eventMeta.description)}&location=${encodeURIComponent(eventMeta.location)}`;
    window.open(url, '_blank');
  }

  function downloadIcsFile() {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Arnab and Aratrika Airlines//Wedding Invitation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:aa-1412-wedding-20261214@arnab-aratrika.airlines`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${eventMeta.startUTC}`,
      `DTEND:${eventMeta.endUTC}`,
      `SUMMARY:${eventMeta.title}`,
      `DESCRIPTION:${eventMeta.description}`,
      `LOCATION:${eventMeta.location}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT24H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder: Arnab & Aratrika Wedding Reception Tomorrow!',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Arnab_Aratrika_Wedding_AA1412.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded Arnab_Aratrika_Wedding_AA1412.ics');
  }

  if (btnGoogleCal) btnGoogleCal.addEventListener('click', openGoogleCalendar);
  if (btnDownloadIcs) btnDownloadIcs.addEventListener('click', downloadIcsFile);

  // ===================================================================
  // 10. SOCIAL SHARING & WHATSAPP
  // ===================================================================
  const btnShareWhatsapp = document.getElementById('btn-share-whatsapp');
  const btnCopyLink = document.getElementById('btn-copy-link');

  const shareText = `✈️ Your boarding pass to ARNAB × ARATRIKA's wedding is ready.\n\nJoin us on our journey to forever.\n\n14 December 2026\n\n${window.location.href}`;

  if (btnShareWhatsapp) {
    btnShareWhatsapp.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  }

  if (btnCopyLink) {
    btnCopyLink.addEventListener('click', () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast('Invitation link copied to clipboard! 📋');
        }).catch(() => {
          fallbackCopyText(window.location.href);
        });
      } else {
        fallbackCopyText(window.location.href);
      }
    });
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('Invitation link copied! 📋');
    } catch (err) {
      showToast('Copy link error');
    }
    document.body.removeChild(textArea);
  }

  // Toast Notification
  const toastEl = document.getElementById('toast-notification');
  let toastTimer = null;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3500);
  }

  // ===================================================================
  // 11. AMBIENT SPARKLES & CONFETTI CELEBRATION
  // ===================================================================
  const canvas = document.getElementById('sparkle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const maxParticles = 35;

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.7 + 0.2,
        speedY: -(Math.random() * 0.4 + 0.1),
        speedX: (Math.random() - 0.5) * 0.3,
        pulse: Math.random() * 0.02 + 0.01
      });
    }

    function renderSparkles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.alpha += Math.sin(Date.now() * p.pulse) * 0.01;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(243, 208, 105, ${Math.max(0.1, Math.min(0.8, p.alpha))})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#D4AF37';
        ctx.fill();
      });

      requestAnimationFrame(renderSparkles);
    }

    renderSparkles();
  }

  // Confetti Burst Helper
  function triggerConfettiBurst(originX, originY) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const confettiColors = ['#F5E0A3', '#D4AF37', '#7A1124', '#ffffff', '#e74c3c', '#00d2d3'];
    const burstParticles = [];

    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      burstParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 7 + 4,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        life: 1,
        decay: Math.random() * 0.02 + 0.015,
      });
    }

    function animateBurst() {
      burstParticles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.rotation += p.rotationSpeed;
        p.life -= p.decay;

        if (p.life > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        } else {
          burstParticles.splice(idx, 1);
        }
      });

      if (burstParticles.length > 0) {
        requestAnimationFrame(animateBurst);
      }
    }

    animateBurst();
  }

  // ===================================================================
  // 10. AUTOMATIC SCROLLER / AUTO-TOUR ENGINE (3-5s PER SECTION)
  // ===================================================================
  const autoTourHud = document.getElementById('auto-tour-hud');
  const btnToggleAutoTour = document.getElementById('btn-toggle-auto-tour');
  const tourIcon = document.getElementById('tour-icon');
  const tourLabel = document.getElementById('tour-label');
  const tourCountdownVal = document.getElementById('tour-countdown-val');

  const tourSections = [
    'section-hero',
    'section-countdown',
    'section-passengers',
    'section-journey',
    'section-editorial',
    'section-card',
    'section-destination',
    'section-calendar',
    'section-share',
    'section-finale'
  ];

  let tourCurrentIndex = 0;
  let tourRemainingSec = 4; // 4 seconds per section (within requested 3-5 sec)
  let tourTimer = null;
  let isTourActive = true;
  let isUserInteracting = false;
  let userInactivityTimeout = null;

  function updateTourHUD() {
    if (!btnToggleAutoTour) return;
    const dict = translations[state.currentLang] || translations.en;
    if (isTourActive && !isUserInteracting) {
      btnToggleAutoTour.classList.remove('paused');
      btnToggleAutoTour.classList.add('active');
      if (tourIcon) tourIcon.textContent = '⏸';
      if (tourLabel) tourLabel.textContent = dict.auto_tour_on || 'AUTO TOUR';
      if (tourCountdownVal) tourCountdownVal.textContent = tourRemainingSec;
    } else {
      btnToggleAutoTour.classList.remove('active');
      btnToggleAutoTour.classList.add('paused');
      if (tourIcon) tourIcon.textContent = '▶';
      if (tourLabel) tourLabel.textContent = dict.auto_tour_paused || 'AUTO TOUR: PAUSED';
      if (tourCountdownVal) tourCountdownVal.textContent = '❚❚';
    }
  }

  function scrollToLoungeSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (!target) return;

    const lounge = document.getElementById('screen-wedding-lounge');
    const isLoungeInternal = lounge && (lounge.scrollHeight > lounge.clientHeight + 20) && (window.getComputedStyle(lounge).overflowY !== 'visible');

    if (isLoungeInternal) {
      const loungeRect = lounge.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const targetTop = targetRect.top - loungeRect.top + lounge.scrollTop - 75;
      lounge.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
    } else {
      const rect = target.getBoundingClientRect();
      const targetTop = rect.top + window.pageYOffset - 75;
      window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
    }

    // Sync active state on horizontal navigation tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
      const tabTarget = tab.getAttribute('data-target');
      if (tabTarget === sectionId) {
        navTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      } else if (sectionId === 'section-hero' && tabTarget === 'section-hero') {
        tab.classList.add('active');
      } else if (sectionId === 'section-journey' && tabTarget === 'section-journey') {
        tab.classList.add('active');
      } else if (sectionId === 'section-editorial' && tabTarget === 'section-gallery') {
        tab.classList.add('active');
      } else if (sectionId === 'section-destination' && tabTarget === 'section-destination') {
        tab.classList.add('active');
      }
    });
  }

  function stepAutoTour() {
    if (!isTourActive || isUserInteracting || state.currentScreen !== 'screen-wedding-lounge') {
      return;
    }

    tourRemainingSec -= 1;
    if (tourRemainingSec <= 0) {
      tourCurrentIndex = (tourCurrentIndex + 1) % tourSections.length;
      scrollToLoungeSection(tourSections[tourCurrentIndex]);
      tourRemainingSec = 4; // 4s for next section
    }

    updateTourHUD();
  }

  function startAutoTour() {
    stopAutoTour();
    tourRemainingSec = 4;
    isTourActive = true;
    isUserInteracting = false;
    updateTourHUD();
    tourTimer = setInterval(stepAutoTour, 1000);
  }

  function stopAutoTour() {
    if (tourTimer) {
      clearInterval(tourTimer);
      tourTimer = null;
    }
  }

  function toggleAutoTour() {
    if (isTourActive) {
      isTourActive = false;
      stopAutoTour();
      updateTourHUD();
      showToast(state.currentLang === 'bn' ? 'স্বয়ংক্রিয় ভ্রমণ স্থগিত করা হয়েছে' : 'Auto Tour Paused');
    } else {
      isTourActive = true;
      isUserInteracting = false;
      startAutoTour();
      showToast(state.currentLang === 'bn' ? 'স্বয়ংক্রিয় ভ্রমণ চালু হয়েছে (৪ সে./বিভাগ)' : 'Auto Tour Started (4s per section)');
    }
  }

  if (btnToggleAutoTour) {
    btnToggleAutoTour.addEventListener('click', toggleAutoTour);
  }

  // Handle user touch/scroll: gently pause auto-tour during manual interaction and resume after 5s
  function onUserManualInteraction() {
    if (!isTourActive || state.currentScreen !== 'screen-wedding-lounge') return;
    isUserInteracting = true;
    updateTourHUD();

    if (userInactivityTimeout) clearTimeout(userInactivityTimeout);
    userInactivityTimeout = setTimeout(() => {
      isUserInteracting = false;
      tourRemainingSec = 4;
      updateTourHUD();
    }, 5000); // resumes after 5 seconds of inactivity
  }

  const loungeEl = document.getElementById('screen-wedding-lounge');
  if (loungeEl) {
    loungeEl.addEventListener('touchstart', onUserManualInteraction, { passive: true });
    loungeEl.addEventListener('wheel', onUserManualInteraction, { passive: true });
  }
  window.addEventListener('wheel', onUserManualInteraction, { passive: true });
  window.addEventListener('touchstart', onUserManualInteraction, { passive: true });

  // Initial check: if lounge is already active on load, show HUD and start
  if (state.currentScreen === 'screen-wedding-lounge') {
    if (autoTourHud) autoTourHud.style.display = 'flex';
    startAutoTour();
  }

});
