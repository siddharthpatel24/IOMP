import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      addPolicy: 'Add Policy',
      policies: 'Policies',
      dashboard: 'Dashboard',
      login: 'Login',
      logout: 'Logout',
      register: 'Register',
      
      // Authentication
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signInWithGoogle: 'Sign in with Google',
      signUpWithGoogle: 'Sign up with Google',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      forgotPassword: 'Forgot Password?',
      
      // Home Page
      heroTitle: 'eConsultation',
      heroSubtitle: 'Sentiment Analysis',
      heroDescription: 'Transform public feedback into actionable insights with AI-powered sentiment analysis. Our solution helps government departments understand citizen opinions from e-consultation platforms.',
      viewPolicies: 'View Policies',
      viewAnalytics: 'View Analytics',
      theChallenge: 'The Challenge',
      challengeDescription: 'Government policies and laws need public consultation before implementation. Citizens need a platform to provide feedback on proposed policies, and officials need tools to analyze this feedback efficiently.',
      
      // Policy Management
      policyTitle: 'Policy Title',
      policyDescription: 'Policy Description',
      publishPolicy: 'Publish Policy',
      publishingPolicy: 'Publishing Policy...',
      policyPublishedSuccess: 'Policy published successfully!',
      policyPublishedMessage: 'Citizens can now view and comment on this policy.',
      
      // Comments & Feedback
      shareThoughts: 'Share your thoughts on this policy...',
      submit: 'Submit',
      submitting: 'Submitting...',
      publicFeedback: 'Public Feedback',
      noFeedbackYet: 'No feedback yet. Be the first to comment!',
      viewComments: 'View Comments',
      hideComments: 'Hide Comments',
      loginToComment: 'Please login to comment on policies',
      
      // Sentiment Analysis
      positive: 'Positive',
      negative: 'Negative',
      neutral: 'Neutral',
      confidence: 'Confidence',
      sentimentDistribution: 'Sentiment Distribution',
      
      // Dashboard
      analyticsTitle: 'Analytics Dashboard',
      analyticsDescription: 'Real-time insights from policy consultations and citizen feedback',
      totalPolicies: 'Total Policies',
      totalFeedback: 'Total Feedback',
      refreshData: 'Refresh Data',
      recentFeedback: 'Recent Feedback',
      
      // Common
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      
      // Errors
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required',
      passwordsNotMatch: 'Passwords do not match',
      invalidEmail: 'Please enter a valid email address',
      loginFailed: 'Login failed. Please check your credentials.',
      registrationFailed: 'Registration failed. Please try again.',
    }
  },
  hi: {
    translation: {
      // Navigation
      home: 'होम',
      addPolicy: 'नीति जोड़ें',
      policies: 'नीतियां',
      dashboard: 'डैशबोर्ड',
      login: 'लॉगिन',
      logout: 'लॉगआउट',
      register: 'रजिस्टर',
      
      // Authentication
      email: 'ईमेल',
      password: 'पासवर्ड',
      confirmPassword: 'पासवर्ड की पुष्टि करें',
      fullName: 'पूरा नाम',
      signIn: 'साइन इन',
      signUp: 'साइन अप',
      signInWithGoogle: 'Google के साथ साइन इन करें',
      signUpWithGoogle: 'Google के साथ साइन अप करें',
      alreadyHaveAccount: 'क्या आपका पहले से खाता है?',
      dontHaveAccount: 'क्या आपका खाता नहीं है?',
      forgotPassword: 'पासवर्ड भूल गए?',
      
      // Home Page
      heroTitle: 'ई-परामर्श',
      heroSubtitle: 'भावना विश्लेषण',
      heroDescription: 'AI-संचालित भावना विश्लेषण के साथ सार्वजनिक प्रतिक्रिया को कार्यात्मक अंतर्दृष्टि में बदलें। हमारा समाधान सरकारी विभागों को ई-परामर्श प्लेटफॉर्म से नागरिक राय समझने में मदद करता है।',
      viewPolicies: 'नीतियां देखें',
      viewAnalytics: 'विश्लेषण देखें',
      theChallenge: 'चुनौती',
      challengeDescription: 'सरकारी नीतियों और कानूनों को लागू करने से पहले सार्वजनिक परामर्श की आवश्यकता होती है। नागरिकों को प्रस्तावित नीतियों पर प्रतिक्रिया देने के लिए एक मंच की आवश्यकता है।',
      
      // Policy Management
      policyTitle: 'नीति शीर्षक',
      policyDescription: 'नीति विवरण',
      publishPolicy: 'नीति प्रकाशित करें',
      publishingPolicy: 'नीति प्रकाशित की जा रही है...',
      policyPublishedSuccess: 'नीति सफलतापूर्वक प्रकाशित!',
      policyPublishedMessage: 'नागरिक अब इस नीति को देख सकते हैं और टिप्पणी कर सकते हैं।',
      
      // Comments & Feedback
      shareThoughts: 'इस नीति पर अपने विचार साझा करें...',
      submit: 'जमा करें',
      submitting: 'जमा किया जा रहा है...',
      publicFeedback: 'सार्वजनिक प्रतिक्रिया',
      noFeedbackYet: 'अभी तक कोई प्रतिक्रिया नहीं। पहले टिप्पणी करें!',
      viewComments: 'टिप्पणियां देखें',
      hideComments: 'टिप्पणियां छुपाएं',
      loginToComment: 'नीतियों पर टिप्पणी करने के लिए कृपया लॉगिन करें',
      
      // Sentiment Analysis
      positive: 'सकारात्मक',
      negative: 'नकारात्मक',
      neutral: 'तटस्थ',
      confidence: 'विश्वास',
      sentimentDistribution: 'भावना वितरण',
      
      // Dashboard
      analyticsTitle: 'विश्लेषण डैशबोर्ड',
      analyticsDescription: 'नीति परामर्श और नागरिक प्रतिक्रिया से वास्तविक समय की अंतर्दृष्टि',
      totalPolicies: 'कुल नीतियां',
      totalFeedback: 'कुल प्रतिक्रिया',
      refreshData: 'डेटा रीफ्रेश करें',
      recentFeedback: 'हाल की प्रतिक्रिया',
      
      // Common
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
      cancel: 'रद्द करें',
      save: 'सहेजें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      close: 'बंद करें',
      
      // Errors
      emailRequired: 'ईमेल आवश्यक है',
      passwordRequired: 'पासवर्ड आवश्यक है',
      passwordsNotMatch: 'पासवर्ड मेल नहीं खाते',
      invalidEmail: 'कृपया एक वैध ईमेल पता दर्ज करें',
      loginFailed: 'लॉगिन असफल। कृपया अपनी साख जांचें।',
      registrationFailed: 'पंजीकरण असफल। कृपया पुनः प्रयास करें।',
    }
  },
  te: {
    translation: {
      // Navigation
      home: 'హోమ్',
      addPolicy: 'పాలసీ జోడించు',
      policies: 'పాలసీలు',
      dashboard: 'డాష్‌బోర్డ్',
      login: 'లాగిన్',
      logout: 'లాగ్అవుట్',
      register: 'రిజిస్టర్',
      
      // Authentication
      email: 'ఇమెయిల్',
      password: 'పాస్‌వర్డ్',
      confirmPassword: 'పాస్‌వర్డ్ నిర్ధారించండి',
      fullName: 'పూర్తి పేరు',
      signIn: 'సైన్ ఇన్',
      signUp: 'సైన్ అప్',
      signInWithGoogle: 'Google తో సైన్ ఇన్ చేయండి',
      signUpWithGoogle: 'Google తో సైన్ అప్ చేయండి',
      alreadyHaveAccount: 'ఇప్పటికే ఖాతా ఉందా?',
      dontHaveAccount: 'ఖాతా లేదా?',
      forgotPassword: 'పాస్‌వర్డ్ మర్చిపోయారా?',
      
      // Home Page
      heroTitle: 'ఇ-సంప్రదింపులు',
      heroSubtitle: 'భావన విశ్లేషణ',
      heroDescription: 'AI-శక్తితో కూడిన భావన విశ్లేషణతో ప్రజా ప్రతిస్పందనను కార్యాచరణ అంతర్దృష్టులుగా మార్చండి. మా పరిష్కారం ప్రభుత్వ విభాగాలకు ఇ-సంప్రదింపుల ప్లాట్‌ఫారమ్‌ల నుండి పౌర అభిప్రాయాలను అర్థం చేసుకోవడంలో సహాయపడుతుంది.',
      viewPolicies: 'పాలసీలు చూడండి',
      viewAnalytics: 'విశ్లేషణలు చూడండి',
      theChallenge: 'సవాలు',
      challengeDescription: 'ప్రభుత్వ పాలసీలు మరియు చట్టాలను అమలు చేయడానికి ముందు ప్రజా సంప్రదింపులు అవసరం. పౌరులకు ప్రతిపాదిత పాలసీలపై ప్రతిస్పందన ఇవ్వడానికి వేదిక అవసరం.',
      
      // Policy Management
      policyTitle: 'పాలసీ శీర్షిక',
      policyDescription: 'పాలసీ వివరణ',
      publishPolicy: 'పాలసీ ప్రచురించండి',
      publishingPolicy: 'పాలసీ ప్రచురిస్తోంది...',
      policyPublishedSuccess: 'పాలసీ విజయవంతంగా ప్రచురించబడింది!',
      policyPublishedMessage: 'పౌరులు ఇప్పుడు ఈ పాలసీని చూడవచ్చు మరియు వ్యాఖ్యానించవచ్చు.',
      
      // Comments & Feedback
      shareThoughts: 'ఈ పాలసీపై మీ ఆలోచనలను పంచుకోండి...',
      submit: 'సమర్పించండి',
      submitting: 'సమర్పిస్తోంది...',
      publicFeedback: 'ప్రజా ప్రతిస్పందన',
      noFeedbackYet: 'ఇంకా ప్రతిస్పందన లేదు. మొదట వ్యాఖ్యానించండి!',
      viewComments: 'వ్యాఖ్యలు చూడండి',
      hideComments: 'వ్యాఖ్యలు దాచండి',
      loginToComment: 'పాలసీలపై వ్యాఖ్యానించడానికి దయచేసి లాగిన్ చేయండి',
      
      // Sentiment Analysis
      positive: 'సానుకూల',
      negative: 'ప్రతికూల',
      neutral: 'తటస్థ',
      confidence: 'విశ్వాసం',
      sentimentDistribution: 'భావన పంపిణీ',
      
      // Dashboard
      analyticsTitle: 'విశ్లేషణ డాష్‌బోర్డ్',
      analyticsDescription: 'పాలసీ సంప్రదింపులు మరియు పౌర ప్రతిస్పందన నుండి నిజ-సమయ అంతర్దృష్టులు',
      totalPolicies: 'మొత్తం పాలసీలు',
      totalFeedback: 'మొత్తం ప్రతిస్పందన',
      refreshData: 'డేటా రిఫ్రెష్ చేయండి',
      recentFeedback: 'ఇటీవలి ప్రతిస్పందన',
      
      // Common
      loading: 'లోడ్ అవుతోంది...',
      error: 'లోపం',
      success: 'విజయం',
      cancel: 'రద్దు చేయండి',
      save: 'సేవ్ చేయండి',
      delete: 'తొలగించండి',
      edit: 'సవరించండి',
      close: 'మూసివేయండి',
      
      // Errors
      emailRequired: 'ఇమెయిల్ అవసరం',
      passwordRequired: 'పాస్‌వర్డ్ అవసరం',
      passwordsNotMatch: 'పాస్‌వర్డ్‌లు సరిపోలలేదు',
      invalidEmail: 'దయచేసి చెల్లుబాటు అయ్యే ఇమెయిల్ చిరునామా నమోదు చేయండి',
      loginFailed: 'లాగిన్ విఫలమైంది. దయచేసి మీ ఆధారాలను తనిఖీ చేయండి.',
      registrationFailed: 'నమోదు విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;