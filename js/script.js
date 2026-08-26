document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Menu Toggle
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
        });
    }

    // 2. Fetch and Filter Staff Data
    let staffData = [];
    const directoryGrid = document.getElementById("directory-grid");
    const searchInput = document.getElementById("search-input");
    const gradeFilter = document.getElementById("grade-filter");

    async function loadDirectory() {
        try {
            const response = await fetch("data/staff.json");
            staffData = await response.json();
            renderDirectory(staffData);
        } catch (error) {
            console.error("Gagal memuatkan data direktori:", error);
            if (directoryGrid) {
                directoryGrid.innerHTML = `<p class="text-red-500 col-span-full text-center">Ralat semasa memuatkan maklumat kakitangan.</p>`;
            }
        }
    }

    function renderDirectory(data) {
        if (!directoryGrid) return;
        directoryGrid.innerHTML = "";

        if (data.length === 0) {
            directoryGrid.innerHTML = `
                <div class="col-span-full text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <i class="fa-solid fa-user-slash text-3xl text-slate-400 mb-2"></i>
                    <p class="text-slate-500 font-medium text-sm">Tiada maklumat kakitangan ditemui.</p>
                </div>`;
            return;
        }

        data.forEach(item => {
            const card = document.createElement("div");
            card.className = "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between group";
            
            // Format phone number formatting for WhatsApp direct click
            const formattedPhone = item.telefon ? item.telefon.replace(/\s+/g, '') : '';
            
            card.innerHTML = `
                <div>
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 bg-gradient-to-tr from-slate-800 to-slate-700 text-white rounded-xl flex items-center justify-center font-extrabold text-base shadow-sm group-hover:bg-blue-600 transition-colors">
                            ${item.nama.charAt(0)}
                        </div>
                        <span class="bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-1 rounded-lg border border-blue-200/60">
                            ${item.gred}
                        </span>
                    </div>

                    <h4 class="font-bold text-slate-900 text-sm leading-snug mb-1 group-hover:text-blue-600 transition-colors">${item.nama}</h4>
                    <p class="text-xs font-semibold text-slate-500 mb-4">${item.jawatan}</p>
                </div>

                <div class="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-600">
                    ${item.email ? `
                        <a href="mailto:${item.email}" class="flex items-center space-x-2 hover:text-blue-600 transition truncate">
                            <i class="fa-solid fa-envelope text-slate-400 w-4"></i>
                            <span class="truncate">${item.email}</span>
                        </a>` : ''}
                    
                    ${item.telefon ? `
                        <a href="https://wa.me/${formattedPhone.replace(/^0/, '60')}" target="_blank" class="flex items-center space-x-2 hover:text-emerald-600 transition">
                            <i class="fa-solid fa-phone text-slate-400 w-4"></i>
                            <span>${item.telefon}</span>
                        </a>` : ''}
                </div>
            `;
            directoryGrid.appendChild(card);
        });
    }

    function filterData() {
        const query = searchInput ? searchInput.value.toLowerCase() : "";
        const selectedGrade = gradeFilter ? gradeFilter.value : "ALL";

        const filtered = staffData.filter(item => {
            const matchesQuery = item.nama.toLowerCase().includes(query) ||
                                 item.jawatan.toLowerCase().includes(query) ||
                                 item.gred.toLowerCase().includes(query);

            let matchesGrade = true;
            if (selectedGrade === "JURUTERA") {
                matchesGrade = item.jawatan.includes("JURUTERA") || item.jawatan.includes("PENGARAH");
            } else if (selectedGrade === "PENOLONG") {
                matchesGrade = item.jawatan.includes("PENOLONG JURUTERA");
            } else if (selectedGrade === "PELUKIS") {
                matchesGrade = item.jawatan.includes("PELUKIS PELAN");
            } else if (selectedGrade === "SOKONGAN") {
                matchesGrade = !item.jawatan.includes("JURUTERA") && !item.jawatan.includes("PELUKIS PELAN") && !item.jawatan.includes("PENGARAH");
            }

            return matchesQuery && matchesGrade;
        });

        renderDirectory(filtered);
    }

    if (searchInput) searchInput.addEventListener("input", filterData);
    if (gradeFilter) gradeFilter.addEventListener("change", filterData);

    loadDirectory();
});