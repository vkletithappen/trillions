class StockCard {
  constructor({ symbol, name, logo, apiKey }) {
    this.symbol = symbol;
    this.name = name;
    this.logo = logo;
    this.apiKey = apiKey;
    this.element = document.createElement("div");
    this.element.className = "stock-card";
  }

  async fetchQuote() {
    const url = `https://finnhub.io/api/v1/quote?symbol=${this.symbol}&token=${this.apiKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Ошибка запроса для ${this.symbol}`);
    return res.json();
  }

  async render() {
    try {
      const data = await this.fetchQuote();
      this.element.innerHTML = `
        <div class="stock-card__img">
          <img src="${this.logo}" width="64" height="64" loading="lazy">
        </div>
        <span class="stock-card__company">${this.name}</span>
        <div class="stock-card__quotes">
          <span class="stock-card__price">$${data.c.toFixed(2)}</span>
          <span class="stock-card__change ${data.d >= 0 ? "" : "stock-card__change--negative"}">
            ${data.d >= 0 ? "+" : ""}${data.dp.toFixed(2)} %
          </span>
        </div>
      `;
      return this.element;
    } catch (e) {
      console.error(e);
      this.element.innerHTML = `<p>Ошибка загрузки ${this.name}</p>`;
      return this.element;
    }
  }
}

export default StockCard;
