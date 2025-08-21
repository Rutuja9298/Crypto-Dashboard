let chart;

async function getCryptoData() {
  const crypto = document.getElementById("cryptoInput").value.toLowerCase();
  if (!crypto) return alert("Please enter a cryptocurrency name!");

  try {
    // Fetch current price
    const priceRes = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd`
    );
    const priceData = await priceRes.json();

    if (!priceData[crypto]) {
      alert("Cryptocurrency not found!");
      return;
    }

    document.getElementById("cryptoName").innerText =
      crypto.charAt(0).toUpperCase() + crypto.slice(1);
    document.getElementById("cryptoPrice").innerText =
      "💰 Price: $" + priceData[crypto].usd;

    // Fetch last 7 days price data
    const chartRes = await fetch(
      `https://api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=usd&days=7`
    );
    const chartData = await chartRes.json();

    const prices = chartData.prices.map((p) => p[1]);
    const dates = chartData.prices.map((p) =>
      new Date(p[0]).toLocaleDateString()
    );

    // Draw chart
    const ctx = document.getElementById("priceChart").getContext("2d");
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Price (USD)",
            data: prices,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59,130,246,0.2)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  } catch (error) {
    alert("Error fetching data. Try again!");
  }
}
