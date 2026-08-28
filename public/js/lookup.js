const searchInput = document.querySelector('.search-product input');
const filterSelect = document.querySelector('.filter-product');

function lookup() {
    const key = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const value = filterSelect ? filterSelect.value : "all";

    const rows = document.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const searchOK = text.includes(key);

        const filter = row.dataset.filter || "";
        const filterOK = value === "all" || filter.includes(value);

        if(searchOK && filterOK) {
            row.style.display = "";
        }

        else {
            row.style.display = "none";
        }
    });
}

if(searchInput) {
    searchInput.addEventListener('input', () => {
        lookup();
    });
} 

if(filterSelect) {
    filterSelect.addEventListener('change', () => {
        lookup();
    });
}


