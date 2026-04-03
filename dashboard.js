lucide.createIcons();

// Elements
const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const addBtn = document.getElementById('addProjectBtn');
const closeBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelModalBtn');
const form = document.getElementById('projectForm');
const grid = document.getElementById('projectsGrid');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');

// State using a new key to avoid conflicts with previous format
let projects = JSON.parse(localStorage.getItem('hiwebs_projects_v4')) || [];
let editingId = null;

// Migration check from V3 to V4
const oldProjs = JSON.parse(localStorage.getItem('hiwebs_projects_v3'));
if (oldProjs && projects.length === 0) {
    projects = oldProjs.map(p => ({
        ...p,
        domain: ''
    }));
    localStorage.removeItem('hiwebs_projects_v3');
    saveProjects();
}

// Initial render
renderProjects(projects);

// Modal control
const openModal = (isEdit = false) => {
    modalTitle.textContent = isEdit ? 'Editar Proyecto' : 'Nuevo Proyecto';
    modal.classList.add('active');
};

const closeModal = () => {
    modal.classList.remove('active');
    form.reset();
    editingId = null;
    document.getElementById('c1').checked = true; // reset color
};

addBtn.addEventListener('click', () => {
    editingId = null;
    form.reset();
    openModal(false);
});
closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

// Form submit
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('pName').value;
    const client = document.getElementById('pClient').value || 'Interno';
    const url = document.getElementById('pUrl').value;
    const domain = document.getElementById('pDomain').value;
    const price = document.getElementById('pPrice').value;
    const paymentStatus = document.getElementById('pPayment').value;
    const status = document.getElementById('pStatus').value;
    const priority = document.getElementById('pPriority').value;
    const tagsRaw = document.getElementById('pTags').value;
    const desc = document.getElementById('pDesc').value;
    
    let color = '#3b82f6';
    const selectedColor = document.querySelector('input[name="pColor"]:checked');
    if(selectedColor) color = selectedColor.value;
    
    const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(t => t !== '') : [];

    if (editingId) {
        // Edit existing
        const index = projects.findIndex(p => p.id === editingId);
        if (index !== -1) {
            projects[index] = {
                ...projects[index],
                name, client, url, domain, price, paymentStatus, status, priority, tags, desc, color
            };
        }
    } else {
        // Create new
        const newProject = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('es-ES'),
            name, client, url, domain, price, paymentStatus, status, priority, tags, desc, color
        };
        projects.unshift(newProject);
    }
    
    saveProjects();
    filterAndRender();
    closeModal();
});

// Save to LocalStorage
function saveProjects() {
    localStorage.setItem('hiwebs_projects_v4', JSON.stringify(projects));
}

// Edit project
window.editProject = function(id) {
    const project = projects.find(p => p.id === id);
    if(!project) return;
    
    editingId = id;
    
    document.getElementById('pName').value = project.name;
    document.getElementById('pClient').value = project.client;
    document.getElementById('pUrl').value = project.url;
    document.getElementById('pDomain').value = project.domain || '';
    document.getElementById('pPrice').value = project.price || '';
    document.getElementById('pPayment').value = project.paymentStatus || 'Pendiente';
    document.getElementById('pStatus').value = project.status;
    document.getElementById('pPriority').value = project.priority;
    document.getElementById('pTags').value = project.tags ? project.tags.join(', ') : '';
    document.getElementById('pDesc').value = project.desc || '';
    
    // Select color
    const colorRadios = document.querySelectorAll('input[name="pColor"]');
    colorRadios.forEach(radio => {
        if(radio.value === project.color) {
            radio.checked = true;
        }
    });

    openModal(true);
}

// Delete project
window.deleteProject = function(id) {
    if(confirm('¿Seguro que quieres eliminar este proyecto?')) {
        projects = projects.filter(p => p.id !== id);
        saveProjects();
        filterAndRender();
    }
}

// Format numbers as currency
const formatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
});

// Render projects
function renderProjects(data) {
    grid.innerHTML = '';
    
    if (data.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i data-lucide="folder-search"></i>
                <h3>No hay proyectos</h3>
                <p>Agrega uno nuevo o limpia los filtros de búsqueda.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }
    
    data.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.style.setProperty('--card-color', project.color);
        
        let tagsHTML = '';
        if (project.tags && project.tags.length > 0) {
            tagsHTML = `<div class="card-tags">` + project.tags.slice(0,5).map(t => `<span class="tag">${t}</span>`).join('') + `</div>`;
        }
        
        let priceValue = '---';
        if(project.price) {
            priceValue = formatter.format(project.price);
        }

        let paymentStatusClass = 'Pendiente';
        if (project.paymentStatus === 'A Señado') paymentStatusClass = 'Seña';
        else if (project.paymentStatus === 'Pagado') paymentStatusClass = 'Pagado';
        
        let domainHTML = '';
        if(project.domain) {
            let properDomain = project.domain.startsWith('http') ? project.domain : `https://${project.domain}`;
            domainHTML = `<a href="${properDomain}" target="_blank" style="display:flex; align-items:center; gap:4px; color:var(--accent); text-decoration:none; font-size:0.85rem; font-weight:500;" title="Abrir Dominio Principal">
                <i data-lucide="globe" style="width: 14px; height: 14px;"></i> Web
            </a>`;
        }
        
        card.innerHTML = `
            <div class="card-color-bar"></div>
            <div class="card-header">
                <div class="card-title-group">
                    <h3 class="card-title">${project.name}</h3>
                    <div class="card-client"><i data-lucide="user"></i> ${project.client}</div>
                </div>
                <div class="card-actions">
                    <button class="action-btn edit" onclick="editProject('${project.id}')" title="Editar">
                        <i data-lucide="edit-3"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteProject('${project.id}')" title="Eliminar">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
            
            <div class="card-price-section">
                <div class="price-value">${priceValue}</div>
                <div class="payment-badge ${paymentStatusClass}">${project.paymentStatus || 'Pendiente'}</div>
            </div>

            <div class="card-metadata">
                <span class="badge badge-status" data-status="${project.status}">
                    <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:currentColor;"></span>
                    ${project.status}
                </span>
                <span class="badge badge-priority">
                    Pri: ${project.priority}
                </span>
            </div>

            <p class="card-desc">${project.desc || 'Sin descripción adicional.'}</p>
            
            ${tagsHTML}

            <div class="card-footer">
                <span class="date-text">${project.date || ''}</span>
                <div style="display:flex; align-items:center; gap:12px;">
                    ${domainHTML}
                    <a href="${project.url}" target="_blank" style="display:flex; align-items:center; gap:4px; color:var(--text-primary); text-decoration:none; font-size:0.85rem; font-weight:500;" title="Abrir Carpeta Local / Archivo">
                        <i data-lucide="folder-open" style="width: 14px; height: 14px;"></i> Local
                    </a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    
    lucide.createIcons();
}

function filterAndRender() {
    const term = searchInput.value.toLowerCase();
    const statusVal = statusFilter.value;

    const filtered = projects.filter(p => {
        const tagString = p.tags ? p.tags.join(' ').toLowerCase() : '';
        const matchesSearch = p.name.toLowerCase().includes(term) || p.client.toLowerCase().includes(term) || tagString.includes(term);
        const matchesStatus = statusVal === 'all' || p.status === statusVal;
        return matchesSearch && matchesStatus;
    });
    renderProjects(filtered);
}

// Search and Filter Listeners
searchInput.addEventListener('input', filterAndRender);
statusFilter.addEventListener('change', filterAndRender);
