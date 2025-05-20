document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const techLevel = urlParams.get('tech');

    // Tech level descriptions mapping
    const techDescriptions = {
        1: "Anti-Liberalism",
        2: "Mainstream Conservatism",
        3: "Accepted Conservatism",
        4: "Fringe Conservatism",
        5: "Unaccepted Conservatism",
        6: "Radical Conservatism",
        7: "Reaction",
        8: "Non-Piller Narratives",
        9: "Piller Narratives",
        10: "Independence"
    };

    const ideasGrid = document.querySelector('.ideas-grid');
    
    // Add back button
    const backButton = document.createElement('a');
    backButton.href = 'index.html';
    backButton.textContent = '← Go Back Home';
    backButton.style.display = 'block';
    backButton.style.marginBottom = '1rem';
    backButton.style.color = 'var(--text-color)';
    backButton.style.textDecoration = 'none';
    ideasGrid.parentElement.insertBefore(backButton, ideasGrid);

    // Add title and description
    const titleSection = document.createElement('div');
    titleSection.className = 'title-section';
    titleSection.innerHTML = `
        <h2>Tech ${techLevel}</h2>
        <p class="tech-description">${techDescriptions[techLevel] || ''}</p>
    `;
    ideasGrid.parentElement.insertBefore(titleSection, ideasGrid);

    // Display ideas for the selected tech level
    const ideas = ideasData[techLevel] || [];
    if (ideas.length > 0) {
        ideas.forEach(idea => {
            const ideaCard = document.createElement('a');
            ideaCard.className = 'idea-card';
            const currentPage = `ideas.html?tech=${techLevel}`;
            ideaCard.href = `idea-details.html?idea=${encodeURIComponent(idea.name)}&from=${encodeURIComponent(currentPage)}`;
            
            ideaCard.innerHTML = `
                <img src="${idea.image}" alt="${idea.name}" onerror="this.src='images/placeholder.jpg'">
                <h3>${idea.name}</h3>
            `;
            
            ideasGrid.appendChild(ideaCard);
        });
    } else {
        const message = document.createElement('p');
        message.textContent = 'No ideas available for this tech level yet.';
        message.style.textAlign = 'center';
        message.style.color = 'var(--text-color)';
        ideasGrid.appendChild(message);
    }
});
