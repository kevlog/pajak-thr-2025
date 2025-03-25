// Fungsi untuk memulai tur menggunakan Intro.js
function mulaiTur() {
    var intro = introJs();

    intro.setOptions({
        steps: [
            {
                title: 'Selamat datang',
                intro: 'PPh 21 THR 2025 💸💰'
            },
            {
                title: 'THR',
                element: document.querySelector('#thr'),
                intro: 'Masukkan THR Kotor yang kamu terima.'
            },
            {
                title: 'TER',
                element: document.querySelector('#kategori'),
                intro: 'Sesuaikan kategori berdasarkan TER-mu. Cek <a href="https://klikpajak.id/wp-content/uploads/2024/01/Kategori-Tarif-Efektif-Bulanan.webp" rel="nofollow noindex noopener noreferrer" target="_blank" style="color:blue">di sini</a>.',
                position: 'right'
            },
            {
                title: 'TER',
                element: document.querySelector('#gaji'),
                intro: 'Masukkan Gaji Kotor yang kamu terima.',
                position: 'left'
            },
            {
                title: 'Hitung',
                element: document.querySelector('#btnHitung'),
                intro: 'Klik tombol ini untuk mulai menghitung.',
                position: 'top'
            },
            
        ],
        showProgress: true,
        tooltipClass: 'customTooltip'
      });

    intro.start();
}

// Menambahkan event listener ke tombol Mulai Tur
document.addEventListener('DOMContentLoaded', function() {
    const btnMulaiTur = document.getElementById('btnMulaiTur');
    if (btnMulaiTur) {
        btnMulaiTur.addEventListener('click', mulaiTur);
    }
});
