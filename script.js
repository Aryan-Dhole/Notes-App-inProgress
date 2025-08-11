const titleInput = document.getElementById("noteTitle")
const tagInput = document.getElementById("noteTags")
const contentInput = document.getElementById("noteContent")
const addBtn = document.getElementById("addNoteBtn")


let notes = JSON.parse(localStorage.getItem('notes')) || [];
renderNotes();


addBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const tags = tagInput.value.trim().split(",").map(t => t.trim()).filter(t => t);
    const content = contentInput.value.trim();

    if (!title || !content) {
        alert("Title and content is required");
        return;
    }

    const newNote = {
        title,
        tags,
        content,
        date: new Date().toLocaleString()
    };

    // single push + single save + single render
    notes.push(newNote);
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();

    // clear inputs
    titleInput.value = "";
    tagInput.value = "";
    contentInput.value = "";
});

function renderNotes() {
    const container = document.getElementById("notesContainer");
    container.innerHTML = "";

    notes.forEach((note, index) => {
        const noteCard = document.createElement("div");
        noteCard.className = "col-md-4 mb-3";

        // use template but avoid injecting unescaped HTML (simple escape below)
        noteCard.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${escapeHtml(note.title)}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${note.tags.join(', ')}</h6>
          <p class="card-text">${escapeHtml(note.content)}</p>
        </div>
        <div class="card-footer d-flex justify-content-between align-items-center">
          <small class="text-muted">${note.date}</small>
          <div>
            <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">Delete</button>
          </div>
        </div>
      </div>
    `;

        container.appendChild(noteCard);
    });

    // Attach delete handlers (after DOM created)
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idx = Number(e.currentTarget.dataset.index);
            notes.splice(idx, 1);
            localStorage.setItem('notes', JSON.stringify(notes));
            renderNotes();
        });
    });
}

// small helper to avoid XSS / broken HTML when injecting text
function escapeHtml(str) {
    if (!str) return "";
    return str
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


