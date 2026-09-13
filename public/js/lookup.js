const searchInput = document.querySelector('.search-product input');
const filterSelect = document.querySelector('.filter-product');

function lookup() {
    const key = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const value = filterSelect ? filterSelect.value : "all";

    const rows = document.querySelectorAll('tbody tr:not(.no-result)');
    let count = 0;

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const searchOK = text.includes(key);

        const filter = row.dataset.filter || "";
        const filterOK = value === "all" || filter.includes(value);

        if(searchOK && filterOK) {
            row.style.display = "";
            count++;
        }

        else {
            row.style.display = "none";
        }
    });

    const oldMessage = document.querySelector('.no-result');

    if(oldMessage) {
        oldMessage.remove();
    }

    if(count === 0) {
        const tbody = document.querySelector('tbody');

        if(tbody) {
            const tr = document.createElement('tr');
            tr.className = 'no-result';

            tr.innerHTML = `
                <td colspan="100%">
                    <div class="no-result-content">
                        <i class="fa-solid fa-circle-exclamation"></i> Không Có Kết Quả Phù Hợp !
                    </div>
                </td>
            `;

            tbody.appendChild(tr);
        }
    }
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