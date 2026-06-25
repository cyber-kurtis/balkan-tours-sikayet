import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import ReactApexChart from 'react-apexcharts';
import { 
  RefreshCw, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  TrendingUp, 
  Archive, 
  Inbox, 
  Database, 
  Search, 
  Settings, 
  X, 
  FileText,
  AlertCircle,
  User,
  Building2,
  ExternalLink,
  Compass,
  ArrowRight,
  Globe,
  Plus,
  Edit3,
  Trash2
} from 'lucide-react';

// Enhanced mock complaints database with real scraped data
const INITIAL_DEMO_DATA = [
  {
    id: 1,
    sikayet_id: "balkan-turunda-iptal-ve-iade-talebimin-reddedilmesi",
    tarih: new Date().toISOString(),
    kaynak_site: "Sikayetvar",
    baslik: "Balkan Turunda İptal Ve İade Talebimin Reddedilmesi",
    icerik: "Prontotour firmasından satın aldığım Balkan Turu seyahatim için iptal ve ücret iadesi talebinde bulundum. Ancak firma gerekçesiz bir şekilde iade yapmayacağını söyledi. Tüketici haklarımı sonuna kadar arayacağım.",
    anahtar_kelime: "Balkan Turu, İptal, İade",
    ai_kategori: "Program Kayması",
    ai_duygu_skoru: "Kritik",
    sikayetci_adi: "Gözde",
    acenta_adi: "Prontotour",
    tur_adi: "Balkan Turu",
    tur_tarihi: "Haziran 2026",
    sikayet_url: "https://www.sikayetvar.com/prontotour/balkan-turunda-iptal-ve-iade-talebimin-reddedilmesi",
    durum: "Aktif"
  },
  {
    id: 2,
    sikayet_id: "jolly-tur-turisti-belgradda-cuzdan-calinmasi-olayinda-polis-yardimi-saglamadi",
    tarih: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    kaynak_site: "Sikayetvar",
    baslik: "Jolly Tur Turisti Belgrad'da Cüzdan Çalınması Olayında Polis Yardımı Sağlamadı",
    icerik: "Belgrad gezisinde cüzdanım çalındı. Jolly Tur rehberi ve acentesi hiçbir şekilde polis yardımı veya konsolosluk yönlendirmesi sağlamadı. Yabancı bir ülkede tamamen çaresiz bırakıldım.",
    anahtar_kelime: "Belgrad, Rehber, Hırsızlık",
    ai_kategori: "Rehber",
    ai_duygu_skoru: "Kritik",
    sikayetci_adi: "Hülya",
    acenta_adi: "Jolly Tur",
    tur_adi: "Klasik Balkan Turu",
    tur_tarihi: "Haziran 2026",
    sikayet_url: "https://www.sikayetvar.com/jolly-tur/jolly-tur-turisti-belgradda-cuzdan-calinmasi-olayinda-polis-yardimi-saglamadi",
    durum: "Aktif"
  },
  {
    id: 3,
    sikayet_id: "tatilbudur-tur-rehberinin-olumsuz-davranislari-ve-ucret-iadesi-talebi",
    tarih: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    kaynak_site: "Sikayetvar",
    baslik: "Tatilbudur Tur Rehberinin Olumsuz Davranışları Ve Ücret İadesi Talebi",
    icerik: "Tur rehberinin son derece kaba, saygısız ve ilgisiz tavırları yüzünden balkan gezimiz rezil oldu. Rehber sürekli bağırdı ve sorularımıza cevap vermedi. Firma rehber seçiminde çok başarısız.",
    anahtar_kelime: "Rehber, İlgisizlik, Kaba Davranış",
    ai_kategori: "Rehber",
    ai_duygu_skoru: "Orta",
    sikayetci_adi: "Cansel",
    acenta_adi: "Tatilbudur",
    tur_adi: "Büyük Balkan Turu",
    tur_tarihi: "Haziran 2026",
    sikayet_url: "https://www.sikayetvar.com/tatilbudur/tatilbudur-tur-rehberinin-olumsuz-davranislari-ve-ucret-iadesi-talebi",
    durum: "Aktif"
  },
  {
    id: 4,
    sikayet_id: "prontotour-turunda-kosova-gorulmedi-program-eksikligi-ve-fiyat-yaniltmasi",
    tarih: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    kaynak_site: "Sikayetvar",
    baslik: "Prontotour Turunda Kosova Görülmedi, Program Eksikliği ve Fiyat Yanıltması",
    icerik: "Tur programında yer almasına rağmen Kosova'ya hiç girilmedi, oradaki şehirler gezdirilmedi. Sınır kapısı bahane edildi ama diğer turlar geçiyordu. Resmen gitmediğimiz yerin parasını ödedik.",
    anahtar_kelime: "Kosova, Program Kayması, İptal",
    ai_kategori: "Program Kayması",
    ai_duygu_skoru: "Kritik",
    sikayetci_adi: "Mücahit",
    acenta_adi: "Prontotour",
    tur_adi: "Kosova & Arnavutluk Turu",
    tur_tarihi: "Haziran 2026",
    sikayet_url: "https://www.sikayetvar.com/prontotour/prontotour-turunda-kosova-gorulmedi-program-eksikligi-ve-fiyat-yaniltmasi",
    durum: "Aktif"
  },
  {
    id: 5,
    sikayet_id: "kalitesiz-balkan-turu-tecrubesiz-rehber-hijyen-sorunlari-ve-cevapsiz-musteri-hizmeti",
    tarih: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    kaynak_site: "Sikayetvar",
    baslik: "Kalitesiz Balkan Turu: Tecrübesiz Rehber, Hijyen Sorunları Ve Cevapsız Müşteri Hizmeti",
    icerik: "Jolly Tur ile balkan turuna çıktık. Otobüsler çok kirliydi ve hijyen kurallarına uyulmuyordu. Rehberimiz son derece tecrübesizdi, hiçbir tarihi eseri anlatamadı. Müşteri hizmetlerini aradığımızda ise hiç kimseye ulaşamadık.",
    anahtar_kelime: "Rehber, Hijyen, Ulaşım",
    ai_kategori: "Otel",
    ai_duygu_skoru: "Kritik",
    sikayetci_adi: "Derya",
    acenta_adi: "Jolly Tur",
    tur_adi: "Ekspres Balkan Turu",
    tur_tarihi: "Nisan 2026",
    sikayet_url: "https://www.sikayetvar.com/jolly-tur/kalitesiz-balkan-turu-tecrubesiz-rehber-hijyen-sorunlari-ve-cevapsiz-musteri-hizmeti",
    durum: "Aktif"
  }
];

export default function App() {
  // Splash Screen Intro States
  const [showSplash, setShowSplash] = useState(true);
  const [splashFade, setSplashFade] = useState(false);
  const [progress, setProgress] = useState(0);
  const [gifError, setGifError] = useState(false);

  // Supabase & Webhook settings
  const [supabaseUrl, setSupabaseUrl] = useState(() => localStorage.getItem('SB_URL') || import.meta.env.VITE_SUPABASE_URL || '');
  const [supabaseKey, setSupabaseKey] = useState(() => localStorage.getItem('SB_KEY') || import.meta.env.VITE_SUPABASE_ANON_KEY || '');
  const [webhookUrl, setWebhookUrl] = useState(() => localStorage.getItem('WEBHOOK_URL') || import.meta.env.VITE_WEBHOOK_URL || '/.netlify/functions/scrape-webhook');
  
  const [showConfig, setShowConfig] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('Aktif'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Hepsi');
  const [selectedSentiment, setSelectedSentiment] = useState('Hepsi');
  const [selectedAgency, setSelectedAgency] = useState('Hepsi');
  const [selectedSource, setSelectedSource] = useState('Hepsi');
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);

  // Manual Complaint and Add/Edit States
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [classifying, setClassifying] = useState(false);
  const [formState, setFormState] = useState({
    sikayetci_adi: '',
    acenta_adi: 'Jolly Tur',
    baslik: '',
    icerik: '',
    kaynak_site: 'Google Reviews',
    tarih: new Date().toISOString().split('T')[0],
    tur_adi: '',
    tur_tarihi: '',
    ai_kategori: 'Alakasız',
    ai_duygu_skoru: 'Orta',
    sikayet_url: ''
  });

  // Admin password states
  const [adminAuthenticated, setAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('isAdminAuthenticated') === 'true';
  });
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [pendingAction, setPendingAction] = useState(null);

  const runAdminAction = (action) => {
    if (adminAuthenticated) {
      action();
    } else {
      setPendingAction(() => action);
      setShowAdminModal(true);
      setAdminPassword('');
      setAdminError('');
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === '1903') {
      setAdminAuthenticated(true);
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      setShowAdminModal(false);
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    } else {
      setAdminError('Hatalı yönetici şifresi!');
    }
  };

  // Splash Screen loading simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          setTimeout(() => {
            setSplashFade(true);
            setTimeout(() => setShowSplash(false), 600); // Wait for fade-out transition
          }, 400);
          return 100;
        }
        const diff = Math.random() * 15;
        return Math.min(oldProgress + diff, 100);
      });
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // Initialize Supabase Client
  const supabase = useMemo(() => {
    if (supabaseUrl && supabaseKey) {
      try {
        return createClient(supabaseUrl, supabaseKey);
      } catch (err) {
        console.error("Supabase creation error:", err);
        return null;
      }
    }
    return null;
  }, [supabaseUrl, supabaseKey]);

  // Load Data
  const fetchData = async () => {
    setLoading(true);
    setErrorStatus(null);

    if (supabase) {
      try {
        console.log("Fetching from Supabase...");
        const { data, error } = await supabase
          .from('balkan_sikayetleri')
          .select('*')
          .order('tarih', { ascending: false });

        if (error) {
          throw error;
        }

        setComplaints(data || []);
      } catch (err) {
        console.error("Database fetch failed. Falling back to Demo Mode:", err.message);
        setErrorStatus("Supabase bağlantısı kurulamadı. Demo verileri gösteriliyor.");
        setComplaints(INITIAL_DEMO_DATA);
      }
    } else {
      console.log("No Supabase configuration. Using Demo Mode.");
      setComplaints(INITIAL_DEMO_DATA);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!showSplash) {
      fetchData();
    }
  }, [supabase, showSplash]);

  // Real-time listener registration
  useEffect(() => {
    if (!supabase || showSplash) {
      setRealtimeConnected(false);
      return;
    }

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'balkan_sikayetleri' },
        (payload) => {
          console.log('Realtime DB Change:', payload);
          fetchData();
        }
      )
      .subscribe((status) => {
        setRealtimeConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, showSplash]);

  // Save config
  const handleSaveConfig = (e) => {
    e.preventDefault();
    localStorage.setItem('SB_URL', supabaseUrl);
    localStorage.setItem('SB_KEY', supabaseKey);
    localStorage.setItem('WEBHOOK_URL', webhookUrl);
    setShowConfig(false);
    fetchData();
  };

  // Clear config and reset to demo
  const handleResetConfig = () => {
    localStorage.removeItem('SB_URL');
    localStorage.removeItem('SB_KEY');
    localStorage.removeItem('WEBHOOK_URL');
    setSupabaseUrl('');
    setSupabaseKey('');
    setWebhookUrl('/.netlify/functions/scrape-webhook');
    setErrorStatus(null);
    setComplaints(INITIAL_DEMO_DATA);
  };

  // Trigger Webhook Scraper
  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);

    if (supabase && webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`Webhook responded with status ${response.status}`);
        }
      } catch (err) {
        console.error("Webhook trigger failed:", err.message);
        setErrorStatus(`Yenileme isteği başarısız oldu: ${err.message}. Simüle edilmiş yenileme yapılıyor.`);
        setTimeout(() => {
          simulateNewScrapedData();
        }, 1500);
      }
    } else {
      setTimeout(() => {
        simulateNewScrapedData();
      }, 1500);
    }

    setTimeout(async () => {
      await fetchData();
      setRefreshing(false);
    }, 5000);
  };

  // Helper to add mock data to simulate scraper webhook adding new items
  const simulateNewScrapedData = () => {
    const randomComplaints = [
      {
        id: Date.now(),
        sikayet_id: `mock-${Date.now()}`,
        tarih: new Date().toISOString(),
        kaynak_site: "Sikayetvar",
        baslik: "Jolly Tur otobüs kliması bozuk",
        icerik: "Balkan turumuz sırasında otobüsteki klimalar bozuldu. Rehbere söylediğimizde yapacak bir şey yok dedi. 14-21 Haziran turlu seyahatimizde sıcaktan mahvolduk.",
        anahtar_kelime: "Balkan Turu, Üsküp, Saraybosna, Ulaşım",
        ai_kategori: "Ulaşım",
        ai_duygu_skoru: "Kritik",
        sikayetci_adi: "Hakan Y.",
        acenta_adi: "Jolly Tur",
        tur_adi: "Otobüslü Balkan Turu",
        tur_tarihi: "14-21 Haziran 2026",
        sikayet_url: "https://www.sikayetvar.com/jolly-tur/jolly-tur-otobus-klimasi-bozuk",
        durum: "Aktif"
      },
      {
        id: Date.now() + 1,
        sikayet_id: `mock-${Date.now() + 1}`,
        tarih: new Date().toISOString(),
        kaynak_site: "Sikayetvar",
        baslik: "Ustour Prizren gezisinde rehber gecikmesi",
        icerik: "Kosova Prizren rehberinin yetersizliği yüzünden Kurban Bayramı turunda 3 saat otobüsün içinde bekledik.",
        anahtar_kelime: "Tiran, Prizren, Balkan Rehberi",
        ai_kategori: "Rehber",
        ai_duygu_skoru: "Orta",
        sikayetci_adi: "Deniz S.",
        acenta_adi: "Ustour",
        tur_adi: "Kurban Bayramı Balkan Turu",
        tur_tarihi: "16-23 Haziran 2026",
        sikayet_url: "https://www.sikayetvar.com/ustour/ustour-prizren-gezisinde-rehber-gecikmesi",
        durum: "Aktif"
      }
    ];

    setComplaints(prev => {
      const filteredPrev = prev.filter(p => !randomComplaints.some(r => r.sikayet_id === p.sikayet_id));
      return [...randomComplaints, ...filteredPrev];
    });
  };

  // CRUD and AI actions
  const clientClassifyText = (title, icerik, defaultAgency) => {
    const text = (title + " " + icerik).toLowerCase();
    let ai_kategori = "Alakasız";
    let ai_duygu_skoru = "Orta";
    let acenta_adi = defaultAgency || "Belirtilmemiş";
    
    // Category mapping
    if (text.includes("otel") || text.includes("pansiyon") || text.includes("oda") || text.includes("klima") || text.includes("temizlik") || text.includes("sıcak su") || text.includes("banyo") || text.includes("kahvaltı") || text.includes("yemek") || text.includes("konaklama")) {
      ai_kategori = "Otel";
    } else if (text.includes("otobüs") || text.includes("uçak") || text.includes("yol") || text.includes("ulaşım") || text.includes("arıza") || text.includes("şoför") || text.includes("kaptan") || text.includes("koltuk") || text.includes("sınır") || text.includes("arabası") || text.includes("transfer")) {
      ai_kategori = "Ulaşım";
    } else if (text.includes("rehber") || text.includes("anlatım") || text.includes("ilgisiz") || text.includes("tavır") || text.includes("rehberlik") || text.includes("kokart")) {
      ai_kategori = "Rehber";
    } else if (text.includes("program") || text.includes("zamanlama") || text.includes("kayma") || text.includes("yetişemedik") || text.includes("göremedik") || text.includes("iptal") || text.includes("ekstra tur") || text.includes("saatlerce bekledik") || text.includes("gecikme")) {
      ai_kategori = "Program Kayması";
    }

    // Sentiment
    if (text.includes("rezalet") || text.includes("kötü") || text.includes("berbat") || text.includes("asla") || text.includes("tüketici hakem") || text.includes("paramı") || text.includes("dava") || text.includes("mağdur")) {
      ai_duygu_skoru = "Kritik";
    } else if (text.includes("sorun") || text.includes("sıkıntı") || text.includes("şikayet") || text.includes("yetersiz")) {
      ai_duygu_skoru = "Orta";
    } else {
      ai_duygu_skoru = "Düşük";
    }

    // Extract Tour Name & Tour Date
    let tur_adi = "Balkan Ülkeleri Turu";
    if (text.includes("büyük balkan") || text.includes("buyuk balkan")) tur_adi = "Büyük Balkan Turu";
    else if (text.includes("baştan başa balkan")) tur_adi = "Baştan Başa Balkan Turu";
    else if (text.includes("otobüslü balkan")) tur_adi = "Otobüslü Balkan Turu";
    else if (text.includes("uçaklı balkan")) tur_adi = "Uçaklı Balkan Turu";

    let tur_tarihi = "Belirtilmemiş";
    const match = text.match(/([0-9]+\s*[-–]\s*[0-9]+\s+(?:haziran|temmuz|ağustos|eylül|ekim|kasım|aralık|ocak|şubat|mart|nisan|mayıs))/i);
    if (match) {
      tur_tarihi = match[0].trim();
    } else if (text.includes("bayram")) {
      tur_tarihi = "Kurban Bayramı";
    }

    // Agency
    if (acenta_adi === "Belirtilmemiş" || !acenta_adi) {
      const agencies = [
        { name: "Jolly Tur", kw: ["jolly", "joly"] },
        { name: "Ustour", kw: ["ustour", "us tour", "us-tour"] },
        { name: "Tatilbudur", kw: ["tatilbudur", "tatil budur"] },
        { name: "Prontotour", kw: ["pronto", "prontotour"] },
        { name: "Gezinomi", kw: ["gezinomi"] },
        { name: "Gruppal", kw: ["gruppal"] }
      ];
      for (const agency of agencies) {
        if (agency.kw.some(k => text.includes(k))) {
          acenta_adi = agency.name;
          break;
        }
      }
    }

    return { ai_kategori, ai_duygu_skoru, acenta_adi, tur_adi, tur_tarihi };
  };

  const handleAISuggest = async () => {
    if (!formState.baslik || !formState.icerik) {
      alert("Lütfen önce şikayet başlığını ve içeriğini doldurun.");
      return;
    }
    setClassifying(true);
    try {
      const res = await fetch('/.netlify/functions/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formState.baslik,
          icerik: formState.icerik,
          acenta_adi: formState.acenta_adi
        })
      });
      if (res.ok) {
        const data = await res.json();
        setFormState(prev => ({
          ...prev,
          ai_kategori: data.ai_kategori || prev.ai_kategori,
          ai_duygu_skoru: data.ai_duygu_skoru || prev.ai_duygu_skoru,
          acenta_adi: data.acenta_adi !== 'Belirtilmemiş' ? data.acenta_adi : prev.acenta_adi,
          tur_adi: data.tur_adi !== 'Balkan Ülkeleri Turu' ? data.tur_adi : prev.tur_adi || data.tur_adi,
          tur_tarihi: data.tur_tarihi !== 'Belirtilmemiş' ? data.tur_tarihi : prev.tur_tarihi
        }));
      } else {
        throw new Error("API call error status");
      }
    } catch (err) {
      console.warn("API classification failed, using client classifier fallback:", err);
      const suggested = clientClassifyText(formState.baslik, formState.icerik, formState.acenta_adi);
      setFormState(prev => ({
        ...prev,
        ai_kategori: suggested.ai_kategori,
        ai_duygu_skoru: suggested.ai_duygu_skoru,
        acenta_adi: suggested.acenta_adi !== 'Belirtilmemiş' ? suggested.acenta_adi : prev.acenta_adi,
        tur_adi: suggested.tur_adi,
        tur_tarihi: suggested.tur_tarihi !== 'Belirtilmemiş' ? suggested.tur_tarihi : prev.tur_tarihi
      }));
    } finally {
      setClassifying(false);
    }
  };

  const handleSaveComplaint = async (e) => {
    e.preventDefault();
    if (!formState.baslik || !formState.icerik) {
      alert("Başlık ve içerik alanları zorunludur.");
      return;
    }

    let url = formState.sikayet_url;
    if (!url) {
      url = `https://www.google.com/search?q=${encodeURIComponent(formState.acenta_adi + ' balkan turu şikayetleri')}`;
    }

    const payload = {
      ...formState,
      sikayet_url: url
    };

    if (supabase) {
      try {
        let response;
        if (editingComplaint) {
          response = await supabase
            .from('balkan_sikayetleri')
            .update(payload)
            .eq('id', editingComplaint.id);
        } else {
          const newId = `manual-${Date.now()}`;
          response = await supabase
            .from('balkan_sikayetleri')
            .insert([{ ...payload, sikayet_id: newId, durum: 'Aktif' }]);
        }

        if (response.error) throw response.error;
        await fetchData();
      } catch (err) {
        console.error("Database save failed:", err);
        alert(`Veritabanına kaydedilemedi: ${err.message}`);
      }
    } else {
      if (editingComplaint) {
        setComplaints(prev => prev.map(c => c.id === editingComplaint.id ? { ...c, ...payload } : c));
      } else {
        const newRecord = {
          ...payload,
          id: Date.now(),
          sikayet_id: `manual-${Date.now()}`,
          durum: 'Aktif'
        };
        setComplaints(prev => [newRecord, ...prev]);
      }
    }
    setShowAddEditModal(false);
    setEditingComplaint(null);
  };

  const handleDeleteComplaint = async (comp) => {
    if (!confirm("Bu şikayet kaydını tamamen silmek istediğinize emin misiniz?")) return;
    
    if (supabase) {
      try {
        const { error } = await supabase
          .from('balkan_sikayetleri')
          .delete()
          .eq('id', comp.id);
        if (error) throw error;
        await fetchData();
      } catch (err) {
        console.error("Delete failed:", err);
        alert(`Silme başarısız oldu: ${err.message}`);
      }
    } else {
      setComplaints(prev => prev.filter(c => c.id !== comp.id));
    }
  };

  const handleToggleArchive = async (comp) => {
    const newDurum = comp.durum === 'Aktif' ? 'Arşiv' : 'Aktif';
    if (supabase) {
      try {
        const { error } = await supabase
          .from('balkan_sikayetleri')
          .update({ durum: newDurum })
          .eq('id', comp.id);
        if (error) throw error;
        await fetchData();
      } catch (err) {
        console.error("Archive status toggle failed:", err);
      }
    } else {
      setComplaints(prev => prev.map(c => c.id === comp.id ? { ...c, durum: newDurum } : c));
    }
  };

  const handleEditComplaint = (comp) => {
    setEditingComplaint(comp);
    setFormState({
      sikayetci_adi: comp.sikayetci_adi || '',
      acenta_adi: comp.acenta_adi || 'Jolly Tur',
      baslik: comp.baslik || '',
      icerik: comp.icerik || '',
      kaynak_site: comp.kaynak_site || 'Google Reviews',
      tarih: comp.tarih ? comp.tarih.split('T')[0] : new Date().toISOString().split('T')[0],
      tur_adi: comp.tur_adi || '',
      tur_tarihi: comp.tur_tarihi || '',
      ai_kategori: comp.ai_kategori || 'Alakasız',
      ai_duygu_skoru: comp.ai_duygu_skoru || 'Orta',
      sikayet_url: comp.sikayet_url || ''
    });
    setShowAddEditModal(true);
  };

  // Extract unique agencies from complaints list for filters
  const uniqueAgencies = useMemo(() => {
    const list = new Set();
    complaints.forEach(c => {
      if (c.acenta_adi && c.acenta_adi !== 'Belirtilmemiş') {
        list.add(c.acenta_adi);
      }
    });
    return Array.from(list);
  }, [complaints]);

  // Filter complaints based on Tab, Search, Category, Sentiment, Agency and Source
  const filteredComplaints = useMemo(() => {
    return complaints.filter(comp => {
      if (comp.durum !== activeTab) return false;
      if (selectedCategory !== 'Hepsi' && comp.ai_kategori !== selectedCategory) return false;
      if (selectedSentiment !== 'Hepsi' && comp.ai_duygu_skoru !== selectedSentiment) return false;
      if (selectedAgency !== 'Hepsi' && comp.acenta_adi !== selectedAgency) return false;
      if (selectedSource !== 'Hepsi' && comp.kaynak_site !== selectedSource) return false;

      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = comp.baslik.toLowerCase().includes(query);
        const matchesContent = comp.icerik.toLowerCase().includes(query);
        const matchesKeywords = comp.anahtar_kelime?.toLowerCase().includes(query);
        const matchesComplainant = comp.sikayetci_adi?.toLowerCase().includes(query);
        const matchesAgency = comp.acenta_adi?.toLowerCase().includes(query);
        return matchesTitle || matchesContent || matchesKeywords || matchesComplainant || matchesAgency;
      }

      return true;
    });
  }, [complaints, activeTab, selectedCategory, selectedSentiment, selectedAgency, searchQuery]);

  // Compute Statistics for Current View
  const stats = useMemo(() => {
    const activeItems = complaints.filter(c => c.durum === activeTab);
    const total = activeItems.length;
    const criticalCount = activeItems.filter(c => c.ai_duygu_skoru === 'Kritik').length;
    
    // Category Counts
    const categoryCounts = {};
    activeItems.forEach(c => {
      categoryCounts[c.ai_kategori] = (categoryCounts[c.ai_kategori] || 0) + 1;
    });
    
    let topCategory = 'Yok';
    let maxCatCount = 0;
    Object.entries(categoryCounts).forEach(([cat, count]) => {
      if (count > maxCatCount && cat !== 'Alakasız') {
        topCategory = cat;
        maxCatCount = count;
      }
    });

    // Destination Mention Counts
    const destCounts = {};
    const destKeywords = ["Üsküp", "Ohrid", "Tetovo", "Saraybosna", "Mostar", "Blagaj", "Belgrad", "Novi Sad", "Kotor", "Budva", "Tiran", "Prizren"];
    
    activeItems.forEach(c => {
      const text = (c.baslik + " " + c.icerik + " " + (c.anahtar_kelime || "")).toLowerCase();
      destKeywords.forEach(dest => {
        if (text.includes(dest.toLowerCase())) {
          destCounts[dest] = (destCounts[dest] || 0) + 1;
        }
      });
    });

    let topDestination = 'Yok';
    let maxDestCount = 0;
    Object.entries(destCounts).forEach(([dest, count]) => {
      if (count > maxDestCount) {
        topDestination = dest;
        maxDestCount = count;
      }
    });

    return {
      total,
      critical: criticalCount,
      topCategory,
      topDestination: topDestination === 'Yok' ? 'Yok' : `${topDestination} (${maxDestCount})`
    };
  }, [complaints, activeTab]);

  // Donut Chart Config (ApexCharts - Styled for Light Mode)
  const chartData = useMemo(() => {
    const categories = ['Ulaşım', 'Rehber', 'Otel', 'Program Kayması', 'Alakasız'];
    const activeItems = complaints.filter(c => c.durum === activeTab);
    
    const series = categories.map(cat => {
      return activeItems.filter(c => c.ai_kategori === cat).length;
    });

    const totalDataPoints = series.reduce((a, b) => a + b, 0);

    const options = {
      chart: {
        type: 'donut',
        background: 'transparent',
        foreColor: '#64748b' // Slate 500
      },
      labels: categories,
      colors: ['#4f46e5', '#8b5cf6', '#10b981', '#f59e0b', '#94a3b8'], // Indigo, Purple, Emerald, Amber, Slate
      stroke: {
        show: true,
        colors: ['#ffffff'],
        width: 3
      },
      legend: {
        position: 'bottom',
        fontSize: '13px',
        fontFamily: 'Outfit, sans-serif',
        labels: {
          colors: '#475569' // Slate 600
        },
        markers: {
          radius: 12
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '11px',
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 'bold',
          colors: ['#ffffff']
        },
        dropShadow: {
          enabled: false
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '72%',
            background: 'transparent',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '14px',
                fontFamily: 'Outfit, sans-serif',
                color: '#64748b', // Slate 500
                offsetY: -5
              },
              value: {
                show: true,
                fontSize: '22px',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: '800',
                color: '#1e293b', // Slate 800
                offsetY: 5,
                formatter: function (val) {
                  return val;
                }
              },
              total: {
                show: true,
                label: 'Toplam',
                color: '#64748b',
                fontSize: '13px',
                fontFamily: 'Outfit, sans-serif',
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                }
              }
            }
          }
        }
      },
      tooltip: {
        theme: 'light',
        style: {
          fontSize: '12px',
          fontFamily: 'Outfit, sans-serif'
        }
      }
    };

    return { series, options, hasData: totalDataPoints > 0 };
  }, [complaints, activeTab]);

  // Agency Donut Chart Config (ApexCharts - Styled for Light Mode)
  const agencyChartData = useMemo(() => {
    const activeItems = complaints.filter(c => c.durum === activeTab);
    
    // Count complaints per agency
    const counts = {};
    activeItems.forEach(c => {
      const agency = c.acenta_adi || 'Belirtilmemiş';
      counts[agency] = (counts[agency] || 0) + 1;
    });

    // Sort by count descending
    const sortedAgencies = Object.entries(counts)
      .sort((a, b) => b[1] - a[1]);

    // Take top 5 and group others
    const topLimit = 5;
    const labels = [];
    const series = [];
    let othersCount = 0;

    sortedAgencies.forEach(([agency, count], idx) => {
      if (idx < topLimit) {
        labels.push(agency);
        series.push(count);
      } else {
        othersCount += count;
      }
    });

    if (othersCount > 0) {
      labels.push('Diğer');
      series.push(othersCount);
    }

    const totalDataPoints = series.reduce((a, b) => a + b, 0);

    const options = {
      chart: {
        type: 'donut',
        background: 'transparent',
        foreColor: '#64748b'
      },
      labels: labels,
      colors: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#94a3b8'], // Amber, Blue, Emerald, Red, Purple, Slate
      stroke: {
        show: true,
        colors: ['#ffffff'],
        width: 3
      },
      legend: {
        position: 'bottom',
        fontSize: '13px',
        fontFamily: 'Outfit, sans-serif',
        labels: {
          colors: '#475569'
        },
        markers: {
          radius: 12
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '11px',
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 'bold',
          colors: ['#ffffff']
        },
        dropShadow: {
          enabled: false
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '72%',
            background: 'transparent',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '14px',
                fontFamily: 'Outfit, sans-serif',
                color: '#64748b',
                offsetY: -5
              },
              value: {
                show: true,
                fontSize: '22px',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: '800',
                color: '#1e293b',
                offsetY: 5,
                formatter: function (val) {
                  return val;
                }
              },
              total: {
                show: true,
                label: 'Toplam',
                color: '#64748b',
                fontSize: '13px',
                fontFamily: 'Outfit, sans-serif',
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                }
              }
            }
          }
        }
      },
      tooltip: {
        theme: 'light',
        style: {
          fontSize: '12px',
          fontFamily: 'Outfit, sans-serif'
        }
      }
    };

    return { series, options, hasData: totalDataPoints > 0 };
  }, [complaints, activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased relative selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Premium Opening Animation (Splash Screen) */}
      {showSplash && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-all duration-500 ease-in-out ${splashFade ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex flex-col items-center gap-6 max-w-sm px-8 text-center">
            {/* Spinning Custom Animated Logo / GIF */}
            {!gifError ? (
              <div className="relative w-32 h-32 flex items-center justify-center">
                <img 
                  src="/loader.gif" 
                  alt="Yükleniyor..." 
                  className="w-full h-full object-contain"
                  onError={() => setGifError(true)}
                />
              </div>
            ) : (
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100 animate-pulse"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent animate-spin duration-1000"></div>
                <Compass className="w-10 h-10 text-indigo-600 animate-bounce" />
              </div>
            )}

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold tracking-wider font-sans text-slate-850">
                BALKAN TOURS
              </h2>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">
                Şikayet İş Zekası Portalı
              </p>
            </div>

            {/* Custom Premium Loading bar */}
            <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-100 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-xs text-slate-400 font-semibold">{Math.round(progress)}% Yükleniyor</span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur sticky top-0 z-40 px-4 py-3 md:px-6 md:py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
          
          {/* Logo & Settings on Mobile (Row 1), Logo alone on Desktop */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <img src="/logo.svg" className="h-44 md:h-60 lg:h-72 w-auto object-contain" alt="Logo" />
            
            {/* Settings button visible only on mobile inside this row */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => runAdminAction(() => setShowConfig(true))}
                className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 active:scale-95 transition-all"
                title="Bağlantı Ayarları"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
 
          {/* Controls: status and refresh (plus desktop settings/add button) */}
          <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-3 flex-wrap sm:flex-nowrap">
            {/* Realtime Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
              <span className={`w-2 h-2 rounded-full ${realtimeConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span className="text-slate-600 font-semibold">
                {realtimeConnected ? 'Canlı Akış Aktif' : 'Demo / Manuel Bağlantı'}
              </span>
            </div>
 
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-sm shadow-orange-500/20 transition-all duration-200 ${refreshing ? 'opacity-85 cursor-not-allowed' : 'active:scale-95 cursor-pointer'}`}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Taranıyor (5sn)...' : 'Şimdi Yenile'}</span>
              </button>
 
              {/* Settings button on desktop */}
              <button
                onClick={() => runAdminAction(() => setShowConfig(true))}
                className="hidden md:block p-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all active:scale-95 cursor-pointer"
                title="Bağlantı Ayarları"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 flex flex-col gap-6">
        
        {/* Error / Fallback Banner */}
        {errorStatus && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center gap-3 shadow-sm">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
            <p className="flex-1 font-semibold">{errorStatus}</p>
            <button 
              onClick={() => setErrorStatus(null)} 
              className="text-amber-500 hover:text-amber-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {!supabaseUrl && !supabaseKey && (
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-900 text-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-indigo-600" />
              <div>
                <p className="font-bold text-slate-800">Demo Modu Aktif</p>
                <p className="text-xs text-indigo-700">Canlı verileri kendi Supabase veritabanınız üzerinden çekmek için bağlantı ayarlarını yapın.</p>
              </div>
            </div>
            <button
              onClick={() => runAdminAction(() => setShowConfig(true))}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 transition-colors shadow-sm"
            >
              Supabase Bağlantısı Kur
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-3xl bg-white border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200">
            <div>
              <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Toplam Şikayet</p>
              <h3 className="text-3xl font-extrabold mt-1 text-slate-800">{stats.total}</h3>
              <p className="text-[11px] text-slate-500 mt-1.5 font-medium">{activeTab} sekmesindeki şikayetler</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 text-slate-600">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200">
            <div>
              <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Kritik Seviye</p>
              <h3 className="text-3xl font-extrabold mt-1 text-red-600">{stats.critical}</h3>
              <p className="text-[11px] text-red-500 mt-1.5 font-medium">Acil aksiyon gerektiren durumlar</p>
            </div>
            <div className="p-4 rounded-2xl bg-red-50 text-red-600 border border-red-100">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200">
            <div>
              <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">En Yoğun Kategori</p>
              <h3 className="text-lg font-extrabold mt-2 text-indigo-600 truncate">{stats.topCategory}</h3>
              <p className="text-[11px] text-slate-500 mt-1.5 font-medium">En çok şikayet alan başlık</p>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200">
            <div>
              <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">En Çok Geçen Lokasyon</p>
              <h3 className="text-lg font-extrabold mt-2 text-emerald-600 truncate">{stats.topDestination}</h3>
              <p className="text-[11px] text-slate-500 mt-1.5 font-medium">Şikayetlerde geçen öncelikli bölge</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
        </section>

        {/* Dashboard Content split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column: Complaints Feed */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            
            {/* Filter controls panel */}
            <div className="p-5 rounded-3xl bg-white border border-slate-100 flex flex-col gap-4 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                {/* Tab Switcher */}
                <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200/60">
                  <button
                    onClick={() => { setActiveTab('Aktif'); setSelectedCategory('Hepsi'); setSelectedSentiment('Hepsi'); setSelectedAgency('Hepsi'); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'Aktif' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    <Inbox className="w-4 h-4" />
                    Son 10 Gün (Aktif)
                  </button>
                  <button
                    onClick={() => { setActiveTab('Arşiv'); setSelectedCategory('Hepsi'); setSelectedSentiment('Hepsi'); setSelectedAgency('Hepsi'); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'Arşiv' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    <Archive className="w-4 h-4" />
                    Arşiv Dosyası
                  </button>
                </div>

                {/* Quick Search */}
                <div className="relative w-full sm:w-64">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    placeholder="Şikayetlerde, acentalarda ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Categorical & Agency filters */}
              <div className="grid grid-cols-2 md:flex md:flex-wrap items-stretch md:items-center gap-3 md:gap-4 text-xs pt-3 border-t border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-2">
                  <span className="text-slate-500 font-bold">Kategori:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-50 border border-slate-200 px-3 py-2 md:py-1.5 rounded-xl text-slate-700 font-semibold focus:outline-none focus:border-indigo-500 transition-colors w-full md:w-auto cursor-pointer"
                  >
                    <option value="Hepsi">Tüm Kategoriler</option>
                    <option value="Ulaşım">Ulaşım</option>
                    <option value="Rehber">Rehber</option>
                    <option value="Otel">Otel</option>
                    <option value="Program Kayması">Program Kayması</option>
                    <option value="Alakasız">Alakasız</option>
                  </select>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-2">
                  <span className="text-slate-500 font-bold">Duygu:</span>
                  <select
                    value={selectedSentiment}
                    onChange={(e) => setSelectedSentiment(e.target.value)}
                    className="bg-slate-50 border border-slate-200 px-3 py-2 md:py-1.5 rounded-xl text-slate-700 font-semibold focus:outline-none focus:border-indigo-500 transition-colors w-full md:w-auto cursor-pointer"
                  >
                    <option value="Hepsi">Tüm Seviyeler</option>
                    <option value="Kritik">Kritik</option>
                    <option value="Orta">Orta</option>
                    <option value="Düşük">Düşük</option>
                  </select>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-2">
                  <span className="text-slate-500 font-bold">Acenta/Firma:</span>
                  <select
                    value={selectedAgency}
                    onChange={(e) => setSelectedAgency(e.target.value)}
                    className="bg-slate-50 border border-slate-200 px-3 py-2 md:py-1.5 rounded-xl text-slate-700 font-semibold focus:outline-none focus:border-indigo-500 transition-colors w-full md:w-auto cursor-pointer"
                  >
                    <option value="Hepsi">Tüm Acentalar</option>
                    {uniqueAgencies.map((agency) => (
                      <option key={agency} value={agency}>{agency}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-2">
                  <span className="text-slate-500 font-bold">Kaynak:</span>
                  <select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className="bg-slate-50 border border-slate-200 px-3 py-2 md:py-1.5 rounded-xl text-slate-700 font-semibold focus:outline-none focus:border-indigo-500 transition-colors w-full md:w-auto cursor-pointer"
                  >
                    <option value="Hepsi">Tüm Kaynaklar</option>
                    <option value="Sikayetvar">Şikayetvar</option>
                    <option value="Google Reviews">Google Reviews</option>
                    <option value="Tatil Forumu">Tatil Forumu</option>
                  </select>
                </div>

                {(selectedCategory !== 'Hepsi' || selectedSentiment !== 'Hepsi' || selectedAgency !== 'Hepsi' || selectedSource !== 'Hepsi' || searchQuery !== '') && (
                  <button
                    onClick={() => { setSelectedCategory('Hepsi'); setSelectedSentiment('Hepsi'); setSelectedAgency('Hepsi'); setSelectedSource('Hepsi'); setSearchQuery(''); }}
                    className="text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer mt-1 md:mt-0 col-span-2 text-center md:text-left md:ml-auto"
                  >
                    Filtreleri Temizle
                  </button>
                )}
              </div>
            </div>

            {/* Complaints List */}
            <div className="flex flex-col gap-5 max-h-[850px] overflow-y-auto pr-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
                  <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                  <p className="text-sm font-bold text-slate-500 mt-4">Veriler yükleniyor...</p>
                </div>
              ) : filteredComplaints.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl text-center px-6 shadow-sm">
                  <AlertCircle className="w-10 h-10 text-slate-300 mb-3" />
                  <h4 className="text-slate-800 font-extrabold text-base">Herhangi bir şikayet kaydı bulunamadı</h4>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">Seçilen kriterlere veya arama sorgusuna uygun kayıt bulunmamaktadır.</p>
                </div>
              ) : (
                filteredComplaints.map((comp) => (
                  <div 
                    key={comp.id || comp.sikayet_id}
                    className={`p-6 rounded-3xl bg-white border transition-all duration-300 hover:-translate-y-[3px] hover:shadow-md ${
                      comp.ai_duygu_skoru === 'Kritik' 
                        ? 'border-red-150 hover:border-red-200 bg-red-50/5' 
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    {/* Card Header badges */}
                    <div className="flex items-center justify-between gap-3 mb-4 flex-wrap sm:flex-nowrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Target Agency Badge */}
                        {comp.acenta_adi && comp.acenta_adi !== 'Belirtilmemiş' && (
                          <span className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100/50">
                            <Building2 className="w-3.5 h-3.5" />
                            {comp.acenta_adi}
                          </span>
                        )}

                        {/* AI Category Badge */}
                        <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                          comp.ai_kategori === 'Ulaşım' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                          comp.ai_kategori === 'Rehber' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                          comp.ai_kategori === 'Otel' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          comp.ai_kategori === 'Program Kayması' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                          'bg-slate-50 text-slate-500 border border-slate-200'
                        }`}>
                          {comp.ai_kategori}
                        </span>

                        {/* AI Sentiment Badge */}
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                          comp.ai_duygu_skoru === 'Kritik' ? 'bg-red-50 text-red-600 border border-red-200' :
                          comp.ai_duygu_skoru === 'Orta' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                          'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        }`}>
                          {comp.ai_duygu_skoru}
                        </span>

                        {/* Source Badge */}
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-500 border border-slate-200/50 font-semibold">
                          {comp.kaynak_site}
                        </span>
                      </div>

                      {/* Action buttons (Edit, Archive, Delete) */}
                      <div className="flex items-center gap-1 ml-auto shrink-0">
                        <button
                          onClick={() => runAdminAction(() => handleToggleArchive(comp))}
                          className={`p-1.5 rounded-xl border transition-all active:scale-95 cursor-pointer ${
                            comp.durum === 'Aktif' 
                              ? 'bg-white border-slate-200 text-slate-400 hover:text-slate-650 hover:bg-slate-50' 
                              : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'
                          }`}
                          title={comp.durum === 'Aktif' ? 'Arşive Gönder' : 'Arşivden Çıkar'}
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => runAdminAction(() => handleEditComplaint(comp))}
                          className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-650 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
                          title="Düzenle"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => runAdminAction(() => handleDeleteComplaint(comp))}
                          className="p-1.5 rounded-xl bg-white border border-red-200 text-red-400 hover:text-red-650 hover:bg-red-50 transition-all active:scale-95 cursor-pointer"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <h4 className="text-lg font-extrabold text-slate-800 hover:text-slate-900 leading-snug mb-2 flex items-start gap-2">
                      {comp.baslik}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-4 font-normal">
                      {comp.icerik}
                    </p>

                    {/* Meta info bar inside card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                      <div className="flex flex-col gap-1.5">
                        {comp.tur_adi && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400 font-bold">Tur:</span>
                            <span className="text-slate-700 font-bold">{comp.tur_adi}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 font-bold">Şikayet Tarihi:</span>
                          <span className="text-slate-700 font-bold">
                            {new Date(comp.tarih).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        {comp.tur_tarihi && comp.tur_tarihi !== 'Belirtilmemiş' && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400 font-bold">Tur Tarihi:</span>
                            <span className="text-indigo-600 font-extrabold bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded-lg">{comp.tur_tarihi}</span>
                          </div>
                        )}
                        
                        {comp.sikayet_url && (
                          <a 
                            href={comp.sikayet_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-extrabold mt-auto hover:underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Şikayet Sayfasına Git
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Keywords Tag Cloud */}
                    {comp.anahtar_kelime && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-slate-100/60">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1">Konum Eşleşmeleri:</span>
                        {comp.anahtar_kelime.split(',').map((kw, i) => (
                          <span 
                            key={i} 
                            className="px-2 py-0.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-[10px] text-slate-600 border border-slate-200/50 font-bold transition-colors"
                          >
                            {kw.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Analytics & Info */}
          <div className="flex flex-col gap-6 sticky top-28">
            
            {/* Donut Chart Panel */}
            <div className="p-6 rounded-3xl bg-white border border-slate-100 flex flex-col gap-4 shadow-sm">
              <div>
                <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  Kategori Dağılımı ({activeTab})
                </h3>
                <p className="text-xs text-slate-400 font-semibold">Kategorilere göre yapay zeka analiz dağılımı</p>
              </div>

              <div className="py-2 flex justify-center">
                {chartData.hasData ? (
                  <div className="w-full">
                    <ReactApexChart 
                      options={chartData.options} 
                      series={chartData.series} 
                      type="donut" 
                      height={290} 
                    />
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-slate-400 font-semibold">
                    Analiz edecek veri bulunmamaktadır.
                  </div>
                )}
              </div>
            </div>

            {/* Agency Donut Chart Panel */}
            <div className="p-6 rounded-3xl bg-white border border-slate-100 flex flex-col gap-4 shadow-sm">
              <div>
                <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-orange-500" />
                  Acenta Dağılımı ({activeTab})
                </h3>
                <p className="text-xs text-slate-400 font-semibold">Acentelerin şikayet payı ve yüzdeleri</p>
              </div>

              <div className="py-2 flex justify-center">
                {agencyChartData.hasData ? (
                  <div className="w-full">
                    <ReactApexChart 
                      options={agencyChartData.options} 
                      series={agencyChartData.series} 
                      type="donut" 
                      height={290} 
                    />
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-slate-400 font-semibold">
                    Analiz edecek veri bulunmamaktadır.
                  </div>
                )}
              </div>
            </div>

            {/* Keyword Matrix Reference */}
            <div className="p-6 rounded-3xl bg-white border border-slate-100 flex flex-col gap-3 shadow-sm">
              <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-500" />
                Balkan Konum Harita Matrisi
              </h4>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                Sistem aşağıdaki balkan konumlarını şikayet metninde otomatik olarak tarar:
              </p>
              <div className="flex flex-col gap-2 mt-1">
                <div className="flex justify-between text-xs border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500 font-medium">K. Makedonya</span>
                  <span className="text-indigo-600 font-bold">Üsküp, Ohrid, Tetovo, Matka</span>
                </div>
                <div className="flex justify-between text-xs border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500 font-medium">Bosna Hersek</span>
                  <span className="text-indigo-600 font-bold">Saraybosna, Mostar, Blagaj, Konjic</span>
                </div>
                <div className="flex justify-between text-xs border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500 font-medium">Sırbistan</span>
                  <span className="text-indigo-600 font-bold">Belgrad, Novi Sad, Niş</span>
                </div>
                <div className="flex justify-between text-xs border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500 font-medium">Karadağ</span>
                  <span className="text-indigo-600 font-bold">Kotor, Budva, Podgorica, Tivat</span>
                </div>
                <div className="flex justify-between text-xs border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500 font-medium">Arnavutluk</span>
                  <span className="text-indigo-600 font-bold">Tiran, Durres, Elbasan, İşkodra</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Kosova</span>
                  <span className="text-indigo-600 font-bold">Prizren, Priştine, Pey</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Configuration Modal */}
      {showConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl shadow-2xl p-6 relative">
            <button 
              onClick={() => setShowConfig(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-5 h-5 text-indigo-650" />
              <h3 className="text-lg font-extrabold text-slate-800">Bağlantı Ayarları</h3>
            </div>

            <p className="text-xs text-slate-400 font-semibold leading-relaxed mb-4">
              Verileri Supabase veritabanınıza yazmak ve web scraping tetiklemek için bilgilerinizi girin. Bu bilgiler tarayıcınızın yerel hafızasında (LocalStorage) saklanır.
            </p>

            <form onSubmit={handleSaveConfig} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Supabase URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://xxxxxx.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Supabase Anon Key</label>
                <input
                  type="password"
                  required
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Scrape Webhook URL</label>
                <input
                  type="text"
                  required
                  placeholder="/.netlify/functions/scrape-webhook"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={handleResetConfig}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all active:scale-95"
                >
                  Demo Moduna Dön
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/10 transition-all active:scale-95"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Complaint Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-slate-100 rounded-3xl shadow-2xl p-6 relative my-8">
            <button 
              onClick={() => { setShowAddEditModal(false); setEditingComplaint(null); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <Plus className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-extrabold text-slate-800">
                {editingComplaint ? 'Şikayeti Düzenle' : 'Yeni Şikayet Ekle'}
              </h3>
            </div>

            <form onSubmit={handleSaveComplaint} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Şikayetçi Adı</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Ahmet K."
                    value={formState.sikayetci_adi}
                    onChange={(e) => setFormState(prev => ({ ...prev, sikayetci_adi: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kaynak Site</label>
                  <select
                    value={formState.kaynak_site}
                    onChange={(e) => setFormState(prev => ({ ...prev, kaynak_site: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="Sikayetvar">Şikayetvar</option>
                    <option value="Google Reviews">Google Reviews</option>
                    <option value="Tatil Forumu">Tatil Forumu</option>
                    <option value="Telefon">Telefon Görüşmesi</option>
                    <option value="E-posta">E-posta</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Seyahat Acentası</label>
                  <select
                    value={formState.acenta_adi}
                    onChange={(e) => setFormState(prev => ({ ...prev, acenta_adi: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="Jolly Tur">Jolly Tur</option>
                    <option value="Ustour">Ustour</option>
                    <option value="Tatilbudur">Tatilbudur</option>
                    <option value="Prontotour">Prontotour</option>
                    <option value="Gezinomi">Gezinomi</option>
                    <option value="Gruppal">Gruppal</option>
                    <option value="Kappa Tur">Kappa Tur</option>
                    <option value="Coral Travel">Coral Travel</option>
                    <option value="Touristica">Touristica</option>
                    <option value="Belirtilmemiş">Belirtilmemiş</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Şikayet Tarihi</label>
                  <input
                    type="date"
                    required
                    value={formState.tarih}
                    onChange={(e) => setFormState(prev => ({ ...prev, tarih: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Şikayet Başlığı</label>
                <input
                  type="text"
                  required
                  placeholder="Şikayetin kısa özeti"
                  value={formState.baslik}
                  onChange={(e) => setFormState(prev => ({ ...prev, baslik: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Şikayet İçeriği</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Detaylı şikayet metni..."
                  value={formState.icerik}
                  onChange={(e) => setFormState(prev => ({ ...prev, icerik: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none font-normal"
                />
              </div>

              {/* AI Categorizer Action Bar */}
              <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="text-xs text-indigo-950 font-bold leading-normal">
                  💡 Yapay Zeka ile analizi otomatik tamamlayın.
                </div>
                <button
                  type="button"
                  onClick={handleAISuggest}
                  disabled={classifying}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm shadow-indigo-500/10 transition-all duration-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${classifying ? 'animate-spin' : ''}`} />
                  {classifying ? 'Çözümleniyor...' : '🤖 AI Sınıflandır'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">AI Kategori</label>
                  <select
                    value={formState.ai_kategori}
                    onChange={(e) => setFormState(prev => ({ ...prev, ai_kategori: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="Ulaşım">Ulaşım</option>
                    <option value="Rehber">Rehber</option>
                    <option value="Otel">Otel</option>
                    <option value="Program Kayması">Program Kayması</option>
                    <option value="Alakasız">Alakasız</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">AI Duygu Skoru</label>
                  <select
                    value={formState.ai_duygu_skoru}
                    onChange={(e) => setFormState(prev => ({ ...prev, ai_duygu_skoru: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="Düşük">Düşük</option>
                    <option value="Orta">Orta</option>
                    <option value="Kritik">Kritik</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tur Adı (Gerçek)</label>
                  <input
                    type="text"
                    placeholder="Örn: Baştan Başa Balkan Turu"
                    value={formState.tur_adi}
                    onChange={(e) => setFormState(prev => ({ ...prev, tur_adi: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Katıldığı Tur Tarihi</label>
                  <input
                    type="text"
                    placeholder="Örn: 18-26 Haziran veya Bayram Tatili"
                    value={formState.tur_tarihi}
                    onChange={(e) => setFormState(prev => ({ ...prev, tur_tarihi: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Şikayet Linki (İsteğe Bağlı)</label>
                <input
                  type="url"
                  placeholder="https://www.sikayetvar.com/..."
                  value={formState.sikayet_url}
                  onChange={(e) => setFormState(prev => ({ ...prev, sikayet_url: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => { setShowAddEditModal(false); setEditingComplaint(null); }}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-500/10 transition-all active:scale-95 cursor-pointer"
                >
                  {editingComplaint ? 'Değişiklikleri Kaydet' : 'Şikayeti Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Password Login Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-sm bg-white border border-slate-100 rounded-3xl shadow-2xl p-6 relative">
            <button 
              onClick={() => { setShowAdminModal(false); setPendingAction(null); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="p-4 rounded-full bg-orange-50 text-orange-500 border border-orange-100/50">
                <ShieldAlert className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-800">Yönetici Girişi</h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed mt-1">
                  Bu işlemi gerçekleştirmek için lütfen yönetici şifresini girin.
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="w-full flex flex-col gap-4 mt-2">
                <div>
                  <input
                    type="password"
                    required
                    autoFocus
                    placeholder="••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full text-center tracking-widest font-extrabold text-xl px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                  />
                  {adminError && (
                    <p className="text-red-500 text-xs font-bold mt-2">{adminError}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowAdminModal(false); setPendingAction(null); }}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-orange-500/10 transition-all active:scale-95 cursor-pointer"
                  >
                    Giriş Yap
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-100 py-6 mt-auto bg-white text-center text-xs text-slate-400 font-semibold">
        <p>© 2026 Balkan Tours AI Complaint Tracking System. Tüm Hakları Saklıdır.</p>
      </footer>
    </div>
  );
}
