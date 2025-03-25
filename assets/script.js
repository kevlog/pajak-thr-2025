AOS.init();

function showToast(message, type = "success") {
    const isMobile = window.innerWidth <= 768; // Anggap ≤ 768px sebagai mobile

    Toastify({
        text: message,
        duration: 3000,
        gravity: "top", // Bisa "top" atau "bottom"
        position: isMobile ? "center" : "right", // Di tengah jika mobile, kanan jika desktop
        backgroundColor: type === "success" ? "#4CAF50" : "#FF5733",
        stopOnFocus: true, // Tetap muncul saat hover
    }).showToast();
}

// Pastikan PPh THR dihitung ulang saat kategori berubah
document.getElementById("kategori").addEventListener("change", async function () {
    await new Promise(resolve => setTimeout(resolve, 50)); // Beri waktu AutoNumeric membaca input
    hitungPPhTHR(); // Pastikan PPh THR diperbarui saat kategori berubah
});

// Block event paste inputan thr -> 
document.getElementById('thr').addEventListener('paste', function (e) {
    e.preventDefault(); // Mencegah paste
     showToast("Berhasil paste dari clipboard!", "success");

    // Kosongkan input sebelum AutoNumeric menangkap nilai
    this.value = ""; 
    autoThr.set(null);
});

// Block event paste pada inputan gaji
document.getElementById('gaji').addEventListener('paste', function (e) {
    e.preventDefault(); // Mencegah paste
    showToast("Berhasil paste dari clipboard!", "success");

    // Kosongkan input sebelum AutoNumeric menangkap nilai
    this.value = ""; 
    autoGaji.set(null);
});

// Event listener untuk tombol Hitung
document.getElementById('btnHitung').addEventListener('click', async function () {
    await new Promise(resolve => setTimeout(resolve, 100)); // Pastikan nilai AutoNumeric sudah siap
    hitungPPhGaji(); // Jalankan perhitungan setelah nilai sudah benar
});

const autoGaji = new AutoNumeric("#gaji", { 
    digitGroupSeparator: ".", 
    decimalCharacter: ",", 
    currencySymbol: "Rp ", 
    unformatOnSubmit: true 
});

const autoThr = new AutoNumeric("#thr", { 
    digitGroupSeparator: ".", 
    decimalCharacter: ",", 
    currencySymbol: "Rp ", 
    unformatOnSubmit: true 
});

async function getTarifPPh(kategori, penghasilan) {
    // Pastikan penghasilan adalah angka valid
    if (isNaN(penghasilan) || penghasilan <= 0) {
        showToast("Penghasilan harus lebih dari 0!", "error");
        return 0;
    }

    try {
        const response = await fetch('assets/tarif_pph.json');
        const data = await response.json();
        
        // Pastikan kategori tidak memiliki spasi berlebih
        kategori = kategori.trim();

        const tarif = data[kategori];

        if (!tarif) {
            Swal.fire({
                icon: 'warning',
                title: 'Kategori Tidak Ditemukan',
                text: 'Kategori pajak yang dipilih tidak valid.',
            });
            return 0;
        }

        // Mencari tarif yang sesuai
        const result = tarif.find(t => penghasilan >= t.min && (t.max === null || penghasilan <= t.max));

        if (!result) {
            Swal.fire({
                icon: 'info',
                title: 'Tarif Tidak Ditemukan',
                text: 'Tarif pajak tidak tersedia untuk penghasilan ini.',
            });
            return 0;
        }

        console.log(`Kategori: ${kategori}, Penghasilan: ${penghasilan}, Tarif: ${result.rate}`);
        return result.rate;
    } catch (error) {
        console.error("Error fetching tax rates:", error);
        Swal.fire({
            icon: 'error',
            title: 'Gagal Mengambil Data',
            text: 'Terjadi kesalahan saat mengambil data tarif pajak. Coba lagi nanti.',
        });
        return 0;
    }
}

async function hitungPPhTHR() {
    let thr = autoThr.getNumber() || 0;
    let kategori = document.getElementById('kategori').value;
    let tarif = await getTarifPPh(kategori, thr);
    let pphTHR = thr * tarif;
    
    document.getElementById('hasilTHR').innerText = `PPh 21 dari THR: Rp ${pphTHR.toLocaleString('id-ID')}`;
    document.getElementById('hasilTHR').setAttribute("data-pphTHR", pphTHR);
}

async function hitungPPhGaji() {
    let gaji = autoGaji.getNumber() || 0;
    let thr = autoThr.getNumber() || 0;
    
    let kategori = document.getElementById('kategori').value;
    let totalPenghasilan = thr + gaji;
    console.log("Total Penghasilan" + totalPenghasilan);
    
    let tarifTotal = await getTarifPPh(kategori, totalPenghasilan);
    let pphTotal = totalPenghasilan * tarifTotal;
    let pphTHR = parseFloat(document.getElementById('hasilTHR').getAttribute("data-pphTHR")) || 0;
    let totalPPhGaji = pphTotal - pphTHR;
    
    document.getElementById('hasilGaji').innerText = `PPh 21 Gaji Bulanan setelah THR: Rp ${totalPPhGaji.toLocaleString('id-ID')}`;
    showToast("Total Pajak PPh 21: Rp " + totalPPhGaji.toLocaleString('id-ID'), "success");
}

particlesJS("particles-js", {
    particles: {
        number: { value: 80 },
        size: { value: 3 },
        move: { speed: 2 }
    }
});