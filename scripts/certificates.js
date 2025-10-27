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
    } else {
      spinner.innerHTML = '<span>Unsupported file type</span>';
    }
  } catch (err) {
    spinner.innerHTML = '<span>Preview failed</span>';
  }
}

// Render carousel for a tab or subtab
async function renderCarousel(carouselId, files) {
  const carousel = document.getElementById(carouselId);
  carousel.innerHTML = '';
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
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
      reverseDirection: reverse
    },
    navigation: { nextEl: nextBtn, prevEl: prevBtn },
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 30,
    effect: 'slide',
    initialSlide,
  });
}

// Modal for full certificate view
function openCertModal(file) {
  const modal = document.getElementById('cert-modal');
  const modalContent = document.getElementById('cert-modal-content');
  modalContent.innerHTML = '';
  if (isImage(file)) {
    const img = document.createElement('img');
    img.src = file;
    img.alt = 'Certificate';
    img.style.maxWidth = '90vw';
    img.style.maxHeight = '80vh';
    modalContent.appendChild(img);
  } else if (isPDF(file)) {
    const iframe = document.createElement('iframe');
    iframe.src = file;
    iframe.style.width = '90vw';
    iframe.style.height = '80vh';
    iframe.style.border = 'none';
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
  renderCarousel('carousel-CSharp', certData.CSharp);
  renderCarousel('carousel-SQL', certData.SQL);
  renderCarousel('carousel-Microsoft', certData.Microsoft);
  renderCarousel('carousel-Github', certData.Github);
  renderCarousel('carousel-English', certData.English);
  renderCarousel('carousel-AutomationAnywhere', certData.AutomationAnywhere);
  renderCarousel('carousel-AssistEdge', certData.AssistEdge);
}

function initCertTabs() {
  document.querySelectorAll('.cert-tab').forEach(btn => {
    btn.addEventListener('click', e => {
      document.querySelectorAll('.cert-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.cert-tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });
  document.querySelectorAll('.cert-subtab').forEach(btn => {
    btn.addEventListener('click', e => {
      document.querySelectorAll('.cert-subtab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.cert-subtab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('subtab-' + btn.dataset.subtab).classList.add('active');
    });
  });
}

function waitForLibsAndInit() {
  // Wait for Swiper and PDF.js to be loaded
  if (typeof Swiper === 'undefined' || typeof window['pdfjs-dist/build/pdf'] === 'undefined') {
    setTimeout(waitForLibsAndInit, 200);
    return;
  }
  initCertCarousels();
  initCertTabs();
}

document.addEventListener('DOMContentLoaded', waitForLibsAndInit);