document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Menu Toggle
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    menuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
    });

    // 2. Fetch and Render Directory
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
            directoryGrid.innerHTML = `<p class="text-red-500 col-span-full">Ralat memuatkan senarai direktori.</p>`;
        }
    }

    function renderDirectory(data) {
        directoryGrid.innerHTML = "";
        if (data.length === 0) {
            directoryGrid.innerHTML = `<p class="text-slate-500 col-span-full">Tiada rekod dijumpai.</p>`;
            return;
        }

        data.forEach(item => {
            const card = document.createElement("div");
            card.className = "bg-white p-5 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition";
            card.innerHTML = `
                <div class="flex items-center space-x-3 mb-3">
                    <div class="w-10 h-10 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center font-bold">
                        ${item.nama.charAt(0)}
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-900 leading-snug">${item.nama}</h4>
                        <p class="text-xs text-blue-600 font-medium">${item.jawatan}</p>
                    </div>
                </div>
                <div class="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                    <p><i class="fa-solid fa-layer-group w-4"></i> ${item.seksyen}</p>
                    <p><i class="fa-solid fa-envelope w-4"></i> ${item.email}</p>
                    <p><i class="fa-solid fa-phone w-4"></i> ${item.telefon}</p>
                </div>
            `;
            directoryGrid.appendChild(card);
        });
    }

    // 3. Live Search Filter
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = staffData.filter(item => 
            item.nama.toLowerCase().includes(query) ||
            item.jawatan.toLowerCase().includes(query) ||
            item.seksyen.toLowerCase().includes(query)
        );
        renderDirectory(filtered);
    });

    loadDirectory();
});