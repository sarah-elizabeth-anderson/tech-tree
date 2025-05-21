document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const ideaName = decodeURIComponent(urlParams.get('idea'));
    let techLevel = urlParams.get('tech');
    
    // Find the idea across all tech levels
    let idea = null;
    let foundTechLevel = techLevel;
    
    if (!ideaName) {
        console.error('No idea name provided in URL');
        window.location.href = 'index.html';
        return;
    }

    // If tech level is provided, try that first
    if (techLevel && ideasData[techLevel]) {
        idea = ideasData[techLevel].find(i => i.name === ideaName);
    }
    
    // If not found or no tech level provided, search all levels
    if (!idea) {
        for (const [level, ideas] of Object.entries(ideasData)) {
            const foundIdea = ideas.find(i => i.name === ideaName);
            if (foundIdea) {
                idea = foundIdea;
                foundTechLevel = level;
                break;
            }
        }
    }

    // Update back button to return to the previous page or ideas list
    const fromPage = urlParams.get('from') || `ideas.html?tech=${foundTechLevel}`;
    const backButton = document.querySelector('.back-button');
    backButton.href = fromPage;

    if (idea) {
        const ideaContent = document.querySelector('.idea-content');
        
        // Populate main content
        ideaContent.innerHTML = `
            <div class="idea-image-container">
                <img src="${idea.image}" alt="${idea.name}" class="idea-image" onerror="this.src='images/placeholder.jpg'">
            </div>
            <div class="idea-header">
                <h1>${idea.name}</h1>
                <div class="tech-level">Tech Level: ${foundTechLevel || 'N/A'}</div>
            </div>
            <div class="idea-description">
                <p>${idea.description}</p>
            </div>
        `;

        // Create recommendations HTML
        const recommendationsContainer = document.querySelector('.recommendations-container');
        let recommendationsHtml = '';
        
        if ((idea.recommendedAdjacent && idea.recommendedAdjacent.length) || 
            (idea.recommendedDeeper && idea.recommendedDeeper.length)) {
            recommendationsHtml = `
                <div class="recommendations">
                    ${idea.recommendedAdjacent && idea.recommendedAdjacent.length ? `
                        <h2>Recommended Adjacent Ideas</h2>
                        <div class="recommended-ideas">
                            ${idea.recommendedAdjacent.map(name => {
                                // Find the idea in any tech level
                                for (const [level, ideas] of Object.entries(ideasData)) {
                                    const adjacentIdea = ideas.find(i => i.name === name);
                                    if (adjacentIdea) {
                                        return `
                                            <a href="idea-details.html?idea=${encodeURIComponent(name)}&tech=${level}" class="recommended-idea">
                                                <img src="${adjacentIdea.image}" alt="${name}" onerror="this.src='images/placeholder.jpg'">
                                                <span>${name}</span>
                                            </a>
                                        `;
                                    }
                                }
                                return '';
                            }).join('')}
                        </div>
                    ` : ''}

                    ${idea.recommendedDeeper && idea.recommendedDeeper.length ? `
                        <h2>Recommended Deeper Ideas</h2>
                        <div class="recommended-ideas">
                            ${idea.recommendedDeeper.map(name => {
                                // Find the idea in any tech level
                                for (const [level, ideas] of Object.entries(ideasData)) {
                                    const deeperIdea = ideas.find(i => i.name === name);
                                    if (deeperIdea) {
                                        return `
                                            <a href="idea-details.html?idea=${encodeURIComponent(name)}&tech=${level}" class="recommended-idea">
                                                <img src="${deeperIdea.image}" alt="${name}" onerror="this.src='images/placeholder.jpg'">
                                                <span>${name}</span>
                                            </a>
                                        `;
                                    }
                                }
                                return '';
                            }).join('')}
                        </div>
                    ` : ''}
                </div>`;
            recommendationsContainer.innerHTML = recommendationsHtml;
        }
        document.title = `Tech Tree - ${idea.name}`;
    } else {
        const ideaContent = document.querySelector('.idea-content');
        ideaContent.innerHTML = `
            <h1>Idea Not Found</h1>
            <p>The requested idea could not be found.</p>
        `;
    }
});
