// frontend/src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      bloodlink: "BloodLink",
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      submit: "Submit",
      edit: "Edit",
      delete: "Delete",
      confirm: "Confirm",
      download: "Download",
      upload: "Upload",
      
      // Navigation
      login: "Login",
      logout: "Logout",
      signup: "Sign up",
      profile: "Profile",
      dashboard: "Dashboard",
      checkAvailability: "Check Availability",
      certificates: "Certificates",
      
      // Roles
      donor: "Donor",
      hospital: "Hospital",
      admin: "Admin",
      
      // Landing Page
      landingTitle: "Connect Life-Savers with Life-Seekers",
      landingSubtitle: "Real-time blood donation tracking between donors and hospitals",
      getStarted: "Get Started",
      
      // Auth
      email: "Email",
      password: "Password",
      name: "Name",
      role: "Role",
      loginTitle: "Login to BloodLink",
      signupTitle: "Create Account",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      
      // Donor Dashboard
      donorDashboard: "Donor Dashboard",
      helpHospitals: "Help hospitals by seeing nearby requests",
      yourPoints: "Your points",
      badgeLevel: "Badge level",
      availability: "Availability",
      yourStatus: "Your status",
      available: "Available",
      notAvailable: "Not Available",
      turnOff: "Turn off",
      imAvailable: "I'm available",
      matchingRequests: "Matching requests near you",
      yourRequests: "Your requests",
      noRequests: "No matched requests yet",
      noNearbyRequests: "No nearby requests",
      pledge: "Pledge",
      route: "Route",
      hospitalCommunications: "Hospital Communications",
      chatWithHospitals: "Chat with hospitals for your accepted donations",
      noActiveChats: "No active chats yet. Chat will appear here once a hospital accepts your donation.",
      
      // Blood Groups
      bloodGroup: "Blood Group",
      units: "Units",
      urgency: "Urgency",
      emergency: "Emergency",
      open: "Open",
      
      // Hospital Dashboard
      hospitalDashboard: "Hospital Dashboard",
      manageRequests: "Manage blood requests and view donor pledges",
      createRequest: "Create Blood Request",
      myRequests: "My Requests",
      bloodInventory: "Blood Inventory",
      chat: "Chat",
      requests: "Requests",
      
      // Hospital Profile
      hospitalProfile: "Hospital profile",
      hospitalDetails: "Keep your hospital details and emergency contacts accurate for donor trust and quick response",
      hospitalName: "Hospital name",
      phone: "Phone",
      city: "City",
      pincode: "Pincode",
      address: "Address",
      accreditationNumber: "Accreditation number",
      emergencyContact: "Emergency contact number",
      changeLogo: "Change logo",
      useGPS: "Use current GPS location",
      saveProfile: "Save profile",
      
      // Verification Documents
      verificationDocuments: "Hospital Verification Documents",
      provideDocuments: "Provide your license certificate number and GST number for admin verification",
      licenseCertificate: "License Certificate Number",
      gstNumber: "GST Number",
      verificationStatus: "Status",
      pending: "PENDING",
      approved: "APPROVED",
      rejected: "REJECTED",
      rejectionReason: "REJECTION REASON",
      documentsUnderReview: "Your documents are pending admin verification. You will be notified once reviewed",
      
      // Admin Dashboard
      adminDashboard: "Admin Dashboard",
      monitorSystem: "Monitor the entire BloodLink system: analytics, live locations, users, and logs",
      totalDonors: "Total donors",
      totalHospitals: "Total hospitals",
      openRequests: "Open requests",
      emergencyOpen: "Emergency open",
      fulfilledRequests: "Fulfilled requests",
      totalDonations: "Total donations",
      pendingVerifications: "Pending Verifications",
      globalLiveMap: "Global live map – donors & hospitals",
      seeAllLocations: "See all donors and hospitals sharing their real-time location on the platform",
      userManagement: "User management",
      systemLogs: "System logs",
      downloadLogs: "Download logs file",
      viewAnalytics: "View Analytics",
      hospitalVerification: "Hospital Verification",
      
      // Certificates
      donationCertificates: "Your Donation Certificates",
      downloadCertificates: "Download your certificates for your resume and records",
      downloadCertificate: "Download Certificate",
      pointsAwarded: "Points Awarded",
      noCertificates: "No certificates yet",
      completeDonation: "Complete a donation to receive your first certificate!",
      aboutCertificates: "About Your Certificates",
      
      // Common Actions
      approve: "Approve",
      reject: "Reject",
      enable: "Enable",
      disable: "Disable",
      active: "Active",
      disabled: "Disabled",
      status: "Status",
    },
  },
  kn: {
    translation: {
      // Common
      bloodlink: "ಬ್ಲಡ್‌ಲಿಂಕ್",
      loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
      save: "ಉಳಿಸಿ",
      cancel: "ರದ್ದುಗೊಳಿಸಿ",
      submit: "ಸಲ್ಲಿಸಿ",
      edit: "ಸಂಪಾದಿಸಿ",
      delete: "ಅಳಿಸಿ",
      confirm: "ದೃಢೀಕರಿಸಿ",
      download: "ಡೌನ್‌ಲೋಡ್",
      upload: "ಅಪ್‌ಲೋಡ್",
      
      // Navigation
      login: "ಲಾಗಿನ್",
      logout: "ಲಾಗ್ಔಟ್",
      signup: "ಸೈನ್ ಅಪ್",
      profile: "ಪ್ರೊಫೈಲ್",
      dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      checkAvailability: "ಲಭ್ಯತೆ ಪರಿಶೀಲಿಸಿ",
      certificates: "ಪ್ರಮಾಣಪತ್ರಗಳು",
      
      // Roles
      donor: "ದಾನಿ",
      hospital: "ಆಸ್ಪತ್ರೆ",
      admin: "ನಿರ್ವಾಹಕ",
      
      // Landing Page
      landingTitle: "ಜೀವ ಉಳಿಸುವವರನ್ನು ಜೀವ ಹುಡುಕುವವರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ",
      landingSubtitle: "ದಾನಿಗಳು ಮತ್ತು ಆಸ್ಪತ್ರೆಗಳ ನಡುವೆ ನೈಜ-ಸಮಯ ರಕ್ತದಾನ ಟ್ರ್ಯಾಕಿಂಗ್",
      getStarted: "ಪ್ರಾರಂಭಿಸಿ",
      
      // Auth
      email: "ಇಮೇಲ್",
      password: "ಪಾಸ್‌ವರ್ಡ್",
      name: "ಹೆಸರು",
      role: "ಪಾತ್ರ",
      loginTitle: "ಬ್ಲಡ್‌ಲಿಂಕ್‌ಗೆ ಲಾಗಿನ್ ಮಾಡಿ",
      signupTitle: "ಖಾತೆ ರಚಿಸಿ",
      alreadyHaveAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?",
      dontHaveAccount: "ಖಾತೆ ಇಲ್ಲವೇ?",
      
      // Donor Dashboard
      donorDashboard: "ದಾನಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      helpHospitals: "ಹತ್ತಿರದ ವಿನಂತಿಗಳನ್ನು ನೋಡುವ ಮೂಲಕ ಆಸ್ಪತ್ರೆಗಳಿಗೆ ಸಹಾಯ ಮಾಡಿ",
      yourPoints: "ನಿಮ್ಮ ಅಂಕಗಳು",
      badgeLevel: "ಬ್ಯಾಡ್ಜ್ ಮಟ್ಟ",
      availability: "ಲಭ್ಯತೆ",
      yourStatus: "ನಿಮ್ಮ ಸ್ಥಿತಿ",
      available: "ಲಭ್ಯವಿದೆ",
      notAvailable: "ಲಭ್ಯವಿಲ್ಲ",
      turnOff: "ಆಫ್ ಮಾಡಿ",
      imAvailable: "ನಾನು ಲಭ್ಯವಿದ್ದೇನೆ",
      matchingRequests: "ನಿಮ್ಮ ಹತ್ತಿರದ ಹೊಂದಾಣಿಕೆಯ ವಿನಂತಿಗಳು",
      yourRequests: "ನಿಮ್ಮ ವಿನಂತಿಗಳು",
      noRequests: "ಇನ್ನೂ ಯಾವುದೇ ಹೊಂದಾಣಿಕೆ ವಿನಂತಿಗಳಿಲ್ಲ",
      noNearbyRequests: "ಯಾವುದೇ ಹತ್ತಿರದ ವಿನಂತಿಗಳಿಲ್ಲ",
      pledge: "ಪ್ರತಿಜ್ಞೆ",
      route: "ಮಾರ್ಗ",
      hospitalCommunications: "ಆಸ್ಪತ್ರೆ ಸಂವಹನಗಳು",
      chatWithHospitals: "ನಿಮ್ಮ ಸ್ವೀಕೃತ ದಾನಗಳಿಗಾಗಿ ಆಸ್ಪತ್ರೆಗಳೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ",
      noActiveChats: "ಇನ್ನೂ ಯಾವುದೇ ಸಕ್ರಿಯ ಚಾಟ್‌ಗಳಿಲ್ಲ. ಆಸ್ಪತ್ರೆ ನಿಮ್ಮ ದಾನವನ್ನು ಸ್ವೀಕರಿಸಿದ ನಂತರ ಚಾಟ್ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ",
      
      // Blood Groups
      bloodGroup: "ರಕ್ತ ಗುಂಪು",
      units: "ಘಟಕಗಳು",
      urgency: "ತುರ್ತು",
      emergency: "ತುರ್ತು ಪರಿಸ್ಥಿತಿ",
      open: "ತೆರೆದಿದೆ",
      
      // Hospital Dashboard
      hospitalDashboard: "ಆಸ್ಪತ್ರೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      manageRequests: "ರಕ್ತ ವಿನಂತಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ ಮತ್ತು ದಾನಿ ಪ್ರತಿಜ್ಞೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
      createRequest: "ರಕ್ತ ವಿನಂತಿ ರಚಿಸಿ",
      myRequests: "ನನ್ನ ವಿನಂತಿಗಳು",
      bloodInventory: "ರಕ್ತ ದಾಸ್ತಾನು",
      chat: "ಚಾಟ್",
      requests: "ವಿನಂತಿಗಳು",
      
      // Hospital Profile
      hospitalProfile: "ಆಸ್ಪತ್ರೆ ಪ್ರೊಫೈಲ್",
      hospitalDetails: "ದಾನಿ ನಂಬಿಕೆ ಮತ್ತು ತ್ವರಿತ ಪ್ರತಿಕ್ರಿಯೆಗಾಗಿ ನಿಮ್ಮ ಆಸ್ಪತ್ರೆ ವಿವರಗಳು ಮತ್ತು ತುರ್ತು ಸಂಪರ್ಕಗಳನ್ನು ನಿಖರವಾಗಿ ಇರಿಸಿ",
      hospitalName: "ಆಸ್ಪತ್ರೆಯ ಹೆಸರು",
      phone: "ದೂರವಾಣಿ",
      city: "ನಗರ",
      pincode: "ಪಿನ್‌ಕೋಡ್",
      address: "ವಿಳಾಸ",
      accreditationNumber: "ಮಾನ್ಯತೆ ಸಂಖ್ಯೆ",
      emergencyContact: "ತುರ್ತು ಸಂಪರ್ಕ ಸಂಖ್ಯೆ",
      changeLogo: "ಲೋಗೋ ಬದಲಾಯಿಸಿ",
      useGPS: "ಪ್ರಸ್ತುತ GPS ಸ್ಥಳವನ್ನು ಬಳಸಿ",
      saveProfile: "ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ",
      
      // Verification Documents
      verificationDocuments: "ಆಸ್ಪತ್ರೆ ಪರಿಶೀಲನೆ ದಾಖಲೆಗಳು",
      provideDocuments: "ನಿರ್ವಾಹಕ ಪರಿಶೀಲನೆಗಾಗಿ ನಿಮ್ಮ ಪರವಾನಗಿ ಪ್ರಮಾಣಪತ್ರ ಸಂಖ್ಯೆ ಮತ್ತು GST ಸಂಖ್ಯೆಯನ್ನು ಒದಗಿಸಿ",
      licenseCertificate: "ಪರವಾನಗಿ ಪ್ರಮಾಣಪತ್ರ ಸಂಖ್ಯೆ",
      gstNumber: "GST ಸಂಖ್ಯೆ",
      verificationStatus: "ಸ್ಥಿತಿ",
      pending: "ಬಾಕಿ ಇದೆ",
      approved: "ಅನುಮೋದಿಸಲಾಗಿದೆ",
      rejected: "ತಿರಸ್ಕರಿಸಲಾಗಿದೆ",
      rejectionReason: "ತಿರಸ್ಕಾರದ ಕಾರಣ",
      documentsUnderReview: "ನಿಮ್ಮ ದಾಖಲೆಗಳು ನಿರ್ವಾಹಕ ಪರಿಶೀಲನೆಗೆ ಬಾಕಿ ಇದೆ. ಪರಿಶೀಲಿಸಿದ ನಂತರ ನಿಮಗೆ ತಿಳಿಸಲಾಗುವುದು",
      
      // Admin Dashboard
      adminDashboard: "ನಿರ್ವಾಹಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      monitorSystem: "ಸಂಪೂರ್ಣ ಬ್ಲಡ್‌ಲಿಂಕ್ ಸಿಸ್ಟಮ್ ಅನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ: ವಿಶ್ಲೇಷಣೆಗಳು, ನೇರ ಸ್ಥಳಗಳು, ಬಳಕೆದಾರರು ಮತ್ತು ದಾಖಲೆಗಳು",
      totalDonors: "ಒಟ್ಟು ದಾನಿಗಳು",
      totalHospitals: "ಒಟ್ಟು ಆಸ್ಪತ್ರೆಗಳು",
      openRequests: "ತೆರೆದ ವಿನಂತಿಗಳು",
      emergencyOpen: "ತುರ್ತು ತೆರೆದಿದೆ",
      fulfilledRequests: "ಪೂರೈಸಿದ ವಿನಂತಿಗಳು",
      totalDonations: "ಒಟ್ಟು ದಾನಗಳು",
      pendingVerifications: "ಬಾಕಿ ಇರುವ ಪರಿಶೀಲನೆಗಳು",
      globalLiveMap: "ಜಾಗತಿಕ ನೇರ ನಕ್ಷೆ – ದಾನಿಗಳು ಮತ್ತು ಆಸ್ಪತ್ರೆಗಳು",
      seeAllLocations: "ವೇದಿಕೆಯಲ್ಲಿ ತಮ್ಮ ನೈಜ-ಸಮಯದ ಸ್ಥಳವನ್ನು ಹಂಚಿಕೊಳ್ಳುವ ಎಲ್ಲಾ ದಾನಿಗಳು ಮತ್ತು ಆಸ್ಪತ್ರೆಗಳನ್ನು ನೋಡಿ",
      userManagement: "ಬಳಕೆದಾರ ನಿರ್ವಹಣೆ",
      systemLogs: "ಸಿಸ್ಟಮ್ ದಾಖಲೆಗಳು",
      downloadLogs: "ದಾಖಲೆಗಳ ಫೈಲ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
      viewAnalytics: "ವಿಶ್ಲೇಷಣೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
      hospitalVerification: "ಆಸ್ಪತ್ರೆ ಪರಿಶೀಲನೆ",
      
      // Certificates
      donationCertificates: "ನಿಮ್ಮ ದಾನ ಪ್ರಮಾಣಪತ್ರಗಳು",
      downloadCertificates: "ನಿಮ್ಮ ರೆಸ್ಯೂಮ್ ಮತ್ತು ದಾಖಲೆಗಳಿಗಾಗಿ ನಿಮ್ಮ ಪ್ರಮಾಣಪತ್ರಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
      downloadCertificate: "ಪ್ರಮಾಣಪತ್ರ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
      pointsAwarded: "ಅಂಕಗಳನ್ನು ನೀಡಲಾಗಿದೆ",
      noCertificates: "ಇನ್ನೂ ಯಾವುದೇ ಪ್ರಮಾಣಪತ್ರಗಳಿಲ್ಲ",
      completeDonation: "ನಿಮ್ಮ ಮೊದಲ ಪ್ರಮಾಣಪತ್ರವನ್ನು ಪಡೆಯಲು ದಾನ ಪೂರ್ಣಗೊಳಿಸಿ!",
      aboutCertificates: "ನಿಮ್ಮ ಪ್ರಮಾಣಪತ್ರಗಳ ಕುರಿತು",
      
      // Common Actions
      approve: "ಅನುಮೋದಿಸಿ",
      reject: "ತಿರಸ್ಕರಿಸಿ",
      enable: "ಸಕ್ರಿಯಗೊಳಿಸಿ",
      disable: "ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಿ",
      active: "ಸಕ್ರಿಯ",
      disabled: "ನಿಷ್ಕ್ರಿಯ",
      status: "ಸ್ಥಿತಿ",
    },
  },
  hi: {
    translation: {
      // Common
      bloodlink: "ब्लडलिंक",
      loading: "लोड हो रहा है...",
      save: "सहेजें",
      cancel: "रद्द करें",
      submit: "जमा करें",
      edit: "संपादित करें",
      delete: "हटाएं",
      confirm: "पुष्टि करें",
      download: "डाउनलोड",
      upload: "अपलोड",
      
      // Navigation
      login: "लॉगिन",
      logout: "लॉगआउट",
      signup: "साइन अप",
      profile: "प्रोफाइल",
      dashboard: "डैशबोर्ड",
      checkAvailability: "उपलब्धता जांचें",
      certificates: "प्रमाणपत्र",
      
      // Roles
      donor: "दाता",
      hospital: "अस्पताल",
      admin: "प्रशासक",
      
      // Landing Page
      landingTitle: "जीवन बचाने वालों को जीवन की तलाश करने वालों से जोड़ें",
      landingSubtitle: "दाताओं और अस्पतालों के बीच वास्तविक समय रक्तदान ट्रैकिंग",
      getStarted: "शुरू करें",
      
      // Auth
      email: "ईमेल",
      password: "पासवर्ड",
      name: "नाम",
      role: "भूमिका",
      loginTitle: "ब्लडलिंक में लॉगिन करें",
      signupTitle: "खाता बनाएं",
      alreadyHaveAccount: "पहले से खाता है?",
      dontHaveAccount: "खाता नहीं है?",
      
      // Donor Dashboard
      donorDashboard: "दाता डैशबोर्ड",
      helpHospitals: "पास के अनुरोध देखकर अस्पतालों की मदद करें",
      yourPoints: "आपके अंक",
      badgeLevel: "बैज स्तर",
      availability: "उपलब्धता",
      yourStatus: "आपकी स्थिति",
      available: "उपलब्ध",
      notAvailable: "उपलब्ध नहीं",
      turnOff: "बंद करें",
      imAvailable: "मैं उपलब्ध हूं",
      matchingRequests: "आपके पास मेल खाते अनुरोध",
      yourRequests: "आपके अनुरोध",
      noRequests: "अभी तक कोई मेल खाता अनुरोध नहीं",
      noNearbyRequests: "कोई पास का अनुरोध नहीं",
      pledge: "प्रतिज्ञा",
      route: "मार्ग",
      hospitalCommunications: "अस्पताल संचार",
      chatWithHospitals: "अपने स्वीकृत दान के लिए अस्पतालों के साथ चैट करें",
      noActiveChats: "अभी तक कोई सक्रिय चैट नहीं। एक बार अस्पताल आपका दान स्वीकार करने के बाद चैट यहां दिखाई देगी",
      
      // Blood Groups
      bloodGroup: "रक्त समूह",
      units: "इकाइयां",
      urgency: "तात्कालिकता",
      emergency: "आपातकाल",
      open: "खुला",
      
      // Hospital Dashboard
      hospitalDashboard: "अस्पताल डैशबोर्ड",
      manageRequests: "रक्त अनुरोध प्रबंधित करें और दाता प्रतिज्ञाएं देखें",
      createRequest: "रक्त अनुरोध बनाएं",
      myRequests: "मेरे अनुरोध",
      bloodInventory: "रक्त सूची",
      chat: "चैट",
      requests: "अनुरोध",
      
      // Hospital Profile
      hospitalProfile: "अस्पताल प्रोफाइल",
      hospitalDetails: "दाता विश्वास और त्वरित प्रतिक्रिया के लिए अपने अस्पताल का विवरण और आपातकालीन संपर्क सटीक रखें",
      hospitalName: "अस्पताल का नाम",
      phone: "फोन",
      city: "शहर",
      pincode: "पिनकोड",
      address: "पता",
      accreditationNumber: "मान्यता संख्या",
      emergencyContact: "आपातकालीन संपर्क नंबर",
      changeLogo: "लोगो बदलें",
      useGPS: "वर्तमान GPS स्थान उपयोग करें",
      saveProfile: "प्रोफाइल सहेजें",
      
      // Verification Documents
      verificationDocuments: "अस्पताल सत्यापन दस्तावेज",
      provideDocuments: "प्रशासक सत्यापन के लिए अपना लाइसेंस प्रमाणपत्र संख्या और GST संख्या प्रदान करें",
      licenseCertificate: "लाइसेंस प्रमाणपत्र संख्या",
      gstNumber: "GST संख्या",
      verificationStatus: "स्थिति",
      pending: "लंबित",
      approved: "स्वीकृत",
      rejected: "अस्वीकृत",
      rejectionReason: "अस्वीकृति कारण",
      documentsUnderReview: "आपके दस्तावेज प्रशासक सत्यापन के लिए लंबित हैं। समीक्षा होने के बाद आपको सूचित किया जाएगा",
      
      // Admin Dashboard
      adminDashboard: "प्रशासक डैशबोर्ड",
      monitorSystem: "पूरे ब्लडलिंक सिस्टम की निगरानी करें: विश्लेषण, लाइव स्थान, उपयोगकर्ता और लॉग",
      totalDonors: "कुल दाता",
      totalHospitals: "कुल अस्पताल",
      openRequests: "खुले अनुरोध",
      emergencyOpen: "आपातकाल खुला",
      fulfilledRequests: "पूर्ण अनुरोध",
      totalDonations: "कुल दान",
      pendingVerifications: "लंबित सत्यापन",
      globalLiveMap: "वैश्विक लाइव मानचित्र – दाता और अस्पताल",
      seeAllLocations: "प्लेटफॉर्म पर अपना वास्तविक समय स्थान साझा करने वाले सभी दाताओं और अस्पतालों को देखें",
      userManagement: "उपयोगकर्ता प्रबंधन",
      systemLogs: "सिस्टम लॉग",
      downloadLogs: "लॉग फ़ाइल डाउनलोड करें",
      viewAnalytics: "विश्लेषण देखें",
      hospitalVerification: "अस्पताल सत्यापन",
      
      // Certificates
      donationCertificates: "आपके दान प्रमाणपत्र",
      downloadCertificates: "अपने रिज्यूमे और रिकॉर्ड के लिए अपने प्रमाणपत्र डाउनलोड करें",
      downloadCertificate: "प्रमाणपत्र डाउनलोड करें",
      pointsAwarded: "अंक दिए गए",
      noCertificates: "अभी तक कोई प्रमाणपत्र नहीं",
      completeDonation: "अपना पहला प्रमाणपत्र प्राप्त करने के लिए दान पूरा करें!",
      aboutCertificates: "आपके प्रमाणपत्रों के बारे में",
      
      // Common Actions
      approve: "स्वीकृत करें",
      reject: "अस्वीकार करें",
      enable: "सक्षम करें",
      disable: "अक्षम करें",
      active: "सक्रिय",
      disabled: "अक्षम",
      status: "स्थिति",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
