import '@/scss/main.scss';
import LanguagesSwitcher from './components/LanguagesSwitcher';
import Burger from './components/Burger';
import { updateScroller } from './components/Scroller';
import StockCard from "./components/StockCard";
import ScrollerCollection from './components/Scroller';
import TabsCollection from './components/Tabs';
import AccordionCollection from './components/Accordion';
import './components/btnToTop';
import AnimatedCounter from './components/AnimatedCounter';

const API_KEY = import.meta.env.VITE_FINNHUB_KEY;

const blocks = [
  {
    containerId: 'stock-cards',
    tickers: [
      { symbol: "WMT", name: "Walmart Inc.", logo: "/stock-card-1.svg" },
      { symbol: "AMZN", name: "Amazon", logo: "/stock-card-2.svg" },
      { symbol: "HOOD", name: "Robinhood", logo: "/stock-card-3.svg" },
      { symbol: "AAPL", name: "Apple", logo: "/stock-card-4.svg" },
      { symbol: "NVDA", name: "Nvidia", logo: "/stock-card-5.svg" },
      { symbol: "TSLA", name: "Tesla", logo: "/stock-card-6.svg" },
      { symbol: "META", name: "Meta", logo: "/stock-card-7.svg" },
      { symbol: "MSFT", name: "Microsoft", logo: "/stock-card-8.svg" },
      { symbol: "MCD", name: "McDonalds", logo: "/stock-card-9.svg" },
      { symbol: "VIR", name: "Vir Biotech", logo: "/stock-card-10.svg" },
      { symbol: "ADBE", name: "Adobe Inc", logo: "/stock-card-11.svg" },
      { symbol: "VRTX", name: "Vertex", logo: "/stock-card-12.svg" }
    ]
  },
  {
    containerId: 'crypto-cards',
    tickers: [
      { symbol: "BINANCE:ETHUSDT", name: "Etherium", logo: "/crypto-stock-card-1.svg" },
      { symbol: "BINANCE:BTCUSDT", name: "Bitcoin", logo: "/crypto-stock-card-2.svg" },
      { symbol: "BINANCE:SOLUSDT", name: "Solana", logo: "/crypto-stock-card-3.svg" },
      { symbol: "BINANCE:DOGEUSDT", name: "Dogecoin", logo: "/crypto-stock-card-4.svg" },
      { symbol: "BINANCE:ADAUSDT", name: "Cardano", logo: "/crypto-stock-card-5.svg" },
      { symbol: "BINANCE:XRPUSDT", name: "XRP", logo: "/crypto-stock-card-6.svg" },
      { symbol: "BINANCE:LINKUSDT", name: "Chainlink", logo: "/crypto-stock-card-7.svg" },
      { symbol: "BINANCE:LTCUSDT", name: "Litecoin", logo: "/crypto-stock-card-8.svg" },
      { symbol: "BINANCE:XLMUSDT", name: "Stellar", logo: "/crypto-stock-card-9.svg" },
      { symbol: "BINANCE:TRXUSDT", name: "TRON", logo: "/crypto-stock-card-10.svg" },
      { symbol: "BINANCE:UNIUSDT", name: "Uniswap", logo: "/crypto-stock-card-11.svg" },
      { symbol: "BINANCE:VETUSDT", name: "VeChain", logo: "/crypto-stock-card-12.svg" },
    ]
  }
];

function createSkeletons(count) {
  return Array.from({ length: count }, () => {
    const div = document.createElement("div");
    div.className = "stock-card skeleton";
    div.innerHTML = `
      <div class="skeleton-img"></div>
      <div class="skeleton-box"></div>
      <div class="skeleton-box" style="width: 60%;"></div>
    `;
    return div;
  });
}

async function renderCards(containerId, tickers) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const skeletons = createSkeletons(tickers.length);
  container.append(...skeletons);

  const cards = await Promise.all(
    tickers.map(async t => {
      const card = new StockCard({ ...t, apiKey: API_KEY });
      return card.render();
    })
  );

  container.replaceChildren(...cards);
  updateScroller(container);
}


document.addEventListener("DOMContentLoaded", async () => {
  new LanguagesSwitcher();
  new Burger();
  window._scrollerCollection = new ScrollerCollection();

  await Promise.all(blocks.map(b => renderCards(b.containerId, b.tickers)));

  new TabsCollection();
  new AccordionCollection();
  new AnimatedCounter();
});
