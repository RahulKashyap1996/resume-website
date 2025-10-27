// certificates.js: Modern tabbed, auto-sliding certificate gallery
// Folder-to-tab mapping

const certData = {
  AutomationAnywhere: [
    'certificates/RPA/AutomationAnywhere/Automation Anywhere Certified Advanced RPA Professional (A2019) • Rahul Kashyap • Automation Anywhere University.pdf',
    'certificates/RPA/AutomationAnywhere/Automation Anywhere Certified Advanced RPA Professional 360-1.pdf',
    'certificates/RPA/AutomationAnywhere/Automation Anywhere Certified Advanced RPA Professional 360.pdf',
    'certificates/RPA/AutomationAnywhere/Automation Anywhere Certified Advanced RPA Professional V11.0.pdf',
    'certificates/RPA/AutomationAnywhere/Automation Anywhere Certified Master RPA Professional-1.pdf',
    'certificates/RPA/AutomationAnywhere/Automation Anywhere Certified Master RPA Professional.pdf',
    'certificates/RPA/AutomationAnywhere/Automation Anywhere.pdf',
    'certificates/RPA/AutomationAnywhere/Building Resilient Bots Using Automation 360.pdf',
  ],
  AssistEdge: [
    'certificates/RPA/Assist Edge/EdgeVerve Certified AssistEdge RPA Developer Certificate - Rahul Kashyap.pdf',
  ],
  CSharp: [
    'certificates/CSharp/c# Udemy.jpg',
    'certificates/CSharp/cSharp.pdf',
  ],
  SQL: [
    'certificates/SQL/SQL Udemy.pdf',
  ],
  Microsoft: [
    'certificates/Microsoft/AZ-900/AZ900 -Udemy.pdf',
    'certificates/Microsoft/AZ-900/AZ900 Udemy.jpg',
    'certificates/Microsoft/AZ-900/Microsoft_Certified_Professional_Certificate_0.pdf',
    'certificates/Microsoft/AZ-900/scorereport.pdf',
  ],
  English: [
    'certificates/English/Global English Level-8.pdf',
    'certificates/English/Global English level -9.pdf',
    'certificates/English/Rahul Kashyap level -10.pdf',
  ],
  Github: [
    'certificates/Github/Github.pdf',
  ],
};

// Helper: is PDF?
function isPDF(file) {
  return file.toLowerCase().endsWith('.pdf');
}
// Helper: is image?
function isImage(file) {
  return /\.(jpg|jpeg|png|gif)$/i.test(file);
}

// Render a single certificate preview (PDF or image) with error handling and loading indicator
async function renderCertPreview(file, container) {
  // Loading spinner
  const spinner = document.createElement('div');
  spinner.className = 'cert-loading-spinner';
  spinner.innerHTML = '<span>Loading...</span>';
  container.appendChild(spinner);
  try {
    if (isImage(file)) {
      const img = document.createElement('img');
      img.src = file;
      img.alt = 'Certificate';
      img.className = 'cert-preview-img';
      img.onload = () => spinner.remove();
      img.onerror = () => {
        spinner.innerHTML = '<span>Image not found</span>';
      };
      container.appendChild(img);
    } else if (isPDF(file)) {
      try {
        const pdfjsLib = window['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        const pdf = await pdfjsLib.getDocument(file).promise;
        const page = await pdf.getPage(1);
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 0.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        canvas.className = 'cert-preview-pdf';
        spinner.remove();
        container.appendChild(canvas);
      } catch (pdfErr) {
        spinner.innerHTML = '<span>PDF Preview failed</span>';
        console.error('PDF Preview Error:', pdfErr);
      }
    } else {
      spinner.innerHTML = '<span>Unsupported file type</span>';
    }
  } catch (err) {
    spinner.innerHTML = '<span>Preview failed</span>';
    console.error('Certificate Preview Error:', err);
  }
}

// Render carousel for a tab or subtab (no duplicate rendering)
async function renderCarousel(carouselId, files) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;
  
  // If already rendered, just show it and return
  if (carousel.getAttribute('data-rendered') === 'true') {
    carousel.style.display = '';
    // Hide all other carousels
    document.querySelectorAll('.cert-carousel').forEach(c => {
      if (c.id !== carouselId) {
        c.style.display = 'none';
      }
    });
    return;
  }
  
  // Clear ALL carousels completely before rendering
  document.querySelectorAll('.cert-carousel').forEach(c => {
    if (c.swiper) {
      c.swiper.destroy(true, true);
    }
    while (c.firstChild) c.removeChild(c.firstChild);
    c.removeAttribute('data-rendered');
    c.style.display = 'none';
  });
  
  // Now render the active carousel
  carousel.style.display = '';
  
  // Render new Swiper only for the active carousel
  const swiperWrapper = document.createElement('div');
  swiperWrapper.className = 'swiper-wrapper';
  for (const file of files) {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide cert-slide';
    await renderCertPreview(file, slide);
    // Add click to open modal
    slide.addEventListener('click', () => openCertModal(file));
    swiperWrapper.appendChild(slide);
  }
  carousel.appendChild(swiperWrapper);
  // Add Swiper navigation
  const nextBtn = document.createElement('div');
  nextBtn.className = 'swiper-button-next';
  const prevBtn = document.createElement('div');
  prevBtn.className = 'swiper-button-prev';
  carousel.appendChild(prevBtn);
  carousel.appendChild(nextBtn);
  // Randomize initial slide and direction
  const initialSlide = Math.floor(Math.random() * files.length);
  const reverse = Math.random() > 0.5;
  new Swiper(carousel, {
    loop: files.length > 1,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
      reverseDirection: reverse
    },
    navigation: { nextEl: nextBtn, prevEl: prevBtn },
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    centeredSlides: false,
    spaceBetween: 30,
    effect: 'slide',
    initialSlide,
    allowTouchMove: true,
    simulateTouch: true,
    freeMode: false,
    speed: 600,
  });
  carousel.setAttribute('data-rendered', 'true');
}

// Modal for full certificate view (improved UI, zoom on click)
function openCertModal(file) {
  const modal = document.getElementById('cert-modal');
  const modalContent = document.getElementById('cert-modal-content');
  modalContent.innerHTML = '';
  if (isImage(file)) {
    const img = document.createElement('img');
    img.src = file;
    img.alt = 'Certificate';
    img.style.maxWidth = '600px';
    img.style.maxHeight = '80vh';
    img.style.width = '100%';
    img.style.borderRadius = '12px';
    img.style.boxShadow = '0 8px 32px rgba(67,198,172,0.18)';
    img.style.transition = 'transform 0.3s';
    img.style.cursor = 'zoom-in';
    let zoomed = false;
    img.onclick = function() {
      zoomed = !zoomed;
      if (zoomed) {
        img.style.transform = 'scale(1.5)';
        img.style.cursor = 'zoom-out';
      } else {
        img.style.transform = 'scale(1)';
        img.style.cursor = 'zoom-in';
      }
    };
    modalContent.appendChild(img);
  } else if (isPDF(file)) {
    const iframe = document.createElement('iframe');
    iframe.src = file;
    iframe.style.width = '600px';
    iframe.style.height = '80vh';
    iframe.style.maxWidth = '90vw';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '12px';
    modalContent.appendChild(iframe);
  } else {
    modalContent.textContent = 'Unsupported file type';
  }
  modal.style.display = 'block';
}
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.cert-modal-close').onclick = function() {
    document.getElementById('cert-modal').style.display = 'none';
  };
  window.onclick = function(event) {
    if (event.target === document.getElementById('cert-modal')) {
      document.getElementById('cert-modal').style.display = 'none';
    }
  };
});

// Tab switching

function initCertCarousels() {
  // Only render the active tab/subtab's carousel
  const activeTab = document.querySelector('.cert-tab.active');
  const activeTabContent = activeTab ? document.getElementById('tab-' + activeTab.dataset.tab) : null;
  if (!activeTabContent) return;
  // If RPA, check subtab
  if (activeTab.dataset.tab === 'RPA') {
    const activeSubtab = document.querySelector('.cert-subtab.active');
    if (activeSubtab) {
      if (activeSubtab.dataset.subtab === 'AutomationAnywhere') {
        renderCarousel('carousel-AutomationAnywhere', certData.AutomationAnywhere);
      } else if (activeSubtab.dataset.subtab === 'AssistEdge') {
        renderCarousel('carousel-AssistEdge', certData.AssistEdge);
      }
    }
  } else {
    // Other tabs
    if (activeTab.dataset.tab === 'CSharp') renderCarousel('carousel-CSharp', certData.CSharp);
    if (activeTab.dataset.tab === 'SQL') renderCarousel('carousel-SQL', certData.SQL);
    if (activeTab.dataset.tab === 'Microsoft') renderCarousel('carousel-Microsoft', certData.Microsoft);
    if (activeTab.dataset.tab === 'Github') renderCarousel('carousel-Github', certData.Github);
    if (activeTab.dataset.tab === 'English') renderCarousel('carousel-English', certData.English);
  }
}

function initCertTabs() {
  document.querySelectorAll('.cert-tab').forEach(btn => {
    btn.addEventListener('click', e => {
      document.querySelectorAll('.cert-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.cert-tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
      // Clear all data-rendered attributes so carousels re-render
      document.querySelectorAll('.cert-carousel').forEach(carousel => carousel.removeAttribute('data-rendered'));
      initCertCarousels();
    });
  });
  document.querySelectorAll('.cert-subtab').forEach(btn => {
    btn.addEventListener('click', e => {
      document.querySelectorAll('.cert-subtab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.cert-subtab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('subtab-' + btn.dataset.subtab).classList.add('active');
      // Clear all data-rendered attributes so carousels re-render
      document.querySelectorAll('.cert-carousel').forEach(carousel => carousel.removeAttribute('data-rendered'));
      initCertCarousels();
    });
  });
}

function waitForLibsAndInit() {
  // Wait for Swiper and PDF.js to be loaded
  if (typeof Swiper === 'undefined' || typeof window['pdfjs-dist/build/pdf'] === 'undefined') {
    setTimeout(waitForLibsAndInit, 200);
    return;
  }
  initCertTabs();
  initCertCarousels();
}

// Render certificates only once after libs are loaded
document.addEventListener('DOMContentLoaded', () => {
  waitForLibsAndInit();
});