// document.querySelector('.search-form').addEventListener('submit', function(e) {
//     e.preventDefault();
//     const query = this.q.value.trim().toLowerCase();
//     // Option 1: Redirect to a search results page with the query as a parameter
//     window.location.href = '/search-results.html?q=' + encodeURIComponent(query);
    
//     // Option 2: For live filtering (if your data is already on the page), you could call a function here
//     // filterContent(query);
//   });

document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.getElementById('search-form');
  
  searchForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the form from reloading the page
      
      // Get the search query from the input field
      const query = searchForm.querySelector('input[name="q"]').value.toLowerCase().trim();
      
      // Select the slider, products, and "not found" message elements
      const sliderSection = document.querySelector('.slider-section');
      const notFoundDiv = document.getElementById('not-found');
      const products = document.querySelectorAll('.product');
      
      if (query === '') {
          // If the search query is empty:
          // - Show the slider
          // - Show all products
          // - Hide the "not found" message
          sliderSection.classList.remove('hidden');
          products.forEach(product => product.classList.remove('hidden'));
          notFoundDiv.classList.add('hidden');
      } else {
          // If the search query is not empty:
          // - Hide the slider
          sliderSection.classList.add('hidden');
          
          let found = false; // Track if any products match the query
          // Filter products based on the search query
          products.forEach(product => {
              const productName = product.querySelector('h3').textContent.toLowerCase();
              if (productName.includes(query)) {
                  product.classList.remove('hidden'); // Show matching product
                  found = true;
              } else {
                  product.classList.add('hidden'); // Hide non-matching product
              }
          });
          
          // Show or hide the "not found" message based on whether matches were found
          if (found) {
              notFoundDiv.classList.add('hidden'); // Hide if there are matches
          } else {
              notFoundDiv.classList.remove('hidden'); // Show if no matches
          }
      }
  });
});

  document.addEventListener("DOMContentLoaded", function() {
    const sliderWrapper = document.querySelector(".slider-wrapper");
    const slides = document.querySelectorAll(".slide");
    const btnLeft = document.getElementById("slide-btn-left");
    const btnRight = document.getElementById("slide-btn-right");
    const indicators = document.querySelectorAll(".indicator");

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoSlideInterval;

    // Update slider transform and active indicator
    function updateSlider() {
      sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle("active", index === currentIndex);
      });
    }

    // Next slide function
    function showNextSlide() {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlider();
    }

    // Previous slide function
    function showPrevSlide() {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateSlider();
    }

    // Event listeners for navigation buttons
    btnRight.addEventListener("click", function() {
      showNextSlide();
      resetAutoSlide();
    });
    
    btnLeft.addEventListener("click", function() {
      showPrevSlide();
      resetAutoSlide();
    });

    // Event listeners for indicators
    indicators.forEach(indicator => {
      indicator.addEventListener("click", function() {
        currentIndex = parseInt(indicator.getAttribute("data-slide"));
        updateSlider();
        resetAutoSlide();
      });
    });

    // Auto-slide functionality
    function startAutoSlide() {
      autoSlideInterval = setInterval(showNextSlide, 3000);
    }

    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    }

    // Initialize slider
    updateSlider();
    startAutoSlide();
  });
  