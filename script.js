// Travel Data
const travelData = {
  beach: [
    {
      id: "beach1",
      title: "Maldives",
      img: "images/beach1.jpeg",
      desc: "Relax at Maldives - crystal clear waters & white sand.",
      details: "The Maldives offers luxury resorts, diving spots, and breathtaking ocean views."
    },
    {
      id: "beach2",
      title: "Goa",
      img: "images/beach2.jpeg",
      desc: "Experience Goa - vibrant beaches & nightlife.",
      details: "Goa is famous for its beaches, Portuguese heritage, seafood, and nightlife."
    }
  ],
  temple: [
    {
      id: "temple1",
      title: "Angkor Wat",
      img: "images/temple1.jpeg",
      desc: "Visit Angkor Wat in Cambodia – a UNESCO World Heritage site.",
      details: "Angkor Wat is the largest religious monument in the world, rich with history and culture."
    },
    {
      id: "temple2",
      title: "Golden Temple",
      img: "images/temple2.jpeg",
      desc: "Explore Golden Temple in Amritsar, India.",
      details: "The Golden Temple is a sacred Sikh shrine known for its golden dome and spiritual atmosphere."
    }
  ],
  country: [
    {
      id: "country1",
      title: "Japan",
      img: "images/country1.jpg",
      desc: "Japan – a blend of tradition, temples, and modern tech.",
      details: "Japan offers cherry blossoms, advanced cities, and serene temples."
    },
    {
      id: "country2",
      title: "Italy",
      img: "images/country2.jpeg",
      desc: "Italy – rich history, cuisine, and stunning coastlines.",
      details: "Italy is known for Rome, Venice, Florence, and delicious Italian food."
    }
  ]
};

// Favorites handling
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}
function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}
function toggleFavorite(itemId) {
  let favorites = getFavorites();
  if (favorites.includes(itemId)) {
    favorites = favorites.filter(fav => fav !== itemId);
  } else {
    favorites.push(itemId);
  }
  saveFavorites(favorites);
  renderRecommendations(document.getElementById("category")?.value || "all", document.getElementById("search")?.value || "");
  loadFavoritesPage();
}
function isFavorite(itemId) {
  return getFavorites().includes(itemId);
}

// Render recommendations
function renderRecommendations(category, searchTerm = "") {
  const container = document.getElementById("recommendations");
  if (!container) return;
  container.innerHTML = "";

  let categories = category === "all" ? Object.keys(travelData) : [category];

  categories.forEach(cat => {
    let results = travelData[cat].filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (results.length > 0) {
      const section = document.createElement("div");
      section.classList.add("recommendation");

      const title = document.createElement("h2");
      title.textContent =
        cat === "beach" ? "🏖️ Beach Escapes" :
        cat === "temple" ? "⛩️ Spiritual Temples" : "🌍 Explore by Country";

      const gallery = document.createElement("div");
      gallery.classList.add("gallery");

      results.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        const img = document.createElement("img");
        img.src = item.img;
        img.alt = item.title;
        img.addEventListener("click", () => {
          window.location.href = `destination.html?id=${item.id}`;
        });

        const p = document.createElement("p");
        p.textContent = item.desc;

        const favBtn = document.createElement("button");
        favBtn.classList.add("fav-btn");
        favBtn.textContent = isFavorite(item.id) ? "★ Remove" : "☆ Save";
        favBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleFavorite(item.id);
        });

        card.appendChild(img);
        card.appendChild(p);
        card.appendChild(favBtn);
        gallery.appendChild(card);
      });

      section.appendChild(title);
      section.appendChild(gallery);
      container.appendChild(section);
    }
  });

  if (container.innerHTML === "") {
    container.innerHTML = "<p>No destinations found. Try another search.</p>";
  }
}

// Destination page
function loadDestinationPage() {
  const container = document.getElementById("destinationDetails");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  let destination;
  Object.values(travelData).forEach(list => {
    list.forEach(item => {
      if (item.id === id) destination = item;
    });
  });

  if (destination) {
    container.innerHTML = `
      <h1>${destination.title}</h1>
      <img src="${destination.img}" alt="${destination.title}" class="detail-img">
      <p>${destination.details}</p>
      <button class="fav-btn" onclick="toggleFavorite('${destination.id}')">
        ${isFavorite(destination.id) ? "★ Remove from Favorites" : "☆ Save to Favorites"}
      </button>
      <br><br>
      <a href="index.html" class="back-btn">⬅ Back to Recommendations</a>
    `;
  } else {
    container.innerHTML = "<p>Destination not found.</p>";
  }
}

// Favorites page
function loadFavoritesPage() {
  const container = document.querySelector("#favoritesList .gallery");
  if (!container) return;
  container.innerHTML = "";

  const favorites = getFavorites();
  if (favorites.length === 0) {
    container.innerHTML = "<p>No favorites saved yet.</p>";
    return;
  }

  favorites.forEach(id => {
    let destination;
    Object.values(travelData).forEach(list => {
      list.forEach(item => {
        if (item.id === id) destination = item;
      });
    });

    if (destination) {
      const card = document.createElement("div");
      card.classList.add("card");
      card.addEventListener("click", () => {
        window.location.href = `destination.html?id=${destination.id}`;
      });

      const img = document.createElement("img");
      img.src = destination.img;
      img.alt = destination.title;

      const p = document.createElement("p");
      p.textContent = destination.title;

      const favBtn = document.createElement("button");
      favBtn.classList.add("fav-btn");
      favBtn.textContent = "★ Remove";
      favBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorite(destination.id);
      });

      card.appendChild(img);
      card.appendChild(p);
      card.appendChild(favBtn);
      container.appendChild(card);
    }
  });
}

// On Page Load
document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.getElementById("category");
  const searchBox = document.getElementById("search");

  if (dropdown && searchBox) {
    renderRecommendations("all");
    dropdown.addEventListener("change", () => {
      renderRecommendations(dropdown.value, searchBox.value);
    });
    searchBox.addEventListener("input", () => {
      renderRecommendations(dropdown.value, searchBox.value);
    });
  }

  loadDestinationPage();
  loadFavoritesPage();

  // Contact Form
  const form = document.getElementById("contactForm");
  if (form) {
    const msg = document.getElementById("formMsg");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      msg.textContent = "Thank you! Your message has been sent.";
      msg.style.color = "green";
      form.reset();
    });
  }
});