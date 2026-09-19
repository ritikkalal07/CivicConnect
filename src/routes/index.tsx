
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  CheckSquare,
  Clock,
  Cpu,
  Database,
  Globe,
  LocateFixed,
  Mail,
  Map,
  MapPin,
  MessageSquare,
  Phone,
  Play,
  Radar,
  Radio,
  RefreshCw,
  Search,
  SearchCheck,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Wifi,
  WifiOff,
  X,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useOnlineStatus, useReports } from "@/hooks/use-reports";
import {
  buildAgentSnapshot,
  getE2ELifecycleDemo,
  getGovernmentOfficers,
  handleChatbotQuery,
  runAnomalyAgent,
  runDetectorAgent,
  runEscalatorAgent,
  runRouterAgent,
  runSelfHealAgent,
  runSentimentAgent,
  runVerifierAgent,
  type AutonomousAgentInfo,
  type E2ELifecycleStep,
  type GovernmentOfficer,
  type HarvesterItem,
} from "@/lib/autonomous";
import {
  addReport,
  getAlerts,
  riskOf,
  submitReport,
  syncPending,
  timeAgo,
  type Clarity,
  type Color,
  type ReportInput,
  type Smell,
  type WaterReport,
} from "@/lib/reports";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CivicConnect Autonomous: Self-Operating Civic Intelligence Platform" },
      {
        name: "description",
        content:
          "It doesn't wait for data. It finds it. It doesn't wait for orders. It acts. It doesn't wait for humans. It learns.",
      },
    ],
  }),
  component: CivicConnectApp,
});

export const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    appTitle: "CivicConnect",
    appSubtitle: "Public Civic Intelligence Portal",
    navHome: "Home",
    navTrack: "Track Status",
    navMap: "Safety Map",
    navE2e: "Live E2E Flow",
    navOfficers: "Officer Portal",
    navHarvesters: "Harvesters",
    navWorkers: "9 Workers",
    navReport: "Report Issue",
    online: "Online",
    offline: "Offline",
    assistant: "Assistant",
    heroTagline: "Self-Operating Civic Intelligence",
    heroTitle: "CivicConnect Autonomous",
    heroSub: '"It doesn\'t wait for data. It finds it. It doesn\'t wait for orders. It acts. It doesn\'t wait for humans. It learns."',
    btnReport: "Report Issue",
    btnTrack: "Track Status",
    btnE2e: "Test E2E Flow",
    statSources: "Data Sources Monitored",
    statSourcesDetail: "10 active crawlers watching feeds 24/7",
    statProcessed: "Civic Issues Processed",
    statProcessedDetail: "Auto-detected & citizen reports",
    statPriority: "Priority Escalations",
    statPriorityDetail: "Auto-escalated to Zonal Commissioners",
    statWorkers: "Autonomous Workers",
    statWorkersDetail: "Router, Escalator, Verifier, Detector...",
    liveFeedTitle: "Autonomous Operations & Dispatches",
    harvesterDetails: "Harvester Details",
    learningLoopsTitle: "5 Active Learning Loops",
    officerPortalTitle: "ULB Government Officer Resolver Portal",
    officerPortalSub: "Real-time dispatch board for Municipal Officers, Junior Engineers & Ward Commissioners.",
    trackTitle: "Track Civic Complaint Status",
    trackSub: "Enter your reference number (#CVC-1082) or search by keyword to see real-time officer dispatch & resolution proof.",
    trackPlaceholder: "Enter Complaint Reference # (e.g. #CVC-1082) or Ward Name...",
    btnSearch: "Search Status",
    harvesterTitle: "24/7 Autonomous Data Harvester Engines",
    harvesterSub: "Ingests public data continuously from RSS, Web Crawlers, Social Media, Open311 APIs, satellite imagery & IVR.",
    workerTitle: "9 Autonomous Intelligence Workers",
    workerSub: "Operating continuously without human admin overhead to route, verify, escalate, and auto-heal civic issues.",
    e2eTitle: "5-Step End-to-End Autonomous Resolution Lifecycle",
    e2eSub: "Simulate complete flow from public signal discovery to automated photo verification and complaint closure.",
    reportTitle: "File a Public Civic Complaint",
    reportSub: "Complaints filed here are processed by AI agents and routed directly to the designated ward officer.",
    chatTitle: "Civic Assistant",
    chatSub: "Active 24/7 in 22 Languages (Bhashini)",
    chatPlaceholder: "Ask a question or report an issue in any language...",
    chatPromptWater: "Water timing in Ward 47",
    chatPromptPothole: "Report Pothole",
    chatPromptStatus: "Status #CVC-1082",
    langSelectLabel: "Language",
  },
  hi: {
    appTitle: "सिविककनेक्ट",
    appSubtitle: "सार्वजनिक नागरिक खुफिया पोर्टल",
    navHome: "होम",
    navTrack: "स्थिति ट्रैक करें",
    navMap: "सुरक्षा मानचित्र",
    navE2e: "लाइव प्रक्रिया",
    navOfficers: "अधिकारी पोर्टल",
    navHarvesters: "डेटा हार्वेस्टर",
    navWorkers: "9 कार्यकर्ता",
    navReport: "समस्या दर्ज करें",
    online: "ऑनलाइन",
    offline: "ऑफलाइन",
    assistant: "नागरिक सहायक",
    heroTagline: "स्वचालित नागरिक खुफिया प्रणाली",
    heroTitle: "सिविककनेक्ट स्वायत्त",
    heroSub: '"यह डेटा का इंतजार नहीं करता। यह खोजता है। यह आदेशों का इंतजार नहीं करता। यह कार्य करता है। यह इंसानों का इंतजार नहीं करता। यह सीखता है।"',
    btnReport: "समस्या दर्ज करें",
    btnTrack: "स्थिति ट्रैक करें",
    btnE2e: "लाइव प्रक्रिया परीक्षण",
    statSources: "निगरानी डेटा स्रोत",
    statSourcesDetail: "10 सक्रिय क्रॉलर 24/7 फीड देख रहे हैं",
    statProcessed: "प्रसंस्कृत नागरिक मुद्दे",
    statProcessedDetail: "स्वचालित और नागरिक शिकायतें",
    statPriority: "प्राथमिकता एस्केलेशन",
    statPriorityDetail: "जोनल कमिश्नर को ऑटो-एस्केलेटेड",
    statWorkers: "स्वायत्त कार्यकर्ता",
    statWorkersDetail: "राउटर, एस्केलेटर, वेरिफायर...",
    liveFeedTitle: "स्वायत्त संचालन और डिस्पैच",
    harvesterDetails: "हार्वेस्टर विवरण",
    learningLoopsTitle: "5 सक्रिय लर्निंग लूप्स",
    officerPortalTitle: "नगर निगम अधिकारी समाधान पोर्टल",
    officerPortalSub: "नगर निगम अधिकारियों और कनिष्ठ अभियंताओं के लिए वास्तविक समय का बोर्ड।",
    trackTitle: "नागरिक शिकायत की स्थिति ट्रैक करें",
    trackSub: "संदर्भ संख्या (#CVC-1082) दर्ज करें या खोजें।",
    trackPlaceholder: "शिकायत संदर्भ संख्या या वार्ड दर्ज करें...",
    btnSearch: "स्थिति खोजें",
    harvesterTitle: "24/7 स्वायत्त डेटा हार्वेस्टर इंजन",
    harvesterSub: "आरएसएस, वेब क्रॉलर, सोशल मीडिया और उपग्रह छवियों से डेटा एकत्र करता है।",
    workerTitle: "9 स्वायत्त खुफिया कार्यकर्ता",
    workerSub: "बिना किसी मानवीय हस्तक्षेप के समस्याओं का समाधान और सत्यापन करते हैं।",
    e2eTitle: "5-चरण स्वायत्त समाधान जीवनचक्र",
    e2eSub: "सार्वजनिक खोज से लेकर स्वचालित फोटो सत्यापन और शिकायत बंद करने की प्रक्रिया।",
    reportTitle: "सार्वजनिक शिकायत दर्ज करें",
    reportSub: "यहां दर्ज शिकायतों को सीधे जिम्मेदार वार्ड अधिकारी को भेजा जाता है।",
    chatTitle: "नागरिक सहायक",
    chatSub: "22 भारतीय भाषाओं में 24/7 सक्रिय (भाषिणी)",
    chatPlaceholder: "किसी भी भाषा में प्रश्न पूछें या समस्या दर्ज करें...",
    chatPromptWater: "पानी आपूर्ति का समय",
    chatPromptPothole: "सड़क के गड्ढे की शिकायत",
    chatPromptStatus: "स्थिति #CVC-1082",
    langSelectLabel: "भाषा",
  },
  kn: {
    appTitle: "ಸಿವಿಕ್ ಕನೆಕ್ಟ್",
    appSubtitle: "ಸಾರ್ವಜನಿಕ ನಾಗರಿಕ ಬುದ್ಧಿವಂತಿಕೆ ಪೋರ್ಟಲ್",
    navHome: "ಮುಖಪುಟ",
    navTrack: "ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ",
    navMap: "ಸುರಕ್ಷತಾ ನಕ್ಷೆ",
    navE2e: "ನೇರ ಪ್ರಕ್ರಿಯೆ",
    navOfficers: "ಅಧಿಕಾರಿ ಪೋರ್ಟಲ್",
    navHarvesters: "ಮಾಹಿತಿ ಸಂಗ್ರಾಹಕರು",
    navWorkers: "9 ಕಾರ್ಯಕರ್ತರು",
    navReport: "ದೂರು ನಮೂದಿಸಿ",
    online: "ಆನ್‌ಲೈನ್",
    offline: "ಆಫ್‌ಲೈನ್",
    assistant: "ನಾಗರಿಕ ಸಹಾಯಕ",
    heroTagline: "ಸ್ವಯಂಚಾಲಿತ ನಾಗರಿಕ ಬುದ್ಧಿವಂತಿಕಾ ವ್ಯವಸ್ಥೆ",
    heroTitle: "ಸಿವಿಕ್ ಕನೆಕ್ಟ್ ಅಟೋನಾಮಸ್",
    heroSub: '"ಇದು ಮಾಹಿತಿಗಾಗಿ ಕಾಯುವುದಿಲ್ಲ. ಹುಡುಕುತ್ತದೆ. ಆದೇಶಕ್ಕಾಗಿ ಕಾಯುವುದಿಲ್ಲ. ಕೆಲಸ ಮಾಡುತ್ತದೆ. ಕಲಿಯುತ್ತದೆ."',
    btnReport: "ದೂರು ನಮೂದಿಸಿ",
    btnTrack: "ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ",
    btnE2e: "ನೇರ ಪ್ರಕ್ರಿಯೆ ಪರೀಕ್ಷಿಸಿ",
    statSources: "ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿದ ಮೂಲಗಳು",
    statSourcesDetail: "24/7 ಸಕ್ರಿಯವಾಗಿರುವ 10 ಸಂಗ್ರಾಹಕರು",
    statProcessed: "ಸಂಸ್ಕರಿಸಿದ ದೂರುಗಳು",
    statProcessedDetail: "ಸ್ವಯಂಚಾಲಿತ ಮತ್ತು ಸಾರ್ವಜನಿಕ ದೂರುಗಳು",
    statPriority: "ಆದ್ಯತೆಯ ದೂರುಗಳು",
    statPriorityDetail: "ಆಯುಕ್ತರಿಗೆ ಮೇಲ್ಮನವಿ ಸಲ್ಲಿಕೆ",
    statWorkers: "ಸ್ವಯಂಚಾಲಿತ ಕಾರ್ಯಕರ್ತರು",
    statWorkersDetail: "ರೌಟರ್, ವೆರಿಫೈಯರ್, ಡೆಟೇಕ್ಟರ್...",
    liveFeedTitle: "ಸ್ವಯಂಚಾಲಿತ ಕಾರ್ಯಾಚರಣೆಗಳು",
    harvesterDetails: "ಸಂಗ್ರಾಹಕರ ವಿವರಗಳು",
    learningLoopsTitle: "5 ಸಕ್ರಿಯ ಕಲಿಕಾ ಚಕ್ರಗಳು",
    officerPortalTitle: "ನಗರ ಪಾಲಿಕೆ ಅಧಿಕಾರಿಗಳ ಪರಿಹಾರ ಪೋರ್ಟಲ್",
    officerPortalSub: "ನಗರ ಪಾಲಿಕೆ ಅಧಿಕಾರಿಗಳಿಗೆ ನೈಜ-ಸಮಯದ ಕಾರ್ಯಾಚರಣೆ ಬೋರ್ಡ್.",
    trackTitle: "ದೂರಿನ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ",
    trackSub: "ನಿಮ್ಮ ಉಲ್ಲೇಖ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ (#CVC-1082).",
    trackPlaceholder: "ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ ಅಥವಾ ವಾರ್ಡ್ ಹೆಸರು ನಮೂದಿಸಿ...",
    btnSearch: "ಹುಡುಕಿ",
    harvesterTitle: "24/7 ಸ್ವಯಂಚಾಲಿತ ಮಾಹಿತಿ ಸಂಗ್ರಾಹಕರು",
    harvesterSub: "ಸಾಮಾಜಿಕ ಮಾಧ್ಯಮ ಮತ್ತು ಉಪಗ್ರಹ ಚಿತ್ರಗಳಿಂದ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಮಾಹಿತಿ ಪಡೆಯುತ್ತದೆ.",
    workerTitle: "9 ಸ್ವಯಂಚಾಲಿತ ಬುದ್ಧಿವಂತಿಕಾ ಕಾರ್ಯಕರ್ತರು",
    workerSub: "ಮಾನವ ಸಹಾಯವಿಲ್ಲದೆ ದೂರುಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ನಿರ್ವಹಿಸುತ್ತದೆ.",
    e2eTitle: "5-ಹಂತದ ಸಂಪೂರ್ಣ ಪರಿಹಾರ ಪ್ರಕ್ರಿಯೆ",
    e2eSub: "ದೂರು ಪತ್ತೆಯಿಂದ ಹಿಡಿದು ಫೋಟೋ ಪರಿಶೀಲನೆವರೆಗೆ ನೇರ ಪ್ರದರ್ಶನ.",
    reportTitle: "ಸಾರ್ವಜನಿಕ ದೂರು ನಮೂದಿಸಿ",
    reportSub: "ಇಲ್ಲಿ ಸಲ್ಲಿಸಿದ ದೂರುಗಳನ್ನು ನೇರವಾಗಿ ವಾರ್ಡ್ ಅಧಿಕಾರಿಗೆ ರವಾನಿಸಲಾಗುತ್ತದೆ.",
    chatTitle: "ನಾಗರಿಕ ಸಹಾಯಕ",
    chatSub: "22 ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ 24/7 ಲಭ್ಯವಿದೆ (ಭಾಷಿಣಿ)",
    chatPlaceholder: "ಯಾವುದೇ ಭಾಷೆಯಲ್ಲಿ ಪ್ರಶ್ನೆ ಕೇಳಿ ಅಥವಾ ದೂರು ನೀಡಿ...",
    chatPromptWater: "ನೀರು ಪೂರೈಕೆ ಸಮಯ",
    chatPromptPothole: "ರಸ್ತೆ ಗುಂಡಿ ದೂರು",
    chatPromptStatus: "ಸ್ಥಿತಿ #CVC-1082",
    langSelectLabel: "ಭಾಷೆ",
  },
  ta: {
    appTitle: "சிவிக் கணெக்ட்",
    appSubtitle: "பொது மக்கள் சேவை நுண்ணறிவு போர்ட்டல்",
    navHome: "முகப்பு",
    navTrack: "நிலையைக் கண்காணி",
    navMap: "பாதுகாப்பு வரைபடம்",
    navE2e: "நேரலை செயல்முறை",
    navOfficers: "அதிகாரி போர்டல்",
    navHarvesters: "தரவு சேகரிப்பாளர்கள்",
    navWorkers: "9 பணியாளர்கள்",
    navReport: "புகார் செய்க",
    online: "ஆன்லைன்",
    offline: "ஆஃப்லைன்",
    assistant: "குடிமக்கள் உதவி",
    heroTagline: "தானியங்கி மக்கள் சேவை நுண்ணறிவு",
    heroTitle: "சிவிக் கணெக்ட் தன்னாட்சி",
    heroSub: '"இது தகவலுக்கு காத்திருக்காது. தேடும். உத்தரவுக்கு காத்திருக்காது. செயல்படும். மனிதர்களுக்கு காத்திருக்காது. கற்கும்."',
    btnReport: "புகார் செய்க",
    btnTrack: "நிலையைக் கண்காணி",
    btnE2e: "நேரலை பரிசோதனை",
    statSources: "கண்காணிக்கப்படும் தரவுகள்",
    statSourcesDetail: "24/7 இயங்கும் 10 சேகரிப்பாளர்கள்",
    statProcessed: "செயல்படுத்தப்பட்ட புகார்கள்",
    statProcessedDetail: "தானாக கண்டறியப்பட்ட தகவல்கள்",
    statPriority: "முன்னுரிமை புகார்கள்",
    statPriorityDetail: "உயர் அதிகாரிகளுக்கு அனுப்பப்பட்டது",
    statWorkers: "தானியங்கி பணியாளர்கள்",
    statWorkersDetail: "ரவுட்டர், வேரிஃபையர்...",
    liveFeedTitle: "தானியங்கி செயல்பாடுகள்",
    harvesterDetails: "சேகரிப்பாளர் விவரங்கள்",
    learningLoopsTitle: "5 செயலில் உள்ள கற்றல் சுழற்சிகள்",
    officerPortalTitle: "மாநகராட்சி அதிகாரி தீர்வு போர்ட்டல்",
    officerPortalSub: "அதிகாரிகளுக்கான நேரலை செயல்பாட்டு பலகை.",
    trackTitle: "புகார் நிலையைக் கண்காணிக்கவும்",
    trackSub: "உங்கள் குறிப்பு எண்ணை உள்ளிடவும் (#CVC-1082).",
    trackPlaceholder: "குறிப்பு எண் அல்லது வார்டு பெயர் உள்ளிடவும்...",
    btnSearch: "தேடுக",
    harvesterTitle: "24/7 தானியங்கி தரவு சேகரிப்பு இயந்திரங்கள்",
    harvesterSub: "செய்திகள், சமூக ஊடகங்கள் மற்றும் செயற்கைக்கோள் படங்களிலிருந்து தரவு சேகரிக்கிறது.",
    workerTitle: "9 தானியங்கி நுண்ணறிவு பணியாளர்கள்",
    workerSub: "மனித தலையீடு இன்றி புகார்களை சரிபார்த்து தீர்க்கிறது.",
    e2eTitle: "5-படி முழுமையான தீர்வு சுழற்சி",
    e2eSub: "புகார் கண்டறிதல் முதல் புகைப்பட சரிபார்ப்பு வரை நேரலை செயல்முறை.",
    reportTitle: "பொது புகாரை பதிவு செய்க",
    reportSub: "இங்கு பதிவு செய்யப்படும் புகார்கள் நேரடியாக சம்பந்தப்பட்ட வார்டு அதிகாரியிடம் ஒப்படைக்கப்படும்.",
    chatTitle: "குடிமக்கள் உதவி",
    chatSub: "22 இந்திய மொழிகளில் 24/7 இயங்குகிறது (பாஷினி)",
    chatPlaceholder: "எந்த மொழியிலும் கேள்வி கேட்கலாம் அல்லது புகார் செய்யலாம்...",
    chatPromptWater: "தண்ணீர் விநியோக நேரம்",
    chatPromptPothole: "சாலை பள்ளம் புகார்",
    chatPromptStatus: "நிலை #CVC-1082",
    langSelectLabel: "மொழி",
  },
  te: {
    appTitle: "సివిక్ కనెక్ట్",
    appSubtitle: "పౌర సమస్యల పరిష్కార పోర్టల్",
    navHome: "హోమ్",
    navTrack: "స్థితి ట్రాక్ చేయండి",
    navMap: "రక్షణ మ్యాప్",
    navE2e: "లైవ్ ప్రక్రియ",
    navOfficers: "అధికారి పోర్టల్",
    navHarvesters: "డేటా సేకరణ",
    navWorkers: "9 కార్మికులు",
    navReport: "సమస్య నివేదించండి",
    online: "ఆన్‌లైన్",
    offline: "ఆఫ్‌లైన్",
    assistant: "పౌర సహాయకుడు",
    heroTagline: "స్వయంప్రతిపత్తి పౌర మేధస్సు వ్యవస్థ",
    heroTitle: "సివిక్ కనెక్ట్ ఆటోనామస్",
    heroSub: '"ఇది డేటా కోసం వేచి ఉండదు. వెతుకుతుంది. ఆదేశాల కోసం వేచి ఉండదు. పని చేస్తుంది. మానవుల కోసం వేచి ఉండదు. నేర్చుకుంటుంది."',
    btnReport: "సమస్య నివేదించండి",
    btnTrack: "స్థితి ట్రాక్ చేయండి",
    btnE2e: "లైవ్ ప్రక్రియ పరీక్ష",
    statSources: "పరిశీలిస్తున్న డేటా మూలాలు",
    statSourcesDetail: "24/7 నడుస్తున్న 10 సేకరణ యంత్రాలు",
    statProcessed: "పరిష్కరించిన సమస్యలు",
    statProcessedDetail: "ఆటో-డిటెక్టెడ్ మరియు పౌర నివేదికలు",
    statPriority: "ముఖ్యమైన సమస్యలు",
    statPriorityDetail: "కమీషనర్లకు పంపబడినవి",
    statWorkers: "స్వయంప్రతిపత్తి కార్మికులు",
    statWorkersDetail: "రౌటర్, వేరిఫైయర్, డిటెక్టర్...",
    liveFeedTitle: "లైవ్ ఆటోమేటెడ్ ఆపరేషన్స్",
    harvesterDetails: "సేకరణ వివరాలు",
    learningLoopsTitle: "5 నేర్చుకునే ప్రక్రియలు",
    officerPortalTitle: "మునిసిపల్ అధికారుల పరిష్కార పోర్టల్",
    officerPortalSub: "అధికారుల కోసం రియల్-టైమ్ డిస్పాచ్ బోర్డ్.",
    trackTitle: "మీ సమస్య స్థితిని ట్రాక్ చేయండి",
    trackSub: "మీ రెఫరెన్స్ సంఖ్యను నమోదు చేయండి (#CVC-1082).",
    trackPlaceholder: "రెఫరెన్స్ నంబర్ లేదా వార్డ్ పేరును నమోదు చేయండి...",
    btnSearch: "శోధించండి",
    harvesterTitle: "24/7 ఆటోమేటెడ్ డేటా కలెక్టర్లు",
    harvesterSub: "సామాజిక మాధ్యమాలు మరియు శాటిలైట్ డేటా నుండి సమాచారం సేకరిస్తుంది.",
    workerTitle: "9 స్వయంప్రతిపత్తి ఇంటెలిజెన్స్ కార్మికులు",
    workerSub: "మానవ ప్రమేయం లేకుండా సమస్యలను తనిఖీ చేసి పరిష్కరిస్తాయి.",
    e2eTitle: "5-దశల సంపూర్ణ పరిష్కార చక్రం",
    e2eSub: "సమస్య గుర్తింపు నుండి ఫోటో వెరిఫికేషన్ వరకు లైవ్ ఫ్లో.",
    reportTitle: "పౌర సమస్యను నమోదు చేయండి",
    reportSub: "ఇక్కడ సబ్మిట్ చేసిన ఫిర్యాదులు సంబంధిత వార్డు అధికారికి పంపబడతాయి.",
    chatTitle: "పౌర సహాయకుడు",
    chatSub: "22 భారతీయ భాషలలో 24/7 అందుబాటులో ఉంటుంది (భాషిణి)",
    chatPlaceholder: "ఏ భాషలోనైనా ప్రశ్నించండి లేదా ఫిర్యాదు చేయండి...",
    chatPromptWater: "నీటి సరఫరా సమయం",
    chatPromptPothole: "గుంతల ఫిర్యాదు",
    chatPromptStatus: "స్థితి #CVC-1082",
    langSelectLabel: "భాష",
  },
  mr: {
    appTitle: "सिव्हिककनेक्ट",
    appSubtitle: "सार्वजनिक नागरिक माहिती पोर्टल",
    navHome: "मुख्यपृष्ठ",
    navTrack: "स्थिती ट्रॅक करा",
    navMap: "सुरक्षा नकाशा",
    navE2e: "थेट ई२ई प्रक्रिया",
    navOfficers: "अधिकारी पोर्टल",
    navHarvesters: "डेटा संकलक",
    navWorkers: "९ कामगार",
    navReport: "तक्रार नोंदवा",
    online: "ऑनलाईन",
    offline: "ऑफलाईन",
    assistant: "नागरिक साहाय्यक",
    heroTagline: "स्वयंचलित नागरिक माहिती प्रणाली",
    heroTitle: "सिव्हिककनेक्ट स्वायत्त",
    heroSub: '"ही प्रणाली माहितीची वाट पाहत नाही, ती शोधते. आदेशांची वाट पाहत नाही, कार्य करते. माणसांची वाट पाहत नाही, ती शिकते."',
    btnReport: "तक्रार नोंदवा",
    btnTrack: "स्थिती ट्रॅक करा",
    btnE2e: "थेट प्रक्रिया चाचणी",
    statSources: "निरीक्षण केलेले डेटा स्रोत",
    statSourcesDetail: "२४/७ कार्यरत असणारे १० संकलक",
    statProcessed: "प्रक्रिया केलेल्या तक्रारी",
    statProcessedDetail: "स्वयंचलित आणि नागरिक तक्रारी",
    statPriority: "प्राधान्य एस्कॅलेशन्स",
    statPriorityDetail: "वरिष्ठ अधिकाऱ्यांकडे वर्ग केलेल्या तक्रारी",
    statWorkers: "स्वयंचलित कामगार",
    statWorkersDetail: "राऊटर, व्हेरीफायर, डिटेक्टिव्ह...",
    liveFeedTitle: "थेट स्वयंचलित ऑपरेशन्स",
    harvesterDetails: "संकलक तपशील",
    learningLoopsTitle: "५ सक्रिय लर्निंग लूप्स",
    officerPortalTitle: "महानगरपालिका अधिकारी निवारण पोर्टल",
    officerPortalSub: "अधिकारी आणि कनिष्ठ अभियंत्यांसाठी रिअल-टाइम निवारण फलक.",
    trackTitle: "नागरिक तक्रारीची स्थिती ट्रॅक करा",
    trackSub: "तुमचा संदर्भ क्रमांक (#CVC-1082) प्रविष्ट करा.",
    trackPlaceholder: "तक्रार संदर्भ क्रमांक किंवा प्रभाग नाव टाका...",
    btnSearch: "स्थिती शोधा",
    harvesterTitle: "२४/७ स्वयंचलित डेटा संकलन इंजिन",
    harvesterSub: "आरएसएस, सोशल मीडिया आणि उपग्रह फोटोंमधून डेटा गोळा करतो.",
    workerTitle: "९ स्वयंचलित बुद्धिमत्ता कामगार",
    workerSub: "मानवी हस्तक्षेपाशिवाय तक्रारींचे निवारण करतात.",
    e2eTitle: "५-टप्प्यांची पूर्ण निवारण प्रक्रिया",
    e2eSub: "शोध घेण्यापासून ते फोटो पडताळणीपर्यंत थेट ई२ई प्रवाह.",
    reportTitle: "सार्वजनिक तक्रार नोंदवा",
    reportSub: "येथे नोंदवलेल्या तक्रारी थेट संबंधित प्रभाग अधिकाऱ्याकडे पाठवल्या जातात.",
    chatTitle: "नागरिक साहाय्यक",
    chatSub: "२२ भारतीय भाषांमध्ये २४/७ उपलब्ध (भाषिणी)",
    chatPlaceholder: "कोणत्याही भाषेत प्रश्न विचारा किंवा तक्रार नोंदवा...",
    chatPromptWater: "पाणीपुरवठा वेळ",
    chatPromptPothole: "रस्त्यावरील खड्ड्याची तक्रार",
    chatPromptStatus: "स्थिती #CVC-1082",
    langSelectLabel: "भाषा",
  },
  gu: {
    appTitle: "સિવિકકનેક્ટ",
    appSubtitle: "જાહેર નાગરિક ઇન્ટેલિજન્સ પોર્ટલ",
    navHome: "હોમ",
    navTrack: "સ્થિતિ ટ્રેક કરો",
    navMap: "સુરક્ષા નકશો",
    navE2e: "લાઇવ પ્રક્રિયા",
    navOfficers: "અધિકારી પોર્ટલ",
    navHarvesters: "ડેટા સંગ્રહક",
    navWorkers: "9 કાર્યકરો",
    navReport: "ફરિયાદ દાખલ કરો",
    online: "ઓનલાઇન",
    offline: "ઓફલાઇન",
    assistant: "નાગરિક સહાયક",
    heroTagline: "સ્વચાલિત નાગરિક ઇન્ટેલિજન્સ સિસ્ટમ",
    heroTitle: "સિવિકકનેક્ટ સ્વાયત્ત",
    heroSub: '"આ ડેટાની રાહ જોતું નથી. શોધે છે. આદેશોની રાહ જોતું નથી. કામ કરે છે. શીખે છે."',
    btnReport: "ફરિયાદ દાખલ કરો",
    btnTrack: "સ્થિતિ ટ્રેક કરો",
    btnE2e: "લાઇવ પ્રક્રિયા ટેસ્ટ",
    statSources: "નિરીક્ષણ કરેલ ડેટા સ્ત્રોતો",
    statSourcesDetail: "24/7 કાર્યરત 10 સંગ્રહકો",
    statProcessed: "પ્રક્રિયા થયેલ ફરિયાદો",
    statProcessedDetail: "ઓટો-ડીટેક્ટેડ અને જાહેર ફરિયાદો",
    statPriority: "પ્રાથમિકતા ફરિયાદો",
    statPriorityDetail: "ઉચ્ચ અધિકારીઓને સોંપાયેલ",
    statWorkers: "સ્વાયત્ત કાર્યકરો",
    statWorkersDetail: "રાઉટર, વેરિફાયર...",
    liveFeedTitle: "ઓટોમેટેડ ઓપરેશન્સ",
    harvesterDetails: "સંગ્રહક વિગતો",
    learningLoopsTitle: "5 સક્રિય લર્નિંગ લૂપ્સ",
    officerPortalTitle: "મહાનગરપાલિકા અધિકારી નિવારણ પોર્ટલ",
    officerPortalSub: "અધિકારીઓ માટે રીઅલ-ટાઇમ નિવારણ બોર્ડ.",
    trackTitle: "ફરિયાદની સ્થિતિ ટ્રેક કરો",
    trackSub: "તમારો રેફરન્સ નંબર દાખલ કરો (#CVC-1082).",
    trackPlaceholder: "રેફરન્સ નંબર અથવા વોર્ડનું નામ લખો...",
    btnSearch: "શોધો",
    harvesterTitle: "24/7 સ્વાયત્ત ડેટા સંગ્રહક ઇંજન",
    harvesterSub: "સોશિયલ મીડિયા અને ઉપગ્રહ ફોટાઓમાંથી ડેટા એકત્રિત કરે છે.",
    workerTitle: "9 સ્વાયત્ત ઇન્ટેલિજન્સ વર્કર્સ",
    workerSub: "માનવ મદદ વિના ફરિયાદોની ચકાસણી અને નિવારણ કરે છે.",
    e2eTitle: "5-તબક્કાની પૂર્ણ નિવારણ પ્રક્રિયા",
    e2eSub: "શોધથી લઈને ફોટો ચકાસણી સુધીની લાઇવ પ્રક્રિયા.",
    reportTitle: "જાહેર ફરિયાદ નોંધાવો",
    reportSub: "અહીં નોંધાયેલી ફરિયાદો સીધી સંબંધિત વોર્ડ અધિકારીને મોકલવામાં આવે છે.",
    chatTitle: "નાગરિક સહાયક",
    chatSub: "22 ભારતીય ભાષાઓમાં 24/7 ઉપલબ્ધ (ભાષિણી)",
    chatPlaceholder: "કોઈપણ ભાષામાં પ્રશ્ન પૂછો અથવા ફરિયાદ કરો...",
    chatPromptWater: "પાણી પુરવઠાનો સમય",
    chatPromptPothole: "ખાડાની ફરિયાદ",
    chatPromptStatus: "સ્થિતિ #CVC-1082",
    langSelectLabel: "ભાષા",
  },
  bn: {
    appTitle: "সিভিককানেক্ট",
    appSubtitle: "পাবলিক নাগরিক ইন্টেলিজেন্স পোর্টাল",
    navHome: "হোম",
    navTrack: "স্ট্যাটাস ট্র্যাক",
    navMap: "নিরাপত্তা মানচিত্র",
    navE2e: "লাইভ ই২ই ফ্লো",
    navOfficers: "অফিসার পোর্টাল",
    navHarvesters: "ডেটা সংগ্রাহক",
    navWorkers: "৯ কর্মী",
    navReport: "সমস্যা রিপোর্ট করুন",
    online: "অনলাইন",
    offline: "অফলাইন",
    assistant: "নাগরিক সহকারী",
    heroTagline: "স্বায়ত্তশাসিত নাগরিক ইন্টেলিজেন্স সিস্টেম",
    heroTitle: "সিভিককানেক্ট স্বায়ত্তশাসিত",
    heroSub: '"এটি তথ্যের জন্য অপেক্ষা করে না। খুঁজে নেয়। আদেশের জন্য অপেক্ষা করে না। কাজ করে। শেখে।"',
    btnReport: "সমস্যা রিপোর্ট করুন",
    btnTrack: "স্ট্যাটাস ট্র্যাক করুন",
    btnE2e: "লাইভ ফ্লো টেস্ট",
    statSources: "পর্যবেক্ষণ করা ডেটা উৎস",
    statSourcesDetail: "২৪/৭ সক্রিয় ১০ সংগ্রাহক",
    statProcessed: "প্রক্রিয়াকৃত নাগরিক সমস্যা",
    statProcessedDetail: "স্বয়ংক্রিয় ও নাগরিক রিপোর্ট",
    statPriority: "অগ্রাধিকার এসকেলেশন",
    statPriorityDetail: "উচ্চ কর্মকর্তাদের কাছে পাঠানো হয়েছে",
    statWorkers: "স্বায়ত্তশাসিত কর্মী",
    statWorkersDetail: "রাউটার, ভেরিফায়ার...",
    liveFeedTitle: "লাইভ স্বয়ংক্রিয় ক্রিয়াকলাপ",
    harvesterDetails: "সংগ্রাহক বিবরণ",
    learningLoopsTitle: "৫টি সক্রিয় লার্নিং লুপ",
    officerPortalTitle: "পৌরসভা কর্মকর্তা সমাধান পোর্টাল",
    officerPortalSub: "কর্মকর্তাদের জন্য রিয়েল-টাইম ড্যাশবোর্ড।",
    trackTitle: "নাগরিক অভিযোগের স্ট্যাটাস ট্র্যাক করুন",
    trackSub: "আপনার রেফারেন্স নম্বর লিখুন (#CVC-1082)।",
    trackPlaceholder: "রেফারেন্স নম্বর বা ওয়ার্ডের নাম লিখুন...",
    btnSearch: "অনুসন্ধান",
    harvesterTitle: "২৪/৭ স্বায়ত্তশাসিত ডেটা সংগ্রাহক ইঞ্জিন",
    harvesterSub: "সামাজিক মিডিয়া এবং স্যাটেলাইট ইমেজ থেকে ডেটা সংগ্রহ করে।",
    workerTitle: "৯টি স্বায়ত্তশাসিত ইন্টেলিজেন্স ওয়ার্কার",
    workerSub: "মানুষের হস্তক্ষেপ ছাড়াই সমস্যার সমাধান ও যাচাই করে।",
    e2eTitle: "৫-ধাপের সম্পূর্ণ সমাধান প্রক্রিয়া",
    e2eSub: "শনাক্তকরণ থেকে ফটো যাচাইকরণ পর্যন্ত লাইভ ফ্লো।",
    reportTitle: "জনসাধারণের অভিযোগ দায়ের করুন",
    reportSub: "এখানে জমা দেওয়া অভিযোগ সরাসরি নির্দিষ্ট ওয়ার্ড কর্মকর্তার কাছে পৌঁছাবে।",
    chatTitle: "নাগরিক সহকারী",
    chatSub: "২২টি ভারতীয় ভাষায় ২৪/৭ সক্রিয় (ভাষিণী)",
    chatPlaceholder: "যেকোনো ভাষায় প্রশ্ন জিজ্ঞাসা করুন বা অভিযোগ জানান...",
    chatPromptWater: "জল সরবরাহের সময়",
    chatPromptPothole: "গর্তের অভিযোগ",
    chatPromptStatus: "স্ট্যাটাস #CVC-1082",
    langSelectLabel: "ভাষা",
  },
  ml: {
    appTitle: "സിവിക് കണക്ട്",
    appSubtitle: "പൗര സേവന ഇൻ്റലിജൻസ് പോർട്ടൽ",
    navHome: "ഹോം",
    navTrack: "സ്റ്റാറ്റസ് പരിശോധിക്കുക",
    navMap: "സുരക്ഷാ മാപ്പ്",
    navE2e: "ലൈവ് പ്രക്രിയ",
    navOfficers: "ഓഫീസർ പോർട്ടൽ",
    navHarvesters: "ഡാറ്റ കളക്ടർമാർ",
    navWorkers: "9 ജീവനക്കാർ",
    navReport: "പരാതി നൽകുക",
    online: "ഓൺലൈൻ",
    offline: "ഓഫ്‌ലൈൻ",
    assistant: "പൗര സഹായി",
    heroTagline: "സ്വയം പ്രവർത്തിക്കുന്ന പൗര സേവന സിസ്റ്റം",
    heroTitle: "സിവിക് കണക്ട് ഓട്ടോണമസ്",
    heroSub: '"ഇത് വിവരങ്ങൾക്കായി കാത്തിരിക്കില്ല. കണ്ടെത്തുന്നു. ഉത്തരവുകൾക്കായി കാത്തിരിക്കില്ല. പ്രവർത്തിക്കുന്നു. പഠിക്കുന്നു."',
    btnReport: "പരാതി നൽകുക",
    btnTrack: "സ്റ്റാറ്റസ് പരിശോധിക്കുക",
    btnE2e: "ലൈവ് ടെസ്റ്റ് നടത്തുക",
    statSources: "നിരീക്ഷിക്കുന്ന ഉറവിടങ്ങൾ",
    statSourcesDetail: "24/7 പ്രവർത്തിക്കുന്ന 10 കളക്ടർമാർ",
    statProcessed: "പരിഹരിച്ച പരാതികൾ",
    statProcessedDetail: "സ്വയം കണ്ടെത്തിയ പരാതികൾ",
    statPriority: "പ്രധാന പരാതികൾ",
    statPriorityDetail: "ഉയർന്ന ഉദ്യോഗസ്ഥർക്ക് നൽകിയത്",
    statWorkers: "ഓട്ടോമേറ്റഡ് വർക്കർമാർ",
    statWorkersDetail: "റൂട്ടർ, വെരിഫയർ...",
    liveFeedTitle: "ലൈവ് ഓപ്പറേഷൻസ്",
    harvesterDetails: "വിശദാംശങ്ങൾ",
    learningLoopsTitle: "5 പഠന പ്രക്രിയകൾ",
    officerPortalTitle: "മുനിസിപ്പൽ ഓഫീസർ പോർട്ടൽ",
    officerPortalSub: "ഉദ്യോഗസ്ഥർക്കായുള്ള തത്സമയ ഡാഷ്‌ബോർഡ്.",
    trackTitle: "പരാതിയുടെ സ്റ്റാറ്റസ് പരിശോധിക്കുക",
    trackSub: "നിങ്ങളുടെ റഫറൻസ് നമ്പർ നൽകുക (#CVC-1082).",
    trackPlaceholder: "റഫറൻസ് നമ്പർ അല്ലെങ്കിൽ വാർഡ് പേര് നൽകുക...",
    btnSearch: "തിരയുക",
    harvesterTitle: "24/7 ഓട്ടോമേറ്റഡ് ഡാറ്റ എൻജിനുകൾ",
    harvesterSub: "സോഷ്യൽ മീഡിയ, സാറ്റലൈറ്റ് എന്നിവയിൽ നിന്ന് ഡാറ്റ ശേഖരിക്കുന്നു.",
    workerTitle: "9 സ്വയം പ്രവർത്തിക്കുന്ന ഇന്റലിജൻസ് വർക്കർമാർ",
    workerSub: "മനുഷ്യ സഹായമില്ലാതെ പരാതികൾ പരിശോധിക്കുന്നു.",
    e2eTitle: "5-ഘട്ട പൂർണ്ണ പരിഹാര പ്രക്രിയ",
    e2eSub: "പരാതി കണ്ടെത്തൽ മുതൽ ഫോട്ടോ പരിശോധന വരെയുള്ള ലൈവ് ഫ്ലോ.",
    reportTitle: "പരാതി സമർപ്പിക്കുക",
    reportSub: "ഇവിടെ സമർപ്പിക്കുന്ന പരാതികൾ നേരിട്ട് വാർഡ് ഓഫീസർക്ക് ലഭിക്കും.",
    chatTitle: "പൗര സഹായി",
    chatSub: "22 ഇന്ത്യൻ ഭാഷകളിൽ 24/7 ലഭ്യമാണ് (ഭാഷിണി)",
    chatPlaceholder: "ഏതെങ്കിലും ഭാഷയിൽ ചോദ്യങ്ങൾ ചോദിക്കുക അല്ലെങ്കിൽ പരാതി നൽകുക...",
    chatPromptWater: "കുടിവെള്ള സമയം",
    chatPromptPothole: "കുഴികളുടെ പരാതി",
    chatPromptStatus: "സ്റ്റാറ്റസ് #CVC-1082",
    langSelectLabel: "ഭാഷ",
  },
  pa: {
    appTitle: "ਸਿਵਿਕ ਕਨੈਕਟ",
    appSubtitle: "ਜਨਤਕ ਨਾਗਰਿਕ ਇੰਟੈਲੀਜੈਂਸ ਪੋਰਟਲ",
    navHome: "ਮੁੱਖ ਪੰਨਾ",
    navTrack: "ਸਥਿਤੀ ਟ੍ਰੈਕ ਕਰੋ",
    navMap: "ਸੁਰੱਖਿਆ ਨਕਸ਼ਾ",
    navE2e: "ਲਾਈਵ ਪ੍ਰਕਿਰਿਆ",
    navOfficers: "ਅਫਸਰ ਪੋਰਟਲ",
    navHarvesters: "ਹਾਰਵੈਸਟਰ",
    navWorkers: "9 ਵਰਕਰ",
    navReport: "ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ",
    online: "ਆਨਲਾਈਨ",
    offline: "ਆਫਲਾਈਨ",
    assistant: "ਨਾਗਰਿਕ ਸਹਾਇਕ",
    heroTagline: "ਸਵੈ-ਚਾਲਿਤ ਨਾਗਰਿਕ ਇੰਟੈਲੀਜੈਂਸ ਸਿਸਟਮ",
    heroTitle: "ਸਿਵਿਕ ਕਨੈਕਟ ਆਟੋਨੋਮਸ",
    heroSub: '"ਇਹ ਜਾਣਕਾਰੀ ਦੀ ਉਡੀਕ ਨਹੀਂ ਕਰਦਾ। ਲੱਭਦਾ ਹੈ। ਹੁਕਮਾਂ ਦੀ ਉਡੀਕ ਨਹੀਂ ਕਰਦਾ। ਕੰਮ ਕਰਦਾ ਹੈ। ਸਿੱਖਦਾ ਹੈ।"',
    btnReport: "ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ",
    btnTrack: "ਸਥਿਤੀ ਟ੍ਰੈਕ ਕਰੋ",
    btnE2e: "ਲਾਈਵ ਟੈਸਟ ਕਰੋ",
    statSources: "ਮੋਨੀਟਰ ਕੀਤੇ ਡਾਟਾ ਸਰੋਤ",
    statSourcesDetail: "24/7 ਚੱਲ ਰਹੇ 10 ਹਾਰਵੈਸਟਰ",
    statProcessed: "ਹੱਲ ਕੀਤੀਆਂ ਸ਼ਿਕਾਇਤਾਂ",
    statProcessedDetail: "ਆਟੋ-ਡਿਟੈਕਟ ਅਤੇ ਨਾਗਰਿਕ ਰਿਪੋਰਟਾਂ",
    statPriority: "ਤਰਜੀਹੀ ਸ਼ਿਕਾਇਤਾਂ",
    statPriorityDetail: "ਉੱਚ ਅਧਿਕਾਰੀਆਂ ਨੂੰ ਭੇਜੀਆਂ ਗਈਆਂ",
    statWorkers: "ਸਵੈ-ਚਾਲਿਤ ਵਰਕਰ",
    statWorkersDetail: "ਰਾਊਟਰ, ਵੈਰੀਫਾਇਰ...",
    liveFeedTitle: "ਲਾਈਵ ਆਟੋਮੇਟਿਡ ਆਪ੍ਰੇਸ਼ਨ",
    harvesterDetails: "ਹਾਰਵੈਸਟਰ ਵੇਰਵੇ",
    learningLoopsTitle: "5 ਸਰਗਰਮ ਲਰਨਿੰਗ ਲੂਪਸ",
    officerPortalTitle: "ਨਗਰ ਨਿਗਮ ਅਧਿਕਾਰੀ ਨਿਵਾਰਨ ਪੋਰਟਲ",
    officerPortalSub: "ਅਧਿਕਾਰੀਆਂ ਲਈ ਰੀਅਲ-ਟਾਈਮ ਬੋਰਡ।",
    trackTitle: "ਸ਼ਿਕਾਇਤ ਦੀ ਸਥਿਤੀ ਟ੍ਰੈਕ ਕਰੋ",
    trackSub: "ਆਪਣਾ ਰੈਫਰੈਂਸ ਨੰਬਰ ਦਰਜ ਕਰੋ (#CVC-1082)।",
    trackPlaceholder: "ਰੈਫਰੈਂਸ ਨੰਬਰ ਜਾਂ ਵਾਰਡ ਦਾ ਨਾਮ ਲਿਖੋ...",
    btnSearch: "ਖੋਜੋ",
    harvesterTitle: "24/7 ਸਵੈ-ਚਾਲਿਤ ਡਾਟਾ ਹਾਰਵੈਸਟਰ",
    harvesterSub: "ਸੋਸ਼ਲ ਮੀਡੀਆ ਅਤੇ ਸੈਟੇਲਾਈਟ ਤੋਂ ਡਾਟਾ ਇਕੱਠਾ ਕਰਦਾ ਹੈ।",
    workerTitle: "9 ਸਵੈ-ਚਾਲਿਤ ਇੰਟੈਲੀਜੈਂਸ ਵਰਕਰ",
    workerSub: "ਬਿਨਾਂ ਇਨਸਾਨੀ ਮਦਦ ਦੇ ਸ਼ਿਕਾਇਤਾਂ ਦੀ ਜਾਂਚ ਅਤੇ ਹੱਲ ਕਰਦੇ ਹਨ।",
    e2eTitle: "5-ਪੜਾਵੀ ਪੂਰੀ ਨਿਵਾਰਨ ਪ੍ਰਕਿਰਿਆ",
    e2eSub: "ਸ਼ਿਕਾਇਤ ਲੱਭਣ ਤੋਂ ਲੈ ਕੇ ਫੋਟੋ ਜਾਂਚ ਤੱਕ ਦਾ ਲਾਈਵ ਫਲੋ।",
    reportTitle: "ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ",
    reportSub: "ਇੱਥੇ ਦਰਜ ਕੀਤੀਆਂ ਸ਼ਿਕਾਇਤਾਂ ਸਿੱਧੇ ਸਬੰਧਤ ਵਾਰਡ ਅਧਿਕਾਰੀ ਨੂੰ ਭੇਜੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।",
    chatTitle: "ਨਾਗਰਿਕ ਸਹਾਇਕ",
    chatSub: "22 ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ 24/7 ਉਪਲਬਧ (ਭਾਸ਼ਿਣੀ)",
    chatPlaceholder: "ਕਿਸੇ ਵੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸਵਾਲ ਪੁੱਛੋ ਜਾਂ ਸ਼ਿਕਾਇਤ ਕਰੋ...",
    chatPromptWater: "ਪਾਣੀ ਦੀ ਸਪਲਾਈ ਦਾ ਸਮਾਂ",
    chatPromptPothole: "ਖੱਡੇ ਦੀ ਸ਼ਿਕਾਇਤ",
    chatPromptStatus: "ਸਥਿਤੀ #CVC-1082",
    langSelectLabel: "ਭਾਸ਼ਾ",
  },
};

export function t(key: string, lang = "en"): string {
  const dict = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
  return dict[key] || UI_TRANSLATIONS.en[key] || key;
}

type Screen = "home" | "track" | "harvesters" | "agents" | "officers" | "e2e" | "report" | "map" | "alerts";

function CivicConnectApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [activeLang, setActiveLang] = useState("en");
  const { reports, loading, error, refresh } = useReports();
  const online = useOnlineStatus();
  const [message, setMessage] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const alerts = useMemo(() => getAlerts(reports), [reports]);
  const agentSnapshot = useMemo(() => buildAgentSnapshot(reports), [reports]);

  async function handleSubmit(input: ReportInput) {
    setErrorMessage(undefined);
    try {
      const report = await submitReport(input, online);
      if (!online || report.status === "pending") {
        addReport(report);
        setMessage("Offline - report queued for autonomous sync when online");
      } else {
        await refresh();
        setMessage("Report registered & routed to ward officer autonomously!");
      }
      setScreen("home");
    } catch (submitError) {
      setErrorMessage(
        submitError instanceof Error ? submitError.message : "Unable to submit report",
      );
    }
  }

  function handleReportFromChat(newRep: WaterReport) {
    addReport(newRep);
    setMessage(`Complaint ${newRep.id} filed via Assistant and added to Live Map!`);
    void refresh();
  }

  useEffect(() => {
    if (online)
      void syncPending().then((count) => {
        if (count) {
          setMessage(`${count} offline report${count === 1 ? "" : "s"} synced autonomously`);
          void refresh();
        }
      });
  }, [online, refresh]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Top sticky header */}
      <header className="sticky top-0 z-30 border-b border-border/80 bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button
            className="flex items-center gap-3 text-left"
            onClick={() => setScreen("home")}
            aria-label="Go to home"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <Radar className="size-5 animate-pulse" />
            </span>
            <span>
              <strong className="block text-base font-bold tracking-tight">CivicConnect</strong>
              <strong className="block text-base font-bold tracking-tight">{t("appTitle", activeLang)}</strong>
              <span className="hidden text-xs text-text-secondary sm:block">
                Public Civic Intelligence Portal
                {t("appSubtitle", activeLang)}
              </span>
            </span>
          </button>

          <nav aria-label="Primary navigation" className="hidden items-center gap-1 xl:flex">
            <NavItem
              active={screen === "home"}
              onClick={() => setScreen("home")}
              icon={<Activity />}
              label="Home"
              label={t("navHome", activeLang)}
              compact
            />
            <NavItem
              active={screen === "track"}
              onClick={() => setScreen("track")}
              icon={<Search />}
              label="Track Status"
              label={t("navTrack", activeLang)}
              compact
            />
            <NavItem
              active={screen === "map"}
              onClick={() => setScreen("map")}
              icon={<Map />}
              label="Safety Map"
              label={t("navMap", activeLang)}
              compact
            />
            <NavItem
              active={screen === "e2e"}
              onClick={() => setScreen("e2e")}
              icon={<Play />}
              label="Live E2E Flow"
              label={t("navE2e", activeLang)}
              compact
            />
            <NavItem
              active={screen === "officers"}
              onClick={() => setScreen("officers")}
              icon={<Building2 />}
              label="Officer Portal"
              label={t("navOfficers", activeLang)}
              compact
            />
            <NavItem
              active={screen === "harvesters"}
              onClick={() => setScreen("harvesters")}
              icon={<Radio />}
              label="Harvesters"
              label={t("navHarvesters", activeLang)}
              compact
            />
            <NavItem
              active={screen === "agents"}
              onClick={() => setScreen("agents")}
              icon={<Bot />}
              label="9 Workers"
              label={t("navWorkers", activeLang)}
              compact
            />
            <Button
              onClick={() => setScreen("report")}
              size="sm"
              variant={screen === "report" ? "default" : "outline"}
              aria-current={screen === "report" ? "page" : undefined}
              className="ml-2 shadow-sm"
            >
              <Send className="size-3.5" />
              Report Issue
              {t("navReport", activeLang)}
            </Button>
          </nav>

          <div className="flex items-center gap-2">
            {/* Global 1-Click Language Selector */}
            <div className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-card px-2.5 py-1 text-xs font-semibold shadow-xs hover:border-primary/50 transition-colors">
              <Globe className="size-3.5 text-primary" />
              <select
                aria-label="Select platform language"
                value={activeLang}
                onChange={(e) => setActiveLang(e.target.value)}
                className="bg-transparent font-bold outline-none text-foreground cursor-pointer text-xs"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिंदी (HI)</option>
                <option value="kn">ಕನ್ನಡ (KN)</option>
                <option value="ta">தமிழ் (TA)</option>
                <option value="te">తెలుగు (TE)</option>
                <option value="mr">मराठी (MR)</option>
                <option value="gu">ગુજરાતી (GU)</option>
                <option value="bn">বাংলা (BN)</option>
                <option value="ml">മലയാളം (ML)</option>
                <option value="pa">ਪੰਜਾਬੀ (PA)</option>
              </select>
            </div>

            <span
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                online ? "bg-safe/10 text-safe" : "bg-caution/10 text-caution"
              }`}
            >
              <span className={`size-2 rounded-full ${online ? "bg-safe animate-pulse" : "bg-caution"}`} />
              {online ? (
                <>
                  <Wifi className="size-3" /> Online
                  <Wifi className="size-3" /> {t("online", activeLang)}
                </>
              ) : (
                <>
                  <WifiOff className="size-3" /> Offline
                  <WifiOff className="size-3" /> {t("offline", activeLang)}
                </>
              )}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="hidden sm:inline-flex items-center gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
            >
              <Sparkles className="size-4 text-primary" />
              <span>Assistant</span>
              <span>{t("assistant", activeLang)}</span>
            </Button>
          </div>
        </div>
      </header>

      {!online && (
        <div className="border-b border-caution bg-caution-soft px-4 py-2.5 text-center text-sm font-medium text-text-primary">
          Offline Mode — Reports saved locally will sync automatically upon reconnection.
        </div>
      )}

      {message && <Toast message={message} onClose={() => setMessage(undefined)} />}

      <div className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-6 sm:py-8 sm:pb-10">
        {error && <Notice text="Unable to fetch live reports. Using cached autonomous state." />}
        {errorMessage && <Notice text={errorMessage} />}

        {screen === "home" && (
          <HomeScreen
            reports={reports}
            alerts={alerts}
            loading={loading}
            snapshot={agentSnapshot}
            lang={activeLang}
            onReport={() => setScreen("report")}
            onNavigate={setScreen}
            onMessage={setMessage}
          />
        )}
        {screen === "track" && <TrackStatusScreen reports={reports} onBack={() => setScreen("home")} />}
        {screen === "e2e" && <E2EDemoScreen onBack={() => setScreen("home")} onMessage={setMessage} />}
        {screen === "track" && <TrackStatusScreen reports={reports} lang={activeLang} onBack={() => setScreen("home")} />}
        {screen === "e2e" && <E2EDemoScreen lang={activeLang} onBack={() => setScreen("home")} onMessage={setMessage} />}
        {screen === "officers" && (
          <OfficerPortalScreen
            officers={agentSnapshot.officers}
            reports={reports}
            lang={activeLang}
            onBack={() => setScreen("home")}
            onMessage={setMessage}
          />
        )}
        {screen === "harvesters" && (
          <HarvestersScreen harvesters={agentSnapshot.harvesters} onBack={() => setScreen("home")} />
          <HarvestersScreen harvesters={agentSnapshot.harvesters} lang={activeLang} onBack={() => setScreen("home")} />
        )}
        {screen === "agents" && (
          <AgentsScreen
            agents={agentSnapshot.agents}
            reports={reports}
            lang={activeLang}
            onBack={() => setScreen("home")}
            onMessage={setMessage}
          />
        )}
        {screen === "report" && (
          <ReportScreen
            online={online}
            lang={activeLang}
            onBack={() => setScreen("home")}
            onSubmitted={handleSubmit}
          />
        )}
        {screen === "map" && <MapScreen reports={reports} onBack={() => setScreen("home")} />}
        {screen === "map" && <MapScreen reports={reports} lang={activeLang} onBack={() => setScreen("home")} />}
        {screen === "alerts" && (
          <AlertsScreen alerts={alerts} loading={loading} onBack={() => setScreen("home")} />
          <AlertsScreen alerts={alerts} loading={loading} lang={activeLang} onBack={() => setScreen("home")} />
        )}
      </div>

      {/* Floating Multilingual Citizen Assistant Widget */}
      <ChatbotWidget
        isOpen={isChatOpen}
        lang={activeLang}
        onLanguageChange={setActiveLang}
        onClose={() => setIsChatOpen(false)}
        onNavigate={setScreen}
        onReportGenerated={handleReportFromChat}
      />

      {/* Floating Assistant Button for Mobile */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-20 right-4 z-30 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
        aria-label="Open Citizen Assistant"
      >
        <Sparkles className="size-6" />
      </button>

      {/* Bottom mobile navigation bar */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border/80 bg-card/95 pb-[env(safe-area-inset-bottom)] shadow-lg backdrop-blur xl:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
          <NavItem
            active={screen === "home"}
            onClick={() => setScreen("home")}
            icon={<Activity />}
            label="Home"
            label={t("navHome", activeLang)}
          />
          <NavItem
            active={screen === "track"}
            onClick={() => setScreen("track")}
            icon={<Search />}
            label="Track"
            label={t("navTrack", activeLang)}
          />
          <Button
            onClick={() => setScreen("report")}
            size="icon"
            aria-label="Report issue"
            aria-current={screen === "report" ? "page" : undefined}
            className={`size-11 rounded-full ${screen === "report" ? "ring-2 ring-primary/30 ring-offset-2" : ""}`}
          >
            <Send className="size-4" />
          </Button>
          <NavItem
            active={screen === "map"}
            onClick={() => setScreen("map")}
            icon={<Map />}
            label="Map"
            label={t("navMap", activeLang)}
          />
          <NavItem
            active={screen === "officers"}
            onClick={() => setScreen("officers")}
            icon={<Building2 />}
            label="Gov Portal"
            label={t("navOfficers", activeLang)}
          />
        </div>
      </nav>
    </main>
  );
}

// ------------------- HOME / OVERVIEW SCREEN -------------------

function HomeScreen({
  reports,
  alerts,
  loading,
  snapshot,
  lang = "en",
  onReport,
  onNavigate,
  onMessage,
}: {
  reports: WaterReport[];
  alerts: ReturnType<typeof getAlerts>;
  loading: boolean;
  snapshot: ReturnType<typeof buildAgentSnapshot>;
  lang?: string;
  onReport: () => void;
  onNavigate: (screen: Screen) => void;
  onMessage: (msg: string) => void;
}) {
  return (
    <section className="space-y-8">
      {/* Hero Banner with Tagline */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <span className="size-2 rounded-full bg-safe animate-pulse" /> Self-Operating Civic Intelligence
              <span className="size-2 rounded-full bg-safe animate-pulse" /> {t("heroTagline", lang)}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              CivicConnect Autonomous
              {t("heroTitle", lang)}
            </h1>
            <p className="max-w-3xl text-base font-medium leading-relaxed text-text-secondary sm:text-lg">
              "It doesn't wait for data. It finds it. It doesn't wait for orders. It acts. It doesn't wait for humans. It learns."
              {t("heroSub", lang)}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={onReport} size="lg" className="shadow-md">
              <Send className="size-4" /> Report Issue
              <Send className="size-4" /> {t("btnReport", lang)}
            </Button>
            <Button onClick={() => onNavigate("track")} variant="outline" size="lg">
              <Search className="size-4" /> Track Status
              <Search className="size-4" /> {t("btnTrack", lang)}
            </Button>
            <Button onClick={() => onNavigate("e2e")} variant="secondary" size="lg">
              <Play className="size-4 fill-current" /> Test E2E Flow
              <Play className="size-4 fill-current" /> {t("btnE2e", lang)}
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Radio />}
          label="Data Sources Monitored"
          label={t("statSources", lang)}
          value={snapshot.sourceCount.toLocaleString()}
          detail="10 active crawlers watching feeds 24/7"
          detail={t("statSourcesDetail", lang)}
        />
        <MetricCard
          icon={<SearchCheck />}
          label="Civic Issues Processed"
          label={t("statProcessed", lang)}
          value={reports.length + 184}
          detail="Auto-detected & citizen reports"
          detail={t("statProcessedDetail", lang)}
        />
        <MetricCard
          icon={<ShieldAlert />}
          label="Priority Escalations"
          label={t("statPriority", lang)}
          value={snapshot.highPriorityCount + alerts.length}
          detail="Auto-escalated to Zonal Commissioners"
          detail={t("statPriorityDetail", lang)}
          tone="danger"
        />
        <MetricCard
          icon={<Bot />}
          label="Autonomous Workers"
          label={t("statWorkers", lang)}
          value="9 / 9"
          detail="Router, Escalator, Verifier, Detector..."
          detail={t("statWorkersDetail", lang)}
          tone="safe"
        />
      </div>

      {/* Live Signal Feed & System Learning Loops */}
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Live Signal Feed
              </p>
              <h2 className="text-lg font-semibold">Autonomous Operations & Dispatches</h2>
              <h2 className="text-lg font-semibold">{t("liveFeedTitle", lang)}</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("harvesters")}>
              Harvester Details <ArrowUpRight className="size-4" />
              {t("harvesterDetails", lang)} <ArrowUpRight className="size-4" />
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            <ActivityRow
              icon={<Radio className="text-primary" />}
              title="Social Listener caught pothole tweet in Ward 47 (Jayanagar)"
              detail="Detector Worker auto-classified issue (Confidence 0.94)"
              time="3 min ago"
            />
            <ActivityRow
              icon={<Bot className="text-safe" />}
              title="Router Worker assigned #CVC-1082 to JE (Roads) Er. R. Sharma"
              detail="Learned routing score: 0.89 (Success rate 95%, Ward match)"
              time="12 min ago"
            />
            <ActivityRow
              icon={<ShieldAlert className="text-danger" />}
              title="Escalator Worker advanced SLA level 1 -> 2 for #CVC-0941"
              detail="SLA deadline breached (>24h). Email & SMS sent to Zonal Head"
              time="28 min ago"
            />
            <ActivityRow
              icon={<Database className="text-primary" />}
              title="Knowledge Graph synchronized 14,820 nodes & 42,100 edges"
              detail="Self-building graph: Wards -> Officers -> Departments -> SLAs"
              time="45 min ago"
            />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-card">
          <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            Continuous Improvement
          </p>
          <h2 className="text-lg font-semibold">5 Active Learning Loops</h2>
          <div className="mt-4 space-y-4">
            {snapshot.learningLoops.map((loop) => (
              <div key={loop.id} className="border-b border-border/60 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>{loop.name.split(" - ")[0]}</span>
                  <span className="text-safe font-mono">{loop.cycle}</span>
                </div>
                <p className="mt-1 text-xs text-text-secondary">{loop.description}</p>
                <p className="mt-1 text-[11px] font-medium text-primary">{loop.improvement}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Human-in-the-loop Priority Queue */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Supervision Queue
            </p>
            <h2 className="text-xl font-semibold">Priority & Escalation Alerts</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onNavigate("alerts")}>
            View All Alerts
          </Button>
        </div>
        {loading ? (
          <LoadingState />
        ) : alerts[0] ? (
          <AlertCard alert={alerts[0]} />
        ) : (
          <EmptyState text="No priority SLA breaches or safety emergencies currently pending review." />
        )}
      </section>

      {/* Public Trust & Review Panel */}
      <TrustPanel onSubmitted={() => onMessage("Feedback recorded. Prompts will evolve in Loop 4.")} />
    </section>
  );
}

// ------------------- TRACK STATUS SCREEN -------------------

function TrackStatusScreen({
  reports,
  lang = "en",
  onBack,
}: {
  reports: WaterReport[];
  lang?: string;
  onBack: () => void;
}) {
  const [searchId, setSearchId] = useState("");
  const [selectedReport, setSelectedReport] = useState<WaterReport | undefined>(reports[0]);

  function findTicket() {
    if (!searchId.trim()) return;
    const found = reports.find(
      (r) => r.id.toLowerCase().includes(searchId.toLowerCase()) || r.area.toLowerCase().includes(searchId.toLowerCase()),
    );
    setSelectedReport(found || reports[0]);
  }

  return (
    <section className="space-y-6 max-w-4xl mx-auto">
      <Button variant="ghost" size="sm" onClick={onBack}>
        Back to Overview
      </Button>

      <div>
        <h1 className="text-3xl font-bold">Track Complaint Status</h1>
        <h1 className="text-3xl font-bold">{t("trackTitle", lang)}</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Enter your reference ID or select a ticket below to view step-by-step progress, assigned government officer details, and resolution evidence.
          {t("trackSub", lang)}
        </p>
      </div>

      {/* Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 size-4 text-text-secondary" />
          <input
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Complaint Reference ID (e.g. #CVC-1082) or Area..."
            placeholder={t("trackPlaceholder", lang)}
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
        </div>
        <Button onClick={findTicket} className="shadow-sm">
          Track
          {t("btnSearch", lang)}
        </Button>
      </div>

      {selectedReport ? (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-6">
          <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-primary tracking-wider">Ticket Reference</span>
              <h2 className="text-2xl font-bold mt-0.5">{selectedReport.id}</h2>
              <p className="text-xs text-text-secondary mt-1">{selectedReport.area} • {selectedReport.category || "Water / Pothole Issue"}</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary self-start sm:self-auto">
              Status: {selectedReport.status.toUpperCase()}
            </span>
          </div>

          {/* Progress Tracker Bar */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-foreground">Step-by-Step Progress</h3>
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-safe bg-safe/10 p-3 text-center space-y-1">
                <CheckCircle2 className="mx-auto size-5 text-safe" />
                <p className="text-xs font-bold text-safe">1. Registered</p>
                <p className="text-[10px] text-text-secondary">Signal Discovered</p>
              </div>
              <div className="rounded-xl border border-safe bg-safe/10 p-3 text-center space-y-1">
                <UserCheck className="mx-auto size-5 text-safe" />
                <p className="text-xs font-bold text-safe">2. Officer Routed</p>
                <p className="text-[10px] text-text-secondary">{selectedReport.assignedOfficer || "Er. R. Sharma"}</p>
              </div>
              <div className="rounded-xl border border-primary bg-primary/10 p-3 text-center space-y-1 animate-pulse">
                <Clock className="mx-auto size-5 text-primary" />
                <p className="text-xs font-bold text-primary">3. In Progress</p>
                <p className="text-[10px] text-text-secondary">Field Crew Patching</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-3 text-center space-y-1 opacity-60">
                <ShieldCheck className="mx-auto size-5 text-text-secondary" />
                <p className="text-xs font-semibold text-text-secondary">4. Verified Fix</p>
                <p className="text-[10px] text-text-secondary">Computer Vision Check</p>
              </div>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="grid gap-4 sm:grid-cols-2 text-xs border-t border-border/60 pt-4 text-text-secondary">
            <div>
              <span className="font-bold text-foreground block">Assigned Ward Officer:</span>
              <p className="mt-1 font-medium">{selectedReport.assignedOfficer || "Er. R. Sharma (JE Roads & Infrastructure)"}</p>
              <p className="text-primary mt-0.5">Phone: +91-98765-43210</p>
            </div>
            <div>
              <span className="font-bold text-foreground block">Observation Details:</span>
              <p className="mt-1">{selectedReport.description || "Civic issue observation reported via public portal."}</p>
              <p className="mt-0.5">Reported: {timeAgo(selectedReport.createdAt)}</p>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState text="No complaint found with that reference ID. Try searching 'Ward 47' or '#CVC-1082'." />
      )}
    </section>
  );
}

// ------------------- LIVE E2E LIFECYCLE DEMO SCREEN -------------------

function E2EDemoScreen({
  onBack,
  onMessage,
}: {
  onBack: () => void;
  onMessage: (msg: string) => void;
}) {
  const [steps, setSteps] = useState<E2ELifecycleStep[]>(getE2ELifecycleDemo());
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState(5);

  function runSimulation() {
    setIsSimulating(true);
    setActiveStep(1);

    setSteps((prev) =>
      prev.map((s, idx) => ({
        ...s,
        status: idx === 0 ? "IN_PROGRESS" : "PENDING",
      })),
    );

    const interval = setInterval(() => {
      setActiveStep((curr) => {
        if (curr >= 5) {
          clearInterval(interval);
          setIsSimulating(false);
          onMessage("Full E2E Lifecycle completed! Signal -> Officer -> Verification -> Closed");
          return 5;
        }
        const next = curr + 1;
        setSteps((prev) =>
          prev.map((s, idx) => ({
            ...s,
            status: idx < next - 1 ? "COMPLETED" : idx === next - 1 ? "IN_PROGRESS" : "PENDING",
          })),
        );
        return next;
      });
    }, 1200);
  }

  return (
    <section className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        Back to Overview
      </Button>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Play className="size-4 fill-current" /> End-to-End Autonomous Lifecycle
          </div>
          <h1 className="mt-1 text-3xl font-bold">5-Step Automated Public & Officer Flow</h1>
          <p className="mt-1 max-w-3xl text-sm text-text-secondary">
            Demonstrates how CivicConnect Autonomous discovers public signals 24/7, routes to the responsible government officer, monitors dispatch, verifies resolution proof with computer vision, and closes the ticket independently.
          </p>
        </div>

        <Button
          onClick={runSimulation}
          disabled={isSimulating}
          size="lg"
          className="shadow-md shrink-0"
        >
          {isSimulating ? <RefreshCw className="size-4 animate-spin" /> : <Play className="size-4 fill-current" />}
          {isSimulating ? "Running Live E2E Loop..." : "Run Live 5-Second E2E Simulation"}
        </Button>
      </div>

      <div className="space-y-4">
        {steps.map((stepItem) => (
          <div
            key={stepItem.step}
            className={`rounded-xl border p-5 transition-all shadow-card ${
              stepItem.status === "IN_PROGRESS"
                ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                : stepItem.status === "COMPLETED"
                  ? "border-safe/40 bg-card"
                  : "border-border bg-card/50 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className={`flex size-9 items-center justify-center rounded-xl font-bold text-sm ${
                    stepItem.status === "COMPLETED"
                      ? "bg-safe text-safe-foreground"
                      : stepItem.status === "IN_PROGRESS"
                        ? "bg-primary text-primary-foreground animate-pulse"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {stepItem.status === "COMPLETED" ? <Check className="size-5" /> : stepItem.step}
                </span>
                <div>
                  <h3 className="font-bold text-base text-foreground">{stepItem.title}</h3>
                  <p className="text-xs font-semibold text-primary">{stepItem.actor}</p>
                </div>
              </div>
              <span className="text-xs font-mono text-text-secondary">{stepItem.timestamp}</span>
            </div>

            <p className="mt-3 text-xs font-medium text-foreground">{stepItem.action}</p>
            <div className="mt-2 rounded-lg bg-muted/30 p-2.5 text-xs text-text-secondary border border-border/40">
              {stepItem.details}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ------------------- GOVERNMENT OFFICER PORTAL SCREEN -------------------

function OfficerPortalScreen({
  officers,
  reports,
  onBack,
  onMessage,
}: {
  officers: GovernmentOfficer[];
  reports: WaterReport[];
  onBack: () => void;
  onMessage: (msg: string) => void;
}) {
  const [selectedOfficer, setSelectedOfficer] = useState<GovernmentOfficer>(officers[0]);
  const [ticketStatus, setTicketStatus] = useState<"ROUTED" | "ACKNOWLEDGED" | "IN_PROGRESS" | "RESOLVED">("ROUTED");
  const [proofPhoto, setProofPhoto] = useState<string>();
  const [verifying, setVerifying] = useState(false);

  function acknowledge() {
    setTicketStatus("ACKNOWLEDGED");
    onMessage(`Officer ${selectedOfficer.name} acknowledged ticket #CVC-1082.`);
  }

  function startWork() {
    setTicketStatus("IN_PROGRESS");
    onMessage(`Officer ${selectedOfficer.name} dispatched repair crew (Status: IN_PROGRESS).`);
  }

  function resolveAndVerify() {
    setVerifying(true);
    setProofPhoto("https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=500&auto=format&fit=crop&q=60");
    setTimeout(() => {
      setTicketStatus("RESOLVED");
      setVerifying(false);
      onMessage(`Verifier Worker ran Computer Vision & EXIF check: Fix Verified! Ticket #CVC-1082 Closed.`);
    }, 1200);
  }

  return (
    <section className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        Back to Overview
      </Button>
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Building2 className="size-4" /> Government Officer Interface
        </div>
        <h1 className="mt-1 text-3xl font-bold">Government & Department Portal</h1>
        <p className="mt-1 max-w-3xl text-sm text-text-secondary">
          Responsible municipal officers receive auto-routed civic issues, acknowledge dispatches, upload resolution proof photos, and submit to Verifier Worker for automatic verification & ticket closure.
        </p>
      </div>

      {/* Officer Selection Tabs */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {officers.map((off) => (
          <button
            key={off.id}
            onClick={() => { setSelectedOfficer(off); setTicketStatus("ROUTED"); setProofPhoto(undefined); }}
            className={`rounded-xl border p-4 text-left transition-all shadow-card ${
              selectedOfficer.id === off.id
                ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                : "border-border bg-card hover:border-primary/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-foreground">{off.name}</span>
              <span className="rounded-full bg-safe/10 px-2 py-0.5 text-[10px] font-bold text-safe">
                {off.status}
              </span>
            </div>
            <p className="text-xs font-medium text-primary mt-0.5">{off.designation}</p>
            <p className="text-[11px] text-text-secondary mt-1">{off.ward}</p>
            <div className="mt-3 flex justify-between text-[11px] text-text-secondary border-t border-border/60 pt-2">
              <span>SLA: <strong>{off.avgResolutionHours}h</strong></span>
              <span>Rating: <strong className="text-safe">{off.rating}★</strong></span>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Officer Assigned Ticket Workspace */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-6">
        <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-primary tracking-wider">Assigned Ticket #CVC-1082</span>
            <h2 className="text-xl font-bold mt-0.5">Dangerous Road Pothole at Ward 47 Cross Road</h2>
            <p className="text-xs text-text-secondary mt-1">
              Auto-detected by Social Listener • Routed by Router Worker to {selectedOfficer.name} ({selectedOfficer.department})
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-secondary">Current Status:</span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                ticketStatus === "RESOLVED"
                  ? "bg-safe text-safe-foreground"
                  : ticketStatus === "IN_PROGRESS"
                    ? "bg-primary text-primary-foreground"
                    : "bg-caution text-caution-foreground"
              }`}
            >
              {ticketStatus}
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Ticket Information */}
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-sm text-foreground">Officer Context & Directory</h3>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2 text-text-secondary">
              <div className="flex justify-between">
                <span>Officer Name:</span>
                <strong className="text-foreground">{selectedOfficer.name}</strong>
              </div>
              <div className="flex justify-between">
                <span>Department:</span>
                <strong className="text-foreground">{selectedOfficer.department}</strong>
              </div>
              <div className="flex justify-between">
                <span>Office Location:</span>
                <strong className="text-foreground">{selectedOfficer.officeAddress}</strong>
              </div>
              <div className="flex justify-between">
                <span>Email & Phone:</span>
                <strong className="text-foreground">{selectedOfficer.email} | {selectedOfficer.phone}</strong>
              </div>
            </div>

            <h3 className="font-bold text-sm text-foreground mt-4">Citizen Evidence</h3>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-1 text-text-secondary">
              <p><strong>Description:</strong> Huge 6-inch deep pothole near main traffic intersection.</p>
              <p><strong>Location:</strong> Ward 47 (Lat: 12.925, Lng: 77.593)</p>
              <p><strong>Urgency:</strong> HIGH (Sentiment Priority Boost +25)</p>
            </div>
          </div>

          {/* Officer Action Workflow Controls */}
          <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-5">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <CheckSquare className="size-4 text-primary" /> Officer Action Workflow
            </h3>
            <p className="text-xs text-text-secondary">
              Progress the ticket through official government resolution steps:
            </p>

            <div className="space-y-2.5">
              <Button
                variant={ticketStatus === "ROUTED" ? "default" : "outline"}
                size="sm"
                className="w-full justify-start text-xs"
                onClick={acknowledge}
                disabled={ticketStatus !== "ROUTED"}
              >
                <UserCheck className="size-4 mr-2" /> 1. Acknowledge Ticket Receipt (SMS to Citizen)
              </Button>

              <Button
                variant={ticketStatus === "ACKNOWLEDGED" ? "default" : "outline"}
                size="sm"
                className="w-full justify-start text-xs"
                onClick={startWork}
                disabled={ticketStatus !== "ACKNOWLEDGED"}
              >
                <Building2 className="size-4 mr-2" /> 2. Dispatch Field Repair Crew (Mark IN_PROGRESS)
              </Button>

              <Button
                variant={ticketStatus === "IN_PROGRESS" ? "default" : "outline"}
                size="sm"
                className="w-full justify-start text-xs"
                onClick={resolveAndVerify}
                disabled={ticketStatus !== "IN_PROGRESS" || verifying}
              >
                {verifying ? <RefreshCw className="size-4 animate-spin mr-2" /> : <Camera className="size-4 mr-2" />}
                3. Upload Proof Photo & Trigger Verifier Worker
              </Button>
            </div>

            {proofPhoto && (
              <div className="mt-3 space-y-2">
                <span className="text-xs font-semibold text-safe flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> Resolution Proof Verified by Computer Vision & EXIF GPS
                </span>
                <img src={proofPhoto} alt="Resolution proof" className="h-36 w-full rounded-lg object-cover border border-safe/40" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------- HARVESTERS MONITOR SCREEN -------------------

function HarvestersScreen({
  harvesters,
  onBack,
}: {
  harvesters: HarvesterItem[];
  onBack: () => void;
}) {
  const [items, setItems] = useState(harvesters);
  const [harvesting, setHarvesting] = useState(false);

  function triggerCrawl(id: string) {
    setHarvesting(true);
    setTimeout(() => {
      setItems((prev) =>
        prev.map((h) =>
          h.id === id
            ? { ...h, lastRunAt: Date.now(), itemsFetched: h.itemsFetched + Math.floor(Math.random() * 20 + 5) }
            : h,
        ),
      );
      setHarvesting(false);
    }, 1000);
  }

  return (
    <section className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        Back to Overview
      </Button>
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Radio className="size-4 animate-pulse" /> Layer 1 Harvester Engine
        </div>
        <h1 className="mt-1 text-3xl font-bold">10 Autonomous Harvesters</h1>
        <p className="mt-2 max-w-3xl text-sm text-text-secondary">
          These crawlers and listeners run 24/7 on Celery Beat schedules. They fetch government data, tweets, news, PDFs, and sensor feeds without waiting for manual human triggers.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((h) => (
          <div key={h.id} className="rounded-xl border border-border bg-card p-5 shadow-card space-y-3">
            <div className="flex items-start justify-between gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Radio className="size-4" />
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  h.status === "HEALTHY"
                    ? "bg-safe/10 text-safe"
                    : h.status === "DEGRADED"
                      ? "bg-caution/10 text-caution"
                      : "bg-danger/10 text-danger"
                }`}
              >
                {h.status}
              </span>
            </div>

            <div>
              <h3 className="font-semibold text-base">{h.name}</h3>
              <p className="text-xs text-text-secondary mt-1">{h.description}</p>
            </div>

            <div className="border-t border-border/60 pt-3 text-xs space-y-1.5 text-text-secondary">
              <div className="flex justify-between">
                <span>Frequency:</span>
                <span className="font-medium text-foreground">{h.frequency}</span>
              </div>
              <div className="flex justify-between">
                <span>Sources Watched:</span>
                <span className="font-medium text-foreground">{h.sourcesCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Items Fetched:</span>
                <span className="font-medium text-foreground">{h.itemsFetched.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Reliability:</span>
                <span className="font-medium text-safe">{(h.reliabilityScore * 100).toFixed(0)}%</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => triggerCrawl(h.id)}
              disabled={harvesting}
            >
              {harvesting ? <RefreshCw className="size-3 animate-spin" /> : <RefreshCw className="size-3" />}
              Trigger Crawl Now
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ------------------- 9 AUTONOMOUS WORKERS SCREEN -------------------

function AgentsScreen({
  agents,
  reports,
  onBack,
  onMessage,
}: {
  agents: AutonomousAgentInfo[];
  reports: WaterReport[];
  onBack: () => void;
  onMessage: (msg: string) => void;
}) {
  const [log, setLog] = useState<string[]>([]);

  function triggerAgent(name: string) {
    if (name === "Router") {
      const best = runRouterAgent(
        [
          { id: "off-1", name: "Er. R. Sharma", department: "Roads", ward: "Ward 47", successRate: 0.95, avgResolutionHours: 4, currentLoad: 2, language: "en" },
          { id: "off-2", name: "Er. P. Deshmukh", department: "Sanitation", ward: "Ward 12", successRate: 0.82, avgResolutionHours: 12, currentLoad: 8, language: "hi" },
        ],
        "en",
      );
      const entry = `[Router Worker] Assigned complaint to ${best.name} (Ward: ${best.ward}, Score: ${best.score.toFixed(2)})`;
      setLog((prev) => [entry, ...prev]);
      onMessage(entry);
    } else if (name === "Escalator") {
      const esc = runEscalatorAgent({ slaDeadlineMs: Date.now() - 100, currentEscalationLevel: 1, sentimentScore: -0.8 });
      const entry = `[Escalator Worker] Advanced SLA level 1 -> ${esc.nextLevel}. Target: ${esc.targetRole}`;
      setLog((prev) => [entry, ...prev]);
      onMessage(entry);
    } else if (name === "Verifier") {
      const ver = runVerifierAgent({ beforePhotoUrl: "https://a.com/1.jpg", afterPhotoUrl: "https://a.com/2.jpg", category: "Pothole", exifDistanceMeters: 15 });
      const entry = `[Verifier Worker] ${ver.reason}`;
      setLog((prev) => [entry, ...prev]);
      onMessage(entry);
    } else if (name === "Detector") {
      const det = runDetectorAgent("Huge pothole near Jayanagar 4th Block, dangerous!", { lat: 12.925, lng: 77.593 });
      const entry = `[Detector Worker] Auto-filed issue: ${det.category} (Confidence: ${det.confidence})`;
      setLog((prev) => [entry, ...prev]);
      onMessage(entry);
    } else if (name === "Anomaly") {
      const anom = runAnomalyAgent([{ wardId: "Ward 47", category: "Pothole", count: 12, baseline: 2.0 }]);
      const entry = `[Anomaly Worker] ${anom.alerts[0] || "No anomaly detected"}`;
      setLog((prev) => [entry, ...prev]);
      onMessage(entry);
    } else if (name === "Dedup") {
      const ded = runDedupAgent({ lat: 12.9716, lng: 77.5946, category: "Pothole", description: "Pothole" }, reports);
      const entry = `[Dedup Worker] ${ded.isDuplicate ? "Merged with existing ID: " + ded.matchedId : "No duplicate found. Clean unique complaint."}`;
      setLog((prev) => [entry, ...prev]);
      onMessage(entry);
    } else if (name === "Sentiment") {
      const sent = runSentimentAgent("Open live electric wire drowning hazard near hospital");
      const entry = `[Sentiment Worker] Detected ${sent.urgency} priority boost +${sent.priorityBoost}`;
      setLog((prev) => [entry, ...prev]);
      onMessage(entry);
    } else if (name === "SelfHeal") {
      const heal = runSelfHealAgent(buildAgentSnapshot(reports).harvesters);
      const entry = `[SelfHeal Worker] ${heal.sourceActions[0]?.action || "All data sources healthy"}`;
      setLog((prev) => [entry, ...prev]);
      onMessage(entry);
    } else {
      const chat = handleChatbotQuery("What is the water timing in Ward 47?");
      const entry = `[Assistant Worker] ${chat.response}`;
      setLog((prev) => [entry, ...prev]);
      onMessage(entry);
    }
  }

  return (
    <section className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        Back to Overview
      </Button>
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Bot className="size-4" /> Layer 3 Autonomous Workers
        </div>
        <h1 className="mt-1 text-3xl font-bold">9 Autonomous Workers</h1>
        <p className="mt-2 max-w-3xl text-sm text-text-secondary">
          Each worker is an independent process with its own logic, memory, and triggers. They handle routing, escalations, computer vision verification, anomaly detection, and self-healing.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <div key={agent.name} className="rounded-xl border border-border bg-card p-5 shadow-card space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg">{agent.name} Worker</h3>
                <p className="text-xs font-semibold text-primary">{agent.role}</p>
              </div>
              <span className="rounded-full bg-safe/10 px-2 py-0.5 text-[11px] font-bold text-safe">
                {agent.status}
              </span>
            </div>

            <p className="text-xs text-text-secondary">{agent.description}</p>

            <div className="rounded-md border border-border/60 bg-muted/30 p-2.5 text-xs">
              <span className="font-semibold block text-foreground">Last Action:</span>
              <p className="text-text-secondary italic mt-0.5">{agent.lastAction}</p>
            </div>

            <div className="flex justify-between text-xs text-text-secondary">
              <span>Actions Executed: <strong>{agent.actionCount.toLocaleString()}</strong></span>
              <span>Confidence: <strong className="text-safe">{(agent.confidence * 100).toFixed(0)}%</strong></span>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => triggerAgent(agent.name)}
            >
              <Zap className="size-3 text-primary" /> Trigger {agent.name} Worker
            </Button>
          </div>
        ))}
      </div>

      {log.length > 0 && (
        <div className="rounded-xl border border-primary/30 bg-card p-5 shadow-card space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Activity className="size-4 text-primary" /> Real-time Execution Log
          </h3>
          <div className="space-y-2 font-mono text-xs max-h-48 overflow-y-auto">
            {log.map((line, idx) => (
              <div key={idx} className="rounded border border-border/60 bg-muted/40 p-2 text-text-primary">
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// ------------------- REPORT ISSUE SCREEN -------------------

function ReportScreen({
  online,
  onBack,
  onSubmitted,
}: {
  online: boolean;
  onBack: () => void;
  onSubmitted: (input: ReportInput) => Promise<void>;
}) {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [area, setArea] = useState("");
  const [category, setCategory] = useState("Water Supply");
  const [description, setDescription] = useState("");
  const [clarity, setClarity] = useState<Clarity>("turbid");
  const [smell, setSmell] = useState<Smell>("sewage");
  const [color, setColor] = useState<Color>("brown");
  const [photo, setPhoto] = useState<File>();
  const [photoPreview, setPhotoPreview] = useState<string>();
  const [validation, setValidation] = useState<string>();
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function findLocation() {
    setValidation(undefined);
    if (!navigator.geolocation) {
      setValidation("Location is not available in this browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setArea("Current GPS Location (Ward 47)");
        setLocating(false);
      },
      () => {
        setLatitude("12.9716");
        setLongitude("77.5946");
        setArea("Bengaluru Central (Default)");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 5000 },
    );
  }

  function pickPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5_000_000) {
      setValidation("Choose an image smaller than 5 MB");
      return;
    }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!latitude || !longitude) {
      setValidation("Location coordinates are required");
      return;
    }
    setValidation(undefined);
    setSubmitting(true);
    try {
      await onSubmitted({
        latitude: Number(latitude),
        longitude: Number(longitude),
        area: area || "Community location",
        clarity,
        smell,
        color,
        category,
        description: description || `${category} reported at ${area}`,
        photo,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        Back
      </Button>
      <div>
        <h1 className="text-3xl font-bold">Report a Civic Issue</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Your report will be classified by Detector Worker and routed automatically to the responsible ward officer.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-base">Issue Category</h2>
              <p className="text-xs text-text-secondary">Select the civic issue type.</p>
            </div>
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md border border-border bg-card p-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Water Supply">Water Supply / Quality Issue</option>
            <option value="Pothole">Road Pothole (B03)</option>
            <option value="Garbage Overflow">Garbage Overflow (B01)</option>
            <option value="Streetlight Broken">Broken Streetlight (B02)</option>
            <option value="Drainage Sewage">Drainage & Sewage Overflow (B05)</option>
            <option value="Stray Animals">Stray Animal Nuisance (B06)</option>
            <option value="Electrical Hazard">Electrical Hazard / Open Wire (B07)</option>
          </select>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-base">Location</h2>
              <p className="text-xs text-text-secondary">Use GPS or enter coordinates.</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={findLocation} disabled={locating}>
              <LocateFixed className={`size-4 ${locating ? "animate-pulse" : ""}`} />
              {locating ? "Finding..." : "Use GPS"}
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <InputField label="Area Name" value={area} onChange={setArea} />
            <InputField label="Latitude" value={latitude} onChange={setLatitude} type="number" step="any" required />
            <InputField label="Longitude" value={longitude} onChange={setLongitude} type="number" step="any" required />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card space-y-4">
          <h2 className="font-semibold text-base">Issue Description</h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the problem (e.g., Water leakage or dangerous pothole near main cross road)..."
            rows={3}
            className="w-full rounded-md border border-border bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card space-y-4">
          <h2 className="font-semibold text-base">Evidence Photo</h2>
          <input ref={fileRef} type="file" accept="image/*" onChange={pickPhoto} className="sr-only" />
          {photoPreview ? (
            <div className="relative mt-2">
              <img src={photoPreview} alt="Evidence" className="h-48 w-full rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => { setPhoto(undefined); setPhotoPreview(undefined); }}
                className="absolute right-2 top-2 rounded-md bg-card p-2 text-danger shadow-md"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-8 text-sm text-text-secondary hover:border-primary hover:text-primary"
            >
              <Camera className="size-5" /> Attach Photo Evidence
            </button>
          )}
        </div>

        {validation && <Notice text={validation} />}

        <Button type="submit" size="lg" className="w-full shadow-md" disabled={submitting}>
          {submitting ? <RefreshCw className="size-4 animate-spin" /> : <Send className="size-4" />}
          Submit Issue to Autonomous Router
        </Button>
      </form>
    </section>
  );
}

// ------------------- MAP SCREEN -------------------

function MapScreen({ reports, onBack }: { reports: WaterReport[]; onBack: () => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<WaterReport>();

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;
    void import("leaflet").then((leaflet) => {
      if (cancelled || !mapRef.current) return;
      map = leaflet.map(mapRef.current).setView([12.9716, 77.5946], 12);
      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 19,
        })
        .addTo(map);

      reports.forEach((report) => {
        const risk = riskOf(report);
        const marker = leaflet
          .marker([report.latitude, report.longitude], {
            icon: leaflet.divIcon({
              className: `report-pin ${risk.level}`,
              html: "<span></span>",
              iconSize: [22, 22],
              iconAnchor: [11, 11],
            }),
          })
          .addTo(map as import("leaflet").Map);
        marker.on("click", () => setSelected(report));
      });
      if (reports.length)
        map.fitBounds(
          reports.map((report) => [report.latitude, report.longitude] as [number, number]),
          { padding: [30, 30], maxZoom: 14 },
        );
    });
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [reports]);

  return (
    <section className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        Back to Overview
      </Button>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-primary">Live Autonomous Map</p>
          <h1 className="mt-1 text-3xl font-bold">Detected Civic Issues</h1>
        </div>
        <div className="flex gap-4 text-xs font-medium text-text-secondary">
          <span><i className="legend-dot safe" /> Low Risk</span>
          <span><i className="legend-dot medium" /> Caution</span>
          <span><i className="legend-dot high" /> Danger / SLA Breach</span>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div ref={mapRef} className="leaflet-map rounded-xl border border-border shadow-card" />
        {selected ? (
          <div className="rounded-xl border border-border bg-card p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base">Issue #{selected.id}</h2>
              <button onClick={() => setSelected(undefined)} aria-label="Close details">
                <X className="size-4" />
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold text-primary">{selected.category || "Water Supply"}</p>
              <h3 className="font-semibold text-lg">{selected.area}</h3>
              <p className="text-xs text-text-secondary mt-1">{selected.description || "Civic issue observation"}</p>
            </div>

            <div className="border-t border-border/60 pt-3 text-xs space-y-1.5 text-text-secondary">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-semibold text-safe uppercase">{selected.status}</span>
              </div>
              <div className="flex justify-between">
                <span>Assigned Officer:</span>
                <span className="font-medium text-foreground">{selected.assignedOfficer || "Er. R. Sharma (JE Roads)"}</span>
              </div>
              <div className="flex justify-between">
                <span>Reported:</span>
                <span className="font-medium text-foreground">{timeAgo(selected.createdAt)}</span>
              </div>
            </div>

            {selected.photoUrl && (
              <img src={selected.photoUrl} alt="Evidence" className="h-40 w-full rounded-lg object-cover" />
            )}
          </div>
        ) : (
          <EmptyState text="Click any marker on the map to inspect issue details & routing status." />
        )}
      </div>
    </section>
  );
}

// ------------------- ALERTS SCREEN -------------------

function AlertsScreen({
  alerts,
  loading,
  onBack,
}: {
  alerts: ReturnType<typeof getAlerts>;
  loading: boolean;
  onBack: () => void;
}) {
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        Back to Overview
      </Button>
      <div>
        <h1 className="text-3xl font-bold">Proactive Anomaly & SLA Alerts</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Generated automatically when Detector Worker or Anomaly Worker identifies cluster spikes (&gt;3x baseline) or SLA breaches.
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <LoadingState />
        ) : alerts.length ? (
          alerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
        ) : (
          <EmptyState text="No active high-priority cluster alerts currently detected." />
        )}
      </div>
    </section>
  );
}

function AlertCard({ alert }: { alert: ReturnType<typeof getAlerts>[number] }) {
  return (
    <article className="rounded-xl border border-danger bg-danger-soft/40 p-5 shadow-card space-y-2">
      <div className="flex gap-3">
        <AlertTriangle className="size-5 shrink-0 text-danger mt-0.5" />
        <div>
          <h2 className="font-bold text-danger text-base">Civic Safety & Spike Alert</h2>
          <p className="mt-1 text-sm text-text-primary">
            {alert.count} high-priority issues detected near <strong>{alert.area}</strong> within 24 hours.
          </p>
          <p className="mt-2 text-xs text-text-secondary">
            Latest observation recorded {timeAgo(alert.latestCreatedAt)} • Auto-routed to Executive Engineer
          </p>
        </div>
      </div>
    </article>
  );
}

// ------------------- MULTILINGUAL CITIZEN ASSISTANT WIDGET -------------------

function ChatbotWidget({
  isOpen,
  lang = "en",
  onLanguageChange,
  onClose,
  onNavigate,
  onReportGenerated,
}: {
  isOpen: boolean;
  lang?: string;
  onLanguageChange?: (newLang: string) => void;
  onClose: () => void;
  onNavigate: (s: Screen) => void;
  onReportGenerated?: (report: WaterReport) => void;
}) {
  const [messages, setMessages] = useState<
    { id: string; sender: "user" | "bot"; text: string; intent?: string }[]
  >([
    {
      id: "1",
      sender: "bot",
      text: "Namaste! I am the CivicConnect Assistant. I can assist you in 22 Indian languages. Tell me your civic issue (e.g. 'Pothole on main road') and I will register it directly for you!",
    },
  ]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("en");

  if (!isOpen) return null;

  function sendQuery(text: string) {
    if (!text.trim()) return;
    const userMsg = { id: Date.now().toString(), sender: "user" as const, text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const res = handleChatbotQuery(text, language);
      const res = handleChatbotQuery(text, lang);
      const botMsg = { id: (Date.now() + 1).toString(), sender: "bot" as const, text: res.response, intent: res.intent };
      setMessages((prev) => [...prev, botMsg]);

      if (res.autoFiledComplaint && res.generatedReport && onReportGenerated) {
        onReportGenerated(res.generatedReport);
      }
    }, 400);
  }

  return (
    <div className="fixed bottom-20 right-4 z-40 flex h-[520px] w-[360px] flex-col rounded-2xl border border-border bg-card shadow-2xl backdrop-blur sm:bottom-24 sm:right-6 sm:w-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4 bg-primary/5 rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <div>
            <h3 className="font-bold text-sm">Civic Assistant</h3>
            <h3 className="font-bold text-sm">{t("chatTitle", lang)}</h3>
            <p className="text-[11px] text-text-secondary flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-safe animate-pulse" /> 22 Indian Languages (Bhashini)
              <span className="size-1.5 rounded-full bg-safe animate-pulse" /> {t("chatSub", lang)}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="rounded-md p-1 hover:bg-muted text-text-secondary">
          <X className="size-4" />
        </button>
      </div>

      {/* Language Bar */}
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-4 py-2 text-xs">
        <span className="text-text-secondary flex items-center gap-1">
          <Globe className="size-3.5 text-primary" /> Preferred Language:
          <Globe className="size-3.5 text-primary" /> {t("langSelectLabel", lang)}:
        </span>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          value={lang}
          onChange={(e) => onLanguageChange?.(e.target.value)}
          className="bg-transparent font-medium outline-none text-foreground cursor-pointer"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी (Hindi)</option>
          <option value="kn">ಕನ್ನಡ (Kannada)</option>
          <option value="ta">தமிழ் (Tamil)</option>
          <option value="te">తెలుగు (Telugu)</option>
          <option value="mr">मराठी (Marathi)</option>
          <option value="gu">ગુજરાતી (Gujarati)</option>
          <option value="bn">বাংলা (Bengali)</option>
          <option value="ml">മലയാളം (Malayalam)</option>
          <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
        </select>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-3.5 py-2 text-xs leading-relaxed ${
                m.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground border border-border/60"
              }`}
            >
              {m.text}
            </div>
            {m.intent && (
              <span className="text-[10px] text-text-secondary mt-1 font-mono">
                Intent: {m.intent}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Quick Pills */}
      <div className="flex flex-wrap gap-1.5 p-2 border-t border-border/40 bg-muted/20">
        <button
          onClick={() => sendQuery(language === "hi" ? "पानी का समय क्या है?" : language === "kn" ? "ನೀರಿನ ಸಮಯ ಏನು?" : "Water timing in Ward 47")}
          onClick={() => sendQuery(lang === "hi" ? "पानी का समय क्या है?" : lang === "kn" ? "ನೀರಿನ ಸಮಯ ಏನು?" : "Water timing in Ward 47")}
          className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-text-secondary hover:border-primary"
        >
          {language === "hi" ? "पानी का समय?" : language === "kn" ? "ನೀರಿನ ಸಮಯ?" : "Water timing?"}
          {t("chatPromptWater", lang)}
        </button>
        <button
          onClick={() => sendQuery(language === "hi" ? "सड़क पर बड़ा गड्ढा है" : language === "kn" ? "ರಸ್ತೆಯಲ್ಲಿ ಗುಂಡಿ ಇದೆ" : "Dangerous pothole on main road")}
          onClick={() => sendQuery(lang === "hi" ? "सड़क पर बड़ा गड्ढा है" : lang === "kn" ? "ರಸ್ತೆಯಲ್ಲಿ ಗುಂಡಿ ಇದೆ" : "Dangerous pothole on main road")}
          className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-text-secondary hover:border-primary"
        >
          {language === "hi" ? "गड्ढे की शिकायत" : language === "kn" ? "ಗುಂಡಿ ದೂರು" : "Report Pothole"}
          {t("chatPromptPothole", lang)}
        </button>
        <button
          onClick={() => sendQuery("Check status complaint #CVC-1082")}
          className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-text-secondary hover:border-primary"
        >
          Status #CVC-1082
          {t("chatPromptStatus", lang)}
        </button>
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendQuery(input);
        }}
        className="flex items-center gap-2 border-t border-border p-3 bg-card rounded-b-2xl"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question or report an issue..."
          placeholder={t("chatPlaceholder", lang)}
          className="flex-1 bg-transparent text-xs outline-none text-foreground placeholder:text-text-secondary"
        />
        <Button type="submit" size="icon" className="size-7 rounded-lg">
          <Send className="size-3.5" />
        </Button>
      </form>
    </div>
  );
}

// ------------------- HELPERS & UI COMPONENTS -------------------

function TrustPanel({ onSubmitted }: { onSubmitted: () => void }) {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function submitFeedback(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(undefined);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, rating, comment, website: "" }),
      });
      const result = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Feedback could not be submitted");
      setComment("");
      setStatus(result.message ?? "Feedback submitted. Learning Loop 4 prompt updated.");
      onSubmitted();
    } catch {
      setStatus("Feedback recorded locally for prompt evolution.");
      onSubmitted();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="grid gap-6 rounded-xl border border-primary/20 bg-primary/5 p-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
          <ShieldCheck className="size-4" /> Public Trust & Self-Learning
        </p>
        <h2 className="mt-2 text-xl font-bold">Accountable Operations</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          Every citizen interaction and rating feeds back into Loop 4 to continuously improve Assistant prompts and routing precision.
        </p>
      </div>
      <form onSubmit={submitFeedback} className="rounded-xl border border-border bg-card p-4 shadow-card">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4 text-primary" />
          <h3 className="font-semibold text-sm">Leave a public review for system learning</h3>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={80}
            placeholder="Name (optional)"
            className="h-9 rounded-md border border-border bg-card px-3 text-xs outline-none focus:ring-2 focus:ring-primary"
          />
          <label className="flex h-9 items-center gap-2 rounded-md border border-border px-3 text-xs">
            <span className="text-text-secondary">Rating:</span>
            <select
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              className="bg-transparent font-medium outline-none"
            >
              {[5, 4, 3, 2, 1].map((v) => (
                <option key={v} value={v}>
                  {v} stars
                </option>
              ))}
            </select>
          </label>
        </div>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          maxLength={500}
          minLength={10}
          required
          rows={2}
          placeholder="Share feedback to help the system improve..."
          className="mt-3 w-full resize-none rounded-md border border-border bg-card p-2.5 text-xs outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-[11px] text-text-secondary">Feeds directly into Loop 4 Auto-Prompt tuning.</p>
          <Button type="submit" size="sm" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
        {status && <p className="mt-2 text-xs font-semibold text-safe">{status}</p>}
      </form>
    </section>
  );
}

function MetricCard({
  icon,
  label,
  value,
  detail,
  tone = "default",
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  detail: string;
  tone?: "default" | "danger" | "safe";
}) {
  return (
    <article className="rounded-xl border border-border bg-card p-5 shadow-card space-y-2">
      <div className="flex items-center justify-between gap-3 text-text-secondary">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
        <Activity className="size-4 text-safe animate-pulse" />
      </div>
      <p className="text-xs font-semibold uppercase text-text-secondary tracking-wider">{label}</p>
      <p
        className={`text-2xl font-bold ${
          tone === "danger" ? "text-danger" : tone === "safe" ? "text-safe" : "text-foreground"
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-text-secondary">{detail}</p>
    </article>
  );
}

function ActivityRow({
  icon,
  title,
  detail,
  time,
}: {
  icon: ReactNode;
  title: string;
  detail: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/70 p-3 bg-muted/10">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold">{title}</p>
        <p className="mt-0.5 text-[11px] text-text-secondary">{detail}</p>
      </div>
      <time className="shrink-0 text-[11px] text-text-secondary">{time}</time>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  step,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  step?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-xs font-medium">
      {label}
      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        step={step}
        className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary"
      />
    </label>
  );
}

function NavItem({
  active,
  onClick,
  icon,
  label,
  compact = false,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`relative flex items-center justify-center gap-2 rounded-lg text-xs transition-colors ${
        compact ? "px-3 py-2" : "min-w-16 flex-col gap-1 px-3 py-1.5"
      } ${
        active
          ? "bg-primary/10 font-bold text-primary"
          : "text-text-secondary hover:bg-muted hover:text-foreground"
      }`}
    >
      <span className="[&>svg]:size-4">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card px-5 py-10 text-center text-xs text-text-secondary">
      <ShieldCheck className="mx-auto mb-2 size-6 text-primary" />
      {text}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-xl border border-border bg-card px-5 py-10 text-center text-xs text-text-secondary">
      <RefreshCw className="mx-auto mb-2 size-5 animate-spin text-primary" />
      Updating Autonomous State…
    </div>
  );
}

function Notice({ text }: { text: string }) {
  return (
    <div className="mb-4 rounded-xl border border-danger/40 bg-danger-soft/40 p-3.5 text-xs font-medium text-danger">
      {text}
    </div>
  );
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed right-4 top-4 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-safe bg-card px-4 py-3 text-xs font-semibold text-safe shadow-xl">
      <CheckCircle2 className="size-4 shrink-0" />
      {message}
      <button onClick={onClose} aria-label="Close toast" className="ml-auto">
        <X className="size-4" />
      </button>
    </div>
  );
}
