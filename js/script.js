document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
        });
    }

    let staffData = [];
    const directoryGrid = document.getElementById("directory-grid");
    const searchInput = document.getElementById("search-input");

    async function loadDirectory() {
        try {
            const response = await fetch("data/staff.json");
            staffData = await response.json();
            renderDirectory(staffData);
        } catch (error) {
            console.error("Gagal memuatkan data direktori:", error);
            if (directoryGrid) {
                directoryGrid.innerHTML = `<p class="text-red-500 col-span-full">Ralat memuatkan senarai direktori.</p>`;
            }
        }
    }

    function renderDirectory(data) {
        if (!directoryGrid) return;
        directoryGrid.innerHTML = "";
        
        if (data.length === 0) {
            directoryGrid.innerHTML = `<p class="text-slate-500 col-span-full">Tiada rekod dijumpai.</p>`;
            return;
        }

        data.forEach(item => {
            const card = document.createElement("div");
            card.className = "bg-white p-5 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between";
            card.innerHTML = `
                <div>
                    <div class="flex items-start justify-between mb-3">
                        <div class="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                            ${item.nama.charAt(0)}
                        </div>
                        <span class="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-1 rounded border border-slate-200">
                            ${item.gred}
                        </span>
                    </div>
                    <h4 class="font-bold text-slate-900 text-sm leading-snug mb-1">${item.nama}</h4>
                    <p class="text-xs text-blue-600 font-medium mb-3">${item.jawatan}</p>
                </div>
                <div class="text-xs text-slate-500 space-y-1.5 pt-3 border-t border-slate-100">
                    <p class="flex items-center gap-2">
                        <i class="fa-solid fa-envelope text-slate-400 w-4"></i> 
                        <a href="mailto:${item.email}" class="hover:underline text-slate-600 truncate">${item.email}</a>
                    </p>
                    <p class="flex items-center gap-2">
                        <i class="fa-solid fa-phone text-slate-400 w-4"></i> 
                        <span class="text-slate-600">${item.telefon}</span>
                    </p>
                </div>
            `;
            directoryGrid.appendChild(card);
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = staffData.filter(item => 
                item.nama.toLowerCase().includes(query) ||
                item.jawatan.toLowerCase().includes(query) ||
                item.gred.toLowerCase().includes(query)
            );
            renderDirectory(filtered);
        });
    }

    loadDirectory();
});