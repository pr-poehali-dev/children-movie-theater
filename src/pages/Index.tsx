import { useState, useEffect, useRef } from "react";
import Hls from "hls.js";
import Icon from "@/components/ui/icon";

const CHANNELS = [
  { id: 1,  name: "Первый канал", emoji: "1️⃣", color: "#e63946", desc: "Главный канал страны",           stream: "https://stream01.1tv.ru/live/hls/playlist.m3u8" },
  { id: 2,  name: "Россия-1",     emoji: "🇷🇺", color: "#457b9d", desc: "Россия для всей семьи",          stream: "https://player.smotrim.ru/api/m3u8/4/index.m3u8" },
  { id: 3,  name: "Матч! ТВ",    emoji: "⚽",  color: "#f4a261", desc: "Спорт и соревнования",           stream: "https://live.matchtv.ru/hls/matchtv.m3u8" },
  { id: 4,  name: "НТВ",         emoji: "📺",  color: "#2a9d8f", desc: "Новости и кино",                 stream: "https://ntv-vh.cdnvideo.ru/ntv/ntv.m3u8" },
  { id: 5,  name: "5 канал",     emoji: "5️⃣", color: "#6a4c93", desc: "Петербург — 5 канал",            stream: "https://5tv.gstream.ru/5tv/5tv.m3u8" },
  { id: 6,  name: "Россия К",    emoji: "🎭",  color: "#e76f51", desc: "Культура и искусство",           stream: "https://player.smotrim.ru/api/m3u8/19/index.m3u8" },
  { id: 7,  name: "Россия 24",   emoji: "📰",  color: "#264653", desc: "Новости круглосуточно",          stream: "https://player.smotrim.ru/api/m3u8/3/index.m3u8" },
  { id: 8,  name: "Карусель",    emoji: "🎠",  color: "#e9c46a", desc: "Детско-юношеский канал",         stream: "https://karusel-vh.cdnvideo.ru/karusel/karusel.m3u8" },
  { id: 9,  name: "ОТР",         emoji: "🏛️", color: "#52b788", desc: "Общественное телевидение",       stream: "https://otr-live.cdnvideo.ru/otr/otr.m3u8" },
  { id: 10, name: "ТВ Центр",    emoji: "🏙️", color: "#c77dff", desc: "Телевидение Москвы",             stream: "https://tvc-vh.cdnvideo.ru/tvc/tvc.m3u8" },
  { id: 11, name: "РЕН ТВ",      emoji: "🔥",  color: "#ff6b6b", desc: "Острые темы и расследования",    stream: "https://ren-vh.cdnvideo.ru/ren/ren.m3u8" },
  { id: 12, name: "СПАС",        emoji: "✝️",  color: "#4895ef", desc: "Православное телевидение",       stream: "https://spas-vh.cdnvideo.ru/spas/spas.m3u8" },
  { id: 13, name: "СТС",         emoji: "😄",  color: "#f72585", desc: "Комедии и развлечения",          stream: "https://cts-vh.cdnvideo.ru/cts/cts.m3u8" },
  { id: 14, name: "Домашний",    emoji: "🏠",  color: "#fb8500", desc: "Кино и сериалы",                 stream: "https://dom-vh.cdnvideo.ru/dom/dom.m3u8" },
  { id: 15, name: "ТВ3",         emoji: "🌟",  color: "#7209b7", desc: "Мистика и фантастика",           stream: "https://tv3-vh.cdnvideo.ru/tv3/tv3.m3u8" },
  { id: 16, name: "Пятница!",    emoji: "🎉",  color: "#06d6a0", desc: "Развлечения и лайфстайл",        stream: "https://fri-vh.cdnvideo.ru/fri/fri.m3u8" },
  { id: 17, name: "Звезда",      emoji: "⭐",  color: "#118ab2", desc: "Армия и патриотизм",             stream: "https://zvezda-vh.cdnvideo.ru/zvezda/zvezda.m3u8" },
  { id: 18, name: "МИР",         emoji: "🌍",  color: "#43aa8b", desc: "Международное вещание",          stream: "https://mir-vh.cdnvideo.ru/mir/mir.m3u8" },
  { id: 19, name: "ТНТ",         emoji: "💥",  color: "#ef233c", desc: "Юмор и развлечения",             stream: "https://tnt-vh.cdnvideo.ru/tnt/tnt.m3u8" },
  { id: 20, name: "Муз-ТВ",      emoji: "🎵",  color: "#9b5de5", desc: "Музыка и клипы",                 stream: "https://muz-vh.cdnvideo.ru/muz/muz.m3u8" },
];

const SERIES = [
  {
    id: 1,
    title: "Геройчики",
    rating: "0+",
    episodes: 26,
    img: "https://cdn.poehali.dev/projects/64ccfbec-be30-4ba6-8097-e151c0677ebd/files/4453638c-9502-4d41-b5c1-c3db587a701e.jpg",
    color: "#ff6b6b",
    desc: "История разворачивается вокруг мальчика Ромы, который обожает игры. Его комната — целая вселенная, наполненная разными игрушками: от плюшевых мишек до высокотехнологичных роботов-супергероев. Каждый день Рома придумывает для игрушек захватывающие приключения. Когда он уходит в школу, его ожившая команда не скучает — они устраивают гонки, весёлые вечеринки. Но самое важное начинается, когда с самим Ромой случается неприятность. В такие моменты игрушки забывают о развлечениях и пускают в ход все свои таланты. Работая вместе, они решают самые неожиданные задачи, чтобы помочь своему лучшему другу. Геройчики иногда спорят и ищут ответы на сложные вопросы, но всегда приходят к одному выводу: сила — в их дружбе и готовности быть рядом.",
    tags: ["дружба", "приключения", "игрушки"],
  },
  {
    id: 2,
    title: "Ум и Хрум",
    rating: "0+",
    episodes: 20,
    img: "https://cdn.poehali.dev/projects/64ccfbec-be30-4ba6-8097-e151c0677ebd/files/7675f14c-4e05-48d8-9e0c-596565b2b25e.jpg",
    color: "#ffd43b",
    desc: "Весёлые и познавательные приключения двух закадычных друзей — умного и забавного Хрума. Вместе они решают головоломки, узнают секреты окружающего мира и доказывают, что даже самые трудные задачи можно преодолеть с помощью смекалки и доброго сердца.",
    tags: ["юмор", "обучение", "смекалка"],
  },
];

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const SCHEDULE: Record<string, Array<{ time: string; show: string; channel: string; emoji: string }>> = {
  "Пн": [
    { time: "07:00", show: "Доброе утро", channel: "Первый канал", emoji: "☀️" },
    { time: "08:30", show: "Мультфильмы", channel: "Карусель", emoji: "🎠" },
    { time: "10:00", show: "Вести", channel: "Россия-1", emoji: "📰" },
    { time: "12:00", show: "Футбол. Лига чемпионов", channel: "Матч! ТВ", emoji: "⚽" },
    { time: "14:00", show: "Геройчики", channel: "Карусель", emoji: "🦸" },
    { time: "15:30", show: "Ум и Хрум", channel: "Карусель", emoji: "🧠" },
    { time: "17:00", show: "Новости", channel: "НТВ", emoji: "📺" },
    { time: "19:00", show: "Пусть говорят", channel: "Первый канал", emoji: "🎙️" },
    { time: "21:00", show: "Вечер с Соловьёвым", channel: "Россия-1", emoji: "🌙" },
  ],
  "Вт": [
    { time: "07:00", show: "Утро России", channel: "Россия-1", emoji: "☀️" },
    { time: "09:00", show: "Детские мультфильмы", channel: "Карусель", emoji: "🎠" },
    { time: "11:00", show: "Спортивные новости", channel: "Матч! ТВ", emoji: "🏆" },
    { time: "14:00", show: "Геройчики", channel: "Карусель", emoji: "🦸" },
    { time: "15:30", show: "Ум и Хрум", channel: "Карусель", emoji: "🧠" },
    { time: "18:00", show: "Сегодня", channel: "НТВ", emoji: "📰" },
    { time: "20:00", show: "Кинопремьера", channel: "СТС", emoji: "🎬" },
    { time: "22:00", show: "Поздние новости", channel: "Первый канал", emoji: "🌙" },
  ],
  "Ср": [
    { time: "07:00", show: "Доброе утро", channel: "Первый канал", emoji: "☀️" },
    { time: "08:30", show: "Мультфильмы", channel: "Карусель", emoji: "🎠" },
    { time: "10:30", show: "Новости культуры", channel: "Россия К", emoji: "🎭" },
    { time: "13:00", show: "Хоккей. КХЛ", channel: "Матч! ТВ", emoji: "🏒" },
    { time: "15:00", show: "Геройчики", channel: "Карусель", emoji: "🦸" },
    { time: "16:30", show: "Ум и Хрум", channel: "Карусель", emoji: "🧠" },
    { time: "19:00", show: "Россия 24 — Вечер", channel: "Россия 24", emoji: "📰" },
    { time: "21:00", show: "Телепремьера", channel: "ТВ3", emoji: "🌟" },
  ],
  "Чт": [
    { time: "07:30", show: "Утренние новости", channel: "НТВ", emoji: "☀️" },
    { time: "09:00", show: "Детский час", channel: "Карусель", emoji: "🎠" },
    { time: "12:00", show: "Баскетбол. Суперлига", channel: "Матч! ТВ", emoji: "🏀" },
    { time: "14:00", show: "Геройчики", channel: "Карусель", emoji: "🦸" },
    { time: "15:30", show: "Ум и Хрум", channel: "Карусель", emoji: "🧠" },
    { time: "17:30", show: "5 Студия", channel: "5 канал", emoji: "📺" },
    { time: "20:00", show: "Пятница! Кино", channel: "Пятница!", emoji: "🎉" },
    { time: "22:00", show: "Ночные новости", channel: "Россия 24", emoji: "🌙" },
  ],
  "Пт": [
    { time: "07:00", show: "Доброе утро", channel: "Первый канал", emoji: "☀️" },
    { time: "09:00", show: "Мультфильмы", channel: "Карусель", emoji: "🎠" },
    { time: "11:00", show: "Формула-1. Гонка", channel: "Матч! ТВ", emoji: "🏎️" },
    { time: "14:00", show: "Геройчики", channel: "Карусель", emoji: "🦸" },
    { time: "15:30", show: "Ум и Хрум", channel: "Карусель", emoji: "🧠" },
    { time: "18:00", show: "Вечер пятницы", channel: "Пятница!", emoji: "🎉" },
    { time: "20:00", show: "Муз-ТВ Чарт", channel: "Муз-ТВ", emoji: "🎵" },
    { time: "22:00", show: "ТНТ-Comedy", channel: "ТНТ", emoji: "😂" },
  ],
  "Сб": [
    { time: "08:00", show: "Субботнее утро", channel: "Первый канал", emoji: "☀️" },
    { time: "09:00", show: "Детский Марафон", channel: "Карусель", emoji: "🎠" },
    { time: "11:00", show: "Геройчики", channel: "Карусель", emoji: "🦸" },
    { time: "12:30", show: "Ум и Хрум", channel: "Карусель", emoji: "🧠" },
    { time: "14:00", show: "Футбол. РПЛ", channel: "Матч! ТВ", emoji: "⚽" },
    { time: "16:00", show: "Субботний вечер", channel: "Россия-1", emoji: "🎭" },
    { time: "19:00", show: "Лучшие хиты", channel: "Муз-ТВ", emoji: "🎵" },
    { time: "21:00", show: "Суббота со звёздами", channel: "ТНТ", emoji: "⭐" },
  ],
  "Вс": [
    { time: "08:00", show: "Воскресное утро", channel: "Россия-1", emoji: "☀️" },
    { time: "09:30", show: "Детские фильмы", channel: "Карусель", emoji: "🎠" },
    { time: "11:00", show: "Геройчики", channel: "Карусель", emoji: "🦸" },
    { time: "12:30", show: "Ум и Хрум", channel: "Карусель", emoji: "🧠" },
    { time: "14:00", show: "Воскресный спорт", channel: "Матч! ТВ", emoji: "🏆" },
    { time: "16:30", show: "Культурная программа", channel: "Россия К", emoji: "🎭" },
    { time: "18:00", show: "Вечер на МИР", channel: "МИР", emoji: "🌍" },
    { time: "21:00", show: "Итоговая программа", channel: "Первый канал", emoji: "📰" },
  ],
};

type Tab = "home" | "channels" | "series" | "schedule";

type Channel = typeof CHANNELS[0];

function HlsPlayer({ src, color }: { src: string; color: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"loading" | "playing" | "error">("loading");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setStatus("loading");

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
        setStatus("playing");
      });
      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (data.fatal) setStatus("error");
      });
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {});
        setStatus("playing");
      });
      video.addEventListener("error", () => setStatus("error"));
    } else {
      setStatus("error");
    }
  }, [src]);

  return (
    <div className="relative bg-black" style={{ aspectRatio: "16/9" }}>
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        autoPlay
        playsInline
        style={{ display: status === "error" ? "none" : "block" }}
      />
      {status === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div
            className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: `${color} ${color} ${color} transparent` }}
          />
          <p className="font-nunito font-700 text-white/70 text-sm">Подключаемся к эфиру...</p>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <span className="text-5xl">📡</span>
          <p className="font-fredoka text-white text-xl">Поток недоступен</p>
          <p className="font-nunito text-white/60 text-sm">Канал временно не вещает или поток изменился</p>
        </div>
      )}
    </div>
  );
}

function PlayerModal({ channel, onClose }: { channel: Channel; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-gray-900 rounded-3xl overflow-hidden shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3" style={{ background: `linear-gradient(135deg, ${channel.color}cc, ${channel.color}66)` }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{channel.emoji}</span>
            <div>
              <p className="font-fredoka text-white text-lg leading-none">{channel.name}</p>
              <p className="font-nunito text-white/70 text-xs">{channel.desc}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white font-bold text-lg"
          >
            ✕
          </button>
        </div>

        <HlsPlayer src={channel.stream} color={channel.color} />

        <div className="px-5 py-3 bg-gray-800 flex items-center gap-2">
          <span className="text-green-400 text-sm">📡</span>
          <p className="font-nunito text-xs text-gray-400">Прямая трансляция · HLS поток</p>
          <span className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
            <span className="font-nunito font-800 text-xs text-red-400">LIVE</span>
          </span>
        </div>
      </div>
    </div>
  );
}

const FloatingShape = ({ style, children }: { style: React.CSSProperties; children: React.ReactNode }) => (
  <div className="absolute pointer-events-none select-none opacity-20 animate-float font-fredoka text-4xl" style={style}>
    {children}
  </div>
);

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [selectedDay, setSelectedDay] = useState("Пн");
  const [selectedSeries, setSelectedSeries] = useState<typeof SERIES[0] | null>(null);
  const [playerChannel, setPlayerChannel] = useState<Channel | null>(null);
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: "linear-gradient(135deg, #fff9f0 0%, #f0f9ff 50%, #f9f0ff 100%)" }}>
      {playerChannel && <PlayerModal channel={playerChannel} onClose={() => setPlayerChannel(null)} />}
      {/* Floating background shapes */}
      <FloatingShape style={{ top: "5%", left: "2%", animationDelay: "0s" }}>⭐</FloatingShape>
      <FloatingShape style={{ top: "15%", right: "3%", animationDelay: "0.5s" }}>🌈</FloatingShape>
      <FloatingShape style={{ top: "40%", left: "1%", animationDelay: "1s" }}>🎈</FloatingShape>
      <FloatingShape style={{ top: "60%", right: "2%", animationDelay: "1.5s" }}>🌟</FloatingShape>
      <FloatingShape style={{ bottom: "20%", left: "3%", animationDelay: "2s" }}>🎉</FloatingShape>
      <FloatingShape style={{ bottom: "10%", right: "4%", animationDelay: "0.8s" }}>🎠</FloatingShape>

      {/* Header */}
      <header className="relative z-10 px-4 pt-6 pb-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg animate-wiggle"
              style={{ background: "linear-gradient(135deg, #ff6b6b, #ffd43b)" }}
            >
              🎬
            </div>
            <div>
              <h1 className="font-fredoka text-2xl md:text-3xl leading-none" style={{ color: "#e63946" }}>
                КиноДетки
              </h1>
              <p className="text-xs font-nunito font-600 text-gray-500">Детский онлайн кинотеатр</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white/70 backdrop-blur rounded-2xl px-4 py-2 shadow">
            <span className="text-lg">📡</span>
            <span className="font-nunito font-700 text-sm text-gray-600">{CHANNELS.length} каналов в эфире</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="max-w-6xl mx-auto mt-4">
          <div className="flex gap-2 bg-white/60 backdrop-blur rounded-2xl p-1.5 shadow-sm w-full overflow-x-auto">
            {[
              { key: "home", label: "Главная", emoji: "🏠" },
              { key: "channels", label: "ТВ-каналы", emoji: "📺" },
              { key: "series", label: "Мультсериалы", emoji: "🎬" },
              { key: "schedule", label: "Программа", emoji: "📅" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as Tab)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-nunito font-800 text-sm whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.key
                    ? "shadow-md text-white scale-105"
                    : "text-gray-600 hover:bg-white/80"
                }`}
                style={
                  activeTab === tab.key
                    ? { background: "linear-gradient(135deg, #ff6b6b, #f72585)" }
                    : {}
                }
              >
                <span>{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-6">

        {/* HOME */}
        {activeTab === "home" && (
          <div>
            {/* Hero */}
            <div
              className="rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden shadow-xl"
              style={{ background: "linear-gradient(135deg, #ff6b6b 0%, #f72585 50%, #7209b7 100%)" }}
            >
              <div className="absolute inset-0 opacity-10">
                {["🌟", "⭐", "✨", "🎉", "🎈", "🦁", "🐱", "🐻"].map((e, i) => (
                  <span
                    key={i}
                    className="absolute text-5xl"
                    style={{
                      top: `${Math.random() * 80}%`,
                      left: `${Math.random() * 90}%`,
                      fontSize: `${2 + Math.random() * 3}rem`,
                    }}
                  >
                    {e}
                  </span>
                ))}
              </div>
              <div className="relative z-10">
                <div className="inline-block bg-white/20 backdrop-blur rounded-full px-4 py-1 mb-4">
                  <span className="text-white font-nunito font-800 text-sm">🎬 Смотри бесплатно!</span>
                </div>
                <h2 className="font-fredoka text-4xl md:text-6xl text-white mb-3 leading-tight">
                  Добро пожаловать<br />в мир кино! 🎉
                </h2>
                <p className="text-white/90 font-nunito font-600 text-lg mb-6 max-w-md">
                  {CHANNELS.length} ТВ-каналов · Мультсериалы · Программа передач
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab("channels")}
                    className="bg-white font-nunito font-800 px-6 py-3 rounded-2xl shadow-lg transition-all duration-200 hover:scale-105 text-base"
                    style={{ color: "#f72585" }}
                  >
                    📺 Смотреть каналы
                  </button>
                  <button
                    onClick={() => setActiveTab("series")}
                    className="bg-white/20 backdrop-blur text-white font-nunito font-800 px-6 py-3 rounded-2xl border-2 border-white/40 transition-all duration-200 hover:bg-white/30 text-base"
                  >
                    🦸 Мультсериалы
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { value: `${CHANNELS.length}`, label: "ТВ-каналов", emoji: "📡", color: "#ff6b6b" },
                { value: "2", label: "Мультсериала", emoji: "🎬", color: "#ffd43b" },
                { value: "7", label: "Дней программы", emoji: "📅", color: "#4dabf7" },
                { value: "0+", label: "Для малышей", emoji: "👶", color: "#69db7c" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-4 text-center shadow-md card-hover"
                  style={{ borderTop: `4px solid ${stat.color}` }}
                >
                  <div className="text-3xl mb-1">{stat.emoji}</div>
                  <div className="font-fredoka text-2xl" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="font-nunito text-xs font-600 text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Popular channels preview */}
            <h3 className="font-fredoka text-2xl text-gray-700 mb-4">🔥 Популярные каналы</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
              {CHANNELS.slice(0, 8).map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => setPlayerChannel(ch)}
                  className="bg-white rounded-2xl p-4 text-center shadow-md card-hover cursor-pointer"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-2"
                    style={{ background: `${ch.color}20` }}
                  >
                    {ch.emoji}
                  </div>
                  <p className="font-nunito font-800 text-sm text-gray-700 leading-tight">{ch.name}</p>
                </div>
              ))}
            </div>

            {/* Series preview */}
            <h3 className="font-fredoka text-2xl text-gray-700 mb-4">🌟 Мультсериалы</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SERIES.map((s) => (
                <div
                  key={s.id}
                  onClick={() => { setSelectedSeries(s); setActiveTab("series"); }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md card-hover cursor-pointer flex gap-4 p-4"
                >
                  <img src={s.img} alt={s.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-fredoka text-lg text-gray-800">{s.title}</span>
                      <span
                        className="text-xs font-800 px-2 py-0.5 rounded-full text-white"
                        style={{ background: s.color }}
                      >
                        {s.rating}
                      </span>
                    </div>
                    <p className="font-nunito text-xs text-gray-500 line-clamp-3">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CHANNELS */}
        {activeTab === "channels" && (
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl" style={{ background: "#ff6b6b20" }}>📺</div>
              <h2 className="font-fredoka text-3xl text-gray-700">Все ТВ-каналы</h2>
              <span className="bg-red-100 text-red-500 font-nunito font-800 text-sm px-3 py-1 rounded-full">{CHANNELS.length} каналов</span>
            </div>
            {/* Search */}
            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Найти канал..."
                className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl shadow-md font-nunito font-700 text-sm text-gray-700 outline-none border-2 border-transparent focus:border-pink-300 transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold text-lg"
                >✕</button>
              )}
            </div>
            {CHANNELS.filter(ch => ch.name.toLowerCase().includes(search.toLowerCase())).length === 0 && (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">🔍</div>
                <p className="font-fredoka text-xl text-gray-400">Канал не найден</p>
                <p className="font-nunito text-sm text-gray-300">Попробуй другое название</p>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {CHANNELS.filter(ch => ch.name.toLowerCase().includes(search.toLowerCase())).map((ch, i) => (
                <div
                  key={ch.id}
                  className="bg-white rounded-2xl p-5 text-center shadow-md card-hover cursor-pointer animate-pop-in group"
                  style={{ animationDelay: `${i * 0.04}s`, borderTop: `3px solid ${ch.color}` }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 transition-transform duration-200 group-hover:scale-110"
                    style={{ background: `${ch.color}15` }}
                  >
                    {ch.emoji}
                  </div>
                  <p className="font-nunito font-800 text-sm text-gray-800 leading-tight mb-1">{ch.name}</p>
                  <p className="font-nunito text-xs text-gray-400">{ch.desc}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setPlayerChannel(ch); }}
                    className="mt-3 w-full py-1.5 rounded-xl font-nunito font-800 text-xs text-white transition-all duration-200 hover:opacity-90"
                    style={{ background: `linear-gradient(135deg, ${ch.color}, ${ch.color}cc)` }}
                  >
                    ▶ Смотреть
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SERIES */}
        {activeTab === "series" && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl" style={{ background: "#f72585" + "20" }}>🎬</div>
              <h2 className="font-fredoka text-3xl text-gray-700">Мультсериалы</h2>
            </div>

            {selectedSeries ? (
              <div>
                <button
                  onClick={() => setSelectedSeries(null)}
                  className="flex items-center gap-2 font-nunito font-700 text-gray-500 hover:text-gray-700 mb-5 transition-colors"
                >
                  <Icon name="ArrowLeft" size={16} /> Назад к списку
                </button>
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
                  <div
                    className="relative h-48 md:h-64 overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${selectedSeries.color}60, ${selectedSeries.color}20)` }}
                  >
                    <img src={selectedSeries.img} alt={selectedSeries.title} className="w-full h-full object-cover opacity-40" />
                    <div className="absolute inset-0 flex items-end p-6">
                      <div>
                        <span
                          className="text-white font-800 text-sm px-3 py-1 rounded-full font-nunito mb-2 inline-block"
                          style={{ background: selectedSeries.color }}
                        >
                          {selectedSeries.rating}
                        </span>
                        <h3 className="font-fredoka text-4xl text-white drop-shadow-lg">{selectedSeries.title}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedSeries.tags.map((tag) => (
                        <span key={tag} className="bg-gray-100 font-nunito font-700 text-xs px-3 py-1 rounded-full text-gray-600">
                          #{tag}
                        </span>
                      ))}
                      <span className="bg-blue-50 font-nunito font-700 text-xs px-3 py-1 rounded-full text-blue-600">
                        {selectedSeries.episodes} серий
                      </span>
                    </div>
                    <p className="font-nunito text-gray-600 text-base leading-relaxed mb-6">{selectedSeries.desc}</p>
                    <button
                      className="font-nunito font-800 px-8 py-3 rounded-2xl text-white shadow-lg hover:opacity-90 transition-opacity text-base"
                      style={{ background: `linear-gradient(135deg, ${selectedSeries.color}, #f72585)` }}
                    >
                      ▶ Смотреть сериал
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SERIES.map((s, i) => (
                  <div
                    key={s.id}
                    className="bg-white rounded-3xl overflow-hidden shadow-lg card-hover cursor-pointer animate-pop-in"
                    style={{ animationDelay: `${i * 0.1}s` }}
                    onClick={() => setSelectedSeries(s)}
                  >
                    <div
                      className="relative h-48 overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${s.color}40, ${s.color}10)` }}
                    >
                      <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3">
                        <span
                          className="text-white font-nunito font-800 text-xs px-3 py-1 rounded-full shadow-md"
                          style={{ background: s.color }}
                        >
                          {s.rating}
                        </span>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-2xl ml-1">▶</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-fredoka text-2xl text-gray-800 mb-2">{s.title}</h3>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {s.tags.map((tag) => (
                          <span key={tag} className="bg-gray-100 font-nunito font-700 text-xs px-2 py-0.5 rounded-full text-gray-500">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <p className="font-nunito text-sm text-gray-500 line-clamp-2 mb-4">{s.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-nunito font-700 text-sm text-gray-400">{s.episodes} серий</span>
                        <button
                          className="font-nunito font-800 px-5 py-2 rounded-xl text-white text-sm shadow hover:opacity-90 transition-opacity"
                          style={{ background: `linear-gradient(135deg, ${s.color}, #f72585)` }}
                        >
                          ▶ Смотреть
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SCHEDULE */}
        {activeTab === "schedule" && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl" style={{ background: "#4dabf720" }}>📅</div>
              <h2 className="font-fredoka text-3xl text-gray-700">Программа передач</h2>
            </div>

            {/* Day selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
              {DAYS.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-2xl font-nunito font-800 text-sm transition-all duration-200 ${
                    selectedDay === day ? "text-white shadow-lg scale-105" : "bg-white text-gray-600 hover:bg-gray-50 shadow"
                  }`}
                  style={selectedDay === day ? { background: "linear-gradient(135deg, #4dabf7, #7209b7)" } : {}}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Schedule table */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <div
                className="px-6 py-4"
                style={{ background: "linear-gradient(135deg, #4dabf720, #7209b720)" }}
              >
                <h3 className="font-fredoka text-xl text-gray-700">
                  📅 Программа на {selectedDay === "Пн" ? "понедельник" : selectedDay === "Вт" ? "вторник" : selectedDay === "Ср" ? "среду" : selectedDay === "Чт" ? "четверг" : selectedDay === "Пт" ? "пятницу" : selectedDay === "Сб" ? "субботу" : "воскресенье"}
                </h3>
              </div>
              <div className="divide-y divide-gray-50">
                {SCHEDULE[selectedDay].map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${
                      (item.channel === "Карусель") ? "bg-yellow-50/50" : ""
                    }`}
                  >
                    <div className="flex-shrink-0 w-16 text-center">
                      <span
                        className="font-fredoka text-lg"
                        style={{ color: "#4dabf7" }}
                      >
                        {item.time}
                      </span>
                    </div>
                    <div className="w-8 text-xl flex-shrink-0">{item.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-nunito font-800 text-gray-800 text-sm">{item.show}</p>
                      <p className="font-nunito text-xs text-gray-400">{item.channel}</p>
                    </div>
                    {(item.show.includes("Геройчики") || item.show.includes("Ум и Хрум")) && (
                      <span className="flex-shrink-0 bg-green-100 text-green-600 font-nunito font-800 text-xs px-2 py-0.5 rounded-full">
                        0+
                      </span>
                    )}
                    <button
                      onClick={() => {
                        const ch = CHANNELS.find(c => c.name === item.channel);
                        if (ch) setPlayerChannel(ch);
                      }}
                      className="flex-shrink-0 font-nunito font-800 text-xs px-3 py-1.5 rounded-xl text-white"
                      style={{ background: "#4dabf7" }}
                    >
                      ▶
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 mt-4">
        <p className="font-nunito text-sm text-gray-400">
          🎬 КиноДетки · Детский онлайн кинотеатр · {new Date().getFullYear()}
        </p>
        <p className="font-nunito text-xs text-gray-300 mt-1">Смотри любимые каналы и мультики бесплатно!</p>
      </footer>
    </div>
  );
}