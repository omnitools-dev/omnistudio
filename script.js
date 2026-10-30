// Tab Switching Logic
function switchTab(tabName) {
    document.querySelectorAll('main > section').forEach(sec => sec.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'bg-red-600', 'bg-emerald-600', 'text-white');
        btn.classList.add('text-slate-400', 'hover:text-white', 'hover:bg-slate-700/50');
    });

    document.getElementById(`section-${tabName}`).classList.remove('hidden');
    const activeBtn = document.getElementById(`tab-${tabName}`);
    activeBtn.classList.remove('text-slate-400', 'hover:text-white', 'hover:bg-slate-700/50');
    
    if (tabName === 'image') activeBtn.classList.add('bg-blue-600', 'text-white');
    if (tabName === 'pdf') activeBtn.classList.add('bg-red-600', 'text-white');
    if (tabName === 'utilities') activeBtn.classList.add('bg-emerald-600', 'text-white');
}

// Admin Mode Toggle Logic
function toggleAdminMode() {
    let isAdmin = localStorage.getItem('omni_admin') === 'true';
    isAdmin = !isAdmin;
    localStorage.setItem('omni_admin', isAdmin);
    updateAdminUI();
}

function updateAdminUI() {
    const isAdmin = localStorage.getItem('omni_admin') === 'true';
    const btn = document.getElementById('adminToggleBtn');
    const icon = document.getElementById('adminIcon');
    const text = document.getElementById('adminText');

    if (isAdmin) {
        btn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all";
        icon.innerText = "👑";
        text.innerText = "Admin Mode";
    } else {
        btn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 bg-slate-700/50 text-slate-300 border border-slate-600 transition-all";
        icon.innerText = "🔒";
        text.innerText = "Public Mode";
    }
}

// Image Editor Logic
let imageLoaded = false;
const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
let imgOriginal = new Image();

if (imageInput) {
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                imgOriginal.onload = function() {
                    canvas.width = imgOriginal.width;
                    canvas.height = imgOriginal.height;
                    ctx.drawImage(imgOriginal, 0, 0);
                    canvas.classList.remove('hidden');
                    document.getElementById('imagePlaceholder').classList.add('hidden');
                    imageLoaded = true;
                    applyFilters();
                }
                imgOriginal.src = event.target.result;
            }
            reader.readAsDataURL(file);
        }
    });
}

function applyFilters() {
    if (!imageLoaded) return;
    const brightness = document.getElementById('brightness').value;
    const contrast = document.getElementById('contrast').value;
    const grayscale = document.getElementById('grayscale').value;

    document.getElementById('valBrightness').innerText = brightness + '%';
    document.getElementById('valContrast').innerText = contrast + '%';
    document.getElementById('valGrayscale').innerText = grayscale + '%';

    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%)`;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgOriginal, 0, 0);
}

['brightness', 'contrast', 'grayscale'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', applyFilters);
});

function downloadImage() {
    if (!imageLoaded) return alert('Please upload an image first!');
    const link = document.createElement('a');
    link.download = 'edited-omnistudio.png';
    link.href = canvas.toDataURL();
    link.click();
}

// PDF Tools Logic
const pdfInput = document.getElementById('pdfInput');
if (pdfInput) {
    pdfInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            document.getElementById('pdfFileName').innerText = file.name;
            document.getElementById('pdfFileSize').innerText = `Size: ${(file.size / 1024).toFixed(1)} KB`;
            document.getElementById('pdfInfo').classList.remove('hidden');
        }
    });
}

// QR Code Generator Logic
function generateQR() {
    const text = document.getElementById('qrText').value;
    if (!text) return alert('Please enter text or URL!');
    const qrImage = document.getElementById('qrImage');
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(text)}`;
    document.getElementById('qrCodeContainer').classList.remove('hidden');
}

window.onload = () => { updateAdminUI(); };
