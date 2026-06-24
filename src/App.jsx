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
  Globe
} from 'lucide-react';

// Enhanced mock complaints database
const INITIAL_DEMO_DATA = [
  {
    id: 1,
    sikayet_id: "sikayetvar-001",
    tarih: new Date().toISOString(),
    kaynak_site: "Sikayetvar",
    baslik: "Ustour Rehber Rezaleti ve Program Kayması",
    icerik: "Büyük Balkan Turu kapsamında Üsküp ve Saraybosna gezisi yapacaktık. Ancak rehberimiz son derece tecrübesizdi. Mostar Köprüsü'ne gitmek yerine saatlerce otobüste bekledik. Program kayması yüzünden Blagaj Tekkesi'ni hiç göremedik.",
    anahtar_kelime: "Balkan Turu, Belgrad, Kotor, Budva, Ulaşım",
    ai_kategori: "Rehber",
    ai_duygu_skoru: "Kritik",
    sikayetci_adi: "Kaan K.",
    acenta_adi: "Ustour",
    tur_adi: "Büyük Balkan Turu",
    tur_tarihi: "15-22 Haziran 2026",
    sikayet_url: "https://www.sikayetvar.com/ustour/ustour-rehber-rezaleti-ve-program-kaymasi",
    durum: "Aktif"
  },
  {
    id: 2,
    sikayet_id: "sikayetvar-002",
    tarih: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    kaynak_site: "Sikayetvar",
    baslik: "Jolly Tur Kotor'da Rezil Otel Deneyimi",
    icerik: "Budva ve Kotor turlarını içeren 12-19 Haziran Balkan Turu'na katıldık. Kalacağımız otel Kotor'da çok eski ve pisti. Klimalar çalışmıyordu, sıcak su akmıyordu. Tur rehberi hiçbir şekilde yardımcı olmadı.",
    anahtar_kelime: "Üsküp, Ohrid, Tetovo, Balkan Rehberi",
    ai_kategori: "Otel",
    ai_duygu_skoru: "Kritik",
    sikayetci_adi: "Ayşe T.",
    acenta_adi: "Jolly Tur",
    tur_adi: "Klasik Balkan Turu",
    tur_tarihi: "12-19 Haziran 2026",
    sikayet_url: "https://www.sikayetvar.com/jolly-tur/jolly-tur-kotorda-rezil-otel-deneyimi",
    durum: "Aktif"
  },
  {
    id: 3,
    sikayet_id: "sikayetvar-003",
    tarih: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    kaynak_site: "Tatil Forumu",
    baslik: "Tatilbudur Otobüslü Balkan Turu Ulaşım Sıkıntısı",
    icerik: "Tatilbudur ile katıldığımız Mayıs ayındaki Otobüslü Balkan Turu ile Belgrad ve Novi Sad'a gittik. Otobüs yolda 2 kere arıza yaptı, saatlerce sınır kapılarında bekletildik. Ulaşım planlaması çok kötüydü.",
    anahtar_kelime: "Mostar, Saraybosna, Blagaj, Otel",
    ai_kategori: "Ulaşım",
    ai_duygu_skoru: "Orta",
    sikayetci_adi: "Mustafa B.",
    acenta_adi: "Tatilbudur",
    tur_adi: "Otobüslü Balkan Turu",
    tur_tarihi: "18-25 Mayıs 2026",
    sikayet_url: "https://www.tatilforum.com/tatilbudur/otobuslu-balkan-turu-ulasim-sikintisi",
    durum: "Aktif"
  },
  {
    id: 4,
    sikayet_id: "sikayetvar-004",
    tarih: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    kaynak_site: "Google Reviews",
    baslik: "Prontotour Tiran ve Prizren Gezisi - Rehber Yetersizliği",
    icerik: "Prontotour ile Kurban Bayramı Balkan Turu'na katıldık. Arnavutluk Tiran ve Kosova Prizren rehberi ülkeyi hiç tanımıyordu. Bizi sadece anlaşmalı olduğu dükkanlara götürdü, tarihi yerleri anlatmadı.",
    anahtar_kelime: "Novi Sad, Nis, Program Kayması",
    ai_kategori: "Rehber",
    ai_duygu_skoru: "Orta",
    sikayetci_adi: "Zeynep Y.",
    acenta_adi: "Prontotour",
    tur_adi: "Kurban Bayramı Balkan Turu",
    tur_tarihi: "16-23 Haziran 2026",
    sikayet_url: "https://www.google.com/maps/contrib/prontotour-reviews",
    durum: "Aktif"
  },
  {
    id: 5,
    sikayet_id: "forum-012",
    tarih: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    kaynak_site: "Sikayetvar",
    baslik: "Gezinomi Eski Tarihli Otel Şikayeti",
    icerik: "Ohrid gölü kenarında otel diye bizi 5-12 Nisan tarihindeki turda çok uzak bir pansiyona yerleştirdiler. Bu balkan turu firması tam bir hayal kırıklığı.",
    anahtar_kelime: "Tiran, Durres, Elbasan, Otel",
    ai_kategori: "Otel",
    ai_duygu_skoru: "Kritik",
    sikayetci_adi: "Mehmet A.",
    acenta_adi: "Gezinomi",
    tur_adi: "Ekspres Balkan Turu",
    tur_tarihi: "5-12 Nisan 2026",
    sikayet_url: "https://www.sikayetvar.com/gezinomi/gezinomi-eski-tarihli-otel-sikayeti",
    durum: "Arşiv"
  },
  {
    id: 6,
    sikayet_id: "google-099",
    tarih: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    kaynak_site: "Sikayetvar",
    baslik: "Gruppal Yemeklerin Kalitesizliği",
    icerik: "Gruppal ile Nisan sonu Saraybosna ve Belgrad gezisinde anlaşmalı restoranlarda verilen yemekler çok kötüydü. Sürekli köfte yemekten bıktık.",
    anahtar_kelime: "Prizren, Prishtina, Ulaşım",
    ai_kategori: "Alakasız",
    ai_duygu_skoru: "Düşük",
    sikayetci_adi: "Ebru G.",
    acenta_adi: "Gruppal",
    tur_adi: "Butik Balkan Turu",
    tur_tarihi: "20-27 Nisan 2026",
    sikayet_url: "https://www.sikayetvar.com/gruppal/gruppal-yemeklerin-kalitesizligi",
    durum: "Arşiv"
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
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" className="h-16 w-auto object-contain" alt="Logo" />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Realtime Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
              <span className={`w-2 h-2 rounded-full ${realtimeConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span className="text-slate-600 font-semibold">
                {realtimeConnected ? 'Canlı Akış Aktif' : 'Demo / Manuel Bağlantı'}
              </span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex items-center gap-2 px-4.5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-sm shadow-indigo-500/10 transition-all duration-200 ${refreshing ? 'opacity-85 cursor-not-allowed' : 'active:scale-95'}`}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Taranıyor (5sn)...' : '🔄 Şimdi Yenile'}
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setShowConfig(true)}
              className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all"
              title="Bağlantı Ayarları"
            >
              <Settings className="w-5 h-5" />
            </button>
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
              onClick={() => setShowConfig(true)}
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
              <div className="flex flex-wrap items-center gap-4 text-xs pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-bold">Kategori:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700 font-semibold focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="Hepsi">Tüm Kategoriler</option>
                    <option value="Ulaşım">Ulaşım</option>
                    <option value="Rehber">Rehber</option>
                    <option value="Otel">Otel</option>
                    <option value="Program Kayması">Program Kayması</option>
                    <option value="Alakasız">Alakasız</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-bold">Duygu Skoru:</span>
                  <select
                    value={selectedSentiment}
                    onChange={(e) => setSelectedSentiment(e.target.value)}
                    className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700 font-semibold focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="Hepsi">Tüm Seviyeler</option>
                    <option value="Kritik">Kritik</option>
                    <option value="Orta">Orta</option>
                    <option value="Düşük">Düşük</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-bold">Acenta/Firma:</span>
                  <select
                    value={selectedAgency}
                    onChange={(e) => setSelectedAgency(e.target.value)}
                    className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700 font-semibold focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="Hepsi">Tüm Acentalar</option>
                    {uniqueAgencies.map((agency) => (
                      <option key={agency} value={agency}>{agency}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-bold">Kaynak:</span>
                  <select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700 font-semibold focus:outline-none focus:border-indigo-500 transition-colors"
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
                    className="text-indigo-600 hover:text-indigo-800 font-bold underline ml-auto cursor-pointer"
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
                        ? 'border-red-100 hover:border-red-200' 
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    {/* Card Header badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
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

                      {/* Complainant Name */}
                      {comp.sikayetci_adi && (
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-bold bg-slate-50 border border-slate-200/60 px-2.5 py-0.5 rounded-lg">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{comp.sikayetci_adi}</span>
                        </div>
                      )}
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

      {/* Footer */}
      <footer className="border-t border-slate-100 py-6 mt-auto bg-white text-center text-xs text-slate-400 font-semibold">
        <p>© 2026 Balkan Tours AI Complaint Tracking System. Tüm Hakları Saklıdır.</p>
      </footer>
    </div>
  );
}
