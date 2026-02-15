async function predict() {
    const data = {
        Total_Session: parseFloat(document.getElementById("Total_Session").value),
        Total_Action: parseFloat(document.getElementById("Total_Action").value),
        search: parseFloat(document.getElementById("search").value),
        add_to_cart: parseFloat(document.getElementById("add_to_cart").value),
        add_to_wishlist: parseFloat(document.getElementById("add_to_wishlist").value),
        Recency: parseFloat(document.getElementById("Recency").value),
        Total_Spent: parseFloat(document.getElementById("Total_Spent").value),
        Avg_Spent_Per_Session: parseFloat(document.getElementById("Avg_Spent_Per_Session").value)
    };

    const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    const probability = result.probability;
    const percentage = Math.round(probability * 100);

    const card = document.getElementById("result-card");
    const badge = document.getElementById("risk-badge");
    const fill = document.getElementById("probability-fill");
    const text = document.getElementById("probability-text");
    const recommendation = document.getElementById("recommendation");

    card.style.display = "block";
    fill.style.width = percentage + "%";
    text.innerText = percentage + "% Probability";

    if (probability >= 0.7) {
        badge.innerText = "High Potential Buyer";
        badge.className = "badge high";
        recommendation.innerText =
            "Recommended action: Send loyalty rewards and personalized promotions.";
    }
    else if (probability >= 0.4) {
        badge.innerText = "Medium Potential";
        badge.className = "badge medium";
        recommendation.innerText =
            "Recommended action: Use retargeting and limited-time discounts.";
    }
    else {
        badge.innerText = "Low Conversion Risk";
        badge.className = "badge low";
        recommendation.innerText =
            "Recommended action: Apply re-engagement campaigns.";
    }
}