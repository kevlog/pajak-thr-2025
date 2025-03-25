AOS.init();

async function getTarifPPh(kategori, penghasilan) {
    const response = await fetch('assets/tarif_pph.json');
    const data = await response.json();
    const tarif = data[kategori];
    return tarif.find(t => penghasilan >= t.min && (t.max === null || penghasilan <= t.max)).rate;
}

async function hitungPPhTHR() {
    let thr = parseFloat(document.getElementById('thr').value) || 0;
    let kategori = document.getElementById('kategori').value;
    let tarif = await getTarifPPh(kategori, thr);
    let pphTHR = thr * tarif;
    
    document.getElementById('hasilTHR').innerText = `PPh 21 dari THR: Rp ${pphTHR.toLocaleString('id-ID')}`;
    document.getElementById('hasilTHR').setAttribute("data-pphTHR", pphTHR);
}

async function hitungPPhGaji() {
    let thr = parseFloat(document.getElementById('thr').value) || 0;
    let gaji = parseFloat(document.getElementById('gaji').value) || 0;
    let kategori = document.getElementById('kategori').value;
    let totalPenghasilan = thr + gaji;
    
    let tarifTotal = await getTarifPPh(kategori, totalPenghasilan);
    let pphTotal = totalPenghasilan * tarifTotal;
    let pphTHR = parseFloat(document.getElementById('hasilTHR').getAttribute("data-pphTHR")) || 0;
    let totalPPhGaji = pphTotal - pphTHR;
    
    document.getElementById('hasilGaji').innerText = `PPh 21 Gaji Bulanan setelah THR: Rp ${totalPPhGaji.toLocaleString('id-ID')}`;
}

particlesJS("particles-js", {
    particles: {
        number: { value: 80 },
        size: { value: 3 },
        move: { speed: 2 }
    }
});