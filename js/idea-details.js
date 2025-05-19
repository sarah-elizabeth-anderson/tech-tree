document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const techLevel = urlParams.get('tech');
    const ideaName = decodeURIComponent(urlParams.get('idea'));

    // Update back button to return to correct tech level
    const backButton = document.querySelector('.back-button');
    backButton.href = `ideas.html?tech=${techLevel}`;

    // Find the selected idea
    const ideas = ideasData[techLevel] || [];
    const idea = ideas.find(i => i.name === ideaName);

    if (idea) {
        const ideaContent = document.querySelector('.idea-content');
        
        // Create recommendations HTML
        const adjacentIdeasHtml = idea.recommendedAdjacent && idea.recommendedAdjacent.length ? `
            <div class="recommendations">
                <h2>Recommended Adjacent Ideas</h2>
                <div class="recommended-ideas">
                    ${idea.recommendedAdjacent.map(name => {
                        // Find the idea in the current tech level
                        const adjacentIdea = ideas.find(i => i.name === name);
                        if (adjacentIdea) {
                            return `
                                <a href="idea-details.html?tech=${techLevel}&idea=${encodeURIComponent(name)}" class="recommended-idea">
                                    <img src="${adjacentIdea.image}" alt="${name}" onerror="this.src='images/placeholder.jpg'">
                                    <span>${name}</span>
                                </a>
                            `;
                        }
                        return '';
                    }).join('')}
                </div>
            </div>
        ` : '';

        const deeperIdeasHtml = idea.recommendedDeeper && idea.recommendedDeeper.length ? `
            <div class="recommendations">
                <h2>Recommended Deeper Ideas</h2>
                <div class="recommended-ideas">
                    ${idea.recommendedDeeper.map(name => {
                        // Find the idea in the next tech level
                        const nextLevelIdeas = ideasData[parseInt(techLevel) + 1] || [];
                        const deeperIdea = nextLevelIdeas.find(i => i.name === name);
                        if (deeperIdea) {
                            return `
                                <a href="idea-details.html?tech=${parseInt(techLevel) + 1}&idea=${encodeURIComponent(name)}" class="recommended-idea">
                                    <img src="${deeperIdea.image}" alt="${name}" onerror="this.src='images/placeholder.jpg'">
                                    <span>${name}</span>
                                </a>
                            `;
                        }
                        return '';
                    }).join('')}
                </div>
            </div>
        ` : '';

        ideaContent.innerHTML = `
            <img src="${idea.image}" alt="${idea.name}" onerror="this.src='images/placeholder.jpg'">
            <div class="idea-header">
                <h1>${idea.name}</h1>
                <div class="tech-level">Tech Level: ${techLevel}</div>
            </div>
            <p class="description">${idea.description}</p>
            ${adjacentIdeasHtml}
            ${deeperIdeasHtml}
        `;
        document.title = `Tech Tree - ${idea.name}`;
    } else {
        const ideaContent = document.querySelector('.idea-content');
        ideaContent.innerHTML = `
            <h1>Idea Not Found</h1>
            <p>The requested idea could not be found.</p>
        `;
    }
});
