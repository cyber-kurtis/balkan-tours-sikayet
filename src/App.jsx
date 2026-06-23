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
  HelpCircle
} from 'lucide-react';

// Default mock complaints database for instant interactive trial
const INITIAL_DEMO_DATA = [
  {
    id: 1,
    sikayet_id: "sikayetvar-001",
    tarih: new Date().toISOString(),
    kaynak_site: "Sikayetvar",
    baslik: "Otobüsün bozulması ve 6 saat sınırda bekletilme",
    icerik: "Büyük Balkan Turu kapsamında otobüslü seyahat ettik. Ancak otobüs daha Belgrad yakınlarında arıza yaptı. Klima çalışmadan 40 derece sıcakta saatlerce bekledik. Ayrıca sınır kapılarında (Kotor ve Budva geçişlerinde) organizasyon hatasından dolayı 6 saat bekletildik. Ulaşım yönetimi sıfır.",
    anahtar_kelime: "Balkan Turu, Belgrad, Kotor, Budva, Ulaşım",
    ai_kategori: "Ulaşım",
    ai_duygu_skoru: "Kritik",
    durum: "Aktif"
  },
  {
    id: 2,
    sikayet_id: "sikayetvar-002",
    tarih: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    kaynak_site: "Sikayetvar",
    baslik: "Üsküp ve Ohrid rehberinin ilgisiz tavırları",
    icerik: "Üsküp ve Ohrid turlarımıza rehberlik eden kişi son derece kaba ve ilgisizdi. Şehir tarihi hakkında iki cümle edip bizi alışveriş yapmamız için anlaşmalı dükkanlara bıraktı. Tetovo (Kalkandelen) gezisini ise tamamen iptal etti, program kayması yaşandı.",
    anahtar_kelime: "Üsküp, Ohrid, Tetovo, Balkan Rehberi",
    ai_kategori: "Rehber",
    ai_duygu_skoru: "Orta",
    durum: "Aktif"
  },
  {
    id: 3,
    sikayet_id: "sikayetvar-003",
    tarih: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    kaynak_site: "Şikayetim Var",
    baslik: "Mostar ve Blagaj'da Otel Pisliği",
    icerik: "Mostar Köprüsü gezisinden sonra yerleştiğimiz otel tam bir felaketti. Saraybosna yakınlarında olduğu söylenen otel pislik içindeydi. Çarşaflar değiştirilmemişti, oda kokuyordu. Blagaj gezimizi de yorgunluktan yapamadık.",
    anahtar_kelime: "Mostar, Saraybosna, Blagaj, Otel",
    ai_kategori: "Otel",
    ai_duygu_skoru: "Kritik",
    durum: "Aktif"
  },
  {
    id: 4,
    sikayet_id: "sikayetvar-004",
    tarih: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    kaynak_site: "Google",
    baslik: "Novi Sad programında saat kayması",
    icerik: "Sırbistan Novi Sad ve Niş gezilerimizin süreleri çok kısa tutuldu. Ulaşım planlaması yanlış yapıldığı için program kayması oldu ve kale ziyaretini karanlıkta yapmak zorunda kaldık.",
    anahtar_kelime: "Novi Sad, Nis, Program Kayması",
    ai_kategori: "Program Kayması",
    ai_duygu_skoru: "Orta",
    durum: "Aktif"
  },
  {
    id: 5,
    sikayet_id: "forum-012",
    tarih: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    kaynak_site: "Tatil Forumu",
    baslik: "Tiran otelinde akşam yemeği verilmemesi",
    icerik: "Arnavutluk Tiran'daki otelde akşam yemeği tura dahil olmasına rağmen verilmedi. Durumu sorduğumuzda ise rehber geç kaldığımızı söyledi. Durres ve Elbasan gezileri de aceleye getirildi.",
    anahtar_kelime: "Tiran, Durres, Elbasan, Otel",
    ai_kategori: "Otel",
    ai_duygu_skoru: "Kritik",
    durum: "Arşiv" // Archived because it is > 10 days old
  },
  {
    id: 6,
    sikayet_id: "google-099",
    tarih: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    kaynak_site: "Google Reviews",
    baslik: "Prizren gezisinde kaybolan eşyalar",
    icerik: "Kosova Prizren ve Priştine turunda bagajımız otobüsten indirilirken zarar gördü. Firma hasarı karşılamadı.",
    anahtar_kelime: "Prizren, Prishtina, Ulaşım",
    ai_kategori: "Ulaşım",
    ai_duygu_skoru: "Düşük",
    durum: "Arşiv" // Archived because it is > 10 days old
  },
  {
    id: 7,
    sikayet_id: "sikayetvar-007",
    tarih: new Date().toISOString(),
    kaynak_site: "Sikayetvar",
    baslik: "Firma çok ilgisizdi",
    icerik: "Balkan turları satan bu acenteden bir daha asla bilet almam. Müşteri temsilcisi telefonlarımızı açmadı.",
    anahtar_kelime: "Balkan Turu, Alakasız",
    ai_kategori: "Alakasız",
    ai_duygu_skoru: "Düşük",
    durum: "Aktif"
  }
];

export default function App() {
  // Try to load initial config from LocalStorage or env
  const [supabaseUrl, setSupabaseUrl] = useState(() => localStorage.getItem('SB_URL') || import.meta.env.VITE_SUPABASE_URL || '');
  const [supabaseKey, setSupabaseKey] = useState(() => localStorage.getItem('SB_KEY') || import.meta.env.VITE_SUPABASE_ANON_KEY || '');
  const [webhookUrl, setWebhookUrl] = useState(() => localStorage.getItem('WEBHOOK_URL') || import.meta.env.VITE_WEBHOOK_URL || '/.netlify/functions/scrape-webhook');
  
  const [showConfig, setShowConfig] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('Aktif'); // 'Aktif' = Son 10 Gün, 'Arşiv' = Arşiv Dosyası
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Hepsi');
  const [selectedSentiment, setSelectedSentiment] = useState('Hepsi');
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);

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
        setErrorStatus(null);
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
    fetchData();
  }, [supabase]);

  // Real-time listener registration
  useEffect(() => {
    if (!supabase) {
      setRealtimeConnected(false);
      return;
    }

    console.log("Setting up Supabase Realtime...");
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'balkan_sikayetleri' },
        (payload) => {
          console.log('Realtime DB Change detected:', payload);
          fetchData();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeConnected(true);
        } else {
          setRealtimeConnected(false);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

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
        console.log(`Triggering webhook: ${webhookUrl}`);
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`Webhook responded with status ${response.status}`);
        }
        
        console.log("Webhook triggered. Reloading data in 5 seconds...");
      } catch (err) {
        console.error("Webhook trigger failed:", err.message);
        setErrorStatus(`Yenileme isteği başarısız oldu: ${err.message}. Simüle edilmiş yenileme yapılıyor.`);
        
        // Simulating mock addition on failure
        setTimeout(() => {
          simulateNewScrapedData();
        }, 1500);
      }
    } else {
      console.log("Simulating scrape webhook in Demo Mode...");
      setTimeout(() => {
        simulateNewScrapedData();
      }, 1500);
    }

    // Cooldown logic: re-fetch from database after 5 seconds as specified
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
        baslik: "Üsküp ve Saraybosna otobüs kliması bozuk",
        icerik: "Balkan turumuz sırasında otobüsteki klimalar bozuldu. Rehbere söylediğimizde yapacak bir şey yok dedi. Saraybosna'ya kadar sıcaktan bunaldık.",
        anahtar_kelime: "Balkan Turu, Üsküp, Saraybosna, Ulaşım",
        ai_kategori: "Ulaşım",
        ai_duygu_skoru: "Kritik",
        durum: "Aktif"
      },
      {
        id: Date.now() + 1,
        sikayet_id: `mock-${Date.now() + 1}`,
        tarih: new Date().toISOString(),
        kaynak_site: "Ekşi Sözlük",
        baslik: "Balkan tur rehberi rezaleti",
        icerik: "Tiran ve Prizren rehberinin yetersizliği yüzünden tüm günümüz boşa gitti. Sürekli yanlış yollara girdi ve otel konaklamasında oda kartlarımızı kaybetti.",
        anahtar_kelime: "Tiran, Prizren, Balkan Rehberi",
        ai_kategori: "Rehber",
        ai_duygu_skoru: "Orta",
        durum: "Aktif"
      }
    ];

    setComplaints(prev => {
      // Filter out duplicates
      const filteredPrev = prev.filter(p => !randomComplaints.some(r => r.sikayet_id === p.sikayet_id));
      return [...randomComplaints, ...filteredPrev];
    });
  };

  // Filter complaints based on Tab, Search, Category and Sentiment
  const filteredComplaints = useMemo(() => {
    return complaints.filter(comp => {
      // 1. Tab Status Check
      if (comp.durum !== activeTab) return false;

      // 2. Category Filter
      if (selectedCategory !== 'Hepsi' && comp.ai_kategori !== selectedCategory) return false;

      // 3. Sentiment Filter
      if (selectedSentiment !== 'Hepsi' && comp.ai_duygu_skoru !== selectedSentiment) return false;

      // 4. Search Query Check
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = comp.baslik.toLowerCase().includes(query);
        const matchesContent = comp.icerik.toLowerCase().includes(query);
        const matchesKeywords = comp.anahtar_kelime?.toLowerCase().includes(query);
        return matchesTitle || matchesContent || matchesKeywords;
      }

      return true;
    });
  }, [complaints, activeTab, selectedCategory, selectedSentiment, searchQuery]);

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

  // Donut Chart Config (ApexCharts)
  const chartData = useMemo(() => {
    const categories = ['Ulaşım', 'Rehber', 'Otel', 'Program Kayması', 'Alakasız'];
    const activeItems = complaints.filter(c => c.durum === activeTab);
    
    const series = categories.map(cat => {
      return activeItems.filter(c => c.ai_kategori === cat).length;
    });

    // Check if we have any data to show
    const totalDataPoints = series.reduce((a, b) => a + b, 0);

    const options = {
      chart: {
        type: 'donut',
        background: 'transparent',
        foreColor: '#a1a1aa'
      },
      labels: categories,
      colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#6b7280'], // Blue, Purple, Green, Amber, Gray
      stroke: {
        show: true,
        colors: ['#18181b'], // darkCard color
        width: 2
      },
      legend: {
        position: 'bottom',
        fontSize: '13px',
        fontFamily: 'Outfit, sans-serif',
        labels: {
          colors: '#d4d4d8'
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
        },
        dropShadow: {
          enabled: false
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            background: 'transparent',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '14px',
                fontFamily: 'Outfit, sans-serif',
                color: '#71717a',
                offsetY: -5
              },
              value: {
                show: true,
                fontSize: '20px',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 'bold',
                color: '#f4f4f5',
                offsetY: 5,
                formatter: function (val) {
                  return val;
                }
              },
              total: {
                show: true,
                label: 'Toplam',
                color: '#71717a',
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
        theme: 'dark',
        style: {
          fontSize: '12px',
          fontFamily: 'Outfit, sans-serif'
        }
      }
    };

    return { series, options, hasData: totalDataPoints > 0 };
  }, [complaints, activeTab]);

  return (
    <div className="min-h-screen bg-darkBg text-zinc-100 flex flex-col antialiased">
      {/* Top Header */}
      <header className="border-b border-darkBorder bg-darkBg/60 backdrop-blur sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight font-sans flex items-center gap-2">
                BALKAN TOURS <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-normal">İş Zekası</span>
              </h1>
              <p className="text-xs text-darkMuted">AI-Destekli Şikayet Analizi ve Sınıflandırma Paneli</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Realtime Status indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-darkCard border border-darkBorder text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${realtimeConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span className="text-zinc-300 font-medium">
                {realtimeConnected ? 'Canlı Akış Aktif' : 'Demo / Manuel Bağlantı'}
              </span>
            </div>

            {/* Refresh button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-sm shadow-md transition-all duration-200 ${refreshing ? 'opacity-80 cursor-not-allowed' : 'active:scale-95'}`}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Taranıyor (5sn)...' : '🔄 Şimdi Yenile'}
            </button>

            {/* Settings button */}
            <button
              onClick={() => setShowConfig(true)}
              className="p-2 rounded-xl bg-darkCard border border-darkBorder hover:bg-accent text-zinc-300 hover:text-white transition-all"
              title="Bağlantı Ayarları"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 flex flex-col gap-6">
        
        {/* Error / Fallback Banner */}
        {errorStatus && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="flex-1 font-medium">{errorStatus}</p>
            <button 
              onClick={() => setErrorStatus(null)} 
              className="text-amber-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {!supabaseUrl && !supabaseKey && (
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-semibold text-zinc-200">Demo Modu Aktif</p>
                <p className="text-xs text-blue-400">Canlı verileri Supabase'e yazmak ve gerçek zamanlı güncellemeleri görmek için bağlantı ayarlarını yapın.</p>
              </div>
            </div>
            <button
              onClick={() => setShowConfig(true)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 transition-colors"
            >
              Supabase Bağlantısı Kur
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-darkCard border border-darkBorder flex items-center justify-between glow-card transition-all">
            <div>
              <p className="text-xs font-semibold text-darkMuted tracking-wider uppercase">Toplam Şikayet</p>
              <h3 className="text-3xl font-extrabold mt-1 font-sans">{stats.total}</h3>
              <p className="text-[11px] text-darkMuted mt-1">{activeTab} sekmesindeki şikayetler</p>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-800 text-zinc-300">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-darkCard border border-darkBorder flex items-center justify-between glow-card transition-all">
            <div>
              <p className="text-xs font-semibold text-darkMuted tracking-wider uppercase">Kritik Seviye</p>
              <h3 className="text-3xl font-extrabold mt-1 font-sans text-red-500">{stats.critical}</h3>
              <p className="text-[11px] text-red-400/70 mt-1">Acil aksiyon gerektiren durumlar</p>
            </div>
            <div className="p-3.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-darkCard border border-darkBorder flex items-center justify-between glow-card transition-all">
            <div>
              <p className="text-xs font-semibold text-darkMuted tracking-wider uppercase">En Yoğun Kategori</p>
              <h3 className="text-lg font-bold mt-2 font-sans truncate text-blue-400">{stats.topCategory}</h3>
              <p className="text-[11px] text-darkMuted mt-1">En çok şikayet alan başlık</p>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-darkCard border border-darkBorder flex items-center justify-between glow-card transition-all">
            <div>
              <p className="text-xs font-semibold text-darkMuted tracking-wider uppercase">En Çok Geçen Lokasyon</p>
              <h3 className="text-lg font-bold mt-2 font-sans truncate text-emerald-400">{stats.topDestination}</h3>
              <p className="text-[11px] text-darkMuted mt-1">Şikayetlerde en sık adı geçen bölge</p>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
        </section>

        {/* Dashboard Content split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column: Complaints Feed */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            
            {/* Filter controls panel */}
            <div className="p-4 rounded-2xl bg-darkCard border border-darkBorder flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                {/* Tab Switcher */}
                <div className="flex bg-darkBg p-1 rounded-xl border border-darkBorder">
                  <button
                    onClick={() => { setActiveTab('Aktif'); setSelectedCategory('Hepsi'); setSelectedSentiment('Hepsi'); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'Aktif' ? 'bg-accent text-white shadow' : 'text-darkMuted hover:text-zinc-300'}`}
                  >
                    <Inbox className="w-4 h-4" />
                    Son 10 Gün (Aktif)
                  </button>
                  <button
                    onClick={() => { setActiveTab('Arşiv'); setSelectedCategory('Hepsi'); setSelectedSentiment('Hepsi'); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'Arşiv' ? 'bg-accent text-white shadow' : 'text-darkMuted hover:text-zinc-300'}`}
                  >
                    <Archive className="w-4 h-4" />
                    Arşiv Dosyası
                  </button>
                </div>

                {/* Quick Search */}
                <div className="relative w-full sm:w-64">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-darkMuted" />
                  </span>
                  <input
                    type="text"
                    placeholder="Şikayetlerde veya yerlerde ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-darkBg border border-darkBorder rounded-xl text-sm focus:outline-none focus:border-zinc-600 transition-colors"
                  />
                </div>
              </div>

              {/* Categorical filters */}
              <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-darkBorder/40">
                <div className="flex items-center gap-2">
                  <span className="text-darkMuted font-medium">Kategori:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-darkBg border border-darkBorder px-2.5 py-1 rounded-lg text-zinc-300 focus:outline-none focus:border-zinc-700"
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
                  <span className="text-darkMuted font-medium">Duygu Skoru:</span>
                  <select
                    value={selectedSentiment}
                    onChange={(e) => setSelectedSentiment(e.target.value)}
                    className="bg-darkBg border border-darkBorder px-2.5 py-1 rounded-lg text-zinc-300 focus:outline-none focus:border-zinc-700"
                  >
                    <option value="Hepsi">Tüm Seviyeler</option>
                    <option value="Kritik">Kritik</option>
                    <option value="Orta">Orta</option>
                    <option value="Düşük">Düşük</option>
                  </select>
                </div>

                {(selectedCategory !== 'Hepsi' || selectedSentiment !== 'Hepsi' || searchQuery !== '') && (
                  <button
                    onClick={() => { setSelectedCategory('Hepsi'); setSelectedSentiment('Hepsi'); setSearchQuery(''); }}
                    className="text-blue-400 hover:text-blue-300 underline ml-auto cursor-pointer"
                  >
                    Filtreleri Temizle
                  </button>
                )}
              </div>
            </div>

            {/* Complaints list */}
            <div className="flex flex-col gap-4 max-h-[700px] overflow-y-auto pr-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 bg-darkCard border border-darkBorder rounded-2xl">
                  <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                  <p className="text-sm text-darkMuted mt-4">Veriler yükleniyor...</p>
                </div>
              ) : filteredComplaints.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-darkCard border border-darkBorder rounded-2xl text-center px-6">
                  <AlertCircle className="w-10 h-10 text-darkMuted mb-3" />
                  <h4 className="text-zinc-300 font-bold">Herhangi bir şikayet kaydı bulunamadı</h4>
                  <p className="text-xs text-darkMuted max-w-sm mt-1">Seçilen kriterlere veya arama sorgusuna uygun kayıt bulunmamaktadır.</p>
                </div>
              ) : (
                filteredComplaints.map((comp) => (
                  <div 
                    key={comp.id || comp.sikayet_id}
                    className={`p-5 rounded-2xl bg-darkCard border transition-all duration-200 hover:-translate-y-[2px] ${
                      comp.ai_duygu_skoru === 'Kritik' 
                        ? 'border-red-950/50 hover:border-red-900/60 shadow-lg shadow-red-950/5' 
                        : 'border-darkBorder hover:border-zinc-800'
                    }`}
                  >
                    {/* Card Header badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* AI Category Badge */}
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold tracking-wide ${
                          comp.ai_kategori === 'Ulaşım' ? 'bg-blue-900/30 text-blue-300 border border-blue-800/30' :
                          comp.ai_kategori === 'Rehber' ? 'bg-purple-900/30 text-purple-300 border border-purple-800/30' :
                          comp.ai_kategori === 'Otel' ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-800/30' :
                          comp.ai_kategori === 'Program Kayması' ? 'bg-amber-900/30 text-amber-300 border border-amber-800/30' :
                          'bg-zinc-850 text-zinc-400 border border-zinc-700/30'
                        }`}>
                          {comp.ai_kategori}
                        </span>

                        {/* AI Sentiment Badge */}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          comp.ai_duygu_skoru === 'Kritik' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                          comp.ai_duygu_skoru === 'Orta' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {comp.ai_duygu_skoru}
                        </span>

                        {/* Source Badge */}
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-800 text-zinc-400 border border-darkBorder font-medium">
                          {comp.kaynak_site}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-1.5 text-xs text-darkMuted">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(comp.tarih).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <h4 className="text-base font-bold text-zinc-100 hover:text-white leading-snug mb-2">
                      {comp.baslik}
                    </h4>
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line mb-4">
                      {comp.icerik}
                    </p>

                    {/* Keywords Matrix matches (Tag Cloud inside card) */}
                    {comp.anahtar_kelime && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-darkBorder/40">
                        <MapPin className="w-3.5 h-3.5 text-darkMuted" />
                        <span className="text-[11px] text-darkMuted font-medium mr-1">Konum Eşleşmeleri:</span>
                        {comp.anahtar_kelime.split(',').map((kw, i) => (
                          <span 
                            key={i} 
                            className="px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-800 text-[10px] text-zinc-400 border border-darkBorder transition-colors"
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
          <div className="flex flex-col gap-6 sticky top-24">
            
            {/* Donut Chart Panel */}
            <div className="p-5 rounded-2xl bg-darkCard border border-darkBorder flex flex-col gap-4">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  Kategori Dağılımı ({activeTab})
                </h3>
                <p className="text-xs text-darkMuted">Kategorilere göre yapay zeka analiz dağılımı</p>
              </div>

              <div className="py-4 flex justify-center">
                {chartData.hasData ? (
                  <div className="w-full">
                    <ReactApexChart 
                      options={chartData.options} 
                      series={chartData.series} 
                      type="donut" 
                      height={280} 
                    />
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-darkMuted">
                    Analiz edecek veri bulunmamaktadır.
                  </div>
                )}
              </div>
            </div>

            {/* Keyword Matrix Reference */}
            <div className="p-5 rounded-2xl bg-darkCard border border-darkBorder flex flex-col gap-3">
              <h4 className="text-sm font-bold text-zinc-200">Balkan Konum Matrix Haritası</h4>
              <p className="text-xs text-darkMuted leading-relaxed">
                Sistem aşağıdaki balkan konumlarını şikayet metninde otomatik olarak tarar:
              </p>
              <div className="flex flex-col gap-2 mt-1">
                <div className="flex justify-between text-xs border-b border-darkBorder/40 pb-1">
                  <span className="text-zinc-400">K. Makedonya</span>
                  <span className="text-indigo-400 font-medium">Üsküp, Ohrid, Tetovo, Matka</span>
                </div>
                <div className="flex justify-between text-xs border-b border-darkBorder/40 pb-1">
                  <span className="text-zinc-400">Bosna Hersek</span>
                  <span className="text-indigo-400 font-medium">Saraybosna, Mostar, Blagaj, Konjic</span>
                </div>
                <div className="flex justify-between text-xs border-b border-darkBorder/40 pb-1">
                  <span className="text-zinc-400">Sırbistan</span>
                  <span className="text-indigo-400 font-medium">Belgrad, Novi Sad, Niş</span>
                </div>
                <div className="flex justify-between text-xs border-b border-darkBorder/40 pb-1">
                  <span className="text-zinc-400">Karadağ</span>
                  <span className="text-indigo-400 font-medium">Kotor, Budva, Podgorica, Tivat</span>
                </div>
                <div className="flex justify-between text-xs border-b border-darkBorder/40 pb-1">
                  <span className="text-zinc-400">Arnavutluk</span>
                  <span className="text-indigo-400 font-medium">Tiran, Durres, Elbasan, İşkodra</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Kosova</span>
                  <span className="text-indigo-400 font-medium">Prizren, Priştine, Pey</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Configuration modal */}
      {showConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-darkCard border border-darkBorder rounded-2xl shadow-2xl p-6 relative">
            <button 
              onClick={() => setShowConfig(false)}
              className="absolute top-4 right-4 text-darkMuted hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-bold text-zinc-100">Bağlantı Ayarları</h3>
            </div>

            <p className="text-xs text-darkMuted leading-relaxed mb-4">
              Verileri Supabase veritabanınıza yazmak ve web scraping tetiklemek için bilgilerinizi girin. Bu bilgiler tarayıcınızın yerel hafızasında (LocalStorage) saklanır.
            </p>

            <form onSubmit={handleSaveConfig} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">Supabase URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://xxxxxx.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-darkBg border border-darkBorder rounded-xl text-sm focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">Supabase Anon Key</label>
                <input
                  type="password"
                  required
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full px-3 py-2 bg-darkBg border border-darkBorder rounded-xl text-sm focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">Scrape Webhook URL</label>
                <input
                  type="text"
                  required
                  placeholder="/.netlify/functions/scrape-webhook"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-darkBg border border-darkBorder rounded-xl text-sm focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={handleResetConfig}
                  className="flex-1 px-4 py-2 border border-darkBorder text-zinc-400 hover:text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all active:scale-95"
                >
                  Demo Moduna Dön
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/10 transition-all active:scale-95"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-darkBorder py-6 mt-auto bg-darkBg/30 text-center text-xs text-darkMuted">
        <p>© 2026 Balkan Tours AI Complaint Tracking System. Tüm Hakları Saklıdır.</p>
      </footer>
    </div>
  );
}
