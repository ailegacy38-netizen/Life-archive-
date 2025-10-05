// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAI5Sn4rTmQ_un5baTyfduewlqaAiOibiQ",
    authDomain: "life-archive-1ed4a.firebaseapp.com",
    projectId: "life-archive-1ed4a",
    storageBucket: "life-archive-1ed4a.firebasestorage.app",
    messagingSenderId: "999843492181",
    appId: "1:999843492181:web:0defdcd915cd6dd4273fdc"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const authService = firebase.auth();
const firestore = firebase.firestore();
const storageService = firebase.storage();
let mediaRecorder = null;
let audioChunks = [];
let audioBlob = null;
let recordingTimerInterval = null;
let recordingStartTime = 0;
let currentLang = 'en'; // Default language

// Function to display toast notifications
function showToast(message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.classList.add('toast', 'align-items-center', 'text-white', 'border-0');
    if (type === 'success') {
        toast.classList.add('bg-success');
    } else if (type === 'error') {
        toast.classList.add('bg-danger');
    } else {
        toast.classList.add('bg-info');
    }
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    toastContainer.appendChild(toast);
    const bootstrapToast = new bootstrap.Toast(toast, { delay: 3000 });
    bootstrapToast.show();
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

const translations = {
    en: {
        home_title: "Capture Life’s Joyful Moments with Legacy AI",
        home_lead: "Relive the past, celebrate the present, and shape the future with AI-curated happiness. Create Together, Reminisce Forever: Build vibrant digital scrapbooks and happy timelines for generations.",
        get_started_free: "Get Started Free",
        download_joyful_guide: "Download Joyful Memory Guide",
        how_it_works_title: "How Legacy AI Spreads Joy",
        capture_moments_step: "1. Capture Happy Moments",
        capture_moments_desc: "Upload photos, videos, and voice notes of birthdays, trips, and everyday joys.",
        create_adventures_step: "2. Create Family Adventures",
        create_adventures_desc: "AI crafts interactive stories and games starring your loved ones.",
        build_timeline_step: "3. Build a Happy Timeline",
        build_timeline_desc: "Organize milestones into a vibrant digital scrapbook for all to cherish.",
        moments_title: "Moments That Matter",
        moments_intro: "Relive the joy of birthdays, family trips, inside jokes, and everyday moments. Upload your happiest memories to create a digital scrapbook that sparks smiles.",
        upload_photos_title: "Photos of Joy",
        upload_photos_desc: "Share snapshots of laughter and love.",
        record_voice_title: "Voice Notes",
        record_voice_desc: "Capture jokes, songs, or heartfelt messages.",
        share_videos_title: "Happy Videos",
        share_videos_desc: "Upload clips of celebrations and adventures.",
        emotion_tag_placeholder: "Tag emotions or themes (e.g., #joyful, #adventure)",
        upload_now: "Upload Now",
        record_now: "Record Now",
        stop_recording: "Stop Recording",
        upload_failed: "Upload failed:",
        upload_success: "Voice note uploaded successfully! MP3 conversion in progress.",
        mp3_conversion_failed: "Voice note uploaded, but MP3 conversion failed. Playing WebM.",
        microphone_error: "Microphone access denied or unavailable: ",
        challenges_title: "Interactive Family Challenges",
        challenges_intro: "Bring your family closer with fun prompts that create joyful memories. Complete challenges and build a positive archive together!",
        funny_question_title: "Funny Question Challenge",
        funny_question_desc: "Ask your grandparents one hilarious question today and record their answer!",
        dance_off_title: "Family Dance-Off",
        dance_off_desc: "Record a 60-second family dance-off and share the fun!",
        childhood_memory_title: "Childhood Memory Story",
        childhood_memory_desc: "Share a 60-second story of your happiest childhood moment.",
        start_challenge: "Submit Response",
        pricing_title: "Choose Your Joyful Plan",
        pricing_intro: "Start free or unlock premium features to create unforgettable family memories.",
        free_tier_title: "Basic Legacy",
        free_tier_desc: "Limited text & photo archive, AI memory highlights, 5 AI interactions/month.",
        essential_tier_title: "Essential Legacy",
        essential_tier_desc: "Expanded storage, custom AI persona, multi-language support, mood-based search.",
        family_tier_title: "Family Legacy Plus",
        family_tier_desc: "Shared archives, collaborative scrapbooks, unlimited AI interactions, family games.",
        lifetime_tier_title: "Lifetime Legacy Vault",
        lifetime_tier_desc: "Unlimited storage, AI legacy book, priority support, scheduled messages, and **exclusive VIP family support with personalized AI memory curations.**",
        buy_now: "Buy Now",
        one_time_title: "Premium Enhancements",
        one_time_desc: "Add unique features to your joyful legacy.",
        storybook_purchase: "AI Storybook ($99)",
        time_capsule_purchase: "Time Capsule ($49)",
        video_message_purchase: "Legacy Video ($79)",
        business_creator_title: "For Businesses & Creators",
        business_creator_desc: "Preserve brand stories or create unique AI personas.",
        business_plan: "Business Plan: $499/year",
        creator_plan: "Creator Plan: $99 setup + $25/mo",
        community_plan: "Community Vault: $149/year",
        contact_sales: "Contact Sales",
        login_title: "Joyful Portal Login",
        email_label: "Email",
        email_input_placeholder: "Email",
        password_label: "Password",
        password_input_placeholder: "Password",
        login_button: "Login",
        forgot_password: "Forgot Password?",
        email_required: "Please enter your email address.",
        password_reset_sent: "Password reset email sent! Check your inbox.",
        login_required: "Please log in to record a...",
        current_plan: "You're on {{planName}} 💛",
        welcome_user: "Welcome, !", // Added for functionality, placeholder for user name
        happy_timeline_title: "Your Happy Timeline",
        happy_timeline_desc: "Add milestones, firsts, and joyful moments to your digital scrapbook.",
        add_milestone: "Add Milestone",
        bucket_list_title: "Family Bucket List",
        bucket_list_desc: "Set shared goals like trips or fun activities and track progress!",
        add_goal_placeholder: "Add a goal...",
        add_goal: "Add Goal",
        storytelling_mode_title: "AI Storytelling Adventure",
        storytelling_mode_desc: "Your co-pilot in crafting your family’s unique journey, creating fun, fictional stories with your loved ones as heroes!",
        story_characters_label: "Who are the main characters?",
        story_characters_placeholder: "e.g., Mom, Dad, Lily, our dog Sparky",
        story_theme_label: "Choose a theme:",
        select_theme_option: "Select a theme",
        generate_story: "Generate Story",
        challenge_response_title: "Respond to Challenges",
        challenge_response_desc: "View and respond to family challenges.",
        view_challenges: "View Challenges",
        account_settings_title: "Account Settings",
        account_settings_desc: "Manage your profile, subscription, and preferences.",
        manage_settings: "Manage Settings",
        contact_support_title: "Support",
        contact_support_desc: "Get help or provide feedback.",
        contact_us: "Contact Us",
        logout_button: "Logout",
        demo_timeline_title: "Preview a Happy Timeline",
        demo_timeline_desc: "See how Legacy AI brings memories to life!",
        login_to_create: "Login to Create Your Own",
        signup_title: "Sign Up for Joyful Portal",
        signup_button: "Sign Up",
        signup_link: "Sign Up",
        login_link: "Already have an account? Login"
    },
    es: {
        home_title: "Captura los Momentos Alegres de la Vida con Legacy AI",
        home_lead: "Revive el pasado, celebra el presente y moldea el futuro con felicidad curada por IA. Crea Juntos, Recuerda Para Siempre: Construye álbumes digitales vibrantes y líneas de tiempo felices para generaciones.",
        get_started_free: "Comienza Gratis",
        download_joyful_guide: "Descargar Guía de Memoria Alegre",
        how_it_works_title: "Cómo Legacy AI Difunde la Alegría",
        capture_moments_step: "1. Captura Momentos Felices",
        capture_moments_desc: "Sube fotos, videos y notas de voz de cumpleaños, viajes y alegrías cotidianas.",
        create_adventures_step: "2. Crea Aventuras Familiares",
        create_adventures_desc: "IA crea historias interactivas y juegos protagonizados por tus seres queridos.",
        build_timeline_step: "3. Construye una Línea de Tiempo Feliz",
        build_timeline_desc: "Organiza hitos en un álbum digital vibrante para que todos lo atesoren.",
        moments_title: "Momentos Que Importan",
        moments_intro: "Revive la alegría de cumpleaños, viajes familiares, chistes internos y momentos cotidianos. Sube tus recuerdos más felices para crear un álbum digital que provoque sonrisas.",
        upload_photos_title: "Fotos de Alegría",
        upload_photos_desc: "Comparte instantáneas de risas y amor.",
        record_voice_title: "Notas de Voz",
        record_voice_desc: "Captura chistes, canciones o mensajes sinceros.",
        share_videos_title: "Videos Felices",
        share_videos_desc: "Sube clips de celebraciones y aventuras.",
        emotion_tag_placeholder: "Etiqueta emociones o temas (e.g., #alegre, #aventura)",
        upload_now: "Subir Ahora",
        record_now: "Grabar Ahora",
        stop_recording: "Detener Grabación",
        upload_failed: "Subida fallida:",
        upload_success: "Nota de voz subida con éxito! Conversión a MP3 en progreso.",
        mp3_conversion_failed: "Nota de voz subida, pero conversión a MP3 fallida. Reproduciendo WebM.",
        microphone_error: "Acceso al micrófono denegado o no disponible: ",
        challenges_title: "Desafíos Familiares Interactivos",
        challenges_intro: "Acércate a tu familia con prompts divertidos que crean recuerdos alegres. Completa desafíos y construye un archivo positivo juntos!",
        funny_question_title: "Desafío de Pregunta Divertida",
        funny_question_desc: "Pregúntale a tus abuelos una pregunta hilarante hoy y graba su respuesta!",
        dance_off_title: "Baile Familiar",
        dance_off_desc: "Graba un baile familiar de 60 segundos y comparte la diversión!",
        childhood_memory_title: "Historia de Memoria Infantil",
        childhood_memory_desc: "Comparte una historia de 60 segundos de tu momento infantil más feliz.",
        start_challenge: "Enviar Respuesta",
        pricing_title: "Elige Tu Plan Alegre",
        pricing_intro: "Comienza gratis o desbloquea funciones premium para crear recuerdos familiares inolvidables.",
        free_tier_title: "Legacy Básico",
        free_tier_desc: "Archivo limitado de texto y fotos, destacados de memoria IA, 5 interacciones IA/mes.",
        essential_tier_title: "Legacy Esencial",
        essential_tier_desc: "Almacenamiento expandido, persona IA personalizada, soporte multilingüe, búsqueda basada en estado de ánimo.",
        family_tier_title: "Legacy Familiar Plus",
        family_tier_desc: "Archivos compartidos, álbumes colaborativos, interacciones IA ilimitadas, juegos familiares.",
        lifetime_tier_title: "Bóveda de Legacy de Por Vida",
        lifetime_tier_desc: "Almacenamiento ilimitado, libro de legacy IA, soporte prioritario, mensajes programados, y **soporte VIP familiar exclusivo con curaciones de memoria IA personalizadas.**",
        buy_now: "Comprar Ahora",
        one_time_title: "Mejoras Premium",
        one_time_desc: "Agrega características únicas a tu legacy alegre.",
        storybook_purchase: "Libro de Cuentos IA ($99)",
        time_capsule_purchase: "Cápsula del Tiempo ($49)",
        video_message_purchase: "Video de Legacy ($79)",
        business_creator_title: "Para Negocios y Creadores",
        business_creator_desc: "Preserva historias de marca o crea personas IA únicas.",
        business_plan: "Plan de Negocios: $499/año",
        creator_plan: "Plan de Creador: $99 configuración + $25/mes",
        community_plan: "Bóveda Comunitaria: $149/año",
        contact_sales: "Contactar Ventas",
        login_title: "Inicio de Sesión en Portal Alegre",
        email_label: "Correo Electrónico",
        email_input_placeholder: "Correo Electrónico",
        password_label: "Contraseña",
        password_input_placeholder: "Contraseña",
        login_button: "Iniciar Sesión",
        forgot_password: "¿Olvidaste la Contraseña?",
        email_required: "Por favor ingresa tu dirección de correo electrónico.",
        password_reset_sent: "Correo de restablecimiento de contraseña enviado! Revisa tu bandeja de entrada.",
        login_required: "Por favor inicia sesión para grabar un...",
        current_plan: "Estás en {{planName}} 💛",
        welcome_user: "Bienvenido, !",
        happy_timeline_title: "Tu Línea de Tiempo Feliz",
        happy_timeline_desc: "Agrega hitos, primeros y momentos alegres a tu álbum digital.",
        add_milestone: "Agregar Hito",
        bucket_list_title: "Lista de Deseos Familiar",
        bucket_list_desc: "Establece metas compartidas como viajes o actividades divertidas y rastrea el progreso!",
        add_goal_placeholder: "Agregar una meta...",
        add_goal: "Agregar Meta",
        storytelling_mode_title: "Aventura de Narración IA",
        storytelling_mode_desc: "Tu copiloto en la creación del viaje único de tu familia, creando historias ficticias divertidas con tus seres queridos como héroes!",
        story_characters_label: "¿Quiénes son los personajes principales?",
        story_characters_placeholder: "e.g., Mamá, Papá, Lily, nuestro perro Sparky",
        story_theme_label: "Elige un tema:",
        select_theme_option: "Selecciona un tema",
        generate_story: "Generar Historia",
        challenge_response_title: "Responder a Desafíos",
        challenge_response_desc: "Ver y responder a desafíos familiares.",
        view_challenges: "Ver Desafíos",
        account_settings_title: "Configuraciones de Cuenta",
        account_settings_desc: "Gestiona tu perfil, suscripción y preferencias.",
        manage_settings: "Gestionar Configuraciones",
        contact_support_title: "Soporte",
        contact_support_desc: "Obtén ayuda o proporciona retroalimentación.",
        contact_us: "Contáctanos",
        logout_button: "Cerrar Sesión",
        demo_timeline_title: "Vista Previa de una Línea de Tiempo Feliz",
        demo_timeline_desc: "¡Ve cómo Legacy AI da vida a los recuerdos!",
        login_to_create: "Inicia Sesión para Crear Tu Propio",
        signup_title: "Regístrate en el Portal Alegre",
        signup_button: "Regístrate",
        signup_link: "Regístrate",
        login_link: "¿Ya tienes una cuenta? Iniciar Sesión"
    },
    fr: {
        home_title: "Capturez les Moments Joyeux de la Vie avec Legacy AI",
        home_lead: "Revivez le passé, célébrez le présent et façonnez l'avenir avec une bonheur curé par IA. Créez Ensemble, Souvenez-vous Pour Toujours : Construisez des albums numériques vibrants et des chronologies heureuses pour les générations.",
        get_started_free: "Commencer Gratuitement",
        download_joyful_guide: "Télécharger le Guide de Mémoire Joyeuse",
        how_it_works_title: "Comment Legacy AI Diffuse la Joie",
        capture_moments_step: "1. Capturez des Moments Heureux",
        capture_moments_desc: "Téléchargez des photos, vidéos et notes vocales d'anniversaires, voyages et joies quotidiennes.",
        create_adventures_step: "2. Créez des Aventures Familiales",
        create_adventures_desc: "IA crée des histoires interactives et des jeux mettant en vedette vos proches.",
        build_timeline_step: "3. Construisez une Chronologie Heureuse",
        build_timeline_desc: "Organisez les jalons dans un album numérique vibrant pour que tous le chérissent.",
        moments_title: "Moments Qui Comptent",
        moments_intro: "Revivez la joie des anniversaires, voyages familiaux, blagues internes et moments quotidiens. Téléchargez vos souvenirs les plus heureux pour créer un album numérique qui provoque des sourires.",
        upload_photos_title: "Photos de Joie",
        upload_photos_desc: "Partagez des instantanés de rires et d'amour.",
        record_voice_title: "Notes Vocales",
        record_voice_desc: "Capturez des blagues, chansons ou messages sincères.",
        share_videos_title: "Vidéos Heureuses",
        share_videos_desc: "Téléchargez des clips de célébrations et d'aventures.",
        emotion_tag_placeholder: "Taggez des émotions ou thèmes (e.g., #joyeux, #aventure)",
        upload_now: "Télécharger Maintenant",
        record_now: "Enregistrer Maintenant",
        stop_recording: "Arrêter l'Enregistrement",
        upload_failed: "Téléchargement échoué :",
        upload_success: "Note vocale téléchargée avec succès ! Conversion MP3 en cours.",
        mp3_conversion_failed: "Note vocale téléchargée, mais conversion MP3 échouée. Lecture WebM.",
        microphone_error: "Accès au microphone refusé ou indisponible : ",
        challenges_title: "Défis Familiaux Interactifs",
        challenges_intro: "Rapprochez votre famille avec des prompts amusants qui créent des souvenirs joyeux. Complétez des défis et construisez un archive positif ensemble !",
        funny_question_title: "Défi de Question Drôle",
        funny_question_desc: "Posez une question hilarante à vos grands-parents aujourd'hui et enregistrez leur réponse !",
        dance_off_title: "Danse Familiale",
        dance_off_desc: "Enregistrez une danse familiale de 60 secondes et partagez le fun !",
        childhood_memory_title: "Histoire de Souvenir d'Enfance",
        childhood_memory_desc: "Partagez une histoire de 60 secondes de votre moment d'enfance le plus heureux.",
        start_challenge: "Soumettre la Réponse",
        pricing_title: "Choisissez Votre Plan Joyeux",
        pricing_intro: "Commencez gratuitement ou débloquez des fonctionnalités premium pour créer des souvenirs familiaux inoubliables.",
        free_tier_title: "Legacy Basique",
        free_tier_desc: "Archive limitée de texte et photos, faits saillants de mémoire IA, 5 interactions IA/mois.",
        essential_tier_title: "Legacy Essentiel",
        essential_tier_desc: "Stockage étendu, persona IA personnalisée, support multilingue, recherche basée sur l'humeur.",
        family_tier_title: "Legacy Familial Plus",
        family_tier_desc: "Archives partagées, albums collaboratifs, interactions IA illimitées, jeux familiaux.",
        lifetime_tier_title: "Voûte Legacy à Vie",
        lifetime_tier_desc: "Stockage illimité, livre legacy IA, support prioritaire, messages programmés, et **support VIP familial exclusif avec curations de mémoire IA personnalisées.**",
        buy_now: "Acheter Maintenant",
        one_time_title: "Améliorations Premium",
        one_time_desc: "Ajoutez des fonctionnalités uniques à votre legacy joyeuse.",
        storybook_purchase: "Livre de Contes IA ($99)",
        time_capsule_purchase: "Capsule Temporelle ($49)",
        video_message_purchase: "Vidéo Legacy ($79)",
        business_creator_title: "Pour les Entreprises & Créateurs",
        business_creator_desc: "Préservez les histoires de marque ou créez des personas IA uniques.",
        business_plan: "Plan d'Entreprise : $499/an",
        creator_plan: "Plan Créateur : $99 configuration + $25/mois",
        community_plan: "Voûte Communautaire : $149/an",
        contact_sales: "Contacter les Ventes",
        login_title: "Connexion au Portail Joyeux",
        email_label: "Email",
        email_input_placeholder: "Email",
        password_label: "Mot de Passe",
        password_input_placeholder: "Mot de Passe",
        login_button: "Se Connecter",
        forgot_password: "Mot de Passe Oublié ?",
        email_required: "Veuillez entrer votre adresse email.",
        password_reset_sent: "Email de réinitialisation de mot de passe envoyé ! Vérifiez votre boîte de réception.",
        login_required: "Veuillez vous connecter pour enregistrer un...",
        current_plan: "Vous êtes sur {{planName}} 💛",
        welcome_user: "Bienvenue, !",
        happy_timeline_title: "Votre Chronologie Heureuse",
        happy_timeline_desc: "Ajoutez des jalons, des premiers et des moments joyeux à votre album numérique.",
        add_milestone: "Ajouter un Jalon",
        bucket_list_title: "Liste de Souhaits Familiale",
        bucket_list_desc: "Définissez des objectifs partagés comme des voyages ou des activités amusantes et suivez le progrès !",
        add_goal_placeholder: "Ajouter un objectif...",
        add_goal: "Ajouter un Objectif",
        storytelling_mode_title: "Aventure de Narration IA",
        storytelling_mode_desc: "Votre copilote pour créer le voyage unique de votre famille, en créant des histoires fictives amusantes avec vos proches comme héros !",
        story_characters_label: "Qui sont les personnages principaux ?",
        story_characters_placeholder: "e.g., Maman, Papa, Lily, notre chien Sparky",
        story_theme_label: "Choisissez un thème :",
        select_theme_option: "Sélectionnez un thème",
        generate_story: "Générer l'Histoire",
        challenge_response_title: "Répondre aux Défis",
        challenge_response_desc: "Voir et répondre aux défis familiaux.",
        view_challenges: "Voir les Défis",
        account_settings_title: "Paramètres du Compte",
        account_settings_desc: "Gérez votre profil, abonnement et préférences.",
        manage_settings: "Gérer les Paramètres",
        contact_support_title: "Support",
        contact_support_desc: "Obtenez de l'aide ou fournissez des commentaires.",
        contact_us: "Nous Contacter",
        logout_button: "Se Déconnecter",
        demo_timeline_title: "Aperçu d'une Chronologie Heureuse",
        demo_timeline_desc: "Voyez comment Legacy AI donne vie aux souvenirs !",
        login_to_create: "Se Connecter pour Créer le Vôtre",
        signup_title: "Inscrivez-vous au Portail Joyeux",
        signup_button: "S'inscrire",
        signup_link: "S'inscrire",
        login_link: "Déjà un compte ? Se Connecter"
    },
    de: {
        // Add translations for German if needed, but since not provided, leave empty or add placeholders
    },
    pt: {
        // Add translations for Portuguese if needed, but since not provided, leave empty or add placeholders
    }
};

function applyTranslations() {
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
    document.querySelectorAll('[data-placeholder-key]').forEach(el => {
        const key = el.getAttribute('data-placeholder-key');
        if (translations[currentLang][key]) {
            el.placeholder = translations[currentLang][key];
        }
    });
    // To fix bug with elements containing inner HTML (e.g., welcome_user with span)
    if (document.getElementById('userName')) {
        document.querySelector('[data-key="welcome_user"]').innerHTML = translations[currentLang].welcome_user.replace('!', '<span id="userName"></span>!');
    }
}

document.querySelectorAll('.dropdown-item[data-lang]').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        currentLang = this.getAttribute('data-lang');
        applyTranslations();
    });
});

applyTranslations();

document.querySelectorAll('a[data-page]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });
        const targetPage = this.getAttribute('data-page');
        document.getElementById(targetPage).classList.add('active');

        if (targetPage === 'client-portal') {
            authService.onAuthStateChanged(user => {
                if (user) {
                    document.getElementById('login-form').style.display = 'none';
                    document.getElementById('signup-form').style.display = 'none';
                    document.getElementById('dashboard-content').style.display = 'block';
                    document.getElementById('userName').textContent = user.email;
                    updatePlanStatus(user.uid);
                } else {
                    document.getElementById('login-form').style.display = 'block';
                    document.getElementById('signup-form').style.display = 'none';
                    document.getElementById('dashboard-content').style.display = 'none';
                }
            });
        }
    });
});

document.getElementById('showSignup').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
});

document.getElementById('showLogin').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
});

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('clientEmail').value;
    const password = document.getElementById('clientPassword').value;
    try {
        await authService.signInWithEmailAndPassword(email, password);
        showToast('Logged in successfully!', 'success');
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('dashboard-content').style.display = 'block';
        document.getElementById('userName').textContent = authService.currentUser.email;
        updatePlanStatus(authService.currentUser.uid);
    } catch (error) {
        showToast(`Login failed: ${error.message}`, 'error');
        console.error('Login error:', error);
    }
});

document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    try {
        await authService.createUserWithEmailAndPassword(email, password);
        showToast('Signed up successfully!', 'success');
        document.getElementById('signup-form').style.display = 'none';
        document.getElementById('dashboard-content').style.display = 'block';
        document.getElementById('userName').textContent = authService.currentUser.email;
        await firestore.collection('users').doc(authService.currentUser.uid).set({ plan: 'basic' });
        updatePlanStatus(authService.currentUser.uid);
    } catch (error) {
        showToast(`Signup failed: ${error.message}`, 'error');
        console.error('Signup error:', error);
    }
});

document.getElementById('logoutButton').addEventListener('click', async function(e) {
    e.preventDefault();
    try {
        await authService.signOut();
        showToast('Logged out successfully!', 'info');
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('dashboard-content').style.display = 'none';
    } catch (error) {
        showToast(`Logout failed: ${error.message}`, 'error');
        console.error('Logout error:', error);
    }
});

document.querySelector('[data-key="forgot_password"]').addEventListener('click', async function(e) {
    e.preventDefault();
    const email = document.getElementById('clientEmail').value;
    if (email) {
        try {
            await authService.sendPasswordResetEmail(email);
            showToast(translations[currentLang].password_reset_sent, 'info');
        } catch (error) {
            showToast(`Password reset failed: ${error.message}`, 'error');
            console.error('Password reset error:', error);
        }
    } else {
        showToast(translations[currentLang].email_required, 'error');
    }
});

async function updatePlanStatus(userId) {
    const planStatusElement = document.getElementById('plan-status');
    try {
        const userDoc = await firestore.collection('users').doc(userId).get();
        if (userDoc.exists && userDoc.data().plan) {
            const planName = userDoc.data().plan;
            planStatusElement.textContent = translations[currentLang].current_plan.replace('{{planName}}', planName);
            planStatusElement.style.display = 'block';
        } else {
            planStatusElement.style.display = 'none';
        }
    } catch (error) {
        console.error("Error fetching plan status:", error);
        planStatusElement.style.display = 'none';
    }
}

async function uploadFile(file, type, emotionTagsInputId, progressBarId, progressContainerId) {
    if (!authService.currentUser) {
        showToast(translations[currentLang].login_required, 'error');
        return;
    }

    const storageRef = storageService.ref();
    const fileRef = storageRef.child(`${type}s/${authService.currentUser.uid}/${file.name}`);
    const uploadTask = fileRef.put(file);

    const progressBar = document.getElementById(progressBarId);
    const progressContainer = document.getElementById(progressContainerId);
    progressContainer.style.display = 'block';

    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressBar.style.width = progress + '%';
            progressBar.textContent = Math.round(progress) + '%';
        },
        (error) => {
            showToast(`${translations[currentLang].upload_failed} ${error.message}`, 'error');
            console.error("Upload failed:", error);
            progressContainer.style.display = 'none';
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
                showToast(`${type} uploaded successfully!`, 'success');
                progressContainer.style.display = 'none';
                const emotionTags = document.getElementById(emotionTagsInputId).value;
                await firestore.collection('users').doc(authService.currentUser.uid).collection(type).add({
                    fileName: file.name,
                    fileType: file.type,
                    downloadURL: downloadURL,
                    emotionTags: emotionTags,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                document.getElementById(emotionTagsInputId).value = '';
            });
        }
    );
}

document.getElementById('uploadPhotoButton').addEventListener('click', function() {
    const fileInput = document.getElementById('uploadPhotoInput');
    if (fileInput.files.length > 0) {
        Array.from(fileInput.files).forEach(file => {
            uploadFile(file, 'photo', 'photoEmotionInput', 'photoProgressBar', 'photoProgressContainer');
        });
        fileInput.value = '';
    } else {
        showToast('Please select a photo to upload.', 'info');
    }
});

document.getElementById('uploadVideoButton').addEventListener('click', function() {
    const fileInput = document.getElementById('uploadVideoInput');
    if (fileInput.files.length > 0) {
        Array.from(fileInput.files).forEach(file => {
            uploadFile(file, 'video', 'videoEmotionInput', 'videoProgressBar', 'videoProgressContainer');
        });
        fileInput.value = '';
    } else {
        showToast('Please select a video to upload.', 'info');
    }
});

document.getElementById('recordVoiceButton').addEventListener('click', async function() {
    if (!authService.currentUser) {
        showToast(translations[currentLang].login_required, 'error');
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        let timerSeconds = 0;
        const recordingTimer = document.getElementById('recordingTimer');

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audioPreview = document.getElementById('audioPreview');
            audioPreview.src = audioUrl;
            audioPreview.style.display = 'block';

            const fileName = `voice_note_${new Date().getTime()}.webm`;
            await uploadFile(audioBlob, 'voice', 'voiceEmotionInput', 'voiceProgressBar', 'voiceProgressContainer');

            clearInterval(recordingTimerInterval);
            recordingTimer.style.display = 'none';
            document.getElementById('recordVoiceButton').style.display = 'block';
            document.getElementById('stopRecordingButton').style.display = 'none';
        };

        mediaRecorder.start();
        recordingStartTime = Date.now();
        recordingTimer.textContent = '00:00';
        recordingTimer.style.display = 'block';
        document.getElementById('recordVoiceButton').style.display = 'none';
        document.getElementById('stopRecordingButton').style.display = 'block';

        recordingTimerInterval = setInterval(() => {
            timerSeconds = Math.floor((Date.now() - recordingStartTime) / 1000);
            const minutes = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
            const seconds = String(timerSeconds % 60).padStart(2, '0');
            recordingTimer.textContent = `${minutes}:${seconds}`;
        }, 1000);

    } catch (error) {
        showToast(`${translations[currentLang].microphone_error} ${error.message}`, 'error');
        console.error("Microphone access error:", error);
    }
});

document.getElementById('stopRecordingButton').addEventListener('click', function() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
});

document.querySelectorAll('[data-challenge-id]').forEach(button => {
    button.addEventListener('click', async function() {
        if (!authService.currentUser) {
            showToast(translations[currentLang].login_required, 'error');
            return;
        }

        const challengeId = this.dataset.challengeId;
        let responseData = {};

        switch (challengeId) {
            case 'funny-question':
                responseData.answer = document.getElementById('funnyQuestionResponse').value;
                if (!responseData.answer) {
                    showToast('Please enter an answer for the funny question challenge.', 'info');
                    return;
                }
                break;
            case 'dance-off':
                const videoFile = document.getElementById('danceOffVideoInput').files[0];
                if (!videoFile) {
                    showToast('Please upload a video for the dance-off challenge.', 'info');
                    return;
                }
                await uploadFile(videoFile, 'challenge_video', '', 'videoProgressBar', 'videoProgressContainer');
                responseData.videoUploaded = true;
                break;
            case 'childhood-memory':
                responseData.story = document.getElementById('childhoodMemoryResponse').value;
                if (!responseData.story) {
                    showToast('Please enter your story for the childhood memory challenge.', 'info');
                    return;
                }
                break;
        }

        try {
            await firestore.collection('users').doc(authService.currentUser.uid).collection('challenges').add({
                challengeId: challengeId,
                responseData: responseData,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            showToast('Challenge response submitted!', 'success');
            if (challengeId === 'funny-question') document.getElementById('funnyQuestionResponse').value = '';
            if (challengeId === 'dance-off') document.getElementById('danceOffVideoInput').value = '';
            if (challengeId === 'childhood-memory') document.getElementById('childhoodMemoryResponse').value = '';
        } catch (error) {
            showToast(`Challenge submission failed: ${error.message}`, 'error');
            console.error('Challenge submission error:', error);
        }
    });
});

document.getElementById('addMilestoneButton').addEventListener('click', async function() {
    if (!authService.currentUser) {
        showToast(translations[currentLang].login_required, 'error');
        return;
    }
    const milestone = prompt('Enter your milestone:');
    if (milestone) {
        try {
            await firestore.collection('users').doc(authService.currentUser.uid).collection('timeline').add({
                milestone: milestone,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            showToast('Milestone added!', 'success');
        } catch (error) {
            showToast(`Failed to add milestone: ${error.message}`, 'error');
        }
    }
});

document.getElementById('addGoalButton').addEventListener('click', async function() {
    if (!authService.currentUser) {
        showToast(translations[currentLang].login_required, 'error');
        return;
    }
    const goal = document.getElementById('goalInput').value;
    if (goal) {
        try {
            await firestore.collection('users').doc(authService.currentUser.uid).collection('bucketList').add({
                goal: goal,
                completed: false,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            showToast('Goal added!', 'success');
            document.getElementById('goalInput').value = '';
        } catch (error) {
            showToast(`Failed to add goal: ${error.message}`, 'error');
        }
    } else {
        showToast('Please enter a goal.', 'info');
    }
});

document.getElementById('generateStoryButton').addEventListener('click', async function() {
    if (!authService.currentUser) {
        showToast(translations[currentLang].login_required, 'error');
        return;
    }
    const characters = document.getElementById('storyCharacters').value;
    const theme = document.getElementById('storyTheme').value;
    if (!characters || !theme) {
        showToast('Please enter characters and select a theme.', 'info');
        return;
    }

    showToast('Generating your story...', 'info');
    const storyOutput = document.getElementById('storyOutput');
    storyOutput.textContent = `Once upon a time, in a land far away, ${characters} embarked on a grand ${theme} adventure... (This is a placeholder story generated by AI.)`;
    storyOutput.style.display = 'block';
    document.getElementById('storyActions').style.display = 'flex';
    showToast('Story generated!', 'success');
});

document.getElementById('saveStoryButton').addEventListener('click', async function() {
    if (!authService.currentUser) return;
    const storyContent = document.getElementById('storyOutput').textContent;
    try {
        await firestore.collection('users').doc(authService.currentUser.uid).collection('stories').add({
            content: storyContent,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        showToast('Story saved!', 'success');
    } catch (error) {
        showToast(`Failed to save story: ${error.message}`, 'error');
        console.error('Error saving story:', error);
    }
});

document.getElementById('shareStoryButton').addEventListener('click', function() {
    if (!authService.currentUser) return;
    const storyContent = document.getElementById('storyOutput').textContent;
    navigator.clipboard.writeText(storyContent).then(() => {
        showToast('Story copied to clipboard!', 'info');
    }).catch(err => {
        showToast('Failed to copy story.', 'error');
        console.error('Could not copy text: ', err);
    });
});

document.getElementById('regenerateStoryButton').addEventListener('click', function() {
    document.getElementById('generateStoryButton').click();
});

async function createPayPalOrder(amount, planName) {
    const response = await fetch('https://us-central1-life-archive-1ed4a.cloudfunctions.net/createOrder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount: amount,
            plan: planName
        })
    });
    if (!response.ok) {
        throw new Error('Failed to create order');
    }
    const data = await response.json();
    return data.id;
}

async function onPayPalApprove(data) {
    const response = await fetch('https://us-central1-life-archive-1ed4a.cloudfunctions.net/captureOrder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            orderID: data.orderID
        })
    });
    if (!response.ok) {
        throw new Error('Failed to capture order');
    }
    const details = await response.json();
    showToast(`Transaction completed!`, 'success');
    // Update user plan in Firestore or handle subscription
    if (authService.currentUser) {
        await firestore.collection('users').doc(authService.currentUser.uid).update({
            plan: details.purchase_units[0].reference_id // assuming planName stored there
        });
    }
    return details;
}

function onPayPalError(err) {
    showToast(`Payment failed: ${err.message || err}`, 'error');
    console.error('PayPal error:', err);
}

function initPayPalButtons(containerId, amount, planName) {
    paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal'
        },
        createOrder: () => createPayPalOrder(amount, planName),
        onApprove: onPayPalApprove,
        onError: onPayPalError
    }).render(`#${containerId}`);
}

function initCardFields(containerId, submitButtonId, amount, planName) {
    const cardFields = paypal.CardFields({
        createOrder: () => createPayPalOrder(amount, planName),
        onApprove: onPayPalApprove,
        onError: onPayPalError
    });
    if (cardFields.isEligible()) {
        cardFields.NumberField().render('#card-number-' + containerId.split('-')[1]);
        cardFields.ExpiryField().render('#card-expiry-' + containerId.split('-')[1]);
        cardFields.CVVField().render('#card-cvv-' + containerId.split('-')[1]);
        document.getElementById(submitButtonId).addEventListener('click', () => {
            cardFields.submit().catch(onPayPalError);
        });
    } else {
        document.getElementById(containerId).style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initPayPalButtons('paypal-essential', '15.00', 'Essential');
    initCardFields('card-fields-essential', 'card-submit-essential', '15.00', 'Essential');
    initPayPalButtons('paypal-family', '39.00', 'Family Plus');
    initCardFields('card-fields-family', 'card-submit-family', '39.00', 'Family Plus');
    initPayPalButtons('paypal-lifetime', '299.00', 'Lifetime');
    initCardFields('card-fields-lifetime', 'card-submit-lifetime', '299.00', 'Lifetime');
    // For premium enhancements
    initPayPalButtons('paypal-storybook', '99.00', 'AI Storybook');
    initPayPalButtons('paypal-timecapsule', '49.00', 'Time Capsule');
    initPayPalButtons('paypal-legacyvideo', '79.00', 'Legacy Video');
    document.getElementById('current-year').textContent = new Date().getFullYear();
});

